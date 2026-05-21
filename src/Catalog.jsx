import React, { useState } from 'react'
import { T, Btn, Tag, ProvBadge, Wrap, CAT_COLOR, CAT_ICON, fmt, pubPrice } from './ui.jsx'

export function Catalog({ inv, setSel, setPage }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todos')
  const [prov, setProv] = useState('Todos')
  const cats = ['Todos', ...new Set(inv.map(i => i.cat))]
  const fil = inv.filter(i =>
    (cat === 'Todos' || i.cat === cat) &&
    (prov === 'Todos' || i.proveedor === prov) &&
    (i.name.toLowerCase().includes(q.toLowerCase()) || i.code.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div style={{ background: T.white, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.borderL}`, padding: '48px 0 32px' }}>
        <Wrap>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: T.black, letterSpacing: '-0.03em', margin: '0 0 6px' }}>Productos</h1>
          <p style={{ color: T.g500, fontSize: 15, margin: 0 }}>{fil.length} productos · Almacén Monterrey, NL · Entrega 48h</p>
        </Wrap>
      </div>

      <Wrap style={{ padding: '32px 2rem' }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.g400, fontSize: 14 }}>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o código..." style={{ background: T.g50, border: `1.5px solid ${T.borderL}`, borderRadius: 12, padding: '11px 14px 11px 38px', color: T.black, fontSize: 14, width: '100%', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = T.gold}
              onBlur={e => e.target.style.borderColor = T.borderL} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cats.map(c => {
              const active = cat === c
              const cc = c === 'Todos' ? T.black : (CAT_COLOR[c] || T.gold)
              return <button key={c} onClick={() => setCat(c)} style={{ cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? cc : T.borderL}`, borderRadius: 20, padding: '7px 16px', fontSize: 12, fontWeight: active ? 700 : 500, background: active ? (c === 'Todos' ? T.black : `${cc}12`) : T.white, color: active ? (c === 'Todos' ? T.white : cc) : T.g500, transition: 'all 0.15s' }}>{c}</button>
            })}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Todos', 'RINENG', 'CUPRUM'].map(p => (
              <button key={p} onClick={() => setProv(p)} style={{ cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${prov === p ? T.gold : T.borderL}`, borderRadius: 20, padding: '7px 14px', fontSize: 12, fontWeight: prov === p ? 700 : 500, background: prov === p ? T.goldL : T.white, color: prov === p ? T.goldD : T.g500 }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {fil.length === 0
          ? <div style={{ textAlign: 'center', padding: '80px 0', color: T.g400, fontSize: 15 }}>Sin resultados para "{q}"</div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {fil.map(p => {
              const cc = CAT_COLOR[p.cat] || T.gold
              const ci = CAT_ICON[p.cat] || '⬡'
              const firstPhoto = p.files?.fotos?.[0]
              const hasFiles = p.files && (p.files.fotos?.length > 0 || p.files.ficha || p.files.manual || p.files.garantia)
              return (
                <div key={p.id} onClick={() => { setSel(p); setPage('detail') }}
                  style={{ background: T.white, border: `1px solid ${T.borderL}`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cc + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = T.shadowMd }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderL; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  {/* Image */}
                  <div style={{ height: 160, background: firstPhoto ? 'transparent' : `${cc}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {firstPhoto
                      ? <img src={firstPhoto.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ fontSize: 60, opacity: 0.12, color: cc }}>{ci}</div>
                    }
                    {hasFiles && <div style={{ position: 'absolute', top: 10, left: 10, background: T.ok, borderRadius: 20, padding: '3px 9px', fontSize: 10, color: T.white, fontWeight: 600 }}>● Docs</div>}
                    <div style={{ position: 'absolute', bottom: 10, right: 10 }}><ProvBadge p={p.proveedor} /></div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: '18px 18px 20px' }}>
                    <div style={{ fontSize: 10, color: T.g400, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6, fontFamily: 'monospace' }}>{p.code}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.black, marginBottom: 14, lineHeight: 1.4, letterSpacing: '-0.01em', minHeight: 40 }}>{p.name}</div>
                    <div style={{ height: 1, background: T.borderL, marginBottom: 14 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: T.black, letterSpacing: '-0.02em' }}>{fmt(pubPrice(p))}</div>
                        <div style={{ fontSize: 10, color: T.g400, marginTop: 2 }}>/{p.unit} · s/IVA</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.ok }} />
                        <span style={{ fontSize: 11, color: T.ok, fontWeight: 600 }}>En stock</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </Wrap>
    </div>
  )
}

