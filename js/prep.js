// ═══════════════════════════════════════════════════════════════
// Prep — Noodpakket vragenlijst (Stap 1 vervolg)
// 4 secties: noodpakket, vluchttas, reistasje, aanvullingen
// Bevat: prepQs data, renderPrep, setToggle, gotoScenariokeuze
// ═══════════════════════════════════════════════════════════════

/* ─── ITEM-GROEPEN ────────────────────────────────────────────────────────────
   Deze arrays bevatten de IDs van alle sub-items per sectie.
   Ze worden gebruikt bij automatisch in- of uitvinken van kinditems
   wanneer een sectie-header op 'ja' of 'nee' wordt gezet.
*/
const KIT_ITEMS = ['hasWater', 'hasFood', 'hasFirstAid', 'hasRadio', 'hasPetFood'];
const VLUCHTTAS_ITEMS = ['hasFlashlight', 'hasCash', 'hasDocuments', 'hasMeds', 'hasBOBWater'];
const PERSONAL_ITEMS = ['hasGasStove', 'hasPowerbank'];
const EDC_ITEMS = ['hasEDCBag', 'hasEDCCash', 'hasEDCSnacks', 'hasEDCCharger', 'hasEDCWater', 'hasEDCKnife'];

/* ─── VRAGENLIJST DATA ────────────────────────────────────────────────────────
   prepQs is een array van vraag-objecten. Elk object beschrijft één rij
   in de prep-checklist. Mogelijke velden:
     id           — unieke sleutel voor profile-opslag
     q            — vraagttekst die in de UI getoond wordt
     headerToggle — true = sectieprikkel met Ja/Nee-knoppen
     collapsible  — true = sectie kan in- en uitgevouwen worden
     styledHeader — true = eenvoudige sectietitel zonder toggle-knoppen
     section      — de zichtbare sectienaam
     opts         — array van knopopties (overschrijft standaard ['Ja','Nee'])
     def          — standaardwaarde als er nog niets is gekozen
     subItem      — true = inspringing onder de sectieheader
     onlyIf       — ID in profile dat 'truthy' moet zijn om de vraag te tonen
*/
const prepQs = [{
  id: 'hasBOBBag',
  headerToggle: true,
  collapsible: true,
  section: 'Vluchttas / Bug Out Bag'
}, {
  id: 'hasFlashlight',
  q: 'Zaklamp',
  subItem: true
}, {
  id: 'hasCash',
  q: 'Contant geld',
  subItem: true
}, {
  id: 'hasDocuments',
  q: 'Kopieën van belangrijke documenten + telefoonnummers',
  subItem: true
}, {
  id: 'hasMeds',
  q: 'Medicijnen',
  opts: ['N.v.t.', 'Ja', 'Nee'],
  def: 'nvt',
  subItem: true
}, {
  id: 'hasBOBWater',
  q: 'Fles water',
  subItem: true
}, {
  id: 'hasKit',
  q: 'Noodpakket aanwezig',
  headerToggle: true,
  collapsible: true,
  section: 'Noodpakket'
}, {
  id: 'hasWater',
  q: 'Min. 6 liter drinkwater per persoon',
  subItem: true
}, {
  id: 'hasFood',
  q: 'Houdbaar eten voor minimaal 3 dagen',
  subItem: true
}, {
  id: 'hasFirstAid',
  q: 'EHBO-doos',
  subItem: true
}, {
  id: 'hasRadio',
  q: 'Radio op batterijen',
  subItem: true
}, {
  id: 'hasPetFood',
  q: 'Dierenvoer voor minimaal 3 dagen',
  onlyIf: 'hasPets',
  subItem: true
}, {
  id: 'hasEDCReady',
  headerToggle: true,
  collapsible: true,
  section: 'Reistas voor onderweg / Everyday Carry'
}, {
  id: 'hasEDCCash',
  q: 'Contant geld',
  subItem: true
}, {
  id: 'hasEDCSnacks',
  q: 'Snacks',
  subItem: true
}, {
  id: 'hasEDCCharger',
  q: 'Oplader',
  subItem: true
}, {
  id: 'hasEDCWater',
  q: 'Waterfles',
  subItem: true
}, {
  id: 'hasEDCKnife',
  q: 'Zakmes',
  subItem: true
}, {
  id: 'hasPersonalSupplies',
  styledHeader: true,
  section: 'Persoonlijke aanvullingen'
}, {
  id: 'hasGasStove',
  q: 'Een gasfornuis, gasbrander of barbeque',
  subItem: true
}, {
  id: 'hasPowerbank',
  q: 'Powerbank',
  subItem: true
}, ];

