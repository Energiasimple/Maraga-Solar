import React from 'react'

export const T = {
  // Core palette
  gold:   '#F7B500',
  goldD:  '#B8860B',
  goldL:  '#FFF8E1',
  black:  '#1d1d1f',
  white:  '#ffffff',
  // Grays — Apple-inspired
  g50:  '#fafafa',
  g100: '#f5f5f7',
  g200: '#e8e8ed',
  g300: '#d2d2d7',
  g400: '#aeaeb2',
  g500: '#86868b',
  g600: '#6e6e73',
  g700: '#3d3d3f',
  g800: '#2d2d2f',
  // Accent
  ok:     '#34c759',
  okL:    '#e9f9ee',
  err:    '#ff3b30',
  errL:   '#fff1f0',
  blue:   '#0071e3',
  blueL:  '#e8f1fb',
  purple: '#5e5ce6',
  purpleL:'#f0f0ff',
  // Borders & shadows
  border:   '#d2d2d7',
  borderL:  '#e8e8ed',
  shadow:   '0 2px 12px rgba(0,0,0,0.06)',
  shadowMd: '0 8px 30px rgba(0,0,0,0.09)',
  shadowLg: '0 20px 60px rgba(0,0,0,0.12)',
}

export const CAT_COLOR = {
  'Perfiles Aluminio': '#0071e3',
  'Estructura KR18':   '#F7B500',
  'Estructura Lámina': '#ac39d4',
  'Tornillería':       '#34c759',
  'Puesta a Tierra':   '#5e5ce6',
  'Estructura':        '#ff9500',
}
export const CAT_ICON = {
  'Perfiles Aluminio': '▬',
  'Estructura KR18':   '◈',
  'Estructura Lámina': '◇',
  'Tornillería':       '⚙',
  'Puesta a Tierra':   '⏚',
  'Estructura':        '⬡',
}

export const fmt = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n)
export const pubPrice = p => Math.ceil(p.cost * (1 + p.margin / 100))

/* ── BUTTON ── */
export function Btn({ children, onClick, v = 'gold', sm, full, disabled, style = {} }) {
  const base = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    border: 'none',
    borderRadius: sm ? 8 : 12,
    fontFamily: 'inherit',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    padding: sm ? '8px 16px' : '14px 28px',
    fontSize: sm ? 13 : 15,
    width: full ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
  }
  const vs = {
    gold:    { background: T.gold, color: T.black },
    dark:    { background: T.black, color: T.white },
    white:   { background: T.white, color: T.black, border: `1px solid ${T.border}` },
    outline: { background: 'transparent', border: `1.5px solid ${T.border}`, color: T.black },
    ghost:   { background: 'transparent', color: T.g500 },
    red:     { background: T.err, color: T.white },
    ok:      { background: T.ok, color: T.white },
  }
  const hoverMap = {
    gold: { background: '#e6a800' },
    dark: { background: '#3d3d3f' },
    white: { background: T.g100 },
    outline: { background: T.g50, borderColor: T.g400 },
  }
  return (
    <button
      style={{ ...base, ...(vs[v] || vs.gold), ...style }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={e => { if (!disabled && hoverMap[v]) Object.assign(e.currentTarget.style, hoverMap[v]) }}
      onMouseLeave={e => { if (!disabled && hoverMap[v]) Object.assign(e.currentTarget.style, vs[v] || vs.gold) }}
    >{children}</button>
  )
}

/* ── FIELD ── */
export function Field({ label, area, style = {}, ...p }) {
  const ls = { fontSize: 12, fontWeight: 500, color: T.g600, letterSpacing: '0.01em', display: 'block', marginBottom: 7 }
  const is = {
    background: T.g50, border: `1.5px solid ${T.borderL}`, borderRadius: 10,
    padding: '11px 14px', color: T.black, fontSize: 14, width: '100%',
    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box', fontWeight: 400,
  }
  const focus = e => e.target.style.borderColor = T.gold
  const blur  = e => e.target.style.borderColor = T.borderL
  return (
    <div style={style}>
      {label && <label style={ls}>{label}</label>}
      {area
        ? <textarea style={{ ...is, minHeight: 100, resize: 'vertical' }} {...p} onFocus={focus} onBlur={blur} />
        : <input style={is} {...p} onFocus={focus} onBlur={blur} />}
    </div>
  )
}

/* ── SELECT ── */
export function Pick({ label, children, ...p }) {
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: T.g600, display: 'block', marginBottom: 7 }}>{label}</label>}
      <select style={{ background: T.g50, border: `1.5px solid ${T.borderL}`, borderRadius: 10, padding: '11px 14px', color: T.black, fontSize: 14, width: '100%', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }} {...p}>{children}</select>
    </div>
  )
}

/* ── TAG ── */
export const Tag = ({ c, bg, children, sm }) => (
  <span style={{ background: bg || `${c || T.gold}15`, color: c || T.gold, padding: sm ? '2px 8px' : '4px 11px', borderRadius: 20, fontSize: sm ? 10 : 11, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>{children}</span>
)

/* ── PROV BADGE ── */
export const ProvBadge = ({ p }) => {
  const map = {
    'CUPRUM':  { bg: T.blueL,   color: T.blue   },
    'RINENG':  { bg: T.purpleL, color: T.purple  },
    'Suntree': { bg: '#FFF0E0', color: '#D4600A'  },
  }
  const s = map[p] || { bg: T.g100, color: T.g600 }
  return <span style={{ background: s.bg, color: s.color, padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{p}</span>
}

/* ── CARD ── */
export const Card = ({ children, style = {}, onClick, hover }) => {
  const [hov, setHov] = React.useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{ background: T.white, border: `1px solid ${T.borderL}`, borderRadius: 18, padding: '22px', boxShadow: hov ? T.shadowMd : T.shadow, transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'translateY(-4px)' : 'translateY(0)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >{children}</div>
  )
}

/* ── DIALOG ── */
export function Dialog({ title, onClose, wide, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: T.white, borderRadius: 22, width: '100%', maxWidth: wide ? 880 : 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }} className="fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px 20px', borderBottom: `1px solid ${T.borderL}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.black, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
          <button onClick={onClose} style={{ background: T.g100, border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.g500 }}>✕</button>
        </div>
        <div style={{ padding: '24px 28px' }}>{children}</div>
      </div>
    </div>
  )
}

/* ── SECTION WRAPPER ── */
export const Wrap = ({ children, style = {} }) => (
  <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 2rem', ...style }}>{children}</div>
)

/* ── DIVIDER ── */
export const Divider = () => <div style={{ height: 1, background: T.borderL, margin: '0' }} />
