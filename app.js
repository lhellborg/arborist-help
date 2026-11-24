(function () {
  var MONTHS = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
  var SHORT = MONTHS.map(function (m) { return m.slice(0, 3); });
  var plants = window.PLANTS.slice().sort(function (a, b) { return a.n.localeCompare(b.n, "sv"); });
  var state = { month: 0, group: "", q: "" };
  var BLOOM = {
    year: ["Blommar på årsskott", "Nya skott bär blommorna, så du kan beskära hårt på vintern eller tidig vår."],
    old: ["Blommar på fjolårsved", "Blomknopparna bildas året innan. Beskär direkt efter blomning, annars tar du bort årets blommor."],
    both: ["Blommar på både fjolårsved och årsskott", "Första blomningen sitter på fjolårsved och senare blommor på nya skott, så beskär lätt."]
  };
  var now = new Date().getMonth() + 1;

  var $q = document.getElementById("q"), $months = document.getElementById("months"),
      $group = document.getElementById("group"), $list = document.getElementById("list"),
      $count = document.getElementById("count");

  function norm(s) { return s.toLowerCase().trim(); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Mata in månad i sökrutan, t.ex. "april" eller "apr"
  function monthFromQuery(q) {
    q = norm(q);
    if (q.length < 3) return 0;
    for (var i = 0; i < 12; i++) if (MONTHS[i].indexOf(q) === 0) return i + 1;
    return 0;
  }

  function buildControls() {
    var all = chip("Alla", 0);
    $months.appendChild(all);
    MONTHS.forEach(function (m, i) { $months.appendChild(chip(cap(m), i + 1)); });
    var groups = [];
    plants.forEach(function (p) { if (groups.indexOf(p.g) < 0) groups.push(p.g); });
    $group.innerHTML = '<option value="">Alla grupper</option>' +
      groups.map(function (g) { return '<option>' + g + '</option>'; }).join("");
  }
  function chip(label, m) {
    var b = document.createElement("button");
    b.className = "chip" + (m === now ? " now" : "");
    b.textContent = label; b.dataset.m = m; b.type = "button";
    b.onclick = function () { state.month = state.month === m ? 0 : m; $q.value = ""; state.q = ""; render(); };
    return b;
  }

  function render() {
    var qMonth = monthFromQuery(state.q);
    var month = qMonth || state.month;
    var q = qMonth ? "" : norm(state.q);
    Array.prototype.forEach.call($months.children, function (c) {
      c.classList.toggle("on", +c.dataset.m === month);
    });
    var res = plants.filter(function (p) {
      if (month && p.m.indexOf(month) < 0) return false;
      if (state.group && p.g !== state.group) return false;
      if (q && (p.n + " " + p.l + " " + p.g).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    $count.textContent = res.length + " växter" + (month ? " i " + MONTHS[month - 1] : "");
    if (!res.length) { $list.innerHTML = '<div class="empty">Inga växter hittades.</div>'; return; }
    $list.innerHTML = res.map(function (p) {
      var strip = "", lab = "";
      for (var i = 1; i <= 12; i++) {
        strip += '<i class="' + (p.m.indexOf(i) >= 0 ? "on" : "") + '"></i>';
        lab += '<span>' + SHORT[i - 1].charAt(0).toUpperCase() + '</span>';
      }
      return '<details class="card"' + (res.length === 1 ? " open" : "") + '><summary>' +
        '<div class="name">' + p.n + '</div><div class="latin">' + p.l + '</div>' +
        '<div class="tag">' + p.g + '</div>' +
        (p.b ? '<div class="bloom ' + p.b + '">🌸 ' + BLOOM[p.b][0] + '</div>' : '') +
        '<div class="strip">' + strip + '</div><div class="strip-l">' + lab + '</div></summary>' +
        '<div class="body">' + (p.b ? '<h3>Blomning</h3><p>' + BLOOM[p.b][0] + '. ' + BLOOM[p.b][1] + '</p>' : '') + '<h3>När</h3><p>' + p.w + '</p><h3>Hur</h3><p>' + p.h + '</p></div></details>';
    }).join("");
  }

  $q.addEventListener("input", function () { state.q = $q.value; if (monthFromQuery($q.value)) state.month = 0; render(); });
  $group.addEventListener("change", function () { state.group = $group.value; render(); });

  buildControls();
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
