(function () {
  var MONTHS = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
  var SHORT = MONTHS.map(function (m) { return m.slice(0, 3); });
  var plants = window.PLANTS.slice().sort(function (a, b) { return a.n.localeCompare(b.n, "sv"); });
  var state = { month: 0, group: "", q: "", zone: 0 };
  try { state.zone = +localStorage.getItem("zone") || 0; } catch (e) {}
  function maxZone(p) { var m = /(\d)\s*[–-]\s*(\d)/.exec(p.z || ""); return m ? +m[2] : 8; }
  var BLOOM = {
    year: ["Blommar på årsskott", "Nya skott bär blommorna, så du kan beskära hårt på vintern eller tidig vår."],
    old: ["Blommar på fjolårsved", "Blomknopparna bildas året innan. Beskär direkt efter blomning, annars tar du bort årets blommor."],
    both: ["Blommar på både fjolårsved och årsskott", "Första blomningen sitter på fjolårsved och senare blommor på nya skott, så beskär lätt."]
  };
  var TECH = { cut: "Snitt ovanför knopp", thin: "Tunna ut vid basen", ground: "Ner till marken", hedge: "Häckklippning", remove: "Ta bort död/korsande ved" };
  var SUN = { s: ["☀️", "Sol"], h: ["⛅", "Halvskugga"], k: ["☁️", "Skugga"] };
  var WAT = { d: ["🌵", "Torktålig"], m: ["💧", "Normalt vattenbehov"], w: ["💦", "Vattenkrävande"] };
  function bloomTime(ms) {
    if (!ms || !ms.length) return "";
    var contiguous = ms.every(function (m, i) { return i === 0 || m === ms[i - 1] + 1; });
    var names = ms.map(function (m) { return MONTHS[m - 1]; });
    if (ms.length === 1) return names[0];
    return contiguous ? names[0] + "–" + names[names.length - 1] : names.join(", ");
  }
  function icons(p) {
    var h = "";
    (p.sun || "").split("").forEach(function (c) { h += '<span class="ic" title="' + SUN[c][1] + '" aria-label="' + SUN[c][1] + '">' + SUN[c][0] + '</span>'; });
    if (p.wat) h += '<span class="ic" title="' + WAT[p.wat][1] + '" aria-label="' + WAT[p.wat][1] + '">' + WAT[p.wat][0] + '</span>';
    var bt = bloomTime(p.bt);
    if (bt) h += '<span class="ic bt" title="Blomningstid" aria-label="Blomningstid ' + bt + '">🌸 ' + bt + '</span>';
    return h ? '<div class="icons">' + h + '</div>' : "";
  }
  var now = new Date().getMonth() + 1;

  var $q = document.getElementById("q"), $months = document.getElementById("months"),
      $group = document.getElementById("group"), $list = document.getElementById("list"),
      $count = document.getElementById("count"), $zone = document.getElementById("zone");

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
      if (state.zone && maxZone(p) < state.zone) return false;
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
        '<div class="tag">' + p.g + ' · zon ' + p.z.split(" ")[0] + ' · ' + p.ht.split(" (")[0] + '</div>' +
        icons(p) + (p.b ? '<div class="bloom ' + p.b + '">🌿 ' + BLOOM[p.b][0] + '</div>' : '') +
        '<div class="strip">' + strip + '</div><div class="strip-l">' + lab + '</div></summary>' +
        '<div class="body"><h3>Fakta</h3><p>Zon ' + p.z + '<br>Höjd: ' + p.ht + '<br>Jord och läge: ' + p.jm + '<br>Ljus: ' + (p.sun || "").split("").map(function (c) { return SUN[c][1].toLowerCase(); }).join(", ") + '<br>Vatten: ' + (p.wat ? WAT[p.wat][1].toLowerCase() : "") + (p.bt && p.bt.length ? '<br>Blomningstid: ' + bloomTime(p.bt) : '') + '</p>' + (p.b ? '<h3>Blomning</h3><p>' + BLOOM[p.b][0] + '. ' + BLOOM[p.b][1] + '</p>' : '') + '<h3>När</h3><p>' + p.w + '</p><h3>Hur</h3><p>' + p.h + '</p>' +
        (p.t ? '<h3>Metoder (se guiden överst)</h3><p>' + p.t.split(" ").map(function (t) { return TECH[t]; }).join(", ") + '</p>' : '') +
        '<p class="links"><a target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(p.n + " " + p.l) + '">📷 Se bilder ↗</a></p></div></details>';
    }).join("");
  }

  $q.addEventListener("input", function () { state.q = $q.value; if (monthFromQuery($q.value)) state.month = 0; render(); });
  $group.addEventListener("change", function () { state.group = $group.value; render(); });

  $zone.value = String(state.zone);
  $zone.addEventListener("change", function () { state.zone = +$zone.value; try { localStorage.setItem("zone", state.zone); } catch (e) {} render(); });
  buildControls();
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
