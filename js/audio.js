// ═══════════════════════════════════════════════════════════════
// Audio — Geluidseffecten, ambient loops en radio
// Bevat: clock tick, audioEnabled toggle, Ambience (loops),
//        RadioPlayer (mp3 + TTS fallback), speakRadio, pingMessage
// Gebruikt: Howler.js voor mp3, Web Speech API als TTS fallback
// ═══════════════════════════════════════════════════════════════

/* ───────────────────────────────────────────────────────────────
   CLOCK TICK
   Typt tekst karakter voor karakter in een element, met een
   instelbare vertraging per karakter (tik-effect).
─────────────────────────────────────────────────────────────── */

// Houdt actieve tick-intervallen bij per sleutel, zodat meerdere
// onafhankelijke tick-animaties naast elkaar kunnen bestaan.
const _tickTimers = {};

// Typt de tekst 'target' karakter voor karakter in element 'el'.
// 'key' maakt het mogelijk meerdere onafhankelijke tickers tegelijk
// te hebben; 'onDone' wordt aangeroepen als de animatie klaar is.
function tickTime(el, target, key, onDone) {
  const k = key || 'default'; // gebruik 'default' als er geen sleutel is opgegeven

  // Stop een eventueel lopende tick-animatie voor dezelfde sleutel
  if (_tickTimers[k]) {
    clearInterval(_tickTimers[k]);
    delete _tickTimers[k];
  }

  el.textContent = ''; // leeg het element voordat we beginnen te typen
  let i = 0; // positie van het volgende te tonen karakter

  // Elke 65 ms wordt één karakter toegevoegd aan de tekst
  _tickTimers[k] = setInterval(() => {
    el.textContent = target.slice(0, i + 1); // toon tekst tot en met positie i
    i++;
    if (i >= target.length) {
      // Alle karakters zijn getoond; stop de interval en ruim op
      clearInterval(_tickTimers[k]);
      delete _tickTimers[k];
      if (onDone) onDone(); // roep de callback aan als die is meegegeven
    }
  }, 65);
}

// Stopt alle lopende tick-animaties tegelijk (bijv. bij schermwissel).
function clearAllTicks() {
  Object.keys(_tickTimers).forEach(k => {
    clearInterval(_tickTimers[k]);
    delete _tickTimers[k];
  });
}

/* ───────────────────────────────────────────────────────────────
   AUDIO ENGINE
   Globale schakelaar voor geluid en hulpfuncties om de UI
   bij te werken.
─────────────────────────────────────────────────────────────── */

// Bepaalt of geluid globaal is ingeschakeld (true = aan, false = uit).
let audioEnabled = true;

// Bevat de huidige radiotekst als HTML-string voor TTS-fallback.
let currentRadioText = '';

// Wisselt geluid aan/uit. Past de UI-labels aan en stopt of hervat
// ambient geluid afhankelijk van de nieuwe toestand.
function toggleAudio() {
  audioEnabled = !audioEnabled; // flip de schakelaar

  // Haal de label- en icoon-elementen op in het instellingenmenu
  const label = document.getElementById('gear-audio-label');
  const icon  = document.getElementById('gear-audio-icon');

  // Pas de tekst en het icoon aan op basis van de nieuwe toestand
  if (label) label.textContent = audioEnabled ? 'Geluid aan' : 'Geluid uit';
  if (icon)  icon.textContent  = audioEnabled ? '🔊' : '🔇';

  // Synchroniseer startscherm-knop
  const startAudioBtn = document.getElementById('start-audio-btn');
  if (startAudioBtn) startAudioBtn.textContent = audioEnabled ? 'Geluid aan' : 'Geluid uit';

  if (!audioEnabled) {
    // Geluid uitgeschakeld: stop spraaksynthese en ambient audio onmiddellijk
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    Ambience.stop();
  } else {
    // Geluid ingeschakeld: hervat ambient audio voor de huidige scène
    const visibleScenes = getActiveScenes();
    const scene = visibleScenes[currentSceneIdx];
    if (scene) Ambience.resumeForScene(scene.id);
  }
}

// Howl-instantie voor het NL-Alert geluid (eenmalig afspelen).
const _nlAlertSound = new Howl({
  src: ['audio/NL-Alert.mp3'],
  volume: 1.0,
  html5: true // html5-modus voor grote of gestreamde bestanden
});

// Speelt het NL-Alert geluid af als geluid ingeschakeld is.
function playNLAlertSound() {
  if (!audioEnabled) return;
  _nlAlertSound.play();
}

