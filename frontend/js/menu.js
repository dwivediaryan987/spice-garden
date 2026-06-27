// =========================================
// SPICE GARDEN — Menu Page Logic
// =========================================

let allMenuItems = [];
let activeCategory = 'all';
let activeFilter = null;

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  setupTabs();
  setupSearch();
  setupFilters();
});

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  try {
    const data = await apiCall('/menu');
    if (data.success) {
      allMenuItems = data.data;
      renderMenu(allMenuItems);
    }
  } catch (error) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
        <p style="font-size:3rem; margin-bottom:10px;">🍽️</p>
        <p>Unable to load menu. Make sure the server is running.</p>
      </div>`;
  }
}

function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
        <p style="font-size:3rem; margin-bottom:10px;">😔</p>
        <p>No dishes found. Try a different filter.</p>
      </div>`;
    return;
  }
  grid.innerHTML = items.map(item => createMenuCard(item)).join('');
}

function filterMenu() {
  let filtered = [...allMenuItems];

  // Category filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory);
  }

  // Veg/NonVeg filter
  if (activeFilter === 'veg') {
    filtered = filtered.filter(item => item.isVeg);
  } else if (activeFilter === 'nonveg') {
    filtered = filtered.filter(item => !item.isVeg);
  }

  // Search filter
  const searchTerm = document.getElementById('menuSearch')?.value.toLowerCase() || '';
  if (searchTerm) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }

  renderMenu(filtered);
}

function setupTabs() {
  const tabs = document.querySelectorAll('#menuTabs .menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      filterMenu();
    });
  });
}

function setupSearch() {
  const search = document.getElementById('menuSearch');
  if (search) {
    let debounce;
    search.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(filterMenu, 300);
    });
  }
}

function setupFilters() {
  const vegBtn = document.getElementById('vegFilter');
  const nonVegBtn = document.getElementById('nonVegFilter');

  if (vegBtn) {
    vegBtn.addEventListener('click', () => {
      if (activeFilter === 'veg') {
        activeFilter = null;
        vegBtn.classList.remove('active');
      } else {
        activeFilter = 'veg';
        vegBtn.classList.add('active');
        nonVegBtn?.classList.remove('active');
      }
      filterMenu();
    });
  }

  if (nonVegBtn) {
    nonVegBtn.addEventListener('click', () => {
      if (activeFilter === 'nonveg') {
        activeFilter = null;
        nonVegBtn.classList.remove('active');
      } else {
        activeFilter = 'nonveg';
        nonVegBtn.classList.add('active');
        vegBtn?.classList.remove('active');
      }
      filterMenu();
    });
  }
}
