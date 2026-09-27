/* data/intrebari/ora-05.js — Banca de întrebări pentru ORA 5 (funcții de bază) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q5 = { name: 'Note', rows: 7, cols: 5, data: [['Elev', 'Nota 1', 'Nota 2', 'Nota 3', 'Rezultat'], ['Ana', 9, 8, 10], ['Mihai', 7, '', 6], ['Ioana', 10, 9, 'abs'], ['Radu', 5, 6, 7]], bold: 'A1:E1' };
window.INTREBARI[5] = [
  { id: '5-01', tip: 'unic', enunt: 'Ce funcție calculează media aritmetică?', variante: ['AVERAGE', 'MEDIAN', 'SUM', 'MEAN'], corect: 0 },
  { id: '5-02', tip: 'unic', enunt: 'Zona B2:B6 conține: 9, „abs”, (gol), 7, 10. Ce dă [[=COUNT(B2:B6)]]?', variante: ['3', '4', '5', '1'], corect: 0 },
  { id: '5-03', tip: 'unic', enunt: 'Aceeași zonă (9, „abs”, gol, 7, 10). Ce dă [[=COUNTA(B2:B6)]]?', variante: ['4', '3', '5', '2'], corect: 0 },
  { id: '5-04', tip: 'unic', enunt: 'Ce dă [[=ROUND(3.14159,2)]]?', variante: ['3,14', '3,15', '3', '3,1416'], corect: 0 },
  { id: '5-05', tip: 'completare', enunt: 'Rezultatul formulei [[=ROUND(2.5,0)]] este ___ .', raspunsuri: ['3'] },
  { id: '5-06', tip: 'adevarat', enunt: 'Funcția AVERAGE ignoră celulele goale și textul din zonă.', corect: true },
  { id: '5-07', tip: 'adevarat', enunt: 'O celulă care conține 0 este ignorată de AVERAGE, la fel ca o celulă goală.', corect: false, explicatie: '0 este un număr și intră în medie.' },
  { id: '5-08', tip: 'unic', enunt: 'Ce eroare apare pentru <code>=SUMM(A1:A5)</code>?', variante: ['#NAME?', '#VALUE!', '#REF!', '#N/A'], corect: 0 },
  { id: '5-09', tip: 'unic', enunt: 'Ce scurtătură inserează rapid funcția SUM (Însumare automată)?', variante: ['Alt+=', 'Ctrl+S', 'F4', 'Ctrl+Shift+S'], corect: 0 },
  { id: '5-10', tip: 'multiplu', enunt: 'Care formule calculează corect suma valorilor din A1, A2 și A3?',
    variante: ['=SUM(A1:A3)', '=A1+A2+A3', '=SUM(A1,A2,A3)', '=SUM(A1-A3)'], corect: [0, 1, 2] },
  { id: '5-11', tip: 'asociere', enunt: 'Asociază funcția cu rezultatul ei pentru zona cu valorile 4, 8, 6.',
    perechi: [['SUM', '18'], ['AVERAGE', '6'], ['MAX', '8'], ['MIN', '4'], ['COUNT', '3']] },
  { id: '5-12', tip: 'unic', enunt: 'Ce face [[=ROUND(1567,-2)]]?', variante: ['1600', '1500', '1567,00', '15,67'], corect: 0, explicatie: 'Zecimalele negative rotunjesc la zeci, sute…' },
  { id: '5-13', tip: 'unic', enunt: 'Care este diferența dintre formatul cu 2 zecimale și funcția ROUND(x,2)?',
    variante: ['Formatul schimbă doar afișarea; ROUND schimbă valoarea', 'Nu e nicio diferență', 'ROUND schimbă doar afișarea', 'Formatul șterge zecimalele din valoare'], corect: 0 },
  { id: '5-14', tip: 'formula', enunt: 'În <b>E2</b> calculează media notelor Anei (B2:D2) cu funcția AVERAGE.',
    foi: [FOAIE_Q5], tinta: 'E2', solutie: '=AVERAGE(B2:D2)', functii: ['AVERAGE'], inaltime: 170 },
  { id: '5-15', tip: 'formula', enunt: 'În <b>E2:E5</b> calculează cea mai mare notă a fiecărui elev și copiază formula.',
    foi: [FOAIE_Q5], tinta: 'E2:E5', solutie: '=MAX(B2:D2)', functii: ['MAX'], inaltime: 170 },
  { id: '5-16', tip: 'formula', enunt: 'În <b>E2</b> calculează suma notelor Anei, rotunjită la zeci (de ex. 27 → 30), cu ROUND și SUM.',
    foi: [FOAIE_Q5], tinta: 'E2', solutie: '=ROUND(SUM(B2:D2),-1)', functii: ['ROUND', 'SUM'], inaltime: 170 },
  { id: '5-17', tip: 'unic', enunt: 'Vrei să afli câți elevi sunt în listă (coloana A conține numele). Ce folosești?',
    variante: ['=COUNTA(A2:A30)', '=COUNT(A2:A30)', '=SUM(A2:A30)', '=MAX(A2:A30)'], corect: 0, explicatie: 'Numele sunt text, deci COUNT ar da 0.' },
  { id: '5-18', tip: 'completare', enunt: 'Media numerelor 6, 8 și 10 (calculată cu AVERAGE) este ___ .', raspunsuri: ['8'] }
];
