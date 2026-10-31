"""Convierte la imagen de la ventana emergente de bienvenida a public/img/popup/bienvenida.webp.
La imagen debe guardarse en identidad/katz/imagenes-prototipo/popup-bienvenida.jpg (trae el texto dentro).
Después, en src/data/imagenes.json pon home.popup = { "imagen": "popup/bienvenida", "textoEnImagen": true }
y ejecuta python scripts/generar-imagenes-json.py. Uso (desde katz-web/):  python scripts/preparar-popup.py
"""
from pathlib import Path
from PIL import Image

ORIGEN = Path("../identidad/katz/imagenes-prototipo/popup-bienvenida.jpg")
DESTINO = Path("public/img/popup/bienvenida.webp")
if not ORIGEN.exists():
    raise SystemExit(f"Falta la imagen: {ORIGEN.resolve()}")
DESTINO.parent.mkdir(parents=True, exist_ok=True)
img = Image.open(ORIGEN).convert("RGB")
if img.width > 1600:
    img = img.resize((1600, round(img.height * 1600 / img.width)), Image.LANCZOS)
img.save(DESTINO, "WEBP", quality=90)
print("ok", img.size)
