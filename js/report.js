// ═══════════════════════════════════════════════════════════════
// Rapport — Persoonlijke eindanalyse na het scenario
// Secties: samenvatting, thuissituatie, voorbereiding,
//          scenario-analyse, persoonlijke tips, afsluiting
// ═══════════════════════════════════════════════════════════════

// ─── HULPFUNCTIES ─────────────────────────────────────────────────────────────

function parseMomentText(htmlText) {
  const m = htmlText.match(/^<b>(.+?)<\/b>\.\s*/);
  return {
    label: m ? m[1] : htmlText,
    overweging: m ? htmlText.slice(m[0].length) : ''
  };
}

function bulletList(items) {
  if (!items.length) return '<li class="rep-bullet-item rep-bullet-empty">Geen punten gevonden.</li>';
  return items.map(it => `<li class="rep-bullet-item">${it.text}</li>`).join('');
}

// ─── SECTIE 1: SAMENVATTING ───────────────────────────────────────────────────

function renderSectie1(naam, avgScore, goodItems, improveItems) {
  let niveau, niveauClass, duiding;
  if (avgScore >= 0.7) {
    niveau = 'Goed voorbereid';
    niveauClass = 'rep-niveau-goed';
    duiding = naam
      ? `${naam} doorstond dit scenario zonder grote tekorten. De voorbereiding en keuzes waren grotendeels op orde.`
      : 'Je doorstond dit scenario zonder grote tekorten. De voorbereiding en keuzes waren grotendeels op orde.';
  } else if (avgScore >= 0.4) {
    niveau = 'Matig voorbereid';
    niveauClass = 'rep-niveau-matig';
    duiding = naam
      ? `${naam} doorstond het scenario, maar liep tegen duidelijke beperkingen aan. Er zijn concrete stappen om de weerbaarheid te vergroten.`
      : 'Je doorstond het scenario, maar liep tegen duidelijke beperkingen aan. Er zijn concrete stappen om de weerbaarheid te vergroten.';
  } else {
    niveau = 'Beperkt voorbereid';
    niveauClass = 'rep-niveau-beperkt';
    duiding = naam
      ? `Dit scenario stelde ${naam} voor serieuze uitdagingen. De blinde vlekken zijn duidelijk in kaart gebracht.`
      : 'Dit scenario stelde je voor serieuze uitdagingen. De blinde vlekken zijn nu duidelijk in kaart gebracht.';
  }

  const goedBullets = goodItems.length
    ? goodItems.map(it => `<li class="rep-bullet-item">${it.text}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen sterke punten geregistreerd in dit scenario.</li>';

  const verbeterBullets = improveItems.length
    ? improveItems.map(it => `<li class="rep-bullet-item">${it.text}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen verbeterpunten — alle cruciale acties ondernomen.</li>';

  document.getElementById('rep-s1').innerHTML = `
    <div class="rep-section-nr">1</div>
    <div class="rep-section-heading">Samenvatting</div>
    <div class="rep-subsection">
      <div class="rep-subsection-title">Jouw paraatheidsniveau</div>
      <span class="rep-niveau-badge ${niveauClass}">${niveau}</span>
    </div>
    <div class="rep-subsection">
      <div class="rep-subsection-title">Korte duiding</div>
      <p class="rep-body-text">${duiding}</p>
    </div>
    <div class="rep-subsection">
      <div class="rep-subsection-title">Sterke punten</div>
      <ul class="rep-bullet-list">${goedBullets}</ul>
    </div>
    <div class="rep-subsection">
      <div class="rep-subsection-title">Belangrijkste verbeterpunten</div>
      <ul class="rep-bullet-list">${verbeterBullets}</ul>
    </div>`;
}

// ─── SECTIE 2: THUISSITUATIE ──────────────────────────────────────────────────

function renderSectie2(persons) {
  const houseSubLabels = { 'caravan': 'Caravan', 'tiny_house': 'Tiny house', 'woonboot': 'Woonboot' };
  const houseLabels = {
    'hoogbouw':          'Hoogbouw (met lift)',
    'laagbouw':          'Laagbouw (appartementen)',
    'rijwoning':         'Rijwoning',
    'vrijstaande-woning':'Vrijstaande woning',
    'overige': profile.houseSubType
      ? `Overige woning (${houseSubLabels[profile.houseSubType] || profile.houseSubType})`
      : 'Overige woning'
  };
  const woningInfo = {
    'hoogbouw': {
      toelichting: 'Een flat of appartement op een hoge verdieping in een wooncomplex.',
      voordelen: ['Hogere verdieping biedt bescherming bij overstroming', 'Compacte ruimte is relatief makkelijk warm te houden'],
      aandachtspunten: ['Lift werkt niet bij stroomuitval', 'Waterdruk valt weg zodra pompen uitvallen', 'Evacuatie via trappenhuis is lastiger met beperkt mobiele bewoners']
    },
    'laagbouw': {
      toelichting: 'Een appartement of woning op de begane grond of lage verdieping.',
      voordelen: ['Eenvoudig te verlaten bij nood', 'Goed toegankelijk voor iedereen in het huishouden'],
      aandachtspunten: ['Kwetsbaarder voor inbraak bij langdurige stroomuitval', 'Bij overstroming snel risico op wateroverlast binnenshuis', 'Waterdruk afhankelijk van centrale pompen']
    },
    'rijwoning': {
      toelichting: 'Een grondgebonden woning, aaneengeschakeld met buren.',
      voordelen: ['Eigen toegang en mogelijke tuin bieden extra flexibiliteit', 'Mogelijkheid tot opvang van regenwater of tijdelijke noodopslag'],
      aandachtspunten: ['Groter volume vraagt meer middelen om leefbaar te houden zonder verwarming', 'Gedeelde muren bieden minder isolatieopties']
    },
    'vrijstaande-woning': {
      toelichting: 'Een vrijstaande woning met eigen grond rondom het gebouw.',
      voordelen: ['Meeste autonomie en zelfvoorzienendheid mogelijk', 'Ruimte voor wateropvang, noodopslag en eigen energieoplossingen'],
      aandachtspunten: ['Afgelegen ligging betekent langere aanrijtijden voor hulpdiensten', 'Groot volume vraagt meer energie en middelen om leefbaar te houden']
    },
    'overige': {
      toelichting: 'Een bijzondere woonvorm met eigen voor- en nadelen.',
      voordelen: ['Compacte ruimte is eenvoudiger te beheren in een crisis'],
      aandachtspunten: ['Sterk afhankelijk van externe nutsvoorzieningen', 'Beperkte opslagcapaciteit voor noodvoorraden']
    }
  };

  const envLabels = {
    'water':      'Nabij water',
    'forest':     'Bos of natuur',
    'rural_area': 'Buitengebied',
    'city':       'Stedelijk'
  };
  const envInfo = {
    'water': {
      risico: 'Verhoogd overstromingsrisico, mogelijke uitval van watergemalen',
      voordelen: ['Soms alternatieve watertoevoer beschikbaar', 'Bewoners zijn doorgaans vertrouwd met evacuatieroutes nabij water'],
      aandachtspunten: ['Dijkdoorbraak of peilstijging kan snel kritiek worden', 'Laaggelegen straten overstromen als eerste']
    },
    'forest': {
      risico: 'Verhoogd risico op bosbrand, afgelegen ligging',
      voordelen: ['Voldoende ruimte buiten voor tijdelijk verblijf of opvang', 'Minder stedelijke drukte bij een noodsituatie'],
      aandachtspunten: ['Brand of stormschade kan snel en onverwacht optreden', 'Hulpdiensten hebben langere aanrijtijden']
    },
    'rural_area': {
      risico: 'Grotere afstand tot hulpdiensten, kwetsbare nutsinfrastructuur',
      voordelen: ['Meer ruimte en autonomie om een crisis zelfstandig op te vangen', 'Minder afhankelijk van stedelijke systemen'],
      aandachtspunten: ['Hulp is minder snel ter plaatse', 'Hogere afhankelijkheid van eigen voorraad en middelen']
    },
    'city': {
      risico: 'Verhoogde druk op winkels en diensten, overbezetting bij evacuatie',
      voordelen: ['Hulpdiensten en opvanglocaties zijn dichtbij', 'Meer mogelijkheden voor onderlinge hulp van buren en buurt'],
      aandachtspunten: ['Vraag naar basisbenodigdheden escaleert snel in een crisis', 'Verkeersopstoppingen vertragen evacuatie']
    }
  };

  const ht = profile.houseType || 'overige';
  const wInfo = woningInfo[ht] || woningInfo['overige'];
  const woningLabel = houseLabels[ht] || 'Onbekend';

  const locaties = profile.location || [];
  const eersteLocatie = locaties[0];
  const eInfo = eersteLocatie && envInfo[eersteLocatie] ? envInfo[eersteLocatie] : null;
  const omgevingLabel = eersteLocatie && envLabels[eersteLocatie] ? envLabels[eersteLocatie] : 'Niet opgegeven';

  const alleLocaties = locaties
    .filter(l => envLabels[l])
    .map(l => envLabels[l])
    .join(', ') || 'Niet opgegeven';

  // Gezinssamenstelling
  const huishoudKvs = [
    { label: 'Aantal personen', waarde: persons },
    { label: 'Volwassenen',     waarde: adultsCount },
    { label: 'Ouderen',        waarde: profile.ouderenCount || 0 },
    { label: 'Jonge kinderen', waarde: childrenCount },
    { label: 'Beperkt mobiel', waarde: slechtTerBeenCount },
    { label: 'Huisdieren',     waarde: profile.hasPets ? (petsCount || 1) : 'Nee' }
  ];

  // Gezinstoelichting
  let gezinsToel = `Een huishouden van ${persons} ${persons === 1 ? 'persoon' : 'personen'}.`;
  const kwetsbaar = [];
  if (profile.hasChildren)       kwetsbaar.push('jonge kinderen');
  if (profile.hasElderly)        kwetsbaar.push('ouderen');
  if (profile.hasMobilityImpaired || slechtTerBeenCount > 0) kwetsbaar.push('beperkt mobiele bewoners');
  if (kwetsbaar.length) gezinsToel += ` Het huishouden bevat kwetsbare groepen: ${kwetsbaar.join(', ')}.`;
  if (profile.hasPets) gezinsToel += ' Er zijn huisdieren aanwezig.';

  // Gezinsaandachtspunten
  const gezinsAandacht = [];
  if (profile.hasChildren)       gezinsAandacht.push('Kinderen hebben extra structuur, warmte en uitleg nodig in een crisis.');
  if (profile.hasElderly)        gezinsAandacht.push('Ouderen koelen sneller af en zijn gevoeliger voor stress en uitputting.');
  if (profile.hasMobilityImpaired || slechtTerBeenCount > 0) gezinsAandacht.push('Beperkt mobiele bewoners vereisen extra aandacht bij evacuatie en verplaatsing.');
  if (profile.hasPets)           gezinsAandacht.push('Huisdieren hebben noodvoer, water en een vervoersmand nodig bij evacuatie.');

  const kvRows = huishoudKvs.map(r =>
    `<div class="rep-kv"><span class="rep-kv-label">${r.label}</span><span class="rep-kv-waarde">${r.waarde}</span></div>`
  ).join('');

  const woningVoordelen = wInfo.voordelen.map(v => `<li class="rep-bullet-item">${v}</li>`).join('');
  const woningAandacht  = wInfo.aandachtspunten.map(a => `<li class="rep-bullet-item">${a}</li>`).join('');

  const omgVoordelen = eInfo
    ? eInfo.voordelen.map(v => `<li class="rep-bullet-item">${v}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen locatie opgegeven.</li>';
  const omgAandacht = eInfo
    ? eInfo.aandachtspunten.map(a => `<li class="rep-bullet-item">${a}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen locatie opgegeven.</li>';

  const gezinsAandachtHtml = gezinsAandacht.length
    ? gezinsAandacht.map(a => `<li class="rep-bullet-item">${a}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen specifieke aandachtspunten voor dit huishouden.</li>';

  document.getElementById('rep-s2').innerHTML = `
    <div class="rep-section-nr">2</div>
    <div class="rep-section-heading">Jouw thuissituatie</div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Type woning</div>
      <p class="rep-body-text rep-woningtype-label">${woningLabel}</p>
      <p class="rep-body-text">${wInfo.toelichting}</p>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Voordelen</div>
        <ul class="rep-bullet-list">${woningVoordelen}</ul>
      </div>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aandachtspunten</div>
        <ul class="rep-bullet-list">${woningAandacht}</ul>
      </div>
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Gezinssamenstelling</div>
      <div class="rep-kv-blok">${kvRows}</div>
      <p class="rep-body-text">${gezinsToel}</p>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aandachtspunten</div>
        <ul class="rep-bullet-list">${gezinsAandachtHtml}</ul>
      </div>
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Omgeving</div>
      <div class="rep-kv-blok">
        <div class="rep-kv"><span class="rep-kv-label">Omgevingstype</span><span class="rep-kv-waarde">${alleLocaties}</span></div>
        ${eInfo ? `<div class="rep-kv"><span class="rep-kv-label">Risicofactoren</span><span class="rep-kv-waarde">${eInfo.risico}</span></div>` : ''}
      </div>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Voordelen</div>
        <ul class="rep-bullet-list">${omgVoordelen}</ul>
      </div>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aandachtspunten</div>
        <ul class="rep-bullet-list">${omgAandacht}</ul>
      </div>
    </div>`;
}

// ─── SECTIE 3: VOORBEREIDING ──────────────────────────────────────────────────

function renderSectie3() {
  const inHuisAanwezig = [];
  const inHuisDirectKritiek = [];
  const inHuisAanbevolen = [];
  const inHuisAanvullend = [];

  if (profile.hasKit)      inHuisAanwezig.push('Noodpakket (voedsel, water, EHBO, zaklamp)');
  if (profile.hasCash)     inHuisAanwezig.push('Contant geld thuis bewaard');
  if (profile.hasRadio)    inHuisAanwezig.push('Batterijradio aanwezig');
  if (profile.hasPowerbank)inHuisAanwezig.push('Powerbank aanwezig');

  if (!profile.hasKit)
    inHuisDirectKritiek.push('Noodpakket — voedsel en water voor 72 uur, EHBO-doos, zaklamp en batterijen');
  if (!profile.hasCash)
    inHuisDirectKritiek.push('Contant geld — bewaar minimaal \u20AC100\u2013\u20AC200 thuis voor noodgevallen');

  if (!profile.hasRadio)
    inHuisAanbevolen.push('Batterijradio of slingeradio — bij stroomuitval de enige betrouwbare informatiebron');

  if (!profile.hasPowerbank)
    inHuisAanvullend.push('Powerbank (minimaal 10.000 mAh) — houd hem altijd opgeladen');

  const bijJeAanwezig = [];
  const bijJeAandacht = [];

  if (profile.hasPowerbank) bijJeAanwezig.push('Powerbank');
  if (profile.hasCash)      bijJeAanwezig.push('Contant geld');
  if (profile.hasBike)      bijJeAanwezig.push('Fiets beschikbaar');
  if (profile.hasCar)       bijJeAanwezig.push('Auto beschikbaar');

  if (!profile.hasPowerbank) bijJeAandacht.push('Geen powerbank — telefoon raakt bij een langdurige crisis snel leeg.');
  if (!profile.hasCash)      bijJeAandacht.push('Geen contant geld bij de hand — pinbetalingen vallen uit bij stroomstoring.');
  if (!profile.hasCar && !profile.hasBike) bijJeAandacht.push('Geen privévervoer — bij uitgevallen openbaar vervoer ben je afhankelijk van lopen of hulp van anderen.');

  function listOrEmpty(items, leegTekst) {
    if (!items.length) return `<li class="rep-bullet-item rep-bullet-empty">${leegTekst}</li>`;
    return items.map(i => `<li class="rep-bullet-item">${i}</li>`).join('');
  }

  document.getElementById('rep-s3').innerHTML = `
    <div class="rep-section-nr">3</div>
    <div class="rep-section-heading">Jouw voorbereiding</div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">In huis</div>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aanwezig</div>
        <ul class="rep-bullet-list">${listOrEmpty(inHuisAanwezig, 'Geen voorbereiding geregistreerd.')}</ul>
      </div>
      ${inHuisDirectKritiek.length ? `
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel rep-groep-kritiek">Ontbreekt (direct regelen)</div>
        <ul class="rep-bullet-list">${inHuisDirectKritiek.map(i => `<li class="rep-bullet-item rep-bullet-kritiek">${i}</li>`).join('')}</ul>
      </div>` : ''}
      ${inHuisAanbevolen.length ? `
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aanbevolen</div>
        <ul class="rep-bullet-list">${inHuisAanbevolen.map(i => `<li class="rep-bullet-item">${i}</li>`).join('')}</ul>
      </div>` : ''}
      ${inHuisAanvullend.length ? `
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel rep-groep-aanvullend">Aanvullend</div>
        <ul class="rep-bullet-list">${inHuisAanvullend.map(i => `<li class="rep-bullet-item">${i}</li>`).join('')}</ul>
      </div>` : ''}
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Bij je</div>
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aanwezig</div>
        <ul class="rep-bullet-list">${listOrEmpty(bijJeAanwezig, 'Geen EDC-items opgegeven.')}</ul>
      </div>
      ${bijJeAandacht.length ? `
      <div class="rep-sub-groep">
        <div class="rep-sub-groep-titel">Aandachtspunten</div>
        <ul class="rep-bullet-list">${bijJeAandacht.map(i => `<li class="rep-bullet-item">${i}</li>`).join('')}</ul>
      </div>` : ''}
    </div>`;
}

// ─── SECTIE 4: SCENARIO-ANALYSE ───────────────────────────────────────────────

function renderSectie4(goodItems, improveItems) {
  const momentItems = [
    ...improveItems.map(it => ({ ...it, soort: 'verbeter' })),
    ...goodItems.map(it => ({ ...it, soort: 'goed' }))
  ].slice(0, 3);

  if (!momentItems.length) {
    document.getElementById('rep-s4').innerHTML = `
      <div class="rep-section-nr">4</div>
      <div class="rep-section-heading">Scenario-analyse</div>
      <p class="rep-body-text rep-bullet-empty">Geen keuzemomenten beschikbaar voor dit scenario.</p>`;
    return;
  }

  const momentenHtml = momentItems.map(item => {
    const { label, overweging } = parseMomentText(item.text);
    const effectLabel = item.soort === 'goed' ? 'Goed gedaan' : 'Verbeterpunt';
    const effectClass = item.soort === 'goed' ? 'rep-effect-goed' : 'rep-effect-verbeter';
    return `
      <div class="rep-moment">
        <div class="rep-moment-keuze"><span class="rep-moment-keuze-label">Keuze</span>${label}</div>
        <div class="rep-moment-row"><span class="rep-moment-keuze-label">Effect</span><span class="rep-effect-badge ${effectClass}">${effectLabel}</span></div>
        ${overweging ? `<div class="rep-moment-overweging"><span class="rep-moment-keuze-label">Overweging</span><span>${overweging}</span></div>` : ''}
      </div>`;
  }).join('');

  document.getElementById('rep-s4').innerHTML = `
    <div class="rep-section-nr">4</div>
    <div class="rep-section-heading">Scenario-analyse</div>
    ${momentenHtml}`;
}

// ─── SECTIE 5: PERSOONLIJKE TIPS ──────────────────────────────────────────────

function renderSectie5(personalTips) {
  const tipsHtml = personalTips.length
    ? personalTips.map(t => `<li class="rep-bullet-item">${t.text}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen persoonlijke tips beschikbaar.</li>';

  document.getElementById('rep-s5').innerHTML = `
    <div class="rep-section-nr">5</div>
    <div class="rep-section-heading">Persoonlijke tips</div>
    <ul class="rep-bullet-list">${tipsHtml}</ul>`;
}

// ─── SECTIE 6: AFSLUITING ─────────────────────────────────────────────────────

function renderSectie6(naam, avgScore) {
  let tekst;
  if (avgScore >= 0.7) {
    tekst = naam
      ? `${naam} heeft laten zien dat voorbereiding loont. De keuzes die in dit scenario zijn gemaakt, geven het huishouden een betere uitgangspositie bij een echte noodsituatie. Neem de verbeterpunten mee — dan sta je er nog sterker voor.`
      : 'Je hebt laten zien dat voorbereiding loont. Neem de verbeterpunten mee en je staat er nog sterker voor bij een volgende noodsituatie.';
  } else if (avgScore >= 0.4) {
    tekst = naam
      ? `${naam} heeft de basis, maar er zijn duidelijke punten om aan te werken. Een kleine investering in tijd en materiaal maakt de weerbaarheid aanzienlijk groter. Begin met de meest kritieke verbeterpunten uit dit rapport.`
      : 'Je hebt de basis, maar er zijn duidelijke punten om aan te werken. Begin met de meest kritieke verbeterpunten — een kleine investering maakt een groot verschil.';
  } else {
    tekst = naam
      ? `Dit rapport brengt in kaart waar de grootste kwetsbaarheid zit voor ${naam}. Dat inzicht is waardevol. Prioriteer de kritieke ontbrekende items en maak een concreet plan voor de komende weken.`
      : 'Dit rapport brengt in kaart waar de grootste kwetsbaarheid zit. Dat inzicht is waardevol. Prioriteer de kritieke ontbrekende items en maak een concreet plan voor de komende weken.';
  }

  document.getElementById('rep-s6').innerHTML = `
    <div class="rep-section-nr">6</div>
    <div class="rep-section-heading">Afsluiting</div>
    <p class="rep-body-text">${tekst}</p>`;
}

// ─── SHOWREPORT ────────────────────────────────────────────────────────────────

function showReport() {
  document.getElementById('sc-prog').style.transform = 'scaleX(1)';
  show('s-report');

  const naam = profile.playerName || '';
  document.getElementById('rep-title').textContent = naam
    ? `Rapport \u2013 ${naam}`
    : 'Rapport \u2013 Goed Voorbereid';

  const reportConfig = getScenarioReportConfig(currentScenario);
  const scoreW = state.ranOutOfWater ? 0 : 1;
  const scoreF = state.ranOutOfFood  ? 0 : 1;
  const scoreC = state.comfort / MAX_STAT_COMFORT;
  const scoreH = state.health / MAX_STAT_HEALTH;
  const avgScore = reportConfig.scoreMode === 'water-health'
    ? (scoreW + scoreH + scoreC) / 3
    : (scoreW + scoreF + scoreC) / 3;

  const persons = adultsCount + childrenCount + slechtTerBeenCount;

  // ── Goed gedaan ──────────────────────────────────────────────────────────────
  const goodItems = [];
  if (currentScenario === 'natuurbrand') {
    if (state.packedBag) goodItems.push({ text: '<b>Tas ingepakt</b>. Je pakte al vroeg een tas met belangrijke spullen. Zo kon je bij een evacuatie meteen weg.' });
    if (state.evacuated) goodItems.push({ text: '<b>Op tijd vertrokken</b>. Je reageerde snel op het evacuatiebevel, of zelfs eerder. Vroeg vertrekken voorkomt files en gevaar.' });
    if (state.returnedHome) goodItems.push({ text: '<b>Georganiseerde terugkeer</b>. Je wachtte op het officiële sein veilig en keerde verantwoord terug.' });
    if (state.knowsNeighbors) goodItems.push({ text: '<b>Buren gewaarschuwd</b>. Je informeerde buren voordat je vertrok. Solidariteit helpt in een crisis.' });
    if (state.awarenessLevel > 0) goodItems.push({ text: '<b>Vroeg gealarmeerd</b>. Je volgde het nieuws en was al alert voordat het bevel officieel werd gegeven.' });
  } else if (currentScenario === 'overstroming') {
    if (state.cutElectricity) goodItems.push({ text: '<b>Elektriciteit afgesloten</b>. Je sloot de meterkast af. Water en stroom vormen samen een dodelijke combinatie. Dit was een cruciale veiligheidsmaatregel.' });
    if (state.evacuatedFlood) goodItems.push({ text: '<b>Geëvacueerd</b>. Je verliet het pand of vroeg op tijd hulp. Je stelde je leven boven je bezittingen.' });
    if (state.calledRescue) goodItems.push({ text: '<b>Hulpdiensten ingeschakeld</b>. Je meldde je locatie of riep hulp. Zo konden reddingswerkers je sneller bereiken.' });
    if (state.savedItems) goodItems.push({ text: '<b>Essentials gered</b>. Je nam medicijnen, documenten of voedsel mee naar boven. Dat is slim in een langdurige overstromingssituatie.' });
    if (state.helpedNeighbor) goodItems.push({ text: '<b>Buren geholpen</b>. Je waarschuwde buren of hielp bij evacuatie. Bij een overstroming kunnen buren elkaars reddingslijn zijn.' });
    if (state.returnedHome) goodItems.push({ text: '<b>Gecontroleerde terugkeer</b>. Je ging pas terug toen de situatie het toeliet en werkte stap voor stap: schade vastleggen, spullen regelen, keuring inplannen.' });
  } else if (currentScenario === 'nachtalarm') {
    if (state.tookAlarmSeriously) goodItems.push({ text: '<b>Rookmelder serieus genomen</b>. Je reageerde direct toen het alarm afging. Juist in de eerste minuten maakt dat het verschil.' });
    if (persons > 1 && state.warnedHousemates) goodItems.push({ text: '<b>Huisgenoten gewaarschuwd</b>. Je zorgde dat niemand slapend achterbleef. Dat is cruciaal bij rook in de nacht.' });
    if (state.didntUseWaterOnFire) goodItems.push({ text: '<b>Geen water op een elektrische brand</b>. Je maakte de situatie niet gevaarlijker. Bij een stopcontactbrand is dat een belangrijke keuze.' });
    if (state.evacuatedFire) goodItems.push({ text: '<b>Snel naar buiten gegaan</b>. Je bleef niet onnodig lang binnen. Dat verkleint het risico op rookinhalatie.' });
    if (state.cutElectricity) goodItems.push({ text: '<b>Stroom uitgeschakeld</b>. Je zette bij de uitgang snel de stroom uit. Dat verkleinde de kans dat het probleem verder doorsloeg.' });
    if (state.called112) goodItems.push({ text: '<b>112 vanaf buiten gebeld</b>. Je gaf de situatie door vanaf een veilige plek. Zo konden hulpdiensten gericht uitrukken.' });
    if (state.stayedOutside) goodItems.push({ text: '<b>Buiten gebleven</b>. Je ging niet terug naar binnen zonder begeleiding. Dat is precies wat je moet doen bij rook en brandschade.' });
    if ((profile.hasChildren || profile.hasMobilityImpaired) && state.kidsEvacuated) goodItems.push({ text: '<b>Kwetsbare huisgenoten geholpen</b>. Je zorgde dat kinderen of minder mobiele huisgenoten veilig buiten kwamen.' });
    if (profile.hasPets && state.tookPets) goodItems.push({ text: '<b>Huisdier veilig mee</b>. Je nam je huisdier mee zonder lang te blijven zoeken. Dat is een veilige afweging.' });
  } else if (currentScenario === 'thuis_komen') {
    if (state.reachedHome) goodItems.push({ text: '<b>Thuis gekomen</b>. Je vond een weg naar huis, ondanks uitgevallen infrastructuur.' });
    if (state.hadEDCBag) goodItems.push({ text: '<b>EDC-tas bij je</b>. Je had je dagelijkse noodtas bij je. Contant geld, powerbank en OV-kaart maakten onderweg echt verschil.' });
    if (state.foundAlternative) goodItems.push({ text: '<b>Alternatief gevonden</b>. Je bleef niet wachten, maar zocht actief een andere manier om thuis te komen.' });
    if (state.helpedStranger) goodItems.push({ text: '<b>Iemand geholpen onderweg</b>. Je hielp een medemens tijdens een moeilijke situatie. Dat verdient erkenning.' });
    if (state.kidsPickedUp || state.kidsArranged) goodItems.push({ text: '<b>Kinderen geregeld</b>. Je zorgde dat de kinderen veilig waren, ook op afstand.' });
  } else if (currentScenario === 'drinkwater') {
    if (state.hasWater) goodItems.push({ text: '<b>Schoon water op tijd apart gezet</b>. Je legde een buffer aan zolang er nog water uit de kraan kwam. Dat gaf rust en ruimte om betere keuzes te maken.' });
    if (state.followedOfficialAdvice) goodItems.push({ text: '<b>Officiële informatie gevolgd</b>. Je wachtte op berichten van Vitens of de gemeente in plaats van te gokken. Bij drinkwater is dat precies wat veilig gedrag is.' });
    if (state.health >= START_HEALTH) goodItems.push({ text: '<b>Veilig met het kookadvies omgegaan</b>. Je nam het advies serieus en voorkwam onnodig gezondheidsrisico.' });
    if (state.helpedNeighbor) goodItems.push({ text: '<b>Buur geholpen</b>. Je keek niet alleen naar je eigen voorraad, maar hielp ook iemand in je omgeving. Dat maakt een buurt veerkrachtiger.' });
    if (profile.hasChildren && state.kidsNoodpakket) goodItems.push({ text: '<b>Vooruitgedacht voor school of opvang</b>. Je zette drinkwater voor de volgende ochtend apart. Dat voorkomt stress op het moment dat iedereen tegelijk iets nodig heeft.' });
  } else {
    // stroom
    if (state.hasCash) goodItems.push({ text: '<b>Contant geld</b>. Je had contant geld beschikbaar. In een stroomstoring werken pinautomaten niet. Dat maakte direct verschil bij de supermarkt.' });
    if (state.hasWater) goodItems.push({ text: '<b>Noodwater opgeslagen</b>. Je vulde op tijd flessen en pannen met water. Toen de waterpomp uitviel, had je nog een buffer voor drinken, koken en de wc.' });
    if (state.houseLocked) goodItems.push({ text: '<b>Huis afgesloten</b>. Je controleerde ramen en deuren. Inbrekers sloegen toe in de buurt. Jouw huis bleef gespaard.' });
    if (state.knowsNeighbors) goodItems.push({ text: '<b>Buren leren kennen</b>. Je ging al vroeg bij Annie langs. Zo wist je wie er woonde en kon je sneller helpen toen het misging.' });
    if (state.helpedNeighbor) goodItems.push({ text: '<b>Buren geholpen</b>. Je hielp buurvrouw Annie en haar gewonde man. In een crisis zijn buren vaak je eerste vangnet.' });
    if (state.hasCampingStove) goodItems.push({ text: '<b>Campingkooktoestel gebruikt</b>. Je kookte warm eten met het campingkooktoestel. Warm eten in een koud huis doet veel voor het moreel.' });
    if (state.handledSewage) goodItems.push({ text: '<b>Rioleringsprobleem aangepakt</b>. Je reageerde goed op de uitgevallen rioolpompen. Zo bleef het huis leefbaar.' });
    if (state.hasExtraFood) goodItems.push({ text: '<b>Voedsel vooraf ingeslagen</b>. Je kocht al voor de crisis wat extra in. Kleine voorbereiding, groot verschil.' });
    if (state.hasFlashlight) goodItems.push({ text: '<b>Verlichting geregeld</b>. Je zorgde voor een zaklamp of kaarsen. In het donker, bij -3 graden buiten, was dat essentieel.' });
    if (state.awarenessLevel > 0) goodItems.push({ text: '<b>Bewustzijn voor risico\'s</b>. Je las de nieuwsberichten over kwetsbare energienetwerken. Dat bewustzijn is de eerste stap in voorbereiding.' });
  }

  // ── Verbeterpunten ───────────────────────────────────────────────────────────
  const improveItems = [];
  if (currentScenario === 'natuurbrand') {
    if (!state.packedBag) improveItems.push({ text: '<b>Geen tas ingepakt</b>. Bij evacuatie had je geen voorbereide tas. Leg alvast een noodtas klaar met paspoort, medicijnen, oplader en kleding voor twee dagen.' });
    if (!state.evacuated) improveItems.push({ text: '<b>Te laat vertrokken</b>. Je vertrok niet vroeg genoeg. Bij natuurbranden kan het vuurfront snel oprukken. Vertrouw niet alleen op het officiële bevel, maar ook op je eigen waarneming.' });
    if (state.awarenessLevel === 0) improveItems.push({ text: '<b>Informatie gemist</b>. Je volgde het nieuws niet goed. Een batterijradio of NL-Alert-app had je eerder kunnen waarschuwen.' });
    if (!state.returnedHome) improveItems.push({ text: '<b>Terugkeer niet georganiseerd</b>. Na de crisis is een geordende terugkeer belangrijk. Wacht altijd op het officiële sein veilig.' });
  } else if (currentScenario === 'overstroming') {
    if (!state.cutElectricity) improveItems.push({ text: '<b>Elektriciteit niet afgesloten</b>. Water en stroom samen zijn levensgevaarlijk. Bij hoog water moet je altijd de meterkast uitzetten voordat het water de elektra bereikt.' });
    if (!state.evacuatedFlood && !state.wentUpstairs) improveItems.push({ text: '<b>Te laat gereageerd</b>. Je reageerde niet op tijd op de hoogwaterwaarschuwing. Bij wateroverlast telt elke minuut.' });
    if (!state.savedItems) improveItems.push({ text: '<b>Niets meegenomen</b>. Je nam geen belangrijke spullen mee naar boven. Medicijnen, documenten en een oplader zijn het minimum bij kans op overstroming.' });
    if (!state.calledRescue && state.wentUpstairs) improveItems.push({ text: '<b>Geen hulp gevraagd</b>. Toen je boven zat, had je je locatie kunnen melden bij 112. Laat hulpdiensten altijd weten waar je bent.' });
  } else if (currentScenario === 'nachtalarm') {
    if (!state.tookAlarmSeriously) improveItems.push({ text: '<b>Alarm te laat serieus genomen</b>. Een rookmelder midden in de nacht is nooit iets om weg te wuiven. Reageer direct en controleer meteen wat er aan de hand is.' });
    if (persons > 1 && !state.warnedHousemates) improveItems.push({ text: '<b>Huisgenoten niet gewaarschuwd</b>. Maak anderen direct wakker als er rook in huis is. In de nacht merkt niet iedereen het alarm even snel op.' });
    if (!state.didntUseWaterOnFire) improveItems.push({ text: '<b>Verkeerd blusmiddel gebruikt</b>. Water op een elektrische brand maakt de situatie gevaarlijker. Kies eerst voor afsluiten, afstand nemen en evacueren.' });
    if (!state.evacuatedFire) improveItems.push({ text: '<b>Te lang binnen gebleven</b>. Bij rook telt elke seconde. Ga zo snel mogelijk naar buiten en stel je veiligheid voorop.' });
    if (!state.called112) improveItems.push({ text: '<b>112 niet vanaf buiten gebeld</b>. Bel zodra je veilig buiten staat en geef door of iedereen eruit is. Dat helpt de brandweer direct bij aankomst.' });
    if (!state.stayedOutside) improveItems.push({ text: '<b>Niet buiten gebleven</b>. Ga na evacuatie niet opnieuw naar binnen voor spullen of kleding. Wacht op de brandweer en ga alleen onder begeleiding terug.' });
  } else if (currentScenario === 'thuis_komen') {
    if (!state.hadEDCBag) improveItems.push({ text: '<b>Geen EDC-tas</b>. Je had geen dagelijkse noodtas bij je. Contant geld, powerbank en OV-kaart hadden onderweg een direct verschil gemaakt. Neem op werkdagen een kleine tas mee.' });
    if (!state.reachedHome) improveItems.push({ text: '<b>Niet thuis gekomen</b>. Je vond geen manier om thuis te komen. Denk van tevoren na over alternatieven als het OV uitvalt.' });
    if (!state.foundAlternative && profile.commuteDistance !== 'near') improveItems.push({ text: '<b>Geen alternatief gevonden</b>. Je bleef wachten op een vervoermiddel dat niet meer reed. Wees proactief: vraag een lift, leen een fiets of ga alvast lopen.' });
    if (profile.hasChildren && !state.kidsArranged) improveItems.push({ text: '<b>Kinderen niet geregeld</b>. Je had geen plan voor wie de kinderen ophaalt als jij niet thuis kunt komen. Spreek dit van tevoren af met school en partner.' });
    if (!profile.hasCash && !state.hasCash) improveItems.push({ text: '<b>Geen contant geld</b>. Taxi\'s, liften en tankstations accepteerden alleen cash. Zorg altijd voor \u20AC50 in je tas.' });
  } else if (currentScenario === 'drinkwater') {
    if (!state.hasWater) improveItems.push({ text: '<b>Geen waterbuffer gemaakt</b>. Toen het kookadvies kwam had je weinig schoon water apart gezet. Vul meteen flessen, pannen en kannen zolang er nog waterdruk is.' });
    if (!state.followedOfficialAdvice) improveItems.push({ text: '<b>Te veel op aannames vertrouwd</b>. Bij troebel water en een kookadvies moet je alleen uitgaan van officiële updates van Vitens of de gemeente. Uiterlijk zegt niet genoeg over veiligheid.' });
    if (state.health < START_HEALTH) improveItems.push({ text: '<b>Onveilig met water omgegaan</b>. Je nam een risico met mogelijk vervuild water. Volg een kookadvies altijd letterlijk op en gebruik schoon water alleen voor drinken, tandenpoetsen, medicijnen en eten.' });
    if (profile.hasChildren && !state.kidsNoodpakket) improveItems.push({ text: '<b>Geen water voor school of opvang klaargezet</b>. Als het kookadvies langer duurt, wil je dit het liefst de avond ervoor al geregeld hebben.' });
    if (!state.helpedNeighbor) improveItems.push({ text: '<b>Omgeving niet meegenomen</b>. Bij een wateradvies zijn vooral alleenwonende buren of ouderen snel kwetsbaar. Even afstemmen kan veel schelen.' });
  } else {
    // stroom
    if (!state.hasCash) improveItems.push({ text: '<b>Contant geld</b>. Je had geen contant geld bij de hand. Supermarkten en tankstations accepteerden tijdens de crisis alleen contant. Bewaar thuis altijd \u20AC100 tot \u20AC200 in een noodpakket.' });
    if (!state.hasWater) improveItems.push({ text: '<b>Noodwater</b>. Je vulde geen flessen of pannen met water. Toen de waterpomp uitviel, had je geen reserve. Vul bij een dreigende storing direct flessen, pannen en emmers. Reken op minimaal 2 liter per persoon per dag.' });
    if (!state.houseLocked) improveItems.push({ text: '<b>Beveiliging</b>. Je controleerde je huis niet goed. Inbrekers sloegen toe in de nacht. Vergrendel deuren én ramen en zet eventueel een extra blokkade achter de deur.' });
    if (!state.knowsNeighbors) improveItems.push({ text: '<b>Buren niet gekend</b>. Je ging niet vroeg bij de buren langs. Toen Annie hulp nodig had, kende je haar niet. Leer je directe buren kennen en weet wie er ouder of ziek is.' });
    if (!state.helpedNeighbor) improveItems.push({ text: '<b>Buurhulp</b>. Je hielp buurvrouw Annie niet of nauwelijks. Haar man had medische hulp nodig. Ken je buren. Ouderen en zieken zijn in een crisis vaak als eerste kwetsbaar.' });
    if (!state.hasCampingStove) improveItems.push({ text: '<b>Geen campingkooktoestel</b>. Je at meerdere dagen koud of was afhankelijk van het gasfornuis. Een campingkooktoestel of barbecue geeft je een extra kookoptie. Let op: gebruik die nooit binnen vanwege koolmonoxide.' });
    if (!state.handledSewage) improveItems.push({ text: '<b>Riolering</b>. Je pakte het rioleringsprobleem niet goed aan. Rioolwater dat terugstroomt in huis is een ernstig hygiënerisico. Sluit afvoeren af bij het eerste teken van terugsijpeling.' });
    if (!state.wentToSupermarket && !state.hasExtraFood) improveItems.push({ text: '<b>Noodvoorraad</b>. Je ging niet vroeg naar de supermarkt en had geen noodvoorraad thuis. Na 24 uur waren alle supermarkten leeg of gesloten. Een noodvoorraad voor 72 uur maakt je minder afhankelijk. Dat is een goede eerste stap.' });
  }

  // ── Persoonlijke tips ────────────────────────────────────────────────────────
  const personalTips = [];
  if (profile.region === 'lowland' || (profile.location && profile.location.includes('water'))) {
    personalTips.push({ text: '<b>Laaggelegen gebied</b>. Jij woont in een gebied dat extra kwetsbaar is voor wateroverlast bij uitval van gemalen en stuwen. Controleer of je woning boven de vloedlijn ligt en ken de evacuatieroutes.' });
  }
  if (profile.houseType === 'hoogbouw') {
    personalTips.push({ text: '<b>Hoogbouw</b>. Bij stroomuitval werkt de lift niet. Houd daar rekening mee, zeker als iemand in het huishouden beperkt mobiel is. Zet voldoende water op voorraad: minimaal 2 liter per persoon per dag voor 3 dagen.' });
  }
  if (profile.houseType === 'laagbouw') {
    personalTips.push({ text: '<b>Laagbouw (appartementen)</b>. Zet grote jerrycans, flessen of emmers klaar met kraanwater, minimaal 2 liter per persoon per dag voor 3 dagen. Bewaar essentiële spullen op een plek die je snel kunt pakken.' });
  }
  if (profile.hasChildren) {
    personalTips.push({ text: '<b>Kinderen</b>. Kinderen hebben extra warmte, voeding en structuur nodig in een crisis. Zorg voor spelmateriaal en passend extra voedsel. Leg ook uit wat er gebeurt. Onzekerheid is voor hen zwaarder als ze niets weten.' });
  }
  if (profile.hasElderly) {
    personalTips.push({ text: '<b>Ouderen in huis</b>. Ouderen koelen sneller af en zijn gevoeliger voor hypothermie. Houd één kamer zo warm mogelijk en let op tekenen van onderkoeling, zoals rillen, verwardheid en slaperigheid.' });
  }
  if (profile.hasMedNeeds) {
    personalTips.push({ text: '<b>Medicijnen</b>. Sommige medicijnen moeten gekoeld blijven, zoals insuline en biologicals. Zorg voor een koeltasje met ijspacks als back-up. Houd ook een week extra medicijnen op voorraad voor noodgevallen.' });
  }
  if (profile.hasPets) {
    personalTips.push({ text: '<b>Huisdieren</b>. Huisdieren hebben ook noodvoorraden nodig: voer voor minimaal 3 dagen, water en een transportmand klaar bij de deur. Let op stresssignalen bij je huisdier.' });
  }
  if (!profile.hasCar) {
    personalTips.push({ text: '<b>Geen auto</b>. Zonder auto ben je afhankelijk van je fiets of van lopen. Zorg dat je weet waar de dichtstbijzijnde voedseluitdelingspunten, noodopvang en hulpposten zijn.' });
  }
  if (!profile.hasRadio) {
    personalTips.push({ text: '<b>Geen batterijradio</b>. In dit scenario was de AM-radio na dag 1 de enige betrouwbare informatiebron. Een batterijradio of handslingerradio kost ongeveer \u20AC20 tot \u20AC40 en is onmisbaar bij stroomuitval.' });
  }
  if (!profile.hasCash && !state.hasCash) {
    personalTips.push({ text: '<b>Geen contant geld</b>. Zowel voor als tijdens de crisis had je geen contant geld. Leg thuis altijd \u20AC100 tot \u20AC200 in biljetten klaar op een vaste, veilige plek.' });
  }
  if (!profile.hasKit) {
    personalTips.push({ text: '<b>Geen noodpakket</b>. Je hebt geen noodpakket thuis. Denk Vooruit adviseert: water (3 liter per persoon per dag), noodvoorraad voor 3 dagen, zaklamp, batterijen, EHBO-doos, contant geld en een batterijradio. Meer info: <b>denkvooruit.nl</b>' });
  }
  if (!profile.hasPowerbank) {
    personalTips.push({ text: '<b>Geen powerbank</b>. Je telefoon was je enige verbinding met de buitenwereld. Zonder powerbank was die na een dag leeg. Schaf een powerbank aan van minimaal 10.000 mAh en houd hem opgeladen.' });
  }
  personalTips.push({ text: '<b>Bereid je voor op 72 uur</b>. Dit scenario laat zien hoe snel je afhankelijk wordt van dingen die normaal vanzelf gaan: stroom, water, verwarming, communicatie. Een noodpakket, noodvoorraad en een noodplan helpen je de eerste 72 uur zelfstandig door te komen.' });

  // ── Render ───────────────────────────────────────────────────────────────────
  renderSectie1(naam, avgScore, goodItems, improveItems);
  renderSectie2(persons);
  renderSectie3();
  renderSectie4(goodItems, improveItems);
  renderSectie5(personalTips);
  renderSectie6(naam, avgScore);

  const secties = ['rep-s1', 'rep-s2', 'rep-s3', 'rep-s4', 'rep-s5', 'rep-s6'];
  secties.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.animation = `contentFade 280ms var(--ease-out) ${200 + i * 100}ms both`;
    }
  });
}
