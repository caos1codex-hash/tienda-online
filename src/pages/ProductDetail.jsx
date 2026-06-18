import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductBySlug, getRelated, CATEGORIES, STORE_INFO, WHATSAPP_NUMBER, PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useRecentlyViewed } from '../context/RecentlyViewedContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice, ratingStars } from '../utils/format.js'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = useMemo(() => getProductBySlug(slug), [slug])
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addViewed, viewed } = useRecentlyViewed()
  const { toast } = useToast()
  const fav = isFavorite(product?.id)

  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const [stickyVisible, setStickyVisible] = useState(false)
  const mainInfoRef = useRef(null)

  useEffect(() => {
    if (product) {
      setActiveImage(0)
      setQty(1)
      setActiveTab('description')
      // Update document title
      document.title = `${product.name} — ${STORE_INFO.name}`
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', `Comprá ${product.name} en ${STORE_INFO.name}. ${product.description.substring(0, 120)}... Precio: ${formatPrice(product.price)}. Envío a todo Paraguay.`)
      }
      // Update Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', `${product.name} — ${STORE_INFO.name}`)
      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', `Comprá ${product.name} por ${formatPrice(product.price)}. Garantía oficial, envío a todo Paraguay.`)
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', `https://caos1codex-hash.github.io/tienda-online/producto/${product.slug}`)
      // Twitter
      const twTitle = document.querySelector('meta[name="twitter:title"]')
      if (twTitle) twTitle.setAttribute('content', `${product.name} — ${STORE_INFO.name}`)
      const twDesc = document.querySelector('meta[name="twitter:description"]')
      if (twDesc) twDesc.setAttribute('content', `Comprá ${product.name} por ${formatPrice(product.price)} en Paraguay.`)
      // Inject structured data
      const scriptId = 'product-jsonld'
      const existing = document.getElementById(scriptId)
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        brand: { '@type': 'Brand', name: product.brand },
        category: product.category,
        image: product.images,
        sku: product.id,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviews,
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'PYG',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `https://caos1codex-hash.github.io/tienda-online/producto/${product.slug}`,
          seller: {
            '@type': 'Organization',
            name: STORE_INFO.name,
          },
        },
      })
      document.head.appendChild(script)
      // Track recently viewed
      addViewed(product.id)
    }
    return () => {
      const s = document.getElementById('product-jsonld')
      if (s) s.remove()
      document.title = `${STORE_INFO.name} — Tienda Online de Tecnología en Paraguay`
    }
  }, [product])

  // Sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (mainInfoRef.current) {
        const rect = mainInfoRef.current.getBoundingClientRect()
        setStickyVisible(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!product) {
    return (
      <div className="container-app py-32 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">El producto que buscás no existe o fue removido.</p>
        <Link to="/catalogo" className="btn-primary">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const { full, hasHalf, empty } = ratingStars(product.rating)
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0
  const related = getRelated(product)
  const category = CATEGORIES.find((c) => c.id === product.category)
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleFav = () => {
    toggleFavorite(product.id)
    toast(fav ? `${product.name} eliminado de favoritos` : `${product.name} agregado a favoritos`, fav ? 'info' : 'success')
  }

  const handleAddToCart = () => {
    addItem(product, qty)
    toast(`${qty} × ${product.name} agregado al carrito`, 'success')
  }

  const buildPremiumWhatsapp = () => {
    const lines = []
    lines.push('Hola, deseo realizar una compra.')
    lines.push('')
    lines.push('📦 PRODUCTO:')
    lines.push(`• ${product.name}`)
    lines.push(`• Marca: ${product.brand}`)
    lines.push(`• Categoría: ${category?.name || product.category}`)
    lines.push('')
    lines.push('💰 PRECIO:')
    lines.push(`• Unitario: ${formatPrice(product.price)}`)
    lines.push(`• Cantidad: ${qty}`)
    lines.push(`• Subtotal: ${formatPrice(product.price * qty)}`)
    if (product.oldPrice) {
      lines.push(`• Ahorro: ${formatPrice(product.oldPrice - product.price)} (${discount}% OFF)`)
    }
    const total = product.price * qty
    const shipping = total < STORE_INFO.freeShippingMin ? 30000 : 0
    lines.push(`• Envío: ${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}`)
    lines.push(`• TOTAL: ${formatPrice(total + shipping)}`)
    lines.push('')
    lines.push('📍 CIUDAD: [Ingrese su ciudad]')
    lines.push('💳 MÉTODO DE PAGO: Transferencia / Efectivo / Tarjeta')
    lines.push('')
    lines.push('Observaciones:')
    lines.push('')
    lines.push('Gracias.')
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  const handleBuyNow = () => {
    const url = buildPremiumWhatsapp()
    window.open(url, '_blank', 'noopener,noreferrer')
    toast('Abriendo WhatsApp con tu pedido...', 'success')
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x, y })
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="pt-8">
        <div className="container-app">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Inicio</Link>
            <Icon name="chevronRight" className="h-3 w-3" />
            <Link to="/catalogo" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Catálogo</Link>
            <Icon name="chevronRight" className="h-3 w-3" />
            <Link to={`/catalogo/${product.category}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition capitalize">
              {category?.name}
            </Link>
            <Icon name="chevronRight" className="h-3 w-3" />
            <span className="text-slate-800 dark:text-slate-100 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Main */}
      <section className="py-8 lg:py-12">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12" ref={mainInfoRef}>
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-zoom-in"
                onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                onMouseMove={handleMouseMove}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={`${product.name} - imagen ${activeImage + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                    style={{
                      transform: zoom.active ? `scale(2)` : 'scale(1)',
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    }}
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badge && (
                    <span className="badge bg-brand-500 text-white shadow-lg">{product.badge}</span>
                  )}
                  {discount > 0 && (
                    <span className="badge bg-rose-500 text-white shadow-lg">-{discount}% OFF</span>
                  )}
                </div>

                {/* Zoom hint */}
                <div className={`absolute bottom-4 right-4 badge glass-strong text-slate-700 dark:text-slate-200 transition-opacity ${zoom.active ? 'opacity-0' : 'opacity-100'}`}>
                  <Icon name="zoomIn" className="h-3.5 w-3.5" />
                  Hover para zoom
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 left-4 badge glass-strong text-slate-700 dark:text-slate-200">
                  {activeImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                      activeImage === i
                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={img} alt={`Miniatura ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">{product.brand}</span>
                <span className="text-slate-300">·</span>
                <Link to={`/catalogo/${product.category}`} className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 capitalize transition">
                  {category?.name}
                </Link>
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight">
                {product.name}
              </h1>

              {/* Rating + sold */}
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1" aria-label={`${product.rating} de 5 estrellas`}>
                  {Array.from({ length: full }).map((_, i) => (
                    <Icon key={`f${i}`} name="star" className="h-4 w-4 text-amber-400" />
                  ))}
                  {hasHalf && (
                    <span className="relative">
                      <Icon name="star" className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                      <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                        <Icon name="star" className="h-4 w-4 text-amber-400" />
                      </span>
                    </span>
                  )}
                  {Array.from({ length: empty }).map((_, i) => (
                    <Icon key={`e${i}`} name="star" className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {product.rating.toFixed(1)} · {product.reviews} opiniones
                </span>
                {product.soldThisWeek > 0 && (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    🔥 {product.soldThisWeek} vendidos esta semana
                  </span>
                )}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span key={t} className="badge bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mt-6 flex items-end gap-3">
                <div>
                  {product.oldPrice && (
                    <div className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</div>
                  )}
                  <div className="font-display text-4xl font-extrabold text-gradient">{formatPrice(product.price)}</div>
                </div>
                {discount > 0 && (
                  <span className="badge bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 mb-2">
                    Ahorrás {formatPrice(product.oldPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Stock + Urgency */}
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                {product.stock > 10 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">En stock</span>
                  </div>
                ) : product.stock > 3 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Quedan {product.stock} unidades</span>
                  </div>
                ) : product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-rose-600 dark:text-rose-400 font-bold">⚡ Últimas {product.stock} unidades</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-slate-500 font-medium">Sin stock</span>
                  </div>
                )}
              </div>

              {/* Description short */}
              <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Qty + actions */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cantidad:</span>
                  <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-11 w-11 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-l-xl"
                      aria-label="Disminuir cantidad"
                    >
                      <Icon name="minus" className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={qty}
                      min="1"
                      max={Math.min(product.stock, 99)}
                      onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                      className="w-16 text-center bg-transparent border-0 outline-none text-base font-semibold"
                      aria-label="Cantidad"
                    />
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="h-11 w-11 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-r-xl"
                      aria-label="Aumentar cantidad"
                    >
                      <Icon name="plus" className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Subtotal: <span className="font-bold text-slate-900 dark:text-white">{formatPrice(product.price * qty)}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={handleBuyNow} className="btn-whatsapp text-base" disabled={product.stock === 0}>
                    <Icon name="whatsapp" className="h-5 w-5" />
                    Comprar ahora
                  </button>
                  <button onClick={handleAddToCart} className="btn-primary text-base" disabled={product.stock === 0}>
                    <Icon name="cart" className="h-5 w-5" />
                    Agregar al carrito
                  </button>
                </div>
                <button onClick={handleFav} className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition ${fav ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-300 hover:text-rose-500'}`}>
                  <Icon name="heart" className={`h-4 w-4 ${fav ? 'text-rose-500' : ''}`} />
                  {fav ? 'En favoritos' : 'Agregar a favoritos'}
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: 'truck', text: 'Envío gratis en compras +Gs. 500.000' },
                  { icon: 'shield', text: 'Garantía oficial 12 meses' },
                  { icon: 'refresh', text: 'Devolución 7 días sin preguntas' },
                  { icon: 'whatsapp', text: 'Soporte por WhatsApp 24/7' },
                  { icon: 'package', text: 'Producto original con factura' },
                  { icon: 'checkCircle', text: 'Pago seguro: Bancard, Visa, MC' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex-shrink-0">
                      <Icon name={b.icon} className="h-4 w-4" />
                    </span>
                    {b.text}
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Compartir:</span>
                {[
                  { name: 'whatsapp', url: `https://wa.me/?text=${encodeURIComponent(`Mirá este producto: ${product.name} - ${formatPrice(product.price)} en ${STORE_INFO.name}`)}` },
                  { name: 'mail', url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`Te recomiendo este producto: ${product.name} - ${formatPrice(product.price)} en ${STORE_INFO.name}`)}` },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
                    aria-label={`Compartir por ${s.name}`}
                  >
                    <Icon name={s.name} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs: Description / Specs / Reviews / FAQ */}
          <div className="mt-16">
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'Descripción' },
                { id: 'specs', label: 'Especificaciones' },
                { id: 'reviews', label: `Opiniones (${product.reviews})` },
                { id: 'faq', label: 'Preguntas frecuentes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'description' && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                        {product.description}
                      </p>
                      <div className="mt-6 grid sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50">
                          <div className="text-brand-600 dark:text-brand-400 font-semibold text-sm mb-1">Garantía</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">12 meses de garantía oficial del fabricante. Producto 100% original con factura incluida.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1">Envío</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Envío gratis en compras superiores a Gs. 500.000. Llegamos a todo Paraguay.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                          <div className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-1">Soporte</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Atención personalizada por WhatsApp. Te asesoramos antes y después de tu compra.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-800">
                          <dt className="text-sm text-slate-500 dark:text-slate-400 font-medium">{key}</dt>
                          <dd className="text-sm text-slate-900 dark:text-white font-semibold text-right">{value}</dd>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center mb-8">
                        <div className="text-center">
                          <div className="font-display text-5xl font-extrabold text-gradient">{product.rating.toFixed(1)}</div>
                          <div className="flex items-center justify-center mt-1">
                            {Array.from({ length: full }).map((_, i) => (
                              <Icon key={i} name="star" className="h-4 w-4 text-amber-400" />
                            ))}
                            {hasHalf && <Icon name="star" className="h-4 w-4 text-amber-400" />}
                            {Array.from({ length: empty }).map((_, i) => (
                              <Icon key={`e${i}`} name="star" className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                            ))}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.reviews} opiniones verificadas</div>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Nuestros clientes califican este producto como excelente. La mayoría destaca la calidad, el rendimiento y la relación calidad-precio. Comprá con confianza sabiendo que estás adquiriendo un producto verificado y recomendado por compradores reales en Paraguay.
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">¿Ya compraste este producto?</span>
                            <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                              Dejá tu opinión
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {SAMPLE_REVIEWS.map((r, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm flex-shrink-0">
                                {r.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div>
                                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{r.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                      <span>{r.city}</span>
                                      <span>·</span>
                                      <span>{r.product}</span>
                                      <span>·</span>
                                      <span>{r.date}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: r.rating }).map((_, j) => (
                                      <Icon key={j} name="star" className="h-3.5 w-3.5 text-amber-400" />
                                    ))}
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 ml-1">
                                      <Icon name="checkCircle" className="h-3 w-3" />
                                      Verificada
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'faq' && (
                    <div className="space-y-3">
                      {PRODUCT_FAQS.map((faq, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{faq.q}</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                      <div className="mt-4 text-center">
                        <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="btn-whatsapp text-sm">
                          <Icon name="whatsapp" className="h-4 w-4" />
                          Hacé tu consulta por WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="section-eyebrow">
                    <Icon name="sparkles" className="h-3.5 w-3.5" />
                    Complementá tu compra
                  </span>
                  <h2 className="mt-3 font-display text-2xl lg:text-3xl font-extrabold">Productos relacionados</h2>
                </div>
                <Link to={`/catalogo/${product.category}`} className="btn-ghost">
                  Ver más
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Recently viewed */}
          {viewed.length > 1 && (() => {
            const recentProducts = viewed
              .filter((id) => id !== product.id)
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter(Boolean)
              .slice(0, 4)
            if (recentProducts.length === 0) return null
            return (
              <div className="mt-16">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="section-eyebrow">
                      <Icon name="eye" className="h-3.5 w-3.5" />
                      Vistos recientemente
                    </span>
                    <h2 className="mt-3 font-display text-2xl lg:text-3xl font-extrabold">También te interesaron</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {recentProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10"
          >
            <div className="container-app py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{product.name}</p>
                <p className="font-display font-extrabold text-gradient text-lg">{formatPrice(product.price * qty)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={handleBuyNow} className="btn-whatsapp text-sm px-4 py-2.5">
                  <Icon name="whatsapp" className="h-4 w-4" />
                  Comprar
                </button>
                <button onClick={handleAddToCart} className="btn-primary text-sm px-4 py-2.5">
                  <Icon name="cart" className="h-4 w-4" />
                  Agregar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const SAMPLE_REVIEWS = [
  {
    name: 'Roberto Acuña',
    city: 'Asunción',
    product: 'Samsung Galaxy S25 Ultra',
    date: 'Mayo 2025',
    rating: 5,
    text: 'Excelente producto, llegó antes de lo previsto y en perfectas condiciones. La atención por WhatsApp fue impecable, respondieron todas mis dudas al instante.',
  },
  {
    name: 'Laura Méndez',
    city: 'Ciudad del Este',
    product: 'Lenovo LOQ 15',
    date: 'Abril 2025',
    rating: 5,
    text: 'Compré mi laptop gaming con miedo de que fuera una estafa pero todo salió perfecto. Producto original con factura y garantía. Ya hice mi segunda compra. Los super recomiendo.',
  },
  {
    name: 'Diego Romero',
    city: 'Encarnación',
    product: 'JBL Flip 7',
    date: 'Junio 2025',
    rating: 4,
    text: 'Muy bueno, cumple todo lo prometido. El envío al interior tardó 3 días, pero el producto valió la pena. El sonido es increíble. Volvería a comprar.',
  },
]

const PRODUCT_FAQS = [
  {
    q: '¿Este producto tiene garantía?',
    a: 'Sí, todos nuestros productos tienen 12 meses de garantía oficial del fabricante. Incluimos factura y certificado de garantía con cada compra.',
  },
  {
    q: '¿Cuánto cuesta el envío?',
    a: 'El envío es gratis en compras superiores a Gs. 500.000 para Asunción y Gran Asunción. Para el interior del país, consultanos el costo por WhatsApp.',
  },
  {
    q: '¿Cuánto tarda en llegar?',
    a: 'En Asunción y Gran Asunción, de 1 a 2 días hábiles. En el interior del país, de 3 a 5 días hábiles. Te enviamos seguimiento por WhatsApp.',
  },
  {
    q: '¿Cómo realizo la compra?',
    a: 'Hacé clic en "Comprar ahora" y se abre WhatsApp con tu pedido completo. También podés agregar al carrito y finalizar desde ahí. Te respondemos en minutos.',
  },
  {
    q: '¿Aceptan tarjetas de crédito?',
    a: 'Sí, aceptamos Bancard, Visa y Mastercard. También transferencia bancaria y efectivo. Todos los pagos son seguros.',
  },
]
