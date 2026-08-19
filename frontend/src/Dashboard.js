import React, { useState, useEffect, useMemo } from 'react';

// ─── DESIGN TOKENS ───────────────────────────────────────────
const darkTheme = {
  c:'#B01C24', cDark:'#8A1018', cDeep:'#6B0E13',
  cGlow:'rgba(176,28,36,0.18)', cHalo:'rgba(176,28,36,0.09)',
  gold:'#C8A84B', goldD:'#A07830', goldP:'rgba(200,168,75,0.12)',
  bg0:'#0A0808', bg1:'#111010', bg2:'#181414', bg3:'#201818', bg4:'#281E1E',
  b0:'rgba(255,255,255,0.06)', b1:'rgba(255,255,255,0.10)', b2:'rgba(255,255,255,0.16)',
  bC:'rgba(176,28,36,0.40)',
  t0:'#FFFFFF', t1:'#F5F5F5', t2:'#E0E0E0', t3:'#BDBDBD',
  gn:'#22c55e', gnP:'rgba(34,197,94,0.14)',
  am:'#f59e0b', amP:'rgba(245,158,11,0.14)',
  rd:'#ef4444', rdP:'rgba(239,68,68,0.14)',
  gridColor:'rgba(255,255,255,0.07)', gridSize:'72px',
};
const lightTheme = {
  c:'#B01C24', cDark:'#8A1018', cDeep:'#6B0E13',
  cGlow:'rgba(176,28,36,0.10)', cHalo:'rgba(176,28,36,0.05)',
  gold:'#A07830', goldD:'#7A5C20', goldP:'rgba(160,120,48,0.10)',
  bg0:'#FFFFFF', bg1:'#FAFAFA', bg2:'#F4F4F4', bg3:'#EEEEEE', bg4:'#E8E8E8',
  b0:'rgba(0,0,0,0.05)', b1:'rgba(0,0,0,0.09)', b2:'rgba(0,0,0,0.16)',
  bC:'rgba(176,28,36,0.30)',
  t0:'#0A0808', t1:'#1A1414', t2:'#3D3030', t3:'#6B5C5C',
  gn:'#15803D', gnP:'rgba(21,128,61,0.10)',
  am:'#B45309', amP:'rgba(180,83,9,0.10)',
  rd:'#B91C1C', rdP:'rgba(185,28,28,0.10)',
  gridColor:'rgba(0,0,0,0.06)', gridSize:'72px',
};

// ─── HELPERS ─────────────────────────────────────────────────
const bd    = (v) => v >= 75 ? 'High'   : v >= 50 ? 'Moderate' : 'Low';
const bCol  = (v, T) => v >= 75 ? T.gn  : v >= 50 ? T.am       : T.rd;
const bBg   = (v, T) => v >= 75 ? T.gnP : v >= 50 ? T.amP      : T.rdP;
const barGrad = (v) =>
  v >= 75 ? 'linear-gradient(90deg,#22c55e,#4ade80)'
  : v >= 50 ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
  : 'linear-gradient(90deg,#ef4444,#f87171)';
const validityColor = (overall, T) =>
  overall === 'green' ? T.gn : overall === 'amber' ? T.am : T.rd;

const COMPOSITE_KEYS = [
  { k:'CII', l:'Compliance & Integrity',   green:70, amber:54 },
  { k:'LRS', l:'Leadership Readiness',     green:72, amber:55 },
  { k:'TVS', l:'Team Value',               green:68, amber:51 },
  { k:'ADS', l:'Adaptability',             green:67, amber:50 },
  { k:'SES', l:'Stakeholder Effective.',   green:68, amber:52 },
  { k:'OPS', l:'Operational Reliability',  green:67, amber:51 },
  { k:'PMS', l:'People Management',        green:67, amber:51 },
];
const OCEAN_KEYS   = ['O','C','E','A','ES'];
const OCEAN_LABELS = { O:'Openness', C:'Conscientiousness', E:'Extraversion', A:'Agreeableness', ES:'Emotional Stability' };
const MODULE_KEYS  = [
  { k:'OCEANavg', l:'Personality (OCEAN)', c:'#EC4899' },
  { k:'CQavg',    l:'Cultural Intelligence', c:'#06B6D4' },
  { k:'OCBavg',   l:'Org. Citizenship', c:'#F97316' },
  { k:'LAavg',    l:'Learning Agility', c:'#3B82F6' },
  { k:'EOavg',    l:'Ethical Orientation', c:'#7C3AED' },
];
const CQ_KEYS  = [
  { k:'CQ_K', l:'Cultural Knowledge' },
  { k:'CQ_M', l:'Cultural Motivation' },
  { k:'CQ_B', l:'Cultural Behaviour' },
];
const OCB_KEYS = [
  { k:'OCB_A',  l:'Altruism' },
  { k:'OCB_CV', l:'Civic Virtue' },
  { k:'OCB_S',  l:'Sportsmanship' },
  { k:'OCB_CO', l:'Courtesy' },
  { k:'OCB_Cn', l:'Conscientiousness (OCB)' },
];
const LA_KEYS = [
  { k:'LA_MA', l:'Mental Agility' },
  { k:'LA_PA', l:'People Agility' },
  { k:'LA_CA', l:'Change Agility' },
  { k:'LA_RA', l:'Results Agility' },
];
const EO_KEYS = [
  { k:'EO_RC', l:'Rule Compliance' },
  { k:'EO_T',  l:'Transparency' },
  { k:'EO_ER', l:'Ethical Reasoning' },
  { k:'EO_AI', l:'Authentic Integrity' },
];

const GEMSTONES = {
  'Adaptive Innovator': {
    emoji:'🧭', gem:'LABRADORITE', title:'The Pathfinder', color:'#3E6B8E', colorDark:'#24425A',
    tagline:"You don't wait for the map. You make one.",
    desc:'Where others see chaos, you see a route. You move fast, connect dots nobody else notices, and somehow always find the way through.',
    inTeam:'The one who unsticks everyone else.',
    edge:'You were already three steps ahead. The hard part is waiting for the room to catch up.',
    oneLine:"Built for problems that don't have a playbook yet.",
    quirky:'GPS could never.',
  },
  'Institutional Anchor': {
    emoji:'🪨', gem:'JASPER', title:'The Cornerstone', color:'#8B5A2B', colorDark:'#5C3A1B',
    tagline:"The team works because of you. They just don't always say it.",
    desc:"You're the memory, the standard, and the steady hand. When everything else moves, you hold the line.",
    inTeam:'The one everyone calibrates against.',
    edge:"Consistency is rare. You've been delivering it for years.",
    oneLine:'The foundation others build on.',
    quirky:'The load-bearing wall of every group chat.',
  },
  'Visionary Sprinter': {
    emoji:'🌟', gem:'CITRINE', title:'The Spark', color:'#D4A017', colorDark:'#8A6A0F',
    tagline:'You see the finish line before the race has started.',
    desc:'Big ideas. Bold moves. Unstoppable energy. You raise the ambition of every room you walk into.',
    inTeam:'The one who makes the impossible feel inevitable.',
    edge:"You don't just dream it. You get people running toward it.",
    oneLine:'The person who makes the room believe.',
    quirky:'Solar powered, main character energy.',
  },
  'Collaborative Team Leader': {
    emoji:'🩵', gem:'TURQUOISE', title:'The Weaver', color:'#2CA6A4', colorDark:'#1C6E6C',
    tagline:'You make the team actually work.',
    desc:"You notice when someone's been quiet too long. You create the kind of trust that makes people do their best work. That's not soft, that's rare.",
    inTeam:"The glue nobody sees until it's gone.",
    edge:'Psychological safety is a skill. Yours is exceptional.',
    oneLine:'The reason the team is more than the sum of its parts.',
    quirky:'The human duct tape holding the team together.',
  },
  'Cross-Cultural Bridge': {
    emoji:'🔵', gem:'LAPIS LAZULI', title:'The Bridge', color:'#26428B', colorDark:'#162A5C',
    tagline:"You speak everyone's language. Even when they're speaking the same one.",
    desc:'You move across cultures, contexts, and communication styles without losing yourself. You translate not words, but worlds.',
    inTeam:'The one who finds the thread everyone else dropped.',
    edge:'You make diverse teams actually function as diverse teams.',
    oneLine:'Where others see difference, you see opportunity.',
    quirky:"Fluent in vibes, dialects, and everyone's love language.",
  },
  'Eager Cultural Bridge-Builder': {
    emoji:'🌙', gem:'MOONSTONE', title:'The Diplomat', color:'#9C97C7', colorDark:'#635E8A',
    tagline:"You bring people in. That's your gift, and it's rarer than you think.",
    desc:"You lead with warmth. You notice who's left out. You make people feel welcome before they've said a word.",
    inTeam:'The reason new people settle fast.',
    edge:'Heart is a leadership skill. Yours is already exceptional.',
    oneLine:'Still becoming, and already making a difference.',
    quirky:'Walks in, and suddenly nobody feels awkward anymore.',
  },
  'Ethics-Driven Executor': {
    emoji:'⬛', gem:'ONYX', title:'The Backbone', color:'#2A2A2A', colorDark:'#111111',
    tagline:'You do what you said you would. Every single time.',
    desc:"No shortcuts. No cutting corners. You hold yourself to a standard others quietly try to match. Integrity isn't something you perform, it's how you operate.",
    inTeam:'The one who brings credibility to everything they touch.',
    edge:'In a world full of noise, you deliver. Quietly. Consistently.',
    oneLine:'The standard others try to meet.',
    quirky:'Shows up. Delivers. Says nothing about it.',
  },
  'Learning Champion': {
    emoji:'💙', gem:'SAPPHIRE', title:'The Champion', color:'#0F52BA', colorDark:'#0A3576',
    tagline:'You are the most curious person in the room. Own it.',
    desc:"You ask questions others don't think to ask. You come back having figured things out. Your growth mindset isn't a trait, it's a practice that compounds.",
    inTeam:'The one who makes everyone around them smarter over time.',
    edge:'Curiosity is contagious. Yours is exceptional.',
    oneLine:'The person who makes the whole team better.',
    quirky:"Turns 'why' into a personality trait, in the best way.",
  },
  'Strategic Pivoter': {
    emoji:'🌈', gem:'OPAL', title:'The Pivot', color:'#8B6FCB', colorDark:'#5A4785',
    tagline:"You don't get stuck. You get strategic.",
    desc:"When the plan changes, and it always does, you don't freeze. You read the room, let go of what's not working, and redirect before others have noticed the shift.",
    inTeam:'The one who stops everyone from throwing good effort after bad plans.',
    edge:"Adaptability at speed. That's not common. That's you.",
    oneLine:'Wired for the world that keeps changing.',
    quirky:'Plot twist? Already three moves ahead of it.',
  },
  'High-Capability, Under Strain': {
    emoji:'🖤', gem:'OBSIDIAN', title:'The Resilient', color:'#1A1A1A', colorDark:'#000000',
    tagline:"You're carrying more than most people know, and still delivering.",
    desc:"Formed under pressure. Razor sharp. You perform at a level others can't sustain, even when the weight is real. That's not just capability. That's character.",
    inTeam:'The most dependable person in the room.',
    edge:'High performance is your baseline. Sustainability is your next level.',
    oneLine:"Pressure didn't break you. It made you sharper.",
    quirky:'Runs on fumes, still outperforms everyone on a full tank.',
  },
  'Strategic Integrity Leader': {
    emoji:'🔴', gem:'CARNELIAN', title:'The Architect', color:'#B01C24', colorDark:'#6B0E13',
    tagline:"This is the stone the brand is named after. You've earned it.",
    desc:"You see the full picture and you build it properly. Strategic thinking. Principled execution. You don't just know what to do, you care deeply about how it gets done.",
    inTeam:'The one whose judgment people trust without needing to ask why.',
    edge:'You carry both the vision and the values. That combination is rare.',
    oneLine:'Where strategy meets substance.',
    quirky:'Builds the plane while flying it. Zero turbulence.',
  },
  'Generous Under Pressure': {
    emoji:'🌸', gem:'ROSE QUARTZ', title:'The Heartbeat', color:'#D98C9A', colorDark:'#9C5865',
    tagline:'Even at full capacity, you show up for others.',
    desc:"When pressure hits, most people turn inward. You check on someone first. That's not naivety, that's emotional strength at most powerful.",
    inTeam:'The reason morale holds when things get hard.',
    edge:'The kind of person every team needs and not every team has.',
    oneLine:'The warmth that keeps everything else going.',
    quirky:'Checks on you before checking their own inbox.',
  },
  'Emerging Professional': {
    emoji:'🟢', gem:'PERIDOT', title:'The Contender', color:'#7CB342', colorDark:'#4E7228',
    tagline:"You're at the start of something real.",
    desc:"Fresh eyes. Genuine hunger. The willingness to show up and figure it out. You haven't developed the assumptions that come with years in an industry, and that makes you more valuable than you realise.",
    inTeam:'The energy. The questions nobody else is asking. The future.',
    edge:"You're not here for an easy ride. You're here for a real one.",
    oneLine:"The beginning is not a limitation. It's a launchpad.",
    quirky:'New here. Already asking the question everyone else was scared to.',
  },
};

const IND = {
  'Banking & Financial Services':{ short:'Banking & Finance', icon:'🏦',
    lens:`In banking, <strong>Ethical Orientation</strong> is the highest-stakes dimension. Regulatory compliance, fiduciary duty, and prudential standards demand authentic integrity. Low EO scores — especially in Rule Compliance and Authentic Integrity — carry material regulatory risk before placement in treasury, audit, or credit functions. <strong>Conscientiousness</strong> and <strong>Emotional Stability</strong> are the strongest performance predictors under regulatory scrutiny. Cultural Intelligence is increasingly critical for institutions engaging across Pakistan's diverse regional footprint and with international regulators.`,
    hiPotential:`Candidates showing C ≥ 75, ES ≥ 70, EOavg ≥ 75, LAavg ≥ 65.`,
    riskNote:`EO_RC or EO_AI below 50 → do not place in treasury, audit, credit, or unsupervised customer-fund roles without mandatory ethics coaching.`
  },
  'Insurance & Takaful':{ short:'Insurance & Takaful', icon:'📋',
    lens:`Insurance and Takaful require <strong>Conscientiousness</strong> (policy accuracy), <strong>Agreeableness</strong> (claims empathy), and <strong>Transparent Ethics</strong> (EO_T). Cultural Knowledge is critical in Takaful contexts where Shariah compliance and community trust are foundational. Low EO_T in underwriting or claims represents significant fraud risk.`,
    hiPotential:`Candidates showing A ≥ 70, C ≥ 72, EOavg ≥ 72. Sales leadership additionally needs E ≥ 65.`,
    riskNote:`Low EO_T in claims or underwriting roles → trigger structured supervision before independent case handling.`
  },
  'Government & Civil Service':{ short:'Government / Civil Service', icon:'🏛',
    lens:`Pakistan's civil service has the highest social desirability inflation of any sector — the Validity Index is especially important here. <strong>Learning Agility</strong> is the most under-measured dimension in civil service promotion systems, yet it is the strongest predictor of success in reform and policy roles. Low CQ in senior officers overseeing multi-provincial programmes carries significant implementation risk. Traditional seniority-based promotion misses all four of CORE's most predictive dimensions.`,
    hiPotential:`Candidates for BPS-18+ roles: LAavg ≥ 65, CQavg ≥ 62, EOavg ≥ 75, C ≥ 70.`,
    riskNote:`Pay extra attention to Validity Index. Social desirability inflation is significantly more common in hierarchical bureaucratic cultures. Also flag LAavg < 45 before reform-facing appointments.`
  },
  'FMCG & Consumer Goods':{ short:'FMCG / Consumer Goods', icon:'🛒',
    lens:`FMCG depends on professionals combining <strong>social confidence</strong> (Extraversion) with <strong>adaptive thinking</strong> (Learning Agility) and cultural fluency to engage Pakistan's enormously diverse consumer base — from boardroom to kiryana. <strong>CQ_B</strong> (behavioural flexibility) is critical because commercial professionals must be equally effective across every register of Pakistani social interaction. Openness predicts innovation in brand and product development.`,
    hiPotential:`Commercial leadership: E ≥ 70, LAavg ≥ 68, CQavg ≥ 65, O ≥ 68. Supply chain leadership substitutes C ≥ 78 for Extraversion.`,
    riskNote:`Low OCB_S in sales teams creates cultural toxicity during high-pressure cycles (Ramzan, Eid, year-end). Monitor and address proactively.`
  },
  'Telecommunications & Technology':{ short:'Telecom & Technology', icon:'📡',
    lens:`Pakistan's tech sector requires the highest <strong>Learning Agility</strong> concentration of any CORE sector. Technical knowledge depreciates rapidly in this environment. <strong>Openness</strong> and <strong>Results Agility</strong> (cross-domain learning) are the strongest sustained performance predictors. CQ is particularly important for teams bridging Pakistan's urban-rural digital divide, where user empathy requires genuine cultural knowledge.`,
    hiPotential:`LAavg ≥ 75, O ≥ 72, LA_CA ≥ 70. Commercial and product roles add CQ_M ≥ 68, E ≥ 65.`,
    riskNote:`EO_T below 55 in data-handling or user-facing tech roles represents data privacy risk. Screen carefully before access to personal customer data.`
  },
  'Energy & Utilities':{ short:'Energy & Utilities', icon:'⚡',
    lens:`Energy and utilities demand exceptional <strong>procedural conscientiousness</strong> and <strong>safety-oriented ethics</strong>. In Pakistan's energy sector — where infrastructure failures carry public safety and national economic consequences — EO_RC and Conscientiousness are the highest-stakes dimensions. The renewable transition is increasing the importance of <strong>Learning Agility</strong> for technical leadership. Emotional Stability is critical for operational roles managing emergency response.`,
    hiPotential:`C ≥ 78, ES ≥ 72, EOavg ≥ 72. Renewable transition roles add LAavg ≥ 68, O ≥ 65.`,
    riskNote:`EO_RC below 50 in operational, maintenance, or control-room roles carries safety risk. Preclude unsupervised responsibility for critical infrastructure.`
  },
  'Healthcare & Pharmaceuticals':{ short:'Healthcare & Pharma', icon:'🏥',
    lens:`Healthcare requires extraordinary <strong>Agreeableness</strong> (patient empathy), <strong>Ethical Reasoning</strong> (consent and resource allocation decisions), and <strong>Emotional Stability</strong> (managing trauma and high-stakes pressure). In pharma, EO_RC and EO_T are defining ethical dimensions. Cultural Knowledge (CQ_K) is critical for professionals engaging rural, conservative, or socioeconomically vulnerable patient populations across Pakistan.`,
    hiPotential:`A ≥ 72, ES ≥ 72, EOavg ≥ 75, C ≥ 73. Training and education leadership adds LAavg ≥ 68.`,
    riskNote:`EO_ER below 60 in any role with patient contact or prescriber influence represents patient safety risk.`
  },
  'Manufacturing & Industrial':{ short:'Manufacturing & Industrial', icon:'🏭',
    lens:`Manufacturing prizes <strong>procedural conscientiousness</strong>, <strong>rule compliance</strong> (quality standards, ISO, safety protocols), and <strong>consistent institutional citizenship</strong>. In export-oriented manufacturing — textiles, chemicals, surgical instruments — CQ is increasingly relevant for international buyer relationships and compliance audits. Emotional Stability is critical for operations leadership managing production pressure, labour relations, and supply chain disruption.`,
    hiPotential:`C ≥ 78, ES ≥ 72, EOavg ≥ 70, OCB_Cn ≥ 72. Export-facing roles add CQ_B ≥ 65.`,
    riskNote:`EO_RC below 50 in QA, safety, or compliance roles carries product liability and regulatory risk. Screen before certification or inspection authority.`
  },
  'Development Sector & NGOs':{ short:'Development / NGOs', icon:'🌍',
    lens:`The development sector requires the highest Cultural Intelligence of any CORE sector — professionals work across Pakistan's full ethnolinguistic and socioeconomic spectrum while managing international donor, government, and community relationships simultaneously. The sector's most common organisational failure is low <strong>Conscientiousness</strong> — high-empathy professionals who struggle with M&E documentation and financial accountability. EO_T is non-negotiable for donor-funded roles.`,
    hiPotential:`CQavg ≥ 72, A ≥ 72, LAavg ≥ 65, EOavg ≥ 70. Programme management adds C ≥ 68.`,
    riskNote:`Low C in programme management creates donor accountability risk. Low EO_T in financial management is a fiduciary risk to the organisation and its funding relationships.`
  },
  'Education & Academia':{ short:'Education & Academia', icon:'🎓',
    lens:`Education professionals require strong <strong>Agreeableness</strong> (learner relationship), <strong>Openness</strong> (curriculum innovation), and <strong>Results Agility</strong> (translating knowledge from diverse domains into effective instruction). Civic Virtue (OCB_CV) is a strong predictor of faculty quality and departmental health. Cultural Intelligence is critical in diverse student populations and for institutions with international academic partnerships.`,
    hiPotential:`O ≥ 72, A ≥ 70, LAavg ≥ 70, OCB_CV ≥ 70. Administration adds C ≥ 72, EOavg ≥ 70.`,
    riskNote:`EO_AI below 50 in faculty or administrative roles creates academic integrity risk — especially in assessment, grading, or research oversight.`
  },
  'Real Estate & Construction':{ short:'Real Estate & Construction', icon:'🏗',
    lens:`Pakistan's real estate and construction sector has significant compliance challenges under RERA reform and anti-money laundering regulations. <strong>Rule Compliance</strong> (EO_RC) and <strong>Transparent Disclosure</strong> (EO_T) are the highest-stakes dimensions — particularly for project directors, procurement officers, and client relationship managers. Learning Agility (LA_CA) is critical as the regulatory landscape continues to evolve.`,
    hiPotential:`C ≥ 75, EOavg ≥ 70, LA_CA ≥ 65. Client-facing roles add SES ≥ 65, CQ_B ≥ 62.`,
    riskNote:`Low EO_RC or EO_T in procurement, land acquisition, or client fund management represents significant corruption and regulatory risk.`
  },
  'Retail & Distribution':{ short:'Retail & Distribution', icon:'🛍',
    lens:`Retail requires <strong>social energy</strong> (Extraversion) combined with <strong>cultural behavioural flexibility</strong> (CQ_B) to engage Pakistan's enormously diverse consumer segments — from premium urban to peri-urban and rural. Agreeableness predicts customer relationship quality and complaint resolution effectiveness. Conscientiousness is critical for inventory management and operational compliance. Sportsmanship (OCB_S) is the strongest predictor of retail team culture quality.`,
    hiPotential:`E ≥ 68, A ≥ 68, CQ_B ≥ 65, C ≥ 72. Regional distribution leadership adds LA_CA ≥ 65.`,
    riskNote:`Low OCB_S in retail or distribution teams creates cultural toxicity during peak seasons. Low EO_T in inventory or cash-handling roles represents shrinkage risk.`
  },
};

// ─── GLOBAL STYLES ───────────────────────────────────────────
const DashStyles = ({ T }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Public+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { -webkit-font-smoothing:antialiased; }
    body { font-family:'Plus Jakarta Sans',sans-serif; background:${T.bg0}; color:${T.t0}; }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:${T.bg0}; }
    ::-webkit-scrollbar-thumb { background:${T.b2}; border-radius:2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.97)}       to{opacity:1;transform:scale(1)} }
    @keyframes shimmer { from{background-position:-200% center}       to{background-position:200% center} }
    @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .dash-anim   { animation:fadeUp 0.5s  cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-2 { animation:fadeUp 0.5s .1s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-3 { animation:fadeUp 0.5s .2s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-4 { animation:fadeUp 0.5s .3s cubic-bezier(0.22,1,0.36,1) both; }
    .modal-in    { animation:scaleIn 0.25s cubic-bezier(0.22,1,0.36,1) both; }
    .row-hover:hover { background:${T.bg2} !important; cursor:pointer; }
    .sidebar-item { transition:all 0.18s; border-radius:7px; }
    .sidebar-item:hover { background:${T.b1} !important; }
    .sort-th { cursor:pointer; user-select:none; }
    .sort-th:hover { color:${T.t0} !important; }
    .chip-badge { display:inline-flex;align-items:center;padding:3px 10px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase; }
    .search-inp:focus { outline:none; border-color:${T.c} !important; box-shadow:0 0 0 3px ${T.cGlow}; }
    .filter-select:focus { outline:none; border-color:${T.c} !important; }
    .action-btn:hover { background:${T.cDark} !important; transform:translateY(-1px); }
    .close-btn:hover  { background:${T.b2} !important; color:${T.t0} !important; }
    .nav-tab:hover    { color:${T.t0} !important; }
    .metric-card:hover { border-color:${T.bC} !important; transform:translateY(-3px); }
    .metric-card { transition:all 0.2s; }
    .report-tab-btn { transition:all 0.18s; cursor:pointer; }
    .report-tab-btn:hover { border-color:${T.c} !important; color:${T.c} !important; }
    @media (max-width:900px) {
      .sidebar { display:none !important; }
      .main-content { margin-left:0 !important; }
    }
  `}</style>
);


// ─── PDF UTILITY ─────────────────────────────────────────────
const downloadAsPDF = async (elementId, filename, T) => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.body.appendChild(s);
  });

  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    const element = document.getElementById(elementId);
    if (!element) return;

    // Wait for webfonts to finish loading before snapshotting, otherwise
    // html2canvas can capture mid-swap and produce overlapping/garbled text.
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    await new Promise(r => setTimeout(r, 300));

    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    const opt = {
      margin: [10, 10, 10, 10], filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 1.5, useCORS: true, backgroundColor: T.bg1 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    await window.html2pdf().set(opt).from(element).save();
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
  } catch (err) {
    console.error("PDF Generation failed", err);
    alert("Failed to generate PDF. Please try again.");
  }
};

const DownloadBtn = ({ elementId, filename, T }) => (
  <button onClick={() => downloadAsPDF(elementId, filename, T)} style={{
    marginTop:'24px', padding:'14px 24px', borderRadius:'8px', background:T.gold, color:T.bg0, 
    border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", 
    fontSize:'13px', fontWeight:'800', width:'100%', transition:'all 0.2s',
    display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'
  }} onMouseOver={e=>{e.target.style.background=T.goldD; e.target.style.color='#fff';}} onMouseOut={e=>{e.target.style.background=T.gold; e.target.style.color=T.bg0;}}>
    ⬇ Download Report as PDF
  </button>
);

// ─── MINI COMPONENTS ─────────────────────────────────────────
const Pill = ({ label, color, bg, style = {} }) => (
  <span style={{
    display:'inline-block', padding:'5px 12px', borderRadius:'3px',
    fontSize:'9px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase',
    fontFamily:"'JetBrains Mono',monospace",
    color, background: bg || `${color}18`, border:`1px solid ${color}35`, ...style,
  }}>{label}</span>
);

const ScoreBadge = ({ score, T }) => (
  <span style={{
    display:'inline-block', padding:'3px 10px', borderRadius:'3px',
    fontSize:'11px', fontWeight:'700', fontFamily:"'JetBrains Mono',monospace",
    background:bBg(score,T), color:bCol(score,T), border:`1px solid ${bCol(score,T)}40`,
  }}>{score}/100</span>
);

const MiniBar = ({ score, w=80, h=4 }) => (
  <div style={{ width:w, height:h, background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden', display:'inline-block' }}>
    <div style={{ width:`${score}%`, height:'100%', background:barGrad(score), borderRadius:'2px', transition:'width 0.6s ease' }} />
  </div>
);

const ValidityDot = ({ overall, T }) => {
  const col = overall === 'green' ? T.gn : overall === 'amber' ? T.am : T.rd;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
      <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:col, boxShadow:`0 0 8px ${col}`, display:'inline-block' }} />
      <span style={{ fontSize:'11px', color:col, fontWeight:'700', fontFamily:"'JetBrains Mono',monospace" }}>
        {overall === 'green' ? 'Valid' : overall === 'amber' ? 'Caution' : 'Flagged'}
      </span>
    </span>
  );
};

const GoldLine = ({ style={} }) => (
  <div style={{ height:'2px', background:'linear-gradient(90deg,#B01C24,#C8A84B,transparent)', ...style }} />
);

const SectionHead = ({ label, T, color }) => (
  <div style={{
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color: color || T.gold,
    textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'14px',
  }}>{label}</div>
);

// ─── SPARKLINE ───────────────────────────────────────────────
const SparkLine = ({ data, color='#C8A84B', w=80, h=28 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*w;
    const y = h-((v-min)/range)*h;
    return `${x},${y}`;
  }).join(' ');
  const lastPt = pts.split(' ').pop().split(',');
  return (
    <svg width={w} height={h} style={{ overflow:'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(lastPt[0])} cy={parseFloat(lastPt[1])} r="3" fill={color} />
    </svg>
  );
};

// ─── DIST BAR ────────────────────────────────────────────────
const DistBar = ({ value, max, label, color, T }) => {
  const pct = max > 0 ? (value/max)*100 : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
      <div style={{ width:'110px', fontSize:'11px', color:T.t2, fontWeight:'600', flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
      <div style={{ flex:1, height:'6px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:'3px', transition:'width 0.8s ease' }} />
      </div>
      <div style={{ width:'22px', fontSize:'11px', color:T.t3, fontFamily:"'JetBrains Mono',monospace", fontWeight:'700', textAlign:'right', flexShrink:0 }}>{value}</div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────
const TABS = [
  { id:'overview',  icon:'⊞', label:'Overview' },
  { id:'profiles',  icon:'◈', label:'Candidate Profiles' },
  { id:'scores',    icon:'◉', label:'Score Analytics' },
  { id:'validity',  icon:'◎', label:'Validity Monitor' },
  { id:'industry',  icon:'◑', label:'Industry Breakdown' },
  { id:'access',    icon:'⛨', label:'Access Panel' },
];

const Sidebar = ({ activeTab, setActiveTab, T, total }) => (
  <aside className="sidebar" style={{
    width:'240px', flexShrink:0, background:T.bg1, borderRight:`1px solid ${T.b2}`,
    display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflow:'auto',
  }}>
   <div style={{ padding:'28px 24px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:'12px' }}>
        <img src={T.bg0 === '#0A0808' ? "/core-logo-for-dark-mode.svg" : "/core-logo-for-light-mode.svg"} alt="CORE by Carnelian" style={{ height:'42px', width:'auto', objectFit:'contain' }}
          onError={e=>{ e.target.style.display='none'; }} />
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:'600' }}>Admin Dashboard</div>
      <GoldLine style={{ marginTop:'16px' }} />
    </div>
    <nav style={{ padding:'8px 12px', flex:1 }}>
      {TABS.map(tab => (
        <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className="sidebar-item"
          style={{
            display:'flex', alignItems:'center', gap:'12px',
            width:'100%', padding:'10px 14px', marginBottom:'2px',
            background: activeTab===tab.id ? `${T.c}18` : 'transparent',
            border:`1px solid ${activeTab===tab.id ? T.bC : 'transparent'}`,
            borderRadius:'7px', cursor:'pointer', textAlign:'left',
            color: activeTab===tab.id ? T.c : T.t2,
            fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'700',
          }}>
          <span style={{ fontSize:'14px', flexShrink:0 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
    <div style={{ padding:'16px 20px', borderTop:`1px solid ${T.b2}` }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', lineHeight:'1.7' }}>
        <div>{total} record{total!==1?'s':''} loaded</div>
        <div style={{ color:T.t3, marginTop:'2px' }}>© Carnelian Pvt Ltd</div>
      </div>
    </div>
  </aside>
);

// ═══════════════════════════════════════════════════════════════
// REPORT TABS — TECHNICAL, ACTION PLAN, PLAYER REPORT, TEAM
// ═══════════════════════════════════════════════════════════════
// ─── DECISION-INDEX GROUPING (maps your existing 7 composite indices to
//     which decision each one is most relevant for) ──────────────────────
const DECISION_INDEX_GROUPS = {
  hiring:     { label: 'For Hiring',           keys: ['CII', 'OPS', 'SES'], color: '#3B82F6' },
  promotion:  { label: 'For Promotion',        keys: ['LRS', 'PMS', 'TVS'], color: '#C8A84B' },
  succession: { label: 'For Succession',       keys: ['LRS', 'ADS', 'CII'], color: '#B01C24' },
};

// ─── TECHNICAL REPORT (on-screen, dashboard dark theme) ──────────────────
const TechnicalReport = ({ candidate, T }) => {
  const rd       = candidate.report_data || {};
  const S        = rd.scores    || {};
  const validity = rd.validity  || {};
  const profile  = rd.profile   || {};
  const roles    = rd.roles     || [];
  const patterns = rd.patterns  || [];
  const CI       = rd.CI        || {};
  const gs       = rd.gameSummary || {};

  const isJunior = (() => {
    const exp = candidate.experience || rd.respondent?.exp || '';
    const lvl = candidate.level || rd.respondent?.level || '';
    return exp === '0–2 years' || exp === '3–5 years' || lvl.includes('Entry') || lvl.includes('Junior');
  })();

  const card = (children, style = {}) => (
    <div style={{ background: T.bg2, border: `1px solid ${T.b1}`, borderRadius: '10px', padding: '20px', marginBottom: '14px', pageBreakInside: 'avoid', breakInside: 'avoid', ...style }}>
      {children}
    </div>
  );

  const suppressed = validity.overall === 'red' && validity.extRatio > 0.85;

  // Role rows matched to decision type, for the readiness-snapshot verdicts
  const hiringRole     = roles.find(r => !['Senior Leadership / Executive', 'Future Leadership Potential', 'People Management / Team Lead', 'Peer Coordination / Project Support'].includes(r.name));
  const promotionRole  = roles.find(r => r.name === 'People Management / Team Lead' || r.name === 'Peer Coordination / Project Support');
  const successionRole = roles.find(r => r.name === 'Senior Leadership / Executive' || r.name === 'Future Leadership Potential');

  const verdictOf = (r) => {
    if (!r) return { lbl: 'N/A', col: T.t3 };
    const rat = r.score >= r.g ? 'green' : r.score >= r.a ? 'amber' : 'red';
    return {
      lbl: rat === 'green' ? '✅ Suitable' : rat === 'amber' ? '⚠️ Conditional' : '🚫 Not Recommended',
      col: rat === 'green' ? T.gn : rat === 'amber' ? T.am : T.rd,
      score: r.score,
    };
  };
  const hiringV = verdictOf(hiringRole);
  const promoV  = verdictOf(promotionRole);
  const succV   = verdictOf(successionRole);

  return (
    <div>
      <div id={`tech-report-${candidate.doc_id}`} style={{ padding: '10px' }}>

        {/* 1 — CANDIDATE OVERVIEW */}
        {card(
          <>
            <SectionHead label="CORE v3.0 · Technical Report · Restricted — HR Leadership Only" T={T} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: '700', color: T.t0, marginBottom: '4px' }}>{candidate.name || rd.respondent?.name}</div>
                <div style={{ fontSize: '12px', color: T.t2, fontWeight: '600', marginBottom: '8px', lineHeight: '1.6' }}>
                  <span style={{ color: T.gold }}>
                    {(candidate.batch || rd.respondent?.batch)
                      ? `🏢 Org Assigned (${candidate.purpose || rd.respondent?.purpose || 'Unspecified Purpose'})`
                      : '👤 Individual (Personal Development)'}
                  </span><br/>
                  {candidate.role || rd.respondent?.role}{(candidate.department || rd.respondent?.dept) ? ` · ${candidate.department || rd.respondent?.dept}` : ''}<br/>
                  Experience: {candidate.experience || rd.respondent?.exp || 'Unspecified'}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <ScoreBadge score={S.overall || candidate.overall_score} T={T} />
                  <Pill label={profile.name || candidate.profile_name} color={T.c} />
                  <ValidityDot overall={validity.overall} T={T} />
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: T.t3, fontFamily: "'JetBrains Mono',monospace" }}>
                {candidate.industry} · {candidate.batch || 'No batch'}<br/>
                Doc: {candidate.doc_id}<br/>
                {new Date(candidate.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </>
        )}

        {/* 2 — DECISION READINESS SNAPSHOT */}
        {card(
          <>
            <SectionHead label="Decision Readiness Snapshot" T={T} />
            {suppressed ? (
              <div style={{ background: T.rdP, border: `1px solid ${T.rd}40`, borderRadius: '8px', padding: '16px', fontSize: '13px', color: T.rd, lineHeight: '1.6' }}>
                <strong>⛔ Suppressed.</strong> Extreme response pattern detected — all readiness verdicts below are unreliable. Supervised retake required before use in any decision.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {[
                  { l: 'Hiring Fit', sub: hiringRole?.name || '—', v: hiringV, keys: 'CII · OPS · SES' },
                  { l: 'Promotion Readiness', sub: promotionRole?.name || '—', v: promoV, keys: 'LRS · PMS · TVS' },
                  { l: 'Succession Potential', sub: successionRole?.name || '—', v: succV, keys: 'LRS · ADS · CII' },
                ].map((d, i) => (
                  <div key={i} style={{ background: T.bg3, border: `1px solid ${d.v.col}40`, borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: T.t3, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>{d.l}</div>
                    <div style={{ fontSize: '11px', color: T.t2, marginBottom: '8px' }}>{d.sub}</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: d.v.col, marginBottom: '4px' }}>{d.v.lbl}{d.v.score != null ? ` · ${d.v.score}` : ''}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: T.t3 }}>Driven by: {d.keys}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 3 — VALIDITY */}
        <div style={{ background: validity.overall === 'green' ? T.gnP : validity.overall === 'amber' ? T.amP : T.rdP, border: `1px solid ${validityColor(validity.overall, T)}35`, borderRadius: '10px', padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ValidityDot overall={validity.overall} T={T} />
            <div style={{ fontSize: '13px', fontWeight: '700', color: T.t0 }}>{validity.overallLabel}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
            {[
              { n: `${validity.lAgree}/10`, l: 'L-Scale' },
              { n: `${Math.round((validity.saRatio || 0) * 100)}%`, l: 'Strongly Agree' },
              { n: `${Math.round((validity.extRatio || 0) * 100)}%`, l: 'Extreme Resp.' },
              { n: `${validity.conScore}/100`, l: 'Consistency' },
            ].map((v, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.35)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: '700', fontSize: '1.1rem', color: T.t0 }}>{v.n}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '8px', color: T.t2, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>{v.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 — COMPOSITE DECISION INDICES (grouped by decision, not flat) */}
        {card(
          <>
            <SectionHead label="Composite Decision Indices" T={T} />
            {suppressed ? (
              <div style={{ background: T.rdP, border: `1px solid ${T.rd}40`, borderRadius: '8px', padding: '16px', fontSize: '13px', color: T.rd }}>⛔ Suppressed — see Decision Readiness Snapshot above.</div>
            ) : (
              Object.entries(DECISION_INDEX_GROUPS).map(([gk, g]) => (
                <div key={gk} style={{ marginBottom: '18px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: '800', color: g.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>{g.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${g.keys.length},1fr)`, gap: '8px' }}>
                    {g.keys.map(k => {
                      const def = COMPOSITE_KEYS.find(c => c.k === k);
                      const val = CI[k] || S[k] || 0;
                      const col = bCol(val, T);
                      return (
                        <div key={k} style={{ background: T.bg3, borderRadius: '7px', padding: '12px', border: `1px solid ${col}25` }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', color: T.t3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px', fontWeight: '700' }}>{def?.l || k}</div>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: col, fontWeight: '700' }}>{val}</div>
                          <MiniBar score={val} w="100%" h={4} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* 5 — CROSS-DIMENSIONAL RISK & READINESS PATTERNS */}
        {card(
          <>
            <SectionHead label="Cross-Dimensional Risk & Readiness Patterns" T={T} />
            {patterns.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.map((p, i) => {
                  const isRed = p.sev === 'red', isAmber = p.sev === 'amber';
                  const bg = isRed ? T.rdP : isAmber ? T.amP : T.gnP;
                  const bc = isRed ? T.rd : isAmber ? T.am : T.gn;
                  return (
                    <div key={i} style={{ background: bg, border: `1px solid ${bc}35`, borderRadius: '10px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: bc, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{isRed ? '🔴' : isAmber ? '🟡' : '🟢'} {p.name}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: T.t0, marginBottom: '6px' }}>{p.headline}</div>
                      <div style={{ fontSize: '12px', color: T.t1, lineHeight: '1.65', marginBottom: p.action ? '10px' : '0' }}>{p.detail}</div>
                      {p.action && <div style={{ fontSize: '12px', fontWeight: '700', color: T.t0, background: T.b0, padding: '10px 12px', borderRadius: '7px', borderLeft: `3px solid ${bc}` }}><strong>HR Action:</strong> {p.action}</div>}
                    </div>
                  );
                })}
              </div>
            ) : <div style={{ padding: '20px', background: T.b0, borderRadius: '8px', fontSize: '13px', color: T.t2 }}>No significant cross-dimensional patterns detected.</div>}
          </>
        )}

        {/* 6 — ROLE SUITABILITY MATRIX */}
        {card(
          <>
            <SectionHead label="Role Suitability Matrix" T={T} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `2px solid ${T.b2}` }}>
                  {['Role Family', 'Score', 'Profile', 'Verdict', 'Guidance'].map(h => <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.t3, fontFamily: "'IBM Plex Mono',monospace" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {roles.map((r, i) => {
                    const rat = r.score >= r.g ? 'green' : r.score >= r.a ? 'amber' : 'red';
                    const col = rat === 'green' ? T.gn : rat === 'amber' ? T.am : T.rd;
                    const lbl = rat === 'green' ? '✅ Suitable' : rat === 'amber' ? '⚠️ Conditional' : '🚫 Not Recommended';
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.b1}` }}>
                        <td style={{ padding: '10px', fontSize: '12px', fontWeight: '700', color: T.t0 }}>{r.name}</td>
                        <td style={{ padding: '10px' }}><ScoreBadge score={r.score} T={T} /></td>
                        <td style={{ padding: '10px', width: '100px' }}><MiniBar score={r.score} w="100%" h={6} /></td>
                        <td style={{ padding: '10px', fontSize: '11px', fontWeight: '800', color: col }}>{lbl}</td>
                        <td style={{ padding: '10px', fontSize: '11px', color: T.t2 }}>{rat === 'red' ? r.redNote : rat === 'amber' ? 'Structured onboarding + milestones.' : 'Standard performance management applies.'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 7 — SUCCESSION PIPELINE INDICATORS (new grouping, existing data) */}
        {card(
          <>
            <SectionHead label="Succession Pipeline Indicators" T={T} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: T.bg3, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '8px' }}>Leadership Readiness Score</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: bCol(CI.LRS || 0, T), fontWeight: '700' }}>{CI.LRS || '—'}</div>
                <div style={{ fontSize: '11px', color: T.t2, marginTop: '4px' }}>Composite of Conscientiousness, Social Confidence, Learning Agility, Ethical Orientation, Emotional Resilience.</div>
              </div>
              <div style={{ background: T.bg3, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '8px' }}>Pipeline Track</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: T.t0, marginBottom: '4px' }}>{isJunior ? 'Future Leadership Track' : 'Senior Leadership Track'}</div>
                <div style={{ fontSize: '11px', color: T.t2 }}>{isJunior ? 'Early-career candidate — evaluated against a future-readiness threshold, not current-seniority benchmarks.' : 'Evaluated directly against senior leadership/executive readiness benchmarks.'}</div>
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: T.t3, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '8px' }}>Supporting Learning Agility Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {LA_KEYS.map(({ k, l }) => (
                <div key={k} style={{ background: T.bg3, borderRadius: '7px', padding: '10px', textAlign: 'center', border: `1px solid ${T.b1}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', color: T.t3, textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700', lineHeight: '1.3' }}>{l}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#3B82F6', fontWeight: '700' }}>{S[k] || 0}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 8 — FIVE FOUNDATIONAL MODULES */}
        {[
          { title: 'Personality at Work — OCEAN Framework', col: '#EC4899', dims: [['O', 'Openness to Experience', S.O], ['C', 'Conscientiousness', S.C], ['E', 'Extraversion', S.E], ['A', 'Agreeableness', S.A], ['ES', 'Emotional Stability (inv.)', S.ES]] },
          { title: 'Cultural Intelligence (CQ)', col: '#06B6D4', dims: CQ_KEYS.map(({ k, l }) => [k, l, S[k]]) },
          { title: 'Organisational Citizenship Behaviour (OCB)', col: '#F97316', dims: OCB_KEYS.map(({ k, l }) => [k, l, S[k]]) },
          { title: 'Adaptive Thinking & Learning Agility', col: '#3B82F6', dims: LA_KEYS.map(({ k, l }) => [k, l, S[k]]) },
          { title: 'Integrity & Ethical Orientation', col: '#7C3AED', dims: EO_KEYS.map(({ k, l }) => [k, l, S[k]]) },
        ].map((mod, i) => card(
          <div key={i}>
            <SectionHead label={mod.title} T={T} color={mod.col} />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mod.dims.length},1fr)`, gap: '8px' }}>
              {mod.dims.map(([k, l, v]) => (
                <div key={k} style={{ background: T.bg3, borderRadius: '7px', padding: '10px', textAlign: 'center', border: `1px solid ${T.b1}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', color: T.t3, textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700', lineHeight: '1.3' }}>{l}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: mod.col, fontWeight: '700' }}>{v || 0}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', color: T.t3, marginTop: '3px' }}>{bd(v || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 9 — GAME PERFORMANCE */}
        {gs && Object.keys(gs).length > 0 && card(
          <>
            <SectionHead label="Performance Challenge Results" T={T} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `1px solid ${T.b2}` }}>{['Challenge', 'Performance', 'Modifier', 'Dimensions'].map(h => <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.t3, fontFamily: "'IBM Plex Mono',monospace" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { t: 'Values in Balance', perf: gs.seesaw?.label || '—', pts: `${(gs.seesaw?.bonus || 0) >= 0 ? '+' : ''}${gs.seesaw?.bonus || 0}`, dims: 'Ethical Reasoning', col: (gs.seesaw?.bonus || 0) >= 0 ? T.gn : T.rd },
                    { t: 'Quick Decision Challenge', perf: gs.scenario1?.label || '—', pts: `${(gs.scenario1?.raw || 0) >= 0 ? '+' : ''}${gs.scenario1?.raw || 0}`, dims: 'People Agility, Transparency', col: (gs.scenario1?.raw || 0) >= 0 ? T.gn : T.rd },
                    { t: 'Ethics Under Pressure', perf: gs.scenario2?.label || '—', pts: `${(gs.scenario2?.raw || 0) >= 0 ? '+' : ''}${gs.scenario2?.raw || 0}`, dims: 'Rule Compliance, Authentic Integrity', col: (gs.scenario2?.raw || 0) >= 0 ? T.gn : T.rd },
                  ].map((g, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.b1}` }}>
                      <td style={{ padding: '10px', fontSize: '12px', fontWeight: '700', color: T.t0 }}>{g.t}</td>
                      <td style={{ padding: '10px' }}><Pill label={g.perf} color={g.col} style={{ fontSize: '9px' }} /></td>
                      <td style={{ padding: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: '800', color: g.col }}>{g.pts}</td>
                      <td style={{ padding: '10px', fontSize: '11px', color: T.t2 }}>{g.dims}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 10 — INDUSTRY LENS */}
        {candidate.industry && typeof IND !== 'undefined' && IND[candidate.industry] && (
          <div style={{ background: T.bg3, borderRadius: '10px', padding: '16px 18px', border: `1px solid ${T.b2}`, marginBottom: '14px' }}>
            <SectionHead label={`Industry Lens — ${candidate.industry}`} T={T} />
            <div style={{ fontSize: '12px', color: T.t1, lineHeight: '1.65', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: IND[candidate.industry].lens }} />
            <div style={{ fontSize: '12px', color: T.t1, marginBottom: '4px' }}><strong>High Potential Benchmark:</strong> {IND[candidate.industry].hiPotential}</div>
            <div style={{ fontSize: '12px', color: T.rd }}><strong>Industry Risk Note:</strong> {IND[candidate.industry].riskNote}</div>
          </div>
        )}

        {/* 11 — INTEGRITY STATEMENT */}
        <div style={{ fontFamily: "'JetBrains Mono',monospace", background: T.bg2, border: `1px solid ${T.b2}`, borderRadius: '10px', padding: '16px 20px', marginBottom: '14px', fontSize: '10.5px', color: T.t2, lineHeight: '1.7' }}>
          <strong style={{ color: T.t0 }}>Assessment Integrity Statement:</strong> CORE is a self-report instrument with four built-in validity controls. Dimension scores and composite indices are diagnostic inputs — not standalone hiring, promotion, or succession decisions. All red-rated patterns and readiness verdicts require triangulation with a structured behavioural interview before final HR decision. Copyright: Carnelian Pvt Ltd. Licensed use only.
        </div>
      </div>

      <TechnicalReportDownloadBtn candidate={candidate} T={T} />
    </div>
  );
};


// ─── TECHNICAL REPORT PDF EXPORTER (clean, logoed, print-authored) ───────
const TechnicalReportDownloadBtn = ({ candidate, T }) => {
  const rd       = candidate.report_data || {};
  const S        = rd.scores    || {};
  const validity = rd.validity  || {};
  const profile  = rd.profile   || {};
  const roles    = rd.roles     || [];
  const patterns = rd.patterns  || [];
  const CI       = rd.CI        || {};
  const today    = new Date(candidate.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const docId    = candidate.doc_id;
  const name     = candidate.name || rd.respondent?.name || 'Candidate';

  const isJunior = (() => {
    const exp = candidate.experience || rd.respondent?.exp || '';
    const lvl = candidate.level || rd.respondent?.level || '';
    return exp === '0–2 years' || exp === '3–5 years' || lvl.includes('Entry') || lvl.includes('Junior');
  })();

  const suppressed = validity.overall === 'red' && validity.extRatio > 0.85;

  const hiringRole     = roles.find(r => !['Senior Leadership / Executive', 'Future Leadership Potential', 'People Management / Team Lead', 'Peer Coordination / Project Support'].includes(r.name));
  const promotionRole  = roles.find(r => r.name === 'People Management / Team Lead' || r.name === 'Peer Coordination / Project Support');
  const successionRole = roles.find(r => r.name === 'Senior Leadership / Executive' || r.name === 'Future Leadership Potential');
  const verdictOf = (r) => {
    if (!r) return ['N/A', PRT.faint, null];
    const rat = r.score >= r.g ? 'green' : r.score >= r.a ? 'amber' : 'red';
    return [rat === 'green' ? 'Suitable' : rat === 'amber' ? 'Conditional' : 'Not Recommended', rat === 'green' ? PRT.gn : rat === 'amber' ? PRT.am : PRT.rd, r.score];
  };
  const [hiringLbl, hiringCol, hiringScore]       = verdictOf(hiringRole);
  const [promoLbl, promoCol, promoScore]          = verdictOf(promotionRole);
  const [succLbl, succCol, succScore]             = verdictOf(successionRole);

  // ── pages ──
  const pages = [];

  // Cover
  pages.push(
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CoreLogo h={38} />
        <PrLabel c={PRT.faint}>CORE BY CARNELIAN · RESTRICTED</PrLabel>
      </div>
      <div style={{ marginTop: 54 }}>
        <PrLabel style={{ marginBottom: 6 }}>TECHNICAL REPORT · HIRING · PROMOTION · SUCCESSION</PrLabel>
        <PrHead size={26}>{name}</PrHead>
      </div>
      <div style={{ display: 'flex', gap: 10, margin: '34px 0' }}>
        {[
          ['Hiring Fit', hiringLbl, hiringCol, hiringScore],
          ['Promotion', promoLbl, promoCol, promoScore],
          ['Succession', succLbl, succCol, succScore],
        ].map(([l, v, c, sc], i) => (
          <div key={i} style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${c}`, padding: '14px' }}>
            <PrLabel c={c}>{l.toUpperCase()}</PrLabel>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: PRT.ink, marginTop: 6 }}>{v}</div>
            {sc != null && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: c, fontWeight: 700, marginTop: 4 }}>{sc}/100</div>}
          </div>
        ))}
      </div>
      <PrMeta rows={[
        ['Candidate', name],
        ['Role / Department', `${candidate.role || '—'}${candidate.department ? ` · ${candidate.department}` : ''}`],
        ['Industry', candidate.industry || 'Unspecified'],
        ['Experience', candidate.experience || 'Unspecified'],
        ['Profile', profile.name || candidate.profile_name || '—'],
        ['Overall Score', `${S.overall || candidate.overall_score}/100`],
        ['Response Validity', validity.overallLabel || 'Unknown'],
        ['Assessment Date', today],
        ['Report ID', docId],
        ['Classification', 'Restricted. HR leadership only'],
      ]} />
      <div style={{ background: PRT.panel, border: `1px solid ${PRT.line}`, padding: '10px 14px', marginTop: 14, textAlign: 'center' }}>
        <PrBody size={7.8} color={PRT.faint}>
          <span style={{ fontWeight: 800, color: PRT.sub }}>CONFIDENTIAL.</span> Diagnostic input for hiring, promotion, and succession decisions. Not a standalone verdict — triangulate with a structured interview. Prepared by Carnelian Co.
        </PrBody>
      </div>
    </>
  );

  // Validity + Decision Snapshot
  pages.push(
    <>
      <PrSectionHead num="1" title="Response Validity" sub="Whether the figures in this report can be trusted for a decision." />
      <PrTable cols={['Check', 'Result']} widths={[220, undefined]} rows={[
        ['Overall', validity.overallLabel || 'Unknown'],
        ['L-Scale agreements', `${validity.lAgree ?? '—'}/10`],
        ['Strongly-agree rate', `${Math.round((validity.saRatio || 0) * 100)}%`],
        ['Extreme response rate', `${Math.round((validity.extRatio || 0) * 100)}%`],
        ['Internal consistency', `${validity.conScore ?? '—'}/100`],
      ]} style={{ marginBottom: 20 }} />
      <PrSectionHead num="2" title="Decision Readiness Snapshot" sub="One verdict per decision type, drawn from the composite indices most relevant to each." />
      {suppressed ? (
        <PrNote title="SUPPRESSED" color={PRT.rd}>Extreme response pattern detected — all readiness verdicts are unreliable. A supervised retake is required before this candidate is used in any decision.</PrNote>
      ) : (
        <PrTable cols={['Decision', 'Best-Fit Role', 'Score', 'Verdict', 'Driven By']} widths={[110, 170, 55, 110, undefined]} rows={[
          ['Hiring', hiringRole?.name || '—', hiringScore ?? '—', <span style={{ color: hiringCol, fontWeight: 700 }}>{hiringLbl}</span>, 'CII · OPS · SES'],
          ['Promotion', promotionRole?.name || '—', promoScore ?? '—', <span style={{ color: promoCol, fontWeight: 700 }}>{promoLbl}</span>, 'LRS · PMS · TVS'],
          ['Succession', successionRole?.name || '—', succScore ?? '—', <span style={{ color: succCol, fontWeight: 700 }}>{succLbl}</span>, 'LRS · ADS · CII'],
        ]} />
      )}
    </>
  );

  // Composite Decision Indices
  pages.push(
    <>
      <PrSectionHead num="3" title="Composite Decision Indices" sub="Your seven composite indices, grouped by which decision they inform." />
      {Object.entries(DECISION_INDEX_GROUPS).map(([gk, g], gi) => (
        <div key={gk} style={{ marginBottom: 16 }}>
          <PrLabel c={g.color}>{g.label.toUpperCase()}</PrLabel>
          <PrTable cols={['Index', 'Score', 'Band']} widths={[undefined, 70, 100]} style={{ marginTop: 8 }} rows={g.keys.map(k => {
            const def = COMPOSITE_KEYS.find(c => c.k === k);
            const val = CI[k] || S[k] || 0;
            return [def?.l || k, <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: prCol(val) }}>{val}</span>, <span style={{ color: prCol(val), fontWeight: 700 }}>{prBandName(val)}</span>];
          })} />
        </div>
      ))}
    </>
  );

  // Cross-Dimensional Patterns
  pages.push(
    <>
      <PrSectionHead num="4" title="Cross-Dimensional Risk & Readiness Patterns" sub="Interaction effects between dimensions that a single score would miss." />
      {patterns.length > 0 ? patterns.map((p, i) => (
        <PrNote key={i} title={`${p.sev === 'red' ? 'RISK' : p.sev === 'amber' ? 'WATCH' : 'STRENGTH'} · ${p.name.toUpperCase()}`} color={p.sev === 'red' ? PRT.rd : p.sev === 'amber' ? PRT.am : PRT.gn} style={{ marginBottom: 10 }}>
          <strong style={{ color: PRT.ink }}>{p.headline}</strong><br/>{p.detail}{p.action ? <><br/><strong style={{ color: PRT.ink }}>HR Action:</strong> {p.action}</> : ''}
        </PrNote>
      )) : <PrBody>No significant cross-dimensional patterns detected for this candidate.</PrBody>}
    </>
  );

  // Role Suitability Matrix
  pages.push(
    <>
      <PrSectionHead num="5" title="Role Suitability Matrix" sub="Composite index-based deployment guide across role families." />
      <PrTable cols={['Role Family', 'Score', 'Verdict', 'Guidance']} widths={[170, 60, 130, undefined]} fontSize={8.6} rows={roles.map(r => {
        const rat = r.score >= r.g ? 'green' : r.score >= r.a ? 'amber' : 'red';
        const col = rat === 'green' ? PRT.gn : rat === 'amber' ? PRT.am : PRT.rd;
        const lbl = rat === 'green' ? 'Suitable' : rat === 'amber' ? 'Conditional' : 'Not Recommended';
        return [r.name, <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: col }}>{r.score}</span>, <span style={{ color: col, fontWeight: 700 }}>{lbl}</span>, rat === 'red' ? r.redNote : rat === 'amber' ? 'Structured onboarding + defined milestones.' : 'Standard performance management applies.'];
      })} />
    </>
  );

  // Succession Pipeline
  pages.push(
    <>
      <PrSectionHead num="6" title="Succession Pipeline Indicators" sub="Leadership readiness signal and the learning-agility profile behind it." />
      <PrStats items={[
        [CI.LRS ?? '—', 'Leadership Readiness Score'],
        [isJunior ? 'Future' : 'Senior', 'Pipeline Track'],
        [S.LAavg ?? '—', 'Learning Agility (avg)'],
        [S.EOavg ?? '—', 'Ethical Orientation (avg)'],
      ]} />
      <div style={{ height: 16 }} />
      <PrBody style={{ marginBottom: 12 }}>
        {isJunior
          ? 'Early-career candidate — evaluated against a future-readiness threshold, not current-seniority benchmarks. Development investment now compounds fastest for this pipeline stage.'
          : 'Evaluated directly against senior leadership and executive readiness benchmarks.'}
      </PrBody>
      <PrTable cols={['Learning Agility Sub-Dimension', 'Score']} widths={[undefined, 80]} rows={LA_KEYS.map(({ k, l }) => [l, <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: prCol(S[k] || 0) }}>{S[k] || 0}</span>])} />
    </>
  );

  // Five modules (condensed, two per page pair)
  const moduleSet = [
    { title: 'Personality at Work (OCEAN)', rows: [['O', 'Openness', S.O], ['C', 'Conscientiousness', S.C], ['E', 'Extraversion', S.E], ['A', 'Agreeableness', S.A], ['ES', 'Emotional Stability', S.ES]] },
    { title: 'Cultural Intelligence', rows: CQ_KEYS.map(({ k, l }) => [k, l, S[k]]) },
    { title: 'Organisational Citizenship Behaviour', rows: OCB_KEYS.map(({ k, l }) => [k, l, S[k]]) },
    { title: 'Learning Agility', rows: LA_KEYS.map(({ k, l }) => [k, l, S[k]]) },
    { title: 'Integrity & Ethical Orientation', rows: EO_KEYS.map(({ k, l }) => [k, l, S[k]]) },
  ];
  pages.push(
    <>
      <PrSectionHead num="7" title="Foundational Modules" sub="The five underlying modules behind the composite indices above." />
      {moduleSet.slice(0, 3).map((m, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <PrLabel>{m.title.toUpperCase()}</PrLabel>
          <PrTable cols={['Dimension', 'Score', 'Band']} widths={[undefined, 70, 100]} style={{ marginTop: 8 }} rows={m.rows.map(([k, l, v]) => [l, <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: prCol(v || 0) }}>{v || 0}</span>, <span style={{ color: prCol(v || 0), fontWeight: 700 }}>{prBandName(v || 0)}</span>])} />
        </div>
      ))}
    </>
  );
  pages.push(
    <>
      <PrSectionHead title="Foundational Modules (continued)" />
      {moduleSet.slice(3).map((m, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <PrLabel>{m.title.toUpperCase()}</PrLabel>
          <PrTable cols={['Dimension', 'Score', 'Band']} widths={[undefined, 70, 100]} style={{ marginTop: 8 }} rows={m.rows.map(([k, l, v]) => [l, <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: prCol(v || 0) }}>{v || 0}</span>, <span style={{ color: prCol(v || 0), fontWeight: 700 }}>{prBandName(v || 0)}</span>])} />
        </div>
      ))}
      {candidate.industry && typeof IND !== 'undefined' && IND[candidate.industry] && (
        <PrNote title={`INDUSTRY LENS — ${candidate.industry.toUpperCase()}`} color={PRT.gold} style={{ marginTop: 8 }}>
          {IND[candidate.industry].hiPotential}
        </PrNote>
      )}
    </>
  );

  // Close / integrity statement
  pages.push(
    <>
      <PrSectionHead title="Assessment Integrity Statement" />
      <PrBody>
        CORE is a self-report instrument with four built-in validity controls. Dimension scores and composite indices are diagnostic inputs — not standalone hiring, promotion, or succession decisions. All red-rated patterns and readiness verdicts require triangulation with a structured behavioural interview before any final HR decision. Composite index weightings are derived from published meta-analytic evidence.
      </PrBody>
      <div style={{ height: 16 }} />
      <PrBody size={8} color={PRT.faint}>Copyright Carnelian Pvt Ltd. Licensed use only. hello@carnelianco.com</PrBody>
    </>
  );

  const total = pages.length;
  const pid = i => `techpr-pg-${docId}-${i}`;
  const ids = pages.map((_, i) => pid(i));
  const footerLeft = `Technical Report · ${name}`;

  return (
    <div style={{ marginTop: 24 }}>
      <PrStyles />
      <PrDownloadBtn ids={ids} filename={`${name.replace(/\s+/g, '_')}_Technical_Report.pdf`} />
      {/* Hidden authored pages, captured for the PDF only */}
      <div style={{ position: 'fixed', top: -99999, left: -99999, pointerEvents: 'none' }}>
        {pages.map((body, i) => (
          <PrPage key={i} id={pid(i)} pageNo={i + 1} total={total} footerLeft={footerLeft} footerRight="Restricted: HR Leadership Only">{body}</PrPage>
        ))}
      </div>
    </div>
  );
};

// ─── ACTION PLAN REPORT (candidate development roadmap) ───────
// Shared authored-page PDF exporter for the Action Plan, identical output to the participant-side download.
const ActionPlanDownloadBtn = ({ R, S, CI, profile, allDims, top2, bot2, devAreas, resources, relapse, programs, pdfBusy, setPdfBusy }) => {
  const download = async () => {
    setPdfBusy('Loading export engine…');
    try {
      const loadScript = (src) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.body.appendChild(s);
      });
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      if (document.fonts && document.fonts.ready) { await document.fonts.ready; }

      const { jsPDF } = window.jspdf;
      const A4_W = 210, A4_H = 297;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      const date = new Date(R.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
      const docId = R.doc_id;

      const C = '#B01C24', GOLD = '#A07830', INK = '#1A1414', SUB = '#4A3F3F', FAINT = '#8C7F7F',
            LINE = '#E5DEDE', PANEL = '#FAF7F5', BG = '#FFFFFF', GN = '#15803D', AM = '#B45309', RD = '#B91C1C',
            GNs = '#E9F4EC', AMs = '#FBF1E4', RDs = '#FBEAEA';
      const band = v => v >= 75 ? ['Strong', GN, GNs] : v >= 50 ? ['Developing', AM, AMs] : ['Priority', RD, RDs];
      const esc = s => (s || '').toString();
      const tableBlock = (headers, widths, rows, cellFont) => {
        const fs = cellFont || '9.3px';
        const headerRow = `<div style="display:flex;background:${PANEL};border-bottom:2px solid ${LINE};">${headers.map((h,i)=>`<div style="width:${widths[i]};box-sizing:border-box;padding:8px 10px;font-family:'IBM Plex Mono',monospace;font-size:7.2px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${SUB};">${esc(h)}</div>`).join('')}</div>`;
        const bodyRows = rows.map((r, ri) => `<div style="display:flex;${ri<rows.length-1?`border-bottom:1px solid ${LINE};`:''}">${r.map((c,ci)=>`<div style="width:${widths[ci]};box-sizing:border-box;padding:7px 10px;font-size:${fs};color:${INK};line-height:1.5;">${c}</div>`).join('')}</div>`).join('');
        return `<div style="border:1px solid ${LINE};">${headerRow}${bodyRows}</div>`;
      };

      let LOGO_SVG = `<div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:${C};">CORE <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:${FAINT};letter-spacing:0.14em;">BY CARNELIAN</span></div>`;
      try {
        const logoResp = await fetch(`${window.location.origin}/core-logo-for-light-mode.svg`);
        if (logoResp.ok) {
          let raw = await logoResp.text();
          raw = raw.replace(/<svg([^>]*)>/i, (m, attrs) => `<svg${attrs.replace(/\s(width|height)="[^"]*"/gi, '')} height="28" style="display:block;height:28px;width:auto;">`);
          LOGO_SVG = `<div style="display:flex;align-items:center;justify-content:flex-start;height:28px;">${raw}</div>`;
        }
      } catch (e) { /* falls back to the wordmark above */ }

      const pageShell = (bodyHtml, pageLabel) => `
        <div style="width:794px;min-height:1122px;background:${BG};font-family:'Public Sans',sans-serif;padding:50px 54px 60px;box-sizing:border-box;position:relative;">
          <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C},${GOLD},transparent 70%);"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
            ${LOGO_SVG}
            <div style="font-family:'IBM Plex Mono',monospace;font-size:7.5px;color:${FAINT};letter-spacing:0.12em;">PERSONAL & CONFIDENTIAL · ${esc(pageLabel)}</div>
          </div>
          ${bodyHtml}
          <div style="position:absolute;left:54px;right:54px;bottom:22px;border-top:1px solid ${LINE};padding-top:8px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:7px;color:${FAINT};">
            <span>${esc(R.name)} · CORE Personal Development Report</span>
            <span>${esc(docId)} · ${esc(date)}</span>
          </div>
        </div>`;

      const sectionHead = (label, title, sub) => `
        <div style="margin-bottom:16px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:700;letter-spacing:0.16em;color:${C};text-transform:uppercase;margin-bottom:4px;">${esc(label)}</div>
          <div style="font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:${INK};">${esc(title)}</div>
          ${sub ? `<div style="font-family:'Public Sans',sans-serif;font-size:9.5px;color:${FAINT};margin-top:5px;">${esc(sub)}</div>` : ''}
          <div style="height:2px;background:linear-gradient(90deg,${C},${GOLD},transparent);margin-top:9px;"></div>
        </div>`;

      const keyBlock = (rows) => `
        <div style="background:${PANEL};border:1px solid ${LINE};border-left:3px solid ${GOLD};padding:11px 14px;margin-bottom:16px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:0.14em;color:${GOLD};text-transform:uppercase;margin-bottom:7px;">Key for this page</div>
          ${rows.map(([k,v]) => `<div style="display:flex;gap:10px;margin-bottom:4px;font-size:8.7px;line-height:1.5;"><div style="width:130px;flex-shrink:0;font-weight:700;color:${INK};">${esc(k)}</div><div style="color:${SUB};">${esc(v)}</div></div>`).join('')}
        </div>`;

      const p1 = pageShell(`
        <div style="margin-top:30px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:700;letter-spacing:0.16em;color:${GOLD};text-transform:uppercase;margin-bottom:8px;">Personal CORE Development Report</div>
          <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:${INK};margin-bottom:18px;">${esc(R.name)}</div>
          <div style="font-family:'Public Sans',sans-serif;font-size:11px;color:${SUB};line-height:1.7;max-width:560px;">This report is written directly to you, not to your manager or HR. It translates your assessment results into specific, actionable guidance: what your scores mean, where your genuine strengths are, what to develop, and exactly how.</div>
        </div>
        <div style="margin:34px 0;padding:22px 24px;background:${PANEL};border:1px solid ${LINE};border-left:4px solid ${C};">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:700;letter-spacing:0.14em;color:${GOLD};text-transform:uppercase;margin-bottom:7px;">Professional Profile</div>
          <div style="font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:${INK};margin-bottom:9px;">${esc(profile?.name || 'Professional Profile')}</div>
          <div style="font-family:'Public Sans',sans-serif;font-size:11px;color:${SUB};line-height:1.65;">${esc(profile?.desc || '')}</div>
          ${profile?.devNote ? `<div style="margin-top:12px;padding:11px 13px;background:${BG};border-left:3px solid ${GOLD};font-size:10px;color:${SUB};line-height:1.6;">${esc(profile.devNote)}</div>` : ''}
        </div>
        ${tableBlock(['Field','Value'], ['180px','flex:1'], [
          ['Date', esc(date)], ['Experience', esc(R.experience || 'Unspecified')], ['Purpose', esc(R.purpose || 'Unspecified')],
          ['Industry', esc(R.industry || 'Unspecified')], ['Report ID', esc(docId)],
        ].map(([k,v]) => [`<span style="font-family:'IBM Plex Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:0.1em;color:${FAINT};text-transform:uppercase;">${k}</span>`, `<span style="font-size:10px;color:${INK};font-weight:600;">${v}</span>`]))}
        <div style="margin-top:20px;padding:12px 16px;background:${PANEL};border:1px solid ${LINE};font-size:8.3px;color:${FAINT};line-height:1.6;">
          <strong style="color:${SUB};">CONFIDENTIAL.</strong> Prepared for personal use by Carnelian Co. Not a performance appraisal. Questions: hello@carnelianco.com
        </div>
      `, 'Cover');

      const dimRows = allDims.map(d => { const [bl,bc] = band(d.v); return [`<span style="font-weight:600;">${esc(d.l)}</span>`, `<span style="font-family:'IBM Plex Mono',monospace;font-weight:700;color:${bc};">${d.v}/100</span>`, `<span style="font-weight:700;color:${bc};">${bl}</span>`]; });
      const idxRows = [['CII','Compliance & Integrity',CI.CII],['LRS','Leadership Readiness',CI.LRS],['TVS','Team Value',CI.TVS],['ADS','Adaptability',CI.ADS],['SES','Stakeholder Engagement',CI.SES],['OPS','Operations',CI.OPS],['PMS','People Management',CI.PMS]]
        .map(([k,l,v]) => { const [bl,bc] = band(v); return [`<span style="font-family:'IBM Plex Mono',monospace;font-weight:800;color:${C};">${k}</span>`, `<span style="font-weight:600;">${esc(l)}</span>`, `<span style="font-family:'IBM Plex Mono',monospace;font-weight:700;color:${bc};">${v}</span>`]; });
      const p2 = pageShell(`
        ${sectionHead('Section 1', 'Score Profile at a Glance', 'Nine behavioural dimensions, ranked, plus the seven composite indices built from them.')}
        ${keyBlock([['Bands', '75+ is a genuine strength. 50 to 74 is developing. Below 50 is the priority — the plan below is built around it.'], ['Indices', 'Composite indices combine several dimensions to show how they interact, weighted for their role relevance.']])}
        ${tableBlock(['Dimension','Score','Band'], ['55%','20%','25%'], dimRows)}
        <div style="margin-bottom:20px;"></div>
        <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin-bottom:8px;">Seven Composite Indices</div>
        ${tableBlock(['Code','Index','Score'], ['15%','60%','25%'], idxRows)}
      `, 'Score Profile');

      const strengthCard = (d) => `<div style="border:1px solid ${LINE};border-left:4px solid ${GN};background:${GNs};padding:14px 16px;margin-bottom:10px;"><div style="font-family:'IBM Plex Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:0.12em;color:${GN};text-transform:uppercase;margin-bottom:5px;">Core Strength</div><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${INK};margin-bottom:6px;">${esc(d.l)} <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:${GN};font-weight:700;">${d.v}/100</span></div><div style="font-size:9.3px;color:${SUB};line-height:1.55;">${esc(d.str)}</div></div>`;
      const growthCard = (d) => `<div style="border:1px solid ${LINE};border-left:4px solid ${RD};background:${RDs};padding:14px 16px;margin-bottom:10px;"><div style="font-family:'IBM Plex Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:0.12em;color:${RD};text-transform:uppercase;margin-bottom:5px;">Priority Development Area</div><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${INK};margin-bottom:6px;">${esc(d.l)} <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:${RD};font-weight:700;">${d.v}/100</span></div><div style="font-size:9.3px;color:${SUB};line-height:1.55;">${esc(d.gap || 'A core driver of professional effectiveness and the highest-leverage development opportunity right now.')}</div></div>`;
      const p3 = pageShell(`
        ${sectionHead('Section 2', 'What They Are Good At, And Where To Grow', 'The two clearest strengths, and the two areas this development plan targets.')}
        ${keyBlock([['How these were picked', 'Nine dimensions ranked highest to lowest. The top two are the anchor strengths. The bottom two are the priority development areas, the focus of Section 3.']])}
        ${top2.map(strengthCard).join('')}
        ${bot2.map(growthCard).join('')}
      `, 'Strengths & Growth');

      const roadmapPages = devAreas.map((d, i) => {
        const stepRows = (d.habits || []).filter(h => h && (h.h || h.t)).map((h, j) => {
          const phase = j < 2 ? ['Days 1–30', RD, RDs] : j < 5 ? ['Days 30–90', AM, AMs] : ['Days 90–180', GN, GNs];
          return [
            `<span style="font-family:'IBM Plex Mono',monospace;font-weight:800;color:${phase[1]};">${j+1}</span>`,
            `<span style="font-family:'IBM Plex Mono',monospace;font-size:6.8px;font-weight:700;letter-spacing:0.06em;color:${phase[1]};background:${phase[2]};padding:2px 6px;border-radius:3px;">${phase[0]}</span>`,
            `<strong>${esc(h.h)}</strong> ${esc(h.t)}`,
          ];
        });
        return pageShell(`
          ${sectionHead(`Section 3.${i+1}`, d.dim, `Group average ${d.v}/100. A ten-step, week-by-week plan for this dimension.`)}
          <div style="background:${PANEL};border:1px solid ${LINE};border-left:4px solid ${GOLD};padding:12px 14px;margin-bottom:14px;font-size:9.3px;color:${SUB};line-height:1.6;">${esc(d.why)}</div>
          ${tableBlock(['#','Window','Action'], ['6%','18%','76%'], stepRows, '9px')}
        `, `Roadmap · ${d.dim}`);
      });

      const TYPE_COLOR = { book: ['#1D4ED8', '#DBEAFE', 'BOOK'], ted: ['#B91C1C', '#FBEAEA', 'TED TALK'], youtube: ['#0F766E', '#E6F5F2', 'YOUTUBE'], article: ['#B45309', '#FBF1E4', 'ARTICLE'], course: ['#6D28D9', '#EEE9FB', 'COURSE'] };
      const resRows = resources.slice(0, 8).map(r => {
        const [tc, tbg, tlbl] = TYPE_COLOR[r.type] || [SUB, PANEL, (r.type || 'RESOURCE').toUpperCase()];
        return `<div style="border:1px solid ${LINE};border-left:4px solid ${tc};padding:10px 12px;margin-bottom:8px;background:${BG};"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;"><span style="font-size:9.8px;font-weight:800;color:${INK};">${esc(r.title)}</span><span style="font-family:'IBM Plex Mono',monospace;font-size:6.8px;font-weight:700;letter-spacing:0.06em;color:${tc};background:${tbg};padding:3px 7px;border-radius:3px;white-space:nowrap;">${tlbl}</span></div><div style="font-size:8.5px;color:${FAINT};font-weight:600;margin-bottom:4px;">${esc(r.author)}</div><div style="font-size:8.7px;color:${SUB};line-height:1.5;">${esc(r.why)}</div></div>`;
      }).join('');
      const protoRows = relapse.map(p => `<div style="border:1px solid ${LINE};padding:10px 12px;margin-bottom:8px;"><div style="font-size:9px;color:${INK};font-weight:700;margin-bottom:5px;"><span style="font-family:'IBM Plex Mono',monospace;font-size:7px;color:${RD};background:${RDs};padding:2px 6px;border-radius:3px;margin-right:6px;">IF</span>${esc(p.trigger)}</div><div style="font-size:8.8px;color:${SUB};line-height:1.5;"><span style="font-family:'IBM Plex Mono',monospace;font-size:7px;color:${GN};background:${GNs};padding:2px 6px;border-radius:3px;margin-right:6px;">THEN</span>${esc(p.response)}</div></div>`).join('');
      const p_resources = pageShell(`
        ${sectionHead('Section 4', 'Development Toolkit', 'Resources matched to the priority dimensions, and if-then protocols for when a habit breaks.')}
        <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin-bottom:8px;">Profile-Matched Resources</div>
        ${resRows}
        <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin:14px 0 8px;">If-Then Protocols</div>
        ${protoRows}
      `, 'Toolkit & Protocols');

      const FORMAT_COLOR = { Training: [GOLD, '#F6EFE2'], Coaching: ['#1D4ED8', '#DBEAFE'], Mentorship: [GN, GNs], Consulting: [C, RDs] };
      const progRows = programs.slice(0, 4).map(p => {
        const [fc, fbg] = FORMAT_COLOR[p.format] || [GOLD, '#F6EFE2'];
        return `<div style="border:1px solid ${LINE};border-left:4px solid ${fc};padding:11px 13px;margin-bottom:8px;"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;"><span style="font-size:10.3px;font-weight:800;color:${INK};">${esc(p.name)}</span>${p.format ? `<span style="font-family:'IBM Plex Mono',monospace;font-size:6.8px;font-weight:700;letter-spacing:0.06em;color:${fc};background:${fbg};padding:3px 7px;border-radius:3px;white-space:nowrap;">${esc(p.format).toUpperCase()}</span>` : ''}</div><div style="font-size:8.8px;color:${SUB};line-height:1.5;margin-bottom:4px;">${esc(p.desc)}</div><div style="font-size:8.3px;color:${GN};font-style:italic;">${esc(p.match || 'Recommended based on this profile.')}</div></div>`;
      }).join('');
      const matrixQuad = (title, items, col, bg) => `<div style="border:1px solid ${LINE};background:${bg};padding:12px 14px;"><div style="font-size:9.5px;font-weight:700;color:${col};margin-bottom:8px;">${esc(title)}</div>${items.map(d => `<div style="font-size:8.7px;color:${INK};font-weight:600;margin-bottom:3px;">${esc(d.l)} (${d.v}/100)</div>`).join('')}</div>`;
      const p_close = pageShell(`
        ${sectionHead('Section 5', 'Recommended Programmes & Priority Matrix')}
        <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin-bottom:8px;">Recommended Programmes · Carnelian</div>
        ${progRows}
        <div style="background:${C};border-radius:6px;padding:14px 16px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;">
          <div style="color:#fff;font-size:9.5px;font-weight:700;">Get in touch: hello@carnelianco.com</div>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin-bottom:8px;">Priority Action Matrix</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
          ${matrixQuad('Act Now', allDims.slice(7,9), RD, RDs)}
          ${matrixQuad('Build Soon', allDims.slice(5,7), AM, AMs)}
          ${matrixQuad('Sustain & Expand', allDims.slice(0,2), GN, GNs)}
          ${matrixQuad('Monitor Progress', allDims.slice(2,5), SUB, PANEL)}
        </div>
        <div style="background:${PANEL};border:1px solid ${LINE};padding:14px 16px;">
          <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${INK};margin-bottom:8px;">A Note to Close</div>
          <div style="font-size:9px;color:${SUB};line-height:1.65;">This report is a starting point, not a verdict. Every dimension measured here is developable with deliberate effort and the right support. Take one action from this report today. Growth begins with honest self-knowledge.</div>
        </div>
      `, 'Programmes & Close');

      const allPages = [p1, p2, p3, ...roadmapPages, p_resources, p_close];

      for (let i = 0; i < allPages.length; i++) {
        setPdfBusy(`Rendering page ${i + 1} of ${allPages.length}…`);
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
        container.innerHTML = allPages[i];
        document.body.appendChild(container);
        await new Promise(r => setTimeout(r, 120));
        const canvas = await window.html2canvas(container.children[0], { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' });
        document.body.removeChild(container);
        const imgData = canvas.toDataURL('image/jpeg', 0.94);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, A4_W, A4_H);
      }

      setPdfBusy('Saving…');
      pdf.save(`${R.name?.replace(/\s+/g,'_') || 'ActionPlan'}_CORE_ActionPlan.pdf`);
    } catch (e) {
      console.error('Action Plan PDF export failed', e);
      alert('Failed to generate the PDF. Please try again.');
    } finally {
      setPdfBusy(null);
    }
  };

  return (
    <button onClick={download} disabled={!!pdfBusy} style={{
      margin: '18px auto', padding: '13px 26px', borderRadius: 8, background: pdfBusy ? '#8C7F7F' : '#A07830',
      color: '#fff', border: 'none', cursor: pdfBusy ? 'wait' : 'pointer',
      fontFamily: "'Public Sans',sans-serif", fontSize: 13, fontWeight: 800, display: 'flex',
      justifyContent: 'center', alignItems: 'center', gap: 8, width: '100%', maxWidth: 794,
    }}>
      {pdfBusy || '⬇ Download Action Plan (PDF)'}
    </button>
  );
};

const ActionPlanReport = ({ candidate, T }) => {
  const [expandedSteps, setExpandedSteps] = useState({});
  const [pdfBusy, setPdfBusy] = useState(null);
  const rd      = candidate.report_data || {};
  const S       = rd.scores   || {};
  const CI      = rd.CI       || {};
  const profile = rd.profile  || {};
  const gs      = rd.gameSummary || {};
  const R       = candidate; 

  const allDims = [
    { k:'C',      l:'Conscientiousness',   v:S.C, str:'You are a highly reliable, organised professional. People can depend on you to deliver.' },
    { k:'O',      l:'Openness to Ideas',   v:S.O, str:'You bring genuine intellectual curiosity and creative problem-solving to your work.' },
    { k:'E',      l:'Social Confidence',   v:S.E, str:'You communicate with confidence and energy — effective in leadership.' },
    { k:'A',      l:'Collaborative Spirit',v:S.A, str:'You are empathetic and cooperative — a team builder who creates safe environments.' },
    { k:'ES',     l:'Emotional Resilience',v:S.ES, str:'You stay grounded under pressure — invaluable in high-stakes situations.' },
    { k:'CQavg',  l:'Cultural Intelligence',v:S.CQavg, str:"You navigate diverse professional landscapes with skill and genuine interest." },
    { k:'OCBavg', l:'Team Citizenship',    v:S.OCBavg, str:'You go well beyond your formal role to support colleagues and the institution.' },
    { k:'LAavg',  l:'Learning Agility',    v:S.LAavg, str:'You learn fast, reflect honestly, and apply lessons across domains.' },
    { k:'EOavg',  l:'Ethical Integrity',   v:S.EOavg, str:'Your commitment to transparency and authentic behaviour is rare and highly valued.' },
  ].filter(d => d.v != null).sort((a,b) => b.v-a.v);

  const top2 = allDims.slice(0,2);
  const bot2 = [...allDims].sort((a,b)=>a.v-b.v).slice(0,2);

  const ind = candidate.industry || '';
  const lvl = candidate.level || candidate.experience || '';
  const isBanking = ind.includes('Banking')||ind.includes('Insurance')||ind.includes('Takaful');
  const isGovt = ind.includes('Government')||ind.includes('Civil');
  const isDev = ind.includes('Development')||ind.includes('NGO');
  const isJunior = lvl.includes('Entry')||lvl.includes('Junior')||lvl.includes('0–2')||lvl.includes('3–5');
  const isSenior = lvl.includes('Senior')||lvl.includes('Executive')||lvl.includes('Director')||lvl.includes('C-Suite')||lvl.includes('16+');

  const ctxAction = (generic, bankAlt, govtAlt, devAlt, seniorAlt, juniorAlt) => {
    if(isSenior&&seniorAlt) return seniorAlt;
    if(isJunior&&juniorAlt) return juniorAlt;
    if(isBanking&&bankAlt) return bankAlt;
    if(isGovt&&govtAlt) return govtAlt;
    if(isDev&&devAlt) return devAlt;
    return generic;
  };

  const getDimContent = (dim) => {
    const map = {
      'Conscientiousness': {
        why: ctxAction(`Consistent delivery is the foundation of professional credibility${R.role ? ` in your role as ${R.role}` : ''}. Missed deadlines or incomplete work creates friction that compounds over time.`, "In banking, your reliability directly affects your institution's regulatory standing and client trust.", "In the civil service, your output accountability shapes public outcomes.", "Development sector programmes are accountable to donors, beneficiaries, and communities simultaneously.", "At your seniority level, your delivery sets the standard for the entire team.", "Early in your career, delivery reliability is how you build the professional reputation that opens every future door."),        
        now: ctxAction("Agree a weekly check-in with your supervisor on 3 explicit priority deliverables.","Book a 30-minute weekly slot with your line manager to review your open regulatory deliverables.","Schedule a weekly meeting with your supervisor to review your progress against departmental KPIs.","Set up a shared milestone tracker with your programme coordinator this week.","Send your team a written commitment list every Monday.","Have an honest conversation with your line manager this week about which current commitments you are most at risk of missing."),
        soon: ctxAction("Enrol in a personal productivity workshop or study one methodology (GTD, Agile personal planning).","Complete a structured time management or professional effectiveness programme.","Attend a civil service effectiveness workshop through your Training Institute.","Enrol in a project management short course.","Commission a team productivity audit to understand where delivery bottlenecks are systemic.","Attend a productivity and professional effectiveness workshop."),
        fut: ctxAction("Lead a project end-to-end within 6 months to build delivery confidence with structured accountability.","Take ownership of an end-to-end compliance or regulatory project.","Lead a cross-departmental working group to demonstrate sustained delivery over a 6-month period.","Lead a full programme cycle from design to donor reporting.","Commission an organisational review of how delivery accountability is structured across your team.","Ask to lead a complete project or initiative end-to-end."),
        acts: ["Use a weekly priority matrix every Monday.","Break large projects into milestone check-ins.","Track one commitment per week that you made and actually completed."]
      },
      'Emotional Resilience': {
        why: ctxAction(`High-stakes professional environments involve pressure cycles${R.role ? ` in a ${R.role} position` : ''}. Your ability to remain clear-headed under pressure is career-determining.`, "Banking environments are characterised by regulatory cycles, audit periods, and market pressure.", "Civil service reform creates sustained pressure on officers at all levels.", "Development sector professionals work in environments of resource constraints, community pressure, and donor scrutiny.", "At senior level, your emotional state sets the emotional tone for the entire team.", "Early career is when pressure tolerance is built."),        
        now: ctxAction("Identify one specific pressure source in your current role and have a direct conversation with your leadership about managing it structurally.","Ask your institution's HR team this week about EAP access and stress management resources.","Contact your Training Institute about resilience coaching resources available to civil service officers.","Speak to your programme director about workload distribution.","Identify one specific pressure source in your current role and have a direct conversation with your leadership.","Talk to your line manager this week about one specific pressure point in your role and what support is available."),
        soon: ctxAction("Attend a resilience or emotional intelligence workshop this quarter.","Attend a professional resilience workshop — specifically one designed for high-accountability financial environments.","Attend a public sector leadership and resilience programme.","Attend an NGO or development sector leadership workshop.","Commission an executive coaching engagement for yourself.","Attend an emotional intelligence or resilience workshop."),
        fut: ctxAction("Seek a role with progressively increasing accountability to build resilience through real-world exposure.","Seek out a role rotation that includes a high-pressure function.","Pursue a secondment or cross-posting to a reform-facing role.","Accept an assignment in a resource-constrained or high-stakes programme context.","Build a senior leadership resilience programme for your team.","Ask to be included in high-stakes projects where you will be stretched."),
        acts: ["Build a 10-minute daily decompression practice.","Write a post-incident reflection after a stressful event.","Identify 2 trusted sounding boards."]
      },
      'Learning Agility': {
        why: ctxAction(`The professionals who rise are those who learn and adapt fastest${R.role ? `, and this is especially true as a ${R.role}` : ''}. Current knowledge has a shelf life.`, "Pakistan's banking sector is changing faster than almost any other.", "Pakistan's civil service is in active reform.", "The development sector's evidence base evolves continuously.", "At your seniority level, your learning agility determines whether you remain strategically relevant.", "The first decade of a career is where learning habits are formed."),        
        now: ctxAction("Subscribe to one sector publication you do not currently follow.","Subscribe today to SBP's official regulatory updates.","Subscribe to an international public administration publication.","Subscribe to an international development sector publication.","Audit your team's current knowledge sources.","Identify one technical skill gap holding you back and find a resource for it."),
        soon: ctxAction("Build a 90-day self-directed learning plan on one topic outside your current expertise.","Build a 90-day learning plan on one banking domain outside your specialty.","Build a 90-day learning plan on one reform area relevant to your department.","Build a 90-day learning plan on a new methodology.","Implement a team-wide knowledge sharing protocol.","Complete a short certification in a new skill."),
        fut: ctxAction("Apply to facilitate or co-design a training or knowledge-sharing session.","Apply to co-design an internal knowledge-sharing session at your institution.","Apply to deliver a session at your Training Institute.","Apply to design a staff capacity building session for your programme team.","Sponsor an innovation initiative within your department.","Ask to present a new concept to the broader team."),
        acts: ["Dedicate 30 mins a week to reading an industry report.","Ask yourself what you learned after every major task.","Request candid feedback from a supervisor."]
      },
      'Social Confidence': {
        why: ctxAction(`Social confidence is a professional skill${R.role ? ` that shapes how far your work travels in a ${R.role} role` : ''}. Your ability to assert your perspective determines your influence.`,"In banking, stakeholder presence is a career-defining skill.","In government, your ability to communicate clearly determines your influence.","In the development sector, donor presentations require professionals who can project confidence.","At your seniority level, social confidence is the multiplier on every other strength you have.","Early in your career, social confidence determines whether your ideas get heard."),
        now: ctxAction("Have one conversation this week that you have been avoiding.","Schedule one client or regulatory conversation you have been postponing.","Initiate one interaction with a senior officer you have been avoiding.","Initiate one donor or partner conversation you have been postponing.","Have one high-visibility conversation this week that you would normally delegate.","Speak up in a meeting where you would normally stay silent."),
        soon: ctxAction("Enrol in a communication and influence workshop.","Attend a professional communication workshop designed for financial professionals.","Attend a public speaking programme through your Training Institute.","Attend a facilitation workshop for development sector professionals.","Commission an executive presence coaching engagement.","Join a public speaking group like Toastmasters."),
        fut: ctxAction("Seek a role or assignment that requires regular public speaking or stakeholder presentations.","Ask to lead the next client presentation.","Apply to represent your department at a public forum.","Apply to lead the next donor presentation.","Commit to speak at one external event or industry forum.","Ask to present in the next team meeting."),
        acts: ["Identify one conversation you've avoided and have it today.","Volunteer to speak first in at least one meeting per week.","Join a forum where you must contribute publicly."]
      },
      'Team Citizenship': {
        why: ctxAction(`Institutions are sustained by discretionary effort${R.role ? `, and in a ${R.role} role that effort is highly visible` : ''}. Moving beyond your formal job description builds the social capital necessary for leadership.`, "In banking, siloed departments create massive inefficiency.", "In the civil service, cross-departmental cooperation is the only way complex policies are implemented.", "In NGOs, mission success relies heavily on team members supporting each other.", "At the executive level, your citizenship sets the culture.", "Building a reputation as an institutional citizen early in your career makes you indispensable."),
        now: ctxAction("Identify one institutional frustration and present a constructive solution instead of complaining.", "Identify a bottleneck between your unit and another, and propose a fix.", "Draft a one-page improvement proposal for a broken bureaucratic process.", "Offer to take one administrative burden off a stressed colleague this week.", "Praise a colleague's unseen work in front of the broader leadership team.", "Volunteer for an unglamorous task that helps the whole team."),
        soon: ctxAction("Volunteer for an internal committee or improvement initiative.", "Join a cross-functional working group.", "Participate in a departmental reform committee.", "Take the lead on organizing a team-building or knowledge-sharing event.", "Establish a formal recognition system within your department.", "Shadow a colleague in a different role to understand their challenges."),
        fut: ctxAction("Lead a process improvement workstream for your department.", "Take ownership of an initiative that benefits the entire branch, not just your KPIs.", "Lead a policy implementation working group.", "Design and lead a new capacity-building initiative for your NGO.", "Sponsor a cross-departmental integration project.", "Become the go-to person for onboarding new team members."),
        acts: ["Adopt the 'solution before complaint' rule.", "Take on one administrative burden for the team.", "Praise a colleague's unseen work publicly."]
      },
      'Collaborative Spirit': {
        why: ctxAction(`High performance in modern institutions is team-based${R.role ? `, and that is especially true in a ${R.role} role` : ''}. Friction, defensiveness, and lack of empathy destroy psychological safety.`, "In high-stakes finance, adversarial relationships between front-office and risk/audit destroy institutional value.", "In government, territorial disputes between departments halt public service delivery.", "In the development sector, failing to build consensus with communities or partners leads to programme failure.", "As a senior leader, a lack of collaborative spirit creates a culture of fear.", "Learning to disagree without damaging relationships is the most critical soft skill you can build right now."),
        now: ctxAction("Identify a strained workplace relationship and initiate a reset conversation.", "Reach out to a colleague in Risk, Audit, or Compliance to understand their perspective on a recent friction point.", "Schedule a coffee with a counterpart in a rival department to build rapport.", "Ask a community partner or stakeholder for their honest feedback on your approach.", "Publicly acknowledge a mistake you made to normalize vulnerability in your team.", "Ask a colleague you disagreed with recently for their perspective, and just listen."),
        soon: ctxAction("Complete a course on active listening or conflict resolution.", "Attend a stakeholder negotiation workshop focused on interest-based outcomes.", "Take a public administration course on consensus building.", "Enrol in a partnership management or mediation workshop.", "Commission a 360-degree feedback review for yourself and share the results with your team.", "Read and apply the frameworks from 'Getting to Yes' in your daily interactions."),
        fut: ctxAction("Mentor a junior colleague or lead a cross-functional initiative requiring high diplomacy.", "Lead a project that requires deep collaboration between sales and risk/compliance.", "Manage a multi-stakeholder policy rollout.", "Take the lead on a complex consortium or multi-partner grant proposal.", "Mediate a long-standing departmental dispute.", "Volunteer to manage a project with a notoriously difficult stakeholder."),
        acts: ["In your next disagreement, repeat the other person's point back to them before making yours.", "Offer help to a stressed colleague without being asked.", "Acknowledge a mistake publicly."]
      },
      'Openness to Ideas': {
        why: ctxAction(`In a rapidly evolving market, relying solely on established methods leads to obsolescence${R.role ? `, and this risk applies directly to a ${R.role}` : ''}. Innovation requires deliberate exposure to new frameworks.`, "The financial sector is being disrupted by fintech and changing regulations; rigid thinking is a liability.", "Bureaucratic inertia is the enemy of reform. Openness is required to modernize civil service delivery.", "The development sector demands continuous adaptation to new evidence and changing ground realities.", "As a leader, if you immediately shoot down unconventional ideas, your team will stop bringing them to you.", "Building a reputation as an adaptable, open-minded professional accelerates your career trajectory."),
        now: ctxAction("Identify one process you follow blindly and write down three ways it could be optimized.", "Review a legacy banking process and propose a digital or streamlined alternative.", "Look at one standard operating procedure in your department and draft a modernization proposal.", "Review your programme's M&E framework and suggest one innovative way to capture impact.", "In your next meeting, force yourself to say 'Tell me more' instead of 'But...'", "Ask a colleague from a completely different department how they would solve a problem you are facing."),
        soon: ctxAction("Present a new tool or methodology to your team that you researched independently.", "Attend a workshop on digital transformation or agile methodologies.", "Participate in a design-thinking workshop for public sector innovation.", "Enrol in a course on human-centered design or innovative financing.", "Host a 'reverse mentoring' session where junior staff pitch ideas to you.", "Take a short online course in a subject entirely outside your field."),
        fut: ctxAction("Lead a pilot project testing a completely new approach to a legacy problem.", "Sponsor a sandbox initiative for a new financial product or service.", "Lead the implementation of a new e-governance tool in your department.", "Design a pilot intervention using a completely untested methodology.", "Allocate budget and time for an internal innovation incubator.", "Volunteer to be the early adopter for a new company-wide software or process."),
        acts: ["Spend 30 minutes a week reading outside your discipline.", "Propose one idea that breaks the current rules in your next brainstorm.", "Ask a colleague from a different department how they would solve your problem."]
      },
      'Cultural Intelligence': {
        why: ctxAction(`Pakistan's professional landscape is highly diverse${R.role ? `, and a ${R.role} regularly works across that diversity` : ''}. Navigating regional, linguistic, and institutional differences is essential for multi-stakeholder success.`, "In national banks, you must seamlessly navigate interactions from corporate head offices to rural agricultural branches.", "Civil servants are posted across diverse provinces and must adapt to local cultural and power dynamics instantly.", "Development work spans international donors in capital cities to deeply conservative rural communities.", "Senior leaders must build inclusive cultures that leverage diversity rather than demanding conformity.", "Demonstrating respect and adaptability across cultures marks you as leadership material early on."),
        now: ctxAction("Identify a miscommunication caused by cultural or departmental differences and clarify it.", "Adjust your communication style deliberately in your next email to a regional branch.", "Have a conversation with a local stakeholder purely to understand their context, without an agenda.", "Ask a community mobilizer to explain the unspoken norms of the district you are working in.", "Review your leadership team's composition and ask whose perspective is missing.", "Ask a colleague from a different background about their perspective on a workplace norm."),
        soon: ctxAction("Attend an intercultural communication workshop.", "Participate in a diversity and inclusion training focused on the Pakistani context.", "Study the regional history and administrative nuances of your current posting.", "Complete a course on culturally responsive programming or participatory development.", "Implement an inclusive meeting protocol that ensures minority voices are heard.", "Read 'The Culture Map' and map your own communication style against it."),
        fut: ctxAction("Take an assignment that requires deep engagement with a new region or stakeholder group.", "Volunteer for a rotation in a province or division you have never worked in.", "Request a field posting or secondment to a culturally distinct region.", "Lead a project that requires managing a highly diverse, multi-ethnic consortium.", "Sponsor an organizational initiative that promotes regional diversity in hiring.", "Lead a cross-regional project team."),
        acts: ["Research the institutional norms of a partner you struggle to understand.", "Adapt your communication style (formal vs informal) in your next email.", "Ask a colleague from a different background about their perspective."]
      },
      'Ethical Integrity': {
        why: ctxAction(`In environments with high fiduciary or public accountability${R.role ? ` such as your work as a ${R.role}` : ''}, transparency and rule compliance are non-negotiable trust metrics.`, "In banking, ethical breaches lead to regulatory sanctions, reputational ruin, and criminal liability.", "In government, transparent decision-making is the bulwark against corruption allegations and audit paras.", "In the NGO sector, fiduciary integrity is the absolute baseline for donor trust and organizational survival.", "As a leader, your minor compromises become your team's major breaches. You set the ethical ceiling.", "Your professional reputation is built in decades and destroyed in a single compromised decision."),
        now: ctxAction("Identify a process where you cut corners and realign it with official policy today.", "Review your recent approvals and ensure every single one has complete, transparent documentation.", "Audit your last three decisions for strict compliance with PPRA or departmental rules.", "Disclose a minor error or variance to a donor/partner immediately rather than hiding it.", "Publicly state your commitment to a specific compliance standard in your next team meeting.", "Consult a peer or mentor on an ethically ambiguous choice you are currently facing."),
        soon: ctxAction("Attend a professional ethics and values workshop.", "Complete an advanced anti-money laundering (AML) or compliance certification.", "Attend a workshop on public procurement rules and administrative transparency.", "Enrol in a course on fiduciary risk management and donor compliance.", "Commission an independent audit of your department's decision-making processes.", "Read and discuss a case study on corporate ethics with your team."),
        fut: ctxAction("Take ownership of a high-compliance or audit-facing project.", "Volunteer to serve on the institution's internal audit or risk committee.", "Lead a departmental initiative to rewrite and modernize standard operating procedures for transparency.", "Design and enforce a new anti-fraud and safeguarding framework for your organization.", "Champion a whistleblower protection or transparency initiative across the company.", "Become the compliance champion for your unit."),
        acts: ["Audit a recent decision for transparency.", "Consult a peer on an ethically ambiguous choice.", "Disclose a minor error immediately rather than hiding it."]
      }
    };
    return map[dim] || map['Learning Agility'];
  };

  const buildHabits = (content, dim, profile, R) => {
    const formatHow = (tool, method, context = '') => 
      `<strong style="color:${T.t0}">${tool}</strong> <strong style="color:${T.t0}">Methodology:</strong> ${method}${context ? ` <span style="font-style:italic;color:${T.t2}">${context}</span>` : ''}`;

    const defaultHows = [
      formatHow('Tool: Baseline Audit.', 'Observe your default reactions for 48 hours without trying to change them.'),
      formatHow('Tool: Micro-Habit.', 'Tie this new behavior to an existing routine.'),
      formatHow('Tool: Peer Feedback.', 'Ask a trusted colleague how they perceive your actions here.'),
      formatHow('Tool: Active Reading.', 'Note 3 actionable takeaways from your recommended resource.'),
      formatHow('Action Protocol: Execution.', 'Execute this step within the next 48 hours without overthinking it.'),
      formatHow('Tool: Upward Alignment.', 'Keep the conversation with your manager under 10 minutes and focus on solutions.'),
      formatHow('Tool: Progress Check.', 'Compare your current behavior to Week 1 and score your progress.'),
      formatHow('Framework: 70-20-10.', 'Growth happens in the stretch zone. Lean into the discomfort.'),
      formatHow('Process: Recalibration.', 'Book your CORE retake to measure your actual statistical shift.'),
      formatHow('Tool: Weekly Review.', 'Dedicate 15 minutes every Friday to log your progress and reset for Monday.')
    ];

    return [
      { h:'Week 1: Baseline', t: content.now || content.acts?.[0] || 'Audit your current behaviour in this area.', how: defaultHows[0] },
      { h:'Week 2: Micro-Habit', t: content.acts?.[0] || 'Track one real situation this week.', how: defaultHows[1] },
      { h:'Week 3: External Data', t: content.acts?.[1] || 'Ask one trusted colleague for specific feedback.', how: defaultHows[2] },
      { h:'Week 4: Knowledge', t: content.acts?.[2] || 'Start one recommended resource from your toolkit.', how: defaultHows[3] },
      { h:'Month 2: Execution', t: content.soon || 'Apply one concrete behaviour change.', how: defaultHows[4] },
      { h:'Month 2: Alignment', t: 'Align with your manager on this specific priority.', how: defaultHows[5] },
      { h:'Month 3: Pattern Check', t: 'Compare your current habits to your Week 1 baseline.', how: defaultHows[6] },
      { h:'Month 4–6: Stretch', t: content.fut || 'Take on a stretch assignment.', how: defaultHows[7] },
      { h:'6 Months: Recalibrate', t: 'Retake the CORE assessment to measure your progress.', how: defaultHows[8] },
      { h:'Ongoing: Maintenance', t: 'Establish a weekly review habit to prevent regression.', how: defaultHows[9] },
    ];
  };

  const devAreas = bot2.map(d => {
    const content = getDimContent(d.l);
    return {
      dim: d.l, v: d.v, why: content.why, gap: d.gap,
      habits: buildHabits(content, d.l, profile, R),
      now: content.now, soon: content.soon, fut: content.fut, acts: content.acts || []
    };
  });

  const getResources = () => {
    const res = [];
    const gapKeys = bot2.map(d => d.k); 
    const indText = R.industry || 'your sector';
    const roleText = R.role || 'professional';
    const expText = R.experience ? `at ${R.experience} of experience` : 'at your career stage';
    const profileText = profile?.name || 'professional';

    if(gapKeys.includes('C')){
      res.push({type:'book', title:'Atomic Habits', author:'James Clear', url:'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299', why:`In ${indText}, delivery reliability is your primary currency. This is the most evidence-grounded system.`});
      res.push({type:'ted', title:'Inside the Mind of a Master Procrastinator', author:'Tim Urban', url:'https://www.youtube.com/watch?v=arj7oStGLkU', why:'Understand the psychology of task-avoidance.'});
    }
    if(gapKeys.includes('ES')){
      res.push({type:'book', title:'Chatter: The Voice in Our Head', author:'Ethan Kross', url:'https://www.amazon.com/Chatter-Voice-Head-Matters-Harness/dp/0525575235', why:`As a ${roleText} ${expText}, pressure is inevitable. Manage your inner critical voice.`});
      res.push({type:'ted', title:'How to Make Stress Your Friend', author:'Kelly McGonigal', url:'https://www.youtube.com/watch?v=RcGyVTAoXEU', why:'Relationship with stress predicts health and performance.'});
    }
    if(gapKeys.includes('CQavg')){
      res.push({type:'book', title:'The Culture Map', author:'Erin Meyer', url:'https://www.amazon.com/Culture-Map-Breaking-Invisible-Boundaries/dp/1610392507', why:`Essential for a ${profileText} navigating diverse stakeholders in ${indText}.`});
      res.push({type:'ted', title:'Cross Cultural Communication', author:'Pellegrino Riccardi', url:'https://www.youtube.com/watch?v=YMyofREc5Jk', why:'How cultural assumptions derail professional communication.'});
    }
    if(gapKeys.includes('LAavg')){
      res.push({type:'book', title:'Mindset: The New Psychology of Success', author:'Carol S. Dweck', url:'https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322', why:`Your ability to learn faster than your peers is your ultimate competitive advantage.`});
      res.push({type:'article', title:'Improve Your Ability to Learn', author:'Harvard Business Review', url:'https://hbr.org/2015/06/improve-your-ability-to-learn', why:'Framework for accelerating your learning agility.'});
    }
    if(gapKeys.includes('EOavg')){
      res.push({type:'book', title:'The Righteous Mind', author:'Jonathan Haidt', url:'https://www.amazon.com/Righteous-Mind-Divided-Politics-Religion/dp/0307455777', why:`Explains why professionals who make ethical lapses are not usually dishonest by nature.`});
      res.push({type:'ted', title:'Our Buggy Moral Code', author:'Dan Ariely', url:'https://www.youtube.com/watch?v=16BOUxGkOgc', why:'The hidden forces that cause good professionals to cut corners.'});
    }
    if(gapKeys.includes('A')){
      res.push({type:'book', title:'Getting to Yes', author:'Fisher & Ury', url:'https://www.amazon.com/Getting-Yes-Negotiating-Agreement-Without/dp/0143118757', why:`The foundational text on principled negotiation.`});
      res.push({type:'ted', title:'The Power of Vulnerability', author:'Brené Brown', url:'https://www.youtube.com/watch?v=iCvmsMzlF7o', why:'Essential viewing for building psychological safety.'});
    }
    if(gapKeys.includes('O')){
      res.push({type:'book', title:'A Whole New Mind', author:'Daniel Pink', url:'https://www.amazon.com/Whole-New-Mind-Right-Brainers-Future/dp/1594481717', why:`Why creative and conceptual thinking is increasingly critical ${expText}.`});
      res.push({type:'article', title:'The Innovator’s DNA', author:'Harvard Business Review', url:'https://hbr.org/2009/12/the-innovators-dna', why:'Breaks down the specific habits of highly innovative professionals.'});
    }
    if(gapKeys.includes('E')){
      res.push({type:'book', title:'Quiet', author:'Susan Cain', url:'https://www.amazon.com/Quiet-Power-Introverts-World-Talking/dp/0307352153', why:`Introversion is a professional asset when deployed deliberately.`});
      res.push({type:'ted', title:'Your Body Language May Shape Who You Are', author:'Amy Cuddy', url:'https://www.youtube.com/watch?v=Ks-_Mh1QhMc', why:'Practical techniques for holding physical presence.'});
    }
    if(gapKeys.includes('OCBavg')){
      res.push({type:'book', title:'Give and Take', author:'Adam Grant', url:'https://www.amazon.com/Give-Take-Helping-Others-Success/dp/0143124986', why:`How contributing to the success of your colleagues accelerates your own trajectory.`});
      res.push({type:'ted', title:'Are You a Giver or a Taker?', author:'Adam Grant', url:'https://www.youtube.com/watch?v=YyXRYgjQXX0', why:'A quick breakdown of workplace citizenship.'});
    }

    if(res.length===0){
      res.push({type:'book', title:'The Effective Executive', author:'Peter Drucker', url:'https://www.amazon.com/Effective-Executive-Definitive-Harperbusiness-Essentials/dp/0060833459', why:`Foundational text on professional effectiveness.`});
      res.push({type:'course', title:'Strategic Thinking', author:'LinkedIn Learning', url:'https://www.linkedin.com/learning/strategic-thinking-3', why:'A broad, high-impact course for balanced professionals.'});
    }
    
    return res.slice(0, 5); 
  };

  const getPrograms = () => {
    const progs = [];
    const gapKeys = bot2.map(d => d.k);
    const profileText = profile?.name || candidate?.profile_name || 'professional';
    const industryText = R.industry || 'your sector';
    const expLevel = R.experience || '';
    const roleLevel = R.level || '';
    const isEarlyCareer = ['0–2 years','3–5 years'].includes(expLevel) || roleLevel.includes('Entry') || roleLevel.includes('Junior');
    const isMidCareer = expLevel === '6–10 years' || roleLevel.includes('Mid-Level');
    const isSenior = ['11–15 years','16+ years'].includes(expLevel) || roleLevel.includes('Senior') || roleLevel.includes('Executive') || roleLevel.includes('Director');

    if(gapKeys.includes('E') || gapKeys.includes('A') || gapKeys.includes('OCBavg'))
      progs.push({format:'Training', name:'Communication & Influence Workshop', desc:"A two-day programme covering professional communication styles, stakeholder influence, and cross-contextual messaging.", match:`Directly targets the interpersonal gaps in your ${profileText} profile.`});
    if(gapKeys.includes('EOavg') || (gs?.seesaw?.val>60))
      progs.push({format:'Training', name:'Professional Ethics & Values Programme', desc:"A facilitated workshop on ethical decision-making frameworks, integrity under pressure, and building a culture of transparency.", match:`Recommended based on your Ethical Orientation scores and Values Seesaw responses.`});
    if(gapKeys.includes('LAavg') || gapKeys.includes('O'))
      progs.push({format:'Training', name:'Learning Agility & Growth Mindset Workshop', desc:"A programme building the specific habits that accelerate professional development.", match:`Directly targets your priority development area in adaptive learning.`});
    if(gapKeys.includes('CQavg'))
      progs.push({format:'Training', name:'Intercultural Communication & Collaboration', desc:"A cross-cultural effectiveness programme for multi-institutional contexts.", match:`Recommended to help you navigate diverse stakeholders in ${industryText}.`});
    if(gapKeys.includes('ES'))
      progs.push({format:'Training', name:'Resilience & Emotional Intelligence Programme', desc:"A one-day programme combining evidence-based resilience frameworks with practical emotional regulation tools.", match:`Directly targets your priority development area in Emotional Resilience.`});

    if(isMidCareer || isSenior || gapKeys.includes('ES') || gapKeys.includes('C'))
      progs.push({format:'Coaching', name:'1:1 CORE Executive Coaching', desc:"A structured six-session coaching engagement with a Carnelian consultant, built directly around this profile and its two priority areas.", match: isSenior ? `Matched to seniority (${roleLevel || expLevel}) — coaching outperforms group training at this level.` : `Recommended to work through ${bot2[0]?.l?.toLowerCase() || 'the priority area'} with individual accountability.`});

    if(isEarlyCareer || profileText.toLowerCase().includes('emerging'))
      progs.push({format:'Mentorship', name:'Carnelian Mentor Pairing Programme', desc:"A structured six-month pairing with a senior practitioner in the field, with fortnightly check-ins and a written development focus.", match:`Matched to career stage (${expLevel || 'early career'}) — mentorship compounds fastest in the first few years.`});

    if(isSenior || gapKeys.includes('EOavg') || gapKeys.includes('C'))
      progs.push({format:'Consulting', name:'Team & Culture Advisory Engagement', desc:"Carnelian works with the function or team directly on the systemic version of this gap, from process design to culture diagnostics.", match: isSenior ? `At ${roleLevel || 'this level'}, the highest-leverage move is usually structural, not personal.` : `Worth raising with the manager if this gap in ${bot2[0]?.l?.toLowerCase() || 'this area'} shows up across the team, not just individually.`});

    if(progs.length===0)
      progs.push({format:'Coaching', name:'CORE Coaching Session', desc:"A structured 90-minute session with a Carnelian consultant to debrief the full CORE profile.", match:`Recommended to help leverage balanced strengths as a ${profileText}.`});

    const seen = new Set();
    return progs.filter(p => (seen.has(p.name) ? false : (seen.add(p.name), true))).slice(0, 4);
  };

  const getRelapse = () => {
    const protocols = [];
    const gapKeys = bot2.map(d => d.k);
    const roleText = R.role || 'role';

    const protoMap = {
      'C': {trigger:`When a deadline is approaching for your ${roleText} and you have not started`, response:'Use the 2-minute rule: if any piece of this task takes 2 minutes, do it right now. Momentum from a tiny start breaks the avoidance cycle.'},
      'O': {trigger:'When a new tool, method or idea is proposed and your first reaction is to reject it', response:"Say 'tell me more' before you say 'but'. Give the idea 24 hours before deciding it will not work."},
      'E': {trigger:'When you have something to say in a meeting but decide to stay quiet', response:'Say it in the first 5 minutes of the meeting, before the window to speak up closes. Exposure, not preparation, is what builds this.'},
      'A': {trigger:'When a colleague challenges your position and your instinct is to defend rather than listen', response:'Repeat their point back to them before responding to it. Only then give your view.'},
      'ES': {trigger:'When you feel your emotional state affecting your decision-making or relationships at work', response:'Name it to yourself first: "I am currently stressed, frustrated, or overwhelmed." Labelling an emotional state reduces its intensity. Delay any non-urgent decision by at least 20 minutes.'},
      'CQavg': {trigger:'When a colleague from a different background behaves in a way you do not expect', response:'Ask what normal looks like in their context before assuming they are wrong. Curiosity first, judgment second.'},
      'OCBavg': {trigger:'When something needs doing that is not technically your job', response:"Ask 'what can I take off someone else's plate this week' once, and act on the answer."},
      'LAavg': {trigger:'When you are handed a task in an area you have not worked in before', response:'Give yourself 48 hours to learn before deciding it is not for you. Write down one thing you learned at the end of it.'},
      'EOavg': {trigger:'When someone you respect asks you to approve, sign off on, or stay silent about something that does not feel right', response:"Name it directly but privately first: 'I want to support you, but I am not comfortable with this because [specific reason]. What can we do instead?'"},
    };

    gapKeys.forEach(k => { if (protoMap[k]) protocols.push(protoMap[k]); });

    if ((gs?.seesaw?.val > 65) && protocols.length < 4) {
      protocols.push({trigger:'When a trusted colleague or manager asks you to bypass a process', response:'Pause before responding. Ask yourself: "If this decision were reviewed publicly tomorrow, would I defend it, or explain it away?" If you are explaining rather than defending, say no, or ask for it in writing first.'});
    }
    if ((gs?.scenario1?.raw <= 0) && protocols.length < 4) {
      protocols.push({trigger:'When you feel the urge to delay or withhold information that others need', response:'Send one sentence now rather than a perfect explanation later. Early, imperfect disclosure builds more trust than late, polished disclosure.'});
    }

    if (protocols.length === 0) {
      protocols.push({trigger:'When you face a situation where the right and the convenient path diverge', response:"Use the clarity test: 'What would I tell a junior colleague to do in this situation?' The answer you give them is usually the answer you already know for yourself. Then do that."});
    }
    return protocols.slice(0, 4);
  };

  const resources = getResources();
  const programs = getPrograms();
  const relapse = getRelapse();

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', pageBreakInside: 'avoid', breakInside: 'avoid', ...style }}>
      {children}
    </div>
  );

  return (
    <div>
      <div id={`action-report-${candidate.doc_id}`} style={{ padding: '10px' }}>
      
      {/* HEADER */}
      {card(
        <>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'8px', fontWeight:'700' }}>
            Candidate Action Plan — Personal Development Report
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>{candidate.name}</div>
          <div style={{ fontSize:'12px', color:T.t2, marginBottom:'16px' }}>{new Date(candidate.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})} · {candidate.experience} · {candidate.industry}</div>
          <div style={{ background:T.bg3, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'16px 18px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'700', marginBottom:'6px' }}>Professional Profile</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:'700', color:T.t0, marginBottom:'8px' }}>{profile.name || candidate.profile_name}</div>
            <div style={{ fontSize:'12px', color:T.t2, lineHeight:'1.7', fontWeight:'600' }}>{profile.desc}</div>
            {profile.devNote && (
              <div style={{ marginTop:'12px', background:T.b0, borderLeft:`3px solid ${T.gold}`, padding:'10px 14px', borderRadius:'0 8px 8px 0', fontSize:'12px', color:T.t1, lineHeight:'1.65' }}>{profile.devNote}</div>
            )}
          </div>
        </>
      )}

      {/* SCORE DASHBOARD */}
      {card(
        <>
          <SectionHead label="Score Profile at a Glance" T={T} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px 28px', marginBottom:'20px' }}>
            {allDims.map(d => {
              const pCol = d.l.includes('Personality')||d.l.includes('Conscientiousness')||d.l.includes('Emotional')||d.l.includes('Openness')||d.l.includes('Social')||d.l.includes('Collaborative') ? '#EC4899' : d.l.includes('Cultural') ? '#06B6D4' : d.l.includes('Citizenship') ? '#F97316' : d.l.includes('Learning') ? '#3B82F6' : d.l.includes('Integrity') ? '#7C3AED' : T.t0;
              return (
              <div key={d.k} style={{ width:'calc(50% - 14px)', marginBottom:'4px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'3px' }}>
                  <span style={{ fontSize:'12px', color:T.t0, fontWeight:'700', display:'flex', alignItems:'center' }}>
                    <span style={{display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:pCol, marginRight:'6px'}}></span>
                    {d.l}
                  </span>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'10px', color:bCol(d.v,T), fontWeight:'700' }}>{d.v}/100 · {d.v>=75?'Strong':d.v>=50?'Developing':'Priority'}</span>
                </div>
                <div style={{ height:'7px', background:T.b1, borderRadius:'100px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${d.v}%`, background:barGrad(d.v), borderRadius:'100px', transition:'width 0.8s ease' }} />
                </div>
              </div>
            )})}
          </div>
          
          {/* Composite ring display */}
          <div style={{ background:T.bg3, borderRadius:'10px', padding:'16px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'700', marginBottom:'12px' }}>7 Composite Indices</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', justifyContent:'space-between', textAlign:'center' }}>
              {COMPOSITE_KEYS.map(({ k, l, green }) => {
                const v = CI[k] || 0;
                const col = bCol(v,T);
                return (
                  <div key={k} style={{ flex: 1 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.2rem', fontWeight:'800', color:col, marginBottom:'2px' }}>{v}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.gold, fontWeight:'700' }}>{k}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'6px', color:T.t3, lineHeight:'1.3', marginTop:'2px' }}>{l.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* STRENGTHS AND GAPS */}
      {card(
        <>
          <SectionHead label="Core Strengths & Priority Development Areas" T={T} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
            {top2.map(d => (
              <div key={d.k} style={{ width:'calc(50% - 6px)', padding:'18px', borderRadius:'10px', background:T.gnP, border:`1px solid ${T.gn}40`, borderLeft:`5px solid ${T.gn}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:T.gn, marginBottom:'6px' }}>✦ Core Strength</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'700', marginBottom:'6px', color:T.gn }}>{d.l}</div>
                <div style={{ fontSize:'12px', color:T.gn, lineHeight:'1.6', marginBottom:'10px' }}>{d.str}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.gn, fontWeight:'700' }}>{d.v}/100</div>
              </div>
            ))}
            {bot2.map(d => (
              <div key={d.k} style={{ width:'calc(50% - 6px)', padding:'18px', borderRadius:'10px', background:T.rdP, border:`1px solid ${T.rd}40`, borderLeft:`5px solid ${T.rd}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:T.rd, marginBottom:'6px' }}>◈ Priority Development</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'700', marginBottom:'6px', color:T.rd }}>{d.l}</div>
                <div style={{ fontSize:'12px', color:T.rd, lineHeight:'1.6', marginBottom:'10px' }}>Your development investment here creates the greatest career impact.</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.rd, fontWeight:'700' }}>{d.v}/100</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DEVELOPMENT ROADMAP */}
      {devAreas.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ paddingLeft: '4px', marginBottom: '12px' }}>
            <SectionHead label={`Development Roadmap${candidate.industry ? ` — ${candidate.industry}` : ''}`} T={T} />
          </div>
          {devAreas.map((d, i) => {
            const dimCol = d.v < 45 ? T.rd : d.v < 60 ? T.am : T.gn;
            return card(
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'700', color:T.t0 }}>{d.dim}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', fontWeight:'800', color:dimCol }}>{d.v}/100</div>
                </div>
                <div style={{ height:'5px', background:T.b1, borderRadius:'100px', overflow:'hidden', marginBottom:'12px' }}>
                  <div style={{ height:'100%', width:`${d.v}%`, background:dimCol, borderRadius:'100px' }} />
                </div>
                <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.7', marginBottom:'16px', fontWeight:'600' }}>{d.why}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontWeight:'800', marginBottom:'10px' }}>Your 10-Step Action Plan</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
                  {(d.habits||[]).map((h, j) => {
                    const isRed = j < 2; const isAm = j >= 2 && j < 5;
                    const sCol = isRed ? T.rd : isAm ? T.am : T.gn;
                    const sBg = isRed ? T.rdP : isAm ? T.amP : T.gnP;
                    const stepKey = `${i}_${j}`;
                    const isExpanded = expandedSteps[stepKey];
                    return (
                      <div key={j} style={{ background:sBg, borderRadius:'6px', overflow:'hidden' }}>
                        <div onClick={() => setExpandedSteps(prev => ({...prev, [stepKey]: !prev[stepKey]}))} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 14px', cursor:'pointer' }}>
                          <div style={{ minWidth:'20px', height:'20px', borderRadius:'50%', background:sCol, color:'#fff', fontSize:'10px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{j+1}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2px' }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', color:sCol, textTransform:'uppercase', letterSpacing:'0.08em' }}>{h.h}</div>
                              <span style={{ fontSize:'9px', color:sCol, fontWeight:'700' }}>{isExpanded ? '▲ hide' : '▼ how'}</span>
                            </div>
                            <div style={{ fontSize:'12px', color:T.t0, lineHeight:'1.5', fontWeight:'500' }}>{h.t}</div>
                          </div>
                        </div>
                        {isExpanded && h.how && (
                          <div style={{ margin:'0 14px 12px 44px', padding:'10px 12px', background:T.bg1, borderRadius:'6px', borderLeft:`3px solid ${sCol}` }}>
                            <div style={{ fontSize:'11.5px', color:T.t1, lineHeight:'1.6', fontWeight:'500' }} dangerouslySetInnerHTML={{__html: h.how}} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40` }}>🔴 Days 1–30: {d.now||d.acts?.[0]}</span>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.amP, color:T.am, border:`1px solid ${T.am}40` }}>🟡 Days 30–90: {d.soon||d.acts?.[1]}</span>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.gnP, color:T.gn, border:`1px solid ${T.gn}40` }}>🟢 Days 90–180: {d.fut}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESOURCES & PROTOCOLS */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'14px', alignItems:'flex-start' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          {card(
            <>
              <SectionHead label="Profile-Matched Toolkit" T={T} />
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {resources.map((r, i) => {
                  const tCol = r.type==='book'?'#3B82F6':r.type==='ted'?'#EF4444':r.type==='youtube'?'#10B981':r.type==='article'?'#F59E0B':r.type==='course'?'#8B5CF6':'#6B7280';
                  const tBg = r.type==='book'?'rgba(59,130,246,0.15)':r.type==='ted'?'rgba(239,68,68,0.15)':r.type==='youtube'?'rgba(16,185,129,0.15)':r.type==='article'?'rgba(245,158,11,0.15)':r.type==='course'?'rgba(139,92,246,0.15)':'rgba(107,114,128,0.15)';
                  return (
                    <div key={i} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'14px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', color:tCol, background:tBg, padding:'4px 6px', borderRadius:'4px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{r.type}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'12px', fontWeight:'700', color:T.t0, marginBottom:'2px' }}>{r.title}</div>
                        <div style={{ fontSize:'11px', color:T.t1, lineHeight:'1.5', marginBottom:r.url?'6px':'0' }}>{r.why}</div>
                        {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'10px', fontWeight:'700', color:tCol, textDecoration:'none' }}>→ Watch / Access ↗</a>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>, { marginBottom: 0 }
          )}
        </div>
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          {card(
            <>
              <SectionHead label="If-Then Protocol — When Habits Break" T={T} />
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {relapse.map((p, i) => (
                  <div key={i} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'14px' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'8px', alignItems:'baseline' }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:'800', color:T.rd, background:T.rdP, padding:'2px 6px', borderRadius:'4px' }}>IF →</span>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:T.t0 }}>{p.trigger}</span>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'baseline' }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:'800', color:T.gn, background:T.gnP, padding:'2px 6px', borderRadius:'4px' }}>THEN →</span>
                      <span style={{ fontSize:'12px', color:T.t1, lineHeight:'1.5', fontWeight:'500' }}>{p.response}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>, { marginBottom: 0 }
          )}
        </div>
      </div>

      <div style={{ marginTop: '14px' }}>
        {/* PROGRAMS */}
        {card(
          <>
            <SectionHead label="Recommended Programmes — Carnelian" T={T} />
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {programs.map((p, i) => {
                const fmtCol = p.format==='Coaching'?'#3B82F6':p.format==='Mentorship'?T.gn:p.format==='Consulting'?T.c:T.gold;
                return (
                <div key={i} style={{ background:`linear-gradient(135deg, ${T.bg2} 0%, ${T.bg3} 100%)`, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:T.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', flexShrink:0 }}>C</div>
                  <div style={{flex:1}}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                      <div style={{ fontSize:'13px', fontWeight:'700', color:T.gold }}>{p.name}</div>
                      {p.format && <span style={{fontSize:'8.5px', fontWeight:'800', color:fmtCol, background:`${fmtCol}18`, padding:'2px 7px', borderRadius:'100px', textTransform:'uppercase', letterSpacing:'0.06em'}}>{p.format}</span>}
                    </div>
                    <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.5', marginBottom:'6px' }}>{p.desc}</div>
                    <div style={{ fontSize:'10.5px', color:T.gn, fontStyle:'italic', fontWeight:'600' }}>{p.match || 'Recommended based on this profile.'}</div>
                  </div>
                </div>
              );})}
            </div>
          </>
        )}
      </div>

     {/* PRIORITY MATRIX */}
      {card(
        <>
          <SectionHead label="Priority Action Matrix" T={T} />
          <p style={{color:T.t2, fontSize:'12px', lineHeight:'1.6', marginBottom:'12px', fontWeight:'500'}}>Dimensions sorted relatively by urgency based on the candidate's unique score profile.</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
            {[
              { label:'🔴 Act Now (Priority)',  items:allDims.slice(7, 9),  bg:T.rdP, bc:T.rd  },
              { label:'🟡 Build Soon (Secondary)', items:allDims.slice(5, 7), bg:T.amP, bc:T.am },
              { label:'🟢 Sustain & Expand (Strengths)', items:allDims.slice(0, 2),  bg:T.gnP, bc:T.gn  },
              { label:'🔵 Monitor Progress (Balanced)', items:allDims.slice(2, 5), bg:T.b0,  bc:T.b2  },
            ].map(({ label, items, bg, bc }) => (
              <div key={label} style={{ width:'calc(50% - 6px)', background:bg, border:`1px solid ${bc}40`, borderRadius:'10px', padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'800', color:T.t1, marginBottom:'8px' }}>{label}</div>
                <ul style={{ paddingLeft:'18px', margin:0, color:T.t0, fontSize:'12px', lineHeight:'1.7', fontWeight:'600' }}>
                  {items.map(d => <li key={d.k}>{d.l} ({d.v}/100)</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ background:T.bg3, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'16px 18px', fontSize:'12px', color:T.t2, lineHeight:'1.7', fontWeight:'600', marginBottom:'14px' }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, fontWeight:'700', marginBottom:'6px' }}>CORE v3.0 · Carnelian Pvt Ltd · {candidate.doc_id} · {new Date(candidate.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}</div>
        This report is written for {candidate.name}. It contains no HR risk language. Questions: hello@carnelianco.com
      </div>
      </div>
      <ActionPlanDownloadBtn
        R={R} S={S} CI={CI} profile={profile} allDims={allDims} top2={top2} bot2={bot2}
        devAreas={devAreas} resources={resources} relapse={relapse} programs={programs}
        pdfBusy={pdfBusy} setPdfBusy={setPdfBusy}
      />
    </div>
  );
};

// ─── PLAYER REPORT (gamified view) ───────────────────────────
const PlayerReport = ({ candidate, T }) => {
  const [evState, setEvState] = useState({});
  
  useEffect(() => {
    try { setEvState(JSON.parse(localStorage.getItem(`core_ev_${candidate.doc_id}`) || '{}')); } catch(e) {}
  }, [candidate.doc_id]);

  const rd      = candidate.report_data || {};
  const S       = rd.scores   || {};
  const CI      = rd.CI       || {};
  const profile = rd.profile  || {};

  const SKILLS = [
    { k:'C',      l:'Delivery Drive',   icon:'⚡', v:S.C||0 },
    { k:'O',      l:'Innovation Force', icon:'💡', v:S.O||0 },
    { k:'E',      l:'Social Power',     icon:'🔥', v:S.E||0 },
    { k:'A',      l:'Alliance Skill',   icon:'🤝', v:S.A||0 },
    { k:'ES',     l:'Resilience Core',  icon:'🛡', v:S.ES||0 },
    { k:'CQavg',  l:'Cultural IQ',      icon:'🌐', v:S.CQavg||0 },
    { k:'OCBavg', l:'Team Spirit',      icon:'👥', v:S.OCBavg||0 },
    { k:'LAavg',  l:'Learn Speed',      icon:'📚', v:S.LAavg||0 },
    { k:'EOavg',  l:'Integrity',        icon:'⚖️', v:S.EOavg||0 },
  ];

  const baseXP   = Math.round(SKILLS.reduce((a,s)=>a+s.v,0)*10);
  const compVals = [CI.CII,CI.LRS,CI.TVS,CI.ADS,CI.SES,CI.OPS,CI.PMS].filter(Boolean);
  const compBonus= compVals.length ? Math.round((compVals.reduce((a,v)=>a+v,0)/compVals.length)*50) : 0;
  
  // Add Pattern Bonuses
  const patterns = rd.patterns || [];
  const patBonus = patterns.filter(p=>p.sev==='pos').length * 500;
  
  // Add Evidence XP
  let verifiedXP = 0;
  Object.values(evState).forEach(e => verifiedXP += (e.xp || 0));
  
  const totalXP = baseXP + compBonus + patBonus + verifiedXP;

  const LEVELS = [
    {n:1,l:'NOVICE',min:0},{n:2,l:'APPRENTICE',min:5000},{n:3,l:'PRACTITIONER',min:8000},
    {n:4,l:'PROFESSIONAL',min:11000},{n:5,l:'ADVANCED',min:14000},{n:6,l:'SENIOR',min:17000},
    {n:7,l:'EXPERT',min:20000},{n:8,l:'MASTER',min:23000},{n:9,l:'ELITE',min:26000},{n:10,l:'LEGEND',min:29000},
  ];
  const curLvl  = [...LEVELS].reverse().find(l=>totalXP>=l.min) || LEVELS[0];
  const nextLvl = LEVELS[Math.min(curLvl.n,9)];
  const lvlPct  = nextLvl && nextLvl.min > curLvl.min
    ? Math.min(100, Math.round(((totalXP-curLvl.min)/(nextLvl.min-curLvl.min))*100)) : 100;

  const GC_MAP = {
    'Strategic Integrity Leader':'⚔️','Institutional Anchor':'🛡️','Adaptive Innovator':'🏹',
    'Ethics-Driven Executor':'🗡️','Cross-Cultural Bridge':'🌐','Collaborative Team Leader':'🎵',
    'Learning Champion':'📚','Visionary Sprinter':'✨','High-Capability, Under Strain':'⚔️','Emerging Professional':'🌟',
  };
  const classIcon = GC_MAP[profile.name || candidate.profile_name] || '🌟';
  const accentCol = T.c;

  const ACHIEVEMENTS = [
    { cond:S.C>=75,      icon:'⚡', name:'IRON WILL',        col:'#fbbf24', xp:300 },
    { cond:S.O>=75,      icon:'💡', name:'BRIGHT MIND',      col:'#a78bfa', xp:300 },
    { cond:S.E>=75,      icon:'🔥', name:'SOCIAL FLAME',     col:'#f472b6', xp:200 },
    { cond:S.A>=75,      icon:'🤝', name:'ALLIANCE BUILDER', col:'#4ade80', xp:200 },
    { cond:S.ES>=75,     icon:'🛡', name:'UNBREAKABLE',      col:'#38bdf8', xp:300 },
    { cond:S.CQavg>=75,  icon:'🌐', name:'CULTURE MASTER',   col:'#38bdf8', xp:400 },
    { cond:S.OCBavg>=75, icon:'👥', name:'TEAM ANCHOR',      col:'#fb7185', xp:300 },
    { cond:S.LAavg>=75,  icon:'📚', name:'FAST LEARNER',     col:'#e879f9', xp:400 },
    { cond:S.EOavg>=75,  icon:'⚖️', name:'INTEGRITY LOCK',   col:'#fbbf24', xp:500 },
    { cond:CI.CII>=80,   icon:'🏛', name:'COMPLIANCE SHIELD',col:'#fbbf24', xp:400 },
    { cond:CI.LRS>=75,   icon:'👑', name:'LEADERSHIP READY', col:'#fbbf24', xp:500 },
  ].filter(a => a.cond);

  return (
    <div>
      <div id={`player-report-${candidate.doc_id}`} style={{ background:'#07091a', borderRadius:'12px', padding:'20px', minHeight:'400px' }}>
      <style>{`
        @keyframes g-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .g-card-inner { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:18px 20px; margin-bottom:12px; }
        .g-section-hd-inner { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:#475569; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
        .g-section-hd-inner::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.06); }
      `}</style>

      {/* HERO */}
      <div className="g-card-inner" style={{ border:`1px solid ${accentCol}40`, boxShadow:`0 0 30px rgba(176,28,36,.12)`, marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:'16px', flexWrap:'wrap' }}>
          <div style={{ fontSize:'3rem', animation:'g-float 3s ease-in-out infinite', filter:`drop-shadow(0 0 12px ${accentCol})` }}>{classIcon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.12em', color:accentCol, marginBottom:'4px' }}>GAME CLASS · CORE</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:'700', color:'#f1f5f9', marginBottom:'4px' }}>{candidate.name}</div>
            <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'14px' }}>{profile.name || candidate.profile_name}</div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px', flexWrap:'wrap' }}>
              <div style={{ display:'inline-flex', alignItems:'center', padding:'4px 14px', borderRadius:'100px', fontSize:'11px', fontWeight:'800', letterSpacing:'0.08em', textTransform:'uppercase', background:`rgba(176,28,36,.15)`, color:accentCol, border:`1px solid rgba(176,28,36,.35)` }}>
                LV{curLvl.n} {curLvl.l}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', color:'#94a3b8' }}>
                <span style={{ color:accentCol, fontWeight:'800' }}>{totalXP.toLocaleString()}</span> XP
              </div>
            </div>
            <div style={{ width:'100%', maxWidth:'360px', height:'8px', background:'rgba(255,255,255,.07)', borderRadius:'100px', overflow:'hidden' }}>
              <div style={{ width:`${lvlPct}%`, height:'100%', background:`linear-gradient(90deg,${accentCol},#C8A84B)`, borderRadius:'100px', boxShadow:`0 0 8px ${accentCol}`, transition:'width 0.8s ease' }} />
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'#334155', marginTop:'3px' }}>{lvlPct}% to Level {curLvl.n+1}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'8px', padding:'10px 14px', textAlign:'center' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.3rem', fontWeight:'800', color:accentCol }}>{S.overall || candidate.overall_score}</div>
              <div style={{ fontSize:'8px', color:'#64748b', marginTop:'2px' }}>POWER</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop:'14px', paddingTop:'12px', borderTop:'1px solid rgba(255,255,255,.06)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
          {[['Total XP',totalXP,'#60a5fa'],['Achievements',ACHIEVEMENTS.reduce((a,b)=>a+b.xp,0),'#4ade80'],['Overall',S.overall||0,'#C8A84B'],['Level',curLvl.n,'#e879f9']].map(([l,v,c])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'14px', fontWeight:'800', color:c }}>{typeof v==='number'&&v>999?v.toLocaleString():v}</div>
              <div style={{ fontSize:'8px', color:'#334155', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILL BOARD */}
      <div className="g-card-inner">
        <div className="g-section-hd-inner">⚔️ SKILL BOARD</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {SKILLS.map(sk => {
            const lvl = Math.floor(sk.v/10);
            const col = sk.v>=75?'#ffd700':sk.v>=55?accentCol:'#f87171';
            const status = sk.v>=90?'MAXED':sk.v>=75?'STRONG':sk.v>=55?'LEVELING':'NEEDS XP';
            return (
              <div key={sk.k} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:'10px', padding:'12px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                  <span style={{ fontSize:'12px' }}>{sk.icon} <span style={{ fontSize:'11px', fontWeight:'700', color:'#e2e8f0' }}>{sk.l}</span></span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:'700', color:col }}>LV{lvl}</span>
                </div>
                <div style={{ height:'5px', background:'rgba(255,255,255,.07)', borderRadius:'100px', overflow:'hidden', marginBottom:'4px' }}>
                  <div style={{ height:'100%', width:`${sk.v}%`, background:`linear-gradient(90deg,${col},rgba(255,255,255,.2))`, borderRadius:'100px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'8px', fontWeight:'800', color:col }}>{status}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:'#475569' }}>{sk.v}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      {ACHIEVEMENTS.length > 0 && (
        <div className="g-card-inner">
          <div className="g-section-hd-inner">🏆 ACHIEVEMENTS UNLOCKED · {ACHIEVEMENTS.length} BADGES</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:'8px' }}>
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.04)', border:`1px solid rgba(255,255,255,.08)`, borderRadius:'10px', padding:'12px', textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:'6px', filter:`drop-shadow(0 0 6px ${a.col})` }}>{a.icon}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.06em', color:a.col, marginBottom:'4px' }}>{a.name}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:'800', color:'#4ade80' }}>+{a.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVIDENCE WALL (ADMIN VIEW) */}
      <div className="g-card-inner">
        <div className="g-section-hd-inner">📝 SUBMITTED EVIDENCE (ADMIN REVIEW)</div>
        {Object.keys(evState).length === 0 ? (
          <div style={{fontSize:'12px', color:'#64748b', textAlign:'center', padding:'10px'}}>No evidence submitted by candidate yet.</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {Object.entries(evState).map(([k, e], i) => (
              <div key={i} style={{background:'rgba(255,255,255,.02)', border:`1px solid ${T.gn}40`, borderLeft:`4px solid ${T.gn}`, borderRadius:'8px', padding:'16px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px'}}>
                  <div>
                    <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.gn, marginBottom:'4px'}}>VERIFIED ACTION · +{e.xp} XP</div>
                    <div style={{fontSize:'11px', color:'#94a3b8'}}>Submitted: {new Date(e.ts).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => {
                    if(!window.confirm('Reject this evidence? This will revoke the XP from the candidate.')) return;
                    const newState = {...evState};
                    delete newState[k];
                    setEvState(newState);
                    localStorage.setItem(`core_ev_${candidate.doc_id}`, JSON.stringify(newState));
                  }} style={{background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40`, padding:'6px 12px', borderRadius:'6px', fontSize:'10px', fontWeight:'700', cursor:'pointer'}}>
                    Reject & Revoke XP
                  </button>
                </div>
                
                <div style={{background:'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'6px', fontSize:'12px', color:'#e2e8f0', lineHeight:'1.5', marginTop:'10px'}}>
                  {e.type === 'book' && <><p><strong>Quote:</strong> "{e.data.quote}"</p><p><strong>Takeaway:</strong> {e.data.takeaway}</p></>}
                  {(e.type === 'ted' || e.type === 'youtube') && <><p><strong>Timestamp:</strong> {e.data.timestamp}</p><p><strong>Insight:</strong> {e.data.insight}</p></>}
                  {e.type === 'research' && <><p><strong>Ref:</strong> {e.data.ref}</p><p><strong>Finding:</strong> {e.data.finding}</p></>}
                  {e.type === 'quest' && <><p><strong>Reflection:</strong> {e.data.reflection}</p></>}
                  
                  {e.data.fileBase64 && (
                    <div style={{marginTop:'12px', paddingTop:'12px', borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                      <a href={e.data.fileBase64} download={e.data.fileName} style={{display:'inline-flex', alignItems:'center', gap:'6px', color:'#38bdf8', textDecoration:'none', fontSize:'11px', fontWeight:'700', background:'rgba(56,189,248,0.1)', padding:'6px 12px', borderRadius:'4px', border:'1px solid rgba(56,189,248,0.3)'}}>
                        📎 Download Attached Proof ({e.data.fileName})
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPOSITE SCORES in game style */}
      <div className="g-card-inner">
        <div className="g-section-hd-inner">📊 COMPOSITE INDEX BOARD</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px', textAlign:'center' }}>
          {COMPOSITE_KEYS.map(({ k, l, green }) => {
            const v = CI[k] || 0;
            const col = v>=green ? '#ffd700' : v>=(green-16) ? accentCol : '#f87171';
            return (
              <div key={k} style={{ background:'rgba(255,255,255,.04)', borderRadius:'8px', padding:'10px 6px', border:`1px solid rgba(255,255,255,.06)` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.1rem', fontWeight:'800', color:col, marginBottom:'2px' }}>{v}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', fontWeight:'700', color:'#C8A84B' }}>{k}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'6px', color:'#334155', lineHeight:'1.3', marginTop:'2px' }}>{l.split(' ').slice(0,2).join(' ')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RE-ASSESSMENT READINESS */}
      <div className="g-card-inner">
        <div className="g-section-hd-inner">🚀 RE-ASSESSMENT READINESS</div>
        {(() => {
          const completedTasks = Object.keys(evState).length;
          const requiredTasks = 18; // 75% of 25 total tasks
          const isReady = completedTasks >= requiredTasks;
          const readinessPct = Math.min(100, Math.round((completedTasks / requiredTasks) * 100));
          
          return (
            <div>
              <p style={{fontSize:'12px', color:'#94a3b8', marginBottom:'16px', lineHeight:'1.5'}}>Re-assessment is unlocked based on action, not time. The candidate must complete at least 75% of their gamified tasks to prove development before testing again.</p>
              <div style={{background:'rgba(255,255,255,.02)', border:`1px solid ${isReady ? T.gn : T.am}40`, borderRadius:'8px', padding:'16px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                  <div style={{fontSize:'14px', fontWeight:'700', color:isReady ? T.gn : T.am}}>
                    {isReady ? '✅ Ready to Re-assess' : '⏳ Action Required'}
                  </div>
                  <div className="mono" style={{fontSize:'11px', fontWeight:'800', color:isReady ? T.gn : T.am}}>
                    {completedTasks} / {requiredTasks} TASKS
                  </div>
                </div>
                <div style={{height:'6px', background:'rgba(255,255,255,.07)', borderRadius:'100px', overflow:'hidden', marginBottom:'12px'}}>
                  <div style={{height:'100%', width:`${readinessPct}%`, background:isReady ? T.gn : T.am, borderRadius:'100px', transition:'width 0.5s ease'}} />
                </div>
                <div style={{fontSize:'12px', color:'#cbd5e1', lineHeight:'1.5'}}>
                  {isReady 
                    ? 'Candidate has submitted enough evidence and is eligible to retake the CORE assessment.' 
                    : `Candidate needs to submit evidence for ${requiredTasks - completedTasks} more Quests or Power-Ups to unlock their next assessment.`}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'#1e2a3a', textAlign:'center', padding:'12px 0' }}>
        CORE· {candidate.doc_id} · Carnelian Pvt Ltd
      </div>
      </div>
      <DownloadBtn elementId={`player-report-${candidate.doc_id}`} filename={`${candidate.name}_Player_Report.pdf`} T={T} />
    </div>
  );
};

// ─── TEAM INSIGHT REPORT (High-Fidelity PDF Match) ────────────────────────
const TEAM_PERSONAS = [
  { cond: (s, variance) => variance < 8 && s.overall >= 70, name: 'The Batholith', desc: 'A group with very similar strengths across the board. Consistent and capable, but with less variety of approach.' },
  { cond: (s, variance, profiles) => profiles.length > 5 && s.overall >= 65, name: 'The Conglomerate', desc: 'Many different individual profiles held together by something they share. Strong under steady demands, needs support when pressure comes from an unexpected direction.' },
  { cond: (s, variance, profiles, top) => top.length < 3 && s.overall < 65, name: 'The Geode', desc: 'Quiet on the surface with real depth inside. A few exceptional people and a group still catching up.' },
  { cond: (s, variance) => variance > 15 && s.overall < 60, name: 'The Breccia', desc: 'Plenty of variety but not much holding it together yet. Bringing the group together is the first job.' },
  { cond: (s) => s.C >= 75 && s.LAavg < 65, name: 'The Basalt Column', desc: 'Regular, fast and high-output. Excellent at getting things done, less comfortable when things change.' },
  { cond: (s) => s.LAavg >= 70 && s.C < 70, name: 'The Alluvial Fan', desc: 'Broad and adaptable, able to turn a hand to most things, without deep strength in any one area yet.' },
  { cond: (s) => s.ES >= 70 && s.CQavg >= 65, name: 'The Metamorphic Belt', desc: 'A group already shaped by pressure. Resilient and experienced, and carrying some wear.' },
  { cond: () => true, name: 'The Vein System', desc: 'A few standout individuals carrying much of the group\'s strength.' }
];

const SUB_DIM_MAP = [
  { k:'C', l:'Reliability and follow-through' },
  { k:'LA_PA', l:'Learning from other people' },
  { k:'CQ_K', l:'Understanding other cultures' },
  { k:'CQ_B', l:'Adapting to different people' },
  { k:'ES', l:'Holding the line under pressure' },
  { k:'EO_ER', l:'Thinking through difficult decisions' },
  { k:'A', l:'Working well with others' },
  { k:'OCB_CV', l:'Involvement in wider organisation' },
  { k:'OCB_CO', l:'Considerateness' },
  { k:'LA_RA', l:'Delivering in new situations' },
  { k:'CQ_M', l:'Willingness to engage across cultures' },
  { k:'LA_CA', l:'Adapting to change' },
  { k:'EO_RC', l:'Following process consistently' },
  { k:'O', l:'Openness to new ideas' },
  { k:'OCB_S', l:'Staying positive when things are hard' },
  { k:'OCB_Cn', l:'Personal organisation' },
  { k:'OCB_A', l:'Helping colleagues' },
  { k:'E', l:'Visibility and presence' },
  { k:'EO_T', l:'Speaking up about mistakes' },
  { k:'LA_MA', l:'Thinking through new problems' },
  { k:'EO_AI', l:'Authentic Integrity' }
];

// ─── SHARED CONTENT & CHART HELPERS (add once, above TeamInsightReport) ──────

const CI_LABELS = {
  CII: 'Trustworthiness', LRS: 'Readiness to lead', TVS: 'Contribution to the team',
  ADS: 'Handling change', SES: 'Confidence with people', OPS: 'Getting work done',
  PMS: 'Coping with pressure',
};
const CI_ORDER = ['SES', 'PMS', 'ADS', 'TVS', 'CII', 'OPS', 'LRS'];

// One entry per measured quality. `why` is a function of orgName so the
// "why it matters" line always names the actual organisation.
const Q21_CONTENT = {
  C: {
    beh: "Turning up, being on time, following the process properly and doing a little more than the minimum without being asked. In practice: forms completed correctly first time, deadlines treated as real, and standards held even when nobody is watching.",
    why: org => `In banking-style environments, and at ${org} generally, following procedure is not just tidiness, it is how the organisation stays safe. A team this reliable picks up requirements and routines with far less chasing than usual, freeing up supervisory time for higher-value work.`,
    todo: "Give real responsibility early: reconciliations, file reviews, audit preparation. This group will handle it, and it builds the credibility that helps them later.",
    owner: "Line manager",
    resources: "Deep Work by Cal Newport · Getting Things Done by David Allen · short weekly delivery reviews",
  },
  LA_PA: {
    beh: "Asking for feedback and then actually using it. Adjusting approach based on how someone reacted. Building working relationships quickly with people quite different from themselves.",
    why: org => `Work at ${org} is learned from people far more than from manuals. Because this group takes so well to being taught, every hour a manager invests in them goes further than it usually would.`,
    todo: "Set up mentor pairings formally rather than leaving them to chance. This is usually the single highest-return action available, because the willingness to learn is already there.",
    owner: "HR / L&D",
    resources: "Pair with a manager two levels up · structured feedback check-ins",
  },
  CQ_K: {
    beh: "Picking up quickly on the unwritten norms of a new team, region or partner organisation, and asking good questions rather than assuming.",
    why: org => `${org} works across different regions, departments and partners. A team that reads context well settles into new relationships faster and with fewer avoidable missteps.`,
    todo: "Give early exposure to unfamiliar contexts, a new region, a different department, an external partner, so this strength keeps compounding.",
    owner: "HR / L&D",
    resources: "The Culture Map by Erin Meyer · a short reflection after any cross-context interaction",
  },
  CQ_B: {
    beh: "Adjusting tone, pace and approach naturally depending on who is in the room, without losing their own voice.",
    why: org => `This is what makes a team credible with a wide range of people at ${org}, from frontline colleagues to senior stakeholders.`,
    todo: "Put this group in front of varied audiences early. It is a strength best used, not one that needs building.",
    owner: "HR / L&D",
    resources: "Protect this. No need to spend training budget here.",
  },
  ES: {
    beh: "Staying clear-headed and consistent in a tense conversation or a busy period, rather than becoming defensive or short with people.",
    why: org => `Pressure arrives at predictable moments for most teams at ${org}: deadlines, escalations, change. A team that holds steady here protects decision quality exactly when it matters most.`,
    todo: "Notice who holds this well and let them anchor the busiest periods; match workload for anyone who finds it harder.",
    owner: "Line manager",
    resources: "Emotional Agility by Susan David · a structured mindfulness programme",
  },
  EO_ER: {
    beh: "Working through a decision properly when the right answer is not obvious, rather than defaulting to whatever is easiest.",
    why: org => `Good judgement in grey areas protects ${org}'s reputation and its relationships. It is one of the harder qualities to teach, so a team that already has it is worth building on.`,
    todo: "Give real, ambiguous scenarios to work through together rather than only clear-cut policy questions.",
    owner: "HR / L&D",
    resources: "Giving Voice to Values by Mary Gentile (free curriculum)",
  },
  A: {
    beh: "Cooperating readily, listening well, and resolving small friction before it grows.",
    why: org => `This is the quiet infrastructure that keeps collaboration at ${org} running smoothly.`,
    todo: "Protect this by continuing to give the team genuinely collaborative work, not just individual targets.",
    owner: "Line manager",
    resources: "Give and Take by Adam Grant",
  },
  OCB_CV: {
    beh: "Taking an interest in how their work connects to the organisation as a whole, not just their own patch.",
    why: org => `A team engaged beyond its own remit is easier to align behind ${org}'s wider priorities when they shift.`,
    todo: "Invite this group into cross-team updates and wider strategy conversations, even briefly.",
    owner: "HR / L&D",
    resources: "Internal town halls · cross-team shadowing",
  },
  OCB_CO: {
    beh: "Thinking ahead about how a decision or message will land on someone else before making it.",
    why: org => `Considerate teams create fewer avoidable frictions inside ${org}, which saves management time.`,
    todo: "Recognise this quality explicitly. It is easy to take for granted and rarely rewarded directly.",
    owner: "Line manager",
    resources: "Regular peer recognition moments",
  },
  LA_RA: {
    beh: "Getting a result even when the situation is unfamiliar, rather than waiting until conditions are ideal.",
    why: org => `This is what lets ${org} move people into new roles or projects with confidence.`,
    todo: "Use this group for first-of-a-kind tasks; they are more likely to make early progress than most.",
    owner: "Line manager",
    resources: "Stretch assignments with a defined check-in point",
  },
  CQ_M: {
    beh: "Choosing to lean into an unfamiliar context rather than avoiding it.",
    why: org => `This willingness is what eventually turns into real cross-context skill at ${org}.`,
    todo: "Keep offering these opportunities. Willingness fades if it is never used.",
    owner: "HR / L&D",
    resources: "Rotation into a different region or department",
  },
  LA_CA: {
    beh: "Adjusting reasonably well when plans, tools or priorities shift.",
    why: org => `Change is constant at most organisations; ${org} benefits from people who do not need to be walked through every shift.`,
    todo: "Give early notice and a clear reason for change where possible. This is not resistance to manage, just context to provide.",
    owner: "Line manager",
    resources: "Clear, early change communication",
  },
  EO_RC: {
    beh: "Sticking to agreed process even when it would be quicker to skip a step, particularly under time pressure.",
    why: org => `Consistency here protects ${org} from the kind of small process drift that becomes a bigger issue later.`,
    todo: "Build in periodic scenario practice where following the process is genuinely inconvenient, so the habit holds under pressure.",
    owner: "HR / L&D",
    resources: "Realistic process scenarios with genuine trade-offs",
  },
  O: {
    beh: "Willingness to try an unfamiliar method or tool rather than defaulting to the one already known.",
    why: org => `This shapes how quickly a team at ${org} takes up a new system, product or way of working.`,
    todo: "Deliberately introduce one new approach at a time and give space to try it before judging it.",
    owner: "HR / L&D",
    resources: "Exposure to one unfamiliar approach at a time",
  },
  OCB_S: {
    beh: "Keeping a constructive tone during a genuinely frustrating stretch, rather than visibly checking out.",
    why: org => `This steadies the people around them, which matters more at ${org} during a difficult quarter than almost anything else.`,
    todo: "Notice and thank this explicitly. It often goes unrewarded because it looks like nothing happened.",
    owner: "Line manager",
    resources: "Direct, specific recognition",
  },
  OCB_Cn: {
    beh: "Planning their own workload rather than reacting to whatever arrives last.",
    why: org => `Personal organisation is what keeps individual delivery steady even as ${org}'s demands on the team grow.`,
    todo: "A simple weekly planning routine, reviewed briefly with a manager, builds this quickly.",
    owner: "Line manager",
    resources: "A simple weekly planning routine",
  },
  OCB_A: {
    beh: "Stepping in to help a colleague who is struggling, or absorbing a small inconvenience without being asked.",
    why: org => `Teams at ${org} rely on this kind of quiet mutual cover more than any policy captures. Without it, there is no slack when things get busy.`,
    todo: "Build shared work where credit cannot be separated out, so helping becomes normal rather than exceptional.",
    owner: "HR / L&D",
    resources: "The Culture Code by Daniel Coyle · shared team goals",
  },
  E: {
    beh: "Speaking up in meetings, being seen, and putting forward a view without needing to be asked directly.",
    why: org => `A quieter team can still deliver excellent work at ${org}, but their contribution needs a bit more active surfacing by managers.`,
    todo: "Create structured moments for everyone to contribute, rather than relying on people to volunteer.",
    owner: "Line manager",
    resources: "Structured go-arounds in meetings",
  },
  EO_T: {
    beh: "Admitting a mistake, saying 'I don't know', or raising bad news early rather than waiting.",
    why: org => `At ${org}, a problem raised early is far cheaper than one discovered late. A team whose instinct is to look composed may quietly sit on small issues.`,
    todo: "Create an explicit no-penalty window for early disclosure, with senior people visibly doing the same.",
    owner: "HR / L&D and line manager",
    resources: "The Fearless Organization by Amy Edmondson",
  },
  LA_MA: {
    beh: "Breaking an unfamiliar problem into parts and working through it, rather than looking for an existing template or asking what to do.",
    why: org => `This is usually where a team can add the most future value at ${org}, because routine work is steadily being automated while judgement-based work keeps growing.`,
    todo: "Build this through the work itself: regular real-problem discussions and rotation into non-standard cases, more than classroom training.",
    owner: "HR / L&D and line manager",
    resources: "Thinking in Bets by Annie Duke · a weekly real-problem discussion",
  },
  EO_AI: {
    beh: "Acting the same way whether or not anyone is watching, and declining an inducement without needing a policy to justify it.",
    why: org => `This is a foundation of trust at ${org}, especially anywhere the team touches money, decisions, or sensitive information.`,
    todo: "Treat this as a genuine strength to place with confidence, while still having an individual conversation before any unsupervised high-trust responsibility.",
    owner: "HR / L&D",
    resources: "Blind Spots by Bazerman and Tenbrunsel",
  },
};

const INTERVIEW_PROBES = {
  C: "Tell me about a time you had to enforce a process that everyone else wanted to bypass.",
  LA_PA: "Give me an example of a time you completely changed your approach based on someone else's feedback.",
  CQ_K: "Describe a time you entered a completely unfamiliar work culture. How did you figure out the unwritten rules?",
  CQ_B: "Tell me about a time you had to adjust your communication style to get through to a difficult stakeholder.",
  ES: "Walk me through the most stressful professional week you've had recently. How did you keep things moving?",
  EO_ER: "Tell me about a time you had to make a decision where the 'right' answer wasn't covered by company policy.",
  A: "Give an example of a time you had to work closely with someone whose working style was the exact opposite of yours.",
  OCB_CV: "Tell me about a time you volunteered for a project or committee that fell completely outside your job description.",
  OCB_CO: "Describe a time you delayed your own work to help a colleague who was struggling.",
  LA_RA: "Tell me about a project you were handed where you had absolutely no prior experience. Where did you start?",
  CQ_M: "Describe a time you proactively sought out a project working with a demographic or region you knew nothing about.",
  LA_CA: "Walk me through a time the strategy or tools changed halfway through a project. How did you adapt?",
  EO_RC: "Tell me about a time a manager or client asked you to skip a standard procedure to save time.",
  O: "Describe a time you pushed the team to adopt a new tool or method, even though the old one 'worked fine'.",
  OCB_S: "Tell me about a time morale was low on your team. What did you specifically do about it?",
  OCB_Cn: "Walk me through your personal system for ensuring you don't drop balls when you're managing 5+ competing priorities.",
  OCB_A: "Tell me about a time you took over a task for a colleague because you noticed they were overwhelmed.",
  E: "Describe a time you had to speak up in a room full of senior stakeholders to course-correct a project.",
  EO_T: "Tell me about a time you made a significant mistake and realized it before anyone else did.",
  LA_MA: "Walk me through a complex problem you solved where there was no playbook or existing template.",
  EO_AI: "Tell me about a time doing the right thing cost you professionally or made your life significantly harder."
};

const getQualityInfo = (key, orgName, industry = '') => {
  const meta = SUB_DIM_MAP.find(d => d.k === key) || {};
  const label = meta.l || key;
  const base = Q21_CONTENT[key];
  
  // Dynamic Industry Staking
  let indText = `At ${orgName}, this is critical.`;
  const indLower = industry.toLowerCase();
  if (indLower.includes('bank') || indLower.includes('financ') || indLower.includes('insurance')) indText = `In banking and finance, and at ${orgName} specifically, this protects regulatory standing and client trust.`;
  else if (indLower.includes('tech') || indLower.includes('telecom')) indText = `In the tech sector, and at ${orgName}, this determines how fast the team ships and adapts to market shifts.`;
  else if (indLower.includes('fmcg') || indLower.includes('retail')) indText = `In fast-moving consumer sectors like ${orgName}, this protects market share and drives rapid execution.`;
  else if (indLower.includes('gov') || indLower.includes('civil')) indText = `In the public sector, and at ${orgName}, this ensures accountability and sustained service delivery under reform pressure.`;
  else if (indLower.includes('ngo') || indLower.includes('development')) indText = `In the development sector, and at ${orgName}, this builds donor confidence and community trust.`;
  else indText = `In your sector, and at ${orgName}, this directly impacts operational resilience.`;

 if (base) {
    // Replace the base copy's own sector framing with the dynamic industry framing, without doubling org mentions
    const originalWhy = base.why(orgName);
    const sentences = originalWhy.split('. ');
    let dynamicWhy;
    if (sentences.length > 1 && sentences[0].includes(orgName)) {
      dynamicWhy = indText + ' ' + sentences.slice(1).join('. ');
    } else if (sentences.length === 1) {
      dynamicWhy = originalWhy;
    } else {
      dynamicWhy = indText + ' ' + originalWhy;
    }

    return {
      label, beh: base.beh, why: dynamicWhy, todo: base.todo, owner: base.owner, resources: base.resources,
      probe: INTERVIEW_PROBES[key] || "Walk me through a time you had to demonstrate this quality under pressure."
    };
  }
  return {
    label, beh: `Shows up day to day as a noticeable pattern around ${label.toLowerCase()}.`,
    why: `${indText} This shapes how smoothly things run, and is worth watching as the team develops.`,
    todo: `Build this through regular, specific feedback and small stretch opportunities tied to ${label.toLowerCase()}.`,
    owner: 'HR / L&D and line manager', resources: 'Ask HR / L&D for material tailored to this quality.',
    probe: "Walk me through a time you had to demonstrate this quality under pressure."
  };
};

// Individual + team framing per gemstone archetype, all in development lens.
const ARCHETYPE_GROWTH = {
  'Institutional Anchor': {
    individual: "The steady one. They hold the standard and stay level when everything around them is moving. Their growth comes from carrying that steadiness into new ways of working, and from putting their view forward earlier.",
    team: "The point everyone else calibrates against. A team with an Anchor settles faster and argues less about basics. Give them a visible role in any change and the whole team follows more willingly.",
  },
  'Cross-Cultural Bridge': {
    individual: "They move between people, places and communication styles without losing themselves. Their growth comes from spending that ability on fewer relationships more deeply, and from holding a firm position even when it makes the room briefly uncomfortable.",
    team: "The one who finds the thread everyone else dropped. They make a mixed team genuinely function rather than simply coexist. Put them where two groups need to work together and have not yet found how.",
  },
  'Adaptive Innovator': {
    individual: "They do not wait for the map, they make one. Their growth comes from bringing people with them rather than arriving first, and from giving process the same attention they give the idea.",
    team: "The one who unsticks everybody else. They work best paired with someone steadier, who can turn the idea into something the team can actually deliver.",
  },
  'Strategic Integrity Leader': {
    individual: "They see the whole picture and care as much about how the work gets done as whether it gets done. Their growth comes from handing work to others rather than absorbing it.",
    team: "The person whose judgement the team trusts without needing it explained. The natural person to hand something to when it matters and nobody is quite sure how to approach it.",
  },
  'Ethics-Driven Executor': {
    individual: "They do what they said they would, every time, without needing to be chased. Their growth comes from flexing when a situation genuinely calls for it, and from raising a concern while there is still time to act on it.",
    team: "The person who brings credibility to whatever they are attached to. Ask for their view before decisions are final, they usually have one worth hearing.",
  },
  'Emerging Professional': {
    individual: "At the beginning of something real. Fresh perspective and genuine appetite. Their growth is simply exposure and reps, where asking questions is welcomed rather than tolerated.",
    team: "The energy in the room and the source of the questions nobody else thought to ask. They need more structure early on than the rest of the group, and they repay it quickly.",
  },
  'Collaborative Team Leader': {
    individual: "They notice when someone has gone quiet and create the conditions in which other people do their best work. Their growth comes from protecting their own work alongside everyone else's.",
    team: "The glue nobody notices until it is gone. Teams with a Weaver recover from setbacks faster and hide less from each other.",
  },
  'Visionary Sprinter': {
    individual: "They see the destination before the plan exists, and bring genuine energy to getting there. Their growth comes from pairing that pace with patience for people who need more detail before they commit.",
    team: "The one who raises the ambition in the room. Teams with a Sprinter aim higher than they otherwise would.",
  },
  'Eager Cultural Bridge-Builder': {
    individual: "They lead with warmth and notice who has been left out. Their growth comes from building the same quality of relationship with people who take longer to warm up.",
    team: "The reason a new joiner settles in fast. Early in their own development, and already changing how welcome the team feels.",
  },
  'Learning Champion': {
    individual: "They ask the question nobody else thought to ask, and come back having actually looked into it. Their growth comes from applying that curiosity to their own blind spots too.",
    team: "The person who quietly makes everyone around them a little sharper over time, just by asking good questions out loud.",
  },
  'Strategic Pivoter': {
    individual: "They read a changing situation quickly and redirect before others notice the shift. Their growth comes from bringing people along with the pivot, not just making it themselves.",
    team: "The one who stops the team throwing good effort after a plan that has stopped working.",
  },
  'High-Capability, Under Strain': {
    individual: "They deliver at a high level even while carrying real pressure. Their growth comes from building in recovery time before it is forced on them, and asking for support before it is urgent.",
    team: "The most dependable person in the room today. Worth checking in on regularly, since high performance under strain is not the same as sustainable performance.",
  },
  'Generous Under Pressure': {
    individual: "Even at full capacity, they check on someone else first. Their growth comes from extending the same care to their own workload that they extend to everyone around them.",
    team: "The reason morale holds when things get difficult. A quality every team needs and not every team has.",
  },
};

// Minimal, dependency-free radar chart.
const RadarChart = ({ data, T, size = 380, color = '#B01C24' }) => {
  const N = data.length;
  const pad = 150;
  const w = size + pad * 2, h = size + pad * 2;
  const cx = w / 2, cy = h / 2, R = size * 0.34;
  const angleFor = (i) => (-90 + i * (360 / N)) * (Math.PI / 180);
  const pt = (i, frac) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * R * frac, cy + Math.sin(a) * R * frac];
  };
  const clamp = (v) => Math.max(0, Math.min(1, v / 100));
  const poly = data.map((d, i) => pt(i, clamp(d.value)).join(',')).join(' ');
  const anchorFor = (x) => (x < cx - 12 ? 'end' : x > cx + 12 ? 'start' : 'middle');

  return (
    <svg width={w} height={h} style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map((lvl, ri) => (
        <polygon key={ri} points={data.map((_, i) => pt(i, lvl).join(',')).join(' ')}
          fill="none" stroke={lvl === 0.75 ? '#22c55e80' : T.b2}
          strokeDasharray={lvl === 0.75 ? '4 3' : undefined} strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const [x2, y2] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={T.b2} strokeWidth={1} />;
      })}
      <polygon points={poly} fill={`${color}22`} stroke={color} strokeWidth={2.5} />
      {data.map((d, i) => {
        const [x, y] = pt(i, clamp(d.value));
        return <circle key={i} cx={x} cy={y} r={4} fill={color} />;
      })}
      {data.map((d, i) => {
        const [lx, ly] = pt(i, 1.32);
        return <text key={'l' + i} x={lx} y={ly} fontSize="12" fontWeight="700" fill={T.t1} textAnchor={anchorFor(lx)}>{d.label}</text>;
      })}
      {data.map((d, i) => {
        const [vx, vy] = pt(i, clamp(d.value) + 0.12);
        return <text key={'v' + i} x={vx} y={vy} fontSize="12" fontWeight="800" fill={color} textAnchor={anchorFor(vx)}>{d.value}</text>;
      })}
    </svg>
  );
};

// SVG donut, renders correctly in html2canvas/PDF unlike CSS conic-gradient.
const DonutChart = ({ segments, size = 240, hole = 160, T, centerTop, centerBottom }) => {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2;
  let angle = -90;
  const paths = segments.map((s, i) => {
    const frac = s.value / total;
    if (frac >= 0.999) return <circle key={i} cx={cx} cy={cy} r={r} fill={s.color} />;
    const a0 = angle * Math.PI / 180;
    angle += frac * 360;
    const a1 = angle * Math.PI / 180;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.color} />;
  });
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>{paths}<circle cx={cx} cy={cy} r={hole / 2} fill={T.bg1} /></svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {centerTop}{centerBottom}
      </div>
    </div>
  );
};

// ─── CULTURE PULSE REPORT (Multi-Dept Org) ────────────────────────
const CULTURE_PERSONAS = [
  { cond: s => s.A >= 60 && s.EOavg >= 60, name: 'A Resilient, Relationship-First Culture', desc: 'High psychological safety and strong ethical guardrails. People trust each other and the institution.' },
  { cond: s => s.O >= 60 && s.LAavg >= 60, name: 'An Agile, Innovation-Driven Culture', desc: 'Fast-moving and adaptable. The organization naturally absorbs new frameworks and challenges legacy thinking.' },
  { cond: s => s.C >= 60 && s.ES >= 60, name: 'A Highly Reliable, Execution-Focused Culture', desc: 'Process-driven and steady under pressure. The organization excels at sustained, high-quality delivery.' },
  { cond: s => s.E >= 60 && s.CQavg >= 60, name: 'A Dynamic, Externally-Oriented Culture', desc: 'Highly visible and culturally fluid. The organization is exceptionally strong at stakeholder and partner management.' },
  { cond: () => true, name: 'A Balanced, Pragmatic Culture', desc: 'A steady organizational profile with distributed strengths across execution, relationships, and adaptability.' }
];


// Development-lens content per measured area. "buildReason" replaces the old
// "risk" framing — same information, phrased as what's worth building rather
// than what's dangerous.
const CULTURE_DIM_CONTENT = {
  C: {
    hiring: "This organisation consistently attracts structured, reliable people who follow through.",
    culture: "A process-respecting environment where deadlines are treated as real and quality standards hold.",
    payoff: "Strong operational reliability and few dropped balls.",
    structural: "Cross-departmental handoffs can slip when a process isn't explicitly defined.",
    buildReason: "Making ownership visible across department boundaries would extend this strength further.",
    intervention: "Introduce org-wide OKRs and a shared accountability dashboard so ownership is visible past team boundaries.",
  },
  O: {
    hiring: "This organisation draws in intellectually curious people who like to question how things are done.",
    culture: "An environment comfortable debating ideas and trying new workflows.",
    payoff: "Strong organic innovation and less risk of getting stuck in old methods.",
    structural: "Some teams may default to 'how we've always done it' more than others.",
    buildReason: "A shared space for testing new approaches would let this curiosity travel further across the organisation.",
    intervention: "Launch an internal sandbox initiative; recognise teams for testing and documenting new approaches, whether or not they land.",
  },
  E: {
    hiring: "This organisation attracts confident, persuasive people who are comfortable being heard.",
    culture: "A high-energy culture where visibility and influence matter.",
    payoff: "Strong internal advocacy and a confident external presence.",
    structural: "Quieter parts of the organisation may need more deliberate space to be heard.",
    buildReason: "Structured turn-taking would help ideas surface evenly rather than by who speaks loudest.",
    intervention: "Build rotational speaking roles into town halls and cross-department meetings so every group gets airtime.",
  },
  A: {
    hiring: "This organisation attracts empathetic, cooperative people who work well together.",
    culture: "A warm environment with real psychological safety and low friction.",
    payoff: "Strong retention and smooth cross-functional collaboration.",
    structural: "Some natural siloing can appear between departments that rarely interact directly.",
    buildReason: "Rewarding collaboration explicitly would turn this natural warmth into deliberate cross-team practice.",
    intervention: "Fold cross-departmental 360 feedback into leadership evaluation, so collaboration is recognised as much as individual output.",
  },
  ES: {
    hiring: "This organisation attracts people who stay grounded and think clearly under stress.",
    culture: "A calm, measured environment even during busy or high-stakes periods.",
    payoff: "Consistent decision quality and lower burnout during turbulent stretches.",
    structural: "Stress can still spread between people during sustained busy periods.",
    buildReason: "Deliberate recovery time would help this steadiness hold even at the busiest points in the year.",
    intervention: "Audit workload distribution and build in planned decompression periods after intense sprints.",
  },
  CQavg: {
    hiring: "This organisation attracts people who move naturally across different backgrounds and norms.",
    culture: "An inclusive, adaptable environment that respects regional and institutional differences.",
    payoff: "Smooth expansion into new markets and strong multi-stakeholder relationships.",
    structural: "Some parts of the organisation may be less exposed to external partners or regional offices.",
    buildReason: "Wider rotation would spread this cultural fluency more evenly across levels.",
    intervention: "Build cross-regional or cross-functional rotations into the path to senior leadership.",
  },
  OCBavg: {
    hiring: "This organisation attracts people who look beyond their formal role to help where needed.",
    culture: "A supportive environment where people naturally cover for each other.",
    payoff: "Strong resilience — the organisation holds together even when formal process breaks down.",
    structural: "Work that falls between two departments can still stall without a clear owner.",
    buildReason: "Recognising this generosity explicitly would help it show up consistently rather than only when someone happens to notice.",
    intervention: "Update the appraisal system to explicitly credit contributions made to other teams.",
  },
  LAavg: {
    hiring: "This organisation attracts fast learners who actively seek out new skills.",
    culture: "A growth-oriented environment where upskilling happens organically.",
    payoff: "The organisation can shift strategy or adopt new tools with relatively little friction.",
    structural: "New systems may still need more structured onboarding in some teams than others.",
    buildReason: "Investing in self-directed learning would compound a strength that's already there.",
    intervention: "Shift some L&D budget from mandatory compliance training toward self-directed learning stipends.",
  },
  EOavg: {
    hiring: "This organisation attracts principled people who value transparency.",
    culture: "A high-integrity environment where bad news travels quickly and rules are respected.",
    payoff: "Strong compliance standing, solid audit performance, and real stakeholder trust.",
    structural: "Under pressure, small workarounds can occasionally go unspoken rather than raised.",
    buildReason: "A visible, no-penalty way to flag near-misses would make this openness even more reliable.",
    intervention: "Introduce a visible, non-punitive near-miss reporting system so raising a small issue early is normal, not risky.",
  },
};

// What a dominant or absent profile mix signals at organisation scale.
const ORG_ARCHETYPE_TAG = {
  'Adaptive Innovator': 'moving fast through ambiguity',
  'Institutional Anchor': 'steady process discipline',
  'Visionary Sprinter': 'big-picture momentum and pace',
  'Collaborative Team Leader': 'quiet trust-building inside teams',
  'Cross-Cultural Bridge': 'translating across different groups and contexts',
  'Eager Cultural Bridge-Builder': 'warmly bringing new people in',
  'Ethics-Driven Executor': 'consistent, principled follow-through',
  'Learning Champion': 'curiosity that lifts everyone around them',
  'Strategic Pivoter': 'reading a changing situation and redirecting early',
  'High-Capability, Under Strain': 'sustained delivery even under real pressure',
  'Strategic Integrity Leader': 'combining judgement with strong values',
  'Generous Under Pressure': 'steadying morale when things get hard',
  'Emerging Professional': 'fresh energy and real appetite to learn',
};

const getLearningPrefSoft = (s) => {
  if (s.LAavg >= 60 && s.O >= 60) return {
    mode: 'Self-Directed & Exploratory',
    desc: 'This culture does well with autonomy: real tools, real problems, and room to work through them, rather than mandatory syllabus-style training.',
    incentive: 'Recognise this with exposure to new projects and room to experiment.',
    resist: 'Change lands best here with a reason attached rather than as a plain instruction. A little context up front goes a long way.',
  };
  if (s.C >= 60 && s.ES >= 60) return {
    mode: 'Structured & Certification-Led',
    desc: 'This culture responds well to clear syllabi, formal certifications, and expert-led instruction.',
    incentive: 'Recognise this with formal credentials, titles, and visible career pathways.',
    resist: 'Frequent, unexplained changes in direction take more to absorb here than a steady, well-sequenced plan.',
  };
  if (s.E >= 60 && s.A >= 60) return {
    mode: 'Cohort-Based & Social',
    desc: 'This culture learns best through interaction: workshops, peer mentoring, group problem-solving.',
    incentive: 'Recognise this with public recognition and chances to lead or mentor others.',
    resist: 'Solitary, self-paced modules with no interaction tend to get less engagement here.',
  };
  return {
    mode: 'Pragmatic & On-the-Job',
    desc: 'This culture wants practical, immediately usable skills tied directly to daily work.',
    incentive: 'Recognise this with tools that make the job noticeably easier.',
    resist: 'Long theoretical modules with no clear application tend to lose people here.',
  };
};

const getLeadershipFitSoft = (s) => {
  if (s.LAavg >= 60 && s.O >= 60) return {
    succeeds: 'Visionary & Autonomy-Minded',
    lessWell: 'Highly Directive & Process-Heavy',
    desc: 'Leaders do best here by setting the direction and then stepping back. This group responds better to a clear why than to close oversight of exactly how the work gets done.',
  };
  if (s.C >= 60 && s.EOavg >= 60) return {
    succeeds: 'Structured & Principled',
    lessWell: 'Inconsistent or Reactive',
    desc: 'Leaders do best here by being consistent and leading by example. Shifting priorities day to day is harder for this group to build trust around than a steady, principled approach.',
  };
  if (s.A >= 60 && s.OCBavg >= 60) return {
    succeeds: 'Participative & Empathetic',
    lessWell: 'Command-and-Control',
    desc: 'Leaders do best here by building consensus and showing genuine care. A more directive, top-down style tends to land less naturally and can quietly cool engagement over time.',
  };
  return {
    succeeds: 'Clear & Even-Handed',
    lessWell: 'Ambiguous or Distant',
    desc: 'This group does best with clear expectations and an approachable, visible leader.',
  };
};

// ─── PRINT PALETTE (always light, regardless of dashboard theme) ────────────
const PRT = {
  c: '#B01C24', cDeep: '#6B0E13', cSoft: '#F8E9EA',
  gold: '#A07830', goldSoft: '#F6EFE2',
  ink: '#1A1414', sub: '#4A3F3F', faint: '#8C7F7F',
  line: '#E5DEDE', lineSoft: '#F1ECEC', bg: '#FFFFFF', panel: '#FAF7F5',
  gn: '#15803D', gnSoft: '#E9F4EC',
  am: '#B45309', amSoft: '#FBF1E4',
  rd: '#B91C1C', rdSoft: '#FBEAEA',
};

const PR_W = 794, PR_H = 1123, PR_PAD = 46;

const prBandName = v => v >= 75 ? 'Strong' : v >= 60 ? 'Solid' : 'Still building';
const prCol = v => v >= 75 ? PRT.gn : v >= 60 ? PRT.am : PRT.rd;
const prSoft = v => v >= 75 ? PRT.gnSoft : v >= 60 ? PRT.amSoft : PRT.rdSoft;

const prChunk = (arr, first, rest) => {
  const out = [];
  if (!arr.length) return out;
  out.push(arr.slice(0, first));
  let i = first;
  while (i < arr.length) { out.push(arr.slice(i, i + rest)); i += rest; }
  return out;
};

const prCap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// ─── SHARED CONTENT MAPS ────────────────────────────────────────────────────
const PR_FRIENDLY = {
  CQavg: 'cultural intelligence', LAavg: 'learning agility', OCBavg: 'team citizenship',
  EOavg: 'ethical orientation', C: 'reliability and follow-through', O: 'openness to new ideas',
  E: 'visibility and presence', A: 'working well with others', ES: 'steadiness under pressure',
};

const PR_CAT = {
  C: 'process', LA_PA: 'people', CQ_K: 'people', CQ_B: 'people', ES: 'steadiness',
  EO_ER: 'judgement', A: 'people', OCB_CV: 'people', OCB_CO: 'people', LA_RA: 'judgement',
  CQ_M: 'people', LA_CA: 'steadiness', EO_RC: 'process', O: 'judgement', OCB_S: 'steadiness',
  OCB_Cn: 'process', OCB_A: 'people', E: 'people', EO_T: 'people', LA_MA: 'judgement', EO_AI: 'process',
};
const PR_CAT_LABEL = { people: 'relational', steadiness: 'resilience', judgement: 'judgement', process: 'process' };
const PR_CAT_MEANING = {
  people: 'how they work with people',
  steadiness: 'how they hold up when things are hard',
  judgement: 'how they think through the unfamiliar',
  process: 'how consistently they run the basics',
};

const PR_CI_CONTAINS = {
  SES: 'Working well with others, visibility and presence, and adapting to different people.',
  PMS: 'Holding the line under pressure, staying steady, and staying positive when things are hard.',
  ADS: 'Adapting to change, openness to new ideas, and delivering in unfamiliar situations.',
  TVS: 'Helping colleagues, considerateness, and involvement beyond the immediate role.',
  CII: 'Reliability and follow-through, following process consistently, and speaking up about mistakes.',
  OPS: 'Personal organisation, reliability, and consistency of delivery week to week.',
  LRS: 'Thinking through difficult decisions, thinking through new problems, and learning from others.',
};

const PR_LEAN = {
  'Collaborative Team Leader': 'people', 'Cross-Cultural Bridge': 'people',
  'Eager Cultural Bridge-Builder': 'people', 'Generous Under Pressure': 'people',
  'Emerging Professional': 'change', 'Adaptive Innovator': 'change', 'Visionary Sprinter': 'change',
  'Strategic Pivoter': 'change', 'Learning Champion': 'change',
  'Institutional Anchor': 'process', 'Ethics-Driven Executor': 'process',
  'Strategic Integrity Leader': 'process', 'High-Capability, Under Strain': 'process',
};

const PR_GEO = {
  'The Batholith': 'A batholith is a single vast body of rock formed from one source. This group is unusually consistent: similar strengths, similar instincts, few surprises.',
  'The Conglomerate': 'A conglomerate is a rock made of many different stones held together by one natural cement. The individuals here are varied, but they share a set of values that holds them together.',
  'The Geode': 'A geode looks plain on the outside and holds crystal inside. This group has a few exceptional people and a wider group still catching up to them.',
  'The Breccia': 'A breccia is made of sharp, varied fragments that have not yet been smoothed together. The variety is real; the cementing is the work ahead.',
  'The Basalt Column': 'Basalt columns are regular, fast-formed and strong. This group is built for output and consistency, and is less comfortable when the shape of the work changes.',
  'The Alluvial Fan': 'An alluvial fan spreads wide rather than cutting deep. This group can turn a hand to most things, and its next stage is depth in a few of them.',
  'The Metamorphic Belt': 'Metamorphic rock has already been reshaped by pressure. This group carries real experience of hard periods, and some wear from them.',
  'The Vein System': 'A vein system concentrates value in a few seams running through ordinary rock. A few standout individuals carry much of this group\'s strength.',
};

const TI_PAIRS = [
  ['Adaptive Innovator', 'Institutional Anchor', 'Ideas meet delivery: one opens up the route, the other makes it stick.'],
  ['Visionary Sprinter', 'Ethics-Driven Executor', 'Ambition meets follow-through: pace is kept honest by consistency.'],
  ['Emerging Professional', 'Learning Champion', 'Appetite meets method: the newest member learns how to learn from the strongest learner.'],
  ['Collaborative Team Leader', 'High-Capability, Under Strain', 'Care meets load: the person who notices people supports the person carrying the most.'],
  ['Strategic Pivoter', 'Institutional Anchor', 'Change meets stability: pivots land better when anchored.'],
  ['Cross-Cultural Bridge', 'Emerging Professional', 'Context meets curiosity: the bridge shows the new joiner how the wider world works.'],
];

const PR_ROLE_TARGETS = [
  { name: 'Client-Facing / Stakeholder Mgmt', targets: { E: [65, 100], CQavg: [60, 100], A: [60, 100] } },
  { name: 'Peer Coordination / Project Support', targets: { OCBavg: [65, 100], A: [60, 100], C: [60, 100] } },
  { name: 'Change / Reform / Innovation', targets: { O: [65, 100], LAavg: [65, 100] } },
  { name: 'Compliance / Audit / Risk', targets: { EOavg: [70, 100], C: [70, 100] } },
  { name: 'Operations / Technical Specialist', targets: { C: [65, 100], ES: [60, 100] } },
  { name: 'Future Leadership Potential', targets: { LAavg: [65, 100], EOavg: [65, 100], E: [60, 100] } },
];

const PR_ROLE_BUILT = {
  'Client-Facing / Stakeholder Mgmt': 'Visibility and presence, cultural intelligence, working well with others',
  'Peer Coordination / Project Support': 'Team citizenship, working well with others, reliability and follow-through',
  'Change / Reform / Innovation': 'Openness to new ideas, learning agility',
  'Compliance / Audit / Risk': 'Ethical orientation, reliability and follow-through',
  'Operations / Technical Specialist': 'Reliability and follow-through, steadiness under pressure',
  'Future Leadership Potential': 'Learning agility, ethical orientation, visibility and presence',
};

const PR_WHERE_FIRST = {
  C: 'Cross-department handovers and month-end routines',
  ES: 'The weeks after sustained busy periods',
  O: 'Adoption of new tools and methods',
  CQavg: 'Roles with little exposure outside their own area',
  LAavg: 'First-of-a-kind tasks with no template to follow',
  E: 'Large meetings and cross-team forums',
  A: 'Friction between teams that rarely interact directly',
  OCBavg: 'Work that falls between two owners',
  EOavg: 'Small issues raised late rather than early',
};

const PR_WORKING_SIGNAL = {
  C: 'Handoffs stop needing a chaser; ownership is named on both sides of every boundary.',
  ES: 'The week after a peak is planned rather than absorbed.',
  O: 'New approaches get a fair trial before being judged.',
  CQavg: 'No one reaches leadership without exposure outside their own area.',
  LAavg: 'People volunteer for unfamiliar work instead of routing around it.',
  E: 'Quieter groups are heard without being asked twice.',
  A: 'Cross-team friction is raised early and settled quickly.',
  OCBavg: 'Help that crosses team lines is visible and credited.',
  EOavg: 'Small issues surface early, without prompting.',
};

const PR_INT_TITLE = {
  C: 'Make ownership visible past team boundaries',
  ES: 'Protect recovery, not just delivery',
  O: 'Give new approaches a sanctioned space',
  CQavg: 'Build exposure into the promotion path',
  LAavg: 'Move learning budget toward self-directed growth',
  E: 'Create structured space for quieter voices',
  A: 'Reward collaboration explicitly',
  OCBavg: 'Credit help that crosses team lines',
  EOavg: 'Make early disclosure safe and visible',
};

const PR_INT_OWNER = {
  C: 'ExCo with HR', ES: 'HR with line managers', O: 'HR / L&D', CQavg: 'HR / L&D',
  LAavg: 'HR / L&D', E: 'Line managers with HR', A: 'HR with ExCo', OCBavg: 'HR / L&D', EOavg: 'ExCo with HR',
};

const PR_SITUATIONS = {
  'Self-Directed & Exploratory': [
    ['Rolling out a new process', 'State the problem it solves, then let the team shape the steps.', 'Issuing the finished process as a compliance requirement.'],
    ['Introducing a training programme', 'Real tools against a real problem, with room to experiment.', 'A mandatory syllabus with attendance as the measure of success.'],
    ['Raising a performance concern', 'A direct conversation with the reason made explicit.', 'Escalating through process before anyone has said the thing out loud.'],
  ],
  'Structured & Certification-Led': [
    ['Rolling out a new process', 'A clear written procedure, introduced step by step with named checkpoints.', 'A vague "figure it out as we go" rollout with shifting expectations.'],
    ['Introducing a training programme', 'A formal syllabus with a recognised certificate at the end.', 'Loose self-paced material with no credential or visible finish line.'],
    ['Raising a performance concern', 'A structured conversation against agreed, written expectations.', 'Ad-hoc feedback that changes depending on who is asking.'],
  ],
  'Cohort-Based & Social': [
    ['Rolling out a new process', 'Workshop it with the group first, so the process arrives with buy-in attached.', 'A memo announcing the change with no discussion.'],
    ['Introducing a training programme', 'Cohort sessions, peer mentoring and group problem-solving.', 'Solitary self-paced modules with no interaction.'],
    ['Raising a performance concern', 'A private, relationship-first conversation before anything formal.', 'Public correction, or a formal letter as the first step.'],
  ],
  'Pragmatic & On-the-Job': [
    ['Rolling out a new process', 'Show how it makes the daily work easier, then embed it in the routine.', 'Framing it as theory or strategy with no visible daily benefit.'],
    ['Introducing a training programme', 'Short, practical sessions tied directly to this week\'s work.', 'Long theoretical modules with no clear application.'],
    ['Raising a performance concern', 'A specific, example-based conversation about the work itself.', 'Abstract feedback about attitude with no concrete example.'],
  ],
};

// ─── PRINT PRIMITIVES ───────────────────────────────────────────────────────
const PrStyles = () => (
  <style>{`
    .pr-page { box-shadow: 0 6px 26px rgba(0,0,0,0.28); }
    .pr-page * { box-sizing: border-box; }
  `}</style>
);

const CoreLogo = ({ h = 36 }) => {
  const [svg, setSvg] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch('/core-logo-for-light-mode.svg')
      .then(r => { if (!r.ok) throw new Error('logo fetch failed'); return r.text(); })
      .then(raw => {
        const cleaned = raw.replace(/<svg([^>]*)>/i, (m, attrs) => `<svg${attrs.replace(/\s(width|height)="[^"]*"/gi, '')} height="${h}" style="display:block;height:${h}px;width:auto;">`);
        setSvg(cleaned);
      })
      .catch(() => setErr(true));
  }, [h]);
  if (err || !svg) return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: h * 0.72, fontWeight: 700, color: PRT.c, letterSpacing: '0.02em' }}>CORE</span>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: h * 0.24, fontWeight: 700, color: PRT.faint, letterSpacing: '0.14em', textTransform: 'uppercase' }}>by Carnelian</span>
    </div>
  );
  return <div style={{ display: 'flex', alignItems: 'center', height: h }} dangerouslySetInnerHTML={{ __html: svg }} />;
};

const PrLabel = ({ c = PRT.c, children, style = {} }) => (
  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: c, ...style }}>{children}</div>
);

const PrHead = ({ children, size = 15, style = {} }) => (
  <div style={{ fontFamily: "'Public Sans',sans-serif", fontSize: size, fontWeight: 800, color: PRT.ink, letterSpacing: '-0.01em', lineHeight: 1.2, ...style }}>{children}</div>
);

const PrBody = ({ children, size = 9.5, color = PRT.sub, style = {} }) => (
  <div style={{ fontFamily: "'Public Sans',sans-serif", fontSize: size, color, lineHeight: 1.55, ...style }}>{children}</div>
);

const PrPage = ({ id, pageNo, total, footerLeft, footerRight, children }) => (
  <div id={id} className="pr-page" style={{ width: PR_W, height: PR_H, background: PRT.bg, position: 'relative', overflow: 'hidden', margin: '0 auto 18px', borderRadius: 3 }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${PRT.c}, ${PRT.gold}, transparent 70%)` }} />
    <div style={{ position: 'absolute', inset: 0, padding: `${PR_PAD + 8}px ${PR_PAD}px 58px`, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
    <div style={{ position: 'absolute', left: PR_PAD, right: PR_PAD, bottom: 20, borderTop: `1px solid ${PRT.line}`, paddingTop: 7, display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, color: PRT.faint, letterSpacing: '0.06em' }}>
      <span>{footerLeft}</span>
      <span>{footerRight} · Page {pageNo} of {total}</span>
    </div>
  </div>
);

const PrSectionHead = ({ num, title, sub }) => (
  <div style={{ marginBottom: 14, flexShrink: 0 }}>
    {num != null && <PrLabel style={{ marginBottom: 3 }}>SECTION {num}</PrLabel>}
    <PrHead size={17}>{title}</PrHead>
    {sub && <PrBody size={9} color={PRT.faint} style={{ marginTop: 4 }}>{sub}</PrBody>}
    <div style={{ height: 2, background: `linear-gradient(90deg, ${PRT.c}, ${PRT.gold}, transparent)`, marginTop: 8 }} />
  </div>
);

const PrKey = ({ title = 'KEY FOR THIS SECTION', rows, style = {} }) => (
  <div style={{ background: PRT.panel, border: `1px solid ${PRT.line}`, borderLeft: `3px solid ${PRT.gold}`, padding: '10px 12px', marginBottom: 12, ...style }}>
    <PrLabel c={PRT.gold} style={{ marginBottom: 7 }}>{title}</PrLabel>
    {rows.map(([k, v], i) => (
      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < rows.length - 1 ? 5 : 0 }}>
        <div style={{ width: 128, flexShrink: 0, fontFamily: "'Public Sans',sans-serif", fontSize: 8.5, fontWeight: 700, color: PRT.ink, lineHeight: 1.45 }}>{k}</div>
        <PrBody size={8.5}>{v}</PrBody>
      </div>
    ))}
  </div>
);

const PrLegend = ({ style = {} }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center', ...style }}>
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', color: PRT.faint }}>SCORE BANDS</span>
    {[['Strong 75+', PRT.gn], ['Solid 60 to 74', PRT.am], ['Still building below 60', PRT.rd]].map(([t, c]) => (
      <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block' }} />
        <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 8, color: PRT.sub, fontWeight: 600 }}>{t}</span>
      </span>
    ))}
  </div>
);

const PrTable = ({ cols, widths, rows, fontSize = 8.8, style = {} }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${PRT.line}`, ...style }}>
    <thead>
      <tr style={{ background: PRT.panel }}>
        {cols.map((c, i) => (
          <th key={i} style={{ width: widths ? widths[i] : undefined, padding: '7px 9px', textAlign: 'left', fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.2, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: PRT.sub, borderBottom: `2px solid ${PRT.line}` }}>{c}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r, ri) => (
        <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? `1px solid ${PRT.lineSoft}` : 'none' }}>
          {r.map((cell, ci) => (
            <td key={ci} style={{ padding: '7px 9px', fontFamily: "'Public Sans',sans-serif", fontSize, color: PRT.sub, verticalAlign: 'top', lineHeight: 1.5 }}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const PrMeta = ({ rows }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${PRT.line}` }}>
    <tbody>
      {rows.map(([k, v], i) => (
        <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${PRT.lineSoft}` : 'none' }}>
          <td style={{ width: 180, padding: '7px 12px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.3, fontWeight: 700, letterSpacing: '0.12em', color: PRT.faint, textTransform: 'uppercase', borderRight: `1px solid ${PRT.lineSoft}`, verticalAlign: 'top' }}>{k}</td>
          <td style={{ padding: '7px 12px', fontFamily: "'Public Sans',sans-serif", fontSize: 9.3, color: PRT.ink, fontWeight: 600, lineHeight: 1.45 }}>{v}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PrStats = ({ items }) => (
  <div style={{ display: 'flex', border: `1px solid ${PRT.line}`, background: PRT.panel }}>
    {items.map(([num, lab], i) => (
      <div key={i} style={{ flex: 1, padding: '12px 8px', textAlign: 'center', borderRight: i < items.length - 1 ? `1px solid ${PRT.line}` : 'none' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, color: PRT.c, lineHeight: 1 }}>{num}</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 6.8, letterSpacing: '0.1em', textTransform: 'uppercase', color: PRT.faint, marginTop: 5, lineHeight: 1.5 }}>{lab}</div>
      </div>
    ))}
  </div>
);

const PrNote = ({ title, color = PRT.c, children, style = {} }) => (
  <div style={{ border: `1px solid ${PRT.line}`, borderLeft: `3px solid ${color}`, background: PRT.bg, padding: '9px 12px', ...style }}>
    <PrLabel c={color} style={{ marginBottom: 4 }}>{title}</PrLabel>
    <PrBody size={8.8}>{children}</PrBody>
  </div>
);

const PrPairNotes = ({ left, right, style = {} }) => (
  <div style={{ display: 'flex', gap: 10, ...style }}>
    <div style={{ flex: 1 }}><PrNote title={left[0]} color={left[2] || PRT.gn}>{left[1]}</PrNote></div>
    <div style={{ flex: 1 }}><PrNote title={right[0]} color={right[2] || PRT.am}>{right[1]}</PrNote></div>
  </div>
);

const PrBarRow = ({ label, v, labelW = 195, h = 11, mono = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
    <div style={{ width: labelW, paddingRight: 10, textAlign: 'right', fontFamily: "'Public Sans',sans-serif", fontSize: 8.4, color: PRT.sub, fontWeight: 600, lineHeight: 1.25, flexShrink: 0 }}>{label}</div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: `${Math.max(2, Math.min(100, v)) * 0.8}%`, height: h, background: prCol(v), borderRadius: 1 }} />
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.4, fontWeight: 700, color: PRT.ink }}>{v}</span>
    </div>
  </div>
);

const PrQualityCard = ({ tag, tagColor, title, score, rows }) => (
  <div style={{ border: `1px solid ${PRT.line}`, borderLeft: `4px solid ${tagColor}`, background: PRT.bg, padding: '10px 13px', marginBottom: 9 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <PrLabel c={tagColor}>{tag}</PrLabel>
        <PrHead size={12.5} style={{ marginTop: 2 }}>{title}</PrHead>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 800, color: tagColor, flexShrink: 0 }}>
        {score}<span style={{ fontSize: 8, color: PRT.faint }}>/100</span>
      </div>
    </div>
    {rows.map(([k, v], i) => (
      <div key={i} style={{ marginTop: 5, lineHeight: 1.5 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.3, fontWeight: 700, letterSpacing: '0.1em', color: PRT.c }}>{k}: </span>
        <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 8.8, color: PRT.sub }}>{v}</span>
      </div>
    ))}
  </div>
);

const PrDonut = ({ segments, size = 150, hole = 96, centerTop, centerBottom }) => {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2;
  let angle = -90;
  const paths = segments.map((s, i) => {
    const frac = s.value / total;
    if (frac >= 0.999) return <circle key={i} cx={cx} cy={cy} r={r} fill={s.color} />;
    const a0 = angle * Math.PI / 180;
    angle += frac * 360;
    const a1 = angle * Math.PI / 180;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.color} />;
  });
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>{paths}<circle cx={cx} cy={cy} r={hole / 2} fill={PRT.bg} /></svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {centerTop}{centerBottom}
      </div>
    </div>
  );
};

const PR_COLORS = ['#15803D', '#26428B', '#B45309', '#B01C24', '#6D28D9', '#0E7490', '#A07830', '#475569', '#BE185D', '#4D7C0F', '#7C2D12', '#1E3A8A', '#374151'];

// ─── PAGE-BY-PAGE PDF EXPORTER ──────────────────────────────────────────────
const prLoadScript = (src, flag) => new Promise((resolve, reject) => {
  if (window[flag]) { resolve(); return; }
  const existing = document.querySelector(`script[data-${flag}]`);
  if (existing) {
    const check = setInterval(() => { if (window[flag]) { clearInterval(check); resolve(); } }, 50);
    return;
  }
  const s = document.createElement('script');
  s.src = src;
  s.setAttribute(`data-${flag}`, '1');
  s.onload = () => { window[flag] = true; resolve(); };
  s.onerror = reject;
  document.body.appendChild(s);
});

const exportPrintPDF = async (ids, filename, setBusy) => {
  try {
    setBusy('Loading export engine…');
    await prLoadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', '__h2c_ready');
    await prLoadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', '__jspdf_ready');
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    await new Promise(r => setTimeout(r, 200));
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'px', format: [PR_W, PR_H], orientation: 'portrait', hotfixes: ['px_scaling'] });
    for (let i = 0; i < ids.length; i++) {
      setBusy(`Rendering page ${i + 1} of ${ids.length}…`);
      const el = document.getElementById(ids[i]);
      if (!el) continue;
      const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#FFFFFF', logging: false });
      const img = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) pdf.addPage([PR_W, PR_H], 'portrait');
      pdf.addImage(img, 'JPEG', 0, 0, PR_W, PR_H);
    }
    pdf.save(filename);
  } catch (e) {
    console.error('Print export failed', e);
    alert('Failed to generate the PDF. Please try again.');
  } finally {
    setBusy(null);
  }
};

const PrDownloadBtn = ({ ids, filename }) => {
  const [busy, setBusy] = useState(null);
  return (
    <button disabled={!!busy} onClick={() => exportPrintPDF(ids, filename, setBusy)} style={{
      margin: '18px auto', padding: '13px 26px', borderRadius: 8, background: busy ? PRT.faint : PRT.gold,
      color: '#fff', border: 'none', cursor: busy ? 'wait' : 'pointer',
      fontFamily: "'Public Sans',sans-serif", fontSize: 13, fontWeight: 800, display: 'flex',
      justifyContent: 'center', alignItems: 'center', gap: 8, width: '100%', maxWidth: PR_W, transition: 'all 0.2s',
    }}>
      {busy || '⬇ Download Report as PDF (A4)'}
    </button>
  );
};

const PrPreviewNote = ({ T, pages }) => (
  <div style={{ textAlign: 'center', marginBottom: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: T.t3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
    Print preview · A4 · {pages} page{pages !== 1 ? 's' : ''} · downloads exactly as shown
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// TEAM INSIGHT REPORT (print-authored)
// ═══════════════════════════════════════════════════════════════════════════
const TeamInsightReport = ({ candidate, allData, T }) => {
  const batch = candidate.batch;
  const normBatch = String(batch || '').trim().toLowerCase();
  const batchData = (allData || []).filter(r => String(r.batch || '').trim().toLowerCase() === normBatch && r.report_data?.validity?.overall !== 'red' && r.report_data?.scores);
  if (!batch) return <div style={{ padding: '40px', textAlign: 'center', color: T.t3 }}>No batch assigned.</div>;
  if (batchData.length < 2) return <div style={{ padding: '40px', textAlign: 'center', color: T.t3 }}>Only {batchData.length} valid response(s). Requires at least 2.</div>;

  // ── data prep ──
  const n = batchData.length;
  const fmt = v => n < 12 ? Math.round(v * 10) / 10 : Math.round(v);
  const orgName = candidate.org || batchData[0]?.org || 'the organisation';
  const orgKnown = orgName !== 'the organisation';
  const deptList = [...new Set(batchData.map(b => b.department).filter(Boolean))];
  const cohortTitle = deptList.length ? `${deptList.join(', ')} cohort` : `Batch ${batch} cohort`;
  const industry = candidate.industry || '';
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const qi = k => getQualityInfo(k, orgName, industry);

  const avgKey = k => {
    const vals = batchData.map(b => b.report_data?.scores?.[k]).filter(v => v != null).map(Number);
    return vals.length ? fmt(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };
  const dimKeys = ['O', 'C', 'E', 'A', 'ES', 'CQavg', 'OCBavg', 'LAavg', 'EOavg'];
  const teamAvg = {};
  dimKeys.forEach(k => { teamAvg[k] = avgKey(k); });
  teamAvg.overall = fmt(batchData.reduce((a, b) => a + Number(b.overall_score || 0), 0) / n);

  const ciAvg = {};
  Object.keys(CI_LABELS).forEach(k => {
    const vals = batchData.map(b => b.report_data?.CI?.[k]).filter(v => v != null).map(Number);
    ciAvg[k] = vals.length ? fmt(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  });
  const ciSorted = CI_ORDER.map(k => ({ k, l: CI_LABELS[k], v: ciAvg[k] })).sort((a, b) => b.v - a.v);
  const spread7 = fmt(ciSorted[0].v - ciSorted[ciSorted.length - 1].v);

  const subAvgs = SUB_DIM_MAP.map(d => ({ ...d, v: avgKey(d.k) })).filter(d => d.v > 0).sort((a, b) => b.v - a.v);
  if (subAvgs.length < 5) return <div style={{ padding: '40px', textAlign: 'center', color: T.t3 }}>This batch's records do not carry enough scored qualities to build a Team Insight Report.</div>;
  const top5 = subAvgs.slice(0, 5);
  const bot5 = subAvgs.slice(-5).reverse();
  const spread21 = fmt(subAvgs[0].v - subAvgs[subAvgs.length - 1].v);
  const strongList = subAvgs.filter(d => d.v >= 75);
  const solidList = subAvgs.filter(d => d.v >= 60 && d.v < 75);
  const buildList = subAvgs.filter(d => d.v < 60);

  const archCounts = {};
  batchData.forEach(b => { archCounts[b.profile_name] = (archCounts[b.profile_name] || 0) + 1; });
  const topProfiles = Object.entries(archCounts).sort((a, b) => b[1] - a[1]);
  const variance = Math.max(...dimKeys.map(k => teamAvg[k])) - Math.min(...dimKeys.map(k => teamAvg[k]));
  const persona = TEAM_PERSONAS.find(p => p.cond(teamAvg, variance, Object.keys(archCounts), topProfiles)) || TEAM_PERSONAS[TEAM_PERSONAS.length - 1];
  const personaTagline = `Bonded by ${top5[0].l.toLowerCase()} and ${top5[1].l.toLowerCase()}, still growing into ${bot5[0].l.toLowerCase()}.`;
  const geoWhy = PR_GEO[persona.name] || 'A name from geology for the group as a whole, so it is never confused with any individual\'s gemstone profile.';

  const catCount = list => {
    const c = {};
    list.forEach(d => { const cat = PR_CAT[d.k] || 'people'; c[cat] = (c[cat] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  };
  const topCats = catCount(top5), botCats = catCount(bot5);
  const inCommonLine = `Of the five strengths, ${topCats.map(([c, ct]) => `${ct} ${ct === 1 ? 'is' : 'are'} ${PR_CAT_LABEL[c]}`).join(' and ')}. The development areas cluster around ${botCats.slice(0, 2).map(([c]) => PR_CAT_LABEL[c]).join(' and ')}, which is the mirror image: this group's strengths come from ${PR_CAT_MEANING[topCats[0][0]]}, and its growth comes from ${PR_CAT_MEANING[botCats[0][0]]}.`;
  const PR_CAT_PLACE = { people: 'people-facing and coordination work', steadiness: 'work with real pressure and visible stakes', judgement: 'analysis and first-of-a-kind problems', process: 'work where consistency and accuracy carry the value' };
  const PR_CAT_GIVE = { judgement: 'judgement-heavy work', process: 'process-owning responsibilities', steadiness: 'higher-pressure assignments, with support in place', people: 'people-facing exposure' };

  // support list (uncapped, then grouped)
  const supportRaw = batchData.map(b => {
    const s = b.report_data?.scores || {}, ci = b.report_data?.CI || {};
    const noticed = [], helps = [];
    if ((s.ES || 0) < 60) { noticed.push('finds sustained pressure harder to absorb than most'); helps.push('a steadier first posting and regular check-ins through busy periods'); }
    if ((s.LAavg || 0) < 65) { noticed.push('is still building confidence with unfamiliar work'); helps.push('a named mentor and early exposure to varied work'); }
    if ((ci.OPS || 0) < 60) { noticed.push('gives a great deal to colleagues and needs help protecting their own workload'); helps.push('clear weekly priorities so their own tasks stay visible'); }
    const count = noticed.length;
    return {
      name: b.name, profile: b.profile_name, count,
      noticed: noticed.join('; '), helps: helps.join('; '),
      tier: count >= 3 ? 'Priority for early support' : count === 2 ? 'Would benefit from support' : 'Worth a regular check-in',
    };
  }).filter(x => x.count > 0).sort((a, b) => b.count - a.count);

  const patMap = {};
  supportRaw.forEach(s => {
    if (!patMap[s.noticed]) patMap[s.noticed] = { noticed: s.noticed, helps: s.helps, members: [] };
    patMap[s.noticed].members.push(s);
  });
  const patterns = Object.values(patMap).sort((a, b) => b.members.length - a.members.length);
  const showPatterns = n > 8 && patterns.some(p => p.members.length >= 3);
  const soloNotes = patterns.filter(p => p.members.length === 1);
  const shownIndividuals = supportRaw.slice(0, 14);
  const hiddenSupport = supportRaw.length - shownIndividuals.length;

  // graded role fit
  const fitDim = (v, min) => Math.max(35, Math.min(97, Math.round((v / (min + 15)) * 100)));
  const scoredCandidates = batchData.map(b => {
    let best = { role: PR_ROLE_TARGETS[0].name, pct: 0, lowKey: '', lowVal: 101 };
    PR_ROLE_TARGETS.forEach(role => {
      let sum = 0, c = 0, lk = '', lv = 101;
      Object.entries(role.targets).forEach(([k, [min]]) => {
        const v = b.report_data?.scores?.[k] ?? b.report_data?.CI?.[k];
        if (v != null) { c++; sum += fitDim(Number(v), min); if (v < lv) { lv = Number(v); lk = k; } }
      });
      const pct = c ? Math.round(sum / c) : 0;
      if (pct > best.pct) best = { role: role.name, pct, lowKey: lk, lowVal: lv };
    });
    const band = best.pct >= 75 ? 'Comfortable fit' : best.pct >= 60 ? 'Structured start' : 'Conversation first';
    const friendly = PR_FRIENDLY[best.lowKey] || 'the fundamentals';
    const focus = band === 'Comfortable fit'
      ? `Ready. Keep developing ${friendly}.`
      : band === 'Structured start'
        ? `Structured start, with a named mentor. Focus on ${friendly}.`
        : `Talk it through before placing; ${friendly} is the area to build first.`;
    return { name: b.name, profile: b.profile_name, role: best.role, pct: best.pct, band, focus };
  }).sort((a, b) => b.pct - a.pct);
  const bandCounts = {
    comfy: scoredCandidates.filter(c => c.band === 'Comfortable fit').length,
    struct: scoredCandidates.filter(c => c.band === 'Structured start').length,
    conv: scoredCandidates.filter(c => c.band === 'Conversation first').length,
  };
  const roleFamilies = PR_ROLE_TARGETS.map(r => {
    const inR = scoredCandidates.filter(c => c.role === r.name);
    if (!inR.length) return null;
    const avg = Math.round(inR.reduce((a, c) => a + c.pct, 0) / inR.length);
    return {
      name: r.name, built: PR_ROLE_BUILT[r.name] || '', avg, placed: inR.length,
      comfy: inR.filter(c => c.band === 'Comfortable fit').length,
      struct: inR.length - inR.filter(c => c.band === 'Comfortable fit').length,
    };
  }).filter(Boolean).sort((a, b) => b.avg - a.avg);

  // validity
  const validGreen = batchData.filter(b => b.report_data?.validity?.overall === 'green').length;
  const validAmber = n - validGreen;
  const presentingWell = batchData.filter(b => (b.report_data?.validity?.flags || []).some(f => f.key.toLowerCase().includes('l-scale') && f.type !== 'green')).length;
  const balancedCount = batchData.filter(b => (b.report_data?.validity?.flags || []).every(f => !(f.key.toLowerCase().includes('acquiescence') && f.type !== 'green'))).length;
  const measuredCount = batchData.filter(b => (b.report_data?.validity?.flags || []).every(f => !(f.key.toLowerCase().includes('extreme') && f.type !== 'green'))).length;

  // combination reading
  const leanCounts = { people: 0, change: 0, process: 0 };
  topProfiles.forEach(([nm, c]) => { leanCounts[PR_LEAN[nm] || 'people'] += c; });
  const processProfiles = topProfiles.filter(([nm]) => PR_LEAN[nm] === 'process');
  const processTotal = processProfiles.reduce((a, [, c]) => a + c, 0);
  const watchText = processTotal === 0
    ? 'No profile in this mix leans toward system and control. Process discipline will need to come from structure rather than temperament, which is exactly what the roadmap in Section 5 provides.'
    : processTotal <= 2
      ? `Process discipline currently rests with ${processTotal} ${processTotal === 1 ? 'person' : 'people'} (${processProfiles.map(([nm, c]) => `${nm} x${c}`).join(', ')}). Worth protecting, and worth not overloading.`
      : 'The mix carries its own balance of people, change and process orientations; no single person is the sole source of any of the three.';
  const mixLine = `${leanCounts.people} of the group lean toward people, ${leanCounts.change} toward change, and ${leanCounts.process} toward system and control. ${leanCounts.people >= leanCounts.change && leanCounts.people >= leanCounts.process ? 'This is a group that will hold together socially without management effort; structure is where deliberate attention pays off.' : leanCounts.change >= leanCounts.process ? 'This is a group with natural momentum on new work; consistency is where deliberate attention pays off.' : 'This is a group with natural discipline; energy for the unfamiliar is where deliberate attention pays off.'}`;
  const pairsPresent = TI_PAIRS.filter(([a, b]) => archCounts[a] && archCounts[b]);

  const capital = [
    { l: 'Cross-Functional Integration', v: fmt((Number(teamAvg.A) + Number(teamAvg.OCBavg)) / 2) },
    { l: 'Negotiation and Influence', v: fmt((Number(teamAvg.E) + Number(teamAvg.A)) / 2) },
    { l: 'Presentation and Projection', v: fmt((Number(teamAvg.E) + Number(teamAvg.CQavg)) / 2) },
    { l: 'Pressure Tolerance', v: fmt((Number(teamAvg.ES) + Number(teamAvg.C)) / 2) },
    { l: 'Governance and Control', v: fmt((Number(teamAvg.EOavg) + Number(teamAvg.C)) / 2) },
    { l: 'Analytical Problem-Solving', v: fmt((Number(teamAvg.LAavg) + Number(teamAvg.O)) / 2) },
  ].sort((a, b) => b.v - a.v);

  const smallCohort = n <= 12;
  const showSustain = teamAvg.ES < 60 && teamAvg.LAavg < 60;

  // ── page assembly ──
  const rest = [];
  const add = (sec, body) => rest.push({ sec, body });

  // SECTION 1
  add('s1', (
    <>
      <PrSectionHead num={1} title="The Story in One Page" sub="The whole cohort in a single view, before any of the detail." />
      <PrKey rows={[
        ['What this is', 'A summary of Sections 2 to 6. Nothing appears here that is not evidenced later in the report.'],
        ['How to use it', 'This is the page to bring to a leadership conversation. Everything after it is supporting detail.'],
      ]} />
      <PrLabel c={PRT.gold} style={{ marginBottom: 5 }}>THE COHORT IN A SENTENCE</PrLabel>
      <PrBody size={11.5} color={PRT.ink} style={{ fontStyle: 'italic', marginBottom: 16 }}>
        A group whose clearest strength is {top5[0].l.toLowerCase()}, supported by {top5[1].l.toLowerCase()}. What they are still growing into is {bot5[0].l.toLowerCase()}.
      </PrBody>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.gn}`, padding: '10px 12px', background: PRT.gnSoft }}>
          <PrLabel c={PRT.gn} style={{ marginBottom: 8 }}>TWO THINGS DONE WELL ALREADY</PrLabel>
          {top5.slice(0, 2).map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <PrBody size={9.5} color={PRT.ink} style={{ fontWeight: 700 }}>{d.l}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 800, color: PRT.gn }}>{d.v}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.am}`, padding: '10px 12px', background: PRT.amSoft }}>
          <PrLabel c={PRT.am} style={{ marginBottom: 8 }}>TWO THINGS TO BUILD</PrLabel>
          {bot5.slice(0, 2).map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <PrBody size={9.5} color={PRT.ink} style={{ fontWeight: 700 }}>{d.l}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 800, color: PRT.am }}>{d.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${PRT.line}`, borderLeft: `4px solid ${PRT.c}`, padding: '11px 13px', marginBottom: 10 }}>
        <PrLabel style={{ marginBottom: 4 }}>THE DEVELOPMENT PRIORITY</PrLabel>
        <PrHead size={12}>{bot5[0].l}</PrHead>
        <PrBody size={9} style={{ marginTop: 4 }}>{qi(bot5[0].k).todo} Section 5 sets out how, and Section 4 explains why this one comes first.</PrBody>
        <PrBody size={8} color={PRT.faint} style={{ marginTop: 5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Owner: {qi(bot5[0].k).owner}</PrBody>
      </div>
      <div style={{ border: `1px solid ${PRT.line}`, borderLeft: `4px solid ${PRT.gold}`, padding: '11px 13px', marginBottom: 14 }}>
        <PrLabel c={PRT.gold} style={{ marginBottom: 4 }}>THE HIRING PRIORITY</PrLabel>
        <PrBody size={9} color={PRT.ink} style={{ fontWeight: 700 }}>Future hires should index high on {bot5[0].l.toLowerCase()} to balance the team's current distribution.</PrBody>
        <PrBody size={8.8} style={{ marginTop: 4, fontStyle: 'italic' }}>"{qi(bot5[0].k).probe}"</PrBody>
      </div>
      <PrPairNotes
        left={['WHAT TO DO WITH THIS GROUP NOW', `Place them into ${PR_CAT_PLACE[topCats[0][0]]} with confidence. Give ${PR_CAT_GIVE[botCats[0][0]]} deliberately rather than waiting for it to arrive, because that is how the gap in Section 4 closes.`, PRT.gn]}
        right={['WHAT NOT TO CONCLUDE', 'Nothing here is a performance rating, and no one in this cohort is a concern. Everyone assessed passed selection and belongs on the team.', PRT.am]}
        style={{ marginBottom: 12 }}
      />
      <PrBody size={8.3} color={PRT.faint}>
        {presentingWell > 0 ? `${presentingWell} of ${n} answered with an eye on how they would come across, which is entirely normal. ` : ''}Read every score in this report alongside a conversation. Section 8 sets out exactly how much weight the figures carry.
      </PrBody>
    </>
  ));

  // SECTION 2a: persona + mix
  add('s2', (
    <>
      <PrSectionHead num={2} title="Who This Group Is" sub="The persona, the mix of profiles inside it, and the detailed score picture behind both." />
      <PrKey rows={[
        ['Persona', 'One name for the group as a whole, drawn from geology. It describes how the group behaves together, not how good it is.'],
        ['Profile', 'One of thirteen CORE profiles, given a gemstone name for each individual. None is better than another; they are different ways of being useful.'],
        ...(smallCohort ? [['Small-sample caution', `With ${n} people, one person is ${Math.round(100 / n)} per cent of the mix. Read the shape, not the percentages.`]] : []),
      ]} />
      <PrLabel c={PRT.gold} style={{ marginBottom: 4 }}>THE TEAM PERSONA</PrLabel>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: PRT.c, marginBottom: 6 }}>{persona.name}</div>
      <PrBody size={9.5} style={{ marginBottom: 10 }}>{personaTagline} {persona.desc}</PrBody>
      <PrNote title="WHY WE CALL THEM THIS" color={PRT.gold} style={{ marginBottom: 16 }}>{geoWhy}</PrNote>
      <PrHead size={13} style={{ marginBottom: 8 }}>The mix of profiles</PrHead>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center', border: `1px solid ${PRT.line}`, background: PRT.panel, padding: '16px 18px', marginBottom: 12 }}>
        <PrDonut
          segments={topProfiles.map(([nm], i) => ({ value: archCounts[nm], color: PR_COLORS[i % PR_COLORS.length] }))}
          size={158} hole={100}
          centerTop={<div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: PRT.ink, lineHeight: 1 }}>{n}</div>}
          centerBottom={<div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 6.5, letterSpacing: '0.18em', color: PRT.faint, marginTop: 3 }}>TEAM MEMBERS</div>}
        />
        <div style={{ flex: 1 }}>
          <PrBody size={9} style={{ marginBottom: 8 }}>{topProfiles.length} of the thirteen CORE profiles appear in this group.</PrBody>
          {topProfiles.map(([nm, count], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 14, height: 4, background: PR_COLORS[i % PR_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
              <PrBody size={8.8} color={PRT.ink} style={{ fontWeight: 600, flex: 1 }}>{nm}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.8, fontWeight: 700, color: PRT.sub }}>{count} ({Math.round((count / n) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
      <PrNote title="WHAT THE MIX TELLS YOU" color={PRT.c}>{mixLine}</PrNote>
    </>
  ));

  // SECTION 2b: profile table chunks
  const profRows = topProfiles.map(([nm, count]) => {
    const gem = GEMSTONES[nm] || GEMSTONES['Emerging Professional'];
    const growth = ARCHETYPE_GROWTH[nm] || ARCHETYPE_GROWTH['Emerging Professional'];
    return [
      <span><span style={{ fontWeight: 800, color: PRT.c }}>{gem.gem}</span><br /><span style={{ fontWeight: 700, color: PRT.ink }}>{gem.title}</span><br /><span style={{ fontSize: 7.8, color: PRT.faint }}>{nm} · {count} {count === 1 ? 'person' : 'people'}</span></span>,
      growth.individual,
      growth.team,
    ];
  });
  prChunk(profRows, 5, 5).forEach((rows, ci, arr) => {
    add('s2', (
      <>
        <PrSectionHead num={2} title={`The profiles in this group${arr.length > 1 ? ` (${ci + 1} of ${arr.length})` : ''}`} sub="The gemstone is the individual's name in the CORE framework. Read the middle column when thinking about one person, the right column when thinking about how the team fits together." />
        <PrTable cols={['Profile', 'As an individual', 'In a team']} widths={[150, undefined, undefined]} rows={rows} />
      </>
    ));
  });

  // SECTION 2c: reading the combination
  add('s2', (
    <>
      <PrSectionHead num={2} title="Reading the combination" sub="What this particular mix of profiles means for how the group runs." />
      <PrBody size={9.5} style={{ marginBottom: 12 }}>{mixLine}</PrBody>
      <PrPairNotes
        left={['PAIRINGS THAT WORK', pairsPresent.length ? pairsPresent.slice(0, 2).map(p => `${p[0]} with ${p[1]}: ${p[2]}`).join(' ') : 'No standout complementary pairings in this mix; standard mentor pairing by seniority applies.', PRT.gn]}
        right={['WHAT TO WATCH', watchText, PRT.am]}
        style={{ marginBottom: 14 }}
      />
      {pairsPresent.length > 0 && (
        <>
          <PrHead size={12} style={{ marginBottom: 6 }}>Suggested mentoring pairings</PrHead>
          <PrBody size={8.5} color={PRT.faint} style={{ marginBottom: 8 }}>Key: pairings match complementary working styles already present in this cohort, so each person's natural strength supports the other's growth area. Suggestions for HR to refine with the individuals, not fixed allocations.</PrBody>
          <PrTable cols={['Pairing', 'Why it works']} widths={[250, undefined]}
            rows={pairsPresent.map(p => [<span style={{ fontWeight: 700, color: PRT.ink }}>{p[0]} + {p[1]}</span>, p[2]])} />
        </>
      )}
    </>
  ));

  // SECTION 2d: seven areas radar
  add('s2', (
    <>
      <PrSectionHead num={2} title="The detailed picture: seven overall areas" sub={`These seven areas summarise the twenty-one qualities on the next page. The dashed ring marks the 75 strength line.`} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
        <RadarChart T={{ b2: PRT.line, t1: PRT.sub }} color={PRT.c} size={300} data={CI_ORDER.map(k => ({ label: CI_LABELS[k], value: ciAvg[k] }))} />
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <PrLabel c={PRT.faint} style={{ marginBottom: 6 }}>RANKED, STRONGEST FIRST</PrLabel>
          {ciSorted.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${PRT.lineSoft}`, padding: '3px 0' }}>
              <PrBody size={8.8} color={PRT.ink} style={{ fontWeight: 600 }}>{d.l}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.8, fontWeight: 700, color: prCol(d.v) }}>{d.v} · {prBandName(d.v)}</span>
            </div>
          ))}
          <PrLegend style={{ marginTop: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <PrNote title="THE SHAPE, IN ONE LINE" color={PRT.c} style={{ marginBottom: 8 }}>
            The profile spans {spread7} points at this summary level, from {ciSorted[0].l.toLowerCase()} ({ciSorted[0].v}) to {ciSorted[ciSorted.length - 1].l.toLowerCase()} ({ciSorted[ciSorted.length - 1].v}). The variation that matters most is one level down, where the twenty-one qualities spread {spread21} points.
          </PrNote>
          <PrBody size={8.3} color={PRT.faint}>Everything on this page is a group average. Individual results sit behind it and are not shown, by design. Sections 4 and 7 are the only places where individuals are named.</PrBody>
        </div>
      </div>
    </>
  ));

  // SECTION 2e: 21 qualities
  add('s2', (
    <>
      <PrSectionHead num={2} title="Twenty-one qualities, strongest first" sub="The full evidence base for the report. Sections 3 and 4 take the top five and bottom five from this list." />
      <PrLegend style={{ marginBottom: 10 }} />
      <div style={{ marginBottom: 12 }}>
        {subAvgs.map((d, i) => <PrBarRow key={i} label={d.l} v={d.v} h={10} />)}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          [`${strongList.length} in the strength band`, strongList.length ? `${strongList.slice(0, 4).map(d => d.l).join('; ')}${strongList.length > 4 ? '; and more' : ''}.` : 'None yet, which is common early in a career stage and is what Section 5 builds toward.', PRT.gn],
          [`${solidList.length} in the solid band`, 'Dependable, not finished. These are the qualities most responsive to ordinary line-management attention.', PRT.am],
          [`${buildList.length} still building`, buildList.length ? `${buildList.map(d => d.l).join('; ')}. Learnable through the work itself, and addressed in Section 5.` : 'Nothing sits below 60, so Section 4 reads as sharpening rather than repair.', PRT.rd],
        ].map(([t, b, c], i) => (
          <div key={i} style={{ flex: 1 }}><PrNote title={t} color={c}>{b}</PrNote></div>
        ))}
      </div>
      <PrHead size={12} style={{ margin: '14px 0 6px' }}>What each of the seven areas covers</PrHead>
      <PrTable cols={['Area', 'Score', 'What sits inside it']} widths={[160, 60, undefined]} fontSize={8.4}
        rows={ciSorted.map(d => [
          <span style={{ fontWeight: 700, color: PRT.ink }}>{d.l}</span>,
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: prCol(d.v) }}>{d.v}</span>,
          PR_CI_CONTAINS[d.k] || '',
        ])} />
    </>
  ));

  // SECTION 3: strengths
  const strengthCard = (d, i) => {
    const info = qi(d.k);
    return (
      <PrQualityCard key={i} tag={`STRENGTH ${i + 1}`} tagColor={PRT.gn} title={info.label} score={d.v}
        rows={[
          ['WHAT IT LOOKS LIKE', info.beh],
          ['WHY IT MATTERS', info.why],
          ['WHAT TO DO', info.todo],
          ['OWNER', info.owner],
        ]} />
    );
  };
  add('s3', (
    <>
      <PrSectionHead num={3} title="What This Group Does Well" sub="The five highest-scoring qualities, each with an action and an owner." />
      <PrKey rows={[
        ['Order', 'Every card follows the same order: what it looks like day to day, why it matters here, and what to do about it.'],
        ['How to use it', 'These are assets to protect, not boxes to tick. Most of the actions cost nothing beyond management attention.'],
      ]} />
      {top5.slice(0, 3).map((d, i) => strengthCard(d, i))}
    </>
  ));
  add('s3', (
    <>
      <PrSectionHead num={3} title="What This Group Does Well (continued)" sub="Strengths 4 and 5, and what the five have in common." />
      {top5.slice(3, 5).map((d, i) => strengthCard(d, i + 3))}
      <PrNote title="WHAT THE FIVE HAVE IN COMMON" color={PRT.c} style={{ margin: '6px 0 12px' }}>{inCommonLine}</PrNote>
      <PrPairNotes
        left={['WHAT THIS MAKES THEM GOOD FOR NOW', `Work where the difficulty is ${PR_CAT_MEANING[topCats[0][0]].replace('how they ', '')}: hand this group the assignments that live there and they will carry them.`, PRT.gn]}
        right={['WHAT IT COSTS TO LEAVE ALONE', 'Most of these strengths are invisible while they are working and are usually noticed only once they have gone. The actions above are mostly about naming and protecting rather than building.', PRT.am]}
      />
    </>
  ));

  // SECTION 4: growth areas
  const growthCard = (d, i) => {
    const info = qi(d.k);
    const label = i === 0 ? 'TOP PRIORITY' : i <= 2 ? 'IMPORTANT' : 'WORTH BUILDING';
    return (
      <PrQualityCard key={i} tag={`DEVELOPMENT AREA ${i + 1} · ${label}`} tagColor={i === 0 ? PRT.rd : PRT.am} title={info.label} score={d.v}
        rows={[
          ['WHAT IT LOOKS LIKE', info.beh],
          ['WHY IT MATTERS', info.why],
          ['WHAT TO DO', info.todo],
          ['OWNER', info.owner],
        ]} />
    );
  };
  add('s4', (
    <>
      <PrSectionHead num={4} title="Where This Group Needs Support" sub="The five lowest-scoring qualities. These are development areas, not concerns." />
      <PrKey rows={[
        ['Order', 'Same order as Section 3, so the two sections can be read side by side.'],
        ['Priority label', 'Top priority, important, or worth building. It reflects both the score and the cost of leaving it alone, not the score alone.'],
        ['Band', `${bot5.filter(d => d.v >= 60).length} of the five sit in the solid band; ${bot5.filter(d => d.v < 60).length} ${bot5.filter(d => d.v < 60).length === 1 ? 'is' : 'are'} genuinely still building.`],
      ]} />
      {bot5.slice(0, 3).map((d, i) => growthCard(d, i))}
    </>
  ));
  add('s4', (
    <>
      <PrSectionHead num={4} title="Where This Group Needs Support (continued)" sub="Development areas 4 and 5." />
      {bot5.slice(3, 5).map((d, i) => growthCard(d, i + 3))}
      {showSustain && (
        <PrNote title="SUSTAINABILITY CHECK" color={PRT.am} style={{ marginTop: 6 }}>
          Steadiness under pressure ({teamAvg.ES}) and learning agility ({teamAvg.LAavg}) are both still building across this group. Taken together, that pattern is worth planning around rather than waiting on: long high-pressure stretches will cost this team more energy than most, and unfamiliar work will take more support to land well. What helps is pacing, planned recovery after busy periods, early notice of change, and well-supported stretch assignments. Worth revisiting at the next assessment cycle.
        </PrNote>
      )}
    </>
  ));

  // SECTION 4 support table
  const supportIntro = (
    <>
      <PrSectionHead num={4} title="Team members who will benefit from extra support" sub="Everyone here passed selection and belongs on the team. This is about giving each person the right start, not about ranking them." />
      <PrKey title="HOW TO USE THIS TABLE" rows={[
        ['Do', 'Hold a friendly check-in inside the first two months, matched to what each person needs.'],
        ['Do not', 'Share this table with managers as a list of concerns. Share the suggested support in the third column instead.'],
        ['Sensitive page', 'This page names individuals. Treat it, with Section 7, as the most sensitive part of the report.'],
        ...(showPatterns ? [['Patterns first', 'Most entries share a small number of cohort-level patterns, summarised below, rather than being separate individual issues.']] : []),
      ]} />
    </>
  );
  if (supportRaw.length === 0) {
    add('s4', (
      <>
        {supportIntro}
        <PrBody size={9.5}>No one in this cohort meets the threshold for early extra support. A standard onboarding rhythm applies, with the development areas in this section handled at group level through Section 5.</PrBody>
      </>
    ));
  } else {
    const supRow = c => [
      <span><span style={{ fontWeight: 700, color: PRT.ink }}>{c.name}</span><br /><span style={{ fontSize: 7.6, color: PRT.faint }}>{c.profile}</span></span>,
      prCap(c.noticed) + '.',
      prCap(c.helps) + '.',
      <span style={{ fontWeight: 700, color: c.tier.startsWith('Priority') ? PRT.c : c.tier.startsWith('Would') ? PRT.am : PRT.faint }}>{c.tier}</span>,
    ];
    const supChunks = prChunk(shownIndividuals, 6, 10);
    supChunks.forEach((chunkRows, ci) => {
      add('s4', (
        <>
          {ci === 0 ? supportIntro : <PrSectionHead num={4} title={`Team members who will benefit from extra support (continued)`} sub={`Individual support notes, part ${ci + 1} of ${supChunks.length}.`} />}
          {ci === 0 && showPatterns && (
            <>
              <PrHead size={12} style={{ marginBottom: 6 }}>The cohort-level patterns</PrHead>
              <PrTable cols={['Pattern', 'How many', 'What would help']} widths={[undefined, 70, undefined]} fontSize={8.4} style={{ marginBottom: 12 }}
                rows={patterns.filter(p => p.members.length >= 2).map(p => [
                  prCap(p.noticed) + '.',
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>{p.members.length} of {n}</span>,
                  prCap(p.helps) + '.',
                ])} />
            </>
          )}
          <PrTable cols={['Name', 'What we noticed', 'What would help', 'Approach']} widths={[110, undefined, undefined, 95]} fontSize={8.3}
            rows={chunkRows.map(supRow)} />
          {ci === supChunks.length - 1 && hiddenSupport > 0 && (
            <PrBody size={8.3} color={PRT.faint} style={{ marginTop: 8 }}>Showing the {shownIndividuals.length} team members with the clearest need. The remaining {hiddenSupport} share the cohort patterns above; the full list is available from Carnelian on request.</PrBody>
          )}
          {ci === supChunks.length - 1 && soloNotes.length === 1 && (
            <PrNote title="THE ONE GENUINELY INDIVIDUAL NOTE" color={PRT.c} style={{ marginTop: 10 }}>
              {soloNotes[0].members[0].name} is the only person whose support need differs from the group pattern: they {soloNotes[0].noticed}. {prCap(soloNotes[0].helps)} is a line-manager task, not a development programme, and it is worth acting on early.
            </PrNote>
          )}
        </>
      ));
    });
  }

  // SECTION 5: roadmap
  add('s5', (
    <>
      <PrSectionHead num={5} title="Development Roadmap" sub="Grouped by how quickly each can be done. Every action names an owner." />
      <PrKey rows={[
        ['Quick wins', 'Startable inside three months with existing people and no budget line.'],
        ['Bigger pieces', 'Three to twelve months. These need a programme owner and usually a budget.'],
        ['Owner', 'HR / L&D means programme design and policy. Line manager means placement, expectations and daily practice.'],
        ['Sequence', 'The quick wins are ordered deliberately: the first actions create the conditions that make the later ones work.'],
      ]} />
      <PrHead size={12} style={{ marginBottom: 6 }}>5.1 Quick wins, the next three months</PrHead>
      <PrTable cols={['What to do', 'How it helps', 'Who owns it']} widths={[150, undefined, 105]} style={{ marginBottom: 14 }}
        rows={[
          ...bot5.slice(0, 3).map(d => {
            const info = qi(d.k);
            return [<span style={{ fontWeight: 700, color: PRT.ink }}>Build {info.label.toLowerCase()}</span>, info.todo, info.owner];
          }),
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Talk it through before deciding</span>, 'A short structured conversation with each person alongside their results, before any placement decision rests on a score.', 'HR / L&D'],
        ]} />
      <PrHead size={12} style={{ marginBottom: 6 }}>5.2 Bigger pieces, three to twelve months</PrHead>
      <PrTable cols={['Programme', 'Why, and how to shape it', 'Who owns it']} widths={[150, undefined, 105]} style={{ marginBottom: 14 }}
        rows={[
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Leadership Development</span>, `Shape the programme around this group's actual growth areas, ${bot5[0].l.toLowerCase()} and ${bot5[1].l.toLowerCase()}, and use the existing strength in ${top5[0].l.toLowerCase()} as the foundation to build from.`, 'HR / L&D'],
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Deeper work on {bot5[3].l.toLowerCase()} and {bot5[4].l.toLowerCase()}</span>, `Fold these into existing programmes over the next two quarters rather than standalone training. ${qi(bot5[3].k).todo}`, 'HR / L&D'],
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Non-standard exposure rotation</span>, 'Deliberately give unfamiliar work: exceptions, edge cases, system changes. This is where judgement is actually built.', 'Line manager'],
        ]} />
      <PrNote title="HOW TO TELL WHETHER ANY OF THIS WORKED" color={PRT.c}>
        Re-run the assessment for this cohort in six to nine months and look at two figures only: {bot5[0].l.toLowerCase()}, currently {bot5[0].v}, and {bot5[1].l.toLowerCase()}, currently {bot5[1].v}. Programme attendance is not evidence of movement. If those two numbers have not moved, the delivery needs changing rather than the programme.
      </PrNote>
    </>
  ));
  add('s5', (
    <>
      <PrSectionHead num={5} title="Development Roadmap (continued)" sub="Suggested tools, and how to hire toward the gap." />
      <PrHead size={12} style={{ marginBottom: 6 }}>5.3 Suggested reading and tools</PrHead>
      <PrBody size={8.5} color={PRT.faint} style={{ marginBottom: 6 }}>One set of resources per development area. The habit matters more than the book.</PrBody>
      <PrTable cols={['Area', 'Suggested reading and tools']} widths={[180, undefined]} style={{ marginBottom: 14 }}
        rows={bot5.map(d => { const info = qi(d.k); return [<span style={{ fontWeight: 700, color: PRT.ink }}>{info.label}</span>, info.resources]; })} />
      <PrHead size={12} style={{ marginBottom: 6 }}>5.4 Hiring to fill the gap</PrHead>
      <PrBody size={8.5} color={PRT.faint} style={{ marginBottom: 6 }}>When adding to this team, probe specifically for its lowest baseline qualities to balance the culture.</PrBody>
      <PrTable cols={['Target quality', 'Behavioural interview question']} widths={[180, undefined]}
        rows={bot5.slice(0, 3).map(d => { const info = qi(d.k); return [<span style={{ fontWeight: 700, color: PRT.ink }}>{info.label}</span>, <span style={{ fontStyle: 'italic' }}>"{info.probe}"</span>]; })} />
    </>
  ));

  // SECTION 6
  add('s6', (
    <>
      <PrSectionHead num={6} title="What This Group Brings to the Wider Org" sub={`Answers one question: when should someone at ${orgKnown ? orgName : 'the organisation'} ask for this group by name?`} />
      <PrKey rows={[
        ['What these six are', 'Capability clusters, built by combining the two related qualities behind each. For example, Pressure Tolerance combines steadiness under pressure with reliability. They describe what the group can be handed, rather than what it scores on.'],
        ['How to use it', 'Read 6.2 as work to route toward this group, and 6.3 as work to route toward them only with support in place.'],
      ]} />
      <PrHead size={12} style={{ marginBottom: 8 }}>6.1 What this group is strongest at</PrHead>
      <div style={{ border: `1px solid ${PRT.line}`, background: PRT.panel, padding: '14px 14px 9px', marginBottom: 14 }}>
        {capital.map((d, i) => <PrBarRow key={i} label={d.l} v={d.v} h={13} labelW={185} />)}
        <PrLegend style={{ marginTop: 6 }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <PrLabel c={PRT.gn} style={{ marginBottom: 6 }}>6.2 WHEN TO ASK FOR THIS GROUP</PrLabel>
          {top5.slice(0, 3).map((d, i) => {
            const info = qi(d.k);
            return <PrBody key={i} size={8.8} style={{ marginBottom: 7 }}><span style={{ fontWeight: 700, color: PRT.ink }}>{info.label} ({d.v}):</span> {info.beh}</PrBody>;
          })}
        </div>
        <div style={{ flex: 1 }}>
          <PrLabel c={PRT.am} style={{ marginBottom: 6 }}>6.3 WHERE TO BUILD BEFORE STRETCHING FURTHER</PrLabel>
          {bot5.slice(0, 2).map((d, i) => {
            const info = qi(d.k);
            return <PrBody key={i} size={8.8} style={{ marginBottom: 7 }}><span style={{ fontWeight: 700, color: PRT.ink }}>{info.label} ({d.v}):</span> {info.todo}</PrBody>;
          })}
        </div>
      </div>
    </>
  ));
  add('s6', (
    <>
      <PrSectionHead num={6} title="6.4 How the group fits each role family" sub="Only families with someone placed into them are shown. Group average is the mean fit of the people whose best match is that family." />
      <PrTable cols={['Role family', 'Group avg', 'Placed', 'Comfortable fit', 'Structured start', 'What this means']} widths={[190, 60, 50, 70, 70, undefined]} fontSize={8.4}
        rows={roleFamilies.map(r => [
          <span><span style={{ fontWeight: 700, color: PRT.ink }}>{r.name}</span><br /><span style={{ fontSize: 7.4, color: PRT.faint }}>Built from: {r.built}</span></span>,
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, color: prCol(r.avg) }}>{r.avg}%</span>,
          r.placed, r.comfy, r.struct,
          <span style={{ fontWeight: 700, color: prCol(r.avg) }}>{r.avg >= 75 ? 'Place with confidence' : r.avg >= 60 ? 'Place with a structured start' : 'Read Section 8 first'}</span>,
        ])} />
      <PrBody size={8.3} color={PRT.faint} style={{ marginTop: 8 }}>Fit percentages come from the graded matching described in Section 7. A family that does not appear had no one whose best match was that family; it says nothing about capability there.</PrBody>
    </>
  ));

  // SECTION 7: best-fit roles
  const bfIntro = (
    <>
      <PrSectionHead num={7} title="Best-Fit Roles" sub="The role that suits each person best, how well they fit it, and the primary area for their continued growth. A starting point for a conversation, not an allocation." />
      <PrKey title="BEFORE USING THIS TABLE" rows={[
        ['Match bands', '75 per cent and above is a comfortable fit. 60 to 74 works with a structured start. Below 60 needs a conversation before placement.'],
        ['What match is not', 'A fit estimate against the qualities the role depends on. Not a prediction of performance, and not a ranking of people.'],
        ['Required', 'Read Section 8, and talk to the person, before any placement decision rests on a number on this page.'],
      ]} />
    </>
  );
  const bfRow = c => [
    <span><span style={{ fontWeight: 700, color: PRT.ink }}>{c.name}</span><br /><span style={{ fontSize: 7.6, color: PRT.faint }}>{c.profile}</span></span>,
    c.role,
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, color: c.pct >= 75 ? PRT.gn : c.pct >= 60 ? PRT.am : PRT.rd }}>{c.pct}%</span>,
    <span style={{ fontWeight: 700, color: c.pct >= 75 ? PRT.gn : c.pct >= 60 ? PRT.am : PRT.rd }}>{c.band}</span>,
    c.focus,
  ];
  const bfChunks = prChunk(scoredCandidates, 10, 14);
  bfChunks.forEach((chunkRows, ci) => {
    add('s7', (
      <>
        {ci === 0 ? bfIntro : <PrSectionHead num={7} title={`Best-Fit Roles (continued, ${ci + 1} of ${bfChunks.length})`} sub="Match bands: 75+ comfortable fit, 60 to 74 structured start, below 60 conversation first." />}
        <PrTable cols={['Person', 'Best-fit role', 'Match', 'Band', 'Development focus']} widths={[115, 145, 48, 92, undefined]} fontSize={8.3}
          rows={chunkRows.map(bfRow)} />
        {ci === bfChunks.length - 1 && (
          <PrBody size={8.5} color={PRT.sub} style={{ marginTop: 8 }}>
            {bandCounts.comfy} of the {n} are a comfortable fit for their suggested role, {bandCounts.struct} would do well with a structured start{bandCounts.conv > 0 ? `, and ${bandCounts.conv} would benefit from a conversation before placement` : ''}. {bandCounts.struct + bandCounts.conv > 0 ? 'That is a normal distribution for a cohort at this stage, and it is why Section 5.1 leads with mentor pairings.' : 'An unusually role-ready cohort; the development work in Section 5 is about range rather than readiness.'}
          </PrBody>
        )}
      </>
    ));
  });

  // SECTION 8
  add('s8', (
    <>
      <PrSectionHead num={8} title="How to Read These Results" sub="Every score in this report comes from each person's own answers. These checks show how much to lean on them." />
      <PrKey rows={[
        ['Why this section exists', 'So that no one uses a number from this report without knowing how much weight it carries.'],
        ['The short version', 'Directional confidence at group level is reasonable. Individual figures should not carry a decision on their own.'],
      ]} />
      <PrTable cols={['What we checked', 'Result', 'What it means']} widths={[130, 150, undefined]} style={{ marginBottom: 14 }}
        rows={[
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Overall</span>,
            <span style={{ fontWeight: 700, color: validAmber === 0 ? PRT.gn : PRT.am }}>{validGreen} clear, {validAmber} to read with care</span>,
            'Interpret amber results alongside a conversation rather than the number alone.'],
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Presenting well</span>,
            <span style={{ fontWeight: 700, color: presentingWell > n / 2 ? PRT.am : PRT.gn }}>{presentingWell} of {n}</span>,
            'Very common when people feel assessed. Not a sign of dishonesty, just a reason to read scores as a little generous rather than exact.'],
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Balanced answering</span>,
            <span style={{ fontWeight: 700, color: PRT.gn }}>{balancedCount} of {n}</span>,
            'Answers spread naturally rather than agreeing with everything.'],
          [<span style={{ fontWeight: 700, color: PRT.ink }}>Measured answering</span>,
            <span style={{ fontWeight: 700, color: PRT.gn }}>{measuredCount} of {n}</span>,
            'Most people used the middle of the scale as well as the ends, which is what we want to see.'],
        ]} />
      <PrPairNotes
        left={['METHOD, IN FIVE LINES', `CORE assessment: 63 questions, 21 qualities, five areas. Group figures are straightforward averages of ${n} people. The seven areas in Section 2 are means of their component qualities. "Still building" counts people below the level at which a quality can be relied on. Sections 4, 6 and 7 are interpreted by Carnelian from the underlying results.`, PRT.c]}
        right={['WHAT THIS REPORT IS NOT', 'Not a performance appraisal, and not a record of past delivery. Not a hiring or exit decision on its own. Not a ranking: the order in Section 7 reflects fit to different roles, not quality of person. Not a fixed picture: every quality here is developable, which is the point of Section 5.', PRT.am]}
        style={{ marginBottom: 14 }}
      />
      <PrNote title="READ ALONGSIDE" color={PRT.gold}>
        Individual Technical Reports and Action Plans for this batch sit behind these group figures in the CORE dashboard. Re-running the assessment in six to nine months, and watching the two figures named in Section 5, is the cleanest measure of whether the development investment landed.
      </PrNote>
    </>
  ));

  // fixed front pages + numbering
  const secStart = {};
  rest.forEach((p, i) => { if (!(p.sec in secStart)) secStart[p.sec] = i + 3; });
  const contents = [
    ['1', 'The Story in One Page', 'The whole cohort in a single view.', secStart.s1],
    ['2', 'Who This Group Is', 'Persona, profile mix, and the detailed score picture.', secStart.s2],
    ['3', 'What This Group Does Well', 'Five strengths, each with an action and an owner.', secStart.s3],
    ['4', 'Where This Group Needs Support', 'Five development areas, plus individual support notes.', secStart.s4],
    ['5', 'Development Roadmap', 'Quick wins, bigger programmes, and suggested tools.', secStart.s5],
    ['6', 'What This Group Brings to the Wider Org', 'When to ask for this group by name.', secStart.s6],
    ['7', 'Best-Fit Roles', 'One suggested role per person, with the growth focus.', secStart.s7],
    ['8', 'How to Read These Results', 'Response confidence and method.', secStart.s8],
  ];

  const coverBody = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CoreLogo h={40} />
        <PrLabel c={PRT.faint}>CORE BY CARNELIAN · RESTRICTED</PrLabel>
      </div>
      <div style={{ marginTop: 56 }}>
        <PrLabel style={{ marginBottom: 6 }}>TEAM INSIGHT REPORT</PrLabel>
        <PrHead size={22}>{cohortTitle}{orgKnown ? ` · ${orgName}` : ''}</PrHead>
      </div>
      <div style={{ textAlign: 'center', margin: '54px 0' }}>
        <PrLabel c={PRT.gold} style={{ marginBottom: 8 }}>THE TEAM PERSONA</PrLabel>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 46, fontWeight: 700, color: PRT.c, lineHeight: 1.1, marginBottom: 10 }}>{persona.name}</div>
        <PrBody size={10.5} style={{ maxWidth: 540, margin: '0 auto' }}>{personaTagline}</PrBody>
      </div>
      <PrMeta rows={[
        ['Batch', batch],
        ...(orgKnown ? [['Organisation', orgName]] : []),
        ['Cohort', `${n} team members${deptList.length ? ` · ${deptList.join(', ')}` : ''}`],
        ['Sector', industry || 'Unspecified'],
        ['Career level', candidate.experience || 'Unspecified'],
        ['Team composite', `${teamAvg.overall} / 100 group average`],
        ['Response confidence', `${validGreen} clear read${validGreen === 1 ? '' : 's'}, ${validAmber} to read with care`],
        ['Assessment', 'CORE · 63 questions · 21 qualities across five areas'],
        ['Assessment date', today],
        ['Report prepared by', 'Carnelian Co.'],
        ['Classification', 'Restricted. HR leadership only'],
      ]} />
      <div style={{ background: PRT.panel, border: `1px solid ${PRT.line}`, padding: '10px 14px', marginTop: 14, textAlign: 'center' }}>
        <PrBody size={7.8} color={PRT.faint}>
          <span style={{ fontWeight: 800, color: PRT.sub }}>CONFIDENTIAL.</span> This report aggregates individual results for team-level decision-making. Restricted to HR leadership; not for circulation to assessed individuals or line management without prior consultation with Carnelian Co. The support notes in Section 4 and the role table in Section 7 name individuals and are the most sensitive pages in the document.
        </PrBody>
      </div>
    </>
  );

  const howToBody = (
    <>
      <PrSectionHead title="How to Read This Report" sub="Everything a project custodian needs in order to use this document unaided." />
      <PrKey title="KEY FOR PROJECT CUSTODIANS" rows={[
        ['Scores', 'Everything is out of 100 and is a group average unless a person is named.'],
        ['Bands', '75 and above is a strength. 60 to 74 is solid. Below 60 means the quality is still building.'],
        ['Colour', 'Green is strong, amber is solid, red is still building. Used the same way for group averages and for individual scores.'],
        ['Two kinds of name', 'The group as a whole gets a name from geology. Each individual gets a gemstone. Keeping them separate makes it easy to tell whether we mean the group or a person.'],
        ['A caution', 'People naturally present themselves well in assessments. Read every score alongside a conversation rather than on its own. Section 8 explains this.'],
        ['Every action has an owner', 'HR and L&D handle programmes and policy. Line managers handle placement, expectations and day-to-day practice. Every recommendation names one of the two.'],
        ['Sensitive pages', 'The support notes in Section 4 and the role table in Section 7 name individuals. Share the suggested support from those pages with managers, not the pages themselves.'],
      ]} />
      <PrHead size={12} style={{ margin: '2px 0 6px' }}>Contents</PrHead>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
        <tbody>
          {contents.map(([num, title, sub, pg], i) => (
            <tr key={i} style={{ borderBottom: i < contents.length - 1 ? `1px solid ${PRT.lineSoft}` : 'none' }}>
              <td style={{ width: 26, padding: '5px 0', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 700, color: PRT.c }}>{num}</td>
              <td style={{ padding: '5px 0' }}>
                <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 9.5, fontWeight: 700, color: PRT.ink }}>{title}</span>
                <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 8.3, color: PRT.faint }}>  ·  {sub}</span>
              </td>
              <td style={{ width: 30, padding: '5px 0', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 700, color: PRT.sub }}>{pg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PrLabel c={PRT.faint} style={{ marginBottom: 6 }}>THIS REPORT IN FOUR NUMBERS</PrLabel>
      <PrStats items={[
        [n, 'Team members assessed'],
        [subAvgs.length, 'Qualities scored'],
        [subAvgs[0].v, 'Highest group average'],
        [subAvgs[subAvgs.length - 1].v, 'Lowest group average'],
      ]} />
      <div style={{ marginTop: 14 }}>
        <PrPairNotes
          left={['WHERE TO START', 'If you have five minutes, read Section 1. If you are making a placement decision, read Sections 7 and 8 together. If you are commissioning development, read Section 5.', PRT.c]}
          right={smallCohort
            ? ['SMALL-COHORT CAUTION', `This report describes a cohort of ${n}. Group averages are straightforward means, so a single person can move any figure by up to ${Math.round(100 / n)} points. Read every number as a direction rather than a measurement.`, PRT.am]
            : ['A NOTE ON SCALE', `Group averages over ${n} people are statistically steady. Individual variation is summarised in Sections 4 and 7 rather than hiding inside the averages.`, PRT.gn]}
        />
      </div>
    </>
  );

  const bodies = [coverBody, howToBody, ...rest.map(p => p.body)];
  const total = bodies.length;
  const pid = i => `ti-pg-${candidate.doc_id}-${i}`;
  const ids = bodies.map((_, i) => pid(i));
  const footerLeft = `Team Insight Report${orgKnown ? ` · ${orgName}` : ''} · ${batch}`;

  return (
    <div>
      <PrStyles />
      <PrPreviewNote T={T} pages={total} />
      <PrDownloadBtn ids={ids} filename={`${batch}_Team_Insight.pdf`} />
      {bodies.map((b, i) => (
        <PrPage key={i} id={pid(i)} pageNo={i + 1} total={total} footerLeft={footerLeft} footerRight="Restricted: HR Leadership Only">{b}</PrPage>
      ))}
      <PrDownloadBtn ids={ids} filename={`${batch}_Team_Insight.pdf`} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIZATIONAL CULTURE PULSE REPORT (print-authored)
// ═══════════════════════════════════════════════════════════════════════════
const CulturePulseReport = ({ candidate, allData, T }) => {
  const batch = candidate.batch;
  const normBatch = String(batch || '').trim().toLowerCase();
  const allBatchRows = (allData || []).filter(r => String(r.batch || '').trim().toLowerCase() === normBatch);
  const batchData = allBatchRows.filter(r => r.report_data?.validity?.overall !== 'red' && r.report_data?.scores);
  if (!batch) return <div style={{ padding: '40px', textAlign: 'center', color: T.t3 }}>No batch assigned.</div>;
  if (batchData.length < 2) return <div style={{ padding: '40px', textAlign: 'center', color: T.t3 }}>Only {batchData.length} valid response(s). Requires at least 2.</div>;

  // ── data prep ──
  const n = batchData.length;
  const fmt = v => n < 12 ? Math.round(v * 10) / 10 : Math.round(v);
  const redExcluded = allBatchRows.length - n;
  const orgName = candidate.org || batchData[0]?.org || 'the organisation';
  const orgKnown = orgName !== 'the organisation';
  const deptList = [...new Set(batchData.map(b => b.department).filter(Boolean))];
  const deptLine = deptList.length > 6 ? `${deptList.slice(0, 6).join(', ')} and ${deptList.length - 6} more` : deptList.join(', ');
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const dimKeys = ['O', 'C', 'E', 'A', 'ES', 'CQavg', 'OCBavg', 'LAavg', 'EOavg'];
  const dimLabels = { O: 'Openness', C: 'Conscientiousness', E: 'Extraversion', A: 'Agreeableness', ES: 'Emotional Stability', CQavg: 'Cultural Intelligence', OCBavg: 'Team Citizenship', LAavg: 'Learning Agility', EOavg: 'Ethical Orientation' };

  const avgKey = (rows, k) => {
    const vals = rows.map(b => b.report_data?.scores?.[k]).filter(v => v != null).map(Number);
    return vals.length ? fmt(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };
  const orgAvg = {};
  dimKeys.forEach(k => { orgAvg[k] = avgKey(batchData, k); });
  const compAvg = fmt(batchData.reduce((a, b) => a + Number(b.overall_score || 0), 0) / n);

  const sortedDims = dimKeys.map(k => ({ k, l: dimLabels[k], v: orgAvg[k] })).sort((a, b) => b.v - a.v);
  const top3 = sortedDims.slice(0, 3), bot3 = sortedDims.slice(-3).reverse();
  const top2 = sortedDims.slice(0, 2), bot2 = sortedDims.slice(-2).reverse();
  const topD = sortedDims[0], lowD = sortedDims[sortedDims.length - 1];
  const spread9 = fmt(topD.v - lowD.v);

  const persona = CULTURE_PERSONAS.find(p => p.cond(orgAvg)) || CULTURE_PERSONAS[CULTURE_PERSONAS.length - 1];
  const learningPref = getLearningPrefSoft(orgAvg);
  const leadershipFit = getLeadershipFitSoft(orgAvg);
  const situations = PR_SITUATIONS[learningPref.mode] || PR_SITUATIONS['Pragmatic & On-the-Job'];

  const archCounts = {};
  batchData.forEach(b => { archCounts[b.profile_name] = (archCounts[b.profile_name] || 0) + 1; });
  const archSorted = Object.entries(archCounts).sort((a, b) => b[1] - a[1]);
  const dominant = archSorted[0];
  const dominantPct = Math.round((dominant[1] / n) * 100);
  const missing = Object.keys(ORG_ARCHETYPE_TAG).filter(a => !archCounts[a]);

  const validGreen = batchData.filter(b => b.report_data?.validity?.overall === 'green').length;
  const validAmber = n - validGreen;

  const deptStats = deptList.map(dep => {
    const rows = batchData.filter(b => b.department === dep);
    const avg = fmt(rows.reduce((a, b) => a + Number(b.overall_score || 0), 0) / rows.length);
    const dims = dimKeys.map(k => ({ k, l: dimLabels[k], v: avgKey(rows, k) })).filter(d => d.v > 0).sort((a, b) => b.v - a.v);
    return { dep, count: rows.length, avg, dims };
  }).sort((a, b) => b.avg - a.avg);

  const whereFirst = k => {
    const eligible = deptStats.filter(d => d.count >= 2).map(d => ({ dep: d.dep, v: (d.dims.find(x => x.k === k) || {}).v })).filter(d => d.v != null);
    if (eligible.length >= 2) {
      const lowest = eligible.sort((a, b) => a.v - b.v)[0];
      return `${lowest.dep} (lowest departmental average on this area, at ${lowest.v})`;
    }
    return PR_WHERE_FIRST[k] || 'Wherever the pressure of growth lands first';
  };

  const PR_DIM_CAT = { A: 'relational', E: 'relational', OCBavg: 'relational', CQavg: 'relational', C: 'procedural', EOavg: 'procedural', O: 'adaptive', LAavg: 'adaptive', ES: 'steadiness' };
  const topCatCounts = {};
  top3.forEach(d => { const c = PR_DIM_CAT[d.k]; topCatCounts[c] = (topCatCounts[c] || 0) + 1; });
  const topCatDominant = Object.entries(topCatCounts).sort((a, b) => b[1] - a[1])[0];
  const strengthsInBand = top3.filter(d => d.v >= 75);
  const inCommonCulture = `${topCatDominant[1] === 3 ? 'All three' : topCatDominant[1] === 2 ? 'Two of the three' : 'The leading strength'} of the top strengths are ${topCatDominant[0]}. ${topCatDominant[0] === 'relational' ? 'This organisation is built on goodwill and initiative between people, which is why it copes well with ambiguity and why Section 2 concentrates on structure.' : topCatDominant[0] === 'procedural' ? 'This organisation runs on consistency and standards, which is why Section 2 concentrates on energy for people and change.' : topCatDominant[0] === 'adaptive' ? 'This organisation runs on curiosity and speed, which is why Section 2 concentrates on consistency and follow-through.' : 'This organisation is anchored by steadiness, which is why Section 2 concentrates on pace and openness.'} The strengths and the watch areas are two sides of the same culture.`;

  // ── page assembly ──
  const rest = [];
  const add = (sec, body) => rest.push({ sec, body });

  // Culture profile page
  add('prof', (
    <>
      <PrSectionHead title="The culture profile: nine dimensions" sub="The shape shows where this organisation is even and where it is uneven. The dashed ring marks the 75 strength line." />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
        <RadarChart T={{ b2: PRT.line, t1: PRT.sub }} color={PRT.c} size={290} data={sortedDims.map(d => ({ label: d.l, value: d.v }))} />
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <PrLabel c={PRT.faint} style={{ marginBottom: 6 }}>RANKED, STRONGEST FIRST</PrLabel>
          {sortedDims.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${PRT.lineSoft}`, padding: '2.5px 0' }}>
              <PrBody size={8.7} color={PRT.ink} style={{ fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}  {d.l}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.7, fontWeight: 700, color: prCol(d.v) }}>{d.v} · {prBandName(d.v)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
            <PrBody size={8.7} color={PRT.ink} style={{ fontWeight: 800 }}>Composite</PrBody>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.7, fontWeight: 800, color: PRT.c }}>{compAvg}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <PrNote title="THE SPREAD, AND WHY IT MATTERS" color={PRT.c} style={{ marginBottom: 8 }}>
            Spread across the nine dimensions is {spread9} points ({topD.v} to {lowD.v}). {spread9 >= 12 ? 'A spread this size means the culture has a clear signature rather than being uniformly average, which is what makes Sections 1 and 2 actionable.' : 'A tight spread means the culture is even rather than sharply differentiated; read Sections 1 and 2 as relative emphasis rather than strong contrast.'}
          </PrNote>
          <PrLegend style={{ marginBottom: 8 }} />
          <PrBody size={8.3} color={PRT.faint}>Every figure on this page describes the organisation as a whole. Nothing here attributes a score to a named person.</PrBody>
        </div>
      </div>
    </>
  ));

  // SECTION 1: strengths
  add('c1', (
    <>
      <PrSectionHead num={1} title="Cultural Strengths" sub="What kind of people this organisation naturally attracts, retains, and brings out the best in." />
      <PrKey rows={[
        ['What this is', 'The three highest-scoring dimensions of nine, ranked against each other.'],
        ['How to use it', 'Treat these as assets to protect. They are what recruitment and onboarding should keep selecting for, not what needs fixing.'],
        ['Band note', strengthsInBand.length === 3 ? 'All three sit in the strength band (75+).' : strengthsInBand.length > 0 ? `${strengthsInBand.map(d => d.l).join(' and ')} ${strengthsInBand.length === 1 ? 'is' : 'are'} in the strength band (75+); the other${3 - strengthsInBand.length === 1 ? ' is' : 's are'} top-ranked but sit in the solid band.` : 'None of the three reaches the strength band yet; they are top-ranked relative to the rest of the profile.'],
      ]} />
      {top3.map((d, i) => {
        const c = CULTURE_DIM_CONTENT[d.k] || {};
        return (
          <PrQualityCard key={i} tag={`STRENGTH ${i + 1}`} tagColor={PRT.gn} title={d.l} score={d.v}
            rows={[
              ['HIRING PATTERN', c.hiring || ''],
              ['DAY TO DAY', c.culture || ''],
              ['PAYOFF', c.payoff || ''],
            ]} />
        );
      })}
      <PrNote title="WHAT THESE THREE HAVE IN COMMON" color={PRT.c}>{inCommonCulture}</PrNote>
    </>
  ));

  // SECTION 2: watch areas
  add('c2', (
    <>
      <PrSectionHead num={2} title="Cultural Watch Areas" sub="Organisation-wide patterns worth deliberate attention. These are not individual shortfalls." />
      <PrKey rows={[
        ['What this is', 'The three lowest-scoring dimensions of nine, ranked against each other.'],
        ['How to read it', `${bot3.filter(d => d.v >= 60).length} of the three sit in the solid band. ${bot3.every(d => d.v >= 60) ? 'This is a culture with no failing dimension, so read these as build priorities rather than problems.' : 'Read these as build priorities with a clear starting order.'}`],
        ['Where it goes next', 'Each of the three has a matching structural move in Section 6, with an owner and a timeframe.'],
      ]} />
      {bot3.map((d, i) => {
        const c = CULTURE_DIM_CONTENT[d.k] || {};
        return (
          <PrQualityCard key={i} tag={`WATCH AREA ${i + 1}`} tagColor={PRT.am} title={d.l} score={d.v}
            rows={[
              ['WHAT WE NOTICE, ORG-WIDE', c.structural || ''],
              ['WHY IT IS WORTH BUILDING', c.buildReason || ''],
              ['WHERE IT SHOWS FIRST', whereFirst(d.k)],
            ]} />
        );
      })}
      <PrNote title="THE SINGLE MOST USEFUL READ" color={PRT.c}>
        {lowD.l} at {lowD.v} is the lowest dimension and the one most exposed by growth. A culture that runs on its current strengths absorbs this gap well at {n} people and much less well at several times that. {(CULTURE_DIM_CONTENT[lowD.k] || {}).buildReason || 'Building it now is cheaper than repairing it later.'}
      </PrNote>
    </>
  ));

  // SECTION 3: archetypes
  add('c3', (
    <>
      <PrSectionHead num={3} title="Archetype Distribution" sub="Which profiles are over- or under-represented across the organisation. A useful signal for future hiring." />
      <PrKey rows={[
        ['What an archetype is', 'A CORE profile describing how a person tends to contribute. Thirteen exist in the framework. None is better than another.'],
        ['How to use it', 'Read the mix, not the individual counts. An over-represented profile tells you what the organisation is good at hiring for; an absent one tells you what it currently has to build or buy.'],
        ...(n <= 12 ? [['Small-sample caution', `With ${n} respondents, one person equals ${Math.round(100 / n)} percentage points. Treat this as a direction of travel, not a distribution.`]] : []),
      ]} />
      <div style={{ display: 'flex', gap: 22, alignItems: 'center', border: `1px solid ${PRT.line}`, background: PRT.panel, padding: '16px 18px', marginBottom: 12 }}>
        <PrDonut
          segments={archSorted.map(([nm], i) => ({ value: archCounts[nm], color: PR_COLORS[i % PR_COLORS.length] }))}
          size={150} hole={94}
          centerTop={<div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: PRT.ink, lineHeight: 1 }}>{n}</div>}
          centerBottom={<div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 6.3, letterSpacing: '0.16em', color: PRT.faint, marginTop: 3 }}>PEOPLE</div>}
        />
        <div style={{ flex: 1 }}>
          <PrBody size={9} style={{ marginBottom: 8 }}>{archSorted.length} of the thirteen CORE profiles appear across this organisation.</PrBody>
          {archSorted.slice(0, 9).map(([nm, count], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 14, height: 4, background: PR_COLORS[i % PR_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
              <PrBody size={8.7} color={PRT.ink} style={{ fontWeight: 600, flex: 1 }}>{nm}</PrBody>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.7, fontWeight: 700, color: PRT.sub }}>{count} ({Math.round((count / n) * 100)}%)</span>
            </div>
          ))}
          {archSorted.length > 9 && <PrBody size={8} color={PRT.faint}>and {archSorted.length - 9} more profile{archSorted.length - 9 === 1 ? '' : 's'} with smaller counts.</PrBody>}
        </div>
      </div>
      <PrNote title="WHAT THIS MIX MEANS" color={PRT.c} style={{ marginBottom: 10 }}>
        The dominant profile is {dominant[0]} at {dominantPct} per cent, which leans toward {ORG_ARCHETYPE_TAG[dominant[0]] || 'a distinct working style'}. That builds naturally toward {topD.l.toLowerCase()}, while {lowD.l.toLowerCase()} is the dimension that needs deliberate attention as the organisation grows.
      </PrNote>
      {missing.length > 0 ? (
        <PrNote title="NOT CURRENTLY REPRESENTED" color={PRT.am}>
          {missing.slice(0, 3).map(m => `${m}, which leans toward ${ORG_ARCHETYPE_TAG[m]}`).join('. ')}. {missing.length > 3 ? `${missing.length - 3} further profile${missing.length - 3 === 1 ? ' is' : 's are'} also absent. ` : ''}Worth weighting toward in the next few hires if the organisation is scaling, and worth checking against Section 6 before treating it as a gap.
        </PrNote>
      ) : (
        <PrNote title="COVERAGE" color={PRT.gn}>All thirteen CORE profiles are represented, which is an unusually complete spread of working styles.</PrNote>
      )}
    </>
  ));

  // SECTION 4: departments
  const deptRow = d => [
    <span style={{ fontWeight: 700, color: PRT.ink }}>{d.dep}{d.count < 3 ? ' *' : ''}</span>,
    d.count,
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, color: prCol(d.avg) }}>{d.avg}</span>,
    d.count < 2 || !d.dims.length ? <span style={{ fontStyle: 'italic', color: PRT.faint }}>Too few respondents for a reliable read</span> : `${d.dims[0].l} (${d.dims[0].v})`,
    d.count < 2 || !d.dims.length ? <span style={{ fontStyle: 'italic', color: PRT.faint }}>Too few respondents for a reliable read</span> : `${d.dims[d.dims.length - 1].l} (${d.dims[d.dims.length - 1].v})`,
  ];
  const deptChunks = prChunk(deptStats, 11, 15);
  deptChunks.forEach((chunkRows, ci) => {
    add('c4', (
      <>
        <PrSectionHead num={4} title={`How Departments Compare${deptChunks.length > 1 ? ` (${ci + 1} of ${deptChunks.length})` : ''}`} sub="A starting point for department-level conversations, not a ranking." />
        {ci === 0 && (
          <PrKey rows={[
            ['Composite', 'That department\'s average overall score out of 100.'],
            ['Standout and growth', 'The highest and lowest of the nine measured areas for that department.'],
            ['Small departments', 'Departments marked * have fewer than 3 respondents; treat their figures as directional, and their standout/growth reads are withheld below 2 respondents.'],
          ]} />
        )}
        <PrTable cols={['Department', 'People', 'Composite', 'Standout strength', 'Growth area']} widths={[160, 55, 70, undefined, undefined]} fontSize={8.4}
          rows={chunkRows.map(deptRow)} />
        {ci === deptChunks.length - 1 && (
          <PrBody size={8.3} color={PRT.faint} style={{ marginTop: 8 }}>Differences between departments are usually about role demands and local leadership rather than talent quality. The most useful follow-up is a short conversation with the department at each end of the composite range.</PrBody>
        )}
      </>
    ));
  });

  // SECTION 5: learning and leadership
  add('c5', (
    <>
      <PrSectionHead num={5} title="Learning and Leadership Fit" sub="How this culture prefers to learn, and the leadership style that lands with it." />
      <PrKey rows={[
        ['What this is', 'A read on delivery style, not on content. It tells you how to introduce a programme or a change here, not what it should contain.'],
        ['Why it matters', 'The same intervention succeeds or fails on delivery. Match the delivery to the culture and Section 6 gets much easier.'],
      ]} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.c}`, padding: '11px 13px' }}>
          <PrLabel style={{ marginBottom: 4 }}>LEARNING AND GROWTH PREFERENCES</PrLabel>
          <PrHead size={13} style={{ marginBottom: 5 }}>{learningPref.mode}</PrHead>
          <PrBody size={8.8} style={{ marginBottom: 7 }}>{learningPref.desc}</PrBody>
          <PrBody size={8.8} style={{ marginBottom: 5 }}><span style={{ fontWeight: 700, color: PRT.ink }}>How to build on it:</span> {learningPref.incentive}</PrBody>
          <PrBody size={8.8}><span style={{ fontWeight: 700, color: PRT.ink }}>Worth knowing:</span> {learningPref.resist}</PrBody>
        </div>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.gold}`, padding: '11px 13px' }}>
          <PrLabel c={PRT.gold} style={{ marginBottom: 4 }}>LEADERSHIP STYLE FIT</PrLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
            <div>
              <PrLabel c={PRT.gn} style={{ letterSpacing: '0.08em' }}>WORKS WELL HERE</PrLabel>
              <PrBody size={10} color={PRT.ink} style={{ fontWeight: 800 }}>{leadershipFit.succeeds}</PrBody>
            </div>
            <div style={{ textAlign: 'right' }}>
              <PrLabel c={PRT.am} style={{ letterSpacing: '0.08em' }}>LANDS LESS NATURALLY</PrLabel>
              <PrBody size={10} color={PRT.ink} style={{ fontWeight: 800 }}>{leadershipFit.lessWell}</PrBody>
            </div>
          </div>
          <PrBody size={8.8}>{leadershipFit.desc}</PrBody>
        </div>
      </div>
      <PrHead size={12} style={{ marginBottom: 6 }}>How this plays out in three common situations</PrHead>
      <PrTable cols={['Situation', 'What works here', 'What tends to backfire']} fontSize={8.4} style={{ marginBottom: 14 }}
        rows={situations.map(s => [<span style={{ fontWeight: 700, color: PRT.ink }}>{s[0]}</span>, s[1], s[2]])} />
      <PrHead size={12} style={{ marginBottom: 6 }}>Introducing a change here: a three-step sequence</PrHead>
      {[
        ['1 · Give the reason first', 'State the problem the change solves before naming the process. This culture accepts a reasoned constraint far more readily than an unexplained one.'],
        ['2 · Let the team shape the how', orgAvg.O >= 60 ? `Set the outcome and the deadline, not the method. With openness at ${orgAvg.O}, the group will build a better process than one handed to them.` : `Set the outcome and provide a clear starting method to adapt. With openness at ${orgAvg.O}, a blank page invites hesitation more than invention.`],
        ['3 · Add one visible checkpoint', `A single named review point converts autonomy into accountability without becoming oversight. This is the specific bridge between this section and the ${lowD.l.toLowerCase()} figure in Section 2.`],
      ].map(([t, b], i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 130, fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, fontWeight: 700, color: PRT.c, letterSpacing: '0.06em', paddingTop: 1 }}>{t}</div>
          <PrBody size={8.8}>{b}</PrBody>
        </div>
      ))}
    </>
  ));

  // SECTION 6: interventions
  const TIMEFRAMES = ['Start now', 'Next quarter', '6 to 12 months'];
  add('c6', (
    <>
      <PrSectionHead num={6} title="Culture-Level Interventions" sub="Structural, org-wide moves that answer Section 2. These are policy-level, not individual coaching." />
      <PrKey rows={[
        ['What these are', 'Changes to policy, process or calendar. None of them requires a training budget or an individual development plan.'],
        ['Owner', 'The function accountable for the move happening, named on every card.'],
        ['Timeframe', 'Suggested start, not duration. The three are sequenced deliberately: structure first, recovery second, exposure third.'],
      ]} />
      {bot3.map((d, i) => (
        <div key={i} style={{ border: `1px solid ${PRT.line}`, borderLeft: `4px solid ${i === 0 ? PRT.c : PRT.am}`, padding: '10px 13px', marginBottom: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
            <PrLabel c={i === 0 ? PRT.c : PRT.am}>BUILDING: {d.l.toUpperCase()} · {d.v}</PrLabel>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', color: PRT.faint, textTransform: 'uppercase' }}>{TIMEFRAMES[i]}</span>
          </div>
          <PrHead size={12.5} style={{ marginBottom: 4 }}>{PR_INT_TITLE[d.k] || `Build ${d.l.toLowerCase()} deliberately`}</PrHead>
          <PrBody size={8.9} style={{ marginBottom: 5 }}>{(CULTURE_DIM_CONTENT[d.k] || {}).intervention || ''}</PrBody>
          <PrBody size={8} color={PRT.faint} style={{ fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Owner: {PR_INT_OWNER[d.k] || 'HR / L&D'}</PrBody>
        </div>
      ))}
      <PrHead size={12} style={{ margin: '8px 0 6px' }}>Sequencing, and how progress is measured</PrHead>
      <PrTable cols={['Window', 'What is in flight', 'What tells you it is working']} widths={[95, undefined, undefined]} fontSize={8.4} style={{ marginBottom: 10 }}
        rows={bot3.map((d, i) => [
          <span style={{ fontWeight: 700, color: PRT.ink }}>{['0 to 3 months', '3 to 6 months', '6 to 12 months'][i]}</span>,
          PR_INT_TITLE[d.k] || `Build ${d.l.toLowerCase()}`,
          PR_WORKING_SIGNAL[d.k] || 'The figure moves at the next re-pulse.',
        ])} />
      <PrNote title="A CAUTION ON MEASUREMENT" color={PRT.am}>
        Programme completion is not evidence of cultural movement. The only reliable measure is a re-pulse of the same nine dimensions, and six months is usually the shortest interval that shows real change. {lowD.l} at {lowD.v} is the figure to watch first.
      </PrNote>
    </>
  ));

  // EXEC SUMMARY
  add('exec', (
    <>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <PrLabel style={{ marginBottom: 8 }}>EXECUTIVE CULTURE SUMMARY</PrLabel>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: PRT.ink, lineHeight: 1.15, marginBottom: 8 }}>"{persona.name}"</div>
        <PrBody size={8.8} color={PRT.faint}>{orgKnown ? `${orgName} · ` : ''}{batch} · composite {compAvg} of 100 · {n} respondents</PrBody>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.gn}`, background: PRT.gnSoft, padding: '10px 12px' }}>
          <PrLabel c={PRT.gn} style={{ marginBottom: 7 }}>TOP TWO CULTURAL STRENGTHS</PrLabel>
          {top2.map((d, i) => <PrBody key={i} size={10} color={PRT.ink} style={{ fontWeight: 700, marginBottom: 4 }}>{i + 1}. {d.l} ({d.v})</PrBody>)}
        </div>
        <div style={{ flex: 1, border: `1px solid ${PRT.line}`, borderTop: `3px solid ${PRT.am}`, background: PRT.amSoft, padding: '10px 12px' }}>
          <PrLabel c={PRT.am} style={{ marginBottom: 7 }}>TOP TWO GROWTH AREAS</PrLabel>
          {bot2.map((d, i) => <PrBody key={i} size={10} color={PRT.ink} style={{ fontWeight: 700, marginBottom: 4 }}>{i + 1}. {d.l} ({d.v})</PrBody>)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <PrNote title="HIRING PATTERN INSIGHT" color={PRT.gold}>
            The dominant archetype is {dominant[0]} at {dominantPct} per cent. That builds naturally toward {top2[0].l.toLowerCase()}, while {bot2[0].l.toLowerCase()} needs deliberate attention as the organisation grows.{missing.length ? ` The absent profiles (${missing.slice(0, 2).join(', ')}) sit on the ${PR_DIM_CAT[lowD.k] === 'procedural' ? 'process and governance' : 'complementary'} side of the framework.` : ''}
          </PrNote>
        </div>
        <div style={{ flex: 1 }}>
          <PrNote title="LEADERSHIP RECOMMENDATION" color={PRT.c}>
            Lead here by being {leadershipFit.succeeds.toLowerCase()}. A {leadershipFit.lessWell.toLowerCase()} approach tends to land less naturally, which matters because the moves in Section 6 are structural and will need to be introduced without feeling imposed.
          </PrNote>
        </div>
      </div>
      <PrHead size={12} style={{ marginBottom: 6 }}>Three moves for the next 90 days</PrHead>
      <PrTable cols={['#', 'Move', 'Owner']} widths={[26, undefined, 130]} fontSize={8.6} style={{ marginBottom: 12 }}
        rows={bot3.map((d, i) => [
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, color: PRT.c }}>{i + 1}</span>,
          <span><span style={{ fontWeight: 700, color: PRT.ink }}>{PR_INT_TITLE[d.k] || `Build ${d.l.toLowerCase()}`}.</span> {(CULTURE_DIM_CONTENT[d.k] || {}).intervention || ''}</span>,
          PR_INT_OWNER[d.k] || 'HR / L&D',
        ])} />
      <PrPairNotes
        left={['HOW CONFIDENT TO BE', `${n} respondents; ${validAmber} of them worth reading alongside a conversation. Directional confidence is reasonable at the dimension level. Do not use these figures for individual decisions of any kind.`, PRT.am]}
        right={['WHAT WE WOULD LOOK AT NEXT', `Re-pulse the same nine dimensions in six months, and read this document alongside the Team Insight reporting for ${batch}, which covers the same people at team level using the same score bands.`, PRT.gn]}
      />
    </>
  ));

  // fixed front pages + numbering
  const secStart = {};
  rest.forEach((p, i) => { if (!(p.sec in secStart)) secStart[p.sec] = i + 3; });
  const contents = [
    ['·', 'The Culture Profile', 'Nine dimensions, ranked, with the spread.', secStart.prof],
    ['1', 'Cultural Strengths', 'What this organisation attracts and retains.', secStart.c1],
    ['2', 'Cultural Watch Areas', 'Org-wide patterns worth deliberate attention.', secStart.c2],
    ['3', 'Archetype Distribution', 'Who is in the room, and who is missing.', secStart.c3],
    ['4', 'How Departments Compare', 'Composite, standout and growth per department.', secStart.c4],
    ['5', 'Learning and Leadership Fit', 'How to deliver change so it lands.', secStart.c5],
    ['6', 'Culture-Level Interventions', 'Structural moves, owners and timeframes.', secStart.c6],
    ['·', 'Executive Culture Summary', 'Boardroom-ready, one page.', secStart.exec],
  ];

  const coverBody = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CoreLogo h={40} />
        <PrLabel c={PRT.faint}>CORE BY CARNELIAN · RESTRICTED</PrLabel>
      </div>
      <div style={{ marginTop: 52 }}>
        <PrLabel style={{ marginBottom: 6 }}>ORGANIZATIONAL CULTURE PULSE REPORT</PrLabel>
        <PrHead size={22}>{orgKnown ? orgName : `Batch ${batch}`}</PrHead>
      </div>
      <div style={{ display: 'flex', gap: 26, alignItems: 'flex-start', margin: '46px 0' }}>
        <div style={{ flex: 1 }}>
          <PrLabel c={PRT.gold} style={{ marginBottom: 8 }}>THE CULTURE, IN ONE LINE</PrLabel>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: PRT.c, lineHeight: 1.15, marginBottom: 10 }}>"{persona.name}"</div>
          <PrBody size={10}>{persona.desc} Its strongest asset is {topD.l.toLowerCase()} ({topD.v}); its clearest build is {lowD.l.toLowerCase()} ({lowD.v}).</PrBody>
        </div>
        <div style={{ width: 170, textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 54, fontWeight: 700, color: PRT.c, lineHeight: 1 }}>{compAvg}</div>
          <PrLabel c={PRT.faint} style={{ marginTop: 6, letterSpacing: '0.1em' }}>ORG COMPOSITE</PrLabel>
          <PrBody size={7.8} color={PRT.faint} style={{ marginTop: 4 }}>Average overall performance baseline across all participants.</PrBody>
        </div>
      </div>
      <PrMeta rows={[
        ['Batch / organisation', `${batch}${orgKnown ? ` · ${orgName}` : ''}`],
        ['Total participants', `${n} assessed team members`],
        ['Departments', `${deptList.length} represented: ${deptLine}`],
        ['Response confidence', `${validGreen} of ${n} high confidence, ${validAmber} to read alongside a conversation${redExcluded > 0 ? ` (${redExcluded} excluded, low reliability)` : ''}`],
        ['Assessment date', today],
        ['Report prepared by', 'Carnelian Co.'],
        ['Classification', 'Restricted. HR leadership only'],
      ]} />
      <div style={{ background: PRT.panel, border: `1px solid ${PRT.line}`, padding: '10px 14px', marginTop: 14, textAlign: 'center' }}>
        <PrBody size={7.8} color={PRT.faint}>
          <span style={{ fontWeight: 800, color: PRT.sub }}>CONFIDENTIAL.</span> This report describes organisation-wide patterns only. It contains no individual results and is not a performance record. Restricted to HR leadership; not for onward circulation without prior consultation with Carnelian Co.
        </PrBody>
      </div>
    </>
  );

  const howToBody = (
    <>
      <PrSectionHead title="How to Read This Report" sub="Everything a project custodian needs in order to use this document unaided." />
      <PrKey title="KEY FOR PROJECT CUSTODIANS" rows={[
        ['Scores', 'Everything is out of 100 and describes the organisation, not any individual.'],
        ['Bands', '75 and above is a strength. 60 to 74 is solid. Below 60 is still building. The same bands are used in the Team Insight reporting for this batch, so the documents can be read side by side.'],
        ['Strong and weak', 'Sections 1 and 2 rank the nine dimensions against each other. A dimension can be a relative watch area and still sit in the solid band.'],
        ['Patterns, not people', 'Every finding here is organisation-wide. Nothing in this report attributes a score to a named person.'],
        ['A caution', `These are self-reported results. ${validAmber} of ${n} responses in this batch are worth reading alongside a conversation rather than on their own. That is normal in assessment, not a red flag.`],
        ['Who acts', 'Section 6 names an owner and a timeframe for every recommended move.'],
      ]} />
      <PrHead size={12} style={{ margin: '2px 0 6px' }}>Contents</PrHead>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
        <tbody>
          {contents.map(([num, title, sub, pg], i) => (
            <tr key={i} style={{ borderBottom: i < contents.length - 1 ? `1px solid ${PRT.lineSoft}` : 'none' }}>
              <td style={{ width: 26, padding: '5px 0', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 700, color: PRT.c }}>{num}</td>
              <td style={{ padding: '5px 0' }}>
                <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 9.5, fontWeight: 700, color: PRT.ink }}>{title}</span>
                <span style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 8.3, color: PRT.faint }}>  ·  {sub}</span>
              </td>
              <td style={{ width: 30, padding: '5px 0', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 700, color: PRT.sub }}>{pg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PrLabel c={PRT.faint} style={{ marginBottom: 6 }}>THIS REPORT IN FOUR NUMBERS</PrLabel>
      <PrStats items={[
        [n, 'Participants assessed'],
        [deptList.length, 'Departments represented'],
        [topD.v, `Highest dimension: ${topD.l}`],
        [lowD.v, `Lowest dimension: ${lowD.l}`],
      ]} />
      <div style={{ marginTop: 14 }}>
        <PrPairNotes
          left={['WHERE TO START', 'If you have five minutes, read the Executive Culture Summary at the back. If you are planning hiring, read Sections 3 and 4. If you are planning change, read Sections 5 and 6 together.', PRT.c]}
          right={n <= 12
            ? ['SMALL-SAMPLE CAUTION', `With ${n} respondents, one person can move any organisation-wide figure by up to ${Math.round(100 / n)} points. Read every number as a direction of travel rather than a measurement.`, PRT.am]
            : ['A NOTE ON SCALE', `Figures over ${n} respondents are statistically steady at the organisation level. Department-level figures in Section 4 carry their own sample-size notes.`, PRT.gn]}
        />
      </div>
    </>
  );

  const bodies = [coverBody, howToBody, ...rest.map(p => p.body)];
  const total = bodies.length;
  const pid = i => `cp-pg-${candidate.doc_id}-${i}`;
  const ids = bodies.map((_, i) => pid(i));
  const footerLeft = `Organizational Culture Pulse Report${orgKnown ? ` · ${orgName}` : ''} · ${batch}`;

  return (
    <div>
      <PrStyles />
      <PrPreviewNote T={T} pages={total} />
      <PrDownloadBtn ids={ids} filename={`${batch}_Culture_Pulse.pdf`} />
      {bodies.map((b, i) => (
        <PrPage key={i} id={pid(i)} pageNo={i + 1} total={total} footerLeft={footerLeft} footerRight="Restricted: HR Leadership Only">{b}</PrPage>
      ))}
      <PrDownloadBtn ids={ids} filename={`${batch}_Culture_Pulse.pdf`} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CANDIDATE DETAIL MODAL — all 5 reports
// ═══════════════════════════════════════════════════════════════

const EvidenceReport = ({ candidate, T }) => {
  const [evState, setEvState] = useState({});
  useEffect(() => {
    try { setEvState(JSON.parse(localStorage.getItem(`core_ev_${candidate.doc_id}`) || '{}')); } catch(e) {}
  }, [candidate.doc_id]);

  return (
    <div className="anim-fadeUp">
      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px' }}>
        <SectionHead label="Candidate Evidence & Uploads" T={T} />
        <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:'700', color:T.t0, marginBottom:'16px'}}>Verification Dashboard</h2>
        <p style={{fontSize:'13px', color:T.t2, marginBottom:'24px'}}>Review the proof uploaded by the candidate for their Action Plan quests and power-ups.</p>
        
        {Object.keys(evState).length === 0 ? (
          <div style={{background:T.bg2, border:`1px dashed ${T.b2}`, borderRadius:'10px', padding:'40px', textAlign:'center'}}>
            <div style={{fontSize:'24px', marginBottom:'12px'}}>📂</div>
            <div style={{fontSize:'14px', fontWeight:'700', color:T.t1}}>No evidence uploaded yet</div>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            {Object.entries(evState).map(([k, e], i) => (
              <div key={i} style={{background:T.bg2, border:`1px solid ${T.gn}40`, borderLeft:`4px solid ${T.gn}`, borderRadius:'8px', padding:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', fontWeight:'800', color:T.gn, marginBottom:'4px'}}>SUBMITTED ACTION · +{e.xp} XP</div>
                    <div style={{fontSize:'12px', color:T.t2}}>Date: {new Date(e.ts).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => {
                    if(!window.confirm('Reject this evidence? This will revoke the XP from the candidate.')) return;
                    const newState = {...evState};
                    delete newState[k];
                    setEvState(newState);
                    localStorage.setItem(`core_ev_${candidate.doc_id}`, JSON.stringify(newState));
                  }} style={{background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40`, padding:'8px 14px', borderRadius:'6px', fontSize:'11px', fontWeight:'700', cursor:'pointer'}}>
                    Reject & Revoke XP
                  </button>
                </div>
                
                <div style={{background:T.bg3, padding:'16px', borderRadius:'6px', fontSize:'13px', color:T.t1, lineHeight:'1.6'}}>
                  {e.type === 'book' && <><p><strong>Quote:</strong> "{e.data.quote}"</p><p><strong>Takeaway:</strong> {e.data.takeaway}</p></>}
                  {(e.type === 'ted' || e.type === 'youtube') && <><p><strong>Timestamp:</strong> {e.data.timestamp}</p><p><strong>Insight:</strong> {e.data.insight}</p></>}
                  {e.type === 'research' && <><p><strong>Ref:</strong> {e.data.ref}</p><p><strong>Finding:</strong> {e.data.finding}</p></>}
                  {e.type === 'quest' && <><p><strong>Reflection:</strong> {e.data.reflection}</p></>}
                  
                  {e.data.fileBase64 && (
                    <div style={{marginTop:'16px', paddingTop:'16px', borderTop:`1px solid ${T.b2}`}}>
                      <a href={e.data.fileBase64} download={e.data.fileName} style={{display:'inline-flex', alignItems:'center', gap:'8px', color:'#38bdf8', textDecoration:'none', fontSize:'12px', fontWeight:'700', background:'rgba(56,189,248,0.1)', padding:'8px 16px', borderRadius:'6px', border:'1px solid rgba(56,189,248,0.3)'}}>
                        📎 Download Attached Proof ({e.data.fileName})
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PERSONA CARD ─────────────────────────────────────────────
const PersonaCard = ({ candidate, T }) => {
  const [personaSlide, setPersonaSlide] = useState(0);

  const rd      = candidate.report_data || {};
  const profile = rd.profile  || {};
  const date    = new Date(candidate.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
  const docId   = candidate.doc_id;
  const R       = { name: candidate.name };

  const gem = GEMSTONES[profile.name || candidate.profile_name] || GEMSTONES['Emerging Professional'];
  const TOTAL_SLIDES = 4;

  const SlideShell = ({ children, index }) => (
    <div style={{
      width:'1080px', height:'1350px', background:T.bg0, position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', boxSizing:'border-box',
    }}>
      {/* Ambient glows, two corners for more visual depth */}
      <div style={{position:'absolute', top:'-14%', right:'-14%', width:'760px', height:'760px', borderRadius:'50%', background:`radial-gradient(circle, ${gem.color}28 0%, transparent 65%)`, pointerEvents:'none'}} />
      <div style={{position:'absolute', bottom:'-10%', left:'-12%', width:'560px', height:'560px', borderRadius:'50%', background:`radial-gradient(circle, ${gem.color}18 0%, transparent 65%)`, pointerEvents:'none'}} />
      {/* Giant faint watermark emoji for texture */}
      <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(-8deg)', fontSize:'620px', opacity:0.035, pointerEvents:'none', lineHeight:1}}>{gem.emoji}</div>

      <div style={{height:'7px', background:`linear-gradient(90deg, ${gem.color}, ${gem.colorDark}, transparent)`, flexShrink:0, position:'relative', zIndex:2}} />

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'44px 72px 0', flexShrink:0, position:'relative', zIndex:2}}>
     <img src={T.bg0 === '#0A0808' ? "/core-logo-for-dark-mode.svg" : "/core-logo-for-light-mode.svg"} alt="CORE" style={{height:'60px', width:'auto'}} />
        <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace", color:gem.color, fontSize:'22px', fontWeight:'800', letterSpacing:'0.16em'}}>CORE ASSESSMENT</div>
          <div style={{background:gem.color, color:'#fff', fontFamily:"'IBM Plex Mono',monospace", fontSize:'18px', fontWeight:'800', padding:'6px 16px', borderRadius:'100px', letterSpacing:'0.05em'}}>{index+1} / {TOTAL_SLIDES}</div>
        </div>
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 72px', position:'relative', zIndex:2}}>
        {children}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'26px 72px', borderTop:`1px solid ${T.b2}`, flexShrink:0, position:'relative', zIndex:2, background:T.bg1}}>
        <div style={{fontFamily:"'Public Sans',sans-serif", fontSize:'20px', color:T.t3, fontWeight:'600'}}>
          Discover yours at <strong style={{color:T.t0}}>CORE by Carnelian</strong>
        </div>
        <div className="mono" style={{fontSize:'18px', color:T.t3}}>{gem.gem}</div>
      </div>
      <div style={{height:'6px', background:`linear-gradient(90deg, transparent, ${gem.colorDark}, ${gem.color}, transparent)`, flexShrink:0, position:'relative', zIndex:2}} />
    </div>
  );

  const Slide0 = (
    <SlideShell index={0}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'168px', height:'168px', borderRadius:'50%', border:`3px solid ${gem.color}55`, background:`radial-gradient(circle, ${gem.color}28 0%, ${gem.color}10 70%)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 40px', fontSize:'80px', boxShadow:`0 0 60px ${gem.color}35`}}>
          {gem.emoji}
        </div>
        <div style={{fontFamily:"'IBM Plex Mono',monospace", color:T.t2, fontSize:'24px', fontWeight:'800', letterSpacing:'0.14em', marginBottom:'8px', textTransform:'uppercase'}}>YOUR CORE IDENTITY</div>
        <div style={{fontFamily:"'IBM Plex Mono',monospace", color:T.t0, fontSize:'36px', fontWeight:'800', letterSpacing:'0.06em', marginBottom:'30px', textTransform:'uppercase'}}>{R.name}</div>
        <div style={{width:'80px', height:'6px', background:`linear-gradient(90deg, ${gem.color}, ${gem.colorDark})`, borderRadius:'3px', margin:'0 auto 34px'}} />
        <h1 style={{fontFamily:"'Crimson Pro',serif", fontSize:'104px', fontWeight:'700', color:gem.color, lineHeight:'1.0', margin:'0 0 14px', letterSpacing:'-0.01em', textShadow:`0 0 60px ${gem.color}40`}}>{gem.gem}</h1>
        <div style={{fontFamily:"'Crimson Pro',serif", fontStyle:'italic', fontSize:'42px', color:T.t1, fontWeight:'600', marginBottom:'34px'}}>{gem.title}</div>
        <p style={{fontFamily:"'Public Sans',sans-serif", fontSize:'29px', color:T.t2, lineHeight:'1.6', maxWidth:'840px', margin:'0 auto', fontWeight:'600'}}>{gem.tagline}</p>
      </div>
    </SlideShell>
  );

  const Slide1 = (
    <SlideShell index={1}>
      <div style={{fontFamily:"'Crimson Pro',serif", fontSize:'160px', color:`${gem.color}45`, lineHeight:0.6, marginBottom:'-10px'}}>"</div>
      <div className="mono" style={{fontSize:'22px', fontWeight:'800', color:gem.color, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'22px'}}>What This Means</div>
      <p style={{fontFamily:"'Crimson Pro',serif", fontSize:'48px', color:T.t0, lineHeight:'1.45', fontWeight:'600', marginBottom:'48px'}}>{gem.desc}</p>
      <div style={{background:`${gem.color}16`, borderLeft:`7px solid ${gem.color}`, borderRadius:'0 14px 14px 0', padding:'32px 36px'}}>
        <div style={{fontFamily:"'IBM Plex Mono',monospace", fontSize:'17px', fontWeight:'800', color:gem.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'12px'}}>In One Line</div>
        <div style={{fontFamily:"'Public Sans',sans-serif", fontSize:'32px', color:T.t0, fontWeight:'700'}}>{gem.quirky}</div>
      </div>
    </SlideShell>
  );

  const Slide2 = (
    <SlideShell index={2}>
      <div style={{display:'flex', flexDirection:'column', gap:'46px'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px'}}>
            <div style={{width:'46px', height:'46px', borderRadius:'50%', background:`${gem.color}22`, border:`2px solid ${gem.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'}}>👥</div>
            <div className="mono" style={{fontSize:'22px', fontWeight:'800', color:gem.color, textTransform:'uppercase', letterSpacing:'0.12em'}}>In A Team</div>
          </div>
          <div style={{fontFamily:"'Crimson Pro',serif", fontSize:'44px', color:T.t0, fontWeight:'600', lineHeight:'1.4'}}>{gem.inTeam}</div>
        </div>
        <div style={{height:'2px', background:`linear-gradient(90deg, ${gem.color}50, transparent)`}} />
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px'}}>
            <div style={{width:'46px', height:'46px', borderRadius:'50%', background:`${gem.color}22`, border:`2px solid ${gem.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'}}>⚡</div>
            <div className="mono" style={{fontSize:'22px', fontWeight:'800', color:gem.color, textTransform:'uppercase', letterSpacing:'0.12em'}}>Your Edge</div>
          </div>
          <div style={{fontFamily:"'Crimson Pro',serif", fontSize:'40px', color:T.t1, fontWeight:'600', lineHeight:'1.45'}}>{gem.edge}</div>
        </div>
      </div>
    </SlideShell>
  );

  const Slide3 = (
    <SlideShell index={3}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'72px', marginBottom:'32px'}}>{gem.emoji}</div>
        <p style={{fontFamily:"'Crimson Pro',serif", fontSize:'56px', color:gem.color, fontWeight:'700', lineHeight:'1.35', marginBottom:'44px'}}>{gem.oneLine}</p>
        <div style={{width:'80px', height:'6px', background:`linear-gradient(90deg, ${gem.color}, ${gem.colorDark})`, borderRadius:'3px', margin:'0 auto 36px'}} />
        <div style={{fontFamily:"'Public Sans',sans-serif", fontSize:'27px', color:T.t2, fontWeight:'600', marginBottom:'12px'}}>Every professional has a gemstone.</div>
        <div style={{fontFamily:"'Public Sans',sans-serif", fontSize:'32px', color:T.t0, fontWeight:'800'}}>Find yours at CORE by Carnelian.</div>
        <div className="mono" style={{fontSize:'18px', color:T.t3, marginTop:'32px'}}>{docId} · {date}</div>
      </div>
    </SlideShell>
  );

  const slides = [Slide0, Slide1, Slide2, Slide3];
  const total = slides.length;
  const goToSlide = (i) => setPersonaSlide(((i % total) + total) % total);

  // PDF Download logic
  const loadScriptOnce = (src, flag) => new Promise((resolve, reject) => {
    if (window[flag]) { resolve(); return; }
    const existing = document.querySelector(`script[data-${flag}]`);
    if (existing) {
      const check = setInterval(() => { if (window[flag]) { clearInterval(check); resolve(); } }, 50);
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.setAttribute(`data-${flag}`, '1');
    s.onload = () => { window[flag] = true; resolve(); };
    s.onerror = reject;
    document.body.appendChild(s);
  });

  const loadHtml2Canvas = () => loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', '__h2c_ready');
  const loadJsPDF = () => loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', '__jspdf_ready');
  const waitForRender = () => new Promise(r => setTimeout(r, 150));

  const captureSlideCanvas = async () => {
    const el = document.getElementById('persona-capture-card');
    if (!el) return null;
    return window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: T.bg0 });
  };

  const downloadCarouselPDF = async () => {
    await loadHtml2Canvas();
    await loadJsPDF();
    const { jsPDF } = window.jspdf;
    const originalSlide = personaSlide;
    const pdf = new jsPDF({ unit: 'px', format: [1080, 1350], orientation: 'portrait' });

    for (let i = 0; i < TOTAL_SLIDES; i++) {
      setPersonaSlide(i);
      await waitForRender();
      const canvas = await captureSlideCanvas();
      if (canvas) {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage([1080, 1350], 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350);
      }
    }
    setPersonaSlide(originalSlide);
    pdf.save(`${R.name?.replace(/\s+/g,'_') || 'CORE'}_Gemstone_Carousel.pdf`);
  };

  return (
    <div className="anim-fadeUp" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>

      <div style={{textAlign:'center', marginBottom:'24px'}}>
        <h2 className="serif" style={{fontSize:'2rem', fontWeight:'700', color:T.t0}}>Share Your Gemstone</h2>
        <p style={{color:T.t2, fontSize:'14px'}}>A 4-slide carousel built for Instagram or LinkedIn. Swipe through, then download.</p>
      </div>

      <div style={{position:'relative', width:'100%', maxWidth:'420px'}}>
        <div style={{
          width:'100%', aspectRatio:'1080 / 1350',
          background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'16px',
          overflow:'hidden', position:'relative', boxShadow:'0 20px 40px rgba(0,0,0,0.2)',
        }}>
          <div style={{width:'1080px', height:'1350px', transform:'scale(0.3889)', transformOrigin:'top left'}}>
            {slides[personaSlide]}
          </div>

          <button onClick={()=>goToSlide(personaSlide-1)} style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'34px', height:'34px', borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10}}>‹</button>
          <button onClick={()=>goToSlide(personaSlide+1)} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', width:'34px', height:'34px', borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10}}>›</button>
        </div>
      </div>

      <div style={{display:'flex', gap:'8px', marginTop:'18px'}}>
        {slides.map((s,i)=>(
          <button key={i} onClick={()=>goToSlide(i)} style={{
            width: personaSlide===i ? '22px' : '8px', height:'8px', borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
            background: personaSlide===i ? gem.color : T.b2, transition:'all .3s ease',
          }} />
        ))}
      </div>

      {/* Hidden full-resolution capture target, mirrors the active slide during export */}
      <div id="persona-capture-card" style={{position:'fixed', top:'-9999px', left:'-9999px', pointerEvents:'none'}}>
        {slides[personaSlide]}
      </div>

      <button onClick={downloadCarouselPDF} style={{
        marginTop:'32px', padding:'16px 40px', borderRadius:'100px', background:gem.color, color:'#fff', border:'none', cursor:'pointer',
        fontFamily:"'Public Sans',sans-serif", fontSize:'14px', fontWeight:'800', letterSpacing:'0.05em', textTransform:'uppercase',
        boxShadow:`0 10px 28px ${gem.color}40`,
      }}>⬇ Download Gemstone Carousel (PDF)</button>
      <p style={{marginTop:'12px', fontSize:'12px', color:T.t3}}>4 pages, one per slide. Perfect for an Instagram or LinkedIn carousel post.</p>
    </div> 
  );
};

// ═══════════════════════════════════════════════════════════════
// CANDIDATE DETAIL MODAL — all reports
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CANDIDATE DETAIL MODAL — all reports
// ═══════════════════════════════════════════════════════════════
const REPORT_TABS = [
  { id:'tech',    label:'📊 Technical Report',      sub:'HR & Leadership' },
  { id:'action',  label:'🧭 Action Plan',            sub:'Individual' },
  { id:'player',  label:'🎮 Player Report',          sub:'Gamified' },
  { id:'insight', label:'👥 Team Insight',           sub:'Single Dept' },
  { id:'culture', label:'🌍 Culture Pulse',          sub:'Multi-Dept' },
  { id:'persona', label:'📸 Persona Card',           sub:'Shareable' },
  { id:'evidence',label:'📎 Evidence & Uploads',     sub:'Verification' },
];

const CandidateModal = ({ candidate, onClose, T, allData, batches }) => {
  const [reportTab, setReportTab] = useState('tech');
  
  if (!candidate) return null;

  // Admin-side entitlements: which reports were commissioned for this batch
  const batchRec = (batches || []).find(b => String(b.code).toUpperCase() === String(candidate.batch || '').toUpperCase());
  const adminEnt = batchRec ? batchRec.entitlements || {} : null;
  const TAB_ENT_MAP = { tech:'tech', action:'action', player:'player', insight:'team', culture:'culture', persona:'persona' };
  const adminAllows = (tabId) => {
    if (!adminEnt) return true; // individuals and legacy batches: show everything
    if (tabId === 'evidence') return !adminEnt.player || adminEnt.player.admin !== false;
    const key = TAB_ENT_MAP[tabId];
    return !adminEnt[key] || adminEnt[key].admin !== false;
  };

  // Determine if this is a single-dept team or multi-dept org
  const normBatch = String(candidate.batch || '').trim().toLowerCase();
  const batchData = allData.filter(r => String(r.batch || '').trim().toLowerCase() === normBatch && r.report_data?.validity?.overall !== 'red');
  const uniqueDepts = [...new Set(batchData.map(b => b.department).filter(Boolean))];
  
  const showInsight = candidate.batch && uniqueDepts.length <= 1;
  const showCulture = candidate.batch && uniqueDepts.length > 1;

  const activeTabs = REPORT_TABS.filter(t => {
    if (t.id === 'insight') return showInsight && adminAllows('insight');
    if (t.id === 'culture') return showCulture && adminAllows('culture');
    return adminAllows(t.id);
  });
  const safeTab = activeTabs.some(t => t.id === reportTab) ? reportTab : (activeTabs[0]?.id || 'tech');

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.80)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'20px', overflowY:'auto',
    }} onClick={onClose}>
      <div className="modal-in" style={{
        maxWidth:'1100px', width:'100%', marginTop:'20px', marginBottom:'40px',
        background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'14px',
        boxShadow:`0 40px 80px rgba(0,0,0,0.6)`,
      }} onClick={e=>e.stopPropagation()}>

        {/* MODAL HEADER */}
        <div style={{
          background:T.bg0, padding:'22px 28px 0',
          borderBottom:`1px solid ${T.b2}`, borderRadius:'14px 14px 0 0',
          position:'sticky', top:0, zIndex:10,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'4px', fontWeight:'700' }}>
                {candidate.doc_id} · {candidate.industry}
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.7rem', fontWeight:'700', color:T.t0, marginBottom:'4px' }}>
                {candidate.name}
              </h2>
              <div style={{ fontSize:'11px', color:T.t2, fontWeight:'600', display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <ScoreBadge score={candidate.overall_score} T={T} />
                <Pill label={candidate.profile_name} color={T.c} />
                <ValidityDot overall={candidate.report_data?.validity?.overall} T={T} />
              </div>
            </div>
            <button onClick={onClose} className="close-btn" style={{
              width:'36px', height:'36px', borderRadius:'50%', border:`1px solid ${T.b2}`,
              background:'transparent', color:T.t2, cursor:'pointer', fontSize:'18px',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>✕</button>
          </div>

          {/* REPORT TAB BAR */}
          <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
            {activeTabs.map(tab => (
              <button key={tab.id} onClick={()=>setReportTab(tab.id)} className="report-tab-btn"
                style={{
                  padding:'10px 18px', borderRadius:'8px 8px 0 0',
                  border:`1px solid ${safeTab===tab.id ? T.b2 : 'transparent'}`,
                  borderBottom: safeTab===tab.id ? `1px solid ${T.bg1}` : `1px solid ${T.b2}`,
                  background: safeTab===tab.id ? T.bg1 : 'transparent',
                  color: safeTab===tab.id ? T.t0 : T.t3,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:'12px', fontWeight:'700', marginBottom:'-1px',
                  position:'relative',
                }}>
                {tab.label}
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, display:'block', fontWeight:'600', marginTop:'1px' }}>{tab.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div style={{ padding:'24px 28px' }}>
          {safeTab === 'tech'   && <TechnicalReport  candidate={candidate} T={T} />}
          {safeTab === 'action' && <ActionPlanReport candidate={candidate} T={T} />}
          {safeTab === 'player' && <PlayerReport     candidate={candidate} T={T} />}
          {safeTab === 'insight'&& <TeamInsightReport candidate={candidate} allData={allData} T={T} />}
          {safeTab === 'culture'&& <CulturePulseReport candidate={candidate} allData={allData} T={T} />}
          {safeTab === 'persona' && <PersonaCard candidate={candidate} T={T} />}
          {reportTab === 'evidence' && <EvidenceReport candidate={candidate} T={T} />}
        </div>
      </div>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD TABS (unchanged logic, updated modal call)
// ═══════════════════════════════════════════════════════════════

const OverviewTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (!total) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No assessments found in the database.</div>;

  const avgScore  = Math.round(data.reduce((s,r)=>s+Number(r.overall_score),0)/total);
  const validCount= data.filter(r=>r.report_data?.validity?.overall==='green').length;
  const highPot   = data.filter(r=>r.overall_score>=75).length;
  const flagged   = data.filter(r=>r.report_data?.validity?.overall==='red').length;
  const trendData = [...data].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).slice(-8).map(r=>r.overall_score);

  const profileDist = {};
  data.forEach(r=>{ profileDist[r.profile_name]=(profileDist[r.profile_name]||0)+1; });
  const topProfiles = Object.entries(profileDist).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const indDist = {};
  data.forEach(r=>{ if(r.industry) indDist[r.industry]=(indDist[r.industry]||0)+1; });
  const topInd = Object.entries(indDist).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'20px' }} className="dash-anim">
        {[
          { n:total,      l:'Total Assessments',c:T.gold, sub:'All time' },
          { n:avgScore,   l:'Average Score',    c:bCol(avgScore,T), sub:'/ 100 overall' },
          { n:highPot,    l:'High Potential',   c:T.gn,  sub:`Score ≥ 75 (${Math.round(highPot/total*100)}%)` },
          { n:flagged,    l:'Validity Flagged', c:T.rd,  sub:'Require verification' },
          { n:validCount, l:'Clean Validity',   c:T.gn,  sub:`${Math.round(validCount/total*100)}% of cohort` },
        ].map((s,i) => (
          <div key={i} className="metric-card" style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${s.c},transparent)` }} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:'700', color:s.c, lineHeight:'1', marginBottom:'5px' }}>{s.n}</div>
            <div style={{ fontSize:'11px', fontWeight:'700', color:T.t1, marginBottom:'2px' }}>{s.l}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }} className="dash-anim-2">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <SectionHead label="Score Bands" T={T} />
          {[
            { l:'High (75–100)',   v:data.filter(r=>r.overall_score>=75).length,                                c:T.gn },
            { l:'Moderate (50–74)',v:data.filter(r=>r.overall_score>=50&&r.overall_score<75).length,            c:T.am },
            { l:'Low (0–49)',      v:data.filter(r=>r.overall_score<50).length,                                 c:T.rd },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:T.t2, fontWeight:'600', marginBottom:'4px' }}>
                <span>{l}</span><span style={{ color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:'700' }}>{v}</span>
              </div>
              <div style={{ height:'5px', background:T.b1, borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ width:`${(v/total)*100}%`, height:'100%', background:c, transition:'width 0.8s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:'18px', paddingTop:'14px', borderTop:`1px solid ${T.b1}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontWeight:'600' }}>Recent Trend</div>
            <SparkLine data={trendData} color={T.gold} w={200} h={36} />
          </div>
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <SectionHead label="Profile Distribution" T={T} />
          {topProfiles.map(([name, count], i) => {
            const colors = [T.c, T.gold, T.gn, T.am, '#8B5CF6'];
            return <DistBar key={name} label={name} value={count} max={total} color={colors[i%colors.length]} T={T} />;
          })}
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <SectionHead label="Validity Status" T={T} />
          {[
            { l:'Valid (Green)',   v:data.filter(r=>r.report_data?.validity?.overall==='green').length, c:T.gn },
            { l:'Caution (Amber)', v:data.filter(r=>r.report_data?.validity?.overall==='amber').length, c:T.am },
            { l:'Flagged (Red)',   v:data.filter(r=>r.report_data?.validity?.overall==='red').length,   c:T.rd },
          ].map(({ l, v, c }) => (
            <DistBar key={l} label={l} value={v} max={total} color={c} T={T} />
          ))}
          <div style={{ marginTop:'18px', paddingTop:'14px', borderTop:`1px solid ${T.b1}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px', fontWeight:'600' }}>Industry Distribution</div>
            {topInd.map(([ind, count], i) => (
              <DistBar key={ind} label={ind.replace(/ & .*/,'')} value={count} max={total} color={i%2===0?T.c:T.gold} T={T} />
            ))}
          </div>
        </div>
      </div>

      <div className="dash-anim-3" style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.b2}`, display:'flex', alignItems:'center', gap:'10px' }}>
          <SectionHead label="Recent Assessments" T={T} />
          <Pill label={`${Math.min(data.length,5)} shown`} color={T.t3} />
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
                <tr style={{ borderBottom:`1px solid ${T.b2}` }}>
                {['Name','Type','Role / Dept','Score','Profile','Validity','Date'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5).map((r,i) => (
                <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{(r.batch || r.report_data?.respondent?.batch) ? '🏢 Org' : '👤 Ind'}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}{r.department?` · ${r.department}`:''}</td>
                  <td style={{ padding:'12px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.c, fontWeight:'700' }}>{r.profile_name}</td>
                  <td style={{ padding:'12px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t3, fontFamily:"'JetBrains Mono',monospace", fontWeight:'600' }}>
                    {new Date(r.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfilesTab = ({ data, T, onSelect }) => {
  const [search, setSearch]           = useState('');
  const [filterProfile, setFP]        = useState('');
  const [filterValidity, setFV]       = useState('');
  const [sortKey, setSortKey]         = useState('created_at');
  const [sortDir, setSortDir]         = useState('desc');

  const profiles = [...new Set(data.map(r=>r.profile_name).filter(Boolean))];

  const filtered = useMemo(() => {
    let d = [...data];
    if (search) d = d.filter(r =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.role?.toLowerCase().includes(search.toLowerCase())
    );
    if (filterProfile) d = d.filter(r=>r.profile_name===filterProfile);
    if (filterValidity) d = d.filter(r=>r.report_data?.validity?.overall===filterValidity);
    d.sort((a,b) => {
      let va = a[sortKey] ?? a.report_data?.scores?.[sortKey] ?? 0;
      let vb = b[sortKey] ?? b.report_data?.scores?.[sortKey] ?? 0;
      if (sortKey==='created_at') { va=new Date(va); vb=new Date(vb); }
      return sortDir==='asc' ? (va>vb?1:-1) : (va<vb?1:-1);
    });
    return d;
  }, [data, search, filterProfile, filterValidity, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const Arrow = ({ k }) => sortKey===k ? (sortDir==='desc'?' ↓':' ↑') : '';

  return (
    <div className="dash-anim">
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
        <input className="search-inp" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name, email, role…"
          style={{ flex:1, minWidth:'200px', padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', transition:'all 0.2s' }} />
        <select className="filter-select" value={filterProfile} onChange={e=>setFP(e.target.value)}
          style={{ padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
          <option value="">All Profiles</option>
          {profiles.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={filterValidity} onChange={e=>setFV(e.target.value)}
          style={{ padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
          <option value="">All Validity</option>
          <option value="green">Valid</option>
          <option value="amber">Caution</option>
          <option value="red">Flagged</option>
        </select>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>{filtered.length} result{filtered.length!==1?'s':''}</div>
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
           <thead>
              <tr style={{ borderBottom:`2px solid ${T.b2}` }}>
                {[
                  { l:'Name', k:'name' }, { l:'Type', k:'assessment_type' },
                  { l:'Email', k:'email' }, { l:'Phone', k:'phone' },
                  { l:'Batch', k:'batch' }, { l:'Role', k:'role' },
                  { l:'Score', k:'overall_score' }, { l:'Profile', k:'profile_name' },
                { l:'Validity', k:null }, { l:'Evid.', k:null }, { l:'Date', k:'created_at' }, { l:'', k:null },
                ].map(({ l, k }) => (
                  <th key={l} className={k?'sort-th':''} onClick={()=>k&&toggleSort(k)}
                    style={{ padding:'10px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:sortKey===k?T.t0:T.t3, fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap' }}>
                    {l}{k?<Arrow k={k} />:''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i) => (
                <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'700', color:T.t0, whiteSpace:'nowrap' }}>{r.name}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600', whiteSpace:'nowrap' }}>{(r.batch || r.report_data?.respondent?.batch) ? '🏢 Org' : '👤 Ind'}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.email}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600', whiteSpace:'nowrap' }}>{r.phone || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600', whiteSpace:'nowrap' }}>{r.batch || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}</td>
                  <td style={{ padding:'12px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.c, fontWeight:'700', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.profile_name}</td>
                 <td style={{ padding:'12px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
                  <td style={{ padding:'12px 14px', textAlign:'center' }}>
                    {localStorage.getItem(`core_ev_${r.doc_id}`) && Object.keys(JSON.parse(localStorage.getItem(`core_ev_${r.doc_id}`)||'{}')).length > 0 ? '📎' : '—'}
                  </td>
                  <td style={{ padding:'12px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.t3, fontWeight:'600', whiteSpace:'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button className="action-btn" onClick={e=>{e.stopPropagation();onSelect(r);}} style={{ padding:'5px 12px', borderRadius:'4px', border:'none', background:T.c, color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700', cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap' }}>View →</button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={9} style={{ padding:'40px', textAlign:'center', color:T.t3, fontSize:'13px', fontWeight:'600' }}>No candidates match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ScoresTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (!total) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No data available.</div>;

  const avgComp = COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
    const avg = Math.round(data.reduce((s,r)=>s+(r.report_data?.CI?.[k]||r.report_data?.scores?.[k]||0),0)/total);
    return { k, l, avg, green, amber };
  });
  const avgMod = MODULE_KEYS.map(({ k, l, c }) => {
    const avg = Math.round(data.reduce((s,r)=>s+(r.report_data?.scores?.[k]||0),0)/total);
    return { k, l, avg, c };
  });
  const leaders = [...data].sort((a,b)=>b.overall_score-a.overall_score).slice(0,5);
  const atRisk  = data.filter(r => COMPOSITE_KEYS.some(({ k, amber }) => (r.report_data?.CI?.[k]||r.report_data?.scores?.[k]||0)<amber)).slice(0,5);

  return (
    <div>
      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim">
        <SectionHead label="Cohort Composite Index Averages" T={T} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px' }}>
          {avgComp.map(({ k, l, avg, green, amber }) => {
            const col = bCol(avg,T);
            return (
              <div key={k} style={{ background:T.bg2, borderRadius:'8px', padding:'14px 10px', textAlign:'center', border:`1px solid ${col}25` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px', fontWeight:'700', lineHeight:'1.4' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:col, fontWeight:'700', lineHeight:'1' }}>{avg}</div>
                <div style={{ height:'3px', background:T.b1, borderRadius:'2px', overflow:'hidden', margin:'6px 4px 4px' }}>
                  <div style={{ width:`${avg}%`, height:'100%', background:barGrad(avg), transition:'width 0.8s ease' }} />
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:col, fontWeight:'700' }}>
                  {avg>=green?'Low Risk':avg>=amber?'Moderate':'High Risk'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim-2">
        <SectionHead label="Module Score Averages" T={T} />
        {avgMod.map(({ k, l, avg, c }) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
            <div style={{ width:'200px', fontSize:'12px', color:T.t1, fontWeight:'700', flexShrink:0 }}>{l}</div>
            <div style={{ flex:1, height:'7px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ width:`${avg}%`, height:'100%', background:c, transition:'width 0.8s ease' }} />
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'13px', color:c, fontWeight:'700', width:'36px', textAlign:'right' }}>{avg}</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', width:'55px' }}>{bd(avg)}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }} className="dash-anim-3">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gn, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Top Performers</div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.b2}` }}>
              {['Name','Score','CII','LRS'].map(h=><th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {leaders.map((r,i) => (
                <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, marginRight:'8px', fontWeight:'700' }}>#{i+1}</span>{r.name}
                  </td>
                  <td style={{ padding:'10px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(r.report_data?.CI?.CII||0,T), fontWeight:'700' }}>{r.report_data?.CI?.CII||'—'}</td>
                  <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(r.report_data?.CI?.LRS||0,T), fontWeight:'700' }}>{r.report_data?.CI?.LRS||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.rd, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>At-Risk Candidates</div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.b2}` }}>
              {['Name','Score','Flagged Indices'].map(h=><th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {atRisk.map((r,i) => {
                const ci = r.report_data?.CI||{};
                const s  = r.report_data?.scores||{};
                const flagged = COMPOSITE_KEYS.filter(({ k, amber })=>(ci[k]||s[k]||0)<amber).map(({ k })=>k);
                return (
                  <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                    <td style={{ padding:'10px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                        {flagged.map(k=><Pill key={k} label={k} color={T.rd} style={{ fontSize:'8px', padding:'2px 7px' }} />)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {atRisk.length===0 && <tr><td colSpan={3} style={{ padding:'24px 14px', fontSize:'12px', color:T.gn, fontWeight:'700', textAlign:'center' }}>No at-risk candidates.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ValidityTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (!total) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No data available.</div>;

  const byStatus = {
    green: data.filter(r=>r.report_data?.validity?.overall==='green'),
    amber: data.filter(r=>r.report_data?.validity?.overall==='amber'),
    red:   data.filter(r=>r.report_data?.validity?.overall==='red'),
  };
  const avgCon    = Math.round(data.reduce((s,r)=>s+(r.report_data?.validity?.conScore||0),0)/total);
  const avgLScale = (data.reduce((s,r)=>s+(r.report_data?.validity?.lAgree||0),0)/total).toFixed(1);
  const avgExt    = Math.round(data.reduce((s,r)=>s+((r.report_data?.validity?.extRatio||0)*100),0)/total);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }} className="dash-anim">
        {[
          { n:`${byStatus.green.length}/${total}`, l:'Valid Results',      sub:'Green validity',                  c:T.gn },
          { n:`${byStatus.amber.length}`,          l:'Caution Flagged',    sub:'Amber — interpret carefully',     c:T.am },
          { n:`${byStatus.red.length}`,            l:'High-Risk Flagged',  sub:'Require verification interview',  c:T.rd },
          { n:`${avgCon}/100`,                     l:'Avg Consistency',    sub:'Internal consistency score',      c:bCol(avgCon,T) },
        ].map((s,i) => (
          <div key={i} className="metric-card" style={{ background:T.bg1, border:`1px solid ${s.c}28`, borderRadius:'10px', padding:'18px', borderTop:`3px solid ${s.c}` }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:s.c, fontWeight:'700', lineHeight:'1', marginBottom:'4px' }}>{s.n}</div>
            <div style={{ fontSize:'11px', fontWeight:'700', color:T.t1, marginBottom:'2px' }}>{s.l}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim-2">
        <SectionHead label="Cohort Validity Metrics" T={T} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
          {[
            { l:'Avg L-Scale Agreements',    v:`${avgLScale}/10`, sub:'< 4 is acceptable', c:parseFloat(avgLScale)<4?T.gn:T.rd },
            { l:'Avg Extreme Response Rate',  v:`${avgExt}%`,      sub:'< 70% expected',   c:avgExt<70?T.gn:T.am },
            { l:'Avg Internal Consistency',   v:`${avgCon}/100`,   sub:'≥ 75 is reliable', c:bCol(avgCon,T) },
          ].map(({ l, v, sub, c }) => (
            <div key={l} style={{ background:T.bg2, borderRadius:'8px', padding:'16px', border:`1px solid ${c}28` }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px', fontWeight:'700' }}>{l}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:c, fontWeight:'700', marginBottom:'3px' }}>{v}</div>
              <div style={{ fontSize:'10px', color:T.t3, fontWeight:'600' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }} className="dash-anim-3">
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}` }}>
          <SectionHead label="All Candidates — Validity Detail" T={T} />
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
            <thead><tr style={{ borderBottom:`2px solid ${T.b2}` }}>
              {['Name','Status','L-Scale','Strongly Agree %','Extreme %','Consistency','Decision'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[...data].sort((a,b) => {
                const order = { red:0, amber:1, green:2 };
                return (order[a.report_data?.validity?.overall]||2)-(order[b.report_data?.validity?.overall]||2);
              }).map((r,i) => {
                const v = r.report_data?.validity||{};
                const dec = v.overall==='green'?'Proceed':v.overall==='amber'?'Caution':'Verify First';
                const decCol = v.overall==='green'?T.gn:v.overall==='amber'?T.am:T.rd;
                return (
                  <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                    <td style={{ padding:'10px 14px' }}><ValidityDot overall={v.overall} T={T} /></td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:v.lAgree>=6?T.rd:v.lAgree>=4?T.am:T.gn, fontWeight:'700' }}>{v.lAgree??'—'}/10</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:T.t2, fontWeight:'600' }}>{Math.round((v.saRatio||0)*100)}%</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:(v.extRatio||0)>0.7?T.am:T.t2, fontWeight:'700' }}>{Math.round((v.extRatio||0)*100)}%</td>
                    <td style={{ padding:'10px 14px' }}>
                      <MiniBar score={v.conScore||0} w={70} h={5} />
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:bCol(v.conScore||0,T), fontWeight:'700', marginLeft:'8px' }}>{v.conScore}</span>
                    </td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:decCol, fontWeight:'800' }}>{dec}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const IndustryTab = ({ data, T, onSelect }) => {
  const [selectedInd, setSelectedInd] = useState(null);
  const industries = {};
  data.forEach(r=>{ const ind=r.industry||'Unspecified'; if(!industries[ind]) industries[ind]=[]; industries[ind].push(r); });
  const indList = Object.entries(industries).sort((a,b)=>b[1].length-a[1].length);
  const selectedCandidates = selectedInd ? (industries[selectedInd]||[]) : [];

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'16px' }} className="dash-anim">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Industries ({indList.length})</div>
          </div>
          <div style={{ overflowY:'auto', maxHeight:'500px' }}>
            {indList.map(([ind, recs]) => {
              const avg = Math.round(recs.reduce((s,r)=>s+Number(r.overall_score),0)/recs.length);
              const isSel = selectedInd===ind;
              return (
                <button key={ind} onClick={()=>setSelectedInd(isSel?null:ind)} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  width:'100%', padding:'12px 18px', textAlign:'left',
                  background:isSel?`${T.c}16`:'transparent', border:'none',
                  borderBottom:`1px solid ${T.b1}`,
                  borderLeft:isSel?`3px solid ${T.c}`:`3px solid transparent`,
                  cursor:'pointer',
                }}
                onMouseOver={e=>{ if(!isSel) e.currentTarget.style.background=T.b0; }}
                onMouseOut={e=>{ if(!isSel) e.currentTarget.style.background='transparent'; }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:isSel?T.c:T.t1, maxWidth:'180px', lineHeight:'1.4' }}>{ind}</div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'3px', flexShrink:0 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.t3, fontWeight:'600' }}>{recs.length} assessed</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(avg,T), fontWeight:'700' }}>avg {avg}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!selectedInd ? (
            <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'60px 40px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:T.t3, fontWeight:'600', marginBottom:'8px' }}>Select an Industry</div>
              <div style={{ fontSize:'12px', color:T.t3, fontWeight:'600' }}>Click any industry to see detailed breakdowns and candidate profiles.</div>
            </div>
          ) : (
            <div>
              <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'12px' }}>
                <SectionHead label="Industry Analysis" T={T} />
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:T.t0, fontWeight:'700', marginBottom:'12px' }}>{selectedInd}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                  {[
                    [selectedCandidates.length,'Candidates'],
                    [Math.round(selectedCandidates.reduce((s,r)=>s+Number(r.overall_score),0)/selectedCandidates.length),'Avg Overall'],
                    [selectedCandidates.filter(r=>r.overall_score>=75).length,'High Potential'],
                    [selectedCandidates.filter(r=>r.report_data?.validity?.overall==='red').length,'Flagged'],
                  ].map(([n,l],i) => (
                    <div key={i} style={{ background:T.bg2, borderRadius:'7px', padding:'12px', textAlign:'center' }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:T.gold, fontWeight:'700' }}>{n}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'3px', fontWeight:'600' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
                <div style={{ padding:'12px 18px', borderBottom:`1px solid ${T.b2}` }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Candidates in this Sector</div>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ borderBottom:`1px solid ${T.b2}` }}>
                    {['Name','Role','Score','Profile','Validity'].map(h=><th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {selectedCandidates.map((r,i) => (
                      <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                        <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                        <td style={{ padding:'10px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}</td>
                        <td style={{ padding:'10px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                        <td style={{ padding:'10px 14px', fontSize:'11px', color:T.c, fontWeight:'700' }}>{r.profile_name}</td>
                        <td style={{ padding:'10px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROOT DASHBOARD
// ═══════════════════════════════════════════════════════════════
// ═══ ADMIN AUTH + ACCESS PANEL + NOTIFICATIONS ═══════════════════════════════
const API_BASE = 'https://core-by-carnelian-backend.onrender.com';
const getAdminToken = () => { try { return localStorage.getItem('core_admin_token') || ''; } catch(e) { return ''; } };
const setAdminToken = (t) => { try { t ? localStorage.setItem('core_admin_token', t) : localStorage.removeItem('core_admin_token'); } catch(e) {} };
const authHeaders = () => ({ 'Authorization': 'Bearer ' + getAdminToken() });

const REPORT_DEFS = [
  { k:'action',  l:'Candidate Action Plan', lockP:true,  lockNote:'Always included' },
  { k:'persona', l:'Persona Report',        lockP:true,  lockNote:'Always included' },
  { k:'player',  l:'Player Report (Gamified)' },
  { k:'tech',    l:'Technical Report' },
  { k:'team',    l:'Team Insight Report',   noP:true,    lockNote:'Admin only, forwarded to HR by you' },
  { k:'culture', l:'Culture Pulse Report',  noP:true,    lockNote:'Admin only, forwarded to HR by you' },
];
const DEFAULT_ENT = () => ({ action:{admin:true,participant:true}, persona:{admin:true,participant:true}, player:{admin:true,participant:false}, tech:{admin:true,participant:false}, team:{admin:true,participant:false}, culture:{admin:true,participant:false} });

const AdminLogin = ({ T, onSuccess }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const doLogin = async () => {
    if (!pw) return;
    setBusy(true); setErr('');
    try {
      const r = await fetch(`${API_BASE}/api/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password: pw }) });
      const j = await r.json();
      if (j.success && j.token) { setAdminToken(j.token); onSuccess(); }
      else setErr(j.message || 'Login failed.');
    } catch(e) { setErr('Could not reach the server.'); }
    setBusy(false);
  };
  return (
    <div style={{ minHeight:'100vh', background:T.bg0, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'380px', background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'14px', padding:'36px 32px', textAlign:'center' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>CORE Command</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:'700', marginBottom:'26px' }}>Admin access only</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Admin password"
          style={{ width:'100%', padding:'12px 14px', borderRadius:'8px', border:`1px solid ${T.b2}`, background:T.bg2, color:T.t0, fontSize:'14px', fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none', marginBottom:'12px', boxSizing:'border-box' }} />
        {err && <div style={{ fontSize:'11px', color:T.rd, fontWeight:'700', marginBottom:'10px' }}>{err}</div>}
        <button onClick={doLogin} disabled={busy} style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'none', cursor:'pointer', background:T.c, color:'#fff', fontSize:'13px', fontWeight:'800', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          {busy ? 'Checking…' : 'Unlock Dashboard'}
        </button>
      </div>
    </div>
  );
};

const NotificationBell = ({ T }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const load = () => {
    fetch(`${API_BASE}/api/notifications`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => Array.isArray(d) && setItems(d))
      .catch(() => {});
  };
  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);
  const unread = items.filter(i => !i.is_read).length;
  const markAll = () => {
    fetch(`${API_BASE}/api/notifications/read`, { method:'PATCH', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body:'{}' })
      .then(() => setItems(items.map(i => ({ ...i, is_read: true }))))
      .catch(() => {});
  };
  return (
    <div style={{ position:'relative' }}>
      <button onClick={()=>setOpen(o=>!o)} title="Notifications" style={{ position:'relative', padding:'6px 12px', borderRadius:'5px', border:`1px solid ${T.b2}`, background:T.bg2, color:T.t1, cursor:'pointer', fontSize:'14px' }}>
        🔔
        {unread > 0 && <span style={{ position:'absolute', top:'-6px', right:'-6px', minWidth:'17px', height:'17px', padding:'0 4px', borderRadius:'9px', background:T.rd, color:'#fff', fontSize:'9.5px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace" }}>{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'42px', width:'360px', maxHeight:'440px', overflowY:'auto', background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', boxShadow:'0 20px 50px rgba(0,0,0,0.45)', zIndex:200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderBottom:`1px solid ${T.b2}`, position:'sticky', top:0, background:T.bg1 }}>
            <span style={{ fontSize:'11px', fontWeight:'800', color:T.t0, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'JetBrains Mono',monospace" }}>Notifications</span>
            {unread > 0 && <button onClick={markAll} style={{ fontSize:'10px', fontWeight:'700', color:T.gold, background:'transparent', border:'none', cursor:'pointer' }}>Mark all read</button>}
          </div>
          {items.length === 0 && <div style={{ padding:'24px', fontSize:'12px', color:T.t3, textAlign:'center' }}>Nothing yet.</div>}
          {items.map(nf => (
            <div key={nf.id} style={{ padding:'11px 14px', borderBottom:`1px solid ${T.b1}`, background: nf.is_read ? 'transparent' : `${T.gold}12` }}>
              <div style={{ display:'flex', gap:'8px', alignItems:'baseline' }}>
                <span style={{ fontSize:'12px' }}>{nf.type === 'evidence' ? '📎' : '📥'}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:T.t0 }}>{nf.title}</div>
                  <div style={{ fontSize:'11px', color:T.t2, marginTop:'2px' }}>{nf.body}</div>
                  <div style={{ fontSize:'9px', color:T.t3, marginTop:'3px', fontFamily:"'JetBrains Mono',monospace" }}>{new Date(nf.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AccessPanelTab = ({ T }) => {
  const [batches, setBatches] = useState([]);
  const [org, setOrg] = useState('');
  const [ent, setEnt] = useState(DEFAULT_ENT());
  const [creating, setCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch(`${API_BASE}/api/batches`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => Array.isArray(d) && setBatches(d))
      .catch(() => {});
  };
  useEffect(load, []);

  const toggle = (state, setState, k, col) => {
    const def = REPORT_DEFS.find(r => r.k === k);
    if (col === 'participant' && (def.lockP || def.noP)) return;
    setState(prev => ({ ...prev, [k]: { ...prev[k], [col]: !prev[k][col] } }));
  };

  const create = async () => {
    if (!org.trim()) { setMsg('Enter an organisation name first.'); return; }
    setCreating(true); setMsg(''); setCreatedCode(null);
    try {
      const r = await fetch(`${API_BASE}/api/batches`, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify({ org: org.trim(), entitlements: ent }) });
      const j = await r.json();
      if (j.success) { setCreatedCode(j.data.code); setOrg(''); setEnt(DEFAULT_ENT()); load(); }
      else setMsg(j.message || 'Failed to create batch.');
    } catch(e) { setMsg('Could not reach the server.'); }
    setCreating(false);
  };

  const saveEdit = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/batches/${encodeURIComponent(editing.code)}`, { method:'PATCH', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify({ entitlements: editing.entitlements }) });
      const j = await r.json();
      if (j.success) { setEditing(null); load(); }
    } catch(e) {}
  };

  const setStatus = async (code, status) => {
    try {
      await fetch(`${API_BASE}/api/batches/${encodeURIComponent(code)}`, { method:'PATCH', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify({ status }) });
      load();
    } catch(e) {}
  };

  const EntGrid = ({ value, onToggle }) => (
    <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'16px' }}>
      <thead>
        <tr>
          {['Report', 'Generated for admin', 'Visible to participant'].map(h => (
            <th key={h} style={{ textAlign:'left', padding:'8px 10px', fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:"'JetBrains Mono',monospace", borderBottom:`1px solid ${T.b2}` }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {REPORT_DEFS.map(rd => (
          <tr key={rd.k} style={{ borderBottom:`1px solid ${T.b1}` }}>
            <td style={{ padding:'9px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{rd.l}</td>
            <td style={{ padding:'9px 10px' }}>
              <input type="checkbox" checked={!!value[rd.k]?.admin} onChange={()=>onToggle(rd.k, 'admin')} style={{ cursor:'pointer', width:'15px', height:'15px', accentColor:T.gold }} />
            </td>
            <td style={{ padding:'9px 10px' }}>
              {(rd.lockP || rd.noP)
                ? <span style={{ fontSize:'10px', color:T.t3, fontWeight:'700' }}>{rd.lockP ? '✓ ' : '🔒 '}{rd.lockNote}</span>
                : <input type="checkbox" checked={!!value[rd.k]?.participant} onChange={()=>onToggle(rd.k, 'participant')} style={{ cursor:'pointer', width:'15px', height:'15px', accentColor:T.gold }} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px', marginBottom:'24px' }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>Register a new organisation batch</h3>
        <p style={{ fontSize:'12px', color:T.t2, marginBottom:'18px', lineHeight:'1.6' }}>The batch code is generated automatically (fiscal quarter, resets each quarter) and is guaranteed not to clash with any existing batch. Participants must enter this exact code to take the assessment.</p>
        <label style={{ display:'block', fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:'700', marginBottom:'6px', fontFamily:"'JetBrains Mono',monospace" }}>Organisation Name</label>
        <input value={org} onChange={e=>setOrg(e.target.value)} placeholder="e.g. Habib Bank Limited"
          style={{ width:'100%', maxWidth:'420px', padding:'11px 13px', borderRadius:'8px', border:`1px solid ${T.b2}`, background:T.bg2, color:T.t0, fontSize:'13px', outline:'none', marginBottom:'18px', boxSizing:'border-box', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
        <EntGrid value={ent} onToggle={(k,col)=>toggle(ent, setEnt, k, col)} />
        {msg && <div style={{ fontSize:'11px', color:T.rd, fontWeight:'700', marginBottom:'10px' }}>{msg}</div>}
        <button onClick={create} disabled={creating} style={{ padding:'12px 26px', borderRadius:'8px', border:'none', cursor:'pointer', background:T.c, color:'#fff', fontSize:'13px', fontWeight:'800', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          {creating ? 'Generating code…' : '+ Create Batch'}
        </button>
        {createdCode && (
          <div style={{ marginTop:'16px', padding:'16px 20px', background:`${T.gn}18`, border:`1px solid ${T.gn}`, borderRadius:'10px', display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'12px', color:T.t1, fontWeight:'700' }}>Batch created. Share this code with the organisation:</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'18px', fontWeight:'800', color:T.gn, letterSpacing:'0.08em' }}>{createdCode}</span>
            <button onClick={()=>navigator.clipboard && navigator.clipboard.writeText(createdCode)} style={{ padding:'6px 12px', borderRadius:'6px', border:`1px solid ${T.b2}`, background:T.bg2, color:T.t1, cursor:'pointer', fontSize:'10px', fontWeight:'700' }}>Copy</button>
          </div>
        )}
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px' }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:'700', color:T.t0, marginBottom:'16px' }}>Registered batches</h3>
        {batches.length === 0 && <div style={{ fontSize:'12px', color:T.t3 }}>No batches registered yet. Legacy batches that only exist inside assessment records will keep working for report generation, but new submissions require a registered code.</div>}
        {batches.length > 0 && (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Code', 'Organisation', 'Responses', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 10px', fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:"'JetBrains Mono',monospace", borderBottom:`1px solid ${T.b2}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.code} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'10px', fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', fontWeight:'800', color:T.gold }}>{b.code}</td>
                  <td style={{ padding:'10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{b.org}</td>
                  <td style={{ padding:'10px', fontSize:'12px', color:T.t1, fontFamily:"'JetBrains Mono',monospace" }}>{b.responses}</td>
                  <td style={{ padding:'10px' }}>
                    <span style={{ fontSize:'10px', fontWeight:'800', color: b.status === 'active' ? T.gn : T.rd, textTransform:'uppercase', letterSpacing:'0.08em' }}>{b.status}</span>
                  </td>
                  <td style={{ padding:'10px', fontSize:'11px', color:T.t3 }}>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td style={{ padding:'10px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    <button onClick={()=>setEditing({ code: b.code, entitlements: { ...DEFAULT_ENT(), ...(b.entitlements || {}) } })} style={{ padding:'5px 10px', borderRadius:'5px', border:`1px solid ${T.b2}`, background:T.bg2, color:T.t1, cursor:'pointer', fontSize:'10px', fontWeight:'700' }}>Edit access</button>
                    <button onClick={()=>setStatus(b.code, b.status === 'active' ? 'closed' : 'active')} style={{ padding:'5px 10px', borderRadius:'5px', border:`1px solid ${b.status==='active' ? T.rd : T.gn}`, background:'transparent', color: b.status === 'active' ? T.rd : T.gn, cursor:'pointer', fontSize:'10px', fontWeight:'700' }}>
                      {b.status === 'active' ? 'Close' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }} onClick={()=>setEditing(null)}>
          <div style={{ width:'100%', maxWidth:'560px', background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:'700', color:T.t0, marginBottom:'16px' }}>Edit access · <span style={{ fontFamily:"'JetBrains Mono',monospace", color:T.gold }}>{editing.code}</span></h3>
            <EntGrid value={editing.entitlements} onToggle={(k,col)=>{
              const def = REPORT_DEFS.find(r => r.k === k);
              if (col === 'participant' && (def.lockP || def.noP)) return;
              setEditing(prev => ({ ...prev, entitlements: { ...prev.entitlements, [k]: { ...prev.entitlements[k], [col]: !prev.entitlements[k][col] } } }));
            }} />
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button onClick={()=>setEditing(null)} style={{ padding:'10px 18px', borderRadius:'7px', border:`1px solid ${T.b2}`, background:'transparent', color:T.t1, cursor:'pointer', fontSize:'12px', fontWeight:'700' }}>Cancel</button>
              <button onClick={saveEdit} style={{ padding:'10px 18px', borderRadius:'7px', border:'none', background:T.c, color:'#fff', cursor:'pointer', fontSize:'12px', fontWeight:'800' }}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [assessments, setAssessments]    = useState([]);
  const [loading, setLoading]            = useState(true);
  const [error, setError]                = useState(null);
  const [activeTab, setActiveTab]        = useState('overview');
  const [selectedCandidate, setSelected] = useState(null);
 const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('themeMode')||'dark'; } catch(e) { return 'dark'; }
  });
  const [authed, setAuthed] = useState(() => !!getAdminToken());
  const [batches, setBatches] = useState([]);

  const T = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('https://core-by-carnelian-backend.onrender.com/api/assessments', { headers: authHeaders() })
      .then(res=>{
        if(res.status === 401) { setAdminToken(''); setAuthed(false); throw new Error('Session expired'); }
        if(!res.ok) throw new Error('API error'); return res.json();
      })
      .then(data=>{ setAssessments(data); setLoading(false); })
      .catch(err=>{ console.error(err); setError(err.message === 'Session expired' ? null : 'Failed to connect to the database.'); setLoading(false); });
    fetch(`${API_BASE}/api/batches`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => Array.isArray(d) && setBatches(d))
      .catch(() => {});
  }, [authed]);

  const TAB_COMPONENTS = {
    overview: <OverviewTab data={assessments} T={T} onSelect={setSelected} />,
    profiles: <ProfilesTab data={assessments} T={T} onSelect={setSelected} />,
    scores:   <ScoresTab   data={assessments} T={T} onSelect={setSelected} />,
    validity: <ValidityTab data={assessments} T={T} onSelect={setSelected} />,
    industry: <IndustryTab data={assessments} T={T} onSelect={setSelected} />,
    access:   <AccessPanelTab T={T} />,
  };

 if (!authed) return (
    <>
      <DashStyles T={T} />
      <AdminLogin T={T} onSuccess={()=>setAuthed(true)} />
    </>
  );

  return (
    <>
      <DashStyles T={T} />
      <div style={{ display:'flex', minHeight:'100vh', background:T.bg0, position:'relative' }}>
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          backgroundImage:`linear-gradient(${T.gridColor} 1px,transparent 1px),linear-gradient(90deg,${T.gridColor} 1px,transparent 1px)`,
          backgroundSize:`${T.gridSize} ${T.gridSize}`,
        }} />

        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} T={T} total={assessments.length} />

        <div className="main-content" style={{ flex:1, marginLeft:0, display:'flex', flexDirection:'column', position:'relative', zIndex:1, overflow:'hidden' }}>
          <header style={{
            height:'60px', background:`${T.bg0}EE`, backdropFilter:'blur(16px)',
            borderBottom:`1px solid ${T.b2}`,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 28px', flexShrink:0, position:'sticky', top:0, zIndex:50,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:'700', color:T.t0 }}>
                {TABS.find(t=>t.id===activeTab)?.label}
              </div>
              {loading && (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.am, animation:'blink 1s infinite', display:'inline-block' }} />
                  Loading…
                </div>
              )}
              {error && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.am, fontWeight:'700' }}>{error}</div>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <NotificationBell T={T} />
              <Pill label={`${assessments.length} records`} color={T.gold} />
              <button onClick={()=>{ setAdminToken(''); setAuthed(false); }} title="Log out" style={{
                padding:'6px 12px', borderRadius:'5px', border:`1px solid ${T.b2}`,
                background:'transparent', color:T.t3, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700',
              }}>Log out</button>
              <button onClick={()=>setMode(m=>m==='dark'?'light':'dark')} style={{
                padding:'6px 14px', borderRadius:'5px', border:`1px solid ${T.b2}`,
                background:T.bg2, color:T.t1, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700',
              }}>{mode==='dark'?'☀ Light':'◑ Dark'}</button>
            </div>
          </header>

          <main style={{ flex:1, overflow:'auto', padding:'24px 28px' }}>
            {loading
              ? <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px', flexDirection:'column', gap:'12px' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:T.t2, fontWeight:'600' }}>Loading assessment data…</div>
                  <div style={{ width:'200px', height:'3px', background:T.b1, borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ height:'100%', background:`linear-gradient(90deg,${T.c},${T.gold})`, animation:'shimmer 1.5s infinite', backgroundSize:'200% 100%', borderRadius:'2px' }} />
                  </div>
                </div>
              : TAB_COMPONENTS[activeTab]
            }
          </main>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={()=>setSelected(null)}
          T={T}
          allData={assessments}
          batches={batches}
        />
      )}
    </>
  );
}