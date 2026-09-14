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
    var iconCopy = copyBtn.querySelector(".icon-copy");
    var iconCheck = copyBtn.querySelector(".icon-check");
    var revertTimer = null;

    function showCopied(email) {
      copyNote.textContent = "Copied " + email + ". Paste it into your email app.";
      copyBtn.classList.add("copied");
      iconCopy.hidden = true;
      iconCheck.hidden = false;

      clearTimeout(revertTimer);
      revertTimer = setTimeout(function () {
        copyBtn.classList.remove("copied");
        iconCopy.hidden = false;
        iconCheck.hidden = true;
        copyNote.textContent = "";
      }, 2500);
    }

    function showFallback(email) {
      copyNote.textContent = "Couldn't copy automatically. The address is " + email + ".";
    }

    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showCopied(email);
        }).catch(function () {
          showFallback(email);
        });
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
          showCopied(email);
        } catch (e) {
          showFallback(email);
        }
        document.body.removeChild(tempInput);
      }
    });
  }
});
