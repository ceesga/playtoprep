// ═══════════════════════════════════════════════════════════════
// Intake — Huishoud-setup flow (Stap 1)
// Stappen: mensen → woning → vervoer → omgeving
// Bevat: figuur-rendering, avatar-picker, intakeNext/Prev
// ═══════════════════════════════════════════════════════════════

// ─── PORTRAIT SNAPSHOT ────────────────────────────────────────────────────────
// Tekent de live #hh-stage (met alle zichtbare img-elementen) op een <canvas>
// en slaat het resultaat op als data-URL in portraitSnapshot.
// Moet worden aangeroepen VOORDAT de intake-scherm verborgen wordt,
// anders geeft getBoundingClientRect() nullen terug.
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
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (!img.src || img.naturalWidth === 0) continue;

    const r = img.getBoundingClientRect();
    const x = Math.round(r.left - stageRect.left);
    const y = Math.round(r.top  - stageRect.top);
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (w === 0 || h === 0) continue;

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
    portraitSnapshot = canvas.toDataURL('image/png');
  } catch (e) {
    // toDataURL ook geblokkeerd (file://)
    console.warn('[Portrait] Snapshot niet opgeslagen (waarschijnlijk file://):', e.message);
    portraitSnapshot = null;
  }
}

function gotoIntake() {
  intakeStep = -4;
  adultsCount = 1;
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

function renderIntake() {
  const totalSteps = intakeQs.length + 4;
  const progressStep = intakeStep === -4 ? 0 : intakeStep === -3 ? 1 : intakeStep === -2 ? 2 : intakeStep === -1 ? 3 : intakeStep + 4;
  document.getElementById('intake-prog').style.transform = 'scaleX(' + (12 + progressStep / totalSteps * 48) / 100 + ')';
  const intakeTitles = {
    '-4': 'Hoe ziet jouw huishouden eruit?',
    '-3': 'In wat voor type woning woon je?',
    '-2': 'Welke vervoersmiddelen heb je?',
    '-1': 'In welke omgeving woon je?'
  };
  const titleEl = document.getElementById('intake-title');
  if (titleEl) titleEl.textContent = intakeTitles[intakeStep] || (intakeQs[intakeStep] ? intakeQs[intakeStep].q : '');
  document.getElementById('intake-prev').style.display = '';

  const household = document.getElementById('intake-household');
  const layout = document.getElementById('intake-layout');

  if (intakeStep === -4) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderHouseholdStep();
    document.getElementById('intake-next').disabled = false;
    return;
  }

  if (intakeStep === -3) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderHouseStep();
    document.getElementById('intake-next').disabled = selectedHouseType === null;
    return;
  }

  if (intakeStep === -2) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderVehicleStep();
    document.getElementById('intake-next').disabled = false;
    return;
  }

  if (intakeStep === -1) {
    layout.style.display = 'none';
    household.style.display = 'block';
    renderEnvironmentStep();
    document.getElementById('intake-next').disabled = false;
    return;
  }

  household.style.display = 'none';
  layout.style.display = 'flex';

  const q = intakeQs[intakeStep];
  document.getElementById('intake-next').disabled = true;
  intakeAnswers[q.id] = q.multi ? [] : null;
  let html = `${q.multi ? '<p class="sub" style="margin-bottom:14px">Meerdere antwoorden mogelijk.</p>' : ''}`;
  html += `<div class="cards${q.opts.length <= 2 ? ' single' : ''}">`;
  q.opts.forEach(o => {
    html += `<button class="choice-card${q.multi ? ' multi' : ''}" data-val="${o.val}" aria-label="${o.label}" onclick="intakePick(this,'${q.id}',${q.multi},'${o.val}')">
      <div class="icon">${o.icon}</div><div>${o.label}</div></button>`;
  });
  html += '</div>';
  document.getElementById('intake-body').innerHTML = html;
  updateCharacterPreview();
}

