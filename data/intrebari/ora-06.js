/* data/intrebari/ora-06.js — Banca de întrebări pentru ORA 6 (funcții logice) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q6 = { name: 'Elevi', rows: 6, cols: 5, data: [['Elev', 'Media', 'Absențe', 'Rezultat'], ['Ana', 9.5, 3], ['Mihai', 4.5, 15], ['Ioana', 7, 8], ['Radu', 5, 11]], bold: 'A1:D1' };
window.INTREBARI[6] = [
  { id: '6-01', tip: 'unic', enunt: 'Ce rezultat dă [[=5>3]]?', variante: ['TRUE', 'FALSE', '5', '2'], corect: 0 },
  { id: '6-02', tip: 'unic', enunt: 'Ce afișează [[=IF(A1>=5,"Da","Nu")]] dacă A1 = 4?', variante: ['Nu', 'Da', 'FALSE', '#VALUE!'], corect: 0 },
  { id: '6-03', tip: 'unic', enunt: 'Când este [[=AND(A1>0,B1>0)]] adevărată?', variante: ['Când ambele valori sunt pozitive', 'Când cel puțin una e pozitivă', 'Mereu', 'Niciodată'], corect: 0 },
  { id: '6-04', tip: 'unic', enunt: 'Ce dă [[=OR(2>5,3=3)]]?', variante: ['TRUE', 'FALSE', '#VALUE!', '3'], corect: 0 },
  { id: '6-05', tip: 'completare', enunt: 'Rezultatul formulei [[=NOT(FALSE)]] este ___ .', raspunsuri: ['TRUE', 'ADEVĂRAT', 'adevarat'] },
  { id: '6-06', tip: 'adevarat', enunt: 'Într-un IF, textele rezultat se scriu între ghilimele.', corect: true },
  { id: '6-07', tip: 'adevarat', enunt: 'Formula =IF(5<=A1<=10,"ok","nu") verifică corect dacă A1 este între 5 și 10.', corect: false,
    explicatie: 'Dubla inegalitate nu funcționează în Excel; corect este [[=IF(AND(A1>=5,A1<=10),"ok","nu")]].' },
  { id: '6-08', tip: 'unic', enunt: 'Media 8 cu formula [[=IF(A1>=9,"FB",IF(A1>=7,"B",IF(A1>=5,"S","I")))]] primește:',
    variante: ['B', 'FB', 'S', 'I'], corect: 0 },
  { id: '6-09', tip: 'unic', enunt: 'Ce afișează [[=IFERROR(10/0,"imposibil")]]?', variante: ['imposibil', '#DIV/0!', '0', '10'], corect: 0 },
  { id: '6-10', tip: 'multiplu', enunt: 'Care formule afișează „Da” pentru A1 = 8?',
    variante: ['=IF(A1>5,"Da","Nu")', '=IF(AND(A1>5,A1<10),"Da","Nu")', '=IF(OR(A1=8,A1=9),"Da","Nu")', '=IF(A1<5,"Da","Nu")'], corect: [0, 1, 2] },
  { id: '6-11', tip: 'asociere', enunt: 'Asociază condiția cu formula potrivită (media în B2, absențele în C2).',
    perechi: [['media cel puțin 9 și sub 10 absențe', '=AND(B2>=9,C2<10)'], ['media sub 5 sau peste 20 de absențe', '=OR(B2<5,C2>20)'], ['nu are nicio absență', '=C2=0'], ['media diferită de 10', '=B2<>10']] },
  { id: '6-12', tip: 'unic', enunt: 'De ce se testează pragurile de la cel mai mare la cel mai mic într-un IF imbricat?',
    variante: ['Pentru că Excel se oprește la prima condiție adevărată', 'Pentru că altfel apare #REF!', 'Pentru că IF acceptă doar numere descrescătoare', 'Nu contează ordinea'], corect: 0 },
  { id: '6-13', tip: 'formula', enunt: 'În <b>D2:D5</b> afișează „Promovat” dacă media (B) este cel puțin 5, altfel „Corigent”.',
    foi: [FOAIE_Q6], tinta: 'D2:D5', solutie: '=IF(B2>=5,"Promovat","Corigent")', functii: ['IF'], inaltime: 170 },
  { id: '6-14', tip: 'formula', enunt: 'În <b>D2:D5</b> afișează „Atenție” dacă elevul are media sub 5 <b>sau</b> mai mult de 10 absențe; altfel „OK”.',
    foi: [FOAIE_Q6], tinta: 'D2:D5', solutie: '=IF(OR(B2<5,C2>10),"Atenție","OK")', functii: ['IF', 'OR'], inaltime: 170 },
  { id: '6-15', tip: 'formula', enunt: 'În <b>D2:D5</b> calculează media finală: dacă elevul are peste 10 absențe, media scade cu 1; altfel rămâne aceeași.',
    foi: [FOAIE_Q6], tinta: 'D2:D5', solutie: '=IF(C2>10,B2-1,B2)', functii: ['IF'], inaltime: 170 },
  { id: '6-16', tip: 'unic', enunt: 'Ce eroare dă [[=IF(A1>5,Da,"Nu")]]?', variante: ['#NAME?', '#VALUE!', '#N/A', 'Nicio eroare'], corect: 0 },
  { id: '6-17', tip: 'completare', enunt: 'Ca IF să lase celula goală, ca rezultat scrii două ghilimele: ___ .', raspunsuri: ['""', "''", '„”'] },
  { id: '6-18', tip: 'adevarat', enunt: '[[=AND(TRUE,FALSE,TRUE)]] are rezultatul FALSE.', corect: true }
];
