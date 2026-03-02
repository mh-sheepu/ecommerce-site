import { useState } from 'react'
import { useOrders } from '../../context/OrdersContext'
import { useSettings } from '../../context/SettingsContext'
import './AdminOrders.css'

function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder, getOrderStats } = useOrders()
  const { formatPrice } = useSettings()
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const stats = getOrderStats()

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#ffc107' },
    { value: 'confirmed', label: 'Confirmed', color: '#17a2b8' },
    { value: 'processing', label: 'Processing', color: '#6f42c1' },
    { value: 'shipped', label: 'Shipped', color: '#007bff' },
    { value: 'delivered', label: 'Delivered', color: '#28a745' },
    { value: 'cancelled', label: 'Cancelled', color: '#dc3545' }
  ]

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.color : '#6c757d'
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId)
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <p>View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card processing">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-value">{stats.processing}</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="stat-card shipped">
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <span className="stat-value">{stats.shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatPrice(stats.totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="status-filters">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({orders.length})
          </button>
          {statusOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${filterStatus === option.value ? 'active' : ''}`}
              onClick={() => setFilterStatus(option.value)}
              style={{ '--filter-color': option.color }}
            >
              {option.label} ({orders.filter(o => o.status === option.value).length})
            </button>
          ))}
        </div>
      </div>

      <div className="orders-content">
        {/* Orders Table */}
        <div className="orders-table-container">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <span className="empty-icon">📭</span>
              <h3>No Orders Found</h3>
              <p>{filterStatus === 'all' ? 'No orders have been placed yet.' : `No ${filterStatus} orders.`}</p>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className={selectedOrder?.id === order.id ? 'selected' : ''}>
                    <td className="order-id">
                      <button 
                        className="id-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="customer-info">
                      <span className="customer-name">{order.customer.name}</span>
                      <span className="customer-email">{order.customer.email}</span>
                    </td>
                    <td className="items-count">{order.items.length} item(s)</td>
                    <td className="order-total">{formatPrice(order.total)}</td>
                    <td className="payment-method">
                      <span className={`payment-badge ${order.payment.method}`}>
                        {order.payment.method === 'cod' ? '💵 COD' : '💳 Online'}
                      </span>
                    </td>
                    <td className="order-status">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ borderColor: getStatusColor(order.status) }}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="order-date">{formatDate(order.createdAt)}</td>
                    <td className="order-actions">
                      <button 
                        className="view-btn"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete Order"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Details Panel */}
        {selectedOrder && (
          <div className="order-details-panel">
            <div className="panel-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="panel-content">
              <div className="detail-section">
                <h3>Order Info</h3>
                <div className="detail-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment:</span>
                  <span className="value">
                    {selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    <span className={`payment-status ${selectedOrder.payment.status}`}>
                      ({selectedOrder.payment.status})
                    </span>
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Info</h3>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedOrder.customer.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedOrder.customer.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedOrder.customer.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Shipping Address</h3>
                <p className="address-text">
                  {selectedOrder.shipping.address}<br />
                  {selectedOrder.shipping.city}, {selectedOrder.shipping.zip}<br />
                  {selectedOrder.shipping.country}
                </p>
              </div>

              <div className="detail-section">
                <h3>Items Ordered</h3>
                <div className="order-items">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="item-row">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{formatPrice(item.price)} × {item.quantity}</span>
                      </div>
                      <span className="item-total">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{formatPrice(selectedOrder.shipping.cost || 0)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount:</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="panel-actions">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="status-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button 
                  className="delete-order-btn"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
