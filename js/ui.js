// ═══════════════════════════════════════════════════════════════
// UI — Schermnavigatie, overlays en hulpfuncties
// Bevat: NL-Alert overlay, Help popup, Huishouden portret,
//        show() schermwisselaar, toetsenbord-navigatie
// ═══════════════════════════════════════════════════════════════

/* ── Globale klok (reële tijd) ─────────────────────────────── */
const NL_DAYS   = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
const NL_MONTHS = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

function tickGlobalClock() {
  const now = new Date();
  const tEl = document.getElementById('global-clock-time');
  const dEl = document.getElementById('global-clock-day');
  const mEl = document.getElementById('global-clock-date');
  if (!tEl) return;
  tEl.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  if (dEl) dEl.textContent = NL_DAYS[now.getDay()];
  if (mEl) mEl.textContent = now.getDate() + ' ' + NL_MONTHS[now.getMonth()];
}
tickGlobalClock();
setInterval(tickGlobalClock, 1000);

/* ── Prep-state: bereken indicatorwaarden uit profiel-antwoorden ── */
function updatePrepState() {
  state.water        = 0 + (profile.hasWater === 'ja' ? 3 : 0);
  state.food         = 1 + (profile.hasKit === 'ja' ? 3 : 0);
  state.comfort      = 10;
  state.phoneBattery = 100;
  state.cash         = 20 + (profile.hasCash === 'ja' ? 100 : 0) + (profile.hasEDCCash === 'ja' ? 100 : 0);
  if (typeof renderStatusBars === 'function') renderStatusBars();
}

// Wisselt de zichtbare subpagina van het startmenu (0 = hoofd, 1 = laden).
function startMenuPage(n) {
  const titles = { 0: 'Menu', 1: 'Laden' };
  const titleEl = document.getElementById('start-menu-title');
  if (titleEl) titleEl.textContent = titles[n] || 'Menu';
  [0, 1].forEach(i => {
    const p = document.getElementById('start-p' + i);
    if (p) p.style.display = i === n ? 'block' : 'none';
  });
}

/* ───────────────────────────────────────────────────────────────
   PORTRAIT SNAPSHOT
   Bewaard canvas-afbeelding van het huishoudentafereel dat wordt
   opgebouwd aan het einde van de intake-stap.
─────────────────────────────────────────────────────────────── */

// Opgeslagen canvas-snapshot van het huishoudentafereel na intake.
// null = nog geen snapshot (fallback naar HTML-collage).
let portraitSnapshot = null;

/* ───────────────────────────────────────────────────────────────
   NL-ALERT OVERLAY
   Toont het NL-Alert bericht als een modaal overlay en speelt
   het bijbehorende alarmgeluid af.
─────────────────────────────────────────────────────────────── */

// Slaat het element op dat focus had vóór het openen van het overlay,
// zodat we daar na het sluiten naartoe kunnen terugkeren.
let _alertReturnFocus = null;

// Toont het NL-Alert overlay met de opgegeven tekst en speelt het alarmgeluid af.
// De tekst wordt opgesplitst: regel 0 = titel, regel 1 = tijdstip, rest = berichttekst.
function triggerAlert(text) {
  playNLAlertSound(); // speel het NL-Alert geluid af

  const overlay = document.getElementById('nl-alert-overlay');
  const lines = text.split('\n');

  // lines[0] = "NL-Alert", lines[1] = date/time, rest = body
  const timeLine  = lines[1] || '';
  const bodyLines = lines.slice(2);

  // Stel de berichttekst samen: tijdstip + berichttekst (titel staat als vaste subtitle in HTML)
  const fullText = 'NL-Alert ' + timeLine + '\n' + bodyLines.join('\n').trim();
  document.getElementById('overlay-text').textContent = fullText;

  // Sla het huidige focuselement op voor herstel na sluiten
  _alertReturnFocus = document.activeElement;
  overlay.classList.add('show'); // maak het overlay zichtbaar

  // Verplaats focus naar de sluitknop zodra het overlay is gerenderd
  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('nl-alert-close-btn');
    if (closeBtn) closeBtn.focus();
  });
}

