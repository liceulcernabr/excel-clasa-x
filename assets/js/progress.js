/* =====================================================================
   progress.js — Puncte, insigne și progresul pe cele 15 ore
   Datele se păstrează în localStorage (cheia „excel-x-progres”).
   Dacă browserul nu permite stocarea, progresul rămâne doar până la
   închiderea paginii — site-ul funcționează în continuare.
   ===================================================================== */
(function (global) {
  'use strict';
  const CHEIE = 'excel-x-progres';

  // Insignele generale (pe lângă insigna fiecărei ore)
  const INSIGNE = {
    'primul-pas': { titlu: 'Primul pas', text: 'Ai rezolvat primul exercițiu.', simbol: '1' },
    'fara-indicii': { titlu: 'Pe cont propriu', text: '10 exerciții rezolvate fără niciun indiciu.', simbol: '★' },
    'nota-10': { titlu: 'Nota 10', text: 'Ai obținut nota 10 la un test.', simbol: '10' },
    'semestru': { titlu: 'Jumătate de drum', text: '8 ore finalizate.', simbol: '½' },
    'toate-orele': { titlu: 'Toate cele 15 ore', text: 'Ai finalizat toate lecțiile.', simbol: '15' },
    'olimpic': { titlu: 'Antrenament de olimpiadă', text: 'Ai rezolvat un subiect de antrenament.', simbol: 'O' },
    'sprinter': { titlu: 'Sprinter', text: 'Ai terminat un sprint de formule.', simbol: '⏱' }
  };

  function gol() { return { versiune: 1, ore: {}, teste: {}, insigne: {}, puncte: 0, olimpiada: {} }; }
  function citeste() {
    const s = global.App ? global.App.stocare.get(CHEIE, null) : null;
    return s && s.versiune === 1 ? Object.assign(gol(), s) : gol();
  }
  let stare = citeste();
  function salveaza() { if (global.App) global.App.stocare.set(CHEIE, stare); actualizeazaAntet(); }
  function ora(n) { return (stare.ore[n] = stare.ore[n] || { ex: {}, total: 0, test: null }); }

  function actualizeazaAntet() {
    const e = document.getElementById('puncte-sus');
    if (e) e.textContent = stare.puncte + ' p';
  }

  function acorda(id, titlu) {
    if (stare.insigne[id]) return false;
    stare.insigne[id] = new Date().toISOString();
    if (global.App) global.App.toast('Insignă nouă: ' + titlu, 'insigna-noua');
    return true;
  }

  function verificaInsigne() {
    const toate = Object.values(stare.ore).flatMap((o) => Object.values(o.ex));
    if (toate.length >= 1) acorda('primul-pas', INSIGNE['primul-pas'].titlu);
    if (toate.filter((x) => !x.indicii && !x.solutie).length >= 10) acorda('fara-indicii', INSIGNE['fara-indicii'].titlu);
    let finalizate = 0;
    for (let n = 1; n <= 15; n++) {
      if (oraFinalizata(n)) { finalizate++; acorda('ora-' + n, 'Ora ' + n + ' finalizată'); }
    }
    if (finalizate >= 8) acorda('semestru', INSIGNE.semestru.titlu);
    if (finalizate >= 15) acorda('toate-orele', INSIGNE['toate-orele'].titlu);
    const note = [...Object.values(stare.teste), ...Object.values(stare.ore).map((o) => o.test)].filter(Boolean);
    if (note.some((t) => t.nota >= 10)) acorda('nota-10', INSIGNE['nota-10'].titlu);
    if (Object.keys(stare.olimpiada).some((k) => k.startsWith('subiect'))) acorda('olimpic', INSIGNE.olimpic.titlu);
    if (stare.olimpiada.sprint) acorda('sprinter', INSIGNE.sprinter.titlu);
  }

  function oraFinalizata(n) {
    const o = stare.ore[n];
    if (!o || !o.total) return false;
    return Object.keys(o.ex).length >= o.total && o.test && o.test.nota >= 5;
  }

  global.Progres = {
    INSIGNE,
    stare: () => stare,
    seteazaTotal(n, total) { const o = ora(n); if (o.total !== total) { o.total = total; salveaza(); } },
    eRezolvat(n, id) { return !!(stare.ore[n] && stare.ore[n].ex[id]); },
    // Înregistrează un exercițiu rezolvat. Punctele se primesc o singură dată.
    exercitiuRezolvat(n, id, info) {
      const o = ora(n);
      if (o.ex[id]) return { nou: false, puncte: 0 };
      const puncte = Math.max(0, Math.round(info.puncte || 0));
      o.ex[id] = { puncte, indicii: info.indicii || 0, solutie: !!info.solutie, data: new Date().toISOString() };
      stare.puncte += puncte;
      verificaInsigne();
      salveaza();
      return { nou: true, puncte };
    },
    // cheie: 'ora-3' pentru mini-teste sau 'evaluare-1' … 'evaluare-3'
    testTerminat(cheie, nota, puncteTest) {
      const m = /^ora-(\d+)$/.exec(cheie);
      const rez = { nota, data: new Date().toISOString() };
      let bonus = 0;
      if (m) {
        const o = ora(+m[1]);
        if (!o.test || nota > o.test.nota) { bonus = Math.max(0, Math.round((nota - (o.test ? o.test.nota : 0)) * 3)); o.test = rez; }
      } else if (!stare.teste[cheie] || nota > stare.teste[cheie].nota) {
        bonus = Math.max(0, Math.round((nota - (stare.teste[cheie] ? stare.teste[cheie].nota : 0)) * 5));
        stare.teste[cheie] = rez;
      }
      stare.puncte += bonus || 0;
      verificaInsigne();
      salveaza();
      return bonus;
    },
    olimpiada(cheie, date) { stare.olimpiada[cheie] = Object.assign({ data: new Date().toISOString() }, date || {}); verificaInsigne(); salveaza(); },
    // Procentul unei ore: exercițiile rezolvate + mini-testul
    procentOra(n) {
      const o = stare.ore[n];
      if (!o || !o.total) return 0;
      const facute = Math.min(o.total, Object.keys(o.ex).length) + (o.test && o.test.nota >= 5 ? 1 : 0);
      return Math.round((facute / (o.total + 1)) * 100);
    },
    oraFinalizata,
    notaTest(cheie) {
      const m = /^ora-(\d+)$/.exec(cheie);
      if (m) { const o = stare.ore[m[1]]; return o && o.test ? o.test.nota : null; }
      return stare.teste[cheie] ? stare.teste[cheie].nota : null;
    },
    puncte: () => stare.puncte,
    reseteaza() { stare = gol(); salveaza(); },
    actualizeazaAntet
  };
})(window);
