// ═══════════════════════════════════════════════════════════════
// Scenario Registry — centrale scenarioconfiguratie
// Bevat: scene-arrays, decay-tabellen, visuals, report-meta en
//        helpers om scenario-runtime consistent te activeren.
// ═══════════════════════════════════════════════════════════════

const DEFAULT_SCENE_BACKGROUND = 'afbeelding/algemeen/huis_normaal.webp';

const FIRE_OVERLAY_BY_SCENE = {
  bf_2: 0.30,
  bf_2b: 0.35,
  bf_3: 0.40,
  bf_3b: 0.45,
  bf_4: 0.50,
  bf_4b: 0.50,
  bf_4c: 0.55,
  bf_4d: 0.55
};

const RAIN_OVERLAY_BY_SCENE = {
  ov_1: 0.20,
  ov_1b: 0.25,
  ov_2: 0.35,
  ov_2b: 0.35,
  ov_3: 0.45,
  ov_4a: 0.50,
  ov_4b: 0.50,
  ov_5: 0.55,
  ov_5b: 0.55,
  ov_6: 0.40,
  ov_6b: 0.25
};

const DARKNESS_OVERRIDE_BY_SCENE = {
  na_intro: 0,
  na_alarm: 0.72,
  na_0: 0,
  na_1: 0,
  na_2: 0,
  na_2b: 0,
  na_3: 0,
  na_4: 0,
  na_5: 0
};

