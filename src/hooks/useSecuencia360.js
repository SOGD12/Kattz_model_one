import { useCallback, useEffect, useRef } from 'react'
import { IMG_HOME, urlImg } from '../lib/imagenes'

// Fotogramas clave del giro: 8 ángulos reales de la puffer (cada 45°) y vuelta al frente a 360°
export const CLAVES = IMG_HOME.giro.map((clave, i) => ({ grados: i * 45, src: urlImg(clave), espejo: false }))

const COPIAS = 7          // copias desplazadas para el desenfoque horizontal
const DESENFOQUE = 0.014  // fracción del ancho en el pico de la transición

// Dibuja la secuencia en un <canvas>: mezcla dos fotogramas vecinos con desenfoque horizontal.
// Devuelve { ref, dibujar(progreso 0..1) }.
export function useSecuencia360() {
  const ref = useRef(null)
  const imagenes = useRef([])
  const progreso = useRef(0)

  const dibujar = useCallback((p = progreso.current) => {
    progreso.current = p
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    const cargadas = imagenes.current
    if (!ctx || !cargadas.length) return

    const grados = Math.min(Math.max(p, 0), 1) * 360
    let i = CLAVES.findIndex((c, k) => grados >= c.grados && grados <= CLAVES[k + 1]?.grados)
    if (i < 0) i = CLAVES.length - 2
    const a = CLAVES[i]
    const b = CLAVES[i + 1]
    const lineal = (grados - a.grados) / (b.grados - a.grados)
    // Se retiene cada vista y la mezcla se concentra en el centro del tramo: menos doble imagen
    const u = Math.min(Math.max((lineal - 0.2) / 0.6, 0), 1)
    const t = u * u * (3 - 2 * u)
    const pico = Math.sin(Math.PI * u)

    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, W, H)

    const lado = Math.min(W, H) // los fotogramas son cuadrados
    const x0 = (W - lado) / 2
    const y0 = (H - lado) / 2
    const dispersion = pico * DESENFOQUE * lado

    // Promedio ponderado: cada copia entra con alpha = peso / suma de pesos acumulada
    const items = []
    for (let k = 0; k < COPIAS; k++) {
      const off = (k - (COPIAS - 1) / 2) / ((COPIAS - 1) / 2) * dispersion
      items.push({ f: a, peso: (1 - t) / COPIAS, dx: off - t * 0.01 * lado })
      items.push({ f: b, peso: t / COPIAS, dx: off + (1 - t) * 0.01 * lado })
    }
    let suma = 0
    for (const it of items) {
      if (it.peso <= 0.0001) continue
      const img = cargadas[CLAVES.indexOf(it.f)]
      if (!img?.complete || !img.naturalWidth) continue
      suma += it.peso
      ctx.globalAlpha = it.peso / suma
      ctx.save()
      if (it.f.espejo) {
        ctx.translate(x0 + lado + it.dx, y0)
        ctx.scale(-1, 1)
        ctx.drawImage(img, 0, 0, lado, lado)
      } else {
        ctx.drawImage(img, x0 + it.dx, y0, lado, lado)
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }, [])

  // Precarga: el primer fotograma primero, luego el resto
  useEffect(() => {
    const unicas = new Map()
    imagenes.current = CLAVES.map((c) => {
      if (!unicas.has(c.src)) {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => dibujar()
        img.src = c.src
        unicas.set(c.src, img)
      }
      return unicas.get(c.src)
    })
  }, [dibujar])

  // Tamaño nítido (dpr ≤ 2) y redibujo al cambiar el contenedor
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
      dibujar()
    }
    ajustar()
    const ro = new ResizeObserver(ajustar)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [dibujar])

  return { ref, dibujar, progreso }
}
