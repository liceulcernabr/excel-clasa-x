/* =====================================================================
   data/lectii/ora-13.js — ORA 13: Tabele pivot și subtotaluri
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const VANZARI_13 = [
  ['Luna', 'Oraș', 'Categorie', 'Produs', 'Cantitate', 'Valoare'],
  ['ian', 'Brăila', 'Papetărie', 'Caiet A4', 40, 220],
  ['ian', 'Galați', 'Electronice', 'Căști', 3, 360],
  ['ian', 'Brăila', 'Electronice', 'Stick USB', 6, 234],
  ['ian', 'Tulcea', 'Accesorii', 'Rucsac', 2, 298],
  ['ian', 'Galați', 'Papetărie', 'Pix cu gel', 30, 120],
  ['feb', 'Brăila', 'Accesorii', 'Penar', 8, 200],
  ['feb', 'Tulcea', 'Papetărie', 'Set markere', 10, 180],
  ['feb', 'Brăila', 'Electronice', 'Calculator', 4, 356],
  ['feb', 'Galați', 'Accesorii', 'Rucsac', 3, 447],
  ['feb', 'Brăila', 'Papetărie', 'Caiet A4', 55, 302.5],
  ['mar', 'Galați', 'Electronice', 'Căști', 5, 600],
  ['mar', 'Tulcea', 'Electronice', 'Stick USB', 4, 156],
  ['mar', 'Brăila', 'Accesorii', 'Rucsac', 4, 596],
  ['mar', 'Brăila', 'Papetărie', 'Pix cu gel', 45, 180],
  ['mar', 'Galați', 'Papetărie', 'Set markere', 12, 216],
  ['mar', 'Tulcea', 'Accesorii', 'Penar', 6, 150]
];
const LAT_13 = { A: 44, B: 64, C: 90, D: 100, E: 70, F: 70 };
const FOAIE_13 = (extra) => Object.assign({ name: 'Vânzări', rows: 20, cols: 12, data: VANZARI_13, bold: 'A1:F1', fill: 'A1:F1', widths: LAT_13, formats: { 'F2:F17': 'number:2' } }, extra || {});
// datele sortate după categorie (pentru exercițiul cu subtotaluri)
const SORTAT_13 = [VANZARI_13[0]].concat(VANZARI_13.slice(1).slice().sort((a, b) => a[2].localeCompare(b[2], 'ro')));

window.DATE_LECTII[13] = {
  nr: 13,
  titlu: 'Tabele pivot și subtotaluri',
  durata: 50,
  rezumat: 'Ai sute de rânduri cu vânzări și vrei totalul pe categorii, pe orașe sau pe luni. Tabelul pivot face rezumatul în câteva clicuri, fără formule. Subtotalurile adaugă totaluri pe grupe direct în tabel.',

  obiective: [
    'să pregătești datele pentru un tabel pivot (antet, fără rânduri goale, fără celule îmbinate);',
    'să creezi un tabel pivot, cu câmpuri în zonele Rânduri, Coloane, Valori și Filtre;',
    'să schimbi funcția de rezumare (sumă, numărare, medie, maxim);',
    'să reîmprospătezi pivotul după modificarea datelor;',
    'să adaugi și să elimini <b>subtotaluri</b> și să folosești nivelurile de grupare.'
  ],

  teorie: [
    {
      titlu: 'Pregătirea datelor',
      html: `
        <p>Un tabel pivot funcționează doar pe o <b>listă</b> bine făcută:</p>
        <ul>
          <li>primul rând conține <b>antete</b> unice (Luna, Oraș, Categorie…);</li>
          <li>fiecare rând este o înregistrare (o vânzare), fără rânduri sau coloane goale în interior;</li>
          <li>fiecare coloană conține același tip de date;</li>
          <li>fără celule îmbinate și fără totaluri scrise de mână în listă.</li>
        </ul>`
    },
    {
      titlu: 'Crearea unui tabel pivot',
      html: `
        <ol>
          <li>Selectezi o celulă din listă → <i>Inserare → Tabel pivot</i> (<i>Insert → PivotTable</i>).</li>
          <li>Alegi unde se pune: pe o <b>foaie nouă</b> (recomandat) sau pe foaia existentă.</li>
          <li>În panoul <i>Câmpuri tabel pivot</i> tragi câmpurile în patru zone:</li>
        </ol>
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Zona</th><th>Ce face</th><th>Exemplu</th></tr>
          <tr><td><b>Rânduri</b></td><td>fiecare valoare distinctă devine un rând</td><td>Categorie</td></tr>
          <tr><td><b>Coloane</b></td><td>fiecare valoare distinctă devine o coloană</td><td>Luna</td></tr>
          <tr><td><b>Valori</b></td><td>ce se calculează (implicit <b>Sumă</b> pentru numere, <b>Numărare</b> pentru text)</td><td>Suma de Valoare</td></tr>
          <tr><td><b>Filtre</b></td><td>filtrează tot pivotul</td><td>doar orașul Brăila</td></tr>
        </table></div>
        <p>Din <i>Setări câmp valoare</i> schimbi <b>Sumă</b> în <b>Numărare</b>, <b>Medie</b>, <b>Maxim</b>…</p>
        <p>În simulator: <b>Inserare ▾ → Tabel pivot…</b> (alegi câmpurile într-o fereastră).</p>`
    },
    {
      titlu: 'Reîmprospătarea',
      html: `
        <p>Tabelul pivot este un <b>rezumat calculat o singură dată</b>. Dacă modifici datele sursă, pivotul <u>nu</u> se actualizează singur.
        Folosești <i>Analiză tabel pivot → Reîmprospătare</i> (clic dreapta pe pivot → <i>Reîmprospătare</i>).
        În simulator: <b>Date ▾ → Reîmprospătează tabelele pivot</b>.</p>
        <div class="nota"><strong>Pivot sau SUMIF?</strong>Același total poți obține cu [[=SUMIF(C2:C17,"Accesorii",F2:F17)]]. Pivotul e mai rapid pentru rezumate cu multe categorii, iar SUMIF se actualizează singur.</div>`
    },
    {
      titlu: 'Subtotalurile',
      html: `
        <p><i>Date → Subtotal</i> inserează, <b>în tabel</b>, câte un rând cu totalul fiecărei grupe și un total general.</p>
        <ol>
          <li><b>Sortezi</b> întâi tabelul după coloana de grupare (de exemplu Categorie). Altfel aceeași categorie apare în mai multe grupe!</li>
          <li><i>Date → Subtotal</i>: „La fiecare schimbare în” <b>Categorie</b>, „Funcția” <b>Sumă</b>, „Adaugă subtotal la” <b>Valoare</b>.</li>
        </ol>
        <p>Rândurile de total folosesc funcția [[=SUBTOTAL(9,F2:F6)]]. Totalul general nu numără de două ori subtotalurile, pentru că SUBTOTAL ignoră alte celule cu SUBTOTAL.</p>
        <p>Butoanele de nivel <b>1 2 3</b> din stânga afișează doar totalul general (1), subtotalurile (2) sau tot (3). <i>Eliminare totală</i> șterge subtotalurile.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: vânzările pe trimestrul I',
    text: `<p>Încearcă pe lista vânzărilor:</p>
      <ul>
        <li><b>Inserare ▾ → Tabel pivot…</b>: Rânduri = Categorie, Valori = Valoare (Sumă), pe foaie nouă.</li>
        <li>Creează încă un pivot: Rânduri = Oraș, Coloane = Luna, Valori = Valoare.</li>
        <li>Revino pe foaia Vânzări, schimbă o valoare, apoi <b>Date ▾ → Reîmprospătează tabelele pivot</b>.</li>
        <li>Sortează după Categorie, apoi <b>Date ▾ → Subtotal…</b> și încearcă butoanele 1 2 3.</li>
      </ul>`,
    inaltime: 380,
    foi: [FOAIE_13()]
  },

  animatii: [
    {
      id: 'o13-pivot',
      titlu: 'Ce face un tabel pivot',
      grila: { rows: 7, cols: 5, data: [['Categorie', 'Valoare', '', 'Etichete de rânduri', 'Suma de Valoare'], ['Papetărie', 220], ['Electronice', 360], ['Papetărie', 120], ['Accesorii', 298], ['Electronice', 234]] },
      pasi: [
        { text: 'Lista are o vânzare pe fiecare rând. Vrem totalul pe categorii.', zona: ['A2:B6'] },
        { text: 'Pivotul găsește valorile <b>distincte</b> din câmpul de pe Rânduri: Accesorii, Electronice, Papetărie.', celule: { D2: 'Accesorii', D3: 'Electronice', D4: 'Papetărie' }, aprinde: ['D2:D4'] },
        { text: 'Pentru „Papetărie” adună valorile de pe rândurile potrivite: 220 + 120 = 340.', cauta: ['A2', 'A4'], ref0: ['B2', 'B4'], celule: { E4: 340 }, gasit: ['E4'] },
        { text: 'Pentru „Electronice”: 360 + 234 = 594. Pentru „Accesorii”: 298.', cauta: ['A3', 'A6'], ref0: ['B3', 'B6'], celule: { E3: 594, E2: 298 }, gasit: ['E2', 'E3'] },
        { text: 'La final adaugă <b>Total general</b>: 1232. Totul fără nicio formulă scrisă de tine.', celule: { D5: 'Total general', E5: 1232 }, gasit: ['D5:E5'] }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o13-pivot1', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Totalul pe categorii',
      cerinta: 'Creează un <b>tabel pivot</b> care arată <b>suma valorilor</b> pentru fiecare <b>categorie</b>.',
      foi: [FOAIE_13()], meniuri: ['inserare', 'date'], permiteFoi: true, selecteaza: 'A2',
      reguli: [{ pivot: { randuri: 'Categorie', valori: 'Valoare', fn: 'sum' } }],
      indicii: ['Inserare ▾ → Tabel pivot…', 'Rânduri: Categorie · Valori: Valoare · Rezumă prin: Sumă.']
    },
    {
      id: 'o13-pivot2', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Orașe pe luni',
      cerinta: 'Creează un tabel pivot cu <b>orașele pe rânduri</b>, <b>lunile pe coloane</b> și <b>suma valorilor</b> în interior.',
      foi: [FOAIE_13()], meniuri: ['inserare', 'date'], permiteFoi: true, selecteaza: 'A2',
      reguli: [{ pivot: { randuri: 'Oraș', coloane: 'Luna', valori: 'Valoare', fn: 'sum' } }],
      indicii: ['Câmpul de pe Coloane este Luna.', 'Rânduri: Oraș · Coloane: Luna · Valori: Valoare (Sumă).']
    },
    {
      id: 'o13-pivot3', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Câte vânzări în fiecare oraș',
      cerinta: 'Creează un tabel pivot care <b>numără</b> vânzările (rândurile) din fiecare oraș. Folosește câmpul Produs la Valori, cu funcția Numărare.',
      foi: [FOAIE_13()], meniuri: ['inserare', 'date'], permiteFoi: true, selecteaza: 'A2',
      reguli: [{ pivot: { randuri: 'Oraș', valori: 'Produs', fn: 'count' } }],
      indicii: ['Pentru un câmp de tip text, rezumatul potrivit este Numărare.', 'Rânduri: Oraș · Valori: Produs · Rezumă prin: Numărare.']
    },
    {
      id: 'o13-subtotal', tip: 'simulator', nivel: 'avansat', puncte: 20,
      titlu: 'Subtotaluri pe categorii',
      cerinta: 'Adaugă <b>subtotaluri</b> cu <b>suma valorilor</b> la fiecare schimbare de <b>categorie</b>. Datele trebuie sortate întâi după categorie (<i>Date ▾</i>).',
      foi: [FOAIE_13()], meniuri: ['date'], selecteaza: 'C2',
      reguli: [{ subtotal: { grup: 'Categorie' } }],
      indicii: ['Pas 1: sortează după Categorie (Date ▾ → Sortare A → Z, cu o celulă din coloana C selectată).', 'Pas 2: Date ▾ → Subtotal… → la fiecare schimbare în Categorie, funcția Sumă, subtotal la Valoare.'],
      solutieText: 'Sortare după Categorie, apoi Subtotal. Apar 3 subtotaluri (Accesorii, Electronice, Papetărie) și totalul general.'
    },
    {
      id: 'o13-subtotal-f', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Funcția din spatele subtotalurilor',
      cerinta: 'Datele sunt deja sortate după categorie. Scrie în <b>F7</b> totalul categoriei Accesorii (rândurile 2–6) cu funcția folosită de subtotaluri, codul pentru <b>sumă</b>.',
      foi: [FOAIE_13({ data: SORTAT_13.slice(0, 6), cells: { E7: 'Total Accesorii' } })],
      reguli: [{ formula: 'F7', solutie: '=SUBTOTAL(9,F2:F6)', functii: ['SUBTOTAL'] }],
      indicii: ['Funcția este SUBTOTAL, iar codul pentru sumă este 9.']
    },
    {
      id: 'o13-zone', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Zonele tabelului pivot',
      cerinta: 'Potrivește fiecare zonă a tabelului pivot cu rolul ei.',
      perechi: [['Rânduri', 'fiecare valoare distinctă devine un rând'], ['Coloane', 'fiecare valoare distinctă devine o coloană'], ['Valori', 'ce se calculează (sumă, numărare, medie…)'], ['Filtre', 'restrânge tot pivotul la anumite valori']],
      indicii: ['Valorile sunt numerele din interiorul tabelului.']
    },
    {
      id: 'o13-pasi', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Pașii pentru un pivot',
      cerinta: 'Ordonează pașii pentru a afla vânzările totale pe fiecare lună.',
      pasi: ['Verifică lista: antet pe primul rând, fără rânduri goale.', 'Selectează o celulă din listă.', 'Alege Inserare → Tabel pivot și locul „Foaie de lucru nouă”.', 'Trage câmpul Luna în zona Rânduri.', 'Trage câmpul Valoare în zona Valori (Sumă).', 'După modificarea datelor, apasă Reîmprospătare.'],
      indicii: ['Datele se pregătesc înainte de orice.']
    },
    {
      id: 'o13-actualizare', tip: 'grila', nivel: 'mediu', puncte: 10,
      titlu: 'De ce nu s-a schimbat?',
      cerinta: 'Ai modificat o valoare în lista de vânzări, dar totalul din tabelul pivot a rămas același. Ce faci?',
      variante: ['Reîmprospătezi tabelul pivot', 'Ștergi pivotul și îl faci din nou, altă cale nu există', 'Apeși F4', 'Sortezi lista'], corect: 0,
      indicii: ['Pivotul nu se recalculează singur ca o formulă.']
    },
    {
      id: 'o13-sortare', tip: 'grila', nivel: 'baza', puncte: 5,
      titlu: 'Înainte de subtotaluri',
      cerinta: 'Ce trebuie făcut <b>înainte</b> de a aplica subtotaluri pe categorii?',
      variante: ['Sortarea tabelului după categorie', 'Crearea unui tabel pivot', 'Ștergerea antetului', 'Îmbinarea celulelor cu aceeași categorie'], corect: 0,
      indicii: ['Subtotalul se inserează la fiecare schimbare de valoare.']
    }
  ],

  fisa: {
    titlu: 'Raportul de vânzări „Cerna Shop”',
    timp: 45,
    fisier: 'fisa-13-raport-vanzari.xlsx',
    context: 'Managerul magazinului vrea un raport pentru trimestrul I. Datele sunt pe foaia <b>Vânzări</b>. Fiecare tabel pivot se creează pe o foaie nouă, denumită sugestiv.',
    foi: [{ name: 'Vânzări', data: VANZARI_13.concat([
      ['ian', 'Tulcea', 'Papetărie', 'Caiet A4', 25, 137.5], ['feb', 'Galați', 'Electronice', 'Stick USB', 5, 195], ['feb', 'Tulcea', 'Electronice', 'Căști', 2, 240],
      ['mar', 'Brăila', 'Electronice', 'Căști', 4, 480], ['mar', 'Galați', 'Accesorii', 'Penar', 9, 225], ['ian', 'Brăila', 'Accesorii', 'Penar', 5, 125]
    ]), widths: { C: 100, D: 110 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'Foaia „Pe categorii”: pivot cu suma valorilor pe fiecare categorie, sortat descrescător după sumă.', barem: '1p pivot corect; 0,5p sortare.' },
      { nivel: 'baza', puncte: 1.5, text: 'Foaia „Oraș × lună”: pivot cu orașele pe rânduri, lunile pe coloane și suma valorilor. Aplică formatul monedă (lei) valorilor.', barem: '1p structura; 0,5p formatul.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Foaia „Cantități”: pivot cu produsele pe rânduri și <b>media</b> cantităților; adaugă categoria ca <b>filtru</b> și afișează doar Electronice.', barem: '0,5p medie; 0,5p filtru; 0,5p selecție Electronice.' },
      { nivel: 'mediu', puncte: 1, text: 'Modifică o valoare din foaia Vânzări și reîmprospătează toate pivoturile. Notează într-o celulă ce s-a schimbat.', barem: '1p reîmprospătare și observație.' },
      { nivel: 'avansat', puncte: 1.5, text: 'Pe o copie a foii Vânzări, sortează după Oraș și adaugă subtotaluri (sumă) la Cantitate și Valoare. Afișează doar nivelul 2 și copiază rezultatul.', barem: '0,5p sortare; 0,5p subtotaluri pe două coloane; 0,5p nivelul 2.' },
      { nivel: 'avansat', puncte: 2, text: 'Verifică un rezultat din pivot cu o formulă: calculează cu [[fn:SUMIFS]] totalul vânzărilor din Galați în luna feb și compară-l cu valoarea din pivotul „Oraș × lună”. Apoi creează o diagramă pe baza pivotului „Pe categorii”.', barem: '1p SUMIFS corect și egal cu pivotul; 1p diagrama.', solutie: '=SUMIFS(F2:F23,B2:B23,"Galați",A2:A23,"feb")' }
    ]
  }
};
