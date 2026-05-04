// Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden. Zie LICENSE voor volledige voorwaarden.
// ═══════════════════════════════════════════════════════════════
// Scenario: Stroomstoring — "Een gewone winterdag"
// 27 scenes — van st_pre_d1 (zaterdagmiddag) tot st_14 (stroom terug)
// Tijdspanne: zaterdag 30 jan → woensdag 3 feb 2027
// ═══════════════════════════════════════════════════════════════


const phoneContacts_stroom = [
  {
    name: 'Mama',
    label: 'Bel mama',
    get consequence() {
      if (state.networkDown) {
        return 'Je probeert mama te bellen, maar het netwerk is overbelast. Eerst hoor je een toon, daarna niets meer. Je stuurt een sms: "Alles goed hier. Wacht even af." Of die aankomt weet je niet.';
      }
      if (state.awarenessLevel === 0) {
        return 'Je belt mama. Ze neemt op. "Heb jij dat nieuws over het stroomnet ook gezien?" "Ja, maar ze zeggen dat het meevalt hoor." "Toch maar even opletten," zegt ze. Prettig om even bij te praten.';
      }
      if (state.awarenessLevel >= 2) {
        return 'Je belt mama. Ze neemt meteen op. "Ik zag het op het nieuws, alles goed bij jullie?" Je vertelt dat jullie de situatie in de hand hebben. "Bel me als er iets is, hè." Je legt neer met een gerust gevoel.';
      }
      return 'Je belt mama. Ze neemt snel op. "Stroom ook uit bij jou?" "Ja, heel de straat." "Heb je genoeg eten en drinken in huis?" Ze maakt zich een beetje zorgen. Je stelt haar gerust.';
    },
    stateChange: {},
    conditionalOn: () => state.phoneBattery > 0
  }
];

function stroomStatusBar(parts) {
  return `<div class="scene-status-bar">${parts.join(' &nbsp;|&nbsp; ')}</div>`;
}

function stroomAfterword(lines) {
  if (!lines.length) return null;
  return `<div class="scene-afterword-box"><b class="scene-afterword-title">Drie weken later</b><br><br>${lines.join('<br>')}</div>`;
}

