import { useEffect, useRef, useState } from 'react'
import { Imagen } from '../components/ProductCard'
import Fon from '../components/Fon'
import GuiaTallas from '../components/GuiaTallas'
import { CATEGORIAS, GRUPOS, PRODUCTOS, formatoCOP, porId } from '../data/productos'
import { useCart } from '../context/CartContext'
import { useFavoritos } from '../hooks/useFavoritos'
import { hrefProducto, hrefTienda } from '../lib/router'
import { getLenis } from '../lib/lenis'
import { urlImg } from '../lib/imagenes'

const Corazon = ({ lleno }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill={lleno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
)
const Lupa = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="11" cy="11" r="6" /><path d="m16 16 4 4M11 8.5v5M8.5 11h5" />
  </svg>
)
const Bolsa = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)
const IconoEnvio = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" />
  </svg>
)
const IconoEscudo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.500 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" />
  </svg>
)

// Galería: miniaturas verticales, foto grande deslizable con flechas, contador y lupa (zoom)
function Galeria({ p }) {
  const pista = useRef(null)
  const [i, setI] = useState(0)
  const [zoom, setZoom] = useState(false)
  const total = p.imgs.length

  useEffect(() => {
    const el = pista.current
    const alScroll = () => setI(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', alScroll, { passive: true })
    return () => el.removeEventListener('scroll', alScroll)
  }, [])

  useEffect(() => {
    if (!zoom) return undefined
    const alTecla = (e) => { if (e.key === 'Escape') setZoom(false) }
    document.addEventListener('keydown', alTecla)
    return () => document.removeEventListener('keydown', alTecla)
  }, [zoom])

  const ir = (k) => {
    const el = pista.current
    const n = (k + total) % total
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: n * el.clientWidth, behavior: suave ? 'smooth' : 'auto' })
  }
  const alTecla = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(i - 1) }
  }

  return (
    <div className="gal gal--minis">
      {total > 0 && (
        <div className="gal__minis" role="group" aria-label="Vistas">
          {p.imgs.map((_, k) => (
            <button key={k} className="gal__mini" aria-pressed={i === k} onClick={() => ir(k)} aria-label={`Vista ${k + 1} de ${total}`}>
              <Imagen producto={p} indice={k} />
            </button>
          ))}
        </div>
      )}
      <div className="gal__marco">
        <div className="gal__pista" ref={pista} tabIndex={0} onKeyDown={alTecla} aria-label={`Fotos de ${p.nombre}`}>
          {(total ? p.imgs : [null]).map((_, k) => (
            <div className="gal__slide" key={k}><Imagen producto={p} indice={k} eager={k === 0} /></div>
          ))}
        </div>
        {total > 1 && (
          <>
            <button className="gal__flecha gal__flecha--ant" onClick={() => ir(i - 1)} aria-label="Foto anterior">‹</button>
            <button className="gal__flecha gal__flecha--sig" onClick={() => ir(i + 1)} aria-label="Foto siguiente">›</button>
            <span className="gal__cuenta etiqueta" aria-live="polite">{i + 1} / {total}</span>
          </>
        )}
        {total > 0 && <button className="gal__zoom" onClick={() => setZoom(true)} aria-label="Ampliar la foto"><Lupa /></button>}
      </div>
      {zoom && (
        <div className="zoom" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={() => setZoom(false)}>
          <button className="zoom__cerrar enlace" onClick={() => setZoom(false)}>Cerrar</button>
          <img src={urlImg(p.imgs[i])} alt={p.nombre} />
        </div>
      )}
    </div>
  )
}

// Tarjeta de "Te puede gustar": imagen con esquinas suaves, nombre, precio y corazón
function TarjetaSimple({ x, favorito, alternar }) {
  return (
    <article className="simil">
      <a className="simil__img" href={hrefProducto(x.id)} aria-label={`Ver ${x.nombre}`}><Imagen producto={x} /></a>
      <div className="simil__pie">
        <div>
          <h3><a href={hrefProducto(x.id)}>{x.nombre}</a></h3>
          <p>{formatoCOP.format(x.precio)}</p>
        </div>
        <button className="corazon" aria-pressed={favorito} onClick={() => alternar(x.id)}
          aria-label={favorito ? `Quitar ${x.nombre} de favoritos` : `Guardar ${x.nombre} en favoritos`}>
          <Corazon lleno={favorito} />
        </button>
      </div>
    </article>
  )
}

