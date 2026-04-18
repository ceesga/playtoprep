// ═══════════════════════════════════════════════════════════════
// Rapport — Persoonlijke eindanalyse na het scenario
// Secties: 1 score, 2 thuissituatie, 3 voorbereiding, 4 tips
// ═══════════════════════════════════════════════════════════════

// ─── HULPFUNCTIES ─────────────────────────────────────────────────────────────

function checkItem(val, label, indent) {
  if (val === 'nvt') return '';
  const ja = val === 'ja' || val === true;
  const cls = indent ? 'rep-check-row rep-check-indent' : 'rep-check-row';
  return `<div class="${cls}"><span class="rep-check-icon ${ja ? 'rep-check-ja' : 'rep-check-nee'}">${ja ? '✓' : '✗'}</span><span class="rep-check-label">${label}</span></div>`;
}

function prepScoreBerekenen() {
  const items = [
    profile.hasKit       === 'ja',
    profile.hasBOBBag    === 'ja',
    profile.hasNoodplan  === 'ja',
    profile.hasRadio     === 'ja',
    profile.hasCash      === 'ja',
    profile.hasPowerbank === 'ja'
  ];
  return items.filter(Boolean).length / items.length;
}

// ─── SECTIE 1: SCORE ──────────────────────────────────────────────────────────

function renderSectie1(naam, prepScore) {
  let niveau, heroClass, duiding;
  if (prepScore >= 0.67) {
    niveau = 'Goed voorbereid';
    heroClass = 'rep-score-hero--goed';
    duiding = 'De meeste essentiële onderdelen van een noodvoorbereiding zijn aanwezig. Dat is een solide basis die in een echte noodsituatie direct van waarde is.';
  } else if (prepScore >= 0.33) {
    niveau = 'Matig voorbereid';
    heroClass = 'rep-score-hero--matig';
    duiding = 'Een deel van de voorbereiding is op orde, maar er ontbreken nog belangrijke onderdelen. Gerichte aanvullingen vergroten de weerbaarheid aanzienlijk.';
  } else {
    niveau = 'Beperkt voorbereid';
    heroClass = 'rep-score-hero--beperkt';
    duiding = 'De voorbereiding is beperkt. Dit rapport brengt in kaart welke stappen het meeste verschil maken bij een volgende noodsituatie.';
  }

  const scoreItems = [
    { ok: profile.hasKit       === 'ja' },
    { ok: profile.hasBOBBag    === 'ja' },
    { ok: profile.hasNoodplan  === 'ja' },
    { ok: profile.hasRadio     === 'ja' },
    { ok: profile.hasCash      === 'ja' },
    { ok: profile.hasPowerbank === 'ja' },
  ];
  const dots = scoreItems.map(item =>
    `<div class="rep-score-dot ${item.ok ? 'rep-score-dot--ja' : 'rep-score-dot--nee'}"></div>`
  ).join('');

  document.getElementById('rep-s1').innerHTML = `
    <div class="rep-section-header-wrap">
      <span class="rep-section-nr">1</span>
      <span class="rep-section-heading">Score</span>
    </div>
    <div class="rep-score-hero ${heroClass}">
      <div class="rep-score-hero-top">
        <div class="rep-score-level">${niveau}</div>
        <div class="rep-score-dots">${dots}</div>
      </div>
      <p class="rep-body-text" style="margin:0">${duiding}</p>
    </div>`;
}

// ─── SECTIE 2: THUISSITUATIE ──────────────────────────────────────────────────

