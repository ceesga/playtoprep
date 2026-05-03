// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Phone Handler — Telefoon-overlay en bel-logica
// Bevat: togglePhone, openPhone, closePhone, renderPhoneContacts,
//        callContact, lockPhoneButton, activatePhoneContacts
// ═══════════════════════════════════════════════════════════════

let phoneContacts = [];  // scenario-specifieke contacten
let _renderedContacts = [];  // gecombineerde lijst op het moment van render
let phoneOpen = false;

// ─── CONTEXT HELPERS ────────────────────────────────────────────────────────

const _HOME_SCENARIOS = ['stroom', 'overstroming', 'nachtalarm', 'drinkwater', 'natuurbrand'];

function _partnerCallContext() {
  if (!currentScenario) return 'calm';
  if (currentScenario === 'overstroming') {
    if (state.wentUpstairs || state.evacuatedFlood) return 'urgent';
    if (state.awarenessLevel >= 1 || state.sealedHome) return 'worried';
  } else if (currentScenario === 'stroom') {
    if (state.awarenessLevel >= 2) return 'urgent';
    if (state.awarenessLevel >= 1) return 'worried';
  } else if (currentScenario === 'natuurbrand') {
    if (state.evacuated || state.evacuatedFire) return 'urgent';
    if (state.awarenessLevel >= 1) return 'worried';
  } else if (currentScenario === 'nachtalarm') {
    return 'urgent';
  } else if (currentScenario === 'drinkwater') {
    if (state.awarenessLevel >= 1) return 'worried';
  } else if (currentScenario === 'thuis_komen') {
    if (state.awarenessLevel >= 2) return 'urgent';
    if (state.awarenessLevel >= 1) return 'worried';
  }
  return 'calm';
}

function _partnerPresentText(ctx) {
  const s = currentScenario;
  if (ctx === 'calm') {
    if (s === 'stroom') return 'Je loopt naar je partner toe. "Vreemd, die stroom," zegt je partner. Jullie bespreken samen hoe jullie de avond aanpakken.';
    if (s === 'overstroming') return 'Je partner staat bij het raam. "Kijk eens hoe het regent." Jullie bekijken de berichten samen en bespreken of er iets klaargezet moet worden.';
    if (s === 'drinkwater') return 'Je partner heeft de waarschuwing ook gelezen. "Hoe lang duurt dat?" Jullie kijken samen hoeveel drinkwater jullie in huis hebben.';
    if (s === 'natuurbrand') return 'Je partner heeft de berichten ook gelezen. "Zou het onze kant op komen?" Jullie houden de situatie samen in de gaten.';
    return 'Je partner is bij je. Jullie bespreken de situatie en houden elkaar op de hoogte.';
  }
  if (ctx === 'worried') {
    if (s === 'stroom') return 'Je overlegt met je partner. "Als dit lang duurt, wat doen we dan?" Jullie gaan samen na wat jullie nodig hebben en wie wat regelt.';
    if (s === 'overstroming') return 'Je overlegt met je partner. "Moeten we alvast iets inpakken?" Jullie bespreken de situatie en besluiten samen de eerste stap.';
    if (s === 'drinkwater') return 'Je overlegt met je partner. "Water koken of flessen halen?" Jullie verdelen de taken.';
    if (s === 'natuurbrand') return 'Je overlegt met je partner. "Pak jij de vluchttas, dan houd ik de radio bij," stel je voor. Jullie verdelen de taken.';
    return 'Je overlegt met je partner over de situatie en wat jullie het beste kunnen doen.';
  }
  if (s === 'nachtalarm') return 'Je partner is wakker van het alarm. "Wat moet ik doen?" Jullie bespreken snel de route naar buiten en wie wat meeneemt.';
  if (s === 'overstroming') return 'Je partner staat naast je. "We moeten nu beslissen," zegt je partner. Jullie stemmen snel af over de volgende stap.';
  if (s === 'stroom') return 'Je partner staat naast je. Jullie bespreken hoe jullie de komende uren doorkomen — licht, warmte, eten. Samen heb je een plan.';
  if (s === 'natuurbrand') return 'Je partner staat klaar bij de deur. "We gaan?" "We gaan." Jullie pakken het laatste samen en verlaten het huis.';
  return 'Je partner is bij je. Jullie stemmen snel af over de volgende stap.';
}

