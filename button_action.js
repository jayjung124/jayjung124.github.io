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
  alert(`You selected: ${text}`); // ✅ 알람창 표시
}
