// ═══════════════════════════════════════════════════════════════
// Engine — Kern game-logica
// Bevat: sceneVisuals (achtergronden), startScenario, renderScene,
//        pickChoice, advanceScene, renderChoices, updateStatDisplay,
//        updateSidebar, applySceneDecay, switchTab, navChannel,
//        commuteNext/Prev
// ═══════════════════════════════════════════════════════════════

/* ─── SCENE VISUALS ────────────────────────────────────────────────────────────
   Metadata per scène-ID: een seed-string (vroeger gebruikt voor afbeelding-
   generatie), een leesbaar tijdlabel en een scènetitel die boven in de UI
   verschijnt.
*/
const sceneVisuals = {
  st_pre_d2: {
    seed: 'office-lunch-winter',
    label: 'Dag -2 · 12:00',
    title: 'Eerste waarschuwingen'
  },
  st_pre_d1: {
    seed: 'office-tension-lunchroom',
    label: 'Dag -1 · 12:00',
    title: 'Onrustige signalen'
  },
  st_d0_morgen: {
    seed: 'suburb-morning-calm',
    label: 'Dag 1 · 08:00',
    title: 'Vóór de storing'
  },
  st_1: {
    seed: 'city-street-daylight',
    label: 'Dag 1 · 11:30',
    title: 'Eerste stroomstoring'
  },
  st_2: {
    seed: 'flicker-lights-house',
    label: 'Dag 1 · 11:57',
    title: 'Stroom even terug'
  },
  st_3: {
    seed: 'dramatic-storm-europe',
    label: 'Dag 1 · 12:20',
    title: 'Heel Europa zonder stroom'
  },
  st_4: {
    seed: 'supermarket-long-queue',
    label: 'Dag 1 · 13:30',
    title: 'Winkels sluiten'
  },
  st_4b: {
    seed: 'supermarket-empty-shelves',
    label: 'Dag 1 · 14:00',
    title: 'Bij de supermarkt'
  },
  st_5: {
    seed: 'dark-warning-street',
    label: 'Dag 1 · 14:00',
    title: 'Kan dagenlang duren'
  },
  st_6: {
    seed: 'dark-home-candle-warm',
    label: 'Dag 1 · 18:00',
    title: 'Koken zonder stroom'
  },
  st_6b: {
    seed: 'candle-blanket-dark-room',
    label: 'Dag 1 · 19:30',
    title: 'De eerste avond'
  },
  st_7: {
    seed: 'night-dark-cold-street',
    label: 'Dag 2 · 02:30',
    title: 'Inbraak in de buurt'
  },
  st_8: {
    seed: 'emergency-neighbor-help',
    label: 'Dag 2 · 05:30',
    title: 'Buurvrouw heeft hulp nodig'
  },
  st_8b: {
    seed: 'neighbor-medical-help',
    label: 'Dag 2 · 05:30',
    title: 'Bij Annie thuis'
  },
  st_9: {
    seed: 'pipes-water-basement',
    label: 'Dag 2 · 08:30',
    title: 'Riolering valt uit'
  },
  st_autolaad: {
    seed: 'car-charger-cold-morning',
    label: 'Dag 2 · 09:15',
    title: 'Opladen in de auto'
  },
  st_d1_morgen: {
    seed: 'frost-winter-dawn-house',
    label: 'Dag 2 · 08:00',
    title: 'Eerste crisisochtend'
  },
  st_watertruck: {
    seed: 'water-truck-queue-street',
    label: 'Dag 2 · 10:30',
    title: 'Watertruck bij de supermarkt'
  },
  st_10a: {
    seed: 'neighbor-at-door-water-bottle',
    label: 'Dag 2 · 14:15',
    title: 'Buurman Rob aan de deur'
  },
  st_10: {
    seed: 'empty-street-curfew-day',
    label: 'Dag 2 · 14:30',
    title: 'Wat doe je nu?'
  },
  st_d1_avond: {
    seed: 'cold-dark-kitchen-evening',
    label: 'Dag 2 · 18:00',
    title: 'Koken zonder stroom'
  },
  st_11: {
    seed: 'cold-dark-kitchen-evening',
    label: 'Dag 3 · 01:30',
    title: 'Brand bij de overburen'
  },
  st_d2_morgen: {
    seed: 'burnt-car-cold-morning',
    label: 'Dag 3 · 08:00',
    title: 'Tweede crisisochtend'
  },
  st_12: {
    seed: 'neighborhood-flyer-door',
    label: 'Dag 3 · 11:30',
    title: 'Gemeente deelt flyers uit'
  },

  st_d2_avond: {
    seed: 'candle-sparse-meal-dark',
    label: 'Dag 3 · 18:00',
    title: 'Derde avond'
  },
  st_d3_morgen: {
    seed: 'hopeful-winter-morning',
    label: 'Dag 4 · 08:00',
    title: 'Derde ochtend vol hoop'
  },
  st_13: {
    seed: 'food-distribution-queue',
    label: 'Dag 4 · 10:15',
    title: 'Voedseluitdeling'
  },
  st_14: {
    seed: 'lights-on-relief-home',
    label: 'Dag 4 · 12:45',
    title: 'Stroom terug!'
  },
  // Bosbrand — scènes voor het bosbrандscenario
  bf_0: {
    seed: '',
    label: 'Dag 0 · 16:00',
    title: 'De middag ervoor'
  },
  bf_0b: {
    seed: '',
    label: 'Dag 1 · 08:30',
    title: 'Rooklucht in de ochtend'
  },
  bf_1: {
    seed: '',
    label: 'Dag 1 · 09:00',
    title: 'Rookpluim in de verte'
  },
  bf_2: {
    seed: '',
    label: 'Dag 1 · 10:15',
    title: 'NL-Alert: mogelijke evacuatie'
  },
  bf_2b: {
    seed: '',
    label: 'Dag 1 · 11:00',
    title: 'Wind draait'
  },
  bf_2c: {
    seed: '',
    label: 'Dag 1 · 11:15',
    title: 'Kinderen buiten'
  },
  bf_2d: {
    seed: '',
    label: 'Dag 1 · 11:20',
    title: 'Rugzakjes pakken'
  },
  bf_3: {
    seed: '',
    label: 'Dag 1 · 11:30',
    title: 'Evacuatiebevel'
  },
  bf_3c: {
    seed: '',
    label: 'Dag 1 · 12:00',
    title: 'Kinderen in de auto'
  },
  bf_4: {
    seed: '',
    label: 'Dag 1 · 12:00',
    title: 'Vertrekken'
  },
  bf_4b: {
    seed: '',
    label: 'Dag 1 · 12:15',
    title: 'File op de weg'
  },
  bf_4c: {
    seed: '',
    label: 'Dag 1 · 12:30',
    title: 'Fietsen door de rook'
  },
  bf_4d: {
    seed: '',
    label: 'Dag 1 · 12:30',
    title: 'Te voet door de rook'
  },
  bf_4e: {
    seed: '',
    label: 'Dag 1 · 12:45',
    title: 'Met kinderen door de rook'
  },
  bf_5: {
    seed: '',
    label: 'Dag 1 · 13:30',
    title: 'Noodopvang'
  },
  bf_5f: {
    seed: '',
    label: 'Dag 1 · 13:45',
    title: 'Kinderen in de sporthal'
  },
  bf_5b: {
    seed: '',
    label: 'Dag 1 · 15:00',
    title: 'Wachten'
  },
  bf_5c: {
    seed: '',
    label: 'Dag 1 · 15:30',
    title: 'Kevin'
  },
  bf_5d: {
    seed: '',
    label: 'Dag 1 · 18:00',
    title: 'Avond op de opvang'
  },
  bf_5g: {
    seed: '',
    label: 'Dag 1 · 18:30',
    title: 'Vragen voor het slapengaan'
  },
  bf_6: {
    seed: '',
    label: 'Dag 2 · 09:00',
    title: 'Sein veilig?'
  },
  bf_6b: {
    seed: '',
    label: 'Dag 2 · 10:00',
    title: 'Terug in de straat'
  },
  bf_7: {
    seed: '',
    label: 'Dag 2 · 11:00',
    title: 'Schade beoordelen'
  },
  // Overstroming — scènes voor het overstromingsscenario
  ov_0: {
    seed: '',
    label: 'Dag 0 · 20:00',
    title: 'De avond ervoor'
  },
  ov_1: {
    seed: '',
    label: 'Dag 1 · 07:00',
    title: 'Aanhoudende regen'
  },
  ov_1b: {
    seed: '',
    label: 'Dag 1 · 07:30',
    title: 'Kinderen naar school?'
  },
  ov_1d: {
    seed: '',
    label: 'Dag 1 · 08:00',
    title: 'Kinderen zoeken houvast'
  },
  ov_2: {
    seed: '',
    label: 'Dag 1 · 09:30',
    title: 'Eerste water op straat'
  },
  ov_2b: {
    seed: '',
    label: 'Dag 1 · 09:45',
    title: 'School sluit'
  },
  ov_2c: {
    seed: '',
    label: 'Dag 1 · 10:00',
    title: 'Kinderen willen terug'
  },
  ov_3: {
    seed: '',
    label: 'Dag 1 · 10:30',
    title: 'Evacuatieadvies'
  },
  ov_3c: {
    seed: '',
    label: 'Dag 1 · 10:45',
    title: 'Op de trap'
  },
  ov_4a: {
    seed: '',
    label: 'Dag 1 · 11:00',
    title: 'Boven blijven'
  },
  ov_4b: {
    seed: '',
    label: 'Dag 1 · 11:00',
    title: 'Evacueren mislukt'
  },
  ov_4c: {
    seed: '',
    label: 'Dag 1 · 12:30',
    title: 'Wachten met kinderen'
  },
  ov_5: {
    seed: '',
    label: 'Dag 1 · 13:00',
    title: 'Water in huis'
  },
  ov_5b: {
    seed: '',
    label: 'Dag 1 · 13:15',
    title: 'Kortsluiting!'
  },
  ov_6: {
    seed: '',
    label: 'Dag 1 · 15:00',
    title: 'Reddingsboot'
  },
  ov_6e: {
    seed: '',
    label: 'Dag 1 · 15:30',
    title: 'In de reddingsboot'
  },
  ov_6c: {
    seed: '',
    label: 'Dag 1 · 17:00',
    title: 'Noodopvang'
  },
  ov_6f: {
    seed: '',
    label: 'Dag 1 · 18:30',
    title: 'Kinderen op de noodopvang'
  },
  ov_6g: {
    seed: '',
    label: 'Dag 1 · 18:00',
    title: 'Avondeten boven'
  },
  ov_6d: {
    seed: '',
    label: 'Dag 1 · 22:00',
    title: 'Nacht bij de noodopvang'
  },
  ov_6b: {
    seed: '',
    label: 'Dag 1 · 21:00',
    title: 'Nacht boven'
  },
  ov_7: {
    seed: '',
    label: 'Dag 2 · 08:00',
    title: 'Eerste inspectie'
  },
  ov_7b: {
    seed: '',
    label: 'Dag 2 · 09:00',
    title: 'Buurvrouw Ans'
  },
  ov_7c: {
    seed: '',
    label: 'Dag 2 · 09:30',
    title: 'Kinderen terug bij huis'
  },
  ov_8: {
    seed: '',
    label: 'Dag 2 · 10:30',
    title: 'Kort terug in huis'
  },
  // Thuis komen — scènes voor het scenario waarbij de speler onderweg naar huis is
  tk_1: {
    seed: '',
    label: 'Werk · 11:57',
    title: 'Stroom valt uit op kantoor'
  },
  tk_2: {
    seed: '',
    label: 'Werk · 12:20',
    title: 'Heel Nederland zonder stroom'
  },
  tk_2b: {
    seed: '',
    label: 'Werk · 12:30',
    title: 'School belt'
  },
  tk_3b: {
    seed: '',
    label: 'Onderweg · 12:58',
    title: 'Martijn sluit aan'
  },
  tk_3: {
    seed: '',
    label: 'Onderweg · 13:00',
    title: 'Hoe ga je naar huis?'
  },
  tk_4a: {
    seed: '',
    label: 'Onderweg · 13:15',
    title: 'Met de auto'
  },
  tk_4b: {
    seed: '',
    label: 'Onderweg · 13:15',
    title: 'Trein rijdt niet'
  },
  tk_4c: {
    seed: '',
    label: 'Onderweg · 13:15',
    title: 'Met de bus'
  },
  tk_4d: {
    seed: '',
    label: 'Onderweg · 13:15',
    title: 'Met de fiets'
  },
  tk_4e: {
    seed: '',
    label: 'Onderweg · 15:30',
    title: 'Lopen is niet haalbaar'
  },
  tk_5: {
    seed: '',
    label: 'Onderweg · 15:30',
    title: 'Onderweg'
  },
  tk_5m: {
    seed: '',
    label: 'Onderweg · 15:30',
    title: 'Pauze bij Martijn'
  },
  tk_5b: {
    seed: '',
    label: 'Onderweg · 20:00',
    title: 'Overnachten onderweg'
  },
  tk_6: {
    seed: '',
    label: 'Thuis · 21:00',
    title: 'Thuiskomst'
  },
  // Drinkwater — scènes voor het drinkwaterscenario
  wd_0: { seed: '', label: 'Dag 1 · 13:10', title: 'Troebel water' },
  wd_1: { seed: '', label: 'Dag 1 · 13:35', title: 'Kookadvies' },
  wd_2: { seed: '', label: 'Dag 1 · 14:10', title: 'Water verdelen' },
  wd_3: { seed: '', label: 'Dag 1 · 15:00', title: 'Officiële update' },
  wd_4: { seed: '', label: 'Dag 1 · 16:15', title: 'Supermarkt druk' },
  wd_5: { seed: '', label: 'Dag 1 · 17:00', title: 'Water voor school' },
  wd_6: { seed: '', label: 'Dag 1 · 17:30', title: 'Ans heeft hulp nodig' },
  wd_7: { seed: '', label: 'Dag 1 · 20:30', title: 'Voorraad voor morgen' },
  // Nachtalarm — scènes voor het nachtalarm-scenario
  na_0: { seed: '', label: 'Nacht · 02:17', title: 'De rookmelder gaat af' },
  na_1: { seed: '', label: 'Nacht · 02:18', title: 'Rook op de gang' },
  na_2: { seed: '', label: 'Nacht · 02:19', title: 'Brand in de woonkamer' },
  na_2b: { seed: '', label: 'Nacht · 02:20', title: 'Huisgenoten op de gang' },
  na_3: { seed: '', label: 'Nacht · 02:20', title: 'Naar buiten' },
  na_4: { seed: '', label: 'Nacht · 02:22', title: 'Buiten, wacht op brandweer' },
  na_5: { seed: '', label: 'Nacht · 02:45', title: 'Brandweer heeft controle' }
};

