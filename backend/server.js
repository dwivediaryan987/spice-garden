const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');

// Serve frontend static files (only for local development)
const express = require('express');
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Handle SPA routes - serve frontend for non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  } else {
    next();
  }
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
