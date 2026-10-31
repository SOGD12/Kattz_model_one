import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Bienvenida from './components/Bienvenida'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import Producto from './pages/Producto'
import { useLenisGsap } from './hooks/useLenisGsap'
import { useMedia, MOVIMIENTO_REDUCIDO } from './hooks/useMedia'
import { ScrollTrigger } from './lib/gsap'
import { getLenis } from './lib/lenis'
import { useRuta } from './lib/router'
import { crearGrano } from './lib/grano'
import { CATEGORIAS, porId } from './data/productos'

export default function App() {
  const reducido = useMedia(MOVIMIENTO_REDUCIDO)
  const ruta = useRuta()
  // Lenis en todos los tamaños; solo se apaga con prefers-reduced-motion
  useLenisGsap(!reducido)

  useEffect(() => {
    crearGrano()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  // Al cambiar de página (no de filtro) se vuelve arriba y se recalculan los disparadores
  const clave = ruta.nombre === 'producto' ? `producto-${ruta.id}` : ruta.nombre
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [clave])

  // Título de la pestaña por página (los lectores de pantalla lo anuncian al navegar)
  useEffect(() => {
    let t = 'Katz — ropa oversize'
    if (ruta.nombre === 'producto') t = `${porId(ruta.id)?.nombre || 'Prenda no encontrada'} — Katz`
    else if (ruta.nombre === 'tienda') t = `${CATEGORIAS.find((c) => c.id === ruta.q.cat)?.titulo || (ruta.q.nuevo === '1' ? 'Novedades' : 'Toda la tienda')} — Katz`
    document.title = t
  }, [ruta])

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <a className="salto" href="#contenido" onClick={(e) => { e.preventDefault(); document.getElementById('contenido')?.focus() }}>Saltar al contenido</a>
        <Header ruta={ruta} />
        <main id="contenido" tabIndex={-1} key={clave}>
          {ruta.nombre === 'inicio' && <Home />}
          {ruta.nombre === 'tienda' && <Tienda q={ruta.q} />}
          {ruta.nombre === 'producto' && <Producto id={ruta.id} />}
        </main>
        <Footer />
        <CartDrawer />
        <Bienvenida ruta={ruta} />
        <div className="grano" aria-hidden="true" />
      </CartProvider>
    </MotionConfig>
  )
}
