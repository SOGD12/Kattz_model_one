"""Corta la hoja de 8 fotos editoriales (4 columnas x 2 filas) en 8 casillas, sin escalar.
La hoja debe estar en identidad/katz/imagenes-prototipo/editorial-8-fotos.jpg
Orden de las casillas (de izquierda a derecha y de arriba a abajo):
  1 camisetas · 2 abrigos y chaquetas · 3 jeans · 4 camisas · 5 pantalones · 6 hoodies y sudaderas · 7 calzado · 8 accesorios
Uso: python scripts/preparar-editorial.py   (desde katz-web/)
"""
from pathlib import Path
from PIL import Image

HOJA = Path("../identidad/katz/imagenes-prototipo/editorial-8-fotos.jpg")
SALIDA = Path("public/img/editorial")
SALIDA.mkdir(parents=True, exist_ok=True)

if not HOJA.exists():
    raise SystemExit(f"Falta la hoja: {HOJA.resolve()}")

img = Image.open(HOJA).convert("RGB")
ancho, alto = img.width / 4, img.height / 2
n = 0
for fila in range(2):
    for col in range(4):
        n += 1
        casilla = img.crop((round(col * ancho), round(fila * alto), round((col + 1) * ancho), round((fila + 1) * alto)))
        casilla.save(SALIDA / f"tile-{n:02d}.webp", "WEBP", quality=92)
print("ok", n, "casillas de", casilla.size)
