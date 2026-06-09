import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', description: '', image: '', rating: '4.5', discount: '0'
  });

  const categories = ['Pizza', 'Burger', 'Indian', 'Japanese', 'Italian', 'Salad', 'Dessert', 'Drinks'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5005/api/products');
    setProducts(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5005/api/products/${editingProduct._id}`, formData);
        toast.success('Product updated!');
      } else {
        await axios.post('http://localhost:5005/api/products', formData);
        toast.success('✅ Product added to database!');
      }
      setShowModal(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', description: '', image: '', rating: '4.5', discount: '0' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`http://localhost:5005/api/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  return (
    <div style={{ padding: '40px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>📦 Manage Products</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} style={styles.addBtn}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td style={styles.td}><img src={product.image} alt={product.name} style={styles.tableImage} /></td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>${product.price}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(product)} style={styles.editBtn}><FaEdit /></button>
                  <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Product Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={styles.input} />
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required style={styles.input}>
                <option value="">Select Category *</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Price *" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={styles.input} />
              <textarea placeholder="Description *" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={styles.textarea} />
              <input type="text" placeholder="Image URL *" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required style={styles.input} />
              <input type="number" placeholder="Rating (0-5)" step="0.1" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} style={styles.input} />
              <input type="number" placeholder="Discount %" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} style={styles.input} />
              <button type="submit" style={styles.submitBtn}>{editingProduct ? 'Update' : 'Add'} Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  addBtn: {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '2px solid #eee',
    color: '#666',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  tableImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  editBtn: {
    background: '#007bff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteBtn: {
    background: '#dc3545',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #FF6B35, #FFB830)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default ManageProducts;