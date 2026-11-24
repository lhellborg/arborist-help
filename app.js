(function () {
  var MONTHS = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
  var SHORT = MONTHS.map(function (m) { return m.slice(0, 3); });
  var plants = window.PLANTS.slice().sort(function (a, b) { return a.n.localeCompare(b.n, "sv"); });
  var state = { month: 0, group: "", q: "", zone: 0 };
  try { state.zone = +localStorage.getItem("zone") || 0; } catch (e) {}
  plants.forEach(function (p, i) { p._i = i; });
  var MINE = [];
  try { MINE = JSON.parse(localStorage.getItem("mine") || "[]").filter(function (i) { return plants[i]; }); } catch (e) { MINE = []; }
  function saveMine() { try { localStorage.setItem("mine", JSON.stringify(MINE)); } catch (e) {} }
  var tab = "prune";
  var G = { q: "", sun: "", wat: "", jt: "", hm: 0, group: "", prop: "", pol: false, months: [] };
  function maxZone(p) { var z = p.z || "", m = /(\d)\s*[–-]\s*(\d)/.exec(z) || /^\s*(\d)/.exec(z); return m ? +m[m.length - 1] : 8; }
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
  var PROP = { s: ["🌰", "Frö"], k: ["✂️", "Sticklingar"], d: ["🔀", "Delning"], a: ["↩️", "Avläggare"], r: ["🌱", "Rotskott/utlöpare"], y: ["🍎", "Ympning"] };
  function propHtml(p) {
    if (!p.fo) return "";
    return '<h3>Förökning</h3><div class="icons">' + p.fo.split(" ").map(function (c) { return '<span class="ic">' + PROP[c][0] + ' ' + PROP[c][1] + '</span>'; }).join("") + '</div><p>' + p.ft + '</p>';
  }
  function icons(p) {
    var h = "";
    (p.sun || "").split("").forEach(function (c) { h += '<span class="ic" title="' + SUN[c][1] + '" aria-label="' + SUN[c][1] + '">' + SUN[c][0] + '</span>'; });
    if (p.wat) h += '<span class="ic" title="' + WAT[p.wat][1] + '" aria-label="' + WAT[p.wat][1] + '">' + WAT[p.wat][0] + '</span>';
    if (p.pol) h += '<span class="ic" title="Bra för pollinerare" aria-label="Bra för pollinerare">🐝</span>';
    var bt = bloomTime(p.bt);
    if (bt) h += '<span class="ic bt" title="Blomningstid" aria-label="Blomningstid ' + bt + '">🌸 ' + bt + '</span>';
    return h ? '<div class="icons">' + h + '</div>' : "";
  }
  var now = new Date().getMonth() + 1;

  var $q = document.getElementById("q"), $months = document.getElementById("months"),
      $group = document.getElementById("group"), $list = document.getElementById("list"),
      $count = document.getElementById("count"), $zone = document.getElementById("zone");

  var $gq = document.getElementById("gq"), $gmonths = document.getElementById("gmonths"), $glist = document.getElementById("glist"), $gcount = document.getElementById("gcount");
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
        '<div class="body"><details class="facts"><summary>Fakta</summary><p>Zon ' + p.z + '<br>Höjd: ' + p.ht + '<br>Jord och läge: ' + p.jm + '<br>Ljus: ' + (p.sun || "").split("").map(function (c) { return SUN[c][1].toLowerCase(); }).join(", ") + '<br>Vatten: ' + (p.wat ? WAT[p.wat][1].toLowerCase() : "") + (p.bt && p.bt.length ? '<br>Blomningstid: ' + bloomTime(p.bt) : '') + (p.pol ? '<br>🐝 Bra för pollinerare (bin, humlor och fjärilar)' : '') + '</p></details>' + (p.b ? '<h3>Blomning</h3><p>' + BLOOM[p.b][0] + '. ' + BLOOM[p.b][1] + '</p>' : '') + '<h3>När</h3><p>' + p.w + '</p><h3>Hur</h3><p>' + p.h + '</p>' +
        (p.t ? '<h3>Metoder (se guiden överst)</h3><p>' + p.t.split(" ").map(function (t) { return TECH[t]; }).join(", ") + '</p>' : '') +
        propHtml(p) +
        '<p class="links"><a target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(p.n + " " + p.l) + '">📷 Se bilder ↗</a></p></div></details>';
    }).join("");
  }

  $q.addEventListener("input", function () { state.q = $q.value; if (monthFromQuery($q.value)) state.month = 0; render(); });
  $group.addEventListener("change", function () { state.group = $group.value; render(); });



  // ---------- Förslag när man skriver ----------
  var CLEM = window.CLEM || [], CG = window.CLEM_GROUPS || {};
  function wordStart(s, q) { return s.split(/[\s(–/×,-]+/).some(function (w) { return w.indexOf(q) === 0; }); }
  function plantItems(q) {
    function score(p) {
      var n = norm(p.n), l = norm(p.l);
      if (n.indexOf(q) === 0) return 0;
      if (wordStart(n, q)) return 1;
      if (n.indexOf(q) >= 0) return 2;
      if (wordStart(l, q)) return 3;
      return -1;
    }
    return plants.map(function (p) { return { p: p, s: score(p) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return a.s - b.s || a.p.n.localeCompare(b.p.n, "sv"); })
      .slice(0, 6)
      .map(function (x) { return { label: x.p.n, sub: x.p.l + " · " + x.p.g, value: x.p.n }; });
  }
  function clemItems(q, forPrune) {
    return CLEM.filter(function (c) { var s = norm(c.n + " " + (c.al || "")); return s.indexOf(q) === 0 || wordStart(s, q); })
      .slice(0, 5)
      .map(function (c) {
        return { label: c.n, sub: "Klematis · grupp " + c.g + " (" + CG[c.g].name + ")", value: forPrune ? "klematis, grupp " + c.g : c.n, c: c };
      });
  }
  function monthItems(q) {
    var r = [];
    if (q.length >= 2) MONTHS.forEach(function (m) { if (m.indexOf(q) === 0) r.push({ label: cap(m), sub: "Visa växter att beskära i " + m, value: m }); });
    return r;
  }
  function attachSuggest(input, getItems, onPick) {
    var box = document.createElement("ul");
    box.className = "sugbox"; box.hidden = true; box.setAttribute("role", "listbox");
    input.parentNode.appendChild(box);
    input.setAttribute("autocomplete", "off");
    var items = [], idx = -1, skip = false;
    function hide() { box.hidden = true; idx = -1; }
    function build() {
      if (skip) { skip = false; return; }
      var q = norm(input.value);
      items = q.length >= 1 ? getItems(q) : [];
      idx = -1;
      if (!items.length) { hide(); return; }
      box.innerHTML = items.map(function (it, k) {
        return '<li role="option" data-k="' + k + '"><span class="sl">' + it.label + '</span><span class="ss">' + it.sub + '</span></li>';
      }).join("");
      box.hidden = false;
    }
    function pick(k) {
      var it = items[k];
      if (!it) return;
      skip = true;
      input.value = it.value;
      hide();
      if (onPick) onPick(it); else input.dispatchEvent(new Event("input"));
      skip = false;
      input.blur();
    }
    function mark() {
      Array.prototype.forEach.call(box.children, function (li, k) { li.classList.toggle("on", k === idx); });
    }
    input.addEventListener("input", build);
    input.addEventListener("focus", build);
    input.addEventListener("blur", function () { setTimeout(hide, 120); });
    input.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "ArrowDown") { idx = (idx + 1) % items.length; mark(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { idx = (idx - 1 + items.length) % items.length; mark(); e.preventDefault(); }
      else if (e.key === "Enter" && idx >= 0) { pick(idx); e.preventDefault(); }
      else if (e.key === "Escape") hide();
    });
    box.addEventListener("pointerdown", function (e) {
      var li = e.target.closest("li");
      if (li) { e.preventDefault(); pick(+li.dataset.k); }
    });
  }

  // ---------- Klematishjälp ----------
  var $cres = document.getElementById("cres"), $cq = document.getElementById("cq");
  function showGroup(g, title) {
    var G = CG[g];
    $cres.innerHTML = '<div class="cres g' + g + '"><div class="ctitle">' + title + '</div>' +
      '<div><b>Beskärningsgrupp ' + g + ' (' + G.name + ')</b></div>' +
      '<p>' + G.when + '</p><p><b>Så beskär du:</b> ' + G.how + '</p>' +
      '<button type="button" class="chip" data-showgroup="' + g + '">Visa i listan ↓</button></div>';
  }
  function showClem(c) {
    showGroup(c.g, "'" + c.n.replace(" (art)", "") + "' · " + c.t + ", " + c.c);
  }
  function renderClemList() {
    var h = "";
    [1, 2, 3].forEach(function (g) {
      h += '<details class="cgroup"><summary>Grupp ' + g + ' (' + CG[g].name + ') · ' + CLEM.filter(function (c) { return c.g === g; }).length + ' sorter</summary><p>' +
        CLEM.filter(function (c) { return c.g === g; }).map(function (c) { return '<button type="button" class="mrm" data-cl="' + CLEM.indexOf(c) + '">' + c.n + '</button>'; }).join(" ") + '</p></details>';
    });
    document.getElementById("clist").innerHTML = h;
  }
  function initClem() {
    renderClemList();
    attachSuggest($cq, function (q) { return clemItems(q, false); }, function (it) { showClem(it.c); });
    $cq.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var q = norm($cq.value); if (!q) return;
      var m = clemItems(q, false);
      if (m.length) showClem(m[0].c);
      else notFound($cq.value);
    });
    document.getElementById("clem").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.g !== undefined) {
        var g = +b.dataset.g;
        if (g) showGroup(g, "Din klematis hör troligen till:");
        else $cres.innerHTML = '<div class="cres"><div class="ctitle">Ingen fara</div><p>Klipp inte ner hårt. Ta bara bort död ved (grå och torr, utan knoppar) och notera när den blommar i år. Blommar den tidigt på våren är den grupp 1, i försommaren grupp 2 och från juli grupp 3.</p></div>';
      } else if (b.dataset.cl !== undefined) {
        $cq.value = CLEM[+b.dataset.cl].n; showClem(CLEM[+b.dataset.cl]);
      } else if (b.dataset.showgroup) {
        $q.value = "klematis, grupp " + b.dataset.showgroup; state.q = $q.value; state.month = 0; render();
        document.getElementById("list").scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  function notFound(txt) {
    $cres.innerHTML = '<div class="cres"><div class="ctitle">Hittar inte "' + txt.replace(/</g, "&lt;") + '"</div><p>Sorten finns inte i listan. Sök på <a target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent("Clematis " + txt + " pruning group") + '">sortens beskärningsgrupp ↗</a> eller svara på frågan om blomningstid nedan.</p></div>';
  }

  // ---------- Flikar ----------
  function showTab(t) {
    tab = t === "garden" ? "garden" : "prune";
    document.getElementById("tabPrune").classList.toggle("on", tab === "prune");
    document.getElementById("tabGarden").classList.toggle("on", tab === "garden");
    document.getElementById("pruneCtl").hidden = tab !== "prune";
    document.getElementById("pruneView").hidden = tab !== "prune";
    document.getElementById("gardenView").hidden = tab !== "garden";
    try { history.replaceState(null, "", tab === "garden" ? "#tradgard" : "#beskarning"); } catch (e) {}
    window.scrollTo(0, 0);
    if (tab === "garden") renderGarden(); else render();
  }
  document.getElementById("tabPrune").onclick = function () { showTab("prune"); };
  document.getElementById("tabGarden").onclick = function () { showTab("garden"); };

  // ---------- Trädgårdshjälpen ----------
  var $gzone = document.getElementById("gzone");
  function setZone(z) {
    state.zone = z; $zone.value = String(z); $gzone.value = String(z);
    try { localStorage.setItem("zone", z); } catch (e) {}
  }
  function gardenMatches(p, skipMonths) {
    if (G.q && (p.n + " " + p.l).toLowerCase().indexOf(norm(G.q)) < 0) return false;
    if (G.sun && (p.sun || "").indexOf(G.sun) < 0) return false;
    if (G.wat) {
      var ok = { d: ["d"], m: ["d", "m"], w: ["w", "m"] }[G.wat];
      if (ok.indexOf(p.wat) < 0) return false;
    }
    if (state.zone && maxZone(p) < state.zone) return false;
    if (G.jt && p.jt.indexOf(G.jt) < 0 && p.jt.indexOf("alla") < 0) return false;
    if (G.hm && p.hm > G.hm) return false;
    if (G.group && p.g !== G.group) return false;
    if (G.pol && !p.pol) return false;
    if (G.prop && (p.fo || "").split(" ").indexOf(G.prop) < 0) return false;
    if (!skipMonths && G.months.length && coverage(p) === 0) return false;
    return true;
  }
  function coverage(p) {
    return G.months.filter(function (m) { return (p.bt || []).indexOf(m) >= 0; }).length;
  }
  function bloomStrip(p) {
    var s = "", l = "";
    for (var i = 1; i <= 12; i++) {
      s += '<i class="' + ((p.bt || []).indexOf(i) >= 0 ? "on" : "") + '"></i>';
      l += '<span>' + SHORT[i - 1].charAt(0).toUpperCase() + '</span>';
    }
    return '<div class="strip bloomstrip">' + s + '</div><div class="strip-l">' + l + '</div>';
  }
  function factsText(p) {
    return 'Zon ' + p.z + '<br>Höjd: ' + p.ht + '<br>Jord och läge: ' + p.jm +
      '<br>Ljus: ' + (p.sun || "").split("").map(function (c) { return SUN[c][1].toLowerCase(); }).join(", ") +
      '<br>Vatten: ' + (p.wat ? WAT[p.wat][1].toLowerCase() : "") +
      (p.bt && p.bt.length ? '<br>Blomningstid: ' + bloomTime(p.bt) : '') +
      (p.pol ? '<br>🐝 Bra för pollinerare (bin, humlor och fjärilar)' : '');
  }
  function gardenCard(p) {
    var cov = G.months.length ? '<div class="cov">Blommar i ' + coverage(p) + ' av ' + G.months.length + ' valda månader</div>' : "";
    return '<details class="card"><summary>' +
      '<div class="name">' + p.n + '</div><div class="latin">' + p.l + '</div>' +
      '<div class="tag">' + p.g + ' · zon ' + p.z.split(" ")[0] + ' · ' + p.ht.split(" (")[0] + '</div>' +
      icons(p) + cov + (p.bt && p.bt.length ? bloomStrip(p) : '') + '</summary>' +
      '<div class="body"><h3>Fakta</h3><p>' + factsText(p) + '</p>' +
      '<h3>Beskärning</h3><p>' + p.w + ' <span class="tag">(se fliken Beskärning)</span></p>' +
      propHtml(p) +
      '<p class="links"><a target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(p.n + " " + p.l) + '">📷 Se bilder ↗</a></p>' +
      addBtn(p) + '</div></details>';
  }
  function addBtn(p) {
    var has = MINE.indexOf(p._i) >= 0;
    return '<button type="button" class="addbtn' + (has ? " has" : "") + '" data-i="' + p._i + '">' + (has ? "✓ I min trädgård (ta bort)" : "+ Lägg till i min trädgård") + '</button>';
  }
  function toggleMine(i) {
    var k = MINE.indexOf(i);
    if (k >= 0) MINE.splice(k, 1); else MINE.push(i);
    saveMine();
    Array.prototype.forEach.call(document.querySelectorAll(".addbtn[data-i=\"" + i + "\"]"), function (b) {
      var has = MINE.indexOf(i) >= 0;
      b.classList.toggle("has", has);
      b.textContent = has ? "✓ I min trädgård (ta bort)" : "+ Lägg till i min trädgård";
    });
    renderMine();
  }
  function renderMine() {
    var el = document.getElementById("mine");
    if (!MINE.length) {
      el.innerHTML = '<details class="card mine"><summary><div class="name">🏡 Min trädgård</div><div class="tag">Tom. Fäll ut en växt och tryck "Lägg till i min trädgård" för att se när din trädgård blommar.</div></summary></details>';
      return;
    }
    var mine = MINE.map(function (i) { return plants[i]; });
    var counts = [], i;
    for (i = 1; i <= 12; i++) counts[i] = mine.filter(function (p) { return (p.bt || []).indexOf(i) >= 0; }).length;
    var max = Math.max.apply(null, counts.slice(1).concat([1]));
    var gaps = [];
    for (i = 4; i <= 10; i++) if (!counts[i]) gaps.push(i);
    var cal = "";
    for (i = 1; i <= 12; i++) {
      var isGap = i >= 4 && i <= 10 && !counts[i];
      cal += '<button type="button" class="mcell' + (isGap ? " gap" : "") + '" data-m="' + i + '" aria-label="' + cap(MONTHS[i - 1]) + ': ' + counts[i] + ' blommande växter' + (isGap ? ", lucka" : "") + '">' +
        '<span class="mbarw"><span class="mbar" style="height:' + Math.round((counts[i] / max) * 44) + 'px"></span></span>' +
        '<span class="mn">' + counts[i] + '</span><span class="ml">' + SHORT[i - 1] + '</span></button>';
    }
    var pol = mine.filter(function (p) { return p.pol; }).length;
    var sug = gaps.slice(0, 3).map(function (m) {
      var c = plants.filter(function (p) { return MINE.indexOf(p._i) < 0 && (p.bt || []).indexOf(m) >= 0 && gardenMatches(p, true); })
        .sort(function (x, y) { return (y.pol ? 1 : 0) - (x.pol ? 1 : 0) || y.bt.length - x.bt.length || x.n.localeCompare(y.n, "sv"); }).slice(0, 3);
      return '<div class="sugrow"><b>' + cap(MONTHS[m - 1]) + ':</b> ' + (c.length ? c.map(function (p) { return '<button type="button" class="sug" data-i="' + p._i + '">+ ' + p.n + '</button>'; }).join(" ") : "inga förslag med dina filter") + '</div>';
    }).join("");
    el.innerHTML = '<details class="card mine" open><summary><div class="name">🏡 Min trädgård (' + mine.length + ')</div>' +
      '<div class="tag">🐝 ' + pol + ' av ' + mine.length + ' är bra för pollinerare' + (gaps.length ? ' · ⚠️ lucka: ' + gaps.map(function (m) { return MONTHS[m - 1]; }).join(", ") : ' · 🌸 blommor april–oktober') + '</div></summary>' +
      '<div class="body"><h3>Blommande växter per månad</h3><div class="mcal">' + cal + '</div>' +
      (gaps.length ? '<p class="tag">Månader utan blommor (april–oktober) är markerade. Tryck på en månad för att hitta växter som blommar då.</p>' + '<h3>Förslag som fyller luckorna</h3>' + sug : '') +
      '<h3>Dina växter</h3><div class="mlist">' + mine.map(function (p) { return '<button type="button" class="mrm" data-rm="' + p._i + '">' + p.n + ' ✕</button>'; }).join(" ") + '</div>' +
      '<p><button type="button" class="chip" id="mclear">Töm listan</button></p></div></details>';
  }
  function renderGarden() {
    Array.prototype.forEach.call($gmonths.children, function (c) {
      if (c.dataset.m) c.classList.toggle("on", G.months.indexOf(+c.dataset.m) >= 0);
      else c.classList.toggle("on", G.months.length === 3 && [6, 7, 8].every(function (m) { return G.months.indexOf(m) >= 0; }));
    });
    var res = plants.filter(gardenMatches);
    if (G.months.length) res.sort(function (a, b) { return coverage(b) - coverage(a) || (b.pol ? 1 : 0) - (a.pol ? 1 : 0) || a.n.localeCompare(b.n, "sv"); });
    $gcount.textContent = res.length + " växter";
    renderMine();
    $glist.innerHTML = res.length ? res.map(gardenCard).join("") : '<div class="empty">Inga växter matchar. Prova att ta bort något filter.</div>';
  }
  function buildGarden() {
    var groups = [];
    plants.forEach(function (p) { if (groups.indexOf(p.g) < 0) groups.push(p.g); });
    document.getElementById("ggroup").innerHTML = '<option value="">Alla grupper</option>' + groups.map(function (g) { return '<option>' + g + '</option>'; }).join("");
    var sommar = document.createElement("button");
    sommar.type = "button"; sommar.className = "chip"; sommar.textContent = "☀️ Hela sommaren";
    sommar.onclick = function () { G.months = [6, 7, 8]; renderGarden(); };
    $gmonths.appendChild(sommar);
    MONTHS.forEach(function (m, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = cap(m); b.dataset.m = i + 1;
      b.onclick = function () {
        var k = G.months.indexOf(i + 1);
        if (k >= 0) G.months.splice(k, 1); else G.months.push(i + 1);
        G.months.sort(function (x, y) { return x - y; });
        renderGarden();
      };
      $gmonths.appendChild(b);
    });
    var bind = function (id, key, num) { document.getElementById(id).addEventListener("change", function (e) { G[key] = num ? +e.target.value : e.target.value; renderGarden(); }); };
    bind("gsun", "sun"); bind("gwat", "wat"); bind("gjt", "jt"); bind("ghm", "hm", true); bind("ggroup", "group"); bind("gprop", "prop");
    document.getElementById("gpol").addEventListener("change", function (e) { G.pol = e.target.checked; renderGarden(); });
    $gq.addEventListener("input", function () { G.q = $gq.value; renderGarden(); });
    $gzone.addEventListener("change", function () { setZone(+$gzone.value); renderGarden(); });
    document.getElementById("gardenView").addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.i !== undefined) { toggleMine(+t.dataset.i); return; }
      if (t.dataset.rm !== undefined) { toggleMine(+t.dataset.rm); return; }
      if (t.id === "mclear") { if (confirm("Tömma Min trädgård?")) { MINE.slice().forEach(toggleMine); } return; }
      if (t.classList.contains("mcell")) { G.months = [+t.dataset.m]; renderGarden(); document.getElementById("glist").scrollIntoView({ behavior: "smooth" }); }
    });
    document.getElementById("greset").onclick = function () {
      G = { q: "", sun: "", wat: "", jt: "", hm: 0, group: "", prop: "", pol: false, months: [] };
      ["gsun", "gwat", "gjt", "ghm", "ggroup", "gprop"].forEach(function (id) { document.getElementById(id).selectedIndex = 0; });
      document.getElementById("gpol").checked = false; $gq.value = "";
      renderGarden();
    };
  }

  $zone.addEventListener("change", function () { setZone(+$zone.value); render(); });
  setZone(state.zone);
  buildControls();
  buildGarden();
  attachSuggest($q, function (q) { return monthItems(q).concat(clemItems(q, true), plantItems(q)); });
  attachSuggest($gq, plantItems);
  initClem();
  showTab(location.hash === "#tradgard" ? "garden" : "prune");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