function intakePick(el, id, multi, val) {
  if (!multi) {
    document.querySelectorAll('#intake-body .choice-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    intakeAnswers[id] = val;
    document.getElementById('intake-next').disabled = false;
  } else {
    if (val === 'none') {
      document.querySelectorAll('#intake-body .choice-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      intakeAnswers[id] = ['none'];
    } else {
      const nb = document.querySelector('#intake-body .choice-card[data-val="none"]');
      if (nb) nb.classList.remove('selected');
      el.classList.toggle('selected');
      const arr = intakeAnswers[id].filter(v => v !== 'none');
      const i = arr.indexOf(val);
      if (i > -1) arr.splice(i, 1);
      else arr.push(val);
      intakeAnswers[id] = arr;
    }
    document.getElementById('intake-next').disabled = intakeAnswers[id].length === 0;
  }
  updateCharacterPreview();
}
const ADULT_DEFAULTS = ['man-1', 'woman-1', 'man-3', 'woman-3', 'man-4', 'woman-4'];

function defaultAdultAvatar(i) {
  return ADULT_DEFAULTS[i % ADULT_DEFAULTS.length];
}

function defaultChildAvatar(i) {
  const isGirl = i % 2 === 1;
  const num = Math.floor(i / 2) + 1;
  return isGirl ? `girl-${Math.min(num, 3)}` : `boy-${Math.min(num, 2)}`;
}

function defaultStbAvatar(i) {
  return STB_AVATARS[i % STB_AVATARS.length];
}

// ─── FIGURE RENDERING HELPER ──────────────────────────────────────────────────
const FIGURE_OVERLAP_PX = 28;

// Individuele schaalfactoren per huisdier (ten opzichte van standaard petH)
const PET_SCALE = {
  hond:    1.30,
  kat:     0.80,
  konijn:  1.00,
  hamster: 0.40,
  paard:   2.00,
};

function buildFigures(heightTable, clickable = false) {
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;
  const total = totalPersons + petsCount;
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const childH = Math.round(adultH * 0.78);
  const petH = Math.round(adultH * 0.38);

  // Alleen personen in de flex-rij
  const figList = [];
  for (let i = 0; i < adultsCount; i++) figList.push({ type: 'adult', idx: i });
  for (let i = 0; i < childrenCount; i++) figList.push({ type: 'child', idx: i });
  for (let i = 0; i < slechtTerBeenCount; i++) figList.push({ type: 'slechtTerBeen', idx: i });

  return figList.map((fig, pos) => {
    const dist = Math.abs(pos - (figList.length - 1) / 2);
    const zIndex = Math.round((figList.length - dist) * 10);
    const ml = pos === 0 ? 0 : -FIGURE_OVERLAP_PX;
    const folder = fig.type === 'adult' ? 'adult' : fig.type === 'child' ? 'child' : 'slecht%20ter%20been';
    const av = fig.type === 'adult' ? avatarSelections.adults[fig.idx] :
      fig.type === 'child' ? avatarSelections.children[fig.idx] :
      avatarSelections.slechtTerBeen[fig.idx];
    const isSitting = fig.type === 'slechtTerBeen' && (av === 'manx-2' || av === 'womanx-2');
    const h = (fig.type === 'child' || isSitting) ? childH : adultH;
    const click = clickable ? ` onclick="openAvatarPicker(${fig.idx},'${fig.type}')" title="Klik om te wijzigen"` : '';
    return `<div class="char-fig ${fig.type}"${click} style="z-index:${zIndex};margin-left:${ml}px">
      <img src="afbeelding/avatars/${folder}/${av}.png" alt="${fig.type === 'adult' ? 'Volwassen persoon' : fig.type === 'child' ? 'Kind' : 'Persoon met beperkte mobiliteit'}" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

// Rendert huisdieren als absolute overlay vóór de personenrij
function buildPetOverlay(heightTable, clickable = false) {
  if (petsCount === 0) return '';
  const total = adultsCount + childrenCount + slechtTerBeenCount + petsCount;
  const adultH = heightTable[Math.min(total, heightTable.length - 1)];
  const petH   = Math.round(adultH * 0.38);

  return Array.from({ length: petsCount }, (_, i) => {
    const av = avatarSelections.pets[i];
    const h  = Math.round(petH * (PET_SCALE[av] || 1.0));
    const click = clickable ? ` onclick="openAvatarPicker(${i},'pet')" title="Klik om te wijzigen"` : '';
    return `<div class="char-fig pet"${click} style="z-index:999">
      <img src="afbeelding/avatars/pets/${av}.png" alt="Huisdier" style="height:${h}px;width:auto">
    </div>`;
  }).join('');
}

function renderHouseholdStep() {
  // Sync avatarSelections arrays to current counts
  avatarSelections.adults = avatarSelections.adults.slice(0, adultsCount);
  while (avatarSelections.adults.length < adultsCount) avatarSelections.adults.push(defaultAdultAvatar(avatarSelections.adults.length));
  avatarSelections.children = avatarSelections.children.slice(0, childrenCount);
  while (avatarSelections.children.length < childrenCount) avatarSelections.children.push(defaultChildAvatar(avatarSelections.children.length));
  avatarSelections.pets = avatarSelections.pets.slice(0, petsCount);
  while (avatarSelections.pets.length < petsCount) avatarSelections.pets.push(PET_AVATARS[avatarSelections.pets.length % PET_AVATARS.length]);
  avatarSelections.slechtTerBeen = avatarSelections.slechtTerBeen.slice(0, slechtTerBeenCount);
  while (avatarSelections.slechtTerBeen.length < slechtTerBeenCount) avatarSelections.slechtTerBeen.push(defaultStbAvatar(avatarSelections.slechtTerBeen.length));

  const ht = [0, 280, 260, 240, 220, 205, 190, 178, 168, 158, 150, 142, 135];
  const figures    = buildFigures(ht, true);
  const petOverlay = buildPetOverlay(ht, true);
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;

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

function renderHouseStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);

  const houseOpts = HOUSE_TYPES.map(h =>
    `<div class="hh-house-opt${selectedHouseType === h.val ? ' selected' : ''}" data-val="${h.val}" onclick="selectHouseType('${h.val}')">
      <img src="afbeelding/avatars/woningtype/${h.val}.png" alt="${h.label}">
      <span>${h.label}</span>
    </div>`
  ).join('');

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

function selectHouseType(val) {
  selectedHouseType = val;
  const bg = document.getElementById('hh-house-bg');
  if (bg) {
    bg.src = `afbeelding/avatars/woningtype/${val}.png`;
    bg.classList.add('visible');
    bg.classList.toggle('house-appartement', val === 'appartement');
  }
  document.querySelectorAll('.hh-house-opt').forEach(el =>
    el.classList.toggle('selected', el.dataset.val === val)
  );
  document.getElementById('intake-next').disabled = false;
}

function renderVehicleStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';

  const vehicleOpts = ['auto', 'fiets'].map(v =>
    `<div class="hh-vehicle-opt${selectedVehicles.includes(v) ? ' selected' : ''}" data-val="${v}" onclick="toggleVehicle('${v}')">
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

function buildEnvOverlay(envArr) {
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
  return envArr.map(e => parts[e] || '').join('');
}

function renderEnvironmentStep() {
  const ht = [0, 220, 205, 192, 180, 170, 160, 152, 144, 137, 130, 124, 118];
  const figures    = buildFigures(ht);
  const petOverlay = buildPetOverlay(ht);
  const houseSrc = selectedHouseType ? `afbeelding/avatars/woningtype/${selectedHouseType}.png` : '';
  const envOpts = ENVIRONMENT_TYPES.map(e =>
    `<div class="hh-env-opt${selectedEnvironment.includes(e.val) ? ' selected' : ''}" data-val="${e.val}" onclick="selectEnvironment('${e.val}')">
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

function selectEnvironment(val) {
  const idx = selectedEnvironment.indexOf(val);
  if (idx > -1) selectedEnvironment.splice(idx, 1);
  else selectedEnvironment.push(val);
  document.getElementById('intake-next').disabled = selectedEnvironment.length === 0;
  renderEnvironmentStep();
}

function toggleVehicle(val) {
  const idx = selectedVehicles.indexOf(val);
  if (idx > -1) selectedVehicles.splice(idx, 1);
  else selectedVehicles.push(val);
  document.querySelectorAll('.hh-stage-vehicle').forEach(el =>
    el.style.display = selectedVehicles.includes(el.dataset.val) ? 'block' : 'none'
  );
  document.querySelectorAll('.hh-vehicle-opt').forEach(el =>
    el.classList.toggle('selected', selectedVehicles.includes(el.dataset.val))
  );
}

function changeCount(type, delta) {
  const totalPersons = adultsCount + childrenCount + slechtTerBeenCount;
  if (delta > 0 && type !== 'pets' && totalPersons >= 6) return;
  if (type === 'adults') adultsCount = Math.max(1, adultsCount + delta);
  else if (type === 'children') childrenCount = Math.max(0, childrenCount + delta);
  else if (type === 'slechtTerBeen') slechtTerBeenCount = Math.max(0, slechtTerBeenCount + delta);
  else if (type === 'pets') petsCount = Math.max(0, Math.min(MAX_PETS, petsCount + delta));
  renderHouseholdStep();
}

function updateCharacterPreview() {
  // Sidebar preview during card steps
  const container = document.getElementById('char-figures');
  if (!container) return;

  const hasPets = Array.isArray(intakeAnswers.special) && intakeAnswers.special.includes('pets');

  let html = '';
  for (let i = 0; i < adultsCount; i++) {
    const av = avatarSelections.adults[i] || defaultAdultAvatar(i);
    html += `<div class="char-fig adult" onclick="openAvatarPicker(${i},'adult')" title="Klik om te wijzigen">
      <img src="afbeelding/avatars/adult/${av}.png" alt="Volwassen persoon">
    </div>`;
  }
  for (let i = 0; i < childrenCount; i++) {
    const av = avatarSelections.children[i] || defaultChildAvatar(i);
    html += `<div class="char-fig child" onclick="openAvatarPicker(${i},'child')" title="Klik om te wijzigen">
      <img src="afbeelding/avatars/child/${av}.png" alt="Kind">
    </div>`;
  }
  if (hasPets) html += `<div class="char-pet">🐕</div>`;

  container.innerHTML = html;
}

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
  return '';
}

function renderHouseholdIndicator() {
  const faceEl = document.getElementById('ss-household-face');
  const countEl = document.getElementById('ss-household-count');
  if (!faceEl || !countEl) return;

  const avatarPath = getPrimaryAvatarPath();
  faceEl.innerHTML = avatarPath ?
    `<img src="${avatarPath}" alt="">` :
    '<span>👤</span>';

  const persons = adultsCount + childrenCount + slechtTerBeenCount;
  countEl.textContent = persons === 1 ? '1 pers.' : `${persons} pers.`;
}

const ADULT_AVATARS = ['man-1', 'man-3', 'man-4', 'man-5', 'man-6',
  'woman-1', 'woman-3', 'woman-4', 'woman-5', 'woman-6'
];
const CHILD_AVATARS = ['boy-1', 'boy-2', 'girl-1', 'girl-2', 'girl-3'];
const STB_AVATARS = ['manx-1', 'womanx-1', 'manx-2', 'womanx-2'];
const PET_AVATARS = ['hond', 'kat', 'konijn', 'hamster', 'paard'];

function openAvatarPicker(index, type) {
  avatarPickerTarget = {
    index,
    type
  };
  const isHousehold = intakeStep <= -1;
  const pickerId = isHousehold ? 'hh-avatar-picker' : 'avatar-picker';
  const picker = document.getElementById(pickerId);
  if (!picker) return;

  const list = type === 'adult' ? ADULT_AVATARS : type === 'child' ? CHILD_AVATARS :
    type === 'slechtTerBeen' ? STB_AVATARS : PET_AVATARS;
  const folder = type === 'adult' ? 'adult' : type === 'child' ? 'child' :
    type === 'slechtTerBeen' ? 'slecht%20ter%20been' : 'pets';
  const current = type === 'adult' ? avatarSelections.adults[index] :
    type === 'child' ? avatarSelections.children[index] :
    type === 'slechtTerBeen' ? avatarSelections.slechtTerBeen[index] :
    avatarSelections.pets[index];

  picker.innerHTML = list.map(av =>
    `<img src="afbeelding/avatars/${folder}/${av}.png" alt="Avatar optie" class="${av === current ? 'active' : ''}"
      onclick="selectAvatar('${av}')">`
  ).join('') + (isHousehold ? `<button id="hh-picker-close" onclick="closePickerNow()">✕</button>` : '');
  picker.style.display = 'flex';

  setTimeout(() => document.addEventListener('click', closePicker, {
    once: true
  }), 10);
}

function selectAvatar(av) {
  if (!avatarPickerTarget) return;
  const {
    index,
    type
  } = avatarPickerTarget;
  if (type === 'adult') avatarSelections.adults[index] = av;
  else if (type === 'child') avatarSelections.children[index] = av;
  else if (type === 'slechtTerBeen') avatarSelections.slechtTerBeen[index] = av;
  else avatarSelections.pets[index] = av;
  const isHousehold = intakeStep <= -1;
  if (isHousehold) {
    avatarPickerTarget = null;
    if (intakeStep === -4) renderHouseholdStep();
    else if (intakeStep === -3) renderHouseStep();
    else if (intakeStep === -2) renderVehicleStep();
    else renderEnvironmentStep();
  } else {
    document.getElementById('avatar-picker').style.display = 'none';
    avatarPickerTarget = null;
    updateCharacterPreview();
  }
}

function closePickerNow() {
  const picker = document.getElementById('hh-avatar-picker') || document.getElementById('avatar-picker');
  if (picker) picker.style.display = 'none';
  avatarPickerTarget = null;
}

function closePicker(e) {
  const isHousehold = intakeStep <= -1;
  const pickerId = isHousehold ? 'hh-avatar-picker' : 'avatar-picker';
  const picker = document.getElementById(pickerId);
  if (picker && !picker.contains(e.target)) {
    picker.style.display = 'none';
    avatarPickerTarget = null;
  }
}

function intakeNext() {
  const a = intakeAnswers;

  // Stap -4: mensen → stap -3: woning
  if (intakeStep === -4) {
    profile.members = adultsCount + childrenCount + slechtTerBeenCount;
    profile.adults = adultsCount + slechtTerBeenCount;
    profile.hasChildren = childrenCount > 0;
    profile.childrenCount = childrenCount;
    profile.hasElderly = slechtTerBeenCount > 0;
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

function intakePrev() {
  if (intakeStep === -4) {
    show('s-uitleg');
    return;
  } else if (intakeStep === -3) {
    intakeStep = -4;
  } else if (intakeStep === -2) {
    intakeStep = -3;
  } else if (intakeStep === -1) {
    intakeStep = -2;
  } else if (intakeStep === 0) {
    intakeStep = -1;
  } else {
    intakeStep--;
  }
  renderIntake();
}
