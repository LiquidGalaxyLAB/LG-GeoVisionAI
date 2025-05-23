// Utility to handle page display
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-btn');
  
    pages.forEach(page => {
      if (page.id === pageId) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
  
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.id === 'btn-' + pageId);
    });
  }
  
  // Attach event listeners to nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.id.replace('btn-', '');
      showPage(target);
    });
  });
  
  // Initialize Leaflet map
  const map = L.map('mapid').setView([20.5937, 78.9629], 5); // Center India
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);
  
  // Settings form behavior
  const form = document.getElementById('settings-form');
  const rateValue = document.getElementById('rateValue');
  
  form.speechRate.addEventListener('input', (e) => {
    rateValue.textContent = e.target.value;
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // You can handle save logic here or localStorage etc.
    alert('Settings saved!');
  });
  