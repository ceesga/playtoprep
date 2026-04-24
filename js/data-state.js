// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Noodscenario Simulator — Game State & Data Definities
// Bevat: profiel, spelstatus, scene-decay, kanaal-inhoud,
//        huishoud-variabelen, constanten voor intake
// ═══════════════════════════════════════════════════════════════

// ─── CONSTANTEN ───────────────────────────────────────────────────────────────

// Maximale waarden voor stat-meters
const MAX_STAT_WATER   = 999; // onbegrensd — echte dagwaarden
const MAX_STAT_FOOD    = 999; // onbegrensd — echte dagwaarden
const MAX_STAT_COMFORT = 10;
const MAX_STAT_HEALTH  = 10;
const MAX_STAT_SEGS    = 5; // aantal segmenten zichtbaar in de UI

// Startwaarden bij aanvang van een scenario
const START_WATER         = 3;
const START_FOOD          = 3;
const START_COMFORT       = 10;
const START_HEALTH        = 10;
const START_CASH          = 20;
const START_PHONE_BATTERY = 100;

// Huishoud-limieten
const MAX_HOUSEHOLD = 8;
const MAX_PETS      = 4;

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const PROFILE_DEFAULTS = {
  playerName: '',
  houseType: '',
  houseSubType: '', // sub-type bij 'overige': 'caravan', 'tiny_house' of 'woonboot'
  ouderenCount: 0,
  adults: 1,
  members: 1,
  childrenCount: 0,
  region: '',
  hasChildren: false,
  hasElderly: false,
  hasMobilityImpaired: false,
  playerPersonType: 'adult',
  playerIsMobilityImpaired: false,
  playerIsElderly: false,
  hasPets: false,
  hasMedNeeds: false,
  location: [],
  hasCar: false,
  hasBike: false,
  hasMotorcycle: false,
  hasScooter: false,
  hasEbike: false,
  hasNoodplan: false,
  hasKit: false,
  hasWater: false,
  hasFood: false,
  hasExtraFood: false,
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
  hasBOBBag: false,
  hasBOBWater: false,
  commuteMode: '',
  commuteDistance: '',
  intakeCompleted: false,
  prepCompleted: false,
  hasEDCBag: false,
  hasEDCCash: false,
  hasEDCSnacks: false,
  hasEDCCharger: false,
  hasEDCWater: false,
  hasEDCKnife: false
};

function cloneDefaultValue(value) {
  if (Array.isArray(value)) return value.map(cloneDefaultValue);
  if (value && typeof value === 'object') {
    const cloned = {};
    Object.keys(value).forEach(key => {
      cloned[key] = cloneDefaultValue(value[key]);
    });
    return cloned;
  }
  return value;
}

function createDefaults(defaults) {
  return cloneDefaultValue(defaults);
}

function resetObjectToDefaults(target, defaults) {
  Object.keys(target).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) delete target[key];
  });
  Object.keys(defaults).forEach(key => {
    target[key] = cloneDefaultValue(defaults[key]);
  });
  return target;
}

const profile = createDefaults(PROFILE_DEFAULTS);

