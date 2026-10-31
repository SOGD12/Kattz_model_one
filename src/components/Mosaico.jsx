import { CATEGORIAS, GRUPOS, PRODUCTOS } from '../data/productos'
import { hrefTienda } from '../lib/router'
import { IMG_HOME, urlImg } from '../lib/imagenes'

// Cuadrícula de 4 fotos por 2 filas, una por apartado (idea de la tienda True), con la foto de una prenda de cada apartado.
const TILES = ['camisetas', 'abrigos', 'jeans', 'camisas', 'pantalones', 'buzos', 'calzado', 'accesorios']

export default function Mosaico() {
  return (
    <section className="products" aria-labelledby="mos-t">
      <span className="section-label">— COMPRA POR TIPO</span>
      <h2 id="mos-t" className="section-title reveal-title">CADA PRENDA<br />SU APARTADO</h2>
      <ul className="mosaico">
        {TILES.map((cat) => {
          const c = CATEGORIAS.find((x) => x.id === cat)
          return (
            <li key={cat}>
              <a className="casilla" href={hrefTienda({ cat })} aria-label={`${c.titulo}, ${PRODUCTOS.filter((p) => p.categoria === cat).length} prendas`}>
                <img
                  src={urlImg(IMG_HOME.mosaico[cat])} alt="" loading="lazy" width="500" height="424"
                />
                <span className="casilla__texto">
                  <span className="casilla__titulo">{c.titulo}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      <h3 className="colecciones__t etiqueta">Colecciones por color</h3>
      <ul className="colecciones">
        {GRUPOS.map((g) => (
          <li key={g.id}>
            <a className={`coleccion tinte--${g.id}`} href={hrefTienda({ color: g.id })}>
              <span className="coleccion__titulo">{g.titulo}</span>
              <span className="coleccion__nota">{g.nota}</span>
              <span className="etiqueta">{PRODUCTOS.filter((p) => p.grupo === g.id).length} prendas</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
