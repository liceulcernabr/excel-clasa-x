/* data/intrebari/ora-13.js — Banca de întrebări pentru ORA 13 (pivot și subtotaluri) */
window.INTREBARI = window.INTREBARI || {};
window.INTREBARI[13] = [
  { id: '13-01', tip: 'unic', enunt: 'Ce face un tabel pivot?', variante: ['Rezumă o listă mare (totaluri, numărări, medii) pe categorii', 'Sortează datele alfabetic', 'Colorează valorile mari', 'Protejează foaia'], corect: 0 },
  { id: '13-02', tip: 'unic', enunt: 'Ce funcție de rezumare folosește implicit un pivot pentru un câmp numeric pus la Valori?', variante: ['Sumă', 'Medie', 'Numărare', 'Maxim'], corect: 0 },
  { id: '13-03', tip: 'unic', enunt: 'Ce funcție de rezumare folosește implicit pivotul pentru un câmp text pus la Valori?', variante: ['Numărare', 'Sumă', 'Medie', 'nu se poate pune text la Valori'], corect: 0 },
  { id: '13-04', tip: 'adevarat', enunt: 'Tabelul pivot se actualizează automat imediat ce modifici datele sursă.', corect: false, explicatie: 'Trebuie reîmprospătat.' },
  { id: '13-05', tip: 'unic', enunt: 'Vrei lunile ca antete de coloană în pivot. În ce zonă tragi câmpul Luna?', variante: ['Coloane', 'Rânduri', 'Valori', 'Filtre'], corect: 0 },
  { id: '13-06', tip: 'multiplu', enunt: 'Ce condiții trebuie să îndeplinească lista sursă a unui pivot?', variante: ['antete pe primul rând', 'fără rânduri goale în interior', 'fără celule îmbinate', 'să fie sortată'], corect: [0, 1, 2] },
  { id: '13-07', tip: 'unic', enunt: 'Ce trebuie făcut înainte de a adăuga subtotaluri pe orașe?', variante: ['sortarea după oraș', 'crearea unui pivot', 'filtrarea după oraș', 'nimic'], corect: 0 },
  { id: '13-08', tip: 'completare', enunt: 'Rândurile de subtotal folosesc funcția ___ .', raspunsuri: ['SUBTOTAL'] },
  { id: '13-09', tip: 'unic', enunt: 'De ce totalul general al subtotalurilor nu adună de două ori valorile?', variante: ['SUBTOTAL ignoră celulele care conțin alte SUBTOTAL', 'Excel șterge subtotalurile la final', 'totalul general folosește AVERAGE', 'nu e adevărat, le adună de două ori'], corect: 0 },
  { id: '13-10', tip: 'asociere', enunt: 'Asociază butonul de nivel cu ce afișează (după subtotaluri).',
    perechi: [['1', 'doar totalul general'], ['2', 'subtotalurile și totalul general'], ['3', 'toate rândurile']] },
  { id: '13-11', tip: 'unic', enunt: 'Pentru a vedea în pivot doar vânzările din Brăila, fără a schimba rândurile, pui câmpul Oraș în zona…', variante: ['Filtre', 'Valori', 'Coloane', 'Rânduri'], corect: 0 },
  { id: '13-12', tip: 'multiplu', enunt: 'Ce funcții de rezumare poate folosi un pivot?', variante: ['Sumă', 'Numărare', 'Medie', 'Maxim', 'VLOOKUP'], corect: [0, 1, 2, 3] },
  { id: '13-13', tip: 'unic', enunt: 'Ce formulă dă același rezultat ca un pivot cu Categorie pe rânduri și Suma de Valoare, pentru categoria „Sport”?', variante: ['=SUMIF(C2:C100,"Sport",F2:F100)', '=COUNTIF(C2:C100,"Sport")', '=VLOOKUP("Sport",C2:F100,4)', '=SUM(C2:C100)'], corect: 0 },
  { id: '13-14', tip: 'adevarat', enunt: 'Un tabel pivot poate fi pus pe o foaie nouă.', corect: true },
  { id: '13-15', tip: 'unic', enunt: 'Cod SUBTOTAL pentru <b>medie</b>:', variante: ['1', '9', '2', '4'], corect: 0 },
  { id: '13-16', tip: 'unic', enunt: 'Ce apare pe ultimul rând al unui pivot?', variante: ['Total general', 'Media generală', 'Numărul de categorii', 'Nimic'], corect: 0 },
  { id: '13-17', tip: 'completare', enunt: 'Pentru a actualiza pivotul după modificarea datelor folosești comanda ___ .', raspunsuri: ['Reîmprospătare', 'Reimprospatare', 'Refresh'] },
  { id: '13-18', tip: 'adevarat', enunt: 'Subtotalurile se pot elimina cu Date → Subtotal → Eliminare totală.', corect: true }
];
