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

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    var sunIcon = themeToggle.querySelector(".icon-sun");
    var moonIcon = themeToggle.querySelector(".icon-moon");

    function getEffectiveTheme() {
      var saved = null;
      try { saved = localStorage.getItem("ledgize-theme"); } catch (e) {}
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyToggleIcon(theme) {
      sunIcon.hidden = theme === "dark";
      moonIcon.hidden = theme !== "dark";
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    applyToggleIcon(getEffectiveTheme());

    themeToggle.addEventListener("click", function () {
      var next = getEffectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("ledgize-theme", next); } catch (e) {}
      applyToggleIcon(next);
    });
  }

  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressBar);

  function updateScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  var fabContact = document.createElement("a");
  fabContact.href = "mailto:ali@ledgize.com?subject=Quick%20question%20from%20the%20website";
  fabContact.className = "fab fab-contact";
  fabContact.setAttribute("aria-label", "Email us a question");
  fabContact.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var fabTop = document.createElement("button");
  fabTop.type = "button";
  fabTop.className = "fab fab-top";
  fabTop.setAttribute("aria-label", "Back to top");
  fabTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  fabTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(fabContact);
  document.body.appendChild(fabTop);

  function updateFabVisibility() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var visible = scrollTop > 400;
    fabContact.classList.toggle("is-visible", visible);
    fabTop.classList.toggle("is-visible", visible);
  }

  function onScroll() {
    updateScrollProgress();
    updateFabVisibility();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
