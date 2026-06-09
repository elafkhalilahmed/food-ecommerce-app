import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const deliveryFee = 40;
  const tax = total * 0.05;
  const grandTotal = total + deliveryFee + tax;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // ✅ Get user ID properly
  const getUserId = () => {
    return user?._id || user?.id || localStorage.getItem('userId');
  };

  const handleCODOrder = async (e) => {
    e.preventDefault();
    
    if (!address.street || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill all address fields');
      return;
    }
    
    setLoading(true);
    
    try {
      toast.loading('Placing order...', { id: 'order' });
      
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        total: total,
        address: address,
        paymentMethod: 'COD'
      };
      
      console.log('Order Data:', orderData);
      console.log('User ID:', getUserId());
      
      const response = await axios.post('http://localhost:5005/api/orders', orderData, {
        headers: { 
          'userid': getUserId(),
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        toast.success('🎉 Order placed successfully!', { id: 'order' });
        clearCart();
        
        setTimeout(() => {
          navigate(`/track-order?id=${response.data.order.orderId}`);
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to place order', { id: 'order' });
      }
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order', { id: 'order' });
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async (e) => {
    e.preventDefault();
    
    if (!address.street || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill all address fields');
      return;
    }
    
    const confirmPayment = window.confirm(
      `💳 Payment Details\n\n` +
      `Amount: ₹${grandTotal.toFixed(2)}\n` +
      `Card: **** **** **** 1234\n` +
      `UPI: test@okhdfcbank\n\n` +
      `Click OK to complete payment`
    );
    
    if (!confirmPayment) {
      toast.error('Payment cancelled');
      return;
    }
    
    setLoading(true);
    
    try {
      toast.loading('Processing payment...', { id: 'payment' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('✅ Payment successful!', { id: 'payment' });
      
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        total: total,
        address: address,
        paymentMethod: 'Online'
      };
      
      const response = await axios.post('http://localhost:5005/api/orders', orderData, {
        headers: { 
          'userid': getUserId(),
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('🎉 Order placed successfully!', { id: 'order' });
        clearCart();
        
        setTimeout(() => {
          navigate(`/track-order?id=${response.data.order.orderId}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items to your cart first</p>
        <button onClick={() => navigate('/menu')} style={styles.shopBtn}>
          Continue Shopping 🍔
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/cart')} style={styles.backBtn}>
        ← Back to Cart
      </button>
      
      <h1 style={styles.title}>🛒 Checkout</h1>
      
      <div style={styles.content}>
        <div style={styles.orderSummary}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.itemsList}>
            {cart.map((item, idx) => (
              <div key={idx} style={styles.orderItem}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.itemQty}>x{item.quantity}</span>
                </div>
                <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={styles.divider} />
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <strong>Total Amount</strong>
            <strong>₹{grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        <div style={styles.addressForm}>
          <h3 style={styles.sectionTitle}>📍 Delivery Address</h3>
          <form>
            <input
              type="text"
              name="street"
              placeholder="Street Address *"
              value={address.street}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={address.city}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode *"
              value={address.pincode}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={address.phone}
              onChange={handleAddressChange}
              required
              style={styles.input}
            />
            
            <h4 style={styles.paymentTitle}>Select Payment Method</h4>
            
            <div style={styles.paymentOptions}>
              <label style={styles.paymentOption}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💵 Cash on Delivery (COD)</span>
              </label>
              <label style={styles.paymentOption}>
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={paymentMethod === 'Online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💳 Credit/Debit Card / UPI (Demo)</span>
              </label>
            </div>
            
            {paymentMethod === 'COD' ? (
              <button 
                type="button" 
                onClick={handleCODOrder} 
                style={styles.placeOrderBtn} 
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order (COD) • ₹${grandTotal.toFixed(2)}`}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleOnlinePayment} 
                style={styles.payBtn} 
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay Now • ₹${grandTotal.toFixed(2)}`}
              </button>
            )}
          </form>
          
          <p style={styles.note}>
            🔒 After order, you will be redirected to track your order in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333',
    fontSize: '36px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  },
  orderSummary: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    borderBottom: '2px solid #FF6B35',
    paddingBottom: '10px',
    display: 'inline-block'
  },
  itemsList: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #eee'
  },
  itemInfo: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  itemName: {
    fontSize: '14px',
    color: '#333'
  },
  itemQty: {
    fontSize: '12px',
    color: '#999'
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  divider: {
    height: '1px',
    background: '#eee',
    margin: '15px 0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    color: '#666'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0 0 0',
    marginTop: '10px',
    borderTop: '2px solid #FF6B35',
    fontSize: '18px',
    color: '#FF6B35'
  },
  addressForm: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  input: {
    width: '100%',
    padding: '14px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  paymentTitle: {
    margin: '20px 0 10px 0',
    color: '#333'
  },
  paymentOptions: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    flex: 1
  },
  placeOrderBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  payBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  note: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
    marginTop: '15px'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  shopBtn: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px'
  }
};

export default Checkout;