// Sluit het NL-Alert overlay en geeft focus terug aan het vorige element.
function closeAlert() {
  document.getElementById('nl-alert-overlay').classList.remove('show');
  if (_alertReturnFocus) {
    _alertReturnFocus.focus();
    _alertReturnFocus = null; // reset zodat we geen verwijzing bewaren na gebruik
  }
}

/* ───────────────────────────────────────────────────────────────
   HELP POPUP
   Twee-pagina helpvenster dat zowel in scenario- als setup-modus
   werkt. Bevat focus-trap voor toegankelijkheid.
─────────────────────────────────────────────────────────────── */

// Huidige modus van de helpoverlay: 'scenario' of 'setup'.
let _helpMode = 'scenario';

// Slaat de laatste gefocuste element op voor focus-herstel bij sluiten
let _lastFocusBeforeModal = null;

// Vangt tabulator-navigatie op binnen een modaal element zodat de focus
// niet buiten het modal kan geraken (toegankelijkheidsvereiste).
function trapFocus(modalEl) {
  // Verzamel alle focusbare elementen binnen het modal
  const focusable = modalEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  // Luister op Tab-toetsaanslagen en sla de focus om aan de randen
  modalEl.addEventListener('keydown', function onTrap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      // Shift+Tab op het eerste element: spring naar het laatste
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      // Tab op het laatste element: spring naar het eerste
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

// Opent het helpoverlay in de opgegeven modus ('scenario' of 'setup').
// Slaat de huidige focus op, toont pagina 1 en activeert de focus-trap.
function openHelp(mode) {
  _helpMode = mode || 'scenario';
  _lastFocusBeforeModal = document.activeElement; // bewaar focus voor herstel bij sluiten
  helpPage(1); // start altijd op de eerste pagina
  const helpOverlay = document.getElementById('help-overlay');
  helpOverlay.classList.add('show');
  trapFocus(helpOverlay); // zet de focus-trap aan binnen dit overlay
  document.getElementById('help-next').focus(); // zet focus op de Volgende-knop
}

// Sluit het helpoverlay en herstelt de focus naar het vorige element.
function closeHelp() {
  document.getElementById('help-overlay').classList.remove('show');
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}

// Toont de juiste pagina in het helpoverlay (1 of 2).
// Pagina 2 heeft een aparte variant per modus (scenario vs. setup).
function helpPage(n) {
  // Toon/verberg de twee helppagina's op basis van het paginanummer en de modus
  document.getElementById('help-p1').style.display = n === 1 ? '' : 'none';
  document.getElementById('help-p2').style.display       = (n === 2 && _helpMode === 'scenario') ? '' : 'none';
  document.getElementById('help-p2-setup').style.display = (n === 2 && _helpMode === 'setup')    ? '' : 'none';

  // Pas de paginateller en de knoppen aan
  document.getElementById('help-pager').textContent = n + ' van 2';
  document.getElementById('help-prev').disabled = n === 1; // geen vorige op pagina 1
  document.getElementById('help-next').disabled = n === 2; // geen volgende op pagina 2
}

/* ───────────────────────────────────────────────────────────────
   HOUSEHOLD PORTRAIT POPUP
   Toont een visuele weergave van het ingevoerde huishouden.
   Gebruikt een canvas-snapshot als die beschikbaar is, anders
   wordt de collage opnieuw opgebouwd uit de huidige staat.
─────────────────────────────────────────────────────────────── */

// Opent het huishoudportret-popup. Toont de canvas-snapshot of
// bouwt de HTML-collage opnieuw op als fallback.
function openHouseholdPortrait() {
  const stage = document.getElementById('hh-portrait-stage');
  if (!stage) return;

  _lastFocusBeforeModal = document.activeElement; // bewaar focus voor herstel bij sluiten

  if (portraitSnapshot) {
    // Toon de canvas-snapshot die aan het einde van intake is gemaakt
    stage.innerHTML = `<img src="${portraitSnapshot}" class="hh-portrait-snapshot" alt="Jouw huishouden">`;
  } else {
    // Fallback (bijv. bij file://-protocol): bouw collage opnieuw op uit state

    // Bouw het pad op naar de afbeelding van het geselecteerde woningtype
    const _htObj = selectedHouseType ? HOUSE_TYPES.find(h => h.val === selectedHouseType) : null;
    const houseSrc = selectedHouseType === 'overige'
      ? (selectedOverigeSubType ? `afbeelding/avatars/woningtype/${selectedOverigeSubType}.png` : '')
      : (_htObj ? `afbeelding/avatars/woningtype/${_htObj.img || _htObj.val}.png` : '');

    // Hoogte-lookup-tabel op basis van aantal personen (index = persoonsnummer)
    const ht = [0, 140, 132, 124, 116, 110, 104, 99, 94, 90, 86, 82, 78];

    // Bouw HTML-fragmenten voor de figuren en huisdieren
    const figures    = buildFigures(ht);
    const petOverlay = buildPetOverlay(ht);

    // Stel de volledige collage samen als HTML
    stage.innerHTML = `
      ${buildEnvOverlay(selectedEnvironment)}
      <img class="hh-portrait-house${selectedHouseType ? ' visible' : ''}${houseStijlKlasse(selectedHouseType) ? ' ' + houseStijlKlasse(selectedHouseType) : ''}" src="${houseSrc}" alt="">
      <img class="hh-portrait-vehicle left"  src="afbeelding/avatars/vehicles/fiets.png" alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-portrait-vehicle right" src="afbeelding/avatars/vehicles/auto.png"  alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <div style="position:relative;z-index:3;display:flex;align-items:flex-end;justify-content:center;gap:4px;width:100%">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>`;
  }

  const hhPopup = document.getElementById('household-popup');
  hhPopup.classList.add('show'); // maak het popup zichtbaar
  trapFocus(hhPopup);            // zet de focus-trap aan
  document.querySelector('#household-popup .help-close-x').focus(); // focus de sluitknop
}

// Sluit het huishoudportret-popup en herstelt de focus.
function closeHouseholdPortrait() {
  document.getElementById('household-popup').classList.remove('show');
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}

// Sluit het popup als de gebruiker buiten de inhoud klikt (op de overlay-achtergrond).
document.getElementById('household-popup').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeHouseholdPortrait(); // alleen sluiten bij klik op de achtergrond zelf
});

