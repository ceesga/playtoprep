// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Scenario: Overstroming — "Het water staat hoog"
// 26 scenes — van ov_0 (avond, hoog water) tot ov_8 (thuiskomst)
// Tijdspanne: ~18 uur
// ═══════════════════════════════════════════════════════════════

// ─── OVERSTROMING SCENARIO ────────────────────────────────────────────────────
const FLOOD_CHILD_CRISIS_SOURCE = {
  text: 'VN/UNODC: begeleid kinderen in een crisis met rust, nabijheid en uitleg op hun niveau',
  url: 'https://www.unodc.org/res/drug-prevention-and-treatment/publications/data/drug-abuse-treatment-and-rehabilitation_caring-for-your-child-in-crisis-situations_html/UN-Caring-for-child-in-Crisis-Situations-booklet-200929-DIGITAL.pdf'
};

const scenes_overstroming = [{
  id: 'ov_0',
  time: '20:00',
  date: 'Maandag 8 november 2027',
  dayBadge: 'Dag 0',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '19:30',
      headline: 'KNMI: code oranje — aanhoudende regen en hogere waterstand verwacht',
      body: 'Door aanhoudende regenval en extra aanvoer van water kunnen de waterstanden in de regio morgen oplopen. Het waterschap vraagt bewoners in de buurt van rivieren en laaggelegen gebieden het nieuws goed te volgen.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Heb jij het nieuws gezien? Het zal toch niet zo erg worden?',
      time: '20:05',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: Het KNMI heeft code oranje afgegeven voor de regio. Door aanhoudende regen wordt een verhoogde waterstand verwacht. Bewoners in laaggelegen gebieden wordt gevraagd de situatie te blijven volgen.'
  },
  get narrative() {
    const locatie = profile.location.includes('rural_area')
      ? ' Je woont afgelegen, op loopafstand van het water. Het uitzicht is er mooi en op zonnige dagen kun je er echt van genieten.'
      : profile.location.includes('city')
      ? ' Je woont in de bebouwde kom, op loopafstand van het water. Het uitzicht is er mooi en op zonnige dagen kun je er echt van genieten.'
      : '';
    const kinderen = profile.hasChildren
      ? (profile.childrenCount === 1
        ? ' Je kind ligt al lekker in bed te slapen.'
        : ' De kinderen liggen al lekker in bed te slapen.')
      : '';
    const woning = (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? ' Je woont in een appartementengebouw. Bij hoog water ben je op een hogere verdieping beter beschermd dan bewoners van een grondgebonden woning. Maar ook in een flat kun je de gevolgen merken: de begane grond kan onderlopen en de omgeving buiten komt onder water te staan.'
      : '';
    return 'Het is maandagavond. Buiten regent het gestaag en de grond is al de hele week verzadigd van al het water.' + locatie + woning + kinderen;
  },
  choices: [{
    text: '🛌 Gaan slapen',
    consequence: 'Je legt de telefoon neer en doet het licht uit. Buiten klettert de regen tegen het raam. Morgen zien we wel.',
    cat: 'cat-neutral',
    stateChange: {}
  }]
}, {
  id: 'ov_1',
    _w: 'PTP-NL-©2026-4vH8rZ',
  time: '07:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '06:30',
      headline: 'KNMI waarschuwt: waterpeil stijgt, code oranje van kracht',
      body: 'Het KNMI handhaaft code oranje. Door aanhoudende regen en extra aanvoer van water neemt de waterstand in de regio toe. Het waterschap volgt de situatie op de voet en kan lokale maatregelen nemen.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Code oranje blijft van kracht. De waterstand stijgt. Bewoners in laaggelegen gebieden wordt gevraagd de situatie te volgen en rekening te houden met lokale maatregelen of afsluitingen.'
  },
  get narrative() {
    const gisteren = state.awarenessLevel > 0 ? ' Die code oranje van gisteren zat nog vers in je hoofd.' : '';
    const tasNietKlaar = !state.packedBag ? ' Je had gisteren niets klaargelegd.' : ' Je tas staat klaar. Dat stelt je nu al gerust.';
    const kinderen = profile.hasChildren && state.awarenessLevel === 0
      ? (profile.childrenCount === 1
        ? ' Je kind slaapt nog. Je merkt dat je niet goed weet hoe serieus dit is.'
        : ' De kinderen slapen nog. Je merkt dat je niet goed weet hoe serieus dit is.')
      : '';
    const huisdier = profile.hasPets && !state.tookPets
      ? ' Je huisdier is onrustig en loopt heen en weer te ijsberen.'
      : '';
    const buiten = (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? ' Je kijkt vanuit je raam omlaag: op de stoep begint het water al te staan.'
      : '';
    return 'Je wordt wakker van de regen die hard tegen je raam slaat. Het is dinsdag, vroeg in de ochtend. De regen klinkt heftiger dan normaal.' + gisteren + tasNietKlaar + buiten + kinderen + huisdier;
  },
  choices: [{
    conditionalOn: () => !state.packedBag,
    text: '🎒 Direct beginnen met voorbereiding',
    consequence: 'Je begint alvast: documenten in een waterdichte zak, medicijnen, kleding. Je zet je schoenen bij de deur. Als het bevel komt ben je klaar.',
    source: { text: 'Rijksoverheid: bereid je tijdig voor en pak medicijnen, kleding en essentiële spullen in', url: 'https://www.rijksoverheid.nl/onderwerpen/water/vraag-en-antwoord/wat-moet-ik-doen-bij-een-dreigende-overstroming' },
    stateChange: {
      awarenessLevel: 1,
      packedBag: true
    }
  }, {
    text: '🙈 Afwachten, het regelt zichzelf wel',
    source: { text: 'Denkvooruit: wacht niet af — volg de overstromingswaarschuwingen en handel direct', url: 'https://www.denkvooruit.nl/risicos/risicos-in-nederland/overstroming' },
    consequence: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? 'Je gaat door met je ochtendroutine. Buiten stijgt het water al licht. Je merkt het pas als je vanuit het raam ziet dat de stoep blank staat.'
      : 'Je gaat door met je ochtendroutine. Buiten stijgt het water al licht. Je merkt het pas als je naar de brievenbus loopt en natte voeten krijgt.',
    stateChange: {}
  }, {
    conditionalOn: () => profile.hasPets && !state.tookPets,
    text: () => petsCount > 1 ? '🐾 Transportmanden alvast bij de deur zetten' : '🐾 Transportmand alvast bij de deur zetten',
    consequence: () => petsCount > 1
      ? 'Je zet de transportmanden klaar bij de deur. Als het bevel morgen komt, hoef je de dieren alleen nog erin te zetten en te gaan.'
      : 'Je zet de transportmand klaar bij de deur. Als het bevel komt, hoef je je huisdier alleen nog erin te zetten en te gaan.',
    stateChange: { tookPets: true }
  }]
}, {
  id: 'ov_1b',
  time: '07:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School De Klimop',
      msg: 'Goedemorgen, we volgen het hoge waterpeil. School is vandaag nog open, in overleg met de gemeente. Wel vragen we u om uw kind direct op te halen als de situatie verslechtert. We houden u op de hoogte.',
      time: '07:25',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ? 'Je kind is opgestaan en vraagt of het naar school gaat. Je kijkt buiten. Er staat al wat water op de stoep. De lucht hangt laag en grijs.' : 'De kinderen zijn opgestaan en vragen of ze naar school gaan. Je kijkt buiten. Er staat al wat water op de stoep. De lucht is een grijze deken.';
  },
  choices: [{
    text: '🏫 Toch naar school brengen, school is open',
    consequence: () => profile.childrenCount === 1 ? 'Je brengt je kind naar school. Wel houd je je telefoon de komende uren scherp in de gaten.' : 'Je brengt de kinderen naar school. Wel houd je je telefoon de komende uren scherp in de gaten.',
    stateChange: {
      sentKidsToSchool: true
    }
  }, {
    text: '🏠 Thuis houden uit voorzorg',
    consequence: () => profile.childrenCount === 1 ? 'Je houdt je kind thuis. Zo is je kind bij je als de situatie erger wordt. School begrijpt het.' : 'Je houdt de kinderen thuis. Zo zijn ze bij je als de situatie erger wordt. School begrijpt het.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true
    }
  }, {
    text: '🏠 Thuis houden én even samen doorlopen wat jullie gaan doen',
    consequence: () => profile.childrenCount === 1 ? 'Je houdt je kind thuis en neemt vijf minuten om rustig uit te leggen wat er aan de hand is. Wat jullie gaan doen als het water te hoog wordt. Je kind luistert serieuzer dan je had verwacht.' : 'Je houdt de kinderen thuis. Jullie zitten even aan tafel: wat er aan de hand is, wat jullie gaan doen, wat ze van jou kunnen verwachten. Ze luisteren serieuzer dan je had verwacht.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true,
      kidsNoodpakket: true
    }
  }]
}, {
  id: 'ov_1d',
  time: '08:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsKeptHome === true && !state.kidsNoodpakket,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Je kind loopt achter je aan van kamer naar kamer. Het zegt niets, maar volgt elke beweging. Het water staat al op de stoep. Je moet van alles doen, maar je kind weet niet goed waar het heen moet.' :
      'De kinderen lopen achter je aan van kamer naar kamer. Ze zeggen weinig en volgen elke beweging. Het water staat al op de stoep. Je moet van alles doen, maar zij weten niet goed waar ze heen moeten.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🎒 Je kind een kleine taak geven en een rugzakje laten pakken' : '🎒 De kinderen een kleine taak geven en rugzakjes laten pakken',
    consequence: () => profile.childrenCount === 1 ? 'Je kind gaat meteen aan de slag. Even later staat het trots met een rugzakje: een knuffel, een boek en een pakje kaarten. Het voelt zich nuttig en blijft rustiger.' : 'De kinderen gaan meteen aan de slag. Even later staan ze trots met hun rugzakjes. De een heeft een knuffel en sokken, de ander een boek en een reep chocolade. Ze voelen zich nuttig en blijven rustiger.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      kidsNoodpakket: true
    }
  }, {
    text: () => profile.childrenCount === 1 ? '📺 Je kind achter een scherm zetten zodat jij verder kunt' : '📺 De kinderen achter een scherm zetten zodat jij verder kunt',
    consequence: () => profile.childrenCount === 1 ? 'Je kind gaat zitten en jij werkt door. Toch kijkt het steeds weer op van het scherm. Je merkt dat het de spanning voelt, ook zonder vragen te stellen.' : 'De kinderen gaan zitten en jij werkt door. Toch kijken ze steeds weer op van het scherm. Je merkt dat ze de spanning voelen, ook zonder veel te zeggen.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {}
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Stoppen en rustig uitleggen wat er aan de hand is' : '💬 Stoppen en rustig uitleggen wat er aan de hand is',
    consequence: () => profile.childrenCount === 1 ? '"Er komt veel water. We gaan straks naar een veilige plek. Jij hoeft alleen bij mij te blijven." Je kind knikt. Het weet nu beter wat er gebeurt en dat helpt meteen.' : '"Er komt veel water. We gaan straks naar een veilige plek. Jullie hoeven alleen bij mij te blijven." Ze knikken. Ze weten nu beter wat er gebeurt en dat helpt meteen.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_2',
  time: '09:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '09:15',
      headline: 'Eerste wateroverlast in laaggelegen wijken',
      body: 'In enkele laaggelegen straten staat water. Het waterschap vraagt bewoners hun drempelgebied in de gaten te houden en spullen van de begane grond te halen als voorzorgsmaatregel.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Heb je het gezien? De Molendijk staat al blank. Ik ben bang dat onze straat straks ook aan de beurt is.',
      time: '09:22',
      outgoing: false
    }],
    nlalert: 'NL-Alert\n9 november 2027 – 09:20\n\nHoogwater in uw omgeving. De waterstand stijgt. Let op de situatie. Bereid u voor op mogelijke maatregelen. Houd deuren en ramen gesloten.',
    radio: 'Radio 1: Op enkele plekken in de regio staat water op straat. Gemeenten plaatsen zandzakken en sluiten wegen af waar nodig. Woont u in een laaggelegen gebied, houd de situatie goed in de gaten.'
  },
  get narrative() {
    return (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? 'Vanuit je raam zie je dat de straat nu een paar centimeter blank staat. Verderop leggen gemeentewerkers zandzakken neer. Bewoners op de begane grond dragen kisten naar boven. Jouw woning zit droog, maar de omgeving verandert snel.'
      : 'De straat staat nu een paar centimeter blank. Verderop leggen gemeentewerkers zandzakken neer en een busje van het waterschap zet een deel van de weg af. Buren lopen af en aan met laarzen en kratten.';
  },
  choices: [{
    text: '🪟 Ramen dichten, deuren afdichten en zandzakken neerleggen',
    consequence: 'Je stopt handdoeken onder de deuren, sluit ramen en legt je zandzakken voor de drempel. Dit vertraagt het water, maar houdt het niet tegen. Geeft je extra tijd.',
    stateChange: {
      sealedHome: true
    }
  }, {
    conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
    text: () => profile.hasCar ? '🚗 De auto alvast hoger wegzetten zolang de route nog open is' : '🚗 De motor alvast hoger wegzetten zolang de route nog open is',
    consequence: 'Je rijdt de auto naar een hoger deel van de wijk en loopt terug. Dat kost tijd, maar als evacueren later nodig wordt, ben je je auto niet meteen kwijt.',
    stateChange: {
      carMovedHigher: true,
      awarenessLevel: 1
    }
  }, {
    conditionalOn: () => !profile.hasChildren,
    text: '📱 Buurvrouw Ans laten weten dat het serieus wordt',
    consequence: 'Je appt Ans dat het water snel stijgt en dat ze alert moet zijn. Dat geeft afstemming, maar terwijl jij contact zoekt stijgt het water buiten gewoon door.',
    stateChange: {
      contactedAns: true
    }
  }, {
    conditionalOn: () => profile.hasPets,
    text: () => petsCount > 1 ? '🐾 Huisdieren naar een hogere plek in huis brengen' : '🐾 Huisdier naar een hogere plek in huis brengen',
    consequence: () => petsCount > 1
      ? 'Je brengt de dieren naar boven. Ze zijn onrustig door het geluid van het water buiten. Je haalt ook de transportmanden naar boven voor het geval je snel weg moet.'
      : 'Je brengt je huisdier naar boven. Het is onrustig door het geluid van het water buiten. Je haalt ook de transportmand naar boven voor het geval je snel weg moet.',
    stateChange: { tookPets: true }
  }]
}, {
  id: 'ov_2b',
  time: '09:45',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.sentKidsToSchool === true && !state.evacuatedFlood,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School De Klimop',
      msg: '⚠️ School gaat vandaag om 10:00 dicht vanwege het hoog water. Wij vragen u uw kind zo snel mogelijk op te komen halen. Kinderen die niet opgehaald worden, blijven bij ons tot u er bent.',
      time: '09:42',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ? 'Je telefoon trilt. Buiten stroomt het water over de stoep. Je denkt aan je kind op school.' : 'Je telefoon trilt. Buiten stroomt het water over de stoep. Je denkt aan de kinderen op school.';
  },
  choices: [{
    text: '🚗 Nu direct gaan ophalen',
    consequence: () => profile.childrenCount === 1 ? 'Je rijdt direct naar school. De weg staat al licht blank maar is nog begaanbaar. Je haalt je kind op en het is opgelucht je te zien.' : 'Je rijdt direct naar school. De weg staat al licht blank maar is nog begaanbaar. Je haalt de kinderen op en ze zijn opgelucht je te zien.',
    stateChange: {
      kidsWithYou: true,
      sentKidsToSchool: false
    }
  }, {
    text: () => profile.childrenCount === 1 ? '📱 Iemand anders vragen je kind op te halen' : '📱 Iemand anders vragen de kinderen op te halen',
    consequence: () => state.phoneBattery > 0 ? (profile.childrenCount === 1 ? 'Je belt oma. Zij woont dichtbij en kan direct gaan. Ze haalt je kind op en brengt het naar een veilig adres.' : 'Je belt oma. Zij woont dichtbij en kan direct gaan. Ze haalt de kinderen op en brengt ze naar een veilig adres.') : 'Je telefoon is leeg. Je kunt niemand bellen om op te halen.',
    stateChange: () => state.phoneBattery > 0 ? {
      kidsWithYou: false
    } : {}
  }, {
    text: '⏳ Even wachten en straks tegelijk ophalen en spullen pakken',
    consequence: 'Je wacht een kwartier. Als je rijdt, staat de weg al half blank. Je komt er nog, maar het was spannend.',
    stateChange: {
      kidsWithYou: true,
      sentKidsToSchool: false
    }
  }]
}, {
  id: 'ov_2c',
  time: '10:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsKeptHome === true && !state.evacuatedFlood,
  channels: {
    news: [],
    whatsapp: [{
      from: 'Buurvrouw Petra',
      msg: 'Wij gaan zo weg. Mijn dochter wilde nog snel haar knuffel halen, maar we hebben haar net tegengehouden. Zijn jullie al klaar om te gaan?',
      time: '09:55',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ? 'Terwijl jij bezig bent met voorbereiden, volgt je kind je van kamer naar kamer. Nu staat het water hoog op straat en wordt het echt spannend. Opeens wil het terugrennen naar de slaapkamer om zijn knuffel te halen. Daarna blijft het stil bij het raam staan en reageert het nergens meer op.' : 'Terwijl jij bezig bent met voorbereiden, volgen de kinderen je van kamer naar kamer. Nu staat het water hoog op straat en wordt het echt spannend. Opeens wil de jongste terugrennen naar de slaapkamer om haar knuffel te halen, omdat die anders alleen is. De oudste blijft stil bij het raam staan en reageert nergens meer op.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🛑 Je kind tegenhouden en uitleggen waarom het niet terug mag' : '🛑 De jongste tegenhouden en uitleggen waarom ze niet terug mag',
    consequence: () => profile.childrenCount === 1 ? 'Je legt rustig uit: "We gaan zo samen weg, maar jij mag nu niet alleen terug." Je kind protesteert, maar na twee minuten geeft het toe. Het blijft wel onrustig.' : 'Je legt rustig uit: "We gaan zo samen weg, maar jij mag nu niet alleen terug." Ze protesteert, maar na twee minuten geeft ze toe. Ze blijft wel onrustig.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: -1
    }
  }, {
    conditionalOn: () => profile.childrenCount > 1,
    text: '🛑🗣️ Beide kinderen aanpakken: jongste tegenhouden én oudste aanspreken',
    consequence: 'Je houdt de jongste stevig vast en legt uit waarom ze niet terug mag. Dan kniel je naast de oudste: "Wat zie je?" vraag je. "Komt ons huis vol water?" vraagt hij. Je legt het uit. Langzaam komen allebei tot rust.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: -1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Je kind aanspreken dat verstijfd bij het raam staat' : '💬 De oudste aanspreken die verstijfd bij het raam staat',
    consequence: () => profile.childrenCount === 1 ? 'Je knielt naast je kind en vraagt wat het ziet. "Komt ons huis vol water?" vraagt het. Je legt uit wat er gebeurt. Langzaam komt er weer beweging in.' : 'Je knielt naast hem en vraagt wat hij ziet. "Komt ons huis vol water?" vraagt hij. Je legt uit wat er gebeurt. Langzaam komt er weer beweging in.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      phoneBattery: -5
    }
  }, ]
}, {
  id: 'ov_3',
  time: '10:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => !state.evacuatedFlood,
  channels: {
    news: [{
      time: '10:20',
      headline: 'Evacuatieadvies voor laaggelegen wijken',
      body: 'De burgemeester heeft een evacuatieadvies afgegeven voor laaggelegen wijken. Bewoners wordt dringend geadviseerd nu te vertrekken zolang de route nog veilig is. Kan dat niet meer, ga dan naar de bovenste verdieping.'
    }],
    get whatsapp() {
      return (state.contactedAns && !profile.hasChildren) ? [{
        from: 'Ans',
        msg: 'Ben je al aan het inpakken? Ik hoor buiten sirenes. Ik heb geen auto, ik weet niet wat ik moet doen 😟',
        time: '10:18',
        outgoing: false
      }] : [];
    },
    nlalert: 'NL-Alert\n9 november 2027 – 10:22\n\nEVACUATIEADVIES voor laaggelegen wijken. Vertrek nu als de route nog veilig is, of ga naar de bovenste verdieping. Gebruik aangewezen evacuatieroutes.',
    radio: 'Radio 1: Evacuatieadvies voor laaggelegen wijken. Ga nu weg als de route nog open is. Kan dat niet meer, ga dan naar boven. Alleen als de vloer nog droog is: haal stekkers eruit en schakel de stroom uit. Bel 112 alleen in levensbedreigende situaties.'
  },
  get narrative() {
    const tas = !state.packedBag
      ? ' Je hebt niets klaargelegd. Je moet nu alles tegelijk: pakken én gaan.'
      : ' Je tas staat klaar bij de deur. Dat scheelt nu veel tijd.';
    const heeftMotorVov = profile.hasCar || profile.hasMotorcycle;
    const heeftFietsVov = profile.hasBike || profile.hasScooter || profile.hasEbike;
    const fietsnaamOv   = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
    const geenAuto = !heeftMotorVov
      ? heeftFietsVov
        ? ` Je hebt geen auto, maar wel een ${fietsnaamOv}. Als je weg wilt, ga je op de ${fietsnaamOv}.`
        : ' Je hebt geen auto en geen fiets. Weggaan betekent te voet door het water.'
      : '';
    const mobiliteit = profile.playerIsMobilityImpaired
      ? ' Jij bent beperkt mobiel. Te voet waden is voor jou geen optie. Je moet hulp regelen of boven blijven.'
      : profile.playerIsElderly
      ? ' Op jouw leeftijd is waden door hoog water te gevaarlijk. Je opties zijn beperkt. Elke minuut telt.'
      : '';
    const bovenTekst = (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? ' ga nu weg als dat nog kan, of ga naar een hogere verdieping in het gebouw.'
      : ' ga nu weg als dat nog kan, of ga naar boven.';
    return 'Het water staat nu tientallen centimeters hoog in de straat. Er klinkt een NL-Alert. Binnen is de vloer nog droog, maar dat kantelpunt komt snel dichterbij. Het evacuatieadvies is duidelijk:' + bovenTekst + tas + geenAuto + mobiliteit + ' Wat doe je?';
  },
  choices: [{
    conditionalOn: () => !state.cutElectricity,
    text: '🔌 Haal stekkers uit het stopcontact en schakel de stroom uit',
    consequence: 'Omdat de vloer binnen nog droog is, trek je snel de stekkers uit het stopcontact en zet je de hoofdschakelaar uit. Daarna moet je direct beslissen: nu weg zolang het nog kan, of meteen naar boven. Zodra er water op de vloer staat, blijf je weg van elektra.',
    source: { text: 'VNOG: verlaat jij je huis? Sluit gas, water en elektriciteit af. Haal stekkers uit het stopcontact.', url: 'https://www.vnog.nl/risicos/overstroming/woning?tab_1=2' },
    stateChange: {
      cutElectricity: true,
      delayedEvacuation: true
    }
  }, {
    conditionalOn: () => !profile.playerIsMobilityImpaired,
    text: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? '🏠 In het gebouw blijven en naar een hogere verdieping gaan'
      : '🏠 Boven blijven en naar de eerste verdieping gaan',
    consequence: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? 'Je gaat naar een hogere verdieping in het gebouw. Je neemt water, eten en je telefoon mee. Op straat stijgt het water verder, maar jij zit droog.'
      : 'Je klimt naar boven. Je neemt water, eten en je telefoon mee. Beneden stijgt het water verder.',
    stateChange: {
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => state.contactedAns && !profile.hasChildren,
    text: '📞 Ans vragen naar jou toe te komen en samen boven te blijven',
    consequence: 'Je appt Ans: "Kom nu, de straat is nog wadbaar." Tien minuten later staat ze voor de deur, kletsnat maar opgelucht. Samen ga je naar boven.',
    stateChange: {
      takingAns: true,
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
    text: () => profile.hasCar ? '🚗 Toch proberen weg te rijden' : '🚗 Toch proberen weg te rijden op de motor',
    consequence: () => {
      const v = profile.hasCar ? 'auto' : 'motor';
      return state.carMovedHigher
        ? `Je ${v} stond al hoger geparkeerd. Daardoor kom je nu nog weg via de omleiding. Je rijdt langzaam maar gestaag naar een droog deel van de stad.`
        : profile.hasCar
          ? `Je stapt in de auto. Het water staat al bijna aan de drempel. Rijden in 30 cm water is gevaarlijk, want auto's kunnen bij 60 cm al gaan drijven. Je rijdt voorzichtig, maar komt na 100 meter vast te staan.`
          : `Je stapt op de motor. Het water staat al hoog. Een motor kan door ondiep water rijden, maar de kans dat de motor uitvalt is groot. Na 50 meter sputtert de motor en kom je vast te staan.`;
    },
    stateChange: () => state.carMovedHigher ? {
      evacuatedFlood: true
    } : {
      wentUpstairs: false,
      evacuatedFlood: false
    }
  }, {
    conditionalOn: () => !(profile.hasCar || profile.hasMotorcycle) && !profile.playerIsMobilityImpaired,
    text: '🚶 Te voet wegwaden nu het nog kan',
    consequence: () => {
      const heeftFietsOv = profile.hasBike || profile.hasScooter || profile.hasEbike;
      const naamFietsOv  = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
      return heeftFietsOv
        ? `Je pakt je ${naamFietsOv} en rijdt langzaam door het water. Het staat al tot je knieën, maar de ${naamFietsOv} houdt je overeind. Via de omweg bereik je een droog stuk weg.`
        : 'Je trekt laarzen aan en waadt naar buiten. Het water staat bijna tot je knieën. Het is zwaar en koud, maar je werkt je door de straat heen en bereikt een droog stuk weg verderop.';
    },
    stateChange: {
      evacuatedFlood: true,
      comfort: -2,
      health: -1
    }
  }, {
    conditionalOn: () => profile.playerIsMobilityImpaired,
    text: '🆘 Hulp vragen om naar een hogere verdieping te komen',
    consequence: 'Je belt aan bij de buren en vraagt hulp. Met twee mensen lukt het om naar boven te komen. Het kost kostbare tijd. Het water staat al in de gang.',
    stateChange: {
      health: -1,
      comfort: -1,
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => profile.hasPets && !state.tookPets,
    text: () => petsCount > 1 ? '🐾 Huisdieren veiligstellen voor je vertrekt' : '🐾 Huisdier veiligstellen voor je vertrekt',
    consequence: () => petsCount > 1
      ? 'Je pakt de manden en roept de dieren. Ze zijn bang van het water en werken niet mee. Na een paar minuten heb je ze. Je vertrekt samen — maar kostbare tijd ben je kwijt.'
      : 'Je pakt de transportmand en roept je huisdier. Het is bang en wil niet mee. Na anderhalve minuut heb je het. Je vertrekt samen — maar kostbare tijd ben je kwijt.',
    stateChange: { tookPets: true, comfort: -1 }
  }]
}, {
  id: 'ov_3a',
  time: '10:33',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.delayedEvacuation === true && !state.evacuatedFlood && state.wentUpstairs === null,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Water op de vloer? Blijf uit de buurt van elektra. Is de vloer nog droog en moet je weg? Dan kun je nog snel de stroom uitschakelen en stekkers eruit halen, maar wacht niet te lang met evacueren.'
  },
  get narrative() {
    const tas = !state.packedBag
      ? ' Je hebt nog steeds niets klaargelegd. Elke extra seconde telt nu.'
      : ' Je tas staat klaar bij de deur.';
    const heeftMotorVov = profile.hasCar || profile.hasMotorcycle;
    const heeftFietsVov = profile.hasBike || profile.hasScooter || profile.hasEbike;
    const fietsnaamOv   = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
    const geenAuto = !heeftMotorVov
      ? heeftFietsVov
        ? ` Je hebt geen auto, maar wel een ${fietsnaamOv}. Als je weg wilt, ga je op de ${fietsnaamOv}.`
        : ' Je hebt geen auto en geen fiets. Weggaan betekent te voet door het water.'
      : '';
    const mobiliteit = profile.playerIsMobilityImpaired
      ? ' Jij bent beperkt mobiel. Te voet waden is voor jou geen optie. Je moet hulp regelen of boven blijven.'
      : profile.playerIsElderly
      ? ' Op jouw leeftijd is waden door hoog water te gevaarlijk. Je opties zijn beperkt. Elke minuut telt.'
      : '';
    const bovenTekst = (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? ' ga nu weg als dat nog kan, of ga naar een hogere verdieping in het gebouw.'
      : ' ga nu weg als dat nog kan, of ga naar boven.';
    return 'Je hebt de stekkers eruit gehaald en de stroom uitgeschakeld zolang de vloer nog droog was. Buiten stijgt het water verder. Het evacuatieadvies is nog steeds duidelijk:' + bovenTekst + tas + geenAuto + mobiliteit + ' Wat doe je nu?';
  },
  choices: [{
    conditionalOn: () => !profile.playerIsMobilityImpaired,
    text: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? '🏠 In het gebouw blijven en naar een hogere verdieping gaan'
      : '🏠 Boven blijven en naar de eerste verdieping gaan',
    consequence: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
      ? 'Je gaat naar een hogere verdieping in het gebouw. Je neemt water, eten en je telefoon mee. Op straat stijgt het water verder, maar jij zit droog.'
      : 'Je klimt naar boven. Je neemt water, eten en je telefoon mee. Beneden stijgt het water verder.',
    stateChange: {
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => state.contactedAns && !profile.hasChildren,
    text: '📞 Ans vragen naar jou toe te komen en samen boven te blijven',
    consequence: 'Je appt Ans: "Kom nu, de straat is nog wadbaar." Tien minuten later staat ze voor de deur, kletsnat maar opgelucht. Samen ga je naar boven.',
    stateChange: {
      takingAns: true,
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
    text: () => profile.hasCar ? '🚗 Toch proberen weg te rijden' : '🚗 Toch proberen weg te rijden op de motor',
    consequence: () => {
      const v = profile.hasCar ? 'auto' : 'motor';
      return state.carMovedHigher
        ? `Je ${v} stond al hoger geparkeerd. Daardoor kom je nu nog weg via de omleiding. Je rijdt langzaam maar gestaag naar een droog deel van de stad.`
        : profile.hasCar
          ? `Je stapt in de auto. Het water staat al bijna aan de drempel. Rijden in 30 cm water is gevaarlijk, want auto's kunnen bij 60 cm al gaan drijven. Je rijdt voorzichtig, maar komt na 100 meter vast te staan.`
          : `Je stapt op de motor. Het water staat al hoog. Een motor kan door ondiep water rijden, maar de kans dat de motor uitvalt is groot. Na 50 meter sputtert de motor en kom je vast te staan.`;
    },
    stateChange: () => state.carMovedHigher ? {
      evacuatedFlood: true
    } : {
      wentUpstairs: false,
      evacuatedFlood: false
    }
  }, {
    conditionalOn: () => !(profile.hasCar || profile.hasMotorcycle) && !profile.playerIsMobilityImpaired,
    text: '🚶 Te voet wegwaden nu het nog kan',
    consequence: () => {
      const heeftFietsOv = profile.hasBike || profile.hasScooter || profile.hasEbike;
      const naamFietsOv  = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
      return heeftFietsOv
        ? `Je pakt je ${naamFietsOv} en rijdt langzaam door het water. Het staat al tot je knieën, maar de ${naamFietsOv} houdt je overeind. Via de omweg bereik je een droog stuk weg.`
        : 'Je trekt laarzen aan en waadt naar buiten. Het water staat bijna tot je knieën. Het is zwaar en koud, maar je werkt je door de straat heen en bereikt een droog stuk weg verderop.';
    },
    stateChange: {
      evacuatedFlood: true,
      comfort: -2,
      health: -1
    }
  }, {
    conditionalOn: () => profile.playerIsMobilityImpaired,
    text: '🆘 Hulp vragen om naar een hogere verdieping te komen',
    consequence: 'Je belt aan bij de buren en vraagt hulp. Met twee mensen lukt het om naar boven te komen. Het kost kostbare tijd. Het water staat al in de gang.',
    stateChange: {
      health: -1,
      comfort: -1,
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => profile.hasPets && !state.tookPets,
    text: () => petsCount > 1 ? '🐾 Huisdieren veiligstellen voor je vertrekt' : '🐾 Huisdier veiligstellen voor je vertrekt',
    consequence: () => petsCount > 1
      ? 'Je pakt de manden en roept de dieren. Ze zijn bang van het water en werken niet mee. Na een paar minuten heb je ze. Je vertrekt samen — maar kostbare tijd ben je kwijt.'
      : 'Je pakt de transportmand en roept je huisdier. Het is bang en wil niet mee. Na anderhalve minuut heb je het. Je vertrekt samen — maar kostbare tijd ben je kwijt.',
    stateChange: { tookPets: true, comfort: -1 }
  }]
}, {
  id: 'ov_3c',
  time: '10:45',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.wentUpstairs === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Je klimt de trap op. Je kind loopt mee maar halverwege stopt het. Het kijkt naar de benedenverdieping: het water sijpelt al onder de voordeur door. "Gaat ons huis kapot?" vraagt het. Het staat stil. Bevroren.' :
      'Je klimt de trap op met de kinderen. De jongste stopt halverwege en wil terug: haar tekeningen liggen nog op de keukentafel. De oudste staat boven al stil bij het raam en reageert nergens meer op. "Gaat ons huis kapot?" vraagt hij zacht.';
  },
  choices: [{
    conditionalOn: () => profile.childrenCount > 1,
    text: '🏃 Beide kinderen meenemen en zelf kalm blijven',
    consequence: 'Je loopt rustig maar doelgericht. Er zit geen paniek in je stem. De kinderen letten op jouw gedrag en blijven daardoor ook rustiger.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🛑 Hand pakken en doorlopen: "We praten boven verder"' : '🛑 De jongste meenemen en doorlopen: "We praten boven verder"',
    consequence: () => profile.childrenCount === 1 ? 'Je pakt de hand van je kind en loopt door. Het protesteert even, maar komt mee. Boven heb je meer tijd voor vragen.' : 'Je pakt de jongste vast en loopt door. Ze protesteert even, maar komt mee. Boven heb je meer tijd voor vragen.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {}
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Knielen en eerlijk zeggen: "Het huis kan nat worden, maar wij redden het samen"' : '💬 Bij de oudste knielen en eerlijk zeggen: "Het huis kan nat worden, maar wij redden het samen"',
    consequence: () => profile.childrenCount === 1 ? 'Je kind kijkt je aan. Even is het stil. Daarna loopt het weer mee de trap op. Het weet nu beter wat er gebeurt.' : 'De oudste knikt langzaam en loopt mee. De jongste ziet dat en volgt vanzelf. Ze weten nu beter wat er gebeurt.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_4b',
  time: '11:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const huisdier = profile.hasPets
      ? state.tookPets
        ? (petsCount > 1 ? ' Je huisdieren zijn bij je.' : ' Je huisdier is bij je.')
        : (petsCount > 1 ? ' Je huisdieren zijn beneden achtergebleven. Je hoort ze onrustig bewegen.' : ' Je huisdier is beneden achtergebleven. Je hoort het onrustig bewegen.')
      : '';
    const isApt = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
    const basisAns = state.takingAns
      ? (isApt ? 'Je bent met Ans op een hogere verdieping in het gebouw. Beneden in de gang staat het water. Twee paar ogen zien meer dan één. Hoe bereid je de komende uren voor?' : 'Je bent boven met Ans. Beneden stijgt het water en je hoort het kabbelen. Twee paar ogen zien meer dan één. Hoe bereid je de komende uren voor?')
      : (isApt ? 'Je bent op een hogere verdieping in het gebouw. Beneden in de gang en op straat stijgt het water. Hoe bereid je de komende uren voor?' : 'Je bent boven. Beneden stijgt het water en je hoort het kabbelen. Hoe bereid je de komende uren voor?');
    return basisAns + huisdier;
  },
  choices: [{
    text: '💧 Water en eten meenemen naar boven',
    consequence: 'Je haalt flessen water, blikjes, crackers en een blik opener naar boven. Als het water nog hoger stijgt, heb je een dag proviand.',
    stateChange: {
      savedItems: true
    }
  }, {
    text: '📱 Partner of familie laten weten dat jullie boven zitten',
    consequence: 'Je belt of stuurt een bericht: "We zitten boven, water staat in huis." Iemand weet nu waar jullie zijn. Als jouw telefoon straks leeg is, heeft iemand anders de situatie in de gaten.',
    stateChange: {
      knowsNeighbors: true
    }
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡ Alleen uitschakelen als de meterkast nog droog bereikbaar is',
    consequence: () => state.sealedHome
      ? 'Je kijkt eerst vanaf de trap. De vloer rond de meterkast is nog droog genoeg. Je gaat snel naar beneden, zet de hoofdschakelaar uit en gaat direct terug naar boven. Zodra daar water staat, blijf je weg van alle elektra beneden.'
      : 'Je kijkt vanaf de trap en ziet dat er al water bij de meterkast staat. Je blijft weg. Een natte ruimte met elektra is te gevaarlijk; beneden raak je nu geen elektrische apparaten of metalen delen meer aan.',
    source: { text: 'VDE: betreed nooit een natte ruimte met elektra; check ook lokaal overheid- of netbeheerderadvies', url: 'https://www.vde.com/topics-en/consumer-protection/electronics-flooding' },
    stateChange: () => state.sealedHome ? {
      cutElectricity: true,
      savedItems: true
    } : {}
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡💧 Alleen als droog bereikbaar: stroom uit en proviand mee',
    consequence: () => state.sealedHome
      ? 'Je controleert eerst of de route droog is. Dat is nog net zo. Je zet de hoofdschakelaar uit, pakt flessen water, blikjes en crackers en gaat meteen terug naar boven. Je neemt niets meer mee zodra het water de elektra kan raken.'
      : 'Je ziet dat de route naar de meterkast al nat is. Dan geldt: niet meer naar binnen voor elektra of spullen. Je blijft boven en gebruikt alleen wat je al veilig bij je hebt.',
    source: { text: 'VDE: betreed nooit een natte ruimte met elektra; check ook lokaal overheid- of netbeheerderadvies', url: 'https://www.vde.com/topics-en/consumer-protection/electronics-flooding' },
    stateChange: () => state.sealedHome ? {
      cutElectricity: true,
      savedItems: true,
      food: 1
    } : {}
  }, ]
}, {
  id: 'ov_4c',
  time: '11:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === false,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je auto staat vast. Je staat in het water, kniehoogte. Je kunt niet weg. Wat nu?',
  choices: [{
    text: '🏠 Terug naar huis gaan en naar boven',
    consequence: 'Je wadt terug naar je huis en klimt naar boven. Nat, maar veilig. Het had slechter kunnen aflopen.',
    stateChange: {
      wentUpstairs: true
    }
  }, {
    text: '📱 112 bellen',
    consequence: () => state.phoneBattery > 0 ? 'Je belt 112. "Blijf op uw auto staan, niet lopen." Na 40 minuten komt een reddingsboot. Je bent gered, maar de auto is verloren.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Je wacht en hoopt dat iemand je ziet.',
    stateChange: () => state.phoneBattery > 0 ? {
      evacuatedFlood: true,
      calledRescue: true
    } : {}
  }, {
    text: '🆘 Hulp vragen aan voorbijrijdende boot of buren',
    consequence: 'Je roept. Een buurman met een roeiboot vaart voorbij en pikt je op. Je wordt naar hoger gelegen terrein gebracht.',
    stateChange: {
      evacuatedFlood: true,
      calledRescue: true
    }
  }]
}, {
  id: 'ov_4d',
  time: '12:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.wentUpstairs === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    if (state.kidsNoodpakket) {
      return een ?
        'Je kind heeft zijn rugzakje opengemaakt en speelt rustig. Af en toe vraagt het wanneer de boot komt, maar daarna gaat het weer verder. Je merkt dat het zichzelf beter bezighoudt dan je had gedacht.' :
        'De jongste heeft haar rugzakje opengemaakt en speelt rustig. De oudste leest. Ze stellen af en toe een vraag, maar houden zichzelf bezig. Voorbereiding is zichtbaar.';
    } else {
      return een ?
        'Je kind vraagt al twee uur elke tien minuten hetzelfde: "Wanneer gaan we weg?" Het loopt heen en weer over de slaapkamervloer. Je merkt dat de onrust groeit naarmate er niets te doen is.' :
        'De jongste vraagt om het kwartier: "Wanneer gaan we weg?" De oudste staart uit het raam. Ze hebben niets te doen. De wachttijd is voor hen moeilijker dan voor jou.';
    }
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🪟 Samen door het raam kijken en benoemen wat je ziet' : '🪟 Samen door het raam kijken en benoemen wat je ziet',
    consequence: () => profile.childrenCount === 1 ? '"Daar drijft een fiets." "Dat is een reddingsboot." "Dat is de buurman zijn auto." Je kind wijst en benoemt. Het verwerkt door te kijken en te praten. Dat helpt.' : '"Daar drijft een fiets." "Dat is een reddingsboot." "Dat is de buurman zijn auto." De kinderen wijzen en benoemen. Ze verwerken door te kijken en te praten. Dat helpt.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🎲 Een spelletje verzinnen of verhaal vertellen om de tijd door te komen' : '🎲 Een spelletje verzinnen of verhaal vertellen om de tijd door te komen',
    consequence: () => profile.childrenCount === 1 ? 'Je begint een verzonnen verhaal over een avonturier die door het water vaart. Je kind gaat liggen en luistert. Even is de wereld kleiner dan de slaapkamer.' : 'Je begint een verzonnen verhaal over een avonturier die door het water vaart. De jongste kruipt naast je, de oudste doet alsof hij niet luistert maar luistert toch. Even is de wereld kleiner dan de slaapkamer.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '⏳ Je kind zijn gang laten gaan terwijl jij oplet' : '⏳ De kinderen hun gang laten gaan terwijl jij oplet',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    consequence: () => {
      if (state.kidsNoodpakket) {
        return profile.childrenCount === 1 ? 'Je kind speelt rustig. Jij houdt buiten alles in de gaten. Dat werkt vooral omdat het iets heeft om mee te spelen.' : 'De kinderen spelen rustig. Jij houdt buiten alles in de gaten. Dat werkt vooral omdat ze iets hebben om mee te spelen.';
      } else {
        return profile.childrenCount === 1 ? 'Je kind loopt onrustig heen en weer. De verveling en spanning wisselen elkaar af. Wachten wordt steeds moeilijker.' : 'De jongste begint te huilen van verveling en spanning. De oudste vraagt steeds opnieuw wanneer jullie weggaan. Zonder afleiding wordt wachten veel zwaarder.';
      }
    },
    stateChange: {}
  }]
}, {
  id: 'ov_5',
  time: '13:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === true,
  channels: {
    news: [{
      time: '12:45',
      headline: 'Water bereikt record, 1,2 meter in sommige woningen',
      body: 'Het waterpeil heeft een recordhoogte bereikt. In sommige woningen staat het water tot 1,2 meter. Reddingsoperaties zijn gaande.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Het water stijgt op meerdere plekken tot een uitzonderlijk hoog niveau. Reddingsoperaties zijn gaande. Bel 112 als u hulp nodig heeft. Ga niet een natte ruimte met elektra in. Alleen als de meterkast nog droog en veilig bereikbaar is, kan de stroom uit. Er zijn al meldingen van kortsluiting.'
  },
  get narrative() {
    const mobExtra = profile.playerIsMobilityImpaired
      ? ' Als beperkt mobiel persoon is traplopen of vluchten via het raam voor jou veel moeilijker. Je bent afhankelijk van hulp van buitenaf.'
      : profile.playerIsElderly
      ? ' Op jouw leeftijd is de situatie extra belastend. Je lichaam protesteert bij elke trap omhoog.'
      : '';
    const isApt5 = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
    const basis5 = isApt5
      ? 'Vanuit je raam zie je het water op straat staan. Beneden in het trappenhuis klinkt het kabbelen van water. Je zit op een hogere verdieping en bent voorlopig veilig, maar het stijgt nog steeds.'
      : 'Beneden hoor je het water kabbelen. De onderkant van de trapleuning staat al onder water. Je bent boven en voorlopig veilig, maar het stijgt nog steeds.';
    return basis5 + mobExtra;
  },
  choices: [{
    text: '🪟 Vanuit het raam om hulp seinen',
    consequence: 'Je hangt een laken uit het raam. Een reddingsboot ziet je en noteert je locatie. Ze komen later terug.',
    stateChange: {
      calledRescue: true
    }
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡ Niet meer naar de natte meterkast gaan',
    consequence: 'Je blijft boven. Beneden staat al water en dan ga je niet meer naar een ruimte met elektra. Je houdt iedereen weg van elektrische apparaten en wacht op hulp of professionele uitschakeling van buitenaf.',
    source: { text: 'VDE: betreed nooit een natte ruimte met elektra; check ook lokaal overheid- of netbeheerderadvies', url: 'https://www.vde.com/topics-en/consumer-protection/electronics-flooding' },
    stateChange: {}
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡🪟 Wegblijven van de meterkast en een teken geven',
    consequence: 'Je blijft uit de buurt van de natte meterkast en hangt een laken uit het raam. Dat is nu de veiligste combinatie: geen risico op een schok, maar wel zorgen dat hulp je ziet.',
    source: { text: 'VDE: betreed nooit een natte ruimte met elektra; check ook lokaal overheid- of netbeheerderadvies', url: 'https://www.vde.com/topics-en/consumer-protection/electronics-flooding' },
    stateChange: {
      calledRescue: true
    }
  }, {
    text: '⏳ Afwachten en batterij sparen',
    consequence: 'Je doet even niets en spaart de batterij. Wel blijf je uit de buurt van beneden: als daar water bij de elektra komt, raak je niets meer aan en wacht je op hulp.',
    stateChange: {}
  }]
}, {
  id: 'ov_5b',
  time: '13:15',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === true && !state.cutElectricity,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Er klinkt een knal beneden, gevolgd door sissen. Je ziet rook uit de meterkast komen. Kortsluiting. Water en elektriciteit.',
  choices: [{
    text: '🧯 Blussen met een droog poederbrandblusser',
    consequence: 'Je grijpt de kleine brandblusser naast de keuken. Droog poeder werkt goed bij een elektrische brand. In twee seconden is het vuur uit.',
    source: { text: 'Brandweer: het juiste blusmiddel', url: 'https://www.brandweer.nl/onderwerpen/het-juiste-blusmiddel/' },
    stateChange: {
      comfort: -1
    }
  }, {
    text: '🏃 Vluchten via het raam',
    consequence: 'Je opent het raam en klimt naar buiten op de vensterbank. Je roept om hulp. Na tien minuten komt een boot.',
    stateChange: {
      evacuatedFlood: true,
      calledRescue: true
    }
  }, {
    text: '🤷 Niets doen, het gaat vanzelf wel uit',
    consequence: 'Je doet niets. De brand blijft smeulen. Er komt steeds meer rook vrij. Na een kwartier is de situatie niet meer houdbaar.',
    stateChange: {
      comfort: -1
    }
  }]
}, {
  id: 'ov_6',
  time: '15:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => !state.evacuatedFlood,
  channels: {
    news: [],
    get whatsapp() {
      return state.takingAns ? [] : [{
        from: 'Buurvrouw Ans',
        msg: 'Ik ben veilig bij mijn zus. Ben jij ok?? We dachten aan je',
        time: '15:10',
        outgoing: false
      }];
    },
    nlalert: null,
    radio: null
  },
  narrative: 'Je hoort een motor. Een reddingsboot vaart langzaam door de straat. Ze komen langs woningen en controleren wie er nog is.',
  choices: [{
    text: '🚤 Meegaan met de reddingsboot',
    consequence: 'Je neemt je essentiële spullen en stapt in. De boot brengt je naar een noodopvang op hogere grond.',
    stateChange: {
      evacuatedFlood: true
    }
  }, {
    text: '🏠 Boven blijven, het water zakt straks wel',
    consequence: 'Je vraagt de reddingswerkers of je kunt blijven. "Op eigen risico", zeggen ze. "Water zakt morgen." Je besluit te blijven.',
    stateChange: {}
  }, {
    text: '🔔 Buren alarmeren die ook nog boven zitten',
    consequence: 'Je wijst de boot naar de buren verderop, die vanuit het raam staan te zwaaien. Samen worden jullie meegenomen.',
    stateChange: {
      evacuatedFlood: true,
      helpedNeighbor: true
    }
  }]
}, {
  id: 'ov_6e',
  time: '15:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.evacuatedFlood === true && state.wentUpstairs !== null,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Je zit in de boot. Het water is overal. Je kind wijst naar het raam van de slaapkamer: "Mijn knuffel ligt nog boven. Ik kan hem zien!" De reddingswerker vaart door.' :
      'Je zit in de boot. Het water is overal. De jongste wijst naar het raam: "Mijn knuffel ligt nog boven!" De oudste zegt niets. Dan steekt hij zijn hand uit om een oude vrouw naast hem overeind te helpen die bijna omvalt.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🧸 Geruststellen over de knuffel: "We zorgen straks voor hem"' : '🧸 Jongste geruststellen over de knuffel: "We zorgen straks voor hem"',
    consequence: () => profile.childrenCount === 1 ? '"Hij weet dat we terugkomen," zeg je. "Knuffels zijn dapper." Je kind denkt even na. Dan knikt het. Het helpt om iets te zeggen, ook als je het niet zeker weet.' : '"Hij weet dat we terugkomen," zeg je. "Knuffels zijn dapper." De jongste denkt even na. Dan knikt ze. Het helpt om iets te zeggen, ook als je het niet zeker weet.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => profile.childrenCount > 1,
    text: '🏅 De oudste complimenteren voor het helpen van de vrouw',
    consequence: 'Je pakt zijn hand even vast. "Dat was goed van je." Hij zegt niets, maar je ziet dat het aankomt. In het midden van de chaos heeft hij iemand anders gezien.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: '🧘 Zelf rustig blijven zodat de kinderen jouw kalmte voelen',
    consequence: () => profile.childrenCount === 1 ? 'Je ademt rustig en houdt je kind vast. Je zegt niet veel, maar je stem blijft kalm. Kinderen letten sterk op hun ouders. Als jij rustig blijft, helpt dat meteen.' : 'Je ademt rustig en houdt de jongste vast. Je zegt niet veel, maar je stem blijft kalm. Kinderen letten sterk op hun ouders. Als jij rustig blijft, helpt dat meteen. De oudste leunt even tegen je aan.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_6c',
  time: '17:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.evacuatedFlood === true,
  channels: {
    news: [{
      time: '16:45',
      headline: 'Opvanglocaties overvol, extra locaties geopend',
      body: 'Door het grote aantal geëvacueerden zijn meerdere extra noodopvangs geopend. De gemeente roept op rustig te blijven en aanwijzingen van vrijwilligers op te volgen.'
    }],
    whatsapp: [{
      from: 'Partner / familie',
      msg: 'Ben je veilig?? We zien op het nieuws dat jullie wijk is geëvacueerd. Bel als je kan!',
      time: '17:10',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: Geëvacueerden worden opgevangen in sportcomplexen en buurthuizen in de regio. Er is warm eten, water en slaapgelegenheid beschikbaar. Meld u aan bij de registratiebalie bij binnenkomst.'
  },
  get narrative() {
    const aankomst = state.wentUpstairs ?
      'De reddingsboot zet je af bij een sporthal op hoger gelegen grond.' :
      'Je bent op eigen kracht aangekomen bij de noodopvang.';
    const ansZin = state.takingAns ? ' Ans stapt naast je uit de boot.' : '';
    return aankomst + ansZin + ' Het is er druk. Overal zie je natte mensen en uitgeputte gezichten. Bij de ingang staat een vrijwilliger: "Wilt u zich eerst aanmelden bij de registratiebalie? Dan weten we dat u veilig bent." Je wacht tien minuten in de rij. Je meldt je aan. Nu weet de gemeente waar je bent. Hier is ook stroom, dus je telefoon kan opladen. Wat doe je daarna?';
  },
  choices: [{
    text: '🍲 Warm eten halen en even bijkomen',
    consequence: 'Je schuift aan bij de rij voor eten. Soep en brood. Je gaat zitten. Het is het eerste moment vandaag dat je stilzit. Dat voelt vreemd en goed tegelijk.',
    stateChange: {
      comfort: 1,
      food: 1
    }
  }, {
    text: '📱 Familie bellen zodat ze weten dat je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Je zoekt een hoek met een stopcontact en laadt je telefoon op terwijl je belt. Aan de andere kant hoor je vooral opluchting. Ze wisten niet waar je was.' : 'Je telefoon is leeg. Je vraagt of je iemands telefoon even mag lenen om een bericht te sturen. Een vrouw naast je helpt meteen.',
    stateChange: { phoneBattery: 20 }
  }, {
    text: '🛏️ Een slaapplek regelen voordat alles vol is',
    consequence: 'Je loopt de hal in en vindt een rustig hoekje. Je legt er je jas neer. Een uur later zijn de meeste plekken in de hal bezet.',
    stateChange: { comfort: 1, phoneBattery: 20 }
  }]
}, {
  id: 'ov_6g',
  time: '18:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === true && state.evacuatedFlood === false,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const basis = 'Het begint te schemeren. Buiten staat het water nog hoog. De geur van modder en riool trekt omhoog door de vloer. De kou neemt toe.';
    const kids = profile.hasChildren && state.kidsWithYou ?
      (profile.childrenCount === 1 ? ' Je kind trekt aan je mouw: "Ik heb honger."' : ' De kinderen worden onrustig. "Ik heb honger," zegt de jongste. "Ik ook," zegt de oudste.') :
      '';
    return basis + kids + ' Het is tijd om iets te eten.';
  },
  choices: [{
    conditionalOn: () => profile.hasGasStove !== 'ja' && (state.savedItems || profile.hasKit === 'ja'),
    get text() {
      return profile.hasKit === 'ja' ? '🎒 Noodpakket openmaken en koud eten' : '📦 Blikjes en crackers koud eten';
    },
    get consequence() {
      const basis = profile.hasKit === 'ja' ?
        'Je opent het noodpakket. Crackers, een reep, een zakje noten. Geen warme maaltijd, maar genoeg voor de avond.' :
        'Je opent een blik bonen koud en pakt crackers erbij. Het is te doen.';
      const kids = profile.hasChildren && state.kidsWithYou;
      const kidsZin = kids ?
        (profile.childrenCount === 1 ? ' Je kind wil er eerst niets van, maar eet toch.' : ' De jongste trekt een vies gezicht. De oudste eet zonder commentaar.') :
        '';
      return basis + kidsZin;
    },
    stateChange: {
      food: -1
    }
  }, {
    conditionalOn: () => profile.hasGasStove === 'ja' && (state.savedItems || state.food > 2),
    text: '🍲 Gasstelletje aansteken en iets warms koken',
    get consequence() {
      const kids = profile.hasChildren && state.kidsWithYou;
      const kidsZin = kids ?
        (profile.childrenCount === 1 ? ' Je kind kruipt naast je aan. Warm eten maakt alles net iets draaglijker.' : ' De kinderen schuiven dichterbij. De warmte en de geur veranderen de sfeer meteen.') :
        ' De warmte en geur veranderen de sfeer direct. Even lijkt de situatie minder zwaar.';
      return 'Je haalt het gasstelletje tevoorschijn en zet een pan soep op.' + kidsZin;
    },
    stateChange: {
      food: -1,
      comfort: 1
    }
  }, {
    text: '🍫 Zoeken wat er nog in de keuken staat',
    get consequence() {
      const basis = state.savedItems ?
        'Je vindt de crackers en blikjes die je eerder omhoog had gehaald. Met een reep chocolade erbij is het genoeg voor de avond.' :
        'Je zoekt in de keukenkast: een pak crackers achter in een la, een reep chocolade. Genoeg voor vanavond, maar morgen wordt het lastiger.';
      const kids = profile.hasChildren && state.kidsWithYou;
      const kidsZin = kids ?
        (profile.childrenCount === 1 ? ' Je kind eet de chocolade gretig op.' : ' De kinderen eten de chocolade als eerste op.') :
        '';
      return basis + kidsZin;
    },
    stateChange: {}
  }]
}, {
  id: 'ov_6f',
  time: '18:30',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.evacuatedFlood === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    if (state.kidsNoodpakket) {
      return een ?
        'Op de noodopvang klemt je kind zich aan je vast. Het laat je geen seconde los, zelfs niet als je even naar het toilet wilt. Het weet wel waar het is en dat jij er bent, maar het blijft zich aan je vasthouden.' :
        'Op de noodopvang klemt de jongste zich aan je vast, met haar arm om je been en haar hoofd tegen je zij. De oudste blijft rustiger. Jullie hebben eerder over dit soort situaties gepraat, maar voor de jongste is dat nu even weg.';
    } else {
      return een ?
        'Op de noodopvang klemt je kind zich aan je vast en wil het je geen seconde kwijt. Als je opstaat, staat het meteen ook op. Als je naar het toilet wilt, trekt het aan je mouw. Je begrijpt het, maar het maakt alles wel zwaarder.' :
        'Op de noodopvang klemt de jongste zich aan je vast en wil ze je geen seconde kwijt. Als je opstaat, staat zij ook op. Ondertussen speelt de oudste al met andere kinderen, alsof er niets is gebeurd.';
    }
  },
  choices: [{
    conditionalOn: () => state.kidsNoodpakket,
    text: '📋 Samen terugkijken op wat goed ging met het plan',
    consequence: () => profile.childrenCount === 1 ? '"Ik wist wat ik moest doen," zegt je kind. "Waarom wist jij dat?" vraag je. "Omdat we het hadden geoefend." Je voelt iets van trots, gemengd met opluchting.' : '"We wisten wat we moesten doen," zegt de oudste. "Waarom wist jij dat?" vraag je. "Omdat we het hadden geoefend." Je voelt iets van trots, gemengd met opluchting.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🫂 Je kind dicht bij je houden en samen blijven' : '🫂 De jongste dicht bij je houden en samen blijven',
    consequence: () => profile.childrenCount === 1 ? 'Je laat het toe. Je kind blijft aan je vast. Een vrijwilliger zegt dat dit vaak vanzelf zakt als een kind weer veiligheid voelt. Dat blijkt ook zo te zijn.' : 'Je laat het toe. De jongste blijft aan je vast. Een vrijwilliger zegt dat dit vaak vanzelf zakt als een kind weer veiligheid voelt. Dat blijkt ook zo te zijn.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Uitleggen dat het hier veilig is en dat je niet weggaat' : '💬 Jongste uitleggen dat het hier veilig is en dat je niet weggaat',
    consequence: () => profile.childrenCount === 1 ? '"Ik ga niet weg. We zijn hier samen en het is veilig." Je kind kijkt je aan. Het gelooft het half. Maar de greep wordt iets losser.' : '"Ik ga niet weg. We zijn hier samen en het is veilig." De jongste kijkt je aan. Het gelooft het half. Maar de greep wordt iets losser.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => !state.kidsNoodpakket && profile.childrenCount > 1,
    text: '🎮 De oudste laten spelen, dat is zijn manier van verwerken',
    consequence: 'Een vrijwilliger fluistert: "Laat maar. Spelen is hoe kinderen stress verwerken. Het is in orde." Je stopt met tegenhouden. Dat voelt beter.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }, {
    text: '🤝 Met andere ouders vergelijken hoe hun kinderen reageren',
    consequence: '"Die van mij laat me geen seconde los," zeg jij. "Die van mij rent al een uur rond," zegt een vader. "Allebei normaal," zegt een vrijwilliger. Dat helpt.',
    source: FLOOD_CHILD_CRISIS_SOURCE,
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_6b',
  time: '21:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.wentUpstairs === true && state.evacuatedFlood === false,
  channels: {
    news: [],
    whatsapp: [{
      from: 'Partner / familie',
      msg: 'Ben je ok?? We horen niets meer van je. Het nieuws zegt dat er mensen vast zitten. Bel als je kan.',
      time: '20:45',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: Het water stabiliseert in delen van de regio. In de vroege ochtend wordt een daling verwacht. Mensen die boven zijn gebleven: blijf kalm, bel 112 alleen bij directe nood. Reddingsdiensten werken de hele nacht door.'
  },
  narrative: 'Het is donker. Buiten is het veel stiller geworden. Het water stroomt niet meer langs het huis, maar het is ook nog niet weg. Je zit op de vloer van de slaapkamer. De verwarming is uit en het ruikt koud en muf. Beneden hoor je af en toe nog water druppen. In de verte vaart soms een motorboot langzaam door de straat.',
  choices: [{
    text: '🔦 Zaklamp pakken en water/eten inventariseren',
    consequence: 'Je zoekt op de tast. Twee flessen water, een pak crackers, een reep chocolade. Genoeg voor de nacht. Je telefoon laad je op via de powerbank als je die hebt.',
    stateChange: {
      savedItems: true,
      food: 1
    }
  }, {
    text: '📱 112 bellen om je locatie door te geven',
    consequence: () => state.phoneBattery > 0 ? 'Je belt 112. "Eerste verdieping, adres." Ze noteren waar je zit en zeggen dat ze in de ochtend komen. Dat geeft rust.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken.',
    stateChange: () => state.phoneBattery > 0 ? {
      calledRescue: true
    } : {}
  }, {
    text: '😴 Proberen te slapen, morgen is de nood voorbij',
    consequence: 'Je rolt je jas op als kussen. Het is koud en nat. Je slaapt nauwelijks, maar de ochtend komt toch.',
    stateChange: {
      comfort: -1
    }
  }]
}, {
  id: 'ov_6d',
  time: '22:00',
  date: 'Dinsdag 9 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.evacuatedFlood === true,
  channels: {
    news: [],
    whatsapp: [{
      from: 'Partner / familie',
      msg: 'Goed dat je veilig bent. Slaap lekker als dat lukt. We denken aan je.',
      time: '22:10',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: Het waterpeil stabiliseert. In de vroege ochtend wordt een daling verwacht. De gemeente en hulpdiensten bekijken morgenochtend eerst welke gebieden veilig genoeg zijn voor een eerste inspectie.'
  },
  narrative: 'Het is avond. In de sporthal is het rustiger geworden en het licht is gedimd. Overal liggen mensen op slaapmatten en opgerolde jassen. Je telefoon laadt op. Buiten regent het nog steeds, maar het ergste lijkt achter de rug.',
  choices: [{
    text: '💬 Met andere geëvacueerden praten',
    consequence: 'Een man naast je vertelt over zijn kelder vol water. Een vrouw heeft haar fotoalbum gered. Je deelt verhalen in het halfduister. Even geen eenzaamheid.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '😴 Proberen te slapen, morgen is er genoeg te doen',
    consequence: 'Je rolt je jas op als kussen en doet je ogen dicht. Het is druk en lawaaierig, maar de vermoeidheid wint het. Je slaapt.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_7',
  time: '08:00',
  date: 'Woensdag 10 november 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '07:30',
      headline: 'Water zakt, terugkeer geëvacueerde gebieden mogelijk',
      body: 'Het waterpeil daalt snel. Bewoners van geëvacueerde gebieden mogen terugkeren voor een eerste inspectie, maar overnachten wordt afgeraden vanwege gas- en elektrarisico\'s.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    let schade = 'De woning staat vol modder en slib.';
    if (state.cutElectricity && state.sealedHome) schade = 'Doordat je de meterkast had afgesloten en deuren had afgedicht, is er geen brandschade en is het water iets minder ver doorgedrongen.';
    else if (state.cutElectricity) schade = 'Doordat je de meterkast had afgesloten is er geen kortsluiting geweest. Andere huizen in de straat hadden dat geluk niet.';
    else if (state.sealedHome) schade = 'De afdichting heeft het water enigszins vertraagd, al staat er nog steeds modder in huis.';
    if (state.evacuatedFlood) {
      return 'Dag twee. Je hebt de nacht bij de noodopvang doorgebracht en je telefoon kunnen opladen. Het water zakt zichtbaar. De straten staan niet meer blank. ' + schade + ' Je kunt terug voor een eerste inspectie.';
    } else {
      return 'Dag twee. Je bent de nacht boven gebleven. Het is licht geworden en het water zakt zichtbaar. De straat komt langzaam weer tevoorschijn. Van boven zie je de modderrand op de muren van de benedenverdieping. Voorzichtig loop je de trap af.';
    }
  },
  get choices() {
    if (state.evacuatedFlood) {
      return [{
        text: '👀 Eerst van buiten de schade opnemen',
        consequence: 'Je loopt langzaam door de straat. De modderrand op de gevels is goed zichtbaar. Je maakt foto\'s van de buitenkant voordat je naar binnen gaat. Zo heb je een goed beeld van de omvang.',
        stateChange: {
          returnedHome: true
        }
      }, {
        text: '📸 Alleen kort terug voor foto\'s en noodzakelijke spullen',
        consequence: 'Je gaat kort naar binnen met laarzen en handschoenen. Geen elektra aanzetten. Je documenteert de schade systematisch en pakt het hoognoodzakelijke mee. Dan meteen weer weg.',
        stateChange: {
          returnedHome: true,
          savedItems: true
        }
      }, {
        text: '🤝 Met buren of gemeente afstemmen wanneer kort naar binnen mag',
        consequence: 'Je spreekt met een paar buren en belt de gemeente. Er is een aanspreekpunt voor geëvacueerden. Zij geven aan wanneer het veilig is voor een korte inspectie en wat je moet controleren.',
        stateChange: {
          returnedHome: true,
          helpedNeighbor: true
        }
      }];
    } else {
      return [{
        text: '👀 Beneden de schade opnemen',
        consequence: 'De vloer is bedekt met een centimeter slib. Meubels verplaatst door het water. Maar de muren staan. Je opent ramen en deuren om te ventileren.',
        stateChange: {
          returnedHome: true
        }
      }, {
        text: '🚪 Voordeur openen en buiten kijken',
        consequence: 'De straat staat nog een paar centimeter blank, maar het loopt snel weg. Buren staan in de deuropening. Niemand zegt veel. De schade is overal.',
        stateChange: {
          returnedHome: true
        }
      }, {
        text: '📱 Eerst de verzekering bellen voordat je iets aanraakt',
        consequence: 'Je belt de verzekeraar. "Maak foto\'s voordat u opruimt." Je documenteert de schade systematisch. Dat blijkt later de juiste keuze.',
        stateChange: {
          returnedHome: true
        }
      }];
    }
  }
}, {
  id: 'ov_7b',
  time: '09:00',
  date: 'Woensdag 10 november 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  conditionalOn: () => state.contactedAns,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    return state.takingAns ? 'Ans loopt met je mee door de straat. Ze kijkt naar haar woning: de begane grond staat vol slib. "Ik ben blij dat je me gisteren hebt gevraagd", zegt ze. "Anders had ik hier de nacht in mijn eentje gestaan."' : 'Iemand roept je naam. Het is Ans, je buurvrouw. Ze staat voor haar huis met modderige laarzen en een vochtige jas. "Ik ben blij dat je me gisteren hebt teruggestuurd", zegt ze. "Ik wist niet wat ik moest doen. Dat contact hielp echt."';
  },
  choices: [{
    text: '🤝 Samen de schade opnemen',
    consequence: 'Jullie lopen elkaars woningen door. Ans haar begane grond staat vol slib, maar de constructie is intact. Je helpt haar een lijst maken voor de verzekering.',
    stateChange: {
      helpedNeighbor: true,
      comfort: 1
    }
  }, {
    text: '😌 Blij zijn dat ze veilig is',
    consequence: '"Ik ben gewoon blij dat je er bent", zeg je. Ze knikt. In het geweld van modder en schade is dit een heel menselijk moment.',
    stateChange: {}
  }]
}, {
  id: 'ov_7c',
  time: '09:30',
  date: 'Woensdag 10 november 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    if (state.kidsNoodpakket) {
      return een ?
        'Je kind loopt naast je de woning in en kijkt serieus om zich heen. Dan vraagt het: "Wanneer is het weer normaal?" Niet huilend, maar gewoon vragend. Je weet het antwoord niet precies.' :
        'De kinderen lopen naast je de woning in. De oudste kijkt serieus om zich heen. De jongste pakt een modderig speelgoedbusje op van de vloer en toont het trots: "Hij heeft het overleefd!" Even schiet je in de lach.';
    } else {
      return een ?
        'Je kind loopt de woning in en blijft stil staan. De modder, de geur en de kapotte spullen zijn te veel tegelijk. Dan vraagt het: "Wanneer gaan we naar huis?" Het begrijpt nog niet dat dit al thuis is.' :
        'De jongste loopt naar binnen en draait zich meteen om: "Wanneer gaan we naar huis?" De oudste zegt zacht: "Dit ís thuis." Ze kijkt hem aan. Dan begint ze te huilen.';
    }
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '📸 Je kind laten meehelpen met fotograferen voor de verzekering' : '📸 De oudste laten meehelpen met fotograferen voor de verzekering',
    consequence: () => profile.childrenCount === 1 ? 'Je geeft je kind de telefoon en vraagt foto\'s te maken van de schade. Het loopt ernstig door de kamers. Even later kom je samen terug met veertig foto\'s. Betrokkenheid helpt bij verwerken.' : 'Je geeft de oudste de telefoon en vraagt foto\'s te maken van de schade. Hij loopt ernstig door de kamers. Even later kom je samen terug met veertig foto\'s. Betrokkenheid helpt bij verwerken.',
    stateChange: {
      savedItems: true
    }
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Uitleggen dat dit nog steeds thuis is en dat het beter wordt' : '💬 Uitleggen dat dit nog steeds thuis is en dat het beter wordt',
    consequence: () => profile.childrenCount === 1 ? '"Dit is nog steeds ons huis. Het ziet er nu anders uit, maar we maken het weer goed." Je kind kijkt om zich heen. "Mijn kamer ook?" vraagt het. "Jouw kamer ook," zeg je.' : '"Dit is nog steeds ons huis. Het ziet er nu anders uit, maar we maken het weer goed." De jongste snuft. "Mijn kamer ook?" vraagt ze. "Jouw kamer ook," zeg je. Ze knikt.',
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => state.kidsNoodpakket,
    text: () => profile.childrenCount === 1 ? '💬 Terugkijken op hoe het ging: "Wat vond jij het moeilijkste?"' : '💬 Terugkijken op hoe het ging: "Wat vonden jullie het moeilijkste?"',
    consequence: () => profile.childrenCount === 1 ? '"Het ergste moment," zegt je kind. "Maar ik was minder bang dan ik dacht." Als je vraagt waarom, zegt het: "Omdat ik wist wat we gingen doen." Goede voorbereiding merk je vaak pas achteraf.' : '"Het ergste moment," zegt de jongste. "Maar ik was minder bang dan ik dacht." De oudste zegt: "Ik ook niet. We wisten wat we moesten doen." Goede voorbereiding merk je vaak pas achteraf.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_8',
  time: '10:30',
  date: 'Woensdag 10 november 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '10:00',
      headline: 'Waterschade woningen: gas en elektra eerst laten controleren',
      body: 'Experts waarschuwen dat gas en elektra in overstroomde woningen absoluut eerst door een professional gecontroleerd moeten worden voor gebruik.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    if (state.evacuatedFlood) {
      return 'Je mag kort terug de woning in om schade vast te leggen en noodzakelijke spullen te halen. Het ruikt naar modder en riool. Alles is nat. Overnachten of alles opruimen is nog niet verstandig.';
    }
    return 'Je bent al thuis en loopt nog eens rustig door de woning om schade vast te leggen en noodzakelijke spullen apart te zetten. Het ruikt naar modder en riool. Alles is nat. Overnachten of alles opruimen is nog niet verstandig.';
  },
  choices: [{
    text: '📦 Alleen noodzakelijke spullen meenemen',
    consequence: () => state.evacuatedFlood
      ? 'Je pakt medicijnen, paspoorten en kleding voor een paar dagen. Alles wat je nu niet echt nodig hebt laat je staan. Het huis moet eerst gekeurd worden voor je echt terugkeert.'
      : 'Je pakt medicijnen, paspoorten en kleding voor een paar dagen. Alles wat je nu niet echt nodig hebt laat je staan. Ook al ben je al thuis, het huis moet eerst gekeurd worden voordat je het weer normaal kunt gebruiken.',
    stateChange: {
      savedItems: true,
      comfort: 1
    }
  }, {
    text: '📸 Eerst schade vastleggen',
    consequence: 'Je documenteert alles: de waterlijn op de muur, omgevallen kasten, kapotte apparaten. Cruciale stap voor de schadeclaim. Je verzekeraar zal je er later dankbaar voor zijn.',
    stateChange: {
      savedItems: true
    }
  }, {
    text: '⚡ Keuring regelen voordat je echt terugkomt',
    consequence: () => state.evacuatedFlood
      ? 'Je belt de netbeheerder en een installateur. Elektra en gas moeten professioneel gecontroleerd worden voor gebruik. Je noteert wat er moet gebeuren en verlaat daarna de woning weer.'
      : 'Je belt de netbeheerder en een installateur. Elektra en gas moeten professioneel gecontroleerd worden voor gebruik. Je noteert wat er moet gebeuren en gebruikt de woning daarna nog steeds niet alsof alles al normaal is.',
    stateChange: {}
  }]
}];

/* ─── SCENE ACHTERGRONDAFBEELDINGEN ─────────────────────────────────────────
   Koppelt scène-ID aan achtergrondafbeelding voor dit scenario.
   Wordt in engine.js samengevoegd tot sceneBgMap.
*/
const sceneImages_overstroming = {
  ov_0:  'afbeelding/overstroming/overstroming_avond.webp',
  ov_1:  'afbeelding/overstroming/overstroming_hoogwater.webp',
  ov_1b: 'afbeelding/overstroming/overstroming_hoogwater.webp',
  ov_1d: 'afbeelding/overstroming/overstroming_straat.webp',
  ov_2:  'afbeelding/overstroming/overstroming_straat.webp',
  ov_2b: 'afbeelding/overstroming/overstroming_straat.webp',
  ov_2c: 'afbeelding/overstroming/overstroming_straat.webp',
  ov_3:  'afbeelding/overstroming/overstroming_wijk.webp',
  ov_3a: 'afbeelding/overstroming/overstroming_wijk.webp',
  ov_3c: 'afbeelding/overstroming/overstroming_wijk.webp',
  ov_4b: 'afbeelding/overstroming/overstroming_wijk.webp',
  ov_4c: 'afbeelding/overstroming/auto_water.webp',
  ov_4d: 'afbeelding/overstroming/overstroming_wijk.webp',
  ov_5:  'afbeelding/overstroming/overstroming_ernstig.webp',
  ov_5b: 'afbeelding/overstroming/overstroming_ernstig.webp',
  ov_6:  'afbeelding/overstroming/reddingsboot.webp',
  ov_6e: 'afbeelding/overstroming/reddingsboot.webp',
  ov_6b: 'afbeelding/algemeen/noodopvang.webp',
  ov_6c: 'afbeelding/algemeen/noodopvang.webp',
  ov_6d: 'afbeelding/algemeen/noodopvang.webp',
  ov_6f: 'afbeelding/overstroming/overstroming_ernstig.webp',
  ov_6g: 'afbeelding/overstroming/overstroming_ernstig.webp',
  ov_7:  'afbeelding/overstroming/overstroming_naderhand.webp',
  ov_7b: 'afbeelding/overstroming/overstroming_naderhand.webp',
  ov_7c: 'afbeelding/overstroming/overstroming_naderhand.webp',
  ov_8:  'afbeelding/overstroming/overstroming_naderhand.webp',
};
