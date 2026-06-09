import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaShieldAlt, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'eylaf@admin.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (userType === 'admin' && email !== ADMIN_EMAIL) {
      setError('❌ Only Authorized person can access Admin Panel');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } else {
      setError(result.error || 'Login failed. Please register first.');
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Animated Gradient Background */}
      <div style={styles.animatedBg}></div>
      
      {/* Floating Particles */}
      <div style={styles.particles}>
        <div className="particle" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '85%', top: '15%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '20%', top: '70%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '75%', top: '80%', animationDelay: '0.5s' }}></div>
        <div className="particle" style={{ left: '50%', top: '30%', animationDelay: '1.5s' }}></div>
        <div className="particle" style={{ left: '15%', top: '45%', animationDelay: '2.5s' }}></div>
        <div className="particle" style={{ left: '90%', top: '55%', animationDelay: '0.8s' }}></div>
        <div className="particle" style={{ left: '35%', top: '85%', animationDelay: '1.8s' }}></div>
        <div className="particle" style={{ left: '60%', top: '10%', animationDelay: '2.2s' }}></div>
        <div className="particle" style={{ left: '5%', top: '90%', animationDelay: '0.3s' }}></div>
      </div>

      {/* Glowing Orbs */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>
      <div style={styles.orb3}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        {/* Glassmorphism Card Content */}
        <div style={styles.glassOverlay}></div>
        
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconStack}>
              <span style={styles.catIcon}>🐱</span>
              <span style={styles.foodIcon}>🍕</span>
            </div>
            <h1 style={styles.title}>Food<span style={styles.orangeText}>Express</span></h1>
            <p style={styles.subtitle}>delivering smiles 🎀</p>
          </div>

          {/* Tabs */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setUserType('user')}
              style={{
                ...styles.tab,
                ...(userType === 'user' ? styles.tabActiveUser : {})
              }}
            >
              <FaUser size={12} />
              <span>Customer</span>
            </button>
            <button
              onClick={() => setUserType('admin')}
              style={{
                ...styles.tab,
                ...(userType === 'admin' ? styles.tabActiveAdmin : {})
              }}
            >
              <FaShieldAlt size={12} />
              <span>Admin</span>
            </button>
          </div>

          {/* Info */}
          <div style={userType === 'admin' ? styles.adminInfo : styles.userInfo}>
            <span>{userType === 'admin' ? '🔐' : '💡'}</span>
            <span>
              {userType === 'admin' 
                ? 'Only eylaf@admin.com can login as Admin' 
                : 'New? Register first, then login'}
            </span>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.error}>
              <span>⚠️</span> {error}
            </motion.div>
          )}

          {/* Form - Added autocomplete="off" to fix autofill */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={styles.inputGroup}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.loginBtn}>
              {loading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  {userType === 'admin' ? 'Admin Access' : 'Login'} 
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div style={styles.registerSection}>
            <div style={styles.line}></div>
            <Link to="/register" style={styles.registerBtn}>
              <span>✨</span> Create New Account <span>→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  animatedBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #0a0a1a 50%, #1a0a0a 75%, #0a0a0a 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)',
    borderRadius: '50%',
    top: '-150px',
    right: '-100px',
    animation: 'float 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(255,107,53,0.25), transparent 70%)',
    borderRadius: '50%',
    bottom: '-120px',
    left: '-80px',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  orb3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 6s ease-in-out infinite',
  },
  card: {
    width: '400px',
    maxWidth: '100%',
    position: 'relative',
    borderRadius: '28px',
    overflow: 'hidden',
    backdropFilter: 'blur(2px)',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(18, 18, 24, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '28px',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '36px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconStack: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '12px',
  },
  catIcon: {
    fontSize: '48px',
    display: 'inline-block',
    filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.5))',
  },
  foodIcon: {
    position: 'absolute',
    fontSize: '22px',
    bottom: '-5px',
    right: '-12px',
    filter: 'drop-shadow(0 0 5px rgba(255,107,53,0.5))',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 5px 0',
    letterSpacing: '0.5px',
    textShadow: '0 0 20px rgba(139,92,246,0.3)',
  },
  orangeText: {
    color: '#FF6B35',
    textShadow: '0 0 15px rgba(255,107,53,0.4)',
  },
  subtitle: {
    fontSize: '10px',
    color: '#8B5CF6',
    margin: 0,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  tabBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s',
    backdropFilter: 'blur(4px)',
  },
  tabActiveUser: {
    background: 'rgba(139,92,246,0.2)',
    borderColor: '#8B5CF6',
    color: '#fff',
    boxShadow: '0 0 15px rgba(139,92,246,0.2)',
  },
  tabActiveAdmin: {
    background: 'rgba(255,107,53,0.2)',
    borderColor: '#FF6B35',
    color: '#fff',
    boxShadow: '0 0 15px rgba(255,107,53,0.2)',
  },
  userInfo: {
    background: 'rgba(139,92,246,0.08)',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    border: '1px solid rgba(139,92,246,0.15)',
    backdropFilter: 'blur(4px)',
  },
  adminInfo: {
    background: 'rgba(255,107,53,0.08)',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    border: '1px solid rgba(255,107,53,0.15)',
    backdropFilter: 'blur(4px)',
  },
  error: {
    background: 'rgba(255,68,68,0.1)',
    color: '#FF6B35',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(255,107,53,0.2)',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '14px',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8B5CF6',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '13px 13px 13px 42px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    backdropFilter: 'blur(4px)',
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #8B5CF6, #FF6B35)',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    transition: 'all 0.3s',
    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid #fff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  registerSection: {
    marginTop: '26px',
    textAlign: 'center',
  },
  line: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    marginBottom: '18px',
  },
  registerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 22px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '40px',
    color: '#8B5CF6',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-30px) translateX(20px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
  }
  
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: linear-gradient(135deg, #8B5CF6, #FF6B35);
    border-radius: 50%;
    opacity: 0.6;
    animation: particleFloat 12s infinite linear;
  }
  
  @keyframes particleFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  input:focus {
    border-color: #8B5CF6 !important;
    box-shadow: 0 0 15px rgba(139,92,246,0.2);
  }
  
  .register-btn:hover {
    border-color: #8B5CF6;
    background: rgba(139,92,246,0.1);
    transform: translateY(-2px);
  }
  
  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(139,92,246,0.5);
  }
`;
document.head.appendChild(styleSheet);

export default Login;