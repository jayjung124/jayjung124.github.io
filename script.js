/* ========= Global Variables ========= */
const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv';

let map, directionsService, directionsRenderer;
let marker = null;         // Marker placed by user
let activeTarget = 1;      // 1: Start point, 2: Destination
let alerted = false;       // Flag to prevent repeated 100m alerts

/* ========= Utility Functions ========= */
function convertImageLink(url) {
  const match = url.match(/\/d\/(.*?)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
}

function parseCSV(text) {
  const rows = text.trim().split('\n').map(r => r.split(','));
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(row => {
    const obj = {};
    row.forEach((val, i) => {
      obj[headers[i]] = val.trim();
    });
    return obj;
  });
}

/* ========= Initialize Map ========= */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 42.35, lng: -71.08 } // Default: Boston
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  /* 1) Add wheelchair accessibility markers */
  fetch(SHEET_URL)
    .then(r => r.text())
    .then(csv => {
      const locations = parseCSV(csv);

      locations.forEach(loc => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const isAccessible = loc.accessible.toLowerCase() === 'true';
        const icon = isAccessible
          ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

        const m = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon
        });

        const imageUrl = convertImageLink(loc.Image_url || '');

        const infoContent = `
          <div>
            <h3>${loc.name}</h3>
            <p>♿ Wheelchair ${isAccessible ? 'Accessible ✅' : 'Inaccessible ❌'}</p>
            ${imageUrl ? `<img src="${imageUrl}" width="200"/>` : ''}
          </div>
        `;

        const info = new google.maps.InfoWindow({ content: infoContent });
        m.addListener('click', () => info.open(map, m));
      });
    })
    .catch(err => console.error('Failed to load CSV', err));

  /* 2) Set start or destination on map click */
  map.addListener('click', (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (marker) marker.setMap(null); // Remove previous marker
    marker = new google.maps.Marker({ position: { lat, lng }, map });

    if (activeTarget === 1) {
      document.getElementById('lat1').value = lat.toFixed(6);
      document.getElementById('lng1').value = lng.toFixed(6);
    } else {
      document.getElementById('lat2').value = lat.toFixed(6);
      document.getElementById('lng2').value = lng.toFixed(6);
    }
  });

  /* 3) Real-time location tracking & 100m proximity alert */
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      checkProximity(lat, lng);
    }, err => {
      document.getElementById('proximity-status').textContent =
        'Failed to access your location.';
      console.error(err);
    });
  } else {
    document.getElementById('proximity-status').textContent =
      'Your browser does not support geolocation.';
  }
}

/* ========= Set Start or Destination ========= */
function setTarget(type) {
    alert(`Target ${type} selected.`);
    if(type == 1)
        activeTarget = 1;
    else
        activeTarget = 2;
}

/* ========= Show Driving Route ========= */
function showDrivingRoute() {
  const [lat1, lng1, lat2, lng2] = getInputCoords();
  if (lat1 === null) return;

  directionsService.route({
    origin: { lat: lat1, lng: lng1 },
    destination: { lat: lat2, lng: lng2 },
    travelMode: google.maps.TravelMode.DRIVING
  }, (res, status) => {
    if (status === 'OK') directionsRenderer.setDirections(res);
    else alert('Could not find driving route: ' + status);
  });
}

/* ========= Show Public Transit Route ========= */
function showTransitRoute() {
  const [lat1, lng1, lat2, lng2] = getInputCoords();
  if (lat1 === null) return;

  directionsService.route({
    origin: { lat: lat1, lng: lng1 },
    destination: { lat: lat2, lng: lng2 },
    travelMode: google.maps.TravelMode.TRANSIT,
    transitOptions: { departureTime: new Date() }
  }, (res, status) => {
    if (status === 'OK') directionsRenderer.setDirections(res);
    else alert("Couldn't find public transport route: " + status);
  });
}

/* ========= 100m Proximity Check ========= */
function checkProximity(lat, lng) {
  const lat2 = parseFloat(document.getElementById('lat2').value);
  const lng2 = parseFloat(document.getElementById('lng2').value);
  if (isNaN(lat2) || isNaN(lng2)) {
    document.getElementById('proximity-status').textContent =
      'Destination coordinates are not set.';
    return;
  }

  const distance = getDistance(lat, lng, lat2, lng2);
  document.getElementById('proximity-status').textContent =
    `Current Location: (${lat.toFixed(5)}, ${lng.toFixed(5)}) | Distance to Destination: ${distance.toFixed(1)} m`;

  if (distance <= 100 && !alerted) {
    alerted = true;
    alert('🎯 You are within 100 meters of your destination!');
    document.getElementById('alert-sound').play();
  } else if (distance > 120) {
    alerted = false; // Reset alert if moved away
  }
}

/* ========= Haversine Distance Calculation ========= */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ========= Input Validation ========= */
function getInputCoords() {
  const lat1 = parseFloat(document.getElementById('lat1').value);
  const lng1 = parseFloat(document.getElementById('lng1').value);
  const lat2 = parseFloat(document.getElementById('lat2').value);
  const lng2 = parseFloat(document.getElementById('lng2').value);
  if ([lat1, lng1, lat2, lng2].some(v => isNaN(v))) {
    alert('Please enter valid coordinates for both start and destination.');
    return [null];
  }
  return [lat1, lng1, lat2, lng2];
}
