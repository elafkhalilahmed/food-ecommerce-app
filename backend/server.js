import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import productRoutes from './routes/Product.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/food_ecommerce')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ============ USER MODEL ============
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// ============ MIDDLEWARE ============
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.headers.userid);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Admin access required" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

// ============ AUTH API ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.status(201).json({ 
      success: true, message: "Registered successfully!",
      token, user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required." });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ 
      success: true, message: "Logged in successfully!",
      token, user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

/// ============ ORDERS API ============

// Place new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, address } = req.body;
    const userId = req.headers.userid;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Calculate totals
    const subtotal = total;
    const deliveryFee = 40;
    const tax = subtotal * 0.05;
    const grandTotal = subtotal + deliveryFee + tax;
    
    const orderData = {
      user: userId,
      userName: user.name,
      userEmail: user.email,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || ''
      })),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: grandTotal,
      address: {
        street: address.street,
        city: address.city,
        pincode: address.pincode,
        phone: address.phone
      },
      status: 'placed',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully', timestamp: new Date() }],
      estimatedTime: '30-40 minutes'
    };
    
    const order = new Order(orderData);
    await order.save();
    
    console.log('✅ New order created:', order.orderId);
    
    res.status(201).json({ 
      success: true, 
      order: {
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        estimatedTime: order.estimatedTime
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
app.get('/api/orders/myorders', async (req, res) => {
  try {
    const userId = req.headers.userid;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin)
app.get('/api/admin/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin)
app.patch('/api/admin/orders/:orderId/status', isAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    order.statusHistory.push({ 
      status: status, 
      note: note || `Status updated to ${status}`,
      timestamp: new Date()
    });
    
    // Update estimated time based on status
    if (status === 'preparing') order.estimatedTime = '25-35 minutes';
    if (status === 'ready') order.estimatedTime = '15-20 minutes';
    if (status === 'out_for_delivery') order.estimatedTime = '10-15 minutes';
    if (status === 'delivered') order.estimatedTime = 'Delivered';
    
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ============ SEED & ADMIN ============
app.post('/api/seed-products', async (req, res) => {
  const Product = mongoose.model('Product');
  const demoProducts = [
    { name: 'Margherita Pizza', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400' },
    { name: 'Pepperoni Pizza', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { name: 'Classic Burger', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Butter Chicken', price: 349, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' }
  ];
  try {
    await Product.deleteMany();
    await Product.insertMany(demoProducts);
    res.json({ message: 'Demo products added!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'eylaf@admin.com' });
    if (existingAdmin) return res.json({ message: 'Admin already exists!' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({ name: 'Eylaf Admin', email: 'eylaf@admin.com', password: hashedPassword, role: 'admin' });
    await admin.save();
    res.json({ message: 'Admin created! Login: eylaf@admin.com / admin123' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ TEST ROUTE ============
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

// ============ START SERVER ============
const PORT = 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});