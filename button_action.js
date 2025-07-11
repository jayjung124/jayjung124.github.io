// button_action.js

function selectRoute(button) {
  const text = button.innerText;
  alert(`You selected: ${text}`); // ✅ 알람창 표시

  // 선택적으로 HTML에도 표시
  const output = document.getElementById("route-output");
  if (output) {
    output.innerText = `You selected: ${text}`;
  }
}
