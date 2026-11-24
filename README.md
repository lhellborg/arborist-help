# 🌿 Beskärningshjälpen

Webbapp som visar när och hur du beskär trädgårdsväxter.

**👉 Öppna appen: https://lhellborg.github.io/arborist-help/**

## Så använder du appen

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

Månadsremsan på varje kort visar bästa månader (januari–december).

**Guiden:** överst finns "✂️ Så beskär du" med enkla bilder av fem grundmetoder: snitt ovanför knopp, tunna ut vid basen, ner till marken, häckklippning samt borttagning av död och korsande ved.

## Lägg appen på mobilen

- **iPhone (Safari):** Dela → Lägg till på hemskärmen.
- **Android (Chrome):** menyn ⋮ → Installera app.

Appen sparas i telefonen och fungerar även utan nät.

## Om innehållet

Texterna är egna sammanfattningar och riktlinjer, inte text ur någon bok. Zon, höjd och jordmån är ungefärliga och varierar med sort och läge. Anpassa efter din odlingszon, växtens ålder och vädret. Jämför gärna med din egen beskärningsbok.

## Lägg till eller ändra växter

All växtdata ligger i `plants.js`. Varje växt har bland annat `m` (bästa månader, 1–12), `b` (blommar på årsskott eller fjolårsved) och `t` (beskärningsmetoder), `z` (zon), `ht` (höjd) och `jm` (jordmån).

## Kör lokalt

```
python3 -m http.server
```

Öppna sedan http://localhost:8000
