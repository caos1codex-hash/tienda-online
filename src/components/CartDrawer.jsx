import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice, buildWhatsappUrl } from '../utils/format.js'
import { STORE_INFO } from '../data/products'
import Icon from './Icon.jsx'

export default function CartDrawer() {
  const { cart, removeItem, incItem, decItem, count, subtotal, shipping, total, clearCart } = useCart()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast('Tu carrito está vacío', 'error')
      return
    }
    const url = buildWhatsappUrl(cart, { subtotal, shipping, total })
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      toast('Abriendo WhatsApp con tu pedido...', 'success')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[110] h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon name="cart" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="font-display font-bold text-lg">Tu carrito</h2>
                {count > 0 && (
                  <span className="badge bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    {count} {count === 1 ? 'artículo' : 'artículos'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Cerrar carrito"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <EmptyCart onClose={() => setOpen(false)} />
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                      >
                        <Link to={`/producto/${item.slug}`} onClick={() => setOpen(false)} className="flex-shrink-0">
                          <div className="h-20 w-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/producto/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-brand-600 dark:hover:text-brand-400 transition"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.category}</p>
                          <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                            {formatPrice(item.price)}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => decItem(item.id)}
                                className="h-7 w-7 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-l-lg"
                                aria-label="Disminuir cantidad"
                              >
                                <Icon name="minus" className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                              <button
                                onClick={() => incItem(item.id)}
                                className="h-7 w-7 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-r-lg"
                                aria-label="Aumentar cantidad"
                              >
                                <Icon name="plus" className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                removeItem(item.id)
                                toast(`${item.name} eliminado del carrito`, 'info')
                              }}
                              className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              aria-label="Eliminar"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  <li className="pt-2">
                    <button
                      onClick={() => {
                        clearCart()
                        toast('Carrito vaciado', 'info')
                      }}
                      className="text-xs text-slate-500 hover:text-rose-500 transition flex items-center gap-1.5"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      Vaciar carrito
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Footer / checkout */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-800 p-5 space-y-3 bg-white dark:bg-slate-950">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Envío</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">GRATIS</span>
                    ) : (
                      <span className="font-semibold">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  {subtotal > 0 && subtotal < 500000 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Icon name="truck" className="h-3.5 w-3.5" />
                      Agregá {formatPrice(500000 - subtotal)} más para envío gratis
                    </p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-gradient">{formatPrice(total)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-whatsapp w-full text-base">
                  <Icon name="whatsapp" className="h-5 w-5" />
                  Finalizar pedido por WhatsApp
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function EmptyCart({ onClose }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full" />
        <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-950 dark:to-accent-950 flex items-center justify-center">
          <Icon name="cart" className="h-12 w-12 text-brand-500" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="font-display font-bold text-xl mb-2">Tu carrito está vacío</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        Explorá nuestro catálogo y encontrá los mejores productos de tecnología en Paraguay.
      </p>
      <Link to="/catalogo" onClick={onClose} className="btn-primary">
        Ver catálogo
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </div>
  )
}
