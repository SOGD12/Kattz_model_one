"""Corta la hoja de vistas por prenda (identidad/katz/imagenes-prototipo/hoja-vistas-por-prenda.jpg)
en imágenes 4:5 por vista y en los 8 fotogramas del giro de la puffer.
Uso: python scripts/preparar-hojas.py   (desde katz-web/)

Aviso: cada celda de la hoja mide ~170-250 px, así que se amplía 3-4x. Es suficiente para el
prototipo; para publicar hacen falta vistas generadas por separado en alta resolución.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

HOJA = Path("../identidad/katz/imagenes-prototipo/hoja-vistas-por-prenda.jpg")
ALTA = Path("../identidad/katz/imagenes-alta")
SALIDA = Path("public/img")
GIRO = SALIDA / "giro"
GIRO.mkdir(parents=True, exist_ok=True)

COLS = [0, 197, 374, 561, 750, 945, 1134, 1303, 1493]
FILAS = [0, 255, 537, 772, 1000, 1228, 1484, 1645, 1840, 2000]

# producto -> (fila, columna inicial, nombres de salida por vista)
PRENDAS = {
    "abrigo": (1, 0, ["abrigo-1", "abrigo-2", "abrigo-3", "abrigo-4"]),
    "parka": (1, 4, ["parka-1", "parka-2", "parka-3", "parka-4"]),
    "chaleco": (2, 0, ["chaleco-1", "chaleco-2", "chaleco-3", "chaleco-4"]),
    "hoodie": (2, 4, ["hoodie-1", "hoodie-2", "hoodie-3", "hoodie-4"]),
    "sudadera": (3, 0, ["sudadera-1", "sudadera-2", "sudadera-3", "sudadera-4"]),
    "camiseta": (4, 0, ["camiseta-1", "camiseta-2", "camiseta-3", "camiseta-4"]),
    "camisa": (4, 4, ["camisa-1", "camisa-2", "camisa-3", "camisa-4"]),
    "cargo": (5, 0, ["cargo-1", "cargo-2", "cargo-3", "cargo-4"]),
    "jeans": (5, 4, ["jeans-1", "jeans-2", "jeans-3", "jeans-4"]),
    "shorts": (6, 0, ["shorts-1", "shorts-2", "shorts-3", "shorts-4"]),
    "gorra": (6, 4, ["gorra-1", "gorra-2", "gorra-3", "gorra-4"]),
    "bufanda": (7, 0, ["bufanda-1", "bufanda-2", "bufanda-3"]),  # frente, anudada, detalle de tela
    "bolso": (7, 4, ["bolso-1", "bolso-2", "bolso-3", "bolso-4"]),
    "botas": (8, 4, ["botas-1", "botas-2", "botas-3", "botas-4"]),
    # solo vistas sueltas de la puffer (frente y 3/4 vienen de preparar-imagenes.py)
    "puffer": (0, 2, ["puffer-lado"]),
}
PUFFER_ESPALDA = (0, 4, "puffer-espalda")

hoja = Image.open(HOJA).convert("RGB")
arr = np.asarray(hoja).astype(int)
FONDO = tuple(int(v) for v in np.median(arr.reshape(-1, 3), axis=0))


def celda(fila, col):
    return hoja.crop((COLS[col], FILAS[fila], COLS[col + 1], FILAS[fila + 1]))


def caja(img):
    a = np.asarray(img).astype(int)
    m = np.abs(a - np.array(FONDO)).sum(axis=2) > 50
    ys, xs = np.where(m)
    if not len(xs):
        return (0, 0, img.width, img.height)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def alta(nombre):
    """Devuelve la imagen en alta resolución si existe (png/jpg/jpeg/webp), si no None."""
    for ext in ("png", "jpg", "jpeg", "webp"):
        f = ALTA / f"{nombre}.{ext}"
        if f.exists():
            return Image.open(f).convert("RGB")
    return None


def caja_fondo(img):
    """Caja de la prenda midiendo contra el color de las esquinas de ESA imagen."""
    a = np.asarray(img).astype(int)
    h, w = a.shape[:2]
    bg = np.median(np.array([a[2, 2], a[2, w - 3], a[h - 3, 2], a[h - 3, w - 3]]), axis=0)
    m = np.abs(a - bg).sum(axis=2) > 50
    ys, xs = np.where(m)
    if not len(xs):
        return (0, 0, w, h), tuple(int(v) for v in bg)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1), tuple(int(v) for v in bg)


def componer(prenda, ancho, alto, escala, base, fondo=FONDO):
    pw, ph = round(prenda.width * escala), round(prenda.height * escala)
    prenda = prenda.resize((pw, ph), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.4, 70, 2))
    lienzo = Image.new("RGB", (ancho, alto), fondo)
    lienzo.paste(prenda, ((ancho - pw) // 2, base - ph))
    return lienzo


def procesar_prenda(nombre, fila, col0, salidas):
    altas = [alta(sal) for sal in salidas]
    if all(a is not None for a in altas):
        recs = []
        for a in altas:
            b, fondo = caja_fondo(a)
            recs.append((a.crop(b), fondo))
        mayor_alto = max(r.height for r, _ in recs)
        mayor_ancho = max(r.width for r, _ in recs)
        escala = min(1000 / mayor_alto, 860 / mayor_ancho)
        for (r, fondo), sal in zip(recs, salidas):
            componer(r, 960, 1200, escala, 1100, fondo).save(SALIDA / f"{sal}.webp", "WEBP", quality=86)
        print("ok (alta resolución)", nombre, len(salidas))
        return
    recortes = []
    for k in range(len(salidas)):
        c = celda(fila, col0 + k)
        b = caja(c)
        recortes.append(c.crop(b))
    mayor_alto = max(r.height for r in recortes)
    mayor_ancho = max(r.width for r in recortes)
    escala = min(920 / mayor_alto, 800 / mayor_ancho)
    for r, sal in zip(recortes, salidas):
        # la bufanda lleva un detalle de tela cuadrado: cada vista con su propia escala
        e = min(900 / r.height, 780 / r.width, 5.0) if nombre == "bufanda" else escala
        componer(r, 960, 1200, e, 1090 if nombre != "bufanda" else 1020).save(SALIDA / f"{sal}.webp", "WEBP", quality=82)
    print("ok", nombre, len(salidas), "x", round(escala, 1))


for nombre, (fila, col0, salidas) in PRENDAS.items():
    procesar_prenda(nombre, fila, col0, salidas)

# Espalda de la puffer, a la misma escala que la vista de lado
f, c0, sal = PUFFER_ESPALDA
procesar_prenda("puffer-espalda", f, c0, [sal])

def giro_alta():
    imgs = [alta(f"puffer-giro-{k}") for k in range(8)]
    if not all(i is not None for i in imgs):
        return False
    recs = []
    for i in imgs:
        b, fondo = caja_fondo(i)
        recs.append((i.crop(b), fondo))
    escala = min(780 / max(r.height for r, _ in recs), 780 / max(r.width for r, _ in recs))
    for k, (r, fondo) in enumerate(recs):
        lienzo = componer(r, 900, 900, escala, 830, fondo)
        a = np.asarray(lienzo).astype(np.float32)
        a = np.clip(a * (255.0 / np.array(fondo, dtype=np.float32)), 0, 255)
        Image.fromarray(a.astype(np.uint8)).save(GIRO / f"f{k}.webp", "WEBP", quality=88)
    print("ok giro (alta resolución)")
    return True


# Giro 360° de la puffer: 8 ángulos (0, 45, ... 315), cuadrados, fondo normalizado a blanco
if giro_alta():
    raise SystemExit(0)
recortes = [celda(0, k).crop(caja(celda(0, k))) for k in range(8)]
mayor_alto = max(r.height for r in recortes)
mayor_ancho = max(r.width for r in recortes)
escala = min(780 / mayor_alto, 780 / mayor_ancho)
for k, r in enumerate(recortes):
    lienzo = componer(r, 900, 900, escala, 830)
    a = np.asarray(lienzo).astype(np.float32)
    a = np.clip(a * (255.0 / np.array(FONDO, dtype=np.float32)), 0, 255)  # fondo -> blanco puro
    Image.fromarray(a.astype(np.uint8)).save(GIRO / f"f{k}.webp", "WEBP", quality=86)
print("ok giro 8 fotogramas, escala", round(escala, 1))
