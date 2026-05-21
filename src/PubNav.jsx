import React, { useState, useEffect } from 'react'
import { T, Btn } from './ui.jsx'

export default function PubNav({ page, setPage, goAdmin }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [{ id: 'home', l: 'Inicio' }, { id: 'catalog', l: 'Productos' }, { id: 'contact', l: 'Contacto' }]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? T.borderL : 'transparent'}`,
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
            <img src="/logo.png" alt="Maraga Solar" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 8 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', color: T.black, lineHeight: 1.1 }}>MARAGA</div>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', color: T.gold, lineHeight: 1 }}>SOLAR</div>
            </div>
          </button>

          {/* Desktop */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {links.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                background: 'none', border: 'none', padding: '8px 16px',
                fontFamily: 'inherit', fontSize: 14, fontWeight: page === n.id ? 600 : 400,
                color: page === n.id ? T.black : T.g500, cursor: 'pointer', borderRadius: 8,
                transition: 'all 0.2s', letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => e.currentTarget.style.color = T.black}
                onMouseLeave={e => e.currentTarget.style.color = page === n.id ? T.black : T.g500}
              >{n.l}</button>
            ))}
            <div style={{ width: 1, height: 16, background: T.border, margin: '0 8px' }} />
            <Btn v="dark" sm onClick={goAdmin} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8 }}>Admin</Btn>
          </div>

          {/* Mobile hamburger */}
          <button className="hide-desktop" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: T.black, fontSize: 20 }}>{menuOpen ? '✕' : '☰'}</button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="hide-desktop" style={{ background: T.white, borderTop: `1px solid ${T.borderL}`, padding: '16px 2rem 20px' }}>
            {links.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', background: page === n.id ? T.g100 : 'none', border: 'none', padding: '13px 14px', fontFamily: 'inherit', fontSize: 15, fontWeight: page === n.id ? 600 : 400, color: T.black, cursor: 'pointer', borderRadius: 10, marginBottom: 4 }}>{n.l}</button>
            ))}
            <Btn v="dark" full sm onClick={() => { goAdmin(); setMenuOpen(false) }} style={{ marginTop: 10, borderRadius: 10 }}>Admin</Btn>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 60 }} />
    </>
  )
}
