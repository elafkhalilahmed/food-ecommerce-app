import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <FaShoppingBag style={styles.emptyIcon} />
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Looks like you haven't added any items yet</p>
        <button onClick={() => navigate('/menu')} style={styles.shopBtn}>
          Continue Shopping 🍔
        </button>
      </div>
    );
  }

  const deliveryFee = 40;
  const tax = total * 0.05;
  const grandTotal = total + deliveryFee + tax;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/menu')} style={styles.backBtn}>
          <FaArrowLeft /> Back to Menu
        </button>
        <h1 style={styles.title}>Your Cart 🛒</h1>
      </div>
      
      <div style={styles.content}>
        <div style={styles.itemsSection}>
          {cart.map((item) => (
            <div key={item._id} style={styles.cartItem}>
              <img 
                src={item.image || 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg'} 
                alt={item.name} 
                style={styles.itemImage} 
              />
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>₹{item.price}</p>
              </div>
              <div style={styles.quantityControls}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}>
                  <FaMinus />
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn}>
                  <FaPlus />
                </button>
              </div>
              <div style={styles.itemTotal}>
                ₹{item.price * item.quantity}
              </div>
              <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.summarySection}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>₹{total}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery Fee:</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax (5%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <button onClick={clearCart} style={styles.clearBtn}>
            Clear Cart
          </button>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
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
    background: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  backBtn: {
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
  },
  itemsSection: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '80px 2fr 120px 100px 50px',
    gap: '15px',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  itemImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  itemDetails: {
    textAlign: 'left',
  },
  itemName: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#333',
  },
  itemPrice: {
    margin: 0,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  qtyBtn: {
    background: '#f0f0f0',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  quantity: {
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#FF6B35',
    fontSize: '16px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ff4444',
    cursor: 'pointer',
    fontSize: '18px',
  },
  summarySection: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    height: 'fit-content',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  summaryTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    color: '#666',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FF6B35',
    borderTop: '2px solid #FF6B35',
    marginTop: '10px',
  },
  clearBtn: {
    width: '100%',
    padding: '12px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '10px',
    marginTop: '15px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    marginTop: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f8f9fa',
  },
  emptyIcon: {
    fontSize: '100px',
    color: '#ccc',
    marginBottom: '20px',
  },
  emptyTitle: {
    color: '#333',
    marginBottom: '10px',
  },
  emptyText: {
    color: '#999',
    marginBottom: '30px',
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
  },
};

export default Cart;