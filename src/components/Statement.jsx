import { useRef } from 'react'
import { useGSAP, gsap } from '../lib/gsap'

export default function Statement() {
  const raiz = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const movil = window.innerWidth < 768
      gsap.fromTo('.statement-line',
        { y: movil ? 40 : 0, x: movil ? 0 : (i) => (i % 2 === 0 ? -100 : 100), opacity: 0 },
        {
          y: 0, x: 0, opacity: 1, stagger: 0.1,
          scrollTrigger: { trigger: raiz.current, start: 'top 80%', end: 'bottom 30%', scrub: 1 },
        })
    })
    return () => mm.revert()
  }, { scope: raiz })

  return (
    <section className="statement" ref={raiz}>
      <span className="statement-corner statement-corner--tl" aria-hidden="true">×</span>
      <span className="statement-corner statement-corner--tr" aria-hidden="true">×</span>
      <span className="statement-corner statement-corner--bl" aria-hidden="true">×</span>
      <span className="statement-corner statement-corner--br" aria-hidden="true">×</span>

      <h2 className="statement-heading">
        <span className="statement-line">LA ROPA</span>
        <span className="statement-line">ANCHA</span>
        <span className="statement-line">NO PIDE</span>
        <span className="statement-line">PERMISO</span>
      </h2>

      <p className="statement-sub">
        Katz hace piezas de volumen, tela gruesa y corte suelto. Para quien prefiere
        que lo miren menos y lo vean mejor.
      </p>
    </section>
  )
}
