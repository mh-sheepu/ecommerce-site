import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'

const categoryIcons = {
  Electronics: "🎧",
  Wearables: "⌚",
  Fashion: "👜",
  Beauty: "✨",
  Home: "🏠",
  Sports: "🏃"
}

function Home() {
  const { products, getActiveProducts, getCategories } = useProducts()
  const { formatPrice, settings } = useSettings()
  const activeProducts = getActiveProducts()
  const categories = getCategories()
  
  const topSelling = activeProducts.filter(p => p.badge === 'Best Seller' || p.badge === 'Popular' || p.badge === 'Top Rated').slice(0, 4)
  const newArrivals = activeProducts.filter(p => p.badge === 'New' || p.badge === 'Trending').slice(0, 4)

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="hero-tag">New Collection 2026</span>
          <h1>Elevate Your <span>Lifestyle</span></h1>
          <p>
            Discover premium products curated just for you. 
            Enjoy free shipping on all orders over $50.
          </p>
          <div className="hero-buttons">
            <Link to="/#products" className="btn-hero-primary">
              Shop Now
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#categories" className="btn-hero-secondary">
              Browse Categories
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop" alt="Shopping" />
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <div className="feature-text">
                <h4>Free Shipping</h4>
                <p>On orders over $50</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h4>Secure Payment</h4>
                <p>100% secure checkout</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <div className="feature-text">
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-text">
                <h4>24/7 Support</h4>
                <p>Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Browse our wide selection of categories</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map(category => (
              <Link to={`/#products`} key={category} className="category-card">
                <div className="category-icon">{categoryIcons[category] || '📦'}</div>
                <h3>{category}</h3>
                <span className="category-count">{activeProducts.filter(p => p.category === category).length} Products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="products-section top-selling">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Top Selling</h2>
              <p className="section-subtitle">Our most popular products based on sales</p>
            </div>
            <Link to="/#products" className="view-all-link">
              View All
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="products-grid">
            {topSelling.map(product => (
              <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <span className="promo-tag">Limited Time Offer</span>
              <h2>Get 30% Off on All Electronics</h2>
              <p>Use code <strong>TECH30</strong> at checkout. Valid until March 15, 2026.</p>
              <Link to="/#products" className="btn-promo">Shop Electronics</Link>
            </div>
            <div className="promo-image">
              <img src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=400&fit=crop" alt="Electronics Sale" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="products-section new-arrivals">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">✨ New Arrivals</h2>
              <p className="section-subtitle">Check out our latest additions</p>
            </div>
            <Link to="/#products" className="view-all-link">
              View All
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="products-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section id="products" className="products-section all-products">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">All Products</h2>
              <p className="section-subtitle">Explore our complete collection</p>
            </div>
          </div>
          <div className="products-grid">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay in the Loop</h2>
              <p>Subscribe to get special offers, free giveaways, and exclusive deals.</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, formatPrice }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button 
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}

export default Home
