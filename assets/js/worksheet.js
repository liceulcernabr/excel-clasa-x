/* =====================================================================
   worksheet.js — Fișele de lucru
   • descărcarea fișierului .xlsx cu datele de pornire (SheetJS, încărcat
     de pe cdn.jsdelivr.net doar când e nevoie; fără internet → .csv)
   • cardul fișei din pagina lecției
   • pagina printabilă A4 (fise/fisa.html?ora=N)
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEngine;
  const { el, esc, htmlCuMarcaje, toast, incarcaScript, CFG } = global.App;
  const NIVEL = { baza: 'de bază', mediu: 'mediu', avansat: 'avansat' };

  function descarcaBlob(nume, continut, tip) {
    const blob = continut instanceof Blob ? continut : new Blob([continut], { type: tip || 'text/plain;charset=utf-8' });
    const a = el('a', { href: URL.createObjectURL(blob), download: nume });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // Formatul Excel corespunzător formatului din simulator
  function formatExcel(f) {
    if (!f) return null;
    const d = f.dec || 0, z = d ? '.' + '0'.repeat(d) : '';
    if (f.type === 'date') return 'dd.mm.yyyy';
    if (f.type === 'currency') return '#,##0' + z + ' "lei"';
    if (f.type === 'percent') return '0' + z + '%';
    if (f.type === 'number') return '0' + z;
    return null;
  }

  // Construiește registrul SheetJS pornind de la definiția foilor
  function registruSheetJS(foi, cuFormule) {
    const XLSX = global.XLSX;
    const wb = new FE.Workbook(JSON.parse(JSON.stringify({ sheets: foi })));
    const book = XLSX.utils.book_new();
    wb.sheets.forEach((sh, si) => {
      const aoa = wb.toAOA(si, cuFormule !== false);
      const ws = XLSX.utils.aoa_to_sheet(aoa.map((r) => r.map((v) => (v && v.f ? null : FE.isErr(v) ? v.code : v))));
      // formule și formate
      aoa.forEach((rand, r) => rand.forEach((v, c) => {
        const a = XLSX.utils.encode_cell({ r, c });
        if (v && v.f) ws[a] = { t: 'n', f: v.f };
        const fmt = formatExcel(wb.getFormat(si, r, c));
        if (fmt && ws[a]) ws[a].z = fmt;
      }));
      const nrCol = Math.max(sh.cols, aoa[0] ? aoa[0].length : 0);
      ws['!cols'] = [...Array(nrCol).keys()].map((c) => ({ wpx: sh.widths[FE.numToCol(c)] || 88 }));
      if (!ws['!ref']) ws['!ref'] = 'A1';
      XLSX.utils.book_append_sheet(book, ws, sh.name.slice(0, 31));
    });
    return book;
  }

  // Varianta de rezervă, fără internet: prima foaie ca .csv (cu „;”, pentru Excel în română)
  function csvRezerva(fisa) {
    const wb = new FE.Workbook(JSON.parse(JSON.stringify({ sheets: fisa.foi })));
    const linii = [];
    wb.sheets.forEach((sh, si) => {
      if (wb.sheets.length > 1) linii.push('### Foaia: ' + sh.name);
      const aoa = wb.toAOA(si, false);
      aoa.forEach((rand, r) => linii.push(rand.map((v, c) => {
        const t = v == null ? '' : wb.getDisplay(si, r, c);
        return /[;"\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
      }).join(';')));
      linii.push('');
    });
    return '﻿' + linii.join('\r\n');
  }

  async function descarcaXlsx(fisa) {
    const nume = fisa.fisier || 'fisa-de-lucru.xlsx';
    try {
      if (!global.XLSX) await incarcaScript(CFG.sheetjs || 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
      const book = registruSheetJS(fisa.foi);
      global.XLSX.writeFile(book, nume);
      toast('S-a descărcat ' + nume);
    } catch (e) {
      descarcaBlob(nume.replace(/\.xlsx$/, '.csv'), csvRezerva(fisa), 'text/csv;charset=utf-8');
      toast('Nu există conexiune la internet pentru generarea .xlsx. S-a descărcat un fișier .csv care se deschide în Excel.');
    }
  }

  // Cardul fișei din pagina lecției
  function randeazaInLectie(container, fisa, ora) {
    const card = el('div', { class: 'card' });
    card.append(el('span', { class: 'eticheta' }, 'Fișa de lucru ' + ora + (fisa.timp ? ' · ' + fisa.timp + ' minute' : '')));
    card.append(el('h3', { style: 'margin-top:6px' }, fisa.titlu));
    if (fisa.context) card.append(htmlCuMarcaje(el('p'), fisa.context));
    const ol = el('ol');
    fisa.cerinte.forEach((c) => {
      const li = el('li', { style: 'margin-bottom:8px' });
      li.append(el('span', { class: 'ex-nivel', style: 'margin-right:8px' }, NIVEL[c.nivel] || c.nivel));
      const t = el('span'); htmlCuMarcaje(t, c.text); li.append(t);
      if (c.puncte) li.append(el('span', { class: 'ex-puncte', style: 'margin-left:8px' }, c.puncte + ' p'));
      if (c.barem || c.solutie) {
        const p = el('div', { class: 'pix-rosu doar-profesor' }, el('span', { class: 'titlu-pix' }, 'Barem'));
        p.append(htmlCuMarcaje(el('div'), (c.barem || '') + (c.solutie ? '<br><b>Soluție:</b> ' + c.solutie : '')));
        li.append(p);
      }
      ol.append(li);
    });
    card.append(ol);
    card.append(el('div', { class: 'rand-butoane', style: 'margin-top:14px' },
      el('button', { class: 'btn btn-primar', type: 'button', onclick: () => descarcaXlsx(fisa) }, '⬇ Descarcă ' + (fisa.fisier || '.xlsx')),
      el('a', { class: 'btn', href: global.App.RADACINA + 'fise/fisa.html?ora=' + ora }, '🖨 Varianta de printat (A4)')));
    container.append(card);
  }

  // Pagina printabilă A4
  function paginaPrint(container, fisa, ora, titluLectie) {
    const cuBarem = global.App.modProfesor();
    const pag = el('div', { class: 'foaie-a4' });
    pag.append(el('header', { class: 'antet-fisa' },
      el('div', null, el('strong', null, CFG.scoala || ''), el('br'), (CFG.disciplina || '') + ' · Clasa ' + (CFG.clasa || 'a X-a'), el('br'), CFG.profesor || ''),
      el('div', { class: 'campuri' },
        el('div', null, 'Nume și prenume: ', el('span', { class: 'linie-scris lung' })),
        el('div', null, 'Clasa: ', el('span', { class: 'linie-scris' }), ' Data: ', el('span', { class: 'linie-scris' })))));
    pag.append(el('h1', null, 'Fișa de lucru ' + ora + ' — ' + fisa.titlu));
    pag.append(el('p', { class: 'subtitlu-fisa' }, 'Ora ' + ora + ': ' + (titluLectie || '') + (fisa.timp ? ' · Timp de lucru: ' + fisa.timp + ' minute' : '') +
      ' · Fișier: ' + (fisa.fisier || '')));
    if (fisa.context) pag.append(htmlCuMarcaje(el('p'), fisa.context));
    // tabelul cu datele de pornire (prima foaie, dacă e mică)
    if (fisa.previzualizare !== false) {
      const wb = new FE.Workbook(JSON.parse(JSON.stringify({ sheets: fisa.foi })));
      const aoa = wb.toAOA(0, false);
      if (aoa.length && aoa.length <= 22) {
        const t = el('table', { class: 'tabel date-fisa' });
        const hr = el('tr', null, el('th', null, ''));
        for (let c = 0; c < aoa[0].length; c++) hr.append(el('th', null, FE.numToCol(c)));
        t.append(hr);
        aoa.forEach((rand, r) => {
          const tr = el('tr', null, el('th', null, String(r + 1)));
          rand.forEach((v, c) => tr.append(el('td', { class: typeof v === 'number' ? 'num' : '' }, v == null ? '' : wb.getDisplay(0, r, c))));
          t.append(tr);
        });
        pag.append(el('p', { class: 'eticheta' }, 'Datele din foaia „' + wb.sheets[0].name + '”'), el('div', { class: 'tabel-scroll' }, t));
      }
    }
    pag.append(el('h2', null, 'Cerințe'));
    const ol = el('ol', { class: 'cerinte-fisa' });
    let total = 0;
    fisa.cerinte.forEach((c) => {
      total += c.puncte || 0;
      const li = el('li');
      li.append(el('span', { class: 'nivel-fisa' }, (NIVEL[c.nivel] || c.nivel) + (c.puncte ? ' · ' + c.puncte + ' p' : '')));
      li.append(htmlCuMarcaje(el('div'), c.text));
      if (cuBarem && (c.barem || c.solutie)) li.append(htmlCuMarcaje(el('div', { class: 'pix-rosu' }), '<span class="titlu-pix">Barem</span>' + (c.barem || '') + (c.solutie ? '<br><b>Soluție:</b> ' + c.solutie : '')));
      ol.append(li);
    });
    pag.append(ol);
    pag.append(el('p', { class: 'total-fisa' }, 'Total: ' + total + ' puncte' + (CFG.teste && CFG.teste.punctDinOficiu ? ' + 1 punct din oficiu = ' + (total + 1) + ' puncte' : '')));
    container.append(pag);
  }

  global.Fise = { descarcaXlsx, randeazaInLectie, paginaPrint, registruSheetJS, descarcaBlob };
})(window);
