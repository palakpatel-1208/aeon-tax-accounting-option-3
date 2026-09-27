(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");
  var subToggle = document.querySelector(".sub-toggle");
  var hasSub = document.querySelector(".has-sub");
  var yearNodes = document.querySelectorAll("[data-year]");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    var label = toggle.querySelector(".sr-only");
    if (label) label.textContent = open ? "Close menu" : "Open menu";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 960px)").matches) setMenu(false);
      });
    });
  }

  if (subToggle && hasSub) {
    subToggle.addEventListener("click", function () {
      var open = subToggle.getAttribute("aria-expanded") === "true";
      subToggle.setAttribute("aria-expanded", open ? "false" : "true");
      hasSub.classList.toggle("is-open", !open);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  function setNavTop() {
    if (!header) return;
    document.documentElement.style.setProperty("--nav-top", header.offsetHeight + "px");
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 6);
    setNavTop();
  }

  setNavTop();
  window.addEventListener("resize", setNavTop);

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  yearNodes.forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = document.querySelector("[data-form-status]");
  var fields = ["name", "email", "phone", "service", "message"];

  function showError(input, message) {
    var error = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  }

  function validate() {
    var valid = true;
    var name = form.querySelector("#name");
    var email = form.querySelector("#email");
    var phone = form.querySelector("#phone");
    var service = form.querySelector("#service");
    var message = form.querySelector("#message");

    if (!name.value.trim()) {
      showError(name, "Enter your name.");
      valid = false;
    } else {
      showError(name, "");
    }

    if (!email.value.trim()) {
      showError(email, "Enter your email address.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Enter a valid email address.");
      valid = false;
    } else {
      showError(email, "");
    }

    if (phone.value.trim() && !/^[0-9+().\-\s]{7,}$/.test(phone.value.trim())) {
      showError(phone, "Enter a valid phone number, or leave this blank.");
      valid = false;
    } else {
      showError(phone, "");
    }

    if (!service.value) {
      showError(service, "Select a service.");
      valid = false;
    } else {
      showError(service, "");
    }

    if (!message.value.trim()) {
      showError(message, "Enter a message.");
      valid = false;
    } else {
      showError(message, "");
    }

    return valid;
  }

  fields.forEach(function (id) {
    var input = form.querySelector("#" + id);
    if (!input) return;
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate();
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      if (status) {
        status.hidden = true;
        status.textContent = "";
      }
      return;
    }

    var name = form.querySelector("#name").value.trim();
    var email = form.querySelector("#email").value.trim();
    var phone = form.querySelector("#phone").value.trim();
    var service = form.querySelector("#service");
    var serviceLabel = service.options[service.selectedIndex].text;
    var message = form.querySelector("#message").value.trim();
    var body = [
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (phone || "Not provided"),
      "Service: " + serviceLabel,
      "",
      message
    ].join("\n");

    window.location.href =
      "mailto:contact@aeontaxaccounting.com?subject=" +
      encodeURIComponent("Consultation request from " + name) +
      "&body=" +
      encodeURIComponent(body);

    if (status) {
      status.hidden = false;
      status.textContent =
        "Your email application should open with this message addressed to Aeon Tax and Accounting Services, LLC. Send it from there to reach us. You can also call +1 (555) 555-0100 or email contact@aeontaxaccounting.com directly.";
    }
  });
})();
