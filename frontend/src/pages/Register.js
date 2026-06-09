import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/menu');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Animated Gradient Background */}
      <div style={styles.animatedBg}></div>
      
      {/* Floating Particles */}
      <div style={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 7}s`
          }}></div>
        ))}
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
        <div style={styles.glassOverlay}></div>
        
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconStack}>
              <span style={styles.catIcon}>🐱</span>
              <span style={styles.foodIcon}>🍕</span>
            </div>
            <h1 style={styles.title}>Food<span style={styles.orangeText}>Express</span></h1>
            <p style={styles.subtitle}>create your account 🎀</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.error}>
              <span>⚠️</span> {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.registerBtn}>
              {loading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  Register <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={styles.loginSection}>
            <div style={styles.line}></div>
            <Link to="/login" style={styles.loginLink}>
              <span>🔐</span> Already have an account? <strong>Sign in</strong> <span>→</span>
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
  error: {
    background: 'rgba(255,68,68,0.1)',
    color: '#FF6B35',
    padding: '12px 14px',
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
  registerBtn: {
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
  loginSection: {
    marginTop: '26px',
    textAlign: 'center',
  },
  line: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    marginBottom: '18px',
  },
  loginLink: {
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
    width: 3px;
    height: 3px;
    background: linear-gradient(135deg, #8B5CF6, #FF6B35);
    border-radius: 50%;
    opacity: 0.5;
    animation: particleFloat linear infinite;
  }
  
  @keyframes particleFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  input:focus {
    border-color: #8B5CF6 !important;
    box-shadow: 0 0 15px rgba(139,92,246,0.2);
  }
  
  .login-link:hover {
    border-color: #8B5CF6;
    background: rgba(139,92,246,0.1);
    transform: translateY(-2px);
  }
  
  .register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(139,92,246,0.5);
  }
`;
document.head.appendChild(styleSheet);

export default Register;