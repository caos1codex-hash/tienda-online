import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/tienda-online">
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <RecentlyViewedProvider>
                <App />
              </RecentlyViewedProvider>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
