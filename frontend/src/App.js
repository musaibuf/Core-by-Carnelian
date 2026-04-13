import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
let T = {};

const darkTheme = {
  c:     '#B01C24',
  cDark: '#8A1018',
  cDeep: '#6B0E13',
  cGlow: 'rgba(176,28,36,0.18)',
  cHalo: 'rgba(176,28,36,0.09)',
  gold:  '#C8A84B',
  goldD: '#A07830',
  goldP: 'rgba(200,168,75,0.12)',
  bg0:   '#0A0808',
  bg1:   '#111010',
  bg2:   '#181414',
  bg3:   '#201818',
  bg4:   '#281E1E',
  b0:    'rgba(255,255,255,0.06)',
  b1:    'rgba(255,255,255,0.10)',
  b2:    'rgba(255,255,255,0.16)',
  bC:    'rgba(176,28,36,0.40)',
  t0:    '#FFFFFF',
  t1:    '#F5F5F5',
  t2:    '#E0E0E0',
  t3:    '#BDBDBD',
  gn:    '#22c55e',
  gnP:   'rgba(34,197,94,0.14)',
  am:    '#f59e0b',
  amP:   'rgba(245,158,11,0.14)',
  rd:    '#ef4444',
  rdP:   'rgba(239,68,68,0.14)',
  gridColor: 'rgba(255,255,255,0.07)',
  gridSize: '72px',
};

const lightTheme = {
  c:     '#B01C24',
  cDark: '#8A1018',
  cDeep: '#6B0E13',
  cGlow: 'rgba(176,28,36,0.10)',
  cHalo: 'rgba(176,28,36,0.05)',
  gold:  '#A07830',
  goldD: '#7A5C20',
  goldP: 'rgba(160,120,48,0.10)',
  bg0:   '#FFFFFF',
  bg1:   '#FAFAFA',
  bg2:   '#F4F4F4',
  bg3:   '#EEEEEE',
  bg4:   '#E8E8E8',
  b0:    'rgba(0,0,0,0.05)',
  b1:    'rgba(0,0,0,0.09)',
  b2:    'rgba(0,0,0,0.16)',
  bC:    'rgba(176,28,36,0.30)',
  t0:    '#0A0808',
  t1:    '#1A1414',
  t2:    '#3D3030',
  t3:    '#6B5C5C',
  gn:    '#15803D',
  gnP:   'rgba(21,128,61,0.10)',
  am:    '#B45309',
  amP:   'rgba(180,83,9,0.10)',
  rd:    '#B91C1C',
  rdP:   'rgba(185,28,28,0.10)',
  gridColor: 'rgba(0,0,0,0.06)',
  gridSize: '72px',
};

