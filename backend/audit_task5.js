// ═══════════════════════════════════════════════════════════════════════════
// audit_task5.js  (schema-aware, per-dimension thresholds)
//
// Read-only audit script. Introspects your actual `assessments` (and, if
// present, `batches`) table columns first, then pulls every assessment and
// recomputes everything that appears on the Action Plan report: the nine
// dimension scores + bands, the seven composite indices, the two strengths /
// two priority areas, the roadmap targets, which Carnelian programmes would
// be recommended, and the priority-matrix quadrant assignment. Prints a
// console summary and writes a full per-participant CSV.
//
// USAGE (from your backend folder, same place as index.js):
//   node audit_task5.js
//
// Requires the same DATABASE_URL your backend already uses (.env). No writes
// to the DB — SELECT only.
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── Dimension labels, exactly as they appear on the Action Plan report ──
const DIM_LABELS = {
  EOavg: 'Ethical Integrity',
  ES: 'Emotional Resilience',
  OCBavg: 'Team Citizenship',
  LAavg: 'Learning Agility',
  O: 'Openness to Ideas',
  CQavg: 'Cultural Intelligence',
  C: 'Conscientiousness',
  A: 'Collaborative Spirit',
  E: 'Social Confidence',
};
const DIM_KEYS = Object.keys(DIM_LABELS);

const IDX_LABELS = {
  CII: 'Compliance & Integrity',
  LRS: 'Leadership Readiness',
  TVS: 'Team Value',
  ADS: 'Adaptability',
  SES: 'Stakeholder Engagement',
  OPS: 'Operations',
  PMS: 'People Management',
};
const IDX_KEYS = Object.keys(IDX_LABELS);

// ── Per-dimension band thresholds ──
// Default stays 75/50. Dimensions that showed a dead floor in the Task 5
// audit (near-zero "Priority" hits under the default 50 cutoff — Ethical
// Integrity, Team Citizenship, Cultural Intelligence, Collaborative Spirit)
// get a raised floor so "Priority" can actually fire for them. Edit these
// per-key overrides as your baseline data warrants; DEFAULT_BAND applies to
// any key not listed here.
const DEFAULT_BAND = { strong: 75, dev: 50 };
const BAND_THRESHOLDS = {
  EOavg: { strong: 80, dev: 60 },  // Ethical Integrity — worked as-is in the second pass
  OCBavg: { strong: 82, dev: 65 }, // Team Citizenship — 60 floor still left Priority near-dead, pushed higher
  CQavg: { strong: 82, dev: 62 },  // Cultural Intelligence — nudged off the round 60/80 cluster values
  A: { strong: 85, dev: 65 },      // Collaborative Spirit — 80 barely moved Strong%, needed a bigger jump
};
const bandsFor = (key) => BAND_THRESHOLDS[key] || DEFAULT_BAND;

const bandOf = (v, key) => {
  if (v == null) return 'N/A';
  const { strong, dev } = bandsFor(key);
  return v >= strong ? 'Strong' : v >= dev ? 'Developing' : 'Priority';
};
const isBorderline = (v, key) => {
  if (v == null) return false;
  const { strong, dev } = bandsFor(key);
  return Math.abs(v - strong) <= 2 || Math.abs(v - dev) <= 2;
};

// ── Same career-stage logic as getPrograms() ──
const careerStage = (expLevel, roleLevel) => {
  const el = expLevel || '', rl = roleLevel || '';
  const early = ['0–2 years', '3–5 years'].includes(el) || rl.includes('Entry') || rl.includes('Junior');
  const mid = el === '6–10 years' || rl.includes('Mid-Level');
  const senior = ['11–15 years', '16+ years'].includes(el) || rl.includes('Senior') || rl.includes('Executive') || rl.includes('Director');
  if (senior) return 'Senior';
  if (mid) return 'Mid';
  if (early) return 'Early';
  return 'Unclassified';
};

// ── Same programme-selection logic as getPrograms(), condensed to trigger names ──
const programmesFor = (gapKeys, stage, seesawVal) => {
  const hit = [];
  const isEarly = stage === 'Early', isMid = stage === 'Mid', isSenior = stage === 'Senior';

  if (gapKeys.includes('E') || gapKeys.includes('A') || gapKeys.includes('OCBavg')) hit.push('Training: Communication & Influence Workshop');
  if (gapKeys.includes('EOavg') || (seesawVal > 60)) hit.push('Training: Professional Ethics & Values Programme');
  if (gapKeys.includes('LAavg') || gapKeys.includes('O')) hit.push('Training: Learning Agility & Growth Mindset Workshop');
  if (gapKeys.includes('CQavg')) hit.push('Training: Intercultural Communication & Collaboration');
  if (gapKeys.includes('ES')) hit.push('Training: Resilience & Emotional Intelligence Programme');
  if (isMid || isSenior || gapKeys.includes('ES') || gapKeys.includes('C')) hit.push('Coaching: 1:1 CORE Executive Coaching');
  if (isEarly) hit.push('Mentorship: Carnelian Mentor Pairing Programme');
  if (isSenior || gapKeys.includes('EOavg') || gapKeys.includes('C')) hit.push('Consulting: Team & Culture Advisory Engagement');
  if (hit.length === 0) hit.push('Coaching: CORE Coaching Session (fallback — no other trigger fired)');

  return [...new Set(hit)];
};

