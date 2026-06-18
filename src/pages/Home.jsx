import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CATEGORIES, PRODUCTS, getFeatured, getPopular } from '../data/products'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'

const featured = getFeatured()
const popular = getPopular()
const newArrivals = PRODUCTS.filter((p) => p.tags.includes('Nuevo') || p.badge === 'Nuevo').slice(0, 4)
const offers = PRODUCTS.filter((p) => p.oldPrice).slice(0, 8)

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <PopularProducts />
      <OffersSection />
      <BenefitsSection />
      <Testimonials />
      <FAQ />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      <div className="container-app">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Nueva colección 2025 disponible
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Tecnología que <span className="text-gradient">potencia</span> tu día a día
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Smartphones, laptops, gaming, audio y smart home de las mejores marcas. Calidad premium, garantía oficial y compra directa por WhatsApp en todo Paraguay.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-primary text-base">
                Explorar catálogo
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/595981103689" target="_blank" rel="noreferrer" className="btn-whatsapp text-base">
                <Icon name="whatsapp" className="h-5 w-5" />
                Comprar ahora
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: '30+', label: 'Productos premium' },
                { value: '6', label: 'Categorías' },
                { value: '24/7', label: 'Soporte WhatsApp' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl lg:text-3xl font-extrabold text-gradient">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-mesh opacity-30 dark:opacity-50 blur-3xl rounded-full animate-pulse-glow" />

              {/* Featured product card */}
              <Link
                to={`/producto/${featured[0]?.slug || 'aurora-x15-pro'}`}
                className="relative group block"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative aspect-square rounded-3xl overflow-hidden glass-strong shadow-card-hover"
                >
                  <img
                    src={featured[0]?.images[0] || PRODUCTS[0].images[0]}
                    alt={featured[0]?.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="badge bg-brand-500 text-white mb-2">Destacado</span>
                    <h3 className="text-white font-display font-bold text-2xl">{featured[0]?.name}</h3>
                    <p className="text-white/80 text-sm mt-1">Desde {featured[0] && formatGs(featured[0].price)}</p>
                  </div>
                </motion.div>
              </Link>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-6 -left-6 hidden sm:block glass-strong rounded-2xl p-4 shadow-card-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                    <Icon name="truck" className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Envío gratis</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Todo el país</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-6 hidden sm:block glass-strong rounded-2xl p-4 shadow-card-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600">
                    <Icon name="shield" className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Garantía</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">12 meses</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function formatGs(value) {
  return 'Gs. ' + new Intl.NumberFormat('es-PY').format(value)
}

function TrustBar() {
  const items = [
    { icon: 'truck', title: 'Envío gratis', desc: 'En compras +Gs. 500.000' },
    { icon: 'whatsapp', title: 'Compra por WhatsApp', desc: 'Atención inmediata' },
    { icon: 'shield', title: 'Garantía oficial', desc: '12 meses' },
    { icon: 'refresh', title: 'Devolución 7 días', desc: 'Sin preguntas' },
    { icon: 'zap', title: 'Despacho 24hs', desc: 'En Asunción y Central' },
  ]

  return (
    <section className="py-6 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-app">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 group">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{item.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          eyebrow="Categorías"
          title="Explorá por categoría"
          desc="Encontrá justo lo que buscás en nuestras categorías especializadas."
          to="/catalogo"
          ctaLabel="Ver todo el catálogo"
        />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                to={`/catalogo/${cat.id}`}
                className="group block p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver productos
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          eyebrow="Selección"
          title="Productos destacados"
          desc="Lo mejor de nuestro catálogo, elegido por nuestros especialistas."
          to="/catalogo"
          ctaLabel="Ver todos"
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="py-8 lg:py-12">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-accent-950 dark:from-slate-900 dark:via-brand-950 dark:to-accent-950 p-8 lg:p-14"
        >
          {/* Decorative */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="badge bg-accent-500 text-white shadow-lg">
                <Icon name="zap" className="h-3 w-3" />
                Oferta relámpago
              </span>
              <h2 className="mt-4 font-display text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                Hasta 30% OFF en<br />
                <span className="text-gradient-accent">tech premium</span>
              </h2>
              <p className="mt-3 text-white/80 text-lg max-w-md">
                Smartphones flagship, laptops creator y audio premium con descuentos que no se repiten. Solo por esta semana.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/catalogo" className="btn-accent text-base">
                  Aprovechar oferta
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <a href="https://wa.me/595981103689?text=Hola%2C%20vi%20la%20oferta%20rel%C3%A1mpago%20y%20quiero%20m%C3%A1s%20info" target="_blank" rel="noreferrer" className="btn-ghost text-base border-white/30 text-white hover:bg-white hover:text-slate-900">
                  <Icon name="whatsapp" className="h-5 w-5" />
                  Consultar
                </a>
              </div>
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: '02', label: 'Días' },
                { value: '14', label: 'Horas' },
                { value: '32', label: 'Min' },
                { value: '58', label: 'Seg' },
              ].map((t) => (
                <div key={t.label} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                  <div className="font-display text-3xl lg:text-4xl font-extrabold text-white">{t.value}</div>
                  <div className="text-xs text-white/70 mt-1 uppercase tracking-wider">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function NewArrivals() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          eyebrow="Recién llegado"
          title="Lo más nuevo"
          desc="Los lanzamientos más recientes que acabamos de incorporar."
          to="/catalogo"
          ctaLabel="Ver novedades"
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PopularProducts() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-app">
        <SectionHeader
          eyebrow="Trending"
          title="Los más populares"
          desc="Lo que todos están comprando esta semana."
          to="/catalogo"
          ctaLabel="Ver más"
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {popular.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OffersSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          eyebrow="Ahorro"
          title="Ofertas imperdibles"
          desc="Productos con descuentos reales por tiempo limitado."
          to="/catalogo"
          ctaLabel="Ver todas las ofertas"
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {offers.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      icon: 'shield',
      title: 'Garantía oficial',
      desc: 'Todos nuestros productos cuentan con garantía oficial del fabricante de 12 meses, respaldada por servicio técnico local.',
    },
    {
      icon: 'truck',
      title: 'Envíos a todo Paraguay',
      desc: 'Despachamos a Asunción, Gran Asunción y todo el interior del país. Envío gratis en compras superiores a Gs. 500.000.',
    },
    {
      icon: 'whatsapp',
      title: 'Compra fácil y segura',
      desc: 'Hacé tu pedido por WhatsApp en menos de un minuto. Atención personalizada y respuesta inmediata de nuestro equipo.',
    },
    {
      icon: 'headset',
      title: 'Soporte 24/7',
      desc: 'Nuestro equipo está disponible todos los días para resolver cualquier consulta sobre productos, envíos o garantías.',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-app">
        <SectionHeader
          eyebrow="Por qué elegirnos"
          title="La mejor experiencia de compra"
          desc="En TechNova PY nos enfocamos en que comprar tecnología sea simple, rápido y seguro."
        />

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow mb-4">
                <Icon name={b.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Cliente verificada',
      avatar: 'https://i.pravatar.cc/100?img=47',
      rating: 5,
      text: 'Compré mi laptop Nova Air por WhatsApp y la recibí al día siguiente. Atención impecable y producto 100% original. ¡Recomendadísimo!',
    },
    {
      name: 'Carlos Benítez',
      role: 'Cliente verificado',
      avatar: 'https://i.pravatar.cc/100?img=12',
      rating: 5,
      text: 'El mejor precio que encontré en Paraguay para mi smartphone. El proceso de compra fue rapidísimo y el soporte por WhatsApp siempre contestó al instante.',
    },
    {
      name: 'Andrea Vega',
      role: 'Cliente verificada',
      avatar: 'https://i.pravatar.cc/100?img=44',
      rating: 5,
      text: 'Excelente experiencia. Compré auriculares y un parlante, llegaron bien empaquetados con garantía oficial. Volveré a comprar sin duda.',
    },
  ]

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
          desc="Miles de paraguayos ya confiaron en TechNova PY."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Icon key={j} name="star" className="h-4 w-4 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover border-2 border-brand-200 dark:border-brand-900"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Icon name="checkCircle" className="h-3 w-3 text-emerald-500" />
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    {
      q: '¿Cómo realizo una compra?',
      a: 'Es muy simple. Elegí el producto que querés, agregalo al carrito y presioná "Finalizar pedido por WhatsApp". Se abrirá WhatsApp con todo el detalle de tu pedido, listo para que lo envíes y nuestro equipo lo confirme.',
    },
    {
      q: '¿Cuánto tarda el envío?',
      a: 'En Asunción y Gran Asunción despachamos en 24 horas hábiles. Para el interior del país, el envío tarda entre 2 y 4 días hábiles dependiendo de la zona. Te enviamos el número de seguimiento por WhatsApp.',
    },
    {
      q: '¿Qué formas de pago aceptan?',
      a: 'Aceptamos transferencias bancarias, depósitos, giros y pagos móviles. Coordinamos el método que más te convenga directamente por WhatsApp al confirmar tu pedido.',
    },
    {
      q: '¿Los productos tienen garantía?',
      a: 'Sí, todos nuestros productos cuentan con garantía oficial del fabricante de 12 meses mínimo. Algunos productos premium tienen hasta 24 meses de garantía.',
    },
    {
      q: '¿Puedo devolver un producto?',
      a: 'Por supuesto. Tenés 7 días desde la recepción para devolver o cambiar el producto si no estás conforme, siempre que esté en su estado original con todos sus accesorios y empaque.',
    },
    {
      q: '¿Hacen envíos a todo el país?',
      a: 'Sí, hacemos envíos a todo Paraguay. En compras superiores a Gs. 500.000 el envío es GRATIS dentro de Asunción y Gran Asunción. Para el interior consultá el costo por WhatsApp.',
    },
  ]

  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-app">
        <SectionHeader
          eyebrow="Ayuda"
          title="Preguntas frecuentes"
          desc="Resolvé tus dudas más comunes sobre nuestra tienda."
        />

        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                aria-expanded={openIdx === i}
              >
                <span className="font-semibold text-slate-900 dark:text-white">{f.q}</span>
                <motion.span
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-slate-400"
                >
                  <Icon name="chevronDown" className="h-5 w-5" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIdx === i ? 'auto' : 0, opacity: openIdx === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <p className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">¿No encontrás lo que buscás?</p>
          <a href="https://wa.me/595981103689?text=Hola%2C%20tengo%20una%20consulta" target="_blank" rel="noreferrer" className="btn-whatsapp">
            <Icon name="whatsapp" className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ eyebrow, title, desc, to, ctaLabel }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-2xl">
        <span className="section-eyebrow">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
        <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold tracking-tight">
          {title}
        </h2>
        {desc && <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">{desc}</p>}
      </div>
      {to && ctaLabel && (
        <Link to={to} className="btn-ghost self-start md:self-auto flex-shrink-0">
          {ctaLabel}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
