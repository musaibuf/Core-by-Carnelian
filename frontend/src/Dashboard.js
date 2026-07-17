import React, { useState, useEffect, useMemo } from 'react';
import {
  Bolt, WorkspacePremium, AccountBalance, Lightbulb,
  Balance, Public, Groups, RocketLaunch,
  Diversity3, Shield, AltRoute, MenuBook, TrendingUp
} from '@mui/icons-material';

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

// ─── GLOBAL STYLES ───────────────────────────────────────────
const DashStyles = ({ T }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
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
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily adjust styles for full capture
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    const canvas = await window.html2canvas(element, { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: T.bg1 
    });

    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
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
];

const Sidebar = ({ activeTab, setActiveTab, T, total }) => (
  <aside className="sidebar" style={{
    width:'240px', flexShrink:0, background:T.bg1, borderRight:`1px solid ${T.b2}`,
    display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflow:'auto',
  }}>
    <div style={{ padding:'28px 24px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
        <img src="/logo.png" alt="Carnelian" style={{ height:'26px', objectFit:'contain' }}
          onError={e=>{ e.target.style.display='none'; }} />
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:'700', color:T.gold, letterSpacing:'-0.02em', lineHeight:'0.95' }}>CORE</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.c, letterSpacing:'0.18em', marginTop:'2px', fontWeight:'800' }}>BY CARNELIAN</div>
        </div>
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:'10px', fontWeight:'600' }}>Admin Dashboard</div>
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

