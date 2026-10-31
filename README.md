# katz-web

Web de prueba de Katz (React + Vite). Diseño y decisiones en `../identidad/katz/` (empieza por `PROPUESTA-DISENO.md`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
python scripts/preparar-imagenes.py   # puffer (frente y 3/4) a 4:5
python scripts/preparar-hojas.py      # resto de prendas y giro 360° desde la hoja de vistas (celdas de ~200 px: bajas)
python scripts/preparar-catalogo-hd.py # hojas nuevas a resolución nativa (sin ampliar de más) y fotos principales <id>-hd
```

Librerías: Lenis, GSAP + ScrollTrigger, Motion, Zdog (logo), Oswald. Carrito simulado en JS (localStorage), sin servidor.

## Hecho
Tienda con rutas por hash (`#/`, `#/tienda?cat=…&color=…&nuevo=1`, `#/producto/:id`).

**Inicio al estilo HitHats** (referencia: github.com/SOGD12/HitHats): banner de dos paneles de foto con titular centrado letra por letra (GSAP SplitText) y botón blanco, marquesina roja de dos filas, categorías, novedades, giro 360° de la puffer, banda roja de declaración, acordeón, galería de tres columnas fijada al scroll (las laterales bajan y la central sube) y cierre gigante. Menú a pantalla completa en móvil.

**Cómo se muestra la ropa en el inicio** (idea tomada de trueshop.co, sin cambiar la identidad de Katz): mosaico de 8 casillas (4 categorías y 4 colecciones con su tinte), carrusel de las 15 prendas con segunda vista al pasar el cursor, tallas visibles y botón de bolsa para añadir rápido.

**Ficha de producto** (estructura de una referencia de tienda, con la identidad de Katz): miniaturas verticales, foto grande deslizable con flechas, contador y lupa (zoom), color, talla con guía, botón de añadir con corazón (favoritos en localStorage), tres notas de confianza, pestañas (Detalles, Materiales, Talla y calce, Envíos y devoluciones) con imagen de detalle, "Te puede gustar" y barra fija de compra en móvil.

Catálogo con filtros y orden, carrito y recibo simulados, pie y grano. Lenis solo en escritorio.

Las imágenes salen de la hoja generada `hoja-vistas-por-prenda.jpg` (3-4 vistas por prenda y 8 ángulos de la puffer para el giro). Se cortan con `scripts/preparar-hojas.py`. Son de baja resolución (celdas de ~200 px ampliadas): vale para el prototipo.

## Catálogo
73 prendas: las 15 de lanzamiento (`src/data/productos.js`) y 58 más del catálogo ampliado (`src/data/catalogo-nuevo.js`: pantalones, calzado, camisetas estampadas y lisas, camisas y overshirts). Hay 5 categorías (abrigos, parte superior, parte inferior, calzado, accesorios) y 4 colecciones por color. Las imágenes nuevas están en `public/img/catalogo/` a resolución nativa.

## Registro de imágenes
Todas las imágenes están ordenadas en un solo JSON: `src/data/imagenes.json`. Las claves son rutas dentro de `public/img` sin extensión (`catalogo/camisas-02`, `looks/look-07`).
- `productos`: las fotos de cada prenda (la primera es la principal, la segunda sale al pasar el cursor).
- `home`: banner, foto de cada apartado del mosaico, las 3 columnas de la galería «Mira cómo luce nuestra ropa» y los fotogramas del giro 360°.
- `archivos`: todas las imágenes con su tamaño; lo escribe `python scripts/generar-imagenes-json.py`, que también avisa de fotos que faltan o que nadie usa.
El código no escribe rutas a mano: usa `urlImg`, `imgsDe` e `IMG_HOME` de `src/lib/imagenes.js`. Para cambiar una foto, edita el JSON y ejecuta el script.

## Apartados por tipo de prenda
Cada tipo de prenda tiene su propia página (`#/tienda?cat=camisetas`), con título, subtítulo, subfiltros (`&sub=estampadas`), filtro por colección y orden. Hay 8 apartados (camisetas, camisas, hoodies y sudaderas, abrigos y chaquetas, pantalones, jeans, calzado, accesorios); la cabecera muestra una tira con todos y el inicio tiene una cuadrícula de 4 fotos por 2 filas. Las fotos editoriales de esa cuadrícula salen de `identidad/katz/imagenes-prototipo/editorial-8-fotos.jpg` con `python scripts/preparar-editorial.py` (mientras no esté, usa fotos de prendas).

## Pendiente
Imágenes en alta resolución (una por vista), retirar el parche de la manga de la puffer, sección de calidad y lookbook, vuelo de la imagen al carrito.
