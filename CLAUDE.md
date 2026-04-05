# CLAUDE.md — PlayToPrep Noodscenario Simulator

> Lees dit bestand elke keer als je dit project opnieuw leert kennen.

## Project overzicht

Vanilla HTML/CSS/JS single-page app — geen framework, geen build-stap, geen npm.
Nederlandstalige crisistraining-simulator voor gemeente Opsterland (demo).
Spelers doorlopen een intake, kiezen een noodscenario, maken keuzes en krijgen een persoonlijk rapport.

---

## Project architectuur

```
playtoprep/
├── index.html                        # Alle schermen als <div id="s-*"> in één HTML-bestand
├── style.css                         # Alle CSS (geen preprocessor)
├── js/
│   ├── data-state.js                 # Globale staat: profile, state, channels, choiceHistory,
│   │                                 # constanten, intakeVars, alle sceneDecay-objecten
│   ├── data-scenarios-stroom.js      # 26 scenes, scenario 'stroom' (3+ dagen)
│   ├── data-scenarios-bosbrand.js    # Scenario 'natuurbrand'
│   ├── data-scenarios-overstroming.js# Scenario 'overstroming'
│   ├── data-scenarios-thuiskomen.js  # Scenario 'thuis_komen'
│   ├── intake.js                     # Intake-flow: naam, huishouden, woning, voertuigen, omgeving
│   ├── prep.js                       # Noodpakket-vragen (voorbereiding)
│   ├── audio.js                      # Audio via Howler.js (CDN)
│   ├── engine.js                     # Kern spellogica: startScenario, renderScene, pickChoice,
│   │                                 # advanceScene, sceneDecay, sidebar-updates
│   ├── report.js                     # Rapportscherm: tijdlijn, badges, tips
│   ├── ui.js                         # Schermnavigatie show(), NL-Alert, Help, Huishoudenportret
│   └── icons-data.js                 # 60+ Lucide SVG's als inline data (geen CDN)
├── icons/                            # Lucide SVG-bronbestanden
├── afbeelding/                       # Afbeeldingen per scenario:
│   ├── algemeen/                     # Logo's, achtergronden
│   ├── avatars/                      # Personen, huisdieren, omgeving
│   ├── bosbrand/
│   ├── overstroming/
│   ├── stroomstoring/
│   └── stroomstoring_onderweg/
├── Audio/                            # NL-Alert.mp3, fire-loop.mp3, rain-loop.mp3,
│   └── radioberichten/               # MP3's voor radioscènes per scenario
├── STIJLGIDS.md                      # Schrijfstijl: B1-niveau, toonregels per kanaal
└── CHANGELOG.md                      # Versiehistorie
```

### Scherm-IDs (navigatie via `show(id)`)
| ID | Scherm |
|---|---|
| `s-start` | Startscherm |
| `s-uitleg` | Introductie |
| `s-intake` | Huishoudeninvoer |
| `s-prep` | Noodpakketvragen |
| `s-scenariokeuze` | Scenariokiezer |
| `s-commute` | Woon-werkvragen (alleen 'thuis_komen') |
| `s-scenario` | Actief scenario |
| `s-report` | Persoonlijk rapport |

---

## Key conventions

### Naamgeving
- **Scenario-keys**: `stroom`, `natuurbrand`, `overstroming`, `thuis_komen`
- **Scene-IDs**: `{prefix}_{nummer}` — `st_1`, `bf_3`, `ov_5`, `tk_2`
  - `st_` = stroomstoring, `bf_` = bosbrand/fire, `ov_` = overstroming, `tk_` = thuis komen
  - Dag-scenes: `st_d0_morgen`, `st_d1_avond` etc.
- **Stat-keys in `state`**: `water`, `food`, `comfort`, `health`, `cash`, `phoneBattery`

### Globale objecten (altijd beschikbaar)
- `profile` — spelersinstellingen (huis, huishouden, voertuigen, noodpakket)
- `state` — spelstatus tijdens een scenario (stats, flags zoals `helpedNeighbor`)
- `channels` — actuele inhoud nieuws/whatsapp/radio per scene
- `choiceHistory` — alle keuzes (voor rapport)
- `sceneDecay` — automatische stat-wijzigingen per scene-ID (toegewezen in `startScenario()`)

