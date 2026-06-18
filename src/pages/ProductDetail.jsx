import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductBySlug, getRelated, CATEGORIES } from '../data/products'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice, ratingStars, buildSingleProductWhatsapp } from '../utils/format.js'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = useMemo(() => getProductBySlug(slug), [slug])
  const { addItem } = useCart()
  const { toast } = useToast()

  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

  useEffect(() => {
    if (product) {
      setActiveImage(0)
      setQty(1)
      setActiveTab('description')
      // Update document title
      document.title = `${product.name} — TechNova PY`
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
        },
      })
      document.head.appendChild(script)
    }
    return () => {
      const s = document.getElementById('product-jsonld')
      if (s) s.remove()
      document.title = 'TechNova PY — Tienda Online Premium de Tecnología en Paraguay'
    }
  }, [product])

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

  const handleAddToCart = () => {
    addItem(product, qty)
    toast(`${qty} × ${product.name} agregado al carrito`, 'success')
  }

  const handleBuyNow = () => {
    const url = buildSingleProductWhatsapp(product, qty)
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
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
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

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center">
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
                  {product.rating.toFixed(1)} · {product.reviews} reseñas
                </span>
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

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                {product.stock > 10 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">En stock</span>
                  </>
                ) : product.stock > 0 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-600 dark:text-amber-400 font-medium">¡Solo {product.stock} unidades disponibles!</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-rose-600 dark:text-rose-400 font-medium">Sin stock</span>
                  </>
                )}
              </div>

              {/* Description short */}
              <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Qty + actions */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
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
                  <button onClick={handleBuyNow} className="btn-whatsapp text-base">
                    <Icon name="whatsapp" className="h-5 w-5" />
                    Comprar ahora
                  </button>
                  <button onClick={handleAddToCart} className="btn-primary text-base">
                    <Icon name="cart" className="h-5 w-5" />
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: 'truck', text: 'Envío gratis en compras +Gs. 500.000' },
                  { icon: 'shield', text: 'Garantía oficial 12 meses' },
                  { icon: 'refresh', text: 'Devolución 7 días sin preguntas' },
                  { icon: 'whatsapp', text: 'Soporte por WhatsApp 24/7' },
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
                  { name: 'whatsapp', url: `https://wa.me/?text=${encodeURIComponent(`Mirá este producto: ${product.name} - ${formatPrice(product.price)} en TechNova PY`)}` },
                  { name: 'mail', url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`Te recomiendo este producto: ${product.name} - ${formatPrice(product.price)}`)}` },
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

          {/* Tabs: Description / Specs */}
          <div className="mt-16">
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'Descripción' },
                { id: 'specs', label: 'Especificaciones' },
                { id: 'reviews', label: `Reseñas (${product.reviews})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
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
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                        En TechNova PY traemos productos seleccionados para que tengas la mejor experiencia. Todos nuestros equipos pasan por control de calidad antes del envío y cuentan con garantía oficial del fabricante. Si tenés alguna consulta sobre este producto, no dudes en escribirnos por WhatsApp: respondemos en minutos.
                      </p>
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
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.reviews} reseñas</div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          Nuestros clientes califican este producto como excelente. La mayoría destaca la calidad, el rendimiento y la relación calidad-precio. Comprá con confianza sabiendo que estás adquiriendo un producto verificado y recomendado.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {SAMPLE_REVIEWS.map((r, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                              <img src={r.avatar} alt={r.name} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{r.name}</div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                      <Icon name="checkCircle" className="h-3 w-3" />
                                      Compra verificada
                                    </div>
                                  </div>
                                  <div className="flex">
                                    {Array.from({ length: r.rating }).map((_, j) => (
                                      <Icon key={j} name="star" className="h-3.5 w-3.5 text-amber-400" />
                                    ))}
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
        </div>
      </section>
    </>
  )
}

const SAMPLE_REVIEWS = [
  {
    name: 'Roberto Acuña',
    avatar: 'https://i.pravatar.cc/100?img=33',
    rating: 5,
    text: 'Excelente producto, llegó antes de lo previsto y en perfectas condiciones. La atención por WhatsApp fue impecable, respondieron todas mis dudas al instante.',
  },
  {
    name: 'Laura Méndez',
    avatar: 'https://i.pravatar.cc/100?img=23',
    rating: 5,
    text: 'Compré con miedo de que fuera una estafa pero todo salió perfecto. Producto original con factura y garantía. Ya hice mi segunda compra. Los super recomiendo.',
  },
  {
    name: 'Diego Romero',
    avatar: 'https://i.pravatar.cc/100?img=15',
    rating: 4,
    text: 'Muy bueno, cumple todo lo prometido. El único detalle es que el envío al interior tardó 3 días, pero el producto valió la pena. Volvería a comprar.',
  },
]
