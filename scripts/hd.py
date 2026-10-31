"""Recorte de hojas de prendas a resolución nativa (sin ampliar de más).

Detecta cada prenda como un componente conexo (sin cuadrícula fija, sirve para hojas irregulares),
la recorta a su tamaño original y la centra en un lienzo 4:5. La ampliación máxima es 1.3x, así que
no se ve borrosa. Uso desde otros scripts: `from hd import extraer, componer`.
"""
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

LIENZO = (800, 1000)      # 4:5
AMPLIACION_MAX = 1.3
RELLENO = 0.88            # la prenda ocupa como mucho el 88 % del lienzo


def fondo_de(img):
    a = np.asarray(img.convert("RGB")).astype(int)
    h, w = a.shape[:2]
    muestras = np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3), a[-8:, :8].reshape(-1, 3), a[-8:, -8:].reshape(-1, 3)])
    return tuple(int(v) for v in np.median(muestras, axis=0))


def mascara(img, fondo, umbral=34):
    a = np.asarray(img.convert("RGB")).astype(int)
    return (np.abs(a - np.array(fondo)).sum(axis=2) > umbral)


def componentes(mk, paso=4, dilatar=13, area_min=900):
    """Cajas (x0, y0, x1, y1) en píxeles originales, ordenadas por filas y luego por columnas."""
    h, w = mk.shape
    pequeno = Image.fromarray((mk * 255).astype(np.uint8)).resize((w // paso, h // paso), Image.BOX)
    pequeno = pequeno.point(lambda v: 255 if v > 0 else 0).filter(ImageFilter.MaxFilter(dilatar))
    g = np.asarray(pequeno) > 0
    gh, gw = g.shape
    etiquetas = np.zeros((gh, gw), dtype=np.int32)
    cajas = []
    n = 0
    for y in range(gh):
        for x in range(gw):
            if g[y, x] and not etiquetas[y, x]:
                n += 1
                cola = deque([(y, x)])
                etiquetas[y, x] = n
                x0 = x1 = x
                y0 = y1 = y
                area = 0
                while cola:
                    cy, cx = cola.popleft()
                    area += 1
                    x0, x1, y0, y1 = min(x0, cx), max(x1, cx), min(y0, cy), max(y1, cy)
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < gh and 0 <= nx < gw and g[ny, nx] and not etiquetas[ny, nx]:
                            etiquetas[ny, nx] = n
                            cola.append((ny, nx))
                if area >= area_min // (paso * paso) * 4:
                    cajas.append((x0 * paso, y0 * paso, (x1 + 1) * paso, (y1 + 1) * paso))
    # orden de lectura: agrupa por filas según el centro vertical
    cajas.sort(key=lambda c: (c[1] + c[3]) / 2)
    filas, actual = [], []
    for c in cajas:
        if actual and abs((c[1] + c[3]) / 2 - np.mean([(k[1] + k[3]) / 2 for k in actual])) > 0.45 * (c[3] - c[1]):
            filas.append(actual)
            actual = []
        actual.append(c)
    if actual:
        filas.append(actual)
    return [c for fila in filas for c in sorted(fila, key=lambda c: c[0])]


def caja_ajustada(img, caja, fondo, margen=6):
    x0, y0, x1, y1 = caja
    sub = img.crop((max(0, x0 - margen), max(0, y0 - margen), min(img.width, x1 + margen), min(img.height, y1 + margen)))
    mk = mascara(sub, fondo)
    ys, xs = np.where(mk)
    if not len(xs):
        return sub
    return sub.crop((max(0, xs.min() - 3), max(0, ys.min() - 3), min(sub.width, xs.max() + 4), min(sub.height, ys.max() + 4)))


def componer(prenda, fondo, lienzo=LIENZO, escala=None):
    """Centra la prenda en el lienzo con la ampliación mínima necesaria (máx. 1.3x)."""
    W, H = lienzo
    if escala is None:
        escala = min(AMPLIACION_MAX, W * RELLENO / prenda.width, H * RELLENO / prenda.height)
    pw, ph = max(1, round(prenda.width * escala)), max(1, round(prenda.height * escala))
    if abs(escala - 1) > 0.01:
        prenda = prenda.resize((pw, ph), Image.LANCZOS)
    salida = Image.new("RGB", (W, H), fondo)
    salida.paste(prenda, ((W - pw) // 2, (H - ph) // 2))
    return salida


def extraer(ruta, dilatar=13):
    """Devuelve [(prenda_recortada, fondo)] en orden de lectura (componentes conexos)."""
    img = Image.open(ruta).convert("RGB")
    fondo = fondo_de(img)
    cajas = componentes(mascara(img, fondo), dilatar=dilatar)
    return [(caja_ajustada(img, c, fondo), fondo) for c in cajas]


def extraer_cuadricula(ruta, columnas, filas, borde=10):
    """Para hojas con líneas divisorias: corta una cuadrícula regular y busca la prenda dentro de
    cada casilla, ignorando `borde` píxeles pegados a las líneas."""
    img = Image.open(ruta).convert("RGB")
    fondo = fondo_de(img)
    cw, ch = img.width / columnas, img.height / filas
    salida = []
    for f in range(filas):
        for c in range(columnas):
            casilla = (round(c * cw) + borde, round(f * ch) + borde, round((c + 1) * cw) - borde, round((f + 1) * ch) - borde)
            sub = img.crop(casilla)
            mk = mascara(sub, fondo, umbral=40)
            ys, xs = np.where(mk)
            if not len(xs):
                continue
            salida.append((sub.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)), fondo))
    return salida


def extraer_pares(ruta, dilatar=3):
    """Hojas donde cada casilla trae dos prendas pegadas (frente y espalda): se parte cada par por
    la columna con menos píxeles de prenda cerca del centro."""
    img = Image.open(ruta).convert("RGB")
    fondo = fondo_de(img)
    salida = []
    for caja in componentes(mascara(img, fondo), dilatar=dilatar):
        par = caja_ajustada(img, caja, fondo)
        cuenta = mascara(par, fondo).sum(axis=0)
        w = par.width
        a, b = int(w * 0.38), int(w * 0.62)
        corte = a + int(np.argmin(cuenta[a:b]))
        for sub in (par.crop((0, 0, corte, par.height)), par.crop((corte, 0, w, par.height))):
            mk = mascara(sub, fondo)
            ys, xs = np.where(mk)
            salida.append((sub.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)) if len(xs) else sub, fondo))
    return salida


def componer_conjunto(piezas, escala=1.15):
    """Compone todas las prendas de una hoja en lienzos 4:5 del mismo tamaño. El lienzo se ajusta a la
    prenda más grande (a `escala`, casi nativa), así nada se amplía de más y todo conserva su nitidez."""
    ancho = max(max(p.width / RELLENO, 0.8 * p.height / RELLENO) for p, _ in piezas) * escala
    W = int(round(ancho / 2) * 2)
    H = int(round(W / 0.8 / 2) * 2)
    return [componer(p, f, lienzo=(W, H), escala=escala) for p, f in piezas]
