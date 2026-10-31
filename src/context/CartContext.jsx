import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { porId } from '../data/productos'
import { leer, guardar } from '../lib/storage'

const CLAVE = 'katz-cart-v1'
const CartContext = createContext(null)

// Estado: líneas { id, talla, cantidad }. Solo se guardan ids; el resto se hidrata desde `productos`.
function inicial() {
  const guardado = leer(CLAVE, [])
  if (!Array.isArray(guardado)) return { lineas: [], abierto: false, recibo: null }
  const lineas = guardado.filter((l) => l && porId(l.id) && Number.isInteger(l.cantidad) && l.cantidad > 0 && typeof l.talla === 'string')
  return { lineas, abierto: false, recibo: null }
}

function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'anadir': {
      const { id, talla } = accion
      const existe = estado.lineas.find((l) => l.id === id && l.talla === talla)
      const lineas = existe
        ? estado.lineas.map((l) => (l === existe ? { ...l, cantidad: Math.min(l.cantidad + 1, 9) } : l))
        : [...estado.lineas, { id, talla, cantidad: 1 }]
      return { ...estado, lineas, abierto: true, recibo: null }
    }
    case 'cantidad': {
      const lineas = estado.lineas
        .map((l) => (l.id === accion.id && l.talla === accion.talla ? { ...l, cantidad: Math.min(l.cantidad + accion.delta, 9) } : l))
        .filter((l) => l.cantidad > 0)
      return { ...estado, lineas }
    }
    case 'quitar':
      return { ...estado, lineas: estado.lineas.filter((l) => !(l.id === accion.id && l.talla === accion.talla)) }
    case 'vaciar':
      return { ...estado, lineas: [] }
    case 'abrir':
      return { ...estado, abierto: true }
    case 'cerrar':
      return { ...estado, abierto: false, recibo: null }
    case 'comprar': {
      const detalle = estado.lineas.map((l) => ({ ...l, producto: porId(l.id) }))
      const total = detalle.reduce((s, l) => s + l.producto.precio * l.cantidad, 0)
      const pedido = `KZ-${Math.floor(1000 + Math.random() * 9000)}`
      return { lineas: [], abierto: true, recibo: { pedido, detalle, total } }
    }
    default:
      return estado
  }
}

export function CartProvider({ children }) {
  const [estado, despachar] = useReducer(reductor, undefined, inicial)

  useEffect(() => { guardar(CLAVE, estado.lineas) }, [estado.lineas])

  const valor = useMemo(() => {
    const detalle = estado.lineas.map((l) => ({ ...l, producto: porId(l.id) }))
    const cantidad = detalle.reduce((s, l) => s + l.cantidad, 0)
    const total = detalle.reduce((s, l) => s + l.producto.precio * l.cantidad, 0)
    return { ...estado, detalle, cantidad, total, despachar }
  }, [estado])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
