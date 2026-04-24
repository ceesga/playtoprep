// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Intake — Huishoud-setup flow (Stap 1)
// Bevat: capturePortraitSnapshot, gotoIntake, renderNameStep,
//        renderIntake, intakePick, intakeNext, intakePrev
//
// Huishoud-stap renderers: zie intake-steps.js
// Avatar-picker: zie avatar-picker.js
// ═══════════════════════════════════════════════════════════════
/* ─── PORTRAIT SNAPSHOT ────────────────────────────────────────────────────────
   Tekent de live #hh-stage (met alle zichtbare img-elementen) op een <canvas>
   en slaat het resultaat op als data-URL in portraitSnapshot.
   Moet worden aangeroepen VOORDAT de intake-scherm verborgen wordt,
   anders geeft getBoundingClientRect() nullen terug.
*/
function capturePortraitSnapshot() {
  const stage = document.getElementById('hh-stage');
  if (!stage) return;

  const stageRect = stage.getBoundingClientRect();
  const W = Math.round(stageRect.width);
  const H = Math.round(stageRect.height);
  if (W === 0 || H === 0) return; // Stage niet zichtbaar — sla over

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Teken alle zichtbare afbeeldingen in DOM-volgorde (= z-index volgorde)
  const imgs = Array.from(stage.querySelectorAll('img'));
  for (const img of imgs) {
    const cs = window.getComputedStyle(img);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue; // Onzichtbare afbeeldingen overslaan
    if (!img.src || img.naturalWidth === 0) continue; // Afbeelding nog niet geladen of leeg

    // Bereken positie van de afbeelding relatief aan de stage
    const r = img.getBoundingClientRect();
    const x = Math.round(r.left - stageRect.left);
    const y = Math.round(r.top  - stageRect.top);
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (w === 0 || h === 0) continue; // Geen zichtbaar formaat, overslaan

    try {
      ctx.drawImage(img, x, y, w, h);
    } catch (e) {
      // Tainted canvas — waarschijnlijk file://-protocol
      console.warn('[Portrait] Canvas draw geblokkeerd:', e.message);
      portraitSnapshot = null;
      return;
    }
  }

  try {
    portraitSnapshot = canvas.toDataURL('image/png'); // Sla de afbeelding op als PNG data-URL
  } catch (e) {
    // toDataURL ook geblokkeerd (file://)
    console.warn('[Portrait] Snapshot niet opgeslagen (waarschijnlijk file://):', e.message);
    portraitSnapshot = null;
  }
}

/* ─── GOTO INTAKE ─────────────────────────────────────────────────────────────
   Reset alle intake-variabelen naar beginwaarden en navigeert naar
   het eerste stap van de intake-flow (naamstap, intakeStep = -5).
*/
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePlayerName(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 30);
}

function setPlayerName(value) {
  profile.playerName = normalizePlayerName(value);
}

function handlePickerTriggerKey(event, index, type) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openAvatarPicker(index, type);
}

function handleSetupOptionKey(event, kind, value) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  if (kind === 'house') selectHouseType(value);
  if (kind === 'vehicle') toggleVehicle(value);
  if (kind === 'environment') selectEnvironment(value);
}

function resetSetupFlowState() {
  resetObjectToDefaults(profile, PROFILE_DEFAULTS);
  intakeStep = -6; // Begin bij de naamstap (stap -6 is de eerste stap)
  intakeAnswers = {};
  adultsCount = 1;     // Minimaal één volwassene
  childrenCount = 0;
  slechtTerBeenCount = 0;
  ouderenCount = 0;
  petsCount = 0;
  selectedHouseType = null;
  selectedOverigeSubType = null;
  selectedVehicles = [];
  selectedEnvironment = [];
  selectedPlayerPerson = null;
  avatarSelections = {
    adults: [],
    children: [],
    slechtTerBeen: [],
    ouderen: [],
    pets: []
  };
  portraitSnapshot = null;
}

function gotoIntake() {
  resetSetupFlowState();
  renderIntake();
  show('s-intake');
}

