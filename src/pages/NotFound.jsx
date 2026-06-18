import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <div className="container-app py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-brand-500/30 blur-3xl rounded-full" />
          <h1 className="relative font-display text-[120px] sm:text-[180px] font-extrabold leading-none text-gradient">
            404
          </h1>
        </div>
        <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold">Página no encontrada</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          La página que buscás no existe o fue movida. Pero no te preocupes, todavía tenemos muchos productos increíbles para vos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Icon name="home" className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link to="/catalogo" className="btn-ghost">
            <Icon name="grid" className="h-4 w-4" />
            Ver catálogo
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
