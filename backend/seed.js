const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const menuItems = [
  // North Indian
  { name: 'Butter Chicken', description: 'Tender chicken in a rich, creamy tomato-butter sauce with aromatic spices', price: 349, category: 'North Indian', isVeg: false, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese cubes in a spiced onion-tomato gravy', price: 299, category: 'North Indian', isVeg: true, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils in a buttery, creamy gravy', price: 249, category: 'North Indian', isVeg: true, isBestseller: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and saffron', price: 329, category: 'North Indian', isVeg: false, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80' },
  { name: 'Palak Paneer', description: 'Fresh spinach puree with soft cottage cheese cubes', price: 269, category: 'North Indian', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80' },
  { name: 'Rogan Josh', description: 'Slow-braised lamb in a rich Kashmiri chili and yogurt sauce', price: 399, category: 'North Indian', isVeg: false, spiceLevel: 'Hot', image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chole Bhature', description: 'Spiced chickpea curry with fluffy deep-fried bread', price: 199, category: 'North Indian', isVeg: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80' },
  { name: 'Naan Basket', description: 'Assorted naan: Butter, Garlic, and Cheese (3 pcs)', price: 149, category: 'North Indian', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1600398237498-41580f3b4527?auto=format&fit=crop&w=600&q=80' },

  // South Indian
  { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato filling, served with sambar & chutney', price: 179, category: 'South Indian', isVeg: true, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80' },
  { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup and coconut chutney', price: 129, category: 'South Indian', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hyderabadi Dum Biryani', description: 'Aromatic rice slow-cooked with marinated meat in sealed pot', price: 359, category: 'South Indian', isVeg: false, spiceLevel: 'Hot', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Medu Vada', description: 'Crispy fried urad dal donuts served with sambar and chutney', price: 119, category: 'South Indian', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80' },

  // Chinese
  { name: 'Veg Manchurian', description: 'Crispy vegetable balls in a tangy Indo-Chinese sauce', price: 219, category: 'Chinese', isVeg: true, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1645696301019-35adcc0b2056?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chicken Chilli', description: 'Crispy chicken tossed with peppers, onions in a spicy sauce', price: 279, category: 'Chinese', isVeg: false, spiceLevel: 'Hot', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables in soy sauce', price: 199, category: 'Chinese', isVeg: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80' },
  { name: 'Schezwan Fried Rice', description: 'Spicy fried rice with vegetables and fiery Schezwan sauce', price: 219, category: 'Chinese', isVeg: true, spiceLevel: 'Hot', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dragon Chicken', description: 'Crispy chicken with garlic, chilli flakes in a fiery sauce', price: 299, category: 'Chinese', isVeg: false, isBestseller: true, spiceLevel: 'Hot', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Spring Rolls', description: 'Crispy rolls stuffed with seasoned vegetables', price: 169, category: 'Chinese', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1548507229-5043a0d4c97a?auto=format&fit=crop&w=600&q=80' },

  // Continental
  { name: 'Grilled Chicken Steak', description: 'Juicy grilled chicken breast with herb butter and roasted vegetables', price: 399, category: 'Continental', isVeg: false, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1432139509613-5c4255a9a5d2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pasta Alfredo', description: 'Penne in creamy parmesan and garlic white sauce', price: 279, category: 'Continental', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, tomato sauce and basil', price: 299, category: 'Continental', isVeg: true, isBestseller: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
  { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons with creamy Caesar dressing', price: 199, category: 'Continental', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80' },

  // Starters
  { name: 'Paneer Tikka', description: 'Marinated cottage cheese cubes grilled in tandoor', price: 249, category: 'Starters', isVeg: true, isBestseller: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chicken Seekh Kebab', description: 'Minced chicken rolls grilled on skewers with aromatic spices', price: 289, category: 'Starters', isVeg: false, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80' },
  { name: 'Crispy Corn', description: 'Golden fried corn kernels tossed with spices and curry leaves', price: 179, category: 'Starters', isVeg: true, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fish Amritsari', description: 'Battered and fried fish fillets with a tangy dipping sauce', price: 319, category: 'Starters', isVeg: false, spiceLevel: 'Medium', image: 'https://images.unsplash.com/photo-1580217593608-61931ceaa71e?auto=format&fit=crop&w=600&q=80' },

  // Beverages
  { name: 'Mango Lassi', description: 'Chilled yogurt smoothie blended with fresh Alphonso mango', price: 129, category: 'Beverages', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Masala Chai', description: 'Aromatic Indian tea brewed with cardamom, ginger and spices', price: 69, category: 'Beverages', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda — sweet, salty, or mixed', price: 89, category: 'Beverages', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cold Coffee', description: 'Creamy blended coffee with ice cream and chocolate drizzle', price: 149, category: 'Beverages', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },

  // Desserts
  { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', price: 129, category: 'Desserts', isVeg: true, isBestseller: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1666190440848-efa16b785a44?auto=format&fit=crop&w=600&q=80' },
  { name: 'Rasmalai', description: 'Flattened paneer balls soaked in sweetened, cardamom-flavored milk', price: 149, category: 'Desserts', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80' },
  { name: 'Brownie with Ice Cream', description: 'Warm chocolate brownie topped with vanilla ice cream and chocolate sauce', price: 199, category: 'Desserts', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kheer', description: 'Traditional rice pudding slow-cooked with milk, saffron and nuts', price: 119, category: 'Desserts', isVeg: true, spiceLevel: 'Mild', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' }
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
