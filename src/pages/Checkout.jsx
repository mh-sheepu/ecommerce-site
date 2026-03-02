import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { useOrders } from '../context/OrdersContext'

function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { settings, getDeliveryPrice, calculateVAT, applyPromoCode, formatPrice } = useSettings()
  const { createOrder } = useOrders()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [shippingZone, setShippingZone] = useState('National')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  })

  const subtotal = getCartTotal()
  const shipping = getDeliveryPrice(subtotal, shippingZone)
  const taxAmount = settings.tax.vatEnabled && !settings.tax.vatIncludedInPrice ? calculateVAT(subtotal) : 0
  const promoDiscount = promoApplied?.valid ? (subtotal * promoApplied.discount / 100) : 0
  const total = subtotal + shipping + taxAmount - promoDiscount

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePromoCode = () => {
    const result = applyPromoCode(promoCode)
    setPromoApplied(result)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Create order data
    const orderData = {
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        zone: shippingZone,
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'awaiting',
      },
      subtotal,
      shipping,
      tax: taxAmount,
      discount: promoDiscount,
      promoCode: promoApplied?.valid ? promoCode : null,
      total,
      currency: settings.store.currency,
    };

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (paymentMethod === 'cod') {
      // Cash on Delivery - place order directly
      const order = createOrder(orderData);
      clearCart()
      setIsProcessing(false)
      setOrderSuccess(order)
    } else {
      // Online Payment - placeholder for SSL Commerz
      // In real implementation, redirect to payment gateway
      setIsProcessing(false)
      alert('Online payment integration (SSL Commerz) will be configured here. For now, please use Cash on Delivery.')
    }
  }

  // Order Success Display
  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: <strong>{orderSuccess.id}</strong></p>
            <div className="order-summary-card">
              <h3>Order Details</h3>
              <div className="order-info-grid">
                <div className="order-info-item">
                  <span className="label">Payment Method</span>
                  <span className="value">
                    {orderSuccess.payment.method === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="label">Total Amount</span>
                  <span className="value">{formatPrice(orderSuccess.total)}</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Shipping To</span>
                  <span className="value">
                    {orderSuccess.shipping.address}, {orderSuccess.shipping.city}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="label">Email</span>
                  <span className="value">{orderSuccess.customer.email}</span>
                </div>
              </div>
              <div className="order-items-list">
                <h4>Items Ordered ({orderSuccess.items.length})</h4>
                {orderSuccess.items.map(item => (
                  <div key={item.id} className="order-item-row">
                    <img src={item.image} alt={item.name} />
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="order-note">
              📧 A confirmation email has been sent to <strong>{orderSuccess.customer.email}</strong>
            </p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart to checkout.</p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main St"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group" style={{ maxWidth: '200px' }}>
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon">💵</div>
                    <div className="payment-details">
                      <span className="payment-title">Cash on Delivery</span>
                      <span className="payment-desc">Pay when you receive your order</span>
                    </div>
                  </div>
                </label>
                
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon">💳</div>
                    <div className="payment-details">
                      <span className="payment-title">Online Payment</span>
                      <span className="payment-desc">Pay securely via SSL Commerz</span>
                      <span className="payment-badge">Coming Soon</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.name}</span>
                    <div className="quantity-controls" style={{ marginTop: '0.5rem', border: 'none' }}>
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        −
                      </button>
                      <span className="quantity-value" style={{ padding: '0.25rem 0.5rem' }}>
                        {item.quantity}
                      </span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">{formatPrice(item.price * item.quantity)}</span>
                    <button 
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {/* Shipping Zone Selector */}
            <div className="shipping-zone-selector">
              <label>Shipping Zone</label>
              <select value={shippingZone} onChange={(e) => setShippingZone(e.target.value)}>
                {settings.shippingZones.map(zone => (
                  <option key={zone.id} value={zone.name}>
                    {zone.name} ({zone.minDays}-{zone.maxDays} days) - {formatPrice(zone.price)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="summary-row">
              <span>Shipping ({shippingZone})</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            
            {settings.tax.vatEnabled && !settings.tax.vatIncludedInPrice && (
              <div className="summary-row">
                <span>VAT ({settings.tax.vatRate}%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
            )}
            
            {/* Promo Code */}
            {settings.discount.promoCodeEnabled && (
              <div className="promo-code-section">
                <div className="promo-input-row">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button type="button" onClick={handlePromoCode}>Apply</button>
                </div>
                {promoApplied && (
                  <div className={`promo-message ${promoApplied.valid ? 'success' : 'error'}`}>
                    {promoApplied.valid 
                      ? `✓ Promo applied! ${promoApplied.discount}% off`
                      : '✗ Invalid promo code'}
                  </div>
                )}
              </div>
            )}
            
            {promoApplied?.valid && (
              <div className="summary-row discount">
                <span>Promo Discount</span>
                <span>-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            
            {settings.delivery.freeDeliveryEnabled && subtotal < settings.delivery.freeDeliveryThreshold && (
              <div className="free-shipping-notice">
                Add {formatPrice(settings.delivery.freeDeliveryThreshold - subtotal)} more to get FREE delivery!
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
