/* data/intrebari/ora-08.js — Banca de întrebări pentru ORA 8 (text și dată) */
window.INTREBARI = window.INTREBARI || {};
const FOAIE_Q8 = { name: 'Date', rows: 5, cols: 5, data: [['Nume', 'Prenume', 'Data nașterii', 'Rezultat'], ['Popa', 'Ioana', '21.04.2010'], ['Stan', 'Mihai', '09.11.2009'], ['Dinu', 'Sara', '30.06.2010']], bold: 'A1:D1', cells: { F1: 'Referință', G1: '15.09.2025' } };
window.INTREBARI[8] = [
  { id: '8-01', tip: 'unic', enunt: 'Ce dă [[=LEFT("Brăila",3)]]?', variante: ['Bră', 'ila', 'Brăila', 'B'], corect: 0 },
  { id: '8-02', tip: 'unic', enunt: 'Ce dă [[=RIGHT("Excel2026",4)]]?', variante: ['2026', 'Exce', 'el20', '6'], corect: 0 },
  { id: '8-03', tip: 'unic', enunt: 'Ce dă [[=MID("informatica",3,5)]]?', variante: ['forma', 'infor', 'ormat', 'nform'], corect: 0 },
  { id: '8-04', tip: 'completare', enunt: '[[=LEN("Ana Maria")]] are rezultatul ___ .', raspunsuri: ['9'], explicatie: 'Spațiul se numără și el.' },
  { id: '8-05', tip: 'unic', enunt: 'Ce funcție transformă „ana popescu” în „Ana Popescu”?', variante: ['PROPER', 'UPPER', 'LOWER', 'TRIM'], corect: 0 },
  { id: '8-06', tip: 'unic', enunt: 'Ce operator lipește două texte?', variante: ['&', '+', '*', ','], corect: 0 },
  { id: '8-07', tip: 'adevarat', enunt: '[[=RIGHT("A2026",4)]] dă numărul 2026, cu care se pot face direct calcule.', corect: false,
    explicatie: 'Rezultatul este textul „2026”. Se poate transforma cu VALUE, deși multe operații aritmetice îl convertesc automat.' },
  { id: '8-08', tip: 'unic', enunt: 'Ce întoarce [[=DATEDIF(A2,B2,"Y")]]?', variante: ['Numărul de ani întregi dintre cele două date', 'Anul din A2', 'Numărul de zile', 'Data de azi'], corect: 0 },
  { id: '8-09', tip: 'unic', enunt: 'A2 = 01.09.2025, B2 = 15.09.2025. Ce dă [[=B2-A2]]?', variante: ['14', '15', '0,5', '#VALUE!'], corect: 0 },
  { id: '8-10', tip: 'multiplu', enunt: 'Care formule dau anul curent?', variante: ['=YEAR(TODAY())', '=YEAR(NOW())', '=TODAY()', '=DAY(TODAY())'], corect: [0, 1] },
  { id: '8-11', tip: 'asociere', enunt: 'Pentru CNP-ul fictiv 5100715094567 din A1, asociază formula cu rezultatul.',
    perechi: [['=LEFT(A1,1)', '5'], ['=MID(A1,2,2)', '10'], ['=MID(A1,4,2)', '07'], ['=MID(A1,6,2)', '15'], ['=LEN(A1)', '13']] },
  { id: '8-12', tip: 'unic', enunt: 'Ce face [[=TRIM(A1)]]?', variante: ['Elimină spațiile de la capete și pe cele duble dintre cuvinte', 'Șterge tot textul', 'Taie ultimul caracter', 'Transformă textul în număr'], corect: 0 },
  { id: '8-13', tip: 'formula', enunt: 'În <b>D2:D4</b> scrie „Prenume Nume” (de exemplu „Ioana Popa”).',
    foi: [FOAIE_Q8], tinta: 'D2:D4', solutie: '=B2&" "&A2', inaltime: 160 },
  { id: '8-14', tip: 'formula', enunt: 'În <b>D2:D4</b> afișează anul nașterii.',
    foi: [FOAIE_Q8], tinta: 'D2:D4', solutie: '=YEAR(C2)', functii: ['YEAR'], inaltime: 160 },
  { id: '8-15', tip: 'formula', enunt: 'În <b>D2:D4</b> calculează vârsta în ani împliniți la data din <b>G1</b>.',
    foi: [FOAIE_Q8], tinta: 'D2:D4', solutie: '=DATEDIF(C2,$G$1,"Y")', functii: ['DATEDIF'], inaltime: 160 },
  { id: '8-16', tip: 'formula', enunt: 'În <b>D2:D4</b> afișează numele de familie cu majuscule.',
    foi: [FOAIE_Q8], tinta: 'D2:D4', solutie: '=UPPER(A2)', functii: ['UPPER'], inaltime: 160 },
  { id: '8-17', tip: 'unic', enunt: 'Ce eroare dă DATEDIF dacă data de început este după data finală?', variante: ['#NUM!', '#VALUE!', '#DIV/0!', '#REF!'], corect: 0 },
  { id: '8-18', tip: 'completare', enunt: 'Ca să obții data 1 iunie 2026 din an, lună și zi, scrii =DATE(2026, ___ , 1).', raspunsuri: ['6'] }
];
