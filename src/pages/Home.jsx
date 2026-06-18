import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CATEGORIES, PRODUCTS, getFeatured, getPopular, getMoreSold, getOffers, STORE_INFO } from '../data/products'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { formatPrice } from '../utils/format.js'

const featured = getFeatured()
const popular = getPopular()
const bestSellers = getMoreSold()
const offers = getOffers()

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PaymentBar />
      <CategoriesSection />
      <BestSellers />
      <PromoBanner />
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">
              <Icon name="zap" className="h-3.5 w-3.5" />
              Envíos a todo Paraguay · Garantía oficial
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Tecnología real,<br />
              <span className="text-gradient">precios justos</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
              Samsung, iPhone, Lenovo, JBL y más. Comprá desde Asunción con garantía oficial, envíos a todo el país y atención por WhatsApp. Sin sorpresas, sin letras chiquitas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-primary text-base">
                Ver catálogo
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="btn-whatsapp text-base">
                <Icon name="whatsapp" className="h-5 w-5" />
                Comprar por WhatsApp
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Icon name="truck" className="h-4 w-4 text-emerald-500" />
                <span>Envío gratis +Gs. 500K</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="shield" className="h-4 w-4 text-brand-500" />
                <span>Garantía 12 meses</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="h-4 w-4 text-amber-500" />
                <span>Productos originales</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-accent-500/20 blur-2xl" />
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=600&fit=crop"
                  alt="Tecnología en Paraguay - TechNova PY"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-display font-bold text-xl">Samsung Galaxy S25 Ultra</p>
                  <p className="text-white/80 text-sm mt-1">Desde {formatPrice(6490000)} · En stock</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TrustBar() {
  const items = [
    { icon: 'truck', title: 'Envío a todo Paraguay', desc: 'Asunción, Central e interior' },
    { icon: 'shield', title: 'Garantía oficial', desc: '12 meses en todos los productos' },
    { icon: 'whatsapp', title: 'Atención por WhatsApp', desc: 'Respondemos en minutos' },
    { icon: 'refresh', title: 'Devolución fácil', desc: '7 días para cambios' },
    { icon: 'package', title: 'Productos originales', desc: 'Factura y garantía incluida' },
  ]

  return (
    <section className="py-6 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
      <div className="container-app">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex-shrink-0">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PaymentBar() {
  const methods = [
    { name: 'Bancard', label: 'Bancard' },
    { name: 'Visa', label: 'Visa' },
    { name: 'Mastercard', label: 'Mastercard' },
    { name: 'Transferencia', label: 'Transferencia' },
    { name: 'Efectivo', label: 'Efectivo' },
  ]

  return (
    <section className="py-4 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
      <div className="container-app flex items-center justify-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Medios de pago:</span>
        {methods.map((m) => (
          <span key={m.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Icon name="checkCircle" className="h-3.5 w-3.5 text-emerald-500" />
            {m.label}
          </span>
        ))}
      </div>
    </section>
  )
}

function CategoriesSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-app">
        <div className="text-center mb-10">
          <span className="section-eyebrow">
            <Icon name="grid" className="h-3.5 w-3.5" />
            Categorías
          </span>
          <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold">
            Encontrá lo que buscás
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Smartphones, laptops, audio y accesorios. Todo con garantía oficial y envíos a todo Paraguay.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/catalogo/${cat.id}`}
                className="group relative block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 lg:p-8 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{cat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
                  Ver productos <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BestSellers() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/60">
      <div className="container-app">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-eyebrow">
              <Icon name="zap" className="h-3.5 w-3.5" />
              Lo más vendido
            </span>
            <h2 className="mt-3 font-display text-3xl lg:text-4xl font-extrabold">
              Los favoritos de Paraguay
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Productos que nuestros clientes vuelven a recomendar.
            </p>
          </div>
          <Link to="/catalogo" className="btn-ghost hidden sm:inline-flex">
            Ver todo
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/catalogo" className="btn-ghost">
            Ver todo el catálogo
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 p-8 lg:p-14 shadow-glow">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                <Icon name="truck" className="h-3.5 w-3.5" />
                Envío gratis
              </span>
              <h2 className="mt-4 font-display text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                Comprás más de Gs. 500.000,<br />el envío va por nuestra cuenta
              </h2>
              <p className="mt-4 text-white/80 text-lg">
                Asunción, Gran Asunción e interior del país. Recibí tu pedido en la puerta de tu casa sin costo de envío en compras mayores a Gs. 500.000.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-slate-100 transition shadow-lg">
                  Aprovechar ahora
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <a href={STORE_INFO.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1da851] transition shadow-lg">
                  <Icon name="whatsapp" className="h-5 w-5" />
                  Consultar
                </a>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {PRODUCTS.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    to={`/producto/${p.slug}`}
                    className="rounded-xl overflow-hidden bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition group"
                  >
                    <img src={p.images[0]} alt={p.name} loading="lazy" className="h-24 w-full object-cover" />
                    <div className="p-2">
                      <p className="text-xs text-white/90 font-semibold line-clamp-1 group-hover:text-white">{p.name}</p>
                      <p className="text-xs text-white/60 font-bold">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OffersSection() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/60">
      <div className="container-app">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-eyebrow">
              <Icon name="zap" className="h-3.5 w-3.5" />
              Ofertas
            </span>
            <h2 className="mt-3 font-display text-3xl lg:text-4xl font-extrabold">
              Precios que convencen
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Productos con descuento real, sin letras chiquitas.
            </p>
          </div>
          <Link to="/catalogo" className="btn-ghost hidden sm:inline-flex">
            Ver ofertas
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {offers.slice(0, 8).map((p, i) => (
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
      title: 'Compra 100% segura',
      desc: 'Tus datos están protegidos. Pagá con Bancard, Visa, Mastercard o transferencia bancaria. En TechNova PY tu seguridad es prioridad.',
    },
    {
      icon: 'truck',
      title: 'Envíos a todo el país',
      desc: 'Llegamos a Asunción, Gran Asunción y todo el interior del Paraguay. Envío gratis en compras superiores a Gs. 500.000.',
    },
    {
      icon: 'whatsapp',
      title: 'Atención personalizada',
      desc: 'Escribinos por WhatsApp y te respondemos en minutos. Te asesoramos antes, durante y después de tu compra.',
    },
    {
      icon: 'refresh',
      title: 'Garantía y devolución',
      desc: '12 meses de garantía oficial del fabricante. Si no estás conforme, tenés 7 días para devolver el producto sin preguntas.',
    },
  ]

  return (
    <section className="py-16 lg:py-20">
      <div className="container-app">
        <div className="text-center mb-12">
          <span className="section-eyebrow">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Confianza garantizada
          </span>
          <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold">
            Comprá con total tranquilidad
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mb-4">
                <Icon name={b.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{b.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
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
      name: 'Roberto Acuña',
      city: 'Asunción',
      product: 'Samsung Galaxy S25 Ultra',
      date: 'Mayo 2025',
      rating: 5,
      text: 'Excelente producto, llegó antes de lo previsto y en perfectas condiciones. La atención por WhatsApp fue impecable, respondieron todas mis dudas al instante. Muy recomendable.',
      verified: true,
    },
    {
      name: 'Laura Méndez',
      city: 'Ciudad del Este',
      product: 'Lenovo LOQ 15',
      date: 'Abril 2025',
      rating: 5,
      text: 'Compré mi laptop gaming con miedo de que fuera una estafa pero todo salió perfecto. Producto original con factura y garantía. Ya hice mi segunda compra. Los super recomiendo.',
      verified: true,
    },
    {
      name: 'Diego Romero',
      city: 'Encarnación',
      product: 'JBL Flip 7',
      date: 'Junio 2025',
      rating: 4,
      text: 'Muy bueno, cumple todo lo prometido. El envío al interior tardó 3 días, pero el producto valió la pena. El sonido es increíble para el tamaño. Volvería a comprar.',
      verified: true,
    },
  ]

  return (
    <section className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/60">
      <div className="container-app">
        <div className="text-center mb-12">
          <span className="section-eyebrow">
            <Icon name="star" className="h-3.5 w-3.5" />
            Opiniones verificadas
          </span>
          <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Compras verificadas de clientes reales en Paraguay.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Icon key={j} name="star" className="h-4 w-4 text-amber-400" />
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, j) => (
                  <Icon key={`e${j}`} name="star" className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</span>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <Icon name="checkCircle" className="h-3 w-3" />
                        Verificada
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.city} · {t.product} · {t.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    {
      q: '¿Cómo realizo mi compra?',
      a: 'Elegí el producto, hacé clic en "Comprar ahora" y se abre WhatsApp con tu pedido completo. También podés agregar al carrito y finalizar todo desde ahí. Te respondemos en minutos para confirmar tu compra.',
    },
    {
      q: '¿Qué medios de pago aceptan?',
      a: 'Aceptamos Bancard, Visa, Mastercard, transferencia bancaria y efectivo. Todos los pagos son seguros y recibís tu factura correspondiente.',
    },
    {
      q: '¿Hacen envíos al interior del país?',
      a: 'Sí, enviamos a todo Paraguay. Asunción y Gran Asunción tienen envío gratis en compras superiores a Gs. 500.000. Para el interior, consultanos el costo de envío por WhatsApp.',
    },
    {
      q: '¿Los productos tienen garantía?',
      a: 'Todos nuestros productos tienen 12 meses de garantía oficial del fabricante. Además, tenés 7 días para devolver el producto si no estás conforme.',
    },
    {
      q: '¿Los productos son originales?',
      a: 'Sí, todos nuestros productos son 100% originales con factura y garantía del fabricante. No vendemos réplicas ni productos refurbidos.',
    },
    {
      q: '¿Cuánto tarda en llegar mi pedido?',
      a: 'En Asunción y Gran Asunción, de 1 a 2 días hábiles. En el interior del país, de 3 a 5 días hábiles. Te enviamos el seguimiento por WhatsApp.',
    },
  ]

  return (
    <section className="py-16 lg:py-20">
      <div className="container-app max-w-3xl">
        <div className="text-center mb-12">
          <span className="section-eyebrow">
            <Icon name="checkCircle" className="h-3.5 w-3.5" />
            Preguntas frecuentes
          </span>
          <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold">
            Todo lo que necesitás saber
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <Icon
                  name="chevronDown"
                  className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
