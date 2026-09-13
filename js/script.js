document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".site-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.classList.remove("error");

      // Let the browser's native validation (required, type="email") run first.
      if (!form.checkValidity()) {
        form.reportValidity();
        note.textContent = "Please fill in your name and a valid email address.";
        note.classList.add("error");
        return;
      }

      // Honeypot: a real visitor never sees or fills this field.
      var honeypot = document.getElementById("company-website");
      if (honeypot && honeypot.value.trim() !== "") {
        note.textContent = "Something went wrong. Please email us directly instead.";
        note.classList.add("error");
        return;
      }

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var channels = document.getElementById("channels").value.trim();
      var message = document.getElementById("message").value.trim();

      var subject = encodeURIComponent("Free Diagnostic Audit Request from " + name);
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Platforms: " + (channels || "Not specified"),
        "",
        "Message:",
        message || "Not specified"
      ];
      var body = encodeURIComponent(bodyLines.join("\n"));

      window.location.href = "mailto:ali@ledgize.com?subject=" + subject + "&body=" + body;
      note.textContent = "Opening your email client to send your request...";
    });
  }
});
