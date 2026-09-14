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

  var copyBtn = document.getElementById("copy-email-btn");
  var copyNote = document.getElementById("copy-note");
  if (copyBtn && copyNote) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");

      function showCopied() {
        copyNote.textContent = "Copied " + email + ". Paste it into your email app.";
      }
      function showFallback() {
        copyNote.textContent = "Couldn't copy automatically. The address is " + email + ".";
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(showFallback);
      } else {
        var tempInput = document.createElement("input");
        tempInput.value = email;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showCopied();
        } catch (e) {
          showFallback();
        }
        document.body.removeChild(tempInput);
      }
    });
  }
});
