const express = require('express');
const router = express.Router();
const { getAllItems, getItem, addItem, updateItem, deleteItem, getBestsellers } = require('../controllers/menuController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/bestsellers', getBestsellers);
router.get('/', getAllItems);
router.get('/:id', getItem);

// Admin routes (protected)
router.post('/', auth, upload.single('image'), addItem);
router.put('/:id', auth, upload.single('image'), updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;
