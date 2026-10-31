import KatzLogo from './KatzLogo'
import { CATEGORIAS } from '../data/productos'
import { hrefTienda } from '../lib/router'

export default function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie__suelo">
          <span className="pie__linea" aria-hidden="true" />
          <div className="pie__gato"><KatzLogo size={96} dormido etiqueta="Katz, gato dormido" /></div>
        </div>
        <div className="grilla pie__columnas">
          <div className="pie__col">
            <h2 className="pie__t">Tienda</h2>
            <ul className="pie__lista">
              <li><a href={hrefTienda({ nuevo: 1 })}>Novedades</a></li>
              {CATEGORIAS.map((c) => <li key={c.id}><a href={hrefTienda({ cat: c.id })}>{c.titulo}</a></li>)}
            </ul>
          </div>
          <div className="pie__col">
            <h2 className="pie__t">Ayuda</h2>
            <p className="cuerpo-suave">Tallas S, M, L, XL. El corte ya es ancho.</p>
            <p className="cuerpo-suave">Cambios y envíos: no aplican, es una tienda de prueba.</p>
          </div>
          <div className="pie__col">
            <h2 className="pie__t">Contacto</h2>
            <p className="cuerpo-suave">hola@katz.example</p>
          </div>
          <div className="pie__col">
            <h2 className="pie__t">Aviso</h2>
            <p className="cuerpo-suave">Tienda de prueba. No se realiza ningún cobro. Algunas imágenes son de prueba.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
