# CLAUDE.md — PlayToPrep Noodscenario Simulator

> Lees dit bestand elke keer als je dit project opnieuw leert kennen.
> Lees ook [`architecture.md`](architecture.md) voor de volledige architectuur.

## Werkwijze — BELANGRIJK

Stel altijd verduidelijkende vragen als een opdracht niet volledig duidelijk is. Ga nooit zelf iets implementeren op basis van aannames, tenzij de gebruiker expliciet opdracht geeft om direct te implementeren. Bij twijfel: eerst vragen, dan doen.

**Architectuurwijzigingen:** Als je iets aan de architectuur verandert (nieuwe bestanden, nieuwe scenarios, nieuwe state-flags, nieuwe schermen, wijziging script-laadvolgorde), werk dan **ook `architecture.md` bij** voordat je klaar bent.

---

## Project overzicht

Vanilla HTML/CSS/JS single-page app — geen framework, geen build-stap, geen npm.
Nederlandstalige crisistraining-simulator.
Spelers doorlopen een intake, kiezen een noodscenario, maken keuzes en krijgen een persoonlijk rapport.

Zie [`architecture.md`](architecture.md) voor: projectstructuur, bestandsoverzicht, datamodel, scherm-IDs, state-flags, scenario-checklist en deployment.

---

## Key conventions

### Naamgeving
- **Scenario-keys**: `stroom`, `natuurbrand`, `overstroming`, `thuis_komen`, `drinkwater`, `nachtalarm`
- **Scene-IDs**: `{prefix}_{nummer}` — `st_1`, `bf_3`, `ov_5`, `tk_2`, `na_0`
  - `st_` = stroomstoring, `bf_` = bosbrand/fire, `ov_` = overstroming, `tk_` = thuis komen, `na_` = nachtalarm
  - Dag-scenes: `st_d0_morgen`, `st_d1_avond` etc.
- **Stat-keys in `state`**: `water`, `food`, `comfort`, `health`, `cash`, `phoneBattery`

### Keuze-emoji-prefixen — FUNCTIONEEL VEREIST

Het emoji-prefix in `text:` van keuzes is geen decoratie maar een functionele sleutel. De engine leest het prefix, zoekt het op in `CHOICE_ICON_MAP` in `engine.js`, haalt daaruit de Lucide-iconnaam en kleurcategorie, en verwijdert het emoji-prefix daarna uit de zichtbare tekst. Zonder dit prefix: geen icon, geen kleur.

**Verwijder deze prefixen nooit.**

Nieuw keuze-prefix nodig? Voeg eerst toe aan `CHOICE_ICON_MAP` in `engine.js` (met Lucide-icon en categorie), download het SVG van lucide.dev naar `/icons/`, voeg toe aan `icons-data.js`.

### Icons

Icons worden geladen uit `icons-data.js` als inline SVG. Wil je een nieuw icon toevoegen? Voeg het SVG-bestand toe aan `/icons/` én voeg de data-entry toe aan `icons-data.js`. Gebruik geen Lucide CDN.

### Emoji-regels

