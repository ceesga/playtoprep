// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// Service Worker v3 — App-shell strategie
// Pre-cache: alleen de app-shell (~4 MB).
// Al het overige (audio, video, scenario-afbeeldingen) wordt gecached
// zodra het de eerste keer wordt opgevraagd (cache-on-demand).

const CACHE_VERSION = 'v3';
const CACHE_NAME = `playtoprep-${CACHE_VERSION}`;

// App-shell: alles wat de speler nodig heeft vóór het scenario kiest.
// Audio, video en scenario-afbeeldingen staan hier NIET in —
// die worden gecached bij eerste gebruik.
const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/robots.txt',

  // JS — één minified bundle
  '/js/bundle.min.js',

  // Algemene afbeeldingen (zichtbaar vóór scenariokeuze)
  '/afbeelding/algemeen/startpagina.webp',
  '/afbeelding/algemeen/appartement_zomer.webp',
  '/afbeelding/algemeen/backpack.webp',
  '/afbeelding/algemeen/golden_force_shield.webp',
  '/afbeelding/algemeen/huis_normaal.webp',
  '/afbeelding/algemeen/noodopvang.webp',
  '/afbeelding/algemeen/opslag_appartement.webp',
  '/afbeelding/algemeen/opslag_kelder.webp',
  '/afbeelding/algemeen/ptp_logo.webp',
  '/afbeelding/algemeen/supermarkt.webp',
  '/afbeelding/algemeen/woonkamer_normaal.webp',

  // Avatars — nodig tijdens intake
  '/afbeelding/avatars/adult/man-1.png',
  '/afbeelding/avatars/adult/man-3.png',
  '/afbeelding/avatars/adult/man-4.png',
  '/afbeelding/avatars/adult/man-5.png',
  '/afbeelding/avatars/adult/man-6.png',
  '/afbeelding/avatars/adult/man-7.png',
  '/afbeelding/avatars/adult/woman-1.png',
  '/afbeelding/avatars/adult/woman-3.png',
  '/afbeelding/avatars/adult/woman-4.png',
  '/afbeelding/avatars/adult/woman-5.png',
  '/afbeelding/avatars/adult/woman-6.png',
  '/afbeelding/avatars/child/boy-1.png',
  '/afbeelding/avatars/child/boy-2.png',
  '/afbeelding/avatars/child/girl-1.png',
  '/afbeelding/avatars/child/girl-2.png',
  '/afbeelding/avatars/child/girl-3.png',
  '/afbeelding/avatars/ouderen/old_man.png',
  '/afbeelding/avatars/ouderen/old_woman.png',
  '/afbeelding/avatars/slecht ter been/manx-2.png',
  '/afbeelding/avatars/slecht ter been/womanx-1.png',
  '/afbeelding/avatars/slecht ter been/womanx-2.png',
  '/afbeelding/avatars/pets/hamster.png',
  '/afbeelding/avatars/pets/hond.png',
  '/afbeelding/avatars/pets/kat.png',
  '/afbeelding/avatars/pets/konijn.png',
  '/afbeelding/avatars/pets/paard.png',
  '/afbeelding/avatars/vehicles/auto.png',
  '/afbeelding/avatars/vehicles/e-bike.png',
  '/afbeelding/avatars/vehicles/fiets.png',
  '/afbeelding/avatars/vehicles/fiets-2.png',
  '/afbeelding/avatars/vehicles/motor.png',
  '/afbeelding/avatars/vehicles/scooter.png',
  '/afbeelding/avatars/woningtype/appartement.png',
  '/afbeelding/avatars/woningtype/caravan.png',
  '/afbeelding/avatars/woningtype/hoogbouw.png',
  '/afbeelding/avatars/woningtype/rijwoning.png',
  '/afbeelding/avatars/woningtype/tiny_house.png',
  '/afbeelding/avatars/woningtype/vrijstaande-woning.png',
  '/afbeelding/avatars/woningtype/woonboot.png',
  '/afbeelding/avatars/omgeving/boom.png',
  '/afbeelding/avatars/omgeving/rivier.png',
  '/afbeelding/avatars/omgeving/schaap.png',
  '/afbeelding/avatars/omgeving/stadsgebouw.png',
  '/afbeelding/avatars/omgeving/stadsgebouw1.png',
  '/afbeelding/avatars/omgeving/trekker.png',
  '/afbeelding/avatars/omgeving/trekker1.png',
  '/afbeelding/avatars/omgeving/waterwaves.png',
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

// Cache-on-demand: dien gecached op als beschikbaar, haal anders op via
// het netwerk en sla op voor volgende keer. Audio en video worden
// nooit gecached (te groot, streamen via html5: true in Howler).
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const path = url.pathname;

  // Audio en video: altijd via netwerk (Howler streamt ze via html5-modus)
  if (path.startsWith('/Audio/') || path.endsWith('.mp4')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response.ok || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
