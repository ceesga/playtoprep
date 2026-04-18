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
  let niveau, niveauClass, duiding;
  if (prepScore >= 0.67) {
    niveau = 'Goed voorbereid';
    niveauClass = 'rep-niveau-goed';
    duiding = 'De meeste essentiële onderdelen van een noodvoorbereiding zijn aanwezig. Dat is een solide basis die in een echte noodsituatie direct van waarde is.';
  } else if (prepScore >= 0.33) {
    niveau = 'Matig voorbereid';
    niveauClass = 'rep-niveau-matig';
    duiding = 'Een deel van de voorbereiding is op orde, maar er ontbreken nog belangrijke onderdelen. Gerichte aanvullingen vergroten de weerbaarheid aanzienlijk.';
  } else {
    niveau = 'Beperkt voorbereid';
    niveauClass = 'rep-niveau-beperkt';
    duiding = 'De voorbereiding is beperkt. Dit rapport brengt in kaart welke stappen het meeste verschil maken bij een volgende noodsituatie.';
  }

  document.getElementById('rep-s1').innerHTML = `
    <div class="rep-section-nr">1</div>
    <div class="rep-section-heading">Score</div>
    <div class="rep-subsection">
      <span class="rep-niveau-badge ${niveauClass}">${niveau}</span>
      <p class="rep-body-text">${duiding} De score is gebaseerd op de voorbereiding die je hebt opgegeven: noodpakket, vluchttas, persoonlijk noodplan, batterijradio, contant geld en powerbank.</p>
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
      voordelen: ['Een hogere verdieping is meestal beter beschermd tegen water op straat of in de wijk.', 'Aaneengesloten bebouwing houdt warmte vaak iets beter vast dan een vrijstaande woning.', 'Buren wonen dichtbij, waardoor onderlinge hulp en snelle informatie-uitwisseling makkelijker kunnen zijn.'],
      aandachtspunten: ['Bij stroomuitval vallen lift, intercom en soms ook ventilatie of toegangsdeuren uit.', 'Waterdruk en drinkwatervoorziening kunnen sneller onder druk komen te staan als pompen of installaties uitvallen.', 'Trappenhuizen maken evacuatie en dagelijkse beweging zwaarder voor ouderen, jonge kinderen of beperkt mobiele bewoners.', 'Je bent deels afhankelijk van wat de VvE of beheerder regelt rond toegang, verlichting en gezamenlijke ruimtes.']
    },
    'laagbouw': {
      toelichting: 'Een appartement of woning op de begane grond of lage verdieping, vaak met relatief korte looproutes naar buiten.',
      voordelen: ['De woning is meestal snel te verlaten als je moet schuilen of evacueren.', 'De toegankelijkheid is vaak gunstiger voor kinderen, ouderen en mensen die minder mobiel zijn.', 'Contact met straat, galerij of binnenterrein maakt het makkelijker om zicht te houden op wat er in de buurt gebeurt.'],
      aandachtspunten: ['Wateroverlast of terugstromend riool bereikt lage verdiepingen doorgaans als eerste.', 'Ramen en deuren op straatniveau vragen extra aandacht bij onrust of langdurige uitval van verlichting en beveiliging.', 'Je blijft vaak afhankelijk van gedeelde installaties, zoals portiekverlichting, centrale deuren of pompen.', 'Opslagruimte voor noodvoorraad is in appartementen vaak beperkter dan in grondgebonden woningen.']
    },
    'rijwoning': {
      toelichting: 'Een grondgebonden woning die direct grenst aan andere woningen, vaak met meerdere verdiepingen en een kleine buitenruimte.',
      voordelen: ['Een eigen voordeur en vaak ook een tuin, schuur of zolder geven flexibiliteit voor opslag en noodmaatregelen.', 'De gedeelde muren met buren beperken warmteverlies meestal meer dan bij een vrijstaande woning.', 'Buren zitten dichtbij, waardoor praktische hulp en afstemming vaak snel te organiseren zijn.', 'Extra verdiepingen geven ruimte om spullen hoger en droger op te slaan als beneden problemen ontstaan.'],
      aandachtspunten: ['De begane grond blijft kwetsbaar voor water, rook of rookschade vanuit de straat of aangrenzende bebouwing.', 'Trappen en meerdere kamers vragen extra overzicht, zeker als je snel moet handelen of kwetsbare bewoners hebt.', 'Meer leefoppervlak betekent ook meer water, voedsel, licht en warmte om op peil te houden tijdens een langere verstoring.', 'In een dichte woonrij kan brand, rook of paniek in de straat sneller invloed hebben op meerdere huizen tegelijk.']
    },
    'vrijstaande-woning': {
      toelichting: 'Een woning met eigen grond rondom het huis, vaak met meer buitenruimte, bijgebouwen of mogelijkheden voor eigen voorzieningen.',
      voordelen: ['Er is meestal meer ruimte voor noodvoorraad, wateropvang, een aggregaat of andere eigen oplossingen.', 'Meerdere zijden van het huis blijven vaak bereikbaar, wat helpt bij verplaatsen, laden of evacueren.', 'Je hebt doorgaans minder directe hinder van gedeelde portieken, liften of collectieve installaties.', 'Tuin, schuur of oprit bieden extra praktische ruimte voor tijdelijke opvang, opslag of herstelwerk.'],
      aandachtspunten: ['Het grotere volume kost meer tijd en energie om warm, veilig en leefbaar te houden tijdens uitval.', 'Vrijstaande woningen vangen vaak meer wind, neerslag en stormschade op doordat alle gevels blootstaan.', 'Als de woning buiten een kern ligt, kunnen hulpdiensten, winkels of burenhulp minder snel beschikbaar zijn.', 'Meer terrein en bijgebouwen betekent ook meer plekken die je moet controleren op schade, lekkage of onveilige situaties.']
    },
    'overige': {
      toelichting: 'Een bijzondere woonvorm met specifieke technische en praktische eigenschappen die per subtype sterk kunnen verschillen.',
      voordelen: ['De woonruimte is vaak compact en daardoor overzichtelijker te beheren in een acute situatie.', 'Bewoners van dit soort woonvormen denken vaak al bewuster na over water, energie en ruimtegebruik.'],
      aandachtspunten: ['Opslagruimte voor noodvoorraad en reserveonderdelen is vaak beperkt.', 'De veiligheid hangt sterker af van de technische staat van de woonvorm en van tijdig onderhoud.', 'Een kleine storing in verwarming, water of elektra heeft vaak sneller direct effect op het dagelijks functioneren.']
    }
  };
  const woningSubTypeInfo = {
    'caravan': {
      toelichting: 'Een lichte, verplaatsbare woonvorm met beperkte isolatie en meestal weinig opslagruimte.',
      voordelen: ['Een caravan is overzichtelijk en snel te controleren op losse spullen of risico\'s.', 'Als hij rijklaar is en de situatie het toelaat, is verplaatsen soms een extra uitwijkoptie.', 'Kleine ruimtes zijn met weinig middelen kortdurend te verwarmen, zolang ventilatie en brandveiligheid op orde blijven.'],
      aandachtspunten: ['Isolatie en stormvastheid zijn meestal beperkter, waardoor kou, hitte en harde wind sneller binnen merkbaar zijn.', 'Je hebt weinig reserve voor water, voedsel, accu\'s en brandstof.', 'Gas, elektra en kooktoestellen zitten compact op elkaar, waardoor brandveiligheid extra aandacht vraagt.', 'Niet elke caravanlocatie is even goed bereikbaar of geschikt voor snelle evacuatie met meerdere personen.']
    },
    'tiny_house': {
      toelichting: 'Een zeer compacte woning waarin ruimte, opslag en techniek efficient zijn ingericht, maar waarin weinig marge zit.',
      voordelen: ['Door het kleine volume blijft het overzicht goed en is een noodvoorraad snel te controleren.', 'Veel tiny houses zijn bewust ontworpen op zuinig energie- en watergebruik.', 'Met beperkte middelen kun je een kleine ruimte vaak sneller op temperatuur krijgen dan een groot huis.'],
      aandachtspunten: ['De opslagcapaciteit voor water, voedsel en reserveonderdelen blijft beperkt.', 'Als verwarming, ventilatie of sanitair uitvalt, merk je dat direct in het hele huis.', 'Tiny houses staan geregeld op locaties die meer blootstaan aan wind, hitte of koude dan een standaard woonwijk.', 'Loften, trappen of compacte doorgangen kunnen evacuatie minder makkelijk maken voor kinderen of beperkt mobiele bewoners.']
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
    'water':      'Je woont in de buurt van open water. Die ligging brengt specifieke kenmerken met zich mee: waterstanden, dijken, kades en gemalen spelen een rol in de directe leefomgeving. Risicofactoren zijn verhoogde kans op wateroverlast, het onbruikbaar worden van routes bij stijgend water en verstoring van pompen en gemalen bij stroomuitval.',
    'forest':     'Je woont in of nabij bos of natuur. Die omgeving is ruimer dan stedelijk gebied, maar legt ook eigen eisen op aan voorbereiding. Risicofactoren zijn grotere gevoeligheid voor natuurbrand en rook, slecht bereikbare wegen bij extreem weer en langere aanrijtijden voor hulpdiensten.',
    'rural_area': 'Je woont in het buitengebied. Voorzieningen als winkels, zorg en hulpdiensten liggen op grotere afstand dan in stedelijk gebied. Risicofactoren zijn afhankelijkheid van eigen vervoer, langere aanrijtijden voor hulpdiensten en grotere kwetsbaarheid bij uitval van lokale infrastructuur.',
    'city':       'Je woont in de bebouwde kom. Voorzieningen zijn dichtbij, maar bij een crisis reageren veel mensen tegelijk op dezelfde locaties. Risicofactoren zijn snelle uitputting van basisproducten, overbelasting van verkeer en communicatienetwerken en de afhankelijkheid van collectieve systemen als openbaar vervoer en gedeelde energie-infrastructuur.'
  };
  const locaties = (profile.location || []).filter(l => envLabels[l]);
  const alleLocaties = locaties.map(l => envLabels[l]).join(', ') || 'Niet opgegeven';
  const omgevingHtml = locaties.length
    ? locaties.map(l => `<p class="rep-body-text"><b>${envLabels[l]}.</b> ${envProse[l]}</p>`).join('')
    : '<p class="rep-body-text">Geen omgeving opgegeven.</p>';

  // ── Gezinssamenstelling ──────────────────────────────────────────────────────
  const huishoudKvs = [
    { label: 'Aantal personen', waarde: persons },
    { label: 'Volwassenen',     waarde: adultsCount },
    { label: 'Ouderen',         waarde: profile.ouderenCount || 0 },
    { label: 'Jonge kinderen',  waarde: childrenCount },
    { label: 'Beperkt mobiel',  waarde: slechtTerBeenCount },
    { label: 'Huisdieren',      waarde: profile.hasPets ? (petsCount || 1) : 'Nee' }
  ];
  let gezinsToel = `Een huishouden van ${persons} ${persons === 1 ? 'persoon' : 'personen'}.`;
  const kwetsbaar = [];
  if (profile.hasChildren)       kwetsbaar.push('jonge kinderen');
  if (profile.hasElderly)        kwetsbaar.push('ouderen');
  if (profile.hasMobilityImpaired || slechtTerBeenCount > 0) kwetsbaar.push('beperkt mobiele bewoners');
  if (kwetsbaar.length) gezinsToel += ` Het huishouden bevat kwetsbare groepen: ${kwetsbaar.join(', ')}.`;
  if (profile.hasPets) gezinsToel += ' Er zijn huisdieren aanwezig.';

  const gezinsAandacht = [];
  if (profile.hasChildren)       gezinsAandacht.push('Kinderen hebben extra structuur, warmte en uitleg nodig in een crisis.');
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
    <div class="rep-section-nr">2</div>
    <div class="rep-section-heading">Jouw thuissituatie</div>

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
    <div class="rep-section-nr">3</div>
    <div class="rep-section-heading">Jouw voorbereiding</div>

    <div class="rep-subsection">
      <div class="rep-check-row">
        <span class="rep-check-icon rep-check-ja">✓</span>
        <span class="rep-check-label"><b>Training doorlopen</b></span>
      </div>
      ${checkItem(profile.hasNoodplan, '<b>Persoonlijk noodplan</b> (communicatieplan, evacuatieplan, gezin weet wat te doen)')}
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">In huis</div>
      <div class="rep-check-section">Noodpakket</div>
      ${noodpakketHtml}
      <div class="rep-check-section">Vluchttas</div>
      ${vluchttasHtml}
      <div class="rep-check-section">Overig</div>
      ${persoonlijkHtml}
    </div>

    <div class="rep-divider"></div>

    <div class="rep-subsection">
      <div class="rep-subsection-title">Bij je</div>
      ${edcHtml}
    </div>`;
}