/* ───────────────────────────────────────────────────────────────
   UTILITIES
   Algemene UI-hulpfuncties voor schermnavigatie.
─────────────────────────────────────────────────────────────── */

// Wisselt het actieve scherm naar het scherm met het opgegeven ID.
// Verbergt alle andere schermen, past de sidebar-zichtbaarheid aan,
// werkt de schermcode in de hoek bij en verplaatst de focus.
function show(id) {
  // Verwijder 'active' van alle schermen
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (typeof closeInventory === 'function' && id !== 's-scenario' && id !== 's-prep' && id !== 's-scenariokeuze') closeInventory();

  const screen = document.getElementById(id);
  screen.classList.add('active'); // activeer het gevraagde scherm

  // Verberg kaartachtergrond en schaduw tijdens scenario (fixed overlay is transparant)
  const card = document.getElementById('main-content');
  if (card) card.classList.toggle('scenario-active', id === 's-scenario');

  // Rugzakknop verborgen op startpagina en rapportpagina
  const invToggle = document.getElementById('scenario-inventory');
  if (invToggle) invToggle.style.display = (id === 's-login' || id === 's-start' || id === 's-report') ? 'none' : '';

  // Hamburgerknop verborgen op startpagina en scenario (scenario heeft eigen profielknop)
  const globalMenuBtn = document.getElementById('global-menu-btn');
  if (globalMenuBtn) globalMenuBtn.style.display = (id === 's-start' || id === 's-scenario') ? 'none' : 'flex';

  // Globale klok: verborgen op startpagina, scenario en rapportpagina
  const globalClock = document.getElementById('global-clock');
  if (globalClock) globalClock.style.display = (id === 's-uitleg' || id === 's-scenario' || id === 's-report') ? 'none' : '';

  // Sidebar: toon op prep en tussenliggende schermen, niet op rapport
  const showSidebar = ['s-prep','s-scenariokeuze','s-commute','s-scenario'].includes(id);
  const sidebar = document.getElementById('status-sidebar');
  if (sidebar) sidebar.classList.toggle('visible', showSidebar);
  const cashBox = document.getElementById('ss-cash-box');
  if (cashBox) cashBox.classList.toggle('visible', showSidebar);

  // Bereken prep-state bij binnenkomen prep-scherm
  if (id === 's-prep') updatePrepState();

  // Bouw scenario-kaarten op basis van profiel
  if (id === 's-scenariokeuze') renderScenarioKeuze();

  // Positioneer sidebar dynamisch onder de klokwidget
  if (showSidebar && sidebar) {
    requestAnimationFrame(() => {
      // Kies klokwidget op basis van scherm
      const clockEl = id === 's-scenario'
        ? document.querySelector('#s-scenario .sc-topbar-left')
        : document.getElementById('global-clock');
      const sidebarTop = (clockEl && clockEl.offsetParent !== null)
        ? (clockEl.getBoundingClientRect().bottom + 48)
        : 110;
      sidebar.style.top = sidebarTop + 'px';
      // Hoofdvenster uitlijnen met bovenkant sidebar (alleen scenario, alleen desktop)
      const scenarioZones = document.querySelector('#s-scenario .scenario-zones');
      if (scenarioZones && id === 's-scenario' && window.innerWidth > 768) {
        const offset = sidebarTop - scenarioZones.getBoundingClientRect().top;
        scenarioZones.style.marginTop = (offset > 0 ? offset : 0) + 'px';
      } else if (scenarioZones) {
        scenarioZones.style.marginTop = '';
      }
      // Cash-box onder de sidebar
      if (cashBox) cashBox.style.top = (sidebarTop + sidebar.offsetHeight + 10) + 'px';
    });
  }

  // Vertaal scherm-ID naar een leesbare paginacode voor de hoek-indicator
  const pageCodes = {
    's-start': 'start', 's-uitleg': 'uitleg', 's-prep': 'prep',
    's-scenariokeuze': 'scenario_keuze', 's-commute': 'commute', 's-report': 'report'
  };
  const corner = document.getElementById('scene-id-corner');
  if (corner && pageCodes[id]) corner.textContent = pageCodes[id];

  // Achtergrondafbeelding wisselen per scherm
  const layerA = document.getElementById('bg-layer-a');
  if (layerA && id !== 's-scenario') {
    const isApartment = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
    let bgUrl = isApartment
      ? 'afbeelding/algemeen/appartement_zomer.webp'
      : 'afbeelding/algemeen/huis_normaal.webp';
    if (id === 's-intake') {
      bgUrl = 'afbeelding/algemeen/woonkamer_normaal.webp';
    } else if (id === 's-prep') {
      bgUrl = isApartment
        ? 'afbeelding/algemeen/opslag_appartement.webp'
        : 'afbeelding/algemeen/opslag_kelder.webp';
    }
    layerA.style.backgroundImage = `url('${bgUrl}')`;
    layerA.style.opacity = '1';
    const layerB = document.getElementById('bg-layer-b');
    if (layerB) layerB.style.opacity = '0';
  }

  // Scroll soepel naar boven bij schermwissel
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Move focus to first heading or first focusable element in the new screen
  requestAnimationFrame(() => {
    // Probeer eerst een kop (h1/h2) te vinden voor toegankelijke navigatie
    const heading = screen.querySelector('h1,h2');
    if (heading) {
      // Voeg tabindex toe als de kop nog niet focusbaar is
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({
        preventScroll: true // voorkom dat het scrollen de soepele scroll-animatie verstoort
      });
    } else {
      // Geen kop gevonden: zet focus op het eerste klikbare element
      const focusable = screen.querySelector('button:not(:disabled),a,[tabindex="0"]');
      if (focusable) focusable.focus({
        preventScroll: true
      });
    }
  });
}

