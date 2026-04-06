// ═══════════════════════════════════════════════════════════════
// Scenario: Nachtalarm — "Het brandalarm gaat af in de nacht"
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
      return 'Midden in de nacht schrik je wakker van een hard, schel piepend geluid. Het brandalarm. Het huis is donker en even weet je niet waar je bent.' +
        (hasHousemates() ? ' Naast je, of in de kamer ernaast, slaapt iemand gewoon door. Het alarm lijkt alleen jou wakker te maken.' : '');
    },
    choices: [
      {
        text: '⚡ Meteen opstaan en luisteren waar het geluid vandaan komt',
        consequence: 'Je schiet overeind. Je hart bonst in je keel. Beneden klinkt het alarm harder. Je houdt even je adem in en snuift de lucht op, maar boven ruik je nog geen rook.',
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
    narrative: 'Je doet de slaapkamerdeur open. Meteen ruik je rook. Vanaf de trap hangt een grauwe waas in de hal. Het is stil in huis, op het alarm na, en meteen duidelijk dat er iets mis is.',
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
        stateChange: { comfort: -1 }
      },
      {
        text: '📱 Meteen 112 bellen',
        consequence: 'De meldkamer neemt snel op. Ze vragen of iedereen al buiten is en zeggen dat je het huis direct moet verlaten. Er wordt meteen een ploeg gestuurd.',
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
        cat: 'cat-risk',
        stateChange: { health: -1, comfort: -1 }
      },
      {
        text: '💧 Een pan water over het stopcontact gooien',
        consequence: 'Je gooit water over het stopcontact. Er volgt een felle knal en een regen van vonken. Water en elektriciteit zijn een gevaarlijke combinatie. Dit maakt de situatie juist nog riskanter.',
        cat: 'cat-risk',
        stateChange: { health: -2, comfort: -1 }
      },
      {
        text: '🚪 Meteen teruglopen en iedereen naar buiten sturen',
        consequence: 'Je draait je om, roept iedereen wakker en stuurt hen meteen naar de voordeur. Onderweg trek je de woonkamerdeur dicht, zodat de rook zich minder snel verspreidt.',
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
    narrative: 'De rook wordt dikker en kruipt nu ook de gang in. Het alarm blijft schel piepen. Je moet nu snel kiezen wat je nog doet voordat je naar buiten gaat.',
    choices: [
      {
        text: '🚪 Meteen naar buiten gaan',
        consequence: 'Je kiest voor de snelste weg naar buiten. Zodra je buiten staat, slaat de koude nachtlucht in je gezicht. Je hoest nog even na.',
        stateChange: { evacuatedFire: true }
      },
      {
        text: '🔑 Eerst sleutels en telefoon meenemen',
        consequence: 'Je grijpt in een snelle beweging je telefoon en sleutels mee. Daarna ga je meteen naar buiten. Dat kost maar een paar seconden en geeft straks rust.',
        stateChange: { evacuatedFire: true }
      },
      {
        text: '⚡ De stroom uitschakelen bij de meterkast en dan naar buiten',
        consequence: 'De meterkast zit gelukkig dicht bij de uitgang. Je zet snel de stroom uit en gaat daarna meteen naar buiten. Dat verkleint het risico dat het probleem verder doorslaat.',
        stateChange: { evacuatedFire: true, cutElectricity: true }
      },
      {
        text: '🎒 De noodtas meenemen die klaarstaat bij de deur',
        consequence: 'Je grijpt de noodtas die al klaarstaat bij de deur. Papieren, medicijnen en oplader zitten erin. Daarna ga je meteen naar buiten.',
        stateChange: { evacuatedFire: true, savedItems: true },
        conditionalOn: () => profile.hasDocuments === 'ja'
      },
      {
        text: () => {
          if (profile.hasMobilityImpaired && !profile.hasChildren) return '🦽 Iemand direct helpen om naar buiten te gaan';
          if (childrenCount === 1) return '🧒 Je kind direct helpen om naar buiten te gaan';
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
          msg: 'Ik zie licht bij jullie. Is alles goed?',
          time: '02:23',
          outgoing: false
        }
      ],
      nlalert: null,
      radio: null
    },
    get narrative() {
      return hasHousemates()
        ? 'Je staat buiten in de koude nacht. Vanuit de voordeur ruik je nog steeds rook. Naast je staat iedereen half aangekleed en geschrokken op straat. Nu moet je zorgen dat niemand terug naar binnen gaat en dat de hulpdiensten worden gewaarschuwd.'
        : 'Je staat buiten in de koude nacht. Vanuit de woning ruik je nog steeds rook. Nu moet je buiten blijven en de hulpdiensten waarschuwen.';
    },
    choices: [
      {
        text: '📱 112 bellen',
        consequence: 'De meldkamer neemt snel op en vraagt of iedereen buiten is. Even later hoor je in de verte sirenes. De brandweer komt eraan.',
        stateChange: { called112: true, stayedOutside: true },
        conditionalOn: () => !state.called112
      },
      {
        text: '👥 Controleren of iedereen buiten is',
        consequence: 'Je telt alle huisgenoten en kijkt of niemand nog binnen is. Dat geeft rust terwijl je op de brandweer wacht.',
        stateChange: { stayedOutside: true },
        conditionalOn: () => hasHousemates()
      },
      {
        text: '🚪 Toch snel naar binnen gaan om iets te halen',
        consequence: 'Je stapt toch nog naar binnen, maar de rook is veel dikker dan net. Je moet meteen hoestend terug. Dit was te gevaarlijk.',
        cat: 'cat-risk',
        stateChange: { health: -2, comfort: -1 }
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
          msg: 'Jullie mogen bij ons slapen als dat helpt.',
          time: '02:50',
          outgoing: false
        }
      ],
      nlalert: null,
      radio: null
    },
    get narrative() {
      return 'De blauwe lichten kleuren de straat terwijl de brandweer het doorgebrande stopcontact veilig maakt en de woning controleert. Een brandweerman zegt dat het acute gevaar voorbij is, maar dat de rook en de schade maken dat het niet verstandig is om vannacht nog thuis te slapen. Hij vraagt of je belangrijke papieren, medicijnen en andere noodzakelijke spullen bij je hebt.';
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
