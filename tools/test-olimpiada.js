/* =====================================================================
   tools/test-olimpiada.js — Autotest pentru pagina unui subiect de
   antrenament (olimpiada/subiect.html?id=N)
   Aplică soluțiile tuturor cerințelor în spațiul de lucru (formule,
   sortări, filtre, formatare, validări, diagrame, pivot, protecție) și
   apasă „Verifică” pe fiecare cerință. Doar pentru dezvoltare:
       App.incarcaScript('../tools/test-olimpiada.js')
   Atenție: suprascrie lucrul salvat pentru acel subiect.
   ===================================================================== */
(async () => {
  const FE = window.FormulaEngine, sp = window.simulatorOlimpiada;
  const id = parseInt(new URLSearchParams(location.search).get('id'), 10) || 1;
  const sub = window.SUBIECTE_OLIMPIADA.find((s) => s.id === id);
  const foaie = (i) => { sp.si = i; sp.randeaza(); };
  const cf = (i, r) => { foaie(i); sp.aplicaModificare(() => sp.foaie.cf.push(r)); };
  const val = (i, r) => { foaie(i); sp.aplicaModificare(() => sp.foaie.validari.push(Object.assign({ eroare: { stil: 'stop', titlu: 'Greșit', text: 'Valoare nepermisă.' } }, r))); };
  const diag = (i, d) => { foaie(i); sp.aplicaModificare(() => sp.foaie.diagrame.push(Object.assign({ id: 'd' + Math.random(), legenda: true }, d))); };
  const col = (i, nume) => { for (let c = 0; c < sp.wb.sheets[i].cols; c++) if (sp.wb.getDisplay(i, 0, c) === nume) return c; return -1; };
  const pivot = (i, randuri, coloane, valori, fn) => {
    foaie(i); const z = sp.zonaCurenta(1, 0);
    sp.creeazaPivot({ sursa: { foaie: sp.foaie.name, zona: FE.addr(z.r1, z.c1) + ':' + FE.addr(z.r2, z.c2) }, randuri: col(i, randuri), coloane: coloane ? col(i, coloane) : null, valori: col(i, valori), fn, dest: { foaie: 'Pivot1', r: 2, c: 0 } });
  };
  // acțiuni care nu sunt formule, pe subiecte și cerințe
  const actiuni = {
    1: { 6: () => cf(1, { zona: 'A2:J13', tip: 'formula', formula: '=$I2="Premiul I"', stil: 'verde' }),
      7: () => { foaie(1); const z = sp.zonaCurenta(1, 0); sp.aplicaModificare(() => sp.sorteaza(z, [{ c: 5, desc: true }, { c: 4, desc: false }], true)); },
      8: () => diag(3, { tip: 'coloane', zona: 'D1:E3', titlu: 'Media totalului pe categorie' }) },
    2: { 6: () => val(1, { zona: 'C2:C13', tip: 'lista', sursa: '10A,10B,10C' }),
      7: () => { foaie(1); ['Clasa', 'Stare', 'Penalizare'].forEach((t, j) => sp.wb.setInput(1, 0, 12 + j, t)); sp.wb.setInput(1, 1, 12, '10B'); sp.wb.setInput(1, 1, 13, 'restantă'); sp.wb.setInput(1, 2, 14, '>10');
        const m = sp.filtruAvansat(FE.parseRangeAddr('A1:K13'), FE.parseRangeAddr('M1:O3'), 'M6'); if (m) throw new Error(m); },
      8: () => cf(1, { zona: 'A2:K13', tip: 'formula', formula: '=$K2="restantă"', stil: 'rosu' }) },
    3: { 6: () => pivot(1, 'Tarabă', 'Luna', 'Valoare', 'sum'),
      7: () => diag(2, { tip: 'placinta', zona: 'A1:B4', titlu: 'Vânzări pe categorii', etichete: true }),
      8: () => cf(1, { zona: 'H2:H21', tip: 'top', n: 3, stil: 'verde' }),
      9: () => val(1, { zona: 'D2:D21', tip: 'zecimal', op: '>', min: '0' }) },
    4: { 2: () => { foaie(0); sp.select('H2:H17'); sp.aplicaFormat('percent'); },
      7: () => cf(0, { zona: 'G2:G17', tip: 'top', n: 3, stil: 'verde' }),
      8: () => { foaie(0); const z = sp.zonaCurenta(1, 0); sp.aplicaModificare(() => sp.sorteaza(z, [{ c: 2, desc: false }, { c: 6, desc: true }], true)); },
      9: () => { sp.copiazaFoaia(0); sp.wb.redenumesteFoaia(2, 'Subtotaluri'); foaie(2); const z = sp.zonaCurenta(1, 0); sp.subtotaluri(z, 2, 1, [6]); } },
    5: { 6: () => diag(0, { tip: 'linie', zona: 'A1:C91', titlu: 'Evoluția temperaturilor', titluX: 'Data', titluY: '°C' }),
      7: () => cf(0, { zona: 'C2:C91', tip: 'scala' }),
      8: () => { foaie(0); sp.select('A2'); sp.comutaFiltru(); const f = sp.foaie.filtru; f.criterii[4] = { valori: ['2'] }; f.criterii[6] = { valori: ['ger'] }; sp.aplicaModificare(() => sp.aplicaFiltru()); },
      9: () => val(0, { zona: 'D2:D91', tip: 'zecimal', op: '>=', min: '0', eroare: { stil: 'stop', titlu: 'Greșit', text: 'Doar valori de cel puțin 0.' } }) },
    6: { 5: () => diag(3, { tip: 'bare', zona: 'A1:B9', titlu: 'Clasamentul turneului', etichete: true }),
      6: () => val(0, { zona: 'B2:B9', tip: 'zecimal', op: 'intre', min: '0', max: '4' }),
      7: () => { foaie(3); sp.select('G2:G9'); sp.blocheazaCelule(false); sp.foaie.protejata = true; } }
  };
  const out = [];
  for (const c of sub.cerinte) {
    try {
      for (const rg of c.reguli || []) {
        if (!rg.formula) continue;
        const si = typeof rg.foaie === 'number' ? rg.foaie : 0;
        const z = FE.parseRangeAddr(rg.formula);
        for (let r = z.r1; r <= z.r2; r++) for (let cc = z.c1; cc <= z.c2; cc++) sp.wb.setInput(si, r, cc, FE.deplaseaza(rg.solutie, r - z.r1, cc - z.c1));
      }
      sp.wb.recalc();
      if (actiuni[id] && actiuni[id][c.nr]) actiuni[id][c.nr]();
      sp.randeaza();
    } catch (e) { out.push('C' + c.nr + ': EXCEPȚIE — ' + e.message); }
  }
  // apasă „Verifică” pe fiecare cerință
  document.querySelectorAll('.ol-cerinta button').forEach((b) => b.click());
  await new Promise((r) => setTimeout(r, 50));
  document.querySelectorAll('.ol-cerinta').forEach((b, i) => {
    const rez = b.querySelector('.rez').textContent;
    out.push('C' + (i + 1) + ': ' + (b.classList.contains('ok') ? 'OK' : sub.cerinte[i].manual ? 'manual' : 'EȘEC — ' + rez.slice(0, 200)));
  });
  window.__rezultatTest = out;
  console.log('[autotest olimpiadă]\n' + out.join('\n'));
})();
