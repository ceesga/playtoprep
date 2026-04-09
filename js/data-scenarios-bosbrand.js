// ═══════════════════════════════════════════════════════════════
// Scenario: Bosbrand — "Een warme droge zomer"
// 23 scenes — van bf_0 (vrijdagavond) tot bf_7 (thuiskomst)
// Tijdspanne: ~24 uur
// ═══════════════════════════════════════════════════════════════

// ─── BOSBRAND SCENARIO ────────────────────────────────────────────────────────
const scenes_natuurbrand = [{
  id: 'bf_0',
  time: '16:00',
  date: 'Vrijdag 13 augustus 2027',
  dayBadge: 'Dag 0',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '15:30',
      headline: 'KNMI: verhoogd risico op natuurbranden verwacht zaterdag',
      body: 'Het KNMI waarschuwt voor droog en winderig weer morgen. De bodem is na weken zonder regen erg droog. In de regio zijn al twee kleine bosbranden gemeld. De brandweer staat paraat.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Het weerbericht voor morgen: droog en winderig, windkracht 6 uit het oosten, luchtvochtigheid laag. Brandweer waarschuwt voor verhoogd risico op natuurbranden in de regio.'
  },
  get narrative() {
    const natuur = profile.location.includes('rural_area') || profile.location.includes('forest')
      ? ' Je woont vlak bij natuurgebied, dus zulke waarschuwingen voelen meteen dichterbij.'
      : '';
    return 'Het is een gewone vrijdagmiddag. De tuin staat er wat dor bij na een lange periode zonder regen, maar verder is er weinig bijzonders. Het nieuws meldt dat morgen droog en winderig wordt, met een verhoogd risico op natuurbranden in de regio.' + natuur;
  },
  choices: [{
    text: '🎒 Noodtas klaarzetten voor het geval dat',
    consequence: 'Je pakt alvast een tas: paspoort, medicijnen, oplader, wat kleding. Zet hem bij de deur. Als het mis gaat, ben je klaar.',
    stateChange: {
      packedBag: true,
      awarenessLevel: 1
    }
  }, {
    text: '📰 Het nieuws extra in de gaten houden',
    consequence: 'Je zet een nieuwsmelding aan voor de regio en checkt voor het slapengaan nog een keer het laatste bericht. Als het morgen erger wordt, ben je alert.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    text: '🌿 Brandbare materialen rondom het huis weghalen',
    consequence: 'Je haalt droge bladhopen, tuinstoelen en andere brandbare spullen weg bij de buitenmuren en schutting. Het kost een half uur zweet, maar je woning is nu een stuk minder kwetsbaar als het vuur dichtbij komt.',
    cat: 'cat-action',
    stateChange: { madeFirebreak: true, awarenessLevel: 1 }
  }, {
    text: '🛌 Lekker slapen, morgen zien we wel',
    consequence: 'Je legt de telefoon neer. Het weerbericht ziet er niet best uit, maar zo erg zal het toch niet worden. Je slaapt.',
    stateChange: {}
  }]
}, {
  id: 'bf_0b',
  time: '08:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je bent \'s ochtends bezig met je ochtendritueel als je opeens een vage rooklucht opmerkt. Zwak, maar onmiskenbaar. Je stopt even en snuift de lucht op. Verbrand hout? Of iets anders? Je vraagt je af waar die geur vandaan komt.',
  choices: [{
    text: '🔍 Naar buiten gaan om te kijken waar de geur vandaan komt',
    consequence: 'Je stapt de deur uit en kijkt om je heen. De lucht hangt stil en warm. In de richting van het bos zie je heel vaag een lichte waas boven de boomtoppen. Niet veel. Maar genoeg om onrustig van te worden.',
    cat: 'cat-action',
    stateChange: { awarenessLevel: 1 }
  }, {
    text: '📱 Op de telefoon kijken of er al iets gemeld is',
    consequence: 'Je scrolt door het nieuws. Nog niets in de buurt, maar er is wel een KNMI-waarschuwing voor extreme droogte en hitte. Je besluit de situatie in de gaten te houden.',
    cat: 'cat-info',
    stateChange: { awarenessLevel: 1 }
  }, {
    text: '🙈 Het negeren, het zal wel meevallen',
    consequence: 'Je ruikt het nog even, en gaat dan verder met wat je aan het doen was. Misschien is het van ver. Misschien niks.',
    stateChange: {}
  }]
}, {
  id: 'bf_1',
  time: '09:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Buurman Kevin',
      msg: 'Hé, zie jij die rookpluim ook? Moeten we ons zorgen maken?',
      time: '09:10',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const kinderen = profile.hasChildren
      ? (profile.childrenCount === 1
        ? ' Je kind is al op.'
        : ' De kinderen zijn al op.')
      : '';
    const bewust = state.awarenessLevel > 0
      ? ' Die rooklucht van zo-even was dus geen verbeelding.'
      : ' Dat verklaart de rooklucht van zo-even.';
    return 'Je staat buiten als je in de verte een grijze rookpluim boven de boomtoppen ziet opstijgen.' + bewust + kinderen;
  },
  choices: [{
    text: '📱 Nieuws checken, wat is er aan de hand?',
    consequence: 'Je opent het nieuws: natuurbrand in de omgeving, brandweer ter plaatse. De wind staat voorlopig nog van de wijk af. Je besluit het goed in de gaten te houden.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    text: '🙈 Rookpluim negeren, het zal wel loslopen',
    consequence: 'Je gaat naar binnen. Het zal wel meevallen, denk je. Maar ondertussen houd je de situatie helemaal niet in de gaten.',
    stateChange: {}
  }, ]
}, {
  id: 'bf_2',
  time: '10:15',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '10:08',
      headline: 'NL-Alert: natuurbrand in de omgeving, mogelijk evacuatie nabijgelegen wijken',
      body: 'De brandweer heeft de brand nog niet onder controle. Er wordt rekening gehouden met een mogelijk evacuatiebevel voor nabijgelegen wijken. Bewoners worden opgeroepen alert te zijn.'
    }],
    whatsapp: [{
      from: 'Zus Lisa',
      msg: 'Jullie wonen toch bij het bos? Gaat alles goed? Ik zie het op het nieuws.',
      time: '10:20',
      outgoing: false
    }],
    nlalert: 'NL-Alert\n14 augustus 2027 – 10:08\n\nBosbrand in uw omgeving. Mogelijk evacuatiebevel. Let goed op. Houd deuren en ramen gesloten. Bereid je voor op een evacuatie. Update volgt.',
    radio: 'Radio 1: De brandweer heeft de natuurbrand nog niet onder controle. De wind is gedraaid. Mogelijk moeten omliggende wijken worden geëvacueerd. Leg een tas klaar met medicijnen, documenten en kleding voor twee dagen.'
  },
  narrative: 'De rookpluim is groter geworden en je ruikt de rook nu duidelijk. Je ogen prikken licht. Buiten zie je een buurvrouw haar auto volstouwen. Het begint serieus te worden.',
  choices: [{
    text: '🎒 Alvast een tas inpakken, voor het geval dat',
    consequence: 'Je pakt een tas met paspoort, medicijnen, oplader, wat kleding en contant geld. Als het bevel komt, kun je meteen weg. Slim.',
    stateChange: {
      packedBag: true
    }
  }, {
    text: '📱 Familie en vrienden informeren waar je bent',
    consequence: 'Je stuurt berichten naar familie. Ze weten nu waar je bent. Als communicatie later uitvalt, is dat goud waard.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    conditionalOn: () => profile.hasPets && !state.tookPets,
    text: () => petsCount > 1 ? '🐾 Huisdieren alvast in de transportmanden zetten' : '🐾 Huisdier alvast in de transportmand zetten',
    consequence: () => petsCount > 1
      ? 'De dieren zijn onrustig door de rook buiten. Het kost moeite om ze in de manden te krijgen, maar het lukt. Als het evacuatiebevel komt, ben je klaar om meteen te vertrekken.'
      : 'Je huisdier is onrustig door de rook buiten. Het kost moeite om het in de mand te krijgen, maar het lukt. Als het evacuatiebevel komt, ben je klaar om meteen te vertrekken.',
    stateChange: { tookPets: true }
  }, {
    conditionalOn: () => profile.hasChildren,
    text: () => profile.childrenCount === 1 ? '🧒 Even vijf minuten nemen om je kind uit te leggen wat er aan de hand is' : '🧒 Even vijf minuten nemen om de kinderen uit te leggen wat er aan de hand is',
    consequence: () => profile.childrenCount === 1 ? 'Je pakt je kind even apart. "Er is een brand dichtbij. We weten nog niet wat er gaat gebeuren, maar ik houd het goed in de gaten. Jij hoeft nu niets te doen." Je kind knikt. Dat helpt meer dan doen alsof er niets aan de hand is.' : 'Je neemt even vijf minuten. Jullie zitten aan tafel en je legt uit wat er aan de hand is, dat je alles goed volgt en wat er misschien gaat gebeuren. Ze luisteren serieus. Dat helpt meer dan wachten tot ze de spanning zelf voelen.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'bf_2b',
  time: '11:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '10:55',
      headline: 'Wind draait, vuurfront beweegt richting woonwijken',
      body: 'De wind is gedraaid en het vuurfront beweegt nu richting de woonwijken in het bosgebied. De brandweer schaalt op. Bewoners wordt dringend geadviseerd klaar te staan voor evacuatie.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: DRINGEND BERICHT. De wind is gedraaid. Het vuurfront beweegt richting woonwijken. Brandweer schaalt maximaal op. Bewoners van uw wijk en omgeving: zet u klaar voor evacuatie. Evacuatiebevel verwacht binnen dertig minuten.'
  },
  narrative: 'De rook is nu duidelijk te zien en te ruiken. De lucht heeft een oranje gloed. Je hoort in de verte sirenes. Op straat beginnen mensen hun auto in te rijden. De situatie verandert snel.',
  choices: [{
    text: '🚗 Nu zelf vertrekken, niet wachten op officieel bevel',
    consequence: 'Je besluit meteen te gaan. De weg is nog vrij. Je bent weg voordat de files ontstaan.',
    stateChange: () => ({
      evacuated: true,
      evacuatedEarly: true,
      ...(profile.hasChildren ? { kidsWithYou: true, kidsKeptHome: true } : {})
    })
  }, {
    text: '📻 Wachten op officieel bericht via radio',
    consequence: 'Je zet de radio op volle sterkte. Een minuut later: "Evacueert u direct." Je pakt alles in twee minuten bij elkaar.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    text: '🏘️ Buren waarschuwen voordat je vertrekt',
    consequence: 'Je klopt snel aan bij de buren. De bejaarde meneer naast je wist van niets. Je helpt hem zijn jas en medicijnen pakken. Drie minuten vertraging, maar hij is nu veilig.',
    stateChange: {
      awarenessLevel: 1,
      knowsNeighbors: true,
      warnedKevin: true
    }
  }]
}, {
  id: 'bf_2c',
  time: '11:15',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && !state.evacuatedEarly,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'De lucht is al een tijd oranje. Je kind staat buiten stil bij het hek en kijkt naar de rookwolk aan de horizon. Je kind speelt niet meer en voelt dat er iets mis is.' :
      'De lucht is al een tijd oranje. De kinderen staan buiten stil bij het hek en kijken naar de rookwolk aan de horizon. Ze spelen niet meer en zeggen niets. Ze voelen dat er iets mis is.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '📢 Naar buiten en je kind meteen naar binnen roepen' : '📢 Naar buiten en de kinderen meteen naar binnen roepen',
    consequence: () => profile.childrenCount === 1 ? 'Je roept vanuit de deur. Je kind draait zich om en komt meteen naar je toe. Je kind stelt geen vragen en voelt zelf ook dat dit serieus is.' : 'Je roept vanuit de deur. De kinderen draaien zich om en komen meteen naar je toe. Ze stellen geen vragen. Ze voelen zelf ook dat dit serieus is.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🚶 Naar buiten lopen en even naast je kind gaan staan' : '🚶 Naar buiten lopen en even naast de kinderen gaan staan',
    consequence: () => profile.childrenCount === 1 ? 'Je loopt de tuin in en gaat naast je kind staan. Jullie kijken even samen naar de horizon. Daarna zeg je rustig dat jullie naar binnen gaan. Je kind loopt zonder gedoe met je mee.' : 'Je loopt de tuin in en gaat naast de kinderen staan. Jullie kijken even samen naar de horizon. Daarna zeg je rustig dat jullie naar binnen gaan. Ze lopen zonder gedoe met je mee.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true,
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '⏳ Je kind nog even laten staan terwijl jij doorgaat' : '⏳ De kinderen nog even laten staan terwijl jij doorgaat',
    consequence: () => profile.childrenCount === 1 ? 'Je laat je kind nog even bij het hek staan en gaat verder met voorbereiden. Even later komt je kind zelf naar binnen, stiller dan normaal. Je weet niet hoe lang je kind daar al zo stond.' : 'Je laat de kinderen nog even bij het hek staan en gaat verder met voorbereiden. Even later komen ze zelf naar binnen, stiller dan normaal. Je weet niet hoe lang ze daar al zo stonden.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true
    }
  }]
}, {
  id: 'bf_2d',
  time: '11:20',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.kidsKeptHome === true && !state.evacuatedEarly,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Je kind is binnen. De rook hangt laag en je ruikt hem nu ook in huis. Je kind loopt stil achter je aan van kamer naar kamer. Het zegt niets en kijkt steeds naar jou.' :
      'De kinderen zijn binnen. De rook hangt laag en je ruikt hem nu ook in huis. Ze lopen stil achter je aan van kamer naar kamer. Ze zeggen weinig en kijken vooral naar jou.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🎒 Je kind een taak geven en een klein rugzakje laten pakken' : '🎒 De kinderen een taak geven en een klein rugzakje laten pakken',
    consequence: () => profile.childrenCount === 1 ? 'Je kind gaat meteen aan de slag. Even later staat het trots met een rugzakje: een knuffel, een boek en zijn favoriete trui. Het voelt zich nuttig en blijft rustiger.' : 'De kinderen gaan meteen aan de slag. Even later staan ze trots met hun rugzakjes. De een heeft een knuffel en sokken, de ander een boek en een flesje water. Ze voelen zich nuttig en blijven rustiger.',
    stateChange: {
      kidsNoodpakket: true
    }
  }, {
    text: '🗣️ Stoppen en rustig uitleggen wat er aan de hand is',
    consequence: () => profile.childrenCount === 1 ? '"Er is een natuurbrand in de buurt. We gaan zo naar een veilige plek. Jij hoeft alleen bij mij te blijven." Je kind knikt. Het weet waar het aan toe is en dat helpt meteen.' : '"Er is een natuurbrand in de buurt. We gaan zo naar een veilige plek. Jullie hoeven alleen bij mij te blijven." Ze knikken. Ze weten waar ze aan toe zijn en dat helpt meteen.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '📺 Je kind even op de telefoon laten kijken zodat jij verder kunt' : '📺 De kinderen even op de telefoon laten kijken zodat jij verder kunt',
    consequence: () => profile.childrenCount === 1 ? 'Je kind gaat zitten, maar kijkt steeds weer op van het scherm. Het scherm leidt af, maar neemt de onrust niet weg. Jij werkt door, maar het voelt niet goed.' : 'De kinderen gaan zitten, maar kijken steeds weer op van het scherm. Het scherm leidt af, maar neemt de onrust niet weg. Jij werkt door, maar het voelt niet goed.',
    stateChange: {}
  }]
}, {
  id: 'bf_3',
  time: '11:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => !state.evacuatedEarly,
  channels: {
    news: [{
      time: '11:28',
      headline: 'Officieel evacuatiebevel uw wijk en omgeving',
      body: 'De burgemeester heeft een officieel evacuatiebevel uitgevaardigd voor uw wijk en omgeving. Bewoners moeten direct vertrekken. Noodopvang: zie aangewezen locatie in uw dorp.'
    }],
    whatsapp: [{
      from: 'Buurman Kevin',
      msg: 'Evacuatiebevel!! Ik ga nu weg. Jij ook?',
      time: '11:32',
      outgoing: false
    }],
    nlalert: 'NL-Alert\n14 augustus 2027 – 11:28\n\nEVACUATIEBEVEL uw wijk en omgeving. VERLAAT NU UW WONING. Noodopvang: zie opsterland.nl/noodsteunpunten. Gebruik de aangewezen routes.',
    radio: null
  },
  narrative: 'Het evacuatiebevel is officieel. Je hebt maximaal 15 minuten. De rook hangt inmiddels laag over de straat. Je ogen prikken. Wat doe je?',
  choices: [{
    text: '📄 Paspoort, medicijnen en oplader meenemen, snel',
    consequence: 'Je pakt het belangrijkste. Paspoort in de binnenzak, medicijnen in de tas, oplader in de zijzak. Binnen drie minuten sta je buiten.',
    stateChange: {
      packedBag: true
    }
  }, {
    conditionalOn: () => profile.hasPets && !state.tookPets,
    text: '🐕 Eerst huisdier veiligstellen',
    consequence: 'Je pakt de transportmand en roept je huisdier. Het is bang en wil niet mee. Na anderhalve minuut heb je hem. Je verlaat het huis samen.',
    stateChange: {
      packedBag: true,
      tookPets: true
    }
  }, {
    text: '💎 Waardevolle spullen inpakken, laptop, sieraden, harde schijf',
    consequence: 'Je begint dozen te zoeken. Laptop erin, dan de sieraden uit de slaapkamer, dan de harde schijf. Maar terwijl je de fotoboeken pakt ruik je de rook nu ook binnen. Je kijkt op de klok: twaalf minuten voorbij. De rook prikt in je keel. Je laat alles vallen en rent naar buiten met alleen wat je al in je handen hebt. Buiten zie je de oranje gloed achter de bomen. Je had tien minuten eerder moeten vertrekken.',
    stateChange: {
      packedBag: false,
      comfort: -1
    }
  }, {
    text: '⚡ Nu direct weg, niets meenemen',
    consequence: 'Je pakt niets en loopt direct de deur uit. Geen tas, geen documenten. Je verlaat het huis en gaat zo snel mogelijk weg.',
    stateChange: {
      evacuated: true
    }
  }]
}, {
  id: 'bf_3c',
  time: '12:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && !state.evacuatedEarly,
  channels: {
    news: [],
    whatsapp: [{
      from: 'Groep: Buurtapp',
      msg: 'Brandalarm gaat af maar buren reageren niet → mijn zoon dacht dat het vals alarm was en wilde niet mee. Pas op: kinderen lezen de situatie af van anderen!',
      time: '11:57',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    const vertrek = profile.hasCar
      ? 'De auto staat klaar.'
      : profile.hasBike
      ? 'De fietsen staan klaar.'
      : 'Jullie staan klaar om te vertrekken.';
    const reden = profile.hasPets ? 'voor het huisdier' : 'voor een knuffel';
    const buur = profile.hasCar
      ? ' Je buurman toetert vanuit zijn auto.'
      : ' Je buurman roept dat jullie moeten opschieten.';
    return een
      ? 'Je gaat evacueren. ' + vertrek + ' Maar bij de voordeur stokt het. Je kind wil terug naar binnen ' + reden + '. Tegelijk staat het stil naar de oranje lucht te kijken.' + buur
      : 'Je gaat evacueren. ' + vertrek + ' Maar bij de voordeur stokt het. De jongste wil terug naar binnen ' + reden + '. De oudste staat buiten stil naar de oranje lucht te kijken en beweegt niet.' + buur;
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '⚡ Je kind bij de hand pakken en meteen verdergaan' : '⚡ Iedereen meteen meenemen en verdergaan',
    consequence: () => profile.childrenCount === 1
      ? 'Je pakt je kind bij de hand en trekt het mee. Het smeekt nog even om ' + (profile.hasPets ? 'het huisdier' : 'de knuffel') + ', maar jullie moeten echt weg. Onderweg blijft het huilen.'
      : 'De jongste smeekt nog even om ' + (profile.hasPets ? 'het huisdier' : 'de knuffel') + '. Je zegt dat jullie nu moeten gaan. Ze komt mee, maar onderweg blijft ze huilen. De rest van de tocht is het stil.',
    stateChange: {
      kidsNoodpakket: false,
      comfort: -1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🗣️ Je kind aanspreken dat bevroren lijkt van de schrik' : '🗣️ De oudste aanspreken die bevroren is bij de deur',
    consequence: () => profile.childrenCount === 1 ? 'Je pakt je kind bij de hand: "Ik snap dat je niet weet wat je moet doen. Ik ben bij je. We gaan samen." Het stopt met staren en loopt mee.' : 'Je pakt zijn hand: "Ik snap dat je niet weet wat je moet doen. Ik ben bij je. We gaan samen." Hij stopt met staren en loopt mee. De jongste volgt automatisch als ze hem ziet bewegen.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.hasPets ? '🐾 Even teruggaan voor het huisdier' : '🧸 Even teruggaan voor de knuffel',
    consequence: () => profile.hasPets
      ? 'Je rent toch nog naar binnen om het huisdier te pakken. Dat lukt, maar de weg is nu drukker. Jullie verliezen kostbare minuten.'
      : 'Je rent toch nog naar binnen om de knuffel te pakken. Dat lukt, maar de weg is nu drukker. Jullie verliezen kostbare minuten.',
    stateChange: {
      kidsNoodpakket: false,
      phoneBattery: -5
    }
  }, {
    text: '📋 Herinneren aan jullie vaste gezinsplan',
    consequence: () => profile.childrenCount === 1 ? '"Weet je nog wat we hadden afgesproken als er iets ernstigs gebeurt?" Je kind knikt en loopt meteen mee. Het kent het plan.' : '"Weet je nog wat we hadden afgesproken als er iets ernstigs gebeurt?" De oudste knikt en begint te lopen. De jongste volgt meteen. Ze kennen het plan.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'bf_4',
  time: '12:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const geenAuto = !profile.hasCar
      ? profile.hasBike
        ? ' Je hebt geen auto, maar wel een fiets. De achterpaden zijn vrij van files.'
        : ' Je hebt geen auto en geen fiets. Je gaat te voet — drie kilometer door de rook.'
      : '';
    const huisdier = profile.hasPets
      ? state.tookPets
        ? (petsCount > 1 ? ' Je hebt je huisdieren bij je.' : ' Je hebt je huisdier bij je.')
        : (petsCount > 1 ? ' Je huisdieren laat je noodgedwongen achter.' : ' Je huisdier laat je noodgedwongen achter.')
      : '';
    return 'Je verlaat het huis. De lucht is oranje-bruin en de rook is dik.' + (state.evacuatedEarly ? ' Omdat je vroeg bent vertrokken staat de weg nog vrij. Je ziet hoe de auto\'s achter je al beginnen op te stapelen.' : ' De straat staat vol met auto\'s die allemaal richting de uitvalswegen rijden.') + geenAuto + huisdier + ' Hoe ga je naar de noodopvang?';
  },
  choices: [{
    conditionalOn: () => profile.hasCar,
    text: '🚗 Met de auto via de hoofdweg',
    consequence: () => state.evacuatedEarly
      ? 'Je stapt in en voegt vroeg in op de hoofdweg. Het verkeer rijdt nog door, maar achter je wordt het snel drukker.'
      : 'Je rijdt naar de hoofdweg. Daar staat nu al een file van twee kilometer. Iedereen heeft hetzelfde idee gehad.',
    stateChange: {
      bfTravelMode: 'car'
    }
  }, {
    conditionalOn: () => profile.hasBike && !profile.hasMobilityImpaired,
    text: '🚲 Met de fiets via de achterpaden',
    consequence: 'Je pakt de fiets. De achterpaden zijn vrij van auto\'s, maar de rook hangt er laag tussen de bomen.',
    stateChange: {
      bfTravelMode: 'bike'
    }
  }, {
    conditionalOn: () => !profile.hasMobilityImpaired,
    text: '🚶 Te voet, het is 3 kilometer',
    consequence: 'Je besluit te lopen. Geen auto nodig, geen file, maar de lucht is zwaar en je moet het helemaal op eigen kracht doen.',
    stateChange: {
      bfTravelMode: 'walk'
    }
  }, {
    conditionalOn: () => profile.hasMobilityImpaired,
    text: '🆘 Hulp vragen voor evacuatie, zelf lukt dit niet',
    consequence: 'Je belt 112. De lijn is druk. Na acht minuten krijg je iemand aan de lijn. Er komt een bus langs voor mensen die niet zelfstandig kunnen evacueren. Je wacht in de rook.',
    stateChange: {
      comfort: -2,
      health: -1,
      evacuated: true
    }
  }]
}, {
  id: 'bf_4b',
  time: '12:15',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.bfTravelMode === 'car',
  channels: {
    news: [{
      time: '12:10',
      headline: 'Files op evacuatieroutes, politie leidt verkeer om',
      body: 'Op de evacuatieroutes staan files van meerdere kilometers. Politie is aanwezig om het verkeer te begeleiden.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Op de evacuatieroutes staan zware files. Politie leidt verkeer om via alternatieve routes. Gebruik deze omleiding als u nu onderweg bent.'
  },
  get narrative() {
    return state.evacuatedEarly ? 'Jij bent vroeg genoeg vertrokken. De hoofdweg is nog redelijk vrij, al is het wel drukker dan normaal. De radio is nog te horen. Wat doe je?' : 'Je staat muurvast in de file. De rook is overal. De radio doet het nog. Wat doe je?';
  },
  choices: [{
    text: () => state.evacuatedEarly ? '📻 Radio aanhouden en de hoofdroute blijven volgen' : '📻 Radio luisteren voor alternatieve route',
    consequence: () => state.evacuatedEarly
      ? 'Je houdt de radio aan en volgt de aanwijzingen onderweg. Omdat je er vroeg bij was, blijf je in beweging en bereik je zonder stilstand de noodopvang.'
      : 'De radio geeft een alternatieve route. Je rijdt eraf en komt via een rustigere weg alsnog bij de noodopvang aan.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: () => state.evacuatedEarly ? '🛣️ Meteen de omleiding nemen voordat het vastloopt' : '🛤️ Auto aan de kant, te voet verder',
    consequence: () => state.evacuatedEarly
      ? 'Je neemt direct de omleiding die de politie adviseert. Vijf minuten later zie je in je spiegel dat de hoofdweg alsnog dichtslibt. Via de omweg kom je zonder file bij de noodopvang aan.'
      : 'Je zet de auto in een zijstraat en loopt de rest. Het is twintig minuten lopen, maar je bent sneller dan de file.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: () => state.evacuatedEarly ? '🚘 Ramen dicht en rustig doorrijden' : '⏳ In de file blijven wachten',
    consequence: () => state.evacuatedEarly
      ? 'Je houdt de ramen dicht en blijft rustig doorrijden. Het verkeer vertraagt even, maar valt nog niet stil. Je bereikt de noodopvang zonder extra omweg.'
      : 'De file komt langzaam op gang. Na 45 minuten ben je er. Ondertussen hangt er steeds meer rook in de auto. Achteraf had je de airco beter uitgezet.',
    stateChange: {
      evacuated: true
    }
  }]
}, {
  id: 'bf_4c',
  time: '12:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.bfTravelMode === 'bike',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je fietst via de achterpaden. De straten zijn leeg, want bijna iedereen zit in de auto. Alleen hangt de rook hier juist laag tussen de bomen. Je rijdt langs de bosrand, de geur van verbrand hout is scherp en je ogen prikken. De fiets is snel, maar je longen protesteren.',
  choices: [{
    text: '😤 Doorrijden, bijna er',
    consequence: 'Je houdt je shirt voor je neus en trapt door. Na een kwartier kom je aan bij de noodopvang, buiten adem maar ongedeerd.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: '🔀 Omrijden via de doorgaande weg',
    consequence: 'Je kiest een langere route met minder bosrand. Meer verkeer, maar schonere lucht. Na 25 minuten ben je er.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: '🚶 Fiets laten staan en te voet een stuk',
    consequence: 'Je zet de fiets tegen een hek en loopt het laatste stuk. De weg is hier breed genoeg om de rook te vermijden. Je komt aan.',
    stateChange: {
      evacuated: true
    }
  }]
}, {
  id: 'bf_4d',
  time: '12:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.bfTravelMode === 'walk',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Je loopt. Op straat rennen mensen, terwijl auto\'s zich stapvoets vooruitduwen. De rook hangt laag boven de weg. Drie kilometer is normaal gesproken 35 minuten, maar nu voelt het veel langer. De lucht is zwaar en overal hoor je mensen hoesten.',
  choices: [{
    text: '🚶 Stevig doorlopen, kop naar beneden',
    consequence: 'Je houdt je jas voor je mond en loopt in een stevig tempo door. Na 40 minuten kom je aan bij de noodopvang, bezweet en met tranende ogen.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: '🚗 Lift vragen aan een langsrijdende auto',
    consequence: 'Je steekt je hand op. Een gezin stopt. "Stap in, we gaan ook naar de noodopvang." Je bent er in tien minuten.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: '🧣 Natte doek voor de mond, en rustig aan',
    consequence: 'Je maakt je shirt nat en houdt het voor je neus. Je loopt rustig maar gestaag verder. Het duurt langer, maar ademen gaat beter.',
    stateChange: {
      evacuated: true
    }
  }]
}, {
  id: 'bf_4e',
  time: '12:45',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.kidsKeptHome === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Onderweg wordt de rook dikker. Je kind merkt dat ook. Zijn ogen tranen en hij houdt zijn adem in. Je voelt dat het te veel wordt.' :
      'Onderweg wordt de rook dikker. De kinderen zijn stil. De jongste begint te hoesten, wrijft in haar ogen. De oudste houdt zijn shirt voor zijn neus maar kijkt jou aan: "Is dit gevaarlijk?" De rook is overal.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🧣 Je shirt als filter gebruiken en uitleggen hoe je door de stof ademt' : '🧣 Shirts als filter gebruiken en uitleggen hoe je door de stof ademt',
    consequence: () => profile.childrenCount === 1 ? 'Je trekt je eigen shirt omhoog en laat zien hoe het moet. Je kind doet het na. Het helpt niet perfect, maar wel een beetje. En het geeft je kind iets om op te letten.' : 'Je trekt je eigen shirt omhoog en laat zien hoe het moet. De kinderen doen het na. Het helpt niet perfect, maar wel een beetje. En het geeft ze iets om op te letten.',
    stateChange: {}
  }, {
    text: () => profile.childrenCount === 1 ? '💬 Even stoppen, knielen, rustig uitleggen dat het bijna voorbij is' : '💬 Even stoppen, knielen, rustig uitleggen dat het bijna voorbij is',
    consequence: () => profile.childrenCount === 1 ? '"We zijn er bijna. De noodopvang is om de hoek." Je kind knikt. Even stilstaan en uitleggen helpt meer dan doorrennen zonder woorden.' : '"We zijn er bijna. De noodopvang is om de hoek." De kinderen kijken je aan. Even stilstaan en uitleggen helpt meer dan doorrennen zonder woorden.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🏃 Doorgaan, hand pakken en doorlopen' : '🏃 Doorgaan, handen pakken en doorlopen',
    consequence: () => profile.childrenCount === 1 ? 'Je pakt de hand van je kind en loopt snel door. Er is nu geen tijd voor een lange uitleg. Eerst moeten jullie veilig aankomen.' : 'Je pakt beide handen vast en loopt snel door. Er is nu geen tijd voor een lange uitleg. Eerst moeten jullie veilig aankomen.',
    stateChange: {}
  }]
}, {
  id: 'bf_5',
  time: '13:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '13:15',
      headline: 'Noodopvang overvol, extra locatie geopend',
      body: 'De noodopvang heeft de maximale capaciteit bereikt. De gemeente opent een extra noodopvang in een nabijgelegen gebouw.'
    }],
    whatsapp: [{
      from: 'Zus Lisa',
      msg: 'Zijn jullie veilig?? Ik volg het op het nieuws. Bel me als je kan!',
      time: '13:40',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    let txt = 'Je bent bij de noodopvang aangekomen. De sporthal zit stampvol. Overal zie je mensen, huilende kinderen en verwarde ouderen. Er zijn rijen voor water, voor registratie en voor slaapplekken. Het netwerk is overbelast, dus berichten versturen lukt maar half.';
    if (!state.packedBag) txt += ' Je hebt niets bij je: geen oplader, geen schone kleding en geen documenten.';
    if (state.evacuatedEarly) txt += ' Omdat je vroeg was, vind je nog een slaapplek bij de ingang. Daar is het een stuk rustiger dan midden in de hal.';
    return txt;
  },
  choices: [{
    text: '📋 Registreren bij de gemeente, officieel aangemeld zijn',
    consequence: 'Je wacht 25 minuten in de rij en meldt je aan. Nu weet de gemeente dat je veilig bent. Dat kan later veel gedoe schelen.',
    stateChange: {
      evacuated: true
    }
  }, {
    text: '📱 Eerst familie bellen, ze weten niet of je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Bellen lukt niet, want het netwerk is overbelast. Daarom stuur je een bericht: "Veilig bij de noodopvang." Twintig minuten later zie je dubbele vinkjes. Ze weten het nu.' : 'Je telefoon is leeg. Je kunt je familie niet bereiken.',
    stateChange: {}
  }, {
    text: '🛏️ Snel een slaapplek claimen voordat alles weg is',
    consequence: 'Je loopt door de hal en vindt een rustig hoekje bij de muur. Je legt er je jas neer. Later blijkt dat slim, want halverwege de avond is alles vol.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'bf_5f',
  time: '13:45',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true && state.kidsKeptHome === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'In de sporthal grijpt je kind jouw hand vast en laat die niet meer los. Het kijkt rond naar de slaapmatten, de mensen en de herrie. "Slapen we hier?" vraagt het zacht.' :
      'In de sporthal grijpt de jongste jouw hand vast. De oudste staat een stap achter je en kijkt rond naar de slaapmatten, de mensen en de herrie. "Slapen we hier?" vraagt de jongste.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🗺️ Samen de hal verkennen en een plek zoeken' : '🗺️ Samen de hal verkennen en een plek zoeken',
    consequence: () => profile.childrenCount === 1 ? 'Je loopt met je kind door de hal en wijst dingen aan. De drinkwaterpost, de toiletten en de kinderhoek. Je kind onthoudt het. Dat geeft meteen meer rust.' : 'Je loopt met de kinderen door de hal en wijst dingen aan. De drinkwaterpost, de toiletten en de kinderhoek. Ze onthouden het. Dat geeft meteen meer rust.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🛏️ Snel een rustige plek zoeken en die claimen' : '🛏️ Snel een rustige plek zoeken en die claimen',
    consequence: () => profile.childrenCount === 1 ? 'Je vindt een hoekje bij de muur, ver van de deur. Je legt er je jas neer. Je kind kruipt ernaast. Even is de chaos buiten jullie bubbel.' : 'Je vindt een hoekje bij de muur, ver van de deur. Je legt er je jas neer. De kinderen kruipen ernaast. Even is de chaos buiten jullie bubbel.',
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => state.kidsNoodpakket,
    text: () => profile.childrenCount === 1 ? '🎒 Rugzakje openmaken en kijken wat je kind heeft meegenomen' : '🎒 Rugzakjes openmaken en kijken wat ze hebben meegenomen',
    consequence: () => profile.childrenCount === 1 ? 'Je kind opent zijn rugzakje. Er zitten een knuffel, een boek en kaarten in. Het kijkt er trots naar. Dan zie je hoe belangrijk voorbereiding ineens wordt.' : 'De kinderen openen hun rugzakjes. De een heeft een knuffel, de ander een boek. Ze kijken er trots naar. Dan zie je hoe belangrijk voorbereiding ineens wordt.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'bf_5b',
  time: '15:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: De brand is voor 60% onder controle. Brandweer verwacht het vuur voor middernacht geïsoleerd te hebben. Bewoners van de geëvacueerde wijken kunnen naar verwachting morgenochtend terug. De noodopvang blijft de komende nacht open.'
  },
  narrative: 'Het wachten begint. Er staat een rij voor een maaltijd met brood, kaas en een kop soep. De kinderhoek is druk. Iemand naast je heeft een radio aan. Dat blijkt hier de enige echt betrouwbare informatiebron.',
  choices: [{
    text: '🍞 In de rij voor eten en drinken',
    consequence: 'Na 20 minuten wachten krijg je een pakket: een boterham, een appel, een fles water. Niet veel, maar het is iets. Tussendoor plug je je telefoon in bij een van de stekkerdozen langs de wand.',
    stateChange: {
      food: 1,
      phoneBattery: 30
    }
  }, {
    text: '🛏️ Slaapplek regelen voor de nacht',
    consequence: 'Je vraagt een vrijwilliger om een slaapmat en deken. Er zijn er nog maar een paar. Je krijgt er net op tijd eentje. Je hangt je oplader in het stopcontact naast je plek.',
    stateChange: {
      comfort: 1,
      phoneBattery: 30
    }
  }, {
    text: '👵 Iemand anders helpen, er zijn mensen die het zwaarder hebben',
    consequence: 'Je helpt een oude dame haar medicijnen terug te vinden. Ze is in paniek omdat ze denkt dat haar tas kwijt is. Samen vinden jullie de medicijnen in een binnenzak. Daarna laad je rustig je telefoon op bij een stekkerdoos.',
    stateChange: {
      helpedNeighbor: true,
      phoneBattery: 30
    }
  }, {
    conditionalOn: () => !state.packedBag,
    text: '🔌 Vragen of er een stopcontact vrij is, en een oplader lenen',
    consequence: 'In de hoek ligt een stekkerdoos. Je vraagt een vrouw of ze een oplader heeft die past. Zonder aarzelen geeft ze die aan je. Na twintig minuten laadt je telefoon merkbaar op. Gelukkig is er in de noodopvang nog stroom.',
    stateChange: {
      phoneBattery: 30
    }
  }]
}, {
  id: 'bf_5c',
  time: '15:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.warnedKevin,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  narrative: 'Iemand tikt je op de schouder. Het is Kevin, je buurman. "Hé, ik zag je staan. Goed dat je me vandaag gewaarschuwd hebt. Anders had ik het veel later doorgehad." Hij knikt je toe. "Ik meen het echt."',
  choices: [{
    text: '🤝 Blij zijn dat hij veilig is',
    consequence: 'Je praat even bij. Kevin is gevlucht met zijn hond en een rugzak. Zijn huis staat er nog. Het voelt goed om te merken dat je echt iets voor iemand hebt betekend.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '😌 Niets bijzonders, iedereen had dat gedaan',
    consequence: 'Je wuift het weg. Voor jou stelt het weinig voor. Kevin lacht. "Voor mij wel."',
    stateChange: {}
  }]
}, {
  id: 'bf_5d',
  time: '18:00',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '17:45',
      headline: 'Brand grotendeels onder controle, terugkeer morgenochtend mogelijk',
      body: 'De brandweer heeft de brand voor 80% onder controle. Terugkeer naar de wijk is naar verwachting morgenochtend mogelijk zodra de brand volledig geblust is en de luchtkwaliteit veilig is.'
    }],
    whatsapp: [{
      from: 'Buurman Kevin',
      msg: 'Heb je nieuws gehoord? Morgen mogen we misschien terug. Ik hoop dat ons huis er nog staat.',
      time: '17:55',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  narrative: 'De avond valt. In de sporthal wordt het stil. Mensen proberen te slapen op slaapmatten en gebruiken hun jassen als kussen. Je vraagt je af of je huis er nog staat.',
  choices: [{
    text: '😴 Proberen te slapen, morgen is een lange dag',
    consequence: 'Je sluit je ogen. Het is lawaaiig, maar uiteindelijk val je toch in slaap. Niet ideaal, wel nodig.',
    stateChange: {}
  }, {
    text: '📻 Nieuws volgen via iemands radio',
    consequence: 'Iemand naast je heeft een radio aan. Je luistert mee. De brand is 80% onder controle. Morgenochtend mogelijk terug.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    text: '🗣️ Gesprek aangaan met andere evacuees',
    consequence: 'Je raakt in gesprek met een gezin uit dezelfde straat. Ze hebben een kind dat bang is. Jullie wisselen telefoonnummers uit. In crisis zijn banden snel gelegd.',
    stateChange: {
      knowsNeighbors: true
    }
  }]
}, {
  id: 'bf_5g',
  time: '18:30',
  date: 'Zaterdag 14 augustus 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren && state.kidsWithYou === true,
  channels: {
    news: [],
    whatsapp: [],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ?
      'Je kind ruikt nog naar rook. Het zit in het haar en in de kleren. Het is moe maar wil niet slapen. Dan vraagt het ineens: "Had ons huis ook kunnen branden?" Je weet het antwoord, maar niet meteen hoe je het moet zeggen.' :
      'De kinderen ruiken nog naar rook. Het zit in hun haar en in hun kleren. De jongste wil niet slapen. De oudste zit stil. Dan vraagt hij ineens: "Had ons huis ook kunnen branden?" Je merkt dat die vraag al de hele avond in hem zat.';
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '💬 Eerlijk antwoorden: "Ja, dat had gekund. Maar het is niet gebeurd."' : '💬 Eerlijk antwoorden: "Ja, dat had gekund. Maar het is niet gebeurd."',
    consequence: () => profile.childrenCount === 1 ? 'Je kind knikt langzaam. Even blijft het stil. Daarna legt het zijn hoofd neer. Eerlijk antwoorden helpt meer dan je dacht.' : 'De oudste knikt langzaam. De jongste kijkt naar hem en daarna naar jou. Even blijft het stil. Daarna legt ze haar hoofd neer. Eerlijk antwoorden helpt meer dan je dacht.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🤫 Naast je kind gaan zitten zonder veel te zeggen' : '🤫 Naast de kinderen gaan zitten zonder veel te zeggen',
    consequence: () => profile.childrenCount === 1 ? 'Je legt je arm om je kind heen. Geen uitleg, geen groot verhaal. Alleen even samen zitten. Na een paar minuten wordt de ademhaling rustiger en valt het in slaap.' : 'Je legt je arm om de oudste heen. De jongste kruipt tegen je aan. Zonder veel woorden wordt het langzaam rustiger. Na een tijdje vallen ze allebei in slaap.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🌲 Uitleggen hoe bossen na brand teruggroeien' : '🌲 Uitleggen hoe bossen na brand teruggroeien',
    consequence: () => profile.childrenCount === 1 ? '"Bomen kunnen dat, weet je. Ze zien er dood uit, maar de wortels leven nog. Over twee jaar staan er weer jonge boompjes." Je kind zegt niets. Maar het stopt met vragen. Even later zijn de ogen dicht.' : '"Bomen kunnen dat, weet je. Ze zien er dood uit, maar de wortels leven nog. Over twee jaar staan er weer jonge boompjes." De oudste zegt niets. Maar hij stopt met vragen. Even later zijn alle ogen dicht.',
    stateChange: {}
  }]
}, {
  id: 'bf_6',
  time: '09:00',
  date: 'Zondag 15 augustus 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  channels: {
    news: [{
      time: '08:45',
      headline: 'Brand volledig geblust, terugkeer geëvacueerde wijken toegestaan',
      body: 'De natuurbrand in het gebied is volledig geblust. Bewoners van de geëvacueerde wijken mogen terugkeren. Controleer of er schade is en meld dit bij de gemeente.'
    }],
    whatsapp: [{
      from: 'Gemeente',
      msg: 'Beste bewoner, de brand is geblust. U mag terugkeren naar uw woning. Controleer de woning op schade voor u naar binnen gaat.',
      time: '09:00',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: De natuurbrand in het gebied is volledig geblust. Bewoners van de geëvacueerde wijken mogen terugkeren. De gemeente vraagt bewoners schade te melden.'
  },
  narrative: 'Het is eindelijk ochtend. Je hebt slecht geslapen. Buiten is de lucht nog wit van de rook, maar het NL-Alert is verdwenen. Mensen komen langzaam overeind. Je vraagt je af of het nu echt veilig is.',
  choices: [{
    text: '📋 Wachten op officieel sein veilig van gemeente',
    consequence: 'Je wacht rustig. Om 9 uur komt de bevestiging: terugkeer is toegestaan. Samen met de andere bewoners ga je terug naar de wijk.',
    stateChange: {
      returnedHome: true
    }
  }, {
    text: () => profile.hasCar ? '🚗 Alvast zelf gaan kijken bij de woning' : profile.hasBike ? '🚲 Alvast zelf gaan kijken bij de woning' : '🚶 Alvast zelf gaan kijken bij de woning',
    consequence: 'Je gaat alvast voorzichtig terug. Een politieagent bij de ingang laat je door. Het sein veilig is net gegeven. Je woning staat er nog.',
    stateChange: {
      returnedHome: true
    }
  }, {
    text: '⏳ Nog even wachten, de situatie is nog onduidelijk',
    consequence: 'Je wacht. Een uur later is er meer duidelijkheid en ga je zonder extra stress terug.',
    stateChange: {
      returnedHome: true
    }
  }]
}, {
  id: 'bf_6b',
  time: '10:00',
  date: 'Zondag 15 augustus 2027',
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
        'Je kind loopt naast je de straat in. Overal ligt as: op de stoep, op de auto\'s en in de tuin. De boom in de voortuin staat er nog, maar aan de overkant is een huis helemaal weg. Alleen de fundering en wat balken zijn over. Je kind stopt en vraagt: "Waarom staat ons huis er nog en hun huis niet?"' :
        'De kinderen lopen naast je de straat in. As op de stoep. De boom staat er nog. Maar aan de overkant: twee huizen weg, alleen funderingen over. De jongste pakt jouw hand. De oudste vraagt zacht: "Waarom staat ons huis er nog en hun huis niet?"';
    } else {
      return een ?
        'Je kind loopt de straat in en stopt bij de voordeur. Overal ligt as: op de stoep, op de auto en op de vensterbanken. Het veegt met een vinger over de ruit. "Alles is grijs," zegt het. Verderop is van twee huizen bijna niets over.' :
        'De jongste loopt meteen naar de tuin. As op het gras, op het speelgoed. Ze veegt haar hand af aan haar broek. De oudste staat stil bij de stoep en kijkt naar de overkant: twee huizen weg, alleen funderingen over. Hij zegt niets.';
    }
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🗣️ Eerlijk antwoorden waarom ons huis er nog staat' : '🗣️ Eerlijk antwoorden waarom ons huis er nog staat',
    consequence: () => profile.childrenCount === 1 ? '"Dat weet niemand precies. Wind, toeval, de route van het vuur." Je kind knikt langzaam. Soms is het antwoord: we hebben geluk gehad. Dat is ook een antwoord.' : '"Dat weet niemand precies. Wind, toeval, de route van het vuur." De oudste knikt langzaam. De jongste kijkt naar de overkant. Soms is het antwoord: we hebben geluk gehad. Dat is ook een antwoord.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🌳 Samen de tuin in lopen en rustig rondkijken' : '🌳 Samen de tuin in lopen en rustig rondkijken',
    consequence: () => profile.childrenCount === 1 ? 'De boom staat er nog. Het speelgoed ligt er ook nog, maar alles ruikt naar as en verbrand hout. Je kind benoemt wat het ziet. Zo begint het verwerken.' : 'De boom staat er nog. Het speelgoed ligt er ook nog, maar alles ruikt naar as en verbrand hout. De kinderen benoemen wat ze zien. Zo begint het verwerken.',
    stateChange: {}
  }, {
    conditionalOn: () => state.kidsNoodpakket,
    text: () => profile.childrenCount === 1 ? '💬 Terugvragen wat het moeilijkste moment was' : '💬 Terugvragen wat het moeilijkste moment was',
    consequence: () => profile.childrenCount === 1 ? '"Toen ik de vlammen zag," zegt je kind. "Maar ik was minder bang dan ik dacht." Als je vraagt waarom, zegt het: "Omdat ik wist wat we gingen doen." Goede voorbereiding blijkt juist nu belangrijk.' : '"Toen ik de vlammen zag," zegt de oudste. "Maar ik was minder bang dan ik dacht." De jongste knikt. "Ik ook. We wisten wat we moesten doen." Goede voorbereiding blijkt juist nu belangrijk.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'bf_7',
  time: '11:00',
  date: 'Zondag 15 augustus 2027',
  dayBadge: 'Dag 2',
  dayBadgeClass: 'blue',
  channels: {
    news: [],
    whatsapp: [{
      from: 'Buurman Kevin',
      msg: 'Mijn schuur is weg maar het huis staat er nog. Jij?',
      time: '11:10',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    if (state.kidsWithYou) {
      return 'De lucht ruikt nog naar as en verbrande hars. Je bent al even terug, maar nu komen de vragen pas echt. Bij jou en bij je kind' + (profile.childrenCount > 1 ? 'eren' : '') + '. Sommige huizen in de buurt zijn beschadigd, met zwarte gevels en kapotte dakpannen. Jouw woning staat er nog.';
    }
    return 'Je komt je straat weer in. De lucht ruikt naar as en verbrande hars. Sommige huizen in de buurt zijn beschadigd, met aangeblakerde gevels en kapotte dakpannen. Jouw woning staat er nog.';
  },
  choices: [{
    text: '🏠 Woning inspecteren, eerst buiten en dan binnen',
    consequence: 'Je loopt eerst om het huis heen. Geen zichtbare brandschade. Binnen is alles intact. Alleen op de vensterbanken buiten ligt een laagje roet.',
    stateChange: {
      returnedHome: true
    }
  }, {
    text: '📸 Schade fotograferen voor de verzekering',
    consequence: 'Je maakt foto\'s van de buurt en de gevels. Jouw huis heeft lichte rookschade aan de buitengevel. Handig voor de verzekering.',
    stateChange: {
      returnedHome: true
    }
  }, {
    text: '🤝 Buren helpen die meer schade hebben',
    consequence: 'Je loopt naar Kevin. Zijn schuur is verloren, maar hij staat er goed bij. Samen inventariseren jullie de schade. Hij is blij met de hulp.',
    stateChange: {
      returnedHome: true,
      helpedNeighbor: true
    }
  }]
}];
