// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
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
function buildMenuRowHtml(menuType, item) {
  const btnClass = item.stacked ? 'gear-row gear-row-stacked' : 'gear-row';
  const idAttr = item.id ? ` id="${item.id}"` : '';
  const disabledAttr = item.disabled ? ' disabled' : '';
  const labelIdAttr = item.labelId ? ` id="${item.labelId}"` : '';
  const closeSuffix = menuType === 'gear' && item.closeOnClick ? ';closeGearMenu()' : '';
  const onclickAttr = item.onclick ? ` onclick="${item.onclick}${closeSuffix}"` : '';

  let inner = `<span${labelIdAttr}>${item.label}</span>`;
  if (item.subId) {
    inner += `<span class="gear-row-sub" id="${item.subId}"></span>`;
  }

  return `<button type="button" class="${btnClass}"${idAttr}${onclickAttr}${disabledAttr}>${inner}</button>`;
}

function getMenuPages(menuType) {
  if (menuType === 'start') {
    return {
      titles: { 0: 'Menu', 1: 'Spel laden' },
      pages: {
        0: [
          { label: 'Nieuw spel', onclick: "show('s-uitleg')" },
          { label: 'Spel laden', onclick: "startMenuPage(1)" },
          { label: audioEnabled ? 'Geluid aan' : 'Geluid uit', id: 'start-audio-btn', onclick: 'toggleAudio()' },
          { label: 'Uitleg', onclick: "openHelp('setup')" },
          { label: 'Over Goed Voorbereid', onclick: 'openOver()' }
        ],
        1: [
          { label: '← Terug', onclick: 'startMenuPage(0)' },
          { label: 'Huishouden laden', id: 'start-profile-btn', subId: 'start-profile-info', stacked: true, onclick: 'loadProfileAndGo()' },
          { label: 'Vorige opslag laden', id: 'start-savegame-btn', subId: 'start-load-info', stacked: true, onclick: 'loadGame()' }
        ]
      }
    };
  }

  return {
    titles: { 0: 'Menu', 1: 'Spel opslaan', 2: 'Spel laden' },
    pages: {
      0: [
        { label: 'Nieuw spel', onclick: "show('s-uitleg')", closeOnClick: true },
        { label: 'Spel opslaan', onclick: 'gearPage(1)' },
        { label: 'Spel laden', onclick: 'gearPage(2)' },
        { label: audioEnabled ? 'Geluid aan' : 'Geluid uit', id: 'gear-audio-item', labelId: 'gear-audio-label', onclick: 'toggleAudio()' },
        { label: 'Uitleg', onclick: "openHelp('scenario')", closeOnClick: true },
        { label: 'Over Goed Voorbereid', onclick: 'openOver()', closeOnClick: true }
      ],
      1: [
        { html: '<div id="gear-feedback" class="gear-feedback" style="display:none"></div>' },
        { label: 'Thuissituatie opslaan', onclick: 'saveProfile()' },
        { label: 'Voortgang opslaan', onclick: 'saveGame()' }
      ],
      2: [
        { label: 'Huishouden laden', id: 'gear-profile-btn', subId: 'gear-profile-info', stacked: true, onclick: 'loadProfileAndGo()', closeOnClick: true },
        { label: 'Vorige opslag laden', id: 'gear-load-btn', subId: 'gear-load-info', stacked: true, onclick: 'loadGame()', closeOnClick: true },
        { label: 'Scenario opnieuw kiezen', onclick: 'gotoScenariokeuze()', closeOnClick: true }
      ]
    }
  };
}

function renderMenuPage(menuType, page) {
  const config = getMenuPages(menuType);
  const titleEl = document.getElementById(menuType === 'start' ? 'start-menu-title-text' : 'gear-title');
  const pagesEl = document.getElementById(menuType === 'start' ? 'start-menu-pages' : 'gear-menu-pages');
  if (!titleEl || !pagesEl) return;

  titleEl.textContent = config.titles[page] || 'Menu';
  pagesEl.innerHTML = (config.pages[page] || []).map(item =>
    item.html || buildMenuRowHtml(menuType, item)
  ).join('');

  if (menuType === 'gear') {
    const back = document.getElementById('gear-back');
    if (back) back.style.visibility = page === 0 ? 'hidden' : 'visible';
  }

  checkSave();
}

