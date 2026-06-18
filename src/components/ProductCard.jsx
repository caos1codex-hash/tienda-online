import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice, ratingStars } from '../utils/format.js'
import Icon from './Icon.jsx'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { full, hasHalf, empty } = ratingStars(product.rating)
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast(`${product.name} agregado al carrito`, 'success')
  }

  const badgeColors = {
    'Nuevo': 'bg-emerald-500 text-white',
    'Oferta': 'bg-rose-500 text-white',
    'Destacado': 'bg-brand-500 text-white',
    'Premium': 'bg-purple-500 text-white',
    'Popular': 'bg-accent-500 text-white',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={`/producto/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 badge ${badgeColors[product.badge] || 'bg-brand-500 text-white'} shadow-lg`}>
              {product.badge}
            </span>
          )}

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 badge bg-rose-500 text-white shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Quick add button (desktop) */}
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-600 hover:text-white transition-all duration-300"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Icon name="plus" className="h-5 w-5" />
          </button>

          {/* Stock indicator */}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute bottom-3 left-3 badge bg-amber-500/95 text-white text-[10px]">
              ¡Solo {product.stock}!
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{product.brand}</span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 capitalize">{product.category}</span>
          </div>

          <h3 className="font-display font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: full }).map((_, i) => (
                <Icon key={`f${i}`} name="star" className="h-3.5 w-3.5 text-amber-400" />
              ))}
              {hasHalf && (
                <span className="relative">
                  <Icon name="star" className="h-3.5 w-3.5 text-slate-200 dark:text-slate-700" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <Icon name="star" className="h-3.5 w-3.5 text-amber-400" />
                  </span>
                </span>
              )}
              {Array.from({ length: empty }).map((_, i) => (
                <Icon key={`e${i}`} name="star" className="h-3.5 w-3.5 text-slate-200 dark:text-slate-700" />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {product.rating.toFixed(1)} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              {product.oldPrice && (
                <span className="block text-xs text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-600 text-white shadow-md active:scale-95 transition"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <Icon name="plus" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
