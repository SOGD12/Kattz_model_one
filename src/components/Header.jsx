import { useEffect, useRef, useState } from 'react'
import KatzLogo from './KatzLogo'
import { useCart } from '../context/CartContext'
import { CATEGORIAS, GRUPOS, PRODUCTOS } from '../data/productos'
import { IMG_HOME, urlImg } from '../lib/imagenes'
import { hrefTienda } from '../lib/router'
import { getLenis } from '../lib/lenis'

export default function Header({ ruta }) {
  const { cantidad, despachar } = useCart()
  const [menu, setMenu] = useState(false)
  const [scroll, setScroll] = useState(false)
  const botonMenu = useRef(null)
  const panelMenu = useRef(null)
  const activa = ruta.nombre === 'tienda' ? (ruta.q.nuevo && !ruta.q.cat ? 'nuevo' : ruta.q.cat || 'todo') : null

  // Un enlace por apartado (cada tipo de prenda tiene su propia página)
  const enlaces = [
    { id: 'nuevo', texto: 'Novedades', href: hrefTienda({ nuevo: 1 }) },
    ...CATEGORIAS.map((c) => ({ id: c.id, texto: c.titulo, href: hrefTienda({ cat: c.id }) })),
    { id: 'todo', texto: 'Todo', href: hrefTienda() },
  ]

  useEffect(() => {
    const alScroll = () => setScroll(window.scrollY > 40)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  // El menú a pantalla completa bloquea el scroll y se cierra con Esc o al cambiar de página
  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
    if (!menu) return undefined
    getLenis()?.stop()
    // El fondo queda inerte, el foco entra al primer enlace y Tab no sale del menú
    const fondo = [...document.querySelectorAll('main, footer')]
    fondo.forEach((el) => el.setAttribute('inert', ''))
    const t = setTimeout(() => panelMenu.current?.querySelector('a')?.focus(), 50)
    const alTecla = (e) => {
      if (e.key === 'Escape') { setMenu(false); return }
      if (e.key !== 'Tab') return
      const foco = [botonMenu.current, ...panelMenu.current.querySelectorAll('a')].filter(Boolean)
      const primero = foco[0]; const ultimo = foco[foco.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', alTecla)
    return () => {
      clearTimeout(t)
      fondo.forEach((el) => el.removeAttribute('inert'))
      document.removeEventListener('keydown', alTecla)
      document.documentElement.style.overflow = ''
      getLenis()?.start()
      botonMenu.current?.focus({ preventScroll: true })
    }
  }, [menu])
  useEffect(() => { setMenu(false) }, [ruta.nombre, ruta.id, ruta.q.cat, ruta.q.nuevo])

  // El logo siempre lleva al inicio: si ya estás en el inicio, sube al principio y cierra el menú
  const irAlInicio = (e) => {
    e.preventDefault()
    setMenu(false)
    const hash = window.location.hash
    if (hash && hash !== '#/' && hash !== '#') {
      window.location.hash = '#/'
      return
    }
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className={`cabecera${scroll ? ' cabecera--scroll' : ''}`}>
        <p className="cabecera__aviso etiqueta">Tienda de prueba · compra simulada, sin cobro</p>
        <div className="contenedor cabecera__fila">
          <a href="#/" className="cabecera__marca" aria-label="Katz, inicio" onClick={irAlInicio}>
            <KatzLogo size={40} animar={false} etiqueta="" />
            <span>Katz<i className="cabecera__punto" aria-hidden="true" /></span>
          </a>
          <div className="cabecera__acciones">
            <button className="cabecera__carrito" onClick={() => despachar({ tipo: 'abrir' })}
              aria-label={`Abrir carrito, ${cantidad} ${cantidad === 1 ? 'artículo' : 'artículos'}`}>
              <span className="cabecera__texto">Carrito</span>
              <svg className="cabecera__bolsa" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="cabecera__cuenta" aria-hidden="true">{cantidad}</span>
            </button>
            <button ref={botonMenu} className="menu-btn" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="menu-pantalla"
              aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}>
              <span className="menu-btn__barras" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>
        <nav className="cabecera__tira" aria-label="Tipos de prenda">
          <div className="contenedor cabecera__tira-fila">
            {enlaces.map((e) => (
              <a key={e.id} href={e.href} aria-current={activa === e.id ? 'page' : undefined}>{e.texto}</a>
            ))}
          </div>
        </nav>
      </header>

      <div id="menu-pantalla" ref={panelMenu} role="dialog" aria-modal="true" aria-label="Menú" className={`menu-pantalla${menu ? ' menu-pantalla--abierto' : ''}`} aria-hidden={!menu}>
        <div className="menu-pantalla__scroll" data-lenis-prevent>
          <a className="menu-nuevo" href={hrefTienda({ nuevo: 1 })} tabIndex={menu ? 0 : -1} style={{ '--i': 0 }}>
            <img src={urlImg(IMG_HOME.banner)} alt="" width="640" height="274" loading="lazy" />
            <span className="menu-nuevo__texto">
              <span className="etiqueta">Nueva colección</span>
              <span className="menu-nuevo__titulo">Desordenado Chaos</span>
              <span className="menu-nuevo__ver">Ver novedades <span aria-hidden="true">→</span></span>
            </span>
          </a>

          <p className="menu-pantalla__t etiqueta">Comprar por tipo</p>
          <ul className="menu-cats">
            {CATEGORIAS.map((c, i) => (
              <li key={c.id} style={{ '--i': i + 1 }}>
                <a href={hrefTienda({ cat: c.id })} tabIndex={menu ? 0 : -1} aria-current={activa === c.id ? 'page' : undefined}>
                  <img src={urlImg(IMG_HOME.mosaico[c.id])} alt="" width="300" height="375" loading="lazy" />
                  <span className="menu-cats__texto">
                    <span className="menu-cats__nombre">{c.titulo}</span>
                    <span className="menu-cats__n">{PRODUCTOS.filter((p) => p.categoria === c.id).length} prendas</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="menu-pantalla__t etiqueta">Colecciones</p>
          <ul className="menu-colecciones">
            {GRUPOS.map((g) => (
              <li key={g.id}>
                <a href={hrefTienda({ color: g.id })} tabIndex={menu ? 0 : -1}><i className={`punto punto--${g.id}`} aria-hidden="true" />{g.titulo}</a>
              </li>
            ))}
          </ul>

          <a className="boton menu-pantalla__todo" href={hrefTienda()} tabIndex={menu ? 0 : -1}>Ver toda la tienda</a>
          <p className="menu-pantalla__pie etiqueta"><span>© 2026 Katz</span><span>Weit. Dunkel. Katz.</span></p>
        </div>
      </div>
    </>
  )
}