/* ───────────────────────────────────────────────────────────────
   TAB KEYBOARD NAVIGATION
   Behandelt toetsenbordinteracties voor het hele document:
   – Escape sluit open overlays,
   – pijltjestoetsen navigeren door tab-reeksen.
─────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  // Escape: sluit open overlays
  if (e.key === 'Escape') {
    // Controleer welk overlay open is en sluit dat als eerste
    const gearMenu = document.getElementById('gear-menu');
    if (gearMenu && gearMenu.classList.contains('show')) { closeGearMenu(); return; }
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
  if (!focused || focused.getAttribute('role') !== 'tab') return; // alleen voor tab-elementen

  // Verzamel alle zichtbare tabs (niet verborgen)
  const tabs = Array.from(document.querySelectorAll('[role="tab"]:not(.hidden-tab)'));
  const idx  = tabs.indexOf(focused);
  if (idx === -1) return; // gefocust element staat niet in de tablijst

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    tabs[(idx + 1) % tabs.length].focus(); // verplaats naar de volgende tab (wraps rond)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    tabs[(idx - 1 + tabs.length) % tabs.length].focus(); // verplaats naar de vorige tab (wraps rond)
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    focused.click(); // activeer de tab via een kliksimulatie
  }
});

/* ───────────────────────────────────────────────────────────────
   GEAR MENU
   Instellingenmenu met meerdere subpagina's: hoofdmenu (0),
   opslaan (1) en laden (2).
─────────────────────────────────────────────────────────────── */

