import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';

import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import ManageProducts from './pages/ManageProducts';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/menu" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            } />
            <Route path="/admin/products" element={
  <PrivateRoute>
    <ManageProducts />
  </PrivateRoute>
} />
           <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
  <PrivateRoute>
    <Checkout />
  </PrivateRoute>
} />
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;