// Förökningsguide: steg för steg med enkla ritade bilder (SVG).
(function () {
  var BR = "#8a6a3b", DK = "#6b4f2a", GR = "#2f9e44", LG = "#5a9e3a", RD = "#d62828", WT = "#74c0fc",
      CL = "#c1693c", SD = "#d9b778", RT = "#e8dcc0", BL = "#4c9be8", SEED = "#7a4a1e";

  function svg(inner) { return '<svg viewBox="0 0 160 110" role="img" aria-hidden="true">' + inner + '</svg>'; }
  function ln(x1, y1, x2, y2, w, c, extra) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" ' + (extra || "") + '/>';
  }
  function rect(x, y, w, h, fill, stroke, r, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 0) + '" fill="' + (fill || "none") + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="2.5"' : "") + ' ' + (extra || "") + '/>';
  }
  function ell(cx, cy, rx, ry, fill, rot, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : "") + ' ' + (extra || "") + '/>';
  }
  function txt(x, y, t, sz, anchor, fill, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + (sz || 10) + '" text-anchor="' + (anchor || "middle") + '" fill="' + (fill || "currentColor") + '" ' + (extra || "") + '>' + t + '</text>';
  }
  function ground(y) { return rect(0, y, 160, 110 - y, BR) + rect(0, y, 160, 3, DK); }
  function leaf(x, y, rot, s, c) { return ell(x, y, s * 1.4, s * 0.6, c || GR, rot); }
  function drop(x, y) { return '<path d="M' + x + ' ' + y + ' q-6 9 0 13 q6 -4 0 -13z" fill="' + WT + '"/>'; }
  function pot(x, y, w, h) {
    return '<polygon points="' + x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w * 0.85) + ',' + (y + h) + ' ' + (x + w * 0.15) + ',' + (y + h) + '" fill="' + CL + '"/>' +
      '<polygon points="' + (x + 3) + ',' + (y + 3) + ' ' + (x + w - 3) + ',' + (y + 3) + ' ' + (x + w * 0.85 - 2) + ',' + (y + h - 3) + ' ' + (x + w * 0.15 + 2) + ',' + (y + h - 3) + '" fill="' + DK + '"/>';
  }
  function rot(x, y, t, sz) { return '<text transform="rotate(-90 ' + x + ' ' + y + ')" x="' + x + '" y="' + y + '" font-size="' + (sz || 9) + '" text-anchor="middle" fill="currentColor">' + t + '</text>'; }
  function seeds(list) { return list.map(function (p) { return ell(p[0], p[1], 4, 2.5, SEED, p[2] || 0); }).join(""); }

  var SCENES = {
    // ----- Stratifiering -----
    strat1: function () {
      return svg(rect(50, 28, 60, 66, "none", "currentColor", 6, 'opacity=".7"') + rect(52, 48, 56, 44, WT, "", 3, 'opacity=".45"') +
        seeds([[65, 86], [78, 88, 20], [90, 85], [100, 88, -20], [72, 80], [86, 82, 30]]) + txt(80, 18, "12–24 timmar", 10));
    },
    strat2: function () {
      var dots = ""; [[55, 66], [68, 74], [80, 70], [92, 76], [104, 66], [74, 84], [88, 86], [62, 78]].forEach(function (p) { dots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#a8864a"/>'; });
      return svg('<path d="M38 55 Q80 108 122 55 Z" fill="' + SD + '" stroke="currentColor" stroke-width="2"/>' + dots +
        seeds([[58, 58], [72, 57, 15], [86, 58], [100, 57, -15]]) + drop(132, 18) + txt(80, 104, "Fuktig sand", 9));
    },
    strat3: function () {
      return svg(rect(45, 22, 70, 70, "none", BL, 8) + ln(45, 34, 115, 34, 2, BL) + rect(48, 60, 64, 29, SD, "", 4) +
        seeds([[62, 70], [78, 76, 20], [94, 70], [70, 82, -20], [100, 82]]) +
        rect(86, 38, 46, 22, "#fff", "#999", 3) + txt(109, 48, "Namn", 8, "middle", "#333") + txt(109, 57, "datum", 8, "middle", "#333"));
    },
    strat4: function () {
      return svg(rect(40, 8, 80, 96, "none", "currentColor", 8) + ln(40, 58, 120, 58, 2, "currentColor", 'opacity=".6"') +
        rect(60, 38, 40, 20, SD, BL, 4) + txt(100, 30, "❄", 16, "middle", BL) + txt(80, 82, "1–5 °C", 11) + txt(80, 96, "4–12 veckor", 8, "middle"));
    },
    strat5: function () {
      return svg(pot(55, 62, 50, 38) + ln(80, 62, 80, 40, 3, LG) + leaf(71, 40, -25, 6) + leaf(89, 40, 25, 6) + txt(80, 14, "Så i fuktig såjord", 10));
    },
    // ----- Vedstickling -----
    wood1: function () {
      return svg(ln(15, 100, 125, 35, 9, BR) + ln(55, 77, 48, 40, 5, "#b08a50") + ln(85, 59, 92, 24, 5, "#b08a50") + ln(108, 47, 128, 30, 4, "#b08a50") +
        ell(52, 58, 3, 4.5, GR) + ell(89, 40, 3, 4.5, GR) + ell(50, 48, 3, 4.5, GR) +
        '<ellipse cx="50" cy="56" rx="11" ry="26" fill="none" stroke="' + RD + '" stroke-width="2" stroke-dasharray="3 3"/>' +
        txt(80, 12, "Årsskott, blyertstjockt", 10));
    },
    wood2: function () {
      return svg('<polygon points="76,22 84,16 84,96 76,96" fill="' + BR + '"/>' + ell(86, 32, 3.5, 5, GR) + ell(74, 84, 3.5, 5, GR) +
        ln(76, 22, 84, 16, 3, RD) + ln(72, 96, 88, 96, 3, RD) +
        txt(96, 20, "snett", 9, "start") + txt(96, 100, "rakt", 9, "start") +
        ln(50, 16, 50, 96, 1.5, "currentColor") + ln(46, 16, 54, 16, 1.5, "currentColor") + ln(46, 96, 54, 96, 1.5, "currentColor") + rot(42, 56, "20–25 cm"));
    },
    wood3: function () {
      var s = ""; [38, 80, 122].forEach(function (x) { s += ln(x, 20, x, 90, 6, BR) + ell(x + 4, 28, 3, 4.5, GR); });
      return svg(rect(0, 46, 160, 64, "#a98a55") + rect(0, 46, 160, 3, DK) + s + txt(80, 12, "Minst 1–2 knoppar över jord", 9) + txt(80, 104, "2/3 av sticklingen i jorden", 9, "middle", "#fff"));
    },
    wood4: function () {
      return svg(pot(52, 50, 56, 50) + ln(80, 20, 80, 82, 5, BR) + leaf(70, 28, -30, 6) + leaf(90, 32, 30, 6) + leaf(72, 44, -30, 5) + leaf(88, 46, 30, 5) +
        ln(80, 82, 66, 96, 1.8, RT) + ln(80, 82, 80, 98, 1.8, RT) + ln(80, 82, 94, 96, 1.8, RT) + txt(80, 12, "Rötter till våren", 10));
    },
    // ----- Grön stickling -----
    green1: function () {
      var s = ln(80, 106, 80, 14, 4, LG);
      [[30, 8], [52, 8], [76, 8], [98, 8]].forEach(function (p) { s += leaf(70, p[0], -35, p[1]) + leaf(90, p[0], 35, p[1]); });
      return svg(s + '<line x1="58" y1="66" x2="102" y2="66" stroke="' + RD + '" stroke-width="2.5" stroke-dasharray="4 3"/>' + txt(112, 72, "✂", 14, "start") +
        ln(130, 14, 130, 66, 1.5, "currentColor") + ln(126, 14, 134, 14, 1.5, "currentColor") + ln(126, 66, 134, 66, 1.5, "currentColor") + rot(144, 40, "8–10 cm"));
    },
    green2: function () {
      var s = ln(80, 100, 80, 16, 4, LG);
      [[26, 8, 1], [44, 8, 1], [64, 8, .3], [82, 8, .3]].forEach(function (p) {
        s += leaf(70, p[0], -35, p[1], p[2] === 1 ? GR : "#9cc98a") + leaf(90, p[0], 35, p[1], p[2] === 1 ? GR : "#9cc98a");
      });
      return svg(s + txt(108, 76, "✕", 12, "middle", RD) + txt(132, 30, "behåll", 9) + txt(132, 41, "2–3 par", 9) + txt(134, 76, "ta bort", 9, "middle", RD));
    },
    green3: function () {
      return svg(pot(52, 58, 56, 42) + ln(80, 22, 80, 74, 3.5, LG) + leaf(71, 28, -35, 7) + leaf(89, 28, 35, 7) + leaf(72, 42, -35, 6) + leaf(88, 42, 35, 6) +
        txt(80, 12, "Fuktig, luftig jord", 10));
    },
    green4: function () {
      return svg(pot(52, 62, 56, 38) + ln(80, 26, 80, 74, 3.5, LG) + leaf(72, 32, -35, 6) + leaf(88, 32, 35, 6) + leaf(73, 46, -35, 5) + leaf(87, 46, 35, 5) +
        '<path d="M44 64 Q44 14 80 14 Q116 14 116 64 Z" fill="' + WT + '" fill-opacity=".22" stroke="' + WT + '" stroke-width="2"/>' + txt(80, 108, "Täck med klar plast", 9));
    },
    green5: function () {
      var s = ln(80, 16, 80, 64, 3.5, LG) + leaf(71, 22, -35, 7) + leaf(89, 22, 35, 7) + leaf(72, 38, -35, 6) + leaf(88, 38, 35, 6);
      [-30, -14, 0, 14, 30].forEach(function (a) { s += ln(80, 64, 80 + a, 94, 1.8, RT); });
      return svg(s + txt(80, 106, "Rötter efter 4–8 veckor", 9));
    },
    // ----- Delning -----
    div1: function () {
      var s = ""; [-30, -18, -8, 0, 8, 18, 30].forEach(function (a) { s += ln(80, 74, 80 + a, 40 - Math.abs(a) * 0.3, 3, GR); });
      return svg(ground(74) + s + drop(132, 20) + txt(80, 14, "Vår eller tidig höst", 10, "middle"));
    },
    div2: function () {
      var s = ""; [-18, -8, 0, 8, 18].forEach(function (a) { s += ln(80, 50, 80 + a, 22 - Math.abs(a) * 0.2, 3, GR); });
      var root = ""; [-18, -8, 0, 8, 18].forEach(function (a) { root += ln(80 + a * 0.6, 68, 80 + a, 84, 1.6, RT); });
      return svg(rect(0, 62, 160, 48, BR) + rect(40, 66, 80, 44, DK) + root + ell(80, 58, 26, 13, BR) + s +
        ln(142, 8, 142, 46, 3.5, "#999") + '<polygon points="132,46 152,46 150,74 134,74" fill="#9aa"/>');
    },
    div3: function () {
      var s = ""; [[62, 36, 40], [70, 34, 36], [90, 36, 40], [98, 34, 36]].forEach(function (p) { s += ln(p[0], 48, p[0], p[2], 3, GR); });
      return svg(ell(68, 62, 20, 15, BR) + ell(94, 62, 20, 15, BR) + s +
        '<line x1="81" y1="20" x2="81" y2="92" stroke="' + RD + '" stroke-width="2.5" stroke-dasharray="4 3"/>' + txt(80, 106, "3–5 skott per del", 9));
    },
    div4: function () {
      var s = ""; [[48, -10], [48, 0], [48, 10], [112, -10], [112, 0], [112, 10]].forEach(function (p) { s += ln(p[0], 66, p[0] + p[1], 44, 3, GR); });
      return svg(ground(66) + s + drop(48, 22) + drop(112, 22) + txt(80, 100, "Samma djup", 9, "middle", "#fff") + txt(80, 12, "Vattna väl", 10));
    },
    // ----- Avläggare -----
    layer1: function () {
      return svg(ground(80) + ln(28, 80, 16, 30, 4, BR) + ln(28, 80, 30, 22, 4, BR) + ln(28, 80, 42, 32, 4, BR) +
        '<path d="M34 66 Q80 22 122 76" fill="none" stroke="#a07a3b" stroke-width="5" stroke-linecap="round"/>' +
        leaf(60, 40, -25, 5) + leaf(80, 36, 0, 5) + leaf(100, 46, 30, 5) + txt(100, 14, "Välj en lång, böjlig gren", 9));
    },
    layer2: function () {
      return svg(ln(14, 62, 146, 62, 9, BR) + '<polygon points="74,66 86,66 80,76" fill="' + RD + '"/>' +
        '<ellipse cx="80" cy="66" rx="16" ry="12" fill="none" stroke="' + RD + '" stroke-width="1.5" stroke-dasharray="3 3"/>' +
        leaf(28, 52, -20, 5) + leaf(132, 52, 20, 5) + txt(80, 26, "Skrapa barken eller gör", 9) + txt(80, 38, "en liten skåra", 9) + txt(80, 98, "på undersidan", 9));
    },
    layer3: function () {
      return svg(ground(70) + '<path d="M12 36 Q40 60 78 64 Q110 66 126 34" fill="none" stroke="#a07a3b" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M46 70 Q80 54 114 70 Z" fill="' + DK + '"/>' + ell(80, 62, 9, 5, "#999") +
        leaf(124, 30, -30, 5) + leaf(134, 38, 30, 5) + txt(130, 16, "Spetsen fri", 9) + txt(80, 94, "Jord och sten ovanpå", 9, "middle", "#fff"));
    },
    layer4: function () {
      var s = ""; [-30, -15, 0, 15, 30].forEach(function (a) { s += ln(104, 62, 104 + a, 94, 1.8, RT); });
      return svg(ground(62) + s + ln(104, 62, 104, 24, 4, LG) + leaf(94, 30, -30, 6) + leaf(114, 36, 30, 6) +
        '<path d="M8 44 Q50 40 104 62" fill="none" stroke="#a07a3b" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="44" y1="30" x2="44" y2="58" stroke="' + RD + '" stroke-width="2.5" stroke-dasharray="3 3"/>' +
        txt(80, 14, "Efter 1 år: klipp loss", 10) + txt(30, 30, "✂", 13, "middle"));
    },
    // ----- Rotskott -----
    suck1: function () {
      return svg(ground(62) + ln(36, 62, 24, 26, 4, BR) + ln(36, 62, 38, 20, 4, BR) + ln(36, 62, 50, 28, 4, BR) +
        '<path d="M38 68 Q80 96 112 68" fill="none" stroke="#c9a96a" stroke-width="3"/>' +
        ln(112, 62, 112, 36, 3, LG) + leaf(104, 40, -30, 5) + leaf(120, 42, 30, 5) + txt(112, 24, "Skott med", 9) + txt(80, 106, "egna rötter", 9, "middle", "#fff"));
    },
    suck2: function () {
      return svg(ground(62) + ln(36, 62, 24, 26, 4, BR) + ln(36, 62, 38, 20, 4, BR) + ln(36, 62, 50, 28, 4, BR) +
        '<path d="M38 68 Q58 82 70 78" fill="none" stroke="#c9a96a" stroke-width="3"/><path d="M92 78 Q104 78 112 68" fill="none" stroke="#c9a96a" stroke-width="3"/>' +
        ln(112, 62, 112, 36, 3, LG) + leaf(104, 40, -30, 5) + leaf(120, 42, 30, 5) +
        ln(81, 4, 81, 40, 3.5, "#999") + '<polygon points="72,40 90,40 88,84 74,84" fill="#9aa"/>' + txt(124, 16, "Klipp av roten", 9, "middle"));
    },
    suck3: function () {
      var s = ""; [-12, 0, 12].forEach(function (a) { s += ln(80, 66, 80 + a, 42, 3, GR); });
      return svg(ground(66) + s + leaf(74, 42, -30, 5) + leaf(88, 42, 30, 5) + drop(80, 24) + txt(80, 12, "Plantera och vattna", 10) + txt(80, 96, "Samma djup som förut", 9, "middle", "#fff"));
    }
  };

  window.PGUIDE = [
    { emoji: "🌰", title: "Frö: kall stratifiering", code: "s",
      intro: "Många frön från träd, buskar och perenner som växer i kallt klimat behöver en köldperiod innan de gror. Du härmar vintern i kylskåpet så att fröna kan gro på våren.",
      steps: [
        { scene: "strat1", text: "Blötlägg fröna i ljummet vatten i 12–24 timmar. Hårdskaliga frön, till exempel gullregn, kan behöva ritsas lätt med sandpapper först." },
        { scene: "strat2", text: "Blanda fröna med fuktig sand, vermikulit eller torvfri jord. Det ska vara fuktigt men inte blött, det ska inte droppa när du klämmer." },
        { scene: "strat3", text: "Lägg blandningen i en förslutbar plastpåse eller en burk med lock. Märk med växtens namn och datum." },
        { scene: "strat4", text: "Förvara kallt, 1–5 °C: i kylskåpet (inte i frysen) i 4–12 veckor beroende på art. Kolla var 14:e dag att det är fuktigt och inte mögligt. Du kan i stället ställa burken ute i skuggan över vintern." },
        { scene: "strat5", text: "När tiden gått, eller när de första groddarna syns, sås fröna i fuktig såjord. Ställ ljust och svalt och håll jämnt fuktigt." }
      ],
      tip: "Tiden varierar mycket mellan arter. Vissa frön behöver först en varm period (varm stratifiering), så sök på arten eller läs på fröpåsen." },
    { emoji: "🪵", title: "Vedstickling (höst och vinter)", code: "k",
      intro: "Vedsticklingar tas av vilande, förvedade grenar. Det passar bland annat vinbär, krusbär, forsythia, kornell, pil, fläder, liguster och schersmin.",
      steps: [
        { scene: "wood1", text: "Välj friska, årsgamla skott som är ungefär blyertstjocka. Ta dem när bladen fallit, från oktober till februari." },
        { scene: "wood2", text: "Klipp bitar på 20–25 cm. Klipp rakt strax under en knopp längst ner och snett strax ovanför en knopp längst upp, så vet du vad som är upp och ned." },
        { scene: "wood3", text: "Sätt dem i en rad i lucker jord på en skyddad, skuggig plats eller i krukor. Cirka två tredjedelar ner, med 1–2 knoppar över jord. Rotningshormon är valfritt." },
        { scene: "wood4", text: "Vattna vid torka. De bildar rötter under våren och sätter nya blad. Plantera om till sin plats året därpå." }
      ],
      tip: "Vissa arter rotar sig lättare än andra: pil, vinbär och fläder är enkla. Sätt gärna extra sticklingar, alla tar sig inte." },
    { emoji: "🌿", title: "Grön stickling (sommar)", code: "k",
      intro: "Gröna sticklingar tas av årets nya, mjuka skott, oftast i juni–juli. Det passar bland annat hortensia, schersmin, weigela, buddleja, lavendel, kantnepeta och klematis.",
      steps: [
        { scene: "green1", text: "Klipp 8–10 cm långa toppskott från friska skott utan blommor, helst på morgonen när plantan är full av vatten. Klipp strax under ett bladpar." },
        { scene: "green2", text: "Ta bort de nedre bladen och behåll 2–3 par blad i toppen. Stora blad kan halveras för att minska avdunstningen." },
        { scene: "green3", text: "Doppa snittet i rotningshormon (valfritt) och sätt sticklingen i fuktig, luftig jord, till exempel hälften såjord och hälften sand eller perlit. Gör ett hål med en penna först." },
        { scene: "green4", text: "Täck krukan med en klar plastpåse eller ett lock som inte rör bladen. Ställ ljust men utan direkt sol, och vädra ibland." },
        { scene: "green5", text: "Efter 4–8 veckor har den rötter om den ger motstånd när du drar försiktigt, eller om nya blad kommer. Vänj den gradvis vid luften och plantera om i en egen kruka." }
      ],
      tip: "Använd rena verktyg och en ren kruka så minskar risken för röta. Sätt flera sticklingar i samma kruka." },
    { emoji: "🔀", title: "Delning av perenner", code: "d",
      intro: "Det passar de flesta perenner, till exempel daglilja, funkia, flox, kantnepeta, rudbeckia och gräslök. Dela när plantan blivit stor, glesnar i mitten eller var 3–5:e år.",
      steps: [
        { scene: "div1", text: "Dela på våren när skotten kommer, eller tidig höst efter blomning. Undvik hetta och torka. Vattna plantan dagen innan." },
        { scene: "div2", text: "Gräv upp hela plantan med spade eller grep, en bit utanför bladverket så att du inte skadar rötterna." },
        { scene: "div3", text: "Skaka bort lös jord och dela med spade, kniv eller två grepar mot varandra. Varje del ska ha 3–5 skott eller knoppar och egna rötter. Släng den gamla, vedartade mitten." },
        { scene: "div4", text: "Plantera delarna direkt på samma djup som förut, med lite kompost. Vattna ordentligt och håll fuktigt i någon vecka." }
      ],
      tip: "Pioner och julrosor tycker inte om att flyttas, så dela dem sällan och försiktigt." },
    { emoji: "↩️", title: "Avläggare", code: "a",
      intro: "Grenen får rota sig medan den sitter kvar på moderplantan. Det är säkert och lätt för buskar och klätterväxter, till exempel forsythia, kornell, rhododendron, kaprifol, klematis, björnbär och hasselbuske.",
      steps: [
        { scene: "layer1", text: "Välj en lång, böjlig, ettårig gren nära marken. Gör det på våren eller sensommaren." },
        { scene: "layer2", text: "Ta bort bladen där grenen ska ligga mot marken. Skrapa lätt på barken eller gör en liten skåra på undersidan, det stimulerar rotbildningen." },
        { scene: "layer3", text: "Böj ner grenen i en grund fåra, fäst den med en böjd tråd eller tältpinne och lägg jord och gärna en sten ovanpå. Låt spetsen sticka upp. Håll jorden fuktig." },
        { scene: "layer4", text: "Efter ett år, ibland två, har grenen fått rötter. Klipp loss den från moderplantan och flytta den på våren eller hösten." }
      ],
      tip: "Det går också att lägga grenen i en kruka med jord som du gräver ner bredvid plantan." },
    { emoji: "🌱", title: "Rotskott och utlöpare", code: "r",
      intro: "Vissa växter bildar nya skott från rötterna, till exempel syren, hallon, snöbär, rynkros och kerria. Då kan du gräva upp en ny planta.",
      steps: [
        { scene: "suck1", text: "Hitta ett skott med egna rötter en bit från moderplantan. Gör det på våren eller sen höst när plantan vilar." },
        { scene: "suck2", text: "Gräv fram skottet och klipp av rotförbindelsen med en vass spade. Ta med så mycket rötter som möjligt." },
        { scene: "suck3", text: "Plantera genast på ny plats på samma djup och vattna väl. Korta ner toppen något om rotsystemet är litet." }
      ],
      tip: "Obs: på ympade växter, till exempel många rosor och fruktträd, ger rotskotten ofta grundstammen och inte sorten du vill ha." }
  ];
  window.PSCENES = SCENES;
})();