/* ─── STATUSBALKEN WEERGAVE ────────────────────────────────────────────────────
   Werkt de visuele statusbalken bij in zowel de zijbalk als de mobiele balk
   onderaan het scherm. Verwerkt water, voedsel, comfort, telefoonbatterij,
   contant geld en voertuigen.
*/
function renderStatusBars() {
  // Helper: update een reeks segmenten in zowel de zijbalk als de mobiele balk
  function updateSegs(segId, msbSegId, wrapId, msbStatId, val) {
    // Sidebar icon units
    const icons = document.querySelectorAll('#' + segId + ' .ss-icon-unit');
    icons.forEach((icon, i) => {
      icon.classList.remove('empty', 'warn', 'danger');
      if (i >= val) {
        // Dit segment is leeg (boven de huidige waarde)
        icon.classList.add('empty');
      } else if (val <= 1) {
        // Kritiek laag: rood
        icon.classList.add('danger');
      } else if (val <= 2) {
        // Laag: oranje/geel
        icon.classList.add('warn');
      }
    });
    const wrap = document.getElementById(wrapId);
    // Voeg klasse 'zero' toe als de waarde nul is (voor extra visuele nadruk)
    if (wrap) wrap.classList.toggle('zero', val === 0);
    // Mobile icon units
    const micons = document.querySelectorAll('#' + msbSegId + ' .msb-icon-unit');
    micons.forEach((icon, i) => {
      icon.classList.remove('empty', 'warn', 'danger');
      if (i >= val) {
        icon.classList.add('empty');
      } else if (val <= 1) {
        icon.classList.add('danger');
      } else if (val <= 2) {
        icon.classList.add('warn');
      }
    });
    const mwrap = document.getElementById(msbStatId);
    if (mwrap) mwrap.classList.toggle('zero', val === 0);
  }
  // Werk de drie hoofdstatistieken bij: water, voedsel, comfort
  updateSegs('stat-water', 'msb-seg-water', 'ss-water', 'msb-water', state.water);
  updateSegs('stat-food', 'msb-seg-food', 'ss-food', 'msb-food', state.food);
  updateSegs('stat-comfort', 'msb-seg-comfort', 'ss-comfort', 'msb-comfort', state.comfort);
  // state.health wordt bijgehouden maar niet getoond in de UI
  // Left sidebar — batteries
  updateBattery('batt-phone-fill', 'batt-phone-pct', 'batt-phone-empty', state.phoneBattery);
  // Cash
  const cashEl = document.getElementById('ss-cash-amount');
  if (cashEl) cashEl.textContent = '💵 €' + state.cash;
  // Mobile bar — battery + cash
  const mBatt = document.getElementById('msb-battery');
  if (mBatt) mBatt.textContent = state.phoneBattery + '%';
  const mCash = document.getElementById('msb-cash');
  if (mCash) mCash.textContent = '€' + state.cash;
  // Voertuigen — toon of dim auto/fiets afhankelijk van het scenario en profiel
  const carEl = document.getElementById('veh-car');
  const bikeEl = document.getElementById('veh-bike');
  let showCar, showBike;
  if (currentScenario === 'thuis_komen') {
    // In het thuis_komen-scenario: gebruik het gekozen reisvervoer
    showCar = profile.commuteMode === 'car';
    showBike = profile.commuteMode === 'bike';
  } else {
    // Overige scenario's: gebruik het profiel (heeft de speler een auto/fiets?)
    showCar = profile.hasCar;
    showBike = profile.hasBike;
  }
  // Dim het voertuig-icoon als het voertuig niet beschikbaar is
  if (carEl) carEl.classList.toggle('ss-veh-dim', !showCar);
  if (bikeEl) bikeEl.classList.toggle('ss-veh-dim', !showBike);
}

// Werkt de batterij-widget bij op basis van het opgegeven percentage.
// Toont 0–5 gekleurde balken en een procentlabel; kleur gaat van groen naar rood.
function updateBattery(fillId, pctId, emptyId, val) {
  const body = document.getElementById(fillId);
  const pctEl = document.getElementById(pctId);
  if (!body) return;
  // Rond af op een veelvoud van 10 voor een cleaner weergave
  const pct = Math.round(val / 10) * 10;
  // Bereken het aantal gevulde batterijbalken (max. 5)
  const filledBars = Math.round(pct / 20); // 0–5 bars
  // Kies de kleur op basis van het resterende percentage
  const color = pct >= 80 ? 'var(--c-battery-full)' : pct >= 60 ? 'var(--c-battery-mid)' : pct >= 40 ? 'var(--c-battery-low)' : 'var(--c-battery-empty)';
  body.querySelectorAll('.batt-bar').forEach((bar, i) => {
    // Gevulde balken krijgen de statuskleur; lege balken worden gereset
    bar.style.backgroundColor = i < filledBars ? color : '';
  });
  // Kritiek (≤20%): rand en tekst rood + knipperanimatie
  const critical = pct <= 20;
  body.style.borderColor = critical ? 'var(--c-battery-empty)' : '';
  if (pctEl) {
    pctEl.textContent = pct + '%';
    pctEl.style.color = critical ? 'var(--c-battery-empty)' : '';
    pctEl.classList.toggle('blink-alert', critical);
  }
}

