import { useEffect, useState } from 'react'
import { leer, guardar } from '../lib/storage'

const CLAVE = 'katz-fav-v1'

// Favoritos (corazón) guardados en localStorage con respaldo en memoria
export function useFavoritos() {
  const [ids, setIds] = useState(() => {
    const v = leer(CLAVE, [])
    return Array.isArray(v) ? v : []
  })
  useEffect(() => { guardar(CLAVE, ids) }, [ids])
  const alternar = (id) => setIds((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  return { ids, alternar, es: (id) => ids.includes(id) }
}
