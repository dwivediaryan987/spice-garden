const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Set env vars for Vercel (they come from Vercel Environment Variables dashboard)
// Locally they come from .env file
if (!process.env.VERCEL) {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export for Vercel serverless
module.exports = app;
