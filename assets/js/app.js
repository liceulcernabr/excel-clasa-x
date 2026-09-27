/* =====================================================================
   app.js — Elemente comune tuturor paginilor
   • antetul și subsolul, meniul, tema luminoasă/întunecată
   • comutatorul pentru separatorul din formule („,” sau „;”)
   • modul profesor (Ctrl+Alt+P sau 5 clicuri pe siglă)
   • stocare sigură (localStorage cu try/catch) și utilitare
   ===================================================================== */
(function (global) {
  'use strict';
  const CFG = global.CONFIG || {};
  const FE = global.FormulaEngine;

  // Rădăcina site-ului, dedusă din adresa acestui fișier (merge și offline)
  const scriptCurent = document.currentScript;
  const RADACINA = scriptCurent ? scriptCurent.src.replace(/assets\/js\/app\.js(\?.*)?$/, '') : './';

  /* ---------- Stocare sigură ---------- */
  const memorie = {};
  const stocare = {
    get(cheie, implicit) {
      try {
        const v = global.localStorage.getItem(cheie);
        return v == null ? implicit : JSON.parse(v);
      } catch (e) { return cheie in memorie ? memorie[cheie] : implicit; }
    },
    set(cheie, val) {
      memorie[cheie] = val;
      try { global.localStorage.setItem(cheie, JSON.stringify(val)); return true; } catch (e) { return false; }
    },
    sesiune: {
      get(cheie) { try { return global.sessionStorage.getItem(cheie); } catch (e) { return memorie['s:' + cheie] || null; } },
      set(cheie, v) { memorie['s:' + cheie] = v; try { global.sessionStorage.setItem(cheie, v); } catch (e) { /* fără stocare */ } },
      del(cheie) { delete memorie['s:' + cheie]; try { global.sessionStorage.removeItem(cheie); } catch (e) { /* fără stocare */ } }
    }
  };

  /* ---------- Utilitare DOM ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function el(tag, attrs, ...copii) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === false || v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const c of copii.flat(Infinity)) if (c != null && c !== false) e.append(c.nodeType ? c : String(c));
    return e;
  }
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

  function amesteca(arr) {       // amestecare Fisher–Yates
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Încarcă un script (ex. SheetJS sau datele unei lecții) — funcționează și din fișier
  const scripturi = {};
  function incarcaScript(src) {
    if (scripturi[src]) return scripturi[src];
    scripturi[src] = new Promise((ok, nu) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => ok();
      s.onerror = () => { delete scripturi[src]; nu(new Error('Nu s-a putut încărca ' + src)); };
      document.head.append(s);
    });
    return scripturi[src];
  }

  /* ---------- Separatorul din formule ----------
     Numele funcțiilor sunt mereu în engleză (așa sunt în Excel).
     Separatorul de argumente depinde de setările regionale ale
     calculatorului: „,” (setări englezești) sau „;” (setări românești,
     unde și zecimalele se scriu cu virgulă). */
  let separator = stocare.get('excel-x-separator', CFG.separatorFormule || ',');
  function aplicaLimba() {
    $$('[data-f]').forEach(randeazaFormula);
    $$('[data-fn]').forEach(randeazaFunctie);
    const b = $('#btn-limba');
    if (b) {
      b.textContent = separator === ';' ? 'a;b' : 'a,b';
      b.title = 'Separatorul din formule: ' + (separator === ';' ? '„;” (setări românești: =ROUND(A1;2), zecimale cu virgulă)' : '„,” (setări englezești: =ROUND(A1,2), zecimale cu punct)') + '. Apasă pentru a schimba.';
    }
    document.dispatchEvent(new CustomEvent('app:separator', { detail: separator }));
  }
  function formula(f) { return separator === ';' && FE ? FE.cuSeparator(f, ';') : f; }
  function randeazaFormula(n) { n.textContent = formula(n.getAttribute('data-f')); }
  function randeazaFunctie(n) {
    const en = n.getAttribute('data-fn');
    const tr = FE ? FE.traducere(en) : '';
    n.innerHTML = esc(en) + (tr ? ' <span class="ro">(' + esc(tr) + ')</span>' : '');
  }
  // Transformă marcajele din textele lecțiilor:
  //   [[=SUM(A1:A5)]]  → formulă (cu „,” sau „;”, după comutator)
  //   [[fn:VLOOKUP]]   → VLOOKUP (căutare verticală)
  //   [[k:Ctrl+C]]     → tastă
  function marcaje(html) {
    return String(html)
      .replace(/\[\[fn:([A-Z.]+)\]\]/g, (m, f) => '<span class="fn-pereche" data-fn="' + f + '"></span>')
      .replace(/\[\[k:([^\]]+)\]\]/g, (m, k) => k.split('+').map((x) => '<kbd>' + esc(x) + '</kbd>').join('+'))
      .replace(/\[\[(=.*?)\]\]/g, (m, f) => '<code class="f" data-f="' + esc(f) + '"></code>');
  }
  function htmlCuMarcaje(container, html) {
    container.innerHTML = marcaje(html);
    $$('[data-f]', container).forEach(randeazaFormula);
    $$('[data-fn]', container).forEach(randeazaFunctie);
    return container;
  }

  /* ---------- Tema ---------- */
  function temaCurenta() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function comutaTema() {
    const t = temaCurenta() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    stocare.set('excel-x-tema', t);
    const b = $('#btn-tema'); if (b) b.textContent = t === 'dark' ? '☀' : '☾';
  }
  const temaSalvata = stocare.get('excel-x-tema', null);
  if (temaSalvata) document.documentElement.setAttribute('data-theme', temaSalvata);

  /* ---------- Toast (mesaje scurte) ---------- */
  function toast(text, clasa) {
    let z = $('.toast-zona');
    if (!z) { z = el('div', { class: 'toast-zona', 'aria-live': 'polite' }); document.body.append(z); }
    const t = el('div', { class: 'toast ' + (clasa || '') }, text);
    z.append(t);
    setTimeout(() => t.remove(), 3800);
  }

  /* ---------- Fereastră modală ---------- */
  function modal(titlu, continut, butoane) {
    return new Promise((gata) => {
      const fundal = el('div', { class: 'modal-fundal', role: 'dialog', 'aria-modal': 'true', 'aria-label': titlu });
      const m = el('div', { class: 'modal' }, el('h3', null, titlu));
      if (continut) m.append(continut);
      const rb = el('div', { class: 'rand-butoane' });
      const inchide = (v) => { fundal.remove(); document.removeEventListener('keydown', k); gata(v); };
      for (const [text, valoare, clasa] of butoane || [['Închide', null]]) {
        rb.append(el('button', { class: 'btn ' + (clasa || ''), type: 'button', onclick: () => inchide(typeof valoare === 'function' ? valoare() : valoare) }, text));
      }
      m.append(rb);
      fundal.append(m);
      fundal.addEventListener('pointerdown', (e) => { if (e.target === fundal) inchide(null); });
      const k = (e) => { if (e.key === 'Escape') inchide(null); };
      document.addEventListener('keydown', k);
      document.body.append(fundal);
      const f = m.querySelector('input, button.btn-primar, button');
      if (f) f.focus();
    });
  }

  /* ---------- Modul profesor ----------
     NU este o protecție reală: parola se află în config.js, iar
     conținutul ascuns există oricum în codul paginii. */
  function modProfesor() { return stocare.sesiune.get('excel-x-profesor') === '1'; }
  function aplicaModProfesor() {
    document.body.classList.toggle('mod-profesor', modProfesor());
    document.dispatchEvent(new CustomEvent('app:profesor', { detail: modProfesor() }));
  }
  async function cerereModProfesor() {
    if (modProfesor()) {
      stocare.sesiune.del('excel-x-profesor');
      aplicaModProfesor();
      toast('Modul profesor a fost dezactivat.');
      return;
    }
    const inp = el('input', { type: 'password', autocomplete: 'off', 'aria-label': 'Parola', placeholder: 'Parola' });
    const cont = el('div', null, el('p', null, 'Introdu parola pentru a vedea baremele și soluțiile.'), inp,
      el('p', { style: 'font-size:.85rem;color:var(--cerneala-3);margin-top:10px' }, 'Atenție: nu este o protecție reală, ci doar o ascundere a soluțiilor.'));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); cont.closest('.modal').querySelector('.btn-primar').click(); } });
    const val = await modal('Modul profesor', cont, [['Renunță', null], ['Activează', () => inp.value, 'btn-primar']]);
    if (val == null) return;
    if (val === CFG.parolaProfesor) {
      stocare.sesiune.set('excel-x-profesor', '1');
      aplicaModProfesor();
      toast('Modul profesor este activ: baremele și soluțiile sunt vizibile.');
    } else toast('Parolă greșită.');
  }

  /* ---------- Antet și subsol ---------- */
  function antet(opt) {
    const R = RADACINA;
    const link = (href, text, cheie) => el('a', { href: R + href, 'aria-current': opt.activ === cheie ? 'page' : false }, text);
    const nav = el('nav', { id: 'nav-principal', 'aria-label': 'Navigare principală' },
      link('index.html', 'Lecții', 'acasa'),
      link('teste/index.html', 'Teste', 'teste'),
      link('olimpiada/index.html', 'Olimpiadă', 'olimpiada'),
      link('functii.html', 'Funcții', 'functii'));
    const sigla = el('a', { class: 'sigla', href: R + 'index.html', title: 'Pagina principală' },
      el('span', { class: 'sigla-cursor', 'aria-hidden': 'true' }, 'X'),
      el('span', null, 'Excel · clasa a X-a', el('small', null, 'Liceul „Panait Cerna” Brăila')));
    // 5 clicuri rapide pe siglă → modul profesor
    let clicuri = 0, t0 = 0;
    sigla.addEventListener('click', (e) => {
      const acum = Date.now();
      clicuri = acum - t0 < 600 ? clicuri + 1 : 1; t0 = acum;
      if (clicuri >= 5) { e.preventDefault(); clicuri = 0; cerereModProfesor(); }
      else if (clicuri > 1) e.preventDefault();
    });
    const puncte = el('span', { class: 'puncte-sus', id: 'puncte-sus', title: 'Punctele tale' }, '0 p');
    const btnTema = el('button', { class: 'btn-icon', id: 'btn-tema', type: 'button', title: 'Temă luminoasă / întunecată', 'aria-label': 'Schimbă tema', onclick: comutaTema }, temaCurenta() === 'dark' ? '☀' : '☾');
    const btnLimba = el('button', { class: 'btn-icon comut-limba', id: 'btn-limba', type: 'button', 'aria-label': 'Separatorul din formule',
      onclick: () => { separator = separator === ',' ? ';' : ','; stocare.set('excel-x-separator', separator); aplicaLimba();
        toast(separator === ';' ? 'Formulele se afișează cu „;”: =ROUND(A1;2) — ca în Excel cu setări regionale românești.' : 'Formulele se afișează cu „,”: =ROUND(A1,2) — ca în Excel cu setări englezești.'); } }, 'a,b');
    const btnMeniu = el('button', { class: 'btn-icon meniu-mobil', type: 'button', 'aria-label': 'Meniu', 'aria-expanded': 'false', 'aria-controls': 'nav-principal',
      onclick: (e) => { const d = nav.classList.toggle('deschis'); e.currentTarget.setAttribute('aria-expanded', d); } }, '☰');
    const bara = el('header', { class: 'bara-sus' },
      el('div', { class: 'interior' }, sigla,
        opt.casetaNume ? el('span', { class: 'caseta-nume', title: 'Unde te afli' }, opt.casetaNume) : null,
        el('span', { class: 'eticheta-profesor' }, 'mod profesor'),
        btnMeniu, nav, el('div', { class: 'unelte' }, puncte, btnLimba, btnTema)));
    document.body.prepend(bara);
  }
  function subsol() {
    document.body.append(el('footer', { class: 'subsol' },
      el('div', { class: 'interior' },
        el('span', null, (CFG.scoala || '') + ' · ' + (CFG.disciplina || 'TIC') + ' · clasa ' + (CFG.clasa || 'a X-a')),
        el('span', null, (CFG.profesor || '') + ' · ' + (CFG.anScolar || '')))));
  }

  /* ---------- Fonturi (de pe jsdelivr; fără internet se folosesc fonturile sistemului) ---------- */
  function fonturi() {
    ['@fontsource-variable/bricolage-grotesque@5/index.css', '@fontsource-variable/source-sans-3@5/index.css',
      '@fontsource-variable/jetbrains-mono@5/index.css', '@fontsource-variable/caveat@5/index.css']
      .forEach((p) => document.head.append(el('link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/' + p })));
  }

  /* ---------- Inițializare ---------- */
  function init(opt) {
    opt = opt || {};
    fonturi();
    antet(opt);
    subsol();
    aplicaModProfesor();
    aplicaLimba();
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); cerereModProfesor(); }
    });
    if (global.Progres) global.Progres.actualizeazaAntet();
  }

  global.App = {
    init, el, $, $$, esc, amesteca, incarcaScript, stocare, toast, modal, marcaje, htmlCuMarcaje,
    formula, aplicaLimba, separator: () => separator, modProfesor, cerereModProfesor, RADACINA, CFG
  };
})(window);
