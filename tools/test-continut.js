/* =====================================================================
   tools/test-continut.js — Verifică automat conținutul lecțiilor
   • soluția fiecărui exercițiu cu formulă trece propria verificare
   • formulele din texte ([[=…]]) sunt scrise corect
   • întrebările sunt complete, cu id-uri unice, iar variantele corecte există
   Rulare:  node tools/test-continut.js          (toate orele)
            node tools/test-continut.js 5        (doar ora 5)
   ===================================================================== */
const fs = require('fs');
const path = require('path');
globalThis.window = globalThis;
require('../data/functii.js');
const FE = require('../assets/js/formula-engine.js');
FE.optiuni.azi = FE.dataInSerial(2025, 9, 15);
// App minimal, doar cât are nevoie exercises.js pentru verificări
globalThis.App = { el: () => ({}), esc: (s) => s, amesteca: (a) => a, htmlCuMarcaje: (x) => x, toast: () => {} };
require('../assets/js/exercises.js');
const EX = globalThis.Exercitii;

const doar = process.argv[2] === 'olimpiada' ? [] : process.argv[2] ? [+process.argv[2]] : [...Array(15).keys()].map((i) => i + 1);
let erori = 0, verificari = 0;
const eroare = (m) => { erori++; console.log('  ✗ ' + m); };
const ids = new Set();
const pad = (n) => String(n).padStart(2, '0');
const afis = (v) => (FE.isErr(v) ? v.code : v === null ? '(gol)' : String(v));

function formuleDinText(t, unde) {
  const re = /\[\[(=.*?)\]\]/g; let m;
  while ((m = re.exec(String(t)))) {
    verificari++;
    const e = FE.verificaSintaxa(m[1]);
    if (e) eroare(unde + ': formulă greșită în text ' + m[1] + ' — ' + e.mesaj);
    for (const f of FE.functiiFolosite(m[1])) if (!FE.numeCanonic(f)) eroare(unde + ': funcție necunoscută ' + f + ' în ' + m[1]);
  }
  const re2 = /\[\[fn:([A-Z.]+)\]\]/g;
  while ((m = re2.exec(String(t)))) { verificari++; if (!FE.numeCanonic(m[1])) eroare(unde + ': [[fn:' + m[1] + ']] necunoscut'); }
}
function toateTextele(o, unde) {
  if (typeof o === 'string') formuleDinText(o, unde);
  else if (Array.isArray(o)) o.forEach((x) => toateTextele(x, unde));
  else if (o && typeof o === 'object') for (const k in o) if (k !== 'foi') toateTextele(o[k], unde);
}

