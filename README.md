# 🛒 TechNova PY — Tienda Online Premium

> Tienda online de tecnología construida con **React + Vite + Tailwind CSS + Framer Motion**. Diseño premium AAA, modo claro/oscuro, compra directa por WhatsApp y deploy automático a GitHub Pages.

![Status](https://img.shields.io/badge/status-production-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

🔗 **Demo en vivo:** https://caos1codex-hash.github.io/tienda-online/

---

## 🎯 Características

### Experiencia premium
- ✨ Diseño AAA comparable a Shopify, Apple Store, Stripe
- 🌗 Modo claro/oscuro con persistencia y auto-detección
- 🎬 Animaciones fluidas con Framer Motion (scroll reveal, hover, transiciones)
- 📱 Mobile-first responsive design
- 🪟 Glassmorphism, gradientes y sombras profesionales
- ⚡ Performance optimizado (code-splitting, lazy loading, vendor chunks)

### Catálogo
- 📦 30 productos realistas distribuidos en 6 categorías
- 🔍 Buscador en tiempo real
- 🎛️ Filtros avanzados (categoría, precio, marca, ofertas, stock)
- ↕️ Ordenamiento (popularidad, precio, nombre, rating)
- 🖼️ Galería de imágenes con zoom (hover) en detalle
- 📋 Especificaciones técnicas detalladas
- 🔗 Productos relacionados
- ⭐ Reseñas y ratings

### Carrito y checkout
- 🛒 Carrito lateral (drawer) con animaciones
- 💾 Persistencia en `localStorage`
- ➕ Manejo de cantidades (incrementar/decrementar)
- 🗑️ Eliminar productos individuales o vaciar todo
- 📦 Cálculo automático de subtotal, envío y total
- 🚚 Envío gratis en compras +Gs. 500.000

### Compra por WhatsApp
- 📱 Botón **"Comprar ahora"** en detalle de producto
- 🛒 Botón **"Finalizar pedido por WhatsApp"** en carrito
- 💬 Genera mensaje automático con todo el detalle del pedido
- 📞 Número: **+595 981 103 689** (Paraguay)
- 🔗 Abre `https://wa.me/595981103689` con mensaje precargado

### SEO
- 🏷️ Meta tags optimizados (Open Graph, Twitter Cards)
- 🗺️ Sitemap.xml generado
- 🤖 Robots.txt configurado
- 📊 Structured data (JSON-LD) para OnlineStore + Product
- 🌐 URLs amigables (slug)
- 🎨 Favicon SVG
- 📋 Manifest PWA-ready

### DevOps
- 🤖 GitHub Actions para deploy automático
- 🚀 Publicación a GitHub Pages en cada push a `main`
- ✅ Build optimizado con Vite (minificación, code-splitting)
- 📦 Sin dependencias de runtime externas (solo React, Framer Motion, React Router)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3 | UI library |
| React Router DOM | 6.26 | Routing SPA |
| Vite | 5.4 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling utility-first |
| Framer Motion | 11.3 | Animaciones |
| ESLint | — | Linting |
| GitHub Actions | — | CI/CD |

---

## 📁 Estructura del Proyecto

```
tienda-online/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow GitHub Actions → Pages
├── public/
│   ├── .nojekyll               # Desactiva Jekyll en Pages
│   ├── favicon.svg             # Favicon SVG premium
│   ├── manifest.webmanifest    # PWA manifest
│   ├── robots.txt              # SEO
│   └── sitemap.xml             # SEO
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx      # Carrito lateral animado
│   │   ├── Footer.jsx          # Footer con newsletter y links
│   │   ├── Header.jsx          # Header sticky con dropdown
│   │   ├── Icon.jsx            # Set de iconos SVG inline
│   │   ├── ProductCard.jsx     # Card de producto premium
│   │   └── ScrollToTop.jsx     # Helper scroll-to-top
│   ├── context/
│   │   ├── CartContext.jsx     # Estado global del carrito
│   │   ├── ThemeContext.jsx    # Estado del tema claro/oscuro
│   │   └── ToastContext.jsx    # Notificaciones toast
│   ├── data/
│   │   └── products.js         # 30 productos + helpers
│   ├── pages/
│   │   ├── Catalog.jsx         # Catálogo con filtros
│   │   ├── Home.jsx            # Landing completa
│   │   ├── NotFound.jsx        # 404
│   │   └── ProductDetail.jsx   # Detalle con galería y zoom
│   ├── utils/
│   │   └── format.js           # Formato de precios + WhatsApp
│   ├── App.jsx                 # App root + routing
│   ├── index.css               # Estilos globales Tailwind
│   └── main.jsx                # Entry point
├── index.html                  # HTML root con SEO meta
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js              # Configuración con base path
└── README.md
```

---

## 🚀 Instalación y desarrollo

### Requisitos
- Node.js 18+
- npm 9+

### Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🌐 Deploy a GitHub Pages

El deploy es **automático** mediante GitHub Actions:

1. Hacé un `push` a la rama `main`.
2. El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente.
3. Build de producción con Vite → upload artifact → deploy a Pages.
4. La tienda queda disponible en: `https://<usuario>.github.io/tienda-online/`

### Configuración manual (una sola vez)

1. Andá a **Settings → Pages** del repositorio.
2. En **Source**, seleccioná **GitHub Actions**.
3. Listo. Cada push a `main` dispara un deploy.

> ⚠️ **Importante:** El `base` path en `vite.config.js` está configurado como `/tienda-online/`. Si renombrás el repositorio, actualizá también este valor y los paths en `index.html`, `manifest.webmanifest`, `robots.txt` y `sitemap.xml`.

---

## 📱 Configurar compra por WhatsApp

El número de WhatsApp está centralizado en `src/data/products.js`:

```js
export const WHATSAPP_NUMBER = '595981103689' // Paraguay
```

Para cambiarlo, editá esta constante. El formato debe ser internacional sin `+` ni espacios.

### Formato del mensaje generado

```
Hola, quiero realizar el siguiente pedido:

🛒 PRODUCTOS:

*1. Aurora X15 Pro*
   • Cantidad: 2
   • Precio: Gs. 4.990.000
   • Subtotal: Gs. 9.980.000

*2. Mech Keyboard RGB Pro*
   • Cantidad: 1
   • Precio: Gs. 890.000
   • Subtotal: Gs. 890.000

──────────────
💰 Subtotal: Gs. 10.870.000
🚚 Envío: ¡GRATIS!
💵 *TOTAL: Gs. 10.870.000*
──────────────

Por favor, deseo confirmar mi compra.
```

---

## 🎨 Personalización

### Cambiar colores de marca

Editá `tailwind.config.js` en la sección `theme.extend.colors`:

```js
brand: {
  500: '#327bff', // Color principal
  600: '#1c5cf5',
  // ...
},
accent: {
  500: '#f97316', // Color de acento
  // ...
}
```

### Agregar productos

Editá `src/data/products.js` y agregá un nuevo objeto al array `PRODUCTS`:

```js
{
  id: 'p-037',
  slug: 'mi-producto',
  name: 'Mi Producto',
  brand: 'Marca',
  category: 'smartphones', // uno de CATEGORIES.id
  price: 1000000,
  oldPrice: null,
  rating: 4.5,
  reviews: 0,
  stock: 10,
  tags: ['Nuevo'],
  badge: 'Nuevo',
  popularity: 70,
  description: '...',
  images: ['url1', 'url2', 'url3'],
  specs: { 'Pantalla': '...', ... }
}
```

---

## 📊 Lighthouse Performance

Optimizaciones aplicadas:
- ✅ Code-splitting (React vendor + Framer Motion en chunks separados)
- ✅ Lazy loading de imágenes (`loading="lazy"`)
- ✅ Minificación ESBuild
- ✅ Source maps desactivados en producción
- ✅ Fonts con `preconnect`
- ✅ Imágenes desde Unsplash CDN con `auto=format`
- ✅ Sin dependencias pesadas

---

## 📝 Licencia

MIT © 2025 TechNova PY

---

## 🤝 Soporte

- 📱 WhatsApp: [+595 981 103 689](https://wa.me/595981103689)
- 🌐 Demo: https://caos1codex-hash.github.io/tienda-online/
- 📦 Repo: https://github.com/caos1codex-hash/tienda-online

---

Hecho con ❤️ en Paraguay 🇵🇾
