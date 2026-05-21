import React from 'react'
import { T, Btn, Wrap, CAT_COLOR, CAT_ICON, fmt, pubPrice } from './ui.jsx'
import { EMPRESA } from './data.js'

export default function Home({ setPage, inv }) {
  const estructuraCats = ['Perfiles Aluminio','Estructura','Estructura KR18','Estructura Lámina','Tornillería','Puesta a Tierra']
  const proteccionesCats = ['Cable DC','Fusibles DC','Portafusibles','Breakers DC','Supresores DC','Supresores AC','Breakers AC (MCCB)','Conectores FV']
  const estructuraCount = inv.filter(p => estructuraCats.includes(p.cat)).length
  const proteccionesCount = inv.filter(p => proteccionesCats.includes(p.cat)).length

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>

      {/* ── HERO — true full viewport ── */}
      <section style={{
        width: '100%',
        minHeight: '100svh',
        background: T.black,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* Gold accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${T.gold} 20%, ${T.gold} 80%, transparent)` }} />

        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(247,181,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(247,181,0,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        {/* Ambient glow */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: 'min(45vw, 480px)', height: 'min(45vw, 480px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,181,0,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Wrap style={{ padding: 'clamp(80px,10vh,120px) 2rem', width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(48px, 6vw, 80px)',
            alignItems: 'center',
          }}>
            {/* Text side */}
            <div className="fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 24, height: 1, background: T.gold, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: T.gold, textTransform: 'uppercase' }}>Distribuidor autorizado · Monterrey, NL</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: T.white,
                margin: '0 0 22px',
              }}>
                Estructura<br />
                fotovoltaica<br />
                <span style={{ color: T.gold }}>de precisión.</span>
              </h1>

              <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: '#86868b', lineHeight: 1.8, margin: '0 0 38px', maxWidth: 420 }}>
                Estructura de montaje y protecciones eléctricas para instalaciones solares profesionales. Stock permanente en Monterrey.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Btn onClick={() => setPage('catalog')} style={{ borderRadius: 12 }}>Ver catálogo</Btn>
                <button onClick={() => setPage('contact')} style={{ background: 'none', border: 'none', color: '#86868b', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 0', fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.color = T.white}
                  onMouseLeave={e => e.currentTarget.style.color = '#86868b'}>
                  Solicitar cotización →
                </button>
              </div>
            </div>

            {/* Logo visual */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', animationDelay: '0.15s' }}>
              <div style={{ position: 'relative', width: 'clamp(220px, 30vw, 320px)', height: 'clamp(220px, 30vw, 320px)' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(247,181,0,0.12)' }} />
                <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', border: '1px solid rgba(247,181,0,0.06)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo.png" alt="Maraga Solar" style={{ width: '62%', height: '62%', objectFit: 'contain', filter: 'drop-shadow(0 0 28px rgba(247,181,0,0.2))' }} />
                </div>
              </div>
            </div>
          </div>
        </Wrap>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #444, transparent)' }} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: T.gold, width: '100%' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
            {[
              { n: `${inv.length}`, l: 'Productos' },
              { n: '1,000+', l: 'Pzas por SKU' },
              { n: '48 h', l: 'Entrega nacional' },
              { n: '15+', l: 'Años de experiencia' },
            ].map((s, i, arr) => (
              <div key={i} style={{ textAlign: 'center', padding: '18px 10px', borderRight: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                <div style={{ fontSize: 'clamp(15px,2.5vw,21px)', fontWeight: 900, color: T.black, letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.5)', marginTop: 2, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── TWO PRODUCT FAMILIES ── */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: T.white }}>
        <Wrap>
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 20, height: 1, background: T.gold }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: T.gold, textTransform: 'uppercase' }}>Nuestros productos</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', fontWeight: 800, color: T.black, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 }}>
              Todo lo que necesitas<br />para tu instalación.
            </h2>
            <p style={{ fontSize: 15, color: T.g500, maxWidth: 480, lineHeight: 1.65 }}>
              Desde la estructura de montaje hasta las protecciones eléctricas — todo en un solo proveedor.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {[
              {
                title: 'Estructura fotovoltaica',
                icon: '⬡',
                color: T.gold,
                count: estructuraCount,
                desc: 'Perfiles de aluminio, rieles, clamps, soportes y tornillería para montaje en losa, KR18 y lámina acanalada.',
                items: ['Perfiles Maraga aluminio', 'Sistemas KR18', 'Lámina trapezoidal', 'L-Foots y tornillería'],
              },
              {
                title: 'Protecciones eléctricas',
                icon: '⚡',
                color: '#0071e3',
                brand: 'Suntree',
                count: proteccionesCount,
                desc: 'Cables DC, fusibles, breakers, supresores de sobretensión y conectores MC4 de la marca Suntree.',
                items: ['Cables PV 1500V', 'Breakers DC y MCCB', 'SPD DC y AC', 'Conectores MC4'],
              },
            ].map(fam => (
              <div key={fam.title} onClick={() => setPage('catalog')}
                style={{ background: T.g50, border: `1px solid ${T.borderL}`, borderRadius: 22, padding: '32px 28px', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.borderColor = fam.color + '44'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = T.shadowMd }}
                onMouseLeave={e => { e.currentTarget.style.background = T.g50; e.currentTarget.style.borderColor = T.borderL; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ position: 'absolute', right: -16, bottom: -16, fontSize: 90, opacity: 0.05, color: fam.color, pointerEvents: 'none', lineHeight: 1 }}>{fam.icon}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${fam.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: fam.color }}>{fam.icon}</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: T.black, letterSpacing: '-0.02em' }}>{fam.count}</div>
                    <div style={{ fontSize: 10, color: T.g400, fontWeight: 500 }}>productos</div>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: T.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{fam.title}</h3>
                {fam.brand && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${fam.color}10`, border: `1px solid ${fam.color}25`, borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: fam.color }}>Marca: {fam.brand}</span>
                </div>}
                <p style={{ fontSize: 13, color: T.g500, margin: '0 0 20px', lineHeight: 1.6 }}>{fam.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
                  {fam.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.g700 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: fam.color, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: fam.color, fontWeight: 700 }}>Ver productos →</span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── WHY MARAGA ── */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: T.black }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 20, height: 1, background: T.gold }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: T.gold, textTransform: 'uppercase' }}>Maraga Solar</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', fontWeight: 800, color: T.white, letterSpacing: '-0.03em', margin: '0 0 18px', lineHeight: 1.1 }}>
                Calidad que<br />no compromete.
              </h2>
              <p style={{ fontSize: 15, color: '#86868b', lineHeight: 1.8, margin: '0 0 32px' }}>
                Distribuidor especializado en componentes para instalaciones fotovoltaicas profesionales. Stock permanente, entrega rápida y soporte técnico en Monterrey, NL.
              </p>
              <Btn onClick={() => setPage('contact')} style={{ borderRadius: 12 }}>Hablar con un especialista</Btn>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { i: '⬡', t: 'Stock garantizado',   d: '1,000+ piezas por SKU disponibles. Sin esperas ni faltantes.' },
                { i: '🚚', t: 'Envío en 48 horas',   d: 'Entrega a toda la República Mexicana con rastreo.' },
                { i: '⚡', t: 'Marcas certificadas',  d: 'Componentes con garantía de fábrica en todos los productos.' },
                { i: '📐', t: 'Asesoría técnica',     d: 'Soporte especializado en diseño e ingeniería fotovoltaica.' },
              ].map(item => (
                <div key={item.t} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${T.gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: T.gold, flexShrink: 0 }}>{item.i}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 4, letterSpacing: '-0.01em' }}>{item.t}</div>
                    <div style={{ fontSize: 13, color: '#86868b', lineHeight: 1.6 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── CONTACT / LOCATION ── */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: T.white }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(40px, 5vw, 72px)', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 20, height: 1, background: T.gold }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: T.gold, textTransform: 'uppercase' }}>Ubicación</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, color: T.black, letterSpacing: '-0.03em', margin: '0 0 24px', lineHeight: 1.1 }}>Visítanos en<br />Monterrey.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { i: '📍', t: 'Almacén', d: `${EMPRESA.direccion}\n${EMPRESA.ciudad}` },
                  { i: '📞', t: 'Teléfono', d: EMPRESA.telefono },
                  { i: '✉️', t: 'Email', d: EMPRESA.email },
                  { i: '🕐', t: 'Horario', d: EMPRESA.horario },
                ].map(c => (
                  <div key={c.t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: T.goldL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.i}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: T.black, fontSize: 13, marginBottom: 2 }}>{c.t}</div>
                      <div style={{ color: T.g500, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Btn onClick={() => setPage('contact')} style={{ borderRadius: 12 }}>Solicitar cotización</Btn>
                <a href={EMPRESA.maps} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Btn v="white" style={{ borderRadius: 12 }}>Ver en mapa →</Btn>
                </a>
              </div>
            </div>
            {/* Map embed */}
            <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.borderL}`, boxShadow: T.shadowMd, height: 'clamp(260px, 35vw, 380px)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.3!2d-100.3161!3d25.6866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866295b3c7b2c6d1%3A0x1!2sAv.+Alfonso+Reyes+2819%2C+Del+Prado%2C+64410+Monterrey%2C+N.L.!5e0!3m2!1ses!2smx!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maraga Solar — Ubicación"
              />
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(72px,10vw,120px) 0', background: T.g50, borderTop: `1px solid ${T.borderL}`, textAlign: 'center' }}>
        <Wrap>
          <img src="/logo.png" alt="Maraga Solar" style={{ height: 52, width: 52, objectFit: 'contain', borderRadius: 14, margin: '0 auto 28px', filter: 'drop-shadow(0 4px 14px rgba(247,181,0,0.25))' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', fontWeight: 900, color: T.black, letterSpacing: '-0.03em', margin: '0 0 14px', lineHeight: 1.1 }}>
            Cotiza tu proyecto<br />hoy mismo.
          </h2>
          <p style={{ fontSize: 15, color: T.g500, margin: '0 auto 40px', maxWidth: 380, lineHeight: 1.7 }}>Respuesta en menos de 24 horas. Atención directa de nuestro equipo técnico.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn onClick={() => setPage('contact')} style={{ borderRadius: 12 }}>Solicitar cotización</Btn>
            <a href={`tel:${EMPRESA.telefono.replace(/\s/g,'')}`} style={{ textDecoration: 'none' }}>
              <Btn v="white" style={{ borderRadius: 12 }}>📞 {EMPRESA.telefono}</Btn>
            </a>
          </div>
        </Wrap>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: T.black, padding: '36px 0' }}>
        <Wrap>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo.png" alt="Maraga Solar" style={{ height: 34, width: 34, objectFit: 'contain', borderRadius: 8 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 12, color: T.white, letterSpacing: '0.1em' }}>MARAGA SOLAR</div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 1 }}>{EMPRESA.ciudad}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>{EMPRESA.email} · {EMPRESA.telefono}</div>
            <div style={{ fontSize: 11, color: '#333' }}>© 2025 Maraga Solar</div>
          </div>
        </Wrap>
      </footer>
    </div>
  )
}
