// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Channel Manager — Nieuws, berichten en radio-kanalen
// Bevat: newsLog/waLog globals, unreadCounts,
//        setBadge, markUnread, renderNewsPage, renderWaPage,
//        updateChannelNav, navChannel, renderChannels
// ═══════════════════════════════════════════════════════════════

/* ─── KANAALGESCHIEDENISLOGBOEKEN ─────────────────────────────────────────────
   Opgeslagen nieuws- en berichtengeschiedenis per scène-moment.
   Elk log-item heeft: sceneIdx, time, dayBadge, items en optioneel nlalert.
*/
const newsLog = []; // [{sceneIdx, time, dayBadge, items:[...]}]
const waLog = []; // [{sceneIdx, time, dayBadge, items:[...], nlalert}]
let newsPage = 0; // 0 = most recent batch
let waPage = 0;
const newsLoggedIdxs = new Set(); // bijgehouden scène-indexes die al naar newsLog zijn geschreven
const waLoggedIdxs = new Set(); // bijgehouden scène-indexes die al naar waLog zijn geschreven

// Bijhouder voor ongelezen aantallen per kanaal
const unreadCounts = { news: 0, whatsapp: 0, radio: 0 };


// Toont of verbergt de getal-badge op een tab
function setBadge(name, count) {
  const id = name === 'radio' ? 'badge-radio' : 'badge-' + name;
  const el = document.getElementById(id);
  if (!el) return;
  if (count > 0) {
    el.textContent = count > 9 ? '9+' : count;
    el.classList.add('visible');
  } else {
    el.classList.remove('visible');
    el.textContent = '';
  }
}

// Voegt de 'has-unread'-klasse toe aan een kanaaltab en verhoogt de badge-teller.
// Synchroniseert de animatiefase zodat alle tabs gelijk knipperen.
// Doet niets als de tab al actief is.
function markUnread(name, increment) {
  const tab = document.getElementById('tab-' + name) || (name === 'radio' ? document.getElementById('radio-tab') : null);
  if (!tab || tab.classList.contains('active')) return;
  unreadCounts[name] = (unreadCounts[name] || 0) + (increment || 1);
  setBadge(name, unreadCounts[name]);
  // Sync all tabs to the same point in the 1s animation cycle
  const phase = (Date.now() % 1000) / 1000;
  tab.style.animationDelay = `-${phase.toFixed(3)}s`;
  tab.classList.add('has-unread');
}


function renderNewsPage() {
  // Bereken de logindex: pagina 0 = laatste item, pagina 1 = één na laatste, enz.
  const pageIdx = newsLog.length - 1 - newsPage;
  const page = newsLog[Math.max(0, pageIdx)];
  let html = '';
  if (!page || page.items.length === 0) {
    html = '<p class="ch-empty">Nog geen nieuwsberichten.</p>';
  } else {
    // Keer de volgorde om zodat het meest recente bericht bovenaan staat
    [...page.items].reverse().forEach(n => {
      html += `<div class="news-item">
        <div class="news-time">${n.time}</div>
        <div class="news-content">
          <div class="news-headline">${n.headline}</div>
          <div class="news-body">${n.body}</div>
        </div>
      </div>`;
    });
  }
  document.getElementById('news-content').innerHTML = html;
  updateChannelNav('news');
}

// Rendert een berichtenpagina: toont eerst een eventueel NL-Alert,
// daarna de berichten (nieuwste bovenaan). Maakt onderscheid tussen
// inkomende en uitgaande berichten.
function renderWaPage(page) {
  const waEl = document.getElementById('wa-content');
  let html = '';
  // Toon NL-Alert bovenaan als deze aan de pagina is gekoppeld
  if (page && page.nlalert) {
    const alertLines = page.nlalert.split('\n');
    const alertTime = alertLines[1] || '';
    const alertBody = alertLines.slice(2).join('\n').trim();
    html += `<div class="alert-card wa-alert-card">
      <div class="alert-header">🚨 NL-Alert${alertTime ? ' · ' + alertTime : ''}</div>
      <div class="alert-body">${alertBody}</div>
    </div>`;
  }
  if (page && page.items.length > 0) {
    [...page.items].reverse().forEach(m => {
      const isOut = m.outgoing; // uitgaand bericht van de speler zelf
      html += `<div class="wa-msg ${isOut ? 'outgoing' : 'incoming'}">
        ${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>
      </div>`;
    });
  }
  if (!html) html = '<p class="ch-empty">Nog geen berichten.</p>';
  waEl.innerHTML = html;
}

