var now = new Date();
var hour = now.getHours();

function greetings(x) {
  var greetingEl = document.getElementById("greeting");
  if (!greetingEl) {
    return;
  }

  if (x < 12) {
    greetingEl.textContent = "Good Morning";
  } else if (12 <= x && x < 18) {
    greetingEl.textContent = "Good Afternoon";
  } else if (18 <= x && x < 20) {
    greetingEl.textContent = "Good Evening";
  } else if (20 <= x && x < 24) {
    greetingEl.textContent = "Good Night";
  }
}

greetings(hour);

function addYear() {
  var copyYearEl = document.getElementById("copyYear");
  if (!copyYearEl) {
    return;
  }

  copyYearEl.textContent = new Date().getFullYear();
}
