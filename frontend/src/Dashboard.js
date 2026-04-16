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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const bd = (v) => v >= 75 ? 'High' : v >= 50 ? 'Moderate' : 'Low';
const bCol = (v, T) => v >= 75 ? T.gn : v >= 50 ? T.am : T.rd;
const bBg  = (v, T) => v >= 75 ? T.gnP : v >= 50 ? T.amP : T.rdP;
const barGrad = (v) =>
  v >= 75 ? 'linear-gradient(90deg,#22c55e,#4ade80)'
  : v >= 50 ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
  : 'linear-gradient(90deg,#ef4444,#f87171)';

const validityColor = (overall, T) =>
  overall === 'green' ? T.gn : overall === 'amber' ? T.am : T.rd;

const COMPOSITE_KEYS = [
  { k: 'CII', l: 'Compliance & Integrity', green: 70, amber: 54 },
  { k: 'LRS', l: 'Leadership Readiness',   green: 72, amber: 55 },
  { k: 'TVS', l: 'Team Value',             green: 68, amber: 51 },
  { k: 'ADS', l: 'Adaptability',           green: 67, amber: 50 },
  { k: 'SES', l: 'Stakeholder Effective.', green: 68, amber: 52 },
  { k: 'OPS', l: 'Operational Reliability',green: 67, amber: 51 },
  { k: 'PMS', l: 'People Management',      green: 67, amber: 51 },
];
const OCEAN_KEYS = ['O','C','E','A','ES'];
const OCEAN_LABELS = { O:'Openness', C:'Conscientiousness', E:'Extraversion', A:'Agreeableness', ES:'Emotional Stability' };
const MODULE_KEYS = [
  { k:'OCEANavg', l:'Personality (OCEAN)' },
  { k:'CQavg',    l:'Cultural Intelligence' },
  { k:'OCBavg',   l:'Organisational Citizenship' },
  { k:'LAavg',    l:'Learning Agility' },
  { k:'EOavg',    l:'Ethical Orientation' },
];

// ─── FONTS & GLOBAL STYLES ────────────────────────────────────────────────────
const DashStyles = ({ T }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-font-smoothing: antialiased; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${T.bg0}; color: ${T.t0}; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: ${T.bg0}; }
    ::-webkit-scrollbar-thumb { background: ${T.b2}; border-radius: 2px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
    @keyframes shimmer { from { background-position:-200% center; } to { background-position:200% center; } }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    .dash-anim { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-2 { animation: fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-3 { animation: fadeUp 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-anim-4 { animation: fadeUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both; }
    .modal-in { animation: scaleIn 0.25s cubic-bezier(0.22,1,0.36,1) both; }
    .row-hover:hover { background: ${T.bg2} !important; cursor: pointer; }
    .sidebar-item { transition: all 0.18s; border-radius: 7px; }
    .sidebar-item:hover { background: ${T.b1} !important; }
    .tab-btn { transition: all 0.18s; }
    .tab-btn:hover { color: ${T.t0} !important; background: ${T.b1} !important; }
    .sort-th { cursor: pointer; user-select: none; }
    .sort-th:hover { color: ${T.t0} !important; }
    .chip-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .search-inp:focus { outline: none; border-color: ${T.c} !important; box-shadow: 0 0 0 3px ${T.cGlow}; }
    .filter-select:focus { outline: none; border-color: ${T.c} !important; }
    .action-btn:hover { background: ${T.cDark} !important; transform: translateY(-1px); }
    .close-btn:hover { background: ${T.b2} !important; color: ${T.t0} !important; }
    .nav-tab:hover { color: ${T.t0} !important; }
    .metric-card:hover { border-color: ${T.bC} !important; transform: translateY(-3px); }
    .metric-card { transition: all 0.2s; }
    @media (max-width: 900px) {
      .sidebar { display: none !important; }
      .main-content { margin-left: 0 !important; }
    }
  `}</style>
);

// ─── MINI COMPONENTS ──────────────────────────────────────────────────────────
const Pill = ({ label, color, bg, style = {} }) => (
  <span style={{
    display:'inline-block', padding:'5px 12px', borderRadius:'3px',
    fontSize:'9px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase',
    fontFamily:"'JetBrains Mono',monospace",
    color: color, background: bg || `${color}18`, border: `1px solid ${color}35`,
    ...style
  }}>{label}</span>
);

const ScoreBadge = ({ score, T }) => (
  <span style={{
    display:'inline-block', padding:'3px 10px', borderRadius:'3px',
    fontSize:'11px', fontWeight:'700', fontFamily:"'JetBrains Mono',monospace",
    background: bBg(score, T), color: bCol(score, T),
    border: `1px solid ${bCol(score, T)}40`,
  }}>{score}/100</span>
);

const MiniBar = ({ score, w = 80, h = 4 }) => (
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

const GoldLine = ({ style = {} }) => (
  <div style={{ height:'2px', background:'linear-gradient(90deg, #B01C24, #C8A84B, transparent)', ...style }} />
);

// ─── SPARKLINE (SVG mini chart) ───────────────────────────────────────────────
const SparkLine = ({ data, color = '#C8A84B', w = 80, h = 28 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow:'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(pts.split(' ').pop().split(',')[0])} cy={parseFloat(pts.split(' ').pop().split(',')[1])} r="3" fill={color} />
    </svg>
  );
};

// ─── RADAR CHART (SVG) ────────────────────────────────────────────────────────
const RadarChart = ({ scores, T, size = 180 }) => {
  const dims = [
    { k:'OCEANavg', l:'Personality' },
    { k:'CQavg',    l:'Cultural IQ' },
    { k:'OCBavg',   l:'Citizenship' },
    { k:'LAavg',    l:'Learning' },
    { k:'EOavg',    l:'Integrity' },
  ];
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const n = dims.length;
  const angle = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const pt = (i, val) => {
    const a = angle(i), ratio = (val || 0) / 100;
    return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a) };
  };
  const outerPt = (i) => ({ x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) });
  const polygon = dims.map((d, i) => { const p = pt(i, scores[d.k]); return `${p.x},${p.y}`; }).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg width={size} height={size} style={{ overflow:'visible' }}>
      {gridLevels.map(lvl => {
        const pts = dims.map((_, i) => {
          const a = angle(i);
          return `${cx + r * lvl * Math.cos(a)},${cy + r * lvl * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={lvl} points={pts} fill="none" stroke={T.b1} strokeWidth="1" />;
      })}
      {dims.map((_, i) => {
        const op = outerPt(i);
        return <line key={i} x1={cx} y1={cy} x2={op.x} y2={op.y} stroke={T.b2} strokeWidth="1" />;
      })}
      <polygon points={polygon} fill={`${T.c}28`} stroke={T.c} strokeWidth="2" strokeLinejoin="round" />
      {dims.map((d, i) => {
        const p = pt(i, scores[d.k]);
        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={T.c} />;
      })}
      {dims.map((d, i) => {
        const op = outerPt(i);
        const lx = cx + (r + 18) * Math.cos(angle(i));
        const ly = cy + (r + 18) * Math.sin(angle(i));
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'JetBrains Mono',monospace" fontSize="8" fontWeight="700"
            fill={T.t3} style={{ textTransform:'uppercase', letterSpacing:'0.06em' }}>
            {d.l}
          </text>
        );
      })}
    </svg>
  );
};

