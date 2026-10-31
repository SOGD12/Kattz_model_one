const texto = 'OVERSIZE · ALTERNATIVO · WEIT · DUNKEL · KATZ · '

// Dos filas en sentidos contrarios; el texto se repite para que el bucle (-50%) no tenga costura
export default function Marquee() {
  const fila = Array.from({ length: 6 }, (_, i) => <span key={i}>{texto}</span>)
  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee-row marquee-row--left">{fila}</div>
      <div className="marquee-row marquee-row--right">{fila}</div>
    </section>
  )
}
