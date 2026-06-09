# 🍔 FoodExpress - Food Ordering System

## Project Title
FoodExpress - Online Food Ordering System

## Short Project Description
FoodExpress is a full-stack web application that allows users to browse food items, add to cart, place orders with cash on delivery or demo online payment, and track orders in real-time. The admin has a dedicated panel to manage products (add, edit, delete) and view all customer orders.

## Features of the Project
- User Registration and Login
- Browse menu with category filters
- Search food items
- Add to cart
- Increase/Decrease cart quantity
- Remove items from cart
- Checkout with address form
- Cash on Delivery payment
- Demo Online Payment
- Real-time order tracking
- Order history
- Admin Dashboard with statistics
- Admin can add new products
- Admin can edit products
- Admin can delete products
- Admin can view all orders
- Admin can update order status

## Technologies Used
- React.js for Frontend
- Node.js and Express.js for Backend
- MongoDB for Database
- JWT for Authentication
- Bcrypt for Password Hashing
- Axios for API calls
- React Router for Navigation
- Context API for State Management

## Frontend Setup Instructions
- cd frontend
- npm start

## Backend Setup Instructions
- cd backend
- node server.js


## Database Setup Instructions
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service on your computer
3. Create database named `food_ecommerce`
4. Create three collections: `users`, `products`, `orders`

## Environment Variable Details
Create a `.env` file in the backend folder with these variables:
- MONGODB_URI=mongodb://127.0.0.1:27017/food_ecommerce
- PORT=5005
- JWT_SECRET=my_super_secret_key_12345

Then open browser and go to `http://localhost:3000`

## Demo Credentials
- User Email: `test@example.com`, Password: `123456`
- Admin Email: `eylaf@admin.com`, Password: `[Contact Admin]`

## API Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/products` - Get all products
- POST `/api/products` - Add new product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)
- POST `/api/orders` - Place new order
- GET `/api/orders/:orderId` - Get order by ID
- GET `/api/admin/orders` - Get all orders (Admin only)

## Screenshots
1. Login Page
2. Register Page
3. Menu Page
4. Cart Page
5. Checkout Page
6. Order Tracking Page
7. Admin Dashboard
8. Admin Products Management
9. Admin Orders Management

## Author Information
- Name: EYLAF KHALIL AHMED
- Roll Number: 023-23-0177