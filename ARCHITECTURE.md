# Architecture — PlayToPrep Noodscenario Simulator

> Dit is een levend document. Pas het aan zodra de architectuur verandert.

---

## 1. Project Structure

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
│   ├── data-scenarios-drinkwater.js  # Scenario 'drinkwater'
│   ├── data-scenarios-nachtalarm.js  # Scenario 'nachtalarm' (kort, ~10 min)
│   ├── intake.js                     # Intake-flow: naam, huishouden, woning, voertuigen, omgeving
│   ├── prep.js                       # Noodpakket-vragen (voorbereiding)
│   ├── audio.js                      # Audio via Howler.js (CDN); Howl-instanties lazy aangemaakt
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
├── CLAUDE.md                         # Werkinstructies, conventies, gotchas voor Claude
└── architecture.md                   # Dit bestand
```

### Script-laadvolgorde in index.html

Scripts worden geladen in deze vaste volgorde:

```
icons-data.js → data-state.js → [scenario-data bestanden] → intake.js → prep.js → audio.js → engine.js → report.js → ui.js
```

Verander deze volgorde nooit zonder expliciete toestemming. Nieuwe scripts? Respecteer de afhankelijkheden.

---

## 2. High-Level System Diagram

```
[Browser]
   |
   └── index.html  (één pagina, alle schermen als <div id="s-*">)
          |
          ├── style.css          (presentatie)
          └── js/ (volgorde bepaalt laadafhankelijkheden)
               ├── icons-data.js    → inline SVG-data
               ├── data-state.js    → globale toestand + sceneDecay-objecten
               ├── data-scenarios-* → scenariocontent (statische JS-arrays)
               ├── intake.js        → intake-flow
               ├── prep.js          → noodpakketvragen
               ├── audio.js         → Howler.js audio-management
               ├── engine.js        → spellogica (startScenario, renderScene, pickChoice)
               ├── report.js        → rapport-generatie
               └── ui.js            → navigatie + hulpfuncties
