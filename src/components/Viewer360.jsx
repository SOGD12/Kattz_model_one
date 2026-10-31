import { useEffect, useRef, useState } from 'react'
import { useGSAP, gsap } from '../lib/gsap'
import { useSecuencia360 } from '../hooks/useSecuencia360'
import { useMedia, MOVIMIENTO_REDUCIDO } from '../hooks/useMedia'
import { useCart } from '../context/CartContext'
import { porId, formatoCOP } from '../data/productos'
import Fon from './Fon'

const puffer = porId('puffer')
const VISTAS = [
  { nombre: 'Frente', p: 0 },
  { nombre: '3/4', p: 45 / 360 },
  { nombre: 'Lado', p: 90 / 360 },
  { nombre: 'Espalda', p: 180 / 360 },
]


// Anotaciones: aparecen en su tramo del giro (progreso 0..1). Datos provisionales.
const ANOTACIONES = [
  { id: 'capucha', texto: 'Capucha desmontable', desde: 0.04, hasta: 0.2, x: 50, y: 11, lado: 'der' },
  { id: 'relleno', texto: 'Relleno acolchado', desde: 0.27, hasta: 0.43, x: 47, y: 56, lado: 'izq' },
  { id: 'costuras', texto: 'Costuras en cada tubo', desde: 0.5, hasta: 0.68, x: 52, y: 62, lado: 'der' },
]

export default function Viewer360() {
  const raiz = useRef(null)
  const escena = useRef(null)
  const { ref: lienzo, dibujar, progreso } = useSecuencia360()
  const reducido = useMedia(MOVIMIENTO_REDUCIDO)
  const [talla, setTalla] = useState(null)
  const { despachar } = useCart()

  // Escritorio: sección fijada, el giro avanza con el scroll (GSAP ScrollTrigger)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const obj = { p: 0 }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: escena.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.5,
          onUpdate: (self) => dibujar(self.progress),
        },
      })
      gsap.set('.anot', { opacity: 0 })
      tl.to(obj, { p: 1, duration: 1, ease: 'none' }, 0)
      ANOTACIONES.forEach((a) => {
        const el = `.anot--${a.id}`
        const ancho = a.hasta - a.desde
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: ancho * 0.1, ease: 'none' }, a.desde)
          .fromTo(`${el} .anot__linea`, { scaleX: 0 }, { scaleX: 1, duration: ancho * 0.3, ease: 'none' }, a.desde)
         .fromTo(`${el} .anot__texto`, { opacity: 0 }, { opacity: 1, duration: ancho * 0.25, ease: 'none' }, a.desde + ancho * 0.2)
         .to(el, { opacity: 0, duration: ancho * 0.2, ease: 'none' }, a.hasta - ancho * 0.2)
      })
      return () => dibujar(0)
    })
    return () => mm.revert()
  }, { scope: raiz, dependencies: [dibujar] })

  // Móvil y movimiento reducido: sin fijado. Se gira arrastrando o con los botones de vista
  useEffect(() => {
    const canvas = lienzo.current
    if (!canvas) return undefined
    let arrastrando = false
    let x0 = 0
    let p0 = 0
    const abajo = (e) => { arrastrando = true; x0 = e.clientX; p0 = progreso.current; canvas.setPointerCapture(e.pointerId) }
    const mover = (e) => {
      if (!arrastrando) return
      const p = ((p0 - (e.clientX - x0) / canvas.clientWidth) % 1 + 1) % 1
      dibujar(p)
    }
    const arriba = () => { arrastrando = false }
    const esDeslizable = !window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
    if (esDeslizable) {
      canvas.addEventListener('pointerdown', abajo)
      canvas.addEventListener('pointermove', mover)
      canvas.addEventListener('pointerup', arriba)
      canvas.addEventListener('pointercancel', arriba)
    }
    return () => {
      canvas.removeEventListener('pointerdown', abajo)
      canvas.removeEventListener('pointermove', mover)
      canvas.removeEventListener('pointerup', arriba)
      canvas.removeEventListener('pointercancel', arriba)
    }
  }, [dibujar, lienzo, progreso])

  const anadir = (t) => {
    despachar({ tipo: 'anadir', id: puffer.id, talla: t })
    setTalla(null)
  }

  return (
    <section id="giro" className="giro tinte tinte--rojo" ref={raiz} aria-labelledby="giro-titulo">
      <div className="giro__escena" ref={escena}>
        <div className="giro__fondo" aria-hidden="true" />
        <div className="giro__lienzo">
          <canvas
            ref={lienzo}
            role="img"
            aria-label="Puffer Schatten girando 360 grados: frente, tres cuartos, lado y espalda"
          />
          {ANOTACIONES.map((a) => (
            <div
              key={a.id}
              className={`anot anot--${a.id} anot--${a.lado}`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              aria-hidden="true"
            >
              <span className="anot__punto" />
              <span className="anot__linea" />
              <span className="anot__texto etiqueta">{a.texto}</span>
            </div>
          ))}
        </div>

        <div className="contenedor giro__ficha">
          <p className="tarjeta__unikat">
            <span className="unikat">Unikat</span>
            <span>sombra</span>
          </p>
          <h2 id="giro-titulo">Schatten <Fon texto="SHA-ten" /></h2>
          <p className="cuerpo-suave giro__desc">
            Puffer con capucha desmontable. {puffer.material}. Calce ancho.
          </p>
          <p className="giro__precio">{formatoCOP.format(puffer.precio)}</p>
          {talla === null ? (
            <button className="boton" onClick={() => setTalla('elegir')}>Añadir</button>
          ) : (
            <div className="tallas" role="group" aria-label="Talla de la puffer">
              {puffer.tallas.map((t) => (
                <button key={t} className="talla" onClick={() => anadir(t)}>{t}</button>
              ))}
            </div>
          )}
        </div>

        <div className="giro__control">
          <p className="etiqueta giro__pista giro__pista--desk">Sigue bajando para girarla</p>
          <p className="etiqueta giro__pista giro__pista--mov">Desliza para girarla</p>
          <div className="giro__vistas" role="group" aria-label="Ver la puffer desde">
            {VISTAS.map((v) => (
              <button key={v.nombre} className="giro__vista" onClick={() => dibujar(v.p)}>{v.nombre}</button>
            ))}
          </div>
        </div>
        {reducido && <span className="sr">Vista estática; usa los botones para cambiar el ángulo.</span>}
      </div>
    </section>
  )
}
