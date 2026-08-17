require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');

const crypto = require('crypto');

const app = express();

// Render sits behind a proxy — needed so express-rate-limit reads the real client IP, not Render's.
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: ['https://core-by-carnelian.onrender.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '25mb' })); // Parses incoming JSON requests (evidence uploads carry base64 files)

// ── Shared client key (public routes only) ──
// The frontend sends this on every public call so a random script/curl user
// can't hit these endpoints without also having the key baked into the
// frontend build. This is NOT strong security — anyone who reads the
// frontend bundle can find the key — but it filters out casual scripted
// abuse and anything that isn't your actual site making the call.
// Set CLIENT_API_KEY in Render env vars for both frontend (build-time,
// injected as REACT_APP_CLIENT_KEY or similar) and backend (runtime).
const CLIENT_API_KEY = process.env.CLIENT_API_KEY || '';
const requireClientKey = (req, res, next) => {
  if (!CLIENT_API_KEY) return next(); // fails open if not configured, so this doesn't break local dev
  const key = req.headers['x-client-key'] || '';
  if (key !== CLIENT_API_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

// ── Rate limiting (public endpoints) ──
// Submission and validation endpoints are open by design (the public
// assessment flow needs them), so they're the ones worth throttling per IP.
// IMPORTANT: batch cohorts (e.g. an HBL intake of 100+ people) often sit on
// one shared office network, meaning your server sees them all as ONE IP.
// These ceilings are set well above a full group sitting together in one
// session, so only a scripted flood ever trips them.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 400,                 // comfortably covers a 100+ participant cohort submitting together, with room to spare
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this address. Please try again later.' },
});
const validateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 min
  max: 150,                 // batch-code lookups happen a few times per person (typing, blur, retries) — scaled with submitLimiter
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});
const evidenceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,                 // ~25 evidence calls per person in the Player Report x a full cohort, plus margin
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});
// A loose global limiter as a backstop across every route, admin included —
// generous enough not to bother real usage, tight enough to blunt a scraper.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ── Admin auth (token = expiry + HMAC signed with ADMIN_PASSWORD) ──
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const signExp = exp => crypto.createHmac('sha256', ADMIN_PASSWORD).update(String(exp)).digest('hex');
const makeToken = () => { const exp = Date.now() + 12 * 60 * 60 * 1000; return `${exp}.${signExp(exp)}`; };
const isAdmin = (req) => {
  if (!ADMIN_PASSWORD) return false;
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signExp(exp)), Buffer.from(sig));
  } catch (e) { return false; }
};
const requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  next();
};