export function Detail({ prod, setPage }) {
  const [activePhoto, setActivePhoto] = useState(0)
  if (!prod) { setPage('catalog'); return null }
  const cc = CAT_COLOR[prod.cat] || T.gold
  const photos = prod.files?.fotos || []
  const docs = [
    { key: 'ficha', label: 'Ficha técnica', icon: '📋', file: prod.files?.ficha },
    { key: 'manual', label: 'Manual de instalación', icon: '📖', file: prod.files?.manual },
    { key: 'garantia', label: 'Garantía', icon: '🛡', file: prod.files?.garantia },
  ]

  return (
    <div style={{ background: T.white, minHeight: '100vh' }}>
      <Wrap style={{ padding: '48px 2rem' }}>
        <button onClick={() => setPage('catalog')} style={{ background: 'none', border: 'none', color: T.g500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = T.black}
          onMouseLeave={e => e.currentTarget.style.color = T.g500}>
          ← Productos
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60 }}>
          {/* Left: image */}
          <div>
            <div style={{ background: `${cc}06`, border: `1px solid ${T.borderL}`, borderRadius: 22, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 14 }}>
              {photos.length > 0
                ? <img src={photos[activePhoto]?.url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 80, opacity: 0.1, color: cc }}>{CAT_ICON[prod.cat] || '⬡'}</div>
                  <div style={{ color: T.g400, fontSize: 13, marginTop: 12 }}>Imagen no disponible</div>
                </div>
              }
            </div>
            {photos.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {photos.map((f, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)} style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden', border: `2px solid ${i === activePhoto ? T.gold : T.borderL}`, cursor: 'pointer', padding: 0, background: 'none', transition: 'border-color 0.15s' }}>
                    <img src={f.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
            {/* Documents */}
            {docs.some(d => d.file) && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.g500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Documentos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {docs.filter(d => d.file).map(d => (
                    <a key={d.key} href={d.file.url} target="_blank" rel="noopener noreferrer" download={d.file.name}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.g50, border: `1px solid ${T.borderL}`, borderRadius: 12, color: T.black, fontSize: 13, fontWeight: 500, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = T.white }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderL; e.currentTarget.style.background = T.g50 }}>
                      <span style={{ fontSize: 18 }}>{d.icon}</span>
                      <span style={{ flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 11, color: T.g400 }}>↓</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <Tag c={cc}>{prod.cat}</Tag>
              <ProvBadge p={prod.proveedor} />
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: T.black, margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>{prod.name}</h1>
            <div style={{ fontSize: 12, color: T.g400, marginBottom: 24, fontFamily: 'monospace' }}>SKU: {prod.code}</div>
            <p style={{ fontSize: 15, color: T.g600, lineHeight: 1.75, margin: '0 0 32px' }}>{prod.desc}</p>

            {/* Price block */}
            <div style={{ background: T.g50, border: `1px solid ${T.borderL}`, borderRadius: 16, padding: '22px 24px', marginBottom: 28 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: T.black, letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(pubPrice(prod))}</div>
              <div style={{ fontSize: 12, color: T.g500, marginTop: 8 }}>por {prod.unit} · IVA no incluido · 1,000 {prod.unit} en stock MTY</div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              <Btn onClick={() => setPage('contact')} style={{ borderRadius: 12 }}>Solicitar cotización</Btn>
              <Btn v="white" style={{ borderRadius: 12 }}>📞 81 1234 5678</Btn>
            </div>

            {/* Specs table */}
            <div style={{ border: `1px solid ${T.borderL}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: T.g50, borderBottom: `1px solid ${T.borderL}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.g600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Especificaciones</span>
              </div>
              {[{ k: 'Código', v: prod.code }, { k: 'Categoría', v: prod.cat }, { k: 'Proveedor', v: prod.proveedor }, { k: 'Unidad', v: prod.unit }, { k: 'Stock Monterrey', v: `1,000 ${prod.unit}` }, { k: 'Precio', v: fmt(pubPrice(prod)) }].map((s, i, arr) => (
                <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${T.borderL}` : 'none', fontSize: 14 }}>
                  <span style={{ color: T.g500 }}>{s.k}</span>
                  <span style={{ color: T.black, fontWeight: 600 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    </div>
  )
}
