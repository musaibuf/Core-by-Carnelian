// audit_task4.js
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

// Helper to calculate absolute difference between two score profiles
function calculateDifference(s1, s2) {
  const dims = ['O', 'C', 'E', 'A', 'ES', 'CQavg', 'OCBavg', 'LAavg', 'EOavg'];
  let diff = 0;
  dims.forEach(d => {
    diff += Math.abs((s1[d] || 0) - (s2[d] || 0));
  });
  return diff; // Lower is more similar
}

async function runTask4() {
  console.log("🚀 Starting CORE Consistency Audit - Task 4...\n");

  try {
    const { rows } = await pool.query(`
      SELECT name, email, profile_name, overall_score, report_data->'scores' as scores 
      FROM assessments 
      WHERE report_data->'validity'->>'overall' != 'red'
    `);

    const pairs = [];

    // Compare every respondent to every other respondent
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        if (!rows[i].scores || !rows[j].scores) continue;
        
        const diff = calculateDifference(rows[i].scores, rows[j].scores);
        pairs.push({
          p1: rows[i],
          p2: rows[j],
          diff: diff
        });
      }
    }

    // Sort by most similar (lowest difference)
    pairs.sort((a, b) => a.diff - b.diff);

    console.log("=== 1. ARTIFICIAL CLIFFS (Highly Similar Scores, Different Archetypes) ===");
    const cliffs = pairs.filter(p => p.p1.profile_name !== p.p2.profile_name).slice(0, 3);
    
    if (cliffs.length === 0) {
      console.log("✅ No artificial cliffs found.");
    } else {
      cliffs.forEach(p => {
        console.log(`\n⚠️ Total Score Difference: Only ${p.diff} points across 9 dimensions!`);
        console.log(`   Person A: ${p.p1.name} -> Archetype: [${p.p1.profile_name}] (Overall: ${p.p1.overall_score})`);
        console.log(`   Person B: ${p.p2.name} -> Archetype: [${p.p2.profile_name}] (Overall: ${p.p2.overall_score})`);
      });
    }

    console.log("\n=== 2. ARCHETYPE DILUTION (Same Archetype, Wildly Different Scores) ===");
    const dilutions = pairs
      .filter(p => p.p1.profile_name === p.p2.profile_name)
      .sort((a, b) => b.diff - a.diff) // Sort by MOST different
      .slice(0, 3);

    if (dilutions.length === 0) {
      console.log("✅ No archetype dilution found.");
    } else {
      dilutions.forEach(p => {
        console.log(`\n⚠️ Total Score Difference: A massive ${p.diff} points across 9 dimensions!`);
        console.log(`   Archetype: [${p.p1.profile_name}]`);
        console.log(`   Person A: ${p.p1.name} (Overall: ${p.p1.overall_score})`);
        console.log(`   Person B: ${p.p2.name} (Overall: ${p.p2.overall_score})`);
      });
    }

  } catch (err) {
    console.error("Audit failed:", err);
  } finally {
    pool.end();
  }
}

runTask4();