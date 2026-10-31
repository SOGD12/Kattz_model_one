// 15 prendas de lanzamiento + catálogo ampliado (catalogo-nuevo.js). Precios en COP, ficticios (tienda de prueba).
// `imgs` sale de src/data/imagenes.json (la primera es la principal, la segunda aparece al pasar el cursor; [] = foto pendiente). Materiales y calce son provisionales.

import { NUEVOS } from './catalogo-nuevo'
import { imgsDe } from '../lib/imagenes'

const T = ['S', 'M', 'L', 'XL']
const UNICA = ['Única']

export const GRUPOS = [
  { id: 'rojo', titulo: 'Edición limitada', nota: 'Pocas unidades. Sin reposición.' },
  { id: 'cafe', titulo: 'Abrigo y tierra', nota: 'Lana, algodón grueso, capucha.' },
  { id: 'azul', titulo: 'Técnico', nota: 'Tejidos que aguantan el día.' },
  { id: 'morado', titulo: 'Atmósfera', nota: 'Para la noche y lo que viene después.' },
]

const BASE = [
  { id: 'puffer', categoria: 'abrigos', nuevo: true, nombre: 'Puffer con capucha', de: 'Jacke', fon: 'YA-ke', precio: 489900, tallas: T, grupo: 'rojo',
    unikat: { de: 'Schatten', fon: 'SHA-ten', es: 'sombra' }, material: 'Nailon brillante, relleno acolchado', calce: 'Ancho, capucha desmontable' },
  { id: 'bolso', categoria: 'accesorios', nuevo: true, nombre: 'Bolso', de: 'Tasche', fon: 'TA-she', precio: 149900, tallas: UNICA, grupo: 'rojo',
    unikat: null, material: 'Nailon negro, cremallera roja', calce: 'Cruzado, correa ajustable' },
  { id: 'botas', categoria: 'calzado', nuevo: true, nombre: 'Botas', de: 'Stiefel', fon: 'SHTI-fel', precio: 329900, tallas: ['38', '39', '40', '41', '42', '43'], grupo: 'rojo',
    unikat: { de: 'Eisen', fon: 'AI-sen', es: 'hierro' }, material: 'Cuero negro, suela gruesa', calce: 'Caña media, cordones burdeos' },

  { id: 'abrigo', categoria: 'abrigos', nuevo: true, nombre: 'Abrigo largo', de: 'Mantel', fon: 'MAN-tel', precio: 429900, tallas: T, grupo: 'cafe',
    unikat: { de: 'Nebel', fon: 'NE-bel', es: 'niebla' }, material: 'Mezcla de lana, forro suave', calce: 'Largo bajo la rodilla, ancho' },
  { id: 'parka', categoria: 'abrigos', nuevo: false, nombre: 'Parka', de: 'Parka', fon: 'PAR-ka', precio: 459900, tallas: T, grupo: 'cafe',
    unikat: { de: 'Sturm', fon: 'SHTURM', es: 'tormenta' }, material: 'Algodón técnico, capucha', calce: 'Ancho, bolsillos grandes' },
  { id: 'camisa', categoria: 'superior', nuevo: false, nombre: 'Camisa', de: 'Hemd', fon: 'HEMT', precio: 139900, tallas: T, grupo: 'cafe',
    unikat: null, material: 'Sarga de algodón', calce: 'Holgada, manga larga' },
  { id: 'bufanda', categoria: 'accesorios', nuevo: false, nombre: 'Bufanda', de: 'Schal', fon: 'SHAL', precio: 89900, tallas: UNICA, grupo: 'cafe',
    unikat: null, material: 'Lana gruesa', calce: 'Larga, con flecos' },

  { id: 'chaleco', categoria: 'abrigos', nuevo: false, nombre: 'Chaleco acolchado', de: 'Weste', fon: 'VES-te', precio: 249900, tallas: T, grupo: 'azul',
    unikat: null, material: 'Nailon acolchado', calce: 'Sin mangas, cuello alto' },
  { id: 'camiseta', categoria: 'superior', nuevo: false, nombre: 'Camiseta oversize', de: 'T-Shirt', fon: 'ti-SHERT', precio: 89900, tallas: T, grupo: 'azul',
    unikat: null, material: 'Jersey de algodón grueso', calce: 'Caja, hombro caído' },
  { id: 'cargo', categoria: 'inferior', nuevo: true, nombre: 'Pantalón cargo', de: 'Hose', fon: 'HO-se', precio: 199900, tallas: T, grupo: 'azul',
    unikat: { de: 'Kralle', fon: 'KRA-le', es: 'garra' }, material: 'Ripstop azul marino', calce: 'Pierna ancha, bolsillos laterales' },
  { id: 'jeans', categoria: 'inferior', nuevo: false, nombre: 'Jeans anchos', de: 'Jeans', fon: 'YINS', precio: 219900, tallas: ['28', '30', '32', '34', '36'], grupo: 'azul',
    unikat: null, material: 'Denim índigo oscuro', calce: 'Baggy, tiro bajo' },
  { id: 'shorts', categoria: 'inferior', nuevo: false, nombre: 'Shorts', de: 'Shorts', fon: 'SHORTS', precio: 119900, tallas: T, grupo: 'azul',
    unikat: null, material: 'Sarga de algodón', calce: 'Hasta la rodilla, ancho' },

  { id: 'hoodie', categoria: 'superior', nuevo: true, nombre: 'Hoodie oversize', de: 'Kapuze', fon: 'ka-PU-tse', precio: 189900, tallas: T, grupo: 'morado',
    unikat: { de: 'Mond', fon: 'MONT', es: 'luna' }, material: 'Felpa pesada de algodón', calce: 'Hombro caído, sin estampado' },
  { id: 'sudadera', categoria: 'superior', nuevo: false, nombre: 'Sudadera', de: 'Pulli', fon: 'PU-li', precio: 159900, tallas: T, grupo: 'morado',
    unikat: null, material: 'Felpa pesada de algodón', calce: 'Cuello redondo, ancho' },
  { id: 'gorra', categoria: 'accesorios', nuevo: false, nombre: 'Gorra', de: 'Kappe', fon: 'KA-pe', precio: 79900, tallas: UNICA, grupo: 'morado',
    unikat: null, material: 'Algodón, seis paneles', calce: 'Visera curva, ajustable' },
]

