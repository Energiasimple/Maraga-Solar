import React, { useState } from 'react'
import { T, Btn, Field, Dialog } from './ui.jsx'
import { INITIAL_INVENTORY, INITIAL_CLIENTS } from './data.js'
import { loadState, AdminLayout } from './Admin.jsx'
import PubNav from './PubNav.jsx'
import Home from './Home.jsx'
import { Catalog, Detail } from './Catalog.jsx'
import Contact from './Contact.jsx'

function LoginModal({ onClose, onLogin }) {
  const [u, setU] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const go = () => (u === 'admin' && pw === 'maraga2025') ? onLogin() : setErr('Credenciales incorrectas')
  return (
    <Dialog title="Acceso administrador" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Usuario" value={u} onChange={e => setU(e.target.value)} placeholder="admin" />
        <Field label="Contraseña" type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} />
        {err && <div style={{ background: T.errL, color: T.err, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{err}</div>}
        <Btn onClick={go} full style={{ marginTop: 4, borderRadius: 12 }}>Ingresar</Btn>
        <p style={{ textAlign: 'center', color: T.g400, fontSize: 11, margin: 0 }}>admin / maraga2025</p>
      </div>
    </Dialog>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [inv, setInv] = useState(() => loadState('mg_inv', INITIAL_INVENTORY))
  const [clients, setClients] = useState(() => loadState('mg_clients', INITIAL_CLIENTS))
  const [quotes, setQuotes] = useState(() => loadState('mg_quotes', []))
  const [sel, setSel] = useState(null)

  const goAdmin = () => isAdmin ? setPage('admin') : setShowLogin(true)

  return (
    <div style={{ background: T.white, color: T.black, minHeight: '100vh' }}>
      {page !== 'admin' && <PubNav page={page} setPage={setPage} goAdmin={goAdmin} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={() => { setIsAdmin(true); setShowLogin(false); setPage('admin') }} />}
      {page === 'home'    && <Home setPage={setPage} inv={inv} />}
      {page === 'catalog' && <Catalog inv={inv} setSel={setSel} setPage={setPage} />}
      {page === 'detail'  && <Detail prod={sel} setPage={setPage} />}
      {page === 'contact' && <Contact />}
      {page === 'admin' && isAdmin && (
        <AdminLayout
          inv={inv} setInv={setInv}
          clients={clients} setClients={setClients}
          quotes={quotes} setQuotes={setQuotes}
          setPage={setPage} setIsAdmin={setIsAdmin}
        />
      )}
    </div>
  )
}
