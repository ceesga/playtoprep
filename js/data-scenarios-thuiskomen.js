// ═══════════════════════════════════════════════════════════════
// Scenario: Onderweg naar huis
// Meerdere routevarianten — van tk_1 (kantoor) tot tk_6 (thuis)
// Tijdspanne: ~9 uur (werk → thuis)
// ═══════════════════════════════════════════════════════════════

// ─── ONDERWEG NAAR HUIS SCENARIO ─────────────────────────────────────────────
const THUIS_KOMEN_VISUALS = {
  office: 'afbeelding/stroomstoring_onderweg/kantoor.png',
  walking: 'afbeelding/stroomstoring_onderweg/pedestrian.png',
  bike: 'afbeelding/stroomstoring_onderweg/bicycle_path.jpg',
  bus: 'afbeelding/stroomstoring_onderweg/Bus_station.png',
  train: 'afbeelding/stroomstoring_onderweg/train_station.jpg',
  car: 'afbeelding/stroomstoring_onderweg/Auto_Nweg.jpg',
  home: 'afbeelding/stroomstoring/Huis_winter1.png'
};

function thuisKomenTravelImage(mode) {
  switch (mode) {
    case 'car':
    case 'ride':
      return THUIS_KOMEN_VISUALS.car;
    case 'bike':
      return THUIS_KOMEN_VISUALS.bike;
    case 'ov':
      return THUIS_KOMEN_VISUALS.bus;
    case 'train':
      return THUIS_KOMEN_VISUALS.train;
    default:
      return THUIS_KOMEN_VISUALS.walking;
  }
}