/* ─── NAAMSTAP ────────────────────────────────────────────────────────────────
   Rendert het invoerveld voor de naam van de speler (stap -5).
   De naam wordt direct in profile.playerName opgeslagen via oninput.
*/
function renderNameStep() {
  const household = document.getElementById('intake-household');
  const layout = document.getElementById('intake-layout');
  layout.style.display = 'none';      // Verberg de standaard kaart-layout
  household.style.display = 'flex';   // Toon het huishoud-container element (flex: behoudt kolom-layout)
  const playerName = escapeHtml(profile.playerName || '');
  household.innerHTML = `
    <div class="name-step-wrap">
      <label class="sub" for="player-name-input">Wat is je voornaam?</label>
      <input type="text" id="player-name-input" class="name-input"
        placeholder="Jouw naam"
        value="${playerName}"
        maxlength="30"
        autocomplete="given-name"
        oninput="setPlayerName(this.value)">
    </div>`;
  const controls = document.getElementById('intake-controls');
  if (controls) controls.innerHTML = '';
  document.getElementById('intake-next').disabled = false; // Naam is optioneel, Volgende altijd toegankelijk
  setTimeout(() => document.getElementById('player-name-input')?.focus(), 50); // Geef invoerveld autofocus na render
}

/* ─── RENDER INTAKE ───────────────────────────────────────────────────────────
   Hoofd-renderfunction van de intake-flow. Bepaalt op basis van intakeStep
   welke substap getoond moet worden en delegeert naar de juiste render-functie.
   Stappen -5 t/m -1 zijn de huishoud-setup; stap 0 en hoger zijn kaart-vragen.
*/
function renderIntake() {
  const totalSteps = intakeQs.length + 6; // Totaal: 6 vaste stappen + kaart-vragen

  // Bereken het huidige stapnummer voor de voortgangsbalk (0-gebaseerd)
  const progressStep = intakeStep === -6 ? 0 : intakeStep === -5 ? 1 : intakeStep === -4 ? 2 : intakeStep === -3 ? 3 : intakeStep === -2 ? 4 : intakeStep === -1 ? 5 : intakeStep + 6;
  // Schaalt de voortgangsbalk: begint op 12% en loopt lineair door naar 60%
  document.getElementById('intake-prog').style.transform = 'scaleX(' + (12 + progressStep / totalSteps * 48) / 100 + ')';

  // Vaste titels voor de huishoud-setup stappen
  const intakeTitles = {
    '-6': 'Hoe heet je?',
    '-5': 'Hoe ziet jouw huishouden eruit?',
    '-4': 'Welke van deze personen ben jij?',
    '-3': 'In wat voor type woning woon je?',
    '-2': 'Welke vervoersmiddelen heb je?',
    '-1': 'In welke omgeving woon je?'
  };
  const titleEl = document.getElementById('intake-title');
  // Gebruik de vaste titel of de vraag-tekst van de huidige kaart-vraag
  if (titleEl) titleEl.textContent = intakeTitles[intakeStep] || (intakeQs[intakeStep] ? intakeQs[intakeStep].q : '');

  // Debug-codes in de hoek van het scherm voor identificatie van de huidige stap
  const stepCodes = { '-6': 'intake_naam', '-5': 'intake_mensen', '-4': 'intake_wie_ben_jij', '-3': 'intake_woning', '-2': 'intake_voertuigen', '-1': 'intake_omgeving' };
  const corner = document.getElementById('scene-id-corner');
  if (corner) corner.textContent = stepCodes[intakeStep] || ('intake_' + (intakeQs[intakeStep] ? intakeQs[intakeStep].id : intakeStep));
  document.getElementById('intake-prev').style.display = ''; // Vorige-knop altijd zichtbaar

  const household = document.getElementById('intake-household');
  const layout = document.getElementById('intake-layout');
  const instrEl = document.getElementById('intake-instruction');
  if (instrEl) instrEl.style.display = 'none'; // verberg standaard; renderHouseholdStep toont het opnieuw

  // Delegeer naar de juiste stap-renderer op basis van intakeStep
  if (intakeStep === -6) {
    renderNameStep();
    return;
  }

  if (intakeStep === -5) {
    layout.style.display = 'none';
    household.style.display = 'flex';
    renderHouseholdStep();
    document.getElementById('intake-next').disabled = false; // Altijd doorgaan mogelijk
    return;
  }

  if (intakeStep === -4) {
    layout.style.display = 'none';
    household.style.display = 'flex';
    renderWieBenJijStep();
    return;
  }

  if (intakeStep === -3) {
    layout.style.display = 'none';
    household.style.display = 'flex';
    renderHouseStep();
    // Volgende alleen mogelijk als er een woningtype gekozen is
    document.getElementById('intake-next').disabled = selectedHouseType === null;
    return;
  }

  if (intakeStep === -2) {
    layout.style.display = 'none';
    household.style.display = 'flex';
    renderVehicleStep();
    document.getElementById('intake-next').disabled = false; // Geen voertuig is ook een geldige keuze
    return;
  }

  if (intakeStep === -1) {
    layout.style.display = 'none';
    household.style.display = 'flex';
    renderEnvironmentStep();
    document.getElementById('intake-next').disabled = false;
    return;
  }

  // Stap 0 en hoger: gewone kaart-vragen uit intakeQs
  household.style.display = 'none';
  layout.style.display = 'flex';

  const q = intakeQs[intakeStep];
  document.getElementById('intake-next').disabled = true; // Verplicht een antwoord bij kaart-vragen
  intakeAnswers[q.id] = q.multi ? [] : null; // Reset het antwoord voor deze vraag
  let html = `${q.multi ? '<p class="sub" style="margin-bottom:14px">Meerdere antwoorden mogelijk.</p>' : ''}`;
  html += `<div class="cards${q.opts.length <= 2 ? ' single' : ''}">`;
  q.opts.forEach(o => {
    html += `<button class="choice-card${q.multi ? ' multi' : ''}" data-val="${o.val}" aria-label="${o.label}" onclick="intakePick(this,'${q.id}',${q.multi},'${o.val}')">
      <div class="icon">${o.icon}</div><div>${o.label}</div></button>`;
  });
  html += '</div>';
  document.getElementById('intake-body').innerHTML = html;
  updateCharacterPreview(); // Ververs de zijbalk-preview na het renderen
}

