/* =====================================================================
   data/lectii/ora-07.js — ORA 7: Funcții condiționale
   COUNTIF(S), SUMIF(S), AVERAGEIF(S) (și MAXIFS / MINIFS)
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const ATLETISM_07 = [
  ['Nume', 'Clasa', 'Gen', 'Probă', 'Puncte'],
  ['Andrei Maria', '10A', 'F', 'Viteză', 86],
  ['Barbu Ștefan', '10B', 'M', 'Cros', 72],
  ['Constantin Ioana', '10A', 'F', 'Lungime', 91],
  ['Dobre Alexandru', '10C', 'M', 'Viteză', 64],
  ['Enache Daria', '10B', 'F', 'Cros', 78],
  ['Florea Matei', '10A', 'M', 'Lungime', 95],
  ['Gheorghe Ana', '10C', 'F', 'Viteză', 81],
  ['Ionescu Radu', '10B', 'M', 'Viteză', 58],
  ['Marin Elena', '10C', 'F', 'Lungime', 88],
  ['Nistor Vlad', '10A', 'M', 'Cros', 69],
  ['Popa Bianca', '10B', 'F', 'Lungime', 74],
  ['Stoica Andrei', '10C', 'M', 'Cros', 90],
  ['Tudor Irina', '10A', 'F', 'Cros', 83],
  ['Vasile Darius', '10B', 'M', 'Lungime', 77],
  ['Zamfir Sara', '10C', 'F', 'Viteză', 66]
];
const LAT_07 = { A: 124, B: 50, C: 44, D: 70, E: 60, F: 30, G: 150, H: 76, I: 76 };
const FOAIE_07 = (extra) => Object.assign({ name: 'Atletism', rows: 20, cols: 10, data: ATLETISM_07, bold: 'A1:E1', widths: LAT_07 }, extra || {});

window.DATE_LECTII[7] = {
  nr: 7,
  titlu: 'Funcții condiționale',
  durata: 50,
  rezumat: 'Numeri, aduni și faci media doar pentru rândurile care îndeplinesc o condiție: câți elevi din 10A, câte puncte au strâns fetele, care e media la cros. Cu una sau mai multe condiții.',

  obiective: [
    'să scrii criterii: valoare exactă, comparație („>=80”), text cu caractere de înlocuire („*escu”), criteriu luat dintr-o celulă;',
    'să folosești [[fn:COUNTIF]] și [[fn:COUNTIFS]];',
    'să folosești [[fn:SUMIF]] și [[fn:SUMIFS]], observând ordinea diferită a argumentelor;',
    'să folosești [[fn:AVERAGEIF]] și [[fn:AVERAGEIFS]];',
    'să construiești un tabel rezumat cu o singură formulă copiată.'
  ],

  teorie: [
    {
      titlu: 'Criteriile',
      html: `
        <p>Criteriul spune <b>ce rânduri se iau în calcul</b>. Se scrie între ghilimele, cu excepția numerelor simple și a referințelor.</p>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Criteriul</th><th>Înseamnă</th></tr>
          <tr><td><code>"10A"</code></td><td>egal cu textul 10A (majusculele nu contează)</td></tr>
          <tr><td><code>90</code> sau <code>"90"</code></td><td>egal cu 90</td></tr>
          <tr><td><code>"&gt;=80"</code></td><td>mai mare sau egal cu 80</td></tr>
          <tr><td><code>"&lt;&gt;Cros"</code></td><td>diferit de „Cros”</td></tr>
          <tr><td><code>"*escu"</code></td><td>se termină cu „escu” (* = oricâte caractere)</td></tr>
          <tr><td><code>"?a*"</code></td><td>a doua literă este „a” (? = exact un caracter)</td></tr>
          <tr><td><code>H2</code></td><td>egal cu valoarea din celula H2</td></tr>
          <tr><td><code>"&gt;="&amp;H1</code></td><td>mai mare sau egal cu valoarea din H1 (comparația se lipește de celulă cu &amp;)</td></tr>
          <tr><td><code>""</code> / <code>"&lt;&gt;"</code></td><td>celule goale / celule completate</td></tr>
        </table></div>`
    },
    {
      titlu: 'COUNTIF și COUNTIFS',
      html: `
        <p class="f f-bloc" data-f='=COUNTIF(zonă, criteriu)'></p>
        <p>[[=COUNTIF(B2:B16,"10A")]] numără câți elevi sunt din 10A. [[=COUNTIF(E2:E16,">=80")]] numără punctajele de cel puțin 80.</p>
        <p class="f f-bloc" data-f='=COUNTIFS(zonă1, criteriu1, zonă2, criteriu2, …)'></p>
        <p>Cu mai multe perechi zonă–criteriu se numără rândurile care îndeplinesc <b>toate</b> condițiile (ȘI):
        [[=COUNTIFS(C2:C16,"F",E2:E16,">=80")]] numără fetele cu cel puțin 80 de puncte. Zonele trebuie să aibă aceeași mărime.</p>`
    },
    {
      titlu: 'SUMIF și SUMIFS — atenție la ordine',
      html: `
        <p class="f f-bloc" data-f='=SUMIF(zonă_criteriu, criteriu, zonă_sumă)'></p>
        <p class="f f-bloc" data-f='=SUMIFS(zonă_sumă, zonă_criteriu1, criteriu1, …)'></p>
        <div class="atentie"><strong>Ordinea diferă!</strong>La [[fn:SUMIF]] zona de adunat e <b>ultima</b>, la [[fn:SUMIFS]] e <b>prima</b>. La fel diferă și [[fn:AVERAGEIF]] față de [[fn:AVERAGEIFS]].</div>
        <p>Exemple: [[=SUMIF(B2:B16,"10A",E2:E16)]] este totalul punctelor clasei 10A.
        [[=SUMIFS(E2:E16,B2:B16,"10A",C2:C16,"F")]] este totalul fetelor din 10A.</p>`
    },
    {
      titlu: 'AVERAGEIF, MAXIFS și un tabel rezumat',
      html: `
        <p>[[=AVERAGEIF(D2:D16,"Cros",E2:E16)]] este media punctelor la cros. [[=MAXIFS(E2:E16,C2:C16,"M")]] este cel mai mare punctaj al băieților (Excel 2019 și mai nou).</p>
        <p><b>Tabel rezumat:</b> scrii clasele în H2:H4 și în I2 formula [[=COUNTIF($B$2:$B$16,H2)]], pe care o copiezi în jos.
        Zona datelor are $, ca să nu se deplaseze, iar criteriul H2 e relativ și devine H3, H4.</p>
        <div class="sfat"><strong>Condiții SAU</strong>Pentru „10A <b>sau</b> 10B” aduni două rezultate: [[=COUNTIF(B2:B16,"10A")+COUNTIF(B2:B16,"10B")]].</div>`
    }
  ],

  simulator: {
    titlu: 'Atelier: campionatul de atletism',
    text: `<p>Încearcă funcțiile pe rezultatele campionatului:</p>
      <ul>
        <li><code>=COUNTIF(D2:D16,"Cros")</code> · <code>=COUNTIF(E2:E16,">85")</code> · <code>=COUNTIF(A2:A16,"*escu*")</code></li>
        <li><code>=SUMIF(C2:C16,"F",E2:E16)</code> · <code>=AVERAGEIF(B2:B16,"10C",E2:E16)</code></li>
        <li>Scrie un prag în H1 (de exemplu 80) și în H2 <code>=COUNTIF(E2:E16,">="&H1)</code>. Schimbă pragul și urmărește rezultatul.</li>
      </ul>`,
    foi: [FOAIE_07()]
  },

  animatii: [
    {
      id: 'o7-countif',
      titlu: 'Cum numără COUNTIF',
      grila: { rows: 8, cols: 3, data: [['Clasa', '', ''], ['10A'], ['10B'], ['10A'], ['10C'], ['10B'], ['10A']] },
      pasi: [
        { text: 'Formula: [[=COUNTIF(A2:A7,"10A")]]. Excel parcurge zona celulă cu celulă.', zona: ['A2:A7'] },
        { text: 'A2 = 10A → se potrivește. Număr: 1', gasit: ['A2'], mare: '1' },
        { text: 'A3 = 10B → nu se potrivește.', gasit: ['A2'], cauta: ['A3'], mare: '1' },
        { text: 'A4 = 10A → se potrivește. Număr: 2', gasit: ['A2', 'A4'], mare: '2' },
        { text: 'A5 = 10C, A6 = 10B → nu se potrivesc.', gasit: ['A2', 'A4'], cauta: ['A5', 'A6'], mare: '2' },
        { text: 'A7 = 10A → se potrivește. Rezultat final: <b>3</b>.', gasit: ['A2', 'A4', 'A7'], celule: { C2: '=>3' }, mare: 'COUNTIF = 3' },
        { text: 'SUMIF face la fel, dar în loc să numere, <b>adună</b> valorile de pe aceleași rânduri dintr-o altă coloană.', gasit: ['A2', 'A4', 'A7'], mare: 'SUMIF → adună' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o7-countif', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Câți din 10A?',
      cerinta: 'În <b>H2</b> numără câți participanți sunt din clasa <b>10A</b>.',
      foi: [FOAIE_07({ cells: { G2: 'Participanți din 10A:' } })],
      reguli: [{ formula: 'H2', solutie: '=COUNTIF(B2:B16,"10A")', functii: ['COUNTIF'] }],
      indicii: ['Zona este coloana Clasa (B2:B16), criteriul este "10A".']
    },
    {
      id: 'o7-countifs', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Fete cu punctaj mare',
      cerinta: 'În <b>H3</b> numără câte <b>fete</b> au obținut <b>cel puțin 80</b> de puncte.',
      foi: [FOAIE_07({ cells: { G3: 'Fete cu ≥ 80 puncte:' } })],
      reguli: [{ formula: 'H3', solutie: '=COUNTIFS(C2:C16,"F",E2:E16,">=80")', functii: ['COUNTIFS'] }],
      indicii: ['Sunt două condiții, deci COUNTIFS.', 'Perechile sunt: C2:C16 cu "F" și E2:E16 cu ">=80".']
    },
    {
      id: 'o7-sumif', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Punctele clasei 10B',
      cerinta: 'În <b>H4</b> calculează <b>totalul punctelor</b> obținute de clasa <b>10B</b>.',
      foi: [FOAIE_07({ cells: { G4: 'Total puncte 10B:' } })],
      reguli: [{ formula: 'H4', solutie: '=SUMIF(B2:B16,"10B",E2:E16)', functii: ['SUMIF'] }],
      indicii: ['SUMIF(zona cu clase, criteriu, zona cu puncte).', '=SUMIF(B2:B16,"10B",E2:E16)']
    },
    {
      id: 'o7-averageif', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Media băieților',
      cerinta: 'În <b>H5</b> calculează media punctelor obținute de <b>băieți</b> (M), rotunjită la o zecimală.',
      foi: [FOAIE_07({ cells: { G5: 'Media băieților:' } })],
      reguli: [{ formula: 'H5', solutie: '=ROUND(AVERAGEIF(C2:C16,"M",E2:E16),1)', functii: ['AVERAGEIF', 'ROUND'] }],
      indicii: ['AVERAGEIF are aceeași ordine ca SUMIF.', 'Pune AVERAGEIF în interiorul lui ROUND(…,1).']
    },
    {
      id: 'o7-rezumat', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Tabel rezumat pe clase',
      cerinta: 'Completează tabelul rezumat: în <b>H8:H10</b> numărul de participanți pentru clasa din G, iar în <b>I8:I10</b> totalul punctelor. Scrie câte o formulă în H8 și I8 și copiaz-o în jos.',
      foi: [FOAIE_07({ cells: { G7: 'Clasa', H7: 'Participanți', I7: 'Total puncte', G8: '10A', G9: '10B', G10: '10C' }, bold: ['A1:E1', 'G7:I7'] })],
      reguli: [
        { formula: 'H8:H10', solutie: '=COUNTIF($B$2:$B$16,G8)', functii: ['COUNTIF'], indiciuRobust: 'Criteriul trebuie să fie celula G8 (nu textul "10A").' },
        { formula: 'I8:I10', solutie: '=SUMIF($B$2:$B$16,G8,$E$2:$E$16)', functii: ['SUMIF'] }
      ],
      indicii: ['Criteriul nu se mai scrie între ghilimele: este celula G8.', 'Zonele cu date trebuie să rămână fixe la copiere: $B$2:$B$16.']
    },
    {
      id: 'o7-rez', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Câte punctaje peste 85?',
      cerinta: 'Ce rezultat dă formula?',
      foi: [FOAIE_07()], formula: '=COUNTIF(E2:E16,">85")', inaltime: 220,
      indicii: ['Numără doar valorile strict mai mari decât 85.'],
      explicatie: '86, 91, 95, 88, 90 → 5 punctaje.'
    },
    {
      id: 'o7-greseala', tip: 'greseala', nivel: 'avansat', puncte: 10,
      titlu: 'Argumente inversate',
      cerinta: 'Formula ar trebui să adune punctele clasei 10A, dar dă 0. Apasă pe cele <b>două</b> argumente puse în locul greșit.',
      formula: '=SUMIF(E2:E16,"10A",B2:B16)', jetoane: ['=SUMIF(', 'E2:E16', ',', '"10A"', ',', 'B2:B16', ')'], gresit: ['E2:E16', 'B2:B16'], corect: '=SUMIF(B2:B16,"10A",E2:E16)',
      indicii: ['În care coloană se caută „10A”? Pe care coloană o aduni?'],
      explicatie: 'La SUMIF, întâi vine zona în care se verifică criteriul (clasele, B), apoi criteriul, apoi zona de adunat (punctele, E).'
    },
    {
      id: 'o7-completare', tip: 'completare', nivel: 'mediu', puncte: 10,
      titlu: 'Criteriu cu comparație',
      cerinta: 'Completează formula care numără punctajele de <b>cel puțin 80</b> din E2:E16.',
      sablon: '=COUNTIF(E2:E16,{{">=80"}})',
      indicii: ['Comparația se scrie între ghilimele, cu tot cu semn.']
    },
    {
      id: 'o7-wildcard', tip: 'grila', nivel: 'mediu', puncte: 5,
      titlu: 'Caractere de înlocuire',
      cerinta: 'Ce criteriu numără numele de familie care se termină cu „escu” (Ionescu, Popescu…)?',
      variante: ['"*escu"', '"escu*"', '"?escu"', '"=escu"'], corect: 0,
      indicii: ['* înlocuiește oricâte caractere.'],
      explicatie: '„*escu” = orice text urmat de „escu”. „?escu” ar însemna un singur caracter înainte.'
    }
  ],

  fisa: {
    titlu: 'Campionatul școlar de atletism',
    timp: 40,
    fisier: 'fisa-07-atletism.xlsx',
    context: 'Profesorul de sport a centralizat rezultatele campionatului școlar. Folosește funcții condiționale pentru statistici. Criteriile care se pot schimba se scriu în celule separate.',
    foi: [{ name: 'Rezultate', data: ATLETISM_07.concat([
      ['Albu Cezar', '10C', 'M', 'Lungime', 62], ['Bratu Denisa', '10A', 'F', 'Viteză', 94], ['Cazacu Tudor', '10B', 'M', 'Viteză', 80],
      ['Dinu Alexia', '10C', 'F', 'Cros', 70], ['Ene Mihnea', '10A', 'M', 'Viteză', 73]
    ]), widths: { A: 130 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'Numără câți participanți sunt în total și câți la proba de <b>Viteză</b>.', barem: '0,5p COUNTA; 1p COUNTIF.', solutie: '=COUNTA(A2:A21); =COUNTIF(D2:D21,"Viteză")' },
      { nivel: 'baza', puncte: 1.5, text: 'Calculează totalul punctelor obținute de <b>fete</b> și media punctelor obținute la <b>Cros</b>.', barem: '0,75p SUMIF; 0,75p AVERAGEIF.', solutie: '=SUMIF(C2:C21,"F",E2:E21); =AVERAGEIF(D2:D21,"Cros",E2:E21)' },
      { nivel: 'mediu', puncte: 2, text: 'Numără câți <b>băieți din 10C</b> au participat și câte punctaje sunt <b>între 70 și 89</b> (inclusiv).', barem: '1p COUNTIFS cu două criterii text; 1p COUNTIFS pe aceeași coloană cu ">=70" și "<=89".', solutie: '=COUNTIFS(B2:B21,"10C",C2:C21,"M"); =COUNTIFS(E2:E21,">=70",E2:E21,"<=89")' },
      { nivel: 'mediu', puncte: 2, text: 'Construiește un tabel rezumat pe clase (10A, 10B, 10C) cu: număr de participanți, total puncte, media punctelor. Folosește câte <b>o singură formulă</b> pe coloană, copiată în jos.', barem: '0,5p pentru fiecare coloană corectă; 0,5p referințe absolute corecte.' },
      { nivel: 'avansat', puncte: 2, text: 'Scrie în L1 un prag (de exemplu 85) și în L2 numărul de punctaje <b>peste prag</b>, cu un criteriu construit din celulă (<code>"&gt;"&amp;L1</code>). Apoi calculează cel mai bun punctaj al fetelor cu [[fn:MAXIFS]] și numărul elevilor al căror nume de familie se termină cu „escu”.', barem: '1p criteriul cu &; 0,5p MAXIFS; 0,5p "*escu*"/"*escu".', solutie: '=COUNTIF(E2:E21,">"&L1); =MAXIFS(E2:E21,C2:C21,"F"); =COUNTIF(A2:A21,"*escu *")' }
    ]
  }
};
