/* =====================================================================
   data/lectii/ora-01.js — ORA 1: Interfața Excel
   ---------------------------------------------------------------------
   Marcaje care pot fi folosite în texte:
     [[=SUM(A1:A5)]]  formulă (se afișează în EN sau RO, după comutator)
     [[fn:VLOOKUP]]   numele funcției în ambele limbi
     [[k:Ctrl+C]]     combinație de taste
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

// Catalogul clasei — folosit în exemple, exerciții și fișa de lucru
const CATALOG_01 = [
  ['Nr.', 'Nume', 'Prenume', 'Data nașterii', 'Localitate', 'Media sem. I', 'Bursier'],
  [1, 'Andrei', 'Maria', '14.03.2010', 'Brăila', 9.45, 'TRUE'],
  [2, 'Barbu', 'Ștefan', '02.11.2009', 'Brăila', 7.8, 'FALSE'],
  [3, 'Constantin', 'Ioana', '23.06.2010', 'Chiscani', 9.9, 'TRUE'],
  [4, 'Dobre', 'Alexandru', '30.01.2010', 'Brăila', 6.95, 'FALSE'],
  [5, 'Enache', 'Daria', '11.09.2010', 'Vădeni', 8.6, 'FALSE'],
  [6, 'Florea', 'Matei', '05.05.2010', 'Brăila', 8.15, 'FALSE'],
  [7, 'Gheorghe', 'Ana', '19.12.2009', 'Tichilești', 9.2, 'TRUE'],
  [8, 'Ionescu', 'Radu', '27.07.2010', 'Brăila', 7.35, 'FALSE'],
  [9, 'Marin', 'Elena', '08.02.2010', 'Baldovinești', "'8,75", 'FALSE'],
  [10, 'Nistor', 'Vlad', '16.10.2010', 'Brăila', 9.05, 'TRUE'],
  [11, 'Popa', 'Bianca', '21.04.2010', 'Brăila', 8.4, 'FALSE'],
  [12, 'Stoica', 'Andrei', '03.08.2010', 'Chiscani', 7.65, 'FALSE']
];
const LATIMI_CATALOG_01 = { A: 44, B: 96, C: 90, D: 104, E: 100, F: 96, G: 72 };

window.DATE_LECTII[1] = {
  nr: 1,
  titlu: 'Interfața Excel',
  durata: 50,
  rezumat: 'Registrul, foile de calcul, celulele și zonele — și cum „înțelege” Excel ce scrii într-o celulă: număr, text, dată, valoare logică sau formulă.',

  obiective: [
    'să recunoști elementele ferestrei Excel: panglica, caseta de nume, bara de formule, etichetele foilor, bara de stare;',
    'să explici diferența dintre un <b>registru</b> (fișierul) și o <b>foaie de calcul</b>;',
    'să scrii adresa oricărei celule și a oricărei zone (de exemplu C4 sau B2:D5);',
    'să selectezi celule și zone cu mouse-ul și cu tastatura;',
    'să recunoști tipurile de date: număr, text, dată calendaristică, valoare logică, formulă;',
    'să te deplasezi rapid prin foaie folosind tastatura.'
  ],

  teorie: [
    {
      titlu: 'Registrul și foile de calcul',
      html: `
        <p>Un fișier Excel se numește <b>registru</b> (în engleză <i>workbook</i>). Extensia lui este <code>.xlsx</code>
        (sau <code>.xlsm</code> dacă are macrocomenzi și <code>.xls</code> pentru versiunile foarte vechi).</p>
        <p>Un registru conține una sau mai multe <b>foi de calcul</b> (<i>worksheets</i>). Etichetele lor apar în partea de jos a
        ferestrei: <i>Foaie1</i>, <i>Foaie2</i>… (în engleză <i>Sheet1</i>).</p>
        <div class="definitie"><strong>Pe scurt</strong>Registrul este caietul, iar foile de calcul sunt paginile lui.</div>
        <p>Cu foile poți face câteva operații. Apeși pe <b>+</b> pentru o foaie nouă, faci <b>dublu-clic</b> pe etichetă ca s-o
        redenumești și <b>tragi</b> eticheta ca s-o muți. Din <b>clic dreapta</b> o poți șterge, o poți copia sau îi poți colora eticheta.</p>`
    },
    {
      titlu: 'Celula și adresa ei',
      html: `
        <p>Foaia de calcul este o grilă. <b>Coloanele</b> sunt notate cu litere (A, B, C … Z, AA, AB … până la <b>XFD</b>, adică 16.384 de coloane).
        <b>Rândurile</b> sunt numerotate de la 1 la <b>1.048.576</b>.</p>
        <p>O <b>celulă</b> este intersecția dintre o coloană și un rând. <b>Adresa</b> ei este formată din litera coloanei urmată de numărul rândului:
        <mark>C4</mark> este celula din coloana C, rândul 4.</p>
        <div class="atentie"><strong>Atenție la ordine</strong>Întâi litera, apoi cifra. <code>4C</code> nu este o adresă, dar <code>C4</code> este.</div>
        <p><b>Celula activă</b> este celula selectată, cea cu chenar îngroșat. Adresa ei apare în <b>caseta de nume</b> (stânga-sus), iar conținutul
        ei apare în <b>bara de formule</b>. În colțul din dreapta-jos al chenarului se află un pătrățel, <b>ghidajul de umplere</b>, pe care îl vei folosi la ora 3.</p>`
    },
    {
      titlu: 'Zone de celule',
      html: `
        <p>O <b>zonă</b> (<i>range</i>) este un grup dreptunghiular de celule. Se scrie cu adresa colțului din <b>stânga-sus</b>, semnul <b>:</b>
        și adresa colțului din <b>dreapta-jos</b>. De exemplu, <mark>B2:D5</mark>.</p>
        <p>Numărul de celule al unei zone este <b>rânduri × coloane</b>. Zona B2:D5 are 4 rânduri (2, 3, 4, 5) și 3 coloane (B, C, D), deci 4 × 3 = 12 celule.</p>
        <table class="tabel">
          <tr><th>Cum selectezi</th><th>Ce faci</th></tr>
          <tr><td>o zonă</td><td>apeși pe prima celulă și tragi până la ultima; sau clic pe prima, apoi [[k:Shift]] + clic pe ultima; sau [[k:Shift]] + săgeți</td></tr>
          <tr><td>o coloană întreagă</td><td>clic pe litera coloanei (zona se scrie <code>C:C</code>)</td></tr>
          <tr><td>un rând întreg</td><td>clic pe numărul rândului (zona se scrie <code>3:3</code>)</td></tr>
          <tr><td>zone separate</td><td>ții apăsat [[k:Ctrl]] în timp ce selectezi</td></tr>
          <tr><td>toată foaia</td><td>[[k:Ctrl+A]] sau clic pe colțul dintre antete</td></tr>
        </table>
        <div class="sfat"><strong>Folosește bara de stare</strong>Când selectezi mai multe celule cu numere, în partea de jos a ferestrei apar
        <b>Medie</b>, <b>Număr</b> și <b>Sumă</b>. Afli rapid totalul, fără nicio formulă.</div>`
    },
    {
      titlu: 'Elementele ferestrei Excel',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Element</th><th>La ce folosește</th></tr>
          <tr><td><b>Panglica</b> (<i>Ribbon</i>)</td><td>Comenzile, grupate pe file: <i>Pornire</i> (Home), <i>Inserare</i> (Insert), <i>Aspect pagină</i> (Page Layout),
            <i>Formule</i> (Formulas), <i>Date</i> (Data), <i>Revizuire</i> (Review), <i>Vizualizare</i> (View).</td></tr>
          <tr><td><b>Caseta de nume</b> (<i>Name Box</i>)</td><td>Arată adresa celulei active. Dacă scrii aici o adresă (de ex. <code>K20</code>) și apeși [[k:Enter]], ajungi direct la ea.</td></tr>
          <tr><td><b>Bara de formule</b> (<i>Formula Bar</i>, <i>fx</i>)</td><td>Arată conținutul real al celulei active. Dacă celula are o formulă, aici vezi formula, iar în celulă vezi rezultatul.</td></tr>
          <tr><td><b>Antetele</b> de coloană și de rând</td><td>Literele de sus și numerele din stânga. Un clic pe ele selectează coloana sau rândul.</td></tr>
          <tr><td><b>Etichetele foilor</b></td><td>Trec de la o foaie la alta. Aici adaugi, redenumești sau ștergi foi.</td></tr>
          <tr><td><b>Bara de stare</b> (<i>Status Bar</i>)</td><td>Arată informații despre selecție (Sumă, Medie, Număr), modul de lucru și zoom-ul.</td></tr>
        </table></div>
        <p>Simulatorul din această pagină are aceleași elemente: caseta de nume, bara de formule (<i>fx</i>), antetele, etichetele foilor și bara de stare.</p>`
    },
    {
      titlu: 'Tipuri de date',
      html: `
        <p>Ce scrii într-o celulă este interpretat automat de Excel. Tipul de date se vede după <b>alinierea implicită</b>:</p>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Tip</th><th>Exemple</th><th>Aliniere implicită</th><th>Observații</th></tr>
          <tr><td><b>Număr</b></td><td>15 · 3,75 · -2 · 25%</td><td>dreapta</td><td>Se poate folosi în calcule.</td></tr>
          <tr><td><b>Text</b></td><td>Brăila · 10A · Nota finală · 10 buc.</td><td>stânga</td><td>Orice conține litere. „10 buc.” este text și nu mai poate fi adunat!</td></tr>
          <tr><td><b>Dată calendaristică</b></td><td>15.09.2025</td><td>dreapta</td><td>Pentru Excel, o dată este un număr: numărul de zile de la 1 ianuarie 1900.</td></tr>
          <tr><td><b>Valoare logică</b></td><td>TRUE · FALSE</td><td>centru</td><td>Rezultatul comparațiilor, de exemplu [[=A1>5]].</td></tr>
          <tr><td><b>Formulă</b></td><td>[[=B2+C2]] · [[=SUM(B2:B10)]]</td><td>după rezultat</td><td>Începe întotdeauna cu <b>=</b>. În celulă vezi rezultatul, iar în bara de formule vezi formula.</td></tr>
        </table></div>
        <div class="atentie"><strong>Virgulă sau punct?</strong>Cu setări românești, Excel folosește <b>virgula</b> pentru zecimale (3,75), iar în formule argumentele se despart cu <b>;</b>.
        Cu setări în engleză se folosește punctul (3.75), iar argumentele se despart cu <b>,</b>. Simulatorul acceptă ambele variante, iar butonul <b>a,b</b> din antet schimbă felul în care sunt afișate formulele pe site.</div>
        <div class="nota"><strong>Funcțiile se scriu în engleză</strong>Chiar dacă meniurile Excel sunt în română, numele funcțiilor din formule sunt în engleză: [[=SUM(B2:B10)]], nu „SUMĂ”. Pe site vei vedea lângă fiecare funcție și traducerea ei, ca să înțelegi ce face, de exemplu [[fn:SUM]].</div>
        <div class="sfat"><strong>Truc</strong>Un <b>apostrof</b> pus în față obligă Excel să păstreze conținutul ca text. De exemplu, <code>'0745123456</code> își păstrează zeroul din față.</div>`
    },
    {
      titlu: 'Deplasarea rapidă cu tastatura',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Taste</th><th>Efect</th></tr>
          <tr><td>săgeți</td><td>o celulă în direcția săgeții</td></tr>
          <tr><td>[[k:Enter]] / [[k:Shift+Enter]]</td><td>confirmă și coboară / urcă o celulă</td></tr>
          <tr><td>[[k:Tab]] / [[k:Shift+Tab]]</td><td>confirmă și merge la dreapta / stânga</td></tr>
          <tr><td>[[k:Ctrl]] + săgeată</td><td>sare la capătul zonei cu date</td></tr>
          <tr><td>[[k:Ctrl+Home]]</td><td>merge în celula A1</td></tr>
          <tr><td>[[k:F2]]</td><td>modifică celula activă fără să ștergi ce era în ea</td></tr>
          <tr><td>[[k:Esc]]</td><td>renunță la modificarea în curs</td></tr>
          <tr><td>[[k:Delete]]</td><td>șterge conținutul celulelor selectate</td></tr>
          <tr><td>[[k:Ctrl+Z]] / [[k:Ctrl+Y]]</td><td>anulează / reface ultima acțiune</td></tr>
        </table></div>`
    }
  ],

  simulator: {
    titlu: 'Atelier liber',
    text: `<p>Explorează simulatorul, fiindcă nu poți strica nimic, iar [[k:Ctrl+Z]] anulează orice. Câteva lucruri de încercat:</p>
      <ul>
        <li>Scrie <code>K20</code> în caseta de nume (stânga-sus) și apasă [[k:Enter]].</li>
        <li>Selectează mediile din coloana F. Privește bara de stare de jos: de ce <b>Număr</b> arată 11, deși sunt 12 elevi? (Uită-te atent la alinierea mediei Elenei.)</li>
        <li>Pe foaia <i>Explorare</i>, scrie pe rând <code>25</code>, <code>Brăila</code>, <code>15.09.2025</code>, <code>TRUE</code>, <code>10 buc.</code> și <code>=5+3</code>. Observă alinierea și ce scrie în bara de stare despre fiecare celulă.</li>
        <li>Fă dublu-clic pe eticheta unei foi ca s-o redenumești. Apasă <b>+</b> pentru o foaie nouă.</li>
      </ul>`,
    inaltime: 360,
    foi: [
      { name: 'Catalog', rows: 16, cols: 9, data: CATALOG_01, widths: LATIMI_CATALOG_01, bold: 'A1:G1', fill: 'A1:G1', formats: { 'F2:F13': 'number:2' } },
      { name: 'Explorare', rows: 16, cols: 8 }
    ]
  },

  animatii: [
    {
      id: 'o1-adresa',
      titlu: 'Cum se formează adresa unei celule',
      grila: { rows: 6, cols: 5, data: [] },
      pasi: [
        { text: 'Coloanele sunt notate cu <b>litere</b>: A, B, C, D, E…', antete: ['A', 'B', 'C', 'D', 'E'] },
        { text: 'Rândurile sunt notate cu <b>numere</b>: 1, 2, 3…', antete: ['1', '2', '3', '4', '5', '6'] },
        { text: 'Alegem <b>coloana C</b>…', antete: ['C'], zona: ['C1:C6'] },
        { text: '…și <b>rândul 4</b>.', antete: ['C', '4'], zona: ['C1:C6', 'A4:E4'] },
        { text: 'Celula aflată la intersecția lor are adresa <b>C4</b>: litera coloanei, apoi numărul rândului.', antete: ['C', '4'], aprinde: ['C4'], mare: 'C4', celule: { C4: 'aici' } },
        { text: 'Ordinea contează: întâi litera, apoi cifra. <b>C4</b> este o adresă corectă, iar <b>4C</b> nu este.', aprinde: ['C4'], mare: 'C4 ✓   4C ✗' },
        { text: 'Încă un exemplu: coloana <b>E</b> și rândul <b>2</b> dau celula <b>E2</b>.', antete: ['E', '2'], aprinde: ['E2'], mare: 'E2', celule: { C4: '', E2: 'aici' } }
      ]
    },
    {
      id: 'o1-zona',
      titlu: 'Cum se scrie o zonă și câte celule are',
      grila: { rows: 6, cols: 5, data: [] },
      pasi: [
        { text: 'O <b>zonă</b> este un dreptunghi de celule vecine.', zona: ['B2:D4'] },
        { text: 'Colțul din <b>stânga-sus</b> al zonei este celula <b>B2</b>.', zona: ['B2:D4'], ref0: ['B2'] },
        { text: 'Colțul din <b>dreapta-jos</b> al zonei este celula <b>D4</b>.', zona: ['B2:D4'], ref0: ['B2'], ref1: ['D4'] },
        { text: 'Zona se scrie cu cele două colțuri despărțite de <b>două puncte</b>.', zona: ['B2:D4'], ref0: ['B2'], ref1: ['D4'], mare: 'B2:D4' },
        { text: 'Câte celule are? <b>3 rânduri</b> (2, 3, 4) × <b>3 coloane</b> (B, C, D) = <b>9 celule</b>.', zona: ['B2:D4'], antete: ['B', 'C', 'D', '2', '3', '4'], mare: '3 × 3 = 9' },
        { text: 'Altă zonă: <b>A1:A6</b> este o bucată de coloană cu 6 rânduri × 1 coloană = <b>6 celule</b>.', zona: ['A1:A6'], antete: ['A'], mare: 'A1:A6 → 6 celule' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o1-celula', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Găsește celula',
      cerinta: 'Selectează celula care conține <b>data nașterii</b> elevei <b>Constantin Ioana</b>, apoi apasă <b>Verifică</b>.',
      foi: [{ name: 'Catalog', rows: 14, cols: 7, data: CATALOG_01, widths: LATIMI_CATALOG_01, bold: 'A1:G1', formats: { 'F2:F13': 'number:2' } }],
      reguli: [{ selectie: 'D4' }],
      inaltime: 260, toolbar: false,
      indicii: ['Caută rândul Ioanei (coloana B conține numele de familie).', 'Datele de naștere sunt în coloana D. Ioana este pe rândul 4.'],
      solutieText: 'Celula <b>D4</b>: coloana D (Data nașterii), rândul 4 (Constantin Ioana).'
    },
    {
      id: 'o1-zona', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Selectează o zonă',
      cerinta: 'Selectează zona <b>B3:E6</b>. Câte celule are? Verifică-te în bara de stare de jos.',
      foi: [{ name: 'Foaie1', rows: 10, cols: 7 }],
      reguli: [{ selectie: 'B3:E6' }],
      inaltime: 260, toolbar: false,
      indicii: ['Apasă pe B3, ține apăsat butonul mouse-ului și trage până la E6.', 'Sau: clic pe B3, apoi [[k:Shift]] + clic pe E6. În caseta de nume trebuie să apară B3:E6.'],
      solutieText: 'Clic pe B3 și tragere până la E6. Zona are 4 rânduri × 4 coloane = 16 celule.'
    },
    {
      id: 'o1-potrivire', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Elementele ferestrei',
      cerinta: 'Potrivește fiecare element al ferestrei Excel cu descrierea lui.',
      perechi: [
        ['Registru', 'Fișierul Excel (.xlsx), care poate avea mai multe foi.'],
        ['Foaie de calcul', 'O „pagină” a fișierului, formată din rânduri și coloane.'],
        ['Celulă', 'Intersecția dintre o coloană și un rând, de exemplu C4.'],
        ['Zonă', 'Un dreptunghi de celule, de exemplu B2:D5.'],
        ['Caseta de nume', 'Arată adresa celulei active.'],
        ['Bara de formule', 'Arată conținutul real al celulei active (de exemplu formula).'],
        ['Bara de stare', 'Arată Suma, Media și Numărul pentru celulele selectate.']
      ],
      indicii: ['Începe cu perechile de care ești sigur: „Celulă” și „Zonă” au exemple de adrese.', 'Caseta de nume este în stânga-sus, bara de formule e lângă ea (fx), iar bara de stare e jos.']
    },
    {
      id: 'o1-tipuri', tip: 'clasificare', nivel: 'mediu', puncte: 10,
      titlu: 'Ce tip de date este?',
      cerinta: 'Așază fiecare conținut de celulă în categoria potrivită. Gândește-te cum l-ar interpreta Excel.',
      categorii: [
        { nume: 'Număr', elemente: ['2025', '9,50', '-12', '25%'] },
        { nume: 'Text', elemente: ['Brăila', '10A', 'Nota finală', '10 buc.'] },
        { nume: 'Dată', elemente: ['15.09.2025', '01.06.2026'] },
        { nume: 'Valoare logică', elemente: ['TRUE', 'FALSE'] },
        { nume: 'Formulă', elemente: ['=A1+B1', '=SUM(B2:B5)'] }
      ],
      indicii: ['Orice începe cu = este o formulă.', 'Dacă apare o literă sau o unitate de măsură („buc.”), Excel o tratează ca text. 25% este un număr (0,25).'],
      explicatie: 'Numerele se aliniază la dreapta, textul la stânga. „10 buc.” pare un număr, dar pentru Excel este text și nu poate fi adunat.'
    },
    {
      id: 'o1-introducere', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Introdu primele date',
      cerinta: 'Completează <b>rândul 2</b> cu datele primei excursii: destinația <b>Sinaia</b>, prețul <b>350</b>, data plecării <b>15.05.2026</b> și confirmarea <b>TRUE</b>. Apasă [[k:Tab]] după fiecare valoare.',
      foi: [{ name: 'Excursie', rows: 8, cols: 6, data: [['Destinație', 'Preț (lei)', 'Data plecării', 'Confirmat']], bold: 'A1:D1', widths: { A: 110, B: 90, C: 110, D: 90 } }],
      selecteaza: 'A2',
      reguli: [
        { valoare: 'A2', egal: 'Sinaia', tipDate: 'text' },
        { valoare: 'B2', egal: 350, tipDate: 'numar', faraFormula: true, mesaj: 'scrie doar numărul 350 (fără „lei”).' },
        { valoare: 'C2', egal: '15.05.2026', tipDate: 'data', mesaj: 'scrie data sub forma 15.05.2026.' },
        { valoare: 'D2', egal: true, tipDate: 'logic' }
      ],
      inaltime: 220,
      indicii: ['Scrie „Sinaia” în A2 și apasă [[k:Tab]]: cursorul trece în B2.', 'Data se scrie cu puncte: 15.05.2026. Dacă a fost recunoscută ca dată, se aliniază la dreapta.'],
      solutieText: 'A2: Sinaia · B2: 350 · C2: 15.05.2026 · D2: TRUE. Textul se aliniază la stânga, numărul și data la dreapta, iar valoarea logică în centru.'
    },
    {
      id: 'o1-rezultat', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Prima formulă',
      cerinta: 'În celula D2 se scrie formula de mai jos. Ce număr va afișa celula?',
      foi: [{ name: 'Rechizite', rows: 4, cols: 4, data: [['Produs', 'Cantitate', 'Preț', 'Total'], ['Caiet', 3, 4.5]], bold: 'A1:D1' }],
      formula: '=B2*C2', celula: 'D2', inaltime: 150,
      indicii: ['Formula înmulțește conținutul celulei B2 cu cel al celulei C2.', 'B2 conține 3, iar C2 conține 4,5.'],
      explicatie: '3 × 4,5 = 13,5. Semnul * înseamnă înmulțire.'
    },
    {
      id: 'o1-greseala', tip: 'greseala', nivel: 'mediu', puncte: 10,
      titlu: 'Adresa greșită',
      cerinta: 'Formula de mai jos adună trei celule, dar una dintre adrese nu este validă. Apasă pe ea.',
      formula: '=A1+4C+B12',
      jetoane: ['=', 'A1', '+', '4C', '+', 'B12'],
      gresit: '4C', corect: '=A1+C4+B12',
      indicii: ['O adresă corectă începe cu litera coloanei.', 'Uită-te la ordinea literelor și a cifrelor în fiecare adresă.'],
      explicatie: '„4C” are cifra înaintea literei. Adresa corectă este <b>C4</b>.'
    },
    {
      id: 'o1-completare', tip: 'completare', nivel: 'mediu', puncte: 10,
      titlu: 'Scrie zona',
      cerinta: 'Completează formula care adună toate celulele din dreptunghiul cu colțul stânga-sus <b>B2</b> și colțul dreapta-jos <b>D4</b>.',
      sablon: '=SUM({{B2}}{{:}}{{D4}})',
      indicii: ['O zonă se scrie „colț stânga-sus”, un semn, apoi „colț dreapta-jos”.', 'Semnul dintre cele două colțuri este două puncte ( : ).'],
      explicatie: 'Zona B2:D4 conține 9 celule (3 rânduri × 3 coloane).'
    },
    {
      id: 'o1-ordonare', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Salvează registrul',
      cerinta: 'Pune în ordine pașii pentru a salva registrul în folderul <i>Documente</i>, cu numele <b>Catalog_10A</b>.',
      pasi: [
        'Deschide fila <b>Fișier</b> (<i>File</i>).',
        'Alege <b>Salvare ca</b> (<i>Save As</i>).',
        'Alege locația: folderul <b>Documente</b>.',
        'Scrie numele fișierului: <b>Catalog_10A</b>.',
        'Verifică tipul: <b>Registru de lucru Excel (*.xlsx)</b>.',
        'Apasă butonul <b>Salvare</b> (<i>Save</i>).'
      ],
      indicii: ['Totul începe din fila Fișier.', 'Numele și tipul se aleg înainte de apăsarea butonului Salvare.']
    },
    {
      id: 'o1-foi', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Organizează foile',
      cerinta: 'Redenumește foaia <i>Foaie1</i> în <b>Catalog</b>. Apoi adaugă o foaie nouă și numește-o <b>Absențe</b>.',
      foi: [{ name: 'Foaie1', rows: 8, cols: 6, data: [['Nume', 'Media']] }],
      permiteFoi: true, toolbar: false, inaltime: 180,
      reguli: [
        { numeFoaie: 'Catalog', foaie: 0 },
        { nrFoi: 2 },
        { custom: (wb) => wb.sheets.some((s) => s.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === 'absente') ? null : 'Nu găsesc o foaie numită „Absențe”. Apasă + pentru o foaie nouă și redenumește-o.' }
      ],
      indicii: ['Fă dublu-clic pe eticheta „Foaie1” de jos, scrie noul nume și apasă [[k:Enter]].', 'Butonul <b>+</b> de lângă etichete adaugă o foaie. Apoi redenumește-o la fel, cu dublu-clic.'],
      solutieText: 'Dublu-clic pe „Foaie1” → Catalog → Enter. Clic pe + → dublu-clic pe foaia nouă → Absențe → Enter.'
    },
    {
      id: 'o1-bara-stare', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Totalul fără formulă',
      cerinta: 'Fără să scrii vreo formulă, află <b>suma</b> mediilor din zona <b>F2:F13</b> folosind bara de stare. Scrie numărul găsit în celula <b>I2</b>. Atenție: una dintre medii este scrisă ca text. Găsește-o, corecteaz-o (scrie-o din nou, ca număr), apoi citește suma.',
      foi: [{ name: 'Catalog', rows: 14, cols: 9, data: CATALOG_01, widths: LATIMI_CATALOG_01, bold: 'A1:G1', formats: { 'F2:F13': 'number:2' },
        cells: { H2: 'Suma mediilor:' } }],
      inaltime: 300, selecteaza: 'F2',
      reguli: [
        { valoare: 'F10', egal: 8.75, tipDate: 'numar', mesaj: 'media Elenei Marin (F10) trebuie să fie numărul 8,75.' },
        { valoare: 'I2', egal: 101.25, tipDate: 'numar', faraFormula: true, mesaj: 'citește din nou suma din bara de stare, după ce ai corectat media scrisă ca text.' }
      ],
      indicii: ['Media scrisă ca text este aliniată la <b>stânga</b>. Selecteaz-o și citește în bara de stare: „text”.', 'Scrie din nou 8,75 în F10. Apoi selectează F2:F13: bara de stare arată Sumă = 101,25.'],
      solutieText: 'F10 conținea textul „8,75” (aliniat la stânga). După ce se scrie din nou ca număr, selecția F2:F13 are suma <b>101,25</b>, care se scrie în I2.'
    }
  ],

  fisa: {
    titlu: 'Catalogul clasei',
    timp: 30,
    fisier: 'fisa-01-catalog.xlsx',
    context: 'Dirigintele clasei a X-a a început un catalog electronic, dar are nevoie de ajutor ca să-l organizeze. Deschide fișierul <b>fisa-01-catalog.xlsx</b> și rezolvă cerințele.',
    foi: [
      { name: 'Note', data: CATALOG_01, widths: LATIMI_CATALOG_01, bold: 'A1:G1', formats: { 'F2:F13': 'number:2' } }
    ],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'Salvează fișierul în folderul tău cu numele <b>Clasa_Nume_Prenume.xlsx</b> (de exemplu 10A_Popescu_Ana.xlsx).',
        barem: '1p — fișier salvat cu numele cerut și extensia .xlsx.' },
      { nivel: 'baza', puncte: 1, text: 'Redenumește foaia <i>Note</i> în <b>Catalog 10A</b> și colorează eticheta foii cu albastru.',
        barem: '0,5p redenumire corectă; 0,5p culoarea etichetei.', solutie: 'Dublu-clic pe etichetă → Catalog 10A; clic dreapta → Culoare filă.' },
      { nivel: 'baza', puncte: 1, text: 'În celula <b>I2</b> scrie <b>adresa</b> celulei care conține data nașterii elevului <b>Florea Matei</b>.',
        barem: '1p — în I2 apare textul D7.', solutie: 'D7' },
      { nivel: 'mediu', puncte: 2, text: 'Selectează mediile (F2:F13) și copiază din <b>bara de stare</b> valorile <i>Sumă</i>, <i>Medie</i> și <i>Număr</i> în celulele I4, I5 și I6 (scrie-le ca numere, fără formule). În H4:H6 scrie etichetele „Sumă”, „Medie”, „Număr”.',
        barem: '0,5p etichete; 0,5p pentru fiecare valoare corectă (I4 = 92,5; I5 ≈ 8,41; I6 = 11 — media Elenei Marin este text și nu este numărată).',
        solutie: 'Sumă 92,50 · Medie 8,409… · Număr 11 (celula F10 conține text).' },
      { nivel: 'mediu', puncte: 2, text: 'Inserează o foaie nouă numită <b>Absențe</b>. În A1:C1 scrie antetele <b>Nume</b>, <b>Motivate</b>, <b>Nemotivate</b>, iar în A2 scrie numele primului elev din catalog.',
        barem: '0,5p foaia nouă; 0,5p numele foii; 0,5p antetele; 0,5p A2 completat corect (Andrei Maria).' },
      { nivel: 'avansat', puncte: 2, text: 'Una dintre medii este scrisă ca <b>text</b>, așa că nu intră în calcule. Găsește-o (indiciu: alinierea), scrie în <b>I8</b> adresa ei, apoi corecteaz-o, ca s-o transformi în număr. Verifică în bara de stare că <i>Număr</i> devine 12.',
        barem: '1p adresa corectă în I8 (F10); 1p valoarea corectată (8,75 aliniat la dreapta; Număr = 12, Sumă = 101,25).',
        solutie: 'F10 — se scrie din nou 8,75 ca număr.' }
    ]
  }
};
