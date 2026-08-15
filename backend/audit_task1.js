// audit_task1.js
require('dotenv').config();
const { Pool } = require('pg');

// 1. Debugging: Check if the URL is actually loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is undefined. Check your .env file.");
  process.exit(1);
}

// 2. SSL config is often required when connecting to Render/Cloud DBs from a local machine
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runDataAudit() {
  console.log("🚀 Starting CORE Data Audit - Task 1...\n");

  try {
    const { rows } = await pool.query('SELECT * FROM assessments');
// ... (Keep the rest of the script exactly the same from here down)
    if (rows.length === 0) {
      console.log("❌ No data found in the assessments table.");
      return;
    }

    console.log(`📊 Total Respondents Analyzed: ${rows.length}\n`);

    const stats = {
      dimensions: {},
      lScale: { green: 0, amber: 0, red: 0 },
      validity: { green: 0, amber: 0, red: 0 },
      completionTimes: [],
      compositeFails: []
    };

    // 1. Process Data
    rows.forEach(row => {
      const rd = row.report_data;
      if (!rd || !rd.scores) return;

      // Extract Dimension Scores
      const dims = ['O', 'C', 'E', 'A', 'ES', 'CQavg', 'OCBavg', 'LAavg', 'EOavg'];
      dims.forEach(dim => {
        if (!stats.dimensions[dim]) stats.dimensions[dim] = [];
        stats.dimensions[dim].push(rd.scores[dim]);
      });

      // Extract L-Scale & Validity
      if (rd.validity) {
        // L-scale logic: 0-3 green, 4 amber, 5+ red
        const lAgree = rd.validity.lAgree || 0;
        if (lAgree >= 5) stats.lScale.red++;
        else if (lAgree === 4) stats.lScale.amber++;
        else stats.lScale.green++;

        // Overall Validity
        if (rd.validity.overall) stats.validity[rd.validity.overall]++;
      }

      // Extract Completion Time (Convert "Xm Ys" to seconds)
      if (rd.completionTime && rd.completionTime !== 'Not recorded') {
        const match = rd.completionTime.match(/(\d+)m\s+(\d+)s/);
        if (match) {
          const seconds = (parseInt(match[1]) * 60) + parseInt(match[2]);
          stats.completionTimes.push(seconds);
        }
      }

      // Composite Sanity Check (Math Verification)
      if (rd.CI && rd.scores) {
        const S = rd.scores;
        const calcCII = Math.round(S.EO_RC * 0.32 + S.EO_AI * 0.32 + S.EO_T * 0.20 + S.C * 0.16);
        const calcLRS = Math.round(S.C * 0.22 + S.E * 0.18 + S.LAavg * 0.25 + S.EOavg * 0.20 + S.ES * 0.15);
        
        if (Math.abs(calcCII - rd.CI.CII) > 1 || Math.abs(calcLRS - rd.CI.LRS) > 1) {
          stats.compositeFails.push(row.email);
        }
      }
    });

    // 2. Print Report
    console.log("=== 1. DIMENSION SCORE DISTRIBUTIONS ===");
    for (const [dim, values] of Object.entries(stats.dimensions)) {
      const validValues = values.filter(v => v != null);
      if (validValues.length === 0) continue;
      const sum = validValues.reduce((a, b) => a + b, 0);
      const mean = (sum / validValues.length).toFixed(1);
      const min = Math.min(...validValues);
      const max = Math.max(...validValues);
      
      // Standard Deviation
      const variance = validValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validValues.length;
      const sd = Math.sqrt(variance).toFixed(1);

      console.log(`${dim.padEnd(8)} | Mean: ${mean} | SD: ${sd} | Min: ${min} | Max: ${max}`);
      if (sd < 5) console.log(`   ⚠️ WARNING: Low variance in ${dim}. Items may be poorly calibrated.`);
      if (mean > 80) console.log(`   ⚠️ WARNING: Ceiling effect in ${dim}. Too easy to score high.`);
    }

    console.log("\n=== 2. L-SCALE DISTRIBUTION ===");
    console.log(`Green (0-3): ${stats.lScale.green} (${Math.round(stats.lScale.green/rows.length*100)}%)`);
    console.log(`Amber (4):   ${stats.lScale.amber} (${Math.round(stats.lScale.amber/rows.length*100)}%)`);
    console.log(`Red (5+):    ${stats.lScale.red} (${Math.round(stats.lScale.red/rows.length*100)}%)`);
    if ((stats.lScale.amber + stats.lScale.red) / rows.length > 0.15) {
      console.log("   🚨 ALERT: >15% flagged on L-Scale. Re-evaluate cultural threshold for Pakistani respondents.");
    }

    console.log("\n=== 3. OVERALL VALIDITY DISTRIBUTION ===");
    console.log(`Green: ${stats.validity.green} (${Math.round(stats.validity.green/rows.length*100)}%)`);
    console.log(`Amber: ${stats.validity.amber} (${Math.round(stats.validity.amber/rows.length*100)}%)`);
    console.log(`Red:   ${stats.validity.red} (${Math.round(stats.validity.red/rows.length*100)}%)`);

    console.log("\n=== 4. COMPLETION TIMES ===");
    if (stats.completionTimes.length > 0) {
      stats.completionTimes.sort((a, b) => a - b);
      const medianSecs = stats.completionTimes[Math.floor(stats.completionTimes.length / 2)];
      const meanSecs = stats.completionTimes.reduce((a, b) => a + b, 0) / stats.completionTimes.length;
      console.log(`Median: ${Math.floor(medianSecs/60)}m ${medianSecs%60}s`);
      console.log(`Mean:   ${Math.floor(meanSecs/60)}m ${Math.round(meanSecs%60)}s`);
      const fast = stats.completionTimes.filter(t => t < 480).length; // Under 8 mins
      console.log(`Careless (Under 8m): ${fast} respondents`);
    }

    console.log("\n=== 5. COMPOSITE SANITY CHECK ===");
    if (stats.compositeFails.length === 0) {
      console.log("✅ All composite math verified successfully.");
    } else {
      console.log(`❌ Math mismatch found in ${stats.compositeFails.length} respondents:`, stats.compositeFails);
    }

  } catch (err) {
    console.error("Audit failed:", err);
  } finally {
    pool.end();
  }
}

runDataAudit();