// =========================================
// SPICE GARDEN — Admin Auth Utilities
// =========================================

// Auto-detect: use relative path locally, Render URL in production
const ADMIN_API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'https://spice-garden-api.onrender.com/api';

function getToken() {
  return localStorage.getItem('sg_admin_token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('sg_admin_user') || '{}');
}

function checkAuth() {
  if (!getToken()) {
    window.location.href = '/admin/';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('sg_admin_token');
  localStorage.removeItem('sg_admin_user');
  window.location.href = '/admin/';
}

async function adminApi(endpoint, options = {}) {
  const url = `${ADMIN_API}${endpoint}`;
  const config = {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    ...options
  };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, config);
  const data = await res.json();

  if (res.status === 401) {
    logout();
    return;
  }

  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

function initSidebar(activePage) {
  const user = getUser();
  const userNameEl = document.getElementById('sidebarUserName');
  if (userNameEl) userNameEl.textContent = user.name || 'Admin';

  // Highlight active sidebar link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add('active');
    }
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });
}
