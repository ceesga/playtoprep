# CLAUDE.md — PlayToPrep Noodscenario Simulator

> Lees dit bestand elke keer als je dit project opnieuw leert kennen.

## Project overzicht

Vanilla HTML/CSS/JS single-page app — geen framework, geen build-stap, geen npm.
Nederlandstalige crisistraining-simulator.
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
└── STIJLGIDS.md                      # Schrijfstijl: B1-niveau, toonregels per kanaal
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
- **Scenario-keys**: `stroom`, `natuurbrand`, `overstroming`, `thuis_komen`, `drinkwater`, `nachtalarm`
- **Scene-IDs**: `{prefix}_{nummer}` — `st_1`, `bf_3`, `ov_5`, `tk_2`, `na_0`
  - `st_` = stroomstoring, `bf_` = bosbrand/fire, `ov_` = overstroming, `tk_` = thuis komen, `na_` = nachtalarm
  - Dag-scenes: `st_d0_morgen`, `st_d1_avond` etc.
- **Stat-keys in `state`**: `water`, `food`, `comfort`, `health`, `cash`, `phoneBattery`

### Globale objecten (altijd beschikbaar)
- `profile` — spelersinstellingen (huis, huishouden, voertuigen, noodpakket)
- `state` — spelstatus tijdens een scenario (stats, flags zoals `helpedNeighbor`)
- `channels` — actuele inhoud nieuws/berichten/radio per scene
- `choiceHistory` — alle keuzes (voor rapport)
- `sceneDecay` — automatische stat-wijzigingen per scene-ID (toegewezen in `startScenario()`)
- `adultsCount`, `childrenCount`, `slechtTerBeenCount`, `petsCount` — globale tellers uit de intake

