# Changelog — Noodscenario Simulator (PlayToPrep)

---

## [v0.3] — 2026-03-30

### Toegevoegd
- **Lucide icons lokaal opgeslagen** — 60 SVG-bestanden in `/icons/`, geladen via `js/icons-data.js` (geen CDN meer nodig)
- **Gekleurde keuzeknoppen** — icons erven kleur per categorie (blauw/groen/oranje/grijs) via inline SVG
- **PlayToPrep logo** — zichtbaar op het startscherm (groot) en het rapportscherm (kleiner, subtiel)
- **Nieuwe huisdierafbeeldingen** — hond, kat, konijn, hamster, paard (Nederlandse bestandsnamen)
- **Schaalgrootte per huisdier** — hond +30%, kat −20%, hamster −60%, paard +100%
- **Huisdieren als overlay** — staan letterlijk voor de benen van personen (absolute positionering)
- **Canvas snapshot** — portretpopup toont een vastgelegde afbeelding van de huishoudsamenstelling
- **Maximaal 4 huisdieren** mogelijk (was 2)
- **`👀` emoji** toegevoegd aan iconmap (oog-icoon)

### Gewijzigd
- **Batterij-widget** volledig herontworpen: horizontaal met 5 verticale balkjes, kleur per niveau (groen → geel → oranje → rood)
- **Scenario-kiezer** — "situatie" hernoemd naar "scenario", badgeteksten bijgewerkt, stroomkaart is nu blauw
- **JS gesplitst** in afzonderlijke modules (`js/` map): `engine.js`, `ui.js`, `intake.js`, `prep.js`, `audio.js`, `report.js`, `data-state.js`, scenario-databestanden
- **Profielfoto speler** — toont nu het hoofd in plaats van het midden van het figuur

### Verwijderd
- Donkere modus CSS-blok — veroorzaakte kleurproblemen op systemen met dark mode ingeschakeld
- Lucide CDN-script uit `index.html`
- Oude huisdierbestanden (`cat.png`, `dog.png`, etc.)
- `geluid-preview.html`

### Bugfixes
- Emoji's zichtbaar in keuzeknoppen overstromingsscenario — ontbrekende entries toegevoegd aan iconmap
- Huisdieren telden nog maar tot 2 ondanks hogere limiet (`MAX_PETS`)
- `📱` → `📞` voor sociale actie "Ans vragen naar jou toe te komen"

---

## [v0.2] — 2026-03-29

### Toegevoegd
- Vier volledige scenario's: stroomuitval, bosbrand, overstroming, gewone winterdag
- Intake-flow (6 stappen): woningtype, omgeving, personen, huisdieren, voertuigen
- Prep-quiz (18 vragen) met automatisch invullen op basis van intake
- Statusbalk links: water, voedsel, gezondheid, comfort, telefoonbatterij, contant geld
- NL-Alert overlay met geluid
- Rapport aan het einde met persoonlijke tips
- Radio-, WhatsApp- en nieuwstabs per scene
- Achtergrondafbeeldingen per scene (34 afbeeldingen)

---

## [v0.1] — 2026-03-17

### Toegevoegd
- Eerste werkende versie als één HTML-bestand
- Stroomuitvalscenario volledig uitgewerkt
- Basis game engine: scenes, keuzes, state-variabelen
- Conditionele keuzes en narratieven op basis van huishoudsamenstelling
- Avond/nacht achtergronden per tijdstip
- Scène-timing en scenario flow gecorrigeerd
