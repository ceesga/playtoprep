// ═══════════════════════════════════════════════════════════════
// Scenario: Stroomstoring — "Een gewone winterdag"
// 26 scenes — van st_pre_d2 (vrijdag avond) tot st_14 (stroom terug)
// Tijdspanne: vrijdag 24 jan → woensdag 3 feb 2027
// ═══════════════════════════════════════════════════════════════


const scenes_stroom = [
  // SCENE 1 — Day -7
  {
    id: 'st_pre_d2',
    time: '12:00',
    date: 'Vrijdag 24 januari 2027',
    dayBadge: '',
    dayBadgeClass: 'blue',
    channels: {
      news: [{
        time: '10:31',
        headline: 'Energie-experts: Europese omvormers zijn kwetsbare schakel in stroomnet',
        body: 'Een internationaal consortium van energie-experts waarschuwt dat verouderde omvormers in het Europese hoogspanningsnet een risico vormen. Een storing bij één centrale kan in theorie een cascade veroorzaken.'
      }, {
        time: '11:02',
        headline: 'Kabinet verhoogt budget voor cyberveiligheid vitale infrastructuur',
        body: 'Het kabinet trekt 340 miljoen extra uit voor de beveiliging van energiecentrales, waterwerken en communicatienetwerken.'
      }],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Het is een gewone vrijdagmiddag. Je hebt lunchpauze. Buiten waait een koude januariewind en op kantoor is het druk. Zelf ben je met heel andere dingen bezig.',
    choices: [{
      text: '💡 Ik lees het artikel over de kwetsbare omvormers door en sla het op',
      consequence: 'Je leest het technische artikel aandachtig door. Experts leggen uit hoe een storing bij één centrale via het gekoppelde Europese net kan doorwerken. Je vergeet het daarna grotendeels, maar iets in je achterhoofd onthoudt het.',
      stateChange: {
        awarenessLevel: 1
      }
    }, {
      text: '📱 Ik scan de koppen maar lees verder niets',
      consequence: 'Je ziet de berichten vluchtig voorbijkomen. Niets bijzonders.',
      stateChange: {}
    }, {
      text: '🙈 Ik scroll verder, dit soort nieuws is er altijd',
      consequence: 'Je scrolt door naar sport en entertainment. Zulke berichten zijn er volgens jou altijd wel.',
      stateChange: {}
    }]
  },
  // SCENE 2 — Day -1
  {
    id: 'st_pre_d1',
    time: '12:00',
    date: 'Zaterdag 30 januari 2027',
    dayBadge: '',
    dayBadgeClass: 'blue',
    channels: {
      news: [{
        time: '11:47',
        headline: 'Sabotage aan stroomkabels op de Noordzeebodem',
        body: 'Onderzoekers van de NCTV hebben sporen gevonden van opzettelijke beschadiging aan twee hoogspanningskabels op de Noordzee. Het is nog onduidelijk wie verantwoordelijk is. De kabels verbinden het Nederlandse net met Noorwegen en het Verenigd Koninkrijk.'
      }, {
        time: '12:00',
        headline: 'Minister: \'Geen acuut gevaar voor stroomvoorziening\'',
        body: 'De minister van Economische Zaken stelt dat de beschadigde kabels niet direct leiden tot problemen met de stroomlevering. Nederland heeft voldoende redundantie in het net.'
      }],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Hé, heb je dat nieuws over die kabels in de Noordzee gelezen? Beetje eng hè',
        time: '12:15',
        outgoing: false
      }],
      nlalert: null,
      radio: null
    },
    narrative: 'Op het werk hangt vandaag een onrustige sfeer. Mensen praten in groepjes en in de lunchruimte staat de tv harder dan normaal. Buiten lijkt alles gewoon, maar de stemming voelt anders.',
    choices: [{
      text: '💵 Ik pin even €100 contant geld, voor de zekerheid',
      consequence: 'Je haalt €100 op uit de automaat. Achteraf blijkt dat een verstandige beslissing, maar dat weet je nu nog niet.',
      stateChange: {
        hasCash: true,
        cash: 100
      }
    }, {
      text: '🔦 Ik pak de zaklamp eruit en check of de batterijen het nog doen',
      consequence: 'Je vindt de zaklamp in de keukenkast. De batterijen zijn bijna leeg. Je vervangt ze door nieuwe en legt de zaklamp klaar.',
      stateChange: {
        hasFlashlight: true
      }
    }, {
      text: '💬 Ik stuur Rob terug: "Ja, beetje raar. Ik hoop dat het niks is"',
      consequence: 'Rob antwoordt: "Ja, vast wel. Okay, ff kijken. Fijne avond!" Je gaat verder met je dag.',
      stateChange: {}
    }, {
      text: '🙈 Ik maak me geen zorgen, de minister heeft het al gezegd',
      consequence: 'Je sluit het nieuwsartikel weer. Vast niet voor niets dat ze zeggen dat er geen direct probleem is.',
      stateChange: {}
    }]
  },
  // SCENE MORN_D0 — Day 0 morning, 08:00 (before outage)
  {
    id: 'st_d0_morgen',
    time: '08:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 0',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#22c55e">18°C</b> &nbsp;|&nbsp; 🌨️ Buiten: <b style="color:#93c5fd">−1°C</b> </div>Zondagochtend. De CV tikt, de koelkast zoemt, de waterkoker fluit. Gewone geluiden. Buiten ligt een dun laagje rijp op de daken. Bewolkt, stil. Je drinkt je koffie bij het raam. Een gewone zondag, zo voelt het tenminste.',
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
    dayBadge: 'Dag 0',
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
      radio: null
    },
    get narrative() {
      const lift = profile.houseType === 'appartement' ? ' De lift doet het niet meer. Je loopt de trap.' : '';
      const mob = profile.hasMobilityImpaired ? ' De trap is zwaar. Zonder lift is elke verdieping een opgave.' : '';
      return 'Midden op de ochtend valt ineens de stroom uit. Alles wordt stil: de koelkast, de verwarming en het wifi-lampje. Alleen je telefoon doet het nog via mobiel bereik. Buiten zie je buren naar buiten komen om te kijken wat er aan de hand is. De stilte voelt vreemd, alsof iemand in één keer al het geluid heeft uitgezet.' + lift + mob;
    },
    choices: [{
      text: '📱 Nieuws checken op mijn telefoon, wat is er aan de hand?',
      consequence: 'Op NOS lees je dat er een storing is door kortsluiting bij een energiecentrale in Dronten. Er staat niet bij hoe lang het gaat duren. Meer kun je nu niet doen dan afwachten.',
      stateChange: {}
    }, {
      text: '🔌 Alle grote apparaten uitschakelen en de zekering uitzetten',
      consequence: 'Je loopt door het huis en zet alles handmatig uit: wasmachine, oven, verwarming. Goed idee, want bij herstel van de stroom kunnen pieken apparaten beschadigen.',
      stateChange: {}
    }, {
      text: '☕ Even koffie zetten op het gasfornuis en rustig afwachten',
      consequence: 'Het gasfornuis werkt gelukkig nog. Je zet koffie en probeert rustig te blijven. Misschien is het zo weer voorbij.',
      stateChange: {}
    }, {
      text: '🤷 Gewoon doorgaan, dit is toch zo opgelost',
      consequence: 'Je wacht. Niets aan de hand. Zulke kleine storingen zijn er wel vaker.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.houseType === 'appartement',
      text: '🏢 Even in de gang kijken, hoe reageren de andere bewoners?',
      consequence: 'Op de gang staan drie buren. Niemand weet wat er aan de hand is. Iemand probeert de deur van de meterkast te openen. Een oudere dame vraagt of jij misschien weet wanneer de lift het weer doet.',
      stateChange: {
        knowsNeighbors: true
      }
    }]
  },
  // SCENE 4 — Stroom terug, info-only
  {
    id: 'st_2',
    time: '11:57',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 0',
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
      radio: null
    },
    narrative: 'De lichten flikkeren en springen weer aan. De koelkast begint te zoemen en de cv komt opnieuw op gang. Buiten hoor je mensen opgelucht lachen. Het lijkt voorbij. Toch heb je het gevoel dat je dit moment beter kunt gebruiken.',
    choices: [{
      text: '📱 Telefoon snel opladen via het stopcontact',
      consequence: 'Je legt meteen je telefoon aan de lader. Tien minuten later, vlak voor de stroom weer uitvalt, heb je er 20% batterij bij.',
      stateChange: {
        phoneBattery: 20
      }
    }, {
      text: '🔋 Snel de powerbank opladen zolang het kan',
      consequence: 'Je hangt de powerbank meteen aan de lader. Na tien minuten zit er 10% extra in. Niet veel, maar straks kun je dat goed gebruiken.',
      stateChange: {}
    }, {
      text: '📺 Kijken wat het nieuws zegt',
      consequence: 'De nieuwszender: "Grote storing in Nederland, inmiddels hersteld." Je leunt achterover. Mooi. Dit was dus niets.',
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
    dayBadge: 'Dag 0',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '12:28',
        headline: 'Opnieuw grote stroomstoring, nu heel Europa getroffen',
        body: 'Door een brand bij de energiecentrale Jänschwalde in Duitsland is opnieuw een cascadesstoring opgetreden in het Europese hoogspanningsnet. Ook het hoogspanningsstation in Dronten staat nog in brand.'
      }],
      whatsapp: [{
        from: 'Mama',
        msg: 'Lieverd, is alles goed bij jullie? Bij ons ook geen stroom. Ik probeer jullie al een tijdje te bellen maar kom er niet door',
        time: '12:35',
        outgoing: false
      }, {
        from: 'Buurman Rob',
        msg: 'Hé, is bij jou ook alles uitgevallen? Dit voelt wel serieuzer dan net.',
        time: '12:38',
        outgoing: false
      }],
      nlalert: 'NL-Alert\n31 januari 2027 – 12:32\n\nDoor een kortsluiting bij de energiecentrale in Jänschwalde (Duitsland) zijn er grote stroomstoringen door heel Europa. De stroomstoring kan enkele uren duren. Update volgt.',
      radio: 'Hier Omrop Fryslân, 92.2 en 92.5 MHz. We onderbreken onze uitzending voor een urgent noodbericht. Er is een grootschalige stroomstoring in heel Europa. Oorzaak: brand bij een energiecentrale in Duitsland, gevolgd door een kettingreactie in het Europese hoogspanningsnet. De overheid vraagt iedereen thuis te blijven, warm te blijven en voldoende drinkwater achter de hand te houden. Houd uw autoradio of batterijradio aan voor verdere updates. We houden u op de hoogte.'
    },
    get narrative() {
      return 'De stroom valt opnieuw uit, dit keer harder dan net. Alles valt weer stil, maar nu voelt het ernstiger dan de eerste keer. Je telefoon trilt. Buiten komen mensen hun huis uit. Ze kijken om zich heen en zeggen bijna niets. Je accu staat op ' + state.phoneBattery + '%.';
    },
    choices: [{
      text: '🍶 Lege flessen vullen met water, voor noodgebruik',
      consequence: 'Je pakt alle lege flessen, pannen en emmers die je kunt vinden en vult ze met kraanwater. Goed instinct: als de waterpomp uitvalt, heb je dit water nog voor drinken, koken en de wc.',
      stateChange: {
        hasWater: true,
        water: 2
      }
    }, {
      conditionalOn: () => profile.hasRadio === 'ja',
      text: '📻 Batterijradio aanzetten voor nieuws',
      consequence: 'Je zet de radio aan. Omrop Fryslân (92.2 / 92.5 MHz) zendt nog uit en vertelt dat de storing groot is en lang kan duren. Vanaf nu is de radio je belangrijkste bron van informatie.',
      stateChange: {
        hasCarRadio: true
      }
    }, {
      conditionalOn: () => profile.hasRadio !== 'ja' && profile.hasCar,
      text: '🚗 Naar de auto en de autoradio aanzetten',
      consequence: 'Je loopt naar de auto en zet de radio aan. Omrop Fryslân (92.2 / 92.5 MHz) is nog in de lucht en vertelt dat de storing groot is en lang kan duren. De autoradio wordt nu je belangrijkste bron van informatie.',
      stateChange: {
        hasCarRadio: true
      }
    }, {
      text: '📞 Proberen mama terug te bellen',
      consequence: () => state.phoneBattery > 0 ? "Je probeert te bellen, maar het netwerk is overbelast. Eerst hoor je een toon, daarna niets meer. Je stuurt een sms: \"Alles goed hier. Wacht even af.\" Of die aankomt weet je niet." : 'Je telefoon is leeg. Je kunt niemand bereiken.',
      stateChange: {}
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
    dayBadge: 'Dag 0',
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
          body: 'Veel winkels sluiten vanwege de stroomstoring. Supermarkten zijn voorlopig open maar accepteren alleen contant geld. Bij pinautomaten staan lange rijen.'
        }],
        whatsapp: [{
          from: 'Buurman Rob',
          msg: supermarktMsg,
          time: '13:28',
          outgoing: false
        }, {
          from: 'Collega Sanne',
          msg: 'Heeft iemand nog bereik? Wij zitten vast op kantoor. De liften doen het niet.',
          time: '13:22',
          outgoing: false
        }],
        nlalert: null,
        radio: null
      };
    },
    get narrative() {
      if (profile.location.includes('city')) {
        return 'Je telefoon heeft nauwelijks bereik meer. Je hoort constant politiesirenes in de verte. Op straat zijn mensen nerveus. Kleine groepjes staan bij elkaar te praten. De supermarkt om de hoek is nog open, maar je ziet de rij al van ver. Het begint merkbaar kouder te worden in huis: de thermostaat staat op 19°C, maar de CV werkt niet.';
      } else {
        return 'Je telefoon heeft nauwelijks bereik meer. Je hoort constant politiesirenes in de verte. Op straat zijn mensen nerveus. Kleine groepjes staan bij elkaar te praten. Je overweegt naar de supermarkt te gaan, maar die zit een eind weg. En je weet niet of ze nog open zijn. Het begint merkbaar kouder te worden in huis: de thermostaat staat op 19°C, maar de CV werkt niet.';
      }
    },
    choices: [{
      text: '🛒 Nu naar de supermarkt gaan, voor het te laat is',
      consequence: 'Je pakt je jas en gaat. De rij is lang maar beweegt. Na 25 minuten ben je binnen. Pas daar merk je dat je alleen met contant geld kunt betalen.',
      stateChange: {
        wentToSupermarket: 'early'
      }
    }, {
      text: '🏠 Thuis blijven en inventariseren wat we al hebben',
      consequence: 'Je maakt een overzicht: wat ligt er in de vriezer, de kelder, de kast? Je weet nu wat je hebt.',
      stateChange: {}
    }, {
      text: '🚗 Met de auto naar een tankstation voor benzine',
      consequence: 'Bij het tankstation staat een rij van 40 auto\'s. Na een uur wachten krijg je te horen: "Alleen voor hulpdiensten." Teleurgesteld rij je terug. Je hebt gezien hoe gespannen de sfeer buiten is.',
      stateChange: {}
    }, {
      text: '👴 Even bij de buren langs of alles goed is',
      consequence: 'Buurvrouw Annie (78) staat verward in de deuropening. Je legt het kort uit en vraagt of ze nog eten heeft. "Ja hoor, ik red me wel", zegt ze. Maar ze ziet er bleek uit.',
      stateChange: {
        knowsNeighbors: true
      }
    }]
  },
  // SCENE 6B — At the supermarket (conditional)
  {
    id: 'st_4b',
    time: '14:00',
    date: 'Zondag 31 januari 2027',
    dayBadge: 'Dag 0',
    dayBadgeClass: '',
    conditionalOn: () => state.wentToSupermarket === 'early',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Je staat in de rij bij de supermarkt. Er staan minstens 60 mensen voor je. Iedereen praat zachtjes of staart naar hun telefoon. Een vrouw vooraan begint hard te schreeuwen dat ze voordringt omdat ze kleine kinderen heeft. Er ontstaat een discussie. Een beveiliger doet zijn best maar is duidelijk nerveus. Als je eindelijk binnen bent: de schappen zijn al behoorlijk uitgedund. Drinkwater is uitverkocht. Hetzelfde geldt voor wc-papier, olie, benzine en lucifers. Honing en blikopeners zijn ook al weg.',
    choices: [{
      text: '🥫 Zoveel mogelijk blikvoer, rijst en pasta inslaan',
      consequence: 'Je vult een grote tas: blikken soep, bonen, tomaten, rijst, pasta, crackers. Aan de kassa: "Alleen contant." Je betaalt €50.',
      stateChange: {
        supermarketItems: ['blikvoer', 'rijst', 'pasta', 'crackers'],
        food: 2,
        cash: -50
      }
    }, {
      text: '🕯️ Kaarsen, aansteker, batterijen, praktische spullen',
      consequence: 'Je vindt nog twee pakken kaarsen, een aansteker en het laatste pakje AA-batterijen. Aan de kassa hoor je: "Alleen contant." Je betaalt €25.',
      stateChange: {
        hasFlashlight: true,
        supermarketItems: ['kaarsen', 'batterijen', 'aansteker'],
        cash: -25
      }
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
    dayBadge: 'Dag 0',
    dayBadgeClass: '',
    channels: {
      news: [{
        time: '13:55',
        headline: 'Stroomstoring kan tot morgen duren, overheid roept op tot kalmte',
        body: 'Door een kortsluiting en brand bij energiecentrale Jänschwalde is een cascade van storingen opgetreden bij vrijwel alle Europese centrales. Een expert legt uit dat het Europese energienetwerk uit efficiëntieoverwegingen sterk aan elkaar gekoppeld is. "Het was een kwestie van tijd dat dit zou gebeuren." De overheid geeft aan niet te weten hoe lang de uitval duurt en vraagt rekening te houden met een of meerdere dagen.'
      }, {
        time: '14:00',
        headline: 'Stuwen en gemalen vallen uit, overstromingsrisico in laaggelegen gebieden',
        body: 'Rijkswaterstaat waarschuwt dat waterkerende systemen die op elektriciteit draaien zijn uitgevallen. In laaggelegen gebieden kan dit leiden tot wateroverlast.'
      }],
      whatsapp: [],
      nlalert: 'NL-Alert\n31 januari 2027 – 13:28\n\nDoor een kortsluiting bij de energiecentrale in Jänschwalde (Duitsland) zijn er grote stroomstoringen door heel Europa. De stroomstoring kan tot morgen duren.\n\nBlijf thuis. Blijf warm. Zorg voor voldoende water en voedsel. Denk aan uw (oudere) buren.',
      radio: null
    },
    get narrative() {
      const supermarkt = profile.location.includes('city') ?
        'De supermarkt om de hoek is nog open maar je ziet de rij al van ver.' :
        'Je overweegt naar de supermarkt te gaan, maar die zit een eind weg. En je weet niet of ze nog open zijn.';
      return 'Het begint door te dringen: dit is geen storing van een uur. ' + supermarkt + ' Buiten hoor je meer sirenes. Je ziet een auto voorbijrijden die heel langzaam rijdt, alsof de bestuurder ook niet weet wat te doen.';
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
      text: '🌡️ Alle kamers afsluiten behalve de woonkamer, warmte bewaren',
      consequence: 'Je sluit alle deuren. Eén kamer warm houden kost veel minder energie dan het hele huis. Je trekt een extra trui aan.',
      stateChange: {}
    }, {
      text: '👴 Bij buurvrouw Annie aanbellen en vragen of ze het redt',
      consequence: 'Je loopt naar buurvrouw Annie. Ze staat al bij de deur en ziet er onrustig uit. "Ik probeer mijn dochter te bellen, maar ik krijg haar niet te pakken", zegt ze. Je helpt haar een sms te sturen. Dat stelt haar zichtbaar gerust.',
      stateChange: {}
    }, {
      conditionalOn: () => profile.hasCar,
      text: '🔋 Telefoon en apparaten opladen via de auto',
      consequence: 'Je loopt naar de auto, start hem op en sluit de telefoon aan via USB. Na een halfuur: +40%. De auto als noodgenerator.',
      stateChange: {
        phoneBattery: 40
      }
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
    dayBadge: 'Dag 0',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">13°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−2°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~6 uur zonder stroom</div>Het is al donker buiten, vroeg in februari. In huis is het merkbaar kouder geworden. De koelkast staat stil, de vriezer begint langzaam te ontdooien. Je maag rammelt. De supermarkten zijn al dicht. Hoe kook je vanavond?',
    choices: [{
      text: '🍲 Koken op het gasfornuis',
      consequence: 'Het gasfornuis werkt nog. Je steekt het handmatig aan met een aansteker. Het aardgasnet werkt nog omdat de druk in de leidingen mechanisch wordt geregeld. Je kookt rijst of soep uit blik. Warm eten doet het moreel goed én helpt je lichaam warm te blijven.',
      stateChange: {
        comfort: 1
      }
    }, {
      text: '⚡ Proberen op de inductieplaat of elektrisch fornuis',
      consequence: 'De inductieplaat reageert niet. Inductie werkt op elektriciteit. Geen stroom betekent dus geen koken. Hetzelfde geldt voor een elektrisch fornuis. Je hebt een alternatief nodig: gas, een campingkooktoestel of een koude maaltijd.',
      stateChange: {}
    }, {
      text: '🏕️ Campingkooktoestel of barbecue gebruiken',
      consequence: 'Je haalt het campingkooktoestel tevoorschijn. Belangrijk: gebruik het buiten of met veel ventilatie, want koolmonoxide is dodelijk in een besloten ruimte. Je kookt een warme maaltijd.',
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
    dayBadge: 'Dag 0',
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
      radio: null
    },
    get narrative() {
      return '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">12°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−3°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; 🌙 Nacht valt in</div>Je hebt gegeten. Nu begint de lange avond. Buiten is het pikzwart. Geen lantaarnpalen, geen lichtjes bij de buren. Alleen hier en daar het flakkerende schijnsel van een kaars achter een raam. Het huis koelt langzaam maar zeker af. Je telefoon staat op ' + state.phoneBattery + '%.';
    },
    choices: [{
      text: '🕯️ Kaarsen aansteken, slaapzakken halen en in de woonkamer bij elkaar blijven',
      consequence: 'Je zet kaarsen in glazen voor stabiliteit en sleept slaapzakken, dekens en kussens naar de woonkamer. Eén kamer verlichten en verwarmen met lichaamswarmte is veel efficiënter dan het hele huis. Het flakkerende licht maakt het minder zwaar.',
      stateChange: {}
    }, {
      text: '🔦 Zaklamp pakken en de rest van de avond op batterijen doorbrengen',
      consequence: 'Je haalt de zaklamp tevoorschijn en zet hem als sfeerverlichting op tafel. Handig en functioneel, zonder brandgevaar of kaarsenrook.',
      stateChange: {
        hasFlashlight: true
      }
    }, {
      text: '📵 Telefoon op vliegtuigmodus, accu zo lang mogelijk sparen',
      consequence: 'Je zet de telefoon op vliegtuigmodus. Geen berichten meer, maar ook nauwelijks accuverlies. Morgen heb je hem harder nodig dan vanavond.',
      stateChange: {
        airplaneMode: true
      }
    }, {
      text: '😴 Vroeg naar bed, spaar je energie',
      consequence: 'Je kruipt vroeg in bed met zo veel mogelijk lagen kleding aan. Slim: lichaamswarmte in een slaapzak houdt je warm. Je slaapt onrustig, maar wel.',
      stateChange: {}
    }]
  },
  // SCENE 9 — Night robbery
  {
    id: 'st_7',
    time: '02:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const view = profile.houseType === 'appartement' ?
        'naar de gevel van het tegenoverliggende gebouw kijkt' :
        'naar de tuin van de overburen kijkt';
      const mob = profile.hasMobilityImpaired ? ' De trap is zwaar. Zonder lift is elke verdieping een opgave.' : '';
      return 'Je wordt wakker van een geluid. Glas dat breekt. Als je voorzichtig naar het raam van de slaapkamer sluipt en ' + view + ', zie je twee mensen via het achterraam naar binnen gaan. Even later hoor je ze er vandoor rennen, met een tas in hun handen. Het is donker op straat. IJskoud. Je hart bonkt.' + mob;
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
      text: '👊 Naar buiten gaan om te confronteren',
      consequence: 'Je doet de voordeur open. De straat is verlaten. De inbrekers zijn allang weg. Je staat in de vrieskou in je pyjamabroek. Je gaat snel weer naar binnen.',
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
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurvrouw Annie',
        msg: 'Help. Mijn man is bewusteloos geslagen. Ze hebben al ons eten gestolen. Mijn telefoon werkt bijna niet meer. Kunnen jullie komen?',
        time: '05:28',
        outgoing: false
      }],
      nlalert: null,
      radio: 'Je zoekt een tijdje door de frequenties. De meeste zenders zijn stil. Dan vind je een lokale zender: "Door een kortsluiting bij energiecentrales in heel Europa is er vrijwel nergens stroom. We weten niet hoe lang we nog kunnen uitzenden. Schakel over naar AM radio."\n\nOp de AM frequentie hoor je een rustiger stem: "Het herstellen van de stroomstoring blijkt ingewikkelder dan gedacht. Er zijn aanwijzingen dat de sabotage mogelijk opzettelijk was. We roepen iedereen op tot kalmte en vragen mensen hun buren te helpen."'
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
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    conditionalOn: () => state.contactedAnnie === true,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Je staat voor de deur van Annie. Ze doet open, haar ogen zijn rood van het huilen. Achter haar zie je haar man Jan op de bank liggen. Je moet snel beslissen hoe je het best kunt helpen.',
    choices: [{
      text: '🩺 Direct naar Jan kijken en zijn toestand beoordelen',
      consequence: 'Je loopt naar binnen. Jan (81) ligt op de bank. Hij reageert wel, maar is verward en heeft een grote wond op zijn hoofd. Je controleert zijn ademhaling; die is stabiel. Je reinigt de wond zo goed als je kunt en zorgt dat hij warm blijft.',
      stateChange: {
        helpedNeighbor: true
      }
    }, {
      text: '📱 Eerst 112 bellen voordat je naar binnen gaat',
      consequence: () => state.phoneBattery > 0 ? 'Je belt 112 op de stoep. Na lange wachttijd krijg je iemand. Ze registreren het maar kunnen niet inschatten wanneer er iemand komt. "Houd hem warm en stil." Je gaat dan naar binnen om te helpen.' : 'Je telefoon is leeg. Je kunt 112 niet bereiken. Je gaat direct naar binnen om te helpen.',
      stateChange: () => state.phoneBattery > 0 ? {
        helpedNeighbor: true
      } : {}
    }, {
      text: '🍞 Snel terug naar huis, eten halen, dan terugkomen',
      consequence: 'Je zegt Annie dat je zo terug bent. Thuis pak je crackers en een blik soep uit je eigen voorraad. Als je terugkomt zijn Annie\'s ogen rood van het huilen. Je geeft haar het eten en kijkt dan naar haar man.',
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
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const statusBar = '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">5°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−3°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~20 uur zonder stroom</div>';
      const mood = state.comfort >= 4 ?
        'Je hebt een paar uur geslapen en voelt je redelijk.' :
        state.comfort >= 2 ?
        'Je hebt slecht geslapen. Alles voelt zwaarder dan normaal.' :
        'Je bent uitgeput. De spanning van gisterennacht, de kou en alle geluiden buiten beginnen echt door te wegen.';
      const mob = profile.hasMobilityImpaired ? ' De trap valt zwaar; zonder lift is elke verdieping een opgave.' : '';
      return statusBar + mood + ' Een bleke streep licht achter de gordijnen. Je adem vormt kleine wolkjes. Buiten ligt rijp op de daken en ijs op de auto\'s. De stilte voelt onwerkelijk.' + mob;
    },
    choices: [{
      text: '🔭 Door het raam kijken, wat zie je buiten?',
      consequence: () => {
        const buren = profile.houseType === 'appartement' ? 'Twee buren staan op de stoep voor het gebouw te praten' : 'Twee buren staan bij het tuinhek te praten';
        return 'Een man loopt langzaam met een hond. ' + buren + ' en wijzen af en toe naar de straat. Op de hoek staat iemand lang naar zijn telefoon te staren. Er rijdt bijna niets. De stilte voelt onwerkelijk.';
      },
      stateChange: {}
    }, {
      text: '📻 De radio aanzetten voor nieuws',
      consequence: 'Op de AM-frequentie hoor je een rustige stem: "De stroomstoring duurt voort. In meerdere steden is geplunderd. De politie vraagt iedereen binnen te blijven. Herstel wordt niet voor morgennacht verwacht." Morgennacht dus.',
      stateChange: {}
    }]
  },
  // SCENE 11 — Sewage fails
  {
    id: 'st_9',
    time: '08:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const mob = profile.hasMobilityImpaired ? ' De trap is zwaar. Zonder lift is elke verdieping een opgave.' : '';
      return 'Als je de wc gebruikt en doortrekt, merk je dat het water nauwelijks wegstroomt. Even later borrelt de afvoer van de wasbak en stinkt het naar riool. De waterdruk van de kraan is ook sterk verminderd. In deze wijk zit een rioolgemaal dat het afvalwater wegpompt. Zonder stroom werkt dat niet meer goed.' + mob;
    },
    choices: [{
      text: '🚫 Waterafvoer afsluiten en zo min mogelijk water gebruiken',
      consequence: 'Je stopt de afvoeropeningen af met doppen of plastiek. Zo voorkom je dat rioolwater terugstroomt in huis. Goed instinct.',
      stateChange: {
        handledSewage: true
      }
    }, {
      conditionalOn: () => profile.houseType !== 'appartement',
      text: '🌳 Naar de achtertuin gaan (schep en vuilniszak)',
      consequence: 'Buiten, in de hoek van de tuin. Je graaft een klein gat, doet wat je moet doen en gooit er aarde over. Primitief. Effectief. Minder erg dan je dacht.',
      stateChange: {
        comfort: -1
      }
    }, {
      conditionalOn: () => profile.houseType === 'appartement',
      text: '🪣 Emmer en vuilniszakken klaarleggen, er is geen tuin',
      consequence: 'Je zoekt een grote emmer op en legt vuilniszakken klaar. Niet ideaal, maar wel werkbaar. Zo heb je tenminste een plan voor de komende dagen.',
      stateChange: {
        comfort: -1
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
  // SCENE WATERTRUCK — Conditional: water or food at 0, Day 1 10:30
  {
    id: 'st_watertruck',
    time: '10:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 1',
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
      radio: null
    },
    get narrative() {
      const afstand = profile.location.includes('city') ?
        'De wateruitdeling is op vijf minuten lopen.' :
        'De wateruitdeling is in het dorp, een kwartier fietsen.';
      return 'Je huis heeft bijna niets meer. Je pakt je jas en stapt naar buiten. Bij de supermarkt wacht een onverwacht tafereel: een grote blauwe watertruck van de gemeente, omringd door tientallen mensen met jerrycans en flessen. Er is een ordelijke rij. Medewerkers met hesjes verdelen water, maximaal tien liter per persoon. Er staat ook een kleine tafel met bakken droog voedsel, zoals noodbiscuits en gedroogde soep. ' + afstand;
    },
    choices: [{
      text: '💧 In de rij gaan voor water',
      consequence: 'Je staat 25 minuten in de rij. Als je aan de beurt bent, vul je twee grote flessen. De medewerker stempelt je hand. Eén keer per persoon.',
      stateChange: {
        water: 2,
        hasWater: true
      }
    }, {
      conditionalOn: () => !profile.location.includes('city') && profile.hasBike,
      text: '🚲 Met de fiets naar de wateruitdeling',
      consequence: 'Je pakt de fiets en rijdt naar het dorp. Een kwartier fietsen, maar de rij is korter dan je had verwacht. Met twee volle jerrycans op de bagagedrager rij je terug.',
      stateChange: {
        water: 2,
        hasWater: true
      }
    }, {
      text: '🤝 Water halen én een extra fles meebrengen voor Annie',
      consequence: 'Je vertelt dat je ook voor een oudere buurvrouw haalt. De medewerker knikt en geeft je een extra fles. "Eén extra, meer mag niet." Bij Annie thuis is ze sprakeloos van dankbaarheid.',
      stateChange: {
        water: 1,
        hasWater: true,
        helpedNeighbor: true
      }
    }, {
      text: '🍞 Vragen of er ook eten is bij de tafel',
      consequence: 'Je loopt naar de tafel met noodbiscuits. Er zijn kleine pakketjes. Je neemt er één mee. Bescheiden, maar het scheelt. Water moet je elders vandaan halen.',
      stateChange: {
        food: 1
      }
    }, {
      text: '🏠 Terugkeren zonder te wachten, de rij is te lang',
      consequence: 'Je kijkt naar de rij en schat: nog een uur. Je draait om. Misschien later. Misschien morgen.',
      stateChange: {}
    }]
  },
  // SCENE 12 — Curfew + chaos
  {
    id: 'st_10',
    time: '14:30',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [{
        from: 'Buurman Rob',
        msg: 'Heb je de radio gehoord? Avondklok. Shit man. Ik heb nog genoeg eten gelukkig. Hoe zitten jullie ervoor?',
        time: '14:22',
        outgoing: false
      }],
      nlalert: null,
      radio: '"Vanaf heden is er een avondklok van kracht. Niemand mag na het donker buiten zijn. In meerdere steden hebben plunderingen plaatsgevonden. De politie heeft zijn handen vol. Het is nog steeds niet duidelijk wanneer de stroom hersteld is. Blijf thuis, blijf warm, help uw buren."'
    },
    narrative: 'De dag vordert en het wordt steeds duidelijker dat dit niet morgen opgelost is. Buiten rijden af en toe politiewagens langs, langzamer dan normaal. Op straat zie je bijna niemand meer. Het is 9°C in huis. Dan een klopje op de deur. Rob, je buurman. Hij houdt een lege fles vast en kijkt je aan. "Heb jij nog wat water over?"',
    choices: [{
      text: '🏘️ De buren bij elkaar roepen, samen sta je sterker',
      consequence: 'Je klopt bij Rob, Annie en nog twee buren aan. Jullie spreken af om eten te delen, elkaar op de hoogte te houden en om beurten een oogje in het zeil te houden. Dat voelt een stuk beter dan ieder voor zich.',
      stateChange: {}
    }, {
      text: '📦 Alle voedsel en water inventariseren en rantsoeneren',
      consequence: 'Je legt alles wat je hebt op de keukentafel. Daarna verdeel je het zo eerlijk en realistisch mogelijk over de komende dagen.',
      stateChange: {}
    }, {
      text: '🚗 Je besluit de auto te pakken en de stad te gaan verkennen',
      consequence: "Je rijdt voorzichtig de straat uit. Bij het centrum zie je politiewagens en mensen die snel lopen. Bij een supermarkt zijn de ramen ingeslagen. Je draait snel terug. Je had het kunnen weten.",
      stateChange: {}
    }, {
      text: '🎲 Een bordspel pakken met het huishouden',
      consequence: 'Je haalt een spel tevoorschijn en gaat met kaarslicht aan tafel zitten. Schaak, mens-erger-je-niet of kaarten, het maakt even niet uit. Een uur lang raakt de crisis wat meer naar de achtergrond en ontspant iedereen zichtbaar.',
      stateChange: {
        comfort: 1
      }
    }, {
      text: '🤝 Water delen met buurman Rob',
      consequence: 'Je loopt naar de deur. Rob staat buiten met een lege fles. Zijn gezicht zegt genoeg. Je kijkt naar je eigen voorraad, die ook niet eindeloos is. Toch geef je hem een fles. Dat voelt tegelijk goed en ongemakkelijk, want iedere liter telt.',
      stateChange: {
        water: -1,
        knowsNeighbors: true
      }
    }]
  },
  // SCENE COOK_D1 — Day 1 evening cooking, 18:00
  {
    id: 'st_d1_avond',
    time: '18:00',
    date: 'Maandag 1 februari 2027',
    dayBadge: 'Dag 1',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const foodNote = (state.supermarketItems.length > 0 || state.hasExtraFood) ?
        'Je hebt genoeg te eten.' :
        'Je voorraad begint krap te worden.';
      return '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">7°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−4°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~30 uur zonder stroom</div>De tweede avond zonder stroom. ' + foodNote + ' In de woonkamer staat het kwik op 7°C. Magen rammelen. Er is een avondklok. Hoe kook je vanavond?';
    },
    choices: [{
      text: '🍲 Koken op het gasfornuis',
      consequence: 'Het gasfornuis werkt nog. Je steekt het handmatig aan met een aansteker. Het aardgasnet werkt nog omdat de druk in de leidingen mechanisch wordt geregeld. Soep of rijst met groenten uit blik. Warm eten bij 7°C in huis doet meer dan je denkt.',
      stateChange: {
        comfort: 1
      }
    }, {
      text: '⚡ Proberen op de inductieplaat of elektrisch fornuis',
      consequence: 'Geen stroom, geen inductie. De plaat reageert niet. Je hebt een alternatief nodig: gas, campingkooktoestel, of koude maaltijd.',
      stateChange: {}
    }, {
      text: '🏕️ Campingkooktoestel of barbecue gebruiken',
      consequence: 'Je zet het campingkooktoestel bij een open raam, maar niet volledig binnen. Koolmonoxide blijft gevaarlijk. Het werkt gelukkig wel, en je maakt een warme maaltijd.',
      stateChange: {
        comfort: 1,
        hasCampingStove: true
      }
    }, {
      text: '🥫 Koude maaltijd uit blik met crackers',
      consequence: 'Je eet koud. Het vult wel, maar bij 7°C voelt koud eten extra guur. Je lichaam kan die warmte juist goed gebruiken.',
      stateChange: {}
    }, {
      text: '🥄 Zuinig koken, kleine portie en voorraad sparen',
      consequence: 'Je maakt een halve portie, net genoeg om de ergste honger weg te nemen. De rest bewaar je. Dat is slim in een situatie die nog dagen kan duren, al knort je buik daarna nog steeds.',
      stateChange: {
        food: 1,
        comfort: -1
      }
    }]
  },
  // SCENE 13 — Explosion
  {
    id: 'st_11',
    time: '01:30',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Eerst hoor je geschreeuw in de verte. Dan volgt een doffe knal. De ramen trillen. Je hart staat even stil. Voorzichtig sluip je naar het raam. Buiten zie je een grote brand. Mensen staan eromheen. In het schaarse licht herken je een auto, die van de overburen. Sirenes hoor je niet.',
    choices: [{
      text: '🏠 Binnenblijven, het is gevaarlijk en de avondklok geldt',
      consequence: 'Je blijft binnen. Dat is verstandig. De avondklok is precies voor dit soort situaties ingesteld. Je kijkt door het raam, maar gaat niet naar buiten.',
      stateChange: {}
    }, {
      text: '👥 Controleren of de overburen veilig zijn via de achterdeur',
      consequence: 'Je sluipt via de achterdeur naar de overburen. Ze staan buiten te kijken, geschrokken maar ongedeerd. "Gelukkig stond hij op straat", fluistert de man. Je gaat snel weer naar binnen.',
      stateChange: {}
    }, {
      text: '🔥 Naar buiten om te helpen blussen',
      consequence: 'Je loopt naar buiten. De brand is hevig en je hebt geen brandblusser. Er is niets wat je kunt doen. Je staat nutteloos te kijken in de vrieskou en staat buiten tijdens de avondklok.',
      stateChange: {}
    }]
  },
  // SCENE MORN_D2 — Day 2 morning, 08:00
  {
    id: 'st_d2_morgen',
    time: '08:00',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 2',
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
        radio: null
      };
    },
    get narrative() {
      const statusBar = '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">5°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−4°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~44 uur zonder stroom</div>';
      const mood = state.comfort >= 4 ?
        'Je hebt geslapen. Niet goed, maar genoeg.' :
        state.comfort >= 2 ?
        'Je hebt slecht geslapen. Je ogen branden, je lichaam is stijf van de kou.' :
        'Je bent op. Twee nachten van stress en kou hakken erin. Voor je opstaat trek je de dekens nog even over je hoofd.';
      return statusBar + mood + ' Op straat staat de uitgebrande auto van de overburen nog steeds. Zwartgeblakerd, met gebarsten ruiten. Niemand haalt hem weg. Er is geen normale hulpverlening meer op gang. Dit is dag twee.';
    },
    choices: [{
      text: '👁️ De straat bekijken door het raam',
      consequence: 'Een paar mensen lopen snel langs. Niemand praat. Iedereen houdt het hoofd gebogen. Op de hoek staat een man lang stil. Hij kijkt omhoog naar de lucht alsof hij ergens op wacht.',
      stateChange: {}
    }, {
      text: '📻 De radio aanzetten voor nieuws',
      consequence: 'Op de AM-frequentie: "Delen van Duitsland en Oostenrijk hebben stroom gekregen. Herstel in Nederland wordt verwacht binnen 24 uur." 24 uur. Dat is lang. Maar het is iets.',
      stateChange: {}
    }, {
      text: '🤝 Naar Rob of Annie gaan voor informatie',
      consequence: '"Ik heb gehoord dat er vandaag een voedseluitdeling is," zegt Rob. "Ergens bij de wijk. Weet niet precies waar." Je maakt een mentale notitie.',
      stateChange: {}
    }, {
      text: '😔 Binnenblijven en wachten',
      consequence: 'Je trekt de gordijnen dicht. Binnenblijven is de veiligste optie. Je hebt nog wat eten. Je wacht.',
      stateChange: {}
    }]
  },
  // SCENE 14 — Day 2, morning + flyer + food distribution
  {
    id: 'st_12',
    time: '11:30',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 2',
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
      radio: '"In meerdere delen van Europa is de stroom kort hersteld door het net fysiek los te koppelen. Ook in sommige delen van Nederland is gisteravond kort stroom geweest. De minister-president heeft het land toegesproken en vraagt iedereen de rust te bewaren. Het draaiend houden van de drinkwatervoorziening heeft de hoogste prioriteit. In meerdere steden zijn gisteravond onrusten geweest. Daarbij zijn doden gevallen bij politie-ingrepen."'
    },
    get narrative() {
      const foodSituation = (state.wentToSupermarket && state.supermarketItems.length > 0) ?
        'Je hebt genoeg eten dankzij je supermarktbezoek.' :
        (state.hasExtraFood ?
          'Je hebt gelukkig wat extra voedsel in huis dat je eerder ingeslagen hebt.' :
          'Je voedselvoorraad is bijna op.');
      return `De rioollucht is nu echt niet meer te harden. Uit het afvoerputje in de bijkeuken borrelt vuil water omhoog. ${foodSituation} Dan gaat de bel. Een man loopt door de straat en stopt bij elk huis om gemeenteflyers uit te delen. Op de flyer staat <b>hoe je warm blijft, een waarschuwing voor koolmonoxide, het advies om flessen en pannen met kraanwater te vullen, en de mededeling dat er morgen van 10 tot 15 uur voedsel wordt uitgedeeld bij de supermarkt. Ook staat er dat het dorpssteunpunt open is voor informatie, warmte en hulp.</b>`;
    },
    choices: [{
      text: '📋 De flyer zorgvuldig lezen en de tips opvolgen',
      consequence: 'Je leest alle tips. Eén springt eruit: sluit alle waterafvoeren af om rioolwater te weren. Je doet dat alsnog.',
      stateChange: {
        handledSewage: true
      }
    }, {
      text: '🤝 De flyer ook bij buren brengen die hem misschien niet hebben',
      consequence: 'Je loopt de straat in en stopt de flyer bij drie huizen in de bus waarvan je weet dat er ouderen wonen. Buurvrouw Annie geef je hem persoonlijk. Meteen vertel je haar ook over de voedseluitdeling.',
      stateChange: {}
    }, {
      text: '🏘️ Naar het dorpssteunpunt gaan voor informatie en warmte',
      consequence: 'Je loopt naar het dorpssteunpunt in het dorp. Er zitten al een stuk of tien buurtbewoners. Een vrijwilliger deelt warme thee uit en heeft een batterijradio aan staan. Op een whiteboard staat de laatste informatie van de gemeente: waterpunten, wanneer stroom verwacht wordt, wie hulp nodig heeft. Je bent blij dat je gegaan bent.',
      stateChange: {
        comfort: 1,
        knowsNeighbors: true
      }
    }, {
      text: '📄 De flyer weggooien, ik weet het al wel',
      consequence: 'Je legt de flyer opzij. Misschien stond er toch iets nuttigs in, maar dat zul je nu niet meer weten.',
      stateChange: {}
    }]
  },
  // SCENE COOK_D2 — Day 2 evening cooking, 18:00
  {
    id: 'st_d2_avond',
    time: '18:00',
    date: 'Dinsdag 2 februari 2027',
    dayBadge: 'Dag 2',
    dayBadgeClass: '',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const foodNote = state.wentToFoodDist ?
        'Je hebt morgen de voedseluitdeling gepland. Dat geeft wat rust.' :
        (state.supermarketItems.length > 0 || state.hasExtraFood) ?
        'Je hebt nog voorraad uit je voorbereiding.' :
        'Je voedselvoorraad is bijna op.';
      return '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">6°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−3°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~54 uur zonder stroom</div>Het is de derde avond. ' + foodNote + ' In huis is het nu echt koud. Je ziet je adem. Intussen weet je beter hoe je hiermee om moet gaan. Er moet vanavond opnieuw iets op tafel komen.';
    },
    choices: [{
      text: '🍲 Koken op het gasfornuis',
      consequence: 'Het gasfornuis werkt nog. Je steekt het handmatig aan met een aansteker. Het aardgasnet werkt nog omdat de druk in de leidingen mechanisch wordt geregeld. Je kookt rijst of pasta met de laatste blikken groenten. Één warme maaltijd per dag maakt een groot verschil.',
      stateChange: {
        comfort: 1
      }
    }, {
      text: '⚡ Proberen op de inductieplaat of elektrisch fornuis',
      consequence: 'Nog steeds geen stroom, dus de inductieplaat werkt niet. Je weet het eigenlijk al.',
      stateChange: {}
    }, {
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
    dayBadge: 'Dag 3',
    dayBadgeClass: 'green',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    get narrative() {
      const statusBar = '<div style="background:#070e1b;border:1px solid #1e3a5f;border-radius:var(--r-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem">🌡️ Binnen: <b style="color:#60a5fa">4°C</b> &nbsp;|&nbsp; ❄️ Buiten: <b style="color:#93c5fd">−3°C</b> &nbsp;|&nbsp; ⚡ <b style="color:#ef4444">Stroom uit</b> &nbsp;|&nbsp; ⏱️ ~68 uur zonder stroom</div>';
      const opening = 'De derde ochtend. Bijna windstil buiten. ';
      if (state.knowsNeighbors) {
        return statusBar + opening + 'Er wordt geklopt. Rob staat voor de deur en zijn adem dampt in de kou. "Heb je het gehoord?" zegt hij. "In grote delen van Europa is de stroom terug. Nederland is een van de laatste, maar ze zeggen: vandaag." Hij valt even stil. "En om 10:00 is er hier in de buurt een voedseluitdeling." Voor het eerst in dagen voel je weer een beetje hoop.';
      } else if (profile.hasRadio) {
        return statusBar + opening + 'Je zet de radio aan. De stem klinkt rustiger dan de afgelopen dagen. Er is eindelijk goed nieuws. Voor het eerst in dagen voel je weer een beetje hoop.';
      } else {
        return statusBar + opening + 'Geen nieuws van buiten. Je weet niet hoe het er elders voor staat. Het huis is stil. Je wacht af.';
      }
    },
    choices: [{
      text: '📻 De radio aanzetten voor het laatste nieuws',
      consequence: 'Op de AM-radio: "De herstelwerkzaamheden zijn in de afrondende fase. We verwachten dat het stroomnet stapsgewijs wordt hersteld vandaag. Houd apparaten uitgeschakeld bij herstel om stroompieken te voorkomen." Je houdt je adem in.',
      stateChange: {}
    }, {
      text: '🍽️ Een klein ontbijtje van de laatste resten',
      consequence: 'Crackers, de laatste pindakaas, een appel. Koud maar plechtig. Vandaag misschien de laatste dag zonder stroom.',
      stateChange: {}
    }, {
      conditionalOn: () => state.knowsNeighbors || profile.hasRadio,
      text: '🤝 De buren informeren over de voedseluitdeling en de hoop',
      consequence: 'Je klopt bij Rob en Annie aan. Rob grijpt je hand. "Echt?" Annie veegt een traan weg. Je brengt hoop naar mensen die het nodig hebben.',
      stateChange: {}
    }, {
      conditionalOn: () => state.knowsNeighbors || profile.hasRadio,
      text: '🙈 Niets verwachten, ik geloof het pas als ik het zie',
      consequence: 'Je hebt te vaak "binnenkort" gehoord. Daarom houd je jezelf rustig. Beter niets verwachten dan opnieuw teleurgesteld worden.',
      stateChange: {}
    }]
  },
  // SCENE 15 — Food distribution (conditional: player planned to go)
  {
    id: 'st_13',
    time: '10:15',
    date: 'Woensdag 3 februari 2027',
    dayBadge: 'Dag 3',
    dayBadgeClass: 'green',
    conditionalOn: () => state.wentToFoodDist === true,
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Bij de supermarkt staat een enorme rij. Honderden mensen. Het is rustig, maar gespannen. Om 10:00 precies gaan de deuren open en schuifelt de rij langzaam vooruit. Iedereen krijgt een tasje met voedsel en een inktkruisje op de rechterhand, zodat niemand twee keer aansluit. In jouw tasje zitten een kilo rijst, een blik tomaten, een paar appels en een brood. Terwijl je wacht, raken de mensen om je heen aan de praat.',
    choices: [{
      text: '💬 Praten met de mensen in de rij, informatie verzamelen',
      consequence: 'Iemand vertelt dat in Amsterdam-Noord de stroom al even terug was. Een ander zegt dat de overheid het net misschien per regio wil herstellen. Het zijn geruchten, maar ze geven wel hoop.',
      stateChange: {}
    }, {
      text: '👴 Een oudere man voor me laten gaan, hij staat te trillen van de kou',
      consequence: 'Je laat hem voorgaan. Hij bedankt je met een knik. Zijn vrouw pakt heel even je hand. Op dit soort momenten tellen kleine gebaren zwaar mee.',
      stateChange: {}
    }, {
      text: '🎒 Extra vragen of ze ook wat voor de zieke buurman hebben',
      consequence: 'Je vraagt aan de medewerker of er extra is voor een zieke buurman. Ze kijken elkaar aan. Na een korte aarzeling geven ze je een tweede klein pakketje. "Eén extra, meer kunnen we niet."',
      stateChange: {}
    }, {
      text: '⚡ Snel naar huis, ik wil niet te lang weg zijn',
      consequence: 'Je pakt je tasje en loopt meteen terug. Je bent 45 minuten weggeweest. Thuis is alles nog zoals je het hebt achtergelaten.',
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
    dayBadge: 'Dag 3',
    dayBadgeClass: 'green',
    channels: {
      news: [],
      whatsapp: [],
      nlalert: null,
      radio: null
    },
    narrative: 'Dan flakkert het licht onverwacht aan. De koelkast begint te zoemen. De wasmachine, die je vergeten was uit te zetten, schiet ineens weer aan. Uit de televisie komt een branderige geur. Eén lamp knalt. Buiten hoor je de buren juichen. Het ergste lijkt voorbij. Toch is niet alles meteen normaal: de CV moet nog op gang komen en de rioollucht hangt nog in huis. Maar er is weer licht.',
    choices: [{
      text: '⚡ Alle apparaten uitschakelen voordat er stroompieken schade aanrichten',
      consequence: 'Goed instinct. Je loopt door het huis en zet alles handmatig uit. Daarna zet je apparaat voor apparaat langzaam terug aan. De TV ruikt wat gebrand, maar werkt nog.',
      stateChange: {}
    }, {
      text: '📱 Als eerste mama bellen, ze weet vast niets van ons',
      consequence: 'Je belt. Ze neemt direct op en barst bijna in tranen uit. "Ik heb me zo ongerust gemaakt. Jullie zijn toch goed?" Jullie praten tien minuten lang bij.',
      stateChange: {}
    }, {
      text: '🛁 Het water laten lopen om de leidingen door te spoelen',
      consequence: 'Je draait de kraan open. Eerst bruin, dan helderder. De leidingen worden schoongespoeld. Goed idee na een langdurige lage druk.',
      stateChange: {}
    }, {
      text: '🤝 Bij Annie en Rob aanbellen om het nieuws te vieren',
      consequence: 'Je loopt de straat op. Rob staat al in de deuropening te zwaaien. Bij Annie is het stiller. Ze zijn blij dat de stroom terug is, maar Jan is nog steeds niet de oude en heeft medische aandacht nodig.',
      stateChange: {}
    }, {
      text: '⚡🛁📱 Alles direct aanpakken: apparaten uit, leidingen doorspoelen, mama bellen',
      consequence: 'Je werkt snel. Eerst schakel je alle apparaten handmatig uit, lamp voor lamp en stekker voor stekker. Daarna zet je de kraan open: eerst komt er bruin water, daarna helder. De leidingen zijn weer schoon. Dan bel je mama. Ze neemt direct op. "Ik heb me zo ongerust gemaakt." Jullie praten bij terwijl de koelkast zachtjes zoemt.',
      stateChange: {}
    }],
    get afterword() {
      const lines = [];
      if (state.helpedNeighbor) lines.push('Annie stuurt je de week erna nog appjes. Dat contact is er nu, en dat was er voor de storing niet.');
      if (state.handledSewage) lines.push('Je weet nu hoe je een ramp overleeft: niet via een app, maar via praktijk en aandacht.');
      if (state.hasWater) lines.push('Het ingeslagen water bleek goud waard. De tip om alvast te vullen staat nu permanent in je hoofd.');
      if (!state.hasCash) lines.push('Eén les die je nooit vergeet: zorg altijd voor contant geld in huis.');
      if (!lines.length) return null;
      return `<div style="background:#0a1f0a;border-left:3px solid #22c55e;padding:12px 16px;margin-top:8px;font-size:.85rem;color:#bbf7d0;line-height:1.8"><b style="color:#4ade80">Drie weken later</b><br><br>${lines.join('<br>')}</div>`;
    }
  }
];
