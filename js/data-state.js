// ═══════════════════════════════════════════════════════════════
// Noodscenario Simulator — Game State & Data Definities
// Bevat: profiel, spelstatus, scene-decay, kanaal-inhoud,
//        huishoud-variabelen, constanten voor intake
// ═══════════════════════════════════════════════════════════════

// ─── CONSTANTEN ───────────────────────────────────────────────────────────────

// Maximale waarden voor stat-meters
const MAX_STAT_WATER   = 5;
const MAX_STAT_FOOD    = 5;
const MAX_STAT_COMFORT = 10;
const MAX_STAT_HEALTH  = 10;
const MAX_STAT_SEGS    = 5; // aantal segmenten zichtbaar in de UI

// Startwaarden bij aanvang van een scenario
const START_WATER         = 3;
const START_FOOD          = 3;
const START_COMFORT       = 5;
const START_HEALTH        = 5;
const START_CASH          = 20;
const START_PHONE_BATTERY = 80;

// Huishoud-limieten
const MAX_HOUSEHOLD = 8;
const MAX_PETS      = 4;

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const profile = {
  playerName: '',
  houseType: '',
  members: 1,
  hasChildren: false,
  hasElderly: false,
  hasMobilityImpaired: false,
  hasPets: false,
  location: [],
  hasCar: false,
  hasBike: false,
  hasKit: false,
  hasWater: false,
  hasFood: false,
  hasFirstAid: false,
  hasFlashlight: false,
  hasRadio: false,
  hasCash: false,
  hasDocuments: false,
  hasPowerbank: false,
  hasMeds: false,
  hasGasStove: false,
  hasPersonalSupplies: false,
  hasEDCReady: false,
  commuteMode: '',
  commuteDistance: '',
  hasEDCBag: false,
  hasEDCCash: false,
  hasEDCSnacks: false,
  hasEDCCharger: false,
  hasEDCWater: false,
  hasEDCKnife: false
};

// ─── GAME STATE ───────────────────────────────────────────────────────────────
const state = {
  awarenessLevel: 0,
  hasCash: false,
  hasExtraFood: false,
  wentToSupermarket: null,
  supermarketItems: [],
  hasWater: false,
  hasFlashlight: false,
  houseLocked: false,
  helpedNeighbor: false,
  handledSewage: false,
  wentToFoodDist: false,
  hasCampingStove: false,
  knowsNeighbors: false,
  water:        START_WATER,
  food:         START_FOOD,
  comfort:      START_COMFORT,
  ranOutOfWater: false,
  ranOutOfFood:  false,
  health:       START_HEALTH,
  cash:         START_CASH,
  powerbank:    0,
  phoneBattery: START_PHONE_BATTERY,
  tookAlarmSeriously: false,
  warnedHousemates: false,
  didntUseWaterOnFire: false,
  evacuatedFire: false,
  called112: false,
  stayedOutside: false
};

