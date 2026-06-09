import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">🍔 FoodExpress</Link>
        {user && (
          <div className="nav-links">
            <Link to="/" className="nav-link">Menu</Link>
            <span className="nav-user">👤 {user.name}</span>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;