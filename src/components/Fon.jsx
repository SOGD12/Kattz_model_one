// Guía fonética entre barras: la sílaba tónica (en mayúsculas) va en peso 500
export default function Fon({ texto }) {
  const silabas = texto.split('-')
  return (
    <span className="fon" aria-label={`se pronuncia ${texto.toLowerCase().replace(/-/g, ' ')}`}>
      /
      {silabas.map((s, i) => (
        <span key={i}>
          {s === s.toUpperCase() && s !== s.toLowerCase() ? <b>{s.toLowerCase()}</b> : s}
          {i < silabas.length - 1 ? '-' : ''}
        </span>
      ))}
      /
    </span>
  )
}
