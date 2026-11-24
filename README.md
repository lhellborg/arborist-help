# 🌿 Beskärningshjälpen

Webbapp som visar när och hur du beskär trädgårdsväxter.

**👉 Öppna appen: https://lhellborg.github.io/arborist-help/**

## Så använder du appen

Appen har två flikar: **✂️ Beskärning** (när och hur du beskär) och **🌱 Trädgårdshjälpen** (hitta växter till din trädgård).

### Fliken Beskärning

**Sök växt:** skriv i sökrutan, till exempel `rosor`, `äpple` eller ett latinskt namn.

**Sök månad:** skriv en månad, till exempel `april`, så visas de växter som passar bäst att beskära då. Du kan också trycka på en månadsknapp. Nuvarande månad är fetmarkerad. Tryck igen för att ta bort filtret.

**Filtrera grupp:** välj en grupp i listan under månadsknapparna, till exempel Fruktträd, Rosor eller Häckar.

**Välj din zon:** välj "Min zon" i listan, så döljs växter som inte klarar din odlingszon (Sveriges zoner 1–8, där 1 är sydligast). Valet sparas i telefonen.

**Läs mer om en växt:** tryck på växtens kort. Där finns:
- **Fakta:** odlingszon, ungefärlig höjd som fullvuxen och jordmån och läge.
- **Blomning:** om växten blommar på årsskott eller fjolårsved. Det avgör om du ska beskära före eller efter blomning.
- **När:** bästa tidpunkt.
- **Hur:** hur du beskär.
- **Metoder:** vilka av grundmetoderna som gäller.
- **📷 Se bilder:** en bildsökning på växten.

**Ikoner på korten:** ☀️ sol, ⛅ halvskugga, ☁️ skugga, 🌵 torktålig, 💧 normalt vattenbehov, 💦 vattenkrävande 🌸 blomningstid och 🐝 bra för pollinerare. Teckenförklaringen finns också i guiden.

Månadsremsan på varje kort visar bästa månader (januari–december).

**Guiden:** överst finns "✂️ Så beskär du" med enkla bilder av fem grundmetoder: snitt ovanför knopp, tunna ut vid basen, ner till marken, häckklippning samt borttagning av död och korsande ved.

**🌿 Klematis: vilken grupp?** Under guiden finns ett kort för klematis. Sök din sort, till exempel "Summer Snow" eller "Nelly Moser", så får du beskärningsgrupp (1, 2 eller 3) och hur du beskär. Vet du inte sorten väljer du när den blommar. Där finns också en lista med 53 vanliga sorter och arter. Sorterna dyker också upp som förslag i sökrutan överst. Hittar du inte sorten länkas en sökning efter dess beskärningsgrupp.

### Fliken Trädgårdshjälpen

Välj vilka förhållanden du har, så får du växter som passar. Filter:
- **Ljus:** sol, halvskugga eller skugga.
- **Jordfuktighet:** torr, normal eller fuktig.
- **Zon:** din odlingszon (delas med beskärningsfliken).
- **Jordtyp:** sandig, lerig, mullrik, sur eller kalkrik.
- **Max höjd:** växtens höjd som fullvuxen.
- **Grupp:** till exempel Perenner, Buskar eller Häckar.
- **🐝 Bra för pollinerare** och **Blommar i:** välj en eller flera månader. Med "☀️ Hela sommaren" får du växter som blommar i juni–augusti. Växter som blommar i flest av de valda månaderna visas först.

**Min trädgård:** i varje växtkort finns knappen "Lägg till i min trädgård". Överst visas då en **blomningskalender** med hur många av dina växter som blommar varje månad. Månader utan blommor (april–oktober) markeras som luckor, med förslag på växter som fyller dem. Tryck på en månad för att filtrera fram växter som blommar då. Listan sparas i telefonen.

Appen har 116 växter: träd, buskar, klätterväxter, häckar och 41 perenner.

## Lägg appen på mobilen

- **iPhone (Safari):** Dela → Lägg till på hemskärmen.
- **Android (Chrome):** menyn ⋮ → Installera app.

Appen sparas i telefonen och fungerar även utan nät.

## Om innehållet

Texterna är egna sammanfattningar och riktlinjer, inte text ur någon bok. Zon, höjd och jordmån är ungefärliga och varierar med sort och läge. Anpassa efter din odlingszon, växtens ålder och vädret. Jämför gärna med din egen beskärningsbok.

## Lägg till eller ändra växter

All växtdata ligger i `plants.js` och klematissorterna i `clematis.js`. Varje växt har bland annat `m` (bästa månader, 1–12), `b` (blommar på årsskott eller fjolårsved) och `t` (beskärningsmetoder), `z` (zon), `ht` (höjd) och `jm` (jordmån), `sun` (ljus), `wat` (vatten) `bt` (blomningstid) `pol` (bra för pollinerare), `jt` (jordtyper) och `hm` (största höjd i meter).

## Kör lokalt

```
python3 -m http.server
```

Öppna sedan http://localhost:8000
