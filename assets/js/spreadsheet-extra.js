/* =====================================================================
   spreadsheet-extra.js — Funcțiile „avansate” ale simulatorului
   ---------------------------------------------------------------------
   Se adaugă peste spreadsheet.js (trebuie încărcat după el):
     • Date:        sortare (pe mai multe niveluri), filtru automat,
                    filtru avansat, subtotaluri, validarea datelor
     • Inserare:    diagrame, tabele pivot
     • Formatare condiționată: reguli cu valori, text, formulă, primele N,
                    peste medie, duplicate, bare de date, scală de culori
     • Revizuire:   protejarea foii, blocarea / deblocarea celulelor
   Meniurile apar în bara de unelte. Un exercițiu poate afișa doar
   o parte din ele: opțiunea „meniuri: ['date', 'inserare']”.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const P = global.Spreadsheet.prototype;
  const { el, esc, modal, toast } = global.App;

  /* ------------------------------------------------------------------
     Utilitare
     ------------------------------------------------------------------ */
  const adr = (z) => FE.addr(z.r1, z.c1) + (z.r1 === z.r2 && z.c1 === z.c2 ? '' : ':' + FE.addr(z.r2, z.c2));
  const inZona = (z, r, c) => r >= z.r1 && r <= z.r2 && c >= z.c1 && c <= z.c2;

  // Formular într-o fereastră modală. campuri: [{id, eticheta, tip, optiuni, valoare, ajutor}]
  function formular(titlu, campuri, textOk) {
    const cont = el('div', { class: 'xl-formular' });
    const inputuri = {};
    for (const f of campuri) {
      if (f.tip === 'titlu') { cont.append(el('h4', null, f.eticheta)); continue; }
      if (f.tip === 'nota') { cont.append(el('p', { class: 'xl-nota' }, f.eticheta)); continue; }
      let inp;
      if (f.tip === 'select') {
        inp = el('select', { id: 'f-' + f.id }, f.optiuni.map(([v, t]) => el('option', { value: v }, t)));
        if (f.valoare != null) inp.value = f.valoare;
      } else if (f.tip === 'checkbox') {
        inp = el('input', { type: 'checkbox', id: 'f-' + f.id });
        inp.checked = !!f.valoare;
      } else {
        inp = el('input', { type: f.tip || 'text', id: 'f-' + f.id, value: f.valoare != null ? f.valoare : '', placeholder: f.placeholder || '', autocomplete: 'off', spellcheck: 'false' });
      }
      inputuri[f.id] = inp;
      const rand = f.tip === 'checkbox'
        ? el('label', { class: 'comutator', for: 'f-' + f.id }, inp, f.eticheta)
        : el('label', { class: 'xl-camp', for: 'f-' + f.id }, el('span', null, f.eticheta), inp);
      const bloc = el('div', { class: 'xl-bloc' }, rand, f.ajutor ? el('small', { class: 'xl-ajutor' }, f.ajutor) : null);
      if (f.ascuns) bloc.dataset.ascuns = f.ascuns;
      cont.append(bloc);
    }
    const citeste = () => {
      const o = {};
      for (const k in inputuri) o[k] = inputuri[k].type === 'checkbox' ? inputuri[k].checked : inputuri[k].value.trim();
      return o;
    };
    // câmpuri afișate doar pentru anumite valori ale altui câmp: ascuns: 'tip=lista|intreg'
    const actualizeaza = () => {
      const v = citeste();
      cont.querySelectorAll('[data-ascuns]').forEach((r) => {
        const [camp, val] = r.dataset.ascuns.split('=');
        r.style.display = val.split('|').includes(String(v[camp])) ? '' : 'none';
      });
    };
    cont.addEventListener('change', actualizeaza);
    actualizeaza();
    cont.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); cont.closest('.modal').querySelector('.btn-primar').click(); } });
    return modal(titlu, cont, [['Renunță', null], [textOk || 'OK', citeste, 'btn-primar']]);
  }

  // Zona curentă: blocul de celule completate din jurul celulei active (ca Ctrl+A în Excel)
  P.zonaCurenta = function (r, c) {
    const si = this.si, sh = this.foaie;
    const plin = (rr, cc) => rr >= 0 && cc >= 0 && rr < sh.rows && cc < sh.cols && this.wb.getInput(si, rr, cc) !== '';
    if (r == null) { r = this.sel.r; c = this.sel.c; }
    let z = { r1: r, c1: c, r2: r, c2: c };
    let schimbat = true;
    while (schimbat) {
      schimbat = false;
      const verif = (rr1, cc1, rr2, cc2) => { for (let a = rr1; a <= rr2; a++) for (let b = cc1; b <= cc2; b++) if (plin(a, b)) return true; return false; };
      if (z.r1 > 0 && verif(z.r1 - 1, Math.max(0, z.c1 - 1), z.r1 - 1, z.c2 + 1)) { z.r1--; schimbat = true; }
      if (z.r2 < sh.rows - 1 && verif(z.r2 + 1, Math.max(0, z.c1 - 1), z.r2 + 1, z.c2 + 1)) { z.r2++; schimbat = true; }
      if (z.c1 > 0 && verif(Math.max(0, z.r1 - 1), z.c1 - 1, z.r2 + 1, z.c1 - 1)) { z.c1--; schimbat = true; }
      if (z.c2 < sh.cols - 1 && verif(Math.max(0, z.r1 - 1), z.c2 + 1, z.r2 + 1, z.c2 + 1)) { z.c2++; schimbat = true; }
    }
    return z;
  };
  // Zona pentru o comandă: selecția (dacă are mai multe celule) sau zona curentă
  P.zonaComanda = function () {
    const s = this.sel;
    if (s.r1 !== s.r2 || s.c1 !== s.c2) return { r1: s.r1, c1: s.c1, r2: s.r2, c2: s.c2 };
    return this.zonaCurenta();
  };
  P.numeColoana = function (z, c, antet) {
    const t = antet ? this.wb.getDisplay(this.si, z.r1, c) : '';
    return t ? t + ' (' + FE.numToCol(c) + ')' : 'Coloana ' + FE.numToCol(c);
  };
  P.areAntet = function (z) {
    if (z.r1 === z.r2) return false;
    let text = 0, total = 0;
    for (let c = z.c1; c <= z.c2; c++) { const v = this.wb.getValue(this.si, z.r1, c); total++; if (typeof v === 'string' && v !== '') text++; }
    return text === total;
  };
  P.aplicaModificare = function (fn) {
    if (this.foaie.protejata) { this.avertizareBlocata(); return false; }
    this.salveazaIstoric();
    fn();
    this.wb.recalc();
    this.randeaza();
    this.actualizeazaSelectia();
    this.emit('change', { celule: [], wb: this.wb });
    return true;
  };

  /* ------------------------------------------------------------------
     Meniurile din bara de unelte
     ------------------------------------------------------------------ */
  P.construiesteExtra = function () {
    const meniuri = this.opts.meniuri === false ? [] : this.opts.meniuri || ['date', 'inserare', 'conditionat', 'revizuire'];
    if (this.toolbar && meniuri.length) {
      const deschide = (btn, elemente) => { const r = btn.getBoundingClientRect(); this.meniu({ clientX: r.left, clientY: r.bottom + 4 }, elemente()); };
      const buton = (text, fn) => { const b = el('button', { type: 'button', class: 'xl-meniu-btn', 'aria-haspopup': 'menu' }, text); b.addEventListener('click', () => deschide(b, fn)); return b; };
      this.toolbar.append(el('span', { class: 'sep' }));
      if (meniuri.includes('date')) this.toolbar.append(buton('Date ▾', () => this.meniuDate()));
      if (meniuri.includes('inserare')) this.toolbar.append(buton('Inserare ▾', () => [['Diagramă…', () => this.dialogDiagrama()], ['Tabel pivot…', () => this.dialogPivot()]]));
      if (meniuri.includes('conditionat')) this.toolbar.append(buton('Formatare condiționată ▾', () => [
        ['Regulă nouă…', () => this.dialogCF()], ['Gestionează regulile…', () => this.gestioneazaCF()], ['Golește regulile din selecție', () => this.golesteCF()]]));
      if (meniuri.includes('revizuire')) this.toolbar.append(buton('Revizuire ▾', () => this.meniuRevizuire()));
    }
    // panoul cu diagrame, butonul listei derulante, nivelurile subtotalurilor
    this.panouDiagrame = el('div', { class: 'xl-diagrame' });
    this.root.insertBefore(this.panouDiagrame, this.panouEroare);
    this.btnLista = el('button', { type: 'button', class: 'xl-lista-btn ascuns', 'aria-label': 'Alege din listă', title: 'Alege din listă' }, '▾');
    this.btnLista.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); this.deschideLista(); });
    this.strat.append(this.btnLista);
    this.contur = el('div', { class: 'xl-contur ascuns' });
    this.root.insertBefore(this.contur, this.scroll);
    // butoanele de filtru din antet (captură, înaintea selecției)
    this.table.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.xl-filtru-btn');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      this.popupFiltru(+b.dataset.c, b);
    }, true);
  };

  P.meniuDate = function () {
    const sh = this.foaie;
    const el2 = [
      ['Sortare A → Z (după coloana activă)', () => this.sortareRapida(false)],
      ['Sortare Z → A (după coloana activă)', () => this.sortareRapida(true)],
      ['Sortare personalizată…', () => this.dialogSortare()], '-',
      [sh.filtru ? 'Filtru automat: dezactivează' : 'Filtru automat: activează', () => this.comutaFiltru()]
    ];
    if (sh.filtruActiv || sh.filtruAvansat) el2.push(['Golește filtrele', () => this.golesteFiltrele()]);
    el2.push(['Filtru avansat…', () => this.dialogFiltruAvansat()], '-', ['Subtotal…', () => this.dialogSubtotal()]);
    if (sh.subtotal) el2.push(['Elimină toate subtotalurile', () => this.eliminaSubtotaluri()]);
    el2.push('-', ['Validarea datelor…', () => this.dialogValidare()],
      [this._cercuri ? 'Șterge cercurile de validare' : 'Încercuiește datele nevalide', () => { this._cercuri = !this._cercuri; this.randeazaValori(); }]);
    if (this.wb.sheets.some((s) => s.pivoturi && s.pivoturi.length)) el2.push('-', ['Reîmprospătează tabelele pivot', () => this.reimprospateazaPivoturi()]);
    return el2;
  };
  P.meniuRevizuire = function () {
    const sh = this.foaie;
    return [
      sh.protejata ? ['Deprotejează foaia…', () => this.deprotejeaza()] : ['Protejează foaia…', () => this.protejeaza()],
      ['Deblochează celulele selectate (vor putea fi modificate când foaia e protejată)', () => this.blocheazaCelule(false)],
      ['Blochează celulele selectate', () => this.blocheazaCelule(true)]
    ];
  };

  /* ------------------------------------------------------------------
     SORTARE
     ------------------------------------------------------------------ */
  // chei: [{c, desc}] — c este indexul coloanei
  P.sorteaza = function (z, chei, antet) {
    const si = this.si, wb = this.wb;
    const r0 = z.r1 + (antet ? 1 : 0);
    const randuri = [];
    for (let r = r0; r <= z.r2; r++) {
      const cel = [];
      for (let c = z.c1; c <= z.c2; c++) { const x = wb.cell(si, r, c); cel.push(x ? Object.assign({}, x, { ast: undefined }) : null); }
      randuri.push({ r, cel, chei: chei.map((k) => wb.getValue(si, r, k.c)) });
    }
    const cmp = (a, b) => {
      for (let i = 0; i < chei.length; i++) {
        const x = a.chei[i], y = b.chei[i];
        const gx = x === null || x === '', gy = y === null || y === '';
        if (gx || gy) { if (gx && gy) continue; return gx ? 1 : -1; }   // celulele goale mereu la final
        const k = FE.isErr(x) || FE.isErr(y) ? 0 : FE.compara(x, y);
        if (k) return chei[i].desc ? -k : k;
      }
      return a.r - b.r;   // sortare stabilă
    };
    randuri.sort(cmp);
    const sh = wb.sheets[si];
    randuri.forEach((rd, i) => {
      const r = r0 + i;
      rd.cel.forEach((x, j) => {
        const c = z.c1 + j, k = r + ',' + c;
        if (!x) { sh.cells.delete(k); return; }
        if (x.input && x.input[0] === '=') x.input = FE.deplaseaza(x.input, r - rd.r, 0);
        sh.cells.set(k, x);
      });
    });
    wb.recalc();
  };
  P.sortareRapida = function (desc) {
    const z = this.zonaCurenta();
    const antet = this.areAntet(z);
    const c = this.sel.c;
    this.aplicaModificare(() => this.sorteaza(z, [{ c, desc }], antet));
  };
  P.dialogSortare = async function () {
    const z = this.zonaComanda();
    const antet = this.areAntet(z);
    const col = [['', '(fără)']];
    for (let c = z.c1; c <= z.c2; c++) col.push([String(c), this.numeColoana(z, c, antet)]);
    const ord = [['asc', 'A → Z / crescător'], ['desc', 'Z → A / descrescător']];
    const v = await formular('Sortare personalizată', [
      { tip: 'nota', eticheta: 'Zona sortată: ' + adr(z) + '. Rândurile se mută întregi, ca datele să rămână împreună.' },
      { id: 'antet', tip: 'checkbox', eticheta: 'Datele mele au antet (primul rând nu se sortează)', valoare: antet },
      { id: 'c1', tip: 'select', eticheta: 'Sortare după', optiuni: col.slice(1), valoare: String(this.sel.c >= z.c1 && this.sel.c <= z.c2 ? this.sel.c : z.c1) },
      { id: 'o1', tip: 'select', eticheta: 'Ordine', optiuni: ord },
      { id: 'c2', tip: 'select', eticheta: 'Apoi după', optiuni: col },
      { id: 'o2', tip: 'select', eticheta: 'Ordine', optiuni: ord },
      { id: 'c3', tip: 'select', eticheta: 'Apoi după', optiuni: col },
      { id: 'o3', tip: 'select', eticheta: 'Ordine', optiuni: ord }
    ], 'Sortează');
    if (!v) return;
    const chei = [[v.c1, v.o1], [v.c2, v.o2], [v.c3, v.o3]].filter(([c]) => c !== '').map(([c, o]) => ({ c: +c, desc: o === 'desc' }));
    this.aplicaModificare(() => this.sorteaza(z, chei, v.antet));
    this.emit('sortare', { zona: adr(z), chei });
  };

  /* ------------------------------------------------------------------
     FILTRU AUTOMAT
     ------------------------------------------------------------------ */
  P.comutaFiltru = function () {
    const sh = this.foaie;
    if (sh.filtru) { this.aplicaModificare(() => { sh.filtru = null; sh.hiddenRows.clear(); sh.filtruActiv = false; }); return; }
    const z = this.zonaCurenta();
    if (z.r1 === z.r2) { this.arataMesaj('Selectează o celulă din tabelul cu date (cu antet) și încearcă din nou.'); return; }
    this.aplicaModificare(() => { sh.filtru = { r1: z.r1, c1: z.c1, r2: z.r2, c2: z.c2, criterii: {} }; });
  };
  P.golesteFiltrele = function () {
    const sh = this.foaie;
    this.aplicaModificare(() => { if (sh.filtru) sh.filtru.criterii = {}; sh.hiddenRows.clear(); sh.filtruActiv = false; sh.filtruAvansat = false; });
  };
  function potrivesteConditie(v, afisat, crit) {
    if (crit.valori && !crit.valori.includes(afisat)) return false;
    if (crit.op && crit.v !== '') {
      let f;
      if (crit.op === 'incepe') f = FE.criteriu(crit.v + '*');
      else if (crit.op === 'contine') f = FE.criteriu('*' + crit.v + '*');
      else if (crit.op === 'nu-contine') { const g = FE.criteriu('*' + crit.v + '*'); f = (x) => !g(x); }
      else f = FE.criteriu(crit.op + crit.v);
      if (!f(v)) return false;
    }
    return true;
  }
  P.aplicaFiltru = function () {
    const sh = this.foaie, f = sh.filtru;
    sh.hiddenRows.clear();
    if (!f) return;
    const crit = Object.entries(f.criterii);
    for (let r = f.r1 + 1; r <= f.r2; r++) {
      const ok = crit.every(([c, cr]) => potrivesteConditie(this.wb.getValue(this.si, r, +c), this.wb.getDisplay(this.si, r, +c), cr));
      if (!ok) sh.hiddenRows.add(r);
    }
    sh.filtruActiv = crit.length > 0;
  };
  P.popupFiltru = function (c, btn) {
    this.inchidePopup();
    const sh = this.foaie, f = sh.filtru, si = this.si;
    const crit = f.criterii[c] || {};
    const valori = [...new Set([...Array(f.r2 - f.r1).keys()].map((i) => this.wb.getDisplay(si, f.r1 + 1 + i, c)))]
      .sort((a, b) => FE.compara(FE.literal(a).v ?? '', FE.literal(b).v ?? ''));
    const pop = el('div', { class: 'xl-popup', role: 'dialog', 'aria-label': 'Filtru pentru ' + this.numeColoana(f, c, true) });
    pop.append(el('div', { class: 'rand-butoane' },
      el('button', { class: 'btn btn-mic', type: 'button', onclick: () => { this.inchidePopup(); this.aplicaModificare(() => this.sorteaza(f, [{ c, desc: false }], true)); } }, 'Sortare A → Z'),
      el('button', { class: 'btn btn-mic', type: 'button', onclick: () => { this.inchidePopup(); this.aplicaModificare(() => this.sorteaza(f, [{ c, desc: true }], true)); } }, 'Z → A')));
    const lista = el('div', { class: 'xl-popup-lista' });
    const toate = el('input', { type: 'checkbox' }); toate.checked = !crit.valori;
    lista.append(el('label', null, toate, el('b', null, '(Selectează tot)')));
    const bife = valori.map((v) => {
      const b = el('input', { type: 'checkbox', value: v }); b.checked = !crit.valori || crit.valori.includes(v);
      lista.append(el('label', null, b, v === '' ? '(Goale)' : v));
      return b;
    });
    toate.addEventListener('change', () => bife.forEach((b) => { b.checked = toate.checked; }));
    pop.append(lista);
    const op = el('select', { 'aria-label': 'Condiție' }, [['', '— fără condiție —'], ['=', 'este egal cu'], ['<>', 'nu este egal cu'], ['>', 'mai mare decât'], ['>=', 'mai mare sau egal cu'],
      ['<', 'mai mic decât'], ['<=', 'mai mic sau egal cu'], ['incepe', 'începe cu'], ['contine', 'conține'], ['nu-contine', 'nu conține']].map(([v, t]) => el('option', { value: v }, t)));
    op.value = crit.op || '';
    const val = el('input', { type: 'text', value: crit.v || '', 'aria-label': 'Valoare', placeholder: 'valoare' });
    pop.append(el('p', { class: 'eticheta', style: 'margin:8px 0 4px' }, 'Filtru după condiție'), el('div', { class: 'rand-butoane' }, op, val));
    pop.append(el('div', { class: 'rand-butoane', style: 'margin-top:10px;justify-content:flex-end' },
      el('button', { class: 'btn btn-mic', type: 'button', onclick: () => { this.inchidePopup(); this.aplicaModificare(() => { delete f.criterii[c]; this.aplicaFiltru(); }); } }, 'Golește'),
      el('button', { class: 'btn btn-mic btn-primar', type: 'button', onclick: () => {
        const alese = bife.filter((b) => b.checked).map((b) => b.value);
        const cr = {};
        if (alese.length < bife.length) cr.valori = alese;
        if (op.value && val.value.trim() !== '') { cr.op = op.value; cr.v = val.value.trim(); }
        this.inchidePopup();
        this.aplicaModificare(() => { if (Object.keys(cr).length) f.criterii[c] = cr; else delete f.criterii[c]; this.aplicaFiltru(); });
        this.emit('filtru', { c, criteriu: cr });
      } }, 'OK')));
    document.body.append(pop);
    const r = btn.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pop.offsetWidth - 8)) + 'px';
    pop.style.top = Math.min(r.bottom + 4, innerHeight - pop.offsetHeight - 8) + 'px';
    this.popup = pop;
    setTimeout(() => document.addEventListener('pointerdown', this._inchidePopup = (e) => { if (!pop.contains(e.target)) this.inchidePopup(); }), 0);
  };
  P.inchidePopup = function () {
    if (this.popup) { this.popup.remove(); this.popup = null; document.removeEventListener('pointerdown', this._inchidePopup); }
  };

  /* ------------------------------------------------------------------
     FILTRU AVANSAT
     ------------------------------------------------------------------ */
  P.dialogFiltruAvansat = async function () {
    const z = this.zonaCurenta();
    const v = await formular('Filtru avansat', [
      { tip: 'nota', eticheta: 'Zona de criterii are pe primul rând aceleași antete ca lista. Condițiile de pe același rând trebuie îndeplinite toate (ȘI); rândurile diferite sunt alternative (SAU).' },
      { id: 'lista', eticheta: 'Zona listei', valoare: adr(z) },
      { id: 'criterii', eticheta: 'Zona de criterii', placeholder: 'de ex. H1:I2' },
      { id: 'actiune', tip: 'select', eticheta: 'Acțiune', optiuni: [['loc', 'Filtrează lista pe loc'], ['copiere', 'Copiază în altă locație']] },
      { id: 'dest', eticheta: 'Copiază în (celula din stânga-sus)', placeholder: 'de ex. H5', ascuns: 'actiune=copiere' }
    ], 'Aplică');
    if (!v) return;
    const L = FE.parseRangeAddr(v.lista), C = FE.parseRangeAddr(v.criterii);
    if (!L || !C) { this.arataMesaj('Zona listei sau zona de criterii nu este validă.'); return; }
    const m = this.filtruAvansat(L, C, v.actiune === 'copiere' ? v.dest : null);
    if (m) this.arataMesaj(esc(m));
  };
  // Întoarce un mesaj de eroare sau null
  P.filtruAvansat = function (L, C, dest) {
    const si = this.si, wb = this.wb;
    const antete = {};
    for (let c = L.c1; c <= L.c2; c++) antete[String(wb.getDisplay(si, L.r1, c)).trim().toLowerCase()] = c;
    const randuriCrit = [];
    for (let r = C.r1 + 1; r <= C.r2; r++) {
      const cond = [];
      for (let c = C.c1; c <= C.c2; c++) {
        const inp = wb.getInput(si, r, c);
        if (inp === '') continue;
        const numeAntet = String(wb.getDisplay(si, C.r1, c)).trim().toLowerCase();
        if (!(numeAntet in antete)) return 'Antetul „' + wb.getDisplay(si, C.r1, c) + '” din zona de criterii nu există în listă.';
        // „>=8”, „Brăila”, „=Brăila” sau o formulă care produce criteriul (de ex. =">="&H1)
        let crit = inp;
        if (inp[0] === '=' && !FE.verificaSintaxa(inp)) { const v = wb.getValue(si, r, c); if (!FE.isErr(v)) crit = v; }
        cond.push([antete[numeAntet], FE.criteriu(crit)]);
      }
      randuriCrit.push(cond);
    }
    const potriviri = [];
    for (let r = L.r1 + 1; r <= L.r2; r++) {
      const ok = randuriCrit.length === 0 || randuriCrit.some((cond) => cond.every(([c, f]) => f(wb.getValue(si, r, c))));
      if (ok) potriviri.push(r);
    }
    if (!dest) {
      this.aplicaModificare(() => {
        const sh = this.foaie;
        sh.hiddenRows.clear();
        for (let r = L.r1 + 1; r <= L.r2; r++) if (!potriviri.includes(r)) sh.hiddenRows.add(r);
        sh.filtruAvansat = true; sh.filtruActiv = true;
      });
      return null;
    }
    const d = FE.parseAddr(dest);
    if (!d) return 'Celula de destinație nu este validă.';
    this.aplicaModificare(() => {
      const copiazaRand = (rs, rd) => {
        for (let c = L.c1; c <= L.c2; c++) {
          const x = wb.cell(si, rs, c);
          const v = wb.getValue(si, rs, c);
          const inp = x && x.input && x.input[0] === '=' ? (v === null ? '' : FE.isErr(v) ? v.code : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v)) : x ? x.input : '';
          const cl = wb.cell(si, rd, d.c + c - L.c1, true);
          cl.input = inp; cl.ast = undefined; cl.fmt = x && x.fmt; cl.bold = x && x.bold;
        }
      };
      copiazaRand(L.r1, d.r);
      potriviri.forEach((r, i) => copiazaRand(r, d.r + 1 + i));
      const sh = this.foaie;
      sh.rows = Math.max(sh.rows, d.r + potriviri.length + 2);
      sh.cols = Math.max(sh.cols, d.c + (L.c2 - L.c1) + 1);
    });
    this.emit('filtru', { avansat: true, potriviri: potriviri.length });
    return null;
  };

  /* ------------------------------------------------------------------
     SUBTOTALURI
     ------------------------------------------------------------------ */
  const FUNCTII_SUBTOTAL = [['9', 'Sumă'], ['3', 'Numărare'], ['1', 'Medie'], ['4', 'Maxim'], ['5', 'Minim']];
  P.dialogSubtotal = async function () {
    const z = this.zonaCurenta();
    if (!this.areAntet(z)) { this.arataMesaj('Subtotalurile au nevoie de un tabel cu antet. Selectează o celulă din tabel.'); return; }
    const col = []; for (let c = z.c1; c <= z.c2; c++) col.push([String(c), this.numeColoana(z, c, true)]);
    const campuri = [
      { tip: 'nota', eticheta: 'Important: sortează mai întâi tabelul după coloana de grupare, altfel grupurile se repetă.' },
      { id: 'grup', tip: 'select', eticheta: 'La fiecare schimbare în', optiuni: col, valoare: String(z.c1) },
      { id: 'fn', tip: 'select', eticheta: 'Se utilizează funcția', optiuni: FUNCTII_SUBTOTAL },
      { tip: 'titlu', eticheta: 'Adaugă subtotal la' }
    ];
    for (let c = z.c1; c <= z.c2; c++) {
      const v = this.wb.getValue(this.si, z.r1 + 1, c);
      campuri.push({ id: 'c' + c, tip: 'checkbox', eticheta: this.numeColoana(z, c, true), valoare: typeof v === 'number' && c === z.c2 });
    }
    const v = await formular('Subtotal', campuri, 'Aplică');
    if (!v) return;
    const coloane = []; for (let c = z.c1; c <= z.c2; c++) if (v['c' + c]) coloane.push(c);
    if (!coloane.length) { this.arataMesaj('Bifează cel puțin o coloană la care se adaugă subtotalul.'); return; }
    this.subtotaluri(z, +v.grup, +v.fn, coloane);
  };
  P.subtotaluri = function (z, cGrup, fn, coloane) {
    if (this.foaie.subtotal) this.eliminaSubtotaluri(true);
    const si = this.si, wb = this.wb;
    const grupuri = [];
    for (let r = z.r1 + 1; r <= z.r2; r++) {
      const k = wb.getDisplay(si, r, cGrup);
      if (!grupuri.length || grupuri[grupuri.length - 1].cheie !== k) grupuri.push({ cheie: k, randuri: [] });
      grupuri[grupuri.length - 1].randuri.push(r);
    }
    const numeFn = { 9: 'Total', 3: 'Număr', 1: 'Medie', 4: 'Maxim', 5: 'Minim' }[fn];
    this.aplicaModificare(() => {
      const sh = wb.sheets[si];
      const vechi = new Map();
      for (let r = z.r1 + 1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) { const x = wb.cell(si, r, c); if (x) vechi.set(r + ',' + c, Object.assign({}, x, { ast: undefined })); }
      const n = grupuri.length + 1;
      wb.modificaStructura(si, 'r', z.r2 + 1, n);   // face loc pentru rândurile noi
      for (let r = z.r1 + 1; r <= z.r2 + n; r++) for (let c = z.c1; c <= z.c2; c++) sh.cells.delete(r + ',' + c);
      let r = z.r1 + 1;
      const totaluri = [];
      grupuri.forEach((g) => {
        const start = r;
        g.randuri.forEach((ro) => {
          for (let c = z.c1; c <= z.c2; c++) {
            const x = vechi.get(ro + ',' + c); if (!x) continue;
            if (x.input && x.input[0] === '=') x.input = FE.deplaseaza(x.input, r - ro, 0);
            sh.cells.set(r + ',' + c, x);
          }
          r++;
        });
        const t = wb.cell(si, r, cGrup, true); t.input = g.cheie + ' ' + numeFn; t.bold = true;
        coloane.forEach((c) => { const x = wb.cell(si, r, c, true); x.input = '=SUBTOTAL(' + fn + ',' + FE.addr(start, c) + ':' + FE.addr(r - 1, c) + ')'; x.bold = true; x.fmt = (vechi.get(g.randuri[0] + ',' + c) || {}).fmt; });
        totaluri.push(r);
        r++;
      });
      const t = wb.cell(si, r, cGrup, true); t.input = numeFn + ' general'; t.bold = true;
      coloane.forEach((c) => { const x = wb.cell(si, r, c, true); x.input = '=SUBTOTAL(' + fn + ',' + FE.addr(z.r1 + 1, c) + ':' + FE.addr(r - 1, c) + ')'; x.bold = true; x.fmt = (vechi.get(grupuri[0].randuri[0] + ',' + c) || {}).fmt; });
      sh.subtotal = { r1: z.r1, c1: z.c1, c2: z.c2, totaluri, general: r, nivel: 3 };
    });
    this.emit('subtotal', { grupuri: grupuri.length });
  };
  P.eliminaSubtotaluri = function (faraRandare) {
    const sh = this.foaie, st = sh.subtotal;
    if (!st) return;
    const f = () => {
      [...st.totaluri, st.general].sort((a, b) => b - a).forEach((r) => this.wb.modificaStructura(this.si, 'r', r, -1));
      sh.subtotal = null; sh.hiddenRows.clear();
    };
    if (faraRandare) f(); else this.aplicaModificare(f);
  };
  P.nivelSubtotal = function (n) {
    const sh = this.foaie, st = sh.subtotal;
    if (!st) return;
    sh.hiddenRows.clear();
    const tot = new Set(st.totaluri);
    for (let r = st.r1 + 1; r < st.general; r++) {
      if (n === 1 || (n === 2 && !tot.has(r))) sh.hiddenRows.add(r);
    }
    st.nivel = n;
    this.randeaza();
    this.actualizeazaSelectia();
  };

  /* ------------------------------------------------------------------
     TABELE PIVOT
     ------------------------------------------------------------------ */
  const FUNCTII_PIVOT = [['sum', 'Sumă'], ['count', 'Numărare'], ['avg', 'Medie'], ['max', 'Maxim'], ['min', 'Minim']];
  const NUME_PIVOT = { sum: 'Suma de', count: 'Număr de', avg: 'Medie de', max: 'Max de', min: 'Min de' };
  P.dialogPivot = async function () {
    const z = this.zonaCurenta();
    if (!this.areAntet(z)) { this.arataMesaj('Tabelul pivot are nevoie de date cu antet. Selectează o celulă din tabel.'); return; }
    const col = []; for (let c = z.c1; c <= z.c2; c++) col.push([String(c), this.wb.getDisplay(this.si, z.r1, c)]);
    const v = await formular('Tabel pivot', [
      { tip: 'nota', eticheta: 'Sursa: ' + this.foaie.name + '!' + adr(z) + '. Tabelul pivot grupează rândurile după o coloană și calculează un rezumat.' },
      { id: 'randuri', tip: 'select', eticheta: 'Rânduri (grupează după)', optiuni: col, valoare: String(z.c1) },
      { id: 'coloane', tip: 'select', eticheta: 'Coloane (opțional)', optiuni: [['', '(niciuna)'], ...col] },
      { id: 'valori', tip: 'select', eticheta: 'Valori (ce se calculează)', optiuni: col, valoare: String(z.c2) },
      { id: 'fn', tip: 'select', eticheta: 'Rezumă valorile prin', optiuni: FUNCTII_PIVOT },
      { id: 'unde', tip: 'select', eticheta: 'Unde se pune tabelul', optiuni: [['nou', 'Foaie nouă'], ['aici', 'Foaia curentă, de la celula…']] },
      { id: 'celula', eticheta: 'Celula', placeholder: 'de ex. H2', ascuns: 'unde=aici' }
    ], 'Creează');
    if (!v) return;
    const def = { sursa: { foaie: this.foaie.name, zona: adr(z) }, randuri: +v.randuri, coloane: v.coloane === '' ? null : +v.coloane, valori: +v.valori, fn: v.fn };
    if (v.unde === 'aici') {
      const d = FE.parseAddr(v.celula);
      if (!d) { this.arataMesaj('Celula de destinație nu este validă.'); return; }
      def.dest = { foaie: this.foaie.name, r: d.r, c: d.c };
    } else {
      let k = 1; while (this.wb.sheetIndex('Pivot' + k) >= 0) k++;
      def.dest = { foaie: 'Pivot' + k, r: 2, c: 0, noua: true };
    }
    this.creeazaPivot(def);
  };
  function calculeazaPivot(wb, def) {
    const si = wb.sheetIndex(def.sursa.foaie);
    const z = FE.parseRangeAddr(def.sursa.zona);
    const ordine = (a, b) => { const x = FE.literal(a).v, y = FE.literal(b).v; return FE.compara(x == null ? '' : x, y == null ? '' : y); };
    const rk = new Set(), ck = new Set(), grup = new Map();
    for (let r = z.r1 + 1; r <= z.r2; r++) {
      const a = wb.getDisplay(si, r, def.randuri), b = def.coloane == null ? '' : wb.getDisplay(si, r, def.coloane);
      if (a === '') continue;
      rk.add(a); ck.add(b);
      const v = wb.getValue(si, r, def.valori);
      for (const k of [a + '\u0001' + b, a + '\u0001*', '*\u0001' + b, '*\u0001*']) { if (!grup.has(k)) grup.set(k, []); grup.get(k).push(v); }
    }
    const ag = (l) => {
      if (!l) return null;
      const n = l.filter((x) => typeof x === 'number');
      switch (def.fn) {
        case 'count': return l.filter((x) => x !== null && x !== '').length;
        case 'avg': return n.length ? n.reduce((s, x) => s + x, 0) / n.length : null;
        case 'max': return n.length ? Math.max(...n) : null;
        case 'min': return n.length ? Math.min(...n) : null;
        default: return n.reduce((s, x) => s + x, 0);
      }
    };
    return { randuri: [...rk].sort(ordine), coloane: [...ck].sort(ordine), val: (a, b) => ag(grup.get(a + '\u0001' + b)),
      numeValori: NUME_PIVOT[def.fn] + ' ' + wb.getDisplay(si, z.r1, def.valori), numeRand: wb.getDisplay(si, z.r1, def.randuri),
      numeCol: def.coloane == null ? '' : wb.getDisplay(si, z.r1, def.coloane) };
  }
  P.creeazaPivot = function (def) {
    this.aplicaModificare(() => {
      let di = this.wb.sheetIndex(def.dest.foaie);
      if (di < 0) di = this.wb.addSheet({ name: def.dest.foaie, rows: 20, cols: 8 });
      this.wb.sheets[di].pivoturi.push(def);
      scriePivot(this.wb, di, def);
      if (di !== this.si) { this.si = di; this.sel = { r: def.dest.r, c: def.dest.c, r1: def.dest.r, c1: def.dest.c, r2: def.dest.r, c2: def.dest.c }; }
    });
    this.randeazaTaburi();
    this.emit('pivot', def);
  };
  function scriePivot(wb, di, def) {
    const P2 = calculeazaPivot(wb, def);
    const sh = wb.sheets[di];
    // șterge vechiul tabel
    if (def.dim) for (let r = 0; r < def.dim.r; r++) for (let c = 0; c < def.dim.c; c++) sh.cells.delete((def.dest.r + r) + ',' + (def.dest.c + c));
    const scrie = (r, c, v, stil) => {
      const x = wb.cell(di, def.dest.r + r, def.dest.c + c, true);
      x.input = v === null || v === undefined ? '' : typeof v === 'number' ? String(+v.toFixed(10)) : String(v).replace(/^([=+\-@])/, "'$1");
      x.ast = undefined;
      x.bold = !!(stil && stil.bold); x.fill = !!(stil && stil.fill);
    };
    const cuCol = def.coloane != null;
    const cols = cuCol ? P2.coloane : [];
    let r = 0;
    if (cuCol) { scrie(0, 0, P2.numeValori, { bold: true, fill: true }); scrie(0, 1, 'Etichete de coloane', { bold: true, fill: true }); r = 1; }
    scrie(r, 0, 'Etichete de rânduri', { bold: true, fill: true });
    if (cuCol) { cols.forEach((k, j) => scrie(r, 1 + j, k === '' ? '(necompletat)' : k, { bold: true, fill: true })); scrie(r, 1 + cols.length, 'Total general', { bold: true, fill: true }); }
    else scrie(r, 1, P2.numeValori, { bold: true, fill: true });
    P2.randuri.forEach((a, i) => {
      scrie(r + 1 + i, 0, a);
      if (cuCol) { cols.forEach((b, j) => scrie(r + 1 + i, 1 + j, P2.val(a, b))); scrie(r + 1 + i, 1 + cols.length, P2.val(a, '*'), { bold: true }); }
      else scrie(r + 1 + i, 1, P2.val(a, '*'));
    });
    const rt = r + 1 + P2.randuri.length;
    scrie(rt, 0, 'Total general', { bold: true, fill: true });
    if (cuCol) { cols.forEach((b, j) => scrie(rt, 1 + j, P2.val('*', b), { bold: true, fill: true })); scrie(rt, 1 + cols.length, P2.val('*', '*'), { bold: true, fill: true }); }
    else scrie(rt, 1, P2.val('*', '*'), { bold: true, fill: true });
    def.dim = { r: rt + 1, c: cuCol ? cols.length + 2 : 2 };
    sh.rows = Math.max(sh.rows, def.dest.r + def.dim.r + 1);
    sh.cols = Math.max(sh.cols, def.dest.c + def.dim.c);
    if ((sh.widths[FE.numToCol(def.dest.c)] || 0) < 150) sh.widths[FE.numToCol(def.dest.c)] = 150;
    wb.recalc();
  }
  P.reimprospateazaPivoturi = function () {
    this.aplicaModificare(() => this.wb.sheets.forEach((s, di) => (s.pivoturi || []).forEach((def) => scriePivot(this.wb, di, def))));
    toast('Tabelele pivot au fost reîmprospătate.');
  };

  /* ------------------------------------------------------------------
     FORMATARE CONDIȚIONATĂ
     ------------------------------------------------------------------ */
  const STILURI_CF = {
    rosu: { background: '#ffc7ce', color: '#9c0006' },
    verde: { background: '#c6efce', color: '#006100' },
    galben: { background: '#ffeb9c', color: '#9c5700' },
    albastru: { background: '#dbe6ff', color: '#1f3a93' },
    'text-rosu': { color: '#c00000', fontWeight: '700' },
    'text-verde': { color: '#00803c', fontWeight: '700' }
  };
  const NUME_STIL = [['rosu', 'Umplere roșu deschis, text roșu închis'], ['verde', 'Umplere verde, text verde închis'], ['galben', 'Umplere galbenă, text maro'],
    ['albastru', 'Umplere albastră'], ['text-rosu', 'Doar text roșu aldin'], ['text-verde', 'Doar text verde aldin']];
  const TIPURI_CF = [['mai-mare', 'Mai mare decât'], ['mai-mic', 'Mai mic decât'], ['intre', 'Între'], ['egal', 'Egal cu'], ['text', 'Text care conține'],
    ['formula', 'Folosește o formulă pentru a determina celulele'], ['top', 'Primele N valori'], ['jos', 'Ultimele N valori'],
    ['peste-medie', 'Peste medie'], ['sub-medie', 'Sub medie'], ['duplicate', 'Valori duplicate'], ['bare', 'Bare de date'], ['scala', 'Scală de culori (roșu–galben–verde)']];
  P.dialogCF = async function () {
    const s = this.sel;
    const z = s.r1 === s.r2 && s.c1 === s.c2 ? this.zonaCurenta() : s;
    const v = await formular('Regulă nouă de formatare condiționată', [
      { id: 'zona', eticheta: 'Se aplică la', valoare: adr(z) },
      { id: 'tip', tip: 'select', eticheta: 'Tipul regulii', optiuni: TIPURI_CF },
      { id: 'v1', eticheta: 'Valoare', ascuns: 'tip=mai-mare|mai-mic|intre|egal|text', ajutor: 'Poți scrie și o referință, de ex. =$H$1' },
      { id: 'v2', eticheta: 'și', ascuns: 'tip=intre' },
      { id: 'n', tip: 'number', eticheta: 'N', valoare: '3', ascuns: 'tip=top|jos' },
      { id: 'formula', eticheta: 'Formula (pentru prima celulă din zonă)', placeholder: '=$C2>=9', ascuns: 'tip=formula', ajutor: 'Scrie formula ca pentru colțul stânga-sus al zonei. Pune $ la coloană pentru a colora tot rândul.' },
      { id: 'stil', tip: 'select', eticheta: 'Formatare', optiuni: NUME_STIL, ascuns: 'tip=mai-mare|mai-mic|intre|egal|text|formula|top|jos|peste-medie|sub-medie|duplicate' }
    ], 'Adaugă regula');
    if (!v) return;
    if (!FE.parseRangeAddr(v.zona)) { this.arataMesaj('Zona nu este validă.'); return; }
    if (v.tip === 'formula') {
      const f = v.formula.startsWith('=') ? v.formula : '=' + v.formula;
      const e = FE.verificaSintaxa(f);
      if (e) { this.arataMesaj('Formula nu este corectă: ' + esc(e.mesaj)); return; }
      v.formula = f;
    }
    const regula = { zona: v.zona.toUpperCase(), tip: v.tip, stil: v.stil };
    if (v.v1) regula.v1 = v.v1; if (v.v2) regula.v2 = v.v2;
    if (v.tip === 'top' || v.tip === 'jos') regula.n = Math.max(1, parseInt(v.n, 10) || 3);
    if (v.tip === 'formula') regula.formula = v.formula;
    this.aplicaModificare(() => this.foaie.cf.push(regula));
    this.emit('cf', regula);
  };
  P.gestioneazaCF = function () {
    const sh = this.foaie;
    const cont = el('div');
    const desen = () => {
      cont.replaceChildren();
      if (!sh.cf.length) { cont.append(el('p', null, 'Foaia nu are reguli de formatare condiționată.')); return; }
      sh.cf.forEach((r, i) => {
        const t = (TIPURI_CF.find((x) => x[0] === r.tip) || [0, r.tip])[1];
        const desc = r.tip === 'formula' ? r.formula : r.tip === 'intre' ? r.v1 + ' și ' + r.v2 : r.v1 || (r.n ? 'N = ' + r.n : '');
        cont.append(el('div', { class: 'rand-butoane', style: 'justify-content:space-between;border-bottom:1px solid var(--linie);padding:6px 0' },
          el('span', null, el('b', null, r.zona), ' · ' + t + (desc ? ': ' + desc : '')),
          el('button', { class: 'btn btn-mic btn-rosu', type: 'button', onclick: () => { this.aplicaModificare(() => sh.cf.splice(i, 1)); desen(); } }, 'Șterge')));
      });
    };
    desen();
    modal('Regulile de formatare condiționată', cont, [['Închide', null]]);
  };
  P.golesteCF = function () {
    const s = this.sel, sh = this.foaie;
    this.aplicaModificare(() => {
      sh.cf = sh.cf.filter((r) => { const z = FE.parseRangeAddr(r.zona); return z.r2 < s.r1 || z.r1 > s.r2 || z.c2 < s.c1 || z.c1 > s.c2; });
    });
  };
  // valoare de comparație: număr, text sau formulă (=$H$1)
  P.valoareCF = function (text, z, r, c) {
    if (text == null || text === '') return null;
    if (String(text).startsWith('=')) {
      try { return FE.evalueaza(this.wb, FE.deplaseaza(text, r - z.r1, c - z.c1), this.si, r, c); } catch (e) { return null; }
    }
    return FE.literal(text).v;
  };
  P.inainteValori = function () {
    // statistici pe zone, calculate o singură dată la fiecare desenare
    this._cfStat = new Map();
    this._valid = null;
  };
  P.statCF = function (regula) {
    if (this._cfStat.has(regula)) return this._cfStat.get(regula);
    const z = FE.parseRangeAddr(regula.zona), l = [], toate = [];
    for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) {
      const v = this.wb.getValue(this.si, r, c);
      if (typeof v === 'number') l.push(v);
      if (v !== null && v !== '') toate.push(typeof v === 'string' ? v.toLowerCase() : v);
    }
    l.sort((a, b) => a - b);
    const st = { z, l, min: l[0], max: l[l.length - 1], medie: l.length ? l.reduce((a, b) => a + b, 0) / l.length : 0, frecv: new Map() };
    toate.forEach((v) => st.frecv.set(v, (st.frecv.get(v) || 0) + 1));
    this._cfStat.set(regula, st);
    return st;
  };
  P.regulaCF = function (regula, r, c, v) {
    const st = this.statCF(regula), z = st.z;
    if (!inZona(z, r, c)) return null;
    const cmp = (a, b) => (a === null || b === null || FE.isErr(a) || FE.isErr(b) ? NaN : FE.compara(a, b));
    const num = typeof v === 'number';
    switch (regula.tip) {
      case 'mai-mare': return num && cmp(v, this.valoareCF(regula.v1, z, r, c)) > 0 ? STILURI_CF[regula.stil] : null;
      case 'mai-mic': return num && cmp(v, this.valoareCF(regula.v1, z, r, c)) < 0 ? STILURI_CF[regula.stil] : null;
      case 'egal': return v !== null && cmp(v, this.valoareCF(regula.v1, z, r, c)) === 0 ? STILURI_CF[regula.stil] : null;
      case 'intre': {
        const a = this.valoareCF(regula.v1, z, r, c), b = this.valoareCF(regula.v2, z, r, c);
        return num && cmp(v, Math.min(a, b)) >= 0 && cmp(v, Math.max(a, b)) <= 0 ? STILURI_CF[regula.stil] : null;
      }
      case 'text': return typeof v === 'string' && v.toLowerCase().includes(String(regula.v1 || '').toLowerCase()) ? STILURI_CF[regula.stil] : null;
      case 'formula': {
        let rez;
        try { rez = FE.evalueaza(this.wb, FE.deplaseaza(regula.formula, r - z.r1, c - z.c1), this.si, r, c); } catch (e) { return null; }
        const b = FE.toBool(rez);
        return b === true ? STILURI_CF[regula.stil] : null;
      }
      case 'top': return num && st.l.length && v >= st.l[Math.max(0, st.l.length - regula.n)] ? STILURI_CF[regula.stil] : null;
      case 'jos': return num && st.l.length && v <= st.l[Math.min(st.l.length - 1, regula.n - 1)] ? STILURI_CF[regula.stil] : null;
      case 'peste-medie': return num && v > st.medie ? STILURI_CF[regula.stil] : null;
      case 'sub-medie': return num && v < st.medie ? STILURI_CF[regula.stil] : null;
      case 'duplicate': return v !== null && v !== '' && st.frecv.get(typeof v === 'string' ? v.toLowerCase() : v) > 1 ? STILURI_CF[regula.stil] : null;
      case 'bare': {
        if (!num || st.max === st.min && st.max <= 0) return null;
        const p = Math.round(Math.max(0, v - Math.min(0, st.min)) / (Math.max(st.max, 0) - Math.min(0, st.min) || 1) * 100);
        return { backgroundImage: 'linear-gradient(90deg, rgba(99,142,198,.6) ' + p + '%, transparent ' + p + '%)' };
      }
      case 'scala': {
        if (!num) return null;
        const t = st.max === st.min ? 0.5 : (v - st.min) / (st.max - st.min);
        const mix = (a, b, k) => a.map((x, i) => Math.round(x + (b[i] - x) * k));
        const [R, G, B] = t < 0.5 ? mix([248, 105, 107], [255, 235, 132], t * 2) : mix([255, 235, 132], [99, 190, 123], (t - 0.5) * 2);
        return { background: 'rgb(' + R + ',' + G + ',' + B + ')', color: '#1a2230' };
      }
    }
    return null;
  };
  // Stilul final al celulei (formatare condiționată, filtru, validare)
  P.stilAvansat = function (td, r, c, v) {
    const sh = this.foaie;
    // formatarea condiționată: prima regulă are prioritate
    for (let i = sh.cf.length - 1; i >= 0; i--) {
      const st = this.regulaCF(sh.cf[i], r, c, v);
      if (st) Object.assign(td.style, st);
    }
    // butonul de filtru din antet
    const f = sh.filtru;
    if (f && r === f.r1 && c >= f.c1 && c <= f.c2) {
      td.style.position = 'relative';
      td.style.paddingRight = '22px';
      td.append(el('span', { class: 'xl-filtru-btn' + (f.criterii[c] ? ' activ' : ''), 'data-c': c, role: 'button', 'aria-label': 'Filtru pentru coloana ' + FE.numToCol(c), title: 'Filtru / sortare' }, f.criterii[c] ? '⏷' : '▾'));
    }
    // cercuri pentru datele nevalide
    if (this._cercuri && v !== null) {
      const inp = this.wb.getInput(this.si, r, c);
      if (inp !== '' && this.verificaRegula(this.regulaValidare(this.si, r, c), inp)) td.classList.add('invalid');
    }
  };
  P.dupaValori = function () {
    this.randeazaDiagrame();
    const st = this.foaie.subtotal;
    this.contur.classList.toggle('ascuns', !st);
    if (st) {
      this.contur.replaceChildren(el('span', null, 'Niveluri de grupare: '),
        ...[1, 2, 3].map((n) => el('button', { type: 'button', class: 'btn btn-mic' + (st.nivel === n ? ' btn-primar' : ''), title: ['Doar totalul general', 'Subtotalurile și totalul general', 'Toate rândurile'][n - 1], onclick: () => this.nivelSubtotal(n) }, String(n))));
    }
  };

  /* ------------------------------------------------------------------
     VALIDAREA DATELOR
     ------------------------------------------------------------------ */
  const OPERATORI = [['intre', 'între'], ['inafara', 'nu este între'], ['egal', 'egal cu'], ['diferit', 'diferit de'], ['>', 'mai mare decât'], ['<', 'mai mic decât'], ['>=', 'mai mare sau egal cu'], ['<=', 'mai mic sau egal cu']];
  P.regulaValidare = function (si, r, c) {
    const sh = this.wb.sheets[si];
    for (let i = sh.validari.length - 1; i >= 0; i--) { const z = FE.parseRangeAddr(sh.validari[i].zona); if (z && inZona(z, r, c)) return sh.validari[i]; }
    return null;
  };
  P.valoriLista = function (regula) {
    const s = String(regula.sursa || '');
    if (s.startsWith('=')) {
      const txt = s.slice(1);
      const parti = /^(?:'?(.+?)'?!)?(.+)$/.exec(txt);
      const si = parti[1] ? this.wb.sheetIndex(parti[1]) : this.si;
      const z = FE.parseRangeAddr(parti[2].replace(/\$/g, ''));
      if (!z || si < 0) return [];
      const out = [];
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) { const d = this.wb.getDisplay(si, r, c); if (d !== '') out.push(d); }
      return out;
    }
    return s.split(/[;,]/).map((x) => x.trim()).filter(Boolean);
  };
  // Întoarce true dacă textul NU respectă regula
  P.verificaRegula = function (regula, text) {
    if (!regula || text === '' || regula.tip === 'oricare') return false;
    if (regula.tip === 'lista') return !this.valoriLista(regula).some((x) => x.toLowerCase() === String(text).trim().toLowerCase());
    const L = text[0] === '=' ? { v: null } : FE.literal(text);
    let v = L.v;
    if (regula.tip === 'intreg' && !(typeof v === 'number' && Number.isInteger(v))) return true;
    if (regula.tip === 'zecimal' && typeof v !== 'number') return true;
    if (regula.tip === 'data' && !(typeof v === 'number' && L.fmt && L.fmt.type === 'date')) return true;
    if (regula.tip === 'lungime') v = String(text).length;
    const nr = (x) => { if (x === '' || x == null) return null; const l = FE.literal(String(x)); return l.v; };
    const a = nr(regula.min), b = nr(regula.max);
    switch (regula.op || 'intre') {
      case 'intre': return v < Math.min(a, b) || v > Math.max(a, b);
      case 'inafara': return v >= Math.min(a, b) && v <= Math.max(a, b);
      case 'egal': return v !== a;
      case 'diferit': return v === a;
      case '>': return !(v > a);
      case '<': return !(v < a);
      case '>=': return !(v >= a);
      case '<=': return !(v <= a);
    }
    return false;
  };
  P.verificaValidare = function (si, r, c, text) {
    const regula = this.regulaValidare(si, r, c);
    if (!this.verificaRegula(regula, text)) return null;
    const e = regula.eroare || {};
    const mesaj = { titlu: e.titlu || 'Valoare nepermisă', text: e.text || 'Valoarea introdusă nu respectă regulile de validare definite pentru această celulă.' };
    if (e.stil === 'avertisment' || e.stil === 'informare') {
      setTimeout(() => this.arataMesaj('<b>' + esc(mesaj.titlu) + ' (' + e.stil + ').</b> ' + esc(mesaj.text) + ' Valoarea a fost totuși acceptată.'), 30);
      return null;
    }
    return mesaj;
  };
  P.dupaSelectie = function () {
    if (!this.btnLista) return;
    const { r, c } = this.sel;
    const regula = this.regulaValidare(this.si, r, c);
    const lista = regula && regula.tip === 'lista' && !this.edit && this.eEditabila(r, c);
    this.btnLista.classList.toggle('ascuns', !lista);
    if (lista) {
      const d = this.dreptunghi(r, c, r, c);
      this.btnLista.style.left = (d.left + d.width + 1) + 'px';
      this.btnLista.style.top = (d.top) + 'px';
      this.btnLista.style.height = d.height + 'px';
    }
    if (regula && regula.mesajIntrare && regula.mesajIntrare.text && !this.edit) {
      this.arataMesaj('<b>' + esc(regula.mesajIntrare.titlu || '') + '</b> ' + esc(regula.mesajIntrare.text), 6000);
      this.mesaj.classList.add('info');
    } else if (this.mesaj.classList.contains('info')) { this.mesaj.classList.remove('info'); this.ascundeMesaj(); }
  };
  P.deschideLista = function () {
    const regula = this.regulaValidare(this.si, this.sel.r, this.sel.c);
    if (!regula) return;
    const b = this.btnLista.getBoundingClientRect();
    const d = this.dreptunghi(this.sel.r, this.sel.c, this.sel.r, this.sel.c);
    this.meniu({ clientX: b.right - d.width - 12, clientY: b.bottom + 2 }, this.valoriLista(regula).map((v) => [v, () => {
      const { r, c } = this.sel;
      this.salveazaIstoric();
      this.wb.setInput(this.si, r, c, v);
      this.dupaModificare([{ si: this.si, r, c }]);
      this.scroll.focus({ preventScroll: true });
    }]));
  };
  P.dialogValidare = async function () {
    const z = this.zonaComanda();
    const s = this.sel;
    const zona = s.r1 === s.r2 && s.c1 === s.c2 ? FE.addr(s.r, s.c) : adr(s);
    const ex = this.regulaValidare(this.si, s.r, s.c) || {};
    const v = await formular('Validarea datelor', [
      { id: 'zona', eticheta: 'Se aplică la', valoare: ex.zona || zona },
      { id: 'tip', tip: 'select', eticheta: 'Se permite', optiuni: [['oricare', 'Orice valoare'], ['intreg', 'Număr întreg'], ['zecimal', 'Zecimal'], ['lista', 'Listă'], ['data', 'Dată'], ['lungime', 'Lungime text']], valoare: ex.tip || 'lista' },
      { id: 'sursa', eticheta: 'Sursa listei', placeholder: 'DA,NU  sau  =$H$2:$H$6', valoare: ex.sursa || '', ascuns: 'tip=lista', ajutor: 'Valorile despărțite prin virgulă sau o zonă de celule care începe cu =.' },
      { id: 'op', tip: 'select', eticheta: 'Date', optiuni: OPERATORI, valoare: ex.op || 'intre', ascuns: 'tip=intreg|zecimal|data|lungime' },
      { id: 'min', eticheta: 'Minim / valoare', valoare: ex.min || '', ascuns: 'tip=intreg|zecimal|data|lungime' },
      { id: 'max', eticheta: 'Maxim', valoare: ex.max || '', ascuns: 'tip=intreg|zecimal|data|lungime', ajutor: 'Folosit doar pentru „între” și „nu este între”.' },
      { tip: 'titlu', eticheta: 'Mesaj de intrare (apare când se selectează celula)' },
      { id: 'mi_t', eticheta: 'Titlu', valoare: (ex.mesajIntrare || {}).titlu || '' },
      { id: 'mi_x', eticheta: 'Mesaj', valoare: (ex.mesajIntrare || {}).text || '' },
      { tip: 'titlu', eticheta: 'Avertisment de eroare (apare la o valoare greșită)' },
      { id: 'e_s', tip: 'select', eticheta: 'Stil', optiuni: [['stop', 'Stop (valoarea este refuzată)'], ['avertisment', 'Avertisment'], ['informare', 'Informare']], valoare: (ex.eroare || {}).stil || 'stop' },
      { id: 'e_t', eticheta: 'Titlu', valoare: (ex.eroare || {}).titlu || '' },
      { id: 'e_x', eticheta: 'Mesaj de eroare', valoare: (ex.eroare || {}).text || '' }
    ], 'Aplică');
    if (!v) return;
    if (!FE.parseRangeAddr(v.zona)) { this.arataMesaj('Zona nu este validă.'); return; }
    const regula = { zona: v.zona.toUpperCase(), tip: v.tip };
    if (v.tip === 'lista') regula.sursa = v.sursa;
    else if (v.tip !== 'oricare') { regula.op = v.op; regula.min = v.min; regula.max = v.max; }
    if (v.mi_t || v.mi_x) regula.mesajIntrare = { titlu: v.mi_t, text: v.mi_x };
    regula.eroare = { stil: v.e_s, titlu: v.e_t, text: v.e_x };
    this.aplicaModificare(() => {
      const sh = this.foaie;
      sh.validari = sh.validari.filter((x) => x.zona !== regula.zona);
      if (v.tip !== 'oricare') sh.validari.push(regula);
    });
    this.emit('validare', regula);
    void z;
  };

  /* ------------------------------------------------------------------
     PROTECȚIE
     ------------------------------------------------------------------ */
  P.protejeaza = async function () {
    const v = await formular('Protejează foaia', [
      { tip: 'nota', eticheta: 'Pe o foaie protejată se pot modifica doar celulele deblocate înainte (Revizuire → Deblochează celulele selectate).' },
      { id: 'parola', eticheta: 'Parolă (opțional)', tip: 'password' }
    ], 'Protejează');
    if (!v) return;
    const sh = this.foaie;
    this.salveazaIstoric();
    sh.protejata = true; sh.parola = v.parola;
    this.randeazaValori();
    this.emit('change', { celule: [], protectie: true, wb: this.wb });
    toast('Foaia „' + sh.name + '” este protejată.');
  };
  P.deprotejeaza = async function () {
    const sh = this.foaie;
    if (sh.parola) {
      const v = await formular('Deprotejează foaia', [{ id: 'parola', eticheta: 'Parola', tip: 'password' }], 'Deprotejează');
      if (!v) return;
      if (v.parola !== sh.parola) { this.arataMesaj('Parola nu este corectă.'); return; }
    }
    this.salveazaIstoric();
    sh.protejata = false;
    this.randeazaValori();
    this.emit('change', { celule: [], protectie: false, wb: this.wb });
    toast('Foaia „' + sh.name + '” nu mai este protejată.');
  };
  P.blocheazaCelule = function (blocat) {
    const sh = this.foaie, s = this.sel;
    if (sh.protejata) { this.arataMesaj('Deprotejează mai întâi foaia, apoi schimbă blocarea celulelor.'); return; }
    this.salveazaIstoric();
    for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) this.wb.cell(this.si, r, c, true).deblocata = !blocat;
    this.randeazaValori();
    this.emit('change', { celule: [], wb: this.wb });
    toast(blocat ? 'Celulele selectate sunt blocate.' : 'Celulele selectate sunt deblocate: vor putea fi modificate și pe foaia protejată.');
  };

  /* ------------------------------------------------------------------
     DIAGRAME
     ------------------------------------------------------------------ */
  P.dialogDiagrama = async function (index) {
    const sh = this.foaie;
    const ex = index != null ? sh.diagrame[index] : null;
    const z = ex ? FE.parseRangeAddr(ex.zona) : this.zonaComanda();
    const v = await formular(ex ? 'Modifică diagrama' : 'Inserare diagramă', [
      { id: 'zona', eticheta: 'Zona cu date (cu etichete)', valoare: ex ? ex.zona : adr(z), ajutor: 'Include și rândul de antet și coloana cu etichete (categoriile).' },
      { id: 'tip', tip: 'select', eticheta: 'Tipul diagramei', optiuni: Object.entries(global.Diagrame.TIPURI), valoare: ex ? ex.tip : 'coloane' },
      { id: 'titlu', eticheta: 'Titlul diagramei', valoare: ex ? ex.titlu : '' },
      { id: 'titluX', eticheta: 'Titlul axei orizontale (categorii)', valoare: ex ? ex.titluX : '' },
      { id: 'titluY', eticheta: 'Titlul axei verticale (valori)', valoare: ex ? ex.titluY : '' },
      { id: 'seriiPe', tip: 'select', eticheta: 'Seriile de date sunt pe', optiuni: [['coloane', 'coloane'], ['randuri', 'rânduri']], valoare: ex ? ex.seriiPe : 'coloane' },
      { id: 'legenda', tip: 'checkbox', eticheta: 'Afișează legenda', valoare: ex ? ex.legenda !== false : true },
      { id: 'etichete', tip: 'checkbox', eticheta: 'Afișează etichetele de date (valorile)', valoare: ex ? !!ex.etichete : false }
    ], ex ? 'Salvează' : 'Inserează');
    if (!v) return;
    if (!FE.parseRangeAddr(v.zona)) { this.arataMesaj('Zona de date nu este validă.'); return; }
    const def = Object.assign({ id: ex ? ex.id : 'd' + Date.now().toString(36) }, v, { zona: v.zona.toUpperCase() });
    this.aplicaModificare(() => { if (ex) sh.diagrame[index] = def; else sh.diagrame.push(def); });
    this.emit('diagrama', def);
  };
  P.randeazaDiagrame = function () {
    const sh = this.foaie;
    this.panouDiagrame.replaceChildren();
    if (!sh.diagrame || !sh.diagrame.length) return;
    sh.diagrame.forEach((d, i) => {
      const date = global.Diagrame.dinZona(this.wb, this.si, d.zona, d.seriiPe);
      const card = el('figure', { class: 'xl-diagrama' });
      card.innerHTML = global.Diagrame.svg(d, date);
      card.append(el('figcaption', { class: 'rand-butoane' },
        el('span', null, global.Diagrame.TIPURI[d.tip] + ' · date: ' + d.zona),
        el('button', { class: 'btn btn-mic', type: 'button', onclick: () => this.dialogDiagrama(i) }, 'Modifică'),
        el('button', { class: 'btn btn-mic btn-rosu', type: 'button', onclick: () => this.aplicaModificare(() => sh.diagrame.splice(i, 1)) }, 'Șterge')));
      this.panouDiagrame.append(card);
    });
  };
})(window);
