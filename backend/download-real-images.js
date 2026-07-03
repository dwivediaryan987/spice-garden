const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

// Real restaurant food images from Pexels & Pixabay (free high-quality)
// These are direct image URLs that can be downloaded
const foodImagesMap = {
  'Butter Chicken': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400&h=300&fit=crop',
  'Paneer Tikka Masala': 'https://images.pexels.com/photos/9609841/pexels-photo-9609841.jpeg?w=400&h=300&fit=crop',
  'Dal Makhani': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400&h=300&fit=crop',
  'Chicken Biryani': 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400&h=300&fit=crop',
  'Palak Paneer': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400&h=300&fit=crop',
  'Rogan Josh': 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400&h=300&fit=crop',
  'Chole Bhature': 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400&h=300&fit=crop',
  'Naan Basket': 'https://images.pexels.com/photos/5737361/pexels-photo-5737361.jpeg?w=400&h=300&fit=crop',
  'Masala Dosa': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Idli Sambar': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Hyderabadi Dum Biryani': 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400&h=300&fit=crop',
  'Medu Vada': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Veg Manchurian': 'https://images.pexels.com/photos/4518543/pexels-photo-4518543.jpeg?w=400&h=300&fit=crop',
  'Chicken Chilli': 'https://images.pexels.com/photos/5737361/pexels-photo-5737361.jpeg?w=400&h=300&fit=crop',
  'Hakka Noodles': 'https://images.pexels.com/photos/5737361/pexels-photo-5737361.jpeg?w=400&h=300&fit=crop',
  'Schezwan Fried Rice': 'https://images.pexels.com/photos/5737361/pexels-photo-5737361.jpeg?w=400&h=300&fit=crop',
  'Dragon Chicken': 'https://images.pexels.com/photos/5737361/pexels-photo-5737361.jpeg?w=400&h=300&fit=crop',
  'Spring Rolls': 'https://images.pexels.com/photos/4518543/pexels-photo-4518543.jpeg?w=400&h=300&fit=crop',
  'Grilled Chicken Steak': 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?w=400&h=300&fit=crop',
  'Pasta Alfredo': 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=400&h=300&fit=crop',
  'Margherita Pizza': 'https://images.pexels.com/photos/3720456/pexels-photo-3720456.jpeg?w=400&h=300&fit=crop',
  'Caesar Salad': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400&h=300&fit=crop',
  'Paneer Tikka': 'https://images.pexels.com/photos/9609841/pexels-photo-9609841.jpeg?w=400&h=300&fit=crop',
  'Chicken Seekh Kebab': 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?w=400&h=300&fit=crop',
  'Crispy Corn': 'https://images.pexels.com/photos/4518543/pexels-photo-4518543.jpeg?w=400&h=300&fit=crop',
  'Fish Amritsari': 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=400&h=300&fit=crop',
  'Mango Lassi': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Masala Chai': 'https://images.pexels.com/photos/3407857/pexels-photo-3407857.jpeg?w=400&h=300&fit=crop',
  'Fresh Lime Soda': 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=400&h=300&fit=crop',
  'Cold Coffee': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400&h=300&fit=crop',
  'Gulab Jamun': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Rasmalai': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop',
  'Brownie with Ice Cream': 'https://images.pexels.com/photos/1998597/pexels-photo-1998597.jpeg?w=400&h=300&fit=crop',
  'Kheer': 'https://images.pexels.com/photos/8969614/pexels-photo-8969614.jpeg?w=400&h=300&fit=crop'
};

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Create uploads folder if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filename);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function updateMenuWithRealImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const items = await MenuItem.find();
    console.log(`📋 Found ${items.length} menu items`);
    console.log('📥 Starting image download and upload...\n');

    let updated = 0;
    let failed = 0;

    for (const item of items) {
      try {
        // Find matching image URL
        let imageUrl = foodImagesMap[item.name];
        
        if (!imageUrl) {
          const matchedKey = Object.keys(foodImagesMap).find(key =>
            item.name.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(item.name.toLowerCase())
          );
          imageUrl = matchedKey ? foodImagesMap[matchedKey] : null;
        }

        if (imageUrl) {
          // Create filename
          const filename = `${item._id}-${item.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
          
          // Download image
          await downloadImage(imageUrl, filename);
          
          // Update database with filename
          item.image = filename;
          await item.save();
          
          console.log(`✅ ${item.name}`);
          console.log(`   📥 Downloaded: ${filename}`);
          console.log(`   💾 Saved to DB\n`);
          updated++;
        } else {
          console.log(`⚠️  ${item.name} - No image URL found\n`);
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${item.name} - Error: ${error.message}\n`);
        failed++;
      }
    }

    console.log(`\n🎉 Complete!`);
    console.log(`✅ Updated: ${updated}/${items.length}`);
    console.log(`❌ Failed: ${failed}/${items.length}`);
    console.log(`\n📁 All images saved to: /backend/uploads/`);
    console.log(`🚀 Ready to deploy!`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateMenuWithRealImages();
