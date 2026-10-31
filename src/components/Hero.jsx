import { useRef } from 'react'
import KatzLogo from './KatzLogo'
import { useGSAP, gsap, SplitText } from '../lib/gsap'
import { useMedia } from '../hooks/useMedia'
import { hrefTienda } from '../lib/router'
import { IMG_HOME, urlImg, tamImg } from '../lib/imagenes'

const BANNER = tamImg(IMG_HOME.banner) || [2000, 857]

// Banner a todo el ancho: foto editorial debajo de la cabecera, titular centrado entre las dos
// personas y botón blanco. El titular entra letra por letra (GSAP SplitText) y la foto se
// desplaza suavemente al bajar.
export default function Hero() {
  const raiz = useRef(null)
  const gato = useMedia('(min-width: 768px)') ? 96 : 64

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const movil = window.innerWidth < 768
      const tl = gsap.timeline({ delay: 0.2 })
      gsap.utils.toArray('.banner__linea').forEach((el) => {
        const split = SplitText.create(el, { type: 'chars' })
        tl.from(split.chars, {
          y: movil ? 50 : 90, opacity: 0, rotateX: movil ? 0 : -45,
          stagger: 0.025, duration: movil ? 0.7 : 1, ease: 'power4.out', transformOrigin: 'top center',
        }, '-=0.35')
      })
      tl.from('.banner__sub', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('.banner__boton', { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.banner__gato', { opacity: 0, duration: 0.6 }, '-=0.4')
      gsap.to('.banner__foto', {
        yPercent: movil ? -3 : -4, ease: 'none',
        scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
    })
    return () => mm.revert()
  }, { scope: raiz })

  return (
    <section className="banner" ref={raiz} aria-label="Katz">
      <div className="banner__marco">
        <img
          className="banner__foto" src={urlImg(IMG_HOME.banner)} width={BANNER[0]} height={BANNER[1]} fetchPriority="high" decoding="async"
          alt="Dos personas bajo un puente: él con puffer negra brillante y jeans anchos, ella con abrigo largo café, hoodie morado y pantalón cargo"
        />

        <div className="banner__centro">
          <h1 className="banner__titulo">
            <span className="banner__fila"><span className="banner__linea">WEIT.</span></span>
            <span className="banner__fila"><span className="banner__linea">DUNKEL.</span></span>
            <span className="banner__fila"><span className="banner__linea">KATZ.</span></span>
          </h1>
          <p className="banner__sub">Ropa oversize y alternativa.</p>
          <a className="banner__boton" href={hrefTienda()}>Comprar ahora</a>
        </div>

        <div className="banner__gato"><KatzLogo size={gato} /></div>
      </div>
    </section>
  )
}
