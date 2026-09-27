/* =====================================================================
   exercises.js — Exercițiile interactive cu verificare automată
   ---------------------------------------------------------------------
   Tipuri (câmpul „tip” din fișierele /data/lectii/ora-XX.js):
     simulator   – elevul lucrează în foaia de calcul; se verifică reguli
                   (formulă, valoare, selecție, nume de foaie, format…)
     potrivire   – trage fiecare termen lângă descrierea potrivită
     clasificare – trage elementele în categoria corectă
     completare  – completează bucățile lipsă dintr-o formulă
     greseala    – găsește (clic) bucata greșită dintr-o formulă
     ordonare    – pune pașii în ordinea corectă
     rezultat    – „ce rezultat dă formula?” (calculat automat de motor)
     grila       – întrebare cu variante (una sau mai multe corecte)
   Toate au indicii progresive: indiciu 1 → indiciu 2 → soluția.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const { el, esc, amesteca, htmlCuMarcaje, toast } = global.App;

  const NUME_TIP = {
    simulator: 'Lucru în foaia de calcul', potrivire: 'Potrivire', clasificare: 'Clasificare', completare: 'Completează formula',
    greseala: 'Găsește greșeala', ordonare: 'Ordonează pașii', rezultat: 'Ce rezultat dă?', grila: 'Alege răspunsul'
  };
  const NIVEL = { baza: 'de bază', mediu: 'mediu', avansat: 'avansat' };

  /* =================================================================
     VERIFICAREA REGULILOR ÎN SIMULATOR
     ================================================================= */
  function celuleDinZona(z) {
    const rg = FE.parseRangeAddr(z), out = [];
    for (let r = rg.r1; r <= rg.r2; r++) for (let c = rg.c1; c <= rg.c2; c++) out.push({ r, c, a: FE.addr(r, c), dr: r - rg.r1, dc: c - rg.c1 });
    return out;
  }
  function afisare(v) { return FE.isErr(v) ? v.code : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v === null ? '(gol)' : FE.formatValoare(v); }

  // Modifică aleator numerele (nu formulele) — la fel în ambele registre
  function perturbari(wb, excluse, fixe) {
    const lista = [];
    wb.sheets.forEach((sh, si) => {
      for (const [k, cell] of sh.cells) {
        if (!cell.input || cell.input[0] === '=') continue;
        const [r, c] = k.split(',').map(Number);
        const a = FE.addr(r, c);
        if (excluse.has(si + ':' + a) || (fixe && fixe.includes(a))) continue;
        const L = FE.literal(cell.input);
        if (typeof L.v !== 'number') continue;
        let nou;
        if (L.fmt && L.fmt.type === 'date') nou = FE.formatData(L.v + 1 + Math.floor(Math.random() * 40));
        else if (Number.isInteger(L.v)) nou = String(L.v + 1 + Math.floor(Math.random() * 3));
        else {
          const zec = (cell.input.split(/[.,]/)[1] || '').replace(/\D/g, '').length || 2;
          nou = String(+(L.v * (1.07 + Math.random() * 0.25)).toFixed(zec));
          if (L.fmt && L.fmt.type === 'percent') nou = String(+(L.v * 100 * 1.1).toFixed(1)) + '%';
        }
        lista.push({ si, r, c, nou });
      }
    });
    return lista;
  }

  // Verifică o regulă de tip „formulă”; întoarce null (corect) sau un mesaj
  function verificaFormula(wb, regula, si) {
    si = si || 0;
    const celule = celuleDinZona(regula.formula);
    const sol = regula.solutie;
    // 1. fiecare celulă trebuie să conțină o formulă
    for (const x of celule) {
      const inp = wb.getInput(si, x.r, x.c);
      if (!inp) return 'Celula ' + x.a + ' este goală. Scrie formula acolo' + (celule.length > 1 ? ' (și copiaz-o în toată zona ' + regula.formula + ').' : '.');
      if (regula.cerintaFormula !== false && inp[0] !== '=') return 'În ' + x.a + ' ai scris o valoare, nu o formulă. Formulele încep cu semnul =.';
    }
    // 2. rezultatele trebuie să coincidă cu ale soluției
    const ref = wb.clone();
    celule.forEach((x) => ref.setInput(si, x.r, x.c, FE.deplaseaza(sol, x.dr, x.dc)));
    for (const x of celule) {
      const v = wb.getValue(si, x.r, x.c), a = ref.getValue(si, x.r, x.c);
      if (!FE.egale(v, a)) {
        if (FE.isErr(v)) {
          const e = FE.EXPLICATII_ERORI[v.code];
          return x.a + ' afișează eroarea ' + v.code + (e ? ' (' + e.titlu.toLowerCase() + '). ' + e.ce : '.');
        }
        const primul = celule[0];
        if (x !== primul && FE.egale(wb.getValue(si, primul.r, primul.c), ref.getValue(si, primul.r, primul.c))) {
          return 'Formula din ' + primul.a + ' e corectă, dar copiată în ' + x.a + ' dă alt rezultat (' + afisare(v) + '). Probabil o referință care trebuie să rămână fixă nu are $ (apasă F4 pe ea), sau formula nu a fost copiată, ci scrisă diferit.';
        }
        return 'Rezultatul din ' + x.a + ' (' + afisare(v) + ') nu este cel așteptat. Verifică zona de celule și operatorii folosiți.';
      }
    }
    // 3. funcțiile cerute
    if (regula.functii && regula.functii.length) {
      for (const x of celule) {
        const folosite = FE.functiiFolosite(wb.getInput(si, x.r, x.c));
        const lipsa = regula.functii.filter((f) => !folosite.has(f));
        if (lipsa.length) {
          const nume = lipsa.map((f) => f + (FE.traducere(f) ? ' (' + FE.traducere(f) + ')' : '')).join(', ');
          return 'Rezultatul este corect, dar cerința îți cere să folosești funcția ' + nume + ' (în ' + x.a + ').';
        }
      }
    }
    if (regula.interzise) {
      for (const x of celule) {
        const folosite = FE.functiiFolosite(wb.getInput(si, x.r, x.c));
        const f = regula.interzise.find((y) => folosite.has(y));
        if (f) return 'În acest exercițiu nu ai voie să folosești funcția ' + f + '.';
      }
    }
    if (regula.contine) {
      for (const x of celule) {
        const inp = wb.getInput(si, x.r, x.c).toUpperCase().replace(/\s/g, '');
        for (const t of [].concat(regula.contine)) {
          if (!inp.includes(t.toUpperCase().replace(/\s/g, ''))) return 'Rezultatul e corect, dar formula din ' + x.a + ' ar trebui să conțină ' + t + '.';
        }
      }
    }
    // 4. robustețe: aceleași date modificate → aceleași rezultate?
    if (regula.robust !== false) {
      const excluse = new Set(celule.map((x) => si + ':' + x.a));
      for (let incercare = 0; incercare < 2; incercare++) {
        const pert = perturbari(wb, excluse, regula.fixe);
        if (!pert.length) break;
        const A = wb.clone(), B = ref.clone();
        pert.forEach((p) => { A.setInput(p.si, p.r, p.c, p.nou); B.setInput(p.si, p.r, p.c, p.nou); });
        for (const x of celule) {
          if (!FE.egale(A.getValue(si, x.r, x.c), B.getValue(si, x.r, x.c))) {
            return 'Rezultatul din ' + x.a + ' e corect acum, dar formula nu ar mai funcționa dacă datele din tabel s-ar schimba. ' +
              'Folosește referințe la celule (de ex. B2) în loc de numere scrise direct' + (regula.indiciuRobust ? '. ' + regula.indiciuRobust : ', și verifică unde ai nevoie de $.');
          }
        }
      }
    }
    return null;
  }

  function tipValoare(wb, si, r, c) {
    const v = wb.getValue(si, r, c), f = wb.getFormat(si, r, c);
    if (v === null) return 'gol';
    if (FE.isErr(v)) return 'eroare';
    if (typeof v === 'boolean') return 'logic';
    if (typeof v === 'number') return f && f.type === 'date' ? 'data' : 'numar';
    return 'text';
  }
  const NUME_TIP_DATE = { numar: 'un număr', text: 'un text', data: 'o dată calendaristică', logic: 'o valoare logică (TRUE/FALSE)' };

  // Verifică toate regulile unui exercițiu de tip simulator
  function verificaReguli(sp, reguli, ex) {
    const wb = sp.wb;
    for (const rg of reguli) {
      const si = rg.foaie != null && typeof rg.foaie === 'number' ? rg.foaie : 0;
      if (rg.formula) { const m = verificaFormula(wb, rg, si); if (m) return m; continue; }
      if (rg.valoare) {
        const p = FE.parseAddr(rg.valoare);
        const v = wb.getValue(si, p.r, p.c);
        if (v === null) return 'Celula ' + rg.valoare + ' este goală.';
        if (rg.tipDate && tipValoare(wb, si, p.r, p.c) !== rg.tipDate) {
          return 'Celula ' + rg.valoare + ' ar trebui să conțină ' + NUME_TIP_DATE[rg.tipDate] + ', dar conține ' + (NUME_TIP_DATE[tipValoare(wb, si, p.r, p.c)] || 'altceva') + '.';
        }
        if (rg.egal !== undefined) {
          let ok;
          if (typeof rg.egal === 'number') ok = typeof v === 'number' && Math.abs(v - rg.egal) < 1e-9;
          else if (typeof rg.egal === 'string' && FE.literal(rg.egal).fmt && FE.literal(rg.egal).fmt.type === 'date') ok = v === FE.literal(rg.egal).v;
          else ok = String(FE.isErr(v) ? v.code : v).trim().toLowerCase() === String(rg.egal).trim().toLowerCase();
          if (!ok) return 'Valoarea din ' + rg.valoare + ' nu este cea cerută' + (rg.mesaj ? ': ' + rg.mesaj : '.');
        }
        if (rg.faraFormula && wb.getInput(si, p.r, p.c)[0] === '=') return 'În ' + rg.valoare + ' trebuie scrisă direct valoarea, nu o formulă.';
        continue;
      }
      if (rg.selectie) {
        const s = sp.getSelection();
        const z = FE.parseRangeAddr(rg.selectie);
        if (s.r1 !== z.r1 || s.c1 !== z.c1 || s.r2 !== z.r2 || s.c2 !== z.c2) {
          return 'Ai selectat ' + s.adresa + ', dar cerința este ' + rg.selectie + '. ' +
            (z.r1 !== z.r2 || z.c1 !== z.c2 ? 'Apasă pe prima celulă și trage până la ultima (sau folosește Shift + clic).' : 'Fă clic exact pe celula cerută.');
        }
        continue;
      }
      if (rg.numeFoaie) {
        const idx = rg.foaie || 0;
        const sh = wb.sheets[idx];
        if (!sh || sh.name.trim().toLowerCase() !== rg.numeFoaie.toLowerCase()) return 'Foaia ' + (idx + 1) + ' ar trebui să se numească „' + rg.numeFoaie + '” (acum: „' + (sh ? sh.name : '—') + '”). Dublu-clic pe eticheta foii pentru redenumire.';
        continue;
      }
      if (rg.nrFoi) {
        if (wb.sheets.length < rg.nrFoi) return 'Registrul ar trebui să aibă cel puțin ' + rg.nrFoi + ' foi (acum are ' + wb.sheets.length + '). Folosește butonul + de lângă etichetele foilor.';
        continue;
      }
      if (rg.format) {
        for (const x of celuleDinZona(rg.format)) {
          const f = wb.getFormat(si, x.r, x.c);
          if (!f || f.type !== rg.tip) return 'Celula ' + x.a + ' nu are formatul cerut (' + rg.tip + ').';
          if (rg.zecimale != null && f.dec !== rg.zecimale) return 'Celula ' + x.a + ' ar trebui să aibă ' + rg.zecimale + ' zecimale.';
        }
        continue;
      }
      if (rg.aldin) {
        for (const x of celuleDinZona(rg.aldin)) {
          const cl = wb.cell(si, x.r, x.c);
          if (!cl || !cl.bold) return 'Celula ' + x.a + ' ar trebui scrisă aldin (Bold).';
        }
        continue;
      }
      if (rg.custom) { const m = rg.custom(wb, sp); if (m) return m; continue; }
      const m = verificaRegulaAvansata(sp, rg, si, ex);
      if (m) return m;
    }
    return null;
  }

  /* ---------- reguli pentru sortare, filtre, formatare condiționată, validare,
                diagrame, pivot, subtotaluri, protecție ---------- */
  // Rândurile unei zone ca obiecte {Antet: valoare afișată}
  function randuriTabel(wb, si, zona) {
    const z = FE.parseRangeAddr(zona), antete = [];
    for (let c = z.c1; c <= z.c2; c++) antete.push(wb.getDisplay(si, z.r1, c));
    const out = [];
    for (let r = z.r1 + 1; r <= z.r2; r++) {
      const o = { _r: r, _sig: '' };
      antete.forEach((a, j) => { const v = wb.getValue(si, r, z.c1 + j); o[a] = v; o._sig += '\u0001' + wb.getDisplay(si, r, z.c1 + j); });
      out.push(o);
    }
    return { antete, randuri: out, z };
  }
  function verificaRegulaAvansata(sp, rg, si, ex) {
    const wb = sp.wb;
    if (rg.sortat) {
      const t = randuriTabel(wb, si, rg.sortat);
      // aceleași rânduri ca la început (rândurile nu au fost „rupte”)
      if (ex && ex.foi) {
        // integritatea rândurilor se verifică pe coloanele cu date inițiale (rg.integritate) sau pe toată zona
        const zInt = rg.integritate || rg.sortat;
        const initial = randuriTabel(new FE.Workbook(JSON.parse(JSON.stringify(ex.foi))), si, zInt);
        const acum = randuriTabel(wb, si, zInt);
        const a = initial.randuri.map((x) => x._sig).sort().join('\n'), b = acum.randuri.map((x) => x._sig).sort().join('\n');
        if (a !== b) return 'Datele de pe rânduri s-au amestecat: o coloană a fost sortată separat de celelalte. Apasă „Reia exercițiul” și sortează selectând o singură celulă din tabel (tot tabelul se sortează împreună).';
      }
      for (let i = 1; i < t.randuri.length; i++) {
        const x = t.randuri[i - 1], y = t.randuri[i];
        for (const k of rg.chei) {
          const a = x[k.col], b = y[k.col];
          const cmp = FE.compara(a === null ? '' : a, b === null ? '' : b);
          if (cmp === 0) continue;
          if ((k.desc ? -cmp : cmp) > 0) return 'Tabelul nu este sortat cum se cere: verifică ordinea după „' + k.col + '” (' + (k.desc ? 'descrescător' : 'crescător') + ') în jurul rândului ' + (y._r + 1) + '.';
          break;
        }
      }
      return null;
    }
    if (rg.vizibile) {
      const sh = wb.sheets[si];
      const t = randuriTabel(wb, si, rg.vizibile.zona);
      for (const x of t.randuri) {
        const trebuie = !!rg.vizibile.conditie(x);
        const vizibil = !sh.hiddenRows.has(x._r);
        if (trebuie && !vizibil) return 'Rândul ' + (x._r + 1) + ' ar trebui să fie vizibil, dar este ascuns de filtru.';
        if (!trebuie && vizibil) return 'Rândul ' + (x._r + 1) + ' nu îndeplinește condiția, dar este încă vizibil. Verifică filtrele (butoanele ▾ din antet).';
      }
      return null;
    }
    if (rg.copiat) {
      const src = randuriTabel(wb, si, rg.copiat.zona);
      const asteptat = src.randuri.filter(rg.copiat.conditie).map((x) => x[src.antete[0]]);
      const d = FE.parseAddr(rg.copiat.dest);
      if (wb.getDisplay(si, d.r, d.c) !== src.antete[0]) return 'În ' + rg.copiat.dest + ' ar trebui să înceapă rezultatul filtrului avansat (cu antetul „' + src.antete[0] + '”).';
      const gasit = [];
      for (let r = d.r + 1; wb.getInput(si, r, d.c) !== ''; r++) gasit.push(wb.getValue(si, r, d.c));
      if (gasit.length !== asteptat.length) return 'Rezultatul filtrului are ' + gasit.length + ' rânduri, dar ar trebui să aibă ' + asteptat.length + '. Verifică zona de criterii.';
      if (gasit.some((v, i) => !FE.egale(v, asteptat[i]))) return 'Rândurile copiate nu sunt cele care îndeplinesc criteriile.';
      return null;
    }
    if (rg.cfEfect) {
      const siVechi = sp.si;
      sp.si = si;   // regulile se evaluează pe foaia lor
      try {
      sp.inainteValori();
      const sh = wb.sheets[si];
      const z = FE.parseRangeAddr(rg.cfEfect.zona);
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) {
        const v = wb.getValue(si, r, c);
        const colorat = sh.cf.some((x) => sp.regulaCF(x, r, c, v));
        const trebuie = !!rg.cfEfect.conditie(v, r, c, wb);
        if (trebuie && !colorat) return 'Celula ' + FE.addr(r, c) + ' ar trebui evidențiată de formatarea condiționată, dar nu este.';
        if (!trebuie && colorat) return 'Celula ' + FE.addr(r, c) + ' este evidențiată, deși nu îndeplinește condiția.';
      }
      if (rg.cfEfect.tip && !sh.cf.some((x) => [].concat(rg.cfEfect.tip).includes(x.tip))) return 'Rezultatul e corect, dar cerința îți cere o regulă de tipul: ' + [].concat(rg.cfEfect.tip).join(' / ') + '.';
      return null;
      } finally { sp.si = siVechi; sp.inainteValori(); }
    }
    if (rg.cfTip) {
      const sh = wb.sheets[si];
      const ok = sh.cf.some((x) => x.tip === rg.cfTip && (!rg.zona || x.zona.replace(/\$/g, '') === rg.zona));
      return ok ? null : 'Nu găsesc o regulă de formatare condiționată de tipul cerut' + (rg.zona ? ' pentru zona ' + rg.zona : '') + '.';
    }
    if (rg.validare) {
      const p = FE.parseAddr(rg.validare.celula);
      const regula = sp.regulaValidare(si, p.r, p.c);
      if (!regula) return 'Celula ' + rg.validare.celula + ' nu are nicio regulă de validare (Date → Validarea datelor…).';
      for (const v of rg.validare.accepta || []) if (sp.verificaRegula(regula, String(v))) return 'Regula din ' + rg.validare.celula + ' refuză valoarea „' + v + '”, care ar trebui acceptată.';
      for (const v of rg.validare.refuza || []) if (!sp.verificaRegula(regula, String(v))) return 'Regula din ' + rg.validare.celula + ' acceptă valoarea „' + v + '”, care ar trebui refuzată.';
      if (rg.validare.stil && (regula.eroare || {}).stil !== rg.validare.stil) return 'Stilul avertismentului de eroare ar trebui să fie „' + rg.validare.stil + '”.';
      if (rg.validare.mesajEroare && !((regula.eroare || {}).text)) return 'Adaugă și un mesaj de eroare (fila „Avertisment de eroare”).';
      if (rg.validare.mesajIntrare && !((regula.mesajIntrare || {}).text)) return 'Adaugă și un mesaj de intrare, care apare când se selectează celula.';
      return null;
    }
    if (rg.diagrama) {
      const d = rg.diagrama;
      const toate = wb.sheets.flatMap((s) => s.diagrame || []);
      if (!toate.length) return 'Nu există nicio diagramă. Folosește Inserare → Diagramă…';
      const potriv = toate.filter((x) => !d.tip || [].concat(d.tip).includes(x.tip));
      if (!potriv.length) return 'Diagrama nu are tipul cerut (' + [].concat(d.tip).map((t) => global.Diagrame.TIPURI[t]).join(' sau ') + ').';
      const cuZona = potriv.filter((x) => !d.zona || x.zona.replace(/\$/g, '') === d.zona);
      if (!cuZona.length) return 'Diagrama nu folosește zona de date cerută (' + d.zona + '), cu tot cu antet și etichete.';
      const cuTitlu = cuZona.filter((x) => !d.titlu || String(x.titlu || '').toLowerCase().includes(d.titlu.toLowerCase()));
      if (!cuTitlu.length) return 'Titlul diagramei ar trebui să conțină „' + d.titlu + '”.';
      const x = cuTitlu[0];
      if (d.titluY && !x.titluY) return 'Adaugă un titlu pentru axa verticală (valori).';
      if (d.titluX && !x.titluX) return 'Adaugă un titlu pentru axa orizontală (categorii).';
      if (d.etichete && !x.etichete) return 'Afișează etichetele de date (valorile) pe diagramă.';
      if (d.legenda === false && x.legenda) return 'Ascunde legenda (nu este necesară pentru o singură serie).';
      return null;
    }
    if (rg.pivot) {
      const d = rg.pivot;
      const toate = wb.sheets.flatMap((s) => s.pivoturi || []);
      if (!toate.length) return 'Nu există niciun tabel pivot. Folosește Inserare → Tabel pivot…';
      const nume = (p, c) => { const s2 = wb.sheetIndex(p.sursa.foaie); const z = FE.parseRangeAddr(p.sursa.zona); return c == null ? null : wb.getDisplay(s2, z.r1, c); };
      const ok = toate.some((p) => nume(p, p.randuri) === d.randuri && nume(p, p.valori) === d.valori && (!d.fn || p.fn === d.fn) && (d.coloane === undefined || nume(p, p.coloane) === d.coloane));
      return ok ? null : 'Tabelul pivot nu are câmpurile cerute: Rânduri = „' + d.randuri + '”' + (d.coloane ? ', Coloane = „' + d.coloane + '”' : '') + ', Valori = „' + d.valori + '”' + (d.fn ? ' (' + { sum: 'sumă', count: 'numărare', avg: 'medie', max: 'maxim', min: 'minim' }[d.fn] + ')' : '') + '.';
    }
    if (rg.subtotal) {
      const st = wb.sheets[si].subtotal;
      if (!st) return 'Nu există subtotaluri. Folosește Date → Subtotal…';
      const t = randuriTabel(wb, si, FE.addr(st.r1, st.c1) + ':' + FE.addr(st.general, st.c2));
      const grupuri = t.randuri.filter((x) => !st.totaluri.includes(x._r) && x._r !== st.general).map((x) => x[rg.subtotal.grup]);
      const distincte = new Set(grupuri);
      if (st.totaluri.length !== distincte.size) return 'Ai ' + st.totaluri.length + ' subtotaluri, dar sunt ' + distincte.size + ' valori diferite în „' + rg.subtotal.grup + '”. Sortează mai întâi tabelul după această coloană.';
      return null;
    }
    if (rg.protejata !== undefined) {
      const sh = wb.sheets[rg.foaie || 0];
      if (!!sh.protejata !== rg.protejata) return rg.protejata ? 'Foaia „' + sh.name + '” nu este protejată (Revizuire → Protejează foaia).' : 'Foaia ar trebui să nu fie protejată.';
      return null;
    }
    if (rg.deblocate) {
      const z = FE.parseRangeAddr(rg.deblocate);
      const sh = wb.sheets[si];
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) {
        const x = wb.cell(si, r, c);
        if (!x || !x.deblocata) return 'Celula ' + FE.addr(r, c) + ' ar trebui deblocată, ca să poată fi completată pe foaia protejată.';
      }
      for (const [k, x] of sh.cells) {
        const [r, c] = k.split(',').map(Number);
        if (x.deblocata && !inZonaRg(z, r, c) && x.input) return 'Celula ' + FE.addr(r, c) + ' este deblocată, dar ar trebui să rămână blocată (conține date sau formule).';
      }
      return null;
    }
    return null;
  }
  const inZonaRg = (z, r, c) => r >= z.r1 && r <= z.r2 && c >= z.c1 && c <= z.c2;

  /* =================================================================
     CADRUL COMUN AL UNUI EXERCIȚIU
     ================================================================= */
  class Exercitiu {
    constructor(container, ex, opt) {
      this.ex = ex; this.opt = opt || {};
      this.indiciiFolosite = 0; this.solutieVazuta = false;
      this.rezolvat = global.Progres && opt.ora ? global.Progres.eRezolvat(opt.ora, ex.id) : false;
      this.puncteMax = ex.puncte || 10;
      this.root = el('article', { class: 'ex' + (this.rezolvat ? ' rezolvat' : ''), id: 'ex-' + ex.id });
      const cap = el('div', { class: 'ex-cap' },
        el('span', { class: 'ex-tip' }, NUME_TIP[ex.tip] || ex.tip),
        el('h3', null, ex.titlu),
        ex.nivel ? el('span', { class: 'ex-nivel' }, NIVEL[ex.nivel] || ex.nivel) : null,
        el('span', { class: 'ex-puncte' }, this.puncteMax + ' p'));
      this.corp = el('div', { class: 'ex-corp' });
      if (ex.cerinta) this.corp.append(htmlCuMarcaje(el('div', { class: 'ex-cerinta' }), ex.cerinta));
      this.zona = el('div', { class: 'ex-zona' });
      this.corp.append(this.zona);
      this.btnVerifica = el('button', { class: 'btn btn-primar', type: 'button', onclick: () => this.verifica() }, 'Verifică');
      this.btnIndiciu = el('button', { class: 'btn', type: 'button', onclick: () => this.indiciu() }, 'Indiciu');
      this.btnReia = el('button', { class: 'btn btn-fantoma', type: 'button', onclick: () => this.reia() }, 'Reia exercițiul');
      this.actiuni = el('div', { class: 'ex-actiuni' }, this.btnVerifica, this.btnIndiciu, this.btnReia);
      this.feedback = el('div', { class: 'ex-feedback', role: 'status', 'aria-live': 'polite' });
      this.indicii = el('div', { class: 'ex-indicii' });
      this.corp.append(this.actiuni, this.feedback, this.indicii);
      // soluția pentru profesor (pixul roșu)
      if (ex.solutieText || ex.explicatie) {
        const p = el('div', { class: 'pix-rosu doar-profesor' }, el('span', { class: 'titlu-pix' }, 'Soluție'));
        p.append(htmlCuMarcaje(el('div'), ex.solutieText || ex.explicatie));
        this.corp.append(p);
      }
      this.root.append(cap, this.corp);
      container.append(this.root);
      this.actualizeazaIndiciu();
    }
    listaIndicii() { return this.ex.indicii || []; }
    actualizeazaIndiciu() {
      const n = this.listaIndicii().length;
      if (this.indiciiFolosite < n) this.btnIndiciu.textContent = 'Indiciu ' + (this.indiciiFolosite + 1);
      else this.btnIndiciu.textContent = this.solutieVazuta ? 'Soluția este afișată' : 'Arată soluția';
      this.btnIndiciu.disabled = this.solutieVazuta;
    }
    indiciu() {
      const lista = this.listaIndicii();
      if (this.indiciiFolosite < lista.length) {
        const i = this.indiciiFolosite++;
        const d = el('div', { class: 'ex-indiciu' }, el('b', null, 'Indiciu ' + (i + 1)));
        const span = el('span'); htmlCuMarcaje(span, lista[i]); d.append(span);
        this.indicii.append(d);
      } else if (!this.solutieVazuta) {
        this.solutieVazuta = true;
        const d = el('div', { class: 'ex-indiciu' }, el('b', null, 'Soluția'));
        const span = el('span'); htmlCuMarcaje(span, this.textSolutie()); d.append(span);
        this.indicii.append(d);
        this.arataSolutie();
      }
      this.actualizeazaIndiciu();
    }
    textSolutie() { return this.ex.solutieText || this.ex.explicatie || 'Vezi explicația din lecție.'; }
    arataSolutie() { /* suprascris de tipurile care pot afișa soluția direct */ }
    puncteCastigate() {
      if (this.solutieVazuta) return 0;
      return Math.max(Math.round(this.puncteMax * 0.3), this.puncteMax - this.indiciiFolosite * Math.ceil(this.puncteMax / 4));
    }
    mesaj(tip, html) {
      this.feedback.className = 'ex-feedback ' + tip;
      htmlCuMarcaje(this.feedback, html);
    }
    succes(extra) {
      const p = this.puncteCastigate();
      let text = '<b>Corect!</b> ' + (this.ex.felicitare || '');
      if (global.Progres && this.opt.ora) {
        const r = global.Progres.exercitiuRezolvat(this.opt.ora, this.ex.id, { puncte: p, indicii: this.indiciiFolosite, solutie: this.solutieVazuta });
        if (r.nou) text += r.puncte ? ' <b>+' + r.puncte + ' puncte.</b>' : ' (fără puncte, deoarece ai văzut soluția)';
        else text += ' (exercițiul era deja rezolvat)';
      }
      if (extra) text += ' ' + extra;
      if (this.ex.explicatie && !this.solutieVazuta) text += '<div class="explicatie">' + this.ex.explicatie + '</div>';
      this.mesaj('ok', text);
      this.rezolvat = true;
      this.root.classList.add('rezolvat');
      if (this.opt.onRezolvat) this.opt.onRezolvat(this.ex);
    }
    gresit(html) { this.mesaj('gresit', html); }
    reia() {
      this.feedback.className = 'ex-feedback'; this.feedback.textContent = '';
      this.indicii.replaceChildren(); this.indiciiFolosite = 0; this.solutieVazuta = false;
      this.actualizeazaIndiciu();
      this.zona.replaceChildren();
      this.construieste();
    }
  }

  /* ---------- simulator ---------- */
  class ExSimulator extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const ex = this.ex;
      const reguli = ex.reguli || [];
      const tinte = ex.tinte || reguli.filter((r) => r.formula).map((r) => r.formula);
      const editabile = ex.editabile === false ? null : ex.editabile || (reguli.every((r) => r.formula) && tinte.length ? tinte : null);
      this.sp = new global.Spreadsheet(this.zona, {
        def: JSON.parse(JSON.stringify(ex.foi)), inaltime: ex.inaltime || 300, tinte, editabile,
        toolbar: ex.toolbar !== false, permiteFoi: !!ex.permiteFoi, permiteStructura: ex.permiteStructura !== false,
        meniuri: ex.meniuri != null ? ex.meniuri : false
      });
      if (ex.selecteaza) this.sp.select(ex.selecteaza);
      else if (tinte.length) this.sp.select(tinte[0].split(':')[0]);
    }
    reia() { if (this.sp) this.sp.distruge(); super.reia(); }
    verifica() {
      if (this.sp.edit && !this.sp.confirma()) return;
      const m = verificaReguli(this.sp, this.ex.reguli || [], this.ex);
      if (m) this.gresit(esc(m));
      else this.succes();
    }
    textSolutie() {
      const f = (this.ex.reguli || []).filter((r) => r.formula);
      if (this.ex.solutieText) return this.ex.solutieText;
      return f.map((r) => 'În ' + r.formula.split(':')[0] + ': [[' + r.solutie + ']]' + (r.formula.includes(':') ? ', apoi copiază formula în ' + r.formula : '')).join('<br>');
    }
  }

  /* ---------- tragere cu mouse-ul / degetul + tastatură ---------- */
  // Jetoanele pot fi mutate: prin tragere, sau clic pe jeton și apoi clic pe destinație.
  function activeazaTragere(root, onMutare) {
    let ales = null, dupaTragere = 0;
    const alege = (j) => {
      root.querySelectorAll('.dd-jeton.ales').forEach((x) => x.classList.remove('ales'));
      ales = j && j !== ales ? j : null;
      if (ales) ales.classList.add('ales');
    };
    root.addEventListener('click', (e) => {
      if (Date.now() - dupaTragere < 80) return;   // clicul generat de sfârșitul unei trageri
      const j = e.target.closest('.dd-jeton');
      if (j) { e.stopPropagation(); if (ales && ales !== j && j.parentElement.classList.contains('loc') && !j.parentElement.closest('.dd-rezerva')) { const loc = j.parentElement; onMutare(ales, loc); alege(null); return; } alege(j); return; }
      const loc = e.target.closest('.loc, .dd-rezerva');
      if (loc && ales) { onMutare(ales, loc); alege(null); }
    });
    root.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.dd-jeton, .loc, .dd-rezerva')) { e.preventDefault(); e.target.click(); }
    });
    // tragere cu pointer
    root.addEventListener('pointerdown', (e) => {
      const j = e.target.closest('.dd-jeton');
      if (!j || e.button > 0) return;
      const x0 = e.clientX, y0 = e.clientY;
      let clona = null, peste = null;
      const move = (ev) => {
        if (!clona && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
        if (!clona) {
          clona = j.cloneNode(true);
          Object.assign(clona.style, { position: 'fixed', pointerEvents: 'none', zIndex: 500, margin: 0, boxShadow: '0 8px 24px rgba(0,0,0,.25)' });
          document.body.append(clona);
          j.classList.add('trage');
        }
        clona.style.left = (ev.clientX - clona.offsetWidth / 2) + 'px';
        clona.style.top = (ev.clientY - clona.offsetHeight / 2) + 'px';
        const t = document.elementFromPoint(ev.clientX, ev.clientY);
        const loc = t && t.closest && t.closest('.loc, .dd-rezerva');
        if (peste && peste !== loc) peste.classList.remove('peste');
        peste = loc && root.contains(loc) ? loc : null;
        if (peste) peste.classList.add('peste');
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (clona) {
          clona.remove(); j.classList.remove('trage');
          if (peste) { peste.classList.remove('peste'); onMutare(j, peste); }
          dupaTragere = Date.now();
        }
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  }
  function jeton(text, id) { return el('span', { class: 'dd-jeton', tabindex: '0', role: 'button', 'data-id': id }, text); }

  /* ---------- potrivire ---------- */
  class ExPotrivire extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const perechi = this.ex.perechi;
      this.rezerva = el('div', { class: 'dd-rezerva', 'aria-label': 'Termeni de așezat' });
      amesteca(perechi.map((p, i) => i)).forEach((i) => this.rezerva.append(jeton(perechi[i][0], i)));
      this.tinte = el('div', { class: 'dd-tinte' });
      this.locuri = [];
      amesteca(perechi.map((p, i) => i)).forEach((i) => {
        const loc = el('div', { class: 'loc', tabindex: '0', 'data-tinta': i, 'aria-label': 'Loc pentru termen' });
        const d = el('div'); htmlCuMarcaje(d, perechi[i][1]);
        this.tinte.append(el('div', { class: 'dd-tinta' }, d, loc));
        this.locuri.push(loc);
      });
      const cutie = el('div', { class: 'dd' }, el('div', null, el('p', { class: 'eticheta' }, 'Trage sau apasă un termen, apoi locul lui'), this.rezerva), this.tinte);
      this.zona.append(cutie);
      activeazaTragere(cutie, (j, loc) => {
        if (loc.classList.contains('loc')) {
          const existent = loc.querySelector('.dd-jeton');
          if (existent && existent !== j) this.rezerva.append(existent);
        }
        loc.append(j);
        j.classList.remove('corect', 'gresit');
      });
    }
    verifica() {
      let bune = 0, goale = 0;
      this.locuri.forEach((loc) => {
        const j = loc.querySelector('.dd-jeton');
        if (!j) { goale++; return; }
        const ok = j.dataset.id === loc.dataset.tinta;
        j.classList.toggle('corect', ok); j.classList.toggle('gresit', !ok);
        if (ok) bune++;
      });
      if (goale) return this.gresit('Mai ai ' + goale + ' locuri libere. Așază toți termenii.');
      if (bune === this.locuri.length) this.succes();
      else this.gresit('Ai ' + bune + ' din ' + this.locuri.length + ' potriviri corecte. Mută termenii marcați cu roșu.');
    }
    arataSolutie() {
      this.locuri.forEach((loc) => {
        const j = this.zona.querySelector('.dd-jeton[data-id="' + loc.dataset.tinta + '"]');
        const e = loc.querySelector('.dd-jeton'); if (e && e !== j) this.rezerva.append(e);
        loc.append(j); j.classList.add('corect');
      });
    }
    textSolutie() { return this.ex.perechi.map((p) => '<b>' + esc(p[0]) + '</b> — ' + p[1]).join('<br>'); }
  }

  /* ---------- clasificare ---------- */
  class ExClasificare extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const cat = this.ex.categorii;
      this.rezerva = el('div', { class: 'dd-rezerva' });
      const toate = [];
      cat.forEach((c, ci) => c.elemente.forEach((e) => toate.push([e, ci])));
      amesteca(toate).forEach(([e, ci]) => this.rezerva.append(jeton(e, ci)));
      this.cutii = el('div', { class: 'dd-categorii' });
      cat.forEach((c, ci) => this.cutii.append(el('div', { class: 'dd-categorie' }, el('h4', null, c.nume), el('div', { class: 'loc', tabindex: '0', 'data-cat': ci, 'aria-label': 'Categoria ' + c.nume }))));
      const cutie = el('div', null, el('p', { class: 'eticheta' }, 'Trage fiecare element în categoria potrivită'), this.rezerva, el('div', { style: 'height:12px' }), this.cutii);
      this.zona.append(cutie);
      activeazaTragere(cutie, (j, loc) => { loc.append(j); j.classList.remove('corect', 'gresit'); });
    }
    verifica() {
      if (this.rezerva.querySelector('.dd-jeton')) return this.gresit('Mai sunt elemente neașezate.');
      let gresite = 0;
      this.cutii.querySelectorAll('.loc').forEach((loc) => loc.querySelectorAll('.dd-jeton').forEach((j) => {
        const ok = j.dataset.id === loc.dataset.cat;
        j.classList.toggle('corect', ok); j.classList.toggle('gresit', !ok);
        if (!ok) gresite++;
      }));
      if (!gresite) this.succes();
      else this.gresit(gresite + (gresite === 1 ? ' element este' : ' elemente sunt') + ' în categoria greșită (marcate cu roșu).');
    }
    arataSolutie() {
      this.zona.querySelectorAll('.dd-jeton').forEach((j) => { this.cutii.querySelector('.loc[data-cat="' + j.dataset.id + '"]').append(j); j.classList.add('corect'); });
    }
    textSolutie() { return this.ex.categorii.map((c) => '<b>' + esc(c.nume) + ':</b> ' + c.elemente.map(esc).join(', ')).join('<br>'); }
  }

  /* ---------- completare (formula cu goluri) ---------- */
  // sablon: '=VLOOKUP(A2,{{$A$2:$C$9}},{{3}},FALSE)'  — variante acceptate: {{3|3,0}}
  const normRasp = (s) => String(s).replace(/\s+/g, '').replace(/;/g, ',').toUpperCase();
  class ExCompletare extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const parti = this.ex.sablon.split(/(\{\{.*?\}\})/);
      this.goluri = [];
      const rand = el('div', { class: 'formula-lacuna' });
      parti.forEach((p) => {
        const m = /^\{\{(.*)\}\}$/.exec(p);
        if (m) {
          const variante = m[1].split('|');
          const inp = el('input', { type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Completează' });
          inp.style.width = Math.max(4, Math.max(...variante.map((v) => v.length)) + 2) + 'ch';
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifica(); });
          this.goluri.push({ inp, variante });
          rand.append(inp);
        } else if (p) rand.append(el('span', null, p));
      });
      this.zona.append(rand);
      if (this.ex.foi) {
        this.sp = new global.Spreadsheet(el('div', { style: 'margin-top:12px' }), { def: JSON.parse(JSON.stringify(this.ex.foi)), inaltime: this.ex.inaltime || 220, toolbar: false, permiteFoi: false, editabile: ['ZZ1'] });
        this.zona.append(this.sp.root);
      }
    }
    verifica() {
      let gresite = 0;
      for (const g of this.goluri) {
        const ok = g.variante.some((v) => normRasp(v) === normRasp(g.inp.value));
        g.inp.style.borderColor = ok ? 'var(--verde)' : 'var(--rosu)';
        if (!ok) gresite++;
      }
      if (!gresite) {
        const f = this.formulaCompleta();
        this.succes(this.sp ? 'Formula completă: <code class="f">' + esc(f) + '</code> dă rezultatul <b>' + esc(afisare(FE.evalueaza(this.sp.wb, f, 0, 0, 0))) + '</b>.' : '');
      } else this.gresit(gresite === 1 ? 'Un spațiu liber nu este completat corect (marcat cu roșu).' : gresite + ' spații libere nu sunt completate corect (marcate cu roșu).');
    }
    formulaCompleta() { let i = 0; return this.ex.sablon.replace(/\{\{.*?\}\}/g, () => this.goluri[i++].variante[0]); }
    arataSolutie() { this.goluri.forEach((g) => { g.inp.value = g.variante[0]; g.inp.style.borderColor = 'var(--verde)'; }); }
    textSolutie() { return this.ex.solutieText || '[[' + this.formulaCompleta() + ']]'; }
  }

  /* ---------- găsește greșeala ---------- */
  function jetoaneFormula(f) {
    return f.match(/"[^"]*"?|'[^']*'!|[A-Za-z_À-ɏ][A-Za-z0-9_.À-ɏ]*!|\$?[A-Za-z]{1,3}\$?\d+|[A-Za-z_À-ɏ][A-Za-z0-9_.À-ɏ]*|\d+(?:[.,]\d+)?%?|<=|>=|<>|\S/g) || [];
  }
  class ExGreseala extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      this.jet = this.ex.jetoane || jetoaneFormula(this.ex.formula);
      this.gresite = [].concat(this.ex.gresit).map(String);
      this.alese = new Set();
      const rand = el('div', { class: 'formula-jetoane', role: 'group', 'aria-label': 'Formula — apasă pe bucata greșită' });
      this.butoane = this.jet.map((t, i) => {
        const b = el('button', { type: 'button', 'aria-pressed': 'false', onclick: () => {
          if (this.alese.has(i)) this.alese.delete(i); else this.alese.add(i);
          b.classList.toggle('ales', this.alese.has(i)); b.setAttribute('aria-pressed', this.alese.has(i));
        } }, t);
        rand.append(b);
        return b;
      });
      this.zona.append(el('p', { class: 'eticheta' }, 'Apasă pe bucata (sau bucățile) greșită(e)'), rand);
      if (this.ex.foi) {
        this.sp = new global.Spreadsheet(el('div', { style: 'margin-top:12px' }), { def: JSON.parse(JSON.stringify(this.ex.foi)), inaltime: this.ex.inaltime || 220, toolbar: false, permiteFoi: false });
        this.zona.append(this.sp.root);
      }
    }
    corecte() {
      // indicii jetoanelor greșite: după text sau după poziție (număr)
      const s = new Set();
      for (const g of this.gresite) {
        if (/^#\d+$/.test(g)) s.add(+g.slice(1));
        else this.jet.forEach((t, i) => { if (t === g) s.add(i); });
      }
      return s;
    }
    verifica() {
      const corecte = this.corecte();
      if (!this.alese.size) return this.gresit('Apasă pe bucata din formulă pe care o crezi greșită.');
      const ok = this.alese.size === corecte.size && [...this.alese].every((i) => corecte.has(i));
      if (ok) {
        this.butoane.forEach((b, i) => { if (corecte.has(i)) { b.classList.remove('ales'); b.classList.add('corect'); } });
        this.succes(this.ex.corect ? 'Formula corectă: [[' + this.ex.corect + ']]' : '');
      } else if ([...this.alese].some((i) => corecte.has(i))) this.gresit('Ești aproape: ai găsit o parte din greșeală, dar ai marcat și bucăți corecte sau ți-a scăpat ceva.');
      else this.gresit('Bucata marcată este scrisă corect. Mai caută!');
    }
    arataSolutie() {
      const corecte = this.corecte();
      this.alese = new Set(corecte);
      this.butoane.forEach((b, i) => { b.classList.toggle('corect', corecte.has(i)); b.classList.remove('ales'); b.setAttribute('aria-pressed', corecte.has(i)); });
    }
    textSolutie() { return (this.ex.explicatie || '') + (this.ex.corect ? '<br>Formula corectă: [[' + this.ex.corect + ']]' : ''); }
  }

  /* ---------- ordonare ---------- */
  class ExOrdonare extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const pasi = this.ex.pasi;
      let ordine = amesteca(pasi.map((p, i) => i));
      if (ordine.every((v, i) => v === i) && pasi.length > 1) ordine = [...ordine.slice(1), ordine[0]];
      this.lista = el('ol', { class: 'ord-lista' });
      ordine.forEach((i) => this.lista.append(this.element(i)));
      this.zona.append(el('p', { class: 'eticheta' }, 'Trage pașii sau folosește săgețile'), this.lista);
      this.tragere();
    }
    element(i) {
      const li = el('li', { 'data-id': i });
      const t = el('span', { class: 'text' }); htmlCuMarcaje(t, this.ex.pasi[i]);
      const sus = el('button', { type: 'button', 'aria-label': 'Mută mai sus', onclick: () => { if (li.previousElementSibling) this.lista.insertBefore(li, li.previousElementSibling); this.curata(); sus.focus(); } }, '↑');
      const jos = el('button', { type: 'button', 'aria-label': 'Mută mai jos', onclick: () => { if (li.nextElementSibling) this.lista.insertBefore(li.nextElementSibling, li); this.curata(); jos.focus(); } }, '↓');
      li.append(t, el('span', { class: 'sageti' }, sus, jos));
      return li;
    }
    curata() { this.lista.querySelectorAll('li').forEach((l) => l.classList.remove('corect', 'gresit')); }
    tragere() {
      this.lista.addEventListener('pointerdown', (e) => {
        const li = e.target.closest('li');
        if (!li || e.target.closest('button')) return;
        e.preventDefault();
        li.classList.add('trage');
        const move = (ev) => {
          const t = document.elementFromPoint(ev.clientX, ev.clientY);
          const alt = t && t.closest && t.closest('.ord-lista li');
          if (!alt || alt === li || alt.parentElement !== this.lista) return;
          const r = alt.getBoundingClientRect();
          if (ev.clientY < r.top + r.height / 2) this.lista.insertBefore(li, alt); else this.lista.insertBefore(li, alt.nextSibling);
        };
        const up = () => { li.classList.remove('trage'); this.curata(); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
    }
    verifica() {
      const li = [...this.lista.children];
      let bune = 0;
      li.forEach((l, i) => { const ok = +l.dataset.id === i; l.classList.toggle('corect', ok); l.classList.toggle('gresit', !ok); if (ok) bune++; });
      if (bune === li.length) this.succes();
      else this.gresit(bune + ' din ' + li.length + ' pași sunt la locul lor. Pașii marcați cu roșu trebuie mutați.');
    }
    arataSolutie() { this.lista.replaceChildren(...this.ex.pasi.map((p, i) => { const l = this.element(i); l.classList.add('corect'); return l; })); }
    textSolutie() { return '<ol>' + this.ex.pasi.map((p) => '<li>' + p + '</li>').join('') + '</ol>'; }
  }

  /* ---------- ce rezultat dă formula? ---------- */
  class ExRezultat extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const ex = this.ex;
      if (ex.foi) {
        this.wb = new FE.Workbook(JSON.parse(JSON.stringify(ex.foi)));
        this.sp = new global.Spreadsheet(this.zona, { workbook: this.wb, inaltime: ex.inaltime || 220, toolbar: false, permiteFoi: false, editabile: ['ZZ1'], status: true });
      } else this.wb = new FE.Workbook({});
      this.asteptat = ex.raspuns != null ? ex.raspuns : FE.evalueaza(this.wb, ex.formula, 0, 30, 20);
      const f = el('p', null, 'Formula: '); htmlCuMarcaje(f, 'Formula: [[' + ex.formula + ']]' + (ex.celula ? ' (scrisă în celula ' + ex.celula + ')' : ''));
      this.zona.append(f);
      if (ex.variante) {
        this.optiuni = el('div', { class: 'optiuni-grila' });
        amesteca(ex.variante).forEach((v) => this.optiuni.append(el('label', { class: 'optiune' }, el('input', { type: 'radio', name: 'rez-' + ex.id, value: v }), el('span', null, v))));
        this.zona.append(this.optiuni);
      } else {
        this.inp = el('input', { type: 'text', 'aria-label': 'Rezultatul', placeholder: 'Scrie rezultatul', autocomplete: 'off' });
        this.inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifica(); });
        this.zona.append(el('label', { class: 'rand-butoane' }, el('span', null, 'Rezultat: '), this.inp));
      }
    }
    textAsteptat() { return afisare(this.asteptat); }
    verifica() {
      let r;
      if (this.optiuni) { const x = this.optiuni.querySelector('input:checked'); if (!x) return this.gresit('Alege o variantă.'); r = x.value; }
      else r = this.inp.value.trim();
      if (!r) return this.gresit('Scrie un rezultat.');
      const a = this.asteptat;
      let ok;
      if (FE.isErr(a)) ok = r.toUpperCase() === a.code;
      else if (typeof a === 'number') { const n = FE.literal(r.replace(/\s/g, '').replace(/lei$/i, '')).v; ok = typeof n === 'number' && Math.abs(n - a) < 1e-6 * Math.max(1, Math.abs(a)); if (!ok) ok = r === afisare(a); }
      else if (typeof a === 'boolean') { const n = FE.literal(r).v; ok = n === a; }
      else ok = r.replace(/^"|"$/g, '').toLowerCase() === String(a).toLowerCase();
      if (ok) this.succes();
      else this.gresit('Nu este rezultatul corect. Calculează pas cu pas: ce valori sunt în celulele folosite?');
    }
    arataSolutie() { if (this.inp) this.inp.value = this.textAsteptat(); }
    textSolutie() { return 'Rezultatul este <b>' + esc(this.textAsteptat()) + '</b>. ' + (this.ex.explicatie || ''); }
  }

  /* ---------- grilă ---------- */
  class ExGrila extends Exercitiu {
    constructor(c, ex, o) { super(c, ex, o); this.construieste(); }
    construieste() {
      const multiplu = Array.isArray(this.ex.corect);
      this.optiuni = el('div', { class: 'optiuni-grila' });
      amesteca(this.ex.variante.map((v, i) => i)).forEach((i) => {
        const s = el('span'); htmlCuMarcaje(s, this.ex.variante[i]);
        this.optiuni.append(el('label', { class: 'optiune' }, el('input', { type: multiplu ? 'checkbox' : 'radio', name: 'g-' + this.ex.id, value: i }), s));
      });
      if (multiplu) this.zona.append(el('p', { class: 'eticheta' }, 'Pot fi mai multe răspunsuri corecte'));
      this.zona.append(this.optiuni);
    }
    verifica() {
      const corect = new Set([].concat(this.ex.corect));
      const alese = new Set([...this.optiuni.querySelectorAll('input:checked')].map((x) => +x.value));
      if (!alese.size) return this.gresit('Alege un răspuns.');
      this.optiuni.querySelectorAll('.optiune').forEach((o) => {
        const i = +o.querySelector('input').value;
        o.classList.toggle('corect', alese.has(i) && corect.has(i));
        o.classList.toggle('gresit', alese.has(i) && !corect.has(i));
      });
      const ok = alese.size === corect.size && [...alese].every((i) => corect.has(i));
      if (ok) this.succes(); else this.gresit('Răspuns incomplet sau greșit. Mai citește o dată variantele.');
    }
    arataSolutie() { this.optiuni.querySelectorAll('input').forEach((x) => { x.checked = [].concat(this.ex.corect).includes(+x.value); }); }
    textSolutie() { return [].concat(this.ex.corect).map((i) => this.ex.variante[i]).join('<br>') + (this.ex.explicatie ? '<br>' + this.ex.explicatie : ''); }
  }

  const TIPURI = { simulator: ExSimulator, potrivire: ExPotrivire, clasificare: ExClasificare, completare: ExCompletare, greseala: ExGreseala, ordonare: ExOrdonare, rezultat: ExRezultat, grila: ExGrila };

  global.Exercitii = {
    randeaza(container, ex, opt) {
      const C = TIPURI[ex.tip];
      if (!C) { container.append(el('p', null, 'Tip de exercițiu necunoscut: ' + ex.tip)); return null; }
      const inst = new C(container, ex, opt);
      global.Exercitii.instante[ex.id] = inst;   // util pentru testare din consolă
      return inst;
    },
    instante: {},
    verificaReguli, verificaFormula, jetoaneFormula, activeazaTragere, afisare, TIPURI
  };
})(window);
