/* =====================================================================
   data/lectii/ora-02.js — ORA 2: Introducerea și editarea datelor;
   formatarea celulelor și formatele numerice
   (marcajele [[=…]], [[fn:…]], [[k:…]] sunt explicate în ora-01.js)
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const BUGET_02 = [
  ['Activitate', 'Data', 'Cost / elev', 'Nr. elevi', 'Total', 'Din buget'],
  ['Transport cu autocarul', '15.05.2026', 95, 26, 2470, 0.2851],
  ['Cazare (2 nopți)', '15.05.2026', 180, 26, 4680, 0.5402],
  ['Intrare Castelul Peleș', '16.05.2026', 30, 26, 780, 0.09],
  ['Telecabina Sinaia', '16.05.2026', 25, 26, 650, 0.075],
  ['Masa de prânz', '17.05.2026', 3.5, 26, 91, 0.0105]
];

window.DATE_LECTII[2] = {
  nr: 2,
  titlu: 'Introducerea și formatarea datelor',
  durata: 50,
  rezumat: 'Cum scrii, modifici și ștergi date. Cum le faci ușor de citit: aldin, culori, chenare, aliniere și formatele numerice care schimbă modul de afișare, dar nu și valoarea.',

  obiective: [
    'să introduci, să modifici și să ștergi date în celule;',
    'să formatezi textul și celulele: font, aldin, culoare, umplere, chenare, aliniere;',
    'să aplici formatele numerice: număr cu zecimale, monedă, procent, dată, text;',
    'să explici diferența dintre <b>valoarea</b> unei celule și <b>felul în care este afișată</b>;',
    'să ajustezi lățimea coloanelor și să recunoști semnul ##### .'
  ],

  teorie: [
    {
      titlu: 'Introducerea și modificarea datelor',
      html: `
        <p>Selectezi celula, scrii și confirmi cu [[k:Enter]] (coboară), [[k:Tab]] (merge la dreapta) sau cu un clic în altă celulă. Apeși [[k:Esc]] ca să renunți înainte de confirmare.</p>
        <table class="tabel">
          <tr><th>Vrei să…</th><th>Faci așa</th></tr>
          <tr><td>înlocuiești tot conținutul</td><td>selectezi celula și scrii direct</td></tr>
          <tr><td>modifici doar o parte</td><td>[[k:F2]], dublu-clic pe celulă sau clic în bara de formule</td></tr>
          <tr><td>ștergi conținutul</td><td>[[k:Delete]] (formatarea rămâne!)</td></tr>
          <tr><td>ștergi și formatarea</td><td><i>Pornire → Golire → Golire totală</i> (Home → Clear → Clear All)</td></tr>
          <tr><td>anulezi o greșeală</td><td>[[k:Ctrl+Z]]</td></tr>
        </table>
        <div class="atentie"><strong>Delete nu șterge formatul</strong>Dacă o celulă formatată ca procent e golită cu Delete și apoi scrii 5, vei vedea 5%, nu 5.</div>`
    },
    {
      titlu: 'Formatarea celulelor',
      html: `
        <p>Comenzile sunt în fila <b>Pornire</b> (<i>Home</i>), în grupurile <i>Font</i>, <i>Aliniere</i> și <i>Număr</i>. Toate opțiunile se găsesc și în fereastra <b>Formatare celule</b> (<i>Format Cells</i>), care se deschide cu [[k:Ctrl+1]] sau cu clic dreapta.</p>
        <ul>
          <li><b>Font:</b> tipul și dimensiunea, <b>aldin</b> [[k:Ctrl+B]], <i>cursiv</i> [[k:Ctrl+I]], subliniat [[k:Ctrl+U]], culoarea textului.</li>
          <li><b>Umplere:</b> culoarea de fundal a celulei.</li>
          <li><b>Chenare</b> (<i>Borders</i>): liniile din jurul celulelor. Liniile gri ale grilei <u>nu</u> apar la imprimare, chenarele da.</li>
          <li><b>Aliniere:</b> stânga / centru / dreapta, sus / mijloc / jos, <b>încadrarea textului</b> pe mai multe rânduri (<i>Wrap Text</i>), orientarea textului.</li>
          <li><b>Îmbinare și centrare</b> (<i>Merge &amp; Center</i>): unește mai multe celule într-una. E utilă pentru titluri, dar îmbinările din interiorul tabelelor încurcă sortarea și filtrarea.</li>
          <li><b>Descriptorul de formate</b> (pensula, <i>Format Painter</i>) copiază formatarea unei celule pe alte celule.</li>
        </ul>`
    },
    {
      titlu: 'Formatele numerice: se schimbă afișarea, nu valoarea',
      html: `
        <p>Un format numeric schimbă doar <b>felul în care se vede</b> numărul. Valoarea reală rămâne aceeași și apare în bara de formule.</p>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Format</th><th>Valoarea 1234,5678 se afișează</th><th>Când îl folosești</th></tr>
          <tr><td>General</td><td>1234,5678</td><td>implicit</td></tr>
          <tr><td>Număr, 2 zecimale</td><td>1234,57</td><td>note, medii, măsurători</td></tr>
          <tr><td>Număr cu separator de mii</td><td>1.234,57</td><td>sume mari</td></tr>
          <tr><td>Monedă (lei)</td><td>1.234,57 lei</td><td>prețuri, bugete</td></tr>
          <tr><td>Procent</td><td>123457%</td><td>ponderi, reduceri (valoarea 0,25 → 25%)</td></tr>
          <tr><td>Dată scurtă / lungă</td><td>18.05.1903 / 18 mai 1903</td><td>date calendaristice</td></tr>
          <tr><td>Științific</td><td>1,23E+03</td><td>numere foarte mari sau foarte mici</td></tr>
          <tr><td>Text</td><td>1234,5678 (tratat ca text)</td><td>coduri, numere de telefon</td></tr>
        </table></div>
        <div class="nota"><strong>De ce contează?</strong>O notă de 8,456 afișată cu o zecimală arată 8,5, dar în calcule Excel folosește 8,456. Dacă vrei să schimbi chiar valoarea, folosești funcția [[fn:ROUND]] (ora 5).</div>`
    },
    {
      titlu: 'Procente și date calendaristice',
      html: `
        <p><b>Procentele:</b> 25% înseamnă 0,25. Poți scrie direct <code>25%</code>, iar Excel reține 0,25 cu format procent.
        Dacă formatezi ca procent o celulă care conține deja 25, obții <b>2500%</b>, pentru că 25 = 2500%.</p>
        <p><b>Datele:</b> se scriu cu puncte (<code>15.05.2026</code>) sau cu bară (<code>15/05/2026</code>), după setările regionale.
        Excel le păstrează ca numere, așa că le poți scădea: [[=C2-B2]] îți dă numărul de zile dintre două date.
        Aceeași dată poate fi afișată în mai multe feluri: <i>15.05.2026</i>, <i>15 mai 2026</i> sau <i>vineri, 15 mai 2026</i>.</p>`
    },
    {
      titlu: 'Lățimea coloanelor și semnul #####',
      html: `
        <p>Dacă o coloană e prea îngustă pentru un număr sau o dată, Excel afișează <b>#####</b>. Valoarea nu este greșită, doar nu încape.</p>
        <ul>
          <li>Tragi de marginea din dreapta a antetului coloanei (în simulator, la fel).</li>
          <li><b>Dublu-clic</b> pe marginea antetului potrivește lățimea automat, după conținut (<i>AutoFit</i>).</li>
          <li>Un text lung „trece” vizual în celula vecină, dacă aceasta e goală. Altfel e tăiat, deși conținutul complet există.</li>
        </ul>`
    }
  ],

  simulator: {
    titlu: 'Atelier: bugetul excursiei',
    text: `<p>Tabelul de mai jos este neformatat. Folosește bara de unelte a simulatorului:</p>
      <ul>
        <li>Selectează antetul (A1:F1) și apasă <b>B</b> și butonul de umplere ▨.</li>
        <li>Selectează C2:C6 și alege <b>Monedă (lei)</b> din lista de formate. Apoi E2:E6.</li>
        <li>Selectează F2:F6 și alege <b>Procent</b>. Folosește <b>.0←</b> pentru o zecimală. Privește bara de formule: valoarea rămâne 0,2851.</li>
        <li>Mărește lățimea coloanei A, trăgând de marginea din dreapta a literei A.</li>
      </ul>`,
    foi: [{ name: 'Buget', rows: 12, cols: 8, data: BUGET_02, widths: { A: 90, B: 88, C: 88, D: 74, E: 88, F: 88 } }]
  },

  animatii: [
    {
      id: 'o2-formate',
      titlu: 'Aceeași valoare, afișată în mai multe feluri',
      grila: { rows: 6, cols: 3, data: [['Format', 'Afișare', 'Valoare reală'], ['General', 0.2568, 0.2568]] },
      pasi: [
        { text: 'Celula B2 conține valoarea <b>0,2568</b>. Formatul <i>General</i> o afișează exact așa.', aprinde: ['B2'], ref0: ['C2'] },
        { text: 'Formatul <b>Număr cu 2 zecimale</b> afișează 0,26, dar valoarea reală rămâne 0,2568.', celule: { A3: 'Număr, 2 zecimale', B3: '=>0,26', C3: 0.2568 }, aprinde: ['B3'], ref0: ['C3'] },
        { text: 'Formatul <b>Procent</b> înmulțește afișarea cu 100: 25,68%. Valoarea din spate e tot 0,2568.', celule: { A4: 'Procent, 2 zecimale', B4: '=>25,68%', C4: 0.2568 }, aprinde: ['B4'], ref0: ['C4'] },
        { text: 'Formatul <b>Monedă</b> adaugă simbolul și rotunjește afișarea la 2 zecimale.', celule: { A5: 'Monedă (lei)', B5: '=>0,26 lei', C5: 0.2568 }, aprinde: ['B5'], ref0: ['C5'] },
        { text: 'Calculele folosesc <b>valoarea reală</b> din coloana C, nu ce vezi afișat. Ca să schimbi chiar valoarea, folosești [[fn:ROUND]].', zona: ['C2:C5'], mare: '0,2568 = 0,26 = 25,68%' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o2-antet', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Un antet care se vede',
      cerinta: 'Formatează antetul tabelului (<b>A1:F1</b>) cu <b>aldin</b> și <b>culoare de umplere</b>.',
      foi: [{ name: 'Buget', rows: 8, cols: 7, data: BUGET_02, widths: { A: 150, B: 88 } }],
      selecteaza: 'A1',
      reguli: [
        { aldin: 'A1:F1' },
        { custom: (wb) => { for (let c = 0; c < 6; c++) { const x = wb.cell(0, 0, c); if (!x || !x.fill) return 'Celula ' + FE_ADR(0, c) + ' nu are culoare de umplere.'; } return null; } }
      ],
      indicii: ['Selectează A1:F1 trăgând cu mouse-ul de la A1 la F1.', 'Apasă butonul <b>B</b> (aldin) și butonul ▨ (umplere) din bara de unelte.'],
      solutieText: 'Selectezi A1:F1, apoi apeși <b>B</b> și ▨. În Excel: <i>Pornire → Aldin</i> și <i>Pornire → Culoare de umplere</i>.'
    },
    {
      id: 'o2-moneda', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Prețuri în lei',
      cerinta: 'Aplică formatul <b>Monedă (lei)</b> cu <b>2 zecimale</b> costurilor (<b>C2:C6</b>) și totalurilor (<b>E2:E6</b>).',
      foi: [{ name: 'Buget', rows: 8, cols: 7, data: BUGET_02, widths: { A: 150, B: 88 } }],
      selecteaza: 'C2',
      reguli: [{ format: 'C2:C6', tip: 'currency', zecimale: 2 }, { format: 'E2:E6', tip: 'currency', zecimale: 2 }],
      indicii: ['Selectează C2:C6 și alege „Monedă (lei)” din lista de formate a barei de unelte.', 'Repetă pentru E2:E6. Formatul monedă are implicit 2 zecimale.'],
      solutieText: 'C2:C6 și E2:E6 → format Monedă (lei), 2 zecimale. În Excel: [[k:Ctrl+1]] → Număr → Monedă → Simbol: lei.'
    },
    {
      id: 'o2-procent', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Cât din buget?',
      cerinta: 'Coloana F arată ce parte din buget reprezintă fiecare activitate (ca număr zecimal). Formatează <b>F2:F6</b> ca <b>procent cu o zecimală</b> (de exemplu 28,5%).',
      foi: [{ name: 'Buget', rows: 8, cols: 7, data: BUGET_02, widths: { A: 150, B: 88 } }],
      selecteaza: 'F2',
      reguli: [{ format: 'F2:F6', tip: 'percent', zecimale: 1 }],
      indicii: ['Alege formatul „Procent %” pentru F2:F6.', 'Apoi apasă o dată butonul <b>.0←</b> (mărește numărul de zecimale).'],
      solutieText: 'F2:F6 → Procent, apoi o zecimală: 0,2851 se afișează 28,5%.'
    },
    {
      id: 'o2-potrivire', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Ce format are?',
      cerinta: 'Fiecare afișare de mai jos provine dintr-un anumit format numeric. Potrivește-le.',
      perechi: [
        ['Procent', '25%'],
        ['Monedă', '1.250,00 lei'],
        ['Dată', '15.05.2026'],
        ['Număr cu 2 zecimale', '3,14'],
        ['Științific', '1,23E+06'],
        ['Text', '0745123456 (cu zeroul păstrat)']
      ],
      indicii: ['„E+06” înseamnă „ori 10 la puterea 6”.', 'Un număr de telefon care începe cu 0 își păstrează zeroul doar dacă e tratat ca text.']
    },
    {
      id: 'o2-valoare-reala', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'Afișat față de real',
      cerinta: 'Celula A2 conține nota <b>8,456</b>, formatată cu o zecimală, deci afișează 8,5. Ce rezultat dă formula din B2?',
      foi: [{ name: 'Note', rows: 3, cols: 3, data: [['Nota', 'Dublul'], [8.456]], formats: { A2: 'number:1' } }],
      formula: '=A2*2', celula: 'B2', inaltime: 140,
      indicii: ['Formatul schimbă doar afișarea. Ce valoare vezi în bara de formule când selectezi A2?', 'Calculul folosește 8,456, nu 8,5.'],
      explicatie: '8,456 × 2 = <b>16,912</b>. Dacă te așteptai la 17, ai folosit valoarea afișată, nu pe cea reală.'
    },
    {
      id: 'o2-introducere', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Procente scrise corect',
      cerinta: 'În <b>B1</b> scrie cota TVA de <b>19%</b> astfel încât valoarea să fie 0,19. În <b>B2</b> scrie data <b>1 septembrie 2025</b>, ca dată.',
      foi: [{ name: 'Setări', rows: 5, cols: 4, data: [['Cota TVA'], ['Început de an școlar']], widths: { A: 140 } }],
      selecteaza: 'B1',
      reguli: [
        { valoare: 'B1', egal: 0.19, tipDate: 'numar', faraFormula: true, mesaj: 'scrie 19% (cu semnul %), ca Excel să rețină 0,19.' },
        { valoare: 'B2', egal: '01.09.2025', tipDate: 'data', mesaj: 'scrie data sub forma 01.09.2025.' }
      ],
      indicii: ['Dacă scrii 19 fără %, valoarea este nouăsprezece, nu 0,19.', 'Data se scrie cu puncte: zi.lună.an.'],
      solutieText: 'B1: <code>19%</code> (valoare 0,19, format procent) · B2: <code>01.09.2025</code>.'
    },
    {
      id: 'o2-diezi', tip: 'grila', nivel: 'baza', puncte: 5,
      titlu: 'Ce înseamnă #####?',
      cerinta: 'O celulă cu o dată afișează <b>########</b>. Ce faci?',
      variante: ['Măresc lățimea coloanei (sau dublu-clic pe marginea antetului).', 'Șterg data și o scriu din nou.', 'Schimb formatul în Text.', 'E o eroare de calcul; verific formula.'],
      corect: 0,
      indicii: ['Valoarea e corectă, doar nu încape.'],
      explicatie: '##### apare când numărul sau data nu încap în lățimea coloanei.'
    },
    {
      id: 'o2-ordonare', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Formatare prin fereastra Formatare celule',
      cerinta: 'Ordonează pașii pentru a afișa prețurile din C2:C20 cu simbolul „lei” și 2 zecimale.',
      pasi: [
        'Selectează zona C2:C20.',
        'Apasă [[k:Ctrl+1]] (sau clic dreapta → <i>Formatare celule</i>).',
        'Alege fila <b>Număr</b>.',
        'Alege categoria <b>Monedă</b>.',
        'Setează <b>2</b> zecimale și simbolul <b>lei</b>.',
        'Apasă <b>OK</b>.'
      ],
      indicii: ['Întâi alegi celulele, abia apoi formatul.']
    },
    {
      id: 'o2-greseala', tip: 'grila', nivel: 'avansat', puncte: 10,
      titlu: '2500%?',
      cerinta: 'Andrei a scris în D2 numărul <b>25</b> (pentru o reducere de 25%) și apoi a aplicat formatul Procent. Celula afișează <b>2500%</b>. Care este corectarea potrivită?',
      variante: ['Scrie în D2 valoarea 0,25 sau direct 25%.', 'Scade numărul de zecimale.', 'Aplică formatul Monedă.', 'Mărește lățimea coloanei.'],
      corect: 0,
      indicii: ['Procentul înseamnă „la sută”: 25% = 25/100.'],
      explicatie: '25 formatat ca procent înseamnă 25 × 100% = 2500%. Valoarea corectă pentru 25% este 0,25.'
    }
  ],

  fisa: {
    titlu: 'Bugetul excursiei la Sinaia',
    timp: 35,
    fisier: 'fisa-02-buget-excursie.xlsx',
    context: 'Clasa a X-a pleacă în excursie la Sinaia. Tabelul din <b>fisa-02-buget-excursie.xlsx</b> conține cheltuielile, dar este greu de citit. Formatează-l ca să poată fi prezentat părinților.',
    foi: [{ name: 'Buget', data: [['Bugetul excursiei la Sinaia'], [], ...BUGET_02], widths: { A: 170, B: 90, C: 80, D: 70, E: 80, F: 80 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'Titlul din A1: îmbină și centrează A1:F1, aplică aldin, dimensiunea 14 și o culoare a textului.', barem: '0,5p îmbinare și centrare; 0,5p aldin, 14, culoare.' },
      { nivel: 'baza', puncte: 1.5, text: 'Antetul tabelului (A3:F3): aldin, culoare de umplere, text centrat și <b>încadrat</b> (Wrap Text).', barem: '0,5p aldin + umplere; 0,5p centrat; 0,5p încadrare text.' },
      { nivel: 'baza', puncte: 1.5, text: 'Aplică chenare pe toate celulele tabelului A3:F8 (chenar exterior gros, chenare interioare subțiri).', barem: '0,75p chenare interioare; 0,75p chenar exterior gros.' },
      { nivel: 'mediu', puncte: 2, text: 'Formate numerice: C4:C8 și E4:E8 ca <b>Monedă (lei)</b> cu 2 zecimale; F4:F8 ca <b>Procent</b> cu o zecimală; B4:B8 ca <b>dată lungă</b> (de ex. 15 mai 2026).', barem: '0,5p monedă C; 0,5p monedă E; 0,5p procent; 0,5p dată lungă.' },
      { nivel: 'mediu', puncte: 1, text: 'Potrivește automat lățimea coloanelor (dublu-clic pe marginile antetelor), astfel încât să nu apară #####.', barem: '1p — toate valorile se văd complet.' },
      { nivel: 'avansat', puncte: 2, text: 'Aplică pe D4:D8 formatul <b>personalizat</b> <code>0 "elevi"</code>, astfel încât 26 să apară „26 elevi”, dar să rămână număr. Verifică în bara de formule. Apoi folosește <b>Descriptorul de formate</b> (pensula) ca să copiezi formatarea rândului 4 pe rândul 8.', barem: '1p format personalizat corect (valoarea rămâne 26); 1p descriptor de formate folosit corect.', solutie: 'Ctrl+1 → Număr → Particularizat → Tip: 0 "elevi".' }
    ]
  }
};

// adresa unei celule (pentru mesajele din exerciții)
function FE_ADR(r, c) { return window.FormulaEngine.addr(r, c); }
