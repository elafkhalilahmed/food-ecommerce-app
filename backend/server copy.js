import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/food_ecommerce')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ============ MODELS ============

// User Schema
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

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' },
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ============ MIDDLEWARE ============

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.headers.userid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
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

// ✅ REGISTER API - Success Response
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists with this email" 
      });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    return res.status(201).json({ 
      success: true, 
      message: "Registered successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong. Please try again later" 
    });
  }
});

// ✅ LOGIN API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password required." 
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    return res.json({ 
      success: true, 
      message: "Logged in successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong. Please try again later" 
    });
  }
});

// ============ PRODUCTS API ============

// ✅ GET Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ ADD Product (Admin only)
app.post('/api/admin/products', isAdmin, async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }
    
    const product = new Product({ name, price, category, image, description });
    await product.save();
    
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product" });
  }
});

// ✅ UPDATE Product (Admin only)
app.put('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product" });
  }
});

// ✅ DELETE Product (Admin only)
app.delete('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product" });
  }
});

// ============ ORDERS API ============

// ✅ CREATE Order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, address } = req.body;
    const userId = req.headers.userid;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const order = new Order({ user: userId, items, total, address, status: 'pending' });
    await order.save();
    
    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order" });
  }
});

// ✅ GET User Orders
app.get('/api/orders/myorders', async (req, res) => {
  try {
    const userId = req.headers.userid;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ GET All Orders (Admin only)
app.get('/api/admin/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ UPDATE Order Status (Admin only)
app.patch('/api/admin/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ message: "Error updating order" });
  }
});

// ============ SEED PRODUCTS (Optional - ek baar run karo) ============
app.post('/api/seed-products', async (req, res) => {
  const demoProducts = [
    { name: 'Margherita Pizza', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', description: 'Fresh mozzarella, tomato sauce, basil' },
    { name: 'Pepperoni Pizza', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', description: 'Pepperoni, mozzarella, tomato sauce' },
    { name: 'Classic Burger', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Beef patty, lettuce, tomato, cheese' },
    { name: 'Butter Chicken', price: 349, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', description: 'Creamy tomato curry with chicken' },
    { name: 'Dal Makhani', price: 229, category: 'Indian', image: 'https://images.unsplash.com/photo-1546833999-b9f581a4f7d6?w=400', description: 'Black lentils cooked overnight' },
    { name: 'Pasta Carbonara', price: 279, category: 'Italian', image: 'https://images.unsplash.com/photo-1645112411344-1c4c92a9adfc?w=400', description: 'Creamy pasta with bacon' },
    { name: 'Greek Salad', price: 199, category: 'Salad', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', description: 'Feta, olives, cucumbers, tomatoes' }
  ];

  try {
    await Product.deleteMany();
    await Product.insertMany(demoProducts);
    res.json({ message: '7 demo products added to MongoDB!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ CREATE ADMIN USER (Ek baar run karo agar admin nahi hai)
app.post('/api/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'eylaf@admin.com' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists!' });
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Eylaf Admin',
      email: 'eylaf@admin.com',
      password: hashedPassword,
      role: 'admin'
    });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});