function _partnerCallText(ctx) {
  if (ctx === 'calm') return 'Je belt naar huis. Je partner neemt op. "Alles goed?" "Ja hoor. Ben je al onderweg?" Jullie praten even bij. Je hangt op met een goed gevoel.';
  if (ctx === 'worried') return 'Je belt naar huis. "Hoe is het daar?" "Goed, we volgen het nieuws. Wanneer ben jij thuis?" Je belooft zo snel mogelijk te komen.';
  return 'Je belt naar huis. "Hoe is het bij jullie?" "We staan klaar," zegt je partner. "Kom zo snel je kunt." Jullie stemmen snel af.';
}

function _friendCallText(ctx) {
  if (ctx === 'calm') return 'Je belt je beste vriend(in). "Heb je het gehoord?" "Ja, gek hè. Bij ons gaat het goed." Even bijpraten. Fijn om te horen dat het goed gaat.';
  if (ctx === 'worried') return 'Je belt je beste vriend(in). "Bij jou ook zo?" "Ja, we houden het in de gaten." Jullie wisselen uit wat jullie weten. Fijn om niet alleen in dit te staan.';
  return 'Je belt je beste vriend(in). Je legt snel uit wat er aan de hand is. "Oké, bel me als je iets nodig hebt." Fijn dat iemand weet waar je bent.';
}

// ─── UNIVERSELE CONTACTEN ────────────────────────────────────────────────────

function getUniversalContacts() {
  var univ = [];
  var hasScenario112 = phoneContacts.some(function(c) { return c.name === '112'; });
  if (!hasScenario112) {
    univ.push({
      name: '112',
      startSceneId: null,
      label: 'Bel 112',
      consequence: 'Je belt 112. Een operator neemt op: "Met 112, wat is de aard van het incident?" Je legt uit dat er geen directe nood is. "Dan verzoeken wij u de lijn vrij te houden voor echte noodsituaties. Bel ons terug als er daadwerkelijk gevaar is." Ze hangen vriendelijk op.',
      stateChange: {},
      conditionalOn: function() { return state.phoneBattery > 0; }
    });
  }
  if (typeof profile !== 'undefined' && profile.adults >= 2) {
    univ.push({
      name: 'Partner',
      startSceneId: null,
      get label() {
        return _HOME_SCENARIOS.includes(currentScenario) ? 'Overleg met partner' : 'Bel partner';
      },
      get consequence() {
        if (state.networkDown) {
          return 'Je probeert je partner te bereiken, maar het netwerk is overbelast. Even later stuur je een sms. Of die aankomt, weet je niet.';
        }
        const ctx = _partnerCallContext();
        return _HOME_SCENARIOS.includes(currentScenario)
          ? _partnerPresentText(ctx)
          : _partnerCallText(ctx);
      },
      stateChange: {},
      conditionalOn: function() { return state.phoneBattery > 0; }
    });
  }
  if (typeof profile !== 'undefined' && profile.adults < 2) {
    univ.push({
      name: 'Beste vriend(in)',
      startSceneId: null,
      label: 'Bel beste vriend(in)',
      get consequence() {
        if (state.networkDown) {
          return 'Je probeert je beste vriend(in) te bellen, maar het netwerk is overbelast. Je stuurt een sms. Of die aankomt, weet je niet.';
        }
        return _friendCallText(_partnerCallContext());
      },
      stateChange: {},
      conditionalOn: function() { return state.phoneBattery > 0; }
    });
  }
  return univ;
}