// ─── DISTRIBUTION BAR ─────────────────────────────────────────────────────────
const DistBar = ({ value, max, label, color, T }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
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

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const TABS = [
  { id:'overview',    icon:'⊞', label:'Overview' },
  { id:'profiles',    icon:'◈', label:'Candidate Profiles' },
  { id:'scores',      icon:'◉', label:'Score Analytics' },
  { id:'validity',    icon:'◎', label:'Validity Monitor' },
  { id:'industry',    icon:'◑', label:'Industry Breakdown' },
];

const Sidebar = ({ activeTab, setActiveTab, T, total }) => (
  <aside className="sidebar" style={{
    width:'240px', flexShrink:0,
    background:T.bg1, borderRight:`1px solid ${T.b2}`,
    display:'flex', flexDirection:'column',
    position:'sticky', top:0, height:'100vh', overflow:'auto',
  }}>
    <div style={{ padding:'28px 24px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
        <img src="/logo.png" alt="Carnelian" style={{ height:'26px', objectFit:'contain' }}
          onError={e => { e.target.style.display='none'; }} />
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
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="sidebar-item"
          style={{
            display:'flex', alignItems:'center', gap:'12px',
            width:'100%', padding:'10px 14px', marginBottom:'2px',
            background: activeTab === tab.id ? `${T.c}18` : 'transparent',
            border: `1px solid ${activeTab === tab.id ? T.bC : 'transparent'}`,
            borderRadius:'7px', cursor:'pointer', textAlign:'left',
            color: activeTab === tab.id ? T.c : T.t2,
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontSize:'13px', fontWeight:'700', transition:'all 0.18s',
          }}>
          <span style={{ fontSize:'14px', flexShrink:0 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>

    <div style={{ padding:'16px 20px', borderTop:`1px solid ${T.b2}` }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', lineHeight:'1.7' }}>
        <div>{total} record{total !== 1 ? 's' : ''} loaded</div>
        <div style={{ color:T.t3, marginTop:'2px' }}>© Carnelian Pvt Ltd</div>
      </div>
    </div>
  </aside>
);

// ─── CANDIDATE DETAIL MODAL ───────────────────────────────────────────────────
const CandidateModal = ({ candidate, onClose, T }) => {
  if (!candidate) return null;
  const { report_data: rd } = candidate;
  const S = rd?.scores || {};
  const validity = rd?.validity || {};
  const profile  = rd?.profile  || {};
  const roles    = rd?.roles    || []; // This contains the HR Suitability Matrix

  // Group roles by Suitability
  const recommendedRoles = roles.filter(r => r.score >= r.g);
  const conditionalRoles = roles.filter(r => r.score >= r.a && r.score < r.g);
  const highRiskRoles    = roles.filter(r => r.score < r.a);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'24px',
    }} onClick={onClose}>
      <div className="modal-in" style={{
        maxWidth:'1000px', width:'100%', maxHeight:'90vh', overflow:'auto',
        background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'14px',
        boxShadow:`0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${T.b2}`,
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          background:T.bg0, padding:'28px 32px 20px',
          borderBottom:`1px solid ${T.b2}`, borderRadius:'14px 14px 0 0',
          position:'sticky', top:0, zIndex:10,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'4px', fontWeight:'700' }}>
                Technical Report · {candidate.doc_id}
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontWeight:'700', color:T.t0, marginBottom:'4px' }}>
                {candidate.name}
              </h2>
              <div style={{ fontSize:'12px', color:T.t2, fontWeight:'600' }}>
                {candidate.role}{candidate.department ? ` · ${candidate.department}` : ''} · {candidate.industry}
              </div>
            </div>
            <button onClick={onClose} className="close-btn" style={{
              width:'36px', height:'36px', borderRadius:'50%', border:`1px solid ${T.b2}`,
              background:'transparent', color:T.t2, cursor:'pointer', fontSize:'18px',
              display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s',
            }}>✕</button>
          </div>

          <div style={{ display:'flex', gap:'8px', marginTop:'16px', flexWrap:'wrap' }}>
            <ScoreBadge score={S.overall || candidate.overall_score} T={T} />
            <Pill label={profile.name || candidate.profile_name} color={T.c} />
            <ValidityDot overall={validity.overall} T={T} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', alignSelf:'center' }}>
              {new Date(candidate.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}
            </span>
          </div>
        </div>

        <div style={{ padding:'24px 32px' }}>
          
          {/* Top Grid: Radar & Modules */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
            <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px', alignSelf:'flex-start' }}>Composite Radar</div>
              <RadarChart scores={S} T={T} size={200} />
            </div>

            <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Module Scores</div>
              {MODULE_KEYS.map(({ k, l }) => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ width:'140px', fontSize:'11px', color:T.t2, fontWeight:'600', flexShrink:0 }}>{l}</div>
                  <div style={{ flex:1, height:'5px', background:T.b1, borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ width:`${S[k] || 0}%`, height:'100%', background:barGrad(S[k]), transition:'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:bCol(S[k], T), fontWeight:'700', width:'30px', textAlign:'right' }}>{S[k]}</span>
                </div>
              ))}
              <div style={{ marginTop:'16px', paddingTop:'14px', borderTop:`1px solid ${T.b1}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ fontSize:'12px', color:T.t0, fontWeight:'800', flex:1 }}>OVERALL</div>
                  <MiniBar score={S.overall || 0} w={80} h={6} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'14px', color:T.gold, fontWeight:'700' }}>{S.overall || candidate.overall_score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEW SECTION: ROLE SUITABILITY & COMMITTEE PLACEMENT ── */}
          <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'24px', marginBottom:'16px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Role Suitability & Placement Guide</div>
            
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
              {/* Green: Recommended */}
              <div style={{ background:T.gnP, border:`1px solid ${T.gn}40`, borderRadius:'8px', padding:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                  <span style={{ fontSize:'16px' }}>✅</span>
                  <span style={{ fontSize:'13px', fontWeight:'800', color:T.gn }}>Suitable For</span>
                </div>
                {recommendedRoles.length > 0 ? recommendedRoles.map(r => (
                  <div key={r.name} style={{ fontSize:'12px', color:T.t0, fontWeight:'600', marginBottom:'6px', borderBottom:`1px solid ${T.b1}`, paddingBottom:'6px' }}>• {r.name}</div>
                )) : <div style={{ fontSize:'11px', color:T.t2 }}>No strong recommendations.</div>}
              </div>

              {/* Amber: Conditional */}
              <div style={{ background:T.amP, border:`1px solid ${T.am}40`, borderRadius:'8px', padding:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                  <span style={{ fontSize:'16px' }}>⚠️</span>
                  <span style={{ fontSize:'13px', fontWeight:'800', color:T.am }}>Conditional Placements</span>
                </div>
                {conditionalRoles.length > 0 ? conditionalRoles.map(r => (
                  <div key={r.name} style={{ fontSize:'12px', color:T.t0, fontWeight:'600', marginBottom:'6px', borderBottom:`1px solid ${T.b1}`, paddingBottom:'6px' }}>• {r.name}</div>
                )) : <div style={{ fontSize:'11px', color:T.t2 }}>None.</div>}
              </div>

              {/* Red: High Risk */}
              <div style={{ background:T.rdP, border:`1px solid ${T.rd}40`, borderRadius:'8px', padding:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                  <span style={{ fontSize:'16px' }}>🚫</span>
                  <span style={{ fontSize:'13px', fontWeight:'800', color:T.rd }}>High Risk / Do Not Place</span>
                </div>
                {highRiskRoles.length > 0 ? highRiskRoles.map(r => (
                  <div key={r.name} style={{ marginBottom:'10px', borderBottom:`1px solid ${T.rd}30`, paddingBottom:'6px' }}>
                    <div style={{ fontSize:'12px', color:T.t0, fontWeight:'700', marginBottom:'4px' }}>• {r.name}</div>
                    <div style={{ fontSize:'10px', color:T.rd, lineHeight:'1.4', fontWeight:'600' }}>{r.redNote}</div>
                  </div>
                )) : <div style={{ fontSize:'11px', color:T.t2 }}>No high-risk areas detected.</div>}
              </div>
            </div>

            {/* Generated Interview Probes (Highly valuable for Admin) */}
            {highRiskRoles.length > 0 && (
              <div style={{ marginTop:'20px', background:T.bg1, padding:'16px', borderRadius:'8px', borderLeft:`4px solid ${T.rd}` }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:T.rd, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>Generated Interview Probes (For HR)</div>
                <div style={{ fontSize:'12px', color:T.t1, lineHeight:'1.6', fontWeight:'500' }}>
                  {highRiskRoles.map(r => (
                    <div key={r.name} style={{ marginBottom:'12px' }}>
                      <strong style={{ color:T.t0 }}>For {r.name}:</strong>
                      <ul style={{ paddingLeft:'20px', marginTop:'4px' }}>
                        {r.probeQ.map((q, i) => <li key={i} style={{ marginBottom:'4px' }}>{q}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Sections Below */}
          <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Composite Indices</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
              {COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
                const val = rd?.CI?.[k] || S[k] || 0;
                const col = bCol(val, T);
                const rat = val >= green ? 'Suitable' : val >= amber ? 'Conditional' : 'Not Rec.';
                return (
                  <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', border:`1px solid ${col}25`, textAlign:'center' }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'700' }}>{l}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:col, fontWeight:'700', lineHeight:'1' }}>{val}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:col, fontWeight:'700', marginTop:'4px' }}>{rat}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:T.bg2, border:`1px solid ${T.b1}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>OCEAN Personality Dimensions</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
              {OCEAN_KEYS.map(k => (
                <div key={k} style={{ background:T.bg3, borderRadius:'7px', padding:'12px', textAlign:'center', border:`1px solid ${T.b1}` }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'5px', fontWeight:'700' }}>{OCEAN_LABELS[k]}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:bCol(S[k], T), fontWeight:'700' }}>{S[k] || 0}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, marginTop:'3px', fontWeight:'600' }}>{bd(S[k] || 0)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: validity.overall === 'green' ? T.gnP : validity.overall === 'amber' ? T.amP : T.rdP,
            border: `1px solid ${validityColor(validity.overall, T)}35`,
            borderRadius:'10px', padding:'20px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <ValidityDot overall={validity.overall} T={T} />
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:'700', color:T.t0 }}>{validity.overallLabel}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'12px' }}>
              {[
                { n:`${validity.lAgree}/12`, l:'L-Scale' },
                { n:`${Math.round((validity.saRatio||0)*100)}%`, l:'Strongly Agree' },
                { n:`${Math.round((validity.extRatio||0)*100)}%`, l:'Extreme Resp.' },
                { n:`${validity.conScore}/100`, l:'Consistency' },
              ].map((v, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.35)', borderRadius:'6px', padding:'10px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:'700', fontSize:'1.1rem', color:T.t0 }}>{v.n}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t2, marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600' }}>{v.l}</div>
                </div>
              ))}
            </div>
            {(validity.flags || []).map((f, i) => (
              <div key={i} style={{
                fontSize:'11px', fontWeight:'600', marginBottom:'3px', lineHeight:'1.6',
                color: f.type === 'green' ? T.gn : f.type === 'amber' ? T.am : T.rd,
              }}>
                <strong>{f.key}:</strong> {f.text}
              </div>
            ))}
          </div>

          <div style={{ background:T.bg2, border:`1px solid ${T.bC}`, borderRadius:'10px', padding:'20px', marginTop:'16px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.c, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'8px' }}>Psychometric Profile</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:T.t0, fontWeight:'700', marginBottom:'6px' }}>{profile.name || candidate.profile_name}</div>
            <div style={{ fontSize:'12px', color:T.t2, lineHeight:'1.7', fontWeight:'600' }}>{profile.desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
const OverviewTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (total === 0) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No assessments found in the database.</div>;

  const avgScore = Math.round(data.reduce((s, r) => s + r.overall_score, 0) / total);
  const validCount = data.filter(r => r.report_data?.validity?.overall === 'green').length;
  const highPot = data.filter(r => r.overall_score >= 75).length;
  const flagged = data.filter(r => r.report_data?.validity?.overall === 'red').length;

  const trendData = [...data].sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).slice(-8).map(r => r.overall_score);

  const profileDist = {};
  data.forEach(r => { profileDist[r.profile_name] = (profileDist[r.profile_name] || 0) + 1; });
  const topProfiles = Object.entries(profileDist).sort((a,b) => b[1]-a[1]).slice(0, 5);

  const indDist = {};
  data.forEach(r => { if (r.industry) indDist[r.industry] = (indDist[r.industry] || 0) + 1; });
  const topInd = Object.entries(indDist).sort((a,b) => b[1]-a[1]).slice(0, 5);

  const statCards = [
    { n: total,      l:'Total Assessments',  c:T.gold,  sub:'All time' },
    { n: avgScore,   l:'Average Score',      c:bCol(avgScore,T), sub:'/ 100 overall' },
    { n: highPot,    l:'High Potential',     c:T.gn,    sub:`Score ≥ 75 (${Math.round(highPot/total*100)}%)` },
    { n: flagged,    l:'Validity Flagged',   c:T.rd,    sub:'Require verification' },
    { n: validCount, l:'Clean Validity',     c:T.gn,    sub:`${Math.round(validCount/total*100)}% of cohort` },
  ];

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'20px' }} className="dash-anim">
        {statCards.map((s, i) => (
          <div key={i} className="metric-card" style={{
            background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px',
            padding:'20px 18px', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${s.c},transparent)` }} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:'700', color:s.c, lineHeight:'1', marginBottom:'5px' }}>{s.n}</div>
            <div style={{ fontSize:'11px', fontWeight:'700', color:T.t1, marginBottom:'2px' }}>{s.l}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }} className="dash-anim-2">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'14px' }}>Score Bands</div>
          {[
            { l:'High (75–100)', v: data.filter(r => r.overall_score >= 75).length, c:T.gn },
            { l:'Moderate (50–74)', v: data.filter(r => r.overall_score >= 50 && r.overall_score < 75).length, c:T.am },
            { l:'Low (0–49)', v: data.filter(r => r.overall_score < 50).length, c:T.rd },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:T.t2, fontWeight:'600', marginBottom:'4px' }}>
                <span>{l}</span><span style={{ color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:'700' }}>{v}</span>
              </div>
              <div style={{ height:'5px', background:T.b1, borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ width:`${(v/total)*100}%`, height:'100%', background:c, borderRadius:'2px', transition:'width 0.8s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:'18px', paddingTop:'14px', borderTop:`1px solid ${T.b1}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontWeight:'600' }}>Recent Score Trend</div>
            <SparkLine data={trendData} color={T.gold} w={200} h={36} />
          </div>
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'14px' }}>Profile Distribution</div>
          {topProfiles.map(([name, count], i) => {
            const colors = [T.c, T.gold, T.gn, T.am, '#8B5CF6'];
            return <DistBar key={name} label={name} value={count} max={total} color={colors[i % colors.length]} T={T} />;
          })}
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'14px' }}>Validity Status</div>
          {[
            { l:'Valid (Green)', v: data.filter(r => r.report_data?.validity?.overall === 'green').length, c:T.gn },
            { l:'Caution (Amber)', v: data.filter(r => r.report_data?.validity?.overall === 'amber').length, c:T.am },
            { l:'Flagged (Red)', v: data.filter(r => r.report_data?.validity?.overall === 'red').length, c:T.rd },
          ].map(({ l, v, c }) => (
            <DistBar key={l} label={l} value={v} max={total} color={c} T={T} />
          ))}
          <div style={{ marginTop:'18px', paddingTop:'14px', borderTop:`1px solid ${T.b1}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px', fontWeight:'600' }}>Industry Distribution</div>
            {topInd.map(([ind, count], i) => (
              <DistBar key={ind} label={ind.replace(/ & .*/, '')} value={count} max={total} color={i % 2 === 0 ? T.c : T.gold} T={T} />
            ))}
          </div>
        </div>
      </div>

      <div className="dash-anim-3" style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.b2}`, display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Recent Assessments</div>
          <div style={{ flex:1 }} />
          <Pill label={`${Math.min(data.length, 5)} shown`} color={T.t3} />
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
              {[...data].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,5).map((r, i) => (
                <tr key={r.id || i} className="row-hover" onClick={() => onSelect(r)}
                  style={{ borderBottom:`1px solid ${T.b1}`, transition:'background 0.18s' }}>
                  <td style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}{r.department ? ` · ${r.department}` : ''}</td>
                  <td style={{ padding:'12px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.c, fontWeight:'700' }}>{r.profile_name}</td>
                  <td style={{ padding:'12px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t3, fontFamily:"'JetBrains Mono',monospace", fontWeight:'600' }}>
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
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

// ─── PROFILES TAB ─────────────────────────────────────────────────────────────
const ProfilesTab = ({ data, T, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filterProfile, setFilterProfile] = useState('');
  const [filterValidity, setFilterValidity] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const profiles = [...new Set(data.map(r => r.profile_name).filter(Boolean))];

  const filtered = useMemo(() => {
    let d = [...data];
    if (search) d = d.filter(r =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.cnic?.includes(search) ||
      r.role?.toLowerCase().includes(search.toLowerCase())
    );
    if (filterProfile) d = d.filter(r => r.profile_name === filterProfile);
    if (filterValidity) d = d.filter(r => r.report_data?.validity?.overall === filterValidity);
    d.sort((a, b) => {
      let va = a[sortKey] ?? a.report_data?.scores?.[sortKey] ?? 0;
      let vb = b[sortKey] ?? b.report_data?.scores?.[sortKey] ?? 0;
      if (sortKey === 'created_at') { va = new Date(va); vb = new Date(vb); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return d;
  }, [data, search, filterProfile, filterValidity, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const SortArrow = ({ k }) => sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : '';

  return (
    <div className="dash-anim">
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
        <input className="search-inp" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, CNIC, role…"
          style={{ flex:1, minWidth:'200px', padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', transition:'all 0.2s' }} />
        <select className="filter-select" value={filterProfile} onChange={e => setFilterProfile(e.target.value)}
          style={{ padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
          <option value="">All Profiles</option>
          {profiles.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={filterValidity} onChange={e => setFilterValidity(e.target.value)}
          style={{ padding:'10px 14px', border:`1px solid ${T.b2}`, borderRadius:'6px', background:T.bg2, color:T.t0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
          <option value="">All Validity</option>
          <option value="green">Valid</option>
          <option value="amber">Caution</option>
          <option value="red">Flagged</option>
        </select>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', alignSelf:'center' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.b2}` }}>
                {[
                  { l:'Name', k:'name' }, { l:'CNIC', k:'cnic' },
                  { l:'Department', k:'department' }, { l:'Role', k:'role' },
                  { l:'Score', k:'overall_score' }, { l:'Profile', k:'profile_name' },
                  { l:'Validity', k:null }, { l:'Date', k:'created_at' }, { l:'', k:null },
                ].map(({ l, k }) => (
                  <th key={l} className={k ? 'sort-th' : ''} onClick={() => k && toggleSort(k)}
                    style={{ padding:'10px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:sortKey===k?T.t0:T.t3, fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap' }}>
                    {l}{k ? <SortArrow k={k} /> : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i} className="row-hover" onClick={() => onSelect(r)}
                  style={{ borderBottom:`1px solid ${T.b1}`, transition:'background 0.18s' }}>
                  <td style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'700', color:T.t0, whiteSpace:'nowrap' }}>{r.name}</td>
                  <td style={{ padding:'12px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.t3, fontWeight:'600' }}>{r.cnic}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.department}</td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.t2, fontWeight:'600' }}>{r.role}</td>
                  <td style={{ padding:'12px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontSize:'11px', color:T.c, fontWeight:'700', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.profile_name}</td>
                  <td style={{ padding:'12px 14px' }}><ValidityDot overall={r.report_data?.validity?.overall} T={T} /></td>
                  <td style={{ padding:'12px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:T.t3, fontWeight:'600', whiteSpace:'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button className="action-btn" onClick={e => { e.stopPropagation(); onSelect(r); }} style={{
                      padding:'5px 12px', borderRadius:'4px', border:'none', background:T.c, color:'#fff',
                      fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700',
                      cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap',
                    }}>View →</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding:'40px', textAlign:'center', color:T.t3, fontSize:'13px', fontWeight:'600' }}>No candidates match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── SCORE ANALYTICS TAB ─────────────────────────────────────────────────────
const ScoresTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (!total) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No data available.</div>;

  const avgComp = COMPOSITE_KEYS.map(({ k, l, green, amber }) => {
    // FIX: Look in report_data.CI first, fallback to scores
    const avg = Math.round(data.reduce((s, r) => s + (r.report_data?.CI?.[k] || r.report_data?.scores?.[k] || 0), 0) / total);
    return { k, l, avg, green, amber };
  });

  const avgMod = MODULE_KEYS.map(({ k, l }) => {
    const avg = Math.round(data.reduce((s, r) => s + (r.report_data?.scores?.[k] || 0), 0) / total);
    return { k, l, avg };
  });

  const leaders = [...data].sort((a, b) => b.overall_score - a.overall_score).slice(0, 5);

  const atRisk = data.filter(r => {
    const s = r.report_data?.scores || {};
    const ci = r.report_data?.CI || {};
    // FIX: Check CI object for composite scores
    return COMPOSITE_KEYS.some(({ k, amber }) => (ci[k] || s[k] || 0) < amber);
  }).slice(0, 5);

  return (
    <div>
      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim">
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Cohort Composite Index Averages</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px' }}>
          {avgComp.map(({ k, l, avg, green, amber }) => {
            const col = bCol(avg, T);
            const rat = avg >= green ? 'Low Risk' : avg >= amber ? 'Moderate' : 'High Risk';
            return (
              <div key={k} style={{ background:T.bg2, borderRadius:'8px', padding:'14px 10px', textAlign:'center', border:`1px solid ${col}25`, transition:'all 0.2s' }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px', fontWeight:'700', lineHeight:'1.4' }}>{l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:col, fontWeight:'700', lineHeight:'1' }}>{avg}</div>
                <div style={{ height:'3px', background:T.b1, borderRadius:'2px', overflow:'hidden', margin:'6px 4px 4px' }}>
                  <div style={{ width:`${avg}%`, height:'100%', background:barGrad(avg), transition:'width 0.8s ease' }} />
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:col, fontWeight:'700' }}>{rat}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim-2">
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Module Score Averages</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {avgMod.map(({ k, l, avg }) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'200px', fontSize:'12px', color:T.t1, fontWeight:'700', flexShrink:0 }}>{l}</div>
              <div style={{ flex:1, height:'7px', background:T.b1, borderRadius:'3px', overflow:'hidden' }}>
                <div style={{ width:`${avg}%`, height:'100%', background:barGrad(avg), transition:'width 0.8s ease' }} />
              </div>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'13px', color:bCol(avg, T), fontWeight:'700', width:'36px', textAlign:'right' }}>{avg}</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', width:'55px' }}>{bd(avg)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }} className="dash-anim-3">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}`, display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gn, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Top Performers</div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.b2}` }}>
              {['Name','Score','CII','LRS'].map(h => <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {leaders.map((r, i) => (
                <tr key={r.id || i} className="row-hover" onClick={() => onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                  <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, marginRight:'8px', fontWeight:'700' }}>#{i+1}</span>
                    {r.name}
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
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}`, display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.rd, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>At-Risk Candidates</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, fontWeight:'600' }}>Low on ≥1 composite index</div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.b2}` }}>
              {['Name','Score','Flagged Indices'].map(h => <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {atRisk.map((r, i) => {
                const s = r.report_data?.scores || {};
                const ci = r.report_data?.CI || {};
                const flagged = COMPOSITE_KEYS.filter(({ k, amber }) => (ci[k] || s[k] || 0) < amber).map(({ k }) => k);
                return (
                  <tr key={r.id || i} className="row-hover" onClick={() => onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                    <td style={{ padding:'10px 14px' }}><ScoreBadge score={r.overall_score} T={T} /></td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                        {flagged.map(k => <Pill key={k} label={k} color={T.rd} style={{ fontSize:'8px', padding:'2px 7px' }} />)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {atRisk.length === 0 && <tr><td colSpan={3} style={{ padding:'24px 14px', fontSize:'12px', color:T.gn, fontWeight:'700', textAlign:'center' }}>No at-risk candidates.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── VALIDITY MONITOR TAB ─────────────────────────────────────────────────────
const ValidityTab = ({ data, T, onSelect }) => {
  const total = data.length;
  if (!total) return <div style={{ padding:'40px', textAlign:'center', color:T.t3, fontWeight:'600' }}>No data available.</div>;

  const byStatus = {
    green: data.filter(r => r.report_data?.validity?.overall === 'green'),
    amber:  data.filter(r => r.report_data?.validity?.overall === 'amber'),
    red:   data.filter(r => r.report_data?.validity?.overall === 'red'),
  };
  const avgCon = Math.round(data.reduce((s, r) => s + (r.report_data?.validity?.conScore || 0), 0) / total);
  const avgLScale = (data.reduce((s, r) => s + (r.report_data?.validity?.lAgree || 0), 0) / total).toFixed(1);
  const avgExt = Math.round(data.reduce((s, r) => s + ((r.report_data?.validity?.extRatio || 0) * 100), 0) / total);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }} className="dash-anim">
        {[
          { n:`${byStatus.green.length}/${total}`, l:'Valid Results', sub:'Green validity', c:T.gn },
          { n:`${byStatus.amber.length}`,  l:'Caution Flagged',   sub:'Amber — interpret carefully', c:T.am },
          { n:`${byStatus.red.length}`,    l:'High-Risk Flagged', sub:'Require verification interview', c:T.rd },
          { n:`${avgCon}/100`,             l:'Avg Consistency',   sub:'Internal consistency score', c:bCol(avgCon, T) },
        ].map((s, i) => (
          <div key={i} className="metric-card" style={{ background:T.bg1, border:`1px solid ${s.c}28`, borderRadius:'10px', padding:'18px', borderTop:`3px solid ${s.c}` }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:s.c, fontWeight:'700', lineHeight:'1', marginBottom:'4px' }}>{s.n}</div>
            <div style={{ fontSize:'11px', fontWeight:'700', color:T.t1, marginBottom:'2px' }}>{s.l}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'16px' }} className="dash-anim-2">
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'16px' }}>Cohort Validity Metrics</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
          {[
            { l:'Avg L-Scale Agreements', v:`${avgLScale}/12`, sub:'< 4 is acceptable cohort average', c:parseFloat(avgLScale) < 4 ? T.gn : T.rd },
            { l:'Avg Extreme Response Rate', v:`${avgExt}%`, sub:'< 70% is the expected range', c:avgExt < 70 ? T.gn : T.am },
            { l:'Avg Internal Consistency', v:`${avgCon}/100`, sub:'≥ 75 indicates reliable responses', c:bCol(avgCon, T) },
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
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>All Candidates — Validity Detail</div>
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
                return (order[a.report_data?.validity?.overall]||2) - (order[b.report_data?.validity?.overall]||2);
              }).map((r, i) => {
                const v = r.report_data?.validity || {};
                const dec = v.overall === 'green' ? 'Proceed' : v.overall === 'amber' ? 'Caution' : 'Verify First';
                const decCol = v.overall === 'green' ? T.gn : v.overall === 'amber' ? T.am : T.rd;
                return (
                  <tr key={r.id||i} className="row-hover" onClick={() => onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
                    <td style={{ padding:'10px 14px', fontSize:'12px', fontWeight:'700', color:T.t0 }}>{r.name}</td>
                    <td style={{ padding:'10px 14px' }}><ValidityDot overall={v.overall} T={T} /></td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:v.lAgree >= 6 ? T.rd : v.lAgree >= 4 ? T.am : T.gn, fontWeight:'700' }}>{v.lAgree ?? '—'}/12</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:T.t2, fontWeight:'600' }}>{Math.round((v.saRatio||0)*100)}%</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:(v.extRatio||0) > 0.7 ? T.am : T.t2, fontWeight:'700' }}>{Math.round((v.extRatio||0)*100)}%</td>
                    <td style={{ padding:'10px 14px' }}><MiniBar score={v.conScore || 0} w={70} h={5} /><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:bCol(v.conScore||0,T), fontWeight:'700', marginLeft:'8px' }}>{v.conScore}</span></td>
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

// ─── INDUSTRY TAB ─────────────────────────────────────────────────────────────
const IndustryTab = ({ data, T, onSelect }) => {
  const [selectedInd, setSelectedInd] = useState(null);

  const industries = {};
  data.forEach(r => {
    const ind = r.industry || 'Unspecified';
    if (!industries[ind]) industries[ind] = [];
    industries[ind].push(r);
  });

  const indList = Object.entries(industries).sort((a,b) => b[1].length - a[1].length);
  const selectedCandidates = selectedInd ? (industries[selectedInd] || []) : [];

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'16px' }} className="dash-anim">
        <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.b2}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.gold, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700' }}>Industries ({indList.length})</div>
          </div>
          <div style={{ overflowY:'auto', maxHeight:'500px' }}>
            {indList.map(([ind, recs]) => {
              const avg = Math.round(recs.reduce((s, r) => s + r.overall_score, 0) / recs.length);
              const isSelected = selectedInd === ind;
              return (
                <button key={ind} onClick={() => setSelectedInd(isSelected ? null : ind)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    width:'100%', padding:'12px 18px', textAlign:'left',
                    background: isSelected ? `${T.c}16` : 'transparent',
                    border: 'none', borderBottom:`1px solid ${T.b1}`,
                    borderLeft: isSelected ? `3px solid ${T.c}` : `3px solid transparent`,
                    cursor:'pointer', transition:'all 0.18s',
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = T.b0; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color: isSelected ? T.c : T.t1, lineHeight:'1.4', maxWidth:'180px' }}>{ind}</div>
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
              <div style={{ fontSize:'12px', color:T.t3, fontWeight:'600' }}>Click any industry on the left to see detailed breakdowns and candidate profiles.</div>
            </div>
          ) : (
            <div>
              <div style={{ background:T.bg1, border:`1px solid ${T.b2}`, borderRadius:'10px', padding:'20px', marginBottom:'12px' }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.c, textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:'700', marginBottom:'6px' }}>Industry Analysis</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:T.t0, fontWeight:'700', marginBottom:'12px' }}>{selectedInd}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                  {[
                    { n:selectedCandidates.length, l:'Candidates' },
                    { n:Math.round(selectedCandidates.reduce((s,r)=>s+r.overall_score,0)/selectedCandidates.length), l:'Avg Overall' },
                    { n:selectedCandidates.filter(r=>r.overall_score>=75).length, l:'High Potential' },
                    { n:selectedCandidates.filter(r=>r.report_data?.validity?.overall==='red').length, l:'Flagged' },
                  ].map((s,i)=>(
                    <div key={i} style={{ background:T.bg2, borderRadius:'7px', padding:'12px', textAlign:'center' }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:T.gold, fontWeight:'700' }}>{s.n}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:T.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'3px', fontWeight:'600' }}>{s.l}</div>
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
                    {selectedCandidates.map((r,i)=>(
                      <tr key={r.id||i} className="row-hover" onClick={() => onSelect(r)} style={{ borderBottom:`1px solid ${T.b1}` }}>
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

// ─── ROOT DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [assessments, setAssessments]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeTab, setActiveTab]         = useState('overview');
  const [selectedCandidate, setSelected]  = useState(null);
  const [mode, setMode]                   = useState(() => {
    try { return localStorage.getItem('themeMode') || 'dark'; } catch(e) { return 'dark'; }
  });

  const T = mode === 'dark' ? darkTheme : lightTheme;

useEffect(() => {
    // Replaced localhost with your live Render backend URL
    fetch('https://core-by-carnelian-backend.onrender.com/api/assessments')
      .then(res => { if (!res.ok) throw new Error('API error'); return res.json(); })
      .then(data => { setAssessments(data); setLoading(false); })
      .catch((err) => {
        console.error(err);
        setError('Failed to connect to the database.');
        setLoading(false);
      });
  }, []);

  const TAB_COMPONENTS = {
    overview: <OverviewTab  data={assessments} T={T} onSelect={setSelected} />,
    profiles: <ProfilesTab  data={assessments} T={T} onSelect={setSelected} />,
    scores:   <ScoresTab    data={assessments} T={T} onSelect={setSelected} />,
    validity: <ValidityTab  data={assessments} T={T} onSelect={setSelected} />,
    industry: <IndustryTab  data={assessments} T={T} onSelect={setSelected} />,
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
            height:'60px', background:T.bg0+'EE', backdropFilter:'blur(16px)',
            borderBottom:`1px solid ${T.b2}`,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 28px', flexShrink:0,
            position:'sticky', top:0, zIndex:50,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:'700', color:T.t0 }}>
                {TABS.find(t => t.id === activeTab)?.label}
              </div>
              {loading && (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.t3, fontWeight:'600', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.am, animation:'blink 1s infinite', display:'inline-block' }} />
                  Loading…
                </div>
              )}
              {error && (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:T.am, fontWeight:'700' }}>{error}</div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <Pill label={`${assessments.length} records`} color={T.gold} />
              <button onClick={() => setMode(m => m === 'dark' ? 'light' : 'dark')} style={{
                padding:'6px 14px', borderRadius:'5px', border:`1px solid ${T.b2}`,
                background:T.bg2, color:T.t1, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px', fontWeight:'700',
                transition:'all 0.18s',
              }}>{mode === 'dark' ? '☀ Light' : '◑ Dark'}</button>
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
        <CandidateModal candidate={selectedCandidate} onClose={() => setSelected(null)} T={T} />
      )}
    </>
  );
}