```

Geen server, geen API, geen framework. Alles draait puur client-side. Opslag via `localStorage`.

---

## 3. Core Components

### 3.1. Game Engine (`engine.js`)

**Verantwoordelijkheid:** Kern spellogica.

Sleutelfuncties:
- `startScenario(key)` — laadt scenario, reset state, wijst `sceneDecay` toe
- `renderScene(scene)` — rendert narrative, keuzes, sidebar, channels
- `pickChoice(idx)` — verwerkt keuze, past state aan, toont consequentie
- `advanceScene()` — gaat naar volgende (zichtbare) scene
- `CHOICE_ICON_MAP` — emoji-prefix → Lucide-icon + kleurcategorie mapping

### 3.2. State Management (`data-state.js`)

**Verantwoordelijkheid:** Alle gedeelde toestand tussen modules.

Globale objecten (altijd beschikbaar):
| Object | Type | Inhoud |
|---|---|---|
| `profile` | object | Spelersinstellingen: huis, huishouden, voertuigen, noodpakket |
| `state` | object | Spelstatus: stats + boolean/integer flags |
| `channels` | object | Actuele inhoud nieuws/berichten/radio per scene |
| `choiceHistory` | array | Alle gemaakte keuzes (voor rapport) |
| `sceneDecay` | object | Automatische stat-wijzigingen per scene-ID (dynamisch overschreven) |
| `adultsCount` | integer | Uit intake: aantal volwassenen |
| `childrenCount` | integer | Uit intake: aantal kinderen |
| `slechtTerBeenCount` | integer | Uit intake: slecht-ter-been personen |
| `petsCount` | integer | Uit intake: huisdieren |

**Stat-keys in `state`:** `water`, `food`, `comfort`, `health`, `cash`, `phoneBattery`

### 3.3. Scenario Data (`data-scenarios-*.js`)

Elk bestand exporteert een array van scene-objecten voor één scenario. Geen sceneDecay in deze bestanden — die staat in `data-state.js`.

**Beschikbare scenario's:**
| Sleutel | Bestand | Omschrijving |
|---|---|---|
| `stroom` | `data-scenarios-stroom.js` | Stroomstoring, 3+ dagen, 26 scenes |
| `natuurbrand` | `data-scenarios-bosbrand.js` | Bosbrand, evacuatie |
| `overstroming` | `data-scenarios-overstroming.js` | Overstroming |
| `thuis_komen` | `data-scenarios-thuiskomen.js` | Thuis komen tijdens crisis; heeft extra commute-scherm |
| `drinkwater` | `data-scenarios-drinkwater.js` | Drinkwatercrisis |
| `nachtalarm` | `data-scenarios-nachtalarm.js` | Brand thuis, kort (~10 min) |

### 3.4. UI & Navigatie (`ui.js`)

**Verantwoordelijkheid:** Schermnavigatie, NL-Alert popup, hulpoverlays, huishoudportret.

Sleutelfunctie: `show(id)` — toont scherm met gegeven ID, verbergt alle andere.

### 3.5. Rapport (`report.js`)

**Verantwoordelijkheid:** Genereer persoonlijk rapport na afloop van een scenario.

`showReport()` bepaalt uitkomst op basis van:
1. **Uitkomstscore** — gemiddelde van: `ranOutOfWater` (0 of 1), `ranOutOfFood` (0 of 1), en `comfort / MAX_STAT_COMFORT`
   - ≥ 0.7 → `outcome-good` (groen)
   - ≥ 0.4 → `outcome-mid` (geel)
   - < 0.4 → `outcome-bad` (rood)
2. **Statusbadges** — per scenario een eigen set flags uit `state`
3. **Tijdlijn** — alle entries in `choiceHistory`

---

## 4. Data Model

### 4.1. Scene-datastructuur

```js
{
  id: 'st_1',
  time: '11:30',
  date: 'Maandag ...',
  dayBadge: 'DAG 1',
  dayBadgeClass: 'blue', // of 'orange', 'red'
  channels: {
    news: [{ time, headline, body }],
    whatsapp: [{ from, msg, time, outgoing }],  // let op: 'msg', niet 'text'
    nlalert: 'tekst of null',
    radio: 'tekst of null'
  },
  narrative: 'Wat de speler ervaart...',  // of: get narrative() { ... } voor dynamische tekst
  choices: [{
    text: '🔦 Keuzetekst',               // emoji-prefix is functioneel (zie CHOICE_ICON_MAP)
    consequence: 'Gevolg...',             // mag ook een functie zijn: consequence: () => '...'
    cat: 'cat-social',                    // optioneel: overschrijft de emoji-gebaseerde categorie
    stateChange: { food: -1, awarenessLevel: 1 }, // mag ook een functie zijn: () => ({...})
    conditionalOn: () => profile.hasChildren      // optioneel: verbergt keuze als false
  }],
  conditionalOn: () => state.someFlag    // optioneel: verbergt hele scene als false
}
```

`channels` mag ook een getter zijn (`get channels() { ... }`) voor dynamische inhoud op basis van profiel of state.

### 4.2. SceneDecay patroon

Elk scenario heeft een eigen `sceneDecay_{naam}` object in `data-state.js`. In `startScenario()` wordt dit toegewezen aan `sceneDecay`. Decay-entries bevatten delta's:

```js
{ water: -1, phoneBattery: -15 }  // negatief = verlies, positief = herstel
```

### 4.3. Opslaan/laden — `ptp_savegame` structuur

`saveGame()` slaat op in localStorage als JSON:

```js
{
  version: 1,
  savedAt: <timestamp>,
  currentScenario, currentSceneIdx,
  state, profile, choiceHistory,
  newsLog, waLog,
  radioUnlocked, activeTab,
  adultsCount, childrenCount, slechtTerBeenCount, petsCount,
  selectedHouseType, selectedVehicles, selectedEnvironment,
  avatarSelections
}
```

Functies: `saveGame()`, `loadGame()`, `clearSave()`. LocalStorage-sleutel: `ptp_savegame`.

---

## 5. Schermen & Navigatie

Alle schermen zijn `<div id="s-*">` in `index.html`. Navigatie via `show(id)`.

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

## 6. State Flags

Naast de stat-keys gebruikt `state` ook boolean/integer flags:

| Flag | Type | Gebruik |
|---|---|---|
| `awarenessLevel` | integer 0–3 | Bewustzijnsniveau speler; hoger = beter gealarmeerd |
| `helpedNeighbor` | boolean | Buren actief geholpen (sociaal badge) |
| `knowsNeighbors` | boolean | Buren aangesproken of gewaarschuwd |
| `hasCash` | boolean | Contant geld in huis of bij je |
| `hasWater` | boolean | Noodwater opgeslagen |
| `hasFlashlight` | boolean | Zaklamp of kaarsen in huis |
| `houseLocked` | boolean | Deuren en ramen afgesloten |
| `hasCampingStove` | boolean | Campingkooktoestel gebruikt |
| `handledSewage` | boolean | Afvoeren afgesloten bij riolering |
| `wentToFoodDist` | boolean | Voedseluitdeling bezocht |
| `hasExtraFood` | boolean | Voedsel vooraf ingeslagen |
| `ranOutOfWater` | boolean | Speler is zonder water geraakt |
| `ranOutOfFood` | boolean | Speler is zonder voedsel geraakt |
| `packedBag` | boolean | Noodtas ingepakt (bosbrand/overstroming) |
| `evacuated` | boolean | Op tijd geëvacueerd (bosbrand) |
| `evacuatedFlood` | boolean | Op tijd geëvacueerd (overstroming) |
| `wentUpstairs` | boolean | Naar hogere verdieping gegaan (overstroming) |
| `cutElectricity` | boolean | Meterkast afgesloten (overstroming/nachtalarm) |
| `savedItems` | boolean | Essentials meegenomen (overstroming/nachtalarm) |
| `calledRescue` | boolean | Hulpdiensten gebeld (overstroming) |
| `returnedHome` | boolean | Veilig teruggekeerd (bosbrand/overstroming) |
| `tookPets` | boolean | Huisdier meegenomen (bosbrand) |
| `kidsEvacuated` | boolean | Kinderen/kwetsbare huisgenoten veilig gesteld (bosbrand/nachtalarm) |
| `reachedHome` | boolean | Thuis aangekomen (thuis_komen) |
| `foundAlternative` | boolean | Alternatief vervoer gevonden (thuis_komen) |
| `hadEDCBag` | boolean | Noodtas bij je gehad (thuis_komen) |
| `kidsPickedUp` | boolean | Kinderen opgehaald of geregeld (thuis_komen) |
| `helpedStranger` | boolean | Iemand onderweg geholpen (thuis_komen) |
| `tookAlarmSeriously` | boolean | Brandalarm direct serieus genomen (nachtalarm) |
| `warnedHousemates` | boolean | Huisgenoten gewaarschuwd (nachtalarm) |
| `didntUseWaterOnFire` | boolean | Geen water op elektrische brand gegooid (nachtalarm) |
| `evacuatedFire` | boolean | Op tijd naar buiten gegaan (nachtalarm) |
| `called112` | boolean | 112 gebeld (nachtalarm) |
| `stayedOutside` | boolean | Buiten gebleven na evacuatie (nachtalarm) |

---

## 7. Keuze-categorieën

De kleur en het Lucide-icon van keuzes worden bepaald door het emoji-prefix in `text`, via `CHOICE_ICON_MAP` in `engine.js`.

| Klasse | Kleur | Gebruik |
|---|---|---|
| `cat-action` | blauw | Actie of maatregel die de speler neemt |
| `cat-social` | groen | Sociale keuze: buren/familie helpen of overleggen |
| `cat-supply` | oranje | Iets verzamelen, inslaan of bevoorraden |
| `cat-info` | grijs | Nieuws volgen, afwachten of niets doen |
| `cat-risk` | rood | Risicovolle of gevaarlijke actie |

Override met `cat: 'cat-social'` (of andere klasse) in het keuze-object.

---

## 8. Deployment & Omgeving

- **Type:** Vanilla HTML/CSS/JS, geen framework, geen build-stap, geen npm
- **Hosting:** Statisch — bestanden direct in browser openen of via HTTP-server
- **Lokaal draaien:**
  ```bash
  cd /Users/ceesgauw/claude_projecten/playtoprepGH
  python3 -m http.server 8080
  # Open: http://localhost:8080
  ```
- **Audio:** Werkt beter via HTTP dan file://-protocol
- **Geen tests, geen package.json, geen linter**

---

## 9. Nieuw scenario toevoegen — checklist

1. Maak `data-scenarios-{naam}.js` aan met scenes-array. Geen sceneDecay in dit bestand.
2. Voeg `sceneDecay_{naam}` toe aan `data-state.js`.
3. Voeg nieuwe state-flags toe aan het `state`-object in `data-state.js`.
4. Koppel in `engine.js` → `startScenario()`: voeg `else if`-tak toe die `scenes` en `sceneDecay` toewijst, en reset de nieuwe flags.
5. Koppel in `engine.js` → `loadGame()`: zelfde `else if`-tak toevoegen.
6. Voeg sceneVisuals toe voor elke scene-ID in `engine.js`.
7. Voeg `<script src="js/data-scenarios-{naam}.js">` toe aan `index.html` vóór `engine.js`.
8. Voeg scenario-optie toe aan het scenariokeuze-scherm in `index.html` (`s-scenariokeuze`).
9. Voeg intro-tekst toe in `showReport()` in `report.js`.
10. Definieer `statusItems` voor het nieuwe scenario in `showReport()`.
11. Scene-ID prefix kiezen en vastleggen in de naamgeving-sectie van `CLAUDE.md`.

---

## 10. Project Identification

- **Project Name:** PlayToPrep Noodscenario Simulator
- **Type:** Nederlandstalige crisistraining-simulator (single-page app)
- **Repository:** `/Users/ceesgauw/claude_projecten/playtoprepGH`
- **Date of Last Update:** 2026-04-12

---

## 11. Glossary

| Term | Uitleg |
|---|---|
| `sceneDecay` | Object met automatische stat-wijzigingen per scene-ID; per scenario overschreven in `startScenario()` |
| `state` | Spelstatus tijdens een scenario: numerieke stats + boolean/integer flags |
| `profile` | Spelersinstellingen uit de intake: huishouden, woning, voertuigen, noodpakket |
| `channels` | Sidebar-content per scene: news, whatsapp, nlalert, radio |
| `choiceHistory` | Lijst van alle gemaakte keuzes; basis voor het rapport |
| `CHOICE_ICON_MAP` | Mapping in `engine.js`: emoji-prefix → Lucide-iconnaam + kleurcategorie |
| `conditionalOn` | Optionele functie op scene of keuze die bepaalt of het element zichtbaar is |
| NL-Alert | Landelijk alarmsysteem; gesimuleerd via popup en `nlalert`-veld in channels |
| B1-Nederlands | Taalniveau voor zichtbare teksten: eenvoudig, begrijpelijk voor brede doelgroep |
