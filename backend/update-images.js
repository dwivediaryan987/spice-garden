const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

// Real food images from Unsplash (high quality, free to use)
const foodImages = {
  'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
  'Paneer Tikka': 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d0d?w=400&h=300&fit=crop',
  'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=400&h=300&fit=crop',
  'Samosa': 'https://images.unsplash.com/photo-1601487154000-920d0d1d4bdf?w=400&h=300&fit=crop',
  'Dosa': 'https://images.unsplash.com/photo-1589301760014-d929314c3740?w=400&h=300&fit=crop',
  'Idli': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Chicken Chilli': 'https://images.unsplash.com/photo-1612874742237-415221591919?w=400&h=300&fit=crop',
  'Hakka Noodles': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
  'Manchurian': 'https://images.unsplash.com/photo-1609718019139-289ec315bc65?w=400&h=300&fit=crop',
  'Pizza': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
  'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
  'Garlic Bread': 'https://images.unsplash.com/photo-1599599810694-b3eb3c22cc15?w=400&h=300&fit=crop',
  'Cold Coffee': 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=300&fit=crop',
  'Fresh Lime Soda': 'https://images.unsplash.com/photo-1618522261698-4c97ba25ecda?w=400&h=300&fit=crop',
  'Mango Lassi': 'https://images.unsplash.com/photo-1585728062055-af47c631e98c?w=400&h=300&fit=crop',
  'Masala Chai': 'https://images.unsplash.com/photo-1597318957395-3dfc1d5c9a26?w=400&h=300&fit=crop',
  'Gulab Jamun': 'https://images.unsplash.com/photo-1585508270515-84a9bcf2b05f?w=400&h=300&fit=crop',
  'Kheer': 'https://images.unsplash.com/photo-1599599810981-b4b2d0a42f7f?w=400&h=300&fit=crop',
  'Jalebi': 'https://images.unsplash.com/photo-1599599810694-b3eb3c22cc15?w=400&h=300&fit=crop',
  'Tandoori Chicken': 'https://images.unsplash.com/photo-1599599810694-b3eb3c22cc15?w=400&h=300&fit=crop',
  'Rogan Josh': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'Dal Makhani': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'Chole Bhature': 'https://images.unsplash.com/photo-1582895474811-ab422c3c8a37?w=400&h=300&fit=crop',
  'Aloo Paratha': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Rasam': 'https://images.unsplash.com/photo-1589301760014-d929314c3740?w=400&h=300&fit=crop',
  'Sambar': 'https://images.unsplash.com/photo-1589301760014-d929314c3740?w=400&h=300&fit=crop',
  'Egg Fried Rice': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
  'Kung Pao Chicken': 'https://images.unsplash.com/photo-1612874742237-415221591919?w=400&h=300&fit=crop',
  'Chow Mein': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
  'Spring Roll': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Schezwan Noodles': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
  'Shrimp Noodles': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
  'Malai Kofta': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'Shahi Tukda': 'https://images.unsplash.com/photo-1599599810981-b4b2d0a42f7f?w=400&h=300&fit=crop',
  'Brownie': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
};

async function updateMenuImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const items = await MenuItem.find();
    console.log(`📋 Found ${items.length} menu items`);

    let updated = 0;
    for (const item of items) {
      // Try to find exact match first
      let imageUrl = foodImages[item.name];
      
      // If no exact match, find partial match
      if (!imageUrl) {
        const matchedKey = Object.keys(foodImages).find(key => 
          item.name.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(item.name.toLowerCase())
        );
        imageUrl = matchedKey ? foodImages[matchedKey] : null;
      }

      // If still no match, use a generic food image for the category
      if (!imageUrl) {
        const categoryImages = {
          'North Indian': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
          'South Indian': 'https://images.unsplash.com/photo-1589301760014-d929314c3740?w=400&h=300&fit=crop',
          'Chinese': 'https://images.unsplash.com/photo-1559328007-f4f58fc96b55?w=400&h=300&fit=crop',
          'Continental': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305bc?w=400&h=300&fit=crop',
          'Starters': 'https://images.unsplash.com/photo-1585728062055-af47c631e98c?w=400&h=300&fit=crop',
          'Beverages': 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=300&fit=crop',
          'Desserts': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
        };
        imageUrl = categoryImages[item.category] || categoryImages['North Indian'];
      }

      // Update the item
      item.image = imageUrl;
      await item.save();
      updated++;
      console.log(`✅ Updated: ${item.name} → ${imageUrl.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Successfully updated ${updated}/${items.length} items with images!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateMenuImages();