// Apartados por tipo de prenda (cada uno con su propia página, como las colecciones de una tienda de ropa).
// `superior` es la etiqueta que se muestra bajo el título de la página.
export const CATEGORIAS = [
  { id: 'camisetas', titulo: 'Camisetas', superior: 'Superiores', de: 'T-Shirts' },
  { id: 'camisas', titulo: 'Camisas', superior: 'Superiores', de: 'Hemden' },
  { id: 'buzos', titulo: 'Hoodies y sudaderas', superior: 'Superiores', de: 'Pullis' },
  { id: 'abrigos', titulo: 'Abrigos y chaquetas', superior: 'Exteriores', de: 'Jacken' },
  { id: 'pantalones', titulo: 'Pantalones', superior: 'Inferiores', de: 'Hosen' },
  { id: 'jeans', titulo: 'Jeans', superior: 'Inferiores', de: 'Jeans' },
  { id: 'calzado', titulo: 'Calzado', superior: 'Calzado', de: 'Schuhe' },
  { id: 'accesorios', titulo: 'Accesorios', superior: 'Gorras, bufandas y bolsos', de: 'Extras' },
]

// Cada prenda va a su apartado según su identificador
function apartadoDe(p) {
  const id = p.id
  if (/^(puffer|abrigo|parka|chaleco|overshirt|chaqueta)/.test(id)) return 'abrigos'
  if (/^(hoodie|sudadera)/.test(id)) return 'buzos'
  if (/^camiseta/.test(id)) return 'camisetas'
  if (/^camisa/.test(id)) return 'camisas'
  if (/^(cargo|buzo-|pantalon|shorts)/.test(id)) return 'pantalones'
  if (/^jeans/.test(id)) return 'jeans'
  if (/^(zapatilla|botas)/.test(id)) return 'calzado'
  return 'accesorios'
}

