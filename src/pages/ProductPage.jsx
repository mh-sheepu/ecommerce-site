import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById } = useProducts()
  const product = getProductById(id)
  const { addToCart } = useCart()
  const { formatPrice } = useSettings()
  const [quantity, setQuantity] = useState(1)

  if (!product || !product.active) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/" className="continue-shopping">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div className="product-page">
      <div className="container">
        <Link to="/" className="back-link">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="product-detail">
          <div className="product-gallery">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details">
            <span className="product-category">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-count">
                {product.rating} ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={decreaseQuantity}>−</button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn" onClick={increaseQuantity}>+</button>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn-secondary" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
