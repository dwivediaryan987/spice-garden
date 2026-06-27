const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations, updateReservation, deleteReservation, getTodayCount } = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// Public
router.post('/', createReservation);

// Admin routes
router.get('/stats/today', auth, getTodayCount);
router.get('/', auth, getAllReservations);
router.put('/:id', auth, updateReservation);
router.delete('/:id', auth, deleteReservation);

module.exports = router;
