// ═══════════════════════════════════════════════════════════════
// Inventory — scenario-items op basis van prep + context
// Toont een compacte inventaris tijdens het scenario en laat
// spelers bruikbare items activeren zonder de scène te verlaten.
// ═══════════════════════════════════════════════════════════════

const INVENTORY_GROUP_ORDER = ['always', 'vehicles', 'bag', 'edc', 'personal', 'home'];
const INVENTORY_GROUP_LABELS = {
  always: 'Altijd bij je',
  vehicles: 'Voertuigen',
  bag: 'Vluchttas',
  edc: 'Reistas / EDC',
  personal: 'Persoonlijk',
  home: 'Thuis bruikbaar'
};

function prepYes(value) {
  return value === 'ja';
}

function prepPresent(value) {
  return value === 'ja' || value === 'niet_opgeladen';
}

function getInventoryScene() {
  if (typeof getActiveScenes !== 'function') return null;
  const visibleScenes = getActiveScenes();
  return visibleScenes[currentSceneIdx] || null;
}

function getInventoryContext() {
  return {
    scene: getInventoryScene(),
    isCommute: currentScenario === 'thuis_komen',
    isHomeScenario: currentScenario && currentScenario !== 'thuis_komen',
    hasCar: currentScenario === 'thuis_komen'
      ? (profile.commuteMode === 'car' || state.travelMode === 'car')
      : !!profile.hasCar,
    hasBike: currentScenario === 'thuis_komen'
      ? (profile.commuteMode === 'bike' || state.travelMode === 'bike')
      : !!profile.hasBike
  };
}

function buildInventoryDefaults() {
  return {
    flashlight: {
      empty: profile.hasFlashlight !== 'ja',
      used: false
    },
    radio: {
      empty: profile.hasRadio !== 'ja',
      used: false
    },
    powerbank: {
      empty: profile.hasPowerbank !== 'ja',
      used: false
    },
    meds: {
      used: false
    },
    waterBottle: {
      used: false
    },
    snack: {
      used: false
    },
    firstAid: {
      used: false
    },
    charger: {
      used: false
    }
  };
}

function ensureInventoryState() {
  if (!state.inventory || typeof state.inventory !== 'object') state.inventory = {};
  const defaults = buildInventoryDefaults();
  Object.keys(defaults).forEach(key => {
    const current = state.inventory[key];
    state.inventory[key] = {
      ...defaults[key],
      ...(current && typeof current === 'object' ? current : {})
    };
  });

  // Scenario-keuzes kunnen later alsnog een zaklamp of autoradio opleveren.
  if (state.hasFlashlight && !prepPresent(profile.hasFlashlight) && !state.inventory.flashlight.used) {
    state.inventory.flashlight.empty = false;
  }
  if (state.hasCarRadio) {
    state.inventory.radio.empty = false;
  }
}

function inventoryRuntime(id) {
  ensureInventoryState();
  if (!state.inventory[id]) state.inventory[id] = {};
  return state.inventory[id];
}

function getRadioAvailableInContext(ctx) {
  return ctx.isHomeScenario
    ? prepPresent(profile.hasRadio)
    : !!state.hasCarRadio;
}

function applyInventoryStateChange(sc) {
  if (!sc) return;
  const DELTA_KEYS = new Set(['water', 'food', 'comfort', 'health', 'cash', 'phoneBattery']);
  Object.keys(sc).forEach(key => {
    const value = sc[key];
    if (DELTA_KEYS.has(key)) {
      const max = key === 'cash'
        ? 9999
        : key === 'phoneBattery'
          ? 100
          : key === 'comfort'
            ? MAX_STAT_COMFORT
            : key === 'health'
              ? MAX_STAT_HEALTH
              : 999;
      state[key] = Math.max(0, Math.min(max, state[key] + value));
      return;
    }
    if (Array.isArray(value)) {
      state[key] = value.slice();
      return;
    }
    state[key] = value;
  });
}

