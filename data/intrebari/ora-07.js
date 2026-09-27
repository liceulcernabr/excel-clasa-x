/* data/intrebari/ora-07.js — Banca de întrebări pentru ORA 7 (funcții condiționale) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q7 = { name: 'Vânzări', rows: 9, cols: 6, data: [['Produs', 'Categorie', 'Oraș', 'Cantitate', 'Valoare'],
  ['Caiet', 'Papetărie', 'Brăila', 10, 50], ['Pix', 'Papetărie', 'Galați', 25, 62.5], ['Mouse', 'IT', 'Brăila', 3, 135],
  ['Stick', 'IT', 'Brăila', 4, 156], ['Rucsac', 'Accesorii', 'Galați', 2, 360], ['Penar', 'Accesorii', 'Brăila', 5, 125]], bold: 'A1:E1', cells: { G1: 'Rezultat' } };
window.INTREBARI[7] = [
  { id: '7-01', tip: 'unic', enunt: 'Ce funcție numără celulele care îndeplinesc <b>o singură</b> condiție?', variante: ['COUNTIF', 'COUNTIFS', 'SUMIF', 'COUNTA'], corect: 0 },
  { id: '7-02', tip: 'unic', enunt: 'Care este ordinea argumentelor la SUMIF?',
    variante: ['zona de verificat, criteriul, zona de adunat', 'zona de adunat, zona de verificat, criteriul', 'criteriul, zona de adunat', 'zona de adunat, criteriul'], corect: 0 },
  { id: '7-03', tip: 'unic', enunt: 'Care este primul argument al funcției SUMIFS?', variante: ['zona de adunat', 'primul criteriu', 'zona primului criteriu', 'numărul de condiții'], corect: 0 },
  { id: '7-04', tip: 'unic', enunt: 'Cum se scrie criteriul „mai mare decât 100”?', variante: ['">100"', '>100', '"100>"', '=>100'], corect: 0 },
  { id: '7-05', tip: 'completare', enunt: 'Criteriul care numără numele ce încep cu litera M se scrie ___ .', raspunsuri: ['"M*"', 'M*'] },
  { id: '7-06', tip: 'adevarat', enunt: 'COUNTIFS numără rândurile care îndeplinesc <b>toate</b> criteriile date.', corect: true },
  { id: '7-07', tip: 'adevarat', enunt: 'Criteriul "brăila" nu găsește celulele cu „Brăila”, pentru că majusculele contează.', corect: false, explicatie: 'Criteriile nu țin cont de majuscule.' },
  { id: '7-08', tip: 'unic', enunt: 'Pragul se află în H1. Ce criteriu numără valorile mai mici decât pragul?', variante: ['"<"&H1', '"<H1"', '<H1', '"<"H1'], corect: 0 },
  { id: '7-09', tip: 'unic', enunt: 'Ce face caracterul <b>?</b> într-un criteriu?', variante: ['Înlocuiește exact un caracter', 'Înlocuiește oricâte caractere', 'Înseamnă „diferit de”', 'Caută semnul întrebării'], corect: 0 },
  { id: '7-10', tip: 'multiplu', enunt: 'Care formule numără elevii din 10A <b>sau</b> 10B (coloana B)?',
    variante: ['=COUNTIF(B2:B30,"10A")+COUNTIF(B2:B30,"10B")', '=COUNTIFS(B2:B30,"10A",B2:B30,"10B")', '=COUNTIF(B2:B30,"10?")-COUNTIF(B2:B30,"10C")', '=COUNTIF(B2:B30,"10A,10B")'],
    corect: [0, 2], explicatie: 'COUNTIFS cere ambele condiții simultan (imposibil). Varianta a treia funcționează dacă există doar 10A, 10B și 10C.' },
  { id: '7-11', tip: 'asociere', enunt: 'Asociază criteriul cu semnificația lui.',
    perechi: [['"<>Cros"', 'diferit de Cros'], ['"*escu"', 'se termină cu „escu”'], ['">=5"', 'cel puțin 5'], ['""', 'celulă goală']] },
  { id: '7-12', tip: 'formula', enunt: 'În <b>G2</b> numără câte vânzări sunt din <b>Brăila</b>.',
    foi: [FOAIE_Q7], tinta: 'G2', solutie: '=COUNTIF(C2:C7,"Brăila")', functii: ['COUNTIF'], inaltime: 190 },
  { id: '7-13', tip: 'formula', enunt: 'În <b>G2</b> calculează valoarea totală a produselor din categoria <b>IT</b>.',
    foi: [FOAIE_Q7], tinta: 'G2', solutie: '=SUMIF(B2:B7,"IT",E2:E7)', functii: ['SUMIF'], inaltime: 190 },
  { id: '7-14', tip: 'formula', enunt: 'În <b>G2</b> calculează valoarea totală a vânzărilor din <b>Brăila</b> din categoria <b>Accesorii</b>.',
    foi: [FOAIE_Q7], tinta: 'G2', solutie: '=SUMIFS(E2:E7,C2:C7,"Brăila",B2:B7,"Accesorii")', functii: ['SUMIFS'], inaltime: 190 },
  { id: '7-15', tip: 'formula', enunt: 'În <b>G2</b> calculează media cantităților vândute în <b>Galați</b>.',
    foi: [FOAIE_Q7], tinta: 'G2', solutie: '=AVERAGEIF(C2:C7,"Galați",D2:D7)', functii: ['AVERAGEIF'], inaltime: 190 },
  { id: '7-16', tip: 'unic', enunt: 'Ce dă [[=COUNTIF(A1:A5,"<>")]] dacă 3 din cele 5 celule sunt completate?', variante: ['3', '2', '5', '0'], corect: 0 },
  { id: '7-17', tip: 'unic', enunt: 'Ce dă [[=AVERAGEIF(B2:B10,"X",C2:C10)]] dacă nicio celulă din B nu conține „X”?', variante: ['#DIV/0!', '0', '#N/A', 'celula rămâne goală'], corect: 0 },
  { id: '7-18', tip: 'completare', enunt: 'Pentru a copia în jos formula [[=COUNTIF(B2:B30,H2)]] fără să se deplaseze zona datelor, zona se scrie ___ .', raspunsuri: ['$B$2:$B$30'] }
];
