import { useRef } from 'react'
import { hrefTienda } from '../lib/router'
import { IMG_HOME, urlImg } from '../lib/imagenes'
import { useGSAP, gsap, ScrollTrigger } from '../lib/gsap'

// Tres columnas con las fotos de modelos (clave `home.galeria` de src/data/imagenes.json).
// Con la galería fijada, las laterales bajan y la central sube, y las tres recorren todas sus fotos.
const COLS = IMG_HOME.galeria

function Item({ src }) {
  return (
    <a className="gallery-item" href={hrefTienda()} aria-label="Ver la tienda">
      <img src={urlImg(src)} alt="Modelo con ropa de Katz" loading="lazy" width="576" height="720" />
    </a>
  )
}

export default function GaleriaInversa() {
  const raiz = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const pista = raiz.current.querySelector('.gallery-track')
      const marco = raiz.current.querySelector('.gallery-reverse-wrap')
      const cols = [...raiz.current.querySelectorAll('.gallery-col')]
      // Recorrido de cada columna = lo que sobra de su alto frente al marco visible
      const recorrido = (c) => Math.max(0, c.scrollHeight - marco.clientHeight)
      const maximo = () => Math.max(1, ...cols.map(recorrido))
      // La pista mide el marco más el recorrido (pausa final); el marco se queda fijo (sticky) dentro de ella
      const ajustar = () => { pista.style.height = `${marco.clientHeight + maximo() * 1.8}px` }
      ajustar()
      ScrollTrigger.addEventListener('refreshInit', ajustar)

      // Sin pin: la animación empieza en cuanto la galería asoma por abajo (80 % de la pantalla) y sigue de forma
      // continua mientras el marco queda fijo, así no hay tramo muerto ni arranque brusco al fijarse.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pista, start: 'top 80%', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      cols.forEach((c, i) => {
        const sube = i === 1 // la central sube; las laterales bajan
        tl.fromTo(c,
          { y: () => (sube ? 0 : -recorrido(c)) },
          { y: () => (sube ? -recorrido(c) : 0), ease: 'sine.inOut', duration: 1 }, 0)
      })
      tl.to({}, { duration: 0.06 }, 1)
      return () => { ScrollTrigger.removeEventListener('refreshInit', ajustar); pista.style.height = '' }
    })
    return () => mm.revert()
  }, { scope: raiz })

  return (
    <section className="gallery-section" ref={raiz} aria-labelledby="gal-t">
      <div className="gallery-intro">
        <span className="section-label">— EN LA CALLE</span>
        <h2 id="gal-t" className="section-title reveal-title">MIRA CÓMO LUCE<br />NUESTRA ROPA</h2>
      </div>
      <div className="gallery-track">
        <div className="gallery-reverse-wrap">
          <div className="gallery-reverse-inner">
            {COLS.map((col, c) => (
              <div key={c} className="gallery-col">
                {col.map((it, k) => <Item key={`${c}-${k}`} src={it} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