function showInventoryConsequence(text) {
  const box = document.getElementById('sc-consequence');
  if (!box) return;
  box.innerHTML = '';
  const span = document.createElement('span');
  span.className = 'consequence-inline';
  box.appendChild(span);
  box.classList.add('show');
  if (typeof Typewriter !== 'undefined') {
    Typewriter.run(text, span, null);
  } else {
    span.textContent = text;
  }
}

function hideInventoryConsequence() {
  const box = document.getElementById('sc-consequence');
  if (!box) return;
  box.classList.remove('show');
  box.innerHTML = '';
}

const INVENTORY_ITEMS = [
  {
    id: 'phone',
    label: 'Telefoon',
    icon: 'smartphone',
    group: 'always',
    isVisible: () => true,
    onUse() {
      if (state.phoneBattery <= 0) {
        return { consequence: 'Je telefoon is leeg.' };
      }
      return { consequence: `Je checkt je telefoon. Batterij: ${state.phoneBattery}%.` };
    }
  },
  {
    id: 'wallet',
    label: 'Portemonnee',
    icon: 'wallet',
    group: 'always',
    isVisible: () => true,
    onUse() {
      return {
        consequence: state.cash > 0
          ? `Je controleert je portemonnee. Je hebt nog €${state.cash} contant bij je.`
          : 'Je controleert je portemonnee. Die is op dit moment leeg.'
      };
    }
  },
  {
    id: 'keys',
    label: 'Sleutels',
    icon: 'key-round',
    group: 'always',
    isVisible: () => true,
    onUse() {
      return { consequence: 'Je voelt even in je zak. Je sleutels zitten er nog.' };
    }
  },
  {
    id: 'car',
    label: 'Auto',
    icon: 'car',
    group: 'vehicles',
    isVisible: ctx => ctx.hasCar,
    onUse(ctx) {
      return {
        consequence: ctx.isCommute
          ? 'Je auto is je huidige route-optie zolang hij bereikbaar blijft.'
          : 'Je auto staat klaar als je hem nodig hebt.'
      };
    }
  },
  {
    id: 'bike',
    label: 'Fiets',
    icon: 'bike',
    group: 'vehicles',
    isVisible: ctx => ctx.hasBike,
    onUse(ctx) {
      return {
        consequence: ctx.isCommute
          ? 'Je fiets is een bruikbaar alternatief zolang je route begaanbaar blijft.'
          : 'Je fiets staat klaar als je snel wilt vertrekken.'
      };
    }
  },
  {
    id: 'flashlight',
    label: 'Zaklamp',
    icon: 'flashlight',
    group: 'bag',
    isVisible: ctx => ctx.isHomeScenario && (prepPresent(profile.hasFlashlight) || state.hasFlashlight),
    getStatus() {
      return inventoryRuntime('flashlight').empty ? 'Leeg' : '';
    },
    isEmpty() {
      return !!inventoryRuntime('flashlight').empty;
    },
    onUse() {
      const runtime = inventoryRuntime('flashlight');
      if (runtime.empty) {
        return { consequence: 'De zaklamp is leeg.' };
      }
      runtime.empty = true;
      runtime.used = true;
      return { consequence: 'Je zet de zaklamp even aan om beter te zien. Daarna is de batterij leeg.' };
    }
  },
  {
    id: 'documents',
    label: 'Documenten',
    icon: 'id-card',
    group: 'bag',
    isVisible: ctx => ctx.isHomeScenario && prepYes(profile.hasDocuments),
    onUse() {
      return { consequence: 'Je controleert je belangrijke documenten. Alles zit nog netjes bij elkaar.' };
    }
  },
  {
    id: 'meds',
    label: 'Medicijnen',
    icon: 'pill',
    group: 'personal',
    isVisible: () => prepYes(profile.hasMeds),
    getStatus() {
      return inventoryRuntime('meds').used ? 'Gebruikt' : '';
    },
    isUsed() {
      return !!inventoryRuntime('meds').used;
    },
    onUse() {
      const runtime = inventoryRuntime('meds');
      if (runtime.used) {
        return { consequence: 'Je hebt je medicijnen al ingenomen.' };
      }
      runtime.used = true;
      return {
        stateChange: state.health < MAX_STAT_HEALTH ? { health: 1 } : null,
        consequence: 'Je neemt je dagelijkse medicijnen in.'
      };
    }
  },
  {
    id: 'waterBottle',
    label: 'Waterfles',
    icon: 'milk',
    group: 'edc',
    isVisible: ctx => ctx.isCommute
      ? prepYes(profile.hasEDCWater)
      : (prepYes(profile.hasEDCWater) || prepYes(profile.hasBOBWater)),
    getStatus() {
      return inventoryRuntime('waterBottle').used ? 'Op' : '';
    },
    isUsed() {
      return !!inventoryRuntime('waterBottle').used;
    },
    onUse() {
      const runtime = inventoryRuntime('waterBottle');
      if (runtime.used) {
        return { consequence: 'Je waterfles is leeg.' };
      }
      runtime.used = true;
      return {
        stateChange: { water: 1 },
        consequence: 'Je neemt een paar slokken uit je waterfles.'
      };
    }
  },
  {
    id: 'firstAid',
    label: 'EHBO-doos',
    icon: 'briefcase-medical',
    group: 'home',
    isVisible: ctx => ctx.isHomeScenario && prepYes(profile.hasFirstAid),
    getStatus() {
      return inventoryRuntime('firstAid').used ? 'Gebruikt' : '';
    },
    isUsed() {
      return !!inventoryRuntime('firstAid').used;
    },
    onUse() {
      const runtime = inventoryRuntime('firstAid');
      if (runtime.used) {
        return { consequence: 'Je hebt je EHBO-spullen al gebruikt.' };
      }
      if (state.health >= MAX_STAT_HEALTH) {
        return { consequence: 'Je kijkt in de EHBO-doos, maar op dit moment hoef je niets te verzorgen.' };
      }
      runtime.used = true;
      return {
        stateChange: { health: 1 },
        consequence: 'Je gebruikt iets uit de EHBO-doos en verzorgt jezelf.'
      };
    }
  },
  {
    id: 'radio',
    label: 'Radio',
    icon: 'boom-box',
    group: 'home',
    isVisible: ctx => getRadioAvailableInContext(ctx),
    getStatus(ctx) {
      if (ctx.isCommute && state.hasCarRadio) return '';
      return inventoryRuntime('radio').empty ? 'Leeg' : '';
    },
    isEmpty(ctx) {
      return ctx.isCommute && state.hasCarRadio ? false : !!inventoryRuntime('radio').empty;
    },
    onUse(ctx) {
      if (ctx.isCommute && state.hasCarRadio) {
        return {
          switchTab: 'radio',
          consequence: 'Je zet de radio aan om officiële updates te volgen.'
        };
      }
      const runtime = inventoryRuntime('radio');
      if (runtime.empty) {
        return { consequence: 'De radio heeft nu geen werkende batterijen.' };
      }
      return {
        switchTab: 'radio',
        consequence: 'Je zet de radio aan om officiële updates te volgen.'
      };
    }
  },
  {
    id: 'snack',
    label: 'Snack',
    icon: 'cookie',
    group: 'edc',
    isVisible: () => prepYes(profile.hasEDCSnacks),
    getStatus() {
      return inventoryRuntime('snack').used ? 'Op' : '';
    },
    isUsed() {
      return !!inventoryRuntime('snack').used;
    },
    onUse() {
      const runtime = inventoryRuntime('snack');
      if (runtime.used) {
        return { consequence: 'Je hebt je snack al opgegeten.' };
      }
      runtime.used = true;
      return {
        stateChange: { food: 1 },
        consequence: 'Je eet iets en hebt weer wat energie.'
      };
    }
  },
  {
    id: 'charger',
    label: 'Oplader',
    icon: 'cable',
    group: 'edc',
    isVisible: () => prepYes(profile.hasEDCCharger),
    getStatus() {
      return inventoryRuntime('charger').used ? 'Gebruikt' : '';
    },
    isUsed() {
      return !!inventoryRuntime('charger').used;
    },
    onUse(ctx) {
      const runtime = inventoryRuntime('charger');
      if (runtime.used) {
        return { consequence: 'Je kabel heeft hier al gedaan wat hij kon doen.' };
      }
      if (ctx.isCommute && ctx.scene && ctx.scene.id === 'tk_1' && state.phoneBattery < 100) {
        runtime.used = true;
        return {
          stateChange: {
            phoneBattery: Math.min(100, state.phoneBattery + 10) - state.phoneBattery
          },
          consequence: 'Je gebruikt je kabel om je telefoon kort via je laptop op te laden.'
        };
      }
      return { consequence: 'Zonder werkend stroompunt of vrije aansluiting helpt je oplader je nu niet verder.' };
    }
  },
  {
    id: 'knife',
    label: 'Zakmes',
    icon: 'pocket-knife',
    group: 'edc',
    isVisible: () => prepYes(profile.hasEDCKnife),
    onUse() {
      return { consequence: 'Je houdt je zakmes binnen handbereik voor als je het nodig hebt.' };
    }
  },
  {
    id: 'gasStove',
    label: 'Gasstel',
    icon: 'flame-kindling',
    group: 'home',
    isVisible: ctx => ctx.isHomeScenario && prepYes(profile.hasGasStove),
    onUse() {
      return {
        stateChange: { hasCampingStove: true },
        consequence: 'Je zet het gasstel klaar, zodat je het snel kunt gebruiken als dat nodig is.'
      };
    }
  },
  {
    id: 'powerbank',
    label: 'Powerbank',
    icon: 'smartphone-charging',
    group: 'personal',
    isVisible: () => prepPresent(profile.hasPowerbank),
    getStatus() {
      return inventoryRuntime('powerbank').empty ? 'Leeg' : '';
    },
    isEmpty() {
      return !!inventoryRuntime('powerbank').empty;
    },
    onUse(ctx) {
      const runtime = inventoryRuntime('powerbank');
      if (runtime.empty) {
        return { consequence: 'De powerbank is leeg.' };
      }
      const phoneDelta = Math.min(100, state.phoneBattery + 30) - state.phoneBattery;
      const flashlightRuntime = inventoryRuntime('flashlight');
      const canRechargeFlashlight = ctx.isHomeScenario
        && (prepPresent(profile.hasFlashlight) || state.hasFlashlight)
        && flashlightRuntime.empty;
      if (phoneDelta === 0 && !canRechargeFlashlight) {
        return { consequence: 'Je powerbank heeft nu niets om op te laden.' };
      }
      runtime.empty = true;
      runtime.used = true;
      state.powerbank = 0;
      if (canRechargeFlashlight) {
        flashlightRuntime.empty = false;
        flashlightRuntime.used = false;
      }
      return {
        stateChange: phoneDelta ? { phoneBattery: phoneDelta } : null,
        consequence: canRechargeFlashlight
          ? 'Je laadt je telefoon op en geeft je zaklamp weer stroom.'
          : 'Je laadt je telefoon op met de powerbank.'
      };
    }
  },
  {
    id: 'laptop',
    label: 'Laptop',
    icon: 'laptop',
    group: 'personal',
    isVisible: ctx => ctx.isCommute,
    onUse(ctx) {
      return {
        consequence: ctx.scene && ctx.scene.id === 'tk_1'
          ? 'Je checkt je laptop. De accu doet het nog, maar zonder wifi heb je er maar beperkt iets aan.'
          : 'Je draagt je laptop nog steeds mee. Dat is extra gewicht, maar je wilt hem niet achterlaten.'
      };
    }
  }
];

