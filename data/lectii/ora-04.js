/* =====================================================================
   data/lectii/ora-04.js — ORA 4: Formule, operatori, ordinea
   operațiilor; referințe relative, absolute și mixte
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const COS_04 = [
  ['Produs', 'Cantitate', 'Preț unitar', 'Valoare', 'TVA', 'Total', '', 'Cota TVA', '19%'],
  ['Căști wireless', 2, 149.9, '', '', '', '', 'Curs EUR', 4.97],
  ['Mouse optic', 3, 45.5],
  ['Stick USB 64 GB', 4, 39],
  ['Tastatură', 1, 119],
  ['Suport laptop', 2, 89.99],
  ['Cablu HDMI 2 m', 5, 24.5]
];
const LAT_04 = { A: 120, B: 72, C: 84, D: 84, E: 76, F: 84, H: 80 };

window.DATE_LECTII[4] = {
  nr: 4,
  titlu: 'Formule și referințe',
  durata: 50,
  rezumat: 'Formulele fac calculele pentru tine și se actualizează singure. Înveți operatorii, ordinea în care se efectuează calculele și cum folosești $ ca o formulă să rămână corectă când o copiezi.',

  obiective: [
    'să scrii formule cu operatorii aritmetici <code>+ - * / ^ %</code>, cu operatorul de text <code>&amp;</code> și cu cei de comparație;',
    'să aplici <b>ordinea operațiilor</b> și să folosești paranteze;',
    'să explici ce se întâmplă cu o <b>referință relativă</b> când copiezi formula;',
    'să folosești <b>referințe absolute</b> ($A$1) și <b>mixte</b> ($A1, A$1), inclusiv cu tasta [[k:F4]];',
    'să recunoști erorile frecvente: #DIV/0!, #VALUE!, #NAME?, #REF!.'
  ],

  teorie: [
    {
      titlu: 'Ce este o formulă',
      html: `
        <p>O formulă începe <b>întotdeauna</b> cu semnul <code>=</code>. Poate conține numere, <b>referințe</b> la celule (A1, B2:B6), <b>operatori</b> și <b>funcții</b>.</p>
        <p>Formula [[=B2*C2]] înseamnă „înmulțește ce se află în B2 cu ce se află în C2”. Dacă modifici B2, rezultatul se recalculează automat.
        De aceea scrii <b>referințe</b>, nu numere: [[=2*149.9]] ar da același rezultat azi, dar n-ar mai fi corect după ce se schimbă cantitatea.</p>
        <div class="sfat"><strong>Clic în loc de tastare</strong>După ce scrii =, poți face clic pe celule ca să le adaugi referința în formulă. Excel colorează fiecare referință, iar simulatorul la fel.</div>`
    },
    {
      titlu: 'Operatorii',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Tip</th><th>Operator</th><th>Exemplu</th><th>Rezultat</th></tr>
          <tr><td rowspan="6">aritmetici</td><td>+ adunare</td><td>[[=5+3]]</td><td>8</td></tr>
          <tr><td>- scădere / negație</td><td>[[=5-3]]</td><td>2</td></tr>
          <tr><td>* înmulțire</td><td>[[=5*3]]</td><td>15</td></tr>
          <tr><td>/ împărțire</td><td>[[=5/2]]</td><td>2,5</td></tr>
          <tr><td>^ putere</td><td>[[=2^10]]</td><td>1024</td></tr>
          <tr><td>% procent</td><td>[[=200*15%]]</td><td>30</td></tr>
          <tr><td>text</td><td>&amp; lipire (concatenare)</td><td>[[="Clasa "&"a X-a"]]</td><td>Clasa a X-a</td></tr>
          <tr><td>comparație</td><td>= &lt;&gt; &gt; &lt; &gt;= &lt;=</td><td>[[=8>=5]]</td><td>TRUE</td></tr>
          <tr><td>referință</td><td>: zonă &nbsp; , uniune</td><td>[[=SUM(A1:A5,C1)]]</td><td>—</td></tr>
        </table></div>`
    },
    {
      titlu: 'Ordinea operațiilor',
      html: `
        <p>Excel calculează în această ordine (ca la matematică, cu câteva particularități):</p>
        <ol>
          <li><b>paranteze</b> ( )</li>
          <li><b>negația</b> (minusul din fața unui număr)</li>
          <li><b>procent</b> %</li>
          <li><b>putere</b> ^</li>
          <li><b>înmulțire și împărțire</b> * / (de la stânga la dreapta)</li>
          <li><b>adunare și scădere</b> + − (de la stânga la dreapta)</li>
          <li><b>lipire de text</b> &amp;</li>
          <li><b>comparații</b> = &lt; &gt; …</li>
        </ol>
        <p>Exemple: [[=2+3*4]] = 14, dar [[=(2+3)*4]] = 20. [[=10/2*5]] = 25, pentru că se calculează de la stânga la dreapta.</p>
        <div class="atentie"><strong>Capcană</strong>În Excel, [[=-2^2]] dă <b>4</b>, fiindcă negația se face înaintea puterii: (−2)² = 4. Pentru −4 scrii [[=-(2^2)]].</div>`
    },
    {
      titlu: 'Referințe relative',
      html: `
        <p>O referință ca <code>B2</code> este <b>relativă</b>: Excel o reține ca „celula aflată cu 2 coloane la stânga, pe același rând”.
        Când copiezi formula în jos, referința se deplasează odată cu ea:</p>
        <table class="tabel">
          <tr><th>Celula</th><th>Formula</th></tr>
          <tr><td>D2</td><td>[[=B2*C2]]</td></tr>
          <tr><td>D3 (copiată)</td><td>[[=B3*C3]]</td></tr>
          <tr><td>D4 (copiată)</td><td>[[=B4*C4]]</td></tr>
        </table>
        <p>Așa scrii o singură formulă și o copiezi pe tot tabelul. Este comportamentul dorit de cele mai multe ori.</p>`
    },
    {
      titlu: 'Referințe absolute și mixte',
      html: `
        <p>Uneori o formulă trebuie să folosească <b>mereu aceeași celulă</b>, de exemplu cota TVA din I1. Pui semnul <b>$</b> ca s-o „blochezi”: <code>$I$1</code>.</p>
        <table class="tabel">
          <tr><th>Scriere</th><th>Tip</th><th>La copiere</th></tr>
          <tr><td><code>A1</code></td><td>relativă</td><td>se schimbă și coloana, și rândul</td></tr>
          <tr><td><code>$A$1</code></td><td>absolută</td><td>nu se schimbă nimic</td></tr>
          <tr><td><code>$A1</code></td><td>mixtă</td><td>coloana A rămâne fixă, rândul se schimbă</td></tr>
          <tr><td><code>A$1</code></td><td>mixtă</td><td>rândul 1 rămâne fix, coloana se schimbă</td></tr>
        </table>
        <p>Apeși [[k:F4]] pe o referință în timpul editării ca să treci prin variante: A1 → $A$1 → A$1 → $A1 → A1. Funcționează și în simulator.</p>
        <div class="nota"><strong>Exemplu clasic</strong>În E2 formula [[=D2*$I$1]] copiată în jos devine [[=D3*$I$1]], [[=D4*$I$1]]… Fără $, a doua formulă ar fi =D3*I2, iar I2 conține cursul euro, nu cota TVA!</div>`
    }
  ],

  simulator: {
    titlu: 'Atelier: coșul de cumpărături',
    text: `<p>Completează coșul magazinului online:</p>
      <ul>
        <li>În D2 scrie <code>=</code>, fă clic pe B2, scrie <code>*</code>, clic pe C2 și apasă Enter. Apoi trage de ghidaj până la D7.</li>
        <li>În E2 scrie <code>=D2*I1</code>, apasă [[k:F4]] cu cursorul pe I1 (devine $I$1) și copiază formula în jos. Încearcă și fără $, ca să vezi greșeala.</li>
        <li>Selectează o celulă cu formulă și privește chenarele colorate: arată celulele folosite de formulă.</li>
        <li>Apasă butonul <b>fx</b> din bara de unelte ca să vezi toate formulele deodată (sau [[k:Ctrl]] + tasta de sub [[k:Esc]]).</li>
      </ul>`,
    foi: [{ name: 'Coș', rows: 12, cols: 10, data: COS_04, bold: 'A1:F1', widths: LAT_04, formats: { 'C2:F7': 'currency' } }]
  },

  animatii: [
    {
      id: 'o4-relativ',
      titlu: 'Ce se întâmplă cu o referință relativă la copiere',
      grila: { rows: 5, cols: 4, data: [['Produs', 'Cant.', 'Preț', 'Valoare'], ['Mouse', 3, 45], ['Stick', 4, 39], ['Cablu', 5, 24]] },
      pasi: [
        { text: 'În D2 scriem formula care înmulțește cantitatea cu prețul.', formula: '=B2*C2', celule: { D2: '=B2*C2' }, ref0: ['B2'], ref1: ['C2'], aprinde: ['D2'] },
        { text: 'Rezultatul: 3 × 45 = 135.', celule: { D2: '=>135' }, ref0: ['B2'], ref1: ['C2'], aprinde: ['D2'] },
        { text: 'Copiem formula un rând mai jos. Referințele „coboară” și ele un rând: <b>B2→B3</b>, <b>C2→C3</b>.', formula: '=B3*C3', celule: { D2: '=>135', D3: '=B3*C3' }, ref0: ['B3'], ref1: ['C3'], aprinde: ['D3'] },
        { text: 'În D4 formula devine =B4*C4. Excel reține „cele două celule din stânga, pe același rând”.', formula: '=B4*C4', celule: { D3: '=>156', D4: '=B4*C4' }, ref0: ['B4'], ref1: ['C4'], aprinde: ['D4'] },
        { text: 'O singură formulă, copiată, calculează tot tabelul.', celule: { D4: '=>120' }, zona: ['D2:D4'], mare: '135 · 156 · 120' }
      ]
    },
    {
      id: 'o4-absolut',
      titlu: 'Referința absolută $F$1 rămâne pe loc',
      grila: { rows: 5, cols: 6, data: [['Produs', '', '', 'Valoare', 'TVA', '19%'], ['Mouse', '', '', 135], ['Stick', '', '', 156], ['Cablu', '', '', 120]] },
      pasi: [
        { text: 'Cota TVA este într-o singură celulă: F1.', aprinde: ['F1'] },
        { text: 'În E2 calculăm TVA-ul: valoarea × cota. Punem $ la F1.', formula: '=D2*$F$1', celule: { E2: '=D2*$F$1' }, ref0: ['D2'], ref1: ['F1'], aprinde: ['E2'] },
        { text: 'Copiată în E3: <b>D2 → D3</b> (relativă), dar <b>$F$1 rămâne $F$1</b>.', formula: '=D3*$F$1', celule: { E2: '=>25,65', E3: '=D3*$F$1' }, ref0: ['D3'], ref1: ['F1'], aprinde: ['E3'] },
        { text: 'Fără $, formula copiată ar fi fost <b>=D3*F2</b>. F2 e goală, deci TVA-ul ar fi 0. Aceasta e cea mai frecventă greșeală!', formula: '=D3*F2', celule: { E3: '=D3*F2' }, ref0: ['D3'], ref1: ['F2'], aprinde: ['E3'] },
        { text: 'Cu $F$1 toate formulele folosesc aceeași cotă. Dacă modifici cota în F1, se recalculează tot.', celule: { E3: '=>29,64', E4: '=>22,8' }, zona: ['E2:E4'], ref1: ['F1'] }
      ]
    },
    {
      id: 'o4-ordine',
      titlu: 'Ordinea operațiilor, pas cu pas',
      grila: { rows: 2, cols: 2, data: [['Formula', '=2+3*4^2']] },
      pasi: [
        { text: 'Calculăm [[=2+3*4^2]]. Nu avem paranteze, deci începem cu <b>puterea</b>.', mare: '2 + 3 × 4^2' },
        { text: '4^2 = 16', mare: '2 + 3 × 16' },
        { text: 'Urmează <b>înmulțirea</b>: 3 × 16 = 48', mare: '2 + 48' },
        { text: 'La final <b>adunarea</b>: 2 + 48 = 50', mare: '50' },
        { text: 'Cu paranteze ordinea se schimbă: [[=(2+3)*4^2]] = 5 × 16 = 80.', mare: '(2 + 3) × 16 = 80' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o4-ordine1', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Ordinea operațiilor (1)',
      cerinta: 'Ce rezultat dă formula?', formula: '=2+3*4',
      indicii: ['Înmulțirea se face înaintea adunării.'],
      explicatie: '3 × 4 = 12, apoi 2 + 12 = 14.'
    },
    {
      id: 'o4-ordine2', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'Ordinea operațiilor (2)',
      cerinta: 'Ce rezultat dă formula?', formula: '=(10-4)/2^2+1',
      indicii: ['Întâi paranteza, apoi puterea.', '(10−4) = 6; 2^2 = 4; 6/4 = 1,5; apoi +1.'],
      explicatie: '6 / 4 + 1 = 2,5.'
    },
    {
      id: 'o4-valoare', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Valoarea produselor',
      cerinta: 'În <b>D2</b> calculează valoarea (cantitate × preț unitar), apoi copiază formula până în <b>D7</b>.',
      foi: [{ name: 'Coș', rows: 9, cols: 10, data: COS_04, bold: 'A1:F1', widths: LAT_04, formats: { 'C2:F7': 'currency' } }],
      reguli: [{ formula: 'D2:D7', solutie: '=B2*C2' }],
      indicii: ['Formula începe cu = și folosește referințele B2 și C2.', 'Scrie =B2*C2 în D2, apoi trage ghidajul de umplere până la D7.']
    },
    {
      id: 'o4-tva', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'TVA cu referință absolută',
      cerinta: 'Coloana D este completată. În <b>E2</b> calculează TVA-ul (valoare × cota din <b>I1</b>) și copiază formula până în <b>E7</b>. Toate formulele trebuie să folosească aceeași celulă I1.',
      foi: [{ name: 'Coș', rows: 9, cols: 10, data: COS_04, bold: 'A1:F1', widths: LAT_04, formats: { 'C2:F7': 'currency' }, cells: { D2: '=B2*C2', D3: '=B3*C3', D4: '=B4*C4', D5: '=B5*C5', D6: '=B6*C6', D7: '=B7*C7' } }],
      reguli: [{ formula: 'E2:E7', solutie: '=D2*$I$1', indiciuRobust: 'Cota TVA este doar în I1: scrie $I$1 (sau apasă F4 pe referință).' }],
      indicii: ['Dacă scrii =D2*I1 și copiezi, în E3 formula devine =D3*I2. Uită-te ce conține I2!', 'Pune $ înainte de litera și cifra lui I1: =D2*$I$1 (F4 pune semnele automat).']
    },
    {
      id: 'o4-total', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Totalul și prețul în euro',
      cerinta: 'În <b>F2:F7</b> calculează totalul (valoare + TVA). Apoi, în <b>G2:G7</b>, calculează totalul în euro: total împărțit la cursul din <b>I2</b>.',
      foi: [{ name: 'Coș', rows: 9, cols: 10, data: COS_04.map((r, i) => (i === 0 ? r.slice(0, 6).concat(['Total EUR', 'Cota TVA', '19%']) : r)), bold: 'A1:G1', widths: LAT_04, formats: { 'C2:F7': 'currency', 'G2:G7': 'number:2' },
        cells: { D2: '=B2*C2', D3: '=B3*C3', D4: '=B4*C4', D5: '=B5*C5', D6: '=B6*C6', D7: '=B7*C7', E2: '=D2*$I$1', E3: '=D3*$I$1', E4: '=D4*$I$1', E5: '=D5*$I$1', E6: '=D6*$I$1', E7: '=D7*$I$1' } }],
      reguli: [{ formula: 'F2:F7', solutie: '=D2+E2' }, { formula: 'G2:G7', solutie: '=F2/$I$2', indiciuRobust: 'Cursul este doar în I2: folosește $I$2.' }],
      indicii: ['Totalul: =D2+E2, copiat în jos.', 'Pentru euro: =F2/$I$2. Fără $ la I2, formula copiată ar împărți la I3, I4… care sunt goale (#DIV/0!).']
    },
    {
      id: 'o4-tabla', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Tabla înmulțirii cu o singură formulă',
      cerinta: 'Scrie <b>o singură formulă</b> în <b>B2</b> care, copiată în toată zona <b>B2:J10</b>, completează tabla înmulțirii (numărul din coloana A × numărul din rândul 1).',
      foi: [{ name: 'Tabla', rows: 11, cols: 11, data: [['×', 1, 2, 3, 4, 5, 6, 7, 8, 9], [1], [2], [3], [4], [5], [6], [7], [8], [9]], bold: ['A1:J1', 'A2:A10'], fill: ['A1:J1', 'A2:A10'], widths: { A: 44, B: 44, C: 44, D: 44, E: 44, F: 44, G: 44, H: 44, I: 44, J: 44 } }],
      inaltime: 340,
      reguli: [{ formula: 'B2:J10', solutie: '=$A2*B$1' }],
      indicii: ['Numărul de pe rând e mereu în coloana A, deci coloana trebuie blocată: $A2.', 'Numărul de pe coloană e mereu în rândul 1, deci rândul trebuie blocat: B$1.', 'Scrie =$A2*B$1 în B2, trage ghidajul până la J2, apoi, cu B2:J2 selectat, trage până la rândul 10.'],
      solutieText: '[[=$A2*B$1]] — o referință mixtă cu coloana fixă și una cu rândul fix. Copiată în H7 devine =$A7*H$1.'
    },
    {
      id: 'o4-greseala', tip: 'greseala', nivel: 'mediu', puncte: 10,
      titlu: 'TVA-ul care devine 0',
      cerinta: 'Formula din E2 a fost copiată în jos, dar începând cu E3 toate rezultatele sunt 0. Care parte a formulei din E2 este greșită?',
      formula: '=D2*I1', jetoane: ['=', 'D2', '*', 'I1'], gresit: 'I1', corect: '=D2*$I$1',
      indicii: ['Care celulă trebuie să rămână aceeași în toate formulele?'],
      explicatie: 'Cota TVA e doar în I1. Fără $, la copiere I1 devine I2, I3…, care sunt goale.'
    },
    {
      id: 'o4-completare', tip: 'completare', nivel: 'mediu', puncte: 10,
      titlu: 'Pune $ unde trebuie',
      cerinta: 'Completează formula din C2, care calculează prețul în euro (preț în lei din B2, curs în F1), ca să poată fi copiată în jos.',
      sablon: '=B2/{{$F$1|F$1}}',
      indicii: ['Referința spre curs nu trebuie să se schimbe la copiere.'],
      explicatie: '$F$1 blochează și coloana, și rândul. La copierea în jos ar merge și F$1, fiindcă doar rândul se schimbă.'
    },
    {
      id: 'o4-tipuri-ref', tip: 'clasificare', nivel: 'baza', puncte: 10,
      titlu: 'Relativă, absolută sau mixtă?',
      cerinta: 'Așază fiecare referință în categoria corectă.',
      categorii: [
        { nume: 'Relativă', elemente: ['A1', 'C7', 'B2:D5'] },
        { nume: 'Absolută', elemente: ['$A$1', '$C$3', '$B$2:$D$5'] },
        { nume: 'Mixtă', elemente: ['$A1', 'A$1', '$C7', 'B$2'] }
      ],
      indicii: ['Numără semnele $: niciunul, două (în fața literei și a cifrei) sau unul singur.']
    },
    {
      id: 'o4-operatori', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Operatori',
      cerinta: 'Potrivește fiecare operator cu semnificația lui.',
      perechi: [['^', 'ridicare la putere'], ['&', 'lipește două texte'], ['<>', 'diferit de'], ['%', 'împarte la 100 (procent)'], [':', 'zonă de celule (de la … până la …)'], ['*', 'înmulțire']],
      indicii: ['& se citește „and” și unește texte: ="Ana"&"Maria".']
    }
  ],

  fisa: {
    titlu: 'Coșul de cumpărături online',
    timp: 40,
    fisier: 'fisa-04-cos-cumparaturi.xlsx',
    context: 'Magazinul online „Cerna Shop” vrea un calculator pentru coșul de cumpărături. Cota TVA, cursul euro și reducerea stau în celule separate, ca să poată fi schimbate ușor. Toate calculele se fac cu formule.',
    foi: [{ name: 'Coș', data: [
      ['Produs', 'Cantitate', 'Preț unitar', 'Valoare', 'TVA', 'Total', 'Total EUR', '', 'Parametri', ''],
      ['Căști wireless', 2, 149.9, '', '', '', '', '', 'Cota TVA', '19%'],
      ['Mouse optic', 3, 45.5, '', '', '', '', '', 'Curs EUR', 4.97],
      ['Stick USB 64 GB', 4, 39, '', '', '', '', '', 'Reducere', '10%'],
      ['Tastatură', 1, 119],
      ['Suport laptop', 2, 89.99],
      ['Cablu HDMI 2 m', 5, 24.5],
      ['Încărcător USB-C', 2, 69],
      ['TOTAL']
    ], widths: { A: 130, I: 90 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'În D2:D8 calculează <b>Valoarea</b> = Cantitate × Preț unitar, cu o formulă copiată în jos.', barem: '0,5p formula corectă în D2; 0,5p copiată până la D8.', solutie: '=B2*C2' },
      { nivel: 'baza', puncte: 1.5, text: 'În E2:E8 calculează <b>TVA</b> = Valoare × Cota TVA (din J2). Formula trebuie să funcționeze corect după copiere.', barem: '1p referință absolută $J$2; 0,5p copiere corectă.', solutie: '=D2*$J$2' },
      { nivel: 'baza', puncte: 1, text: 'În F2:F8 calculează <b>Totalul</b> = Valoare + TVA, iar în rândul 9 (TOTAL) adună valorile coloanelor D, E și F.', barem: '0,5p total pe rând; 0,5p totaluri pe coloane.', solutie: '=D2+E2; în D9: =D2+D3+…+D8 sau =SUM(D2:D8)' },
      { nivel: 'mediu', puncte: 1.5, text: 'În G2:G8 calculează totalul în <b>euro</b>, folosind cursul din J3. Aplică formatul număr cu 2 zecimale.', barem: '1p formula cu $J$3; 0,5p format.', solutie: '=F2/$J$3' },
      { nivel: 'mediu', puncte: 1.5, text: 'Schimbă cota TVA în 21% și cursul în 5,05. Verifică că toate valorile se recalculează. Notează în L2 noul total general (F9).', barem: '1p recalculare corectă (niciun rezultat scris manual); 0,5p valoarea notată.' },
      { nivel: 'avansat', puncte: 2.5, text: 'Pe o foaie nouă numită <b>Conversie</b>, construiește un tabel de conversie lei → euro pentru sumele 10, 20, … 100 (în A2:A11) și cursurile 4,95; 5,00; 5,05 (în B1:D1). Scrie <b>o singură formulă</b> în B2, copiată în B2:D11.', barem: '1,5p formula cu referințe mixte =$A2/B$1; 1p tabel complet și corect.', solutie: '=$A2/B$1' }
    ]
  }
};
