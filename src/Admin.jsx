import React, { useState, useRef, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { T, Btn, Field, Pick, Tag, ProvBadge, Card, Dialog, CAT_COLOR, CAT_ICON, fmt, pubPrice } from './ui.jsx'
import { downloadQuotePDF, DownloadQuoteBtn } from './QuotePDF.jsx'

/* ─── PERSISTENCE ─────────────────────────────────────────── */
const STORAGE_KEYS = { inv: 'mg_inv', clients: 'mg_clients', quotes: 'mg_quotes' }
export const loadState = (key, fallback) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback } catch { return fallback } }
export const saveState = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

/* ─── EMAIL (EmailJS) ─────────────────────────────────────── */
const EMAILJS_SERVICE  = 'service_maraga'
const EMAILJS_TEMPLATE = 'template_cotizacion'
const EMAILJS_KEY      = 'YOUR_EMAILJS_PUBLIC_KEY' // reemplazar con clave real
const TO_EMAIL         = 'alfredo.trevino@maraga.com.mx'

async function sendContactEmail(data) {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id:     EMAILJS_KEY,
        template_params: {
          to_email: TO_EMAIL,
          from_name:    data.name,
          from_company: data.company,
          from_email:   data.email,
          from_phone:   data.phone,
          message:      data.msg,
          reply_to:     data.email,
        },
      }),
    })
    return res.ok
  } catch { return false }
}

/* ─── QUOTE STATUS CONFIG ─────────────────────────────────── */
const STATUS = {
  borrador:  { label: 'Borrador',  color: T.g400,   bg: T.g100  },
  enviada:   { label: 'Enviada',   color: '#0071e3', bg: '#DBEAFE' },
  aceptada:  { label: 'Aceptada', color: T.ok,      bg: T.okL   },
  rechazada: { label: 'Rechazada',color: T.err,     bg: T.errL  },
}

/* ─── HELPERS ─────────────────────────────────────────────── */
const monthName = d => new Date(d).toLocaleString('es-MX', { month: 'short', year: '2-digit' })
const nowYear   = () => new Date().getFullYear()
const nowMonth  = () => new Date().getMonth()
const nowQ      = () => Math.floor(nowMonth() / 3)

/* ─── ADMIN LAYOUT ────────────────────────────────────────── */
export function AdminLayout({ inv, setInv, clients, setClients, quotes, setQuotes, setPage, setIsAdmin }) {
  const [ap, setAp] = useState('dashboard')
  const [calcDraft, setCalcDraft] = useState(null) // calculator → quotes

  // Persist on every change
  useEffect(() => saveState(STORAGE_KEYS.inv, inv), [inv])
  useEffect(() => saveState(STORAGE_KEYS.clients, clients), [clients])
  useEffect(() => saveState(STORAGE_KEYS.quotes, quotes), [quotes])

  const nav = [
    { id: 'dashboard', icon: '📊', l: 'Dashboard' },
    { id: 'pipeline',  icon: '🔀', l: 'Pipeline CRM' },
    { id: 'quotes',    icon: '📄', l: 'Cotizaciones' },
    { id: 'clients',   icon: '👥', l: 'Clientes' },
    { id: 'inventory', icon: '📦', l: 'Inventario' },
    { id: 'webcat',    icon: '🛍', l: 'Catálogo web' },
    { id: 'calc',      icon: '🔧', l: 'Calculadora FV' },
  ]

  const goToQuote = (draft) => { setCalcDraft(draft); setAp('quotes') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.g50 }}>
      <aside style={{ width: 220, background: T.white, borderRight: `1px solid ${T.borderL}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '18px 16px', borderBottom: `1px solid ${T.borderL}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Maraga Solar" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', color: T.black }}>MARAGA</div>
            <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.15em', color: T.gold }}>SOLAR · ADMIN</div>
          </div>
        </div>
        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setAp(n.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: ap === n.id ? 600 : 400, border: 'none', marginBottom: 2, background: ap === n.id ? T.goldL : 'transparent', color: ap === n.id ? T.goldD : T.g600, borderLeft: ap === n.id ? `3px solid ${T.gold}` : '3px solid transparent', textAlign: 'left', transition: 'all 0.15s' }}>
              <span>{n.icon}</span>{n.l}
              {n.id === 'pipeline' && quotes.filter(q => q.status === 'enviada').length > 0 && (
                <span style={{ marginLeft: 'auto', background: T.blue, color: T.white, borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{quotes.filter(q => q.status === 'enviada').length}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${T.borderL}` }}>
          <button onClick={() => { setIsAdmin(false); setPage('home') }} style={{ width: '100%', display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: T.g500, background: 'transparent', border: 'none', alignItems: 'center' }}>← Salir al sitio</button>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {ap === 'dashboard' && <Dashboard inv={inv} clients={clients} quotes={quotes} />}
        {ap === 'pipeline'  && <Pipeline quotes={quotes} setQuotes={setQuotes} inv={inv} setInv={setInv} clients={clients} />}
        {ap === 'quotes'    && <Quotes inv={inv} clients={clients} quotes={quotes} setQuotes={setQuotes} calcDraft={calcDraft} setCalcDraft={setCalcDraft} />}
        {ap === 'clients'   && <Clients clients={clients} setClients={setClients} />}
        {ap === 'inventory' && <Inventory inv={inv} setInv={setInv} />}
        {ap === 'webcat'    && <WebCatalog inv={inv} setInv={setInv} />}
        {ap === 'calc'      && <Calculator inv={inv} onQuote={goToQuote} />}
      </main>
    </div>
  )
}

/* ─── DASHBOARD ───────────────────────────────────────────── */
function Dashboard({ inv, clients, quotes }) {
  const accepted  = quotes.filter(q => q.status === 'aceptada')
  const sent      = quotes.filter(q => q.status === 'enviada')
  const pipeline  = quotes.filter(q => ['borrador','enviada'].includes(q.status))
  const rejected  = quotes.filter(q => q.status === 'rechazada')
  const hitRate   = quotes.length > 0 ? Math.round(accepted.length / quotes.filter(q => q.status !== 'borrador').length * 100) || 0 : 0

  const revenue = (filterFn) => accepted.filter(filterFn).reduce((a, q) => a + q.total, 0)
  const revenueMonth = revenue(q => { const d = new Date(q.closedAt || q.date); return d.getMonth() === nowMonth() && d.getFullYear() === nowYear() })
  const revenueQ     = revenue(q => { const d = new Date(q.closedAt || q.date); return Math.floor(d.getMonth()/3) === nowQ() && d.getFullYear() === nowYear() })
  const revenueYear  = revenue(q => new Date(q.closedAt || q.date).getFullYear() === nowYear())
  const pipelineVal  = pipeline.reduce((a, q) => a + q.total, 0)

  // Monthly chart data — last 6 months
  const months = Array.from({length: 6}, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    return { label: d.toLocaleString('es-MX',{month:'short'}), m: d.getMonth(), y: d.getFullYear() }
  })
  const chartData = months.map(m => ({
    label: m.label,
    val: accepted.filter(q => { const d = new Date(q.closedAt||q.date); return d.getMonth()===m.m && d.getFullYear()===m.y }).reduce((a,q)=>a+q.total,0)
  }))
  const maxVal = Math.max(...chartData.map(d => d.val), 1)

  const totC = inv.reduce((a, i) => a + i.cost * i.stock, 0)
  const totV = inv.reduce((a, i) => a + pubPrice(i) * i.stock, 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.black, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ color: T.g500, fontSize: 13 }}>Vista general del negocio · {new Date().toLocaleDateString('es-MX',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      {/* KPIs row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 14 }}>
        {[
          { l: 'Facturación este mes',      v: fmt(revenueMonth), c: T.goldD,  bg: T.goldL },
          { l: 'Facturación trimestral',    v: fmt(revenueQ),     c: T.ok,     bg: T.okL   },
          { l: 'Facturación anual',         v: fmt(revenueYear),  c: T.blue,   bg: T.blueL },
          { l: 'Valor en pipeline',         v: fmt(pipelineVal),  c: T.purple, bg: T.purpleL },
        ].map(s => (
          <div key={s.l} style={{ background: s.bg, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: s.c, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* KPIs row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Cotizaciones totales', v: quotes.length,    c: T.g700, bg: T.g100 },
          { l: 'Enviadas',             v: sent.length,      c: T.blue,   bg: T.blueL },
          { l: 'Aceptadas',            v: accepted.length,  c: T.ok,     bg: T.okL },
          { l: 'Rechazadas',           v: rejected.length,  c: T.err,    bg: T.errL },
          { l: 'Hit rate',             v: `${hitRate}%`,    c: T.purple, bg: T.purpleL },
          { l: 'Clientes',             v: clients.length,   c: T.goldD,  bg: T.goldL },
        ].map(s => (
          <Card key={s.l} style={{ padding: '14px 16px', background: s.bg, borderColor: `${s.c}20` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: s.c, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.c }}>{s.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Revenue chart */}
        <Card>
          <div style={{ fontWeight: 700, color: T.black, marginBottom: 20, fontSize: 15 }}>📈 Facturación mensual</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 9, color: T.g400, fontWeight: 600 }}>{d.val > 0 ? fmt(d.val).replace('$','').replace('.00','') : ''}</div>
                <div style={{ width: '100%', background: i === 5 ? T.gold : T.g200, borderRadius: '4px 4px 0 0', height: Math.max(4, (d.val / maxVal) * 90), transition: 'height 0.4s ease', minHeight: 4 }} />
                <div style={{ fontSize: 10, color: T.g500, fontWeight: 500 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Funnel */}
        <Card>
          <div style={{ fontWeight: 700, color: T.black, marginBottom: 20, fontSize: 15 }}>🔀 Embudo de ventas</div>
          {[
            { l: 'Total cotizaciones', v: quotes.length,    p: 100,    c: T.g300 },
            { l: 'Enviadas al cliente',v: sent.length + accepted.length + rejected.length, p: quotes.length > 0 ? Math.round((sent.length+accepted.length+rejected.length)/quotes.length*100) : 0, c: T.blue },
            { l: 'Aceptadas',          v: accepted.length,  p: quotes.length > 0 ? Math.round(accepted.length/quotes.length*100) : 0, c: T.ok },
          ].map(row => (
            <div key={row.l} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                <span style={{ color: T.g600, fontWeight: 500 }}>{row.l}</span>
                <span style={{ fontWeight: 700, color: T.black }}>{row.v} <span style={{ color: T.g400, fontWeight: 400 }}>({row.p}%)</span></span>
              </div>
              <div style={{ height: 8, background: T.g100, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.p}%`, background: row.c, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: '14px', background: T.goldL, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: T.goldD, fontWeight: 600, marginBottom: 4 }}>HIT RATE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: T.goldD }}>{hitRate}%</div>
          </div>
        </Card>

        {/* Inventory value */}
        <Card>
          <div style={{ fontWeight: 700, color: T.black, marginBottom: 16, fontSize: 15 }}>📦 Valor de inventario</div>
          {[
            { l: 'Costo en almacén',   v: totC, c: T.goldD, bg: T.goldL },
            { l: 'Valor a precio venta',v: totV, c: T.ok,   bg: T.okL   },
            { l: 'Margen potencial',   v: totV-totC, c: T.purple, bg: T.purpleL },
          ].map(r => (
            <div key={r.l} style={{ background: r.bg, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: r.c, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{r.l}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: r.c }}>{fmt(r.v)}</div>
            </div>
          ))}
        </Card>

        {/* Recent quotes */}
        <Card>
          <div style={{ fontWeight: 700, color: T.black, marginBottom: 16, fontSize: 15 }}>🕐 Últimas cotizaciones</div>
          {quotes.length === 0
            ? <div style={{ color: T.g400, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Sin cotizaciones aún</div>
            : quotes.slice(0, 5).map(q => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${T.borderL}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.black }}>{q.folio}</div>
                  <div style={{ fontSize: 11, color: T.g400 }}>{q.client}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.black }}>{fmt(q.total)}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, background: STATUS[q.status]?.bg, color: STATUS[q.status]?.color, padding: '1px 7px', borderRadius: 10 }}>{STATUS[q.status]?.label}</span>
                </div>
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  )
}