// ─── TECHNICAL REPORT (full HR view) ─────────────────────────
const TechnicalReport = ({ candidate, T }) => {
  const rd      = candidate.report_data || {};
  const S       = rd.scores   || {};
  const validity= rd.validity  || {};
  const profile = rd.profile   || {};
  const roles   = rd.roles     || [];
  const patterns= rd.patterns  || [];
  const CI      = rd.CI        || {};
  const gs      = rd.gameSummary || {};

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>
      {children}
    </div>
  );

  return (
    <div>
      <div id={`tech-report-${candidate.doc_id}`} style={{ padding: '10px' }}>
      {/* HEADER */}
      {card(
               <>
          <SectionHead label="CORE v3.0 · Technical Report · Restricted — HR Leadership Only" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <div>
             <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:'700', color:T.t0, marginBottom:'4px' }}>{candidate.name}</div>
              <div style={{ fontSize:'12px', color:T.t2, fontWeight:'600', marginBottom:'8px', lineHeight:'1.6' }}>
                <span style={{color:T.gold}}>{candidate.assessment_type === 'org' ? '🏢 Assigned by Organization' : candidate.assessment_type === 'ind' ? '👤 Individual' : 'Assessment Type Unspecified'}</span><br/>
                {candidate.role}{candidate.department ? ` · ${candidate.department}` : ''}<br/>
                {candidate.email && <span>{candidate.email}</span>}
                {candidate.phone && <span> · {candidate.phone}</span>}<br/>
                {candidate.emp_id && <span>ID: {candidate.emp_id} · </span>}
                Experience: {candidate.experience}{candidate.gender && candidate.gender !== 'Prefer not to say' ? ` · ${candidate.gender}` : ''}
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <ScoreBadge score={S.overall || candidate.overall_score} T={T} />
                <Pill label={profile.name || candidate.profile_name} color={T.c} />
                <ValidityDot overall={validity.overall} T={T} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', marginBottom:'6px' }}>
                {candidate.industry} · {candidate.batch || 'No batch'} · {new Date(candidate.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>Doc: {candidate.doc_id}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'6px', marginTop:'12px' }}>
                {MODULE_KEYS.map(({ k, l, c }) => (
                  <div key={k} style={{ background:T.bg3, borderRadius:'6px', padding:'8px', textAlign:'center' }}>
                    <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:'1.3rem', color:c, fontWeight:'700' }}>{S[k]||'—'}</div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'2px', fontWeight:'600', lineHeight:'1.3' }}>{l.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* VALIDITY */}
      <div style={{
        background: validity.overall==='green' ? T.gnP : validity.overall==='amber' ? T.amP : T.rdP,
        border:`1px solid ${validityColor(validity.overall,T)}35`,
        borderRadius:'10px', padding:'20px', marginBottom:'14px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
          <ValidityDot overall={validity.overall} T={T} />
          <div style={{ fontSize:'13px', fontWeight:'700', color:T.t0 }}>{validity.overallLabel}</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'12px' }}>
          {[
            { n:`${validity.lAgree}/10`, l:'L-Scale' },
            { n:`${Math.round((validity.saRatio||0)*100)}%`, l:'Strongly Agree' },
            { n:`${Math.round((validity.extRatio||0)*100)}%`, l:'Extreme Resp.' },
            { n:`${validity.conScore}/100`, l:'Consistency' },
          ].map((v,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.35)', borderRadius:'6px', padding:'10px', textAlign:'center' }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:'700', fontSize:'1.1rem', color:T.t0 }}>{v.n}</div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'8px', color:T.t2, marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600' }}>{v.l}</div>
            </div>
          ))}
        </div>
        {(validity.flags||[]).map((f,i) => (
          <div key={i} style={{ fontSize:'11px', fontWeight:'600', marginBottom:'3px', lineHeight:'1.6', color:f.type==='green'?T.gn:f.type==='amber'?T.am:T.rd }}>
            <strong>{f.key}:</strong> {f.text}
          </div>
        ))}
      </div>

      {/* COMPOSITE INDICES */}
      {card(
        <>
          <SectionHead label="Cross-Module Composite Indices" T={T} />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${T.b2}` }}>
                  {['Index','Score','Profile','Risk Level','What it measures'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
                  const val  = CI[k] || S[k] || 0;
                  // FIX: Use the custom thresholds for color mapping, not the default 75/50
                  const col  = val >= green ? T.gn : val >= amber ? T.am : T.rd;
                  const bg   = val >= green ? T.gnP : val >= amber ? T.amP : T.rdP;
                  const barColor = val >= green ? `linear-gradient(90deg, ${darkTheme.gn}, #4ade80)` : val >= amber ? `linear-gradient(90deg, ${darkTheme.am}, #fcd34d)` : `linear-gradient(90deg, ${darkTheme.rd}, #f87171)`;
                  const rat  = val>=green ? 'LOW RISK' : val>=amber ? 'MODERATE' : 'HIGH RISK';
                  const desc = {
                    CII:'Primary screen for treasury, audit, procurement, and any fiduciary role.',
                    LRS:'Composite predictor of senior leadership performance. Use for promotion and succession.',
                    TVS:'Predicts team cohesion contribution.',
                    ADS:'Suitability for change, reform, and innovation roles.',
                    SES:'Effectiveness with clients, donors, regulators, and partners.',
                    OPS:'Sustained delivery and operational reliability under pressure.',
                    PMS:'People management and team lead suitability.',
                  }[k] || '';
                  return (
                    <tr key={k} style={{ borderBottom:`1px solid ${T.b1}` }}>
                      <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{l}</td>
                      <td style={{ padding:'10px 10px' }}>
                        <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'3px', fontSize:'11px', fontWeight:'700', fontFamily:"'IBM Plex Mono',monospace", background:bg, color:col, border:`1px solid ${col}40` }}>{val}/100</span>
                      </td>
                      <td style={{ padding:'10px 10px', width:'120px' }}>
                        <div style={{ height:'6px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
                          <div style={{ width:`${val}%`, height:'100%', background:barColor }} />
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px', fontSize:'11px', fontWeight:'800', color:col }}>{rat}</td>
                      <td style={{ padding:'10px 10px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PATTERNS */}
      {patterns.length > 0 && card(
        <>
          <SectionHead label="Cross-Dimensional Pattern Analysis" T={T} />
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {patterns.map((p,i) => {
              const isRed=p.sev==='red', isAmber=p.sev==='amber';
              const bg=isRed?T.rdP:isAmber?T.amP:T.gnP;
              const bc=isRed?T.rd:isAmber?T.am:T.gn;
              const icon=isRed?'🔴':isAmber?'🟡':'🟢';
              return (
                <div key={i} style={{ background:bg, border:`1px solid ${bc}35`, borderRadius:'10px', padding:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                    <span>{icon}</span>
                    <span style={{ fontSize:'12px', fontWeight:'800', color:bc, textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.name}</span>
                  </div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>{p.headline}</div>
                  <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.65', marginBottom:p.action?'10px':'0' }}>{p.detail}</div>
                  {p.action && (
                    <div style={{ fontSize:'12px', fontWeight:'700', color:T.t0, background:T.b0, padding:'10px 12px', borderRadius:'7px', borderLeft:`3px solid ${bc}` }}>
                      <strong>HR Action:</strong> {p.action}
                    </div>
                  )}
                  {p.probeQ && p.probeQ.length > 0 && (
                    <div style={{ marginTop:'10px' }}>
                      <div style={{ fontSize:'10px', fontWeight:'800', color:bc, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>Interview Probes:</div>
                      {p.probeQ.map((q,qi) => (
                        <div key={qi} style={{ fontSize:'12px', color:T.t1, padding:'4px 0', borderBottom:qi<p.probeQ.length-1?`1px solid ${T.b1}`:'none' }}>→ {q}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ROLE SUITABILITY */}
      {card(
        <>
          <SectionHead label="Role Suitability Matrix" T={T} />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${T.b2}` }}>
                  {['Role Family','Score','Profile','Verdict','Guidance / Probes'].map(h => (
<th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((r,i) => {
                  const rat=r.score>=r.g?'green':r.score>=r.a?'amber':'red';
                  const col=rat==='green'?T.gn:rat==='amber'?T.am:T.rd;
                  const lbl=rat==='green'?'✅ Suitable':rat==='amber'?'⚠️ Conditional':'🚫 Not Recommended';
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${T.b1}` }}>
                      <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                      <td style={{ padding:'10px 10px' }}><ScoreBadge score={r.score} T={T} /></td>
                      <td style={{ padding:'10px 10px', width:'100px' }}>
                        <div style={{ height:'6px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
                          <div style={{ width:`${r.score}%`, height:'100%', background:barGrad(r.score) }} />
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'800', color:col }}>{lbl}</td>
                      <td style={{ padding:'10px 10px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>
                        {rat==='red' ? (
                          <div>
                            <div style={{ color:T.rd, marginBottom:'6px' }}>{r.redNote}</div>
                            {r.probeQ && r.probeQ.map((q,qi) => (
                              <div key={qi} style={{ padding:'3px 0', fontSize:'11px' }}>→ {q}</div>
                            ))}
                          </div>
                        ) : rat==='amber' ? 'Structured onboarding + defined milestones.'
                          : 'Suitable. Standard performance management applies.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

    {/* OCEAN */}
      {card(
        <>
          <SectionHead label="Module 1 — Personality at Work (OCEAN)" T={T} color="#EC4899" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
            {OCEAN_KEYS.map(k => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'700' }}>{OCEAN_LABELS[k]}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#EC4899', fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CQ */}
      {card(
        <>
          <SectionHead label="Module 2 — Cultural Intelligence (CQ)" T={T} color="#06B6D4" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            {CQ_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'#06B6D4', fontWeight:'700' }}>{S[k]||0}</div>
                <MiniBar score={S[k]||0} w="100%" h={5} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* OCB */}
      {card(
        <>
          <SectionHead label="Module 3 — Organisational Citizenship Behaviour (OCB)" T={T} color="#F97316" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
            {OCB_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#F97316', fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* LEARNING AGILITY */}
      {card(
        <>
          <SectionHead label="Module 4 — Adaptive Thinking & Learning Agility" T={T} color="#3B82F6" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {LA_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#3B82F6', fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ETHICAL ORIENTATION */}
      {card(
        <>
          <SectionHead label="Module 5 — Integrity & Ethical Orientation" T={T} color="#7C3AED" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {EO_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#7C3AED', fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* GAME PERFORMANCE */}
      {gs && Object.keys(gs).length > 0 && card(
        <>
          <SectionHead label="Performance Challenge Results (Gamified Scores)" T={T} />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.b2}` }}>
                  {['Challenge','Type','Performance','Modifier','Dimensions Affected'].map(h => (
<th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { t:'Values in Balance (Seesaw)', type:'Ethical Values', perf:gs.seesaw?.label||'—', pts:`${(gs.seesaw?.bonus||0)>=0?'+':''}${gs.seesaw?.bonus||0} pts · Pos: ${gs.seesaw?.val||50}/100`, col:(gs.seesaw?.bonus||0)>=0?T.gn:T.rd, dims:'Ethical Reasoning (EO_ER)' },
                  { t:'Quick Decision Challenge',    type:'Situational Judgment', perf:gs.scenario1?.label||'—', pts:`${(gs.scenario1?.raw||0)>=0?'+':''}${gs.scenario1?.raw||0} pts`, col:(gs.scenario1?.raw||0)>=0?T.gn:T.rd, dims:'People Agility (LA_PA), Transparency (EO_T)' },
                  { t:'Ethics Under Pressure',       type:'Situational Judgment', perf:gs.scenario2?.label||'—', pts:`${(gs.scenario2?.raw||0)>=0?'+':''}${gs.scenario2?.raw||0} pts`, col:(gs.scenario2?.raw||0)>=0?T.gn:T.rd, dims:'Rule Compliance (EO_RC), Authentic Integrity (EO_AI)' },
                ].map((g,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{g.t}</td>
                    <td style={{ padding:'10px 10px', fontSize:'11px', color:T.t2 }}>{g.type}</td>
                    <td style={{ padding:'10px 10px' }}><Pill label={g.perf} color={g.col} style={{ fontSize:'9px' }} /></td>
                    <td style={{ padding:'10px 10px', fontFamily:"'JetBrains Mono',monospace", fontSize:'12px', fontWeight:'800', color:g.col }}>{g.pts}</td>
                    <td style={{ padding:'10px 10px', fontSize:'11px', color:T.t2 }}>{g.dims}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PSYCHOMETRIC PROFILE */}
      {card(
        <>
          <SectionHead label="Psychometric Profile" T={T} />
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', color:T.t0, fontWeight:'700', marginBottom:'8px' }}>{profile.name || candidate.profile_name}</div>
          <div style={{ fontSize:'13px', color:T.t2, lineHeight:'1.7', fontWeight:'600', marginBottom:profile.devNote?'12px':'0' }}>{profile.desc}</div>
          {profile.devNote && (
            <div style={{ background:T.b0, borderLeft:`3px solid ${T.gold}`, padding:'12px 14px', borderRadius:'0 8px 8px 0', fontSize:'12px', color:T.t1, lineHeight:'1.65' }}>{profile.devNote}</div>
          )}
        </>
      )}

     {/* INDUSTRY LENS */}
      {candidate.industry && rd.cfg?.industry && (
        <div style={{ background:T.bg3, borderRadius:'10px', padding:'16px 18px', border:`1px solid ${T.b2}`, marginBottom:'14px' }}>
          <SectionHead label={`Industry Lens — ${candidate.industry}`} T={T} />
          {rd.cfg?.industryLens && <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.65' }} dangerouslySetInnerHTML={{ __html: rd.cfg.industryLens }} />}
        </div>
      )}
      </div>
      <DownloadBtn elementId={`tech-report-${candidate.doc_id}`} filename={`${candidate.name}_Technical_Report.pdf`} T={T} />
    </div>
  );
};

// ─── ACTION PLAN REPORT (candidate development roadmap) ───────
const ActionPlanReport = ({ candidate, T }) => {
  const rd      = candidate.report_data || {};
  const S       = rd.scores   || {};
  const CI      = rd.CI       || {};
  const profile = rd.profile  || {};
  const gs      = rd.gameSummary || {};

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

  const devAreas = [];
  const add = (dim, v, why, acts, now, soon, fut) => devAreas.push({
    dim, v, why, now, soon, fut, acts,
    habits: [
      { h:'Week 1:', t: now || acts[0] || 'Review your current approach.' },
      { h:'Week 2:', t: acts[0] || 'Document one observation about your behaviour.' },
      { h:'Week 3:', t: acts[1] || 'Ask a colleague for specific feedback.' },
      { h:'Week 4:', t: soon || acts[1] || 'Begin the recommended resource.' },
      { h:'Month 2:', t: acts[2] || soon || 'Implement one new habit.' },
      { h:'Month 2:', t: 'Share your development goal with your manager.' },
      { h:'Month 3:', t: soon || 'Schedule a formal progress check-in.' },
      { h:'Month 4–6:', t: fut || 'Take on a stretch assignment.' },
      { h:'6 Months:', t: 'Reassess via CORE retake — measure change from ' + v + '/100.' },
      { h:'Ongoing:', t: 'Keep a weekly log. Review every Friday.' }
    ]
  });

  if(S.C<55) add('Conscientiousness & Delivery',S.C,
    ctxAction("Consistent delivery is the foundation of professional credibility. Missed deadlines or incomplete work creates friction that compounds over time.", "In banking, your reliability directly affects your institution's regulatory standing and client trust.", "In the civil service, your output accountability shapes public outcomes.", "Development sector programmes are accountable to donors, beneficiaries, and communities simultaneously.", "At your seniority level, your delivery sets the standard for the entire team.", "Early in your career, delivery reliability is how you build the professional reputation that opens every future door."),
    [
      ctxAction("Use a weekly priority matrix every Monday: list your top 3 deliverables and set personal deadlines 2 days ahead of official ones","Review your open regulatory or compliance deliverables every Monday and set internal deadlines 2 days ahead","Map your weekly deliverables against departmental KPIs every Monday morning","Review your programme milestones against donor reporting timelines every Monday","Implement a weekly leadership accountability check-in","Every Monday, identify your 3 most important deliverables for the week"),
      "Break large projects into milestone check-ins with your line manager every two weeks — make progress visible before problems become surprises",
      ctxAction("Track one commitment per week that you made and actually completed","Keep a simple log of every regulatory or compliance commitment you make","Document your completed commitments in writing","Track your programme deliverables against donor commitments in a shared log","Your team is watching how you follow through. Document your own commitments publicly","Keep a weekly log of three things you committed to and whether you completed them")
    ],
    ctxAction("Agree a weekly check-in with your supervisor on 3 explicit priority deliverables","Book a 30-minute weekly slot with your line manager to review your open regulatory deliverables","Schedule a weekly meeting with your supervisor to review your progress against departmental KPIs","Set up a shared milestone tracker with your programme coordinator this week","Send your team a written commitment list every Monday","Have an honest conversation with your line manager this week about which current commitments you are most at risk of missing"),
    ctxAction("Enrol in a personal productivity workshop or study one methodology (GTD, Agile personal planning)","Complete a structured time management or professional effectiveness programme","Attend a civil service effectiveness workshop through your Training Institute","Enrol in a project management short course","Commission a team productivity audit to understand where delivery bottlenecks are systemic","Attend a productivity and professional effectiveness workshop"),
    ctxAction("Lead a project end-to-end within 6 months to build delivery confidence with structured accountability","Take ownership of an end-to-end compliance or regulatory project","Lead a cross-departmental working group to demonstrate sustained delivery over a 6-month period","Lead a full programme cycle from design to donor reporting","Commission an organisational review of how delivery accountability is structured across your team","Ask to lead a complete project or initiative end-to-end")
  );

  if(S.ES<55) add('Emotional Resilience',S.ES,
    ctxAction("High-stakes professional environments involve pressure cycles. Your ability to remain clear-headed under pressure is not a soft skill — it is career-determining.", "Banking environments are characterised by regulatory cycles, audit periods, and market pressure.", "Civil service reform creates sustained pressure on officers at all levels.", "Development sector professionals work in environments of resource constraints, community pressure, and donor scrutiny simultaneously.", "At senior level, your emotional state sets the emotional tone for the entire team.", "Early career is when pressure tolerance is built."),
    ["Build a 10-minute daily decompression practice — journalling, walking, or structured reflection — so daily stress does not accumulate","After difficult professional situations, write three sentences: what happened, how I responded, and what I would do differently","Identify 2–3 trusted colleagues who can provide a grounded sounding board when you are under pressure — and use them proactively"],
    ctxAction("Speak to your HR team about access to an employee assistance programme or wellbeing resources","Ask your institution's HR team this week about EAP access and stress management resources","Contact your Training Institute about resilience coaching resources available to civil service officers","Speak to your programme director about workload distribution","Identify one specific pressure source in your current role and have a direct conversation with your leadership about managing it structurally","Talk to your line manager this week about one specific pressure point in your role and what support is available"),
    ctxAction("Attend a resilience or emotional intelligence workshop this quarter","Attend a professional resilience workshop — specifically one designed for high-accountability financial environments","Attend a public sector leadership and resilience programme through your Provincial or Federal Training Institute","Attend an NGO or development sector leadership workshop","Commission an executive coaching engagement for yourself","Attend an emotional intelligence or resilience workshop and keep a personal learning journal throughout"),
    ctxAction("Seek a role with progressively increasing accountability to build resilience through real-world exposure","Seek out a role rotation that includes a high-pressure function","Pursue a secondment or cross-posting to a reform-facing role","Accept an assignment in a resource-constrained or high-stakes programme context","Build a senior leadership resilience programme for your team","Ask to be included in high-stakes projects or client-facing situations where you will be stretched")
  );

  if(S.LAavg<55) add('Learning Agility',S.LAavg,
    ctxAction("In every Pakistani sector, the professionals who rise are those who learn and adapt fastest. Current knowledge has a shelf life. Learning agility is how you extend yours.", "Pakistan's banking sector is changing faster than almost any other.", "Pakistan's civil service is in active reform.", "The development sector's evidence base, tools, and best practices evolve continuously.", "At your seniority level, your learning agility determines whether you remain strategically relevant as your sector evolves.", "The first decade of a career is where learning habits are formed."),
    [
      ctxAction("Dedicate 30 minutes per week to reading one regulation, industry report, or domain publication outside your normal scope","Set a standing 30-minute weekly appointment with SBP's regulatory circulars","Set a standing 30-minute weekly appointment with relevant NCGR documents","Subscribe to OECD Development Co-operation Reports"),
      "After completing any significant task, ask: 'What did I learn from this, and how could I apply it somewhere completely different?'",
      ctxAction("Request feedback from at least 2 colleagues or supervisors per quarter, write down what you will change, and follow through","After every significant banking transaction, write a brief reflection","After every major policy implementation, conduct a personal After-Action Review","After every programme cycle, conduct a personal learning review")
    ],
    ctxAction("Subscribe to one sector publication or regulatory update you do not currently follow","Subscribe today to SBP's official regulatory updates","Subscribe today to at least one international public administration publication","Subscribe today to one international development sector publication"),
    ctxAction("Build a 90-day self-directed learning plan on one topic outside your current expertise","Build a 90-day learning plan on one banking domain outside your current specialty","Build a 90-day learning plan on one reform area directly relevant to your department","Build a 90-day learning plan on one methodology outside your current programme toolkit"),
    ctxAction("Apply to facilitate or co-design a training or knowledge-sharing session — teaching is the fastest way to deepen learning agility","Apply to co-design or facilitate an internal knowledge-sharing session at your institution","Apply to deliver a session at your Training Institute","Apply to design or facilitate a staff capacity building session for your programme team")
  );

  if(S.OCB_S<50) add('Constructive Attitude & Sportsmanship',S.OCB_S,
    ctxAction("How we respond to institutional frustration shapes the morale of everyone around us. In Pakistani professional culture, sustained negativity has a compounding cost to your standing.", "Banking environments involve significant process constraints, regulatory pressure, and institutional bureaucracy.", "The civil service has structural inefficiencies that frustrate virtually everyone who works within it.", "Development sector environments involve resource constraints, bureaucratic donor requirements, and community expectations.", "At senior level, your attitude toward institutional frustration is magnified across your team.", "Early career frustrations are real and often valid. The professional habit of channelling them constructively is critical."),
    ["Adopt the 'solution before complaint' rule — before voicing any frustration, have at least one concrete improvement suggestion ready","Create a private written log for institutional frustrations — getting them out of your head and onto paper reduces the emotional pressure to share them with colleagues","Identify one institutional frustration you currently hold, and make a deliberate decision: either act on it through the right channel, or consciously let it go"],
    ctxAction("Identify one frustration you have recently shared with colleagues and commit to a more constructive approach","Identify one operational or regulatory constraint you have recently complained about — write down what a constructive improvement proposal would look like","Identify one civil service process you have recently complained about — draft a one-page improvement proposal","Identify one donor requirement or programme constraint you have recently expressed frustration about — write down what a constructive alternative would look like"),
    ctxAction("Discuss with your line manager the most effective channel for improvement ideas in your organisation","Schedule a conversation with your line manager about the most effective channels for raising process improvement ideas","Identify and use your department's formal suggestion and reform proposal mechanisms","Map your organisation's internal feedback and improvement channels and commit to routing your frustrations through them"),
    ctxAction("Volunteer to lead a process improvement initiative — channelling frustration into change is the most effective long-term strategy","Volunteer to lead a process improvement workstream in your institution","Apply to join a civil service reform working group or departmental improvement committee","Apply to lead a programme process improvement review")
  );

const R = candidate; 

  const getResources = () => {
    const res = [];
    const gapKeys = bot2.map(d => d.k); 
    const indText = R.industry || 'your sector';
    const roleText = R.role || 'professional';
    const expText = R.exp || R.experience ? `at ${R.exp || R.experience} of experience` : 'at your career stage';
    const profileText = profile?.name || candidate?.profile_name || 'professional';

    if(gapKeys.includes('C')){
      if(S.O>=65) res.push({type:'book', title:'The 12 Week Year', author:'Brian Moran', url:'', why:`As a ${profileText} ${expText}, standard to-do lists will fail your creative drive. This sprint-based system replaces annual goals with 12-week cycles, ensuring your ideas actually execute in ${indText}.`});
      else res.push({type:'book', title:'Atomic Habits', author:'James Clear', url:'', why:`In ${indText}, delivery reliability is your primary currency. This is the most evidence-grounded system for building reliable execution habits through small, compounding daily commitments.`});
      res.push({type:'ted', title:'Inside the Mind of a Master Procrastinator', author:'Tim Urban', url:'https://www.youtube.com/watch?v=arj7oStGLkU', why:'Before you can fix your delivery gap, you must understand the psychology of task-avoidance. Highly recommended before starting your action plan.'});
    }
    if(gapKeys.includes('ES')){
      res.push({type:'book', title:'Chatter: The Voice in Our Head', author:'Ethan Kross', url:'', why:`As a ${roleText} ${expText}, pressure is inevitable. This provides evidence-based techniques for managing your inner critical voice when stakes are high in ${indText}.`});
      res.push({type:'ted', title:'How to Make Stress Your Friend', author:'Kelly McGonigal', url:'https://www.youtube.com/watch?v=RcGyVTAoXEU', why:'Stanford psychologist explains research showing the relationship with stress predicts health and performance.'});
    }
    if(gapKeys.includes('CQavg')){
      res.push({type:'book', title:'The Culture Map', author:'Erin Meyer', url:'', why:`The most practically applicable cultural intelligence book for Pakistani professionals. Essential for a ${profileText} navigating diverse stakeholders in ${indText}.`});
    }
    if(gapKeys.includes('LAavg')){
      res.push({type:'book', title:'Mindset: The New Psychology of Success', author:'Carol S. Dweck', url:'', why:`Research on fixed vs. growth mindset. As the landscape of ${indText} evolves, your ability to learn faster than your peers is your ultimate competitive advantage ${expText}.`});
    }
    if(gapKeys.includes('EOavg')){
      res.push({type:'book', title:'The Righteous Mind', author:'Jonathan Haidt', url:'', why:`Explains why professionals who make ethical lapses are not usually dishonest by nature. Critical reading for high-accountability roles in ${indText}.`});
    }
    if(gapKeys.includes('A')){
      res.push({type:'book', title:'Getting to Yes', author:'Fisher & Ury', url:'', why:`The foundational text on principled negotiation. Helps you disagree and influence stakeholders in ${indText} without damaging long-term relationships.`});
    }
    if(gapKeys.includes('O')){
      res.push({type:'book', title:'A Whole New Mind', author:'Daniel Pink', url:'', why:`A powerful argument for why creative and conceptual thinking is increasingly critical. Essential for breaking out of rigid procedural thinking ${expText}.`});
    }
    if(gapKeys.includes('E')){
      res.push({type:'book', title:'Quiet', author:'Susan Cain', url:'', why:`A research-backed argument that introversion is a professional asset when deployed deliberately. Learn how to hold presence as a ${profileText} without faking extraversion.`});
    }
    if(gapKeys.includes('OCBavg')){
      res.push({type:'book', title:'Give and Take', author:'Adam Grant', url:'', why:`Explains how contributing to the success of your colleagues and the institution ultimately accelerates your own trajectory in ${indText}.`});
    }

    if(res.length===0){
      res.push({type:'book', title:'The Effective Executive', author:'Peter Drucker', url:'', why:`Foundational text on professional effectiveness. Highly relevant for sustaining your balanced profile as a ${profileText} ${expText}.`});
    }
    return res.slice(0, 4); 
  };

  const getPrograms = () => {
    const progs = [];
    const gapKeys = bot2.map(d => d.k);
    const profileText = profile?.name || candidate?.profile_name || 'professional';

    if(gapKeys.includes('E') || gapKeys.includes('A') || gapKeys.includes('OCBavg')) 
      progs.push({name:'Communication & Influence Workshop', desc:"Carnelian's two-day programme covering professional communication styles, stakeholder influence, and cross-contextual messaging.", match:`Directly targets the interpersonal gaps in your ${profileText} profile.`});
    
    if(gapKeys.includes('EOavg') || (gs?.seesaw?.val>60)) 
      progs.push({name:'Professional Ethics & Values Programme', desc:"A Carnelian-facilitated workshop on ethical decision-making frameworks, integrity under pressure, and building a culture of transparency.", match:`Recommended based on your Ethical Orientation scores and Values Seesaw responses.`});
    
    if(gapKeys.includes('LAavg') || gapKeys.includes('O')) 
      progs.push({name:'Learning Agility & Growth Mindset Workshop', desc:"A Carnelian programme building the specific habits that accelerate professional development.", match:`Directly targets your priority development area in adaptive learning.`});
    
    if(gapKeys.includes('CQavg')) 
      progs.push({name:'Intercultural Communication & Collaboration', desc:"Carnelian's cross-cultural effectiveness programme for Pakistani multi-institutional contexts.", match:`Recommended to help you navigate diverse stakeholders in ${R.industry || 'your sector'}.`});
    
    if(gapKeys.includes('ES')) 
      progs.push({name:'Resilience & Emotional Intelligence Programme', desc:"A Carnelian one-day programme combining evidence-based resilience frameworks with practical emotional regulation tools.", match:`Directly targets your priority development area in Emotional Resilience.`});
    
    if(progs.length===0) 
      progs.push({name:'CORE Coaching Session', desc:"A structured 90-minute session with a Carnelian consultant to debrief your full CORE profile.", match:`Recommended to help you leverage your balanced strengths as a ${profileText}.`});

    return progs.slice(0, 3);
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
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 28px', marginBottom:'20px' }}>
            {allDims.map(d => {
              const pCol = d.l.includes('Personality')||d.l.includes('Conscientiousness')||d.l.includes('Emotional')||d.l.includes('Openness')||d.l.includes('Social')||d.l.includes('Collaborative') ? '#EC4899' : d.l.includes('Cultural') ? '#06B6D4' : d.l.includes('Citizenship') ? '#F97316' : d.l.includes('Learning') ? '#3B82F6' : d.l.includes('Integrity') ? '#7C3AED' : T.t0;
              return (
              <div key={d.k} style={{ marginBottom:'4px' }}>
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px', textAlign:'center' }}>
              {COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
                const v = CI[k] || 0;
                const col = bCol(v,T);
                return (
                  <div key={k}>
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {top2.map(d => (
              <div key={d.k} style={{ padding:'18px', borderRadius:'10px', background:T.gnP, border:`1px solid ${T.gn}40`, borderLeft:`5px solid ${T.gn}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:T.gn, marginBottom:'6px' }}>✦ Core Strength</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'700', marginBottom:'6px', color:T.gn }}>{d.l}</div>
                <div style={{ fontSize:'12px', color:T.gn, lineHeight:'1.6', marginBottom:'10px' }}>{d.str}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.gn, fontWeight:'700' }}>{d.v}/100</div>
              </div>
            ))}
            {bot2.map(d => (
              <div key={d.k} style={{ padding:'18px', borderRadius:'10px', background:T.rdP, border:`1px solid ${T.rd}40`, borderLeft:`5px solid ${T.rd}` }}>
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
      {devAreas.length > 0 && card(
        <>
          <SectionHead label={`Development Roadmap${candidate.industry ? ` — ${candidate.industry}` : ''}`} T={T} />
          {devAreas.map((d, i) => {
            const dimCol = d.v < 45 ? T.rd : d.v < 60 ? T.am : T.gn;
            return (
              <div key={i} style={{ border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'12px', background:T.bg3 }}>
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
                    return (
                      <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 14px', background:sBg, borderRadius:'6px' }}>
                        <div style={{ minWidth:'20px', height:'20px', borderRadius:'50%', background:sCol, color:'#fff', fontSize:'10px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{j+1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', color:sCol, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'2px' }}>{h.h}</div>
                          <div style={{ fontSize:'12px', color:T.t0, lineHeight:'1.5', fontWeight:'500' }}>{h.t}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40` }}>🔴 Days 1–30: {d.now||d.acts[0]}</span>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.amP, color:T.am, border:`1px solid ${T.am}40` }}>🟡 Days 30–90: {d.soon||d.acts[1]}</span>
                  <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.gnP, color:T.gn, border:`1px solid ${T.gn}40` }}>🟢 Days 90–180: {d.fut}</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* RESOURCES & PROTOCOLS */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
        {card(
          <>
            <SectionHead label="Profile-Matched Toolkit" T={T} />
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {resources.map((r, i) => {
                const tCol = r.type==='book'?'#3B82F6':r.type==='ted'?'#EF4444':r.type==='youtube'?'#10B981':'#8B5CF6';
                const tBg = r.type==='book'?'rgba(59,130,246,0.15)':r.type==='ted'?'rgba(239,68,68,0.15)':r.type==='youtube'?'rgba(16,185,129,0.15)':'rgba(139,92,246,0.15)';
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
          </>
        )}
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
          </>
        )}
      </div>

      {/* PROGRAMS */}
      {card(
        <>
          <SectionHead label="Recommended Training — Carnelian Programmes" T={T} />
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {programs.map((p, i) => (
              <div key={i} style={{ background:`linear-gradient(135deg, ${T.bg2} 0%, ${T.bg3} 100%)`, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'16px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:T.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', flexShrink:0 }}>C</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:T.gold, marginBottom:'4px' }}>{p.name}</div>
                  <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.5' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

     {/* PRIORITY MATRIX */}
      {card(
        <>
          <SectionHead label="Priority Action Matrix" T={T} />
          <p style={{color:T.t2, fontSize:'12px', lineHeight:'1.6', marginBottom:'12px', fontWeight:'500'}}>Dimensions sorted relatively by urgency based on the candidate's unique score profile.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[
              { label:'🔴 Act Now (Priority)',  items:allDims.slice(7, 9),  bg:T.rdP, bc:T.rd  },
              { label:'🟡 Build Soon (Secondary)', items:allDims.slice(5, 7), bg:T.amP, bc:T.am },
              { label:'🟢 Sustain & Expand (Strengths)', items:allDims.slice(0, 2),  bg:T.gnP, bc:T.gn  },
              { label:'🔵 Monitor Progress (Balanced)', items:allDims.slice(2, 5), bg:T.b0,  bc:T.b2  },
            ].map(({ label, items, bg, bc }) => (
              <div key={label} style={{ background:bg, border:`1px solid ${bc}40`, borderRadius:'10px', padding:'16px' }}>
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
      <DownloadBtn elementId={`action-report-${candidate.doc_id}`} filename={`${candidate.name}_Action_Plan.pdf`} T={T} />
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

      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'#1e2a3a', textAlign:'center', padding:'12px 0' }}>
        CORE· {candidate.doc_id} · Carnelian Pvt Ltd
      </div>
      </div>
      <DownloadBtn elementId={`player-report-${candidate.doc_id}`} filename={`${candidate.name}_Player_Report.pdf`} T={T} />
    </div>
  );
};

// ─── TEAM REPORT PLACEHOLDER ──────────────────────────────────
const TeamReport = ({ candidate, allData, T }) => {
  const batch = candidate.batch;
  if (!batch) {
    return (
      <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>👥</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:T.t2, marginBottom:'8px' }}>No Batch Assigned</div>
        <div style={{ fontSize:'12px' }}>This candidate was not assessed as part of a named batch. The Team Aggregate Report is generated when 2+ assessments share the same batch name.</div>
      </div>
    );
  }

  const batchData = allData.filter(r => r.batch === batch && r.report_data?.validity?.overall !== 'red' && r.report_data?.scores);
  if (batchData.length < 2) {
    return (
      <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>⏳</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:T.t2, marginBottom:'8px' }}>Batch: {batch}</div>
        <div style={{ fontSize:'12px' }}>Only {batchData.length} valid response{batchData.length!==1?'s':''} in this batch. The Team Report requires at least 2.</div>
      </div>
    );
  }

  const n = batchData.length;
  const dimKeys = ['O','C','E','A','ES','CQavg','OCBavg','LAavg','EOavg'];
  const dimLabels = { O:'Openness',C:'Conscientiousness',E:'Extraversion',A:'Agreeableness',ES:'Emotional Stability',CQavg:'Cultural Intelligence',OCBavg:'Team Citizenship',LAavg:'Learning Agility',EOavg:'Ethical Orientation' };
  const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;

  const dimAvgs = {};
  dimKeys.forEach(k => { dimAvgs[k] = avg(batchData.map(b => b.report_data?.scores?.[k]).filter(v=>v!=null)); });
  const compAvgs = {};
  COMPOSITE_KEYS.forEach(({ k }) => { compAvgs[k] = avg(batchData.map(b => b.report_data?.CI?.[k] || b.report_data?.scores?.[k]).filter(v=>v!=null)); });

  const archCounts = {};
  batchData.forEach(b => { archCounts[b.profile_name] = (archCounts[b.profile_name]||0)+1; });
  const archSorted = Object.entries(archCounts).sort((a,b)=>b[1]-a[1]);

  const riskFlags = {
    'Performance-Ethics Disconnect': batchData.filter(b=>b.report_data?.scores?.C>=68&&b.report_data?.scores?.EOavg<=60).length,
    'Direct Compliance Risk':        batchData.filter(b=>b.report_data?.scores?.EO_RC<55).length,
    'Charismatic Integrity Risk':    batchData.filter(b=>b.report_data?.scores?.E>=70&&b.report_data?.scores?.EO_AI<=60).length,
  };
  const riskEntries = Object.entries(riskFlags).filter(([,v])=>v>0);

  const nGreen = batchData.filter(b=>b.report_data?.validity?.overall==='green').length;
  const nAmber = batchData.filter(b=>b.report_data?.validity?.overall==='amber').length;
  const nRed   = allData.filter(r=>r.batch===batch&&r.report_data?.validity?.overall==='red').length;

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>
      {children}
    </div>
  );

  return (
    <div>
      <div id={`team-report-${candidate.doc_id}`} style={{ padding: '10px' }}>
      {/* HEADER */}
      <div style={{ background:T.bg0, borderRadius:'10px', padding:'20px', marginBottom:'14px', border:`1px solid ${T.b2}` }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'6px' }}>Team Aggregate Report · Batch: {batch}</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'16px' }}>
          {[
            [allData.filter(r=>r.batch===batch).length, 'Responses'],
            [n, 'Valid'],
            [nRed, 'Invalid'],
            [archSorted.length, 'Archetypes'],
            [riskEntries.length, 'Risk Flags'],
          ].map(([v,l],i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:'700', color:T.gold }}>{v}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'2px', fontWeight:'600' }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', background:T.bg1, borderRadius:'8px', padding:'16px', border:`1px solid ${T.b1}` }}>
          {MODULE_KEYS.map(({ k, l, c }) => {
            const avg = Math.round(batchData.reduce((sum, b) => sum + (b.report_data?.scores?.[k] || 0), 0) / (batchData.length || 1));
            return (
              <div key={k} style={{textAlign:'center'}}>
                <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:'700', color:c}}>{avg}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'4px', fontWeight:'600'}}>{l.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIMENSION AVERAGES */}
      {card(
        <>
          <SectionHead label={`Team Dimension Averages (n=${n} valid)`} T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px' }}>
            {dimKeys.map(k => {
              const v = dimAvgs[k];
              const col = v>=75?T.gn:v>=55?T.am:T.rd;
              return (
                <div key={k} style={{ marginBottom:'6px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                    <span style={{ fontSize:'11px', color:T.t0, fontWeight:'700' }}>{dimLabels[k]}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:col, fontWeight:'700' }}>{v}/100</span>
                  </div>
                  <div style={{ height:'8px', background:T.b1, borderRadius:'100px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${v}%`, background:col, borderRadius:'100px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* COMPOSITE AVERAGES */}
      {card(
        <>
          <SectionHead label="Team Composite Index Averages" T={T} />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.b2}` }}>
                  {['Index','Team Avg','Profile','% Below Threshold'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
                  const v = compAvgs[k] || 0;
                  const pctBelow = Math.round((batchData.filter(b=>(b.report_data?.CI?.[k]||b.report_data?.scores?.[k]||0)<amber).length/n)*100);
                  return (
                    <tr key={k} style={{ borderBottom:`1px solid ${T.b1}` }}>
                      <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{l}</td>
                      <td style={{ padding:'10px 10px' }}><ScoreBadge score={v} T={T} /></td>
                      <td style={{ padding:'10px 10px', width:'100px' }}>
                        <div style={{ height:'5px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
                          <div style={{ width:`${v}%`, height:'100%', background:barGrad(v) }} />
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px', fontSize:'11px', fontWeight:'800', color:pctBelow>30?T.rd:pctBelow>15?T.am:T.gn }}>{pctBelow}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ARCHETYPE DISTRIBUTION */}
      {card(
        <>
          <SectionHead label={`Profile Distribution — ${allData.filter(r=>r.batch===batch).length} Respondents`} T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'10px' }}>
            {archSorted.map(([name, count]) => {
              const pct = Math.round((count/n)*100);
              return (
                <div key={name} style={{ border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'12px', borderLeft:`3px solid ${T.c}` }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>{name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ flex:1, height:'5px', background:T.b1, borderRadius:'100px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:T.c, borderRadius:'100px' }} />
                    </div>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.c, fontWeight:'700' }}>{count} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* RISK FLAGS */}
      {card(
        <>
          <SectionHead label={`Risk Pattern Frequency (n=${n} valid)`} T={T} />
          {riskEntries.length > 0 ? riskEntries.map(([name, count]) => {
            const pct = Math.round((count/n)*100);
            return (
              <div key={name} style={{ background:T.rdP, border:'1px solid rgba(239,68,68,0.3)', borderRadius:'9px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:T.rd }}>{name}</div>
                  <div style={{ fontSize:'11px', color:T.t2, marginTop:'2px' }}>{pct>=20?'Programme-level intervention recommended':'Consider targeted coaching'}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.1rem', fontWeight:'800', color:T.rd }}>{count}</div>
                  <div style={{ fontSize:'9px', color:T.t3 }}>{pct}% of valid</div>
                </div>
              </div>
            );
          }) : (
            <div style={{ padding:'16px', background:T.gnP, borderRadius:'9px', color:T.gn, fontSize:'12px', fontWeight:'700' }}>
              No risk patterns detected at alerting frequency.
            </div>
          )}
        </>
      )}

      {/* VALIDITY SUMMARY */}
      {card(
        <>
          <SectionHead label="Validity Summary" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
            {[
              [nGreen,'Valid (Green)',T.gn],
              [nAmber,'Caution (Amber)',T.am],
              [nRed,'Invalid (Red)',T.rd],
            ].map(([v,l,c]) => (
              <div key={l} style={{ background:T.bg3, borderRadius:'9px', padding:'14px', textAlign:'center', border:`1px solid ${c}28` }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:'700', color:c }}>{v}</div>
                <div style={{ fontSize:'11px', fontWeight:'700', color:c, marginTop:'3px' }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RESPONDENT SUMMARY */}
      {card(
        <>
          <SectionHead label="Batch Respondent Summary" T={T} />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.b2}` }}>
                  {['Name','Profile','Overall','CII','LRS','Validity'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batchData.sort((a,b)=>(b.overall_score||0)-(a.overall_score||0)).map((b,i) => (
                  <tr key={b.id||i} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 10px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{b.name}</td>
                    <td style={{ padding:'10px 10px', fontSize:'11px', color:T.c, fontWeight:'700' }}>{b.profile_name}</td>
                    <td style={{ padding:'10px 10px' }}><ScoreBadge score={b.overall_score} T={T} /></td>
                    <td style={{ padding:'10px 10px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(b.report_data?.CI?.CII||0,T), fontWeight:'700' }}>{b.report_data?.CI?.CII||'—'}</td>
                    <td style={{ padding:'10px 10px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(b.report_data?.CI?.LRS||0,T), fontWeight:'700' }}>{b.report_data?.CI?.LRS||'—'}</td>
                    <td style={{ padding:'10px 10px' }}><ValidityDot overall={b.report_data?.validity?.overall} T={T} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
      <DownloadBtn elementId={`team-report-${candidate.doc_id}`} filename={`${batch}_Team_Aggregate.pdf`} T={T} />
    </div>
  );
};

// ─── TEAM COMPOSITION REPORT ──────────────────────────────────
const TeamCompositionReport = ({ candidate, allData, T }) => {
    const batch = candidate.batch;
  
  if (!batch) {
    return (
      <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>🧩</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:T.t2, marginBottom:'8px' }}>No Batch Assigned</div>
        <div style={{ fontSize:'12px' }}>This candidate was not assessed as part of a named batch. The Team Composition Report requires a batch.</div>
      </div>
    );
  }

  const batchData = allData.filter(r => r.batch === batch && r.report_data?.validity?.overall !== 'red' && r.report_data?.scores);
  if (batchData.length < 2) {
    return (
      <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>⏳</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:T.t2, marginBottom:'8px' }}>Batch: {batch}</div>
        <div style={{ fontSize:'12px' }}>Only {batchData.length} valid response{batchData.length!==1?'s':''} in this batch. The Team Composition Report requires at least 2.</div>
      </div>
    );
  }

  const n = batchData.length;
  const dimKeys = ['O','C','E','A','ES','CQavg','OCBavg','LAavg','EOavg'];
  const dimLabels = {O:'Openness',C:'Conscientiousness',E:'Extraversion',A:'Agreeableness',ES:'Emotional Stability',CQavg:'Cultural Intelligence',OCBavg:'Team Citizenship',LAavg:'Learning Agility',EOavg:'Ethical Orientation'};
  
  const teamAvg = {};
  dimKeys.forEach(k => { teamAvg[k] = Math.round(batchData.reduce((a,b)=>a+(b.report_data?.scores?.[k]||0),0)/n); });

  const findings = [];
  dimKeys.forEach(k => {
    if(teamAvg[k] < 50) findings.push({sev:'critical', t:`Team ${dimLabels[k]} is critically low (avg ${teamAvg[k]})`, d:`This is a collective gap. The team will struggle with tasks requiring ${dimLabels[k]}.`});
    else if(teamAvg[k] < 60) findings.push({sev:'watch', t:`Team ${dimLabels[k]} is below optimal (avg ${teamAvg[k]})`, d:`Performance may be adequate today but fragile under pressure or change.`});
    else if(teamAvg[k] >= 75) findings.push({sev:'strength', t:`Team ${dimLabels[k]} is a collective strength (avg ${teamAvg[k]})`, d:`This is a competitive advantage. Protect and leverage it.`});
  });

  const dimGaps = dimKeys.map(k => ({k, l:dimLabels[k], v:teamAvg[k], gap:Math.max(0, 65-teamAvg[k])})).filter(g => g.gap > 0).sort((a,b)=>b.gap - a.gap).slice(0, 4);

  const ROLE_TARGETS = [
    {name:'Senior Manager', targets:{LRS:[65,95],ES:[60,90],C:[60,90],EOavg:[60,90]}},
    {name:'Team Lead', targets:{OCBavg:[60,95],A:[60,90],C:[55,85],E:[55,85]}},
    {name:'Compliance Officer', targets:{CII:[70,100],EOavg:[70,95],C:[65,95]}},
    {name:'Client-Facing Manager', targets:{E:[65,95],CQavg:[60,90],A:[60,90],SES:[60,95]}},
    {name:'Change Leader', targets:{ADS:[65,95],O:[65,95],LAavg:[65,95]}}
  ];
  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>{children}</div>
  );

  return (
    <div>
      <div id={`comp-report-${candidate.doc_id}`} style={{ padding: '10px' }}>
      <div style={{ background:T.bg0, borderRadius:'10px', padding:'20px', marginBottom:'14px', border:`1px solid ${T.b2}` }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'6px' }}>Team Composition Report · Batch: {batch}</div>
        <div style={{ fontSize:'12px', color:T.t2 }}>{n} valid responses analyzed for HR Strategy.</div>
      </div>

      {card(
        <>
          <SectionHead label="1. Composition Diagnostic" T={T} />
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {findings.map((f, i) => {
              const col = f.sev==='critical'?T.rd:f.sev==='watch'?T.am:T.gn;
              const bg = f.sev==='critical'?T.rdP:f.sev==='watch'?T.amP:T.gnP;
              return (
                <div key={i} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderLeft:`4px solid ${col}`, borderRadius:'8px', padding:'14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                    <span style={{ background:bg, color:col, padding:'2px 8px', borderRadius:'4px', fontSize:'9px', fontWeight:'800', textTransform:'uppercase' }}>{f.sev}</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:T.t0 }}>{f.t}</span>
                  </div>
                  <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.5' }}>{f.d}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {card(
        <>
          <SectionHead label="2. Hiring Profile Specification" T={T} />
          <p style={{ fontSize:'12px', color:T.t2, marginBottom:'16px' }}>Target these dimension ranges for your next hire to balance the team's current blind spots.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'10px', marginBottom:'24px' }}>
            {dimGaps.map((g, i) => (
              <div key={i} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderRadius:'8px', padding:'14px' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:T.t3, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'4px' }}>{g.l}</div>
                <div className="mono" style={{ fontSize:'16px', fontWeight:'800', color:T.t0 }}>≥ {Math.min(80, 75 - g.v + 10)} / 100</div>
                <div style={{ fontSize:'10px', color:T.t2, marginTop:'4px' }}>Current team avg: <span style={{ color:T.rd, fontWeight:'700' }}>{g.v}</span></div>
              </div>
            ))}
          </div>

          <SectionHead label="Targeted Interview Probes" T={T} />
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {dimGaps.slice(0,3).map((g, i) => {
              const probes = {
                'Conscientiousness': {q:'Describe a project with multiple stakeholders and a hard deadline where something went wrong. What specifically did you do to keep it on track?', l:'Concrete structural actions, not generic "I worked harder."'},
                'Emotional Stability': {q:'Describe a professional setback that genuinely shook you. What happened, and what did you do in the 30 days after?', l:'Honest acknowledgment of the difficulty paired with concrete recovery actions.'},
                'Learning Agility': {q:'Walk me through the most recent significant change in your professional knowledge or skills. What triggered it, and how did you sustain it?', l:'Self-directed learning, not mandatory training.'},
                'Ethical Orientation': {q:'Describe a situation where the easy path and the right path were different, and you chose the right path. What did it cost you?', l:'Real cost, specifically named. Candidates who claim there was no cost are sanitising the story.'},
                'Openness': {q:'Tell me about a time you had to adopt an approach you initially disagreed with. What changed your mind?', l:'Evidence of genuine re-evaluation, not just compliance.'},
                'Extraversion': {q:'Tell me about a time you had to influence a room full of people who were skeptical of your position. What did you do?', l:'Specific techniques used, reading the room, and willingness to engage conflict.'},
                'Agreeableness': {q:'Describe a situation where a peer strongly disagreed with a decision you had authority over. How did the disagreement unfold and resolve?', l:'Willingness to hear substance of the disagreement rather than deflecting it.'},
                'Cultural Intelligence': {q:'Tell me about a time your assumptions about how a colleague would behave turned out to be wrong.', l:'Genuine recognition of the error, not performed humility.'},
                'Team Citizenship': {q:'Tell me about something you did for your team or organisation in the last year that was not part of your formal role.', l:'Discretionary effort with specific examples.'}
              };
              const p = probes[g.l] || probes['Ethical Orientation'];
              return (
                <div key={i} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderLeft:`4px solid ${T.gold}`, borderRadius:'8px', padding:'14px' }}>
                  <div style={{ fontSize:'10px', fontWeight:'800', color:T.gold, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' }}>Targets: {g.l}</div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:T.t0, marginBottom:'6px' }}>"{p.q}"</div>
                  <div style={{ fontSize:'12px', color:T.t1 }}><strong>Listen for:</strong> {p.l}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {card(
        <>
          <SectionHead label="3. Promotion Fit Check" T={T} />
          <p style={{ fontSize:'12px', color:T.t2, marginBottom:'20px' }}>Candidate fit percentages mapped against target dimension ranges for key organisational roles.</p>
          
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px' }}>
            {ROLE_TARGETS.map((role, idx) => {
              const scored = batchData.map(b => {
                let match = 0, count = 0;
                Object.entries(role.targets).forEach(([k, [min, max]]) => {
                  const v = b.report_data?.scores?.[k] || b.report_data?.CI?.[k];
                  if(v != null) { count++; if(v >= min && v <= max) match++; else if(v >= min-10) match+=0.5; }
                });
                return { ...b, fitPct: count>0 ? Math.round((match/count)*100) : 0 };
              }).sort((a,b) => b.fitPct - a.fitPct);

              return (
                <div key={idx} style={{ background:T.bg3, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'16px' }}>
                  <div style={{ fontSize:'14px', fontWeight:'800', color:T.gold, marginBottom:'12px', borderBottom:`1px solid ${T.b2}`, paddingBottom:'8px' }}>
                    {role.name}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {scored.map((c, i) => {
                      // If there is an experience warning, force the color to Red
                      const col = c.expWarning ? T.rd : (c.fitPct >= 70 ? T.gn : c.fitPct >= 50 ? T.am : T.rd);
                      return (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'6px' }}>
                          <div>
                            <div style={{ fontSize:'12px', fontWeight:'700', color:T.t0, marginBottom:'2px' }}>{c.name}</div>
                            <div style={{ fontSize:'10px', color:T.t2 }}>{c.profile_name}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            {/* Show the Warning Text if it exists, otherwise show the Percentage */}
                            <div className="mono" style={{ fontSize:'14px', fontWeight:'800', color:col }}>
                              {c.expWarning ? c.expWarning : `${c.fitPct}%`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      </div>
      <DownloadBtn elementId={`comp-report-${candidate.doc_id}`} filename={`${batch}_Team_Composition.pdf`} T={T} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CANDIDATE DETAIL MODAL — all 5 reports
// ═══════════════════════════════════════════════════════════════
const REPORT_TABS = [
  { id:'tech',    label:'📊 Technical Report',      sub:'HR & Leadership' },
  { id:'action',  label:'🧭 Action Plan',            sub:'Individual' },
  { id:'player',  label:'🎮 Player Report',          sub:'Gamified' },
  { id:'team',    label:'👥 Team Aggregate',         sub:'Batch-Level' },
  { id:'comp',    label:'🧩 Team Composition',       sub:'HR Strategy' },
  { id:'persona', label:'📸 Persona Card',           sub:'Shareable' },
  { id:'evidence',label:'📎 Evidence & Uploads',     sub:'Verification' },
];

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
        <img src="/logo.svg" alt="CORE" style={{height:'60px', objectFit:'contain'}} />
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

const CandidateModal = ({ candidate, onClose, T, allData }) => {
  const [reportTab, setReportTab] = useState('tech');
  if (!candidate) return null;

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
            {REPORT_TABS.map(tab => (
              <button key={tab.id} onClick={()=>setReportTab(tab.id)} className="report-tab-btn"
                style={{
                  padding:'10px 18px', borderRadius:'8px 8px 0 0',
                  border:`1px solid ${reportTab===tab.id ? T.b2 : 'transparent'}`,
                  borderBottom: reportTab===tab.id ? `1px solid ${T.bg1}` : `1px solid ${T.b2}`,
                  background: reportTab===tab.id ? T.bg1 : 'transparent',
                  color: reportTab===tab.id ? T.t0 : T.t3,
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
          {reportTab === 'tech'   && <TechnicalReport  candidate={candidate} T={T} />}
          {reportTab === 'action' && <ActionPlanReport candidate={candidate} T={T} />}
          {reportTab === 'player' && <PlayerReport     candidate={candidate} T={T} />}
          {reportTab === 'team'   && <TeamReport       candidate={candidate} allData={allData} T={T} />}
{reportTab === 'comp'   && <TeamCompositionReport candidate={candidate} allData={allData} T={T} />}
          {reportTab === 'persona' && <PersonaCard candidate={candidate} T={T} />}
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
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.assessment_type === 'org' ? '🏢 Org' : r.assessment_type === 'ind' ? '👤 Ind' : '—'}</td>
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
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600', whiteSpace:'nowrap' }}>{r.assessment_type === 'org' ? '🏢 Org' : r.assessment_type === 'ind' ? '👤 Ind' : '—'}</td>
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
export default function Dashboard() {
  const [assessments, setAssessments]    = useState([]);
  const [loading, setLoading]            = useState(true);
  const [error, setError]                = useState(null);
  const [activeTab, setActiveTab]        = useState('overview');
  const [selectedCandidate, setSelected] = useState(null);
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('themeMode')||'dark'; } catch(e) { return 'dark'; }
  });

  const T = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    fetch('https://core-by-carnelian-backend.onrender.com/api/assessments')
      .then(res=>{ if(!res.ok) throw new Error('API error'); return res.json(); })
      .then(data=>{ setAssessments(data); setLoading(false); })
      .catch(err=>{ console.error(err); setError('Failed to connect to the database.'); setLoading(false); });
  }, []);

  const TAB_COMPONENTS = {
    overview: <OverviewTab data={assessments} T={T} onSelect={setSelected} />,
    profiles: <ProfilesTab data={assessments} T={T} onSelect={setSelected} />,
    scores:   <ScoresTab   data={assessments} T={T} onSelect={setSelected} />,
    validity: <ValidityTab data={assessments} T={T} onSelect={setSelected} />,
    industry: <IndustryTab data={assessments} T={T} onSelect={setSelected} />,
  };

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
              <Pill label={`${assessments.length} records`} color={T.gold} />
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
        />
      )}
    </>
  );
}