/* ───────────────────────────────────────────────────────────────
   AMBIENT AUDIO
   Beheert achtergrondgeluiden (regen, vuur) met fade-in/out.
   Slechts één ambient track tegelijk kan actief zijn.
─────────────────────────────────────────────────────────────── */
const Ambience = {
  _current: null, // naam van de momenteel spelende ambient track, of null

  // Vooraf geladen Howl-instanties voor elke ambient track
  _sounds: {
    rain: new Howl({
      src: ['audio/rain-loop.mp3'],
      loop: true,   // loopt oneindig
      volume: 0,    // begint stil; wordt ingevaagd via fade
      html5: true
    }),
    fire: new Howl({
      src: ['audio/fire-loop.mp3'],
      loop: true,
      volume: 0,
      html5: true
    }),
  },

  TARGET_VOL: 0.22, // doelvolume na fade-in (22%)
  FADE_IN: 2000,    // duur van fade-in in milliseconden
  FADE_OUT: 1200,   // duur van fade-out in milliseconden

  // Start een ambient track met fade-in. Fadt de vorige track uit
  // als die nog speelt. Doet niets als de gevraagde track al actief is.
  play(name) {
    if (!audioEnabled || this._current === name) return;

    // Fade de huidige track uit en stop hem na de fade-duur
    if (this._current && this._sounds[this._current] && this._sounds[this._current].playing()) {
      const prev = this._current;
      this._sounds[prev].fade(this._sounds[prev].volume(), 0, this.FADE_OUT);
      setTimeout(() => this._sounds[prev].stop(), this.FADE_OUT); // stop pas ná de fade
    }

    this._current = name; // sla de nieuwe track op als actieve

    if (name && this._sounds[name]) {
      const snd = this._sounds[name];
      snd.volume(0); // begin op volume 0 zodat de fade-in zacht begint
      // Pas na het starten van de track de fade-in activeren (once = eenmalige listener)
      snd.once('play', () => snd.fade(0, this.TARGET_VOL, this.FADE_IN));
      snd.play();
    }
  },

  // Stopt de huidige ambient track met een fade-out.
  stop() {
    if (this._current && this._sounds[this._current] && this._sounds[this._current].playing()) {
      const prev = this._current;
      this._sounds[prev].fade(this._sounds[prev].volume(), 0, this.FADE_OUT);
      setTimeout(() => this._sounds[prev].stop(), this.FADE_OUT);
    }
    this._current = null; // markeer dat er geen actieve track meer is
  },

  // Bepaalt op basis van het scène-ID welke ambient track geschikt is
  // en speelt die af, of stopt ambient audio als de scène er geen heeft.
  resumeForScene(sceneId) {
    // scènes die beginnen met 'bf_' = bosbrand → vuur
    // scènes die beginnen met 'ov_' = overstroming → regen
    const name = sceneId.startsWith('bf_') ? 'fire' :
      sceneId.startsWith('ov_') ? 'rain' :
      null;
    if (name) this.play(name);
    else this.stop(); // geen passende ambient track: stop alles
  }
};

// Speelt een kort twee-toon ping-geluid af via de Web Audio API.
// Wordt gebruikt als notificatiegeluid bij nieuwe berichten.
function playMessagePing() {
  if (!audioEnabled) return;
  try {
    // Maak een tijdelijke AudioContext aan (cross-browser compatibel)
    const ctx = new(window.AudioContext || window.webkitAudioContext)();

    // Twee tonen: C5 (523 Hz) direct en E5 (659 Hz) na 0,18 seconden
    [
      [523, 0],    // eerste toon: C5, direct
      [659, 0.18]  // tweede toon: E5, licht vertraagd
    ].forEach(([freq, offset]) => {
      const osc  = ctx.createOscillator(); // sinusgolfgenerator
      const gain = ctx.createGain();       // volumeregelaar

      // Koppel oscillator → gain → uitvoer
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine'; // zachte sinusgolf

      // Stel frequentie en beginvolume in op het juiste tijdstip
      osc.frequency.setValueAtTime(freq, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + offset);

      // Laat het volume exponentieel dalen naar bijna stil in 0,3 seconden
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.3);

      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.3); // stop de oscillator na 0,3 s
    });
  } catch (e) {
    console.warn('[Audio] Web Audio API niet beschikbaar:', e.message);
  }
}

/* ───────────────────────────────────────────────────────────────
   SPRAAKSYNTHESE (TTS) — NEDERLANDSTALIGE STEM
   Laadt de beste beschikbare Nederlandse stem voor gebruik
   als fallback wanneer een radiobestand ontbreekt.
─────────────────────────────────────────────────────────────── */

// Gecachede verwijzing naar de beste gevonden Nederlandse stem.
let _dutchVoice = null;

// Zoekt de beste beschikbare Nederlandse stem en slaat die op in _dutchVoice.
// Volgorde van voorkeur: Google NL > nl-NL > elke nl-stem > geen (null).
function _loadDutchVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return; // stemmen zijn nog niet geladen; wacht op voiceschanged

  // Zoek de meest gewenste stem via opeenvolgende fallbacks
  _dutchVoice = voices.find(v => /google/i.test(v.name) && v.lang.startsWith('nl')) ||
    voices.find(v => v.lang === 'nl-NL') ||
    voices.find(v => v.lang.startsWith('nl')) ||
    null;
}

