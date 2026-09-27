/* data/intrebari/ora-12.js — Banca de întrebări pentru ORA 12 (diagrame) */
window.INTREBARI = window.INTREBARI || {};
window.INTREBARI[12] = [
  { id: '12-01', tip: 'unic', enunt: 'Ce tip de diagramă alegi pentru evoluția temperaturii pe parcursul unui an?', variante: ['linie', 'radială', 'coloane stivuite', 'inel'], corect: 0 },
  { id: '12-02', tip: 'unic', enunt: 'Ce tip de diagramă arată cel mai bine ce procent din total reprezintă fiecare categorie?', variante: ['radială (plăcintă)', 'linie', 'XY', 'bare cu 3 serii'], corect: 0 },
  { id: '12-03', tip: 'unic', enunt: 'Ce element al diagramei explică ce culoare are fiecare serie?', variante: ['legenda', 'titlul', 'axa categoriilor', 'liniile de grilă'], corect: 0 },
  { id: '12-04', tip: 'adevarat', enunt: 'Dacă modifici o valoare din tabelul sursă, diagrama se actualizează automat.', corect: true },
  { id: '12-05', tip: 'adevarat', enunt: 'O diagramă radială poate afișa corect mai multe serii de date, una lângă alta.', corect: false, explicatie: 'Plăcinta arată o singură serie (un singur întreg).' },
  { id: '12-06', tip: 'unic', enunt: 'Selectezi A1:C5 (antet pe rândul 1, clase în coloana A). Ce devin valorile din coloana A?', variante: ['etichetele axei categoriilor', 'numele seriilor', 'valorile primei serii', 'titlul diagramei'], corect: 0 },
  { id: '12-07', tip: 'unic', enunt: 'Cum selectezi două coloane care nu sunt vecine pentru o diagramă?', variante: ['ții apăsat Ctrl în timp ce selectezi a doua zonă', 'ții apăsat Shift', 'apeși F4', 'nu se poate'], corect: 0 },
  { id: '12-08', tip: 'multiplu', enunt: 'Care sunt elemente ale unei diagrame?', variante: ['titlul', 'legenda', 'etichetele de date', 'titlurile axelor', 'caseta de nume'], corect: [0, 1, 2, 3] },
  { id: '12-09', tip: 'asociere', enunt: 'Asociază situația cu diagrama potrivită.',
    perechi: [['populația a 5 orașe', 'coloane'], ['numărul de elevi pe ani, 2015–2025', 'linie'], ['împărțirea timpului liber într-o zi', 'radială'], ['înălțimea și greutatea a 30 de elevi', 'XY (prin puncte)']] },
  { id: '12-10', tip: 'unic', enunt: 'Când e inutilă legenda?', variante: ['când diagrama are o singură serie', 'când diagrama are titlu', 'mereu la coloane', 'niciodată'], corect: 0 },
  { id: '12-11', tip: 'unic', enunt: 'O axă verticală care începe de la 8 (nu de la 0) poate…', variante: ['exagera vizual diferențele mici', 'ascunde valorile negative', 'schimba datele', 'transforma diagrama în linie'], corect: 0 },
  { id: '12-12', tip: 'completare', enunt: 'Valorile afișate direct pe coloanele sau feliile unei diagrame se numesc etichete de ___ .', raspunsuri: ['date'] },
  { id: '12-13', tip: 'unic', enunt: 'Ce diagramă alegi pentru vânzările pe luni, ca să vezi și totalul lunii, și cât a contribuit fiecare categorie?', variante: ['coloane stivuite', 'radială', 'linie simplă', 'inel'], corect: 0 },
  { id: '12-14', tip: 'unic', enunt: 'Din ce filă a panglicii inserezi o diagramă?', variante: ['Inserare', 'Pornire', 'Date', 'Revizuire'], corect: 0 },
  { id: '12-15', tip: 'adevarat', enunt: 'Pe o diagramă cu linie, categoriile de pe axa orizontală ar trebui să aibă o ordine firească (de exemplu, în timp).', corect: true },
  { id: '12-16', tip: 'unic', enunt: 'Într-o plăcintă, o felie are eticheta 25%. Ce înseamnă?', variante: ['categoria reprezintă un sfert din total', 'valoarea categoriei este 25', 'este cea mai mare categorie', 'este a 25-a categorie'], corect: 0 },
  { id: '12-17', tip: 'multiplu', enunt: 'Ce poți modifica la o diagramă deja inserată?', variante: ['tipul diagramei', 'zona de date', 'titlurile', 'culorile seriilor'], corect: [0, 1, 2, 3] },
  { id: '12-18', tip: 'completare', enunt: 'Pentru a arăta temperatura și precipitațiile, care au unități diferite, pe aceeași diagramă, folosești o axă ___ .', raspunsuri: ['secundară', 'secundara'] }
];
