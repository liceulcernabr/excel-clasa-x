/* =====================================================================
   formula-engine.js — Motorul de formule al simulatorului Excel
   ---------------------------------------------------------------------
   Conține:
     1. Erorile Excel și explicațiile lor pe înțeles
     2. Tokenizatorul (împarte formula în „bucăți”)
     3. Parserul (construiește arborele formulei, cu ordinea operațiilor)
     4. Evaluatorul și funcțiile (SUM, IF, VLOOKUP …)
     5. Registrul (Workbook): foi, celule, valori, formate
     6. Utilitare: copiere cu ajustarea referințelor, traducere EN ↔ RO,
        extragerea referințelor pentru evidențiere
   Funcționează în browser (window.FormulaEngine) și în Node (teste).
   ===================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------
     0. Opțiuni generale (pot fi schimbate din config.js)
     ------------------------------------------------------------------ */
  const optiuni = {
    zecimal: ',',        // separatorul zecimal afișat (Excel în română: virgulă)
    azi: null            // pentru teste: o dată fixă (serial) în loc de „azi”
  };

  /* ------------------------------------------------------------------
     1. ERORI
     ------------------------------------------------------------------ */
  class XlError {
    constructor(code) { this.code = code; }
    toString() { return this.code; }
  }
  const E = {
    DIV0: '#DIV/0!', NA: '#N/A', VALUE: '#VALUE!', REF: '#REF!',
    NAME: '#NAME?', NUM: '#NUM!', NULL: '#NULL!'
  };
  const err = (code) => new XlError(code);
  const isErr = (v) => v instanceof XlError;

  // Explicațiile afișate elevului când o celulă conține o eroare
  const EXPLICATII_ERORI = {
    '#DIV/0!': {
      titlu: 'Împărțire la zero',
      ce: 'Formula încearcă să împartă un număr la 0 sau la o celulă goală.',
      cauze: ['Numitorul este o celulă goală (Excel o consideră 0).', 'AVERAGE pe o zonă fără niciun număr.'],
      repara: 'Verifică celula de la numitor sau protejează formula: =IF(B2=0, "-", A2/B2) sau =IFERROR(A2/B2, 0).'
    },
    '#N/A': {
      titlu: 'Valoare negăsită (Not Available)',
      ce: 'O funcție de căutare (VLOOKUP, MATCH, XLOOKUP…) nu a găsit valoarea căutată.',
      cauze: ['Valoarea căutată nu există în prima coloană a tabelului.', 'Spații în plus sau litere diferite („Ion ” ≠ „Ion”).', 'Ai uitat FALSE la VLOOKUP pentru potrivire exactă.'],
      repara: 'Verifică dacă valoarea există exact la fel în tabel. Poți afișa un mesaj: =IFERROR(VLOOKUP(…), "negăsit").'
    },
    '#VALUE!': {
      titlu: 'Tip de valoare greșit',
      ce: 'Formula face un calcul cu un tip de date nepotrivit, de exemplu adună un text cu un număr.',
      cauze: ['O celulă folosită în calcul conține text (de ex. „10 lei” scris ca text).', 'Un argument al funcției are tipul greșit.'],
      repara: 'Verifică celulele folosite: trebuie să conțină numere, nu text. Scrie „10”, iar „lei” pune-l prin formatare.'
    },
    '#REF!': {
      titlu: 'Referință invalidă',
      ce: 'Formula face trimitere la o celulă care nu (mai) există.',
      cauze: ['Ai șters rândul sau coloana folosită în formulă.', 'Ai copiat formula prea sus sau prea la stânga (de ex. A1 ar deveni A0).', 'Numărul coloanei din VLOOKUP e mai mare decât lățimea tabelului.', 'Numele foii din referință nu există.'],
      repara: 'Rescrie referința către celula corectă. La VLOOKUP, numără din nou coloanele tabelului.'
    },
    '#NAME?': {
      titlu: 'Nume necunoscut',
      ce: 'Excel nu recunoaște un cuvânt din formulă.',
      cauze: ['Numele funcției este scris greșit (de ex. SUMM în loc de SUM).', 'Un text nu este pus între ghilimele: =IF(A1>5, Admis, …) în loc de "Admis".', 'O adresă de celulă scrisă greșit (de ex. 1A în loc de A1).'],
      repara: 'Verifică ortografia funcției și pune textele între ghilimele drepte "…".'
    },
    '#NUM!': {
      titlu: 'Număr invalid',
      ce: 'Rezultatul sau un argument este un număr imposibil de folosit.',
      cauze: ['Radical dintr-un număr negativ: =SQRT(-4).', 'DATEDIF cu data de start după data finală.', 'Rezultat prea mare.'],
      repara: 'Verifică argumentele numerice ale funcției.'
    },
    '#NULL!': {
      titlu: 'Intersecție vidă',
      ce: 'Două zone nu se intersectează (de obicei lipsește : sau , dintre ele).',
      cauze: ['Ai scris un spațiu în loc de : sau , , de ex. =SUM(A1 A5).'],
      repara: 'Folosește : pentru zone (A1:A5) și , sau ; între argumente.'
    },
    '#SINTAXĂ': {
      titlu: 'Formula nu poate fi înțeleasă',
      ce: 'Formula are o greșeală de scriere: paranteze nepereche, operator lipsă, ghilimele neînchise…',
      cauze: ['O paranteză deschisă nu a fost închisă.', 'Două operatori unul după altul (de ex. =A1*/2).', 'Ghilimele neînchise.'],
      repara: 'Numără parantezele: câte „(” atâtea „)”. Verifică virgulele/punctele și virgula dintre argumente.'
    }
  };

  class SyntaxErr extends Error {
    constructor(msg, pos) { super(msg); this.pos = pos; }
  }

  /* ------------------------------------------------------------------
     Utilitare pentru adrese
     ------------------------------------------------------------------ */
  const MAX_ROWS = 1048576, MAX_COLS = 16384;
  function colToNum(letters) {           // 'A' → 0, 'Z' → 25, 'AA' → 26
    let n = 0;
    for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
    return n - 1;
  }
  function numToCol(n) {                 // 0 → 'A'
    let s = ''; n += 1;
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function addr(r, c, absR, absC) {
    return (absC ? '$' : '') + numToCol(c) + (absR ? '$' : '') + (r + 1);
  }
  // Transformă 'B3' în {r:2, c:1}; întoarce null dacă adresa nu e validă
  function parseAddr(a) {
    const m = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(String(a).trim());
    if (!m) return null;
    const r = parseInt(m[2], 10) - 1, c = colToNum(m[1]);
    if (r < 0 || r >= MAX_ROWS || c >= MAX_COLS) return null;
    return { r, c };
  }
  // 'B2:D5' → {r1,c1,r2,c2}; o singură celulă → zonă 1×1
  function parseRangeAddr(a) {
    const parts = String(a).split(':');
    const p1 = parseAddr(parts[0]);
    const p2 = parts[1] ? parseAddr(parts[1]) : p1;
    if (!p1 || !p2) return null;
    return { r1: Math.min(p1.r, p2.r), c1: Math.min(p1.c, p2.c), r2: Math.max(p1.r, p2.r), c2: Math.max(p1.c, p2.c) };
  }
  function quoteSheet(name) {
    return /^[A-Za-z_À-ɏ][A-Za-z0-9_À-ɏ]*$/.test(name) ? name : "'" + name.replace(/'/g, "''") + "'";
  }

  // Elimină diacriticele și face majuscule: 'Sumă' → 'SUMA'
  function norm(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[șşȘŞ]/g, 'S').replace(/[țţȚŢ]/g, 'T').toUpperCase();
  }

  /* ------------------------------------------------------------------
     Denumirile funcțiilor: englezește ↔ românește
     (se citesc din data/functii.js, dacă a fost încărcat)
     ------------------------------------------------------------------ */
  // În Excel funcțiile se scriu DOAR în engleză. Traducerile românești
  // (din data/functii.js) servesc doar la mesajul „Ai vrut SUM?”.
  let _alias = null, _gresite = null, _traducere = null;
  function tabelNume() {
    if (_alias) return;
    _alias = {}; _gresite = {}; _traducere = {};
    for (const k of Object.keys(FN)) _alias[k] = k;
    for (const f of global.FUNCTII || []) {
      if (f.traducere) {
        _traducere[f.en] = f.traducere;
        // „sumă” → SUMA, „căutare verticală” → CAUTAREVERTICALA …
        const g = norm(f.traducere).replace(/(.*?)/g, '').replace(/[^A-Z]/g, '');
        if (g && !_alias[g]) _gresite[g] = f.en;
      }
    }
    // denumiri românești folosite des din greșeală
    Object.assign(_gresite, { SUMA: 'SUM', MEDIE: 'AVERAGE', DACA: 'IF', SI: 'AND', SAU: 'OR', NU: 'NOT', CONTOR: 'COUNT', NUMARA: 'COUNT',
      CAUTAREV: 'VLOOKUP', CAUTAREH: 'HLOOKUP', POTRIVIRE: 'MATCH', STANGA: 'LEFT', DREAPTA: 'RIGHT', LUNGIME: 'LEN', MAJUSCULE: 'UPPER',
      ASTAZI: 'TODAY', AN: 'YEAR', LUNA: 'MONTH', ZI: 'DAY', ROTUNJIRE: 'ROUND', NUMARADACA: 'COUNTIF', SUMADACA: 'SUMIF', MEDIEDACA: 'AVERAGEIF' });
  }
  function numeCanonic(nume) { tabelNume(); const n = String(nume).toUpperCase(); return _alias[n] || null; }
  function traducere(en) { tabelNume(); return _traducere[en] || ''; }
  // Sugestie pentru un nume de funcție necunoscut (românesc sau scris greșit)
  function sugestieFunctie(nume) {
    tabelNume();
    const n = norm(nume).replace(/[^A-Z.]/g, '');
    if (_gresite[n]) return { en: _gresite[n], motiv: 'ro' };
    let best = null, dist = 3;
    for (const k of Object.keys(_alias)) {
      const d = levenshtein(n, k);
      if (d < dist) { dist = d; best = k; }
    }
    return best ? { en: best, motiv: 'tipar' } : null;
  }
  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const d = [...Array(b.length + 1).keys()];
    for (let i = 1; i <= a.length; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const t = d[j];
        d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = t;
      }
    }
    return d[b.length];
  }
  // Numele funcțiilor necunoscute dintr-o formulă (pentru explicarea erorii #NAME?)
  function numeNecunoscute(formula) {
    const out = [];
    try {
      for (const t of tokenize(String(formula).replace(/^=/, '')).toks) {
        if (t.type === 'name' && t.call && !numeCanonic(t.v)) out.push({ nume: t.v, sugestie: sugestieFunctie(t.v) });
        else if (t.type === 'name' && !t.call) out.push({ nume: t.v, text: true });
      }
    } catch (e) { /* formulă invalidă */ }
    return out;
  }


  /* ------------------------------------------------------------------
     Date calendaristice — sistemul Excel (1 = 01.01.1900)
     ------------------------------------------------------------------ */
  const MS_ZI = 86400000;
  const BAZA = Date.UTC(1899, 11, 30);
  function dataInSerial(y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - BAZA) / MS_ZI); }
  function serialInData(s) {
    const dt = new Date(BAZA + Math.floor(s) * MS_ZI);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), wd: dt.getUTCDay() };
  }
  function azi() {
    if (optiuni.azi != null) return optiuni.azi;
    const t = new Date();
    return dataInSerial(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }
  const pad2 = (n) => (n < 10 ? '0' : '') + n;
  function formatData(s) { const x = serialInData(s); return pad2(x.d) + '.' + pad2(x.m) + '.' + x.y; }

  /* ------------------------------------------------------------------
     Conversii de tip (regulile Excel)
     ------------------------------------------------------------------ */
  // Încearcă să citească un număr dintr-un text: „3,5”, „3.5”, „15%”, „12.03.2024”
  function numarDinText(s) {
    const t = String(s).trim();
    if (t === '') return null;
    let m = /^([+-]?)(\d+(?:[.,]\d+)?|[.,]\d+)(%?)$/.exec(t);
    if (m) {
      let v = parseFloat(m[2].replace(',', '.'));
      if (m[1] === '-') v = -v;
      if (m[3]) v /= 100;
      return v;
    }
    m = /^([+-]?)\d+(?:\.\d+)?[eE][+-]?\d+$/.exec(t);
    if (m) return parseFloat(t);
    const d = dataDinText(t);
    if (d != null) return d;
    return null;
  }
  // „15.03.2024”, „15/03/2024” sau „2024-03-15” → serial Excel
  function dataDinText(t) {
    let m = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(t);
    if (m) {
      const d = +m[1], mo = +m[2], y = +m[3];
      if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return dataInSerial(y, mo, d);
    }
    m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
    if (m) return dataInSerial(+m[1], +m[2], +m[3]);
    return null;
  }

  function toNum(v) {
    if (typeof v === 'number') return v;
    if (v === null || v === undefined) return 0;
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (isErr(v)) return v;
    const n = numarDinText(v);
    return n == null ? err(E.VALUE) : n;
  }
  function fmtGeneral(n) {
    if (!isFinite(n)) return E.NUM;
    let s;
    if (Number.isInteger(n) && Math.abs(n) < 1e15) s = String(n);
    else {
      s = String(parseFloat(n.toPrecision(10)));
      if (/e/.test(s) && Math.abs(n) >= 1e-9 && Math.abs(n) < 1e15) s = n.toFixed(10).replace(/0+$/, '');
    }
    return optiuni.zecimal === ',' ? s.replace('.', ',') : s;
  }
  function textLogic(b) {
    return b ? 'TRUE' : 'FALSE';
  }
  function toText(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return textLogic(v);
    if (typeof v === 'number') return fmtGeneral(v);
    if (isErr(v)) return v;
    return String(v);
  }
  function toBool(v) {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (v === null || v === undefined) return false;
    if (isErr(v)) return v;
    const n = norm(v);
    if (n === 'TRUE') return true;
    if (n === 'FALSE') return false;
    return err(E.VALUE);
  }
  // Compară după regulile Excel: numere < text < valori logice
  function rang(v) { return typeof v === 'number' ? 0 : typeof v === 'string' ? 1 : 2; }
  function compara(a, b) {
    if (a === null || a === undefined) a = typeof b === 'string' ? '' : typeof b === 'boolean' ? false : 0;
    if (b === null || b === undefined) b = typeof a === 'string' ? '' : typeof a === 'boolean' ? false : 0;
    const ra = rang(a), rb = rang(b);
    if (ra !== rb) return ra < rb ? -1 : 1;
    if (ra === 1) {
      const x = a.toLocaleLowerCase('ro'), y = b.toLocaleLowerCase('ro');
      return x === y ? 0 : x.localeCompare(y, 'ro') < 0 ? -1 : 1;
    }
    if (ra === 2) return a === b ? 0 : (a ? 1 : -1);
    const d = a - b;
    return Math.abs(d) < 1e-12 * Math.max(1, Math.abs(a), Math.abs(b)) ? 0 : (d < 0 ? -1 : 1);
  }

  /* ------------------------------------------------------------------
     Matrice de valori (rezultatul unei zone A1:B5)
     ------------------------------------------------------------------ */
  class Arr {
    constructor(data, ref) {
      this.data = data;
      this.rows = data.length;
      this.cols = data.length ? data[0].length : 0;
      this.ref = ref || null;  // {si, r1, c1, r2, c2} dacă vine dintr-o zonă
    }
    get(i, j) {
      const r = this.rows === 1 ? 0 : i, c = this.cols === 1 ? 0 : j;
      if (r >= this.rows || c >= this.cols) return err(E.NA);
      return this.data[r][c];
    }
    flat() { const o = []; for (const row of this.data) for (const v of row) o.push(v); return o; }
  }

  /* ------------------------------------------------------------------
     2. TOKENIZATORUL
     ------------------------------------------------------------------ */
  const LIT = 'A-Za-z_\\u00C0-\\u024F';
  const RE_SHEET = new RegExp("^(?:'((?:[^']|'')+)'|([" + LIT + '][' + LIT + '0-9.]*(?::[' + LIT + '][' + LIT + '0-9.]*)?))!');
  const RE_CELL = new RegExp('^(\\$?)([A-Za-z]{1,3})(\\$?)(\\d{1,7})(?![' + LIT + '0-9(])');
  const RE_COLS = new RegExp('^(\\$?)([A-Za-z]{1,3}):(\\$?)([A-Za-z]{1,3})(?![' + LIT + '0-9(])');
  const RE_NAME = new RegExp('^[' + LIT + '][' + LIT + '0-9.]*');
  const RE_ERR = /^#(?:DIV\/0!|N\/A|VALUE!|REF!|NAME\?|NUM!|NULL!)/i;

  // Separatorul de argumente: dacă formula conține „;” în afara ghilimelelor,
  // înseamnă stilul românesc (; între argumente, virgulă zecimală)
  function detecteazaSeparator(src) {
    let inStr = false;
    for (const ch of src) {
      if (ch === '"') inStr = !inStr;
      else if (!inStr && ch === ';') return ';';
    }
    return ',';
  }

  function tokenize(src, sepFortat) {
    const sep = sepFortat || detecteazaSeparator(src);
    const RE_NUM = sep === ';'
      ? /^(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?/
      : /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?/;
    const toks = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      const rest = src.slice(i);
      if (/\s/.test(ch)) { i++; continue; }
      // text între ghilimele
      if (ch === '"') {
        let j = i + 1, s = '';
        for (;;) {
          if (j >= src.length) throw new SyntaxErr('Ghilimele neînchise: un text început cu " trebuie închis tot cu ".', i);
          if (src[j] === '"') {
            if (src[j + 1] === '"') { s += '"'; j += 2; continue; }
            break;
          }
          s += src[j++];
        }
        toks.push({ type: 'str', v: s, start: i, end: j + 1 });
        i = j + 1; continue;
      }
      if (ch === '“' || ch === '”' || ch === '„') throw new SyntaxErr('Ai folosit ghilimele „curbate”. În formule se folosesc ghilimele drepte: "text".', i);
      // prefix de foaie: Foaie2!A1 sau 'Foaia mea'!A1
      let sheet = null, sheet2 = null, sheetLen = 0;
      const ms = RE_SHEET.exec(rest);
      if (ms) {
        sheet = ms[1] != null ? ms[1].replace(/''/g, "'") : ms[2];
        sheetLen = ms[0].length;
        // referință 3D: Ian:Mar!B2 (numele de foi nu pot conține „:”)
        if (sheet.includes(':')) { [sheet, sheet2] = sheet.split(':'); }
      }
      const after = rest.slice(sheetLen);
      let m;
      if ((m = RE_COLS.exec(after))) {
        toks.push({ type: 'cols', sheet, sheet2, c1: colToNum(m[2]), c2: colToNum(m[4]), abs1: !!m[1], abs2: !!m[3],
          start: i, end: i + sheetLen + m[0].length, sheetText: rest.slice(0, sheetLen) });
        i += sheetLen + m[0].length; continue;
      }
      if ((m = RE_CELL.exec(after))) {
        const r = parseInt(m[4], 10) - 1, c = colToNum(m[2]);
        if (r >= 0 && r < MAX_ROWS && c < MAX_COLS) {
          toks.push({ type: 'ref', sheet, sheet2, r, c, absC: !!m[1], absR: !!m[3],
            start: i, end: i + sheetLen + m[0].length, sheetText: rest.slice(0, sheetLen) });
          i += sheetLen + m[0].length; continue;
        }
      }
      if (sheet) throw new SyntaxErr('După numele foii și „!” trebuie să urmeze o adresă de celulă, de ex. Foaie2!A1.', i);
      if ((m = RE_ERR.exec(rest))) { toks.push({ type: 'err', v: m[0].toUpperCase(), start: i, end: i + m[0].length }); i += m[0].length; continue; }
      if ((m = RE_NUM.exec(rest))) {
        toks.push({ type: 'num', v: parseFloat(m[0].replace(',', '.')), start: i, end: i + m[0].length });
        i += m[0].length; continue;
      }
      if ((m = RE_NAME.exec(rest))) {
        const word = m[0];
        let k = i + word.length; while (k < src.length && /\s/.test(src[k])) k++;
        const isCall = src[k] === '(';
        const n = norm(word);
        if (!isCall && (n === 'TRUE' || n === 'FALSE')) {
          toks.push({ type: 'bool', v: n === 'TRUE', start: i, end: i + word.length });
        } else {
          toks.push({ type: 'name', v: word, call: isCall, start: i, end: i + word.length });
        }
        i += word.length; continue;
      }
      const two = src.substr(i, 2);
      if (two === '<=' || two === '>=' || two === '<>') { toks.push({ type: 'op', v: two, start: i, end: i + 2 }); i += 2; continue; }
      if ('+-*/^&=<>%:'.includes(ch)) { toks.push({ type: 'op', v: ch, start: i, end: i + 1 }); i++; continue; }
      if (ch === '(' || ch === ')') { toks.push({ type: ch, start: i, end: i + 1 }); i++; continue; }
      if (ch === sep || (sep === ',' && ch === ';')) { toks.push({ type: 'sep', v: ch, start: i, end: i + 1 }); i++; continue; }
      if (ch === ',' && sep === ';') throw new SyntaxErr('Ai amestecat „,” și „;”. Folosește un singur fel de separator între argumente.', i);
      throw new SyntaxErr('Caracter neașteptat: „' + ch + '”.', i);
    }
    return { toks, sep };
  }

  /* ------------------------------------------------------------------
     3. PARSERUL — ordinea operațiilor ca în Excel:
        :  →  - (negație)  →  %  →  ^  →  * /  →  + -  →  &  →  = < > <= >= <>
     ------------------------------------------------------------------ */
  function parse(src) {
    const { toks } = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const next = () => toks[p++];
    const isOp = (v) => peek() && peek().type === 'op' && peek().v === v;

    function expr() { return comparatie(); }
    function comparatie() {
      let a = concatenare();
      while (peek() && peek().type === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(peek().v)) {
        const op = next().v; a = { t: 'bin', op, a, b: concatenare() };
      }
      return a;
    }
    function concatenare() {
      let a = aditiv();
      while (isOp('&')) { next(); a = { t: 'bin', op: '&', a, b: aditiv() }; }
      return a;
    }
    function aditiv() {
      let a = multiplicativ();
      while (isOp('+') || isOp('-')) { const op = next().v; a = { t: 'bin', op, a, b: multiplicativ() }; }
      return a;
    }
    function multiplicativ() {
      let a = putere();
      while (isOp('*') || isOp('/')) { const op = next().v; a = { t: 'bin', op, a, b: putere() }; }
      return a;
    }
    function putere() {
      let a = unar();
      while (isOp('^')) { next(); a = { t: 'bin', op: '^', a, b: unar() }; }
      return a;
    }
    function unar() {
      if (isOp('-')) { next(); return { t: 'neg', a: unar() }; }
      if (isOp('+')) { next(); return unar(); }
      return procent();
    }
    function procent() {
      let a = zona();
      while (isOp('%')) { next(); a = { t: 'pct', a }; }
      return a;
    }
    function zona() {
      let a = primar();
      while (isOp(':')) {
        const tk = next();
        const b = primar();
        if (a.t !== 'ref' || b.t !== 'ref') throw new SyntaxErr('Operatorul „:” se folosește doar între două adrese, de ex. A1:B5.', tk.start);
        if (b.sheet && b.sheet !== a.sheet) throw new SyntaxErr('O zonă trebuie să fie pe o singură foaie.', tk.start);
        a = { t: 'range', sheet: a.sheet, sheet2: a.sheet2, r1: Math.min(a.r, b.r), c1: Math.min(a.c, b.c), r2: Math.max(a.r, b.r), c2: Math.max(a.c, b.c) };
      }
      return a;
    }
    function primar() {
      const tk = next();
      if (!tk) throw new SyntaxErr('Formula s-a terminat prea devreme — lipsește un număr, o adresă sau o paranteză.', src.length);
      switch (tk.type) {
        case 'num': return { t: 'num', v: tk.v };
        case 'str': return { t: 'str', v: tk.v };
        case 'bool': return { t: 'bool', v: tk.v };
        case 'err': return { t: 'err', v: tk.v };
        case 'ref': return { t: 'ref', sheet: tk.sheet, sheet2: tk.sheet2, r: tk.r, c: tk.c };
        case 'cols': return { t: 'range', sheet: tk.sheet, sheet2: tk.sheet2, r1: 0, c1: Math.min(tk.c1, tk.c2), r2: -1, c2: Math.max(tk.c1, tk.c2), fullCol: true };
        case '(': {
          const e = expr();
          const cl = next();
          if (!cl || cl.type !== ')') throw new SyntaxErr('Lipsește o paranteză închisă „)”.', cl ? cl.start : src.length);
          return e;
        }
        case 'name': {
          if (!tk.call) return { t: 'name', v: tk.v };
          next(); // (
          const args = [];
          if (peek() && peek().type === ')') { next(); return { t: 'fn', name: tk.v, args }; }
          for (;;) {
            if (peek() && (peek().type === 'sep' || peek().type === ')')) args.push({ t: 'empty' });
            else args.push(expr());
            const s = next();
            if (!s) throw new SyntaxErr('Lipsește paranteza „)” de la finalul funcției ' + tk.v.toUpperCase() + '.', src.length);
            if (s.type === ')') break;
            if (s.type !== 'sep') throw new SyntaxErr('Între argumentele funcției ' + tk.v.toUpperCase() + ' trebuie „,” (sau „;”).', s.start);
          }
          return { t: 'fn', name: tk.v, args };
        }
        case 'op':
          throw new SyntaxErr('Operatorul „' + tk.v + '” nu poate sta aici. Poate lipsește un număr sau o adresă înaintea lui?', tk.start);
        case ')':
          throw new SyntaxErr('Paranteză „)” în plus sau pusă prea devreme.', tk.start);
        case 'sep':
          throw new SyntaxErr('Separator „' + tk.v + '” pus greșit (lipsește ceva înaintea lui).', tk.start);
      }
      throw new SyntaxErr('Formulă neînțeleasă.', tk.start);
    }

    if (!toks.length) throw new SyntaxErr('Formula este goală. După „=” scrie un calcul, de ex. =A1+B1.', 0);
    const ast = expr();
    if (p < toks.length) {
      const tk = toks[p];
      if (tk.type === ')') throw new SyntaxErr('Paranteză „)” în plus.', tk.start);
      throw new SyntaxErr('Lipsește un operator (+, -, *, / …) înainte de „' + src.slice(tk.start, tk.end) + '”.', tk.start);
    }
    return ast;
  }

  /* ------------------------------------------------------------------
     4. EVALUATORUL
     ------------------------------------------------------------------ */
  // cx = { wb, si (foaia formulei), r, c (celula formulei) }
  function ev(n, cx) {
    switch (n.t) {
      case 'num': case 'str': case 'bool': return n.v;
      case 'err': return err(n.v);
      case 'empty': return null;
      case 'val': return n.v;   // valoare deja calculată (folosită intern)
      case 'name': return err(E.NAME);
      case 'ref': {
        if (n.sheet2) return zona3D(n, n.r, n.c, n.r, n.c, cx);
        const si = n.sheet ? cx.wb.sheetIndex(n.sheet) : cx.si;
        if (si < 0) return err(E.REF);
        return new Arr([[cx.wb.getValue(si, n.r, n.c)]], { si, r1: n.r, c1: n.c, r2: n.r, c2: n.c });
      }
      case 'range': {
        if (n.sheet2) return zona3D(n, n.r1, n.c1, n.fullCol ? -1 : n.r2, n.c2, cx);
        const si = n.sheet ? cx.wb.sheetIndex(n.sheet) : cx.si;
        if (si < 0) return err(E.REF);
        const r2 = n.fullCol ? Math.max(0, cx.wb.lastRow(si)) : n.r2;
        return rangeArr(cx.wb, si, n.r1, n.c1, r2, n.c2);
      }
      case 'neg': return map1(ev(n.a, cx), (x) => { x = toNum(x); return isErr(x) ? x : -x; });
      case 'pct': return map1(ev(n.a, cx), (x) => { x = toNum(x); return isErr(x) ? x : x / 100; });
      case 'bin': return map2(ev(n.a, cx), ev(n.b, cx), (x, y) => opBinar(n.op, x, y));
      case 'fn': return apel(n, cx);
    }
    return err(E.VALUE);
  }
  // Referință 3D (Ian:Mar!B2): aceeași zonă de pe mai multe foi, una sub alta
  function zona3D(n, r1, c1, r2, c2, cx) {
    const a = cx.wb.sheetIndex(n.sheet), b = cx.wb.sheetIndex(n.sheet2);
    if (a < 0 || b < 0) return err(E.REF);
    const data = [];
    for (let si = Math.min(a, b); si <= Math.max(a, b); si++) {
      const rr2 = r2 < 0 ? Math.max(0, cx.wb.lastRow(si)) : r2;
      data.push(...rangeArr(cx.wb, si, r1, c1, rr2, c2).data);
    }
    return new Arr(data);
  }
  function rangeArr(wb, si, r1, c1, r2, c2) {
    const data = [];
    for (let r = r1; r <= r2; r++) {
      const row = [];
      for (let c = c1; c <= c2; c++) row.push(wb.getValue(si, r, c));
      data.push(row);
    }
    return new Arr(data, { si, r1, c1, r2, c2 });
  }
  function map1(a, f) {
    if (a instanceof Arr) return new Arr(a.data.map((row) => row.map(f)));
    return f(a);
  }
  function map2(a, b, f) {
    if (!(a instanceof Arr) && !(b instanceof Arr)) return f(a, b);
    const A = a instanceof Arr ? a : new Arr([[a]]);
    const B = b instanceof Arr ? b : new Arr([[b]]);
    const R = Math.max(A.rows, B.rows), C = Math.max(A.cols, B.cols);
    const data = [];
    for (let i = 0; i < R; i++) { const row = []; for (let j = 0; j < C; j++) row.push(f(A.get(i, j), B.get(i, j))); data.push(row); }
    return new Arr(data);
  }
  function opBinar(op, x, y) {
    if (isErr(x)) return x;
    if (isErr(y)) return y;
    switch (op) {
      case '&': return toText(x) + toText(y);
      case '=': return compara(x, y) === 0;
      case '<>': return compara(x, y) !== 0;
      case '<': return compara(x, y) < 0;
      case '>': return compara(x, y) > 0;
      case '<=': return compara(x, y) <= 0;
      case '>=': return compara(x, y) >= 0;
    }
    const a = toNum(x); if (isErr(a)) return a;
    const b = toNum(y); if (isErr(b)) return b;
    let r;
    switch (op) {
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '*': r = a * b; break;
      case '/': if (b === 0) return err(E.DIV0); r = a / b; break;
      case '^': if (a === 0 && b < 0) return err(E.DIV0); r = Math.pow(a, b); break;
    }
    return isFinite(r) ? r : err(E.NUM);
  }

  // Valoarea „scalară” a unui argument (o singură celulă).
  // O zonă pe o coloană/rând se intersectează cu rândul/coloana formulei.
  function scalar(v, cx) {
    if (!(v instanceof Arr)) return v;
    if (v.rows === 1 && v.cols === 1) return v.data[0][0];
    if (v.ref && cx) {
      const { r1, c1, r2, c2 } = v.ref;
      if (v.cols === 1 && cx.r >= r1 && cx.r <= r2) return v.data[cx.r - r1][0];
      if (v.rows === 1 && cx.c >= c1 && cx.c <= c2) return v.data[0][cx.c - c1];
    }
    return err(E.VALUE);
  }
  function asArr(v) { return v instanceof Arr ? v : new Arr([[v]]); }

  /* ---------- Criterii pentru COUNTIF, SUMIF … ---------- */
  function wildcardRe(s) {
    let re = '';
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '~' && i + 1 < s.length) { re += s[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
      else if (ch === '*') re += '.*';
      else if (ch === '?') re += '.';
      else re += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    return new RegExp('^' + re + '$', 'is');
  }
  function areWildcard(s) { return /(^|[^~])[*?]/.test(s); }
  function criteriu(c) {
    if (isErr(c)) return (v) => isErr(v) && v.code === c.code;
    if (typeof c === 'number') return (v) => (typeof v === 'number' && compara(v, c) === 0) || (typeof v === 'string' && numarDinText(v) === c);
    if (typeof c === 'boolean') return (v) => v === c;
    if (c === null) return (v) => v === null || v === '';
    const m = /^(<=|>=|<>|=|<|>)?([\s\S]*)$/.exec(String(c));
    const op = m[1] || '=';
    const rest = m[2];
    if (rest === '') {
      if (op === '=') return (v) => v === null || v === '';
      if (op === '<>') return (v) => v !== null;   // ca în Excel: și "" produs de o formulă contează ca „completat”
      return () => false;
    }
    const num = numarDinText(rest);
    if (num != null) {
      return (v) => {
        if (typeof v !== 'number') {
          if (op === '<>') return true;
          if (op === '=' && typeof v === 'string') return numarDinText(v) === num;
          return false;
        }
        const k = compara(v, num);
        return op === '=' ? k === 0 : op === '<>' ? k !== 0 : op === '<' ? k < 0 : op === '>' ? k > 0 : op === '<=' ? k <= 0 : k >= 0;
      };
    }
    const nb = norm(rest);
    if (nb === 'TRUE' || nb === 'FALSE') {
      const b = nb === 'TRUE';
      return (v) => (op === '<>' ? v !== b : op === '=' ? v === b : false);
    }
    if (op === '=' || op === '<>') {
      const re = wildcardRe(rest);
      return (v) => {
        const ok = typeof v === 'string' && re.test(v);
        return op === '=' ? ok : !ok;
      };
    }
    return (v) => {
      if (typeof v !== 'string') return false;
      const k = compara(v, rest);
      return op === '<' ? k < 0 : op === '>' ? k > 0 : op === '<=' ? k <= 0 : k >= 0;
    };
  }
  // Zona corespunzătoare (aceeași formă ca zona criteriilor), pornind din colțul lui „sumRange”
  function zonaPereche(sum, forma, cx) {
    if (!(sum instanceof Arr) || !sum.ref) return sum;
    if (sum.rows === forma.rows && sum.cols === forma.cols) return sum;
    const { si, r1, c1 } = sum.ref;
    return rangeArr(cx.wb, si, r1, c1, r1 + forma.rows - 1, c1 + forma.cols - 1);
  }

  /* ---------- Colectarea numerelor pentru SUM, AVERAGE … ---------- */
  // Din zone se iau doar numerele; argumentele scrise direct se convertesc.
  function numere(args, cx, opt) {
    opt = opt || {};
    const out = [];
    for (const a of args) {
      if (a.t === 'empty') { out.push(0); continue; }
      const v = ev(a, cx);
      if (v instanceof Arr) {
        for (const x of v.flat()) {
          if (isErr(x)) return x;
          if (typeof x === 'number') out.push(x);
          else if (opt.cuTextSiLogic && x !== null) out.push(typeof x === 'boolean' ? (x ? 1 : 0) : 0);
        }
      } else {
        if (isErr(v)) return v;
        if (opt.doarNumere) { if (typeof v === 'number' || (typeof v === 'string' && numarDinText(v) != null) || typeof v === 'boolean') out.push(toNum(v)); continue; }
        const n = toNum(v);
        if (isErr(n)) return n;
        out.push(n);
      }
    }
    return out;
  }
  function toateValorile(args, cx) {
    const out = [];
    for (const a of args) {
      const v = ev(a, cx);
      if (v instanceof Arr) out.push(...v.flat()); else out.push(v);
    }
    return out;
  }

  function rotunjeste(x, d, mod) {
    const p = Math.pow(10, d);
    const y = Number((Math.abs(x) * p).toPrecision(15));
    let r;
    if (mod === 'sus') r = Math.ceil(y);
    else if (mod === 'jos') r = Math.floor(y);
    else r = Math.round(y);
    return Math.sign(x) * r / p;
  }

  /* ---------- Căutări ---------- */
  function egalCautare(caut, v, cuWildcard) {
    if (typeof caut === 'string' && typeof v === 'string' && cuWildcard && areWildcard(caut)) return wildcardRe(caut).test(v);
    if (caut === null) caut = 0;
    if (rang(caut) !== rang(v === null ? caut : v)) return false;
    return v !== null && compara(caut, v) === 0;
  }
  // Căutare aproximativă: ultima poziție cu valoare <= căutată (lista crescătoare)
  function cautaAprox(caut, lista) {
    let gasit = -1;
    for (let i = 0; i < lista.length; i++) {
      const v = lista[i];
      if (v === null || rang(v) !== rang(caut)) continue;
      if (compara(v, caut) <= 0) gasit = i; else break;
    }
    return gasit;
  }

  /* ---------- DATEDIF ---------- */
  function zileInLuna(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function datedif(s, e, u) {
    if (s > e) return err(E.NUM);
    const a = serialInData(s), b = serialInData(e);
    let luni = (b.y - a.y) * 12 + (b.m - a.m) - (b.d < a.d ? 1 : 0);
    switch (norm(u)) {
      case 'D': return Math.floor(e) - Math.floor(s);
      case 'M': return luni;
      case 'Y': return Math.floor(luni / 12);
      case 'YM': return luni % 12;
      case 'MD': {
        if (b.d >= a.d) return b.d - a.d;
        const pm = b.m === 1 ? 12 : b.m - 1, py = b.m === 1 ? b.y - 1 : b.y;
        return zileInLuna(py, pm) - a.d + b.d;
      }
      case 'YD': {
        let st = dataInSerial(b.y, a.m, a.d);
        if (st > e) st = dataInSerial(b.y - 1, a.m, a.d);
        return Math.floor(e) - st;
      }
    }
    return err(E.NUM);
  }

  /* ---------- TEXT(valoare, format) — formatele uzuale ---------- */
  function formatText(v, f) {
    const fl = String(f).toLowerCase();
    if (/[dmy]/.test(fl) && !/[0#]/.test(fl)) {
      const x = serialInData(v);
      const LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
      const ZILE = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
      return fl.replace(/yyyy|yy|mmmm|mmm|mm|m|dddd|ddd|dd|d/g, (t) => ({
        yyyy: String(x.y), yy: String(x.y).slice(2), mmmm: LUNI[x.m - 1], mmm: LUNI[x.m - 1].slice(0, 3),
        mm: pad2(x.m), m: String(x.m), dddd: ZILE[x.wd], ddd: ZILE[x.wd].slice(0, 3), dd: pad2(x.d), d: String(x.d)
      })[t]);
    }
    const pct = fl.includes('%');
    let n = pct ? v * 100 : v;
    const m = /0[.,](0+)/.exec(fl);
    const dec = m ? m[1].length : 0;
    let s = rotunjeste(n, dec).toFixed(dec);
    if (/#,##|#\.##/.test(fl)) s = grupeazaMii(s);
    else s = s.replace('.', optiuni.zecimal === ',' ? ',' : '.');
    return s + (pct ? '%' : '');
  }
  // '1234567.5' → '1.234.567,5' (cu virgulă zecimală) sau '1,234,567.5'
  function grupeazaMii(s) {
    const [i, d] = s.split('.');
    const virgula = optiuni.zecimal === ',';
    const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, virgula ? '.' : ',');
    return d ? g + (virgula ? ',' : '.') + d : g;
  }

  /* ------------------------------------------------------------------
     FUNCȚIILE — fiecare primește (argumente_nevaluate, context)
     ------------------------------------------------------------------ */
  const S = (a, cx) => scalar(ev(a, cx), cx);          // valoare simplă
  const N = (a, cx) => { const v = S(a, cx); return isErr(v) ? v : toNum(v); };
  const T = (a, cx) => { const v = S(a, cx); return isErr(v) ? v : toText(v); };
  // Funcție numerică aplicată fie unei singure valori, fie fiecărei celule dintr-o zonă
  // (de ex. YEAR(D2:D6) în SUMPRODUCT). O zonă pe coloana formulei se intersectează, ca în Excel.
  function peZona(a, cx, f) {
    const v = ev(a, cx);
    const aplica = (x) => { const n = toNum(x); return isErr(n) ? n : f(n); };
    if (v instanceof Arr && v.rows * v.cols > 1) {
      const s1 = scalar(v, cx);
      if (!isErr(s1) && !cx.matrice) return aplica(s1);
      return map1(v, aplica);
    }
    return aplica(scalar(v, cx));
  }
  const nrArg = (args, min, max) => args.length < min || args.length > max;
  const firstErr = (...v) => v.find(isErr);

  function agregat(f) {
    return (args, cx) => {
      if (!args.length) return err(E.VALUE);
      const l = numere(args, cx);
      return isErr(l) ? l : f(l);
    };
  }
  function faraErori(lista) { return lista.find(isErr); }

  const FN = {
    // ---- matematice / statistice ----
    SUM: agregat((l) => l.reduce((s, x) => s + x, 0)),
    AVERAGE: agregat((l) => (l.length ? l.reduce((s, x) => s + x, 0) / l.length : err(E.DIV0))),
    MIN: agregat((l) => (l.length ? Math.min(...l) : 0)),
    MAX: agregat((l) => (l.length ? Math.max(...l) : 0)),
    PRODUCT: agregat((l) => (l.length ? l.reduce((s, x) => s * x, 1) : 0)),
    MEDIAN: agregat((l) => {
      if (!l.length) return err(E.NUM);
      const s = [...l].sort((a, b) => a - b), k = s.length >> 1;
      return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
    }),
    COUNT: (args, cx) => {
      let n = 0;
      for (const a of args) {
        const v = ev(a, cx);
        if (v instanceof Arr) n += v.flat().filter((x) => typeof x === 'number').length;
        else if (typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && numarDinText(v) != null)) n++;
      }
      return n;
    },
    COUNTA: (args, cx) => toateValorile(args, cx).filter((x) => x !== null).length,
    COUNTBLANK: (args, cx) => toateValorile(args, cx).filter((x) => x === null || x === '').length,
    ROUND: (args, cx) => {
      if (nrArg(args, 2, 2)) return err(E.VALUE);
      const x = N(args[0], cx), d = N(args[1], cx);
      return firstErr(x, d) || rotunjeste(x, Math.trunc(d));
    },
    ROUNDUP: (args, cx) => {
      if (nrArg(args, 2, 2)) return err(E.VALUE);
      const x = N(args[0], cx), d = N(args[1], cx);
      return firstErr(x, d) || rotunjeste(x, Math.trunc(d), 'sus');
    },
    ROUNDDOWN: (args, cx) => {
      if (nrArg(args, 2, 2)) return err(E.VALUE);
      const x = N(args[0], cx), d = N(args[1], cx);
      return firstErr(x, d) || rotunjeste(x, Math.trunc(d), 'jos');
    },
    TRUNC: (args, cx) => {
      const x = N(args[0], cx), d = args[1] ? N(args[1], cx) : 0;
      return firstErr(x, d) || rotunjeste(x, Math.trunc(d), 'jos');
    },
    INT: (args, cx) => peZona(args[0], cx, Math.floor),
    ABS: (args, cx) => peZona(args[0], cx, Math.abs),
    SQRT: (args, cx) => { const x = N(args[0], cx); return isErr(x) ? x : x < 0 ? err(E.NUM) : Math.sqrt(x); },
    POWER: (args, cx) => { const a = N(args[0], cx), b = N(args[1], cx); return firstErr(a, b) || opBinar('^', a, b); },
    MOD: (args, cx) => {
      const a = N(args[0], cx), b = N(args[1], cx);
      if (firstErr(a, b)) return firstErr(a, b);
      if (b === 0) return err(E.DIV0);
      return a - b * Math.floor(a / b);
    },
    PI: () => Math.PI,
    LARGE: (args, cx) => {
      const l = numere([args[0]], cx); const k = N(args[1], cx);
      if (firstErr(l, k)) return firstErr(l, k);
      const s = [...l].sort((a, b) => b - a);
      return k < 1 || k > s.length ? err(E.NUM) : s[Math.ceil(k) - 1];
    },
    SMALL: (args, cx) => {
      const l = numere([args[0]], cx); const k = N(args[1], cx);
      if (firstErr(l, k)) return firstErr(l, k);
      const s = [...l].sort((a, b) => a - b);
      return k < 1 || k > s.length ? err(E.NUM) : s[Math.ceil(k) - 1];
    },
    RANK: (args, cx) => {
      const x = N(args[0], cx);
      if (isErr(x)) return x;
      const l = numere([args[1]], cx); if (isErr(l)) return l;
      const ord = args[2] ? N(args[2], cx) : 0;
      if (!l.some((v) => compara(v, x) === 0)) return err(E.NA);
      return 1 + l.filter((v) => (ord ? v < x : v > x) && compara(v, x) !== 0).length;
    },
    SUMPRODUCT: (args, cx) => {
      const cxm = Object.assign({}, cx, { matrice: true });
      const arrs = args.map((a) => asArr(ev(a, cxm)));
      const R = arrs[0].rows, C = arrs[0].cols;
      if (arrs.some((a) => a.rows !== R || a.cols !== C)) return err(E.VALUE);
      let s = 0;
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
        let p = 1;
        for (const a of arrs) {
          const v = a.data[i][j];
          if (isErr(v)) return v;
          p *= typeof v === 'number' ? v : 0;   // textul și TRUE/FALSE contează 0 (ca în Excel)
        }
        s += p;
      }
      return s;
    },
    SUBTOTAL: (args, cx) => {
      const cod = N(args[0], cx); if (isErr(cod)) return cod;
      const f = { 1: 'AVERAGE', 2: 'COUNT', 3: 'COUNTA', 4: 'MAX', 5: 'MIN', 6: 'PRODUCT', 9: 'SUM' }[cod % 100];
      if (!f) return err(E.VALUE);
      // SUBTOTAL ignoră celulele care conțin ele însele SUBTOTAL
      // (iar codurile 101–111 ignoră și rândurile ascunse de filtru)
      const zone = args.slice(1).map((a) => {
        const z = ev(a, cx);
        if (!(z instanceof Arr) || !z.ref) return { t: 'val', v: z };
        const { si, r1, c1 } = z.ref;
        const sh = cx.wb.sheets[si];
        const data = z.data.map((row, i) => row.map((v, j) => {
          const cell = cx.wb.cell(si, r1 + i, c1 + j);
          if (cell && /SUBTOTAL\s*\(/i.test(cell.input)) return null;
          if ((cod > 100 || sh.filtruActiv) && sh.hiddenRows.has(r1 + i)) return null;
          return v;
        }));
        return { t: 'val', v: new Arr(data) };
      });
      return FN[f](zone, cx);
    },

    // ---- logice ----
    IF: (args, cx) => {
      if (nrArg(args, 1, 3)) return err(E.VALUE);
      const c = scalarLogic(ev(args[0], cx), cx);
      if (c instanceof Arr) return map1(c, (b) => (isErr(b) ? b : alegeIf(b, args, cx)));
      if (isErr(c)) return c;
      return alegeIf(c, args, cx);
    },
    AND: (args, cx) => logicAgregat(args, cx, (l) => l.every(Boolean)),
    OR: (args, cx) => logicAgregat(args, cx, (l) => l.some(Boolean)),
    NOT: (args, cx) => { const b = toBool(S(args[0], cx)); return isErr(b) ? b : !b; },
    TRUE: () => true,
    FALSE: () => false,
    IFS: (args, cx) => {
      if (args.length < 2 || args.length % 2) return err(E.VALUE);
      for (let i = 0; i < args.length; i += 2) {
        const b = toBool(S(args[i], cx));
        if (isErr(b)) return b;
        if (b) return ev(args[i + 1], cx);
      }
      return err(E.NA);
    },
    SWITCH: (args, cx) => {
      if (args.length < 3) return err(E.VALUE);
      const v = S(args[0], cx); if (isErr(v)) return v;
      let i = 1;
      for (; i + 1 < args.length; i += 2) { const x = S(args[i], cx); if (!isErr(x) && compara(v, x) === 0) return ev(args[i + 1], cx); }
      return i < args.length ? ev(args[i], cx) : err(E.NA);
    },
    IFERROR: (args, cx) => { const v = S(args[0], cx); return isErr(v) ? S(args[1], cx) : v; },
    IFNA: (args, cx) => { const v = S(args[0], cx); return isErr(v) && v.code === E.NA ? S(args[1], cx) : v; },
    ISNUMBER: (args, cx) => typeof S(args[0], cx) === 'number',
    ISTEXT: (args, cx) => typeof S(args[0], cx) === 'string',
    ISBLANK: (args, cx) => S(args[0], cx) === null,
    ISERROR: (args, cx) => isErr(S(args[0], cx)),
    ISNA: (args, cx) => { const v = S(args[0], cx); return isErr(v) && v.code === E.NA; },
    CHOOSE: (args, cx) => {
      const k = N(args[0], cx); if (isErr(k)) return k;
      const i = Math.trunc(k);
      if (i < 1 || i >= args.length) return err(E.VALUE);
      return ev(args[i], cx);
    },

    // ---- condiționale ----
    COUNTIF: (args, cx) => {
      if (nrArg(args, 2, 2)) return err(E.VALUE);
      const z = asArr(ev(args[0], cx)); const c = S(args[1], cx);
      const f = criteriu(c);
      return z.flat().filter(f).length;
    },
    COUNTIFS: (args, cx) => {
      if (args.length < 2 || args.length % 2) return err(E.VALUE);
      const perechi = [];
      for (let i = 0; i < args.length; i += 2) perechi.push([asArr(ev(args[i], cx)), criteriu(S(args[i + 1], cx))]);
      const R = perechi[0][0].rows, C = perechi[0][0].cols;
      if (perechi.some(([z]) => z.rows !== R || z.cols !== C)) return err(E.VALUE);
      let n = 0;
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) if (perechi.every(([z, f]) => f(z.data[i][j]))) n++;
      return n;
    },
    SUMIF: (args, cx) => {
      if (nrArg(args, 2, 3)) return err(E.VALUE);
      const z = asArr(ev(args[0], cx)); const f = criteriu(S(args[1], cx));
      const s = args[2] ? asArr(zonaPereche(ev(args[2], cx), z, cx)) : z;
      let t = 0;
      for (let i = 0; i < z.rows; i++) for (let j = 0; j < z.cols; j++) {
        if (!f(z.data[i][j])) continue;
        const v = s.get(i, j); if (isErr(v)) return v;
        if (typeof v === 'number') t += v;
      }
      return t;
    },
    AVERAGEIF: (args, cx) => {
      if (nrArg(args, 2, 3)) return err(E.VALUE);
      const z = asArr(ev(args[0], cx)); const f = criteriu(S(args[1], cx));
      const s = args[2] ? asArr(zonaPereche(ev(args[2], cx), z, cx)) : z;
      let t = 0, n = 0;
      for (let i = 0; i < z.rows; i++) for (let j = 0; j < z.cols; j++) {
        if (!f(z.data[i][j])) continue;
        const v = s.get(i, j); if (isErr(v)) return v;
        if (typeof v === 'number') { t += v; n++; }
      }
      return n ? t / n : err(E.DIV0);
    },
    SUMIFS: (args, cx) => multiCond(args, cx, (l) => l.reduce((s, x) => s + x, 0)),
    AVERAGEIFS: (args, cx) => multiCond(args, cx, (l) => (l.length ? l.reduce((s, x) => s + x, 0) / l.length : err(E.DIV0))),
    MAXIFS: (args, cx) => multiCond(args, cx, (l) => (l.length ? Math.max(...l) : 0)),
    MINIFS: (args, cx) => multiCond(args, cx, (l) => (l.length ? Math.min(...l) : 0)),

    // ---- text ----
    LEFT: (args, cx) => {
      const t = T(args[0], cx), n = args[1] ? N(args[1], cx) : 1;
      if (firstErr(t, n)) return firstErr(t, n);
      return n < 0 ? err(E.VALUE) : [...t].slice(0, Math.trunc(n)).join('');
    },
    RIGHT: (args, cx) => {
      const t = T(args[0], cx), n = args[1] ? N(args[1], cx) : 1;
      if (firstErr(t, n)) return firstErr(t, n);
      if (n < 0) return err(E.VALUE);
      const ch = [...t]; return Math.trunc(n) === 0 ? '' : ch.slice(-Math.trunc(n)).join('');
    },
    MID: (args, cx) => {
      if (nrArg(args, 3, 3)) return err(E.VALUE);
      const t = T(args[0], cx), s = N(args[1], cx), n = N(args[2], cx);
      if (firstErr(t, s, n)) return firstErr(t, s, n);
      if (s < 1 || n < 0) return err(E.VALUE);
      return [...t].slice(Math.trunc(s) - 1, Math.trunc(s) - 1 + Math.trunc(n)).join('');
    },
    LEN: (args, cx) => {
      const v = ev(args[0], cx);
      const lung = (x) => (isErr(x) ? x : [...toText(x)].length);
      if (v instanceof Arr && v.rows * v.cols > 1 && (cx.matrice || isErr(scalar(v, cx)))) return map1(v, lung);
      return lung(scalar(v, cx));
    },
    UPPER: (args, cx) => { const t = T(args[0], cx); return isErr(t) ? t : t.toLocaleUpperCase('ro'); },
    LOWER: (args, cx) => { const t = T(args[0], cx); return isErr(t) ? t : t.toLocaleLowerCase('ro'); },
    PROPER: (args, cx) => {
      const t = T(args[0], cx); if (isErr(t)) return t;
      return t.toLocaleLowerCase('ro').replace(/(^|[^A-Za-zÀ-ɏ])([a-zÀ-ɏ])/g, (m, a, b) => a + b.toLocaleUpperCase('ro'));
    },
    TRIM: (args, cx) => { const t = T(args[0], cx); return isErr(t) ? t : t.replace(/ +/g, ' ').trim(); },
    CONCAT: (args, cx) => {
      const l = toateValorile(args, cx); const e = faraErori(l); if (e) return e;
      return l.map(toText).join('');
    },
    CONCATENATE: (args, cx) => {
      let s = '';
      for (const a of args) { const t = T(a, cx); if (isErr(t)) return t; s += t; }
      return s;
    },
    TEXTJOIN: (args, cx) => {
      const d = T(args[0], cx), ig = toBool(S(args[1], cx));
      if (firstErr(d, ig)) return firstErr(d, ig);
      const l = toateValorile(args.slice(2), cx); const e = faraErori(l); if (e) return e;
      return l.filter((x) => !(ig && (x === null || x === ''))).map(toText).join(d);
    },
    SUBSTITUTE: (args, cx) => {
      const t = T(args[0], cx), o = T(args[1], cx), n = T(args[2], cx);
      if (firstErr(t, o, n)) return firstErr(t, o, n);
      if (o === '') return t;
      if (args[3]) {
        const k = N(args[3], cx); if (isErr(k)) return k;
        let idx = -1;
        for (let i = 0; i < k; i++) { idx = t.indexOf(o, idx + 1); if (idx < 0) return t; }
        return t.slice(0, idx) + n + t.slice(idx + o.length);
      }
      return t.split(o).join(n);
    },
    FIND: (args, cx) => {
      const f = T(args[0], cx), t = T(args[1], cx), s = args[2] ? N(args[2], cx) : 1;
      if (firstErr(f, t, s)) return firstErr(f, t, s);
      const i = t.indexOf(f, s - 1);
      return i < 0 ? err(E.VALUE) : i + 1;
    },
    SEARCH: (args, cx) => {
      const f = T(args[0], cx), t = T(args[1], cx), s = args[2] ? N(args[2], cx) : 1;
      if (firstErr(f, t, s)) return firstErr(f, t, s);
      const i = t.toLocaleLowerCase('ro').indexOf(f.toLocaleLowerCase('ro'), s - 1);
      return i < 0 ? err(E.VALUE) : i + 1;
    },
    REPT: (args, cx) => {
      const t = T(args[0], cx), n = N(args[1], cx);
      if (firstErr(t, n)) return firstErr(t, n);
      return n < 0 ? err(E.VALUE) : t.repeat(Math.trunc(n));
    },
    EXACT: (args, cx) => { const a = T(args[0], cx), b = T(args[1], cx); return firstErr(a, b) || a === b; },
    VALUE: (args, cx) => {
      const v = S(args[0], cx); if (isErr(v)) return v;
      if (typeof v === 'number') return v;
      const n = numarDinText(toText(v)); return n == null ? err(E.VALUE) : n;
    },
    TEXT: (args, cx) => {
      const v = S(args[0], cx), f = T(args[1], cx);
      if (firstErr(v, f)) return firstErr(v, f);
      const n = toNum(v); if (isErr(n)) return toText(v);
      return formatText(n, f);
    },

    // ---- dată ----
    TODAY: () => azi(),
    NOW: () => { const t = new Date(); return azi() + (t.getHours() * 3600 + t.getMinutes() * 60) / 86400; },
    YEAR: (args, cx) => peZona(args[0], cx, (x) => serialInData(x).y),
    MONTH: (args, cx) => peZona(args[0], cx, (x) => serialInData(x).m),
    DAY: (args, cx) => peZona(args[0], cx, (x) => serialInData(x).d),
    DATE: (args, cx) => {
      if (nrArg(args, 3, 3)) return err(E.VALUE);
      const y = N(args[0], cx), m = N(args[1], cx), d = N(args[2], cx);
      if (firstErr(y, m, d)) return firstErr(y, m, d);
      const yy = y < 1900 ? y + 1900 : y;
      return dataInSerial(Math.trunc(yy), Math.trunc(m), Math.trunc(d));
    },
    WEEKDAY: (args, cx) => {
      const x = N(args[0], cx), tip = args[1] ? N(args[1], cx) : 1;
      if (firstErr(x, tip)) return firstErr(x, tip);
      const wd = serialInData(x).wd; // 0 = duminică
      if (tip === 2) return wd === 0 ? 7 : wd;
      if (tip === 3) return wd === 0 ? 6 : wd - 1;
      return wd + 1;
    },
    DATEDIF: (args, cx) => {
      if (nrArg(args, 3, 3)) return err(E.VALUE);
      const s = N(args[0], cx), e = N(args[1], cx), u = T(args[2], cx);
      return firstErr(s, e, u) || datedif(s, e, u);
    },
    DAYS: (args, cx) => {
      const e = N(args[0], cx), s = N(args[1], cx);
      return firstErr(e, s) || Math.floor(e) - Math.floor(s);
    },

    // ---- căutare ----
    VLOOKUP: (args, cx) => cautareVH(args, cx, true),
    HLOOKUP: (args, cx) => cautareVH(args, cx, false),
    MATCH: (args, cx) => {
      if (nrArg(args, 2, 3)) return err(E.VALUE);
      const x = S(args[0], cx); if (isErr(x)) return x;
      const z = asArr(ev(args[1], cx));
      if (z.rows > 1 && z.cols > 1) return err(E.NA);
      const l = z.flat();
      const tip = args[2] && args[2].t !== 'empty' ? N(args[2], cx) : 1;
      if (tip === 0) { const i = l.findIndex((v) => egalCautare(x, v, true)); return i < 0 ? err(E.NA) : i + 1; }
      if (tip > 0) { const i = cautaAprox(x, l); return i < 0 ? err(E.NA) : i + 1; }
      let g = -1;
      for (let i = 0; i < l.length; i++) { if (l[i] !== null && compara(l[i], x) >= 0) g = i; else break; }
      return g < 0 ? err(E.NA) : g + 1;
    },
    INDEX: (args, cx) => {
      if (nrArg(args, 2, 3)) return err(E.VALUE);
      const z = asArr(ev(args[0], cx));
      let r = N(args[1], cx), c = args[2] && args[2].t !== 'empty' ? N(args[2], cx) : null;
      if (firstErr(r, c)) return firstErr(r, c);
      if (c === null) { if (z.rows === 1) { c = r; r = 1; } else c = 1; }
      r = Math.trunc(r); c = Math.trunc(c);
      if (r < 0 || c < 0 || r > z.rows || c > z.cols) return err(E.REF);
      if (r === 0 && c === 0) return z;
      if (r === 0) return new Arr(z.data.map((row) => [row[c - 1]]));
      if (c === 0) return new Arr([z.data[r - 1]]);
      const v = z.data[r - 1][c - 1];
      if (z.ref) return new Arr([[v]], { si: z.ref.si, r1: z.ref.r1 + r - 1, c1: z.ref.c1 + c - 1, r2: z.ref.r1 + r - 1, c2: z.ref.c1 + c - 1 });
      return v;
    },
    XLOOKUP: (args, cx) => {
      if (nrArg(args, 3, 6)) return err(E.VALUE);
      const x = S(args[0], cx); if (isErr(x)) return x;
      const zc = asArr(ev(args[1], cx)), zr = asArr(ev(args[2], cx));
      const mod = args[4] && args[4].t !== 'empty' ? N(args[4], cx) : 0;
      const dir = args[5] && args[5].t !== 'empty' ? N(args[5], cx) : 1;
      const vert = zc.cols === 1;
      const l = zc.flat();
      const ordine = [...l.keys()]; if (dir < 0) ordine.reverse();
      let idx = -1;
      for (const i of ordine) { if (egalCautare(x, l[i], mod === 2)) { idx = i; break; } }
      if (idx < 0 && (mod === -1 || mod === 1)) {
        let best = -1;
        for (const i of ordine) {
          const v = l[i]; if (v === null || rang(v) !== rang(x)) continue;
          const k = compara(v, x);
          if (mod === -1 && k < 0 && (best < 0 || compara(v, l[best]) > 0)) best = i;
          if (mod === 1 && k > 0 && (best < 0 || compara(v, l[best]) < 0)) best = i;
        }
        idx = best;
      }
      if (idx < 0) return args[3] && args[3].t !== 'empty' ? S(args[3], cx) : err(E.NA);
      if (vert) return zr.cols === 1 ? zr.data[idx][0] : new Arr([zr.data[idx]]);
      return zr.rows === 1 ? zr.data[0][idx] : new Arr(zr.data.map((row) => [row[idx]]));
    },
    ROWS: (args, cx) => { const z = ev(args[0], cx); return z instanceof Arr ? z.rows : 1; },
    COLUMNS: (args, cx) => { const z = ev(args[0], cx); return z instanceof Arr ? z.cols : 1; },
    ROW: (args, cx) => {
      if (!args.length) return cx.r + 1;
      const z = ev(args[0], cx); return z instanceof Arr && z.ref ? z.ref.r1 + 1 : err(E.VALUE);
    },
    COLUMN: (args, cx) => {
      if (!args.length) return cx.c + 1;
      const z = ev(args[0], cx); return z instanceof Arr && z.ref ? z.ref.c1 + 1 : err(E.VALUE);
    }
  };
  FN['RANK.EQ'] = FN.RANK;

  // Funcțiile care întorc o dată calendaristică (rezultatul se afișează ca dată)
  const FUNCTII_DATA = new Set(['TODAY', 'DATE']);

  function scalarLogic(v, cx) {
    if (v instanceof Arr) {
      if (v.rows === 1 && v.cols === 1) return toBool(v.data[0][0]);
      const s = scalar(v, cx);
      if (!isErr(s)) return toBool(s);
      return map1(v, toBool);
    }
    return toBool(v);
  }
  function alegeIf(b, args, cx) {
    if (b) return args.length > 1 ? (args[1].t === 'empty' ? 0 : ev(args[1], cx)) : true;
    return args.length > 2 ? (args[2].t === 'empty' ? 0 : ev(args[2], cx)) : false;
  }
  function logicAgregat(args, cx, f) {
    if (!args.length) return err(E.VALUE);
    const l = [];
    for (const a of args) {
      const v = ev(a, cx);
      if (v instanceof Arr) {
        for (const x of v.flat()) { if (isErr(x)) return x; if (typeof x === 'boolean' || typeof x === 'number') l.push(toBool(x)); }
      } else {
        if (isErr(v)) return v;
        const b = toBool(v); if (isErr(b)) return b; l.push(b);
      }
    }
    return l.length ? f(l) : err(E.VALUE);
  }
  function multiCond(args, cx, f) {
    if (args.length < 3 || args.length % 2 === 0) return err(E.VALUE);
    const tinta = asArr(ev(args[0], cx));
    const perechi = [];
    for (let i = 1; i < args.length; i += 2) perechi.push([asArr(ev(args[i], cx)), criteriu(S(args[i + 1], cx))]);
    const R = tinta.rows, C = tinta.cols;
    if (perechi.some(([z]) => z.rows !== R || z.cols !== C)) return err(E.VALUE);
    const l = [];
    for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
      if (!perechi.every(([z, fc]) => fc(z.data[i][j]))) continue;
      const v = tinta.data[i][j]; if (isErr(v)) return v;
      if (typeof v === 'number') l.push(v);
    }
    return f(l);
  }
  function cautareVH(args, cx, vertical) {
    if (nrArg(args, 3, 4)) return err(E.VALUE);
    const x = S(args[0], cx); if (isErr(x)) return x;
    const z = ev(args[1], cx);
    if (isErr(z)) return z;
    const t = asArr(z);
    const k = N(args[2], cx); if (isErr(k)) return k;
    const idx = Math.trunc(k);
    const exact = args[3] && args[3].t !== 'empty' ? !toBool(S(args[3], cx)) : false;
    if (idx < 1) return err(E.VALUE);
    if (idx > (vertical ? t.cols : t.rows)) return err(E.REF);
    const cheie = vertical ? t.data.map((r) => r[0]) : t.data[0];
    const poz = exact ? cheie.findIndex((v) => egalCautare(x, v, true)) : cautaAprox(x, cheie);
    if (poz < 0) return err(E.NA);
    return vertical ? t.data[poz][idx - 1] : t.data[idx - 1][poz];
  }

  function apel(n, cx) {
    const canon = numeCanonic(n.name);
    const f = canon && FN[canon];
    if (!f) return err(E.NAME);
    return f(n.args, cx);
  }

  /* ------------------------------------------------------------------
     5. REGISTRUL (Workbook) — modelul de date al simulatorului
     ------------------------------------------------------------------
     Definiția unei foi (în fișierele din /data):
       { name: 'Catalog', rows: 12, cols: 6,
         data: [['Nume','Nota'], ['Ana', 9]],       ← tabel pornind din A1
         cells: { 'D1': '=AVERAGE(B2:B3)' },         ← celule individuale
         formats: { 'C2:C9': 'currency', 'D2': 'percent:1' },
         bold: ['A1:B1'], widths: { A: 140 } }
     ------------------------------------------------------------------ */
  function literal(text) {
    // Interpretează ce scrie elevul într-o celulă (fără „=”)
    if (text === '' || text == null) return { v: null };
    const t = String(text);
    if (t[0] === "'") return { v: t.slice(1) };
    const s = t.trim();
    let m = /^([+-]?)(\d+(?:[.,]\d+)?)$/.exec(s);
    if (m) return { v: (m[1] === '-' ? -1 : 1) * parseFloat(m[2].replace(',', '.')) };
    m = /^([+-]?)(\d+(?:[.,]\d+)?)\s*%$/.exec(s);
    if (m) {
      const dec = (m[2].split(/[.,]/)[1] || '').length;
      return { v: (m[1] === '-' ? -1 : 1) * parseFloat(m[2].replace(',', '.')) / 100, fmt: { type: 'percent', dec } };
    }
    m = /^([+-]?)(\d+(?:[.,]\d+)?)\s*(lei|ron)$/i.exec(s);
    if (m) return { v: (m[1] === '-' ? -1 : 1) * parseFloat(m[2].replace(',', '.')), fmt: { type: 'currency', dec: 2 } };
    const d = dataDinText(s);
    if (d != null) return { v: d, fmt: { type: 'date' } };
    const n = norm(s);
    if (n === 'TRUE') return { v: true };
    if (n === 'FALSE') return { v: false };
    return { v: t };
  }

  function parseFmt(f) {
    if (!f) return null;
    if (typeof f === 'object') return f;
    const [type, dec] = String(f).split(':');
    return { type, dec: dec != null ? +dec : (type === 'currency' || type === 'number' ? 2 : 0) };
  }

  // Afișarea unei valori după formatul celulei
  function formatValoare(v, fmt) {
    if (v === null || v === undefined) return '';
    if (isErr(v)) return v.code;
    if (typeof v === 'boolean') return textLogic(v);
    if (typeof v === 'string') return v;
    const f = fmt || { type: 'general' };
    const z = optiuni.zecimal;
    const cuDec = (x, d) => { const s = rotunjeste(x, d).toFixed(d); return z === ',' ? s.replace('.', ',') : s; };
    switch (f.type) {
      case 'number': return f.mii ? grupeazaMii(rotunjeste(v, f.dec).toFixed(f.dec)) : cuDec(v, f.dec);
      case 'currency': return grupeazaMii(rotunjeste(v, f.dec).toFixed(f.dec)) + ' lei';
      case 'percent': return cuDec(v * 100, f.dec || 0) + '%';
      case 'date': return formatData(v);
      default: return fmtGeneral(v);
    }
  }

  class Workbook {
    constructor(def) {
      def = def || {};
      if (Array.isArray(def)) def = { sheets: def };   // se acceptă și direct lista de foi
      this.sheets = [];
      this.cache = new Map();
      this.calc = new Set();
      this.circular = false;
      const lista = def.sheets && def.sheets.length ? def.sheets : [{ name: 'Foaie1' }];
      for (const s of lista) this.addSheet(s);
    }
    addSheet(s) {
      const sh = {
        name: s.name || 'Foaie' + (this.sheets.length + 1),
        rows: s.rows || 20, cols: s.cols || 8,
        cells: new Map(), widths: Object.assign({}, s.widths || {}),
        hiddenRows: new Set(), protejata: !!s.protejata,
        // elemente „avansate” ale foii (pot veni gata definite din date)
        cf: JSON.parse(JSON.stringify(s.cf || [])),               // formatare condiționată
        validari: JSON.parse(JSON.stringify(s.validari || [])),   // validarea datelor
        diagrame: JSON.parse(JSON.stringify(s.diagrame || [])),   // diagrame
        filtru: s.filtru ? JSON.parse(JSON.stringify(s.filtru)) : null, filtruActiv: false,
        pivoturi: [], subtotal: null, parola: s.parola || ''
      };
      this.sheets.push(sh);
      const si = this.sheets.length - 1;
      if (s.data) {
        s.data.forEach((row, r) => row.forEach((v, c) => {
          if (v !== null && v !== undefined && v !== '') this.setInput(si, r, c, typeof v === 'number' ? String(v) : String(v), true);
        }));
      }
      if (s.cells) for (const a in s.cells) {
        const p = parseAddr(a); if (!p) continue;
        const v = s.cells[a];
        if (v && typeof v === 'object') {
          if (v.v !== undefined) this.setInput(si, p.r, p.c, String(v.v), true);
          const cell = this.cell(si, p.r, p.c, true);
          if (v.fmt) cell.fmt = parseFmt(v.fmt);
          if (v.bold) cell.bold = true;
          if (v.lock === false) cell.deblocata = true;
        } else this.setInput(si, p.r, p.c, String(v), true);
      }
      const peZona = (spec, fn) => {
        for (const z of [].concat(spec || [])) {
          const rg = parseRangeAddr(z); if (!rg) continue;
          for (let r = rg.r1; r <= rg.r2; r++) for (let c = rg.c1; c <= rg.c2; c++) fn(this.cell(si, r, c, true));
        }
      };
      if (s.formats) for (const z in s.formats) peZona(z, (cell) => { cell.fmt = parseFmt(s.formats[z]); });
      peZona(s.bold, (cell) => { cell.bold = true; });
      peZona(s.fill, (cell) => { cell.fill = true; });
      peZona(s.chenar, (cell) => { cell.border = true; });
      peZona(s.deblocate, (cell) => { cell.deblocata = true; });
      if (s.aliniere) for (const z in s.aliniere) peZona(z, (cell) => { cell.align = s.aliniere[z]; });
      // mărește grila dacă datele depășesc dimensiunea declarată
      for (const k of sh.cells.keys()) {
        const [r, c] = k.split(',').map(Number);
        if (r >= sh.rows) sh.rows = r + 1;
        if (c >= sh.cols) sh.cols = c + 1;
      }
      this.cache.clear();
      return si;
    }
    sheetIndex(name) {
      const n = String(name).toLowerCase();
      return this.sheets.findIndex((s) => s.name.toLowerCase() === n);
    }
    cell(si, r, c, create) {
      const sh = this.sheets[si]; if (!sh) return null;
      const k = r + ',' + c;
      let cell = sh.cells.get(k);
      if (!cell && create) { cell = { input: '' }; sh.cells.set(k, cell); }
      return cell || null;
    }
    getInput(si, r, c) { const cell = this.cell(si, r, c); return cell ? cell.input : ''; }
    setInput(si, r, c, text, init) {
      const cell = this.cell(si, r, c, true);
      cell.input = text == null ? '' : String(text);
      cell.ast = undefined; cell.syntax = undefined;
      if (cell.input && cell.input[0] !== '=' && (!cell.fmt || cell.fmt.type === 'general')) {
        const L = literal(cell.input);
        if (L.fmt) cell.fmt = L.fmt;
      }
      this.cache.clear();
    }
    setFormat(si, r, c, fmt) { this.cell(si, r, c, true).fmt = parseFmt(fmt); }
    lastRow(si) {
      let m = 0;
      for (const [k, cell] of this.sheets[si].cells) if (cell.input !== '') m = Math.max(m, +k.split(',')[0]);
      return m;
    }
    // Valoarea calculată a unei celule (cu memorare și detectarea referințelor circulare)
    getValue(si, r, c) {
      const k = si + ':' + r + ',' + c;
      if (this.cache.has(k)) return this.cache.get(k);
      if (this.calc.has(k)) { this.circular = true; return 0; }
      this.calc.add(k);
      let v;
      try { v = this.compute(si, r, c); } finally { this.calc.delete(k); }
      this.cache.set(k, v);
      return v;
    }
    compute(si, r, c) {
      const cell = this.cell(si, r, c);
      if (!cell || cell.input === '') return null;
      if (cell.fmt && cell.fmt.type === 'text') return cell.input;
      if (cell.input[0] === '=' && cell.input.length > 1) {
        if (cell.ast === undefined) {
          try { cell.ast = parse(cell.input.slice(1)); cell.syntax = null; }
          catch (e) { cell.ast = null; cell.syntax = e; }
        }
        if (!cell.ast) return err(E.NAME);
        let v = ev(cell.ast, { wb: this, si, r, c, depth: 0 });
        if (v instanceof Arr) v = v.rows && v.cols ? v.data[0][0] : err(E.VALUE);
        if (v === null) v = 0;
        if (typeof v === 'number' && !isFinite(v)) v = err(E.NUM);
        return v;
      }
      return literal(cell.input).v;
    }
    // Formatul efectiv (formulele cu TODAY/DATE se afișează ca dată)
    getFormat(si, r, c) {
      const cell = this.cell(si, r, c);
      if (!cell) return null;
      if (cell.fmt && cell.fmt.type !== 'general') return cell.fmt;
      if (cell.input && cell.input[0] === '=' && cell.ast) {
        let n = cell.ast;
        if (n.t === 'fn' && FUNCTII_DATA.has(numeCanonic(n.name))) return { type: 'date' };
        if (n.t === 'ref' || (n.t === 'bin' && (n.op === '+' || n.op === '-') && n.a.t === 'ref')) {
          const rr = n.t === 'ref' ? n : n.a;
          const s2 = rr.sheet ? this.sheetIndex(rr.sheet) : si;
          if (s2 >= 0 && !(s2 === si && rr.r === r && rr.c === c)) {
            const f = this.cell(s2, rr.r, rr.c);
            if (f && f.fmt && f.fmt.type !== 'general' && f.fmt.type !== 'text') return f.fmt;
          }
        }
      }
      return cell.fmt || null;
    }
    getDisplay(si, r, c) { return formatValoare(this.getValue(si, r, c), this.getFormat(si, r, c)); }
    recalc() { this.cache.clear(); this.circular = false; }
    clone() {
      const wb = new Workbook({ sheets: [] });
      wb.sheets = this.sheets.map((sh) => {
        const copie = {};
        for (const k in sh) {
          if (k === 'cells' || k === 'hiddenRows') continue;
          copie[k] = sh[k] && typeof sh[k] === 'object' ? JSON.parse(JSON.stringify(sh[k])) : sh[k];
        }
        copie.hiddenRows = new Set(sh.hiddenRows);
        copie.cells = new Map([...sh.cells].map(([k, v]) => [k, Object.assign({}, v, { ast: undefined })]));
        return copie;
      });
      return wb;
    }
    // Tabel 2D cu valorile/formulele (pentru export .xlsx)
    toAOA(si, cuFormule) {
      const sh = this.sheets[si];
      let R = 0, C = 0;
      for (const [k, cell] of sh.cells) if (cell.input !== '') { const [r, c] = k.split(',').map(Number); R = Math.max(R, r + 1); C = Math.max(C, c + 1); }
      const out = [];
      for (let r = 0; r < R; r++) {
        const row = [];
        for (let c = 0; c < C; c++) {
          const cell = this.cell(si, r, c);
          if (!cell || cell.input === '') { row.push(null); continue; }
          if (cuFormule && cell.input[0] === '=') row.push({ f: cell.input.slice(1) });
          else row.push(this.getValue(si, r, c));
        }
        out.push(row);
      }
      return out;
    }
  }

  /* ------------------------------------------------------------------
     6. UTILITARE PENTRU FORMULE
     ------------------------------------------------------------------ */
  // Lista referințelor dintr-o formulă (pentru colorarea celulelor)
  function referinte(formula) {
    const src = String(formula).replace(/^=/, '');
    const off = String(formula).startsWith('=') ? 1 : 0;
    let toks;
    try { toks = tokenize(src).toks; } catch (e) { toks = tokenizeTolerant(src); }
    const out = [];
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.type === 'ref') {
        const nx = toks[i + 1], t2 = toks[i + 2];
        if (nx && nx.type === 'op' && nx.v === ':' && t2 && t2.type === 'ref') {
          out.push({ sheet: t.sheet, r1: Math.min(t.r, t2.r), c1: Math.min(t.c, t2.c), r2: Math.max(t.r, t2.r), c2: Math.max(t.c, t2.c), start: t.start + off, end: t2.end + off });
          i += 2;
        } else out.push({ sheet: t.sheet, r1: t.r, c1: t.c, r2: t.r, c2: t.c, start: t.start + off, end: t.end + off });
      } else if (t.type === 'cols') {
        out.push({ sheet: t.sheet, r1: 0, c1: Math.min(t.c1, t.c2), r2: MAX_ROWS - 1, c2: Math.max(t.c1, t.c2), start: t.start + off, end: t.end + off, fullCol: true });
      }
    }
    return out;
  }
  // Tokenizare „iertătoare” pentru formule în curs de scriere (ex. „=SUM(A1:”)
  function tokenizeTolerant(src) {
    for (let n = src.length; n > 0; n--) {
      try { return tokenize(src.slice(0, n)).toks; } catch (e) { /* continuă */ }
    }
    return [];
  }

  // Mută formula cu dR rânduri și dC coloane (copiere / umplere).
  // Referințele cu $ rămân fixe. Dacă o referință iese din foaie → #REF!
  function deplaseaza(formula, dR, dC) {
    if (!formula || formula[0] !== '=') return formula;
    const src = formula.slice(1);
    let toks;
    try { toks = tokenize(src).toks; } catch (e) { return formula; }
    let out = '', last = 0;
    for (const t of toks) {
      if (t.type !== 'ref' && t.type !== 'cols') continue;
      out += src.slice(last, t.start);
      if (t.type === 'ref') {
        const r = t.absR ? t.r : t.r + dR, c = t.absC ? t.c : t.c + dC;
        out += r < 0 || c < 0 || r >= MAX_ROWS || c >= MAX_COLS ? '#REF!' : t.sheetText + addr(r, c, t.absR, t.absC);
      } else {
        const c1 = t.abs1 ? t.c1 : t.c1 + dC, c2 = t.abs2 ? t.c2 : t.c2 + dC;
        out += c1 < 0 || c2 < 0 ? '#REF!' : t.sheetText + (t.abs1 ? '$' : '') + numToCol(c1) + ':' + (t.abs2 ? '$' : '') + numToCol(c2);
      }
      last = t.end;
    }
    return '=' + out + src.slice(last);
  }

  // Schimbă separatorul formulei, după setările regionale ale calculatorului:
  //   ';' → =ROUND(A1;2) și 0,5   (setări românești)
  //   ',' → =ROUND(A1,2) și 0.5   (setări englezești)
  // Numele funcțiilor rămân mereu în engleză.
  function cuSeparator(formula, sep) {
    if (!formula || formula[0] !== '=') return formula;
    const src = formula.slice(1);
    let toks;
    try { toks = tokenize(src).toks; } catch (e) { return formula; }
    let out = '', last = 0;
    for (const t of toks) {
      let rep = null;
      if (t.type === 'sep') rep = sep;
      else if (t.type === 'num') { const txt = src.slice(t.start, t.end); rep = sep === ';' ? txt.replace('.', ',') : txt.replace(',', '.'); }
      if (rep === null) continue;
      out += src.slice(last, t.start) + rep;
      last = t.end;
    }
    return '=' + out + src.slice(last);
  }

  // Funcțiile folosite într-o formulă (nume canonice, englezești)
  function functiiFolosite(formula) {
    const set = new Set();
    try {
      const walk = (n) => {
        if (!n) return;
        if (n.t === 'fn') { const c = numeCanonic(n.name); set.add(c || n.name.toUpperCase()); n.args.forEach(walk); }
        if (n.a) walk(n.a);
        if (n.b) walk(n.b);
      };
      walk(parse(String(formula).replace(/^=/, '')));
    } catch (e) { /* formulă invalidă */ }
    return set;
  }

  // Verifică sintaxa; întoarce null sau {mesaj, pozitie}
  function verificaSintaxa(formula) {
    try { parse(String(formula).replace(/^=/, '')); return null; }
    catch (e) { return { mesaj: e.message, pozitie: e.pos }; }
  }

  // Evaluează rapid o formulă pe un registru dat, într-o celulă „virtuală”
  function evalueaza(wb, formula, si, r, c) {
    const ast = parse(String(formula).replace(/^=/, ''));
    let v = ev(ast, { wb, si: si || 0, r: r || 0, c: c || 0, depth: 0 });
    if (v instanceof Arr) v = v.data[0][0];
    return v === null ? 0 : v;
  }

  // Compară două rezultate (cu toleranță pentru numere)
  function egale(a, b) {
    if (isErr(a) || isErr(b)) return isErr(a) && isErr(b) && a.code === b.code;
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    return a === b;
  }

  /* ------------------------------------------------------------------
     Inserare / ștergere de rânduri și coloane
     ------------------------------------------------------------------
     Actualizează referințele din formule exact ca Excel:
     • la inserare, referințele de după poziție se mută;
     • la ștergere, referințele către celulele șterse devin #REF!
     axa: 'r' (rânduri) sau 'c' (coloane); n > 0 inserare, n < 0 ștergere
     ------------------------------------------------------------------ */
  function transformaStructura(formula, foaieFormula, foaieTinta, axa, idx, n) {
    if (!formula || formula[0] !== '=') return formula;
    const src = formula.slice(1);
    let toks;
    try { toks = tokenize(src).toks; } catch (e) { return formula; }
    const seAplica = (t) => (t.sheet ? t.sheet.toLowerCase() : foaieFormula.toLowerCase()) === foaieTinta.toLowerCase();
    const k = -n, ultim = idx + k - 1;
    const muta = (x) => (n > 0 ? (x >= idx ? x + n : x) : (x < idx ? x : x > ultim ? x - k : null));
    const mutaInterval = (a, b) => {
      if (n > 0) return [a >= idx ? a + n : a, b >= idx ? b + n : b];
      const na = a < idx ? a : a > ultim ? a - k : idx;
      const nb = b < idx ? b : b > ultim ? b - k : idx - 1;
      return nb < na ? null : [na, nb];
    };
    let out = '', last = 0;
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.type !== 'ref' && t.type !== 'cols') continue;
      if (!seAplica(t)) continue;
      let text, end = t.end;
      const nx = toks[i + 1], t2 = toks[i + 2];
      if (t.type === 'ref' && nx && nx.type === 'op' && nx.v === ':' && t2 && t2.type === 'ref') {
        // zonă A1:B5
        const r1 = Math.min(t.r, t2.r), r2 = Math.max(t.r, t2.r), c1 = Math.min(t.c, t2.c), c2 = Math.max(t.c, t2.c);
        const iv = axa === 'r' ? mutaInterval(r1, r2) : mutaInterval(c1, c2);
        if (!iv) text = '#REF!';
        else {
          const [a, b] = iv;
          const p1 = axa === 'r' ? addr(a, c1, t.absR, t.absC) : addr(r1, a, t.absR, t.absC);
          const p2 = axa === 'r' ? addr(b, c2, t2.absR, t2.absC) : addr(r2, b, t2.absR, t2.absC);
          text = t.sheetText + p1 + ':' + p2;
        }
        end = t2.end; i += 2;
      } else if (t.type === 'ref') {
        const v = muta(axa === 'r' ? t.r : t.c);
        text = v === null ? '#REF!' : t.sheetText + (axa === 'r' ? addr(v, t.c, t.absR, t.absC) : addr(t.r, v, t.absR, t.absC));
      } else {
        if (axa === 'r') continue;
        const iv = mutaInterval(Math.min(t.c1, t.c2), Math.max(t.c1, t.c2));
        text = !iv ? '#REF!' : t.sheetText + (t.abs1 ? '$' : '') + numToCol(iv[0]) + ':' + (t.abs2 ? '$' : '') + numToCol(iv[1]);
      }
      out += src.slice(last, t.start) + text;
      last = end;
    }
    return '=' + out + src.slice(last);
  }

  Workbook.prototype.modificaStructura = function (si, axa, idx, n) {
    const sh = this.sheets[si];
    const nume = sh.name;
    // 1. actualizează formulele din toate foile
    for (const s of this.sheets) {
      for (const cell of s.cells.values()) {
        if (cell.input && cell.input[0] === '=') {
          const nou = transformaStructura(cell.input, s.name, nume, axa, idx, n);
          if (nou !== cell.input) { cell.input = nou; cell.ast = undefined; }
        }
      }
    }
    // 2. mută celulele foii
    const k = -n, ultim = idx + k - 1;
    const noi = new Map();
    for (const [key, cell] of sh.cells) {
      let [r, c] = key.split(',').map(Number);
      let x = axa === 'r' ? r : c;
      if (n > 0) { if (x >= idx) x += n; }
      else { if (x >= idx && x <= ultim) continue; if (x > ultim) x -= k; }
      if (axa === 'r') r = x; else c = x;
      noi.set(r + ',' + c, cell);
    }
    sh.cells = noi;
    if (axa === 'r') sh.rows = Math.max(1, sh.rows + n);
    else {
      sh.cols = Math.max(1, sh.cols + n);
      const w = {};
      for (const L in sh.widths) {
        let c = colToNum(L);
        if (n > 0 && c >= idx) c += n;
        else if (n < 0) { if (c >= idx && c <= ultim) continue; if (c > ultim) c -= k; }
        w[numToCol(c)] = sh.widths[L];
      }
      sh.widths = w;
    }
    this.cache.clear();
  };

  // Redenumește o foaie și actualizează formulele care o folosesc
  Workbook.prototype.redenumesteFoaia = function (si, numeNou) {
    const vechi = this.sheets[si].name;
    for (const s of this.sheets) {
      for (const cell of s.cells.values()) {
        if (!cell.input || cell.input[0] !== '=') continue;
        const src = cell.input.slice(1);
        let toks; try { toks = tokenize(src).toks; } catch (e) { continue; }
        let out = '', last = 0;
        for (const t of toks) {
          if ((t.type === 'ref' || t.type === 'cols') && t.sheet && t.sheet.toLowerCase() === vechi.toLowerCase()) {
            out += src.slice(last, t.start) + quoteSheet(numeNou) + '!';
            last = t.start + t.sheetText.length;
          }
        }
        if (last) { cell.input = '=' + out + src.slice(last); cell.ast = undefined; }
      }
    }
    this.sheets[si].name = numeNou;
    this.cache.clear();
  };

  const api = {
    optiuni, XlError, E, EXPLICATII_ERORI, isErr, err,
    Workbook, parse, tokenize, referinte, deplaseaza, functiiFolosite, verificaSintaxa,
    evalueaza, egale, formatValoare, criteriu, compara, toBool, formatText, literal, numeCanonic, traducere, sugestieFunctie, numeNecunoscute, cuSeparator,
    colToNum, numToCol, addr, parseAddr, parseRangeAddr, quoteSheet,
    dataInSerial, serialInData, formatData, functiiImplementate: () => Object.keys(FN)
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.FormulaEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
