// =========================================
// SPICE GARDEN — Main Utilities
// =========================================

// Auto-detect: use relative path locally, Render URL in production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'https://spice-garden-api.onrender.com/api';

// ---- Cart Management ----
const Cart = {
  getItems() {
    return JSON.parse(localStorage.getItem('sg_cart') || '[]');
  },

  saveItems(items) {
    localStorage.setItem('sg_cart', JSON.stringify(items));
    this.updateCount();
  },

  addItem(item) {
    const items = this.getItems();
    const existing = items.find(i => i._id === item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    this.saveItems(items);
    showToast(`${item.name} added to cart!`);
  },

  removeItem(id) {
    const items = this.getItems().filter(i => i._id !== id);
    this.saveItems(items);
  },

  updateQuantity(id, qty) {
    const items = this.getItems();
    const item = items.find(i => i._id === id);
    if (item) {
      item.quantity = qty;
      if (item.quantity <= 0) {
        return this.removeItem(id);
      }
    }
    this.saveItems(items);
  },

  getTotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  clear() {
    localStorage.removeItem('sg_cart');
    this.updateCount();
  },

  updateCount() {
    const countEls = document.querySelectorAll('#cartCount, .cart-count-badge');
    countEls.forEach(el => {
      el.textContent = this.getCount();
    });
  }
};

// ---- API Helper ----
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  // Add auth token if available
  const token = localStorage.getItem('sg_admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ---- Toast Notification ----
function showToast(message, icon = '✅') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const toastIcon = toast.querySelector('.toast-icon');
  const toastMsg = toast.querySelector('.toast-message');
  
  if (toastIcon) toastIcon.textContent = icon;
  if (toastMsg) toastMsg.textContent = message;
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Navbar Scroll Effect ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });

    // Close menu on link click
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => links.classList.remove('active'));
    });
  }
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ---- Menu Card Generator ----
function createMenuCard(item) {
  const vegBadge = item.isVeg 
    ? '<span class="badge-veg veg">V</span>' 
    : '<span class="badge-veg non-veg">N</span>';
  
  const bestsellerBadge = item.isBestseller 
    ? '<span class="badge-bestseller">★ Bestseller</span>' 
    : '';

  const spiceDots = ['Mild', 'Medium', 'Hot'].map((level, i) => {
    const isActive = ['Mild', 'Medium', 'Hot'].indexOf(item.spiceLevel) >= i;
    return `<span class="spice-dot ${isActive ? 'active' : ''}"></span>`;
  }).join('');

  const imageBase = API_BASE.replace('/api', '');
  const imageContent = item.image && item.image !== 'default-food.jpg'
    ? `<img src="${imageBase}/uploads/${item.image}" alt="${item.name}" loading="lazy">`
    : getCategoryEmoji(item.category);

  return `
    <div class="menu-card" data-id="${item._id}">
      <div class="menu-card-image">
        ${imageContent}
        <div class="menu-card-badges">
          ${vegBadge}
          ${bestsellerBadge}
        </div>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-category">${item.category}</div>
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.description}</p>
        <div class="spice-level">${spiceDots}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price"><span>₹</span>${item.price}</div>
          <button class="btn-add-cart" onclick="Cart.addItem(${JSON.stringify(item).replace(/"/g, '&quot;')})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `;
}

function getCategoryEmoji(category) {
  const emojis = {
    'North Indian': '🍛',
    'South Indian': '🥘',
    'Chinese': '🥡',
    'Continental': '🍝',
    'Starters': '🍢',
    'Beverages': '🥤',
    'Desserts': '🍨'
  };
  return emojis[category] || '🍽️';
}

// ---- Format Currency ----
function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ---- Initialize on DOM Load ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  Cart.updateCount();
});