// Opent het tandwielmenu, slaat de huidige focus op en activeert de focus-trap.
function openGearMenu() {
  const menu = document.getElementById('gear-menu');
  if (!menu) return;
  _lastFocusBeforeModal = document.activeElement;
  checkSave(); // laad-info bijwerken voordat het menu zichtbaar wordt
  gearPage(0); // begin altijd op de hoofdpagina van het menu
  menu.classList.add('show');
  trapFocus(menu);
  // Zet focus op de sluitknop zodra het menu is gerenderd
  requestAnimationFrame(() => document.querySelector('.help-close-x', menu)?.focus());
}

// Sluit het tandwielmenu en herstelt de focus naar het vorige element.
function closeGearMenu() {
  const menu = document.getElementById('gear-menu');
  if (!menu) return;
  menu.classList.remove('show');
  if (_lastFocusBeforeModal) { _lastFocusBeforeModal.focus(); _lastFocusBeforeModal = null; }
}

// Wisselt de zichtbare subpagina van het tandwielmenu (0 = hoofd, 1 = opslaan, 2 = laden).
// Past ook de titel, terugknop-zichtbaarheid en contextspecifieke UI-elementen aan.
function gearPage(n) {
  const titles = { 0: 'Menu', 1: 'Opslaan', 2: 'Laden' };
  document.getElementById('gear-title').textContent = titles[n] || 'Menu';

  // Verberg de terugknop op de hoofdpagina, toon hem op subpagina's
  const back = document.getElementById('gear-back');
  if (back) back.style.visibility = n === 0 ? 'hidden' : 'visible';

  // Toon alleen de pagina die overeenkomt met het opgegeven paginanummer
  [0, 1, 2].forEach(i => {
    const p = document.getElementById('gear-p' + i);
    if (p) p.style.display = i === n ? '' : 'none';
  });

  // Sync audio label op hoofdpagina
  if (n === 0) {
    const label = document.getElementById('gear-audio-label');
    const icon  = document.getElementById('gear-audio-icon');
    // Gebruik audioEnabled als die beschikbaar is, anders standaard aan
    const on = typeof audioEnabled !== 'undefined' ? audioEnabled : true;
    if (label) label.textContent = on ? 'Geluid aan' : 'Geluid uit';
    if (icon)  icon.innerHTML = on
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  }

  // Dim laad-knop als er geen save is
  if (n === 2) {
    const loadBtn = document.getElementById('gear-load-btn');
    // Maak de knop half-transparant als er geen opgeslagen sessie is
    if (loadBtn) loadBtn.style.opacity = localStorage.getItem(SAVE_KEY) ? '1' : '0.4';
  }

  // Verberg feedback bij terug
  if (n === 0) {
    const fb = document.getElementById('gear-feedback');
    if (fb) fb.style.display = 'none'; // verberg eventuele eerdere feedbackmelding
  }
}