function startMenuPage(n) {
  renderMenuPage('start', n);
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

  _openModal(overlay, 'show', '#nl-alert-close-btn');
}

// Sluit het NL-Alert overlay en geeft focus terug aan het vorige element.
function closeAlert() {
  _closeModal(document.getElementById('nl-alert-overlay'), 'show');
}

/* ───────────────────────────────────────────────────────────────
   HELP POPUP
   Twee-pagina helpvenster dat zowel in scenario- als setup-modus
   werkt. Bevat focus-trap voor toegankelijkheid.
─────────────────────────────────────────────────────────────── */

// Huidige modus van de helpoverlay: 'scenario' of 'setup'.
let _helpMode = 'scenario';

// Slaat de laatste gefocuste element op voor focus-herstel bij sluiten
let _modalReturnFocus = null;

// Vangt tabulator-navigatie op binnen een modaal element zodat de focus
// niet buiten het modal kan geraken (toegankelijkheidsvereiste).
function trapFocus(modalEl) {
  if (!modalEl) return () => {};
  if (typeof modalEl._trapFocusCleanup === 'function') modalEl._trapFocusCleanup();

  const onTrap = e => {
    if (e.key !== 'Tab') return;
    const focusable = modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };

  modalEl.addEventListener('keydown', onTrap);
  modalEl._trapFocusCleanup = () => {
    modalEl.removeEventListener('keydown', onTrap);
    if (modalEl._trapFocusCleanup) modalEl._trapFocusCleanup = null;
  };
  return modalEl._trapFocusCleanup;
}

function releaseFocusTrap(modalEl) {
  if (modalEl && typeof modalEl._trapFocusCleanup === 'function') {
    modalEl._trapFocusCleanup();
  }
}


function _openModal(el, openClass, focusQuery) {
  _modalReturnFocus = document.activeElement;
  el.classList.add(openClass);
  trapFocus(el);
  requestAnimationFrame(() => (focusQuery ? el.querySelector(focusQuery) : null)?.focus());
}

function _closeModal(el, openClass) {
  releaseFocusTrap(el);
  el.classList.remove(openClass);
  _modalReturnFocus?.focus();
  _modalReturnFocus = null;
}

// Opent het helpoverlay in de opgegeven modus ('scenario' of 'setup').
// Slaat de huidige focus op, toont pagina 1 en activeert de focus-trap.
function openHelp(mode) {
  _helpMode = mode || 'scenario';
  helpPage(1);
  _openModal(document.getElementById('help-overlay'), 'show', '#help-next');
}

// Sluit het helpoverlay en herstelt de focus naar het vorige element.
function closeHelp() {
  _closeModal(document.getElementById('help-overlay'), 'show');
}

function openTerms() {
  _openModal(document.getElementById('terms-overlay'), 'open', '.help-close-x');
}

function closeTerms() {
  _closeModal(document.getElementById('terms-overlay'), 'open');
}

