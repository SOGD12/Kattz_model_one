"""Corta las dos hojas de fotos de modelos (5 columnas x 3 filas, 15 fotos cada una) en 30 fotos 4:5.
Las hojas se guardan en identidad/katz/imagenes-prototipo/looks-1.jpg y looks-2.jpg.
Salida: public/img/looks/look-01..30.webp (576x720, escaladas 1.5x con Lanczos). Uso: python scripts/preparar-looks.py   (desde katz-web/)
"""
from pathlib import Path
from PIL import Image, ImageFilter

HOJAS = [Path("../identidad/katz/imagenes-prototipo/looks-1.jpg"), Path("../identidad/katz/imagenes-prototipo/looks-2.jpg")]
SALIDA = Path("public/img/looks")
SALIDA.mkdir(parents=True, exist_ok=True)
COLS = [(0, 398), (402, 798), (802, 1198), (1202, 1598), (1602, 2000)]
FILAS = [(0, 495), (499, 995), (1001, 1485)]
n = 0
for hoja in HOJAS:
    if not hoja.exists():
        raise SystemExit(f"Falta la hoja: {hoja.resolve()}")
    img = Image.open(hoja).convert("RGB")
    for y0, y1 in FILAS:
        for x0, x1 in COLS:
            n += 1
            c = img.crop((x0 + 2, y0 + 2, x1 - 2, y1 - 2))
            w, h = c.size
            if w / h > 0.8:   # recorte a 4:5 desde el centro
                nw = round(h * 0.8); c = c.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
            else:
                nh = round(w / 0.8); c = c.crop((0, 0, w, nh))
            c = c.resize((576, 720), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))  # 1.5x, nitidez suave
            c.save(SALIDA / f"look-{n:02d}.webp", "WEBP", quality=93)
print("ok", n, c.size)
