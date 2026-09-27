/* =====================================================================
   data/lectii/ora-10.js — ORA 10: Sortare simplă și pe mai multe
   criterii; filtrare automată și avansată
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const CROS_10 = [
  ['Nume', 'Clasa', 'Gen', 'Localitate', 'Timp (min)', 'Puncte'],
  ['Andrei Maria', '10A', 'F', 'Brăila', 14.2, 86],
  ['Barbu Ștefan', '10B', 'M', 'Brăila', 12.8, 92],
  ['Constantin Ioana', '10A', 'F', 'Chiscani', 13.5, 90],
  ['Dobre Alexandru', '10C', 'M', 'Brăila', 15.9, 64],
  ['Enache Daria', '10B', 'F', 'Vădeni', 14.9, 78],
  ['Florea Matei', '10A', 'M', 'Brăila', 12.1, 97],
  ['Gheorghe Ana', '10C', 'F', 'Tichilești', 16.4, 61],
  ['Ionescu Radu', '10B', 'M', 'Brăila', 13.2, 88],
  ['Marin Elena', '10C', 'F', 'Brăila', 14.6, 81],
  ['Nistor Vlad', '10A', 'M', 'Chiscani', 13.9, 85],
  ['Popa Bianca', '10B', 'F', 'Brăila', 15.3, 72],
  ['Stoica Andrei', '10C', 'M', 'Vădeni', 12.5, 94],
  ['Tudor Irina', '10A', 'F', 'Brăila', 15.0, 76],
  ['Vasile Darius', '10B', 'M', 'Brăila', 14.4, 83],
  ['Zamfir Sara', '10C', 'F', 'Chiscani', 13.8, 87],
  ['Neagu Tudor', '10B', 'M', 'Chiscani', 16.0, 66]
];
const LAT_10 = { A: 124, B: 50, C: 40, D: 86, E: 80, F: 56, G: 20, H: 86, I: 70, J: 60, K: 80, L: 60 };
const FOAIE_10 = (extra) => Object.assign({ name: 'Cros', rows: 22, cols: 13, data: CROS_10, bold: 'A1:F1', fill: 'A1:F1', widths: LAT_10 }, extra || {});

window.DATE_LECTII[10] = {
  nr: 10,
  titlu: 'Sortare și filtrare',
  durata: 50,
  rezumat: 'Pui datele în ordinea dorită (după un criteriu sau mai multe) și afișezi doar rândurile care te interesează: cu filtrul automat pentru întrebări rapide, cu filtrul avansat pentru condiții complexe.',

  obiective: [
    'să sortezi un tabel crescător sau descrescător, fără să „rupi” rândurile;',
    'să sortezi pe mai multe niveluri (de exemplu după clasă, apoi după timp);',
    'să folosești <b>filtrul automat</b>: filtre după valori, numerice și de text, pe mai multe coloane;',
    'să construiești o <b>zonă de criterii</b> și să aplici <b>filtrul avansat</b>, pe loc sau cu copiere;',
    'să folosești [[fn:SUBTOTAL]] pentru a calcula doar pe rândurile vizibile.'
  ],

  teorie: [
    {
      titlu: 'Sortarea',
      html: `
        <p>Selectezi <b>o singură celulă</b> din tabel și alegi <i>Date → Sortare A→Z</i> sau <i>Z→A</i> (<i>Data → Sort</i>). Excel detectează singur tot tabelul și antetul, iar rândurile se mută întregi.</p>
        <table class="tabel">
          <tr><th>Tip de date</th><th>A → Z (crescător)</th><th>Z → A (descrescător)</th></tr>
          <tr><td>text</td><td>alfabetic</td><td>invers alfabetic</td></tr>
          <tr><td>numere</td><td>de la mic la mare</td><td>de la mare la mic</td></tr>
          <tr><td>date</td><td>de la cele vechi la cele noi</td><td>de la cele noi la cele vechi</td></tr>
        </table>
        <div class="atentie"><strong>Nu selecta o singură coloană!</strong>Dacă selectezi doar coloana „Puncte” și o sortezi, punctele se reordonează, dar numele rămân pe loc, deci datele se amestecă. Excel te avertizează: alege <i>Extinde selecția</i>.</div>`
    },
    {
      titlu: 'Sortarea pe mai multe niveluri',
      html: `
        <p><i>Date → Sortare</i> (<i>Custom Sort</i>) deschide o fereastră în care adaugi niveluri: „Sortare după Clasa (A→Z)”, apoi „după Timp (crescător)”.
        Al doilea criteriu decide doar între rândurile egale la primul criteriu, adică elevii din aceeași clasă.</p>
        <p>Mai poți sorta după culoarea celulei sau după o listă personalizată (de exemplu luni, marți… în loc de ordinea alfabetică).</p>
        <p>În simulator: <b>Date ▾ → Sortare personalizată…</b></p>`
    },
    {
      titlu: 'Filtrul automat',
      html: `
        <p><i>Date → Filtru</i> ([[k:Ctrl+Shift+L]]) adaugă câte un buton ▾ în fiecare antet. Din el:</p>
        <ul>
          <li>bifezi valorile pe care vrei să le vezi (de exemplu doar „10A”);</li>
          <li>alegi un <b>filtru numeric</b> („mai mare sau egal cu 80”, „primele 10”, „peste medie”) sau un <b>filtru de text</b> („începe cu”, „conține”);</li>
          <li>poți filtra pe <b>mai multe coloane</b>. Rămân vizibile rândurile care îndeplinesc toate condițiile (ȘI).</li>
        </ul>
        <p>Rândurile nu sunt șterse, ci doar <b>ascunse</b>. Numerele lor apar în albastru, iar butonul coloanei filtrate își schimbă forma. <i>Golire filtru</i> le reafișează.</p>
        <div class="nota"><strong>SUM sau SUBTOTAL?</strong>[[=SUM(F2:F17)]] adună toate rândurile, și pe cele ascunse. [[=SUBTOTAL(9,F2:F17)]] adună doar rândurile vizibile după filtrare. Codurile SUBTOTAL: 1 = medie, 2 = numărare, 9 = sumă, 4 = maxim, 5 = minim.</div>`
    },
    {
      titlu: 'Filtrul avansat',
      html: `
        <p>Pentru condiții mai complicate construiești o <b>zonă de criterii</b>: copiezi antetele coloanelor, iar sub ele scrii condițiile.</p>
        <table class="tabel">
          <tr><th>Zona de criterii</th><th>Înseamnă</th></tr>
          <tr><td><code>Clasa | Puncte</code><br><code>10A&nbsp;&nbsp;| &gt;90</code></td><td>din 10A <b>și</b> peste 90 de puncte (același rând = ȘI)</td></tr>
          <tr><td><code>Clasa | Puncte</code><br><code>10A&nbsp;&nbsp;|</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &gt;90</code></td><td>din 10A <b>sau</b> peste 90 de puncte (rânduri diferite = SAU)</td></tr>
        </table>
        <p><i>Date → Complex</i> (<i>Advanced</i>): alegi zona listei, zona de criterii și dacă filtrezi <b>pe loc</b> sau <b>copiezi</b> rezultatul în altă zonă. Poți bifa „Doar înregistrări unice” ca să elimini duplicatele.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: Cupa Brăilei la cros',
    text: `<p>Folosește meniul <b>Date ▾</b> din bara de unelte a simulatorului:</p>
      <ul>
        <li>Selectează o celulă din coloana Puncte → <i>Sortare Z → A</i>.</li>
        <li><i>Sortare personalizată…</i>: Clasa A → Z, apoi Timp crescător.</li>
        <li><i>Filtru automat: activează</i>, apoi apasă ▾ în antetul Gen și lasă doar „F”. Scrie în H20 <code>=SUBTOTAL(9,F2:F17)</code> și compară cu <code>=SUM(F2:F17)</code>.</li>
      </ul>`,
    inaltime: 400,
    foi: [FOAIE_10()]
  },

  animatii: [
    {
      id: 'o10-niveluri',
      titlu: 'Sortarea pe două niveluri',
      grila: { rows: 6, cols: 3, data: [['Nume', 'Clasa', 'Timp'], ['Ana', '10B', 14.9], ['Matei', '10A', 12.1], ['Radu', '10B', 13.2], ['Ioana', '10A', 13.5], ['Vlad', '10A', 13.9]] },
      pasi: [
        { text: 'Vrem clasele în ordine, iar în fiecare clasă cel mai rapid elev primul.', zona: ['A2:C6'] },
        { text: 'Nivelul 1: <b>Clasa A → Z</b>. Toți elevii din 10A urcă, cei din 10B coboară. Rândurile se mută întregi.', celule: { A2: 'Matei', B2: '10A', C2: 12.1, A3: 'Ioana', B3: '10A', C3: 13.5, A4: 'Vlad', B4: '10A', C4: 13.9, A5: 'Ana', B5: '10B', C5: 14.9, A6: 'Radu', B6: '10B', C6: 13.2 }, aprinde: ['B2:B6'] },
        { text: 'Nivelul 2: <b>Timp crescător</b>, doar în interiorul fiecărei clase. În 10A ordinea 12,1 · 13,5 · 13,9 este deja bună.', zona: ['A2:C4'], aprinde: ['C2:C4'] },
        { text: 'În 10B, Radu (13,2) trebuie să fie înaintea Anei (14,9). Cele două rânduri se schimbă între ele.', celule: { A5: 'Radu', C5: 13.2, A6: 'Ana', C6: 14.9 }, zona: ['A5:C6'], aprinde: ['C5:C6'] },
        { text: 'Rezultatul: clasele în ordine, iar în fiecare clasă timpii în ordine crescătoare.', gasit: ['A2', 'A5'] }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o10-sort1', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Clasamentul',
      cerinta: 'Sortează tabelul după <b>Puncte</b>, descrescător (cel mai bun primul). Folosește meniul <b>Date ▾</b>.',
      foi: [FOAIE_10()], meniuri: ['date'], selecteaza: 'F2',
      reguli: [{ sortat: 'A1:F17', chei: [{ col: 'Puncte', desc: true }] }],
      indicii: ['Selectează o celulă din coloana Puncte (nu toată coloana!).', 'Date ▾ → Sortare Z → A.'],
      solutieText: 'Selectezi F2 → Date → Sortare Z → A. Florea Matei (97) ajunge primul.'
    },
    {
      id: 'o10-sort2', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Pe clase, apoi după timp',
      cerinta: 'Sortează tabelul după <b>Clasa</b> (A → Z), iar în cadrul fiecărei clase după <b>Timp</b> crescător.',
      foi: [FOAIE_10()], meniuri: ['date'], selecteaza: 'A2',
      reguli: [{ sortat: 'A1:F17', chei: [{ col: 'Clasa', desc: false }, { col: 'Timp (min)', desc: false }] }],
      indicii: ['Ai nevoie de Sortare personalizată, cu două niveluri.', 'Nivelul 1: Clasa, A → Z. Nivelul 2 („Apoi după”): Timp, crescător.']
    },
    {
      id: 'o10-filtru1', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Fetele din 10B',
      cerinta: 'Folosește <b>filtrul automat</b> ca să rămână vizibile doar <b>fetele</b> din clasa <b>10B</b>.',
      foi: [FOAIE_10()], meniuri: ['date'], selecteaza: 'A2',
      reguli: [{ vizibile: { zona: 'A1:F17', conditie: (x) => x['Gen'] === 'F' && x['Clasa'] === '10B' } }],
      indicii: ['Date ▾ → Filtru automat: activează. Apar butoane ▾ în antet.', 'Filtrează coloana Clasa (doar 10B), apoi coloana Gen (doar F).']
    },
    {
      id: 'o10-filtru2', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Cel puțin 85 de puncte',
      cerinta: 'Cu filtrul automat, afișează doar participanții cu <b>cel puțin 85</b> de puncte (filtru după condiție, nu bifând valori).',
      foi: [FOAIE_10()], meniuri: ['date'], selecteaza: 'F2',
      reguli: [{ vizibile: { zona: 'A1:F17', conditie: (x) => x['Puncte'] >= 85 } }],
      indicii: ['În fereastra filtrului coloanei Puncte folosește „Filtru după condiție”.', 'Alege „mai mare sau egal cu” și scrie 85.']
    },
    {
      id: 'o10-subtotal', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Suma doar a rândurilor vizibile',
      cerinta: 'În <b>F19</b> scrie o formulă care adună punctele <b>doar pentru rândurile vizibile</b>, astfel încât rezultatul să se schimbe când filtrezi tabelul.',
      foi: [FOAIE_10({ cells: { E19: 'Total vizibil:' } })], meniuri: ['date'],
      reguli: [{ formula: 'F19', solutie: '=SUBTOTAL(9,F2:F17)', functii: ['SUBTOTAL'] }],
      indicii: ['SUM adună și rândurile ascunse. Ai nevoie de altă funcție.', 'SUBTOTAL cu codul 9 înseamnă sumă: =SUBTOTAL(9,F2:F17).']
    },
    {
      id: 'o10-avansat', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Filtrul avansat cu SAU',
      cerinta: 'Zona de criterii <b>H1:I3</b> este gata: elevii din <b>10A</b> <u>sau</u> cei cu <b>peste 90</b> de puncte. Aplică <b>filtrul avansat</b> pe lista A1:F17 și copiază rezultatul începând din celula <b>H6</b>.',
      foi: [FOAIE_10({ cells: { H1: 'Clasa', I1: 'Puncte', H2: '10A', I3: '>90', H5: 'Rezultatul filtrului avansat:' }, bold: ['A1:F1', 'H1:I1'] })], meniuri: ['date'], selecteaza: 'A2',
      reguli: [{ copiat: { zona: 'A1:F17', dest: 'H6', conditie: (x) => x['Clasa'] === '10A' || x['Puncte'] > 90 } }],
      indicii: ['Date ▾ → Filtru avansat…', 'Zona listei: A1:F17 · Zona de criterii: H1:I3 · Copiază în altă locație: H6.'],
      solutieText: 'Filtru avansat: lista A1:F17, criterii H1:I3, copiere în H6. Rezultă 7 rânduri: cei 5 elevi din 10A, plus Barbu Ștefan (92) și Stoica Andrei (94).'
    },
    {
      id: 'o10-pericol', tip: 'grila', nivel: 'baza', puncte: 5,
      titlu: 'O coloană sortată singură',
      cerinta: 'Ce se întâmplă dacă selectezi <b>doar</b> coloana Puncte și o sortezi, fără să extinzi selecția?',
      variante: ['Punctele se reordonează, dar numele rămân pe loc, deci datele se amestecă', 'Tot tabelul se sortează corect', 'Excel șterge coloana', 'Apare eroarea #REF!'], corect: 0,
      indicii: ['Rândurile se mută întregi doar dacă sunt incluse în sortare.']
    },
    {
      id: 'o10-pasi', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Pașii filtrului avansat',
      cerinta: 'Ordonează pașii pentru a copia într-o zonă nouă elevii din 10C cu cel puțin 80 de puncte.',
      pasi: ['Copiază antetele „Clasa” și „Puncte” într-o zonă liberă (zona de criterii).', 'Sub ele, pe același rând, scrie 10C și >=80.', 'Selectează o celulă din listă și alege Date → Complex (Advanced).', 'Verifică zona listei și alege zona de criterii.', 'Bifează „Copiere în altă locație” și alege celula de destinație.', 'Apasă OK și verifică rezultatul.'],
      indicii: ['Criteriile se scriu înainte de a deschide fereastra filtrului.']
    },
    {
      id: 'o10-criterii', tip: 'potrivire', nivel: 'avansat', puncte: 10,
      titlu: 'Citește zona de criterii',
      cerinta: 'Potrivește fiecare zonă de criterii (antetele sunt Clasa și Puncte) cu rezultatul ei.',
      perechi: [
        ['10A și >80 pe același rând', 'elevii din 10A cu peste 80 de puncte'],
        ['10A pe un rând, >80 pe rândul următor', 'elevii din 10A, plus toți cei cu peste 80'],
        ['10A pe un rând, 10B pe rândul următor', 'elevii din 10A sau 10B'],
        ['doar >=90 sub Puncte', 'toți elevii cu cel puțin 90 de puncte']
      ],
      indicii: ['Același rând = ȘI, rânduri diferite = SAU.']
    }
  ],

  fisa: {
    titlu: 'Cupa Brăilei la cros',
    timp: 40,
    fisier: 'fisa-10-cros.xlsx',
    context: 'Organizatorii Cupei Brăilei au nevoie de mai multe clasamente și liste. Pentru fiecare cerință creează o <b>copie</b> a foii (clic dreapta pe etichetă → Mutare sau copiere), ca să nu se piardă ordinea inițială.',
    foi: [{ name: 'Rezultate', data: CROS_10.concat([['Radu Ilinca', '10A', 'F', 'Vădeni', 14.1, 84], ['Sava Mihnea', '10C', 'M', 'Brăila', 13.0, 91], ['Toma Iulia', '10B', 'F', 'Chiscani', 15.6, 70], ['Ursu Victor', '10A', 'M', 'Tichilești', 14.8, 79]]), widths: { A: 130 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'Foaia „Clasament”: sortează după Puncte descrescător.', barem: '1p — rândurile rămân întregi.' },
      { nivel: 'baza', puncte: 1.5, text: 'Foaia „Pe clase”: sortează după Clasa (A → Z), apoi după Gen, apoi după Timp crescător.', barem: '0,5p pentru fiecare nivel corect.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Foaia „Filtre”: cu filtrul automat, afișează băieții din Brăila cu timpul sub 14 minute. Sub tabel, calculează cu [[fn:SUBTOTAL]] media punctelor rândurilor vizibile.', barem: '1p filtre corecte; 0,5p =SUBTOTAL(1,F2:F21).' },
      { nivel: 'mediu', puncte: 1.5, text: 'Pe aceeași foaie, schimbă filtrul: participanții al căror nume <b>conține</b> „escu” sau „an”. Folosește filtrul de text personalizat.', barem: '1,5p filtru de text corect.' },
      { nivel: 'avansat', puncte: 2.5, text: 'Foaia „Avansat”: construiește zona de criterii și aplică filtrul avansat cu copiere pentru participanții care sunt (fete din 10B) <b>sau</b> (băieți cu peste 90 de puncte).', barem: '1,5p zona de criterii corectă (2 rânduri, 3 coloane); 1p rezultatul copiat.' },
      { nivel: 'avansat', puncte: 1, text: 'Tot cu filtrul avansat, extrage lista <b>localităților</b> (fără repetări), bifând „Doar înregistrări unice”.', barem: '1p listă de 5 localități distincte.' }
    ]
  }
};
