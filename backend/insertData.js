import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    rating: 4.8,
    description: "Fresh mozzarella cheese, tomato sauce, and fresh basil leaves on a crispy crust.",
    discount: 10,
    inStock: true
  },
  {
    name: "Cheese Burger",
    category: "Burger",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    rating: 4.6,
    description: "Juicy beef patty with melted cheddar cheese, fresh lettuce, tomato, and special sauce.",
    discount: 0,
    inStock: true
  },
  {
    name: "Chicken Tikka",
    category: "Indian",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
    rating: 4.9,
    description: "Tender chicken pieces marinated in spices and yogurt, grilled to perfection.",
    discount: 15,
    inStock: true
  },
  {
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    rating: 4.7,
    description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
    discount: 0,
    inStock: true
  },
  {
    name: "Sushi Roll",
    category: "Japanese",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    rating: 4.8,
    description: "Fresh salmon, avocado, cucumber, and rice wrapped in nori, served with wasabi.",
    discount: 5,
    inStock: true
  },
  {
    name: "Pasta Alfredo",
    category: "Italian",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1645112411344-1e1e6e8b9e9e",
    rating: 4.5,
    description: "Creamy Alfredo sauce with parmesan cheese and fettuccine pasta.",
    discount: 0,
    inStock: true
  },
  {
    name: "Caesar Salad",
    category: "Salad",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54dd8c9",
    rating: 4.4,
    description: "Fresh romaine lettuce, parmesan cheese, croutons with Caesar dressing.",
    discount: 0,
    inStock: true
  },
  {
    name: "Cold Coffee",
    category: "Drinks",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
    rating: 4.6,
    description: "Chilled coffee with milk and ice cream, topped with chocolate syrup.",
    discount: 0,
    inStock: true
  }
];

const insertData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    // Delete existing products
    await Product.deleteMany();
    console.log("🗑️ Deleted existing products");
    
    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products inserted successfully!");
    console.log(`📦 Total ${sampleProducts.length} products added`);
    
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

insertData();