// Toont een korte feedbackmelding in het tandwielmenu (bijv. "Opgeslagen").
// De melding verdwijnt automatisch na 3 seconden.
function showGearFeedback(msg) {
  const fb = document.getElementById('gear-feedback');
  if (!fb) return;
  fb.textContent    = msg;
  fb.style.display  = 'block';
  clearTimeout(fb._t); // annuleer een eventueel al lopende verborgtimer
  fb._t = setTimeout(() => { fb.style.display = 'none'; }, 3000); // verberg na 3 s
}

// Slaat het huidige profiel (huishouden, voertuigen, omgeving, avatars) op
// in de lokale opslag van de browser.
// Laadt het opgeslagen spelersprofiel uit localStorage en navigeert naar de scenariokeuze.
function loadProfileAndGo() {
  const raw = localStorage.getItem('ptp_profile');
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    Object.assign(profile, d.profile);
    adultsCount        = d.adultsCount        ?? 1;
    childrenCount      = d.childrenCount      ?? 0;
    slechtTerBeenCount = d.slechtTerBeenCount ?? 0;
    petsCount          = d.petsCount          ?? 0;
    selectedHouseType  = d.selectedHouseType  ?? null;
    if (d.selectedVehicles)    selectedVehicles.splice(0, Infinity, ...d.selectedVehicles);
    if (d.selectedEnvironment) selectedEnvironment.splice(0, Infinity, ...d.selectedEnvironment);
    if (d.avatarSelections)    Object.assign(avatarSelections, d.avatarSelections);
    gotoScenariokeuze();
  } catch(e) {
    alert('Profiel laden mislukt.');
  }
}

function saveProfile() {
  const data = {
    version: 1,
    savedAt: Date.now(), // tijdstempel voor weergave "X minuten geleden"
    profile: { ...profile }, // spreidt de profiel-eigenschappen in een nieuw object
    adultsCount, childrenCount, slechtTerBeenCount, petsCount,
    selectedHouseType,
    selectedVehicles:    [...selectedVehicles],    // kopie van de array
    selectedEnvironment: [...selectedEnvironment], // kopie van de array
    avatarSelections:    JSON.parse(JSON.stringify(avatarSelections)) // diepe kopie
  };
  try {
    localStorage.setItem('ptp_profile', JSON.stringify(data));
    showGearFeedback('✓ Thuissituatie opgeslagen');
  } catch(e) {
    showGearFeedback('Opslaan mislukt'); // bijv. bij vol of geblokkeerde localStorage
  }
}

/* ───────────────────────────────────────────────────────────────
   SAVE INDICATOR
   Controleert of er een opgeslagen sessie bestaat en toont
   op het startscherm hoelang geleden die is opgeslagen.
─────────────────────────────────────────────────────────────── */

