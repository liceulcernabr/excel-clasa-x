/* =====================================================================
   data/lectii/ora-11.js — ORA 11: Formatare condiționată și
   validarea datelor (liste derulante, mesaje de eroare)
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const SITUATIE_11 = [
  ['Elev', 'Clasa', 'Media', 'Absențe', 'Bursier'],
  ['Andrei Maria', '10A', 9.45, 4, 'Da'],
  ['Barbu Ștefan', '10B', 7.8, 12, 'Nu'],
  ['Constantin Ioana', '10A', 9.9, 0, 'Da'],
  ['Dobre Alexandru', '10B', 4.75, 23, 'Nu'],
  ['Enache Daria', '10A', 8.6, 6, 'Nu'],
  ['Florea Matei', '10B', 8.15, 2, 'Nu'],
  ['Gheorghe Ana', '10A', 9.2, 9, 'Da'],
  ['Ionescu Radu', '10B', 4.3, 17, 'Nu'],
  ['Marin Elena', '10A', 8.75, 5, 'Nu'],
  ['Nistor Vlad', '10B', 9.05, 3, 'Da'],
  ['Popa Bianca', '10A', 6.9, 11, 'Nu'],
  ['Stoica Andrei', '10B', 7.65, 8, 'Nu']
];
const LAT_11 = { A: 124, B: 50, C: 60, D: 66, E: 66, F: 96, G: 70, H: 100 };
const FOAIE_11 = (extra) => Object.assign({ name: 'Situație', rows: 15, cols: 9, data: SITUATIE_11, bold: 'A1:H1', fill: 'A1:E1', widths: LAT_11, formats: { 'C2:C13': 'number:2' } }, extra || {});
// al k-lea cel mai mare număr dintr-o coloană (pentru verificarea regulii „primele N”)
function alKlea11(wb, c, k) {
  const l = [];
  for (let r = 1; r <= 12; r++) { const v = wb.getValue(0, r, c); if (typeof v === 'number') l.push(v); }
  return l.sort((a, b) => b - a)[k - 1];
}

window.DATE_LECTII[11] = {
  nr: 11,
  titlu: 'Formatare condiționată și validare',
  durata: 50,
  rezumat: 'Celulele își schimbă singure culoarea după valoare: mediile sub 5 apar cu roșu, iar cei mai buni elevi cu verde. Validarea datelor oprește greșelile de la intrare: liste derulante, doar note între 1 și 10, mesaje clare.',

  obiective: [
    'să aplici reguli de <b>formatare condiționată</b> după valoare, text, primele N sau peste medie;',
    'să folosești o <b>formulă</b> ca regulă și să colorezi rânduri întregi (cu $ la coloană);',
    'să folosești bare de date și scale de culori;',
    'să creezi <b>liste derulante</b> cu validarea datelor;',
    'să restricționezi valorile (număr întreg, dată, lungime text) și să scrii mesaje de intrare și de eroare.'
  ],

  teorie: [
    {
      titlu: 'Formatarea condiționată',
      html: `
        <p><i>Pornire → Formatare condiționată</i> (<i>Home → Conditional Formatting</i>) aplică un format numai celulelor care îndeplinesc o condiție. Formatul se actualizează singur când se schimbă valorile.</p>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Tip de regulă</th><th>Exemplu</th></tr>
          <tr><td>evidențiere după valoare</td><td>mai mic decât 5 · între 5 și 7 · egal cu 10</td></tr>
          <tr><td>text care conține</td><td>„Brăila”</td></tr>
          <tr><td>primele / ultimele N</td><td>primele 3 medii · ultimele 10%</td></tr>
          <tr><td>peste / sub medie</td><td>mediile peste media clasei</td></tr>
          <tr><td>valori duplicate</td><td>nume scrise de două ori</td></tr>
          <tr><td>bare de date</td><td>o bară proporțională cu valoarea, în celulă</td></tr>
          <tr><td>scală de culori</td><td>de la roșu (mic) la verde (mare)</td></tr>
        </table></div>
        <p>Regulile se văd și se șterg din <i>Gestionare reguli</i>. În simulator: <b>Formatare condiționată ▾</b>.</p>`
    },
    {
      titlu: 'Regula cu formulă',
      html: `
        <p>Cea mai puternică variantă este <i>Utilizare formulă pentru a determina celulele de formatat</i>. Scrii o condiție <b>pentru prima celulă</b> a zonei, iar Excel o „copiază” pe celelalte, ca la o formulă obișnuită.</p>
        <p>Ca să colorezi <b>tot rândul</b> elevilor bursieri, selectezi A2:E13 și scrii formula:</p>
        <p class="f f-bloc" data-f='=$E2="Da"'></p>
        <p><b>$E</b> fixează coloana: fiecare celulă de pe rând verifică tot coloana E. Rândul <b>2</b> rămâne relativ, deci rândul 7 verifică E7.</p>
        <div class="atentie"><strong>Greșeala frecventă</strong>Cu <code>=$E$2="Da"</code> toate rândurile verifică E2, așa că se colorează ori tot tabelul, ori nimic.</div>`
    },
    {
      titlu: 'Validarea datelor',
      html: `
        <p><i>Date → Validare date</i> (<i>Data → Data Validation</i>) stabilește ce valori sunt permise într-o celulă:</p>
        <table class="tabel">
          <tr><th>Se permite</th><th>Exemplu</th></tr>
          <tr><td>Listă</td><td><code>Da,Nu</code> sau o zonă: <code>=$J$2:$J$5</code>. Apare o <b>listă derulantă</b></td></tr>
          <tr><td>Număr întreg</td><td>între 1 și 10 (note)</td></tr>
          <tr><td>Zecimal</td><td>între 0 și 100</td></tr>
          <tr><td>Dată</td><td>între 01.09.2025 și 30.06.2026 (anul școlar)</td></tr>
          <tr><td>Lungime text</td><td>exact 13 caractere (CNP)</td></tr>
        </table>
        <p><b>Mesajul de intrare</b> apare când selectezi celula („Scrie o notă între 1 și 10”). <b>Avertismentul de eroare</b> apare la o valoare greșită și are trei stiluri:</p>
        <ul>
          <li><b>Stop</b>: valoarea este refuzată;</li>
          <li><b>Avertisment</b>: întreabă dacă vrei să continui;</li>
          <li><b>Informare</b>: doar anunță, valoarea este acceptată.</li>
        </ul>
        <p><i>Încercuire date nevalide</i> marchează valorile greșite scrise <b>înainte</b> de a pune regula.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: situația școlară',
    text: `<p>Folosește meniurile <b>Formatare condiționată ▾</b> și <b>Date ▾</b>:</p>
      <ul>
        <li>Selectează C2:C13 → Regulă nouă → <i>Mai mic decât</i> 5, cu umplere roșie. Schimbă o medie și urmărește culoarea.</li>
        <li>Selectează A2:E13 → Regulă nouă → <i>Folosește o formulă</i>: <code>=$E2="Da"</code>, cu umplere verde.</li>
        <li>Selectează D2:D13 → <i>Bare de date</i>.</li>
        <li>Selectează F2:F13 → Date ▾ → Validarea datelor → Listă: <code>Da,Nu</code>. Apare butonul ▾ lângă celulă.</li>
      </ul>`,
    foi: [FOAIE_11({ cells: { F1: 'Excursie' } })]
  },

  animatii: [
    {
      id: 'o11-formula',
      titlu: 'Regula =$E2="Da" aplicată pe fiecare rând',
      grila: { rows: 5, cols: 5, data: [['Elev', 'Clasa', 'Media', 'Abs.', 'Bursier'], ['Maria', '10A', 9.45, 4, 'Da'], ['Ștefan', '10B', 7.8, 12, 'Nu'], ['Ioana', '10A', 9.9, 0, 'Da'], ['Alex', '10B', 4.75, 23, 'Nu']] },
      pasi: [
        { text: 'Zona A2:E5, regula scrisă pentru prima celulă (A2):', formula: '=$E2="Da"', zona: ['A2:E5'] },
        { text: 'Pentru rândul 2: E2 = „Da” → TRUE. <b>Tot rândul</b> se colorează, pentru că toate celulele lui verifică $E2.', gasit: ['A2:E2'], ref0: ['E2'] },
        { text: 'Pentru rândul 3 regula devine =$E3="Da". E3 = „Nu” → rândul rămâne necolorat.', gasit: ['A2:E2'], cauta: ['E3'], ref0: ['E3'] },
        { text: 'Rândul 4: =$E4="Da" → TRUE → colorat.', gasit: ['A2:E2', 'A4:E4'], ref0: ['E4'] },
        { text: 'Rândul 5: E5 = „Nu” → necolorat. Coloana e fixată cu $, rândul se schimbă odată cu celula verificată.', gasit: ['A2:E2', 'A4:E4'], cauta: ['E5'], mare: '$E fix · rândul se schimbă' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o11-sub5', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Mediile de corigență',
      cerinta: 'Evidențiază cu o regulă de formatare condiționată (de exemplu umplere roșie) mediile din <b>C2:C13</b> care sunt <b>mai mici decât 5</b>.',
      foi: [FOAIE_11()], meniuri: ['conditionat'], selecteaza: 'C2',
      reguli: [{ cfEfect: { zona: 'C2:C13', conditie: (v) => typeof v === 'number' && v < 5 } }],
      indicii: ['Selectează C2:C13 înainte de a crea regula.', 'Formatare condiționată ▾ → Regulă nouă → „Mai mic decât”, valoarea 5.']
    },
    {
      id: 'o11-top', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Primele trei medii',
      cerinta: 'Evidențiază cu verde <b>primele 3</b> medii din C2:C13, cu o regulă de tip „primele N”.',
      foi: [FOAIE_11()], meniuri: ['conditionat'], selecteaza: 'C2',
      reguli: [{ cfEfect: { zona: 'C2:C13', tip: 'top', conditie: (v, r, c, wb) => typeof v === 'number' && v >= alKlea11(wb, 2, 3) } }],
      indicii: ['Tipul de regulă este „Primele N valori”.', 'N = 3, formatare verde.']
    },
    {
      id: 'o11-rand', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Rândurile bursierilor',
      cerinta: 'Colorează <b>rândul întreg</b> (A:E) al elevilor bursieri, cu o regulă bazată pe <b>formulă</b>. Colorarea trebuie să se actualizeze dacă schimbi „Da” / „Nu” în coloana E.',
      foi: [FOAIE_11()], meniuri: ['conditionat'], selecteaza: 'A2',
      reguli: [{ cfEfect: { zona: 'A2:E13', tip: 'formula', conditie: (v, r, c, wb) => wb.getValue(0, r, 4) === 'Da' } }],
      indicii: ['Selectează toată zona A2:E13 înainte de a crea regula.', 'Tipul: „Folosește o formulă”. Formula pentru primul rând: =$E2="Da". Coloana are $, rândul nu.']
    },
    {
      id: 'o11-bare', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Bare de date',
      cerinta: 'Adaugă <b>bare de date</b> pe coloana absențelor (D2:D13), ca să se vadă dintr-o privire cine are multe absențe.',
      foi: [FOAIE_11()], meniuri: ['conditionat'], selecteaza: 'D2',
      reguli: [{ cfTip: 'bare', zona: 'D2:D13' }],
      indicii: ['Selectează D2:D13.', 'Regulă nouă → tipul „Bare de date”.']
    },
    {
      id: 'o11-lista', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Listă derulantă',
      cerinta: 'În coloana <b>F</b> („Excursie”, F2:F13) se poate scrie doar <b>Da</b> sau <b>Nu</b>. Creează o regulă de validare de tip listă.',
      foi: [FOAIE_11({ cells: { F1: 'Excursie' } })], meniuri: ['date'], selecteaza: 'F2',
      reguli: [
        { validare: { celula: 'F2', accepta: ['Da', 'Nu'], refuza: ['Poate', '1'] } },
        { validare: { celula: 'F13', accepta: ['Da', 'Nu'], refuza: ['x'] } }
      ],
      indicii: ['Selectează F2:F13, apoi Date ▾ → Validarea datelor…', 'Se permite: Listă; sursa: Da,Nu']
    },
    {
      id: 'o11-note', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Doar note între 1 și 10',
      cerinta: 'În G2:G13 („Nota teză”) se pot scrie doar <b>numere întregi între 1 și 10</b>. Adaugă și un <b>mesaj de eroare</b> care îi explică utilizatorului ce a greșit.',
      foi: [FOAIE_11({ cells: { G1: 'Nota teză' } })], meniuri: ['date'], selecteaza: 'G2',
      reguli: [{ validare: { celula: 'G2', accepta: ['1', '7', '10'], refuza: ['0', '11', '7,5', 'zece'], mesajEroare: true } }, { validare: { celula: 'G13', accepta: ['5'], refuza: ['12'] } }],
      indicii: ['Se permite: Număr întreg; Date: între; minim 1, maxim 10.', 'Completează și câmpurile de la „Avertisment de eroare”.']
    },
    {
      id: 'o11-data', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Data din anul școlar',
      cerinta: 'În H2:H13 („Data tezei”) se acceptă doar date din anul școlar: între <b>01.09.2025</b> și <b>30.06.2026</b>. Adaugă și un <b>mesaj de intrare</b>.',
      foi: [FOAIE_11({ cells: { H1: 'Data tezei' } })], meniuri: ['date'], selecteaza: 'H2',
      reguli: [{ validare: { celula: 'H2', accepta: ['15.10.2025', '01.09.2025', '30.06.2026'], refuza: ['31.08.2025', '01.07.2026', 'mâine'], mesajIntrare: true } }],
      indicii: ['Se permite: Dată; între 01.09.2025 și 30.06.2026.', 'Mesajul de intrare apare când se selectează celula: de exemplu „Scrie data în anul școlar 2025–2026”.']
    },
    {
      id: 'o11-dolar', tip: 'grila', nivel: 'avansat', puncte: 10,
      titlu: 'Unde pui $?',
      cerinta: 'Vrei să colorezi rândurile A2:F20 pentru care nota din coloana C este cel puțin 9. Ce formulă folosești în regulă?',
      variante: ['=$C2>=9', '=$C$2>=9', '=C$2>=9', '=C2>=9'], corect: 0,
      indicii: ['Toate celulele unui rând trebuie să verifice coloana C, dar fiecare rând trebuie să verifice rândul lui.'],
      explicatie: '$C fixează coloana. Rândul 2 rămâne relativ și se schimbă pentru fiecare rând.'
    },
    {
      id: 'o11-stiluri', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Stilurile avertismentului de eroare',
      cerinta: 'Potrivește stilul cu ce se întâmplă la o valoare greșită.',
      perechi: [['Stop', 'valoarea este refuzată'], ['Avertisment', 'întreabă dacă vrei să continui'], ['Informare', 'anunță, dar acceptă valoarea'], ['Mesaj de intrare', 'apare când selectezi celula, înainte de a scrie']],
      indicii: ['Stop este cel mai strict.']
    }
  ],

  fisa: {
    titlu: 'Formularul de înscriere la excursie',
    timp: 40,
    fisier: 'fisa-11-inscriere-excursie.xlsx',
    context: 'Dirigintele pregătește un formular electronic de înscriere la excursia de la Sinaia și vrea să evite greșelile de completare. Pe foaia <b>Liste</b> sunt valorile permise.',
    foi: [
      { name: 'Înscriere', data: [['Elev', 'Clasa', 'Telefon părinte', 'Data nașterii', 'Mijloc de transport', 'Avans plătit (lei)', 'Acord părinte', 'Media']].concat(SITUATIE_11.slice(1).map((r) => [r[0], r[1], '', '', '', '', '', r[2]])), widths: { A: 130, C: 110, D: 100, E: 130, F: 110, G: 100 } },
      { name: 'Liste', data: [['Clase', 'Transport'], ['10A', 'Autocar'], ['10B', 'Tren'], ['10C', 'Mașina părinților']] }
    ],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'Coloana <b>Acord părinte</b>: listă derulantă cu valorile Da, Nu.', barem: '1p' },
      { nivel: 'baza', puncte: 1.5, text: 'Coloana <b>Mijloc de transport</b>: listă derulantă cu sursa din foaia Liste (B2:B4).', barem: '1p sursa ca zonă; 0,5p funcționează pe toată coloana.', solutie: 'Sursa: =Liste!$B$2:$B$4' },
      { nivel: 'mediu', puncte: 1.5, text: 'Coloana <b>Telefon părinte</b>: lungimea textului exact 10 caractere; mesaj de intrare și mesaj de eroare de tip Stop.', barem: '0,5p regula; 0,5p mesaj de intrare; 0,5p mesaj de eroare.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Coloana <b>Avans plătit</b>: număr zecimal între 0 și 350; stil de eroare <b>Avertisment</b>. Aplică apoi pe aceeași coloană o scală de culori.', barem: '1p validare; 0,5p scală de culori.' },
      { nivel: 'avansat', puncte: 1.5, text: 'Formatare condiționată cu <b>formulă</b>: colorează cu roșu rândul întreg al elevilor care nu au acordul părintelui (Acord părinte = „Nu”), iar cu verde pe cei cu acord <b>și</b> avansul complet (350 lei).', barem: '0,75p fiecare regulă cu formulă corectă ($G2 / AND).', solutie: '=$G2="Nu"; =AND($G2="Da",$F2=350)' },
      { nivel: 'avansat', puncte: 2, text: 'Scrie două valori greșite înainte de a pune regulile (de exemplu avans 400) și folosește <b>Încercuire date nevalide</b>. Apoi evidențiază cu o regulă numele <b>duplicate</b> din coloana Elev (scrie un nume de două ori ca să testezi).', barem: '1p încercuirea; 1p regula de duplicate.' }
    ]
  }
};