// Subfiltros de cada apartado (la fila de enlaces bajo el título)
export const SUBFILTROS = {
  camisetas: [
    { id: 'basicas', titulo: 'Básicas', test: (p) => p.id === 'camiseta' || /basica/.test(p.id) },
    { id: 'estampadas', titulo: 'Estampadas', test: (p) => /^camiseta-lavada-/.test(p.id) && p.imgs.length > 1 },
    { id: 'lavadas', titulo: 'Lavadas', test: (p) => p.id === 'camiseta-lavada-carbon' },
    { id: 'tecnicas', titulo: 'Técnicas y patchwork', test: (p) => /patchwork|bolsillo|corte|asimetrica|boxy/.test(p.id) },
  ],
  camisas: [
    { id: 'lisas', titulo: 'Lisas', test: (p) => !/cuadros|bloques|utilitaria/.test(p.id) },
    { id: 'diseno', titulo: 'Con diseño', test: (p) => /cuadros|bloques|utilitaria|asimetrica|deshilachada/.test(p.id) },
  ],
  buzos: [
    { id: 'hoodies', titulo: 'Hoodies', test: (p) => /^hoodie/.test(p.id) },
    { id: 'sudaderas', titulo: 'Sudaderas', test: (p) => /^sudadera/.test(p.id) },
  ],
  abrigos: [
    { id: 'puffers', titulo: 'Puffers y chalecos', test: (p) => /^(puffer|chaleco)/.test(p.id) },
    { id: 'largos', titulo: 'Abrigos y parkas', test: (p) => /^(abrigo|parka)/.test(p.id) },
    { id: 'overshirts', titulo: 'Overshirts y chaquetas', test: (p) => /^(overshirt|chaqueta)/.test(p.id) },
  ],
  pantalones: [
    { id: 'cargo', titulo: 'Cargo', test: (p) => /^cargo/.test(p.id) },
    { id: 'buzos', titulo: 'Buzos', test: (p) => /^buzo-/.test(p.id) },
    { id: 'vestir', titulo: 'De vestir', test: (p) => /^pantalon/.test(p.id) },
    { id: 'shorts', titulo: 'Shorts', test: (p) => p.id === 'shorts' },
  ],
  jeans: [
    { id: 'azules', titulo: 'Azules', test: (p) => p.id === 'jeans' || /indigo/.test(p.id) },
    { id: 'oscuros', titulo: 'Negros y grises', test: (p) => /negro|gris/.test(p.id) },
  ],
  calzado: [
    { id: 'zapatillas', titulo: 'Zapatillas', test: (p) => /^zapatilla/.test(p.id) },
    { id: 'botas', titulo: 'Botas', test: (p) => /^botas/.test(p.id) },
  ],
  accesorios: [
    { id: 'gorras', titulo: 'Gorras', test: (p) => p.id === 'gorra' },
    { id: 'bufandas', titulo: 'Bufandas', test: (p) => p.id === 'bufanda' },
    { id: 'bolsos', titulo: 'Bolsos', test: (p) => p.id === 'bolso' },
  ],
}

// Las 15 prendas de lanzamiento primero y después el catálogo ampliado
export const PRODUCTOS = [...BASE, ...NUEVOS].map((p) => ({ ...p, imgs: imgsDe(p.id), categoria: apartadoDe(p) }))

export const porId = (id) => PRODUCTOS.find((p) => p.id === id)

export const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
})