// Werkt de navigatiecontroles (ouder/nieuwer knoppen + paginaLabel) bij
// voor het opgegeven kanaaltype ('news' of 'wa').
// Verbergt de navigatie als er slechts één pagina is of als de telefoon leeg is.
function updateChannelNav(type) {
  const log = type === 'news' ? newsLog : waLog;
  const page = type === 'news' ? newsPage : waPage;
  const nav = document.getElementById(type + '-nav');
  const olderBtn = document.getElementById(type + '-nav-older');
  const newerBtn = document.getElementById(type + '-nav-newer');
  const label = document.getElementById(type + '-nav-label');
  if (!nav) return;
  const phoneDead = state.phoneBattery === 0;
  // Geen navigatie nodig als er maar één pagina is of de telefoon leeg is
  if (log.length <= 1 || phoneDead) {
    nav.style.display = 'none';
    return;
  }
  nav.style.display = 'flex';
  olderBtn.disabled = page >= log.length - 1; // al op de oudste pagina
  newerBtn.disabled = page === 0; // al op de meest recente pagina
  const entry = log[log.length - 1 - page];
  // Label toont 'Actueel' voor de nieuwste pagina, anders datum+tijd
  label.textContent = page === 0 ?
    `Actueel · ${entry.time}` :
    `${entry.dayBadge ? entry.dayBadge + ' · ' : ''}${entry.time}`;
}

// Navigeert naar een oudere of nieuwere pagina in het nieuws- of berichtkanaal.
// Doet niets als de telefoonbatterij leeg is.
function navChannel(type, goOlder) {
  if (state.phoneBattery === 0) return;
  if (type === 'news') {
    // Verhoog de paginateller voor ouder, verlaag voor nieuwer (begrensd)
    newsPage = goOlder ?
      Math.min(newsLog.length - 1, newsPage + 1) :
      Math.max(0, newsPage - 1);
    renderNewsPage();
  } else {
    waPage = goOlder ?
      Math.min(waLog.length - 1, waPage + 1) :
      Math.max(0, waPage - 1);
    renderWaPage(waLog[waLog.length - 1 - waPage] || null);
    updateChannelNav('wa');
  }
}

// ──────────────────────────────────────────────────────────────────────────────

