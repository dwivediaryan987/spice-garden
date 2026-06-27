const MenuItem = require('../models/MenuItem');
const path = require('path');
const fs = require('fs');

// @desc    Get all menu items
// @route   GET /api/menu
exports.getAllItems = async (req, res) => {
  try {
    const { category, isVeg, available } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';
    if (available !== undefined) filter.isAvailable = available === 'true';

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
exports.getItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item
// @route   POST /api/menu
exports.addItem = async (req, res) => {
  try {
    const itemData = { ...req.body };

    // Handle image upload
    if (req.file) {
      itemData.image = req.file.filename;
    }

    // Parse boolean fields
    if (itemData.isVeg !== undefined) itemData.isVeg = itemData.isVeg === 'true' || itemData.isVeg === true;
    if (itemData.isAvailable !== undefined) itemData.isAvailable = itemData.isAvailable === 'true' || itemData.isAvailable === true;
    if (itemData.isBestseller !== undefined) itemData.isBestseller = itemData.isBestseller === 'true' || itemData.isBestseller === true;

    const item = await MenuItem.create(itemData);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
exports.updateItem = async (req, res) => {
  try {
    const itemData = { ...req.body };

    // Handle new image upload
    if (req.file) {
      // Delete old image if it exists
      const oldItem = await MenuItem.findById(req.params.id);
      if (oldItem && oldItem.image && oldItem.image !== 'default-food.jpg') {
        const oldImagePath = path.join(__dirname, '..', 'uploads', oldItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      itemData.image = req.file.filename;
    }

    // Parse boolean fields
    if (itemData.isVeg !== undefined) itemData.isVeg = itemData.isVeg === 'true' || itemData.isVeg === true;
    if (itemData.isAvailable !== undefined) itemData.isAvailable = itemData.isAvailable === 'true' || itemData.isAvailable === true;
    if (itemData.isBestseller !== undefined) itemData.isBestseller = itemData.isBestseller === 'true' || itemData.isBestseller === true;

    const item = await MenuItem.findByIdAndUpdate(req.params.id, itemData, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete associated image
    if (item.image && item.image !== 'default-food.jpg') {
      const imagePath = path.join(__dirname, '..', 'uploads', item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bestseller items
// @route   GET /api/menu/bestsellers
exports.getBestsellers = async (req, res) => {
  try {
    const items = await MenuItem.find({ isBestseller: true, isAvailable: true }).limit(8);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
