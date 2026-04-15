import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dashboard from './Dashboard';

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
@media print {
  footer { display: none !important; }
}
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
                {title:'Timed Scenario 1', sub:'Dynamic presentation crisis', desc:'A rapid presentation crisis: the candidate must choose under time pressure (dynamically scaled to language proficiency). Tests transparency and adaptive decision-making. Contributes to People Agility and Transparency scores.'},
                {title:'Timed Scenario 2', sub:'Dynamic ethics dilemma', desc:'An ethics dilemma involving relationship pressure and procurement bypass. Tests integrity under social influence and time constraints. Contributes to Rule Compliance and Authentic Integrity scores.'},
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
              {h:'Seven Composite Indices', d:'14 individual dimensions combine into 7 composite indices weighted by published meta-analytic validity evidence: Compliance & Integrity, Leadership Readiness, Team Value, Adaptability, Stakeholder Effectiveness, Operational Reliability, and People Management.'},
              {h:'12-Industry Context Engine', d:"Configure once for your client before assessment begins. The engine adapts the Technical Report's industry lens, risk thresholds, and high-potential benchmarks for 12 Pakistani sectors. The Candidate Action Plan adapts too — providing genuinely contextualised development actions."},
              {h:'Cross-Dimensional Pattern Analysis', d:'Ten named patterns detect dangerous or valuable combinations that individual scores miss entirely. The Performance-Ethics Disconnect, the Charismatic Integrity Risk, the Talented Maverick — patterns research consistently links to institutional misconduct — are flagged automatically.'},
              {h:'Role Suitability Matrix + Interview Probes', d:'Six role families rated Suitable, Conditional, or Not Recommended — each driven by the relevant composite index. Every Not Recommended verdict generates specific behavioural interview probe questions embedded directly in the HR report.'},
              {h:'Two Fully Separated Reports', d:'Technical Report (HR & Leadership): All composite indices, validity breakdown, pattern analysis, and psychometric citations. Candidate Action Plan (The Individual): Plain-language strengths, development areas, and a 30/90/180-day priority matrix. Zero HR risk language.'},
              {h:'Longitudinal Re-Assessment Tracker', d:"Save any candidate's results to the device. When they retake CORE — after a development programme or promotion cycle — a side-by-side progress comparison is generated automatically. Every dimension shows its delta. Prove L&D impact with data."},
              {h:'Engagement-Optimised Experience', d:'Positive reinforcement messages appear after every question. Clear timed challenge warnings mean no candidate is surprised by a clock. The seesaw provides a visual, tactile break. Runs in any browser on any device. No app or login required.'},
              {h:'Four-Layer Lie Detection', d:'12 invisible L-Scale items catch social desirability inflation. Reverse-scored consistency traps detect contradictions. Acquiescence detection flags candidates who click Agree on everything. Extreme response detection catches rushed or careless responding. All four combine into a single Validity Index — with hard overrides for catastrophic combinations.'},
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
  const [resp, setResp] = useState({name:'',email:'',emp:'',cnic:'',dept:'',deptOther:'',role:'',exp:'',gender:'',org:'',purpose:'',industry:'', eng:''});
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
    if(resp.cnic && resp.cnic.length >= 13){
      try{
        const h=JSON.parse(localStorage.getItem('core_v1_history')||'[]');
        const prior=h.filter(e => e.cnic && e.cnic === resp.cnic);
        setPriorFound(prior.length>0?prior[prior.length-1]:null);
      }catch(e){}
    }
  },[resp.cnic]);

  useEffect(()=>{
    if(timerActive&&timer>0){ timerRef.current=setTimeout(()=>setTimer(t=>t-1),1000); }
    else if(timerActive&&timer===0){ setTimerActive(false); setGameLocked(true); setGameChoice({quality:'timeout'}); }
    return()=>clearTimeout(timerRef.current);
  },[timerActive,timer]);

  const getMaxTimer = () => resp.eng === 'Basic' ? 40 : resp.eng === 'Professional' ? 32 : 25;
  const startTimer=()=>{ setTimer(getMaxTimer()); setTimerActive(true); setGameLocked(false); setGameChoice(null); };

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

