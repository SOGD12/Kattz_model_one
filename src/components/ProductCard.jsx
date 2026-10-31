import { useState } from 'react'
import { formatoCOP, GRUPOS } from '../data/productos'
import { useCart } from '../context/CartContext'
import { hrefProducto } from '../lib/router'
import { urlImg } from '../lib/imagenes'
import Fon from './Fon'

export function Placa({ producto }) {
  return (
    <div className="placa" aria-hidden="true">
      <span className="placa__nombre">{producto.nombre}</span>
      <span className="etiqueta">Foto pendiente</span>
    </div>
  )
}

export function Imagen({ producto, indice = 0, eager = false }) {
  const archivo = producto.imgs[indice]
  if (!archivo) return <Placa producto={producto} />
  return (
    <img
      src={urlImg(archivo)}
      alt={`${producto.nombre}, ${producto.material.toLowerCase()}`}
      loading={eager ? 'eager' : 'lazy'} decoding="async" width="960" height="1200"
    />
  )
}

export default function ProductCard({ producto, compacta = false }) {
  const { despachar } = useCart()
  const [eligiendo, setEligiendo] = useState(false)
  const grupo = GRUPOS.find((g) => g.id === producto.grupo)

  const anadir = (talla) => {
    despachar({ tipo: 'anadir', id: producto.id, talla })
    setEligiendo(false)
  }
  const alPulsar = () => {
    if (producto.tallas.length === 1) anadir(producto.tallas[0])
    else setEligiendo((v) => !v)
  }

  return (
    <article className={`tarjeta tinte--${producto.grupo}`} data-id={producto.id}>
      <a className="tarjeta__enlace" href={hrefProducto(producto.id)} aria-label={`Ver ${producto.nombre}`}>
        <div className={`tarjeta__img${producto.imgs[1] ? ' tarjeta__img--doble' : ''}`}>
          <Imagen producto={producto} />
          {producto.imgs[1] && <Imagen producto={producto} indice={1} />}
          {producto.nuevo && <span className="tarjeta__nuevo etiqueta">Nuevo</span>}
        </div>
      </a>
      <div className="tarjeta__cabeza">
        <h3><a href={hrefProducto(producto.id)}>{producto.nombre}</a></h3>
        <span className="tarjeta__precio">{formatoCOP.format(producto.precio)}</span>
      </div>
      {!compacta && (
        <p className="tarjeta__de">
          {producto.de} <Fon texto={producto.fon} />
          <span className="tarjeta__color"><i className={`punto punto--${producto.grupo}`} aria-hidden="true" />{grupo?.titulo}</span>
        </p>
      )}
      {producto.unikat && (
        <p className="tarjeta__unikat">
          <span className="unikat">Unikat</span>
          <span>{producto.unikat.de} <Fon texto={producto.unikat.fon} /></span>
        </p>
      )}
      <div className="tarjeta__accion">
        <button className="boton boton--contorno tarjeta__boton" onClick={alPulsar} aria-expanded={eligiendo}>
          Añadir
        </button>
        {eligiendo && (
          <div className="tallas" role="group" aria-label={`Talla de ${producto.nombre}`}>
            {producto.tallas.map((t) => (
              <button key={t} className="talla" onClick={() => anadir(t)}>{t}</button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