/* ─── PIPELINE CRM ────────────────────────────────────────── */
function Pipeline({ quotes, setQuotes, inv, setInv, clients }) {
  const [sel, setSel] = useState(null)

  const updateStatus = (id, status) => {
    setQuotes(prev => prev.map(q => {
      if (q.id !== id) return q
      const updated = { ...q, status }
      if (status === 'aceptada') {
        // Deduct from inventory
        setInv(inv => inv.map(p => {
          const item = q.items.find(i => i.id === p.id)
          if (!item) return p
          return { ...p, stock: Math.max(0, p.stock - item.qty) }
        }))
        updated.closedAt = new Date().toISOString()
      }
      return updated
    }))
    setSel(null)
  }

  const cols = Object.entries(STATUS)
  const byStatus = (s) => quotes.filter(q => q.status === s)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.black, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Pipeline CRM</h1>
        <p style={{ color: T.g500, fontSize: 13 }}>Arrastra o cambia el estatus de cada cotización</p>
      </div>

      {/* Pipeline board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: 14, overflowX: 'auto' }}>
        {cols.map(([key, cfg]) => {
          const colQuotes = byStatus(key)
          const colVal = colQuotes.reduce((a, q) => a + q.total, 0)
          return (
            <div key={key} style={{ background: T.g50, borderRadius: 16, padding: '16px 14px', minHeight: 400 }}>
              {/* Column header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: T.black }}>{cfg.label}</span>
                  <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{colQuotes.length}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.g400, marginBottom: 14, fontWeight: 500 }}>{fmt(colVal)}</div>

              {/* Cards */}
              {colQuotes.map(q => (
                <div key={q.id} onClick={() => setSel(q)} style={{ background: T.white, border: `1px solid ${T.borderL}`, borderRadius: 12, padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s', boxShadow: T.shadow }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color + '55'; e.currentTarget.style.boxShadow = T.shadowMd }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderL; e.currentTarget.style.boxShadow = T.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{q.folio}</span>
                    <span style={{ fontSize: 11, color: T.g400 }}>{q.date}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.black, marginBottom: 4 }}>{q.client}</div>
                  <div style={{ fontSize: 12, color: T.g500, marginBottom: 10 }}>{q.items?.length} productos</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.black }}>{fmt(q.total)}</div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Quote detail modal */}
      {sel && (
        <Dialog title={`${sel.folio} — ${sel.client}`} onClose={() => setSel(null)} wide>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: T.g500 }}>Estatus actual:</span>
              <span style={{ fontSize: 12, fontWeight: 700, background: STATUS[sel.status]?.bg, color: STATUS[sel.status]?.color, padding: '2px 10px', borderRadius: 10 }}>{STATUS[sel.status]?.label}</span>
            </div>

            {/* Items summary */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
              <thead><tr style={{ borderBottom: `2px solid ${T.borderL}` }}>{['Código','Producto','Cant.','P.Unit.','Total'].map(h => <th key={h} style={{ padding: '7px 8px', textAlign: 'left', fontSize: 10, color: T.g400, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{sel.items?.map(i => { const u = i.cost*(1+i.cm/100); return <tr key={i.id} style={{ borderBottom: `1px solid ${T.borderL}` }}><td style={{ padding: '8px', fontFamily: 'monospace', fontSize: 10, color: T.g400 }}>{i.code}</td><td style={{ padding: '8px', color: T.black }}>{i.name}</td><td style={{ padding: '8px', textAlign: 'center' }}>{i.qty}</td><td style={{ padding: '8px', textAlign: 'right' }}>{fmt(u)}</td><td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: T.goldD }}>{fmt(u*i.qty)}</td></tr> })}</tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: 16, fontWeight: 800, color: T.black, marginBottom: 20 }}>Total: {fmt(sel.total)}</div>

            {/* Action buttons */}
            {sel.status !== 'aceptada' && sel.status !== 'rechazada' && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {sel.status === 'borrador' && <Btn v="dark" onClick={() => updateStatus(sel.id, 'enviada')}>📤 Marcar como enviada</Btn>}
                {sel.status === 'enviada' && <>
                  <Btn v="ok" onClick={() => updateStatus(sel.id, 'aceptada')}>✅ Aceptada — descontar inventario</Btn>
                  <Btn v="red" onClick={() => updateStatus(sel.id, 'rechazada')}>✕ Rechazada</Btn>
                </>}
                {sel.status === 'borrador' && <Btn v="outline" onClick={() => updateStatus(sel.id, 'enviada')}>→ Mover a Enviada</Btn>}
              </div>
            )}
            {sel.status === 'aceptada' && <div style={{ background: T.okL, borderRadius: 10, padding: '12px 16px', fontSize: 13, color: T.ok, fontWeight: 600 }}>✅ Cotización cerrada · Inventario descontado · {sel.closedAt ? new Date(sel.closedAt).toLocaleDateString('es-MX') : ''}</div>}
            {sel.status === 'rechazada' && <div style={{ background: T.errL, borderRadius: 10, padding: '12px 16px', fontSize: 13, color: T.err, fontWeight: 600 }}>✕ Cotización rechazada · Sin cambios al inventario</div>}
            {/* Download PDF always available */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.borderL}` }}>
              <DownloadQuoteBtn quote={sel} client={clients.find(c => c.company === sel.client)} sm />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}

/* ─── CLIENTS ─────────────────────────────────────────────── */
function Clients({ clients, setClients }) {
  const [show, setShow] = useState(false); const [edit, setEdit] = useState(null); const [tab, setTab] = useState(0)
  const [uploading, setUploading] = useState(false); const [uploadMsg, setUploadMsg] = useState('')
  const csfRef = useRef()
  const emp = { company:'', rfc:'', email:'', phone:'', address:'', activity:'', contact:'' }
  const [f, setF] = useState(emp)

  const save = () => {
    if (!f.company || !f.rfc) return
    edit ? setClients(clients.map(c => c.id === edit ? { ...f, id: edit } : c)) : setClients([...clients, { ...f, id: Date.now() }])
    setShow(false); setF(emp); setEdit(null)
  }

  const handleCSF = (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true); setUploadMsg('Leyendo archivo...')
    const r = new FileReader()
    r.onload = ev => {
      try {
        const bytes = new Uint8Array(ev.target.result)
        let text = ''
        for (let i = 0; i < bytes.length; i++) { if (bytes[i] >= 32 && bytes[i] < 127) text += String.fromCharCode(bytes[i]); else text += ' ' }
        const rfc    = (text.match(/[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}/g)||[])[0] || ''
        const email  = (text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)||[])[0] || ''
        const phone  = (text.match(/\b\d{10}\b/)||[])[0] || ''
        const cpM    = text.match(/C\.?P\.?\s*(\d{5})/i)
        const cp     = cpM ? cpM[1] : ''
        const rfcIdx = rfc ? text.indexOf(rfc) : -1
        let company  = ''
        if (rfcIdx > 50) {
          const before = text.substring(Math.max(0, rfcIdx - 300), rfcIdx)
          const lines  = before.split(/\s{3,}/).map(l => l.trim()).filter(l => l.length > 4 && l.length < 100)
          company = lines[lines.length - 1] || ''
        }
        setF(prev => ({ ...prev, rfc: rfc||prev.rfc, email: email||prev.email, phone: phone||prev.phone, company: company||prev.company, address: cp ? `CP ${cp}` : prev.address }))
        setUploadMsg(rfc ? `✓ RFC encontrado: ${rfc}. Revisa y completa los datos.` : '⚠️ No se detectó RFC. Captura manualmente.')
        setTab(0)
      } catch { setUploadMsg('Error al procesar. Captura manualmente.'); setTab(0) }
      setUploading(false)
    }
    r.readAsArrayBuffer(file); e.target.value = ''
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: T.black, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Clientes</h1><p style={{ color: T.g500, fontSize: 13 }}>{clients.length} registrados</p></div>
        <Btn onClick={() => { setShow(true); setF(emp); setEdit(null); setUploadMsg('') }}>+ Nuevo cliente</Btn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clients.map(cl => (
          <Card key={cl.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: T.goldL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, color: T.goldD, flexShrink: 0 }}>{cl.company[0]}</div>
              <div>
                <div style={{ fontWeight: 700, color: T.black, fontSize: 14 }}>{cl.company}</div>
                <div style={{ fontSize: 11, color: T.g500, marginTop: 1 }}>RFC: {cl.rfc} · {cl.email}</div>
                <div style={{ fontSize: 11, color: T.g500 }}>{cl.phone} · {cl.address}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Tag c={T.blue} bg={T.blueL}>{cl.activity||'—'}</Tag>
              <Btn sm v="white" onClick={() => { setEdit(cl.id); setF(cl); setShow(true); setUploadMsg('') }}>Editar</Btn>
              <Btn sm v="red" onClick={() => setClients(clients.filter(c => c.id !== cl.id))}>✕</Btn>
            </div>
          </Card>
        ))}
      </div>

      {show && (
        <Dialog title={edit ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => { setShow(false); setEdit(null); setF(emp) }} wide>
          <input type="file" ref={csfRef} accept=".pdf" style={{ display: 'none' }} onChange={handleCSF} />
          <div style={{ display: 'flex', background: T.g100, borderRadius: 12, padding: 4, marginBottom: 18 }}>
            {['✏️ Captura manual', '📄 Constancia Fiscal'].map((l, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: tab === i ? 700 : 500, border: 'none', background: tab === i ? T.gold : 'transparent', color: tab === i ? T.black : T.g500, transition: 'all 0.15s' }}>{l}</button>
            ))}
          </div>
          {tab === 1 ? (
            <div style={{ textAlign: 'center', padding: '28px', background: T.g50, border: `2px dashed ${T.border}`, borderRadius: 14, marginBottom: 14 }}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = T.gold }}
              onDragLeave={e => e.currentTarget.style.borderColor = T.border}
              onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = T.border; const f = e.dataTransfer.files[0]; if (f) handleCSF({ target: { files: [f], value: '' } }) }}>
              {uploading ? <><div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div><div style={{ color: T.black, fontWeight: 600 }}>{uploadMsg}</div></>
                : uploadMsg ? <><div style={{ fontSize: 26, marginBottom: 8 }}>{uploadMsg.startsWith('✓') ? '✅' : '⚠️'}</div><div style={{ fontWeight: 600, color: uploadMsg.startsWith('✓') ? T.ok : T.goldD, fontSize: 13, marginBottom: 12 }}>{uploadMsg}</div><Btn sm v="white" onClick={() => csfRef.current.click()}>Subir otro</Btn></>
                : <><div style={{ fontSize: 38, marginBottom: 10 }}>📄</div><div style={{ fontWeight: 700, color: T.black, marginBottom: 6 }}>Sube la Constancia de Situación Fiscal</div><div style={{ color: T.g500, fontSize: 13, marginBottom: 16 }}>Arrastra el PDF o haz clic · Extrae RFC, correo, domicilio</div><Btn onClick={() => csfRef.current.click()}>Seleccionar PDF</Btn></>
              }
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {uploadMsg && <div style={{ gridColumn: '1/-1', background: uploadMsg.startsWith('✓') ? T.okL : T.goldL, borderRadius: 8, padding: '9px 12px', fontSize: 12, color: uploadMsg.startsWith('✓') ? T.ok : T.goldD, fontWeight: 500 }}>{uploadMsg}</div>}
              <Field label="Razón social / Nombre" value={f.company} onChange={e => setF({...f,company:e.target.value})} placeholder="Empresa SA de CV" />
              <Field label="RFC" value={f.rfc} onChange={e => setF({...f,rfc:e.target.value})} placeholder="XAXX010101000" />
              <Field label="Nombre de contacto" value={f.contact} onChange={e => setF({...f,contact:e.target.value})} placeholder="Responsable de compras" />
              <Field label="Correo electrónico" value={f.email} onChange={e => setF({...f,email:e.target.value})} placeholder="correo@empresa.mx" />
              <Field label="Teléfono" value={f.phone} onChange={e => setF({...f,phone:e.target.value})} placeholder="81 1234 5678" />
              <Field label="Actividad económica" value={f.activity} onChange={e => setF({...f,activity:e.target.value})} placeholder="Instalador fotovoltaico" />
              <div style={{ gridColumn:'1/-1' }}><Field label="Domicilio fiscal" value={f.address} onChange={e => setF({...f,address:e.target.value})} placeholder="Calle, Colonia, Ciudad, CP" /></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn v="white" onClick={() => setShow(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!f.company || !f.rfc}>Guardar cliente</Btn>
          </div>
        </Dialog>
      )}
    </div>
  )
}

/* ─── INVENTORY ───────────────────────────────────────────── */
function Inventory({ inv, setInv }) {
  const [q, setQ] = useState(''); const [catF, setCatF] = useState('Todos'); const [showAdd, setShowAdd] = useState(false); const fRef = useRef()
  const emp = { code:'', name:'', cat:'Estructura', cost:0, stock:1000, unit:'pza', margin:35, desc:'', proveedor:'RINENG', files:{fotos:[],ficha:null,manual:null,garantia:null} }
  const [f, setF] = useState(emp)
  const imp = e => { const file=e.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=ev=>{try{const wb=XLSX.read(ev.target.result,{type:'binary'});const ws=wb.Sheets[wb.SheetNames[0]];const data=XLSX.utils.sheet_to_json(ws);setInv(p=>[...p,...data.map((row,i)=>({id:Date.now()+i,code:row['Código']||row['CÓDIGO']||`SKU-${i+1}`,name:row['Descripción']||row['CONCEPTO']||'Sin nombre',cat:row['Categoría']||'Estructura',cost:parseFloat(row['Costo']||0),stock:parseInt(row['Existencia']||1000),unit:row['Unidad']||'pza',margin:parseFloat(row['Margen']||35),desc:'',proveedor:row['Proveedor']||'RINENG',files:{fotos:[],ficha:null,manual:null,garantia:null}}))])}catch(err){}};r.readAsBinaryString(file);e.target.value='' }
  const cats = ['Todos', ...new Set(inv.map(i => i.cat))]
  const fil = inv.filter(i => (catF==='Todos'||i.cat===catF) && (i.name.toLowerCase().includes(q.toLowerCase())||i.code.toLowerCase().includes(q.toLowerCase())))
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div><h1 style={{ fontSize:24, fontWeight:800, color:T.black, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Inventario</h1><p style={{ color:T.g500, fontSize:13 }}>{inv.length} SKUs · {fmt(inv.reduce((a,i)=>a+i.cost*i.stock,0))}</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <input type="file" ref={fRef} accept=".xlsx,.xls,.csv" style={{ display:'none' }} onChange={imp} />
          <Btn v="white" onClick={()=>fRef.current.click()}>⬆ Importar Excel</Btn>
          <Btn onClick={()=>setShowAdd(true)}>+ Agregar</Btn>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..." style={{ background:T.white, border:`1px solid ${T.borderL}`, borderRadius:10, padding:'8px 14px', color:T.black, fontSize:13, width:220, outline:'none', fontFamily:'inherit' }} />
        {cats.map(c=><button key={c} onClick={()=>setCatF(c)} style={{ cursor:'pointer', fontFamily:'inherit', border:`1px solid ${catF===c?T.gold:T.borderL}`, borderRadius:20, padding:'5px 12px', fontSize:11, fontWeight:600, background:catF===c?T.goldL:T.white, color:catF===c?T.goldD:T.g600 }}>{c}</button>)}
      </div>
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:T.g50 }}>{['#','Código','Producto','Cat.','Prov.','Costo','Precio','Mg%','Stock',''].map(h=><th key={h} style={{ padding:'11px 13px', textAlign:'left', color:T.g500, fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:`1px solid ${T.borderL}`, whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {fil.map((p,i)=>(
                <tr key={p.id} style={{ borderBottom:`1px solid ${T.borderL}`, transition:'background 0.1s' }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.g50}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'9px 13px', color:T.g400, fontSize:11 }}>{i+1}</td>
                  <td style={{ padding:'9px 13px', fontFamily:'monospace', fontSize:10, color:T.g500 }}>{p.code}</td>
                  <td style={{ padding:'9px 13px', color:T.black, fontWeight:600, maxWidth:190 }}>{p.name}</td>
                  <td style={{ padding:'9px 13px' }}><Tag c={CAT_COLOR[p.cat]||T.gold} sm>{p.cat}</Tag></td>
                  <td style={{ padding:'9px 13px' }}><ProvBadge p={p.proveedor} /></td>
                  <td style={{ padding:'9px 13px', color:T.black }}>{fmt(p.cost)}</td>
                  <td style={{ padding:'9px 13px', color:T.goldD, fontWeight:700 }}>{fmt(pubPrice(p))}</td>
                  <td style={{ padding:'9px 13px', color:T.ok, fontWeight:600 }}>{p.margin}%</td>
                  <td style={{ padding:'9px 13px', color:p.stock<50?T.err:T.black, fontWeight:p.stock<50?700:400 }}>{p.stock.toLocaleString()}</td>
                  <td style={{ padding:'9px 13px' }}><button onClick={()=>setInv(inv.filter(x=>x.id!==p.id))} style={{ background:'none', border:'none', color:T.g400, cursor:'pointer', fontSize:14 }}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {showAdd&&<Dialog title="Agregar SKU" onClose={()=>setShowAdd(false)} wide>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Código" value={f.code} onChange={e=>setF({...f,code:e.target.value})} placeholder="SKU-001" />
          <Field label="Nombre" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Nombre del producto" />
          <Pick label="Categoría" value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}>{['Estructura','Estructura KR18','Estructura Lámina','Perfiles Aluminio','Puesta a Tierra','Tornillería','Cable DC','Fusibles DC','Portafusibles','Breakers DC','Supresores DC','Supresores AC','Breakers AC (MCCB)','Conectores FV'].map(c=><option key={c}>{c}</option>)}</Pick>
          <Pick label="Proveedor/Marca" value={f.proveedor} onChange={e=>setF({...f,proveedor:e.target.value})}><option>RINENG</option><option>CUPRUM</option><option>Suntree</option><option>Maraga Solar</option></Pick>
          <Field label="Costo ($)" type="number" value={f.cost} onChange={e=>setF({...f,cost:+e.target.value})} />
          <Field label="Existencia" type="number" value={f.stock} onChange={e=>setF({...f,stock:+e.target.value})} />
          <Field label="Unidad" value={f.unit} onChange={e=>setF({...f,unit:e.target.value})} placeholder="pza, rollo, kg" />
          <Field label="Margen (%)" type="number" value={f.margin} onChange={e=>setF({...f,margin:+e.target.value})} />
          <div style={{ gridColumn:'1/-1' }}><Field label="Descripción" value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Descripción del producto" /></div>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
          <Btn v="white" onClick={()=>setShowAdd(false)}>Cancelar</Btn>
          <Btn onClick={()=>{if(f.code&&f.name){setInv([...inv,{...f,id:Date.now()}]);setShowAdd(false);setF(emp)}}} disabled={!f.code||!f.name}>Guardar</Btn>
        </div>
      </Dialog>}
    </div>
  )
}

/* ─── WEB CATALOG ─────────────────────────────────────────── */
function FileBtn({ label, accept, current, onUpload, onRemove }) {
  const ref = useRef()
  return current
    ? <div style={{ display:'flex', alignItems:'center', gap:8, background:T.okL, border:`1px solid ${T.ok}33`, borderRadius:10, padding:'8px 12px' }}>
        <span style={{ fontSize:11, color:T.ok, fontWeight:600, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>✓ {current.name}</span>
        <button onClick={onRemove} style={{ background:'none', border:'none', color:T.g400, cursor:'pointer', fontSize:12 }}>✕</button>
      </div>
    : <button onClick={()=>ref.current.click()} style={{ background:T.g50, border:`1.5px dashed ${T.border}`, borderRadius:10, padding:'8px 14px', color:T.g500, fontSize:12, fontFamily:'inherit', cursor:'pointer', fontWeight:500, width:'100%', transition:'all 0.15s' }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.goldD}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.g500}}>
        <input type="file" ref={ref} accept={accept} style={{ display:'none' }} onChange={e=>{const f=e.target.files[0];if(f)onUpload({name:f.name,url:URL.createObjectURL(f),type:f.type});e.target.value=''}} />
        {label}
      </button>
}
function PhotoArea({ photos, onAdd, onRemove }) {
  const ref = useRef()
  return <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-start' }}>
    <input type="file" ref={ref} accept="image/*" multiple style={{ display:'none' }} onChange={e=>{Array.from(e.target.files).forEach(f=>onAdd({name:f.name,url:URL.createObjectURL(f),type:f.type}));e.target.value=''}} />
    {photos.map((f,i)=><div key={i} style={{ position:'relative' }}><img src={f.url} alt="" style={{ width:72, height:72, objectFit:'cover', borderRadius:10, border:`1px solid ${T.borderL}` }} /><button onClick={()=>onRemove(i)} style={{ position:'absolute', top:-6, right:-6, width:20, height:20, borderRadius:'50%', background:T.err, border:'none', color:T.white, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✕</button></div>)}
    <button onClick={()=>ref.current.click()} style={{ width:72, height:72, borderRadius:10, border:`1.5px dashed ${T.border}`, background:T.g50, cursor:'pointer', fontSize:24, color:T.g400, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.g400}}>+</button>
  </div>
}

function WebCatalog({ inv, setInv }) {
  const [editId, setEditId] = useState(null)
  const upd = (id, m) => setInv(inv.map(p => p.id===id ? {...p, margin:+m} : p))
  const updFiles = (id, k, v) => setInv(inv.map(p => p.id===id ? {...p, files:{...p.files,[k]:v}} : p))
  const addPhoto = (id, f) => setInv(inv.map(p => p.id===id ? {...p, files:{...p.files, fotos:[...(p.files?.fotos||[]),f]}} : p))
  const remPhoto = (id, i) => setInv(inv.map(p => p.id===id ? {...p, files:{...p.files, fotos:p.files.fotos.filter((_,j)=>j!==i)}} : p))
  const editProd = inv.find(p => p.id===editId)
  return (
    <div>
      <div style={{ marginBottom:22 }}><h1 style={{ fontSize:24, fontWeight:800, color:T.black, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Catálogo web</h1><p style={{ color:T.g500, fontSize:13 }}>Sube fotos, fichas, manuales y garantías por producto</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:14 }}>
        {inv.map(p=>{
          const cc=CAT_COLOR[p.cat]||T.gold; const photos=p.files?.fotos||[]; const docsCount=[p.files?.ficha,p.files?.manual,p.files?.garantia].filter(Boolean).length
          return <Card key={p.id} style={{ padding:'16px' }}>
            <div style={{ height:90, background:photos[0]?'transparent':`${cc}08`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, overflow:'hidden', position:'relative' }}>
              {photos[0]?<img src={photos[0].url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />:<div style={{ fontSize:30, opacity:0.15, color:cc }}>{CAT_ICON[p.cat]||'⬡'}</div>}
              {(photos.length>0||docsCount>0)&&<div style={{ position:'absolute', bottom:5, left:5, background:T.ok, borderRadius:20, padding:'2px 8px', fontSize:9, color:T.white, fontWeight:600 }}>📎 {photos.length}f·{docsCount}d</div>}
            </div>
            <div style={{ fontSize:9, color:T.g400, fontFamily:'monospace', marginBottom:3 }}>{p.code}</div>
            <div style={{ fontWeight:700, color:T.black, marginBottom:8, fontSize:12, lineHeight:1.4 }}>{p.name}</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:11 }}>
              <div><div style={{ color:T.g400, marginBottom:1 }}>Costo</div><div style={{ fontWeight:700 }}>{fmt(p.cost)}</div></div>
              <div style={{ textAlign:'right' }}><div style={{ color:T.g400, marginBottom:1 }}>Precio</div><div style={{ fontWeight:700, color:T.goldD }}>{fmt(pubPrice(p))}</div></div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <span style={{ fontSize:10, color:T.g500 }}>Mg</span>
              <input type="range" min={5} max={80} value={p.margin} onChange={e=>upd(p.id,e.target.value)} style={{ flex:1 }} />
              <span style={{ fontSize:11, fontWeight:700, color:T.ok, minWidth:32 }}>{p.margin}%</span>
            </div>
            <Btn v="white" sm full onClick={()=>setEditId(p.id)}>✏️ Archivos</Btn>
          </Card>
        })}
      </div>
      {editProd&&<Dialog title={editProd.name} onClose={()=>setEditId(null)} wide>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div><div style={{ fontSize:13, fontWeight:600, color:T.black, marginBottom:10 }}>🖼 Fotografías</div><PhotoArea photos={editProd.files?.fotos||[]} onAdd={f=>addPhoto(editProd.id,f)} onRemove={i=>remPhoto(editProd.id,i)} /><div style={{ fontSize:11, color:T.g400, marginTop:6 }}>La primera foto aparece como portada en el catálogo.</div></div>
          <div><div style={{ fontSize:13, fontWeight:600, color:T.black, marginBottom:12 }}>📄 Documentos</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:11, color:T.g600, marginBottom:6, fontWeight:500 }}>📋 Ficha técnica</div><FileBtn accept=".pdf,.doc,.docx" current={editProd.files?.ficha} onUpload={f=>updFiles(editProd.id,'ficha',f)} onRemove={()=>updFiles(editProd.id,'ficha',null)} label="+ Subir PDF" /></div>
              <div><div style={{ fontSize:11, color:T.g600, marginBottom:6, fontWeight:500 }}>📖 Manual</div><FileBtn accept=".pdf,.doc,.docx" current={editProd.files?.manual} onUpload={f=>updFiles(editProd.id,'manual',f)} onRemove={()=>updFiles(editProd.id,'manual',null)} label="+ Subir PDF" /></div>
              <div><div style={{ fontSize:11, color:T.g600, marginBottom:6, fontWeight:500 }}>🛡 Garantía</div><FileBtn accept=".pdf,.doc,.docx" current={editProd.files?.garantia} onUpload={f=>updFiles(editProd.id,'garantia',f)} onRemove={()=>updFiles(editProd.id,'garantia',null)} label="+ Subir PDF" /></div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end' }}><Btn onClick={()=>setEditId(null)}>Listo</Btn></div>
        </div>
      </Dialog>}
    </div>
  )
}

/* ─── QUOTES ──────────────────────────────────────────────── */
function Quotes({ inv, clients, quotes, setQuotes, calcDraft, setCalcDraft }) {
  const [mode, setMode] = useState(calcDraft ? 'new' : 'list')
  const [cur, setCur] = useState(null)
  const [client, setClient] = useState('')
  const [items, setItems] = useState(calcDraft?.items || [])
  const [notes, setNotes] = useState(calcDraft?.notes || '')
  const [qs, setQs] = useState('')

  useEffect(() => { if (calcDraft) { setMode('new'); setItems(calcDraft.items); setNotes(calcDraft.notes || ''); setCalcDraft(null) } }, [calcDraft])

  const add = p => { if (!items.find(i => i.id===p.id)) setItems(s=>[...s,{...p,qty:1,cm:p.margin}]) }
  const upd = (id,k,v) => setItems(s=>s.map(i=>i.id===id?{...i,[k]:+v}:i))
  const rem = id => setItems(s=>s.filter(i=>i.id!==id))
  const sub = items.reduce((a,i)=>a+i.cost*(1+i.cm/100)*i.qty, 0)
  const iva = sub*0.16
  const save = () => {
    if (!client||!items.length) return
    setQuotes(s=>[{ id:Date.now(), folio:`COT-${String(s.length+1).padStart(4,'0')}`, client, items:[...items], notes, sub, iva, total:sub+iva, date:new Date().toLocaleDateString('es-MX'), status:'borrador', createdAt:new Date().toISOString() }, ...s])
    setMode('list'); setItems([]); setClient(''); setNotes('')
  }
  const fil = inv.filter(p=>p.name.toLowerCase().includes(qs.toLowerCase())||p.code.toLowerCase().includes(qs.toLowerCase()))

  if (mode==='view'&&cur) {
    const curClient = clients.find(c => c.company === cur.client)
    return (
    <div>
      <button onClick={()=>setMode('list')} style={{ background:'none', border:'none', color:T.g500, cursor:'pointer', fontFamily:'inherit', fontSize:13, marginBottom:22, fontWeight:500 }}>← Cotizaciones</button>
      <Card style={{ maxWidth:760, padding:'36px 44px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:28, alignItems:'flex-start' }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <img src="/logo.png" alt="Maraga Solar" style={{ height:44, width:44, objectFit:'contain', borderRadius:10 }} />
            <div><div style={{ fontWeight:900, fontSize:17, color:T.black, letterSpacing:'0.06em' }}>MARAGA SOLAR</div><div style={{ fontSize:11, color:T.g500 }}>Monterrey, NL · ventas@maraga.mx · 81 2029 1819</div></div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:800, color:T.goldD, fontSize:18 }}>{cur.folio}</div>
            <div style={{ fontSize:11, color:T.g500, marginTop:2 }}>{cur.date}</div>
            <span style={{ fontSize:11, fontWeight:700, background:STATUS[cur.status]?.bg, color:STATUS[cur.status]?.color, padding:'2px 10px', borderRadius:10, display:'inline-block', marginTop:4 }}>{STATUS[cur.status]?.label}</span>
          </div>
        </div>
        <div style={{ background:T.g50, borderRadius:10, padding:'10px 14px', marginBottom:20 }}><div style={{ fontSize:9, color:T.g500, fontWeight:700, marginBottom:2 }}>CLIENTE</div><div style={{ fontWeight:700, color:T.black }}>{cur.client}</div></div>
        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:16 }}>
          <thead><tr style={{ borderBottom:`2px solid ${T.borderL}` }}>{['Código','Descripción','Cant.','P. Unit.','Total'].map(h=><th key={h} style={{ padding:'8px', textAlign:'left', fontSize:9, color:T.g400, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>{h}</th>)}</tr></thead>
          <tbody>{cur.items?.map(i=>{const u=i.cost*(1+i.cm/100);return <tr key={i.id} style={{ borderBottom:`1px solid ${T.borderL}` }}><td style={{ padding:'9px 8px', fontFamily:'monospace', fontSize:10, color:T.g400 }}>{i.code}</td><td style={{ padding:'9px 8px', color:T.black, fontSize:13 }}>{i.name}</td><td style={{ padding:'9px 8px', textAlign:'center' }}>{i.qty}</td><td style={{ padding:'9px 8px', textAlign:'right', whiteSpace:'nowrap' }}>{fmt(u)}</td><td style={{ padding:'9px 8px', color:T.goldD, fontWeight:700, textAlign:'right', whiteSpace:'nowrap' }}>{fmt(u*i.qty)}</td></tr>})}</tbody>
        </table>
        <div style={{ borderTop:`2px solid ${T.borderL}`, paddingTop:12, marginBottom:16 }}>
          {[['Subtotal',cur.sub],['IVA 16%',cur.iva]].map(([l,v])=><div key={l} style={{ display:'flex', justifyContent:'flex-end', gap:52, marginBottom:5, fontSize:13 }}><span style={{ color:T.g500 }}>{l}</span><span style={{ minWidth:100, textAlign:'right' }}>{fmt(v)}</span></div>)}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:52, marginTop:6 }}><span style={{ fontWeight:800, color:T.black }}>TOTAL</span><span style={{ fontWeight:900, color:T.goldD, fontSize:20, minWidth:100, textAlign:'right' }}>{fmt(cur.total)}</span></div>
        </div>
        {cur.notes&&<div style={{ background:T.g50, borderRadius:10, padding:'10px 14px', fontSize:12, color:T.g600, marginBottom:14 }}><b>Notas: </b>{cur.notes}</div>}
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <DownloadQuoteBtn quote={cur} client={curClient} />
          <Btn v="white" onClick={()=>window.print()}>🖨 Imprimir</Btn>
        </div>
      </Card>
    </div>
  )
  }

  if (mode==='new') return (
    <div>
      <button onClick={()=>setMode('list')} style={{ background:'none', border:'none', color:T.g500, cursor:'pointer', fontFamily:'inherit', fontSize:13, marginBottom:22, fontWeight:500 }}>← Cancelar</button>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.black, margin:'0 0 20px', letterSpacing:'-0.02em' }}>Nueva cotización</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card style={{ padding:'20px' }}>
          <div style={{ fontWeight:600, color:T.black, marginBottom:12 }}>Seleccionar productos</div>
          <input value={qs} onChange={e=>setQs(e.target.value)} placeholder="Buscar..." style={{ background:T.g50, border:`1px solid ${T.borderL}`, borderRadius:10, padding:'9px 12px', color:T.black, fontSize:13, width:'100%', outline:'none', fontFamily:'inherit', marginBottom:10, boxSizing:'border-box' }} />
          <div style={{ maxHeight:340, overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
            {fil.map(p=>(
              <div key={p.id} onClick={()=>add(p)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px', borderRadius:10, cursor:'pointer', background:items.find(i=>i.id===p.id)?T.goldL:'transparent', transition:'background 0.12s' }}
                onMouseEnter={e=>{if(!items.find(i=>i.id===p.id))e.currentTarget.style.background=T.g50}}
                onMouseLeave={e=>{e.currentTarget.style.background=items.find(i=>i.id===p.id)?T.goldL:'transparent'}}>
                <div style={{ flex:1, marginRight:10 }}><div style={{ fontSize:13, color:T.black, fontWeight:600 }}>{p.name}</div><div style={{ fontSize:10, color:T.g400, marginTop:1 }}>{p.code} · {p.stock.toLocaleString()} en stock</div></div>
                <div style={{ textAlign:'right' }}><div style={{ color:T.goldD, fontWeight:700, fontSize:13 }}>{fmt(pubPrice(p))}</div></div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:'16px' }}><Pick label="Cliente" value={client} onChange={e=>setClient(e.target.value)}><option value="">Selecciona un cliente...</option>{clients.map(c=><option key={c.id} value={c.company}>{c.company}</option>)}</Pick></Card>
          <Card style={{ flex:1, padding:'16px' }}>
            <div style={{ fontWeight:600, color:T.black, marginBottom:10 }}>Partidas</div>
            {!items.length&&<div style={{ color:T.g400, fontSize:13, textAlign:'center', padding:'20px 0' }}>← Selecciona productos</div>}
            <div style={{ maxHeight:280, overflowY:'auto' }}>
              {items.map(i=>(
                <div key={i.id} style={{ borderBottom:`1px solid ${T.borderL}`, paddingBottom:10, marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}><div style={{ fontSize:13, color:T.black, fontWeight:600 }}>{i.name}</div><button onClick={()=>rem(i.id)} style={{ background:'none', border:'none', color:T.g400, cursor:'pointer', fontSize:13 }}>✕</button></div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                    {[['Cant.','qty',1],['Margen %','cm',0]].map(([lbl,k,min])=><div key={k}><label style={{ fontSize:9, color:T.g500, display:'block', marginBottom:2, fontWeight:600 }}>{lbl}</label><input type="number" min={min} value={i[k]} onChange={e=>upd(i.id,k,e.target.value)} style={{ background:T.g50, border:`1px solid ${T.borderL}`, borderRadius:7, padding:'5px 8px', color:T.black, fontSize:13, width:'100%', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} /></div>)}
                    <div><div style={{ fontSize:9, color:T.g500, marginBottom:2, fontWeight:600 }}>TOTAL</div><div style={{ fontWeight:800, color:T.goldD, fontSize:15 }}>{fmt(i.cost*(1+i.cm/100)*i.qty)}</div></div>
                  </div>
                </div>
              ))}
            </div>
            {!!items.length&&<div style={{ borderTop:`1px solid ${T.borderL}`, paddingTop:10 }}>
              {[['Subtotal',sub],['IVA 16%',iva]].map(([l,v])=><div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}><span style={{ color:T.g500 }}>{l}</span><span style={{ fontWeight:600 }}>{fmt(v)}</span></div>)}
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}><span style={{ fontWeight:800, color:T.black }}>Total</span><span style={{ fontWeight:900, color:T.goldD, fontSize:18 }}>{fmt(sub+iva)}</span></div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Condiciones, vigencia, tiempo de entrega..." style={{ background:T.g50, border:`1px solid ${T.borderL}`, borderRadius:8, padding:'8px', color:T.black, fontSize:12, width:'100%', fontFamily:'inherit', outline:'none', resize:'none', height:50, boxSizing:'border-box', marginBottom:10 }} />
              <Btn full onClick={save} disabled={!client}>Guardar cotización</Btn>
            </div>}
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div><h1 style={{ fontSize:24, fontWeight:800, color:T.black, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Cotizaciones</h1><p style={{ color:T.g500, fontSize:13 }}>{quotes.length} generadas</p></div>
        <Btn onClick={()=>setMode('new')}>+ Nueva cotización</Btn>
      </div>
      {/* Status filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {Object.entries(STATUS).map(([k,cfg])=>(
          <div key={k} style={{ background:cfg.bg, borderRadius:20, padding:'5px 14px', fontSize:12, fontWeight:700, color:cfg.color }}>
            {cfg.label}: {quotes.filter(q=>q.status===k).length}
          </div>
        ))}
      </div>
      {!quotes.length
        ? <Card style={{ textAlign:'center', padding:'60px' }}><div style={{ fontSize:44, marginBottom:12 }}>📄</div><div style={{ color:T.g400, fontSize:15 }}>Sin cotizaciones aún.</div></Card>
        : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {quotes.map(q=>(
            <Card key={q.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', cursor:'pointer' }} onClick={()=>{setCur(q);setMode('view')}}>
              <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                <div style={{ fontWeight:800, color:T.goldD, fontSize:14, minWidth:90 }}>{q.folio}</div>
                <div><div style={{ fontWeight:600, color:T.black }}>{q.client}</div><div style={{ fontSize:11, color:T.g500 }}>{q.date} · {q.items?.length} productos</div></div>
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:700, background:STATUS[q.status]?.bg, color:STATUS[q.status]?.color, padding:'3px 10px', borderRadius:10 }}>{STATUS[q.status]?.label}</span>
                <div style={{ textAlign:'right' }}><div style={{ fontWeight:800, color:T.black, fontSize:15 }}>{fmt(q.total)}</div><div style={{ fontSize:10, color:T.g400 }}>con IVA</div></div>
              </div>
            </Card>
          ))}
        </div>
      }
    </div>
  )
}

/* ─── CALCULATOR with "Cotizar este proyecto" ─────────────── */
function Calculator({ inv, onQuote }) {
  const [panels, setPanels] = useState(10); const [strings, setStrings] = useState(2); const [rows, setRows] = useState('1VxN')
  const [panW, setPanW] = useState(1134); const [panH, setPanH] = useState(2348); const [res, setRes] = useState(null)
  const RIEL=4860, DIST=25.4, EXC_EXT=98.5, EXC_CP_MAX=650, CLARO_MAX=1800

  const calc = () => {
    const is2V=rows==='2VxN', N=panels, carg=is2V?4:2
    const LC=N*panW+(N+1)*DIST+2*EXC_EXT
    const excCP=Math.min(EXC_CP_MAX,Math.max(EXC_EXT,(LC-1)/2))
    const DE=LC-2*excCP; const claros=Math.max(1,Math.ceil(DE/CLARO_MAX)); const CP=claros+1
    const rielesXcarg=Math.ceil(LC/RIEL)
    const ec=carg*2*(is2V?2:1), mc=(N-1)*carg*(is2V?2:1)
    const un=(Math.max(0,rielesXcarg-1)*carg)+4; const lf=is2V?Math.ceil(CP*3/4)*4:Math.ceil(CP*2/4)*4
    setRes({ N, is2V, LC, DE, claros, CP, carg, perfilesPorCarg:rielesXcarg, ec, mc, un, lf })
  }

  const BOM = res ? [
    { code:'MS-PERFILSOLAR486', n:'Perfil aluminio Maraga 4.86', q:res.perfilesPorCarg*res.carg, u:'pza' },
    { code:'RN-ECT-AD',         n:'End Clamp ajustable T m4',    q:res.ec, u:'pza' },
    { code:'RN-ICT-S35',        n:'Mid Clamp Kit T m2',          q:res.mc, u:'pza' },
    { code:'RN7-SW-3-A002',     n:'L-Foot Metal Set c/T-Bolt m4',q:res.lf, u:'pza' },
    { code:'MS-RN-SR-UR-1',     n:'Kit unión de riel',           q:res.un, u:'pza' },
    { code:'RN7-GS-GL',         n:'Grounding Lug Kit',           q:1, u:'pza' },
    { code:'MS-T-BOLT-KITM8-20',n:'T-Bolt Kit M8×20',           q:(res.ec+res.mc)*2, u:'pza' },
  ] : []

  const totC = BOM.reduce((a,i)=>{const m=inv.find(p=>p.code===i.code);return a+(m?m.cost*i.q:0)},0)
  const totV = BOM.reduce((a,i)=>{const m=inv.find(p=>p.code===i.code);return a+(m?pubPrice(m)*i.q:0)},0)

  const handleQuote = () => {
    const items = BOM.map(item => {
      const m = inv.find(p => p.code===item.code)
      if (!m) return null
      return { ...m, qty: item.q, cm: m.margin }
    }).filter(Boolean)
    onQuote({
      items,
      notes: `Instalación ${rows} · ${panels} paneles · ${panW}×${panH}mm · ${res.claros} claro(s) · LC=${res.LC.toFixed(0)}mm`,
    })
  }

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:T.black, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Calculadora FV</h1>
        <p style={{ color:T.g500, fontSize:13 }}>Lista de materiales · Losa de concreto · 1VxN y 2VxN</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16 }}>
        <Card style={{ padding:'22px' }}>
          <div style={{ display:'grid', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Paneles (N)" type="number" value={panels} onChange={e=>setPanels(+e.target.value)} min={1} />
              <Field label="Strings" type="number" value={strings} onChange={e=>setStrings(+e.target.value)} min={1} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Ancho panel (mm)" type="number" value={panW} onChange={e=>setPanW(+e.target.value)} />
              <Field label="Largo panel (mm)" type="number" value={panH} onChange={e=>setPanH(+e.target.value)} />
            </div>
            <Pick label="Configuración" value={rows} onChange={e=>setRows(e.target.value)}>
              <option value="1VxN">Fila simple 1×N (1–12 paneles)</option>
              <option value="2VxN">Fila doble 2×N (3–12 paneles)</option>
            </Pick>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div style={{ background:T.g50, borderRadius:10, padding:'10px 12px' }}><div style={{ fontSize:9, color:T.g500, marginBottom:3, fontWeight:700, textTransform:'uppercase' }}>Paneles / string</div><div style={{ fontWeight:900, color:T.gold, fontSize:22 }}>{Math.ceil(panels/strings)}</div></div>
              <div style={{ background:T.g50, borderRadius:10, padding:'10px 12px' }}><div style={{ fontSize:9, color:T.g500, marginBottom:3, fontWeight:700, textTransform:'uppercase' }}>Configuración</div><div style={{ fontWeight:700, color:T.black, fontSize:13 }}>{rows}</div></div>
            </div>
            <Btn onClick={calc} full style={{ borderRadius:12 }}>⚡ Calcular</Btn>
          </div>
        </Card>

        <div>
          {!res
            ? <Card style={{ minHeight:320, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                <div style={{ fontSize:48, opacity:0.08 }}>🔧</div>
                <div style={{ color:T.g400, fontSize:14 }}>Ingresa los parámetros y calcula</div>
              </Card>
            : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {[{l:'Costo estructura',v:totC,c:T.goldD,bg:T.goldL},{l:'Precio de venta',v:totV,c:T.ok,bg:T.okL},{l:'Margen',v:totV-totC,c:T.purple,bg:T.purpleL}].map(r=><div key={r.l} style={{ background:r.bg, borderRadius:12, padding:'14px', textAlign:'center' }}><div style={{ fontSize:9, color:r.c, fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{r.l}</div><div style={{ fontSize:16, fontWeight:800, color:r.c }}>{fmt(r.v)}</div></div>)}
              </div>

              {/* BOM */}
              <Card style={{ padding:'18px' }}>
                <div style={{ fontWeight:700, color:T.black, marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span>Lista de materiales</span>
                  <div style={{ display:'flex', gap:8 }}>
                    <div style={{ fontSize:11, color:T.g400 }}>LC: {res.LC.toFixed(0)}mm · {res.claros} claro(s) · {res.CP} conj.pata</div>
                  </div>
                </div>
                {BOM.map((item,i)=>{
                  const m=inv.find(p=>p.code===item.code)
                  return <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 10px', borderRadius:9, background:T.g50, marginBottom:6 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.black }}>{item.n}</div>
                      {m
                        ? <div style={{ fontSize:10, color:T.ok, marginTop:1 }}>✓ Costo: {fmt(m.cost*item.q)} · Venta: {fmt(pubPrice(m)*item.q)} · Stock: {m.stock}</div>
                        : <div style={{ fontSize:10, color:T.err, marginTop:1 }}>⚠ No encontrado en inventario</div>
                      }
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                      <div style={{ fontWeight:900, color:T.goldD, fontSize:22 }}>{item.q}</div>
                      <div style={{ fontSize:9, color:T.g400 }}>{item.u}</div>
                    </div>
                  </div>
                })}
              </Card>

              {/* CTA to quote */}
              <div style={{ background:T.goldL, border:`1.5px solid ${T.gold}44`, borderRadius:14, padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontWeight:700, color:T.black, fontSize:14 }}>¿Listo para cotizar?</div>
                  <div style={{ fontSize:12, color:T.g600, marginTop:2 }}>Esta lista de materiales se pre-carga en una nueva cotización</div>
                </div>
                <Btn onClick={handleQuote} style={{ borderRadius:10, flexShrink:0 }}>📄 Cotizar este proyecto →</Btn>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
