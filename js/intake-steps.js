// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Intake Steps — Huishoud-stap renderers
// Bevat: buildFigures, buildPetOverlay, renderHouseholdStep,
//        renderWieBenJijStep, renderHouseStep, renderVehicleStep,
//        renderEnvironmentStep en alle bijbehorende helpers
// ═══════════════════════════════════════════════════════════════
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

// Geeft de standaard avatar-naam voor een oudere op index i (afwisselend oma/opa)
function defaultOuderenAvatar(i) {
  return OUDEREN_AVATARS[i % OUDEREN_AVATARS.length];
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

const HOUSEHOLD_AVATAR_GROUPS = {
  adult: {
    key: 'adults',
    getCount: () => adultsCount,
    getDefaultAvatar: defaultAdultAvatar
  },
  child: {
    key: 'children',
    getCount: () => childrenCount,
    getDefaultAvatar: defaultChildAvatar
  },
  slechtTerBeen: {
    key: 'slechtTerBeen',
    getCount: () => slechtTerBeenCount,
    getDefaultAvatar: defaultStbAvatar
  },
  ouderen: {
    key: 'ouderen',
    getCount: () => ouderenCount,
    getDefaultAvatar: defaultOuderenAvatar
  },
  pet: {
    key: 'pets',
    getCount: () => petsCount,
    getDefaultAvatar: i => PET_AVATARS[i % PET_AVATARS.length]
  }
};

const FIGURE_TYPE_ORDER = ['adult', 'child', 'slechtTerBeen', 'ouderen'];

const VEHICLE_STAGE_ITEMS = [
  { val: 'fiets', side: 'left', src: 'fiets' },
  { val: 'scooter', side: 'left', src: 'scooter' },
  { val: 'e-bike', side: 'left', src: 'e-bike' },
  { val: 'auto', side: 'right', src: 'auto' },
  { val: 'motor', side: 'right', src: 'motor' }
];

function getHouseholdPersonCount() {
  return adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
}

function getHouseholdFigureCount() {
  return getHouseholdPersonCount() + petsCount;
}

function getAvatarFolder(type) {
  if (type === 'adult') return 'adult';
  if (type === 'child') return 'child';
  if (type === 'ouderen') return 'ouderen';
  if (type === 'pet') return 'pets';
  return 'slecht%20ter%20been';
}

function getAvatarSelection(type, index) {
  const group = HOUSEHOLD_AVATAR_GROUPS[type];
  return avatarSelections[group.key][index] || group.getDefaultAvatar(index);
}

function syncAvatarSelectionsToCounts() {
  Object.keys(HOUSEHOLD_AVATAR_GROUPS).forEach(type => {
    const group = HOUSEHOLD_AVATAR_GROUPS[type];
    const nextCount = group.getCount();
    avatarSelections[group.key] = avatarSelections[group.key].slice(0, nextCount);
    while (avatarSelections[group.key].length < nextCount) {
      avatarSelections[group.key].push(group.getDefaultAvatar(avatarSelections[group.key].length));
    }
  });
}

function getFigureDescriptors(includePets = false) {
  const figures = [];
  FIGURE_TYPE_ORDER.forEach(type => {
    const count = HOUSEHOLD_AVATAR_GROUPS[type].getCount();
    for (let i = 0; i < count; i++) {
      figures.push({ type, idx: i });
    }
  });
  if (includePets) {
    for (let i = 0; i < petsCount; i++) figures.push({ type: 'pet', idx: i });
  }
  return figures;
}

function isCompactFigure(type, avatar) {
  return type === 'child' || (type === 'slechtTerBeen' && (avatar === 'manx-2' || avatar === 'womanx-2'));
}

function getFigureAltText(type) {
  if (type === 'adult') return 'Volwassen persoon';
  if (type === 'child') return 'Kind';
  if (type === 'ouderen') return 'Oudere';
  if (type === 'pet') return 'Huisdier';
  return 'Beperkt mobiel persoon';
}

function getFigureActionLabel(type, action) {
  if (type === 'adult') return `Volwassene ${action}`;
  if (type === 'child') return `Kind ${action}`;
  if (type === 'ouderen') return `Oudere ${action}`;
  if (type === 'pet') return `Huisdier ${action}`;
  return `Beperkt mobiel persoon ${action}`;
}

function buildFigureActionAttrs(fig, mode, isSelected) {
  if (mode === 'avatar-picker') {
    return ` role="button" tabindex="0" aria-label="${getFigureActionLabel(fig.type, 'aanpassen')}" onclick="openAvatarPicker(${fig.idx},'${fig.type}')" onkeydown="handlePickerTriggerKey(event,${fig.idx},'${fig.type}')" title="Klik om te wijzigen"`;
  }
  if (mode === 'player-select') {
    return ` role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${getFigureActionLabel(fig.type, 'selecteren')}" onclick="selectPlayerPerson('${fig.type}',${fig.idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPlayerPerson('${fig.type}',${fig.idx})}"`;
  }
  return '';
}

function buildFigures(heightTable, mode = 'static') {
  const total = getHouseholdFigureCount();
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const childH = Math.round(adultH * 0.78);
  const figList = getFigureDescriptors(false);

  return figList.map((fig, pos) => {
    const dist = Math.abs(pos - (figList.length - 1) / 2);
    const zIndex = Math.round((figList.length - dist) * 10);
    const overlapPx = fig.type === 'ouderen' ? FIGURE_OVERLAP_PX + 16 : FIGURE_OVERLAP_PX;
    const ml = pos === 0 ? 0 : -overlapPx;
    const avatar = getAvatarSelection(fig.type, fig.idx);
    const isSelected = mode === 'player-select'
      && selectedPlayerPerson
      && selectedPlayerPerson.type === fig.type
      && selectedPlayerPerson.index === fig.idx;
    const h = isCompactFigure(fig.type, avatar) ? childH : adultH;
    const actionAttrs = buildFigureActionAttrs(fig, mode, isSelected);
    const selectedClass = isSelected ? ' wbj-selected' : '';
    return `<div class="char-fig ${fig.type}${selectedClass}"${actionAttrs} style="z-index:${zIndex};margin-left:${ml}px">
      <img src="afbeelding/avatars/${getAvatarFolder(fig.type)}/${avatar}.png" alt="${getFigureAltText(fig.type)}" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

/* Bouwt de HTML-string voor de personenfiguren in de stage.
   Berekent hoogte per persoon op basis van het totale aantal personen.
   Figuren in het midden hebben een hogere z-index (staan voor de anderen).
   @param heightTable  array van hoogtes geïndexeerd op totaal aantal personen en dieren
   @param mode         'static', 'avatar-picker' of 'player-select'
*/
function buildPetOverlay(heightTable, mode = 'static') {
  if (petsCount === 0) return ''; // Geen huisdieren, geen overlay nodig
  const total = getHouseholdFigureCount();
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const petH   = Math.round(adultH * 0.38); // Basisgrootte voor huisdieren

  return Array.from({ length: petsCount }, (_, i) => {
    const av = getAvatarSelection('pet', i);
    const h  = Math.round(petH * (PET_SCALE[av] || 1.0)); // Pas hoogte aan met soort-specifieke schaalfactor
    const click = mode === 'avatar-picker'
      ? ` role="button" tabindex="0" aria-label="${getFigureActionLabel('pet', 'aanpassen')}" onclick="openAvatarPicker(${i},'pet')" onkeydown="handlePickerTriggerKey(event,${i},'pet')" title="Klik om te wijzigen"`
      : '';
    return `<div class="char-fig pet"${click} style="z-index:999">
      <img src="afbeelding/avatars/pets/${av}.png" alt="Huisdier" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

function getSelectedHouseSrc() {
  if (selectedHouseType === 'overige') {
    return selectedOverigeSubType ? `afbeelding/avatars/woningtype/${selectedOverigeSubType}.png` : '';
  }
  if (!selectedHouseType) return '';
  const typeObj = HOUSE_TYPES.find(h => h.val === selectedHouseType);
  return typeObj ? houseImgSrc(typeObj) : '';
}

function buildHouseImageHtml(className, idAttr = '') {
  const styleClass = houseStijlKlasse(selectedHouseType);
  const classes = `${className}${selectedHouseType ? ' visible' : ''}${styleClass ? ' ' + styleClass : ''}`;
  return `<img${idAttr} class="${classes}" src="${getSelectedHouseSrc()}" alt="">`;
}

function buildStageVehiclesHtml(className = 'hh-stage-vehicle') {
  return VEHICLE_STAGE_ITEMS.map(vehicle => {
    const hiddenAttr = selectedVehicles.includes(vehicle.val) ? '' : ' hidden';
    return `<img class="${className} ${vehicle.side}" data-val="${vehicle.val}" src="afbeelding/avatars/vehicles/${vehicle.src}.png" alt=""${hiddenAttr}>`;
  }).join('');
}

function buildHouseholdStageHtml({
  heightTable,
  figureMode = 'static',
  stageClass = '',
  includeHouse = false,
  includeVehicles = false,
  includePetOverlay = true,
  envOverlay = '',
  extraOverlay = ''
}) {
  const stageClassAttr = stageClass ? ` class="${stageClass}"` : '';
  return `
    <div id="hh-stage"${stageClassAttr}>
      ${envOverlay}
      ${includeHouse ? buildHouseImageHtml('hh-house-bg', ' id="hh-house-bg"') : ''}
      ${includeVehicles ? buildStageVehiclesHtml('hh-stage-vehicle') : ''}
      <div id="hh-char-figures">${buildFigures(heightTable, figureMode)}</div>
      ${includePetOverlay ? `<div class="hh-pet-overlay">${buildPetOverlay(heightTable, figureMode)}</div>` : ''}
      <div id="hh-avatar-picker" hidden></div>
      ${extraOverlay}
    </div>`;
}

/* ─── HUISHOUDSTAP ────────────────────────────────────────────────────────────
   Rendert stap -4: stel het huishouden in met tellers voor volwassenen,
   kinderen, slecht-ter-been en huisdieren. Synchroniseert eerst de
   avatarSelections-arrays met de actuele tellerwaarden.
*/
function renderHouseholdStep() {
  syncAvatarSelectionsToCounts();

  // Hoogtetabel: index = totaal aantal personen+dieren, waarde = hoogte in px van een volwassene
  const ht = [190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190];
  const totalPersons = getHouseholdPersonCount();

  // Blokkeer de + knoppen zodra het maximum aantal huishoudsleden bereikt is
  const atMax = totalPersons >= MAX_HOUSEHOLD;
  const instrEl = document.getElementById('intake-instruction');
  if (instrEl) { instrEl.textContent = 'Klik op een persoon of dier om die te veranderen.'; instrEl.style.display = 'block'; }
  document.getElementById('intake-household').innerHTML = buildHouseholdStageHtml({
    heightTable: ht,
    figureMode: 'avatar-picker'
  });
  const intakeControls = document.getElementById('intake-controls');
  if (intakeControls) intakeControls.innerHTML = `
    <div id="hh-controls">
      <div class="hh-totaal">Totaal: <strong>${totalPersons}</strong> ${totalPersons === 1 ? 'persoon' : 'personen'}</div>
      <div class="hh-counter-row">
      <div class="hh-counter">
        <span class="hh-label">(Bijna) volwassenen</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('adults',-1)" ${adultsCount<=0?'disabled':''} aria-label="Minder volwassenen">−</button>
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
        <span class="hh-label">Ouderen</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('ouderen',-1)" ${ouderenCount<=0?'disabled':''} aria-label="Minder ouderen">−</button>
          <span class="hh-count">${ouderenCount}</span>
          <button class="hh-btn" onclick="changeCount('ouderen',1)" ${atMax?'disabled':''} aria-label="Meer ouderen">+</button>
        </div>
      </div>
      <div class="hh-counter">
        <span class="hh-label">Beperkt mobiel</span>
        <div class="hh-btns">
          <button class="hh-btn" onclick="changeCount('slechtTerBeen',-1)" ${slechtTerBeenCount<=0?'disabled':''} aria-label="Minder personen beperkt mobiel">−</button>
          <span class="hh-count">${slechtTerBeenCount}</span>
          <button class="hh-btn" onclick="changeCount('slechtTerBeen',1)" ${atMax?'disabled':''} aria-label="Meer personen beperkt mobiel">+</button>
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
      </div>
    </div>`;
  const nextBtn = document.getElementById('intake-next');
  if (nextBtn) nextBtn.disabled = totalPersons === 0;
}

/* ─── WIE BEN JIJ STAP ────────────────────────────────────────────────────────
   Rendert stap -4: de speler kiest welke persoon uit het huishouden zij zelf zijn.
   De selectie bepaalt of de speler beperkt mobiel of oudere is, wat doorwerkt
   in de scenarioteksten en keuzes.
*/
function renderWieBenJijStep() {
  const household = document.getElementById('intake-household');
  const instrEl = document.getElementById('intake-instruction');
  if (instrEl) instrEl.style.display = 'none';
  const ht = [190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190];
  const selectionStillExists = selectedPlayerPerson && getFigureDescriptors(false).some(fig =>
    fig.type === selectedPlayerPerson.type && fig.idx === selectedPlayerPerson.index
  );
  if (!selectionStillExists) selectedPlayerPerson = null;
  household.innerHTML = buildHouseholdStageHtml({
    heightTable: ht,
    figureMode: 'player-select',
    stageClass: 'hh-stage--wbj',
    includePetOverlay: false
  });

  const intakeControls = document.getElementById('intake-controls');
  if (intakeControls) intakeControls.innerHTML = `
    <div class="wbj-instruction">Selecteer wie jij hier bent</div>`;

  document.getElementById('intake-next').disabled = selectedPlayerPerson === null;
}

function selectPlayerPerson(type, index) {
  selectedPlayerPerson = { type, index };
  renderWieBenJijStep();
}

/* ─── WONINGSTAP ──────────────────────────────────────────────────────────────
   Rendert stap -3: kies het woningtype. Toont een grid met woningtype-opties
   en een live preview van het geselecteerde woningtype als achtergrond in de stage.
   Bij 'Overige woningen' verschijnt een sub-picker voor caravan, tiny house of woonboot.
*/
function houseImgSrc(houseTypeObj) {
  // Geeft het afbeeldingspad terug; sommige types hebben een afwijkende bestandsnaam (img-veld)
  return `afbeelding/avatars/woningtype/${houseTypeObj.img || houseTypeObj.val}.png`;
}

function houseStijlKlasse(val) {
  // Geeft de extra CSS-klasse terug voor de achtergrondafbeelding
  if (val === 'hoogbouw') return 'house-hoogbouw';
  if (val === 'laagbouw') return 'house-appartement';
  if (val === 'overige') return 'house-overige';
  if (val === 'rijwoning') return 'house-rijwoning';
  return '';
}

function renderHouseStep() {
  const ht = [160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160];

  // Bouw de woningtype-keuze-opties
  // De overige-kaart toont standaard tiny_house; klikken opent een picker (net als personen)
  const houseOpts = HOUSE_TYPES.map(h => {
    const isSelected = selectedHouseType === h.val;
    if (h.val === 'overige') {
      const subImg = (isSelected && selectedOverigeSubType) ? selectedOverigeSubType : 'tiny_house';
      const thumb = `<img src="afbeelding/avatars/woningtype/${subImg}.png" alt="${h.label}">`;
      const hint = isSelected ? `<div class="hh-change-hint">wijzigen</div>` : '';
      return `<div class="setup-option hh-house-opt${isSelected ? ' selected' : ''}" data-val="${h.val}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${h.label}" onclick="handleOverigeKaartKlik()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();handleOverigeKaartKlik()}">
        <div class="hh-overige-thumb">${thumb}${hint}</div>
        <span>${h.label}</span>
      </div>`;
    }
    return `<div class="setup-option hh-house-opt${isSelected ? ' selected' : ''}" data-val="${h.val}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${h.label}" onclick="selectHouseType('${h.val}')" onkeydown="handleSetupOptionKey(event,'house','${h.val}')">
      <img src="${houseImgSrc(h)}" alt="${h.label}">
      <span>${h.label}</span>
    </div>`;
  }).join('');

  // Bouw de overige-picker (zit als overlay in de stage, vergelijkbaar met #hh-avatar-picker)
  const overigePickerHtml = `
    <div id="hh-overige-picker" hidden>
      ${OVERIGE_TYPES.map(o =>
        `<div class="hh-overige-opt${selectedOverigeSubType === o.val ? ' active' : ''}" role="button" tabindex="0" aria-label="${o.label}" onclick="selectOverigeSubType('${o.val}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectOverigeSubType('${o.val}')}">
          <img src="afbeelding/avatars/woningtype/${o.val}.png" alt="${o.label}">
          <span>${o.label}</span>
        </div>`
      ).join('')}
      <button id="hh-overige-close" onclick="sluitOverigePicker()" aria-label="Sluiten">&#x2715;</button>
    </div>`;

  document.getElementById('intake-household').innerHTML = buildHouseholdStageHtml({
    heightTable: ht,
    includeHouse: true,
    extraOverlay: overigePickerHtml
  });
  const intakeControlsHouse = document.getElementById('intake-controls');
  if (intakeControlsHouse) intakeControlsHouse.innerHTML = `<div id="hh-house-grid">${houseOpts}</div>`;
}

/* Verwerkt een klik op een regulier woningtype-optie (niet overige).
   Reset de overige-subkeuze en rendert opnieuw.
*/
function selectHouseType(val) {
  selectedHouseType = val;
  selectedOverigeSubType = null; // Reset sub-type bij overstap naar ander type
  renderHouseStep();
  document.getElementById('intake-next').disabled = false;
}

/* Verwerkt een klik op de overige-kaart.
   Eerste klik: selecteer overige + stel tiny_house in als standaard.
   Volgende klikken: open de picker om het sub-type te wijzigen.
*/
function handleOverigeKaartKlik() {
  if (selectedHouseType !== 'overige') {
    // Eerste keer: selecteer overige met tiny_house als standaard
    selectedHouseType = 'overige';
    selectedOverigeSubType = 'tiny_house';
    renderHouseStep();
    document.getElementById('intake-next').disabled = false;
  } else {
    // Al geselecteerd: open de picker om het type te wijzigen
    openOverigePicker();
  }
}

/* Toont de overige-picker als overlay in de stage (net als hh-avatar-picker).
   Sluit via een klik buiten de picker of de sluitknop.
*/
function openOverigePicker() {
  const picker = document.getElementById('hh-overige-picker');
  if (!picker) return;
  showDismissiblePanel(picker);
}

function sluitOverigePicker() {
  const picker = document.getElementById('hh-overige-picker');
  if (picker) hideDismissiblePanel(picker);
}

/* Slaat het gekozen overige-subtype op, sluit de picker en herrendert de stap. */
function selectOverigeSubType(val) {
  selectedOverigeSubType = val;
  sluitOverigePicker();
  renderHouseStep(); // Herbouw zodat thumbnail en achtergrond bijgewerkt worden
  document.getElementById('intake-next').disabled = false;
}

/* ─── VERVOERSTAP ─────────────────────────────────────────────────────────────
   Rendert stap -2: kies beschikbare vervoersmiddelen (auto en/of fiets).
   Geselecteerde voertuigen worden als overlays in de stage weergegeven.
*/
function renderVehicleStep() {
  const ht = [160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160];

  const motorGroep = [
    { val: 'auto',  label: 'Auto' },
    { val: 'motor', label: 'Motor', src: 'motor' }
  ];
  const fietsGroep = [
    { val: 'fiets',  label: 'Fiets' },
    { val: 'scooter', label: 'Scooter' },
    { val: 'e-bike', label: 'E-bike' }
  ];

  function buildVehicleGroup(label, items) {
    const opts = items.map(({ val, label: lbl, src }) => {
      const imgSrc = src || val;
      return `<div class="setup-option hh-vehicle-opt${selectedVehicles.includes(val) ? ' selected' : ''}" data-val="${val}" role="button" tabindex="0" aria-pressed="${selectedVehicles.includes(val)}" aria-label="${lbl}" onclick="toggleVehicle('${val}')" onkeydown="handleSetupOptionKey(event,'vehicle','${val}')">
        <img src="afbeelding/avatars/vehicles/${imgSrc}.png" alt="${lbl}">
        <span>${lbl}</span>
      </div>`;
    }).join('');
    return `<div class="hh-vehicle-group"><div class="hh-vehicle-group-label">${label}</div><div class="hh-vehicle-group-row">${opts}</div></div>`;
  }

  const vehicleOpts = buildVehicleGroup('Motorvoertuig', motorGroep) + buildVehicleGroup('Licht voertuig', fietsGroep);

  document.getElementById('intake-household').innerHTML = buildHouseholdStageHtml({
    heightTable: ht,
    includeHouse: true,
    includeVehicles: true
  });
  const intakeControlsVehicle = document.getElementById('intake-controls');
  if (intakeControlsVehicle) intakeControlsVehicle.innerHTML = `<div id="hh-vehicle-row">${vehicleOpts}</div>`;
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
  parts.water = `<img class="hh-env-element water" src="afbeelding/avatars/omgeving/rivier.png" alt="">`;
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
  const ht = [160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160];
  // Bouw de omgevings-keuze-opties
  const envOpts = ENVIRONMENT_TYPES.map(e =>
    `<div class="setup-option hh-env-opt${selectedEnvironment.includes(e.val) ? ' selected' : ''}" data-val="${e.val}" role="button" tabindex="0" aria-pressed="${selectedEnvironment.includes(e.val)}" aria-label="${e.label}" onclick="selectEnvironment('${e.val}')" onkeydown="handleSetupOptionKey(event,'environment','${e.val}')">
      <div class="hh-env-thumb">${e.thumb}</div>
      <span>${e.label}</span>
    </div>`
  ).join('');

  document.getElementById('intake-household').innerHTML = buildHouseholdStageHtml({
    heightTable: ht,
    includeHouse: true,
    includeVehicles: true,
    envOverlay: buildEnvOverlay(selectedEnvironment)
  });
  const intakeControlsEnv = document.getElementById('intake-controls');
  if (intakeControlsEnv) intakeControlsEnv.innerHTML = `<div id="hh-env-grid">${envOpts}</div>`;
}

/* Togglet een omgevingstype in de selectedEnvironment-array.
   Herbouwt de omgevingstap zodat de stage-overlay direct bijgewerkt wordt.
   Volgende-knop blijft uitgeschakeld zolang er geen omgeving gekozen is.
*/
function selectEnvironment(val) {
  const idx = selectedEnvironment.indexOf(val);
  if (idx > -1) {
    selectedEnvironment.splice(idx, 1); // Al geselecteerd: verwijder
  } else {
    // 'stedelijk' en 'buitengebied' sluiten elkaar uit
    if (val === 'stedelijk') {
      const buIdx = selectedEnvironment.indexOf('buitengebied');
      if (buIdx > -1) selectedEnvironment.splice(buIdx, 1);
    } else if (val === 'buitengebied') {
      const stIdx = selectedEnvironment.indexOf('stedelijk');
      if (stIdx > -1) selectedEnvironment.splice(stIdx, 1);
    }
    selectedEnvironment.push(val);
  }
  document.getElementById('intake-next').disabled = selectedEnvironment.length === 0;
  renderEnvironmentStep(); // Herbouw de stap om de stage-overlay te verversen
}

/* Togglet een vervoersmiddel in de selectedVehicles-array.
   Werkt direct de zichtbaarheid van de voertuig-overlays in de stage bij
   zonder de hele stap te herbouwen.
*/
function toggleVehicle(val) {
  const motorGroepVals = ['auto', 'motor'];
  const fietsGroepVals = ['fiets', 'scooter', 'e-bike'];
  const groep = motorGroepVals.includes(val) ? motorGroepVals : fietsGroepVals;

  const idx = selectedVehicles.indexOf(val);
  if (idx > -1) {
    selectedVehicles.splice(idx, 1); // Al geselecteerd: verwijder
  } else {
    // Verwijder eventueel ander geselecteerd voertuig uit dezelfde groep
    groep.forEach(v => {
      const i = selectedVehicles.indexOf(v);
      if (i > -1) selectedVehicles.splice(i, 1);
    });
    selectedVehicles.push(val);
  }
  // Toon of verberg de voertuigafbeeldingen in de stage op basis van selectie
  document.querySelectorAll('.hh-stage-vehicle').forEach(el =>
    { el.hidden = !selectedVehicles.includes(el.dataset.val); }
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
     - personen: minimaal 0
     - pets: 0 tot MAX_PETS
   Het totale aantal personen mag MAX_HOUSEHOLD niet overschrijden.
*/
function changeCount(type, delta) {
  const totalPersons = getHouseholdPersonCount();
  // Blokkeer verhoging van persoonstellingen als het maximum bereikt is
  if (delta > 0 && type !== 'pets' && totalPersons >= MAX_HOUSEHOLD) return;
  if (type === 'adults') adultsCount = Math.max(0, adultsCount + delta);
  else if (type === 'children') childrenCount = Math.max(0, childrenCount + delta);
  else if (type === 'slechtTerBeen') slechtTerBeenCount = Math.max(0, slechtTerBeenCount + delta);
  else if (type === 'ouderen') ouderenCount = Math.max(0, ouderenCount + delta);
  else if (type === 'pets') petsCount = Math.max(0, Math.min(MAX_PETS, petsCount + delta));
  renderHouseholdStep(); // Herbouw de stap met de nieuwe teller-waarden
}

/* ─── KARAKTER PREVIEW ────────────────────────────────────────────────────────
   Werkt de zijbalk-preview bij tijdens de kaart-vragen (stap 0 en hoger).
   Toont volwassenen- en kinderfiguren met klikbare avatars.
*/
