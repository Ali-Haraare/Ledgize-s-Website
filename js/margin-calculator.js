/* True margin calculator. Runs only in the visitor's browser: nothing is sent or stored. */
(function () {
  var CHANNELS = ["shopify", "amazon", "ebay"];
  var NAMES = { shopify: "Shopify", amazon: "Amazon", ebay: "eBay" };
  var FIELDS = ["sales", "refunds", "cogs", "fees", "fulfil", "ads"];
  var LABELS = {
    sales: "sales", refunds: "refunds", cogs: "product cost",
    fees: "marketplace and payment fees", fulfil: "fulfilment and shipping", ads: "advertising"
  };
  // Example month. Matches the "Profit by channel" example card on the homepage.
  var EXAMPLE = {
    shopify: { sales: 147000, refunds: 7000, cogs: 56000, fees: 4200, fulfil: 23800, ads: 29400 },
    amazon: { sales: 220000, refunds: 10000, cogs: 84000, fees: 31500, fulfil: 50400, ads: 31500 },
    ebay: { sales: 62000, refunds: 2000, cogs: 27000, fees: 8400, fulfil: 12600, ads: 3600 }
  };

  var money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  var inputs = {};
  var note = document.getElementById("calc-example-note");

  function fmtMoney(v) {
    return (v < 0 ? "−$" : "$") + money.format(Math.abs(Math.round(v)));
  }
  function fmtPct(v, base) {
    if (!base) return "";
    var p = (v / base) * 100;
    return (p < 0 ? "−" : "") + Math.abs(p).toFixed(1) + "%";
  }
  function parse(el) {
    var v = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ""));
    return isNaN(v) ? 0 : v;
  }

  // Build one input in every table cell.
  document.querySelectorAll("#calc-inputs td[data-ch]").forEach(function (td) {
    var ch = td.getAttribute("data-ch"), f = td.getAttribute("data-f");
    var wrap = document.createElement("label");
    wrap.className = "calc-field";
    var pre = document.createElement("span");
    pre.className = "calc-dollar";
    pre.textContent = "$";
    pre.setAttribute("aria-hidden", "true");
    var input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.placeholder = "0";
    input.setAttribute("aria-label", NAMES[ch] + " " + LABELS[f]);
    input.addEventListener("input", function () {
      note.hidden = true;
      update();
    });
    input.addEventListener("blur", function () {
      if (input.value.trim() === "") return;
      input.value = money.format(parse(input));
    });
    wrap.appendChild(pre);
    wrap.appendChild(input);
    td.appendChild(wrap);
    inputs[ch + "-" + f] = input;
  });

  function setOut(key, value, base) {
    var td = document.querySelector('[data-out="' + key + '"]');
    if (!td) return;
    var pct = fmtPct(value, base);
    td.innerHTML = '<span class="calc-money"></span>' + (pct ? '<span class="calc-pct"></span>' : "");
    td.querySelector(".calc-money").textContent = fmtMoney(value);
    if (pct) td.querySelector(".calc-pct").textContent = pct + " of net sales";
    td.classList.toggle("calc-neg", value < 0);
  }

  function setBlank(key) {
    var td = document.querySelector('[data-out="' + key + '"]');
    if (!td) return;
    td.innerHTML = '<span class="calc-blank" aria-label="not used">\u2013</span>';
    td.classList.remove("calc-neg");
  }

  function update() {
    var totals = { net: 0, cm1: 0, cm2: 0, cm3: 0 };
    var rows = [];
    CHANNELS.forEach(function (ch) {
      var v = {};
      FIELDS.forEach(function (f) { v[f] = parse(inputs[ch + "-" + f]); });
      var used = FIELDS.some(function (f) { return v[f] !== 0; });
      var net = v.sales - v.refunds;
      var cm1 = net - v.cogs;
      var cm2 = cm1 - v.fees - v.fulfil;
      var cm3 = cm2 - v.ads;
      if (used) {
        setOut(ch + "-net", net, 0);
        setOut(ch + "-cm1", cm1, net);
        setOut(ch + "-cm2", cm2, net);
        setOut(ch + "-cm3", cm3, net);
      } else {
        ["net", "cm1", "cm2", "cm3"].forEach(function (k) { setBlank(ch + "-" + k); });
      }
      totals.net += net; totals.cm1 += cm1; totals.cm2 += cm2; totals.cm3 += cm3;
      if (used && net > 0) rows.push({ ch: ch, net: net, cm3: cm3, pct: cm3 / net });
    });
    setOut("total-net", totals.net, 0);
    setOut("total-cm1", totals.cm1, totals.net);
    setOut("total-cm2", totals.cm2, totals.net);
    setOut("total-cm3", totals.cm3, totals.net);
    drawBars(rows);
    summarise(rows, totals);
  }

  function drawBars(rows) {
    var box = document.getElementById("calc-bars");
    box.innerHTML = "";
    if (!rows.length) return;
    var maxNet = Math.max.apply(null, rows.map(function (r) { return r.net; }));
    var maxKept = Math.max.apply(null, rows.map(function (r) { return Math.max(r.cm3, 0); })) || 1;
    var best = rows.reduce(function (a, b) { return b.pct > a.pct ? b : a; });
    rows.forEach(function (r) {
      var row = document.createElement("div");
      row.className = "calc-bar-row";
      row.innerHTML =
        '<span class="calc-bar-name"></span>' +
        '<span class="calc-bar-track"><span class="calc-bar calc-bar-sales"></span></span>' +
        '<span class="calc-bar-track"><span class="calc-bar calc-bar-kept"></span></span>';
      row.querySelector(".calc-bar-name").textContent = NAMES[r.ch];
      row.querySelector(".calc-bar-sales").style.width = Math.max(2, (r.net / maxNet) * 100) + "%";
      var kept = row.querySelector(".calc-bar-kept");
      kept.style.width = Math.max(2, (Math.max(r.cm3, 0) / maxKept) * 100) + "%";
      if (r === best && rows.length > 1) kept.classList.add("calc-bar-best");
      if (r.cm3 < 0) kept.classList.add("calc-bar-loss");
      box.appendChild(row);
    });
    var head = document.createElement("div");
    head.className = "calc-bar-row calc-bar-head";
    head.innerHTML = "<span></span><span>Net sales</span><span>Kept after ads</span>";
    box.insertBefore(head, box.firstChild);
  }

  function summarise(rows, totals) {
    var el = document.getElementById("calc-summary");
    if (!rows.length) {
      el.textContent = "Enter figures for at least one channel to see what it keeps.";
      return;
    }
    var text = "Across your channels, you keep " + fmtMoney(totals.cm3) + " of " + fmtMoney(totals.net) +
      " in net sales after ads (" + fmtPct(totals.cm3, totals.net) + ").";
    if (rows.length > 1) {
      var bySales = rows.reduce(function (a, b) { return b.net > a.net ? b : a; });
      var byMargin = rows.reduce(function (a, b) { return b.pct > a.pct ? b : a; });
      var worst = rows.reduce(function (a, b) { return b.pct < a.pct ? b : a; });
      if (bySales !== byMargin) {
        text += " " + NAMES[bySales.ch] + " sells the most, but " + NAMES[byMargin.ch] + " keeps the most of each dollar (" +
          fmtPct(byMargin.cm3, byMargin.net) + ").";
      } else {
        text += " " + NAMES[worst.ch] + " keeps the least of each dollar (" + fmtPct(worst.cm3, worst.net) + ").";
      }
    }
    rows.filter(function (r) { return r.cm3 < 0; }).forEach(function (r) {
      text += " " + NAMES[r.ch] + " is losing " + fmtMoney(-r.cm3) + " a month after ads.";
    });
    el.textContent = text;
  }

  function fill(data) {
    CHANNELS.forEach(function (ch) {
      FIELDS.forEach(function (f) {
        var v = data ? data[ch][f] : "";
        inputs[ch + "-" + f].value = v === "" ? "" : money.format(v);
      });
    });
    update();
  }

  document.getElementById("calc-clear").addEventListener("click", function () {
    note.hidden = true;
    fill(null);
    inputs["shopify-sales"].focus();
  });
  document.getElementById("calc-example").addEventListener("click", function () {
    note.hidden = false;
    fill(EXAMPLE);
  });

  fill(EXAMPLE);
})();