/* ─── ACHTERGRONDAFBEELDING & OVERLAYS PER SCÈNE ──────────────────────────────
   Stelt de achtergrondafbeelding van de pagina in op basis van de huidige scène.
   Past ook vuur-, regen- en duisternis-overlays aan om het tijdstip en de
   ernst van de situatie te weerspiegelen.
*/
function renderSceneVisual(scene) {
  // Update page background per scene
  const bodyBgMap = {
    bf_0: 'afbeelding/bosbrand/geen_bosbrand.png',
    bf_0b: 'afbeelding/bosbrand/geen_bosbrand.png',
    bf_1: 'afbeelding/bosbrand/bosbrand_stadium1.jpg',
    bf_2: 'afbeelding/bosbrand/bosbrand_stadium1.jpg',
    bf_2b: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_2c: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_2d: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_3: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_3c: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4b: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4c: 'afbeelding/bosbrand/bosbrand_stadium3.png',
    bf_4d: 'afbeelding/bosbrand/bosbrand_stadium3.png',
    bf_4e: 'afbeelding/bosbrand/bosbrand_stadium3.png',
    bf_5: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5f: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5b: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5c: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5d: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5g: 'afbeelding/algemeen/noodopvang.jpg',
    bf_6: 'afbeelding/bosbrand/bomen_afgebrand.png',
    bf_6b: 'afbeelding/bosbrand/bomen_afgebrand.png',
    bf_7: 'afbeelding/bosbrand/bomen_afgebrand.png',
    ov_0: 'afbeelding/overstroming/overstroming0_avond.png',
    ov_1: 'afbeelding/overstroming/overstroming1_hoogwater.png',
    ov_1b: 'afbeelding/overstroming/overstroming1_hoogwater.png',
    ov_2c: 'afbeelding/overstroming/overstroming2_overstroming.jpg',
    ov_1d: 'afbeelding/overstroming/overstroming2_overstroming.jpg',
    ov_2: 'afbeelding/overstroming/overstroming2_overstroming.jpg',
    ov_2b: 'afbeelding/overstroming/overstroming2_overstroming.jpg',
    ov_3: 'afbeelding/overstroming/overstroming3_overstroming.png',
    ov_3c: 'afbeelding/overstroming/overstroming3_overstroming.png',
    ov_4a: 'afbeelding/overstroming/overstroming3_overstroming.png',
    ov_4b: 'afbeelding/overstroming/auto_water.jpg',
    ov_4c: 'afbeelding/overstroming/overstroming3_overstroming.png',
    ov_5: 'afbeelding/overstroming/overstroming4_overstroming.png',
    ov_5b: 'afbeelding/overstroming/overstroming4_overstroming.png',
    ov_6f: 'afbeelding/overstroming/overstroming4_overstroming.png',
    ov_6: 'afbeelding/overstroming/reddingsboot.jpg',
    ov_6e: 'afbeelding/overstroming/reddingsboot.jpg',
    ov_6d: 'afbeelding/algemeen/noodopvang.jpg',
    ov_6b: 'afbeelding/algemeen/noodopvang.jpg',
    ov_6c: 'afbeelding/algemeen/noodopvang.jpg',
    ov_6g: 'afbeelding/overstroming/overstroming4_overstroming.png',
    ov_7: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_7b: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_7c: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_8: 'afbeelding/overstroming/overstroming5_naderhand.png',
    // Stroomstoring — voor storing
    st_pre_d2: 'afbeelding/stroomstoring/huis_winter0.png',
    st_pre_d1: 'afbeelding/stroomstoring/huis_winter0.png',
    st_d0_morgen: 'afbeelding/stroomstoring/huis_winter0.png',
    st_2: 'afbeelding/stroomstoring/huis_winter0.png',
    // Stroomstoring — Dag 1 (storing gestart)
    st_1: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_3: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_4: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_5: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_6: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_6b: 'afbeelding/stroomstoring/Huis_winter1.png',
    // Stroomstoring — Dag 2 (meer sneeuw)
    st_7: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_8: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_8b: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_d1_morgen: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_9: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_autolaad: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_watertruck: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_10a: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_10: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_d1_avond: 'afbeelding/stroomstoring/Huis_winter2.png',
    // Stroomstoring — Dag 3/4 (meeste sneeuw)
    st_d2_morgen: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_12: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_d2_avond: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_d3_morgen: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_13: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_14: 'afbeelding/stroomstoring/Huis_winter3.png',
    // Stroomstoring — speciale locaties
    st_4b: 'afbeelding/algemeen/supermarkt.jpg',
    st_11: 'afbeelding/stroomstoring/Huis_winter2.png',
    tk_1: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_2: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_2b: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_3b: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_3: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4a: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4b: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4c: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4d: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4e: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_5: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_5m: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_5b: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_6: 'afbeelding/stroomstoring/Huis_winter1.png',
    // Drinkwater
    wd_0: 'afbeelding/algemeen/huis_normaal.png',
    wd_1: 'afbeelding/algemeen/huis_normaal.png',
    wd_2: 'afbeelding/algemeen/huis_normaal.png',
    wd_3: 'afbeelding/algemeen/huis_normaal.png',
    wd_4: 'afbeelding/algemeen/huis_normaal.png',
    wd_5: 'afbeelding/algemeen/huis_normaal.png',
    wd_6: 'afbeelding/algemeen/huis_normaal.png',
    wd_7: 'afbeelding/algemeen/huis_normaal.png',
    // Nachtalarm
    na_0: 'afbeelding/brandalarm/Rook_hal.png',
    na_1: 'afbeelding/brandalarm/Rook_hal.png',
    na_2: 'afbeelding/brandalarm/rook_woonkamer.png',
    na_2b: 'afbeelding/brandalarm/Rook_hal.png',
    na_3: 'afbeelding/brandalarm/Rook_uitgang.png',
    na_4: 'afbeelding/brandalarm/Rook_uitgang.png',
    na_5: 'afbeelding/brandalarm/Rook_uitgang.png',
  };
  // Gebruik de standaard achtergrond als er geen specifieke afbeelding is voor deze scène
  const bgImg = bodyBgMap[scene.id] || 'afbeelding/algemeen/huis_normaal.png';
  document.body.style.backgroundImage = `url('${bgImg}')`;

  // Situatie-overlays — opacity per scène (0 = uit)
  // Hoe verder de brand/overstroming vordert, hoe hoger de opacity van de overlay
  const fireOpacity = {
    bf_2: 0.30,
    bf_2b: 0.35,
    bf_3: 0.40,
    bf_3b: 0.45,
    bf_4: 0.50,
    bf_4b: 0.50,
    bf_4c: 0.55,
    bf_4d: 0.55,
  };
  const rainOpacity = {
    ov_1: 0.20,
    ov_1b: 0.25,
    ov_2: 0.35,
    ov_2b: 0.35,
    ov_3: 0.45,
    ov_4a: 0.50,
    ov_4b: 0.50,
    ov_5: 0.55,
    ov_5b: 0.55,
    ov_6: 0.40,
    ov_6b: 0.25,
  };

  // Toont of verbergt een overlay-element met een vloeiende CSS-overgang.
  // Bij opacity > 0 wordt het element eerst zichtbaar gemaakt (display:block),
  // dan na een korte vertraging gefaded in. Bij 0 wordt het gefaded out en
  // daarna verborgen.
  function applyOverlay(el, opacity) {
    if (!el) return;
    if (opacity > 0) {
      el.style.display = 'block';
      setTimeout(() => {
        el.style.opacity = String(opacity);
      }, 50); // korte vertraging zodat de CSS-transitie op display:block kan starten
    } else {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.display = 'none';
      }, 1200); // wacht tot de fade-out klaar is voordat het element verborgen wordt
    }
  }

  applyOverlay(document.getElementById('fire-overlay'), fireOpacity[scene.id] || 0);
  applyOverlay(document.getElementById('rain-overlay'), rainOpacity[scene.id] || 0);

  // Brightness overlay based on time of day and scenario
  const darknessOverride = {};
  const darkness = document.getElementById('bg-darkness');
  if (darkness) {
    // Haal het uur op uit het tijdstip van de scène (standaard: 12:00 = overdag)
    const [h] = (scene.time || '12:00').split(':').map(Number);
    let bg, opacity;
    if (scene.id in darknessOverride) {
      // Handmatige overschrijving voor specifieke scènes
      bg = '#000';
      opacity = darknessOverride[scene.id];
    } else if (h >= 22 || h < 6) {
      // Nacht: bijna volledig donker
      bg = '#000';
      opacity = 0.88;
    } else if (h < 9 || h >= 18) {
      // Schemering (ochtend of avond): gedeeltelijk donker
      bg = '#000';
      opacity = 0.68;
    } else {
      // Overdag: geen duisternis-overlay
      bg = '#000';
      opacity = 0;
    }
    darkness.style.background = bg;
    darkness.style.opacity = opacity;
  }
}

/* ─── SCENARIO ENGINE ─────────────────────────────────────────────────────────
   Globale toestandsvariabelen die de voortgang van het actieve scenario bijhouden.
*/
let currentSceneIdx = 0; // index van de huidige zichtbare scène
let activeTab = 'buiten'; // actief tabblad in de kanalen-sectie
let radioUnlocked = false; // wordt true zodra een scène radio-inhoud heeft
const stateSnapshots = []; // opgeslagen staat per scène-index (voor terugnavigatie)
let pendingChoiceMade = false; // true zodra een geldige keuze gemaakt is (niet bij fail)
const historySnapshots = []; // opgeslagen keuzegeschiedenislengte per scène-index

// Channel history logs for < > scrollback
const newsLog = []; // [{sceneIdx, time, dayBadge, items:[...]}]
const waLog = []; // [{sceneIdx, time, dayBadge, items:[...], nlalert}]
let newsPage = 0; // 0 = most recent batch
let waPage = 0;
const newsLoggedIdxs = new Set(); // bijgehouden scène-indexes die al naar newsLog zijn geschreven
const waLoggedIdxs = new Set(); // bijgehouden scène-indexes die al naar waLog zijn geschreven

/* ─── TYPEWRITER ──────────────────────────────────────────────────────────────
   Toont tekst karakter voor karakter met een instelbaar interval.
   Biedt ook een skip()-methode om de animatie meteen te voltooien,
   en een ingebouwde timer voor automatisch doorgaan na het typen.
*/
const Typewriter = {
  _interval: null,  // setInterval-referentie voor het typeanimatie-interval
  _skipFn: null,    // functie om de animatie direct te voltooien
  _advance: null,   // pending auto-advance timer after typing is done

  // Start de typewriter-animatie: schrijft 'text' karakter voor karakter
  // naar 'targetEl' en roept 'onDone' aan zodra de tekst volledig is.
  run(text, targetEl, onDone) {
    this.cancel();
    let i = 0;
    const panel = document.getElementById('panel-buiten');
    // Sla de skip-functie op zodat de gebruiker de animatie kan overslaan
    this._skipFn = () => {
      this.cancel();
      targetEl.textContent = text;
      if (onDone) onDone();
    };
    this._interval = setInterval(() => {
      targetEl.textContent += text[i++];
      // Scroll het paneel mee zodat de nieuwste tekst altijd zichtbaar is
      if (panel) panel.scrollTop = panel.scrollHeight;
      if (i >= text.length) {
        // Alle karakters zijn getypt: stop het interval en roep de callback aan
        this.cancel();
        if (onDone) onDone();
      }
    }, 20); // 20ms per karakter ≈ 50 tekens per seconde
  },

  // Sla de typewriter-animatie over en toon de volledige tekst direct
  skip() {
    if (this._skipFn) this._skipFn();
  },
  // Geeft true terug als de animatie momenteel actief is
  isRunning() {
    return this._interval !== null;
  },

  // Stopt de typewriter-animatie en annuleert elke wachtende auto-advance timer
  cancel() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._advance) {
      clearTimeout(this._advance);
      this._advance = null;
    }
    this._skipFn = null;
  }
};

