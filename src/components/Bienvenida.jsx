import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { hrefTienda } from '../lib/router'
import { IMG_HOME, urlImg, tamImg } from '../lib/imagenes'
import { getLenis } from '../lib/lenis'

// Ventana emergente de bienvenida (estilo Shopify): aparece al cargar la página y cada vez que se vuelve al inicio.
// Cierra con la X, Esc, clic fuera o cualquier botón. La imagen (src/data/imagenes.json → home.popup)
// trae el texto dentro; si todavía no se ha puesto, el texto se dibuja en HTML sobre la foto.
const { imagen, textoEnImagen } = IMG_HOME.popup
const TAM = tamImg(imagen) || [2000, 1500]

export default function Bienvenida({ ruta }) {
  const [abierto, setAbierto] = useState(false)
  const panel = useRef(null)
  const previo = useRef(null)

  // Sale cada vez que se entra al inicio (carga de la página o vuelta desde otra página); fuera del inicio se cierra
  const enInicio = ruta.nombre === 'inicio'
  useEffect(() => {
    if (!enInicio) { setAbierto(false); return undefined }
    const t = setTimeout(() => { previo.current = document.activeElement; setAbierto(true) }, 900)
    return () => clearTimeout(t)
  }, [enInicio])

  const cerrar = () => setAbierto(false)

  useEffect(() => {
    if (!abierto) return undefined
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const fondo = [...document.querySelectorAll('header, main, footer')]
    fondo.forEach((el) => el.setAttribute('inert', ''))
    const t = setTimeout(() => panel.current?.querySelector('[data-foco]')?.focus(), 60)
    const alTecla = (e) => {
      if (e.key === 'Escape') { setAbierto(false); return }
      if (e.key !== 'Tab') return
      const foco = [...panel.current.querySelectorAll('a, button')]
      const primero = foco[0]; const ultimo = foco[foco.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', alTecla)
    return () => {
      clearTimeout(t)
      fondo.forEach((el) => el.removeAttribute('inert'))
      document.removeEventListener('keydown', alTecla)
      document.documentElement.style.overflow = ''
      getLenis()?.start()
      previo.current?.focus?.({ preventScroll: true })
    }
  }, [abierto])

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div className="popup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar() }}>
          <motion.div ref={panel} className="popup__caja" role="dialog" aria-modal="true" aria-labelledby="popup-t"
            initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <button className="popup__cerrar" onClick={cerrar} aria-label="Cerrar ventana">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <div className="popup__foto">
              <img src={urlImg(imagen)} alt="" width={TAM[0]} height={TAM[1]} decoding="async" />
              {textoEnImagen ? (
                <h2 id="popup-t" className="solo-lectores">Nueva colección Desordenado Chaos</h2>
              ) : (
                <div className="popup__texto">
                  <p className="popup__marca" aria-hidden="true">KATZ</p>
                  <h2 id="popup-t" className="popup__titulo">Nueva colección<br />Desordenado Chaos</h2>
                  <p className="popup__desc">Explora la nueva estética oversize de la temporada: siluetas nuevas, camisas oversize, gráficos y calzado robusto.</p>
                </div>
              )}
            </div>
            <div className="popup__botones">
              <a className="boton popup__principal" data-foco href={hrefTienda({ nuevo: 1 })} onClick={cerrar}>Ver la nueva colección</a>
              <a className="boton boton--contorno" href={hrefTienda()} onClick={cerrar}>Ver toda la ropa</a>
              <button className="enlace popup__seguir" onClick={cerrar}>Seguir mirando</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
