import { useEffect, useRef } from 'react'
import { guiaDe } from '../data/tallas'

// Guía de tallas de una prenda: tabla de medidas (cm) por talla, la talla elegida resaltada y cómo medir.
export default function GuiaTallas({ producto, talla, alCerrar }) {
  const g = guiaDe(producto)
  const caja = useRef(null)

  useEffect(() => {
    const previo = document.activeElement
    caja.current?.querySelector('button')?.focus()
    const alTecla = (e) => {
      if (e.key === 'Escape') { alCerrar(); return }
      if (e.key !== 'Tab') return
      const foco = [...caja.current.querySelectorAll('button')]
      if (!foco.length) return
      const primero = foco[0]; const ultimo = foco[foco.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', alTecla)
    return () => { document.removeEventListener('keydown', alTecla); previo?.focus?.({ preventScroll: true }) }
  }, [alCerrar])

  return (
    <div className="guia" role="dialog" aria-modal="true" aria-labelledby="guia-t" onClick={alCerrar}>
      <div className="guia__caja" ref={caja} data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <h2 id="guia-t">Guía de tallas</h2>
        <p className="etiqueta guia__tipo">{g.titulo}</p>
        <p className="guia__nota">{g.nota}</p>
        <div className="guia__tabla" tabIndex={0} role="region" aria-label={`Medidas en centímetros, ${g.titulo}`}>
          <table>
            <caption className="solo-lectores">Medidas en centímetros por talla</caption>
            <thead>
              <tr>
                <th scope="col">Medida (cm)</th>
                {g.tallas.map((t) => <th key={t} scope="col" className={t === talla ? 'guia__sel' : undefined}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {g.filas.map((f) => (
                <tr key={f.medida}>
                  <th scope="row">{f.medida}</th>
                  {g.tallas.map((t) => <td key={t} className={t === talla ? 'guia__sel' : undefined}>{f.valores[t] ?? '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {g.consejos.length > 0 && (
          <div className="guia__medir">
            <p className="etiqueta">Cómo medir</p>
            <ul>{g.consejos.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        )}
        <p className="etiqueta guia__pie">Medidas con la prenda en plano, ±1 cm. Tienda de prueba: valores orientativos.</p>
        <button className="boton boton--contorno" onClick={alCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