// ─── GAME STATE ───────────────────────────────────────────────────────────────
const STATE_DEFAULTS = {
  awarenessLevel: 0,
  tapWaterAvailable: true,
  shopsOpen: true,
  followedOfficialAdvice: false,
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
  water: START_WATER,
  food: START_FOOD,
  comfort: START_COMFORT,
  ranOutOfWater: false,
  ranOutOfFood: false,
  health: START_HEALTH,
  cash: START_CASH,
  powerbank: 0,
  phoneBattery: START_PHONE_BATTERY,
  carMovedHigher: false,
  tookAlarmSeriously: false,
  warnedHousemates: false,
  didntUseWaterOnFire: false,
  evacuatedFire: false,
  called112PreExit: false,
  called112: false,
  stayedOutside: false,
  delayedEvacuation: false,
  travelingWithMartijn: false,
  evacuated: false,
  packedBag: false,
  madeFirebreak: false,
  bfTravelMode: '',
  bfCrossFireSafe: false,
  bfAssistedEvacuation: false,
  returnedHome: false,
  tookPets: false,
  kidsEvacuated: false,
  wentUpstairs: null,
  evacuatedFlood: false,
  savedItems: false,
  calledRescue: false,
  kidsWithYou: false,
  sentKidsToSchool: false,
  cutElectricity: false,
  travelMode: 'car',
  reachedHome: false,
  arriveHomeAt1743: false,
  foundAlternative: false,
  helpedStranger: false,
  kidsPickedUp: false,
  kidsArranged: false,
  kidsNoodpakket: false,
  kidsKeptHome: false,
  hadEDCBag: false,
  evacuatedEarly: false,
  warnedKevin: false,
  sealedHome: false,
  contactedAnnie: false,
  contactedAns: false,
  takingAns: false,
  day2Started: false,
  hasCarRadio: false,
  airplaneMode: false,
  leftEarly: false,
  inventory: {}
};

const state = createDefaults(STATE_DEFAULTS);

const STATE_VALUE_LIMITS = {
  water: MAX_STAT_WATER,
  food: MAX_STAT_FOOD,
  comfort: MAX_STAT_COMFORT,
  health: MAX_STAT_HEALTH,
  cash: 9999,
  phoneBattery: 100,
  powerbank: 100
};

const STATE_DELTA_KEYS = new Set(Object.keys(STATE_VALUE_LIMITS));

function getStateValueLimit(key) {
  return Object.prototype.hasOwnProperty.call(STATE_VALUE_LIMITS, key)
    ? STATE_VALUE_LIMITS[key]
    : null;
}

function applyStateChange(target, change, options) {
  if (!change) return target;
  const opts = options || {};
  const deltaKeys = opts.deltaKeys || STATE_DELTA_KEYS;
  const customHandlers = opts.customHandlers || {};

  Object.keys(change).forEach(key => {
    const value = change[key];

    if (customHandlers[key]) {
      customHandlers[key](target, value, change);
      return;
    }

    if (deltaKeys.has(key) && typeof value === 'number') {
      const current = Number(target[key]) || 0;
      const max = getStateValueLimit(key);
      const next = current + value;
      target[key] = max === null ? next : Math.max(0, Math.min(max, next));
      return;
    }

    target[key] = cloneDefaultValue(value);
  });

  return target;
}