// Controleert of er een opgeslagen sessie beschikbaar is en werkt
// de "Spel laden"-knop in het startmenu bij.
function checkSave() {
  const scenarioNames = {
    stroom: 'Stroomstoring', natuurbrand: 'Bosbrand', overstroming: 'Overstroming',
    thuis_komen: 'Thuiskomen', drinkwater: 'Drinkwater', nachtalarm: 'Nachtalarm'
  };

  // Vorige opslag laden
  const saveBtn      = document.getElementById('start-savegame-btn');
  const saveInfo     = document.getElementById('start-load-info');
  const gearLoadBtn  = document.getElementById('gear-load-btn');
  const gearLoadInfo = document.getElementById('gear-load-info');

  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    if (saveBtn)      saveBtn.disabled = true;
    if (saveInfo)     saveInfo.textContent = 'Geen opgeslagen spel';
    if (gearLoadBtn)  gearLoadBtn.disabled = true;
    if (gearLoadInfo) gearLoadInfo.textContent = 'Geen opgeslagen spel';
  } else {
    try {
      const d = JSON.parse(raw);
      const min     = Math.round((Date.now() - d.savedAt) / 60000);
      const timeStr = min < 1   ? 'zojuist'
                    : min < 60  ? `${min} min geleden`
                    :             `${Math.round(min / 60)} uur geleden`;
      const scenarioLabel = `${scenarioNames[d.currentScenario] || d.currentScenario} — ${timeStr}`;
      if (saveInfo)     saveInfo.textContent = scenarioLabel;
      if (saveBtn)      saveBtn.disabled = false;
      if (gearLoadInfo) gearLoadInfo.textContent = scenarioLabel;
      if (gearLoadBtn)  gearLoadBtn.disabled = false;
    } catch(e) {
      if (saveBtn)      saveBtn.disabled = true;
      if (saveInfo)     saveInfo.textContent = '';
      if (gearLoadBtn)  gearLoadBtn.disabled = true;
      if (gearLoadInfo) gearLoadInfo.textContent = '';
    }
  }

  // Huishouden laden
  const profBtn      = document.getElementById('start-profile-btn');
  const profInfo     = document.getElementById('start-profile-info');
  const gearProfBtn  = document.getElementById('gear-profile-btn');
  const gearProfInfo = document.getElementById('gear-profile-info');

  const rawProf = localStorage.getItem('ptp_profile');
  if (!rawProf) {
    if (profBtn)      profBtn.disabled = true;
    if (profInfo)     profInfo.textContent = 'Geen opgeslagen huishouden';
    if (gearProfBtn)  gearProfBtn.disabled = true;
    if (gearProfInfo) gearProfInfo.textContent = 'Geen opgeslagen huishouden';
  } else {
    try {
      const p = JSON.parse(rawProf);
      const naam = (p.profile && p.profile.playerName) || '';
      const parts = [];
      const adults = (p.adultsCount || 0) + (p.slechtTerBeenCount || 0);
      if (adults > 0)           parts.push(`${adults} volw.`);
      if (p.childrenCount > 0)  parts.push(`${p.childrenCount} kind${p.childrenCount > 1 ? 'eren' : ''}`);
      if (p.petsCount > 0)      parts.push(`${p.petsCount} huisdier${p.petsCount > 1 ? 'en' : ''}`);
      const comp = parts.length ? parts.join(', ') : 'Huishouden opgeslagen';
      const profLabel = naam ? `${naam} — ${comp}` : comp;
      if (profInfo)     profInfo.textContent = profLabel;
      if (profBtn)      profBtn.disabled = false;
      if (gearProfInfo) gearProfInfo.textContent = profLabel;
      if (gearProfBtn)  gearProfBtn.disabled = false;
    } catch(e) {
      if (profBtn)      profBtn.disabled = true;
      if (profInfo)     profInfo.textContent = '';
      if (gearProfBtn)  gearProfBtn.disabled = true;
      if (gearProfInfo) gearProfInfo.textContent = '';
    }
  }
}

// ─── OVER GOED VOORBEREID ─────────────────────────────────────────────────────

let _overReturnFocus = null;

function openOver() {
  _overReturnFocus = document.activeElement;
  const overlay = document.getElementById('over-overlay');
  overlay.classList.add('open');
  const closeBtn = overlay.querySelector('.help-close-x');
  if (closeBtn) closeBtn.focus();
}

function closeOver() {
  document.getElementById('over-overlay').classList.remove('open');
  if (_overReturnFocus) _overReturnFocus.focus();
}

