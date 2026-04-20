const CACHE_VERSION = 'v1';
const CACHE_NAME = `playtoprep-${CACHE_VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/js/icons-data.js',
  '/js/data-state.js',
  '/js/data-scenarios-stroom.js',
  '/js/data-scenarios-bosbrand.js',
  '/js/data-scenarios-overstroming.js',
  '/js/data-scenarios-thuiskomen.js',
  '/js/data-scenarios-drinkwater.js',
  '/js/data-scenarios-nachtalarm.js',
  '/js/scenario-registry.js',
  '/js/intake.js',
  '/js/prep.js',
  '/js/inventory.js',
  '/js/audio.js',
  '/js/engine.js',
  '/js/report.js',
  '/js/ui.js',
  '/rain-overlay.mp4',
  '/fire-overlay.mp4',
  '/afbeelding/algemeen/appartement_zomer.webp',
  '/afbeelding/algemeen/backpack.webp',
  '/afbeelding/algemeen/huis_normaal.webp',
  '/afbeelding/algemeen/logo-opsterland.webp',
  '/afbeelding/algemeen/noodopvang.webp',
  '/afbeelding/algemeen/opslag_appartement.webp',
  '/afbeelding/algemeen/opslag_kelder.webp',
  '/afbeelding/algemeen/ptp_logo.webp',
  '/afbeelding/algemeen/supermarkt.webp',
  '/afbeelding/algemeen/woonkamer_normaal.webp',
  '/afbeelding/bosbrand/bomen_afgebrand.webp',
  '/afbeelding/bosbrand/bosbrand_fase_1.webp',
  '/afbeelding/bosbrand/bosbrand_fase_2.webp',
  '/afbeelding/bosbrand/bosbrand_fase_2b.webp',
  '/afbeelding/bosbrand/bosbrand_fase_3.webp',
  '/afbeelding/bosbrand/geen_bosbrand.webp',
  '/afbeelding/brandalarm/appartement_zomer_nacht.webp',
  '/afbeelding/brandalarm/appartement_zomer_nacht_brandweer.webp',
  '/afbeelding/brandalarm/huis_brand.webp',
  '/afbeelding/brandalarm/naar_bed.webp',
  '/afbeelding/brandalarm/rook_hal.webp',
  '/afbeelding/brandalarm/rook_uitgang.webp',
  '/afbeelding/brandalarm/rook_woonkamer.webp',
  '/afbeelding/brandalarm/rookmelder_huis.webp',
  '/afbeelding/brandalarm/wakker_worden.webp',
  '/afbeelding/overstroming/auto_water.webp',
  '/afbeelding/overstroming/overstroming_avond.webp',
  '/afbeelding/overstroming/overstroming_ernstig.webp',
  '/afbeelding/overstroming/overstroming_hoogwater.webp',
  '/afbeelding/overstroming/overstroming_naderhand.webp',
  '/afbeelding/overstroming/overstroming_straat.webp',
  '/afbeelding/overstroming/overstroming_wijk.webp',
  '/afbeelding/overstroming/reddingsboot.webp',
  '/afbeelding/stroomstoring/appartement_winter_0.webp',
  '/afbeelding/stroomstoring/appartement_winter_1.webp',
  '/afbeelding/stroomstoring/appartement_winter_2.webp',
  '/afbeelding/stroomstoring/huis_winter_0.webp',
  '/afbeelding/stroomstoring/huis_winter_1.webp',
  '/afbeelding/stroomstoring/huis_winter_2.webp',
  '/afbeelding/stroomstoring/huis_winter_3.webp',
  '/afbeelding/stroomstoring_onderweg/auto_snelweg.webp',
  '/afbeelding/stroomstoring_onderweg/busstation.webp',
  '/afbeelding/stroomstoring_onderweg/fietspad.webp',
  '/afbeelding/stroomstoring_onderweg/kantoor.webp',
  '/afbeelding/stroomstoring_onderweg/kantoor_licht.webp',
  '/afbeelding/stroomstoring_onderweg/treinstation.webp',
  '/afbeelding/stroomstoring_onderweg/voetganger.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response.ok || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
