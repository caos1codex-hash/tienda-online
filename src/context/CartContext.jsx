import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'technova-cart-v1'

function loadCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((i) => i && typeof i.id === 'string' && Number.isInteger(i.qty) && i.qty > 0)
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, qty = 1 } = action
      const existing = state.find((i) => i.id === product.id)
      if (existing) {
        return state.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
        )
      }
      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          category: product.category,
          slug: product.slug,
          qty: Math.min(qty, 99),
        },
      ]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'SET_QTY': {
      const { id, qty } = action
      if (qty <= 0) return state.filter((i) => i.id !== id)
      return state.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i))
    }
    case 'INC':
      return state.map((i) => (i.id === action.id ? { ...i, qty: Math.min(i.qty + 1, 99) } : i))
    case 'DEC':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    case 'CLEAR':
      return []
    case 'HYDRATE':
      return action.cart
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, [])

  // Hydrate on mount
  useEffect(() => {
    dispatch({ type: 'HYDRATE', cart: loadCart() })
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'HYDRATE', cart: loadCart() })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addItem = useCallback((product, qty = 1) => dispatch({ type: 'ADD', product, qty }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const setQty = useCallback((id, qty) => dispatch({ type: 'SET_QTY', id, qty }), [])
  const incItem = useCallback((id) => dispatch({ type: 'INC', id }), [])
  const decItem = useCallback((id) => dispatch({ type: 'DEC', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const totals = useMemo(() => {
    const count = cart.reduce((s, i) => s + i.qty, 0)
    const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
    const shipping = subtotal > 0 && subtotal < 500000 ? 30000 : 0
    const total = subtotal + shipping
    return { count, subtotal, shipping, total }
  }, [cart])

  const value = {
    cart,
    addItem,
    removeItem,
    setQty,
    incItem,
    decItem,
    clearCart,
    ...totals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