### SceneDecay patroon
Elke scenario heeft een eigen `sceneDecay_stroom` etc. object. In `startScenario()` wordt dit toegewezen aan `sceneDecay`. Decay-entries bevatten delta's: `{ water: -1, phoneBattery: -15 }`. Positieve waarden = herstel.

### Scene-datastructuur
```js
{
  id: 'st_1',
  time: '11:30',
  date: 'Maandag ...',
  dayBadge: 'DAG 1',
  dayBadgeClass: 'blue', // of 'orange', 'red'
  channels: {
    news: [{ time, headline, body }],
    whatsapp: [{ from, text, time }],
    nlalert: 'tekst of null',
    radio: 'tekst of null'
  },
  narrative: 'Wat de speler ervaart...',
  choices: [{
    text: '🔦 Keuzetekst',
    consequence: 'Gevolg...',
    stateChange: { food: -1, awarenessLevel: 1 }
  }]
}
```

### Icons
Icons worden geladen uit `icons-data.js` als inline SVG. Wil je een nieuw icon toevoegen? Voeg het SVG-bestand toe aan `/icons/` én voeg de data-entry toe aan `icons-data.js`. Gebruik geen Lucide CDN.

### Opslaan/laden
LocalStorage, sleutel: `ptp_savegame`. Functies: `saveGame()`, `loadGame()`, `clearSave()`.

---

## Common commands

**Geen build-stap.** Bestanden direct bewerken en browser herladen.

```bash
# Lokaal draaien
cd /Users/ceesgauw/claude_projecten/playtoprep
python3 -m http.server 8080
# Open: http://localhost:8080
```

Of open `index.html` direct in de browser (let op: audio werkt beter via HTTP).

**Geen tests, geen package.json, geen linter.**

---

## Known gotchas

1. **Geen dark mode** — CSS-blok voor dark mode is bewust verwijderd (veroorzaakte kleurproblemen). Voeg dit niet opnieuw toe.

2. **`intakeStep` begint op -5** — Negatieve waarden zijn speciale intake-stappen: -5=naam, -4=mensen, -3=woning, -2=voertuigen, -1=omgeving. Pas dit patroon aan als je nieuwe pre-intake-stappen toevoegt.

3. **Comfort-schaal vs. UI-schaal** — `MAX_STAT_COMFORT = 10` maar de UI toont slechts 5 segmenten (`MAX_STAT_SEGS = 5`). Comfort-waarde 10 = 5 volle icoontjes. Reken de weergave correct om.

4. **`sceneDecay` is dynamisch** — Staat in `data-state.js` maar wordt per scenario overschreven in `engine.js` via `startScenario()`. Zoek nooit statisch naar `sceneDecay`; gebruik de scenario-specifieke objecten.

5. **Radio-tab is standaard verborgen** — De radio-tab heeft klasse `hidden-tab`. Hij wordt pas zichtbaar als het scenario een radio-scene activeert.

6. **Scenario-sleutel 'thuis_komen' heeft commute-vragen** — Dit scenario heeft een extra scherm (`s-commute`) met eigen vragen over reiswijze en -afstand vóór het eigenlijke scenario start.

7. **Canvas portrait snapshot** — Na de intake wordt een canvas-snapshot opgeslagen in `portraitSnapshot`. De popup gebruikt dit als fallback bij het tonen van het huishouden.

8. **Taalregels** — Zie `STIJLGIDS.md`. Schrijf altijd B1-Nederlands. Gebruik vaste termen: "stroomstoring" (niet "black-out"), "dringend advies" (niet "noodverordening").

9. **Script-laadvolgorde in index.html** — Scripts worden geladen in deze volgorde: `icons-data.js` → `data-state.js` → scenario-data → `intake.js` → `prep.js` → `audio.js` → `engine.js` → `report.js` → `ui.js`. Nieuwe scripts toevoegen? Respecteer de afhankelijkheden.
