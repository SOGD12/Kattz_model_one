import { useRef } from 'react'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Viewer360 from '../components/Viewer360'
import Statement from '../components/Statement'
import Filosofia from '../components/Filosofia'
import GaleriaInversa from '../components/GaleriaInversa'
import Cta from '../components/Cta'
import Mosaico from '../components/Mosaico'
import Carrusel from '../components/Carrusel'
import { useGSAP, gsap, SplitText } from '../lib/gsap'

export default function Home() {
  const raiz = useRef(null)

  // Titulares que entran palabra por palabra al llegar a pantalla (GSAP SplitText)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const movil = window.innerWidth < 768
      gsap.utils.toArray('.reveal-title').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines,words' })
        gsap.fromTo(split.words, { y: movil ? 40 : 80, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.04, duration: movil ? 0.6 : 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: movil ? 'top 88%' : 'top 82%', toggleActions: 'play none none none' },
        })
      })
    })
    return () => mm.revert()
  }, { scope: raiz })

  return (
    <div ref={raiz}>
      <Hero />
      <Marquee />
      <Mosaico />
      <Carrusel />
      <Viewer360 />
      <Statement />
      <Filosofia />
      <GaleriaInversa />
      <Cta />
    </div>
  )
}
