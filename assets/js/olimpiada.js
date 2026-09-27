/* =====================================================================
   olimpiada.js — Modulul de antrenament pentru Olimpiada de TIC
   • pagina principală (lista subiectelor de antrenament)
   • pagina unui subiect: cronometru, spațiu de lucru, verificare pe
     cerințe, predare, soluții pas cu pas
   • sprintul de formule cu clasament local
   Subiectele sunt create pentru antrenament, după modelul olimpiadei;
   NU sunt subiecte oficiale.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const { el, esc, htmlCuMarcaje, toast, modal, stocare, amesteca, CFG } = global.App;
  const pad = (n) => String(n).padStart(2, '0');
  const ceas = (sec) => { sec = Math.max(0, Math.round(sec)); return pad(Math.floor(sec / 60)) + ':' + pad(sec % 60); };
  const AVERTISMENT = 'Subiect de antrenament creat după modelul cerințelor de la Olimpiada de TIC (secțiunea Excel). Nu este un subiect oficial, iar datele sunt fictive.';

  function avertisment(text) {
    return el('div', { class: 'ol-avertisment', role: 'note' }, el('b', null, 'De reținut:'), el('span', null, text || AVERTISMENT));
  }
  function dificultate(n) {
    return el('span', { class: 'ol-dificultate', title: 'Dificultate ' + n + ' din 3', 'aria-label': 'Dificultate ' + n + ' din 3' }, [1, 2, 3].map((i) => el('i', { class: i <= n ? 'plin' : '' })));
  }

  /* ------------------------------------------------------------------
     Salvarea lucrului în browser (ca să nu se piardă la reîncărcare)
     ------------------------------------------------------------------ */
  function serializeaza(wb) {
    return wb.sheets.map((sh) => {
      const o = {};
      for (const k in sh) if (k !== 'cells' && k !== 'hiddenRows') o[k] = sh[k];
      o.hiddenRows = [...sh.hiddenRows];
      o.cells = [...sh.cells].map(([k, c]) => [k, { input: c.input, fmt: c.fmt, bold: c.bold, italic: c.italic, fill: c.fill, align: c.align, border: c.border, deblocata: c.deblocata }]);
      return o;
    });
  }
  function restaureaza(date) {
    const wb = new FE.Workbook({});
    wb.sheets = date.map((s) => Object.assign({}, s, { hiddenRows: new Set(s.hiddenRows || []), cells: new Map(s.cells) }));
    wb.recalc();
    return wb;
  }

  /* ------------------------------------------------------------------
     Pagina principală a modulului
     ------------------------------------------------------------------ */
  function paginaIndex(c) {
    const S = global.SUBIECTE_OLIMPIADA || [];
    const st = global.Progres ? global.Progres.stare().olimpiada : {};
    const facute = S.filter((s) => st['subiect-' + s.id]).length;
    c.append(el('section', { class: 'ol-erou' },
      el('div', null,
        el('span', { class: 'ol-eticheta' }, 'Antrenament · Olimpiada de TIC · secțiunea Excel'),
        el('h1', null, 'Pe pistă, cu cronometrul pornit.'),
        el('p', null, 'Subiecte complete, lucrate contra-timp, cu punctaj pe cerințe și soluții explicate după ce predai. Plus un sprint de formule și trucurile care fac diferența în concurs.')),
      el('div', { class: 'ol-cronometru-mare', 'aria-label': 'Progresul tău la subiecte' },
        el('div', { class: 'ecran ol-cifre' }, pad(facute) + ' / ' + pad(S.length)),
        el('div', { class: 'sub' }, 'subiecte de antrenament predate'),
        el('div', { class: 'ture', 'aria-hidden': 'true' }, S.map((s) => el('span', { class: st['subiect-' + s.id] ? 'facut' : '' }))))));
    c.append(avertisment('Subiectele de pe această pagină sunt create pentru antrenament, după modelul tipurilor de cerințe întâlnite la Olimpiada de TIC. Nu sunt subiecte oficiale și nu provin din concursuri reale. Datele sunt fictive.'));

    c.append(el('h2', { style: 'margin-top:28px' }, 'Subiecte de antrenament'));
    const g = el('div', { class: 'ol-grila' });
    S.forEach((s) => {
      const r = st['subiect-' + s.id];
      g.append(el('a', { class: 'ol-card', href: 'subiect.html?id=' + s.id },
        el('span', { class: 'nr' }, pad(s.id)),
        el('h3', null, s.titlu),
        el('div', { class: 'meta' }, dificultate(s.dificultate), el('span', { class: 'ol-cifre' }, '⏱ ' + s.timp + ' min'), el('span', { class: 'ol-cifre' }, '100 p'), el('span', null, s.cerinte.length + ' cerințe')),
        el('div', null, s.tipologie.slice(0, 4).map((t) => el('span', { class: 'ol-tag' }, t))),
        r ? el('span', { class: 'rezultat' }, '✓ Predat · ' + r.puncte + ' p verificate automat') : null));
    });
    c.append(g);

    c.append(el('h2', { style: 'margin-top:32px' }, 'Pregătire rapidă'));
    const sprint = st.sprint;
    c.append(el('div', { class: 'ol-grila' },
      el('a', { class: 'ol-card special', href: 'sprint.html' }, el('span', { class: 'ol-eticheta' }, 'Sprint de formule'), el('h3', null, '8 provocări, 5 minute'),
        el('p', null, 'Scrii formula, apeși Enter, treci mai departe. Punctaj pentru viteză și clasament local.' + (sprint ? ' Cel mai bun scor al tău: ' + sprint.puncte + '.' : ''))),
      el('a', { class: 'ol-card special', href: 'trucuri.html' }, el('span', { class: 'ol-eticheta' }, 'Trucuri și capcane'), el('h3', null, 'Scurtături și greșeli frecvente'),
        el('p', null, 'Ce să faci în primele 5 minute, cum verifici o formulă și unde se pierd punctele cel mai des.')),
      el('a', { class: 'ol-card special', href: '../functii.html' }, el('span', { class: 'ol-eticheta' }, 'Dicționar'), el('h3', null, 'Toate funcțiile'),
        el('p', null, 'Sintaxa și exemple pentru funcțiile din curs, pe care le folosești și la concurs.'))));

    c.append(el('h2', { style: 'margin-top:32px' }, 'Tipologia cerințelor'));
    const t = el('table', { class: 'tabel' }, el('tr', null, el('th', null, 'Tip de cerință'), el('th', null, 'Unde îl exersezi')));
    [['Formule complexe și imbricate (IF în IF, IF cu AND/OR, funcții în funcții)', 'orele 5–6; subiectele 1, 2, 4'],
      ['Funcții de căutare (VLOOKUP exact și aproximativ, HLOOKUP, XLOOKUP, INDEX+MATCH)', 'ora 9; subiectele 1, 2, 3, 6'],
      ['Funcții condiționale cu mai multe criterii (COUNTIFS, SUMIFS, AVERAGEIFS, MAXIFS)', 'ora 7; subiectele 1, 3, 4, 5'],
      ['Formatare condiționată cu formulă (rânduri întregi, $ la coloană)', 'ora 11; subiectele 1, 2'],
      ['Validarea datelor (liste, intervale, mesaje de eroare)', 'ora 11; subiectele 2, 3, 5, 6'],
      ['Diagrame cu cerințe precise (tip, titlu, titluri de axe, etichete)', 'ora 12; subiectele 1, 3, 5, 6'],
      ['Tabele pivot și subtotaluri', 'ora 13; subiectele 3, 4'],
      ['Sortări pe mai multe niveluri, filtru automat și avansat', 'ora 10; subiectele 1, 2, 4, 5'],
      ['Lucrul cu mai multe foi (referințe între foi, 3D, protecție, imprimare)', 'ora 14; subiectele 2, 6']
    ].forEach(([a, b]) => t.append(el('tr', null, el('td', null, a), el('td', null, b))));
    c.append(el('div', { class: 'card tabel-scroll', style: 'padding:0' }, t));
  }

  /* ------------------------------------------------------------------
     Pagina unui subiect
     ------------------------------------------------------------------ */
  function paginaSubiect(c, id) {
    const sub = (global.SUBIECTE_OLIMPIADA || []).find((s) => s.id === id);
    if (!sub) { c.append(el('div', { class: 'card' }, 'Subiectul nu există. ', el('a', { href: 'index.html' }, 'Înapoi la lista subiectelor'))); return; }
    document.title = 'Subiectul ' + id + ': ' + sub.titlu + ' · Antrenament olimpiadă';
    const CHEIE = 'excel-x-ol-subiect-' + id;
    let stare = stocare.get(CHEIE, null) || { verificari: {}, auto: {}, predat: false, ramas: sub.timp * 60, pornit: false };

    c.append(el('a', { href: 'index.html', class: 'btn btn-mic btn-fantoma' }, '← Toate subiectele'));
    c.append(el('div', { style: 'margin-top:14px' },
      el('span', { class: 'ol-eticheta' }, 'Subiect de antrenament ' + pad(id)),
      el('h1', { style: 'margin:6px 0 8px' }, sub.titlu),
      el('div', { class: 'ol-card-meta', style: 'display:flex;gap:6px 16px;flex-wrap:wrap;align-items:center;color:var(--cerneala-2)' },
        dificultate(sub.dificultate), el('span', { class: 'ol-cifre' }, 'Timp recomandat: ' + sub.timp + ' min'), el('span', { class: 'ol-cifre' }, 'Punctaj: 100 p'),
        el('span', null, sub.cerinte.length + ' cerințe'))));
    c.append(avertisment());
    c.append(htmlCuMarcaje(el('p', { style: 'font-size:1.05rem;max-width:90ch' }), sub.context));

    // ---- bara cu cronometrul ----
    const afisCeas = el('span', { class: 'ceas', role: 'timer', 'aria-live': 'off' }, ceas(stare.ramas));
    const btnStart = el('button', { class: 'btn btn-mic btn-primar', type: 'button' });
    const btnPredau = el('button', { class: 'btn btn-mic', type: 'button' }, 'Predau și văd soluțiile');
    const scor = el('span', { class: 'scor' });
    const bara = el('div', { class: 'ol-bara' }, afisCeas, btnStart,
      el('button', { class: 'btn btn-mic', type: 'button', onclick: () => global.Fise.descarcaXlsx({ foi: sub.foi, fisier: sub.fisier }) }, '⬇ Fișierul de pornire (.xlsx)'),
      btnPredau,
      el('button', { class: 'btn btn-mic', type: 'button', onclick: async () => {
        const da = await modal('Reîncepi subiectul?', el('p', null, 'Lucrul salvat în browser, verificările și cronometrul se vor șterge.'), [['Renunță', false], ['Reîncepe', true, 'btn-rosu']]);
        if (da) { try { localStorage.removeItem(CHEIE); } catch (e) { /* fără stocare */ } location.reload(); }
      } }, '↺ Reîncepe'),
      scor);
    c.append(bara);

    let timer = null;
    const salveaza = () => stocare.set(CHEIE, Object.assign(stare, { wb: serializeaza(sp.wb) }));
    const actualizeazaStart = () => { btnStart.textContent = timer ? '⏸ Pauză' : stare.ramas < sub.timp * 60 ? '▶ Continuă' : '▶ Pornește cronometrul'; };
    btnStart.addEventListener('click', () => {
      if (timer) { clearInterval(timer); timer = null; }
      else {
        let ultim = Date.now();
        timer = setInterval(() => {
          const acum = Date.now(); stare.ramas -= (acum - ultim) / 1000; ultim = acum;
          afisCeas.textContent = ceas(stare.ramas);
          if (stare.ramas <= 0) {
            clearInterval(timer); timer = null; stare.ramas = 0; afisCeas.classList.add('expirat');
            toast('Timpul recomandat s-a încheiat. Poți continua sau poți preda lucrarea.');
          }
          if (Math.round(stare.ramas) % 10 === 0) salveaza();
        }, 500);
      }
      actualizeazaStart();
    });
    if (stare.ramas <= 0) afisCeas.classList.add('expirat');
    actualizeazaStart();

    // ---- spațiul de lucru ----
    const lucru = el('div', { class: 'ol-lucru' });
    const panouCerinte = el('aside', { class: 'ol-cerinte', 'aria-label': 'Cerințele subiectului' });
    const panouFoaie = el('div');
    lucru.append(panouCerinte, panouFoaie);
    c.append(lucru);
    const def = JSON.parse(JSON.stringify(sub.foi));
    let wbInitial = null;
    if (stare.wb) { try { wbInitial = restaureaza(stare.wb); } catch (e) { wbInitial = null; } }
    const sp = new global.Spreadsheet(panouFoaie, { workbook: wbInitial || new FE.Workbook(def), inaltime: 520, permiteFoi: true });
    global.simulatorOlimpiada = sp;
    let tSalvare = null;
    sp.on('change', () => { clearTimeout(tSalvare); tSalvare = setTimeout(salveaza, 600); });
    panouFoaie.append(el('p', { style: 'font-size:.88rem;color:var(--cerneala-3);margin-top:8px' },
      'Lucrul se salvează automat în acest browser. Poți lucra și în Excel, pe fișierul de pornire; atunci verifică-te singur după barem și soluții, după predare.'));

    // ---- cerințele ----
    const elemente = {};
    const calculeazaScor = () => {
      let auto = 0, maxAuto = 0, declarat = 0;
      sub.cerinte.forEach((cr) => {
        if (cr.manual) { if (stare.auto[cr.nr]) declarat += cr.puncte; }
        else { maxAuto += cr.puncte; if (stare.verificari[cr.nr] === true) auto += cr.puncte; }
      });
      scor.replaceChildren('Verificat automat: ', el('b', null, auto + '/' + maxAuto), '  ·  autoevaluare: ', el('b', null, String(declarat)), '  ·  total: ', el('b', null, (auto + declarat) + '/100'));
      return { auto, declarat };
    };
    const arataSolutii = () => {
      sub.cerinte.forEach((cr) => { const e = elemente[cr.nr]; if (e && !e.solutie.isConnected) e.box.append(e.solutie); });
      btnPredau.textContent = 'Lucrare predată · soluțiile sunt afișate';
      btnPredau.disabled = true;
    };
    sub.cerinte.forEach((cr) => {
      const box = el('article', { class: 'ol-cerinta' });
      const rez = el('div', { class: 'rez', role: 'status' });
      box.append(el('div', { class: 'cap' }, el('span', { class: 'n' }, 'C' + cr.nr), el('span', { class: 'p' }, cr.puncte + ' p')));
      box.append(htmlCuMarcaje(el('div', { class: 'text' }), cr.text));
      if (cr.manual) {
        const cb = el('input', { type: 'checkbox' }); cb.checked = !!stare.auto[cr.nr];
        cb.addEventListener('change', () => { stare.auto[cr.nr] = cb.checked; salveaza(); calculeazaScor(); });
        box.append(el('label', { class: 'comutator', style: 'margin-top:8px;font-size:.9rem' }, cb, 'Am rezolvat (autoevaluare — nu se poate verifica automat aici)'));
      } else {
        box.append(el('div', { class: 'rand-butoane', style: 'margin-top:8px' }, el('button', { class: 'btn btn-mic', type: 'button', onclick: () => {
          if (sp.edit && !sp.confirma()) return;
          const m = global.Exercitii.verificaReguli(sp, cr.reguli, { foi: sub.foi });
          stare.verificari[cr.nr] = !m;
          box.classList.toggle('ok', !m); box.classList.toggle('gresit', !!m);
          rez.className = 'rez ' + (m ? 'gresit' : 'ok');
          rez.textContent = m ? m : '✓ Cerința este rezolvată corect (+' + cr.puncte + ' p).';
          salveaza(); calculeazaScor();
        } }, 'Verifică cerința ' + cr.nr)));
        if (stare.verificari[cr.nr] === true) { box.classList.add('ok'); rez.className = 'rez ok'; rez.textContent = '✓ Verificată anterior.'; }
      }
      box.append(rez);
      const solutie = el('div', { class: 'pix-rosu solutie' }, el('span', { class: 'titlu-pix' }, 'Soluție pas cu pas'));
      solutie.append(htmlCuMarcaje(el('div'), cr.solutie));
      elemente[cr.nr] = { box, solutie };
      panouCerinte.append(box);
    });
    calculeazaScor();

    btnPredau.addEventListener('click', async () => {
      const da = await modal('Predai lucrarea?', el('p', null, 'După predare vezi soluțiile pas cu pas pentru toate cerințele. Poți lucra în continuare, dar rezultatul înregistrat în progresul tău rămâne cel de acum.'), [['Mai lucrez', false], ['Predau', true, 'btn-primar']]);
      if (!da) return;
      if (timer) { clearInterval(timer); timer = null; actualizeazaStart(); }
      stare.predat = true;
      const s = calculeazaScor();
      if (global.Progres) global.Progres.olimpiada('subiect-' + id, { puncte: s.auto, declarat: s.declarat, timpFolosit: Math.round(sub.timp * 60 - stare.ramas) });
      salveaza();
      arataSolutii();
      toast('Lucrare predată: ' + (s.auto + s.declarat) + ' puncte (' + s.auto + ' verificate automat).');
    });
    if (stare.predat || global.App.modProfesor()) arataSolutii();
    document.addEventListener('app:profesor', (e) => { if (e.detail) arataSolutii(); });
  }

  /* ------------------------------------------------------------------
     Sprintul de formule
     ------------------------------------------------------------------ */
  const DURATA_SPRINT = 300, NR_SPRINT = 8;
  const CHEIE_CLASAMENT = 'excel-x-sprint-clasament';
  const NUME_NIVEL = { 1: 'Ușor', 2: 'Mediu', 3: 'Greu', 0: 'Mixt' };

  function paginaSprint(c) {
    const P = global.SPRINT_OLIMPIADA || [];
    let nivel = +(stocare.get('excel-x-sprint-nivel', 1)) || 1;
    const clasament = () => stocare.get(CHEIE_CLASAMENT, {});
    const tabelClasament = (nv, evidentiaza) => {
      const l = (clasament()[nv] || []);
      if (!l.length) return el('p', { style: 'color:var(--cerneala-3)' }, 'Încă nu există rezultate la acest nivel pe acest dispozitiv.');
      return el('table', { class: 'sp-clasament' }, el('tr', null, el('th', null, '#'), el('th', null, 'Nume'), el('th', { class: 'num' }, 'Puncte'), el('th', { class: 'num' }, 'Corecte'), el('th', { class: 'num' }, 'Timp')),
        l.map((r, i) => el('tr', { class: evidentiaza === r.id ? 'eu' : '' }, el('td', null, String(i + 1)), el('td', null, r.nume), el('td', { class: 'num' }, String(r.puncte)), el('td', { class: 'num' }, r.corecte + '/' + r.total), el('td', { class: 'num' }, ceas(r.timp)))));
    };

    function start() {
      c.replaceChildren();
      c.append(el('a', { href: 'index.html', class: 'btn btn-mic btn-fantoma' }, '← Antrenament'));
      c.append(el('section', { class: 'ol-erou' },
        el('div', null, el('span', { class: 'ol-eticheta' }, 'Sprint de formule'), el('h1', null, NR_SPRINT + ' formule. ' + (DURATA_SPRINT / 60) + ' minute.'),
          el('p', null, 'Scrii formula în celula marcată și apeși Enter. Dacă e corectă, treci automat la următoarea. Fiecare formulă corectă aduce 100 de puncte, plus un bonus dacă o rezolvi în mai puțin de 40 de secunde. Formulele trebuie să folosească referințe, nu rezultate scrise de mână.')),
        el('div', { class: 'ol-cronometru-mare' }, el('div', { class: 'ecran ol-cifre' }, ceas(DURATA_SPRINT)), el('div', { class: 'sub' }, 'pe cronometru, fără pauză'))));
      const niv = el('div', { class: 'sp-niveluri', role: 'radiogroup', 'aria-label': 'Nivelul' });
      const zonaClasament = el('div');
      [1, 2, 3, 0].forEach((n) => {
        const r = el('input', { type: 'radio', name: 'nivel', value: n }); r.checked = n === nivel;
        r.addEventListener('change', () => { nivel = n; stocare.set('excel-x-sprint-nivel', n); zonaClasament.replaceChildren(tabelClasament(n)); });
        niv.append(el('label', null, r, NUME_NIVEL[n] + (n ? ' (' + P.filter((p) => p.nivel === n).length + ')' : '')));
      });
      zonaClasament.append(tabelClasament(nivel));
      c.append(el('div', { class: 'sp-panou', style: 'margin-top:18px' },
        el('div', { class: 'card' }, el('h3', null, 'Alege nivelul'), niv, el('div', { class: 'rand-butoane', style: 'margin-top:16px' }, el('button', { class: 'btn btn-primar', type: 'button', onclick: () => porneste() }, '▶ Start sprint'))),
        el('div', { class: 'card' }, el('h3', null, 'Clasament local'), zonaClasament,
          el('p', { style: 'font-size:.8rem;color:var(--cerneala-3);margin:8px 0 0' }, 'Clasamentul se păstrează doar în acest browser (util la clasă, pe calculatorul din laborator).'))));
    }

    function porneste() {
      const pool = P.filter((p) => !nivel || p.nivel === nivel);
      const sarcini = amesteca(pool).slice(0, NR_SPRINT);
      let i = 0, puncte = 0, corecte = 0, ramas = DURATA_SPRINT, tSarcina = Date.now(), sp = null, timer = null, gata = false, terminat = false;
      c.replaceChildren();
      const afisCeas = el('span', { class: 'ceas' }, ceas(ramas));
      const afisPuncte = el('b', null, '0');
      const afisNr = el('span');
      c.append(el('div', { class: 'ol-bara' }, afisCeas, afisNr, el('span', { class: 'scor' }, 'Puncte: ', afisPuncte),
        el('button', { class: 'btn btn-mic', type: 'button', onclick: () => urmatoarea(false) }, 'Sari peste →'),
        el('button', { class: 'btn btn-mic', type: 'button', onclick: () => termina() }, 'Oprește')));
      const zona = el('div', { class: 'card' });
      c.append(zona);
      const verifica = () => {
        if (gata) return;
        const q = sarcini[i], p = FE.parseAddr(q.tinta);
        if (!sp.wb.getInput(0, p.r, p.c)) return;
        const m = global.Exercitii.verificaFormula(sp.wb, { formula: q.tinta, solutie: q.solutie, functii: q.functii });
        if (!m) {
          const sec = (Date.now() - tSarcina) / 1000;
          const bonus = Math.max(0, Math.round((40 - sec) * 2.5));
          puncte += 100 + bonus; corecte++;
          toast('Corect! +' + (100 + bonus) + (bonus ? ' (bonus de viteză ' + bonus + ')' : ''));
          gata = true;   // blochează verificările până apare următoarea formulă
          setTimeout(() => { gata = false; urmatoarea(true); }, 0);
        } else {
          sp.arataMesaj('<b>Încă nu.</b> ' + esc(m), 5000);
          setTimeout(() => { if (sp) sp.select(q.tinta); }, 0);   // cursorul revine pe celula-țintă
        }
      };
      function arata() {
        if (sp) sp.distruge();
        const q = sarcini[i];
        afisNr.textContent = 'Formula ' + (i + 1) + ' din ' + sarcini.length;
        zona.replaceChildren(el('span', { class: 'ol-eticheta' }, NUME_NIVEL[q.nivel]), htmlCuMarcaje(el('p', { class: 'sp-sarcina' }), q.enunt));
        const cont = el('div'); zona.append(cont);
        sp = new global.Spreadsheet(cont, { def: JSON.parse(JSON.stringify(q.foi)), inaltime: 230, toolbar: false, permiteFoi: false, meniuri: false, editabile: [q.tinta], tinte: [q.tinta] });
        sp.select(q.tinta);
        global.simulatorSprint = sp;   // util pentru testare din consolă
        sp.on('change', verifica);
        sp.incepeEditarea('celula', '=', true);
        tSarcina = Date.now();
      }
      function urmatoarea() {
        i++;
        afisPuncte.textContent = String(puncte);
        if (i >= sarcini.length) termina(); else arata();
      }
      function termina() {
        if (terminat) return;
        terminat = true;
        gata = true; clearInterval(timer);
        if (sp) { sp.distruge(); sp = null; }
        const timp = DURATA_SPRINT - Math.max(0, Math.round(ramas));
        if (global.Progres) {
          const vechi = global.Progres.stare().olimpiada.sprint;
          if (!vechi || puncte > vechi.puncte) global.Progres.olimpiada('sprint', { puncte, corecte, nivel });
        }
        c.replaceChildren();
        const nume = el('input', { type: 'text', placeholder: 'Numele tău (pentru clasament)', 'aria-label': 'Numele pentru clasament', value: (stocare.get('excel-x-elev', {}) || {}).nume || '' });
        const zonaCl = el('div');
        const salvat = { v: false };
        c.append(el('div', { class: 'card quiz-rezultat' },
          el('span', { class: 'ol-eticheta' }, 'Sprint · nivel ' + NUME_NIVEL[nivel]),
          el('div', { class: 'nota-mare ol-cifre' }, String(puncte)),
          el('p', null, corecte + ' din ' + sarcini.length + ' formule corecte · timp: ' + ceas(timp)),
          el('div', { class: 'rand-butoane', style: 'justify-content:center' }, nume,
            el('button', { class: 'btn btn-primar', type: 'button', onclick: () => {
              if (salvat.v) return;
              if (!nume.value.trim()) { toast('Scrie-ți numele pentru clasament.'); nume.focus(); return; }
              const cl = clasament();
              const idR = Date.now().toString(36);
              cl[nivel] = (cl[nivel] || []).concat([{ id: idR, nume: nume.value.trim().slice(0, 30), puncte, corecte, total: sarcini.length, timp, data: new Date().toISOString() }])
                .sort((a, b) => b.puncte - a.puncte || a.timp - b.timp).slice(0, 10);
              stocare.set(CHEIE_CLASAMENT, cl);
              salvat.v = true;
              zonaCl.replaceChildren(el('h3', null, 'Clasament local · ' + NUME_NIVEL[nivel]), tabelClasament(nivel, idR));
            } }, 'Salvează în clasament')),
          el('div', { class: 'rand-butoane', style: 'justify-content:center;margin-top:12px' },
            el('button', { class: 'btn', type: 'button', onclick: () => porneste() }, '↺ Încă un sprint'), el('button', { class: 'btn btn-fantoma', type: 'button', onclick: () => start() }, 'Schimbă nivelul'))),
          el('div', { class: 'card', style: 'margin-top:14px' }, zonaCl));
        zonaCl.append(el('h3', null, 'Clasament local · ' + NUME_NIVEL[nivel]), tabelClasament(nivel));
        // soluțiile provocărilor din acest sprint
        const lista = el('ol');
        sarcini.forEach((q) => { const li = el('li', { style: 'margin-bottom:6px' }); htmlCuMarcaje(li, q.enunt + '<br><span class="f" data-f="' + esc(q.solutie) + '"></span>'); lista.append(li); });
        c.append(el('div', { class: 'card', style: 'margin-top:14px' }, el('h3', null, 'Soluțiile provocărilor'), lista));
        global.App.aplicaLimba();
      }
      timer = setInterval(() => {
        ramas -= 0.5;
        afisCeas.textContent = ceas(ramas);
        afisCeas.classList.toggle('expirat', ramas <= 30);
        if (ramas <= 0) { toast('Timpul a expirat!'); termina(); }
      }, 500);
      arata();
    }
    start();
  }

  global.Olimpiada = { paginaIndex, paginaSubiect, paginaSprint, serializeaza, restaureaza };
})(window);
