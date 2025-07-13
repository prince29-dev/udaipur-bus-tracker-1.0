// script.js

let routes = {};
let routeLayer;
let stopMarkers = [];

const map = L.map('map').setView([24.5854, 73.7125], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('routes.json')
  .then(res => res.json())
  .then(data => {
    routes = data;
    populateRoutes();
    document.getElementById('routeSelect').addEventListener('change', function () {
      showRoute(this.value);
    });
  });

function populateRoutes() {
  const sel = document.getElementById('routeSelect');
  sel.innerHTML = '<option value="">Select Route</option>';
  Object.entries(routes).forEach(([id, r]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.text = r.name;
    sel.appendChild(opt);
  });
}

function showRoute(id) {
  if (routeLayer) map.removeLayer(routeLayer);
  stopMarkers.forEach(m => map.removeLayer(m));
  stopMarkers = [];

  if (!id || !routes[id]) {
    document.getElementById('routeInfo').innerHTML = '';
    return;
  }
  const r = routes[id];
  document.getElementById('routeInfo').innerHTML = `
    <h2>${r.name}</h2>
    <p><strong>First Bus:</strong> ${r.first}</p>
    <p><strong>Last Bus:</strong> ${r.last}</p>
    <p><strong>Interval:</strong> ${r.interval}</p>
    <p><strong>Stops (${r.stops.length}):</strong> ${r.stops.join(', ')}</p>
  `;

  const coords = r.stops.map((s, i) => {
    return [
      24.58 + (Math.random() * 0.03 - 0.015),
      73.70 + (Math.random() * 0.03 - 0.015)
    ];
  });

  routeLayer = L.polyline(coords, { color: 'blue' }).addTo(map);
  coords.forEach((c,i) => {
    const marker = L.marker(c).addTo(map).bindPopup(r.stops[i]);
    stopMarkers.push(marker);
  });
  map.fitBounds(routeLayer.getBounds());

  const interval = parseInt(r.interval);
  const eta = `${interval + Math.floor(Math.random() * 5)} mins`;
  document.getElementById('routeInfo').innerHTML += `
    <p><strong>Estimated Arrival:</strong> ${eta}</p>
  `;
}