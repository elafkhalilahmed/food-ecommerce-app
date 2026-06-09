import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 4.5 },
  discount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add new product
router.post('/', async (req, res) => {
  try {
    console.log('📦 Adding product:', req.body);
    
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      description: req.body.description,
      rating: req.body.rating || 4.5,
      discount: req.body.discount || 0,
      inStock: true
    });
    
    const saved = await product.save();
    console.log('✅ Product added:', saved.name);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;