const scenes_stroom = [
  // SCENE 1 — Day -1
  {
    id: 'st_pre_d1',
    _w: 'PTP-NL-©2026-4vH8rZ',
    time: '12:00',
    date: 'Zaterdag 30 januari 2027',
    dayBadge: '',
    dayBadgeClass: 'blue',
    channels: {
      news: [{
        time: '10:31',
        headline: 'Experts waarschuwen voor zwakke plekken in het Europese stroomnet',
        body: 'Een groep energie-experts waarschuwt dat oude onderdelen in het Europese stroomnet risico geven. Een grote storing kan zich in theorie verspreiden naar andere delen van het net.'
      }, {
        time: '11:02',
        headline: 'Kabinet verhoogt budget voor cyberveiligheid vitale infrastructuur',
        body: 'Het kabinet trekt 340 miljoen extra uit voor de beveiliging van energiecentrales, waterwerken en communicatienetwerken.'
      }, {
        time: '11:47',
        headline: 'Experts zien onrustige signalen op Europees stroomnet',
        body: 'Netbeheerders en experts melden dat er de laatste dagen meerdere storingen en spanningsschommelingen zijn geweest op delen van het Europese stroomnet. De precieze oorzaak is nog niet duidelijk.'
      }, {
        time: '12:00',
        headline: 'Minister: \'Geen acuut gevaar voor stroomvoorziening\'',
        body: 'De minister van Economische Zaken zegt dat de beschadigde kabels niet direct problemen geven voor de stroomvoorziening. Volgens de minister zijn er genoeg reserves in het net.'
      }],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Hé, heb je dat nieuws over het stroomnet gezien? Vreemd verhaal.',
        time: '12:15',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Radio 1. Experts melden onrustige signalen op delen van het Europese stroomnet. De precieze oorzaak is nog niet duidelijk. De minister van Economische Zaken zegt dat er geen acuut gevaar is voor de stroomlevering. Houd onze berichtgeving in de gaten voor updates.'
    },
    narrative: 'In het dorp hangt vandaag een onrustige sfeer. Mensen praten in groepjes en in het lunchcafé staat de tv harder dan normaal. Buiten lijkt alles gewoon, maar de stemming voelt anders.',
    choices: [{
      text: '💡 Ik lees het artikel over zwakke plekken in het stroomnet',
      consequence: 'Je leest het artikel aandachtig. Experts leggen uit hoe een grote storing zich via het gekoppelde net verder kan verspreiden. Later denk je er niet veel meer aan, maar je onthoudt wel dat het stroomnet kwetsbaar kan zijn.',
      stateChange: {
        awarenessLevel: 1
      }
    }, {
      text: '💬 Ik stuur Rob terug: "Ja, beetje raar. Ik hoop dat het niks is"',
      consequence: 'Rob antwoordt: "Ja, vreemd wel. We zien het straks wel." Je gaat verder met je dag.',
      stateChange: {}
    }, {
      text: '🙈 Ik maak me geen zorgen, het waait wel over',
      consequence: 'Je sluit het nieuwsartikel weer. Vast niet voor niets dat ze zeggen dat er geen direct probleem is.',
      stateChange: {}
    }]
  },
  // SCENE MORN_D0 — Day 0 morning, 08:00 (before outage)
  {
    id: 'st_d0_morgen',
    time: '08:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Goedemorgen, u luistert naar Radio 1. Het is acht uur. Vandaag wisselend bewolkt met kans op natte sneeuw. Het wordt koud: maximaal −1°C. Straks in het nieuws van negen uur meer over de situatie rond de beschadigde zeekabels.'
    },
    get narrative() {
      const statusBar = stroomStatusBar([
        '🌡️ Binnen: <b style="color:#22c55e">18°C</b>',
        '🌨️ Buiten: <b style="color:#93c5fd">−1°C</b>'
      ]);
      const kinderen = profile.hasChildren
        ? (profile.childrenCount === 1
          ? ' Je kind slaapt nog — of is alweer op. Een gewone ochtend.'
          : ' De kinderen slapen nog — of zijn alweer op. Een gewone ochtend.')
        : '';
      return statusBar + 'Zondagochtend. De CV tikt, de koelkast zoemt, de waterkoker fluit. Gewone geluiden. Buiten ligt een dun laagje rijp op de daken. Bewolkt, stil. Je drinkt je koffie bij het raam. Een gewone zondag, zo voelt het tenminste.' + kinderen;
    },
    choices: [{
      text: '☕ Koffie zetten en rustig ontbijten',
      consequence: 'Je zet koffie. Warm water, verse geur, de krant. Normaal. Je weet nog niet dat dit de laatste gewone ochtend is voor een tijdje.',
      stateChange: {}
    }, {
      text: '🧺 Een was draaien, zondag is wasdag',
      consequence: 'Je gooit de was in de machine. Terwijl hij draait kijk je even buiten. Alles lijkt normaal. Toch denk je nog even terug aan de berichten van gisteren over de kabels.',
      stateChange: {}
    }, {
      text: '🛌 Uitslapen, het is zondag',
      consequence: 'Je besluit bij te slapen. Je hebt het verdiend. Even later, om 11:30, word je gewekt door iets raars: de koelkast valt stil.',
      stateChange: {}
    }]
  },
  // SCENE 3 — First outage, 11:30
  {
    id: 'st_1',
    time: '11:30',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '11:30',
        headline: 'Stroomstoring gemeld in meerdere provincies',
        body: 'Netbeheerder Liander bevestigt een grote stroomstoring die meerdere provincies treft. De oorzaak wordt onderzocht.'
      }],
      whatsapp: [{
        from: 'Werk via Teams',
        msg: 'Heeft iedereen last van de stroom? Servers zijn down.',
        time: '11:32',
        outgoing: false
      }, {
        from: 'Thuis (partner/huisgenoot)',
        msg: 'De stroom is uitgevallen hier. Jij ook? CV doet het niet meer',
        time: '11:33',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Radio 1. We ontvangen meldingen van een stroomstoring in meerdere provincies. Netbeheerder Liander doet onderzoek. Houd uw radio bij de hand voor verdere updates. We melden meer zodra we het weten.'
    },
    get narrative() {
      const lift = profile.houseType === 'hoogbouw'
        ? profile.playerIsMobilityImpaired
          ? ' De lift doet het niet meer. Voor jou als beperkt mobiel persoon is dat direct een groot probleem. Je zit vast op je verdieping.'
          : profile.playerIsElderly
          ? ' De lift doet het niet meer. Traplopen is zwaar op jouw leeftijd, zeker bij een langdurige storing.'
          : ' De lift doet het niet meer. Je loopt de trap.'
        : '';
      const radio = profile.hasRadio === 'ja' ? ' Je pakt de batterijradio en zet hem aan. Radio 1 zendt nog uit.' : '';
      return 'Midden op de ochtend valt ineens de stroom uit. Alles wordt stil: de koelkast, de verwarming en het wifi-lampje. Alleen je telefoon doet het nog via mobiel bereik. Buiten zie je buren naar buiten komen om te kijken wat er aan de hand is. De stilte voelt vreemd, alsof iemand in één keer al het geluid heeft uitgezet.' + lift + radio;
    },
    choices: [{
      text: '🔌 Alle grote apparaten uitschakelen en de zekering uitzetten',
      consequence: 'Je loopt door het huis en zet alles handmatig uit: wasmachine, oven, verwarming. Zo verklein je de kans op schade als de stroom later terugkomt.',
      source: { text: 'Denkvooruit: trek stekkers uit het stopcontact — zo voorkom je schade als de stroom terugkomt', url: 'https://www.denkvooruit.nl/risicos/risicos-in-nederland/geen-stroom' },
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasElderly,
      text: '🧓 Even bij de ouderen in huis kijken, hoe gaat het met ze?',
      consequence: 'Je klopt aan en vraagt hoe het gaat. Ze maken het goed, maar zijn wel wat onrustig. Je belooft ze op de hoogte te houden en zegt dat je terugkomt als er nieuws is. Goed dat je dit even deed.',
      stateChange: { knowsNeighbors: true }
    }, {
      text: '☕ Even koffie zetten op het gasfornuis en rustig afwachten',
      consequence: 'Het gasfornuis werkt gelukkig nog. Je zet koffie en probeert rustig te blijven. Misschien is het zo weer voorbij.',
      stateChange: {}
    }]
  },
  // SCENE 4 — Stroom terug, info-only
  {
    id: 'st_2',
    time: '11:57',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '11:54',
        headline: 'Grote stroomstoring in Nederland voorbij, wel nog problemen op spoor',
        body: '"Er is overal weer stroom. De voorziening is samen met netbeheerder Liander weer hersteld. Wel is er nog een brand op een hoogspanningsstation in Dronten", aldus de woordvoerder.'
      }],
      whatsapp: [{
        from: 'Thuis (partner/huisgenoot)',
        msg: 'Stroom is terug! CV springt ook weer aan 🙌',
        time: '11:58',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Radio 1. De stroomstoring lijkt in grote delen van Nederland opgelost. Netbeheerder Liander meldt dat de voorziening is hersteld. Er is nog een brand op een hoogspanningsstation in Dronten. We blijven de situatie volgen.'
    },
    narrative: 'De lichten flikkeren en springen weer aan. De koelkast begint te zoemen en de cv komt opnieuw op gang. Buiten hoor je mensen opgelucht lachen. Het lijkt voorbij. Toch heb je het gevoel dat je dit moment beter kunt gebruiken.',
    choices: [{
      text: '🔋 Telefoon snel opladen via het stopcontact',
      consequence: 'Je legt meteen je telefoon aan de lader. Tien minuten later, vlak voor de stroom weer uitvalt, heb je er 20% batterij bij.',
      stateChange: {
        phoneBattery: 20
      }
    }, {
      text: '🔋 Snel de powerbank opladen zolang het kan',
      consequence: 'Je hangt de powerbank meteen aan de lader. Na tien minuten zit er 10% extra in. Niet veel, maar straks kun je dat goed gebruiken.',
      stateChange: {}
    }, {
      text: '😌 Niets doen, alles is toch weer normaal',
      consequence: 'Je laat het zitten. De stroom is terug, alles zoemt weer. Je gaat verder met je dag. Het was maar een kleine storing.',
      stateChange: {}
    }]
  },
  // SCENE 5 — Second outage + NL-Alert
  {
    id: 'st_3',
    time: '12:20',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '12:28',
        headline: 'Opnieuw grote stroomstoring, uitval breidt zich uit in Europa',
        body: 'Na de brand in Dronten is opnieuw een grote storing ontstaan. Experts denken dat problemen in het gekoppelde stroomnet zich hebben verspreid naar andere delen van Europa. De precieze oorzaak wordt nog onderzocht.'
      }],
      whatsapp: [{
        from: 'Mama',
        msg: 'Lieverd, gaat het goed? Hier is de stroom ook uit. Bellen lukt niet.',
        time: '12:35',
        outgoing: false
      }, {
        from: 'Buurman Rob',
        msg: 'Hé, is bij jou ook alles weer uit? Dit voelt minder klein dan net.',
        time: '12:38',
        outgoing: false
      }],
      nlalert: 'NL-Alert\n31 januari 2027 – 12:32\n\nNa een grote brand bij een energie-installatie in Dronten zijn er op meerdere plekken ernstige stroomstoringen. Mogelijk breidt de storing zich verder uit. De oorzaak wordt onderzocht. Update volgt.',
      radio: 'Hier Radio 1. We onderbreken onze uitzending voor een urgent noodbericht. Er is een grootschalige stroomstoring in Nederland en andere delen van Europa. Na de brand in Dronten lijken problemen zich door het gekoppelde stroomnet te verspreiden. De precieze oorzaak wordt nog onderzocht. De overheid vraagt iedereen thuis te blijven, warm te blijven en voldoende drinkwater achter de hand te houden. Houd uw radio aan voor verdere updates. We houden u op de hoogte.'
    },
    get narrative() {
      const kinderen = profile.hasChildren
        ? (profile.childrenCount === 1
          ? ' Meteen denk je: school morgen, eten, hoe leg je dit uit aan een kind?'
          : ' Meteen denk je: school morgen, eten, hoe leg je dit uit aan de kinderen?')
        : '';
      const heeftMotorVoertuig = profile.hasCar || profile.hasMotorcycle;
      const afgelegen = !heeftMotorVoertuig && !profile.location.includes('city')
        ? ' Je woont buiten het centrum en hebt geen motorvoertuig. Als je ergens naartoe moet, ben je afhankelijk van je eigen benen of je fiets.'
        : '';
      const infoleeg = state.phoneBattery <= 0 && !state.hasCarRadio && profile.hasRadio !== 'ja'
        ? ' Je telefoon is leeg en je hebt ook geen radio. Je hebt geen goede manier meer om te weten wat er nu gebeurt.'
        : '';
      return 'De stroom valt opnieuw uit. Alles wordt stil. Dit keer voelt het anders — geen gezoem van apparaten, geen standby-lampjes, niets. Je telefoon trilt. Buiten komen mensen hun huis uit. Ze kijken om zich heen en zeggen bijna niets. Je accu staat op ' + state.phoneBattery + '%.' + kinderen + afgelegen + infoleeg;
    },
    choices: [{
      text: '🍶 Lege flessen vullen met water, voor noodgebruik',
      consequence: 'Je pakt alle lege flessen, pannen en emmers die je kunt vinden en vult ze met kraanwater. Als de waterpomp uitvalt, heb je nog water voor drinken, koken en de wc.',
      source: { text: 'Denkvooruit: sla voldoende drinkwater op als onderdeel van je noodpakket', url: 'https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen' },
      stateChange: {
        hasWater: true,
        water: 2
      }
    }, {
      conditionalOn: () => profile.hasRadio !== 'ja' && (profile.hasCar || profile.hasMotorcycle),
      text: () => profile.hasCar ? '🚗 Naar de auto en de radio aanzetten' : '🚗 Naar de motor en de radio aanzetten',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je loopt naar de ${v} en zet de radio aan. Radio 1 is nog in de lucht en vertelt dat de storing groot is en lang kan duren. De radio wordt nu je belangrijkste bron van informatie.`;
      },
      stateChange: {
        hasCarRadio: true
      }
    }, {
      text: '🤷 Niets doen, ik wacht af wat er gaat gebeuren',
      consequence: 'Je zit op de bank en wacht. Er komt geen stroom. Je accu loopt langzaam verder leeg. Buiten klinkt een sirene.',
      stateChange: {}
    }]
  },
  // SCENE 6 — Phone network down, shops closing
  {
    id: 'st_4',
    time: '13:30',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    get channels() {
      const supermarktMsg = profile.location.includes('city') ?
        'Ben jij al naar de supermarkt gegaan? Bij ons om de hoek staat een rij van zeker 50 meter. Ik ga het ook proberen.' :
        'Ben jij naar de super gegaan? De dichtstbijzijnde supermarkt zit 8 minuten rijden. Rij je ernaartoe?';
      return {
        news: [{
          time: '13:12',
          headline: 'Telefoonnetwerken overbelast, 112 slecht bereikbaar',
          body: 'Telecomproviders melden extreme drukte op het netwerk. 112 is beperkt bereikbaar. Bel alleen in levensbedreigende situaties.'
        }, {
          time: '13:25',
          headline: 'Winkels sluiten deuren, supermarkten open maar druk',
          body: 'Veel winkels sluiten door de stroomstoring. Sommige supermarkten blijven nog even open, maar vaak kun je alleen contant betalen. Bij pinautomaten staan lange rijen.'
        }],
        whatsapp: [{
          from: 'Buurman Rob',
          msg: supermarktMsg,
          time: '13:28',
          outgoing: false
        }, {
          from: 'Collega Sanne',
          msg: 'Heeft iemand nog bereik? Wij zitten nog op kantoor. De liften doen het niet.',
          time: '13:22',
          outgoing: false
        }],
        nlalert: null,
        radio: 'Radio 1. Het telefoonnetwerk is overbelast. Bel 112 alleen bij levensgevaar. Sommige supermarkten accepteren alleen contant geld. Blijf thuis, spaar uw telefoon en houd uw radio aan voor updates.'
      };
    },
    get narrative() {
      const infoleeg = state.phoneBattery <= 0 && !state.hasCarRadio && profile.hasRadio !== 'ja'
        ? ' Je telefoon is leeg en je hebt ook geen radio. Je hebt geen goede manier meer om te weten wat er nu gebeurt.'
        : '';
      if (profile.location.includes('city')) {
        return 'Je telefoon heeft nauwelijks bereik meer. Je hoort constant politiesirenes in de verte. Op straat zijn mensen nerveus. Kleine groepjes staan bij elkaar te praten. De supermarkt om de hoek is nog open, maar je ziet de rij al van ver. Het begint merkbaar kouder te worden in huis: de thermostaat staat op 19°C, maar de CV werkt niet.' + infoleeg;
      } else {
        return 'Je telefoon heeft nauwelijks bereik meer. Je hoort constant politiesirenes in de verte. Op straat zijn mensen nerveus. Kleine groepjes staan bij elkaar te praten. Je overweegt naar de supermarkt te gaan, maar die zit een eind weg. En je weet niet of ze nog open zijn. Het begint merkbaar kouder te worden in huis: de thermostaat staat op 19°C, maar de CV werkt niet.' + infoleeg;
      }
    },
    choices: [{
      text: '🛒 Nu naar de supermarkt gaan, voor het te laat is',
      consequence: 'Je pakt je jas en gaat. De rij is lang maar beweegt. Na 25 minuten ben je binnen. Pas daar merk je dat je alleen met contant geld kunt betalen.',
      stateChange: {
        wentToSupermarket: 'early',
        networkDown: true
      }
    }, {
      text: '🏠 Thuis blijven en inventariseren wat we al hebben',
      consequence: 'Je maakt een overzicht: wat ligt er in de vriezer, de kelder, de kast? Je weet nu wat je hebt.',
      stateChange: { networkDown: true }
    }, {
      conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
      text: () => profile.hasCar ? '🚗 Met de auto naar een tankstation voor benzine' : '🚗 Met de motor naar een tankstation voor benzine',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Bij het tankstation staat een rij. Na een uur wachten krijg je te horen: "Alleen voor hulpdiensten." Teleurgesteld rij je terug op je ${v}. Je hebt gezien hoe gespannen de sfeer buiten is.`;
      },
      stateChange: { networkDown: true }
    }, {
      text: '👴 Even bij de buren langs of alles goed is',
      consequence: 'Buurvrouw Annie (78) staat verward in de deuropening. Je legt het kort uit en vraagt of ze nog eten heeft. "Ja hoor, ik red me wel", zegt ze. Maar ze ziet er bleek uit.',
      stateChange: {
        knowsNeighbors: true,
        networkDown: true
      }
    }]
  },
  // SCENE 6B — At the supermarket (conditional)
  {
    id: 'st_4b',
    time: '14:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    conditionalOn: () => state.wentToSupermarket === 'early',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. De stroomstoring houdt aan. Supermarkten zijn beperkt open maar accepteren alleen contant geld. Drinkwater uit de kraan is voorlopig veilig. Houd uw radio aan voor updates.'
    },
    get narrative() {
      const kinderen = profile.hasChildren
        ? ' Je zet de kinderen op je mentale lijstje: genoeg eten voor de komende dagen, en iets voor als ze zich vervelen zonder licht of scherm.'
        : '';
      const heeftMotorV = profile.hasCar || profile.hasMotorcycle;
      const heeftFietsV = profile.hasBike || profile.hasScooter || profile.hasEbike;
      const fietsnaamV  = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
      const vervoer = !heeftMotorV
        ? heeftFietsV
          ? ` Je bent met de ${fietsnaamV}. Je kunt niet zoveel meenemen — je moet kiezen wat je pakt.`
          : ' Je bent te voet gekomen. Je kunt niet veel sjouwen — je kiest verstandig.'
        : '';
      return 'Je staat in de rij bij de supermarkt. Er staan minstens 60 mensen voor je. Iedereen praat zachtjes of staart naar hun telefoon. Een vrouw vooraan begint hard te schreeuwen dat ze voordringt omdat ze kleine kinderen heeft. Er ontstaat een discussie. Een beveiliger doet zijn best maar is duidelijk nerveus. Als je eindelijk binnen bent: de schappen zijn al behoorlijk uitgedund. Drinkwater is uitverkocht. Hetzelfde geldt voor wc-papier, olie, benzine en lucifers. Honing en blikopeners zijn ook al weg.' + kinderen + vervoer;
    },
    choices: [{
      text: '🥫 Zoveel mogelijk blikvoer, rijst en pasta inslaan',
      failCondition: () => state.cash < 50,
      failConsequence: () => `Je vult een grote tas, maar aan de kassa hoor je: "Alleen contant." Je hebt €${state.cash} bij je — niet genoeg voor €50. Je legt alles terug. Kies een andere optie.`,
      consequence: 'Je vult een grote tas: blikken soep, bonen, tomaten, rijst, pasta, crackers. Aan de kassa: "Alleen contant." Je betaalt €50.',
      stateChange: { supermarketItems: ['blikvoer', 'rijst', 'pasta', 'crackers'], food: 2, cash: -50 }
    }, {
      text: '🕯️ Kaarsen, aansteker, batterijen, praktische spullen',
      failCondition: () => state.cash < 25,
      failConsequence: () => `Je vindt kaarsen en batterijen, maar aan de kassa: "Alleen contant." Je hebt €${state.cash} bij je — niet genoeg voor €25. Je legt alles terug. Kies een andere optie.`,
      consequence: 'Je vindt nog twee pakken kaarsen, een aansteker en het laatste pakje AA-batterijen. Aan de kassa: "Alleen contant." Je betaalt €25.',
      stateChange: { hasFlashlight: true, supermarketItems: ['kaarsen', 'batterijen', 'aansteker'], cash: -25 }
    }, {
      text: '😤 Ik ga weg, de sfeer is te gespannen en ik wil niet in dit gedrang',
      consequence: 'De spanning in de winkel is tastbaar. Je besluit te vertrekken. Dat is veiliger, maar je gaat wel met lege handen naar huis.',
      stateChange: {
        wentToSupermarket: null
      }
    }]
  },
  // SCENE 7 — NL-Alert: days long
  {
    id: 'st_5',
    time: '14:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '13:55',
        headline: 'Stroomstoring kan tot morgen duren, overheid roept op tot kalmte',
        body: 'Na de brand bij een energie-installatie in Dronten is een kettingreactie van storingen ontstaan in grote delen van het Europese stroomnet. Experts benadrukken dat veel landen sterk met elkaar verbonden zijn. De precieze oorzaak wordt nog onderzocht. De overheid weet nog niet hoe lang de uitval duurt en vraagt mensen rekening te houden met een of meer dagen zonder stroom.'
      }, {
        time: '14:00',
        headline: 'Stuwen en gemalen vallen uit, overstromingsrisico in laaggelegen gebieden',
        body: 'Het waterschap waarschuwt dat waterkerende systemen die op elektriciteit draaien zijn uitgevallen. In laaggelegen gebieden kan dit leiden tot wateroverlast.'
      }],
      whatsapp: [],
      nlalert: 'NL-Alert\n31 januari 2027 – 13:28\n\nNa de brand in Dronten zijn op veel plekken ernstige stroomstoringen ontstaan. De storing kan tot morgen duren of langer.\n\nBlijf thuis. Blijf warm. Zorg voor voldoende water en voedsel. Denk aan uw (oudere) buren.',
      radio: 'Radio 1. De overheid zegt dat de storing tot morgen of langer kan duren. Zorg voor water, warmte en genoeg eten. Denk ook aan uw buren, vooral ouderen. Blijf thuis als dat kan.'
    },
    get narrative() {
      const supermarkt = profile.location.includes('city') ?
        'De supermarkt om de hoek is nog open maar je ziet de rij al van ver.' :
        'Je overweegt naar de supermarkt te gaan, maar die zit een eind weg. En je weet niet of ze nog open zijn.';
      const kinderen = profile.hasChildren
        ? (profile.childrenCount === 1
          ? ' School morgen? Kinderopvang? Je weet het niet. Je kind merkt dat er iets mis is.'
          : ' School morgen? Kinderopvang? Je weet het niet. De kinderen merken dat er iets mis is.')
        : '';
      const geenAuto = !(profile.hasCar || profile.hasMotorcycle) && !profile.location.includes('city')
        ? ' Zonder motorvoertuig is alles buiten je directe buurt ineens ver weg.'
        : '';
      return 'Het begint door te dringen: dit is geen storing van een uur. ' + supermarkt + ' Buiten hoor je meer sirenes. Je ziet een auto voorbijrijden die heel langzaam rijdt, alsof de bestuurder ook niet weet wat te doen.' + kinderen + geenAuto;
    },
    choices: [{
      conditionalOn: () => !state.hasWater,
      text: '🍶 Lege flessen en pannen vullen met water',
      consequence: 'Je vult alles wat je hebt: flessen, pannen, emmers, zelfs de gootsteen afgedopt. Zolang er nog druk op het waternet staat, kun je nog water tappen.',
      stateChange: {
        hasWater: true,
        water: 2
      }
    }, {
      conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
      text: () => profile.hasCar ? '🔋 Telefoon en apparaten opladen via de auto' : '🔋 Telefoon en apparaten opladen via de motor',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je loopt naar de ${v}, start hem op en sluit de telefoon aan via USB. Na een halfuur: +40%. De ${v} als noodgenerator.`;
      },
      stateChange: {
        phoneBattery: 40
      }
    }, {
      text: '🌡️ Alle kamers afsluiten behalve de woonkamer, warmte bewaren',
      consequence: 'Je sluit alle deuren. Eén kamer warm houden kost veel minder energie dan het hele huis. Je trekt een extra trui aan.',
      source: { text: 'Denkvooruit: houd bij stroomstoring één ruimte warm en sluit de rest af', url: 'https://www.denkvooruit.nl/risicos/risicos-in-nederland/geen-stroom' },
      stateChange: {}
    }, {
      text: '👴 Bij buurvrouw Annie aanbellen en vragen of ze het redt',
      consequence: 'Je loopt naar buurvrouw Annie. Ze staat al bij de deur en ziet er onrustig uit. "Ik probeer mijn dochter te bellen, maar ik krijg haar niet te pakken", zegt ze. Je helpt haar een sms te sturen. Dat stelt haar zichtbaar gerust.',
      stateChange: {}
    }, {
      text: '😶 Niets doen, de overheid zal het snel oplossen',
      consequence: 'Je gaat op de bank zitten en wacht. Het huis wordt kouder. Er komt geen stroom. Geen water opgeslagen, geen extra warmte geregeld. Je hoopt maar dat het snel voorbij is.',
      stateChange: {}
    }]
  },
  // SCENE 8 — Evening cooking, Dag 0
  {
    id: 'st_6',
    time: '18:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Praktische tips voor vanavond: open uw vriezer zo min mogelijk, bevroren voedsel blijft 24 uur goed. Gebruik geen barbecue of campingkooktoestel binnenshuis vanwege koolmonoxide. Slaap warm: meerdere lagen kleding en bij voorkeur met meerdere personen in één kamer.'
    },
    narrative: stroomStatusBar([
      '🌡️ Binnen: <b style="color:#60a5fa">13°C</b>',
      '❄️ Buiten: <b style="color:#93c5fd">−2°C</b>',
      '⚡ <b style="color:#ef4444">Stroom uit</b>',
      '⏱️ ~6 uur zonder stroom'
    ]) + 'Het is al donker buiten, vroeg in februari. In huis is het merkbaar kouder geworden. De koelkast staat stil, de vriezer begint langzaam te ontdooien. Je maag rammelt. De supermarkten zijn al dicht. De stroom is al uren weg — en ondertussen doet ook het gasfornuis het niet meer. Hoe kook je vanavond?',
    choices: [{
      text: '🏕️ Campingkooktoestel of barbecue gebruiken',
      consequence: 'Je haalt het campingkooktoestel tevoorschijn. Belangrijk: gebruik het buiten of met veel ventilatie, want koolmonoxide is dodelijk in een besloten ruimte. Je kookt een warme maaltijd.',
      source: { text: 'Brandweer: veilig en warm de winter door', url: 'https://www.brandweer.nl/onderwerpen/veilig-en-warm-de-winter-door/' },
      stateChange: {
        comfort: 1,
        hasCampingStove: true
      }
    }, {
      text: '🥫 Koude maaltijd, crackers, kaas, direct uit blik',
      consequence: 'Je eet koud: crackers met kaas, een blik mais of bonen direct erbij. Voedzaam, maar koud eten voelt extra guur bij 13°C in huis. Het werkt, maar bewaar warme maaltijden voor als het echt koud wordt.',
      stateChange: {}
    }]
  },
  // SCENE 8B — Evening comfort, Dag 0
  {
    id: 'st_6b',
    time: '19:30',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Jullie ook kaarsen aan? Hele straat is donker. Hoe lang duurt dit denk je?',
        time: '19:22',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Radio 1. Goedenavond. De politie vraagt iedereen zoveel mogelijk binnen te blijven. In meerdere wijken zijn incidenten gemeld. Sluit uw deuren en ramen goed af. Wij zenden de hele nacht door op batterijstroom.'
    },
    get narrative() {
      return stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">12°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−3°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '🌙 Nacht valt in'
      ]) + 'Je hebt gegeten. Nu begint de lange avond. Buiten is het pikzwart. Geen lantaarnpalen, geen lichtjes bij de buren. Alleen hier en daar het flakkerende schijnsel van een kaars achter een raam. Het huis koelt langzaam maar zeker af. Je telefoon staat op ' + state.phoneBattery + '%.' + (state.phoneBattery <= 0 && !state.hasCarRadio && profile.hasRadio !== 'ja' ? ' Je telefoon is leeg en je hebt ook geen radio. Je hebt geen goede manier meer om te weten wat er nu gebeurt.' : '');
    },
    choices: [{
      text: '🕯️ Kaarsen aansteken, slaapzakken halen en in de woonkamer bij elkaar blijven',
      consequence: 'Je zet kaarsen in glazen voor stabiliteit en sleept slaapzakken, dekens en kussens naar de woonkamer. Eén kamer verlichten en verwarmen met lichaamswarmte is veel efficiënter dan het hele huis. Het flakkerende licht maakt het minder zwaar.',
      source: { text: 'Brandweer: gebruik kaarsen altijd in een stabiele houder en laat ze nooit onbeweerd branden', url: 'https://www.brandweer.nl/onderwerpen/veilig-en-warm-de-winter-door/' },
      stateChange: {}
    }, {
      conditionalOn: () => hasWorkingFlashlight(),
      text: '🔦 Zaklamp pakken en de rest van de avond op batterijen doorbrengen',
      consequence: 'Je haalt de zaklamp tevoorschijn en zet hem als sfeerverlichting op tafel. Handig en functioneel, zonder brandgevaar of kaarsenrook.',
      stateChange: () => { useFlashlightCharge(); return { hasFlashlight: true }; }
    }, {
      text: '📵 Telefoon op vliegtuigmodus, accu zo lang mogelijk sparen',
      consequence: 'Je zet de telefoon op vliegtuigmodus. Geen berichten meer, maar ook nauwelijks accuverlies. Morgen heb je hem harder nodig dan vanavond.',
      stateChange: {
        airplaneMode: true
      }
    }, {
      text: '😴 Vroeg naar bed, spaar je energie',
      consequence: 'Je kruipt vroeg in bed met zo veel mogelijk lagen kleding aan. Lichaamswarmte in een slaapzak houdt je langer warm. Je slaapt onrustig, maar wel.',
      stateChange: {}
    }]
  },
  // SCENE 9 — Night suspicion
  {
    id: 'st_7',
    time: '02:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Het is half drie. De stroomstoring duurt voort. Winkels en tankstations blijven op veel plekken dicht. Hulpdiensten hebben het druk. Blijf binnenshuis en bel 112 alleen bij levensgevaar.'
    },
    get narrative() {
      const isFlat = profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw';
      const view = isFlat ?
        'naar de gevel van het tegenoverliggende gebouw kijkt' :
        'naar de tuin van de overburen kijkt';
      const mob = profile.hasMobilityImpaired ? (profile.houseType === 'hoogbouw' ? ' De trap is zwaar. Zonder lift is elke verdieping een opgave.' : ' De trap is zwaar voor iemand met beperkte mobiliteit.') : '';
      const oud = profile.hasElderly ? ' Je denkt ook aan de ouderen in huis: de kou is voor hen zwaarder.' : '';
      const infoleegNacht = state.phoneBattery <= 0 && !state.hasCarRadio && profile.hasRadio !== 'ja'
        ? ' Je telefoon is leeg en je hebt ook geen radio. Je hebt geen goede manier meer om te weten wat er nu gebeurt.'
        : '';
      return 'Je wordt wakker van glasgerinkel buiten. Als je voorzichtig naar het raam loopt en ' + view + ', zie je twee mensen met zaklampen langs auto\'s en tuinen lopen. Ze voelen aan een paar deurklinken en lopen dan weer door. Het is donker, stil en ijskoud. Je hart bonkt.' + mob + oud + infoleegNacht;
    },
    choices: [{
      text: '📱 112 bellen',
      consequence: () => state.phoneBattery > 0 ? 'Je belt 112. Na 4 minuten krijg je iemand aan de lijn. Ze nemen de melding aan maar zijn eerlijk: ze zijn overbelast. "We registreren het. We proberen zo snel mogelijk langs te komen." Er komt niemand die nacht.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken.',
      stateChange: {}
    }, {
      text: '🔒 Zelf alle deuren en ramen dubbel controleren en vergrendelen',
      consequence: 'Je loopt stil door het huis. Achterdeur op slot, schuifpui vergrendeld, ramen dicht. Je zet een stoel onder de deurklink van de voordeur. Niet veel, maar het voelt beter.',
      stateChange: {
        houseLocked: true
      }
    }, {
      text: '🚪 Naar buiten gaan om te kijken wat er aan de hand is',
      consequence: 'Je zet de deur op een kier, maar buiten is het te donker en onoverzichtelijk. Je sluit snel weer af. Binnen ben je veiliger.',
      stateChange: {}
    }, {
      text: '🙈 Niets doen, het gaat niet om ons huis',
      consequence: 'Je kruipt terug in bed maar kunt niet meer slapen. Je ligt te luisteren naar elk geluid. De rest van de nacht doe je geen oog dicht.',
      stateChange: {}
    }]
  },
  // SCENE 10 — Neighbor emergency + radio
  {
    id: 'st_8',
    time: '05:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurvrouw Annie',
        msg: 'Help. Jan is gevallen toen hij in het donker opstond. Hij bloedt aan zijn hoofd en ik krijg bijna niemand te pakken. Kunnen jullie komen?',
        time: '05:28',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Je zoekt een tijdje door de frequenties. De meeste zenders zijn stil. Dan vind je een lokale zender: "Na de brand in Dronten zitten grote delen van het stroomnet in de problemen. We weten niet hoe lang we nog kunnen uitzenden. Houd uw radio aan."\n\nOp de AM frequentie hoor je een rustiger stem: "Het herstellen van de stroomstoring blijkt ingewikkelder dan gedacht. De oorzaak is nog onduidelijk. We roepen iedereen op tot kalmte en vragen mensen hun buren te helpen."'
    },
    narrative: 'Het begint net licht te worden. Buiten is het bitterkoud en in huis staat de thermometer nu op 5°C, net boven het vriespunt. Je adem vormt kleine wolkjes. Dan trilt je telefoon.',
    choices: [{
      text: '💬 Reageer op het bericht, ga kijken bij Annie',
      consequence: 'Je pakt je telefoon en typt snel terug: "We komen eraan." Je trekt je jas aan en loopt naar de overkant.',
      stateChange: {
        contactedAnnie: true
      }
    }, {
      text: '😔 Negeer het bericht, ik heb het zelf ook zwaar',
      consequence: 'Je legt je telefoon weg. Het voelt zwaar om dit te doen, maar je hebt zelf nauwelijks energie en middelen. Je hoopt dat Annie andere hulp vindt.',
      stateChange: {}
    }]
  },
  // SCENE 10b — Detailed help options for Annie
  {
    id: 'st_8b',
    time: '05:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    conditionalOn: () => state.contactedAnnie === true,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Vijf uur dertig. De stroomstoring houdt aan. Houd uw radio aan. Houd uw naasten op de hoogte. De overheid werkt aan herstel.'
    },
    narrative: 'Je staat voor de deur van Annie. Ze doet open, wit weggetrokken van schrik. Achter haar ligt Jan op de bank met een wond op zijn hoofd. Je moet snel beslissen hoe je het best kunt helpen.',
    choices: [{
      text: '🍞 Wat eten uit je eigen voorraad aan hen geven',
      consequence: 'Je haalt crackers en een blik soep uit je eigen voorraad en geeft dat aan Annie. Haar ogen zijn rood van het huilen. Ze kijkt je aan alsof ze niet weet wat ze moet zeggen.',
      cat: 'cat-social',
      stateChange: {
        food: -1,
        water: -1,
        helpedNeighbor: true
      }
    }, {
      text: '📱 Eerst 112 bellen voordat je naar binnen gaat',
      consequence: () => state.phoneBattery > 0 ? 'Je belt 112 op de stoep. Na lange wachttijd krijg je iemand. Ze registreren het maar kunnen niet inschatten wanneer er iemand komt. "Houd hem warm en stil." Je gaat dan naar binnen om te helpen.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Je gaat direct naar binnen om te helpen.',
      stateChange: () => state.phoneBattery > 0 ? {
        helpedNeighbor: true
      } : {}
    }, {
      text: '🩺 Direct naar Jan kijken en zijn toestand beoordelen',
      consequence: 'Je loopt naar binnen. Jan reageert wel, maar is duizelig en in de war. Hij is waarschijnlijk gevallen in het donker. Je controleert zijn ademhaling, maakt de wond zo goed mogelijk schoon en zorgt dat hij warm blijft.',
      stateChange: {
        helpedNeighbor: true
      }
    }, {
      text: '😰 Aarzelen, je weet niet wat je kunt doen',
      consequence: 'Je staat in de deuropening en weet niet waar te beginnen. Annie kijkt je smekend aan. Je ziet hoe ernstig het is en dwingt jezelf toch naar binnen te gaan.',
      stateChange: {
        helpedNeighbor: true
      }
    }]
  },
  // SCENE MORN_D1 — Day 1 morning, 08:00
  {
    id: 'st_d1_morgen',
    time: '08:00',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    get narrative() {
      const statusBar = stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">5°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−3°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '⏱️ ~20 uur zonder stroom'
      ]);
      const mood = state.comfort >= 4 ?
        'Je hebt een paar uur geslapen en voelt je redelijk.' :
        state.comfort >= 2 ?
        'Je hebt slecht geslapen. Alles voelt zwaarder dan normaal.' :
        'Je bent uitgeput. De spanning van gisterennacht, de kou en alle geluiden buiten beginnen echt door te wegen.';
      const mob = profile.playerIsMobilityImpaired
        ? ' Zonder lift en stroom is elke trap een opgave voor jou. Je beweegt langzaam en voorzichtig.'
        : profile.playerIsElderly
        ? ' Op jouw leeftijd is de combinatie van kou en slaaptekort extra slopend. Je voelt je stijf en moe.'
        : profile.hasMobilityImpaired
        ? ' De trap valt zwaar; zonder lift is elke verdieping een opgave.'
        : '';
      const water = !state.hasWater
        ? ' Je had gisteren geen water opgeslagen. Je hebt nu weinig te drinken.'
        : ' Gelukkig heb je gisteren water opgeslagen. Dat scheelt nu al.';
      const kinderen = profile.hasChildren
        ? (profile.childrenCount === 1
          ? ' Je kind vraagt wanneer het licht weer aangaat. Je hebt geen goed antwoord.'
          : ' De kinderen vragen wanneer het licht weer aangaat. Je hebt geen goed antwoord.')
        : '';
      return statusBar + mood + ' Een bleke streep licht achter de gordijnen. Je adem vormt kleine wolkjes. Buiten ligt rijp op de daken en ijs op de auto\'s. De stilte voelt onwerkelijk.' + mob + water + kinderen;
    },
    get channels() {
      const msgs = [];
      if (profile.hasChildren) {
        msgs.push({
          from: 'School / kinderopvang',
          msg: 'Vanwege de stroomstoring blijft school vandaag gesloten. Zodra er meer duidelijk is over herstel, laten we u weten wanneer we weer open zijn. Houd uw kind thuis.',
          time: '07:45',
          outgoing: false
        });
      }
      return {
        news: [],
        whatsapp: msgs,
        nlalert: null,
        radio: 'Radio 1. Goedemorgen. De stroomstoring duurt nu meer dan twintig uur. Herstel wordt niet voor morgenavond verwacht. In sommige plaatsen verliep de avond onrustig. Sommige winkels sloten eerder en hulpdiensten hebben het druk. Waterleidingbedrijven vragen het verbruik te beperken.'
      };
    },
    choices: [{
      text: '🔭 Door het raam kijken, wat zie je buiten?',
      consequence: () => {
        const buren = (profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw') ? 'Twee buren staan op de stoep voor het gebouw te praten' : 'Twee buren staan bij het tuinhek te praten';
        return 'Een man loopt langzaam met een hond. ' + buren + ' en wijzen af en toe naar de straat. Op de hoek staat iemand lang naar zijn telefoon te staren. Er rijdt bijna niets. De stilte voelt onwerkelijk.';
      },
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasRadio === 'ja',
      text: '📻 De radio aanzetten voor nieuws',
      consequence: 'Op de radio hoor je: "De stroomstoring duurt voort. In sommige plaatsen was het vannacht onrustig. Winkels sloten eerder en de politie is extra aanwezig op drukke plekken. Herstel wordt niet voor morgennacht verwacht." Morgennacht dus.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasRadio !== 'ja' && (profile.hasCar || profile.hasMotorcycle),
      text: () => profile.hasCar ? '🚗 Zet de radio aan voor nieuws' : '🚗 Zet de radio op de motor aan voor nieuws',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je loopt naar de ${v} en zet de radio aan. Op de radio hoor je: "De stroomstoring duurt voort. In sommige plaatsen was het vannacht onrustig. Winkels sloten eerder en de politie is extra aanwezig op drukke plekken. Herstel wordt niet voor morgennacht verwacht." Morgennacht dus.`;
      },
      stateChange: {}
    }]
  },
  // SCENE 11 — Sewage fails
  {
    id: 'st_9',
    time: '08:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Rioolgemalen in meerdere gemeenten vallen uit door stroomgebrek. Bewoners kunnen last krijgen van terugstromend rioolwater. Sluit afvoeropeningen af en gebruik zo min mogelijk water. Kook kraanwater voor u het drinkt.'
    },
    get narrative() {
      const mob = profile.hasMobilityImpaired ? (profile.houseType === 'hoogbouw' ? ' De trap is zwaar. Zonder lift is elke verdieping een opgave.' : ' De trap is zwaar voor iemand met beperkte mobiliteit.') : '';
      const oud = profile.hasElderly ? ' Voor ouderen is de kou en het ongemak extra zwaar. Houd ze goed in de gaten.' : '';
      return 'Als je de wc gebruikt en doortrekt, merk je dat het water nauwelijks wegstroomt. Even later borrelt de afvoer van de wasbak en stinkt het naar riool. De waterdruk van de kraan is ook sterk verminderd. In deze wijk zit een rioolgemaal dat het afvalwater wegpompt. Zonder stroom werkt dat niet meer goed.' + mob + oud;
    },
    choices: [{
      conditionalOn: () => profile.houseType !== 'hoogbouw' && profile.houseType !== 'laagbouw',
      text: '🌳 Naar de achtertuin gaan (schep en vuilniszak)',
      consequence: 'Buiten, in de hoek van de tuin. Je graaft een klein gat, doet wat je moet doen en gooit er aarde over. Primitief. Effectief. Minder erg dan je dacht.',
      stateChange: {
        comfort: -1
      }
    }, {
      conditionalOn: () => profile.houseType === 'hoogbouw' || profile.houseType === 'laagbouw',
      text: '🪣 Emmer en vuilniszakken klaarleggen, er is geen tuin',
      consequence: 'Je zoekt een grote emmer op en legt vuilniszakken klaar. Niet ideaal, maar wel werkbaar. Zo heb je tenminste een plan voor de komende dagen.',
      stateChange: {
        comfort: -1
      }
    }, {
      text: '🚫 Waterafvoer afsluiten en zo min mogelijk water gebruiken',
      consequence: 'Je stopt de afvoeropeningen af met doppen of plastiek. Zo voorkom je dat rioolwater terugstroomt in huis.',
      stateChange: {
        handledSewage: true
      }
    }, {
      text: '🚽 Een noodemmer inrichten als wc',
      consequence: 'Een plastic emmer, een vuilniszak erin, wat desinfectiemiddel bij de hand. Je hebt een nood-wc. Het is niet fijn, maar het werkt zonder water te verspillen.',
      stateChange: {}
    }, {
      text: '📵 Nog even wachten, het valt vast mee',
      consequence: 'Je wacht. Het valt niet mee. Dat had je kunnen weten.',
      stateChange: {
        comfort: -1
      }
    }]
  },
  // SCENE AUTOLAAD — Conditional: has car + phone battery ≤ 25%, Day 2 morning
  {
    id: 'st_autolaad',
    time: '09:15',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    conditionalOn: () => (profile.hasCar || profile.hasMotorcycle) && state.phoneBattery <= 25,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const v = profile.hasCar ? 'auto' : 'motor';
      return `Je telefoon geeft een waarschuwing: de batterij staat op ${state.phoneBattery}%. Zonder oplader, zonder stroom. Dan schiet je iets te binnen: je ${v} staat buiten. De accu van de ${v} werkt nog. Via de USB-aansluiting kun je je telefoon opladen — langzaam, maar het werkt.`;
    },
    choices: [{
      text: () => profile.hasCar ? '🚗 Naar de auto om de telefoon op te laden' : '🚗 Naar de motor om de telefoon op te laden',
      consequence: () => {
        const koud = profile.location.includes('city') ? 'Op straat is het ijskoud.' : 'Buiten waait een scherpe wind.';
        const v = profile.hasCar ? 'auto' : 'motor';
        const desc = profile.hasCar
          ? `Je loopt naar de ${v}, stapt in en sluit de deur. Je sluit de telefoon aan op de oplader in de middenconsole. De display springt aan. Je laat hem een half uur opladen terwijl je luistert naar het geluid van de straat. Als je terugkomt, staat hij op 60%.`
          : `Je loopt naar de ${v} en sluit de telefoon aan op de USB-oplader. De display springt aan. Na een half uur laden staat hij op 60%.`;
        return koud + ' ' + desc;
      },
      stateChange: () => ({ phoneBattery: 60 - state.phoneBattery })
    }, {
      text: '⏭️ Nu even niet, later als het echt nodig is',
      consequence: 'Je legt de telefoon neer en spaart de laatste procenten voor als het echt nodig is. Je weet nu tenminste dat je die optie hebt.',
      stateChange: {}
    }]
  },
  // SCENE WATERTRUCK — Conditional: water or food at 0, Day 1 10:30
  {
    id: 'st_watertruck',
    time: '10:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    conditionalOn: () => (state.water === 0 || state.food === 0) && !state.day2Started,
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Heb je het gezien? Bij de Aldi staat een watertruck van de gemeente. Ze delen uit, maar de rij is lang. Schiet op!',
        time: '10:14',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Radio 1. Gemeenten organiseren wateruitdeelpunten. In uw gemeente is water beschikbaar bij een lokaal uitgiftepunt. Maximaal tien liter per persoon. Neem een eigen fles of jerrycan mee.'
    },
    get narrative() {
      const afstand = profile.location.includes('city') ?
        'De wateruitdeling is op vijf minuten lopen.' :
        'De wateruitdeling is in het dorp, een kwartier fietsen.';
      return 'Je huis heeft bijna niets meer. Je pakt je jas en stapt naar buiten. Bij de supermarkt wacht een onverwacht tafereel: een grote blauwe watertruck van de gemeente, omringd door tientallen mensen met jerrycans en flessen. Er is een ordelijke rij. Medewerkers met hesjes verdelen water, maximaal tien liter per persoon. Er staat ook een kleine tafel met bakken droog voedsel, zoals noodbiscuits en gedroogde soep. ' + afstand;
    },
    choices: [{
      text: '💧 In de rij gaan voor water',
      consequence: 'Je staat 25 minuten in de rij. Als je aan de beurt bent, vul je twee grote flessen. De medewerker noteert hoeveel water je meeneemt. Eén keer per persoon.',
      stateChange: {
        water: 2,
        hasWater: true
      }
    }, {
      text: '🍞 Vragen of er ook eten is bij de tafel',
      consequence: 'Je loopt naar de tafel met noodbiscuits. Er zijn kleine pakketjes. Je neemt er één mee. Bescheiden, maar het scheelt. Water moet je elders vandaan halen.',
      stateChange: {
        food: 1
      }
    }, {
      conditionalOn: () => !profile.location.includes('city') && (profile.hasBike || profile.hasScooter || profile.hasEbike),
      text: () => {
        const naam = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
        return `🚲 Met de ${naam} naar de wateruitdeling`;
      },
      consequence: () => {
        const naam = profile.hasBike ? 'fiets' : profile.hasScooter ? 'scooter' : 'e-bike';
        return `Je pakt de ${naam} en rijdt naar het dorp. Een kwartier rijden, maar de rij is korter dan je had verwacht. Met twee volle jerrycans rij je terug.`;
      },
      stateChange: {
        water: 2,
        hasWater: true
      }
    }, {
      text: '🏠 Terugkeren zonder te wachten, de rij is te lang',
      consequence: 'Je kijkt naar de rij en schat: nog een uur. Je draait om. Misschien later. Misschien morgen.',
      stateChange: {}
    }, {
      text: '🤝 Water halen én een extra fles meebrengen voor Annie',
      consequence: 'Je vertelt dat je ook voor een oudere buurvrouw haalt. De medewerker knikt en geeft je een extra fles. "Eén extra, meer mag niet." Bij Annie thuis is ze sprakeloos van dankbaarheid.',
      stateChange: {
        water: 1,
        hasWater: true,
        helpedNeighbor: true
      }
    }]
  },
  // SCENE 10b — Rob aan de deur
  {
    id: 'st_10b',
    time: '14:15',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Heb je de radio gehoord? Gemeente adviseert vanavond en vannacht binnen te blijven. Ik heb nog genoeg eten gelukkig. Hoe zitten jullie ervoor?',
        time: '14:10',
        outgoing: false
      }],
      nlalert: null,
      radio: 'De gemeente geeft het dringende advies om vanavond en vannacht binnen te blijven, tenzij het echt nodig is om naar buiten te gaan. In sommige plaatsen was het gisterennacht onrustig. De politie is extra aanwezig op drukke plekken. Het is nog steeds niet duidelijk wanneer de stroom hersteld is. Blijf thuis, blijf warm, help uw buren.'
    },
    narrative: 'Dan een klopje op de deur. Rob, je buurman. Hij houdt een lege fles vast en kijkt je aan. "Heb jij nog wat water over? Ik heb al een paar dagen niet veel meer in huis."',
    choices: [{
      text: '💧 Niets geven — je hebt zelf ook niet genoeg',
      consequence: 'Je legt uit dat je zelf ook weinig water meer hebt. Rob knikt, een beetje teleurgesteld, en loopt terug. Het voelt ongemakkelijk, maar je eigen voorraad is ook niet onbeperkt.',
      stateChange: {}
    }, {
      text: '🤝 Water delen met buurman Rob',
      consequence: 'Je loopt naar de deur. Rob staat buiten met een lege fles. Zijn gezicht zegt genoeg. Je kijkt naar je eigen voorraad, die ook niet eindeloos is. Toch geef je hem een fles. Dat voelt tegelijk goed en ongemakkelijk, want iedere liter telt.',
      stateChange: {
        water: -1,
        knowsNeighbors: true
      }
    }]
  },
  // SCENE 12b — Wat nu?
  {
    id: 'st_10',
    time: '14:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Het dringende advies blijft om vanavond en vannacht binnen te blijven. Het is donker op straat en hulpdiensten hebben het druk. Blijf thuis, help uw buren en houd uw radio aan voor updates.'
    },
    narrative: 'De dag vordert en het wordt steeds duidelijker dat dit niet morgen opgelost is. Buiten rijden af en toe politiewagens langs, langzamer dan normaal. Op straat zie je bijna niemand meer. Het is 9°C in huis. Wat doe je nu?',
    choices: [{
      text: '📦 Alle voedsel en water inventariseren en rantsoeneren',
      consequence: 'Je legt alles wat je hebt op de keukentafel. Daarna verdeel je het zo eerlijk en realistisch mogelijk over de komende dagen.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasCar || profile.hasMotorcycle,
      text: () => profile.hasCar ? '🚗 Je besluit de auto te pakken en de stad te gaan verkennen' : '🚗 Je besluit de motor te pakken en de stad te gaan verkennen',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je rijdt voorzichtig richting het centrum op je ${v}. Bij enkele winkels en tankstations is het druk en onoverzichtelijk. Op een paar kruispunten regelt de politie het verkeer met zaklampen. Je draait om. Dit kost nu vooral brandstof en levert weinig op.`;
      },
      stateChange: {}
    }, {
      text: '🏘️ De buren bij elkaar roepen, samen sta je sterker',
      consequence: 'Je klopt bij Rob, Annie en nog twee buren aan. Jullie spreken af om eten te delen, elkaar op de hoogte te houden en om beurten een oogje in het zeil te houden. Dat voelt een stuk beter dan ieder voor zich.',
      stateChange: {}
    }, {
      text: '🎲 Een bordspel pakken met het huishouden',
      consequence: 'Je haalt een spel tevoorschijn en gaat met kaarslicht aan tafel zitten. Schaak, mens-erger-je-niet of kaarten, het maakt even niet uit. Een uur lang raakt de crisis wat meer naar de achtergrond en ontspant iedereen zichtbaar.',
      stateChange: {
        comfort: 1
      }
    }]
  },
  // SCENE COOK_D1 — Day 1 evening cooking, 18:00
  {
    id: 'st_d1_avond',
    time: '18:00',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Goedenavond. Het dringende advies blijft om vanavond binnen te blijven. Gebruik geen open vuur binnenshuis zonder ventilatie vanwege koolmonoxide. Morgen meer nieuws over het herstel.'
    },
    get narrative() {
      const foodNote = (state.supermarketItems.length > 0 || state.hasExtraFood) ?
        'Je hebt genoeg te eten.' :
        'Je voorraad begint krap te worden.';
      return stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">7°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−4°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '⏱️ ~30 uur zonder stroom'
      ]) + 'De tweede avond zonder stroom. ' + foodNote + ' In de woonkamer staat het kwik op 7°C. Magen rammelen. Er is een dringend advies om binnen te blijven. De stroom is al meer dan een dag weg — en het gasfornuis doet het al een tijdje niet meer. Hoe kook je vanavond?';
    },
    choices: [{
      text: '🏕️ Campingkooktoestel of barbecue gebruiken',
      consequence: 'Je zet het campingkooktoestel bij een open raam, maar niet volledig binnen. Koolmonoxide blijft gevaarlijk. Het werkt gelukkig wel, en je maakt een warme maaltijd.',
      stateChange: {
        comfort: 1,
        hasCampingStove: true
      }
    }, {
      text: '🥄 Zuinig koken, kleine portie en voorraad sparen',
      consequence: 'Je maakt een halve portie, net genoeg om de ergste honger weg te nemen. De rest bewaar je. Zo houd je meer over voor de dagen erna, al knort je buik daarna nog steeds.',
      stateChange: {
        food: 1,
        comfort: -1
      }
    }, {
      text: '🥫 Koude maaltijd uit blik met crackers',
      consequence: 'Je eet koud. Het vult wel, maar bij 7°C voelt koud eten extra guur. Je lichaam kan die warmte juist goed gebruiken.',
      stateChange: {}
    }]
  },
  // SCENE 13 — Fire from improvised cooking or heating
  {
    id: 'st_11',
    time: '01:30',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 3',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Er zijn meldingen van kleine branden door kaarsen en kooktoestellen. Brandweer en politie hebben het druk. Bel 112 alleen bij levensgevaar. Het dringende advies is om binnen te blijven.'
    },
    narrative: 'Eerst hoor je stemmen buiten. Dan ruik je rook. Als je naar het raam loopt, zie je dat er bij de overburen iets brandt bij de schuur of een container. Waarschijnlijk is er iets misgegaan met open vuur of een kooktoestel.',
    choices: [{
      text: '🏠 Binnenblijven en door het raam in de gaten houden',
      consequence: 'Je blijft binnen en kijkt toe vanuit het raam. De brand lijkt beperkt te blijven tot de schuur. Na een tijdje dooft het vanzelf.',
      stateChange: {}
    }, {
      text: '📱 112 bellen',
      consequence: () => state.phoneBattery > 0
        ? 'Je belt 112. Na een tijdje krijg je iemand aan de lijn. Ze zijn al op de hoogte van meerdere kleine branden in de buurt. "Houd het in de gaten en blijf binnen. Als het overslaat, bel dan opnieuw." Je doet het raam dicht tegen de rook.'
        : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Je houdt de brand vanuit het raam in de gaten.',
      stateChange: {}
    }, {
      text: '🚪 Naar buiten om te kijken of de overburen hulp nodig hebben',
      consequence: 'Je loopt naar buiten. De overburen staan al in de tuin. Ze hebben zelf water gegooid en de brand is bijna uit. "Stomme fout met de gasfles", zegt de man. "Niemand gewond." Je gaat snel weer naar binnen.',
      stateChange: { helpedNeighbor: true }
    }]
  },
  // SCENE MORN_D2 — Day 2 morning, 08:00
  {
    id: 'st_d2_morgen',
    time: '08:00',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 3',
    dayBadgeClass: '',
    get channels() {
      const wa = state.helpedNeighbor ?
        [{
          from: 'Buurvrouw Annie',
          msg: 'Hoe gaat het bij jullie? Jan is iets stabieler. We zijn zo blij dat jullie er gisterennacht waren. Heel erg bedankt.',
          time: '07:45',
          outgoing: false
        }] :
        [{
          from: 'Buurvrouw Annie',
          msg: 'Jan gaat niet goed. Kunnen jullie iets brengen? Water misschien? Ik maak me zo ongerust.',
          time: '07:48',
          outgoing: false
        }];
      return {
        news: [],
        whatsapp: wa,
        nlalert: null,
        radio: 'Radio 1. Goedemorgen. De stroomstoring duurt nu meer dan veertig uur. Delen van Duitsland en Oostenrijk hebben gisteravond kort stroom gehad. Herstel in Nederland wordt verwacht binnen 24 uur. Vandaag zijn er lokale voedseluitdeelpunten. Luister naar Radio 1 voor de locaties bij u in de buurt.'
      };
    },
    get narrative() {
      const statusBar = stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">5°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−4°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '⏱️ ~44 uur zonder stroom'
      ]);
      const mood = state.comfort >= 4 ?
        'Je hebt geslapen. Niet goed, maar genoeg.' :
        state.comfort >= 2 ?
        'Je hebt slecht geslapen. Je ogen branden, je lichaam is stijf van de kou.' :
        'Je bent op. Twee nachten van stress en kou hakken erin. Voor je opstaat trek je de dekens nog even over je hoofd.';
      return statusBar + mood + ' Op straat zie je nog de verbrande plek bij de overburen. Veel gewone werkzaamheden liggen stil. Dit is dag twee.';
    },
    choices: [{
      text: '👁️ De straat bekijken door het raam',
      consequence: 'Een paar mensen lopen snel langs. Niemand praat. Iedereen houdt het hoofd gebogen. Op de hoek staat een man lang stil. Hij kijkt omhoog naar de lucht alsof hij ergens op wacht.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasRadio === 'ja',
      text: '📻 De radio aanzetten voor nieuws',
      consequence: 'Op de radio: "Delen van Duitsland en Oostenrijk hebben stroom gekregen. Herstel in Nederland wordt verwacht binnen 24 uur." 24 uur. Dat is lang. Maar het is iets.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasRadio !== 'ja' && (profile.hasCar || profile.hasMotorcycle),
      text: () => profile.hasCar ? '🚗 Zet de radio aan voor nieuws' : '🚗 Zet de radio op de motor aan voor nieuws',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je loopt naar de ${v} en zet de radio aan. Op de radio: "Delen van Duitsland en Oostenrijk hebben stroom gekregen. Herstel in Nederland wordt verwacht binnen 24 uur." 24 uur. Dat is lang. Maar het is iets.`;
      },
      stateChange: {}
    }, {
      text: '🤝 Naar Rob of Annie gaan voor informatie',
      consequence: '"Ik heb gehoord dat er vandaag een voedseluitdeling is," zegt Rob. "Ergens bij de wijk. Weet niet precies waar." Je maakt een mentale notitie.',
      stateChange: {}
    }, {
      text: '😔 Binnenblijven en wachten',
      consequence: 'Je trekt de gordijnen dicht. Binnen blijft het rustig. Je hebt nog wat eten. Je wacht.',
      stateChange: {}
    }]
  },
  // SCENE 14 — Day 2, morning + flyer + food distribution
  {
    id: 'st_12',
    time: '11:30',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 3',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Overbuurman',
        msg: 'Onze auto is weg. Gelukkig is niemand gewond. Gaat het bij jullie goed?',
        time: '10:45',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Na de brand in een belangrijk knooppunt bij Dronten zijn op meerdere plekken in Europa storingen ontstaan. Onderzoekers kijken nog naar de precieze oorzaak en het verloop van de storing. In sommige delen van Nederland is gisteravond kort stroom geweest. De minister-president heeft het land toegesproken en vraagt iedereen de rust te bewaren. Het draaiend houden van de drinkwatervoorziening heeft de hoogste prioriteit.'
    },
    get narrative() {
      const foodSituation = (state.wentToSupermarket && state.supermarketItems.length > 0) ?
        'Je hebt genoeg eten dankzij je supermarktbezoek.' :
        (state.hasExtraFood ?
          'Je hebt gelukkig wat extra voedsel in huis dat je eerder ingeslagen hebt.' :
          'Je voedselvoorraad is bijna op.');
      return `De rioollucht is nu echt niet meer te harden. Uit het afvoerputje in de bijkeuken borrelt vuil water omhoog. ${foodSituation} Dan gaat de bel. Een man loopt door de straat en stopt bij elk huis om gemeenteflyers uit te delen. Op de flyer staat hoe je warm blijft, een waarschuwing voor koolmonoxide, het advies om flessen en pannen met kraanwater te vullen, en de mededeling dat er vandaag van 13 tot 17 uur voedsel wordt uitgedeeld bij de supermarkt. Ook staat er dat het dorpssteunpunt open is voor informatie, warmte en hulp.`;
    },
    choices: [{
      text: '🥫 Naar de voedseluitdeling bij de supermarkt',
      consequence: 'De rij voor de supermarkt is lang maar beweegt gestaag. Na twintig minuten wachten ontvang je een noodpakket: twee blikken soep, crackers en een flesje water. Een vrijwilliger streept je huishouden af op een lijst. Eén pakket per huishouden.',
      stateChange: {
        food: 2,
        water: 1,
        wentToFoodDist: true
      }
    }, {
      text: '📄 De flyer weggooien, ik weet het al wel',
      consequence: 'Je legt de flyer opzij. Misschien stond er toch iets nuttigs in, maar dat zul je nu niet meer weten.',
      stateChange: {}
    }, {
      text: '🤝 De flyer ook bij buren brengen die hem misschien niet hebben',
      consequence: 'Je loopt de straat in en stopt de flyer bij drie huizen in de bus waarvan je weet dat er ouderen wonen. Buurvrouw Annie geef je hem persoonlijk. Meteen vertel je haar ook over de voedseluitdeling.',
      stateChange: {}
    }, {
      text: '🏘️ Naar het dorpssteunpunt gaan voor informatie en warmte',
      consequence: 'Je loopt naar het dorpssteunpunt in het dorp. Er zitten al een stuk of tien buurtbewoners. Een vrijwilliger deelt warme thee uit en heeft een radio aan staan. Op een whiteboard staat de laatste informatie van de gemeente: waterpunten, wanneer stroom verwacht wordt, wie hulp nodig heeft. Je blijft even om mee te luisteren.',
      stateChange: {
        comfort: 1,
        knowsNeighbors: true
      }
    }]
  },
  // SCENE COOK_D2 — Day 2 evening cooking, 18:00
  {
    id: 'st_d2_avond',
    time: '18:00',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 3',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Het herstel van het stroomnet vordert. In grote delen van Duitsland en Oostenrijk is de stroom terug. Voor Nederland verwacht men herstel morgen in de loop van de dag. Hou het vol. Blijf warm.'
    },
    get narrative() {
      const foodNote = state.wentToFoodDist ?
        'Je bent vandaag naar de voedseluitdeling geweest. Dat scheelt.' :
        (state.supermarketItems.length > 0 || state.hasExtraFood) ?
        'Je hebt nog voorraad uit je voorbereiding.' :
        'Je voedselvoorraad is bijna op.';
      return stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">6°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−3°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '⏱️ ~54 uur zonder stroom'
      ]) + 'Het is de derde avond. ' + foodNote + ' In huis is het nu echt koud. Je ziet je adem. De stroom is al meer dan twee dagen weg. Het gasfornuis doet het ook niet meer. Intussen weet je beter hoe je hiermee om moet gaan. Er moet vanavond opnieuw iets op tafel komen.';
    },
    choices: [{
      text: '🏕️ Campingkooktoestel of barbecue gebruiken',
      consequence: 'Je gebruikt het campingkooktoestel buiten of vlak bij een open raam, maar nooit helemaal binnen vanwege koolmonoxide. De gasbus is bijna leeg, al zit er nog net genoeg in voor één maaltijd.',
      stateChange: {
        comfort: 1,
        hasCampingStove: true
      }
    }, {
      text: '🥫 Koude maaltijd',
      consequence: 'Crackers, pindakaas, een blikje. Koud maar het vult. Je bewaart de laatste warme kookmogelijkheid voor morgenochtend.',
      stateChange: {}
    }, {
      text: '🤝 Buurvrouw Annie en Jan uitnodigen om mee te eten',
      consequence: 'Je klopt bij Annie en Jan aan. Ze aarzelen even, maar je nodigt hen toch binnen. Samen zitten jullie bij kaarslicht aan tafel met een warme pan eten. Heel even lijkt de stroomstoring ver weg. Het is misschien wel de meest oprechte maaltijd die je ooit hebt gehad.',
      stateChange: {
        food: -1,
        comfort: 1,
        helpedNeighbor: true
      }
    }]
  },
  // SCENE MORN_D3 — Day 3 morning, 08:00
  {
    id: 'st_d3_morgen',
    time: '08:00',
    date: 'Woensdag 3 februari 2027',
    dayBadge: 'Dag 4',
    dayBadgeClass: 'green',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Goedemorgen. Goed nieuws: het stroomnet wordt vandaag stapsgewijs hersteld in Nederland. Houd alle grote apparaten uitgeschakeld bij herstel om stroompieken te voorkomen. Om tien uur is er een voedseluitdeling bij de supermarkt. Het einde is in zicht.'
    },
    get narrative() {
      const statusBar = stroomStatusBar([
        '🌡️ Binnen: <b style="color:#60a5fa">4°C</b>',
        '❄️ Buiten: <b style="color:#93c5fd">−3°C</b>',
        '⚡ <b style="color:#ef4444">Stroom uit</b>',
        '⏱️ ~68 uur zonder stroom'
      ]);
      const opening = 'De derde ochtend. Bijna windstil buiten. ';
      if (state.knowsNeighbors) {
        return statusBar + opening + 'Er wordt geklopt. Rob staat voor de deur en zijn adem dampt in de kou. "Heb je het gehoord?" zegt hij. "In grote delen van Europa is de stroom terug. Nederland is een van de laatste, maar ze zeggen: vandaag." Hij valt even stil. "En om 10:00 is er hier in de buurt een voedseluitdeling." Voor het eerst in dagen voel je weer een beetje hoop.';
      } else if (profile.hasRadio === 'ja') {
        return statusBar + opening + 'Je zet de radio aan. De stem klinkt rustiger dan de afgelopen dagen. Er is eindelijk goed nieuws. Voor het eerst in dagen voel je weer een beetje hoop.';
      } else {
        return statusBar + opening + 'Geen nieuws van buiten. Je weet niet hoe het er elders voor staat. Het huis is stil. Je wacht af.';
      }
    },
    choices: [{
      conditionalOn: () => profile.hasRadio === 'ja',
      text: '📻 De radio aanzetten voor het laatste nieuws',
      consequence: 'Op de AM-radio: "De herstelwerkzaamheden zijn in de afrondende fase. We verwachten dat het stroomnet stapsgewijs wordt hersteld vandaag. Houd apparaten uitgeschakeld bij herstel om stroompieken te voorkomen." Je houdt je adem in.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasRadio !== 'ja' && (profile.hasCar || profile.hasMotorcycle),
      text: () => profile.hasCar ? '🚗 Zet de radio aan voor het laatste nieuws' : '🚗 Zet de radio op de motor aan voor het laatste nieuws',
      consequence: () => {
        const v = profile.hasCar ? 'auto' : 'motor';
        return `Je loopt naar de ${v} en zet de radio aan. Op de AM-radio: "De herstelwerkzaamheden zijn in de afrondende fase. We verwachten dat het stroomnet stapsgewijs wordt hersteld vandaag. Houd apparaten uitgeschakeld bij herstel om stroompieken te voorkomen." Je houdt je adem in.`;
      },
      stateChange: {}
    }, {
      text: '🍽️ Een klein ontbijtje van de laatste resten',
      consequence: 'Crackers, de laatste pindakaas, een appel. Koud maar plechtig. Vandaag misschien de laatste dag zonder stroom.',
      stateChange: {}
    }, {
      conditionalOn: () => state.knowsNeighbors || profile.hasRadio === 'ja',
      text: '🤝 De buren informeren over de voedseluitdeling en de hoop',
      consequence: 'Je klopt bij Rob en Annie aan. Rob grijpt je hand. "Echt?" Annie veegt een traan weg. Je brengt hoop naar mensen die het nodig hebben.',
      stateChange: {}
    }, {
      conditionalOn: () => state.knowsNeighbors || profile.hasRadio === 'ja',
      text: '🥫 Ga naar de voedseluitdeling om 10:00',
      consequence: 'Je besluit om 10:00 naar de supermarkt te gaan. Je trekt je jas aan en pakt een boodschappentas.',
      stateChange: { goingToFoodDistWed: true }
    }, {
      conditionalOn: () => state.knowsNeighbors || profile.hasRadio === 'ja',
      text: '🙈 Niets verwachten, ik geloof het pas als ik het zie',
      consequence: 'Je hebt te vaak "binnenkort" gehoord. Daarom houd je jezelf rustig. Beter niets verwachten dan opnieuw teleurgesteld worden.',
      stateChange: {}
    }]
  },
  // SCENE 15 — Food distribution (conditional: player chose to go Wednesday morning)
  {
    id: 'st_13',
    time: '10:15',
    date: 'Woensdag 3 februari 2027',
    dayBadge: 'Dag 4',
    dayBadgeClass: 'green',
    conditionalOn: () => state.goingToFoodDistWed === true,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. De voedseluitdeling is gestart op de aangekondigde locaties. Maximaal één portie per persoon. Bewaar geduld en wacht rustig uw beurt af. Het eerste stroomherstel in delen van de regio wordt verwacht vóór het middaguur.'
    },
    narrative: 'Bij het uitgiftepunt is het druk. Medewerkers delen per huishouden een beperkte hoeveelheid water en eten uit, zodat iedereen iets mee kan krijgen. De rij schuifelt langzaam maar geordend op. In jouw pakket zitten een kilo rijst, een blik tomaten, een paar appels en een brood. Terwijl je wacht, raken de mensen om je heen aan de praat.',
    choices: [{
      text: '🎒 Extra vragen of ze ook wat voor de zieke buurman hebben',
      consequence: 'Je vraagt aan de medewerker of er extra is voor een zieke buurman. Ze kijken elkaar aan. Na een korte aarzeling geven ze je een tweede klein pakketje. "Eén extra, meer kunnen we niet."',
      stateChange: {}
    }, {
      text: '⚡ Snel naar huis, ik wil niet te lang weg zijn',
      consequence: 'Je pakt je tasje en loopt meteen terug. Je bent 45 minuten weggeweest. Thuis is alles nog zoals je het hebt achtergelaten.',
      stateChange: {}
    }, {
      text: '💬 Praten met de mensen in de rij, informatie verzamelen',
      consequence: 'Iemand vertelt dat in Amsterdam-Noord de stroom al even terug was. Een ander zegt dat de overheid het net misschien per regio wil herstellen. Het zijn geruchten, maar ze geven wel hoop.',
      stateChange: {}
    }, {
      text: '👴 Een oudere man voor me laten gaan, hij staat te trillen van de kou',
      consequence: 'Je laat hem voorgaan. Hij bedankt je met een knik. Zijn vrouw pakt heel even je hand. Op dit soort momenten tellen kleine gebaren zwaar mee.',
      stateChange: {}
    }, {
      text: '💬👴🎒 Praten, iemand voorgaan laten en extra vragen voor de buurman',
      consequence: 'In de rij raak je aan de praat. Een oudere man staat te trillen, dus je laat hem voorgaan. Zijn vrouw pakt even je hand. Als je vooraan staat vraag je of er extra is voor een zieke buurman. Na wat aarzeling krijg je een tweede klein pakketje. "Eén extra, meer kunnen we niet." Je loopt terug met meer dan alleen eten.',
      stateChange: {}
    }]
  },
  // SCENE 16 — Power restored
  {
    id: 'st_14',
    time: '12:45',
    date: 'Woensdag 3 februari 2027',
    dayBadge: 'Dag 4',
    dayBadgeClass: 'green',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: 'Radio 1. Het is zover: de stroom is in grote delen van Nederland hersteld. Schakel grote apparaten één voor één in om overbelasting van het net te voorkomen. Laat kraanwater even doorstromen voordat u het drinkt. Nederland heeft het doorstaan.'
    },
    narrative: 'Dan flakkert het licht onverwacht aan. De koelkast begint te zoemen. De wasmachine, die je vergeten was uit te zetten, schiet ineens weer aan. Uit de televisie komt een branderige geur. Eén lamp knalt. Buiten hoor je de buren juichen. Het ergste lijkt voorbij. Toch is niet alles meteen normaal: de CV moet nog op gang komen en de rioollucht hangt nog in huis. Maar er is weer licht.',
    choices: [{
      text: '🛁 Het water laten lopen om de leidingen door te spoelen',
      consequence: 'Je draait de kraan open. Eerst komt er bruin water uit, daarna wordt het helderder. Na even spoelen komt er weer schoon water uit de kraan.',
      stateChange: {}
    }, {
      text: '⚡ Alle apparaten uitschakelen voordat er stroompieken schade aanrichten',
      consequence: 'Je loopt door het huis en zet alles handmatig uit. Daarna zet je apparaat voor apparaat langzaam terug aan. De TV ruikt wat gebrand, maar werkt nog.',
      source: { text: 'Denkvooruit: trek stekkers uit het stopcontact — zo voorkom je schade als de stroom terugkomt', url: 'https://www.denkvooruit.nl/risicos/risicos-in-nederland/geen-stroom' },
      stateChange: {}
    }, {
      text: '⚡ Alles direct aanpakken: apparaten uit en leidingen doorspoelen',
      consequence: 'Je werkt snel. Eerst schakel je alle apparaten handmatig uit, lamp voor lamp en stekker voor stekker. Daarna zet je de kraan open: eerst komt er bruin water, daarna helder. De leidingen zijn weer schoon.',
      stateChange: {}
    }, {
      text: '🤝 Bij Annie en Rob aanbellen om het nieuws te vieren',
      consequence: 'Je loopt de straat op. Rob staat al in de deuropening te zwaaien. Bij Annie is het stiller. Ze zijn blij dat de stroom terug is, maar Jan is nog steeds niet de oude en heeft medische aandacht nodig.',
      stateChange: {}
    }],
    get afterword() {
      const lines = [];
      if (state.helpedNeighbor) lines.push('Annie stuurt je de week erna nog appjes. Dat contact is er nu, en dat was er voor de storing niet.');
      if (state.handledSewage) lines.push('Je weet nu hoe je een ramp overleeft: niet via een app, maar via praktijk en aandacht.');
      if (state.hasWater) lines.push('Het ingeslagen water bleek goud waard. De tip om alvast te vullen staat nu permanent in je hoofd.');
      if (!state.hasCash) lines.push('Eén les die je nooit vergeet: zorg altijd voor contant geld in huis.');
      if (!lines.length) return null;
      return stroomAfterword(lines);
    }
  }
];