const csvEscape = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function columnsOf(tableName) {
  const r = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
    [tableName]
  );
  return new Set(r.rows.map(row => row.column_name));
}

async function run() {
  console.log('Inspecting table schema…');
  const assessCols = await columnsOf('assessments');
  if (assessCols.size === 0) {
    throw new Error(`No columns found for table "assessments". Check that DATABASE_URL points to the right database.`);
  }
  let batchesCols = new Set();
  try { batchesCols = await columnsOf('batches'); } catch (e) { /* batches table may not exist yet — fine, we just skip the join */ }
  const hasBatchesTable = batchesCols.size > 0;

  // Only ask for columns that actually exist. Everything else falls back to report_data.respondent.<field> below.
  const wanted = ['doc_id', 'name', 'email', 'org', 'batch', 'department', 'industry', 'experience', 'level', 'purpose', 'profile_name', 'overall_score', 'created_at', 'report_data'];
  const present = wanted.filter(c => assessCols.has(c));
  const missing = wanted.filter(c => !assessCols.has(c));
  if (missing.length) {
    console.log(`Note: these columns don't exist on "assessments" and will be read from report_data.respondent instead where possible: ${missing.join(', ')}`);
  }

  const selectList = present.map(c => `a."${c}"`).join(', ');
  let query = `SELECT ${selectList}`;
  if (hasBatchesTable && batchesCols.has('org') && batchesCols.has('code') && present.includes('batch')) {
    query += `, b.org AS batch_org`;
  }
  query += ` FROM assessments a`;
  if (hasBatchesTable && batchesCols.has('org') && batchesCols.has('code') && present.includes('batch')) {
    query += ` LEFT JOIN batches b ON UPPER(a.batch) = UPPER(b.code)`;
  }
  if (present.includes('created_at')) query += ` ORDER BY a.created_at ASC`;

  console.log('Connecting and fetching all assessments…');
  const res = await pool.query(query);
  const rows = res.rows;
  console.log(`Fetched ${rows.length} assessment records.\n`);

  const csvRows = [];
  const csvHeader = [
    'doc_id', 'name', 'org', 'batch', 'industry', 'experience', 'level', 'career_stage', 'purpose',
    'profile_name', 'overall_score', 'validity',
    ...DIM_KEYS.map(k => `${DIM_LABELS[k]}_score`),
    ...DIM_KEYS.map(k => `${DIM_LABELS[k]}_band`),
    ...IDX_KEYS.map(k => `${IDX_LABELS[k]}_score`),
    'strength_1', 'strength_1_score', 'strength_2', 'strength_2_score',
    'priority_1', 'priority_1_score', 'priority_2', 'priority_2_score',
    'roadmap_targets', 'act_now', 'build_soon', 'sustain_expand', 'monitor_progress',
    'programmes_recommended', 'borderline_dimensions',
  ];
  csvRows.push(csvHeader.map(csvEscape).join(','));

  const bandCounts = {};
  DIM_KEYS.forEach(k => { bandCounts[k] = { Strong: 0, Developing: 0, Priority: 0, 'N/A': 0 }; });
  const stageCounts = { Early: 0, Mid: 0, Senior: 0, Unclassified: 0 };
  const programmeCounts = {};
  let borderlineTotal = 0;
  const unclassifiedRows = [];

  for (const row of rows) {
    const rd = row.report_data || {};
    const respondent = rd.respondent || {};
    const scores = rd.scores || {};
    const CI = rd.CI || {};
    const validity = rd.validity?.overall || 'unknown';
    const seesawVal = rd.gameSummary?.seesaw?.val ?? null;

    // Prefer the real column; fall back to whatever was stored in report_data.respondent at submission time.
    const get = (col) => (row[col] !== undefined ? row[col] : respondent[col]) ?? '';
    const orgVal = row.batch_org || get('org') || '';
    const expVal = get('experience') || get('exp');
    const levelVal = get('level');

    const dims = DIM_KEYS.map(k => ({ k, l: DIM_LABELS[k], v: scores[k] != null ? Number(scores[k]) : null }));
    const scoredDims = dims.filter(d => d.v != null);
    const sorted = [...scoredDims].sort((a, b) => b.v - a.v);

    dims.forEach(d => {
      const b = bandOf(d.v, d.k);
      bandCounts[d.k][b] = (bandCounts[d.k][b] || 0) + 1;
    });

    const top2 = sorted.slice(0, 2);
    const bot2 = [...sorted].reverse().slice(0, 2);
    const gapKeys = bot2.map(d => d.k);

    const stage = careerStage(expVal, levelVal);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    if (stage === 'Unclassified') unclassifiedRows.push({ doc_id: row.doc_id, experience: expVal, level: levelVal });

    const programmes = programmesFor(gapKeys, stage, seesawVal);
    programmes.forEach(p => { programmeCounts[p] = (programmeCounts[p] || 0) + 1; });

    const actNow = sorted.length === 9 ? sorted.slice(7, 9) : [];
    const buildSoon = sorted.length === 9 ? sorted.slice(5, 7) : [];
    const sustainExpand = sorted.length === 9 ? sorted.slice(0, 2) : [];
    const monitor = sorted.length === 9 ? sorted.slice(2, 5) : [];

    const borderline = dims.filter(d => isBorderline(d.v, d.k));
    borderlineTotal += borderline.length;

    csvRows.push([
      row.doc_id, row.name, orgVal, get('batch'), get('industry'), expVal, levelVal, stage, get('purpose'),
      row.profile_name, row.overall_score, validity,
      ...dims.map(d => d.v ?? ''),
      ...dims.map(d => bandOf(d.v, d.k)),
      ...IDX_KEYS.map(k => CI[k] ?? ''),
      top2[0]?.l || '', top2[0]?.v ?? '', top2[1]?.l || '', top2[1]?.v ?? '',
      bot2[0]?.l || '', bot2[0]?.v ?? '', bot2[1]?.l || '', bot2[1]?.v ?? '',
      bot2.map(d => d.l).join(' | '),
      actNow.map(d => `${d.l} (${d.v})`).join(' | '),
      buildSoon.map(d => `${d.l} (${d.v})`).join(' | '),
      sustainExpand.map(d => `${d.l} (${d.v})`).join(' | '),
      monitor.map(d => `${d.l} (${d.v})`).join(' | '),
      programmes.join(' | '),
      borderline.map(d => `${d.l}=${d.v}`).join(' | '),
    ].map(csvEscape).join(','));
  }

  const outDir = path.join(__dirname, 'audit_output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = path.join(outDir, `task5_audit_${stamp}.csv`);
  fs.writeFileSync(outPath, csvRows.join('\n'), 'utf8');

  console.log('═══ BAND THRESHOLDS IN USE ═══');
  DIM_KEYS.forEach(k => {
    const { strong, dev } = bandsFor(k);
    const overridden = BAND_THRESHOLDS[k] ? '  (overridden)' : '';
    console.log(`${DIM_LABELS[k].padEnd(22)} Strong ≥ ${strong}   Developing ≥ ${dev}${overridden}`);
  });

  console.log('\n═══ BAND DISTRIBUTION PER DIMENSION ═══');
  DIM_KEYS.forEach(k => {
    const c = bandCounts[k];
    console.log(`${DIM_LABELS[k].padEnd(22)} Strong: ${String(c.Strong).padStart(3)}   Developing: ${String(c.Developing).padStart(3)}   Priority: ${String(c.Priority).padStart(3)}   N/A: ${c['N/A']}`);
  });

  console.log('\n═══ CAREER STAGE DISTRIBUTION ═══');
  Object.entries(stageCounts).forEach(([k, v]) => console.log(`${k.padEnd(14)} ${v}`));
  if (unclassifiedRows.length) {
    console.log(`\n${unclassifiedRows.length} row(s) fell into "Unclassified" — their experience/level text didn't match any known bucket. Worth checking these:`);
    unclassifiedRows.forEach(r => console.log(`  ${r.doc_id}  experience="${r.experience}"  level="${r.level}"`));
  }

  console.log('\n═══ PROGRAMME RECOMMENDATION FREQUENCY ═══');
  Object.entries(programmeCounts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`${String(v).padStart(4)}   ${k}`));

  console.log(`\n═══ BORDERLINE CASES ═══`);
  console.log(`${borderlineTotal} individual dimension scores across all participants sit within 2 points of their dimension's Strong/Developing cutoff (see "borderline_dimensions" in the CSV for exactly which ones, per person).`);

  console.log(`\nTotal participants audited: ${rows.length}`);
  console.log(`Full per-participant CSV written to: ${outPath}`);

  await pool.end();
}

run().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});