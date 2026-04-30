# Architecture — PlayToPrep Noodscenario Simulator

> Dit document beschrijft de actuele architectuur van het spel na de refactor van april 2026.

## 1. Doel Van De Architectuur

De codebase is opgezet als een client-side scenario-engine zonder framework. De refactor heeft drie doelen centraal gezet:

- scenario's moeten via een uniforme registratielaag worden geactiveerd
- runtime-state mag niet lekken tussen scenario-runs
- gelijksoortige logica voor state, visuals, audio en rapportage moet dezelfde opbouw gebruiken

De architectuur is bewust data-first: scenario-inhoud blijft declaratief in scenariofiles, terwijl runtime-beleid in centrale helpers en registries staat.

## 2. Projectstructuur

```text
playtoprepGH/
├── index.html
├── style.css
├── js/
│   ├── icons-data.js
│   ├── data-state.js
│   ├── data-scenarios-stroom.js
│   ├── data-scenarios-bosbrand.js
│   ├── data-scenarios-overstroming.js
│   ├── data-scenarios-thuiskomen.js
│   ├── data-scenarios-drinkwater.js
│   ├── data-scenarios-nachtalarm.js
│   ├── scenario-registry.js
│   ├── avatar-picker.js        ← avatar-constanten, openAvatarPicker, renderHouseholdIndicator
│   ├── intake-steps.js         ← buildFigures, alle huishoud-stap renderers
│   ├── intake.js               ← flow control: gotoIntake, renderIntake, intakeNext/Prev
│   ├── prep.js
│   ├── inventory.js
│   ├── audio.js
│   ├── scene-renderer.js       ← renderStatusBars, updateBattery, renderSceneVisual
│   ├── channel-manager.js      ← newsLog/waLog, setBadge, renderChannels
│   ├── choice-handler.js       ← CHOICE_ICON_MAP, renderChoices, pickChoice
│   ├── engine.js               ← startScenario, renderScene, saveGame/loadGame
│   ├── report.js
│   ├── ui.js
│   ├── users.js                ← statische gebruikerslijst (username + SHA-256 hash)
│   └── login.js                ← loginscherm, sessiecheck, doLogin()
├── admin-tool.html             ← lokale beheertool voor aanmaken gebruikers
├── afbeelding/
├── Audio/
├── CLAUDE.md
└── ARCHITECTURE.md
```

## 3. Scriptvolgorde

De runtime is afhankelijk van laadvolgorde. De actuele volgorde in `index.html` is:

```text
icons-data.js
→ data-state.js
→ data-scenarios-*.js
→ scenario-registry.js
→ avatar-picker.js          (avatar-constanten moeten voor intake-steps beschikbaar zijn)
→ intake-steps.js           (stap-renderers; gebruikt avatar-functies at runtime)
→ intake.js                 (flow control; roept stap-renderers aan)
→ prep.js
→ inventory.js
→ audio.js
→ scene-renderer.js         (visuele rendering; los van kanaal- en keuzelogica)
→ channel-manager.js        (kanaalgeschiedenis en badge-logica)
→ choice-handler.js         (CHOICE_ICON_MAP en keuze-verwerking)
→ engine.js                 (scenario-lifecycle; roept alle bovenstaande modules aan)
→ report.js
→ ui.js
→ users.js                 (gebruikerslijst; geen afhankelijkheden)
→ login.js                 (loginlogica; gebruikt show() uit ui.js en USERS uit users.js)
```

Waarom dit logisch is:

- `data-state.js` levert defaults, globale state en state-helpers.
- `data-scenarios-*.js` leveren alleen scenedata en scene-image-maps.
- `scenario-registry.js` bindt die losse scenedata samen tot een uniforme runtime-configuratie.
- `inventory.js`, `audio.js`, `engine.js` en `report.js` lezen daarna allemaal dezelfde centrale registratielaag.

## 4. Modules En Verantwoordelijkheden

### 4.1 `data-state.js`

Verantwoordelijkheid:

- defaults voor `profile` en `state`
- centrale mutable runtime-objecten
- intake- en prep-constanten
- scene-decay-tabellen
- gedeelde state-helpers

Belangrijke exports via globals:

- `PROFILE_DEFAULTS`
- `STATE_DEFAULTS`
- `profile`
- `state`
- `applyStateChange()`
- `buildScenarioStartState()`
- `resetObjectToDefaults()`

Architectuurrol:

- dit is de enige bron van waarheid voor runtime-defaults
- alle modules muteren dezelfde state via dezelfde basishulp

### 4.2 `data-scenarios-*.js`

Verantwoordelijkheid:

- scenedata in declaratieve scene-arrays
- scene-specifieke achtergrondmaps

Pattern:

- scenes beschrijven inhoud, keuzes, voorwaarden en kanalen
- scenes bevatten geen engine-logica voor activatie of routing

### 4.3 `scenario-registry.js`

Verantwoordelijkheid:

- centrale registratielaag per scenario
- koppeling tussen scenes, decay, visuals, audio-meta en report-meta
- uniforme helperfuncties voor scenario-activatie en runtime lookup

Belangrijke helpers:

- `getScenarioConfig(id)`
- `activateScenarioConfig(id)`
- `resolveSceneBackgroundAsset(scene, scenarioId)`
- `resolveSceneOverlayState(scene, scenarioId)`
- `resolveSceneDarkness(scene, scenarioId)`
- `resolveScenarioAmbient(sceneId, scenarioId)`
- `preloadScenarioAssets(scenarioId)`
- `getScenarioReportConfig(scenarioId)`

Architectuurrol:

- deze module vervangt verspreide `if/else`-ketens door configuratiegestuurde lookup
- scenario-specifiek runtime-beleid staat niet meer in `engine.js`, `audio.js` en `report.js` verspreid

### 4.4 `scene-renderer.js`

Verantwoordelijkheid:

- visuele statusbalken bijwerken (water, voedsel, comfort, batterij, cash)
- achtergrond-crossfade en overlay-video's (vuur, regen)
- duisterheidlaag per scène

Belangrijke functies:

- `renderStatusBars()` — werkt alle statwidgets bij in sidebar en mobiele balk
- `updateBattery()` — batterij-widget met gekleurde balken
- `renderSceneVisual(scene)` — achtergrond, overlays en darkness via registry-helpers

### 4.5 `channel-manager.js`

Verantwoordelijkheid:

- nieuws- en berichtenlogboeken (`newsLog`, `waLog`) en paginatie
- ongelezen-badges en tab-indicatoren
- rendering van nieuws, berichten en radio per scène

Belangrijke functies:

- `setBadge()` / `markUnread()` — badge-logica
- `renderChannels(scene)` — rendert alle kanalen voor de huidige scène
- `navChannel()` — paginanavigatie in kanaalgeschiedenis

### 4.6 `choice-handler.js`

Verantwoordelijkheid:

- keuze-knoppen renderen inclusief icon-parsing en categorie-sortering
- keuzeverwerking: stateChange, delta-indicators, typewriter-consequentie
- `CHOICE_ICON_MAP` — functioneel vereist voor emoji → Lucide-icon mapping

Belangrijke functies:

- `renderChoices(scene)` — bouwt keuzeknoppen met categorie en stagger-animatie
- `parseChoiceIcon(text)` — leest emoji-prefix, geeft icon + cat + label
- `pickChoice(idx)` — verwerkt keuze, past state aan, start typewriter
- `pickPersistentChoice(idx)` — verwerkt persistente keuze; identieke logica als `pickChoice`

**Persistente keuzes** — Naast reguliere (locatiegebonden) keuzes ondersteunt de engine een `persistentChoices`-array per scenario. Deze keuzes worden eenmalig op scenario-niveau gedefinieerd (in het bijbehorende `data-scenarios-*.js`-bestand) en verschijnen in elke scène vanaf een optionele `startSceneId`. Ze worden visueel gescheiden getoond onder de reguliere keuzes (sectie "Altijd mogelijk"), en verdwijnen zodra hun `conditionalOn` niet meer geldt. Vergrendeling van alle knoppen bij een keuze werkt identiek voor beide typen, omdat persistente knoppen dezelfde class `choice-btn` in `#sc-choices` gebruiken.

**Telefoon-UI** — `phone-handler.js` biedt een niet-blokkerende bel-overlay via `togglePhone()`. Bel-acties die altijd beschikbaar zijn (112, familie) worden gedefinieerd als `phoneContacts`-array in `data-scenarios-*.js` en worden geladen via `activatePhoneContacts()` in `activateScenarioConfig()`. Elk contact heeft dezelfde `startSceneId` / `conditionalOn` filtering als persistente keuzes, maar bellen vergrendelt de scènekeuzes niet en vereist geen 'Verder →'. De telefoon-knop wordt wel vergrendeld via `lockPhoneButton()` wanneer een scènekeuze in behandeling is (`pendingChoiceMade = true`).

### 4.7 `engine.js`

Verantwoordelijkheid:

- scenario-run lifecycle
- scène-progressie en terugnavigatie
- opslaan en laden (localStorage)
- UI-synchronisatie tijdens actieve gameplay

Belangrijke patterns:

- `startScenario()` activeert altijd via `activateScenarioConfig()`
- runtime-state wordt altijd opnieuw opgebouwd via `buildScenarioStartState()`
- `renderScene()` orkestreert alle sub-modules (scene-renderer, channel-manager, choice-handler)
- scene decay gebruikt een aparte helper met scenario-onafhankelijke mutatie-logica

### 4.8 `avatar-picker.js`

Verantwoordelijkheid:

- avatar-constanten per categorie (adult, child, stb, ouderen, huisdieren)
- picker-UI voor het wisselen van avatars tijdens de intake
- `renderHouseholdIndicator()` — huishoudindicator in de scenario-zijbalk

### 4.9 `intake-steps.js`

Verantwoordelijkheid:

- alle zes huishoud-stap renderers (naam, mensen, wie ben jij, woning, voertuigen, omgeving)
- `buildFigures()` / `buildPetOverlay()` — herbruikbare stage-rendering
- helper-functies per stap (selectHouseType, toggleVehicle, changeCount, etc.)

### 4.10 `intake.js`

Verantwoordelijkheid:

- intake-flow control: `gotoIntake()`, `renderIntake()`, `intakeNext()`, `intakePrev()`
- portret-snapshot (`capturePortraitSnapshot()`)
- kaart-vragen rendering en `intakePick()`

### 4.11 `inventory.js`

Verantwoordelijkheid:

- contextafhankelijke inventaris
- item-visibility en item-use gedrag
- lichte runtime-consequenties zonder scenewissel

Architectuurrol:

- inventaris gebruikt nu dezelfde `applyStateChange()` helper als normale scenekeuzes
- daardoor is er nog maar een patroon voor delta-mutaties in de runtime

### 4.12 `audio.js`

Verantwoordelijkheid:

- ambience
- scene-effects
- radio-audio en TTS fallback
- globale audio toggle

Architectuurrol:

- ambient-selectie leest nu scenario-audiobeleid uit `scenario-registry.js`
- daardoor staat scenario-audio niet meer hardcoded in de audio-engine zelf

### 4.13 `report.js`

Verantwoordelijkheid:

- eindrapport renderen in zes professionele secties
- samenvatting, thuissituatie, voorbereiding, scenario-analyse, persoonlijke tips en afsluiting

Architectuurrol:

- rapport-HTML gebruikt zes sectie-IDs: `rep-s1` t/m `rep-s6`
- `showReport()` roept interne renderfuncties aan per sectie
- goodItems, improveItems en personalTips zijn interne arrays; rendering is nu tekstgebaseerd (geen icons)
- scoremodus komt uit de scenarioregistratie via `getScenarioReportConfig()`

### 4.14 `ui.js`

Verantwoordelijkheid:

- schermnavigatie
- overlays en modals
- hulp- en profielweergave

## 5. Datastromen

### 5.1 Scenario Start

```text
scenariokeuze
→ startScenario(scenarioId)
→ activateScenarioConfig(scenarioId)
→ buildScenarioStartState(scenarioId)
→ resetObjectToDefaults(state, ...)
→ preloadScenarioAssets(scenarioId)
→ renderScene()
```

### 5.2 Scene Render

```text
renderScene()
→ getActiveScenes()
→ applySceneDecayChange()
→ renderStatusBars()
→ renderSceneVisual()
→ renderChannels()
→ renderChoices()
→ renderInventory()
→ Ambience.resumeForScene()
```

### 5.3 Keuzeverwerking

```text
pickChoice(idx)
→ choice.stateChange
→ applyStateChange(state, change)
→ renderStatusBars()
→ renderInventory()
→ history + consequence + next scene
```

### 5.4 Rapportage

```text
showReport()
→ getScenarioReportConfig(currentScenario)
→ scoreberekening
→ generieke render van intro, status, eindstats en tips
```

## 6. Gelijkgetrokken Patronen

Dit is expliciet gelijk getrokken in de refactor:

- Scenario-selectie: `startScenario()` en `loadGame()` gebruikten beide een eigen lange `if/else`-keten. Dat is vervangen door dezelfde registry lookup.
  Waarom: minder drift, makkelijker uitbreiden met nieuwe scenario's.

- Scenario-visuals: achtergrond, overlays en darkness zaten hardcoded in `engine.js`.
  Waarom gelijkgetrokken: visuals horen bij scenario-configuratie, niet bij renderflow.

- Scenario-audio: ambient-keuze zat als losse scenariologica in `audio.js`.
  Waarom gelijkgetrokken: audio volgt nu hetzelfde configuratiepatroon als visuals.

- Scenario-startstate: runtime-reset was handmatig en onvolledig.
  Waarom gelijkgetrokken: alle scenario-runs starten nu vanuit `STATE_DEFAULTS` plus een scenario-startbuilder. Dit voorkomt state leakage tussen runs.