const SCENARIO_REGISTRY = {
  stroom: {
    id: 'stroom',
    label: 'Stroomuitval',
    scenes: scenes_stroom,
    sceneDecay: sceneDecay_stroom,
    visuals: {
      imageMap: sceneImages_stroom,
      imageMapFn(sceneId) {
        const ht = profile.houseType;
        if (ht !== 'hoogbouw' && ht !== 'laagbouw') return null;
        return sceneImages_stroom_appartement[sceneId] || null;
      }
    },
    report: {
      scoreMode: 'supplies',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het stroomstoringsscenario van een paar dagen gespeeld. Hieronder zie je wat je koos, wat goed ging en wat beter kan.`;
      }
    },
    audio: {
      ambient() {
        return null;
      }
    }
  },
  natuurbrand: {
    id: 'natuurbrand',
    label: 'Natuurbrand',
    scenes: scenes_natuurbrand,
    sceneDecay: sceneDecay_natuurbrand,
    visuals: {
      imageMap: sceneImages_natuurbrand,
      fireOverlay: FIRE_OVERLAY_BY_SCENE
    },
    report: {
      scoreMode: 'supplies',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het natuurbrandscenario gespeeld. Als een brand snel dichterbij komt, moet je snel kiezen. Hieronder zie je hoe jij reageerde.`;
      }
    },
    audio: {
      ambient(sceneId) {
        const forestScenes = new Set(['bf_0', 'bf_0b', 'bf_1']);
        const fireVolumes = {
          bf_2: 0.08,
          bf_2b: 0.12,
          bf_2c: 0.12,
          bf_2d: 0.12,
          bf_3: 0.16,
          bf_3c: 0.18,
          bf_4: 0.18,
          bf_4b: 0.18,
          bf_4c: 0.22,
          bf_4d: 0.22,
          bf_4e: 0.22
        };

        if (forestScenes.has(sceneId)) {
          return { name: 'forest', targetVolume: 0.14 };
        }
        if (fireVolumes[sceneId] !== undefined) {
          return { name: 'fire', targetVolume: fireVolumes[sceneId] };
        }
        return null;
      }
    }
  },
  overstroming: {
    id: 'overstroming',
    label: 'Overstroming',
    scenes: scenes_overstroming,
    sceneDecay: sceneDecay_overstroming,
    visuals: {
      imageMap: sceneImages_overstroming,
      rainOverlay: RAIN_OVERLAY_BY_SCENE
    },
    report: {
      scoreMode: 'supplies',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het overstromingsscenario gespeeld. Stijgend water geeft weinig tijd. Hieronder zie je welke keuzes jij maakte.`;
      }
    },
    audio: {
      ambient(sceneId) {
        return sceneId.startsWith('ov_') ? { name: 'rain', targetVolume: 0.22 } : null;
      }
    }
  },
  thuis_komen: {
    id: 'thuis_komen',
    label: 'Onderweg Naar Huis',
    scenes: scenes_thuis_komen,
    sceneDecay: sceneDecay_thuis_komen,
    visuals: {
      imageMap: sceneImages_thuis_komen,
      imageMapFn(sceneId) {
        const isApartment = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
        if ((sceneId === 'tk_5c' || sceneId === 'tk_6') && isApartment) {
          return 'afbeelding/stroomstoring/appartement_winter_1.webp';
        }
        return null;
      }
    },
    report: {
      scoreMode: 'supplies',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het scenario Onderweg naar huis gespeeld. Hoe kom je thuis als alles uitvalt? Hieronder zie je jouw route en keuzes.`;
      }
    },
    audio: {
      ambient(sceneId) {
        if (sceneId === 'tk_0') {
          return { name: 'computerHum', targetVolume: 1.0 };
        }
        return null;
      }
    }
  },
  drinkwater: {
    id: 'drinkwater',
    label: 'Vervuild Drinkwater',
    scenes: scenes_drinkwater,
    sceneDecay: sceneDecay_drinkwater,
    visuals: {
      imageMap: sceneImages_drinkwater
    },
    report: {
      scoreMode: 'water-health',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het scenario Vervuild drinkwater gespeeld. Bij een kookadvies draait het om zuinig plannen, officiele informatie volgen en schoon water op tijd apart zetten.`;
      }
    },
    audio: {
      ambient() {
        return null;
      }
    }
  },
  nachtalarm: {
    id: 'nachtalarm',
    label: 'Alarm In De Nacht',
    scenes: scenes_nachtalarm,
    sceneDecay: sceneDecay_nachtalarm,
    visuals: {
      imageMap: sceneImages_nachtalarm,
      darknessOverride: DARKNESS_OVERRIDE_BY_SCENE,
      imageMapFn(sceneId) {
        const isApartment = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
        if (sceneId === 'na_4') {
          return isApartment
            ? 'afbeelding/brandalarm/appartement_zomer_nacht.webp'
            : 'afbeelding/brandalarm/rookmelder_huis.webp';
        }
        if (sceneId === 'na_5') {
          return isApartment
            ? 'afbeelding/brandalarm/appartement_zomer_nacht_brandweer.webp'
            : null;
        }
        return null;
      }
    },
    report: {
      scoreMode: 'supplies',
      intro(name) {
        const jij = name ? `${name}, je` : 'Je';
        return `${jij} hebt het scenario Alarm in de nacht gespeeld. De eerste minuten bij brand zijn bepalend. Hieronder zie je hoe jij reageerde.`;
      }
    },
    audio: {
      ambient(sceneId) {
        const introScenes = new Set(['na_intro', 'na_alarm']);
        return !introScenes.has(sceneId) && !state.evacuatedFire
          ? { name: 'heartbeat', targetVolume: 0.38 }
          : null;
      }
    }
  }
};

function getScenarioConfig(scenarioId) {
  return SCENARIO_REGISTRY[scenarioId] || SCENARIO_REGISTRY.stroom;
}

function activateScenarioConfig(scenarioId) {
  const config = getScenarioConfig(scenarioId);
  currentScenario = config.id;
  scenes = config.scenes;
  sceneDecay = config.sceneDecay;
  return config;
}

function getScenarioVisualConfig(scenarioId) {
  return getScenarioConfig(scenarioId).visuals || {};
}

function getScenarioReportConfig(scenarioId) {
  return getScenarioConfig(scenarioId).report || getScenarioConfig('stroom').report;
}

function resolveSceneBackgroundAsset(scene, scenarioId) {
  const sceneVisuals = scene && scene.visuals ? scene.visuals : null;
  if (sceneVisuals && Object.prototype.hasOwnProperty.call(sceneVisuals, 'image')) {
    return sceneVisuals.image;
  }
  const visuals = getScenarioVisualConfig(scenarioId);
  if (typeof visuals.imageMapFn === 'function') {
    const dynamic = visuals.imageMapFn(scene.id);
    if (dynamic) return dynamic;
  }
  const imageMap = visuals.imageMap || {};
  return imageMap[scene.id] || DEFAULT_SCENE_BACKGROUND;
}

function resolveSceneOverlayState(scene, scenarioId) {
  const visuals = getScenarioVisualConfig(scenarioId);
  return {
    fire: visuals.fireOverlay ? (visuals.fireOverlay[scene.id] || 0) : 0,
    rain: visuals.rainOverlay ? (visuals.rainOverlay[scene.id] || 0) : 0
  };
}

function resolveSceneDarkness(scene, scenarioId) {
  const sceneVisuals = scene && scene.visuals ? scene.visuals : null;
  if (sceneVisuals && Object.prototype.hasOwnProperty.call(sceneVisuals, 'darkness')) {
    return sceneVisuals.darkness;
  }

  const visuals = getScenarioVisualConfig(scenarioId);
  if (visuals.darknessOverride && Object.prototype.hasOwnProperty.call(visuals.darknessOverride, scene.id)) {
    return visuals.darknessOverride[scene.id];
  }

  const hour = Number((scene.time || '12:00').split(':')[0]);
  if (hour >= 22 || hour < 6) return 0.88;
  if (hour < 9 || hour >= 18) return 0.68;
  return 0;
}

function preloadScenarioAssets(scenarioId) {
  const config = getScenarioConfig(scenarioId);
  const visuals = getScenarioVisualConfig(scenarioId);
  const imageMap = visuals.imageMap || {};
  const srcs = new Set(Object.values(imageMap));
  // Preload ook de profiel-afhankelijke afbeeldingen (imageMapFn) als die beschikbaar zijn
  if (typeof visuals.imageMapFn === 'function') {
    const scenes = config.scenes || [];
    scenes.forEach(s => {
      const dynamic = visuals.imageMapFn(s.id);
      if (dynamic) srcs.add(dynamic);
    });
  }
  srcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  if (typeof Ambience !== 'undefined' && typeof Ambience.preload === 'function') {
    const ambientNames = new Set();
    (config.scenes || []).forEach(scene => {
      const ambient = resolveScenarioAmbient(scene.id, scenarioId);
      if (ambient && ambient.name) ambientNames.add(ambient.name);
    });
    Ambience.preload([...ambientNames]);
  }
}

function resolveScenarioAmbient(sceneId, scenarioId) {
  const audioConfig = getScenarioConfig(scenarioId).audio;
  return audioConfig && typeof audioConfig.ambient === 'function'
    ? audioConfig.ambient(sceneId)
    : null;
}
