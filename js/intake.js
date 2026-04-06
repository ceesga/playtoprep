// ═══════════════════════════════════════════════════════════════
// Intake — Huishoud-setup flow (Stap 1)
// Stappen: mensen → woning → vervoer → omgeving
// Bevat: figuur-rendering, avatar-picker, intakeNext/Prev
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

function gotoIntake() {
  intakeStep = -5; // Begin bij de naamstap (stap -5 is de eerste stap)
  profile.playerName = '';
  adultsCount = 1;     // Minimaal één volwassene
  childrenCount = 0;
  slechtTerBeenCount = 0;
  petsCount = 0;
  selectedHouseType = null;
  selectedVehicles = [];
  selectedEnvironment = [];
  avatarSelections = {
    adults: [],
    children: [],
    slechtTerBeen: [],
    pets: []
  };
  portraitSnapshot = null; // Reset snapshot bij nieuwe intake
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
  household.style.display = 'block';  // Toon het huishoud-container element
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
  document.getElementById('intake-next').disabled = false; // Naam is optioneel, Volgende altijd toegankelijk
  setTimeout(() => document.getElementById('player-name-input')?.focus(), 50); // Geef invoerveld autofocus na render
}

/* ─── RENDER INTAKE ───────────────────────────────────────────────────────────
   Hoofd-renderfunction van de intake-flow. Bepaalt op basis van intakeStep
   welke substap getoond moet worden en delegeert naar de juiste render-functie.
   Stappen -5 t/m -1 zijn de huishoud-setup; stap 0 en hoger zijn kaart-vragen.
*/
function renderIntake() {
  const totalSteps = intakeQs.length + 5; // Totaal: 5 vaste stappen + kaart-vragen

  // Bereken het huidige stapnummer voor de voortgangsbalk (0-gebaseerd)
  const progressStep = intakeStep === -5 ? 0 : intakeStep === -4 ? 1 : intakeStep === -3 ? 2 : intakeStep === -2 ? 3 : intakeStep === -1 ? 4 : intakeStep + 5;
  // Schaalt de voortgangsbalk: begint op 12% en loopt lineair door naar 60%
  document.getElementById('intake-prog').style.transform = 'scaleX(' + (12 + progressStep / totalSteps * 48) / 100 + ')';

  // Vaste titels voor de huishoud-setup stappen
  const intakeTitles = {
    '-5': 'Hoe heet je?',
    '-4': 'Hoe ziet jouw huishouden eruit?',
    '-3': 'In wat voor type woning woon je?',
    '-2': 'Welke vervoersmiddelen heb je?',
    '-1': 'In welke omgeving woon je?'
  };
  const titleEl = document.getElementById('intake-title');
  // Gebruik de vaste titel of de vraag-tekst van de huidige kaart-vraag
  if (titleEl) titleEl.textContent = intakeTitles[intakeStep] || (intakeQs[intakeStep] ? intakeQs[intakeStep].q : '');

  // Debug-codes in de hoek van het scherm voor identificatie van de huidige stap
  const stepCodes = { '-5': 'intake_naam', '-4': 'intake_mensen', '-3': 'intake_woning', '-2': 'intake_voertuigen', '-1': 'intake_omgeving' };
  const corner = document.getElementById('scene-id-corner');
  if (corner) corner.textContent = stepCodes[intakeStep] || ('intake_' + (intakeQs[intakeStep] ? intakeQs[intakeStep].id : intakeStep));
  document.getElementById('intake-prev').style.display = ''; // Vorige-knop altijd zichtbaar

  const household = document.getElementById('intake-household');
  const layout = document.getElementById('intake-layout');

  // Delegeer naar de juiste stap-renderer op basis van intakeStep
  if (intakeStep === -5) {
    renderNameStep();
    return;
  }

  if (intakeStep === -4) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderHouseholdStep();
    document.getElementById('intake-next').disabled = false; // Altijd doorgaan mogelijk
    return;
  }

  if (intakeStep === -3) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderHouseStep();
    // Volgende alleen mogelijk als er een woningtype gekozen is
    document.getElementById('intake-next').disabled = selectedHouseType === null;
    return;
  }

  if (intakeStep === -2) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderVehicleStep();
    document.getElementById('intake-next').disabled = false; // Geen voertuig is ook een geldige keuze
    return;
  }

  if (intakeStep === -1) {
    layout.style.display = 'none';
    household.style.display = 'block';
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

/* ─── STANDAARD AVATAR LIJSTEN ────────────────────────────────────────────────
   Volgorde bepaalt welke avatar als standaard wordt gekozen voor elke positie.
*/
const ADULT_DEFAULTS = ['man-1', 'woman-1', 'man-3', 'woman-3', 'man-4', 'woman-4'];

// Geeft de standaard avatar-naam voor een volwassene op index i (roteert door de lijst)
function defaultAdultAvatar(i) {
  return ADULT_DEFAULTS[i % ADULT_DEFAULTS.length];
}

// Geeft de standaard avatar-naam voor een kind op index i
// Even indices zijn jongens, oneven zijn meisjes; nummer loopt op per paar
function defaultChildAvatar(i) {
  const isGirl = i % 2 === 1;
  const num = Math.floor(i / 2) + 1;
  return isGirl ? `girl-${Math.min(num, 3)}` : `boy-${Math.min(num, 2)}`; // Max girl-3 en boy-2
}

// Geeft de standaard avatar-naam voor een slecht-ter-been persoon op index i
function defaultStbAvatar(i) {
  return STB_AVATARS[i % STB_AVATARS.length];
}

/* ─── FIGURE RENDERING HELPER ──────────────────────────────────────────────────
   Hulpconstanten en -functies voor het renderen van de personenfiguren in de stage.
*/
const FIGURE_OVERLAP_PX = 28; // Aantal pixels overlap tussen figuren voor een naturel groepseffect

// Individuele schaalfactoren per huisdier (ten opzichte van standaard petH)
const PET_SCALE = {
  hond:    1.30, // Honden zijn groter dan standaard
  kat:     0.80, // Katten zijn kleiner dan standaard
  konijn:  1.00, // Konijnen op standaardgrootte
  hamster: 0.40, // Hamsters zijn veel kleiner
  paard:   2.00, // Paarden zijn aanzienlijk groter
};

/* Bouwt de HTML-string voor de personenfiguren in de stage.
   Berekent hoogte per persoon op basis van het totale aantal personen.
   Figuren in het midden hebben een hogere z-index (staan voor de anderen).
   @param heightTable  array van hoogtes geïndexeerd op totaal aantal personen
   @param clickable    als true, worden figuren klikbaar voor avatar-selectie
*/
function buildFigures(heightTable, clickable = false) {
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;
  const total = totalPersons + petsCount;
  // Hoogte van volwassene neemt af naarmate er meer personen zijn
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const childH = Math.round(adultH * 0.78);  // Kinderen zijn 78% van de volwassenehoogte
  const petH = Math.round(adultH * 0.38);    // Basisgrootte voor huisdieren

  // Alleen personen in de flex-rij (geen huisdieren hier)
  const figList = [];
  for (let i = 0; i < adultsCount; i++) figList.push({ type: 'adult', idx: i });
  for (let i = 0; i < childrenCount; i++) figList.push({ type: 'child', idx: i });
  for (let i = 0; i < slechtTerBeenCount; i++) figList.push({ type: 'slechtTerBeen', idx: i });

  return figList.map((fig, pos) => {
    // Figuren dichter bij het midden krijgen een hogere z-index (staan voor de anderen)
    const dist = Math.abs(pos - (figList.length - 1) / 2);
    const zIndex = Math.round((figList.length - dist) * 10);
    // Alle figuren behalve de eerste schuiven gedeeltelijk over de vorige heen
    const ml = pos === 0 ? 0 : -FIGURE_OVERLAP_PX;
    // Bepaal de juiste submap voor de afbeelding
    const folder = fig.type === 'adult' ? 'adult' : fig.type === 'child' ? 'child' : 'slecht%20ter%20been';
    // Haal de geselecteerde avatar op voor dit figuur
    const av = fig.type === 'adult' ? avatarSelections.adults[fig.idx] :
      fig.type === 'child' ? avatarSelections.children[fig.idx] :
      avatarSelections.slechtTerBeen[fig.idx];
    // Rollende/zittende STB-avatars (manx-2 / womanx-2) hebben kind-hoogte
    const isSitting = fig.type === 'slechtTerBeen' && (av === 'manx-2' || av === 'womanx-2');
    const h = (fig.type === 'child' || isSitting) ? childH : adultH;
    const label = fig.type === 'adult' ? 'Volwassene aanpassen' : fig.type === 'child' ? 'Kind aanpassen' : 'Persoon met beperkte mobiliteit aanpassen';
    const click = clickable ? ` role="button" tabindex="0" aria-label="${label}" onclick="openAvatarPicker(${fig.idx},'${fig.type}')" onkeydown="handlePickerTriggerKey(event,${fig.idx},'${fig.type}')" title="Klik om te wijzigen"` : '';
    return `<div class="char-fig ${fig.type}"${click} style="z-index:${zIndex};margin-left:${ml}px">
      <img src="afbeelding/avatars/${folder}/${av}.png" alt="${fig.type === 'adult' ? 'Volwassen persoon' : fig.type === 'child' ? 'Kind' : 'Persoon met beperkte mobiliteit'}" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

/* Bouwt de HTML-string voor huisdieren als absolute overlay vóór de personenrij.
   Huisdieren worden apart geplaatst zodat ze niet de flex-rij van personen verstoren.
   @param heightTable  array van hoogtes geïndexeerd op totaal aantal personen
   @param clickable    als true, worden huisdieren klikbaar voor avatar-selectie
*/
function buildPetOverlay(heightTable, clickable = false) {
  if (petsCount === 0) return ''; // Geen huisdieren, geen overlay nodig
  const total = adultsCount + childrenCount + slechtTerBeenCount + petsCount;
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const petH   = Math.round(adultH * 0.38); // Basisgrootte voor huisdieren

  return Array.from({ length: petsCount }, (_, i) => {
    const av = avatarSelections.pets[i];
    const h  = Math.round(petH * (PET_SCALE[av] || 1.0)); // Pas hoogte aan met soort-specifieke schaalfactor
    const click = clickable ? ` role="button" tabindex="0" aria-label="Huisdier aanpassen" onclick="openAvatarPicker(${i},'pet')" onkeydown="handlePickerTriggerKey(event,${i},'pet')" title="Klik om te wijzigen"` : '';
    return `<div class="char-fig pet"${click} style="z-index:999">
      <img src="afbeelding/avatars/pets/${av}.png" alt="Huisdier" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

/* ─── HUISHOUDSTAP ────────────────────────────────────────────────────────────
   Rendert stap -4: stel het huishouden in met tellers voor volwassenen,
   kinderen, slecht-ter-been en huisdieren. Synchroniseert eerst de
   avatarSelections-arrays met de actuele tellerwaarden.
*/
function renderHouseholdStep() {
  // Sync avatarSelections arrays to current counts
  // Verwijder overtollige avatars als de teller gedaald is
  avatarSelections.adults = avatarSelections.adults.slice(0, adultsCount);
  // Voeg nieuwe standaard-avatars toe als de teller gestegen is
  while (avatarSelections.adults.length < adultsCount) avatarSelections.adults.push(defaultAdultAvatar(avatarSelections.adults.length));
  avatarSelections.children = avatarSelections.children.slice(0, childrenCount);
  while (avatarSelections.children.length < childrenCount) avatarSelections.children.push(defaultChildAvatar(avatarSelections.children.length));
  avatarSelections.pets = avatarSelections.pets.slice(0, petsCount);
  while (avatarSelections.pets.length < petsCount) avatarSelections.pets.push(PET_AVATARS[avatarSelections.pets.length % PET_AVATARS.length]);
  avatarSelections.slechtTerBeen = avatarSelections.slechtTerBeen.slice(0, slechtTerBeenCount);
  while (avatarSelections.slechtTerBeen.length < slechtTerBeenCount) avatarSelections.slechtTerBeen.push(defaultStbAvatar(avatarSelections.slechtTerBeen.length));

  // Hoogtetabel: index = totaal aantal personen+dieren, waarde = hoogte in px van een volwassene
  const ht = [0, 280, 260, 240, 220, 205, 190, 178, 168, 158, 150, 142, 135];
  const figures    = buildFigures(ht, true);    // Figuren zijn klikbaar in deze stap
  const petOverlay = buildPetOverlay(ht, true); // Huisdieren ook klikbaar
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;

  // Blokkeer de + knoppen zodra het maximum aantal huishoudsleden bereikt is
  const atMax = totalPersons >= MAX_HOUSEHOLD;
  document.getElementById('intake-household').innerHTML = `
    <p style="padding:8px 32px 12px;font-size:.8rem;color:var(--c-text-faint)">Klik op een persoon of dier om die te veranderen.</p>
    <div id="hh-stage">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>
    <div id="hh-controls">
      <div class="hh-counter">
        <span class="hh-label">Volwassenen</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('adults',-1)" ${adultsCount<=1?'disabled':''} aria-label="Minder volwassenen">−</button>
          <span class="hh-count">${adultsCount}</span>
          <button class="hh-btn" onclick="changeCount('adults',1)" ${atMax?'disabled':''} aria-label="Meer volwassenen">+</button>
        </div>
      </div>
      <div class="hh-counter">
        <span class="hh-label">Jonge kinderen</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('children',-1)" ${childrenCount<=0?'disabled':''} aria-label="Minder kinderen">−</button>
          <span class="hh-count">${childrenCount}</span>
          <button class="hh-btn" onclick="changeCount('children',1)" ${atMax?'disabled':''} aria-label="Meer kinderen">+</button>
        </div>
      </div>
      <div class="hh-counter">
        <span class="hh-label">Slecht ter been</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('slechtTerBeen',-1)" ${slechtTerBeenCount<=0?'disabled':''} aria-label="Minder personen slecht ter been">−</button>
          <span class="hh-count">${slechtTerBeenCount}</span>
          <button class="hh-btn" onclick="changeCount('slechtTerBeen',1)" ${atMax?'disabled':''} aria-label="Meer personen slecht ter been">+</button>
        </div>
      </div>
      <div class="hh-counter">
        <span class="hh-label">Huisdieren</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('pets',-1)" ${petsCount<=0?'disabled':''} aria-label="Minder huisdieren">−</button>
          <span class="hh-count">${petsCount}</span>
          <button class="hh-btn" onclick="changeCount('pets',1)" ${petsCount>=MAX_PETS?'disabled':''} aria-label="Meer huisdieren">+</button>
        </div>
      </div>
    </div>`;
}

/* ─── WONINGSTAP ──────────────────────────────────────────────────────────────
   Rendert stap -3: kies het woningtype. Toont een grid met woningtype-opties
   en een live preview van het geselecteerde woningtype als achtergrond in de stage.
*/
function renderHouseStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);    // Figuren niet klikbaar in deze stap
  const petOverlay = buildPetOverlay(ht);

  // Bouw de woningtype-keuze-opties
  const houseOpts = HOUSE_TYPES.map(h =>
    `<div class="hh-house-opt${selectedHouseType === h.val ? ' selected' : ''}" data-val="${h.val}" role="button" tabindex="0" aria-pressed="${selectedHouseType === h.val}" aria-label="${h.label}" onclick="selectHouseType('${h.val}')" onkeydown="handleSetupOptionKey(event,'house','${h.val}')">
      <img src="afbeelding/avatars/woningtype/${h.val}.png" alt="${h.label}">
      <span>${h.label}</span>
    </div>`
  ).join('');

  // Laad achtergrondafbeelding alleen als er al een keuze is gemaakt
  const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';

  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${selectedHouseType ? 'visible' : ''}${selectedHouseType === 'appartement' ? ' house-appartement' : ''}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>
    <div id="hh-house-grid">${houseOpts}</div>`;
}

/* Verwerkt een klik op een woningtype-optie.
   Werkt de achtergrondafbeelding in de stage bij en schakelt de Volgende-knop in.
*/
function selectHouseType(val) {
  selectedHouseType = val;
  const bg = document.getElementById('hh-house-bg');
  if (bg) {
    bg.src = `afbeelding/avatars/woningtype/${val}.png`;
    bg.classList.add('visible');
    // Appartement-klasse geeft een afwijkende positionering van de achtergrond
    bg.classList.toggle('house-appartement', val === 'appartement');
  }
  // Markeer de geselecteerde optie in het grid
  document.querySelectorAll('.hh-house-opt').forEach(el => {
    const isSelected = el.dataset.val === val;
    el.classList.toggle('selected', isSelected);
    el.setAttribute('aria-pressed', String(isSelected));
  });
  document.getElementById('intake-next').disabled = false; // Keuze gemaakt, Volgende inschakelen
}

/* ─── VERVOERSTAP ─────────────────────────────────────────────────────────────
   Rendert stap -2: kies beschikbare vervoersmiddelen (auto en/of fiets).
   Geselecteerde voertuigen worden als overlays in de stage weergegeven.
*/
function renderVehicleStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';

  // Bouw de twee vervoersopties (auto en fiets)
  const vehicleOpts = ['auto', 'fiets'].map(v =>
    `<div class="hh-vehicle-opt${selectedVehicles.includes(v) ? ' selected' : ''}" data-val="${v}" role="button" tabindex="0" aria-pressed="${selectedVehicles.includes(v)}" aria-label="${v.charAt(0).toUpperCase() + v.slice(1)}" onclick="toggleVehicle('${v}')" onkeydown="handleSetupOptionKey(event,'vehicle','${v}')">
      <img src="afbeelding/avatars/vehicles/${v}.png" alt="${v}">
      <span>${v.charAt(0).toUpperCase() + v.slice(1)}</span>
    </div>`
  ).join('');

  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${selectedHouseType ? 'visible' : ''}${selectedHouseType === 'appartement' ? ' house-appartement' : ''}">
      <img class="hh-stage-vehicle left" data-val="fiets" src="afbeelding/avatars/vehicles/fiets.png" alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="auto" src="afbeelding/avatars/vehicles/auto.png" alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>
    <div id="hh-vehicle-row">${vehicleOpts}</div>`;
}

/* ─── OMGEVING OVERLAY BUILDER ────────────────────────────────────────────────
   Bouwt de HTML voor de visuele omgevingselementen in de stage (bomen, water, etc.).
   Retourneert alleen de HTML-strings voor de geselecteerde omgevingstypen.
*/
function buildEnvOverlay(envArr) {
  // Vaste HTML per omgevingstype — meerdere elementen voor rijker visueel effect
  const parts = {
    water: '',
    bos: '',
    buitengebied: '',
    stedelijk: ''
  };
  parts.water = `<img class="hh-env-element water" src="afbeelding/avatars/omgeving/river.png" alt="">`;
  parts.bos = `
    <img class="hh-env-element boom boom-1" src="afbeelding/avatars/omgeving/boom.png" alt="">
    <img class="hh-env-element boom boom-2" src="afbeelding/avatars/omgeving/boom.png" alt="">
    <img class="hh-env-element boom boom-3" src="afbeelding/avatars/omgeving/boom.png" alt="">`;
  parts.buitengebied = `
    <img class="hh-env-element schaap schaap-1" src="afbeelding/avatars/omgeving/schaap.png" alt="">
    <img class="hh-env-element schaap schaap-2" src="afbeelding/avatars/omgeving/schaap.png" alt="">
    <img class="hh-env-element schaap schaap-3" src="afbeelding/avatars/omgeving/schaap.png" alt="">
    <img class="hh-env-element schaap schaap-4" src="afbeelding/avatars/omgeving/schaap.png" alt="">`;
  parts.stedelijk = `<img class="hh-env-element stadsgebouw" src="afbeelding/avatars/omgeving/stadsgebouw.png" alt="">`;
  // Combineer alleen de HTML voor de geselecteerde omgevingstypen
  return envArr.map(e => parts[e] || '').join('');
}

/* ─── OMGEVINGSTAP ────────────────────────────────────────────────────────────
   Rendert stap -1: kies de omgeving(en) waar de gebruiker woont.
   Meerdere omgevingen kunnen tegelijk geselecteerd worden.
   De stage-overlay wordt live bijgewerkt bij iedere wijziging.
*/
function renderEnvironmentStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';
  // Bouw de omgevings-keuze-opties
  const envOpts = ENVIRONMENT_TYPES.map(e =>
    `<div class="hh-env-opt${selectedEnvironment.includes(e.val) ? ' selected' : ''}" data-val="${e.val}" role="button" tabindex="0" aria-pressed="${selectedEnvironment.includes(e.val)}" aria-label="${e.label}" onclick="selectEnvironment('${e.val}')" onkeydown="handleSetupOptionKey(event,'environment','${e.val}')">
      <div class="hh-env-thumb">${e.thumb}</div>
      <span>${e.label}</span>
    </div>`
  ).join('');

  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      ${buildEnvOverlay(selectedEnvironment)}
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${selectedHouseType ? 'visible' : ''}${selectedHouseType === 'appartement' ? ' house-appartement' : ''}">
      <img class="hh-stage-vehicle left" data-val="fiets" src="afbeelding/avatars/vehicles/fiets.png" alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="auto" src="afbeelding/avatars/vehicles/auto.png" alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>
    <div id="hh-env-grid">${envOpts}</div>`;
}

/* Togglet een omgevingstype in de selectedEnvironment-array.
   Herbouwt de omgevingstap zodat de stage-overlay direct bijgewerkt wordt.
   Volgende-knop blijft uitgeschakeld zolang er geen omgeving gekozen is.
*/
function selectEnvironment(val) {
  const idx = selectedEnvironment.indexOf(val);
  if (idx > -1) selectedEnvironment.splice(idx, 1); // Al geselecteerd: verwijder
  else selectedEnvironment.push(val);                // Nog niet geselecteerd: voeg toe
  document.getElementById('intake-next').disabled = selectedEnvironment.length === 0;
  renderEnvironmentStep(); // Herbouw de stap om de stage-overlay te verversen
}

/* Togglet een vervoersmiddel in de selectedVehicles-array.
   Werkt direct de zichtbaarheid van de voertuig-overlays in de stage bij
   zonder de hele stap te herbouwen.
*/
function toggleVehicle(val) {
  const idx = selectedVehicles.indexOf(val);
  if (idx > -1) selectedVehicles.splice(idx, 1); // Al geselecteerd: verwijder
  else selectedVehicles.push(val);               // Nog niet geselecteerd: voeg toe
  // Toon of verberg de voertuigafbeeldingen in de stage op basis van selectie
  document.querySelectorAll('.hh-stage-vehicle').forEach(el =>
    el.style.display = selectedVehicles.includes(el.dataset.val) ? 'block' : 'none'
  );
  // Synchroniseer de geselecteerde staat van de keuze-opties in het grid
  document.querySelectorAll('.hh-vehicle-opt').forEach(el => {
    const isSelected = selectedVehicles.includes(el.dataset.val);
    el.classList.toggle('selected', isSelected);
    el.setAttribute('aria-pressed', String(isSelected));
  });
}

/* Verhoogt of verlaagt een teller voor het huishouden en herrendert de stap.
   Bewaakt minimum- en maximumwaarden per type:
     - adults: minimaal 1
     - children / slechtTerBeen: minimaal 0
     - pets: 0 tot MAX_PETS
   Het totale aantal personen mag MAX_HOUSEHOLD niet overschrijden.
*/
function changeCount(type, delta) {
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;
  // Blokkeer verhoging van persoonstellingen als het maximum bereikt is
  if (delta > 0 && type !== 'pets' && totalPersons >= 6) return;
  if (type === 'adults') adultsCount = Math.max(1, adultsCount + delta);
  else if (type === 'children') childrenCount = Math.max(0, childrenCount + delta);
  else if (type === 'slechtTerBeen') slechtTerBeenCount = Math.max(0, slechtTerBeenCount + delta);
  else if (type === 'pets') petsCount = Math.max(0, Math.min(MAX_PETS, petsCount + delta));
  renderHouseholdStep(); // Herbouw de stap met de nieuwe teller-waarden
}

/* ─── KARAKTER PREVIEW ────────────────────────────────────────────────────────
   Werkt de zijbalk-preview bij tijdens de kaart-vragen (stap 0 en hoger).
   Toont volwassenen- en kinderfiguren met klikbare avatars.
*/
function updateCharacterPreview() {
  // Sidebar preview during card steps
  const container = document.getElementById('char-figures');
  if (!container) return;

  // Controleer of huisdieren geselecteerd zijn via de speciale-antwoorden-array
  const hasPets = Array.isArray(intakeAnswers.special) && intakeAnswers.special.includes('pets');

  let html = '';
  for (let i = 0; i < adultsCount; i++) {
    const av = avatarSelections.adults[i] || defaultAdultAvatar(i);
    html += `<div class="char-fig adult" role="button" tabindex="0" aria-label="Volwassene aanpassen" onclick="openAvatarPicker(${i},'adult')" onkeydown="handlePickerTriggerKey(event,${i},'adult')" title="Klik om te wijzigen">
      <img src="afbeelding/avatars/adult/${av}.png" alt="Volwassen persoon">
    </div>`;
  }
  for (let i = 0; i < childrenCount; i++) {
    const av = avatarSelections.children[i] || defaultChildAvatar(i);
    html += `<div class="char-fig child" role="button" tabindex="0" aria-label="Kind aanpassen" onclick="openAvatarPicker(${i},'child')" onkeydown="handlePickerTriggerKey(event,${i},'child')" title="Klik om te wijzigen">
      <img src="afbeelding/avatars/child/${av}.png" alt="Kind">
    </div>`;
  }
  if (hasPets) html += `<div class="char-pet">🐕</div>`; // Vereenvoudigd huisdier-icoon in de zijbalk

  container.innerHTML = html;
}

/* Geeft het pad terug naar de afbeelding van de primaire avatar (eerste volwassene).
   Valt terug op slecht-ter-been of kind als er geen volwassene beschikbaar is.
   Wordt gebruikt voor de huishoudindicator in de samenvatting.
*/
function getPrimaryAvatarPath() {
  if (avatarSelections.adults && avatarSelections.adults[0]) {
    return `afbeelding/avatars/adult/${avatarSelections.adults[0]}.png`;
  }
  if (avatarSelections.slechtTerBeen && avatarSelections.slechtTerBeen[0]) {
    return `afbeelding/avatars/slecht%20ter%20been/${avatarSelections.slechtTerBeen[0]}.png`;
  }
  if (avatarSelections.children && avatarSelections.children[0]) {
    return `afbeelding/avatars/child/${avatarSelections.children[0]}.png`;
  }
  return ''; // Geen avatar beschikbaar
}

/* Werkt de huishoudindicator bij in het scenario-startscherm (ss-).
   Toont het gezicht van de primaire avatar, het aantal personen en de naam.
*/
function renderHouseholdIndicator() {
  const faceEl = document.getElementById('ss-household-face');
  const countEl = document.getElementById('ss-household-count');
  const nameEl = document.getElementById('ss-player-name');
  if (!faceEl || !countEl) return;

  const avatarPath = getPrimaryAvatarPath();
  // Toon avatar-afbeelding of fallback-icoon als er geen avatar is
  faceEl.innerHTML = avatarPath ?
    `<img src="${avatarPath}" alt="">` :
    '<span>👤</span>';

  const persons = adultsCount + childrenCount + slechtTerBeenCount;
  countEl.textContent = persons === 1 ? '1 pers.' : `${persons} pers.`;

  if (nameEl) nameEl.textContent = profile.playerName || '';
}

/* ─── AVATAR LIJSTEN ──────────────────────────────────────────────────────────
   Beschikbare avatar-namen per categorie. De bestandsnamen komen overeen
   met PNG-bestanden in de afbeelding/avatars/-submappen.
*/
const ADULT_AVATARS = ['man-1', 'man-3', 'man-4', 'man-5', 'man-6',
  'woman-1', 'woman-3', 'woman-4', 'woman-5', 'woman-6'
];
const CHILD_AVATARS = ['boy-1', 'boy-2', 'girl-1', 'girl-2', 'girl-3'];
const STB_AVATARS = ['manx-1', 'womanx-1', 'manx-2', 'womanx-2']; // Slecht-ter-been avatars
const PET_AVATARS = ['hond', 'kat', 'konijn', 'hamster', 'paard'];

/* ─── AVATAR PICKER ───────────────────────────────────────────────────────────
   Opent de avatar-picker voor een specifiek figuur (op index en type).
   In de huishoud-stappen (-4 t/m -1) wordt de picker in #hh-avatar-picker getoond;
   bij kaart-vragen in #avatar-picker.
   Klikken buiten de picker sluit hem via een eenmalige document-klik-listener.
*/
function openAvatarPicker(index, type) {
  // Sla op voor welk figuur de picker geopend is
  avatarPickerTarget = {
    index,
    type
  };
  // Kies de juiste picker-container op basis van de huidige stap
  const isHousehold = intakeStep <= -1;
  const pickerId = isHousehold ? 'hh-avatar-picker' : 'avatar-picker';
  const picker = document.getElementById(pickerId);
  if (!picker) return;

  // Bepaal de lijst en submap op basis van het type figuur
  const list = type === 'adult' ? ADULT_AVATARS : type === 'child' ? CHILD_AVATARS :
    type === 'slechtTerBeen' ? STB_AVATARS : PET_AVATARS;
  const folder = type === 'adult' ? 'adult' : type === 'child' ? 'child' :
    type === 'slechtTerBeen' ? 'slecht%20ter%20been' : 'pets';
  // Haal de huidig geselecteerde avatar op voor dit figuur
  const current = type === 'adult' ? avatarSelections.adults[index] :
    type === 'child' ? avatarSelections.children[index] :
    type === 'slechtTerBeen' ? avatarSelections.slechtTerBeen[index] :
    avatarSelections.pets[index];

  // Bouw een rij thumbnail-afbeeldingen; de actieve avatar krijgt de klasse 'active'
  picker.innerHTML = list.map(av =>
    `<img src="afbeelding/avatars/${folder}/${av}.png" alt="Avatar optie" class="${av === current ? 'active' : ''}"
      onclick="selectAvatar('${av}')">`
  ).join('') + (isHousehold ? `<button id="hh-picker-close" onclick="closePickerNow()">✕</button>` : '');
  picker.style.display = 'flex';

  // Voeg een eenmalige klik-listener toe om de picker te sluiten bij klikken buiten
  // Kleine vertraging voorkomt dat de openings-klik zelf de picker direct sluit
  setTimeout(() => document.addEventListener('click', closePicker, {
    once: true
  }), 10);
}

/* Slaat de gekozen avatar op voor het doelobject en sluit de picker.
   In huishoud-stappen wordt de relevante stap volledig herrenderd
   zodat de stage-afbeelding direct bijgewerkt wordt.
*/
function selectAvatar(av) {
  if (!avatarPickerTarget) return;
  const {
    index,
    type
  } = avatarPickerTarget;
  // Sla de keuze op in de juiste array op basis van het type
  if (type === 'adult') avatarSelections.adults[index] = av;
  else if (type === 'child') avatarSelections.children[index] = av;
  else if (type === 'slechtTerBeen') avatarSelections.slechtTerBeen[index] = av;
  else avatarSelections.pets[index] = av;
  const isHousehold = intakeStep <= -1;
  if (isHousehold) {
    avatarPickerTarget = null;
    // Herbouw de huidige huishoudstap om de nieuwe avatar direct te tonen
    if (intakeStep === -4) renderHouseholdStep();
    else if (intakeStep === -3) renderHouseStep();
    else if (intakeStep === -2) renderVehicleStep();
    else renderEnvironmentStep();
  } else {
    // In kaart-stappen: sluit alleen de picker en ververs de zijbalk-preview
    document.getElementById('avatar-picker').style.display = 'none';
    avatarPickerTarget = null;
    updateCharacterPreview();
  }
}

// Sluit de avatar-picker direct via de sluit-knop (✕) zonder te wachten op een buiten-klik
function closePickerNow() {
  const picker = document.getElementById('hh-avatar-picker') || document.getElementById('avatar-picker');
  if (picker) picker.style.display = 'none';
  avatarPickerTarget = null;
}

/* Sluit de avatar-picker als er buiten de picker geklikt wordt.
   Wordt eenmalig gebonden als document-klik-listener in openAvatarPicker.
*/
function closePicker(e) {
  const isHousehold = intakeStep <= -1;
  const pickerId = isHousehold ? 'hh-avatar-picker' : 'avatar-picker';
  const picker = document.getElementById(pickerId);
  // Sluit alleen als de klik buiten de picker-container plaatsvond
  if (picker && !picker.contains(e.target)) {
    picker.style.display = 'none';
    avatarPickerTarget = null;
  }
}

/* ─── INTAKE NAVIGATIE ────────────────────────────────────────────────────────
   intakeNext: beweegt naar de volgende stap en slaat de invoer van de huidige stap op.
   intakePrev: beweegt terug naar de vorige stap (of terug naar het uitleg-scherm).
*/
function intakeNext() {
  const a = intakeAnswers;

  // Stap -5: naam → stap -4: mensen
  if (intakeStep === -5) {
    intakeStep = -4;
    renderIntake();
    return;
  }

  // Stap -4: mensen → stap -3: woning
  // Sla huishoud-samenstelling op in het profile-object
  if (intakeStep === -4) {
    profile.members = adultsCount + childrenCount + slechtTerBeenCount; // Totaal aantal personen
    profile.adults = adultsCount + slechtTerBeenCount; // Slecht-ter-been telt mee als volwassene
    profile.hasChildren = childrenCount > 0;
    profile.childrenCount = childrenCount;
    profile.hasElderly = slechtTerBeenCount > 0;          // Alias voor mobiliteitsbeperking
    profile.hasMobilityImpaired = slechtTerBeenCount > 0;
    profile.hasPets = petsCount > 0;
    intakeStep = -3;
    renderIntake();
    return;
  }

  // Stap -3: woning → stap -2: voertuigen
  if (intakeStep === -3) {
    profile.houseType = selectedHouseType;
    intakeStep = -2;
    renderIntake();
    return;
  }

  // Stap -2: voertuigen → stap -1: omgeving
  if (intakeStep === -2) {
    profile.hasCar = selectedVehicles.includes('auto');
    profile.hasBike = selectedVehicles.includes('fiets');
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
    // Snapshot maken VOORDAT het scherm verborgen wordt (anders zijn coördinaten nul)
    capturePortraitSnapshot();
    gotoPrep();
    return;
  }
}

// Navigeert terug naar de vorige intakestap, of naar het uitleg-scherm als we op stap -5 zijn
function intakePrev() {
  if (intakeStep === -5) {
    show('s-uitleg'); // Helemaal terug naar het uitleg-scherm
    return;
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