// Scene decay — automatic stat reductions when a scene is entered
// Water & food: only once per day (at morning scenes)
// Comfort: when house gets colder
// Health: NOT automatic — only via explicit bad choices
let sceneDecay = {};
const sceneDecay_stroom = {
  // phoneBattery: 5% per uur vanaf st_d0_morgen (08:00)
  st_1: {
    phoneBattery: -15
  }, // +3.5h
  st_4: {
    phoneBattery: -5
  }, // +1h
  st_6: {
    phoneBattery: -20
  }, // +4h
  st_6b: {
    comfort: -1,
    phoneBattery: -10
  }, // +1.5h
  st_7: {
    comfort: -1,
    phoneBattery: -35
  }, // +7h nacht
  st_8: {
    phoneBattery: -15
  }, // +3h
  st_d1_morgen: {
    water: -1,
    food: -1,
    comfort: 1,
    phoneBattery: -10
  }, // +2.5h
  st_9: {
    phoneBattery: -5
  }, // +0.5h
  st_autolaad: {}, // +0.75h — auto opladen, geen verval
  st_watertruck: {
    phoneBattery: -10
  }, // +2h
  st_10a: {
    phoneBattery: -5
  }, // +0.5h
  st_10: {
    phoneBattery: -15
  }, // +3.5h
  st_d1_avond: {
    phoneBattery: -15
  }, // +3.5h
  st_11: {
    comfort: -1,
    phoneBattery: -35
  }, // +7.5h nacht
  st_d2_morgen: {
    water: -1,
    food: -1,
    comfort: 1,
    phoneBattery: -30
  }, // +6.5h
  st_12: {
    phoneBattery: -15
  }, // +3.5h
  st_d2_avond: {
    phoneBattery: -30
  }, // +6.5h
  st_d3_morgen: {
    water: -1,
    food: -1,
    comfort: 1,
    phoneBattery: -50
  }, // +14h nacht
  st_13: {
    water: 1,
    food: 1,
    phoneBattery: -10
  }, // +2.25h
  st_14: {
    comfort: -1,
    phoneBattery: -10
  } // +2.5h
};
const sceneDecay_natuurbrand = {
  // phoneBattery: start 09:00
  bf_2: {
    phoneBattery: -5
  }, // +1.25h
  bf_2b: {
    phoneBattery: -5
  }, // +0.75h
  bf_3: {
    comfort: -1,
    phoneBattery: -5
  }, // +0.5h
  bf_4: {
    phoneBattery: -5
  }, // +0.5h
  bf_5: {
    phoneBattery: -5
  }, // +1h
  bf_5b: {
    food: -1,
    comfort: -1,
    phoneBattery: -10
  }, // +1.5h
  bf_5d: {
    comfort: -1,
    phoneBattery: -15
  }, // +3h
  bf_6: {
    comfort: -1,
    health: -1,
    phoneBattery: -30
  }, // +15h nacht
  bf_7: {
    phoneBattery: -10
  } // +2h
};
const sceneDecay_overstroming = {
  // phoneBattery: start 07:00
  ov_2: {
    phoneBattery: -10
  }, // +2.5h
  ov_3: {
    phoneBattery: -5
  }, // +1h
  ov_5: {
    health: -1,
    comfort: -2,
    phoneBattery: -10
  }, // +2.5h
  ov_5b: {
    health: -2,
    comfort: -1,
    phoneBattery: -5
  }, // +0.25h
  ov_6: {
    phoneBattery: -10
  }, // +2h
  ov_6c: {
    food: 1
  }, // +2h opvang, warm eten
  ov_6b: {
    comfort: -1,
    food: -1,
    phoneBattery: -30
  }, // +6h avond
  ov_7: {
    phoneBattery: 40
  }, // opladen op de opvang
  ov_8: {
    phoneBattery: -10
  } // +2.5h
};
const sceneDecay_thuis_komen = {
  // phoneBattery: start 11:57
  tk_2: {
    phoneBattery: -5
  }, // +0.5h
  tk_3: {
    phoneBattery: -5
  }, // +0.5h
  tk_4e: {
    phoneBattery: -10
  }, // +2.5h
  tk_5: {
    comfort: -1,
    food: -1,
    phoneBattery: -10
  }, // +2.5h
  tk_5b: {
    phoneBattery: -25
  }, // +4.5h→20:00
  tk_6: {
    phoneBattery: -10
  }, // +2h naar 18:00 pad
  tk_7: {
    phoneBattery: -15
  } // +3h avond
};
const sceneDecay_drinkwater = {
  // phoneBattery: start 13:10, scenario duurt ~7 uur
  wd_1: { phoneBattery: -5  }, // +0.5h
  wd_2: { phoneBattery: -5  }, // +0.5h
  wd_3: { phoneBattery: -10 }, // +1h
  wd_4: { phoneBattery: -10 }, // +1h
  wd_5: { phoneBattery: -5  }, // +0.75h (conditioneel)
  wd_6: { phoneBattery: -5  }, // +0.5h
  wd_7: { phoneBattery: -10 }  // +3h avond
};
const sceneDecay_nachtalarm = {
  // phoneBattery: start 02:17, scenario duurt ~30 min
  na_1: { comfort: -1, phoneBattery: -5 }, // rook geroken, stress
  na_2: { comfort: -1, phoneBattery: -5 }, // woonkamer, rook dicht
  na_3: { comfort: -1, phoneBattery: -5 }, // rook dikker, haast
  na_4: { phoneBattery: -5 }               // buiten, wachten op brandweer
};

