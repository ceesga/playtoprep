// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Avatar Picker — Avatar-selectie en huishoudindicator
// Bevat: avatar-constanten, openAvatarPicker, selectAvatar,
//        closePicker, updateCharacterPreview,
//        getPrimaryAvatarPath, renderHouseholdIndicator
// ═══════════════════════════════════════════════════════════════

/* ─── AVATAR LIJSTEN ──────────────────────────────────────────────────────────
   Beschikbare avatar-namen per categorie. De bestandsnamen komen overeen
   met PNG-bestanden in de afbeelding/avatars/-submappen.
*/
const ADULT_AVATARS = ['man-1', 'man-3', 'man-4', 'man-5', 'man-6',
  'woman-1', 'woman-3', 'woman-4', 'woman-5', 'woman-6'
];
const CHILD_AVATARS = ['boy-1', 'boy-2', 'girl-1', 'girl-2', 'girl-3'];
const STB_AVATARS = ['womanx-1', 'manx-2', 'womanx-2']; // Slecht-ter-been avatars (manx-1 verwijderd)
const OUDEREN_AVATARS = ['old_woman', 'old_man']; // Ouderen avatars
const PET_AVATARS = ['hond', 'kat', 'konijn', 'hamster', 'paard'];

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

  const totalAdults = adultsCount + slechtTerBeenCount + ouderenCount;
  const parts = [];
  if (totalAdults > 0)  parts.push(totalAdults  === 1 ? '1 volwassene'  : `${totalAdults} volwassenen`);
  if (childrenCount > 0) parts.push(childrenCount === 1 ? '1 kind'        : `${childrenCount} kinderen`);
  if (petsCount > 0)     parts.push(petsCount     === 1 ? '1 huisdier'    : `${petsCount} huisdieren`);
  countEl.textContent = parts.length <= 1
    ? (parts[0] || '1 volwassene')
    : parts.slice(0, -1).join(', ') + ' en ' + parts[parts.length - 1];

  if (nameEl) nameEl.textContent = profile.playerName || '';
}

/* ─── AVATAR LIJSTEN ──────────────────────────────────────────────────────────
   Beschikbare avatar-namen per categorie. De bestandsnamen komen overeen
   met PNG-bestanden in de afbeelding/avatars/-submappen.


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
    type === 'slechtTerBeen' ? STB_AVATARS : type === 'ouderen' ? OUDEREN_AVATARS : PET_AVATARS;
  const folder = type === 'adult' ? 'adult' : type === 'child' ? 'child' :
    type === 'slechtTerBeen' ? 'slecht%20ter%20been' : type === 'ouderen' ? 'ouderen' : 'pets';
  // Haal de huidig geselecteerde avatar op voor dit figuur
  const current = type === 'adult' ? avatarSelections.adults[index] :
    type === 'child' ? avatarSelections.children[index] :
    type === 'slechtTerBeen' ? avatarSelections.slechtTerBeen[index] :
    type === 'ouderen' ? avatarSelections.ouderen[index] :
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
  else if (type === 'ouderen') avatarSelections.ouderen[index] = av;
  else avatarSelections.pets[index] = av;
  const isHousehold = intakeStep <= -1;
  if (isHousehold) {
    avatarPickerTarget = null;
    // Herbouw de huidige huishoudstap om de nieuwe avatar direct te tonen
    if (intakeStep === -5) renderHouseholdStep();
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
