// ═══════════════════════════════════════════════════════════════
// Scenario: Thuis Komen — "Onderweg naar huis"
// 12 scenes — van tk_1 (kantoor) tot tk_7 (thuis)
// Tijdspanne: ~9 uur (werk → thuis)
// ═══════════════════════════════════════════════════════════════

// ─── THUIS KOMEN SCENARIO ────────────────────────────────────────────────────
const scenes_thuis_komen = [{
  id: 'tk_1',
  time: '11:57',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Collega Martijn',
      msg: 'Is jouw scherm ook zwart? De wifi ligt er hier ook uit.',
      time: '11:58',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  narrative: 'Midden op een gewone donderdagochtend worden alle beeldschermen op kantoor ineens zwart. Het licht valt uit. De ventilatie stopt. Opeens is het stil. Daarna hoor je alleen nog verbaasde stemmen en losse vragen. Je telefoon doet het nog op 4G, maar het signaal hapert.',
  choices: [{
    text: '💻 Doorwerken op laptopbatterij',
    consequence: 'Je klapt je laptop open. Batterij op 62%. Wifi is weg, dus je verbindt via je telefoon. Het werkt, maar traag. Het netwerk is overbelast. Na een kwartier geef je het op. Dit heeft geen zin.',
    stateChange: {}
  }, {
    text: '📱 Telefoon eerst opladen via de laptop',
    consequence: 'Slimme prioriteit. Je sluit de telefoon aan op de laptop via USB. Terwijl je wacht op nieuws laadt de telefoon op. De laptop heeft genoeg accu om flink bij te dragen.',
    stateChange: {
      phoneBattery: 30
    }
  }, {
    text: '🚗 Meteen spullen pakken en vertrekken',
    consequence: 'Je pakt direct je spullen en verlaat het gebouw. De straat staat al vol mensen. Jij bent er vroeg bij, dus de files zijn er nog niet.',
    stateChange: {
      awarenessLevel: 1
    }
  }]
}, {
  id: 'tk_2',
  time: '12:20',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '12:15',
      headline: 'Grote stroomstoring treft heel Nederland, duur onbekend',
      body: 'Er is een grote stroomstoring in vrijwel heel Nederland. De oorzaak wordt onderzocht. Treinen rijden niet meer. Verkeerslichten zijn uit. De overheid vraagt iedereen kalm te blijven.'
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
        from: 'Baas',
        msg: 'Iedereen mag naar huis als dat lukt. Wij sluiten het gebouw. Vergeet uw spullen niet.',
        time: '12:55',
        outgoing: false
      });
      return msgs;
    },
    nlalert: 'NL-Alert\n15 januari 2027 – 12:15\n\nGrote stroomstoring in heel Nederland. Duur onbekend. Verkeerslichten zijn uit. Treinen rijden niet. Blijf kalm en ga veilig naar huis. Update volgt.',
    radio: null
  },
  narrative: 'Verkeerslichten zijn uit. Treinen staan stil. Op kantoor zegt je baas: "Iedereen naar huis, zo snel als het kan." Je kijkt naar je collega\'s. Sommigen vertrekken al. <span style="background:#fff8e1;border-radius:var(--r-sm);padding:2px 6px;font-size:.82rem;color:#92400e">⚠️ Netwerk overbelast, berichten kunnen vertraagd binnenkomen</span>',
  choices: [{
    text: '🚗 Nu direct vertrekken, vóór de files',
    consequence: 'Je pakt alles en vertrekt. De weg is nog redelijk vrij. Je hebt een voorsprong op de massa.',
    stateChange: {
      leftEarly: true
    }
  }, {
    text: '⏳ Wachten, baas vraagt iedereen tot 14:00 te blijven',
    consequence: 'Je blijft. Je laadt je telefoon bij een collega op een powerbank. Om 13:00 vertrek je, maar tegen die tijd staat alles in de file.',
    stateChange: {}
  }, {
    text: '📱 Partner bellen om af te stemmen',
    consequence: () => state.phoneBattery > 0 ? 'Bellen lukt niet, het netwerk zit vol. Je stuurt een WhatsApp: "Kom naar huis, duur onbekend." Een uur later krijg je een leesteken. Meer communicatie zit er niet in.' : 'Je telefoon is leeg. Je kunt je partner niet bereiken.',
    stateChange: {}
  }]
}, {
  id: 'tk_2b',
  time: '12:30',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Werk',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School De Ster',
      msg: 'De stroom is op school uitgevallen. Wij vangen kinderen op, maar vragen u uw kind zo snel mogelijk op te halen. We blijven open tot 18:00.',
      time: '12:28',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const context = state.leftEarly ?
      'Je bent al onderweg als je telefoon trilt. School stuurt een bericht.' :
      'Je telefoon trilt. Je bent nog op het werk.';
    return context + ' Buiten op straat staat het al vast. Alle schermen zijn zwart.';
  },
  choices: [{
    text: '🚗 Nu direct ophalen, eerst de kinderen en dan naar huis',
    consequence: 'Je rijdt direct naar school. De kinderen zijn blij je te zien. Je lost dit samen op.',
    stateChange: {
      kidsArranged: true,
      kidsPickedUp: true
    }
  }, {
    text: () => profile.adults > 1 ? '📱 Partner vragen de kinderen op te halen' : '📱 Een kennis vragen de kinderen op te halen',
    consequence: () => state.phoneBattery > 0 ? (profile.adults > 1 ? 'Je stuurt een WhatsApp naar je partner. Na 20 minuten een bevestiging: "Ik ga ze ophalen." Opgelost.' : 'Je belt een kennis die in de buurt woont. Na wat aarzeling: "Oké, ik ga ze halen." Opgelost.') : 'Je telefoon is leeg. Je kunt niemand bereiken om de kinderen op te halen.',
    stateChange: () => state.phoneBattery > 0 ? {
      kidsArranged: true
    } : {}
  }, {
    text: '🏫 School kan ze opvangen tot 18:00, later regelen',
    consequence: 'Je besluit school de kinderen te laten opvangen. Ze zijn veilig. Jij regelt eerst de thuisreis.',
    stateChange: {
      kidsArranged: false
    }
  }]
}, {
  id: 'tk_3',
  time: '13:00',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Collega Martijn',
      msg: 'Jij gaat toch ook naar huis? Ik ook. Zullen we samen optrekken? Dan zijn we in ieder geval niet alleen.',
      time: '13:03',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const vehicle = profile.commuteMode === 'car' ? 'Je auto staat op de parkeerplaats.' : profile.commuteMode === 'bike' ? 'Je fiets staat bij de ingang.' : 'Je bent zonder auto of fiets.';
    return `Je staat buiten. Treinen en trams liggen stil, want die hebben stroom nodig. Sommige bussen rijden nog, maar het is onzeker. ${vehicle}`;
  },
  choices: [{
    conditionalOn: () => profile.commuteMode === 'car',
    text: '🚗 Met de auto',
    consequence: 'Je loopt naar de parkeerplaats. Files zijn al zichtbaar op de grote wegen. Maar je hebt een auto.',
    stateChange: {
      travelMode: 'car'
    }
  }, {
    text: '🚂 Met de trein',
    consequence: 'Je loopt naar het station. Al van ver zie je dat het station vol staat met mensen. De borden zijn zwart.',
    stateChange: {
      travelMode: 'train'
    }
  }, {
    text: '🚌 Met de bus',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je loopt naar de bushalte. Er rijdt nog een bus, maar de dienstregeling klopt niet meer. Je kunt contant betalen en stapt in zodra er plek is.' :
      'Je loopt naar de bushalte. De bus rijdt nog, maar het is druk. Je betaalt €10 contant en hoopt op het beste.',
    stateChange: {
      travelMode: 'ov',
      cash: -10
    }
  }, {
    conditionalOn: () => profile.commuteMode === 'bike',
    text: '🚲 Met de fiets',
    consequence: 'Je haalt je fiets bij de ingang. Geen files, geen infrastructuur nodig. Je begint te rijden.',
    stateChange: {
      travelMode: 'bike'
    }
  }, {
    conditionalOn: () => profile.commuteMode !== 'bike',
    text: '🚶 Te voet vertrekken',
    consequence: 'Je begint te lopen. Langzaam maar zeker, zonder afhankelijk te zijn van uitgevallen systemen.',
    stateChange: {
      travelMode: 'bike'
    }
  }, {
    text: '🤝 Samen optrekken met collega Martijn',
    consequence: 'Martijn gaat dezelfde kant op. Jullie vertrekken samen. Het is rustgevend om niet alleen te zijn in al die drukte. Onderweg wisselen jullie van gedachten over wat jullie thuis te wachten staat.',
    stateChange: () => ({
      helpedStranger: true,
      foundAlternative: true,
      travelMode: profile.commuteMode === 'car' ? 'car' : 'bike'
    })
  }]
}, {
  id: 'tk_4a',
  time: '13:15',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'car',
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
  narrative: 'Je rijdt de parkeerplaats af. Al na twee straten staat het muurvast. Verkeerslichten zijn zwart. Iemand regelt handmatig een kruispunt. GPS doet het niet.',
  choices: [{
    text: '🛤️ Sluiproute nemen via kleinere wegen',
    consequence: 'Je kent de buurt en neemt kleinere straten. Langzamer maar minder file. Na twee uur ben je thuis.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: '📱 Telefoon opladen via de auto terwijl je rijdt',
    consequence: 'Je sluit de telefoon aan op de USB-poort van de auto. Terwijl je in de file staat laadt hij op. Elke procent telt.',
    stateChange: {
      phoneBattery: 30
    }
  }, {
    text: '⛽ Tanken bij een tankstation',
    consequence: () => profile.hasEDCBag ?
      'Je rijdt een tankstation op. "Alleen contant", zegt de pomp. Je hebt nog cash bij je en tankt vol voor €75.' :
      'Je rijdt een tankstation op. "Alleen contant", zegt de pomp. Je voelt in je jaszak, maar daar zit niets. Je kunt niet tanken en rijdt verder op wat je nog hebt.',
    stateChange: () => profile.hasEDCBag ? {
      comfort: 1,
      cash: -75
    } : {
      comfort: -1
    }
  }, {
    text: '🚶 Auto achterlaten en te voet verder',
    consequence: 'Je zet de auto in een parkeerzone en loopt. Zwaar, maar je komt vooruit.',
    stateChange: {
      travelMode: 'bike'
    }
  }]
}, {
  id: 'tk_4b',
  time: '13:15',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'train',
  channels: {
    news: [{
      time: '13:00',
      headline: 'NS: alle treinen rijden niet, stations worden gesloten',
      body: 'NS heeft alle treinverbindingen stilgelegd vanwege de stroomstoring. Stations worden gesloten. Reizigers worden verzocht het station te verlaten.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Het station staat vol met mensen. Honderden reizigers wachten voor de gesloten poortjes. Een NS-medewerker roept door een megafoon: "Er rijden vandaag geen treinen. Verlaat het station." Meteen ontstaat er onrust.',
  choices: [{
    text: '⏳ Wachten, misschien gaan er later toch treinen rijden',
    consequence: 'Je wacht twee uur. Er gebeurt niets. Die tijd ben je kwijt. Daarna moet je alsnog een alternatief zoeken.',
    stateChange: {
      travelMode: 'searching'
    }
  }, {
    text: '🚌 Alternatief zoeken met bus, taxi of lift',
    consequence: 'Je loopt het station uit en kijkt rond. Er staan mensen die liften aanbieden. Je springt bij iemand die dezelfde richting op gaat.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'car'
    }
  }, {
    text: '🚶 Te voet of met de fiets alvast vertrekken',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je woont dichtbij. Je besluit te lopen. Na anderhalf uur ben je thuis, moe maar voldaan.' :
      profile.commuteDistance === 'far' ?
      'Je woont ver weg. Lopen is eigenlijk geen optie, want het zijn tientallen kilometers. Toch begin je alvast terwijl je een alternatief zoekt.' :
      'Je woont op middellange afstand. Je besluit te lopen. Het is zwaar maar haalbaar.',
    stateChange: () => profile.commuteDistance === 'far' ? {
      travelMode: 'walking'
    } : {
      travelMode: 'bike',
      reachedHome: profile.commuteDistance === 'near'
    }
  }]
}, {
  id: 'tk_4c',
  time: '13:15',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'ov',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    return profile.commuteDistance === 'near' ?
      'Er rijdt nog een bus. De chauffeur zegt dat de route kan veranderen als wegen vastlopen. Je stapt in. Er zijn meer mensen dan normaal, maar je komt vooruit.' :
      'De bus rijdt, maar de halte is overvol. De route loopt vertraging op. Het is druk en de chauffeur weet niet zeker of alle stops gehaald worden.';
  },
  choices: [{
    text: '🚶 Te voet verder',
    consequence: () => profile.commuteDistance === 'near' ?
      'Je woont dichtbij. Na een uur lopen ben je thuis.' :
      'Je begint te lopen. Na een uur begin je te twijfelen of je dit thuis komt.',
    stateChange: () => profile.commuteDistance === 'near' ? {
      reachedHome: true
    } : {
      travelMode: 'walking'
    }
  }, {
    text: '🚕 Taxi of deelfiets zoeken',
    consequence: () => {
      const cost = profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110;
      if (state.cash === 0) return 'Je zoekt een taxi maar niemand rijdt zonder contant geld en je hebt niets bij je. Je loopt toch.';
      if (state.cash >= cost) return `Je vindt een taxichauffeur die voor cash rijdt. Je betaalt €${cost} en rijdt naar huis.`;
      return `Je vindt een taxichauffeur. Je hebt maar €${state.cash} bij je. Hij brengt je een stuk op weg, maar niet helemaal thuis. Je loopt de rest.`;
    },
    stateChange: () => {
      const cost = profile.commuteDistance === 'near' ? 50 : profile.commuteDistance === 'far' ? 180 : 110;
      if (state.cash === 0) return {
        travelMode: 'walking'
      };
      if (state.cash >= cost) return {
        reachedHome: true,
        comfort: 1,
        cash: -cost
      };
      return {
        foundAlternative: true,
        travelMode: 'walking',
        cash: -state.cash
      };
    }
  }, {
    text: '🚘 Lift vragen aan voorbijrijdende auto\'s',
    consequence: 'Je steekt je duim omhoog. Na tien minuten stopt er een auto. "Welke kant ga jij op?" Hij rijdt je een stuk verder.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'car'
    }
  }]
}, {
  id: 'tk_4d',
  time: '13:15',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'bike',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je hebt je fiets bij je, of je bent alvast begonnen te lopen. Geen files en geen afhankelijkheid van uitgevallen systemen. De wegen zijn druk maar je kunt erlangs.',
  choices: [{
    text: '🚲 Direct doorrijden, zonder omwegen',
    consequence: () => profile.commuteDistance === 'far' ?
      'Je fietst. Na twee uur begin je te twijfelen. Je hebt nog meer dan de helft te gaan.' :
      'Je fietst stevig door. Na anderhalf uur ben je thuis. Moe maar voldaan.',
    stateChange: () => profile.commuteDistance === 'far' ? {
      travelMode: 'bike'
    } : {
      reachedHome: true
    }
  }, {
    text: '🛣️ Alternatieve route via rustige wegen',
    consequence: 'Je neemt de rustige fietsroutes. Geen gedoe met auto\'s die de weg op rijden. Je bent na twee uur thuis.',
    stateChange: {
      reachedHome: true
    }
  }, {
    conditionalOn: () => profile.hasChildren && !state.kidsArranged,
    text: '🏘️ Omrijden om kinderen op te halen',
    consequence: 'Je rijdt via school. De kinderen staan al buiten te wachten. Samen fietsen jullie naar huis.',
    stateChange: {
      reachedHome: true,
      kidsPickedUp: true,
      kidsArranged: true
    }
  }]
}, {
  id: 'tk_4e',
  time: '15:30',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => state.travelMode === 'walking' && profile.commuteDistance === 'far',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je loopt al anderhalf uur. Je hebt nog meer dan 40 kilometer te gaan. Je voeten doen pijn. Het begint donker te worden. Dit gaat niet lukken vandaag.',
  choices: [{
    text: '🚘 Liften proberen langs de kant van de weg',
    consequence: 'Je gaat aan de kant van de weg staan met je duim omhoog. Na twintig minuten stopt een busje. De bestuurder rijdt je een stuk mee.',
    stateChange: {
      foundAlternative: true,
      travelMode: 'car'
    }
  }, {
    text: '🏠 Aankloppen bij iemand voor onderdak of hulp',
    consequence: 'Je loopt naar een huis en klopt aan. Een vrouw doet open en luistert naar je verhaal. "Kom binnen, we regelen wat." Ze biedt je een plek aan voor de nacht.',
    stateChange: {
      foundAlternative: true,
      helpedStranger: true
    }
  }, {
    text: '🚲 Een fiets lenen of kopen van een voorbijganger',
    consequence: 'Je vraagt een fietser die naar huis rijdt of hij een reservefiets heeft of een plek weet. Hij kent iemand die een oude fiets verkoopt voor €50 cash.',
    stateChange: () => profile.hasEDCBag ? {
      foundAlternative: true,
      travelMode: 'bike',
      cash: -50
    } : {
      travelMode: 'walking'
    }
  }, {
    text: '😤 Toch doorgaan, ik kom er wel',
    consequence: 'Je bijt door. Maar je lichaam protesteert. Na nog twee uur lopen in het donker ben je uitgeput en nog lang niet thuis.',
    stateChange: {
      comfort: -2
    }
  }]
}, {
  id: 'tk_5',
  time: '15:30',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => !state.reachedHome,
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
    if (dist === 'near') return 'Je bent bijna thuis. Een korte, ongemakkelijke rit maar niets dramatisch. De straten zijn vreemd leeg.';
    if (dist === 'far') return 'Je bent al uren onderweg. Het begint donker te worden. Je bent moe, hongerig en nog steeds niet thuis. De winterkou trekt steeds verder door je kleren heen.';
    return 'Je bent al een tijd onderweg. Je bent moe, maar je komt wel vooruit. Nog een uur of twee.';
  },
  choices: [{
    text: '💪 Doorgaan, ik kom er wel',
    consequence: 'Je bijt door. Het is zwaar, maar je maakt wel voortgang. Stap voor stap.',
    stateChange: {}
  }, {
    text: '🍎 Ergens stoppen voor eten',
    consequence: () => profile.hasEDCBag ?
      'Je stapt een bakker binnen. "Alleen contant." Je legt een tientje neer en krijgt een broodje en een fles water terug. Energie terug.' :
      'Je probeert iets te kopen maar zonder cash lukt het niet overal. Je vraagt een bakker om een broodje. Hij geeft het je.',
    stateChange: () => profile.hasEDCBag ? {
      food: 1,
      cash: -20
    } : {
      food: 1
    }
  }, {
    text: '🤝 Iemand onderweg helpen die het moeilijker heeft',
    consequence: 'Een oudere mevrouw staat verward bij een bushokje. Je helpt haar contact zoeken met haar familie. Ze kan bij hen overnachten. Je liep 20 minuten vertraging op, maar je voelde je beter.',
    stateChange: {
      helpedStranger: true
    }
  }]
}, {
  id: 'tk_5b',
  time: '20:00',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Onderweg',
  dayBadgeClass: '',
  conditionalOn: () => profile.commuteDistance === 'far' && !state.foundAlternative,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Het is donker en koud. Je bent uitgeput. Je bent nog niet thuis. Je kunt niet verder vandaag. Wat doe je?',
  get choices() {
    const opts = [{
      text: '🏠 Aankloppen bij een willekeurig huis',
      consequence: 'Je klopt aan bij een verlicht huis. Een man doet open. "Stroomstoring toch, kom binnen." Je slaapt op de bank. De volgende ochtend vertrek je fris verder.',
      stateChange: {
        foundAlternative: true,
        helpedStranger: true,
        comfort: 1
      }
    }, {
      text: '📞 Het gemeentelijke noodnummer bellen',
      consequence: () => state.phoneBattery > 0 ? 'Je belt het gemeentelijke noodnummer. Ze verwijzen je naar een tijdelijke opvang in een dorpshuis op 500 meter. Je slaapt er op een slaapmat. Warm en veilig.' : 'Je telefoon is leeg. Je kunt niemand bereiken. Je loopt op goed geluk naar de dichtstbijzijnde plek met licht.',
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
  time: '18:00',
  date: 'Donderdag 15 januari 2027',
  dayBadge: 'Thuis',
  dayBadgeClass: 'green',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Partner',
      msg: 'Waar ben je?? Ik maak me zorgen. Meld je even',
      time: '18:10',
      outgoing: false
    }],
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
    text: '🕯️ Thuis is goed, eerst even uitrusten',
    consequence: 'Je ploft neer. Je telefoon staat bijna leeg. Je hebt het gered.',
    stateChange: {
      reachedHome: true
    }
  }, {
    text: () => profile.adults > 1 ? '📱 Partner en familie laten weten dat je veilig bent' : '📱 Familie laten weten dat je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Je stuurt berichten. Iedereen was ongerust. Nu weten ze het.' : 'Je telefoon is leeg. Je kunt niemand bereiken.',
    stateChange: () => state.phoneBattery > 0 ? {
      reachedHome: true
    } : {}
  }, {
    text: () => profile.hasChildren && !state.kidsPickedUp ? '👶 Eerst kijken hoe het met de kinderen gaat' : '🏠 Huis controleren, gas, kaarsjes en ramen nalopen',
    consequence: () => profile.hasChildren && !state.kidsPickedUp ?
      'De kinderen zijn nog bij school of ergens anders. Je regelt direct dat ze worden opgehaald.' :
      'Je loopt door het huis. Alles in orde. Kaarsjes veilig in houders. Gas dicht gedraaid.',
    stateChange: () => profile.hasChildren && !state.kidsPickedUp ? {
      kidsPickedUp: true
    } : {
      reachedHome: true
    }
  }]
}, ];