// ─── PERSISTENT CHANNEL CONTENT ───────────────────────────────────────────────
const channels = {
  news: [],
  whatsapp: [],

  radio: []
};

// History of choices for report
const choiceHistory = [];

// ─── INTAKE ───────────────────────────────────────────────────────────────────
let intakeStep = -5; // -5=naam, -4=mensen, -3=woning, -2=voertuigen, -1=omgeving, 0+=kaart-vragen
let intakeAnswers = {};
let adultsCount = 1;
let childrenCount = 0;
let slechtTerBeenCount = 0;
let petsCount = 0;
let avatarSelections = {
  adults: [],
  children: [],
  slechtTerBeen: [],
  pets: []
};
let avatarPickerTarget = null; // { index, type }
let selectedHouseType = null;
let selectedVehicles = []; // ['auto'], ['fiets'], of beide
let selectedEnvironment = [];

const HOUSE_TYPES = [{
  val: 'appartement',
  label: 'Appartement'
}, {
  val: 'rijtjeshuis',
  label: 'Rijtjeshuis'
}, {
  val: 'vrijstaande-woning',
  label: 'Vrijstaande woning'
}, {
  val: 'boerderij',
  label: 'Boerderij'
}, ];

const intakeQs = [];

const commuteQs = [{
  id: 'commuteMode',
  q: 'Hoe reis je normaal naar je werk?',
  opts: [{
    icon: '🚗',
    label: 'Met de auto',
    val: 'car'
  }, {
    icon: '🚌',
    label: 'Openbaar vervoer',
    val: 'ov'
  }, {
    icon: '🚲',
    label: 'Met de fiets',
    val: 'bike'
  }]
}, {
  id: 'commuteDistance',
  q: 'Hoe ver is jouw woon-werkafstand?',
  opts: [{
    icon: '🏘️',
    label: 'Dichtbij, minder dan 15 km',
    val: 'near'
  }, {
    icon: '🛤️',
    label: 'Middel, 15 tot 50 km',
    val: 'medium'
  }, {
    icon: '🗺️',
    label: 'Ver, meer dan 50 km',
    val: 'far'
  }]
}, ];
let commuteStep = 0;

const ENVIRONMENT_TYPES = [{
  val: 'water',
  label: 'Nabij water',
  thumb: `<img src="afbeelding/avatars/omgeving/river.png" alt="">`
}, {
  val: 'bos',
  label: 'Bos of natuur',
  thumb: `<img src="afbeelding/avatars/omgeving/boom.png" alt="">`
}, {
  val: 'buitengebied',
  label: 'Buitengebied',
  thumb: `<img src="afbeelding/avatars/omgeving/schaap.png" alt="">`
}, {
  val: 'stedelijk',
  label: 'Stedelijk',
  thumb: `<img src="afbeelding/avatars/omgeving/stadsgebouw.png" alt="">`
}, ];

// ─── SAVE / LOAD ───────────────────────────────────────────────────────────────
const SAVE_KEY = 'ptp_savegame';
function clearSave() { localStorage.removeItem(SAVE_KEY); }

// ─── SCENARIO DATA ─────────────────────────────────────────────────────────────
let currentScenario = 'stroom';
let scenes = [];