function buildScenarioStartState(scenarioId) {
  const nextState = createDefaults(STATE_DEFAULTS);
  const hasPrepCash = profile.hasCash === 'ja';
  const hasPrepFlashlight = profile.hasFlashlight === 'ja';
  const hasPrepWater = profile.hasWater === 'ja';
  const hasPrepKit = profile.hasKit === 'ja';
  const hasEDCBag = profile.hasEDCBag === 'ja';
  const homeCash = scenarioId === 'thuis_komen' ? 0 : (hasPrepCash ? 100 : 0);

  nextState.hasCash = hasPrepCash;
  nextState.hasFlashlight = hasPrepFlashlight;
  nextState.hasWater = hasPrepWater;
  nextState.travelMode = profile.commuteMode || 'car';
  nextState.hadEDCBag = hasEDCBag;
  nextState.water = 1 + (hasPrepWater ? 3 : 0);
  nextState.food = 2 + ((hasPrepKit || profile.hasExtraFood) ? 3 : 0);
  nextState.cash = 20 + homeCash + (hasEDCBag ? 100 : 0);
  nextState.powerbank = profile.hasPowerbank === 'ja' ? 5 : 0;
  nextState.phoneBattery = 80;

  return nextState;
}

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
    phoneBattery: -35,
    shopsOpen: false
  }, // +7h nacht — supermarkten dicht
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
    phoneBattery: -5,
    tapWaterAvailable: false
  }, // +0.5h — rioolgemalen vallen uit, waterdruk daalt
  st_autolaad: {}, // +0.75h — auto opladen, geen verval
  st_watertruck: {
    phoneBattery: -10
  }, // +2h
  st_10b: {
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
  tk_6: {
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
  // Scenario duurt ~30 min — batterijafname verwaarloosbaar (<5% per uur)
};

// ─── PERSISTENT CHANNEL CONTENT ───────────────────────────────────────────────
const channels = {
  news: [],
  whatsapp: [],
  alerts: [],
  radio: []
};

// History of choices for report
const choiceHistory = [];

// ─── INTAKE ───────────────────────────────────────────────────────────────────
let intakeStep = -6; // -6=naam, -5=mensen, -4=wie_ben_jij, -3=woning, -2=voertuigen, -1=omgeving, 0+=kaart-vragen
let intakeAnswers = {};
let adultsCount = 1;
let childrenCount = 0;
let slechtTerBeenCount = 0;
let ouderenCount = 0;
let petsCount = 0;
let avatarSelections = {
  adults: [],
  children: [],
  slechtTerBeen: [],
  ouderen: [],
  pets: []
};
let avatarPickerTarget = null; // { index, type }
let selectedHouseType = null;
let selectedOverigeSubType = null; // sub-type van 'overige': 'caravan', 'tiny_house', 'woonboot'
let selectedVehicles = []; // ['auto'], ['fiets'], of beide
let selectedEnvironment = [];
let selectedPlayerPerson = null; // { type: 'adult'|'ouderen'|'slechtTerBeen'|'child', index: number }

const HOUSE_TYPES = [{
  val: 'hoogbouw',
  label: 'Hoogbouw (met lift)'
}, {
  val: 'laagbouw',
  label: 'Laagbouw (appartementen)',
  img: 'appartement'
}, {
  val: 'rijwoning',
  label: 'Rijwoningen'
}, {
  val: 'vrijstaande-woning',
  label: 'Vrijstaande woningen'
}, {
  val: 'overige',
  label: 'Overige woningen'
}];

const OVERIGE_TYPES = [{
  val: 'caravan',
  label: 'Caravan'
}, {
  val: 'tiny_house',
  label: 'Tiny house'
}, {
  val: 'woonboot',
  label: 'Woonboot'
}];

const intakeQs = [];

const commuteQs = [{
  id: 'commuteMode',
  q: 'Hoe reis je normaal naar je werk?',
  opts: [{
    icon: 'car',
    label: 'Met de auto',
    val: 'car'
  }, {
    icon: 'bus',
    label: 'Openbaar vervoer',
    val: 'ov'
  }, {
    icon: 'bike',
    label: 'Met de fiets',
    val: 'bike'
  }]
}, {
  id: 'commuteDistance',
  q: 'Hoe ver is jouw woon-werkafstand?',
  opts: [{
    icon: 'house',
    label: 'Dichtbij, minder dan 15 km',
    val: 'near'
  }, {
    icon: 'footprints',
    label: 'Middel, 15 tot 50 km',
    val: 'medium'
  }, {
    icon: 'train',
    label: 'Ver, meer dan 50 km',
    val: 'far'
  }]
}, ];
let commuteStep = 0;

const ENVIRONMENT_TYPES = [{
  val: 'water',
  label: 'Nabij water',
  thumb: `<img src="afbeelding/avatars/omgeving/rivier.png" alt="">`
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
  label: 'Bebouwde kom',
  thumb: `<img src="afbeelding/avatars/omgeving/stadsgebouw.png" alt="">`
}, ];

// ─── SAVE / LOAD ───────────────────────────────────────────────────────────────
const SAVE_KEY = 'ptp_savegame';
function clearSave() { localStorage.removeItem(SAVE_KEY); }

// ─── SCENARIO DATA ─────────────────────────────────────────────────────────────
let currentScenario = 'stroom';
let scenes = [];
