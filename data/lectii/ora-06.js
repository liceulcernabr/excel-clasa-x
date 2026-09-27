/* =====================================================================
   data/lectii/ora-06.js — ORA 6: Funcții logice
   IF, AND, OR, NOT, IF imbricat (și IFERROR)
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const CONCURS_06 = [
  ['Elev', 'Clasa', 'Proba 1', 'Proba 2', 'Media', 'Absențe', 'Rezultat', 'Bursă', 'Premiu', 'Calificativ'],
  ['Andrei Maria', '10A', 9, 10, 9.5, 2],
  ['Barbu Ștefan', '10B', 6, 5, 5.5, 14],
  ['Constantin Ioana', '10A', 10, 9, 9.5, 0],
  ['Dobre Alexandru', '10B', 4, 5, 4.5, 21],
  ['Enache Daria', '10A', 8, 10, 9, 5],
  ['Florea Matei', '10B', 7, 8, 7.5, 3],
  ['Gheorghe Ana', '10A', 9, 9, 9, 12],
  ['Ionescu Radu', '10B', 3, 6, 4.5, 8]
];
const LAT_06 = { A: 124, B: 50, C: 60, D: 60, E: 56, F: 64, G: 86, H: 60, I: 70, J: 90 };
const FOAIE_06 = (extra) => Object.assign({ name: 'Concurs', rows: 11, cols: 11, data: CONCURS_06, bold: 'A1:J1', widths: LAT_06 }, extra || {});

window.DATE_LECTII[6] = {
  nr: 6,
  titlu: 'Funcții logice',
  durata: 50,
  rezumat: 'Excel poate lua decizii: „dacă media e cel puțin 5, scrie Promovat, altfel Corigent”. Înveți IF, condițiile compuse cu AND și OR, negația NOT și IF-urile imbricate pentru mai multe variante.',

  obiective: [
    'să scrii condiții (teste logice) care dau TRUE sau FALSE;',
    'să folosești [[fn:IF]] pentru a alege între două rezultate;',
    'să combini condiții cu [[fn:AND]], [[fn:OR]] și [[fn:NOT]];',
    'să construiești un [[fn:IF]] imbricat pentru trei sau mai multe variante (calificative);',
    'să ascunzi erorile cu [[fn:IFERROR]].'
  ],

  teorie: [
    {
      titlu: 'Condiții: TRUE sau FALSE',
      html: `
        <p>O <b>condiție</b> (test logic) este o comparație al cărei rezultat este <b>TRUE</b> (adevărat) sau <b>FALSE</b> (fals):</p>
        <table class="tabel">
          <tr><th>Condiția</th><th>Dacă E2 = 7,5</th></tr>
          <tr><td>[[=E2>=5]]</td><td>TRUE</td></tr>
          <tr><td>[[=E2<5]]</td><td>FALSE</td></tr>
          <tr><td>[[=E2=10]]</td><td>FALSE</td></tr>
          <tr><td>[[=E2<>10]]</td><td>TRUE</td></tr>
          <tr><td>[[=B2="10A"]]</td><td>compară un text, scris între ghilimele</td></tr>
        </table>`
    },
    {
      titlu: 'Funcția IF',
      html: `
        <p class="f f-bloc" data-f="=IF(test_logic, valoare_dacă_adevărat, valoare_dacă_fals)"></p>
        <p>Exemplu: [[=IF(E2>=5,"Promovat","Corigent")]]. Dacă media din E2 este cel puțin 5, apare „Promovat”, altfel „Corigent”.</p>
        <ul>
          <li>Textele se scriu între <b>ghilimele drepte</b> "…". Fără ghilimele apare eroarea #NAME?.</li>
          <li>Rezultatele pot fi și numere sau calcule: [[=IF(F2>10,E2-1,E2)]] scade un punct la peste 10 absențe.</li>
          <li>[[=IF(A2="","",A2*2)]] lasă celula goală dacă A2 e goală.</li>
        </ul>`
    },
    {
      titlu: 'AND, OR, NOT — condiții compuse',
      html: `
        <table class="tabel">
          <tr><th>Funcția</th><th>Este TRUE când…</th><th>Exemplu</th></tr>
          <tr><td>[[fn:AND]]</td><td><b>toate</b> condițiile sunt adevărate</td><td>[[=AND(E2>=9,F2<10)]]</td></tr>
          <tr><td>[[fn:OR]]</td><td><b>cel puțin una</b> este adevărată</td><td>[[=OR(C2=10,D2=10)]]</td></tr>
          <tr><td>[[fn:NOT]]</td><td>condiția este <b>falsă</b></td><td>[[=NOT(B2="10A")]]</td></tr>
        </table>
        <p>Se folosesc de obicei în interiorul lui IF: [[=IF(AND(E2>=9,F2<10),"Da","Nu")]].</p>
        <div class="atentie"><strong>Nu scrie 5 &lt;= E2 &lt;= 10</strong>În Excel, o dublă inegalitate nu funcționează ca la matematică. Scrii [[=AND(E2>=5,E2<=10)]].</div>`
    },
    {
      titlu: 'IF imbricat — mai mult de două variante',
      html: `
        <p>Pentru calificativele FB (≥ 9), B (≥ 7), S (≥ 5) și I (sub 5) pui un IF în locul lui „valoare_dacă_fals”:</p>
        <p class="f f-bloc" data-f='=IF(E2>=9,"FB",IF(E2>=7,"B",IF(E2>=5,"S","I")))'></p>
        <p>Excel verifică pe rând și se oprește la <b>prima</b> condiție adevărată. De aceea ordinea contează: începi cu pragul cel mai mare.
        Dacă ai începe cu E2>=5, o medie de 9,5 ar primi „S”.</p>
        <p>În versiunile noi de Excel există și [[=IFS(E2>=9,"FB",E2>=7,"B",E2>=5,"S",TRUE,"I")]]. IF imbricat funcționează însă în toate versiunile.</p>`
    },
    {
      titlu: 'IFERROR — un mesaj în loc de eroare',
      html: `
        <p>[[=IFERROR(valoare, valoare_dacă_eroare)]] afișează rezultatul normal sau, dacă acesta este o eroare, valoarea de rezervă.</p>
        <p>Exemplu: [[=IFERROR(C2/D2,"—")]] afișează „—” în loc de #DIV/0! când D2 este 0.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: concursul de informatică',
    text: `<p>Încearcă pe tabelul concursului:</p>
      <ul>
        <li>În G2 scrie <code>=E2>=5</code> și observă TRUE/FALSE. Apoi schimbă în <code>=IF(E2>=5,"Admis","Respins")</code>.</li>
        <li>Scrie <code>=IF(E2>=5,Admis,"Respins")</code> (fără ghilimele) și citește explicația erorii.</li>
        <li>În H2 încearcă <code>=AND(E2>=9,F2<10)</code>. Modifică absențele din F2 și urmărește cum se schimbă rezultatul.</li>
      </ul>`,
    foi: [FOAIE_06()]
  },

  animatii: [
    {
      id: 'o6-imbricat',
      titlu: 'Cum evaluează Excel un IF imbricat',
      grila: { rows: 3, cols: 3, data: [['Media', 'Calificativ', ''], [7.5]] },
      pasi: [
        { text: 'Media din A2 este <b>7,5</b>. Formula din B2:', formula: '=IF(A2>=9,"FB",IF(A2>=7,"B",IF(A2>=5,"S","I")))', aprinde: ['A2'] },
        { text: 'Primul test: <b>7,5 &gt;= 9</b>? FALS. Excel trece la „valoare_dacă_fals”, adică la al doilea IF.', mare: '7,5 >= 9 → FALSE', ref0: ['A2'] },
        { text: 'Al doilea test: <b>7,5 &gt;= 7</b>? ADEVĂRAT. Excel ia rezultatul „B” și se oprește aici.', mare: '7,5 >= 7 → TRUE → "B"', ref0: ['A2'] },
        { text: 'Al treilea IF nici nu mai este evaluat. În B2 apare <b>B</b>.', celule: { B2: 'B' }, gasit: ['B2'] },
        { text: 'Dacă ordinea ar fi fost inversă (întâi A2&gt;=5), orice medie peste 5 ar fi primit „S”. De aceea pragurile se testează de la cel mai mare la cel mai mic.', mare: 'ordinea contează!' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o6-rezultat', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Admis sau respins',
      cerinta: 'În <b>G2:G9</b> afișează „Admis” dacă media (coloana E) este cel puțin 5, altfel „Respins”.',
      foi: [FOAIE_06()],
      reguli: [{ formula: 'G2:G9', solutie: '=IF(E2>=5,"Admis","Respins")', functii: ['IF'] }],
      indicii: ['Testul logic este E2>=5.', '=IF(E2>=5,"Admis","Respins") — textele între ghilimele.']
    },
    {
      id: 'o6-bursa', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Bursa de merit',
      cerinta: 'Un elev primește bursă („Da”) dacă are media <b>cel puțin 9</b> <u>și</u> <b>mai puțin de 10 absențe</b>. Altfel se afișează „Nu”. Completează <b>H2:H9</b>.',
      foi: [FOAIE_06()],
      reguli: [{ formula: 'H2:H9', solutie: '=IF(AND(E2>=9,F2<10),"Da","Nu")', functii: ['IF', 'AND'] }],
      indicii: ['Ambele condiții trebuie îndeplinite simultan: funcția AND.', '=IF(AND(E2>=9,F2<10),"Da","Nu")'],
      explicatie: 'Gheorghe Ana are media 9, dar 12 absențe, deci nu primește bursă.'
    },
    {
      id: 'o6-premiu', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Premiu pentru o probă perfectă',
      cerinta: 'Un elev primește „Premiu” dacă a luat <b>10</b> la proba 1 <u>sau</u> la proba 2. Altfel celula rămâne goală (""). Completează <b>I2:I9</b>.',
      foi: [FOAIE_06()],
      reguli: [{ formula: 'I2:I9', solutie: '=IF(OR(C2=10,D2=10),"Premiu","")', functii: ['IF', 'OR'] }],
      indicii: ['E suficientă o singură condiție adevărată: funcția OR.', 'O celulă „goală” se scrie ca două ghilimele: ""']
    },
    {
      id: 'o6-calificativ', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Calificativul',
      cerinta: 'În <b>J2:J9</b> scrie calificativul după medie: <b>FB</b> (≥ 9), <b>B</b> (≥ 7), <b>S</b> (≥ 5), <b>I</b> (sub 5). Folosește IF imbricat.',
      foi: [FOAIE_06()],
      reguli: [{ formula: 'J2:J9', solutie: '=IF(E2>=9,"FB",IF(E2>=7,"B",IF(E2>=5,"S","I")))', functii: ['IF'] }],
      indicii: ['Începe cu pragul cel mai mare: IF(E2>=9,"FB", …).', 'În locul lui „…” pune următorul IF: IF(E2>=7,"B", …).', 'Formula completă are trei IF-uri și trei paranteze închise la final.']
    },
    {
      id: 'o6-rez-and', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'Ce afișează?',
      cerinta: 'Ce afișează formula pentru elevul de pe rândul 7 (Florea Matei: media 7,5, absențe 3)?',
      foi: [FOAIE_06()], formula: '=IF(AND(E7>=7,F7<=5),"Diplomă","—")', celula: 'K7', inaltime: 200,
      variante: ['Diplomă', '—', 'TRUE', '#NAME?'],
      indicii: ['Verifică pe rând: 7,5 ≥ 7? 3 ≤ 5?'],
      explicatie: 'Ambele condiții sunt adevărate, deci AND dă TRUE și IF alege „Diplomă”.'
    },
    {
      id: 'o6-rez-not', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Negația',
      cerinta: 'Ce rezultat dă formula (rândul 3, Barbu Ștefan, clasa 10B)?',
      foi: [FOAIE_06()], formula: '=NOT(B3="10A")', celula: 'K3', inaltime: 180,
      variante: ['TRUE', 'FALSE', '10B', '#VALUE!'],
      indicii: ['B3="10A" este FALSE pentru 10B. Ce face NOT cu FALSE?'],
      explicatie: 'B3="10A" este FALSE, iar NOT(FALSE) = TRUE.'
    },
    {
      id: 'o6-greseala', tip: 'greseala', nivel: 'baza', puncte: 10,
      titlu: 'Eroarea #NAME?',
      cerinta: 'Formula dă eroarea #NAME?. Apasă pe bucata greșită.',
      formula: '=IF(E2>=5,Promovat,"Corigent")', jetoane: ['=IF(', 'E2', '>=', '5', ',', 'Promovat', ',', '"Corigent"', ')'], gresit: 'Promovat', corect: '=IF(E2>=5,"Promovat","Corigent")',
      indicii: ['Compară cele două texte din formulă.'],
      explicatie: 'Textul „Promovat” nu este între ghilimele, iar Excel îl caută ca nume de funcție sau zonă.'
    },
    {
      id: 'o6-completare', tip: 'completare', nivel: 'mediu', puncte: 10,
      titlu: 'Nota între 1 și 10',
      cerinta: 'Completează formula care afișează „validă” dacă nota din A2 este între 1 și 10 (inclusiv), altfel „invalidă”.',
      sablon: '=IF({{AND}}(A2>={{1}},A2<={{10}}),"validă","invalidă")',
      indicii: ['Ambele condiții trebuie să fie adevărate.']
    },
    {
      id: 'o6-ordine', tip: 'grila', nivel: 'avansat', puncte: 10,
      titlu: 'Ordinea condițiilor',
      cerinta: 'Ce calificativ primește media <b>9,5</b> cu formula <code>=IF(E2>=5,"S",IF(E2>=7,"B",IF(E2>=9,"FB","I")))</code>?',
      variante: ['S', 'FB', 'B', 'I'], corect: 0,
      indicii: ['Excel se oprește la prima condiție adevărată.'],
      explicatie: '9,5 ≥ 5 este adevărat chiar de la primul test, deci rezultatul e „S”. Pragurile trebuie testate de la cel mai mare.'
    },
    {
      id: 'o6-potrivire', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Funcții logice',
      cerinta: 'Potrivește funcția cu momentul în care este adevărată (sau cu ce face).',
      perechi: [['AND', 'toate condițiile sunt adevărate'], ['OR', 'cel puțin o condiție este adevărată'], ['NOT', 'inversează TRUE în FALSE și invers'], ['IF', 'alege între două rezultate după o condiție'], ['IFERROR', 'înlocuiește o eroare cu altă valoare']],
      indicii: ['AND = „și”, OR = „sau”.']
    }
  ],

  fisa: {
    titlu: 'Rezultatele concursului de informatică',
    timp: 40,
    fisier: 'fisa-06-concurs.xlsx',
    context: 'La faza pe școală a concursului de informatică au participat 12 elevi. Fișierul conține punctajele la cele două probe (maximum 100 de puncte fiecare) și numărul de absențe. Toate rezultatele se obțin cu funcții logice.',
    foi: [{ name: 'Concurs', data: [
      ['Elev', 'Clasa', 'Proba 1', 'Proba 2', 'Total', 'Absențe', 'Calificare', 'Premiu', 'Distincție', 'Bonus', 'Punctaj final'],
      ['Andrei Maria', '10A', 92, 88, '', 2], ['Barbu Ștefan', '10B', 45, 61, '', 14], ['Constantin Ioana', '10A', 100, 95, '', 0],
      ['Dobre Alexandru', '10B', 38, 42, '', 21], ['Enache Daria', '10A', 78, 100, '', 5], ['Florea Matei', '10B', 66, 72, '', 3],
      ['Gheorghe Ana', '10A', 85, 90, '', 12], ['Ionescu Radu', '10B', 25, 58, '', 8], ['Marin Elena', '10A', 70, 69, '', 1],
      ['Nistor Vlad', '10B', 95, 97, '', 4], ['Popa Bianca', '10A', 55, 48, '', 6], ['Stoica Andrei', '10B', 100, 60, '', 9]
    ], widths: { A: 130 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'În E2:E13 calculează totalul celor două probe.', barem: '1p', solutie: '=C2+D2' },
      { nivel: 'baza', puncte: 1.5, text: 'În G2:G13 afișează „Calificat” dacă totalul este cel puțin 140, altfel „Necalificat”.', barem: '1p IF corect; 0,5p texte scrise exact.', solutie: '=IF(E2>=140,"Calificat","Necalificat")' },
      { nivel: 'mediu', puncte: 1.5, text: 'În H2:H13 afișează „Premiu” pentru elevii care au <b>ambele</b> probe de cel puțin 85 de puncte; ceilalți — celulă goală.', barem: '1p AND; 0,5p celula goală „”.', solutie: '=IF(AND(C2>=85,D2>=85),"Premiu","")' },
      { nivel: 'mediu', puncte: 1.5, text: 'În I2:I13 afișează „Punctaj maxim” dacă elevul a obținut 100 la <b>cel puțin o</b> probă.', barem: '1p OR; 0,5p rezultat corect pentru toți.', solutie: '=IF(OR(C2=100,D2=100),"Punctaj maxim","")' },
      { nivel: 'avansat', puncte: 1.5, text: 'În J2:J13 calculează un bonus: 10 puncte pentru 0–5 absențe, 5 puncte pentru 6–10 absențe și 0 pentru peste 10 (IF imbricat).', barem: '1p IF imbricat corect; 0,5p pragurile corecte.', solutie: '=IF(F2<=5,10,IF(F2<=10,5,0))' },
      { nivel: 'avansat', puncte: 2, text: 'În K2:K13 calculează punctajul final = total + bonus, dar doar pentru elevii calificați; pentru ceilalți afișează „—”. Apoi, în M2, calculează procentul elevilor calificați din total, folosind [[fn:IFERROR]] ca să nu apară eroare dacă tabelul e gol.', barem: '1p punctaj final; 1p IFERROR corect.', solutie: '=IF(G2="Calificat",E2+J2,"—"); în M2: =IFERROR(COUNTIF(G2:G13,"Calificat")/COUNTA(A2:A13),0)' }
    ]
  }
};
