import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const images = {
  'Margherita Pizza': 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
  'Cheese Burger': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
  'Chicken Tikka': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
  'Chocolate Lava Cake': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
  'Sushi Roll': 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
  'Pasta Alfredo': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
  'Caesar Salad': 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
  'Cold Coffee': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'
};

const update = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/food_ecommerce');
    console.log('✅ Connected to MongoDB');
    
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    let count = 0;
    for (const [name, url] of Object.entries(images)) {
      const result = await Product.updateOne(
        { name: name }, 
        { $set: { image: url } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ ${name} updated`);
        count++;
      } else if (result.matchedCount > 0) {
        console.log(`⚠️ ${name} already has image`);
      } else {
        console.log(`❌ ${name} not found`);
      }
    }
    
    console.log(`\n🎉 ${count} products updated!`);
    console.log('👉 Now press Ctrl+Shift+R in browser');
    process.exit();
  } catch(err) {
    console.error('Error:', err.message);
    process.exit();
  }
};

update();