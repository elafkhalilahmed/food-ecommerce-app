import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const [order, setOrder] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const steps = [
    { id: 1, name: 'Order Placed', icon: '📝', status: 'placed' },
    { id: 2, name: 'Confirmed', icon: '✅', status: 'confirmed' },
    { id: 3, name: 'Preparing', icon: '👨‍🍳', status: 'preparing' },
    { id: 4, name: 'Ready', icon: '🍽️', status: 'ready' },
    { id: 5, name: 'Out for Delivery', icon: '🛵', status: 'out_for_delivery' },
    { id: 6, name: 'Delivered', icon: '🏠', status: 'delivered' }
  ];

  const statusMap = {
    'placed': 1,
    'confirmed': 2,
    'preparing': 3,
    'ready': 4,
    'out_for_delivery': 5,
    'delivered': 6,
    'cancelled': 0
  };

  useEffect(() => {
    const orderId = searchParams.get('id');
    if (orderId) {
      setTrackingId(orderId);
      fetchOrder(orderId);
    }
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5005/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/orders/user/myorders', {
        headers: { userid: user?._id }
      });
      setRecentOrders(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter Order ID');
      return;
    }
    fetchOrder(trackingId);
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    return statusMap[order.status] || 1;
  };

  const getStatusMessage = () => {
    switch (order?.status) {
      case 'placed': return '✅ Order confirmed! Restaurant preparing your food.';
      case 'confirmed': return '✅ Order confirmed! Getting ready to cook.';
      case 'preparing': return '👨‍🍳 Chef is cooking your delicious meal!';
      case 'ready': return '✅ Order ready for pickup/delivery!';
      case 'out_for_delivery': return '🛵 Delivery partner on the way to you!';
      case 'delivered': return '🎉 Order delivered! Enjoy your meal! ⭐';
      default: return 'Processing your order...';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/menu')} style={styles.backBtn}>
          ← Back to Menu
        </button>
        <h1 style={styles.title}>🍔 Track Your Order</h1>
      </div>

      <div style={styles.searchCard}>
        <h3>Enter Order ID</h3>
        <form onSubmit={handleTrackOrder} style={styles.searchForm}>
          <input
            type="text"
            placeholder="e.g., ORD00001"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            style={styles.searchInput}
            required
          />
          <button type="submit" style={styles.trackBtn} disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
      </div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.timelineCard}
        >
          <div style={styles.orderHeader}>
            <div>
              <h3 style={{margin:0}}>Order #{order.orderId}</h3>
              <p style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div style={styles.eta}>
              <span style={styles.etaLabel}>Estimated Time:</span>
              <span style={styles.etaValue}>{order.estimatedTime || '30-40 min'}</span>
            </div>
          </div>

          <div style={styles.stepsContainer}>
            {steps.map((step, index) => {
              const currentStep = getCurrentStep();
              const isCompleted = index + 1 <= currentStep;
              const isCurrent = index + 1 === currentStep && order.status !== 'delivered';
              
              return (
                <div key={step.id} style={styles.stepWrapper}>
                  <div style={styles.stepContent}>
                    <div style={{
                      ...styles.stepIcon,
                      background: isCompleted ? '#4CAF50' : '#f0f0f0',
                      border: isCurrent ? '3px solid #FF6B35' : 'none'
                    }}>
                      {step.icon}
                    </div>
                    <p style={{
                      ...styles.stepName,
                      color: isCompleted ? '#4CAF50' : '#999',
                      fontWeight: isCurrent ? 'bold' : 'normal'
                    }}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      ...styles.line,
                      background: isCompleted ? '#4CAF50' : '#ddd'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={styles.itemsCard}>
            <h4>Order Items</h4>
            {order.items?.map((item, idx) => (
              <div key={idx} style={styles.orderItem}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.orderItem}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div style={styles.orderItem}>
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div style={styles.orderItem}>
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>₹{order.total}</strong>
            </div>
          </div>

          {order.address && (
            <div style={styles.addressCard}>
              <h4>📍 Delivery Address</h4>
              <p>{order.address.street}, {order.address.city}, {order.address.pincode}</p>
              <p>📞 {order.address.phone}</p>
            </div>
          )}

          <div style={styles.statusMessage}>
            {getStatusMessage()}
          </div>
        </motion.div>
      )}

      {user && recentOrders.length > 0 && (
        <div style={styles.recentOrders}>
          <h3>Your Recent Orders</h3>
          <div style={styles.recentList}>
            {recentOrders.map((ord) => (
              <div key={ord._id} style={styles.recentCard}>
                <div>
                  <strong>{ord.orderId}</strong>
                  <p style={styles.recentDate}>{new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  background: ord.status === 'delivered' ? '#4CAF50' : '#FF6B35'
                }}>
                  {ord.status.replace('_', ' ')}
                </span>
                <button onClick={() => fetchOrder(ord.orderId)} style={styles.viewBtn}>
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px'
  },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
  backBtn: { background: '#FF6B35', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
  title: { margin: 0, color: '#333' },
  searchCard: { background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  searchForm: { display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' },
  searchInput: { flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' },
  trackBtn: { padding: '12px 30px', background: 'linear-gradient(135deg, #FF6B35, #FFB830)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  timelineCard: { background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', paddingBottom: '20px', borderBottom: '1px solid #eee' },
  orderDate: { color: '#666', fontSize: '12px', marginTop: '5px' },
  eta: { textAlign: 'right' },
  etaLabel: { fontSize: '12px', color: '#666', display: 'block' },
  etaValue: { fontSize: '20px', fontWeight: 'bold', color: '#FF6B35' },
  stepsContainer: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative', flexWrap: 'wrap', gap: '10px' },
  stepWrapper: { flex: 1, minWidth: '80px', textAlign: 'center', position: 'relative' },
  stepContent: { marginTop: '15px' },
  stepIcon: { width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto', background: '#f0f0f0' },
  stepName: { marginTop: '8px', fontSize: '10px' },
  line: { position: 'absolute', top: '22px', right: '50%', width: '100%', height: '2px', background: '#ddd', zIndex: 0 },
  itemsCard: { background: '#f8f9fa', borderRadius: '15px', padding: '20px', marginBottom: '20px' },
  orderItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0' },
  divider: { height: '1px', background: '#ddd', margin: '10px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '15px 0 0 0', marginTop: '10px', borderTop: '2px solid #ddd', fontSize: '18px' },
  addressCard: { background: '#f8f9fa', borderRadius: '15px', padding: '20px', marginBottom: '20px' },
  statusMessage: { background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', padding: '15px', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' },
  recentOrders: { background: 'white', borderRadius: '20px', padding: '20px', marginTop: '20px' },
  recentList: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  recentCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '10px' },
  recentDate: { fontSize: '10px', color: '#666', marginTop: '5px' },
  statusBadge: { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', color: 'white' },
  viewBtn: { background: '#FF6B35', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default OrderTracking;