import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { formatPrice } from '../utils/format.js'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Más populares' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'rating', label: 'Mejor valorados' },
]

const PRICE_RANGES = [
  { id: 'r1', label: 'Hasta Gs. 500.000', min: 0, max: 500000 },
  { id: 'r2', label: 'Gs. 500.000 - 1.000.000', min: 500000, max: 1000000 },
  { id: 'r3', label: 'Gs. 1.000.000 - 3.000.000', min: 1000000, max: 3000000 },
  { id: 'r4', label: 'Gs. 3.000.000 - 7.000.000', min: 3000000, max: 7000000 },
  { id: 'r5', label: 'Más de Gs. 7.000.000', min: 7000000, max: Infinity },
]

export default function Catalog() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [search, setSearch] = useState(initialQuery)
  const [sort, setSort] = useState('popular')
  const [selectedCats, setSelectedCats] = useState(category ? [category] : [])
  const [priceRanges, setPriceRanges] = useState([])
  const [brands, setBrands] = useState([])
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Sync category from URL
  useEffect(() => {
    if (category) setSelectedCats([category])
    else setSelectedCats([])
  }, [category])

  // Sync search from URL
  useEffect(() => {
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  // Update URL when search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (search) params.set('q', search)
      else params.delete('q')
      setSearchParams(params, { replace: true })
    }, 250)
    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const allBrands = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.brand))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    let arr = [...PRODUCTS]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      arr = arr.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }

    // Categories
    if (selectedCats.length > 0) {
      arr = arr.filter((p) => selectedCats.includes(p.category))
    }

    // Price ranges
    if (priceRanges.length > 0) {
      arr = arr.filter((p) =>
        priceRanges.some((rangeId) => {
          const r = PRICE_RANGES.find((x) => x.id === rangeId)
          return r && p.price >= r.min && p.price < r.max
        })
      )
    }

    // Brands
    if (brands.length > 0) {
      arr = arr.filter((p) => brands.includes(p.brand))
    }

    // Offers
    if (onlyOffers) {
      arr = arr.filter((p) => p.oldPrice)
    }

    // In stock
    if (onlyInStock) {
      arr = arr.filter((p) => p.stock > 0)
    }

    // Sort
    switch (sort) {
      case 'price-asc': arr.sort((a, b) => a.price - b.price); break
      case 'price-desc': arr.sort((a, b) => b.price - a.price); break
      case 'name-asc': arr.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name-desc': arr.sort((a, b) => b.name.localeCompare(a.name)); break
      case 'rating': arr.sort((a, b) => b.rating - a.rating); break
      case 'popular':
      default: arr.sort((a, b) => b.popularity - a.popularity); break
    }

    return arr
  }, [search, selectedCats, priceRanges, brands, onlyOffers, onlyInStock, sort])

  const currentCategory = category ? CATEGORIES.find((c) => c.id === category) : null

  const toggleArr = (setter, value) => (prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]

  const clearFilters = () => {
    setSelectedCats([])
    setPriceRanges([])
    setBrands([])
    setOnlyOffers(false)
    setOnlyInStock(false)
    setSearch('')
  }

  const activeFiltersCount = selectedCats.length + priceRanges.length + brands.length + (onlyOffers ? 1 : 0) + (onlyInStock ? 1 : 0)

  return (
    <>
      {/* Header */}
      <section className="pt-12 pb-6">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Inicio</Link>
              <Icon name="chevronRight" className="h-3 w-3" />
              <Link to="/catalogo" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Catálogo</Link>
              {currentCategory && (
                <>
                  <Icon name="chevronRight" className="h-3 w-3" />
                  <span className="text-slate-800 dark:text-slate-100 font-medium">{currentCategory.name}</span>
                </>
              )}
            </nav>

            <h1 className="font-display text-3xl lg:text-5xl font-extrabold tracking-tight">
              {currentCategory ? (
                <>
                  <span className="mr-3">{currentCategory.icon}</span>
                  {currentCategory.name}
                </>
              ) : (
                'Catálogo completo'
              )}
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
              {currentCategory ? currentCategory.description : 'Explorá nuestra selección completa de productos de tecnología premium con garantía oficial.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & sort bar */}
      <section className="py-4 sticky top-[88px] z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800">
        <div className="container-app">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas, categorías..."
                className="input pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label="Limpiar búsqueda"
                >
                  <Icon name="x" className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative min-w-[200px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input appearance-none pr-9 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <Icon name="chevronDown" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filters toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden btn-ghost"
            >
              <Icon name="filter" className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="badge bg-brand-500 text-white">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-8 lg:py-12">
        <div className="container-app">
          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-[180px]">
                <FilterPanel
                  selectedCats={selectedCats}
                  setSelectedCats={(v) => setSelectedCats((prev) => v(prev))}
                  priceRanges={priceRanges}
                  setPriceRanges={(v) => setPriceRanges((prev) => v(prev))}
                  brands={brands}
                  setBrands={(v) => setBrands((prev) => v(prev))}
                  onlyOffers={onlyOffers}
                  setOnlyOffers={setOnlyOffers}
                  onlyInStock={onlyInStock}
                  setOnlyInStock={setOnlyInStock}
                  allBrands={allBrands}
                  clearFilters={clearFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </aside>

            {/* Mobile filters drawer */}
            {filtersOpen && (
              <>
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setFiltersOpen(false)} />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-0 z-[110] h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl lg:hidden overflow-y-auto"
                >
                  <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
                    <span className="font-display font-bold text-lg">Filtros</span>
                    <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Icon name="x" className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterPanel
                      selectedCats={selectedCats}
                      setSelectedCats={(v) => setSelectedCats((prev) => v(prev))}
                      priceRanges={priceRanges}
                      setPriceRanges={(v) => setPriceRanges((prev) => v(prev))}
                      brands={brands}
                      setBrands={(v) => setBrands((prev) => v(prev))}
                      onlyOffers={onlyOffers}
                      setOnlyOffers={setOnlyOffers}
                      onlyInStock={onlyInStock}
                      setOnlyInStock={setOnlyInStock}
                      allBrands={allBrands}
                      clearFilters={clearFilters}
                      activeFiltersCount={activeFiltersCount}
                    />
                    <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full mt-4">
                      Ver {filtered.length} resultados
                    </button>
                  </div>
                </motion.aside>
              </>
            )}

            {/* Products grid */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Mostrando <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> de {PRODUCTS.length} productos
                </p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                    <Icon name="x" className="h-3 w-3" />
                    Limpiar filtros ({activeFiltersCount})
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                    <Icon name="search" className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">Sin resultados</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">No encontramos productos que coincidan con tu búsqueda. Probá ajustar los filtros.</p>
                  <button onClick={clearFilters} className="btn-primary">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FilterPanel(props) {
  const {
    selectedCats, setSelectedCats,
    priceRanges, setPriceRanges,
    brands, setBrands,
    onlyOffers, setOnlyOffers,
    onlyInStock, setOnlyInStock,
    allBrands, clearFilters, activeFiltersCount,
  } = props

  return (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
          <Icon name="x" className="h-3 w-3" />
          Limpiar todo ({activeFiltersCount})
        </button>
      )}

      {/* Categorías */}
      <FilterGroup title="Categorías">
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCats.includes(c.id)}
                onChange={() => setSelectedCats(c.id)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {c.icon} {c.name}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Precio */}
      <FilterGroup title="Precio">
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={priceRanges.includes(r.id)}
                onChange={() => setPriceRanges(r.id)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Marcas */}
      <FilterGroup title="Marcas">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => setBrands(b)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {b}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Otros */}
      <FilterGroup title="Disponibilidad">
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={onlyOffers}
              onChange={(e) => setOnlyOffers(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Solo ofertas
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              En stock
            </span>
          </label>
        </div>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3"
      >
        <span className="font-display font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">{title}</span>
        <Icon name="chevronDown" className={`h-4 w-4 text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  )
}
