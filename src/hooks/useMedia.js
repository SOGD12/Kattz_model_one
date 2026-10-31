import { useEffect, useState } from 'react'

export function useMedia(consulta) {
  const [coincide, setCoincide] = useState(() => window.matchMedia(consulta).matches)
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const alCambiar = () => setCoincide(mq.matches)
    alCambiar()
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [consulta])
  return coincide
}

export const ESCRITORIO = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
export const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