// Toont de juiste pagina in het helpoverlay.
// Scenario-modus heeft 3 pagina's, setup-modus heeft 2 pagina's.
// Pagina 2 en 3 hebben aparte varianten per modus.
function helpPage(n) {
  const maxPages = _helpMode === 'scenario' ? 3 : 2;

  document.getElementById('help-p1').style.display        = n === 1 ? '' : 'none';
  document.getElementById('help-p2').style.display        = (n === 2 && _helpMode === 'scenario') ? '' : 'none';
  document.getElementById('help-p2-setup').style.display  = (n === 2 && _helpMode === 'setup')    ? '' : 'none';
  document.getElementById('help-p3').style.display        = (n === 3 && _helpMode === 'scenario') ? '' : 'none';

  document.getElementById('help-pager').textContent = n + ' van ' + maxPages;

  const prevBtn = document.getElementById('help-prev');
  const nextBtn = document.getElementById('help-next');
  prevBtn.disabled = n === 1;
  nextBtn.disabled = n === maxPages;
  if (n > 1) prevBtn.setAttribute('onclick', 'helpPage(' + (n - 1) + ')');
  if (n < maxPages) nextBtn.setAttribute('onclick', 'helpPage(' + (n + 1) + ')');
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

  if (portraitSnapshot) {
    // Toon de canvas-snapshot die aan het einde van intake is gemaakt
    stage.innerHTML = `<img src="${portraitSnapshot}" class="hh-portrait-snapshot" alt="Jouw huishouden">`;
  } else {
    // Fallback (bijv. bij file://-protocol): bouw collage opnieuw op uit state

    // Hoogte-lookup-tabel op basis van aantal personen (index = persoonsnummer)
    const ht = [0, 140, 132, 124, 116, 110, 104, 99, 94, 90, 86, 82, 78];

    // Bouw HTML-fragmenten voor de figuren en huisdieren
    const figures    = buildFigures(ht);
    const petOverlay = buildPetOverlay(ht);

    // Stel de volledige collage samen als HTML
    stage.innerHTML = `
      ${buildEnvOverlay(selectedEnvironment)}
      ${buildHouseImageHtml('hh-portrait-house')}
      ${buildStageVehiclesHtml('hh-portrait-vehicle')}
      <div class="hh-portrait-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>`;
  }

  _openModal(document.getElementById('household-popup'), 'show', '.help-close-x');
}

// Sluit het huishoudportret-popup en herstelt de focus.
function closeHouseholdPortrait() {
  _closeModal(document.getElementById('household-popup'), 'show');
}

// Sluit het popup als de gebruiker buiten de inhoud klikt (op de overlay-achtergrond).
document.getElementById('household-popup').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeHouseholdPortrait(); // alleen sluiten bij klik op de achtergrond zelf
});

/* ───────────────────────────────────────────────────────────────
   UTILITIES
   Algemene UI-hulpfuncties voor schermnavigatie.
─────────────────────────────────────────────────────────────── */

