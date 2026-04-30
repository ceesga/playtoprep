// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Scene Renderer — Visuele statusbalken en scène-achtergronden
// Bevat: renderStatusBars, updateBattery,
//        applySceneOverlay, renderSceneVisual
// ═══════════════════════════════════════════════════════════════

/* ─── STATUSBALKEN WEERGAVE ────────────────────────────────────────────────────
   Werkt de visuele statusbalken bij in zowel de zijbalk als de mobiele balk
   onderaan het scherm. Verwerkt water, voedsel, comfort, telefoonbatterij,
   contant geld en voertuigen.
*/
function renderStatusBars() {
  // Waarschuwingskleuren voor water/voedsel alleen tonen tijdens een actief scenario
  const scenarioActive = document.getElementById('main-content')?.classList.contains('scenario-active');
  // Helper: update een reeks segmenten in zowel de zijbalk als de mobiele balk
  function updateSegs(segId, msbSegId, wrapId, msbStatId, val) {
    // Sidebar: icon + getal + warn/danger klasse
    const svalMap = { 'stat-food': 'ss-val-food', 'stat-water': 'ss-val-water', 'stat-comfort': 'ss-val-comfort' };
    const svalEl = document.getElementById(svalMap[segId]);
    if (svalEl) {
      svalEl.textContent = segId === 'stat-comfort' ? Math.round(val / MAX_STAT_COMFORT * 100) : val;
    }
    // Sidebar: unit-label voor water en voedsel (dag/dagen)
    const sunitMap = { 'stat-food': 'ss-unit-food', 'stat-water': 'ss-unit-water' };
    const sunitEl = sunitMap[segId] ? document.getElementById(sunitMap[segId]) : null;
    if (sunitEl) sunitEl.textContent = val === 1 ? 'dag' : 'dagen';
    // Progress bar (comfort)
    if (segId === 'stat-comfort') {
      const fillEl = document.getElementById('ss-fill-comfort');
      if (fillEl) fillEl.style.transform = 'scaleX(' + (val / MAX_STAT_COMFORT) + ')';
    }
    const isWaterOrFood = segId === 'stat-water' || segId === 'stat-food';
    const wrap = document.getElementById(wrapId);
    if (wrap) {
      wrap.classList.remove('warn', 'danger', 'zero');
      if (!isWaterOrFood || scenarioActive) {
        if (val === 0)     { wrap.classList.add('zero', 'danger'); }
        else if (val <= 1) { wrap.classList.add('danger'); }
        else if (val <= 3) { wrap.classList.add('warn'); }
      }
    }
    // Mobile statusbalk: icon + tekstwaarde
    const mvalMap = { 'msb-seg-food': 'msb-val-food', 'msb-seg-water': 'msb-val-water', 'msb-seg-comfort': 'msb-val-comfort' };
    const mvalEl = document.getElementById(mvalMap[msbSegId]);
    if (mvalEl) {
      mvalEl.textContent = msbSegId === 'msb-seg-comfort'
        ? Math.round(val / MAX_STAT_COMFORT * 100) + '%'
        : val === 1 ? '1 dag' : val + ' dagen';
    }
    const isMsbWaterOrFood = msbSegId === 'msb-seg-water' || msbSegId === 'msb-seg-food';
    const mwrap = document.getElementById(msbStatId);
    if (mwrap) {
      mwrap.classList.remove('warn', 'danger', 'zero');
      if (!isMsbWaterOrFood || scenarioActive) {
        mwrap.classList.toggle('zero', val === 0);
        if (val <= 1) mwrap.classList.add('danger');
        else if (val <= 3) mwrap.classList.add('warn');
      }
    }
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
  if (cashEl) cashEl.textContent = '€' + state.cash + ',-';
  // Mobile bar — battery + cash
  const mBatt = document.getElementById('msb-battery');
  if (mBatt) mBatt.textContent = state.phoneBattery + '%';
  if (typeof updatePhoneFabBattery === 'function') updatePhoneFabBattery();
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
  // Rond af op een veelvoud van 10 voor een cleaner weergave
  const pct = Math.round(val / 10) * 10;
  const critical = pct <= 20;
  // Bar-widget (indien aanwezig)
  if (body) {
    const filledBars = Math.round(pct / 20);
    const color = pct >= 80 ? 'var(--c-battery-full)' : pct >= 60 ? 'var(--c-battery-mid)' : pct >= 40 ? 'var(--c-battery-low)' : 'var(--c-battery-empty)';
    body.querySelectorAll('.batt-bar').forEach((bar, i) => {
      bar.style.backgroundColor = i < filledBars ? color : '';
    });
    body.style.borderColor = critical ? 'var(--c-battery-empty)' : '';
  }
  // Procenttekst — alleen het getal (eenheid staat als aparte span in HTML)
  if (pctEl) {
    pctEl.textContent = pct;
    pctEl.classList.toggle('blink-alert', critical);
  }
  // Progress bar
  const battFill = document.getElementById('ss-fill-battery');
  if (battFill) battFill.style.transform = 'scaleX(' + (pct / 100) + ')';
  // Kleurklassen op de ss-battery stat-kaart
  const battStat = document.getElementById('ss-battery');
  if (battStat) {
    battStat.classList.remove('warn', 'danger');
    if (critical) battStat.classList.add('danger');
    else if (pct <= 40) battStat.classList.add('warn');
  }
}

/* ─── SCENE VISUALS ───────────────────────────────────────────────────────────
   Render achtergrond, overlays en duisternis via de scenarioregistratie,
   zodat de engine geen scenario-specifieke beeldtabellen meer hoeft te kennen.
*/
function applySceneOverlay(el, opacity) {
  if (!el) return;
  if (opacity > 0) {
    if (!el._overlayLoaded && el.dataset.src) {
      el.src = el.dataset.src;
      el._overlayLoaded = true;
    }
    el.style.display = 'block';
    setTimeout(() => {
      el.style.opacity = String(opacity);
      el.play().catch(() => {});
    }, 50);
  } else {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.display = 'none';
      if (el._overlayLoaded) el.pause();
    }, 1200);
  }
}

// Bijhoudt welke achtergrondlaag momenteel zichtbaar is (voor crossfade)
let _bgActiveLayer = 'a';

function renderSceneVisual(scene) {
  const bgImg = resolveSceneBackgroundAsset(scene, currentScenario);
  const layerA = document.getElementById('bg-layer-a');
  const layerB = document.getElementById('bg-layer-b');
  const nextId = _bgActiveLayer === 'a' ? 'b' : 'a';
  const nextLayer = nextId === 'a' ? layerA : layerB;
  const prevLayer = nextId === 'a' ? layerB : layerA;

  if (bgImg && bgImg !== 'none') {
    nextLayer.style.backgroundImage = `url('${bgImg}')`;
    nextLayer.style.backgroundColor = '';
  } else {
    nextLayer.style.backgroundImage = 'none';
    nextLayer.style.backgroundColor = '#050505';
  }

  nextLayer.style.opacity = '1';
  prevLayer.style.opacity = '0';
  _bgActiveLayer = nextId;

  const overlays = resolveSceneOverlayState(scene, currentScenario);
  applySceneOverlay(document.getElementById('fire-overlay'), overlays.fire);
  applySceneOverlay(document.getElementById('rain-overlay'), overlays.rain);

  const darkness = document.getElementById('bg-darkness');
  if (darkness) {
    darkness.style.background = '#000';
    if (scene.visuals?.abruptDarkness) {
      darkness.style.transition = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => { darkness.style.transition = ''; }));
    }
    darkness.style.opacity = resolveSceneDarkness(scene, currentScenario);
  }
}


