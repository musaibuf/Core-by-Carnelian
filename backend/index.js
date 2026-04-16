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


// Test DB Connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error', err.stack));

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// POST: Save a new assessment
app.post('/api/assessments', async (req, res) => {
  try {
    const reportData = req.body;
    const { respondent, scores, profile, docId } = reportData;

    // Use department Other if selected
    const actualDept = respondent.dept === 'Other' ? respondent.deptOther : respondent.dept;

    const query = `
      INSERT INTO assessments 
      (doc_id, cnic, name, email, department, role, industry, overall_score, profile_name, report_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      docId,
      respondent.cnic,
      respondent.name,
      respondent.email,
      actualDept,
      respondent.role,
      respondent.industry,
      scores.overall,
      profile.name,
      reportData // The entire JSON object goes into the JSONB column
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