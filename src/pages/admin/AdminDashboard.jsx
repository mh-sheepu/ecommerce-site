import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useSettings } from '../../context/SettingsContext'
import AdminLayout from '../../components/admin/AdminLayout'

function AdminDashboard() {
  const { products, getCategories, getActiveProducts } = useProducts()
  const { cartItems } = useCart()
  const { settings, formatPrice } = useSettings()

  const totalProducts = products.length
  const activeProducts = getActiveProducts().length
  const categories = getCategories().length
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
  const lowStockProducts = products.filter(p => (p.stock || 0) < 20)

  const recentProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>{totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>{activeProducts}</h3>
              <p>Active Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>{categories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>{totalStock}</h3>
              <p>Total Stock</p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Products */}
        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/admin/products/new" className="quick-action-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </Link>
              <Link to="/admin/products" className="quick-action-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                View All Products
              </Link>
              <Link to="/admin/settings" className="quick-action-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Store Settings
              </Link>
              <Link to="/" className="quick-action-btn" target="_blank">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Store
              </Link>
            </div>
          </div>

          {/* Inventory Value */}
          <div className="dashboard-card">
            <h2>Inventory Overview</h2>
            <div className="inventory-stats">
              <div className="inventory-stat">
                <span className="inventory-label">Total Inventory Value</span>
                <span className="inventory-value">{formatPrice(totalValue)}</span>
              </div>
              <div className="inventory-stat">
                <span className="inventory-label">Low Stock Items</span>
                <span className="inventory-value warning">{lowStockProducts.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Settings Overview */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🚚 Delivery Settings</h2>
              <Link to="/admin/settings" className="view-all">Edit →</Link>
            </div>
            <div className="settings-overview">
              <div className="setting-overview-item">
                <span className="setting-label">Standard Delivery</span>
                <span className="setting-value">{formatPrice(settings.delivery.standardDeliveryPrice)}</span>
              </div>
              <div className="setting-overview-item">
                <span className="setting-label">Express Delivery</span>
                <span className="setting-value">{formatPrice(settings.delivery.expressDeliveryPrice)}</span>
              </div>
              <div className="setting-overview-item">
                <span className="setting-label">Free Delivery Threshold</span>
                <span className="setting-value">
                  {settings.delivery.freeDeliveryEnabled 
                    ? formatPrice(settings.delivery.freeDeliveryThreshold) 
                    : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>💰 Tax & Discounts</h2>
              <Link to="/admin/settings" className="view-all">Edit →</Link>
            </div>
            <div className="settings-overview">
              <div className="setting-overview-item">
                <span className="setting-label">VAT Rate</span>
                <span className="setting-value">
                  {settings.tax.vatEnabled ? `${settings.tax.vatRate}%` : 'Disabled'}
                </span>
              </div>
              <div className="setting-overview-item">
                <span className="setting-label">Global Discount</span>
                <span className="setting-value">
                  {settings.discount.globalDiscountEnabled 
                    ? `${settings.discount.globalDiscountPercent}% off` 
                    : 'None'}
                </span>
              </div>
              <div className="setting-overview-item">
                <span className="setting-label">Promo Code</span>
                <span className="setting-value">
                  {settings.discount.promoCodeEnabled 
                    ? `${settings.discount.promoCode} (${settings.discount.promoCodeDiscount}% off)` 
                    : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2>Recent Products</h2>
            <Link to="/admin/products" className="view-all">View All →</Link>
          </div>
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.image} alt={product.name} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <span className={`stock-badge ${(product.stock || 0) < 20 ? 'low' : ''}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="dashboard-card full-width alert-card">
            <div className="alert-header">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2>Low Stock Alert</h2>
            </div>
            <div className="low-stock-list">
              {lowStockProducts.map(product => (
                <div key={product.id} className="low-stock-item">
                  <img src={product.image} alt={product.name} />
                  <div className="low-stock-info">
                    <span className="product-name">{product.name}</span>
                    <span className="stock-count">{product.stock || 0} in stock</span>
                  </div>
                  <Link to={`/admin/products/edit/${product.id}`} className="restock-btn">
                    Update Stock
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
