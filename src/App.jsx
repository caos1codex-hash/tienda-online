import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const location = useLocation()

  // Scroll to top on route change (delegated to ScrollToTop component)
  useEffect(() => {
    // structured data update for product detail handled in page
  }, [location.pathname])

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-accent-500/20 dark:bg-accent-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/15 dark:bg-purple-500/10 blur-[120px]" />
      </div>

      <ScrollToTop />
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/catalogo/:category" element={<Catalog />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
