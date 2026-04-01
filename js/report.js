// ═══════════════════════════════════════════════════════════════
// Rapport — Persoonlijke eindanalyse na het scenario
// Secties: tijdlijn, crisisstatus badges, goed gedaan,
//          verbeterpunten, persoonlijke tips
// ═══════════════════════════════════════════════════════════════

// ─── REPORT ───────────────────────────────────────────────────────────────────
function showReport() {
  document.getElementById('sc-prog').style.transform = 'scaleX(1)';
  show('s-report');

  // Titel
  const titleEl = document.getElementById('rep-title');
  if (titleEl) {
    titleEl.textContent = profile.playerName
      ? `${profile.playerName}, hoe liep het?`
      : 'Jouw scenario, hoe liep het?';
  }

  // Intro (met naam)
  const naam = profile.playerName;
  const jij = naam ? `${naam}, je` : 'Je';
  let intro = '';
  if (currentScenario === 'stroom') {
    intro = `${jij} hebt het stroomuitvalscenario van enkele dagen doorlopen. Hieronder zie je een overzicht van wat je koos, wat je goed deed en waar ruimte voor verbetering zit.`;
  } else if (currentScenario === 'natuurbrand') {
    intro = `${jij} hebt het natuurbrandscenario doorlopen. Een brand die snel dichterbij komt, dwingt tot snelle beslissingen. Hieronder zie je hoe jij reageerde.`;
  } else if (currentScenario === 'overstroming') {
    intro = `${jij} hebt het overstromingsscenario doorlopen. Stijgend water geeft weinig tijd en vergeeft weinig fouten. Hieronder zie je hoe jij keuzes maakte.`;
  } else if (currentScenario === 'thuis_komen') {
    intro = `${jij} hebt het scenario thuiskomen doorlopen. Hoe kom je thuis als alle infrastructuur uitvalt? Hieronder zie je jouw route en keuzes.`;
  }
  document.getElementById('rep-intro').textContent = intro;

  // Uitkomstheadline
  const scoreW = state.water / MAX_STAT_WATER;
  const scoreF = state.food / MAX_STAT_FOOD;
  const scoreC = state.comfort / MAX_STAT_COMFORT;
  const avgScore = (scoreW + scoreF + scoreC) / 3;
  let outcomeText, outcomeClass;
  if (avgScore >= 0.7) {
    outcomeText = naam ? `${naam} doorstond de crisis goed.` : 'Je doorstond de crisis goed.';
    outcomeClass = 'outcome-good';
  } else if (avgScore >= 0.4) {
    outcomeText = naam ? `${naam} overleefde de crisis, maar niet zonder moeite.` : 'Je overleefde de crisis, maar niet zonder moeite.';
    outcomeClass = 'outcome-mid';
  } else {
    outcomeText = naam ? `De crisis liet zijn sporen na bij ${naam}.` : 'De crisis liet zijn sporen na.';
    outcomeClass = 'outcome-bad';
  }
  document.getElementById('rep-outcome').innerHTML = `<div class="rep-outcome-banner ${outcomeClass}">${outcomeText}</div>`;

  // Context-samenvatting
  const houseLabels = { 'appartement': 'Appartement', 'rijtjeshuis': 'Rijtjeshuis', 'vrijstaande-woning': 'Vrijstaande woning', 'boerderij': 'Boerderij' };
  const envLabels = { 'water': 'Nabij water', 'forest': 'Bos of natuur', 'rural_area': 'Buitengebied', 'city': 'Stedelijk' };
  const persons = adultsCount + childrenCount + slechtTerBeenCount;
  const ctxItems = [
    profile.houseType ? `🏠 ${houseLabels[profile.houseType] || profile.houseType}` : null,
    `👥 ${persons === 1 ? '1 persoon' : persons + ' personen'}`,
    profile.hasChildren ? '👶 Kinderen' : null,
    profile.hasPets ? '🐾 Huisdieren' : null,
    profile.hasCar ? '🚗 Auto' : null,
    profile.hasBike ? '🚲 Fiets' : null,
    ...((profile.location || []).map(l => envLabels[l] ? `📍 ${envLabels[l]}` : null)),
  ].filter(Boolean);
  document.getElementById('rep-context').innerHTML = `<div class="rep-context-bar">${ctxItems.map(i => `<span class="rep-ctx-item">${i}</span>`).join('')}</div>`;

  // Timeline
  let tlHtml = '';
  choiceHistory.forEach(ch => {
    tlHtml += `<div class="timeline-entry">
      <div class="tl-time">${ch.dayBadge}<br/>${ch.time}</div>
      <div class="tl-text">${ch.choiceText}</div>
    </div>`;
  });
  if (!tlHtml) tlHtml = '<p style="color:var(--c-muted-ui);font-size:.85rem">Geen keuzes geregistreerd.</p>';
  document.getElementById('rep-timeline').innerHTML = tlHtml;

  // Status badges
  let statusItems = [];
  if (currentScenario === 'natuurbrand') {
    statusItems = [{
        key: 'packedBag',
        label: 'Tas ingepakt',
        icon: '🎒'
      }, {
        key: 'evacuated',
        label: 'Op tijd geëvacueerd',
        icon: '🚗'
      }, {
        key: 'returnedHome',
        label: 'Veilig teruggekeerd',
        icon: '🏠'
      },
      ...(profile.hasPets ? [{
        key: 'tookPets',
        label: 'Huisdier meegenomen',
        icon: '🐾'
      }] : []),
      ...(profile.hasChildren ? [{
        key: 'kidsEvacuated',
        label: 'Kinderen veilig',
        icon: '👶'
      }] : []), {
        key: 'helpedNeighbor',
        label: 'Buren geholpen',
        icon: '🤝'
      }, {
        key: 'knowsNeighbors',
        label: 'Buren leren kennen',
        icon: '👋'
      }, {
        key: 'awarenessLevel',
        label: 'Vroeg gealarmeerd',
        icon: '⚠️'
      }
    ];
  } else if (currentScenario === 'overstroming') {
    statusItems = [{
      key: 'evacuatedFlood',
      label: 'Geëvacueerd',
      icon: '🚤'
    }, {
      key: 'wentUpstairs',
      label: 'Naar boven gegaan',
      icon: '🏠'
    }, {
      key: 'cutElectricity',
      label: 'Elektriciteit afgesloten',
      icon: '⚡'
    }, {
      key: 'savedItems',
      label: 'Essentials gered',
      icon: '📦'
    }, {
      key: 'calledRescue',
      label: 'Hulpdiensten ingeschakeld',
      icon: '🆘'
    }, {
      key: 'returnedHome',
      label: 'Veilig teruggekeerd',
      icon: '🏡'
    }, {
      key: 'helpedNeighbor',
      label: 'Buren geholpen',
      icon: '🤝'
    }, {
      key: 'packedBag',
      label: 'Tas ingepakt',
      icon: '🎒'
    }];
  } else if (currentScenario === 'thuis_komen') {
    statusItems = [{
      key: 'reachedHome',
      label: 'Thuis aangekomen',
      icon: '🏠'
    }, {
      key: 'foundAlternative',
      label: 'Alternatief gevonden',
      icon: '🔄'
    }, {
      key: 'hadEDCBag',
      label: 'EDC-tas bij je',
      icon: '🎒'
    }, {
      key: 'kidsPickedUp',
      label: 'Kinderen opgehaald',
      icon: '👶'
    }, {
      key: 'helpedStranger',
      label: 'Vreemdeling geholpen',
      icon: '🤝'
    }, {
      key: 'hasCash',
      label: 'Contant geld',
      icon: '💵'
    }];
  } else {
    statusItems = [{
      key: 'hasCash',
      label: 'Contant geld',
      icon: '💵'
    }, {
      key: 'hasWater',
      label: 'Noodwater opgeslagen',
      icon: '🛁'
    }, {
      key: 'hasFlashlight',
      label: 'Zaklamp / kaarsen',
      icon: '🔦'
    }, {
      key: 'houseLocked',
      label: 'Huis afgesloten',
      icon: '🔒'
    }, {
      key: 'knowsNeighbors',
      label: 'Buren leren kennen',
      icon: '👋'
    }, {
      key: 'helpedNeighbor',
      label: 'Buren geholpen',
      icon: '🤝'
    }, {
      key: 'hasCampingStove',
      label: 'Campingkooktoestel gebruikt',
      icon: '🏕️'
    }, {
      key: 'handledSewage',
      label: 'Riolering aangepakt',
      icon: '🚽'
    }, {
      key: 'wentToFoodDist',
      label: 'Voedseluitdeling bezocht',
      icon: '🍚'
    }, {
      key: 'hasExtraFood',
      label: 'Voedsel vooraf ingeslagen',
      icon: '🛒'
    }];
  } // end else (stroom)
  let statusHtml = '<div class="status-row">';
  statusItems.forEach(item => {
    const has = state[item.key];
    statusHtml += `<div class="status-badge ${has ? 'has' : 'missing'}">${item.icon} ${item.label}</div>`;
  });
  statusHtml += '</div>';
  document.getElementById('rep-status').innerHTML = statusHtml;

  // Eindstats (water, voedsel, comfort — geen gezondheid)
  function statBar(val, max, icon, label) {
    const pct = Math.max(0, Math.min(100, (val / max) * 100));
    const color = pct >= 60 ? 'var(--c-success)' : pct >= 30 ? '#f59e0b' : 'var(--c-danger)';
    return `<div class="rep-stat-item">
      <span class="rep-stat-label">${icon} ${label}</span>
      <div class="rep-stat-bar-bg"><div class="rep-stat-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="rep-stat-val">${val}/${max}</span>
    </div>`;
  }
  document.getElementById('rep-endstats').innerHTML = `<div class="rep-endstats">
    ${statBar(state.water,   MAX_STAT_WATER,   '💧', 'Water')}
    ${statBar(state.food,    MAX_STAT_FOOD,    '🥫', 'Voedsel')}
    ${statBar(state.comfort, MAX_STAT_COMFORT, '🧸', 'Comfort')}
  </div>`;

  // GOOD
  const goodItems = [];
  if (currentScenario === 'natuurbrand') {
    if (state.packedBag) goodItems.push({
      icon: '🎒',
      text: '<b>Tas ingepakt</b>. Je pakte al vroeg een tas met essentials. Bij evacuatie had je direct alles bij de hand.'
    });
    if (state.evacuated) goodItems.push({
      icon: '🚗',
      text: '<b>Op tijd vertrokken</b>. Je reageerde snel op het evacuatiebevel, of zelfs eerder. Vroeg vertrekken voorkomt files en gevaar.'
    });
    if (state.returnedHome) goodItems.push({
      icon: '🏠',
      text: '<b>Georganiseerde terugkeer</b>. Je wachtte op het officiële sein veilig en keerde verantwoord terug.'
    });
    if (state.knowsNeighbors) goodItems.push({
      icon: '👋',
      text: '<b>Buren gewaarschuwd</b>. Je informeerde buren voordat je vertrok. Solidariteit helpt in een crisis.'
    });
    if (state.awarenessLevel > 0) goodItems.push({
      icon: '📻',
      text: '<b>Vroeg gealarmeerd</b>. Je volgde het nieuws en was al alert voordat het bevel officieel werd gegeven.'
    });
  } else if (currentScenario === 'overstroming') {
    if (state.cutElectricity) goodItems.push({
      icon: '⚡',
      text: '<b>Elektriciteit afgesloten</b>. Je sloot de meterkast af. Water en stroom vormen samen een dodelijke combinatie. Dit was een cruciale veiligheidsmaatregel.'
    });
    if (state.evacuatedFlood) goodItems.push({
      icon: '🚤',
      text: '<b>Geëvacueerd</b>. Je verliet het pand of vroeg op tijd hulp. Je stelde je leven boven je bezittingen.'
    });
    if (state.calledRescue) goodItems.push({
      icon: '🆘',
      text: '<b>Hulpdiensten ingeschakeld</b>. Je meldde je locatie of riep hulp. Daardoor konden reddingswerkers je sneller bereiken.'
    });
    if (state.savedItems) goodItems.push({
      icon: '📦',
      text: '<b>Essentials gered</b>. Je nam medicijnen, documenten of voedsel mee naar boven. Dat is slim in een langdurige overstromingssituatie.'
    });
    if (state.helpedNeighbor) goodItems.push({
      icon: '🤝',
      text: '<b>Buren geholpen</b>. Je waarschuwde buren of hielp bij evacuatie. Bij een overstroming kunnen buren elkaars reddingslijn zijn.'
    });
  } else if (currentScenario === 'thuis_komen') {
    if (state.reachedHome) goodItems.push({
      icon: '🏠',
      text: '<b>Thuis gekomen</b>. Je vond een weg naar huis, ondanks uitgevallen infrastructuur.'
    });
    if (state.hadEDCBag) goodItems.push({
      icon: '🎒',
      text: '<b>EDC-tas bij je</b>. Je had je dagelijkse noodtas bij je. Contant geld, powerbank en OV-kaart maakten onderweg echt verschil.'
    });
    if (state.foundAlternative) goodItems.push({
      icon: '🔄',
      text: '<b>Alternatief gevonden</b>. Je bleef niet wachten, maar zocht actief een andere manier om thuis te komen.'
    });
    if (state.helpedStranger) goodItems.push({
      icon: '🤝',
      text: '<b>Iemand geholpen onderweg</b>. Je hielp een medemens tijdens een moeilijke situatie. Dat verdient erkenning.'
    });
    if (state.kidsPickedUp || state.kidsArranged) goodItems.push({
      icon: '👶',
      text: '<b>Kinderen geregeld</b>. Je zorgde dat de kinderen veilig waren, ook op afstand.'
    });
  } else {
    if (state.hasCash) goodItems.push({
      icon: '💵',
      text: '<b>Contant geld</b>. Je had contant geld beschikbaar. In een stroomstoring werken pinautomaten niet. Dat maakte direct verschil bij de supermarkt.'
    });
    if (state.hasWater) goodItems.push({
      icon: '🍶',
      text: '<b>Noodwater opgeslagen</b>. Je vulde op tijd flessen en pannen met water. Toen de waterpomp uitviel, had je nog een buffer voor drinken, koken en de wc.'
    });
    if (state.houseLocked) goodItems.push({
      icon: '🔒',
      text: '<b>Huis afgesloten</b>. Je controleerde ramen en deuren. Inbrekers sloegen toe in de buurt. Jouw huis bleef gespaard.'
    });
    if (state.knowsNeighbors) goodItems.push({
      icon: '👋',
      text: '<b>Buren leren kennen</b>. Je ging al vroeg bij Annie langs. Daardoor wist je wie er woonde en kon je sneller helpen toen het misging.'
    });
    if (state.helpedNeighbor) goodItems.push({
      icon: '🤝',
      text: '<b>Buren geholpen</b>. Je hielp buurvrouw Annie en haar gewonde man. In een crisis zijn buren vaak je eerste vangnet.'
    });
    if (state.hasCampingStove) goodItems.push({
      icon: '🏕️',
      text: '<b>Campingkooktoestel gebruikt</b>. Je kookte warm eten met het campingkooktoestel. Warm eten in een koud huis doet veel voor het moreel.'
    });
    if (state.handledSewage) goodItems.push({
      icon: '🚽',
      text: '<b>Rioleringsprobleem aangepakt</b>. Je reageerde goed op de uitgevallen rioolpompen. Zo bleef het huis leefbaar.'
    });
    if (state.hasExtraFood) goodItems.push({
      icon: '🛒',
      text: '<b>Voedsel vooraf ingeslagen</b>. Je kocht al voor de crisis wat extra in. Kleine voorbereiding, groot verschil.'
    });
    if (state.hasFlashlight) goodItems.push({
      icon: '🔦',
      text: '<b>Verlichting geregeld</b>. Je zorgde voor een zaklamp of kaarsen. In het donker, bij -3 graden buiten, was dat essentieel.'
    });
    if (state.awarenessLevel > 0) goodItems.push({
      icon: '💡',
      text: '<b>Bewustzijn voor risico\'s</b>. Je las de nieuwsberichten over kwetsbare energienetwerken. Dat bewustzijn is de eerste stap in voorbereiding.'
    });
  } // end else (stroom)

  let goodHtml = '';
  if (goodItems.length === 0) {
    goodHtml = '<div class="tip-card neutral"><div class="tip-icon">📋</div><div class="tip-text">In dit scenario maakte je geen keuzes die direct bijdroegen aan veiligheid of voorbereiding. Dat is oké. Dit scenario is juist bedoeld om te ontdekken waar de blinde vlekken zitten.</div></div>';
  } else {
    goodItems.forEach(g => {
      goodHtml += `<div class="tip-card good"><div class="tip-icon">${g.icon}</div><div class="tip-text">${g.text}</div></div>`;
    });
  }
  document.getElementById('rep-good').innerHTML = goodHtml;

  // IMPROVE
  const improveItems = [];
  if (currentScenario === 'natuurbrand') {
    if (!state.packedBag) improveItems.push({
      icon: '🎒',
      text: '<b>Geen tas ingepakt</b>. Bij evacuatie had je geen voorbereide tas. Leg alvast een noodtas klaar met paspoort, medicijnen, oplader en kleding voor twee dagen.'
    });
    if (!state.evacuated) improveItems.push({
      icon: '🚗',
      text: '<b>Te laat vertrokken</b>. Je vertrok niet vroeg genoeg. Bij natuurbranden kan het vuurfront snel oprukken. Vertrouw niet alleen op het officiële bevel, maar ook op je eigen waarneming.'
    });
    if (state.awarenessLevel === 0) improveItems.push({
      icon: '📻',
      text: '<b>Informatie gemist</b>. Je volgde het nieuws niet goed. Een batterijradio of NL-Alert-app had je eerder kunnen waarschuwen.'
    });
    if (!state.returnedHome) improveItems.push({
      icon: '🏠',
      text: '<b>Terugkeer niet georganiseerd</b>. Na de crisis is een geordende terugkeer belangrijk. Wacht altijd op het officiële sein veilig.'
    });
  } else if (currentScenario === 'overstroming') {
    if (!state.cutElectricity) improveItems.push({
      icon: '⚡',
      text: '<b>Elektriciteit niet afgesloten</b>. Water en stroom samen zijn levensgevaarlijk. Bij hoog water moet je altijd de meterkast uitzetten voordat het water de elektra bereikt.'
    });
    if (!state.evacuatedFlood && !state.wentUpstairs) improveItems.push({
      icon: '🌊',
      text: '<b>Te laat gereageerd</b>. Je reageerde niet op tijd op de hoogwaterwaarschuwing. Bij wateroverlast telt elke minuut.'
    });
    if (!state.savedItems) improveItems.push({
      icon: '📦',
      text: '<b>Niets gered</b>. Je nam geen essentials mee naar boven. Medicijnen, documenten en een oplader zijn het minimum bij overstromingsdreiging.'
    });
    if (!state.calledRescue && state.wentUpstairs) improveItems.push({
      icon: '🆘',
      text: '<b>Geen hulp gevraagd</b>. Toen je boven zat, had je je locatie kunnen melden bij 112. Laat hulpdiensten altijd weten waar je bent.'
    });
  } else if (currentScenario === 'thuis_komen') {
    if (!state.hadEDCBag) improveItems.push({
      icon: '🎒',
      text: '<b>Geen EDC-tas</b>. Je had geen dagelijkse noodtas bij je. Contant geld, powerbank en OV-kaart hadden onderweg een direct verschil gemaakt. Neem op werkdagen een kleine tas mee.'
    });
    if (!state.reachedHome) improveItems.push({
      icon: '🏠',
      text: '<b>Niet thuis gekomen</b>. Je vond geen manier om thuis te komen. Denk van tevoren na over alternatieven als het OV uitvalt.'
    });
    if (!state.foundAlternative && profile.commuteDistance !== 'near') improveItems.push({
      icon: '🔄',
      text: '<b>Geen alternatief gevonden</b>. Je bleef wachten op een vervoermiddel dat niet meer reed. Wees proactief: vraag een lift, leen een fiets of ga alvast lopen.'
    });
    if (profile.hasChildren && !state.kidsArranged) improveItems.push({
      icon: '👶',
      text: '<b>Kinderen niet geregeld</b>. Je had geen plan voor wie de kinderen ophaalt als jij niet thuis kunt komen. Spreek dit van tevoren af met school en partner.'
    });
    if (!profile.hasCash && !state.hasCash) improveItems.push({
      icon: '💵',
      text: '<b>Geen contant geld</b>. Taxi\'s, liften en tankstations accepteerden alleen cash. Zorg altijd voor €50 in je tas.'
    });
  } else {
    if (!state.hasCash) improveItems.push({
      icon: '💵',
      text: '<b>Contant geld</b>. Je had geen contant geld bij de hand. Supermarkten en tankstations accepteerden tijdens de crisis alleen contant. Bewaar thuis altijd €100 tot €200 in een noodpakket.'
    });
    if (!state.hasWater) improveItems.push({
      icon: '🍶',
      text: '<b>Noodwater</b>. Je vulde geen flessen of pannen met water. Toen de waterpomp uitviel, had je geen reserve. Vul bij een dreigende storing direct flessen, pannen en emmers. Reken op minimaal 2 liter per persoon per dag.'
    });
    if (!state.houseLocked) improveItems.push({
      icon: '🔒',
      text: '<b>Beveiliging</b>. Je controleerde je huis niet goed. Inbrekers sloegen toe in de nacht. Vergrendel deuren én ramen en zet eventueel een extra blokkade achter de deur.'
    });
    if (!state.knowsNeighbors) improveItems.push({
      icon: '👋',
      text: '<b>Buren niet gekend</b>. Je ging niet vroeg bij de buren langs. Toen Annie hulp nodig had, kende je haar niet. Leer je directe buren kennen en weet wie er ouder of ziek is.'
    });
    if (!state.helpedNeighbor) improveItems.push({
      icon: '🤝',
      text: '<b>Buurhulp</b>. Je hielp buurvrouw Annie niet of nauwelijks. Haar man had medische hulp nodig. Ken je buren. Ouderen en zieken zijn in een crisis vaak als eerste kwetsbaar.'
    });
    if (!state.hasCampingStove) improveItems.push({
      icon: '🏕️',
      text: '<b>Geen campingkooktoestel</b>. Je at meerdere dagen koud of was afhankelijk van het gasfornuis. Een campingkooktoestel of barbecue geeft je een extra kookoptie. Let op: gebruik die nooit binnen vanwege koolmonoxide.'
    });
    if (!state.handledSewage) improveItems.push({
      icon: '🚽',
      text: '<b>Riolering</b>. Je pakte het rioleringsprobleem niet goed aan. Rioolwater dat terugstroomt in huis is een ernstig hygiënerisico. Sluit afvoeren af bij het eerste teken van terugsijpeling.'
    });
    if (!state.wentToSupermarket && !state.hasExtraFood) improveItems.push({
      icon: '🛒',
      text: '<b>Noodvoorraad</b>. Je ging niet vroeg naar de supermarkt en had geen noodvoorraad thuis. Na 24 uur waren alle supermarkten leeg of gesloten. Een noodvoorraad voor 72 uur maakt je minder afhankelijk — dat is de eerste stap uit elk noodplan.'
    });
  } // end else (stroom)

  let improveHtml = '';
  if (improveItems.length === 0) {
    improveHtml = '<div class="tip-card good"><div class="tip-icon">🌟</div><div class="tip-text">Je hebt in dit scenario alle cruciale acties ondernomen. Goed gedaan.</div></div>';
  } else {
    improveItems.forEach(it => {
      improveHtml += `<div class="tip-card bad"><div class="tip-icon">${it.icon}</div><div class="tip-text">${it.text}</div></div>`;
    });
  }
  document.getElementById('rep-improve').innerHTML = improveHtml;

  // PERSONAL TIPS based on profile
  const personalTips = [];

  // Water/flood risk
  if (profile.region === 'lowland' || (profile.location && profile.location.includes('water'))) {
    personalTips.push({
      icon: '🌊',
      text: '<b>Laaggelegen gebied</b>. Jij woont in een gebied dat extra kwetsbaar is voor wateroverlast bij uitval van gemalen en stuwen. Controleer of je woning boven de vloedlijn ligt en ken de evacuatieroutes.'
    });
  }

  // House type
  if (profile.houseType === 'appartement') {
    personalTips.push({
      icon: '🏢',
      text: '<b>Appartement</b>. Zet grote jerrycans, flessen of emmers klaar met kraanwater, minimaal 2 liter per persoon per dag voor 3 dagen. De lift werkt niet bij stroomuitval. Houd daar rekening mee als je beperkt mobiel bent.'
    });
  }

  // Children
  if (profile.hasChildren) {
    personalTips.push({
      icon: '👶',
      text: '<b>Kinderen</b>. Kinderen hebben extra warmte, voeding en structuur nodig in een crisis. Zorg voor spelmateriaal en passend extra voedsel. Leg ook uit wat er gebeurt. Onzekerheid is voor hen zwaarder als ze niets weten.'
    });
  }

  // Elderly
  if (profile.hasElderly) {
    personalTips.push({
      icon: '👴',
      text: '<b>Ouderen in huis</b>. Ouderen koelen sneller af en zijn gevoeliger voor hypothermie. Houd één kamer zo warm mogelijk en let op tekenen van onderkoeling, zoals rillen, verwardheid en slaperigheid.'
    });
  }

  // Medical needs
  if (profile.hasMedNeeds) {
    personalTips.push({
      icon: '💊',
      text: '<b>Medicijnen</b>. Sommige medicijnen moeten gekoeld blijven, zoals insuline en biologicals. Zorg voor een koeltasje met ijspacks als back-up. Houd ook een week extra medicijnen op voorraad voor noodgevallen.'
    });
  }

  // Pets
  if (profile.hasPets) {
    personalTips.push({
      icon: '🐾',
      text: '<b>Huisdieren</b>. Huisdieren hebben ook noodvoorraden nodig: voer voor minimaal 3 dagen, water en een transportmand klaar bij de deur. Let op stresssignalen bij je huisdier.'
    });
  }

  // No car
  if (!profile.hasCar) {
    personalTips.push({
      icon: '🚲',
      text: '<b>Geen auto</b>. Zonder auto ben je afhankelijk van je fiets of van lopen. Zorg dat je weet waar de dichtstbijzijnde voedseluitdelingspunten, noodopvang en hulpposten zijn.'
    });
  }

  // Radio
  if (!profile.hasRadio) {
    personalTips.push({
      icon: '📻',
      text: '<b>Geen batterijradio</b>. In dit scenario was de AM-radio na dag 1 de enige betrouwbare informatiebron. Een batterijradio of handslingerradio kost ongeveer €20 tot €40 en is onmisbaar bij stroomuitval.'
    });
  }

  // Cash
  if (!profile.hasCash && !state.hasCash) {
    personalTips.push({
      icon: '💵',
      text: '<b>Geen contant geld</b>. Zowel voor als tijdens de crisis had je geen contant geld. Leg thuis altijd €100 tot €200 in biljetten klaar op een vaste, veilige plek.'
    });
  }

  // Kit
  if (!profile.hasKit) {
    personalTips.push({
      icon: '🎒',
      text: '<b>Geen noodpakket</b>. Je hebt geen noodpakket thuis. Denk Vooruit adviseert: water (3 liter per persoon per dag), noodvoorraad voor 3 dagen, zaklamp, batterijen, EHBO-doos, contant geld en een batterij-radio. In één rugzak bij elkaar in een uur. Meer info: <b>denkvooruit.nl</b>'
    });
  }

  // Powerbank
  if (!profile.hasPowerbank) {
    personalTips.push({
      icon: '🔋',
      text: '<b>Geen powerbank</b>. Je telefoon was je enige verbinding met de buitenwereld. Zonder powerbank was die na een dag leeg. Schaf een powerbank aan van minimaal 10.000 mAh en houd hem opgeladen.'
    });
  }

  // Generic tip always shown
  personalTips.push({
    icon: '⚡',
    text: '<b>Grote storing langer dan 72 uur</b>. Denk Vooruit en Fryslân Veilig adviseren je voor te bereiden op de eerste 72 uur: noodpakket, noodvoorraad en een noodplan. Dit scenario duurde langer. Bij een grote calamiteit — stroomuitval, overstroming, extreem weer — is zelfredzaamheid voor 5 tot 7 dagen het doel.'
  });

  let personalHtml = '';
  personalTips.forEach(t => {
    personalHtml += `<div class="tip-card"><div class="tip-icon">${t.icon}</div><div class="tip-text">${t.text}</div></div>`;
  });
  document.getElementById('rep-personal').innerHTML = personalHtml;

  // Stagger report sections in after screen entrance (screen takes 280ms)
  const sections = ['rep-intro', 'rep-outcome', 'rep-context', 'rep-timeline', 'rep-status', 'rep-endstats', 'rep-good', 'rep-improve', 'rep-personal'];
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.animation = `contentFade 280ms var(--ease-out) ${200 + i * 80}ms both`;
    }
  });
}
