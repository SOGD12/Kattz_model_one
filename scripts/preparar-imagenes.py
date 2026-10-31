"""Recorta las imágenes de producto a 4:5 centradas en la prenda y las guarda en WebP.
Uso: python scripts/preparar-imagenes.py   (desde katz-web/)
"""
from pathlib import Path
from PIL import Image, ImageChops
import statistics

ORIGEN = Path("../identidad/katz/imagenes-prototipo")
DESTINO = Path("public/img")
DESTINO.mkdir(parents=True, exist_ok=True)

SALIDAS = {
    "puffer": "puffer-negra-brillante-frente-vertical.jpg",
    "puffer-3-4": "puffer-generada-3-4.jpg",
}
ANCHO, ALTO = 960, 1200
RELLENO = 1.14


def fondo(img):
    w, h = img.size
    muestras = [img.getpixel(p) for p in [(4, 4), (w - 5, 4), (4, h - 5), (w - 5, h - 5), (w // 2, 4), (w // 2, h - 5)]]
    return tuple(int(statistics.median(c[i] for c in muestras)) for i in range(3))


def recortar(img):
    bg = fondo(img)
    dif = ImageChops.difference(img, Image.new("RGB", img.size, bg)).convert("L").point(lambda v: 255 if v > 22 else 0)
    caja = dif.getbbox() or (0, 0, *img.size)
    cx, cy = (caja[0] + caja[2]) / 2, (caja[1] + caja[3]) / 2
    bw, bh = (caja[2] - caja[0]) * RELLENO, (caja[3] - caja[1]) * RELLENO
    h = max(bh, bw * 5 / 4)
    w = h * 4 / 5
    lienzo = Image.new("RGB", (round(w), round(h)), bg)
    lienzo.paste(img, (round(w / 2 - cx), round(h / 2 - cy)))
    return lienzo.resize((ANCHO, ALTO), Image.LANCZOS)


for nombre, archivo in SALIDAS.items():
    img = Image.open(ORIGEN / archivo).convert("RGB")
    recortar(img).save(DESTINO / f"{nombre}.webp", "WEBP", quality=82)
    print("ok", nombre)
