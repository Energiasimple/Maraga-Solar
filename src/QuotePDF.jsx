import React, { useRef } from 'react'

// ── HELPERS ──────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n)

function addDays(dateStr, days) {
  const parts = dateStr.split('/')
  const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Real Maraga Solar logo embedded as base64
const LOGO_SRC = "data:image/png;base64,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miu76dnI7VDJIiLtSmCIiAIiIAiIgCg8lKIDFXmzUVzYBURN6xvkyAYc31FUa96WraDMsINTD2ljfHH3o5+xbNwocFz124do7gmXNw7uhvUlwmptGrp2NKYGUwtqXPT9tuO86ana2U/pjPFd71WLloiaJhdRVQkPwZsD4wPkXzyv4LraZOaL30+W/odHTXyKXSTQqWEwshV2S7UeTUUEoaOTovHB9y6HD5weYXLzUVRCuJGKnmhbR1McqZY7JxREWrhT3RchERAERCsmsc7ZCFciBF9aelqp5N2Ommd3kMJwspSaZvVSA4UgiaeRkfj8mVuwW2rnx7ONV+hrSVcMfichhkVxpNCuJa6srS0drYhx95Wdt+lbNSjIpjM/tdM7ez7DwXQUnBVwm1kwxPn/ANFbNfYGLhuprijo6uteW0lPJP6WDI9/JZ236Or5hmpkbTd4A3yPyD41sOGJsbQ1jWtA5ADC57vYutouB6SLWdVc77FRNfJlTDEwhgbZpa00RbIYPCJRyfN4x+ZZ1kYaAGgAdgAwpDVyXXUtDT0zOWNiIVEkz5Fy9ck9ik+hFC3DyJRAiEhERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBMIiAIiIAiIgCIiAIiIAiIgCIiAJhEQHEgHmvhPS08wAlhjeB2OYCuyi85ImyJhyEoqoYZ+nLK/wAq3w+wYXVfo6xO/wAFcP3R3zqxYUrRfaKJ+8TfQ921U7dnr6la+k+zH9Lm/HO+dPpNsXbTSH1yuVkRYJY7en+i30J/GVH+9fUwbNLWJv8Ai+M+skrvU9ptlO7fhoKeN3e2MBd4Jhe8dtpIv040T6Hm6eV3icq/UgAdwU8kyi20a1NkPFVCnCgKVkoQjCIU7VI3JwiIoJCIikBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBEUZQEot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oNxs5HjsIw1x7/QVS6umqaWTq6iF0Tx2OHA+orcoBC+c0EU7CyVge082kcCuMu/CFNVvWaJeVy79lLijvEtOiNVMoaY9yNBMjYw5rnO5NackrbX0DtJ/xfT/AIsL7QW2ipz9j00UQ+1YAqBnAUufekTHkb68Qp0Ya/selK6umElSx1PAOPjcHH7351Y7houw3KS2fRGkFXDbJOupaaUl0ImHKVzDwfI0Z3XOzgnPPirTjguG7yXbWexU1pZiJMqu6qUtVXTVLveXTsfQHgiDkiuzRUlERSSEREAREQBERAEREAREQBERAEREAREQBERAEPJFxkY2RhY4ZBQGI1LW08VBNBvb08kZbHE3i5xIOAAsBZLbLNW2ym3sxWtrjLK0cHSHB3AfR2+xW2KhpoJTJDBEx7uBcG+MfavsI2tHijCqJ7d+KmSSVdE6fXJ7MmVjOVDrVFFT1MkUk0TXuhcXMJHknGF1orHQx1NXN1LXmsx1zXDIOBj41lWjCnC3X0kL3Zc1FX/EPPnd0U+FNBFTQRwxN3WMaGtHcByX2IypQL2SNqNwiGKrkboQKVBWSNRARhFKLLBCqOxTjgoClCSCiIUBKIiAIiIAiIgCIiAIiIAiIgCIiAIiIBhERAEREATAREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARMogCLg+RjfKe0esrF1N9tMEm5NXQMd8HrASfYtaWrhiTL3on1Mmxvd4UyZdFXn6tsrMfZEjs90ZXwfrWztx4tS7PdGtJ18t7d5m+psJQ1K/AvoWhFVvp3tH6nV/il9G6xszvKllZ64zx9yxS/W9dpW+pK0NSnwL6FlRYaG/2iUncuEHDnmQBZSKZj2hzHNcDy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"
const LogoSVG = () => (
  <img src={LOGO_SRC} alt="Maraga Solar" style={{width:'72px', height:'72px', objectFit:'contain'}} />
)

// ── PDF CONTENT COMPONENT ─────────────────────────────────────────
export function QuotePDFContent({ quote, client }) {
  const items = quote.items || []
  const sub   = items.reduce((a, i) => a + i.cost * (1 + i.cm / 100) * i.qty, 0)
  const iva   = sub * 0.16
  const total = sub + iva

  const vencimiento = addDays(quote.date, 15)

  const styles = {
    page: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: '#ffffff',
      color: '#1d1d1f',
      width: '210mm',
      minHeight: '297mm',
      padding: '14mm 16mm',
      boxSizing: 'border-box',
      fontSize: '10pt',
      lineHeight: 1.5,
    },
    // Header
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8mm',
      paddingBottom: '6mm',
      borderBottom: '2px solid #F7B500',
    },
    logoBlock: { display: 'flex', alignItems: 'center', gap: '10px' },
    companyName: { fontWeight: 900, fontSize: '18pt', letterSpacing: '-0.5px', color: '#111' },
    companySub: { fontSize: '8pt', color: '#86868b', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' },
    companyContact: { fontSize: '8pt', color: '#86868b', marginTop: '6px', lineHeight: 1.7 },
    // Quote info block
    quoteBlock: { textAlign: 'right' },
    quoteFolio: { fontSize: '22pt', fontWeight: 900, color: '#F7B500', letterSpacing: '-1px', lineHeight: 1 },
    quoteLabel: { fontSize: '7pt', color: '#86868b', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '3px' },
    quoteDates: { marginTop: '8px' },
    quoteDateRow: { display: 'flex', justifyContent: 'flex-end', gap: '16px', fontSize: '8.5pt', marginTop: '3px' },
    quoteDateLabel: { color: '#86868b' },
    quoteDateVal: { fontWeight: 700, color: '#1d1d1f' },
    // Gold accent bar
    accentBar: {
      background: 'linear-gradient(90deg, #F7B500 0%, #B8860B 100%)',
      height: '3px',
      borderRadius: '2px',
      marginBottom: '7mm',
    },
    // Client section
    sectionRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6mm',
      marginBottom: '7mm',
    },
    sectionBox: {
      background: '#F5F5F7',
      borderRadius: '8px',
      padding: '5mm',
    },
    sectionTitle: {
      fontSize: '7pt',
      fontWeight: 700,
      color: '#86868b',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    sectionDot: {
      width: '5px', height: '5px', borderRadius: '50%',
      background: '#F7B500', display: 'inline-block', flexShrink: 0,
    },
    clientName: { fontWeight: 800, fontSize: '11pt', color: '#1d1d1f', marginBottom: '3px' },
    clientDetail: { fontSize: '8.5pt', color: '#3d3d3f', lineHeight: 1.7 },
    // Table
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '6mm' },
    thead: { background: '#111111' },
    th: {
      padding: '3mm 4mm',
      textAlign: 'left',
      fontSize: '7.5pt',
      fontWeight: 700,
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    thRight: {
      padding: '3mm 4mm',
      textAlign: 'right',
      fontSize: '7.5pt',
      fontWeight: 700,
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    tdCode: {
      padding: '3mm 4mm',
      fontSize: '7.5pt',
      color: '#86868b',
      fontFamily: 'Courier New, monospace',
      verticalAlign: 'top',
      borderBottom: '1px solid #e8e8ed',
    },
    tdName: {
      padding: '3mm 4mm',
      fontSize: '9pt',
      color: '#1d1d1f',
      fontWeight: 600,
      verticalAlign: 'top',
      borderBottom: '1px solid #e8e8ed',
    },
    tdNameSub: { fontSize: '7.5pt', color: '#86868b', fontWeight: 400, marginTop: '2px' },
    tdCenter: {
      padding: '3mm 4mm',
      textAlign: 'center',
      fontSize: '9pt',
      color: '#1d1d1f',
      verticalAlign: 'top',
      borderBottom: '1px solid #e8e8ed',
    },
    tdRight: {
      padding: '3mm 4mm',
      textAlign: 'right',
      fontSize: '9pt',
      color: '#1d1d1f',
      verticalAlign: 'top',
      borderBottom: '1px solid #e8e8ed',
    },
    tdTotal: {
      padding: '3mm 4mm',
      textAlign: 'right',
      fontSize: '9.5pt',
      fontWeight: 700,
      color: '#B8860B',
      verticalAlign: 'top',
      borderBottom: '1px solid #e8e8ed',
    },
    // Totals
    totalsRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '6mm',
    },
    totalsBox: {
      width: '68mm',
    },
    totalLine: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2.5mm 0',
      borderBottom: '1px solid #e8e8ed',
      fontSize: '9pt',
    },
    totalLabel: { color: '#86868b' },
    totalVal: { fontWeight: 600, color: '#1d1d1f' },
    totalFinalLine: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '3mm 4mm',
      background: '#111111',
      borderRadius: '6px',
      marginTop: '3mm',
    },
    totalFinalLabel: { fontWeight: 700, color: '#ffffff', fontSize: '10pt' },
    totalFinalVal: { fontWeight: 900, color: '#F7B500', fontSize: '15pt', letterSpacing: '-0.5px' },
    // Notes & guarantees
    bottomGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '5mm',
      marginBottom: '6mm',
    },
    notesBox: {
      background: '#F5F5F7',
      borderRadius: '8px',
      padding: '4mm',
    },
    notesTitle: {
      fontSize: '7pt', fontWeight: 700, color: '#86868b',
      textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px',
    },
    notesText: { fontSize: '8.5pt', color: '#3d3d3f', lineHeight: 1.65 },
    guaranteeBox: {
      background: '#FFF8E1',
      border: '1px solid #F7B50044',
      borderRadius: '8px',
      padding: '4mm',
    },
    guaranteeTitle: {
      fontSize: '7pt', fontWeight: 700, color: '#B8860B',
      textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px',
    },
    guaranteeItem: {
      display: 'flex', alignItems: 'flex-start', gap: '5px',
      marginBottom: '4px', fontSize: '8pt', color: '#3d3d3f', lineHeight: 1.5,
    },
    guaranteeDot: {
      width: '4px', height: '4px', borderRadius: '50%',
      background: '#F7B500', marginTop: '5px', flexShrink: 0,
    },
    // Footer
    footer: {
      borderTop: '1.5px solid #e8e8ed',
      paddingTop: '4mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 'auto',
    },
    footerLeft: { fontSize: '7.5pt', color: '#86868b', lineHeight: 1.8 },
    footerRight: { textAlign: 'right', fontSize: '7.5pt', color: '#86868b', lineHeight: 1.8 },
    footerBrand: { fontWeight: 800, color: '#1d1d1f', fontSize: '8pt' },
    // Stamp area
    stampArea: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '4mm',
    },
    stampBox: {
      border: '1.5px dashed #d2d2d7',
      borderRadius: '8px',
      padding: '4mm 8mm',
      textAlign: 'center',
      width: '55mm',
    },
    stampLabel: { fontSize: '7pt', color: '#86868b', marginBottom: '8px' },
    stampLine: { borderTop: '1px solid #d2d2d7', marginTop: '14px', paddingTop: '3px', fontSize: '7pt', color: '#86868b' },
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoBlock}>
          <LogoSVG />
          <div>
            <div style={styles.companyName}>MARAGA</div>
            <div style={styles.companySub}>Solar</div>
            <div style={styles.companyContact}>
              Av. Alfonso Reyes 2819, Del Prado, CP 64410<br />
              Monterrey, Nuevo León · México<br />
              81 2029 1819 · ventas@maraga.mx
            </div>
          </div>
        </div>
        <div style={styles.quoteBlock}>
          <div style={styles.quoteLabel}>Cotización</div>
          <div style={styles.quoteFolio}>{quote.folio}</div>
          <div style={styles.quoteDates}>
            <div style={styles.quoteDateRow}>
              <span style={styles.quoteDateLabel}>Fecha de emisión:</span>
              <span style={styles.quoteDateVal}>{quote.date}</span>
            </div>
            <div style={styles.quoteDateRow}>
              <span style={styles.quoteDateLabel}>Fecha de vencimiento:</span>
              <span style={{ ...styles.quoteDateVal, color: '#B8860B' }}>{vencimiento}</span>
            </div>
            <div style={styles.quoteDateRow}>
              <span style={styles.quoteDateLabel}>Vigencia:</span>
              <span style={styles.quoteDateVal}>15 días naturales</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCENT LINE */}
      <div style={styles.accentBar} />

      {/* CLIENT + QUOTE META */}
      <div style={styles.sectionRow}>
        <div style={styles.sectionBox}>
          <div style={styles.sectionTitle}>
            <span style={styles.sectionDot} />
            Datos del cliente
          </div>
          <div style={styles.clientName}>{client?.company || quote.client}</div>
          {client?.rfc     && <div style={styles.clientDetail}><b>RFC:</b> {client.rfc}</div>}
          {client?.contact && <div style={styles.clientDetail}><b>Contacto:</b> {client.contact}</div>}
          {client?.email   && <div style={styles.clientDetail}><b>Correo:</b> {client.email}</div>}
          {client?.phone   && <div style={styles.clientDetail}><b>Tel:</b> {client.phone}</div>}
          {client?.address && <div style={styles.clientDetail}><b>Dirección:</b> {client.address}</div>}
          {client?.activity && <div style={styles.clientDetail}><b>Actividad:</b> {client.activity}</div>}
        </div>
        <div style={styles.sectionBox}>
          <div style={styles.sectionTitle}>
            <span style={styles.sectionDot} />
            Detalles de la cotización
          </div>
          {[
            ['Número de cotización', quote.folio],
            ['Fecha de emisión', quote.date],
            ['Fecha de vencimiento', vencimiento],
            ['Vigencia', '15 días naturales'],
            ['Moneda', 'MXN (Peso Mexicano)'],
            ['Condiciones de pago', '50% anticipo · 50% contra entrega'],
            ['Tiempo de entrega', '3–5 días hábiles en MTY'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', gap: '8px', fontSize: '8.5pt', marginBottom: '2px' }}>
              <span style={{ color: '#86868b', minWidth: '120px' }}>{l}:</span>
              <span style={{ fontWeight: 600, color: '#1d1d1f' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={{ ...styles.th, width: '12%' }}>Código</th>
            <th style={{ ...styles.th, width: '38%' }}>Descripción del producto</th>
            <th style={{ ...styles.thRight, width: '10%' }}>Cant.</th>
            <th style={{ ...styles.thRight, width: '10%' }}>Unidad</th>
            <th style={{ ...styles.thRight, width: '15%' }}>Precio unit.</th>
            <th style={{ ...styles.thRight, width: '15%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const unitPrice = item.cost * (1 + item.cm / 100)
            const lineTotal = unitPrice * item.qty
            const rowBg = idx % 2 === 0 ? '#ffffff' : '#FAFAFA'
            return (
              <tr key={item.id} style={{ background: rowBg }}>
                <td style={styles.tdCode}>{item.code}</td>
                <td style={styles.tdName}>
                  {item.name}
                  {item.desc && <div style={styles.tdNameSub}>{item.desc.substring(0, 70)}{item.desc.length > 70 ? '…' : ''}</div>}
                </td>
                <td style={styles.tdCenter}>{item.qty}</td>
                <td style={styles.tdCenter}>{item.unit || 'pza'}</td>
                <td style={styles.tdRight}>{fmt(unitPrice)}</td>
                <td style={styles.tdTotal}>{fmt(lineTotal)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* TOTALS */}
      <div style={styles.totalsRow}>
        <div style={styles.totalsBox}>
          {[['Subtotal', fmt(sub)], ['IVA (16%)', fmt(iva)]].map(([l, v]) => (
            <div key={l} style={styles.totalLine}>
              <span style={styles.totalLabel}>{l}</span>
              <span style={styles.totalVal}>{v}</span>
            </div>
          ))}
          <div style={styles.totalFinalLine}>
            <span style={styles.totalFinalLabel}>TOTAL</span>
            <span style={styles.totalFinalVal}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* NOTES + GUARANTEES */}
      <div style={styles.bottomGrid}>
        <div style={styles.notesBox}>
          <div style={styles.notesTitle}>📋 Notas y condiciones</div>
          <div style={styles.notesText}>
            {quote.notes || 'Esta cotización tiene una vigencia de 15 días naturales a partir de la fecha de emisión. Los precios pueden estar sujetos a cambios sin previo aviso.'}
          </div>
          <div style={{ marginTop: '6px', fontSize: '8pt', color: '#86868b', lineHeight: 1.6 }}>
            <b>Forma de pago:</b> Transferencia bancaria o depósito.<br />
            <b>Entrega:</b> 3–5 días hábiles en Monterrey, NL.<br />
            <b>Flete:</b> Por cuenta del cliente fuera de MTY.
          </div>
        </div>
        <div style={styles.guaranteeBox}>
          <div style={styles.guaranteeTitle}>🛡 Garantías del producto</div>
          {[
            'Todos los productos cuentan con garantía de fábrica del fabricante original.',
            'Estructura fotovoltaica RINENG: garantía de 10 años contra defectos de fabricación.',
            'Perfiles de aluminio CUPRUM: garantía de 10 años contra corrosión y deformación.',
            'Protecciones eléctricas Suntree: garantía de 2 años en condiciones normales de uso.',
            'La garantía no cubre daños por instalación incorrecta, sobretensiones externas o mal uso.',
          ].map((g, i) => (
            <div key={i} style={styles.guaranteeItem}>
              <span style={styles.guaranteeDot} />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNATURE AREA */}
      <div style={styles.stampArea}>
        <div style={styles.stampBox}>
          <div style={styles.stampLabel}>Autorizado por</div>
          <div style={{ height: '18mm' }} />
          <div style={styles.stampLine}>Firma y sello · Maraga Solar</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.footerBrand}>MARAGA SOLAR</div>
          Av. Alfonso Reyes 2819, Del Prado, CP 64410<br />
          Monterrey, Nuevo León · México
        </div>
        <div style={styles.footerRight}>
          ventas@maraga.mx<br />
          81 2029 1819<br />
          <span style={{ color: '#F7B500', fontWeight: 700 }}>{quote.folio}</span> · {quote.date}
        </div>
      </div>

    </div>
  )
}

// ── DOWNLOAD FUNCTION ─────────────────────────────────────────────
export function downloadQuotePDF(quote, client) {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left     = '-9999px'
  container.style.top      = '0'
  container.style.zIndex   = '-1'
  document.body.appendChild(container)

  // Render to hidden div
  const React = window.React
  const ReactDOM = window.ReactDOM || require('react-dom')

  // We use a print window approach for reliable PDF output
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) { alert('Permite ventanas emergentes para descargar el PDF'); return }

  const items = quote.items || []
  const sub   = items.reduce((a, i) => a + i.cost * (1 + i.cm / 100) * i.qty, 0)
  const iva   = sub * 0.16
  const total = sub + iva
  const fmtN  = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n)

  function addD(dateStr, days) {
    const parts = dateStr.split('/')
    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    d.setDate(d.getDate() + days)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  const venc = addD(quote.date, 15)

  const rowsHTML = items.map((item, idx) => {
    const up = item.cost * (1 + item.cm / 100)
    const lt = up * item.qty
    const bg = idx % 2 === 0 ? '#ffffff' : '#fafafa'
    const descSnip = item.desc ? `<div style="font-size:7.5pt;color:#86868b;margin-top:2px">${item.desc.substring(0,80)}${item.desc.length>80?'…':''}</div>` : ''
    return `<tr style="background:${bg}">
      <td style="padding:3mm 3.5mm;font-family:monospace;font-size:7.5pt;color:#86868b;border-bottom:1px solid #e8e8ed;vertical-align:top">${item.code}</td>
      <td style="padding:3mm 3.5mm;font-size:9pt;font-weight:600;color:#1d1d1f;border-bottom:1px solid #e8e8ed;vertical-align:top">${item.name}${descSnip}</td>
      <td style="padding:3mm 3.5mm;text-align:center;font-size:9pt;border-bottom:1px solid #e8e8ed;vertical-align:top">${item.qty}</td>
      <td style="padding:3mm 3.5mm;text-align:center;font-size:9pt;border-bottom:1px solid #e8e8ed;vertical-align:top">${item.unit||'pza'}</td>
      <td style="padding:3mm 3.5mm;text-align:right;font-size:9pt;border-bottom:1px solid #e8e8ed;vertical-align:top">${fmtN(up)}</td>
      <td style="padding:3mm 3.5mm;text-align:right;font-size:9.5pt;font-weight:700;color:#B8860B;border-bottom:1px solid #e8e8ed;vertical-align:top">${fmtN(lt)}</td>
    </tr>`
  }).join('')

  const clientInfo = client ? `
    <div style="font-size:11pt;font-weight:800;color:#1d1d1f;margin-bottom:3px">${client.company || quote.client}</div>
    ${client.rfc     ? `<div style="font-size:8.5pt;color:#3d3d3f"><b>RFC:</b> ${client.rfc}</div>` : ''}
    ${client.contact ? `<div style="font-size:8.5pt;color:#3d3d3f"><b>Contacto:</b> ${client.contact}</div>` : ''}
    ${client.email   ? `<div style="font-size:8.5pt;color:#3d3d3f"><b>Correo:</b> ${client.email}</div>` : ''}
    ${client.phone   ? `<div style="font-size:8.5pt;color:#3d3d3f"><b>Tel:</b> ${client.phone}</div>` : ''}
    ${client.address ? `<div style="font-size:8.5pt;color:#3d3d3f"><b>Dirección:</b> ${client.address}</div>` : ''}
  ` : `<div style="font-size:11pt;font-weight:800">${quote.client}</div>`

  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>${quote.folio} — Maraga Solar</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1d1d1f; font-size: 10pt; line-height: 1.5; }
  @page { size: A4; margin: 12mm 14mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
  .page { padding: 0; max-width: 182mm; margin: 0 auto; }
</style>
</head>
<body>
<div class="page">

  <!-- DOWNLOAD BUTTON (hidden on print) -->
  <div class="no-print" style="background:#111;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
    <span style="color:#F7B500;font-weight:700;font-size:13px">📄 ${quote.folio} — ${quote.client}</span>
    <button onclick="window.print()" style="background:#F7B500;color:#000;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer">⬇ Descargar PDF</button>
  </div>

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8mm 0 6mm;border-bottom:2.5px solid #F7B500;margin-bottom:5mm">
    <div style="display:flex;align-items:center;gap:12px">
      <img src="data:image/png;base64,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miu76dnI7VDJIiLtSmCIiAIiIAiIgCg8lKIDFXmzUVzYBURN6xvkyAYc31FUa96WraDMsINTD2ljfHH3o5+xbNwocFz124do7gmXNw7uhvUlwmptGrp2NKYGUwtqXPT9tuO86ana2U/pjPFd71WLloiaJhdRVQkPwZsD4wPkXzyv4LraZOaL30+W/odHTXyKXSTQqWEwshV2S7UeTUUEoaOTovHB9y6HD5weYXLzUVRCuJGKnmhbR1McqZY7JxREWrhT3RchERAERCsmsc7ZCFciBF9aelqp5N2Ommd3kMJwspSaZvVSA4UgiaeRkfj8mVuwW2rnx7ONV+hrSVcMfichhkVxpNCuJa6srS0drYhx95Wdt+lbNSjIpjM/tdM7ez7DwXQUnBVwm1kwxPn/ANFbNfYGLhuprijo6uteW0lPJP6WDI9/JZ236Or5hmpkbTd4A3yPyD41sOGJsbQ1jWtA5ADC57vYutouB6SLWdVc77FRNfJlTDEwhgbZpa00RbIYPCJRyfN4x+ZZ1kYaAGgAdgAwpDVyXXUtDT0zOWNiIVEkz5Fy9ck9ik+hFC3DyJRAiEhERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBMIiAIiIAiIgCIiAIiIAiIgCIiAJhEQHEgHmvhPS08wAlhjeB2OYCuyi85ImyJhyEoqoYZ+nLK/wAq3w+wYXVfo6xO/wAFcP3R3zqxYUrRfaKJ+8TfQ921U7dnr6la+k+zH9Lm/HO+dPpNsXbTSH1yuVkRYJY7en+i30J/GVH+9fUwbNLWJv8Ai+M+skrvU9ptlO7fhoKeN3e2MBd4Jhe8dtpIv040T6Hm6eV3icq/UgAdwU8kyi20a1NkPFVCnCgKVkoQjCIU7VI3JwiIoJCIikBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBEUZQEot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oNxs5HjsIw1x7/QVS6umqaWTq6iF0Tx2OHA+orcoBC+c0EU7CyVge082kcCuMu/CFNVvWaJeVy79lLijvEtOiNVMoaY9yNBMjYw5rnO5NackrbX0DtJ/xfT/AIsL7QW2ipz9j00UQ+1YAqBnAUufekTHkb68Qp0Ya/selK6umElSx1PAOPjcHH7351Y7houw3KS2fRGkFXDbJOupaaUl0ImHKVzDwfI0Z3XOzgnPPirTjguG7yXbWexU1pZiJMqu6qUtVXTVLveXTsfQHgiDkiuzRUlERSSEREAREQBERAEREAREQBERAEREAREQBERAEPJFxkY2RhY4ZBQGI1LW08VBNBvb08kZbHE3i5xIOAAsBZLbLNW2ym3sxWtrjLK0cHSHB3AfR2+xW2KhpoJTJDBEx7uBcG+MfavsI2tHijCqJ7d+KmSSVdE6fXJ7MmVjOVDrVFFT1MkUk0TXuhcXMJHknGF1orHQx1NXN1LXmsx1zXDIOBj41lWjCnC3X0kL3Zc1FX/EPPnd0U+FNBFTQRwxN3WMaGtHcByX2IypQL2SNqNwiGKrkboQKVBWSNRARhFKLLBCqOxTjgoClCSCiIUBKIiAIiIAiIgCIiAIiIAiIgCIiAIiIBhERAEREATAREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARMogCLg+RjfKe0esrF1N9tMEm5NXQMd8HrASfYtaWrhiTL3on1Mmxvd4UyZdFXn6tsrMfZEjs90ZXwfrWztx4tS7PdGtJ18t7d5m+psJQ1K/AvoWhFVvp3tH6nV/il9G6xszvKllZ64zx9yxS/W9dpW+pK0NSnwL6FlRYaG/2iUncuEHDnmQBZSKZj2hzHNcDy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" alt="Maraga Solar" style="width:72px;height:72px;object-fit:contain">
      <div>
        <div style="font-weight:900;font-size:18pt;letter-spacing:-0.5px;color:#111;line-height:1">MARAGA</div>
        <div style="font-size:8pt;color:#86868b;letter-spacing:2px;text-transform:uppercase;margin-top:1px">Solar</div>
        <div style="font-size:8pt;color:#86868b;margin-top:5px;line-height:1.75">
          Av. Alfonso Reyes 2819, Del Prado, CP 64410<br>
          Monterrey, Nuevo León · México<br>
          81 2029 1819 · ventas@maraga.mx
        </div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:7pt;color:#86868b;text-transform:uppercase;letter-spacing:1.5px">Cotización</div>
      <div style="font-size:24pt;font-weight:900;color:#F7B500;letter-spacing:-1px;line-height:1.1">${quote.folio}</div>
      <div style="margin-top:6px">
        <div style="display:flex;justify-content:flex-end;gap:14px;font-size:8.5pt;margin-top:3px">
          <span style="color:#86868b">Fecha de emisión:</span>
          <span style="font-weight:700">${quote.date}</span>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:14px;font-size:8.5pt;margin-top:3px">
          <span style="color:#86868b">Fecha de vencimiento:</span>
          <span style="font-weight:700;color:#B8860B">${venc}</span>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:14px;font-size:8.5pt;margin-top:3px">
          <span style="color:#86868b">Vigencia:</span>
          <span style="font-weight:700">15 días naturales</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CLIENT + META -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-bottom:6mm">
    <div style="background:#F5F5F7;border-radius:8px;padding:4.5mm">
      <div style="font-size:7pt;font-weight:700;color:#86868b;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;display:flex;align-items:center;gap:5px">
        <span style="width:5px;height:5px;border-radius:50%;background:#F7B500;display:inline-block"></span>
        Datos del cliente
      </div>
      ${clientInfo}
    </div>
    <div style="background:#F5F5F7;border-radius:8px;padding:4.5mm">
      <div style="font-size:7pt;font-weight:700;color:#86868b;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;display:flex;align-items:center;gap:5px">
        <span style="width:5px;height:5px;border-radius:50%;background:#F7B500;display:inline-block"></span>
        Detalles de la cotización
      </div>
      ${[
        ['Número', quote.folio],
        ['Fecha de emisión', quote.date],
        ['Vencimiento', venc],
        ['Moneda', 'MXN (Peso Mexicano)'],
        ['Condiciones de pago', '50% anticipo · 50% contra entrega'],
        ['Tiempo de entrega', '3–5 días hábiles en MTY'],
      ].map(([l,v]) => `<div style="display:flex;gap:8px;font-size:8.5pt;margin-bottom:2.5px"><span style="color:#86868b;min-width:110px">${l}:</span><span style="font-weight:600;color:#1d1d1f">${v}</span></div>`).join('')}
    </div>
  </div>

  <!-- TABLE -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:5mm">
    <thead>
      <tr style="background:#111111">
        <th style="padding:3mm 3.5mm;text-align:left;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:13%">Código</th>
        <th style="padding:3mm 3.5mm;text-align:left;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:38%">Descripción</th>
        <th style="padding:3mm 3.5mm;text-align:center;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:8%">Cant.</th>
        <th style="padding:3mm 3.5mm;text-align:center;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:8%">Unid.</th>
        <th style="padding:3mm 3.5mm;text-align:right;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:15%">P. Unit.</th>
        <th style="padding:3mm 3.5mm;text-align:right;font-size:7.5pt;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;width:15%">Total</th>
      </tr>
    </thead>
    <tbody>${rowsHTML}</tbody>
  </table>

  <!-- TOTALS -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:5mm">
    <div style="width:70mm">
      <div style="display:flex;justify-content:space-between;padding:2.5mm 0;border-bottom:1px solid #e8e8ed;font-size:9pt">
        <span style="color:#86868b">Subtotal</span>
        <span style="font-weight:600">${fmtN(sub)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:2.5mm 0;border-bottom:1px solid #e8e8ed;font-size:9pt">
        <span style="color:#86868b">IVA (16%)</span>
        <span style="font-weight:600">${fmtN(iva)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:3mm 4mm;background:#111;border-radius:6px;margin-top:2.5mm">
        <span style="font-weight:700;color:#fff;font-size:10pt">TOTAL</span>
        <span style="font-weight:900;color:#F7B500;font-size:16pt;letter-spacing:-0.5px">${fmtN(total)}</span>
      </div>
    </div>
  </div>

  <!-- NOTES + GUARANTEES -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-bottom:5mm">
    <div style="background:#F5F5F7;border-radius:8px;padding:4mm">
      <div style="font-size:7pt;font-weight:700;color:#86868b;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px">📋 Notas y condiciones</div>
      <div style="font-size:8.5pt;color:#3d3d3f;line-height:1.65">
        ${quote.notes || 'Esta cotización tiene una vigencia de 15 días naturales a partir de la fecha de emisión.'}
      </div>
      <div style="margin-top:6px;font-size:8pt;color:#86868b;line-height:1.7">
        <b>Forma de pago:</b> Transferencia o depósito bancario.<br>
        <b>Entrega:</b> 3–5 días hábiles en Monterrey, NL.<br>
        <b>Flete:</b> Por cuenta del cliente fuera de MTY.
      </div>
    </div>
    <div style="background:#FFF8E1;border:1px solid #F7B50033;border-radius:8px;padding:4mm">
      <div style="font-size:7pt;font-weight:700;color:#B8860B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">🛡 Garantías</div>
      ${[
        'Todos los productos cuentan con garantía de fábrica del fabricante original.',
        'Estructura fotovoltaica RINENG: 10 años contra defectos de fabricación.',
        'Perfiles de aluminio CUPRUM: 10 años contra corrosión y deformación.',
        'Protecciones eléctricas Suntree: 2 años en condiciones normales de uso.',
        'La garantía no cubre instalación incorrecta ni sobretensiones externas.',
      ].map(g => `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:4px;font-size:8pt;color:#3d3d3f;line-height:1.5">
        <span style="width:4px;height:4px;border-radius:50%;background:#F7B500;margin-top:5px;flex-shrink:0;display:inline-block"></span>
        <span>${g}</span>
      </div>`).join('')}
    </div>
  </div>

  <!-- SIGNATURE -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:5mm">
    <div style="border:1.5px dashed #d2d2d7;border-radius:8px;padding:4mm 8mm;text-align:center;width:55mm">
      <div style="font-size:7pt;color:#86868b">Autorizado por</div>
      <div style="height:16mm"></div>
      <div style="border-top:1px solid #d2d2d7;padding-top:3px;font-size:7pt;color:#86868b">Firma y sello · Maraga Solar</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="border-top:1.5px solid #e8e8ed;padding-top:4mm;display:flex;justify-content:space-between;align-items:flex-start">
    <div style="font-size:7.5pt;color:#86868b;line-height:1.8">
      <div style="font-weight:800;color:#1d1d1f;font-size:8pt">MARAGA SOLAR</div>
      Av. Alfonso Reyes 2819, Del Prado, CP 64410<br>
      Monterrey, Nuevo León · México
    </div>
    <div style="text-align:right;font-size:7.5pt;color:#86868b;line-height:1.8">
      ventas@maraga.mx<br>
      81 2029 1819<br>
      <span style="color:#F7B500;font-weight:700">${quote.folio}</span> · ${quote.date}
    </div>
  </div>

</div>
</body></html>`)

  win.document.close()
  // Auto-trigger print dialog after content loads
  win.onload = () => {
    setTimeout(() => win.print(), 400)
  }
}

// ── DOWNLOAD BUTTON COMPONENT ─────────────────────────────────────
export function DownloadQuoteBtn({ quote, client, sm }) {
  const handleDownload = () => downloadQuotePDF(quote, client)
  return (
    <button
      onClick={handleDownload}
      style={{
        background: '#F7B500',
        color: '#000',
        border: 'none',
        borderRadius: sm ? 8 : 10,
        padding: sm ? '7px 14px' : '11px 22px',
        fontSize: sm ? 12 : 14,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#e6a800'}
      onMouseLeave={e => e.currentTarget.style.background = '#F7B500'}
    >
      ⬇ Descargar PDF
    </button>
  )
}