function renderSectie2(persons) {
  const houseSubLabels = { 'caravan': 'Caravan', 'tiny_house': 'Tiny house', 'woonboot': 'Woonboot' };
  const houseLabels = {
    'hoogbouw':           'Hoogbouw (met lift)',
    'laagbouw':           'Laagbouw (appartementen)',
    'rijwoning':          'Rijwoning',
    'vrijstaande-woning': 'Vrijstaande woning',
    'overige': profile.houseSubType
      ? `Overige woning (${houseSubLabels[profile.houseSubType] || profile.houseSubType})`
      : 'Overige woning'
  };

  const woningInfo = {
    'hoogbouw': {
      toelichting: 'Een appartement op een hogere verdieping in een wooncomplex, vaak met gedeelde voorzieningen zoals lift, portiek en centrale installaties.',
      voordelen: ['Een hogere verdieping is meestal beter beschermd tegen water op straat of in de wijk.', 'Aaneengesloten bebouwing houdt warmte vaak iets beter vast dan een vrijstaande woning.', 'Buren wonen dichtbij, waardoor onderlinge hulp en snelle informatie-uitwisseling makkelijker kan zijn.'],
      aandachtspunten: ['Bij stroomuitval vallen lift, intercom en soms ook ventilatie of toegangsdeuren uit.', 'Waterdruk en drinkwatervoorziening kunnen sneller onder druk komen te staan als pompen of installaties uitvallen.', 'Trappenhuizen maken evacuatie en dagelijkse beweging zwaarder voor ouderen, jonge kinderen of beperkt mobiele bewoners.']
    },
    'laagbouw': {
      toelichting: 'Een appartement of woning op de begane grond of lage verdieping, vaak met relatief korte looproutes naar buiten.',
      voordelen: ['De woning is meestal snel te verlaten als je moet schuilen of evacueren.', 'De toegankelijkheid is vaak goed voor kinderen, ouderen en mensen die minder mobiel zijn.', 'Contact met straat, galerij of binnenterrein maakt het makkelijker om zicht te houden op wat er in de buurt gebeurt.', 'Buren wonen dichtbij, waardoor onderlinge hulp en snelle informatie-uitwisseling makkelijker kan zijn.'],
      aandachtspunten: ['Wateroverlast en terugstromend riool bereiken de begane grond en lage verdiepingen doorgaans als eerste.', 'Ramen en deuren op straatniveau vragen extra aandacht bij onrust of langdurige uitval van verlichting en beveiliging.', 'Je blijft vaak afhankelijk van gedeelde installaties, zoals portiekverlichting, centrale deuren of pompen.', 'Opslagruimte voor noodvoorraad is in appartementen vaak beperkter dan in grondgebonden woningen.']
    },
    'rijwoning': {
      toelichting: 'Een grondgebonden woning die direct grenst aan andere woningen, vaak met meerdere verdiepingen en een kleine buitenruimte.',
      voordelen: ['Een eigen voordeur en vaak ook een tuin, schuur of zolder geven flexibiliteit voor opslag en noodmaatregelen.', 'De gedeelde muren met buren beperken warmteverlies meestal meer dan bij een vrijstaande woning.', 'Buren wonen dichtbij, waardoor onderlinge hulp en snelle informatie-uitwisseling makkelijker kan zijn.', 'Extra verdiepingen geven ruimte om spullen hoger en droger op te slaan als beneden problemen ontstaan.'],
      aandachtspunten: ['De begane grond is kwetsbaar voor wateroverlast en terugstromend riool.', 'Meer leefruimte vraagt meer energie om warm en leefbaar te houden bij langdurige uitval.', 'In een dichte woonrij kan brand, rook of paniek sneller invloed hebben op meerdere huizen tegelijk.']
    },
    'vrijstaande-woning': {
      toelichting: 'Een woning met eigen grond rondom het huis, vaak met meer buitenruimte, bijgebouwen of mogelijkheden voor eigen voorzieningen.',
      voordelen: ['Er is meestal meer ruimte voor noodvoorraad, wateropvang, een aggregaat of andere eigen oplossingen.', 'Meerdere zijden van het huis blijven vaak bereikbaar, wat helpt bij verplaatsen, laden of evacueren.'],
      aandachtspunten: ['Het grotere volume vraagt meer energie om warm, veilig en leefbaar te houden bij langdurige uitval.', 'Vrijstaande woningen vangen meer wind, neerslag en stormschade op doordat alle gevels blootstaan.', 'Als de woning buiten een kern ligt, kunnen hulpdiensten, winkels of burenhulp minder snel beschikbaar zijn.']
    },
    'overige': {
      toelichting: 'Een bijzondere woonvorm met specifieke technische en praktische eigenschappen die per subtype sterk kunnen verschillen.',
      voordelen: ['De woonruimte is vaak compact en daardoor overzichtelijker te beheren in een acute situatie.', 'Bewoners van dit soort woonvormen denken vaak al bewuster na over water, energie en ruimtegebruik.'],
      aandachtspunten: ['De opslagruimte voor noodvoorraad en reserveonderdelen is beperkt.', 'De veiligheid hangt sterker af van de technische staat van de woonvorm en van tijdig onderhoud.', 'Een kleine storing in verwarming, water of elektra heeft direct effect op het dagelijks functioneren.']
    }
  };
  const woningSubTypeInfo = {
    'caravan': {
      toelichting: 'Een lichte, verplaatsbare woonvorm met beperkte isolatie en meestal weinig opslagruimte.',
      voordelen: ['Een caravan is overzichtelijk en snel te controleren op losse spullen of risico\'s.', 'Als hij rijklaar is en de situatie het toelaat, is verplaatsen soms een extra uitwijkoptie.', 'Kleine ruimtes zijn met weinig middelen kortdurend te verwarmen, zolang ventilatie en brandveiligheid op orde blijven.'],
      aandachtspunten: ['Isolatie en stormvastheid zijn meestal beperkter, waardoor kou, hitte en harde wind sneller binnen merkbaar zijn.', 'De opslagruimte voor water, voedsel, accu\'s en brandstof is beperkt.', 'Gas, elektra en kooktoestellen zitten compact op elkaar, waardoor brandveiligheid extra aandacht vraagt.', 'Niet elke caravanlocatie is even goed bereikbaar of geschikt voor snelle evacuatie met meerdere personen.']
    },
    'tiny_house': {
      toelichting: 'Een zeer compacte woning waarin ruimte, opslag en techniek efficient zijn ingericht, maar waarin weinig marge zit.',
      voordelen: ['Door het kleine volume blijft het overzicht goed en is een noodvoorraad snel te controleren.', 'Veel tiny houses zijn bewust ontworpen op zuinig energie- en watergebruik.', 'Met beperkte middelen kun je een kleine ruimte vaak sneller op temperatuur krijgen dan een groot huis.'],
      aandachtspunten: ['De opslagruimte voor water, voedsel en reserveonderdelen is beperkt.', 'Als verwarming, ventilatie of sanitair uitvalt, merk je dat direct in het hele huis.', 'Tiny houses staan geregeld op locaties die meer blootstaan aan wind, hitte of koude dan een standaard woonwijk.', 'Loften, trappen of compacte doorgangen kunnen evacuatie minder makkelijk maken voor kinderen of beperkt mobiele bewoners.']
    },
    'woonboot': {
      toelichting: 'Een woning op het water of direct aan de kade, waarbij wonen sterk samenhangt met waterstand, steigers en walvoorzieningen.',
      voordelen: ['Bewoners zijn vaak alert op waterstanden, weersomslag en het veilig vastleggen van spullen.', 'Sommige woonboten hebben zelfstandige voorzieningen of een praktische noodvoorraad al dicht bij de hand.', 'Bij lichte wateroverlast op straat blijft de woonvloer soms juist hoger dan de directe omgeving.'],
      aandachtspunten: ['Hoge waterstand, golfslag, storm en drijfvuil kunnen direct invloed hebben op bereikbaarheid en veiligheid.', 'Toegang via steiger, trap of loopbrug kan glad, instabiel of onbruikbaar worden.', 'Nutsvoorzieningen lopen vaak via aansluitingen aan wal en zijn kwetsbaar bij schade of afsluiting.', 'Evacueren met kinderen, huisdieren of zware spullen is vaak lastiger dan vanuit een woning op vaste grond.']
    }
  };

  const ht = profile.houseType || 'overige';
  const wInfo = ht === 'overige' && profile.houseSubType && woningSubTypeInfo[profile.houseSubType]
    ? woningSubTypeInfo[profile.houseSubType]
    : (woningInfo[ht] || woningInfo['overige']);
  const woningLabel = houseLabels[ht] || 'Onbekend';

  // ── Omgeving ────────────────────────────────────────────────────────────────
  const envLabels = {
    'water':      'Nabij water',
    'forest':     'Bos of natuur',
    'rural_area': 'Buitengebied',
    'city':       'Bebouwde kom'
  };
  const envProse = {
    'water':      'Je woont in de buurt van open water. Dit kan bijvoorbeeld een rivier, polder of kanaal zijn. Er is over het algemeen voldoende water in de omgeving. Risicofactoren zijn een verhoogde kans op wateroverlast, het onbruikbaar worden van routes bij stijgend water, verstoring van pompen en gemalen bij stroomuitval en beperkte bereikbaarheid van de woning bij overstroming.',
    'forest':     'Je woont in of nabij bos of natuur. Bomen en groen kunnen bij warm weer voor meer schaduw en verkoeling zorgen. Risicofactoren zijn onder andere een grotere kans op natuurbrand, snelle verspreiding van vuur bij droogte en wind en minder goed bereikbare wegen bij extreem weer.',
    'rural_area': 'Je woont in het buitengebied. Voorzieningen zoals winkels, zorg en hulpdiensten liggen op grotere afstand dan in stedelijk gebied. Er is vaak voldoende ruimte voor noodvoorraad en eigen voorzieningen, minder drukte en concurrentie om middelen, en meer mogelijkheden om zelfstandig te handelen. Risicofactoren zijn afhankelijkheid van eigen vervoer, langere aanrijtijden voor hulpdiensten, beperkte alternatieven bij uitval van infrastructuur en mogelijke uitval van nutsvoorzieningen over grotere gebieden.',
    'city':       'Je woont in de bebouwde kom. Hulpdiensten, informatie en andere voorzieningen zijn meestal dichtbij. Risicofactoren zijn snelle uitputting van basisproducten, overbelasting van verkeer en communicatienetwerken, beperkte bewegingsruimte en grotere afhankelijkheid van gedeelde voorzieningen.'
  };
  const locaties = (profile.location || []).filter(l => envLabels[l]);
  const alleLocaties = locaties.map(l => envLabels[l]).join(', ') || 'Niet opgegeven';
  const omgevingHtml = locaties.length
    ? locaties.map(l => `<p class="rep-body-text"><b>${envLabels[l]}.</b> ${envProse[l]}</p>`).join('')
    : '<p class="rep-body-text">Geen omgeving opgegeven.</p>';

  // ── Gezinssamenstelling ──────────────────────────────────────────────────────
  const huishoudKvs = [
    { label: 'Aantal personen', waarde: persons },
    { label: '(Bijna) volwassenen', waarde: adultsCount },
    { label: 'Ouderen',         waarde: profile.ouderenCount || 0 },
    { label: 'Jonge kinderen',  waarde: childrenCount },
    { label: 'Beperkt mobiel',  waarde: slechtTerBeenCount },
    { label: 'Huisdieren',      waarde: profile.hasPets ? (petsCount || 1) : 'Nee' }
  ];
  let gezinsToel = `Het huishouden bestaat uit ${persons} ${persons === 1 ? 'persoon' : 'personen'}.`;
  const kwetsbaar = [];
  if (profile.hasChildren)       kwetsbaar.push('jonge kinderen');
  if (profile.hasElderly)        kwetsbaar.push('ouderen');
  if (profile.hasMobilityImpaired || slechtTerBeenCount > 0) kwetsbaar.push('beperkt mobiele bewoners');
  if (kwetsbaar.length) gezinsToel += ` Het huishouden bevat kwetsbare groepen: ${kwetsbaar.join(', ')}.`;
  if (profile.hasPets) gezinsToel += ' Er zijn huisdieren aanwezig.';

  const gezinsAandacht = [];
  if (profile.hasChildren) {
    gezinsAandacht.push('Kinderen van 0 tot 5 jaar zijn volledig afhankelijk van verzorgers. Zorg voor voldoende voeding, luiers, medicijnen en vertrouwde voorwerpen. Houd de dagelijkse routine zoveel mogelijk intact en geef korte, geruststellende uitleg. Jonge kinderen kunnen in stress terugvallen in gedrag zoals extra huilen, angst om alleen te zijn of slaapproblemen.');
    gezinsAandacht.push('Kinderen van 6 tot 12 jaar begrijpen de situatie beter, maar hebben duidelijke structuur en geruststelling nodig. Betrek hen actief bij eenvoudige taken en houd hen weg uit risicovolle situaties. Ze kunnen veel vragen stellen en hebben behoefte aan eerlijke, eenvoudige informatie om hun eigen interpretaties te voorkomen.');
    gezinsAandacht.push('Kinderen van 12 jaar en ouder kunnen helpen bij praktische taken en beseffen de ernst van de situatie. Ze kunnen echter ook roekeloos gedrag vertonen of zich afsluiten. Geef hen duidelijke verantwoordelijkheden en zorg voor open en eerlijke communicatie. Let erop dat ook zij stress kunnen ervaren, zoals slaapproblemen of prikkelbaarheid.');
  }
  if (profile.hasElderly)        gezinsAandacht.push('Ouderen koelen sneller af en kunnen gevoeliger zijn voor stress en uitputting.');
  if (profile.hasMobilityImpaired || slechtTerBeenCount > 0) gezinsAandacht.push('Beperkt mobiele bewoners vereisen extra aandacht bij evacuatie en verplaatsing.');
  if (profile.hasPets)           gezinsAandacht.push('Huisdieren hebben noodvoer, water en eventueel een vervoersmand nodig bij evacuatie.');

  const kvRows = huishoudKvs.map(r =>
    `<div class="rep-kv"><span class="rep-kv-label">${r.label}</span><span class="rep-kv-waarde">${r.waarde}</span></div>`
  ).join('');
  const gezinsAandachtHtml = gezinsAandacht.length
    ? gezinsAandacht.map(a => `<li class="rep-bullet-item">${a}</li>`).join('')
    : '<li class="rep-bullet-item rep-bullet-empty">Geen specifieke aandachtspunten voor dit huishouden.</li>';

  const woningVoordelen = wInfo.voordelen.map(v => `<li class="rep-bullet-item">${v}</li>`).join('');
  const woningAandacht  = wInfo.aandachtspunten.map(a => `<li class="rep-bullet-item">${a}</li>`).join('');

  // ── Vervoersmiddelen ─────────────────────────────────────────────────────────
  const vervoerRegels = [];
  if (profile.hasCar || profile.hasMotorcycle) {
    const v = (profile.hasCar && profile.hasMotorcycle) ? 'auto en motor'
            : profile.hasCar ? 'auto' : 'motor';
    vervoerRegels.push(`Een ${v} vergroot de mobiliteit bij een crisis aanzienlijk. Motorvoertuigen kunnen bovendien worden gebruikt om een telefoon of ander apparaat op te laden via de USB-aansluiting, en bieden via de radio in het voertuig toegang tot nieuws en noodinformatie bij stroomuitval.`);
  }
  if (profile.hasBike) {
    vervoerRegels.push('Een fiets biedt ook bij uitgevallen openbaar vervoer een betrouwbare manier van verplaatsen, onafhankelijk van brandstof of elektriciteit.');
  }
  if (profile.hasScooter || profile.hasEbike) {
    const sv = (profile.hasScooter && profile.hasEbike) ? 'een scooter en een e-bike'
             : profile.hasScooter ? 'een scooter' : 'een e-bike';
    vervoerRegels.push(`${sv.charAt(0).toUpperCase() + sv.slice(1)} biedt extra mobiliteit voor kortere en middellange afstanden. Let op dat dit voertuig afhankelijk is van een opgeladen accu en bij een langdurige stroomuitval niet herladen kan worden.`);
  }
  if (!profile.hasCar && !profile.hasMotorcycle && !profile.hasBike && !profile.hasScooter && !profile.hasEbike) {
    vervoerRegels.push('Je hebt geen privévoertuig opgegeven. Bij uitval van het openbaar vervoer ben je aangewezen op lopen of hulp van anderen om je te verplaatsen.');
  }
  const vervoerHtml = vervoerRegels.map(r => `<p class="rep-body-text">${r}</p>`).join('');

  document.getElementById('rep-s2').innerHTML = `
    <div class="rep-section-header-wrap">
      <span class="rep-section-nr">2</span>
      <span class="rep-section-heading">Jouw thuissituatie</span>
    </div>

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
      <div class="rep-subsection-title">Omgeving</div>
      <div class="rep-kv-blok">
        <div class="rep-kv"><span class="rep-kv-label">Omgevingstype</span><span class="rep-kv-waarde">${alleLocaties}</span></div>
      </div>
      ${omgevingHtml}
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Vervoersmiddelen</div>
      ${vervoerHtml}
    </div>`;
}

