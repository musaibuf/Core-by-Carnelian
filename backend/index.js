require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://core-by-carnelian.onrender.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json()); // Parses incoming JSON requests

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
    } catch (alterErr) {
      console.log('Columns already exist or alter skipped.');
    }

    console.log('✅ Assessments table is ready');
  })
  .catch(err => console.error('❌ Database connection/setup error', err.stack));

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// POST: Save a new assessment
app.post('/api/assessments', async (req, res) => {
  try {
    const payload = req.body; // This is the dbPayload sent from the frontend

    const query = `
      INSERT INTO assessments 
      (doc_id, phone, name, email, department, role, industry, batch, purpose, level, overall_score, profile_name, report_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const values = [
      payload.doc_id,
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
    res.status(201).json({ success: true, message: 'Assessment saved', data: result.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET: Fetch all assessments (We will use this later for the Dashboard)
app.get('/api/assessments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assessments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});