/* ─── SCENE ACHTERGRONDAFBEELDINGEN ─────────────────────────────────────────
   Koppelt scène-ID aan achtergrondafbeelding voor dit scenario.
   Wordt in engine.js samengevoegd tot sceneBgMap.
*/
const sceneImages_stroom = {
  st_pre_d1:   'afbeelding/stroomstoring/huis_winter_0.webp',
  st_d0_morgen:'afbeelding/stroomstoring/huis_winter_0.webp',
  st_2:        'afbeelding/stroomstoring/huis_winter_0.webp',
  st_1:        'afbeelding/stroomstoring/huis_winter_1.webp',
  st_3:        'afbeelding/stroomstoring/huis_winter_1.webp',
  st_4:        'afbeelding/stroomstoring/huis_winter_1.webp',
  st_5:        'afbeelding/stroomstoring/huis_winter_1.webp',
  st_6:        'afbeelding/stroomstoring/huis_winter_1.webp',
  st_6b:       'afbeelding/stroomstoring/huis_winter_1.webp',
  st_7:        'afbeelding/stroomstoring/huis_winter_2.webp',
  st_8:        'afbeelding/stroomstoring/huis_winter_2.webp',
  st_8b:       'afbeelding/stroomstoring/huis_winter_2.webp',
  st_d1_morgen:'afbeelding/stroomstoring/huis_winter_2.webp',
  st_9:        'afbeelding/stroomstoring/huis_winter_2.webp',
  st_autolaad: 'afbeelding/stroomstoring/huis_winter_2.webp',
  st_watertruck:'afbeelding/stroomstoring/huis_winter_2.webp',
  st_10b:      'afbeelding/stroomstoring/huis_winter_2.webp',
  st_10:       'afbeelding/stroomstoring/huis_winter_2.webp',
  st_d1_avond: 'afbeelding/stroomstoring/huis_winter_2.webp',
  st_11:       'afbeelding/stroomstoring/huis_winter_2.webp',
  st_d2_morgen:'afbeelding/stroomstoring/huis_winter_3.webp',
  st_12:       'afbeelding/stroomstoring/huis_winter_3.webp',
  st_d2_avond: 'afbeelding/stroomstoring/huis_winter_3.webp',
  st_d3_morgen:'afbeelding/stroomstoring/huis_winter_3.webp',
  st_13:       'afbeelding/stroomstoring/huis_winter_3.webp',
  st_14:       'afbeelding/stroomstoring/huis_winter_3.webp',
  st_4b:       'afbeelding/algemeen/supermarkt.webp',
};

// Appartement-varianten (hoogbouw / laagbouw): zelfde fase-indeling als huis_winter,
// maar specifiek voor een flatgebouw-interieur.
const sceneImages_stroom_appartement = {
  // Fase 0 — stroom werkt nog
  st_pre_d1:    'afbeelding/stroomstoring/appartement_winter_0.webp',
  st_d0_morgen: 'afbeelding/stroomstoring/appartement_winter_0.webp',
  st_2:         'afbeelding/stroomstoring/appartement_winter_0.webp',
  // Fase 1 — stroom uitgevallen
  st_1:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_3:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_4:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_5:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_6:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_6b:        'afbeelding/stroomstoring/appartement_winter_1.webp',
  st_7:         'afbeelding/stroomstoring/appartement_winter_1.webp',
  // Fase 2 — temperatuur daalt verder
  st_8:         'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_8b:        'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_d1_morgen: 'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_9:         'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_autolaad:  'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_watertruck:'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_10b:       'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_10:        'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_d1_avond:  'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_11:        'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_d2_morgen: 'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_12:        'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_d2_avond:  'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_d3_morgen: 'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_13:        'afbeelding/stroomstoring/appartement_winter_2.webp',
  st_14:        'afbeelding/stroomstoring/appartement_winter_2.webp',
};
