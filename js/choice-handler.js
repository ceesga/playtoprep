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

/* ─── KEUZE VERWERKEN ─────────────────────────────────────────────────────────
   Verwerkt de keuze van de speler: past de spelstatus aan, toont zwevende
   delta-indicators bij de statistieken, schrijft de keuze naar de geschiedenis
   en toont de consequentietekst via de typewriter. Daarna wordt automatisch
   naar de volgende scène gegaan.
*/
function pickChoice(idx) {
  const btn = document.getElementById('cbtn-' + idx);
  if (btn.classList.contains('picked')) return; // prevent double-picking same choice
  if (typeof hideInventoryConsequence === 'function') hideInventoryConsequence();

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
  applyStateChange(state, sc, {
    customHandlers: {
      awarenessLevel(target, value) {
        target.awarenessLevel = Math.max(target.awarenessLevel, value);
      }
    }
  });
  if (state.water === 0) state.ranOutOfWater = true;
  if (state.food === 0) state.ranOutOfFood = true;
  renderStatusBars();
  if (typeof renderInventory === 'function') renderInventory();
  Ambience.resumeForScene(scene.id);
  if (scene.id === 'na_alarm') playSmokeAlarmSound();
  else stopSmokeAlarmSound();

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

  // Toon bronverwijzing als de keuze een source-veld heeft
  if (choice.source) {
    const sourceEl = document.createElement('p');
    sourceEl.className = 'choice-source';
    sourceEl.innerHTML = `<a href="${choice.source.url}" target="_blank" rel="noopener noreferrer">${choice.source.text}</a>`;
    narrativeEl.appendChild(sourceEl);
  }

  // Speel keuze-specifiek geluidseffect af indien opgegeven
  if (choice.sound && typeof SceneEffects !== 'undefined') {
    SceneEffects._get(choice.sound).play();
  }
}

/* ─── SCÈNE VOORUITGAAN ───────────────────────────────────────────────────────
   Gaat naar de volgende scène. Als de typewriter nog bezig is, wordt hij
   eerst overgeslagen. De overgang bevat een korte fade-out van de scène-zones.
*/
