const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrder, updateOrder, getOrderStats } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Public
router.post('/', createOrder);

// Admin routes
router.get('/stats/summary', auth, getOrderStats);
router.get('/', auth, getAllOrders);
router.get('/:id', auth, getOrder);
router.put('/:id', auth, updateOrder);

module.exports = router;