**Emoji's zijn verboden** in narratives, consequences, HTML en code-commentaar. Twee uitzonderingen:
1. **Emoji-prefixen in `text:` van keuzes** — functioneel vereist als sleutel voor `CHOICE_ICON_MAP`. Verwijder ze nooit.
2. **`msg`-velden in WhatsApp-berichten van personen** — emoji's zijn daar toegestaan (realistisch chatgedrag).

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
- Gebruik **nergens** emoji's — niet in teksten, keuzes, HTML of commentaar. Gebruik altijd Lucide-icons uit de lokale `/icons/`-map.
- Verander nooit de script-laadvolgorde zonder expliciete toestemming.
- Voeg geen dark-mode CSS toe (zie gotcha #1).
- Gebruik `conditionalOn` consequent voor keuzes die niet voor alle spelers relevant zijn (profiel én state).
- **Pas `architecture.md` bij** als je iets aan de architectuur verandert.
- **Pas de keuze-boom bij** als je een scenario aanpast (scenes, keuzes of condities toevoegt, verwijdert of hernoemt). De bomen staan in `docs/keuze-boom-{scenario}.html` — één bestand per scenario.
- **Voer `./build.sh` uit** na elke wijziging in een JS-bestand. De browser laadt `js/bundle.min.js`; zonder rebuild zijn JS-wijzigingen niet zichtbaar.

---

## Known gotchas

1. **Geen dark mode** — CSS-blok voor dark mode is bewust verwijderd (veroorzaakte kleurproblemen). Voeg dit niet opnieuw toe.

2. **`intakeStep` begint op -6** — Negatieve waarden zijn speciale intake-stappen: -6=naam, -5=mensen, -4=wie_ben_jij, -3=woning, -2=voertuigen, -1=omgeving. De stap `wie_ben_jij` slaat de persoonsselectie op als `profile.playerPersonType`, `profile.playerIsMobilityImpaired` en `profile.playerIsElderly`. Pas dit patroon aan als je nieuwe pre-intake-stappen toevoegt.

3. **Comfort-schaal vs. UI-schaal** — `MAX_STAT_COMFORT = 10` maar de UI toont slechts 5 segmenten (`MAX_STAT_SEGS = 5`). Comfort-waarde 10 = 5 volle icoontjes. Reken de weergave correct om.

4. **`sceneDecay` is dynamisch** — Staat in `data-state.js` maar wordt per scenario overschreven in `engine.js` via `startScenario()`. Zoek nooit statisch naar `sceneDecay`; gebruik de scenario-specifieke objecten.

5. **Radio-tab is altijd zichtbaar** — De radio-tab is in alle scenarios altijd zichtbaar. Als de speler geen radio heeft (`profile.hasRadio` en `state.hasCarRadio` zijn beide falsy), toont het paneel een melding dat de speler geen radio heeft. Gebruik de `hidden-tab`-klasse niet meer voor de radio-tab.

6. **Scenario-sleutel 'thuis_komen' heeft commute-vragen** — Dit scenario heeft een extra scherm (`s-commute`) met eigen vragen over reiswijze en -afstand vóór het eigenlijke scenario start.

7. **Emoji-regels** — Zie de emoji-regels in Key conventions hierboven.

8. **Canvas portrait snapshot** — Na de intake wordt een canvas-snapshot opgeslagen in `portraitSnapshot`. De popup gebruikt dit als fallback bij het tonen van het huishouden.

9. **Taalregels** — Zie `STIJLGIDS.md`. Schrijf altijd B1-Nederlands. Gebruik vaste termen: "stroomstoring" (niet "black-out"), "dringend advies" (niet "noodverordening"), en noem WhatsApp of WhatsAppjes in zichtbare tekst altijd `bericht`, `berichten` of `berichtjes`.

10. **Script-laadvolgorde in index.html** — Scripts worden geladen in deze volgorde: `icons-data.js` → `data-state.js` → scenario-data → `scenario-registry.js` → `avatar-picker.js` → `intake-steps.js` → `intake.js` → `prep.js` → `inventory.js` → `audio.js` → `scene-renderer.js` → `channel-manager.js` → `choice-handler.js` → `engine.js` → `report.js` → `ui.js`. Nieuwe scripts toevoegen? Respecteer de afhankelijkheden. Engine is opgesplitst: `scene-renderer.js` (visuelen), `channel-manager.js` (kanalen), `choice-handler.js` (keuzes). Intake is opgesplitst: `intake-steps.js` (stap-renderers), `avatar-picker.js` (avatar-picker).

11. **WhatsApp-berichten gebruiken `msg`, niet `text`** — Het veld in whatsapp-objecten heet `msg`. Gebruik `get channels()` als berichten conditioneel moeten zijn op profiel of state.

12. **`phoneBattery` is altijd een delta** — `phoneBattery` wordt door de engine als delta toegepast: `phoneBattery: 20` telt 20 op bij de huidige waarde. Wil je naar een exact percentage (zelden nodig), gebruik dan een functie: `stateChange: () => ({ phoneBattery: 60 - state.phoneBattery })`.

13. **Howl-instanties zijn lazy** — `_nlAlertSound`, `rain` en `fire` worden pas aangemaakt bij eerste gebruik, niet bij paginaladen. Zo worden AudioContext-waarschuwingen voorkomen. Houd dit patroon aan bij nieuwe geluiden.

14. **`hasHousemates()` in nachtalarm** — De helperfunctie `hasHousemates()` is gedefinieerd in `data-scenarios-nachtalarm.js` en controleert of de speler meer dan één persoon in het huishouden heeft. Gebruik `conditionalOn: () => hasHousemates()` voor keuzes die niet relevant zijn voor solo-spelers.

---

## Leerpunten

> Voeg hier inzichten toe die niet vanzelfsprekend zijn uit de code, maar die toekomstige sessies beter maken. Denk aan: gemaakte fouten, onverwachte beperkingen, of beslissingen met een goede reden.

<!-- Voorbeeld:
- **2026-04-12** — [Onderwerp]: Wat er geleerd is en waarom het belangrijk is.
-->
