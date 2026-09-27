/* =====================================================================
   data/lectii/ora-08.js — ORA 8: Funcții text și dată
   LEFT, RIGHT, MID, LEN, UPPER, CONCAT / &, TODAY, YEAR, DATEDIF …
   (CNP-urile din exemple sunt fictive)
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const ELEVI_08 = [
  ['Nume', 'Prenume', 'CNP'],
  ['Popescu', 'Ana', "'6100314091234"],
  ['Ionescu', 'Mihai', "'5091105092345"],
  ['Georgescu', 'Ioana', "'6100228093456"],
  ['Dumitru', 'Andrei', "'5100715094567"],
  ['Stan', 'Elena', "'6100101095678"],
  ['Radu', 'Victor', "'5090920096789"],
  ['Matei', 'Sofia', "'6100503097891"],
  ['Dinu', 'Paul', "'5100812098912"]
];
const LAT_08 = { A: 90, B: 76, C: 124, D: 124, E: 140, F: 100, G: 90 };
// foaia cu coloane suplimentare (antet + formule deja scrise, după nevoie)
function foaie08(antete, cells, extra) {
  const data = ELEVI_08.map((r, i) => (i === 0 ? r.concat(antete) : r.slice()));
  return Object.assign({ name: 'Elevi', rows: 12, cols: 9, data, bold: 'A1:H1', widths: LAT_08, cells: cells || {} }, extra || {});
}
const DATE_NASTERE_08 = { D2: '14.03.2010', D3: '05.11.2009', D4: '28.02.2010', D5: '15.07.2010', D6: '01.01.2010', D7: '20.09.2009', D8: '03.05.2010', D9: '12.08.2010' };

window.DATE_LECTII[8] = {
  nr: 8,
  titlu: 'Funcții text și dată',
  durata: 50,
  rezumat: 'Extragi bucăți dintr-un text (inițiale, codul clasei, data nașterii din CNP), lipești texte, schimbi majusculele și faci calcule cu date: vârsta, zile rămase până la vacanță, ziua săptămânii.',

  obiective: [
    'să extragi caractere cu [[fn:LEFT]], [[fn:RIGHT]] și [[fn:MID]] și să numeri caracterele cu [[fn:LEN]];',
    'să transformi textul cu [[fn:UPPER]], [[fn:LOWER]], [[fn:PROPER]], [[fn:TRIM]];',
    'să lipești texte cu operatorul <b>&amp;</b> și cu [[fn:CONCAT]];',
    'să folosești [[fn:TODAY]], [[fn:YEAR]], [[fn:MONTH]], [[fn:DAY]], [[fn:DATE]];',
    'să calculezi vârsta și intervale de timp cu [[fn:DATEDIF]] și prin scăderea datelor.'
  ],

  teorie: [
    {
      titlu: 'Extragerea din text: LEFT, RIGHT, MID, LEN',
      html: `
        <p>Pentru textul <b>„Brăila2025”</b> din A1:</p>
        <table class="tabel">
          <tr><th>Formula</th><th>Rezultat</th><th>Ce face</th></tr>
          <tr><td>[[=LEFT(A1,6)]]</td><td>Brăila</td><td>primele 6 caractere</td></tr>
          <tr><td>[[=RIGHT(A1,4)]]</td><td>2025</td><td>ultimele 4 caractere</td></tr>
          <tr><td>[[=MID(A1,7,2)]]</td><td>20</td><td>2 caractere, începând cu al 7-lea</td></tr>
          <tr><td>[[=LEN(A1)]]</td><td>10</td><td>numărul de caractere (inclusiv spațiile)</td></tr>
        </table>
        <div class="atentie"><strong>Rezultatul este text</strong>[[=RIGHT(A1,4)]] dă textul „2025”, nu numărul 2025. Pentru calcule îl transformi cu [[fn:VALUE]] sau îl folosești într-o operație: [[=RIGHT(A1,4)+1]].</div>`
    },
    {
      titlu: 'Transformarea și lipirea textelor',
      html: `
        <table class="tabel">
          <tr><th>Formula</th><th>Rezultat</th></tr>
          <tr><td>[[=UPPER("ana popescu")]]</td><td>ANA POPESCU</td></tr>
          <tr><td>[[=LOWER("ANA")]]</td><td>ana</td></tr>
          <tr><td>[[=PROPER("ana popescu")]]</td><td>Ana Popescu</td></tr>
          <tr><td>[[=TRIM("  Ana   Pop ")]]</td><td>Ana Pop (fără spațiile în plus)</td></tr>
          <tr><td>[[=A2&" "&B2]]</td><td>Popescu Ana (lipire cu un spațiu între)</td></tr>
          <tr><td>[[=CONCAT(B2,".",A2,"@cerna.ro")]]</td><td>Ana.Popescu@cerna.ro</td></tr>
        </table>
        <p>Operatorul <b>&amp;</b> și funcția [[fn:CONCAT]] fac același lucru. Pentru mai multe texte cu un separator există [[fn:TEXTJOIN]].
        Textele fixe (spațiu, punct, „@cerna.ro”) se scriu între ghilimele.</p>`
    },
    {
      titlu: 'Date calendaristice',
      html: `
        <p>O dată este un număr de zile, deci poți face calcule cu ea: [[=B2-A2]] este numărul de zile dintre două date, iar [[=A2+30]] este data de peste 30 de zile.</p>
        <table class="tabel">
          <tr><th>Formula</th><th>Rezultat</th></tr>
          <tr><td>[[=TODAY()]]</td><td>data de azi (se actualizează la fiecare deschidere)</td></tr>
          <tr><td>[[=NOW()]]</td><td>data și ora curentă</td></tr>
          <tr><td>[[=YEAR(A2)]], [[=MONTH(A2)]], [[=DAY(A2)]]</td><td>anul, luna, ziua</td></tr>
          <tr><td>[[=DATE(2026,6,19)]]</td><td>construiește data 19.06.2026 din an, lună, zi</td></tr>
          <tr><td>[[=WEEKDAY(A2,2)]]</td><td>ziua săptămânii: 1 = luni … 7 = duminică</td></tr>
          <tr><td>[[=TEXT(A2,"dddd")]]</td><td>numele zilei (de exemplu „vineri”)</td></tr>
        </table>`
    },
    {
      titlu: 'DATEDIF — vârsta și intervalele',
      html: `
        <p class="f f-bloc" data-f='=DATEDIF(data_start, data_final, "unitate")'></p>
        <table class="tabel">
          <tr><th>Unitate</th><th>Întoarce</th></tr>
          <tr><td>"Y"</td><td>ani întregi, deci vârsta: [[=DATEDIF(D2,TODAY(),"Y")]]</td></tr>
          <tr><td>"M"</td><td>luni întregi</td></tr>
          <tr><td>"D"</td><td>zile</td></tr>
          <tr><td>"YM" / "MD"</td><td>lunile rămase peste ani / zilele rămase peste luni</td></tr>
        </table>
        <p>[[fn:DATEDIF]] funcționează în Excel, dar nu apare în lista de funcții sugerate. Trebuie scrisă de mână. Data de început trebuie să fie înaintea celei finale, altfel apare #NUM!.</p>`
    },
    {
      titlu: 'Exemplu complet: data nașterii din CNP',
      html: `
        <p>CNP-ul are forma <b>S AA LL ZZ JJ NNN C</b>: sexul și secolul (5 = băiat, 6 = fată, născuți după 2000), anul, luna, ziua, codul județului (09 = Brăila), un număr de ordine și cifra de control.</p>
        <p>Pentru CNP-ul fictiv <b>6100314091234</b> din C2:</p>
        <ul>
          <li>anul: [[=MID(C2,2,2)]] → „10” → 2000 + 10 = 2010</li>
          <li>luna: [[=MID(C2,4,2)]] → „03”</li>
          <li>ziua: [[=MID(C2,6,2)]] → „14”</li>
          <li>data: [[=DATE(2000+MID(C2,2,2),MID(C2,4,2),MID(C2,6,2))]] → 14.03.2010</li>
          <li>sexul: [[=IF(LEFT(C2,1)="5","M","F")]] → F</li>
        </ul>
        <div class="nota"><strong>Date personale</strong>CNP-ul este o dată personală. În exerciții folosim doar CNP-uri inventate.</div>`
    }
  ],

  simulator: {
    titlu: 'Atelier: registrul elevilor',
    text: `<p>Încearcă pe lista elevilor (CNP-uri fictive):</p>
      <ul>
        <li><code>=A2&" "&B2</code> · <code>=UPPER(A2)</code> · <code>=LEN(A2)</code> · <code>=LEFT(B2,1)&"."</code></li>
        <li><code>=MID(C2,4,2)</code> (luna nașterii) · <code>=DATE(2000+MID(C2,2,2),MID(C2,4,2),MID(C2,6,2))</code></li>
        <li><code>=TODAY()</code> · <code>=DATEDIF(D2,TODAY(),"Y")</code> după ce ai calculat data nașterii în D2.</li>
      </ul>`,
    foi: [foaie08(['Data nașterii', 'Nume complet', 'E-mail', 'Vârsta'])]
  },

  animatii: [
    {
      id: 'o8-mid',
      titlu: 'MID pe un CNP: câte caractere, de unde',
      grila: { rows: 2, cols: 13, data: [['6', '1', '0', '0', '3', '1', '4', '0', '9', '1', '2', '3', '4'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']] },
      pasi: [
        { text: 'CNP-ul are 13 caractere. Rândul 2 arată <b>poziția</b> fiecăruia.', zona: ['A1:M1'] },
        { text: 'Prima cifră (poziția 1) este sexul: <b>6</b> = fată născută după 2000. [[=LEFT(C2,1)]]', gasit: ['A1'], mare: 'LEFT(C2,1) = "6"' },
        { text: 'Anul: începând cu poziția <b>2</b>, luăm <b>2</b> caractere → „10”. [[=MID(C2,2,2)]]', gasit: ['B1:C1'], aprinde: ['B2:C2'], mare: 'MID(C2,2,2) = "10"' },
        { text: 'Luna: de la poziția <b>4</b>, 2 caractere → „03”. [[=MID(C2,4,2)]]', gasit: ['D1:E1'], aprinde: ['D2:E2'], mare: 'MID(C2,4,2) = "03"' },
        { text: 'Ziua: de la poziția <b>6</b>, 2 caractere → „14”. [[=MID(C2,6,2)]]', gasit: ['F1:G1'], aprinde: ['F2:G2'], mare: 'MID(C2,6,2) = "14"' },
        { text: 'Pozițiile 8–9 sunt județul: „09” = Brăila. [[=MID(C2,8,2)]]', gasit: ['H1:I1'], aprinde: ['H2:I2'], mare: 'MID(C2,8,2) = "09"' },
        { text: 'Punem totul împreună cu [[fn:DATE]]: an 2000+10, luna 3, ziua 14.', mare: 'DATE(2010, 3, 14) = 14.03.2010' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o8-nume', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Numele complet',
      cerinta: 'În <b>D2:D9</b> scrie numele complet: numele din A, un spațiu, apoi prenumele din B (de exemplu „Popescu Ana”).',
      foi: [foaie08(['Nume complet'])],
      reguli: [{ formula: 'D2:D9', solutie: '=A2&" "&B2' }],
      indicii: ['Lipești trei bucăți: A2, un spațiu " " și B2.', '=A2&" "&B2']
    },
    {
      id: 'o8-initiale', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Inițialele',
      cerinta: 'În <b>D2:D9</b> afișează inițialele: prima literă a prenumelui și prima literă a numelui (Ana Popescu → „AP”).',
      foi: [foaie08(['Inițiale'])],
      reguli: [{ formula: 'D2:D9', solutie: '=LEFT(B2,1)&LEFT(A2,1)', functii: ['LEFT'] }],
      indicii: ['LEFT(B2,1) dă prima literă a prenumelui.', 'Lipește cele două inițiale cu &.']
    },
    {
      id: 'o8-email', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Adresa de e-mail',
      cerinta: 'În <b>D2:D9</b> construiește adresa de e-mail școlară: prenume.nume@cerna.ro, <b>scrisă cu litere mici</b> (de exemplu ana.popescu@cerna.ro).',
      foi: [foaie08(['E-mail'])],
      reguli: [{ formula: 'D2:D9', solutie: '=LOWER(B2&"."&A2)&"@cerna.ro"', functii: ['LOWER'] }],
      indicii: ['Întâi construiești textul B2&"."&A2&"@cerna.ro".', 'Apoi îl pui în LOWER(…) ca să treacă totul la litere mici.']
    },
    {
      id: 'o8-luna', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Luna nașterii din CNP',
      cerinta: 'În <b>D2:D9</b> extrage din CNP luna nașterii, <b>ca număr</b> (3, nu „03”). Luna este formată din caracterele 4 și 5.',
      foi: [foaie08(['Luna'])],
      reguli: [{ formula: 'D2:D9', solutie: '=VALUE(MID(C2,4,2))', functii: ['MID'] }],
      indicii: ['MID(C2,4,2) dă textul „03”.', 'Transformă-l în număr cu VALUE(…) sau adunând 0: MID(C2,4,2)+0.']
    },
    {
      id: 'o8-data', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Data nașterii din CNP',
      cerinta: 'Toți elevii sunt născuți după 2000. În <b>D2:D9</b> calculează data nașterii din CNP cu funcțiile [[fn:DATE]] și [[fn:MID]].',
      foi: [foaie08(['Data nașterii'], {}, { formats: { 'D2:D9': 'date' } })],
      reguli: [{ formula: 'D2:D9', solutie: '=DATE(2000+MID(C2,2,2),MID(C2,4,2),MID(C2,6,2))', functii: ['DATE', 'MID'] }],
      indicii: ['Anul = 2000 + caracterele 2–3; luna = caracterele 4–5; ziua = caracterele 6–7.', '=DATE(2000+MID(C2,2,2), MID(C2,4,2), MID(C2,6,2))']
    },
    {
      id: 'o8-varsta', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Vârsta la începutul anului școlar',
      cerinta: 'În <b>E2:E9</b> calculează vârsta fiecărui elev (în ani împliniți) la data din <b>H1</b> (începutul anului școlar), cu [[fn:DATEDIF]].',
      foi: [foaie08(['Data nașterii', 'Vârsta'], Object.assign({ G1: 'Data:', H1: '08.09.2025' }, DATE_NASTERE_08), { formats: { 'D2:D9': 'date' } })],
      reguli: [{ formula: 'E2:E9', solutie: '=DATEDIF(D2,$H$1,"Y")', functii: ['DATEDIF'] }],
      indicii: ['DATEDIF(data nașterii, data de referință, "Y").', 'H1 trebuie să rămână fixă la copiere: $H$1.']
    },
    {
      id: 'o8-rez-mid', tip: 'rezultat', nivel: 'baza', puncte: 5,
      titlu: 'Ce extrage MID?',
      cerinta: 'Ce rezultat dă formula?', formula: '=MID("Olimpiada2026",10,4)',
      indicii: ['„Olimpiada” are 9 litere, deci poziția 10 este prima cifră.'],
      explicatie: 'De la caracterul 10 se iau 4 caractere: „2026”.'
    },
    {
      id: 'o8-rez-len', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'Spații în plus',
      cerinta: 'Ce rezultat dă formula?', formula: '=LEN(TRIM("   Liceul   Cerna  "))',
      indicii: ['TRIM elimină spațiile de la capete și lasă un singur spațiu între cuvinte.', 'Rămâne „Liceul Cerna”. Numără și spațiul.'],
      explicatie: '„Liceul Cerna” are 6 + 1 + 5 = 12 caractere.'
    },
    {
      id: 'o8-greseala', tip: 'greseala', nivel: 'mediu', puncte: 10,
      titlu: 'Lipire greșită',
      cerinta: 'Formula ar trebui să lipească numele și prenumele, dar dă #VALUE!. Apasă pe bucățile greșite.',
      formula: '=A2+" "+B2', jetoane: ['=', 'A2', '+', '" "', '+', 'B2'], gresit: '+', corect: '=A2&" "&B2',
      indicii: ['Semnul + adună numere. Ce operator lipește texte?'],
      explicatie: 'Textele se lipesc cu &, nu cu +.'
    },
    {
      id: 'o8-datedif', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Funcții pentru date',
      cerinta: 'Potrivește formula cu rezultatul ei.',
      perechi: [['=TODAY()', 'data de azi'], ['=YEAR(A2)', 'anul din data A2'], ['=DATEDIF(A2,B2,"Y")', 'câți ani întregi sunt între două date'], ['=B2-A2', 'câte zile sunt între două date'], ['=DATE(2026,6,19)', 'data 19.06.2026'], ['=WEEKDAY(A2,2)', 'ziua săptămânii (1 = luni)']],
      indicii: ['Scăderea a două date dă zile.']
    }
  ],

  fisa: {
    titlu: 'Registrul elevilor',
    timp: 45,
    fisier: 'fisa-08-registrul-elevilor.xlsx',
    context: 'Secretariatul vrea să completeze automat datele elevilor pornind de la nume și CNP (fictive). Toate coloanele noi se completează cu formule. Toți elevii sunt născuți după 2000.',
    foi: [{ name: 'Elevi', data: ELEVI_08.concat([['Nistor', 'Vlad', "'5100211093123"], ['Popa', 'Bianca', "'6091230094234"]]), widths: { C: 130 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'În D: numele complet cu majuscule (de exemplu „POPESCU ANA”).', barem: '1p', solutie: '=UPPER(A2&" "&B2)' },
      { nivel: 'baza', puncte: 1, text: 'În E: adresa de e-mail prenume.nume@cerna.ro, cu litere mici.', barem: '1p', solutie: '=LOWER(B2&"."&A2&"@cerna.ro")' },
      { nivel: 'mediu', puncte: 1.5, text: 'În F: sexul („M” sau „F”) după prima cifră din CNP (5 = M, 6 = F).', barem: '1p IF + LEFT; 0,5p rezultat corect.', solutie: '=IF(LEFT(C2,1)="5","M","F")' },
      { nivel: 'mediu', puncte: 2, text: 'În G: data nașterii, extrasă din CNP și formatată ca dată; în H: codul județului (caracterele 8–9) și, în I, un mesaj „Brăila” dacă este 09, altfel „alt județ”.', barem: '1p data; 0,5p codul; 0,5p mesajul.', solutie: '=DATE(2000+MID(C2,2,2),MID(C2,4,2),MID(C2,6,2)); =MID(C2,8,2); =IF(H2="09","Brăila","alt județ")' },
      { nivel: 'avansat', puncte: 1.5, text: 'În J: vârsta în ani la data de azi ([[fn:TODAY]]); în K: câte zile mai sunt până la următoarea zi de naștere.', barem: '0,75p vârsta; 0,75p zilele (cu DATE, YEAR(TODAY()) și IF pentru ziua deja trecută).', solutie: '=DATEDIF(G2,TODAY(),"Y"); =DATE(YEAR(TODAY())+(DATE(YEAR(TODAY()),MONTH(G2),DAY(G2))<TODAY()),MONTH(G2),DAY(G2))-TODAY()' },
      { nivel: 'avansat', puncte: 2, text: 'În L: ziua săptămânii în care s-a născut elevul, în litere (de exemplu „duminică”), cu funcția [[fn:TEXT]]. Apoi verifică validitatea lungimii CNP-ului: în M afișează „corect” dacă are exact 13 caractere, altfel „greșit”.', barem: '1p TEXT(G2,"dddd"); 1p IF + LEN.', solutie: '=TEXT(G2,"dddd"); =IF(LEN(C2)=13,"corect","greșit")' }
    ]
  }
};