if (window.speechSynthesis) {
  // Browsers laden stemmen asynchroon; luister op het 'voiceschanged'-event
  window.speechSynthesis.onvoiceschanged = _loadDutchVoice;
  _loadDutchVoice(); // probeer ook direct (voor browsers die stemmen synchroon laden)
}

/* ───────────────────────────────────────────────────────────────
   RADIO PLAYER
   Speelt scène-specifieke radioberichten af als mp3.
   Valt terug op spraaksynthese als het audiobestand ontbreekt.
─────────────────────────────────────────────────────────────── */
const RadioPlayer = {
  _sound: null, // actieve Howl-instantie, of null als er niets speelt

  // Laadt en speelt het radiobericht voor de opgegeven scène-ID.
  // Stopt eerst eventueel lopend geluid voordat de nieuwe track start.
  playForScene(sceneId) {
    this.stop(); // stop alles wat al speelt
    if (!audioEnabled) return;

    // Bouw het pad op naar het scène-specifieke mp3-bestand
    const src = `audio/radioberichten/radio_${sceneId}.mp3`;

    // Verwijder een eventuele eerdere Howl-instantie volledig uit het geheugen
    if (RadioPlayer._sound) {
      RadioPlayer._sound.unload();
      RadioPlayer._sound = null;
    }

    // Maak een nieuwe Howl-instantie en koppel UI-callbacks
    this._sound = new Howl({
      src: [src],
      html5: true,
      volume: 1.0,
      onplay:      () => updateRadioBtn(true),  // pas de knop aan bij afspelen
      onend:       () => { this._sound = null; updateRadioBtn(false); }, // klaar
      onstop:      () => updateRadioBtn(false),  // handmatig gestopt
      onloaderror: () => { this._sound = null; updateRadioBtn(false); } // bestand niet gevonden
    });
    this._sound.play();
  },

  // Stopt het huidige radiobericht (mp3 of TTS) en reset de knop.
  stop() {
    if (this._sound) {
      this._sound.stop();
      this._sound.unload(); // geef geheugen vrij
      this._sound = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel(); // stop ook TTS
    updateRadioBtn(false);
  }
};

// Hoofdfunctie voor de radio-knop. Werkt als schakelaar:
// – speelt het radiobericht af als er niets speelt,
// – stopt het als er al iets speelt.
// Probeert eerst een mp3-bestand; valt bij ontbreken terug op TTS.
function speakRadio() {
  // Stop als mp3 al speelt
  if (RadioPlayer._sound && RadioPlayer._sound.playing()) {
    RadioPlayer.stop();
    return;
  }

  // Stop als TTS al spreekt
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    updateRadioBtn(false);
    return;
  }

  // Probeer eerst een mp3-bestand voor de huidige scène
  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  if (scene) {
    RadioPlayer.playForScene(scene.id);
    return;
  }

  // Fallback: gebruik spraaksynthese als er geen scène of mp3 is
  if (!currentRadioText) return;

  _loadDutchVoice(); // herlaad stem voor het geval die nog niet beschikbaar was

  // Strip HTML-tags en annotaties tussen [...] om schone tekst te krijgen
  const div = document.createElement('div');
  div.innerHTML = currentRadioText;
  const plain = (div.textContent || div.innerText || '').replace(/\[.*?\]/g, '').trim();

  // Stel de spraak-utterance in met Nederlandse stem en stemparameters
  const utt = new SpeechSynthesisUtterance(plain);
  utt.lang   = 'nl-NL';
  if (_dutchVoice) utt.voice = _dutchVoice; // gebruik de voorkeursstem als die beschikbaar is
  utt.rate   = 0.88;  // iets trager dan normaal voor betere verstaanbaarheid
  utt.pitch  = 0.95;  // licht verlaagde toonhoogte voor radiogevoel
  utt.volume = 1.0;

  // Koppel UI-callbacks aan de spraakgebeurtenissen
  utt.onstart = () => updateRadioBtn(true);
  utt.onend   = () => updateRadioBtn(false);
  utt.onerror = () => updateRadioBtn(false);

  window.speechSynthesis.speak(utt);
}

// Past de tekst en stijl van de radio-afspeelknop aan op basis van
// of er momenteel een radiobericht wordt afgespeeld.
function updateRadioBtn(playing) {
  const btn = document.getElementById('radio-play-btn');
  if (!btn) return;
  btn.textContent = playing ? '⏹ Stop' : '▶ Speel radiobericht';
  btn.classList.toggle('playing', playing); // voeg/verwijder CSS-klasse voor actieve stijl
}