const PESTANAS = [
  { id: 'detalles', texto: 'Detalles' },
  { id: 'materiales', texto: 'Materiales' },
  { id: 'talla', texto: 'Talla y calce' },
  { id: 'envios', texto: 'Envíos y devoluciones' },
]

export default function Producto({ id }) {
  const p = porId(id)
  const { despachar } = useCart()
  const { es, alternar } = useFavoritos()
  const [talla, setTalla] = useState(p?.tallas.length === 1 ? p.tallas[0] : null)
  const [falta, setFalta] = useState(false)
  const [guia, setGuia] = useState(false)
  const [barra, setBarra] = useState(false)
  const [pestana, setPestana] = useState('detalles')
  const botonRef = useRef(null)

  // Barra fija de compra en móvil: aparece cuando el botón principal ya salió por arriba
  useEffect(() => {
    const revisar = () => {
      const el = botonRef.current
      if (el) setBarra(el.getBoundingClientRect().bottom < 0)
    }
    revisar()
    window.addEventListener('scroll', revisar, { passive: true })
    window.addEventListener('resize', revisar)
    return () => { window.removeEventListener('scroll', revisar); window.removeEventListener('resize', revisar) }
  }, [id])

  if (!p) {
    return (
      <section className="pagina"><div className="contenedor vacio">
        <h1 className="pagina__titulo">No encontrada</h1>
        <p className="cuerpo-suave">Esa prenda no existe en Katz.</p>
        <a className="boton boton--contorno" href={hrefTienda()}>Volver a la tienda</a>
      </div></section>
    )
  }

  const cat = CATEGORIAS.find((c) => c.id === p.categoria)
  const grupo = GRUPOS.find((g) => g.id === p.grupo)
  const gustar = [...PRODUCTOS.filter((x) => x.id !== p.id && x.categoria === p.categoria), ...PRODUCTOS.filter((x) => x.id !== p.id && x.categoria !== p.categoria)].slice(0, 4)
  const detalle = p.imgs[0] // la foto más nítida de la prenda, con un acercamiento suave

  const anadir = () => {
    if (!talla) {
      setFalta(true)
      const grupoTallas = document.querySelector('.ficha__tallas')
      if (grupoTallas) {
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(grupoTallas, { offset: -200 })
        else grupoTallas.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      return
    }
    despachar({ tipo: 'anadir', id: p.id, talla })
  }
  const elegir = (t) => { setTalla(t); setFalta(false) }

  const puntos = [
    p.calce,
    p.material,
    `Colección ${grupo.titulo.toLowerCase()}`,
    `Categoría: ${cat.titulo.toLowerCase()}`,
    p.unikat ? `Unikat: nombre propio, ${p.unikat.de}` : 'Prenda de línea, sin nombre propio',
  ]

  return (
    <section className="pagina">
      <div className="contenedor">
        <nav className="migas" aria-label="Ruta">
          <a href="#/">Inicio</a><span aria-hidden="true">/</span>
          <a href={hrefTienda({ cat: p.categoria })}>{cat.titulo}</a><span aria-hidden="true">/</span>
          <span>{p.nombre}</span>
        </nav>

        <div className="ficha">
          <Galeria key={p.id} p={p} />

          <div className="ficha__info">
            <p className="ficha__insignias">
              {p.nuevo && <span className="insignia">Nuevo</span>}
              {p.unikat && <span className="unikat">Unikat</span>}
              {p.unikat && <span className="ficha__unikat-nombre">{p.unikat.de} <Fon texto={p.unikat.fon} /> · {p.unikat.es}</span>}
            </p>
            <h1 className="ficha__nombre">{p.nombre}</h1>
            <p className="tarjeta__de">{p.de} <Fon texto={p.fon} /></p>
            <p className="ficha__precio">{formatoCOP.format(p.precio)}</p>
            <p className="ficha__resumen">{p.material}. {p.calce}.</p>

            <div className="ficha__bloque">
              <p className="ficha__etiqueta"><span className="etiqueta">Color</span> {grupo.titulo}</p>
              <div className="colores-ficha" role="group" aria-label="Color">
                <span className="color-opcion color-opcion--activo" title={grupo.titulo}>
                  <i className={`punto punto--${p.grupo}`} />
                  <span className="sr">{grupo.titulo}</span>
                </span>
              </div>
            </div>

            <fieldset className="ficha__bloque ficha__tallas">
              <div className="ficha__fila">
                <legend className="ficha__etiqueta"><span className="etiqueta">Talla</span> {talla ?? ''}</legend>
                <button className="enlace ficha__guia" onClick={() => setGuia(true)}>Guía de tallas</button>
              </div>
              <div className="tallas">
                {p.tallas.map((t) => (
                  <button key={t} className="talla talla--caja" aria-pressed={talla === t} onClick={() => elegir(t)}>{t}</button>
                ))}
              </div>
              {falta && <p className="ficha__error" role="alert">Elige una talla.</p>}
            </fieldset>

            <div className="ficha__compra">
              <button ref={botonRef} className="boton ficha__anadir" onClick={anadir}><Bolsa />Añadir al carrito</button>
              <button className="corazon corazon--caja" aria-pressed={es(p.id)} onClick={() => alternar(p.id)}
                aria-label={es(p.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
                <Corazon lleno={es(p.id)} />
              </button>
            </div>

            <ul className="confianza">
              <li><IconoEnvio /><span><b>Compra simulada</b>Sin cobro real</span></li>
              <li><IconoEnvio /><span><b>Sin envíos</b>Tienda de prueba</span></li>
              <li><IconoEscudo /><span><b>Sin datos de pago</b>No se piden</span></li>
            </ul>
          </div>
        </div>

        <section className="detalle" aria-label="Información de la prenda">
          <div className="detalle__texto">
            <div className="pestanas" role="tablist" aria-label="Información">
              {PESTANAS.map((t) => (
                <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={pestana === t.id} aria-controls={`panel-${t.id}`}
                  onClick={() => setPestana(t.id)}>{t.texto}</button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${pestana}`} aria-labelledby={`tab-${pestana}`} className="detalle__panel">
              {pestana === 'detalles' && (
                <>
                  <p>{p.nombre} de la colección {grupo.titulo.toLowerCase()}. {grupo.nota}</p>
                  <ul className="puntos">{puntos.map((t) => <li key={t}>{t}</li>)}</ul>
                </>
              )}
              {pestana === 'materiales' && <p>{p.material}. Información de composición pendiente: es una tienda de prueba.</p>}
              {pestana === 'talla' && (
                <>
                  <p>{p.calce}. El corte de Katz ya es ancho: si dudas, tu talla de siempre; si quieres más volumen, sube una.</p>
                  <button className="enlace" onClick={() => setGuia(true)}>Ver guía de tallas</button>
                </>
              )}
              {pestana === 'envios' && <p>No hay envíos ni devoluciones: no se vende nada de verdad. El recibo que ves al comprar es una simulación.</p>}
            </div>
          </div>
          <div className="detalle__img" aria-hidden="true">
            <Imagen producto={{ ...p, imgs: [detalle] }} />
          </div>
        </section>

        <section className="gustar" aria-labelledby="gus-t">
          <div className="gustar__cabeza">
            <h2 id="gus-t">Te puede gustar</h2>
            <a className="enlace-flecha" href={hrefTienda()}>Ver todo →</a>
          </div>
          <div className="gustar__rejilla">
            {gustar.map((x) => <TarjetaSimple key={x.id} x={x} favorito={es(x.id)} alternar={alternar} />)}
          </div>
        </section>
      </div>

      <div className={`ficha-barra${barra ? ' ficha-barra--visible' : ''}`} aria-hidden={!barra}>
        <div className="ficha-barra__info">
          <strong>{p.nombre}</strong>
          <span>{formatoCOP.format(p.precio)}</span>
        </div>
        <select aria-label="Talla" value={talla || ''} tabIndex={barra ? 0 : -1} onChange={(e) => elegir(e.target.value)}>
          <option value="" disabled>Talla</option>
          {p.tallas.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="boton" tabIndex={barra ? 0 : -1} onClick={anadir}>Añadir</button>
      </div>

      {guia && <GuiaTallas producto={p} talla={talla} alCerrar={() => setGuia(false)} />}
    </section>
  )
}
