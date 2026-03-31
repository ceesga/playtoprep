// ═══════════════════════════════════════════════════════════════
// UI — Schermnavigatie, overlays en hulpfuncties
// Bevat: NL-Alert overlay, Help popup, Huishouden portret,
//        show() schermwisselaar, toetsenbord-navigatie
// ═══════════════════════════════════════════════════════════════

// ─── PORTRAIT SNAPSHOT ────────────────────────────────────────────────────────
// Opgeslagen canvas-snapshot van het huishoudentafereel na intake.
// null = nog geen snapshot (fallback naar HTML-collage).
let portraitSnapshot = null;

// ─── NL-ALERT OVERLAY ─────────────────────────────────────────────────────────
let _alertReturnFocus = null;

function triggerAlert(text) {
  playNLAlertSound();
  const overlay = document.getElementById('nl-alert-overlay');
  const lines = text.split('\n');
  // lines[0] = "NL-Alert", lines[1] = date/time, rest = body
  const timeLine = lines[1] || '';
  const bodyLines = lines.slice(2);
  const fullText = 'NL-Alert ' + timeLine + '\n\n' + bodyLines.join('\n').trim();
  document.getElementById('overlay-text').textContent = fullText;
  _alertReturnFocus = document.activeElement;
  overlay.classList.add('show');
  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('nl-alert-close-btn');
    if (closeBtn) closeBtn.focus();
  });
}

function closeAlert() {
  document.getElementById('nl-alert-overlay').classList.remove('show');
  if (_alertReturnFocus) {
    _alertReturnFocus.focus();
    _alertReturnFocus = null;
  }
}

// ─── HELP POPUP ───────────────────────────────────────────────────────────────
let _helpMode = 'scenario';

// Slaat de laatste gefocuste element op voor focus-herstel bij sluiten
let _lastFocusBeforeModal = null;

function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  modalEl.addEventListener('keydown', function onTrap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

function openHelp(mode) {
  _helpMode = mode || 'scenario';
  _lastFocusBeforeModal = document.activeElement;
  helpPage(1);
  const helpOverlay = document.getElementById('help-overlay');
  helpOverlay.classList.add('show');
  trapFocus(helpOverlay);
  document.getElementById('help-next').focus();
}

function closeHelp() {
  document.getElementById('help-overlay').classList.remove('show');
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}

function helpPage(n) {
  document.getElementById('help-p1').style.display = n === 1 ? '' : 'none';
  document.getElementById('help-p2').style.display = (n === 2 && _helpMode === 'scenario') ? '' : 'none';
  document.getElementById('help-p2-setup').style.display = (n === 2 && _helpMode === 'setup') ? '' : 'none';
  document.getElementById('help-pager').textContent = n + ' van 2';
  document.getElementById('help-prev').disabled = n === 1;
  document.getElementById('help-next').disabled = n === 2;
}

// ─── HOUSEHOLD PORTRAIT POPUP ─────────────────────────────────────────────────
function openHouseholdPortrait() {
  const stage = document.getElementById('hh-portrait-stage');
  if (!stage) return;
  _lastFocusBeforeModal = document.activeElement;

  if (portraitSnapshot) {
    // Toon de canvas-snapshot die aan het einde van intake is gemaakt
    stage.innerHTML = `<img src="${portraitSnapshot}" class="hh-portrait-snapshot" alt="Jouw huishouden">`;
  } else {
    // Fallback (bijv. bij file://-protocol): bouw collage opnieuw op uit state
    const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';
    const ht = [0, 140, 132, 124, 116, 110, 104, 99, 94, 90, 86, 82, 78];
    const figures    = buildFigures(ht);
    const petOverlay = buildPetOverlay(ht);
    stage.innerHTML = `
      ${buildEnvOverlay(selectedEnvironment)}
      <img class="hh-portrait-house${selectedHouseType ? ' visible' : ''}${selectedHouseType === 'appartement' ? ' house-appartement' : ''}" src="${houseSrc}" alt="">
      <img class="hh-portrait-vehicle left" src="afbeelding/avatars/vehicles/fiets.png" alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-portrait-vehicle right" src="afbeelding/avatars/vehicles/auto.png" alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <div style="position:relative;z-index:3;display:flex;align-items:flex-end;justify-content:center;gap:4px;width:100%">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>`;
  }

  const hhPopup = document.getElementById('household-popup');
  hhPopup.classList.add('show');
  trapFocus(hhPopup);
  document.querySelector('#household-popup .help-close-x').focus();
}

function closeHouseholdPortrait() {
  document.getElementById('household-popup').classList.remove('show');
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}
document.getElementById('household-popup').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeHouseholdPortrait();
});

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  screen.classList.add('active');
  const sidebar = document.getElementById('status-sidebar');
  if (sidebar) sidebar.classList.toggle('visible', id === 's-scenario');
  const sidebarLeft = document.getElementById('status-sidebar-left');
  if (sidebarLeft) sidebarLeft.classList.toggle('visible', id === 's-scenario');
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  // Move focus to first heading or first focusable element in the new screen
  requestAnimationFrame(() => {
    const heading = screen.querySelector('h1,h2');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({
        preventScroll: true
      });
    } else {
      const focusable = screen.querySelector('button:not(:disabled),a,[tabindex="0"]');
      if (focusable) focusable.focus({
        preventScroll: true
      });
    }
  });
}

