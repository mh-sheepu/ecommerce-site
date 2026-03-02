import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ProductProvider>
            <OrdersProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrdersProvider>
          </ProductProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
