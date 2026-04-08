// ═══════════════════════════════════════════════════════════════
// Rapport — Persoonlijke eindanalyse na het scenario
// Secties: tijdlijn, crisisstatus badges, goed gedaan,
//          verbeterpunten, persoonlijke tips
// ═══════════════════════════════════════════════════════════════

// ─── REPORT ───────────────────────────────────────────────────────────────────
// Bouwt het volledige rapportscherm op op basis van de keuzes en het profiel
// van de speler. Vult alle HTML-elementen in het rapport-scherm dynamisch.
function showReport() {
  // Zet de voortgangsbalk bovenaan volledig gevuld (100%)
  document.getElementById('sc-prog').style.transform = 'scaleX(1)';
  // Toon het rapport-scherm
  show('s-report');

  // Titel
  // Gebruik de naam van de speler als die bekend is, anders een generieke tekst
  const titleEl = document.getElementById('rep-title');
  if (titleEl) {
    titleEl.textContent = profile.playerName
      ? `${profile.playerName}, hoe liep het?`
      : 'Jouw scenario, hoe liep het?';
  }

  // Intro (met naam)
  // Pas de aanspreekvorm aan op basis van of de naam bekend is
  const naam = profile.playerName;
  const jij = naam ? `${naam}, je` : 'Je';
  let intro = '';
  // Kies de introductietekst op basis van het actieve scenario
  if (currentScenario === 'stroom') {
    intro = `${jij} hebt het stroomstoringsscenario van een paar dagen gespeeld. Hieronder zie je wat je koos, wat goed ging en wat beter kan.`;
  } else if (currentScenario === 'natuurbrand') {
    intro = `${jij} hebt het natuurbrandscenario gespeeld. Als een brand snel dichterbij komt, moet je snel kiezen. Hieronder zie je hoe jij reageerde.`;
  } else if (currentScenario === 'overstroming') {
    intro = `${jij} hebt het overstromingsscenario gespeeld. Stijgend water geeft weinig tijd. Hieronder zie je welke keuzes jij maakte.`;
  } else if (currentScenario === 'thuis_komen') {
    intro = `${jij} hebt het scenario Onderweg naar huis gespeeld. Hoe kom je thuis als alles uitvalt? Hieronder zie je jouw route en keuzes.`;
  } else if (currentScenario === 'nachtalarm') {
    intro = `${jij} hebt het scenario Rookalarm in de nacht gespeeld. De eerste minuten bij brand zijn bepalend. Hieronder zie je hoe jij reageerde.`;
  }
  document.getElementById('rep-intro').textContent = intro;

  // Uitkomstheadline
  // Bereken een gemiddelde eindscore op basis van water, voedsel en comfort
  const scoreW = state.ranOutOfWater ? 0 : 1;          // 0 als water op was, anders 1
  const scoreF = state.ranOutOfFood  ? 0 : 1;          // 0 als voedsel op was, anders 1
  const scoreC = state.comfort / MAX_STAT_COMFORT;     // Comfort als fractie van het maximum
  const avgScore = (scoreW + scoreF + scoreC) / 3;     // Gemiddelde van de drie scores (0–1)
  let outcomeText, outcomeClass;
  // Bepaal de uitkomsttekst en bijbehorende CSS-klasse op basis van de gemiddelde score
  if (avgScore >= 0.7) {
    outcomeText = naam ? `${naam} kwam goed door deze situatie heen.` : 'Je kwam goed door deze situatie heen.';
    outcomeClass = 'outcome-good';
  } else if (avgScore >= 0.4) {
    outcomeText = naam ? `${naam} kwam hier doorheen, maar het kostte moeite.` : 'Je kwam hier doorheen, maar het kostte moeite.';
    outcomeClass = 'outcome-mid';
  } else {
    outcomeText = naam ? `De crisis liet zijn sporen na bij ${naam}.` : 'De crisis liet zijn sporen na.';
    outcomeClass = 'outcome-bad';
  }
  document.getElementById('rep-outcome').innerHTML = `<div class="rep-outcome-banner ${outcomeClass}">${outcomeText}</div>`;

  // Context-samenvatting
  // Vertaaltabellen van interne sleutels naar leesbare labels
  const houseLabels = { 'appartement': 'Appartement', 'rijtjeshuis': 'Rijtjeshuis', 'vrijstaande-woning': 'Vrijstaande woning', 'boerderij': 'Boerderij' };
  const envLabels = { 'water': 'Nabij water', 'forest': 'Bos of natuur', 'rural_area': 'Buitengebied', 'city': 'Stedelijk' };
  // Totaal aantal personen in het huishouden
  const persons = adultsCount + childrenCount + slechtTerBeenCount;
  // Bouw een array van contextlabels op; filter null-waarden eruit
  const ctxItems = [
    profile.houseType ? `🏠 ${houseLabels[profile.houseType] || profile.houseType}` : null,
    `👥 ${persons === 1 ? '1 persoon' : persons + ' personen'}`,
    profile.hasChildren ? '👶 Kinderen' : null,
    profile.hasPets ? '🐾 Huisdieren' : null,
    profile.hasCar ? '🚗 Auto' : null,
    profile.hasBike ? '🚲 Fiets' : null,
    // Voeg omgevingslabels toe voor elke locatiewaarde in het profiel
    ...((profile.location || []).map(l => envLabels[l] ? `📍 ${envLabels[l]}` : null)),
  ].filter(Boolean); // Verwijder alle null/undefined-items
  document.getElementById('rep-context').innerHTML = `<div class="rep-context-bar">${ctxItems.map(i => `<span class="rep-ctx-item">${i}</span>`).join('')}</div>`;

  // Timeline
  // Bouw de tijdlijn op uit de opgeslagen keuzegeschiedenis
  let tlHtml = '';
  choiceHistory.forEach(ch => {
    tlHtml += `<div class="timeline-entry">
      <div class="tl-time">${ch.dayBadge}<br/>${ch.time}</div>
      <div class="tl-text">${ch.choiceText}</div>
    </div>`;
  });
  // Toon een fallback-tekst als er geen keuzes zijn geregistreerd
  if (!tlHtml) tlHtml = '<p style="color:var(--c-muted-ui);font-size:.85rem">Geen keuzes geregistreerd.</p>';
  document.getElementById('rep-timeline').innerHTML = tlHtml;

  // Status badges
  // Definieer welke statusitems getoond worden per scenario
  let statusItems = [];
  if (currentScenario === 'natuurbrand') {
    // Statusbadges specifiek voor het natuurbrandscenario
    statusItems = [{
        key: 'packedBag',
        label: 'Noodtas ingepakt',
        labelMissing: 'Noodtas niet ingepakt',
        icon: '🎒'
      }, {
        key: 'evacuated',
        label: 'Op tijd geëvacueerd',
        labelMissing: 'Niet op tijd geëvacueerd',
        icon: '🚗'
      }, {
        key: 'returnedHome',
        label: 'Veilig teruggekeerd',
        labelMissing: 'Niet veilig teruggekeerd',
        icon: '🏠'
      },
      // Voeg huisdierenbadge alleen toe als het profiel huisdieren bevat
      ...(profile.hasPets ? [{
        key: 'tookPets',
        label: 'Huisdier meegenomen',
        labelMissing: 'Huisdier niet meegenomen',
        icon: '🐾'
      }] : []),
      // Voeg kinderenbadge alleen toe als het profiel kinderen bevat
      ...(profile.hasChildren ? [{
        key: 'kidsEvacuated',
        label: 'Kinderen veilig gesteld',
        labelMissing: 'Kinderen niet veilig gesteld',
        icon: '👶'
      }] : []), {
        key: 'helpedNeighbor',
        label: 'Buren geholpen bij evacuatie',
        labelMissing: 'Buren niet geholpen bij evacuatie',
        icon: '🤝'
      }, {
        key: 'knowsNeighbors',
        label: 'Buren gewaarschuwd',
        labelMissing: 'Buren niet gewaarschuwd',
        icon: '👋'
      }, {
        key: 'awarenessLevel',
        label: 'Tijdig gealarmeerd',
        labelMissing: 'Waarschuwingen gemist',
        icon: '⚠️'
      }
    ];
  } else if (currentScenario === 'overstroming') {
    // Statusbadges specifiek voor het overstromingsscenario
    statusItems = [{
      key: 'evacuatedFlood',
      label: 'Op tijd geëvacueerd',
      labelMissing: 'Niet op tijd geëvacueerd',
      icon: '🚤'
    }, {
      key: 'wentUpstairs',
      label: 'Naar hogere verdieping gegaan',
      labelMissing: 'Niet naar hogere verdieping gegaan',
      icon: '🏠'
    }, {
      key: 'cutElectricity',
      label: 'Meterkast afgesloten',
      labelMissing: 'Meterkast niet afgesloten',
      icon: '⚡'
    }, {
      key: 'savedItems',
      label: 'Essentials meegenomen',
      labelMissing: 'Geen belangrijke spullen meegenomen',
      icon: '📦'
    }, {
      key: 'calledRescue',
      label: 'Hulpdiensten gebeld',
      labelMissing: 'Hulpdiensten niet gebeld',
      icon: '🆘'
    }, {
      key: 'returnedHome',
      label: 'Eerste inspectie veilig uitgevoerd',
      labelMissing: 'Inspectie niet gedaan of uitgesteld',
      icon: '🏡'
    }, {
      key: 'helpedNeighbor',
      label: 'Buren geholpen',
      labelMissing: 'Buren niet geholpen',
      icon: '🤝'
    }, {
      key: 'packedBag',
      label: 'Noodtas ingepakt',
      labelMissing: 'Noodtas niet ingepakt',
      icon: '🎒'
    }];
  } else if (currentScenario === 'thuis_komen') {
    // Statusbadges specifiek voor het scenario 'thuis komen'
    statusItems = [{
      key: 'reachedHome',
      label: 'Thuis aangekomen',
      labelMissing: 'Niet thuis gekomen',
      icon: '🏠'
    }, {
      key: 'foundAlternative',
      label: 'Alternatief vervoer gevonden',
      labelMissing: 'Geen alternatief vervoer gevonden',
      icon: '🔄'
    }, {
      key: 'hadEDCBag',
      label: 'Noodtas bij je gehad',
      labelMissing: 'Geen noodtas bij je gehad',
      icon: '🎒'
    }, {
      key: 'kidsPickedUp',
      label: 'Kinderen opgehaald of geregeld',
      labelMissing: 'Kinderen niet opgehaald of geregeld',
      icon: '👶'
    }, {
      key: 'helpedStranger',
      label: 'Iemand onderweg geholpen',
      labelMissing: 'Niemand onderweg geholpen',
      icon: '🤝'
    }, {
      key: 'hasCash',
      label: 'Contant geld bij je gehad',
      labelMissing: 'Geen contant geld bij je gehad',
      icon: '💵'
    }];
  } else if (currentScenario === 'nachtalarm') {
    // Statusbadges specifiek voor het nachtalarm-scenario
    statusItems = [
      {
        key: 'tookAlarmSeriously',
        label: 'Rookmelder direct serieus genomen',
        labelMissing: 'Rookmelder niet meteen serieus genomen',
        icon: '🔔'
      },
      ...(persons > 1 ? [{
        key: 'warnedHousemates',
        label: 'Huisgenoten gewaarschuwd',
        labelMissing: 'Huisgenoten niet gewaarschuwd',
        icon: '🗣️'
      }] : []),
      {
        key: 'didntUseWaterOnFire',
        label: 'Geen water op elektrische brand gegooid',
        labelMissing: 'Water op elektrische brand gegooid',
        icon: '⚡'
      },
      {
        key: 'evacuatedFire',
        label: 'Op tijd naar buiten gegaan',
        labelMissing: 'Niet op tijd naar buiten gegaan',
        icon: '🚪'
      },
      {
        key: 'called112',
        label: '112 vanaf buiten gebeld',
        labelMissing: '112 niet vanaf buiten gebeld',
        icon: '📱'
      },
      {
        key: 'stayedOutside',
        label: 'Buiten gebleven tot brandweer klaar was',
        labelMissing: 'Toch terug naar binnen gegaan',
        icon: '🌙'
      },
      ...(profile.hasChildren || profile.hasMobilityImpaired ? [{
        key: 'kidsEvacuated',
        label: 'Kwetsbare huisgenoten geholpen',
        labelMissing: 'Kwetsbare huisgenoten niet geholpen',
        icon: '🤝'
      }] : [])
    ];
  } else {
    // Statusbadges voor het standaard stroomuitvalscenario
    statusItems = [{
      key: 'hasCash',
      label: 'Contant geld in huis',
      labelMissing: 'Geen contant geld in huis',
      icon: '💵'
    }, {
      key: 'hasWater',
      label: 'Noodwater opgeslagen',
      labelMissing: 'Geen noodwater opgeslagen',
      icon: '🛁'
    }, {
      key: 'hasFlashlight',
      label: 'Zaklamp of kaarsen in huis',
      labelMissing: 'Geen zaklamp of kaarsen in huis',
      icon: '🔦'
    }, {
      key: 'houseLocked',
      label: 'Deuren en ramen afgesloten',
      labelMissing: 'Deuren en ramen niet afgesloten',
      icon: '🔒'
    }, {
      key: 'knowsNeighbors',
      label: 'Buren aangesproken',
      labelMissing: 'Buren niet aangesproken',
      icon: '👋'
    }, {
      key: 'helpedNeighbor',
      label: 'Buren actief geholpen',
      labelMissing: 'Buren niet actief geholpen',
      icon: '🤝'
    }, {
      key: 'hasCampingStove',
      label: 'Campingkooktoestel gebruikt',
      labelMissing: 'Geen campingkooktoestel gebruikt',
      icon: '🏕️'
    }, {
      key: 'handledSewage',
      label: 'Afvoeren afgesloten bij riolering',
      labelMissing: 'Afvoeren niet afgesloten bij riolering',
      icon: '🚽'
    }, {
      key: 'wentToFoodDist',
      label: 'Voedseluitdeling bezocht',
      labelMissing: 'Voedseluitdeling niet bezocht',
      icon: '🍚'
    }, {
      key: 'hasExtraFood',
      label: 'Voedsel vooraf ingeslagen',
      labelMissing: 'Geen voedsel vooraf ingeslagen',
      icon: '🛒'
    }];
  } // end else (stroom)

  // Bouw de HTML voor de statusbadges op
  // Elke badge krijgt klasse 'has' (groen) of 'missing' (rood) afhankelijk van de spelerstatus
  let statusHtml = '<div class="status-row">';
  statusItems.forEach(item => {
    const has = state[item.key]; // Controleer of de speler dit item heeft bereikt
    const badgeLabel = has ? item.label : (item.labelMissing || item.label); // Kies de juiste labeltekst
    statusHtml += `<div class="status-badge ${has ? 'has' : 'missing'}">${item.icon} ${badgeLabel}</div>`;
  });
  statusHtml += '</div>';
  document.getElementById('rep-status').innerHTML = statusHtml;

  // Eindstats
  /* Hulpfuncties voor het renderen van de eindstatistieken als gekleurde voortgangsbalken */

  // Genereert HTML voor een enkelvoudige statistiekbalk met kleurcodering op basis van percentage
  function statBar(val, max, icon, label) {
    const pct = Math.max(0, Math.min(100, (val / max) * 100)); // Klamp het percentage tussen 0 en 100
    // Kies balkkleur: groen boven 60%, oranje boven 30%, rood daaronder
    const color = pct >= 60 ? 'var(--c-success)' : pct >= 30 ? '#f59e0b' : 'var(--c-danger)';
    return `<div class="rep-stat-item">
      <span class="rep-stat-label">${icon} ${label}</span>
      <div class="rep-stat-bar-bg"><div class="rep-stat-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="rep-stat-val">${val}/${max}</span>
    </div>`;
  }

  // Genereert HTML voor een binaire indicator (tekort gehad / geen tekort)
  // Toont een volle balk bij geen tekort, een kleine balk bij tekort
  function shortageIndicator(ranOut, icon, labelOk, labelShortage) {
    const ok = !ranOut; // Geen tekort = positief
    const color = ok ? 'var(--c-success)' : 'var(--c-danger)'; // Groen of rood
    const text  = ok ? labelOk : labelShortage;
    return `<div class="rep-stat-item">
      <span class="rep-stat-label">${icon} ${text}</span>
      <div class="rep-stat-bar-bg"><div class="rep-stat-bar-fill" style="width:${ok ? 100 : 20}%;background:${color}"></div></div>
      <span class="rep-stat-val" style="color:${color}">${ok ? '✓' : '✗'}</span>
    </div>`;
  }

  // Render de eindstatistieken: water, voedsel en comfortniveau
  document.getElementById('rep-endstats').innerHTML = `<div class="rep-endstats">
    ${shortageIndicator(state.ranOutOfWater, '💧', 'Geen watertekort', 'Watertekort gehad')}
    ${shortageIndicator(state.ranOutOfFood,  '🥫', 'Geen voedseltekort', 'Voedseltekort gehad')}
    ${statBar(state.comfort, MAX_STAT_COMFORT, '🧸', 'Comfort aan het eind')}
  </div>`;

  // GOOD
  // Verzamel positieve feedbackitems op basis van de keuzes van de speler per scenario
  const goodItems = [];
  if (currentScenario === 'natuurbrand') {
    // Positieve acties voor het natuurbrandscenario
    if (state.packedBag) goodItems.push({
      icon: '🎒',
      text: '<b>Tas ingepakt</b>. Je pakte al vroeg een tas met belangrijke spullen. Zo kon je bij een evacuatie meteen weg.'
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
    // awarenessLevel > 0 betekent dat de speler actief informatie volgde
    if (state.awarenessLevel > 0) goodItems.push({
      icon: '📻',
      text: '<b>Vroeg gealarmeerd</b>. Je volgde het nieuws en was al alert voordat het bevel officieel werd gegeven.'
    });
  } else if (currentScenario === 'overstroming') {
    // Positieve acties voor het overstromingsscenario
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
      text: '<b>Hulpdiensten ingeschakeld</b>. Je meldde je locatie of riep hulp. Zo konden reddingswerkers je sneller bereiken.'
    });
    if (state.savedItems) goodItems.push({
      icon: '📦',
      text: '<b>Essentials gered</b>. Je nam medicijnen, documenten of voedsel mee naar boven. Dat is slim in een langdurige overstromingssituatie.'
    });
    if (state.helpedNeighbor) goodItems.push({
      icon: '🤝',
      text: '<b>Buren geholpen</b>. Je waarschuwde buren of hielp bij evacuatie. Bij een overstroming kunnen buren elkaars reddingslijn zijn.'
    });
    if (state.returnedHome) goodItems.push({
      icon: '🏡',
      text: '<b>Gecontroleerde terugkeer</b>. Je ging pas terug toen de situatie het toeliet en werkte stap voor stap: schade vastleggen, spullen regelen, keuring inplannen. Dat is precies hoe gefaseerde terugkeer werkt.'
    });
  } else if (currentScenario === 'nachtalarm') {
    // Positieve acties voor het nachtalarm-scenario
    if (state.tookAlarmSeriously) goodItems.push({
      icon: '🔔',
      text: '<b>Rookmelder serieus genomen</b>. Je reageerde direct toen het alarm afging. Juist in de eerste minuten maakt dat het verschil.'
    });
    if (persons > 1 && state.warnedHousemates) goodItems.push({
      icon: '🗣️',
      text: '<b>Huisgenoten gewaarschuwd</b>. Je zorgde dat niemand slapend achterbleef. Dat is cruciaal bij rook in de nacht.'
    });
    if (state.didntUseWaterOnFire) goodItems.push({
      icon: '⚡',
      text: '<b>Geen water op een elektrische brand</b>. Je maakte de situatie niet gevaarlijker. Bij een stopcontactbrand is dat een belangrijke keuze.'
    });
    if (state.evacuatedFire) goodItems.push({
      icon: '🚪',
      text: '<b>Snel naar buiten gegaan</b>. Je bleef niet onnodig lang binnen. Dat verkleint het risico op rookinhalatie.'
    });
    if (state.cutElectricity) goodItems.push({
      icon: '🔌',
      text: '<b>Stroom uitgeschakeld</b>. Je zette bij de uitgang snel de stroom uit. Dat verkleinde de kans dat het probleem verder doorsloeg.'
    });
    if (state.called112) goodItems.push({
      icon: '📱',
      text: '<b>112 vanaf buiten gebeld</b>. Je gaf de situatie door vanaf een veilige plek. Zo konden hulpdiensten gericht uitrukken.'
    });
    if (state.stayedOutside) goodItems.push({
      icon: '🌙',
      text: '<b>Buiten gebleven</b>. Je ging niet terug naar binnen zonder begeleiding. Dat is precies wat je moet doen bij rook en brandschade.'
    });
    if ((profile.hasChildren || profile.hasMobilityImpaired) && state.kidsEvacuated) goodItems.push({
      icon: '🤝',
      text: '<b>Kwetsbare huisgenoten geholpen</b>. Je zorgde dat kinderen of minder mobiele huisgenoten veilig buiten kwamen.'
    });
    if (profile.hasPets && state.tookPets) goodItems.push({
      icon: '🐾',
      text: '<b>Huisdier veilig mee</b>. Je nam je huisdier mee zonder lang te blijven zoeken. Dat is een veilige afweging.'
    });
  } else if (currentScenario === 'thuis_komen') {
    // Positieve acties voor het scenario 'thuis komen'
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
    // Controleer beide mogelijke kinderstatussleutels
    if (state.kidsPickedUp || state.kidsArranged) goodItems.push({
      icon: '👶',
      text: '<b>Kinderen geregeld</b>. Je zorgde dat de kinderen veilig waren, ook op afstand.'
    });
  } else {
    // Positieve acties voor het standaard stroomuitvalscenario
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
      text: '<b>Buren leren kennen</b>. Je ging al vroeg bij Annie langs. Zo wist je wie er woonde en kon je sneller helpen toen het misging.'
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
    // awarenessLevel > 0 geeft aan dat de speler nieuwsberichten las over kwetsbaar energienet
    if (state.awarenessLevel > 0) goodItems.push({
      icon: '💡',
      text: '<b>Bewustzijn voor risico\'s</b>. Je las de nieuwsberichten over kwetsbare energienetwerken. Dat bewustzijn is de eerste stap in voorbereiding.'
    });
  } // end else (stroom)

  // Render de 'goed gedaan'-sectie; toon een neutrale tekst als er geen positieve acties zijn
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
  // Verzamel verbeterpunten op basis van gemiste acties van de speler per scenario
  const improveItems = [];
  if (currentScenario === 'natuurbrand') {
    // Verbeterpunten voor het natuurbrandscenario — alleen als de actie NIET is genomen
    if (!state.packedBag) improveItems.push({
      icon: '🎒',
      text: '<b>Geen tas ingepakt</b>. Bij evacuatie had je geen voorbereide tas. Leg alvast een noodtas klaar met paspoort, medicijnen, oplader en kleding voor twee dagen.'
    });
    if (!state.evacuated) improveItems.push({
      icon: '🚗',
      text: '<b>Te laat vertrokken</b>. Je vertrok niet vroeg genoeg. Bij natuurbranden kan het vuurfront snel oprukken. Vertrouw niet alleen op het officiële bevel, maar ook op je eigen waarneming.'
    });
    // awarenessLevel === 0 betekent dat de speler geen informatie volgde
    if (state.awarenessLevel === 0) improveItems.push({
      icon: '📻',
      text: '<b>Informatie gemist</b>. Je volgde het nieuws niet goed. Een batterijradio of NL-Alert-app had je eerder kunnen waarschuwen.'
    });
    if (!state.returnedHome) improveItems.push({
      icon: '🏠',
      text: '<b>Terugkeer niet georganiseerd</b>. Na de crisis is een geordende terugkeer belangrijk. Wacht altijd op het officiële sein veilig.'
    });
  } else if (currentScenario === 'overstroming') {
    // Verbeterpunten voor het overstromingsscenario
    if (!state.cutElectricity) improveItems.push({
      icon: '⚡',
      text: '<b>Elektriciteit niet afgesloten</b>. Water en stroom samen zijn levensgevaarlijk. Bij hoog water moet je altijd de meterkast uitzetten voordat het water de elektra bereikt.'
    });
    // Toon dit verbeterpunt alleen als de speler NOCH geëvacueerd is, NOR naar boven gegaan is
    if (!state.evacuatedFlood && !state.wentUpstairs) improveItems.push({
      icon: '🌊',
      text: '<b>Te laat gereageerd</b>. Je reageerde niet op tijd op de hoogwaterwaarschuwing. Bij wateroverlast telt elke minuut.'
    });
    if (!state.savedItems) improveItems.push({
      icon: '📦',
      text: '<b>Niets meegenomen</b>. Je nam geen belangrijke spullen mee naar boven. Medicijnen, documenten en een oplader zijn het minimum bij kans op overstroming.'
    });
    // Toon dit verbeterpunt alleen als de speler boven zat maar geen hulp vroeg
    if (!state.calledRescue && state.wentUpstairs) improveItems.push({
      icon: '🆘',
      text: '<b>Geen hulp gevraagd</b>. Toen je boven zat, had je je locatie kunnen melden bij 112. Laat hulpdiensten altijd weten waar je bent.'
    });
  } else if (currentScenario === 'nachtalarm') {
    // Verbeterpunten voor het nachtalarm-scenario
    if (!state.tookAlarmSeriously) improveItems.push({
      icon: '🔔',
      text: '<b>Alarm te laat serieus genomen</b>. Een rookmelder midden in de nacht is nooit iets om weg te wuiven. Reageer direct en controleer meteen wat er aan de hand is.'
    });
    if (persons > 1 && !state.warnedHousemates) improveItems.push({
      icon: '🗣️',
      text: '<b>Huisgenoten niet gewaarschuwd</b>. Maak anderen direct wakker als er rook in huis is. In de nacht merkt niet iedereen het alarm even snel op.'
    });
    if (!state.didntUseWaterOnFire) improveItems.push({
      icon: '⚡',
      text: '<b>Verkeerd blusmiddel gebruikt</b>. Water op een elektrische brand maakt de situatie gevaarlijker. Kies eerst voor afsluiten, afstand nemen en evacueren.'
    });
    if (!state.evacuatedFire) improveItems.push({
      icon: '🚪',
      text: '<b>Te lang binnen gebleven</b>. Bij rook telt elke seconde. Ga zo snel mogelijk naar buiten en stel je veiligheid voorop.'
    });
    if (!state.called112) improveItems.push({
      icon: '📱',
      text: '<b>112 niet vanaf buiten gebeld</b>. Bel zodra je veilig buiten staat en geef door of iedereen eruit is. Dat helpt de brandweer direct bij aankomst.'
    });
    if (!state.stayedOutside) improveItems.push({
      icon: '🌙',
      text: '<b>Niet buiten gebleven</b>. Ga na evacuatie niet opnieuw naar binnen voor spullen of kleding. Wacht op de brandweer en ga alleen onder begeleiding terug.'
    });
  } else if (currentScenario === 'thuis_komen') {
    // Verbeterpunten voor het scenario 'thuis komen'
    if (!state.hadEDCBag) improveItems.push({
      icon: '🎒',
      text: '<b>Geen EDC-tas</b>. Je had geen dagelijkse noodtas bij je. Contant geld, powerbank en OV-kaart hadden onderweg een direct verschil gemaakt. Neem op werkdagen een kleine tas mee.'
    });
    if (!state.reachedHome) improveItems.push({
      icon: '🏠',
      text: '<b>Niet thuis gekomen</b>. Je vond geen manier om thuis te komen. Denk van tevoren na over alternatieven als het OV uitvalt.'
    });
    // Sla dit verbeterpunt over als de speler vlakbij woont (commuteDistance === 'near')
    if (!state.foundAlternative && profile.commuteDistance !== 'near') improveItems.push({
      icon: '🔄',
      text: '<b>Geen alternatief gevonden</b>. Je bleef wachten op een vervoermiddel dat niet meer reed. Wees proactief: vraag een lift, leen een fiets of ga alvast lopen.'
    });
    // Toon alleen als het profiel aangeeft dat er kinderen zijn
    if (profile.hasChildren && !state.kidsArranged) improveItems.push({
      icon: '👶',
      text: '<b>Kinderen niet geregeld</b>. Je had geen plan voor wie de kinderen ophaalt als jij niet thuis kunt komen. Spreek dit van tevoren af met school en partner.'
    });
    // Controleer zowel profiel als spelerstatus voor contant geld
    if (!profile.hasCash && !state.hasCash) improveItems.push({
      icon: '💵',
      text: '<b>Geen contant geld</b>. Taxi\'s, liften en tankstations accepteerden alleen cash. Zorg altijd voor €50 in je tas.'
    });
  } else {
    // Verbeterpunten voor het standaard stroomuitvalscenario
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
    // Toon dit punt alleen als de speler ook niet naar de supermarkt is geweest
    if (!state.wentToSupermarket && !state.hasExtraFood) improveItems.push({
      icon: '🛒',
      text: '<b>Noodvoorraad</b>. Je ging niet vroeg naar de supermarkt en had geen noodvoorraad thuis. Na 24 uur waren alle supermarkten leeg of gesloten. Een noodvoorraad voor 72 uur maakt je minder afhankelijk. Dat is een goede eerste stap.'
    });
  } // end else (stroom)

  // Render de verbeterpuntensectie; toon een succesbericht als er niets te verbeteren valt
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
  // Bouw persoonlijke tips op die afgestemd zijn op het profiel van de speler
  const personalTips = [];

  // Water/flood risk
  // Toon waarschuwing als de speler in een laaggelegen of waterrijke omgeving woont
  if (profile.region === 'lowland' || (profile.location && profile.location.includes('water'))) {
    personalTips.push({
      icon: '🌊',
      text: '<b>Laaggelegen gebied</b>. Jij woont in een gebied dat extra kwetsbaar is voor wateroverlast bij uitval van gemalen en stuwen. Controleer of je woning boven de vloedlijn ligt en ken de evacuatieroutes.'
    });
  }

  // House type
  // Specifieke tip voor bewoners van een appartement (liften, wateropslag)
  if (profile.houseType === 'appartement') {
    personalTips.push({
      icon: '🏢',
      text: '<b>Appartement</b>. Zet grote jerrycans, flessen of emmers klaar met kraanwater, minimaal 2 liter per persoon per dag voor 3 dagen. De lift werkt niet bij stroomuitval. Houd daar rekening mee als je beperkt mobiel bent.'
    });
  }

  // Children
  // Extra tip als er kinderen in het huishouden zijn
  if (profile.hasChildren) {
    personalTips.push({
      icon: '👶',
      text: '<b>Kinderen</b>. Kinderen hebben extra warmte, voeding en structuur nodig in een crisis. Zorg voor spelmateriaal en passend extra voedsel. Leg ook uit wat er gebeurt. Onzekerheid is voor hen zwaarder als ze niets weten.'
    });
  }

  // Elderly
  // Extra tip als er ouderen in het huishouden zijn (hypothermierisico)
  if (profile.hasElderly) {
    personalTips.push({
      icon: '👴',
      text: '<b>Ouderen in huis</b>. Ouderen koelen sneller af en zijn gevoeliger voor hypothermie. Houd één kamer zo warm mogelijk en let op tekenen van onderkoeling, zoals rillen, verwardheid en slaperigheid.'
    });
  }

  // Medical needs
  // Tip over gekoelde medicijnen en extra voorraad
  if (profile.hasMedNeeds) {
    personalTips.push({
      icon: '💊',
      text: '<b>Medicijnen</b>. Sommige medicijnen moeten gekoeld blijven, zoals insuline en biologicals. Zorg voor een koeltasje met ijspacks als back-up. Houd ook een week extra medicijnen op voorraad voor noodgevallen.'
    });
  }

  // Pets
  // Tip over noodvoorraden en stressignalen voor huisdieren
  if (profile.hasPets) {
    personalTips.push({
      icon: '🐾',
      text: '<b>Huisdieren</b>. Huisdieren hebben ook noodvoorraden nodig: voer voor minimaal 3 dagen, water en een transportmand klaar bij de deur. Let op stresssignalen bij je huisdier.'
    });
  }

  // No car
  // Waarschuwing voor spelers zonder auto: meer afhankelijkheid van fiets of eigen benen
  if (!profile.hasCar) {
    personalTips.push({
      icon: '🚲',
      text: '<b>Geen auto</b>. Zonder auto ben je afhankelijk van je fiets of van lopen. Zorg dat je weet waar de dichtstbijzijnde voedseluitdelingspunten, noodopvang en hulpposten zijn.'
    });
  }

  // Radio
  // Tip over de onmisbaarheid van een batterijradio bij stroomuitval
  if (!profile.hasRadio) {
    personalTips.push({
      icon: '📻',
      text: '<b>Geen batterijradio</b>. In dit scenario was de AM-radio na dag 1 de enige betrouwbare informatiebron. Een batterijradio of handslingerradio kost ongeveer €20 tot €40 en is onmisbaar bij stroomuitval.'
    });
  }

  // Cash
  // Tip alleen tonen als de speler zowel voor als tijdens de crisis geen contant geld had
  if (!profile.hasCash && !state.hasCash) {
    personalTips.push({
      icon: '💵',
      text: '<b>Geen contant geld</b>. Zowel voor als tijdens de crisis had je geen contant geld. Leg thuis altijd €100 tot €200 in biljetten klaar op een vaste, veilige plek.'
    });
  }

  // Kit
  // Tip over het aanleggen van een compleet noodpakket (denkvooruit.nl)
  if (!profile.hasKit) {
    personalTips.push({
      icon: '🎒',
      text: '<b>Geen noodpakket</b>. Je hebt geen noodpakket thuis. Denk Vooruit adviseert: water (3 liter per persoon per dag), noodvoorraad voor 3 dagen, zaklamp, batterijen, EHBO-doos, contant geld en een batterij-radio. In één rugzak bij elkaar in een uur. Meer info: <b>denkvooruit.nl</b>'
    });
  }

  // Powerbank
  // Tip over het belang van een opgeladen powerbank als communicatiemiddel
  if (!profile.hasPowerbank) {
    personalTips.push({
      icon: '🔋',
      text: '<b>Geen powerbank</b>. Je telefoon was je enige verbinding met de buitenwereld. Zonder powerbank was die na een dag leeg. Schaf een powerbank aan van minimaal 10.000 mAh en houd hem opgeladen.'
    });
  }

  // Generic tip always shown
  // Algemene afsluitende tip die altijd getoond wordt, ongeacht het profiel
  personalTips.push({
    icon: '⚡',
    text: '<b>Bereid je voor op 72 uur</b>. Dit scenario laat zien hoe snel je afhankelijk wordt van dingen die normaal vanzelf gaan: stroom, water, verwarming, communicatie. Een noodpakket, noodvoorraad en een noodplan helpen je de eerste 72 uur zelfstandig door te komen.'
  });

  // Render alle persoonlijke tips als kaarten
  let personalHtml = '';
  personalTips.forEach(t => {
    personalHtml += `<div class="tip-card"><div class="tip-icon">${t.icon}</div><div class="tip-text">${t.text}</div></div>`;
  });
  document.getElementById('rep-personal').innerHTML = personalHtml;

  // Stagger report sections in after screen entrance (screen takes 280ms)
  // Laat elke sectie met een kleine vertraging infaden voor een vloeiend visueel effect
  const sections = ['rep-intro', 'rep-outcome', 'rep-context', 'rep-timeline', 'rep-status', 'rep-endstats', 'rep-good', 'rep-improve', 'rep-personal'];
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.animation = 'none';         // Reset eventuele lopende animatie
      el.style.opacity = '0';              // Begin onzichtbaar
      // Pas een infade-animatie toe met oplopende vertraging per sectie (elke 80ms later)
      el.style.animation = `contentFade 280ms var(--ease-out) ${200 + i * 80}ms both`;
    }
  });
}
