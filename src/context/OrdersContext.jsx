import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shopease_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopease_orders', JSON.stringify(orders));
  }, [orders]);

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  // Create new order
  const createOrder = (orderData) => {
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    if (!status || status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  // Delete order
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Get order statistics
  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return { total, pending, processing, shipped, delivered, cancelled, totalRevenue };
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    deleteOrder,
    getOrderStats,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