// ─── SECTIE 4: TIPS ───────────────────────────────────────────────────────────

function renderSectie4(naam) {
  const nNaam = naam ? `${naam}, k` : 'K';

  document.getElementById('rep-s4').innerHTML = `
    <div class="rep-section-nr">4</div>
    <div class="rep-section-heading">Tips</div>
    <div class="rep-subsection">
      <p class="rep-body-text">${nNaam}ijk naar je individuele situatie en verbeter waar nodig de ontbrekende onderdelen. De checklist in sectie 3 laat precies zien wat al aanwezig is en wat nog ontbreekt. Begin bij de meest kritieke onderdelen en werk van daaruit verder.</p>
      <p class="rep-body-text">Ga het gesprek aan met je buren en werk samen waar mogelijk. Weten wie er in je straat woont, wie kwetsbaar is en wie hulp kan bieden, maakt een buurt weerbaarder. Onderlinge samenwerking is in een crisis vaak sneller en effectiever dan wachten op officiële hulp.</p>
      <p class="rep-body-text">Kijk ook waar de belangrijke punten in jouw gemeente zijn: noodopvanglocaties, wateruitdeelplaatsen, gemeentelijke informatiepunten en evacuatieroutes. Die informatie is vooraf makkelijk op te zoeken en kan op het moment zelf veel tijd en stress besparen.</p>
      <p class="rep-body-text">Controleer tot slot of er nog essentiële voorbereidingsonderdelen ontbreken die specifiek voor jouw situatie belangrijk zijn, zoals extra medicijnen, noodvoer voor huisdieren of specifieke hulpmiddelen voor mensen met een beperking in het huishouden.</p>
    </div>
    <div class="rep-divider"></div>
    <div class="rep-subsection">
      <p class="rep-body-text">Het doorlopen van fictieve crisisscenario's zoals deze training is een waardevolle manier om te ontdekken hoe je reageert onder druk en waar de blinde vlekken zitten. Veel kennis over noodvoorbereiding blijft abstract totdat je er daadwerkelijk mee aan de slag gaat.</p>
      <p class="rep-body-text">Herhaald oefenen met verschillende scenario's — van stroomstoring en overstroming tot brand en drinkwaterproblemen — versterkt de voorbereiding stap voor stap. Elk scenario stelt andere eisen en onthult andere tekortkomingen. Ga het gesprek aan met je buren en doe dit samen. Gezamenlijk oefenen vergroot de effectiviteit: je leert elkaars kennis en middelen kennen, en je bouwt het vertrouwen op dat nodig is om ook in een echte noodsituatie samen te handelen.</p>
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
  const persons = adultsCount + childrenCount + slechtTerBeenCount;

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
