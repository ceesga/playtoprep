// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Engine — Scenario-lifecycle en scène-progressie
// Bevat: startScenario, renderScene, saveGame/loadGame,
//        advanceScene, goBack, switchTab, applySceneDecay,
//        Typewriter, commute-vragen
//
// Visuele rendering: zie scene-renderer.js
// Kanalen (nieuws/berichten/radio): zie channel-manager.js
// Keuze-verwerking: zie choice-handler.js
// ═══════════════════════════════════════════════════════════════

/* ─── SCENARIO ENGINE ─────────────────────────────────────────────────────────
   Globale toestandsvariabelen die de voortgang van het actieve scenario bijhouden.
*/
let currentSceneIdx = 0; // index van de huidige zichtbare scène
let activeTab = 'buiten'; // actief tabblad in de kanalen-sectie
let radioUnlocked = false; // wordt true zodra een scène radio-inhoud heeft
const stateSnapshots = []; // opgeslagen staat per scène-index (voor terugnavigatie)
let pendingChoiceMade = false; // true zodra een geldige keuze gemaakt is (niet bij fail)
const historySnapshots = []; // opgeslagen keuzegeschiedenislengte per scène-index

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
      const iconSvg = (typeof ICON_SVG !== 'undefined' && ICON_SVG[o.icon]) ? ICON_SVG[o.icon] : '';
      html += `<button class="choice-card${sel}" data-qid="${q.id}" data-val="${o.val}" onclick="commutePick('${q.id}','${o.val}')">
        <span class="choice-icon" aria-hidden="true">${iconSvg}</span><div>${o.label}</div></button>`;
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
function resetScenarioRuntimeState(scenarioId) {
  resetObjectToDefaults(state, buildScenarioStartState(scenarioId));
  if (typeof ensureInventoryState === 'function') ensureInventoryState();
}

function resetScenarioSessionState() {
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
}

function startScenario(scenarioId) {
  if (typeof clearAllTicks === 'function') clearAllTicks();
  if (typeof resetSceneAudioState === 'function') resetSceneAudioState();

  if (scenarioId === 'thuis_komen' && !profile.commuteMode) {
    currentScenario = 'thuis_komen';
    gotoCommuteQs();
    return;
  }

  const config = activateScenarioConfig(scenarioId || 'stroom');
  resetScenarioRuntimeState(config.id);
  resetScenarioSessionState();
  preloadScenarioAssets(config.id);

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
    avatarSelections: structuredClone(avatarSelections)
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
  if (typeof resetSceneAudioState === 'function') resetSceneAudioState();
  const d = JSON.parse(raw);

  resetObjectToDefaults(profile, PROFILE_DEFAULTS);
  Object.assign(profile, d.profile);
  resetObjectToDefaults(state, STATE_DEFAULTS);
  Object.assign(state, d.state);
  if (typeof ensureInventoryState === 'function') ensureInventoryState();

  activateScenarioConfig(d.currentScenario);
  currentSceneIdx = d.currentSceneIdx;

  choiceHistory.splice(0, Infinity, ...d.choiceHistory);
  newsLog.splice(0, Infinity, ...d.newsLog);
  waLog.splice(0, Infinity, ...d.waLog);
  radioUnlocked = d.radioUnlocked;
  activeTab = d.activeTab || 'buiten';

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
  if (d.activeTab && typeof switchTab === 'function') switchTab(d.activeTab);
}

// Geeft een gefilterde lijst van scènes terug waarbij alle scènes met een
// niet-voldane conditie (conditionalOn) worden weggelaten.
function getActiveScenes() {
  return scenes.filter(s => !s.conditionalOn || s.conditionalOn());
}

// Bijhouder voor ongelezen aantallen per kanaal


// Timer-referentie voor badge-markering — wordt geannuleerd bij scènewissel
let _badgeMarkTimer = null;
// Timer voor scènes die automatisch doorgaan zonder spelerkeuze
let _sceneAutoAdvanceTimer = null;

