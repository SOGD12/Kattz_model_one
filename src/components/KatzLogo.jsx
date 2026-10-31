import { useEffect, useRef } from 'react'
import Zdog from 'zdog'
import { ESCRITORIO, MOVIMIENTO_REDUCIDO } from '../hooks/useMedia'

const css = (nombre, respaldo) =>
  getComputedStyle(document.documentElement).getPropertyValue(nombre).trim() || respaldo

// Gato sentado de perfil construido con Zdog. Solo el logo usa Zdog (ver PROPUESTA-DISENO.md §8).
export default function KatzLogo({ size = 96, animar = true, dormido = false, color, etiqueta = 'Katz, gato sentado de perfil' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const cuerpoColor = color || css('--hueso', '#f2f0ee')
    const ojoColor = css('--rojo-vivo', '#d41f28')
    const fondo = css('--negro', '#0a0a0a')

    const illo = new Zdog.Illustration({
      element: canvas,
      zoom: size / 118,
      resize: false,
      rotate: { y: -0.3 },
    })
    const gato = new Zdog.Anchor({ addTo: illo, translate: { x: 14, y: 4 } })
    const base = { color: cuerpoColor, stroke: 1 }

    // Cuerpo: anca, torso y patas
    new Zdog.Shape({ addTo: gato, translate: { x: -12, y: 24 }, stroke: 46, color: cuerpoColor })
    new Zdog.Shape({ addTo: gato, path: [{ x: -4, y: 20 }, { x: 11, y: -4 }], stroke: 34, closed: false, color: cuerpoColor })
    new Zdog.Shape({ addTo: gato, path: [{ x: 15, y: 2 }, { x: 15, y: 34 }], stroke: 10, closed: false, color: cuerpoColor, translate: { z: 8 } })
    new Zdog.Shape({ addTo: gato, path: [{ x: 15, y: 2 }, { x: 15, y: 34 }], stroke: 10, closed: false, color: cuerpoColor, translate: { z: -8 } })

    // Cola enroscada (se mueve alrededor de su base)
    const cola = new Zdog.Anchor({ addTo: gato, translate: { x: -30, y: 38 } })
    new Zdog.Shape({
      addTo: cola,
      path: [{ x: 0, y: 0 }, { bezier: [{ x: -26, y: 8 }, { x: -36, y: -20 }, { x: -20, y: -30 }] }],
      stroke: 9, closed: false, color: cuerpoColor,
    })

    // Cabeza, orejas
    const cabeza = new Zdog.Anchor({ addTo: gato, translate: { x: 15, y: -24 } })
    new Zdog.Shape({ addTo: cabeza, stroke: 32, color: cuerpoColor })
    new Zdog.Shape({ addTo: cabeza, path: [{ x: -11, y: -10 }, { x: -9, y: -29 }, { x: 3, y: -14 }], fill: true, closed: true, ...base, translate: { z: 4 } })
    new Zdog.Shape({ addTo: cabeza, path: [{ x: 5, y: -14 }, { x: 15, y: -29 }, { x: 15, y: -8 }], fill: true, closed: true, ...base, translate: { z: 4 } })

    // Ojo rojo con pupila rasgada
    const ojo = new Zdog.Anchor({ addTo: cabeza, translate: { x: 8, y: -3, z: 14 } })
    new Zdog.Ellipse({ addTo: ojo, width: 8, height: 10, stroke: 1, fill: true, color: ojoColor })
    new Zdog.Shape({ addTo: ojo, path: [{ y: -4 }, { y: 4 }], stroke: 1.8, color: fondo, translate: { z: 1 } })

    // Hocico y nariz
    new Zdog.Shape({ addTo: cabeza, translate: { x: 16, y: 4, z: 3 }, stroke: 3, color: fondo })

    const cerrarOjo = (cerrado) => { ojo.scale = { x: 1, y: cerrado ? 0.08 : 1, z: 1 } }
    cerrarOjo(dormido)

    const reducido = window.matchMedia(MOVIMIENTO_REDUCIDO).matches
    const puntero = window.matchMedia(ESCRITORIO).matches
    const temporizadores = new Set()
    const esperar = (fn, ms) => { const id = setTimeout(() => { temporizadores.delete(id); fn() }, ms); temporizadores.add(id) }

    let raf = 0
    let vivo = true
    let visible = true
    let t = 0
    let objetivo = { x: 0, y: 0 }
    const render = () => illo.updateRenderGraph()
    render()

    const parpadear = () => { cerrarOjo(true); render(); esperar(() => { cerrarOjo(false); render() }, 140) }

    const alMover = (e) => {
      const r = canvas.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      objetivo = { x: Math.max(-0.25, Math.min(0.25, dy * 0.6)), y: Math.max(-0.35, Math.min(0.35, dx * 0.9)) - 0.3 }
    }

    let observador
    let siguienteParpadeo

    if (animar && !reducido && !dormido) {
      if (puntero) {
        window.addEventListener('pointermove', alMover, { passive: true })
        observador = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
        observador.observe(canvas)
        const programar = () => { siguienteParpadeo = setTimeout(() => { if (visible) parpadear(); programar() }, 3000 + Math.random() * 3500) }
        programar()
        const tick = () => {
          if (!vivo) return
          if (visible) {
            t += 0.03
            cola.rotate.z = Math.sin(t) * 0.1
            illo.rotate.x += (objetivo.x - illo.rotate.x) * 0.08
            illo.rotate.y += (objetivo.y - illo.rotate.y) * 0.08
            render()
          }
          raf = requestAnimationFrame(tick)
        }
        esperar(parpadear, 700)
        tick()
      } else {
        esperar(parpadear, 900) // móvil: un único parpadeo
      }
    }

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      clearTimeout(siguienteParpadeo)
      temporizadores.forEach(clearTimeout)
      window.removeEventListener('pointermove', alMover)
      observador?.disconnect()
    }
  }, [size, animar, dormido, color])

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta || undefined}
      aria-hidden={etiqueta ? undefined : 'true'}
      style={{ width: size, height: size, display: 'block' }}
    />
  )
}
