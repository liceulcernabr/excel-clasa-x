/* =====================================================================
   data/lectii/ora-03.js — ORA 3: Completarea automată, serii,
   copiere/mutare, inserarea și ștergerea rândurilor și coloanelor
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

// verificare pentru o coloană care trebuie să conțină exact anumite valori
function coloanaEgala03(zona, asteptat, descriere) {
  return (wb) => {
    const FE = window.FormulaEngine;
    const z = FE.parseRangeAddr(zona);
    for (let r = z.r1, i = 0; r <= z.r2; r++, i++) {
      const v = wb.getValue(0, r, z.c1);
      const a = asteptat[i];
      const ok = typeof a === 'number' ? v === a : String(v === null ? '' : wb.getDisplay(0, r, z.c1)).toLowerCase() === String(a).toLowerCase();
      if (!ok) return 'Celula ' + FE.addr(r, z.c1) + ' ar trebui să conțină ' + a + (v === null ? ' (acum e goală).' : ' (acum: ' + wb.getDisplay(0, r, z.c1) + ').') + (descriere ? ' ' + descriere : '');
    }
    return null;
  };
}

const METEO_03 = [
  ['Data', 'Ziua', 'Temp. max (°C)', 'Temp. min (°C)', 'Precipitații (mm)'],
  ['01.03.2025', 'sâmbătă', 9, 1, 0],
  ['02.03.2025', '', 11, 2, 0],
  ['', '', 8, 0, 3.2],
  ['', '', 6, -1, 5.4],
  ['', '', 10, 1, 0],
  ['', '', 13, 3, 0],
  ['', '', 15, 4, 1.1]
];

window.DATE_LECTII[3] = {
  nr: 3,
  titlu: 'Completarea automată și seriile',
  durata: 50,
  rezumat: 'Cum lucrezi repede: ghidajul de umplere continuă serii de numere, date și zile. Copiezi și muți date, inserezi și ștergi rânduri sau coloane fără să strici formulele.',

  obiective: [
    'să folosești <b>ghidajul de umplere</b> pentru copiere și pentru serii (numere, date, zile, luni, text cu număr);',
    'să creezi o serie cu pas ales (din 5 în 5, din 7 în 7 zile);',
    'să copiezi, să muți și să lipești date, inclusiv cu <i>Lipire specială</i>;',
    'să inserezi și să ștergi rânduri și coloane;',
    'să recunoști eroarea #REF! care apare când ștergi celule folosite într-o formulă.'
  ],

  teorie: [
    {
      titlu: 'Ghidajul de umplere',
      html: `
        <p>Pătrățelul din colțul dreapta-jos al celulei active este <b>ghidajul de umplere</b> (<i>Fill Handle</i>). Îl tragi în jos sau spre dreapta, iar Excel „ghicește” ce urmează:</p>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Pornești de la</th><th>Tragi și obții</th><th>Observație</th></tr>
          <tr><td>5</td><td>5, 5, 5, 5</td><td>un singur număr se <b>copiază</b>; cu [[k:Ctrl]] apăsat se incrementează</td></tr>
          <tr><td>1, 2 (două celule selectate)</td><td>3, 4, 5, 6</td><td>Excel calculează pasul din primele două valori</td></tr>
          <tr><td>10, 20</td><td>30, 40, 50</td><td>pasul este 10</td></tr>
          <tr><td>luni</td><td>marți, miercuri, joi…</td><td>zilele și lunile sunt liste predefinite</td></tr>
          <tr><td>ianuarie</td><td>februarie, martie…</td><td>merge și cu prescurtări: ian, feb…</td></tr>
          <tr><td>01.03.2025</td><td>02.03, 03.03, 04.03…</td><td>o dată crește cu câte o zi</td></tr>
          <tr><td>Elev 1</td><td>Elev 2, Elev 3…</td><td>numărul de la sfârșitul textului crește</td></tr>
          <tr><td>[[=B2*2]]</td><td>[[=B3*2]], [[=B4*2]]…</td><td>formulele se copiază, cu referințele ajustate (ora 4)</td></tr>
        </table></div>
        <div class="sfat"><strong>Dublu-clic pe ghidaj</strong>Dacă alături există o coloană completată, un dublu-clic pe ghidaj umple automat până la ultimul rând cu date.</div>`
    },
    {
      titlu: 'Serii cu pas ales și umplerea rapidă',
      html: `
        <p>Pentru serii mai lungi folosești <i>Pornire → Umplere → Serie</i> (<i>Home → Fill → Series</i>). Alegi <b>pasul</b> (de exemplu 7 pentru o săptămână) și <b>valoarea de oprire</b>.</p>
        <p>[[k:Ctrl+D]] copiază în jos conținutul primei celule din selecție, iar [[k:Ctrl+R]] îl copiază spre dreapta.</p>
        <p><b>Umplerea rapidă</b> (<i>Flash Fill</i>, [[k:Ctrl+E]]) recunoaște un model din exemplele tale. Dacă scrii „Popescu A.” lângă „Ana Popescu”, Excel completează singur restul coloanei în același fel.</p>`
    },
    {
      titlu: 'Copiere, mutare și lipire specială',
      html: `
        <table class="tabel">
          <tr><th>Acțiune</th><th>Cum</th></tr>
          <tr><td>copiere</td><td>[[k:Ctrl+C]], apoi [[k:Ctrl+V]] în destinație; sau tragi marginea selecției ținând [[k:Ctrl]]</td></tr>
          <tr><td>mutare</td><td>[[k:Ctrl+X]], apoi [[k:Ctrl+V]]; sau tragi de marginea selecției</td></tr>
          <tr><td>lipire specială</td><td>[[k:Ctrl+Alt+V]]: lipești doar <b>valorile</b>, doar <b>formatele</b>, doar formulele sau <b>transpui</b> datele (rândurile devin coloane)</td></tr>
        </table>
        <div class="nota"><strong>Copiere sau mutare?</strong>La copiere, formulele își ajustează referințele relative. La mutare, formula rămâne la fel, fiindcă trimite tot la aceleași celule.</div>`
    },
    {
      titlu: 'Inserarea și ștergerea rândurilor și coloanelor',
      html: `
        <p>Clic dreapta pe numărul rândului sau pe litera coloanei → <b>Inserare</b> sau <b>Ștergere</b>. Rândul nou apare <b>deasupra</b> celui selectat, iar coloana nouă apare <b>la stânga</b>.
        În simulator faci clic dreapta într-o celulă.</p>
        <p>Formulele se actualizează automat: dacă inserezi un rând deasupra rândului 5, o formulă care folosea A5 va folosi acum A6.</p>
        <div class="atentie"><strong>#REF!</strong>Dacă ștergi un rând sau o coloană folosită într-o formulă, referința devine <b>#REF!</b>. De exemplu, [[=A1+A2]] devine =A1+#REF! după ștergerea rândului 2.</div>
        <p><b>Delete</b> și <b>Ștergere</b> nu sunt același lucru: [[k:Delete]] golește conținutul, dar celulele rămân pe loc. <i>Ștergere</i> elimină celulele, iar celelalte se mută ca să le ia locul.</p>
        <p>Poți și <b>ascunde</b> rânduri sau coloane (clic dreapta → Ascundere). Datele rămân acolo și sunt folosite în calcule.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: jurnalul meteo',
    text: `<p>Completează jurnalul meteo din Brăila pentru prima săptămână din martie:</p>
      <ul>
        <li>Selectează A2:A3 și trage de ghidajul de umplere până la A8. Datele continuă din zi în zi.</li>
        <li>În B3 scrie <code>duminică</code>, apoi trage ghidajul de la B3 până la B8.</li>
        <li>Clic dreapta pe o celulă din coloana E → <i>Inserează coloană la stânga</i> și scrie „Vânt (km/h)”.</li>
        <li>Selectează C2:C8 și citește media temperaturii maxime în bara de stare.</li>
      </ul>`,
    foi: [{ name: 'Martie', rows: 14, cols: 8, data: METEO_03, bold: 'A1:E1', widths: { A: 92, B: 86, C: 110, D: 110, E: 130 } }]
  },

  animatii: [
    {
      id: 'o3-serii',
      titlu: 'Cum „ghicește” Excel seria',
      grila: { rows: 6, cols: 4, data: [['Număr', 'Pas', 'Zi', 'Text']] },
      pasi: [
        { text: 'Scriem <b>1</b> în A2 și tragem ghidajul. Cu o singură valoare, Excel <b>copiază</b>: 1, 1, 1.', celule: { A2: 1, A3: 1, A4: 1 }, aprinde: ['A2'], zona: ['A3:A4'] },
        { text: 'Scriem acum <b>1</b> și <b>2</b>, le selectăm pe amândouă și tragem. Excel calculează pasul 2 − 1 = 1 și continuă: 3, 4.', celule: { A2: 1, A3: 2, A4: 3, A5: 4 }, aprinde: ['A2:A3'], zona: ['A4:A5'] },
        { text: 'Cu <b>5</b> și <b>10</b> pasul este 5, deci urmează 15 și 20.', celule: { B2: 5, B3: 10, B4: 15, B5: 20 }, aprinde: ['B2:B3'], zona: ['B4:B5'] },
        { text: 'Zilele săptămânii sunt o listă predefinită: <b>luni</b> → marți, miercuri…', celule: { C2: 'luni', C3: 'marți', C4: 'miercuri', C5: 'joi' }, aprinde: ['C2'], zona: ['C3:C5'] },
        { text: 'Un text care se termină cu un număr: <b>Elev 1</b> → Elev 2, Elev 3…', celule: { D2: 'Elev 1', D3: 'Elev 2', D4: 'Elev 3', D5: 'Elev 4' }, aprinde: ['D2'], zona: ['D3:D5'] }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o3-numerotare', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Numerotează elevii',
      cerinta: 'Completează coloana <b>Nr.</b> (A2:A11) cu numerele de la 1 la 10 folosind ghidajul de umplere. Nu le scrie pe toate de mână.',
      foi: [{ name: 'Elevi', rows: 13, cols: 3, data: [['Nr.', 'Nume'], [1, 'Ana'], [2, 'Bogdan'], ['', 'Carmen'], ['', 'Darius'], ['', 'Elena'], ['', 'Flavia'], ['', 'George'], ['', 'Horia'], ['', 'Irina'], ['', 'Luca']], bold: 'A1:B1' }],
      selecteaza: 'A2', toolbar: false,
      reguli: [{ custom: coloanaEgala03('A2:A11', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) }],
      indicii: ['Selectează A2:A3 (conțin 1 și 2), ca Excel să afle pasul.', 'Trage pătrățelul din colțul dreapta-jos al selecției până la A11.'],
      solutieText: 'Selectezi A2:A3 și tragi ghidajul până la A11 (sau faci dublu-clic pe ghidaj, pentru că B e completată).'
    },
    {
      id: 'o3-zile', tip: 'simulator', nivel: 'baza', puncte: 5,
      titlu: 'Zilele săptămânii',
      cerinta: 'În B2 este scris „luni”. Completează B3:B8 cu restul zilelor săptămânii folosind ghidajul de umplere.',
      foi: [{ name: 'Orar', rows: 10, cols: 4, data: [['', 'Ziua', 'Ore'], ['', 'luni', 6]], bold: 'A1:C1' }],
      selecteaza: 'B2', toolbar: false,
      reguli: [{ custom: coloanaEgala03('B2:B8', ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']) }],
      indicii: ['Selectează B2 și trage ghidajul în jos.', 'Oprește-te la B8 (7 zile).']
    },
    {
      id: 'o3-saptamani', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Din 7 în 7 zile',
      cerinta: 'Cercul de robotică se întâlnește săptămânal, începând cu <b>06.10.2025</b>. Completează A2:A9 cu datele întâlnirilor, din 7 în 7 zile.',
      foi: [{ name: 'Robotică', rows: 11, cols: 3, data: [['Data întâlnirii', 'Temă'], ['06.10.2025', 'Senzori'], ['13.10.2025', 'Motoare']], bold: 'A1:B1', widths: { A: 120, B: 110 } }],
      selecteaza: 'A2', toolbar: false,
      reguli: [{ custom: coloanaEgala03('A2:A9', ['06.10.2025', '13.10.2025', '20.10.2025', '27.10.2025', '03.11.2025', '10.11.2025', '17.11.2025', '24.11.2025']) }],
      indicii: ['Primele două date au deja pasul de 7 zile.', 'Selectează A2:A3 și trage ghidajul până la A9.'],
      solutieText: 'Selectezi A2:A3 (pas de 7 zile) și tragi până la A9: 20.10, 27.10, 03.11, 10.11, 17.11, 24.11.2025.'
    },
    {
      id: 'o3-inserare', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Un elev nou',
      cerinta: 'Lista e în ordine alfabetică. Inserează un rând nou <b>deasupra</b> rândului lui <i>Dinu</i> și scrie în el <b>Cristea</b> (coloana A) și <b>9</b> (coloana B). Formula din B8 trebuie să includă automat și nota nouă.',
      foi: [{ name: 'Note', rows: 10, cols: 3, data: [['Nume', 'Nota'], ['Albu', 8], ['Bălan', 7], ['Dinu', 10], ['Enescu', 6], ['Florea', 9]], cells: { A7: 'Total', B7: '=SUM(B2:B6)' }, bold: 'A1:B1' }],
      selecteaza: 'A4', toolbar: false,
      reguli: [
        { valoare: 'A4', egal: 'Cristea', tipDate: 'text', mesaj: 'rândul nou (rândul 4) trebuie să conțină „Cristea”.' },
        { valoare: 'B4', egal: 9, tipDate: 'numar' },
        { valoare: 'A5', egal: 'Dinu', mesaj: 'Dinu trebuie să fie acum pe rândul 5 — ai inserat un rând sau ai scris peste?' },
        { valoare: 'B8', egal: 49, mesaj: 'totalul din B8 trebuie să includă și nota lui Cristea (49).' }
      ],
      indicii: ['Clic dreapta pe o celulă din rândul 4 (Dinu) → „Inserează rând deasupra”.', 'Formula de total se mută singură în B8 și devine =SUM(B2:B7).'],
      solutieText: 'Clic dreapta în rândul 4 → Inserează rând deasupra; A4 = Cristea, B4 = 9. Totalul devine =SUM(B2:B7) = 49.'
    },
    {
      id: 'o3-stergere', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Coloana în plus',
      cerinta: 'Coloana <b>C</b> („De șters”) nu mai este necesară. <b>Șterge coloana</b> (nu doar conținutul), astfel încât „Oraș” să ajungă în coloana C.',
      foi: [{ name: 'Elevi', rows: 6, cols: 5, data: [['Nume', 'Clasa', 'De șters', 'Oraș'], ['Ana', '10A', 'x', 'Brăila'], ['Mihai', '10B', 'x', 'Galați'], ['Ioana', '10A', 'x', 'Brăila']], bold: 'A1:D1' }],
      selecteaza: 'C1', toolbar: false,
      reguli: [
        { valoare: 'C1', egal: 'Oraș', mesaj: 'după ștergerea coloanei, „Oraș” ajunge în C1. Dacă doar ai golit celulele cu Delete, coloana goală a rămas.' },
        { valoare: 'C3', egal: 'Galați' }
      ],
      indicii: ['Delete golește doar celulele. Ai nevoie de comanda de ștergere a coloanei.', 'Clic dreapta pe o celulă din coloana C → „Șterge coloana C”.']
    },
    {
      id: 'o3-ref', tip: 'grila', nivel: 'mediu', puncte: 10,
      titlu: 'Ce devine formula?',
      cerinta: 'Celula C1 conține formula [[=A1+A2+A3]]. Se <b>șterge rândul 2</b>. Ce se întâmplă cu formula (acum în C1)?',
      variante: ['Devine =A1+#REF!+A2 și afișează eroarea #REF!', 'Devine =A1+A2 și funcționează normal', 'Rămâne =A1+A2+A3', 'Formula se șterge'],
      corect: 0,
      indicii: ['Celula A2 nu mai există. Ce face Excel cu o referință către o celulă ștearsă?', 'Iar vechiul A3 urcă pe rândul 2.'],
      explicatie: 'Referința spre celula ștearsă devine #REF!, iar A3 devine A2, pentru că rândul a urcat. Din acest motiv [[=SUM(A1:A3)]] e mai sigură: zona se micșorează, fără eroare.'
    },
    {
      id: 'o3-copiere', tip: 'grila', nivel: 'baza', puncte: 5,
      titlu: 'Un singur număr',
      cerinta: 'În A1 este numărul <b>7</b>. Selectezi doar A1 și tragi ghidajul de umplere până la A4. Ce conține A4?',
      variante: ['7', '10', '4', '8'],
      corect: 0,
      indicii: ['Cu o singură valoare, Excel nu are din ce să calculeze un pas.'],
      explicatie: 'Un singur număr se copiază. Pentru serie, pornești de la două valori sau ții apăsat Ctrl în timp ce tragi.'
    },
    {
      id: 'o3-taste', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Scurtături utile',
      cerinta: 'Potrivește fiecare combinație de taste cu efectul ei.',
      perechi: [['Ctrl+C', 'Copiază selecția'], ['Ctrl+X', 'Decupează (pentru mutare)'], ['Ctrl+V', 'Lipește'], ['Ctrl+D', 'Umple în jos cu prima celulă'], ['Ctrl+Z', 'Anulează ultima acțiune'], ['Ctrl+E', 'Umplere rapidă (Flash Fill)']],
      indicii: ['„D” vine de la Down (în jos).', '„X” seamănă cu o foarfecă.']
    },
    {
      id: 'o3-mutare', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Mută un tabel',
      cerinta: 'Ordonează pașii pentru a muta tabelul din A1:D10 începând din celula F1.',
      pasi: ['Selectează zona A1:D10.', 'Apasă [[k:Ctrl+X]] (Decupare).', 'Selectează celula F1.', 'Apasă [[k:Ctrl+V]] (Lipire).', 'Verifică: zona A1:D10 este acum goală, iar datele încep în F1.'],
      indicii: ['Pentru mutare se folosește decuparea, nu copierea.']
    }
  ],

  fisa: {
    titlu: 'Jurnalul meteo al Brăilei',
    timp: 35,
    fisier: 'fisa-03-jurnal-meteo.xlsx',
    context: 'Voluntarii clubului de ecologie notează zilnic vremea din Brăila. Completează jurnalul pentru luna martie 2025 folosind umplerea automată, nu scriind fiecare valoare.',
    foi: [{ name: 'Martie', data: METEO_03, widths: { A: 92, B: 86, C: 110, D: 110, E: 130 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'Completează coloana <b>Data</b> cu toate zilele din martie 2025 (01.03 – 31.03), folosind ghidajul de umplere.', barem: '1,5p — 31 de date consecutive, fără goluri; ultima este 31.03.2025.' },
      { nivel: 'baza', puncte: 1.5, text: 'Completează coloana <b>Ziua</b> (sâmbătă, duminică, luni…) pentru toate zilele, cu ghidajul de umplere.', barem: '1,5p — zilele corespund datelor (31.03.2025 este luni).' },
      { nivel: 'mediu', puncte: 1.5, text: 'Inserează o coloană nouă între „Ziua” și „Temp. max” cu antetul <b>Nr. zi</b> și completeaz-o cu seria 1, 2, 3 … 31.', barem: '0,5p coloană inserată în poziția corectă; 1p seria completă.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Inserează un rând deasupra antetului și scrie titlul „Jurnal meteo — Brăila, martie 2025”. Apoi copiază foaia (clic dreapta pe etichetă → Mutare sau copiere → Creare copie) și redenumește copia „Aprilie”.', barem: '0,5p rândul de titlu; 0,5p copia foii; 0,5p numele „Aprilie”.' },
      { nivel: 'avansat', puncte: 1, text: 'Pe foaia <i>Aprilie</i>, folosește <i>Pornire → Umplere → Serie</i> pentru a genera direct datele 01.04 – 30.04.2025, cu pasul 1 și valoarea de oprire 30.04.2025.', barem: '1p — seria generată corect cu dialogul Serie.' },
      { nivel: 'avansat', puncte: 2, text: 'Pe foaia <i>Martie</i>, copiază temperaturile maxime din prima săptămână și lipește-le <b>transpus</b> (pe un rând) începând din celula J2, cu <i>Lipire specială → Transpunere</i>. Apoi ascunde coloana „Precipitații” și explică într-o celulă de ce valorile ei sunt încă folosite în calcule.', barem: '1p transpunere corectă; 0,5p coloană ascunsă; 0,5p explicația (datele ascunse rămân în foaie).' }
    ]
  }
};
