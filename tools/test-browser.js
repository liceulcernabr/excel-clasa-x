/* =====================================================================
   tools/test-browser.js — Autotest pentru pagina unei lecții
   ---------------------------------------------------------------------
   Rezolvă automat toate exercițiile lecției deschise (folosind aceleași
   funcții ca elevul: selecție, umplere, sortare, filtre, dialoguri…)
   și afișează în consolă dacă verificarea le acceptă.
   Utilizare (doar pentru dezvoltare): deschide o lecție, apoi în consolă:
       App.incarcaScript('../tools/test-browser.js')
   Atenție: exercițiile rezolvate astfel primesc puncte în progresul local.
   ===================================================================== */
(async () => {
  const FE = window.FormulaEngine, I = Exercitii.instante, out = [];
  const pauza = (ms) => new Promise((r) => setTimeout(r, ms));
  const sel = (sp, a) => { const z = FE.parseRangeAddr(a); sp.selecteaza(z.r1, z.c1); if (z.r2 !== z.r1 || z.c2 !== z.c1) sp.selecteaza(z.r2, z.c2, true); };
  const scrie = (sp, a, t) => { const p = FE.parseAddr(a); sp.wb.setInput(sp.si, p.r, p.c, t); sp.dupaModificare([]); };
  const umple = (sp, zonaSursa, pana) => { sel(sp, zonaSursa); const p = FE.parseAddr(pana); sp.umple(p.r, p.c); };
  const cf = (sp, regula) => sp.aplicaModificare(() => sp.foaie.cf.push(regula));
  const validare = (sp, regula) => sp.aplicaModificare(() => sp.foaie.validari.push(regula));
  const diagrama = (sp, d) => sp.aplicaModificare(() => sp.foaie.diagrame.push(Object.assign({ id: 't' + Math.random(), legenda: true }, d)));
  const pivot = (sp, randuri, coloane, valori, fn) => {
    const z = sp.zonaCurenta(1, 0), col = (n) => { for (let c = z.c1; c <= z.c2; c++) if (sp.wb.getDisplay(sp.si, z.r1, c) === n) return c; return null; };
    sp.creeazaPivot({ sursa: { foaie: sp.foaie.name, zona: FE.addr(z.r1, z.c1) + ':' + FE.addr(z.r2, z.c2) }, randuri: col(randuri), coloane: coloane ? col(coloane) : null, valori: col(valori), fn, dest: { foaie: 'Pivot1', r: 2, c: 0 } });
  };
  const colIdx = (sp, nume) => { for (let c = 0; c < sp.foaie.cols; c++) if (sp.wb.getDisplay(sp.si, 0, c) === nume) return c; return -1; };

  // soluții pentru exercițiile care nu se rezolvă doar scriind formule
  const manual = {
    'o1-celula': (x) => sel(x.sp, 'D4'),
    'o1-zona': (x) => sel(x.sp, 'B3:E6'),
    'o1-foi': (x) => { x.sp.wb.redenumesteFoaia(0, 'Catalog'); x.sp.foaieNoua(); x.sp.wb.redenumesteFoaia(1, 'Absențe'); x.sp.randeazaTaburi(); },
    'o1-bara-stare': (x) => { scrie(x.sp, 'F10', '8,75'); scrie(x.sp, 'I2', '101,25'); },
    'o2-antet': (x) => { sel(x.sp, 'A1:F1'); x.sp.comutaStil('bold'); x.sp.comutaStil('fill'); },
    'o2-moneda': (x) => { sel(x.sp, 'C2:C6'); x.sp.aplicaFormat('currency'); sel(x.sp, 'E2:E6'); x.sp.aplicaFormat('currency'); },
    'o2-procent': (x) => { sel(x.sp, 'F2:F6'); x.sp.aplicaFormat('percent'); x.sp.zecimale(1); },
    'o3-numerotare': (x) => umple(x.sp, 'A2:A3', 'A11'),
    'o3-zile': (x) => umple(x.sp, 'B2', 'B8'),
    'o3-saptamani': (x) => umple(x.sp, 'A2:A3', 'A9'),
    'o3-inserare': (x) => { sel(x.sp, 'A4'); x.sp.structura('r', 3, 1); scrie(x.sp, 'A4', 'Cristea'); scrie(x.sp, 'B4', '9'); },
    'o3-stergere': (x) => { sel(x.sp, 'C1'); x.sp.structura('c', 2, -1); },
    'o10-sort1': (x) => { sel(x.sp, 'F2'); x.sp.sortareRapida(true); },
    'o10-sort2': (x) => { const z = x.sp.zonaCurenta(1, 0); x.sp.aplicaModificare(() => x.sp.sorteaza(z, [{ c: 1, desc: false }, { c: 4, desc: false }], true)); },
    'o10-filtru1': (x) => { sel(x.sp, 'A2'); x.sp.comutaFiltru(); const f = x.sp.foaie.filtru; f.criterii[1] = { valori: ['10B'] }; f.criterii[2] = { valori: ['F'] }; x.sp.aplicaModificare(() => x.sp.aplicaFiltru()); },
    'o10-filtru2': (x) => { sel(x.sp, 'A2'); x.sp.comutaFiltru(); x.sp.foaie.filtru.criterii[5] = { op: '>=', v: '85' }; x.sp.aplicaModificare(() => x.sp.aplicaFiltru()); },
    'o10-avansat': (x) => { const m = x.sp.filtruAvansat(FE.parseRangeAddr('A1:F17'), FE.parseRangeAddr('H1:I3'), 'H6'); if (m) throw new Error(m); },
    'o11-sub5': (x) => cf(x.sp, { zona: 'C2:C13', tip: 'mai-mic', v1: '5', stil: 'rosu' }),
    'o11-top': (x) => cf(x.sp, { zona: 'C2:C13', tip: 'top', n: 3, stil: 'verde' }),
    'o11-rand': (x) => cf(x.sp, { zona: 'A2:E13', tip: 'formula', formula: '=$E2="Da"', stil: 'galben' }),
    'o11-bare': (x) => cf(x.sp, { zona: 'D2:D13', tip: 'bare' }),
    'o11-lista': (x) => validare(x.sp, { zona: 'F2:F13', tip: 'lista', sursa: 'Da,Nu', eroare: { stil: 'stop' } }),
    'o11-note': (x) => validare(x.sp, { zona: 'G2:G13', tip: 'intreg', op: 'intre', min: '1', max: '10', eroare: { stil: 'stop', titlu: 'Notă greșită', text: 'Scrie un număr întreg de la 1 la 10.' } }),
    'o11-data': (x) => validare(x.sp, { zona: 'H2:H13', tip: 'data', op: 'intre', min: '01.09.2025', max: '30.06.2026', mesajIntrare: { titlu: 'Data tezei', text: 'O dată din anul școlar 2025–2026.' }, eroare: { stil: 'stop' } }),
    'o12-coloane': (x) => diagrama(x.sp, { tip: 'coloane', zona: 'A1:B13', titlu: 'Temperatura medie la Brăila' }),
    'o12-linie': (x) => diagrama(x.sp, { tip: 'linie', zona: 'A1:D13', titlu: 'Evoluția temperaturilor', titluY: '°C' }),
    'o12-placinta': (x) => diagrama(x.sp, { tip: 'placinta', zona: 'A1:B6', titlu: 'Vânzări', etichete: true }),
    'o12-bare': (x) => diagrama(x.sp, { tip: 'bare', zona: 'A1:B13', titlu: 'Precipitații', legenda: false }),
    'o12-citire': (x) => { scrie(x.sp, 'G2', 'iun'); scrie(x.sp, 'G3', '64'); },
    'o13-pivot1': (x) => pivot(x.sp, 'Categorie', null, 'Valoare', 'sum'),
    'o13-pivot2': (x) => pivot(x.sp, 'Oraș', 'Luna', 'Valoare', 'sum'),
    'o13-pivot3': (x) => pivot(x.sp, 'Oraș', null, 'Produs', 'count'),
    'o13-subtotal': (x) => { sel(x.sp, 'C2'); x.sp.sortareRapida(false); const z = x.sp.zonaCurenta(1, 0); x.sp.subtotaluri(z, 2, 9, [5]); },
    'o14-protectie': (x) => { sel(x.sp, 'B2:B9'); x.sp.blocheazaCelule(false); x.sp.foaie.protejata = true; x.sp.randeazaValori(); },
    'o15-ordonare-cf': (x) => { const z = x.sp.zonaCurenta(1, 0); x.sp.aplicaModificare(() => x.sp.sorteaza(z, [{ c: colIdx(x.sp, 'Probă'), desc: false }, { c: colIdx(x.sp, 'Punctaj'), desc: true }], true)); cf(x.sp, { zona: 'E2:E13', tip: 'mai-mare', v1: '89', stil: 'verde' }); },
    'o15-diagrama': (x) => diagrama(x.sp, { tip: 'coloane', zona: 'K1:L4', titlu: 'Media pe clase' })
  };

  for (const id of Object.keys(I)) {
    const x = I[id], ex = x.ex;
    try {
      if (manual[id]) await manual[id](x);
      else if (ex.tip === 'simulator') {
        const reg = ex.reguli || [];
        if (!reg.every((r) => r.formula || r.valoare)) { out.push(id + ': ? fără soluție automată'); continue; }
        for (const r of reg) {
          const si = typeof r.foaie === 'number' ? r.foaie : 0;
          if (r.formula) {
            const z = FE.parseRangeAddr(r.formula);
            for (let rr = z.r1; rr <= z.r2; rr++) for (let c = z.c1; c <= z.c2; c++) x.sp.wb.setInput(si, rr, c, FE.deplaseaza(r.solutie, rr - z.r1, c - z.c1));
          } else {
            const p = FE.parseAddr(r.valoare);
            x.sp.wb.setInput(si, p.r, p.c, typeof r.egal === 'boolean' ? (r.egal ? 'TRUE' : 'FALSE') : String(r.egal));
          }
        }
        x.sp.randeazaValori();
      } else if (ex.tip === 'rezultat') {
        if (x.optiuni) { const t = x.textAsteptat(); const inp = [...x.optiuni.querySelectorAll('input')].find((i) => i.value === t); if (inp) inp.checked = true; else out.push(id + ': varianta corectă „' + t + '” lipsește din listă'); }
        else x.inp.value = x.textAsteptat();
      } else x.arataSolutie();
      x.verifica();
      await pauza(10);
      out.push(id + ': ' + (x.feedback.className.includes('ok') ? 'OK' : 'EȘEC — ' + x.feedback.textContent.slice(0, 200)));
    } catch (e) { out.push(id + ': EXCEPȚIE — ' + e.message); }
  }
  window.__rezultatTest = out;
  console.log('[autotest]\n' + out.join('\n'));
})();
