const API_URL = 'http://localhost:3005';
let mappa;

document.addEventListener('DOMContentLoaded', function() {
  creaMappa();
  aggiornaNavbar();
  caricaGatti();
});

function caricaGatti() {
  document.getElementById('loading').style.display = 'block';

  fetch(API_URL + '/cats')
    .then(response => response.json())
    .then(gatti => {
      document.getElementById('loading').style.display = 'none';

      gatti.forEach(function(gatto) {
        const marker = L.marker([gatto.location.lat, gatto.location.lng]).addTo(mappa);

        const popupContent = `
          <div style="text-align: center;">
            <h3 style="margin: 5px 0;">${gatto.name}</h3>
            <img src="${API_URL}/uploads/${gatto.image}"
              style="width: 200px; height: 150px; object-fit: cover; border-radius: 5px; margin: 10px 0;">
            <p style="margin: 5px 0; font-size: 12px;">
              ${gatto.description.substring(0, 50)}...
            </p>
            <p style="font-size: 11px; color: #666;">
              Pubblicato da: ${gatto.author.name}
            </p>
            <button onclick="window.location.href='detail-cat.html?id=${gatto._id}'"
              style="background: #2196F3; color: white; border: none;
              padding: 8px 15px; border-radius: 5px; cursor: pointer;
              margin-top: 10px; font-size: 14px;">
              Vedi dettagli
            </button>
          </div>
        `;
        marker.bindPopup(popupContent);
      });
    })
    .catch(error => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('message').textContent = 'Errore nel caricamento dei gatti';
      document.getElementById('message').style.display = 'block';
    });
}

function goToLogin() {
  window.location.href = 'login.html';
}

function pubblicaGatto() {
  const token = localStorage.getItem('token');

  if (token) {
    window.location.href = 'add-cat.html';
  } else {
    alert('Devi effettuare il login per pubblicare un gatto');
    window.location.href = 'login.html';
  }
}

function creaMappa() {
  mappa = L.map('map').setView([40.8518, 14.2681], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(mappa);
}

function aggiornaNavbar() {
  const navbar = document.getElementById('navbar');
  const token = localStorage.getItem('token');

  if (token) {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);

    navbar.innerHTML = `
      <span style="margin-right: 15px; color: #666;">Ciao, ${user.name}</span>
      <button class="nav-btn" onclick="logout()">Logout</button>
    `;
  } else {
    navbar.innerHTML = `<button class="nav-btn" onclick="goToLogin()">Login</button>`;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}
