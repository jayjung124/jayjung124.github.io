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
  } else if (text.includes("Contact Wonders in Reach")) {
    url = "https://wonderswithinreach.com/2021/07/wheelchair-accessible-boston/";
  } else if (text.includes("ADA Ramp Access Form")) {
    url = "https://www.boston.gov/departments/disabilities-commission/ada-curb-ramp-requests";
  } else {
    alert("No URL assigned for this contact option.");
    return;
  }

  window.location.href = url;
}

function contributedatasystem(button) {
  const text = button.innerText;
  let url = "";

  if (text.includes("Click here to create more boundless cities!")) {
    // Demo Version Link
    url = "https://forms.gle/9kxAYWuhLZEBGbKP7";
  } else {
    alert("No URL assigned for this contact option.");
    return;
  }

  window.location.href = url;
}
let cameraStream = null;

function camerasystem(button) {
  const text = button.innerText;

  if (text.includes("Real-Time Object Detection")) {
    const video = document.getElementById("camera");

    if (cameraStream) {
      alert("Camera is already on.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        cameraStream = stream; // Store the stream so we don't restart it
        video.srcObject = stream;
        video.play();
      })
      .catch(error => {
        console.error('Failed to access camera:', error);
        alert('Failed to access camera.');
      });

  } else {
    alert("No camera action assigned for this button.");
    return;
  }
}
