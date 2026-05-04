// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Choice Handler — Keuze-rendering en -verwerking
// Bevat: renderChoices, CHOICE_ICON_MAP,
//        parseChoiceIcon, pickChoice
// ═══════════════════════════════════════════════════════════════
function renderChoices(scene) {
  const wrap = document.getElementById('sc-choices');
  const _conseqEl = document.getElementById('sc-consequence');
  if (_conseqEl) {
    _conseqEl.classList.remove('show');
    _conseqEl.innerHTML = '';
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

  // Reguliere (locatiegebonden) keuzes
  const regularChoices = Array.isArray(scene?.choices) ? scene.choices : [];
  const visibleRegular = regularChoices
    .map((c, i) => ({ c, id: `cbtn-${i}`, onclick: `pickChoice(${i})` }))
    .filter(({ c }) => !c.conditionalOn || c.conditionalOn());

  // Persistente keuzes — gemengd in dezelfde lijst, zelfde visuele behandeling
  const allPersistent = (typeof persistentChoices !== 'undefined') ? persistentChoices : [];
  const visibleScenes = typeof getActiveScenes === 'function' ? getActiveScenes() : [];
  const visiblePersistent = allPersistent
    .map((c, i) => ({ c, id: `pbtn-${i}`, onclick: `pickPersistentChoice(${i})` }))
    .filter(({ c }) => {
      if (c.startSceneId) {
        const startIdx = visibleScenes.findIndex(s => s.id === c.startSceneId);
        if (startIdx === -1 || currentSceneIdx < startIdx) return false;
      }
      return !c.conditionalOn || c.conditionalOn();
    });

  // Samenvoegen en sorteren op categorie
  const allVisible = [...visibleRegular, ...visiblePersistent]
    .sort((a, b) => {
      const ta = a.c.cat || parseChoiceIcon(typeof a.c.text === 'function' ? a.c.text() : a.c.text).cat;
      const tb = b.c.cat || parseChoiceIcon(typeof b.c.text === 'function' ? b.c.text() : b.c.text).cat;
      return (catOrder[ta] ?? 3) - (catOrder[tb] ?? 3);
    });

  let html = '';
  allVisible.forEach(({ c, id, onclick }, btnIdx) => {
    const txt = typeof c.text === 'function' ? c.text() : c.text;
    const parsed = parseChoiceIcon(txt);
    const icon = parsed.icon;
    const cat = c.cat || parsed.cat;
    const label = parsed.label;
    const delay = btnIdx * 55;
    const iconSvg = (typeof ICON_SVG !== 'undefined' && ICON_SVG[icon]) ? ICON_SVG[icon] : '';
    html += `<button class="choice-btn ${cat}" id="${id}" onclick="${onclick}" style="animation:contentFade 260ms var(--ease-out) ${delay}ms both"><span class="choice-icon" aria-hidden="true">${iconSvg}</span><span>${label}</span></button>`;
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
  '💻': {
    icon: 'laptop',
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
    cat: 'cat-action'
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
    cat: 'cat-action'
  },
  '🏘️': {
    icon: 'house',
    cat: 'cat-social'
  },
  '👋': {
    icon: 'users',
    cat: 'cat-social'
  },
  '🧓': {
    icon: 'user',
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
    cat: 'cat-supply'
  },
  // Actie / beweging
  '💼': {
    icon: 'briefcase',
    cat: 'cat-neutral'
  },
  '🚗': {
    icon: 'car',
    cat: 'cat-action'
  },
  '🚕': {
    icon: 'car',
    cat: 'cat-action'
  },
  '🚘': {
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
  '⛽': {
    icon: 'zap',
    cat: 'cat-action'
  },
  '🛣️': {
    icon: 'footprints',
    cat: 'cat-action'
  },
  '💪': {
    icon: 'arrow-right',
    cat: 'cat-action'
  },
  '🍎': {
    icon: 'utensils',
    cat: 'cat-supply'
  },
  '🥪': {
    icon: 'utensils',
    cat: 'cat-supply'
  },
  '👶': {
    icon: 'user',
    cat: 'cat-social'
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
    cat: 'cat-supply'
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
    cat: 'cat-supply'
  },
  '🌳': {
    icon: 'tree-pine',
    cat: 'cat-action'
  },
  '🪣': {
    icon: 'droplets',
    cat: 'cat-supply'
  },
  '🚽': {
    icon: 'x-circle',
    cat: 'cat-action'
  },
  '🛁': {
    icon: 'droplets',
    cat: 'cat-supply'
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
    cat: 'cat-action'
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
  '⏭️': {
    icon: 'arrow-right',
    cat: 'cat-action'
  },
  '🌅': {
    icon: 'clock',
    cat: 'cat-neutral'
  },
  '🌿': {
    icon: 'tree-pine',
    cat: 'cat-supply'
  },
  '💎': {
    icon: 'award',
    cat: 'cat-neutral'
  },
  '📸': {
    icon: 'eye',
    cat: 'cat-info'
  },
  '🛏️': {
    icon: 'moon',
    cat: 'cat-neutral'
  },
  '🧣': {
    icon: 'heart',
    cat: 'cat-supply'
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

const CHOICE_STATE_ANCHORS = {
  water: 'ss-water',
  food: 'ss-food',
  comfort: 'ss-comfort',
  phoneBattery: 'batt-phone-fill',
  cash: 'ss-cash-amount'
};

const CHOICE_STATE_OPTIONS = {
  customHandlers: {
    awarenessLevel(target, value) {
      target.awarenessLevel = Math.max(target.awarenessLevel, value);
    }
  }
};

function resolveChoiceField(choice, key, fallback = undefined) {
  const value = choice?.[key];
  if (typeof value === 'function') return value();
  return value === undefined ? fallback : value;
}

function snapshotChoiceStats() {
  return {
    water: state.water,
    food: state.food,
    comfort: state.comfort,
    health: state.health,
    phoneBattery: state.phoneBattery,
    cash: state.cash
  };
}

function showChoiceDeltas(statsBefore) {
  const deltaItems = Object.keys(statsBefore).map(key => {
    const delta = state[key] - statsBefore[key];
    if (delta === 0) return null;
    const anchor = document.getElementById(CHOICE_STATE_ANCHORS[key]);
    if (!anchor) return null;
    return {
      delta,
      rect: anchor.getBoundingClientRect()
    };
  }).filter(Boolean);

  deltaItems.forEach(({ delta, rect }) => {
    const span = document.createElement('span');
    span.className = 'stat-delta';
    span.textContent = (delta > 0 ? '+' : '−') + Math.abs(delta);
    span.style.color = delta > 0 ? '#22c55e' : '#ef4444';
    span.style.left = (rect.left + rect.width / 2 - 12) + 'px';
    span.style.top = (rect.top - 4) + 'px';
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1100);
  });
}

function renderChoiceConsequence(text, source) {
  switchTab('buiten');
  const narrativeEl = document.getElementById('sc-narrative');
  if (!narrativeEl) return;

  narrativeEl.innerHTML = '';
  const twSpan = document.createElement('span');
  twSpan.className = 'consequence-inline';
  narrativeEl.appendChild(twSpan);
  Typewriter.run(text || '', twSpan, null);

  if (!source) return;
  const sourceEl = document.createElement('p');
  sourceEl.className = 'choice-source';
  sourceEl.innerHTML = `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.text}</a>`;
  narrativeEl.appendChild(sourceEl);
}

function showChoiceFailure(choice) {
  const failText = resolveChoiceField(choice, 'failConsequence', 'Je kunt deze keuze nu niet maken.');
  renderChoiceConsequence(failText, null);
}

function lockChoiceButtons(selectedButton) {
  document.querySelectorAll('#sc-choices .choice-btn').forEach(button => { button.disabled = true; });
  selectedButton?.classList.add('picked');
  pendingChoiceMade = true;
}

function recordChoiceHistory(scene, choice) {
  choiceHistory.push({
    sceneId: scene.id,
    time: scene.time,
    date: scene.date,
    dayBadge: scene.dayBadge,
    choiceText: resolveChoiceField(choice, 'text', '')
  });
}

function executeChoice(choice, {
  button = null,
  scene = null,
  lockPhone = false,
  stateOptions = CHOICE_STATE_OPTIONS
} = {}) {
  if (!choice || !scene) return;
  if (button?.classList.contains('picked')) return;
  if (typeof hideInventoryConsequence === 'function') hideInventoryConsequence();

  if (choice.failCondition && choice.failCondition()) {
    showChoiceFailure(choice);
    return;
  }

  lockChoiceButtons(button);
  if (lockPhone && typeof lockPhoneButton === 'function') lockPhoneButton(true);

  const statsBefore = snapshotChoiceStats();
  const stateChange = resolveChoiceField(choice, 'stateChange', {}) || {};
  applyStateChange(state, stateChange, stateOptions);
  if (state.water === 0) state.ranOutOfWater = true;
  if (state.food === 0) state.ranOutOfFood = true;

  renderStatusBars();
  if (typeof renderInventory === 'function') renderInventory();
  Ambience.resumeForScene(scene.id);
  if (scene.id === 'na_alarm') playSmokeAlarmSound();
  else stopSmokeAlarmSound();

  showChoiceDeltas(statsBefore);
  recordChoiceHistory(scene, choice);
  renderChoiceConsequence(resolveChoiceField(choice, 'consequence', ''), choice.source);

  if (choice.sound && typeof SceneEffects !== 'undefined') {
    SceneEffects._get(choice.sound).play();
  }
}

/* ─── KEUZE VERWERKEN ─────────────────────────────────────────────────────────
   Verwerkt de keuze van de speler: past de spelstatus aan, toont zwevende
   delta-indicators bij de statistieken, schrijft de keuze naar de geschiedenis
   en toont de consequentietekst via de typewriter. Daarna wordt automatisch
   naar de volgende scène gegaan.
*/
function pickChoice(idx) {
  const btn = document.getElementById('cbtn-' + idx);
  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  const choice = scene?.choices?.[idx];
  executeChoice(choice, {
    button: btn,
    scene,
    lockPhone: true
  });
}

function pickPersistentChoice(idx) {
  const btn = document.getElementById('pbtn-' + idx);
  const allPersistent = (typeof persistentChoices !== 'undefined') ? persistentChoices : [];
  const choice = allPersistent[idx];
  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  executeChoice(choice, {
    button: btn,
    scene
  });
}

/* ─── SCÈNE VOORUITGAAN ───────────────────────────────────────────────────────
   Gaat naar de volgende scène. Als de typewriter nog bezig is, wordt hij
   eerst overgeslagen. De overgang bevat een korte fade-out van de scène-zones.
*/
