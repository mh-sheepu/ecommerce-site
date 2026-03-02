import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminSettings from './pages/admin/AdminSettings'
import AdminOrders from './pages/admin/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Admin routes don't use the main layout
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/products/new" element={
          <ProtectedRoute>
            <AdminProductForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute>
            <AdminProductForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
      </Routes>
    )
  }

  // Customer-facing routes
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
