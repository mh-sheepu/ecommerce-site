import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import AdminLayout from '../../components/admin/AdminLayout'

const badgeOptions = [
  { value: '', label: 'No Badge' },
  { value: 'New', label: 'New' },
  { value: 'Sale', label: 'Sale' },
  { value: 'Best Seller', label: 'Best Seller' },
  { value: 'Popular', label: 'Popular' },
  { value: 'Trending', label: 'Trending' },
  { value: 'Top Rated', label: 'Top Rated' },
]

const categoryOptions = [
  'Electronics',
  'Wearables',
  'Fashion',
  'Beauty',
  'Home',
  'Sports',
]

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, getProductById } = useProducts()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    badge: '',
    stock: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (isEditing) {
      const product = getProductById(id)
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          image: product.image,
          description: product.description,
          badge: product.badge || '',
          stock: product.stock?.toString() || '0',
        })
        setPreviewImage(product.image)
      } else {
        navigate('/admin/products')
      }
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Update image preview when URL changes
    if (name === 'image') {
      setPreviewImage(value)
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    
    if (formData.originalPrice && (isNaN(formData.originalPrice) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Enter a valid original price or leave empty'
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    }
    
    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Enter a valid stock quantity'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setSaving(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      image: formData.image.trim(),
      description: formData.description.trim(),
      badge: formData.badge || null,
      stock: parseInt(formData.stock) || 0,
    }
    
    if (isEditing) {
      updateProduct(parseInt(id), productData)
    } else {
      addProduct(productData)
    }
    
    setSaving(false)
    navigate('/admin/products')
  }

  return (
    <AdminLayout>
      <div className="admin-product-form">
        <div className="page-header">
          <div>
            <Link to="/admin/products" className="back-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </Link>
            <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            {/* Left Column - Main Info */}
            <div className="form-column">
              <div className="form-card">
                <h2>Product Information</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                    className={errors.description ? 'error' : ''}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="badge">Badge</label>
                    <select
                      id="badge"
                      name="badge"
                      value={formData.badge}
                      onChange={handleChange}
                    >
                      {badgeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2>Pricing</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={errors.price ? 'error' : ''}
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($)</label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0.00 (for sale items)"
                      step="0.01"
                      min="0"
                      className={errors.originalPrice ? 'error' : ''}
                    />
                    {errors.originalPrice && <span className="error-message">{errors.originalPrice}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock Quantity</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={errors.stock ? 'error' : ''}
                  />
                  {errors.stock && <span className="error-message">{errors.stock}</span>}
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="form-column">
              <div className="form-card">
                <h2>Product Image</h2>
                
                <div className="form-group">
                  <label htmlFor="image">Image URL *</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={errors.image ? 'error' : ''}
                  />
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                <div className="image-preview">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      onError={() => setPreviewImage('')}
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="image-tips">
                  <p><strong>Tip:</strong> Use high-quality square images</p>
                  <p>Recommended: 500x500px or larger</p>
                  <p>Supported: JPG, PNG, WebP</p>
                </div>
              </div>

              {/* Sample Image URLs */}
              <div className="form-card">
                <h2>Sample Image URLs</h2>
                <div className="sample-urls">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop' }))
                      setPreviewImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop')
                    }}
                  >
                    Watch
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' }))
                      setPreviewImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop')
                    }}
                  >
                    Headphones
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' }))
                      setPreviewImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop')
                    }}
                  >
                    Shoes
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' }))
                      setPreviewImage('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop')
                    }}
                  >
                    Backpack
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/admin/products" className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? 'Update Product' : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProductForm
