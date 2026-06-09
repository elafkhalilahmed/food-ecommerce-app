import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaHeart, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();

  // Demo products - Backend na ho to yeh dikhega
  const demoProducts = [
    { _id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 299, description: 'Fresh mozzarella, tomato sauce, basil', rating: 4.5, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400' },
    { _id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 399, description: 'Pepperoni, mozzarella, tomato sauce', rating: 4.7, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { _id: 3, name: 'Classic Burger', category: 'Burger', price: 199, description: 'Beef patty, lettuce, tomato, cheese', rating: 4.3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { _id: 4, name: 'Chicken Burger', category: 'Burger', price: 249, description: 'Grilled chicken, lettuce, mayo', rating: 4.4, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
    { _id: 5, name: 'Butter Chicken', category: 'Indian', price: 349, description: 'Creamy tomato curry with chicken', rating: 4.8, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
    { _id: 6, name: 'Chicken Biryani', category: 'Indian', price: 299, description: 'Fragrant rice with spices', rating: 4.6, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
    { _id: 7, name: 'California Roll', category: 'Japanese', price: 449, description: 'Fresh salmon and avocado roll', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { _id: 8, name: 'Ramen', category: 'Japanese', price: 349, description: 'Japanese noodle soup', rating: 4.5, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
    { _id: 9, name: 'Pasta Carbonara', category: 'Italian', price: 279, description: 'Creamy pasta with bacon', rating: 4.4, image: 'https://images.unsplash.com/photo-1645112411344-1c4c92a9adfc?w=400' },
    { _id: 10, name: 'Caesar Salad', category: 'Salad', price: 179, description: 'Fresh romaine with parmesan', rating: 4.2, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400' },
    { _id: 11, name: 'Chocolate Cake', category: 'Dessert', price: 149, description: 'Rich chocolate cake', rating: 4.7, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
    { _id: 12, name: 'Cold Coffee', category: 'Drinks', price: 99, description: 'Iced coffee with cream', rating: 4.3, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/products');
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
      }
    } catch (error) {
      console.log('Using demo products');
      setProducts(demoProducts);
      setFilteredProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const categories = ['All', 'Pizza', 'Burger', 'Indian', 'Japanese', 'Italian', 'Salad', 'Dessert', 'Drinks'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading delicious food...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🍔</span>
          <span style={styles.logoText}>FoodExpress</span>
        </div>
        <div style={styles.userInfo}>
          <div style={styles.cartIcon} onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {itemCount > 0 && <span style={styles.cartCount}>{itemCount}</span>}
          </div>
          <FaUser style={styles.userIcon} />
          <span style={styles.userName}>{user?.name || 'User'}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Delicious Food</h1>
        <p style={styles.heroSub}>Order your favorite meals</p>
        
        {/* Search Bar */}
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for food..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div style={styles.categories}>
        {categories.map((cat, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              ...styles.categoryBtn,
              ...(selectedCategory === cat ? styles.categoryBtnActive : {})
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={styles.grid}>
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={styles.card}
            whileHover={{ y: -10 }}
          >
            <div style={styles.cardImage}>
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400'} 
                alt={product.name}
                style={styles.image}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400';
                }}
              />
              <div style={styles.wishlistIcon}>
                <FaHeart />
              </div>
            </div>
            
            <div style={styles.cardContent}>
              <h3 style={styles.productName}>{product.name}</h3>
              <div style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.floor(product.rating || 4) ? "#FFD700" : "#E4E5E9"}
                    style={styles.star}
                  />
                ))}
                <span style={styles.reviewCount}>({product.rating || 4.5})</span>
              </div>
              <p style={styles.description}>{product.description?.substring(0, 60) || 'Delicious food item'}</p>
              <div style={styles.priceRow}>
                <div>
                  <span style={styles.price}>₹{product.price}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  style={styles.addBtn}
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
  },
  navbar: {
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    padding: '15px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontFamily: 'cursive',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  cartIcon: {
    position: 'relative',
    cursor: 'pointer',
    fontSize: '22px',
    marginRight: '10px',
  },
  cartCount: {
    position: 'absolute',
    top: '-10px',
    right: '-12px',
    background: '#ff4444',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  userIcon: {
    fontSize: '18px',
  },
  userName: {
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  hero: {
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    padding: '60px 20px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    color: 'white',
    margin: 0,
    fontWeight: 'bold',
  },
  heroSub: {
    fontSize: '18px',
    color: 'white',
    marginTop: '10px',
  },
  searchBox: {
    maxWidth: '500px',
    margin: '30px auto 0',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px 15px 50px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '50px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    outline: 'none',
  },
  categories: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    padding: '40px 20px',
  },
  categoryBtn: {
    padding: '12px 30px',
    background: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#666',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  categoryBtnActive: {
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  cardImage: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  wishlistIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'white',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    cursor: 'pointer',
  },
  cardContent: {
    padding: '20px',
  },
  productName: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#333',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '10px',
  },
  star: {
    fontSize: '14px',
  },
  reviewCount: {
    fontSize: '12px',
    color: '#999',
    marginLeft: '5px',
  },
  description: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '15px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#FF6B35',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #FF6B35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Menu;