const scenes_thuis_komen = [{
  id: 'tk_0',
  time: '08:15',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const afstand = profile.commuteDistance === 'far'
      ? ' Het is een flink eind reizen, maar je bent het gewend.'
      : profile.commuteDistance === 'medium'
      ? ' Een half uurtje onderweg, zoals elke dag.'
      : ' Je bent er zo — het is vlakbij.';
    return 'Een gewone donderdagochtend in januari. Buiten is het grijs en koud. Je vertrekt van huis richting kantoor.' + afstand + ' Geen bijzonderheden. Gewoon een werkdag.';
  },
  choices: [{
    text: '💼 Gaan werken',
    consequence: 'Je pakt je spullen en vertrekt. Op kantoor hangt de vertrouwde geur van koffie en werkende mensen. De dag begint.',
    cat: 'cat-neutral',
    stateChange: {}
  }]
}, {
  id: 'tk_0b',
  time: '11:57',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  autoAdvanceMs: 1000,
  hideContinue: true,
  visuals: {
    image: 'none'
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: '',
  choices: []
}, {
  id: 'tk_1',
  time: '11:57',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Ineens worden de beeldschermen zwart. Het licht valt uit. De ventilatie stopt. Het is stil... Daarna hoor je alleen verbaasde stemmen en korte vragen. Je telefoon doet het nog, maar het signaal is zwak.',
  choices: [{
    text: '💻 Doorwerken op laptopbatterij',
    consequence: 'Je klapt je laptop open. Batterij op 62%. De wifi is weg, dus je verbindt via je telefoon. Het werkt, maar traag. Het netwerk raakt vol. Na een kwartier geef je het op. Dit schiet niet op.',
    stateChange: {}
  }, {
    text: '📱 Telefoon eerst opladen via de laptop',
    consequence: 'Je sluit je telefoon via USB aan op de laptop. Terwijl je op nieuws wacht, laadt hij rustig bij. De laptop heeft nog genoeg accu om daarbij te helpen.',
    stateChange: () => ({
      phoneBattery: Math.min(100, state.phoneBattery + 30) - state.phoneBattery
    })
  }, {
    text: '🚗 Spullen bij elkaar zoeken zodat je weg kunt',
    consequence: 'Je begint je spullen te verzamelen. Laptop in de tas, jas aan. Je weet nog niet wanneer je vertrekt, maar je wilt klaar zijn als het nodig is.',
    stateChange: {
      awarenessLevel: 1
    }
  }]
}, {
  id: 'tk_2',
  time: '12:20',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '12:15',
      headline: 'Grote stroomstoring treft heel Nederland, duur onbekend',
      body: 'Er is een grote stroomstoring gaande in vrijwel heel Nederland. De oorzaak wordt onderzocht. Treinen rijden niet meer. Verkeerslichten zijn uit. De overheid vraagt iedereen kalm te blijven.'
    }],
    get whatsapp() {
      const msgs = [];
      if (profile.adults > 1) {
        msgs.push({
          from: 'Partner',
          msg: 'Hier ook geen stroom. Laat je even weten waar je bent? Ik maak me een beetje zorgen.',
          time: '12:18',
          outgoing: false
        });
      } else {
        msgs.push({
          from: 'Buurvrouw Ans',
          msg: 'Hoi, stroom is hier ook weg. Alles goed met jou? Laat even iets weten.',
          time: '12:20',
          outgoing: false
        });
      }
      msgs.push({
        from: 'Telefoon',
        msg: '⚠️ Het netwerk is overbelast. Berichten kunnen vertraagd binnenkomen.',
        time: '12:21',
        outgoing: false
      });
      msgs.push({
        from: 'Baas',
        msg: 'Iedereen mag naar huis als dat lukt. Wij sluiten het gebouw. Vergeet je spullen niet en veilige reis gewenst!',
        time: '12:22',
        outgoing: false
      });
      return msgs;
    },
    nlalert: 'NL-Alert\n14 januari 2027 – 12:15\n\nGrote stroomstoring in heel Nederland. Duur onbekend. Verkeerslichten zijn uit. Treinen rijden niet. Blijf kalm en ga veilig naar huis. Update volgt.',
    radio: null
  },
  narrative: 'Verkeerslichten zijn uit. Treinen staan stil. Je manager zegt: "Volgens mij kan iedereen beter naar huis gaan. Werken lukt vandaag toch niet meer." Om je heen pakken collega\'s hun spullen.',
  choices: [{
    text: '🏃 Nu direct vertrekken, vóór het vastloopt',
    consequence: 'Je trekt je jas aan, pakt je spullen en vertrekt meteen. Buiten is het nog redelijk overzichtelijk. Je bent er vroeg bij.',
    stateChange: {
      leftEarly: true
    }
  }, {
    text: '⏳ Nog even op kantoor afwachten wat er gaat komen',
    consequence: 'Je blijft nog even. Een collega heeft een powerbank, dus je laadt je telefoon bij. Om 13:00 vertrek je alsnog, maar dan staat alles vast.',
    stateChange: {}
  }, {
    conditionalOn: () => profile.adults > 1,
    text: '📱 Partner bellen om af te stemmen',
    consequence: () => state.phoneBattery > 0 ? 'Bellen lukt niet, het netwerk zit vol. Je stuurt een bericht: "Ik kom naar huis, geen idee hoe laat ik aankom." Pas veel later zie je een leesteken. Meer contact lukt voorlopig niet.' : 'Je telefoon is leeg. Je kunt je partner niet bereiken.',
    stateChange: {}
  }]
}, {
  id: 'tk_2b',
  time: '12:30',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School De Ster',
      msg: 'De stroom is op school uitgevallen. Wij vangen kinderen op, maar vragen u uw kind zo snel mogelijk op te halen. Aangezien sommige ouders van ver moeten komen blijven we sowieso open tot 18:00.',
      time: '12:28',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const context = state.leftEarly
      ? 'Je bent onderweg naar de uitgang als je telefoon trilt. School stuurt een bericht. De school zit bij jullie huis in de buurt, en snel je kinderen oppikken lukt nu niet.'
      : 'Je telefoon trilt. School stuurt een bericht. Je bent nog op je werk en de school zit bij jullie thuis in de buurt. Even op en neer gaan lukt niet.';
    return context + ' Buiten op straat loopt het verkeer nu al vast.';
  },
  choices: [{
    text: '📱 Vragen of de kinderen bij een vriendje kunnen blijven',
    consequence: () => state.phoneBattery > 0 ?
      'Je belt of stuurt snel een bericht naar een andere ouders. Na wat heen en weer is er iemand die ze wil opvangen. De kinderen zijn veilig. Je haalt ze later op.' :
      'Je telefoon is leeg. Je kunt niemand bereiken. Je moet het later regelen.',
    stateChange: () => state.phoneBattery > 0 ? {
      kidsArranged: true
    } : {}
  }, {
    text: () => profile.adults > 1 ? '📱 Partner vragen de kinderen op te halen' : '📱 Een kennis vragen de kinderen op te halen',
    consequence: () => state.phoneBattery > 0 ? (profile.adults > 1 ? 'Je stuurt een bericht naar je partner. Na twintig minuten komt een reactie: "Ik ga ze ophalen." Dat geeft rust.' : 'Je belt een kennis in de buurt. Na wat aarzeling zegt die: "Oké, ik ga ze halen." Dat lucht op.') : 'Je telefoon is leeg. Je kunt niemand bereiken om de kinderen op te halen.',
    stateChange: () => state.phoneBattery > 0 ? {
      kidsArranged: true
    } : {}
  }, {
    text: '🏫 School kan ze opvangen tot 18:00, hopelijk is dat genoeg',
    consequence: 'Je laat school de opvang voorlopig doen. De kinderen zijn veilig. Eerst moet jij thuiskomen.',
    stateChange: {
      kidsArranged: false
    }
  }]
}, {
  id: 'tk_3b',
  time: '12:58',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => !state.leftEarly,
  channels: {
    news: [],
    whatsapp: [{
      from: 'Collega Martijn',
      msg: 'Wacht even op mij! Ik zie je lopen.',
      time: '12:58',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  narrative: 'Je bent net het kantoor uit als Martijn je roept. Hij komt aanrennen met zijn tas op zijn rug. "Hé, wacht even. Ik ga ook naar huis. Jij gaat toch die kant op? Zullen we samen gaan? Dat is fijner dan alleen."',
  choices: [{
    text: '🤝 Ja, samen op pad met Martijn',
    consequence: 'Martijn loopt naast je mee. Hij kent een route die de drukste wegen omzeilt. Het is prettig om niet alleen te zijn in al die drukte.',
    cat: 'cat-social',
    stateChange: {
      travelingWithMartijn: true,
      foundAlternative: true
    }
  }, {
    text: '👋 Nee, ik ga liever mijn eigen tempo aan',
    consequence: 'Je bedankt Martijn, maar geeft aan dat je liever alleen gaat. Hij knikt begrijpend. "Pas goed op jezelf." Jullie gaan elk een andere kant op.',
    stateChange: {}
  }]
}, {
  id: 'tk_3',
  time: '13:00',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  visuals: {
    image: THUIS_KOMEN_VISUALS.walking
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const vehicle = profile.commuteMode === 'car' ? 'Je auto staat op de parkeerplaats.' : profile.commuteMode === 'bike' ? 'Je fiets staat bij de ingang.' : 'Je bent zonder auto of fiets.';
    const intro = state.leftEarly
      ? 'Je bent net onderweg. Treinen en trams liggen stil. Sommige bussen rijden nog, maar veel lijnen hebben vertraging, een kortere route of vallen uit. Reken er niet op dat het openbaar vervoer je hele reis kan overnemen.'
      : 'Je staat buiten. Treinen en trams liggen stil, want die hebben stroom nodig. Sommige bussen rijden nog, maar veel lijnen hebben vertraging, een kortere route of vallen uit. Reken er niet op dat het openbaar vervoer je hele reis kan overnemen.';
    return `${intro} ${vehicle}`;
  },
  choices: [{
    conditionalOn: () => profile.commuteMode === 'car',
    text: '🚗 Met de auto',
    consequence: () => state.leftEarly
      ? 'Je zit al in de auto. Files zijn al zichtbaar op de grote wegen, maar je bent er vroeg bij.'
      : 'Je loopt naar de parkeerplaats. De grote wegen lopen al vol, maar je hebt tenminste vervoer.',
    stateChange: {
      travelMode: 'car'
    }
  }, {
    text: '🚂 Met de trein',
    consequence: 'Je loopt naar het station. Al van ver zie je de hal vol mensen staan. De borden zijn zwart.',
    stateChange: {
      travelMode: 'train'
    }
  }, {
    text: '🚌 Met de bus',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je loopt naar de bushalte. Er rijdt nog een bus, maar de chauffeur waarschuwt dat de route elk moment kan veranderen. Het is druk. Je betaalt contant en stapt in. Hoe ver je komt, weet niemand.' :
      'Je loopt naar de bushalte. De halte staat vol. Sommige bussen rijden nog, maar veel lijnen hebben vertraging, een kortere route of vallen uit. Je betaalt €10 contant en hoopt dat de bus je een flink stuk verder brengt.',
    stateChange: {
      travelMode: 'ov',
      cash: -10
    }
  }, {
    conditionalOn: () => profile.commuteMode === 'bike',
    text: '🚲 Met de fiets',
    consequence: () => state.leftEarly
      ? 'Je bent op de fiets. Geen files, geen afhankelijkheid van systemen.'
      : 'Je haalt je fiets bij de ingang. Geen files, geen afhankelijkheid van systemen. Je begint te rijden.',
    stateChange: {
      travelMode: 'bike'
    }
  }, {
    conditionalOn: () => profile.commuteMode !== 'bike',
    text: '🚶 Te voet vertrekken',
    consequence: 'Je gaat lopen. Langzaam, maar je bent niet afhankelijk van systemen die uitvallen.',
    stateChange: {
      travelMode: 'walking'
    }
  }]
}, {
  id: 'tk_4a',
  time: '13:15',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'car',
  visuals: {
    image: THUIS_KOMEN_VISUALS.car
  },
  channels: {
    news: [{
      time: '13:05',
      headline: 'Chaos op de wegen, gps-systemen uit en verkeerslichten uitgevallen',
      body: 'Verkeerslichten werken niet meer en navigatie valt op veel plekken weg. Op sommige kruispunten regelen mensen zelf het verkeer. Op hoofdwegen staan lange files.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    return state.leftEarly
      ? 'Je bent al een tijdje onderweg. Binnen een paar straten liep het al vast. Verkeerslichten zijn zwart. Iemand regelt met handgebaren een kruispunt. Je gps doet het niet.'
      : 'Je rijdt de parkeerplaats af. Al na twee straten staat het muurvast. Verkeerslichten zijn zwart. Iemand regelt met handgebaren een kruispunt. Je gps doet het niet.';
  },
  choices: [{
    text: '🛤️ Sluiproute nemen via kleinere wegen',
    consequence: 'Je kent de buurt en kiest kleinere straten. Het gaat langzamer dan normaal, maar je blijft rijden. Tegen het einde van de middag duikt eindelijk je eigen wijk weer op.',
    stateChange: {
      arriveHomeAt1743: true
    }
  }, {
    text: '📱 Telefoon opladen via de auto terwijl je rijdt',
    consequence: 'Je sluit je telefoon aan op de USB-poort van de auto. Terwijl je stapvoets vooruitgaat, laadt hij langzaam op.',
    stateChange: () => ({
      phoneBattery: Math.min(100, state.phoneBattery + 30) - state.phoneBattery
    })
  }, {
    text: '⛽ Tanken bij een tankstation',
    failCondition: () => state.cash < 75,
    failConsequence: () => `Je rijdt een tankstation op. Bij de kassa hangt een briefje: "Alleen contant." Je hebt €${state.cash} bij je — niet genoeg voor €75. Je rijdt verder op wat je nog hebt. Kies een andere optie.`,
    consequence: 'Je rijdt een tankstation op. Bij de kassa zegt iemand: "Alleen contant." Je telt je geld en tankt vol voor €75.',
    stateChange: { comfort: 1, cash: -75 }
  }, {
    text: '🚶 Auto achterlaten en te voet verder',
    consequence: 'Je zet de auto aan de kant en gaat verder te voet. Zwaar, maar je maakt weer meters.',
    stateChange: {
      travelMode: 'walking'
    }
  }]
}, {
  id: 'tk_4b',
  time: '13:15',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'train',
  visuals: {
    image: THUIS_KOMEN_VISUALS.train
  },
  channels: {
    news: [{
      time: '13:00',
      headline: 'NS: alle treinen rijden niet, stations worden gesloten',
      body: 'NS heeft alle treinverbindingen stilgelegd vanwege de stroomstoring. De NS heeft helaas niet genoeg capaciteit om bussen in te zetten.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Het station staat vol met mensen. Honderden reizigers wachten bij de gesloten poortjes. Een NS-medewerker roept door een megafoon: "Er rijden vandaag geen treinen. Verlaat het station." Meteen ontstaat er onrust.',
  choices: [{
    text: '⏳ Wachten, misschien gaan er later toch treinen rijden',
    consequence: 'Je wacht twee uur. Er gebeurt niets. Die tijd ben je kwijt. Daarna moet je alsnog een alternatief zoeken.',
    stateChange: {
      travelMode: 'searching'
    }
  }, {
    text: '🚌 Alternatief zoeken met bus, taxi of lift',
    consequence: 'Je loopt het station uit en kijkt rond. Buiten vragen mensen wie welke kant op moet. Je kunt meerijden met iemand die dezelfde richting op gaat.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'ride'
    }
  }, {
    text: '🚶 Te voet of met de fiets alvast vertrekken',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je besluit te lopen. Het is een lange tocht tussen gestrande reizigers en donkere etalages, maar tegen het einde van de middag bereik je je straat.' :
      profile.commuteDistance === 'far' ?
      'Je woont ver weg. Lopen gaat je vandaag niet thuis brengen, maar stilstaan helpt ook niet. Je begint alvast en kijkt onderweg verder.' :
      'Je woont op middellange afstand. Je besluit te lopen. Het is zwaar, maar tegen het einde van de middag zie je eindelijk je eigen buurt weer.',
    stateChange: () => profile.commuteDistance === 'far' ? {
      travelMode: 'walking'
    } : {
      travelMode: 'walking',
      arriveHomeAt1743: true
    }
  }]
}, {
  id: 'tk_4d',
  time: '13:15',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'bike' || state.travelMode === 'walking',
  get visuals() {
    return {
      image: state.travelMode === 'bike' ? THUIS_KOMEN_VISUALS.bike : THUIS_KOMEN_VISUALS.walking
    };
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    return state.travelMode === 'bike'
      ? 'Je fiets staat klaar. Geen files en geen afhankelijkheid van uitgevallen systemen. De wegen zijn druk maar je kunt erlangs.'
      : 'Je bent te voet vertrokken. Langzaam, maar je bent niet afhankelijk van systemen. De wegen zijn druk, toch kom je vooruit.';
  },
  choices: [{
    text: () => state.travelMode === 'bike' ? '🚲 Direct doorrijden, zonder omwegen' : '🚶 Stevig doorlopen, zonder omwegen',
    consequence: () => profile.commuteDistance === 'far'
      ? (state.travelMode === 'bike' ? 'Je fietst. Na twee uur begin je te twijfelen. Je hebt nog meer dan de helft te gaan.' : 'Je loopt. Na twee uur begin je te twijfelen. Je hebt nog meer dan de helft te gaan.')
      : (state.travelMode === 'bike' ? 'Je houdt een stevig tempo aan. Langs files en donkere kruispunten door kom je stap voor stap dichter bij huis. Tegen het einde van de middag bereik je je wijk.' : 'Je blijft stevig doorlopen. Het is zwaar, maar tegen het einde van de middag zie je eindelijk je straat weer.'),
    stateChange: () => profile.commuteDistance === 'far' ? {
      travelMode: state.travelMode
    } : {
      arriveHomeAt1743: true
    }
  }, {
    text: '🛣️ Alternatieve route via rustige wegen',
    consequence: () => state.travelMode === 'bike'
      ? 'Je neemt rustige fietsroutes. Minder gedoe met drukke kruispunten en meer ruimte om door te rijden. Tegen het einde van de middag draai je je straat in.'
      : 'Je kiest rustige straten en steegjes. Minder gedoe met drukke wegen en grote groepen mensen. Tegen het einde van de middag bereik je eindelijk je buurt.',
    stateChange: {
      arriveHomeAt1743: true
    }
  }, {
    conditionalOn: () => profile.hasChildren && !state.kidsArranged,
    text: '🏘️ Omrijden om kinderen op te halen',
    consequence: () => state.travelMode === 'bike'
      ? 'Je rijdt via school. De kinderen worden erbij gehaald en mogen met je mee. Samen komen jullie tegen het einde van de middag thuis.'
      : 'Je loopt via school. De kinderen worden erbij gehaald en gaan met je mee. Tegen het einde van de middag komen jullie samen thuis.',
    stateChange: {
      arriveHomeAt1743: true,
      kidsPickedUp: true,
      kidsArranged: true
    }
  }]
}, {
  id: 'tk_4c',
  time: '14:15',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'ov',
  visuals: {
    image: THUIS_KOMEN_VISUALS.bus
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    return profile.commuteDistance === 'near' ?
      'Na een uur rijden stopt de bus op een busstation halverwege de route. De chauffeur omroept dat hij hier eindigt. Hij kan niet verder vanwege de storing. Je staat op een onbekend busstation, nog lang niet thuis.' :
      'Na een uur rijden stopt de bus op een busstation. De chauffeur omroept dat hij hier eindigt. Hij kan niet verder vanwege de storing. Je staat op een busstation halverwege, met nog een flink stuk te gaan.';
  },
  choices: [{
    text: '🚌 Een volgende bus pakken',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je koopt een nieuw kaartje voor €10 en wacht op de volgende bus. Die rijdt een stuk verder, maar eindigt ook voor jouw halte. De laatste meters leg je lopend af. Tegen het einde van de middag ben je thuis.' :
      'Je koopt een nieuw kaartje voor €10 en wacht op de volgende bus. Die rijdt je een flink stuk verder. De laatste kilometers loop je alsnog. Tegen het einde van de middag kom je thuis.',
    stateChange: () => ({
      ...(profile.commuteDistance === 'near' ? { travelMode: 'walking' } : {}),
      arriveHomeAt1743: true,
      cash: -10
    })
  }, {
    text: '🚶 Te voet verder',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je besluit het laatste stuk te lopen. Het duurt langer dan je hoopte, maar tegen het einde van de middag bereik je je straat.' :
      'Je begint te lopen. Na een uur vraag je je af of je het thuis gaat halen.',
    stateChange: () => profile.commuteDistance === 'near' ? {
      arriveHomeAt1743: true
    } : {
      travelMode: 'walking'
    }
  }, {
    text: '🚕 Taxi zoeken',
    failCondition: () => state.cash < (profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110),
    failConsequence: () => {
      const cost = profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110;
      return `Je vraagt een taxichauffeur, maar je hebt maar €${state.cash} bij je. Dat is niet genoeg voor €${cost}. Hij weigert. Kies een andere optie.`;
    },
    consequence: () => {
      const cost = profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110;
      return `Je vindt een taxichauffeur die voor cash rijdt. Je betaalt €${cost} en rijdt je alsnog naar huis.`;
    },
    stateChange: () => {
      const cost = profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110;
      return { arriveHomeAt1743: true, foundAlternative: true, cash: -cost };
    }
  }, {
    text: '🚘 Lift vragen aan voorbijrijdende auto\'s',
    consequence: 'Je steekt je duim omhoog. Na tien minuten stopt er een auto. "Welke kant moet je op?" vraagt de bestuurder. Hij rijdt je een stuk verder.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'ride'
    }
  }]
}, {
  id: 'tk_4e',
  time: '15:30',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'walking' && profile.commuteDistance === 'far',
  visuals: {
    image: THUIS_KOMEN_VISUALS.walking
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je loopt al anderhalf uur. Je hebt nog meer dan 40 kilometer te gaan. Je voeten doen pijn. Het begint donker te worden. Zo kom je vandaag niet thuis.',
  choices: [{
    text: '🚘 Liften proberen langs de kant van de weg',
    consequence: 'Je gaat aan de kant van de weg staan met je duim omhoog. Na twintig minuten stopt een busje. De bestuurder neemt je een flink stuk mee.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'ride'
    }
  }, {
    text: '🏠 Aankloppen bij iemand voor onderdak of hulp',
    consequence: 'Je loopt naar een huis en klopt aan. Een vrouw doet open en luistert naar je verhaal. "Kom binnen, we regelen wat." Ze biedt je een plek aan voor de nacht.',
    stateChange: {
      foundAlternative: true
    }
  }, {
    text: '🚲 Een fiets lenen of kopen van een voorbijganger',
    failCondition: () => state.cash < 50,
    failConsequence: () => `Je spreekt een fietser aan. Er is wel een oude fiets te koop, maar alleen voor €50 cash. Je hebt maar €${state.cash} bij je — niet genoeg. Kies een andere optie.`,
    consequence: 'Je spreekt een fietser aan. Hij kent iemand verderop die een oude fiets verkoopt voor €50 cash. Een kwartier later ben je weer onderweg.',
    stateChange: { foundAlternative: true, travelMode: 'bike', cash: -50 }
  }, {
    text: '😤 Toch doorgaan, ik kom er wel',
    consequence: 'Je blijft doorlopen, maar je lichaam protesteert. Na nog twee uur in het donker ben je uitgeput en nog lang niet thuis.',
    stateChange: {
      comfort: -2
    }
  }]
}, {
  id: 'tk_5',
  time: '15:30',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => !state.reachedHome && !state.arriveHomeAt1743 && !state.travelingWithMartijn && !(state.travelMode === 'walking' && profile.commuteDistance === 'far'),
  get visuals() {
    return {
      image: thuisKomenTravelImage(state.travelMode)
    };
  },
  channels: {
    news: [],
    get whatsapp() {
      const msgs = [];
      if (profile.adults > 1) {
        msgs.push({
          from: 'Partner',
          msg: 'Ben je al onderweg? Alles ok thuis, kaarsje aan. Wacht op je.',
          time: '15:45',
          outgoing: false
        });
      }
      msgs.push({
        from: 'Broer/Zus',
        msg: 'Hé, wij horen dat het overal chaos is. Ben je onderweg? Laat even iets weten, wij zitten te wachten.',
        time: '15:52',
        outgoing: false
      });
      return msgs;
    },
    nlalert: null,
    radio: null
  },
  get narrative() {
    const dist = profile.commuteDistance;
    const busStopNote = ' Bij een bushokje zit een oudere mevrouw met een tas op haar schoot. Ze kijkt af en toe naar de weg, maar er is al een tijdje geen bus meer langs gekomen.';
    if (dist === 'near') return 'Je bent bijna thuis. Een korte, ongemakkelijke tocht, maar nog te overzien. De straten zijn vreemd leeg.' + busStopNote;
    if (dist === 'far') return 'Je bent al uren onderweg. Het begint donker te worden. Je bent moe, hongerig en nog steeds niet thuis. De winterkou kruipt steeds verder in je kleren.' + busStopNote;
    return 'Je bent al een tijd onderweg. Je bent moe, maar je komt wel vooruit. Nog een uur of twee.' + busStopNote;
  },
  choices: [{
    text: '💪 Doorgaan, ik kom er wel',
    consequence: 'Je blijft doorgaan. Het kost energie, maar je blijft meters maken. Net als het begint te schemeren draai je eindelijk je straat in.',
    stateChange: {
      arriveHomeAt1743: true
    }
  }, {
    text: '🍎 Ergens stoppen voor eten',
    failCondition: () => state.cash < 10,
    failConsequence: 'Je stapt een bakker binnen, maar je hebt geen contant geld. De bakker wil niet anders. Je loopt met lege handen verder.',
    consequence: 'Je stapt een bakker binnen. "Alleen contant." Je legt een tientje neer en krijgt een broodje en een fles water. Dat helpt meteen. Daarna loop je door en haal je nog voor de avond je huis.',
    stateChange: { food: 1, cash: -10, arriveHomeAt1743: true }
  }, {
    text: '🤝 De mevrouw bij het bushokje helpen',
    consequence: 'Je loopt naar haar toe. Ze zit er al een uur en weet niet meer hoe ze thuis moet komen. Je helpt haar haar dochter te bereiken. Die komt haar ophalen. Het kost je tijd, maar daarna haal je nog net voor de avond je huis.',
    stateChange: {
      helpedStranger: true,
      arriveHomeAt1743: true
    }
  }]
}, {
  id: 'tk_5m',
  time: '15:30',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelingWithMartijn && !state.reachedHome && !state.arriveHomeAt1743,
  visuals: {
    image: THUIS_KOMEN_VISUALS.walking
  },
  channels: {
    news: [],
    get whatsapp() {
      const msgs = [];
      if (profile.adults > 1) {
        msgs.push({
          from: 'Partner',
          msg: 'Ben je al onderweg? Alles oke thuis, kaarsje aan. Wacht op je.',
          time: '15:45',
          outgoing: false
        });
      }
      msgs.push({
        from: 'Broer/Zus',
        msg: 'Hé, wij horen dat het overal chaos is. Ben je onderweg? Laat even iets weten, wij zitten te wachten.',
        time: '15:52',
        outgoing: false
      });
      return msgs;
    },
    nlalert: null,
    radio: null
  },
  narrative: 'Onderweg kom je langs Martijns huis. "Loop even mee naar binnen," zegt hij. "Eerst een boterham, dan ga je weer verder." Zijn vrouw doet open. Zodra ze Martijn ziet, omhelst ze hem stevig. "Gelukkig ben je thuis." Ze zet kaarsjes op tafel en snijdt brood.',
  choices: [{
    text: '🥪 Even binnen zitten en een boterham eten',
    consequence: 'Je zit even aan de keukentafel. Martijns vrouw schenkt thee en vraagt hoe het was. Midden in deze lange dag voelt dat als echte rust. Daarna ga je verder en bereik je nog voor de avond je huis.',
    stateChange: { food: 1, comfort: 1, arriveHomeAt1743: true }
  }, {
    text: '👋 Bedanken en meteen doorlopen',
    consequence: 'Je bedankt hen beiden en gaat meteen verder. Niet veel later draai je je eigen straat in.',
    stateChange: {
      arriveHomeAt1743: true
    }
  }]
}, {
  id: 'tk_5c',
  time: '17:43',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Thuis',
  dayBadgeClass: 'green',
  conditionalOn: () => state.arriveHomeAt1743,
  channels: {
    news: [],
    get whatsapp() {
      const msgs = [];
      if (profile.adults > 1) msgs.push({
        from: 'Partner',
        msg: 'Waar blijf je? We hebben kaarsen aan en wachten op je.',
        time: '17:28',
        outgoing: false
      });
      if (profile.hasChildren && !state.kidsArranged && !state.kidsPickedUp) msgs.push({
        from: 'School De Ster',
        msg: 'We zijn nog open, maar sluiten vandaag om 18:00. Laat even weten als u eraan komt.',
        time: '17:35',
        outgoing: false
      });
      return msgs;
    },
    nlalert: null,
    radio: null
  },
  get narrative() {
    if (profile.adults > 1) {
      return 'Het is 17:43 als je eindelijk je straat in draait. De voordeur gaat open nog voor je aanbelt. Binnen ruik je kaarsvet en warm eten. Je bent thuis, eerder dan je vanmiddag nog had durven hopen.';
    }
    return 'Het is 17:43 als je eindelijk je straat in draait. Je steekt de sleutel in het slot en stapt een donker maar vertrouwd huis binnen. Je bent thuis, eerder dan je vanmiddag nog had durven hopen.';
  },
  choices: [{
    text: '🕯️ Eerst even zitten en op adem komen',
    consequence: () => state.phoneBattery < 20
      ? 'Je ploft neer. Je telefoon staat bijna leeg, maar jij bent thuis. Voor nu is dat genoeg.'
      : 'Je ploft neer en voelt de spanning uit je schouders zakken. Je bent thuis.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: () => profile.adults > 1 ? '📱 Partner en familie laten weten dat je veilig bent' : '📱 Familie laten weten dat je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Je stuurt snel een paar berichten. Iedereen was ongerust. Nu weten ze dat je veilig thuis bent.' : 'Je telefoon is leeg. Je kunt niemand meer bereiken, maar je bent wel veilig thuis.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: '👶 Kinderen ophalen op de afgesproken plek',
    consequence: 'Je zet je tas neer en gaat meteen weer op pad. Gelukkig ben je nog ruim op tijd. De kinderen zijn veilig opgevangen en opgelucht je te zien.',
    stateChange: {
      kidsPickedUp: true,
      reachedHome: true
    },
    conditionalOn: () => profile.hasChildren && !state.kidsPickedUp && state.kidsArranged
  }, {
    text: '👶 Nu direct naar school of opvang gaan',
    consequence: 'Je bent nog net op tijd. De leerkracht doet open en zegt opgelucht: "Fijn dat u er bent." Even later ga je met de kinderen weer naar huis.',
    stateChange: {
      kidsPickedUp: true,
      reachedHome: true
    },
    conditionalOn: () => profile.hasChildren && !state.kidsPickedUp && !state.kidsArranged
  }, {
    text: '🏠 Huis controleren, gas, kaarsjes en ramen nalopen',
    consequence: 'Je loopt een rustige ronde door het huis. Alles is in orde. De kaarsjes staan veilig en het gas is dicht.',
    stateChange: {
      reachedHome: true
    },
    conditionalOn: () => !profile.hasChildren || state.kidsPickedUp
  }]
}, {
  id: 'tk_5b',
  time: '20:00',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => profile.commuteDistance === 'far' && !state.reachedHome && !state.foundAlternative && !state.travelingWithMartijn && !state.arriveHomeAt1743,
  get visuals() {
    return {
      image: thuisKomenTravelImage(state.travelMode)
    };
  },
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Het is donker en koud. Je bent uitgeput en nog niet thuis. Verder gaan lukt vandaag niet meer. Wat doe je?',
  get choices() {
    const opts = [{
      text: '🏠 Aankloppen bij een willekeurig huis',
      consequence: 'Je klopt aan bij een verlicht huis. Een man doet open. "Wat een dag met die stroomstoring. Kom binnen." Je slaapt op de bank. De volgende ochtend vertrek je fris verder.',
      stateChange: {
        foundAlternative: true,
        comfort: 1
      }
    }, {
      text: '📞 Het gemeentelijke noodnummer bellen',
      consequence: () => state.phoneBattery > 0 ? 'Je belt het gemeentelijke noodnummer. Ze verwijzen je naar tijdelijke opvang in een dorpshuis 500 meter verderop. Je slaapt er op een slaapmat. Warm en veilig.' : 'Je telefoon is leeg. Je kunt niemand bereiken. Je loopt op goed geluk naar de dichtstbijzijnde plek waar nog licht brandt.',
      stateChange: () => state.phoneBattery > 0 ? {
        foundAlternative: true,
        calledRescue: true
      } : {}
    }];
    if (state.travelMode === 'car') opts.splice(1, 0, {
      text: '🚗 Overnachten in de auto',
      consequence: 'Je vindt een zijstraat en kruipt op de achterbank. Het is koud, maar wel droog. Je trekt alles wat je bij je hebt over je heen. Je slaapt een paar uur.',
      stateChange: {
        comfort: -1
      }
    });
    return opts;
  }
}, {
  id: 'tk_6',
  time: '21:00',
  date: 'Donderdag 14 januari 2027',
  dayBadge: 'Thuis',
  dayBadgeClass: 'green',
  conditionalOn: () => !state.arriveHomeAt1743,
  channels: {
    news: [],
    get whatsapp() {
      const msgs = [];
      if (profile.adults > 1) msgs.push({
        from: 'Partner',
        msg: 'Waar ben je? Ik maak me zorgen. Meld je even.',
        time: '18:10',
        outgoing: false
      });
      if (profile.hasChildren && !state.kidsArranged && !state.kidsPickedUp) msgs.push({
        from: 'School De Ster',
        msg: 'Goedenavond. We hebben uw kind tot 18:00 opgevangen, maar u was nog niet bereikbaar. Juf Marieke heeft uw kind mee naar huis genomen. U kunt uw kind daar ophalen. Stuur een berichtje als u er bijna bent.',
        time: '18:45',
        outgoing: false
      });
      return msgs;
    },
    nlalert: null,
    radio: null
  },
  get narrative() {
    if (state.reachedHome) return profile.adults > 1 ?
      'Je bent thuis. De deur gaat open en je ruikt kaarsen. Je partner staat in de gang. Het is donker in huis, maar warm genoeg.' :
      'Je bent thuis. Je doet de deur open. Het huis is donker maar warm genoeg.';
    if (profile.commuteDistance === 'near') return 'Je bent eindelijk thuis. Voor zo\'n korte afstand was het een opvallend lange dag.';
    return 'Je bent thuisgekomen, later dan verwacht en uitgeput, maar wel veilig. De kaarsen branden. Thuis voelt zelden zo goed als na een dag als deze.';
  },
  choices: [{
    text: '🕯️ Eerst even zitten en op adem komen',
    consequence: () => state.phoneBattery < 20
      ? 'Je ploft neer. Je telefoon staat bijna leeg. Je bent veilig thuis.'
      : 'Je ploft neer. Je bent veilig thuis.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: () => profile.adults > 1 ? '📱 Partner en familie laten weten dat je veilig bent' : '📱 Familie laten weten dat je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Je stuurt berichten. Iedereen was ongerust. Nu weten ze dat je veilig thuis bent.' : 'Je telefoon is leeg. Je kunt niemand bereiken.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: '👶 Kinderen ophalen op de afgesproken plek',
    consequence: 'Je zet je tas neer en gaat er direct weer op uit. De kinderen zijn veilig opgevangen en blij je te zien zodra je aankomt.',
    stateChange: {
      kidsPickedUp: true
    },
    conditionalOn: () => profile.hasChildren && !state.kidsPickedUp && state.kidsArranged
  }, {
    text: '👶 Kinderen ophalen bij juf Marieke',
    consequence: 'Je stuurt juf Marieke een berichtje en loopt naar haar huis. De kinderen zijn moe, maar veilig. Op de terugweg vallen ze bijna in slaap.',
    stateChange: {
      kidsPickedUp: true
    },
    conditionalOn: () => profile.hasChildren && !state.kidsPickedUp && !state.kidsArranged
  }, {
    text: '🏠 Huis controleren, gas, kaarsjes en ramen nalopen',
    consequence: 'Je loopt door het huis. Alles is in orde. De kaarsjes staan veilig in houders en het gas is dicht.',
    stateChange: {
      reachedHome: true
    },
    conditionalOn: () => !profile.hasChildren || state.kidsPickedUp
  }]
}, ];

/* ─── SCENE ACHTERGRONDAFBEELDINGEN ─────────────────────────────────────────
   Koppelt scène-ID aan achtergrondafbeelding voor dit scenario.
   Wordt in engine.js samengevoegd tot sceneBgMap.
*/
const sceneImages_thuis_komen = {
  tk_1:  THUIS_KOMEN_VISUALS.office,
  tk_2:  THUIS_KOMEN_VISUALS.office,
  tk_2b: THUIS_KOMEN_VISUALS.office,
  tk_3b: THUIS_KOMEN_VISUALS.office,
  tk_3:  THUIS_KOMEN_VISUALS.walking,
  tk_4a: THUIS_KOMEN_VISUALS.car,
  tk_4b: THUIS_KOMEN_VISUALS.train,
  tk_4c: THUIS_KOMEN_VISUALS.bus,
  tk_4d: THUIS_KOMEN_VISUALS.walking,
  tk_4e: THUIS_KOMEN_VISUALS.walking,
  tk_5:  THUIS_KOMEN_VISUALS.walking,
  tk_5m: THUIS_KOMEN_VISUALS.walking,
  tk_5c: THUIS_KOMEN_VISUALS.home,
  tk_5b: THUIS_KOMEN_VISUALS.walking,
  tk_6:  THUIS_KOMEN_VISUALS.home,
};