/* ─── KANALEN RENDEREN ────────────────────────────────────────────────────────
   Werkt alle drie de kanalen (nieuws, berichten/NL-Alert en radio) bij voor de
   huidige scène. Berichten worden direct getoond zonder stagger-animatie.
   Nieuwe inhoud wordt ook gelogd voor scrollback-navigatie, maar nooit dubbel.
*/
function renderChannels(scene) {
  const sc = scene ? scene.channels : {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  };

  // NEWS — log and render via page system
  const newNews = sc.news || [];
  newsPage = 0; // reset naar meest recente pagina bij elke nieuwe scène
  if (newNews.length > 0 && !newsLoggedIdxs.has(currentSceneIdx)) {
    // Log de nieuwsberichten van deze scène slechts één keer
    newsLoggedIdxs.add(currentSceneIdx);
    newsLog.push({
      sceneIdx: currentSceneIdx,
      time: scene.time,
      dayBadge: scene.dayBadge || '',
      items: newNews
    });
  }
  renderNewsPage();

  // WHATSAPP + NL-ALERT
  const newWa = sc.whatsapp || [];
  const curNlalert = sc.nlalert || null;

  // Log voor scrollback (volledige lijst, ongeacht stagger)
  waPage = 0; // reset naar meest recente pagina
  if (!waLoggedIdxs.has(currentSceneIdx)) {
    waLoggedIdxs.add(currentSceneIdx);
    // Sla alleen op als er daadwerkelijk inhoud is
    if (newWa.length > 0 || curNlalert) {
      waLog.push({
        sceneIdx: currentSceneIdx,
        time: scene.time,
        dayBadge: scene.dayBadge || '',
        items: newWa,
        nlalert: curNlalert
      });
    }
  }

  // Initial wa-content: NL-Alert meteen tonen (of lege placeholder)
  let waInitHtml = '';
  if (curNlalert) {
    // Splits het NL-Alert-bericht op regels: regel 0 = type, regel 1 = tijdstip, rest = inhoud
    const alertLines = curNlalert.split('\n');
    const alertTime = alertLines[1] || '';
    const alertBody = alertLines.slice(2).join('\n').trim();
    waInitHtml += `<div class="alert-card wa-alert-card">
      <div class="alert-header">🚨 NL-Alert${alertTime ? ' · ' + alertTime : ''}</div>
      <div class="alert-body">${alertBody}</div>
    </div>`;
  }
  if (newWa.length === 0 && !curNlalert) {
    waInitHtml = '<p class="ch-empty">Nog geen berichten.</p>';
  }
  document.getElementById('wa-content').innerHTML = waInitHtml;

  // Berichten direct tonen, gelijk met nieuws en radio
  if (newWa.length > 0) {
    const waContainer = document.getElementById('wa-content');
    // Verwijder placeholder éénmalig voor het batch-toevoegen
    const placeholder = waContainer.querySelector('p');
    if (placeholder) placeholder.remove();
    // Bouw alle berichten in een fragment, dan één DOM-write
    const fragment = document.createDocumentFragment();
    // Keer de volgorde om zodat het nieuwste bericht onderaan staat (chat-stijl)
    [...newWa].reverse().forEach(m => {
      const isOut = m.outgoing;
      const div = document.createElement('div');
      div.className = `wa-msg ${isOut ? 'outgoing' : 'incoming'}`;
      div.innerHTML = `${!isOut ? `<div class="wa-from">${m.from}</div>` : ''}
        <div class="wa-bubble">${m.msg}</div>
        <div class="wa-time">${m.time}</div>`;
      fragment.appendChild(div);
    });
    waContainer.appendChild(fragment);
    if (activeTab === 'whatsapp') {
      // Als de berichtentab al actief is, hoeft er geen ongelezen-indicator te zijn
      document.getElementById('tab-whatsapp')?.classList.remove('has-unread');
    }
  }

  updateChannelNav('wa');

  // RADIO — altijd weergeven; inhoud afhankelijk van of speler een radio heeft
  const radioBtn = document.getElementById('radio-play-btn');
  if (!(profile.hasRadio === 'ja' || state.hasCarRadio)) {
    // Speler heeft geen radio
    document.getElementById('radio-freq').textContent = 'Geen radio';
    document.getElementById('radio-content').innerHTML = '<p class="ch-empty">Je hebt geen batterijradio bij je. Daardoor kun je geen officiële berichten ontvangen.</p>';
    currentRadioText = '';
    if (radioBtn) radioBtn.style.display = 'none';
  } else if (sc.radio) {
    // Speler heeft een radio en er is een uitzending in deze scène
    document.getElementById('radio-freq').textContent = 'Radio 1: 98.9 FM';
    document.getElementById('radio-content').style.color = '';
    document.getElementById('radio-content').innerHTML = sc.radio;
    currentRadioText = sc.radio;
    if (radioBtn) radioBtn.style.display = 'block';
  } else {
    // Speler heeft een radio maar geen uitzending in deze scène
    document.getElementById('radio-freq').textContent = 'Radio 1: 98.9 FM';
    document.getElementById('radio-content').innerHTML = '<p class="ch-empty">Geen uitzending ontvangen.</p>';
    currentRadioText = '';
    if (radioBtn) radioBtn.style.display = 'none';
  }
}
