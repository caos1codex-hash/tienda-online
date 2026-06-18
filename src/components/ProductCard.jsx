import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice, ratingStars } from '../utils/format.js'
import Icon from './Icon.jsx'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const fav = isFavorite(product.id)
  const { full, hasHalf, empty } = ratingStars(product.rating)
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
    toast(fav ? `${product.name} eliminado de favoritos` : `${product.name} agregado a favoritos`, fav ? 'info' : 'success')
  }

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
    'Popular': 'bg-amber-500 text-white',
    'Más vendido': 'bg-orange-500 text-white',
  }

  const isLowStock = product.stock > 0 && product.stock <= 5
  const isAlmostGone = product.stock > 0 && product.stock <= 3

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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className={`badge ${badgeColors[product.badge] || 'bg-brand-500 text-white'} shadow-lg`}>
                {product.badge === 'Más vendido' ? '🔥 ' : ''}
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-rose-500 text-white shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Urgency: sold this week */}
          {product.soldThisWeek >= 10 && (
            <span className="absolute top-3 right-3 badge bg-amber-500/95 text-white shadow-lg text-[10px]">
              🔥 {product.soldThisWeek} vendidos esta semana
            </span>
          )}

          {/* Low stock urgency */}
          {isAlmostGone && (
            <span className="absolute bottom-3 left-3 badge bg-rose-600 text-white text-[10px] shadow-lg animate-pulse">
              ⚡ Últimas {product.stock} unidades
            </span>
          )}
          {!isAlmostGone && isLowStock && (
            <span className="absolute bottom-3 left-3 badge bg-amber-500/95 text-white text-[10px]">
              Quedan {product.stock} unidades
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFav}
            className="absolute top-3 right-3 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-500 dark:text-slate-400 shadow-md hover:scale-110 transition-all z-10"
            aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Icon name="heart" className={`h-4 w-4 ${fav ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Quick add button (desktop) */}
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-600 hover:text-white transition-all duration-300"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Icon name="plus" className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">{product.brand}</span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 capitalize">{product.category}</span>
          </div>

          <h3 className="font-display font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center" aria-label={`${product.rating} de 5 estrellas`}>
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
