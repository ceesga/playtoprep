// ═══════════════════════════════════════════════════════════════
// Scenario: Vervuild drinkwater — "Bruin water uit de kraan"
// 8 scènes — van wd_0 (13:10) tot wd_7 (20:30)
// Tijdspanne: ~7 uur op één dinsdagmiddag
// ═══════════════════════════════════════════════════════════════

const scenes_drinkwater = [{
  id: 'wd_0',
  time: '13:10',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '13:05',
      headline: 'Meldingen over troebel kraanwater in meerdere wijken',
      body: 'Vitens onderzoekt meldingen van bruin en troebel kraanwater in delen van de gemeente. De oorzaak is nog niet duidelijk. Gebruik kraanwater voorlopig niet om ongekookt te drinken.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Heb jij ook bruin water uit de kraan? Ik schrok me een ongeluk.',
      time: '13:08',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Er zijn meldingen van troebel kraanwater in meerdere wijken in de gemeente. Vitens onderzoekt de oorzaak. Gebruik kraanwater voorlopig liever niet om te drinken als dat niet nodig is.'
  },
  get narrative() {
    const kook = profile.hasKit === 'ja' || profile.hasWater === 'ja'
      ? ' Je hebt gelukkig al wat schoon water in huis.'
      : '';
    const afgelegen = !profile.location.includes('stedelijk')
      ? ' Je woont niet midden in de stad. De dichtstbijzijnde supermarkt is een eind weg — flessenwater halen is niet even om de hoek.'
      : '';
    const kinderen = profile.hasChildren
      ? (profile.childrenCount === 1
        ? ' Je denkt meteen aan je kind: wat kan die drinken?'
        : ' Je denkt meteen aan de kinderen: wat kunnen zij drinken?')
      : '';
    return 'Je draait de kraan open om iets te drinken te pakken. Het water is niet helder. Het is lichtbruin en ruikt anders dan normaal. Je zet de kraan meteen uit. Je telefoon geeft een melding van het waterbedrijf.' + kook + afgelegen + kinderen;
  },
  choices: [{
    text: '📱 Online zoeken wat er aan de hand is',
    consequence: 'Op de website van Vitens staat een kort bericht: meldingen van troebel kraanwater, oorzaak wordt onderzocht. De gemeente verwijst naar dezelfde pagina. Er is nog geen kookadvies, maar het advies is voorzichtig te zijn.',
    stateChange: {}
  }, {
    text: '🍶 Alvast flessen en pannen vullen met kraanwater',
    consequence: 'Het water dat nu uit de kraan komt is troebel, maar er loopt wel wat. Je vult een paar flessen en zet ze apart. Later kun je het koken als dat nodig is. Slim om dit nu te doen, want je weet niet of de druk straks lager wordt.',
    stateChange: {
      water: 2,
      hasWater: true
    }
  }, {
    text: '🤷 Doorwerken, het zal wel meevallen',
    consequence: 'Je legt de telefoon weg. Vast tijdelijk. Maar intussen weet je niet wat er aan de hand is en je hebt niets apart gezet.',
    stateChange: {}
  }]
}, {
  id: 'wd_1',
  time: '13:35',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '13:30',
      headline: 'Kookadvies in delen van de gemeente',
      body: 'In delen van de gemeente geldt voorlopig een kookadvies. Kook kraanwater minimaal drie minuten voordat u het gebruikt voor drinken, tandenpoetsen of het maken van koffie, thee of eten. Het is niet bekend hoe lang het advies duurt.'
    }, {
      time: '13:32',
      headline: 'Gemeente: postcodecheck beschikbaar',
      body: 'De gemeente verwijst inwoners naar de postcodecheck op de website van Vitens om te zien of het kookadvies voor hun adres geldt. Het is niet bekend hoe lang het advies van kracht blijft.'
    }],
    get whatsapp() {
      const msgs = [{
        from: 'Vitens',
        msg: 'Kookadvies voor uw adres. Kook kraanwater minimaal 3 minuten voordat u het gebruikt voor drinken, tandenpoetsen of het bereiden van eten en drinken. Volg onze website voor updates.',
        time: '13:30',
        outgoing: false
      }];
      if (adultsCount > 1) {
        msgs.push({
          from: 'Partner',
          msg: 'Heb je het al gezien? Kookadvies. Zullen we alvast water apart zetten?',
          time: '13:33',
          outgoing: false
        });
      } else if (!profile.location.includes('stedelijk')) {
        msgs.push({
          from: 'Buurman Rob',
          msg: 'Hé, heb je dat kookadvies ontvangen? Ik probeer de supermarkt te bellen maar niemand neemt op. Hier is flessenwater altijd een eind rijden.',
          time: '13:35',
          outgoing: false
        });
      }
      return msgs;
    },
    nlalert: null,
    radio: 'Er geldt nu een kookadvies in delen van de gemeente. Gebruik kraanwater alleen als u het eerst minimaal drie minuten gekookt heeft. Bewaar schoon water als u dat al in huis heeft.'
  },
  narrative: 'Je telefoon trilt. Het waterbedrijf stuurt een sms. Het kookadvies is officieel. Het water loopt nog wel, maar je kunt het niet zomaar gebruiken. Je kijkt naar wat je in huis hebt.',
  choices: [{
    text: '🍶 Meteen flessen, pannen en kannen vullen',
    consequence: 'Zolang het water nog loopt en je het kunt koken, is het verstandig nu zoveel mogelijk op te slaan. Je vult alles wat je kunt vinden. Een volle pan op het fornuis, flessen in de koelkast, een kan op het aanrecht.',
    stateChange: {
      water: 2,
      hasWater: true
    }
  }, {
    text: '💧 Alleen water koken voor wat je nu direct nodig hebt',
    consequence: 'Je zet een pan water op, genoeg voor een kop thee en iets te drinken. Niet meer dan dat. Je houdt de voorraad klein en makkelijk te beheren.',
    stateChange: {}
  }, {
    text: '⏳ Eerst afwachten tot er meer nieuws is',
    consequence: 'Je wacht. Er komt voorlopig geen nieuw bericht. Intussen loopt de tijd en heb je niets apart gezet.',
    stateChange: {}
  }]
}, {
  id: 'wd_2',
  time: '14:10',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '14:05',
      headline: 'Gebruik schoon water alleen voor wat echt nodig is',
      body: 'Bewoners wordt gevraagd schoon water te bewaren voor drinken, tandenpoetsen, medicijnen en het bereiden van eten. Voor de wc, de afwas of schoonmaak kunt u ongekookt kraanwater blijven gebruiken. Water is er nog wel, maar de druk kan op sommige plekken lager worden.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Gebruik schoon of gekookt water alleen voor drinken, medicijnen, tandenpoetsen en eten. Voor het toilet en schoonmaak kunt u gewoon kraanwater gebruiken.'
  },
  get narrative() {
    const voorraad = state.hasWater
      ? 'Je hebt wat schoon water apart staan. Nu moet je keuzes maken over hoe je dat verdeelt.'
      : 'Je hebt weinig schoon water in huis. Je moet verstandig omgaan met wat er is.';
    return 'Het kookadvies is nu een uur van kracht. ' + voorraad + ' Het water loopt nog, maar je kunt niet alles meer zomaar gebruiken.';
  },
  choices: [{
    text: '💧 Schoon water apart zetten voor drinken, koken en medicijnen',
    consequence: 'Je zet twee flessen apart op een vaste plek. Die zijn alleen voor drinken, tandenpoetsen en medicijnen. Voor de rest gebruik je gewoon kraanwater. Zo hou je het overzichtelijk.',
    stateChange: {
      hasWater: true
    }
  }, {
    text: '🤷 Een deel gebruiken voor afwas en schoonmaak',
    consequence: 'Je gebruikt wat schoon water voor de afwas. Praktisch in het moment, maar je voorraad slinkt sneller dan nodig. Kraanwater had ook gekund voor de afwas.',
    stateChange: {
      water: -1
    }
  }, {
    text: '🤷 Alles door elkaar gebruiken',
    consequence: 'Je maakt geen onderscheid. Na een paar uur merk je dat je minder schoon water over hebt dan je dacht. Voor medicijnen en tandenpoetsen vanavond wordt het krap.',
    stateChange: {
      water: -1,
      comfort: -1
    }
  }]
}, {
  id: 'wd_3',
  time: '15:00',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '14:55',
      headline: 'Kookadvies blijft gelden tot nieuw bericht',
      body: 'Het kookadvies blijft van kracht. Ook als het water er helderder uitziet, moet u wachten op een officieel bericht van Vitens voordat u het ongekookt gebruikt. Vitens verwacht later vandaag of morgenochtend meer duidelijkheid.'
    }],
    whatsapp: [{
      from: 'Buurman Rob',
      msg: 'Het water ziet er hier alweer een stuk beter uit. Weet iemand of het nu weer gewoon drinkbaar is?',
      time: '14:58',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Het water kan er schoner uitzien, maar dat betekent niet dat het alweer veilig is om ongekookt te drinken. Volg alleen officiële berichten van Vitens of de gemeente.'
  },
  narrative: 'Later op de middag ziet het water uit de kraan er iets schoner uit. In de buurtapp komen meteen reacties: mensen vragen of het kookadvies nu ook klaar is. Je kijkt op de website van Vitens.',
  choices: [{
    text: '📱 Alleen officiële updates blijven volgen',
    consequence: 'De website van Vitens is duidelijk: het advies geldt tot er een nieuw bericht is. Je deelt dat kort in de buurtapp. Een paar mensen reageren dankbaar.',
    stateChange: {}
  }, {
    text: '😰 Zelf aannemen dat het wel weer goed zal zijn',
    consequence: 'Het ziet er helder uit, dus het zal wel in orde zijn. Je gebruikt het water ongekookt. Later begrijp je dat uiterlijk niets zegt over of het water veilig is.',
    stateChange: {
      health: -1
    }
  }, {
    text: '💬 In de buurtapp delen dat iedereen het officiële bericht moet afwachten',
    consequence: 'Je typt een kort berichtje in de buurtapp: "Kookadvies geldt nog steeds, ook al ziet het water er beter uit. Wacht op bericht van Vitens." Meerdere mensen reageren met een duim omhoog.',
    cat: 'cat-social',
    stateChange: {}
  }]
}, {
  id: 'wd_4',
  time: '16:15',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '16:10',
      headline: 'Grote vraag naar flessenwater in winkels',
      body: 'In meerdere winkels in de gemeente is flessenwater snel uitverkocht. Bewoners krijgen het advies eerst te kijken wat ze thuis nog hebben en schoon water zuinig te gebruiken. Kraanwater is er nog wel en blijft beschikbaar als je het kookt.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Mijn zoon is net bij de supermarkt geweest. Geen flessenwater meer te krijgen daar.',
      time: '16:12',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Bij de supermarkt is het druk. Mensen halen vooral houdbaar eten, batterijen en kaarsen. Flessenwater en sommige basisproducten zijn bijna op. Als u nog schoon water in huis heeft, gebruik dat dan zuinig.'
  },
  get narrative() {
    const auto = !profile.hasCar
      ? profile.hasBike
        ? ' Je hebt geen auto, maar wel een fiets — handig als je toch naar de winkel wilt.'
        : ' Je hebt geen auto en geen fiets. Als de winkel leeg is, ben je aangewezen op wat je thuis hebt of op de buren.'
      : '';
    return 'Je denkt na over je voorraad voor vanavond en morgenochtend. De supermarkt is nog open, maar meer mensen hebben hetzelfde idee.' + auto;
  },
  choices: [{
    text: '🏠 Thuis blijven en zuinig omgaan met wat je al hebt',
    consequence: 'Je bekijkt je voorraad. Er is genoeg voor vanavond als je verstandig omgaat met wat je hebt. Kraanwater koken kost tijd, maar het werkt. Je blijft thuis.',
    stateChange: {}
  }, {
    text: '🛒 Toch naar de supermarkt gaan',
    consequence: 'Je loopt naar de supermarkt. De schappen met flessenwater zijn leeg. Wel koop je een paar pakken appelsap en een extra blik soep. Niet ideaal, maar het helpt.',
    stateChange: {
      food: 1
    }
  }, {
    text: '🤝 Een buur vragen of jullie samen slim kunnen verdelen',
    consequence: 'Je klopt bij Ans aan. Samen bekijken jullie wat jullie in huis hebben. Ans heeft nog een grote kan schoon water. Jij hebt meer eten. Je spreekt af dat jullie vanavond samen koken.',
    cat: 'cat-social',
    stateChange: {
      comfort: 1,
      helpedNeighbor: true
    }
  }]
}, {
  id: 'wd_5',
  time: '17:00',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  conditionalOn: () => childrenCount > 0,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School / kinderopvang',
      msg: 'Vanwege het kookadvies vragen wij ouders om hun kind morgen zelf schoon drinkwater mee te geven in een goed afgesloten fles of beker. Op school gebruiken wij voorlopig geen ongekookt kraanwater.',
      time: '16:55',
      outgoing: false
    }, {
      from: 'Andere ouder',
      msg: 'Wij nemen morgen extra flessen mee. Hebben jullie nog genoeg in huis?',
      time: '17:02',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  narrative: 'Aan het einde van de middag komt er een bericht van school. Ze bereiden zich voor op morgen en vragen ouders om schoon water mee te geven.',
  choices: [{
    text: '🎒 Meteen apart zetten wat je kind morgen nodig heeft',
    consequence: 'Je vult alvast een goed afgesloten fles voor morgenochtend en zet hem apart. Zo hoef je er morgen vroeg niet meer aan te denken.',
    stateChange: {
      kidsNoodpakket: true
    }
  }, {
    text: '⏳ Afwachten, morgen zien we wel',
    consequence: 'Je legt het bericht weg. Morgenochtend is er waarschijnlijk alweer meer duidelijkheid. Maar de kans is groot dat je dan alsnog in de weer bent met pannen en flessen.',
    stateChange: {}
  }]
}, {
  id: 'wd_6',
  time: '17:30',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Ik red me wel hoor, maar heb jij misschien nog een fles voor vanavond? Morgen regel ik meer.',
      time: '17:28',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Het kookadvies blijft van kracht. Gebruik schoon water zuinig en kijk of u iemand in uw omgeving kunt helpen die weinig voorraad heeft.'
  },
  get narrative() {
    const eigen = state.hasWater
      ? 'Je hebt zelf nog een redelijke voorraad apart staan.'
      : 'Je eigen voorraad is niet groot.';
    return 'Het water loopt nog wel, maar je gebruikt het nu anders dan normaal. ' + eigen + ' Dan stuurt Ans een appje.';
  },
  choices: [{
    text: '🤝 Een fles meegeven als je dat kunt missen',
    consequence: 'Je neemt een gevulde fles mee naar Ans. Ze is opgelucht. "Ik kook zelf ook wel," zegt ze, "maar zo\'n volle fles is fijn voor vanavond." Je eigen voorraad is wat kleiner, maar je weet dat je meer kunt koken.',
    cat: 'cat-social',
    stateChange: {
      water: -1,
      helpedNeighbor: true
    }
  }, {
    text: '💬 Samen bekijken wat echt nodig is',
    consequence: 'Je gaat even bij Ans langs. Ze heeft nog een halve kan. Samen kijken jullie wat ze nodig heeft voor vanavond. Je geeft haar een halve fles en een tip over hoe lang koken genoeg is. Dat is voldoende.',
    cat: 'cat-social',
    stateChange: {
      helpedNeighbor: true
    }
  }, {
    text: '🏠 Niets geven, je hebt zelf ook niet veel',
    consequence: 'Je legt de telefoon neer. Je hebt zelf ook niet genoeg. Ans redt zich wel. Maar het voelt niet prettig.',
    stateChange: {
      comfort: -1
    }
  }]
}, {
  id: 'wd_7',
  time: '20:30',
  date: 'Dinsdag 15 april 2025',
  dayBadge: 'Dag 1',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '20:15',
      headline: 'Kookadvies blijft vannacht gelden',
      body: 'Vitens meldt dat het kookadvies vannacht van kracht blijft. Morgen aan het einde van de ochtend volgt een nieuwe update, of eerder als dat mogelijk is. Het water blijft beschikbaar maar mag alleen ongekookt worden gebruikt voor de wc en schoonmaak.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Het kookadvies geldt nog. Vitens verwacht morgenochtend meer duidelijkheid. Zorg dat u voor morgen genoeg schoon water apart heeft staan voor drinken, tandenpoetsen en medicijnen.'
  },
  get narrative() {
    const water = state.water >= 3
      ? 'Je hebt genoeg schoon water apart voor de nacht en de ochtend.'
      : state.water >= 1
      ? 'Je hebt nog wat schoon water, maar voor morgenochtend moet je opnieuw koken.'
      : 'Je hebt weinig schoon water meer. Morgenochtend wordt het krap.';
    const kids = childrenCount > 0 && state.kidsNoodpakket
      ? ' De fles voor school ligt klaar.'
      : childrenCount > 0
      ? ' Vergeet morgenochtend niet om water voor school klaar te zetten.'
      : '';
    return 'Het is avond. Je merkt vandaag hoe vanzelfsprekend schoon water normaal is. ' + water + kids + ' De kraan loopt nog, maar je kunt hem niet meer zomaar opendraaien.';
  },
  choices: [{
    text: '📋 Je voorraad tellen en een plan maken voor morgen',
    consequence: 'Je loopt even langs wat je hebt: hoeveel water er nog is, wanneer Vitens morgen een update geeft, of je kind morgen een fles nodig heeft. Je schrijft een korte lijst. Klein gebaar, maar het geeft rust.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '🤷 Nog snel water gebruiken voor minder belangrijke dingen',
    consequence: 'Je gebruikt wat schoon water voor iets wat ook met kraanwater had gekund. Morgenochtend heb je minder over dan je had verwacht.',
    stateChange: {
      water: -1
    }
  }, {
    text: '😴 Afwachten en hopen dat het morgen vanzelf weer normaal is',
    consequence: 'Je gaat slapen zonder een plan. Morgenochtend begin je met een lege voorraad en geen idee wanneer het kookadvies opgeheven wordt.',
    stateChange: {
      comfort: -1
    }
  }]
}];
