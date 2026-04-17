// ═══════════════════════════════════════════════════════════════
// Scenario: Nachtalarm — "De rookmelder gaat af in de nacht"
// 8 hoofdscènes + 1 conditionele scène — van na_intro (22:30) tot na_5 (02:45)
// Tijdspanne: ~30 minuten
// Geen nieuws- of radiokanaal
// ═══════════════════════════════════════════════════════════════

// Hulpfunctie: geeft true als de speler huisgenoten heeft.
function hasHousemates() {
  return (adultsCount + childrenCount + slechtTerBeenCount) > 1;
}

const scenes_nachtalarm = [
  // ─── Intro: Naar bed ──────────────────────────────────────────────────────
  {
    id: 'na_intro',
    time: '22:30',
    date: 'Maandag',
    dayBadge: 'Avond',
    dayBadgeClass: 'orange',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      return 'Het is laat. Het huis wordt stil en jij maakt je klaar om te gaan slapen.' +
        (hasHousemates() ? ' Ook de anderen zoeken hun bed op.' : '') +
        ' Buiten is alles rustig.';
    },
    choices: [
      {
        text: 'ga slapen',
        consequence: 'Je kruipt onder de dekens. Even later val je in slaap.',
        stateChange: {}
      }
    ]
  },

  // ─── Tussenscène: Alarm in het donker ────────────────────────────────────
  {
    id: 'na_alarm',
    time: '02:17',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    hideContinue: true,
    visuals: {
      image: 'afbeelding/brandalarm/waking_up.png'
    },
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Midden in de nacht word je wakker.',
    choices: []
  },

  // ─── Scene 0: Wakker schrikken ────────────────────────────────────────────
  {
    id: 'na_0',
    time: '02:17',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      return 'Met een klap ben je klaarwakker. Hard, schel gepiep vult het huis: de rookmelder gaat af. Alles is donker. Even weet je niet waar je bent.' +
        (hasHousemates() ? ' Naast je, of in de kamer ernaast, slaapt iemand gewoon door. Het alarm lijkt alleen jou wakker te maken.' : '');
    },
    choices: [
      {
        text: '⚡ Meteen opstaan en luisteren waar het geluid vandaan komt',
        consequence: 'Je schiet overeind. Je hart bonst in je keel. Beneden klinkt de rookmelder harder. Je houdt even je adem in en snuift de lucht op, maar boven ruik je nog geen rook.',
        cat: 'cat-action',
        stateChange: { awarenessLevel: 1, tookAlarmSeriously: true }
      },
      {
        text: '🗣️ Huisgenoten direct wakker maken',
        consequence: 'Je schudt iedereen wakker. Slaperige stemmen, verwarde blikken, blote voeten op de vloer. Het kost een paar seconden, maar niemand slaapt meer.',
        stateChange: { awarenessLevel: 1, tookAlarmSeriously: true, warnedHousemates: true },
        conditionalOn: () => hasHousemates() && !state.warnedHousemates
      },
      {
        text: '🛌 Blijven liggen, het is vast loos alarm',
        consequence: 'Je trekt het dekbed hoger op, maar het piepen blijft door merg en been gaan. Na een minuut weet je genoeg: dit is geen loos alarm. Je springt alsnog uit bed.',
        stateChange: { comfort: -1 }
      }
    ]
  },

  // ─── Scene 1: Deur open, rook ruiken ─────────────────────────────────────
  {
    id: 'na_1',
    time: '02:18',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      if (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw') {
        return 'Je doet de slaapkamerdeur open. Meteen ruik je rook. In de hal van het appartement hangt al een grauwe waas. Vanuit de woonkamer trekt rook richting voordeur. Verder is het stil. Alleen de rookmelder piept. Het is meteen duidelijk dat er iets mis is.';
      }
      return 'Je doet de slaapkamerdeur open. Meteen ruik je rook. Vanaf de trap hangt een grauwe waas in de hal. Het is stil in huis, op de rookmelder na. Het is meteen duidelijk dat er iets mis is.';
    },
    choices: [
      {
        text: '🗣️ Direct iedereen wakker maken',
        consequence: 'Je klopt op deuren, roept namen en maakt iedereen wakker. Slaperig en geschrokken komt iedereen de gang op.',
        stateChange: { warnedHousemates: true },
        conditionalOn: () => hasHousemates() && !state.warnedHousemates
      },
      {
        text: '📱 Meteen 112 bellen',
        consequence: 'De meldkamer neemt snel op, maar zegt direct: "Verlaat eerst de woning. Bel ons opnieuw zodra u buiten staat en zeg of iedereen eruit is." Ze sturen wel meteen een ploeg, maar benadrukken dat je nu moet gaan.',
        cat: 'cat-action',
        stateChange: { called112PreExit: true }
      },
      {
        text: '🔍 Eerst zelf gaan kijken wat er aan de hand is',
        consequence: 'Je loopt voorzichtig richting de trap. De rooklucht wordt sterker en prikt in je keel. Je voelt hoe snel de situatie ernstiger wordt.',
        stateChange: { awarenessLevel: 1 }
      }
    ]
  },

  // ─── Scene 2: Rook in de woonkamer ────────────────────────────────────────
  {
    id: 'na_2',
    time: '02:19',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      if (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw') {
        return 'In de woonkamer hangt een dichte, grijze rooklaag. Bij de muur zie je een stopcontact met een zwarte kring eromheen. De lucht ruikt scherp naar verbrand plastic. Bij de voordeur hangt de rook al lager. Je beseft dat het trappenhuis je enige route naar buiten is, en dat elke seconde telt.';
      }
      return 'In de woonkamer hangt een dichte, grijze rooklaag. Bij de muur zie je een stopcontact met een zwarte kring eromheen. De lucht ruikt scherp naar verbrand plastic en ergens klinkt zacht geknetter. Grote vlammen zie je nog niet, maar de rook is dik en benauwend.';
    },
    choices: [
      {
        text: '💧 Een pan water over het stopcontact gooien',
        consequence: 'Je gooit water over het stopcontact. Er volgt een felle knal en een regen van vonken. Water en elektriciteit zijn een gevaarlijke combinatie. Dit maakt de situatie juist nog riskanter.',
        cat: 'cat-risk',
        sound: 'coughing',
        stateChange: { health: -2 }
      },
      {
        text: '🔍 Dichterbij gaan kijken',
        consequence: 'Je zet een stap dichterbij. Meteen beginnen je ogen te prikken en moet je hoesten. Hier blijven is gevaarlijk en je verliest kostbare tijd.',
        cat: 'cat-info',
        stateChange: { health: -1 }
      },
      {
        text: '🚪 Teruglopen en iedereen naar buiten sturen',
        consequence: 'Je draait je om, rent naar de slaapkamers, maakt iedereen wakker, en stuurt ze naar buiten. Onderweg trek je de woonkamerdeur dicht, zodat de rook zich minder snel verspreidt.',
        cat: 'cat-social',
        stateChange: { warnedHousemates: true, didntUseWaterOnFire: true },
        conditionalOn: () => hasHousemates() && !state.warnedHousemates
      },
      {
        text: () => hasHousemates()
          ? '🚪 De woonkamerdeur dichtdoen en de anderen naar buiten krijgen'
          : '🚪 De woonkamerdeur dichtdoen en meteen naar buiten gaan',
        consequence: () => hasHousemates()
          ? 'Je trekt de deur dicht om de rook te remmen en gaat snel terug om de anderen naar buiten te krijgen.'
          : 'Je trekt de deur dicht om de rook te remmen en loopt direct naar buiten.',
        stateChange: { didntUseWaterOnFire: true }
      }
    ]
  },

  // ─── Scene 2b: Huisgenoten komen de gang op ──────────────────────────────
  {
    id: 'na_2b',
    time: '02:20',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    conditionalOn: () => hasHousemates() && !state.warnedHousemates,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Slaperig komen de anderen hun kamer uit. Ze kijken je vragend aan: "Wat is er aan de hand?" De rooklucht dringt nu ook de gang in. Je ziet ze pas echt wakker worden als ze het ruiken.',
    choices: [
      {
        text: '🚪 Iedereen direct naar buiten sturen',
        consequence: 'Je stuurt iedereen snel naar de voordeur. Verward maar gehoorzaam lopen ze naar buiten. Je gaat als laatste en trekt de deur achter je dicht.',
        cat: 'cat-social',
        stateChange: { warnedHousemates: true, evacuatedFire: true }
      },
      {
        text: () => petsCount > 1
          ? '🐾 Je huisdieren roepen en meenemen'
          : '🐾 Je huisdier roepen en meenemen',
        consequence: () => petsCount > 1
          ? 'Je roept je huisdieren. De dieren die vlak bij de deur zitten, neem je meteen mee naar buiten. De anderen lopen met jou mee.'
          : 'Je roept je huisdier. Het komt verschrikt tevoorschijn vanonder de kast. Je neemt het mee naar buiten. De anderen lopen met jou mee.',
        stateChange: { evacuatedFire: true, tookPets: true, warnedHousemates: true },
        conditionalOn: () => profile.hasPets
      }
    ]
  },

  // ─── Scene 3: Rook wordt dikker ───────────────────────────────────────────
  {
    id: 'na_3',
    time: '02:20',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'orange',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      if (state.didntUseWaterOnFire) {
        return 'Op de drempel draai je je om. De rooklucht trekt mee de gang in en het alarm piept onverminderd. Je bent bijna buiten — maar je moet nog kiezen of je iets meeneemt.';
      }
      return 'De rook wordt dikker en kruipt nu ook de gang in. Het alarm blijft schel piepen. Je moet nu snel kiezen of je nog wat doet voordat je naar buiten gaat.';
    },
    choices: [
      {
        text: '🎒 De noodtas meenemen die klaarstaat bij de deur',
        consequence: 'Je grijpt de noodtas die al klaarstaat bij de deur. Papieren, medicijnen en oplader zitten erin. Daarna ga je meteen naar buiten.',
        stateChange: { evacuatedFire: true, savedItems: true },
        conditionalOn: () => profile.hasDocuments === 'ja' && profile.hasBOBBag !== 'ja'
      },
      {
        text: '🎒 De vluchttas oppakken en naar buiten rennen',
        consequence: 'Je grijpt de vluchttas die klaarstaat. Zaklamp, papieren, contant geld — alles zit erin. Je rent naar buiten. Goed dat je dit voorbereid had.',
        stateChange: { evacuatedFire: true, savedItems: true },
        conditionalOn: () => profile.hasBOBBag === 'ja'
      },
      {
        text: '⚡ De stroom uitschakelen bij de meterkast en dan naar buiten',
        consequence: 'De meterkast zit gelukkig dicht bij de uitgang. Je zet snel de stroom uit en gaat daarna meteen naar buiten. Dat verkleint het risico dat het probleem verder doorslaat.',
        cat: 'cat-action',
        stateChange: { evacuatedFire: true, cutElectricity: true }
      },
      {
        text: '🚪 Meteen naar buiten gaan',
        consequence: 'Je kiest voor de snelste weg naar buiten. Zodra je buiten staat, slaat de koude nachtlucht in je gezicht. Je hoest nog even na.',
        stateChange: { evacuatedFire: true }
      },
      {
        text: '🔑 Je sleutels en telefoon zoeken',
        consequence: 'Je begint te zoeken, maar in de stress weet je niet meer waar je alles hebt neergelegd. Kostbare seconden tikken weg terwijl de rooklucht sterker wordt. Uiteindelijk vind je alles en ga je naar buiten, maar je had er langer over gedaan dan gedacht.',
        stateChange: { evacuatedFire: true, comfort: -1, delayedEvacuation: true }
      },
      {
        text: () => {
          if (profile.hasMobilityImpaired && !profile.hasChildren) return '🦽 Iemand direct helpen om naar buiten te gaan';
          if (childrenCount > 1) return '🧒 De kinderen direct helpen om naar buiten te gaan';
          return '🗣️ Huisgenoten wakker maken en naar buiten sturen';
        },
        consequence: () => (profile.hasChildren || profile.hasMobilityImpaired)
          ? 'Je helpt iedereen zo snel mogelijk naar buiten. Dat kost even tijd, maar het voorkomt dat iemand achterblijft in de rook. Even later staat iedereen half aangekleed buiten in de koude lucht.'
          : 'Je maakt iedereen wakker en stuurt hen direct naar buiten. Even later staat iedereen buiten, geschrokken maar veilig.',
        stateChange: { evacuatedFire: true, kidsEvacuated: true, warnedHousemates: true },
        conditionalOn: () => (hasHousemates() && !state.warnedHousemates) || profile.hasChildren || profile.hasMobilityImpaired
      }
    ]
  },

  // ─── Scene 4: Buiten ──────────────────────────────────────────────────────
  {
    id: 'na_4',
    time: '02:22',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'orange',
    channels: {
      news: [],
      whatsapp: [
        {
          from: 'Buurman',
          msg: 'Ik zie jullie buiten staan. Ik heb dekens en jassen als jullie iets nodig hebben.',
          time: '02:23',
          outgoing: false
        }
      ],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const delayedNote = state.delayedEvacuation
        ? ' Als je buiten komt, slaat er nu duidelijk meer rook uit de woning. Je beseft dat die verloren halve minuut veel uitmaakt.'
        : '';
      if (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw') {
        return hasHousemates()
          ? 'Je staat buiten je appartement, op de galerij of in het portiek. Vanuit de woning komt nog rook. Naast je staat iedereen half aangekleed en geschrokken bij elkaar. Het is koud en je vraagt je af of je toch nog even terug moet voor extra kleren.' + delayedNote
          : 'Je staat buiten je appartement, op de galerij of in het portiek. Vanuit de woning komt nog rook. Het is koud en je vraagt je af of je toch nog even terug moet voor extra kleren.' + delayedNote;
      }
      return hasHousemates()
        ? 'Je staat buiten in de koude nacht. Vanuit de voordeur ruik je nog steeds rook. Naast je staat iedereen half aangekleed en geschrokken op straat. Het is koud en je vraagt je af of je toch nog even naar binnen kunt om wat extra kleren te pakken.' + delayedNote
        : 'Je staat buiten in de koude nacht. Vanuit de woning ruik je nog steeds rook. Het is koud en je vraagt je af of je toch nog even naar binnen kunt om wat extra kleren te pakken.' + delayedNote;
    },
    choices: [
      {
        text: () => state.called112PreExit ? '📱 112 opnieuw bellen zodra je buiten staat' : '📱 112 bellen',
        consequence: () => state.called112PreExit
          ? 'Je belt opnieuw nu je buiten staat. De meldkamer vraagt of iedereen buiten is en noteert je adres. Even later hoor je in de verte sirenes. De brandweer komt eraan.'
          : 'De meldkamer neemt snel op, vraagt of iedereen buiten is en noteert je adres. Even later hoor je in de verte sirenes. De brandweer komt eraan.',
        cat: 'cat-action',
        stateChange: { called112: true, stayedOutside: true },
        conditionalOn: () => !state.called112
      },
      {
        text: '👥 Controleren of iedereen buiten is',
        consequence: 'Je telt alle huisgenoten en kijkt of niemand nog binnen is. Dat geeft rust terwijl je op de brandweer wacht.',
        stateChange: { stayedOutside: true, comfort: -1 },
        conditionalOn: () => hasHousemates()
      },
      {
        text: '🏘️ Naar de buren gaan om te zeggen dat er brand is in jouw woning',
        consequence: () => (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw')
          ? 'Je klopt hard aan bij de directe buren op de gang en roept dat er brand is in jouw woning. Slaperige gezichten, dan geschrokken ogen. Ze gaan meteen naar buiten. Goed dat je dit deed, in een flatgebouw kan rook snel naar andere woningen trekken.'
          : 'Je loopt snel naar de buren en klopt aan. Even later staan ze in de deuropening. Je legt kort uit wat er aan de hand is. Ze bellen 112 en houden een oogje in het zeil. Je bent blij dat je dit even gedaan hebt.',
        cat: 'cat-social',
        stateChange: { stayedOutside: true, knowsNeighbors: true }
      },
      {
        text: '⏳ Buiten wachten op de brandweer',
        consequence: 'Je blijft buiten staan. De kou bijt in je handen en voeten. Even later hoor je in de verte sirenes aankomen.',
        stateChange: { stayedOutside: true }
      },
    ]
  },

  // ─── Scene 5: Brandweer heeft controle ───────────────────────────────────
  {
    id: 'na_5',
    time: '02:45',
    date: 'Dinsdag',
    dayBadge: 'Nacht',
    dayBadgeClass: 'blue',
    channels: {
      news: [],
      whatsapp: [
        {
          from: 'Buurman',
          msg: 'Hebben jullie een slaapplek nodig voor vannacht? Als je wil hebben we wel een bed over.',
          time: '02:50',
          outgoing: false
        }
      ],
      nlalert: null,
      radio: null
    },
    get narrative() {
      return 'De blauwe lichten kleuren de straat. De brandweer maakt het doorgebrande stopcontact veilig en controleert de woning. Een brandweerman loopt de situatie rustig met je door. Hij vraagt of iedereen buiten is en of er nog medicijnen, sleutels of andere noodzakelijke spullen missen. Het acute gevaar is voorbij, zegt hij, maar door de rook en de schade is het niet verstandig om vannacht nog thuis te slapen.' +
        (state.savedItems
          ? ' Je hebt je spullen al bij je. Dat scheelt meteen.'
          : ' Hij adviseert om alleen nog onder begeleiding naar binnen te gaan voor echt noodzakelijke spullen.') +
        (state.tookPets ? ' Je huisdier is gelukkig ook buiten.' : '');
    },
    choices: [
      {
        text: '✅ Zeggen dat je alles bij je hebt en meteen een slaapplek regelen',
        consequence: 'Je regelt een hotel, familie of buren als slaapplek. Voor vannacht is dat de veiligste keuze. Morgen kun je pas echt bekijken wat de schade is.',
        stateChange: { stayedOutside: true }
      },
      {
        text: '🏠 Vragen of je nog kort naar binnen mag voor papieren en medicijnen',
        consequence: 'Onder begeleiding loop je nog één keer kort naar binnen. Je pakt papieren, medicijnen en wat kleding. Daarna moet je weer naar buiten.',
        stateChange: { stayedOutside: true, savedItems: true }
      }
    ]
  }
];

// sceneDecay_nachtalarm staat in data-state.js

/* ─── SCENE ACHTERGRONDAFBEELDINGEN ─────────────────────────────────────────
   Koppelt scène-ID aan achtergrondafbeelding voor dit scenario.
   Wordt in engine.js samengevoegd tot sceneBgMap.
*/
const sceneImages_nachtalarm = {
  na_intro: 'afbeelding/brandalarm/going_to_bed.png',
  na_0:  'afbeelding/brandalarm/waking_up.png',
  na_1:  'afbeelding/brandalarm/Rook_hal.png',
  na_2:  'afbeelding/brandalarm/rook_woonkamer.png',
  na_2b: 'afbeelding/brandalarm/Rook_hal.png',
  na_3:  'afbeelding/brandalarm/Rook_uitgang.png',
  na_4:  'afbeelding/brandalarm/Dutch_house_fire.png',
  na_5:  'afbeelding/brandalarm/Dutch_house_fire.png',
};
