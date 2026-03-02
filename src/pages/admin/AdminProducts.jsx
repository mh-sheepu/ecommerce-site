import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import { useSettings } from '../../context/SettingsContext'
import AdminLayout from '../../components/admin/AdminLayout'

function AdminProducts() {
  const { products, deleteProduct, toggleProductStatus, resetToDefault } = useProducts()
  const { formatPrice } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const categories = [...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && product.active) ||
                         (filterStatus === 'inactive' && !product.active)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
    }
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const handleResetData = () => {
    if (window.confirm('Reset all products to default? This will remove all custom products.')) {
      resetToDefault()
    }
  }

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p>Manage your store products</p>
          </div>
          <div className="header-actions">
            <button className="btn-reset" onClick={handleResetData}>
              Reset to Default
            </button>
            <Link to="/admin/products/new" className="btn-add">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Products Count */}
        <div className="results-info">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Products Table */}
        <div className="products-table-wrapper">
          <table className="products-table admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} />
                      <div className="product-info-cell">
                        <span className="product-name">{product.name}</span>
                        {product.badge && (
                          <span className="product-badge-small">{product.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">{product.category}</span>
                  </td>
                  <td>
                    <div className="price-cell">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`stock-badge ${(product.stock || 0) < 20 ? 'low' : ''}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`status-toggle ${product.active ? 'active' : 'inactive'}`}
                      onClick={() => toggleProductStatus(product.id)}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        className="action-btn edit"
                        title="Edit"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteClick(product)}
                        title="Delete"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-icon danger">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2>Delete Product</h2>
              <p>Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn-delete" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminProducts
