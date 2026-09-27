/* data/intrebari/ora-09.js — Banca de întrebări pentru ORA 9 (funcții de căutare) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q9 = { name: 'Căutare', rows: 8, cols: 8, data: [['Cod elev', 'Nume', 'Clasa', 'Media', '', 'Caut', 'Rezultat'],
  ['E01', 'Ana', '10A', 9.2, '', 'E03'], ['E02', 'Mihai', '10B', 7.4], ['E03', 'Ioana', '10A', 8.8], ['E04', 'Radu', '10C', 6.9], ['E05', 'Sara', '10B', 9.7]],
  bold: ['A1:D1', 'F1:G1'] };
window.INTREBARI[9] = [
  { id: '9-01', tip: 'unic', enunt: 'În ce coloană a tabelului caută VLOOKUP valoarea?', variante: ['în prima coloană', 'în ultima coloană', 'în orice coloană', 'în coloana indicată de al treilea argument'], corect: 0 },
  { id: '9-02', tip: 'unic', enunt: 'Ce înseamnă FALSE ca ultim argument al lui VLOOKUP?', variante: ['potrivire exactă', 'potrivire aproximativă', 'caută de jos în sus', 'ignoră majusculele'], corect: 0 },
  { id: '9-03', tip: 'unic', enunt: 'Ce eroare apare când valoarea căutată nu există?', variante: ['#N/A', '#REF!', '#VALUE!', '#NAME?'], corect: 0 },
  { id: '9-04', tip: 'unic', enunt: 'Tabelul B2:D10 are 3 coloane. Ce dă [[=VLOOKUP(A1,B2:D10,4,FALSE)]]?', variante: ['#REF!', '#N/A', 'valoarea din coloana E', '0'], corect: 0 },
  { id: '9-05', tip: 'adevarat', enunt: 'Pentru potrivirea aproximativă, prima coloană a tabelului trebuie să fie sortată crescător.', corect: true },
  { id: '9-06', tip: 'adevarat', enunt: 'VLOOKUP poate aduce o valoare dintr-o coloană aflată la stânga coloanei în care caută.', corect: false,
    explicatie: 'Pentru asta folosești INDEX + MATCH sau XLOOKUP.' },
  { id: '9-07', tip: 'unic', enunt: 'Pragurile sunt 0, 5, 7, 9 (calificativele I, S, B, FB). Ce calificativ dă potrivirea aproximativă pentru 8,6?', variante: ['B', 'FB', 'S', '#N/A'], corect: 0 },
  { id: '9-08', tip: 'unic', enunt: 'Zona A1:A3 conține literele A, B, C. Ce întoarce [[=MATCH("C",A1:A3,0)]]?', variante: ['3', 'C', 'TRUE', '1'], corect: 0, explicatie: 'MATCH întoarce poziția.' },
  { id: '9-09', tip: 'unic', enunt: 'Ce funcție caută pe orizontală, în primul rând al tabelului?', variante: ['HLOOKUP', 'VLOOKUP', 'MATCH', 'INDEX'], corect: 0 },
  { id: '9-10', tip: 'multiplu', enunt: 'Ce avantaje are XLOOKUP față de VLOOKUP?',
    variante: ['poate căuta și spre stânga', 'are argument pentru mesajul „negăsit”', 'folosește implicit potrivirea exactă', 'funcționează în toate versiunile vechi de Excel'], corect: [0, 1, 2] },
  { id: '9-11', tip: 'asociere', enunt: 'Asociază funcția cu ce întoarce.',
    perechi: [['MATCH', 'poziția unei valori într-o listă'], ['INDEX', 'valoarea aflată la o anumită poziție'], ['VLOOKUP', 'o valoare de pe rândul găsit în prima coloană'], ['IFERROR', 'o valoare de rezervă în locul erorii']] },
  { id: '9-12', tip: 'unic', enunt: 'De ce se pune $ la tabelul din VLOOKUP ($H$2:$K$9)?', variante: ['ca tabelul să nu se deplaseze când copiezi formula', 'ca să caute mai repede', 'ca să fie potrivire exactă', 'ca să ignore majusculele'], corect: 0 },
  { id: '9-13', tip: 'formula', enunt: 'În <b>G2</b> adu <b>numele</b> elevului cu codul din F2, cu VLOOKUP.',
    foi: [FOAIE_Q9], tinta: 'G2', solutie: '=VLOOKUP(F2,A2:D6,2,FALSE)', functii: ['VLOOKUP'], inaltime: 190 },
  { id: '9-14', tip: 'formula', enunt: 'În <b>G2</b> adu <b>media</b> elevului cu codul din F2.',
    foi: [FOAIE_Q9], tinta: 'G2', solutie: '=VLOOKUP(F2,A2:D6,4,FALSE)', functii: ['VLOOKUP'], inaltime: 190 },
  { id: '9-15', tip: 'formula', enunt: 'În <b>G2</b> găsește <b>codul</b> elevului „Sara” cu INDEX și MATCH.',
    foi: [Object.assign({}, FOAIE_Q9, { data: FOAIE_Q9.data.map((r, i) => (i === 1 ? ['E01', 'Ana', '10A', 9.2, '', 'Sara'] : r)) })],
    tinta: 'G2', solutie: '=INDEX(A2:A6,MATCH(F2,B2:B6,0))', functii: ['INDEX', 'MATCH'], inaltime: 190 },
  { id: '9-16', tip: 'unic', enunt: 'Ce afișează [[=IFERROR(VLOOKUP("X9",A2:D6,2,FALSE),"negăsit")]] dacă X9 nu există?', variante: ['negăsit', '#N/A', '0', 'X9'], corect: 0 },
  { id: '9-17', tip: 'completare', enunt: 'Funcția MATCH cu potrivire exactă are ca ultim argument cifra ___ .', raspunsuri: ['0'] },
  { id: '9-18', tip: 'unic', enunt: 'Un VLOOKUP fără al patrulea argument, pe un tabel nesortat, poate…', variante: ['da un rezultat greșit, fără eroare', 'da mereu #REF!', 'șterge tabelul', 'funcționa mereu corect'], corect: 0 }
];
