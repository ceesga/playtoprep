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

/* Bouwt de HTML-string voor de personenfiguren in de stage.
   Berekent hoogte per persoon op basis van het totale aantal personen.
   Figuren in het midden hebben een hogere z-index (staan voor de anderen).
   @param heightTable  array van hoogtes geïndexeerd op totaal aantal personen
   @param clickable    als true, worden figuren klikbaar voor avatar-selectie
*/
function buildFigures(heightTable, clickable = false) {
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
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
  for (let i = 0; i < ouderenCount; i++) figList.push({ type: 'ouderen', idx: i });

  return figList.map((fig, pos) => {
    // Figuren dichter bij het midden krijgen een hogere z-index (staan voor de anderen)
    const dist = Math.abs(pos - (figList.length - 1) / 2);
    const zIndex = Math.round((figList.length - dist) * 10);
    // Alle figuren behalve de eerste schuiven gedeeltelijk over de vorige heen
    // Ouderen-afbeeldingen zijn smaller, dus extra overlap voor gelijke visuele dichtheid
    const overlapPx = fig.type === 'ouderen' ? FIGURE_OVERLAP_PX + 16 : FIGURE_OVERLAP_PX;
    const ml = pos === 0 ? 0 : -overlapPx;
    // Bepaal de juiste submap voor de afbeelding
    const folder = fig.type === 'adult' ? 'adult' : fig.type === 'child' ? 'child' :
      fig.type === 'ouderen' ? 'ouderen' : 'slecht%20ter%20been';
    // Haal de geselecteerde avatar op voor dit figuur
    const av = fig.type === 'adult' ? avatarSelections.adults[fig.idx] :
      fig.type === 'child' ? avatarSelections.children[fig.idx] :
      fig.type === 'ouderen' ? avatarSelections.ouderen[fig.idx] :
      avatarSelections.slechtTerBeen[fig.idx];
    // Rollende/zittende STB-avatars (manx-2 / womanx-2) hebben kind-hoogte
    const isSitting = fig.type === 'slechtTerBeen' && (av === 'manx-2' || av === 'womanx-2');
    const h = (fig.type === 'child' || isSitting) ? childH : adultH;
    const label = fig.type === 'adult' ? 'Volwassene aanpassen' : fig.type === 'child' ? 'Kind aanpassen' :
      fig.type === 'ouderen' ? 'Oudere aanpassen' : 'Beperkt mobiel persoon aanpassen';
    const altText = fig.type === 'adult' ? 'Volwassen persoon' : fig.type === 'child' ? 'Kind' :
      fig.type === 'ouderen' ? 'Oudere' : 'Beperkt mobiel persoon';
    const click = clickable ? ` role="button" tabindex="0" aria-label="${label}" onclick="openAvatarPicker(${fig.idx},'${fig.type}')" onkeydown="handlePickerTriggerKey(event,${fig.idx},'${fig.type}')" title="Klik om te wijzigen"` : '';
    return `<div class="char-fig ${fig.type}"${click} style="z-index:${zIndex};margin-left:${ml}px">
      <img src="afbeelding/avatars/${folder}/${av}.png" alt="${altText}" style="height:${h}px;width:auto">
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
  avatarSelections.ouderen = avatarSelections.ouderen.slice(0, ouderenCount);
  while (avatarSelections.ouderen.length < ouderenCount) avatarSelections.ouderen.push(defaultOuderenAvatar(avatarSelections.ouderen.length));

  // Hoogtetabel: index = totaal aantal personen+dieren, waarde = hoogte in px van een volwassene
  const ht = [190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190];
  const figures    = buildFigures(ht, true);    // Figuren zijn klikbaar in deze stap
  const petOverlay = buildPetOverlay(ht, true); // Huisdieren ook klikbaar
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;

  // Blokkeer de + knoppen zodra het maximum aantal huishoudsleden bereikt is
  const atMax = totalPersons >= MAX_HOUSEHOLD;
  const instrEl = document.getElementById('intake-instruction');
  if (instrEl) { instrEl.textContent = 'Klik op een persoon of dier om die te veranderen.'; instrEl.style.display = 'block'; }
  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>`;
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

  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
  const total = totalPersons + petsCount;
  const ht = [190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190];
  const adultH = ht[Math.min(total, ht.length - 1)];
  const childH = Math.round(adultH * 0.78);

  const figList = [];
  for (let i = 0; i < adultsCount; i++) figList.push({ type: 'adult', idx: i });
  for (let i = 0; i < childrenCount; i++) figList.push({ type: 'child', idx: i });
  for (let i = 0; i < slechtTerBeenCount; i++) figList.push({ type: 'slechtTerBeen', idx: i });
  for (let i = 0; i < ouderenCount; i++) figList.push({ type: 'ouderen', idx: i });

  const figures = figList.map((fig, pos) => {
    const dist = Math.abs(pos - (figList.length - 1) / 2);
    const zIndex = Math.round((figList.length - dist) * 10);
    const overlapPx = fig.type === 'ouderen' ? FIGURE_OVERLAP_PX + 16 : FIGURE_OVERLAP_PX;
    const ml = pos === 0 ? 0 : -overlapPx;
    const folder = fig.type === 'adult' ? 'adult' : fig.type === 'child' ? 'child' :
      fig.type === 'ouderen' ? 'ouderen' : 'slecht%20ter%20been';
    const av = fig.type === 'adult' ? avatarSelections.adults[fig.idx] :
      fig.type === 'child' ? avatarSelections.children[fig.idx] :
      fig.type === 'ouderen' ? avatarSelections.ouderen[fig.idx] :
      avatarSelections.slechtTerBeen[fig.idx];
    const isSitting = fig.type === 'slechtTerBeen' && (av === 'manx-2' || av === 'womanx-2');
    const h = (fig.type === 'child' || isSitting) ? childH : adultH;
    const altText = fig.type === 'adult' ? 'Volwassen persoon' : fig.type === 'child' ? 'Kind' :
      fig.type === 'ouderen' ? 'Oudere' : 'Beperkt mobiel persoon';
    const label = fig.type === 'adult' ? 'Volwassene' : fig.type === 'child' ? 'Kind' :
      fig.type === 'ouderen' ? 'Oudere' : 'Beperkt mobiel';
    const isSelected = selectedPlayerPerson
      && selectedPlayerPerson.type === fig.type
      && selectedPlayerPerson.index === fig.idx;
    return `<div class="char-fig ${fig.type}${isSelected ? ' wbj-selected' : ''}"
      role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${label} selecteren"
      onclick="selectPlayerPerson('${fig.type}',${fig.idx})"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPlayerPerson('${fig.type}',${fig.idx})}"
      style="z-index:${zIndex};margin-left:${ml}px">
      <img src="afbeelding/avatars/${folder}/${av}.png" alt="${altText}" style="height:${h}px;width:auto">
    </div>`;
  }).join('');

  household.innerHTML = `
    <div id="hh-stage" class="hh-stage--wbj">
      <div id="hh-char-figures">${figures}</div>
    </div>`;

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
  const figures    = buildFigures(ht);    // Figuren niet klikbaar in deze stap
  const petOverlay = buildPetOverlay(ht);

  // Bouw de woningtype-keuze-opties
  // De overige-kaart toont standaard tiny_house; klikken opent een picker (net als personen)
  const houseOpts = HOUSE_TYPES.map(h => {
    const isSelected = selectedHouseType === h.val;
    if (h.val === 'overige') {
      const subImg = (isSelected && selectedOverigeSubType) ? selectedOverigeSubType : 'tiny_house';
      const thumb = `<img src="afbeelding/avatars/woningtype/${subImg}.png" alt="${h.label}">`;
      const hint = isSelected ? `<div class="hh-change-hint">wijzigen</div>` : '';
      return `<div class="hh-house-opt${isSelected ? ' selected' : ''}" data-val="${h.val}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${h.label}" onclick="handleOverigeKaartKlik()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();handleOverigeKaartKlik()}">
        <div class="hh-overige-thumb">${thumb}${hint}</div>
        <span>${h.label}</span>
      </div>`;
    }
    return `<div class="hh-house-opt${isSelected ? ' selected' : ''}" data-val="${h.val}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${h.label}" onclick="selectHouseType('${h.val}')" onkeydown="handleSetupOptionKey(event,'house','${h.val}')">
      <img src="${houseImgSrc(h)}" alt="${h.label}">
      <span>${h.label}</span>
    </div>`;
  }).join('');

  // Bepaal de achtergrondafbeelding op basis van het geselecteerde type
  let houseSrc = '';
  if (selectedHouseType === 'overige') {
    houseSrc = selectedOverigeSubType ? `afbeelding/avatars/woningtype/${selectedOverigeSubType}.png` : '';
  } else if (selectedHouseType) {
    const typeObj = HOUSE_TYPES.find(h => h.val === selectedHouseType);
    houseSrc = typeObj ? houseImgSrc(typeObj) : '';
  }
  const _stijl = houseStijlKlasse(selectedHouseType);
  const bgClass = `${houseSrc ? 'visible' : ''}${_stijl ? ' ' + _stijl : ''}`.trim();

  // Bouw de overige-picker (zit als overlay in de stage, vergelijkbaar met #hh-avatar-picker)
  const overigePickerHtml = `
    <div id="hh-overige-picker" style="display:none">
      ${OVERIGE_TYPES.map(o =>
        `<div class="hh-overige-opt${selectedOverigeSubType === o.val ? ' active' : ''}" role="button" tabindex="0" aria-label="${o.label}" onclick="selectOverigeSubType('${o.val}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectOverigeSubType('${o.val}')}">
          <img src="afbeelding/avatars/woningtype/${o.val}.png" alt="${o.label}">
          <span>${o.label}</span>
        </div>`
      ).join('')}
      <button id="hh-overige-close" onclick="sluitOverigePicker()" aria-label="Sluiten">&#x2715;</button>
    </div>`;

  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${bgClass}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
      ${overigePickerHtml}
    </div>`;
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
  picker.style.display = 'flex';
  setTimeout(() => document.addEventListener('click', sluitOverigePickerBuiten, { once: true }), 10);
}

function sluitOverigePicker() {
  const picker = document.getElementById('hh-overige-picker');
  if (picker) picker.style.display = 'none';
}

function sluitOverigePickerBuiten(e) {
  const picker = document.getElementById('hh-overige-picker');
  if (picker && !picker.contains(e.target)) picker.style.display = 'none';
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
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const _houseTypeObj = selectedHouseType ? HOUSE_TYPES.find(h => h.val === selectedHouseType) : null;
  const houseSrc = selectedHouseType === 'overige'
    ? (selectedOverigeSubType ? `afbeelding/avatars/woningtype/${selectedOverigeSubType}.png` : '')
    : (_houseTypeObj ? houseImgSrc(_houseTypeObj) : '');

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
      return `<div class="hh-vehicle-opt${selectedVehicles.includes(val) ? ' selected' : ''}" data-val="${val}" role="button" tabindex="0" aria-pressed="${selectedVehicles.includes(val)}" aria-label="${lbl}" onclick="toggleVehicle('${val}')" onkeydown="handleSetupOptionKey(event,'vehicle','${val}')">
        <img src="afbeelding/avatars/vehicles/${imgSrc}.png" alt="${lbl}">
        <span>${lbl}</span>
      </div>`;
    }).join('');
    return `<div class="hh-vehicle-group"><div class="hh-vehicle-group-label">${label}</div><div class="hh-vehicle-group-row">${opts}</div></div>`;
  }

  const vehicleOpts = buildVehicleGroup('Motorvoertuig', motorGroep) + buildVehicleGroup('Licht voertuig', fietsGroep);

  document.getElementById('intake-household').innerHTML = `
    <div id="hh-stage">
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${selectedHouseType ? 'visible' : ''}${houseStijlKlasse(selectedHouseType) ? ' ' + houseStijlKlasse(selectedHouseType) : ''}">
      <img class="hh-stage-vehicle left" data-val="fiets"   src="afbeelding/avatars/vehicles/fiets.png"       alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-stage-vehicle left" data-val="scooter" src="afbeelding/avatars/vehicles/scooter.png"     alt="" style="display:${selectedVehicles.includes('scooter')?'block':'none'}">
      <img class="hh-stage-vehicle left" data-val="e-bike"  src="afbeelding/avatars/vehicles/e-bike.png"      alt="" style="display:${selectedVehicles.includes('e-bike')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="auto"   src="afbeelding/avatars/vehicles/auto.png"        alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="motor"  src="afbeelding/avatars/vehicles/motor.png" alt="" style="display:${selectedVehicles.includes('motor')?'block':'none'}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>`;
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
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const _houseTypeObj = selectedHouseType ? HOUSE_TYPES.find(h => h.val === selectedHouseType) : null;
  const houseSrc = selectedHouseType === 'overige'
    ? (selectedOverigeSubType ? `afbeelding/avatars/woningtype/${selectedOverigeSubType}.png` : '')
    : (_houseTypeObj ? houseImgSrc(_houseTypeObj) : '');
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
      <img id="hh-house-bg" src="${houseSrc}" alt="" class="${selectedHouseType ? 'visible' : ''}${houseStijlKlasse(selectedHouseType) ? ' ' + houseStijlKlasse(selectedHouseType) : ''}">
      <img class="hh-stage-vehicle left" data-val="fiets"   src="afbeelding/avatars/vehicles/fiets.png"       alt="" style="display:${selectedVehicles.includes('fiets')?'block':'none'}">
      <img class="hh-stage-vehicle left" data-val="scooter" src="afbeelding/avatars/vehicles/scooter.png"     alt="" style="display:${selectedVehicles.includes('scooter')?'block':'none'}">
      <img class="hh-stage-vehicle left" data-val="e-bike"  src="afbeelding/avatars/vehicles/e-bike.png"      alt="" style="display:${selectedVehicles.includes('e-bike')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="auto"   src="afbeelding/avatars/vehicles/auto.png"        alt="" style="display:${selectedVehicles.includes('auto')?'block':'none'}">
      <img class="hh-stage-vehicle right" data-val="motor"  src="afbeelding/avatars/vehicles/motor.png" alt="" style="display:${selectedVehicles.includes('motor')?'block':'none'}">
      <div id="hh-char-figures">${figures}</div>
      <div class="hh-pet-overlay">${petOverlay}</div>
      <div id="hh-avatar-picker" style="display:none"></div>
    </div>`;
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
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount + ouderenCount;
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