function getVisibleInventoryItems() {
  const ctx = getInventoryContext();
  return INVENTORY_ITEMS
    .filter(item => item.isVisible(ctx))
    .map(item => {
      const runtime = inventoryRuntime(item.id);
      const isEmpty = item.isEmpty ? item.isEmpty(ctx) : !!runtime.empty;
      const isUsed = item.isUsed ? item.isUsed(ctx) : !!runtime.used;
      const status = item.getStatus ? item.getStatus(ctx) : '';
      return {
        ...item,
        isEmpty,
        isUsed,
        status
      };
    });
}

function renderInventory() {
  ensureInventoryState();

  const toggleIcon = document.getElementById('inventory-toggle-icon');
  if (toggleIcon && !toggleIcon.innerHTML) {
    toggleIcon.innerHTML = (typeof ICON_SVG !== 'undefined' && ICON_SVG.briefcase) ? ICON_SVG.briefcase : '';
  }

  const body = document.getElementById('inventory-body');
  if (!body) return;
  const items = getVisibleInventoryItems();
  const groups = INVENTORY_GROUP_ORDER
    .map(groupId => ({
      id: groupId,
      title: INVENTORY_GROUP_LABELS[groupId],
      items: items.filter(item => item.group === groupId)
    }))
    .filter(group => group.items.length);

  body.innerHTML = groups.map(group => {
    const grid = group.items.map(item => {
      const iconSvg = (typeof ICON_SVG !== 'undefined' && ICON_SVG[item.icon]) ? ICON_SVG[item.icon] : '';
      const cls = [
        'inventory-item',
        item.isEmpty ? 'is-empty' : '',
        item.isUsed ? 'is-used' : ''
      ].filter(Boolean).join(' ');
      const status = item.status ? `<span class="inventory-item-status">${item.status}</span>` : '';
      return `<button type="button" class="${cls}" onclick="useInventoryItem('${item.id}')"><span class="inventory-item-icon" aria-hidden="true">${iconSvg}</span><span class="inventory-item-label">${item.label}</span>${status}</button>`;
    }).join('');
    return `<section class="inventory-group"><div class="inventory-group-title">${group.title}</div><div class="inventory-grid">${grid}</div></section>`;
  }).join('');
}