// ─── TAB KEYBOARD NAVIGATION ──────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  // Escape: sluit open overlays
  if (e.key === 'Escape') {
    const gearMenu = document.getElementById('gear-menu');
    if (gearMenu && gearMenu.style.display !== 'none') { closeGearMenu(); return; }
    if (document.getElementById('help-overlay').classList.contains('show')) {
      closeHelp();
      return;
    }
    if (document.getElementById('household-popup').classList.contains('show')) {
      closeHouseholdPortrait();
      return;
    }
  }
  // Pijltjestoetsen: navigeer tabs
  const focused = document.activeElement;
  if (!focused || focused.getAttribute('role') !== 'tab') return;
  const tabs = Array.from(document.querySelectorAll('[role="tab"]:not(.hidden-tab)'));
  const idx = tabs.indexOf(focused);
  if (idx === -1) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    tabs[(idx + 1) % tabs.length].focus();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    tabs[(idx - 1 + tabs.length) % tabs.length].focus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    focused.click();
  }
});

// ─── GEAR MENU ────────────────────────────────────────────────────────────────
function openGearMenu() {
  const menu = document.getElementById('gear-menu');
  if (!menu) return;
  _lastFocusBeforeModal = document.activeElement;
  menu.style.display = 'flex';
  // Sync audio button label
  const audioBtn = document.getElementById('gear-audio-item');
  if (audioBtn) {
    const on = typeof audioEnabled !== 'undefined' ? audioEnabled : true;
    audioBtn.textContent = on ? '🔊 Geluid aan' : '🔇 Geluid uit';
  }
  // Toon/verberg laad-knop afhankelijk van save
  const loadBtn = document.getElementById('gear-load-btn');
  if (loadBtn) loadBtn.style.opacity = localStorage.getItem(SAVE_KEY) ? '1' : '0.4';
  trapFocus(menu);
  requestAnimationFrame(() => document.querySelector('.gear-close')?.focus());
}

function closeGearMenu() {
  const menu = document.getElementById('gear-menu');
  if (!menu) return;
  menu.style.display = 'none';
  const fb = document.getElementById('gear-feedback');
  if (fb) fb.style.display = 'none';
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}

function showGearFeedback(msg) {
  const fb = document.getElementById('gear-feedback');
  if (!fb) return;
  fb.textContent = msg;
  fb.style.display = 'block';
  clearTimeout(fb._t);
  fb._t = setTimeout(() => { fb.style.display = 'none'; }, 3000);
}

function saveProfile() {
  const data = {
    version: 1,
    savedAt: Date.now(),
    profile: { ...profile },
    adultsCount, childrenCount, slechtTerBeenCount, petsCount,
    selectedHouseType,
    selectedVehicles: [...selectedVehicles],
    selectedEnvironment: [...selectedEnvironment],
    avatarSelections: JSON.parse(JSON.stringify(avatarSelections))
  };
  try {
    localStorage.setItem('ptp_profile', JSON.stringify(data));
    showGearFeedback('✓ Thuissituatie opgeslagen');
  } catch(e) {
    showGearFeedback('Opslaan mislukt');
  }
}

// ─── SAVE INDICATOR ───────────────────────────────────────────────────────────
function checkSave() {
  const wrap = document.getElementById('continue-wrap');
  if (!wrap) return;
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) { wrap.style.display = 'none'; return; }
  try {
    const d = JSON.parse(raw);
    const min = Math.round((Date.now() - d.savedAt) / 60000);
    const timeStr = min < 1 ? 'zojuist' : min < 60 ? `${min} min geleden` : `${Math.round(min / 60)} uur geleden`;
    const names = { stroom: 'Stroomstoring', natuurbrand: 'Bosbrand', overstroming: 'Overstroming', thuis_komen: 'Gewone winterdag' };
    const info = document.getElementById('continue-info');
    if (info) info.textContent = `${names[d.currentScenario] || d.currentScenario} — opgeslagen ${timeStr}`;
    wrap.style.display = '';
  } catch(e) { wrap.style.display = 'none'; }
}

document.addEventListener('DOMContentLoaded', checkSave);
