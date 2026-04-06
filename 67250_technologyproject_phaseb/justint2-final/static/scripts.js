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

var ticketPrice = 18;

function calculateCheckoutTotal(quantity) {
  var safeQuantity = Number(quantity);
  if (
    !Number.isInteger(safeQuantity) ||
    safeQuantity < 1 ||
    safeQuantity > 10
  ) {
    return 0;
  }
  return safeQuantity * ticketPrice;
}

function updateCheckoutTotal() {
  var quantityInput = document.getElementById("ticketQuantity");
  var totalEl = document.getElementById("checkoutTotal");
  if (!quantityInput || !totalEl) {
    return;
  }

  var total = calculateCheckoutTotal(quantityInput.value);
  totalEl.textContent = "$" + total.toFixed(2);
}

function setFieldError(fieldId, message) {
  var errorEl = document.getElementById(fieldId + "Error");
  if (!errorEl) {
    return;
  }
  errorEl.textContent = message;
}

function validateCheckoutForm() {
  var form = document.getElementById("checkoutForm");
  if (!form) {
    return { isValid: false };
  }

  var visitDate = document.getElementById("visitDate");
  var ticketType = document.getElementById("ticketType");
  var ticketQuantity = document.getElementById("ticketQuantity");
  var email = document.getElementById("email");
  var zipCode = document.getElementById("zipCode");
  var mailingList = document.getElementById("mailingList");

  setFieldError("visitDate", "");
  setFieldError("ticketType", "");
  setFieldError("ticketQuantity", "");
  setFieldError("email", "");
  setFieldError("zipCode", "");

  var isValid = true;

  if (!visitDate || !visitDate.value) {
    setFieldError("visitDate", "Please select a visit date.");
    isValid = false;
  }

  if (!ticketType || !ticketType.value) {
    setFieldError("ticketType", "Please select a ticket type.");
    isValid = false;
  }

  var quantityValue = Number(ticketQuantity && ticketQuantity.value);
  if (
    !ticketQuantity ||
    !Number.isInteger(quantityValue) ||
    quantityValue < 1 ||
    quantityValue > 10
  ) {
    setFieldError("ticketQuantity", "Enter a whole number from 1 to 10.");
    isValid = false;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email.value.trim())) {
    setFieldError("email", "Please enter a valid email address.");
    isValid = false;
  }

  var zip = zipCode ? zipCode.value.trim() : "";
  if (zip !== "" && !/^\d{5}$/.test(zip)) {
    setFieldError("zipCode", "Zip code must be exactly five digits.");
    isValid = false;
  }

  if (!isValid) {
    return { isValid: false };
  }

  var total = calculateCheckoutTotal(quantityValue);
  return {
    isValid: true,
    visitDate: visitDate.value,
    ticketType: ticketType.value,
    ticketQuantity: quantityValue,
    email: email.value.trim(),
    zipCode: zip,
    mailingList: mailingList ? mailingList.checked : false,
    total: total,
  };
}

function initCheckoutPage() {
  var form = document.getElementById("checkoutForm");
  if (!form) {
    return;
  }

  var quantityInput = document.getElementById("ticketQuantity");
  var typeInput = document.getElementById("ticketType");

  if (quantityInput) {
    quantityInput.addEventListener("input", updateCheckoutTotal);
  }

  if (typeInput) {
    typeInput.addEventListener("change", updateCheckoutTotal);
  }

  updateCheckoutTotal();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var result = validateCheckoutForm();
    if (!result.isValid) {
      return;
    }

    var params = new URLSearchParams();
    params.set("date", result.visitDate);
    params.set("type", result.ticketType);
    params.set("qty", String(result.ticketQuantity));
    params.set("email", result.email);
    params.set("zip", result.zipCode);
    params.set("mailing", result.mailingList ? "yes" : "no");
    params.set("total", result.total.toFixed(2));

    window.location.href = "confirmation.html?" + params.toString();
  });
}

function renderConfirmation() {
  var confirmTotalEl = document.getElementById("confirmTotal");
  var confirmDetailsEl = document.getElementById("confirmDetails");
  if (!confirmTotalEl || !confirmDetailsEl) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var date = params.get("date") || "Not provided";
  var type = params.get("type") || "Not provided";
  var qty = params.get("qty") || "0";
  var total = params.get("total") || "0.00";
  var mailing = params.get("mailing") === "yes" ? "Yes" : "No";

  confirmTotalEl.textContent = "$" + total;
  confirmDetailsEl.textContent =
    "Visit Date: " +
    date +
    " | Ticket Type: " +
    type +
    " | Quantity: " +
    qty +
    " | Mailing List: " +
    mailing;
}

function initGallery() {
  var gallery = document.getElementById("galleryShow");
  if (!gallery) {
    return;
  }

  var slides = gallery.querySelectorAll(".slide");
  var prevBtn = document.getElementById("prevSlide");
  var nextBtn = document.getElementById("nextSlide");

  if (!slides.length || !prevBtn || !nextBtn) {
    return;
  }

  var activeIndex = 0;

  function showSlide(index) {
    slides.forEach(function (slide, i) {
      if (i === index) {
        slide.classList.add("active-slide");
      } else {
        slide.classList.remove("active-slide");
      }
    });
  }

  prevBtn.addEventListener("click", function () {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    showSlide(activeIndex);
  });

  nextBtn.addEventListener("click", function () {
    activeIndex = (activeIndex + 1) % slides.length;
    showSlide(activeIndex);
  });

  showSlide(activeIndex);
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