// Navigeert naar het prep-scherm en rendert de vragenlijst
function gotoPrep() {
  renderPrep();
  show('s-prep');
  if (typeof renderInventory === 'function') renderInventory();
}

// Bijhoudt welke collapsible secties open (true) of dicht (false) zijn
const prepSectionOpen = {};

// Klapt een collapsible sectie open of dicht op basis van het sectie-ID
function togglePrepSection(id) {
  // Omschakellogica: als de waarde expliciet 'false' is, wordt het true; anders false
  prepSectionOpen[id] = prepSectionOpen[id] === false;
  const sec = document.getElementById(`psec-${id}`);   // De uitklapbare inhoud
  const chev = document.getElementById(`chev-${id}`);  // Het chevron-icoon
  const hdr = document.getElementById(`phdr-${id}`);   // De klikbare header
  if (sec) sec.classList.toggle('collapsed', !prepSectionOpen[id]);
  // Roteer het chevron-icoon 90° naar links wanneer de sectie gesloten is
  if (chev) chev.style.transform = prepSectionOpen[id] ? '' : 'rotate(-90deg)';
  if (hdr) hdr.setAttribute('aria-expanded', String(prepSectionOpen[id]));
}

/* ─── RENDER PREP ─────────────────────────────────────────────────────────────
   Bouwt de volledige HTML voor de prep-vragenlijst en schrijft die naar
   #prep-body. Verwerkt drie soorten rijen:
     1. Collapsible sectieheaders (headerToggle + collapsible)
     2. Niet-collapsible sectieheaders (headerToggle of styledHeader)
     3. Gewone vragen-rijen (subItem)
*/
function renderPrep() {
  // Zet de voortgangsbalk op 70%
  document.getElementById('prep-prog').style.transform = 'scaleX(0.70)';
  let html = '';
  let openSection = null; // Houdt bij of er momenteel een open collapsible div in html staat

  // Hulpfunctie: zet een optie-label om naar een CSS-veilige waarde
  // (alles lowercase, punten weg, spaties → underscore)
  const toVal = o => o.toLowerCase().replace(/\./g, '').replace(/ /g, '_');

  // Hulpfunctie: maakt een rij toggle-knoppen voor een vraag
  // Elk knopje krijgt een CSS-klasse op basis van de optie ('yes', 'no' of 'neutral')
  const makeBtns = (q, opts) => opts.map(o => {
    const v = toVal(o);
    const cls = o === 'Ja' ? 'tog yes' : o === 'Nee' ? 'tog no' : 'tog neutral';
    const isActive = profile[q.id] === v; // Is deze knop momenteel geselecteerd?
    return `<button class="${cls}${isActive?' active':''}" data-qid="${q.id}" data-val="${v}" aria-pressed="${isActive}" aria-label="${o} — ${q.q || q.section || ''}" onclick="setToggle('${q.id}','${v}')">${o}</button>`;
  }).join('');

  // Filter vragen waarvoor de onlyIf-voorwaarde niet vervuld is
  prepQs.filter(q => !q.onlyIf || profile[q.onlyIf]).forEach(q => {
    // Sluit de vorige open collapsible sectie als er een nieuwe sectieheader verschijnt
    if ((q.headerToggle || q.styledHeader) && openSection) {
      html += `</div></div>`;
      openSection = null;
    }
    if (q.headerToggle || q.styledHeader) {
      const opts = q.opts || (q.headerToggle ? ['Ja', 'Nee'] : []);
      // Stel een standaardwaarde in als er nog geen keuze is opgeslagen
      if (opts.length && !profile[q.id]) profile[q.id] = q.def || toVal(opts[1]);
      const btns = makeBtns(q, opts);
      if (q.collapsible) {
        // Initialiseer open-staat op true als deze sectie nog niet bekend is
        if (prepSectionOpen[q.id] === undefined) prepSectionOpen[q.id] = false;
        const open = prepSectionOpen[q.id];
        // Haal het chevron SVG-icoon op uit de globale ICON_SVG-map indien beschikbaar
        const chevSvg = (typeof ICON_SVG!=='undefined'&&ICON_SVG['chevron-down'])||'';
        html += `<div class="prep-section-header has-toggle prep-collapsible-header" id="phdr-${q.id}" aria-expanded="${open}" onclick="togglePrepSection('${q.id}')">
          <span class="prep-header-label"><span class="prep-chevron" id="chev-${q.id}" style="${open?'':'transform:rotate(-90deg)'}">${chevSvg}</span>${q.section}</span>
          ${btns ? `<div class="toggle-wrap" onclick="event.stopPropagation()">${btns}</div>` : ''}
        </div>
        <div class="prep-section-body${open?'':' collapsed'}" id="psec-${q.id}"><div class="prep-section-inner">`;
        openSection = q.id; // Markeer dat er nu een open div-structuur hangt
      } else if (q.headerToggle) {
        // Niet-collapsible header met toggle-knoppen
        html += `<div class="prep-section-header has-toggle"><span>${q.section}</span><div class="toggle-wrap">${btns}</div></div>`;
      } else {
        // Eenvoudige sectietitel zonder knoppen (styledHeader)
        html += `<div class="prep-section-header has-toggle"><span>${q.section}</span></div>`;
      }
    } else {
      // Gewone vraagrij: stel standaardwaarde in en render toggle-knoppen
      const opts = q.opts || ['Ja', 'Nee'];
      if (!profile[q.id]) profile[q.id] = q.def || toVal(opts[1]);
      if (q.section) html += `<div class="prep-section-header">${q.section}</div>`;
      const rowCls = q.subItem ? 'prep-row prep-subitem' : 'prep-row';
      html += `<div class="${rowCls}"><div class="prep-text">${q.q}</div><div class="toggle-wrap">${makeBtns(q,opts)}</div></div>`;
    }
  });

  // Sluit eventuele nog openstaande collapsible sectie-div's
  if (openSection) html += `</div></div>`;
  document.getElementById('prep-body').innerHTML = html;
}