function toggleInventory(forceOpen) {
  const panel = document.getElementById('inventory-panel');
  const toggle = document.getElementById('inventory-toggle');
  if (!panel || !toggle) return;
  const shouldOpen = typeof forceOpen === 'boolean'
    ? forceOpen
    : panel.hidden;
  panel.hidden = !shouldOpen;
  panel.classList.toggle('open', shouldOpen);
  toggle.setAttribute('aria-expanded', String(shouldOpen));
  if (shouldOpen) renderInventory();
}

function closeInventory() {
  toggleInventory(false);
}

function useInventoryItem(id) {
  ensureInventoryState();
  const ctx = getInventoryContext();
  const item = INVENTORY_ITEMS.find(entry => entry.id === id);
  if (!item || !item.isVisible(ctx)) return;
  const outcome = item.onUse ? item.onUse(ctx) : null;
  if (!outcome) return;
  applyInventoryStateChange(outcome.stateChange);
  if (outcome.switchTab && typeof switchTab === 'function') {
    switchTab(outcome.switchTab);
  }
  renderStatusBars();
  renderInventory();
  if (outcome.consequence) showInventoryConsequence(outcome.consequence);
}

function initInventoryUi() {
  const wrap = document.getElementById('scenario-inventory');
  if (!wrap) return;
  const toggle = document.getElementById('inventory-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
  }
  renderInventory();
  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') closeInventory();
  });
  document.addEventListener('click', evt => {
    const panel = document.getElementById('inventory-panel');
    if (!panel || panel.hidden) return;
    if (!wrap.contains(evt.target)) closeInventory();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInventoryUi);
} else {
  initInventoryUi();
}
