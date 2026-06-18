import { WHATSAPP_NUMBER } from '../data/products'

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

// Construye el mensaje de WhatsApp con el carrito
export function buildWhatsappMessage(cart, totals) {
  if (!cart || cart.length === 0) return null

  const lines = []
  lines.push('Hola, quiero realizar el siguiente pedido:')
  lines.push('')
  lines.push('🛒 PRODUCTOS:')
  lines.push('')

  cart.forEach((item, idx) => {
    lines.push(`*${idx + 1}. ${item.name}*`)
    lines.push(`   • Cantidad: ${item.qty}`)
    lines.push(`   • Precio: ${formatPrice(item.price)}`)
    lines.push(`   • Subtotal: ${formatPrice(item.price * item.qty)}`)
    lines.push('')
  })

  lines.push('──────────────')
  lines.push(`💰 Subtotal: ${formatPrice(totals.subtotal)}`)
  if (totals.shipping > 0) {
    lines.push(`🚚 Envío: ${formatPrice(totals.shipping)}`)
  } else {
    lines.push(`🚚 Envío: ¡GRATIS!`)
  }
  lines.push(`💵 *TOTAL: ${formatPrice(totals.total)}*`)
  lines.push('──────────────')
  lines.push('')
  lines.push('Por favor, deseo confirmar mi compra.')

  return lines.join('\n')
}

// Genera la URL completa de WhatsApp con el mensaje
export function buildWhatsappUrl(cart, totals) {
  const msg = buildWhatsappMessage(cart, totals)
  if (!msg) return null
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

// Mensaje para un solo producto (botón Comprar Ahora en detalle)
export function buildSingleProductWhatsapp(product, qty = 1) {
  const lines = []
  lines.push('Hola, quiero realizar el siguiente pedido:')
  lines.push('')
  lines.push('🛒 PRODUCTOS:')
  lines.push('')
  lines.push(`*1. ${product.name}*`)
  lines.push(`   • Cantidad: ${qty}`)
  lines.push(`   • Precio: ${formatPrice(product.price)}`)
  lines.push(`   • Subtotal: ${formatPrice(product.price * qty)}`)
  lines.push('')
  lines.push('──────────────')
  const total = product.price * qty
  const shipping = total < 500000 ? 30000 : 0
  lines.push(`💰 Subtotal: ${formatPrice(total)}`)
  if (shipping > 0) {
    lines.push(`🚚 Envío: ${formatPrice(shipping)}`)
  } else {
    lines.push(`🚚 Envío: ¡GRATIS!`)
  }
  lines.push(`💵 *TOTAL: ${formatPrice(total + shipping)}*`)
  lines.push('──────────────')
  lines.push('')
  lines.push('Por favor, deseo confirmar mi compra.')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

// Slugificación simple por si hace falta
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