// Navigeert naar het woon-werkverkeer-vragenformulier voor het thuis_komen-scenario.
// Reset de eerder gekozen reisopties voordat het formulier opnieuw wordt gerenderd.
function gotoCommuteQs() {
  profile.commuteMode = '';
  profile.commuteDistance = '';
  renderCommuteQ();
  show('s-commute');
}

// Bouwt het woon-werkverkeer-vragenformulier op op basis van de commuteQs-array.
// Genereert kaartknoppen voor elk antwoord en markeert de huidige selectie.
function renderCommuteQ() {
  document.getElementById('commute-prog').style.transform = 'scaleX(0.50)';
  const corner = document.getElementById('scene-id-corner');
  if (corner) corner.textContent = 'commute';
  // Schakel de 'Volgende'-knop pas in als beide vragen beantwoord zijn
  const checkNext = () => document.getElementById('commute-next').disabled = !(profile.commuteMode && profile.commuteDistance);
  let html = '';
  commuteQs.forEach(q => {
    html += `<h2 style="margin:20px 0 10px">${q.q}</h2><div class="cards">`;
    q.opts.forEach(o => {
      const sel = profile[q.id] === o.val ? ' selected' : '';
      html += `<button class="choice-card${sel}" data-qid="${q.id}" data-val="${o.val}" onclick="commutePick('${q.id}','${o.val}')">
        <div class="icon">${o.icon}</div><div>${o.label}</div></button>`;
    });
    html += '</div>';
  });
  document.getElementById('commute-body').innerHTML = html;
  document.getElementById('commute-next').disabled = !(profile.commuteMode && profile.commuteDistance);
}

// Slaat de keuze van de speler op voor een woon-werkverkeervraag en
// werkt de visuele selectiestatus van de knoppen bij.
function commutePick(id, val) {
  profile[id] = val;
  // Markeer de geselecteerde kaart en deseleer de rest voor hetzelfde vraag-ID
  document.querySelectorAll(`#commute-body .choice-card[data-qid="${id}"]`).forEach(c =>
    c.classList.toggle('selected', c.dataset.val === val)
  );
  document.getElementById('commute-next').disabled = !(profile.commuteMode && profile.commuteDistance);
}

// Start het thuis_komen-scenario zodra de woon-werkverkeersvragen zijn beantwoord.
function commuteNext() {
  startScenario('thuis_komen');
}

// Gaat terug naar het scenariokeuze-scherm vanuit het woon-werkverkeer-formulier.
function commutePrev() {
  show('s-scenariokeuze');
}

/* ─── SCENARIO STARTEN ────────────────────────────────────────────────────────
   Initialiseert een nieuw scenario: kiest de juiste scène-array en decay-tabel,
   reset alle spelstatus-vlaggen, verwerkt de profielinstellingen van de speler
   (water/eten/cash/powerbank) en rendert de eerste scène.
*/
function startScenario(scenarioId) {
  // Verwijder eventuele lopende tick-timers van een eerder scenario
  if (typeof clearAllTicks === 'function') clearAllTicks();
  // Als thuis_komen wordt gekozen maar de reismodus nog niet is ingevuld,
  // stuur de speler eerst naar het woon-werkverkeer-formulier
  if (scenarioId === 'thuis_komen' && !profile.commuteMode) {
    currentScenario = 'thuis_komen';
    gotoCommuteQs();
    return;
  }
  currentScenario = scenarioId || 'stroom';

  // Set scenes and decay for selected scenario
  if (currentScenario === 'stroom') {
    scenes = scenes_stroom;
    sceneDecay = sceneDecay_stroom;
  } else if (currentScenario === 'natuurbrand') {
    scenes = scenes_natuurbrand;
    sceneDecay = sceneDecay_natuurbrand;
  } else if (currentScenario === 'overstroming') {
    scenes = scenes_overstroming;
    sceneDecay = sceneDecay_overstroming;
  } else if (currentScenario === 'thuis_komen') {
    scenes = scenes_thuis_komen;
    sceneDecay = sceneDecay_thuis_komen;
  } else if (currentScenario === 'drinkwater') {
    scenes = scenes_drinkwater;
    sceneDecay = sceneDecay_drinkwater;
  } else if (currentScenario === 'nachtalarm') {
    scenes = scenes_nachtalarm;
    sceneDecay = sceneDecay_nachtalarm;
  }

  // Reset all scenario-specific state flags
  state.evacuated = false;
  state.packedBag = false;
  state.madeFirebreak = false;
  state.bfTravelMode = '';
  state.returnedHome = false;
  state.tookPets = false;
  state.kidsEvacuated = false;
  state.wentUpstairs = null;
  state.evacuatedFlood = false;
  state.carMovedHigher = false;
  state.savedItems = false;
  state.calledRescue = false;
  state.kidsWithYou = false;
  state.sentKidsToSchool = false;
  state.cutElectricity = false;
  state.travelMode = profile.commuteMode || 'car';
  state.reachedHome = false;
  state.foundAlternative = false;
  state.helpedStranger = false;
  state.kidsPickedUp = false;
  state.kidsArranged = false;
  state.kidsNoodpakket = false;
  state.kidsKeptHome = false;
  state.hadEDCBag = profile.hasEDCBag;

  // Merge profile prep answers into state
  if (profile.hasCash === 'ja') state.hasCash = true;
  if (profile.hasFlashlight === 'ja') state.hasFlashlight = true;
  if (profile.hasWater === 'ja') state.hasWater = true;

  // Initialize survival stats from profile
  state.water = profile.hasWater === 'ja' ? 5 : 1; // speler met watervoorraad start met vol water
  state.food = (profile.hasKit === 'ja' || profile.hasExtraFood) ? 5 : 2; // noodpakket geeft vol voedsel
  state.comfort = 5;
  state.health = 5;
  // Bij thuis_komen ben je onderweg: alleen zakgeld + reistasje, noodpakket is thuis
  const homeCash = currentScenario === 'thuis_komen' ? 0 : (profile.hasCash === 'ja' ? 100 : 0);
  // Startbedrag: basisbedrag + eventueel contant geld thuis + EDC-tas bonusgeld
  state.cash = 20 + homeCash + (profile.hasEDCBag === 'ja' ? 100 : 0);
  state.powerbank = profile.hasPowerbank === 'ja' ? 5 : 0;
  state.phoneBattery = 80; // telefoon start op 80% batterij
  state.hasCampingStove = false;
  state.knowsNeighbors = false;
  state.evacuatedEarly = false;
  state.warnedKevin = false;
  state.sealedHome = false;
  state.contactedAns = false;
  state.takingAns = false;
  state.day2Started = false;
  state.tookAlarmSeriously = false;
  state.warnedHousemates = false;
  state.didntUseWaterOnFire = false;
  state.evacuatedFire = false;
  state.called112PreExit = false;
  state.called112 = false;
  state.stayedOutside = false;
  state.delayedEvacuation = false;
  state.travelingWithMartijn = false;
  state.followedOfficialAdvice = false;

  // Reset scène-index en alle kanaal- en geschiedenisbuffers
  currentSceneIdx = 0;
  channels.news = [];
  channels.whatsapp = [];
  channels.alerts = [];
  channels.radio = [];
  choiceHistory.length = 0;
  radioUnlocked = false;
  stateSnapshots.length = 0;
  historySnapshots.length = 0;
  newsLog.length = 0;
  waLog.length = 0;
  newsPage = 0;
  waPage = 0;
  newsLoggedIdxs.clear();
  waLoggedIdxs.clear();
  show('s-scenario');
  renderScene();
}

/* ─── OPSLAAN / LADEN ─────────────────────────────────────────────────────────
   Slaat de volledige spelstatus op in localStorage en laadt deze terug.
   Bij laden wordt de correcte scène-array hersteld en worden alle kanaallogboeken
   opnieuw opgebouwd zodat renderScene geen dubbele vermeldingen toevoegt.
*/

// Slaat de huidige spelstatus op in localStorage onder de SAVE_KEY-sleutel.
// Geeft feedback aan de speler via showGearFeedback().
function saveGame() {
  const data = {
    version: 1,
    savedAt: Date.now(),
    currentScenario,
    currentSceneIdx,
    state: { ...state },
    profile: { ...profile },
    choiceHistory: [...choiceHistory],
    newsLog: [...newsLog],
    waLog: [...waLog],
    radioUnlocked,
    activeTab,
    adultsCount,
    childrenCount,
    slechtTerBeenCount,
    petsCount,
    selectedHouseType,
    selectedVehicles: [...selectedVehicles],
    selectedEnvironment: [...selectedEnvironment],
    avatarSelections: JSON.parse(JSON.stringify(avatarSelections))
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    if (typeof showGearFeedback === 'function') showGearFeedback('✓ Voortgang opgeslagen');
  } catch(e) {
    if (typeof showGearFeedback === 'function') showGearFeedback('Opslaan mislukt');
  }
}

