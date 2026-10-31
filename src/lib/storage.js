// localStorage con respaldo en memoria: puede lanzar o venir vacío (ventana privada, datos bloqueados)
const memoria = new Map()

export function leer(clave, porDefecto) {
  try {
    const crudo = window.localStorage.getItem(clave)
    if (crudo !== null) return JSON.parse(crudo)
  } catch {
    /* sin almacenamiento: se usa la memoria */
  }
  return memoria.has(clave) ? memoria.get(clave) : porDefecto
}

export function guardar(clave, valor) {
  memoria.set(clave, valor)
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* ignorado */
  }
}
