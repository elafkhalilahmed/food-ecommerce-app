import mongoose from 'mongoose';

async function checkAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/food_ecommerce');
    const user = await mongoose.connection.collection('users').findOne({ email: 'eylaf@admin.com' });
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🎭 Role:', user.role);
    console.log('✅ If role is "admin", you can access admin panel');
    if (user.role !== 'admin') {
      console.log('⚠️ Role is not admin! Update it using MongoDB Compass');
    }
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit();
  }
}

checkAdmin();