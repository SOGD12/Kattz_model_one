// Catálogo ampliado (58 prendas) a partir de las hojas nuevas. Imágenes en public/img/catalogo/.
// Precios en COP, ficticios. Materiales y calces provisionales (tienda de prueba).
// Grupo (tinte): azul = marino/índigo, café = café/oliva/verde, morado = morado/negro/gris, rojo = vino.

import { imgsDe } from '../lib/imagenes'

const T = ['S', 'M', 'L', 'XL']
const JEANS = ['28', '30', '32', '34', '36']
const CALZADO = ['38', '39', '40', '41', '42', '43']

const TIPOS = {
  jeans: { categoria: 'inferior', de: 'Jeans', fon: 'YINS', tallas: JEANS },
  pantalon: { categoria: 'inferior', de: 'Hose', fon: 'HO-se', tallas: T },
  zapatilla: { categoria: 'calzado', de: 'Schuhe', fon: 'SHU-e', tallas: CALZADO },
  botas: { categoria: 'calzado', de: 'Stiefel', fon: 'SHTI-fel', tallas: CALZADO },
  camiseta: { categoria: 'superior', de: 'T-Shirt', fon: 'ti-SHERT', tallas: T },
  camisa: { categoria: 'superior', de: 'Hemd', fon: 'HEMT', tallas: T },
  chaqueta: { categoria: 'superior', de: 'Jacke', fon: 'YA-ke', tallas: T },
}