- State-mutaties: scenekeuzes en inventory-items hadden elk een eigen delta-implementatie.
  Waarom gelijkgetrokken: `applyStateChange()` is nu de gedeelde mutatielaag.

- Report-meta: introtekst en scoremodus waren losse conditionele takken in `report.js`.
  Waarom gelijkgetrokken: scenario-meta staat nu centraal in de registratielaag.

## 7. Belangrijkste Risico Dat Is Weggenomen

Voor de refactor bestond er een reeel risico dat flags uit een eerder scenario in een nieuw scenario bleven hangen, omdat resets verspreid en onvolledig waren. Voorbeelden daarvan waren onder meer vervoersflags, buurcontact-flags, thuis-komflags en meerdere crisisstatussen.

De nieuwe aanpak voorkomt dat door:

- altijd te resetten vanaf `STATE_DEFAULTS`
- alleen scenario-startspecifieke overrides toe te voegen via `buildScenarioStartState()`
- savegames te hydrateren bovenop defaults in plaats van op mogelijk verouderde objectvormen

## 8. Intake-stap "Welke persoon ben jij?" (april 2026)

Na de stap `intake_mensen` (stap -5) is er een nieuwe stap -4 (`intake_wie_ben_jij`) toegevoegd. De speler selecteert hier welke persoon uit het huishouden zij zelf zijn.

De stap-nummering is hierdoor verschoven:

| Stap | ID | Omschrijving |
|------|----|--------------|
| -6 | `intake_naam` | Naam invoeren |
| -5 | `intake_mensen` | Huishoudsamenstelling |
| -4 | `intake_wie_ben_jij` | Welke persoon ben jij? (NIEUW) |
| -3 | `intake_woning` | Woningtype |
| -2 | `intake_voertuigen` | Vervoersmiddelen |
| -1 | `intake_omgeving` | Omgeving |

Geselecteerde persoon wordt opgeslagen als:
- `profile.playerPersonType`: `'adult'` | `'ouderen'` | `'slechtTerBeen'` | `'child'`
- `profile.playerIsMobilityImpaired`: `true` als speler type `slechtTerBeen` koos
- `profile.playerIsElderly`: `true` als speler type `ouderen` koos

Scenario-narratieven en keuzes gebruiken `profile.playerIsMobilityImpaired` en `profile.playerIsElderly` om teksten dynamisch aan te passen (bosbrand, overstroming, stroomstoring).

## 9. Voertuiggroepen (april 2026)

De intake-voertuigstap werkt met twee groepen; binnen elke groep kan maximaal één voertuig geselecteerd worden:

| Groep | Voertuigen | Scenario-capabilities |
|---|---|---|
| Motorvoertuig | `auto`, `motor` | radio in voertuig, USB-opladen, tankstation |
| Licht voertuig | `fiets`, `scooter`, `e-bike` | geen radio/oplader; achterpaden mogelijk |

Profile-flags: `hasCar`, `hasMotorcycle`, `hasScooter`, `hasEbike`, `hasBike`.
Scenario-code gebruikt `profile.hasCar \|\| profile.hasMotorcycle` als "heeft motorvoertuig"-check.

## 10. Waarom Deze Architectuur Schaalbaarder Is

Een nieuw scenario toevoegen vraagt nu in principe om drie dingen:

1. een nieuw `data-scenarios-*.js` bestand of scene-array
2. een nieuw item in `SCENARIO_REGISTRY`
3. optioneel scenario-specifieke reportstatus of sceneteksten

De engine, audioflow en visual pipeline hoeven daarvoor niet opnieuw vertakt te worden. Dat maakt groei gecontroleerd en voorspelbaar.

## 11. Bewuste Grenzen

Niet alles is naar configuratie verplaatst. Deze onderdelen zijn bewust nog codegedreven gebleven:

- complexe rapportinhoud voor `goed gedaan` en `verbeterpunten`
- UI-rendering van keuzes, kanalen en statusbalken
- scenario-inhoud en dynamische narratieven in scene-arrays

Reden:

- deze onderdelen bevatten veel tekstuele of UI-specifieke nuance
- volledige abstractie zou nu meer risico en complexiteit toevoegen dan waarde opleveren

## 12. Samenvatting

De huidige architectuur heeft nu een duidelijkere scheiding:

- `data-state.js` beheert defaults en state-mutaties
- `data-scenarios-*.js` beheren content
- `scenario-registry.js` beheert scenario-configuratie
- `engine.js` beheert runtime-flow
- `inventory.js`, `audio.js` en `report.js` gebruiken dezelfde centrale scenario- en state-laag

Daarmee is de code consistenter, beter uitlegbaar en veiliger uit te breiden zonder regressies in bestaande scenario's.
