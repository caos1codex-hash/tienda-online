import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { CATEGORIES, STORE_INFO } from '../data/products'
import Icon from './Icon.jsx'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { count, cart } = useCart()
  const { count: favCount } = useFavorites()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen, setCatOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileOpen, searchOpen])

  const submitSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
    setSearchQuery('')
    setMobileOpen(false)
  }

  const openCart = () => {
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-slate-900/5'
            : 'bg-transparent'
        }`}
      >
        {/* Promo banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 text-white text-xs font-medium py-2">
          <div className="container-app flex items-center justify-center gap-2 text-center">
            <Icon name="truck" className="h-4 w-4 flex-shrink-0" />
            <span>Envío GRATIS en compras +Gs. 500.000 · Bancard · Visa · Mastercard · Comprá por WhatsApp</span>
          </div>
        </div>

        <div className="container-app">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Mobile menu btn */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Abrir menú"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg lg:text-xl font-extrabold tracking-tight">
                  Tech<span className="text-gradient">Nova</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">PY · Tech Store</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavItem to="/">Inicio</NavItem>

              {/* Categorías dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Catálogo
                  <Icon name="chevronDown" className={`h-4 w-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[600px]"
                    >
                      <div className="glass-strong rounded-2xl p-4 shadow-card-hover">
                        <div className="grid grid-cols-2 gap-1">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/catalogo/${cat.id}`}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/40 transition group"
                            >
                              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                              <span>
                                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{cat.name}</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link to="/catalogo" className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-950/60 transition">
                          Ver todos los productos
                          <Icon name="arrowRight" className="h-4 w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {CATEGORIES.slice(0, 3).map((cat) => (
                <NavItem key={cat.id} to={`/catalogo/${cat.id}`}>
                  {cat.name}
                </NavItem>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Buscar"
              >
                <Icon name="search" className="h-5 w-5" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Cambiar tema"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={theme}
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Favorites */}
              <button
                onClick={() => navigate('/catalogo')}
                className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label={`${favCount} favoritos`}
              >
                <Icon name="heart" className="h-5 w-5" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                    {favCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label={`Carrito con ${count} productos`}
              >
                <Icon name="cart" className="h-5 w-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                      className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-accent-500/40"
                    >
                      {count > 99 ? '99+' : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-[70] h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-display font-bold text-lg">Menú</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={submitSearch} className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="input pl-9"
                    autoFocus
                  />
                </div>
              </form>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <MobileNavItem to="/" onClick={() => setMobileOpen(false)} icon="home">Inicio</MobileNavItem>
                <MobileNavItem to="/catalogo" onClick={() => setMobileOpen(false)} icon="grid">Todo el catálogo</MobileNavItem>
                <div className="pt-3 pb-1 px-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">Categorías</div>
                {CATEGORIES.map((cat) => (
                  <MobileNavItem key={cat.id} to={`/catalogo/${cat.id}`} onClick={() => setMobileOpen(false)} icon="tag">
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </MobileNavItem>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="btn-whatsapp w-full">
                  <Icon name="whatsapp" className="h-5 w-5" />
                  Comprar por WhatsApp
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 z-[90] p-4 pt-[15vh]"
            >
              <div className="mx-auto max-w-2xl glass-strong rounded-2xl shadow-card-hover overflow-hidden">
                <form onSubmit={submitSearch} className="flex items-center gap-3 p-4">
                  <Icon name="search" className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="flex-1 bg-transparent border-0 outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    autoFocus
                    onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                    ESC
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
            : 'text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function MobileNavItem({ to, children, onClick, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      {icon && <Icon name={icon} className="h-5 w-5 text-slate-400" />}
      <span className="font-medium">{children}</span>
    </Link>
  )
}
