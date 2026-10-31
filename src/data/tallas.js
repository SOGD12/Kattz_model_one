// Guías de tallas de Katz, una por tipo de prenda. Medidas en centímetros, tomadas con la prenda en plano
// (tienda de prueba: valores orientativos). Cada tabla se indexa por la talla que usa el producto (p.tallas).

const COMO_MEDIR = {
  pecho: 'Pecho: mide de axila a axila con la prenda en plano.',
  largo: 'Largo: desde el punto más alto del hombro hasta el borde inferior.',
  manga: 'Manga: desde el hombro hasta el puño.',
  cintura: 'Cintura: mide el borde superior del pantalón en plano, de lado a lado, y duplica.',
  pie: 'Pie: apoya el talón en una pared, mide hasta el dedo más largo y suma 0,5 cm.',
}

const por = (tallas, valores) => Object.fromEntries(tallas.map((t, i) => [t, valores[i]]))
const T = ['S', 'M', 'L', 'XL']
const JEANS = ['28', '30', '32', '34', '36']
const CALZADO = ['38', '39', '40', '41', '42', '43']

const GUIAS = {
  camisetas: {
    titulo: 'Camisetas oversize',
    nota: 'Corte caja con hombro caído: ya es ancho. Si dudas, elige tu talla de siempre.',
    filas: [
      ['Ancho de pecho', por(T, [56, 58, 60, 62])],
      ['Largo', por(T, [70, 72, 74, 76])],
      ['Hombro caído', por(T, [54, 56, 58, 60])],
      ['Tu pecho (cuerpo)', por(T, ['88–96', '96–104', '104–112', '112–120'])],
    ],
    consejos: [COMO_MEDIR.pecho, COMO_MEDIR.largo],
  },
  camisas: {
    titulo: 'Camisas y overshirts',
    nota: 'Holgadas, con hombro caído. Para llevarla ajustada, baja una talla.',
    filas: [
      ['Ancho de pecho', por(T, [58, 60, 62, 64])],
      ['Largo', por(T, [74, 76, 78, 80])],
      ['Manga', por(T, [62, 63, 64, 65])],
      ['Tu pecho (cuerpo)', por(T, ['88–96', '96–104', '104–112', '112–120'])],
    ],
    consejos: [COMO_MEDIR.pecho, COMO_MEDIR.largo, COMO_MEDIR.manga],
  },
  buzos: {
    titulo: 'Hoodies y sudaderas',
    nota: 'Felpa pesada y corte ancho. Con capas debajo, sube una talla.',
    filas: [
      ['Ancho de pecho', por(T, [62, 64, 66, 68])],
      ['Largo', por(T, [68, 70, 72, 74])],
      ['Manga', por(T, [62, 63, 64, 65])],
      ['Tu pecho (cuerpo)', por(T, ['88–96', '96–104', '104–112', '112–120'])],
    ],
    consejos: [COMO_MEDIR.pecho, COMO_MEDIR.largo, COMO_MEDIR.manga],
  },
  abrigos: {
    titulo: 'Abrigos, chaquetas y chalecos',
    nota: 'Pensados para llevar capas debajo. El abrigo largo y la parka caen más abajo que el largo indicado.',
    filas: [
      ['Ancho de pecho', por(T, [64, 66, 68, 70])],
      ['Largo (chaqueta y chaleco)', por(T, [66, 68, 70, 72])],
      ['Largo (abrigo y parka)', por(T, [100, 104, 108, 112])],
      ['Manga', por(T, [64, 65, 66, 67])],
    ],
    consejos: [COMO_MEDIR.pecho, COMO_MEDIR.largo, COMO_MEDIR.manga],
  },
  pantalones: {
    titulo: 'Pantalones, cargo y buzos',
    nota: 'Pierna ancha y tiro suelto. Los pantalones con cintura elástica se estiran hasta 10 cm más.',
    filas: [
      ['Cintura (plana ×2)', por(T, [76, 82, 88, 94])],
      ['Cadera', por(T, [112, 118, 124, 130])],
      ['Largo de pierna', por(T, [100, 102, 104, 106])],
      ['Abertura del bajo', por(T, [24, 25, 26, 27])],
    ],
    consejos: [COMO_MEDIR.cintura],
  },
  shorts: {
    titulo: 'Shorts',
    nota: 'Hasta la rodilla y anchos.',
    filas: [
      ['Cintura (plana ×2)', por(T, [76, 82, 88, 94])],
      ['Cadera', por(T, [112, 118, 124, 130])],
      ['Largo', por(T, [52, 54, 56, 58])],
    ],
    consejos: [COMO_MEDIR.cintura],
  },
  jeans: {
    titulo: 'Jeans anchos',
    nota: 'Baggy y de tiro bajo. La talla es la cintura en pulgadas.',
    filas: [
      ['Cintura (cm)', por(JEANS, [71, 76, 81, 86, 91])],
      ['Cadera', por(JEANS, [112, 116, 121, 126, 131])],
      ['Largo de pierna', por(JEANS, [78, 79, 80, 81, 82])],
      ['Abertura del bajo', por(JEANS, [24, 25, 25.5, 26, 27])],
    ],
    consejos: [COMO_MEDIR.cintura],
  },
  calzado: {
    titulo: 'Zapatillas y botas',
    nota: 'Tallas europeas (EU). Si estás entre dos tallas, elige la mayor.',
    filas: [
      ['Largo del pie (cm)', por(CALZADO, [24, 24.8, 25.4, 26.2, 26.8, 27.6])],
      ['Equivalencia US (hombre)', por(CALZADO, [5.5, 6.5, 7, 8, 9, 10])],
      ['Equivalencia UK', por(CALZADO, [5, 6, 6.5, 7.5, 8.5, 9.5])],
    ],
    consejos: [COMO_MEDIR.pie],
  },
  gorra: {
    titulo: 'Gorra',
    nota: 'Talla única, con ajuste trasero.',
    columnas: ['Única'],
    filas: [['Contorno de cabeza', { Única: '54–60' }], ['Largo de visera', { Única: '7' }]],
    consejos: ['Contorno: mide alrededor de la cabeza, por encima de las cejas.'],
  },
  bolso: {
    titulo: 'Bolso cruzado',
    nota: 'Talla única, con correa ajustable.',
    columnas: ['Única'],
    filas: [['Ancho', { Única: '26' }], ['Alto', { Única: '20' }], ['Fondo', { Única: '8' }], ['Correa (ajustable)', { Única: '60–120' }]],
    consejos: [],
  },
  bufanda: {
    titulo: 'Bufanda',
    nota: 'Talla única, de lana gruesa con flecos.',
    columnas: ['Única'],
    filas: [['Largo', { Única: '190' }], ['Ancho', { Única: '32' }]],
    consejos: [],
  },
}

// Devuelve la guía que corresponde a una prenda: tallas (columnas), filas de medidas, nota y cómo medir
export function guiaDe(p) {
  const clave = GUIAS[p.id] ? p.id : p.id.startsWith('shorts') ? 'shorts' : p.categoria
  const g = GUIAS[clave] || GUIAS.camisetas
  return {
    titulo: g.titulo,
    nota: g.nota,
    tallas: g.columnas || p.tallas,
    filas: g.filas.map(([medida, valores]) => ({ medida, valores })),
    consejos: g.consejos,
  }
}
