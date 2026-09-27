/* =====================================================================
   data/lectii/ora-09.js — ORA 9: Funcții de căutare
   VLOOKUP, HLOOKUP, XLOOKUP, INDEX + MATCH
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const PRODUSE_09 = [
  ['Cod', 'Denumire', 'Categorie', 'Preț'],
  ['P01', 'Caiet A4', 'Papetărie', 5.5],
  ['P02', 'Pix cu gel', 'Papetărie', 4],
  ['P03', 'Rucsac', 'Accesorii', 149],
  ['P04', 'Calculator științific', 'Electronice', 89],
  ['P05', 'Stick USB 64 GB', 'Electronice', 39],
  ['P06', 'Penar', 'Accesorii', 25],
  ['P07', 'Set markere', 'Papetărie', 18],
  ['P08', 'Căști', 'Electronice', 120]
];
// Foaia „Comanda”: comanda în A:F, catalogul în H:K, reducerile în M:N, transportul în M8:P9
function foaie09(cols, cells, extra) {
  const comanda = [['Cod', 'Cantitate', 'Denumire', 'Preț', 'Valoare', 'Reducere'], ['P03', 1], ['P01', 12], ['P08', 2], ['P05', 3], ['P07', 4], ['P02', 20]];
  const c = Object.assign({}, cells || {});
  PRODUSE_09.forEach((r, i) => r.forEach((v, j) => { c['HIJK'[j] + (i + 1)] = v; }));
  Object.assign(c, { M1: 'Prag valoare', N1: 'Reducere', M2: 0, N2: '0%', M3: 100, N3: '5%', M4: 250, N4: '10%', M5: 500, N5: '15%',
    M8: 'Zona', N8: 1, O8: 2, P8: 3, M9: 'Transport', N9: 10, O9: 15, P9: 25 });
  return Object.assign({ name: 'Comanda', rows: 14, cols: 16, data: comanda.map((r) => r.slice(0, cols || 6)), cells: c,
    bold: ['A1:F1', 'H1:K1', 'M1:N1', 'M8:M9'], fill: ['H1:K1', 'M1:N1', 'M8:M9'],
    widths: { A: 50, B: 70, C: 140, D: 60, E: 70, F: 70, G: 20, H: 44, I: 140, J: 90, K: 56, L: 20, M: 90, N: 60 } }, extra || {});
}

window.DATE_LECTII[9] = {
  nr: 9,
  titlu: 'Funcții de căutare',
  durata: 50,
  rezumat: 'Scrii codul produsului, iar Excel aduce singur denumirea și prețul din catalog. Înveți VLOOKUP pentru potrivire exactă și aproximativă, HLOOKUP, XLOOKUP și perechea INDEX + MATCH.',

  obiective: [
    'să folosești [[fn:VLOOKUP]] cu potrivire exactă (FALSE) pentru a aduce date dintr-un tabel;',
    'să folosești potrivirea aproximativă (TRUE) pentru praguri, de exemplu la reduceri și calificative;',
    'să folosești [[fn:HLOOKUP]] pentru tabele orizontale;',
    'să folosești [[fn:XLOOKUP]] și combinația [[fn:INDEX]] + [[fn:MATCH]];',
    'să recunoști și să tratezi erorile #N/A și #REF!.'
  ],

  teorie: [
    {
      titlu: 'VLOOKUP — căutare verticală',
      html: `
        <p class="f f-bloc" data-f="=VLOOKUP(valoare_căutată, tabel, nr_coloană, FALSE)"></p>
        <ol>
          <li>caută <b>valoarea</b> în <b>prima coloană</b> a tabelului;</li>
          <li>găsește rândul pe care se află;</li>
          <li>aduce valoarea din coloana cu numărul <b>nr_coloană</b> <i>a tabelului</i> (1 = prima coloană a tabelului, nu coloana A a foii!);</li>
          <li><b>FALSE</b> (sau 0) cere potrivire <b>exactă</b>.</li>
        </ol>
        <p>Exemplu: [[=VLOOKUP(A2,$H$2:$K$9,2,FALSE)]] caută codul din A2 în H2:H9 și aduce denumirea din a doua coloană a tabelului (I).</p>
        <div class="sfat"><strong>$ la tabel</strong>Tabelul în care cauți trebuie blocat cu $, ca să nu „alunece” când copiezi formula în jos.</div>`
    },
    {
      titlu: 'Potrivirea aproximativă — pentru praguri',
      html: `
        <p>Cu <b>TRUE</b> (sau fără al patrulea argument) VLOOKUP caută <b>cea mai mare valoare mai mică sau egală</b> cu cea căutată. Prima coloană a tabelului trebuie să fie <b>sortată crescător</b>.</p>
        <table class="tabel">
          <tr><th>Prag valoare</th><th>Reducere</th></tr>
          <tr><td>0</td><td>0%</td></tr><tr><td>100</td><td>5%</td></tr><tr><td>250</td><td>10%</td></tr><tr><td>500</td><td>15%</td></tr>
        </table>
        <p>Pentru o comandă de 275 lei, [[=VLOOKUP(275,$M$2:$N$5,2,TRUE)]] găsește pragul 250, deci reducerea este 10%. Nu mai ai nevoie de IF-uri imbricate!</p>`
    },
    {
      titlu: 'HLOOKUP și XLOOKUP',
      html: `
        <p>[[fn:HLOOKUP]] funcționează la fel, dar pe orizontală: caută în <b>primul rând</b> și aduce valoarea din rândul cerut.
        [[=HLOOKUP(2,$N$8:$P$9,2,FALSE)]] caută zona 2 și aduce costul transportului.</p>
        <p class="f f-bloc" data-f='=XLOOKUP(valoare, zonă_căutare, zonă_rezultat, "dacă nu găsește")'></p>
        <p>[[fn:XLOOKUP]] (Excel 2021 și Microsoft 365) este mai flexibilă. Caută în orice coloană și aduce din orice coloană, chiar din stânga.
        Folosește implicit potrivirea exactă și are un argument pentru mesajul „nu am găsit”:
        [[=XLOOKUP(A2,$H$2:$H$9,$K$2:$K$9,"cod inexistent")]].</p>`
    },
    {
      titlu: 'INDEX + MATCH',
      html: `
        <p>[[=MATCH(valoare, zonă, 0)]] spune <b>pe ce poziție</b> se află valoarea. [[=INDEX(zonă, poziție)]] aduce elementul de pe o poziție.</p>
        <p>Împreună funcționează în orice versiune de Excel și pot căuta și „spre stânga”:
        [[=INDEX($H$2:$H$9,MATCH("Penar",$I$2:$I$9,0))]] găsește codul (coloana H) după denumire (coloana I), deci returnează P06.</p>`
    },
    {
      titlu: 'Erori frecvente',
      html: `
        <table class="tabel">
          <tr><th>Eroare</th><th>Cauza</th><th>Ce faci</th></tr>
          <tr><td>#N/A</td><td>valoarea nu există în prima coloană (sau are spații în plus, alt tip: text față de număr)</td><td>verifici datele; <code>=IFERROR(VLOOKUP(…),"negăsit")</code></td></tr>
          <tr><td>#REF!</td><td>nr_coloană e mai mare decât numărul de coloane ale tabelului</td><td>numeri din nou coloanele tabelului</td></tr>
          <tr><td>rezultat greșit, fără eroare</td><td>ai uitat FALSE, iar tabelul nu e sortat</td><td>adaugi FALSE pentru potrivire exactă</td></tr>
        </table>`
    }
  ],

  simulator: {
    titlu: 'Atelier: comanda online',
    text: `<p>Comanda este în A:F, iar catalogul în H:K. Încearcă:</p>
      <ul>
        <li>În C2: <code>=VLOOKUP(A2,$H$2:$K$9,2,FALSE)</code> și copiaz-o în jos. Schimbă un cod din coloana A.</li>
        <li>Scrie un cod care nu există (P99) și citește explicația erorii #N/A.</li>
        <li>În D2: <code>=XLOOKUP(A2,$H$2:$H$9,$K$2:$K$9,"?")</code>.</li>
        <li>Scrie o valoare în E2 (de exemplu 275) și în F2 <code>=VLOOKUP(E2,$M$2:$N$5,2,TRUE)</code>.</li>
      </ul>`,
    foi: [foaie09()], inaltime: 360
  },

  animatii: [
    {
      id: 'o9-vlookup',
      titlu: 'Cum caută VLOOKUP (potrivire exactă)',
      grila: { rows: 6, cols: 4, data: [['Cod', 'Denumire', 'Categorie', 'Preț'], ['P01', 'Caiet', 'Papetărie', 5.5], ['P02', 'Pix', 'Papetărie', 4], ['P03', 'Rucsac', 'Accesorii', 149], ['P04', 'Calculator', 'Electronice', 89]] },
      pasi: [
        { text: 'Căutăm prețul produsului <b>P03</b> în tabelul A2:D5. Coloana prețului este a <b>4</b>-a a tabelului.', formula: '=VLOOKUP("P03",A2:D5,4,FALSE)', zona: ['A2:D5'] },
        { text: 'VLOOKUP caută <b>doar în prima coloană</b>. Verifică A2: P01 ≠ P03.', cauta: ['A2'], zona: ['A2:D5'] },
        { text: 'A3: P02 ≠ P03.', cauta: ['A2', 'A3'], zona: ['A2:D5'] },
        { text: 'A4: <b>P03</b>. Am găsit rândul!', gasit: ['A4'], zona: ['A2:D5'] },
        { text: 'Pe același rând se mută la coloana <b>4</b> a tabelului: 1 = A, 2 = B, 3 = C, <b>4 = D</b>.', gasit: ['A4'], aprinde: ['B4', 'C4'], ref0: ['D4'] },
        { text: 'Rezultatul este <b>149</b>. Dacă P03 nu ar fi existat, rezultatul ar fi fost #N/A.', gasit: ['A4', 'D4'], mare: '149' }
      ]
    },
    {
      id: 'o9-aproximativ',
      titlu: 'Potrivirea aproximativă: praguri de reducere',
      grila: { rows: 5, cols: 2, data: [['Prag', 'Reducere'], [0, '0%'], [100, '5%'], [250, '10%'], [500, '15%']] },
      pasi: [
        { text: 'Căutăm reducerea pentru o comandă de <b>275</b> lei.', formula: '=VLOOKUP(275,A2:B5,2,TRUE)', zona: ['A2:B5'] },
        { text: '0 ≤ 275? Da. Merge mai departe.', cauta: ['A2'] },
        { text: '100 ≤ 275? Da. Merge mai departe.', cauta: ['A2', 'A3'] },
        { text: '250 ≤ 275? Da.', cauta: ['A2', 'A3', 'A4'] },
        { text: '500 ≤ 275? <b>Nu</b>. Se oprește și ia ultimul prag potrivit: 250.', gasit: ['A4'], cauta: ['A5'] },
        { text: 'Rezultatul: <b>10%</b>. De aceea prima coloană trebuie să fie sortată crescător.', gasit: ['A4', 'B4'], mare: '10%' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o9-denumire', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Denumirea produsului',
      cerinta: 'În <b>C2:C7</b> adu din catalog (H2:K9) denumirea produsului cu codul din coloana A. Folosește [[fn:VLOOKUP]] cu potrivire exactă.',
      foi: [foaie09()],
      reguli: [{ formula: 'C2:C7', solutie: '=VLOOKUP(A2,$H$2:$K$9,2,FALSE)', functii: ['VLOOKUP'] }],
      indicii: ['Denumirea este în a 2-a coloană a tabelului H2:K9.', 'Blochează tabelul: $H$2:$K$9. Nu uita FALSE.']
    },
    {
      id: 'o9-pret', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Prețul și valoarea',
      cerinta: 'În <b>D2:D7</b> adu prețul din catalog. În <b>E2:E7</b> calculează valoarea (cantitate × preț).',
      foi: [foaie09()],
      reguli: [{ formula: 'D2:D7', solutie: '=VLOOKUP(A2,$H$2:$K$9,4,FALSE)', functii: ['VLOOKUP'] }, { formula: 'E2:E7', solutie: '=B2*D2' }],
      indicii: ['Prețul este în a 4-a coloană a tabelului.', 'Valoarea: =B2*D2.']
    },
    {
      id: 'o9-reducere', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Reducere după valoare',
      cerinta: 'Reducerea depinde de valoarea comenzii (tabelul de praguri M2:N5). În <b>F2:F7</b> adu reducerea potrivită cu VLOOKUP, folosind <b>potrivirea aproximativă</b>.',
      foi: [foaie09(6, { E2: 149, E3: 66, E4: 240, E5: 117, E6: 72, E7: 80 }, { formats: { 'F2:F7': 'percent' } })],
      reguli: [{ formula: 'F2:F7', solutie: '=VLOOKUP(E2,$M$2:$N$5,2,TRUE)', functii: ['VLOOKUP'] }],
      indicii: ['Valoarea căutată este în E2, iar tabelul de praguri este $M$2:$N$5.', 'Ultimul argument este TRUE (sau lipsește): potrivire aproximativă.'],
      explicatie: '149 intră la pragul de 100 (5%), iar 66 la pragul 0 (0%).'
    },
    {
      id: 'o9-index', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Codul după denumire',
      cerinta: 'În <b>B12</b> este scrisă o denumire. În <b>C12</b> găsește <b>codul</b> produsului cu [[fn:INDEX]] și [[fn:MATCH]]. Codul se află în stânga denumirii, deci VLOOKUP nu merge aici.',
      foi: [foaie09(6, { A12: 'Denumire:', B12: 'Penar', C11: 'Cod găsit' })],
      reguli: [{ formula: 'C12', solutie: '=INDEX(H2:H9,MATCH(B12,I2:I9,0))', functii: ['INDEX', 'MATCH'] }],
      indicii: ['MATCH(B12,I2:I9,0) îți dă poziția denumirii în listă.', 'INDEX(H2:H9, poziția) aduce codul de pe aceeași poziție.']
    },
    {
      id: 'o9-xlookup', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'XLOOKUP cu mesaj',
      cerinta: 'În <b>D2:D7</b> adu prețul cu [[fn:XLOOKUP]]. Dacă un cod nu există, afișează textul <b>„cod greșit”</b> (codul P11 din A5 nu există).',
      foi: [foaie09(6, { A5: 'P11' })],
      reguli: [{ formula: 'D2:D7', solutie: '=XLOOKUP(A2,$H$2:$H$9,$K$2:$K$9,"cod greșit")', functii: ['XLOOKUP'] }],
      indicii: ['XLOOKUP(valoare, unde caut, ce aduc, mesaj).', '=XLOOKUP(A2,$H$2:$H$9,$K$2:$K$9,"cod greșit")']
    },
    {
      id: 'o9-hlookup', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Costul transportului',
      cerinta: 'În <b>B12</b> este zona de livrare (1, 2 sau 3). În <b>C12</b> adu costul transportului din tabelul orizontal M8:P9, cu [[fn:HLOOKUP]].',
      foi: [foaie09(6, { A12: 'Zona:', B12: 2, C11: 'Transport' })],
      reguli: [{ formula: 'C12', solutie: '=HLOOKUP(B12,N8:P9,2,FALSE)', functii: ['HLOOKUP'] }],
      indicii: ['Zonele sunt în primul rând al tabelului N8:P9, costurile în al doilea.', '=HLOOKUP(B12,N8:P9,2,FALSE)']
    },
    {
      id: 'o9-rez', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Ce aduce VLOOKUP?',
      cerinta: 'Ce rezultat dă formula (catalogul este în H2:K9)?',
      foi: [foaie09()], formula: '=VLOOKUP("P06",H2:K9,3,FALSE)', inaltime: 230,
      indicii: ['Caută P06 în coloana H și ia a 3-a coloană a tabelului (J).'],
      explicatie: 'P06 este Penarul, din categoria Accesorii.'
    },
    {
      id: 'o9-ref', tip: 'greseala', nivel: 'mediu', puncte: 10,
      titlu: 'Eroarea #REF!',
      cerinta: 'Formula dă #REF!. Care parte este greșită?',
      formula: '=VLOOKUP(A2,$H$2:$K$9,5,FALSE)', jetoane: ['=VLOOKUP(', 'A2', ',', '$H$2:$K$9', ',', '5', ',', 'FALSE', ')'], gresit: '5', corect: '=VLOOKUP(A2,$H$2:$K$9,4,FALSE)',
      indicii: ['Câte coloane are tabelul H:K?'],
      explicatie: 'Tabelul H2:K9 are doar 4 coloane, deci nu există coloana 5.'
    },
    {
      id: 'o9-completare', tip: 'completare', nivel: 'baza', puncte: 5,
      titlu: 'Potrivire exactă',
      cerinta: 'Completează ultimul argument ca VLOOKUP să caute potrivirea <b>exactă</b>.',
      sablon: '=VLOOKUP(A2,$H$2:$K$9,2,{{FALSE|0}})',
      indicii: ['TRUE = aproximativă. Pentru exactă…']
    },
    {
      id: 'o9-grila', tip: 'grila', nivel: 'mediu', puncte: 10,
      titlu: 'Când apare #N/A?',
      cerinta: 'Care sunt cauze posibile pentru #N/A la [[=VLOOKUP(A2,$H$2:$K$9,2,FALSE)]]?',
      variante: ['Codul din A2 nu există în H2:H9', 'Codul are un spațiu în plus („P03 ”)', 'Tabelul are mai puțin de 2 coloane', 'Codul din A2 există de două ori'],
      corect: [0, 1],
      indicii: ['#N/A = negăsit. Ce face ca două coduri să nu fie „identice”?'],
      explicatie: 'Tabel prea îngust dă #REF!, iar un cod duplicat nu dă eroare: se ia prima apariție.'
    }
  ],

  fisa: {
    titlu: 'Magazinul online „Cerna Shop”',
    timp: 45,
    fisier: 'fisa-09-cerna-shop.xlsx',
    context: 'Magazinul are catalogul pe foaia <b>Produse</b> și comenzile pe foaia <b>Comenzi</b>. Pe foaia <b>Reduceri</b> sunt pragurile de reducere, iar pe <b>Transport</b> costurile pe zone. Completează comenzile folosind funcții de căutare.',
    foi: [
      { name: 'Comenzi', data: [['Nr. comandă', 'Cod', 'Cantitate', 'Zona', 'Denumire', 'Categorie', 'Preț', 'Valoare', 'Reducere', 'Transport', 'De plată'],
        [1001, 'P03', 1, 2], [1002, 'P01', 12, 1], [1003, 'P08', 2, 3], [1004, 'P05', 3, 1], [1005, 'P07', 4, 2], [1006, 'P02', 20, 1], [1007, 'P04', 3, 3], [1008, 'P11', 1, 2]], widths: { E: 140 } },
      { name: 'Produse', data: PRODUSE_09, widths: { B: 140 } },
      { name: 'Reduceri', data: [['Prag', 'Reducere'], [0, '0%'], [100, '5%'], [250, '10%'], [500, '15%']] },
      { name: 'Transport', data: [['Zona', 1, 2, 3], ['Cost', 10, 15, 25]] }
    ],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'În E și F adu denumirea și categoria din foaia Produse cu [[fn:VLOOKUP]] (potrivire exactă).', barem: '0,75p fiecare coloană (referință către altă foaie, tabel blocat cu $).', solutie: '=VLOOKUP(B2,Produse!$A$2:$D$9,2,FALSE)' },
      { nivel: 'baza', puncte: 1, text: 'În G adu prețul, iar în H calculează valoarea (cantitate × preț).', barem: '0,5p + 0,5p', solutie: '=VLOOKUP(B2,Produse!$A$2:$D$9,4,FALSE); =C2*G2' },
      { nivel: 'mediu', puncte: 1.5, text: 'Comanda 1008 are un cod inexistent. Modifică formulele din E:H cu [[fn:IFERROR]], astfel încât să apară „cod greșit”, respectiv 0, în loc de #N/A.', barem: '1,5p IFERROR aplicat corect.' },
      { nivel: 'mediu', puncte: 1.5, text: 'În I adu reducerea după valoare (foaia Reduceri) cu potrivire <b>aproximativă</b>.', barem: '1,5p', solutie: '=VLOOKUP(H2,Reduceri!$A$2:$B$5,2,TRUE)' },
      { nivel: 'avansat', puncte: 1.5, text: 'În J adu costul transportului după zonă (foaia Transport) cu [[fn:HLOOKUP]], iar în K calculează suma de plată: valoare − reducere + transport.', barem: '0,75p HLOOKUP; 0,75p formula finală.', solutie: '=HLOOKUP(D2,Transport!$B$1:$D$2,2,FALSE); =H2*(1-I2)+J2' },
      { nivel: 'avansat', puncte: 2, text: 'Pe foaia Comenzi, în N2 scrie o denumire (de exemplu „Căști”), iar în O2 găsește codul ei cu [[fn:INDEX]] + [[fn:MATCH]]. Apoi rezolvă același lucru cu [[fn:XLOOKUP]] în O3.', barem: '1p INDEX+MATCH; 1p XLOOKUP.', solutie: '=INDEX(Produse!A2:A9,MATCH(N2,Produse!B2:B9,0)); =XLOOKUP(N2,Produse!B2:B9,Produse!A2:A9)' }
    ]
  }
};