function applySceneDecayChange(decayChange) {
  Object.keys(decayChange).forEach(key => {
    const value = decayChange[key];

    if (key === 'phoneBattery' && state.airplaneMode) return;
    if (key === 'water' && value < 0 && state.tapWaterAvailable) return;
    if (key === 'food' && value < 0 && state.shopsOpen) return;
    if (typeof value === 'boolean') {
      state[key] = value;
      return;
    }

    applyStateChange(state, { [key]: value });
  });
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
  if (typeof lockPhoneButton === 'function') lockPhoneButton(false);
  var _phoneArea = document.getElementById('phone-consequence-area');
  if (_phoneArea) _phoneArea.innerHTML = '';
  // Annuleer timers van de vorige scène
  if (_badgeMarkTimer) { clearTimeout(_badgeMarkTimer); _badgeMarkTimer = null; }
  if (_sceneAutoAdvanceTimer) { clearTimeout(_sceneAutoAdvanceTimer); _sceneAutoAdvanceTimer = null; }
  // Wis alle unread-stipjes en badges van de vorige scene
  document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('has-unread'));
  ['news', 'whatsapp', 'radio'].forEach(n => { unreadCounts[n] = 0; setBadge(n, 0); });
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

  var _hideHUD = !!(scene.hideHUD);
  var _elPhone = document.getElementById('scenario-phone');
  var _elInventory = document.getElementById('scenario-inventory');
  if (_elPhone) _elPhone.hidden = _hideHUD;
  if (_elInventory) _elInventory.hidden = _hideHUD;

  // Save state snapshot for back navigation
  stateSnapshots[currentSceneIdx] = structuredClone(state);
  historySnapshots[currentSceneIdx] = choiceHistory.length;

  // Apply scene decay (automatic stat reductions)
  const decay = sceneDecay[scene.id];
  if (decay) applySceneDecayChange(decay);
  // Markeer dag 2 als gestart zodra de ochtend van dag 3 begint
  if (scene.id === 'st_d2_morgen') state.day2Started = true;
  // Penalty: no water or food causes health and comfort to drop
  // Alleen van toepassing als kraan/winkels niet meer beschikbaar zijn
  if (state.water === 0 && !state.tapWaterAvailable) {
    state.ranOutOfWater = true;
    state.health = Math.max(0, state.health - 1);
    state.comfort = Math.max(0, state.comfort - 1);
  }
  if (state.food === 0 && !state.shopsOpen) {
    state.ranOutOfFood = true;
    state.health = Math.max(0, state.health - 1);
    state.comfort = Math.max(0, state.comfort - 1);
  }
  renderStatusBars();

  // Clear all unread dots en badges — only re-add below for this scene's new content
  ['news', 'whatsapp', 'radio'].forEach(t => {
    const tab = document.getElementById('tab-' + t);
    if (tab) tab.classList.remove('has-unread');
    unreadCounts[t] = 0; setBadge(t, 0);
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
    narrativeEl.innerHTML = scene.narrative + (scene.afterword ? scene.afterword : '');
    void narrativeEl.offsetWidth; // force reflow so animation replays
    narrativeEl.classList.add('content-enter');
  }
  // Afterword wordt nu direct in de narrative gerenderd; sc-afterword leegmaken
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
  // Radio-inhoud toevoegen als de speler een radio heeft
  if (scene.channels.radio && (profile.hasRadio === 'ja' || state.hasCarRadio)) {
    channels.radio.push({
      time: scene.time,
      text: scene.channels.radio
    });
  }

  // Always open on 'Wat je ervaart' tab at the start of each scene
  switchTab('buiten');

  // Render only current scene's new content
  renderChannels(scene);

  // Mark unread dots en badges voor tabs met nieuwe inhoud in deze scène
  // Kanaalinhoud wordt eenmalig opgevangen zodat getter-scenes consistent tellen
  const _ch = scene.channels;
  const _newsCount    = (_ch.news    && _ch.news.length)    ? _ch.news.length    : 0;
  const _waCount      = (_ch.whatsapp && _ch.whatsapp.length) ? _ch.whatsapp.length : 0;
  const _nlalertCount = 0; // NL-Alert verschijnt als popup en telt niet mee als bericht
  const _hasRadio     = !!(_ch.radio && (profile.hasRadio === 'ja' || state.hasCarRadio));
  _badgeMarkTimer = setTimeout(() => {
    _badgeMarkTimer = null;
    if (_newsCount)  markUnread('news',     _newsCount);
    if (_waCount)    markUnread('whatsapp', _waCount);
    if (_hasRadio)   markUnread('radio', 1);
    // Actieve tab heeft nooit een indicator nodig
    const activeTabEl = document.getElementById('tab-' + activeTab) || (activeTab === 'radio' ? document.getElementById('radio-tab') : null);
    if (activeTabEl) {
      activeTabEl.classList.remove('has-unread');
      unreadCounts[activeTab] = 0; setBadge(activeTab, 0);
    }
  }, 200); // kleine vertraging zodat de tab zeker al actief is

  // Reset next-row animation so it re-fires each scene
  const nextRow = document.getElementById('sc-next-row');
  if (nextRow) {
    nextRow.style.animation = 'none';
    nextRow.style.display = (scene.autoAdvanceMs || scene.hideContinue) ? 'none' : '';
  }

  // Render choices or just a "verder" button
  renderChoices(scene);
  if (typeof renderInventory === 'function') renderInventory();

  if (scene.autoAdvanceMs) {
    _sceneAutoAdvanceTimer = setTimeout(() => {
      _sceneAutoAdvanceTimer = null;
      transitionToNextScene();
    }, scene.autoAdvanceMs);
  }

  const isBlackoutScene = scene.id === 'na_alarm' || scene.id === 'tk_0b';
  document.body.classList.toggle('scene-blackout', isBlackoutScene);

  // Focus management: verplaats focus naar de eerste keuzeknop of de Verder-knop
  requestAnimationFrame(() => {
    if (scene.autoAdvanceMs || scene.hideContinue) return;
    const firstChoice = document.querySelector('#sc-choices .choice-btn:not(:disabled)');
    const nextBtn = document.querySelector('#sc-next-row .btn');
    if (firstChoice) firstChoice.focus({ preventScroll: true });
    else if (nextBtn) nextBtn.focus({ preventScroll: true });
  });

  // Trigger NL-Alert overlay
  if (scene.channels.nlalert) {
    setTimeout(() => {
      triggerAlert(scene.channels.nlalert);
    }, 400); // korte vertraging zodat de scène-transitie eerst afgerond is
  }

  // Ambient audio en scène-specifieke geluidseffecten
  Ambience.resumeForScene(scene.id);
  if (scene.id === 'na_alarm') playSmokeAlarmSound();
  else stopSmokeAlarmSound();
  SceneEffects.playForScene(scene.id);

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

function transitionToNextScene() {
  Typewriter.cancel();
  const _zones = document.querySelector('.scenario-zones');
  if (_zones) {
    // Fade-out voor de overgang naar de volgende scène
    _zones.style.opacity = '0';
    setTimeout(() => {
      currentSceneIdx++;
      renderScene();
    }, 480);
  } else {
    currentSceneIdx++;
    renderScene();
  }
}

function advanceScene() {
  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  const hasChoices = scene && scene.choices && scene.choices.length > 0;
  if (!pendingChoiceMade && hasChoices) {
    Typewriter.skip(); // toon fail-tekst direct als typewriter nog loopt
    return;            // maar ga niet verder naar volgende scène
  }
  if (Typewriter.isRunning()) {
    Typewriter.skip(); // toon tekst direct, wacht op volgende klik
    return;
  }
  transitionToNextScene();
}

// Navigeert één scène terug en herstelt de spelstatus en keuzegeschiedenis
// naar de toestand vóór die scène.
function goBack() {
  if (currentSceneIdx === 0) return;
  currentSceneIdx--;
  // Restore state and history to before this scene was entered
  const snap = stateSnapshots[currentSceneIdx];
  if (snap) {
    const deepSnap = structuredClone(snap);
    Object.keys(deepSnap).forEach(k => { state[k] = deepSnap[k]; });
  }
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
  // Wis ongelezen-indicator en badge voor dit tabblad
  const resolvedTabEl = document.getElementById('tab-' + tab) || (tab === 'radio' ? document.getElementById('radio-tab') : null);
  if (resolvedTabEl) resolvedTabEl.classList.remove('has-unread');
  if (unreadCounts[tab] !== undefined) { unreadCounts[tab] = 0; setBadge(tab, 0); }

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