for (const n of doar) {
  const fl = path.join(__dirname, '../data/lectii/ora-' + pad(n) + '.js');
  const fq = path.join(__dirname, '../data/intrebari/ora-' + pad(n) + '.js');
  if (!fs.existsSync(fl)) { console.log('Ora ' + n + ': lipsește fișierul lecției'); continue; }
  require(fl);
  const L = window.DATE_LECTII[n];
  console.log('Ora ' + n + ': ' + (L ? L.titlu : '?'));
  if (!L) { eroare('DATE_LECTII[' + n + '] nu este definit'); continue; }
  toateTextele(L, 'ora ' + n);
  if (L.simulator) { try { new FE.Workbook(L.simulator.foi); } catch (e) { eroare('simulator: ' + e.message); } }
  for (const ex of L.exercitii || []) {
    const u = 'ex ' + ex.id;
    if (ids.has(ex.id)) eroare(u + ': id duplicat'); ids.add(ex.id);
    if (!ex.titlu || !ex.tip) eroare(u + ': lipsește titlul sau tipul');
    if (!(ex.indicii && ex.indicii.length)) eroare(u + ': fără indicii');
    if (ex.tip === 'simulator') {
      // toate soluțiile se scriu în același registru (cum ar lucra elevul)
      const wb = new FE.Workbook(JSON.parse(JSON.stringify(ex.foi)));
      for (const rg of ex.reguli || []) {
        if (!rg.formula) continue;
        const si = typeof rg.foaie === 'number' ? rg.foaie : 0;
        const z = FE.parseRangeAddr(rg.formula);
        for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) wb.setInput(si, r, c, FE.deplaseaza(rg.solutie, r - z.r1, c - z.c1));
      }
      for (const rg of ex.reguli || []) {
        if (!rg.formula) continue;
        verificari++;
        const si = typeof rg.foaie === 'number' ? rg.foaie : 0;
        const z = FE.parseRangeAddr(rg.formula);
        const m = EX.verificaFormula(wb, rg, si);
        if (m) eroare(u + ': soluția nu trece verificarea: ' + m);
        const v = wb.getValue(si, z.r1, z.c1);
        if (FE.isErr(v) && !rg.permiteEroare) eroare(u + ': soluția dă eroarea ' + v.code);
        if (process.env.ARATA) console.log('    ' + u + ' ' + rg.formula + ' ' + rg.solutie + ' → ' + afis(v));
      }
    }
    if (ex.tip === 'rezultat') {
      verificari++;
      const wb = new FE.Workbook(ex.foi ? JSON.parse(JSON.stringify(ex.foi)) : {});
      const v = FE.evalueaza(wb, ex.formula, 0, 30, 20);
      if (FE.isErr(v) && !ex.eroareAsteptata) eroare(u + ': formula dă eroarea ' + v.code);
      if (process.env.ARATA) console.log('    ' + u + ' ' + ex.formula + ' → ' + afis(v));
    }
    if (ex.tip === 'greseala') {
      verificari++;
      const jet = ex.jetoane || EX.jetoaneFormula(ex.formula);
      for (const g of [].concat(ex.gresit)) if (!/^#\d+$/.test(g) && !jet.includes(g)) eroare(u + ': jetonul greșit „' + g + '” nu există în ' + jet.join(' '));
      if (ex.corect && FE.verificaSintaxa(ex.corect)) eroare(u + ': formula corectă are greșeli');
    }
    if (ex.tip === 'completare') {
      verificari++;
      let i = 0; const f = ex.sablon.replace(/\{\{(.*?)\}\}/g, (m, x) => x.split('|')[0]);
      if (f.startsWith('=') && FE.verificaSintaxa(f)) eroare(u + ': formula completă are greșeli: ' + f);
      void i;
    }
    if (ex.tip === 'grila') { verificari++; for (const c of [].concat(ex.corect)) if (!(c >= 0 && c < ex.variante.length)) eroare(u + ': varianta corectă inexistentă'); }
    if (ex.tip === 'potrivire' && new Set(ex.perechi.map((p) => p[0])).size !== ex.perechi.length) eroare(u + ': termeni duplicați');
  }
  if (L.fisa) { try { new FE.Workbook(L.fisa.foi); } catch (e) { eroare('fișa: ' + e.message); } if (!L.fisa.cerinte || L.fisa.cerinte.length < 4) eroare('fișa are mai puțin de 4 cerințe');
    const total = L.fisa.cerinte.reduce((t, c) => t + (c.puncte || 0), 0);
    if (Math.abs(total - 9) > 1e-9) eroare('fișa are ' + total + ' puncte (trebuie 9, plus 1 din oficiu)'); }
  // întrebări
  if (!fs.existsSync(fq)) { eroare('lipsește banca de întrebări'); continue; }
  require(fq);
  const Q = (window.INTREBARI || {})[n] || [];
  if (Q.length < 15) eroare('banca are doar ' + Q.length + ' întrebări (minim 15)');
  const tipuri = new Set();
  for (const q of Q) {
    const u = 'întrebarea ' + q.id;
    verificari++;
    tipuri.add(q.tip);
    if (ids.has(q.id)) eroare(u + ': id duplicat'); ids.add(q.id);
    formuleDinText(q.enunt + ' ' + (q.explicatie || '') + ' ' + (q.variante || []).join(' '), u);
    if ((q.tip === 'unic' && !(q.corect >= 0 && q.corect < q.variante.length)) || (q.tip === 'multiplu' && !q.corect.every((c) => c >= 0 && c < q.variante.length))) eroare(u + ': varianta corectă inexistentă');
    if (q.tip === 'adevarat' && typeof q.corect !== 'boolean') eroare(u + ': corect trebuie true/false');
    if (q.tip === 'completare' && !(q.raspunsuri && q.raspunsuri.length)) eroare(u + ': fără răspunsuri');
    if (q.tip === 'formula') {
      const wb = new FE.Workbook(JSON.parse(JSON.stringify(q.foi)));
      const z = FE.parseRangeAddr(q.tinta);
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) wb.setInput(0, r, c, FE.deplaseaza(q.solutie, r - z.r1, c - z.c1));
      const m = EX.verificaFormula(wb, { formula: q.tinta, solutie: q.solutie, functii: q.functii, robust: q.robust });
      if (m) eroare(u + ': soluția nu trece verificarea: ' + m);
      if (FE.isErr(wb.getValue(0, z.r1, z.c1))) eroare(u + ': soluția dă eroare');
    }
  }
  if (tipuri.size < 4) eroare('banca are puține tipuri de itemi: ' + [...tipuri].join(', '));
  console.log('  ' + (L.exercitii || []).length + ' exerciții, ' + Q.length + ' întrebări');
}
// ---------------- Olimpiadă: subiecte de antrenament și sprint ----------------
if (!process.argv[2] || process.argv[2] === 'olimpiada') {
  require('../data/olimpiada/subiecte.js');
  require('../data/olimpiada/sprint.js');
  const S = window.SUBIECTE_OLIMPIADA || [];
  if (S.length < 6) eroare('sunt doar ' + S.length + ' subiecte de olimpiadă (minim 6)');
  for (const sub of S) {
    console.log('Olimpiadă ' + sub.id + ': ' + sub.titlu);
    const total = sub.cerinte.reduce((t, c) => t + c.puncte, 0);
    if (total !== 100) eroare('subiectul ' + sub.id + ' are ' + total + ' puncte (trebuie 100)');
    toateTextele(sub, 'subiect ' + sub.id);
    // toate soluțiile se scriu, în ordinea cerințelor, în același registru
    const wb = new FE.Workbook(JSON.parse(JSON.stringify(sub.foi)));
    for (const c of sub.cerinte) {
      if (!c.solutie) eroare('subiect ' + sub.id + ' cerința ' + c.nr + ': fără soluție explicată');
      if (!c.manual && !(c.reguli && c.reguli.length)) eroare('subiect ' + sub.id + ' cerința ' + c.nr + ': fără reguli și nemarcată ca manuală');
      for (const rg of c.reguli || []) {
        if (!rg.formula) continue;
        const si = typeof rg.foaie === 'number' ? rg.foaie : 0;
        const z = FE.parseRangeAddr(rg.formula);
        for (let r = z.r1; r <= z.r2; r++) for (let cc = z.c1; cc <= z.c2; cc++) wb.setInput(si, r, cc, FE.deplaseaza(rg.solutie, r - z.r1, cc - z.c1));
      }
    }
    for (const c of sub.cerinte) for (const rg of c.reguli || []) {
      if (!rg.formula) continue;
      verificari++;
      const si = typeof rg.foaie === 'number' ? rg.foaie : 0;
      const m = EX.verificaFormula(wb, rg, si);
      if (m) eroare('subiect ' + sub.id + ' cerința ' + c.nr + ': soluția nu trece verificarea: ' + m);
      const z = FE.parseRangeAddr(rg.formula);
      const v = wb.getValue(si, z.r1, z.c1);
      if (FE.isErr(v)) eroare('subiect ' + sub.id + ' cerința ' + c.nr + ': soluția dă ' + v.code);
      if (process.env.ARATA) console.log('    c' + c.nr + ' ' + rg.formula + ' ' + rg.solutie + ' → ' + afis(v));
    }
  }
  const SP = window.SPRINT_OLIMPIADA || [];
  console.log('Sprint: ' + SP.length + ' provocări');
  for (const q of SP) {
    verificari++;
    if (ids.has(q.id)) eroare('sprint ' + q.id + ': id duplicat'); ids.add(q.id);
    const wb = new FE.Workbook(JSON.parse(JSON.stringify(q.foi)));
    const p = FE.parseAddr(q.tinta);
    wb.setInput(0, p.r, p.c, q.solutie);
    const m = EX.verificaFormula(wb, { formula: q.tinta, solutie: q.solutie, functii: q.functii });
    if (m) eroare('sprint ' + q.id + ': ' + m);
    const v = wb.getValue(0, p.r, p.c);
    if (FE.isErr(v)) eroare('sprint ' + q.id + ': soluția dă ' + v.code);
    if (process.env.ARATA) console.log('    ' + q.id + ' ' + q.solutie + ' → ' + afis(v));
  }
}

console.log('\n' + verificari + ' verificări, ' + erori + ' erori.');
process.exit(erori ? 1 : 0);
