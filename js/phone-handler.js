// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Phone Handler — Telefoon-overlay en bel-logica
// Bevat: togglePhone, openPhone, closePhone, renderPhoneContacts,
//        callContact, lockPhoneButton, activatePhoneContacts
// ═══════════════════════════════════════════════════════════════

let phoneContacts = [];  // scenario-specifieke contacten
let _renderedContacts = [];  // gecombineerde lijst op het moment van render
let phoneOpen = false;

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
      label: 'Bel partner',
      get consequence() {
        if (state.networkDown) {
          return 'Je probeert je partner te bellen, maar het netwerk is overbelast. Eerst hoor je een toon, daarna niets meer. Je stuurt een sms: "Alles goed hier." Of die aankomt weet je niet.';
        }
        return 'Je belt naar huis. Na twee keer overgaan neemt je partner op. Je praat even bij — ditjes en datjes, niets bijzonders. "Alles goed daar?" "Ja hoor, gewoon bezig." Het is fijn even iemand te spreken. Je hangt op met een goed gevoel.';
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
          return 'Je probeert je beste vriend(in) te bellen, maar het netwerk is overbelast. Eerst hoor je een toon, daarna niets meer. Je stuurt een sms: "Alles goed hier." Of die aankomt weet je niet.';
        }
        return 'Je belt je beste vriend(in). Na twee keer overgaan wordt er opgenomen. Je praat even bij — ditjes en datjes, niets bijzonders. "Alles goed daar?" "Ja hoor, gewoon bezig." Het is fijn even iemand te spreken. Je hangt op met een goed gevoel.';
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
