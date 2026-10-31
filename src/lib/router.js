import { useEffect, useState } from 'react'

// Rutas por hash (sin servidor): #/ · #/tienda?cat=abrigos&color=rojo&nuevo=1 · #/producto/puffer
function leer() {
  const crudo = window.location.hash.replace(/^#\/?/, '')
  const [ruta, qs = ''] = crudo.split('?')
  const partes = ruta.split('/').filter(Boolean)
  const q = Object.fromEntries(new URLSearchParams(qs))
  if (partes[0] === 'producto' && partes[1]) return { nombre: 'producto', id: partes[1], q }
  if (partes[0] === 'tienda') return { nombre: 'tienda', q }
  return { nombre: 'inicio', q }
}

export function useRuta() {
  const [ruta, setRuta] = useState(leer)
  useEffect(() => {
    const alCambiar = () => setRuta(leer())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return ruta
}

export const hrefTienda = (q = {}) => {
  const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v && v !== 'todo')).toString()
  return `#/tienda${qs ? `?${qs}` : ''}`
}
export const hrefProducto = (id) => `#/producto/${id}`
