// =========================================
// SPICE GARDEN — Homepage Logic
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  loadBestsellers();
});

async function loadBestsellers() {
  const grid = document.getElementById('bestsellersGrid');
  if (!grid) return;

  try {
    const data = await apiCall('/menu/bestsellers');
    if (data.success && data.data.length > 0) {
      grid.innerHTML = data.data.map(item => createMenuCard(item)).join('');
    } else {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 3rem; margin-bottom: 10px;">🍽️</p>
          <p>Menu items coming soon! Check back shortly.</p>
        </div>
      `;
    }
  } catch (error) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 3rem; margin-bottom: 10px;">🍽️</p>
        <p>Menu items loading... Make sure the server is running.</p>
        <p style="font-size: 0.8rem; margin-top: 10px;">Run: npm start</p>
      </div>
    `;
  }
}