// Laadt een eerder opgeslagen spelstatus uit localStorage.
// Als er geen opgeslagen spel is, doet de functie niets.
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const d = JSON.parse(raw);

  // Herstel state en profiel
  Object.assign(state, d.state);
  Object.assign(profile, d.profile);

  // Herstel scenario + scenes
  currentScenario = d.currentScenario;
  if (currentScenario === 'stroom')          { scenes = scenes_stroom;       sceneDecay = sceneDecay_stroom; }
  else if (currentScenario === 'natuurbrand') { scenes = scenes_natuurbrand;   sceneDecay = sceneDecay_natuurbrand; }
  else if (currentScenario === 'overstroming'){ scenes = scenes_overstroming;  sceneDecay = sceneDecay_overstroming; }
  else if (currentScenario === 'thuis_komen') { scenes = scenes_thuis_komen;   sceneDecay = sceneDecay_thuis_komen; }
  else if (currentScenario === 'drinkwater')  { scenes = scenes_drinkwater;    sceneDecay = sceneDecay_drinkwater; }
  else if (currentScenario === 'nachtalarm')  { scenes = scenes_nachtalarm;    sceneDecay = sceneDecay_nachtalarm; }
  currentSceneIdx = d.currentSceneIdx;

  // Herstel geschiedenis
  choiceHistory.splice(0, Infinity, ...d.choiceHistory);
  newsLog.splice(0, Infinity, ...d.newsLog);
  waLog.splice(0, Infinity, ...d.waLog);
  radioUnlocked = d.radioUnlocked;
  activeTab = d.activeTab || 'buiten';

  // Markeer al gelogde scenes zodat renderScene ze niet opnieuw toevoegt
  stateSnapshots.length = 0;
  historySnapshots.length = 0;
  newsLoggedIdxs.clear();
  waLoggedIdxs.clear();
  // Vul de Set met alle scène-indexes die al zijn opgeslagen in de logs
  newsLog.forEach(e => newsLoggedIdxs.add(e.sceneIdx));
  waLog.forEach(e => waLoggedIdxs.add(e.sceneIdx));
  channels.news = [];
  channels.whatsapp = [];
  channels.alerts = [];
  channels.radio = [];
  newsPage = 0;
  waPage = 0;

  // Herstel huishoudensvariabelen voor portret-fallback
  adultsCount = d.adultsCount || 1;
  childrenCount = d.childrenCount || 0;
  slechtTerBeenCount = d.slechtTerBeenCount || 0;
  petsCount = d.petsCount || 0;
  selectedHouseType = d.selectedHouseType || null;
  selectedVehicles.splice(0, Infinity, ...(d.selectedVehicles || []));
  selectedEnvironment.splice(0, Infinity, ...(d.selectedEnvironment || []));
  if (d.avatarSelections) Object.assign(avatarSelections, d.avatarSelections);

  show('s-scenario');
  renderScene();
  renderStatusBars();
  // Herstel actieve tab na render
  if (d.activeTab && typeof switchTab === 'function') switchTab(d.activeTab);
}

// Geeft een gefilterde lijst van scènes terug waarbij alle scènes met een
// niet-voldane conditie (conditionalOn) worden weggelaten.
function getActiveScenes() {
  return scenes.filter(s => !s.conditionalOn || s.conditionalOn());
}

// Voegt de 'has-unread'-klasse toe aan een kanaaltab om een ongelezen-indicator
// te tonen. Synchroniseert de animatiefase zodat alle tabs gelijk knipperen.
// Doet niets als de tab al actief is.
function markUnread(name) {
  const tab = document.getElementById('tab-' + name) || (name === 'radio' ? document.getElementById('radio-tab') : null);
  if (!tab || tab.classList.contains('active')) return;
  // Sync all tabs to the same point in the 1s animation cycle
  const phase = (Date.now() % 1000) / 1000;
  tab.style.animationDelay = `-${phase.toFixed(3)}s`;
  tab.classList.add('has-unread');
}

/* ─── SCÈNE RENDEREN ──────────────────────────────────────────────────────────
   Hoofdfunctie die de volledige UI bijwerkt voor de huidige scène:
   - Annuleert de typewriter en wist ongelezen-indicatoren
   - Past scène-verval (decay) toe op statistieken
   - Rendert achtergrond, verhaaltekst, kanaalinhoud en keuzeknopen
   - Triggert NL-Alert-overlay en omgevingsgeluid
*/
function renderScene() {
  Typewriter.cancel();
  pendingChoiceMade = false; // reset bij elke nieuwe scène
  // Wis alle unread-stipjes van de vorige scene
  document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('has-unread'));
  // Fade-in nieuwe scene
  const _zones = document.querySelector('.scenario-zones');
  if (_zones) {
    _zones.style.opacity = '1';
  }

  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  if (!scene) {
    // Geen scènes meer: toon het eindrapport
    showReport();
    return;
  }

  // Save state snapshot for back navigation
  stateSnapshots[currentSceneIdx] = JSON.parse(JSON.stringify(state));
  historySnapshots[currentSceneIdx] = choiceHistory.length;

  // Apply scene decay (automatic stat reductions)
  const decay = sceneDecay[scene.id];
  if (decay) {
    Object.keys(decay).forEach(k => {
      // Vliegtuigmodus: telefoonbatterij daalt niet door verval
      if (k === 'phoneBattery' && state.airplaneMode) return;
      const max = k === 'phoneBattery' ? 100 : 5;
      // Pas de vervalwaarde toe maar houd de stat binnen het geldige bereik
      state[k] = Math.max(0, Math.min(max, state[k] + decay[k]));
    });
  }
  // Markeer dag 2 als gestart zodra de ochtend van dag 3 begint
  if (scene.id === 'st_d2_morgen') state.day2Started = true;
  // Penalty: no water or food causes health and comfort to drop
  if (state.water === 0) {
    state.ranOutOfWater = true;
    state.health = Math.max(0, state.health - 1);
    state.comfort = Math.max(0, state.comfort - 1);
  }
  if (state.food === 0) {
    state.ranOutOfFood = true;
    state.health = Math.max(0, state.health - 1);
    state.comfort = Math.max(0, state.comfort - 1);
  }
  renderStatusBars();

  // Clear all unread dots — only re-add below for this scene's new content
  ['news', 'whatsapp', 'radio'].forEach(t => {
    const tab = document.getElementById('tab-' + t);
    if (tab) tab.classList.remove('has-unread');
  });

  // Show/hide back button
  document.getElementById('btn-back').style.display = currentSceneIdx > 0 ? 'inline-block' : 'none';

  // Progress
  const _progEl = document.getElementById('sc-prog');
  // Breedte van de voortgangsbalk als breuk van het totaal aantal zichtbare scènes
  if (_progEl) _progEl.style.transform = 'scaleX(' + (currentSceneIdx / visibleScenes.length) + ')';

  // Scene indicator
  const badge = document.getElementById('day-badge');
  if (badge) badge.className = 'scene-day-badge' + (scene.dayBadgeClass ? ' ' + scene.dayBadgeClass : '');
  document.getElementById('sc-dayofweek').textContent = (scene.date || '').split(' ')[0].toLowerCase();
  document.getElementById('scene-id-corner').textContent = scene.id;

  // Typewriter tick — dag eerst, daarna tijd
  const timeEl = document.getElementById('sc-time');
  if (timeEl) timeEl.textContent = '';
  // Eerst het dagbadge animeren, daarna de tijd — opeenvolgend via callback
  if (badge && timeEl) tickTime(badge, scene.dayBadge, 'badge', () => tickTime(timeEl, scene.time, 'time'));

  // Stop any playing speech when navigating
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  updateRadioBtn(false);
  renderHouseholdIndicator();

  // Scene visual → buiten panel
  renderSceneVisual(scene);

  // Narrative — fade in new content
  const narrativeEl = document.getElementById('sc-narrative');
  if (narrativeEl) {
    narrativeEl.classList.remove('content-enter');
    narrativeEl.innerHTML = scene.narrative;
    void narrativeEl.offsetWidth; // force reflow so animation replays
    narrativeEl.classList.add('content-enter');
  }
  // Clear afterword
  const afterEl = document.getElementById('sc-afterword');
  if (afterEl) {
    afterEl.style.display = 'none';
    afterEl.innerHTML = '';
  }

  // Accumulate channel content (for state tracking)
  if (scene.channels.news && scene.channels.news.length) {
    scene.channels.news.forEach(n => channels.news.push(n));
  }
  if (scene.channels.whatsapp && scene.channels.whatsapp.length) {
    scene.channels.whatsapp.forEach(m => channels.whatsapp.push(m));
  }
  // Radio-inhoud alleen toevoegen als de speler een radio heeft
  if (scene.channels.radio && (profile.hasRadio || state.hasCarRadio)) {
    channels.radio.push({
      time: scene.time,
      text: scene.channels.radio
    });
    // Maak de radio-tab zichtbaar de eerste keer dat er radio-inhoud is
    if (!radioUnlocked) {
      radioUnlocked = true;
      document.getElementById('radio-tab').classList.remove('hidden-tab');
    }
  }

  // Always open on 'Wat je ervaart' tab at the start of each scene
  switchTab('buiten');

  // Render only current scene's new content
  renderChannels(scene);

  // Mark unread dots for tabs with genuinely new content this scene
  setTimeout(() => {
    if (scene.channels.news && scene.channels.news.length) markUnread('news');
    if (scene.channels.nlalert) {
      markUnread('whatsapp');
      playMessagePing(); // geluidssignaal voor binnenkomend NL-Alert
    }
    if (scene.channels.radio && (profile.hasRadio || state.hasCarRadio)) markUnread('radio');
    // Active tab never needs a dot
    document.getElementById('tab-' + activeTab)?.classList.remove('has-unread');
  }, 200); // kleine vertraging zodat de tab zeker al actief is

  // Reset next-row animation so it re-fires each scene
  const nextRow = document.getElementById('sc-next-row');
  if (nextRow) nextRow.style.animation = 'none';

  // Render choices or just a "verder" button
  renderChoices(scene);

  // Trigger NL-Alert overlay
  if (scene.channels.nlalert) {
    setTimeout(() => {
      triggerAlert(scene.channels.nlalert);
    }, 400); // korte vertraging zodat de scène-transitie eerst afgerond is
  }

  // Ambient audio
  Ambience.resumeForScene(scene.id);

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ─── KANAALGESCHIEDENISNAVIGATIE ─────────────────────────────────────────────
   Functies voor het bladeren door eerdere nieuws- en berichten via
   de < > knoppen in de kanaalheader. Elk scenario-moment wordt als één 'pagina'
   in het log opgeslagen.
*/