/* ─── INTAKE PICK ─────────────────────────────────────────────────────────────
   Verwerkt een klik op een antwoordkaart.
   Bij enkelvoudige vragen: selecteer de geklikte kaart en schakel alle andere uit.
   Bij meervoudige vragen: toggle de selectie; 'none' wist alle andere keuzes.
*/
function intakePick(el, id, multi, val) {
  if (!multi) {
    // Enkelvoudige keuze: deactiveer alle kaarten en activeer alleen de geklikte
    document.querySelectorAll('#intake-body .choice-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    intakeAnswers[id] = val;
    document.getElementById('intake-next').disabled = false; // Antwoord gegeven, Volgende inschakelen
  } else {
    if (val === 'none') {
      // 'Geen'-optie: deactiveer alle andere keuzes
      document.querySelectorAll('#intake-body .choice-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      intakeAnswers[id] = ['none'];
    } else {
      // Reguliere multi-select: verwijder 'none' als er een echte optie gekozen wordt
      const nb = document.querySelector('#intake-body .choice-card[data-val="none"]');
      if (nb) nb.classList.remove('selected');
      el.classList.toggle('selected'); // Toggle de visuele selectie-staat
      const arr = intakeAnswers[id].filter(v => v !== 'none'); // Verwijder 'none' uit de array
      const i = arr.indexOf(val);
      if (i > -1) arr.splice(i, 1); // Reeds geselecteerd: verwijder uit de array
      else arr.push(val);           // Nog niet geselecteerd: voeg toe aan de array
      intakeAnswers[id] = arr;
    }
    // Bij multi-select is Volgende pas actief als er minstens één keuze is
    document.getElementById('intake-next').disabled = intakeAnswers[id].length === 0;
  }
  updateCharacterPreview(); // Ververs de preview na iedere wijziging
}


function intakeNext() {
  const a = intakeAnswers;

  // Stap -6: naam → stap -5: mensen
  if (intakeStep === -6) {
    intakeStep = -5;
    renderIntake();
    return;
  }

  // Stap -5: mensen → stap -4: wie ben jij
  // Sla huishoud-samenstelling op in het profile-object
  if (intakeStep === -5) {
    profile.members = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
    profile.adults = adultsCount + slechtTerBeenCount + ouderenCount; // Ouderen tellen mee als volwassene
    profile.hasChildren = childrenCount > 0;
    profile.childrenCount = childrenCount;
    profile.hasElderly = ouderenCount > 0;            // Echte ouderen-categorie
    profile.ouderenCount = ouderenCount;
    profile.hasMobilityImpaired = slechtTerBeenCount > 0;
    profile.hasPets = petsCount > 0;
    // Auto-selecteer de enige persoon als het huishouden maar één persoon heeft
    const totalPersons = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
    if (totalPersons === 1) {
      if (adultsCount === 1) selectedPlayerPerson = { type: 'adult', index: 0 };
      else if (ouderenCount === 1) selectedPlayerPerson = { type: 'ouderen', index: 0 };
      else if (slechtTerBeenCount === 1) selectedPlayerPerson = { type: 'slechtTerBeen', index: 0 };
      else if (childrenCount === 1) selectedPlayerPerson = { type: 'child', index: 0 };
    } else {
      selectedPlayerPerson = null; // Reset bij meerdere personen
    }
    intakeStep = -4;
    renderIntake();
    return;
  }

  // Stap -4: wie ben jij → stap -3: woning
  if (intakeStep === -4) {
    if (selectedPlayerPerson) {
      profile.playerPersonType = selectedPlayerPerson.type;
      profile.playerIsMobilityImpaired = selectedPlayerPerson.type === 'slechtTerBeen';
      profile.playerIsElderly = selectedPlayerPerson.type === 'ouderen';
    }
    intakeStep = -3;
    renderIntake();
    return;
  }

  // Stap -3: woning → stap -2: voertuigen
  if (intakeStep === -3) {
    profile.houseType = selectedHouseType;
    profile.houseSubType = selectedHouseType === 'overige' ? selectedOverigeSubType : '';
    intakeStep = -2;
    renderIntake();
    return;
  }

  // Stap -2: voertuigen → stap -1: omgeving
  if (intakeStep === -2) {
    profile.hasCar        = selectedVehicles.includes('auto');
    profile.hasBike       = selectedVehicles.includes('fiets');
    profile.hasMotorcycle = selectedVehicles.includes('motor');
    profile.hasScooter    = selectedVehicles.includes('scooter');
    profile.hasEbike      = selectedVehicles.includes('e-bike');
    intakeStep = -1;
    renderIntake();
    return;
  }

  // Stap -1: omgeving → prep
  if (intakeStep === -1) {
    // Vertaal Nederlandse omgevingsnamen naar Engelse profielwaarden
    const envMap = {
      water: 'water',
      bos: 'forest',
      buitengebied: 'rural_area',
      stedelijk: 'city'
    };
    profile.location = selectedEnvironment.map(e => envMap[e]).filter(Boolean);
    profile.intakeCompleted = true;
    // Snapshot maken VOORDAT het scherm verborgen wordt (anders zijn coördinaten nul)
    capturePortraitSnapshot();
    gotoPrep();
    return;
  }
}

// Navigeert terug naar de vorige intakestap, of naar het uitleg-scherm als we op stap -5 zijn
function intakePrev() {
  if (intakeStep === -6) {
    show('s-uitleg');
    return;
  } else if (intakeStep === -5) {
    intakeStep = -6;
  } else if (intakeStep === -4) {
    intakeStep = -5;
  } else if (intakeStep === -3) {
    intakeStep = -4;
  } else if (intakeStep === -2) {
    intakeStep = -3;
  } else if (intakeStep === -1) {
    intakeStep = -2;
  } else if (intakeStep === 0) {
    intakeStep = -1; // Van eerste kaart-vraag terug naar omgevingsstap
  } else {
    intakeStep--; // Gewone kaart-vragen: één stap terug
  }
  renderIntake();
}