function togglePhone() {
  phoneOpen ? closePhone() : openPhone();
}

function openPhone() {
  var panel = document.getElementById('phone-panel');
  if (!panel) return;
  renderPhoneContacts();
  panel.hidden = false;
  phoneOpen = true;
  var toggle = document.getElementById('phone-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  var first = panel.querySelector('.phone-call-btn:not([disabled])');
  if (first) first.focus();
}

function closePhone() {
  var panel = document.getElementById('phone-panel');
  if (!panel) return;
  panel.hidden = true;
  phoneOpen = false;
  var toggle = document.getElementById('phone-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function renderPhoneContacts() {
  var list = document.getElementById('phone-contacts-list');
  var battEl = document.getElementById('phone-panel-battery');
  if (!list) return;

  if (battEl) battEl.textContent = 'Batterij ' + state.phoneBattery + '%';

  var visibleScenes = typeof getActiveScenes === 'function' ? getActiveScenes() : [];
  var allContacts = getUniversalContacts().concat(phoneContacts);

  var visible = allContacts.filter(function(c) {
    if (c.startSceneId) {
      var startIdx = visibleScenes.findIndex(function(s) { return s.id === c.startSceneId; });
      if (startIdx === -1 || currentSceneIdx < startIdx) return false;
    }
    return !c.conditionalOn || c.conditionalOn();
  });

  _renderedContacts = visible;

  if (!visible.length) {
    list.innerHTML = '<div class="phone-empty">Geen contacten beschikbaar</div>';
    return;
  }

  list.innerHTML = visible.map(function(c, i) {
    var name = typeof c.name === 'function' ? c.name() : c.name;
    var label = c.label
      ? (typeof c.label === 'function' ? c.label() : c.label)
      : 'Bel';
    var noBattery = state.phoneBattery <= 0;
    var initial = name.charAt(0).toUpperCase();
    return '<div class="phone-contact">' +
      '<div class="phone-contact-avatar">' + initial + '</div>' +
      '<div class="phone-contact-info">' +
        '<div class="phone-contact-name">' + name + '</div>' +
      '</div>' +
      '<button class="phone-call-btn" onclick="callContact(' + i + ')"' +
        (noBattery ? ' disabled' : '') + '>' + label + '</button>' +
      '</div>';
  }).join('');
}

function callContact(idx) {
  var contact = _renderedContacts[idx];
  if (!contact) return;

  var consequence = typeof contact.consequence === 'function'
    ? contact.consequence()
    : contact.consequence;
  var change = contact.stateChange
    ? (typeof contact.stateChange === 'function' ? contact.stateChange() : contact.stateChange)
    : {};

  if (change && Object.keys(change).length > 0) {
    applyStateChange(state, change);
    if (typeof renderStatusBars === 'function') renderStatusBars();
  }

  renderPhoneContacts();

  var area = document.getElementById('phone-consequence-area');
  if (area && consequence) {
    var src = contact.source || null;
    var html = '<div class="phone-consequence">' + consequence;
    if (src) {
      html += '<a class="phone-source-link" href="' + src.url +
        '" target="_blank" rel="noopener">' + src.text + '</a>';
    }
    html += '</div>';
    area.innerHTML = html;
  }
}

function updatePhoneFabBattery() {
  var el = document.getElementById('phone-fab-battery');
  if (el) el.textContent = state.phoneBattery + '%';
  var panel = document.getElementById('phone-panel-battery');
  if (panel) panel.textContent = 'Batterij ' + state.phoneBattery + '%';
}

function lockPhoneButton(locked) {
  var btn = document.getElementById('phone-toggle');
  if (btn) btn.disabled = locked;
}

function activatePhoneContacts(contacts) {
  phoneContacts = contacts || [];
  _renderedContacts = [];
  closePhone();
  updatePhoneFabBattery();
}
