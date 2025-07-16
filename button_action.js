// button_action.js
function drawRoute(n) {
    const lat1 = parseFloat(document.getElementById("lat1").value);
    const lng1 = parseFloat(document.getElementById("lng1").value);
    const lat2 = parseFloat(document.getElementById("lat2").value);
    const lng2 = parseFloat(document.getElementById("lng2").value);

    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
      alert("Select your starting point and destination..");
      return;
    }

    const request = {
      origin: { lat: lat1, lng: lng1 },
      destination: { lat: lat2, lng: lng2 },
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        alert("No results found" + status);
      }
    });
  }

function setStartCoordinates() {
  document.getElementById("start-lat").value = 50;
  document.getElementById("start-lng").value = 50;
}

function setDestinationCoordinates() {
  document.getElementById("dest-lat").value = 10;
  document.getElementById("dest-lng").value = 10;
}

function contactsystem(button) {
  const text = button.innerText;

  let url = "";

  if (text.includes("Boston 311")) {
    url = "https://www.boston.gov/departments/boston-311";
  }else if(text.includes("Contact Wonders in Reach")){
    url = "https://wonderswithinreach.com/2021/07/wheelchair-accessible-boston/";
  }else if(text.includes("ADA Ramp Access Form")){
    url = "https://www.boston.gov/departments/disabilities-commission/ada-curb-ramp-requests";
  }
  else {
    alert("No URL assigned for this contact option.");
    return;
  }
  window.location.href = url;
}

function contributedatasystem(button) {
   const text = button.innerText;

  let url = "";

  if (text.includes("Click here to create more boundless cities!")) {
    url = "https://forms.gle/9kxAYWuhLZEBGbKP7";
  else {
    alert("No URL assigned for this contact option.");
    return;
  }
  window.location.href = url;
}