// ─── FONTS ────────────────────────────────────────────────────────────────────
const Fonts = ({ mode }) => {
  const TT = mode === 'dark' ? darkTheme : lightTheme;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: ${TT.bg0};
        color: ${TT.t0};
        min-height: 100vh;
        overflow-x: hidden;
        transition: background 0.3s ease, color 0.3s ease;
        font-weight: 500;
      }

      /* Global grid overlay on body */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image:
          linear-gradient(${TT.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${TT.gridColor} 1px, transparent 1px);
        background-size: ${TT.gridSize} ${TT.gridSize};
        pointer-events: none;
        z-index: 0;
      }

      /* Noise grain for dark mode */
      body::after {
        content: '';
        position: fixed;
        inset: 0;
        background-image: ${
          mode === 'dark'
            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
            : 'none'
        };
        pointer-events: none;
        z-index: 0;
        opacity: ${mode === 'dark' ? '0.4' : '0'};
      }

      /* Everything above grid */
      nav, main, section, div:not(body > div) {
        position: relative;
        z-index: 1;
      }

      .serif  { font-family: 'Playfair Display', serif; font-weight: 600; }
      .mono   { font-family: 'JetBrains Mono', monospace; font-weight: 500; }
      .sans   { font-family: 'Plus Jakarta Sans', sans-serif; }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${TT.bg0}; }
      ::-webkit-scrollbar-thumb { background: ${TT.b2}; border-radius: 2px; }

      @keyframes fadeUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
      @keyframes scaleIn   { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      @keyframes slideUp   { from { opacity:0; transform:translateY(44px); } to { opacity:1; transform:translateY(0); } }
      @keyframes glow      { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      @keyframes shimmer   { from { background-position:-200% center; } to { background-position:200% center; } }
      @keyframes timerTick { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      @keyframes checkIn   { from { transform:scale(0); } to { transform:scale(1); } }
      @keyframes pulse     { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
      @keyframes blink     { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

      .anim-fadeUp  { animation: fadeUp  0.7s cubic-bezier(0.22,1,0.36,1) both; }
      .anim-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      .anim-slideUp { animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }

      @media (max-width: 900px) {
        .grid-5-col { grid-template-columns: repeat(3,1fr) !important; }
        .grid-6-col { grid-template-columns: repeat(3,1fr) !important; }
        .grid-3-col { grid-template-columns: 1fr 1fr !important; }
        .grid-2-col { grid-template-columns: 1fr !important; }
        .grid-4-col { grid-template-columns: 1fr 1fr !important; }
        .hero-title  { font-size: clamp(2.4rem,7vw,3.6rem) !important; }
        .hide-mobile { display: none !important; }
      }
      @media (max-width: 600px) {
        .grid-5-col { grid-template-columns: 1fr 1fr !important; }
        .grid-6-col { grid-template-columns: repeat(2,1fr) !important; }
        .grid-3-col { grid-template-columns: 1fr !important; }
        .grid-4-col { grid-template-columns: 1fr !important; }
        .section-pad { padding: 48px 20px !important; }
        .card-pad    { padding: 24px 20px !important; }
        .q-card-pad  { padding: 32px 24px !important; }
        .hero-title  { font-size: clamp(2rem,9vw,2.8rem) !important; }
        .nav-wrap    { padding: 0 16px !important; }
        .report-wrap { padding: 32px 16px !important; }
      }
      @media print {
        .no-print { display: none !important; }
      }
    `}</style>
  );
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const IND = {
  'Banking & Financial Services':{ short:'Banking & Finance', priority:['EO_RC','EO_AI','C','ES','OCB_Cn'], lens:`In banking, <strong>Ethical Orientation</strong> is the highest-stakes dimension. Regulatory compliance, fiduciary duty, and prudential standards demand authentic integrity. Low EO scores — especially in Rule Compliance and Authentic Integrity — carry material regulatory risk before placement in treasury, audit, or credit functions. <strong>Conscientiousness</strong> and <strong>Emotional Stability</strong> are the strongest performance predictors under regulatory scrutiny.`, hiPotential:`C ≥ 75, ES ≥ 70, EOavg ≥ 75, LAavg ≥ 65`, riskNote:`EO_RC or EO_AI below 50 → do not place in treasury, audit, or credit roles without mandatory ethics coaching.` },
  'Insurance & Takaful':{ short:'Insurance & Takaful', priority:['EO_T','EO_AI','C','A','CQ_K'], lens:`Insurance and Takaful require <strong>Conscientiousness</strong>, <strong>Agreeableness</strong>, and <strong>Transparent Ethics</strong>. Cultural Knowledge is critical where Shariah compliance and community trust are foundational. Low EO_T in underwriting or claims represents significant fraud risk.`, hiPotential:`A ≥ 70, C ≥ 72, EOavg ≥ 72`, riskNote:`Low EO_T in claims or underwriting → structured supervision before independent case handling.` },
  'Government & Civil Service':{ short:'Government / Civil Service', priority:['EO_RC','EO_AI','OCB_CV','C','CQ_K'], lens:`Pakistan's civil service has the highest social desirability inflation of any sector. <strong>Learning Agility</strong> is the strongest predictor of reform and policy role success yet the most under-measured in promotion systems. Traditional seniority-based promotion misses all four of CORE's most predictive dimensions.`, hiPotential:`BPS-18+: LAavg ≥ 65, CQavg ≥ 62, EOavg ≥ 75, C ≥ 70`, riskNote:`Social desirability inflation is significantly more common in hierarchical bureaucratic cultures.` },
  'FMCG & Consumer Goods':{ short:'FMCG / Consumer Goods', priority:['E','O','LA_MA','CQ_B','A'], lens:`FMCG depends on <strong>social confidence</strong> combined with <strong>adaptive thinking</strong> and cultural fluency to engage Pakistan's diverse consumer base — from boardroom to kiryana. <strong>CQ_B</strong> is critical because commercial professionals must be effective across every register of Pakistani social interaction.`, hiPotential:`E ≥ 70, LAavg ≥ 68, CQavg ≥ 65, O ≥ 68`, riskNote:`Low OCB_S in sales teams creates toxicity during high-pressure cycles.` },
  'Telecommunications & Technology':{ short:'Telecom & Technology', priority:['O','LA_MA','LA_RA','CQ_B','LA_CA'], lens:`Pakistan's tech sector requires the highest <strong>Learning Agility</strong> of any CORE sector. Technical knowledge depreciates rapidly. <strong>Openness</strong> and <strong>Results Agility</strong> are the strongest sustained performance predictors.`, hiPotential:`LAavg ≥ 75, O ≥ 72, LA_CA ≥ 70`, riskNote:`EO_T below 55 in data-handling roles represents data privacy risk.` },
  'Energy & Utilities':{ short:'Energy & Utilities', priority:['C','EO_RC','ES','LA_CA','OCB_Cn'], lens:`Energy and utilities demand exceptional <strong>procedural conscientiousness</strong> and <strong>safety-oriented ethics</strong>. EO_RC and Conscientiousness are highest-stakes where infrastructure failures carry public safety consequences.`, hiPotential:`C ≥ 78, ES ≥ 72, EOavg ≥ 72`, riskNote:`EO_RC below 50 in operational roles carries safety risk.` },
  'Healthcare & Pharmaceuticals':{ short:'Healthcare & Pharma', priority:['A','EO_ER','EO_RC','ES','C'], lens:`Healthcare requires extraordinary <strong>Agreeableness</strong>, <strong>Ethical Reasoning</strong>, and <strong>Emotional Stability</strong>. Cultural Knowledge is critical for engaging rural and vulnerable patient populations.`, hiPotential:`A ≥ 72, ES ≥ 72, EOavg ≥ 75, C ≥ 73`, riskNote:`EO_ER below 60 in patient-contact roles represents patient safety risk.` },
  'Manufacturing & Industrial':{ short:'Manufacturing & Industrial', priority:['C','EO_RC','OCB_Cn','ES','OCB_CO'], lens:`Manufacturing prizes <strong>procedural conscientiousness</strong>, <strong>rule compliance</strong>, and <strong>consistent citizenship</strong>. In export-oriented manufacturing, CQ is increasingly relevant for international buyer relationships.`, hiPotential:`C ≥ 78, ES ≥ 72, EOavg ≥ 70, OCB_Cn ≥ 72`, riskNote:`EO_RC below 50 in QA or safety roles carries product liability risk.` },
  'Development Sector & NGOs':{ short:'Development / NGOs', priority:['CQ_K','CQ_M','A','OCB_A','EO_ER'], lens:`The development sector requires the highest Cultural Intelligence of any CORE sector. The most common failure is low <strong>Conscientiousness</strong> — high-empathy professionals who struggle with M&E documentation and financial accountability.`, hiPotential:`CQavg ≥ 72, A ≥ 72, LAavg ≥ 65, EOavg ≥ 70`, riskNote:`Low EO_T in financial management is a fiduciary risk to funding relationships.` },
  'Education & Academia':{ short:'Education & Academia', priority:['A','O','LA_RA','OCB_CV','CQ_K'], lens:`Education professionals require strong <strong>Agreeableness</strong>, <strong>Openness</strong>, and <strong>Results Agility</strong>. Civic Virtue is a strong predictor of faculty quality and departmental health.`, hiPotential:`O ≥ 72, A ≥ 70, LAavg ≥ 70, OCB_CV ≥ 70`, riskNote:`EO_AI below 50 in faculty roles creates academic integrity risk.` },
  'Real Estate & Construction':{ short:'Real Estate & Construction', priority:['EO_RC','EO_T','C','LA_CA','OCB_CO'], lens:`Pakistan's construction sector has significant compliance challenges under RERA reform. <strong>Rule Compliance</strong> and <strong>Transparent Disclosure</strong> are the highest-stakes dimensions.`, hiPotential:`C ≥ 75, EOavg ≥ 70, LA_CA ≥ 65`, riskNote:`Low EO_RC or EO_T in procurement represents significant corruption risk.` },
  'Retail & Distribution':{ short:'Retail & Distribution', priority:['E','A','CQ_B','OCB_Cn','ES'], lens:`Retail requires <strong>social energy</strong> combined with <strong>cultural behavioural flexibility</strong> to engage Pakistan's diverse consumer segments. Agreeableness predicts customer relationship quality.`, hiPotential:`E ≥ 68, A ≥ 68, CQ_B ≥ 65, C ≥ 72`, riskNote:`Low OCB_S in retail creates team toxicity during peak seasons.` },
};

const QS = [
  {ch:'A',d:'C',r:false,t:"When assigned a task I find tedious, I complete it to the same standard as work I find genuinely engaging."},
  {ch:'A',d:'C',r:true,t:"In an average month, there are commitments I made that end up partially done or silently deprioritised."},
  {ch:'A',d:'O',r:false,t:"I proactively look for better approaches to work I have been doing the same way for a long time."},
  {ch:'A',d:'O',r:true,t:"I am more comfortable refining how things are done than proposing they be done completely differently."},
  {ch:'A',d:'C',r:false,t:"I hold myself to quality standards that go beyond what is formally required or likely to be inspected."},
  {ch:'A',d:'ES',r:false,t:"When I receive pointed criticism about something I worked hard on, I can hear and process it without becoming defensive."},
  {ch:'A',d:'ES',r:true,t:"A demanding period at work noticeably affects my mood and the quality of decisions I make."},
  {ch:'A',d:'O',r:false,t:"I find problems with no established solution more interesting than problems with clear, known answers."},
  {ch:'A',d:'L',r:false,t:"I have always given full effort to every task at work, regardless of how inconsequential or unnoticed it seemed.",validity:'L'},
  {ch:'A',d:'L',r:false,t:"I have never taken on a commitment at work that I privately doubted I could deliver on time.",validity:'L'},
  {ch:'A',d:'C',r:true,t:"I sometimes begin tasks later than I should and rely on the pressure of approaching deadlines to get things done."},
  {ch:'B',d:'E',r:false,t:"I find it easy to engage with people I have just met in a professional context, even in large or senior groups."},
  {ch:'B',d:'E',r:true,t:"After a day with significant social interaction at work, I typically need time alone to properly recharge."},
  {ch:'B',d:'A',r:false,t:"When a colleague challenges my position, my first instinct is to understand their reasoning rather than defend mine."},
  {ch:'B',d:'A',r:true,t:"I find it genuinely hard to concede in a professional disagreement, even when the counter-argument is sound."},
  {ch:'B',d:'OCB_A',r:false,t:"I voluntarily take on extra work to support a struggling colleague, even when my own schedule is already tight."},
  {ch:'B',d:'OCB_A',r:true,t:"I typically complete my own responsibilities fully before considering whether colleagues need support."},
  {ch:'B',d:'OCB_CO',r:false,t:"Before taking actions that affect my team's plans or workload, I consult relevant colleagues even when it is not required."},
  {ch:'B',d:'A',r:false,t:"When a colleague's idea is clearly better than mine, I acknowledge it openly — not just privately to myself."},
  {ch:'B',d:'L',r:false,t:"I have never, even for a moment, felt frustrated or resentful toward any colleague or manager I have ever worked with.",validity:'L'},
  {ch:'B',d:'L',r:false,t:"I have never taken any form of credit — even partially or accidentally — for work that was primarily a colleague's contribution.",validity:'L'},
  {ch:'B',d:'OCB_CO',r:false,t:"I share information with colleagues that may be relevant to their work, even when they have not specifically asked for it."},
  {ch:'C',d:'CQ_K',r:false,t:"I have a working understanding of how cultural background shapes how different colleagues approach hierarchy, communication, and relationships at work."},
  {ch:'C',d:'CQ_K',r:false,t:"I am aware of the key cultural differences — regional, religious, linguistic — that shape how people I work with approach professional norms."},
  {ch:'C',d:'CQ_K',r:true,t:"I often find cultural differences in the workplace more confusing or frustrating than enriching."},
  {ch:'C',d:'CQ_M',r:false,t:"I actively seek to work with people from cultural backgrounds different from my own — not just accept it when the situation requires it."},
  {ch:'C',d:'CQ_M',r:true,t:"I am most comfortable and effective in professional environments where most people share my own cultural background and norms."},
  {ch:'C',d:'CQ_M',r:false,t:"When a cross-cultural professional interaction goes poorly, I reflect on my own role in that before attributing it to the other person."},
  {ch:'C',d:'CQ_B',r:false,t:"I move naturally between formal and informal communication styles — or between direct and indirect approaches — depending on who I am dealing with."},
  {ch:'C',d:'CQ_B',r:false,t:"In unfamiliar professional or cultural contexts, I adjust my own approach rather than expecting others to adapt to me."},
  {ch:'C',d:'CQ_B',r:true,t:"I find it difficult to significantly alter my professional communication style for different audiences or cultural contexts."},
  {ch:'C',d:'L',r:false,t:"I have always treated every colleague with perfectly equal patience and respect, regardless of their personality, background, or how they treated me.",validity:'L'},
  {ch:'C',d:'L',r:false,t:"I have never, even privately, made an assumption about a colleague's professional competence based on their cultural or linguistic background.",validity:'L'},
  {ch:'D',d:'LA_MA',r:false,t:"I work effectively even when the expected outcome is unclear, the information is incomplete, and there is no established procedure to follow."},
  {ch:'D',d:'LA_MA',r:true,t:"My performance is noticeably stronger in structured, well-defined situations than in ambiguous or rapidly changing ones."},
  {ch:'D',d:'LA_PA',r:false,t:"After a professional setback or failure, my first priority is to examine what I personally could have done differently."},
  {ch:'D',d:'LA_PA',r:true,t:"When a professional situation goes wrong, I typically find that external factors or others' decisions were the primary cause."},
  {ch:'D',d:'LA_PA',r:false,t:"I actively invite critical feedback on my work — including from people who are likely to challenge my thinking."},
  {ch:'D',d:'LA_CA',r:false,t:"I routinely consider how my decisions and actions affect people and functions outside my immediate team."},
  {ch:'D',d:'LA_CA',r:true,t:"I tend to focus on solving the problem directly in front of me rather than exploring its broader systemic implications."},
  {ch:'D',d:'LA_RA',r:false,t:"I voluntarily update my professional knowledge through my own initiative — not only when formal training is scheduled."},
  {ch:'D',d:'LA_RA',r:true,t:"I prefer to build deeper expertise in areas I already know well rather than investing time in unfamiliar domains."},
  {ch:'D',d:'L',r:false,t:"I have never procrastinated on any work task, even briefly — I always begin immediately when something is assigned to me.",validity:'L'},
  {ch:'D',d:'L',r:false,t:"I genuinely look forward to receiving critical feedback on my work, regardless of who it comes from or how it is delivered.",validity:'L'},
  {ch:'E',d:'EO_RC',r:false,t:"I follow institutional policies and professional standards even when I know non-compliance will go completely unnoticed."},
  {ch:'E',d:'EO_RC',r:true,t:"When following a rule precisely would produce a clearly worse outcome, I use my own judgment to deviate from it."},
  {ch:'E',d:'EO_RC',r:false,t:"If I discovered a colleague clearly breaking an important rule, I would raise it appropriately — even at the risk of damaging our relationship."},
  {ch:'E',d:'EO_T',r:false,t:"I proactively disclose information others need to make good decisions, even when I am not formally required to share it."},
  {ch:'E',d:'EO_T',r:true,t:"I sometimes exercise my own judgment about what information stakeholders need to know rather than sharing everything by default."},
  {ch:'E',d:'EO_ER',r:false,t:"When facing an ethically ambiguous situation, I consult relevant guidelines, colleagues, or supervisors rather than acting purely on my own judgment."},
  {ch:'E',d:'EO_ER',r:false,t:"I actively consider the interests of people affected by my decisions who have no direct voice in the outcome."},
  {ch:'E',d:'EO_ER',r:true,t:"Under significant pressure to deliver results, I have sometimes made decisions I would not fully defend on purely ethical grounds."},
  {ch:'E',d:'EO_AI',r:false,t:"My professional behaviour is essentially the same whether I believe I am being observed and evaluated — or not."},
  {ch:'E',d:'L',r:false,t:"I have never, under any circumstances, allowed a personal relationship to influence a professional decision I made.",validity:'L'},
  {ch:'E',d:'L',r:false,t:"When colleagues come to me for advice, I always give them my honest assessment, even when I know it is not what they want to hear.",validity:'L'},
  {ch:'F',d:'OCB_CV',r:false,t:"I stay informed about developments in my organisation that go beyond the immediate scope of my role."},
  {ch:'F',d:'OCB_CV',r:false,t:"I participate in institutional improvement initiatives and processes, even when participation is entirely voluntary."},
  {ch:'F',d:'OCB_CV',r:true,t:"I generally limit my engagement to matters that directly relate to my formal job responsibilities."},
  {ch:'F',d:'OCB_S',r:false,t:"I can feel frustrated with institutional imperfections or management decisions without allowing it to affect how I treat my colleagues."},
  {ch:'F',d:'OCB_S',r:true,t:"I occasionally share my frustrations about workplace processes or leadership decisions with colleagues."},
  {ch:'F',d:'OCB_Cn',r:false,t:"I arrive reliably, manage my time well, and meet commitments in ways my colleagues can genuinely count on."},
  {ch:'F',d:'OCB_Cn',r:false,t:"I invest effort beyond the minimum required when the quality of the outcome matters for my colleagues or the institution."},
  {ch:'F',d:'EO_AI',r:false,t:"I would refuse an instruction I believed to be clearly unethical, even if compliance would have been professionally safer for me."},
  {ch:'F',d:'L',r:false,t:"I have never taken any form of credit — even partially or accidentally — for work that was primarily a colleague's contribution.",validity:'L'},
  {ch:'F',d:'L',r:false,t:"I have always spoken positively about every organisation I have ever worked for, even in private conversations with close friends.",validity:'L'},
  {ch:'F',d:'L',r:false,t:"In every team I have worked in, I have contributed at least as much as every other member.",validity:'L'},
];

const LKOPTS = [[1,'Strongly Disagree'],[2,'Disagree'],[3,'Neutral'],[4,'Agree'],[5,'Strongly Agree']];
const PARTNAMES = {A:'Work Style & Drive',B:'Working with Others',C:'Navigating Diversity',D:'Thinking & Adapting',E:'Professional Integrity',F:'Workplace Citizenship'};

const BREAKERS = {
  A:{title:'Section complete',msg:'Work style & drive assessed.',pct:17},
  B:{title:'Good progress',msg:'Interpersonal profile captured.',pct:33},
  C:{title:'Halfway there',msg:'Cultural intelligence module complete.',pct:50},
  D:{title:'Past the midpoint',msg:'Adaptive thinking recorded.',pct:67},
  E:{title:'Almost done',msg:'Integrity profile captured. One section left.',pct:83},
};

// ─── SCORING ──────────────────────────────────────────────────────────────────
const scoreDim = (dim, answers) => {
  const items = QS.map((q,i)=>({...q,ans:answers[i]})).filter(q=>q.d===dim&&!q.validity);
  if (!items.length) return 50;
  const vals = items.map(q => q.r ? (6-q.ans) : q.ans);
  return Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*20);
};

const computeValidity = (answers) => {
  const lItems = QS.map((q,i)=>({...q,ans:answers[i]})).filter(q=>q.validity==='L');
  const lAgree = lItems.filter(l=>l.ans>=4).length;
  const sa5 = answers.filter(a=>a===5).length;
  const saRatio = sa5/QS.length;
  const extCount = answers.filter(a=>a===1||a===5).length;
  const extRatio = extCount/QS.length;
  const dims=['C','O','ES','E','A','CQ_K','CQ_M','CQ_B','LA_MA','LA_PA','LA_CA','LA_RA','OCB_A','OCB_CO','OCB_CV','OCB_S','OCB_Cn','EO_RC','EO_T','EO_ER','EO_AI'];
  let conDiffs=[];
  dims.forEach(dim=>{
    const fwd=QS.map((q,i)=>({...q,ans:answers[i]})).filter(q=>q.d===dim&&!q.r&&!q.validity);
    const rev=QS.map((q,i)=>({...q,ans:answers[i]})).filter(q=>q.d===dim&&q.r&&!q.validity);
    if(fwd.length&&rev.length){
      const fMean=fwd.reduce((s,q)=>s+q.ans,0)/fwd.length;
      const rMean=rev.reduce((s,q)=>s+(6-q.ans),0)/rev.length;
      conDiffs.push(Math.abs(fMean-rMean));
    }
  });
  const avgConDiff=conDiffs.length?conDiffs.reduce((a,b)=>a+b,0)/conDiffs.length:0;
  const conScore=Math.max(0,Math.round(100-(avgConDiff/4)*100));
  const catastrophic=conScore<20&&extRatio>0.80;
  const flags=[];
  if(extRatio>0.80) flags.push({type:'red',key:'L-Scale',text:`${lAgree}/12 L-Scale agreements. With ${Math.round(extRatio*100)}% extreme responses this result is uninterpretable.`});
  else if(lAgree>=6) flags.push({type:'red',key:'L-Scale',text:`Likely inflated — agreed with ${lAgree}/12 impossible-standard items.`});
  else if(lAgree>=4) flags.push({type:'amber',key:'L-Scale',text:`Moderate inflation risk — ${lAgree}/12 L-scale items endorsed.`});
  else flags.push({type:'green',key:'L-Scale',text:`Valid — only ${lAgree}/12 L-scale items endorsed.`});
  if(saRatio>0.55) flags.push({type:'amber',key:'Acquiescence',text:`${Math.round(saRatio*100)}% Strongly Agree rate exceeds expected range.`});
  else flags.push({type:'green',key:'Acquiescence',text:`Natural response distribution at ${Math.round(saRatio*100)}% Strongly Agree.`});
  if(extRatio>0.90) flags.push({type:'red',key:'Extreme Responses',text:`CRITICAL: ${Math.round(extRatio*100)}% extreme responses — results statistically meaningless.`});
  else if(extRatio>0.80) flags.push({type:'red',key:'Extreme Responses',text:`${Math.round(extRatio*100)}% extreme responses — cannot interpret with confidence.`});
  else if(extRatio>0.70) flags.push({type:'amber',key:'Extreme Responses',text:`${Math.round(extRatio*100)}% extreme responses — above expected range.`});
  else flags.push({type:'green',key:'Extreme Responses',text:`Response extremity within expected range at ${Math.round(extRatio*100)}%.`});
  if(conScore<30) flags.push({type:'red',key:'Consistency',text:`CRITICAL: Consistency ${conScore}/100 — severe contradictions detected.`});
  else if(conScore<55) flags.push({type:'red',key:'Consistency',text:`Low internal consistency (${conScore}/100). Contradictions detected.`});
  else if(conScore<75) flags.push({type:'amber',key:'Consistency',text:`Moderate consistency (${conScore}/100). Minor contradictions present.`});
  else flags.push({type:'green',key:'Consistency',text:`High internal consistency (${conScore}/100).`});
  const redCount=flags.filter(f=>f.type==='red').length;
  const amberCount=flags.filter(f=>f.type==='amber').length;
  let overall,overallLabel;
  if(catastrophic||extRatio>0.90||(conScore<30&&extRatio>0.70)){overall='red';overallLabel='Invalid — Do Not Use Results. Verification Required.';}
  else if(redCount>=2){overall='red';overallLabel='Low — Verification Interview Recommended.';}
  else if(redCount===1||amberCount>=2){overall='amber';overallLabel='Moderate — Interpret with Caution.';}
  else{overall='green';overallLabel='High — Proceed with Confidence.';}
  return{lAgree,saRatio,extRatio,conScore,flags,overall,overallLabel};
};

const getProfile = (s) => {
  const {O,C,E,A,ES,CQavg,OCBavg,LAavg,EOavg}=s;
  if(C>=70&&E>=65&&EOavg>=70&&LAavg>=60) return{name:'Strategic Integrity Leader',desc:"A high-performance profile combining delivery drive, social presence, strong ethical orientation, and adaptive learning. Ready for senior leadership in high-accountability environments. Rare — prioritise for succession planning."};
  if(C>=70&&OCBavg>=70&&EOavg>=65) return{name:'Institutional Anchor',desc:"Conscientious, ethical, and deeply invested in organisational citizenship. Delivers consistently, supports colleagues, and upholds institutional norms. Highly valuable in compliance and team leadership."};
  if(O>=65&&LAavg>=70&&CQavg>=65) return{name:'Adaptive Innovator',desc:"High intellectual curiosity with strong learning agility and cultural intelligence. Suited for policy development, change management, and reform initiatives."};
  if(EOavg>=75&&C>=65) return{name:'Ethics-Driven Executor',desc:"A reliable and principled professional with strong compliance orientation. Excellent for audit, compliance, risk management, and regulatory liaison roles."};
  if(CQavg>=70&&E>=65&&A>=65) return{name:'Cross-Cultural Bridge',desc:"A socially adept, culturally intelligent professional who builds effective relationships across diverse institutional and regional contexts."};
  if(OCBavg>=70&&A>=65&&EOavg>=65) return{name:'Collaborative Team Leader',desc:"An empathetic, cooperative, and institutionally committed professional who strengthens team cohesion. Recommended for team lead, HR, and coaching roles."};
  if(LAavg>=70&&O>=65) return{name:'Learning Champion',desc:"A fast learner who thrives on intellectual challenge. Strong asset in research, training design, and knowledge management roles."};
  return{name:'Developing Professional',desc:"A solid foundational profile with significant growth potential. With structured coaching and clear performance expectations, this individual can develop substantially across all dimensions."};
};

// ─── THEME-AWARE HELPERS (called at render time, so T is current) ─────────────
const bd = v => v>=75?'High':v>=50?'Moderate':'Low';
const bCol = v => v>=75 ? T.gn : v>=50 ? T.am : T.rd;
const bBg  = v => v>=75 ? T.gnP : v>=50 ? T.amP : T.rdP;
const barGrad = v => v>=75
  ? `linear-gradient(90deg,${darkTheme.gn},#4ade80)`
  : v>=50
  ? `linear-gradient(90deg,${darkTheme.am},#fcd34d)`
  : `linear-gradient(90deg,${darkTheme.rd},#f87171)`;

const dimInterp=(dim,score)=>{
  const b=bd(score);
  const map={
    O:{High:"Strong creative drive and intellectual curiosity. Valuable in innovation, strategy, and research.",Moderate:"Balanced between exploration and structure.",Low:"Prefers established procedures. Reliable in operational roles."},
    C:{High:"Highly self-disciplined and reliable. Core predictor of job performance.",Moderate:"Generally reliable; occasional lapses under competing demands.",Low:"May struggle with consistent delivery. Structured management recommended."},
    E:{High:"Socially confident and assertive. Natural for leadership and stakeholder roles.",Moderate:"Comfortable in selective social contexts.",Low:"Performs best in focused, independent work."},
    A:{High:"Highly cooperative and empathetic. Strong team player.",Moderate:"Balances cooperation and independence effectively.",Low:"Direct and assertive. May create friction — benefits from coaching."},
    ES:{High:"Highly stable under pressure. Suited to high-stakes decision-making.",Moderate:"Generally stable with some vulnerability under sustained pressure.",Low:"Resilience coaching and workload calibration recommended."},
    CQ_K:{High:"Deep understanding of cultural dynamics.",Moderate:"Basic awareness with some gaps.",Low:"Limited cultural self-awareness. Intercultural training recommended."},
    CQ_M:{High:"Intrinsically motivated to engage across cultural boundaries.",Moderate:"Selectively motivated.",Low:"Limited motivation. May create barriers in diverse environments."},
    CQ_B:{High:"Highly adaptive communicator across cultural contexts.",Moderate:"Adapts in familiar cross-cultural situations.",Low:"Communication style may be perceived as rigid."},
    OCB_A:{High:"Exceptional team support behaviour.",Moderate:"Helps others when capacity allows.",Low:"Primarily task-focused."},
    OCB_CV:{High:"Highly engaged institutional citizen.",Moderate:"Participates selectively.",Low:"Engagement confined to formal job requirements."},
    OCB_S:{High:"Tolerant of institutional imperfections.",Moderate:"Generally constructive but may voice frustrations.",Low:"May negatively influence team morale."},
    OCB_CO:{High:"Proactively manages information flow.",Moderate:"Keeps relevant parties informed when prompted.",Low:"Information shared reactively."},
    OCB_Cn:{High:"Highly conscientious about time and effort.",Moderate:"Meets expectations consistently.",Low:"Attendance or effort may fall below standards."},
    LA_MA:{High:"Thrives in ambiguous, fast-changing environments.",Moderate:"Handles moderate ambiguity.",Low:"Needs substantial support during change."},
    LA_PA:{High:"Highly self-aware and reflective learner.",Moderate:"Reflects when prompted.",Low:"Limited reflective practice. Coaching recommended."},
    LA_CA:{High:"Systems thinker with strong consequence analysis.",Moderate:"Understands immediate interdependencies.",Low:"Primarily task-focused."},
    LA_RA:{High:"Continuous learner applying diverse knowledge.",Moderate:"Learns within defined areas.",Low:"Limited independent learning."},
    EO_RC:{High:"Strong rule compliance. Low regulatory risk.",Moderate:"Generally compliant with occasional shortcuts.",Low:"Elevated compliance risk. Ethics training mandatory."},
    EO_T:{High:"Highly transparent in decision-making.",Moderate:"Transparent in most situations.",Low:"Transparency gaps detected."},
    EO_ER:{High:"Strong ethical reasoning. Considers stakeholder impacts.",Moderate:"Ethical reasoning may yield to pressure.",Low:"Ethical reasoning may be compromised."},
    EO_AI:{High:"Behavioural integrity is high. Acts consistently.",Moderate:"Generally acts with integrity.",Low:"Integrity indicators inconsistent. High-discretion risk."},
  };
  return map[dim]?.[b]||b+' range.';
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Pill = ({label, color, bg, style={}}) => {
  const c = color || T.c;
  return (
    <span className="mono" style={{
      display:'inline-block', padding:'5px 14px', borderRadius:'3px',
      fontSize:'10px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase',
      color:c, background:bg||`${c}18`, border:`1px solid ${c}35`, ...style
    }}>{label}</span>
  );
};

const ScoreBadge = ({score}) => (
  <span className="mono" style={{
    fontSize:'12px', fontWeight:'700', padding:'3px 10px', borderRadius:'3px',
    background:bBg(score), color:bCol(score), border:`1px solid ${bCol(score)}40`
  }}>{score}/100</span>
);

const Bar = ({score, w=110, h=5}) => (
  <div style={{width:w, height:h, background:T.b1, borderRadius:'3px', overflow:'hidden'}}>
    <div style={{width:`${score}%`, height:'100%', background:barGrad(score), borderRadius:'3px', transition:'width 0.8s ease'}} />
  </div>
);

const GoldLine = ({style={}}) => (
  <div style={{height:'2px', background:`linear-gradient(90deg, ${T.c}, ${T.gold}, transparent)`, ...style}} />
);

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const end = parseInt(value);
    if (isNaN(end)) return;
    const duration = 3500;
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(end);
    };
    requestAnimationFrame(update);
  }, [value]);
  return <>{count}</>;
};

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, direction = 'up', distance = 36 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;
  const x = direction === 'left' ? distance : direction === 'right' ? -distance : 0;
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate(0,0)' : `translate(${x}px, ${y}px)`,
      transition: `opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      width: '100%', height: '100%'
    }}>
      {children}
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({tab, setTab, hasResults, hasHistory, mode, setMode}) => (
  <nav style={{
    position:'sticky', top:0, zIndex:200,
    background:T.bg0 + 'EE',
    backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
    borderBottom:`1px solid ${T.b2}`,
  }} className="no-print">
    <div className="nav-wrap" style={{
      maxWidth:'1200px', margin:'0 auto',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 32px', height:'64px',
    }}>
      <div style={{display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', flexShrink:0}} onClick={()=>setTab('home')}>
        <img src="/logo.png" alt="Carnelian" style={{height:'30px', objectFit:'contain'}}
          onError={e=>{e.target.style.display='none'; e.target.nextSibling.style.display='flex';}} />
        <div style={{display:'none', width:'30px', height:'30px', background:T.c, borderRadius:'6px', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:'700', color:'#fff', fontSize:'15px'}}>C</div>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'26px', fontWeight:'700', color:T.gold, letterSpacing:'-0.02em', lineHeight:'0.95'}}>CORE</div>
          <div className="mono" style={{fontSize:'8px', color:T.c, letterSpacing:'0.18em', marginTop:'3px', fontWeight:'800'}}>BY CARNELIAN</div>
        </div>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
        <div style={{display:'flex', gap:'2px', overflowX:'auto', scrollbarWidth:'none'}}>
          {[
            {id:'home', l:'Overview'},
            {id:'assess', l:'Assessment'},
            ...(hasResults?[{id:'results', l:'Reports'}]:[]),
            ...(hasHistory?[{id:'progress', l:'Progress'}]:[]),
            {id:'method', l:'Methodology'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'8px 16px', borderRadius:'6px', border:'none', cursor:'pointer',
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'700',
              transition:'all 0.18s', whiteSpace:'nowrap',
              background: tab===t.id ? `${T.c}20` : 'transparent',
              color: tab===t.id ? T.c : T.t2,
            }}
            onMouseOver={e=>{if(tab!==t.id){e.target.style.color=T.t0; e.target.style.background=T.b1;}}}
            onMouseOut={e=>{if(tab!==t.id){e.target.style.color=T.t2; e.target.style.background='transparent';}}}
            >{t.l}</button>
          ))}
        </div>

        {/* Theme toggle */}
        <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} style={{
          display:'flex', alignItems:'center', gap:'8px',
          padding:'8px 16px', borderRadius:'6px',
          border:`1px solid ${T.b2}`,
          background: T.bg2,
          color: T.t0,
          cursor:'pointer',
          fontFamily:"'Plus Jakarta Sans',sans-serif",
          fontSize:'12px', fontWeight:'700',
          letterSpacing:'0.03em',
          transition:'all 0.2s',
          whiteSpace:'nowrap',
        }}
        onMouseOver={e=>{e.currentTarget.style.borderColor=T.c; e.currentTarget.style.color=T.c;}}
        onMouseOut={e=>{e.currentTarget.style.borderColor=T.b2; e.currentTarget.style.color=T.t0;}}>
          {mode === 'dark' ? '☀ Light' : '◑ Dark'}
        </button>
      </div>
    </div>
  </nav>
);

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({setTab}) => {
  // Colors array for the 8-point lists
  const listColors = [T.c, T.gold, T.gn, T.am, '#8B5CF6', T.c, T.gold, T.gn];

  return (
    <div>
      {/* Hero */}
      <section style={{
        background:'transparent',
        minHeight:'100vh', display:'flex', flexDirection:'column',
        justifyContent:'center', position:'relative', overflow:'hidden',
        padding:'100px 32px',
      }}>
        {/* Ambient glows */}
        <div style={{position:'absolute', top:'-15%', right:'-8%', width:'65vw', height:'65vw', borderRadius:'50%', background:`radial-gradient(circle, ${T.cGlow} 0%, transparent 65%)`, pointerEvents:'none', animation:'glow 8s ease-in-out infinite', zIndex:0}} />
        <div style={{position:'absolute', bottom:'-12%', left:'-4%', width:'45vw', height:'45vw', borderRadius:'50%', background:`radial-gradient(circle, ${T.goldP} 0%, transparent 65%)`, pointerEvents:'none', animation:'glow 10s ease-in-out infinite', animationDelay:'-4s', zIndex:0}} />

        <div style={{maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1, width:'100%'}}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Reveal delay={0}>
              <Pill 
                label={
                  <span style={{display:'inline-flex', alignItems:'center'}}>
                    <span style={{
                      display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
                      background: T.c, boxShadow: `0 0 8px ${T.c}`, marginRight:'8px',
                      animation: 'blink 1.5s infinite'
                    }} />
                    Competency & Organisational Readiness Evaluation
                  </span>
                } 
                color={T.t0} 
                style={{marginBottom:'32px', fontSize:'11px', padding:'8px 20px', fontWeight:'800'}} 
              />
            </Reveal>

            <Reveal delay={0.1}>
              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontWeight:'700', fontSize:'clamp(3rem,6vw,5.4rem)',
                color:T.t0, lineHeight:'1.05', margin:'0 0 16px',
                letterSpacing:'-0.03em',
              }} className="hero-title">
                The complete professional<br/>
                <em style={{color:T.c, fontStyle:'italic'}}>readiness</em> benchmark.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <GoldLine style={{width:'80px', margin:'28px auto'}} />
            </Reveal>

            <Reveal delay={0.3}>
              <p style={{color:T.t1, fontSize:'17px', maxWidth:'560px', lineHeight:'1.8', margin:'0 auto 48px', fontWeight:'600'}}>
                A 65-item psychometric battery engineered for Pakistan's professional landscape — with built-in validity controls, gamified behavioural challenges, and seven composite indices.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div style={{display:'flex', gap:'14px', flexWrap:'wrap', justifyContent:'center'}}>
                <button onClick={()=>setTab('assess')} style={{
                  padding:'15px 36px', borderRadius:'7px', border:'none', cursor:'pointer',
                  background:T.c, color:'#fff',
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'14px', fontWeight:'800',
                  letterSpacing:'0.04em', transition:'all 0.2s',
                  boxShadow:`0 0 40px ${T.cGlow}, 0 4px 20px rgba(0,0,0,0.3)`,
                }}
                onMouseOver={e=>{ e.target.style.background=T.cDark; e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow=`0 0 56px ${T.cGlow}, 0 8px 28px rgba(0,0,0,0.4)`; }}
                onMouseOut={e=>{ e.target.style.background=T.c; e.target.style.transform='none'; e.target.style.boxShadow=`0 0 40px ${T.cGlow}, 0 4px 20px rgba(0,0,0,0.3)`; }}>
                  Begin Assessment
                </button>
                <button onClick={()=>setTab('method')} style={{
                  padding:'15px 36px', borderRadius:'7px', cursor:'pointer',
                  background:'transparent', border:`2px solid ${T.b2}`,
                  color:T.t1, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'14px', fontWeight:'700',
                  transition:'all 0.2s',
                }}
                onMouseOver={e=>{ e.target.style.borderColor=T.gold; e.target.style.color=T.gold; e.target.style.transform='translateY(-2px)'; }}
                onMouseOut={e=>{ e.target.style.borderColor=T.b2; e.target.style.color=T.t1; e.target.style.transform='none'; }}>
                  View the Science
                </button>
              </div>
            </Reveal>
          </div>

          {/* Stats strip */}
          <Reveal delay={0.6}>
            <div className="grid-6-col" style={{
              display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1px',
              background:T.b2, border:`1px solid ${T.b2}`, borderRadius:'10px',
              overflow:'hidden', marginTop:'80px',
            }}>
              {[{n:'65',l:'Diagnostic Items'},{n:'14',l:'Dimensions'},{n:'7',l:'Composite Indices'},{n:'12',l:'L-Scale Items'},{n:'3',l:'Live Challenges'},{n:'12',l:'Sector Contexts'}].map((s,i)=>(
                <div key={i} style={{background:T.bg1, textAlign:'center', padding:'28px 12px', transition:'background 0.2s'}}
                  onMouseOver={e=>e.currentTarget.style.background=T.bg2}
                  onMouseOut={e=>e.currentTarget.style.background=T.bg1}>
                  <div style={{fontFamily:"'Playfair Display',serif", fontSize:'2.6rem', color:T.gold, fontWeight:'700', lineHeight:'1'}}>
                    <AnimatedNumber value={s.n} />
                  </div>
                  <div className="mono" style={{fontSize:'9px', color:T.t2, textTransform:'uppercase', letterSpacing:'0.12em', marginTop:'8px', fontWeight:'600'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modules */}
      <section className="section-pad" style={{padding:'100px 32px', maxWidth:'1100px', margin:'0 auto'}}>
        <Reveal delay={0}>
          <div style={{marginBottom:'56px', textAlign:'center'}}>
            <Pill label="Assessment Architecture" />
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:'700', margin:'16px 0 0', color:T.t0, letterSpacing:'-0.02em'}}>
              Five modules. Three challenges.<br/>
              <em style={{color:T.c, fontStyle:'italic'}}>One complete picture.</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid-5-col" style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'2px', marginBottom:'64px'}}>
          {[
            {n:'I', title:'Personality at Work', sub:'Big Five OCEAN framework. Predicts job performance, leadership readiness, and team fit. Public domain items (IPIP).', c:T.c},
            {n:'II', title:'Cultural Intelligence', sub:"CQ Knowledge, Motivation, and Behaviour. Critical for Pakistan's diverse provincial, institutional, and international contexts.", c:T.gold},
            {n:'III', title:'Workplace Initiative', sub:'Five OCB dimensions: Altruism, Civic Virtue, Sportsmanship, Courtesy, and Conscientiousness. Reveals who sustains your institution.', c:T.gn},
            {n:'IV', title:'Learning Agility', sub:'Mental, People, Change, and Results Agility. The strongest single predictor of leadership potential beyond current performance.', c:T.am},
            {n:'V', title:'Integrity & Ethics', sub:'Rule Compliance, Transparency, Ethical Reasoning, Authentic Integrity. The compliance screen every Pakistani employer needs.', c:'#8B5CF6'},
          ].map((m,i)=>(
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                background:T.bg1, border:`1px solid ${T.b1}`,
                borderTop:`3px solid ${m.c}`,
                padding:'28px 22px', height:'100%',
                transition:'all 0.25s', cursor:'default',
              }}
              onMouseOver={e=>{e.currentTarget.style.background=T.bg2; e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 20px 40px rgba(0,0,0,0.3)`;}}
              onMouseOut={e=>{e.currentTarget.style.background=T.bg1; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none';}}>
                <div className="mono" style={{fontSize:'9px', color:m.c, letterSpacing:'0.14em', marginBottom:'16px', fontWeight:'700'}}>MOD {m.n}</div>
                <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', color:T.t0, fontWeight:'600', marginBottom:'12px'}}>{m.title}</div>
                <div style={{fontSize:'12px', color:T.t2, lineHeight:'1.65', fontWeight:'500'}}>{m.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Challenges */}
        <Reveal delay={0}>
          <div style={{
            background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'16px',
            padding:'48px 40px', marginBottom:'100px', position:'relative', overflow:'hidden'
          }}>
            <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'80%', height:'180px', background:`radial-gradient(ellipse at top, ${T.cGlow}, transparent 70%)`, pointerEvents:'none'}} />
            <div style={{marginBottom:'40px', textAlign:'center', position:'relative', zIndex:1}}>
              <Pill label="Behaviour Under Pressure" color={T.c} style={{marginBottom:'16px'}} />
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,3vw,2.4rem)', fontWeight:'700', margin:'0 0 16px', color:T.t0}}>Three Gamified Challenges</h2>
              <p style={{fontSize:'15px', color:T.t1, maxWidth:'700px', margin:'0 auto', lineHeight:'1.75', fontWeight:'600'}}>
                Embedded between sections — not announced as tests, not skippable. Each challenge surfaces instinctive behaviour that deliberate self-presentation cannot easily fake.
              </p>
            </div>
            <div className="grid-3-col" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', position:'relative', zIndex:1}}>
              {[
                {title:'Values Seesaw', sub:'Ethical Elicitation', desc:'A workplace ethical dilemma presented as a live seesaw the candidate physically positions using a slider. No timer — requires genuine reflection. Contributes to Ethical Reasoning score.'},
                {title:'Timed Scenario 1', sub:'25-second presentation crisis', desc:'A 25-second presentation crisis: the candidate must choose under time pressure. Tests transparency and adaptive decision-making. Contributes to People Agility and Transparency scores.'},
                {title:'Timed Scenario 2', sub:'25-second ethics dilemma', desc:'An ethics dilemma involving relationship pressure and procurement bypass. Tests integrity under social influence. Contributes to Rule Compliance and Authentic Integrity scores.'},
              ].map((c,i)=>(
                <Reveal key={i} delay={i * 0.15}>
                  <div style={{
                    background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px',
                    padding:'32px 24px', height:'100%', transition:'all 0.25s',
                  }}
                  onMouseOver={e=>{e.currentTarget.style.background=T.bg3; e.currentTarget.style.borderColor=T.bC; e.currentTarget.style.transform='translateY(-4px)';}}
                  onMouseOut={e=>{e.currentTarget.style.background=T.bg2; e.currentTarget.style.borderColor=T.b1; e.currentTarget.style.transform='none';}}>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', color:T.t0, fontWeight:'600', marginBottom:'5px'}}>{c.title}</div>
                    <div className="mono" style={{fontSize:'10px', color:T.c, marginBottom:'16px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.09em'}}>{c.sub}</div>
                    <p style={{fontSize:'13px', color:T.t2, lineHeight:'1.7', fontWeight:'500'}}>{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Platform Capabilities */}
        <div style={{marginBottom:'64px'}}>
          <Reveal delay={0}>
            <div style={{marginBottom:'48px'}}>
              <Pill label="Platform Capabilities" color={T.gold} />
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:'700', margin:'16px 0 0', color:T.t0, letterSpacing:'-0.02em'}}>
                Engineered for precision and scale.
              </h2>
            </div>
          </Reveal>

          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {[
              {h:'Four-Layer Lie Detection', d:'12 invisible L-Scale items catch social desirability inflation. Reverse-scored consistency traps detect contradictions. Acquiescence detection flags candidates who click Agree on everything. Extreme response detection catches rushed or careless responding. All four combine into a single Validity Index — with hard overrides for catastrophic combinations.'},
              {h:'Seven Composite Indices', d:'14 individual dimensions combine into 7 composite indices weighted by published meta-analytic validity evidence: Compliance & Integrity, Leadership Readiness, Team Value, Adaptability, Stakeholder Effectiveness, Operational Reliability, and People Management.'},
              {h:'Cross-Dimensional Pattern Analysis', d:'Ten named patterns detect dangerous or valuable combinations that individual scores miss entirely. The Performance-Ethics Disconnect, the Charismatic Integrity Risk, the Talented Maverick — patterns research consistently links to institutional misconduct — are flagged automatically.'},
              {h:'Role Suitability Matrix + Interview Probes', d:'Six role families rated Suitable, Conditional, or Not Recommended — each driven by the relevant composite index. Every Not Recommended verdict generates specific behavioural interview probe questions embedded directly in the HR report.'},
              {h:'Two Fully Separated Reports', d:'Technical Report (HR & Leadership): All composite indices, validity breakdown, pattern analysis, and psychometric citations. Candidate Action Plan (The Individual): Plain-language strengths, development areas, and a 30/90/180-day priority matrix. Zero HR risk language.'},
              {h:'12-Industry Context Engine', d:"Configure once for your client before assessment begins. The engine adapts the Technical Report's industry lens, risk thresholds, and high-potential benchmarks for 12 Pakistani sectors. The Candidate Action Plan adapts too — providing genuinely contextualised development actions."},
              {h:'Longitudinal Re-Assessment Tracker', d:"Save any candidate's results to the device. When they retake CORE — after a development programme or promotion cycle — a side-by-side progress comparison is generated automatically. Every dimension shows its delta. Prove L&D impact with data."},
              {h:'Engagement-Optimised Experience', d:'Positive reinforcement messages appear after every question. Clear timed challenge warnings mean no candidate is surprised by a clock. The seesaw provides a visual, tactile break. Runs in any browser on any device. No app or login required.'},
            ].map((item,i)=>{
              const accent = listColors[i];
              return (
                <Reveal key={i} delay={i * 0.07} direction="left" distance={28}>
                  <div style={{
                    display:'flex', alignItems:'flex-start', gap:'24px',
                    background:T.bg1, border:`1px solid ${T.b1}`, borderRadius:'8px',
                    borderLeft:`4px solid ${accent}`,
                    padding:'28px 32px', position:'relative', overflow:'hidden',
                    transition:'all 0.3s ease', cursor:'default'
                  }}
                  onMouseOver={e=>{
                    e.currentTarget.style.background=T.bg2;
                    e.currentTarget.style.borderColor=T.b2;
                    const num = e.currentTarget.querySelector('.feat-num');
                    if (num) { num.style.color=T.gold; num.style.transform='scale(1.1) translateX(-10px)'; }
                  }}
                  onMouseOut={e=>{
                    e.currentTarget.style.background=T.bg1;
                    e.currentTarget.style.borderColor=T.b1;
                    const num = e.currentTarget.querySelector('.feat-num');
                    if (num) { num.style.color=T.b2; num.style.transform='none'; }
                  }}>
                    <div className="feat-num" style={{
                      position:'absolute', right:'16px', top:'-8px',
                      fontFamily:"'Playfair Display',serif",
                      fontSize:'110px', fontWeight:'700', color:T.b1,
                      opacity:0.4, transition:'all 0.5s ease', pointerEvents:'none', lineHeight:1
                    }}>0{i+1}</div>
                    <div style={{position:'relative', zIndex:1, maxWidth:'88%'}}>
                      <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.35rem', fontWeight:'600', color:accent, marginBottom:'10px'}}>{item.h}</h3>
                      <p style={{fontSize:'13px', color:T.t1, lineHeight:'1.7', fontWeight:'500'}}>{item.d}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Use cases */}
        <Reveal delay={0}>
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, padding:'48px', borderRadius:'12px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:'600', color:T.t0, marginBottom:'32px'}}>What organisations can use CORE for</h3>
            <div className="grid-4-col" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:T.b2, border:`1px solid ${T.b2}`}}>
              {[
                {h:'Pre-Hiring Screening', d:'Reduce the cost of bad hires. Interview probe questions are already generated for every at-risk role.'},
                {h:'Succession Planning', d:'Leadership Readiness Score and pattern analysis surface the candidates traditional systems miss — and the ones they should not promote.'},
                {h:'L&D Targeting', d:'Map specific development investments to specific individual gaps. Stop sending everyone to the same programme.'},
                {h:'Compliance Risk Management', d:'The Compliance & Integrity Index gives risk committees a psychometric data point before placing staff in fiduciary roles.'},
                {h:'Team Composition', d:'Run a cohort and compare Team Value Scores across the group. Identify gaps and redundancies before a project launches.'},
                {h:'Post-Training Evaluation', d:'Re-assess after a development programme. The progress tracker shows exactly which scores moved — and proves ROI to leadership.'},
                {h:'Donor Accountability', d:'Development sector organisations can show donors peer-reviewed evidence behind their staff selection and capacity building investments.'},
                {h:'Civil Service Promotion', d:'Objective, legally defensible data for BPS promotion decisions — merit-based, standardised, and auditable.'},
              ].map((item,i)=>{
                const boxAccent = listColors[i];
                return (
                  <Reveal key={i} delay={i * 0.05} distance={20}>
                    <div style={{
                      background:T.bg2, padding:'28px 24px', height:'100%', transition:'background 0.2s',
                      borderTop:`3px solid ${boxAccent}`
                    }}
                      onMouseOver={e=>e.currentTarget.style.background=T.bg3}
                      onMouseOut={e=>e.currentTarget.style.background=T.bg2}>
                      <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'600', color:boxAccent, marginBottom:'10px'}}>{item.h}</div>
                      <div style={{fontSize:'13px', color:T.t2, lineHeight:'1.65', fontWeight:'500'}}>{item.d}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

// ─── ASSESSMENT PAGE ──────────────────────────────────────────────────────────
const AssessmentPage = ({setTab, setReportData, setHistoryFlag}) => {
  const [step, setStep] = useState('intake');
  const [intakeStage, setIntakeStage] = useState(1);
  const [resp, setResp] = useState({name:'',email:'',emp:'',dept:'',role:'',exp:'',gender:'',org:'',purpose:'',industry:''});
  const [answers, setAnswers] = useState(Array(QS.length).fill(null));
  const [cur, setCur] = useState(0);
  const [breaker, setBreaker] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [gameScores, setGameScores] = useState({seesaw:50,scenario1:0,scenario2:0});
  const [ssVal, setSsVal] = useState(50);
  const [timer, setTimer] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [gameLocked, setGameLocked] = useState(false);
  const [gameChoice, setGameChoice] = useState(null);
  const [priorFound, setPriorFound] = useState(null);
  const timerRef = useRef(null);

  useEffect(()=>{
    if(resp.email || resp.emp){
      try{
        const h=JSON.parse(localStorage.getItem('core_v1_history')||'[]');
        const prior=h.filter(e=>{
          const emailMatch = resp.email && e.email && e.email === resp.email;
          const empMatch   = resp.emp   && e.emp   && e.emp   === resp.emp;
          return emailMatch || empMatch;
        });
        setPriorFound(prior.length>0?prior[prior.length-1]:null);
      }catch(e){}
    }
  },[resp.email, resp.emp]);

  useEffect(()=>{
    if(timerActive&&timer>0){ timerRef.current=setTimeout(()=>setTimer(t=>t-1),1000); }
    else if(timerActive&&timer===0){ setTimerActive(false); setGameLocked(true); setGameChoice({quality:'timeout'}); }
    return()=>clearTimeout(timerRef.current);
  },[timerActive,timer]);

  const startTimer=()=>{ setTimer(25); setTimerActive(true); setGameLocked(false); setGameChoice(null); };

  const handleAnswer=(val)=>{
    const a=[...answers]; a[cur]=val; setAnswers(a);
  };

  const nextQ=()=>{
    if(cur===QS.length-1){ generate(); return; }
    const curCh=QS[cur].ch, nextCh=QS[cur+1].ch, nextIdx=cur+1;
    if(nextIdx===31){setGameStage('g1'); return;}
    if(nextIdx===42){setGameStage('g2warn'); return;}
    if(nextIdx===53){setGameStage('g3warn'); return;}
    setCur(nextIdx);
    if(curCh!==nextCh&&BREAKERS[curCh]) setBreaker(curCh);
    else setBreaker(null);
  };

  const prevQ=()=>{ if(cur>0){setCur(cur-1); setBreaker(null);} };
  const submitSeesaw=()=>{ setGameScores(g=>({...g,seesaw:ssVal})); setGameStage(null); setCur(31); };

  const chooseScenario=(quality,gameNum)=>{
    if(gameLocked) return;
    setTimerActive(false); setGameLocked(true);
    const score=quality==='best'?10:quality==='ok'?5:quality==='timeout'?0:-5;
    if(gameNum===2) setGameScores(g=>({...g,scenario1:score}));
    else setGameScores(g=>({...g,scenario2:score}));
    setGameChoice({quality,score});
  };

  const generate=()=>{
    const O=scoreDim('O',answers),C=scoreDim('C',answers),E=scoreDim('E',answers),A=scoreDim('A',answers);
    const ES=100-scoreDim('ES',answers);
    const CQ_K=scoreDim('CQ_K',answers),CQ_M=scoreDim('CQ_M',answers),CQ_B=scoreDim('CQ_B',answers);
    const CQavg=Math.round((CQ_K+CQ_M+CQ_B)/3);
    const OCB_A=scoreDim('OCB_A',answers),OCB_CV=scoreDim('OCB_CV',answers),OCB_S=scoreDim('OCB_S',answers),OCB_CO=scoreDim('OCB_CO',answers),OCB_Cn=scoreDim('OCB_Cn',answers);
    const OCBavg=Math.round((OCB_A+OCB_CV+OCB_S+OCB_CO+OCB_Cn)/5);
    const LA_MA=scoreDim('LA_MA',answers),LA_PA_raw=scoreDim('LA_PA',answers),LA_CA=scoreDim('LA_CA',answers),LA_RA=scoreDim('LA_RA',answers);
    const EO_RC_raw=scoreDim('EO_RC',answers),EO_T_raw=scoreDim('EO_T',answers),EO_ER_raw=scoreDim('EO_ER',answers),EO_AI_raw=scoreDim('EO_AI',answers);
    const gs=gameScores;
    const ssBonus=gs.seesaw<=20?3:gs.seesaw<=40?7:gs.seesaw<=60?2:gs.seesaw<=80?-4:-7;
    const adjEO_ER=Math.min(100,Math.max(0,EO_ER_raw+ssBonus));
    const sc1=gs.scenario1;
    const adjLA_PA=Math.min(100,Math.max(0,LA_PA_raw+sc1));
    const adjEO_T=Math.min(100,Math.max(0,EO_T_raw+sc1));
    const sc2=gs.scenario2;
    const adjEO_RC=Math.min(100,Math.max(0,EO_RC_raw+sc2));
    const adjEO_AI=Math.min(100,Math.max(0,EO_AI_raw+sc2));
    const LAavg=Math.min(100,Math.round((LA_MA+adjLA_PA+LA_CA+LA_RA)/4));
    const EOavg=Math.min(100,Math.round((adjEO_RC+adjEO_T+adjEO_ER+adjEO_AI)/4));
    const OCEANavg=Math.round((O+C+E+A+ES)/5);
    const S={O,C,E,A,ES,CQ_K,CQ_M,CQ_B,CQavg,OCB_A,OCB_CV,OCB_S,OCB_CO,OCB_Cn,OCBavg,LA_MA,LA_PA:adjLA_PA,LA_CA,LA_RA,LAavg,EO_RC:adjEO_RC,EO_T:adjEO_T,EO_ER:adjEO_ER,EO_AI:adjEO_AI,EOavg,OCEANavg,overall:Math.round((OCEANavg+CQavg+OCBavg+LAavg+EOavg)/5)};
    const CII=Math.round(S.EO_RC*0.32+S.EO_AI*0.32+S.EO_T*0.20+S.C*0.16);
    const LRS=Math.round(S.C*0.22+S.E*0.18+S.LAavg*0.25+S.EOavg*0.20+S.ES*0.15);
    const TVS=Math.round(S.A*0.22+S.OCB_A*0.20+S.OCB_S*0.18+S.OCB_CO*0.18+S.OCBavg*0.22);
    const ADS=Math.round(S.LAavg*0.38+S.O*0.32+S.CQavg*0.30);
    const SES=Math.round(S.E*0.28+S.A*0.22+S.CQavg*0.28+S.OCB_CO*0.22);
    const OPS=Math.round(S.C*0.35+S.ES*0.30+S.OCB_Cn*0.20+S.LA_MA*0.15);
    const PMS=Math.round(TVS*0.35+S.A*0.25+S.EOavg*0.25+S.E*0.15);
    const CI={CII,LRS,TVS,ADS,SES,OPS,PMS};
    const profile=getProfile(S);
    const validity=computeValidity(answers);
    const docId='CORE-'+Date.now().toString(36).toUpperCase();
    const date=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
    const gameSummary={
      seesaw:{val:gs.seesaw,bonus:ssBonus,label:ssBonus>=7?'Principled & Nuanced':ssBonus>=2?'Balanced':ssBonus>=-2?'Relational-leaning':'High relational — process risk'},
      scenario1:{raw:sc1,label:sc1>=7?'Optimal response':sc1>=4?'Good approach':sc1===0?'Timed out':'Below average — poor response'},
      scenario2:{raw:sc2,label:sc2>=7?'Strong integrity under pressure':sc2>=4?'Moderate awareness':sc2===0?'Timed out':'High-risk — compliance concern'},
    };
    const roles=[
      {name:'Compliance / Audit / Risk',score:CII,g:70,a:54,redNote:'CII below threshold. Do not place in treasury, procurement, audit, or unsupervised fiduciary roles without mandatory ethics intervention.',probeQ:['Describe a time following a rule precisely would have produced a worse outcome. What did you do and why?','Have you ever been asked by a superior to do something conflicting with policy? Walk me through exactly what happened.','Tell me about a decision that no one would have known about if you had decided differently. What did you do?']},
      {name:'Senior Leadership / Executive',score:LRS,g:72,a:55,redNote:'LRS below threshold. Not ready for senior leadership without structured development in the low-scoring composite dimensions.',probeQ:['Describe a time making a high-stakes decision with incomplete information. What was your process?','How do you manage your own performance and accountability? Give me a specific system.','Tell me about a time your team underperformed. What was your role, and what did you change?']},
      {name:'Client-Facing / Stakeholder Management',score:SES,g:68,a:52,redNote:'SES below threshold. Risk of damaged client relationships. Also verify EO_AI ≥ 55 before any role with unsupervised client fund access.',probeQ:['Tell me about the most difficult client or stakeholder relationship you have managed. How did you handle cultural differences?','Describe a time you had to say something a client did not want to hear. How did you frame it?']},
      {name:'Operations / Technical Specialist',score:OPS,g:67,a:51,redNote:'OPS below threshold. May struggle with sustained delivery and process adherence under pressure.',probeQ:['Walk me through how you organise your work when you have multiple competing deadlines.','Tell me about a time you had to maintain quality standards under significant time pressure.']},
      {name:'Change / Reform / Innovation',score:ADS,g:67,a:50,redNote:'ADS below threshold. Not suited for reform, transformation, or ambiguity-heavy roles without learning agility development.',probeQ:['Tell me about a time you had to work effectively without clear guidelines or established procedures.','Describe something you taught yourself in the last 12 months. How did you apply it?']},
      {name:'People Management / Team Lead',score:PMS,g:67,a:51,redNote:'PMS below threshold. Interpersonal, ethical, or team cohesion dimensions insufficiently developed for people management.',probeQ:['Tell me about a team member you had difficulty with. How did you manage that relationship?','Describe a time you had to give critical feedback to someone. How did you approach it?']},
    ];
    try{
      let h=JSON.parse(localStorage.getItem('core_v1_history')||'[]');
      const entry={
        docId, date, timestamp:Date.now(),
        name:resp.name, email:resp.email||'', emp:resp.emp||'',
        role:resp.role||'', dept:resp.dept||'', exp:resp.exp||'',
        org:resp.org||'', industry:resp.industry||'',
        profile:profile.name, validityOverall:validity.overall,
        scores:{O:S.O,C:S.C,E:S.E,A:S.A,ES:S.ES,CQavg:S.CQavg,OCBavg:S.OCBavg,LAavg:S.LAavg,EOavg:S.EOavg,OCEANavg:S.OCEANavg,overall:S.overall,CII,LRS,TVS,ADS,SES,OPS,PMS}
      };
      // Identify existing records by email OR emp (whichever is provided)
      const isSamePerson = (e) => {
        if (entry.email && e.email && entry.email === e.email) return true;
        if (entry.emp   && e.emp   && entry.emp   === e.emp)   return true;
        return false;
      };
      const others = h.filter(e => !isSamePerson(e));
      const samePersonHistory = h.filter(isSamePerson).slice(-4); // keep last 4
      h = [...others, ...samePersonHistory, entry].slice(-200);
      localStorage.setItem('core_v1_history', JSON.stringify(h));
      setHistoryFlag(true);
    }catch(e){}
    setReportData({scores:S,profile,validity,CI,gameSummary,respondent:resp,cfg:{org:resp.org,industry:resp.industry,purpose:resp.purpose,conf:'Restricted — HR Leadership Only'},docId,date,roles});
    setTab('results');
  };

  // styles
  const inp=(focused)=>({
    width:'100%', padding:'12px 16px',
    border:`1px solid ${focused?T.c:T.b2}`,
    borderRadius:'6px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'600',
    background:T.bg3, color:T.t0, outline:'none', transition:'all 0.2s',
    boxShadow:focused?`0 0 0 3px ${T.cGlow}`:'none',
  });
  const [focused,setFocused]=useState({});
  const lbl={display:'block',fontSize:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.12em',color:T.t2,marginBottom:'7px',fontFamily:"'JetBrains Mono',monospace"};
  const selStyle={width:'100%',padding:'12px 16px',border:`1px solid ${T.b2}`,borderRadius:'6px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'600',background:T.bg3,color:T.t0,outline:'none',cursor:'pointer'};

  // ── INTAKE ──
  if(step==='intake') return (
    <div style={{minHeight:'100vh', background:'transparent', padding:'80px 24px'}}>
      <div style={{maxWidth:'700px', margin:'0 auto', animation:'fadeUp 0.6s ease forwards'}}>
        {priorFound&&<div style={{background:`${T.gn}14`,border:`1px solid ${T.gn}35`,borderRadius:'8px',padding:'14px 18px',marginBottom:'24px',fontSize:'13px',color:T.gn,fontWeight:'600'}}>
          Prior assessment found for <strong style={{color:T.t0}}>{priorFound.name}</strong> dated {priorFound.date}. Progress comparison will generate automatically.
        </div>}

        {/* Progress steps */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'36px'}}>
          {[1,2,3].map(n=>(
            <React.Fragment key={n}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',border:`2px solid ${n<=intakeStage?T.c:T.b2}`,background:n<intakeStage?T.c:n===intakeStage?`${T.c}20`:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {n<intakeStage
                    ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    : <span className="mono" style={{fontSize:'10px',color:n<=intakeStage?T.c:T.t3,fontWeight:'700'}}>{n}</span>
                  }
                </div>
                <span style={{fontSize:'12px',color:n<=intakeStage?T.t0:T.t3,fontWeight:n===intakeStage?'700':'500'}}>
                  {n===1?'Your Details':n===2?'Context':'Instructions'}
                </span>
              </div>
              {n<3&&<div style={{flex:1,height:'2px',background:n<intakeStage?T.c:T.b1,borderRadius:'1px'}} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'36px'}}>
          {intakeStage===1&&(
            <div key="stage1" style={{animation:'scaleIn 0.3s ease forwards'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'24px'}}>Your Information</h2>
              <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
                {[['name','Full Name *','e.g. Ayesha Raza'],['email','Email Address *','e.g. ayesha@company.com'],['emp','Employee / Roll No.','Used to track your progress'],['dept','Department','e.g. Risk Management'],['role','Current Role','e.g. Deputy Manager']].map(([k,lbl_,ph])=>(
                  <div key={k}><label style={lbl}>{lbl_}</label><input value={resp[k]} onChange={e=>setResp(r=>({...r,[k]:e.target.value}))} placeholder={ph} style={inp(focused[k])} onFocus={()=>setFocused(f=>({...f,[k]:true}))} onBlur={()=>setFocused(f=>({...f,[k]:false}))} /></div>
                ))}
                <div><label style={lbl}>Years of Experience *</label>
                  <select value={resp.exp} onChange={e=>setResp(r=>({...r,exp:e.target.value}))} style={selStyle}>
                    <option value="">Select…</option>
                    {['0–2 years','3–5 years','6–10 years','11–15 years','16+ years'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Gender</label>
                  <select value={resp.gender} onChange={e=>setResp(r=>({...r,gender:e.target.value}))} style={selStyle}>
                    <option value="">Prefer not to say</option>
                    {['Male','Female','Other'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div style={{background:`${T.gold}10`,border:`1px solid ${T.gold}25`,borderRadius:'7px',padding:'12px 16px',marginBottom:'20px',fontSize:'12px',color:T.t1,fontWeight:'600'}}>
                <span style={{color:T.gold,fontWeight:'700'}}>→ Progress Tracking:</span> Your email or employee number is used to identify your assessment history and generate progress comparisons across retakes. Neither field is mandatory to start, but at least one improves tracking accuracy.
              </div>
              <button onClick={()=>{if(!resp.name||!resp.exp){alert('Please enter your name and years of experience.');return;} setIntakeStage(2);}} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>
                Continue →
              </button>
            </div>
          )}

          {intakeStage===2&&(
            <div key="stage2" style={{animation:'scaleIn 0.3s ease forwards'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'24px'}}>Assessment Context</h2>
              <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                <div><label style={lbl}>Organisation Name</label><input value={resp.org} onChange={e=>setResp(r=>({...r,org:e.target.value}))} placeholder="e.g. Allied Bank Limited" style={inp(focused.org)} onFocus={()=>setFocused(f=>({...f,org:true}))} onBlur={()=>setFocused(f=>({...f,org:false}))} /></div>
                <div><label style={lbl}>Assessment Purpose</label>
                  <select value={resp.purpose} onChange={e=>setResp(r=>({...r,purpose:e.target.value}))} style={selStyle}>
                    <option value="">Select…</option>
                    {['Pre-Hiring Screening','Leadership Pipeline Assessment','Succession Planning','Post-Training Evaluation','Team Composition Analysis','Performance Improvement','Personal Development Planning'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <label style={{...lbl,marginBottom:'12px'}}>Industry Sector *</label>
              <div className="grid-3-col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'24px'}}>
                {Object.entries(IND).map(([key,val])=>(
                  <button key={key} onClick={()=>setResp(r=>({...r,industry:key}))} style={{
                    padding:'11px 8px',borderRadius:'6px',cursor:'pointer',textAlign:'center',
                    background:resp.industry===key?`${T.c}20`:T.bg3,
                    border:`2px solid ${resp.industry===key?T.c:T.b1}`,
                    color:resp.industry===key?T.c:T.t2,
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'11px',fontWeight:'700',
                    transition:'all 0.18s',lineHeight:'1.3',
                  }}>{val.short}</button>
                ))}
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button onClick={()=>setIntakeStage(1)} style={{padding:'13px 20px',borderRadius:'7px',border:`1px solid ${T.b2}`,background:'transparent',color:T.t2,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'700',transition:'all 0.2s'}}>← Back</button>
                <button onClick={()=>{if(!resp.industry){alert('Please select an industry sector.');return;} setIntakeStage(3);}} style={{flex:1,padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>Continue →</button>
              </div>
            </div>
          )}

          {intakeStage===3&&(
            <div key="stage3" style={{animation:'scaleIn 0.3s ease forwards'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'24px'}}>Before you begin</h2>
              <div style={{background:T.bg2,borderRadius:'8px',padding:'24px',marginBottom:'20px'}}>
                {[
                  {n:'01',t:'Respond authentically',d:"Answer based on how you actually behave at work — not how you wish you behaved. There are no right or wrong answers."},
                  {n:'02',t:'Trust your first instinct',d:"Your first instinct is typically the most accurate. Do not deliberate excessively on any item."},
                  {n:'03',t:'Internal consistency checks apply',d:"The assessment contains validity checks. Inconsistent or implausible response patterns will be flagged in the report."},
                  {n:'04',t:'Allow approximately 20 minutes',d:"Three embedded challenges will appear between sections. You cannot return to previous sections once moved forward."},
                ].map((item,i,arr)=>(
                  <div key={i} style={{display:'flex',gap:'16px',paddingBottom:i<arr.length-1?'18px':'0',marginBottom:i<arr.length-1?'18px':'0',borderBottom:i<arr.length-1?`1px solid ${T.b1}`:'none'}}>
                    <div className="mono" style={{fontSize:'11px',color:T.c,minWidth:'22px',paddingTop:'2px',fontWeight:'700'}}>{item.n}</div>
                    <div><div style={{fontSize:'13px',fontWeight:'700',color:T.t0,marginBottom:'3px'}}>{item.t}</div><div style={{fontSize:'12px',color:T.t2,lineHeight:'1.65',fontWeight:'500'}}>{item.d}</div></div>
                  </div>
                ))}
              </div>
              <div style={{background:`${T.am}12`,border:`1px solid ${T.am}35`,borderRadius:'7px',padding:'14px 16px',marginBottom:'20px'}}>
                <div className="mono" style={{fontSize:'9px',fontWeight:'700',color:T.am,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'5px'}}>Validity Notice</div>
                <p style={{fontSize:'12px',color:T.t1,lineHeight:'1.65',fontWeight:'500'}}>This assessment includes checks that detect when responses do not reflect realistic self-perception. Inflated or inconsistent results are noted in the HR report and reduce the usefulness of your profile.</p>
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button onClick={()=>setIntakeStage(2)} style={{padding:'13px 20px',borderRadius:'7px',border:`1px solid ${T.b2}`,background:'transparent',color:T.t2,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'700',transition:'all 0.2s'}}>← Back</button>
                <button onClick={()=>{setAnswers(Array(QS.length).fill(null));setCur(0);setStep('questions');}} style={{flex:1,padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>Begin Assessment →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── SEESAW GAME ──
  if(step==='questions'&&gameStage==='g1'){
    const tilt=(ssVal-50)*0.36;
    const zones=[
      {max:20,label:'Strongly formal — clear compliance orientation',c:'#60A5FA'},
      {max:40,label:'Principled — leans formal with relational awareness',c:T.gn},
      {max:60,label:'Balanced — genuinely weighing both values',c:T.gold},
      {max:80,label:'Relational-leaning — culture over formal procedure',c:T.am},
      {max:100,label:'Strongly relational — relationships over process',c:T.rd},
    ];
    const zone=zones.find(z=>ssVal<=z.max)||zones[zones.length-1];
    return (
      <div style={{minHeight:'100vh',background:'transparent',padding:'80px 24px',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'680px',margin:'0 auto',width:'100%',animation:'slideUp 0.5s ease forwards'}}>
          <div style={{background:`${T.c}12`,border:`1px solid ${T.bC}`,borderRadius:'7px',padding:'10px 16px',marginBottom:'20px'}}>
            <span className="mono" style={{fontSize:'9px',color:T.c,textTransform:'uppercase',letterSpacing:'0.14em',fontWeight:'700'}}>Balancing Challenge — After Part C</span>
          </div>
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'36px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.7rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>Values in Balance</h3>
            <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.65',marginBottom:'24px',fontWeight:'500'}}>Most professionals face moments where two legitimate values pull in opposite directions. Use the slider to show where you naturally lean when these two sides conflict. There is no time limit — this requires genuine reflection. Your position contributes to your Ethical Reasoning profile.</p>
            <div style={{background:T.bg2,borderRadius:'7px',padding:'18px 20px',marginBottom:'24px',borderLeft:`4px solid #8B5CF6`}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'15px',color:T.t0,lineHeight:'1.7',fontWeight:'500'}}>Your organisation has always resolved internal disputes informally — through conversation and relationships rather than formal written procedures. You believe this occasionally produces unfair outcomes, but it maintains team cohesion. A junior colleague asks your honest advice: should they follow the formal grievance process or handle this the way things have always been done here?</p>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',gap:'16px'}}>
              <span style={{fontSize:'11px',color:T.t2,maxWidth:'220px',lineHeight:'1.4',fontWeight:'600'}}>Follow the formal process — policies exist to protect people, regardless of organisational culture.</span>
              <span style={{fontSize:'11px',color:T.t2,maxWidth:'220px',textAlign:'right',lineHeight:'1.4',fontWeight:'600'}}>Handle it informally — relationships and trust matter more than process in real professional life.</span>
            </div>
            <svg viewBox="0 0 500 110" style={{width:'100%',overflow:'visible',marginBottom:'4px'}}>
              <polygon points="250,100 232,112 268,112" fill={T.b2}/>
              <rect x="225" y="110" width="50" height="5" rx="2.5" fill={T.b2}/>
              <g style={{transformOrigin:'250px 100px',transform:`rotate(${tilt}deg)`,transition:'transform 0.4s ease'}}>
                <rect x="60" y="96" width="380" height="8" rx="4" fill={T.t0}/>
                <rect x="52" y="84" width="48" height="5" rx="2" fill={T.bg3}/>
                <text x="76" y="80" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill={T.gn} fontWeight="700">Formal</text>
                <rect x="400" y="84" width="48" height="5" rx="2" fill={T.bg3}/>
                <text x="424" y="80" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill={T.rd} fontWeight="700">Informal</text>
              </g>
            </svg>
            <div style={{padding:'0 4px',marginBottom:'16px'}}><input type="range" min="0" max="100" value={ssVal} onChange={e=>setSsVal(parseInt(e.target.value))} style={{width:'100%',accentColor:T.c,cursor:'pointer'}} /></div>
            <div style={{textAlign:'center',padding:'10px 14px',background:`${zone.c}14`,border:`1px solid ${zone.c}35`,borderRadius:'6px',fontSize:'12px',fontWeight:'700',color:zone.c,marginBottom:'20px'}}>{zone.label}</div>
            <button onClick={submitSeesaw} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>Confirm My Position →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── TIMED GAME WARN ──
  if(step==='questions'&&(gameStage==='g2warn'||gameStage==='g3warn')){
    const isG2=gameStage==='g2warn';
    return (
      <div style={{minHeight:'100vh',background:'transparent',padding:'80px 24px',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'600px',margin:'0 auto',width:'100%',animation:'slideUp 0.5s ease forwards'}}>
          <div style={{background:`${T.c}12`,border:`1px solid ${T.bC}`,borderRadius:'7px',padding:'10px 16px',marginBottom:'20px'}}>
            <span className="mono" style={{fontSize:'9px',color:T.c,textTransform:'uppercase',letterSpacing:'0.14em',fontWeight:'700'}}>{isG2?'Timed Challenge — 1 of 2':'Final Challenge — 2 of 2'}</span>
          </div>
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'36px'}}>
            <div style={{textAlign:'center',marginBottom:'28px'}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',fontWeight:'700',color:T.t0,marginBottom:'10px'}}>{isG2?'25-Second Decision Challenge':'25-Second Ethics Challenge'}</div>
              <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.65',maxWidth:'440px',margin:'0 auto',fontWeight:'500'}}>{isG2?'A real workplace situation will appear. You must read it and choose one of four responses. The clock starts when you click below.':'This is your last timed challenge. It tests ethical decision-making under relationship pressure — one of the most realistic situations professionals face.'}</p>
            </div>
            <div style={{background:T.bg2,borderRadius:'8px',padding:'20px',marginBottom:'24px'}}>
              {['You have exactly 25 seconds — the clock begins immediately',isG2?'This challenge contributes to your Learning Agility profile':'This challenge contributes to your Ethical Orientation profile','Once you select a response, it is final','Answer as you honestly would — not as an ideal version of yourself'].map((b,i)=>(
                <div key={i} style={{display:'flex',gap:'10px',padding:'7px 0',borderBottom:i<3?`1px solid ${T.b1}`:'none',fontSize:'12px',color:T.t1,fontWeight:'600'}}>
                  <span style={{color:T.c,fontWeight:'800',flexShrink:0}}>→</span>{b}
                </div>
              ))}
            </div>
            <button onClick={()=>{setGameStage(isG2?'g2':'g3'); startTimer();}} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>Start the Clock →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── TIMED SCENARIO ──
  if(step==='questions'&&(gameStage==='g2'||gameStage==='g3')){
    const isG2=gameStage==='g2';
    const circ=175.9;
    const offset=circ*(1-timer/25);
    const urgent=timer<=8;
    const fb=gameChoice?{
      best:{bg:T.gnP,bc:T.gn,c:T.gn,msg:isG2?'Disclosing the issue proactively protects team credibility and demonstrates transparency under pressure — the strongest combination of learning agility and ethical ownership.':'Strong integrity under relationship pressure. Declining while suggesting a legitimate alternative demonstrates rule compliance and ethical courage.'},
      ok:{bg:T.amP,bc:T.am,c:T.am,msg:isG2?'This shows situational awareness and some degree of caution. A solid instinct, not the optimal one.':'This response maintains some oversight or documentation — awareness of the ethical issues, though not the most decisive approach.'},
      poor:{bg:T.rdP,bc:T.rd,c:T.rd,msg:isG2?'This response prioritises short-term convenience over transparency. It reflects limited ethical ownership — the exact pattern this challenge is designed to detect.':"Approving a rule-bypass because a trusted relationship vouches for it is one of the most common pathways to institutional misconduct."},
      timeout:{bg:T.amP,bc:T.am,c:T.am,msg:'Time expired. No response was recorded. Your existing dimension scores are unchanged.'},
    }[gameChoice.quality]:null;
    const scenario=isG2
      ?"Your team is presenting a quarterly report to three senior directors in 8 minutes. Your colleague who built the data model has just told you a key assumption was wrong — it could significantly change your main recommendation. There is no time to fix it. What do you do?"
      :"Your line manager — someone who has actively supported your career — asks you to approve a vendor payment that bypasses the standard three-quote procurement process. He assures you it is urgent, the vendor is trustworthy, and he will sort the paperwork afterward. Approving this is within your authority. What do you do?";
    const options=isG2
      ?[{k:'A',q:'best',l:"Tell the directors upfront that you have identified a data issue, present what you are confident about, and commit to a verified analysis within 24 hours."},{k:'B',q:'ok',l:"Deliver the parts you are fully confident about and flag the affected section clearly as 'pending verification' before presenting it."},{k:'C',q:'ok',l:"Ask to postpone the meeting by one day so the data can be corrected and verified before presenting to leadership."},{k:'D',q:'poor',l:"Present as planned — the directors may not notice the error, and you can quietly issue a correction afterward."}]
      :[{k:'A',q:'best',l:"Decline to approve and suggest a faster legitimate alternative — even if this frustrates your manager."},{k:'B',q:'ok',l:"Tell your manager you will approve only after he gets written sign-off from his own supervisor first."},{k:'C',q:'ok',l:"Approve it, but immediately send a written note documenting that you were asked to bypass procedure."},{k:'D',q:'poor',l:"Approve it — your manager vouched for it, the relationship matters, and you trust his judgement."}];
    const onNext=()=>{
      setGameStage(null);
      const nextIdx=isG2?42:53;
      setCur(nextIdx);
      setBreaker(null);
    };
    return (
      <div style={{minHeight:'100vh',background:'transparent',padding:'64px 24px',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto',width:'100%',animation:'fadeIn 0.3s ease forwards'}}>
          <div style={{background:`${T.c}12`,border:`1px solid ${T.bC}`,borderRadius:'7px',padding:'10px 16px',marginBottom:'20px'}}>
            <span className="mono" style={{fontSize:'9px',color:T.c,textTransform:'uppercase',letterSpacing:'0.14em',fontWeight:'700'}}>{isG2?'Timed Scenario — 1 of 2':'Ethics Challenge — 2 of 2'}</span>
          </div>
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'20px'}}>
              <div style={{position:'relative',width:'64px',height:'64px',flexShrink:0}}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="32" cy="32" r="28" fill="none" stroke={T.b2} strokeWidth="5"/>
                  <circle cx="32" cy="32" r="28" fill="none" stroke={urgent?T.rd:T.c} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    style={{transition:'stroke-dashoffset 0.9s linear, stroke 0.4s', animation:urgent?'timerTick 1s infinite':undefined}}/>
                </svg>
                <div className="mono" style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:'700',color:urgent?T.rd:T.t0}}>{timer}</div>
              </div>
              <div style={{fontSize:'13px',color:T.t2,lineHeight:'1.6',fontWeight:'600'}}>Read carefully and choose. <strong style={{color:urgent?T.rd:T.t0,fontWeight:'800'}}>The clock is running.</strong></div>
            </div>
            <div style={{background:T.bg2,borderRadius:'7px',padding:'18px 20px',borderLeft:`4px solid ${T.c}`,marginBottom:'20px'}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'15px',color:T.t0,lineHeight:'1.7',fontWeight:'500'}}>{scenario}</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
              {options.map(opt=>(
                <button key={opt.k} onClick={()=>!gameLocked&&chooseScenario(opt.q,isG2?2:3)} style={{
                  display:'flex',alignItems:'flex-start',gap:'12px',padding:'13px 16px',
                  borderRadius:'7px',cursor:gameLocked?'default':'pointer',
                  border:`1px solid ${T.b2}`,background:T.bg2,
                  textAlign:'left',transition:'all 0.18s',width:'100%',
                  opacity:gameLocked?0.55:1,
                }}
                onMouseOver={e=>{if(!gameLocked){e.currentTarget.style.borderColor=T.bC;e.currentTarget.style.background=T.bg3;}}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.b2;e.currentTarget.style.background=T.bg2;}}>
                  <span className="mono" style={{fontSize:'12px',fontWeight:'700',color:T.c,flexShrink:0,marginTop:'1px'}}>{opt.k}</span>
                  <span style={{fontSize:'13px',color:T.t1,lineHeight:'1.6',fontWeight:'600'}}>{opt.l}</span>
                </button>
              ))}
            </div>
            {fb&&<div style={{background:fb.bg,border:`1px solid ${fb.bc}40`,borderRadius:'8px',padding:'14px 16px',marginBottom:'14px',fontSize:'13px',color:fb.c,lineHeight:'1.65',fontWeight:'600'}}>{fb.msg}</div>}
            {gameLocked&&<button onClick={onNext} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>{isG2?'Continue to Section E →':'Continue to Final Section →'}</button>}
          </div>
        </div>
      </div>
    );
  }

  // ── SECTION BREAKER ──
  if(step==='questions'&&breaker&&BREAKERS[breaker]){
    const b=BREAKERS[breaker];
    return (
      <div style={{minHeight:'100vh',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{textAlign:'center',maxWidth:'460px',animation:'slideUp 0.5s ease forwards'}}>
          <div style={{width:'60px',height:'60px',borderRadius:'50%',margin:'0 auto 22px',background:`${T.c}16`,border:`2px solid ${T.bC}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={T.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <Pill label={`${b.pct}% complete`} style={{marginBottom:'18px'}} />
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.2rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>{b.title}</h2>
          <p style={{color:T.t2,fontSize:'14px',lineHeight:'1.7',marginBottom:'32px',fontWeight:'600'}}>{b.msg}</p>
          <div style={{display:'flex',gap:'4px',justifyContent:'center',marginBottom:'36px'}}>
            {['A','B','C','D','E','F'].map(ch=>{
              const idx=QS.findIndex(q=>q.ch===ch);
              const done=cur>idx+9; const active=QS[cur]?.ch===ch;
              return <div key={ch} style={{height:'4px',width:'36px',borderRadius:'2px',background:done?T.c:active?T.gold:T.b2,transition:'background 0.3s'}} />;
            })}
          </div>
          <button onClick={()=>setBreaker(null)} style={{padding:'12px 32px',borderRadius:'7px',border:`2px solid ${T.b2}`,background:'transparent',color:T.t1,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'700',transition:'all 0.2s'}} onMouseOver={e=>{e.target.style.borderColor=T.c;e.target.style.color=T.c;}} onMouseOut={e=>{e.target.style.borderColor=T.b2;e.target.style.color=T.t1;}}>Continue →</button>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ──
  const q=QS[cur];
  const totalPct=Math.round((cur/QS.length)*100);

  return (
    <div style={{minHeight:'100vh',background:'transparent',display:'flex',flexDirection:'column'}}>
      <div style={{height:'4px',background:T.b1,position:'sticky',top:'64px',zIndex:100}}>
        <div style={{height:'100%',width:`${totalPct}%`,background:`linear-gradient(90deg,${T.c},${T.gold})`,transition:'width 0.4s ease',boxShadow:`0 0 16px ${T.cGlow}`}} />
      </div>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{maxWidth:'680px',width:'100%'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'28px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:T.c,boxShadow:`0 0 10px ${T.c}`}} />
              <span style={{fontSize:'12px',fontWeight:'700',color:T.t2,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{PARTNAMES[q.ch]}</span>
            </div>
            <span className="mono" style={{fontSize:'11px',color:T.t3,fontWeight:'600'}}>{totalPct}%</span>
          </div>

          <div className="q-card-pad" style={{
            background:T.bg1, border:`1px solid ${T.b2}`,
            borderRadius:'12px', padding:'40px 40px',
            animation:'scaleIn 0.25s ease forwards',
          }} key={cur}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.2rem,3vw,1.55rem)',color:T.t0,lineHeight:'1.55',marginBottom:'32px',fontWeight:'600'}}>{q.t}</p>

            <div style={{display:'flex',flexDirection:'column',gap:'7px',marginBottom:'28px'}}>
              {LKOPTS.map(([val,label])=>{
                const sel=answers[cur]===val;
                return (
                  <button key={val} onClick={()=>handleAnswer(val)} style={{
                    display:'flex',alignItems:'center',gap:'14px',
                    padding:'12px 18px',borderRadius:'7px',cursor:'pointer',
                    border:`${sel?2:1}px solid ${sel?T.c:T.b1}`,
                    background:sel?`${T.c}16`:T.bg2,
                    textAlign:'left',transition:'all 0.18s',width:'100%',
                  }}
                  onMouseOver={e=>{if(!sel){e.currentTarget.style.borderColor=T.bC;e.currentTarget.style.background=T.bg3;}}}
                  onMouseOut={e=>{if(!sel){e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.background=T.bg2;}}}>
                    <div style={{
                      width:'18px',height:'18px',borderRadius:'50%',flexShrink:0,
                      border:`2px solid ${sel?T.c:T.b2}`,
                      background:sel?T.c:'transparent',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      transition:'all 0.18s',
                    }}>
                      {sel&&<svg width="8" height="8" viewBox="0 0 8 8" style={{animation:'checkIn 0.2s ease'}}><path d="M1.5 4l2 2L6.5 2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>}
                    </div>
                    <span style={{fontSize:'13px',color:sel?T.t0:T.t1,fontWeight:sel?'700':'600'}}>{label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button onClick={prevQ} disabled={cur===0} style={{
                padding:'9px 18px',borderRadius:'6px',border:`1px solid ${T.b2}`,
                background:'transparent',color:T.t2,cursor:cur===0?'not-allowed':'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'12px',fontWeight:'700',
                visibility:cur===0?'hidden':'visible',
                transition:'all 0.18s',
              }}>← Back</button>

              <button onClick={nextQ} disabled={answers[cur]===null} style={{
                padding:'9px 22px',borderRadius:'6px',border:'none',
                cursor:answers[cur]===null?'not-allowed':'pointer',
                background:answers[cur]===null?T.bg3:T.c,
                color:answers[cur]===null?T.t3:'#fff',
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',
                letterSpacing:'0.03em',
                transition:'all 0.2s',
              }} onMouseOver={e=>{if(answers[cur]!==null) e.target.style.background=T.cDark;}} onMouseOut={e=>{if(answers[cur]!==null) e.target.style.background=T.c;}}>
                {cur===QS.length-1?'Generate Reports →':'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
const ResultsPage = ({reportData}) => {
  const [activeReport, setActiveReport] = useState('tech');
  if(!reportData) return <div style={{padding:'100px 32px',textAlign:'center',color:T.t2,fontWeight:'600'}}>No assessment data found. Please complete the assessment first.</div>;

  const {scores:S,profile,validity,CI,gameSummary:gs,respondent:R,cfg,docId,date,roles} = reportData;
  const ind=IND[cfg.industry]||{short:'General',lens:'',hiPotential:'',riskNote:''};

  const sLbl=(s,g,a)=>s>=g?'Low Risk':s>=a?'Moderate':'High Risk';
  const sBg=(s,g,a)=>s>=g?T.gnP:s>=a?T.amP:T.rdP;
  const sCol=(s,g,a)=>s>=g?T.gn:s>=a?T.am:T.rd;

  const cardStyle={background:'#fff',border:`1px solid #E5E7EB`,borderRadius:'10px',padding:'24px 26px',marginBottom:'10px'};
  const darkCard={background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'10px',padding:'24px 26px',marginBottom:'10px'};

  const thStyle={padding:'5px 8px 9px',textAlign:'left',fontSize:'9px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.12em',color:'#9CA3AF',fontFamily:"'JetBrains Mono',monospace"};
  const hdrStyle={display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',flexWrap:'wrap'};

  const DimRow=({dim,label,score})=>(
    <tr>
      <td style={{padding:'10px 8px',fontSize:'12px',fontWeight:'700',borderBottom:'1px solid #F3F4F6',color:'#111827',verticalAlign:'middle'}}>{label}</td>
      <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}><ScoreBadge score={score} /></td>
      <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle',width:'120px'}}><Bar score={score} w={110} /></td>
      <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}><span style={{fontSize:'10px',fontWeight:'800',color:bCol(score),fontFamily:"'JetBrains Mono',monospace"}}>{bd(score)}</span></td>
      <td style={{padding:'10px 8px',fontSize:'11px',color:'#6B7280',borderBottom:'1px solid #F3F4F6',lineHeight:'1.5',maxWidth:'220px',fontWeight:'600'}}>{dimInterp(dim,score)}</td>
    </tr>
  );

  const Sec=({title,mod,modColor,cite,note,dims})=>(
    <div style={cardStyle}>
      <div style={hdrStyle}>
        <Pill label={mod} color={modColor} bg={`${modColor}14`} />
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827'}}>{title}</h3>
        <span className="mono" style={{marginLeft:'auto',fontSize:'9px',color:'#9CA3AF',fontWeight:'600'}}>{cite}</span>
      </div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:'480px'}}>
          <thead><tr style={{borderBottom:'2px solid #F3F4F6'}}>{['Dimension','Score','Profile','Band','Interpretation'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>{dims.map(d=><DimRow key={d[0]} dim={d[0]} label={d[1]} score={d[2]} />)}</tbody>
        </table>
      </div>
      {note&&<div className="mono" style={{marginTop:'10px',padding:'9px 12px',background:'#F9FAFB',borderRadius:'5px',fontSize:'10px',color:'#6B7280',lineHeight:'1.6',fontWeight:'600'}}>{note}</div>}
    </div>
  );

  const techReport=()=>(
    <div>
      {/* Header */}
      <div style={{background:T.bg0,borderRadius:'12px',padding:'36px 40px',marginBottom:'10px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'280px',height:'280px',borderRadius:'50%',background:`radial-gradient(circle,${T.cGlow} 0%,transparent 70%)`}} />
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px',marginBottom:'20px'}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'12px',color:T.gold,letterSpacing:'0.04em',marginBottom:'3px',fontWeight:'600'}}>CORE by Carnelian · Technical Report {cfg.org&&`× ${cfg.org}`}</div>
              <div className="mono" style={{fontSize:'10px',color:T.t3,fontWeight:'600'}}>{docId} · {date} · {cfg.conf}</div>
            </div>
            <Pill label={ind.short} color={T.gold} />
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,5vw,2.8rem)',fontWeight:'700',color:T.t0,marginBottom:'6px'}}>{R.name}</h1>
          <div style={{color:T.t2,fontSize:'13px',lineHeight:'1.8',marginBottom:'14px',fontWeight:'600'}}>{R.role}{R.dept&&` · ${R.dept}`}<br/>{R.email&&`Email: ${R.email} · `}{R.emp&&`ID: ${R.emp} · `}Experience: {R.exp}</div>
          <Pill label={`Profile: ${profile.name}`} color={T.c} style={{marginBottom:'20px'}} />
          <div className="grid-6-col" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'1px',background:T.b2,borderRadius:'8px',overflow:'hidden'}}>
            {[{n:S.OCEANavg,l:'Personality'},{n:S.CQavg,l:'Cultural IQ'},{n:S.OCBavg,l:'Citizenship'},{n:S.LAavg,l:'Learning'},{n:S.EOavg,l:'Integrity'}].map((c,i)=>(
              <div key={i} style={{background:T.bg1,textAlign:'center',padding:'16px 8px'}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',color:T.gold,fontWeight:'700'}}>{c.n}</div>
                <div className="mono" style={{fontSize:'9px',color:T.t3,textTransform:'uppercase',letterSpacing:'0.12em',marginTop:'3px',fontWeight:'600'}}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Composite Indices */}
      <div style={cardStyle}>
        <div style={hdrStyle}>
          <Pill label="Composite Indices" color={T.c} />
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827'}}>Cross-Module Composite Indices</h3>
        </div>
        <p style={{fontSize:'12px',color:'#6B7280',marginBottom:'16px',lineHeight:'1.6',fontWeight:'600'}}>Each index draws from multiple modules simultaneously, weighted by meta-analytic validity evidence. These are the primary decision-making scores for HR leadership.</p>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'500px'}}>
            <thead><tr style={{borderBottom:'2px solid #F3F4F6'}}>{['Index','Score','Profile','Risk','Purpose'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                {n:'Compliance & Integrity (CII)',s:CI.CII,g:70,a:54,p:'Primary screen for treasury, audit, and fiduciary roles.'},
                {n:'Leadership Readiness (LRS)',s:CI.LRS,g:72,a:55,p:'Composite predictor of senior leadership performance.'},
                {n:'Team Value (TVS)',s:CI.TVS,g:68,a:51,p:'Predicts team cohesion contribution.'},
                {n:'Adaptability (ADS)',s:CI.ADS,g:67,a:50,p:'Suitability for change, reform, and innovation roles.'},
                {n:'Stakeholder Effectiveness (SES)',s:CI.SES,g:68,a:52,p:'Client, donor, regulator, and partner effectiveness.'},
                {n:'Operational Reliability (OPS)',s:CI.OPS,g:67,a:51,p:'Sustained delivery and reliability under pressure.'},
                {n:'People Management (PMS)',s:CI.PMS,g:67,a:51,p:'Suitability for team leadership and direct line management.'},
              ].map((row,i)=>(
                <tr key={i}>
                  <td style={{padding:'10px 8px',fontSize:'12px',fontWeight:'700',borderBottom:'1px solid #F3F4F6',color:'#111827',verticalAlign:'middle'}}>{row.n}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}><ScoreBadge score={row.s} /></td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle',width:'120px'}}><Bar score={row.s} w={110} /></td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}><span style={{fontSize:'10px',fontWeight:'800',padding:'3px 8px',borderRadius:'3px',background:sBg(row.s,row.g,row.a),color:sCol(row.s,row.g,row.a),fontFamily:"'JetBrains Mono',monospace"}}>{sLbl(row.s,row.g,row.a)}</span></td>
                  <td style={{padding:'10px 8px',fontSize:'11px',color:'#6B7280',borderBottom:'1px solid #F3F4F6',lineHeight:'1.5',fontWeight:'600'}}>{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validity */}
      <div style={{...cardStyle, background:validity.overall==='green'?T.gnP:validity.overall==='amber'?T.amP:T.rdP, border:`1px solid ${validity.overall==='green'?T.gn:validity.overall==='amber'?T.am:T.rd}35`}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:validity.overall==='green'?T.gn:validity.overall==='amber'?T.am:T.rd}} />
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'600',color:bCol(validity.overall==='green'?80:validity.overall==='amber'?60:20)}}>Response Validity — {validity.overallLabel}</h3>
        </div>
        <div style={{marginBottom:'12px'}}>{validity.flags.map((f,i)=><div key={i} style={{fontSize:'12px',color:bCol(f.type==='green'?80:f.type==='amber'?60:20),marginBottom:'4px',lineHeight:'1.6',fontWeight:'700'}}><strong>{f.key}:</strong> {f.text}</div>)}</div>
        <div className="grid-4-col" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
          {[{n:`${validity.lAgree}/12`,l:'L-Scale'},{n:`${Math.round(validity.saRatio*100)}%`,l:'Strongly Agree'},{n:`${Math.round(validity.extRatio*100)}%`,l:'Extreme'},{n:`${validity.conScore}/100`,l:'Consistency'}].map((v,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.55)',borderRadius:'6px',padding:'10px',textAlign:'center'}}>
              <div className="mono" style={{fontWeight:'700',fontSize:'1.1rem'}}>{v.n}</div>
              <div className="mono" style={{fontSize:'9px',opacity:0.7,marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>{v.l}</div>
            </div>
          ))}
        </div>
      </div>

      <Sec title="Personality at Work — OCEAN" mod="Module I" modColor={T.c} cite="Goldberg (1999) · Barrick & Mount (1991)" note="Meta-analytic validity r = .27 for overall job performance. Conscientiousness (r = .22) most robust." dims={[['O','Openness',S.O],['C','Conscientiousness',S.C],['E','Extraversion',S.E],['A','Agreeableness',S.A],['ES','Emotional Stability',S.ES]]} />
      <Sec title="Cultural Intelligence (CQ)" mod="Module II" modColor={T.gold} cite="Earley & Ang (2003) · Ang et al. (2007)" note="CQ incremental predictive validity β = .31 over IQ and personality for cross-cultural performance." dims={[['CQ_K','Cultural Knowledge',S.CQ_K],['CQ_M','Cultural Motivation',S.CQ_M],['CQ_B','Cultural Behaviour',S.CQ_B]]} />
      <Sec title="Organisational Citizenship Behaviour" mod="Module III" modColor={T.gn} cite="Organ (1988) · Williams & Anderson (1991)" dims={[['OCB_A','Altruism',S.OCB_A],['OCB_CV','Civic Virtue',S.OCB_CV],['OCB_S','Sportsmanship',S.OCB_S],['OCB_CO','Courtesy',S.OCB_CO],['OCB_Cn','Conscientiousness (OCB)',S.OCB_Cn]]} />
      <Sec title="Adaptive Thinking & Learning Agility" mod="Module IV" modColor={T.am} cite="Lombardo & Eichinger (2000)" note="Learning agility is the single strongest predictor of leadership potential beyond current performance." dims={[['LA_MA','Mental Agility',S.LA_MA],['LA_PA','People Agility',S.LA_PA],['LA_CA','Change Agility',S.LA_CA],['LA_RA','Results Agility',S.LA_RA]]} />
      <Sec title="Integrity & Ethical Orientation" mod="Module V" modColor="#8B5CF6" cite="Rest (1986) · Moorman (1991)" note="Ethical orientation criterion validity for misconduct prediction (r = −.41). Low EO scores trigger mandatory ethics training." dims={[['EO_RC','Rule Compliance',S.EO_RC],['EO_T','Transparency & Disclosure',S.EO_T],['EO_ER','Ethical Reasoning',S.EO_ER],['EO_AI','Authentic Integrity',S.EO_AI]]} />

      {/* Game Performance */}
      <div style={cardStyle}>
        <div style={hdrStyle}>
          <Pill label="Behavioural Challenges" color="#8B5CF6" bg="#8B5CF614" />
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827'}}>Challenge Results</h3>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'480px'}}>
            <thead><tr style={{borderBottom:'2px solid #F3F4F6'}}>{['Challenge','Type','Performance','Modifier','Dimensions'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                {c:'Values in Balance',t:'Ethical Elicitation',l:gs.seesaw.label,mod:`${gs.seesaw.bonus>=0?'+':''}${gs.seesaw.bonus}`,pos:gs.seesaw.bonus,d:'Ethical Reasoning (EO_ER)'},
                {c:'Quick Decision Challenge',t:'Situational Judgment',l:gs.scenario1.label,mod:`${gs.scenario1.raw>=0?'+':''}${gs.scenario1.raw}`,pos:gs.scenario1.raw,d:'People Agility, Transparency'},
                {c:'Ethics Under Pressure',t:'Situational Judgment',l:gs.scenario2.label,mod:`${gs.scenario2.raw>=0?'+':''}${gs.scenario2.raw}`,pos:gs.scenario2.raw,d:'Rule Compliance, Authentic Integrity'},
              ].map((row,i)=>(
                <tr key={i}>
                  <td style={{padding:'10px 8px',fontSize:'12px',fontWeight:'700',borderBottom:'1px solid #F3F4F6',color:'#111827',verticalAlign:'middle'}}>{row.c}</td>
                  <td style={{padding:'10px 8px',fontSize:'11px',color:'#6B7280',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle',fontWeight:'600'}}>{row.t}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}><span style={{fontSize:'11px',fontWeight:'700',color:bCol(row.pos>=5?75:row.pos>=0?60:30)}}>{row.l}</span></td>
                  <td className="mono" style={{padding:'10px 8px',fontSize:'12px',fontWeight:'700',color:row.pos>=0?T.gn:T.rd,borderBottom:'1px solid #F3F4F6',verticalAlign:'middle'}}>{row.mod} pts</td>
                  <td style={{padding:'10px 8px',fontSize:'11px',color:'#6B7280',borderBottom:'1px solid #F3F4F6',lineHeight:'1.5',fontWeight:'600'}}>{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Suitability */}
      <div style={cardStyle}>
        <div style={hdrStyle}>
          <Pill label="Role Suitability" color={T.c} />
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827'}}>Role Suitability Matrix</h3>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'480px'}}>
            <thead><tr style={{borderBottom:'2px solid #F3F4F6'}}>{['Role Family','Score','Profile','Verdict','Guidance'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {roles.map((r,i)=>{
                const rat=r.score>=r.g?'green':r.score>=r.a?'amber':'red';
                const fc=rat==='green'?T.gn:rat==='amber'?T.am:T.rd;
                const lbl_=rat==='green'?'Suitable':rat==='amber'?'Conditional':'Not Recommended';
                return(
                  <tr key={i}>
                    <td style={{padding:'10px 8px',fontSize:'12px',fontWeight:'700',borderBottom:'1px solid #F3F4F6',color:'#111827',verticalAlign:'top'}}>{r.name}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'top'}}><ScoreBadge score={r.score} /></td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'top',width:'110px'}}><Bar score={r.score} w={100} /></td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid #F3F4F6',verticalAlign:'top'}}><span style={{fontSize:'10px',fontWeight:'800',color:fc,fontFamily:"'JetBrains Mono',monospace"}}>{lbl_}</span></td>
                    <td style={{padding:'10px 8px',fontSize:'11px',color:'#6B7280',borderBottom:'1px solid #F3F4F6',lineHeight:'1.5',verticalAlign:'top',fontWeight:'600'}}>
                      {rat==='red'?<div style={{color:T.rd}}>{r.redNote}</div>:rat==='amber'?'Use with structured onboarding and defined performance milestones.':'Suitable for deployment. Standard performance management applies.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industry Lens */}
      {cfg.industry&&<div style={darkCard}>
        <div className="mono" style={{fontSize:'9px',fontWeight:'700',color:T.gold,textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:'10px'}}>{ind.short} — Industry Context</div>
        <p style={{fontSize:'13px',color:T.t1,lineHeight:'1.7',marginBottom:'10px',fontWeight:'600'}} dangerouslySetInnerHTML={{__html:ind.lens}} />
        <p style={{fontSize:'12px',color:T.t2,marginBottom:'5px',fontWeight:'600'}}><strong style={{color:T.t0}}>High Potential Benchmark:</strong> {ind.hiPotential}</p>
        <p style={{fontSize:'12px',color:`${T.rd}`,fontWeight:'700'}}><strong>Risk Note:</strong> {ind.riskNote}</p>
      </div>}

      <div className="mono" style={{fontSize:'10px',color:T.t3,background:T.bg1,border:`1px solid ${T.b2}`,padding:'12px 14px',borderRadius:'7px',lineHeight:'1.7',marginBottom:'16px',fontWeight:'600'}}>
        CORE by Carnelian is a self-report instrument with four built-in validity controls. Scores are diagnostic inputs — not standalone hiring decisions. All red-rated categories require triangulation with structured interview. © Carnelian Pvt Ltd. Licensed use only.
      </div>

      <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
        <button onClick={()=>window.print()} style={{padding:'11px 22px',borderRadius:'7px',border:`1px solid ${T.b2}`,cursor:'pointer',background:T.bg1,color:T.t0,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'12px',fontWeight:'700',transition:'all 0.2s'}}>Print Technical Report</button>
        <button onClick={()=>setActiveReport('action')} style={{padding:'11px 22px',borderRadius:'7px',cursor:'pointer',background:T.c,color:'#fff',border:'none',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'12px',fontWeight:'800',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>View Action Plan →</button>
      </div>
    </div>
  );

  const actionReport=()=>{
    const allDims=[
      {k:'C',l:'Conscientiousness',v:S.C,str:'You are a reliable, self-directed professional. People can count on you to deliver.'},
      {k:'O',l:'Openness to Ideas',v:S.O,str:'You bring intellectual curiosity and creative thinking to complex problems.'},
      {k:'E',l:'Social Confidence',v:S.E,str:'You communicate with confidence — effective in leadership and stakeholder roles.'},
      {k:'A',l:'Collaborative Spirit',v:S.A,str:'You are empathetic and cooperative — a team builder who creates safe environments.'},
      {k:'ES',l:'Emotional Resilience',v:S.ES,str:'You remain composed under pressure — invaluable in high-stakes situations.'},
      {k:'CQavg',l:'Cultural Intelligence',v:S.CQavg,str:"You navigate Pakistan's diverse professional landscape with skill."},
      {k:'OCBavg',l:'Organisational Citizenship',v:S.OCBavg,str:'You invest beyond your formal role to support colleagues and institutional health.'},
      {k:'LAavg',l:'Learning Agility',v:S.LAavg,str:'You learn rapidly, reflect honestly, and apply lessons across domains.'},
      {k:'EOavg',l:'Ethical Integrity',v:S.EOavg,str:'Your commitment to transparent, authentic behaviour is professionally differentiating.'},
    ].sort((a,b)=>b.v-a.v);
    const top2=allDims.slice(0,2);
    const bot2=[...allDims].sort((a,b)=>a.v-b.v).slice(0,2);
    const devAreas=[];
    const add=(d,v,why,acts,now,soon,fut)=>devAreas.push({d,v,why,acts,now,soon,fut});
    if(S.C<55) add('Conscientiousness & Delivery',S.C,"Consistent delivery is the foundation of professional credibility.","Use a weekly priority matrix — list your top 3 deliverables;Break large projects into fortnightly milestone check-ins;Track one commitment per week that you made and completed".split(';'),"Agree a weekly check-in with your supervisor on three explicit priority deliverables","Enrol in a personal productivity workshop","Lead a project end-to-end within six months");
    if(S.ES<55) add('Emotional Resilience',S.ES,"High-stakes professional environments involve pressure cycles.","Build a ten-minute daily decompression practice;After difficult situations, write: what happened, how I responded, what I would do differently;Identify two trusted colleagues who can serve as grounded sounding boards".split(';'),"Speak to your HR team about employee assistance programmes","Attend a resilience or emotional intelligence workshop","Seek a role with progressively increasing accountability");
    if(S.CQavg<55) add('Cultural Intelligence',S.CQavg,"Pakistan's professional landscape spans diverse regional, linguistic, and socioeconomic contexts.","Deliberately seek a cross-provincial or cross-departmental project;Before meetings with unfamiliar backgrounds, spend five minutes researching the context;After cross-cultural interactions that felt awkward, examine your own assumptions".split(';'),"Have a genuine conversation with one colleague from a meaningfully different background","Attend a diversity or intercultural workshop","Volunteer for a posting in a different regional office");
    if(S.LAavg<55) add('Learning Agility',S.LAavg,"The professionals who rise in every Pakistani sector are those who learn and adapt fastest.","Dedicate thirty minutes weekly to reading one report outside your normal scope;After completing significant tasks, ask: what did I learn, and how could I apply it elsewhere?;Request feedback from at least two colleagues per quarter".split(';'),"Subscribe to one sector publication you do not currently follow","Build a ninety-day self-directed learning plan on one topic outside your expertise","Facilitate or co-design a training session");
    if(S.EOavg<60) add('Professional Integrity',S.EOavg,"Authentic integrity is the foundation of trust.","Read your organisation's Code of Conduct;Apply the full light test: would you be comfortable if your supervisor, family, and auditor saw exactly what you decided?;Practise full proactive disclosure in your next five reporting situations".split(';'),"Complete any mandatory compliance training that is outstanding","Attend a professional ethics or values-based leadership workshop","Take on a compliance champion role");
    if(S.OCB_S<50) add('Constructive Attitude',S.OCB_S,"How we respond to institutional frustration shapes the morale of everyone around us.","Adopt the solution before complaint rule — before voicing any frustration, have at least one concrete suggestion ready;Create a private journal for institutional frustrations;Make a deliberate decision: either act on a frustration constructively, or release it — not both".split(';'),"Identify one frustration recently shared with colleagues and commit to a more constructive approach","Discuss improvement channels with your line manager","Volunteer to lead a process improvement initiative");

    const bars=[['Overall',S.overall],['Personality',S.OCEANavg],['Cultural Intelligence',S.CQavg],['Citizenship',S.OCBavg],['Learning Agility',S.LAavg],['Ethical Integrity',S.EOavg],['Conscientiousness',S.C],['Emotional Resilience',S.ES]];

    return(
      <div>
        <div style={{background:T.bg0,borderRadius:'12px',padding:'36px 40px',marginBottom:'10px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-50px',right:'-50px',width:'200px',height:'200px',borderRadius:'50%',background:`radial-gradient(circle,${T.goldP} 0%,transparent 70%)`}} />
          <div style={{position:'relative',zIndex:1}}>
            <div className="mono" style={{fontSize:'9px',color:T.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'6px',fontWeight:'700'}}>Personal Development Report</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,2.6rem)',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>{R.name}</h1>
            <p style={{color:T.t2,fontSize:'13px',maxWidth:'520px',lineHeight:'1.75',marginBottom:'22px',fontWeight:'600'}}>This report is written directly to you. It translates your assessment into plain language — what your scores mean, where your genuine strengths lie, and specific actions you can take immediately.</p>
            <div style={{background:`rgba(255,255,255,0.04)`,border:`1px solid ${T.b2}`,borderRadius:'8px',padding:'18px 20px'}}>
              <div className="mono" style={{fontSize:'9px',textTransform:'uppercase',letterSpacing:'0.14em',color:T.gold,fontWeight:'700',marginBottom:'5px'}}>Your Professional Profile</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:T.t0,fontWeight:'700',marginBottom:'5px'}}>{profile.name}</div>
              <div style={{fontSize:'12px',color:T.t2,lineHeight:'1.65',fontWeight:'600'}}>{profile.desc}</div>
            </div>
          </div>
        </div>

        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'10px',padding:'24px 26px',marginBottom:'10px'}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827',marginBottom:'20px'}}>Score Overview</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {bars.map(([l,v],i)=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:'14px',paddingBottom:i===0?'12px':'0',marginBottom:i===0?'2px':'0',borderBottom:i===0?'1px solid #F3F4F6':'none'}}>
                <div style={{width:'175px',flexShrink:0,fontSize:'12px',color:i===0?'#111827':'#6B7280',fontWeight:i===0?'800':'700'}}>{l}</div>
                <div style={{flex:1,background:'#F3F4F6',height:i===0?'8px':'5px',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{width:`${v}%`,height:'100%',background:barGrad(v),borderRadius:'3px',transition:'width 1s ease'}} />
                </div>
                <div className="mono" style={{width:'40px',textAlign:'right',fontSize:'11px',color:bCol(v),fontWeight:'700'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'10px',padding:'24px 26px',marginBottom:'10px'}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827',marginBottom:'16px'}}>Core Strengths & Development Priorities</h3>
          <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>
            {top2.map(d=>(
              <div key={d.k} style={{padding:'18px',borderRadius:'8px',border:'1px solid #E5E7EB',borderLeft:`4px solid ${T.gn}`}}>
                <div className="mono" style={{fontSize:'9px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.12em',color:T.gn,marginBottom:'7px'}}>Core Strength</div>
                <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'600',marginBottom:'5px',color:'#111827'}}>{d.l}</h4>
                <p style={{fontSize:'12px',color:'#6B7280',lineHeight:'1.6',marginBottom:'9px',fontWeight:'600'}}>{d.str}</p>
                <ScoreBadge score={d.v} />
              </div>
            ))}
            {bot2.map(d=>(
              <div key={d.k} style={{padding:'18px',borderRadius:'8px',border:'1px solid #E5E7EB',borderLeft:`4px solid ${T.am}`}}>
                <div className="mono" style={{fontSize:'9px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.12em',color:T.am,marginBottom:'7px'}}>Development Priority</div>
                <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'600',marginBottom:'5px',color:'#111827'}}>{d.l}</h4>
                <p style={{fontSize:'12px',color:'#6B7280',lineHeight:'1.6',marginBottom:'9px',fontWeight:'600'}}>Your highest-leverage development area. Focused effort here creates the greatest impact on overall effectiveness.</p>
                <ScoreBadge score={d.v} />
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'10px',padding:'24px 26px',marginBottom:'10px'}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:'600',color:'#111827',marginBottom:'16px'}}>Development Roadmap</h3>
          {devAreas.length>0?devAreas.map((d,i)=>(
            <div key={i} style={{border:'1px solid #E5E7EB',borderRadius:'8px',padding:'20px 22px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px'}}>
                <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',fontWeight:'600',color:'#111827'}}>{d.d}</h4>
                <ScoreBadge score={d.v} />
              </div>
              <div className="mono" style={{fontSize:'9px',color:'#9CA3AF',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>{bd(d.v)} range</div>
              <div style={{background:`${T.cHalo}`,border:`1px solid ${T.c}20`,borderRadius:'6px',padding:'11px 14px',fontSize:'12px',color:'#374151',lineHeight:'1.7',marginBottom:'12px',fontWeight:'600'}}>{d.why}</div>
              <ul style={{paddingLeft:0,listStyle:'none',marginBottom:'14px'}}>
                {d.acts.map((a,j)=>(
                  <li key={j} style={{display:'flex',gap:'10px',padding:'6px 0',borderBottom:j<d.acts.length-1?'1px solid #F9FAFB':'none',fontSize:'12px',color:'#374151',lineHeight:'1.6',fontWeight:'600'}}>
                    <span style={{color:T.c,fontWeight:'800',flexShrink:0}}>→</span>{a}
                  </li>
                ))}
              </ul>
              <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
                {[{l:`Now: ${d.now}`,bg:T.rdP,c:T.rd},{l:`Soon: ${d.soon}`,bg:T.amP,c:T.am},{l:`Future: ${d.fut}`,bg:T.gnP,c:T.gn}].map((chip,k)=>(
                  <span key={k} style={{padding:'4px 10px',borderRadius:'3px',fontSize:'10px',fontWeight:'700',background:chip.bg,color:chip.c,display:'inline-block'}}>{chip.l}</span>
                ))}
              </div>
            </div>
          )):<div style={{padding:'20px',background:T.gnP,borderRadius:'8px',fontSize:'13px',color:T.gn,fontWeight:'700'}}>No critical development priorities detected. Your profile is well-balanced. Focus on sustaining current strengths and expanding impact through stretch assignments.</div>}
        </div>

        <div style={{background:T.bg0,borderRadius:'10px',padding:'24px 28px'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:T.t0,marginBottom:'8px',fontWeight:'600'}}>A Note to Close</div>
          <p style={{fontSize:'12px',color:T.t2,lineHeight:'1.8',fontWeight:'600'}}>This report is a starting point, not a verdict. Psychometric scores describe tendencies — they do not define your ceiling. Every dimension measured here is developable with deliberate effort and the right support. Use this report in your next conversation with your manager, your training coordinator, or your mentor.</p>
          <div className="mono" style={{marginTop:'12px',fontSize:'9px',color:T.t3,fontWeight:'600'}}>{docId} · CORE by Carnelian · {date}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="report-wrap" style={{maxWidth:'960px',margin:'0 auto',padding:'40px 24px'}}>
      <div style={{display:'flex',gap:'8px',marginBottom:'22px',flexWrap:'wrap'}} className="no-print">
        {[{id:'tech',l:'Technical Report',sub:'HR & Leadership'},{id:'action',l:'Action Plan',sub:'Individual'}].map(r=>(
          <button key={r.id} onClick={()=>setActiveReport(r.id)} style={{
            padding:'10px 20px',borderRadius:'7px',cursor:'pointer',
            fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',
            background:activeReport===r.id?T.bg0:'#fff',
            color:activeReport===r.id?T.t0:'#6B7280',
            border:`1px solid ${activeReport===r.id?T.b2:'#E5E7EB'}`,
            transition:'all 0.18s',
          }}>
            {r.l} <span style={{fontSize:'10px',opacity:0.6,fontWeight:'600'}}>({r.sub})</span>
          </button>
        ))}
      </div>
      {activeReport==='tech'?techReport():actionReport()}
    </div>
  );
};

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
const ProgressPage = () => {
  const [history, setHistory] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEmp, setSearchEmp]     = useState('');
  const [searched, setSearched]       = useState(false);
  const [results, setResults]         = useState([]);

  useEffect(()=>{
    try { setHistory(JSON.parse(localStorage.getItem('core_v1_history')||'[]')); } catch(e){}
  },[]);

  const handleSearch = () => {
    setSearched(true);
    if (!searchEmail.trim() && !searchEmp.trim()) { setResults([]); return; }
    const matches = history.filter(e => {
      const emailHit = searchEmail.trim() && e.email && e.email.toLowerCase() === searchEmail.trim().toLowerCase();
      const empHit   = searchEmp.trim()   && e.emp   && e.emp.toLowerCase()   === searchEmp.trim().toLowerCase();
      return emailHit || empHit;
    });
    // group by unique person identifier
    const byPerson = {};
    matches.forEach(e => {
      const pid = (e.email||'') + '||' + (e.emp||'') + '||' + (e.name||'');
      if (!byPerson[pid]) byPerson[pid] = [];
      byPerson[pid].push(e);
    });
    setResults(Object.values(byPerson));
  };

  const del = (pid_email, pid_emp) => {
    if (!window.confirm('Delete all CORE records for this person?')) return;
    const h = history.filter(e => {
      if (pid_email && e.email && e.email === pid_email) return false;
      if (pid_emp   && e.emp   && e.emp   === pid_emp)   return false;
      return true;
    });
    setHistory(h);
    try { localStorage.setItem('core_v1_history', JSON.stringify(h)); } catch(e){}
    // re-run search
    const updatedResults = results.map(entries =>
      entries.filter(e => {
        if (pid_email && e.email === pid_email) return false;
        if (pid_emp   && e.emp   === pid_emp)   return false;
        return true;
      })
    ).filter(arr => arr.length > 0);
    setResults(updatedResults);
  };

  const compKeys=[['CII','Compliance & Integrity'],['LRS','Leadership Readiness'],['TVS','Team Value'],['ADS','Adaptability'],['SES','Stakeholder'],['OPS','Operational'],['PMS','People Mgmt']];

  const inp = {
    padding:'12px 16px', border:`1px solid ${T.b2}`, borderRadius:'6px',
    fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'600',
    background:T.bg3, color:T.t0, outline:'none', transition:'all 0.2s', flex:1,
  };

  return(
    <div style={{maxWidth:'900px', margin:'0 auto', padding:'56px 24px'}}>
      <Pill label="Progress Tracker" style={{marginBottom:'16px'}} />
      <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'2.4rem', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>Assessment History</h2>
      <p style={{fontSize:'14px', color:T.t2, fontWeight:'600', marginBottom:'36px', lineHeight:'1.7'}}>
        Look up a candidate's assessment history using their <strong style={{color:T.t0}}>email address</strong> or <strong style={{color:T.t0}}>employee / roll number</strong>. Both fields are optional — one is enough.
      </p>

      {/* Search box */}
      <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px 28px', marginBottom:'32px'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', fontWeight:'700', color:T.c, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'16px'}}>Search by Identifier</div>
        <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'12px'}}>
          <input
            value={searchEmail}
            onChange={e=>setSearchEmail(e.target.value)}
            placeholder="Email address"
            style={{...inp, minWidth:'200px'}}
            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
          />
          <input
            value={searchEmp}
            onChange={e=>setSearchEmp(e.target.value)}
            placeholder="Employee / Roll No."
            style={{...inp, minWidth:'180px'}}
            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
          />
          <button
            onClick={handleSearch}
            style={{
              padding:'12px 24px', borderRadius:'6px', border:'none', cursor:'pointer',
              background:T.c, color:'#fff',
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'800',
              letterSpacing:'0.03em', transition:'all 0.2s', whiteSpace:'nowrap',
            }}
            onMouseOver={e=>e.target.style.background=T.cDark}
            onMouseOut={e=>e.target.style.background=T.c}
          >Search →</button>
        </div>
        <div style={{fontSize:'11px', color:T.t3, fontWeight:'600'}}>
          {history.length} record{history.length!==1?'s':''} stored locally on this device.
        </div>
      </div>

      {/* Results */}
      {searched && results.length === 0 && (
        <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'40px', textAlign:'center'}}>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>No records found</div>
          <p style={{fontSize:'13px', color:T.t2, fontWeight:'600'}}>No assessments match the email or employee number you entered. Make sure the candidate used the same identifier when taking the assessment.</p>
        </div>
      )}

      {results.map((entries, ri) => {
        const latest = entries[entries.length-1];
        const prev   = entries.length>=2 ? entries[entries.length-2] : null;
        const delta  = prev ? latest.scores.overall - prev.scores.overall : 0;
        const pid_email = latest.email||'';
        const pid_emp   = latest.emp||'';

        return (
          <div key={ri} style={{background:'#fff', border:'1px solid #E5E7EB', borderRadius:'12px', marginBottom:'20px', overflow:'hidden'}}>
            {/* Header */}
            <div style={{background:T.bg0, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:T.t0, fontWeight:'700', marginBottom:'4px'}}>{latest.name}</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3, fontWeight:'600'}}>
                  {latest.role&&`${latest.role} · `}
                  {latest.org||latest.industry||''}
                  {latest.email&&` · ${latest.email}`}
                  {latest.emp&&` · ID: ${latest.emp}`}
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="mono" style={{fontSize:'9px', color:T.t3, marginBottom:'4px', fontWeight:'600'}}>{entries.length} assessment{entries.length>1?'s':''}</div>
                {prev&&<div className="mono" style={{fontSize:'13px', fontWeight:'800', color:delta>0?T.gn:delta<0?T.rd:T.t3}}>{delta>0?`↑ +${delta}`:delta<0?`↓ ${delta}`:'→ Stable'}</div>}
              </div>
            </div>

            <div style={{padding:'22px 24px'}}>
              {/* Before / After comparison */}
              {prev&&(
                <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px'}}>
                  <div style={{background:'#F9FAFB', borderRadius:'8px', padding:'14px 16px'}}>
                    <div className="mono" style={{fontSize:'9px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'600'}}>Previous · {prev.date}</div>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'600', marginBottom:'5px', color:'#111827'}}>{prev.profile}</div>
                    <div className="mono" style={{fontSize:'1.4rem', color:'#9CA3AF', fontWeight:'700'}}>{prev.scores.overall}/100</div>
                  </div>
                  <div style={{background:T.bg0, borderRadius:'8px', padding:'14px 16px'}}>
                    <div className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'600'}}>Latest · {latest.date}</div>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:T.t0, fontWeight:'700', marginBottom:'5px'}}>{latest.profile}</div>
                    <div className="mono" style={{fontSize:'1.4rem', color:T.gold, fontWeight:'700'}}>{latest.scores.overall}/100 <span style={{fontSize:'11px', color:delta>=0?T.gn:T.rd, fontWeight:'800'}}>({delta>=0?'+':''}{delta})</span></div>
                  </div>
                </div>
              )}

              {/* Timeline of all assessments */}
              {entries.length > 1 && (
                <div style={{marginBottom:'16px'}}>
                  <div className="mono" style={{fontSize:'9px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px', fontWeight:'700'}}>Full History</div>
                  <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                    {entries.map((e,idx)=>(
                      <div key={idx} style={{background:'#F3F4F6', borderRadius:'6px', padding:'8px 12px', textAlign:'center', minWidth:'80px'}}>
                        <div className="mono" style={{fontSize:'8px', color:'#9CA3AF', marginBottom:'3px', fontWeight:'600'}}>{e.date}</div>
                        <div className="mono" style={{fontSize:'14px', fontWeight:'800', color:bCol(e.scores.overall)}}>{e.scores.overall}</div>
                        <div style={{fontSize:'9px', color:'#9CA3AF', fontWeight:'600', lineHeight:'1.3', marginTop:'2px'}}>{e.profile.split(' ').slice(0,2).join(' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimension bars */}
              <div style={{display:'flex', flexDirection:'column', gap:'9px', marginBottom:'16px'}}>
                {compKeys.map(([k,l])=>{
                  const v=latest.scores[k];
                  const d=prev?latest.scores[k]-prev.scores[k]:null;
                  return(
                    <div key={k} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{width:'160px', fontSize:'11px', color:'#374151', flexShrink:0, fontWeight:'700'}}>{l}</div>
                      <div style={{flex:1, background:'#F3F4F6', borderRadius:'3px', height:'6px', overflow:'hidden'}}>
                        <div style={{width:`${v}%`, height:'100%', background:barGrad(v), transition:'width 0.8s ease'}} />
                      </div>
                      <div className="mono" style={{fontSize:'11px', color:bCol(v), width:'28px', textAlign:'right', fontWeight:'700'}}>{v}</div>
                      {d!==null&&<div className="mono" style={{fontSize:'10px', fontWeight:'800', color:d>5?T.gn:d<-5?T.rd:'#9CA3AF', width:'48px', textAlign:'right'}}>{d>5?`▲ +${d}`:d<-5?`▼ ${d}`:'—'}</div>}
                    </div>
                  );
                })}
              </div>

              <button onClick={()=>del(pid_email, pid_emp)} style={{padding:'7px 14px', borderRadius:'5px', border:`1px solid ${T.rdP}`, background:'transparent', color:T.rd, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700', cursor:'pointer'}}>Delete Records</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── METHODOLOGY PAGE ─────────────────────────────────────────────────────────
const MethodologyPage = () => (
  <div style={{maxWidth:'1000px', margin:'0 auto', padding:'80px 32px'}}>
    <div style={{textAlign:'center', marginBottom:'64px'}}>
      <Reveal delay={0}>
        <Pill label="Scientific Foundation" style={{marginBottom:'16px'}} />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:'700', margin:'0 0 8px', color:T.t0}}>
          Validity Controls & Scientific Basis
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <GoldLine style={{width:'60px', margin:'24px auto 0'}} />
      </Reveal>
    </div>

    <Reveal delay={0.1}>
      <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:'700', marginBottom:'20px', color:T.t0}}>Peer-Reviewed References</h3>
    </Reveal>
    <Reveal delay={0.2}>
      <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'8px', padding:'32px', marginBottom:'64px'}}>
        {[
          "Goldberg, L. R. (1999). A broad-bandwidth, public domain personality inventory. Personality Psychology in Europe, 7, 7–28. [IPIP — explicitly public domain, unrestricted commercial use]",
          "Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions and job performance. Personnel Psychology, 44(1), 1–26.",
          "Paulhus, D. L. (1991). Measurement and control of response bias. In J. P. Robinson et al. (Eds.), Measures of Personality and Social Psychological Attitudes.",
          "Earley, P. C., & Ang, S. (2003). Cultural intelligence: Individual interactions across cultures. Stanford University Press.",
          "Ang, S., Van Dyne, L., et al. (2007). Cultural intelligence: Measurement and effects. Management and Organization Review, 3(3), 335–371.",
          "Organ, D. W. (1988). Organizational citizenship behavior: The good soldier syndrome. Lexington Books.",
          "Lombardo, M. M., & Eichinger, R. W. (2000). High potentials as high learners. Human Resource Management, 39(4), 321–329.",
          "Rest, J. R. (1986). Moral development: Advances in research and theory. Praeger.",
          "Crowne, D. P., & Marlowe, D. (1960). A new scale of social desirability. Journal of Consulting Psychology, 24(4), 349–354.",
          "Khalid, S. A., et al. (2009). OCB as a predictor of performance: Pakistani university sample. International Journal of Economics & Finance, 1(2), 139–145.",
        ].map((ref,i)=>(
          <div key={i} className="mono" style={{padding:'12px 16px',background:T.bg2,borderRadius:'6px',marginBottom:'6px',fontSize:'11px',color:T.t2,lineHeight:'1.6',borderLeft:`4px solid ${i%2===0?T.c:T.gold}`,fontWeight:'600'}}>{ref}</div>
        ))}
      </div>
    </Reveal>

    <Reveal delay={0.1}>
      <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:'700', marginBottom:'20px', color:T.t0}}>How CORE Detects Dishonest Responses</h3>
    </Reveal>
    <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'64px'}}>
      {[
        {t:'L-Scale (Lie Scale) — 12 Items',c:T.rd,d:'Twelve items describing near-impossible behaviours — never procrastinating, always feeling positive about every employer. Honest respondents agree with 0–3. Agreement with 6 or more indicates social desirability inflation. Items are deliberately subtle.'},
        {t:'Reverse Consistency Index',c:T.am,d:'Forward and reverse-scored items per dimension are mathematically compared. Scoring high on contradictory items simultaneously is a logical contradiction that gets caught and scored.'},
        {t:'Acquiescence Bias Detection',c:T.c,d:'Respondents choosing "Strongly Agree" on more than 55% of all items — regardless of reverse scoring — are detected. This pattern indicates a response style artifact or deliberate inflation.'},
        {t:'Extreme Response Style Index',c:T.gn,d:'Respondents choosing only extreme responses on more than 70% of items are flagged. Above 85% triggers a hard red. Above 90% triggers a critical override labelling the entire result uninterpretable.'},
      ].map((v,i)=>(
        <Reveal key={i} delay={i * 0.15}>
          <div style={{
            padding:'32px 28px', 
            background:`linear-gradient(${v.c}08, ${v.c}08), ${T.bg1}`, 
            border:`1px solid ${v.c}28`, 
            borderRadius:'8px', 
            height:'100%', 
            transition:'all 0.2s', 
            cursor:'default'
          }}
          onMouseOver={e=>{
            e.currentTarget.style.background=`linear-gradient(${v.c}16, ${v.c}16), ${T.bg1}`; 
            e.currentTarget.style.transform='translateY(-4px)';
          }}
          onMouseOut={e=>{
            e.currentTarget.style.background=`linear-gradient(${v.c}08, ${v.c}08), ${T.bg1}`; 
            e.currentTarget.style.transform='none';
          }}>
            <div className="mono" style={{fontSize:'10px',fontWeight:'700',color:v.c,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'14px',borderBottom:`1px solid ${v.c}28`,paddingBottom:'12px'}}>{v.t}</div>
            <p style={{fontSize:'13px',color:T.t1,lineHeight:'1.7',fontWeight:'600'}}>{v.d}</p>
          </div>
        </Reveal>
      ))}
    </div>

    <Reveal delay={0.1}>
      <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:'700', marginBottom:'20px', color:T.t0}}>Instrument Governance</h3>
    </Reveal>
    <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
      {[
        {h:'Copyright Status',p:'All five CORE modules are built on theoretical constructs that are not copyrightable. IPIP personality items are explicitly public domain. New items authored for CORE constitute original work owned by Carnelian Pvt Ltd.',c:'ipip.ori.org · Goldberg (1999)'},
        {h:'Validity Methodology',p:'L-scale methodology follows Crowne-Marlowe Social Desirability Scale principles (1960). Consistency index adapted from MMPI F-scale methodology. All items are original Carnelian work.',c:'Paulhus (1991) · MMPI principles'},
        {h:'Industry Context Engine',p:"Sector-specific dimension weighting and risk thresholds are derived from meta-analytic evidence on dimension-outcome correlations per industry, combined with Carnelian's practitioner knowledge of Pakistan's professional context.",c:'Barrick & Mount (1991) · Carnelian (2025)'},
        {h:'Commercial Use',p:'CORE is proprietary to Carnelian Pvt Ltd. Client organisations receive a licence to administer and use results internally. The scoring algorithm, validity methodology, and industry profiles are Carnelian intellectual property.',c:'Carnelian Pvt Ltd'},
      ].map((card,i)=>(
        <Reveal key={i} delay={i * 0.15}>
          <div style={{
            background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'8px',
            borderTop:`4px solid ${i%2===0?T.c:T.gold}`,
            padding:'32px 28px', display:'flex', flexDirection:'column', height:'100%',
            transition:'all 0.2s',
          }}
          onMouseOver={e=>{e.currentTarget.style.background=T.bg2; e.currentTarget.style.transform='translateY(-4px)';}}
          onMouseOut={e=>{e.currentTarget.style.background=T.bg1; e.currentTarget.style.transform='none';}}>
            <h4 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:'700', marginBottom:'12px', color:T.t0}}>{card.h}</h4>
            <p style={{fontSize:'13px', color:T.t2, lineHeight:'1.7', flex:1, marginBottom:'20px', fontWeight:'600'}}>{card.p}</p>
            <div style={{height:'1px', background:T.b2, marginBottom:'16px'}} />
            <div className="mono" style={{fontSize:'10px', color:T.c, fontWeight:'700', letterSpacing:'0.1em'}}>{card.c}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('home');
  const [reportData, setReportData] = useState(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('themeMode') || 'dark'; } catch(e) { return 'dark'; }
  });

  // Update T synchronously so all child renders use the correct theme
  T = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    try { localStorage.setItem('themeMode', mode); } catch(e) {}
  }, [mode]);

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem('core_v1_history') || '[]');
      setHasHistory(h.length > 0);
    } catch(e) {}
  }, []);

  const handleSetTab = (t) => {
    setTab(t);
    window.scrollTo({top:0, behavior:'smooth'});
  };

  return (
    <>
      <Fonts mode={mode} />
      <Nav
        tab={tab}
        setTab={handleSetTab}
        hasResults={!!reportData}
        hasHistory={hasHistory}
        mode={mode}
        setMode={setMode}
      />
      {tab==='home'    && <HomePage    setTab={handleSetTab} />}
      {tab==='assess'  && <AssessmentPage setTab={handleSetTab} setReportData={setReportData} setHistoryFlag={setHasHistory} />}
      {tab==='results' && <ResultsPage reportData={reportData} />}
      {tab==='progress'&& <ProgressPage />}
      {tab==='method'  && <MethodologyPage />}
    </>
  );
}