// [id, nombre, grupo, precio, tipo, material, calce]  (las fotos de cada prenda están en src/data/imagenes.json)
const FILAS = [
  // Pantalones
  ['jeans-indigo-lavado', 'Jeans índigo lavado', 'azul', 229900, 'jeans', 'Denim índigo lavado', 'Anchos, tiro bajo'],
  ['jeans-negro-lavado', 'Jeans negro lavado', 'morado', 239900, 'jeans', 'Denim negro lavado', 'Anchos, bolsillo de carpintero'],
  ['jeans-gris-desgastado', 'Jeans gris desgastado', 'morado', 239900, 'jeans', 'Denim gris con desgaste', 'Rectos y anchos'],
  ['cargo-marino-cordones', 'Cargo marino con cordones', 'azul', 209900, 'pantalon', 'Sarga azul marino', 'Pierna ancha, cordones en el tobillo'],
  ['cargo-cafe-correas', 'Cargo café con correas', 'cafe', 249900, 'pantalon', 'Sarga café', 'Pierna ancha, bolsillos con correas'],
  ['cargo-carbon-correas', 'Cargo carbón con correas', 'morado', 249900, 'pantalon', 'Sarga gris carbón', 'Pierna ancha, bolsillos con correas'],
  ['buzo-ancho-morado', 'Buzo ancho morado', 'morado', 169900, 'pantalon', 'Felpa de algodón', 'Cintura elástica, puño'],
  ['buzo-negro-costuras', 'Buzo negro con costuras', 'morado', 179900, 'pantalon', 'Felpa de algodón', 'Cintura elástica, paneles'],
  ['buzo-cargo-oliva', 'Buzo cargo oliva', 'cafe', 189900, 'pantalon', 'Felpa de algodón', 'Bolsillos cargo, puño'],
  ['pantalon-vestir-marino', 'Pantalón de vestir marino', 'azul', 189900, 'pantalon', 'Sarga de algodón', 'Pinzas, pierna ancha'],
  ['pantalon-vestir-cafe', 'Pantalón de vestir café', 'cafe', 189900, 'pantalon', 'Sarga de algodón', 'Pierna ancha'],
  ['pantalon-negro-paneles', 'Pantalón negro con paneles', 'morado', 199900, 'pantalon', 'Sarga técnica', 'Pierna ancha, costuras de panel'],

  // Calzado
  ['zapatilla-lona-negra', 'Zapatilla de lona negra', 'morado', 219900, 'zapatilla', 'Lona y suela de goma', 'Corte bajo'],
  ['zapatilla-cuero-cafe', 'Zapatilla de cuero café', 'cafe', 259900, 'zapatilla', 'Cuero y suela de goma', 'Corte bajo'],
  ['zapatilla-lona-marino', 'Zapatilla de lona marino', 'azul', 219900, 'zapatilla', 'Lona y suela de goma', 'Corte bajo'],
  ['zapatilla-lona-ciruela', 'Zapatilla de lona ciruela', 'morado', 219900, 'zapatilla', 'Lona y suela de goma', 'Corte bajo'],
  ['zapatilla-cuero-oscuro', 'Zapatilla de cuero oscuro', 'cafe', 259900, 'zapatilla', 'Cuero y suela marino', 'Corte bajo'],
  ['zapatilla-ante-morado', 'Zapatilla de ante morado', 'morado', 269900, 'zapatilla', 'Ante y suela de goma', 'Corte bajo'],
  ['zapatilla-skate-negra', 'Zapatilla skate negra', 'morado', 239900, 'zapatilla', 'Ante y lona', 'Corte bajo, suela plana'],
  ['zapatilla-ante-cafe', 'Zapatilla de ante café', 'cafe', 269900, 'zapatilla', 'Ante y suela de goma', 'Corte bajo'],
  ['zapatilla-ante-azul', 'Zapatilla de ante azul', 'azul', 269900, 'zapatilla', 'Ante y suela negra', 'Corte bajo'],
  ['zapatilla-ante-azul-goma', 'Zapatilla de ante azul, suela goma', 'azul', 269900, 'zapatilla', 'Ante y suela de goma', 'Corte bajo'],
  ['zapatilla-ante-morado-goma', 'Zapatilla de ante morado, suela goma', 'morado', 269900, 'zapatilla', 'Ante y suela de goma', 'Corte bajo'],
  ['botas-cuero-negro', 'Botas de cuero negro', 'morado', 349900, 'botas', 'Cuero, suela gruesa', 'Caña media, cordones'],
  ['botas-cuero-cafe', 'Botas de cuero café', 'cafe', 349900, 'botas', 'Cuero, suela gruesa', 'Caña media, cordones'],
  ['botas-ante-morado', 'Botas de ante morado', 'morado', 359900, 'botas', 'Ante, suela gruesa', 'Caña media, cordones'],

  // Camisetas estampadas (frente y espalda)
  ['camiseta-lavada-sol', 'Camiseta lavada Sol', 'morado', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-gotas', 'Camiseta lavada Gotas urbanas', 'cafe', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-engranaje-1', 'Camiseta lavada Engranaje I', 'azul', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-engranaje-2', 'Camiseta lavada Engranaje II', 'azul', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-ojo', 'Camiseta lavada Ojo', 'morado', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-naturaleza', 'Camiseta lavada Naturaleza y caos', 'cafe', 129900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-concierto', 'Camiseta lavada Concierto', 'morado', 139900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],
  ['camiseta-lavada-alambre', 'Camiseta lavada Concierto, alambre', 'morado', 139900, 'camiseta', 'Algodón lavado, estampado', 'Oversize, hombro caído'],

  // Camisetas lisas y técnicas
  ['camiseta-basica-marino', 'Camiseta básica azul marino', 'azul', 99900, 'camiseta', 'Jersey de algodón grueso', 'Caja, hombro caído'],
  ['camiseta-basica-cafe', 'Camiseta básica café', 'cafe', 99900, 'camiseta', 'Jersey de algodón grueso', 'Caja, hombro caído'],
  ['camiseta-basica-morado', 'Camiseta básica morado', 'morado', 99900, 'camiseta', 'Jersey de algodón grueso', 'Caja, hombro caído'],
  ['camiseta-lavada-carbon', 'Camiseta lavada carbón', 'morado', 119900, 'camiseta', 'Algodón lavado', 'Caja, hombro caído'],
  ['camiseta-basica-verde', 'Camiseta básica verde bosque', 'cafe', 99900, 'camiseta', 'Jersey de algodón grueso', 'Caja, hombro caído'],
  ['camiseta-basica-vino', 'Camiseta básica vino', 'rojo', 99900, 'camiseta', 'Jersey de algodón grueso', 'Caja, hombro caído'],
  ['camiseta-patchwork-carbon', 'Camiseta patchwork carbón y morado', 'morado', 159900, 'camiseta', 'Algodón en paneles, bordes crudos', 'Ancha, bajo asimétrico'],
  ['camiseta-bolsillo-cafe', 'Camiseta café con bolsillo de solapa', 'cafe', 149900, 'camiseta', 'Algodón lavado', 'Ancha, abertura lateral'],
  ['camiseta-patchwork-marino', 'Camiseta patchwork marino', 'azul', 159900, 'camiseta', 'Algodón en paneles, costura de contraste', 'Ancha, capa doble en manga'],
  ['camiseta-bolsillo-morado', 'Camiseta morada con bolsillo técnico', 'morado', 149900, 'camiseta', 'Algodón y nailon', 'Ancha, correas laterales'],
  ['camiseta-corte-negro', 'Camiseta negra con corte diagonal', 'morado', 149900, 'camiseta', 'Algodón lavado, bordes crudos', 'Ancha, bajo asimétrico'],
  ['camiseta-asimetrica-oliva', 'Camiseta asimétrica oliva', 'cafe', 149900, 'camiseta', 'Algodón lavado', 'Ancha, cierre cruzado con lazos'],

  // Camisas, overshirts y chaquetas ligeras
  ['camisa-morada-deshilachada', 'Camisa morada de bajo deshilachado', 'morado', 169900, 'camisa', 'Algodón grueso', 'Holgada, hombro caído'],
  ['camisa-cafe-asimetrica', 'Camisa café asimétrica', 'cafe', 179900, 'camisa', 'Sarga de algodón', 'Holgada, cierre asimétrico'],
  ['overshirt-denim-negro', 'Overshirt de denim negro con bolsillos', 'morado', 259900, 'chaqueta', 'Denim negro', 'Ancha, bolsillos de fuelle'],
  ['camisa-pana-marino', 'Camisa de pana marino', 'azul', 189900, 'camisa', 'Pana', 'Holgada, hombro caído'],
  ['camisa-oliva-corta', 'Camisa oliva de manga corta', 'cafe', 159900, 'camisa', 'Sarga de algodón', 'Cuadrada, cuello alto'],
  ['camisa-morada-bloques', 'Camisa morada en bloques', 'morado', 189900, 'camisa', 'Algodón en paneles', 'Holgada, bordes crudos'],
  ['camisa-larga-carbon', 'Camisa larga carbón', 'morado', 169900, 'camisa', 'Algodón', 'Larga, aberturas laterales'],
  ['camisa-utilitaria-cafe', 'Camisa utilitaria café', 'cafe', 189900, 'camisa', 'Sarga de algodón', 'Holgada, bolsillos con correas'],
  ['overshirt-denim-lavado', 'Overshirt de denim lavado', 'morado', 259900, 'chaqueta', 'Denim negro lavado', 'Ancha, bolsillos en pecho y manga'],
  ['camiseta-boxy-marino', 'Camiseta boxy azul marino', 'azul', 109900, 'camiseta', 'Jersey de algodón grueso', 'Caja, manga larga a tres cuartos'],
  ['camisa-franela-cuadros', 'Camisa de franela a cuadros', 'morado', 179900, 'camisa', 'Franela', 'Holgada, parches y bajo deshilachado'],
  ['chaqueta-kimono-carbon', 'Chaqueta kimono carbón', 'morado', 229900, 'chaqueta', 'Algodón', 'Cruzada, cierre con lazos'],
]

export const NUEVOS = FILAS.map(([id, nombre, grupo, precio, tipo, material, calce]) => {
  const t = TIPOS[tipo]
  return {
    id, categoria: t.categoria, nuevo: true, nombre, de: t.de, fon: t.fon, precio, tallas: t.tallas, grupo,
    imgs: imgsDe(id), unikat: null, material, calce,
  }
})
