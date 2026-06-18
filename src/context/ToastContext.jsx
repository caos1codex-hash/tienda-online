import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext({ toast: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success', duration = 2600) => {
    const id = Date.now() + Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-emerald-500">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-rose-500">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brand-500">
        <path d="M12 8v.01M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-card-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                {icons[t.type] || icons.info}
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
