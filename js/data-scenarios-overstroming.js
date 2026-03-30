// ═══════════════════════════════════════════════════════════════
// Scenario: Overstroming — "Het water staat hoog"
// 25 scenes — van ov_0 (avond, hoog water) tot ov_8 (thuiskomst)
// Tijdspanne: ~18 uur
// ═══════════════════════════════════════════════════════════════

// ─── OVERSTROMING SCENARIO ────────────────────────────────────────────────────
const scenes_overstroming = [{
  id: 'ov_0',
  time: '20:00',
  date: 'Maandag 10 november 2027',
  dayBadge: 'Dag 0',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '19:30',
      headline: 'KNMI: code oranje voor rivierengebied, extreme wateraanvoer verwacht',
      body: 'Door aanhoudende regen in het Rijngebied en smeltwater uit de Alpen verwacht KNMI morgen extreem hoge waterstanden. Rijkswaterstaat waarschuwt bewoners van laaggelegen poldergebieden alert te zijn.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Heb jij het nieuwsbericht gezien? Zal toch niet zo erg worden zeker?',
      time: '20:05',
      outgoing: false
    }],
    nlalert: null,
    radio: 'Radio 1: Het KNMI heeft code oranje afgegeven voor het rivierengebied. De waterstanden stijgen snel door zware regenval bovenstrooms. Rijkswaterstaat vraagt bewoners in kwetsbare gebieden voorbereidingen te treffen.'
  },
  narrative: 'Het is maandagavond. Je woont op loopafstand van de rivier. Het uitzicht is er mooi en op zonnige dagen kan je er echt van genieten. Buiten regent het gestaag. De lucht voelt zwaar en vochtig, drukkend. In de verte klinkt de regen harder op de daken dan normaal. De rivier stond deze week al hoog.',
  choices: [{
    text: '🎒 Noodtas inpakken en documenten waterdicht verpakken',
    consequence: 'Je pakt een tas: paspoort, medicijnen, oplader, kleding. Documenten stop je in een ziplock. Als het bevel komt, ben je klaar.',
    stateChange: {
      packedBag: true,
      awarenessLevel: 1
    }
  }, {
    text: '📰 Hoogwaterbericht extra in de gaten houden',
    consequence: 'Je zet meldingen aan voor het rivierengebied en leest het KNMI-bericht goed door. Als het morgen escaleert, ben je alert.',
    stateChange: {
      awarenessLevel: 1
    }
  }, {
    text: '🛌 Gewoon gaan slapen, het zal wel meevallen',
    consequence: 'Code oranje is niet code rood. Je legt de telefoon neer. Het zal wel meevallen.',
    stateChange: {}
  }]
}, {
  id: 'ov_1',
  time: '07:00',
  date: 'Dinsdag 11 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '06:30',
      headline: 'Hoogwaterwaarschuwing voor rivierengebied, verwacht peil stijgt',
      body: 'Het KNMI waarschuwt voor hoge waterstanden in het rivierengebied. Door zware regenval en smeltwater uit Duitsland verwacht Rijkswaterstaat dat het peil de komende uren snel zal stijgen.'
    }],
    whatsapp: [],
    nlalert: null,
    radio: 'Radio 1: Hoogwaterwaarschuwing voor het rivierengebied. Het verwachte waterpeil stijgt en nadert kritische niveaus. Rijkswaterstaat heeft stuwen en gemalen op maximale capaciteit. Bewoners in laaggelegen gebieden worden geadviseerd alert te zijn.'
  },
  get narrative() {
    return 'Je wordt wakker van de regen die hard tegen je raam slaat. Het is dinsdag, vroeg in de ochtend. Het klinkt zwaarder dan normaal, aanhoudender.' + (state.awarenessLevel > 0 ? ' Die code oranje van gisteren zat nog vers in je hoofd.' : '');
  },
  choices: [{
    text: '🎒 Direct beginnen met voorbereiding',
    consequence: 'Je begint alvast: documenten in een waterdichte zak, medicijnen, kleding. Je zet je schoenen bij de deur. Als het bevel komt ben je klaar.',
    stateChange: {
      awarenessLevel: 1,
      packedBag: true
    }
  }, {
    text: '🙈 Afwachten, het regelt zichzelf wel',
    consequence: 'Je gaat door met je ochtendroutine. Buiten stijgt het water al licht. Je merkt het pas als je naar de brievenbus loopt en natte voeten krijgt.',
    stateChange: {}
  }]
}, {
  id: 'ov_1b',
  time: '07:30',
  date: 'Dinsdag 11 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => profile.hasChildren,
  channels: {
    news: [],
    whatsapp: [{
      from: 'School De Klimop',
      msg: 'Goedemorgen, we volgen het hoog waterpeil. School is vandaag open. Wel vragen we u om uw kind snel op te halen bij een eventueel evacuatiebevel. We houden u op de hoogte.',
      time: '07:25',
      outgoing: false
    }],
    nlalert: null,
    radio: null
  },
  get narrative() {
    const een = profile.childrenCount === 1;
    return een ? 'Je kind is opgestaan en vraagt of het naar school gaat. Je kijkt buiten. Er staat al wat water op de stoep. De lucht hangt laag en grijs.' : 'De kinderen zijn opgestaan en vragen of ze naar school gaan. Je kijkt buiten. Er staat al wat water op de stoep. De lucht hangt laag en grijs.';
  },
  choices: [{
    text: '🏫 Toch naar school brengen, school is open',
    consequence: () => profile.childrenCount === 1 ? 'Je brengt je kind naar school. Wel houd je je telefoon de komende uren scherp in de gaten.' : 'Je brengt de kinderen naar school. Wel houd je je telefoon de komende uren scherp in de gaten.',
    stateChange: {
      sentKidsToSchool: true
    }
  }, {
    text: '🏠 Thuis houden uit voorzorg',
    consequence: () => profile.childrenCount === 1 ? 'Je houdt je kind thuis. Je kind is bij je als het escaleert. School begrijpt het.' : 'Je houdt de kinderen thuis. Ze zijn bij je als het escaleert. School begrijpt het.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true
    }
  }, {
    text: '🏠 Thuis houden én even samen doorlopen wat jullie gaan doen',
    consequence: () => profile.childrenCount === 1 ? 'Je houdt je kind thuis en neemt vijf minuten om rustig uit te leggen wat er aan de hand is. Wat jullie gaan doen als het water te hoog wordt. Je kind luistert serieuzer dan je had verwacht.' : 'Je houdt de kinderen thuis. Jullie zitten even aan tafel: wat er aan de hand is, wat jullie gaan doen, wat ze van jou kunnen verwachten. Ze luisteren serieuzer dan je had verwacht.',
    stateChange: {
      kidsWithYou: true,
      kidsKeptHome: true,
      kidsNoodpakket: true
    }
  }]
}, {
  id: 'ov_1d',
  time: '08:00',
  date: 'Dinsdag 11 november 2027',
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
    stateChange: {
      kidsNoodpakket: true
    }
  }, {
    text: () => profile.childrenCount === 1 ? '📺 Je kind achter een scherm zetten zodat jij verder kunt' : '📺 De kinderen achter een scherm zetten zodat jij verder kunt',
    consequence: () => profile.childrenCount === 1 ? 'Je kind gaat zitten en jij werkt door. Toch kijkt het steeds weer op van het scherm. Je merkt dat het de spanning voelt, ook zonder vragen te stellen.' : 'De kinderen gaan zitten en jij werkt door. Toch kijken ze steeds weer op van het scherm. Je merkt dat ze de spanning voelen, ook zonder veel te zeggen.',
    stateChange: {}
  }, {
    text: () => profile.childrenCount === 1 ? '🗣️ Stoppen en rustig uitleggen wat er aan de hand is' : '🗣️ Stoppen en rustig uitleggen wat er aan de hand is',
    consequence: () => profile.childrenCount === 1 ? '"Er komt veel water. We gaan straks naar een veilige plek. Jij hoeft alleen bij mij te blijven." Je kind knikt. Het weet nu beter wat er gebeurt en dat helpt meteen.' : '"Er komt veel water. We gaan straks naar een veilige plek. Jullie hoeven alleen bij mij te blijven." Ze knikken. Ze weten nu beter wat er gebeurt en dat helpt meteen.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_2',
  time: '09:30',
  date: 'Dinsdag 11 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  channels: {
    news: [{
      time: '09:15',
      headline: 'Water stijgt snel, meerdere straten ondergelopen',
      body: 'In het rivierengebied staan meerdere straten blank. Het waterpeil stijgt sneller dan verwacht. Rijkswaterstaat meldt dat pompen de aanvoer niet meer kunnen bijhouden.'
    }],
    whatsapp: [{
      from: 'Buurvrouw Ans',
      msg: 'Heb je het gezien? De Molendijk staat al blank. Onze straat staat morgen ook zo denk ik',
      time: '09:22',
      outgoing: false
    }],
    nlalert: 'NL-Alert\n11 november 2027 – 09:20\n\nHoogwater in uw omgeving. Verwachte waterstand neemt snel toe. Wees alert. Bereid u voor op mogelijk evacuatiebevel. Houd deuren en ramen gesloten.',
    radio: 'Radio 1: Het waterpeil stijgt sneller dan verwacht. Op meerdere plaatsen langs de rivier begint water over de kaden te lopen. Bewoners in laaggelegen gebieden: zorg dat u kunt vertrekken op korte termijn.'
  },
  narrative: 'Je kijkt naar buiten. De straat staat al 5 centimeter blank. Het water stijgt zichtbaar. Een buurman loopt haastig met laarzen door de straat. Er is haast geboden.',
  choices: [{
    text: '🪟 Ramen dichten, deuren afdichten en zandzakken neerleggen',
    consequence: 'Je stopt handdoeken onder de deuren, sluit ramen en legt je zandzakken voor de drempel. Dit vertraagt het water, maar houdt het niet tegen. Geeft je extra tijd.',
    stateChange: {
      sealedHome: true
    }
  }, {
    text: '🚗 Nu meteen weg, vóór de wegen onderlopen',
    consequence: 'Je pakt het essentiële en rijdt weg. Goede timing, want de weg is nog begaanbaar.',
    stateChange: {
      evacuatedFlood: true
    }
  }, {
    conditionalOn: () => !profile.hasChildren,
    text: '📱 Ans een berichtje terugsturen en vragen hoe het bij haar is',
    consequence: 'Je stuurt Ans een appje terug. Ze maakt zich zorgen maar heeft geen auto. Jullie spreken af elkaar in de gaten te houden.',
    stateChange: {
      contactedAns: true
    }
  }]
}, {
  id: 'ov_2b',
  time: '09:45',
  date: 'Dinsdag 11 november 2027',
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
    text: '⏳ Even wachten en straks tegelijk ophalen en spullen pakken',
    consequence: 'Je wacht een kwartier. Als je rijdt, staat de weg al half blank. Je komt er nog, maar het was spannend.',
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
  }]
}, {
  id: 'ov_2c',
  time: '10:00',
  date: 'Dinsdag 11 november 2027',
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
    stateChange: {
      comfort: -1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🗣️ Je kind aanspreken dat verstijfd bij het raam staat' : '🗣️ De oudste aanspreken die verstijfd bij het raam staat',
    consequence: () => profile.childrenCount === 1 ? 'Je knielt naast je kind en vraagt wat het ziet. "Komt ons huis vol water?" vraagt het. Je legt uit wat er gebeurt. Langzaam komt er weer beweging in.' : 'Je knielt naast hem en vraagt wat hij ziet. "Komt ons huis vol water?" vraagt hij. Je legt uit wat er gebeurt. Langzaam komt er weer beweging in.',
    stateChange: {
      phoneBattery: -5
    }
  }, {
    conditionalOn: () => profile.childrenCount > 1,
    text: '🛑🗣️ Beide kinderen aanpakken: jongste tegenhouden én oudste aanspreken',
    consequence: 'Je houdt de jongste stevig vast en legt uit waarom ze niet terug mag. Dan kniel je naast de oudste: "Wat zie je?" vraagt je. "Komt ons huis vol water?" vraagt hij. Je legt het uit. Langzaam komen allebei tot rust.',
    stateChange: {
      comfort: -1
    }
  }, ]
}, {
  id: 'ov_3',
  time: '10:30',
  date: 'Dinsdag 11 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => !state.evacuatedFlood,
  channels: {
    news: [{
      time: '10:20',
      headline: 'Evacuatiebevel laaggelegen wijken rivierengebied',
      body: 'De burgemeester heeft een evacuatiebevel uitgevaardigd voor laaggelegen wijken in het rivierengebied. Bewoners moeten direct vertrekken of naar de bovenste verdieping gaan als vertrekken niet meer mogelijk is.'
    }],
    get whatsapp() {
      return (state.contactedAns && !profile.hasChildren) ? [{
        from: 'Ans',
        msg: 'Ben je al aan het inpakken? Ik hoor buiten sirenes. Ik heb geen auto, ik weet niet wat ik moet doen 😟',
        time: '10:18',
        outgoing: false
      }] : [];
    },
    nlalert: 'NL-Alert\n11 november 2027 – 10:22\n\nEVACUATIEBEVEL laaggelegen wijken rivierengebied. VERLAAT DIRECT UW WONING of ga naar een hogere verdieping. Gebruik aangewezen evacuatieroutes.',
    radio: 'Radio 1: Evacuatiebevel voor laaggelegen wijken. Als vertrekken niet meer mogelijk is: ga naar de bovenste verdieping. Sluit de meterkast af. Bel 112 alleen in levensbedreigende situaties.'
  },
  narrative: 'De straat staat nu kniehoog blank. Je auto is omringd door water, dus weggrijden is riskant. Het water stijgt nog steeds. Wat doe je?',
  choices: [{
    conditionalOn: () => !profile.hasMobilityImpaired,
    text: '🏠 Boven blijven en naar de eerste verdieping gaan',
    consequence: 'Je klimt naar boven. Je neemt water, eten en je telefoon mee. Beneden stijgt het water verder.',
    stateChange: {
      wentUpstairs: true
    }
  }, {
    conditionalOn: () => profile.hasMobilityImpaired,
    text: '🆘 Hulp vragen om naar een hogere verdieping te komen',
    consequence: 'Je belt aan bij de buren en vraagt hulp. Met twee mensen lukt het om naar boven te komen. Het kost kostbare tijd. Het water staat al in de gang.',
    stateChange: {
      health: -1,
      comfort: -1,
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
    text: '🚗 Toch proberen weg te rijden',
    consequence: 'Je stapt in de auto. Het water staat al bijna aan de drempel. Rijden in 30 cm water is gevaarlijk, want auto\'s kunnen bij 60 cm al gaan drijven. Je rijdt voorzichtig, maar komt na 100 meter vast te staan.',
    stateChange: {
      wentUpstairs: false,
      evacuatedFlood: false
    }
  }]
}, {
  id: 'ov_3c',
  time: '10:45',
  date: 'Dinsdag 11 november 2027',
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
    text: () => profile.childrenCount === 1 ? '🗣️ Knielen en eerlijk zeggen: "Het huis kan nat worden, maar wij redden het samen"' : '🗣️ Bij de oudste knielen en eerlijk zeggen: "Het huis kan nat worden, maar wij redden het samen"',
    consequence: () => profile.childrenCount === 1 ? 'Je kind kijkt je aan. Even is het stil. Daarna loopt het weer mee de trap op. Eerlijk zijn helpt hier beter dan doen alsof er niets aan de hand is.' : 'De oudste knikt langzaam en loopt mee. De jongste ziet dat en volgt vanzelf. Eerlijk zijn helpt hier beter dan doen alsof er niets aan de hand is.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🛑 Hand pakken en doorlopen: "We praten boven verder"' : '🛑 De jongste meenemen en doorlopen: "We praten boven verder"',
    consequence: () => profile.childrenCount === 1 ? 'Je pakt de hand van je kind en loopt door. Het protesteert even, maar komt mee. Boven heb je meer tijd voor vragen.' : 'Je pakt de jongste vast en loopt door. Ze protesteert even, maar komt mee. Boven heb je meer tijd voor vragen.',
    stateChange: {}
  }, {
    conditionalOn: () => profile.childrenCount > 1,
    text: '🏃 Beide kinderen meenemen en zelf kalm blijven',
    consequence: 'Je loopt rustig maar doelgericht. Er zit geen paniek in je stem. De kinderen letten op jouw gedrag en blijven daardoor ook rustiger.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_4a',
  time: '11:00',
  date: 'Dinsdag 11 november 2027',
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
    return state.takingAns ? 'Je bent boven met Ans. Beneden stijgt het water en je hoort het kabbelen. Twee paar ogen zien meer dan één. Hoe bereid je de komende uren voor?' : 'Je bent boven. Beneden stijgt het water en je hoort het kabbelen. Hoe bereid je de komende uren voor?';
  },
  choices: [{
    text: '💧 Water en eten meenemen naar boven',
    consequence: 'Je haalt flessen water, blikjes, crackers en een blik opener naar boven. Als het water nog hoger stijgt, heb je een dag proviand.',
    stateChange: {
      savedItems: true,
      food: 1
    }
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡ Meterkast afsluiten voor de veiligheid',
    consequence: 'Je loopt naar de meterkast beneden, die al half onder water staat. Je gooit de hoofdschakelaar eruit. Goed instinct, want water en stroom zijn levensgevaarlijk.',
    stateChange: {
      cutElectricity: true,
      savedItems: true
    }
  }, {
    text: '📱 112 bellen en je locatie doorgeven',
    consequence: () => state.phoneBattery > 0 ? 'Je belt 112 en meldt je locatie. Ze registreren je. "Blijf boven, reddingsboot is onderweg." Nu weet de hulpdienst waar je bent.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Niemand weet waar je bent.',
    stateChange: () => state.phoneBattery > 0 ? {
      calledRescue: true
    } : {}
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡💧 Meterkast afsluiten en eten naar boven brengen',
    consequence: 'Je loopt snel naar beneden, met water tot aan je enkels, en zet de hoofdschakelaar uit. Daarna pak je flessen water, blikjes en crackers en neem je alles mee naar boven. Zo houd je stroom en water gescheiden en heb je eten en drinken dichtbij.',
    stateChange: {
      cutElectricity: true,
      savedItems: true,
      food: 1
    }
  }, ]
}, {
  id: 'ov_4c',
  time: '12:30',
  date: 'Dinsdag 11 november 2027',
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
    text: () => profile.childrenCount === 1 ? '🎲 Een spelletje verzinnen of verhaal vertellen om de tijd door te komen' : '🎲 Een spelletje verzinnen of verhaal vertellen om de tijd door te komen',
    consequence: () => profile.childrenCount === 1 ? 'Je begint een verzonnen verhaal over een avonturier die door het water vaart. Je kind gaat liggen en luistert. Even is de wereld kleiner dan de slaapkamer.' : 'Je begint een verzonnen verhaal over een avonturier die door het water vaart. De jongste kruipt naast je, de oudste doet alsof hij niet luistert maar luistert toch. Even is de wereld kleiner dan de slaapkamer.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🪟 Samen door het raam kijken en benoemen wat je ziet' : '🪟 Samen door het raam kijken en benoemen wat je ziet',
    consequence: () => profile.childrenCount === 1 ? '"Daar drijft een fiets." "Dat is een reddingsboot." "Dat is de buurman zijn auto." Je kind wijst en benoemt. Het verwerkt door te kijken en te praten. Dat helpt.' : '"Daar drijft een fiets." "Dat is een reddingsboot." "Dat is de buurman zijn auto." De kinderen wijzen en benoemen. Ze verwerken door te kijken en te praten. Dat helpt.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '⏳ Je kind zijn gang laten gaan terwijl jij oplet' : '⏳ De kinderen hun gang laten gaan terwijl jij oplet',
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
  id: 'ov_4b',
  time: '11:00',
  date: 'Dinsdag 11 november 2027',
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
    text: '🆘 Hulp vragen aan voorbijrijdende boot of buren',
    consequence: 'Je roept. Een buurman met een roeiboot vaart voorbij en pikt je op. Je wordt naar hoger gelegen terrein gebracht.',
    stateChange: {
      evacuatedFlood: true,
      calledRescue: true
    }
  }, {
    text: '📱 112 bellen',
    consequence: () => state.phoneBattery > 0 ? 'Je belt 112. "Blijf op uw auto staan, niet lopen." Na 40 minuten komt een reddingsboot. Je bent gered, maar de auto is verloren.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Je wacht en hoopt dat iemand je ziet.',
    stateChange: () => state.phoneBattery > 0 ? {
      evacuatedFlood: true,
      calledRescue: true
    } : {}
  }]
}, {
  id: 'ov_5',
  time: '13:00',
  date: 'Dinsdag 11 november 2027',
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
    radio: 'Radio 1: Het water in het rivierengebied stijgt tot historische niveaus. Reddingsoperaties zijn gaande. Bel 112 als u hulp nodig heeft. Sluit de meterkast AF. Er zijn al meldingen van kortsluitingen.'
  },
  narrative: 'Beneden hoor je het water kabbelen. De onderkant van de trapleuning staat al onder water. Je bent boven en voorlopig veilig, maar het stijgt nog steeds.',
  choices: [{
    conditionalOn: () => !state.cutElectricity,
    text: '⚡ Alsnog de elektriciteit afsluiten bij de meterkast',
    consequence: 'Je wacht op het juiste moment en loopt snel naar de meterkast. Beneden staat het water tot je enkels. Je gooit de hoofdschakelaar om. Zo voorkom je kortsluiting.',
    stateChange: {
      cutElectricity: true
    }
  }, {
    text: '🪟 Vanuit het raam om hulp seinen',
    consequence: 'Je hangt een laken uit het raam. Een reddingsboot ziet je en noteert je locatie. Ze komen later terug.',
    stateChange: {
      calledRescue: true
    }
  }, {
    text: '⏳ Afwachten en batterij sparen',
    consequence: 'Je doet even niets en spaart de batterij. Maar beneden borrelt het water door. Als de meterkast nat wordt, kan het misgaan.',
    stateChange: {}
  }, {
    conditionalOn: () => !state.cutElectricity,
    text: '⚡🪟 Elektriciteit afsluiten en een teken geven',
    consequence: 'Je loopt snel naar beneden, met water tot aan je enkels, en zet de hoofdschakelaar uit. Daarna ga je weer naar boven en hang je een laken uit het raam. Binnen een kwartier ziet een reddingsboot je en noteert je locatie.',
    stateChange: {
      cutElectricity: true,
      calledRescue: true
    }
  }]
}, {
  id: 'ov_5b',
  time: '13:15',
  date: 'Dinsdag 11 november 2027',
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
  date: 'Dinsdag 11 november 2027',
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
    consequence: 'Je neemt je essentiële spullen en stapt in. De boot brengt je naar een opvanglocatie op hogere grond.',
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
  date: 'Dinsdag 11 november 2027',
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
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => profile.childrenCount > 1,
    text: '🏅 De oudste complimenteren voor het helpen van de vrouw',
    consequence: 'Je pakt zijn hand even vast. "Dat was goed van je." Hij zegt niets, maar je ziet dat het aankomt. In het midden van de chaos heeft hij iemand anders gezien.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '🧘 Zelf rustig blijven zodat de kinderen jouw kalmte voelen',
    consequence: () => profile.childrenCount === 1 ? 'Je ademt rustig en houdt je kind vast. Je zegt niet veel, maar je stem blijft kalm. Kinderen letten sterk op hun ouders. Als jij rustig blijft, helpt dat meteen.' : 'Je ademt rustig en houdt de jongste vast. Je zegt niet veel, maar je stem blijft kalm. Kinderen letten sterk op hun ouders. Als jij rustig blijft, helpt dat meteen. De oudste leunt even tegen je aan.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_6c',
  time: '17:00',
  date: 'Dinsdag 11 november 2027',
  dayBadge: 'Dag 1',
  dayBadgeClass: '',
  conditionalOn: () => state.evacuatedFlood === true,
  channels: {
    news: [{
      time: '16:45',
      headline: 'Opvanglocaties overvol, extra locaties geopend',
      body: 'Door het grote aantal geëvacueerden zijn meerdere extra opvanglocaties geopend. De gemeente roept op rustig te blijven en aanwijzingen van vrijwilligers op te volgen.'
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
      'Je bent op eigen kracht aangekomen bij de opvanglocatie.';
    const ansZin = state.takingAns ? ' Ans stapt naast je uit de boot.' : '';
    return aankomst + ansZin + ' Het is er druk. Overal zie je natte mensen en uitgeputte gezichten. Bij de ingang staat een vrijwilliger: "Wilt u zich eerst aanmelden bij de registratiebalie? Dan weten we dat u veilig bent." Je wacht tien minuten in de rij. Je meldt je aan. Nu weet de gemeente waar je bent. Hier is ook stroom, dus je telefoon kan opladen. Wat doe je daarna?';
  },
  choices: [{
    text: '📱 Familie bellen zodat ze weten dat je veilig bent',
    consequence: () => state.phoneBattery > 0 ? 'Je zoekt een hoek met een stopcontact en laadt je telefoon op terwijl je belt. Aan de andere kant hoor je vooral opluchting. Ze wisten niet waar je was.' : 'Je telefoon is leeg. Je vraagt of je iemands telefoon even mag lenen om een bericht te sturen. Een vrouw naast je helpt meteen.',
    stateChange: {
      phoneBattery: 20
    }
  }, {
    text: '🛏️ Een slaapplek regelen voordat alles vol is',
    consequence: 'Je loopt de hal in en vindt een rustig hoekje. Je legt er je jas neer. Later blijkt dat slim, want een uur later zijn alle fatsoenlijke plekken bezet.',
    stateChange: {
      comfort: 1,
      phoneBattery: 20
    }
  }, {
    text: '🍲 Warm eten halen en even bijkomen',
    consequence: 'Je schuift aan bij de rij voor eten. Soep en brood. Je gaat zitten. Het is het eerste moment vandaag dat je stilzit. Dat voelt vreemd en goed tegelijk.',
    stateChange: {
      comfort: 1,
      food: 1
    }
  }]
}, {
  id: 'ov_6f',
  time: '18:30',
  date: 'Dinsdag 11 november 2027',
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
        'Op de opvanglocatie klemt je kind zich aan je vast. Het laat je geen seconde los, zelfs niet als je even naar het toilet wilt. Het weet wel waar het is en dat jij er bent, maar het blijft zich aan je vasthouden.' :
        'Op de opvanglocatie klemt de jongste zich aan je vast, met haar arm om je been en haar hoofd tegen je zij. De oudste blijft rustiger. Jullie hebben eerder over dit soort situaties gepraat, maar voor de jongste is dat nu even weg.';
    } else {
      return een ?
        'Op de opvanglocatie klemt je kind zich aan je vast en wil het je geen seconde kwijt. Als je opstaat, staat het meteen ook op. Als je naar het toilet wilt, trekt het aan je mouw. Je begrijpt het, maar het maakt alles wel zwaarder.' :
        'Op de opvanglocatie klemt de jongste zich aan je vast en wil ze je geen seconde kwijt. Als je opstaat, staat zij ook op. Ondertussen speelt de oudste al met andere kinderen, alsof er niets is gebeurd.';
    }
  },
  choices: [{
    text: () => profile.childrenCount === 1 ? '🫂 Het vastklampen laten gebeuren en samen blijven' : '🫂 De jongste gewoon dicht bij je houden',
    consequence: () => profile.childrenCount === 1 ? 'Je laat het toe. Je kind blijft aan je vast. Een vrijwilliger zegt dat dit vaak vanzelf zakt als een kind weer veiligheid voelt. Dat blijkt ook zo te zijn.' : 'Je laat het toe. De jongste blijft aan je vast. Een vrijwilliger zegt dat dit vaak vanzelf zakt als een kind weer veiligheid voelt. Dat blijkt ook zo te zijn.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '🗣️ Uitleggen dat het hier veilig is en dat je niet weggaat' : '🗣️ Jongste uitleggen dat het hier veilig is en dat je niet weggaat',
    consequence: () => profile.childrenCount === 1 ? '"Ik ga niet weg. We zijn hier samen en het is veilig." Je kind kijkt je aan. Het gelooft het half. Maar de greep wordt iets losser.' : '"Ik ga niet weg. We zijn hier samen en het is veilig." De jongste kijkt je aan. Het gelooft het half. Maar de greep wordt iets losser.',
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => !state.kidsNoodpakket && profile.childrenCount > 1,
    text: '🎮 De oudste laten spelen, dat is zijn manier van verwerken',
    consequence: 'Een vrijwilliger fluistert: "Laat maar. Spelen is hoe kinderen stress verwerken. Het is in orde." Je stopt met tegenhouden. Dat voelt beter.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '🤝 Met andere ouders vergelijken hoe hun kinderen reageren',
    consequence: '"Die van mij laat me geen seconde los," zeg jij. "Die van mij rent al een uur rond," zegt een vader. "Allebei normaal," zegt een vrijwilliger. Dat helpt.',
    stateChange: {
      comfort: 1
    }
  }, {
    conditionalOn: () => state.kidsNoodpakket,
    text: '📋 Samen terugkijken op wat goed ging met het plan',
    consequence: () => profile.childrenCount === 1 ? '"Ik wist wat ik moest doen," zegt je kind. "Waarom wist jij dat?" vraag je. "Omdat we het hadden geoefend." Je voelt iets van trots, gemengd met opluchting.' : '"We wisten wat we moesten doen," zegt de oudste. "Waarom wist jij dat?" vraag je. "Omdat we het hadden geoefend." Je voelt iets van trots, gemengd met opluchting.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_6g',
  time: '18:00',
  date: 'Dinsdag 11 november 2027',
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
    conditionalOn: () => profile.hasGasStove && (state.savedItems || state.food > 2),
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
    conditionalOn: () => !profile.hasGasStove && (state.savedItems || profile.hasKit === 'ja'),
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
  id: 'ov_6b',
  time: '21:00',
  date: 'Dinsdag 11 november 2027',
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
    radio: 'Radio 1: Het water in het rivierengebied stabiliseert. Daling verwacht in de vroege ochtend. Mensen die boven zijn gebleven: blijf kalm, bel 112 alleen bij directe nood. Reddingsdiensten werken de hele nacht door.'
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
  date: 'Dinsdag 11 november 2027',
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
    radio: 'Radio 1: Het waterpeil stabiliseert. Daling verwacht in de vroege ochtend. Geëvacueerden kunnen naar verwachting morgenochtend terug voor een eerste inspectie.'
  },
  narrative: 'Het is avond. In de sporthal is het rustiger geworden en het licht is gedimd. Overal liggen mensen op slaapmatten en opgerolde jassen. Je telefoon laadt op. Buiten regent het nog steeds, maar het ergste lijkt achter de rug.',
  choices: [{
    text: '😴 Proberen te slapen, morgen is er genoeg te doen',
    consequence: 'Je rolt je jas op als kussen en doet je ogen dicht. Het is druk en lawaaierig, maar de vermoeidheid wint het. Je slaapt.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '💬 Met andere geëvacueerden praten',
    consequence: 'Een man naast je vertelt over zijn kelder vol water. Een vrouw heeft haar fotoalbum gered. Je deelt verhalen in het halfduister. Even geen eenzaamheid.',
    stateChange: {
      comfort: 1
    }
  }]
}, {
  id: 'ov_7',
  time: '08:00',
  date: 'Woensdag 12 november 2027',
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
      return 'Dag twee. Je hebt de nacht op de opvang doorgebracht en je telefoon kunnen opladen. Het water zakt zichtbaar. De straten staan niet meer blank. ' + schade + ' Je kunt terug voor een eerste inspectie.';
    } else {
      return 'Dag twee. Je bent de nacht boven gebleven. Het is licht geworden en het water zakt zichtbaar. De straat komt langzaam weer tevoorschijn. Van boven zie je de modderrand op de muren van de benedenverdieping. Voorzichtig loop je de trap af.';
    }
  },
  get choices() {
    if (state.evacuatedFlood) {
      return [{
        text: '🏠 Terug voor inspectie, wat is de schade?',
        consequence: 'Je wacht op een geschikt moment en rijdt terug. De woning staat vol modder tot 80 cm. Meubels verwoest, vloer eruit. Maar de muren staan nog.',
        stateChange: {
          returnedHome: true
        }
      }, {
        text: '⏳ Nog een dag wachten tot het veiliger is',
        consequence: 'Je wacht nog een dag. Als je terugkomt is er meer opgedroogd, maar de schimmelvorming is al begonnen. Achteraf had je eerder moeten gaan ventileren.',
        stateChange: {
          returnedHome: true
        }
      }, {
        text: '🤝 Terugkeer organiseren met buren',
        consequence: 'Je organiseert met een paar buren een gezamenlijke terugkeer. Jullie helpen elkaar met spullen wegdragen en de schade opnemen. Sterk in crisis.',
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
  date: 'Woensdag 12 november 2027',
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
  date: 'Woensdag 12 november 2027',
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
    text: () => profile.childrenCount === 1 ? '🗣️ Uitleggen dat dit nog steeds thuis is en dat het beter wordt' : '🗣️ Uitleggen dat dit nog steeds thuis is en dat het beter wordt',
    consequence: () => profile.childrenCount === 1 ? '"Dit is nog steeds ons huis. Het ziet er nu anders uit, maar we maken het weer goed." Je kind kijkt om zich heen. "Mijn kamer ook?" vraagt het. "Jouw kamer ook," zeg je.' : '"Dit is nog steeds ons huis. Het ziet er nu anders uit, maar we maken het weer goed." De jongste snuft. "Mijn kamer ook?" vraagt ze. "Jouw kamer ook," zeg je. Ze knikt.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: () => profile.childrenCount === 1 ? '📸 Je kind laten meehelpen met fotograferen voor de verzekering' : '📸 De oudste laten meehelpen met fotograferen voor de verzekering',
    consequence: () => profile.childrenCount === 1 ? 'Je geeft je kind de telefoon en vraagt foto\'s te maken van de schade. Het loopt ernstig door de kamers. Even later kom je samen terug met veertig foto\'s. Betrokkenheid helpt bij verwerken.' : 'Je geeft de oudste de telefoon en vraagt foto\'s te maken van de schade. Hij loopt ernstig door de kamers. Even later kom je samen terug met veertig foto\'s. Betrokkenheid helpt bij verwerken.',
    stateChange: {
      savedItems: true
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
  date: 'Woensdag 12 november 2027',
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
  narrative: 'Je staat weer in je woning. Het ruikt naar modder en riool. Alles is nat. Kasten zijn omgevallen en het behang laat los van de muur. Toch staat het huis er nog. Wat doe je als eerste?',
  choices: [{
    text: '⚡ Gas en elektra laten keuren voor je iets aanzet',
    consequence: 'Verstandig. Je belt de netbeheerder. Ze sturen een monteur. Elektra wordt afgekeurd, gas is veilig. Goed dat je niet zomaar hebt aangezet.',
    stateChange: {}
  }, {
    text: '🪟 Ramen open voor ventilatie en drogen',
    consequence: 'Je zet alle ramen en deuren open. Luchtstroom is essentieel om schimmelvorming te voorkomen. De buurman helpt je meubels naar buiten te dragen.',
    stateChange: {
      comfort: 1
    }
  }, {
    text: '📸 Alles fotograferen voor de verzekering',
    consequence: 'Je documenteert alles: waterlijn op de muur, kapotte meubels, elektrische apparatuur. Cruciale stap voor de schadeclaim.',
    stateChange: {
      savedItems: true
    }
  }, {
    text: '⚡📸🪟 Alles aanpakken: keuring regelen, foto\'s maken en ventileren',
    consequence: 'Je werkt de lijst af. Eerst alles fotograferen: waterstand op de muur, omgevallen kasten, kapotte apparaten. Dan de netbeheerder bellen voor keuring. Daarna ramen en deuren open voor luchtcirculatie. De buurman helpt je meubels naar buiten. Je hebt alles gedaan wat je direct kon doen.',
    stateChange: {
      savedItems: true,
      comfort: 1
    }
  }]
}];
