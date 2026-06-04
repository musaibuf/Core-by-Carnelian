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
  { k:'OCEANavg', l:'Personality (OCEAN)' },
  { k:'CQavg',    l:'Cultural Intelligence' },
  { k:'OCBavg',   l:'Org. Citizenship' },
  { k:'LAavg',    l:'Learning Agility' },
  { k:'EOavg',    l:'Ethical Orientation' },
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

const SectionHead = ({ label, T }) => (
  <div style={{
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold,
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

// ─── RADAR CHART ─────────────────────────────────────────────
const RadarChart = ({ scores, T, size=180 }) => {
  const dims = [
    { k:'OCEANavg', l:'Personality' },
    { k:'CQavg',    l:'Cultural IQ' },
    { k:'OCBavg',   l:'Citizenship' },
    { k:'LAavg',    l:'Learning' },
    { k:'EOavg',    l:'Integrity' },
  ];
  const cx=size/2, cy=size/2, r=size*0.36, n=dims.length;
  const angle=(i)=>(i*2*Math.PI)/n - Math.PI/2;
  const pt=(i,val)=>{ const a=angle(i),ratio=(val||0)/100; return { x:cx+r*ratio*Math.cos(a), y:cy+r*ratio*Math.sin(a) }; };
  const outerPt=(i)=>({ x:cx+r*Math.cos(angle(i)), y:cy+r*Math.sin(angle(i)) });
  const polygon=dims.map((d,i)=>{ const p=pt(i,scores[d.k]); return `${p.x},${p.y}`; }).join(' ');
  return (
    <svg width={size} height={size} style={{ overflow:'visible' }}>
      {[0.25,0.5,0.75,1].map(lvl=>{
        const pts=dims.map((_,i)=>{ const a=angle(i); return `${cx+r*lvl*Math.cos(a)},${cy+r*lvl*Math.sin(a)}`; }).join(' ');
        return <polygon key={lvl} points={pts} fill="none" stroke={T.b1} strokeWidth="1" />;
      })}
      {dims.map((_,i)=>{ const op=outerPt(i); return <line key={i} x1={cx} y1={cy} x2={op.x} y2={op.y} stroke={T.b2} strokeWidth="1" />; })}
      <polygon points={polygon} fill={`${T.c}28`} stroke={T.c} strokeWidth="2" strokeLinejoin="round" />
      {dims.map((d,i)=>{ const p=pt(i,scores[d.k]); return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={T.c} />; })}
      {dims.map((d,i)=>{
        const lx=cx+(r+18)*Math.cos(angle(i)), ly=cy+(r+18)*Math.sin(angle(i));
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'JetBrains Mono',monospace" fontSize="8" fontWeight="700" fill={T.t3}
            style={{ textTransform:'uppercase', letterSpacing:'0.06em' }}>{d.l}</text>
        );
      })}
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

  const recommendedRoles  = roles.filter(r => r.score >= r.g);
  const conditionalRoles  = roles.filter(r => r.score >= r.a && r.score < r.g);
  const highRiskRoles     = roles.filter(r => r.score < r.a);

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>
      {children}
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      {card(
        <>
          <SectionHead label="CORE v3.0 · Technical Report · Restricted — HR Leadership Only" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:'700', color:T.t0, marginBottom:'4px' }}>{candidate.name}</div>
              <div style={{ fontSize:'12px', color:T.t2, fontWeight:'600', marginBottom:'8px' }}>
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
                {MODULE_KEYS.map(({ k, l }) => (
                  <div key={k} style={{ background:T.bg3, borderRadius:'6px', padding:'8px', textAlign:'center' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||'—'}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'2px', fontWeight:'600', lineHeight:'1.3' }}>{l.split(' ')[0]}</div>
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
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:'700', fontSize:'1.1rem', color:T.t0 }}>{v.n}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t2, marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600' }}>{v.l}</div>
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
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
                  const val  = CI[k] || S[k] || 0;
                  const col  = bCol(val,T);
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
                      <td style={{ padding:'10px 10px' }}><ScoreBadge score={val} T={T} /></td>
                      <td style={{ padding:'10px 10px', width:'120px' }}>
                        <div style={{ height:'6px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
                          <div style={{ width:`${val}%`, height:'100%', background:barGrad(val) }} />
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
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
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
          <SectionHead label="Module 1 — Personality at Work (OCEAN)" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
            {OCEAN_KEYS.map(k => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'700' }}>{OCEAN_LABELS[k]}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CQ */}
      {card(
        <>
          <SectionHead label="Module 2 — Cultural Intelligence (CQ)" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            {CQ_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||0}</div>
                <MiniBar score={S[k]||0} w="100%" h={5} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* OCB */}
      {card(
        <>
          <SectionHead label="Module 3 — Organisational Citizenship Behaviour (OCB)" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
            {OCB_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* LEARNING AGILITY */}
      {card(
        <>
          <SectionHead label="Module 4 — Adaptive Thinking & Learning Agility" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {LA_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||0}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k]||0)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ETHICAL ORIENTATION */}
      {card(
        <>
          <SectionHead label="Module 5 — Integrity & Ethical Orientation" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {EO_KEYS.map(({ k, l }) => (
              <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'14px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'5px', fontWeight:'700', lineHeight:'1.3' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:bCol(S[k]||0,T), fontWeight:'700' }}>{S[k]||0}</div>
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
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
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
  );
};

// ─── ACTION PLAN REPORT (candidate development roadmap) ───────
const ActionPlanReport = ({ candidate, T }) => {
  const rd      = candidate.report_data || {};
  const S       = rd.scores   || {};
  const CI      = rd.CI       || {};
  const profile = rd.profile  || {};

  const allDims = [
    { k:'C',      l:'Conscientiousness',   v:S.C      },
    { k:'O',      l:'Openness to Ideas',   v:S.O      },
    { k:'E',      l:'Social Confidence',   v:S.E      },
    { k:'A',      l:'Collaborative Spirit',v:S.A      },
    { k:'ES',     l:'Emotional Resilience',v:S.ES     },
    { k:'CQavg',  l:'Cultural Intelligence',v:S.CQavg },
    { k:'OCBavg', l:'Team Citizenship',    v:S.OCBavg },
    { k:'LAavg',  l:'Learning Agility',    v:S.LAavg  },
    { k:'EOavg',  l:'Ethical Integrity',   v:S.EOavg  },
  ].filter(d => d.v != null).sort((a,b) => b.v-a.v);

  const top2 = allDims.slice(0,2);
  const bot2 = [...allDims].sort((a,b)=>a.v-b.v).slice(0,2);

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>
      {children}
    </div>
  );

  return (
    <div>
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
            {allDims.map(d => (
              <div key={d.k} style={{ marginBottom:'4px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'3px' }}>
                  <span style={{ fontSize:'12px', color:T.t0, fontWeight:'700' }}>{d.l}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:bCol(d.v,T), fontWeight:'700' }}>{d.v}/100 · {d.v>=75?'Strong':d.v>=55?'Developing':'Priority'}</span>
                </div>
                <div style={{ height:'7px', background:T.b1, borderRadius:'100px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${d.v}%`, background:barGrad(d.v), borderRadius:'100px', transition:'width 0.8s ease' }} />
                </div>
              </div>
            ))}
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
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.gn, fontWeight:'700' }}>{d.v}/100</div>
              </div>
            ))}
            {bot2.map(d => (
              <div key={d.k} style={{ padding:'18px', borderRadius:'10px', background:T.rdP, border:`1px solid ${T.rd}40`, borderLeft:`5px solid ${T.rd}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:T.rd, marginBottom:'6px' }}>◈ Priority Development</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:'700', marginBottom:'6px', color:T.rd }}>{d.l}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.rd, fontWeight:'700' }}>{d.v}/100 — highest-impact development area</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PRIORITY MATRIX */}
      {card(
        <>
          <SectionHead label="Priority Action Matrix" T={T} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[
              { label:'🔴 Act Now (0–30 Days)',  items:allDims.filter(d=>d.v<45),  bg:T.rdP, bc:T.rd  },
              { label:'🟡 Build Soon (30–90 Days)', items:allDims.filter(d=>d.v>=45&&d.v<60), bg:T.amP, bc:T.am },
              { label:'🟢 Sustain & Expand',    items:allDims.filter(d=>d.v>=75),  bg:T.gnP, bc:T.gn  },
              { label:'🔵 Monitor Progress',    items:allDims.filter(d=>d.v>=60&&d.v<75), bg:T.b0,  bc:T.b2  },
            ].map(({ label, items, bg, bc }) => (
              <div key={label} style={{ background:bg, border:`1px solid ${bc}40`, borderRadius:'10px', padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'800', color:T.t1, marginBottom:'8px' }}>{label}</div>
                <ul style={{ paddingLeft:'18px', margin:0, color:T.t0, fontSize:'12px', lineHeight:'1.7', fontWeight:'600' }}>
                  {items.length ? items.map(d => <li key={d.k}>{d.l}</li>) : <li style={{ color:T.t3 }}>None identified</li>}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DEVELOPMENT ROADMAP — stored actions from assessment */}
      {rd.devAreas && rd.devAreas.length > 0 && card(
        <>
          <SectionHead label={`Development Roadmap${candidate.industry ? ` — ${candidate.industry}` : ''}`} T={T} />
          {rd.devAreas.map((d, i) => {
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
                <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.7', marginBottom:'12px', fontWeight:'600' }}>{d.why}</div>
                {d.acts && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                    {d.acts.map((act, ai) => (
                      <div key={ai} style={{ display:'flex', gap:'8px', alignItems:'flex-start', fontSize:'12px', color:T.t2, padding:'6px 0', borderTop:ai>0?`1px solid ${T.b1}`:'none' }}>
                        <span style={{ color:T.c, flexShrink:0 }}>→</span>{act}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display:'flex', gap:'6px', marginTop:'10px', flexWrap:'wrap' }}>
                  {d.now  && <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.rdP, color:T.rd, border:`1px solid ${T.rd}40` }}>🔴 Now: {d.now}</span>}
                  {d.soon && <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.amP, color:T.am, border:`1px solid ${T.am}40` }}>🟡 Soon: {d.soon}</span>}
                  {d.fut  && <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:'700', background:T.gnP, color:T.gn, border:`1px solid ${T.gn}40` }}>🟢 Future: {d.fut}</span>}
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ background:T.bg3, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'16px 18px', fontSize:'12px', color:T.t2, lineHeight:'1.7', fontWeight:'600', marginBottom:'14px' }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, fontWeight:'700', marginBottom:'6px' }}>CORE v3.0 · Carnelian Pvt Ltd · {candidate.doc_id} · {new Date(candidate.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}</div>
        This report is written for {candidate.name}. It contains no HR risk language. Questions: hello@carnelianco.com
      </div>
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
  const earnedXP = baseXP + compBonus;

  const LEVELS = [
    {n:1,l:'NOVICE',min:0},{n:2,l:'APPRENTICE',min:5000},{n:3,l:'PRACTITIONER',min:8000},
    {n:4,l:'PROFESSIONAL',min:11000},{n:5,l:'ADVANCED',min:14000},{n:6,l:'SENIOR',min:17000},
    {n:7,l:'EXPERT',min:20000},{n:8,l:'MASTER',min:23000},{n:9,l:'ELITE',min:26000},{n:10,l:'LEGEND',min:29000},
  ];
  const curLvl  = [...LEVELS].reverse().find(l=>earnedXP>=l.min) || LEVELS[0];
  const nextLvl = LEVELS[Math.min(curLvl.n,9)];
  const lvlPct  = nextLvl && nextLvl.min > curLvl.min
    ? Math.min(100, Math.round(((earnedXP-curLvl.min)/(nextLvl.min-curLvl.min))*100)) : 100;

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
    <div style={{ background:'#07091a', borderRadius:'12px', padding:'20px', minHeight:'400px' }}>
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
                <span style={{ color:accentCol, fontWeight:'800' }}>{earnedXP.toLocaleString()}</span> XP
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
          {[['XP (Scores)',earnedXP,'#60a5fa'],['Achievements',ACHIEVEMENTS.reduce((a,b)=>a+b.xp,0),'#4ade80'],['Overall',S.overall||0,'#C8A84B'],['Level',curLvl.n,'#e879f9']].map(([l,v,c])=>(
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
      {/* HEADER */}
      <div style={{ background:T.bg0, borderRadius:'10px', padding:'20px', marginBottom:'14px', border:`1px solid ${T.b2}` }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'6px' }}>Team Aggregate Report · Batch: {batch}</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px' }}>
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
                  const col = bCol(v,T);
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
  );
};

// ─── TEAM COMPOSITION REPORT ──────────────────────────────────
const TeamCompositionReport = ({ candidate, allData, T }) => {
  const [promoRole, setPromoRole] = useState(0);
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
  const targetRole = ROLE_TARGETS[promoRole];
  
  const scoredCandidates = batchData.map(b => {
    let match = 0, count = 0;
    Object.entries(targetRole.targets).forEach(([k, [min, max]]) => {
      const v = b.report_data?.scores?.[k] || b.report_data?.CI?.[k];
      if(v != null) { count++; if(v >= min && v <= max) match++; else if(v >= min-10) match+=0.5; }
    });
    return { ...b, fitPct: count>0 ? Math.round((match/count)*100) : 0 };
  }).sort((a,b) => b.fitPct - a.fitPct);

  const card = (children, style={}) => (
    <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'14px', ...style }}>{children}</div>
  );

  return (
    <div>
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
          <div style={{ marginBottom:'16px' }}>
            <select value={promoRole} onChange={e=>setPromoRole(parseInt(e.target.value))} style={{ padding:'10px 14px', borderRadius:'6px', border:`1px solid ${T.b2}`, background:T.bg3, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', outline:'none', cursor:'pointer' }}>
              {ROLE_TARGETS.map((r, i) => <option key={i} value={i}>{r.name}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {scoredCandidates.map((c, i) => {
              const col = c.fitPct >= 70 ? T.gn : c.fitPct >= 50 ? T.am : T.rd;
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px', background:T.bg3, border:`1px solid ${T.b1}`, borderRadius:'8px' }}>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:T.t0, marginBottom:'2px' }}>{c.name}</div>
                    <div style={{ fontSize:'11px', color:T.t2 }}>{c.profile_name}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="mono" style={{ fontSize:'16px', fontWeight:'800', color:col }}>{c.fitPct}%</div>
                    <div style={{ fontSize:'9px', fontWeight:'700', color:col, textTransform:'uppercase', letterSpacing:'0.05em' }}>Fit Match</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
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
];

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
                {['Name','Role / Dept','Score','Profile','Validity','Date'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5).map((r,i) => (
                <tr key={r.id||i} className="row-hover" onClick={()=>onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
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
                  { l:'Name', k:'name' }, { l:'Email', k:'email' },
                  { l:'Department', k:'department' }, { l:'Role', k:'role' },
                  { l:'Score', k:'overall_score' }, { l:'Profile', k:'profile_name' },
                  { l:'Validity', k:null }, { l:'Date', k:'created_at' }, { l:'', k:null },
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
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.email}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.department}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}</td>
                  <td style={{ padding:'12px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.c, fontWeight:'700', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.profile_name}</td>
                  <td style={{ padding:'12px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
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
  const avgMod = MODULE_KEYS.map(({ k, l }) => {
    const avg = Math.round(data.reduce((s,r)=>s+(r.report_data?.scores?.[k]||0),0)/total);
    return { k, l, avg };
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
        {avgMod.map(({ k, l, avg }) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
            <div style={{ width:'200px', fontSize:'12px', color:T.t1, fontWeight:'700', flexShrink:0 }}>{l}</div>
            <div style={{ flex:1, height:'7px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ width:`${avg}%`, height:'100%', background:barGrad(avg), transition:'width 0.8s ease' }} />
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'13px', color:bCol(avg,T), fontWeight:'700', width:'36px', textAlign:'right' }}>{avg}</span>
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