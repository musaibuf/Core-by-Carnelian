// audit_task2.js
require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is undefined.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runTask2() {
  console.log("🚀 Starting CORE Archetype Audit - Task 2...\n");

  try {
    const { rows } = await pool.query('SELECT * FROM assessments');
    const total = rows.length;

    // 1. Archetype Distribution
    const archCounts = {};
    rows.forEach(r => {
      const p = r.profile_name || 'Unknown';
      archCounts[p] = (archCounts[p] || 0) + 1;
    });

    console.log("=== 1. ARCHETYPE DISTRIBUTION ===");
    Object.entries(archCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([name, count]) => {
        console.log(`${String(count).padStart(3)} (${Math.round(count/total*100)}%) - ${name}`);
      });

    if ((archCounts['Emerging Professional'] || 0) / total > 0.30) {
      console.log("\n   ⚠️ WARNING: >30% landed in Emerging Professional. Thresholds may be too strict.");
    }

    // 2. Burnout Gate Check
    console.log("\n=== 2. BURNOUT GATE VERIFICATION ===");
    const burnoutCandidates = rows.filter(r => {
      const s = r.report_data?.scores;
      return s && s.ES < 50 && s.C >= 68;
    });
    
    console.log(`Found ${burnoutCandidates.length} candidates meeting the burnout criteria (ES < 50 AND C >= 68).`);
    
    let gateFailures = 0;
    burnoutCandidates.forEach(c => {
      // The logic in App.js has specific secondary triggers for this archetype, 
      // but let's see if the primary gate caught them.
      if (c.profile_name !== 'High-Capability, Under Strain') {
        console.log(`   ❌ MISMATCH: ${c.email || c.name} met base criteria (ES:${c.report_data.scores.ES}, C:${c.report_data.scores.C}) but got '${c.profile_name}'`);
        gateFailures++;
      } else {
        console.log(`   ✅ CAUGHT: ${c.email || c.name} (ES:${c.report_data.scores.ES}, C:${c.report_data.scores.C})`);
      }
    });

    // 3. Strategic Integrity Leader Boundaries
    console.log("\n=== 3. ELITE ARCHETYPE BOUNDARIES ===");
    const sil = rows.filter(r => r.profile_name === 'Strategic Integrity Leader');
    console.log(`Total Strategic Integrity Leaders: ${sil.length}`);
    
    sil.forEach(c => {
      const s = c.report_data.scores;
      console.log(`   ${c.name}: C:${s.C} (Need ≥76) | E:${s.E} (Need ≥68) | EOavg:${s.EOavg} (Need ≥74) | LAavg:${s.LAavg} (Need ≥65)`);
    });

  } catch (err) {
    console.error("Audit failed:", err);
  } finally {
    pool.end();
  }
}

runTask2();