/* ─── SCENARIO-KEUZE RENDERER ─────────────────────────────────────────────────
   Bouwt de scenario-kaarten dynamisch op basis van het spelersprofiel.
   Omgevingsspecifieke scenario's worden alleen getoond als ze passen bij
   de omgeving die de speler opgegeven heeft in de intake.
   Volgorde: korst-durend bovenaan, langst-durend onderaan.
*/
function renderScenarioKeuze() {
  const loc = (typeof profile !== 'undefined' && profile.location) ? profile.location : [];

  // Bepaal welke omgevingsspecifieke scenario's getoond worden:
  // - overstroming: alleen bij 'water'
  // - natuurbrand:  alleen bij 'forest' of 'rural_area'
  const showOverstroming = loc.includes('water');
  const showNatuurbrand  = loc.includes('forest') || loc.includes('rural_area');

  // Alle mogelijke scenario's, gesorteerd van korst naar langst.
  // active: false = wordt nooit getoond.
  // env: true = alleen tonen als de omgevingscheck slaagt.
  const defs = [
    {
      key: 'nachtalarm',
      title: 'Alarm in de nacht',
      badge: 'Kort (~10 min)',
      badgeClass: 'spk-short',
      cardClass: 'spk-universal',
      label: 'Kort scenario',
      desc: 'Het is midden in de nacht. Je schrikt wakker van een rookmelder die afgaat. Het is donker, de rest slaapt door en beneden hangt rook.',
      active: true,
      env: false
    },
    {
      key: 'thuis_komen',
      title: 'Onderweg naar huis',
      badge: 'Kort (~15 min)',
      badgeClass: 'spk-short',
      cardClass: 'spk-universal',
      label: 'Reisscenario',
      desc: 'Je bent op het werk of op school. Een gewone doordeweekse dag. Je hebt je spullen bij je en over een paar uur ga je naar huis.',
      active: true,
      env: false
    },
    {
      key: 'overstroming',
      title: 'Het water staat hoog',
      badge: 'Medium (~20 min)',
      badgeClass: 'spk-medium',
      cardClass: 'spk-relevant',
      label: 'Specifiek voor jouw omgeving',
      desc: 'Het heeft de afgelopen dagen veel geregend. De rivieren staan hoog en in de buurt praten mensen over het waterpeil. Voorlopig lijkt het mee te vallen, maar de regen houdt aan.',
      active: true,
      env: true,
      show: showOverstroming
    },
    {
      key: 'natuurbrand',
      title: 'Een warme droge zomer',
      badge: 'Medium (~20 min)',
      badgeClass: 'spk-medium',
      cardClass: 'spk-relevant',
      label: 'Specifiek voor jouw omgeving',
      desc: 'Het is al weken droog en warm. De tuin staat er dor bij en het nieuws heeft het over de aanhoudende hitte. Je bent thuis en de dag begint zoals gewoonlijk.',
      active: true,
      env: true,
      show: showNatuurbrand
    },
    {
      key: 'stroom',
      title: 'Een gewone winterdag',
      badge: 'Lang (~35 min)',
      badgeClass: 'spk-long',
      cardClass: 'spk-universal',
      label: 'Uitgebreid scenario',
      desc: 'Het is winter. Je bent thuis, de verwarming staat aan en je hebt geen bijzondere plannen voor vandaag. Buiten is het koud en grijs. Echt weer om binnen te blijven.',
      active: true,
      env: false
    }
  ];

  const visible = defs.filter(d => d.active && (!d.env || d.show));

  const wrap = document.getElementById('scenario-cards-wrap');
  if (!wrap) return;
  wrap.innerHTML = visible.map(d => `
    <button type="button" class="scenario-pick-card ${d.cardClass}" onclick="startScenario('${d.key}')">
      <div class="spk-top">
        <span class="spk-title">${d.title}</span>
        <span class="spk-badge ${d.badgeClass}">${d.badge}</span>
      </div>
      <div class="spk-desc">${d.desc}</div>
      <div class="spk-rel-label">${d.label}</div>
    </button>`).join('');

  // Pas de subtitel aan op het aantal zichtbare scenario's
  const sub = document.getElementById('scenario-keuze-sub');
  if (sub) sub.textContent = `${visible.length} scenario${visible.length === 1 ? '' : "'s"} voor jouw situatie. Kies wat je wilt oefenen.`;
}

// Controleer de opgeslagen sessie zodra de pagina volledig geladen is.
document.addEventListener('DOMContentLoaded', () => {
  checkSave();
  const corner = document.getElementById('scene-id-corner');
  if (corner) corner.textContent = 'start';
});
