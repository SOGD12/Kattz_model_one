import { useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { CATEGORIAS, GRUPOS, PRODUCTOS, SUBFILTROS } from '../data/productos'
import { hrefTienda } from '../lib/router'

const ORDENES = [
  { id: 'destacados', texto: 'Destacados' },
  { id: 'precio-asc', texto: 'Precio: menor a mayor' },
  { id: 'precio-desc', texto: 'Precio: mayor a menor' },
  { id: 'nombre', texto: 'Nombre' },
]

// Cada tipo de prenda tiene su propia página (#/tienda?cat=camisetas) con sus subfiltros (&sub=basicas),
// como una colección de tienda de ropa. Todo vive en la URL: se comparte y "atrás" lo deshace.
export default function Tienda({ q }) {
  const apartado = CATEGORIAS.find((c) => c.id === q.cat)
  const cat = apartado ? apartado.id : 'todo'
  const subs = SUBFILTROS[cat] || []
  const sub = subs.some((s) => s.id === q.sub) ? q.sub : 'todo'
  const color = GRUPOS.some((g) => g.id === q.color) ? q.color : 'todo'
  const soloNuevo = q.nuevo === '1'
  const orden = ORDENES.some((o) => o.id === q.orden) ? q.orden : 'destacados'

  const href = (cambios) => hrefTienda({ cat, sub, color, nuevo: soloNuevo ? 1 : '', orden, ...cambios })
  const ir = (cambios) => { window.location.hash = href(cambios) }

  // Valores raros en la URL (?cat=zzz, ?color=azul, ?nuevo=0) se corrigen en lugar de ignorarse en silencio
  const urlLimpia = hrefTienda({ cat, sub, color, nuevo: soloNuevo ? 1 : '', orden })
  useEffect(() => {
    const hayRaros = Object.keys(q).some((k) => !['cat', 'sub', 'color', 'nuevo', 'orden'].includes(k)) || (q.cat && !apartado) || (q.color && color === 'todo') || (q.sub && sub === 'todo') || (q.nuevo && !soloNuevo) || (q.orden && orden !== q.orden)
    if (hayRaros) window.location.replace(urlLimpia)
  }, [urlLimpia, q, apartado, color, sub, soloNuevo, orden])

  const delApartado = useMemo(() => PRODUCTOS.filter((p) => (cat === 'todo' || p.categoria === cat) && (!soloNuevo || p.nuevo)), [cat, soloNuevo])
  const lista = useMemo(() => {
    const filtro = subs.find((s) => s.id === sub)
    let r = delApartado.filter((p) => (!filtro || filtro.test(p)) && (color === 'todo' || p.grupo === color))
    if (orden === 'precio-asc') r = [...r].sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') r = [...r].sort((a, b) => b.precio - a.precio)
    if (orden === 'nombre') r = [...r].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    return r
  }, [delApartado, subs, sub, color, orden])

  const titulo = soloNuevo && cat === 'todo' ? 'Novedades' : apartado?.titulo || 'Toda la tienda'
  const subtitulo = apartado?.superior || (soloNuevo ? 'Recién llegadas' : 'Todas las prendas')
  const hayFiltros = cat !== 'todo' || color !== 'todo' || soloNuevo || sub !== 'todo'
  const nombreColor = GRUPOS.find((g) => g.id === color)?.titulo

  // Fila de enlaces bajo el título: subfiltros del apartado, o los apartados si estás en "toda la tienda"
  const enlaces = cat === 'todo'
    ? CATEGORIAS.map((c) => ({ id: c.id, texto: c.titulo, href: href({ cat: c.id, sub: '' }), n: PRODUCTOS.filter((p) => p.categoria === c.id && (!soloNuevo || p.nuevo) && (color === 'todo' || p.grupo === color)).length, activo: false }))
    : [{ id: 'todo', texto: 'Todo', href: href({ sub: '' }), n: delApartado.filter((p) => color === 'todo' || p.grupo === color).length, activo: sub === 'todo' },
       ...subs.map((s) => ({ id: s.id, texto: s.titulo, href: href({ sub: s.id }), n: delApartado.filter((p) => s.test(p) && (color === 'todo' || p.grupo === color)).length, activo: sub === s.id }))]

  return (
    <section className="pagina">
      <div className="contenedor">
        <nav className="migas" aria-label="Ruta">
          <a href="#/">Inicio</a><span aria-hidden="true">/</span>
          {apartado ? <><a href={hrefTienda()}>Tienda</a><span aria-hidden="true">/</span><span>{apartado.titulo}</span></> : <span>{titulo}</span>}
        </nav>
        <header className="pagina__cabeza pagina__cabeza--apartado">
          <div>
            <h1 className="pagina__titulo">{titulo}</h1>
            <p className="pagina__sub">{subtitulo}</p>
          </div>
          <p className="etiqueta" aria-live="polite">{lista.length} {lista.length === 1 ? 'prenda' : 'prendas'}</p>
        </header>

        <nav className="subnav" aria-label={cat === 'todo' ? 'Apartados' : `Tipos de ${titulo.toLowerCase()}`}>
          {enlaces.map((e) => (
            <a key={e.id} href={e.href} aria-current={e.activo ? 'page' : undefined}>
              {e.texto}<span className="subnav__n">{e.n}</span>
            </a>
          ))}
        </nav>

        <div className="filtros filtros--barra">
          <div className="filtros__grupo" role="group" aria-label="Colección">
            <span className="etiqueta filtros__t">Filtrar</span>
            <button className="chip" aria-pressed={soloNuevo} onClick={() => ir({ nuevo: soloNuevo ? '' : 1 })}>Novedades</button>
            {GRUPOS.map((g) => (
              <button key={g.id} className="chip chip--color" aria-pressed={color === g.id} onClick={() => ir({ color: color === g.id ? 'todo' : g.id })}>
                <i className={`punto punto--${g.id}`} aria-hidden="true" />{g.titulo}
              </button>
            ))}
          </div>
          <label className="orden">
            <span className="etiqueta">Ordenar</span>
            <select value={orden} onChange={(e) => ir({ orden: e.target.value === 'destacados' ? '' : e.target.value })}>
              {ORDENES.map((o) => <option key={o.id} value={o.id}>{o.texto}</option>)}
            </select>
          </label>
        </div>

        {hayFiltros && lista.length > 0 && (
          <p className="filtros__activos">
            <button className="enlace" onClick={() => { window.location.hash = hrefTienda() }}>Quitar filtros</button>
          </p>
        )}
        <h2 className="solo-lectores">Prendas</h2>
        {lista.length ? (
          <>
            <div className="rejilla-productos">
              {lista.map((p) => <ProductCard key={p.id} producto={p} />)}
            </div>
          </>
        ) : (
          <div className="vacio">
            <p className="lead">
              No hay prendas{apartado ? ` en ${titulo.toLowerCase()}` : ''}{nombreColor ? ` de la colección ${nombreColor.toLowerCase()}` : ''}.
            </p>
            <div className="vacio__acciones">
              {hayFiltros && <button className="boton" onClick={() => { window.location.hash = hrefTienda() }}>Quitar filtros</button>}
              {apartado && <button className="boton boton--contorno" onClick={() => { window.location.hash = hrefTienda({ cat }) }}>Ver todo en {titulo.toLowerCase()}</button>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
