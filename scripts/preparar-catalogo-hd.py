"""Corta las hojas nuevas (pantalones, calzado, camisetas, camisas) a resolución nativa.
Salida: public/img/catalogo/<hoja>-<NN>.webp (4:5, ampliación 1.15x, WebP calidad 92).
Uso: python scripts/preparar-catalogo-hd.py   (desde katz-web/)
"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))
from hd import extraer, extraer_cuadricula, extraer_pares, componer_conjunto

ORIGEN = Path("../identidad/katz/imagenes-prototipo")
SALIDA = Path("public/img/catalogo")
SALIDA.mkdir(parents=True, exist_ok=True)

# clave: (archivo, método, parámetros)
HOJAS = {
    "pantalones": ("hoja-pantalones.jpg", "componentes", {}),
    "calzado": ("hoja-calzado.jpg", "componentes", {}),
    "camisetas-estampadas": ("hoja-camisetas-estampadas.jpg", "pares", {}),  # cada casilla trae frente y espalda: se separan
    "camisetas-lisas": ("hoja-camisetas-lisas-y-tecnicas.jpg", "cuadricula", {"columnas": 3, "filas": 4}),
    "camisas": ("hoja-camisas-y-overshirts.jpg", "componentes", {}),
}

# Las 15 prendas de la hoja de frentes (la más nítida: ~330-540 px por prenda) -> <id>-hd.webp
FRENTES = ["puffer", "abrigo", "parka", "chaleco", "hoodie", "sudadera", "camiseta", "camisa",
           "cargo", "jeans", "shorts", "gorra", "bufanda", "bolso", "botas"]


def frentes():
    piezas = extraer(ORIGEN / "hoja-15-prendas-frente.jpg", dilatar=5)
    assert len(piezas) == len(FRENTES), f"se esperaban {len(FRENTES)} prendas y salieron {len(piezas)}"
    for id_, img in zip(FRENTES, componer_conjunto(piezas)):
        img.save(Path("public/img") / f"{id_}-hd.webp", "WEBP", quality=92)
    print("frentes", len(piezas), "lienzo", img.size)


if __name__ == "__main__":
    frentes()
    for clave, (archivo, metodo, params) in HOJAS.items():
        ruta = ORIGEN / archivo
        piezas = {"cuadricula": extraer_cuadricula, "pares": extraer_pares}.get(metodo, extraer)(ruta, **params)
        for i, img in enumerate(componer_conjunto(piezas), 1):
            img.save(SALIDA / f"{clave}-{i:02d}.webp", "WEBP", quality=92)
        print(clave, len(piezas), "recortes; lienzo", img.size)