// Rendert de huidige nieuwspagina op basis van newsPage (0 = meest recent).
// Berichten worden omgekeerd weergegeven (nieuwste bovenaan).
function renderNewsPage() {
  // Bereken de logindex: pagina 0 = laatste item, pagina 1 = één na laatste, enz.
  const pageIdx = newsLog.length - 1 - newsPage;
  const page = newsLog[Math.max(0, pageIdx)];
  let html = '';
  if (!page || page.items.length === 0) {
    html = '<p class="ch-empty">Nog geen nieuwsberichten.</p>';
  } else {
    // Keer de volgorde om zodat het meest recente bericht bovenaan staat
    [...page.items].reverse().forEach(n => {
      html += `<div class="news-item">
        <div class="news-time">${n.time}</div>
        <div class="news-content">
          <div class="news-headline">${n.headline}</div>
          <div class="news-body">${n.body}</div>
        </div>
      </div>`;
    });
  }
  document.getElementById('news-content').innerHTML = html;
  updateChannelNav('news');
}

// Rendert een berichtenpagina: toont eerst een eventueel NL-Alert,
// daarna de berichten (nieuwste bovenaan). Maakt onderscheid tussen
// inkomende en uitgaande berichten.
function renderWaPage(page) {
  const waEl = document.getElementById('wa-content');
  let html = '';
  // Toon NL-Alert bovenaan als deze aan de pagina is gekoppeld
  if (page && page.nlalert) {
    const alertLines = page.nlalert.split('\n');
    const alertTime = alertLines[1] || '';
    const alertBody = alertLines.slice(2).join('\n').trim();
    html += `<div class="alert-card wa-alert-card">
      <div class="alert-header">🚨 NL-Alert${alertTime ? ' · ' + alertTime : ''}</div>
      <div class="alert-body">${alertBody}</div>
    </div>`;
  }
  if (page && page.items.length > 0) {
    [...page.items].reverse().forEach(m => {
      const isOut = m.outgoing; // uitgaand bericht van de speler zelf
      html += `<div class="wa-msg ${isOut ? 'outgoing' : 'incoming'}">
        ${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>
      </div>`;
    });
  }
  if (!html) html = '<p class="ch-empty">Nog geen berichten.</p>';
  waEl.innerHTML = html;
}

// Werkt de navigatiecontroles (ouder/nieuwer knoppen + paginaLabel) bij
// voor het opgegeven kanaaltype ('news' of 'wa').
// Verbergt de navigatie als er slechts één pagina is of als de telefoon leeg is.
function updateChannelNav(type) {
  const log = type === 'news' ? newsLog : waLog;
  const page = type === 'news' ? newsPage : waPage;
  const nav = document.getElementById(type + '-nav');
  const olderBtn = document.getElementById(type + '-nav-older');
  const newerBtn = document.getElementById(type + '-nav-newer');
  const label = document.getElementById(type + '-nav-label');
  if (!nav) return;
  const phoneDead = state.phoneBattery === 0;
  // Geen navigatie nodig als er maar één pagina is of de telefoon leeg is
  if (log.length <= 1 || phoneDead) {
    nav.style.display = 'none';
    return;
  }
  nav.style.display = 'flex';
  olderBtn.disabled = page >= log.length - 1; // al op de oudste pagina
  newerBtn.disabled = page === 0; // al op de meest recente pagina
  const entry = log[log.length - 1 - page];
  // Label toont 'Actueel' voor de nieuwste pagina, anders datum+tijd
  label.textContent = page === 0 ?
    `Actueel · ${entry.time}` :
    `${entry.dayBadge ? entry.dayBadge + ' · ' : ''}${entry.time}`;
}

// Navigeert naar een oudere of nieuwere pagina in het nieuws- of berichtkanaal.
// Doet niets als de telefoonbatterij leeg is.
function navChannel(type, goOlder) {
  if (state.phoneBattery === 0) return;
  if (type === 'news') {
    // Verhoog de paginateller voor ouder, verlaag voor nieuwer (begrensd)
    newsPage = goOlder ?
      Math.min(newsLog.length - 1, newsPage + 1) :
      Math.max(0, newsPage - 1);
    renderNewsPage();
  } else {
    waPage = goOlder ?
      Math.min(waLog.length - 1, waPage + 1) :
      Math.max(0, waPage - 1);
    renderWaPage(waLog[waLog.length - 1 - waPage] || null);
    updateChannelNav('wa');
  }
}

// ──────────────────────────────────────────────────────────────────────────────

/* ─── KANALEN RENDEREN ────────────────────────────────────────────────────────
   Werkt alle drie de kanalen (nieuws, berichten/NL-Alert en radio) bij voor de
   huidige scène. Berichten worden direct getoond zonder stagger-animatie.
   Nieuwe inhoud wordt ook gelogd voor scrollback-navigatie, maar nooit dubbel.
*/
function renderChannels(scene) {
  const sc = scene ? scene.channels : {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  };

  // NEWS — log and render via page system
  const newNews = sc.news || [];
  newsPage = 0; // reset naar meest recente pagina bij elke nieuwe scène
  if (newNews.length > 0 && !newsLoggedIdxs.has(currentSceneIdx)) {
    // Log de nieuwsberichten van deze scène slechts één keer
    newsLoggedIdxs.add(currentSceneIdx);
    newsLog.push({
      sceneIdx: currentSceneIdx,
      time: scene.time,
      dayBadge: scene.dayBadge || '',
      items: newNews
    });
  }
  renderNewsPage();

  // WHATSAPP + NL-ALERT
  const newWa = sc.whatsapp || [];
  const curNlalert = sc.nlalert || null;

  // Log voor scrollback (volledige lijst, ongeacht stagger)
  waPage = 0; // reset naar meest recente pagina
  if (!waLoggedIdxs.has(currentSceneIdx)) {
    waLoggedIdxs.add(currentSceneIdx);
    // Sla alleen op als er daadwerkelijk inhoud is
    if (newWa.length > 0 || curNlalert) {
      waLog.push({
        sceneIdx: currentSceneIdx,
        time: scene.time,
        dayBadge: scene.dayBadge || '',
        items: newWa,
        nlalert: curNlalert
      });
    }
  }

  // Initial wa-content: NL-Alert meteen tonen (of lege placeholder)
  let waInitHtml = '';
  if (curNlalert) {
    // Splits het NL-Alert-bericht op regels: regel 0 = type, regel 1 = tijdstip, rest = inhoud
    const alertLines = curNlalert.split('\n');
    const alertTime = alertLines[1] || '';
    const alertBody = alertLines.slice(2).join('\n').trim();
    waInitHtml += `<div class="alert-card wa-alert-card">
      <div class="alert-header">🚨 NL-Alert${alertTime ? ' · ' + alertTime : ''}</div>
      <div class="alert-body">${alertBody}</div>
    </div>`;
  }
  if (newWa.length === 0 && !curNlalert) {
    waInitHtml = '<p class="ch-empty">Nog geen berichten.</p>';
  }
  document.getElementById('wa-content').innerHTML = waInitHtml;

  // Berichten direct tonen, gelijk met nieuws en radio
  if (newWa.length > 0) {
    const waContainer = document.getElementById('wa-content');
    // Keer de volgorde om zodat het nieuwste bericht onderaan staat (chat-stijl)
    [...newWa].reverse().forEach(m => {
      const isOut = m.outgoing;
      const div = document.createElement('div');
      div.className = `wa-msg ${isOut ? 'outgoing' : 'incoming'}`;
      div.innerHTML = `${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>`;
      // Verwijder de 'geen berichten'-placeholder als die er nog staat
      const placeholder = waContainer.querySelector('p');
      if (placeholder) placeholder.remove();
      waContainer.appendChild(div);
    });
    markUnread('whatsapp');
    playMessagePing();
    if (activeTab === 'whatsapp') {
      // Als de berichtentab al actief is, hoeft er geen ongelezen-indicator te zijn
      document.getElementById('tab-whatsapp')?.classList.remove('has-unread');
    }
  }

  updateChannelNav('wa');

  // RADIO — show only this scene's new radio message
  const radioBtn = document.getElementById('radio-play-btn');
  if ((profile.hasRadio || state.hasCarRadio) && sc.radio) {
    // Toon de frequentie afhankelijk van het type radio dat de speler heeft
    document.getElementById('radio-freq').textContent = '98.9 FM • Radio 1';
    document.getElementById('radio-content').style.color = '#cbd5e1';
    document.getElementById('radio-content').innerHTML = sc.radio;
    currentRadioText = sc.radio;
    if (radioBtn) radioBtn.style.display = 'block';
  } else if (radioUnlocked) {
    // Radio is ooit vrijgespeeld maar heeft in deze scène geen nieuwe uitzending
    document.getElementById('radio-content').innerHTML = '<p class="ch-empty">Geen uitzending ontvangen.</p>';
    currentRadioText = '';
    if (radioBtn) radioBtn.style.display = 'none';
  }
}

/* ─── KEUZES RENDEREN ─────────────────────────────────────────────────────────
   Bouwt de keuzeknopen op voor de huidige scène. Filtert conditionele keuzes
   en sorteert op categorie (actie → sociaal → voorraden → info/neutraal).
   Voegt ook animatievertraging per knop toe voor een stagger-effect.
*/
function renderChoices(scene) {
  const wrap = document.getElementById('sc-choices');
  const _conseqEl = document.getElementById('sc-consequence');
  if (_conseqEl) _conseqEl.classList.remove('show');
  if (!scene.choices) {
    // Geen keuzes: leeg de container (scène heeft alleen een 'Verder'-knop)
    if (wrap) wrap.innerHTML = '';
    return;
  }
  if (!wrap) return;
  // Volgorde van keuze-categorieën: lagere waarde = eerder getoond
  const catOrder = {
    'cat-action': 0,
    'cat-risk': 0,
    'cat-social': 1,
    'cat-supply': 2,
    'cat-info': 3,
    'cat-neutral': 3
  };
  let html = '';
  let btnIdx = 0;
  const visibleChoices = scene.choices
    .map((c, i) => ({
      c,
      i
    }))
    // Filter weg keuzes waarvan de conditie niet vervuld is
    .filter(({
      c
    }) => !c.conditionalOn || c.conditionalOn())
    // Sorteer op categorie zodat de meest urgente keuzes bovenaan staan
    .sort((a, b) => {
      const ta = a.c.cat || parseChoiceIcon(typeof a.c.text === 'function' ? a.c.text() : a.c.text).cat;
      const tb = b.c.cat || parseChoiceIcon(typeof b.c.text === 'function' ? b.c.text() : b.c.text).cat;
      return (catOrder[ta] ?? 3) - (catOrder[tb] ?? 3);
    });
  visibleChoices.forEach(({
    c,
    i
  }) => {
    const txt = typeof c.text === 'function' ? c.text() : c.text;
    const parsed = parseChoiceIcon(txt);
    const icon = parsed.icon;
    const cat = c.cat || parsed.cat;
    const label = parsed.label;
    // Stagger de animatie per knop: elke knop 55ms later zichtbaar
    const delay = btnIdx * 55;
    // Gebruik het SVG-icoon als het beschikbaar is, anders lege string
    const iconSvg = (typeof ICON_SVG !== 'undefined' && ICON_SVG[icon]) ? ICON_SVG[icon] : '';
    html += `<button class="choice-btn ${cat}" id="cbtn-${i}" onclick="pickChoice(${i})" style="animation:contentFade 260ms var(--ease-out) ${delay}ms both"><span class="choice-icon" aria-hidden="true">${iconSvg}</span><span>${label}</span></button>`;
    btnIdx++;
  });
  wrap.innerHTML = html;
}