const _SCREEN_CFG = {
  's-login':         { hideInv: true,  hideMenu: true,  hideClock: false, sidebar: false },
  's-start':         { hideInv: true,  hideMenu: true,  hideClock: false, sidebar: false },
  's-uitleg':        { hideInv: true,  hideMenu: true,  hideClock: true,  sidebar: false },
  's-intake':        { hideInv: true,  hideMenu: true,  hideClock: false, sidebar: false },
  's-prep':          { hideInv: false, hideMenu: false, hideClock: false, sidebar: true  },
  's-scenariokeuze': { hideInv: false, hideMenu: false, hideClock: false, sidebar: true  },
  's-commute':       { hideInv: false, hideMenu: false, hideClock: false, sidebar: true  },
  's-scenario':      { hideInv: false, hideMenu: true,  hideClock: true,  sidebar: true  },
  's-report':        { hideInv: true,  hideMenu: true,  hideClock: true,  sidebar: false },
};

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
  if (card) {
    card.classList.toggle('scenario-active', id === 's-scenario');
    card.classList.toggle('start-active', id === 's-start' || id === 's-login');
  }

  const cfg = _SCREEN_CFG[id] || {};
  const showSidebar = !!cfg.sidebar;

  const invToggle = document.getElementById('scenario-inventory');
  if (invToggle) invToggle.toggleAttribute('hidden', !!cfg.hideInv);

  const globalMenuBtn = document.getElementById('global-menu-btn');
  if (globalMenuBtn) globalMenuBtn.style.display = cfg.hideMenu ? 'none' : 'flex';

  const globalClock = document.getElementById('global-clock');
  if (globalClock) globalClock.style.display = cfg.hideClock ? 'none' : '';
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
    's-start': 'start',
    's-uitleg': 'uitleg',
    's-prep': 'prep',
    's-scenariokeuze': 'scenario_keuze',
    's-commute': 'commute',
    's-report': 'report'
  };
  const corner = document.getElementById('scene-id-corner');
  if (corner && pageCodes[id]) corner.textContent = pageCodes[id];

  // Achtergrondafbeelding wisselen per scherm
  const layerA = document.getElementById('bg-layer-a');
  if (layerA && id !== 's-scenario') {
    const isApartment = isApartmentHouse();
    let bgUrl = isApartment
      ? 'afbeelding/algemeen/appartement_zomer.webp'
      : 'afbeelding/algemeen/huis_normaal.webp';
    if (id === 's-start' || id === 's-login') {
      bgUrl = 'afbeelding/algemeen/startpagina.webp';
    } else if (id === 's-intake') {
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
    if (document.getElementById('terms-overlay').classList.contains('open')) {
      closeTerms();
      return;
    }
    if (document.getElementById('over-overlay').classList.contains('open')) {
      closeOver();
      return;
    }
    if (document.getElementById('household-popup').classList.contains('show')) {
      closeHouseholdPortrait();
      return;
    }
    if (document.getElementById('nl-alert-overlay').classList.contains('show')) {
      closeAlert();
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
  checkSave();
  gearPage(0);
  _openModal(menu, 'show', '.help-close-x');
}

// Sluit het tandwielmenu en herstelt de focus naar het vorige element.
function closeGearMenu() {
  const menu = document.getElementById('gear-menu');
  if (!menu) return;
  _closeModal(menu, 'show');
}

// Wisselt de zichtbare subpagina van het tandwielmenu (0 = hoofd, 1 = opslaan, 2 = laden).
// Past ook de titel, terugknop-zichtbaarheid en contextspecifieke UI-elementen aan.
function gearPage(n) {
  renderMenuPage('gear', n);
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
    profile.intakeCompleted = d.profile?.intakeCompleted ?? true;
    profile.prepCompleted = d.profile?.prepCompleted ?? true;
    adultsCount        = d.adultsCount        ?? 1;
    childrenCount      = d.childrenCount      ?? 0;
    slechtTerBeenCount = d.slechtTerBeenCount ?? 0;
    ouderenCount       = d.ouderenCount       ?? 0;
    petsCount          = d.petsCount          ?? 0;
    selectedHouseType  = d.selectedHouseType  ?? null;
    selectedOverigeSubType = d.selectedOverigeSubType ?? null;
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
    adultsCount, childrenCount, slechtTerBeenCount, ouderenCount, petsCount,
    selectedHouseType,
    selectedOverigeSubType,
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
      const scenarioLabel = `${getScenarioConfig(d.currentScenario).label} — ${timeStr}`;
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
      const adults = (p.adultsCount || 0) + (p.slechtTerBeenCount || 0) + (p.ouderenCount || 0);
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

function openOver() {
  _openModal(document.getElementById('over-overlay'), 'open', '.help-close-x');
}

function closeOver() {
  _closeModal(document.getElementById('over-overlay'), 'open');
}

/* ─── SCENARIO-KEUZE RENDERER ─────────────────────────────────────────────────
   Bouwt de scenario-kaarten dynamisch op basis van het spelersprofiel.
   Omgevingsspecifieke scenario's worden alleen getoond als ze passen bij
   de omgeving die de speler opgegeven heeft in de intake.
   Volgorde: korst-durend bovenaan, langst-durend onderaan.
*/
function renderScenarioKeuze() {
  const loc = (typeof profile !== 'undefined' && profile.location) ? profile.location : [];
  const hasChildren = !!(typeof profile !== 'undefined' && profile.hasChildren);

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
      label: hasChildren ? 'Extra keuzes met kinderen' : 'Specifiek voor jouw omgeving',
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
      label: hasChildren ? 'Extra keuzes met kinderen' : 'Specifiek voor jouw omgeving',
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
  startMenuPage(0);
  gearPage(0);
  checkSave();
  const corner = document.getElementById('scene-id-corner');
  if (corner) corner.textContent = 'start';
});