const generate = async () => { // <-- 1. Make this async
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

    // 2. Create the final report object
    const reportDataObj = {
      scores: S,
      profile,
      validity,
      CI,
      gameSummary,
      respondent: resp,
      cfg: { org: resp.org, industry: resp.industry, purpose: resp.purpose, conf: 'Restricted — HR Leadership Only' },
      docId,
      date,
      roles
    };

    // 3. Save to LocalStorage (for the user's local progress tracker)
    try {
      let h = JSON.parse(localStorage.getItem('core_v1_history') || '[]');
      const actualDept = resp.dept === 'Other' ? resp.deptOther : resp.dept;
      const entry = {
        docId, date, timestamp: Date.now(),
        name: resp.name, email: resp.email || '', emp: resp.emp || '', cnic: resp.cnic || '',
        role: resp.role || '', dept: actualDept || '', exp: resp.exp || '',
        org: resp.org || '', industry: resp.industry || '',
        profile: profile.name, validityOverall: validity.overall,
        scores: { O: S.O, C: S.C, E: S.E, A: S.A, ES: S.ES, CQavg: S.CQavg, OCBavg: S.OCBavg, LAavg: S.LAavg, EOavg: S.EOavg, OCEANavg: S.OCEANavg, overall: S.overall, CII, LRS, TVS, ADS, SES, OPS, PMS }
      };
      const isSamePerson = (e) => {
        if (entry.cnic && e.cnic && entry.cnic === e.cnic) return true;
        return false;
      };
      const others = h.filter(e => !isSamePerson(e));
      const samePersonHistory = h.filter(isSamePerson).slice(-4);
      h = [...others, ...samePersonHistory, entry].slice(-200);
      localStorage.setItem('core_v1_history', JSON.stringify(h));
      setHistoryFlag(true);
    } catch (e) { console.error("Local storage error:", e); }

    // 4. Send to Backend Database (NEW CODE)
    try {
      await fetch('http://localhost:5000/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportDataObj),
      });
      console.log("Successfully saved to database!");
    } catch (error) {
      console.error("Failed to save to database:", error);
      // Note: We catch the error so that even if the backend is down, 
      // the user still gets to see their results on the screen.
    }

    // 5. Update UI State
    setReportData(reportDataObj);
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
                <div><label style={lbl}>Full Name *</label><input value={resp.name} onChange={e=>setResp(r=>({...r,name:e.target.value}))} placeholder="e.g. Ayesha Raza" style={inp(focused.name)} onFocus={()=>setFocused(f=>({...f,name:true}))} onBlur={()=>setFocused(f=>({...f,name:false}))} /></div>
                <div><label style={lbl}>CNIC Number * (No dashes)</label><input value={resp.cnic} onChange={e=>setResp(r=>({...r,cnic:e.target.value.replace(/[^0-9]/g, '')}))} placeholder="e.g. 4210112345671" maxLength="13" style={inp(focused.cnic)} onFocus={()=>setFocused(f=>({...f,cnic:true}))} onBlur={()=>setFocused(f=>({...f,cnic:false}))} /></div>
                <div><label style={lbl}>Email Address</label><input value={resp.email} onChange={e=>setResp(r=>({...r,email:e.target.value}))} placeholder="ayesha@company.com" style={inp(focused.email)} onFocus={()=>setFocused(f=>({...f,email:true}))} onBlur={()=>setFocused(f=>({...f,email:false}))} /></div>
                <div><label style={lbl}>Employee / Roll No.</label><input value={resp.emp} onChange={e=>setResp(r=>({...r,emp:e.target.value}))} placeholder="Optional" style={inp(focused.emp)} onFocus={()=>setFocused(f=>({...f,emp:true}))} onBlur={()=>setFocused(f=>({...f,emp:false}))} /></div>
                
                <div><label style={lbl}>Department</label>
                  <select value={resp.dept} onChange={e=>setResp(r=>({...r,dept:e.target.value}))} style={selStyle}>
                    <option value="">Select…</option>
                    {['Human Resources','Finance / Accounting','Marketing / PR','Sales / Business Development','Operations / Production','Supply Chain / Procurement','IT / Technology','Engineering / R&D','Legal / Compliance / Audit','Customer Service','Administration','Other'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Current Role</label><input value={resp.role} onChange={e=>setResp(r=>({...r,role:e.target.value}))} placeholder="e.g. Deputy Manager" style={inp(focused.role)} onFocus={()=>setFocused(f=>({...f,role:true}))} onBlur={()=>setFocused(f=>({...f,role:false}))} /></div>
                
                {resp.dept === 'Other' && (
                  <div style={{gridColumn: '1 / -1'}}><label style={lbl}>Please Specify Department</label><input value={resp.deptOther} onChange={e=>setResp(r=>({...r,deptOther:e.target.value}))} placeholder="e.g. Quality Assurance" style={inp(focused.deptOther)} onFocus={()=>setFocused(f=>({...f,deptOther:true}))} onBlur={()=>setFocused(f=>({...f,deptOther:false}))} /></div>
                )}
                
                <div><label style={lbl}>Years of Experience *</label>
                  <select value={resp.exp} onChange={e=>setResp(r=>({...r,exp:e.target.value}))} style={selStyle}>
                    <option value="">Select…</option>
                    {['0–2 years','3–5 years','6–10 years','11–15 years','16+ years'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>English Proficiency *</label>
                  <select value={resp.eng} onChange={e=>setResp(r=>({...r,eng:e.target.value}))} style={selStyle}>
                    <option value="">Select…</option>
                    <option value="Fluent/Native">Fluent / Native</option>
                    <option value="Professional">Professional Working</option>
                    <option value="Basic">Basic</option>
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
                <span style={{color:T.gold,fontWeight:'700'}}>→ Unique Identifier:</span> Your CNIC is securely used to track your assessment history and generate progress comparisons across retakes.
              </div>
              <button onClick={()=>{if(!resp.name||!resp.exp||!resp.cnic||resp.cnic.length<13||!resp.eng){alert('Please enter your Full Name, 13-digit CNIC, Years of Experience, and English Proficiency Level.');return;} setIntakeStage(2);}} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>
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
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',fontWeight:'700',color:T.t0,marginBottom:'10px'}}>{isG2?`${getMaxTimer()}-Second Decision Challenge`:`${getMaxTimer()}-Second Ethics Challenge`}</div>
              <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.65',maxWidth:'440px',margin:'0 auto',fontWeight:'500'}}>{isG2?'A real workplace situation will appear. You must read it and choose one of four responses. The clock starts when you click below.':'This is your last timed challenge. It tests ethical decision-making under relationship pressure — one of the most realistic situations professionals face.'}</p>
            </div>
            <div style={{background:T.bg2,borderRadius:'8px',padding:'20px',marginBottom:'24px'}}>
              {[`You have exactly ${getMaxTimer()} seconds — the clock begins immediately`,isG2?'This challenge contributes to your Learning Agility profile':'This challenge contributes to your Ethical Orientation profile','Once you select a response, it is final','Answer as you honestly would — not as an ideal version of yourself'].map((b,i)=>(
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
    const maxT = getMaxTimer();
    const circ=175.9;
    const offset=circ*(1-timer/maxT);
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
                {cur===QS.length-1?'Generate Report →':'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsPage = ({reportData}) => {
  // ─── THEME & HELPERS (defined inline for portability) ─────────────────
  const T = {
    bg0: '#c9c9c9',
    bg1: '#ffffffec',
    t0: '#000000',
    t1: '#000000',
    t2: '#9CA3AF',
    t3: '#6B7280',
    c: '#B01C24',
    cGlow: 'rgba(176, 28, 36, 0.15)',
    gold: '#B8912E',
    goldP: 'rgba(184, 145, 46, 0.12)',
    gn: '#16A34A',
    gnP: 'rgba(22, 163, 74, 0.08)',
    am: '#D97706',
    amP: 'rgba(217, 119, 6, 0.1)',
    rd: '#DC2626',
    rdP: 'rgba(220, 38, 38, 0.08)',
    b2: 'rgba(255,255,255,0.08)'
  };

  const barGrad = (v) => {
    if (v >= 70) return `linear-gradient(90deg, ${T.gn}, #22C55E)`;
    if (v >= 50) return `linear-gradient(90deg, ${T.am}, #F59E0B)`;
    return `linear-gradient(90deg, ${T.rd}, #EF4444)`;
  };

  const bCol = (v) => v >= 70 ? T.gn : v >= 50 ? T.am : T.rd;
  const bd = (v) => v >= 70 ? 'HIGH' : v >= 50 ? 'MID' : 'LOW';

  // ─── EARLY RETURN ────────────────────────────────────────────────────
  if(!reportData) return (
    <div style={{padding:'100px 32px',textAlign:'center',color:T.t2,fontWeight:'600'}}>
      No assessment data found. Please complete the assessment first.
    </div>
  );

  const {scores:S, profile, respondent:R, docId, date} = reportData;

  // ─── PDF DOWNLOAD ────────────────────────────────────────────────────
const downloadPDF = async () => {
  // Load libraries
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.body.appendChild(s);
  });

  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const A4_W = 210, A4_H = 297;

  const firstName = R.name?.split(' ')[0] || 'Professional';
  const logoURL = `${window.location.origin}/logo.png`;

  // Helper to render an HTML string to a canvas and add to PDF
  const addPageFromHTML = async (htmlContent, bgColor = '#F8F7F5') => {
    const container = document.createElement('div');
    container.style.cssText = `
      position:fixed; top:-9999px; left:-9999px;
      width:794px; min-height:1122px;
      background:${bgColor};
      font-family:'Plus Jakarta Sans',sans-serif;
      -webkit-print-color-adjust:exact;
    `;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Wait for fonts/images
    await new Promise(r => setTimeout(r, 400));

    const canvas = await window.html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bgColor,
      width: 794,
      windowWidth: 794,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const canvasH = canvas.height;
    const canvasW = canvas.width;
    const pageHeightPx = (canvasW / A4_W) * A4_H;
    const totalPages = Math.ceil(canvasH / pageHeightPx);

    for (let pg = 0; pg < totalPages; pg++) {
      if (pg > 0 || pdf.internal.pages.length > 1) pdf.addPage();
      const srcY = pg * pageHeightPx;
      const srcH = Math.min(pageHeightPx, canvasH - srcY);
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvasW;
      sliceCanvas.height = pageHeightPx;
      const ctx = sliceCanvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, pageHeightPx);
      ctx.drawImage(canvas, 0, srcY, canvasW, srcH, 0, 0, canvasW, srcH);
      const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(sliceData, 'JPEG', 0, 0, A4_W, A4_H);
    }
  };

  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;

  const baseStyles = `
    ${fontLink}
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body, div, p, span, h1, h2, h3, h4, h5 {
        font-family:'Plus Jakarta Sans',sans-serif;
      }
      .serif { font-family:'Playfair Display',serif !important; }
      .mono { font-family:'Courier New',monospace !important; }
    </style>
  `;

  // ── PAGE WRAPPER (centered A4 content area) ──────────────────────────
  const wrap = (content, bg = '#F8F7F5', pad = '56px 64px') => `
    ${baseStyles}
    <div style="width:794px;min-height:1122px;background:${bg};padding:${pad};box-sizing:border-box;display:flex;flex-direction:column;">
      ${content}
    </div>`;

  // ══════════════════════════════════
  // PAGE 1 — COVER
  // ══════════════════════════════════
  await addPageFromHTML(wrap(`
    <div style="position:absolute;top:0;left:0;right:0;height:6px;background:#B01C24;"></div>
    <div style="position:absolute;top:-100px;right:-80px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.09) 0%,transparent 72%);"></div>

    <div style="display:flex;align-items:center;gap:14px;margin-bottom:auto;position:relative;z-index:2;">
      <img src="${logoURL}" style="width:52px;height:52px;object-fit:contain;" crossorigin="anonymous"/>
      <div>
        <div class="serif" style="font-size:32px;font-weight:700;line-height:1;color:#B8912E;letter-spacing:0.01em;">CORE</div>
        <div class="mono" style="font-size:9px;font-weight:800;color:#B01C24;letter-spacing:0.22em;text-transform:uppercase;margin-top:3px;">By Carnelian</div>
      </div>
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 0 40px;position:relative;z-index:2;">
      <div class="mono" style="font-size:10px;font-weight:800;color:#B01C24;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:20px;">Personal Action Plan</div>
      <h1 class="serif" style="font-size:58px;line-height:1.06;font-weight:700;color:#111111;margin:0 0 22px;max-width:650px;">${R.name}</h1>
      <div style="display:inline-block;padding:10px 20px;border:1px solid #D8C9A0;border-radius:999px;background:#FFF9EC;color:#8D6B15;font-size:12px;font-weight:800;width:fit-content;">${profile?.name || 'Professional Profile'}</div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-top:22px;border-top:1px solid #E6E0D4;position:relative;z-index:2;">
      <div style="font-size:11px;color:#6B7280;font-weight:700;letter-spacing:0.06em;">CORE by Carnelian</div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#6B7280;font-weight:700;margin-bottom:5px;">${date}</div>
        <div class="mono" style="font-size:10px;color:#9CA3AF;font-weight:700;letter-spacing:0.08em;">${docId}</div>
      </div>
    </div>
  `, '#F8F7F5', '56px 64px'), '#F8F7F5');

  // ══════════════════════════════════
  // PAGE 2 — WELCOME + SCORES
  // ══════════════════════════════════
  const barsHTML = bars.map(([l, v], i) => {
    const color = v >= 70 ? '#16A34A' : v >= 50 ? '#D97706' : '#DC2626';
    const grad = v >= 70 ? 'linear-gradient(90deg,#16A34A,#22C55E)' : v >= 50 ? 'linear-gradient(90deg,#D97706,#F59E0B)' : 'linear-gradient(90deg,#DC2626,#EF4444)';
    return `
      <div style="display:flex;align-items:center;gap:14px;padding-bottom:${i===0?'14px':'0'};margin-bottom:${i===0?'6px':'0'};border-bottom:${i===0?'1px solid #F3F4F6':'none'}">
        <div style="width:170px;flex-shrink:0;font-size:12px;color:${i===0?'#111827':'#4B5563'};font-weight:${i===0?'800':'700'};">${l}</div>
        <div style="flex:1;background:#F3F4F6;height:${i===0?'9px':'5px'};border-radius:4px;overflow:hidden;">
          <div style="width:${Math.max(0,Math.min(100,v))}%;height:100%;background:${grad};border-radius:4px;"></div>
        </div>
        <div class="mono" style="width:36px;text-align:right;font-size:11px;color:${color};font-weight:800;">${v}</div>
      </div>`;
  }).join('');

  await addPageFromHTML(wrap(`
    <!-- Welcome dark card -->
    <div style="background:#1A1A1A;border-radius:12px;padding:36px;margin-bottom:20px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(184,145,46,0.12) 0%,transparent 70%);"></div>
      <div style="position:relative;z-index:1;">
        <div class="mono" style="font-size:9px;color:#B8912E;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Personal Blueprint</div>
        <h2 class="serif" style="font-size:2rem;font-weight:700;color:#fff;margin-bottom:14px;">Welcome, ${firstName}.</h2>
        <p style="color:#E5E7EB;font-size:13px;line-height:1.75;margin-bottom:12px;font-weight:500;">Thank you for trusting us with your reflections. We know that taking an assessment can feel vulnerable. Please know that this report is not a judgment, nor a final verdict on who you are. Human beings are beautifully complex, and psychometrics simply capture a snapshot of your current professional habits.</p>
        <p style="color:#E5E7EB;font-size:13px;line-height:1.75;margin-bottom:22px;font-weight:500;">Think of this document as a mirror held up to your professional self—designed to celebrate your natural gifts and gently highlight the spaces where you have the greatest room to grow.</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:20px;border-left:4px solid #B01C24;">
          <div class="mono" style="font-size:8px;text-transform:uppercase;letter-spacing:0.14em;color:#B8912E;font-weight:700;margin-bottom:7px;">Your Natural Work Style</div>
          <div class="serif" style="font-size:1.5rem;color:#fff;font-weight:700;margin-bottom:8px;">${profile?.name || 'Professional Profile'}</div>
          <div style="font-size:12px;color:#9CA3AF;line-height:1.6;font-weight:600;">${profile?.desc || 'A reliable and principled professional with strong compliance orientation.'}</div>
        </div>
      </div>
    </div>

    <!-- Score Landscape -->
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:28px 32px;">
      <h3 class="serif" style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:20px;">Your Score Landscape</h3>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${barsHTML}
      </div>
    </div>
  `));

  // ══════════════════════════════════
  // PAGE 3 — STRENGTHS
  // ══════════════════════════════════
  const strengthsHTML = top2.map(d => `
    <div style="padding:22px;border-radius:10px;background:#F0FDF4;border:1px solid #BBF7D0;border-left:5px solid #16A34A;">
      <div class="mono" style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#15803D;margin-bottom:7px;">Core Strength</div>
      <h4 class="serif" style="font-size:1.2rem;font-weight:700;margin-bottom:8px;color:#166534;">${d.l}</h4>
      <p style="font-size:12px;color:#15803D;line-height:1.65;font-weight:500;margin-bottom:14px;">${d.str}</p>
      <span style="padding:3px 10px;background:#DCFCE7;color:#166534;border-radius:4px;font-size:10px;font-weight:800;">${d.v}/100</span>
    </div>`).join('');

  await addPageFromHTML(wrap(`
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px 36px;">
      <h3 class="serif" style="font-size:1.3rem;font-weight:700;color:#111827;margin-bottom:10px;">What You Bring to the Table</h3>
      <p style="color:#4B5563;font-size:12px;line-height:1.7;margin-bottom:22px;font-weight:500;">These are your anchor strengths. When things get difficult, these are the natural instincts you rely on. Lean into them—they are what make you uniquely valuable to your team.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${strengthsHTML}
      </div>
    </div>
  `));

  // ══════════════════════════════════
  // PAGE(S) 4+ — DEVELOPMENT ROADMAP (one card per page)
  // ══════════════════════════════════
  for (const d of devAreas) {
    const habitsHTML = d.habits.map(h => `
      <li style="display:flex;gap:10px;padding:7px 0;font-size:12px;color:#374151;line-height:1.55;font-weight:500;">
        <span style="color:#D97706;font-weight:800;flex-shrink:0;">→</span>
        <span><strong style="color:#111827;">${h.h}</strong> ${h.t}</span>
      </li>`).join('');

    await addPageFromHTML(wrap(`
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
          <h4 class="serif" style="font-size:1.4rem;font-weight:700;color:#111827;">${d.d}</h4>
          <span style="padding:5px 12px;background:rgba(217,119,6,0.1);color:#D97706;border-radius:6px;font-size:12px;font-weight:800;">${d.v}/100</span>
        </div>
        <div class="mono" style="font-size:9px;color:#6B7280;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800;">${d.v >= 70 ? 'HIGH' : d.v >= 50 ? 'MID' : 'LOW'} range</div>

        <p style="font-size:12.5px;color:#4B5563;line-height:1.75;margin-bottom:24px;font-weight:500;padding:16px;background:#F9FAFB;border-radius:8px;border-left:4px solid #D97706;">${d.empathyIntro}</p>

        <h5 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;font-weight:800;margin-bottom:14px;">Daily Habits to Build:</h5>
        <ul style="padding-left:0;list-style:none;margin-bottom:28px;">${habitsHTML}</ul>

        <h5 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;font-weight:800;margin-bottom:14px;">Your Growth Timeline:</h5>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:18px;background:#FEF2F2;padding:16px;border-radius:8px;border-left:4px solid #DC2626;align-items:flex-start;">
            <div style="min-width:80px;font-size:11px;font-weight:800;color:#DC2626;text-transform:uppercase;letter-spacing:0.04em;">Now<br/><span style="font-size:8px;opacity:0.8">(0–30 Days)</span></div>
            <div style="font-size:12.5px;color:#7F1D1D;line-height:1.55;font-weight:600;">${d.day30}</div>
          </div>
          <div style="display:flex;gap:18px;background:#FFFBEB;padding:16px;border-radius:8px;border-left:4px solid #D97706;align-items:flex-start;">
            <div style="min-width:80px;font-size:11px;font-weight:800;color:#D97706;text-transform:uppercase;letter-spacing:0.04em;">Soon<br/><span style="font-size:8px;opacity:0.8">(30–90 Days)</span></div>
            <div style="font-size:12.5px;color:#92400E;line-height:1.55;font-weight:600;">${d.day90}</div>
          </div>
          <div style="display:flex;gap:18px;background:#F0FDF4;padding:16px;border-radius:8px;border-left:4px solid #16A34A;align-items:flex-start;">
            <div style="min-width:80px;font-size:11px;font-weight:800;color:#16A34A;text-transform:uppercase;letter-spacing:0.04em;">Future<br/><span style="font-size:8px;opacity:0.8">(90–180 Days)</span></div>
            <div style="font-size:12.5px;color:#166534;line-height:1.55;font-weight:600;">${d.day180}</div>
          </div>
        </div>
      </div>
    `));
  }

  // ══════════════════════════════════
  // NEXT PAGE — PRIORITY ACTION MATRIX
  // ══════════════════════════════════
  const matrixCards = [
    {bg:'#FEF2F2',border:'#FECACA',color:'#B91C1C',title:'1. Act Now (0–30 Days)',sub:'Micro-Habit Formation',text:"Focus purely on the 'Daily Habits' listed in your roadmap. Pick just one dimension to start. Do not attempt a massive overhaul—focus on tiny, 5-minute behavioral shifts that you can sustain daily without burnout."},
    {bg:'#FFFBEB',border:'#FDE68A',color:'#D97706',title:'2. Build Soon (30–90 Days)',sub:'Social Accountability',text:'Involve others. Share your specific development goals with a trusted manager or mentor. This is the phase for enrolling in workshops, restructuring your workflows, and actively asking colleagues for feedback.'},
    {bg:'#F0FDF4',border:'#BBF7D0',color:'#15803D',title:'3. Sustain (90–180 Days)',sub:'Pressure Testing',text:'Transition from learning to leading. Take ownership of a complex project that forces you to use your new skills under pressure. Cement your new brand within the team by delivering consistently.'},
    {bg:'#F3F4F6',border:'#E5E7EB',color:'#4B5563',title:'4. The Feedback Loop',sub:'Measuring Success',text:'Book a recurring 15-minute calendar block on the last Friday of every month. Ask yourself: "Am I reacting out of habit, or responding with intention?" Adjust your approach based on what is working.'},
    {bg:'#EFF6FF',border:'#BFDBFE',color:'#1D4ED8',title:'5. Anticipating Relapse',sub:'Grace Under Fire',text:'When stress hits, you will likely revert to old habits. Expect this. When it happens, do not abandon the plan. Acknowledge the slip, reset your environment, and start fresh the very next morning.'},
    {bg:'#FAF5FF',border:'#E9D5FF',color:'#7E22CE',title:'6. Expanding Impact',sub:'Teaching Others',text:'The ultimate test of mastering a new skill is teaching it. Once you have solidified your new habits, look for a junior colleague struggling with the same issues and gently mentor them through your process.'}
  ].map(item => `
    <div style="background:${item.bg};border:1px solid ${item.border};border-radius:10px;padding:20px;">
      <div style="font-size:11px;font-weight:800;color:${item.color};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">${item.title}</div>
      <div style="font-size:13px;font-weight:700;color:${item.color};margin-bottom:7px;">${item.sub}</div>
      <p style="font-size:11.5px;color:${item.color};line-height:1.55;font-weight:500;opacity:0.85;">${item.text}</p>
    </div>`).join('');

  await addPageFromHTML(wrap(`
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px 36px;">
      <h3 class="serif" style="font-size:1.3rem;font-weight:700;color:#111827;margin-bottom:10px;">Priority Action Matrix</h3>
      <p style="color:#4B5563;font-size:12px;line-height:1.7;margin-bottom:28px;font-weight:500;">A comprehensive visual guide on how to distribute your energy over the next 6 months for maximum career impact.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        ${matrixCards}
      </div>
    </div>
  `));

  // ══════════════════════════════════
  // LAST PAGE — CTA
  // ══════════════════════════════════
  await addPageFromHTML(wrap(`
    <div style="background:#1A1A1A;border-radius:12px;padding:56px 48px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="width:56px;height:56px;background:rgba(184,145,46,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:26px;">🤝</div>
      <h3 class="serif" style="font-size:1.8rem;font-weight:700;color:#B8912E;margin-bottom:16px;">Let's Build Your Path Together</h3>
      <p style="color:#E5E7EB;font-size:13px;line-height:1.8;max-width:540px;margin:0 auto 32px;font-weight:500;">Reading a report is just the first step. If you found these insights helpful but want to dive deeper into what this means for your specific career trajectory, leadership style, or current workplace challenges, our consultants are here to guide you through a 1-on-1 debrief.</p>
      <div style="padding:14px 32px;border-radius:8px;border:2px solid #B01C24;color:#fff;font-size:13px;font-weight:800;display:inline-block;">Reach out at hello@carnelianco.com</div>
      <div class="mono" style="margin-top:36px;font-size:9px;color:#6B7280;font-weight:600;">${docId} · CORE by Carnelian · ${date}</div>
    </div>
  `));

  // ── SAVE ────────────────────────────────────────────────────────────
  pdf.deletePage(1);
  pdf.save(`${R.name?.replace(/\s+/g,'_') || 'ActionPlan'}_CORE_ActionPlan.pdf`);
};

  // ─── DIMENSION DATA ──────────────────────────────────────────────────
  const allDims = [
    {k:'C', l:'Conscientiousness', v:S.C, str:'You possess a remarkable inner drive. People know they can rely on you to bring order and completion to your environments. You are the anchor that ensures projects cross the finish line.'},
    {k:'O', l:'Openness to Ideas', v:S.O, str:'You bring a beautiful intellectual curiosity to complex, messy problems. You are naturally wired to see possibilities where others only see roadblocks.'},
    {k:'E', l:'Social Confidence', v:S.E, str:'Your natural presence allows you to lead and connect with genuine ease. You bring energy into the rooms you enter and can rally stakeholders around a shared vision.'},
    {k:'A', l:'Collaborative Spirit', v:S.A, str:'You have a deep capacity for empathy. You create environments where others feel psychologically safe, valued, and willing to share their best ideas.'},
    {k:'ES', l:'Emotional Resilience', v:S.ES, str:'You carry a quiet strength that grounds you and your team during turbulent times. You are an anchor in the storm, capable of making rational decisions under intense pressure.'},
    {k:'CQavg', l:'Cultural Intelligence', v:S.CQavg, str:"You intuitively navigate the beautiful complexities of Pakistan's diverse environments with profound respect and adaptability. You build bridges across different backgrounds effortlessly."},
    {k:'OCBavg', l:'Organisational Citizenship', v:S.OCBavg, str:'You give selflessly to your institution, often doing the unseen work that holds teams together, resolves quiet conflicts, and builds true, lasting workplace culture.'},
    {k:'LAavg', l:'Learning Agility', v:S.LAavg, str:'Your mind is beautifully adaptable. You absorb lessons quickly, reflect honestly on your missteps, and apply those insights rapidly to entirely new challenges.'},
    {k:'EOavg', l:'Ethical Integrity', v:S.EOavg, str:'You are anchored by a profound sense of right and wrong. Your commitment to transparent, authentic behaviour is a rare gift that builds deep, unshakeable trust with your colleagues.'},
  ].filter(d => d.v !== undefined && d.v !== null).sort((a,b) => b.v - a.v);
  
  const top2 = allDims.slice(0, 2);
  const devAreas = [];
  const add = (d, v, empathyIntro, habits, day30, day90, day180) => 
    devAreas.push({d, v, empathyIntro, habits, day30, day90, day180});

  // ─── DEVELOPMENT AREA LOGIC ─────────────────────────────────────────
  if(S.C < 55) add('Conscientiousness & Delivery', S.C,
    "Consistent delivery is the foundation of professional credibility. We notice that under heavy workloads, your tracking systems might occasionally slip. This isn't about working 'harder'; it's about building a safety net for your brilliant ideas so nothing falls through the cracks. Creating reliable personal systems will free up your mental bandwidth and bring you immense peace of mind.",
    [
      {h:"The Priority Matrix:", t:"Use a weekly priority matrix — explicitly list your top 3 non-negotiable deliverables before Monday morning begins."},
      {h:"Milestone Mapping:", t:"Break large, overwhelming projects into fortnightly (or even weekly) milestone check-ins to create a constant sense of momentum."},
      {h:"The Completion Audit:", t:"Track one commitment per week that you made and successfully completed. Write it down to build a psychological habit of closure."},
      {h:"The 'Touch It Once' Rule:", t:"If an email or minor request takes less than 2 minutes to resolve, do it immediately rather than saving it for later."}
    ],
    "Agree to a weekly 15-minute check-in with your supervisor focusing strictly on three explicit priority deliverables. Remove all ambiguity about what 'done' looks like.",
    "Enroll in a personal productivity workshop or adopt a formal tracking system (like Trello, Asana, or a structured planner). Transition from keeping tasks 'in your head' to keeping them on paper.",
    "Lead a project end-to-end within six months. Map out the timeline, anticipate the bottlenecks, and deliver it exactly on the agreed-upon date to cement your new reputation for reliability."
  );

  if(S.ES < 55) add('Emotional Resilience', S.ES,
    "High-stakes professional environments involve intense pressure cycles, and it is completely natural to feel the weight of that. Building emotional resilience is about protecting your energy. By creating healthy boundaries and decompression rituals, you can remain grounded and effective even when the environment around you is chaotic.",
    [
      {h:"The Decompression Buffer:", t:"Build a ten-minute daily decompression practice between work and home. Use this time to actively 'switch off' your professional brain."},
      {h:"The Post-Crisis Autopsy:", t:"After difficult situations, write down three things: what actually happened, how you instinctively responded, and what you would do differently next time."},
      {h:"Grounding Anchors:", t:"Identify two trusted colleagues who can serve as grounded sounding boards—people who listen without amplifying your anxiety."},
      {h:"Strategic Pauses:", t:"When faced with an urgent crisis or aggressive email, practice taking a 5-minute physical step away from your desk before responding."}
    ],
    "Speak to your HR team about employee assistance programmes, or implement a strict 'no-email after 7 PM' rule to guarantee your nervous system gets a chance to recover daily.",
    "Attend a resilience, stress-management, or emotional intelligence workshop. Focus specifically on techniques for separating your self-worth from temporary professional setbacks.",
    "Seek a role or project with progressively increasing accountability. Navigate it using your new boundary tools, proving to yourself that you can handle increased stakes without sacrificing your internal peace."
  );

  if(S.LAavg < 55) add('Learning Agility', S.LAavg,
    "The professionals who rise fastest in every Pakistani sector are those who learn and adapt fastest. Cultivating a beautifully adaptable mind means getting comfortable with being a 'beginner' again. It is about structured curiosity and realizing that every challenge is just data for your growth.",
    [
      {h:"The Weekly Expansion:", t:"Dedicate thirty minutes weekly to reading one report, article, or case study completely outside your normal scope of work."},
      {h:"The Reflection Habit:", t:"After completing significant tasks, ask yourself: 'What did I actually learn here, and how could I apply this exact lesson to a different department?'"},
      {h:"Feedback as Fuel:", t:"Request constructive feedback from at least two colleagues per quarter. Ask specifically: 'What is one blind spot you think I have?'"},
      {h:"Embracing Ambiguity:", t:"When given a task with unclear instructions, try to map out a proposed solution first before immediately asking for clarification."}
    ],
    "Subscribe to one sector publication or newsletter you do not currently follow. Commit to bringing one new external idea to your team meetings this month.",
    "Build a ninety-day self-directed learning plan on one topic completely outside your current expertise (e.g., basic data analytics, financial literacy, or a new software).",
    "Facilitate or co-design a training session for your broader team. Teach them the new skill you've been practicing, proving that you have transitioned from a learner to an institutional resource."
  );

  if(S.OCB_S < 50) add('Constructive Attitude', S.OCB_S,
    "How we respond to institutional frustration shapes the morale of everyone around us. Every organization has imperfections, and it is easy to let frustrations build up. Shifting toward a constructive attitude protects your own joy at work and makes you a deeply stabilizing, magnetic presence for your colleagues.",
    [
      {h:"Solution Before Complaint:", t:"Adopt the 'solution before complaint' rule — before voicing any frustration to a colleague, force yourself to have at least one concrete suggestion ready."},
      {h:"The Private Outlet:", t:"Create a private journal for institutional frustrations. Write them down to get them out of your head, but do not broadcast them to the floor."},
      {h:"The Deliberate Choice:", t:"Make a deliberate decision: either act on a frustration constructively to fix it, or actively release it — but do not let it linger as passive complaints."},
      {h:"The Venting Boundary:", t:"Politely excuse yourself from toxic venting sessions at the watercooler. Protect your mental diet."}
    ],
    "Identify one recurring frustration you have recently shared with colleagues. Make a private commitment to stop complaining about it for the next 30 days, focusing only on how you can adapt to it.",
    "Discuss improvement channels with your line manager. Take one of your biggest process frustrations and turn it into a formal, polite, written proposal for improvement.",
    "Volunteer to lead a culture or process-improvement initiative. Guide the team through institutional roadblocks with a visibly positive, resilient mindset, proving you can elevate team morale."
  );

  if(S.CQavg < 55) add('Cultural Intelligence', S.CQavg,
    "Pakistan's professional landscape spans an incredibly beautiful, complex tapestry of regional, linguistic, and socioeconomic contexts. Expanding your cultural intelligence will make you a powerful bridge-builder. It is about moving from simply 'accepting' diversity to actively leveraging it to create stronger teams.",
    [
      {h:"The Empathetic Pause:", t:"Before meetings with colleagues from unfamiliar backgrounds, spend five minutes considering their unique operational context and constraints."},
      {h:"Curiosity Over Assumption:", t:"When someone approaches a problem differently than you would, replace the thought 'Why are they doing it wrong?' with 'What context am I missing?'"},
      {h:"Adaptive Communication:", t:"Practice adjusting your tone. Notice when a situation requires deep formal respect, versus when it requires warm, informal connection."},
      {h:"Active Listening:", t:"In cross-departmental meetings, make it a habit to speak last. Listen to how different groups frame their priorities before offering your solution."}
    ],
    "Have a genuine, non-work-related 20-minute conversation with a colleague from a meaningfully different regional or departmental background. Listen purely to understand.",
    "Identify a recurring communication friction point you experience with a specific stakeholder group. Experiment with a completely different communication style and observe the shift.",
    "Volunteer to co-lead a cross-provincial or cross-departmental initiative. Use your growing cultural agility to ensure that all voices are actively integrated into the final solution."
  );

  if(S.EOavg < 60) add('Professional Integrity', S.EOavg,
    "Authentic integrity is the ultimate foundation of professional trust. Sometimes, the pressure to deliver results can blur the lines of policy. Strengthening this dimension is about aligning your daily actions with your deepest values, ensuring you have the courage to do what is right, even when it is difficult or unpopular.",
    [
      {h:"The Full Light Test:", t:"Before making a gray-area decision, ask: 'Would I be completely comfortable if my family, my CEO, and an auditor saw this exact choice?'"},
      {h:"Proactive Transparency:", t:"Share bad news early. It is always better to say 'We have a problem' today than 'I hid a problem' tomorrow."},
      {h:"Consultation Over Isolation:", t:"When faced with an ethical dilemma, do not carry the burden alone. Consult a mentor or compliance officer immediately."},
      {h:"Documenting Decisions:", t:"Make it a habit to write down the 'why' behind your major decisions. Clear documentation is the strongest defense of your integrity."}
    ],
    "Review your organization's core values and explicitly map how your current projects align with them. Identify one area where you have been taking a 'shortcut' and correct it.",
    "Practice 'Courageous Dissent.' In your next team meeting, if a proposed solution feels slightly misaligned with ethical best practices, politely but firmly raise the concern.",
    "Become an informal 'Ethics Champion' within your unit. Mentor a junior colleague on the importance of transparency, showing them that reputation is more valuable than convenience."
  );

  const bars = [
    ['Overall Match', S.overall],
    ['Personality & Drive', S.OCEANavg],
    ['Cultural Agility', S.CQavg],
    ['Team Citizenship', S.OCBavg],
    ['Learning Agility', S.LAavg],
    ['Ethical Integrity', S.EOavg],
    ['Conscientiousness', S.C],
    ['Emotional Resilience', S.ES]
  ].filter(([_,v]) => v !== undefined && v !== null);

  // ─── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="report-wrap" style={{maxWidth:'960px', margin:'0 auto', padding:'40px 24px', fontFamily:"'Plus Jakarta Sans', sans-serif", color: T.t1}}>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .mono { font-family: 'Courier New', monospace; }
        .grid-2-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 768px) { .grid-2-col { grid-template-columns: 1fr; } }
      `}</style>

      {/* Download Button */}
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'20px'}} className="no-print">
        <button onClick={downloadPDF} style={{
          padding:'12px 24px', borderRadius:'7px', cursor:'pointer',
          background:T.c, color:'#fff', border:'none',
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'800',
          boxShadow:`0 8px 16px ${T.cGlow}`, transition:'all 0.2s'
        }} onMouseOver={(e) => {e.target.style.background='#8B161A'; e.target.style.transform='translateY(-1px)';}} 
        onMouseOut={(e) => {e.target.style.background=T.c; e.target.style.transform='translateY(0)';}}>
          Download Action Plan (PDF) ↓
        </button>
      </div>

      <div id="action-plan-content" style={{background: T.bg0, padding: '0', borderRadius:'12px'}}>
        
        {/* ─── PDF COVER PAGE ─── */}
        <div id="pdf-cover-page" style={{
          display: 'none', height: '1122px', width: '100%', background: '#F8F7F5',
          position: 'relative', overflow: 'hidden', padding: '90px 72px 70px',
          boxSizing: 'border-box', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#B01C24' }} />
          <div style={{position:'absolute',top:'-120px',right:'-100px',width:'420px',height:'420px',borderRadius:'50%',background:'radial-gradient(circle, rgba(200,168,75,0.10) 0%, transparent 72%)'}} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
              <img src="/logo.png" alt="Carnelian logo" style={{ width: '54px', height: '54px', objectFit: 'contain' }} />
              <div>
                <div style={{fontFamily:"'Playfair Display', serif", fontSize:'34px', fontWeight:'700', lineHeight:1, color:'#B8912E', letterSpacing:'0.01em'}}>CORE</div>
                <div style={{fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'10px', fontWeight:'800', color:'#B01C24', letterSpacing:'0.22em', textTransform:'uppercase', marginTop:'4px'}}>By Carnelian</div>
              </div>
            </div>
            <div style={{ marginTop: '110px' }}>
              <div style={{fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'11px', fontWeight:'800', color:'#B01C24', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'18px'}}>Personal Action Plan</div>
              <h1 style={{fontFamily:"'Playfair Display', serif", fontSize:'52px', lineHeight:1.08, fontWeight:'700', color:'#111111', margin:'0 0 18px', maxWidth:'700px'}}>{R.name}</h1>
              <div style={{display:'inline-block', padding:'10px 18px', border:'1px solid #D8C9A0', borderRadius:'999px', background:'#FFF9EC', color:'#8D6B15', fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'12px', fontWeight:'800'}}>{profile?.name || 'Professional Profile'}</div>
            </div>
          </div>

          <div style={{position:'relative', zIndex:2, display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:'80px', paddingTop:'24px', borderTop:'1px solid #E6E0D4'}}>
            <div style={{fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'11px', color:'#6B7280', fontWeight:'700', letterSpacing:'0.06em'}}>CORE by Carnelian</div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'11px', color:'#6B7280', fontWeight:'700', marginBottom:'6px'}}>{date}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'10px', color:'#9CA3AF', fontWeight:'700', letterSpacing:'0.08em'}}>{docId}</div>
            </div>
          </div>
        </div>
        
        <div className="page-break"></div>

        {/* ─── PDF INNER CONTENT ─── */}
        <div id="pdf-inner-content" style={{ padding: '0' }}>

          {/* Welcome Section */}
          <div className="avoid-break" style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'48px 40px', marginBottom:'24px', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-50px',right:'-50px',width:'200px',height:'200px',borderRadius:'50%',background:`radial-gradient(circle,${T.goldP} 0%,transparent 70%)`}} />
            <div style={{position:'relative',zIndex:1}}>
              <div className="mono" style={{fontSize:'10px',color:T.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'12px',fontWeight:'700'}}>Your Personal Blueprint</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,2.6rem)',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Welcome, {R.name?.split(' ')[0] || 'Professional'}.</h1>
              <p style={{color:T.t1,fontSize:'14px',lineHeight:'1.8',marginBottom:'16px',fontWeight:'500'}}>
                Thank you for trusting us with your reflections. We know that taking an assessment can feel vulnerable. Please know that this report is not a judgment, nor a final verdict on who you are. Human beings are beautifully complex, and psychometrics simply capture a snapshot of your current professional habits.
              </p>
              <p style={{color:T.t1,fontSize:'14px',lineHeight:'1.8',marginBottom:'28px',fontWeight:'500'}}>
                Think of this document as a mirror held up to your professional self—designed to celebrate your natural gifts and gently highlight the spaces where you have the greatest room to grow. You are already equipped with incredible strengths. Let's explore how to amplify them.
              </p>
              <div style={{background:`rgba(255,255,255,0.04)`,border:`1px solid ${T.b2}`,borderRadius:'10px',padding:'24px', borderLeft:`4px solid ${T.c}`}}>
                <div className="mono" style={{fontSize:'9px',textTransform:'uppercase',letterSpacing:'0.14em',color:T.gold,fontWeight:'700',marginBottom:'8px'}}>Your Natural Work Style</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',color:T.t0,fontWeight:'700',marginBottom:'10px'}}>{profile?.name || 'Professional Profile'}</div>
                <div style={{fontSize:'13px',color:T.t2,lineHeight:'1.7',fontWeight:'600'}}>{profile?.desc || 'A reliable and principled professional with strong compliance orientation.'}</div>
              </div>
            </div>
          </div>

          {/* Score Landscape */}
          <div className="avoid-break" style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',fontWeight:'700',color:'#111827',marginBottom:'24px'}}>Your Score Landscape</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {bars.map(([l,v],i)=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:'16px',paddingBottom:i===0?'16px':'0',marginBottom:i===0?'8px':'0',borderBottom:i===0?'1px solid #F3F4F6':'none'}}>
                  <div style={{width:'180px',flexShrink:0,fontSize:'13px',color:i===0?'#111827':'#4B5563',fontWeight:i===0?'800':'700'}}>{l}</div>
                  <div style={{flex:1,background:'#F3F4F6',height:i===0?'10px':'6px',borderRadius:'4px',overflow:'hidden'}}>
                    <div style={{width:`${Math.max(0, Math.min(100, v))}%`,height:'100%',background:barGrad(v),borderRadius:'4px',transition:'width 1s ease'}} />
                  </div>
                  <div className="mono" style={{width:'40px',textAlign:'right',fontSize:'12px',color:bCol(v),fontWeight:'800'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Strengths */}
          <div className="avoid-break" style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:'#111827',marginBottom:'12px'}}>What You Bring to the Table</h3>
            <p style={{color:'#4B5563', fontSize:'13px', lineHeight:'1.7', marginBottom:'24px', fontWeight:'500'}}>These are your anchor strengths. When things get difficult, these are the natural instincts you rely on. Lean into them—they are what make you uniquely valuable to your team.</p>
            <div className="grid-2-col">
              {top2.map(d=>(
                <div key={d.k} style={{padding:'24px',borderRadius:'10px',background:'#F0FDF4',border:'1px solid #BBF7D0',borderLeft:`5px solid ${T.gn}`}}>
                  <div className="mono" style={{fontSize:'9px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'0.12em',color:'#15803D',marginBottom:'8px'}}>Core Strength</div>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',marginBottom:'10px',color:'#166534'}}>{d.l}</h4>
                  <p style={{fontSize:'13px',color:'#15803D',lineHeight:'1.7',fontWeight:'500',marginBottom:'16px'}}>{d.str}</p>
                  <span style={{padding:'4px 12px',background:'#DCFCE7',color:'#166534',borderRadius:'4px',fontSize:'11px',fontWeight:'800'}}>{d.v}/100</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-break"></div>
          
          {/* Development Roadmap */}
          <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:'#111827',marginBottom:'12px'}}>Your Deep-Dive Development Roadmap</h3>
            <p style={{color:'#4B5563', fontSize:'13px', lineHeight:'1.7', marginBottom:'32px', fontWeight:'500'}}>We all have blind spots. The dimensions below aren't "weaknesses"—they are simply areas where applying deliberate, mindful effort will yield massive results for your career trajectory. Here is your personalized, step-by-step plan.</p>
            
            {devAreas.length > 0 ? devAreas.map((d,i)=>(
              <div key={i} className="avoid-break" style={{border:'1px solid #E5E7EB',borderRadius:'12px',padding:'32px',marginBottom:'24px',boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:'700',color:'#111827'}}>{d.d}</h4>
                  <span style={{padding:'6px 14px',background:T.amP,color:T.am,borderRadius:'6px',fontSize:'13px',fontWeight:'800'}}>{d.v}/100</span>
                </div>
                <div className="mono" style={{fontSize:'10px',color:'#6B7280',marginBottom:'20px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'800'}}>{bd(d.v)} range</div>
                
                <p style={{fontSize:'13.5px',color:'#4B5563',lineHeight:'1.8',marginBottom:'28px',fontWeight:'500', padding:'18px', background:'#F9FAFB', borderRadius:'8px', borderLeft:`4px solid ${T.am}`}}>
                  {d.empathyIntro}
                </p>

                <h5 style={{fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#6B7280',fontWeight:'800',marginBottom:'16px'}}>Daily Habits to Build:</h5>
                <ul style={{paddingLeft:0,listStyle:'none',marginBottom:'32px'}}>
                  {d.habits.map((h,j)=>(
                    <li key={j} style={{display:'flex',gap:'12px',padding:'8px 0',fontSize:'13.5px',color:'#374151',lineHeight:'1.6',fontWeight:'500'}}>
                      <span style={{color:T.am,fontWeight:'800',flexShrink:0}}>→</span>
                      <span><strong style={{color:'#111827'}}>{h.h}</strong> {h.t}</span>
                    </li>
                  ))}
                </ul>

                <h5 style={{fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#6B7280',fontWeight:'800',marginBottom:'16px'}}>Your Growth Timeline:</h5>
                <div style={{display:'grid',gap:'12px'}}>
                  <div className="avoid-break" style={{display:'flex',gap:'20px',background:'#FEF2F2',padding:'18px',borderRadius:'8px',borderLeft:`4px solid ${T.rd}`, alignItems:'center'}}>
                    <div style={{minWidth:'90px',fontSize:'12px',fontWeight:'800',color:T.rd,textTransform:'uppercase',letterSpacing:'0.05em'}}>Now<br/><span style={{fontSize:'9px',opacity:0.8}}>(0–30 Days)</span></div>
                    <div style={{fontSize:'13.5px',color:'#7F1D1D',lineHeight:'1.6',fontWeight:'600'}}>{d.day30}</div>
                  </div>
                  <div className="avoid-break" style={{display:'flex',gap:'20px',background:'#FFFBEB',padding:'18px',borderRadius:'8px',borderLeft:`4px solid ${T.am}`, alignItems:'center'}}>
                    <div style={{minWidth:'90px',fontSize:'12px',fontWeight:'800',color:T.am,textTransform:'uppercase',letterSpacing:'0.05em'}}>Soon<br/><span style={{fontSize:'9px',opacity:0.8}}>(30–90 Days)</span></div>
                    <div style={{fontSize:'13.5px',color:'#92400E',lineHeight:'1.6',fontWeight:'600'}}>{d.day90}</div>
                  </div>
                  <div className="avoid-break" style={{display:'flex',gap:'20px',background:'#F0FDF4',padding:'18px',borderRadius:'8px',borderLeft:`4px solid ${T.gn}`, alignItems:'center'}}>
                    <div style={{minWidth:'90px',fontSize:'12px',fontWeight:'800',color:T.gn,textTransform:'uppercase',letterSpacing:'0.05em'}}>Future<br/><span style={{fontSize:'9px',opacity:0.8}}>(90–180 Days)</span></div>
                    <div style={{fontSize:'13.5px',color:'#166534',lineHeight:'1.6',fontWeight:'600'}}>{d.day180}</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="avoid-break" style={{padding:'24px',background:T.gnP,borderRadius:'12px',fontSize:'14px',color:T.gn,lineHeight:'1.7',fontWeight:'600'}}>
                Your profile is remarkably balanced. No critical development red-flags were detected. Focus on sustaining your current habits and taking on stretch assignments outside your comfort zone to expand your impact.
              </div>
            )}
          </div>

          <div className="page-break"></div>

          {/* Priority Action Matrix */}
          <div className="avoid-break" style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:'#111827',marginBottom:'12px'}}>Priority Action Matrix</h3>
            <p style={{color:'#4B5563', fontSize:'13px', lineHeight:'1.7', marginBottom:'32px', fontWeight:'500'}}>A comprehensive visual guide on how to distribute your energy over the next 6 months for maximum career impact.</p>
            
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'16px'}}>
              {[
                {bg:'#FEF2F2', border:'#FECACA', color:'#B91C1C', title:'1. Act Now (0-30 Days)', subtitle:'Micro-Habit Formation', text:"Focus purely on the 'Daily Habits' listed in your roadmap. Pick just one dimension to start. Do not attempt a massive overhaul—focus on tiny, 5-minute behavioral shifts that you can sustain daily without burnout."},
                {bg:'#FFFBEB', border:'#FDE68A', color:'#D97706', title:'2. Build Soon (30-90 Days)', subtitle:'Social Accountability', text:'Involve others. Share your specific development goals with a trusted manager or mentor. This is the phase for enrolling in workshops, restructuring your workflows, and actively asking colleagues for feedback.'},
                {bg:'#F0FDF4', border:'#BBF7D0', color:'#15803D', title:'3. Sustain (90-180 Days)', subtitle:'Pressure Testing', text:'Transition from learning to leading. Take ownership of a complex project that forces you to use your new skills under pressure. Cement your new brand within the team by delivering consistently.'},
                {bg:'#F3F4F6', border:'#E5E7EB', color:'#4B5563', title:'4. The Feedback Loop', subtitle:'Measuring Success', text:'Book a recurring 15-minute calendar block on the last Friday of every month. Ask yourself: "Am I reacting out of habit, or responding with intention?" Adjust your approach based on what is working.'},
                {bg:'#EFF6FF', border:'#BFDBFE', color:'#1D4ED8', title:'5. Anticipating Relapse', subtitle:'Grace Under Fire', text:'When stress hits, you will likely revert to old habits. Expect this. When it happens, do not abandon the plan. Acknowledge the slip, reset your environment, and start fresh the very next morning.'},
                {bg:'#FAF5FF', border:'#E9D5FF', color:'#7E22CE', title:'6. Expanding Impact', subtitle:'Teaching Others', text:'The ultimate test of mastering a new skill is teaching it. Once you have solidified your new habits, look for a junior colleague struggling with the same issues and gently mentor them through your process.'}
              ].map((item, idx) => (
                <div key={idx} className="avoid-break" style={{background:item.bg,border:`1px solid ${item.border}`,borderRadius:'10px',padding:'24px'}}>
                  <div style={{fontSize:'12px',fontWeight:'800',color:item.color,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>{item.title}</div>
                  <div style={{fontSize:'14px',fontWeight:'700',color:item.color.replace('1','2').replace('6','7'),marginBottom:'8px'}}>{item.subtitle}</div>
                  <p style={{fontSize:'12.5px',color:item.color.replace('1','2').replace('6','7'),lineHeight:'1.6',fontWeight:'500'}}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="page-break"></div>

          {/* CTA Section */}
          <div className="avoid-break" style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'48px 40px', textAlign:'center', marginTop:'24px'}}>
            <div style={{width:'56px', height:'56px', background:T.goldP, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
              <span style={{fontSize:'24px'}}>🤝</span>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',fontWeight:'700',color:T.gold,marginBottom:'16px'}}>Let's Build Your Path Together</h3>
            <p style={{color:T.t1,fontSize:'14px',lineHeight:'1.8',maxWidth:'640px',margin:'0 auto 32px',fontWeight:'500'}}>
              Reading a report is just the first step. If you found these insights helpful but want to dive deeper into what this means for your specific career trajectory, leadership style, or current workplace challenges, our consultants are here to guide you through a 1-on-1 debrief.
            </p>
            <a href="mailto:hello@carnelianco.com" target="_blank" rel="noopener noreferrer" style={{
              display:'inline-block', padding:'14px 32px', borderRadius:'8px',
              background:'transparent', color:T.t0, border:`2px solid ${T.c}`,
              fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'14px',fontWeight:'800',
              textDecoration:'none', transition:'all 0.2s', boxShadow:`0 4px 12px ${T.cGlow}`
            }} onMouseOver={(e) => {e.target.style.background=T.c; e.target.style.borderColor=T.c;}} 
            onMouseOut={(e) => {e.target.style.background='transparent'; e.target.style.borderColor=T.c;}}>
              Reach out at hello@carnelianco.com
            </a>
            <div className="mono" style={{marginTop:'40px',fontSize:'9px',color:T.t3,fontWeight:'600'}}>{docId} · CORE by Carnelian · {date}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
const ProgressPage = () => {
  const [history, setHistory] = useState([]);
  const [searchCnic, setSearchCnic] = useState('');
  const [searched, setSearched]       = useState(false);
  const [results, setResults]         = useState([]);

  useEffect(()=>{
    try { setHistory(JSON.parse(localStorage.getItem('core_v1_history')||'[]')); } catch(e){}
  },[]);

  const handleSearch = () => {
    setSearched(true);
    const term = searchCnic.replace(/[^0-9]/g, '');
    if (!term) { setResults([]); return; }
    const matches = history.filter(e => e.cnic && e.cnic === term);
    
    // group by unique CNIC
    const byPerson = {};
    matches.forEach(e => {
      const pid = e.cnic;
      if (!byPerson[pid]) byPerson[pid] = [];
      byPerson[pid].push(e);
    });
    setResults(Object.values(byPerson));
  };

  const del = (pid_cnic) => {
    if (!window.confirm('Delete all CORE records for this person?')) return;
    const h = history.filter(e => e.cnic !== pid_cnic);
    setHistory(h);
    try { localStorage.setItem('core_v1_history', JSON.stringify(h)); } catch(e){}
    const updatedResults = results.map(entries => entries.filter(e => e.cnic !== pid_cnic)).filter(arr => arr.length > 0);
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
        Look up a candidate's assessment history using their <strong style={{color:T.t0}}>13-digit CNIC</strong>.
      </p>

      {/* Search box */}
      <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px 28px', marginBottom:'32px'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', fontWeight:'700', color:T.c, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'16px'}}>Search by CNIC</div>
        <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'12px'}}>
          <input
            value={searchCnic}
            onChange={e=>setSearchCnic(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Enter 13-digit CNIC"
            maxLength="13"
            style={{...inp, minWidth:'200px'}}
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
          <p style={{fontSize:'13px', color:T.t2, fontWeight:'600'}}>No assessments match the CNIC you entered. Make sure the candidate used this identifier when taking the assessment.</p>
        </div>
      )}

      {results.map((entries, ri) => {
        const latest = entries[entries.length-1];
        const prev   = entries.length>=2 ? entries[entries.length-2] : null;
        const delta  = prev ? latest.scores.overall - prev.scores.overall : 0;
        const pid_cnic = latest.cnic||'';

        return (
          <div key={ri} style={{background:'#fff', border:'1px solid #E5E7EB', borderRadius:'12px', marginBottom:'20px', overflow:'hidden'}}>
            {/* Header */}
            <div style={{background:T.bg0, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:T.t0, fontWeight:'700', marginBottom:'4px'}}>{latest.name}</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3, fontWeight:'600'}}>
                  {latest.role&&`${latest.role} · `}
                  {latest.dept&&`${latest.dept} · `}
                  CNIC: {latest.cnic}
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

              <button onClick={()=>del(pid_cnic)} style={{padding:'7px 14px', borderRadius:'5px', border:`1px solid ${T.rdP}`, background:'transparent', color:T.rd, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700', cursor:'pointer'}}>Delete Records</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
// ─── METHODOLOGY PAGE ─────────────────────────────────────────────────────────
const MethodologyPage = () => {
  const refs = [
    {
      text: "Goldberg, L. R. (1999). A broad-bandwidth, public-domain personality inventory measuring the lower-level facets of several five-factor models. Personality Psychology in Europe, 7, 7–28.",
      href: "https://ipip.ori.org/A%20broad-bandwidth%20inventory.pdf",
    },
    {
      text: "Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions and job performance: A meta-analysis. Personnel Psychology, 44(1), 1–26.",
      href: "https://doi.org/10.1111/j.1744-6570.1991.tb00688.x",
    },
    {
      text: "Paulhus, D. L. (1991). Measurement and control of response bias. In J. P. Robinson, P. R. Shaver, & L. S. Wrightsman (Eds.), Measures of Personality and Social Psychological Attitudes.",
      href: "https://doi.org/10.1016/B978-0-12-590241-0.50006-X",
    },
    {
      text: "Earley, P. C., & Ang, S. (2003). Cultural intelligence: Individual interactions across cultures. Stanford Business Books.",
      href: "https://www.sup.org/books/business/cultural-intelligence",
    },
    {
      text: "Ang, S., Van Dyne, L., Koh, C., Ng, K. Y., Templer, K. J., Tay, C., & Chandrasekar, N. A. (2007). Cultural intelligence: Its measurement and effects on cultural judgment and decision making, cultural adaptation and task performance. Management and Organization Review, 3(3), 335–371.",
      href: "https://www.cambridge.org/core/journals/management-and-organization-review/article/abs/cultural-intelligence-its-measurement-and-effects-on-cultural-judgment-and-decision-making-cultural-adaptation-and-task-performance/EEB4216A0F254559FF78DACC4F93762D",
    },
    {
      text: "Organ, D. W. (1988). Organizational citizenship behavior: The good soldier syndrome. Lexington Books.",
      href: "https://psycnet.apa.org/record/1988-97376-000",
    },
    {
      text: "Lombardo, M. M., & Eichinger, R. W. (2000). High potentials as high learners. Human Resource Management, 39(4), 321–329.",
      href: "https://doi.org/10.1002/1099-050X(200024)39:4<321::AID-HRM4>3.0.CO;2-1",
    },
    {
      text: "Rest, J. R. (1986). Moral development: Advances in research and theory. Praeger.",
      href: "https://books.google.com/books/about/Moral_Development.html?id=mL9-AAAAMAAJ",
    },
    {
      text: "Crowne, D. P., & Marlowe, D. (1960). A new scale of social desirability independent of psychopathology. Journal of Consulting Psychology, 24(4), 349–354.",
      href: "https://pubmed.ncbi.nlm.nih.gov/13813058/",
    },
    {
      text: "Khalid, S. A., Jusoff, K., Othman, M., Ismail, M., & Rahman, N. A. (2009). Organizational citizenship behavior as a predictor of student academic achievement. International Journal of Economics and Finance, 1(2).",
      href: "https://ccsenet.org/journal/index.php/ijef/article/view/4945",
    },
  ];

  return (
    <div style={{maxWidth:'1000px', margin:'0 auto', padding:'80px 32px'}}>
      <div style={{textAlign:'center', marginBottom:'64px'}}>
        <Reveal delay={0}>
          <Pill label="Scientific Foundation" style={{marginBottom:'16px'}} />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(2rem,4vw,2.8rem)',
            fontWeight:'700',
            margin:'0 0 8px',
            color:T.t0
          }}>
            Validity Controls & Scientific Basis
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <GoldLine style={{width:'60px', margin:'24px auto 0'}} />
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <h3 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:'1.5rem',
          fontWeight:'700',
          marginBottom:'20px',
          color:T.t0
        }}>
          Peer-Reviewed References
        </h3>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{
          background:T.bg1,
          border:`1px solid ${T.b2}`,
          borderRadius:'8px',
          padding:'32px',
          marginBottom:'64px'
        }}>
          {refs.map((ref, i) => (
            <a
              key={i}
              href={ref.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display:'block',
                padding:'12px 16px',
                background:T.bg2,
                borderRadius:'6px',
                marginBottom:'8px',
                fontSize:'11px',
                color:T.t2,
                lineHeight:'1.7',
                borderLeft:`4px solid ${i % 2 === 0 ? T.c : T.gold}`,
                fontWeight:'600',
                textDecoration:'none',
                transition:'all 0.2s',
                cursor:'pointer'
              }}
              onMouseOver={e=>{
                e.currentTarget.style.background = T.bg3;
                e.currentTarget.style.color = T.t0;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseOut={e=>{
                e.currentTarget.style.background = T.bg2;
                e.currentTarget.style.color = T.t2;
                e.currentTarget.style.transform = 'none';
              }}
            >
              {ref.text}
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h3 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:'1.5rem',
          fontWeight:'700',
          marginBottom:'20px',
          color:T.t0
        }}>
          How CORE Detects Dishonest Responses
        </h3>
      </Reveal>

      <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'64px'}}>
        {[
          {t:'Reverse Consistency Index',c:T.am,d:'Forward and reverse-scored items per dimension are mathematically compared. Scoring high on contradictory items simultaneously is a logical contradiction that gets caught and scored.'},
          {t:'Acquiescence Bias Detection',c:T.c,d:'Respondents choosing "Strongly Agree" on more than 55% of all items — regardless of reverse scoring — are detected. This pattern indicates a response style artifact or deliberate inflation.'},
          {t:'Extreme Response Style Index',c:T.gn,d:'Respondents choosing only extreme responses on more than 70% of items are flagged. Above 85% triggers a hard red. Above 90% triggers a critical override labelling the entire result uninterpretable.'},
          {t:'L-Scale (Lie Scale) — 12 Items',c:T.rd,d:'Twelve items describing near-impossible behaviours — never procrastinating, always feeling positive about every employer. Honest respondents agree with 0–3. Agreement with 6 or more indicates social desirability inflation. Items are deliberately subtle.'},
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
              <div className="mono" style={{
                fontSize:'10px',
                fontWeight:'700',
                color:v.c,
                textTransform:'uppercase',
                letterSpacing:'0.12em',
                marginBottom:'14px',
                borderBottom:`1px solid ${v.c}28`,
                paddingBottom:'12px'
              }}>
                {v.t}
              </div>
              <p style={{fontSize:'13px',color:T.t1,lineHeight:'1.7',fontWeight:'600'}}>
                {v.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <h3 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:'1.5rem',
          fontWeight:'700',
          marginBottom:'20px',
          color:T.t0
        }}>
          Instrument Governance
        </h3>
      </Reveal>

      <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
        {[
          {h:'Copyright Status',p:'All five CORE modules are built on theoretical constructs that are not copyrightable. IPIP personality items are explicitly public domain. New items authored for CORE constitute original work owned by Carnelian Pvt Ltd.',c:'IPIP · Goldberg (1999)'},
          {h:'Validity Methodology',p:'L-scale methodology follows Crowne-Marlowe social desirability principles. Consistency checks are conceptually aligned with established psychometric response-validity logic. All implementation details and items in CORE are original Carnelian work.',c:'Paulhus (1991) · Crowne & Marlowe (1960)'},
          {h:'Industry Context Engine',p:"Sector-specific dimension weighting and risk thresholds are informed by published evidence on personality-performance relationships, cultural intelligence research, and Carnelian's practitioner knowledge of Pakistan's professional context.",c:'Barrick & Mount (1991) · Ang et al. (2007)'},
          {h:'Commercial Use',p:'CORE is proprietary to Carnelian Pvt Ltd. Client organisations receive a licence to administer and use results internally. The scoring algorithm, validity methodology, and industry profiles are Carnelian intellectual property.',c:'Carnelian Pvt Ltd'},
        ].map((card,i)=>(
          <Reveal key={i} delay={i * 0.15}>
            <div style={{
              background:T.bg1,
              border:`1px solid ${T.b2}`,
              borderRadius:'8px',
              borderTop:`4px solid ${i%2===0?T.c:T.gold}`,
              padding:'32px 28px',
              display:'flex',
              flexDirection:'column',
              height:'100%',
              transition:'all 0.2s',
            }}
            onMouseOver={e=>{
              e.currentTarget.style.background=T.bg2;
              e.currentTarget.style.transform='translateY(-4px)';
            }}
            onMouseOut={e=>{
              e.currentTarget.style.background=T.bg1;
              e.currentTarget.style.transform='none';
            }}>
              <h4 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'1.25rem',
                fontWeight:'700',
                marginBottom:'12px',
                color:T.t0
              }}>
                {card.h}
              </h4>
              <p style={{
                fontSize:'13px',
                color:T.t2,
                lineHeight:'1.7',
                flex:1,
                marginBottom:'20px',
                fontWeight:'600'
              }}>
                {card.p}
              </p>
              <div style={{height:'1px', background:T.b2, marginBottom:'16px'}} />
              <div className="mono" style={{fontSize:'10px', color:T.c, fontWeight:'700', letterSpacing:'0.1em'}}>
                {card.c}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

// ─── FOOTER ────────────────────────────────────────────────────────────────
const Footer = () => {
  const socials = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/carnelian',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/carnelianco/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.315 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/carnelianco/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/923462828884',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:hello@carnelianco.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="no-print" style={{
      background: T.bg1,
      borderTop: `1px solid ${T.b2}`,
      padding: '32px 24px',
      marginTop: 'auto',
      width: '100%',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Social Links */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: T.bg2,
                border: `1px solid ${T.b2}`,
                color: T.t1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = T.c;
                e.currentTarget.style.color = T.c;
                e.currentTarget.style.background = `${T.c}10`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = T.b2;
                e.currentTarget.style.color = T.t1;
                e.currentTarget.style.background = T.bg2;
              }}
            >
              <span style={{ color: T.gold, display: 'flex' }}>{social.icon}</span>
              <span className="hide-mobile">{social.name}</span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mono" style={{
          fontSize: '10px',
          color: T.t3,
          fontWeight: '600',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}>
          © {new Date().getFullYear()} Carnelian Pvt Ltd · CORE Assessment Platform
        </div>
      </div>
    </footer>
  );
};

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
      <div style={{ 
        minHeight: 'calc(100vh - 64px - 100px)', // nav height + footer height
        display: 'flex',
        flexDirection: 'column'
      }}>
      {tab==='home'    && <HomePage    setTab={handleSetTab} />}
      {tab==='assess'  && <AssessmentPage setTab={handleSetTab} setReportData={setReportData} setHistoryFlag={setHasHistory} />}
      {tab==='results' && <ResultsPage reportData={reportData} />}
      {tab==='progress'&& <ProgressPage />}
      {tab==='method'  && <MethodologyPage />}
      </div>
      <Footer />
    </>

  );
}

