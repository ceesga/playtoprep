# Scenario Data Gids

Deze gids beschrijft hoe scenario-data gestructureerd moet zijn om compatibel te zijn met de PlayToPrep engine.

## 1. Structuur per Scène

Elke scène is een bouwsteen van het scenario. Volgens het `SCENARIO_SCHEMA.json` bevat een scène:

### Identificatie & Tijd
- `id`: Een unieke korte code, bijv. `st_1`.
- `time`: Tijdstip in `HH:MM` formaat.
- `dayBadge`: Tekst zoals "DAG 1".
- `dayBadgeClass`: Kleur van de badge (`blue`, `orange`, `red`).

### Kanalen (Zijbalk)
- `news`: Array van nieuwsberichten.
- `whatsapp`: Berichten van personages. Let op: gebruik `msg` voor de tekst.
- `nlalert`: Tekst voor de NL-Alert popup.
- `radio`: Tekst voor het radiobericht.

### Narratief & Keuzes
- `narrative`: Wat de speler ziet in het tabblad "Wat je ervaart".
- `choices`: Een lijst met opties. 
  - **BELANGRIJK**: Elke keuzetekst *moet* beginnen met een emoji uit de `CHOICE_ICON_MAP` (bijv. `🔦 Zaklamp pakken`). De engine gebruikt dit om het juiste icoon en de kleur te bepalen.

## 2. State Changes

Keuzes kunnen de status van de speler aanpassen:
```json
"stateChange": {
  "water": -1,
  "food": -1,
  "helpedNeighbor": true
}
```

## 3. Dynamische Logica (`conditionalOn`)

In de huidige JavaScript-implementatie zijn `conditionalOn` velden functies. In een pure JSON-omgeving zouden dit strings zijn die door een simpele expressie-evaluator worden verwerkt, bijvoorbeeld:
- `"profile.hasChildren && !state.evacuated"`

## 4. Visuals

Visuals zijn momenteel losgekoppeld in `engine.js` (via `sceneVisuals`). In de nieuwe structuur worden deze bij de scène zelf gevoegd:
- `visuals.image`: Pad naar de achtergrond.
- `visuals.fireOverlay`: Sterkte van het vuureffect (0.0 - 1.0).
- `visuals.rainOverlay`: Sterkte van het regeneffect (0.0 - 1.0).
