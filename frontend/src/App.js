import React, { useState, useEffect, useRef } from 'react';
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

// ─── FONTS & GLOBAL STYLES ────────────────────────────────────────────────────
const Fonts = ({ mode }) => {
  const TT = mode === 'dark' ? darkTheme : lightTheme;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      @media print { footer, nav, .no-print { display: none !important; } body { background: #fff !important; color: #000 !important; } }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${TT.bg0}; color: ${TT.t0}; min-height: 100vh; overflow-x: hidden; transition: background 0.3s ease, color 0.3s ease; font-weight: 500; }
      body::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(${TT.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${TT.gridColor} 1px, transparent 1px); background-size: ${TT.gridSize} ${TT.gridSize}; pointer-events: none; z-index: 0; }
      body::after { content: ''; position: fixed; inset: 0; background-image: ${mode === 'dark' ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")` : 'none'}; pointer-events: none; z-index: 0; opacity: ${mode === 'dark' ? '0.4' : '0'}; }
      nav, main, section, div:not(body > div) { position: relative; z-index: 1; }
      .serif { font-family: 'Playfair Display', serif; font-weight: 600; }
      .mono { font-family: 'JetBrains Mono', monospace; font-weight: 500; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${TT.bg0}; }
      ::-webkit-scrollbar-thumb { background: ${TT.b2}; border-radius: 2px; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes scaleIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      @keyframes slideUp { from { opacity:0; transform:translateY(44px); } to { opacity:1; transform:translateY(0); } }
      @keyframes glow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      @keyframes timerTick { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      @keyframes checkIn { from { transform:scale(0); } to { transform:scale(1); } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .anim-fadeUp { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      .anim-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      .anim-slideUp { animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
      @media (max-width: 1024px) { .grid-7-col { grid-template-columns: repeat(4,1fr) !important; } }
      @media (max-width: 1024px) { .grid-7-col { grid-template-columns: repeat(4,1fr) !important; } }
      @media (max-width: 900px) { 
        .grid-7-col, .grid-5-col, .grid-6-col { grid-template-columns: repeat(3,1fr) !important; } 
        .grid-3-col, .grid-4-col { grid-template-columns: 1fr 1fr !important; } 
        .grid-2-col { grid-template-columns: 1fr !important; } 
        .hide-mobile { display: none !important; } 
      }
      @media (max-width: 600px) { 
        .grid-7-col, .grid-5-col, .grid-6-col { grid-template-columns: repeat(2,1fr) !important; } 
        .grid-3-col, .grid-4-col, .grid-2-col { grid-template-columns: 1fr !important; } 
        .section-container { padding: 40px 16px !important; }
        .nav-wrap { padding: 0 12px !important; } 
        table { display: block; overflow-x: auto; white-space: nowrap; }
        
        /* Slideshow Mobile Fixes */
        .slideshow-layout { grid-template-columns: 1fr !important; }
        .slideshow-tabs { border-right: none !important; border-bottom: 1px solid ${TT.b2} !important; flex-direction: row !important; overflow-x: auto !important; padding: 12px 16px !important; }
        .slideshow-tabs button { flex-shrink: 0; width: auto !important; }
        .slideshow-content { padding: 32px 16px !important; min-height: auto !important; }
        
        /* Typography Scaling */
        h1 { font-size: 2.6rem !important; }
        h2 { font-size: 1.8rem !important; }
      }
     @media (max-width: 400px) { .grid-7-col, .grid-5-col, .grid-6-col { grid-template-columns: 1fr !important; } }

      /* ── GLOBAL MOBILE FIXES ── */
      @media (max-width: 768px) {
        .desktop-nav { display: none !important; }
        .mobile-nav-controls { display: flex !important; }
        
        /* Center all main content */
        div[style*="maxWidth:"] { margin-left: auto !important; margin-right: auto !important; }
        
        /* Fix padding on main sections */
        div[style*="padding:'40px 24px'"] { padding: 24px 16px !important; }
        div[style*="padding:'80px 24px'"] { padding: 48px 16px !important; }
        div[style*="padding:'56px 24px'"] { padding: 40px 16px !important; }
        
        /* Fix report tabs */
        div[style*="gap:'8px'"][style*="flexWrap:'wrap'"] { gap: 6px !important; }
        
        /* Fix table overflow */
        table { font-size: 11px !important; }
        
        /* Fix card padding on mobile */
        div[style*="padding:'48px 40px'"] { padding: 28px 20px !important; }
        div[style*="padding:'32px 36px'"] { padding: 24px 16px !important; }
        div[style*="padding:'32px'"] { padding: 20px 16px !important; }
        div[style*="padding:'36px'"] { padding: 24px 16px !important; }
        div[style*="padding:'40px'"] { padding: 24px 16px !important; }
      }
      
      @media (min-width: 769px) {
        .desktop-nav { display: flex !important; }
        .mobile-nav-controls { display: none !important; }
      }
    `}</style>
  );
};

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────
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

const QS = [
  // ─── PART A: HOW YOU WORK (11) ───
  {ch:'A',d:'C',r:false,t:"When assigned a task I find tedious, I complete it to the same standard as work I find engaging."},
  {ch:'A',d:'C',r:true, t:"In a typical month, some commitments I have made end up partially done or quietly set aside."},
  {ch:'A',d:'O',r:false,t:"I look for better approaches to work I have been doing the same way for a long time."},
  {ch:'A',d:'O',r:true, t:"When my team faces a new challenge, my natural instinct is to refine what already exists rather than propose starting from scratch."},
  {ch:'A',d:'C',r:false,t:"I hold myself to quality standards that go beyond what is formally required or likely to be inspected."},
  {ch:'A',d:'ES',r:false,t:"When I receive pointed criticism about work I have invested effort in, I process it without becoming defensive."},
  {ch:'A',d:'ES',r:true, t:"A demanding period at work noticeably affects my mood and the quality of decisions I make."},
  {ch:'A',d:'O',r:false,t:"I find problems with no established solution more interesting than problems with clear, known answers."},
  {ch:'A',d:'L',r:false, t:"I have always given full effort to every task at work, regardless of how inconsequential or unnoticed it seemed.", validity:'L'},
  {ch:'A',d:'L',r:false, t:"I have never taken on a commitment at work that I privately doubted I could deliver on time.", validity:'L'},
  {ch:'A',d:'C',r:true, t:"I sometimes begin tasks late and rely on deadline pressure to move them forward."},

  // ─── PART B: WORKING WITH OTHERS (11) ───
  {ch:'B',d:'E',r:false, t:"I engage easily with people I have just met in professional settings, even in large or senior groups."},
  {ch:'B',d:'E',r:true,  t:"After a day with significant social interaction at work, I need time alone to recharge."},
  {ch:'B',d:'A',r:false, t:"When a colleague challenges my position, my first instinct is to understand their reasoning rather than defend mine."},
  {ch:'B',d:'A',r:true,  t:"Even when a colleague makes a point that logically challenges my position, my first reaction is to look for the flaw in their argument rather than consider changing my mind."},
  {ch:'B',d:'OCB_A',r:false,t:"I help colleagues with their work even when it takes time I had planned for my own tasks."},
  {ch:'B',d:'OCB_A',r:true, t:"I complete my responsibilities fully before considering whether colleagues need support."},
  {ch:'B',d:'OCB_CO',r:false,t:"Before taking actions that affect my team's plans or workload, I consult relevant colleagues even when not required."},
  {ch:'B',d:'A',r:false, t:"When a colleague's idea is better than mine, I say so directly to them and to others involved."},
  {ch:'B',d:'L',r:false, t:"I have never, even for a moment, felt frustrated or resentful toward any colleague or manager I have ever worked with.", validity:'L'},
  {ch:'B',d:'L',r:false, t:"I have never taken any form of credit — even partially or accidentally — for work that was primarily a colleague's contribution.", validity:'L'},
  {ch:'B',d:'OCB_CO',r:false,t:"I share information with colleagues that may be relevant to their work, even when they have not asked for it."},

  // ─── PART C: NAVIGATING DIVERSITY (11) ───
  {ch:'C',d:'CQ_K',r:false,t:"I understand how cultural background shapes the way colleagues approach hierarchy, communication, and professional relationships."},
  {ch:'C',d:'CQ_K',r:false,t:"I am aware of how regional, religious, and linguistic differences shape the way colleagues approach hierarchy, communication, and professional norms."},
  {ch:'C',d:'CQ_K',r:true, t:"I find cultural differences in the workplace more confusing or frustrating than enriching."},
  {ch:'C',d:'CQ_M',r:false,t:"I seek to work with people from cultural backgrounds different from mine — not merely accept it when the situation requires it."},
  {ch:'C',d:'CQ_M',r:true, t:"I am more comfortable and effective in professional environments where people share my cultural background and norms."},
  {ch:'C',d:'CQ_M',r:false,t:"When a cross-cultural interaction goes poorly, I reflect on my role before attributing it to the other person."},
  {ch:'C',d:'CQ_B',r:false,t:"I adjust naturally between formal and informal styles, and between direct and indirect approaches, depending on my audience."},
  {ch:'C',d:'CQ_B',r:false,t:"In unfamiliar professional or cultural contexts, I adjust my approach rather than expecting others to adapt to me."},
  {ch:'C',d:'CQ_B',r:true, t:"I struggle to meaningfully adjust my communication style for different audiences or cultural contexts."},
  {ch:'C',d:'L',r:false,   t:"I have always treated every colleague with perfectly equal patience and respect, regardless of their personality, background, or how they treated me.", validity:'L'},
  {ch:'C',d:'L',r:false,   t:"I have never, even privately, made an assumption about a colleague's professional competence based on their cultural, regional, or linguistic background.", validity:'L'},

  // ─── PART D: THINKING & ADAPTING (10) ───
  {ch:'D',d:'LA_MA',r:false,t:"I work effectively when the outcome is unclear, the information is incomplete, and no established procedure exists."},
  {ch:'D',d:'LA_MA',r:true, t:"My performance is noticeably stronger in structured, well-defined situations than in ambiguous or rapidly changing ones."},
  {ch:'D',d:'LA_PA',r:false,t:"After a professional setback, my first priority is to examine what I could have done differently."},
  {ch:'D',d:'LA_PA',r:true, t:"When something goes wrong at work, my first instinct is to identify what others did or failed to do — before examining my own contribution."},
  {ch:'D',d:'LA_PA',r:false,t:"I invite critical feedback on my work — including from people likely to challenge my thinking."},
  {ch:'D',d:'LA_CA',r:false,t:"I consider how my decisions and actions affect people and teams beyond my immediate group."},
  {ch:'D',d:'LA_CA',r:true, t:"I focus on solving the immediate problem rather than exploring its broader systemic implications."},
  {ch:'D',d:'LA_RA',r:false,t:"I update my professional knowledge on my own — not only when formal training is scheduled."},
  {ch:'D',d:'LA_RA',r:true, t:"I prefer to build deeper expertise in areas I already know rather than exploring unfamiliar ones."},
  {ch:'D',d:'L',r:false,    t:"I have never procrastinated on any work task, even briefly — I always begin immediately when something is assigned to me.", validity:'L'},

  // ─── PART E: PROFESSIONAL INTEGRITY (10) ───
  {ch:'E',d:'EO_RC',r:false,t:"I follow institutional policies and professional standards even when I know non-compliance will go unnoticed."},
  {ch:'E',d:'EO_RC',r:true, t:"When following a rule precisely would produce a clearly worse outcome, I use my judgment to deviate from it."},
  {ch:'E',d:'EO_RC',r:false,t:"When I have seen a colleague breaking an important rule, I have raised it through appropriate channels."},
  {ch:'E',d:'EO_T',r:false, t:"I disclose information others need to make good decisions, even when not formally required to share it."},
  {ch:'E',d:'EO_T',r:true,  t:"I sometimes exercise my judgment about what information stakeholders need rather than sharing everything by default."},
  {ch:'E',d:'EO_ER',r:false,t:"When facing an ethically ambiguous situation, I consult relevant guidelines, colleagues, or supervisors rather than acting on my judgment alone."},
  {ch:'E',d:'EO_ER',r:false,t:"I consider the interests of people affected by my decisions who have no direct voice in the outcome."},
  {ch:'E',d:'EO_ER',r:true, t:"Under delivery pressure, I have occasionally told myself the outcome justifies the method — even when I sensed that reasoning would not hold up to scrutiny."},
  {ch:'E',d:'EO_AI',r:false,t:"When I am in a situation where a small shortcut would go unnoticed, I handle it the same way I would if my manager were present."},
  {ch:'E',d:'L',r:false,    t:"I have never, under any circumstances, allowed a personal relationship to influence a professional decision I made.", validity:'L'},

  // ─── PART F: WORKPLACE CITIZENSHIP (10) ───
  {ch:'F',d:'OCB_CV',r:false,t:"I stay informed about developments in my organisation beyond the scope of my direct role."},
  {ch:'F',d:'OCB_CV',r:false,t:"I participate in institutional improvement initiatives, even when participation is voluntary."},
  {ch:'F',d:'OCB_CV',r:true, t:"When an organisational improvement effort has nothing to do with my direct role, my inclination is to leave it to the people whose responsibility it is."},
  {ch:'F',d:'OCB_S',r:false, t:"When I feel frustrated with institutional decisions or processes, I keep that frustration from affecting how I treat my colleagues."},
  {ch:'F',d:'OCB_S',r:true,  t:"I share my frustrations about workplace processes or leadership decisions with colleagues."},
  {ch:'F',d:'OCB_Cn',r:false,t:"I arrive reliably, manage my time well, and meet commitments my colleagues can count on."},
  {ch:'F',d:'OCB_Cn',r:false,t:"I invest effort beyond the minimum when the quality of the outcome matters to my colleagues or the institution."},
  {ch:'F',d:'EO_AI',r:false, t:"I have raised concerns about instructions or decisions I believed were ethically wrong, even when staying silent would have been the easier choice."},
  {ch:'F',d:'L',r:false,     t:"I have always spoken positively about every organisation I have ever worked for, even in private conversations with close friends.", validity:'L'},
  {ch:'F',d:'L',r:false,     t:"In every team I have worked in, I have contributed at least as much as every other member.", validity:'L'},
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

// ─── SCORING ENGINE ───────────────────────────────────────────────────────────
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
  
  const catastrophic = conScore<20 && extRatio>0.80;
  const incoherentData = conScore<30 && extRatio>0.70;
  const extremeCareless = extRatio>0.90;

  const flags=[];
  if(extRatio>0.80) flags.push({type:'red',key:'L-Scale (Contextual)',text:`${lAgree}/10 L-Scale agreements. With ${Math.round(extRatio*100)}% extreme responses, this result is uninterpretable.`});
  else if(lAgree>=5) flags.push({type:'red',key:'L-Scale',text:`Likely Inflated: Agreed with ${lAgree}/10 impossible-standard items.`});
  else if(lAgree>=3) flags.push({type:'amber',key:'L-Scale',text:`Moderate Inflation Risk: Agreed with ${lAgree}/10 L-scale items.`});
  else flags.push({type:'green',key:'L-Scale',text:`Valid: Agreed with only ${lAgree}/10 L-scale items.`});

  if(saRatio>0.55) flags.push({type:'amber',key:'Acquiescence',text:`${Math.round(saRatio*100)}% of responses were "Strongly Agree" — possible acquiescence bias.`});
  else flags.push({type:'green',key:'Acquiescence',text:`Response distribution appears natural (${Math.round(saRatio*100)}% Strongly Agree).`});

  if(extRatio>0.90) flags.push({type:'red',key:'Extreme Responses',text:`CRITICAL: ${Math.round(extRatio*100)}% extreme responses. Dimension scores are statistically meaningless.`});
  else if(extRatio>0.80) flags.push({type:'red',key:'Extreme Responses',text:`${Math.round(extRatio*100)}% extreme responses — cannot interpret with confidence.`});
  else if(extRatio>0.70) flags.push({type:'amber',key:'Extreme Responses',text:`${Math.round(extRatio*100)}% extreme responses — above expected range.`});
  else flags.push({type:'green',key:'Extreme Responses',text:`Response extremity within expected range (${Math.round(extRatio*100)}%).`});

  if(conScore<20) flags.push({type:'red',key:'Consistency',text:`CRITICAL: Consistency index is ${conScore}/100. Severe contradictions detected.`});
  else if(conScore<40) flags.push({type:'red',key:'Consistency',text:`Very low internal consistency (${conScore}/100). Results unlikely to represent genuine profile.`});
  else if(conScore<55) flags.push({type:'red',key:'Consistency',text:`Low internal consistency (${conScore}/100). Contradictory responses detected.`});
  else if(conScore<75) flags.push({type:'amber',key:'Consistency',text:`Moderate consistency (${conScore}/100). Some contradictions across item pairs.`});
  else flags.push({type:'green',key:'Consistency',text:`High internal consistency (${conScore}/100).`});

  if(catastrophic||incoherentData||extremeCareless){
    flags.push({type:'red',key:'Pattern Override',text:`PATTERN ALERT: Response pattern is incompatible with genuine self-reflection. Results are unreliable.`});
  }

  const redCount=flags.filter(f=>f.type==='red').length;
  const amberCount=flags.filter(f=>f.type==='amber').length;
  let overall,overallLabel;
  if(catastrophic||extremeCareless||(conScore<30&&extRatio>0.70)){overall='red';overallLabel='Invalid · Do Not Use Results. Recommend Immediate Verification.';}
  else if(conScore<20||extRatio>0.90){overall='red';overallLabel='Invalid · Results Uninterpretable. Retake Required.';}
  else if(redCount>=2){overall='red';overallLabel='Low · Recommend Verification Interview Before Any Decision.';}
  else if(redCount===1||amberCount>=2){overall='amber';overallLabel='Moderate · Interpret with Caution. Cross-Validate with Interview.';}
  else{overall='green';overallLabel='High · Proceed with Confidence.';}
  
  return{lAgree,saRatio,extRatio,conScore,flags,overall,overallLabel};
};

const getProfile = (s) => {
  const {O,C,E,A,ES,CQavg,OCBavg,LAavg,EOavg,CQ_M,CQ_B,OCB_A,LA_CA,LA_RA,OCB_S}=s;
  const burnoutRisk = ES<50 && C>=68;
  if(burnoutRisk && ((C>=76&&E>=68&&EOavg>=74&&LAavg>=65) || (C>=70&&OCBavg>=74&&EOavg>=68) || (EOavg>=75&&C>=65)))
    return {name:'High-Capability, Under Strain',tier:3,desc:"Strong delivery or ethical orientation combined with signs of reduced emotional stability. The capability is real, but sustained high performance is at risk without deliberate recovery practices."};
  if(C>=76&&E>=68&&EOavg>=74&&LAavg>=65) return {name:'Strategic Integrity Leader',tier:1,desc:"A high-performance profile combining delivery drive, social presence, strong ethical orientation, and adaptive learning. Ready for senior leadership in high-accountability environments."};
  if(C>=70&&OCBavg>=74&&EOavg>=68) return {name:'Institutional Anchor',tier:1,desc:"Conscientious, ethical, and deeply invested in organisational citizenship. The institutional backbone delivers consistently, supports colleagues, and upholds institutional norms."};
  if(O>=65&&LAavg>=70&&CQavg>=65) return {name:'Adaptive Innovator',tier:2,desc:"High intellectual curiosity combined with strong learning agility and cultural intelligence. Suited for policy development, change management, and reform initiatives."};
  if(EOavg>=75&&C>=65) return {name:'Ethics-Driven Executor',tier:2,desc:"A reliable and principled professional with strong compliance orientation and consistent delivery. Excellent for audit, compliance, and risk management."};
  if(CQavg>=70&&E>=65&&A>=65) return {name:'Cross-Cultural Bridge',tier:2,desc:"A socially adept, culturally intelligent professional who builds effective relationships across diverse institutional and regional contexts."};
  if(OCBavg>=70&&A>=65&&EOavg>=65) return {name:'Collaborative Team Leader',tier:2,desc:"An empathetic, cooperative, and institutionally committed professional who strengthens team cohesion. Brings out the best in colleagues."};
  if(O>=70&&C<52&&LAavg>=62) return {name:'Visionary Sprinter',tier:3,desc:"High intellectual energy and idea generation combined with lower structured delivery. Most effective in short-burst, project-based environments."};
  if(CQ_M>=70&&CQ_B<55&&CQavg<65) return {name:'Eager Cultural Bridge-Builder',tier:3,desc:"Strong motivation to engage across cultural contexts combined with a gap in behavioural flexibility. The enthusiasm is genuine, but the toolkit needs development."};
  if(OCB_A>=75&&E<48&&OCBavg>=68&&OCB_S<52) return {name:'Generous Under Pressure',tier:3,desc:"Exceptionally strong team support orientation combined with lower social assertiveness and signs of accumulated frustration with institutional demands."};
  if(LA_CA>=72&&LA_RA<52&&LAavg>=62) return {name:'Strategic Pivoter',tier:3,desc:"Strong capacity to identify when a direction needs to change, combining with a gap in driving initiatives through to completion."};
  if(LAavg>=70&&O>=65) return {name:'Learning Champion',tier:2,desc:"A fast learner who thrives on intellectual challenge and new knowledge. Strong asset in research, training design, and capacity building."};
  return {name:'Emerging Professional',tier:4,desc:"A profile with clear foundations and specific dimensions ready for focused development. Structured development investment here creates measurable change."};
};

const dimI = (dim, score) => {
  const b = score >= 75 ? 'High' : score >= 50 ? 'Moderate' : 'Low';
  const map = {
    O:{High:"Strong creative drive and intellectual curiosity. Seeks novel approaches.",Moderate:"Balanced between exploration and structure.",Low:"Prefers established procedures and defined frameworks."},
    C:{High:"Highly self-disciplined and reliable. Core predictor of job performance.",Moderate:"Generally reliable; occasional lapses under competing demands.",Low:"May struggle with consistent delivery. Recommend structured performance management."},
    E:{High:"Socially confident and assertive. Natural for leadership.",Moderate:"Comfortable in selective social contexts.",Low:"Performs best in focused, independent work."},
    A:{High:"Highly cooperative and empathetic. Strong team player.",Moderate:"Balances cooperation and independence effectively.",Low:"Direct and assertive. Can drive results but may create friction."},
    ES:{High:"Highly stable and composed under pressure.",Moderate:"Generally stable with some vulnerability under sustained pressure.",Low:"May experience significant stress under pressure."},
    CQ_K:{High:"Deep understanding of cultural dynamics.",Moderate:"Basic cultural awareness with gaps in nuanced understanding.",Low:"Limited cultural self-awareness."},
    CQ_M:{High:"Intrinsically motivated to engage across cultural boundaries.",Moderate:"Selectively motivated.",Low:"Limited motivation to engage cross-culturally."},
    CQ_B:{High:"Highly adaptive communicator across cultural contexts.",Moderate:"Adapts in familiar cross-cultural situations.",Low:"Communication style may be perceived as rigid."},
    OCB_A:{High:"Exceptional team support behaviour.",Moderate:"Helps others when capacity allows.",Low:"Primarily task-focused."},
    OCB_CV:{High:"Highly engaged institutional citizen.",Moderate:"Participates selectively.",Low:"Engagement confined to formal job requirements."},
    OCB_S:{High:"Tolerant of institutional imperfections.",Moderate:"Generally constructive but may voice frustrations.",Low:"Tendency to magnify workplace frustrations."},
    OCB_CO:{High:"Proactively manages information flow.",Moderate:"Keeps relevant parties informed when prompted.",Low:"Information is shared reactively."},
    OCB_Cn:{High:"Highly conscientious about time and effort.",Moderate:"Meets expectations consistently.",Low:"Attendance or effort may fall below expected standards."},
    LA_MA:{High:"Thrives in ambiguous, fast-changing environments.",Moderate:"Handles moderate ambiguity.",Low:"Prefers defined environments."},
    LA_PA:{High:"Highly self-aware and reflective learner.",Moderate:"Reflects when prompted.",Low:"Limited reflective practice."},
    LA_CA:{High:"Systems thinker with strong capacity for cross-functional analysis.",Moderate:"Understands immediate interdependencies.",Low:"Primarily task-focused."},
    LA_RA:{High:"Continuous learner who applies diverse knowledge.",Moderate:"Learns within defined areas.",Low:"Limited independent learning."},
    EO_RC:{High:"Strong rule compliance orientation.",Moderate:"Generally compliant; occasional pragmatic deviations.",Low:"Elevated compliance risk."},
    EO_T:{High:"Highly transparent in decision-making.",Moderate:"Transparent in most situations.",Low:"Transparency gaps detected."},
    EO_ER:{High:"Strong ethical reasoning.",Moderate:"Ethical reasoning present but may yield to pressure.",Low:"Ethical reasoning may be compromised by results-orientation."},
    EO_AI:{High:"Strong pattern of authentic integrity.",Moderate:"Generally consistent behaviour.",Low:"Integrity indicators are inconsistent."}
  };
  return map[dim] ? map[dim][b] || b+' range.' : b+' range.';
};

// ─── THEME-AWARE HELPERS ──────────────────────────────────────────────────────
const bd = v => v>=75?'High':v>=50?'Moderate':'Low';
const bCol = v => v>=75 ? T.gn : v>=50 ? T.am : T.rd;
const bBg  = v => v>=75 ? T.gnP : v>=50 ? T.amP : T.rdP;
const barGrad = v => v>=75 ? `linear-gradient(90deg,${darkTheme.gn},#4ade80)` : v>=50 ? `linear-gradient(90deg,${darkTheme.am},#fcd34d)` : `linear-gradient(90deg,${darkTheme.rd},#f87171)`;

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

const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const end = parseInt(value);
    if (isNaN(end)) return;
    const duration = 2000;
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
const Nav = ({tab, setTab, hasResults, hasHistory, mode, setMode}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    {id:'home', l:'Overview'},
    {id:'assess', l:'Assessment'},
    ...(hasResults?[{id:'results', l:'Reports'}]:[]),
    ...(hasHistory?[{id:'progress', l:'Progress'}]:[]),
    {id:'legal', l:'Compliance & Privacy'},
  ];
  return (
    <>
      <nav style={{
        position:'sticky', top:0, zIndex:200,
        background:T.bg0 + 'EE',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom:`1px solid ${T.b2}`,
      }} className="no-print">
        <div style={{
          maxWidth:'1200px', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 16px', height:'64px',
        }}>
          {/* Logo */}
          <div style={{display:'flex', alignItems:'center', cursor:'pointer', flexShrink:0}} onClick={()=>setTab('home')}>
        <img src="/logo.svg" alt="CORE by Carnelian" style={{height:'48px', width:'auto', objectFit:'contain'}} />
      </div>

          {/* Desktop nav */}
          <div style={{display:'flex', alignItems:'center', gap:'4px', '@media(max-width:768px)':{display:'none'}}}>
            <div className="desktop-nav" style={{display:'flex', gap:'2px'}}>
              {navItems.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:'8px 14px', borderRadius:'6px', border:'none', cursor:'pointer',
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'700',
                  whiteSpace:'nowrap',
                  background: tab===t.id ? `${T.gold}20` : 'transparent',
                  color: tab===t.id ? T.gold : T.t2,
                  transition:'all 0.18s',
                }}
                onMouseOver={e=>{if(tab!==t.id){e.currentTarget.style.color=T.t0; e.currentTarget.style.background=T.b1;}}}
                onMouseOut={e=>{if(tab!==t.id){e.currentTarget.style.color=T.t2; e.currentTarget.style.background='transparent';}}}
                >{t.l}</button>
              ))}
            </div>
            <button className="desktop-theme-btn" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} style={{
              display:'flex', alignItems:'center', gap:'6px',
              padding:'8px 14px', borderRadius:'6px',
              border:`1px solid ${T.b2}`, background: T.bg2, color: T.t0,
              cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif",
              fontSize:'12px', fontWeight:'700', whiteSpace:'nowrap', transition:'all 0.2s',
            }}
            onMouseOver={e=>{e.currentTarget.style.borderColor=T.c; e.currentTarget.style.color=T.c;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=T.b2; e.currentTarget.style.color=T.t0;}}>
              {mode === 'dark' ? '☀ Light' : '◑ Dark'}
            </button>
          </div>

          {/* Mobile right side */}
          <div className="mobile-nav-controls" style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} style={{
              padding:'8px 12px', borderRadius:'6px',
              border:`1px solid ${T.b2}`, background: T.bg2, color: T.t0,
              cursor:'pointer', fontSize:'13px', fontWeight:'700',
            }}>
              {mode === 'dark' ? '☀' : '◑'}
            </button>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{
              display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
              gap:'5px', width:'40px', height:'40px',
              background: menuOpen ? `${T.c}20` : T.bg2,
              border:`1px solid ${menuOpen ? T.c : T.b2}`,
              borderRadius:'8px', cursor:'pointer', padding:'8px',
            }}>
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke={T.c} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <>
                  <div style={{width:'18px', height:'2px', background:T.t0, borderRadius:'1px'}}/>
                  <div style={{width:'18px', height:'2px', background:T.t0, borderRadius:'1px'}}/>
                  <div style={{width:'12px', height:'2px', background:T.t0, borderRadius:'1px', alignSelf:'flex-start'}}/>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            borderTop:`1px solid ${T.b2}`,
            background: T.bg1,
            padding:'12px 16px',
            display:'flex', flexDirection:'column', gap:'4px',
          }}>
            {navItems.map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id); setMenuOpen(false);}} style={{
                padding:'14px 16px', borderRadius:'8px', border:'none', cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'14px', fontWeight:'700',
                textAlign:'left', transition:'all 0.18s',
                background: tab===t.id ? `${T.gold}20` : 'transparent',
                color: tab===t.id ? T.gold : T.t1,
                borderLeft: tab===t.id ? `3px solid ${T.gold}` : `3px solid transparent`,
              }}>
                {t.l}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Inject CSS to show/hide desktop vs mobile nav */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-theme-btn { display: flex !important; }
          .mobile-nav-controls { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-theme-btn { display: none !important; }
          .mobile-nav-controls { display: flex !important; }
        }
      `}</style>
    </>
  );
};

// ─── HOME PAGE SUB-COMPONENTS ─────────────────────────────────────────────────
// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
const TypewriterText = ({ texts, speed = 72, deletingSpeed = 38, pause = 2400 }) => {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx]             = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const current = texts[idx];
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, deletingSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) { setDeleting(false); setIdx(i => (i + 1) % texts.length); }
  }, [charIdx, deleting, idx, texts, speed, deletingSpeed, pause]);

  return (
    <span style={{ color: T.c, fontStyle: 'italic' }}>
      {displayed}
      <span style={{ borderRight: `3px solid ${T.c}`, marginLeft: '2px', animation: 'blink 0.75s step-end infinite' }} />
    </span>
  );
};


// ─── INDUSTRY MARQUEE ─────────────────────────────────────────────────────────
const IndustryMarquee = () => {
  const industries = [
    '🏦 Banking & Finance', '📋 Insurance & Takaful', '🏛 Government & Civil Service',
    '🛒 FMCG & Consumer Goods', '📡 Telecom & Technology', '⚡ Energy & Utilities',
    '🏥 Healthcare & Pharma', '🏭 Manufacturing', '🌍 Development & NGOs',
    '🎓 Education & Academia', '🏗 Real Estate', '🛍 Retail & Distribution',
  ];
  return (
    <div style={{
      margin: '0 0 40px',
      overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
    }}>
      <style>{`
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-inner { display:flex; width:max-content; animation:marqueeScroll 30s linear infinite; }
        .marquee-inner:hover { animation-play-state:paused; }
      `}</style>
      <div className="marquee-inner">
        {[...industries, ...industries].map((ind, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '8px 18px', margin: '0 5px',
            background: T.bg2, border: `1px solid ${T.b2}`,
            borderRadius: '100px', fontSize: '12px', fontWeight: '600',
            color: T.t2, whiteSpace: 'nowrap', cursor: 'default',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; e.currentTarget.style.background = T.goldP; }}
          onMouseOut={e  => { e.currentTarget.style.borderColor = T.b2; e.currentTarget.style.color = T.t2; e.currentTarget.style.background = T.bg2; }}>
            {ind}
          </span>
        ))}
      </div>
    </div>
  );
};

const StatsStrip = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const stats = [
    {n:'63',l:'Diagnostic Items'},{n:'14',l:'Dimensions Scored'},
    {n:'4', l:'Validity Indices'},{n:'10',l:'Lie-Detection Items'},
    {n:'12',l:'Industry Contexts'},{n:'5', l:'Distinct Reports'},
  ];
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if(e.isIntersecting){ setVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="grid-6-col" style={{
      display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1px',
      background:T.b2, border:`1px solid ${T.b2}`,
      borderRadius:'10px', overflow:'hidden', marginTop:'80px',
    }}>
      {stats.map((s,i) => (
        <div key={i} style={{
          background:T.bg1, textAlign:'center', padding:'28px 12px',
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0)' : 'translateY(24px)',
          transition:`opacity .65s ease ${i*.09}s, transform .65s cubic-bezier(.16,1,.3,1) ${i*.09}s, background .2s`,
        }}
        onMouseOver={e => e.currentTarget.style.background = T.bg2}
        onMouseOut={e  => e.currentTarget.style.background = T.bg1}
        >
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'2.6rem', color:T.gold, fontWeight:'700', lineHeight:'1'}}>
            {vis ? <AnimatedNumber value={s.n} /> : '0'}
          </div>
          <div className="mono" style={{fontSize:'9px', color:T.t2, textTransform:'uppercase', letterSpacing:'0.12em', marginTop:'8px', fontWeight:'600'}}>{s.l}</div>
        </div>
      ))}
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({setTab}) => {
  const [scrollPct, setScrollPct] = useState(0);
  const listColors = [T.c, T.gold, T.gn, T.am, '#8B5CF6', '#38BDF8', '#F472B6', '#A78BFA'];
  
  const [activeOrgCase, setActiveOrgCase] = useState(null);
  const [activeIndCase, setActiveIndCase] = useState(null);

  const orgUseCases = [
    { t:'Pre-Hiring Screening',       d:'Reduce the cost of bad hires. Interview probe questions are generated for every at-risk role placement.', stat:'30–40%', statLabel:'mis-hire reduction', src:'SHRM 2022' },
    { t:'Succession Planning',        d:'Leadership Readiness Score and pattern analysis surface the candidates traditional systems miss.', stat:'40%', statLabel:'new leaders fail within 18 months', src:'CEB 2014' },
    { t:'L&D Targeting',              d:'Map specific development investments to specific individual gaps. Stop sending everyone to the same programme.', stat:'4×', statLabel:'higher ROI vs generic training', src:'Salas et al 2012' },
    { t:'Compliance Risk',            d:'The Compliance & Integrity Index gives risk committees a psychometric data point before placing staff in fiduciary roles.', stat:'67%', statLabel:'of fraud cases had no prior record', src:'ACFE 2022' },
    { t:'Team Composition',           d:'Run a cohort and compare Team Value Scores across the group. Identify gaps and redundancies early.', stat:'+35%', statLabel:'revenue from high-CQ teams', src:'HBR 2018' },
    { t:'Post-Training Evaluation',   d:'Re-assess after a development programme. The progress tracker proves exactly which scores moved.', stat:'r=.51', statLabel:'personality + integrity validity', src:'Schmidt & Hunter 1998' },
    { t:'Donor Accountability',       d:'Development sector organisations can show donors peer-reviewed evidence behind staff selection.', stat:'ρ=.41', statLabel:'integrity → conduct prediction', src:'Ones et al 1993' },
    { t:'Civil Service Promotion',    d:'Objective, legally defensible data for BPS promotion decisions — merit-based and auditable.', stat:'200%', statLabel:'cost of a bad hire (% salary)', src:'Cascio 2000' },
  ];

  const indUseCases = [
    { t:'Career Positioning',         d:'Discover your unique professional archetype to seek roles that align with your natural strengths.', stat:'+43%', statLabel:'higher productivity in aligned roles', src:'Gallup 2021' },
    { t:'Targeted Growth',            d:'Stop guessing what to improve. Focus your energy on the 2-3 specific gaps that will actually move the needle.', stat:'3×', statLabel:'faster growth via targeted feedback', src:'Ericsson 2006' },
    { t:'Burnout Prevention',         d:'Identify when your delivery drive is outpacing your emotional resilience before it becomes a crisis.', stat:'60%', statLabel:'drop in burnout with self-awareness', src:'Maslach 2016' },
    { t:'Interview Mastery',          d:'Walk into interviews armed with objective data about your working style, strengths, and adaptability.', stat:'2.5×', statLabel:'higher callback rates with self-insight', src:'HBR 2019' },
    { t:'Navigating Culture',         d:'Use your Cultural Intelligence scores to better decode unspoken workplace dynamics and build alliances.', stat:'+40%', statLabel:'trust increase in diverse teams', src:'Livermore 2015' },
    { t:'Promotion Readiness',        d:'Understand exactly how leadership evaluates readiness and close the behavioural gaps holding you back.', stat:'82%', statLabel:'of promotions hinge on behavioural skills', src:'CCL 2018' },
    { t:'Feedback Resilience',        d:'Transform how you handle criticism by understanding your People Agility and defensive triggers.', stat:'+30%', statLabel:'performance boost from feedback agility', src:'DeRue 2012' },
    { t:'Ethical Confidence',         d:'Clarify your own boundaries so you can confidently navigate high-pressure requests without compromising values.', stat:'50%', statLabel:'less stress when values are defined', src:'Haidt 2012' },
  ];

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setScrollPct((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="core-root">
      <div className="page-progress" style={{ height: `${scrollPct}%` }} />

      {/* ── HERO ── */}
      <section className="section-container" style={{
        background:'transparent', display:'flex', flexDirection:'column',
        justifyContent:'center', position:'relative', overflow:'hidden',
        padding:'100px 32px 64px',
      }}>
        {/* Ambient glows */}
        <div style={{position:'absolute', top:'-15%', right:'-8%', width:'65vw', height:'65vw', borderRadius:'50%', background:`radial-gradient(circle, ${T.cGlow} 0%, transparent 65%)`, pointerEvents:'none', animation:'glowPulse 8s ease-in-out infinite', zIndex:0}} />
        <div style={{position:'absolute', bottom:'-12%', left:'-4%', width:'45vw', height:'45vw', borderRadius:'50%', background:`radial-gradient(circle, ${T.goldP} 0%, transparent 65%)`, pointerEvents:'none', animation:'glowPulse 10s ease-in-out infinite', animationDelay:'-4s', zIndex:0}} />

        <div style={{maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1, width:'100%'}}>
          <div style={{textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>

            {/* Badge */}
            <div className="anim-fadeUp" style={{marginBottom:'32px'}}>
              <Pill
                label={<span style={{display:'inline-flex', alignItems:'center'}}>🇵🇰 Built for Pakistan's Professional Landscape</span>}
                color={T.t0}
                style={{fontSize:'11px', padding:'8px 20px', fontWeight:'800'}}
              />
            </div>

            {/* Headline — second line uses typewriter */}
            <div className="anim-fadeUp" style={{animationDelay:'0.12s'}}>
              <h1 style={{
                fontFamily:"'Playfair Display',serif", fontWeight:'700',
                fontSize:'clamp(2.8rem,6vw,5rem)', color:T.t0,
                lineHeight:'1.05', margin:'0 0 16px', letterSpacing:'-0.03em',
              }}>
                Assess the whole professional.<br/>
                <TypewriterText texts={[
                  'Not just the performance review.',
                  'Not just the interview.',
                  'Not just the annual appraisal.',
                  'Not just the reference check.',
                  'Not just the CV.',
                ]} />
              </h1>
            </div>

            {/* Divider */}
            <div className="anim-fadeUp" style={{animationDelay:'0.22s'}}>
              <GoldLine style={{width:'80px', margin:'28px auto'}} />
            </div>

            {/* Subtitle */}
            <div className="anim-fadeUp" style={{animationDelay:'0.32s'}}>
              <p style={{color:T.t1, fontSize:'16px', maxWidth:'700px', lineHeight:'1.8', margin:'0 auto 48px', fontWeight:'500'}}>
                CORE is a validated, 63‑item psychometric assessment powered by Carnelian’s proprietary algorithm - refined over 30+ years of L&D expertise and validated across 12 industry contexts in Pakistan. With built‑in validity controls, social desirability screening, and an industry context engine, CORE delivers instant, scientifically grounded results.
              </p>
            </div>

            {/* CTA */}
            <div className="anim-fadeUp" style={{animationDelay:'0.42s', display:'flex', justifyContent:'center', marginTop:'10px'}}>
              <button onClick={()=>setTab('assess')} style={{
                padding:'18px 48px', borderRadius:'100px', border:'none', cursor:'pointer',
                background:T.c, color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontSize:'15px', fontWeight:'800', letterSpacing:'0.06em', textTransform:'uppercase',
                animation:'btnPulse 2s infinite',
                transition:'all 0.3s ease',
              }}
              onMouseOver={e=>{ e.target.style.transform='translateY(-4px) scale(1.02)'; e.target.style.background=T.cDark; }}
              onMouseOut={e=>{ e.target.style.transform='none'; e.target.style.background=T.c; }}>
                Begin Assessment →
              </button>
            </div>

            {/* Stats Strip */}
            <div className="anim-fadeUp" style={{animationDelay:'0.52s', width:'100%'}}>
              <StatsStrip />
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE ── */}
      <section className="section-container" style={{padding:'32px 32px 64px', maxWidth:'1100px', margin:'0 auto'}}>

        {/* Section header */}
        <Reveal delay={0}>
          <div style={{marginBottom:'48px', textAlign:'center'}}>
            <Pill label="Platform Deep Dive" color={T.c} />
            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:'700',
              margin:'16px 0 12px', color:T.t0, letterSpacing:'-0.02em',
            }}>
              What makes CORE the tool for you
            </h2>
            <p style={{fontSize:'15px', color:T.t2, maxWidth:'700px', margin:'0 auto', fontWeight:'500'}}>
              A complete picture of everything CORE does, built for HR leaders, L&D professionals,
              and organisational decision-makers across Pakistan.
            </p>
          </div>
        </Reveal>

        {/* ── MODULES ── */}
        <div style={{marginBottom:'16px'}}>
          <Reveal delay={0}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
              <span style={{fontSize:'24px'}}>🧠</span>
              <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:'700', color:T.t0}}>
                Five Evidence‑Based Assessment Pillars, 63 Items Total

              </h3>
            </div>
          </Reveal>
          <div className="grid-5-col" style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px'}}>
            {[
              {n:'1', t:'Personality at Work',   d:'Big Five OCEAN framework. Predicts job performance, leadership readiness, and team fit.', c:T.c},
              {n:'2', t:'Cultural Intelligence',  d:"CQ Knowledge, Motivation, and Behaviour. Critical for Pakistan's diverse provincial, institutional, and international contexts.", c:T.gold},
              {n:'3', t:'Workplace Initiative',   d:'Five OCB dimensions: Altruism, Civic Virtue, Sportsmanship, Courtesy, and Conscientiousness. Reveals what sustains an institution.', c:T.gn},
              {n:'4', t:'Learning Agility',       d:'Mental, People, Change, and Results Agility. The strongest single predictor of leadership potential beyond current performance.', c:T.am},
              {n:'5', t:'Integrity & Ethics',     d:'Rule Compliance, Transparency, Ethical Reasoning, Authentic Integrity. The compliance screen every Pakistani employer needs.', c:'#8B5CF6'},
            ].map((m,i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background:T.bg1, border:`1px solid ${T.b2}`,
                  borderTop:`3px solid ${m.c}`, borderRadius:'10px',
                  padding:'20px', height:'100%', cursor:'default',
                  transition:'transform .28s ease, box-shadow .28s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 10px 30px rgba(0,0,0,.5), 0 0 0 1px ${m.c}40`; }}
                onMouseOut={e  => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                  <div className="mono" style={{fontSize:'10px', fontWeight:'700', color:m.c, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px'}}>Pillar {m.n}</div>
                  <div style={{fontSize:'14px', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>{m.t}</div>
                  <div style={{fontSize:'12px', color:T.t2, lineHeight:'1.5', fontWeight:'500'}}>{m.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── INDUSTRY MARQUEE ── */}
        <Reveal delay={0}>
          <div style={{marginBottom:'8px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'10px', textAlign:'center'}}>
              Context engine covers 12 Pakistani sectors — hover to pause
            </div>
            <IndustryMarquee />
          </div>
        </Reveal>

        {/* ── REPORTS SLIDESHOW ── */}
        <Reveal delay={0}>
          <ReportsSlideshow />
        </Reveal>

        {/* ── USE CASES — ORGS & INDIVIDUALS SIDE-BY-SIDE ── */}
        <div style={{ marginBottom: '64px' }}>
          <Reveal delay={0}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Pill label="Strategic Value" color={T.c} />
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: '700',
                margin: '16px 0 12px', color: T.t0, letterSpacing: '-0.02em',
              }}>
                Impact at Every Level
              </h2>
              <p style={{ fontSize: '15px', color: T.t2, maxWidth: '700px', margin: '0 auto', fontWeight: '500' }}>
                Whether you are building a high-performing organisation or navigating your own career trajectory, CORE provides the exact data you need to move forward.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
            
            {/* For Organisations */}
            <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'16px', padding:'40px'}}>
              <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:'700', color:T.t0, marginBottom:'6px'}}>
                For Organisations
              </h3>
              <p className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:'700', marginBottom:'24px'}}>
                Click any card for the research behind it
              </p>
              <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px'}}>
                {orgUseCases.map((u,i) => {
                  const isActive = activeOrgCase === i;
                  const col = listColors[i % listColors.length];
                  return (
                    <div key={i}
                      onClick={() => setActiveOrgCase(isActive ? null : i)}
                      style={{
                        background: isActive ? `${col}12` : T.b0,
                        borderRadius:'10px', padding:'16px',
                        border: isActive ? `1px solid ${col}40` : `1px solid transparent`,
                        borderLeft:`3px solid ${isActive ? col : col + '60'}`,
                        cursor:'pointer', transition:'all 0.25s ease',
                        transform: isActive ? 'translateY(-4px)' : '',
                        boxShadow: isActive ? `0 8px 24px rgba(0,0,0,.3), 0 0 0 1px ${col}20` : '',
                      }}
                      onMouseOver={e => { if(!isActive){ e.currentTarget.style.background=T.b1; e.currentTarget.style.transform='translateY(-3px)'; }}}
                      onMouseOut={e  => { if(!isActive){ e.currentTarget.style.background=T.b0; e.currentTarget.style.transform=''; }}}
                    >
                      <div style={{fontSize:'12px', fontWeight:'700', color: isActive ? col : col, marginBottom:'6px'}}>{u.t}</div>
                      <div style={{fontSize:'11.5px', color:T.t1, lineHeight:'1.5', fontWeight:'500', marginBottom: isActive ? '14px' : '0'}}>{u.d}</div>

                      <div style={{ overflow:'hidden', maxHeight: isActive ? '80px' : '0', opacity: isActive ? 1 : 0, transition:'max-height 0.32s ease, opacity 0.24s ease' }}>
                        <div style={{ background: T.b0, borderRadius:'7px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:'700', color: col, flexShrink:0, lineHeight:1 }}>{u.stat}</div>
                          <div>
                            <div style={{fontSize:'10px', fontWeight:'700', color:T.t1, lineHeight:'1.3'}}>{u.statLabel}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, fontWeight:'600', marginTop:'2px'}}>{u.src}</div>
                          </div>
                        </div>
                      </div>

                      {!isActive && <div style={{fontSize:'9px', color:T.t3, marginTop:'8px', fontWeight:'600'}}>→ see the research</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* For Individuals */}
            <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'16px', padding:'40px'}}>
              <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:'700', color:T.t0, marginBottom:'6px'}}>
                For Individuals
              </h3>
              <p className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:'700', marginBottom:'24px'}}>
                Click any card for the research behind it
              </p>
              <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px'}}>
                {indUseCases.map((u,i) => {
                  const isActive = activeIndCase === i;
                  const col = listColors[(i+4) % listColors.length]; // Stagger colors so it looks diverse
                  return (
                    <div key={i}
                      onClick={() => setActiveIndCase(isActive ? null : i)}
                      style={{
                        background: isActive ? `${col}12` : T.b0,
                        borderRadius:'10px', padding:'16px',
                        border: isActive ? `1px solid ${col}40` : `1px solid transparent`,
                        borderLeft:`3px solid ${isActive ? col : col + '60'}`,
                        cursor:'pointer', transition:'all 0.25s ease',
                        transform: isActive ? 'translateY(-4px)' : '',
                        boxShadow: isActive ? `0 8px 24px rgba(0,0,0,.3), 0 0 0 1px ${col}20` : '',
                      }}
                      onMouseOver={e => { if(!isActive){ e.currentTarget.style.background=T.b1; e.currentTarget.style.transform='translateY(-3px)'; }}}
                      onMouseOut={e  => { if(!isActive){ e.currentTarget.style.background=T.b0; e.currentTarget.style.transform=''; }}}
                    >
                      <div style={{fontSize:'12px', fontWeight:'700', color: isActive ? col : col, marginBottom:'6px'}}>{u.t}</div>
                      <div style={{fontSize:'11.5px', color:T.t1, lineHeight:'1.5', fontWeight:'500', marginBottom: isActive ? '14px' : '0'}}>{u.d}</div>

                      <div style={{ overflow:'hidden', maxHeight: isActive ? '80px' : '0', opacity: isActive ? 1 : 0, transition:'max-height 0.32s ease, opacity 0.24s ease' }}>
                        <div style={{ background: T.b0, borderRadius:'7px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:'700', color: col, flexShrink:0, lineHeight:1 }}>{u.stat}</div>
                          <div>
                            <div style={{fontSize:'10px', fontWeight:'700', color:T.t1, lineHeight:'1.3'}}>{u.statLabel}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, fontWeight:'600', marginTop:'2px'}}>{u.src}</div>
                          </div>
                        </div>
                      </div>

                      {!isActive && <div style={{fontSize:'9px', color:T.t3, marginTop:'8px', fontWeight:'600'}}>→ see the research</div>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </Reveal>
        </div>
      </section>
    </div>
  );
};

const ReportsSlideshow = () => {
  const [active, setActive] = useState(0);
  const [prog,   setProg]   = useState(0);
  const [fade,   setFade]   = useState(true);
  const INTERVAL = 15000;

  const reports = [
    { i:'📊', c:'#60A5FA', t:'Technical Report',       s:'HR & Leadership',
      d:'Full psychometric breakdown. 7 composite indices, validity analysis, cross-dimensional risk patterns, role suitability matrix with interview probes, industry lens, completion time tracking.',
      tags:['7 Composite Indices','Risk Patterns','Interview Probes','Industry Lens'] },
    { i:'🧭', c:'#4ADE80', t:'Candidate Action Plan',  s:'Individual',
      d:'Personal development roadmap. Visual score dashboard, numbered 10-step action plans per gap, profile-matched books, TED talks, YouTube resources, peer-reviewed research.',
      tags:['10-Step Plans','Curated Resources','Score Dashboard','Research-Backed'] },
    { i:'👥', c:'#FBBF24', t:'Team Aggregate Report',  s:'Batch-level',
      d:'Appears automatically when you run 2+ assessments in a batch. Team dimension averages, composite benchmarks, archetype distribution, collective risk pattern frequency, validity summary.',
      tags:['Team Averages','Archetype Distribution','Risk Frequency','Auto-Generated'] },
      { i:'🏢', c:'#6366F1', t:'Team Composition Report', s:'HR Strategy',
  d:'Strategic workforce mapping. Highlights team role balance, skill distribution, leadership pipeline strength, and succession readiness. Identifies gaps in composition that affect long-term organisational resilience and provides recommendations for HR strategy.',
  tags:['Role Balance','Skill Distribution','Leadership Pipeline','Succession Readiness'] },
    { i:'🎮', c:'#E879F9', t:'Player Report',           s:'Gamified',
      d:'Dark RPG aesthetic. Game class, XP, 10 levels, achievement badges, quest objectives with progress saved, power-up armory for every resource. Makes development feel like a game.',
      tags:['10 Levels','Achievement Badges','Quest Objectives','Power-Up Armory'] },
    
  ];

  const goTo = i => {
    if(i === active) return;
    setFade(false);
    setTimeout(() => { setActive(i); setProg(0); setFade(true); }, 320);
  };

  useEffect(() => {
    setProg(0); setFade(true);
    const tick = setInterval(() => setProg(p => Math.min(p + (100 / (INTERVAL / 80)), 100)), 80);
    const adv  = setTimeout(() => {
      setFade(false);
      setTimeout(() => { setActive(a => (a + 1) % reports.length); setProg(0); setFade(true); }, 320);
    }, INTERVAL);
    return () => { clearInterval(tick); clearTimeout(adv); };
  }, [active]);

  const r = reports[active];

  return (
    <div style={{
      background:`linear-gradient(135deg, ${T.bg1} 0%, ${T.bg2} 100%)`,
      border:`1px solid ${T.b2}`, borderRadius:'16px',
      overflow:'hidden', marginBottom:'24px',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding:'40px 48px 32px', borderBottom:`1px solid ${T.b2}`,
        display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        flexWrap:'wrap', gap:'16px',
      }}>
        <div>
          <Pill label="Five Reports · One Assessment" color={T.c} />
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:'700',
            color:T.t0, marginTop:'16px', marginBottom:'10px', letterSpacing:'-0.02em',
          }}>
            Every assessment generates five<br/>
            <em style={{color:T.gold, fontStyle:'italic'}}>purpose-built reports</em>
          </h2>
          <p style={{fontSize:'13px', color:T.t2, maxWidth:'560px', lineHeight:1.7, fontWeight:'500'}}>
            Each report is written for a specific reader — HR gets technical depth, individuals get a roadmap,
            teams get aggregate insights, candidates get a gamified experience.
          </p>
        </div>
        {/* dot indicators */}
        <div style={{display:'flex', gap:'6px', alignItems:'center', flexShrink:0, paddingTop:'4px'}}>
          {reports.map((_,i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: active===i ? '28px' : '8px', height:'8px',
              borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
              background: active===i ? reports[i].c : T.b2,
              transition:'all .4s ease',
            }} />
          ))}
        </div>
      </div>

      {/* ── Body ── */}
<div className="slideshow-layout" style={{display:'grid', gridTemplateColumns:'260px 1fr'}}>
        {/* Tab list */}
<div className="slideshow-tabs" style={{borderRight:`1px solid ${T.b2}`, padding:'20px 16px', display:'flex', flexDirection:'column', gap:'6px'}}>
            {reports.map((rep, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'14px 16px', borderRadius:'8px',
              border:`1px solid ${active===i ? `${rep.c}50` : 'transparent'}`,
              background: active===i ? `${rep.c}12` : 'transparent',
              cursor:'pointer', textAlign:'left', position:'relative', overflow:'hidden',
              transition:'all .3s ease',
            }}
            onMouseOver={e => { if(active!==i) e.currentTarget.style.background=T.b0; }}
            onMouseOut ={e => { if(active!==i) e.currentTarget.style.background='transparent'; }}>
              {/* active indicator stripe */}
              <div style={{
                position:'absolute', left:0, top:'12%', bottom:'12%', width:'3px',
                background:rep.c, borderRadius:'0 2px 2px 0',
                opacity: active===i ? 1 : 0, transition:'opacity .3s',
              }} />
              <span style={{
                fontSize:'20px', flexShrink:0,
                filter: active===i ? `drop-shadow(0 0 8px ${rep.c})` : 'none',
                transition:'filter .3s',
              }}>{rep.i}</span>
              <div>
                <div style={{fontSize:'12px', fontWeight:'700', color:active===i?rep.c:T.t1, transition:'color .3s', marginBottom:'2px'}}>{rep.t}</div>
                <div className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em'}}>{rep.s}</div>
              </div>
              {/* progress bar */}
              {active===i && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:'2px', background:`${rep.c}28`}}>
                  <div style={{height:'100%', background:rep.c, width:`${prog}%`, transition:'width .08s linear'}} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="slideshow-content" style={{
          padding:'48px', minHeight:'300px', position:'relative',
          overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center',
        }}>
          {/* ambient glow that shifts with active report */}
          <div style={{
            position:'absolute', top:'-20%', right:'-10%',
            width:'400px', height:'400px', borderRadius:'50%',
            background:`radial-gradient(circle, ${r.c}18 0%, transparent 68%)`,
            pointerEvents:'none', transition:'background .5s ease',
          }} />
          <div style={{
            opacity: fade ? 1 : 0,
            transform: fade ? 'translateY(0)' : 'translateY(12px)',
            transition:'opacity .32s ease, transform .32s ease',
            position:'relative', zIndex:1,
          }}>
            <div style={{fontSize:'3.2rem', marginBottom:'18px', lineHeight:1}}>{r.i}</div>
            <h3 style={{
              fontFamily:"'Playfair Display',serif", fontSize:'1.9rem',
              fontWeight:'700', color:r.c, marginBottom:'4px',
              textShadow:`0 0 30px ${r.c}55`,
            }}>{r.t}</h3>
            <div className="mono" style={{
              fontSize:'9px', color:T.t3, textTransform:'uppercase',
              letterSpacing:'0.14em', marginBottom:'18px', fontWeight:'600',
            }}>{r.s}</div>
            <p style={{fontSize:'14px', color:T.t1, lineHeight:1.8, marginBottom:'24px', maxWidth:'500px'}}>{r.d}</p>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
              {r.tags.map((tag,i) => (
                <span key={i} className="mono" style={{
                  padding:'5px 12px', borderRadius:'4px', fontSize:'10px', fontWeight:'700',
                  background:`${r.c}14`, color:r.c, border:`1px solid ${r.c}30`,
                  letterSpacing:'0.05em',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ASSESSMENT PAGE ──────────────────────────────────────────────────────────
const AssessmentPage = ({setTab, setReportData, setHistoryFlag}) => {
  const [step, setStep] = useState('admin'); // Starts at Admin now
  const [assessmentType, setAssessmentType] = useState(null);
  const [intakeStage, setIntakeStage] = useState(1);
const [resp, setResp] = useState({name:'',email:'',phone:'',emp:'',dept:'',deptOther:'',role:'',exp:'',gender:'',org:'',industry:'', batch:'', purpose:'', level:'', conf:'Restricted — HR Leadership Only'});  const [answers, setAnswers] = useState(Array(QS.length).fill(null));
  const [cur, setCur] = useState(0);
  const [breaker, setBreaker] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [gameScores, setGameScores] = useState({seesaw:50,scenario1:0,scenario2:0});
  
  // Seesaw state
  const [ssVals, setSsVals] = useState([50,50,50]);
  const [ssStep, setSsStep] = useState(0);
  
  const [timer, setTimer] = useState(45);
  const [timerActive, setTimerActive] = useState(false);
  const [cheer, setCheer] = useState(null);
  const CHEERS = [
  "Well done, nicely done.",
  "Excellent effort, appreciated.",
  "Nice response, thank you.",
  "Solid thinking, well done.",
  "Thoughtful answer, thanks.",
  "Clear response, much appreciated.",
  "Good effort, well recorded.",
  "Strong reflection, thank you.",
  "Helpful input, noted.",
  "Well considered, thank you.",
  "Good clarity, appreciated.",
  "Nice insight, well noted.",
  "Thoughtful choice, recorded.",
  "Meaningful response, thanks.",
  "Valuable input, thank you.",
  "Good reasoning, noted.",
  "Careful reflection, appreciated.",
  "Concise answer, well done.",
  "Thank you for sharing."
  ];
  const [gameLocked, setGameLocked] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [gameChoice, setGameChoice] = useState(null);
  const [priorFound, setPriorFound] = useState(null);
const [consentChecked, setConsentChecked] = useState(false);
const [legalChecked, setLegalChecked] = useState(false);
  const [startTime, setStartTime] = useState(null);
    const timerRef = useRef(null);

useEffect(()=>{
  if(resp.email && resp.email.includes('@')){
    try{
      const h=JSON.parse(localStorage.getItem('core_v3_history')||'[]');
      const prior=h.filter(e => e.email && e.email.toLowerCase()===resp.email.toLowerCase());
      setPriorFound(prior.length>0?prior[prior.length-1]:null);
    }catch(e){}
  }
},[resp.email]);

  useEffect(()=>{
    if(timerActive&&timer>0){ timerRef.current=setTimeout(()=>setTimer(t=>t-1),1000); }
    else if(timerActive&&timer===0){ setTimerActive(false); setGameLocked(true); setGameChoice({quality:'timeout'}); }
    return()=>clearTimeout(timerRef.current);
  },[timerActive,timer]);

  // NEW: Scroll to top whenever the step or intake stage changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, intakeStage]);

  const startTimer=()=>{ setTimer(45); setTimerActive(true); setGameLocked(false); setGameChoice(null); };

  const handleAnswer=(val)=>{
    const a=[...answers]; a[cur]=val; setAnswers(a);
        setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);

  };

const nextQ=()=>{
  setCheer(null);
    if(cur===QS.length-1){ generate(); return; }
    const curCh=QS[cur].ch, nextCh=QS[cur+1].ch, nextIdx=cur+1;
    
    // New PACER v3.0 Game Triggers
    if(nextIdx===8){setGameStage('g1'); setSsStep(0); return;}     // Seesaw 1
    if(nextIdx===20){setGameStage('g1'); setSsStep(1); return;}    // Seesaw 2
    if(nextIdx===28){setGameStage('g2warn'); return;}              // Timed Scenario 1
    if(nextIdx===42){setGameStage('g1'); setSsStep(2); return;}    // Seesaw 3
    if(nextIdx===53){setGameStage('g3warn'); return;}              // Timed Scenario 2
    
    setCur(nextIdx);
    if(curCh!==nextCh&&BREAKERS[curCh]) setBreaker(curCh);
    else setBreaker(null);
  };

const prevQ=()=>{ if(cur>0){setCur(cur-1); setBreaker(null); setCheer(null);} };

  const updateSeesaw = (val) => {
    const newVals = [...ssVals];
    newVals[ssStep] = parseInt(val);
    setSsVals(newVals);
  };

  const nextSeesaw = () => {
    const newVals = [...ssVals];
    const avg = ssStep === 2 ? Math.round((newVals[0]+newVals[1]+newVals[2])/3) : gameScores.seesaw;
    setGameScores(g=>({...g,seesaw:avg}));
    setGameStage(null);
    
    let resumeIdx = cur;
    if (ssStep === 0) resumeIdx = 8;
    if (ssStep === 1) resumeIdx = 20;
    if (ssStep === 2) resumeIdx = 42;
    
    setCur(resumeIdx);
  };

  const chooseScenario=(quality,gameNum,key)=>{
    if(gameLocked) return;
    setTimerActive(false); setGameLocked(true);
    const score=quality==='best'?7:quality==='ok'?4:quality==='timeout'?0:-5;
    if(gameNum===2) setGameScores(g=>({...g,scenario1:score}));
    else setGameScores(g=>({...g,scenario2:score}));
    setGameChoice({quality,score,key});
  };

  const generate = async () => {
    setGenerating(true);
    const O=scoreDim('O',answers),C=scoreDim('C',answers),E=scoreDim('E',answers),A=scoreDim('A',answers);
    const ES=scoreDim('ES',answers);
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
    
    const elapsedMs = startTime ? Date.now() - startTime : 0;
    const elapsedMins = Math.floor(elapsedMs / 60000);
    const elapsedSecs = Math.floor((elapsedMs % 60000) / 1000);
    const completionTime = elapsedMs > 0 ? `${elapsedMins}m ${elapsedSecs}s` : 'Not recorded';
    const completionFlag = elapsedMs > 0 && elapsedMs < 420000 ? '⚠ Unusually fast — verify engagement' : elapsedMs > 3600000 ? '⚠ Unusually long — possible interruption' : '✅ Within expected range (10–35 min)';
    
    const gameSummary={
      seesaw:{val:gs.seesaw,bonus:ssBonus,label:ssBonus>=7?'Principled & Nuanced':ssBonus>=2?'Balanced':ssBonus>=-2?'Relational-leaning':'High relational — process risk'},
      scenario1:{raw:sc1,label:sc1>=7?'Optimal response':sc1>=4?'Good approach':sc1===0?'Timed out':'Below average — poor response'},
      scenario2:{raw:sc2,label:sc2>=7?'Strong integrity under pressure':sc2>=4?'Moderate awareness':sc2===0?'Timed out':'High-risk — compliance concern'},
    };

    // CROSS-DIMENSIONAL PATTERNS
    const patterns = [];
    if(S.C>=68&&S.EOavg<=60) patterns.push({sev:'red', name:'Performance-Ethics Disconnect', headline:'High Delivery Drive + Weak Ethical Guardrails', detail:'Conscientiousness is strong, but Ethical Orientation falls below the threshold needed for unsupervised accountability.', action:'DO NOT place in treasury, procurement, audit, credit, or any role with unsupervised financial discretion.'});
    if(S.E>=70&&S.EO_AI<=60) patterns.push({sev:'red', name:'Charismatic Integrity Risk', headline:'High Social Confidence + Inconsistent Authentic Integrity', detail:'Extraversion places this person in high-visibility roles, but Authentic Integrity is below threshold. High extraversion can mask integrity deficits.', action:'Add a structured integrity reference check. Do not place in client fund management without direct oversight.'});
    if(S.LAavg>=70&&S.EOavg<=60) patterns.push({sev:'red', name:'Talented Maverick', headline:'High Learning Agility + Weak Ethical Framework', detail:'Learns exceptionally fast but has weak Ethical Orientation. Will quickly identify workarounds and use them without adequate ethical guardrails.', action:'Assign a senior mentor with explicit ethical accountability remit. Do not give unsupervised discretion in first 12 months.'});
    if(S.EO_RC<55) patterns.push({sev:'red', name:'Direct Compliance Risk', headline:'Rule Compliance Below Acceptable Threshold', detail:'Rule Compliance is below 55. This indicates a material risk in any position of institutional trust.', action:'Mandatory ethics and compliance training before any placement.'});
    if(S.ES<=60&&S.E>=65) patterns.push({sev:'red', name:'Visible and Volatile', headline:'High Public Presence + Low Emotional Stability', detail:'Energetic and front-facing, but Emotional Stability is below threshold. Under pressure, emotional stability gaps become visible.', action:'Resilience coaching and emotional regulation support before elevation to senior or external-facing roles.'});
    
    if(S.C>=70&&S.ES<=60&&!patterns.find(p=>p.name==='Visible and Volatile')) patterns.push({sev:'amber', name:'Brittle High Performer', headline:'High Conscientiousness + Lower Emotional Stability', detail:'Delivers reliably but fragile emotional regulation can produce perfectionism-driven stress or burnout under sustained pressure.'});
    if(S.EOavg>=72&&S.LAavg<55) patterns.push({sev:'amber', name:'Ethical but Rigid', headline:'Strong Ethics + Low Learning Agility', detail:'Trustworthy and principled, but may be resistant to procedural change and struggle with ambiguity.'});
    if(S.OCBavg>=72&&S.C<=60) patterns.push({sev:'amber', name:'Team Citizen, Low Output', headline:'Exceptional Team Citizenship + Lower Individual Delivery', detail:'A team anchor who supports colleagues, but individual delivery is below threshold. May cover for weaker colleagues at the expense of their own deliverables.'});
    if(S.CQavg<=60&&S.E>=65) patterns.push({sev:'amber', name:'Confident but Parochial', headline:'High Social Confidence + Lower Cultural Intelligence', detail:'Socially confident in familiar contexts, but lacks cultural adaptability. May damage relationships in unfamiliar cultural contexts.'});

    if(S.C>=75&&S.EOavg>=75&&S.LAavg>=65&&S.ES>=65) patterns.push({sev:'pos', name:'Elite Integrity Leader', headline:'Top-Quartile across Delivery, Ethics, Learning & Stability', detail:'Rare combination predictive of long-term performance in high-accountability leadership roles.'});
    if(S.OCBavg>=78&&!patterns.find(p=>p.name==='Team Citizen, Low Output')) patterns.push({sev:'pos', name:'Institutional Anchor', headline:'Exceptional Organisational Citizenship', detail:'Sustains team function, absorbs institutional friction, and maintains morale beyond formal role requirements.'});
    if(S.CQavg>=72&&S.E>=68&&S.A>=68) patterns.push({sev:'pos', name:'Cross-Cultural Bridge', headline:'Strong Cultural Intelligence + Social Effectiveness', detail:'Best suited for multi-stakeholder, multi-cultural, and relationship-intensive professional environments.'});
    if(S.LAavg>=75&&S.O>=70) patterns.push({sev:'pos', name:'Learning Champion', headline:'High Learning Agility + Intellectual Openness', detail:'Will outgrow their current role faster than peers. Strong training investment.'});

    const roles=[
      {name:'Compliance / Audit / Risk',score:CII,g:70,a:54,redNote:'CII below threshold. Do not place in treasury, procurement, audit, or unsupervised fiduciary roles without mandatory ethics intervention.',probeQ:['Describe a time following a rule precisely would have produced a worse outcome. What did you do and why?','Have you ever been asked by a superior to do something conflicting with policy? Walk me through exactly what happened.','Tell me about a decision that no one would have known about if you had decided differently. What did you do?']},
      {name:'Senior Leadership / Executive',score:LRS,g:72,a:55,redNote:'LRS below threshold. Not ready for senior leadership without structured development in the low-scoring composite dimensions.',probeQ:['Describe a time making a high-stakes decision with incomplete information. What was your process?','How do you manage your own performance and accountability? Give me a specific system.','Tell me about a time your team underperformed. What was your role, and what did you change?']},
      {name:'Client-Facing / Stakeholder Management',score:SES,g:68,a:52,redNote:'SES below threshold. Risk of damaged client relationships. Also verify EO_AI ≥ 55 before any role with unsupervised client fund access.',probeQ:['Tell me about the most difficult client or stakeholder relationship you have managed. How did you handle cultural differences?','Describe a time you had to say something a client did not want to hear. How did you frame it?']},
      {name:'Operations / Technical Specialist',score:OPS,g:67,a:51,redNote:'OPS below threshold. May struggle with sustained delivery and process adherence under pressure.',probeQ:['Walk me through how you organise your work when you have multiple competing deadlines.','Tell me about a time you had to maintain quality standards under significant time pressure.']},
      {name:'Change / Reform / Innovation',score:ADS,g:67,a:50,redNote:'ADS below threshold. Not suited for reform, transformation, or ambiguity-heavy roles without learning agility development.',probeQ:['Tell me about a time you had to work effectively without clear guidelines or established procedures.','Describe something you taught yourself in the last 12 months. How did you apply it?']},
      {name:'People Management / Team Lead',score:PMS,g:67,a:51,redNote:'PMS below threshold. Interpersonal, ethical, or team cohesion dimensions insufficiently developed for people management.',probeQ:['Tell me about a team member you had difficulty with. How did you manage that relationship?','Describe a time you had to give critical feedback to someone. How did you approach it?']},
    ];

// Generate Programs to save to DB for the Dashboard
    const progs = [];
    if(S.E<60||S.A<60) progs.push({name:'Communication & Influence Workshop', desc:'Covers assertive communication, active listening, and managing difficult conversations.'});
    if(S.EOavg<65) progs.push({name:'Professional Ethics & Values Programme', desc:'Ethical decision-making frameworks and integrity under pressure.'});
    if(S.LAavg<65) progs.push({name:'Learning Agility & Growth Mindset', desc:'Building the specific habits that accelerate professional development.'});
    if(S.CQavg<65) progs.push({name:'Intercultural Communication Workshop', desc:'Cross-cultural effectiveness for Pakistani multi-institutional contexts.'});
    if(S.ES<60) progs.push({name:'Resilience & Emotional Intelligence', desc:'Evidence-based resilience frameworks for high-stakes environments.'});
    if(CI.LRS>=55) progs.push({name:'Leadership Development Programme (LDP)', desc:'Flagship leadership development pathway.'});
    const programs = progs.slice(0,4);

    // Define reportDataObj FIRST so the database payload can use it
    const reportDataObj = { scores: S, profile, validity, CI, gameSummary, patterns, programs, respondent: resp, cfg: { org: resp.org, industry: resp.industry, batch: resp.batch, purpose: resp.purpose, level: resp.level, conf: resp.conf }, docId, date, roles, completionTime, completionFlag };

    // --- SEND DATA TO BACKEND DATABASE ---
    const actualDept = resp.dept === 'Other' ? resp.deptOther : resp.dept;
    const dbPayload = {
      name: resp.name,
      email: resp.email,
      phone: resp.phone,
      emp_id: resp.emp,
      role: resp.role,
      department: actualDept,
      experience: resp.exp,
      gender: resp.gender,
      org: resp.org,
      industry: resp.industry,
      batch: resp.batch,
      purpose: resp.purpose,
      level: resp.level,
      overall_score: S.overall,
      profile_name: profile.name,
      doc_id: docId,
      report_data: reportDataObj
    };

    fetch('https://core-by-carnelian-backend.onrender.com/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbPayload)
    }).catch(err => console.error("Failed to save to DB:", err));
    // -------------------------------------
    
    try {
      let h = JSON.parse(localStorage.getItem('core_v3_history') || '[]');
      const entry = {
        docId, date, timestamp: Date.now(),
        name: resp.name, email: resp.email || '', phone: resp.phone || '', emp: resp.emp || '',
        role: resp.role || '', dept: actualDept || '', exp: resp.exp || '',
        org: resp.org || '', industry: resp.industry || '', purpose: resp.purpose || '', batch: resp.batch || '',
        profile: profile.name, validityOverall: validity.overall,
        scores: { O: S.O, C: S.C, E: S.E, A: S.A, ES: S.ES, CQavg: S.CQavg, OCBavg: S.OCBavg, LAavg: S.LAavg, EOavg: S.EOavg, OCEANavg: S.OCEANavg, overall: S.overall, CII, LRS, TVS, ADS, SES, OPS, PMS },
        report_data: reportDataObj // Saves the full report so it can be viewed later
      };
      const isSamePerson = (e) => (entry.email && e.email && entry.email.toLowerCase() === e.email.toLowerCase());
      const others = h.filter(e => !isSamePerson(e));
      const samePersonHistory = h.filter(isSamePerson).slice(-4);
      h = [...others, ...samePersonHistory, entry].slice(-200);
      localStorage.setItem('core_v3_history', JSON.stringify(h));
      
      // Save to Batch specifically for Team Reports
      if (resp.batch) {
        const batchKey = 'core_batch_' + resp.batch.replace(/\s+/g, '_');
        let batchData = JSON.parse(localStorage.getItem(batchKey) || '[]');
        batchData = batchData.filter(b => b.docId !== docId && !(b.email === entry.email));
        batchData.push({...entry, composites: CI});
        localStorage.setItem(batchKey, JSON.stringify(batchData.slice(-500)));
      }
      
      setHistoryFlag(true);
    } catch (e) { console.error("Local storage error:", e); }

    setGenerating(false);
    setReportData(reportDataObj);
    setTab('results');
  };

 const inp=(focused)=>({
    width:'100%', padding:'12px 16px', border:`1px solid ${focused?T.gold:T.b2}`, borderRadius:'6px',
    fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'600',
    background:T.bg3, color:T.t0, outline:'none', transition:'all 0.2s',
    boxShadow:focused?`0 0 0 3px ${T.goldP}`:'none',
  });
  const [focused,setFocused]=useState({});
  const lbl={display:'block',fontSize:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.12em',color:T.t2,marginBottom:'7px',fontFamily:"'JetBrains Mono',monospace"};
  const selStyle={width:'100%',padding:'12px 16px',border:`1px solid ${T.b2}`,borderRadius:'6px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'600',background:T.bg3,color:T.t0,outline:'none',cursor:'pointer'};

 // ── ASSESSMENT CONTEXT (Formerly Admin Setup) ──
  if(step==='admin') {
    if(!assessmentType) return (
      <div style={{minHeight:'100vh', background:'transparent', padding:'80px 24px', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{maxWidth:'800px', width:'100%', animation:'fadeUp 0.6s ease forwards'}}>
          <div style={{textAlign:'center', marginBottom:'40px'}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',fontWeight:'700',color:T.t0}}>How are you taking this assessment?</h2>
            <p style={{fontSize:'15px',color:T.t2,fontWeight:'500'}}>Select your path to calibrate the assessment context.</p>
          </div>
          <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
            <button onClick={() => { setAssessmentType('org'); setResp(r=>({...r, conf:'Restricted — HR Leadership Only'})); }} style={{background:T.bg1, border:`2px solid ${T.b2}`, borderRadius:'16px', padding:'48px 32px', cursor:'pointer', transition:'all 0.2s', textAlign:'center'}} onMouseOver={e=>{e.currentTarget.style.borderColor=T.c; e.currentTarget.style.transform='translateY(-4px)';}} onMouseOut={e=>{e.currentTarget.style.borderColor=T.b2; e.currentTarget.style.transform='none';}}>
              <div style={{fontSize:'48px', marginBottom:'16px'}}>🏢</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Assigned by Organization</h3>
              <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.6'}}>I was asked to complete this by my employer, HR, or a hiring manager.</p>
            </button>
            <button onClick={() => { setAssessmentType('ind'); setResp(r=>({...r, purpose:'Personal Development Planning', conf:'Candidate-Visible — Both Reports'})); }} style={{background:T.bg1, border:`2px solid ${T.b2}`, borderRadius:'16px', padding:'48px 32px', cursor:'pointer', transition:'all 0.2s', textAlign:'center'}} onMouseOver={e=>{e.currentTarget.style.borderColor=T.c; e.currentTarget.style.transform='translateY(-4px)';}} onMouseOut={e=>{e.currentTarget.style.borderColor=T.b2; e.currentTarget.style.transform='none';}}>
              <div style={{fontSize:'48px', marginBottom:'16px'}}>👤</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Taking Individually</h3>
              <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.6'}}>I am taking this for my own personal and professional development.</p>
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{minHeight:'100vh', background:'transparent', padding:'80px 24px'}}>
        <div style={{maxWidth:'700px', margin:'0 auto', animation:'fadeUp 0.6s ease forwards'}}>
          <button onClick={() => setAssessmentType(null)} style={{background:'transparent', border:'none', color:T.t2, cursor:'pointer', fontSize:'13px', fontWeight:'700', marginBottom:'24px', padding:0}}>← Back to selection</button>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
            <span style={{fontSize:'28px'}}>{assessmentType === 'org' ? '🏢' : '👤'}</span>
            <div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0}}>Assessment Context</h2>
              <p style={{fontSize:'13px',color:T.t2,fontWeight:'500'}}>Please provide your details to calibrate your results.</p>
            </div>
          </div>

          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'36px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>Industry & Role Details</h3>
            <p style={{fontSize:'13px',color:T.t2,marginBottom:'24px',fontWeight:'500'}}>Select your sector and assessment purpose. Your development plan will adapt automatically to this context.</p>

            {assessmentType === 'org' ? (
              <>
                <div style={{marginBottom:'20px'}}>
                  <label style={lbl}>Organisation Name</label>
                  <input value={resp.org} onChange={e=>setResp(r=>({...r,org:e.target.value}))} placeholder="e.g. Allied Bank Limited" style={inp(focused.org)} onFocus={()=>setFocused(f=>({...f,org:true}))} onBlur={()=>setFocused(f=>({...f,org:false}))} />
                </div>

                <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                  <div>
                    <label style={lbl}>Assessment Batch Name</label>
                    <input value={resp.batch} onChange={e=>setResp(r=>({...r,batch:e.target.value}))} placeholder="e.g. Q2 2026 Leadership Cohort" style={inp(focused.batch)} onFocus={()=>setFocused(f=>({...f,batch:true}))} onBlur={()=>setFocused(f=>({...f,batch:false}))} />
                  </div>
                  <div>
                    <label style={lbl}>Primary Assessment Purpose</label>
                    <select value={resp.purpose} onChange={e=>setResp(r=>({...r,purpose:e.target.value}))} style={selStyle}>
                      <option value="">Select…</option>
                      <option>Pre-Hiring Screening</option>
                      <option>Leadership Pipeline Assessment</option>
                      <option>Succession Planning</option>
                      <option>Post-Training Evaluation</option>
                      <option>Team Composition Analysis</option>
                      <option>Personal Development Planning</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{marginBottom:'20px'}}>
                  <label style={lbl}>Full Name *</label>
                  <input value={resp.name} onChange={e=>setResp(r=>({...r,name:e.target.value}))} placeholder="e.g. Ayesha Raza" style={inp(focused.name)} onFocus={()=>setFocused(f=>({...f,name:true}))} onBlur={()=>setFocused(f=>({...f,name:false}))} />
                </div>
                <div style={{marginBottom:'20px'}}>
                  <label style={lbl}>Primary Assessment Purpose</label>
                  <input value="Personal Development Planning" disabled style={{...inp(false), opacity:0.6, cursor:'not-allowed'}} />
                </div>
              </>
            )}

            <label style={{...lbl,marginBottom:'12px'}}>
              {assessmentType === 'org' ? 'Select Industry Sector *' : 'Industry you are in or target industry *'}
            </label>
            <div className="grid-3-col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'24px'}}>
              {Object.entries(IND).map(([key,val])=>(
                <button key={key} onClick={()=>setResp(r=>({...r,industry:key}))} style={{
                  padding:'11px 8px',borderRadius:'6px',cursor:'pointer',textAlign:'center',
                  background:resp.industry===key?`${T.gold}20`:T.bg3,
                  border:`2px solid ${resp.industry===key?T.gold:T.b1}`,
                  color:resp.industry===key?T.gold:T.t2,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'11px',fontWeight:'700',
                  transition:'all 0.18s',lineHeight:'1.3',
                }}>
                  <div style={{fontSize:'18px', marginBottom:'4px'}}>{val.icon}</div>
                  <div>{val.short}</div>
                </button>
              ))}
            </div>

            <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              <div>
                <label style={lbl}>Role Level Being Assessed</label>
                <select value={resp.level} onChange={e=>setResp(r=>({...r,level:e.target.value}))} style={selStyle}>
                  <option value="">All Levels</option>
                  <option>Entry Level (0–3 years)</option>
                  <option>Junior Officer (3–7 years)</option>
                  <option>Mid-Level Manager (7–12 years)</option>
                  <option>Senior Manager / Head</option>
                  <option>Executive / Director+</option>
                </select>
              </div>
              {assessmentType === 'org' && (
                <div>
                  <label style={lbl}>Confidentiality Level</label>
                  <select value={resp.conf} onChange={e=>setResp(r=>({...r,conf:e.target.value}))} style={selStyle}>
                    <option>Restricted — HR Leadership Only</option>
                    <option>Internal — Management & Candidate</option>
                    <option>Candidate-Visible — Both Reports</option>
                  </select>
                </div>
              )}
            </div>

            <button onClick={()=>{
              if(assessmentType === 'ind' && !resp.name){alert('Please enter your Full Name.');return;}
              if(!resp.industry){alert('Please select an industry sector.');return;} 
              setStep('consent');
            }} style={{width:'100%',padding:'14px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'14px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>
              Continue to Consent →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CONSENT ──
  if(step==='consent') return (
    <div style={{minHeight:'100vh', background:'transparent', padding:'80px 24px'}}>
      <div style={{maxWidth:'600px', margin:'0 auto', animation:'fadeUp 0.6s ease forwards'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>Before We Begin</h2>
        <p style={{fontSize:'14px',color:T.t2,lineHeight:'1.65',marginBottom:'24px',fontWeight:'500'}}>Carnelian takes your privacy seriously. Please read this short summary before you start.</p>
        
        <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'24px',marginBottom:'16px'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'700',marginBottom:'12px',color:T.t0}}>What we collect and why</div>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'8px 14px',fontSize:'13px',color:T.t1,lineHeight:'1.6',fontWeight:'500'}}>
            <span style={{color:T.gn,fontWeight:'800'}}>✓</span><span>Your name, email, phone number, and professional details to generate your personalised report.</span>
            <span style={{color:T.gn,fontWeight:'800'}}>✓</span><span>Your assessment responses scored by our engine to produce dimension profiles.</span>
            <span style={{color:T.gn,fontWeight:'800'}}>✓</span><span>Aggregated, anonymised data may be used solely to improve the accuracy and quality of future assessments.</span>
          </div>
        </div>

        <div style={{background:T.gnP,border:`1px solid ${T.gn}40`,borderRadius:'12px',padding:'24px',marginBottom:'16px'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'700',marginBottom:'12px',color:T.gn}}>What we will never do</div>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'8px 14px',fontSize:'13px',color:T.gn,lineHeight:'1.6',fontWeight:'600'}}>
            <span style={{fontWeight:'800'}}>✗</span><span>Sell your data to any third party.</span>
            <span style={{fontWeight:'800'}}>✗</span><span>Share your identifiable results with anyone outside your assessment process.</span>
            <span style={{fontWeight:'800'}}>✗</span><span>Make your individual responses or scores publicly accessible.</span>
            <span style={{fontWeight:'800'}}>✗</span><span>Use your contact details for any purpose other than assessment delivery and progress tracking</span>
          </div>
        </div>

        {/* NEW SEPARATE BLOCK FOR LEGAL & DATA PROCESSING */}
        <div style={{background:T.bg2,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:'700',marginBottom:'12px',color:T.t0}}>Legal Disclaimer & Data Processing</div>
          <div style={{display:'flex', flexDirection:'column', gap:'12px', fontSize:'12.5px', color:T.t1, lineHeight:'1.6', fontWeight:'500'}}>
            <p style={{margin:0}}><strong>Disclaimer:</strong> The information, materials, and assessments provided in this module are for educational, illustrative, and informational purposes only. We make no representations or warranties of any kind, express or implied.</p>
            <p style={{margin:0}}><strong>Data Protection:</strong> We are committed to protecting your information. Your data will be stored securely and will not be shared with unauthorized third parties, except where required by law or necessary to operate this training platform. By proceeding, you consent to this processing of your personal data.</p>
            <p style={{margin:0}}><strong>Data Collection:</strong> By participating in this training module, you acknowledge and agree that we collect certain personal information (such as your name, email address, completion status, and module responses). This data is collected for lawful purposes, specifically to administer the training, track progress, issue certificates of completion, and improve our educational offerings.</p>
          </div>
        </div>

        <div style={{background:`${T.am}12`,border:`1px solid ${T.am}35`,borderRadius:'12px',padding:'20px',marginBottom:'24px'}}>
          <p style={{fontSize:'13px',color:T.t1,lineHeight:'1.65',fontWeight:'500',margin:0}}>
            <strong style={{color:T.am}}>Validity Alert System is always active.</strong> Ten L-scale items and four validity indices run automatically for every assessment regardless of configuration. Candidates are never informed of validity checks. The Validity Index appears only in the Technical Report.
          </p>
        </div>

        <div style={{background:`${T.c}10`,border:`1px solid ${T.c}30`,borderRadius:'12px',padding:'20px',marginBottom:'24px'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',fontWeight:'700',marginBottom:'8px',color:T.c}}>Complete in One Session</div>
          <p style={{fontSize:'13px',color:T.t1,lineHeight:'1.65',fontWeight:'500',margin:0}}>
            For the most accurate results, please complete the assessment in one uninterrupted session, this usually takes about <strong style={{color:T.t0}}>20 minutes.</strong> Psychological fatigue, time gaps, and shifting mental states can subtly affect how you respond. Completing it in one go ensures a true, consistent snapshot of your strengths, making the feedback genuinely useful.
          </p>
        </div>

        <div style={{background:T.bg2,border:`1px solid ${T.b2}`,borderRadius:'10px',padding:'16px 20px',marginBottom:'24px',display:'flex',alignItems:'flex-start',gap:'12px'}}>
          <input type="checkbox" checked={consentChecked} onChange={e=>setConsentChecked(e.target.checked)} style={{marginTop:'4px',accentColor:T.c,width:'18px',height:'18px',flexShrink:0,cursor:'pointer'}} />
          <label onClick={()=>setConsentChecked(!consentChecked)} style={{fontSize:'13px',color:T.t1,lineHeight:'1.6',cursor:'pointer',fontWeight:'500'}}>
            I have read the above summary and consent to Carnelian collecting and processing my assessment data as described. I understand that my results may be shared with the organisation that commissioned my assessment.
          </label>
        </div>

        <button onClick={()=>{if(consentChecked) setStep('intake');}} disabled={!consentChecked} style={{width:'100%',padding:'14px',borderRadius:'7px',border:'none',cursor:consentChecked?'pointer':'not-allowed',background:consentChecked?T.c:T.bg3,color:consentChecked?'#fff':T.t3,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'14px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>{if(consentChecked) e.target.style.background=T.cDark;}} onMouseOut={e=>{if(consentChecked) e.target.style.background=T.c;}}>
          I Agree · Continue →
        </button>
      </div>
    </div>
  );


  // ── INTAKE ──
  if(step==='intake') return (
    <div style={{minHeight:'100vh', background:'transparent', padding:'80px 24px'}}>
      <div style={{maxWidth:'700px', margin:'0 auto', animation:'fadeUp 0.6s ease forwards'}}>
        {priorFound&&<div style={{background:`${T.gn}14`,border:`1px solid ${T.gn}35`,borderRadius:'8px',padding:'14px 18px',marginBottom:'24px',fontSize:'13px',color:T.gn,fontWeight:'600'}}>
          Prior assessment found for <strong style={{color:T.t0}}>{priorFound.name}</strong> dated {priorFound.date}. Progress comparison will generate automatically.
        </div>}

        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'36px'}}>
          {[1,2].map(n=>(
            <React.Fragment key={n}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',border:`2px solid ${n<=intakeStage?T.c:T.b2}`,background:n<intakeStage?T.c:n===intakeStage?`${T.c}20`:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {n<intakeStage ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> : <span className="mono" style={{fontSize:'10px',color:n<=intakeStage?T.c:T.t3,fontWeight:'700'}}>{n}</span>}
                </div>
                <span style={{fontSize:'12px',color:n<=intakeStage?T.t0:T.t3,fontWeight:n===intakeStage?'700':'500'}}>{n===1?'Your Details':'Instructions'}</span>
              </div>
              {n<2&&<div style={{flex:1,height:'2px',background:n<intakeStage?T.c:T.b1,borderRadius:'1px'}} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'36px'}}>
          {intakeStage===1&&(
            <div key="stage1" style={{animation:'scaleIn 0.3s ease forwards'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'24px'}}>Your Information</h2>
              <div className="grid-2-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
  <div><label style={lbl}>Full Name *</label><input value={resp.name} onChange={e=>setResp(r=>({...r,name:e.target.value}))} placeholder="e.g. Ayesha Raza" style={inp(focused.name)} onFocus={()=>setFocused(f=>({...f,name:true}))} onBlur={()=>setFocused(f=>({...f,name:false}))} /></div>
  <div><label style={lbl}>Email Address *</label><input value={resp.email} onChange={e=>setResp(r=>({...r,email:e.target.value}))} placeholder="ayesha@company.com" style={inp(focused.email)} onFocus={()=>setFocused(f=>({...f,email:true}))} onBlur={()=>setFocused(f=>({...f,email:false}))} /></div>
<div><label style={lbl}>Phone Number *</label><input value={resp.phone||''} onChange={e=>{ let val = e.target.value.replace(/\D/g, ''); if (val.length > 4) val = val.substring(0, 4) + '-' + val.substring(4, 11); setResp(r=>({...r,phone:val})); }} placeholder="e.g. 0300-1234567" maxLength="12" style={inp(focused.phone)} onFocus={()=>setFocused(f=>({...f,phone:true}))} onBlur={()=>setFocused(f=>({...f,phone:false}))} /></div>
  <div><label style={lbl}>Employee / Roll No. (Optional)</label><input value={resp.emp} onChange={e=>setResp(r=>({...r,emp:e.target.value}))} placeholder="Optional" style={inp(focused.emp)} onFocus={()=>setFocused(f=>({...f,emp:true}))} onBlur={()=>setFocused(f=>({...f,emp:false}))} /></div>

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
                <div><label style={lbl}>Gender</label>
                  <select value={resp.gender} onChange={e=>setResp(r=>({...r,gender:e.target.value}))} style={selStyle}>
                    <option value="">Prefer not to say</option>
                    {['Male','Female','Other'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div style={{background:`${T.gold}10`,border:`1px solid ${T.gold}25`,borderRadius:'7px',padding:'12px 16px',marginBottom:'20px',fontSize:'12px',color:T.t1,fontWeight:'600'}}>
  <span style={{color:T.gold,fontWeight:'700'}}>→ Progress Tracking:</span> Your email is used to link your results across retakes and generate progress comparisons.
</div>
              <button onClick={()=>{
                if(!resp.name||!resp.email||!resp.phone||!resp.exp){alert('Please enter your Full Name, Email Address, Phone Number, and Years of Experience.');return;}
                if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resp.email)){alert('Please enter a valid email address containing an @ symbol.');return;} 
                if(!/^\d{4}-\d{7}$/.test(resp.phone)){alert('Please enter a valid phone number in the format 0000-0000000.');return;}
                setIntakeStage(2);
              }} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>
                Continue →
              </button>
            </div>
          )}

          {intakeStage===2&&(
            <div key="stage2" style={{animation:'scaleIn 0.3s ease forwards'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.9rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>A Few Things Before You Start</h2>
              <p style={{fontSize:'14px',color:T.t2,lineHeight:'1.65',marginBottom:'24px',fontWeight:'500'}}>This assessment takes approximately 20 minutes and is designed entirely for <strong style={{color:T.t0}}>your benefit</strong>.</p>

              {/* What you will receive */}
              <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'24px', marginBottom:'20px'}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',fontWeight:'700',color:T.gold,marginBottom:'16px'}}>What you will receive when you finish</div>
                <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
                  <div style={{background:T.b0, borderRadius:'8px', padding:'16px'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:T.gold,marginBottom:'6px'}}>Your Professional Profile</div>
                    <div style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'500'}}>A named archetype that describes your dominant working style and how you approach challenges, teams, and decisions.</div>
                  </div>
                  <div style={{background:T.b0, borderRadius:'8px', padding:'16px'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:T.gold,marginBottom:'6px'}}>Your Dimension Scores</div>
                    <div style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'500'}}>Scores across 9 professional dimensions such as personality, cultural intelligence, learning agility, and ethical orientation.</div>
                  </div>
                  <div style={{background:T.b0, borderRadius:'8px', padding:'16px'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:T.gold,marginBottom:'6px'}}>Your Development Roadmap</div>
                    <div style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'500'}}>A personalised 30–90–180 day action plan built specifically around your scores, not a generic programme.</div>
                  </div>
                  <div style={{background:T.b0, borderRadius:'8px', padding:'16px'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:T.gold,marginBottom:'6px'}}>Your Development Toolkit</div>
                    <div style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'500'}}>Specific books, methods, and resources selected for your profile and if-then decision protocols for when habits break.</div>
                  </div>
                </div>
                <div style={{fontSize:'12px',color:T.t2,lineHeight:'1.6',fontWeight:'500'}}>Regardless of why your organisation commissioned this assessment, your personal Action Plan belongs to you. It is designed to help you understand yourself and grow, not to evaluate you against a pass/fail standard.</div>
              </div>

              {/* Green Box */}
              <div style={{background:T.gnP, border:`1px solid ${T.gn}40`, borderRadius:'10px', padding:'16px 20px', marginBottom:'20px', fontSize:'13px', color:T.gn, lineHeight:'1.65', fontWeight:'600'}}>
                <strong style={{color:T.gn, fontWeight:'800'}}>This is not a test. There are almost no wrong answers.</strong> The questions are designed to understand how you naturally think and work, not to judge you. The more honestly you answer, the more specific and useful your personal results will be.
              </div>

              {/* Bullet Points */}
              <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'24px'}}>
                {[
                  <>Answer based on how you <strong style={{color:T.t0}}>actually are</strong> at work, not the ideal version of yourself. The assessment works best when it reflects the real you.</>,
                  <>Go with your <strong style={{color:T.t0}}>first instinct</strong>. Your immediate reaction to a statement is usually the most accurate reflection of your natural style. Don't overthink it.</>,
                  <>Some questions may feel similar to each other , this is intentional. The assessment measures patterns across your responses, not individual answers in isolation.</>,
                  <>You will encounter three interactive challenges mid-assessment. The first is a values dilemma with no time limit. The second and third are <strong style={{color:T.t0}}>45-second timed decisions</strong>. Read the instructions on screen before starting each timed section. Approach all three honestly.</>,
                  <>You can go back and change answers within each section. Once you advance to the next section, you cannot return to the previous one.</>
                ].map((text, i) => (
                  <div key={i} style={{display:'flex', alignItems:'flex-start', gap:'12px', fontSize:'13px', color:T.t1, lineHeight:'1.6', fontWeight:'500'}}>
                    <span style={{color:T.c, fontWeight:'800', marginTop:'2px'}}>→</span>
                    <div>{text}</div>
                  </div>
                ))}
              </div>

              {/* Blue Info Box */}
              <div style={{background:'rgba(59, 130, 246, 0.1)', border:'1px solid rgba(59, 130, 246, 0.3)', borderRadius:'10px', padding:'16px 20px', marginBottom:'24px'}}>
                <div style={{fontSize:'13px', fontWeight:'800', color:'#3B82F6', marginBottom:'6px'}}>💡 Why honest answers give you better results</div>
                <div style={{fontSize:'12.5px', color:T.t1, lineHeight:'1.6', fontWeight:'500'}}>Your results generate a personalised development plan built around your actual profile. Presenting an idealised version of yourself produces a generic plan that tells you nothing you do not already know. Honest answers produce specific, actionable guidance that is genuinely useful.</div>
              </div>

              {/* Buttons */}
              <div style={{display:'flex',gap:'10px'}}>
                <button onClick={()=>setIntakeStage(1)} style={{padding:'13px 20px',borderRadius:'7px',border:`1px solid ${T.b2}`,background:'transparent',color:T.t2,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'700',transition:'all 0.2s'}}>← Back</button>
                <button onClick={()=>{setAnswers(Array(QS.length).fill(null));setCur(0);setStartTime(Date.now());setStep('questions');}} style={{flex:1,padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>I'm Ready · Start →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

// ── SEESAW GAME ──
  if(step==='questions'&&gameStage==='g1'){
    const tilt=(ssVals[ssStep]-50)*0.36;
    const zones=[
      {max:20,label:'Strongly formal — clear compliance orientation',c:'#60A5FA'},
      {max:40,label:'Principled — leans formal with relational awareness',c:T.gn},
      {max:60,label:'Balanced — genuinely weighing both values',c:T.gold},
      {max:80,label:'Relational-leaning — culture over formal procedure',c:T.am},
      {max:100,label:'Strongly relational — relationships over process',c:T.rd},
    ];
    const zone=zones.find(z=>ssVals[ssStep]<=z.max)||zones[zones.length-1];
    
    const scenarios = [
      {
        title: "Dilemma 1 of 3 · Process vs. Culture",
        text: "Your organisation has always resolved internal disputes informally, through conversation and relationships rather than formal written procedures. You believe this occasionally produces unfair outcomes, but it maintains team cohesion. A junior colleague asks your honest advice: should they follow the formal grievance process or handle this the way things have always been done here?",
        left: "Follow the formal process: Policies exist to protect people, regardless of organisational culture.",
        right: "Handle it informally: Relationships and trust matter more than process in real professional life.",
        lLabel: "Formal", rLabel: "Informal",
        intro: "This is a short dilemma where two legitimate professional values pull in opposite directions. Use the slider to show where you genuinely lean, not where you think you should lean. There is no time limit."
      },
      {
        title: "Dilemma 2 of 3 · Loyalty vs. Transparency",
        text: "A colleague you respect and work closely with is leading a project that is clearly falling behind. They have not yet disclosed this to leadership and are quietly hoping to recover before anyone notices. You are aware of the situation. The next leadership update is in three days.",
        left: "Raise it with leadership yourself, stakeholders deserve accurate information to make good decisions.",
        right: "Give your colleague the chance to disclose it themselves, loyalty and trust come first in a team.",
        lLabel: "Transparent", rLabel: "Loyal",
        intro: "Here is the second of three brief dilemmas. Use the slider to show your genuine lean, there is no right answer."
      },
      {
        title: "Dilemma 3 of 3 · Results vs. Method",
        text: "You have been asked to deliver a significant outcome by end of quarter. Halfway through, you realise the method your team is using is producing the right numbers but cutting corners on quality checks that are technically required by your institution's procedures. The outcome will look good. The risk is low but not zero.",
        left: "Slow down and restore the quality checks, procedures exist for good reasons, even when the risk feels low.",
        right: "Continue as the outcome is what matters, and the risk is manageable in this case.",
        lLabel: "Process", rLabel: "Results",
        intro: "This is the final dilemma in this short series. Use the slider to show your genuine lean, there is no right answer."
      }
    ];
    const sc = scenarios[ssStep];

    return (
      <div style={{minHeight:'100vh',background:'transparent',padding:'80px 24px',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'680px',margin:'0 auto',width:'100%',animation:'slideUp 0.5s ease forwards'}}>
          <div style={{background:`${T.c}12`,border:`1px solid ${T.bC}`,borderRadius:'7px',padding:'10px 16px',marginBottom:'20px'}}>
            <span className="mono" style={{fontSize:'9px',color:T.c,textTransform:'uppercase',letterSpacing:'0.14em',fontWeight:'700'}}>Values in Balance — {ssStep+1} of 3</span>
          </div>
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'clamp(20px, 5vw, 36px)'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.4rem, 5vw, 1.8rem)',fontWeight:'700',color:T.gold,marginBottom:'10px'}}>{sc.title}</h3>
            <p style={{fontSize:'14px',color:T.t2,lineHeight:'1.65',marginBottom:'24px',fontWeight:'500'}}>{sc.intro}</p>
            
            <div style={{background:`${T.c}10`,borderRadius:'8px',padding:'20px',marginBottom:'24px',borderLeft:`4px solid ${T.c}`}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(15px, 4vw, 17px)',color:T.t0,lineHeight:'1.7',fontWeight:'600'}}>{sc.text}</p>
            </div>
            
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px',gap:'12px'}}>
              {/* LEFT BOX - BLUE */}
              <div style={{flex:1, background:'rgba(59, 130, 246, 0.08)', padding:'12px 16px', borderRadius:'8px', border:`1px solid rgba(59, 130, 246, 0.3)`}}>
                <span style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'600', display:'block'}}>{sc.left}</span>
              </div>
              {/* RIGHT BOX - PURPLE */}
              <div style={{flex:1, background:'rgba(139, 92, 246, 0.08)', padding:'12px 16px', borderRadius:'8px', border:`1px solid rgba(139, 92, 246, 0.3)`, textAlign:'right'}}>
                <span style={{fontSize:'12px',color:T.t1,lineHeight:'1.5',fontWeight:'600', display:'block'}}>{sc.right}</span>
              </div>
            </div>
            
            <svg viewBox="0 0 500 120" style={{width:'100%',overflow:'visible',marginBottom:'8px'}}>
              <polygon points="250,105 232,117 268,117" fill={T.b2}/>
              <rect x="225" y="115" width="50" height="5" rx="2.5" fill={T.b2}/>
              <g style={{transformOrigin:'250px 105px',transform:`rotate(${tilt}deg)`,transition:'transform 0.4s ease'}}>
                <rect x="60" y="101" width="380" height="8" rx="4" fill={T.t0}/>
                
                {/* LEFT PAD & TEXT - BLUE */}
                <rect x="52" y="93" width="48" height="8" rx="2" fill="#3B82F6"/>
                <text x="76" y="82" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="14" fill="#3B82F6" fontWeight="800">{sc.lLabel}</text>
                
                {/* RIGHT PAD & TEXT - PURPLE */}
                <rect x="400" y="93" width="48" height="8" rx="2" fill="#8B5CF6"/>
                <text x="424" y="82" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="14" fill="#8B5CF6" fontWeight="800">{sc.rLabel}</text>
              </g>
            </svg>
            
            <div style={{padding:'0 4px',marginBottom:'24px'}}>
              <input type="range" min="0" max="100" value={ssVals[ssStep]} onChange={e=>updateSeesaw(e.target.value)} style={{width:'100%',accentColor:T.gold,cursor:'pointer'}} />
            </div>            
            
            <div style={{textAlign:'center',padding:'12px 16px',background:T.bg2,border:`1px solid ${T.b2}`,borderRadius:'8px',fontSize:'13px',fontWeight:'700',color:T.t1,marginBottom:'24px'}}>
              {zone.label}
            </div>
            
            <button onClick={nextSeesaw} style={{width:'100%',padding:'14px',borderRadius:'8px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'14px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>Continue with Assessment →</button>
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
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',fontWeight:'700',color:T.t0,marginBottom:'10px'}}>45-Second {isG2?'Decision':'Ethics'} Challenge</div>
              <p style={{fontSize:'13px',color:T.t2,lineHeight:'1.65',maxWidth:'440px',margin:'0 auto',fontWeight:'500'}}>{isG2?'A real workplace situation will appear. You must read it and choose one of four responses. The clock starts when you click below.':'This is your last timed challenge. It tests ethical decision-making under relationship pressure — one of the most realistic situations professionals face.'}</p>
            </div>
            <div style={{background:T.bg2,borderRadius:'8px',padding:'20px',marginBottom:'24px'}}>
              {['You have exactly 45 seconds — the clock begins immediately',isG2?'This challenge contributes to your Learning Agility profile':'This challenge contributes to your Ethical Orientation profile','Once you select a response, it is final','Answer as you honestly would — not as an ideal version of yourself'].map((b,i)=>(
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
    const offset=circ*(1-timer/45);
    const urgent=timer<=12;
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
      const nextIdx=isG2?28:53;
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
              {options.map(opt=>{
                const isSelected = gameChoice?.key === opt.k;
                return (
                   <button key={opt.k} onClick={()=>!gameLocked&&chooseScenario(opt.q,isG2?2:3,opt.k)} style={{
                  display:'flex',alignItems:'flex-start',gap:'12px',padding:'13px 16px',
                  borderRadius:'7px',cursor:gameLocked?'default':'pointer',
                  border: isSelected ? `2px solid ${T.gold}` : `1px solid ${T.b2}`,
                  background: isSelected ? `${T.gold}16` : T.bg2,
                  textAlign:'left',transition:'all 0.18s',width:'100%',
                  opacity: gameLocked ? (isSelected ? 1 : 0.4) : 1,
                }}
                onMouseOver={e=>{if(!gameLocked){e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.bg3;}}}
                onMouseOut={e=>{if(!gameLocked){e.currentTarget.style.borderColor=T.b2;e.currentTarget.style.background=T.bg2;}}}>
                  <span className="mono" style={{fontSize:'12px',fontWeight:'700',color:T.gold,flexShrink:0,marginTop:'1px'}}>{opt.k}</span>
                  <span style={{fontSize:'13px',color:isSelected?T.t0:T.t1,lineHeight:'1.6',fontWeight:isSelected?'800':'600'}}>{opt.l}</span>
                </button>
              )})}
            </div>
            {gameLocked&&<button onClick={onNext} style={{width:'100%',padding:'13px',borderRadius:'7px',border:'none',cursor:'pointer',background:T.c,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',letterSpacing:'0.03em',transition:'all 0.2s'}} onMouseOver={e=>e.target.style.background=T.cDark} onMouseOut={e=>e.target.style.background=T.c}>{isG2?'Continue to Section D →':'Continue to Final Section →'}</button>}
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
          <div style={{width:'60px',height:'60px',borderRadius:'50%',margin:'0 auto 22px',background:`${T.gn}16`,border:`2px solid ${T.gn}40`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={T.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <Pill label={`${b.pct}% complete`} color={T.gn} style={{marginBottom:'18px'}} />
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.2rem',fontWeight:'700',color:T.t0,marginBottom:'8px'}}>{b.title}</h2>
          <p style={{color:T.t2,fontSize:'14px',lineHeight:'1.7',marginBottom:'32px',fontWeight:'600'}}>{b.msg}</p>
          <div style={{display:'flex',gap:'4px',justifyContent:'center',marginBottom:'36px'}}>
            {['A','B','C','D','E','F'].map(ch=>{
              const idx=QS.findIndex(q=>q.ch===ch);
              const done=cur>idx+9; const active=QS[cur]?.ch===ch;
              return <div key={ch} style={{height:'4px',width:'36px',borderRadius:'2px',background:done?T.gn:active?T.gold:T.b2,transition:'background 0.3s'}} />;
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
                    border:`${sel?2:1}px solid ${sel?T.gold:T.b1}`,
                    background:sel?`${T.gold}16`:T.bg2,
                    textAlign:'left',transition:'all 0.18s',width:'100%',
                  }}
                  onMouseOver={e=>{if(!sel){e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.bg3;}}}
                  onMouseOut={e=>{if(!sel){e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.background=T.bg2;}}}>
                    <div style={{
                      width:'18px',height:'18px',borderRadius:'50%',flexShrink:0,
                      border:`2px solid ${sel?T.gold:T.b2}`,
                      background:sel?T.gold:'transparent',
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

            <div style={{minHeight:'24px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'16px'}}>
              {cheer && (
                <span key={cheer} className="mono" style={{
                  fontSize:'10px', fontWeight:'700', color:T.gold, textTransform:'uppercase', letterSpacing:'0.15em',
                  animation:'fadeIn 0.6s ease-out forwards'
                }}>
                  ✦ {cheer}
                </span>
              )}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button onClick={prevQ} disabled={cur===0} style={{
                padding:'9px 18px',borderRadius:'6px',border:`1px solid ${T.b2}`,
                background:'transparent',color:T.t2,cursor:cur===0?'not-allowed':'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'12px',fontWeight:'700',
                visibility:cur===0?'hidden':'visible',
                transition:'all 0.18s',
              }}>← Back</button>

              <button onClick={nextQ} disabled={answers[cur]===null || generating} style={{
                padding:'9px 22px',borderRadius:'6px',border:'none',
                cursor:(answers[cur]===null || generating)?'not-allowed':'pointer',
                background:(answers[cur]===null || generating)?T.bg3:T.c,
                color:(answers[cur]===null || generating)?T.t3:'#fff',
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'13px',fontWeight:'800',
                letterSpacing:'0.03em',
                transition:'all 0.2s',
                display:'flex', alignItems:'center', gap:'8px',
              }} onMouseOver={e=>{if(answers[cur]!==null&&!generating) e.currentTarget.style.background=T.cDark;}} onMouseOut={e=>{if(answers[cur]!==null&&!generating) e.currentTarget.style.background=T.c;}}>
                {generating ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{animation:'spin 1s linear infinite', flexShrink:0}}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Generating…
                  </>
                ) : cur===QS.length-1 ? 'Generate Report →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── RESULTS PAGE (TABS: Action Plan, Technical, Player) ──────────────────────
const ResultsPage = ({reportData}) => {
  const [resTab, setResTab] = useState('action');
  const [batchData, setBatchData] = useState([]);
  const [promoRole, setPromoRole] = useState(0);
  const [evState, setEvState] = useState({});
const [expandedSteps, setExpandedSteps] = useState({});

  useEffect(() => {
    if (reportData?.docId) {
      try { setEvState(JSON.parse(localStorage.getItem(`core_ev_${reportData.docId}`) || '{}')); } catch(e) {}
    }
    if (reportData?.respondent?.batch) {
      try {
        const data = JSON.parse(localStorage.getItem('core_batch_' + reportData.respondent.batch.replace(/\s+/g, '_')) || '[]');
        setBatchData(data);
      } catch(e) {}
    }
  }, [reportData]);

  const [evModal, setEvModal] = useState(null);
  const [evInput, setEvInput] = useState({ quote:'', page:'', takeaway:'', timestamp:'', insight:'', ref:'', finding:'', reflection:'', date:'', fileBase64:'', fileName:'' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2500000) { alert('File is too large. Maximum size is 2.5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setEvInput({...evInput, fileBase64: ev.target.result, fileName: file.name});
    reader.readAsDataURL(file);
  };

  const openEvidenceModal = (key, xp, type, title, subtitle, objText) => {
    if (evState[key]) {
      setEvModal({ mode: 'review', key, xp, type, title, subtitle, data: evState[key] });
    } else {
      setEvModal({ mode: 'submit', key, xp, type, title, subtitle, objText });
      setEvInput({ quote:'', page:'', takeaway:'', timestamp:'', insight:'', ref:'', finding:'', reflection:'', date:'', fileBase64:'', fileName:'' });
    }
  };

  const submitEvidence = () => {
    const newState = {...evState};
    newState[evModal.key] = { ts: Date.now(), xp: evModal.xp, type: evModal.type, data: evInput };
    setEvState(newState);
    localStorage.setItem(`core_ev_${reportData.docId}`, JSON.stringify(newState));
    setEvModal(null);
  };

  const revokeEvidence = () => {
    if(!window.confirm('Revoke this evidence? The XP will be returned.')) return;
    const newState = {...evState};
    delete newState[evModal.key];
    setEvState(newState);
    localStorage.setItem(`core_ev_${reportData.docId}`, JSON.stringify(newState));
    setEvModal(null);
  };

  if(!reportData) return (
    <div style={{padding:'100px 32px',textAlign:'center',color:T.t2,fontWeight:'600'}}>
      No assessment data found. Please complete the assessment first.
    </div>
  );

  const {scores:S, profile, respondent:R, docId, date, CI, validity, roles, gameSummary, patterns} = reportData;

  // ─── ACTION PLAN DATA PREP ───
const allDims = [
  {k:'C', l:'Conscientiousness', v:S.C,
    str:'You are a highly reliable, organised professional. People can depend on you to deliver — even when it is inconvenient.',
    gap:'How consistently you follow through on commitments, manage your time, and hold yourself to quality standards — even without oversight.'},
  {k:'O', l:'Openness to Ideas', v:S.O,
    str:'You bring genuine intellectual curiosity and creative problem-solving to your work.',
    gap:'How readily you seek new approaches, engage with unfamiliar ideas, and move beyond established methods when the situation demands it.'},
  {k:'E', l:'Social Confidence', v:S.E,
    str:'You communicate with confidence and energy — effective in leadership and stakeholder-facing roles.',
    gap:'How comfortably you initiate conversations, assert your perspective, and hold presence in group or high-visibility professional situations.'},
  {k:'A', l:'Collaborative Spirit', v:S.A,
    str:'You are empathetic and cooperative — a team builder who creates psychologically safe environments.',
    gap:"How naturally you consider others' perspectives, manage disagreement constructively, and prioritise team relationships under pressure."},
  {k:'ES', l:'Emotional Resilience', v:S.ES,
    str:'You stay grounded under pressure — invaluable in high-stakes situations.',
    gap:'How well you maintain composure, decision quality, and interpersonal effectiveness when facing criticism, setbacks, or sustained pressure.'},
  {k:'CQavg', l:'Cultural Intelligence', v:S.CQavg,
    str:"You navigate Pakistan's diverse professional landscape with skill and genuine interest.",
    gap:"How effectively you understand, adapt to, and work across the cultural, regional, and institutional differences that define Pakistan's professional landscape."},
  {k:'OCBavg', l:'Team Citizenship', v:S.OCBavg,
    str:'You go well beyond your formal role to support colleagues and the institution.',
    gap:'How much you contribute to your team and organisation beyond your formal job description — through support, initiative, and institutional investment.'},
  {k:'LAavg', l:'Learning Agility', v:S.LAavg,
    str:'You learn fast, reflect honestly, and apply lessons across domains.',
    gap:'How quickly and deliberately you update your knowledge, reflect on experience, and apply lessons from one domain to another.'},
  {k:'EOavg', l:'Ethical Integrity', v:S.EOavg,
    str:'Your commitment to transparency and authentic behaviour is rare and highly valued.',
    gap:'How consistently your behaviour aligns with professional standards, transparent disclosure, and principled decision-making — especially under pressure.'},
].filter(d => d.v !== undefined && d.v !== null).sort((a,b) => b.v - a.v);

  const top2 = allDims.slice(0, 2);
  const bot2 = [...allDims].sort((a,b) => a.v - b.v).slice(0, 2);

  // ── CONTEXT ENGINE ──
  const ind = R.industry || '';
  const lvl = R.level || R.exp || '';
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
        why: ctxAction("Consistent delivery is the foundation of professional credibility. Missed deadlines or incomplete work creates friction that compounds over time.", "In banking, your reliability directly affects your institution's regulatory standing and client trust.", "In the civil service, your output accountability shapes public outcomes.", "Development sector programmes are accountable to donors, beneficiaries, and communities simultaneously.", "At your seniority level, your delivery sets the standard for the entire team.", "Early in your career, delivery reliability is how you build the professional reputation that opens every future door."),
        now: ctxAction("Agree a weekly check-in with your supervisor on 3 explicit priority deliverables.","Book a 30-minute weekly slot with your line manager to review your open regulatory deliverables.","Schedule a weekly meeting with your supervisor to review your progress against departmental KPIs.","Set up a shared milestone tracker with your programme coordinator this week.","Send your team a written commitment list every Monday.","Have an honest conversation with your line manager this week about which current commitments you are most at risk of missing."),
        soon: ctxAction("Enrol in a personal productivity workshop or study one methodology (GTD, Agile personal planning).","Complete a structured time management or professional effectiveness programme.","Attend a civil service effectiveness workshop through your Training Institute.","Enrol in a project management short course.","Commission a team productivity audit to understand where delivery bottlenecks are systemic.","Attend a productivity and professional effectiveness workshop."),
        fut: ctxAction("Lead a project end-to-end within 6 months to build delivery confidence with structured accountability.","Take ownership of an end-to-end compliance or regulatory project.","Lead a cross-departmental working group to demonstrate sustained delivery over a 6-month period.","Lead a full programme cycle from design to donor reporting.","Commission an organisational review of how delivery accountability is structured across your team.","Ask to lead a complete project or initiative end-to-end."),
        acts: ["Use a weekly priority matrix every Monday.","Break large projects into milestone check-ins.","Track one commitment per week that you made and actually completed."],
        managerStep: 'Tell your manager the 3 specific deliverables you are tracking this month and ask them to hold you accountable if you miss a self-imposed deadline.',
        selfAssess: 'Pull up your last 8 weeks of commitments. Count how many you hit on time, how many were late, and how many were quietly dropped. Write the number down.',
        ongoing: 'Every Friday, score yourself 1–5 on delivery reliability for the week. Note the one commitment that was hardest to keep and why.',
        retake: `Retake CORE, your Conscientiousness baseline was ${S.C}/100. A 6-point rise here is achievable with consistent habit practice.`
      },
      'Emotional Resilience': {
        why: ctxAction("High-stakes professional environments involve pressure cycles. Your ability to remain clear-headed under pressure is career-determining.", "Banking environments are characterised by regulatory cycles, audit periods, and market pressure.", "Civil service reform creates sustained pressure on officers at all levels.", "Development sector professionals work in environments of resource constraints, community pressure, and donor scrutiny.", "At senior level, your emotional state sets the emotional tone for the entire team.", "Early career is when pressure tolerance is built."),
        now: ctxAction("Identify one specific pressure source in your current role and have a direct conversation with your leadership about managing it structurally.","Ask your institution's HR team this week about EAP access and stress management resources.","Contact your Training Institute about resilience coaching resources available to civil service officers.","Speak to your programme director about workload distribution.","Identify one specific pressure source in your current role and have a direct conversation with your leadership.","Talk to your line manager this week about one specific pressure point in your role and what support is available."),
        soon: ctxAction("Attend a resilience or emotional intelligence workshop this quarter.","Attend a professional resilience workshop — specifically one designed for high-accountability financial environments.","Attend a public sector leadership and resilience programme.","Attend an NGO or development sector leadership workshop.","Commission an executive coaching engagement for yourself.","Attend an emotional intelligence or resilience workshop."),
        fut: ctxAction("Seek a role with progressively increasing accountability to build resilience through real-world exposure.","Seek out a role rotation that includes a high-pressure function.","Pursue a secondment or cross-posting to a reform-facing role.","Accept an assignment in a resource-constrained or high-stakes programme context.","Build a senior leadership resilience programme for your team.","Ask to be included in high-stakes projects where you will be stretched."),
        acts: ["Build a 10-minute daily decompression practice.","Write a post-incident reflection after a stressful event.","Identify 2 trusted sounding boards."],
        managerStep: 'Tell your manager one specific pressure source in your role and ask for one structural change — not sympathy. Make it a concrete ask.',
        selfAssess: 'Review the last 3 high-pressure situations you faced. For each, write: how did I respond in the moment, and what would a more stable version of me have done differently?',
        ongoing: 'Every Friday, rate your emotional regulation for the week 1–5. Identify the moment you felt most reactive and log what triggered it.',
        retake: `Retake CORE, your Emotional Stability baseline was ${S.ES}/100. Stability is measurable and it does move with deliberate practice.`
      },
      'Learning Agility': {
        why: ctxAction("The professionals who rise are those who learn and adapt fastest. Current knowledge has a shelf life.", "Pakistan's banking sector is changing faster than almost any other.", "Pakistan's civil service is in active reform.", "The development sector's evidence base evolves continuously.", "At your seniority level, your learning agility determines whether you remain strategically relevant.", "The first decade of a career is where learning habits are formed."),
        now: ctxAction("Subscribe to one sector publication you do not currently follow.","Subscribe today to SBP's official regulatory updates.","Subscribe to an international public administration publication.","Subscribe to an international development sector publication.","Audit your team's current knowledge sources.","Identify one technical skill gap holding you back and find a resource for it."),
        soon: ctxAction("Build a 90-day self-directed learning plan on one topic outside your current expertise.","Build a 90-day learning plan on one banking domain outside your specialty.","Build a 90-day learning plan on one reform area relevant to your department.","Build a 90-day learning plan on a new methodology.","Implement a team-wide knowledge sharing protocol.","Complete a short certification in a new skill."),
        fut: ctxAction("Apply to facilitate or co-design a training or knowledge-sharing session.","Apply to co-design an internal knowledge-sharing session at your institution.","Apply to deliver a session at your Training Institute.","Apply to design a staff capacity building session for your programme team.","Sponsor an innovation initiative within your department.","Ask to present a new concept to the broader team."),
        acts: ["Dedicate 30 mins a week to reading an industry report.","Ask yourself what you learned after every major task.","Request candid feedback from a supervisor."],
        managerStep: 'Tell your manager one domain outside your current expertise you are investing in this quarter and ask them to assign you one task that requires you to use it.',
        selfAssess: 'List every significant thing you have learned in the past 3 months — self-directed only. If the list is short, that is your data point.',
        ongoing: 'Every Friday, write one sentence: "This week I learned _____ and I will apply it by _____." Keep the log.',
        retake: `Retake CORE, your Learning Agility baseline was ${S.LAavg}/100. This dimension responds fastest to deliberate habit change.`
      },
      'Social Confidence': {
        why: ctxAction("Social confidence is a professional skill. Your ability to assert your perspective determines your influence.","In banking, stakeholder presence is a career-defining skill.","In government, your ability to communicate clearly determines your influence.","In the development sector, donor presentations require professionals who can project confidence.","At your seniority level, social confidence is the multiplier on every other strength you have.","Early in your career, social confidence determines whether your ideas get heard."),
        now: ctxAction("Have one conversation this week that you have been avoiding.","Schedule one client or regulatory conversation you have been postponing.","Initiate one interaction with a senior officer you have been avoiding.","Initiate one donor or partner conversation you have been postponing.","Have one high-visibility conversation this week that you would normally delegate.","Speak up in a meeting where you would normally stay silent."),
        soon: ctxAction("Enrol in a communication and influence workshop.","Attend a professional communication workshop designed for financial professionals.","Attend a public speaking programme through your Training Institute.","Attend a facilitation workshop for development sector professionals.","Commission an executive presence coaching engagement.","Join a public speaking group like Toastmasters."),
        fut: ctxAction("Seek a role or assignment that requires regular public speaking or stakeholder presentations.","Ask to lead the next client presentation.","Apply to represent your department at a public forum.","Apply to lead the next donor presentation.","Commit to speak at one external event or industry forum.","Ask to present in the next team meeting."),
        acts: ["Identify one conversation you've avoided and have it today.","Volunteer to speak first in at least one meeting per week.","Join a forum where you must contribute publicly."],
        managerStep: 'Tell your manager one specific situation where you held back instead of stepping forward. Ask them to flag the next opportunity where you can take point.',
        selfAssess: 'Think of the last 5 professional situations where you stayed quiet when you had something to say. Write down what stopped you each time.',
        ongoing: 'Every Friday, log one moment where you spoke up and one where you held back. Over time, the ratio is your data.',
        retake: `Retake CORE, your Social Confidence baseline was ${S.E}/100. This dimension responds measurably to deliberate practice.`
      },
      'Team Citizenship': {
        why: ctxAction("Institutions are sustained by discretionary effort. Moving beyond your formal job description builds the social capital necessary for leadership.", "In banking, siloed departments create massive inefficiency; citizenship bridges those gaps.", "In the civil service, cross-departmental cooperation is the only way complex policies are implemented.", "In NGOs, mission success relies heavily on team members supporting each other beyond their TORs.", "At the executive level, your citizenship sets the culture. If you don't collaborate, your team won't.", "Building a reputation as an institutional citizen early in your career makes you indispensable."),
        now: ctxAction("Identify one institutional frustration and present a constructive solution instead of complaining.", "Identify a bottleneck between your unit and another, and propose a fix.", "Draft a one-page improvement proposal for a broken bureaucratic process.", "Offer to take one administrative burden off a stressed colleague this week.", "Praise a colleague's unseen work in front of the broader leadership team.", "Volunteer for an unglamorous task that helps the whole team."),
        soon: ctxAction("Volunteer for an internal committee or improvement initiative.", "Join a cross-functional working group.", "Participate in a departmental reform committee.", "Take the lead on organizing a team-building or knowledge-sharing event.", "Establish a formal recognition system within your department.", "Shadow a colleague in a different role to understand their challenges."),
        fut: ctxAction("Lead a process improvement workstream for your department.", "Take ownership of an initiative that benefits the entire branch, not just your KPIs.", "Lead a policy implementation working group.", "Design and lead a new capacity-building initiative for your NGO.", "Sponsor a cross-departmental integration project.", "Become the go-to person for onboarding new team members."),
        acts: ["Adopt the 'solution before complaint' rule.", "Take on one administrative burden for the team.", "Praise a colleague's unseen work publicly."],
        managerStep: 'Ask your manager for visibility on where the team is currently bottlenecked, and volunteer to take one administrative or support burden off a colleague.',
        selfAssess: 'Review your calendar for the last month. How much time did you spend helping colleagues or improving processes that were not explicitly in your KPIs?',
        ongoing: 'Every Friday, log one proactive thing you did for the team this week that no one explicitly asked you to do.',
        retake: `Retake CORE, your Team Citizenship baseline was ${S.OCBavg}/100. Citizenship is what separates individual contributors from true institutional anchors.`
      },
      'Collaborative Spirit': {
        why: ctxAction("High performance in modern institutions is team-based. Friction, defensiveness, and lack of empathy destroy psychological safety and derail projects.", "In high-stakes finance, adversarial relationships between front-office and risk/audit destroy institutional value.", "In government, territorial disputes between departments halt public service delivery.", "In the development sector, failing to build consensus with communities or partners leads to programme failure.", "As a senior leader, a lack of collaborative spirit creates a culture of fear and information hoarding.", "Learning to disagree without damaging relationships is the most critical soft skill you can build right now."),
        now: ctxAction("Identify a strained workplace relationship and initiate a reset conversation.", "Reach out to a colleague in Risk, Audit, or Compliance to understand their perspective on a recent friction point.", "Schedule a coffee with a counterpart in a rival department to build rapport.", "Ask a community partner or stakeholder for their honest feedback on your approach.", "Publicly acknowledge a mistake you made to normalize vulnerability in your team.", "Ask a colleague you disagreed with recently for their perspective, and just listen."),
        soon: ctxAction("Complete a course on active listening or conflict resolution.", "Attend a stakeholder negotiation workshop focused on interest-based outcomes.", "Take a public administration course on consensus building.", "Enrol in a partnership management or mediation workshop.", "Commission a 360-degree feedback review for yourself and share the results with your team.", "Read and apply the frameworks from 'Getting to Yes' in your daily interactions."),
        fut: ctxAction("Mentor a junior colleague or lead a cross-functional initiative requiring high diplomacy.", "Lead a project that requires deep collaboration between sales and risk/compliance.", "Manage a multi-stakeholder policy rollout.", "Take the lead on a complex consortium or multi-partner grant proposal.", "Mediate a long-standing departmental dispute.", "Volunteer to manage a project with a notoriously difficult stakeholder."),
        acts: ["In your next disagreement, repeat the other person's point back to them before making yours.", "Offer help to a stressed colleague without being asked.", "Acknowledge a mistake publicly."],
        managerStep: 'Tell your manager one colleague relationship that has friction and ask for coaching on one specific communication habit you can change.',
        selfAssess: "Think of the last 3 disagreements you had at work. In how many did you genuinely consider the other person's reasoning before defending your own? Write the honest answer.",
        ongoing: 'Every Friday, recall one moment where you felt defensive or dismissive. Write what the other person\'s actual point was — in their terms, not yours.',
        retake: `Retake CORE, your Agreeableness baseline was ${S.A}/100. This dimension is directly observable by colleagues and measurable through 360 feedback.`
      },
      'Openness to Ideas': {
        why: ctxAction("In a rapidly evolving market, relying solely on established methods leads to obsolescence. Innovation requires deliberate exposure to new frameworks.", "The financial sector is being disrupted by fintech and changing regulations; rigid thinking is a liability.", "Bureaucratic inertia is the enemy of reform. Openness is required to modernize civil service delivery.", "The development sector demands continuous adaptation to new evidence and changing ground realities.", "As a leader, if you immediately shoot down unconventional ideas, your team will stop bringing them to you.", "Building a reputation as an adaptable, open-minded professional accelerates your career trajectory."),
        now: ctxAction("Identify one process you follow blindly and write down three ways it could be optimized.", "Review a legacy banking process and propose a digital or streamlined alternative.", "Look at one standard operating procedure in your department and draft a modernization proposal.", "Review your programme's M&E framework and suggest one innovative way to capture impact.", "In your next meeting, force yourself to say 'Tell me more' instead of 'But...'", "Ask a colleague from a completely different department how they would solve a problem you are facing."),
        soon: ctxAction("Present a new tool or methodology to your team that you researched independently.", "Attend a workshop on digital transformation or agile methodologies.", "Participate in a design-thinking workshop for public sector innovation.", "Enrol in a course on human-centered design or innovative financing.", "Host a 'reverse mentoring' session where junior staff pitch ideas to you.", "Take a short online course in a subject entirely outside your field."),
        fut: ctxAction("Lead a pilot project testing a completely new approach to a legacy problem.", "Sponsor a sandbox initiative for a new financial product or service.", "Lead the implementation of a new e-governance tool in your department.", "Design a pilot intervention using a completely untested methodology.", "Allocate budget and time for an internal innovation incubator.", "Volunteer to be the early adopter for a new company-wide software or process."),
        acts: ["Spend 30 minutes a week reading outside your discipline.", "Propose one idea that breaks the current rules in your next brainstorm.", "Ask a colleague from a different department how they would solve your problem."],
        managerStep: 'Ask your manager to include you in one brainstorming or strategy session outside your usual scope, just to observe and contribute one left-field idea.',
        selfAssess: 'Look at the last 3 times a new process or tool was introduced. Did you instinctively point out why it wouldn\'t work, or did you explore how it could? Be honest.',
        ongoing: 'Every Friday, ask yourself: "Did I do anything differently this week, or did I rely entirely on my established routines?"',
        retake: `Retake CORE, your Openness baseline was ${S.O}/100. Expanding this dimension prevents career stagnation.`
      },
      'Cultural Intelligence': {
        why: ctxAction("Pakistan's professional landscape is highly diverse. Navigating regional, linguistic, and institutional differences is essential for multi-stakeholder success.", "In national banks, you must seamlessly navigate interactions from corporate head offices to rural agricultural branches.", "Civil servants are posted across diverse provinces and must adapt to local cultural and power dynamics instantly.", "Development work spans international donors in capital cities to deeply conservative rural communities.", "Senior leaders must build inclusive cultures that leverage diversity rather than demanding conformity.", "Demonstrating respect and adaptability across cultures marks you as leadership material early on."),
        now: ctxAction("Identify a miscommunication caused by cultural or departmental differences and clarify it.", "Adjust your communication style deliberately in your next email to a regional branch.", "Have a conversation with a local stakeholder purely to understand their context, without an agenda.", "Ask a community mobilizer to explain the unspoken norms of the district you are working in.", "Review your leadership team's composition and ask whose perspective is missing.", "Ask a colleague from a different background about their perspective on a workplace norm."),
        soon: ctxAction("Attend an intercultural communication workshop.", "Participate in a diversity and inclusion training focused on the Pakistani context.", "Study the regional history and administrative nuances of your current posting.", "Complete a course on culturally responsive programming or participatory development.", "Implement an inclusive meeting protocol that ensures minority voices are heard.", "Read 'The Culture Map' and map your own communication style against it."),
        fut: ctxAction("Take an assignment that requires deep engagement with a new region or stakeholder group.", "Volunteer for a rotation in a province or division you have never worked in.", "Request a field posting or secondment to a culturally distinct region.", "Lead a project that requires managing a highly diverse, multi-ethnic consortium.", "Sponsor an organizational initiative that promotes regional diversity in hiring.", "Lead a cross-regional project team."),
        acts: ["Research the institutional norms of a partner you struggle to understand.", "Adapt your communication style (formal vs informal) in your next email.", "Ask a colleague from a different background about their perspective."],
        managerStep: 'Ask your manager to assign you to a cross-functional project or committee involving a region, department, or stakeholder group you rarely interact with.',
        selfAssess: 'Recall the last time a colleague from a different background frustrated you. Did you attribute it to their competence, or did you consider cultural/institutional norms?',
        ongoing: 'Every Friday, note one assumption you made about a stakeholder that turned out to be inaccurate based on their background or context.',
        retake: `Retake CORE, your Cultural Intelligence baseline was ${S.CQavg}/100. This is increasingly critical for senior leadership in Pakistan.`
      },
      'Ethical Integrity': {
        why: ctxAction("In environments with high fiduciary or public accountability, transparency and rule compliance are non-negotiable trust metrics.", "In banking, ethical breaches lead to regulatory sanctions, reputational ruin, and criminal liability.", "In government, transparent decision-making is the bulwark against corruption allegations and audit paras.", "In the NGO sector, fiduciary integrity is the absolute baseline for donor trust and organizational survival.", "As a leader, your minor compromises become your team's major breaches. You set the ethical ceiling.", "Your professional reputation is built in decades and destroyed in a single compromised decision."),
        now: ctxAction("Identify a process where you cut corners and realign it with official policy today.", "Review your recent approvals and ensure every single one has complete, transparent documentation.", "Audit your last three decisions for strict compliance with PPRA or departmental rules.", "Disclose a minor error or variance to a donor/partner immediately rather than hiding it.", "Publicly state your commitment to a specific compliance standard in your next team meeting.", "Consult a peer or mentor on an ethically ambiguous choice you are currently facing."),
        soon: ctxAction("Attend a professional ethics and values workshop.", "Complete an advanced anti-money laundering (AML) or compliance certification.", "Attend a workshop on public procurement rules and administrative transparency.", "Enrol in a course on fiduciary risk management and donor compliance.", "Commission an independent audit of your department's decision-making processes.", "Read and discuss a case study on corporate ethics with your team."),
        fut: ctxAction("Take ownership of a high-compliance or audit-facing project.", "Volunteer to serve on the institution's internal audit or risk committee.", "Lead a departmental initiative to rewrite and modernize standard operating procedures for transparency.", "Design and enforce a new anti-fraud and safeguarding framework for your organization.", "Champion a whistleblower protection or transparency initiative across the company.", "Become the compliance champion for your unit."),
        acts: ["Audit a recent decision for transparency.", "Consult a peer on an ethically ambiguous choice.", "Disclose a minor error immediately rather than hiding it."],
        managerStep: 'Ask your manager to review a recent complex decision you made to ensure your transparency and compliance standards align perfectly with institutional expectations.',
        selfAssess: 'Audit your communication this week. Did you delay sharing bad news? Did you frame a mistake to look better than it was? Integrity gaps start small.',
        ongoing: 'Every Friday, ask yourself: "If all my professional conversations and decisions this week were made public, would I be defending them or explaining them away?"',
        retake: `Retake CORE, your Ethical Integrity baseline was ${S.EOavg}/100. This is the ultimate trust metric for high-level deployment.`
      }
    };
    return map[dim] || map['Learning Agility'];
  };

const buildHabits = (content, dim, profile, R) => {
    const isBanking = R.industry?.includes('Banking')||R.industry?.includes('Insurance')||R.industry?.includes('Takaful');
    const isGovt = R.industry?.includes('Government')||R.industry?.includes('Civil');
    const isDev = R.industry?.includes('Development')||R.industry?.includes('NGO');
    const lvl = R.level || R.exp || '';
    const isJunior = lvl.includes('Entry')||lvl.includes('Junior')||lvl.includes('0–2')||lvl.includes('3–5');
    const isSenior = lvl.includes('Senior')||lvl.includes('Executive')||lvl.includes('Director')||lvl.includes('C-Suite')||lvl.includes('16+');

    const profileContext = profile?.name ? `As a ${profile.name}, your natural instincts can sometimes mask your blind spots here.` : '';
    const industryContextWeek2 = isBanking ? 'In the financial sector, even minor interactions carry regulatory or client trust weight.' :
                                 isGovt ? 'In the civil service, note how hierarchy or bureaucratic friction influenced your response.' :
                                 isDev ? 'In the development space, note how donor, partner, or community dynamics played a role.' :
                                 'In your sector, context determines the outcome.';
    const seniorContextWeek3 = isSenior ? 'As a senior leader, you must actively dismantle the hierarchy that prevents honest feedback. Ask a peer or a trusted direct report.' : 'Listen without interrupting or defending. Write down exactly what they say.';
    const stretchContext = isBanking ? 'Volunteer for a cross-functional audit, risk, or product committee.' :
                           isGovt ? 'Apply to lead a multi-departmental policy implementation or reform taskforce.' :
                           isDev ? 'Take the lead on a complex donor reporting cycle or new programme design.' :
                           'Ask for an assignment that forces you to practice this dimension under real institutional pressure.';

    const formatHow = (tool, method, context = '') => (
      <span>
        <strong style={{color: T.t0}}>{tool}</strong> <strong style={{color: T.t0}}>Methodology:</strong> {method} {context && <span style={{fontStyle: 'italic', color: T.t2}}>{context}</span>}
      </span>
    );

    const hows = {
      'Conscientiousness & Delivery': [
        formatHow('Tool: Stop-Start-Continue Audit.', 'Draw three columns. List exactly what behaviors you must Stop, Start, and Continue regarding your task delivery. Each must be a single, measurable sentence.', profileContext),
        formatHow('Framework: The Eisenhower Matrix.', 'Force yourself to select only 3 non-negotiable, high-impact tasks per day. Do them before opening your email inbox.', industryContextWeek2),
        formatHow('Tool: The 5 Whys Root Cause Analysis.', 'When you miss a deadline, ask "Why?" 5 times to uncover if it was a time-estimation error, a resource bottleneck, or a focus error.', seniorContextWeek3),
        formatHow('Tool: 3-2-1 Reflection.', 'As you read your recommended book, write down 3 new systems, 2 you will test this week, and 1 question to explore further.'),
        formatHow('Action Protocol: The 2-Minute Rule.', 'If a task takes less than two minutes, do it immediately. Do not schedule it. Execute it now.', isJunior ? 'Building this discipline early sets your career trajectory.' : ''),
        formatHow('Framework: COIN Conversation Model.', 'Structure upward communication using Context, Observation, Impact, and Next step. Keep it purely factual.', isSenior ? 'Even at the executive level, upward accountability accelerates growth.' : ''),
        formatHow('Tool: Before/After Calibration.', 'Look at your Week 1 audit. Have your late deliveries decreased? Score your progress 1-5 to ensure the habit is sticking.'),
        formatHow('Methodology: 70-20-10 Rule.', '70% of growth comes from doing. True delivery reliability is built under pressure. Take the stretch project and map every milestone on Day 1.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. A 5-point jump in Conscientiousness completely changes your leadership trajectory.'),
        formatHow('Tool: The Friday Weekly Review (GTD).', 'Every Friday at 4 PM, clear your desk, review your calendar for next week, and block uninterrupted time for deep work.')
      ],
      'Emotional Resilience': [
        formatHow('Tool: The Trigger Audit.', 'For two days, note exactly what times of day or which interactions cause your heart rate to spike. Identify the pattern before trying to fix it.', profileContext),
        formatHow('Framework: The 90-Second Rule.', 'When triggered, physically step away from your desk. The physiological stress response lasts 90 seconds. Wait it out before hitting reply.', industryContextWeek2),
        formatHow('Tool: Trusted Sounding Board.', 'Run your intended reaction past a grounded colleague before you execute it. Ask them: "Is my response proportionate to the issue?"', seniorContextWeek3),
        formatHow('Tool: Active Reading & Mapping.', 'As you consume your resilience resource, map their theoretical frameworks directly to your top 3 specific workplace stressors.'),
        formatHow('Action Protocol: De-escalation.', 'Have this difficult conversation when you are calm, not when you are already overwhelmed. Pre-plan your opening sentence.'),
        formatHow('Framework: Solution-Oriented Upward Communication.', 'Frame your request to your manager as a structural workflow improvement, not a complaint about stress levels.'),
        formatHow('Tool: Response Calibration Check.', 'Are you still reacting instantly to bad news? Rate your composure improvement 1-5 and identify one remaining trigger.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Do not hide from pressure; manage it. Lean into a high-stakes assignment to pressure-test your new coping tools in real-time.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Emotional Stability is highly responsive to deliberate cognitive reframing over 6 months.'),
        formatHow('Tool: Boundary Rituals.', 'Leave work at work. Write down any lingering anxieties in a notebook at 5 PM, close it, and physically walk away.')
      ],
      'Learning Agility': [
        formatHow('Tool: The Comfort Zone Audit.', 'Identify the specific software, process, or regulation you have been actively avoiding learning. Write down why it intimidates you.', profileContext),
        formatHow('Framework: Timeboxing (Pomodoro).', 'Dedicate just 15 uninterrupted minutes a day to exploring a completely new domain. No distractions, just focused learning.', industryContextWeek2),
        formatHow('Methodology: The "What Did I Miss" Loop.', 'Ask a colleague to review your work specifically to point out a better or faster way to do it. Do not defend your original method.', seniorContextWeek3),
        formatHow('Tool: Cross-Pollination.', 'As you consume your recommended resource, force yourself to write down one specific way the concept applies to your current daily tasks.'),
        formatHow('Action Protocol: Zero Barrier Entry.', 'Subscribe to the journal or enroll in the course right now. The barrier to entry must be eliminated immediately.'),
        formatHow('Framework: Strategic "Why" Extraction.', 'Ask your manager to explain the strategic reasoning behind a decision you don\'t understand, rather than just accepting the "What".'),
        formatHow('Tool: The Friction Test.', 'Are you still instinctively rejecting new tools or methods? Score your adaptability 1-5 and force yourself to adopt one new tool this week.'),
        formatHow('Methodology: 70-20-10 Rule.', '70% of learning is experiential. Volunteer to test a beta software or pilot a new process for the department. Be the guinea pig.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Learning Agility is the #1 predictor of executive potential and responds fastest to habit change.'),
        formatHow('Framework: The Feynman Technique.', 'Every Friday, ask yourself: "What did I learn this week, and could I explain it simply to a junior colleague?"')
      ],
      'Social Confidence & Extraversion': [
        formatHow('Tool: The Avoidance Audit.', 'Write down every meeting or conversation where you held back this week. Identify if the barrier was fear of being wrong or fear of the spotlight.', profileContext),
        formatHow('Framework: The "First 5 Minutes" Rule.', 'Force yourself to speak, agree, or ask a question in the first 5 minutes of every meeting to break the psychological barrier of entry.', industryContextWeek2),
        formatHow('Methodology: The Wingman Protocol.', 'Privately ask a peer to actively prompt you for your opinion in a group setting.', seniorContextWeek3),
        formatHow('Tool: 3-2-1 Presence Reflection.', 'Note 3 specific vocal or physical presence techniques from your resources, and actively test 2 of them in your next meeting.'),
        formatHow('Action Protocol: Exposure Therapy.', 'Do not script the conversation. Just initiate it. The goal is exposure to the discomfort of speaking up, not perfection.'),
        formatHow('Framework: Stepping-Stone Visibility.', 'Ask your manager to let you lead just the first 10 minutes of the next team sync to build structured visibility.'),
        formatHow('Tool: Before/After Calibration.', 'Are you speaking up more naturally? Score your meeting participation 1-5 compared to Month 1.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Volunteer for the presentation you are terrified of. Preparation will carry you through, but the exposure will permanently expand your comfort zone.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Extraversion can be learned as a behavioral skill, even if it is not your natural state.'),
        formatHow('Tool: Weekly Ratio Log.', 'Tally the ratio of times you spoke up vs. held back. Watch the ratio flip over time as the habit solidifies.')
      ],
      'Agreeableness & Collaboration': [
        formatHow('Tool: The Interruption Audit.', 'Keep a tally of how many times you cut someone off or dismiss their idea this week. Awareness of the micro-behavior is the first step.', profileContext),
        formatHow('Framework: The "Playback" Protocol.', 'Before responding in a disagreement, you must repeat the other person\'s point back to them to their satisfaction.', industryContextWeek2),
        formatHow('Methodology: The Empathy Check.', 'Ask a peer you recently clashed with how they experienced the interaction. Listen entirely to understand, not to rebut.', seniorContextWeek3),
        formatHow('Tool: Active Reading.', 'Focus entirely on the negotiation and conflict de-escalation tactics in your toolkit. Write down one phrase you will use in your next conflict.'),
        formatHow('Action Protocol: The Reset.', 'Swallow your pride and initiate the relationship reset. Do not wait for them to come to you. Apologize for the friction, not the stance.'),
        formatHow('Framework: Unfiltered Upward Coaching.', 'Ask your manager for direct, unfiltered feedback on your collaborative tone. Ask: "Do I make it hard for people to disagree with me?"'),
        formatHow('Tool: Friction Test Calibration.', 'Are your workplace relationships feeling less adversarial? Score your team cohesion 1-5 and identify one remaining fractured relationship.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Take on a project where you have zero formal authority and must rely entirely on influence, diplomacy, and consensus-building.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Agreeableness is the absolute foundation of psychological safety in your team.'),
        formatHow('Tool: The Friday Ledger.', 'Who did I genuinely help this week? Who did I alienate? Be brutally honest with your self-assessment.')
      ],
      'Openness to Ideas': [
        formatHow('Tool: The "Yes, And" Audit.', 'For two days, count how many times your first reaction to an idea is "No, but...". Catch the reflex before trying to change it.', profileContext),
        formatHow('Framework: Intentional Friction.', 'Expose yourself to a completely different department\'s workflow to see how they solve problems. Shadow them for one hour.', industryContextWeek2),
        formatHow('Methodology: The Devil\'s Advocate.', 'In your next meeting, force yourself to argue in favor of the idea you secretly disagree with most, just to explore its merits.', seniorContextWeek3),
        formatHow('Tool: Concept Mapping.', 'As you consume your recommended resource, draw physical connections between their industry innovations and your daily workflows.'),
        formatHow('Action Protocol: Bias to Action.', 'Do this before you feel "ready" or before the plan is perfect. The goal is exposure to ambiguity, not flawless execution.'),
        formatHow('Framework: Strategic "Why" Extraction.', 'Ask your manager to explain the strategic "Why" behind a decision you don\'t understand, to broaden your conceptual horizon.'),
        formatHow('Tool: Before/After Calibration.', 'Are you still instinctively rejecting new tools? Score your adaptability 1-5 and force yourself to champion one new idea this month.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Volunteer to test a beta software or a completely untested process. Be the guinea pig and document the failure points constructively.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book your CORE retake. Expanding this dimension prevents career stagnation and obsolescence.'),
        formatHow('Tool: The Friday Question.', 'Ask yourself: "What did I change my mind about this week?" If your answer is nothing, your openness is regressing.')
      ],
      'Cultural Intelligence': [
        formatHow('Tool: The Assumption Audit.', 'Write down 3 assumptions you made about a stakeholder based purely on their regional or linguistic background. Verify if they were actually true.', profileContext),
        formatHow('Framework: Code-Switching.', 'Consciously adapt your communication medium (call vs. email) and tone (formal vs. informal) based on the recipient\'s institutional norm.', industryContextWeek2),
        formatHow('Methodology: The Cultural Guide.', 'Ask a colleague from a different background to explicitly explain a workplace dynamic, joke, or power structure you don\'t fully grasp.', seniorContextWeek3),
        formatHow('Tool: Active Reading & Mapping.', 'Map the 8 scales of "The Culture Map" to the different departments or provinces you interact with.'),
        formatHow('Action Protocol: Curiosity First.', 'Reach out today. Lead with curiosity rather than competence. People respect professionals who admit they want to learn their context.'),
        formatHow('Framework: Upward Exposure.', 'Ask your manager to expose you to stakeholders from entirely different regions, sectors, or socioeconomic tiers.'),
        formatHow('Tool: Before/After Calibration.', 'Are you still judging different working styles as "wrong", or are you accurately labeling them as "different"? Score your bias 1-5.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Volunteer for a cross-provincial, multi-institutional, or international steering committee where your default cultural norms do not apply.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. CQ is a defining metric for modern executives managing diverse workforces in Pakistan.'),
        formatHow('Tool: Friday Reflection.', 'Name one interaction this week where deliberately adapting your cultural or communication style directly changed the outcome.')
      ],
      'Team Citizenship': [
        formatHow('Tool: The Silo Audit.', 'Track exactly how many times you said "That is not my job" this week, either out loud or in your head. Write down what the task was.', profileContext),
        formatHow('Framework: The +1 Protocol.', 'Every time you finish a task, ask one specific colleague: "I have 15 minutes, what can I take off your plate?"', industryContextWeek2),
        formatHow('Methodology: The Recognition Loop.', 'Ask a peer who the unsung hero of the department is, and ensure you thank or credit that person publicly in the next group setting.', seniorContextWeek3),
        formatHow('Tool: 3-2-1 Reflection.', 'Focus your reading specifically on the chapters covering servant leadership and leading without authority. Write down 2 actionable steps.'),
        formatHow('Action Protocol: Stealth Execution.', 'Execute this administrative or support task quietly. Do it for the team\'s efficiency, not for visibility or credit.'),
        formatHow('Framework: Upward Support.', 'Ask your manager what their biggest administrative headache is right now, and offer to completely own the solution for them.'),
        formatHow('Tool: Before/After Calibration.', 'Do people come to you for help more often now? Score your institutional value 1-5. True anchors are magnets for team problem-solving.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Take complete ownership of a broken internal process that no one else wants to touch, and fix it without asking for additional resources.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Citizenship is what makes you indispensable during organizational restructuring.'),
        formatHow('Tool: Weekly Review Log.', 'Write down one specific thing you did this week that benefited the institution\'s health, rather than just your personal KPIs.')
      ],
      'Ethical Integrity': [
        formatHow('Tool: The Rationalization Audit.', 'Track how many times you say "It is fine just this once" or "Everyone does it." Rationalization is the first step of ethical fade.', profileContext),
        formatHow('Framework: The Daylight Test.', 'Before taking a procedural shortcut, ask: "Would I do this if my manager and the internal auditor were CC\'d on the email?" If no, stop.', industryContextWeek2),
        formatHow('Methodology: The Ethical Sounding Board.', 'Run a grey-area decision past a mentor who has absolutely nothing to gain or lose from the outcome. Ask them to poke holes in your logic.', seniorContextWeek3),
        formatHow('Tool: Active Reading.', 'Focus on the case studies of how small, incremental compromises lead to massive compliance failures. Map those risks to your own department.'),
        formatHow('Action Protocol: Immediate Correction.', 'Fix the compliance gap immediately. Do not wait for an audit to catch it. Self-reporting is the ultimate proof of integrity.'),
        formatHow('Framework: Upward Transparency.', 'Tell your manager about a mistake or procedural breach you made before they find out from someone else. Own the narrative.'),
        formatHow('Tool: The Friction Test.', 'Is it getting easier to say "no" to inappropriate requests? Score your ethical courage 1-5.'),
        formatHow('Methodology: 70-20-10 Rule.', 'Volunteer to lead a compliance review or draft a new transparency SOP for your unit. Become the standard-bearer for the rules.', stretchContext),
        formatHow('Process: Psychometric Recalibration.', 'Book the CORE retake. Authentic integrity and rule compliance form the absolute baseline for executive promotion.'),
        formatHow('Tool: Friday Reflection.', 'Ask yourself: "Could all my decisions and emails this week be published on the front page of a newspaper?" Be brutally honest.')
      ]
    };

    const defaultHows = [
      formatHow('Tool: Baseline Audit.', 'Observe your default reactions for 48 hours without trying to change them.', profileContext),
      formatHow('Tool: Micro-Habit.', 'Tie this new behavior to an existing routine.', industryContextWeek2),
      formatHow('Tool: Peer Feedback.', 'Ask a trusted colleague how they perceive your actions here.', seniorContextWeek3),
      formatHow('Tool: Active Reading.', 'Note 3 actionable takeaways from your recommended resource.'),
      formatHow('Action Protocol: Execution.', 'Execute this step within the next 48 hours without overthinking it.'),
      formatHow('Tool: Upward Alignment.', 'Keep the conversation with your manager under 10 minutes and focus on solutions.'),
      formatHow('Tool: Progress Check.', 'Compare your current behavior to Week 1 and score your progress.'),
      formatHow('Framework: 70-20-10.', 'Growth happens in the stretch zone. Lean into the discomfort.', stretchContext),
      formatHow('Process: Recalibration.', 'Book your CORE retake to measure your actual statistical shift.'),
      formatHow('Tool: Weekly Review.', 'Dedicate 15 minutes every Friday to log your progress and reset for Monday.')
    ];

    const targetHows = hows[dim] || defaultHows;

    return [
      { h:'Week 1: Baseline', t: content.now || content.acts?.[0] || 'Audit your current behaviour in this area: write down one honest observation.', how: targetHows[0] },
      { h:'Week 2: Micro-Habit', t: content.acts?.[0] || 'Track one real situation this week where this dimension affected your work.', how: targetHows[1] },
      { h:'Week 3: External Data', t: content.acts?.[1] || 'Ask one trusted colleague for specific, candid feedback.', how: targetHows[2] },
      { h:'Week 4: Knowledge', t: content.acts?.[2] || 'Start one recommended resource from your development toolkit.', how: targetHows[3] },
      { h:'Month 2: Execution', t: content.soon || 'Apply one concrete behaviour change in a real work situation.', how: targetHows[4] },
      { h:'Month 2: Alignment', t: content.managerStep || 'Align with your manager on this specific development priority.', how: targetHows[5] },
      { h:'Month 3: Pattern Check', t: content.selfAssess || 'Compare your current habits to your Week 1 baseline.', how: targetHows[6] },
      { h:'Month 4–6: Pressure Test', t: content.fut || 'Take on a stretch assignment that puts this dimension under pressure.', how: targetHows[7] },
      { h:'6 Months: Recalibration', t: content.retake || 'Retake the CORE assessment to measure your progress.', how: targetHows[8] },
      { h:'Ongoing: Maintenance', t: content.ongoing || 'Establish a weekly review habit to prevent regression.', how: targetHows[9] },
    ];
  };

  const devAreas = bot2.map(d => {
    const content = getDimContent(d.l);
    return {
      dim: d.l,
      v: d.v,
      why: content.why,
      gap: d.gap,
      habits: buildHabits(content, d.l, profile, R),
      now: content.now,
      soon: content.soon,
      fut: content.fut
    };
  });
  
      const bars = [
        ['Overall Match', S.overall], ['Personality & Drive', S.OCEANavg], ['Cultural Agility', S.CQavg],
        ['Team Citizenship', S.OCBavg], ['Learning Agility', S.LAavg], ['Ethical Integrity', S.EOavg],
        ['Conscientiousness', S.C], ['Emotional Resilience', S.ES]
      ].filter(([_,v]) => v !== undefined && v !== null);

      // ─── PDF DOWNLOAD (Action Plan) ───
  const downloadPDF = async () => {
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
    const logoURL = `${window.location.origin}/logo.svg`;

    const addPageFromHTML = async (htmlContent, bgColor = '#F8F7F5') => {
      const container = document.createElement('div');
      container.style.cssText = `position:fixed; top:-9999px; left:-9999px; width:794px; min-height:1122px; background:${bgColor}; font-family:'Plus Jakarta Sans',sans-serif; -webkit-print-color-adjust:exact;`;
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      await new Promise(r => setTimeout(r, 400));
      const canvas = await window.html2canvas(container, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: bgColor, width: 794, windowWidth: 794 });
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
        sliceCanvas.width = canvasW; sliceCanvas.height = pageHeightPx;
        const ctx = sliceCanvas.getContext('2d');
        ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvasW, pageHeightPx);
        ctx.drawImage(canvas, 0, srcY, canvasW, srcH, 0, 0, canvasW, srcH);
        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(sliceData, 'JPEG', 0, 0, A4_W, A4_H);
      }
    };

    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;
    const baseStyles = `${fontLink}<style>* { margin:0; padding:0; box-sizing:border-box; } body, div, p, span, h1, h2, h3, h4, h5 { font-family:'Plus Jakarta Sans',sans-serif; } .serif { font-family:'Playfair Display',serif !important; } .mono { font-family:'Courier New',monospace !important; }</style>`;
    const wrap = (content, bg = '#F8F7F5', pad = '56px 64px') => `${baseStyles}<div style="width:794px;min-height:1122px;background:${bg};padding:${pad};box-sizing:border-box;display:flex;flex-direction:column;">${content}</div>`;

    // Page 1: Cover
    await addPageFromHTML(wrap(`
      <div style="position:absolute;top:0;left:0;right:0;height:6px;background:#B01C24;"></div>
      <div style="position:absolute;top:-100px;right:-80px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.09) 0%,transparent 72%);"></div>
      <div style="display:flex;align-items:center;margin-bottom:auto;position:relative;z-index:2;">
        <img src="${logoURL}" style="height:56px;width:auto;object-fit:contain;" crossorigin="anonymous"/>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 0 40px;position:relative;z-index:2;">
        <div class="mono" style="font-size:10px;font-weight:800;color:#B01C24;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:20px;">Personal Action Plan</div>
        <h1 class="serif" style="font-size:58px;line-height:1.06;font-weight:700;color:#111111;margin:0 0 22px;max-width:650px;">${R.name}</h1>
        <div style="display:inline-block;padding:10px 20px;border:1px solid #D8C9A0;border-radius:999px;background:#FFF9EC;color:#8D6B15;font-size:12px;font-weight:800;width:fit-content;">${profile?.name || 'Professional Profile'}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-top:22px;border-top:1px solid #E6E0D4;position:relative;z-index:2;">
        <div style="font-size:11px;color:#6B7280;font-weight:700;letter-spacing:0.06em;">CORE by Carnelian</div>
        <div style="text-align:right;"><div style="font-size:11px;color:#6B7280;font-weight:700;margin-bottom:5px;">${date}</div><div class="mono" style="font-size:10px;color:#9CA3AF;font-weight:700;letter-spacing:0.08em;">${docId}</div></div>
      </div>
    `, '#F8F7F5', '56px 64px'), '#F8F7F5');

    // Page 2: Welcome + Scores
    const barsHTML = bars.map(([l, v], i) => {
      const color = v >= 70 ? '#16A34A' : v >= 50 ? '#D97706' : '#DC2626';
      const grad = v >= 70 ? 'linear-gradient(90deg,#16A34A,#22C55E)' : v >= 50 ? 'linear-gradient(90deg,#D97706,#F59E0B)' : 'linear-gradient(90deg,#DC2626,#EF4444)';
      return `<div style="display:flex;align-items:center;gap:14px;padding-bottom:${i===0?'14px':'0'};margin-bottom:${i===0?'6px':'0'};border-bottom:${i===0?'1px solid #F3F4F6':'none'}"><div style="width:170px;flex-shrink:0;font-size:12px;color:${i===0?'#111827':'#4B5563'};font-weight:${i===0?'800':'700'};">${l}</div><div style="flex:1;background:#F3F4F6;height:${i===0?'9px':'5px'};border-radius:4px;overflow:hidden;"><div style="width:${Math.max(0,Math.min(100,v))}%;height:100%;background:${grad};border-radius:4px;"></div></div><div class="mono" style="width:36px;text-align:right;font-size:11px;color:${color};font-weight:800;">${v}</div></div>`;
    }).join('');
    await addPageFromHTML(wrap(`
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
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:28px 32px;">
        <h3 class="serif" style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:20px;">Your Score Landscape</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">${barsHTML}</div>
      </div>
    `));

    // Page 3: Strengths
    const strengthsHTML = top2.map(d => `<div style="padding:22px;border-radius:10px;background:#F0FDF4;border:1px solid #BBF7D0;border-left:5px solid #16A34A;"><div class="mono" style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#15803D;margin-bottom:7px;">Core Strength</div><h4 class="serif" style="font-size:1.2rem;font-weight:700;margin-bottom:8px;color:#166534;">${d.l}</h4><p style="font-size:12px;color:#15803D;line-height:1.65;font-weight:500;margin-bottom:14px;">${d.str}</p><span style="padding:3px 10px;background:#DCFCE7;color:#166534;border-radius:4px;font-size:10px;font-weight:800;">${d.v}/100</span></div>`).join('');
    await addPageFromHTML(wrap(`
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px 36px;">
        <h3 class="serif" style="font-size:1.3rem;font-weight:700;color:#111827;margin-bottom:10px;">What You Bring to the Table</h3>
        <p style="color:#4B5563;font-size:12px;line-height:1.7;margin-bottom:22px;font-weight:500;">These are your anchor strengths. When things get difficult, these are the natural instincts you rely on. Lean into them—they are what make you uniquely valuable to your team.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${strengthsHTML}</div>
      </div>
    `));

    // Pages 4+: Development Roadmap
    for (const d of devAreas) {
      const habitsHTML = d.habits.map(h => `<li style="display:flex;gap:10px;padding:7px 0;font-size:12px;color:#374151;line-height:1.55;font-weight:500;"><span style="color:#D97706;font-weight:800;flex-shrink:0;">→</span><span><strong style="color:#111827;">${h.h}</strong> ${h.t}</span></li>`).join('');
      await addPageFromHTML(wrap(`
        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;"><h4 class="serif" style="font-size:1.4rem;font-weight:700;color:#111827;">${d.dim}</h4><span style="padding:5px 12px;background:rgba(217,119,6,0.1);color:#D97706;border-radius:6px;font-size:12px;font-weight:800;">${d.v}/100</span></div>
          <div class="mono" style="font-size:9px;color:#6B7280;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800;">${d.v >= 70 ? 'HIGH' : d.v >= 50 ? 'MID' : 'LOW'} range</div>
          <p style="font-size:12.5px;color:#4B5563;line-height:1.75;margin-bottom:24px;font-weight:500;padding:16px;background:#F9FAFB;border-radius:8px;border-left:4px solid #D97706;">${d.why}</p>
          <h5 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;font-weight:800;margin-bottom:14px;">Daily Habits to Build:</h5>
          <ul style="padding-left:0;list-style:none;margin-bottom:28px;">${habitsHTML}</ul>
          <h5 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;font-weight:800;margin-bottom:14px;">Your Growth Timeline:</h5>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;gap:18px;background:#FEF2F2;padding:16px;border-radius:8px;border-left:4px solid #DC2626;align-items:flex-start;"><div style="min-width:80px;font-size:11px;font-weight:800;color:#DC2626;text-transform:uppercase;letter-spacing:0.04em;">Now<br/><span style="font-size:8px;opacity:0.8">(0–30 Days)</span></div><div style="font-size:12.5px;color:#7F1D1D;line-height:1.55;font-weight:600;">${d.now || d.acts[0]}</div></div>
            <div style="display:flex;gap:18px;background:#FFFBEB;padding:16px;border-radius:8px;border-left:4px solid #D97706;align-items:flex-start;"><div style="min-width:80px;font-size:11px;font-weight:800;color:#D97706;text-transform:uppercase;letter-spacing:0.04em;">Soon<br/><span style="font-size:8px;opacity:0.8">(30–90 Days)</span></div><div style="font-size:12.5px;color:#92400E;line-height:1.55;font-weight:600;">${d.soon || d.acts[1]}</div></div>
            <div style="display:flex;gap:18px;background:#F0FDF4;padding:16px;border-radius:8px;border-left:4px solid #16A34A;align-items:flex-start;"><div style="min-width:80px;font-size:11px;font-weight:800;color:#16A34A;text-transform:uppercase;letter-spacing:0.04em;">Future<br/><span style="font-size:8px;opacity:0.8">(90–180 Days)</span></div><div style="font-size:12.5px;color:#166534;line-height:1.55;font-weight:600;">${d.fut}</div></div>
          </div>
        </div>
      `));
    }

    // Priority Action Matrix
    const matrixCards = [
      {bg:'#FEF2F2',border:'#FECACA',color:'#B91C1C',title:'1. Act Now (0–30 Days)',sub:'Micro-Habit Formation',text:"Focus purely on the 'Daily Habits' listed in your roadmap. Pick just one dimension to start. Do not attempt a massive overhaul—focus on tiny, 5-minute behavioral shifts that you can sustain daily without burnout."},
      {bg:'#FFFBEB',border:'#FDE68A',color:'#D97706',title:'2. Build Soon (30–90 Days)',sub:'Social Accountability',text:'Involve others. Share your specific development goals with a trusted manager or mentor. This is the phase for enrolling in workshops, restructuring your workflows, and actively asking colleagues for feedback.'},
      {bg:'#F0FDF4',border:'#BBF7D0',color:'#15803D',title:'3. Sustain (90–180 Days)',sub:'Pressure Testing',text:'Transition from learning to leading. Take ownership of a complex project that forces you to use your new skills under pressure. Cement your new brand within the team by delivering consistently.'},
      {bg:'#F3F4F6',border:'#E5E7EB',color:'#4B5563',title:'4. The Feedback Loop',sub:'Measuring Success',text:'Book a recurring 15-minute calendar block on the last Friday of every month. Ask yourself: "Am I reacting out of habit, or responding with intention?" Adjust your approach based on what is working.'},
      {bg:'#EFF6FF',border:'#BFDBFE',color:'#1D4ED8',title:'5. Anticipating Relapse',sub:'Grace Under Fire',text:'When stress hits, you will likely revert to old habits. Expect this. When it happens, do not abandon the plan. Acknowledge the slip, reset your environment, and start fresh the very next morning.'},
      {bg:'#FAF5FF',border:'#E9D5FF',color:'#7E22CE',title:'6. Expanding Impact',sub:'Teaching Others',text:'The ultimate test of mastering a new skill is teaching it. Once you have solidified your new habits, look for a junior colleague struggling with the same issues and gently mentor them through your process.'}
    ].map(item => `<div style="background:${item.bg};border:1px solid ${item.border};border-radius:10px;padding:20px;"><div style="font-size:11px;font-weight:800;color:${item.color};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">${item.title}</div><div style="font-size:13px;font-weight:700;color:${item.color};margin-bottom:7px;">${item.sub}</div><p style="font-size:11.5px;color:${item.color};line-height:1.55;font-weight:500;opacity:0.85;">${item.text}</p></div>`).join('');
    await addPageFromHTML(wrap(`
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:32px 36px;">
        <h3 class="serif" style="font-size:1.3rem;font-weight:700;color:#111827;margin-bottom:10px;">Priority Action Matrix</h3>
        <p style="color:#4B5563;font-size:12px;line-height:1.7;margin-bottom:28px;font-weight:500;">A comprehensive visual guide on how to distribute your energy over the next 6 months for maximum career impact.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">${matrixCards}</div>
      </div>
    `));

    // CTA
    await addPageFromHTML(wrap(`
      <div style="background:#1A1A1A;border-radius:12px;padding:56px 48px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
  <div style="width:56px;height:56px;background:rgba(184,145,46,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:26px;">🤝</div>
  <h3 class="serif" style="font-size:1.8rem;font-weight:700;color:#B8912E;margin-bottom:16px;">Let's Build Your Path Together</h3>
  <p style="color:#E5E7EB;font-size:13px;line-height:1.8;max-width:540px;margin:0 auto 32px;font-weight:500;">Reading a report is just the first step. If you found these insights helpful but want to dive deeper into what this means for your specific career trajectory, leadership style, or current workplace challenges, our consultants are here to guide you through a 1-on-1 debrief.</p>
  <div style="padding:14px 32px;border-radius:8px;border:2px solid #B01C24;color:#fff;font-size:13px;font-weight:800;display:inline-block;">
    <a href="mailto:hello@carnelianco.com" style="color:#fff;text-decoration:none;">Reach out at hello@carnelianco.com</a>
  </div>
  <div class="mono" style="margin-top:36px;font-size:9px;color:#6B7280;font-weight:600;">${docId} · CORE by Carnelian · ${date}</div>
</div>
    `));

    pdf.deletePage(1);
    pdf.save(`${R.name?.replace(/\s+/g,'_') || 'ActionPlan'}_CORE_ActionPlan.pdf`);
  };

  // ── RESOURCES & PROTOCOLS ──
  const getResources = () => {
    const res = [];
    if(S.C<65){
      if(S.O>=65) res.push({type:'book', title:'The 12 Week Year', author:'Brian Moran & Michael Lennington', url:'', why:'Sprint-based system designed for high-idea, lower-routine professionals. Replaces annual goals with 12-week cycles — each with a single concrete deliverable. Works with your natural rhythm, not against it.'});
      else res.push({type:'book', title:'Atomic Habits', author:'James Clear', url:'', why:'The most evidence-grounded system for building reliable delivery habits through small compounding commitments. 15+ million copies sold.'});
      res.push({type:'ted', title:'Inside the Mind of a Master Procrastinator', author:'Tim Urban · TED2016', url:'https://www.youtube.com/watch?v=arj7oStGLkU', why:'19 million views. Explains the psychology of task-avoidance and deadline-dependency with disarming honesty. Watch this before starting your 30-day delivery log.'});
      res.push({type:'research', title:'Conscientiousness and Performance: A Meta-Analytic Review', author:'Barrick & Mount (1991) — Journal of Applied Psychology', url:'', why:'85-year meta-analysis showing conscientiousness (r=.22) is the single most consistent personality predictor of job performance across all occupations. Read the abstract — understanding why this matters will change how you see this dimension.'});
    }
    if(S.ES<65){
      res.push({type:'book', title:'Chatter: The Voice in Our Head, Why It Matters, and How to Harness It', author:'Ethan Kross', url:'', why:"Evidence-based techniques for managing the inner critical voice under pressure. Kross's research at University of Michigan directly addresses the cognitive mechanism behind emotional instability. More practical than general resilience books."});
      res.push({type:'ted', title:'How to Make Stress Your Friend', author:'Kelly McGonigal · TEDGlobal 2013', url:'https://www.youtube.com/watch?v=RcGyVTAoXEU', why:'21 million views. Stanford psychologist explains research showing the relationship with stress — not stress itself — predicts health and performance. One of the most directly applicable TED talks to your profile.'});
      res.push({type:'youtube', title:'How to Process Emotions — Dr. Marc Brackett (Yale)', author:'Huberman Lab Podcast', url:'https://www.youtube.com/watch?v=WBWOP9asMCg', why:'Yale Center for Emotional Intelligence. Practical framework for processing emotions under professional pressure. Free, evidence-grounded. Watch in segments.'});
      res.push({type:'research', title:'Emotional Regulation and Job Performance: A Meta-Analysis', author:'Mesmer-Magnus et al. (2012) — Journal of Applied Psychology', url:'', why:'Meta-analysis of 245 studies demonstrating that emotional regulation — not emotional absence — predicts both individual performance and team outcomes.'});
    }
    if(S.CQavg<65){
      res.push({type:'book', title:'The Culture Map', author:'Erin Meyer', url:'', why:"The most practically applicable cultural intelligence book for Pakistani professionals. Meyer's eight-dimension framework directly covers communication, trust, and hierarchy styles you encounter across Pakistan's diverse institutional landscape."});
      res.push({type:'ted', title:'The Danger of a Single Story', author:'Chimamanda Ngozi Adichie · TEDGlobal 2009', url:'https://www.youtube.com/watch?v=D9Ihs241zeg', why:"31 million views. The most-watched talk on cultural assumption and narrative bias. Directly addresses the CQ-Knowledge gap — how limited exposure creates incomplete mental models of people from other backgrounds."});
      res.push({type:'youtube', title:'Cultural Intelligence: The Competitive Edge for Leaders', author:'David Livermore · TEDxMSU', url:'https://www.youtube.com/watch?v=cAsJOE1HExk', why:"Livermore — one of the world's leading CQ researchers — explains why cultural intelligence outperforms IQ in cross-cultural effectiveness. 20 minutes. Free."});
      res.push({type:'research', title:'Cultural Intelligence: Its Measurement and Effects on Cultural Judgment', author:'Ang, Van Dyne et al. (2007) — Management and Organization Review', url:'', why:"Foundational academic paper establishing CQ's predictive validity for cross-cultural performance (β=.31) beyond personality and IQ. Cited 3,000+ times."});
    }
    if(S.LAavg<65){
      res.push({type:'book', title:'Mindset: The New Psychology of Success', author:'Carol S. Dweck', url:'', why:"Stanford psychologist Carol Dweck's research on fixed vs. growth mindset — the belief system that determines whether challenges are threats or opportunities. Directly addresses the cognitive roots of low learning agility."});
      res.push({type:'ted', title:'How to Get Better at the Things You Care About', author:'Eduardo Briceno · TEDxManhattanBeach 2016', url:'https://www.youtube.com/watch?v=YKACzIrog24', why:"Briceno's distinction between learning mode and performance mode is directly applicable to low learning agility profiles. Explains why professionals who are always performing never improve. 12 minutes."});
      res.push({type:'youtube', title:'Learning Agility: The Key to Leader Potential', author:'Robert Eichinger · Korn Ferry Institute', url:'https://www.youtube.com/watch?v=3WbMSyCOtmg', why:"Co-creator of the learning agility framework your assessment uses explains the research and what developing each dimension actually looks like in practice."});
      res.push({type:'research', title:'Exploring the Construct Validity of Learning Agility', author:'DeRue, Ashford & Myers (2012) — Human Resource Management', url:'', why:"Peer-reviewed validation showing learning agility predicts leadership effectiveness beyond established personality and cognitive measures. The scientific basis for why this is the strongest predictor of leadership potential."});
    }
    if(S.EOavg<65 || (gameSummary?.seesaw?.val > 65)){
      res.push({type:'book', title:'The Righteous Mind: Why Good People Are Divided', author:'Jonathan Haidt', url:'', why:"Haidt's moral psychology research explains why people who make ethical lapses are not usually dishonest by nature — they are following intuitions that feel justified. Understanding your own moral intuition is the first step to building conscious ethical guardrails."});
      res.push({type:'ted', title:'Our Buggy Moral Code', author:'Dan Ariely · TED2009', url:'https://www.youtube.com/watch?v=MxiT42BFWOA', why:"Ariely's behavioural economics research on how good people consistently make small unethical decisions — and why. Directly mapped to what the seesaw and ethics challenge in your assessment measured. 16 minutes."});
      res.push({type:'youtube', title:'Justice: What\'s the Right Thing to Do? — Episode 1', author:'Michael Sandel, Harvard Open Course', url:'https://www.youtube.com/watch?v=kBdfcR-8hEY', why:"Harvard's most popular course, now free. Episodes 1-3 introduce the ethical reasoning frameworks your EO score engages. Watch them as a professional development investment."});
      res.push({type:'research', title:'A Meta-Analysis of Integrity Test Validities', author:'Ones, Viswesvaran & Schmidt (1993) — Journal of Applied Psychology', url:'', why:"Meta-analysis of 665 studies demonstrating integrity assessment predicts not only counterproductive work behaviour but overall job performance (rho=.41). The most-cited paper in integrity measurement."});
    }
    if(S.OCB_S<55){
      res.push({type:'book', title:'Radical Candor: Be a Kick-Ass Boss Without Losing Your Humanity', author:'Kim Scott', url:'', why:"Kim Scott's framework for channelling honest frustration into constructive feedback. Directly applicable to professionals who struggle to manage workplace frustrations without affecting team morale."});
      res.push({type:'ted', title:'Why Good Leaders Make You Feel Safe', author:'Simon Sinek · TED2014', url:'https://www.youtube.com/watch?v=lmyZMtPVodo', why:"Sinek's talk on how leaders who channel difficulty constructively create team environments where people perform better. Reframes constructive attitude as a leadership superpower."});
    }
    if(S.LA_PA<55){
      res.push({type:'book', title:'Thanks for the Feedback: The Science and Art of Receiving Feedback Well', author:'Douglas Stone & Sheila Heen', url:'', why:"Harvard Negotiation Project research explaining why people resist feedback even when they want to improve — and specific tools to receive it accurately."});
      res.push({type:'ted', title:'Increase Your Self-Awareness with One Simple Fix', author:'Tasha Eurich · TEDxMileHigh 2017', url:'https://www.youtube.com/watch?v=tGdsOXZpyWE', why:"Eurich's research on self-awareness shows most people who think they are self-aware are not — and which introspection habits actually work. Directly targeted at People Agility."});
    }
    if(S.A<60){
      res.push({type:'book', title:'Getting to Yes: Negotiating Agreement Without Giving In', author:'Fisher, Ury & Patton', url:'', why:"The foundational text on principled negotiation — relevant because low Agreeableness often manifests as positional rather than interest-based conflict. Fisher and Ury's framework helps you disagree and influence without damaging relationships."});
      res.push({type:'ted', title:'10 Ways to Have a Better Conversation', author:'Celeste Headlee · TEDxCreativeCoast 2015', url:'https://www.youtube.com/watch?v=R1vskiVDwl4', why:"21 million views. Headlee's talk targets the specific habits that prevent genuine listening — the same mechanisms that drive low Agreeableness scores. Practical, behavioural, immediately applicable."});
      res.push({type:'research', title:'Agreeableness and Job Performance: A Meta-Analytic Review', author:'Mount, Barrick & Stewart (1998) — Personnel Psychology', url:'', why:"Meta-analysis demonstrating Agreeableness (r=.34) is the strongest personality predictor of performance in team-based and interpersonal jobs. Directly relevant to your dimension score and its career implications."});
    }
    if(S.O<60){
      res.push({type:'book', title:'A Whole New Mind: Why Right-Brainers Will Rule the Future', author:'Daniel H. Pink', url:'', why:"Pink's accessible argument for why creative, design, and conceptual thinking is increasingly critical in professional roles — directly targeted at professionals who have built strong careers on technical and procedural competence and now need to expand their range."});
      res.push({type:'ted', title:'Do Schools Kill Creativity?', author:'Sir Ken Robinson · TED2006', url:'https://www.youtube.com/watch?v=iG9CE55wbtY', why:"The most-watched TED talk of all time (75+ million views). Robinson's argument about why creative thinking gets suppressed — and how to recover it — is directly relevant to low Openness profiles. Starting point for understanding why your natural instinct is to refine rather than reinvent."});
    }
    if(S.E<50){
      res.push({type:'book', title:"Quiet: The Power of Introverts in a World That Can't Stop Talking", author:'Susan Cain', url:'', why:"Susan Cain's research-backed argument that introversion is a professional asset — not a deficit — when deployed deliberately. Directly relevant to low Extraversion profiles who work in visible or client-facing roles."});
      res.push({type:'ted', title:'The Power of Introverts', author:'Susan Cain · TED2012', url:'https://www.youtube.com/watch?v=c0KYU2j0TM4', why:"28 million views. Cain's argument for why introverts make exceptional leaders and contributors when they understand and leverage their natural working style rather than performing extroversion."});
    }
    if(S.C>=75&&S.EOavg>=75&&S.LAavg>=70){
      res.push({type:'book', title:'The Effective Executive', author:'Peter Drucker', url:'', why:"Drucker's foundational text on how high-performing professionals make their strengths productive and time purposeful. For your profile the work is not fixing gaps — it is deploying strengths deliberately."});
      res.push({type:'ted', title:'The Puzzle of Motivation', author:'Dan Pink · TED2009', url:'https://www.youtube.com/watch?v=rrkrvAUbU9Y', why:"Pink's talk on what drives sustained high performance at the mastery level — autonomy, mastery, and purpose. Directly applicable to your profile stage."});
    }
    if(profile.name==='Visionary Sprinter'){
      res.push({type:'method', title:'6-Week Sprint Cycle (Carnelian Recommendation)', author:'', url:'', why:'Do not attempt daily habit systems. Structure your work in 6-week intensive cycles with one concrete deliverable at the end of each. Reset fully between cycles. Novelty drives your best work — routine kills it.'});
    }
    if(res.length===0){
      res.push({type:'book', title:'The Effective Executive', author:'Peter Drucker', url:'', why:'Foundational text on professional effectiveness. Useful for consolidating a balanced, multi-dimensional profile.'});
      res.push({type:'ted', title:'How Great Leaders Inspire Action', author:'Simon Sinek · TEDxPugetSound 2009', url:'https://www.youtube.com/watch?v=qp0HIF3SfI4', why:"The most-watched leadership TED talk. Sinek's Golden Circle framework is applicable to how you communicate your professional value."});
    }
    return res;
  };

  const getPrograms = () => {
    const progs = [];
    if(S.E<60||S.A<60||S.OCBavg<60) progs.push({name:'Communication & Influence Workshop', desc:"Carnelian's two-day programme covering professional communication styles, stakeholder influence, and cross-contextual messaging. Covers assertive communication, active listening, and managing difficult conversations.", match:'Recommended based on your Social Confidence and Agreeableness scores.'});
    if(S.EOavg<65||(gameSummary?.seesaw?.val>60)) progs.push({name:'Professional Ethics & Values Programme', desc:"A Carnelian-facilitated workshop on ethical decision-making frameworks, integrity under pressure, and building a culture of transparency. Uses real Pakistani workplace case studies.", match:'Recommended based on your Ethical Orientation scores and Values Seesaw responses.'});
    if(S.LAavg<65||S.O<60) progs.push({name:'Learning Agility & Growth Mindset Workshop', desc:"A Carnelian programme building the specific habits — feedback-seeking, reflection, cross-domain application — that accelerate professional development. Grounded in Dweck, Eichinger, and DeRue's frameworks.", match:'Recommended based on your Learning Agility profile.'});
    if(S.CQavg<65) progs.push({name:'Intercultural Communication & Collaboration Workshop', desc:"Carnelian's cross-cultural effectiveness programme for Pakistani multi-institutional and cross-provincial professional contexts. Covers all three CQ dimensions in practical workplace scenarios.", match:'Recommended based on your Cultural Intelligence scores.'});
    if(S.ES<60) progs.push({name:'Resilience & Emotional Intelligence Programme', desc:"A Carnelian one-day programme combining evidence-based resilience frameworks with practical emotional regulation tools for high-stakes Pakistani professional environments.", match:'Recommended based on your Emotional Stability score.'});
    if(CI.LRS>=55) progs.push({name:'Leadership Development Programme (LDP)', desc:"Carnelian's flagship leadership development pathway — covering strategic thinking, stakeholder management, team leadership, and executive presence. Modular delivery over 3–6 months.", match:'Your Leadership Readiness Score suggests readiness for structured leadership investment.'});
    if(S.C<60||CI.OPS<60) progs.push({name:'Personal Effectiveness & Productivity Workshop', desc:"A Carnelian half-day programme built around sprint planning, priority management, and delivery accountability. Uses CORE dimension scores as the diagnostic foundation.", match:'Recommended based on your Conscientiousness and Operational Reliability scores.'});
    progs.push({name:'CORE Coaching Session — 1:1 Debrief with Carnelian Consultant', desc:"A structured 90-minute session with a Carnelian consultant to debrief your full CORE profile, clarify your development priorities, and co-design a personalised 90-day action plan. Online or in-person.", match:'Recommended for all CORE participants who want expert guidance on their results.'});
    if(profile.tier<=2) progs.push({name:'Train the Trainer (TTT) Programme', desc:"Carnelian's TTT certification programme for professionals developing their facilitation, coaching, and knowledge transfer skills. Particularly valuable for mid-to-senior professionals building internal capability.", match:'Your profile suggests capacity for peer learning and knowledge transfer roles.'});
    if(S.A<60||CI.SES<60) progs.push({name:'Negotiation & Stakeholder Management Workshop', desc:"A practical one-day Carnelian programme covering principled negotiation, stakeholder mapping, managing resistance, and building influence without formal authority. Real Pakistani sectoral case studies.", match:'Recommended based on your Stakeholder Effectiveness and Agreeableness scores.'});
    return progs.slice(0,5);
  };

  const getRelapse = () => {
    const protocols = [];
    const ssVal = gameSummary?.seesaw?.val || 50;
    const sc1 = gameSummary?.scenario1?.raw || 0;
    const sc2 = gameSummary?.scenario2?.raw || 0;
    
    if(ssVal>65) protocols.push({trigger:'When a trusted colleague or manager asks you to bypass a process', response:'Pause before responding. Ask yourself: "If this decision were reviewed publicly tomorrow, would I defend it — or explain it away?" If you are explaining rather than defending, say no — or ask for it in writing first.'});
    if(sc1<=0) protocols.push({trigger:'When you feel the urge to delay or withhold information that others need', response:"Send one sentence now rather than a perfect explanation later. Early, imperfect disclosure builds more trust than late, polished disclosure. Information withheld under pressure is almost always discovered — and the delay compounds the problem."});
    if(sc2<0) protocols.push({trigger:"When someone you respect asks you to approve, sign off on, or stay silent about something that does not feel right", response:"Name it directly but privately first: 'I want to support you, but I am not comfortable with this because [specific reason]. What can we do instead?' This gives the relationship a chance before escalation — and it documents your position."});
    if(S.C<55) protocols.push({trigger:'When you find yourself approaching a deadline without having started', response:"Use the 2-minute rule: if you can do any meaningful piece of this task in 2 minutes right now, start immediately. Momentum from even a tiny start breaks the avoidance cycle more reliably than any motivational technique."});
    if(S.ES<55) protocols.push({trigger:'When you feel your emotional state affecting your decision-making or relationships at work', response:"Name it to yourself first: 'I am currently [stressed / frustrated / overwhelmed].' Research shows labelling an emotional state reduces its intensity significantly. Then delay any non-urgent decision by at least 20 minutes."});
    if(protocols.length===0) protocols.push({trigger:'When you face a situation where the right and the convenient path diverge', response:"Use the clarity test: 'What would I tell a junior colleague to do in this situation?' The answer you give them is usually the answer you already know for yourself. Then do that."});
    return protocols;
  };

  const resources = getResources();
  const programs = getPrograms();
  const relapse = getRelapse();

  // ─── RENDER TABS ───
  return (
    <div style={{maxWidth:'1000px', margin:'0 auto', padding:'40px 24px'}}>
      
     {/* Tab Navigation */}
      <div className="no-print" style={{display:'flex', gap:'8px', marginBottom:'32px', flexWrap:'wrap'}}>
        <button onClick={()=>setResTab('action')} style={{padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", border:`2px solid ${resTab==='action'?T.gold:T.b2}`, background:resTab==='action'?T.gold:'transparent', color:resTab==='action'?'#fff':T.t1, transition:'all 0.2s'}}>
          🧭 Candidate Action Plan
        </button>
        <button onClick={()=>setResTab('tech')} style={{padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", border:`2px solid ${resTab==='tech'?T.gold:T.b2}`, background:resTab==='tech'?T.gold:'transparent', color:resTab==='tech'?'#fff':T.t1, transition:'all 0.2s'}}>
          📊 Technical Report
        </button>
        <button onClick={()=>setResTab('player')} style={{padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", border:`2px solid ${resTab==='player'?T.gold:T.b2}`, background:resTab==='player'?T.gold:'transparent', color:resTab==='player'?'#fff':T.t1, transition:'all 0.2s'}}>
          🎮 Player Report
        </button>
        {R.purpose !== 'Personal Development Planning' && (
          <>
            <button onClick={()=>setResTab('team')} style={{padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", border:`2px solid ${resTab==='team'?T.gold:T.b2}`, background:resTab==='team'?T.gold:'transparent', color:resTab==='team'?'#fff':T.t1, transition:'all 0.2s'}}>
              👥 Team Aggregate
            </button>
            <button onClick={()=>setResTab('comp')} style={{padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", border:`2px solid ${resTab==='comp'?T.gold:T.b2}`, background:resTab==='comp'?T.gold:'transparent', color:resTab==='comp'?'#fff':T.t1, transition:'all 0.2s'}}>
              🧩 Team Composition
            </button>
          </>
        )}
      </div>

      {/* ─── TAB 1: ACTION PLAN ─── */}
      {resTab === 'action' && (
        <div className="anim-fadeUp">
          <div style={{background: T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'48px 40px', marginBottom:'24px', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-50px',right:'-50px',width:'200px',height:'200px',borderRadius:'50%',background:`radial-gradient(circle,${T.goldP} 0%,transparent 70%)`}} />
            <div style={{position:'relative',zIndex:1}}>
              <div className="mono" style={{fontSize:'10px',color:T.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'12px',fontWeight:'700'}}>Your Personal CORE Development Report</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,2.6rem)',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>{R.name}</h1>
              <p style={{color:T.t1,fontSize:'14px',lineHeight:'1.8',marginBottom:'16px',fontWeight:'500'}}>This report is written directly to you and not to your manager or HR. It translates your assessment results into specific, actionable guidance: what your scores mean, where your genuine strengths are, what to develop, and exactly how. Read it once for the picture. Read it again with a pen.</p>
              <div style={{fontSize:'12px', color:T.t3, marginBottom:'24px'}}>{date} · {R.exp} · {R.purpose} {R.industry ? `· ${R.industry}` : ''}</div>
              
              <div style={{background:T.bg2,border:`1px solid ${T.b2}`,borderRadius:'10px',padding:'24px', borderLeft:`4px solid ${T.c}`}}>
                <div className="mono" style={{fontSize:'9px',textTransform:'uppercase',letterSpacing:'0.14em',color:T.gold,fontWeight:'700',marginBottom:'8px'}}>Your Professional Profile</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',color:T.t0,fontWeight:'700',marginBottom:'10px'}}>{profile?.name || 'Professional Profile'}</div>
                <div style={{fontSize:'13px',color:T.t2,lineHeight:'1.7',fontWeight:'600'}}>{profile?.desc || 'A reliable and principled professional with strong compliance orientation.'}</div>
                {profile?.devNote && <div style={{marginTop:'12px', padding:'12px', background:`${T.gold}10`, borderLeft:`3px solid ${T.gold}`, borderRadius:'6px', fontSize:'12.5px', color:T.t1, lineHeight:'1.6'}}>{profile.devNote}</div>}
              </div>
            </div>
          </div>

          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Your Score Profile at a Glance</h3>
            <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'12px', fontWeight:'500'}}>Each bar represents a dimension of your professional profile. Green = genuine strength. Amber = developing. Red = your priority — and your development plan is built around it.</p>
<div style={{fontSize:'12px', color:T.t3, marginBottom:'24px', padding:'10px 14px', background:T.bg2, borderRadius:'6px', lineHeight:'1.6', fontWeight:'500'}}>
  <strong style={{color:T.t2}}>Note on groupings:</strong> Personality & Drive is the average of 5 individual traits — Openness, Conscientiousness, Social Confidence, Collaborative Spirit, and Emotional Resilience. Cultural Agility, Team Citizenship, Learning Agility, and Ethical Integrity are each averages of 3–5 sub-dimensions. The development areas and priority matrix below drill into the individual dimensions within these groups — which is why you may see names that differ from the bars above.
</div>
            <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 32px'}}>
              {bars.slice(1).map(([l,v],i)=>(
                <div key={l} style={{marginBottom:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'4px'}}>
                    <span style={{fontSize:'13px',color:T.t0,fontWeight:'700'}}>{l}</span>
                    <span className="mono" style={{fontSize:'11px',color:bCol(v),fontWeight:'800'}}>{v}/100 · {v>=75?'Strong':v>=55?'Developing':'Priority'}</span>
                  </div>
                  <Bar score={v} w="100%" h={8} />
                </div>
              ))}
            </div>

            <div style={{background:T.bg2, borderRadius:'10px', padding:'24px', marginTop:'32px'}}>
              <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'16px'}}>Your 7 Composite Indices — How Dimensions Interact</div>
<div style={{fontSize:'12px', color:T.t2, lineHeight:'1.6', marginBottom:'16px', fontWeight:'500', padding:'12px 16px', background:T.bg3, borderRadius:'8px', borderLeft:`3px solid ${T.gold}`}}>
  These 7 indices combine scores across all five modules to reflect how your dimensions interact — not just how they score individually. Each index is weighted by meta-analytic research for its specific role family. A low index in any area is a targeted development signal, not a general verdict. For a full debrief of what your indices mean for your role and career trajectory, reach out to <strong style={{color:T.gold}}>Carnelian at hello@carnelianco.com</strong>
</div>
<div className="grid-7-col" style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'10px', textAlign:'center'}}>                {[
                  ['CII','Compliance',CI.CII,70,54],['LRS','Leadership',CI.LRS,72,55],['TVS','Team Value',CI.TVS,68,51],
                  ['ADS','Adaptability',CI.ADS,67,50],['SES','Stakeholder',CI.SES,68,52],['OPS','Operations',CI.OPS,67,51],['PMS','People Mgmt',CI.PMS,67,51]
                ].map(([k,l,v,g,a]) => {
                  const col = v>=g ? T.gn : v>=a ? T.am : T.rd;
                  const circ = 100.53;
                  const offset = circ * (1 - v/100);
                  return (
                    <div key={k}>
                      <div style={{position:'relative', width:'52px', height:'52px', margin:'0 auto 8px'}}>
                        <svg viewBox="0 0 36 36" style={{width:'52px', height:'52px', transform:'rotate(-90deg)'}}>
                          <circle cx="18" cy="18" r="16" fill="none" stroke={T.b2} strokeWidth="3.5"/>
                          <circle cx="18" cy="18" r="16" fill="none" stroke={col} strokeWidth="3.5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
                        </svg>
                        <div className="mono" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'11px', fontWeight:'800', color:col}}>{v}</div>
                      </div>
                      <div style={{fontSize:'11px', fontWeight:'800', color:T.gold}}>{k}</div>
                      <div style={{fontSize:'9px', color:T.t3, lineHeight:'1.3', marginTop:'2px'}}>{l}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>What You Are Good At · And Where To Grow</h3>
            <p style={{fontSize:'13px', color:T.t2, lineHeight:'1.7', fontWeight:'500', marginBottom:'24px'}}>
              <strong style={{color:T.t0}}>How we selected these four areas:</strong> The CORE engine breaks down your broad composite scores into 9 specific behavioural dimensions and ranks them from highest to lowest. The <strong style={{color:T.gn}}>Top 2</strong> become your anchor strengths — the natural instincts you should actively leverage. The <strong style={{color:T.rd}}>Bottom 2</strong> become your priority development areas — the specific gaps where focused effort will yield the highest career return.
            </p>
            <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              {top2.map(d=>(
                <div key={d.k} style={{padding:'24px',borderRadius:'10px',background:T.gnP,border:`1px solid ${T.gn}40`,borderLeft:`5px solid ${T.gn}`}}>
                  <div className="mono" style={{fontSize:'9px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'0.12em',color:T.gn,marginBottom:'8px'}}>✦ Core Strength</div>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',marginBottom:'10px',color:T.gn}}>{d.l}</h4>
                  <p style={{fontSize:'13px',color:T.gn,lineHeight:'1.7',fontWeight:'500',marginBottom:'16px'}}>{d.str}</p>
                  <div className="mono" style={{fontSize:'10px', color:T.gn, fontWeight:'700'}}>Score: {d.v}/100 · {bd(d.v)} Range</div>
                </div>
              ))}
              {bot2.map(d=>(
                <div key={d.k} style={{padding:'24px',borderRadius:'10px',background:T.rdP,border:`1px solid ${T.rd}40`,borderLeft:`5px solid ${T.rd}`}}>
                  <div className="mono" style={{fontSize:'9px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'0.12em',color:T.rd,marginBottom:'8px'}}>◈ Priority Development Area</div>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',marginBottom:'8px',color:T.rd}}>{d.l}</h4>
                  <p style={{fontSize:'12px',color:T.rd,lineHeight:'1.6',fontWeight:'600',marginBottom:'10px',borderBottom:`1px solid ${T.rd}25`,paddingBottom:'10px'}}>{d.gap || 'A core driver of professional effectiveness and your highest-leverage development opportunity right now.'}</p>
                  <p style={{fontSize:'12px',color:T.rd,lineHeight:'1.7',fontWeight:'500',marginBottom:'16px'}}>Your 10-step action plan below targets this dimension specifically. Building habits here creates the greatest measurable career impact at your current stage.</p>
                  <div className="mono" style={{fontSize:'10px', color:T.rd, fontWeight:'700'}}>Score: {d.v}/100 · {bd(d.v)} Range</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Your Development Roadmap {R.industry ? `· ${R.industry}` : ''}</h3>
            <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px 24px', marginBottom:'20px', borderLeft:`4px solid ${T.gold}`}}>
              <p style={{color:T.t1, fontSize:'13.5px', lineHeight:'1.8', fontWeight:'500', margin:0}}>
                The score landscape above shows your full profile — strengths, developing areas, and priorities. <strong style={{color:T.t0}}>This action plan focuses on your lowest-scoring behaviours only.</strong> That is intentional. Research consistently shows that working on too many habits at once leads to none of them sticking. Micro-actions applied consistently to your core gaps create more measurable growth than scattered effort across everything at once.
                <br/><br/>
                Once you have built real habits around these two dimensions and your next CORE retake shows movement, Carnelian will work with you on the next layer. Think of this as <strong style={{color:T.gold}}>sequenced development</strong> — not a limitation, but a strategy. If you want to understand how your full profile maps to a broader development plan, <strong style={{color:T.gold}}>reach out to Carnelian at hello@carnelianco.com</strong>
              </p>
            </div>
            <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'16px', fontWeight:'500'}}>Each area below includes a 10-step plan with week-by-week instructions. Follow the steps in order — each one builds on the previous.</p>
            {R.industry && <div style={{background:`${T.c}10`, borderLeft:`3px solid ${T.c}`, padding:'10px 14px', borderRadius:'0 8px 8px 0', fontSize:'12px', color:T.c, fontWeight:'600', marginBottom:'24px'}}>Industry lens: <strong>{R.industry}</strong> — all actions are framed for this sector.</div>}
            
            {devAreas.length > 0 ? devAreas.map((d,i)=>{
              const dimCol = d.v<45 ? T.rd : d.v<60 ? T.am : T.gn;
              return (
              <div key={i} style={{border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px',marginBottom:'24px',background:T.bg2}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:'700',color:T.t0}}>{d.dim}</h4>
                  <span className="mono" style={{fontSize:'14px',fontWeight:'800',color:dimCol}}>{d.v}/100</span>
                </div>
                <div style={{height:'6px', background:T.b1, borderRadius:'100px', overflow:'hidden', marginBottom:'16px'}}>
                  <div style={{height:'100%', width:`${d.v}%`, background:dimCol, borderRadius:'100px'}} />
                </div>
                <p style={{fontSize:'13.5px',color:T.t1,lineHeight:'1.8',marginBottom:'24px',fontWeight:'500'}}>{d.why}</p>

                <div className="mono" style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:T.t3,fontWeight:'800',marginBottom:'12px'}}>Your 10-Step Action Plan for {d.dim}</div>
                <div style={{display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px'}}>
{(d.habits||[]).map((h, j) => {
  const isRed = j < 2;
  const isAm = j >= 2 && j < 5;
  const sCol = isRed ? T.rd : isAm ? T.am : T.gn;
  const sBg = isRed ? T.rdP : isAm ? T.amP : T.gnP;
  const stepKey = `${i}_${j}`;
  const isExpanded = expandedSteps[stepKey];
  return (
    <div key={j} style={{background:sBg, borderRadius:'8px', overflow:'hidden'}}>
      <div
        onClick={() => setExpandedSteps(prev => ({...prev, [stepKey]: !prev[stepKey]}))}
        style={{display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px 16px', cursor:'pointer'}}
      >
        <div style={{minWidth:'24px', height:'24px', borderRadius:'50%', background:sCol, color:'#fff', fontSize:'11px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>{j+1}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
            <div className="mono" style={{fontSize:'9px', fontWeight:'800', color:sCol, textTransform:'uppercase', letterSpacing:'0.08em'}}>{h.h}</div>
            <span style={{fontSize:'10px', color:sCol, fontWeight:'700', flexShrink:0, marginLeft:'8px'}}>{isExpanded ? '▲ hide how' : '▼ how to do this'}</span>
          </div>
          <div style={{fontSize:'13px', color:T.t0, lineHeight:'1.6', fontWeight:'500'}}><strong style={{color:T.t0}}>{h.h}</strong> {h.t}</div>
        </div>
      </div>
      {isExpanded && h.how && (
        <div style={{margin:'0 16px 14px 52px', padding:'12px 14px', background:T.bg1, borderRadius:'6px', borderLeft:`3px solid ${sCol}`}}>
          <div className="mono" style={{fontSize:'9px', fontWeight:'800', color:sCol, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px'}}>How to do this</div>
          <div style={{fontSize:'12.5px', color:T.t1, lineHeight:'1.75', fontWeight:'500'}}>{h.how}</div>
        </div>
      )}
    </div>
  );
})}
</div>

                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <span style={{padding:'6px 12px', borderRadius:'100px', fontSize:'11px', fontWeight:'700', background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40`}}>🔴 Days 1–30: {d.now||d.acts[0]}</span>
                  <span style={{padding:'6px 12px', borderRadius:'100px', fontSize:'11px', fontWeight:'700', background:T.amP, color:T.am, border:`1px solid ${T.am}40`}}>🟡 Days 30–90: {d.soon||d.acts[1]}</span>
                  <span style={{padding:'6px 12px', borderRadius:'100px', fontSize:'11px', fontWeight:'700', background:T.gnP, color:T.gn, border:`1px solid ${T.gn}40`}}>🟢 Days 90–180: {d.fut}</span>
                </div>
              </div>
            )}) : (
              <div style={{padding:'24px',background:T.gnP,borderRadius:'12px',fontSize:'14px',color:T.gn,lineHeight:'1.7',fontWeight:'600'}}>
                Your profile is remarkably balanced. No critical development red-flags were detected. Focus on sustaining your current habits and taking on stretch assignments outside your comfort zone to expand your impact.
              </div>
            )}
          </div>

          {/* Resources & Protocols */}
          <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'24px'}}>
            <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px'}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Your Profile-Matched Development Toolkit</h3>
              <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'24px', fontWeight:'500'}}>Every resource below was selected for your specific psychometric profile and dimension scores — not a generic reading list.</p>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {resources.map((r, i) => {
                  const tCol = r.type==='book'?'#3B82F6':r.type==='ted'?'#EF4444':r.type==='youtube'?'#10B981':'#8B5CF6';
                  const tBg = r.type==='book'?'#DBEAFE':r.type==='ted'?'#FEE2E2':r.type==='youtube'?'#D1FAE5':'#EDE9FE';
                  const tLbl = r.type==='book'?'📖 Book':r.type==='ted'?'🎬 TED Talk':r.type==='youtube'?'▶ YouTube':'🔬 Research';
                  return (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px', display:'flex', gap:'16px', alignItems:'flex-start'}}>
                    <div className="mono" style={{fontSize:'9px', fontWeight:'800', color:tCol, background:tBg, padding:'4px 8px', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap'}}>{tLbl}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'4px', flexWrap:'wrap', gap:'8px'}}>
                        <div style={{fontSize:'13px', fontWeight:'700', color:T.t0}}>{r.title}</div>
                        <div style={{fontSize:'11px', color:T.t3}}>{r.author}</div>
                      </div>
                      <div style={{fontSize:'12px', color:T.t1, lineHeight:'1.6', marginBottom:r.url?'8px':'0'}}>{r.why}</div>
                      {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontSize:'11px', fontWeight:'700', color:tCol, textDecoration:'none'}}>→ Watch / Access ↗</a>}
                    </div>
                  </div>
                )})}
              </div>
            </div>

            <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px'}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Your If-Then Protocol · When Habits Break</h3>
              <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'24px', fontWeight:'500'}}>Research consistently shows relapse risk is highest in the first 30 days. These protocols are decision frameworks for situations you will encounter.</p>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {relapse.map((p, i) => (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px'}}>
                    <div style={{display:'flex', gap:'12px', marginBottom:'12px', alignItems:'baseline'}}>
                      <span className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.rd, background:T.rdP, padding:'4px 8px', borderRadius:'4px'}}>IF →</span>
                      <span style={{fontSize:'13px', fontWeight:'700', color:T.t0}}>{p.trigger}</span>
                    </div>
                    <div style={{display:'flex', gap:'12px', alignItems:'baseline'}}>
                      <span className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.gn, background:T.gnP, padding:'4px 8px', borderRadius:'4px'}}>THEN →</span>
                      <span style={{fontSize:'13px', color:T.t1, lineHeight:'1.6', fontWeight:'500'}}>{p.response}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carnelian Programs */}
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Recommended Training · Carnelian Programmes</h3>
            <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'24px', fontWeight:'500'}}>The following Carnelian programmes are specifically matched to your CORE profile and dimension scores. Your organisation can commission any of these — or you can reach out as an individual.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'24px'}}>
              {programs.map((p, i) => (
                <div key={i} style={{background:`linear-gradient(135deg, ${T.bg2} 0%, ${T.bg3} 100%)`, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <div style={{width:'32px', height:'32px', borderRadius:'50%', background:T.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'800', flexShrink:0}}>C</div>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:'700', color:T.gold, marginBottom:'6px'}}>{p.name}</div>
                    <div style={{fontSize:'13px', color:T.t1, lineHeight:'1.6', marginBottom:'8px'}}>{p.desc}</div>
                    <div style={{fontSize:'11px', color:T.gn, fontStyle:'italic', fontWeight:'600'}}>{p.match || 'Recommended based on your profile.'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:T.c, borderRadius:'10px', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px'}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:'700', color:'#fff', marginBottom:'4px'}}>Get in touch with Carnelian</div>
                <div style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'500'}}>Request programme information, commission in-house delivery, or arrange a personal CORE coaching session.</div>
              </div>
              <div style={{fontSize:'14px', fontWeight:'800', color:T.gold}}><a href="mailto:hello@carnelianco.com" style={{fontSize:'14px', fontWeight:'800', color:T.gold, textDecoration:'none'}}>
  hello@carnelianco.com
</a></div>
            </div>
          </div>

          {/* Priority Matrix */}
          <div style={{background:T.bg1,border:`1px solid ${T.b2}`,borderRadius:'12px',padding:'32px 36px',marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'12px'}}>Your Priority Action Matrix</h3>
            <p style={{color:T.t2, fontSize:'13px', lineHeight:'1.7', marginBottom:'12px', fontWeight:'500'}}>Dimensions sorted by urgency. Sustain means it is a genuine strength — protect it actively.</p>
            <div style={{fontSize:'12px', color:T.t3, marginBottom:'24px', padding:'10px 14px', background:T.bg2, borderRadius:'6px', lineHeight:'1.6', fontWeight:'500'}}>
              <strong style={{color:T.t2}}>Where these come from:</strong> The bars above show module-level composites. This matrix goes one level deeper — it sorts the individual dimensions that make up those composites by urgency, so you know exactly which specific behaviour to focus on, not just which broad module to work on.
            </div>
            
            <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div style={{background:T.rdP, border:`1px solid ${T.rd}40`, borderRadius:'10px', padding:'20px'}}>
                <div style={{fontSize:'13px', fontWeight:'800', color:T.rd, marginBottom:'12px'}}>🔴 Act Now (0–30 Days)</div>
                <ul style={{paddingLeft:'20px', margin:0, color:T.t0, fontSize:'13px', lineHeight:'1.6', fontWeight:'600'}}>
                  {devAreas.filter(d=>d.v<45).map(d=><li key={d.dim}>{d.dim}</li>)}
                  {devAreas.filter(d=>d.v<45).length===0 && <li>No critical gaps — focus on elevation</li>}
                </ul>
              </div>
              <div style={{background:T.amP, border:`1px solid ${T.am}40`, borderRadius:'10px', padding:'20px'}}>
                <div style={{fontSize:'13px', fontWeight:'800', color:T.am, marginBottom:'12px'}}>🟡 Build Soon (30–90 Days)</div>
                <ul style={{paddingLeft:'20px', margin:0, color:T.t0, fontSize:'13px', lineHeight:'1.6', fontWeight:'600'}}>
                  {devAreas.filter(d=>d.v>=45&&d.v<60).map(d=><li key={d.dim}>{d.dim}</li>)}
                  {devAreas.filter(d=>d.v>=45&&d.v<60).length===0 && <li>No short-term gaps identified</li>}
                </ul>
              </div>
              <div style={{background:T.gnP, border:`1px solid ${T.gn}40`, borderRadius:'10px', padding:'20px'}}>
                <div style={{fontSize:'13px', fontWeight:'800', color:T.gn, marginBottom:'12px'}}>🟢 Sustain & Expand</div>
                <ul style={{paddingLeft:'20px', margin:0, color:T.t0, fontSize:'13px', lineHeight:'1.6', fontWeight:'600'}}>
                  {allDims.filter(d=>d.v>=75).map(d=><li key={d.l}>{d.l}</li>)}
                  {allDims.filter(d=>d.v>=75).length===0 && <li>Continue balanced development</li>}
                </ul>
              </div>
              <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px'}}>
                <div style={{fontSize:'13px', fontWeight:'800', color:T.t2, marginBottom:'12px'}}>🔵 Monitor Progress</div>
                <ul style={{paddingLeft:'20px', margin:0, color:T.t0, fontSize:'13px', lineHeight:'1.6', fontWeight:'600'}}>
                  {allDims.filter(d=>d.v>=60&&d.v<75).map(d=><li key={d.l}>{d.l}</li>)}
                  {allDims.filter(d=>d.v>=60&&d.v<75).length===0 && <li>Review all dimensions at 6-month CORE retake</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Close Note */}
          <div style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>A Note to Close</h3>
            <p style={{color:T.t1, fontSize:'13.5px', lineHeight:'1.8', marginBottom:'24px', fontWeight:'500'}}>“This report is a starting point, not a verdict. Psychometric scores describe tendencies: they do not define your ceiling. Every dimension measured here is developable with deliberate effort and the right support. The 10‑step plans above are specific because vague advice produces no change. Take one action from this report today, not tomorrow, not next week. Use it in your next conversation with your manager, your training coordinator, or your mentor. Growth begins with honest self‑knowledge. You have just demonstrated that.</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${T.b1}`, paddingTop:'20px', flexWrap:'wrap', gap:'12px'}}>
              <div className="mono" style={{fontSize:'10px', color:T.t3, fontWeight:'600'}}>CORE · {docId} · Carnelian Pvt Ltd · {date}</div>
              <div style={{fontSize:'12px', color:T.gn, fontWeight:'700'}}>Questions? hello@carnelianco.com</div>
            </div>
          </div>

          <div className="no-print" style={{display:'flex', gap:'12px', marginTop:'24px'}}>
            <button onClick={downloadPDF} style={{padding:'12px 24px', borderRadius:'8px', background:T.t0, color:T.bg0, border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'800'}}>⬇ Download Action Plan (PDF)</button>
          </div>

        </div>
      )}

{/* ─── TAB 2: TECHNICAL REPORT ─── */}
      {resTab === 'tech' && (() => {
        const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '14px' };
        const thStyle = { fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: T.t3, padding: '0 10px 12px', textAlign: 'left', borderBottom: `2px solid ${T.b2}` };
        const tdStyle = { padding: '14px 10px', borderBottom: `1px solid ${T.b1}`, fontSize: '13px', verticalAlign: 'middle', color: T.t1, fontWeight: '500' };
        const lastTdStyle = { ...tdStyle, borderBottom: 'none' };
        
        const isDevContext = R.purpose && (R.purpose.includes('Development') || R.purpose.includes('Training') || R.purpose.includes('Personal') || R.purpose.includes('Coaching'));

        return (
        <div className="anim-fadeUp">
          {validity.overall === 'red' && (
            <div style={{background:T.rdP, border:`2px solid ${T.rd}`, borderRadius:'10px', padding:'16px 18px', marginBottom:'20px'}}>
              <div style={{fontSize:'13px', fontWeight:'800', color:T.rd, marginBottom:'6px'}}>⚠ VALIDITY OVERRIDE — RESULTS UNRELIABLE</div>
              <div style={{fontSize:'13px', color:T.t1, lineHeight:'1.65'}}>This assessment has been flagged as invalid (see Validity Index below). All dimension scores, composite indices, role suitability verdicts, and pattern detections in this report are unreliable and <strong>must not be used for any HR decision or personnel action</strong>. Recommend supervised retake before any results are acted upon.</div>
            </div>
          )}

          {/* ── HEADER ── */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-50px',right:'-50px',width:'200px',height:'200px',borderRadius:'50%',background:`radial-gradient(circle,${T.cGlow} 0%,transparent 70%)`}} />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', position:'relative', zIndex:1, flexWrap:'wrap', gap:'12px'}}>
              <div>
                <div className="serif" style={{fontSize:'14px', color:T.gold, letterSpacing:'0.06em', marginBottom:'4px'}}>CORE · Carnelian Pvt Ltd {R.org ? `× ${R.org}` : ''}</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3}}>Document ID: {docId} · {date} · TECHNICAL REPORT — {R.conf || 'Restricted'}</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3, marginTop:'4px'}}>Completion time: {reportData.completionTime} · {reportData.completionFlag}</div>
              </div>
              <div style={{textAlign:'right', fontSize:'12px', color:T.t2}}>
                <div>{R.purpose}</div>
                {R.batch && <div>{R.batch}</div>}
                {R.industry && <div>{IND[R.industry]?.icon} {IND[R.industry]?.short}</div>}
              </div>
            </div>
            
            <div className="serif" style={{fontSize:'2.4rem', fontWeight:'700', color:T.t0, marginBottom:'8px', position:'relative', zIndex:1}}>{R.name}</div>
            <div style={{fontSize:'13px', color:T.t2, lineHeight:'1.8', position:'relative', zIndex:1}}>
              {R.role ? R.role : ''}{R.dept ? ` · ${R.dept}` : ''}<br/>
              {R.email ? `${R.email}` : ''}{R.phone ? ` · ${R.phone}` : ''}<br/>
              {R.emp ? `ID: ${R.emp} · ` : ''}Experience: {R.exp}{R.gender && R.gender !== 'Prefer not to say' ? ` · ${R.gender}` : ''}
            </div>
            
            <div style={{display:'inline-block', background:T.c, color:'#fff', fontSize:'12px', fontWeight:'800', padding:'6px 18px', borderRadius:'100px', marginTop:'16px', letterSpacing:'0.04em', position:'relative', zIndex:1}}>
              Profile: {validity.overall === 'red' && validity.extRatio > 0.85 ? '⚠ SUPPRESSED — Invalid Response Pattern' : profile.name}
            </div>

            {profile.name === 'Emerging Professional' && !(validity.overall === 'red' && validity.extRatio > 0.85) && (
              <div style={{background:T.amP, border:`1px solid ${T.am}50`, borderRadius:'8px', padding:'12px 16px', marginTop:'16px', fontSize:'12.5px', color:T.t1, lineHeight:'1.6', position:'relative', zIndex:1}}>
                <strong style={{color:T.am}}>Note for HR:</strong> Emerging Professional is a differentiated, valid profile result — not a default or low-score category. It identifies a professional with specific strengths and clear targeted development opportunities. The dimensions where this individual scores above threshold are genuine assets. The dimensions below threshold are development priorities, not disqualifiers. This profile responds well to structured coaching and produces measurable score improvements on re-assessment.
              </div>
            )}

            {isDevContext && !(validity.overall === 'red' && validity.extRatio > 0.85) && (
              <div style={{background:'rgba(59, 130, 246, 0.1)', border:'1px solid rgba(59, 130, 246, 0.3)', borderRadius:'8px', padding:'12px 16px', marginTop:'16px', fontSize:'12.5px', color:T.t1, lineHeight:'1.6', position:'relative', zIndex:1}}>
                <strong style={{color:'#3B82F6'}}>Development Context:</strong> This assessment was commissioned for <em>{R.purpose}</em>. All role suitability and risk language in this report should be read as <strong>development priorities</strong>, not placement restrictions. Phrases such as "do not deploy without intervention" indicate where focused coaching will have the highest impact, they are not disqualification verdicts in a development context. Share the Candidate Action Plan with the individual directly.
              </div>
            )}

<div className="grid-5-col" style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', background:T.b0, borderRadius:'10px', padding:'20px', marginTop:'24px', position:'relative', zIndex:1}}>              {validity.overall === 'red' && validity.extRatio > 0.85 ? (
                <div style={{gridColumn:'1/-1', color:T.rd, fontSize:'13px', lineHeight:'1.6'}}>
                  <strong>⛔ RESULTS UNINTERPRETABLE</strong><br/>
                  Extreme response pattern detected ({Math.round(validity.extRatio*100)}% extreme responses). Dimension scores and composite indices shown below are statistically invalid and must not be used for any HR decision. See the Validity Index section for full details. A supervised retake is required.
                </div>
              ) : (
                <>
                  <div style={{textAlign:'center'}}><div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{S.OCEANavg}</div><div className="mono" style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>Personality</div></div>
                  <div style={{textAlign:'center'}}><div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{S.CQavg}</div><div className="mono" style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>Cultural IQ</div></div>
                  <div style={{textAlign:'center'}}><div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{S.OCBavg}</div><div className="mono" style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>Citizenship</div></div>
                  <div style={{textAlign:'center'}}><div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{S.LAavg}</div><div className="mono" style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>Learning</div></div>
                  <div style={{textAlign:'center'}}><div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{S.EOavg}</div><div className="mono" style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>Integrity</div></div>
                </>
              )}
            </div>
          </div>

          {/* ── COMPOSITE INDICES ── */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px', flexWrap:'wrap'}}>
              <Pill label="Composite" color={T.gold} />
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>Cross-Module Composite Indices</h3>
              <span className="mono" style={{fontSize:'10px', color:T.t3, marginLeft:'auto'}}>Interlinked scoring across all 5 modules</span>
            </div>
            
            {validity.overall === 'red' && validity.extRatio > 0.85 ? (
              <div style={{background:T.rdP, border:`1px solid ${T.rd}40`, borderRadius:'8px', padding:'16px', fontSize:'13px', color:T.rd, lineHeight:'1.6'}}>
                <strong>⛔ Composite indices suppressed.</strong> The extreme response pattern detected renders all dimension and composite scores statistically meaningless. Displaying these scores would create a false impression of a valid profile.
              </div>
            ) : (
              <>
                <p style={{fontSize:'13px', color:T.t2, marginBottom:'14px', lineHeight:'1.6'}}>Each composite index draws from multiple modules simultaneously, weighted by meta-analytic validity evidence per job family. These are the primary decision-making scores for HR leadership — they reflect how dimensions interact, not just how they score individually.</p>
                <div style={{overflowX:'auto'}}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Index</th>
                        <th style={thStyle}>Score</th>
                        <th style={{...thStyle, width:'130px'}}>Profile</th>
                        <th style={thStyle}>Risk Level</th>
                        <th style={thStyle}>What it measures & why it matters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {k:'Compliance & Integrity Index (CII)', f:'EO_RC × 0.32 + EO_AI × 0.32 + EO_T × 0.20 + C × 0.16', v:CI.CII, g:70, a:54, d:'Primary screen for treasury, audit, procurement, and any fiduciary role. CII below 54 is a placement flag regardless of other scores.'},
                        {k:'Leadership Readiness Score (LRS)', f:'C × 0.22 + E × 0.18 + LAavg × 0.25 + EOavg × 0.20 + ES × 0.15', v:CI.LRS, g:72, a:55, d:'Composite predictor of senior leadership performance. Combines the five dimensions with highest leadership validity. Use for promotion and succession decisions.'},
                        {k:'Team Value Score (TVS)', f:'A × 0.22 + OCB_A × 0.20 + OCB_S × 0.18 + OCB_CO × 0.18 + OCBavg × 0.22', v:CI.TVS, g:68, a:51, d:'Predicts team cohesion contribution. Low TVS candidates may create friction or free-ride on colleagues. High TVS candidates are informal team anchors.'},
                        {k:'Adaptability Score (ADS)', f:'LAavg × 0.38 + O × 0.32 + CQavg × 0.30', v:CI.ADS, g:67, a:50, d:'Suitability for change, reform, and innovation roles. Low ADS candidates need stable, structured environments. Do not place in transformation leadership.'},
                        {k:'Stakeholder Effectiveness Score (SES)', f:'E × 0.28 + A × 0.22 + CQavg × 0.28 + OCB_CO × 0.22', v:CI.SES, g:68, a:52, d:'Effectiveness with clients, donors, regulators, and partners. Combines social confidence, empathy, cultural intelligence, and proactive communication.'},
                        {k:'Operational Reliability Score (OPS)', f:'C × 0.35 + ES × 0.30 + OCB_Cn × 0.20 + LA_MA × 0.15', v:CI.OPS, g:67, a:51, d:'Sustained delivery and operational reliability under pressure. Primary predictor for technical, specialist, and operations roles.'},
                      ].map((c, i, arr) => {
                        const isLast = i === arr.length - 1;
                        const col = c.v >= c.g ? T.gn : c.v >= c.a ? T.am : T.rd;
                        const bg = c.v >= c.g ? T.gnP : c.v >= c.a ? T.amP : T.rdP;
                        const lbl = c.v >= c.g ? 'LOW RISK' : c.v >= c.a ? 'MODERATE' : 'HIGH RISK';
                        return (
                          <tr key={i}>
                            <td style={isLast ? lastTdStyle : tdStyle}>
                              <strong style={{color:T.t0}}>{c.k}</strong><br/>
                              <span className="mono" style={{fontSize:'10px', color:T.t3}}>{c.f}</span>
                            </td>
                            <td style={isLast ? lastTdStyle : tdStyle}>
                              <span className="mono" style={{display:'inline-block', padding:'4px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:'800', background:bg, color:col}}>{c.v}/100</span>
                            </td>
                            <td style={isLast ? lastTdStyle : tdStyle}>
                              <Bar score={c.v} w="100%" h={6} />
                            </td>
                            <td style={isLast ? lastTdStyle : tdStyle}>
                              <span style={{fontSize:'11px', fontWeight:'800', color:col}}>{lbl}</span>
                            </td>
                            <td style={{...(isLast ? lastTdStyle : tdStyle), fontSize:'12.5px', lineHeight:'1.5'}}>{c.d}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* ── VALIDITY INDEX ── */}
          <div style={{background:validity.overall==='green'?T.gnP:validity.overall==='amber'?T.amP:T.rdP, border:`1px solid ${validity.overall==='green'?T.gn:validity.overall==='amber'?T.am:T.rd}40`, borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
              <span style={{fontSize:'20px'}}>{validity.overall==='green'?'✅':validity.overall==='amber'?'⚠️':'🚨'}</span>
              <h4 style={{fontSize:'15px', fontWeight:'700', color:validity.overall==='green'?T.gn:validity.overall==='amber'?T.am:T.rd}}>Response Validity Index: {validity.overallLabel}</h4>
            </div>
            <div style={{fontSize:'13px', lineHeight:'1.65', color:T.t1, marginBottom:'16px'}}>
              {validity.flags.map((f,i) => <div key={i} style={{marginBottom:'4px'}}><strong style={{color:f.type==='red'?T.rd:f.type==='amber'?T.am:T.gn}}>{f.key}:</strong> {f.text}</div>)}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginTop:'16px'}}>
              <div style={{background:T.b0, borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div className="mono" style={{fontSize:'1.4rem', fontWeight:'800', color:T.t0}}>{validity.lAgree}/10</div>
                <div className="mono" style={{fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.06em', color:T.t3, marginTop:'4px', fontWeight:'700'}}>L-Scale Agrees</div>
              </div>
              <div style={{background:T.b0, borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div className="mono" style={{fontSize:'1.4rem', fontWeight:'800', color:T.t0}}>{Math.round(validity.saRatio*100)}%</div>
                <div className="mono" style={{fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.06em', color:T.t3, marginTop:'4px', fontWeight:'700'}}>Strongly Agree Rate</div>
              </div>
              <div style={{background:T.b0, borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div className="mono" style={{fontSize:'1.4rem', fontWeight:'800', color:T.t0}}>{Math.round(validity.extRatio*100)}%</div>
                <div className="mono" style={{fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.06em', color:T.t3, marginTop:'4px', fontWeight:'700'}}>Extreme Responses</div>
              </div>
              <div style={{background:T.b0, borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div className="mono" style={{fontSize:'1.4rem', fontWeight:'800', color:T.t0}}>{validity.conScore}/100</div>
                <div className="mono" style={{fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.06em', color:T.t3, marginTop:'4px', fontWeight:'700'}}>Consistency Index</div>
              </div>
            </div>
          </div>

          {/* ── CROSS-DIMENSIONAL PATTERNS ── */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
              <Pill label="Patterns" color={T.c} />
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>Cross-Dimensional Pattern Analysis</h3>
              <span className="mono" style={{fontSize:'10px', color:T.t3, marginLeft:'auto'}}>Interaction effects across modules</span>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'20px', lineHeight:'1.6'}}>Individual dimension scores do not tell the whole story. The patterns below identify how dimensions interact — combinations that create specific risks or opportunities that would be invisible from individual scores alone. Red patterns require HR action before deployment.</p>
            
            {isDevContext && (
              <div style={{background:'rgba(59, 130, 246, 0.1)', borderLeft:'3px solid #3B82F6', borderRadius:'0 8px 8px 0', padding:'12px 16px', marginBottom:'20px', fontSize:'12.5px', color:T.t1, lineHeight:'1.6'}}>
                <strong style={{color:'#3B82F6'}}>Development deployment:</strong> "HR Action" and "Do not place" language in red patterns below indicates high-priority coaching targets in a development context — not disqualification decisions. The candidate-facing Candidate Action Plan addresses these patterns directly and constructively.
              </div>
            )}

            {patterns && patterns.length > 0 ? (
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {patterns.map((p, i) => {
                  const isRed = p.sev === 'red';
                  const isAmber = p.sev === 'amber';
                  const bg = isRed ? T.rdP : isAmber ? T.amP : T.gnP;
                  const bc = isRed ? T.rd : isAmber ? T.am : T.gn;
                  const icon = isRed ? '🔴' : isAmber ? '🟡' : '🟢';
                  return (
                    <div key={i} style={{background:bg, border:`1px solid ${bc}40`, borderRadius:'10px', padding:'20px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                        <span>{icon}</span>
                        <span className="mono" style={{fontSize:'11px', fontWeight:'800', color:bc, textTransform:'uppercase', letterSpacing:'0.06em'}}>{p.name}</span>
                      </div>
                      <div style={{fontSize:'14px', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>{p.headline}</div>
                      <div style={{fontSize:'13px', color:T.t1, lineHeight:'1.65', marginBottom:p.action?'12px':'0'}}>{p.detail}</div>
                      {p.action && (
                        <div style={{fontSize:'12.5px', fontWeight:'600', color:T.t0, background:T.b0, padding:'10px 14px', borderRadius:'6px', borderLeft:`3px solid ${bc}`, marginTop:'12px'}}>
                          <strong>HR Action:</strong> {p.action}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{padding:'20px', background:T.b0, borderRadius:'8px', fontSize:'13px', color:T.t2}}>No significant cross-dimensional patterns detected. Standard onboarding processes apply.</div>
            )}
          </div>

          {/* ── THE 5 MODULE TABLES ── */}
          {[
  { title: 'Personality at Work — OCEAN Framework', pill: 'Pillar 1', col: '#3B82F6', dims: [['O','Openness to Experience',S.O],['C','Conscientiousness',S.C],['E','Extraversion',S.E],['A','Agreeableness',S.A],['ES','Emotional Stability (inv.)',S.ES]] },
  { title: 'Cultural Intelligence (CQ)', pill: 'Pillar 2', col: T.gn, dims: [['CQ_K','Cultural Knowledge',S.CQ_K],['CQ_M','Cultural Motivation',S.CQ_M],['CQ_B','Cultural Behaviour',S.CQ_B]] },
  { title: 'Organisational Citizenship Behaviour (OCB)', pill: 'Pillar 3', col: T.am, dims: [['OCB_A','Altruism',S.OCB_A],['OCB_CV','Civic Virtue',S.OCB_CV],['OCB_S','Sportsmanship',S.OCB_S],['OCB_CO','Courtesy',S.OCB_CO],['OCB_Cn','Conscientiousness (OCB)',S.OCB_Cn]] },
  { title: 'Adaptive Thinking & Learning Agility', pill: 'Pillar 4', col: '#8B5CF6', dims: [['LA_MA','Mental Agility',S.LA_MA],['LA_PA','People Agility (Self-Reflection)',S.LA_PA],['LA_CA','Change Agility (Systems Thinking)',S.LA_CA],['LA_RA','Results Agility (Cross-Domain Learning)',S.LA_RA]] },
  { title: 'Integrity & Ethical Orientation', pill: 'Pillar 5', col: T.rd, dims: [['EO_RC','Rule Compliance',S.EO_RC],['EO_T','Transparency & Disclosure',S.EO_T],['EO_ER','Ethical Reasoning',S.EO_ER],['EO_AI','Authentic Integrity',S.EO_AI]] }
].map((mod, i) => (
            <div key={i} style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
                <Pill label={mod.pill} color={mod.col} bg={`${mod.col}15`} />
                <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>{mod.title}</h3>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Dimension</th>
                      <th style={thStyle}>Score</th>
                      <th style={{...thStyle, width:'130px'}}>Profile</th>
                      <th style={thStyle}>Band</th>
                      <th style={thStyle}>Psychometric Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.dims.map(([k, l, v], j, arr) => {
                      const isLast = j === arr.length - 1;
                      const col = bCol(v, T);
                      const bg = bBg(v, T);
                      return (
                        <tr key={k}>
                          <td style={isLast ? lastTdStyle : tdStyle}>
                            <strong style={{color:T.t0}}>{l}</strong>
                          </td>
                          <td style={isLast ? lastTdStyle : tdStyle}>
                            <span className="mono" style={{display:'inline-block', padding:'4px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:'800', background:bg, color:col}}>{v}/100</span>
                          </td>
                          <td style={isLast ? lastTdStyle : tdStyle}>
                            <Bar score={v} w="100%" h={6} />
                          </td>
                          <td style={isLast ? lastTdStyle : tdStyle}>
                            <span style={{fontSize:'11px', fontWeight:'800', color:col}}>{bd(v)}</span>
                          </td>
                          <td style={{...(isLast ? lastTdStyle : tdStyle), fontSize:'12.5px', lineHeight:'1.5'}}>{dimI(k, v)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {mod.note && <div className="mono" style={{marginTop:'16px', fontSize:'10px', color:T.t3, background:T.bg2, padding:'12px', borderRadius:'6px', lineHeight:'1.5'}}>{mod.note}</div>}
            </div>
          ))}

          {/* ── ROLE SUITABILITY MATRIX ── */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
              <Pill label="Suitability" color={T.gold} />
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>Role Suitability Matrix</h3>
              <span className="mono" style={{fontSize:'10px', color:T.t3, marginLeft:'auto'}}>Composite index-based deployment guide</span>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'20px', lineHeight:'1.6'}}>Each rating is derived from the relevant composite index for that role family. 🚫 Not Recommended means the composite score falls below the minimum threshold for safe or effective deployment in that role type — not that the candidate is generally unsuitable. Interview probes are provided for all red-rated role types.</p>
            
            <div style={{overflowX:'auto'}}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Role Family</th>
                    <th style={thStyle}>Score</th>
                    <th style={{...thStyle, width:'130px'}}>Profile</th>
                    <th style={thStyle}>Verdict</th>
                    <th style={thStyle}>Guidance</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r, i, arr) => {
                    const isLast = i === arr.length - 1;
                    const rat = r.score>=r.g?'green':r.score>=r.a?'amber':'red';
                    const lbl = rat==='green'?'✅ Suitable':rat==='amber'?'⚠️ Conditional':'🚫 Not Recommended';
                    const col = rat==='green'?T.gn:rat==='amber'?T.am:T.rd;
                    const bg = rat==='green'?T.gnP:rat==='amber'?T.amP:T.rdP;
                    return (
                      <tr key={i}>
                        <td style={{...(isLast ? lastTdStyle : tdStyle), fontWeight:'700', color:T.t0}}>{r.name}</td>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <span className="mono" style={{display:'inline-block', padding:'4px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:'800', background:bg, color:col}}>{r.score}/100</span>
                        </td>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <Bar score={r.score} w="100%" h={6} />
                        </td>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <span style={{fontSize:'11px', fontWeight:'800', color:col}}>{lbl}</span>
                        </td>
                        <td style={{...(isLast ? lastTdStyle : tdStyle), fontSize:'12.5px', lineHeight:'1.5'}}>
                          {rat==='red' ? (
                            <>
                              <div style={{color:T.rd, marginBottom:'8px'}}>{r.redNote}</div>
                              <div className="mono" style={{fontSize:'9px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px', color:T.t0}}>Required Interview Probes:</div>
                              {r.probeQ.map((q,qi)=><div key={qi} style={{padding:'4px 0', borderBottom:qi<r.probeQ.length-1?`1px solid ${T.b1}`:'none'}}>→ {q}</div>)}
                            </>
                          ) : rat==='amber' ? 'Use with structured onboarding and defined performance milestones.' : 'Suitable for deployment. Standard performance management applies.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {R.industry && IND[R.industry] && (
              <div style={{background:T.bg2, borderRadius:'10px', padding:'20px', marginTop:'24px', borderLeft:`4px solid ${T.c}`}}>
                <h4 style={{fontSize:'12px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.08em', color:T.gold, marginBottom:'10px'}}>{IND[R.industry].icon} {IND[R.industry].short} — Industry Lens</h4>
                <p style={{fontSize:'13px', color:T.t1, lineHeight:'1.65', marginBottom:'12px'}} dangerouslySetInnerHTML={{__html: IND[R.industry].lens}}></p>
                <p style={{fontSize:'13px', color:T.t1, marginBottom:'8px'}}><strong>High Potential Benchmark:</strong> {IND[R.industry].hiPotential}</p>
                <p style={{fontSize:'13px', color:T.rd}}><strong>Industry Risk Note:</strong> {IND[R.industry].riskNote}</p>
              </div>
            )}
          </div>

          {/* ── GAME PERFORMANCE ── */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
              <Pill label="Gamified" color="#8B5CF6" bg="rgba(139, 92, 246, 0.15)" />
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>Performance Challenge Results</h3>
              <span className="mono" style={{fontSize:'10px', color:T.t3, marginLeft:'auto'}}>Ethical Balance · Situational Judgment × 2</span>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'20px', lineHeight:'1.6'}}>These three challenges bypass deliberate self-presentation. Scores are already incorporated into the relevant dimension scores above. The table below shows the raw performance for HR reference and audit purposes.</p>
            
            <div style={{overflowX:'auto'}}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Challenge</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Performance</th>
                    <th style={thStyle}>Modifier Applied</th>
                    <th style={thStyle}>Dimensions Affected</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {t:'Values in Balance — Seesaw', sub:'No timer — deliberate position (early, within Part A)', type:'Ethical Values Elicitation', perf:gameSummary.seesaw.label, pts:`${gameSummary.seesaw.bonus>=0?'+':''}${gameSummary.seesaw.bonus} pts · Pos: ${gameSummary.seesaw.val}/100`, dims:'Ethical Reasoning (EO_ER)', col:gameSummary.seesaw.bonus>=0?T.gn:T.rd, bg:gameSummary.seesaw.bonus>=0?T.gnP:T.rdP},
                    {t:'Quick Decision Challenge', sub:'Timed 45-sec scenario (mid-Part C)', type:'Situational Judgment Test', perf:gameSummary.scenario1.label, pts:`${gameSummary.scenario1.raw>=0?'+':''}${gameSummary.scenario1.raw} pts`, dims:'People Agility (LA_PA), Transparency (EO_T)', col:gameSummary.scenario1.raw>=0?T.gn:T.rd, bg:gameSummary.scenario1.raw>=0?T.gnP:T.rdP},
                    {t:'Ethics Under Pressure', sub:'Timed 45-sec scenario (after Part E, before Part F)', type:'Situational Judgment Test', perf:gameSummary.scenario2.label, pts:`${gameSummary.scenario2.raw>=0?'+':''}${gameSummary.scenario2.raw} pts`, dims:'Rule Compliance (EO_RC), Authentic Integrity (EO_AI)', col:gameSummary.scenario2.raw>=0?T.gn:T.rd, bg:gameSummary.scenario2.raw>=0?T.gnP:T.rdP},
                  ].map((g, i, arr) => {
                    const isLast = i === arr.length - 1;
                    return (
                      <tr key={i}>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <strong style={{color:T.t0}}>{g.t}</strong><br/>
                          <span style={{fontSize:'11px', color:T.t3}}>{g.sub}</span>
                        </td>
                        <td style={{...(isLast ? lastTdStyle : tdStyle), fontSize:'11px', color:T.t2}}>{g.type}</td>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <span className="mono" style={{display:'inline-block', padding:'4px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:'800', background:g.bg, color:g.col}}>{g.perf}</span>
                        </td>
                        <td style={isLast ? lastTdStyle : tdStyle}>
                          <span className="mono" style={{fontSize:'12px', fontWeight:'800', color:g.col}}>{g.pts}</span>
                        </td>
                        <td style={{...(isLast ? lastTdStyle : tdStyle), fontSize:'12px', color:T.t1}}>{g.dims}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mono" style={{marginTop:'16px', fontSize:'10px', color:T.t3, background:T.bg2, padding:'12px', borderRadius:'6px', lineHeight:'1.5'}}>Performance challenge scores are incorporated into dimension composites at a capped modifier of ±10 points per dimension. Methodology: Situational Judgment Tests (McDaniel et al., 2001); Ethical values elicitation (Rest, 1986); Kohlberg (1969).</div>
          </div>

          <div className="mono" style={{background:T.bg2, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'16px 20px', marginBottom:'24px', fontSize:'10.5px', color:T.t2, lineHeight:'1.7'}}>
            <strong style={{color:T.t0}}>Assessment Integrity Statement:</strong> CORE is a self-report instrument with four built-in validity controls. Dimension scores and composite indices are diagnostic inputs — not standalone hiring or promotion decisions. All red-rated patterns and role suitability ratings require triangulation with structured behavioural interview before final HR decision. Composite index weightings are derived from published meta-analytic evidence. Copyright: Carnelian Pvt Ltd. Licensed use only.
          </div>

          <div className="no-print" style={{display:'flex', gap:'12px', marginTop:'24px'}}>
            <button onClick={()=>window.print()} style={{padding:'12px 24px', borderRadius:'8px', background:T.t0, color:T.bg0, border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'800'}}>🖨 Print / Save as PDF</button>
          </div>

        </div>
      );
    })()}

{/* ─── TAB 3: PLAYER REPORT (GAMIFIED) ─── */}
      {resTab === 'player' && (() => {
        // Game Engine Math
        const SKILLS = [
          {k:'C', l:'Delivery Drive', i:'⚡', v:S.C}, {k:'O', l:'Innovation Force', i:'💡', v:S.O},
          {k:'E', l:'Social Power', i:'🔥', v:S.E}, {k:'A', l:'Alliance Skill', i:'🤝', v:S.A},
          {k:'ES', l:'Resilience Core', i:'🛡', v:S.ES}, {k:'CQavg', l:'Cultural IQ', i:'🌐', v:S.CQavg},
          {k:'OCBavg', l:'Team Spirit', i:'👥', v:S.OCBavg}, {k:'LAavg', l:'Learn Speed', i:'📚', v:S.LAavg},
          {k:'EOavg', l:'Integrity', i:'⚖️', v:S.EOavg}
        ];
        const baseXP = Math.round(SKILLS.reduce((a,s)=>a+s.v,0)*10);
        const compVals = [CI.CII,CI.LRS,CI.TVS,CI.ADS,CI.SES,CI.OPS,CI.PMS];
        const compBonus = Math.round((compVals.reduce((a,v)=>a+(v||0),0)/compVals.length)*50);
        const patBonus = (patterns||[]).filter(p=>p.sev==='pos').length * 500;
        const earnedXP = baseXP + compBonus + patBonus;

        const LEVELS = [
          {n:1,l:'NOVICE',min:0}, {n:2,l:'APPRENTICE',min:5000}, {n:3,l:'PRACTITIONER',min:8000},
          {n:4,l:'PROFESSIONAL',min:11000}, {n:5,l:'ADVANCED',min:14000}, {n:6,l:'SENIOR',min:17000},
          {n:7,l:'EXPERT',min:20000}, {n:8,l:'MASTER',min:23000}, {n:9,l:'ELITE',min:26000}, {n:10,l:'LEGEND',min:29000}
        ];
        
        let verifiedXP = 0;
        Object.values(evState).forEach(e => verifiedXP += (e.xp || 0));
        const totalXP = earnedXP + verifiedXP;
        const currentLevel = [...LEVELS].reverse().find(l => totalXP >= l.min) || LEVELS[0];
        const nextLevel = LEVELS[currentLevel.n] || currentLevel;
        const xpToNext = nextLevel.min > totalXP ? nextLevel.min - totalXP : 0;
        const levelPct = nextLevel.min > currentLevel.min ? Math.round(((totalXP - currentLevel.min)/(nextLevel.min - currentLevel.min))*100) : 100;

        // Calculate max possible XP for the Command Centre
        const maxQuestXP = devAreas.length * 500;
        const maxPowerUpXP = resources.reduce((a,r) => a + (r.type==='research'?500:r.type==='book'?300:200), 0);
        const maxBadgeXP = [
          {cond:S.C>=75, xp:300}, {cond:S.O>=75, xp:300}, {cond:S.E>=75, xp:200}, {cond:S.A>=75, xp:200},
          {cond:S.ES>=75, xp:300}, {cond:S.CQavg>=75, xp:400}, {cond:S.OCBavg>=75, xp:300}, {cond:S.LAavg>=75, xp:400},
          {cond:S.EOavg>=75, xp:500}, {cond:CI.CII>=80, xp:400}, {cond:CI.LRS>=75, xp:500}, {cond:patBonus>0, xp:600}
        ].filter(a=>a.cond).reduce((a,b)=>a+b.xp, 0);
        const totalPossible = earnedXP + maxBadgeXP + maxQuestXP + maxPowerUpXP;
        const earnedPct = Math.round((totalXP / Math.max(totalPossible, 1)) * 100);

        return (
        <div className="anim-fadeUp">
          {/* Hero Card */}
          <div style={{background:`linear-gradient(135deg, ${T.bg1} 0%, ${T.bg2} 100%)`, border:`1px solid ${T.c}40`, borderRadius:'16px', padding:'40px', marginBottom:'24px', position:'relative', overflow:'hidden', boxShadow:`0 0 30px ${T.cGlow}`}}>
            <div style={{position:'absolute', top:'-50%', left:'-50%', width:'200%', height:'200%', background:`radial-gradient(ellipse at center, ${T.cGlow} 0%, transparent 60%)`, pointerEvents:'none'}} />
            <div style={{display:'flex', alignItems:'flex-start', gap:'24px', flexWrap:'wrap', position:'relative', zIndex:1}}>
              <div style={{fontSize:'4rem', filter:`drop-shadow(0 0 12px ${T.c})`, animation:'g-float 3s ease-in-out infinite'}}>
                {profile.tier===1?'👑':profile.tier===2?'⚔️':profile.tier===3?'✨':'🌟'}
              </div>
              <div style={{flex:1}}>
                <div className="mono" style={{fontSize:'10px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.12em', color:T.c, marginBottom:'8px'}}>
                  {profile.tier===1?'LEGENDARY CLASS':profile.tier===2?'ELITE CLASS':profile.tier===3?'SPECIALIST CLASS':'ADVENTURER CLASS'} · CORE
                </div>
                <div className="serif" style={{fontSize:'2.2rem', fontWeight:'700', color:T.t0, lineHeight:'1.1', marginBottom:'8px'}}>{R.name}</div>
                <div style={{fontSize:'14px', color:T.t2, marginBottom:'20px', fontWeight:'600'}}>{profile.name}</div>
                
                <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'12px'}}>
                  <div style={{background:`${T.c}20`, color:T.c, border:`1px solid ${T.c}50`, padding:'6px 16px', borderRadius:'100px', fontSize:'11px', fontWeight:'800', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                    LV {currentLevel.n} {currentLevel.l}
                  </div>
                  <div className="mono" style={{fontSize:'13px', color:T.t2}}>
                    <span style={{color:T.c, fontWeight:'800'}}>{totalXP.toLocaleString()}</span> XP
                  </div>
                  {xpToNext > 0 && <div style={{fontSize:'11px', color:T.t3}}>{xpToNext.toLocaleString()} XP to LV {currentLevel.n + 1}</div>}
                </div>
                
                <div style={{width:'100%', maxWidth:'400px', height:'10px', background:T.b1, borderRadius:'100px', overflow:'hidden'}}>
                  <div style={{width:`${levelPct}%`, height:'100%', background:`linear-gradient(90deg, ${T.c}, ${T.gold})`, borderRadius:'100px', boxShadow:`0 0 8px ${T.c}`}} />
                </div>
              </div>
              
              <div style={{display:'flex', flexDirection:'column', gap:'12px', minWidth:'100px'}}>
                <div style={{background:T.b0, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'14px', textAlign:'center'}}>
                  <div className="mono" style={{fontSize:'1.6rem', fontWeight:'800', color:T.c}}>{S.overall}</div>
                  <div style={{fontSize:'10px', color:T.t3, marginTop:'4px', fontWeight:'700'}}>POWER</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Board */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
              <span style={{fontSize:'20px'}}>⚔️</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>SKILL BOARD</h3>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'16px'}}>
              {SKILLS.map((sk, idx) => {
                const lvl = Math.floor(sk.v/10);
                const col = sk.v>=75 ? T.gold : sk.v>=55 ? T.c : T.rd;
                const status = sk.v>=90 ? 'MAXED' : sk.v>=75 ? 'STRONG' : sk.v>=55 ? 'LEVELING' : 'NEEDS XP';
                return (
                  <div key={idx} style={{background:T.b0, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <span style={{fontSize:'13px', fontWeight:'700', color:T.t0}}>{sk.i} {sk.l}</span>
                      <span className="mono" style={{fontSize:'11px', fontWeight:'700', color:col}}>LV{lvl}</span>
                    </div>
                    <div style={{height:'6px', background:T.b1, borderRadius:'100px', overflow:'hidden', marginBottom:'8px'}}>
                      <div style={{height:'100%', width:`${sk.v}%`, background:`linear-gradient(90deg, ${col}, ${col}80)`, borderRadius:'100px'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'10px', fontWeight:'800', color:col}}>{status}</span>
                      <span className="mono" style={{fontSize:'10px', color:T.t3}}>{sk.v}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Wall */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
              <span style={{fontSize:'20px'}}>🏆</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>ACHIEVEMENTS UNLOCKED</h3>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px'}}>
              {[
                {cond:S.C>=75, i:'⚡', n:'IRON WILL', d:'Delivery you can count on.', c:'#FBBF24', xp:300},
                {cond:S.O>=75, i:'💡', n:'BRIGHT MIND', d:'Rare intellectual curiosity.', c:'#A78BFA', xp:300},
                {cond:S.E>=75, i:'🔥', n:'SOCIAL FLAME', d:'Natural command presence.', c:'#F472B6', xp:200},
                {cond:S.A>=75, i:'🤝', n:'ALLIANCE BUILDER', d:'People trust you instinctively.', c:'#4ADE80', xp:200},
                {cond:S.ES>=75, i:'🛡', n:'UNBREAKABLE', d:'Composure under fire.', c:'#38BDF8', xp:300},
                {cond:S.CQavg>=75, i:'🌐', n:'CULTURE MASTER', d:'Operating across boundaries.', c:'#38BDF8', xp:400},
                {cond:S.OCBavg>=75, i:'👥', n:'TEAM ANCHOR', d:'Your presence lifts the team.', c:'#FB7185', xp:300},
                {cond:S.LAavg>=75, i:'📚', n:'FAST LEARNER', d:'You outgrow roles.', c:'#E879F9', xp:400},
                {cond:S.EOavg>=75, i:'⚖️', n:'INTEGRITY LOCK', d:'Rare and trusted.', c:'#FBBF24', xp:500},
                {cond:CI.CII>=80, i:'🏛', n:'COMPLIANCE SHIELD', d:'Trusted in fiduciary roles.', c:'#FBBF24', xp:400},
                {cond:CI.LRS>=75, i:'👑', n:'LEADERSHIP READY', d:'Senior accountability awaits.', c:'#FBBF24', xp:500},
                {cond:patBonus>0, i:'🌠', n:'RARE PATTERN', d:'Elite cross-dimensional pattern.', c:'#E879F9', xp:600}
              ].filter(a=>a.cond).map((a, i) => (
                <div key={i} style={{background:T.b0, border:`1px solid ${a.c}40`, borderRadius:'10px', padding:'16px', textAlign:'center', boxShadow:`0 0 12px ${a.c}10`}}>
                  <div style={{fontSize:'28px', marginBottom:'8px', filter:`drop-shadow(0 0 6px ${a.c})`}}>{a.i}</div>
                  <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:a.c, marginBottom:'4px'}}>{a.n}</div>
                  <div style={{fontSize:'11px', color:T.t2, marginBottom:'8px'}}>{a.d}</div>
                  <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.gn}}>+{a.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quests */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <span style={{fontSize:'20px'}}>🎯</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>ACTIVE QUESTS</h3>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'24px', lineHeight:'1.6'}}>Each quest is a development dimension where your score is below threshold. Complete objectives in the real world to earn XP.</p>
            
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {devAreas.length > 0 ? devAreas.map((d, i) => {
                const questXpTotal = 500;
                const habits = d.habits || [];
                const stepXp = Math.round(questXpTotal / (habits.length || 10));
                let completedCount = 0;
                
                habits.forEach((h, j) => {
                  if (evState[`q_${i}_${j}`]) completedCount++;
                });
                
                const questPct = Math.round((completedCount / (habits.length || 1)) * 100);
                const isComplete = habits.length > 0 && completedCount === habits.length;

                return (
                <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                    <div style={{fontSize:'14px', fontWeight:'700', color:T.t0}}>{d.dim.toUpperCase()} QUEST</div>
                    <div style={{textAlign:'right'}}>
                      <div className="mono" style={{fontSize:'12px', fontWeight:'800', color:isComplete?T.gn:T.c}}>{completedCount}/{habits.length}</div>
                      <div style={{height:'4px', width:'60px', background:T.b1, borderRadius:'100px', marginTop:'4px', overflow:'hidden'}}>
                        <div style={{height:'100%', width:`${questPct}%`, background:isComplete?T.gn:T.c, borderRadius:'100px', transition:'width 0.3s'}} />
                      </div>
                    </div>
                  </div>
                  <div style={{fontSize:'12px', color:T.t2, marginBottom:'16px'}}>Difficulty: <span style={{color:T.gold}}>★★★☆☆</span> · Reward: <span style={{color:T.gn, fontWeight:'700'}}>+{questXpTotal} XP</span></div>
                  
                  <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                    {habits.map((h, j) => {

                      const isDone = !!evState[`q_${i}_${j}`];
                      return (
                        <div key={j} onClick={() => openEvidenceModal(`q_${i}_${j}`, stepXp, 'quest', `${d.dim} Quest`, `Step ${j+1} of 10`, h.t)} style={{display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px', background:isDone?T.gnP:T.bg3, borderRadius:'8px', border:`1px solid ${isDone?T.gn:T.b1}`, cursor:'pointer', transition:'all 0.2s'}}>
                          <div style={{width:'20px', height:'20px', borderRadius:'50%', border:`2px solid ${isDone?T.gn:T.b2}`, background:isDone?T.gn:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            {isDone && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'10px', fontWeight:'800', color:isDone?T.gn:T.t3, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'2px'}}>STEP {j+1}</div>
                            <div style={{fontSize:'12.5px', color:isDone?T.gn:T.t1, lineHeight:'1.5', textDecoration:isDone?'line-through':'none'}}><strong style={{color:isDone?T.gn:T.t0}}>{h.h}</strong> {h.t}</div>
                          </div>
                          <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:isDone?T.gn:T.t3}}>+{stepXp} XP</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}) : (
                <div style={{padding:'24px', background:T.gnP, borderRadius:'10px', color:T.gn, fontSize:'13px', fontWeight:'600'}}>
                  No active quests! Your profile is highly balanced. Seek out "Guild Missions" (advanced training) to continue leveling up.
                </div>
              )}
            </div>
          </div>

          {/* Power-Up Armory */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <span style={{fontSize:'20px'}}>⚡</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>POWER-UP ARMORY</h3>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'24px', lineHeight:'1.6'}}>Click a resource to mark it collected and earn XP. Legendary items yield the highest rewards.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {resources.map((r, i) => {
                const isCollected = !!evState[`pu_${i}`];
                const xpReward = r.type==='research'?500:r.type==='book'?300:200;
                return (
                  <div key={i} onClick={()=>openEvidenceModal(`pu_${i}`, xpReward, r.type, r.title, r.author, r.why)} style={{background:isCollected?T.gnP:T.bg2, border:`1px solid ${isCollected?T.gn:T.b1}`, borderRadius:'10px', padding:'16px', cursor:'pointer', transition:'all 0.2s', opacity:isCollected?0.6:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                      <div>
                        <div className="mono" style={{fontSize:'9px', fontWeight:'800', color:isCollected?T.gn:T.c, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px'}}>{r.type} · {r.type==='research'?'LEGENDARY':r.type==='book'?'RARE':'UNCOMMON'}</div>
                        <div style={{fontSize:'14px', fontWeight:'700', color:isCollected?T.gn:T.t0, marginBottom:'4px'}}>{isCollected?'✅ ':''}{r.title}</div>
                        <div style={{fontSize:'12px', color:T.t1, lineHeight:'1.5'}}>{r.why}</div>
                      </div>
                      <div className="mono" style={{fontSize:'12px', fontWeight:'800', color:isCollected?T.gn:T.gold}}>+{xpReward} XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guild Missions */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <span style={{fontSize:'20px'}}>🏛</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>CARNELIAN GUILD MISSIONS</h3>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'24px', lineHeight:'1.6'}}>Guild Missions are structured training programmes that boost specific skill nodes. Commission one through your organisation.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {programs.map((p, i) => (
                <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:'700', color:T.gold, marginBottom:'4px'}}>{p.name}</div>
                    <div style={{fontSize:'12px', color:T.t1}}>{p.desc}</div>
                  </div>
                  <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.t3, background:T.b0, padding:'6px 12px', borderRadius:'6px'}}>GUILD MISSION</div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Command Centre */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
              <span style={{fontSize:'20px'}}>📊</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>XP COMMAND CENTRE</h3>
            </div>
<div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px'}}>              {[
                ['XP Earned (Scores)', earnedXP, '#60A5FA'],
                ['XP Earned (Badges)', maxBadgeXP, '#4ADE80'],
                ['XP Earned (Quests)', Object.keys(evState).filter(k=>k.startsWith('q_')).reduce((a,k)=>a+evState[k].xp,0), '#E879F9'],
                ['XP Earned (Power-Ups)', Object.keys(evState).filter(k=>k.startsWith('pu_')).reduce((a,k)=>a+evState[k].xp,0), '#FBBF24'],
                ['TOTAL XP', totalXP, T.c],
                ['Max Possible XP', totalPossible, T.t3]
              ].map((r, i) => (
                <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'12px', color:T.t2, fontWeight:'600'}}>{r[0]}</span>
                  <span className="mono" style={{fontSize:'16px', fontWeight:'800', color:r[2]}}>{r[1].toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{marginBottom:'6px',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'12px',color:T.t2}}>Overall completion</span><span className="mono" style={{fontSize:'12px',color:T.c}}>{earnedPct}%</span></div>
            <div style={{height:'8px', background:T.b1, borderRadius:'100px', overflow:'hidden'}}>
              <div style={{height:'100%', width:`${earnedPct}%`, background:`linear-gradient(90deg,${T.c},${T.gold})`, borderRadius:'100px'}} />
            </div>
          </div>

          {/* Evidence Wall */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <span style={{fontSize:'20px'}}>📝</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>EVIDENCE WALL</h3>
            </div>
            {Object.keys(evState).length === 0 ? (
              <div style={{background:T.amP, border:`1px dashed ${T.am}50`, borderRadius:'10px', padding:'32px', textAlign:'center'}}>
                <div style={{fontSize:'32px', marginBottom:'12px'}}>🔒</div>
                <div style={{fontSize:'14px', fontWeight:'700', color:T.am, marginBottom:'8px'}}>No Evidence Submitted Yet</div>
                <div style={{fontSize:'13px', color:T.t2}}>Your assessment score is locked. To upgrade your level, you must prove you acted on the report by collecting Power-Ups and completing Quests.</div>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {Object.entries(evState).map(([k, e], i) => (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.gn}40`, borderLeft:`4px solid ${T.gn}`, borderRadius:'8px', padding:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                      <div className="mono" style={{fontSize:'10px', fontWeight:'800', color:T.gn}}>VERIFIED ACTION</div>
                      <div className="mono" style={{fontSize:'12px', fontWeight:'800', color:T.gn}}>+{e.xp} XP</div>
                    </div>
                    <div style={{fontSize:'13px', color:T.t1}}>Completed on {new Date(e.ts).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Re-assessment Readiness */}
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'32px 36px', marginBottom:'24px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <span style={{fontSize:'20px'}}>⏰</span>
              <h3 className="serif" style={{fontSize:'1.3rem', fontWeight:'700', color:T.t0}}>RE-ASSESSMENT READINESS</h3>
            </div>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'20px', lineHeight:'1.6'}}>Retaking too soon produces measurement noise. Retaking too late means your development investment goes unmeasured.</p>
            <div style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'24px'}}>
              <div style={{fontSize:'16px', fontWeight:'700', color:T.rd, marginBottom:'12px'}}>⏳ Too Early to Re-assess</div>
              <div style={{height:'8px', background:T.b1, borderRadius:'100px', overflow:'hidden', marginBottom:'16px'}}>
                <div style={{height:'100%', width:'10%', background:T.rd, borderRadius:'100px'}} />
              </div>
              <div style={{fontSize:'13px', color:T.t1, lineHeight:'1.6'}}>Re-assessment requires a minimum 4-month gap from your original assessment. Re-testing sooner produces noise rather than real change signal. Keep submitting evidence.</div>
            </div>
          </div>

        </div>
        );
      })()}

      {/* ── EVIDENCE MODAL ── */}
      {evModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}} onClick={()=>setEvModal(null)}>
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', width:'100%', maxWidth:'500px', padding:'24px', boxShadow:`0 20px 40px rgba(0,0,0,0.5)`}} onClick={e=>e.stopPropagation()}>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
              <div>
                <div className="mono" style={{fontSize:'10px', color:evModal.mode==='review'?T.gn:T.c, fontWeight:'800', letterSpacing:'0.1em', marginBottom:'4px'}}>
                  {evModal.mode==='review' ? '✅ EVIDENCE VERIFIED' : 'SUBMIT EVIDENCE'} · +{evModal.xp} XP
                </div>
                <div className="serif" style={{fontSize:'1.4rem', fontWeight:'700', color:T.t0}}>{evModal.title}</div>
                <div style={{fontSize:'12px', color:T.t2, marginTop:'4px'}}>{evModal.subtitle}</div>
              </div>
              <button onClick={()=>setEvModal(null)} style={{background:'transparent', border:'none', color:T.t3, fontSize:'24px', cursor:'pointer'}}>×</button>
            </div>

            {evModal.mode === 'submit' ? (
              <>
                <div style={{background:T.bg2, padding:'12px', borderRadius:'8px', borderLeft:`3px solid ${T.gold}`, fontSize:'12px', color:T.t1, marginBottom:'20px', lineHeight:'1.5'}}>
                  {evModal.objText}
                </div>

                {evModal.type === 'book' && (
                  <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px'}}>
                    <textarea placeholder="Direct quote from the book..." rows={3} value={evInput.quote} onChange={e=>setEvInput({...evInput, quote:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                    <input placeholder="Page number" value={evInput.page} onChange={e=>setEvInput({...evInput, page:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                    <textarea placeholder="Your biggest takeaway..." rows={2} value={evInput.takeaway} onChange={e=>setEvInput({...evInput, takeaway:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                  </div>
                )}
                {(evModal.type === 'ted' || evModal.type === 'youtube') && (
                  <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px'}}>
                    <input placeholder="Timestamp (e.g. 08:34)" value={evInput.timestamp} onChange={e=>setEvInput({...evInput, timestamp:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                    <textarea placeholder="The key insight in your own words..." rows={3} value={evInput.insight} onChange={e=>setEvInput({...evInput, insight:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                  </div>
                )}
                {evModal.type === 'research' && (
                  <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px'}}>
                    <input placeholder="Paper Title or DOI" value={evInput.ref} onChange={e=>setEvInput({...evInput, ref:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                    <textarea placeholder="One key finding that changes how you work..." rows={3} value={evInput.finding} onChange={e=>setEvInput({...evInput, finding:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                  </div>
                )}
                {evModal.type === 'quest' && (
                  <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px'}}>
                    <textarea placeholder="Your reflection or action log..." rows={4} value={evInput.reflection} onChange={e=>setEvInput({...evInput, reflection:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                    <input type="date" value={evInput.date} onChange={e=>setEvInput({...evInput, date:e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'6px', background:T.bg3, border:`1px solid ${T.b2}`, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px'}} />
                  </div>
                )}

                {/* File Upload Input */}
                <div style={{marginBottom:'24px'}}>
                  <label style={{fontSize:'12px', color:T.t1, fontWeight:'600', display:'block', marginBottom:'8px'}}>Upload Proof (Image/PDF, max 2.5MB)</label>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{width:'100%', padding:'10px', background:T.bg3, color:T.t0, borderRadius:'6px', border:`1px solid ${T.b2}`, fontSize:'12px'}} />
                  {evInput.fileName && <div style={{fontSize:'11px', color:T.gn, marginTop:'6px', fontWeight:'700'}}>Attached: {evInput.fileName}</div>}
                </div>

                <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                  <button onClick={()=>setEvModal(null)} style={{padding:'10px 16px', borderRadius:'6px', background:'transparent', border:`1px solid ${T.b2}`, color:T.t2, cursor:'pointer', fontWeight:'600'}}>Cancel</button>
                  <button onClick={submitEvidence} style={{padding:'10px 16px', borderRadius:'6px', background:T.c, border:'none', color:'#fff', cursor:'pointer', fontWeight:'700'}}>Submit & Earn XP</button>
                </div>
              </>
            ) : (
              <>
                <div style={{background:T.gnP, border:`1px solid ${T.gn}40`, padding:'16px', borderRadius:'8px', fontSize:'13px', color:T.t1, lineHeight:'1.6', marginBottom:'20px'}}>
                  {evModal.type === 'book' && <><p><strong>Quote (p.{evModal.data.page}):</strong><br/>"{evModal.data.quote}"</p><p style={{marginTop:'8px'}}><strong>Takeaway:</strong> {evModal.data.takeaway}</p></>}
                  {(evModal.type === 'ted' || evModal.type === 'youtube') && <><p><strong>Timestamp:</strong> {evModal.data.timestamp}</p><p style={{marginTop:'8px'}}><strong>Insight:</strong> {evModal.data.insight}</p></>}
                  {evModal.type === 'research' && <><p><strong>Reference:</strong> {evModal.data.ref}</p><p style={{marginTop:'8px'}}><strong>Finding:</strong> {evModal.data.finding}</p></>}
                  {evModal.type === 'quest' && <><p><strong>Reflection:</strong> {evModal.data.reflection}</p><p style={{marginTop:'8px'}}><strong>Date:</strong> {evModal.data.date}</p></>}
                </div>
                <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                  <button onClick={()=>setEvModal(null)} style={{padding:'10px 16px', borderRadius:'6px', background:'transparent', border:`1px solid ${T.b2}`, color:T.t2, cursor:'pointer', fontWeight:'600'}}>Close</button>
                  <button onClick={revokeEvidence} style={{padding:'10px 16px', borderRadius:'6px', background:T.rdP, border:`1px solid ${T.rd}40`, color:T.rd, cursor:'pointer', fontWeight:'700'}}>Revoke & Return XP</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 4: TEAM AGGREGATE ─── */}
{/* ─── TAB 4: TEAM AGGREGATE ─── */}
      {resTab === 'team' && (() => {
        const safeBatch = batchData || [];
        const valid = safeBatch.filter(b => b && b.validityOverall !== 'red' && b.scores) || [];
        
        if (valid.length < 2) {
          return (
            <div className="anim-fadeUp">
              <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px'}}>
                <h2 className="serif" style={{fontSize:'2rem', fontWeight:'700', color:T.t0, marginBottom:'16px'}}>Team Aggregate Profile</h2>
                <div style={{padding:'24px', background:T.amP, borderRadius:'8px', border:`1px solid ${T.am}40`, color:T.am, fontSize:'14px', fontWeight:'600', lineHeight:'1.6'}}>
                  <span style={{fontSize:'24px', display:'block', marginBottom:'12px'}}>👥</span>
                  <strong>Not enough data to generate this report.</strong><br/><br/>
                  The Team Aggregate Report requires at least <strong>2 valid assessments</strong> from the same batch. To see this report, make sure you enter an "Assessment Batch Name" on the first screen, and have multiple people complete the assessment on this device.
                </div>
              </div>
            </div>
          );
        }

        // Archetype Distribution
        const archCounts = {};
        safeBatch.forEach(b => { 
          if(b && b.profile) archCounts[b.profile] = (archCounts[b.profile]||0) + 1; 
        });
        const archSorted = Object.entries(archCounts).sort((a,b)=>b[1]-a[1]);

        // Risk Pattern Frequency
        const riskCounts = {
          'Performance-Ethics Disconnect': valid.filter(b=>b.scores?.C>=68 && b.scores?.EOavg<=60).length,
          'Direct Compliance Risk':        valid.filter(b=>b.scores?.EO_RC<55).length,
          'Charismatic Integrity Risk':    valid.filter(b=>b.scores?.E>=70 && b.scores?.EO_AI<=60).length,
          'Visible and Volatile':          valid.filter(b=>b.scores?.ES<=60 && b.scores?.E>=65).length,
          'Talented Maverick':             valid.filter(b=>b.scores?.LAavg>=70 && b.scores?.EOavg<=60).length,
        };
        const riskEntries = Object.entries(riskCounts).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);

        return (
        <div className="anim-fadeUp">
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px'}}>
              <div>
                <div className="serif" style={{fontSize:'16px', color:T.gold, letterSpacing:'0.06em', marginBottom:'4px'}}>CORE · Carnelian Pvt Ltd</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3}}>TEAM AGGREGATE REPORT · Batch: {R.batch}</div>
              </div>
              <div style={{textAlign:'right', fontSize:'12px', color:T.t2}}>
                <div>{safeBatch.length} total responses</div>
                {R.industry && <div>{IND[R.industry]?.icon} {IND[R.industry]?.short}</div>}
              </div>
            </div>
            <h2 className="serif" style={{fontSize:'2rem', fontWeight:'700', color:T.t0, marginBottom:'24px'}}>Team Aggregate Profile</h2>
            
<div className="grid-5-col" style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', background:T.bg2, borderRadius:'10px', padding:'20px', marginBottom:'32px'}}>              {['OCEANavg', 'CQavg', 'OCBavg', 'LAavg', 'EOavg'].map((k, i) => {
                const avg = Math.round(safeBatch.reduce((sum, b) => sum + (b?.scores?.[k] || 0), 0) / (safeBatch.length || 1));
                const labels = ['Personality', 'Cultural IQ', 'Citizenship', 'Learning', 'Integrity'];
                return (
                  <div key={i} style={{textAlign:'center'}}>
                    <div className="serif" style={{fontSize:'1.8rem', fontWeight:'700', color:T.gold}}>{avg}</div>
                    <div style={{fontSize:'10px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px'}}>{labels[i]}</div>
                  </div>
                );
              })}
            </div>

            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Team Dimension Averages</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 32px', marginBottom:'40px'}}>
              {['C','O','E','A','ES','CQavg','OCBavg','LAavg','EOavg'].map((k, i) => {
                const avg = Math.round(safeBatch.reduce((sum, b) => sum + (b?.scores?.[k] || 0), 0) / (safeBatch.length || 1));
                const labels = ['Conscientiousness','Openness','Social Confidence','Agreeableness','Emotional Resilience','Cultural Intelligence','Team Citizenship','Learning Agility','Ethical Integrity'];
                return (
                  <div key={i} style={{marginBottom:'8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                      <span style={{fontSize:'13px', fontWeight:'700', color:T.t0}}>{labels[i]}</span>
                      <span className="mono" style={{fontSize:'12px', fontWeight:'800', color:bCol(avg)}}>{avg}/100</span>
                    </div>
                    <Bar score={avg} w="100%" h={8} />
                  </div>
                );
              })}
            </div>

            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Archetype Distribution</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'12px', marginBottom:'40px'}}>
              {archSorted.map(([name, count], i) => {
                const pct = Math.round((count / (safeBatch.length || 1)) * 100);
                return (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px', borderLeft:`4px solid ${T.c}`}}>
                    <div style={{fontSize:'13px', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>{name}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <div style={{flex:1, height:'6px', background:T.b1, borderRadius:'100px', overflow:'hidden'}}>
                        <div style={{height:'100%', width:`${pct}%`, background:T.c, borderRadius:'100px'}} />
                      </div>
                      <span className="mono" style={{fontSize:'11px', color:T.t2, fontWeight:'700'}}>{count} ({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Risk Pattern Frequency</h3>
            {riskEntries.length > 0 ? (
              <div style={{display:'flex', flexDirection:'column', gap:'8px', marginBottom:'40px'}}>
                {riskEntries.map(([name, count], i) => {
                  const pct = Math.round((count / (valid.length || 1)) * 100);
                  const isHigh = pct >= 20;
                  return (
                    <div key={i} style={{background:isHigh?T.rdP:T.bg2, border:`1px solid ${isHigh?T.rd:T.b1}40`, borderRadius:'8px', padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <div style={{fontSize:'14px', fontWeight:'700', color:isHigh?T.rd:T.t0}}>{name}</div>
                        <div style={{fontSize:'12px', color:T.t2}}>{isHigh ? 'Programme-level intervention recommended' : 'Monitor — consider targeted coaching'}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:'18px', fontWeight:'800', color:isHigh?T.rd:T.am}}>{count}</div>
                        <div style={{fontSize:'10px', color:T.t3}}>{pct}% of valid</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{padding:'16px', background:T.gnP, borderRadius:'8px', color:T.gn, fontSize:'13px', fontWeight:'600', marginBottom:'40px'}}>
                No risk patterns detected across this batch at alerting frequency.
              </div>
            )}

            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Respondent Summary</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              {[...safeBatch].sort((a,b)=>(b?.scores?.overall||0)-(a?.scores?.overall||0)).map((b, i) => (
                <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px'}}>
                  <div>
                    <div style={{fontSize:'13px', fontWeight:'700', color:T.t0}}>{b?.name || 'Unknown'}</div>
                    <div style={{fontSize:'11px', color:T.t3}}>{b?.profile || 'No Profile'}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="mono" style={{fontSize:'14px', fontWeight:'800', color:b?.validityOverall==='red'?T.rd:T.gold}}>{b?.scores?.overall || '—'}</div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:b?.validityOverall==='green'?T.gn:b?.validityOverall==='amber'?T.am:T.rd, textTransform:'uppercase'}}>{b?.validityOverall || 'UNKNOWN'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        );
      })()}

      

      {/* ─── TAB 5: TEAM COMPOSITION ─── */}
      {resTab === 'comp' && (() => {
        const safeBatch = batchData || [];
        const valid = safeBatch.filter(b => b && b.validityOverall !== 'red' && b.scores) || [];
        
        if(valid.length < 2) {
          return (
            <div className="anim-fadeUp">
              <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px'}}>
                <h2 className="serif" style={{fontSize:'2rem', fontWeight:'700', color:T.t0, marginBottom:'16px'}}>Team Composition & Hiring Intelligence</h2>
                <div style={{padding:'24px', background:T.amP, borderRadius:'8px', border:`1px solid ${T.am}40`, color:T.am, fontSize:'14px', fontWeight:'600', lineHeight:'1.6'}}>
                  <span style={{fontSize:'24px', display:'block', marginBottom:'12px'}}>🧩</span>
                  <strong>Not enough data to generate this report.</strong><br/><br/>
                  The Team Composition Report requires at least <strong>2 valid assessments</strong> from the same batch. To see this report, make sure you enter an "Assessment Batch Name" on the first screen, and have multiple people complete the assessment on this device.
                </div>
              </div>
            </div>
          );
        }

        // Averages
        const dimKeys = ['O','C','E','A','ES','CQavg','OCBavg','LAavg','EOavg'];
        const dimLabels = {O:'Openness',C:'Conscientiousness',E:'Extraversion',A:'Agreeableness',ES:'Emotional Stability',CQavg:'Cultural Intelligence',OCBavg:'Team Citizenship',LAavg:'Learning Agility',EOavg:'Ethical Orientation'};
        const teamAvg = {};
        dimKeys.forEach(k => { teamAvg[k] = Math.round(valid.reduce((a,b)=>a+(b?.scores?.[k]||0),0)/(valid.length || 1)); });

        // Findings
        const findings = [];
        dimKeys.forEach(k => {
          if(teamAvg[k] < 50) findings.push({sev:'critical', t:`Team ${dimLabels[k]} is critically low (avg ${teamAvg[k]})`, d:`This is a collective gap. The team will struggle with tasks requiring ${dimLabels[k]}.`});
          else if(teamAvg[k] < 60) findings.push({sev:'watch', t:`Team ${dimLabels[k]} is below optimal (avg ${teamAvg[k]})`, d:`Performance may be adequate today but fragile under pressure or change.`});
          else if(teamAvg[k] >= 75) findings.push({sev:'strength', t:`Team ${dimLabels[k]} is a collective strength (avg ${teamAvg[k]})`, d:`This is a competitive advantage. Protect and leverage it.`});
        });

        // Hiring Profile
        const dimGaps = dimKeys.map(k => ({k, l:dimLabels[k], v:teamAvg[k], gap:Math.max(0, 65-(teamAvg[k]||0))})).filter(g => g.gap > 0).sort((a,b)=>b.gap - a.gap).slice(0, 4);

        // Promotion Fit
        const ROLE_TARGETS = [
          {name:'Senior Manager', targets:{LRS:[65,95],ES:[60,90],C:[60,90],EOavg:[60,90]}},
          {name:'Team Lead', targets:{OCBavg:[60,95],A:[60,90],C:[55,85],E:[55,85]}},
          {name:'Compliance Officer', targets:{CII:[70,100],EOavg:[70,95],C:[65,95]}},
          {name:'Client-Facing Manager', targets:{E:[65,95],CQavg:[60,90],A:[60,90],SES:[60,95]}},
          {name:'Change Leader', targets:{ADS:[65,95],O:[65,95],LAavg:[65,95]}}
        ];
        const targetRole = ROLE_TARGETS[promoRole] || ROLE_TARGETS[0];
        
        const scoredCandidates = valid.map(b => {
          let match = 0, count = 0;
          Object.entries(targetRole.targets).forEach(([k, [min, max]]) => {
            const v = b?.scores?.[k] || (b?.composites && b?.composites?.[k]);
            if(v != null) { count++; if(v >= min && v <= max) match++; else if(v >= min-10) match+=0.5; }
          });
          return { ...b, fitPct: count>0 ? Math.round((match/count)*100) : 0 };
        }).sort((a,b) => b.fitPct - a.fitPct);

        return (
        <div className="anim-fadeUp">
          <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'36px', marginBottom:'24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px'}}>
              <div>
                <div className="serif" style={{fontSize:'16px', color:T.gold, letterSpacing:'0.06em', marginBottom:'4px'}}>CORE · Carnelian Pvt Ltd</div>
                <div className="mono" style={{fontSize:'10px', color:T.t3}}>TEAM COMPOSITION REPORT · Batch: {R.batch}</div>
              </div>
              <div style={{textAlign:'right', fontSize:'12px', color:T.t2}}>
                <div>{valid.length} valid responses</div>
              </div>
            </div>
            <h2 className="serif" style={{fontSize:'2rem', fontWeight:'700', color:T.t0, marginBottom:'24px'}}>Team Composition & Hiring Intelligence</h2>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'32px', lineHeight:'1.6'}}>HR-only strategic report — composition diagnosis, hiring profile generation, and promotion fit analysis.</p>
            
            {/* 1. Diagnostic */}
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>1. Composition Diagnostic</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'40px'}}>
              {findings.map((f, i) => {
                const col = f.sev==='critical'?T.rd:f.sev==='watch'?T.am:T.gn;
                const bg = f.sev==='critical'?T.rdP:f.sev==='watch'?T.amP:T.gnP;
                return (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderLeft:`4px solid ${col}`, borderRadius:'8px', padding:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                      <span style={{background:bg, color:col, padding:'2px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'800', textTransform:'uppercase'}}>{f.sev}</span>
                      <span style={{fontSize:'14px', fontWeight:'700', color:T.t0}}>{f.t}</span>
                    </div>
                    <div style={{fontSize:'13px', color:T.t1, lineHeight:'1.5'}}>{f.d}</div>
                  </div>
                );
              })}
            </div>

            {/* 2. Hiring Profile */}
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>2. Hiring Profile Specification</h3>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'16px'}}>Target these dimension ranges for your next hire to balance the team's current blind spots.</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'12px', marginBottom:'40px'}}>
              {dimGaps.map((g, i) => (
                <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px'}}>
                  <div style={{fontSize:'12px', fontWeight:'700', color:T.t3, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'4px'}}>{g.l}</div>
                  <div className="mono" style={{fontSize:'18px', fontWeight:'800', color:T.t0}}>≥ {Math.min(80, 75 - g.v + 10)} / 100</div>
                  <div style={{fontSize:'11px', color:T.t2, marginTop:'4px'}}>Current team avg: <span style={{color:T.rd, fontWeight:'700'}}>{g.v}</span></div>
                </div>
              ))}
            </div>

            {/* 2.5 Interview Probes */}
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>Targeted Interview Probes</h3>
            <p style={{fontSize:'13px', color:T.t2, marginBottom:'16px'}}>Use these specific questions in your next interview to test for the dimensions this team currently lacks.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'40px'}}>
              {dimGaps.slice(0,3).map((g, i) => {
                const probes = {
                  'Conscientiousness': {q:'Describe a project with multiple stakeholders and a hard deadline where something went wrong. What specifically did you do to keep it on track?', l:'Concrete structural actions, not generic "I worked harder." Look for planning and contingency thinking.'},
                  'Emotional Stability': {q:'Describe a professional setback that genuinely shook you. What happened, and what did you do in the 30 days after?', l:'Honest acknowledgment of the difficulty paired with concrete recovery actions.'},
                  'Learning Agility': {q:'Walk me through the most recent significant change in your professional knowledge or skills. What triggered it, and how did you sustain it?', l:'Self-directed learning, not mandatory training. Look for someone who names their own gaps.'},
                  'Ethical Orientation': {q:'Describe a situation where the easy path and the right path were different, and you chose the right path. What did it cost you?', l:'Real cost, specifically named. Candidates who claim there was no cost are sanitising the story.'},
                  'Openness': {q:'Tell me about a time you had to adopt an approach you initially disagreed with. What changed your mind?', l:'Evidence of genuine re-evaluation, not just compliance. Listen for intellectual humility.'},
                  'Extraversion': {q:'Tell me about a time you had to influence a room full of people who were skeptical of your position. What did you do?', l:'Specific techniques used, reading the room, and willingness to engage conflict.'},
                  'Agreeableness': {q:'Describe a situation where a peer strongly disagreed with a decision you had authority over. How did the disagreement unfold and resolve?', l:'Willingness to hear substance of the disagreement rather than deflecting it.'},
                  'Cultural Intelligence': {q:'Tell me about a time your assumptions about how a colleague would behave turned out to be wrong.', l:'Genuine recognition of the error, not performed humility. Specific behaviour change that followed.'},
                  'Team Citizenship': {q:'Tell me about something you did for your team or organisation in the last year that was not part of your formal role.', l:'Discretionary effort with specific examples. Look for initiatives that created lasting value.'}
                };
                const p = probes[g.l] || probes['Ethical Orientation'];
                return (
                  <div key={i} style={{background:T.bg2, border:`1px solid ${T.b1}`, borderLeft:`4px solid ${T.gold}`, borderRadius:'8px', padding:'16px'}}>
                    <div style={{fontSize:'11px', fontWeight:'800', color:T.gold, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px'}}>Targets: {g.l}</div>
                    <div style={{fontSize:'14px', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>"{p.q}"</div>
                    <div style={{fontSize:'13px', color:T.t1}}><strong>Listen for:</strong> {p.l}</div>
                  </div>
                );
              })}
            </div>

            {/* 3. Promotion Fit */}
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:'700',color:T.t0,marginBottom:'16px'}}>3. Promotion Fit Check</h3>
            <div style={{marginBottom:'16px'}}>
              <select value={promoRole} onChange={e=>setPromoRole(parseInt(e.target.value))} style={{padding:'10px 16px', borderRadius:'6px', border:`1px solid ${T.b2}`, background:T.bg3, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'600', outline:'none', cursor:'pointer'}}>
                {ROLE_TARGETS.map((r, i) => <option key={i} value={i}>{r.name}</option>)}
              </select>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              {scoredCandidates.map((c, i) => {
                const col = c.fitPct >= 70 ? T.gn : c.fitPct >= 50 ? T.am : T.rd;
                return (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'8px'}}>
                    <div>
                      <div style={{fontSize:'14px', fontWeight:'700', color:T.t0, marginBottom:'4px'}}>Respondent #{i+1}</div>
                      <div style={{fontSize:'12px', color:T.t2}}>{c?.profile || 'Unknown Profile'}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="mono" style={{fontSize:'18px', fontWeight:'800', color:col}}>{c.fitPct}%</div>
                      <div style={{fontSize:'10px', fontWeight:'700', color:col, textTransform:'uppercase', letterSpacing:'0.05em'}}>Fit Match</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
        );
      })()}

    </div>
  );
};

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
const ProgressPage = ({ setTab, setReportData }) => {
  const [history, setHistory] = useState([]);
const [searchEmail, setSearchEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(()=>{
    try { setHistory(JSON.parse(localStorage.getItem('core_v3_history')||'[]')); } catch(e){}
  },[]);

const handleSearch = () => {
  setSearched(true);
  const term = searchEmail.trim().toLowerCase();
  if (!term) { setResults([]); return; }
  const matches = history.filter(e => e.email && e.email.toLowerCase() === term);
  const byPerson = {};
  matches.forEach(e => {
    const pid = e.email.toLowerCase();
    if (!byPerson[pid]) byPerson[pid] = [];
    byPerson[pid].push(e);
  });
  setResults(Object.values(byPerson));
};

  const del = (pid_email) => {
  if (!window.confirm('Delete all CORE records for this person?')) return;
  const h = history.filter(e => e.email?.toLowerCase() !== pid_email.toLowerCase());
    setHistory(h);
    try { localStorage.setItem('core_v3_history', JSON.stringify(h)); } catch(e){}
const updatedResults = results.map(entries => entries.filter(e => e.email?.toLowerCase() !== pid_email.toLowerCase())).filter(arr => arr.length > 0);    setResults(updatedResults);
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
  Look up a candidate's assessment history using their <strong style={{color:T.t0}}>email address</strong>.
</p>

      <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'28px 28px', marginBottom:'32px'}}>
<div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', fontWeight:'700', color:T.c, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'16px'}}>Search by Email</div>
        <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'12px'}}>
          <input
  value={searchEmail}
  onChange={e=>setSearchEmail(e.target.value)}
  placeholder="Enter email address"
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

      {searched && results.length === 0 && (
        <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', padding:'40px', textAlign:'center'}}>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:'700', color:T.t0, marginBottom:'8px'}}>No records found</div>
          <p style={{fontSize:'13px', color:T.t2, fontWeight:'600'}}>No assessments match the email you entered.</p>
        </div>
      )}

      {results.map((entries, ri) => {
        const latest = entries[entries.length-1];
        const prev   = entries.length>=2 ? entries[entries.length-2] : null;
        const delta  = prev ? latest.scores.overall - prev.scores.overall : 0;
const pid_email = latest.email||'';

        return (
          <div key={ri} style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'12px', marginBottom:'20px', overflow:'hidden'}}>
            <div style={{background:T.bg2, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
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
              {prev&&(
                <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px'}}>
                  <div style={{background:T.bg2, borderRadius:'8px', padding:'14px 16px'}}>
                    <div className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'600'}}>Previous · {prev.date}</div>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'600', marginBottom:'5px', color:T.t0}}>{prev.profile}</div>
                    <div className="mono" style={{fontSize:'1.4rem', color:T.t3, fontWeight:'700'}}>{prev.scores.overall}/100</div>
                  </div>
                  <div style={{background:T.bg3, borderRadius:'8px', padding:'14px 16px'}}>
                    <div className="mono" style={{fontSize:'9px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'600'}}>Latest · {latest.date}</div>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:T.t0, fontWeight:'700', marginBottom:'5px'}}>{latest.profile}</div>
                    <div className="mono" style={{fontSize:'1.4rem', color:T.gold, fontWeight:'700'}}>{latest.scores.overall}/100 <span style={{fontSize:'11px', color:delta>=0?T.gn:T.rd, fontWeight:'800'}}>({delta>=0?'+':''}{delta})</span></div>
                  </div>
                </div>
              )}

              <div style={{display:'flex', flexDirection:'column', gap:'9px', marginBottom:'16px'}}>
                {compKeys.map(([k,l])=>{
                  const v=latest.scores[k];
                  const d=prev?latest.scores[k]-prev.scores[k]:null;
                  return(
                    <div key={k} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{width:'160px', fontSize:'11px', color:T.t1, flexShrink:0, fontWeight:'700'}}>{l}</div>
                      <Bar score={v} w="100%" />
                      <div className="mono" style={{fontSize:'11px', color:bCol(v), width:'28px', textAlign:'right', fontWeight:'700'}}>{v}</div>
                      {d!==null&&<div className="mono" style={{fontSize:'10px', fontWeight:'800', color:d>5?T.gn:d<-5?T.rd:T.t3, width:'48px', textAlign:'right'}}>{d>5?`▲ +${d}`:d<-5?`▼ ${d}`:'—'}</div>}
                    </div>
                  );
                })}
              </div>

<div style={{display:'flex', gap:'10px'}}>
                <button onClick={()=>{
                  if(latest.report_data) {
                    setReportData(latest.report_data);
                    setTab('results');
                  } else {
                    alert('Full report data is not available for this older record.');
                  }
                }} style={{padding:'7px 14px', borderRadius:'5px', border:'none', background:T.c, color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700', cursor:'pointer'}}>View Full Report →</button>
                <button onClick={()=>del(pid_email)} style={{padding:'7px 14px', borderRadius:'5px', border:`1px solid ${T.rdP}`, background:'transparent', color:T.rd, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700', cursor:'pointer'}}>Delete Records</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── LEGAL & PRIVACY PAGE ─────────────────────────────────────────────────────
const LegalPage = () => {
  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'80px 32px'}}>
      <Reveal delay={0.1}>
        <div>
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:'700', marginBottom:'16px', color:T.t0}}>
            Compliance & Privacy
          </h2>
          <p style={{fontSize:'15px', color:T.t2, fontWeight:'500', marginBottom:'48px', lineHeight:'1.7', maxWidth:'750px'}}>
            A plain-language summary of Carnelian's legal commitments to participants and client organisations. Full agreements can be requested separately as CORE-ICA-001 (individual) and CORE-ODPA-001 (organisational) by contacting us at hello@carnelianco.com.
          </p>

          <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'32px'}}>
            
            {/* To Participants */}
            <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'16px', padding:'40px', borderTop:`4px solid ${T.c}`}}>
              <div className="mono" style={{fontSize:'11px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:T.c, marginBottom:'24px'}}>
                To Participants · What Carnelian Commits
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'16px', fontSize:'13.5px', color:T.t1, lineHeight:'1.65', fontWeight:'500'}}>
                <div><strong style={{color:T.t0}}>What we collect:</strong> Your full name, email address, phone number, and professional details (role, department, experience, organisation) to generate your personalised report and link your results across retakes.</div>
<div><strong style={{color:T.t0}}>Why we use your email:</strong> Your email address is your unique assessment identifier. It is used solely to link your results if you retake CORE and to generate progress comparisons. It is never used for marketing.</div>
<div><strong style={{color:T.t0}}>What we never do:</strong> Sell your data. Share your identifiable results with anyone outside your assessment process. Use your email or phone number for any purpose other than assessment delivery, progress tracking, and responding to your data rights requests.</div>
<div><strong style={{color:T.t0}}>Who sees your results:</strong> The commissioning organisation's HR leadership receives the Technical Report under their confidentiality level setting. The Action Plan is written for you personally and contains no HR risk language.</div>
<div><strong style={{color:T.t0}}>AI training use:</strong> Anonymised, non-identifiable aggregated data only. Never raw responses. Never your name, email, or phone. Carnelian internal use only, never shared with third-party AI providers.</div>
<div><strong style={{color:T.t0}}>Your rights:</strong> You may request access to, correction of, or deletion of your personal data at any time by writing to hello@carnelianco.com. We will respond within 30 days. Deletion requests are processed within 45 days.</div>
<div><strong style={{color:T.t0}}>Legal protection:</strong> PECA 2016 (Sections 25 & 26): unauthorised disclosure of personal information is a criminal offence under Pakistani law. Contract Act 1872: this agreement is legally binding. Personal Data Protection Act 2023 applies to all data collection, processing, and retention under this assessment.</div>
              </div>
            </div>

            {/* To Organisations */}
            <div style={{background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'16px', padding:'40px', borderTop:`4px solid #3B82F6`}}>
              <div className="mono" style={{fontSize:'11px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:'#3B82F6', marginBottom:'24px'}}>
                To Organisations · What Carnelian Commits
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'16px', fontSize:'13.5px', color:T.t1, lineHeight:'1.65', fontWeight:'500'}}>
                <div><strong style={{color:T.t0}}>Role:</strong> Carnelian is the Data Processor. The client organisation is the Data Controller. Carnelian processes data on the client's behalf according to this agreement.</div>
<div><strong style={{color:T.t0}}>Security:</strong> Access-controlled database, email addresses stored as unique identifiers, confidentiality obligations on all Carnelian personnel, 72-hour breach notification to the commissioning organisation and affected individuals.</div>                <div><strong style={{color:T.t0}}>Permitted use by organisations:</strong> Informing internal HR decisions, sharing with relevant HR/management personnel, using in structured feedback conversations.</div>
                <div><strong style={{color:T.t0}}>Prohibited use by organisations:</strong> Sharing reports externally without respondent consent, using CORE results as the sole basis for consequential decisions, reproducing or reselling CORE methodology.</div>
                <div><strong style={{color:T.t0}}>Liability boundary:</strong> Carnelian's responsibility ends at delivery of reports to the HR contact. The client is responsible for all downstream use.</div>
                <div><strong style={{color:T.t0}}>Governing law:</strong> Laws of Pakistan. Arbitration: Arbitration Act 1940, seat Lahore. Data retention: 5 years, then deleted or anonymised.</div>
              </div>
            </div>

          </div>


        </div>
      </Reveal>
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
      url: 'https://wa.me/923462828886',
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
      const h = JSON.parse(localStorage.getItem('core_v3_history') || '[]');
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
        minHeight: 'calc(100vh - 64px - 100px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {tab==='home'    && <HomePage    setTab={handleSetTab} />}
      {tab==='assess'  && <AssessmentPage setTab={handleSetTab} setReportData={setReportData} setHistoryFlag={setHasHistory} />}
      {tab==='results' && <ResultsPage reportData={reportData} />}
      {tab==='progress'&& <ProgressPage setTab={handleSetTab} setReportData={setReportData} />}
      {tab==='legal'   && <LegalPage />}
      </div>
      <Footer />
    </>
  );
}