/* ─── CHOICE ICON MAP ──────────────────────────────────────────────────────────
   Koppelt het emoji-icoon aan het begin van een keuzeTekst aan:
     • icon  — naam van het SVG-icoon (zie icons-data.js)
     • cat   — kleurcategorie van de keuzeknop:
         cat-action  (blauw)  — actie of maatregel die de speler neemt
         cat-supply  (oranje) — iets verzamelen, inslaan of bevoorraden
         cat-social  (groen)  — sociale keuze, buren/familie helpen of overleggen
         cat-info    (grijs)  — nieuws volgen, afwachten of niets doen
         cat-risk    (rood)   — risicovolle of gevaarlijke actie
         cat-neutral (grijs)  — neutraal / past niet in andere categorieën
   Let op: multi-emoji sleutels moeten vóór enkelvoudige staan (longest-first).
*/
const CHOICE_ICON_MAP = {
  // Multi-emoji (longest first to avoid partial match)
  '💬👴🎒': {
    icon: 'message-circle',
    cat: 'cat-social'
  },
  '👀': {
    icon: 'eye',
    cat: 'cat-action'
  },
  '⚡🛁📱': {
    icon: 'zap',
    cat: 'cat-risk'
  },
  '⚡📸🪟': {
    icon: 'zap',
    cat: 'cat-risk'
  },
  '🛑🗣️': {
    icon: 'octagon-alert',
    cat: 'cat-risk'
  },
  '⚡💧': {
    icon: 'zap',
    cat: 'cat-risk'
  },
  '⚡🪟': {
    icon: 'zap',
    cat: 'cat-risk'
  },
  // Info / lezen
  '💡': {
    icon: 'lightbulb',
    cat: 'cat-info'
  },
  '📱': {
    icon: 'smartphone',
    cat: 'cat-info'
  },
  '📺': {
    icon: 'tv',
    cat: 'cat-info'
  },
  '📻': {
    icon: 'radio',
    cat: 'cat-info'
  },
  '📰': {
    icon: 'newspaper',
    cat: 'cat-info'
  },
  '📋': {
    icon: 'clipboard',
    cat: 'cat-info'
  },
  '📄': {
    icon: 'file-text',
    cat: 'cat-info'
  },
  '🔭': {
    icon: 'eye',
    cat: 'cat-info'
  },
  '👁️': {
    icon: 'eye',
    cat: 'cat-info'
  },
  '🌡️': {
    icon: 'thermometer',
    cat: 'cat-info'
  },
  // Sociaal / communicatie
  '💬': {
    icon: 'message-circle',
    cat: 'cat-social'
  },
  '📞': {
    icon: 'phone',
    cat: 'cat-social'
  },
  '🤝': {
    icon: 'handshake',
    cat: 'cat-social'
  },
  '👥': {
    icon: 'users',
    cat: 'cat-social'
  },
  '👴': {
    icon: 'user',
    cat: 'cat-social'
  },
  '👵': {
    icon: 'user',
    cat: 'cat-social'
  },
  '🗣️': {
    icon: 'mic',
    cat: 'cat-social'
  },
  '🏘️': {
    icon: 'house',
    cat: 'cat-social'
  },
  // Voorraden
  '💵': {
    icon: 'banknote',
    cat: 'cat-supply'
  },
  '💶': {
    icon: 'banknote',
    cat: 'cat-supply'
  },
  '💧': {
    icon: 'droplets',
    cat: 'cat-supply'
  },
  '🍶': {
    icon: 'droplets',
    cat: 'cat-supply'
  },
  '🍞': {
    icon: 'wheat',
    cat: 'cat-supply'
  },
  '🥫': {
    icon: 'utensils',
    cat: 'cat-action'
  },
  '🍲': {
    icon: 'utensils',
    cat: 'cat-action'
  },
  '🥘': {
    icon: 'utensils',
    cat: 'cat-action'
  },
  '🍽️': {
    icon: 'utensils',
    cat: 'cat-action'
  },
  '🥄': {
    icon: 'utensils',
    cat: 'cat-supply'
  },
  '🛒': {
    icon: 'shopping-cart',
    cat: 'cat-supply'
  },
  '📦': {
    icon: 'package',
    cat: 'cat-supply'
  },
  '🎒': {
    icon: 'backpack',
    cat: 'cat-supply'
  },
  '💊': {
    icon: 'pill',
    cat: 'cat-supply'
  },
  '🧰': {
    icon: 'wrench',
    cat: 'cat-supply'
  },
  '🕯️': {
    icon: 'flame',
    cat: 'cat-action'
  },
  // Actie / beweging
  '🚗': {
    icon: 'car',
    cat: 'cat-action'
  },
  '🚲': {
    icon: 'bike',
    cat: 'cat-action'
  },
  '🚴': {
    icon: 'bike',
    cat: 'cat-action'
  },
  '🚶': {
    icon: 'footprints',
    cat: 'cat-action'
  },
  '🏃': {
    icon: 'arrow-right',
    cat: 'cat-action'
  },
  '🚌': {
    icon: 'bus',
    cat: 'cat-action'
  },
  '🚂': {
    icon: 'train',
    cat: 'cat-action'
  },
  '🏠': {
    icon: 'house',
    cat: 'cat-action'
  },
  '🛤️': {
    icon: 'footprints',
    cat: 'cat-action'
  },
  '🔀': {
    icon: 'shuffle',
    cat: 'cat-action'
  },
  '📢': {
    icon: 'megaphone',
    cat: 'cat-social'
  },
  '🏡': {
    icon: 'house',
    cat: 'cat-action'
  },
  '🏢': {
    icon: 'building-2',
    cat: 'cat-action'
  },
  '🔦': {
    icon: 'zap',
    cat: 'cat-action'
  },
  '🔌': {
    icon: 'plug',
    cat: 'cat-action'
  },
  '🔋': {
    icon: 'battery-medium',
    cat: 'cat-supply'
  },
  '🔒': {
    icon: 'lock',
    cat: 'cat-action'
  },
  '🚪': {
    icon: 'door-open',
    cat: 'cat-action'
  },
  '🚫': {
    icon: 'ban',
    cat: 'cat-action'
  },
  '🏕️': {
    icon: 'tent',
    cat: 'cat-action'
  },
  '🌳': {
    icon: 'tree-pine',
    cat: 'cat-action'
  },
  '🪣': {
    icon: 'droplets',
    cat: 'cat-action'
  },
  '🚽': {
    icon: 'x-circle',
    cat: 'cat-action'
  },
  '🛁': {
    icon: 'droplets',
    cat: 'cat-action'
  },
  '🧺': {
    icon: 'wind',
    cat: 'cat-action'
  },
  '🍳': {
    icon: 'flame',
    cat: 'cat-action'
  },
  '⚡': {
    icon: 'zap',
    cat: 'cat-risk'
  },
  // Risico / spanning
  '⚠️': {
    icon: 'triangle-alert',
    cat: 'cat-risk'
  },
  '🛑': {
    icon: 'octagon-alert',
    cat: 'cat-risk'
  },
  '🔥': {
    icon: 'flame',
    cat: 'cat-risk'
  },
  '🌊': {
    icon: 'waves',
    cat: 'cat-risk'
  },
  '👊': {
    icon: 'shield-alert',
    cat: 'cat-risk'
  },
  // Neutraal / overig
  '☕': {
    icon: 'coffee',
    cat: 'cat-neutral'
  },
  '🤷': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '🙈': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '😌': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '😔': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '😶': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '😴': {
    icon: 'moon',
    cat: 'cat-neutral'
  },
  '😤': {
    icon: 'x-circle',
    cat: 'cat-neutral'
  },
  '😰': {
    icon: 'alert-circle',
    cat: 'cat-neutral'
  },
  '🔍': {
    icon: 'eye',
    cat: 'cat-info'
  },
  '🔑': {
    icon: 'lock',
    cat: 'cat-action'
  },
  '🧒': {
    icon: 'user',
    cat: 'cat-social'
  },
  '🦽': {
    icon: 'footprints',
    cat: 'cat-social'
  },
  '✅': {
    icon: 'award',
    cat: 'cat-action'
  },
  '🛌': {
    icon: 'moon',
    cat: 'cat-neutral'
  },
  '🎲': {
    icon: 'gamepad-2',
    cat: 'cat-social'
  },
  '⏳': {
    icon: 'hourglass',
    cat: 'cat-neutral'
  },
  '📵': {
    icon: 'phone-off',
    cat: 'cat-neutral'
  },
  '🩺': {
    icon: 'stethoscope',
    cat: 'cat-social'
  },
  '🐕': {
    icon: 'paw-print',
    cat: 'cat-neutral'
  },
  '🐈': {
    icon: 'paw-print',
    cat: 'cat-neutral'
  },
  // Overstroming / ontbrekend
  '🪟': {
    icon: 'app-window',
    cat: 'cat-action'
  },
  '🆘': {
    icon: 'alert-circle',
    cat: 'cat-risk'
  },
  '🧯': {
    icon: 'flame',
    cat: 'cat-action'
  },
  '🚤': {
    icon: 'ship',
    cat: 'cat-action'
  },
  '🔔': {
    icon: 'bell',
    cat: 'cat-social'
  },
  '🧸': {
    icon: 'heart',
    cat: 'cat-social'
  },
  '🏅': {
    icon: 'award',
    cat: 'cat-neutral'
  },
  '🧘': {
    icon: 'heart',
    cat: 'cat-neutral'
  },
  '🫂': {
    icon: 'heart',
    cat: 'cat-social'
  },
  '🎮': {
    icon: 'gamepad-2',
    cat: 'cat-social'
  },
  '🍫': {
    icon: 'utensils',
    cat: 'cat-supply'
  },
  '🏫': {
    icon: 'building-2',
    cat: 'cat-action'
  },
};

