/* =====================================================================
   lectie.js — Construiește pagina unei ore din datele ei
   (data/lectii/ora-XX.js definește window.DATE_LECTII[XX])
   Fiecare fișier lectii/ora-XX.html doar apelează Lectie.porneste(XX).
   ===================================================================== */
(function (global) {
  'use strict';
  const { el, esc, htmlCuMarcaje, $$ } = global.App;
  const pad = (n) => String(n).padStart(2, '0');

  function porneste(nr) {
    global.App.init({ activ: 'acasa', casetaNume: 'Ora ' + pad(nr) });
    const L = (global.DATE_LECTII || {})[nr];
    const main = document.getElementById('continut');
    const info = (global.CUPRINS || []).find((x) => x.nr === nr) || {};
    if (!L) {
      main.append(el('div', { class: 'card ingust' }, el('span', { class: 'eticheta' }, 'Ora ' + pad(nr)), el('h1', null, info.titlu || 'Lecție'),
        el('p', null, 'Conținutul acestei ore va fi adăugat în curând.'), el('a', { class: 'btn', href: '../index.html' }, '← Înapoi la harta lecțiilor')));
      return;
    }
    document.title = 'Ora ' + nr + ': ' + L.titlu + ' · Excel clasa a X-a';
    const ex = L.exercitii || [];
    if (global.Progres) global.Progres.seteazaTotal(nr, ex.length);

    // ---- antetul lecției ----
    const procent = el('span');
    const bara = el('div', { class: 'bara-progres' }, el('span'));
    const actualizeazaProgres = () => {
      const p = global.Progres ? global.Progres.procentOra(nr) : 0;
      bara.firstChild.style.width = p + '%';
      procent.textContent = p + '%';
      $$('.cuprins-lectie a[data-sect="exercitii"] .bifa').forEach((b) => {
        const facute = ex.filter((x) => global.Progres && global.Progres.eRezolvat(nr, x.id)).length;
        b.textContent = facute + '/' + ex.length;
      });
    };
    const cap = el('header', { class: 'lectie-cap' },
      el('div', null,
        el('span', { class: 'numar-ora' }, 'ORA ' + pad(nr) + ' / 15', L.durata ? el('span', { style: 'color:var(--cerneala-3)' }, '· ' + L.durata + ' min') : null),
        el('h1', null, L.titlu),
        L.rezumat ? htmlCuMarcaje(el('p', { class: 'rezumat' }), L.rezumat) : null),
      el('div', { class: 'lectie-progres' }, el('div', { class: 'rand' }, el('span', null, 'Progresul tău la această oră'), procent), bara));
    main.append(cap);

    // ---- secțiunile ----
    const sectiuni = [];
    const sectiune = (id, titlu, eticheta) => {
      const s = el('section', { class: 'sectiune', id }, el('h2', null, titlu, eticheta ? el('span', { class: 'eticheta' }, eticheta) : null));
      sectiuni.push([id, titlu, s]);
      return s;
    };
    const corp = el('div');

    if (L.obiective) {
      const s = sectiune('obiective', 'Ce vei învăța');
      s.append(el('ul', { class: 'obiective' }, L.obiective.map((o) => htmlCuMarcaje(el('li'), o))));
      corp.append(s);
    }
    if (L.teorie) {
      const s = sectiune('teorie', 'Teorie', L.teorie.length + ' idei');
      L.teorie.forEach((t, i) => {
        const b = el('div', { class: 'card teorie-bloc', id: 'teorie-' + (i + 1) });
        b.append(el('h3', null, t.titlu));
        const d = el('div'); htmlCuMarcaje(d, t.html); b.append(d);
        s.append(b);
      });
      corp.append(s);
    }
    if (L.simulator) {
      const s = sectiune('incearca', L.simulator.titlu || 'Încearcă în simulator');
      if (L.simulator.text) s.append(htmlCuMarcaje(el('div', { style: 'margin-bottom:12px' }), L.simulator.text));
      const cont = el('div');
      s.append(cont);
      corp.append(s);
      setTimeout(() => {
        const sp = new global.Spreadsheet(cont, { def: JSON.parse(JSON.stringify(L.simulator.foi)), inaltime: L.simulator.inaltime || 380, permiteFoi: true });
        global.simulatorLectie = sp;   // accesibil din consolă, pentru demonstrații
      });
    }
    if (L.animatii && L.animatii.length) {
      const s = sectiune('animatii', 'Pas cu pas', L.animatii.length + (L.animatii.length === 1 ? ' animație' : ' animații'));
      L.animatii.forEach((a) => global.Animatii.randeaza(s, a));
      corp.append(s);
    }
    if (ex.length) {
      const s = sectiune('exercitii', 'Exerciții', ex.length + ' exerciții · ' + ex.reduce((t, x) => t + (x.puncte || 10), 0) + ' p');
      s.append(el('p', { style: 'color:var(--cerneala-2)' }, 'Primești punctele întregi dacă rezolvi fără indicii. Fiecare indiciu scade punctajul, iar după ce vezi soluția exercițiul nu mai aduce puncte.'));
      ex.forEach((x) => global.Exercitii.randeaza(s, x, { ora: nr, onRezolvat: actualizeazaProgres }));
      corp.append(s);
    }
    if (L.fisa) {
      const s = sectiune('fisa', 'Fișa de lucru');
      global.Fise.randeazaInLectie(s, L.fisa, nr);
      corp.append(s);
    }
    {
      const s = sectiune('test', 'Mini-test');
      const nota = global.Progres ? global.Progres.notaTest('ora-' + nr) : null;
      s.append(el('div', { class: 'card' },
        el('p', null, 'Verifică-te cu un test scurt: ' + ((global.App.CFG.teste || {}).itemiMiniTest || 7) + ' întrebări extrase la întâmplare din banca orei ' + nr + '.'),
        nota != null ? el('p', null, 'Cea mai bună notă a ta: ', el('b', null, String(nota).replace('.', ','))) : null,
        el('a', { class: 'btn btn-primar', href: '../teste/test.html?ora=' + nr }, 'Începe mini-testul →')));
      corp.append(s);
    }

    // ---- navigare între ore ----
    const prev = (global.CUPRINS || []).find((x) => x.nr === nr - 1);
    const next = (global.CUPRINS || []).find((x) => x.nr === nr + 1);
    corp.append(el('nav', { class: 'navigare-lectii', 'aria-label': 'Lecția anterioară și următoarea' },
      prev ? el('a', { class: 'btn', href: 'ora-' + pad(prev.nr) + '.html' }, '← Ora ' + prev.nr + ': ' + prev.titlu) : el('span'),
      next ? el('a', { class: 'btn', href: 'ora-' + pad(next.nr) + '.html' }, 'Ora ' + next.nr + ': ' + next.titlu + ' →') : el('span')));

    // ---- cuprinsul lateral ----
    const cuprins = el('nav', { class: 'cuprins-lectie', 'aria-label': 'Cuprinsul lecției' },
      el('ol', null, sectiuni.map(([id, titlu]) => el('li', null, el('a', { href: '#' + id, 'data-sect': id }, titlu, id === 'exercitii' ? el('span', { class: 'bifa' }) : null)))));
    main.append(el('div', { class: 'lectie-corp' }, cuprins, corp));
    actualizeazaProgres();
    global.App.aplicaLimba();

    // evidențierea secțiunii curente în cuprins
    if ('IntersectionObserver' in global) {
      const linkuri = $$('.cuprins-lectie a');
      const obs = new IntersectionObserver((intrari) => {
        intrari.forEach((i) => {
          if (i.isIntersecting) linkuri.forEach((a) => a.classList.toggle('activ', a.dataset.sect === i.target.id));
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      sectiuni.forEach(([, , s]) => obs.observe(s));
    }
    if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }, 50);
  }

  global.Lectie = { porneste };
})(window);
