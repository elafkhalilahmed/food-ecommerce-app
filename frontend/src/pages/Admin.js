import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaBox, FaChartLine, FaUtensils, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Pizza',
    image: '',
    description: ''
  });

  const categories = ['Pizza', 'Burger', 'Indian', 'Japanese', 'Italian', 'Salad', 'Dessert', 'Drinks'];

  const demoProducts = [
    { _id: 1, name: 'Margherita Pizza', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', description: 'Fresh mozzarella, tomato sauce, basil' },
    { _id: 2, name: 'Pepperoni Pizza', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', description: 'Pepperoni, mozzarella, tomato sauce' },
    { _id: 3, name: 'Classic Burger', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Beef patty, lettuce, tomato, cheese' },
    { _id: 4, name: 'Chicken Burger', price: 249, category: 'Burger', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', description: 'Grilled chicken, lettuce, mayo' },
    { _id: 5, name: 'Butter Chicken', price: 349, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', description: 'Creamy tomato curry with chicken' },
    { _id: 6, name: 'Chicken Biryani', price: 299, category: 'Indian', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', description: 'Fragrant rice with spices' },
    { _id: 7, name: 'California Roll', price: 449, category: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', description: 'Fresh salmon and avocado roll' },
    { _id: 8, name: 'Ramen', price: 349, category: 'Japanese', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', description: 'Japanese noodle soup' },
    { _id: 9, name: 'Pasta Carbonara', price: 279, category: 'Italian', image: 'https://images.unsplash.com/photo-1645112411344-1c4c92a9adfc?w=400', description: 'Creamy pasta with bacon' },
    { _id: 10, name: 'Caesar Salad', price: 179, category: 'Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', description: 'Fresh romaine with parmesan' },
    { _id: 11, name: 'Chocolate Cake', price: 149, category: 'Dessert', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', description: 'Rich chocolate cake' },
    { _id: 12, name: 'Cold Coffee', price: 99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400', description: 'Iced coffee with cream' }
  ];

  const fakeOrders = [
    { _id: 'ORD001', user: { name: 'Rahul Sharma' }, items: [{ name: 'Butter Chicken', quantity: 2 }], total: 698, status: 'Delivered', createdAt: new Date() },
    { _id: 'ORD002', user: { name: 'Priya Patel' }, items: [{ name: 'Margherita Pizza', quantity: 1 }], total: 299, status: 'Delivered', createdAt: new Date() },
    { _id: 'ORD003', user: { name: 'Amit Kumar' }, items: [{ name: 'Classic Burger', quantity: 3 }], total: 597, status: 'Out for Delivery', createdAt: new Date() }
  ];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access only!');
      navigate('/');
      return;
    }
    fetchProducts();
    fetchRealOrders();
  }, [user]);

  // ✅ FETCH REAL ORDERS FROM DATABASE
  const fetchRealOrders = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setOrders(fakeOrders);
        return;
      }
      
      const userData = JSON.parse(storedUser);
      const adminId = userData._id || userData.id;
      
      console.log('📦 Fetching real orders for Admin ID:', adminId);
      
      const response = await axios.get('http://localhost:5005/api/admin/orders', {
        headers: { 'userid': adminId }
      });
      
      console.log('✅ Orders from database:', response.data);
      
      if (response.data && response.data.length > 0) {
        setOrders(response.data);
      } else {
        setOrders(fakeOrders);
      }
    } catch (error) {
      console.error('Error fetching real orders:', error);
      setOrders(fakeOrders);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('📦 Fetching from http://localhost:5005/api/products');
      const res = await axios.get('http://localhost:5005/api/products');
      console.log('✅ Got', res.data?.length || 0, 'products');
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts(demoProducts);
      }
    } catch (error) {
      console.log('Backend error, using demo products');
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📦 Adding product:', formData);
    
    try {
      const response = await axios.post('http://localhost:5005/api/products', {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: formData.description,
        rating: 4.5,
        discount: 0
      });
      
      console.log('✅ Product saved to database:', response.data);
      toast.success('Product added to database!');
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'Pizza', image: '', description: '' });
      fetchProducts();
      
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log('📦 Updating product:', editingProduct?._id, formData);
    
    try {
      const response = await axios.put(`http://localhost:5005/api/products/${editingProduct._id}`, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: formData.description
      });
      
      console.log('✅ Product updated:', response.data);
      toast.success('Product updated in database!');
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'Pizza', image: '', description: '' });
      fetchProducts();
      
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:5005/api/products/${id}`);
      toast.success('Product deleted from database!');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted!');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'Delivered').length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🍕</span>
          <span>Admin Panel</span>
        </div>
        
        <div style={styles.adminInfo}>
          <div style={styles.adminAvatar}>👑</div>
          <div style={styles.adminName}>{user?.name}</div>
          <div style={styles.adminEmail}>{user?.email}</div>
        </div>

        <button style={{...styles.menuBtn, ...(activeTab === 'stats' ? styles.menuBtnActive : {})}} onClick={() => setActiveTab('stats')}>
          <FaChartLine /> Dashboard
        </button>
        <button style={{...styles.menuBtn, ...(activeTab === 'products' ? styles.menuBtnActive : {})}} onClick={() => setActiveTab('products')}>
          <FaBox /> Products ({products.length})
        </button>
        <button style={{...styles.menuBtn, ...(activeTab === 'orders' ? styles.menuBtnActive : {})}} onClick={() => setActiveTab('orders')}>
          <FaShoppingBag /> Orders ({orders.length})
        </button>
        
        <button style={styles.viewStoreBtn} onClick={() => navigate('/')}>
          ← View Store
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your restaurant dashboard</p>
        </div>

        {activeTab === 'stats' && (
          <div>
            <div style={styles.welcomeCard}>
              <div>
                <h2 style={{margin:0}}>📊 Business Performance</h2>
                <p style={{margin:'5px 0 0', opacity:0.8}}>Real-time data</p>
              </div>
              <div style={styles.growthBadge}>📈 +23% vs last month</div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIconLarge}>💰</div>
                <div style={styles.statValue}>₹{totalRevenue.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Revenue</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIconLarge}>📦</div>
                <div style={styles.statValue}>{orders.length}</div>
                <div style={styles.statLabel}>Total Orders</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIconLarge}>🍔</div>
                <div style={styles.statValue}>{products.length}</div>
                <div style={styles.statLabel}>Menu Items</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIconLarge}>✅</div>
                <div style={styles.statValue}>{deliveredOrders}</div>
                <div style={styles.statLabel}>Delivered Orders</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div style={styles.toolbar}>
              <h2>🍔 Product Management ({products.length} products)</h2>
              <button onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', category: 'Pizza', image: '', description: '' }); setShowModal(true); }} style={styles.addBtn}>
                <FaPlus /> Add New Product
              </button>
            </div>

            <div style={styles.productGrid}>
              {products.map(product => (
                <motion.div key={product._id} style={styles.productCard} whileHover={{ scale: 1.02 }}>
                  <img src={product.image} alt={product.name} style={styles.productImage} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400'; }} />
                  <div style={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p style={styles.productPrice}>₹{product.price}</p>
                    <span style={styles.category}>{product.category}</span>
                    <p style={styles.productDesc}>{product.description?.substring(0, 50)}...</p>
                  </div>
                  <div style={styles.productActions}>
                    <button onClick={() => { setEditingProduct(product); setFormData(product); setShowModal(true); }} style={styles.editBtn}><FaEdit /></button>
                    <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2>📦 Customer Orders ({orders.length} orders)</h2>
            <div style={styles.ordersTable}>
              <table style={styles.table}>
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order.orderId || order._id}</td>
                      <td>{order.userName || order.user?.name || 'Guest'}</td>
                      <td>{order.items?.map(i => i.name).join(', ') || '-'}</td>
                      <td>₹{order.total || 0}</td>
                      <td><span style={{...styles.statusBadge, background: order.status === 'delivered' ? '#4CAF50' : order.status === 'out_for_delivery' ? '#FF9800' : '#2196F3'}}>{order.status || 'placed'}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}><FaTimes /></button>
            </div>
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
              <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} required />
              <input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={styles.input} required />
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={styles.input}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={styles.input} />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={styles.textarea} rows="3" />
              <button type="submit" style={styles.saveBtn}><FaSave /> {editingProduct ? 'Update Product' : 'Save Product'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  sidebar: { width: '280px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px' },
  logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  logoIcon: { fontSize: '32px' },
  adminInfo: { textAlign: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' },
  adminAvatar: { fontSize: '50px', marginBottom: '10px' },
  adminName: { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' },
  adminEmail: { fontSize: '12px', opacity: 0.7 },
  menuBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', margin: '8px 0', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s' },
  menuBtnActive: { background: '#8B5CF6' },
  viewStoreBtn: { width: '100%', padding: '12px', marginTop: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '12px' },
  main: { flex: 1, padding: '30px', overflowY: 'auto' },
  header: { marginBottom: '30px', color: '#fff' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px', color: '#fff' },
  addBtn: { background: '#8B5CF6', padding: '12px 24px', borderRadius: '10px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  productCard: { background: '#1a1a1a', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', transition: 'all 0.3s', color: '#fff' },
  productImage: { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' },
  productInfo: { flex: 1 },
  productPrice: { color: '#8B5CF6', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' },
  productDesc: { fontSize: '11px', color: '#aaa', marginTop: '5px' },
  category: { background: '#333', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' },
  productActions: { display: 'flex', gap: '8px' },
  editBtn: { background: '#3498db', padding: '8px 12px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' },
  deleteBtn: { background: '#e74c3c', padding: '8px 12px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#1a1a1a', padding: '30px', borderRadius: '20px', width: '500px', maxWidth: '90%', color: '#fff' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#fff' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #333', borderRadius: '10px', fontSize: '14px', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #333', borderRadius: '10px', fontSize: '14px', background: '#2a2a2a', color: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' },
  saveBtn: { background: '#8B5CF6', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  ordersTable: { background: '#1a1a1a', borderRadius: '16px', padding: '20px', overflowX: 'auto', color: '#fff' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#fff' },
  statusBadge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: 'white' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' },
  statCard: { background: '#1a1a1a', padding: '25px', borderRadius: '16px', textAlign: 'center', color: '#fff' },
  statIconLarge: { fontSize: '40px', marginBottom: '15px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '8px' },
  statLabel: { color: '#aaa', fontSize: '14px' },
  welcomeCard: { background: 'linear-gradient(135deg, #8B5CF6, #FF6B35)', padding: '25px', borderRadius: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '15px' },
  growthBadge: { background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' },
  spinner: { width: '50px', height: '50px', border: '4px solid #333', borderTop: '4px solid #8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Admin;