// ─── SECTIE 3: VOORBEREIDING ──────────────────────────────────────────────────

function renderSectie3() {
  // IN HUIS
  const noodpakketHtml = [
    checkItem(profile.hasKit,      'Noodpakket aanwezig'),
    checkItem(profile.hasWater,    'Water — minimaal 6 liter per persoon', true),
    checkItem(profile.hasFood,     'Houdbaar eten voor minimaal 3 dagen', true),
    checkItem(profile.hasFirstAid, 'EHBO-doos', true),
    checkItem(profile.hasRadio,    'Radio op batterijen', true),
    profile.hasPets ? checkItem(profile.hasPetFood, 'Dierenvoer voor minimaal 3 dagen', true) : ''
  ].join('');

  const vluchttasHtml = [
    checkItem(profile.hasBOBBag,    'Vluchttas / Bug Out Bag'),
    checkItem(profile.hasFlashlight,'Zaklamp', true),
    checkItem(profile.hasCash,      'Contant geld', true),
    checkItem(profile.hasDocuments, 'Kopieën van documenten + telefoonnummers', true),
    profile.hasMeds !== 'nvt' ? checkItem(profile.hasMeds, 'Medicijnen', true) : '',
    checkItem(profile.hasBOBWater,  'Fles water', true)
  ].join('');

  const persoonlijkHtml = [
    checkItem(profile.hasGasStove,  'Gasfornuis, gasbrander of barbecue'),
    checkItem(profile.hasPowerbank, 'Powerbank')
  ].join('');

  // BIJ JE
  const edcHtml = [
    checkItem(profile.hasEDCReady,   'Reistas / Everyday Carry'),
    checkItem(profile.hasEDCCash,    'Contant geld', true),
    checkItem(profile.hasEDCSnacks,  'Snacks', true),
    checkItem(profile.hasEDCCharger, 'Oplader', true),
    checkItem(profile.hasEDCWater,   'Waterfles', true),
    checkItem(profile.hasEDCKnife,   'Zakmes', true)
  ].join('');

  document.getElementById('rep-s3').innerHTML = `
    <div class="rep-section-header-wrap">
      <span class="rep-section-nr">3</span>
      <span class="rep-section-heading">Jouw voorbereiding</span>
    </div>

    <div class="rep-subsection">
      <div class="rep-check-row">
        <span class="rep-check-icon rep-check-ja">✓</span>
        <span class="rep-check-label"><b>Scenariotraining doorlopen</b></span>
      </div>
      ${checkItem(profile.hasNoodplan, '<b>Persoonlijk noodplan gemaakt</b>')}
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">In huis</div>
      <div class="rep-inhuis-cols">
        <div class="rep-inhuis-col">
          <div class="rep-check-section">Noodpakket</div>
          ${noodpakketHtml}
        </div>
        <div class="rep-inhuis-col">
          <div class="rep-check-section">Vluchttas</div>
          ${vluchttasHtml}
        </div>
        <div class="rep-inhuis-col">
          <div class="rep-check-section">Overig</div>
          ${persoonlijkHtml}
        </div>
      </div>
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Bij je</div>
      ${edcHtml}
    </div>

    <p class="rep-body-text rep-inhuis-disclaimer">De juiste samenstelling van een noodpakket, vluchttas en reistas is afhankelijk van de persoonlijke situatie en voorkeuren.</p>`;
}

