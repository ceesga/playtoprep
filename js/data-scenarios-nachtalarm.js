// ═══════════════════════════════════════════════════════════════
// Scenario: Nachtalarm — "De rookmelder gaat af in de nacht"
// 6 scenes — van na_0 (02:17) tot na_5 (02:45)
// Tijdspanne: ~30 minuten
// Geen nieuws- of radiokanaal
// ═══════════════════════════════════════════════════════════════

// Hulpfunctie: geeft true als de speler huisgenoten heeft.
function hasHousemates() {
  return (adultsCount + childrenCount + slechtTerBeenCount) > 1;
}

const scenes_nachtalarm = [
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
      return 'Midden in de nacht schrik je wakker van een hard, schel piepend geluid. De rookmelder gaat af. Alles is donker en even weet je niet waar je bent.' +
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
      if (profile.houseType === 'appartement') {
        return 'Je doet de slaapkamerdeur open. Meteen ruik je rook. In de hal van het appartement hangt al een grauwe waas. Vanuit de woonkamer trekt rook richting voordeur. Het is stil, op de rookmelder na, en meteen duidelijk dat er iets mis is.';
      }
      return 'Je doet de slaapkamerdeur open. Meteen ruik je rook. Vanaf de trap hangt een grauwe waas in de hal. Het is stil in huis, op de rookmelder na, en meteen duidelijk dat er iets mis is.';
    },
    choices: [
      {
        text: '🗣️ Direct iedereen wakker maken',
        consequence: 'Je klopt op deuren, roept namen en maakt iedereen wakker. Slaperig en geschrokken komt iedereen de gang op.',
        stateChange: { warnedHousemates: true },
        conditionalOn: () => hasHousemates() && !state.warnedHousemates
      },
      {
        text: '🔍 Eerst zelf gaan kijken wat er aan de hand is',
        consequence: 'Je loopt voorzichtig richting de trap. De rooklucht wordt sterker en prikt in je keel. Je voelt hoe snel de situatie ernstiger wordt.',
        stateChange: { awarenessLevel: 1 }
      },
      {
        text: '📱 Meteen 112 bellen',
        consequence: 'De meldkamer neemt snel op. Ze vragen of iedereen al buiten is en zeggen dat je het huis direct moet verlaten. Er wordt meteen een ploeg gestuurd.',
        cat: 'cat-action',
        stateChange: { called112: true }
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
    narrative: 'In de woonkamer hangt een dichte, grijze rooklaag. Bij de muur zie je een stopcontact met een zwarte kring eromheen. De lucht ruikt scherp naar verbrand plastic en ergens klinkt zacht geknetter. Grote vlammen zie je nog niet, maar de rook is dik en benauwend.',
    choices: [
      {
        text: '🔍 Dichterbij gaan kijken',
        consequence: 'Je zet een stap dichterbij. Meteen beginnen je ogen te prikken en moet je hoesten. Hier blijven is gevaarlijk en je verliest kostbare tijd.',
        cat: 'cat-info',
        stateChange: { health: -1 }
      },
      {
        text: '💧 Een pan water over het stopcontact gooien',
        consequence: 'Je gooit water over het stopcontact. Er volgt een felle knal en een regen van vonken. Water en elektriciteit zijn een gevaarlijke combinatie. Dit maakt de situatie juist nog riskanter.',
        cat: 'cat-risk',
        stateChange: { health: -2 }
      },
      {
        text: '🚪 Teruglopen en iedereen naar buiten sturen',
        consequence: 'Je draait je om, rent naar de slaapkamers, maakt iedereen wakker, en stuurt ze naar buiten. Onderweg trek je de woonkamerdeur dicht, zodat de rook zich minder snel verspreidt.',
        stateChange: { warnedHousemates: true, didntUseWaterOnFire: true },
        conditionalOn: () => hasHousemates() && !state.warnedHousemates
      },
      {
        text: '🚪 De woonkamerdeur dichtdoen en meteen naar buiten gaan',
        consequence: () => hasHousemates()
          ? 'Je trekt de deur dicht om de rook te remmen en gaat snel terug om de anderen naar buiten te krijgen.'
          : 'Je trekt de deur dicht om de rook te remmen en loopt direct naar buiten.',
        stateChange: { didntUseWaterOnFire: true }
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
        text: '🚪 Meteen naar buiten gaan',
        consequence: 'Je kiest voor de snelste weg naar buiten. Zodra je buiten staat, slaat de koude nachtlucht in je gezicht. Je hoest nog even na.',
        stateChange: { evacuatedFire: true }
      },
      {
        text: '🔑 Je sleutels en telefoon zoeken',
        consequence: 'Je begint te zoeken, maar in de stress weet je niet meer waar je alles hebt neergelegd. Kostbare seconden tikken weg terwijl de rooklucht sterker wordt. Uiteindelijk vind je alles en ga je naar buiten, maar je had er langer over gedaan dan gedacht.',
        stateChange: { evacuatedFire: true, comfort: -1 }
      },
      {
        text: '⚡ De stroom uitschakelen bij de meterkast en dan naar buiten',
        consequence: 'De meterkast zit gelukkig dicht bij de uitgang. Je zet snel de stroom uit en gaat daarna meteen naar buiten. Dat verkleint het risico dat het probleem verder doorslaat.',
        cat: 'cat-action',
        stateChange: { evacuatedFire: true, cutElectricity: true }
      },
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
        text: () => petsCount > 1
          ? '🐾 Je huisdieren roepen en meenemen als ze direct bereikbaar zijn'
          : '🐾 Je huisdier roepen en meenemen als het direct bereikbaar is',
        consequence: () => petsCount > 1
          ? 'Je roept je huisdieren. De dieren die vlak bij de deur zitten, neem je meteen mee naar buiten. Verder zoeken doe je niet.'
          : 'Je roept je huisdier. Het komt verschrikt tevoorschijn vlak bij de deur. Je neemt het meteen mee naar buiten en gaat niet verder zoeken.',
        stateChange: { evacuatedFire: true, tookPets: true },
        conditionalOn: () => profile.hasPets
      },
      {
        text: () => {
          if (profile.hasMobilityImpaired && !profile.hasChildren) return '🦽 Iemand direct helpen om naar buiten te gaan';
          if (childrenCount === 1) return '🧒 Je kind mee naar buiten nemen';
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
      if (profile.houseType === 'appartement') {
        return hasHousemates()
          ? 'Je staat buiten voor het gebouw in de koude nacht. Achter een raam boven je hangt nog rook. Naast je staat iedereen half aangekleed en geschrokken op de stoep. Het is koud en je vraagt je af of je toch nog even terug moet voor extra kleren.'
          : 'Je staat buiten voor het gebouw in de koude nacht. Achter een raam boven je hangt nog rook. Het is koud en je vraagt je af of je toch nog even terug moet voor extra kleren.';
      }
      return hasHousemates()
        ? 'Je staat buiten in de koude nacht. Vanuit de voordeur ruik je nog steeds rook. Naast je staat iedereen half aangekleed en geschrokken op straat. Het is koud en je vraagt je af of je toch nog even naar binnen kan om wat extra kleren te pakken.'
        : 'Je staat buiten in de koude nacht. Vanuit de woning ruik je nog steeds rook. Het is koud en je vraagt je af of je toch nog even naar binnen kan om wat extra kleren te pakken.';
    },
    choices: [
      {
        text: '📱 112 bellen',
        consequence: 'De meldkamer neemt snel op en vraagt of iedereen buiten is. Even later hoor je in de verte sirenes. De brandweer komt eraan.',
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
        text: '⏳ Buiten wachten op de brandweer',
        consequence: 'Je blijft buiten staan. De kou bijt in je handen en voeten. Even later hoor je in de verte sirenes aankomen.',
        stateChange: { stayedOutside: true }
      },
      {
        text: '🚪 Snel naar binnen gaan om iets te halen',
        consequence: 'Je stapt toch nog naar binnen, maar de rook is veel dikker dan net. Je moet meteen hoestend terug. Dit was te gevaarlijk.',
        cat: 'cat-risk',
        stateChange: { health: -2 }
      }
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
      return 'De blauwe lichten kleuren de straat terwijl de brandweer het doorgebrande stopcontact veilig maakt en de woning controleert. Een brandweerman loopt de situatie rustig met je door. Hij vraagt of iedereen buiten is en of er nog medicijnen, sleutels of andere noodzakelijke spullen missen. Daarna zegt hij dat het acute gevaar voorbij is, maar dat het door de rook en de schade niet verstandig is om vannacht nog thuis te slapen.' +
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
