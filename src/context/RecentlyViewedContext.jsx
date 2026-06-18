import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'

const RecentlyViewedContext = createContext(null)

const STORAGE_KEY = 'technova-recently-viewed-v1'
const MAX_ITEMS = 10

function loadViewed() {
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
    case 'ADD': {
      // Remove if already exists, then add to front
      const filtered = state.filter((id) => id !== action.id)
      return [action.id, ...filtered].slice(0, MAX_ITEMS)
    }
    case 'HYDRATE':
      return action.viewed
    default:
      return state
  }
}

export function RecentlyViewedProvider({ children }) {
  const [viewed, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    dispatch({ type: 'HYDRATE', viewed: loadViewed() })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed))
    } catch {}
  }, [viewed])

  const addViewed = useCallback((id) => dispatch({ type: 'ADD', id }), [])

  const value = {
    viewed,
    addViewed,
  }

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
