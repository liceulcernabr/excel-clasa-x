/* data/intrebari/ora-15.js — Banca de întrebări pentru ORA 15 (recapitulare) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q15 = { name: 'Cupa', rows: 8, cols: 8, data: [['Nume', 'Clasa', 'Proba', 'Punctaj', 'Rezultat', '', 'Prag', 'Medalie'],
  ['Ana', '10A', 'Șah', 88, '', '', 0, '—'], ['Mihai', '10B', 'Baschet', 73, '', '', 70, 'Bronz'], ['Ioana', '10A', 'Atletism', 97, '', '', 85, 'Argint'], ['Radu', '10C', 'Șah', 61, '', '', 95, 'Aur'], ['Sara', '10B', 'Atletism', 84]],
  bold: ['A1:E1', 'G1:H1'] };
window.INTREBARI[15] = [
  { id: '15-01', tip: 'unic', enunt: 'Ce instrument folosești pentru totalul pe categorii dintr-o listă de 500 de vânzări, fără să scrii formule?', variante: ['tabel pivot', 'filtru avansat', 'validare', 'formatare condiționată'], corect: 0 },
  { id: '15-02', tip: 'unic', enunt: 'Formula [[=B2*$F$1]] din C2 copiată în C9 devine…', variante: ['=B9*$F$1', '=B9*$F$8', '=B2*$F$1', '=C9*$G$1'], corect: 0 },
  { id: '15-03', tip: 'unic', enunt: 'Ce funcție aduce prețul unui produs dintr-un catalog, după cod?', variante: ['VLOOKUP', 'COUNTIF', 'SUMIF', 'MID'], corect: 0 },
  { id: '15-04', tip: 'unic', enunt: 'Ce dă [[=IF(AND(8>=5,OR(1=2,3=3)),"da","nu")]]?', variante: ['da', 'nu', 'TRUE', '#VALUE!'], corect: 0 },
  { id: '15-05', tip: 'multiplu', enunt: 'Care formule calculează media notelor din B2:B20 ale clasei 10A (clasa în A)?', variante: ['=AVERAGEIF(A2:A20,"10A",B2:B20)', '=SUMIF(A2:A20,"10A",B2:B20)/COUNTIF(A2:A20,"10A")', '=AVERAGEIFS(B2:B20,A2:A20,"10A")', '=AVERAGE(B2:B20)'], corect: [0, 1, 2] },
  { id: '15-06', tip: 'adevarat', enunt: 'Un filtru automat șterge definitiv rândurile ascunse.', corect: false },
  { id: '15-07', tip: 'unic', enunt: 'Ce eroare apare când VLOOKUP nu găsește valoarea (cu FALSE)?', variante: ['#N/A', '#REF!', '#DIV/0!', '#NAME?'], corect: 0 },
  { id: '15-08', tip: 'asociere', enunt: 'Asociază eroarea cu cauza ei tipică.',
    perechi: [['#DIV/0!', 'împărțire la zero sau la o celulă goală'], ['#NAME?', 'nume de funcție scris greșit sau text fără ghilimele'], ['#REF!', 'referință către o celulă ștearsă'], ['#VALUE!', 'calcul cu un text în loc de număr'], ['#N/A', 'valoare negăsită la o căutare']] },
  { id: '15-09', tip: 'unic', enunt: 'Ce regulă de formatare condiționată colorează rândul întreg al elevilor cu punctaj ≥ 90 (punctaj în D, zona A2:E30)?', variante: ['=$D2>=90', '=D$2>=90', '=$D$2>=90', '=D:D>=90'], corect: 0 },
  { id: '15-10', tip: 'unic', enunt: 'Ce diagramă alegi pentru ponderea fiecărei probe în numărul total de participanți?', variante: ['radială', 'linie', 'XY', 'coloane stivuite'], corect: 0 },
  { id: '15-11', tip: 'completare', enunt: 'Referința la celula A5 de pe foaia Praguri se scrie ___ .', raspunsuri: ['Praguri!A5'] },
  { id: '15-12', tip: 'formula', enunt: 'În <b>E2:E6</b> afișează medalia după punctaj, cu tabelul de praguri G2:H5 (potrivire aproximativă).',
    foi: [FOAIE_Q15], tinta: 'E2:E6', solutie: '=VLOOKUP(D2,$G$2:$H$5,2,TRUE)', functii: ['VLOOKUP'], inaltime: 190 },
  { id: '15-13', tip: 'formula', enunt: 'În <b>E2:E6</b> afișează „Da” pentru elevii din 10A sau 10B cu cel puțin 80 de puncte, altfel „Nu”.',
    foi: [FOAIE_Q15], tinta: 'E2:E6', solutie: '=IF(AND(D2>=80,OR(B2="10A",B2="10B")),"Da","Nu")', functii: ['IF', 'AND', 'OR'], inaltime: 190 },
  { id: '15-14', tip: 'formula', enunt: 'În <b>E2</b> calculează media punctajelor de la proba Atletism.',
    foi: [FOAIE_Q15], tinta: 'E2', solutie: '=AVERAGEIF(C2:C6,"Atletism",D2:D6)', functii: ['AVERAGEIF'], inaltime: 190 },
  { id: '15-15', tip: 'unic', enunt: 'Ce trebuie făcut înainte de subtotaluri pe clase?', variante: ['sortarea după clasă', 'protejarea foii', 'crearea unei diagrame', 'filtrarea după clasă'], corect: 0 },
  { id: '15-16', tip: 'multiplu', enunt: 'Ce elemente ar trebui să aibă o diagramă dintr-un proiect evaluat?', variante: ['titlu', 'titluri de axe cu unitatea de măsură', 'legendă (când sunt mai multe serii)', 'cât mai multe culori aleatorii'], corect: [0, 1, 2] },
  { id: '15-17', tip: 'unic', enunt: 'Ce combinație salvează rapid registrul?', variante: ['Ctrl+S', 'Ctrl+Shift+S', 'Alt+S', 'F12'], corect: 0 },
  { id: '15-18', tip: 'adevarat', enunt: 'Într-un proiect, rezultatele calculate trebuie obținute prin formule, nu scrise de mână.', corect: true },
  { id: '15-19', tip: 'completare', enunt: 'Pentru a afișa „—” în loc de eroarea unei căutări folosești funcția ___ .', raspunsuri: ['IFERROR', 'IFNA'] }
];
