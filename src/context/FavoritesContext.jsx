import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'

const FavoritesContext = createContext(null)

const STORAGE_KEY = 'technova-favorites-v1'

function loadFavorites() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.includes(action.id)
      return exists ? state.filter((id) => id !== action.id) : [...state, action.id]
    }
    case 'ADD':
      return state.includes(action.id) ? state : [...state, action.id]
    case 'REMOVE':
      return state.filter((id) => id !== action.id)
    case 'CLEAR':
      return []
    case 'HYDRATE':
      return action.favorites
    default:
      return state
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    dispatch({ type: 'HYDRATE', favorites: loadFavorites() })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const toggleFavorite = useCallback((id) => dispatch({ type: 'TOGGLE', id }), [])
  const addFavorite = useCallback((id) => dispatch({ type: 'ADD', id }), [])
  const removeFavorite = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const clearFavorites = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const value = {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    count: favorites.length,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