/* ─── TOGGLE HANDLER ─────────────────────────────────────────────────────────
   Verwerkt een klik op een toggle-knop:
     1. Slaat de gekozen waarde op in het profile-object
     2. Werkt de 'active'-staat van alle knoppen met hetzelfde qid bij
     3. Vult bij 'ja' alle bijbehorende kinditems automatisch in als 'ja'
     4. Vult bij 'nee' alle bijbehorende kinditems automatisch in als 'nee'
*/
function setToggle(id, val) {
  profile[id] = val;
  // Synchroniseer de visuele staat van alle knoppen die tot dezelfde vraag behoren
  document.querySelectorAll(`[data-qid="${id}"]`).forEach(btn => {
    const active = btn.dataset.val === val;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
  });

  // Koppeling van sectie-ID naar de bijbehorende kinditems
  const autoFill = {
    hasKit: KIT_ITEMS,
    hasBOBBag: VLUCHTTAS_ITEMS,
    hasPersonalSupplies: PERSONAL_ITEMS,
    hasEDCReady: EDC_ITEMS,
  };

  // Als de sectieheader op 'ja' wordt gezet, alle kinditems ook op 'ja'
  if (val === 'ja' && autoFill[id]) {
    autoFill[id].forEach(kid => {
      profile[kid] = 'ja';
      document.querySelectorAll(`[data-qid="${kid}"]`).forEach(btn => {
        const active = btn.dataset.val === 'ja';
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
      });
    });
  }
  // Als de sectieheader op 'nee' wordt gezet, alle kinditems ook op 'nee'
  if (val === 'nee' && autoFill[id]) {
    autoFill[id].forEach(kid => {
      profile[kid] = 'nee';
      document.querySelectorAll(`[data-qid="${kid}"]`).forEach(btn => {
        const active = btn.dataset.val === 'nee';
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
      });
    });
  }

  // Live indicatorupdate op basis van gewijzigde profiel-antwoorden
  if (typeof updatePrepState === 'function') updatePrepState();
}

/* ─── SCENARIOKEUZE ──────────────────────────────────────────────────────────
   Navigeert naar het scenariokeuze-scherm en markeert welke
   scenario-kaarten relevant zijn voor de locatie van de gebruiker.
   Stroomuitval is altijd relevant; overige scenario's hangen af van
   de gekozen omgeving (bos/rural voor natuurbrand, water voor overstroming).
*/
function gotoScenariokeuze() {
  // renderScenarioKeuze() in ui.js bouwt de kaarten inclusief klassen
  // op basis van profile.location — geen extra klassenlogica nodig hier.
  show('s-scenariokeuze');
}
