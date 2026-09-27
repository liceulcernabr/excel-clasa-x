/* =====================================================================
   charts.js — Diagramele simulatorului (desenate în SVG, fără biblioteci,
   deci funcționează și fără internet)
   ---------------------------------------------------------------------
   Definiția unei diagrame (salvată în foaie, în „diagrame”):
   { id, tip: 'coloane' | 'bare' | 'linie' | 'placinta' | 'coloane-stivuite' | 'inel',
     zona: 'A1:C7',               // datele (cu etichete pe primul rând / prima coloană)
     titlu: 'Temperaturi Brăila',
     titluX: 'Luna', titluY: '°C', // titlurile axelor
     legenda: true,                // afișează legenda
     etichete: false,              // etichete de date (valorile pe diagramă)
     seriiPe: 'coloane' }          // 'coloane' sau 'randuri'
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;

  const TIPURI = {
    coloane: 'Coloane grupate',
    'coloane-stivuite': 'Coloane stivuite',
    bare: 'Bare orizontale',
    linie: 'Linie',
    placinta: 'Radială (plăcintă)',
    inel: 'Inel'
  };
  const CULORI = ['var(--ref-0)', 'var(--ref-4)', 'var(--ref-3)', 'var(--ref-1)', 'var(--ref-2)', 'var(--ref-5)', '#8d6e63', '#607d8b'];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Extrage categoriile și seriile dintr-o zonă a registrului
  function dinZona(wb, si, zona, seriiPe) {
    const z = FE.parseRangeAddr(zona);
    if (!z) return null;
    const val = (r, c) => wb.getValue(si, r, c);
    const afis = (r, c) => wb.getDisplay(si, r, c);
    const eNum = (v) => typeof v === 'number';
    // primul rând e antet dacă are text în afara primei celule
    let antet = false;
    for (let c = z.c1; c <= z.c2; c++) { const v = val(z.r1, c); if (typeof v === 'string' && v !== '') antet = true; }
    if (z.r1 === z.r2) antet = false;
    // prima coloană conține etichete dacă nu are numere sub antet (sau are date calendaristice)
    let eticheteCol = z.c1 < z.c2;
    for (let r = z.r1 + (antet ? 1 : 0); r <= z.r2 && eticheteCol; r++) {
      const v = val(r, z.c1);
      const f = wb.getFormat(si, r, z.c1);
      if (eNum(v) && !(f && f.type === 'date')) eticheteCol = false;
    }
    const r0 = z.r1 + (antet ? 1 : 0), c0 = z.c1 + (eticheteCol ? 1 : 0);
    let categorii = [], serii = [];
    if (seriiPe === 'randuri') {
      for (let c = c0; c <= z.c2; c++) categorii.push(antet ? afis(z.r1, c) : String(c - c0 + 1));
      for (let r = r0; r <= z.r2; r++) {
        const valori = [];
        for (let c = c0; c <= z.c2; c++) { const v = val(r, c); valori.push(eNum(v) ? v : 0); }
        serii.push({ nume: eticheteCol ? afis(r, z.c1) : 'Seria ' + (r - r0 + 1), valori });
      }
    } else {
      for (let r = r0; r <= z.r2; r++) categorii.push(eticheteCol ? afis(r, z.c1) : String(r - r0 + 1));
      for (let c = c0; c <= z.c2; c++) {
        const valori = [];
        for (let r = r0; r <= z.r2; r++) { const v = val(r, c); valori.push(eNum(v) ? v : 0); }
        serii.push({ nume: antet ? afis(z.r1, c) : 'Seria ' + (c - c0 + 1), valori });
      }
    }
    return { categorii, serii };
  }

  // Pas „frumos” pentru axa valorilor (1, 2, 2.5, 5, 10 × 10^n)
  function pasFrumos(interval, n) {
    const brut = interval / (n || 5);
    const p = Math.pow(10, Math.floor(Math.log10(brut || 1)));
    const f = brut / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  const fmt = (v) => FE.formatValoare(Math.round(v * 1000) / 1000);

  function svg(def, date, opt) {
    opt = opt || {};
    const W = opt.latime || 640, H = opt.inaltime || 360;
    if (!date || !date.serii.length) return '<svg viewBox="0 0 ' + W + ' 80"><text x="20" y="45" fill="currentColor">Zona aleasă nu conține date numerice.</text></svg>';
    const tip = def.tip || 'coloane';
    let o = '<svg class="grafic" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(def.titlu || TIPURI[tip] || 'Diagramă') + '" font-family="inherit" font-size="12">';
    let sus = 16;
    if (def.titlu) { o += '<text x="' + W / 2 + '" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor">' + esc(def.titlu) + '</text>'; sus = 44; }
    const cuLegenda = def.legenda !== false && (date.serii.length > 1 || tip === 'placinta' || tip === 'inel');
    const jos = cuLegenda ? 34 : 10;

    if (tip === 'placinta' || tip === 'inel') {
      const s = date.serii[0];
      const tot = s.valori.reduce((a, b) => a + Math.max(0, b), 0) || 1;
      const cx = W / 2, cy = sus + (H - sus - jos) / 2, R = Math.min(W / 2 - 30, (H - sus - jos) / 2 - 6);
      let a0 = -Math.PI / 2;
      s.valori.forEach((v, i) => {
        const a1 = a0 + (Math.max(0, v) / tot) * Math.PI * 2;
        const mare = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        const cul = CULORI[i % CULORI.length];
        if (a1 - a0 >= Math.PI * 2 - 1e-6) o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + cul + '"/>';
        else o += '<path d="M' + cx + ',' + cy + ' L' + x0 + ',' + y0 + ' A' + R + ',' + R + ' 0 ' + mare + ' 1 ' + x1 + ',' + y1 + ' Z" fill="' + cul + '" stroke="var(--suprafata, #fff)" stroke-width="2"><title>' + esc(date.categorii[i] + ': ' + fmt(v)) + '</title></path>';
        if (def.etichete !== false && v > 0) {
          const am = (a0 + a1) / 2, rr = tip === 'inel' ? R * 0.78 : R * 0.64;
          o += '<text x="' + (cx + rr * Math.cos(am)) + '" y="' + (cy + rr * Math.sin(am) + 4) + '" text-anchor="middle" font-weight="700" fill="#fff" style="paint-order:stroke" stroke="rgba(0,0,0,.35)" stroke-width="2">' + Math.round(v / tot * 100) + '%</text>';
        }
        a0 = a1;
      });
      if (tip === 'inel') o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R * 0.52 + '" fill="var(--suprafata, #fff)"/>';
      if (cuLegenda) o += legenda(date.categorii, W, H);
      return o + '</svg>';
    }

    const stivuit = tip === 'coloane-stivuite';
    const orizontal = tip === 'bare';
    // intervalul valorilor
    let min = 0, max = 0;
    date.categorii.forEach((c, i) => {
      if (stivuit) {
        let p = 0, n = 0;
        date.serii.forEach((s) => { const v = s.valori[i] || 0; if (v >= 0) p += v; else n += v; });
        max = Math.max(max, p); min = Math.min(min, n);
      } else date.serii.forEach((s) => { const v = s.valori[i] || 0; max = Math.max(max, v); min = Math.min(min, v); });
    });
    if (tip === 'linie' && min > 0) {
      const toate = date.serii.flatMap((s) => s.valori);
      const mn = Math.min(...toate);
      if (mn > (max - mn)) min = mn - (max - mn) * 0.2;
    }
    if (max === min) max = min + 1;
    const pas = pasFrumos(max - min);
    max = Math.ceil(max / pas) * pas; min = Math.floor(min / pas) * pas;
    const stanga = 56 + (def.titluY ? 18 : 0) + (orizontal ? 40 : 0);
    const dreapta = 16, josAx = jos + 26 + (def.titluX ? 18 : 0);
    const X0 = stanga, X1 = W - dreapta, Y0 = sus, Y1 = H - josAx;
    const n = date.categorii.length;
    const scal = (v) => (orizontal ? X0 + (v - min) / (max - min) * (X1 - X0) : Y1 - (v - min) / (max - min) * (Y1 - Y0));
    // grila și valorile axei
    for (let v = min; v <= max + pas / 2; v += pas) {
      const p = scal(v);
      if (orizontal) o += '<line x1="' + p + '" x2="' + p + '" y1="' + Y0 + '" y2="' + Y1 + '" stroke="currentColor" stroke-opacity=".12"/><text x="' + p + '" y="' + (Y1 + 16) + '" text-anchor="middle" fill="currentColor" fill-opacity=".7">' + fmt(v) + '</text>';
      else o += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + p + '" y2="' + p + '" stroke="currentColor" stroke-opacity=".12"/><text x="' + (X0 - 8) + '" y="' + (p + 4) + '" text-anchor="end" fill="currentColor" fill-opacity=".7">' + fmt(v) + '</text>';
    }
    const baza = scal(Math.max(min, Math.min(0, max)));
    const banda = ((orizontal ? Y1 - Y0 : X1 - X0) / n);
    // etichetele categoriilor
    date.categorii.forEach((c, i) => {
      const m = (orizontal ? Y0 : X0) + banda * (i + 0.5);
      const t = String(c).length > 14 ? String(c).slice(0, 13) + '…' : c;
      if (orizontal) o += '<text x="' + (X0 - 8) + '" y="' + (m + 4) + '" text-anchor="end" fill="currentColor">' + esc(t) + '</text>';
      else if (n > 14) { if (i % Math.ceil(n / 12) === 0) o += '<text x="' + m + '" y="' + (Y1 + 16) + '" text-anchor="middle" fill="currentColor">' + esc(t) + '</text>'; }
      else o += '<text x="' + m + '" y="' + (Y1 + 16) + '" text-anchor="middle" fill="currentColor">' + esc(t) + '</text>';
    });
    // seriile
    const ns = date.serii.length;
    if (tip === 'linie') {
      date.serii.forEach((s, k) => {
        const cul = CULORI[k % CULORI.length];
        const pts = s.valori.map((v, i) => [X0 + banda * (i + 0.5), scal(v)]);
        o += '<polyline fill="none" stroke="' + cul + '" stroke-width="2.5" stroke-linejoin="round" points="' + pts.map((p) => p.join(',')).join(' ') + '"/>';
        pts.forEach((p, i) => {
          o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + cul + '"><title>' + esc(s.nume + ' · ' + date.categorii[i] + ': ' + fmt(s.valori[i])) + '</title></circle>';
          if (def.etichete) o += '<text x="' + p[0] + '" y="' + (p[1] - 8) + '" text-anchor="middle" font-size="11" fill="currentColor">' + fmt(s.valori[i]) + '</text>';
        });
      });
    } else {
      const lat = banda * 0.72, bara = stivuit ? lat : lat / ns;
      date.categorii.forEach((c, i) => {
        let pozitiv = 0, negativ = 0;
        date.serii.forEach((s, k) => {
          const v = s.valori[i] || 0, cul = CULORI[k % CULORI.length];
          const start = (orizontal ? Y0 : X0) + banda * i + (banda - lat) / 2 + (stivuit ? 0 : k * bara);
          let a, b;
          if (stivuit) { if (v >= 0) { a = scal(pozitiv); b = scal(pozitiv + v); pozitiv += v; } else { a = scal(negativ); b = scal(negativ + v); negativ += v; } }
          else { a = baza; b = scal(v); }
          const t = '<title>' + esc(s.nume + ' · ' + c + ': ' + fmt(v)) + '</title>';
          if (orizontal) o += '<rect x="' + Math.min(a, b) + '" y="' + start + '" width="' + Math.abs(b - a) + '" height="' + (bara - 2) + '" fill="' + cul + '" rx="2">' + t + '</rect>';
          else o += '<rect x="' + start + '" y="' + Math.min(a, b) + '" width="' + (bara - 2) + '" height="' + Math.abs(b - a) + '" fill="' + cul + '" rx="2">' + t + '</rect>';
          if (def.etichete) {
            if (orizontal) o += '<text x="' + (Math.max(a, b) + 4) + '" y="' + (start + bara / 2 + 4) + '" font-size="11" fill="currentColor">' + fmt(v) + '</text>';
            else o += '<text x="' + (start + bara / 2 - 1) + '" y="' + (stivuit ? (a + b) / 2 + 4 : Math.min(a, b) - 4) + '" text-anchor="middle" font-size="11" fill="' + (stivuit ? '#fff' : 'currentColor') + '">' + fmt(v) + '</text>';
          }
        });
      });
      // axa de bază
      if (orizontal) o += '<line x1="' + baza + '" x2="' + baza + '" y1="' + Y0 + '" y2="' + Y1 + '" stroke="currentColor" stroke-opacity=".5"/>';
      else o += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + baza + '" y2="' + baza + '" stroke="currentColor" stroke-opacity=".5"/>';
    }
    // titlurile axelor
    if (def.titluX) o += '<text x="' + (X0 + X1) / 2 + '" y="' + (Y1 + 36) + '" text-anchor="middle" font-weight="600" fill="currentColor">' + esc(orizontal ? def.titluY || '' : def.titluX) + '</text>';
    if (def.titluY) o += '<text transform="translate(16,' + (Y0 + Y1) / 2 + ') rotate(-90)" text-anchor="middle" font-weight="600" fill="currentColor">' + esc(orizontal ? def.titluX || '' : def.titluY) + '</text>';
    if (cuLegenda) o += legenda(date.serii.map((s) => s.nume), W, H);
    return o + '</svg>';
  }
  function legenda(nume, W, H) {
    const lat = nume.map((x) => Math.min(150, String(x).length * 7 + 26));
    let x = (W - lat.reduce((a, b) => a + b, 0)) / 2, o = '';
    nume.forEach((t, i) => {
      o += '<rect x="' + x + '" y="' + (H - 22) + '" width="12" height="12" rx="2" fill="' + CULORI[i % CULORI.length] + '"/><text x="' + (x + 17) + '" y="' + (H - 12) + '" fill="currentColor">' + esc(String(t).slice(0, 18)) + '</text>';
      x += lat[i];
    });
    return o;
  }

  global.Diagrame = { TIPURI, dinZona, svg, CULORI };
})(window);
