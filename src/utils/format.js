import { WHATSAPP_NUMBER, STORE_INFO } from '../data/products'

// Formato de moneda paraguaya (Guaraníes)
export function formatPrice(value) {
  if (value == null || isNaN(value)) return 'Gs. 0'
  return 'Gs. ' + new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(value)
}

export function formatPriceShort(value) {
  if (value == null) return 'Gs. 0'
  if (value >= 1000000) return `Gs. ${(value / 1000000).toFixed(1).replace('.0', '')}M`
  if (value >= 1000) return `Gs. ${Math.round(value / 1000)}K`
  return `Gs. ${value}`
}

// Construye el mensaje de WhatsApp Premium con el carrito completo
export function buildWhatsappMessage(cart, totals) {
  if (!cart || cart.length === 0) return null

  const lines = []
  lines.push('Hola, deseo realizar una compra.')
  lines.push('')
  lines.push('📦 PRODUCTOS:')
  lines.push('')

  cart.forEach((item, idx) => {
    lines.push(`*${idx + 1}. ${item.name}*`)
    lines.push(`   • Marca: ${item.brand || '—'}`)
    lines.push(`   • Precio unitario: ${formatPrice(item.price)}`)
    lines.push(`   • Cantidad: ${item.qty}`)
    lines.push(`   • Subtotal: ${formatPrice(item.price * item.qty)}`)
    lines.push('')
  })

  lines.push('─────────────────')
  lines.push(`💰 Subtotal: ${formatPrice(totals.subtotal)}`)
  if (totals.shipping > 0) {
    lines.push(`🚚 Envío: ${formatPrice(totals.shipping)}`)
  } else {
    lines.push(`🚚 Envío: ¡GRATIS!`)
  }
  lines.push(`💵 *TOTAL: ${formatPrice(totals.total)}*`)
  lines.push('─────────────────')
  lines.push('')
  lines.push('📍 Ciudad: [Ingrese su ciudad]')
  lines.push('💳 Método de pago: Transferencia / Efectivo / Tarjeta')
  lines.push('')
  lines.push('Observaciones:')
  lines.push('')
  lines.push('Gracias.')

  return lines.join('\n')
}

// Genera la URL completa de WhatsApp con el mensaje
export function buildWhatsappUrl(cart, totals) {
  const msg = buildWhatsappMessage(cart, totals)
  if (!msg) return null
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

// Mensaje premium para un solo producto
export function buildSingleProductWhatsapp(product, qty = 1) {
  const lines = []
  lines.push('Hola, deseo realizar una compra.')
  lines.push('')
  lines.push('📦 PRODUCTO:')
  lines.push(`• ${product.name}`)
  lines.push(`• Marca: ${product.brand}`)
  lines.push('')
  lines.push('💰 PRECIO:')
  lines.push(`• Unitario: ${formatPrice(product.price)}`)
  lines.push(`• Cantidad: ${qty}`)
  lines.push(`• Subtotal: ${formatPrice(product.price * qty)}`)
  if (product.oldPrice) {
    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    lines.push(`• Ahorro: ${formatPrice(product.oldPrice - product.price)} (${discount}% OFF)`)
  }
  lines.push('')
  const total = product.price * qty
  const shipping = total < STORE_INFO.freeShippingMin ? 30000 : 0
  lines.push(`🚚 Envío: ${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}`)
  lines.push(`💵 *TOTAL: ${formatPrice(total + shipping)}*`)
  lines.push('')
  lines.push('📍 Ciudad: [Ingrese su ciudad]')
  lines.push('💳 Método de pago: Transferencia / Efectivo / Tarjeta')
  lines.push('')
  lines.push('Observaciones:')
  lines.push('')
  lines.push('Gracias.')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

// Slugificación simple
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// Stars rendering data
export function ratingStars(rating) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return { full, hasHalf, empty: 5 - full - (hasHalf ? 1 : 0) }
}