// ── Batch code generation: fiscal quarter (Jul–Sep Q1, Oct–Dec Q2, Jan–Mar Q3, Apr–Jun Q4), calendar year label, counter resets per quarter ──
const fiscalQuarter = (d) => { const m = d.getMonth(); return (m >= 6 && m <= 8) ? 1 : (m >= 9) ? 2 : (m <= 2) ? 3 : 4; };
const generateBatchCode = async () => {
  const now = new Date();
  const q = fiscalQuarter(now), y = now.getFullYear();
  const like = `Q${q}-%-${y}`;
  const r = await pool.query(
    `SELECT code FROM batches WHERE code LIKE $1
     UNION
     SELECT DISTINCT batch AS code FROM assessments WHERE batch LIKE $1`, [like]);
  let max = 0;
  r.rows.forEach(row => {
    const m = /^Q[1-4]-(\d{3})-\d{4}$/.exec(row.code || '');
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `Q${q}-${String(max + 1).padStart(3, '0')}-${y}`;
};

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test DB Connection and Create Table if it doesn't exist
pool.connect()
  .then(async () => {
    console.log('✅ Connected to PostgreSQL database');
    
    // Auto-create the table with the new v3.0 fields (added phone)
     const createTableQuery = `
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        doc_id VARCHAR(255),
        assessment_type VARCHAR(50),
        phone VARCHAR(255),
        name VARCHAR(255),
        email VARCHAR(255),
        department VARCHAR(255),
        role VARCHAR(255),
        industry VARCHAR(255),
        batch VARCHAR(255),
        purpose VARCHAR(255),
        level VARCHAR(255),
        overall_score NUMERIC,
        profile_name VARCHAR(255),
        report_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Safely attempt to add new columns in case the table already existed from older versions
    try {
      await pool.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS batch VARCHAR(255);`);
      await pool.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS purpose VARCHAR(255);`);
      await pool.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS level VARCHAR(255);`);
      await pool.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS phone VARCHAR(255);`);
      await pool.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50);`);
    } catch (alterErr) {
      console.log('Columns already exist or alter skipped.');
    }

    console.log('✅ Assessments table is ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        org VARCHAR(255) NOT NULL,
        entitlements JSONB NOT NULL DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(30) NOT NULL,
        title VARCHAR(255),
        body TEXT,
        batch VARCHAR(50),
        doc_id VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Batches and notifications tables are ready');
  })
  .catch(err => console.error('❌ Database connection/setup error', err.stack));

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// POST: Save a new assessment
app.post('/api/assessments', submitLimiter, requireClientKey, async (req, res) => {
  try {
    const payload = req.body; // This is the dbPayload sent from the frontend

    // Organisational submissions must reference a registered, active batch
    if (payload.batch && String(payload.batch).trim() !== '') {
      const b = await pool.query('SELECT code, org, status FROM batches WHERE UPPER(code) = UPPER($1)', [String(payload.batch).trim()]);
      if (!b.rows.length) {
        return res.status(400).json({ success: false, message: 'Invalid batch code. Please check with your organisation.' });
      }
      if (b.rows[0].status !== 'active') {
        return res.status(400).json({ success: false, message: 'This batch is closed and no longer accepting responses.' });
      }
      payload.batch = b.rows[0].code; // normalise casing
    }

    const query = `
      INSERT INTO assessments 
      (doc_id, assessment_type, phone, name, email, department, role, industry, batch, purpose, level, overall_score, profile_name, report_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      payload.doc_id,
      payload.assessment_type,
      payload.phone,
      payload.name,
      payload.email,
      payload.department,
      payload.role,
      payload.industry,
      payload.batch,
      payload.purpose,
      payload.level,
      payload.overall_score,
      payload.profile_name,
      payload.report_data // The entire JSON object goes into the JSONB column
    ];

    const result = await pool.query(query, values);

    try {
      await pool.query(
        `INSERT INTO notifications (type, title, body, batch, doc_id) VALUES ($1, $2, $3, $4, $5)`,
        ['response', `New response: ${payload.name || 'Unnamed'}`,
         `${payload.batch || 'Individual'} · ${payload.profile_name || ''} · score ${payload.overall_score ?? ''}`,
         payload.batch || null, payload.doc_id || null]
      );
    } catch (nErr) { console.error('Notification insert failed', nErr.message); }

    res.status(201).json({ success: true, message: 'Assessment saved', data: result.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET: Fetch all assessments, or a single person's history via ?email=
app.get('/api/assessments', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email && !isAdmin(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    let result;
    if (email) {
      result = await pool.query(
        'SELECT * FROM assessments WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC',
        [email.trim()]
      );
    } else {
      result = await pool.query('SELECT * FROM assessments ORDER BY created_at DESC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ----------------------------------------------------
// ADMIN AUTH
// ----------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(500).json({ success: false, message: 'ADMIN_PASSWORD not configured on server.' });
  if ((req.body.password || '') !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Incorrect password.' });
  res.json({ success: true, token: makeToken() });
});

// ----------------------------------------------------
// BATCHES (Access Panel)
// ----------------------------------------------------
const sanitizeEntitlements = (e) => {
  const out = {};
  ['action', 'persona', 'player', 'tech', 'team', 'culture'].forEach(k => {
    const v = (e && e[k]) || {};
    out[k] = { admin: !!v.admin, participant: !!v.participant };
  });
  // Action Plan and Persona are always participant-visible; group reports never are
  out.action.participant = true;
  out.persona.participant = true;
  out.team.participant = false;
  out.culture.participant = false;
  return out;
};

// Create a batch: server generates the next non-clashing code
app.post('/api/batches', requireAdmin, async (req, res) => {
  try {
    const { org, entitlements } = req.body;
    if (!org || !String(org).trim()) return res.status(400).json({ success: false, message: 'Organisation name is required.' });
    const ent = sanitizeEntitlements(entitlements);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = await generateBatchCode();
      try {
        const r = await pool.query(
          `INSERT INTO batches (code, org, entitlements) VALUES ($1, $2, $3) RETURNING *`,
          [code, String(org).trim(), JSON.stringify(ent)]
        );
        return res.status(201).json({ success: true, data: r.rows[0] });
      } catch (insErr) {
        if (insErr.code !== '23505') throw insErr; // 23505 = unique clash, regenerate and retry
      }
    }
    res.status(500).json({ success: false, message: 'Could not generate a unique batch code. Try again.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// List batches with response counts
app.get('/api/batches', requireAdmin, async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT b.*, (SELECT COUNT(*) FROM assessments a WHERE UPPER(a.batch) = UPPER(b.code)) AS responses
      FROM batches b ORDER BY b.created_at DESC
    `);
    res.json(r.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Edit entitlements or open/close a batch
app.patch('/api/batches/:code', requireAdmin, async (req, res) => {
  try {
    const { entitlements, status } = req.body;
    const sets = [], vals = [];
    if (entitlements) { vals.push(JSON.stringify(sanitizeEntitlements(entitlements))); sets.push(`entitlements = $${vals.length}`); }
    if (status === 'active' || status === 'closed') { vals.push(status); sets.push(`status = $${vals.length}`); }
    if (!sets.length) return res.status(400).json({ success: false, message: 'Nothing to update.' });
    vals.push(req.params.code);
    const r = await pool.query(
      `UPDATE batches SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE UPPER(code) = UPPER($${vals.length}) RETURNING *`, vals);
    if (!r.rows.length) return res.status(404).json({ success: false, message: 'Batch not found.' });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUBLIC: validate a batch code for the assessment form. Returns org + participant entitlements only.
app.get('/api/batches/validate/:code', validateLimiter, requireClientKey, async (req, res) => {
  try {
    const r = await pool.query('SELECT code, org, status, entitlements FROM batches WHERE UPPER(code) = UPPER($1)', [req.params.code]);
    if (!r.rows.length) return res.json({ valid: false, reason: 'not_found' });
    const b = r.rows[0];
    if (b.status !== 'active') return res.json({ valid: false, reason: 'closed', org: b.org });
    const e = b.entitlements || {};
    res.json({
      valid: true, code: b.code, org: b.org,
      participant: {
        action: true, persona: true,
        player: !!(e.player && e.player.participant),
        tech: !!(e.tech && e.tech.participant),
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ valid: false, reason: 'server_error' });
  }
});

// ----------------------------------------------------
// EVIDENCE SYNC (gamified report) + notification
// ----------------------------------------------------
app.post('/api/evidence', evidenceLimiter, requireClientKey, async (req, res) => {
  try {
    const { doc_id, evidence, action, changed_key, name, batch } = req.body;
    if (!doc_id) return res.status(400).json({ success: false, message: 'doc_id required' });
    const r = await pool.query(
      `UPDATE assessments SET report_data = jsonb_set(COALESCE(report_data, '{}'::jsonb), '{evidence}', $2::jsonb, true)
       WHERE doc_id = $1 RETURNING doc_id`,
      [doc_id, JSON.stringify(evidence || {})]
    );
    if (!r.rows.length) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (action === 'submit') {
      try {
        await pool.query(
          `INSERT INTO notifications (type, title, body, batch, doc_id) VALUES ($1, $2, $3, $4, $5)`,
          ['evidence', `Evidence uploaded: ${name || doc_id}`, `Item: ${changed_key || 'unknown'} · ${batch || 'Individual'}`, batch || null, doc_id]
        );
      } catch (nErr) { console.error('Notification insert failed', nErr.message); }
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------
app.get('/api/notifications', requireAdmin, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
    res.json(r.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.patch('/api/notifications/read', requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (Array.isArray(ids) && ids.length) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ANY($1::int[])', [ids]);
    } else {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE');
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});