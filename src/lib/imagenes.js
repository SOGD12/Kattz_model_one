import REGISTRO from '../data/imagenes.json'

// Registro único de imágenes (src/data/imagenes.json). Ningún componente escribe rutas a mano:
// pide la foto por su clave y obtiene la URL y, si hace falta, el tamaño real.
export const urlImg = (clave) => `${REGISTRO.base}${clave}${REGISTRO.ext}`
export const tamImg = (clave) => REGISTRO.archivos[clave] || null
export const imgsDe = (idProducto) => REGISTRO.productos[idProducto] || []
export const IMG_HOME = REGISTRO.home
