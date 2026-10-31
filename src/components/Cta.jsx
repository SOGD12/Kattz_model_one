import { useRef } from 'react'
import { useGSAP, gsap } from '../lib/gsap'
import { hrefTienda } from '../lib/router'

export default function Cta() {
  const raiz = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const movil = window.innerWidth < 768
      gsap.fromTo('.cta-line', { y: movil ? 40 : 80, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: movil ? 0.5 : 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: raiz.current, start: 'top 75%', toggleActions: 'play none none none' },
      })
    })
    return () => mm.revert()
  }, { scope: raiz })

  return (
    <section className="cta" ref={raiz}>
      <div className="cta-content">
        <h2 className="cta-heading">
          <span className="cta-line cta-line--fg">VISTE</span>
          <span className="cta-line cta-line--muted">ANCHO.</span>
          <span className="cta-line cta-line--accent">VISTE</span>
          <span className="cta-line cta-line--fg">KATZ →</span>
        </h2>
        <p className="cta-sub">Compra simulada, sin cobro.</p>
        <div className="cta-buttons">
          <a href={hrefTienda()} className="cta-btn cta-btn--primary">Comprar ahora</a>
          <a href={hrefTienda({ nuevo: 1 })} className="cta-btn cta-btn--secondary">Ver novedades</a>
        </div>
      </div>
    </section>
  )
}
