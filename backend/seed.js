const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const menuItems = [
  // North Indian
  { name: 'Butter Chicken', description: 'Tender chicken in a rich, creamy tomato-butter sauce with aromatic spices', price: 349, category: 'North Indian', isVeg: false, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese cubes in a spiced onion-tomato gravy', price: 299, category: 'North Indian', isVeg: true, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils in a buttery, creamy gravy', price: 249, category: 'North Indian', isVeg: true, isBestseller: true, spiceLevel: 'Mild' },
  { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and saffron', price: 329, category: 'North Indian', isVeg: false, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Palak Paneer', description: 'Fresh spinach puree with soft cottage cheese cubes', price: 269, category: 'North Indian', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Rogan Josh', description: 'Slow-braised lamb in a rich Kashmiri chili and yogurt sauce', price: 399, category: 'North Indian', isVeg: false, spiceLevel: 'Hot' },
  { name: 'Chole Bhature', description: 'Spiced chickpea curry with fluffy deep-fried bread', price: 199, category: 'North Indian', isVeg: true, spiceLevel: 'Medium' },
  { name: 'Naan Basket', description: 'Assorted naan: Butter, Garlic, and Cheese (3 pcs)', price: 149, category: 'North Indian', isVeg: true, spiceLevel: 'Mild' },

  // South Indian
  { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato filling, served with sambar & chutney', price: 179, category: 'South Indian', isVeg: true, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup and coconut chutney', price: 129, category: 'South Indian', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Hyderabadi Dum Biryani', description: 'Aromatic rice slow-cooked with marinated meat in sealed pot', price: 359, category: 'South Indian', isVeg: false, spiceLevel: 'Hot' },
  { name: 'Medu Vada', description: 'Crispy fried urad dal donuts served with sambar and chutney', price: 119, category: 'South Indian', isVeg: true, spiceLevel: 'Mild' },

  // Chinese
  { name: 'Veg Manchurian', description: 'Crispy vegetable balls in a tangy Indo-Chinese sauce', price: 219, category: 'Chinese', isVeg: true, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Chicken Chilli', description: 'Crispy chicken tossed with peppers, onions in a spicy sauce', price: 279, category: 'Chinese', isVeg: false, spiceLevel: 'Hot' },
  { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables in soy sauce', price: 199, category: 'Chinese', isVeg: true, spiceLevel: 'Medium' },
  { name: 'Schezwan Fried Rice', description: 'Spicy fried rice with vegetables and fiery Schezwan sauce', price: 219, category: 'Chinese', isVeg: true, spiceLevel: 'Hot' },
  { name: 'Dragon Chicken', description: 'Crispy chicken with garlic, chilli flakes in a fiery sauce', price: 299, category: 'Chinese', isVeg: false, isBestseller: true, spiceLevel: 'Hot' },
  { name: 'Spring Rolls', description: 'Crispy rolls stuffed with seasoned vegetables', price: 169, category: 'Chinese', isVeg: true, spiceLevel: 'Mild' },

  // Continental
  { name: 'Grilled Chicken Steak', description: 'Juicy grilled chicken breast with herb butter and roasted vegetables', price: 399, category: 'Continental', isVeg: false, spiceLevel: 'Mild' },
  { name: 'Pasta Alfredo', description: 'Penne in creamy parmesan and garlic white sauce', price: 279, category: 'Continental', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, tomato sauce and basil', price: 299, category: 'Continental', isVeg: true, isBestseller: true, spiceLevel: 'Mild' },
  { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons with creamy Caesar dressing', price: 199, category: 'Continental', isVeg: true, spiceLevel: 'Mild' },

  // Starters
  { name: 'Paneer Tikka', description: 'Marinated cottage cheese cubes grilled in tandoor', price: 249, category: 'Starters', isVeg: true, isBestseller: true, spiceLevel: 'Medium' },
  { name: 'Chicken Seekh Kebab', description: 'Minced chicken rolls grilled on skewers with aromatic spices', price: 289, category: 'Starters', isVeg: false, spiceLevel: 'Medium' },
  { name: 'Crispy Corn', description: 'Golden fried corn kernels tossed with spices and curry leaves', price: 179, category: 'Starters', isVeg: true, spiceLevel: 'Medium' },
  { name: 'Fish Amritsari', description: 'Battered and fried fish fillets with a tangy dipping sauce', price: 319, category: 'Starters', isVeg: false, spiceLevel: 'Medium' },

  // Beverages
  { name: 'Mango Lassi', description: 'Chilled yogurt smoothie blended with fresh Alphonso mango', price: 129, category: 'Beverages', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Masala Chai', description: 'Aromatic Indian tea brewed with cardamom, ginger and spices', price: 69, category: 'Beverages', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda — sweet, salty, or mixed', price: 89, category: 'Beverages', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Cold Coffee', description: 'Creamy blended coffee with ice cream and chocolate drizzle', price: 149, category: 'Beverages', isVeg: true, spiceLevel: 'Mild' },

  // Desserts
  { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', price: 129, category: 'Desserts', isVeg: true, isBestseller: true, spiceLevel: 'Mild' },
  { name: 'Rasmalai', description: 'Flattened paneer balls soaked in sweetened, cardamom-flavored milk', price: 149, category: 'Desserts', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Brownie with Ice Cream', description: 'Warm chocolate brownie topped with vanilla ice cream and chocolate sauce', price: 199, category: 'Desserts', isVeg: true, spiceLevel: 'Mild' },
  { name: 'Kheer', description: 'Traditional rice pudding slow-cooked with milk, saffron and nuts', price: 119, category: 'Desserts', isVeg: true, spiceLevel: 'Mild' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert menu items
    await MenuItem.insertMany(menuItems);
    console.log(`🍽️  Inserted ${menuItems.length} menu items`);

    // Create default admin user if none exists
    const adminExists = await User.findOne({ email: 'admin@spicegarden.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@spicegarden.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('👤 Created default admin user');
      console.log('   Email: admin@spicegarden.com');
      console.log('   Password: admin123');
    }

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
