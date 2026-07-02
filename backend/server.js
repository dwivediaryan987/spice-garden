const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:3000',
    'http://127.0.0.1:5000',
    /\.vercel\.app$/   // Allow all Vercel preview & production URLs
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

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

// Handle SPA routes - serve frontend for non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  } else {
    next();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🍽️  Spice Garden Server Running!
  ================================
  🌐 Frontend:  http://localhost:${PORT}
  🔧 Admin:     http://localhost:${PORT}/admin
  📡 API:       http://localhost:${PORT}/api
  ================================
  `);
});
