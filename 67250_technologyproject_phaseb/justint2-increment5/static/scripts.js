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

function ActiveNav() {
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll(".nav_bar a");

  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

function toggleNav(navId) {
  var nav = document.getElementById(navId);
  if (!nav) {
    return;
  }

  nav.classList.toggle("responsive");
}

function initLeafletMap() {
  var mapEl = document.getElementById("museumMap");
  if (!mapEl || typeof window.L === "undefined") {
    return;
  }

  if (mapEl.dataset.initialized === "true") {
    return;
  }

  var map = window.L.map("museumMap").setView([40.4445, -79.9437], 13);

  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  window.L.marker([40.4445, -79.9437])
    .addTo(map)
    .bindPopup("MonoMuse - Pittsburgh, PA")
    .openPopup();

  mapEl.dataset.initialized = "true";
}

function showPurchaseForm(selectedDate) {
  var form = document.getElementById("purchaseForm");
  if (!form) {
    return;
  }

  form.style.display = "grid";
  var dateField = document.getElementById("selectedDate");
  if (dateField) {
    dateField.value = selectedDate;
  }
}

function submitPurchase() {
  alert("Redirecting to payment system.");
}

if (typeof window.jQuery !== "undefined") {
  window.jQuery(function () {
    window.jQuery("#readMore").click(function () {
      window.jQuery("#longIntro").show();
      window.jQuery("#readLess").show();
      window.jQuery("#readMore").hide();
    });

    window.jQuery("#readLess").click(function () {
      window.jQuery("#longIntro").hide();
      window.jQuery("#readLess").hide();
      window.jQuery("#readMore").show();
    });
  });
}
