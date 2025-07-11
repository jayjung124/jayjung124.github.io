// button_action.js

function selectRoute(button) {
  const text = button.innerText;
  alert(`You selected: ${text}`); // ✅ 알람창 표시

  // 선택적으로 HTML에도 표시
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
    //Demo Version Link
 else {
    alert("No URL assigned for this contact option.");
    return;
  }
  window.location.href = url;
}
    