### SceneDecay patroon
Elke scenario heeft een eigen `sceneDecay_stroom` etc. object in `data-state.js`. In `startScenario()` wordt dit toegewezen aan `sceneDecay`. Decay-entries bevatten delta's: `{ water: -1, phoneBattery: -15 }`. Positieve waarden = herstel.

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
    whatsapp: [{ from, msg, time, outgoing }],  // let op: 'msg', niet 'text'
    nlalert: 'tekst of null',
    radio: 'tekst of null'
  },
  narrative: 'Wat de speler ervaart...',  // of: get narrative() { ... } voor dynamische tekst
  choices: [{
    text: '🔦 Keuzetekst',               // mag ook een functie zijn: text: () => '...'
    consequence: 'Gevolg...',             // mag ook een functie zijn: consequence: () => '...'
    cat: 'cat-social',                    // optioneel: overschrijft de emoji-gebaseerde categorie
    stateChange: { food: -1, awarenessLevel: 1 }, // mag ook een functie zijn: () => ({...})
    conditionalOn: () => profile.hasChildren      // optioneel: verbergt keuze als false
  }],
  conditionalOn: () => state.someFlag    // optioneel: verbergt hele scene als false
}
```

`channels` mag ook een getter zijn (`get channels() { ... }`) voor dynamische WhatsApp-berichten op basis van profiel of state.

### Keuze-categorieën (kleuren)

De kleur én het Lucide-icon van een keuzeknop worden bepaald door het emoji-prefix in `text`, via `CHOICE_ICON_MAP` in `engine.js`. Volgorde in de UI is: action → social → supply → info/risk.

**Belangrijk**: het emoji-prefix in `text` is geen decoratie maar een functionele sleutel. De engine leest het prefix, zoekt het op in `CHOICE_ICON_MAP`, haalt daaruit de Lucide-iconnaam en de kleurcategorie, en verwijdert het emoji-prefix daarna uit de zichtbare tekst. Zonder dit prefix verschijnt er géén icon en géén kleur op de keuzeknop. Verwijder deze prefixen dus nooit.

| Klasse | Kleur | Gebruik |
|---|---|---|
| `cat-action` | blauw | Actie of maatregel die de speler neemt |
| `cat-social` | groen | Sociale keuze: buren/familie helpen of overleggen |
| `cat-supply` | oranje | Iets verzamelen, inslaan of bevoorraden |
| `cat-info` | grijs | Nieuws volgen, afwachten of niets doen |
| `cat-risk` | rood | Risicovolle of gevaarlijke actie |

**Override:** voeg `cat: 'cat-social'` (of andere klasse) toe aan een keuze-object om de emoji-mapping te overschrijven.

### Icons
Icons worden geladen uit `icons-data.js` als inline SVG. Wil je een nieuw icon toevoegen? Voeg het SVG-bestand toe aan `/icons/` én voeg de data-entry toe aan `icons-data.js`. Gebruik geen Lucide CDN.

**Emoji's zijn verboden** in narratives, consequences, HTML en code-commentaar. De enige twee uitzonderingen:
1. **Emoji-prefixen in `text:` van keuzes** — functioneel vereist als sleutel voor `CHOICE_ICON_MAP` (zie boven). Verwijder ze nooit.
2. **`msg`-velden in WhatsApp-berichten van personen** — emoji's zijn daar toegestaan omdat dit realistisch chatgedrag nabootst.

Ontbreekt een icon voor een nieuw keuze-prefix? Voeg eerst het emoji-prefix toe aan `CHOICE_ICON_MAP` in `engine.js` (met bijbehorend Lucide-icon en categorie), download het SVG van lucide.dev naar `/icons/` en voeg het toe aan `icons-data.js`.

### Opslaan/laden
LocalStorage, sleutel: `ptp_savegame`. Functies: `saveGame()`, `loadGame()`, `clearSave()`.

---

## Spelflow — keuzes maken

Na het klikken op een keuze:
1. Alle keuzeknopppen worden **meteen vergrendeld** (ook niet-gekozen opties).
2. De consequentie wordt getypt in het "wat je ervaart"-tabblad.
3. De speler klikt zelf op **"Verder →"** om naar de volgende scene te gaan.
   - Eerste klik tijdens typewriter → tekst verschijnt direct.
   - Tweede klik → volgende scene.

Er is geen auto-advance timer. Verwijder of voeg deze niet toe.

---

## Werkinstructies voor Claude

- Maak nooit een nieuwe file aan als het ook in een bestaande file kan.
- Gebruik altijd B1-Nederlands in alle teksten en keuzes (zie STIJLGIDS.md).
- Noem WhatsApp of WhatsAppjes in user-facing tekst altijd `bericht`, `berichten` of `berichtjes`. Laat technische keys zoals `whatsapp` ongemoeid.
- Gebruik **nergens** emoji's — niet in teksten, keuzes, HTML of commentaar. Gebruik altijd Lucide-icons uit de lokale `/icons/`-map. Ontbreekt een icon? Download het SVG van lucide.dev, sla op in `/icons/` en voeg toe aan `icons-data.js`. Uitzondering: in `msg`-velden van WhatsApp-berichten van personen zijn emoji's toegestaan.
- Verander nooit de script-laadvolgorde zonder expliciete toestemming.
- Voeg geen dark-mode CSS toe (zie gotcha #1).
- Gebruik `conditionalOn` consequent voor keuzes die niet voor alle spelers relevant zijn (profiel én state).

---

## State-flags (per scenario gezet via `stateChange`)

Naast de stat-keys (`water`, `food`, `comfort`, `health`, `cash`, `phoneBattery`) gebruikt `state` ook boolean/integer flags die badges en rapport-uitkomsten bepalen:

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

## Rapport-logica

`showReport()` in `report.js` bepaalt de uitkomst op basis van drie onderdelen:

1. **Uitkomstscore** — gemiddelde van: `ranOutOfWater` (0 of 1), `ranOutOfFood` (0 of 1), en `comfort / MAX_STAT_COMFORT`.
   - ≥ 0.7 → `outcome-good` (groen)
   - ≥ 0.4 → `outcome-mid` (geel)
   - < 0.4 → `outcome-bad` (rood)

2. **Statusbadges** — per scenario een eigen set flags uit `state` (zie tabel hierboven). Badge is groen als `state[key]` truthy is, rood als falsy. Voeg je een nieuw scenario toe? Definieer de bijbehorende `statusItems` in het `if/else`-blok in `showReport()`.

3. **Tijdlijn** — alle entries in `choiceHistory` op volgorde. Elke keuze die via `pickChoice()` wordt gemaakt wordt automatisch toegevoegd.

---

## Nieuw scenario toevoegen — checklist

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
11. Scene-ID prefix kiezen en vastleggen in de naamgeving-sectie hierboven.

---

## Opslaan/laden — `ptp_savegame` structuur

`saveGame()` slaat op in localStorage als JSON met deze velden:
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

---

## Common commands

**Geen build-stap.** Bestanden direct bewerken en browser herladen.

```bash
# Lokaal draaien
cd /home/ceesgauw/projects/playtoprep
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

