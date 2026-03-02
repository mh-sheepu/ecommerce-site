import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen)
  }

  const closeMobileNav = () => {
    setMobileNavOpen(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Shop<span>Ease</span>
        </Link>

        <nav className="nav-desktop">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/checkout" className="cart-button">
            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={toggleMobileNav} aria-label="Toggle menu">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} onClick={closeMobileNav}>
        <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-header">
            <h3>Menu</h3>
            <button className="close-button" onClick={closeMobileNav} aria-label="Close menu">
              <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mobile-nav-links">
            <Link to="/" onClick={closeMobileNav}>Home</Link>
            <a href="#products" onClick={closeMobileNav}>Products</a>
            <a href="#categories" onClick={closeMobileNav}>Categories</a>
            <a href="#about" onClick={closeMobileNav}>About</a>
            <Link to="/checkout" onClick={closeMobileNav}>
              Cart ({cartCount})
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
