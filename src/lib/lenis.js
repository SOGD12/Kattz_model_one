// Referencia compartida a la instancia de Lenis (para detener el scroll con el carrito abierto)
let instancia = null

export const setLenis = (l) => { instancia = l }
export const getLenis = () => instancia
