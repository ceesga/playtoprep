// ═══════════════════════════════════════════════════════════════
// Audio — Geluidseffecten, ambient loops en radio
// Bevat: clock tick, audioEnabled toggle, Ambience (loops),
//        RadioPlayer (mp3 + TTS fallback), speakRadio, pingMessage
// Gebruikt: Howler.js voor mp3, Web Speech API als TTS fallback
// ═══════════════════════════════════════════════════════════════

// ─── CLOCK TICK ──────────────────────────────────────────────────────────────
const _tickTimers = {};

function tickTime(el, target, key, onDone) {
  const k = key || 'default';
  if (_tickTimers[k]) {
    clearInterval(_tickTimers[k]);
    delete _tickTimers[k];
  }
  el.textContent = '';
  let i = 0;
  _tickTimers[k] = setInterval(() => {
    el.textContent = target.slice(0, i + 1);
    i++;
    if (i >= target.length) {
      clearInterval(_tickTimers[k]);
      delete _tickTimers[k];
      if (onDone) onDone();
    }
  }, 65);
}

function clearAllTicks() {
  Object.keys(_tickTimers).forEach(k => {
    clearInterval(_tickTimers[k]);
    delete _tickTimers[k];
  });
}

// ─── AUDIO ENGINE ────────────────────────────────────────────────────────────
let audioEnabled = true;
let currentRadioText = '';

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('audio-toggle');
  btn.textContent = audioEnabled ? '🔊 Geluid Aan' : '🔇 Geluid';
  btn.classList.toggle('on', audioEnabled);
  if (!audioEnabled) {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    Ambience.stop();
  } else {
    const visibleScenes = getActiveScenes();
    const scene = visibleScenes[currentSceneIdx];
    if (scene) Ambience.resumeForScene(scene.id);
  }
}

const _nlAlertSound = new Howl({
  src: ['audio/NL-Alert.mp3'],
  volume: 1.0,
  html5: true
});

function playNLAlertSound() {
  if (!audioEnabled) return;
  _nlAlertSound.play();
}

// ─── AMBIENT AUDIO ────────────────────────────────────────────────────────────
const Ambience = {
  _current: null,
  _sounds: {
    rain: new Howl({
      src: ['audio/rain-loop.mp3'],
      loop: true,
      volume: 0,
      html5: true
    }),
    fire: new Howl({
      src: ['audio/fire-loop.mp3'],
      loop: true,
      volume: 0,
      html5: true
    }),
  },
  TARGET_VOL: 0.22,
  FADE_IN: 2000,
  FADE_OUT: 1200,

  play(name) {
    if (!audioEnabled || this._current === name) return;
    if (this._current && this._sounds[this._current] && this._sounds[this._current].playing()) {
      const prev = this._current;
      this._sounds[prev].fade(this._sounds[prev].volume(), 0, this.FADE_OUT);
      setTimeout(() => this._sounds[prev].stop(), this.FADE_OUT);
    }
    this._current = name;
    if (name && this._sounds[name]) {
      const snd = this._sounds[name];
      snd.volume(0);
      snd.once('play', () => snd.fade(0, this.TARGET_VOL, this.FADE_IN));
      snd.play();
    }
  },

  stop() {
    if (this._current && this._sounds[this._current] && this._sounds[this._current].playing()) {
      const prev = this._current;
      this._sounds[prev].fade(this._sounds[prev].volume(), 0, this.FADE_OUT);
      setTimeout(() => this._sounds[prev].stop(), this.FADE_OUT);
    }
    this._current = null;
  },

  resumeForScene(sceneId) {
    const name = sceneId.startsWith('bf_') ? 'fire' :
      sceneId.startsWith('ov_') ? 'rain' :
      null;
    if (name) this.play(name);
    else this.stop();
  }
};

function playMessagePing() {
  if (!audioEnabled) return;
  try {
    const ctx = new(window.AudioContext || window.webkitAudioContext)();
    [
      [523, 0],
      [659, 0.18]
    ].forEach(([freq, offset]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.3);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.3);
    });
  } catch (e) {
    console.warn('[Audio] Web Audio API niet beschikbaar:', e.message);
  }
}

let _dutchVoice = null;

function _loadDutchVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  // Prefer: Google Nederlands > any nl-NL > any nl > first available
  _dutchVoice = voices.find(v => /google/i.test(v.name) && v.lang.startsWith('nl')) ||
    voices.find(v => v.lang === 'nl-NL') ||
    voices.find(v => v.lang.startsWith('nl')) ||
    null;
}
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = _loadDutchVoice;
  _loadDutchVoice();
}

// ─── RADIO PLAYER ─────────────────────────────────────────────────────────────
const RadioPlayer = {
  _sound: null,

  playForScene(sceneId) {
    this.stop();
    if (!audioEnabled) return;
    const src = `audio/radioberichten/radio_${sceneId}.mp3`;
    if (RadioPlayer._sound) {
      RadioPlayer._sound.unload();
      RadioPlayer._sound = null;
    }
    this._sound = new Howl({
      src: [src],
      html5: true,
      volume: 1.0,
      onplay: () => updateRadioBtn(true),
      onend: () => {
        this._sound = null;
        updateRadioBtn(false);
      },
      onstop: () => updateRadioBtn(false),
      onloaderror: () => {
        this._sound = null;
        updateRadioBtn(false);
      }
    });
    this._sound.play();
  },

  stop() {
    if (this._sound) {
      this._sound.stop();
      this._sound.unload();
      this._sound = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    updateRadioBtn(false);
  }
};

function speakRadio() {
  // Stop if already playing
  if (RadioPlayer._sound && RadioPlayer._sound.playing()) {
    RadioPlayer.stop();
    return;
  }
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    updateRadioBtn(false);
    return;
  }
  // Try audio file first
  const visibleScenes = getActiveScenes();
  const scene = visibleScenes[currentSceneIdx];
  if (scene) {
    RadioPlayer.playForScene(scene.id);
    return;
  }
  // Fallback: speech synthesis
  if (!currentRadioText) return;
  _loadDutchVoice();
  const div = document.createElement('div');
  div.innerHTML = currentRadioText;
  const plain = (div.textContent || div.innerText || '').replace(/\[.*?\]/g, '').trim();
  const utt = new SpeechSynthesisUtterance(plain);
  utt.lang = 'nl-NL';
  if (_dutchVoice) utt.voice = _dutchVoice;
  utt.rate = 0.88;
  utt.pitch = 0.95;
  utt.volume = 1.0;
  utt.onstart = () => updateRadioBtn(true);
  utt.onend = () => updateRadioBtn(false);
  utt.onerror = () => updateRadioBtn(false);
  window.speechSynthesis.speak(utt);
}

function updateRadioBtn(playing) {
  const btn = document.getElementById('radio-play-btn');
  if (!btn) return;
  btn.textContent = playing ? '⏹ Stop' : '▶ Speel radiobericht';
  btn.classList.toggle('playing', playing);
}
