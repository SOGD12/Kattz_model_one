import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { formatoCOP } from '../data/productos'
import { useMedia } from '../hooks/useMedia'
import { getLenis } from '../lib/lenis'
import { urlImg } from '../lib/imagenes'
import Fon from './Fon'
import { hrefTienda } from '../lib/router'
import { Placa } from './ProductCard'

function Miniatura({ producto }) {
  return producto.imgs[0] ? (
    <img src={urlImg(producto.imgs[0])} alt="" width="72" height="90" />
  ) : (
    <Placa producto={producto} />
  )
}

function Lineas() {
  const { detalle, total, despachar } = useCart()
  if (!detalle.length) {
    return (
      <div className="carrito__vacio">
        <p className="lead">Nada todavía.</p>
        <p className="cuerpo-suave">Elige una prenda y una talla.</p>
        <button className="boton boton--contorno" onClick={() => { despachar({ tipo: 'cerrar' }); window.location.hash = hrefTienda() }}>Ver la tienda</button>
      </div>
    )
  }
  return (
    <>
      <ul className="carrito__lista">
        {detalle.map((l) => (
          <motion.li layout key={`${l.id}-${l.talla}`} className="linea" exit={{ opacity: 0 }}>
            <div className="linea__img"><Miniatura producto={l.producto} /></div>
            <div className="linea__datos">
              <p className="linea__nombre">{l.producto.nombre}</p>
              <p className="etiqueta">Talla {l.talla}</p>
              <div className="cantidad">
                <button onClick={() => despachar({ tipo: 'cantidad', id: l.id, talla: l.talla, delta: -1 })} aria-label={`Quitar una unidad de ${l.producto.nombre}`}>−</button>
                <span aria-live="polite">{l.cantidad}</span>
                <button onClick={() => despachar({ tipo: 'cantidad', id: l.id, talla: l.talla, delta: 1 })} disabled={l.cantidad >= 9} title={l.cantidad >= 9 ? 'Máximo 9 por prenda' : undefined} aria-label={`Añadir una unidad de ${l.producto.nombre}`}>+</button>
              </div>
            </div>
            <div className="linea__precio">
              <p>{formatoCOP.format(l.producto.precio * l.cantidad)}</p>
              <button className="enlace" onClick={() => despachar({ tipo: 'quitar', id: l.id, talla: l.talla })}>Quitar</button>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="carrito__pie">
        <p className="carrito__total"><span>Total</span><span>{formatoCOP.format(total)}</span></p>
        <button className="boton carrito__comprar" onClick={() => despachar({ tipo: 'comprar' })}>Comprar (simulado)</button>
        <button className="enlace carrito__vaciar" onClick={() => despachar({ tipo: 'vaciar' })}>Vaciar carrito</button>
        <p className="etiqueta carrito__aviso">Tienda de prueba. No se realiza ningún cobro.</p>
      </div>
    </>
  )
}

function Recibo({ recibo }) {
  const { despachar } = useCart()
  return (
    <div className="recibo">
      <p className="etiqueta">Pedido</p>
      <p className="recibo__pedido">{recibo.pedido}</p>
      <ul className="recibo__tira" aria-label="Prendas del pedido">
        {recibo.detalle.map((l) => (
          <li key={`${l.id}-${l.talla}`}><Miniatura producto={l.producto} /></li>
        ))}
      </ul>
      <ul className="recibo__lista">
        {recibo.detalle.map((l) => (
          <li key={`${l.id}-${l.talla}`}>
            <span>{l.cantidad} × {l.producto.nombre} <span className="etiqueta">· {l.talla}</span></span>
            <span>{formatoCOP.format(l.producto.precio * l.cantidad)}</span>
          </li>
        ))}
      </ul>
      <p className="carrito__total recibo__total"><span>Total</span><span>{formatoCOP.format(recibo.total)}</span></p>
      <p className="recibo__danke lead">Danke <Fon texto="DAN-ke" /></p>
      <p className="etiqueta">Tienda de prueba. No se realizó ningún cobro.</p>
      <button className="boton boton--contorno" onClick={() => despachar({ tipo: 'cerrar' })}>Seguir viendo</button>
    </div>
  )
}

export default function CartDrawer() {
  const { abierto, recibo, despachar } = useCart()
  const lateral = useMedia('(min-width: 768px)')
  const panel = useRef(null)

  useEffect(() => {
    if (!abierto) return undefined
    const previo = document.activeElement
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    panel.current?.querySelector('button')?.focus()
    const alTecla = (e) => {
      if (e.key === 'Escape') despachar({ tipo: 'cerrar' })
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const primero = f[0]
      const ultimo = f[f.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', alTecla)
    return () => {
      document.removeEventListener('keydown', alTecla)
      document.documentElement.style.overflow = ''
      getLenis()?.start()
      previo?.focus?.()
    }
  }, [abierto, despachar])

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            className="carrito__velo" key="velo"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => despachar({ tipo: 'cerrar' })}
          />
          <motion.aside
            key="panel" ref={panel} className="carrito" role="dialog" aria-modal="true" aria-label="Carrito"
            initial={lateral ? { x: '100%' } : { y: '100%' }}
            animate={lateral ? { x: 0 } : { y: 0 }}
            exit={lateral ? { x: '100%' } : { y: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="carrito__cabeza">
              <h2>{recibo ? 'Recibo' : 'Carrito'}</h2>
              <button className="enlace" onClick={() => despachar({ tipo: 'cerrar' })}>Cerrar</button>
            </header>
            <div className="carrito__cuerpo" data-lenis-prevent>
              {recibo ? <Recibo recibo={recibo} /> : <Lineas />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
