/* =====================================================================
   quiz.js — Mini-teste și teste de evaluare
   ---------------------------------------------------------------------
   Tipuri de itemi (în /data/intrebari/ora-XX.js):
     unic        – grilă cu un singur răspuns corect      corect: 2
     multiplu    – grilă cu mai multe răspunsuri corecte  corect: [0, 2]
     adevarat    – adevărat / fals                        corect: true
     formula     – elevul scrie formula în simulator      foi, tinta, solutie, functii
     asociere    – potrivește elementele din două coloane perechi: [[a, b], …]
     completare  – completează spațiul liber              raspunsuri: ['C7', 'c7']
   Fiecare item poate avea „explicatie”, afișată după răspuns.
   Întrebările se extrag aleator și amestecat, cu tipuri variate.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const { el, esc, amesteca, htmlCuMarcaje, toast, CFG } = global.App;
  const CT = Object.assign({ feedback: 'imediat', timerImplicit: false, minutePeItem: 1.5, itemiMiniTest: 7, itemiEvaluare: 15, punctDinOficiu: true }, CFG.teste || {});

  // Extrage n itemi variați: alternează tipurile și (la evaluări) orele
  function extrage(banca, n, cheieGrup) {
    const grupuri = {};
    amesteca(banca).forEach((q) => { const k = cheieGrup(q); (grupuri[k] = grupuri[k] || []).push(q); });
    const chei = amesteca(Object.keys(grupuri));
    const rez = [];
    while (rez.length < n && chei.some((k) => grupuri[k].length)) {
      for (const k of chei) { if (grupuri[k].length && rez.length < n) rez.push(grupuri[k].shift()); }
    }
    return amesteca(rez);
  }

  const normText = (s) => String(s).trim().replace(/\s+/g, ' ').replace(/;/g, ',').toLowerCase();

  class Test {
    constructor(container, opt) {
      this.c = container; this.opt = opt;   // opt: {titlu, cheie, banca, n, grupare}
      global.Teste.curent = this;           // util pentru testare din consolă
      this.start();
    }
    start() {
      this.c.replaceChildren();
      const card = el('div', { class: 'card' });
      card.append(el('span', { class: 'eticheta' }, this.opt.eticheta || 'Test'), el('h1', { style: 'margin-top:6px' }, this.opt.titlu));
      if (this.opt.descriere) card.append(htmlCuMarcaje(el('p'), this.opt.descriere));
      const nr = Math.min(this.opt.n, this.opt.banca.length);
      card.append(el('p', null, 'Testul are ', el('b', null, nr + ' itemi'), ' extrași la întâmplare dintr-o bancă de ' + this.opt.banca.length +
        ' întrebări — colegul tău primește alte întrebări sau altă ordine. Nota se calculează din 10' + (CT.punctDinOficiu ? ' (1 punct din oficiu).' : '.')));
      const timer = el('input', { type: 'checkbox' }); timer.checked = !!CT.timerImplicit;
      const fb = el('select', { 'aria-label': 'Când vezi răspunsurile corecte' },
        el('option', { value: 'imediat' }, 'după fiecare întrebare'), el('option', { value: 'final' }, 'doar la final'));
      fb.value = CT.feedback;
      const minute = Math.ceil(nr * CT.minutePeItem);
      card.append(el('div', { style: 'display:grid;gap:10px;margin:16px 0' },
        el('label', { class: 'comutator' }, timer, 'Cu cronometru (' + minute + ' minute)'),
        el('label', { class: 'comutator' }, 'Răspunsurile corecte le văd ', fb)));
      card.append(el('div', { class: 'rand-butoane' }, el('button', { class: 'btn btn-primar', type: 'button', onclick: () => {
        this.cuTimer = timer.checked; this.feedback = fb.value; this.minute = minute; this.porneste(nr);
      } }, 'Începe testul')));
      this.c.append(card);
    }
    porneste(nr) {
      this.itemi = extrage(this.opt.banca, nr, this.opt.grupare || ((q) => q.tip)).map((q) => ({ q, raspuns: null, scor: null, verificat: false }));
      this.idx = 0; this.inceput = Date.now();
      this.c.replaceChildren();
      this.cap = el('div', { class: 'quiz-cap' });
      this.progres = el('div', { class: 'bara-progres', style: 'flex:1;min-width:120px' }, el('span', { style: 'width:0%' }));
      this.eticheta = el('span', { class: 'eticheta' });
      this.ceas = el('span', { class: 'quiz-timer' + (this.cuTimer ? '' : ' ascuns'), role: 'timer' });
      this.cap.append(this.eticheta, this.progres, this.ceas);
      this.zona = el('div', { class: 'card' });
      this.c.append(this.cap, this.zona);
      if (this.cuTimer) {
        this.sfarsit = Date.now() + this.minute * 60000;
        this.tic = setInterval(() => this.actualizeazaCeas(), 500);
        this.actualizeazaCeas();
      }
      this.arata();
    }
    actualizeazaCeas() {
      const ramas = Math.max(0, this.sfarsit - Date.now());
      const m = Math.floor(ramas / 60000), s = Math.floor(ramas / 1000) % 60;
      this.ceas.textContent = '⏱ ' + m + ':' + String(s).padStart(2, '0');
      this.ceas.classList.toggle('putin', ramas < 60000);
      if (!ramas) { clearInterval(this.tic); toast('Timpul a expirat. Testul se încheie.'); this.termina(); }
    }
    arata() {
      const it = this.itemi[this.idx], q = it.q, n = this.itemi.length;
      this.eticheta.textContent = 'Întrebarea ' + (this.idx + 1) + ' din ' + n;
      this.progres.firstChild.style.width = (this.idx / n * 100) + '%';
      if (this.sp) { this.sp.distruge(); this.sp = null; }
      this.zona.replaceChildren();
      const item = el('div', { class: 'quiz-item' });
      const enunt = el('div', { class: 'enunt' }); htmlCuMarcaje(enunt, '<span class="nr-item">' + (this.idx + 1) + '.</span>' + q.enunt);
      item.append(enunt);
      this.citeste = this.randeazaItem(item, q, it);
      this.zona.append(item);
      this.feedbackEl = el('div', { class: 'ex-feedback', role: 'status' });
      this.zona.append(this.feedbackEl);
      const bara = el('div', { class: 'rand-butoane', style: 'margin-top:16px' });
      if (this.idx > 0 && this.feedback === 'final') bara.append(el('button', { class: 'btn', type: 'button', onclick: () => { this.salveaza(); this.idx--; this.arata(); } }, '← Înapoi'));
      const ultim = this.idx === n - 1;
      if (this.feedback === 'imediat') {
        this.btnVerif = el('button', { class: 'btn btn-primar', type: 'button', onclick: () => this.verificaCurent() }, 'Verifică răspunsul');
        this.btnUrm = el('button', { class: 'btn btn-primar ascuns', type: 'button', onclick: () => this.urmatoarea() }, ultim ? 'Vezi rezultatul' : 'Următoarea →');
        bara.append(this.btnVerif, this.btnUrm);
        if (it.verificat) { this.btnVerif.classList.add('ascuns'); this.btnUrm.classList.remove('ascuns'); this.arataFeedback(it); }
      } else {
        bara.append(el('button', { class: 'btn btn-primar', type: 'button', onclick: () => this.urmatoarea() }, ultim ? 'Termină testul' : 'Următoarea →'));
      }
      this.zona.append(bara);
      const f = item.querySelector('input:not([type=checkbox]):not([type=radio]), select'); if (f && q.tip !== 'formula') f.focus({ preventScroll: true });
    }
    salveaza() { const it = this.itemi[this.idx]; if (!it.verificat) it.raspuns = this.citeste(); }
    urmatoarea() {
      this.salveaza();
      if (this.idx < this.itemi.length - 1) { this.idx++; this.arata(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else if (this.feedback === 'final' && this.itemi.some((x) => x.raspuns == null || x.raspuns === '')) {
        global.App.modal('Termini testul?', el('p', null, 'Ai întrebări fără răspuns. Ele vor primi 0 puncte.'), [['Mă întorc', false], ['Termină', true, 'btn-primar']])
          .then((da) => { if (da) this.termina(); });
      } else this.termina();
    }
    verificaCurent() {
      const it = this.itemi[this.idx];
      it.raspuns = this.citeste();
      if (it.raspuns == null || it.raspuns === '' || (Array.isArray(it.raspuns) && !it.raspuns.length)) { this.feedbackEl.className = 'ex-feedback info'; this.feedbackEl.textContent = 'Alege sau scrie un răspuns.'; return; }
      it.scor = this.puncteaza(it);
      it.verificat = true;
      this.arataFeedback(it);
      this.blocheaza();
      this.btnVerif.classList.add('ascuns'); this.btnUrm.classList.remove('ascuns'); this.btnUrm.focus();
    }
    blocheaza() {
      this.zona.querySelectorAll('.quiz-item input:not(.xl-namebox):not(.xl-finput), .quiz-item select').forEach((x) => { x.disabled = true; });
      if (this.sp) { this.sp.opts.editabile = ['—']; this.sp.editabile = [FE.parseRangeAddr('ZZ1')]; this.sp.randeazaValori(); }
    }
    arataFeedback(it) {
      const ok = it.scor >= 0.999, partial = it.scor > 0 && !ok;
      this.feedbackEl.className = 'ex-feedback ' + (ok ? 'ok' : 'gresit');
      htmlCuMarcaje(this.feedbackEl, (ok ? '<b>Corect!</b> ' : partial ? '<b>Parțial corect</b> (' + Math.round(it.scor * 100) + '%). ' : '<b>Greșit.</b> ') +
        (!ok ? 'Răspuns corect: ' + this.textCorect(it.q) + '. ' : '') + (it.mesaj ? esc(it.mesaj) + ' ' : '') + (it.q.explicatie ? '<div class="explicatie">' + it.q.explicatie + '</div>' : ''));
      // marcaje vizuale pe variante
      if (it.q.variante) this.zona.querySelectorAll('.optiune').forEach((o) => {
        const i = +o.querySelector('input').value;
        const corecte = [].concat(it.q.corect);
        o.classList.toggle('corect', corecte.includes(i));
        o.classList.toggle('gresit', !corecte.includes(i) && o.querySelector('input').checked);
      });
    }

    /* ---------- afișarea fiecărui tip de item ---------- */
    randeazaItem(item, q, it) {
      const r = it.raspuns;
      if (q.tip === 'unic' || q.tip === 'multiplu') {
        const box = el('div', { class: 'optiuni-grila' });
        const ordine = it.ordine || (it.ordine = amesteca(q.variante.map((v, i) => i)));
        ordine.forEach((i) => {
          const inp = el('input', { type: q.tip === 'unic' ? 'radio' : 'checkbox', name: 'q' + this.idx, value: i });
          if (r != null && [].concat(r).includes(i)) inp.checked = true;
          const s = el('span'); htmlCuMarcaje(s, q.variante[i]);
          box.append(el('label', { class: 'optiune' }, inp, s));
        });
        if (q.tip === 'multiplu') item.append(el('p', { class: 'eticheta' }, 'Pot fi mai multe răspunsuri corecte'));
        item.append(box);
        return () => {
          const v = [...box.querySelectorAll('input:checked')].map((x) => +x.value);
          return q.tip === 'unic' ? (v.length ? v[0] : null) : v;
        };
      }
      if (q.tip === 'adevarat') {
        const box = el('div', { class: 'optiuni-grila', style: 'grid-template-columns:1fr 1fr' });
        [['Adevărat', true], ['Fals', false]].forEach(([t, v]) => {
          const inp = el('input', { type: 'radio', name: 'q' + this.idx, value: String(v) });
          if (r === v) inp.checked = true;
          box.append(el('label', { class: 'optiune' }, inp, el('span', null, t)));
        });
        item.append(box);
        return () => { const x = box.querySelector('input:checked'); return x ? x.value === 'true' : null; };
      }
      if (q.tip === 'completare') {
        const inp = el('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Răspunsul tău', value: r || '' });
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') (this.feedback === 'imediat' && !it.verificat ? this.verificaCurent() : this.urmatoarea()); });
        item.append(el('div', { class: 'completare' }, inp));
        return () => inp.value.trim();
      }
      if (q.tip === 'asociere') {
        const dreapta = it.dreapta || (it.dreapta = amesteca(q.perechi.map((p, i) => i)));
        const box = el('div', { class: 'asociere' });
        const sel = q.perechi.map((p, i) => {
          const s = el('select', { 'aria-label': 'Pereche pentru ' + p[0] }, el('option', { value: '' }, '— alege —'), dreapta.map((j) => el('option', { value: j }, q.perechi[j][1])));
          if (r && r[i] != null) s.value = r[i];
          const st = el('div'); htmlCuMarcaje(st, p[0]);
          box.append(el('div', { class: 'rand-asoc' }, st, s));
          return s;
        });
        item.append(box);
        return () => sel.map((s) => (s.value === '' ? null : +s.value));
      }
      if (q.tip === 'formula') {
        const cont = el('div');
        item.append(cont);
        if (!it.wb) it.wb = new FE.Workbook(JSON.parse(JSON.stringify(q.foi)));
        this.sp = new global.Spreadsheet(cont, { workbook: it.wb, inaltime: q.inaltime || 240, tinte: [q.tinta], editabile: it.verificat ? ['ZZ1'] : [q.tinta], toolbar: false, permiteFoi: false });
        this.sp.select(q.tinta.split(':')[0]);
        return () => { if (this.sp && this.sp.edit) this.sp.confirma(); return it.wb.getInput(0, FE.parseRangeAddr(q.tinta).r1, FE.parseRangeAddr(q.tinta).c1); };
      }
      item.append(el('p', null, 'Tip de item necunoscut.'));
      return () => null;
    }

    /* ---------- punctare (0 … 1 pentru fiecare item) ---------- */
    puncteaza(it) {
      const q = it.q, r = it.raspuns;
      it.mesaj = '';
      if (r == null || r === '') return 0;
      switch (q.tip) {
        case 'unic': return r === q.corect ? 1 : 0;
        case 'adevarat': return r === q.corect ? 1 : 0;
        case 'multiplu': {
          const c = new Set(q.corect);
          const bune = r.filter((x) => c.has(x)).length, rele = r.length - bune;
          return Math.max(0, (bune - rele) / c.size);
        }
        case 'completare': return q.raspunsuri.some((x) => normText(x) === normText(r)) ? 1 : 0;
        case 'asociere': return r.filter((x, i) => x === i).length / q.perechi.length;
        case 'formula': {
          if (!it.wb) return 0;
          const m = global.Exercitii.verificaFormula(it.wb, { formula: q.tinta, solutie: q.solutie, functii: q.functii, robust: q.robust });
          it.mesaj = m || '';
          return m ? 0 : 1;
        }
      }
      return 0;
    }
    textCorect(q) {
      const lipeste = (s) => String(s).replace(/<[^>]+>/g, '');
      switch (q.tip) {
        case 'unic': return '„' + lipeste(q.variante[q.corect]) + '”';
        case 'multiplu': return q.corect.map((i) => '„' + lipeste(q.variante[i]) + '”').join(', ');
        case 'adevarat': return q.corect ? 'Adevărat' : 'Fals';
        case 'completare': return '„' + q.raspunsuri[0] + '”';
        case 'asociere': return q.perechi.map((p) => lipeste(p[0]) + ' → ' + lipeste(p[1])).join('; ');
        case 'formula': return '[[' + q.solutie + ']]' + (q.tinta.includes(':') ? ' (copiată în ' + q.tinta + ')' : '');
      }
      return '';
    }

    /* ---------- rezultatul final ---------- */
    termina() {
      clearInterval(this.tic);
      if (this.sp) { this.sp.distruge(); this.sp = null; }
      this.itemi.forEach((it) => { if (!it.verificat) { it.scor = this.puncteaza(it); it.verificat = true; } });
      const total = this.itemi.length;
      const puncte = this.itemi.reduce((s, it) => s + it.scor, 0);
      const nota = Math.round((CT.punctDinOficiu ? 1 + 9 * puncte / total : 10 * puncte / total) * 100) / 100;
      this.rezultat = { nota, puncte: Math.round(puncte * 100) / 100, total, durata: Math.round((Date.now() - this.inceput) / 1000) };
      const bonus = global.Progres ? global.Progres.testTerminat(this.opt.cheie, nota) : 0;
      this.cap.remove();
      this.zona.replaceChildren();
      const rez = el('div', { class: 'quiz-rezultat' },
        el('span', { class: 'eticheta' }, this.opt.titlu),
        el('div', { class: 'nota-mare' + (nota < 5 ? ' slab' : '') }, nota.toFixed(2).replace('.', ',')),
        el('p', null, 'Puncte: ' + this.rezultat.puncte.toString().replace('.', ',') + ' din ' + total + (CT.punctDinOficiu ? ' (+1 din oficiu)' : '') +
          ' · Timp: ' + Math.floor(this.rezultat.durata / 60) + ' min ' + (this.rezultat.durata % 60) + ' s' + (bonus ? ' · +' + bonus + ' puncte de progres' : '')));
      this.zona.append(rez);
      // trimiterea rezultatului către profesor
      const nume = el('input', { type: 'text', placeholder: 'Nume și prenume', 'aria-label': 'Nume și prenume', autocomplete: 'name' });
      const clasa = el('input', { type: 'text', placeholder: 'Clasa (ex. 10A)', 'aria-label': 'Clasa', style: 'max-width:140px' });
      const salvat = global.App.stocare.get('excel-x-elev', {});
      nume.value = salvat.nume || ''; clasa.value = salvat.clasa || '';
      const verificaNume = () => {
        if (!nume.value.trim()) { toast('Scrie-ți numele înainte de a trimite rezultatul.'); nume.focus(); return false; }
        global.App.stocare.set('excel-x-elev', { nume: nume.value.trim(), clasa: clasa.value.trim() });
        return true;
      };
      const numeFisier = () => (this.opt.cheie + '_' + nume.value.trim().replace(/[^\p{L}\d]+/gu, '_')).replace(/_+$/, '');
      this.zona.append(el('div', { class: 'card', style: 'box-shadow:none;margin:8px 0 20px' },
        el('h3', null, 'Trimite rezultatul profesorului'),
        el('div', { class: 'rand-butoane' }, nume, clasa),
        el('div', { class: 'rand-butoane', style: 'margin-top:10px' },
          el('button', { class: 'btn btn-primar', type: 'button', onclick: async () => {
            if (!verificaNume()) return;
            const t = this.text(nume.value, clasa.value);
            try { await navigator.clipboard.writeText(t); toast('Rezultatul a fost copiat. Lipește-l în mesajul către profesor.'); }
            catch (e) { global.App.modal('Copiază manual', el('textarea', { rows: 10, style: 'width:100%', readonly: 'readonly' }, t)); }
          } }, '📋 Copiază rezultatul'),
          el('button', { class: 'btn', type: 'button', onclick: () => { if (verificaNume()) global.Fise.descarcaBlob(numeFisier() + '.txt', this.text(nume.value, clasa.value)); } }, '⬇ Descarcă .txt'),
          el('button', { class: 'btn', type: 'button', onclick: () => { if (verificaNume()) global.Fise.descarcaBlob(numeFisier() + '.json', JSON.stringify(this.json(nume.value, clasa.value), null, 2), 'application/json'); } }, '⬇ Descarcă .json'))));
      // recapitularea itemilor
      const lista = el('div');
      this.itemi.forEach((it, i) => {
        const ok = it.scor >= 0.999;
        const d = el('div', { class: 'ex-feedback ' + (ok ? 'ok' : 'gresit'), style: 'display:block;margin-bottom:10px' });
        htmlCuMarcaje(d, '<b>' + (i + 1) + '.</b> ' + it.q.enunt + '<br><small>' + (ok ? '✓ Corect' : (it.scor > 0 ? '◐ Parțial' : '✗ Greșit') + ' — răspuns corect: ' + this.textCorect(it.q)) + '</small>' +
          (it.mesaj ? '<br><small>' + esc(it.mesaj) + '</small>' : '') + (it.q.explicatie ? '<div class="explicatie">' + it.q.explicatie + '</div>' : ''));
        lista.append(d);
      });
      this.zona.append(el('h3', null, 'Răspunsurile tale'), lista,
        el('div', { class: 'rand-butoane', style: 'margin-top:16px' }, el('button', { class: 'btn', type: 'button', onclick: () => this.start() }, '↺ Încearcă alt test'),
          this.opt.inapoi ? el('a', { class: 'btn btn-fantoma', href: this.opt.inapoi[0] }, this.opt.inapoi[1]) : null));
      global.App.aplicaLimba();
    }
    raspunsText(it) {
      const q = it.q, r = it.raspuns;
      if (r == null || r === '') return '(fără răspuns)';
      if (q.variante) return [].concat(r).map((i) => String(q.variante[i]).replace(/<[^>]+>|\[\[|\]\]/g, '')).join(' | ');
      if (q.tip === 'adevarat') return r ? 'Adevărat' : 'Fals';
      if (q.tip === 'asociere') return r.map((j, i) => q.perechi[i][0] + ' → ' + (j == null ? '?' : q.perechi[j][1])).join('; ').replace(/<[^>]+>|\[\[|\]\]/g, '');
      return String(r);
    }
    json(nume, clasa) {
      const d = {
        elev: nume.trim(), clasa: clasa.trim(), test: this.opt.titlu, cheie: this.opt.cheie, data: new Date().toLocaleString('ro-RO'),
        nota: this.rezultat.nota, puncte: this.rezultat.puncte, itemi: this.rezultat.total, durataSecunde: this.rezultat.durata,
        raspunsuri: this.itemi.map((it, i) => ({ nr: i + 1, id: it.q.id, tip: it.q.tip, raspuns: this.raspunsText(it), scor: Math.round(it.scor * 100) / 100 }))
      };
      // cod de control simplu — ajută la observarea modificărilor, NU este o protecție reală
      d.cod = cod(JSON.stringify([d.elev, d.nota, d.raspunsuri.map((x) => x.scor)]));
      return d;
    }
    text(nume, clasa) {
      const d = this.json(nume, clasa);
      return [(CFG.scoala || ''), 'Test: ' + d.test, 'Elev: ' + d.elev + (d.clasa ? ' · Clasa: ' + d.clasa : ''), 'Data: ' + d.data,
        'NOTA: ' + String(d.nota).replace('.', ',') + '  (puncte ' + String(d.puncte).replace('.', ',') + ' din ' + d.itemi + ')',
        'Timp: ' + Math.floor(d.durataSecunde / 60) + ' min ' + (d.durataSecunde % 60) + ' s', '',
        ...d.raspunsuri.map((x) => x.nr + '. [' + (x.scor >= 1 ? '✓' : x.scor > 0 ? '½' : '✗') + '] ' + x.raspuns), '', 'Cod de control: ' + d.cod].join('\n');
    }
  }
  function cod(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36).toUpperCase(); }

  global.Teste = { Test, extrage };
})(window);