// Zoekt het emoji-icoon aan het begin van een keuzeTekst op in CHOICE_ICON_MAP
// en geeft het bijbehorende icoon, de categorie en de resterende labeltekst terug.
// Multi-emoji sleutels worden eerst gecontroleerd (langste eerst) om gedeeltelijke
// overeenkomsten te voorkomen.
function parseChoiceIcon(text) {
  // Check multi-char emoji keys first (longest first)
  const keys = Object.keys(CHOICE_ICON_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (text.startsWith(key)) {
      const {
        icon,
        cat
      } = CHOICE_ICON_MAP[key];
      return {
        icon,
        cat,
        label: text.slice(key.length).trimStart() // verwijder het emoji-prefix uit het label
      };
    }
  }
  // Geen overeenkomst gevonden: gebruik het neutrale standaardicoon
  return {
    icon: 'circle',
    cat: 'cat-neutral',
    label: text
  };
}

/* ─── KEUZE VERWERKEN ─────────────────────────────────────────────────────────
   Verwerkt de keuze van de speler: past de spelstatus aan, toont zwevende
   delta-indicators bij de statistieken, schrijft de keuze naar de geschiedenis
   en toont de consequentietekst via de typewriter. Daarna wordt automatisch
   naar de volgende scène gegaan.
*/
function pickChoice(idx) {
  const btn = document.getElementById('cbtn-' + idx);
  if (btn.classList.contains('picked')) return; // prevent double-picking same choice

  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  const choice = scene.choices[idx];

  // Check fail condition (bijv. onvoldoende cash)
  if (choice.failCondition && choice.failCondition()) {
    const failText = typeof choice.failConsequence === 'function'
      ? choice.failConsequence()
      : (choice.failConsequence || 'Je kunt deze keuze nu niet maken.');
    switchTab('buiten');
    const failNarrativeEl = document.getElementById('sc-narrative');
    if (!failNarrativeEl) return;
    failNarrativeEl.innerHTML = '';
    const failSpan = document.createElement('span');
    failSpan.className = 'consequence-inline';
    failNarrativeEl.appendChild(failSpan);
    Typewriter.run(failText, failSpan, null);
    return; // stop hier — geen lock, geen stateChange, geen advance
  }

  // Vergrendel alle keuzes zodra er één is gekozen
  document.querySelectorAll('#sc-choices .choice-btn').forEach(b => { b.disabled = true; });
  btn.classList.add('picked');
  pendingChoiceMade = true;

  // Snapshot state before changes for delta calculation
  const statsBefore = {
    water: state.water,
    food: state.food,
    comfort: state.comfort,
    health: state.health,
    phoneBattery: state.phoneBattery,
    cash: state.cash
  };

  // Apply state changes (stateChange may be a function or object)
  const rawSc = typeof choice.stateChange === 'function' ? choice.stateChange() : choice.stateChange;
  const sc = rawSc || {};
  const STAT_KEYS = new Set(['water', 'food', 'comfort', 'health']);
  // Sleutels waarvoor de waarde als delta (verschil) wordt toegepast
  const DELTA_KEYS = new Set(['water', 'food', 'comfort', 'health', 'cash', 'phoneBattery']);
  Object.keys(sc).forEach(k => {
    if (k === 'awarenessLevel') {
      // awarenessLevel kan alleen omhoog gaan, nooit omlaag
      state[k] = Math.max(state[k], sc[k]);
    } else if (DELTA_KEYS.has(k)) {
      // Begrens de statwaarde tot het geldige bereik [0, max]
      const max = k === 'cash' ? 9999 : k === 'phoneBattery' ? 100 : 5;
      state[k] = Math.max(0, Math.min(max, state[k] + sc[k]));
    } else if (Array.isArray(sc[k])) {
      // Kopieer arrays om referentieproblemen te vermijden
      state[k] = sc[k].slice();
    } else {
      // Directe toewijzing voor booleaanse vlaggen en overige waarden
      state[k] = sc[k];
    }
  });
  if (state.water === 0) state.ranOutOfWater = true;
  if (state.food === 0) state.ranOutOfFood = true;
  renderStatusBars();

  // Floating stat delta indicators
  const statAnchorMap = {
    water: 'ss-water',
    food: 'ss-food',
    comfort: 'ss-comfort',
    phoneBattery: 'batt-phone-fill',
    cash: 'ss-cash-amount'
  };
  // Batch reads before writes to avoid layout thrashing
  // Bereken alle delta's en hun schermposities voordat er iets naar de DOM wordt geschreven
  const deltaItems = Object.keys(statsBefore).map(k => {
    const delta = state[k] - statsBefore[k];
    if (delta === 0) return null; // geen wijziging: geen indicator nodig
    const anchor = document.getElementById(statAnchorMap[k]);
    if (!anchor) return null;
    return {
      delta,
      rect: anchor.getBoundingClientRect() // lees positie eenmalig (batch read)
    };
  }).filter(Boolean);
  deltaItems.forEach(({
    delta,
    rect
  }) => {
    const span = document.createElement('span');
    span.className = 'stat-delta';
    // Toon '+' voor positieve delta, '−' voor negatieve (gebruik min-teken, geen koppelteken)
    span.textContent = (delta > 0 ? '+' : '−') + Math.abs(delta);
    span.style.color = delta > 0 ? '#22c55e' : '#ef4444'; // groen voor winst, rood voor verlies
    // Centreer de indicator boven het ankerelement
    span.style.left = (rect.left + rect.width / 2 - 12) + 'px';
    span.style.top = (rect.top - 4) + 'px';
    document.body.appendChild(span);
    // Verwijder de indicator na de CSS-animatieduur (1,1 seconde)
    setTimeout(() => span.remove(), 1100);
  });

  // Record choice history
  choiceHistory.push({
    sceneId: scene.id,
    time: scene.time,
    date: scene.date,
    dayBadge: scene.dayBadge,
    choiceText: typeof choice.text === 'function' ? choice.text() : choice.text
  });

  // Toon consequence in 'wat je ervaart'-tab met typewriter-effect
  const consequenceText = typeof choice.consequence === 'function' ? choice.consequence() : choice.consequence;
  switchTab('buiten');
  const narrativeEl = document.getElementById('sc-narrative');
  if (!narrativeEl) return;
  narrativeEl.innerHTML = ''; // wis de scene-tekst
  const twSpan = document.createElement('span');
  twSpan.className = 'consequence-inline';
  narrativeEl.appendChild(twSpan);

  // Toon de consequentie met typewriter-effect; speler klikt zelf op "Verder →" om door te gaan
  Typewriter.run(consequenceText, twSpan, null);

  // Show afterword if this scene has one (e.g. st_14 epilogue)
  if (scene.afterword) {
    const afterEl = document.getElementById('sc-afterword');
    afterEl.innerHTML = scene.afterword;
    afterEl.style.display = 'block';
  }
}

/* ─── SCÈNE VOORUITGAAN ───────────────────────────────────────────────────────
   Gaat naar de volgende scène. Als de typewriter nog bezig is, wordt hij
   eerst overgeslagen. De overgang bevat een korte fade-out van de scène-zones.
*/
function advanceScene() {
  if (!pendingChoiceMade) {
    Typewriter.skip(); // toon fail-tekst direct als typewriter nog loopt
    return;            // maar ga niet verder naar volgende scène
  }
  if (Typewriter.isRunning()) {
    Typewriter.skip(); // toon tekst direct, wacht op volgende klik
    return;
  }
  Typewriter.cancel();
  const _zones = document.querySelector('.scenario-zones');
  if (_zones) {
    // Fade-out voor de overgang naar de volgende scène
    _zones.style.opacity = '0';
    setTimeout(() => {
      currentSceneIdx++;
      renderScene();
    }, 320); // wacht tot de fade-out afgerond is
  } else {
    currentSceneIdx++;
    renderScene();
  }
}

// Navigeert één scène terug en herstelt de spelstatus en keuzegeschiedenis
// naar de toestand vóór die scène.
function goBack() {
  if (currentSceneIdx === 0) return;
  currentSceneIdx--;
  // Restore state and history to before this scene was entered
  const snap = stateSnapshots[currentSceneIdx];
  if (snap) Object.keys(snap).forEach(k => {
    // Kopieer arrays om gedeelde referenties te vermijden
    state[k] = Array.isArray(snap[k]) ? snap[k].slice() : snap[k];
  });
  const histLen = historySnapshots[currentSceneIdx];
  if (histLen !== undefined) choiceHistory.length = histLen;
  renderScene();
}

/* ─── TAB WISSELEN ────────────────────────────────────────────────────────────
   Activeert het opgegeven kanaaltabblad en het bijbehorende paneel.
   Verwijdert de ongelezen-indicator van het geactiveerde tabblad.
   Start of stopt de radiospeler afhankelijk van welk tabblad actief wordt.
*/
function switchTab(tab) {
  activeTab = tab;
  // Clear unread dot for this tab
  const tabEl = document.getElementById('tab-' + tab) || document.getElementById('radio-tab');
  const resolvedTabEl = document.getElementById('tab-' + tab) || (tab === 'radio' ? document.getElementById('radio-tab') : null);
  if (resolvedTabEl) resolvedTabEl.classList.remove('has-unread');

  // Deactiveer alle tabs en panelen
  document.querySelectorAll('.ch-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.channel-panel').forEach(p => p.classList.remove('active'));

  // Koppelt tabnamen aan paneel-ID's
  const panelMap = {
    buiten: 'panel-buiten',
    news: 'panel-news',
    whatsapp: 'panel-whatsapp',
    radio: 'panel-radio'
  };
  if (resolvedTabEl) {
    resolvedTabEl.classList.add('active');
    resolvedTabEl.setAttribute('aria-selected', 'true');
  }
  document.getElementById(panelMap[tab]).classList.add('active');

  if (tab === 'radio') {
    // Start het afspelen van de radiostream als de radiotab wordt geopend
    const visibleScenes = getActiveScenes();
    const scene = visibleScenes[currentSceneIdx];
    if (scene && scene.channels && scene.channels.radio) RadioPlayer.playForScene(scene.id);
  } else {
    // Stop de radiospeler zodra een ander tabblad wordt geopend
    RadioPlayer.stop();
  }
}
