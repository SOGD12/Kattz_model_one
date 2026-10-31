import { useEffect, useRef, useState } from 'react'
import { GRUPOS, PRODUCTOS, formatoCOP } from '../data/productos'
import { useCart } from '../context/CartContext'
import { hrefProducto, hrefTienda } from '../lib/router'
import { Imagen } from './ProductCard'

// Tarjeta de carrusel: imagen con segunda vista al pasar el cursor, botón de bolsa para añadir
// rápido, nombre, precio y tallas siempre visibles (clic en una talla = al carrito).
function Tarjeta({ producto }) {
  const { despachar } = useCart()
  const grupo = GRUPOS.find((g) => g.id === producto.grupo)
  const anadir = (talla) => despachar({ tipo: 'anadir', id: producto.id, talla })

  return (
    <article className="cr-tarjeta">
      <div className="cr-img">
        <a href={hrefProducto(producto.id)} className="cr-img__enlace" aria-label={`Ver ${producto.nombre}`}>
          <Imagen producto={producto} />
          {producto.imgs[1] && <Imagen producto={producto} indice={1} />}
        </a>
        {producto.nuevo && <span className="cr-nuevo etiqueta">Nuevo</span>}
        <button className="cr-bolsa" onClick={() => anadir(producto.tallas[Math.floor((producto.tallas.length - 1) / 2)])}
          aria-label={`Añadir ${producto.nombre} al carrito en talla ${producto.tallas[Math.floor((producto.tallas.length - 1) / 2)]}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        </button>
      </div>
      <h3 className="cr-nombre"><a href={hrefProducto(producto.id)}>{producto.nombre}</a></h3>
      <p className="cr-precio">{formatoCOP.format(producto.precio)}</p>
      <div className="cr-tallas" role="group" aria-label={`Tallas de ${producto.nombre}`}>
        {producto.tallas.map((t) => (
          <button key={t} className="cr-talla" onClick={() => anadir(t)}>{t}</button>
        ))}
      </div>
      <p className="cr-color"><i className={`punto punto--${producto.grupo}`} aria-hidden="true" />{grupo?.titulo}</p>
    </article>
  )
}

// Carrusel reutilizable: `items` (prendas), cabecera opcional y titular con o sin animación
const INTERVALO = 2500 // el carrusel avanza una tarjeta cada 2,5 s

export function CarruselProductos({ items, id = 'cr-t', etiqueta, titulo, animar = true, enlace, auto = false }) {
  const pista = useRef(null)
  const marco = useRef(null)
  const [borde, setBorde] = useState({ ini: true, fin: false })
  const [pausado, setPausado] = useState(false)   // botón «Pausar» (el usuario lo detiene)
  const [encima, setEncima] = useState(false)     // cursor o foco dentro
  const [visible, setVisible] = useState(false)   // sección en pantalla

  useEffect(() => {
    const el = pista.current
    const medir = () => setBorde({ ini: el.scrollLeft < 4, fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
    medir()
    el.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => { el.removeEventListener('scroll', medir); window.removeEventListener('resize', medir) }
  }, [items])

  const mover = (dir) => {
    const el = pista.current
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: suave ? 'smooth' : 'auto' })
  }

  // Avance automático: una tarjeta cada 2,5 s; al llegar al final vuelve al inicio. Se detiene con el cursor
  // o el foco encima, con la pestaña oculta, fuera de pantalla, con «reducir movimiento» o con el botón Pausar.
  useEffect(() => {
    if (!auto) return undefined
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(marco.current)
    return () => io.disconnect()
  }, [auto])

  const reducido = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (!auto || reducido || pausado || encima || !visible) return undefined
    const t = setInterval(() => {
      const el = pista.current
      if (!el || document.hidden) return
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) { el.scrollTo({ left: 0, behavior: 'smooth' }); return }
      const tarjeta = el.firstElementChild
      const hueco = parseFloat(getComputedStyle(el).columnGap) || 0
      el.scrollBy({ left: tarjeta.offsetWidth + hueco, behavior: 'smooth' })
    }, INTERVALO)
    return () => clearInterval(t)
  }, [auto, reducido, pausado, encima, visible])

  return (
    <section className="products" aria-labelledby={id}>
      {etiqueta && <span className="section-label">{etiqueta}</span>}
      <h2 id={id} className={`section-title${animar ? ' reveal-title' : ' section-title--chico'}`}>{titulo}</h2>
      <div className="cr" ref={marco}
        onMouseEnter={() => setEncima(true)} onMouseLeave={() => setEncima(false)}
        onFocus={() => setEncima(true)} onBlur={() => setEncima(false)}>
        <button className="cr-flecha cr-flecha--ant" onClick={() => mover(-1)} disabled={borde.ini} aria-label="Anteriores">‹</button>
        <div className="cr-pista" ref={pista} tabIndex={0} aria-label={`Prendas: ${typeof titulo === 'string' ? titulo : 'colección'}`}>
          {items.map((p) => <Tarjeta key={p.id} producto={p} />)}
        </div>
        <button className="cr-flecha cr-flecha--sig" onClick={() => mover(1)} disabled={borde.fin} aria-label="Siguientes">›</button>
      </div>
      {auto && !reducido && (
        <button className="cr-pausa etiqueta" onClick={() => setPausado((v) => !v)} aria-pressed={pausado}>
          {pausado ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      )}
      {enlace && <p className="products-mas"><a className="enlace-flecha" href={enlace.href}>{enlace.texto}</a></p>}
    </section>
  )
}

// Reparte las prendas nuevas por categoría (una de cada, en rotación) hasta llegar a `n`
function conVariedad(lista, n) {
  const grupos = new Map()
  lista.forEach((p) => grupos.set(p.categoria, [...(grupos.get(p.categoria) || []), p]))
  const salida = []
  while (salida.length < n && [...grupos.values()].some((g) => g.length)) {
    for (const g of grupos.values()) {
      if (g.length && salida.length < n) salida.push(g.shift())
    }
  }
  return salida
}

export default function Carrusel() {
  const items = conVariedad(PRODUCTOS.filter((p) => p.nuevo), 12)
  return (
    <CarruselProductos
      items={items} id="cr-t" etiqueta="— LA COLECCIÓN" auto
      titulo={<>PIEZAS QUE<br />HABLAN SOLAS</>}
      enlace={{ href: hrefTienda(), texto: 'Ver toda la tienda' }}
    />
  )
}
