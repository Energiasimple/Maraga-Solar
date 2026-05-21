import React, { useState } from 'react'
import { T, Btn, Field, Wrap } from './ui.jsx'
import { EMPRESA } from './data.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', company: '', email: '', phone: '', msg: '' })
  return (
    <div style={{ background: T.white, minHeight: '100vh' }}>
      <div style={{ borderBottom: `1px solid ${T.borderL}`, padding: '48px 0 32px' }}>
        <Wrap>
          <h1 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 800, color: T.black, letterSpacing: '-0.03em', margin: '0 0 6px' }}>Contacto</h1>
          <p style={{ color: T.g500, fontSize: 15, margin: 0 }}>Respuesta en menos de 24 horas hábiles · Atención personalizada</p>
        </Wrap>
      </div>
      <Wrap style={{ padding: '56px 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(40px,6vw,72px)' }}>
          {/* Form */}
          <div>
            {sent
              ? <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.okL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>✅</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: T.black, margin: '0 0 10px', letterSpacing: '-0.02em' }}>¡Solicitud enviada!</h2>
                <p style={{ color: T.g500, fontSize: 15 }}>Te contactaremos a <b style={{ color: T.black }}>{f.email}</b></p>
              </div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 13 }}>
                  <Field label="Nombre" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Tu nombre" />
                  <Field label="Empresa" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} placeholder="Empresa SA de CV" />
                  <Field label="Correo" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="correo@empresa.mx" />
                  <Field label="Teléfono" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder={EMPRESA.telefono} />
                </div>
                <Field label="Descripción del proyecto" area value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} placeholder="Número de paneles, tipo de montaje, ubicación, volumen estimado..." />
                <Btn onClick={() => { if (f.name && f.email) setSent(true) }} disabled={!f.name || !f.email} style={{ borderRadius: 12, marginTop: 4 }}>Enviar solicitud</Btn>
              </div>
            }
          </div>

          {/* Info + map */}
          <div>
            <img src="/logo.png" alt="Maraga Solar" style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 12, marginBottom: 18 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Maraga Solar</h3>
            <p style={{ fontSize: 14, color: T.g500, lineHeight: 1.7, margin: '0 0 24px' }}>Distribuidor de componentes fotovoltaicos con almacén en Monterrey, NL.</p>

            {[
              { i: '📍', t: 'Almacén', d: `${EMPRESA.direccion}\n${EMPRESA.ciudad}` },
              { i: '📞', t: 'Teléfono', d: EMPRESA.telefono },
              { i: '✉️', t: 'Email', d: EMPRESA.email },
              { i: '🕐', t: 'Horario', d: EMPRESA.horario },
            ].map(c => (
              <div key={c.t} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: T.goldL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{c.i}</div>
                <div>
                  <div style={{ fontWeight: 600, color: T.black, fontSize: 12, marginBottom: 1 }}>{c.t}</div>
                  <div style={{ color: T.g500, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.d}</div>
                </div>
              </div>
            ))}

            {/* Mini map */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.borderL}`, marginTop: 20, height: 180 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.3!2d-100.3161!3d25.6866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866295b3c7b2c6d1%3A0x1!2sAv.+Alfonso+Reyes+2819%2C+Del+Prado%2C+64410+Monterrey%2C+N.L.!5e0!3m2!1ses!2smx!4v1"
                width="100%" height="100%" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Maraga Solar"
              />
            </div>
            <a href={EMPRESA.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: T.gold, fontWeight: 600, textDecoration: 'none' }}>Abrir en Google Maps →</a>
          </div>
        </div>
      </Wrap>
    </div>
  )
}
