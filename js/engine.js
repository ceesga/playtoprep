// ═══════════════════════════════════════════════════════════════
// Engine — Kern game-logica
// Bevat: sceneVisuals (achtergronden), startScenario, renderScene,
//        pickChoice, advanceScene, renderChoices, updateStatDisplay,
//        updateSidebar, applySceneDecay, switchTab, navChannel,
//        commuteNext/Prev
// ═══════════════════════════════════════════════════════════════

// ─── SCENE VISUALS ───────────────────────────────────────────────────────────
const sceneVisuals = {
  st_d0_morgen: {
    seed: 'suburb-morning-calm',
    label: 'Dag 0 · 08:00',
    title: 'Vóór de storing'
  },
  st_1: {
    seed: 'city-street-daylight',
    label: 'Dag 0 · 11:30',
    title: 'Eerste stroomstoring'
  },
  st_2: {
    seed: 'flicker-lights-house',
    label: 'Dag 0 · 11:57',
    title: 'Stroom even terug'
  },
  st_3: {
    seed: 'dramatic-storm-europe',
    label: 'Dag 0 · 12:20',
    title: 'Heel Europa zonder stroom'
  },
  st_4: {
    seed: 'supermarket-long-queue',
    label: 'Dag 0 · 13:30',
    title: 'Winkels sluiten'
  },
  st_4b: {
    seed: 'supermarket-empty-shelves',
    label: 'Dag 0 · 14:00',
    title: 'Bij de supermarkt'
  },
  st_5: {
    seed: 'dark-warning-street',
    label: 'Dag 0 · 14:00',
    title: 'Kan dagenlang duren'
  },
  st_6: {
    seed: 'dark-home-candle-warm',
    label: 'Dag 0 · 18:00',
    title: 'Koken zonder stroom'
  },
  st_6b: {
    seed: 'candle-blanket-dark-room',
    label: 'Dag 0 · 19:30',
    title: 'De eerste avond'
  },
  st_7: {
    seed: 'night-dark-cold-street',
    label: 'Dag 1 · 02:30',
    title: 'Inbraak in de buurt'
  },
  st_8: {
    seed: 'emergency-neighbor-help',
    label: 'Dag 1 · 05:30',
    title: 'Buurvrouw heeft hulp nodig'
  },
  st_9: {
    seed: 'pipes-water-basement',
    label: 'Dag 1 · 08:30',
    title: 'Riolering valt uit'
  },
  st_d1_morgen: {
    seed: 'frost-winter-dawn-house',
    label: 'Dag 1 · 08:00',
    title: 'Eerste crisisochtend'
  },
  st_watertruck: {
    seed: 'water-truck-queue-street',
    label: 'Dag 1 · 10:30',
    title: 'Watertruck bij de supermarkt'
  },
  st_10: {
    seed: 'empty-street-curfew-night',
    label: 'Dag 1 · 14:30',
    title: 'Avondklok ingesteld'
  },
  st_d1_avond: {
    seed: 'cold-dark-kitchen-evening',
    label: 'Dag 1 · 18:00',
    title: 'Koken zonder stroom'
  },
  st_11: {
    seed: 'car-fire-night-dramatic',
    label: 'Dag 2 · 01:30',
    title: 'Explosie op straat'
  },
  st_d2_morgen: {
    seed: 'burnt-car-cold-morning',
    label: 'Dag 2 · 08:00',
    title: 'Tweede crisisochtend'
  },
  st_12: {
    seed: 'neighborhood-flyer-door',
    label: 'Dag 2 · 11:30',
    title: 'Gemeente deelt flyers uit'
  },

  st_d2_avond: {
    seed: 'candle-sparse-meal-dark',
    label: 'Dag 2 · 18:00',
    title: 'Derde avond'
  },
  st_d3_morgen: {
    seed: 'hopeful-winter-morning',
    label: 'Dag 3 · 08:00',
    title: 'Derde ochtend vol hoop'
  },
  st_13: {
    seed: 'food-distribution-queue',
    label: 'Dag 3 · 10:15',
    title: 'Voedseluitdeling'
  },
  st_14: {
    seed: 'lights-on-relief-home',
    label: 'Dag 3 · 12:45',
    title: 'Stroom terug!'
  },
  // Bosbrand
  bf_0: {
    seed: '',
    label: 'Dag 0 · 22:00',
    title: 'De avond ervoor'
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
  bf_3: {
    seed: '',
    label: 'Dag 1 · 11:30',
    title: 'Evacuatiebevel'
  },
  bf_3b: {
    seed: '',
    label: 'Dag 1 · 11:45',
    title: 'Kinderen op school'
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
  bf_5: {
    seed: '',
    label: 'Dag 1 · 13:30',
    title: 'Opvanglocatie'
  },
  bf_5a: {
    seed: '',
    label: 'Dag 1 · 14:00',
    title: 'Kinderen zoeken op de opvang'
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
  bf_6: {
    seed: '',
    label: 'Dag 2 · 09:00',
    title: 'Sein veilig?'
  },
  bf_7: {
    seed: '',
    label: 'Dag 2 · 11:00',
    title: 'Schade beoordelen'
  },
  // Overstroming
  ov_0: {
    seed: '',
    label: 'Dag 0 · 20:00',
    title: 'De avond ervoor'
  },
  ov_1: {
    seed: '',
    label: 'Dag 1 · 07:00',
    title: 'Hoogwaterwaarschuwing'
  },
  ov_1b: {
    seed: '',
    label: 'Dag 1 · 07:30',
    title: 'Kinderen naar school?'
  },
  ov_2: {
    seed: '',
    label: 'Dag 1 · 09:30',
    title: 'Water stijgt'
  },
  ov_2b: {
    seed: '',
    label: 'Dag 1 · 09:45',
    title: 'School sluit'
  },
  ov_3: {
    seed: '',
    label: 'Dag 1 · 10:30',
    title: 'Evacuatiebevel'
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
  ov_6c: {
    seed: '',
    label: 'Dag 1 · 17:00',
    title: 'Opvanglocatie'
  },
  ov_6d: {
    seed: '',
    label: 'Dag 1 · 22:00',
    title: 'Nacht op de opvang'
  },
  ov_6b: {
    seed: '',
    label: 'Dag 1 · 21:00',
    title: 'Nacht boven'
  },
  ov_7: {
    seed: '',
    label: 'Dag 2 · 08:00',
    title: 'Water zakt'
  },
  ov_7b: {
    seed: '',
    label: 'Dag 2 · 09:00',
    title: 'Buurvrouw Ans'
  },
  ov_8: {
    seed: '',
    label: 'Dag 2 · 10:30',
    title: 'Huis betreden'
  },
  // Thuis komen
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
  tk_5b: {
    seed: '',
    label: 'Onderweg · 20:00',
    title: 'Overnachten onderweg'
  },
  tk_6: {
    seed: '',
    label: 'Thuis · 18:00',
    title: 'Thuiskomst'
  },
  tk_7: {
    seed: '',
    label: 'Thuis · 21:00',
    title: 'Eerste nacht thuis'
  },
};

function renderStatusBars() {
  // Helper: update a set of segments in both sidebar and mobile bar
  function updateSegs(segId, msbSegId, wrapId, msbStatId, val) {
    // Sidebar icon units
    const icons = document.querySelectorAll('#' + segId + ' .ss-icon-unit');
    icons.forEach((icon, i) => {
      icon.classList.remove('empty', 'warn', 'danger');
      if (i >= val) {
        icon.classList.add('empty');
      } else if (val <= 1) {
        icon.classList.add('danger');
      } else if (val <= 2) {
        icon.classList.add('warn');
      }
    });
    const wrap = document.getElementById(wrapId);
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
  updateSegs('stat-water', 'msb-seg-water', 'ss-water', 'msb-water', state.water);
  updateSegs('stat-food', 'msb-seg-food', 'ss-food', 'msb-food', state.food);
  updateSegs('stat-comfort', 'msb-seg-comfort', 'ss-comfort', 'msb-comfort', state.comfort);
  // state.health wordt bijgehouden maar niet getoond in de UI
  // Left sidebar — batteries
  updateBattery('batt-phone-fill', 'batt-phone-pct', 'batt-phone-empty', state.phoneBattery);
  // Cash
  const cashEl = document.getElementById('ss-cash-amount');
  if (cashEl) cashEl.textContent = '€' + state.cash;
  // Mobile bar — battery + cash
  const mBatt = document.getElementById('msb-battery');
  if (mBatt) mBatt.textContent = state.phoneBattery + '%';
  const mCash = document.getElementById('msb-cash');
  if (mCash) mCash.textContent = '€' + state.cash;
  // Vehicles
  const carEl = document.getElementById('veh-car');
  const bikeEl = document.getElementById('veh-bike');
  let showCar, showBike;
  if (currentScenario === 'thuis_komen') {
    showCar = profile.commuteMode === 'car';
    showBike = profile.commuteMode === 'bike';
  } else {
    showCar = profile.hasCar;
    showBike = profile.hasBike;
  }
  if (carEl) carEl.classList.toggle('ss-veh-dim', !showCar);
  if (bikeEl) bikeEl.classList.toggle('ss-veh-dim', !showBike);
}

function updateBattery(fillId, pctId, emptyId, val) {
  const body = document.getElementById(fillId);
  const pctEl = document.getElementById(pctId);
  if (!body) return;
  const pct = Math.round(val / 10) * 10;
  const filledBars = Math.round(pct / 20); // 0–5 bars
  const color = pct >= 80 ? 'var(--c-battery-full)' : pct >= 60 ? 'var(--c-battery-mid)' : pct >= 40 ? 'var(--c-battery-low)' : 'var(--c-battery-empty)';
  body.querySelectorAll('.batt-bar').forEach((bar, i) => {
    bar.style.backgroundColor = i < filledBars ? color : '';
  });
  if (pctEl) pctEl.textContent = pct + '%';
}

function renderSceneVisual(scene) {
  // Update page background per scene
  const bodyBgMap = {
    bf_0: 'afbeelding/bosbrand/geen_bosbrand.png',
    bf_1: 'afbeelding/bosbrand/bosbrand_stadium1.jpg',
    bf_2: 'afbeelding/bosbrand/bosbrand_stadium1.jpg',
    bf_2b: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_3: 'afbeelding/bosbrand/bosbrand_stadium2.png',
    bf_3b: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4b: 'afbeelding/bosbrand/bosbrand_stadium2b.png',
    bf_4c: 'afbeelding/bosbrand/bosbrand_stadium3.png',
    bf_4d: 'afbeelding/bosbrand/bosbrand_stadium3.png',
    bf_5: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5a: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5b: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5c: 'afbeelding/algemeen/noodopvang.jpg',
    bf_5d: 'afbeelding/algemeen/noodopvang.jpg',
    bf_6: 'afbeelding/bosbrand/bomen_afgebrand.png',
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
    ov_7: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_7b: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_7c: 'afbeelding/overstroming/overstroming5_naderhand.png',
    ov_8: 'afbeelding/overstroming/overstroming5_naderhand.png',
    // Stroomstoring — voor storing
    st_pre_d2: 'afbeelding/stroomstoring/huis_winter0.png',
    st_pre_d1: 'afbeelding/stroomstoring/huis_winter0.png',
    st_d0_morgen: 'afbeelding/stroomstoring/huis_winter0.png',
    st_2: 'afbeelding/stroomstoring/huis_winter0.png',
    // Stroomstoring — Dag 0 (storing gestart)
    st_1: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_3: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_4: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_5: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_6: 'afbeelding/stroomstoring/Huis_winter1.png',
    st_6b: 'afbeelding/stroomstoring/Huis_winter1.png',
    // Stroomstoring — Dag 1 (meer sneeuw)
    st_7: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_8: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_8b: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_d1_morgen: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_9: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_watertruck: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_10: 'afbeelding/stroomstoring/Huis_winter2.png',
    st_d1_avond: 'afbeelding/stroomstoring/Huis_winter2.png',
    // Stroomstoring — Dag 2/3 (meeste sneeuw)
    st_d2_morgen: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_12: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_d2_avond: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_d3_morgen: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_13: 'afbeelding/stroomstoring/Huis_winter3.png',
    st_14: 'afbeelding/stroomstoring/Huis_winter3.png',
    // Stroomstoring — speciale locaties
    st_4b: 'afbeelding/algemeen/supermarkt.jpg',
    st_11: 'afbeelding/stroomstoring/brandende_auto.jpg',
    tk_1: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_2: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_2b: 'afbeelding/stroomstoring_onderweg/kantoor.png',
    tk_3: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4a: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4b: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4c: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4d: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_4e: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_5: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
    tk_5b: 'afbeelding/stroomstoring_onderweg/stroomstoring_onderweg.png',
  };
  const bgImg = bodyBgMap[scene.id] || 'afbeelding/algemeen/huis_normaal.png';
  document.body.style.backgroundImage = `url('${bgImg}')`;

  // Situatie-overlays — opacity per scène (0 = uit)
  const fireOpacity = {
    bf_1: 0.20,
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

  function applyOverlay(el, opacity) {
    if (!el) return;
    if (opacity > 0) {
      el.style.display = 'block';
      setTimeout(() => {
        el.style.opacity = String(opacity);
      }, 50);
    } else {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.display = 'none';
      }, 1200);
    }
  }

  applyOverlay(document.getElementById('fire-overlay'), fireOpacity[scene.id] || 0);
  applyOverlay(document.getElementById('rain-overlay'), rainOpacity[scene.id] || 0);

  // Brightness overlay based on time of day and scenario
  const darknessOverride = {
    bf_0: 0.6 // zomeravond 22:00 — nog schemer, niet nacht
  };
  const darkness = document.getElementById('bg-darkness');
  if (darkness) {
    const [h] = (scene.time || '12:00').split(':').map(Number);
    let bg, opacity;
    if (scene.id in darknessOverride) {
      bg = '#000';
      opacity = darknessOverride[scene.id];
    } else if (h >= 22 || h < 6) {
      bg = '#000';
      opacity = 0.88;
    } else if (h < 9 || h >= 18) {
      bg = '#000';
      opacity = 0.68;
    } else {
      bg = '#000';
      opacity = 0;
    }
    darkness.style.background = bg;
    darkness.style.opacity = opacity;
  }
}

// ─── SCENARIO ENGINE ──────────────────────────────────────────────────────────
let currentSceneIdx = 0;
let activeTab = 'buiten';
let radioUnlocked = false;
const stateSnapshots = [];
const historySnapshots = [];

// Channel history logs for < > scrollback
const newsLog = []; // [{sceneIdx, time, dayBadge, items:[...]}]
const waLog = []; // [{sceneIdx, time, dayBadge, items:[...], nlalert}]
let newsPage = 0; // 0 = most recent batch
let waPage = 0;
const newsLoggedIdxs = new Set();
const waLoggedIdxs = new Set();

const Typewriter = {
  _interval: null,
  _skipFn: null,
  _advance: null, // pending auto-advance timer after typing is done

  run(text, targetEl, onDone) {
    this.cancel();
    let i = 0;
    const panel = document.getElementById('panel-buiten');
    this._skipFn = () => {
      this.cancel();
      targetEl.textContent = text;
      if (onDone) onDone();
    };
    this._interval = setInterval(() => {
      targetEl.textContent += text[i++];
      if (panel) panel.scrollTop = panel.scrollHeight;
      if (i >= text.length) {
        this.cancel();
        if (onDone) onDone();
      }
    }, 20);
  },

  skip() {
    if (this._skipFn) this._skipFn();
  },
  isRunning() {
    return this._interval !== null;
  },

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

function gotoCommuteQs() {
  profile.commuteMode = '';
  profile.commuteDistance = '';
  renderCommuteQ();
  show('s-commute');
}

function renderCommuteQ() {
  document.getElementById('commute-prog').style.transform = 'scaleX(0.50)';
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

function commutePick(id, val) {
  profile[id] = val;
  document.querySelectorAll(`#commute-body .choice-card[data-qid="${id}"]`).forEach(c =>
    c.classList.toggle('selected', c.dataset.val === val)
  );
  document.getElementById('commute-next').disabled = !(profile.commuteMode && profile.commuteDistance);
}

function commuteNext() {
  startScenario('thuis_komen');
}

function commutePrev() {
  show('s-scenariokeuze');
}

function startScenario(scenarioId) {
  if (typeof clearAllTicks === 'function') clearAllTicks();
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
  }

  // Reset all scenario-specific state flags
  state.evacuated = false;
  state.packedBag = false;
  state.bfTravelMode = '';
  state.returnedHome = false;
  state.tookPets = false;
  state.kidsEvacuated = false;
  state.wentUpstairs = null;
  state.evacuatedFlood = false;
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
  state.water = profile.hasWater === 'ja' ? 5 : 1;
  state.food = (profile.hasKit === 'ja' || profile.hasExtraFood) ? 5 : 2;
  state.comfort = 5;
  state.health = 5;
  // Bij thuis_komen ben je onderweg: alleen zakgeld + reistasje, noodpakket is thuis
  const homeCash = currentScenario === 'thuis_komen' ? 0 : (profile.hasCash === 'ja' ? 100 : 0);
  state.cash = 20 + homeCash + (profile.hasEDCBag === 'ja' ? 100 : 0);
  state.powerbank = profile.hasPowerbank === 'ja' ? 5 : 0;
  state.phoneBattery = 80;
  state.hasCampingStove = false;
  state.knowsNeighbors = false;
  state.evacuatedEarly = false;
  state.warnedKevin = false;
  state.sealedHome = false;
  state.contactedAns = false;
  state.takingAns = false;
  state.day2Started = false;

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

// ─── SAVE / LOAD ─────────────────────────────────────────────────────────────

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

function getActiveScenes() {
  return scenes.filter(s => !s.conditionalOn || s.conditionalOn());
}

function markUnread(name) {
  const tab = document.getElementById('tab-' + name) || (name === 'radio' ? document.getElementById('radio-tab') : null);
  if (!tab || tab.classList.contains('active')) return;
  // Sync all tabs to the same point in the 1s animation cycle
  const phase = (Date.now() % 1000) / 1000;
  tab.style.animationDelay = `-${phase.toFixed(3)}s`;
  tab.classList.add('has-unread');
}

function renderScene() {
  Typewriter.cancel();
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
      if (k === 'phoneBattery' && state.airplaneMode) return;
      const max = k === 'phoneBattery' ? 100 : 5;
      state[k] = Math.max(0, Math.min(max, state[k] + decay[k]));
    });
  }
  if (scene.id === 'st_d2_morgen') state.day2Started = true;
  // Penalty: no water or food causes health and comfort to drop
  if (state.water === 0) {
    state.health = Math.max(0, state.health - 1);
    state.comfort = Math.max(0, state.comfort - 1);
  }
  if (state.food === 0) {
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
  if (_progEl) _progEl.style.transform = 'scaleX(' + (currentSceneIdx / visibleScenes.length) + ')';

  // Scene indicator
  const badge = document.getElementById('day-badge');
  if (badge) badge.className = 'scene-day-badge' + (scene.dayBadgeClass ? ' ' + scene.dayBadgeClass : '');
  document.getElementById('sc-dayofweek').textContent = (scene.date || '').split(' ')[0].toLowerCase();
  document.getElementById('scene-id-corner').textContent = scene.id;

  // Typewriter tick — dag eerst, daarna tijd
  const timeEl = document.getElementById('sc-time');
  if (timeEl) timeEl.textContent = '';
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
  if (scene.channels.radio && (profile.hasRadio || state.hasCarRadio)) {
    channels.radio.push({
      time: scene.time,
      text: scene.channels.radio
    });
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
      playMessagePing();
    }
    if (scene.channels.radio && (profile.hasRadio || state.hasCarRadio)) markUnread('radio');
    // Active tab never needs a dot
    document.getElementById('tab-' + activeTab)?.classList.remove('has-unread');
  }, 200);

  // Reset next-row animation so it re-fires each scene
  const nextRow = document.getElementById('sc-next-row');
  if (nextRow) nextRow.style.animation = 'none';

  // Render choices or just a "verder" button
  renderChoices(scene);

  // Trigger NL-Alert overlay
  if (scene.channels.nlalert) {
    setTimeout(() => {
      triggerAlert(scene.channels.nlalert);
    }, 400);
  }

  // Ambient audio
  Ambience.resumeForScene(scene.id);

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ─── CHANNEL HISTORY NAVIGATION ───────────────────────────────────────────────

function renderNewsPage() {
  const pageIdx = newsLog.length - 1 - newsPage;
  const page = newsLog[Math.max(0, pageIdx)];
  let html = '';
  if (!page || page.items.length === 0) {
    html = '<p style="color:var(--c-muted-ui);font-size:.85rem;padding-top:4px">Geen nieuws.</p>';
  } else {
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

function renderWaPage(page) {
  const waEl = document.getElementById('wa-content');
  let html = '';
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
      const isOut = m.outgoing;
      html += `<div class="wa-msg ${isOut ? 'outgoing' : 'incoming'}">
        ${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>
      </div>`;
    });
  }
  if (!html) html = '<p style="color:var(--c-muted-ui);font-size:.85rem">Geen berichten.</p>';
  waEl.innerHTML = html;
}

function updateChannelNav(type) {
  const log = type === 'news' ? newsLog : waLog;
  const page = type === 'news' ? newsPage : waPage;
  const nav = document.getElementById(type + '-nav');
  const olderBtn = document.getElementById(type + '-nav-older');
  const newerBtn = document.getElementById(type + '-nav-newer');
  const label = document.getElementById(type + '-nav-label');
  if (!nav) return;
  const phoneDead = state.phoneBattery === 0;
  if (log.length <= 1 || phoneDead) {
    nav.style.display = 'none';
    return;
  }
  nav.style.display = 'flex';
  olderBtn.disabled = page >= log.length - 1;
  newerBtn.disabled = page === 0;
  const entry = log[log.length - 1 - page];
  label.textContent = page === 0 ?
    `Actueel · ${entry.time}` :
    `${entry.dayBadge ? entry.dayBadge + ' · ' : ''}${entry.time}`;
}

function navChannel(type, goOlder) {
  if (state.phoneBattery === 0) return;
  if (type === 'news') {
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

function renderChannels(scene) {
  const sc = scene ? scene.channels : {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  };

  // NEWS — log and render via page system
  const newNews = sc.news || [];
  newsPage = 0;
  if (newNews.length > 0 && !newsLoggedIdxs.has(currentSceneIdx)) {
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
  waPage = 0;
  if (!waLoggedIdxs.has(currentSceneIdx)) {
    waLoggedIdxs.add(currentSceneIdx);
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
    const alertLines = curNlalert.split('\n');
    const alertTime = alertLines[1] || '';
    const alertBody = alertLines.slice(2).join('\n').trim();
    waInitHtml += `<div class="alert-card wa-alert-card">
      <div class="alert-header">🚨 NL-Alert${alertTime ? ' · ' + alertTime : ''}</div>
      <div class="alert-body">${alertBody}</div>
    </div>`;
  }
  if (newWa.length === 0 && !curNlalert) {
    waInitHtml = '<p style="color:var(--c-muted-ui);font-size:.85rem">Geen nieuwe berichten.</p>';
  }
  document.getElementById('wa-content').innerHTML = waInitHtml;

  // Berichten direct tonen, gelijk met nieuws en radio
  if (newWa.length > 0) {
    const waContainer = document.getElementById('wa-content');
    [...newWa].reverse().forEach(m => {
      const isOut = m.outgoing;
      const div = document.createElement('div');
      div.className = `wa-msg ${isOut ? 'outgoing' : 'incoming'}`;
      div.innerHTML = `${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>`;
      const placeholder = waContainer.querySelector('p');
      if (placeholder) placeholder.remove();
      waContainer.appendChild(div);
    });
    markUnread('whatsapp');
    playMessagePing();
    if (activeTab === 'whatsapp') {
      document.getElementById('tab-whatsapp')?.classList.remove('has-unread');
    }
  }

  updateChannelNav('wa');

  // RADIO — show only this scene's new radio message
  const radioBtn = document.getElementById('radio-play-btn');
  if ((profile.hasRadio || state.hasCarRadio) && sc.radio) {
    document.getElementById('radio-freq').textContent = state.hasCarRadio && !profile.hasRadio ? 'Autoradio FM/AM' : '693 kHz AM ontvangst';
    document.getElementById('radio-content').style.color = '#cbd5e1';
    document.getElementById('radio-content').innerHTML =
      `<div style="font-size:.7rem;color:#4ade80;margin-bottom:6px">[${scene.time}]</div>${sc.radio}`;
    currentRadioText = sc.radio;
    if (radioBtn) radioBtn.style.display = 'block';
  } else if (radioUnlocked) {
    document.getElementById('radio-content').innerHTML = '<p style="color:var(--c-muted-ui);font-size:.85rem">Geen nieuwe uitzending.</p>';
    currentRadioText = '';
    if (radioBtn) radioBtn.style.display = 'none';
  }
}

function renderChoices(scene) {
  const wrap = document.getElementById('sc-choices');
  const _conseqEl = document.getElementById('sc-consequence');
  if (_conseqEl) _conseqEl.classList.remove('show');
  if (!scene.choices) {
    if (wrap) wrap.innerHTML = '';
    return;
  }
  if (!wrap) return;
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
    .filter(({
      c
    }) => !c.conditionalOn || c.conditionalOn())
    .sort((a, b) => {
      const ta = parseChoiceIcon(typeof a.c.text === 'function' ? a.c.text() : a.c.text).cat;
      const tb = parseChoiceIcon(typeof b.c.text === 'function' ? b.c.text() : b.c.text).cat;
      return (catOrder[ta] ?? 3) - (catOrder[tb] ?? 3);
    });
  visibleChoices.forEach(({
    c,
    i
  }) => {
    const txt = typeof c.text === 'function' ? c.text() : c.text;
    const {
      icon,
      cat,
      label
    } = parseChoiceIcon(txt);
    const delay = btnIdx * 55;
    const iconSvg = (typeof ICON_SVG !== 'undefined' && ICON_SVG[icon]) ? ICON_SVG[icon] : '';
    html += `<button class="choice-btn ${cat}" id="cbtn-${i}" onclick="pickChoice(${i})" style="animation:contentFade 260ms var(--ease-out) ${delay}ms both"><span class="choice-icon" aria-hidden="true">${iconSvg}</span><span>${label}</span></button>`;
    btnIdx++;
  });
  wrap.innerHTML = html;
}

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
    cat: 'cat-action'
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
    cat: 'cat-supply'
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
        label: text.slice(key.length).trimStart()
      };
    }
  }
  return {
    icon: 'circle',
    cat: 'cat-neutral',
    label: text
  };
}

function pickChoice(idx) {
  const btn = document.getElementById('cbtn-' + idx);
  if (btn.classList.contains('picked')) return; // prevent double-picking same choice

  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  const choice = scene.choices[idx];

  btn.classList.add('picked');
  btn.disabled = true;

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
  const DELTA_KEYS = new Set(['water', 'food', 'comfort', 'health', 'cash', 'phoneBattery']);
  Object.keys(sc).forEach(k => {
    if (k === 'awarenessLevel') {
      state[k] = Math.max(state[k], sc[k]);
    } else if (DELTA_KEYS.has(k)) {
      const max = k === 'cash' ? 9999 : k === 'phoneBattery' ? 100 : 5;
      state[k] = Math.max(0, Math.min(max, state[k] + sc[k]));
    } else if (Array.isArray(sc[k])) {
      state[k] = sc[k].slice();
    } else {
      state[k] = sc[k];
    }
  });
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
  const deltaItems = Object.keys(statsBefore).map(k => {
    const delta = state[k] - statsBefore[k];
    if (delta === 0) return null;
    const anchor = document.getElementById(statAnchorMap[k]);
    if (!anchor) return null;
    return {
      delta,
      rect: anchor.getBoundingClientRect()
    };
  }).filter(Boolean);
  deltaItems.forEach(({
    delta,
    rect
  }) => {
    const span = document.createElement('span');
    span.className = 'stat-delta';
    span.textContent = (delta > 0 ? '+' : '−') + Math.abs(delta);
    span.style.color = delta > 0 ? '#22c55e' : '#ef4444';
    span.style.left = (rect.left + rect.width / 2 - 12) + 'px';
    span.style.top = (rect.top - 4) + 'px';
    document.body.appendChild(span);
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

  // Na het typen: leesverlof (40ms per karakter, min. 2s), dan auto-advance
  const readDelay = Math.max(1200, consequenceText.length * 20);
  Typewriter.run(consequenceText, twSpan, () => {
    Typewriter._advance = setTimeout(() => advanceScene(), readDelay);
  });

  // Show afterword if this scene has one (e.g. st_14 epilogue)
  if (scene.afterword) {
    const afterEl = document.getElementById('sc-afterword');
    afterEl.innerHTML = scene.afterword;
    afterEl.style.display = 'block';
  }
}

function advanceScene() {
  if (Typewriter.isRunning()) {
    Typewriter.skip(); // toon tekst direct, wacht op volgende klik
    return;
  }
  Typewriter.cancel();
  const _zones = document.querySelector('.scenario-zones');
  if (_zones) {
    _zones.style.opacity = '0';
    setTimeout(() => {
      currentSceneIdx++;
      renderScene();
    }, 320);
  } else {
    currentSceneIdx++;
    renderScene();
  }
}

function goBack() {
  if (currentSceneIdx === 0) return;
  currentSceneIdx--;
  // Restore state and history to before this scene was entered
  const snap = stateSnapshots[currentSceneIdx];
  if (snap) Object.keys(snap).forEach(k => {
    state[k] = Array.isArray(snap[k]) ? snap[k].slice() : snap[k];
  });
  const histLen = historySnapshots[currentSceneIdx];
  if (histLen !== undefined) choiceHistory.length = histLen;
  renderScene();
}

function switchTab(tab) {
  activeTab = tab;
  // Clear unread dot for this tab
  const tabEl = document.getElementById('tab-' + tab) || document.getElementById('radio-tab');
  const resolvedTabEl = document.getElementById('tab-' + tab) || (tab === 'radio' ? document.getElementById('radio-tab') : null);
  if (resolvedTabEl) resolvedTabEl.classList.remove('has-unread');

  document.querySelectorAll('.ch-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.channel-panel').forEach(p => p.classList.remove('active'));

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
    const visibleScenes = getActiveScenes();
    const scene = visibleScenes[currentSceneIdx];
    if (scene && scene.channels && scene.channels.radio) RadioPlayer.playForScene(scene.id);
  } else {
    RadioPlayer.stop();
  }
}
