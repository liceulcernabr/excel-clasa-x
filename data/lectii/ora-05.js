/* =====================================================================
   data/lectii/ora-05.js — ORA 5: Funcții de bază
   SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, ROUND
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const NOTE_05 = [
  ['Elev', 'Matematică', 'Informatică', 'Română', 'Engleză', 'Media', 'Media rotunjită'],
  ['Andrei Maria', 9, 10, 8, 9],
  ['Barbu Ștefan', 7, 8, 6, 7],
  ['Constantin Ioana', 10, 10, 9, 10],
  ['Dobre Alexandru', 5, 7, 'abs', 6],
  ['Enache Daria', 8, 9, 9, ''],
  ['Florea Matei', 6, 8, 7, 8],
  ['Gheorghe Ana', 9, 9, 10, 9],
  ['Ionescu Radu', 4, 6, 5, 7]
];
const LAT_05 = { A: 124, B: 86, C: 86, D: 70, E: 70, F: 64, G: 112 };
const FOAIE_05 = (extra) => Object.assign({ name: 'Catalog', rows: 15, cols: 8, data: NOTE_05, bold: 'A1:G1', widths: LAT_05 }, extra || {});

window.DATE_LECTII[5] = {
  nr: 5,
  titlu: 'Funcții de bază',
  durata: 50,
  rezumat: 'O funcție este o formulă gata făcută: îi dai datele, ea face calculul. Cu SUM, AVERAGE, MIN, MAX, COUNT, COUNTA și ROUND calculezi totaluri, medii și extreme pentru orice tabel.',

  obiective: [
    'să scrii corect o funcție: <code>NUME(argumente)</code>;',
    'să folosești [[fn:SUM]], [[fn:AVERAGE]], [[fn:MIN]], [[fn:MAX]];',
    'să alegi între [[fn:COUNT]] (numără numere) și [[fn:COUNTA]] (numără celule completate);',
    'să rotunjești valori cu [[fn:ROUND]] și să explici diferența față de formatare;',
    'să scrii o funcție în interiorul altei funcții (funcții imbricate).'
  ],

  teorie: [
    {
      titlu: 'Ce este o funcție',
      html: `
        <p>O funcție are un <b>nume</b> (în engleză) și, între paranteze, <b>argumente</b> despărțite prin virgulă (sau punct și virgulă, după setările regionale):</p>
        <p class="f f-bloc" data-f="=SUM(B2:B9)"></p>
        <p>Argumentele pot fi zone (<code>B2:B9</code>), celule (<code>B2</code>), numere sau alte funcții.</p>
        <p><b>Cum inserezi o funcție:</b></p>
        <ul>
          <li>o scrii direct. După ce tastezi primele litere, Excel îți propune funcțiile potrivite (tasta [[k:Tab]] o alege);</li>
          <li>apeși butonul <b>fx</b> de lângă bara de formule, care deschide asistentul de funcții;</li>
          <li><b>Însumare automată</b> Σ (<i>AutoSum</i>, [[k:Alt+=]]): Excel scrie singur <code>=SUM(…)</code> pentru numerele de deasupra sau din stânga.</li>
        </ul>
        <div class="nota"><strong>Nume în engleză</strong>În Excel funcțiile se scriu în engleză: [[=SUM(B2:B9)]], nu „SUMĂ”. Un nume greșit dă eroarea #NAME?.</div>`
    },
    {
      titlu: 'SUM, AVERAGE, MIN, MAX',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Funcția</th><th>Ce face</th><th>Exemplu</th></tr>
          <tr><td>[[fn:SUM]]</td><td>adună numerele</td><td>[[=SUM(B2:B9)]] · [[=SUM(B2:E2,10)]]</td></tr>
          <tr><td>[[fn:AVERAGE]]</td><td>media aritmetică</td><td>[[=AVERAGE(B2:E2)]]</td></tr>
          <tr><td>[[fn:MIN]]</td><td>cea mai mică valoare</td><td>[[=MIN(B2:B9)]]</td></tr>
          <tr><td>[[fn:MAX]]</td><td>cea mai mare valoare</td><td>[[=MAX(B2:B9)]]</td></tr>
        </table></div>
        <div class="atentie"><strong>Celule goale și text</strong>Aceste funcții <b>ignoră</b> celulele goale și textul din zonă. Media notelor 8, „abs” și 10 este (8+10)/2 = 9, nu (8+0+10)/3. O celulă care conține <b>0</b> este însă luată în calcul.</div>`
    },
    {
      titlu: 'COUNT, COUNTA, COUNTBLANK',
      html: `
        <table class="tabel">
          <tr><th>Funcția</th><th>Numără</th><th>Pentru B2:B6 = 9, „abs”, gol, 7, 10</th></tr>
          <tr><td>[[fn:COUNT]]</td><td>celulele cu <b>numere</b> (inclusiv datele calendaristice)</td><td>3</td></tr>
          <tr><td>[[fn:COUNTA]]</td><td>celulele <b>nevide</b> (numere, text, erori)</td><td>4</td></tr>
          <tr><td>[[fn:COUNTBLANK]]</td><td>celulele <b>goale</b></td><td>1</td></tr>
        </table>
        <p>Pentru „câți elevi sunt în listă” folosești [[fn:COUNTA]] pe coloana cu nume. Pentru „câte note are elevul” folosești [[fn:COUNT]].</p>`
    },
    {
      titlu: 'ROUND — rotunjirea reală',
      html: `
        <p>[[=ROUND(număr, nr_zecimale)]] schimbă chiar valoarea, nu doar afișarea ca formatul numeric.</p>
        <table class="tabel">
          <tr><th>Formula</th><th>Rezultat</th></tr>
          <tr><td>[[=ROUND(8.456,2)]]</td><td>8,46</td></tr>
          <tr><td>[[=ROUND(8.456,0)]]</td><td>8</td></tr>
          <tr><td>[[=ROUND(8.5,0)]]</td><td>9 (,5 se rotunjește în sus)</td></tr>
          <tr><td>[[=ROUND(1234,-2)]]</td><td>1200 (zecimale negative = la sute)</td></tr>
          <tr><td>[[=ROUNDUP(7.01,0)]] / [[=ROUNDDOWN(7.99,0)]]</td><td>8 / 7</td></tr>
        </table>
        <p>Rotunjești când rezultatul trebuie folosit mai departe cu exact acea valoare. De exemplu, media la purtare se trece în catalog cu 2 zecimale.</p>`
    },
    {
      titlu: 'Funcții imbricate',
      html: `
        <p>O funcție poate fi argumentul altei funcții. Excel calculează întâi funcția din interior:</p>
        <p class="f f-bloc" data-f="=ROUND(AVERAGE(B2:E2),2)"></p>
        <p>Întâi se calculează media notelor, apoi media este rotunjită la 2 zecimale. Numără parantezele: câte deschise, atâtea închise.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: catalogul clasei',
    text: `<p>Încearcă funcțiile pe catalog:</p>
      <ul>
        <li>În B11 scrie <code>=SUM(B2:B9)</code>. Apoi încearcă <code>=AVERAGE(B2:B9)</code>, <code>=MAX(B2:B9)</code>.</li>
        <li>În D11 compară <code>=COUNT(D2:D9)</code> cu <code>=COUNTA(D2:D9)</code>. De ce diferă?</li>
        <li>Scrie <code>=SUMM(B2:B9)</code> sau <code>=MEDIE(B2:B9)</code> ca să vezi eroarea #NAME? și explicația ei.</li>
      </ul>`,
    foi: [FOAIE_05()]
  },

  animatii: [
    {
      id: 'o5-count',
      titlu: 'Ce numără COUNT, COUNTA și AVERAGE',
      grila: { rows: 7, cols: 3, data: [['Nota', '', ''], [9], ['abs'], [''], [7], [10]] },
      pasi: [
        { text: 'Avem 5 celule în zona A2:A6: trei numere, un text („abs”) și o celulă goală.', zona: ['A2:A6'] },
        { text: '[[fn:COUNT]] numără doar <b>numerele</b>.', aprinde: ['A2', 'A5', 'A6'], celule: { B2: '=COUNT(A2:A6)', C2: '=>3' }, mare: 'COUNT = 3' },
        { text: '[[fn:COUNTA]] numără tot ce <b>nu e gol</b>, inclusiv textul.', aprinde: ['A2', 'A3', 'A5', 'A6'], celule: { B3: '=COUNTA(A2:A6)', C3: '=>4' }, mare: 'COUNTA = 4' },
        { text: '[[fn:AVERAGE]] adună numerele și împarte la <b>câte numere sunt</b>: (9+7+10)/3.', aprinde: ['A2', 'A5', 'A6'], celule: { B4: '=AVERAGE(A2:A6)', C4: '=>8,67' }, mare: '26 / 3 = 8,67' },
        { text: 'Dacă în A4 ar fi <b>0</b> în loc de gol, media ar deveni 26/4 = 6,5. Golul și zeroul nu sunt același lucru!', celule: { A4: 0, C4: '=>6,5' }, aprinde: ['A4'], mare: '26 / 4 = 6,5' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o5-medie', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Media fiecărui elev',
      cerinta: 'În <b>F2:F9</b> calculează media notelor fiecărui elev (coloanele B–E) cu funcția [[fn:AVERAGE]].',
      foi: [FOAIE_05()],
      reguli: [{ formula: 'F2:F9', solutie: '=AVERAGE(B2:E2)', functii: ['AVERAGE'] }],
      indicii: ['Zona de note a primului elev este B2:E2.', 'Scrie =AVERAGE(B2:E2) în F2 și copiază în jos. Observă ce se întâmplă cu „abs” și cu celula goală.']
    },
    {
      id: 'o5-round', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Media cu două zecimale',
      cerinta: 'În <b>G2:G9</b> calculează media rotunjită la <b>2 zecimale</b>, folosind [[fn:ROUND]] și [[fn:AVERAGE]] în aceeași formulă (nu folosi coloana F).',
      foi: [FOAIE_05()],
      reguli: [{ formula: 'G2:G9', solutie: '=ROUND(AVERAGE(B2:E2),2)', functii: ['ROUND', 'AVERAGE'] }],
      indicii: ['Funcția AVERAGE este primul argument al lui ROUND.', '=ROUND(AVERAGE(B2:E2),2) — verifică parantezele.']
    },
    {
      id: 'o5-maxmin', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Cea mai mare și cea mai mică notă',
      cerinta: 'În rândul 11 (<b>B11:E11</b>) calculează nota maximă la fiecare disciplină, iar în rândul 12 (<b>B12:E12</b>) nota minimă.',
      foi: [FOAIE_05({ cells: { A11: 'Nota maximă', A12: 'Nota minimă' }, bold: ['A1:G1', 'A11:A12'] })],
      reguli: [{ formula: 'B11:E11', solutie: '=MAX(B2:B9)', functii: ['MAX'] }, { formula: 'B12:E12', solutie: '=MIN(B2:B9)', functii: ['MIN'] }],
      indicii: ['Zona unei discipline este o coloană: B2:B9.', 'Scrie =MAX(B2:B9) în B11 și copiaz-o spre dreapta până la E11.']
    },
    {
      id: 'o5-count', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Câte note și câți elevi',
      cerinta: 'În <b>B13:E13</b> numără câte <b>note</b> (numere) are fiecare disciplină. În <b>B14</b> numără câți <b>elevi</b> sunt în listă (după coloana A).',
      foi: [FOAIE_05({ cells: { A13: 'Nr. note', A14: 'Nr. elevi' }, bold: ['A1:G1', 'A13:A14'] })],
      reguli: [{ formula: 'B13:E13', solutie: '=COUNT(B2:B9)', functii: ['COUNT'] }, { formula: 'B14', solutie: '=COUNTA(A2:A9)', functii: ['COUNTA'] }],
      indicii: ['Notele sunt numere, deci folosești COUNT. „abs” nu este notă.', 'Numele sunt text, deci pentru elevi ai nevoie de COUNTA pe A2:A9.']
    },
    {
      id: 'o5-rez-round', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Rotunjire',
      cerinta: 'Ce rezultat dă formula?', formula: '=ROUND(7.456,1)',
      indicii: ['A doua zecimală (5) decide rotunjirea primei.'],
      explicatie: '7,456 cu o zecimală devine 7,5.'
    },
    {
      id: 'o5-rez-medie', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'Media cu absențe',
      cerinta: 'Ce rezultat dă formula din F5 (rândul lui Dobre Alexandru)?',
      foi: [FOAIE_05()], formula: '=AVERAGE(B5:E5)', celula: 'F5', inaltime: 220,
      indicii: ['Notele lui Dobre sunt 5, 7, „abs”, 6.', '„abs” este text și nu intră în medie.'],
      explicatie: '(5 + 7 + 6) / 3 = 6.'
    },
    {
      id: 'o5-greseala', tip: 'greseala', nivel: 'avansat', puncte: 10,
      titlu: 'Media greșită',
      cerinta: 'Formula de mai jos ar trebui să calculeze media notelor la Română (D2:D9), dar dă un rezultat mai mic decât media reală, pentru că în coloană apare și „abs”. Care funcție este folosită greșit?',
      formula: '=SUM(D2:D9)/COUNTA(D2:D9)', jetoane: ['=', 'SUM', '(D2:D9)', '/', 'COUNTA', '(D2:D9)'], gresit: 'COUNTA', corect: '=SUM(D2:D9)/COUNT(D2:D9)',
      indicii: ['Suma adună doar numerele. La ce împarte formula?'],
      explicatie: 'COUNTA numără și textul „abs”, deci împarte la prea multe valori. Corect: COUNT, sau direct [[=AVERAGE(D2:D9)]].'
    },
    {
      id: 'o5-completare', tip: 'completare', nivel: 'mediu', puncte: 10,
      titlu: 'Completează funcțiile',
      cerinta: 'Formula calculează media notelor din B2:E2, rotunjită la două zecimale.',
      sablon: '={{ROUND}}({{AVERAGE}}(B2:E2),{{2}})',
      indicii: ['Funcția din exterior rotunjește, iar cea din interior face media.']
    },
    {
      id: 'o5-potrivire', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Ce face fiecare funcție',
      cerinta: 'Potrivește funcția cu descrierea ei.',
      perechi: [['SUM', 'Adună numerele dintr-o zonă'], ['AVERAGE', 'Calculează media aritmetică'], ['MAX', 'Cea mai mare valoare'], ['MIN', 'Cea mai mică valoare'], ['COUNT', 'Numără celulele care conțin numere'], ['COUNTA', 'Numără celulele nevide'], ['ROUND', 'Rotunjește la un număr de zecimale']],
      indicii: ['COUNT numără doar numerele; COUNTA numără orice celulă completată.']
    }
  ],

  fisa: {
    titlu: 'Situația școlară la final de semestru',
    timp: 40,
    fisier: 'fisa-05-situatia-scolara.xlsx',
    context: 'Dirigintele are nevoie de câteva statistici pentru ședința cu părinții. Fișierul conține mediile a 12 elevi la 5 discipline. Folosește doar funcții, nu calcule făcute de mână.',
    foi: [{ name: 'Medii', data: [
      ['Elev', 'Matematică', 'Informatică', 'Română', 'Engleză', 'Fizică', 'Media generală', 'Media rotunjită'],
      ['Andrei Maria', 9.5, 10, 8.75, 9.33, 9], ['Barbu Ștefan', 7.25, 8.5, 6.67, 7, 6.5], ['Constantin Ioana', 10, 9.75, 9.5, 10, 9.67],
      ['Dobre Alexandru', 5.5, 7, 6, 6.25, 5], ['Enache Daria', 8.67, 9, 9.25, 8.5, 8], ['Florea Matei', 6.33, 8.25, 7, 8, 7.5],
      ['Gheorghe Ana', 9, 9.5, 10, 9.75, 8.67], ['Ionescu Radu', 4.67, 6.5, 5.25, 7, 5.33], ['Marin Elena', 8.25, 8.75, 9, 8.5, 7.75],
      ['Nistor Vlad', 9.33, 9.67, 8.5, 9, 9.5], ['Popa Bianca', 8, 7.5, 8.33, 9.25, 7], ['Stoica Andrei', 7, 6.75, 7.5, 6.5, 6.25]
    ], widths: { A: 130, G: 110, H: 110 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'În G2:G13 calculează <b>media generală</b> a fiecărui elev cu [[fn:AVERAGE]].', barem: '1p formula corectă; 0,5p copiată pe toată coloana.', solutie: '=AVERAGE(B2:F2)' },
      { nivel: 'baza', puncte: 1.5, text: 'În H2:H13 afișează media generală <b>rotunjită la 2 zecimale</b> cu [[fn:ROUND]].', barem: '1,5p — ROUND(…, 2) aplicat corect.', solutie: '=ROUND(G2,2) sau =ROUND(AVERAGE(B2:F2),2)' },
      { nivel: 'baza', puncte: 1.5, text: 'În rândurile 15–17 calculează, pentru fiecare disciplină, media clasei, media maximă și media minimă.', barem: '0,5p pentru fiecare rând corect.', solutie: '=AVERAGE(B2:B13), =MAX(B2:B13), =MIN(B2:B13)' },
      { nivel: 'mediu', puncte: 1.5, text: 'În J2 afișează numărul de elevi cu [[fn:COUNTA]], iar în J3 numărul de medii generale calculate cu [[fn:COUNT]]. Șterge o medie de la Fizică și observă ce se schimbă.', barem: '0,5p COUNTA; 0,5p COUNT; 0,5p observația (media se calculează din notele rămase).' },
      { nivel: 'mediu', puncte: 1, text: 'În J5 calculează media generală a clasei (din coloana G), rotunjită la 2 zecimale, cu o singură formulă.', barem: '1p =ROUND(AVERAGE(G2:G13),2)' },
      { nivel: 'avansat', puncte: 2, text: 'În J7 calculează <b>diferența</b> dintre cea mai mare și cea mai mică medie generală, iar în J8 suma celor mai mari 3 medii generale, folosind funcția [[fn:LARGE]] (caută în dicționarul de funcții cum funcționează).', barem: '1p =MAX(G2:G13)-MIN(G2:G13); 1p =LARGE(G2:G13,1)+LARGE(G2:G13,2)+LARGE(G2:G13,3)' }
    ]
  }
};
