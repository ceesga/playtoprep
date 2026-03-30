// ═══════════════════════════════════════════════════════════════
// Prep — Noodpakket vragenlijst (Stap 1 vervolg)
// 18 vragen in 3 secties: noodpakket, reistasje, aanvullingen
// Bevat: prepQs data, renderPrep, setToggle, gotoScenariokeuze
// ═══════════════════════════════════════════════════════════════

// ─── PREP ─────────────────────────────────────────────────────────────────────
const KIT_ITEMS = ['hasWater', 'hasFood', 'hasFirstAid', 'hasFlashlight', 'hasRadio', 'hasCash'];
const PERSONAL_ITEMS = ['hasGasStove', 'hasDocuments', 'hasPowerbank'];
const EDC_ITEMS = ['hasEDCBag', 'hasEDCCash', 'hasEDCSnacks', 'hasEDCCharger', 'hasEDCWater', 'hasEDCKnife'];
const prepQs = [{
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
  id: 'hasFlashlight',
  q: 'Zaklamp',
  opts: ['Niet opgeladen', 'Ja', 'Nee'],
  def: 'nee',
  subItem: true
}, {
  id: 'hasRadio',
  q: 'Radio op batterijen',
  opts: ['Niet opgeladen', 'Ja', 'Nee'],
  def: 'nee',
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
  id: 'hasEDCReady',
  headerToggle: true,
  collapsible: true,
  section: 'Reistasje voor onderweg'
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
  id: 'hasPetFood',
  q: 'Dierenvoer voor minimaal 3 dagen',
  onlyIf: 'hasPets',
  subItem: true
}, {
  id: 'hasGasStove',
  q: 'Een gasfornuis, gasbrander of barbeque',
  subItem: true
}, {
  id: 'hasPowerbank',
  q: 'Powerbank',
  opts: ['Niet opgeladen', 'Ja', 'Nee'],
  def: 'nee',
  subItem: true
}, ];

function gotoPrep() {
  renderPrep();
  show('s-prep');
}
const prepSectionOpen = {};

function togglePrepSection(id) {
  prepSectionOpen[id] = prepSectionOpen[id] === false;
  const sec = document.getElementById(`psec-${id}`);
  const chev = document.getElementById(`chev-${id}`);
  const hdr = document.getElementById(`phdr-${id}`);
  if (sec) sec.classList.toggle('collapsed', !prepSectionOpen[id]);
  if (chev) chev.style.transform = prepSectionOpen[id] ? '' : 'rotate(-90deg)';
  if (hdr) hdr.setAttribute('aria-expanded', String(prepSectionOpen[id]));
}

function renderPrep() {
  document.getElementById('prep-prog').style.transform = 'scaleX(0.70)';
  let html = '';
  let openSection = null;
  const toVal = o => o.toLowerCase().replace(/\./g, '').replace(/ /g, '_');
  const makeBtns = (q, opts) => opts.map(o => {
    const v = toVal(o);
    const cls = o === 'Ja' ? 'tog yes' : o === 'Nee' ? 'tog no' : 'tog neutral';
    const isActive = profile[q.id] === v;
    return `<button class="${cls}${isActive?' active':''}" data-qid="${q.id}" data-val="${v}" aria-pressed="${isActive}" aria-label="${o} — ${q.q || q.section || ''}" onclick="setToggle('${q.id}','${v}')">${o}</button>`;
  }).join('');

  prepQs.filter(q => !q.onlyIf || profile[q.onlyIf]).forEach(q => {
    // Close open collapsible when hitting a new section header
    if ((q.headerToggle || q.styledHeader) && openSection) {
      html += `</div></div>`;
      openSection = null;
    }
    if (q.headerToggle || q.styledHeader) {
      const opts = q.opts || (q.headerToggle ? ['Ja', 'Nee'] : []);
      if (opts.length && !profile[q.id]) profile[q.id] = q.def || toVal(opts[1]);
      const btns = makeBtns(q, opts);
      if (q.collapsible) {
        if (prepSectionOpen[q.id] === undefined) prepSectionOpen[q.id] = false;
        const open = prepSectionOpen[q.id];
        html += `<div class="prep-section-header has-toggle prep-collapsible-header" id="phdr-${q.id}" aria-expanded="${open}" onclick="togglePrepSection('${q.id}')">
          <span class="prep-header-label"><i data-lucide="chevron-down" class="prep-chevron" id="chev-${q.id}" style="${open?'':'transform:rotate(-90deg)'}"></i>${q.section}</span>
          ${btns ? `<div class="toggle-wrap" onclick="event.stopPropagation()">${btns}</div>` : ''}
        </div>
        <div class="prep-section-body${open?'':' collapsed'}" id="psec-${q.id}"><div class="prep-section-inner">`;
        openSection = q.id;
      } else if (q.headerToggle) {
        html += `<div class="prep-section-header has-toggle"><span>${q.section}</span><div class="toggle-wrap">${btns}</div></div>`;
      } else {
        html += `<div class="prep-section-header has-toggle"><span>${q.section}</span></div>`;
      }
    } else {
      const opts = q.opts || ['Ja', 'Nee'];
      if (!profile[q.id]) profile[q.id] = q.def || toVal(opts[1]);
      if (q.section) html += `<div class="prep-section-header">${q.section}</div>`;
      const rowCls = q.subItem ? 'prep-row prep-subitem' : 'prep-row';
      html += `<div class="${rowCls}"><div class="prep-text">${q.q}</div><div class="toggle-wrap">${makeBtns(q,opts)}</div></div>`;
    }
  });
  if (openSection) html += `</div></div>`;
  document.getElementById('prep-body').innerHTML = html;
  if (window.lucide) lucide.createIcons({
    el: document.getElementById('prep-body')
  });
}

function setToggle(id, val) {
  profile[id] = val;
  document.querySelectorAll(`[data-qid="${id}"]`).forEach(btn => {
    const active = btn.dataset.val === val;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
  });
  const autoFill = {
    hasKit: KIT_ITEMS,
    hasPersonalSupplies: PERSONAL_ITEMS,
    hasEDCReady: EDC_ITEMS,
  };
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
}

function gotoScenariokeuze() {
  show('s-scenariokeuze');
  const cards = document.querySelectorAll('.scenario-pick-card');
  cards.forEach(card => {
    const onclick = card.getAttribute('onclick') || '';
    const isStroom = onclick.includes("'stroom'");
    const relevant =
      isStroom ||
      (onclick.includes("'natuurbrand'") && (profile.location.includes('forest') || profile.location.includes('rural_area'))) ||
      (onclick.includes("'overstroming'") && profile.location.includes('water'));
    card.classList.toggle('spk-relevant', relevant);
    // Stroom is altijd relevant, ongeacht omgeving — aparte stijl
    card.classList.toggle('spk-universal', isStroom);
  });
}
