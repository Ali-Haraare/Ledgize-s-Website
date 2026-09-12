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

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var channels = document.getElementById("channels").value.trim();
      var message = document.getElementById("message").value.trim();

      if (!name || !email) {
        note.textContent = "Please fill in your name and email.";
        return;
      }

      var subject = encodeURIComponent("Free Diagnostic Audit Request — " + name);
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Platforms: " + (channels || "—"),
        "",
        "Message:",
        message || "—"
      ];
      var body = encodeURIComponent(bodyLines.join("\n"));

      window.location.href = "mailto:ali@ledgize.com?subject=" + subject + "&body=" + body;
      note.textContent = "Opening your email client to send your request...";
    });
  }
});
