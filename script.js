const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv';

let marker;
let activeTarget = 1;
let map;
let directionsService;
let directionsRenderer;

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

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 42.35, lng: -71.08 },
  });

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv';

let marker;
let activeTarget = 1;
let map;
let directionsService;
let directionsRenderer;

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
  
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
  
    
    fetch(SHEET_URL)
      .then(response => response.text())
      .then(csvText => {
        const locations = parseCSV(csvText);
        console.log("Parsed locations:", locations);
  
        locations.forEach(loc => {
          const lat = parseFloat(loc.latitude);
          const lng = parseFloat(loc.longitude);
          if (isNaN(lat) || isNaN(lng)) return;
  
          const isAccessible = loc.accessible.toLowerCase() === 'true';
          const icon = isAccessible
            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            icon,
          });
  
          const imageUrl = convertImageLink(loc.Image_url || '');
  
          const infoContent = `
            <div>
              <h3>${loc.name}</h3>
              <p>♿ Wheelchair ${isAccessible ? 'Accessible ✅' : 'Inaccessible ❌'}</p>
              ${imageUrl ? `<img src="${imageUrl}" width="200"/>` : ''}
            </div>
          `;
  
          const infowindow = new google.maps.InfoWindow({
            content: infoContent,
          });
  
          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        });
      })
      .catch(error => {
        alert("Failed to load data.");
        console.error(error);
      });
  
    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
  
      if (marker) {
        marker.setMap(null);
      }
  
      marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
      });
  
      if (activeTarget === 1) {
        document.getElementById("lat1").value = lat.toFixed(6);
        document.getElementById("lng1").value = lng.toFixed(6);
      } else if (activeTarget === 2) {
        document.getElementById("lat2").value = lat.toFixed(6);
        document.getElementById("lng2").value = lng.toFixed(6);
      }
    });
  }
  
  function setTarget(targetNum) {
    activeTarget = targetNum;
    alert(`📍 Target ${targetNum} selected`);
  }
  
  function showDrivingRoute() {
    const lat1 = parseFloat(document.getElementById("lat1").value);
    const lng1 = parseFloat(document.getElementById("lng1").value);
    const lat2 = parseFloat(document.getElementById("lat2").value);
    const lng2 = parseFloat(document.getElementById("lng2").value);
  
    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
      alert("Please set the departure and arrival points correctly..");
      return;
    }
  
    directionsService.route(
      {
        origin: { lat: lat1, lng: lng1 },
        destination: { lat: lat2, lng: lng2 },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Could not find car route: " + status);
        }
      }
    );
  }
  
  function showTransitRoute() {
    const lat1 = parseFloat(document.getElementById("lat1").value);
    const lng1 = parseFloat(document.getElementById("lng1").value);
    const lat2 = parseFloat(document.getElementById("lat2").value);
    const lng2 = parseFloat(document.getElementById("lng2").value);
  
    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
      alert("Please set the departure and arrival points correctly.");
      return;
    }
  
    directionsService.route(
      {
        origin: { lat: lat1, lng: lng1 },
        destination: { lat: lat2, lng: lng2 },
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
          departureTime: new Date(),
        },
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Can't find public transport directions: " + status);
        }
      }
    );
  }

  
  fetch(SHEET_URL)
    .then(response => response.text())
    .then(csvText => {
      const locations = parseCSV(csvText);
      console.log("Parsed locations:", locations);

      locations.forEach(loc => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const isAccessible = loc.accessible.toLowerCase() === 'true';
        const icon = isAccessible
          ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon,
        });

        const imageUrl = convertImageLink(loc.Image_url || '');

        const infoContent = `
          <div>
            <h3>${loc.name}</h3>
            <p>♿ Wheelchair ${isAccessible ? 'Accessible ✅' : 'Inaccessible ❌'}</p>
            ${imageUrl ? `<img src="${imageUrl}" width="200"/>` : ''}
          </div>
        `;

        const infowindow = new google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
      });
    })
    .catch(error => {
      alert("Failed to load data.");
      console.error(error);
    });

  map.addListener("click", (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (marker) {
      marker.setMap(null);
    }

    marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
    });

    if (activeTarget === 1) {
      document.getElementById("lat1").value = lat.toFixed(6);
      document.getElementById("lng1").value = lng.toFixed(6);
    } else if (activeTarget === 2) {
      document.getElementById("lat2").value = lat.toFixed(6);
      document.getElementById("lng2").value = lng.toFixed(6);
    }
  });
}

function setTarget(targetNum) {
  activeTarget = targetNum;
  alert(`📍 Target ${targetNum} selected`);
}

function showDrivingRoute() {
  const lat1 = parseFloat(document.getElementById("lat1").value);
  const lng1 = parseFloat(document.getElementById("lng1").value);
  const lat2 = parseFloat(document.getElementById("lat2").value);
  const lng2 = parseFloat(document.getElementById("lng2").value);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    alert("Please set the departure and arrival points correctly..");
    return;
  }

  directionsService.route(
    {
      origin: { lat: lat1, lng: lng1 },
      destination: { lat: lat2, lng: lng2 },
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        alert("Could not find car route: " + status);
      }
    }
  );
}

function showTransitRoute() {
  const lat1 = parseFloat(document.getElementById("lat1").value);
  const lng1 = parseFloat(document.getElementById("lng1").value);
  const lat2 = parseFloat(document.getElementById("lat2").value);
  const lng2 = parseFloat(document.getElementById("lng2").value);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    alert("Please set the departure and arrival points correctly.");
    return;
  }

  directionsService.route(
    {
      origin: { lat: lat1, lng: lng1 },
      destination: { lat: lat2, lng: lng2 },
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
        departureTime: new Date(),
      },
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        alert("Can't find public transport directions: " + status);
      }
    }
  );
}
