import { Link } from 'react-router-dom'
import { CATEGORIES, STORE_INFO } from '../data/products'
import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
      {/* Newsletter */}
      <div className="container-app -mt-12 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 p-8 lg:p-12 shadow-glow">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white">
                Recibí ofertas exclusivas
              </h3>
              <p className="mt-2 text-white/80">
                Sumate a nuestro WhatsApp y accedé a descuentos, lanzamientos y promociones antes que nadie en Paraguay.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1da851] transition shadow-lg">
                <Icon name="whatsapp" className="h-5 w-5" />
                Unirme por WhatsApp
              </a>
              <a href={`mailto:${STORE_INFO.email}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/25 transition">
                <Icon name="mail" className="h-4 w-4" />
                {STORE_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-app pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold">
                  Tech<span className="text-gradient">Nova</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">PY · Tech Store</span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 max-w-sm">
              {STORE_INFO.name} — Tienda online de tecnología en {STORE_INFO.city}, {STORE_INFO.country}. Productos originales con garantía oficial, envíos a todo el país y atención personalizada por WhatsApp.
            </p>
            <div className="flex gap-2">
              {[
                { name: 'whatsapp', href: STORE_INFO.whatsappLink, label: 'WhatsApp' },
                { name: 'instagram', href: STORE_INFO.social.instagram, label: 'Instagram' },
                { name: 'phone', href: `tel:${STORE_INFO.whatsapp.replace(/\s/g, '')}`, label: 'Teléfono' },
                { name: 'mail', href: `mailto:${STORE_INFO.email}`, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:-translate-y-0.5 transition"
                >
                  <Icon name={s.name === 'instagram' ? 'share' : s.name} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Categorías</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalogo/${cat.id}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atención */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Atención</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/catalogo" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Catálogo completo</Link></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20quiero%20consultar%20por%20un%20producto`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Comprar por WhatsApp</a></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20necesito%20soporte%20t%C3%A9cnico`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Soporte técnico</a></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20quiero%20saber%20sobre%20garant%C3%ADas`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Garantías</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Info</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20quiero%20saber%20sobre%20TechNova`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Sobre nosotros</a></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20quiero%20saber%20sobre%20env%C3%ADos`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Envíos y entregas</a></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20quiero%20saber%20sobre%20m%C3%A9todos%20de%20pago`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Métodos de pago</a></li>
              <li><a href={`${STORE_INFO.whatsappLink}?text=Hola%2C%20tengo%20una%20pregunta`} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Icon name="whatsapp" className="h-4 w-4 text-[#25D366] flex-shrink-0 mt-0.5" />
                <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {STORE_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="mail" className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="mapPin" className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{STORE_INFO.city}, {STORE_INFO.country}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="clock" className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{STORE_INFO.schedule}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-4 text-center">Medios de pago aceptados</h4>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {STORE_INFO.paymentMethods.map((method) => (
              <span key={method} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Icon name="checkCircle" className="h-4 w-4 text-emerald-500" />
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'truck', title: 'Envío a todo el país', desc: 'Asunción, Central e interior' },
            { icon: 'shield', title: 'Garantía oficial', desc: '12 meses en todos los productos' },
            { icon: 'whatsapp', title: 'Compra por WhatsApp', desc: 'Atención inmediata y simple' },
            { icon: 'refresh', title: 'Devolución fácil', desc: '7 días para cambios' },
          ].map((b) => (
            <div key={b.title} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex-shrink-0">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{b.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} {STORE_INFO.name} · {STORE_INFO.city}, {STORE_INFO.country}
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono">RUC: 800XXXXX-1</span>
            <span>·</span>
            <span>{STORE_INFO.city}, {STORE_INFO.country}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
