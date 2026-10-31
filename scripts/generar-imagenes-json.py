"""Registro único de imágenes: src/data/imagenes.json.
 - `productos` y `home` se editan a mano (qué foto va en cada prenda y en cada sección del inicio).
 - `archivos` lo escribe este script: todas las imágenes de public/img con su tamaño (ancho, alto).
Revisa que toda foto referenciada exista y avisa de las que ningún producto ni sección usa.
Uso (desde katz-web/):  python scripts/generar-imagenes-json.py
"""
import json
from pathlib import Path
from PIL import Image

RAIZ = Path("public/img")
JSON = Path("src/data/imagenes.json")
datos = json.loads(JSON.read_text(encoding="utf8"))

archivos = {}
for f in sorted(RAIZ.rglob("*.webp")):
    clave = f.relative_to(RAIZ).with_suffix("").as_posix()
    with Image.open(f) as im:
        archivos[clave] = [im.width, im.height]
datos["archivos"] = archivos

def claves(valor):
    if isinstance(valor, str):
        yield valor
    elif isinstance(valor, list):
        for v in valor:
            yield from claves(v)
    elif isinstance(valor, dict):
        for v in valor.values():
            yield from claves(v)

usadas = set(claves(datos["productos"])) | set(claves(datos["home"].get("galeria", []))) | set(claves(datos["home"].get("giro", []))) \
    | set(claves(datos["home"].get("mosaico", {}))) | {datos["home"]["banner"], datos["home"]["popup"]["imagen"]}
faltan = sorted(k for k in usadas if k not in archivos)
sin_uso = sorted(k for k in archivos if k not in usadas)
datos["resumen"] = {"archivos": len(archivos), "usadas": len(usadas & set(archivos)), "sinUsar": len(sin_uso)}
JSON.write_text(json.dumps(datos, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
print(f"{len(archivos)} imágenes · {len(usadas & set(archivos))} usadas · {len(sin_uso)} sin usar")
if faltan:
    print("FALTAN (referenciadas pero no existen):", *faltan, sep="\n  ")
    raise SystemExit(1)
