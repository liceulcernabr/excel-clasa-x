/* =====================================================================
   animations.js — Animații pas cu pas pentru conceptele grele
   ---------------------------------------------------------------------
   Definiția unei animații (în /data/lectii/ora-XX.js):
   { id, titlu,
     grila: { rows: 6, cols: 4, data: [['Nume','Nota'], …] },  // pornește din A1
     pasi: [
       { text: 'Explicația pasului', formula: '=B2*C2',       // formula afișată mare
         antete: ['C', '4'],          // aprinde antetul coloanei C și al rândului 4
         aprinde: ['C4'],             // celule evidențiate
         zona: ['B2:D4'],             // zonă colorată
         cauta: ['A2','A3'],          // celule „verificate” (galben)
         gasit: ['A4'],               // celula găsită (verde)
         ref0: ['B2'], ref1: ['C2'],  // chenare colorate ca referințele din Excel
         celule: { 'D2': '=B2*C2' }   // modificări de conținut (se păstrează la pașii următori)
       } ] }
   În celule, un text care începe cu „=” se afișează ca formulă, iar
   „=>valoare” afișează doar valoarea (de ex. rezultatul unei formule).
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const { el, htmlCuMarcaje } = global.App;

  class Animatie {
    constructor(container, def) {
      this.def = def; this.pas = 0; this.timer = null;
      this.root = el('section', { class: 'anim', 'aria-label': 'Animație: ' + def.titlu });
      this.btnRedare = el('button', { class: 'btn btn-mic', type: 'button', onclick: () => this.comutaRedare() }, '▶ Redă');
      this.root.append(el('div', { class: 'anim-cap' }, el('h3', null, def.titlu), this.btnRedare));
      this.tabel = el('table', { class: 'anim-grila' });
      this.text = el('div', { class: 'anim-text', 'aria-live': 'polite' });
      this.root.append(el('div', { class: 'anim-scena' }, el('div', { style: 'overflow-x:auto' }, this.tabel), this.text));
      this.puncte = el('div', { class: 'anim-puncte', 'aria-hidden': 'true' }, def.pasi.map(() => el('span')));
      this.btnInapoi = el('button', { class: 'btn btn-mic', type: 'button', onclick: () => this.mergi(this.pas - 1) }, '← Înapoi');
      this.btnInainte = el('button', { class: 'btn btn-mic btn-primar', type: 'button', onclick: () => this.mergi(this.pas + 1) }, 'Înainte →');
      this.root.append(el('div', { class: 'anim-control' }, this.btnInapoi, this.btnInainte,
        el('button', { class: 'btn btn-mic btn-fantoma', type: 'button', onclick: () => { this.opreste(); this.mergi(0); } }, '↺ De la început'), this.puncte));
      this.root.tabIndex = 0;
      this.root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); this.mergi(this.pas + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.mergi(this.pas - 1); }
      });
      container.append(this.root);
      this.construiesteGrila();
      this.mergi(0);
    }
    construiesteGrila() {
      const g = this.def.grila;
      const rows = g.rows || (g.data ? g.data.length : 5), cols = g.cols || (g.data ? Math.max(...g.data.map((r) => r.length)) : 4);
      const thead = el('tr', null, el('th', null, ''));
      for (let c = 0; c < cols; c++) thead.append(el('th', { 'data-col': FE.numToCol(c) }, FE.numToCol(c)));
      this.celule = {};
      const rand = [];
      for (let r = 0; r < rows; r++) {
        const tr = el('tr', null, el('th', { 'data-row': r + 1 }, String(r + 1)));
        for (let c = 0; c < cols; c++) {
          const td = el('td');
          this.celule[FE.addr(r, c)] = td;
          tr.append(td);
        }
        rand.push(tr);
      }
      this.tabel.replaceChildren(el('thead', null, thead), el('tbody', null, rand));
    }
    scrie(adresa, v) {
      const td = this.celule[adresa]; if (!td) return;
      td.classList.remove('num', 'formula');
      if (v == null || v === '') { td.textContent = ''; return; }
      if (typeof v === 'number') { td.textContent = FE.formatValoare(v); td.classList.add('num'); return; }
      const s = String(v);
      if (s.startsWith('=>')) { const x = s.slice(2); td.textContent = x; if (!isNaN(parseFloat(x.replace(',', '.')))) td.classList.add('num'); return; }
      if (s.startsWith('=')) { td.textContent = global.App.formula(s); td.classList.add('formula'); return; }
      td.textContent = s;
    }
    mergi(i) {
      const pasi = this.def.pasi;
      i = Math.max(0, Math.min(pasi.length - 1, i));
      this.pas = i;
      // conținutul: datele inițiale + modificările tuturor pașilor până la cel curent
      const g = this.def.grila;
      Object.keys(this.celule).forEach((a) => this.scrie(a, ''));
      (g.data || []).forEach((row, r) => row.forEach((v, c) => this.scrie(FE.addr(r, c), v)));
      for (let k = 0; k <= i; k++) for (const a in pasi[k].celule || {}) this.scrie(a, pasi[k].celule[a]);
      // evidențieri
      const p = pasi[i];
      Object.values(this.celule).forEach((td) => td.classList.remove('aprins', 'cauta', 'gasit', 'zona', 'ref0', 'ref1'));
      this.tabel.querySelectorAll('th.aprins').forEach((t) => t.classList.remove('aprins'));
      const marcheaza = (lista, cls) => (lista || []).forEach((z) => {
        const rg = FE.parseRangeAddr(z); if (!rg) return;
        for (let r = rg.r1; r <= rg.r2; r++) for (let c = rg.c1; c <= rg.c2; c++) { const td = this.celule[FE.addr(r, c)]; if (td) td.classList.add(cls); }
      });
      marcheaza(p.zona, 'zona'); marcheaza(p.cauta, 'cauta'); marcheaza(p.aprinde, 'aprins'); marcheaza(p.gasit, 'gasit');
      marcheaza(p.ref0, 'ref0'); marcheaza(p.ref1, 'ref1');
      (p.antete || []).forEach((a) => {
        const t = /^\d+$/.test(a) ? this.tabel.querySelector('th[data-row="' + a + '"]') : this.tabel.querySelector('th[data-col="' + a + '"]');
        if (t) t.classList.add('aprins');
      });
      // textul pasului
      this.text.replaceChildren(el('span', { class: 'pas-nr' }, 'Pasul ' + (i + 1) + ' din ' + pasi.length));
      if (p.formula) this.text.append(el('span', { class: 'mare', 'data-f': p.formula }, global.App.formula(p.formula)));
      if (p.mare) this.text.append(el('span', { class: 'mare' }, p.mare));
      const d = el('div'); htmlCuMarcaje(d, p.text); this.text.append(d);
      [...this.puncte.children].forEach((s, k) => s.classList.toggle('activ', k === i));
      this.btnInapoi.disabled = i === 0;
      this.btnInainte.disabled = i === pasi.length - 1;
      if (i === pasi.length - 1) this.opreste();
    }
    comutaRedare() { if (this.timer) this.opreste(); else this.porneste(); }
    porneste() {
      if (this.pas >= this.def.pasi.length - 1) this.mergi(0);
      this.btnRedare.textContent = '⏸ Pauză';
      this.timer = setInterval(() => this.mergi(this.pas + 1), this.def.durata || 2600);
    }
    opreste() { clearInterval(this.timer); this.timer = null; this.btnRedare.textContent = '▶ Redă'; }
  }

  global.Animatii = { randeaza: (container, def) => new Animatie(container, def) };
})(window);
