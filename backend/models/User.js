import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user' 
  }
}, { 
  timestamps: true 
});

// 🔐 Password hash karne ke liye (save se pehle)
userSchema.pre('save', async function(next) {
  // Agar password modify nahi hua to aage badho
  if (!this.isModified('password')) return next();
  
  try {
    // Password ko hash karo
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Password compare karne ke liye method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);