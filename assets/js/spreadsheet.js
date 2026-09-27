/* =====================================================================
   spreadsheet.js — Simulatorul de foaie de calcul (interfața)
   ---------------------------------------------------------------------
   Utilizare:
     const foaie = new Spreadsheet(elementContainer, {
       def: { sheets: [ { name: 'Foaie1', data: [[...]] } ] },
       inaltime: 360,          // înălțimea zonei cu celule (px)
       toolbar: true,          // bara cu B, I, formate…
       editabile: ['D2:D6'],   // (opțional) doar aceste celule pot fi modificate
       permiteFoi: true,       // adăugare / redenumire foi
       tinte: ['D2']           // (opțional) celule marcate „aici lucrezi”
     });
     foaie.on('change', (e) => …);   foaie.on('select', (e) => …);
   Scurtături: F2 editare, F4 $ (referință absolută), Ctrl+C/X/V, Ctrl+Z/Y,
               Ctrl+D umplere în jos, Ctrl+B/I, Ctrl+` arată formulele.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const LATIME_IMPLICITA = 88;

  // Liste pentru umplerea automată a seriilor (în română)
  const LISTE_SERII = [
    ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'],
    ['lun', 'mar', 'mie', 'joi', 'vin', 'sâm', 'dum'],
    ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
    ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'noi', 'dec'],
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function h(tag, attrs, ...copii) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k]);
    }
    for (const c of copii.flat()) if (c != null) el.append(c);
    return el;
  }

  class Spreadsheet {
    constructor(container, opts) {
      this.opts = Object.assign({
        inaltime: 380, toolbar: true, permiteFoi: true, permiteStructura: true, status: true, tinte: [], editabile: null
      }, opts || {});
      this.container = container;
      this.wb = this.opts.workbook || new FE.Workbook(this.opts.def || {});
      this.si = 0;
      this.sel = { r: 0, c: 0, r1: 0, c1: 0, r2: 0, c2: 0 };
      this.edit = null;          // editarea în curs
      this.clip = null;          // clipboard intern
      this.istoric = []; this.refaceri = [];
      this.arataFormule = false;
      this.asc = {};             // ascultători de evenimente
      this.editabile = (this.opts.editabile || []).map(FE.parseRangeAddr).filter(Boolean);
      this.tinte = (this.opts.tinte || []).map(FE.parseRangeAddr).filter(Boolean);
      this.construieste();
      this.randeaza();
      this._laLimba = () => this.randeazaValori();
      document.addEventListener('app:separator', this._laLimba);
    }

    /* ---------------- evenimente ---------------- */
    on(ev, fn) { (this.asc[ev] = this.asc[ev] || []).push(fn); return this; }
    emit(ev, data) { (this.asc[ev] || []).forEach((f) => f(data)); }

    /* ---------------- construirea DOM ---------------- */
    construieste() {
      const o = this.opts;
      this.root = h('div', { class: 'xl', role: 'application', 'aria-label': 'Simulator de foaie de calcul' });
      this.root.style.setProperty('--xl-inaltime', o.inaltime + 'px');

      if (o.toolbar) {
        const b = (text, titlu, fn, extra) => h('button', Object.assign({ type: 'button', title: titlu, 'aria-label': titlu, onclick: fn }, extra || {}), text);
        this.btnBold = b('B', 'Aldin (Ctrl+B)', () => this.comutaStil('bold'), { style: 'font-weight:800' });
        this.btnItalic = b('I', 'Cursiv (Ctrl+I)', () => this.comutaStil('italic'), { style: 'font-style:italic;font-family:Georgia,serif' });
        this.btnUmplere = b('▨', 'Culoare de umplere', () => this.comutaStil('fill'));
        this.selFormat = h('select', { 'aria-label': 'Formatul numerelor', title: 'Formatul numerelor',
          onchange: () => this.aplicaFormat(this.selFormat.value) },
          h('option', { value: 'general' }, 'General'), h('option', { value: 'number' }, 'Număr'),
          h('option', { value: 'currency' }, 'Monedă (lei)'), h('option', { value: 'percent' }, 'Procent %'),
          h('option', { value: 'date' }, 'Dată'), h('option', { value: 'text' }, 'Text'));
        this.btnFormule = b('fx', 'Arată formulele (Ctrl+`)', () => this.comutaFormule(), { style: 'font-style:italic;font-family:Georgia,serif;font-weight:700' });
        this.toolbar = h('div', { class: 'xl-toolbar' },
          b('↶', 'Anulează (Ctrl+Z)', () => this.anuleaza()), b('↷', 'Refă (Ctrl+Y)', () => this.reface()), h('span', { class: 'sep' }),
          this.btnBold, this.btnItalic, this.btnUmplere,
          b('⇤', 'Aliniere la stânga', () => this.aliniaza('left')), b('↔', 'Centrare', () => this.aliniaza('center')), b('⇥', 'Aliniere la dreapta', () => this.aliniaza('right')),
          b('▢', 'Chenar în jurul celulelor', () => this.comutaStil('border')), h('span', { class: 'sep' }),
          this.selFormat, b('.0←', 'Mărește numărul de zecimale', () => this.zecimale(1)), b('.00→', 'Micșorează numărul de zecimale', () => this.zecimale(-1)),
          h('span', { class: 'sep' }), this.btnFormule);
        this.root.append(this.toolbar);
      }

      // bara de formule
      this.nameBox = h('input', { class: 'xl-namebox', type: 'text', 'aria-label': 'Caseta de nume', title: 'Caseta de nume — scrie o adresă (ex. C5 sau A1:B4) și apasă Enter' });
      this.fInput = h('input', { class: 'xl-finput', type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Bara de formule' });
      this.fMirror = h('div', { class: 'xl-fmirror', 'aria-hidden': 'true' });
      this.root.append(h('div', { class: 'xl-fbar' }, this.nameBox, h('div', { class: 'xl-fx', title: 'Bara de formule' }, 'fx'),
        h('div', { class: 'xl-fwrap' }, this.fMirror, this.fInput)));
      this.mesaj = h('div', { class: 'xl-mesaj', role: 'alert' });
      this.root.append(this.mesaj);

      // grila
      this.scroll = h('div', { class: 'xl-scroll', tabindex: '0', 'aria-label': 'Celulele foii. Folosește săgețile pentru a te deplasa și scrie pentru a introduce date.' });
      this.strat = h('div', { class: 'xl-strat' });
      this.table = h('table', { class: 'xl-grid' });
      this.cursor = h('div', { class: 'xl-cursor' });
      this.zona = h('div', { class: 'xl-zona ascuns' });
      this.maner = h('div', { class: 'xl-maner', title: 'Ghidajul de umplere — trage pentru a copia sau a continua o serie' });
      this.refLayer = h('div');
      this.strat.append(this.table, this.refLayer, this.zona, this.cursor, this.maner);
      this.scroll.append(this.strat);
      this.root.append(this.scroll);
      this.alteFoi = h('div', { class: 'xl-alte-foi' });
      this.root.append(this.alteFoi);
      this.tabs = h('div', { class: 'xl-tabs', role: 'tablist', 'aria-label': 'Foile registrului' });
      this.root.append(this.tabs);
      if (this.opts.status) { this.status = h('div', { class: 'xl-status', 'aria-live': 'polite' }); this.root.append(this.status); }
      this.panouEroare = h('div', { class: 'xl-eroare', 'aria-live': 'polite' });
      this.root.append(this.panouEroare);
      this.container.append(this.root);
      if (this.construiesteExtra) this.construiesteExtra();

      this.leagaEvenimente();
    }

    /* ---------------- desenarea grilei ---------------- */
    get foaie() { return this.wb.sheets[this.si]; }
    latime(c) { return this.foaie.widths[FE.numToCol(c)] || LATIME_IMPLICITA; }

    randeaza() {
      const sh = this.foaie;
      const cg = h('colgroup', null, h('col', { style: 'width:42px' }));
      for (let c = 0; c < sh.cols; c++) cg.append(h('col', { style: 'width:' + this.latime(c) + 'px' }));
      const thead = h('thead');
      const trh = h('tr', null, h('th', { class: 'colt', title: 'Selectează toată foaia' }, ''));
      for (let c = 0; c < sh.cols; c++) {
        trh.append(h('th', { 'data-col': c, scope: 'col' }, FE.numToCol(c), h('span', { class: 'xl-redim', 'data-redim': c })));
      }
      thead.append(trh);
      const tbody = h('tbody');
      this.celule = [];
      for (let r = 0; r < sh.rows; r++) {
        const tr = h('tr', { 'data-rand': r }, h('th', { 'data-row': r, scope: 'row' }, String(r + 1)));
        const rand = [];
        for (let c = 0; c < sh.cols; c++) {
          const td = h('td', { 'data-r': r, 'data-c': c });
          tr.append(td); rand.push(td);
        }
        if (sh.hiddenRows.has(r)) tr.classList.add('ascuns-filtru');
        tbody.append(tr);
        this.celule.push(rand);
      }
      this.table.replaceChildren(cg, thead, tbody);
      this.table.style.width = (42 + [...Array(sh.cols).keys()].reduce((s, c) => s + this.latime(c), 0)) + 'px';
      this.randeazaTaburi();
      this.randeazaValori();
    }

    randeazaValori() {
      const sh = this.foaie, si = this.si;
      this.wb.circular = false;
      if (this.inainteValori) this.inainteValori();
      for (let r = 0; r < sh.rows; r++) for (let c = 0; c < sh.cols; c++) {
        const td = this.celule[r][c];
        const cell = this.wb.cell(si, r, c);
        const v = this.wb.getValue(si, r, c);
        let cls = '';
        let text;
        if (this.arataFormule && cell && cell.input && cell.input[0] === '=') { text = cell.input; cls += ' formula-vazuta'; }
        else {
          text = this.wb.getDisplay(si, r, c);
          if (FE.isErr(v)) cls += ' err';
          else if (typeof v === 'number') cls += ' num';
          else if (typeof v === 'boolean') cls += ' centru';
        }
        if (cell) {
          if (cell.bold) cls += ' bold';
          if (cell.italic) cls += ' italic';
          if (cell.fill) cls += ' umplut';
          if (cell.border) cls += ' chenar';
          if (cell.align) cls += ' al-' + cell.align;
        }
        if (this.tinte.some((z) => r >= z.r1 && r <= z.r2 && c >= z.c1 && c <= z.c2) && (!cell || !cell.input)) cls += ' tinta';
        if (this.editabile.length && !this.eEditabila(r, c)) cls += ' blocat';
        td.className = cls.trim();
        td.textContent = text;
        td.title = FE.isErr(v) ? 'Eroare ' + v.code + ' — selectează celula pentru explicație' : '';
        // stiluri suplimentare (formatare condiționată etc.)
        td.style.cssText = '';
        if (this.opts.stilCelula) {
          const st = this.opts.stilCelula(si, r, c, v);
          if (st) Object.assign(td.style, st);
        }
        if (this.stilAvansat) this.stilAvansat(td, r, c, v, cell);
      }
      if (this.dupaValori) this.dupaValori();
      this.actualizeazaSelectia();
    }

    randeazaTaburi() {
      this.tabs.replaceChildren();
      this.wb.sheets.forEach((s, i) => {
        const t = h('button', { class: 'xl-tab', role: 'tab', type: 'button', 'aria-selected': i === this.si ? 'true' : 'false', 'data-foaie': i,
          title: this.opts.permiteFoi ? 'Dublu-clic pentru a redenumi foaia' : s.name }, s.name);
        t.addEventListener('click', () => this.schimbaFoaia(i));
        if (this.opts.permiteFoi) {
          t.addEventListener('dblclick', () => this.redenumesteInteractiv(i));
          t.addEventListener('contextmenu', (e) => { e.preventDefault(); this.meniuFoaie(e, i); });
        }
        this.tabs.append(t);
      });
      if (this.opts.permiteFoi) {
        this.tabs.append(h('button', { class: 'xl-tab xl-tab-nou', type: 'button', title: 'Foaie nouă', 'aria-label': 'Adaugă o foaie nouă', onclick: () => this.foaieNoua() }, '+'));
      }
    }

    /* ---------------- poziții pe ecran ---------------- */
    dreptunghi(r1, c1, r2, c2) {
      const sh = this.foaie;
      r1 = Math.max(0, Math.min(r1, sh.rows - 1)); r2 = Math.max(0, Math.min(r2, sh.rows - 1));
      c1 = Math.max(0, Math.min(c1, sh.cols - 1)); c2 = Math.max(0, Math.min(c2, sh.cols - 1));
      const a = this.celule[r1][c1], b = this.celule[r2][c2];
      const baza = this.strat.getBoundingClientRect();
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return { left: ra.left - baza.left, top: ra.top - baza.top, width: rb.right - ra.left, height: rb.bottom - ra.top };
    }
    pune(el, d, extra) {
      el.style.left = (d.left - 1 + (extra || 0)) + 'px'; el.style.top = (d.top - 1 + (extra || 0)) + 'px';
      el.style.width = (d.width + 1 - 2 * (extra || 0)) + 'px'; el.style.height = (d.height + 1 - 2 * (extra || 0)) + 'px';
    }

    actualizeazaSelectia() {
      const s = this.sel;
      if (!this.celule.length) return;
      const dc = this.dreptunghi(s.r, s.c, s.r, s.c);
      this.pune(this.cursor, dc);
      const multi = s.r1 !== s.r2 || s.c1 !== s.c2;
      const dz = this.dreptunghi(s.r1, s.c1, s.r2, s.c2);
      this.zona.classList.toggle('ascuns', !multi);
      if (multi) this.pune(this.zona, dz);
      this.maner.style.left = (dz.left + dz.width - 5) + 'px';
      this.maner.style.top = (dz.top + dz.height - 5) + 'px';
      this.maner.classList.toggle('ascuns', !!this.edit);
      // antete evidențiate
      this.table.querySelectorAll('th.activ').forEach((t) => t.classList.remove('activ'));
      for (let c = s.c1; c <= s.c2; c++) { const t = this.table.querySelector('th[data-col="' + c + '"]'); if (t) t.classList.add('activ'); }
      for (let r = s.r1; r <= s.r2; r++) { const t = this.table.querySelector('th[data-row="' + r + '"]'); if (t) t.classList.add('activ'); }
      // caseta de nume și bara de formule
      if (document.activeElement !== this.nameBox) {
        this.nameBox.value = multi ? FE.addr(s.r1, s.c1) + ':' + FE.addr(s.r2, s.c2) : FE.addr(s.r, s.c);
      }
      if (!this.edit) {
        this.fInput.value = this.wb.getInput(this.si, s.r, s.c);
        this.oglinda();
      }
      this.deseneazaReferinte();
      this.actualizeazaStatus();
      this.actualizeazaEroare();
      this.actualizeazaToolbar();
      if (this.clip && this.clip.marcaj) this.pozitioneazaMarcaj();
      if (this.dupaSelectie) this.dupaSelectie();
    }

    // colorează referințele din formulă (în bara de formule și în grilă)
    oglinda() {
      const text = this.fInput.value;
      if (!text.startsWith('=')) { this.fMirror.textContent = text; this.sincronScroll(); return; }
      const refs = FE.referinte(text);
      let html = '', last = 0;
      refs.forEach((rf, i) => {
        html += esc(text.slice(last, rf.start)) + '<span class="ref r' + (i % 6) + '">' + esc(text.slice(rf.start, rf.end)) + '</span>';
        last = rf.end;
      });
      html += esc(text.slice(last));
      this.fMirror.innerHTML = html;
      this.sincronScroll();
    }
    sincronScroll() { this.fMirror.scrollLeft = this.fInput.scrollLeft; }

    textFormulaCurenta() {
      if (this.edit) return this.edit.input.value;
      return this.wb.getInput(this.si, this.sel.r, this.sel.c);
    }

    deseneazaReferinte() {
      this.refLayer.replaceChildren();
      this.alteFoi.replaceChildren();
      const text = this.textFormulaCurenta();
      const siFormula = this.edit ? this.edit.si : this.si;
      if (!text || text[0] !== '=') { this.alteFoi.classList.remove('vizibil'); return; }
      const refs = FE.referinte(text);
      const numeFormula = this.wb.sheets[siFormula].name.toLowerCase();
      const externe = [];
      refs.forEach((rf, i) => {
        const foaieRef = rf.sheet ? rf.sheet.toLowerCase() : numeFormula;
        const culoare = 'var(--ref-' + (i % 6) + ')';
        if (foaieRef === this.foaie.name.toLowerCase()) {
          const d = this.dreptunghi(rf.r1, rf.c1, rf.fullCol ? this.foaie.rows - 1 : rf.r2, rf.c2);
          const box = h('div', { class: 'xl-refbox' });
          box.style.setProperty('--c', culoare);
          this.pune(box, d);
          this.refLayer.append(box);
        }
        if (foaieRef !== this.foaie.name.toLowerCase() || rf.sheet) {
          const si = this.wb.sheetIndex(rf.sheet || this.wb.sheets[siFormula].name);
          let val = '';
          if (si >= 0 && rf.r1 === rf.r2 && rf.c1 === rf.c2) val = ' = ' + this.wb.getDisplay(si, rf.r1, rf.c1);
          else if (si < 0) val = ' → foaia nu există (#REF!)';
          const s = h('span', null, text.slice(rf.start, rf.end) + val);
          s.style.color = culoare;
          externe.push(s);
        }
      });
      if (externe.length) this.alteFoi.append('Referințe către alte foi: ', ...externe);
      this.alteFoi.classList.toggle('vizibil', externe.length > 0);
    }

    actualizeazaStatus() {
      if (!this.status) return;
      const s = this.sel, si = this.si;
      this.status.replaceChildren();
      if (s.r1 === s.r2 && s.c1 === s.c2) {
        const cell = this.wb.cell(si, s.r, s.c);
        const v = this.wb.getValue(si, s.r, s.c);
        const f = this.wb.getFormat(si, s.r, s.c);
        let tip = 'celulă goală';
        if (cell && cell.input) {
          const esteFormula = cell.input[0] === '=';
          let t = FE.isErr(v) ? 'eroare' : typeof v === 'number' ? (f && f.type === 'date' ? 'dată calendaristică' : 'număr') : typeof v === 'boolean' ? 'valoare logică' : 'text';
          tip = esteFormula ? 'formulă → rezultat de tip ' + t : t;
        }
        this.status.append(h('span', { class: 'stanga' }, h('b', null, FE.addr(s.r, s.c)), ' · ' + tip));
      } else {
        let n = 0, nn = 0, sum = 0;
        for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) {
          const v = this.wb.getValue(si, r, c);
          if (v !== null && v !== '') n++;
          if (typeof v === 'number') { nn++; sum += v; }
        }
        const nrCel = (s.r2 - s.r1 + 1) * (s.c2 - s.c1 + 1);
        this.status.append(h('span', { class: 'stanga' }, 'Zona ', h('b', null, FE.addr(s.r1, s.c1) + ':' + FE.addr(s.r2, s.c2)),
          ' · ' + (s.r2 - s.r1 + 1) + ' rânduri × ' + (s.c2 - s.c1 + 1) + ' coloane = ' + nrCel + ' celule'));
        if (nn) {
          this.status.append(h('span', null, 'Medie: ', h('b', null, FE.formatValoare(sum / nn))));
          this.status.append(h('span', null, 'Sumă: ', h('b', null, FE.formatValoare(sum))));
        }
        this.status.append(h('span', null, 'Număr: ', h('b', null, String(n))));
      }
    }

    actualizeazaEroare() {
      const v = this.wb.getValue(this.si, this.sel.r, this.sel.c);
      const p = this.panouEroare;
      if (this.wb.circular && !FE.isErr(v)) {
        p.innerHTML = '<h4><code>⟳</code>Referință circulară</h4><p>O formulă face trimitere, direct sau prin alte celule, chiar la celula în care se află. Excel afișează un avertisment și rezultatul 0.</p>';
        p.classList.add('vizibil'); return;
      }
      if (!FE.isErr(v)) { p.classList.remove('vizibil'); return; }
      const cell = this.wb.cell(this.si, this.sel.r, this.sel.c);
      let cod = v.code;
      if (cell && cell.syntax) cod = '#SINTAXĂ';
      const x = FE.EXPLICATII_ERORI[cod] || FE.EXPLICATII_ERORI[v.code];
      if (!x) { p.classList.remove('vizibil'); return; }
      p.innerHTML = '<h4><code>' + esc(v.code) + '</code>' + esc(x.titlu) + '</h4><p>' + esc(x.ce) + '</p>' +
        (cell && cell.syntax ? '<p><b>Problema:</b> ' + esc(cell.syntax.message) + '</p>' : '') +
        (v.code === '#NAME?' && cell && !cell.syntax ? FE.numeNecunoscute(cell.input).map((n) => '<p><b>În formula ta:</b> ' + (n.text
          ? '„' + esc(n.nume) + '” nu este o funcție, o adresă sau un text între ghilimele. Dacă este un text, scrie-l așa: "' + esc(n.nume) + '".'
          : 'funcția <code>' + esc(n.nume.toUpperCase()) + '</code> nu există. ' + (n.sugestie ? (n.sugestie.motiv === 'ro'
            ? 'În Excel funcțiile se scriu în engleză: folosește <code>' + n.sugestie.en + '</code>.'
            : 'Ai vrut să scrii <code>' + n.sugestie.en + '</code>?') : '')) + '</p>').join('') : '') +
        '<p><b>Cauze frecvente:</b></p><ul>' + x.cauze.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul><p><b>Cum repari:</b> ' + esc(x.repara) + '</p>';
      p.classList.add('vizibil');
    }

    actualizeazaToolbar() {
      if (!this.toolbar) return;
      const cell = this.wb.cell(this.si, this.sel.r, this.sel.c) || {};
      this.btnBold.setAttribute('aria-pressed', cell.bold ? 'true' : 'false');
      this.btnItalic.setAttribute('aria-pressed', cell.italic ? 'true' : 'false');
      this.btnUmplere.setAttribute('aria-pressed', cell.fill ? 'true' : 'false');
      this.btnFormule.setAttribute('aria-pressed', this.arataFormule ? 'true' : 'false');
      this.selFormat.value = (cell.fmt && cell.fmt.type) || 'general';
    }

    /* ---------------- selecție ---------------- */
    selecteaza(r, c, extinde) {
      const sh = this.foaie;
      r = Math.max(0, Math.min(sh.rows - 1, r)); c = Math.max(0, Math.min(sh.cols - 1, c));
      if (extinde) {
        const a = this.ancora || { r: this.sel.r, c: this.sel.c };
        this.sel = { r: a.r, c: a.c, r1: Math.min(a.r, r), c1: Math.min(a.c, c), r2: Math.max(a.r, r), c2: Math.max(a.c, c), capat: { r, c } };
      } else {
        this.sel = { r, c, r1: r, c1: c, r2: r, c2: c };
        this.ancora = { r, c };
      }
      this.actualizeazaSelectia();
      this.asiguraVizibil(extinde && this.sel.capat ? this.sel.capat.r : r, extinde && this.sel.capat ? this.sel.capat.c : c);
      this.emit('select', this.getSelection());
    }
    // selectare după text: 'B2' sau 'A1:C4'
    select(adresa, si) {
      if (si != null && si !== this.si) this.schimbaFoaia(si);
      const z = FE.parseRangeAddr(adresa);
      if (!z) return false;
      this.selecteaza(z.r1, z.c1);
      if (z.r2 !== z.r1 || z.c2 !== z.c1) this.selecteaza(z.r2, z.c2, true);
      return true;
    }
    getSelection() {
      const s = this.sel;
      return { si: this.si, foaie: this.foaie.name, r: s.r, c: s.c, r1: s.r1, c1: s.c1, r2: s.r2, c2: s.c2,
        adresa: s.r1 === s.r2 && s.c1 === s.c2 ? FE.addr(s.r, s.c) : FE.addr(s.r1, s.c1) + ':' + FE.addr(s.r2, s.c2) };
    }
    asiguraVizibil(r, c) {
      const td = this.celule[r] && this.celule[r][c]; if (!td) return;
      const sc = this.scroll, st = td.offsetTop, sl = td.offsetLeft;
      const hh = 30, hw = 42;
      if (st - hh < sc.scrollTop) sc.scrollTop = st - hh;
      else if (st + td.offsetHeight > sc.scrollTop + sc.clientHeight) sc.scrollTop = st + td.offsetHeight - sc.clientHeight;
      if (sl - hw < sc.scrollLeft) sc.scrollLeft = sl - hw;
      else if (sl + td.offsetWidth > sc.scrollLeft + sc.clientWidth) sc.scrollLeft = sl + td.offsetWidth - sc.clientWidth;
    }

    eEditabila(r, c, si) {
      si = si == null ? this.si : si;
      if (this.wb.sheets[si].protejata) {
        const cell = this.wb.cell(si, r, c);
        if (!cell || !cell.deblocata) return false;
      }
      if (!this.editabile.length) return true;
      if (si !== 0 && this.opts.editabileDoarPrimaFoaie !== false) return false;
      return this.editabile.some((z) => r >= z.r1 && r <= z.r2 && c >= z.c1 && c <= z.c2);
    }
    avertizareBlocata() {
      const prot = this.foaie.protejata;
      this.arataMesaj(prot ? '<b>Foaie protejată.</b> Celula este blocată. Pentru modificare, foaia trebuie deprotejată.'
        : '<b>Celulă blocată.</b> În acest exercițiu poți modifica doar celulele ' + esc((this.opts.editabile || []).join(', ')) + '.');
    }
    arataMesaj(html, durata) {
      this.mesaj.classList.remove('info');
      this.mesaj.innerHTML = html;
      this.mesaj.classList.add('vizibil');
      clearTimeout(this._tMesaj);
      if (durata !== 0) this._tMesaj = setTimeout(() => this.mesaj.classList.remove('vizibil'), durata || 4500);
    }
    ascundeMesaj() { this.mesaj.classList.remove('vizibil'); }

    /* ---------------- editare ---------------- */
    incepeEditarea(mod, textInitial, dinTastare) {
      const { r, c } = this.sel;
      if (!this.eEditabila(r, c)) { this.avertizareBlocata(); return; }
      const valoare = textInitial != null ? textInitial : this.wb.getInput(this.si, r, c);
      this.edit = { si: this.si, r, c, mod, original: this.wb.getInput(this.si, r, c), dinTastare: !!dinTastare, punct: null };
      this.maner.classList.add('ascuns');
      if (mod === 'celula') {
        const d = this.dreptunghi(r, c, r, c);
        const inp = h('input', { class: 'xl-editor', type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Editare celulă ' + FE.addr(r, c) });
        inp.style.left = (d.left - 1) + 'px'; inp.style.top = (d.top - 1) + 'px';
        inp.style.minWidth = (d.width + 1) + 'px'; inp.style.height = (d.height + 1) + 'px';
        inp.style.width = Math.max(d.width + 1, 60) + 'px';
        this.strat.append(inp);
        inp.value = valoare;
        this.edit.input = inp;
        this.edit.celInput = inp;
        this.leagaEditor(inp);
        inp.focus({ preventScroll: true });
        inp.setSelectionRange(inp.value.length, inp.value.length);
        this.fInput.value = valoare;
      } else {
        this.edit.input = this.fInput;
        this.fInput.value = valoare;
      }
      this.laSchimbareaTextului();
    }
    leagaEditor(inp) {
      inp.addEventListener('input', () => { this.edit && (this.edit.punct = null); this.laSchimbareaTextului(); });
      inp.addEventListener('keydown', (e) => this.tasteEditor(e));
      inp.addEventListener('blur', () => {
        // la pierderea focusului (clic în altă parte a paginii) se confirmă valoarea
        setTimeout(() => {
          if (this.edit && this.edit.input === inp && document.activeElement !== inp && !this.root.contains(document.activeElement)) this.confirma();
        }, 120);
      });
    }
    laSchimbareaTextului() {
      if (!this.edit) return;
      const t = this.edit.input.value;
      if (this.edit.input !== this.fInput) this.fInput.value = t;
      else if (this.edit.celInput) this.edit.celInput.value = t;
      if (this.edit.celInput) {
        const w = Math.max(parseFloat(this.edit.celInput.style.minWidth), t.length * 8.5 + 16);
        this.edit.celInput.style.width = Math.min(w, 520) + 'px';
      }
      this.oglinda();
      this.deseneazaReferinte();
      this.ascundeMesaj();
      this.emit('editare', { text: t });
    }
    tasteEditor(e) {
      if (!this.edit) return;
      const inp = this.edit.input;
      if (e.key === 'Enter') { e.preventDefault(); if (this.confirma()) this.muta(e.shiftKey ? -1 : 1, 0); return; }
      if (e.key === 'Tab') { e.preventDefault(); if (this.confirma()) this.muta(0, e.shiftKey ? -1 : 1); return; }
      if (e.key === 'Escape') { e.preventDefault(); this.anuleazaEditarea(); return; }
      if (e.key === 'F4') { e.preventDefault(); this.comutaAbsolut(); return; }
      if (this.edit.dinTastare && inp === this.edit.celInput && !inp.value.startsWith('=') &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (this.confirma()) this.muta(e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0, e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0);
      }
    }
    // F4: A1 → $A$1 → A$1 → $A1 → A1 pentru referința de la cursor
    comutaAbsolut() {
      const inp = this.edit.input, t = inp.value, poz = inp.selectionStart;
      if (!t.startsWith('=')) return;
      const src = t.slice(1);
      let toks; try { toks = FE.tokenize(src).toks; } catch (e) { return; }
      const tk = toks.find((x) => x.type === 'ref' && poz - 1 >= x.start && poz - 1 <= x.end);
      if (!tk) return;
      const stari = [[false, false], [true, true], [true, false], [false, true]];
      let k = stari.findIndex(([a, b]) => a === tk.absR && b === tk.absC);
      const [nr, nc] = stari[(k + 1) % 4];
      const nou = tk.sheetText + FE.addr(tk.r, tk.c, nr, nc);
      inp.value = '=' + src.slice(0, tk.start) + nou + src.slice(tk.end);
      const p = 1 + tk.start + nou.length;
      inp.setSelectionRange(p, p);
      this.laSchimbareaTextului();
    }
    // Poate insera o referință prin clic? (după =, (, operator sau separator)
    poateInseraReferinta() {
      if (!this.edit) return false;
      const inp = this.edit.input, t = inp.value;
      if (!t.startsWith('=')) return false;
      const poz = inp.selectionStart != null ? inp.selectionStart : t.length;
      if (this.edit.punct && poz === this.edit.punct.end) return true;
      const inainte = t.slice(0, poz).trimEnd();
      return /[=(,;+\-*/^&<>:]$/.test(inainte);
    }
    insereazaReferinta(r1, c1, r2, c2) {
      const inp = this.edit.input, t = inp.value;
      let ref = FE.addr(r1, c1);
      if (r2 != null && (r2 !== r1 || c2 !== c1)) ref = FE.addr(Math.min(r1, r2), Math.min(c1, c2)) + ':' + FE.addr(Math.max(r1, r2), Math.max(c1, c2));
      if (this.si !== this.edit.si) ref = FE.quoteSheet(this.foaie.name) + '!' + ref;
      let start, end;
      const poz = inp.selectionStart != null ? inp.selectionStart : t.length;
      if (this.edit.punct && poz === this.edit.punct.end) { start = this.edit.punct.start; end = this.edit.punct.end; }
      else { start = poz; end = poz; }
      inp.value = t.slice(0, start) + ref + t.slice(end);
      this.edit.punct = { start, end: start + ref.length };
      inp.focus({ preventScroll: true });
      inp.setSelectionRange(start + ref.length, start + ref.length);
      this.laSchimbareaTextului();
    }
    // Confirmă textul editat în celulă. Întoarce false dacă formula are greșeli.
    confirma() {
      if (!this.edit) return true;
      let text = this.edit.input.value;
      const { si, r, c } = this.edit;
      if (text.startsWith('=') && text.length > 1) {
        // Excel închide automat parantezele lipsă
        let bal = 0, inStr = false;
        for (const ch of text) { if (ch === '"') inStr = !inStr; else if (!inStr) bal += ch === '(' ? 1 : ch === ')' ? -1 : 0; }
        if (bal > 0 && !inStr) text += ')'.repeat(bal);
        const err = FE.verificaSintaxa(text);
        if (err) {
          this.arataMesaj('<b>Formula nu poate fi acceptată.</b> ' + esc(err.mesaj) + ' <br><small>Corectează formula sau apasă Esc pentru a renunța.</small>', 0);
          this.edit.input.focus();
          if (err.pozitie != null) { const p = Math.min(text.length, err.pozitie + 1); this.edit.input.setSelectionRange(p, p); }
          return false;
        }
      }
      if (this.verificaValidare) {
        const m = this.verificaValidare(si, r, c, text);
        if (m) { this.arataMesaj('<b>' + esc(m.titlu || 'Valoare nepermisă') + '.</b> ' + esc(m.text), 0); this.edit.input.focus(); return false; }
      }
      if (this.opts.valideaza) {
        const m = this.opts.valideaza(si, r, c, text);
        if (m) { this.arataMesaj('<b>Valoare nepermisă.</b> ' + esc(m), 0); this.edit.input.focus(); return false; }
      }
      const vechi = this.edit.original;
      this.inchideEditorul();
      if (text !== vechi) {
        this.salveazaIstoric();
        this.wb.setInput(si, r, c, text);
        if (this.si !== si) this.schimbaFoaia(si);
        this.dupaModificare([{ si, r, c }]);
      } else this.actualizeazaSelectia();
      return true;
    }
    anuleazaEditarea() {
      const si = this.edit && this.edit.si;
      this.inchideEditorul();
      if (si != null && si !== this.si) this.schimbaFoaia(si);
      this.actualizeazaSelectia();
      this.ascundeMesaj();
    }
    inchideEditorul() {
      if (!this.edit) return;
      if (this.edit.celInput) this.edit.celInput.remove();
      this.edit = null;
      this.scroll.focus({ preventScroll: true });
    }
    dupaModificare(celule) {
      this.randeazaValori();
      this.emit('change', { celule, wb: this.wb });
    }

    /* ---------------- modificări directe (API) ---------------- */
    setInput(adresa, text, si) {
      const p = FE.parseAddr(adresa); if (!p) return;
      si = si == null ? this.si : si;
      this.wb.setInput(si, p.r, p.c, text);
      this.dupaModificare([{ si, r: p.r, c: p.c }]);
    }
    getInput(adresa, si) { const p = FE.parseAddr(adresa); return p ? this.wb.getInput(si == null ? this.si : si, p.r, p.c) : ''; }
    getValue(adresa, si) { const p = FE.parseAddr(adresa); return p ? this.wb.getValue(si == null ? this.si : si, p.r, p.c) : null; }
    incarca(def) {
      this.wb = new FE.Workbook(def);
      this.si = 0; this.istoric = []; this.refaceri = []; this.clip = null;
      this.randeaza(); this.selecteaza(0, 0);
    }

    /* ---------------- istoric (Anulează / Refă) ---------------- */
    salveazaIstoric() {
      this.istoric.push({ wb: this.wb.clone(), si: this.si });
      if (this.istoric.length > 60) this.istoric.shift();
      this.refaceri = [];
    }
    anuleaza() {
      if (this.edit) this.anuleazaEditarea();
      const st = this.istoric.pop(); if (!st) return;
      this.refaceri.push({ wb: this.wb.clone(), si: this.si });
      this.restaureaza(st);
    }
    reface() {
      const st = this.refaceri.pop(); if (!st) return;
      this.istoric.push({ wb: this.wb.clone(), si: this.si });
      this.restaureaza(st);
    }
    restaureaza(st) {
      this.wb.sheets = st.wb.sheets; this.wb.recalc();
      this.si = Math.min(st.si, this.wb.sheets.length - 1);
      this.randeaza();
      this.emit('change', { celule: [], wb: this.wb });
    }

    /* ---------------- stiluri și formate ---------------- */
    pentruSelectie(fn) {
      const s = this.sel;
      for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) {
        if (!this.eEditabila(r, c)) continue;
        fn(this.wb.cell(this.si, r, c, true), r, c);
      }
    }
    comutaStil(prop) {
      const cell = this.wb.cell(this.si, this.sel.r, this.sel.c) || {};
      const val = !cell[prop];
      this.salveazaIstoric();
      this.pentruSelectie((cl) => { cl[prop] = val; });
      this.dupaModificare([]);
    }
    aplicaFormat(tip) {
      this.salveazaIstoric();
      this.pentruSelectie((cl) => {
        const dec = cl.fmt && cl.fmt.dec != null ? cl.fmt.dec : tip === 'number' || tip === 'currency' ? 2 : 0;
        cl.fmt = { type: tip, dec };
        cl.ast = undefined;
      });
      this.wb.recalc();
      this.dupaModificare([]);
      this.scroll.focus({ preventScroll: true });
    }
    zecimale(d) {
      this.salveazaIstoric();
      this.pentruSelectie((cl, r, c) => {
        let f = cl.fmt && cl.fmt.type !== 'general' ? Object.assign({}, cl.fmt) : null;
        if (!f) {
          const v = this.wb.getValue(this.si, r, c);
          const dec = typeof v === 'number' ? ((String(v).split('.')[1] || '').length) : 0;
          f = { type: 'number', dec };
        }
        if (f.type === 'date' || f.type === 'text') return;
        f.dec = Math.max(0, Math.min(10, (f.dec || 0) + d));
        cl.fmt = f;
      });
      this.dupaModificare([]);
    }
    aliniaza(a) {
      const cell = this.wb.cell(this.si, this.sel.r, this.sel.c) || {};
      const val = cell.align === a ? undefined : a;
      this.salveazaIstoric();
      this.pentruSelectie((cl) => { cl.align = val; });
      this.dupaModificare([]);
    }
    comutaFormule() {
      this.arataFormule = !this.arataFormule;
      this.randeazaValori();
    }

    /* ---------------- copiere / lipire ---------------- */
    copiaza(taie) {
      const s = this.sel, celule = [];
      for (let r = s.r1; r <= s.r2; r++) {
        const rand = [];
        for (let c = s.c1; c <= s.c2; c++) {
          const cl = this.wb.cell(this.si, r, c);
          rand.push(cl ? { input: cl.input, fmt: cl.fmt, bold: cl.bold, italic: cl.italic, fill: cl.fill, align: cl.align, border: cl.border } : { input: '' });
        }
        celule.push(rand);
      }
      const tsv = [];
      for (let r = s.r1; r <= s.r2; r++) {
        const rand = [];
        for (let c = s.c1; c <= s.c2; c++) rand.push(this.wb.getDisplay(this.si, r, c));
        tsv.push(rand.join('\t'));
      }
      this.clip = { si: this.si, r1: s.r1, c1: s.c1, r2: s.r2, c2: s.c2, celule, taie: !!taie, tsv: tsv.join('\n'), marcaj: h('div', { class: 'xl-copiere' }) };
      this.strat.append(this.clip.marcaj);
      this.pozitioneazaMarcaj();
      return this.clip.tsv;
    }
    pozitioneazaMarcaj() {
      const c = this.clip;
      if (!c || !c.marcaj) return;
      if (c.si !== this.si) { c.marcaj.style.display = 'none'; return; }
      c.marcaj.style.display = '';
      this.pune(c.marcaj, this.dreptunghi(c.r1, c.c1, c.r2, c.c2));
    }
    stergeMarcaj() { if (this.clip && this.clip.marcaj) { this.clip.marcaj.remove(); this.clip.marcaj = null; } }
    lipeste(textExtern) {
      const s = this.sel;
      if (textExtern != null && (!this.clip || textExtern.replace(/\r/g, '').trim() !== this.clip.tsv.trim())) {
        // text venit din afara simulatorului (ex. copiat din Excel real)
        const randuri = textExtern.replace(/\r/g, '').replace(/\n$/, '').split('\n').map((l) => l.split('\t'));
        this.salveazaIstoric();
        const mod = [];
        randuri.forEach((rand, i) => rand.forEach((v, j) => {
          const r = s.r + i, c = s.c + j;
          if (r < this.foaie.rows && c < this.foaie.cols && this.eEditabila(r, c)) { this.wb.setInput(this.si, r, c, v); mod.push({ si: this.si, r, c }); }
        }));
        this.dupaModificare(mod);
        return;
      }
      const cl = this.clip; if (!cl) return;
      const H = cl.r2 - cl.r1 + 1, W = cl.c2 - cl.c1 + 1;
      const selH = s.r2 - s.r1 + 1, selW = s.c2 - s.c1 + 1;
      // dacă selecția e un multiplu al zonei copiate, se repetă (ca în Excel)
      const repH = selH % H === 0 ? selH / H : 1, repW = selW % W === 0 ? selW / W : 1;
      const r0 = repH > 1 || repW > 1 ? s.r1 : s.r, c0 = repH > 1 || repW > 1 ? s.c1 : s.c;
      this.salveazaIstoric();
      const mod = [];
      let blocate = 0;
      for (let a = 0; a < repH; a++) for (let b = 0; b < repW; b++) {
        for (let i = 0; i < H; i++) for (let j = 0; j < W; j++) {
          const r = r0 + a * H + i, c = c0 + b * W + j;
          if (r >= this.foaie.rows || c >= this.foaie.cols) continue;
          if (!this.eEditabila(r, c)) { blocate++; continue; }
          const src = cl.celule[i][j];
          let input = src.input;
          if (!cl.taie && input && input[0] === '=') input = FE.deplaseaza(input, r - (cl.r1 + i), c - (cl.c1 + j));
          this.wb.setInput(this.si, r, c, input);
          const dst = this.wb.cell(this.si, r, c, true);
          dst.fmt = src.fmt; dst.bold = src.bold; dst.italic = src.italic; dst.fill = src.fill; dst.align = src.align; dst.border = src.border;
          mod.push({ si: this.si, r, c });
        }
      }
      if (cl.taie) {
        for (let i = 0; i < H; i++) for (let j = 0; j < W; j++) {
          const r = cl.r1 + i, c = cl.c1 + j;
          const acoperit = cl.si === this.si && r >= r0 && r < r0 + H && c >= c0 && c < c0 + W;
          if (!acoperit) { const x = this.wb.cell(cl.si, r, c); if (x) { this.wb.setInput(cl.si, r, c, ''); x.fmt = x.bold = x.italic = x.fill = x.align = x.border = undefined; } }
        }
        this.stergeMarcaj(); this.clip = null;
      }
      this.selecteaza(r0, c0);
      this.selecteaza(Math.min(this.foaie.rows - 1, r0 + H * repH - 1), Math.min(this.foaie.cols - 1, c0 + W * repW - 1), true);
      if (blocate) this.avertizareBlocata();
      this.dupaModificare(mod);
    }
    golesteSelectia() {
      this.salveazaIstoric();
      const mod = [];
      let blocate = 0;
      const s = this.sel;
      for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) {
        if (!this.eEditabila(r, c)) { blocate++; continue; }
        if (this.wb.getInput(this.si, r, c) !== '') { this.wb.setInput(this.si, r, c, ''); mod.push({ si: this.si, r, c }); }
      }
      if (blocate && !mod.length) { this.istoric.pop(); this.avertizareBlocata(); return; }
      this.dupaModificare(mod);
    }

    /* ---------------- umplere automată (ghidajul de umplere) ---------------- */
    // Continuă seria: numere, date, „Elev 1”, zile, luni; formulele se copiază cu ajustare
    valoareSerie(surse, k) {
      // surse: [{input, r, c}] ; k = indexul celulei noi (0, 1, 2…)
      const n = surse.length;
      const src = surse[k % n];
      if (src.input && src.input[0] === '=') return { input: src.input, formula: true, src };
      const lit = surse.map((s) => FE.literal(s.input));
      const toateNumere = lit.every((l) => typeof l.v === 'number') && surse.every((s) => s.input !== '');
      if (toateNumere) {
        const esteData = lit.every((l) => l.fmt && l.fmt.type === 'date');
        if (n === 1 && !esteData) return { input: src.input };
        const pas = n === 1 ? 1 : lit[n - 1].v - lit[n - 2].v;
        const v = lit[n - 1].v + pas * (k + 1);
        if (esteData) return { input: FE.formatData(v) };
        const zec = Math.max(...surse.map((s) => (s.input.split(/[.,]/)[1] || '').length));
        return { input: String(+v.toFixed(zec)).replace('.', ',') };
      }
      // text terminat cu număr: „Elev 1” → „Elev 2”
      const m = surse.map((s) => /^(.*?)(\d+)$/.exec(s.input));
      if (m.every(Boolean) && m.every((x) => x[1] === m[0][1])) {
        const nums = m.map((x) => parseInt(x[2], 10));
        const pas = n === 1 ? 1 : nums[n - 1] - nums[n - 2];
        return { input: m[0][1] + (nums[n - 1] + pas * (k + 1)) };
      }
      // liste: zile, luni
      const lower = surse.map((s) => s.input.trim().toLocaleLowerCase('ro'));
      for (const L of LISTE_SERII) {
        if (lower.every((x) => L.includes(x))) {
          const idx = L.indexOf(lower[n - 1]);
          const pas = n === 1 ? 1 : (L.indexOf(lower[n - 1]) - L.indexOf(lower[n - 2]) + L.length) % L.length || 1;
          let t = L[(idx + pas * (k + 1)) % L.length];
          const model = surse[n - 1].input.trim();
          if (model === model.toLocaleUpperCase('ro')) t = t.toLocaleUpperCase('ro');
          else if (model[0] === model[0].toLocaleUpperCase('ro')) t = t[0].toLocaleUpperCase('ro') + t.slice(1);
          return { input: t };
        }
      }
      return { input: src.input };
    }
    umple(tr2, tc2) {
      const s = this.sel;
      const jos = tr2 > s.r2, dreapta = !jos && tc2 > s.c2;
      if (!jos && !dreapta) return;
      this.salveazaIstoric();
      const mod = [];
      const copiaza = (srcR, srcC, r, c, val) => {
        if (!this.eEditabila(r, c)) return;
        let input = val.input;
        if (val.formula) input = FE.deplaseaza(input, r - val.src.r, c - val.src.c);
        this.wb.setInput(this.si, r, c, input);
        const sc = this.wb.cell(this.si, val.src ? val.src.r : srcR, val.src ? val.src.c : srcC);
        const dc = this.wb.cell(this.si, r, c, true);
        if (sc) { dc.fmt = sc.fmt; dc.bold = sc.bold; dc.italic = sc.italic; dc.fill = sc.fill; dc.align = sc.align; dc.border = sc.border; }
        mod.push({ si: this.si, r, c });
      };
      if (jos) {
        for (let c = s.c1; c <= s.c2; c++) {
          const surse = [];
          for (let r = s.r1; r <= s.r2; r++) surse.push({ input: this.wb.getInput(this.si, r, c), r, c });
          for (let r = s.r2 + 1, k = 0; r <= tr2; r++, k++) {
            const v = this.valoareSerie(surse, k);
            if (!v.src) v.src = surse[k % surse.length];
            copiaza(v.src.r, c, r, c, v);
          }
        }
        this.sel.r2 = tr2;
      } else {
        for (let r = s.r1; r <= s.r2; r++) {
          const surse = [];
          for (let c = s.c1; c <= s.c2; c++) surse.push({ input: this.wb.getInput(this.si, r, c), r, c });
          for (let c = s.c2 + 1, k = 0; c <= tc2; c++, k++) {
            const v = this.valoareSerie(surse, k);
            if (!v.src) v.src = surse[k % surse.length];
            copiaza(r, v.src.c, r, c, v);
          }
        }
        this.sel.c2 = tc2;
      }
      this.dupaModificare(mod);
      this.emit('umplere', { mod });
    }
    umpleInJos() {  // Ctrl+D
      const s = this.sel;
      if (s.r1 === s.r2) return;
      const r2 = s.r2;
      this.sel = Object.assign({}, s, { r2: s.r1 });
      this.umple(r2, s.c2);
      this.sel = Object.assign({}, s);
      this.actualizeazaSelectia();
    }

    /* ---------------- structură: rânduri, coloane, foi ---------------- */
    structura(axa, idx, n) {
      if (!this.opts.permiteStructura || this.foaie.protejata) { this.avertizareBlocata(); return; }
      this.salveazaIstoric();
      this.wb.modificaStructura(this.si, axa, idx, n);
      this.randeaza();
      this.selecteaza(this.sel.r, this.sel.c);
      this.emit('change', { celule: [], structura: { axa, idx, n }, wb: this.wb });
    }
    schimbaFoaia(i) {
      if (i === this.si || !this.wb.sheets[i]) return;
      const editeazaFormula = this.edit && this.edit.input.value.startsWith('=');
      if (this.edit && !editeazaFormula) { if (!this.confirma()) return; }
      if (this.edit && editeazaFormula && this.edit.celInput) {
        // continuăm editarea în bara de formule, ca să putem face clic pe altă foaie
        const t = this.edit.celInput.value;
        this.edit.celInput.remove(); this.edit.celInput = null;
        this.edit.input = this.fInput; this.fInput.value = t;
        this.fInput.focus();
      }
      this.si = i;
      this.randeaza();
      if (!this.edit) this.selecteaza(0, 0); else this.actualizeazaSelectia();
      this.emit('foaie', { si: i, nume: this.foaie.name });
    }
    numeValid(nume, exceptie) {
      nume = String(nume || '').trim();
      if (!nume) return 'Numele foii nu poate fi gol.';
      if (nume.length > 31) return 'Numele foii poate avea cel mult 31 de caractere.';
      if (/[\\/?*[\]:]/.test(nume)) return 'Numele foii nu poate conține caracterele \\ / ? * [ ] :';
      if (this.wb.sheets.some((s, i) => i !== exceptie && s.name.toLowerCase() === nume.toLowerCase())) return 'Există deja o foaie cu acest nume.';
      return null;
    }
    redenumesteInteractiv(i) {
      const tab = this.tabs.querySelector('[data-foaie="' + i + '"]');
      if (!tab) return;
      const inp = h('input', { type: 'text', value: this.wb.sheets[i].name, 'aria-label': 'Numele nou al foii' });
      tab.replaceChildren(inp);
      inp.focus(); inp.select();
      const gata = (ok) => {
        if (!inp.isConnected) return;
        if (ok) {
          const m = this.numeValid(inp.value, i);
          if (m) { this.arataMesaj('<b>Nume invalid.</b> ' + esc(m)); inp.focus(); return; }
          this.salveazaIstoric();
          this.wb.redenumesteFoaia(i, inp.value.trim());
          this.emit('change', { celule: [], redenumire: { si: i, nume: inp.value.trim() }, wb: this.wb });
        }
        this.randeazaTaburi();
        this.randeazaValori();
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') gata(true); if (e.key === 'Escape') gata(false); e.stopPropagation(); });
      inp.addEventListener('blur', () => gata(true));
      inp.addEventListener('click', (e) => e.stopPropagation());
    }
    foaieNoua() {
      let k = this.wb.sheets.length + 1;
      while (this.wb.sheetIndex('Foaie' + k) >= 0) k++;
      this.salveazaIstoric();
      this.wb.addSheet({ name: 'Foaie' + k, rows: this.foaie.rows, cols: this.foaie.cols });
      this.schimbaFoaia(this.wb.sheets.length - 1);
      this.emit('change', { celule: [], foaieNoua: true, wb: this.wb });
    }
    copiazaFoaia(i) {
      const copie = this.wb.clone().sheets[i];
      let k = 2, nume = this.wb.sheets[i].name + ' (2)';
      while (this.wb.sheetIndex(nume) >= 0) nume = this.wb.sheets[i].name + ' (' + (++k) + ')';
      copie.name = nume;
      this.salveazaIstoric();
      this.wb.sheets.push(copie);   // la final, ca celelalte foi să nu-și schimbe poziția
      this.wb.recalc();
      this.schimbaFoaia(this.wb.sheets.length - 1);
      this.emit('change', { celule: [], foaieNoua: true, wb: this.wb });
    }
    stergeFoaia(i) {
      if (this.wb.sheets.length < 2) { this.arataMesaj('Un registru trebuie să aibă cel puțin o foaie.'); return; }
      this.salveazaIstoric();
      this.wb.sheets.splice(i, 1);
      this.wb.recalc();
      this.si = Math.min(this.si, this.wb.sheets.length - 1);
      this.randeaza(); this.selecteaza(0, 0);
      this.emit('change', { celule: [], wb: this.wb });
    }

    /* ---------------- meniuri contextuale ---------------- */
    meniu(e, elemente) {
      this.inchideMeniu();
      const m = h('div', { class: 'xl-meniu', role: 'menu' });
      for (const el of elemente) {
        if (el === '-') { m.append(h('hr')); continue; }
        m.append(h('button', { type: 'button', role: 'menuitem', onclick: () => { this.inchideMeniu(); el[1](); } }, el[0]));
      }
      document.body.append(m);
      const w = m.offsetWidth, hh = m.offsetHeight;
      m.style.left = Math.min(e.clientX, innerWidth - w - 8) + 'px';
      m.style.top = Math.min(e.clientY, innerHeight - hh - 8) + 'px';
      this.meniuDeschis = m;
      setTimeout(() => document.addEventListener('pointerdown', this._inchide = (ev) => { if (!m.contains(ev.target)) this.inchideMeniu(); }), 0);
      m.querySelector('button').focus();
    }
    inchideMeniu() {
      if (this.meniuDeschis) { this.meniuDeschis.remove(); this.meniuDeschis = null; document.removeEventListener('pointerdown', this._inchide); }
    }
    meniuCelula(e) {
      const s = this.sel;
      const el = [
        ['Copiază (Ctrl+C)', () => this.copiaza(false)],
        ['Decupează (Ctrl+X)', () => this.copiaza(true)],
        ['Lipește (Ctrl+V)', () => this.lipeste()],
        ['Golește conținutul (Delete)', () => this.golesteSelectia()]
      ];
      if (this.opts.permiteStructura) {
        el.push('-',
          ['Inserează rând deasupra', () => this.structura('r', s.r1, s.r2 - s.r1 + 1)],
          ['Șterge ' + (s.r2 > s.r1 ? 'rândurile ' + (s.r1 + 1) + '–' + (s.r2 + 1) : 'rândul ' + (s.r1 + 1)), () => this.structura('r', s.r1, -(s.r2 - s.r1 + 1))],
          ['Inserează coloană la stânga', () => this.structura('c', s.c1, s.c2 - s.c1 + 1)],
          ['Șterge ' + (s.c2 > s.c1 ? 'coloanele ' : 'coloana ') + FE.numToCol(s.c1) + (s.c2 > s.c1 ? '–' + FE.numToCol(s.c2) : ''), () => this.structura('c', s.c1, -(s.c2 - s.c1 + 1))]);
      }
      if (this.opts.meniuSuplimentar) el.push('-', ...this.opts.meniuSuplimentar(this));
      this.meniu(e, el);
    }
    meniuFoaie(e, i) {
      this.meniu(e, [
        ['Redenumește', () => this.redenumesteInteractiv(i)],
        ['Foaie nouă', () => this.foaieNoua()],
        ['Creează o copie (la final)', () => this.copiazaFoaia(i)],
        ['Șterge foaia', () => this.stergeFoaia(i)]
      ]);
    }

    /* ---------------- mutare cu tastele ---------------- */
    muta(dr, dc, extinde) {
      const baza = extinde && this.sel.capat ? this.sel.capat : { r: this.sel.r, c: this.sel.c };
      let r = baza.r + dr;
      // sare peste rândurile ascunse de filtru
      while (dr && this.foaie.hiddenRows.has(r) && r > 0 && r < this.foaie.rows - 1) r += Math.sign(dr);
      this.selecteaza(r, baza.c + dc, extinde);
    }

    /* ---------------- evenimente ---------------- */
    celulaDinPunct(x, y) {
      const el = document.elementFromPoint(x, y);
      const td = el && el.closest && el.closest('td[data-r]');
      if (!td || !this.table.contains(td)) return null;
      return { r: +td.dataset.r, c: +td.dataset.c };
    }
    leagaEvenimente() {
      const sc = this.scroll;

      // --- mouse / touch pe grilă ---
      this.table.addEventListener('pointerdown', (e) => {
        if (e.button === 2) return;
        const td = e.target.closest('td[data-r]');
        const th = e.target.closest('th');
        const redim = e.target.closest('[data-redim]');
        if (redim) { this.incepeRedimensionare(e, +redim.dataset.redim); return; }
        if (td) {
          const r = +td.dataset.r, c = +td.dataset.c;
          if (this.edit && this.poateInseraReferinta()) {
            e.preventDefault();
            this.insereazaReferinta(r, c);
            this.tragePunct = { r, c };
            this.urmareste(e, (p) => { if (p) this.insereazaReferinta(this.tragePunct.r, this.tragePunct.c, p.r, p.c); });
            return;
          }
          if (this.edit && !this.confirma()) { e.preventDefault(); return; }
          if (e.pointerType === 'touch') { this.selecteaza(r, c, e.shiftKey); return; }
          e.preventDefault();
          sc.focus({ preventScroll: true });
          this.selecteaza(r, c, e.shiftKey);
          this.urmareste(e, (p) => { if (p) this.selecteaza(p.r, p.c, true); });
          return;
        }
        if (th) {
          if (this.edit && !this.confirma()) return;
          e.preventDefault();
          sc.focus({ preventScroll: true });
          const sh = this.foaie;
          if (th.dataset.col != null) { this.selecteaza(0, +th.dataset.col); this.selecteaza(sh.rows - 1, +th.dataset.col, true); }
          else if (th.dataset.row != null) { this.selecteaza(+th.dataset.row, 0); this.selecteaza(+th.dataset.row, sh.cols - 1, true); }
          else { this.selecteaza(0, 0); this.selecteaza(sh.rows - 1, sh.cols - 1, true); }
        }
      });
      this.table.addEventListener('dblclick', (e) => {
        const td = e.target.closest('td[data-r]');
        if (td && !this.edit) this.incepeEditarea('celula');
      });
      this.table.addEventListener('contextmenu', (e) => {
        const td = e.target.closest('td[data-r]');
        e.preventDefault();
        if (this.edit) return;
        if (td) {
          const r = +td.dataset.r, c = +td.dataset.c, s = this.sel;
          if (r < s.r1 || r > s.r2 || c < s.c1 || c > s.c2) this.selecteaza(r, c);
        }
        this.meniuCelula(e);
      });

      // --- ghidajul de umplere ---
      this.maner.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        const previz = h('div', { class: 'xl-umplere-previz' });
        this.strat.append(previz);
        const s = this.sel;
        let tinta = null;
        this.urmareste(e, (p) => {
          if (!p) return;
          const jos = p.r - s.r2, dr = p.c - s.c2;
          if (jos > 0 && jos >= dr) tinta = { r: p.r, c: s.c2 };
          else if (dr > 0) tinta = { r: s.r2, c: p.c };
          else tinta = null;
          if (tinta) { previz.style.display = ''; this.pune(previz, this.dreptunghi(s.r1, s.c1, tinta.r, tinta.c)); }
          else previz.style.display = 'none';
        }, () => {
          previz.remove();
          if (tinta) this.umple(tinta.r, tinta.c);
        });
      });

      // --- tastatura pe grilă ---
      sc.addEventListener('keydown', (e) => this.taste(e));

      // --- copiere / lipire prin clipboard-ul sistemului ---
      this._copy = (e) => {
        if (!this.areFocus() || this.edit) return;
        const tsv = this.copiaza(e.type === 'cut');
        if (e.clipboardData) { e.clipboardData.setData('text/plain', tsv); e.preventDefault(); }
      };
      this._paste = (e) => {
        if (!this.areFocus() || this.edit) return;
        const t = e.clipboardData ? e.clipboardData.getData('text/plain') : null;
        e.preventDefault();
        this.lipeste(t);
      };
      document.addEventListener('copy', this._copy);
      document.addEventListener('cut', this._copy);
      document.addEventListener('paste', this._paste);

      // --- bara de formule ---
      this.fInput.addEventListener('focus', () => {
        if (!this.edit) {
          if (!this.eEditabila(this.sel.r, this.sel.c)) { this.avertizareBlocata(); this.fInput.blur(); return; }
          this.incepeEditarea('bara');
        }
      });
      this.fInput.addEventListener('input', () => { if (this.edit) { this.edit.punct = null; this.laSchimbareaTextului(); } });
      this.fInput.addEventListener('keydown', (e) => this.tasteEditor(e));
      this.fInput.addEventListener('scroll', () => this.sincronScroll());
      this.fInput.addEventListener('keyup', () => this.sincronScroll());
      this.fInput.addEventListener('blur', () => {
        setTimeout(() => {
          if (this.edit && this.edit.input === this.fInput && document.activeElement !== this.fInput && !this.root.contains(document.activeElement)) this.confirma();
        }, 150);
      });

      // --- caseta de nume: salt la o adresă ---
      this.nameBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (this.select(this.nameBox.value.trim().toUpperCase())) sc.focus({ preventScroll: true });
          else this.arataMesaj('<b>Adresă invalidă.</b> Scrie o adresă de forma C5 sau o zonă de forma A1:B4.');
        }
        if (e.key === 'Escape') { this.actualizeazaSelectia(); sc.focus(); }
      });
      this.nameBox.addEventListener('focus', () => this.nameBox.select());

      // repoziționare la redimensionarea ferestrei
      this._resize = () => { if (this.edit && this.edit.celInput) return; this.actualizeazaSelectia(); };
      global.addEventListener('resize', this._resize);
      if ('ResizeObserver' in global) { this._ro = new ResizeObserver(() => this.actualizeazaSelectia()); this._ro.observe(this.table); }
    }
    areFocus() { return this.root.contains(document.activeElement) && document.activeElement !== this.nameBox; }

    // urmărește mișcarea mouse-ului/degetului până la eliberare
    urmareste(e, laMiscare, laFinal) {
      const move = (ev) => {
        const p = this.celulaDinPunct(ev.clientX, ev.clientY);
        laMiscare(p);
        // derulare automată la margini
        const b = this.scroll.getBoundingClientRect();
        if (ev.clientY > b.bottom - 20) this.scroll.scrollTop += 16;
        if (ev.clientY < b.top + 40) this.scroll.scrollTop -= 16;
        if (ev.clientX > b.right - 20) this.scroll.scrollLeft += 16;
        if (ev.clientX < b.left + 50) this.scroll.scrollLeft -= 16;
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
        if (laFinal) laFinal();
        if (this.edit) this.edit.input.focus({ preventScroll: true });
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    }
    incepeRedimensionare(e, c) {
      e.preventDefault(); e.stopPropagation();
      const x0 = e.clientX, w0 = this.latime(c);
      const col = this.table.querySelectorAll('col')[c + 1];
      const move = (ev) => {
        const w = Math.max(24, Math.round(w0 + ev.clientX - x0));
        this.foaie.widths[FE.numToCol(c)] = w;
        col.style.width = w + 'px';
        this.table.style.width = (42 + [...Array(this.foaie.cols).keys()].reduce((s, k) => s + this.latime(k), 0)) + 'px';
        this.actualizeazaSelectia();
      };
      const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); this.emit('latime', { c }); };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    }

    taste(e) {
      if (this.edit) return;
      const ctrl = e.ctrlKey || e.metaKey;
      const k = e.key;
      const mutari = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (mutari[k]) {
        e.preventDefault();
        let [dr, dc] = mutari[k];
        if (ctrl) { // salt la capătul datelor
          const baza = e.shiftKey && this.sel.capat ? this.sel.capat : this.sel;
          let r = baza.r, c = baza.c;
          const plin = (rr, cc) => this.wb.getInput(this.si, rr, cc) !== '';
          const sh = this.foaie;
          const inGrila = (rr, cc) => rr >= 0 && cc >= 0 && rr < sh.rows && cc < sh.cols;
          if (inGrila(r + dr, c + dc) && plin(r, c) && plin(r + dr, c + dc)) { while (inGrila(r + dr, c + dc) && plin(r + dr, c + dc)) { r += dr; c += dc; } }
          else { r += dr; c += dc; while (inGrila(r, c) && !plin(r, c) && inGrila(r + dr, c + dc)) { r += dr; c += dc; } }
          this.selecteaza(r, c, e.shiftKey);
          return;
        }
        this.muta(dr, dc, e.shiftKey);
        return;
      }
      if (k === 'Tab') { e.preventDefault(); this.muta(0, e.shiftKey ? -1 : 1); return; }
      if (k === 'Enter') { e.preventDefault(); this.muta(e.shiftKey ? -1 : 1, 0); return; }
      if (k === 'Home') { e.preventDefault(); this.selecteaza(ctrl ? 0 : this.sel.r, 0); return; }
      if (k === 'F2') { e.preventDefault(); this.incepeEditarea('celula'); return; }
      if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); this.golesteSelectia(); return; }
      if (k === 'Escape') { this.stergeMarcaj(); this.clip = this.clip ? Object.assign(this.clip, { marcaj: null }) : null; this.ascundeMesaj(); return; }
      if (ctrl) {
        const kl = k.toLowerCase();
        if (kl === 'z') { e.preventDefault(); this.anuleaza(); return; }
        if (kl === 'y') { e.preventDefault(); this.reface(); return; }
        if (kl === 'b') { e.preventDefault(); this.comutaStil('bold'); return; }
        if (kl === 'i') { e.preventDefault(); this.comutaStil('italic'); return; }
        if (kl === 'd') { e.preventDefault(); this.umpleInJos(); return; }
        if (k === '`' || e.code === 'Backquote') { e.preventDefault(); this.comutaFormule(); return; }
        if (kl === 'a') { e.preventDefault(); this.selecteaza(0, 0); this.selecteaza(this.foaie.rows - 1, this.foaie.cols - 1, true); return; }
        return; // Ctrl+C / X / V sunt tratate de evenimentele copy / cut / paste
      }
      if (k.length === 1 && !e.altKey) {
        e.preventDefault();
        this.incepeEditarea('celula', k, true);
      }
    }

    // marchează celule „țintă” (unde trebuie scrisă formula)
    seteazaTinte(lista) { this.tinte = (lista || []).map(FE.parseRangeAddr).filter(Boolean); this.randeazaValori(); }

    distruge() {
      document.removeEventListener('copy', this._copy);
      document.removeEventListener('cut', this._copy);
      document.removeEventListener('paste', this._paste);
      document.removeEventListener('app:separator', this._laLimba);
      global.removeEventListener('resize', this._resize);
      if (this._ro) this._ro.disconnect();
      this.root.remove();
    }
  }

  global.Spreadsheet = Spreadsheet;
})(window);