7. **Emoji-regels** — Emoji's zijn verboden in narratives, consequences, HTML en commentaar. Twee uitzonderingen: (1) emoji-prefixen in `text:` van keuzes zijn functioneel vereist — ze zijn de sleutel waarmee de engine het Lucide-icon en de kleurcategorie opzoekt in `CHOICE_ICON_MAP`; verwijder ze nooit. (2) `msg`-velden van WhatsApp-berichten van personen mogen emoji's bevatten. Nieuw keuze-prefix nodig? Eerst toevoegen aan `CHOICE_ICON_MAP` in `engine.js`, dan SVG downloaden van lucide.dev naar `/icons/`, dan toevoegen aan `icons-data.js`.

8. **Canvas portrait snapshot** — Na de intake wordt een canvas-snapshot opgeslagen in `portraitSnapshot`. De popup gebruikt dit als fallback bij het tonen van het huishouden.

8. **Taalregels** — Zie `STIJLGIDS.md`. Schrijf altijd B1-Nederlands. Gebruik vaste termen: "stroomstoring" (niet "black-out"), "dringend advies" (niet "noodverordening"), en noem WhatsApp of WhatsAppjes in zichtbare tekst altijd `bericht`, `berichten` of `berichtjes`.

9. **Script-laadvolgorde in index.html** — Scripts worden geladen in deze volgorde: `icons-data.js` → `data-state.js` → scenario-data → `intake.js` → `prep.js` → `audio.js` → `engine.js` → `report.js` → `ui.js`. Nieuwe scripts toevoegen? Respecteer de afhankelijkheden.

10. **WhatsApp-berichten gebruiken `msg`, niet `text`** — Het veld in whatsapp-objecten heet `msg`. Gebruik `get channels()` als berichten conditioneel moeten zijn op profiel of state.

11. **`phoneBattery` is altijd een delta** — `phoneBattery` wordt door de engine als delta toegepast: `phoneBattery: 20` telt 20 op bij de huidige waarde. Gebruik dit voor opladen (bijv. +20, +30). Wil je toch naar een exact percentage (zelden nodig), gebruik dan een functie: `stateChange: () => ({ phoneBattery: 60 - state.phoneBattery })`.

12. **Howl-instanties zijn lazy** — `_nlAlertSound`, `rain` en `fire` worden pas aangemaakt bij eerste gebruik, niet bij paginaladen. Zo worden AudioContext-waarschuwingen voorkomen. Houd dit patroon aan bij nieuwe geluiden.

13. **`hasHousemates()` in nachtalarm** — De helperfunctie `hasHousemates()` is gedefinieerd in `data-scenarios-nachtalarm.js` en controleert of de speler meer dan één persoon in het huishouden heeft. Gebruik `conditionalOn: () => hasHousemates()` voor keuzes die niet relevant zijn voor solo-spelers.