// ─── SECTIE 4: TIPS ───────────────────────────────────────────────────────────

function renderSectie4(naam) {
  const nNaam = naam ? `${naam}, k` : 'K';

  document.getElementById('rep-s4').innerHTML = `
    <div class="rep-section-header-wrap">
      <span class="rep-section-nr">4</span>
      <span class="rep-section-heading">Tips</span>
    </div>
    <div class="rep-subsection">
      <ul class="rep-bullet-list">
        <li class="rep-bullet-item">Kijk naar je persoonlijke voorbereiding en vul waar nodig de ontbrekende onderdelen aan. Download de checklist om een gepersonaliseerd noodpakket te kunnen maken.</li>
        <li class="rep-bullet-item">Ga het gesprek aan met je buren en werk samen waar mogelijk. Weten wie er in je straat woont, wie kwetsbaar is en wie hulp kan bieden, maakt een buurt weerbaarder. Onderlinge samenwerking is in een crisis vaak sneller en effectiever dan wachten op officiële hulp.</li>
        <li class="rep-bullet-item">Kijk waar de belangrijke punten in jouw gemeente zijn: noodopvanglocaties, gemeentelijke informatiepunten en evacuatieroutes. Deze zijn vaak niet vooraf bekend; locaties zoals bibliotheken, buurthuizen en sporthallen worden dan regelmatig aangewezen.</li>
        <li class="rep-bullet-item">Voorbereiden is altijd persoonlijk: wat goed is, hangt af van jouw eigen situatie. Ook tijdens een crisis moeten keuzes steeds worden afgewogen op wat op dat moment het beste past.</li>
      </ul>
    </div>
    <div class="rep-divider"></div>
    <div class="rep-subsection">
      <ul class="rep-bullet-list">
        <li class="rep-bullet-item">Het doorlopen van fictieve crisisscenario’s helpt je om je reactie onder druk te begrijpen, blinde vlekken in je voorbereiding te ontdekken en beter te leren handelen in een echte crisissituatie.</li>
        <li class="rep-bullet-item">Herhaald oefenen met verschillende scenario’s versterkt de voorbereiding. Elk scenario stelt je voor andere dilemma’s en onthult andere tekortkomingen.</li>
        <li class="rep-bullet-item">Het samen doorlopen van een crisisscenario met gezinsleden helpt om rollen, kennis en verwachtingen op elkaar af te stemmen en versterkt de samenwerking en besluitvorming tijdens een echte noodsituatie.</li>
      </ul>
    </div>`;
}

// ─── SHOWREPORT ────────────────────────────────────────────────────────────────

function showReport() {
  document.getElementById('sc-prog').style.transform = 'scaleX(1)';
  show('s-report');

  const naam = profile.playerName || '';
  document.getElementById('rep-title').textContent = naam
    ? `Rapport \u2013 ${naam}`
    : 'Rapport \u2013 Goed Voorbereid';

  const prepScore = prepScoreBerekenen();
  const persons = profile.members || (adultsCount + childrenCount + slechtTerBeenCount + ouderenCount);

  renderSectie1(naam, prepScore);
  renderSectie2(persons);
  renderSectie3();
  renderSectie4(naam);

  // Lege secties 5 en 6 verbergen
  document.getElementById('rep-s5').innerHTML = '';
  document.getElementById('rep-s5').style.display = 'none';
  document.getElementById('rep-s6').innerHTML = '';
  document.getElementById('rep-s6').style.display = 'none';

  const secties = ['rep-s1', 'rep-s2', 'rep-s3', 'rep-s4'];
  secties.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.animation = `contentFade 280ms var(--ease-out) ${200 + i * 100}ms both`;
    }
  });
}
