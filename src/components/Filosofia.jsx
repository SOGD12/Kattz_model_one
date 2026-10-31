import { useState } from 'react'

const items = [
  { num: '01', titulo: 'Calce ancho', texto: 'Cortes sueltos y hombros caídos. Si dudas, tu talla de siempre.' },
  { num: '02', titulo: 'Tela gruesa', texto: 'Algodón pesado, nailon, lana. Prendas con peso y con caída.' },
  { num: '03', titulo: 'Unikat', texto: 'Algunas piezas tienen nombre propio: Schatten, Nebel, Sturm, Mond, Kralle, Eisen.' },
  { num: '04', titulo: 'Weit. Dunkel. Katz.', texto: 'Ancho, oscuro, gato. Un poco de alemán, siempre con guía para pronunciarlo.' },
]

function Item({ item, abierto, alPulsar }) {
  return (
    <div className={`philo-item${abierto ? ' philo-item-open' : ''}`}>
      <button className="philo-cabeza" onClick={alPulsar} aria-expanded={abierto}>
        <span className="philo-num">{item.num}</span>
        <span className="philo-titulo">{item.titulo}</span>
        <span className="philo-icon" aria-hidden="true">{abierto ? '−' : '+'}</span>
      </button>
      <div className="philo-cuerpo"><div><p className="philo-texto">{item.texto}</p></div></div>
    </div>
  )
}

export default function Filosofia() {
  const [activo, setActivo] = useState(0)
  return (
    <section className="philosophy" aria-labelledby="filo-t">
      <span className="section-label">— LO QUE SOMOS</span>
      <h2 id="filo-t" className="section-title reveal-title">ASÍ ES<br />KATZ</h2>
      <div className="philosophy-accordion">
        {items.map((it, i) => (
          <Item key={it.num} item={it} abierto={activo === i} alPulsar={() => setActivo(activo === i ? null : i)} />
        ))}
      </div>
    </section>
  )
}
