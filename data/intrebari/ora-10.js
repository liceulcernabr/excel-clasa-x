/* data/intrebari/ora-10.js — Banca de întrebări pentru ORA 10 (sortare și filtrare) */
window.INTREBARI = window.INTREBARI || {};
window.INTREBARI[10] = [
  { id: '10-01', tip: 'unic', enunt: 'Ce selectezi înainte de o sortare simplă a unui tabel?', variante: ['O singură celulă din tabel', 'Doar coloana după care sortezi', 'Tot rândul 1', 'Nimic'], corect: 0 },
  { id: '10-02', tip: 'unic', enunt: 'Cum ordonează sortarea A → Z o coloană cu numere?', variante: ['de la mic la mare', 'de la mare la mic', 'alfabetic, după prima cifră', 'nu le ordonează'], corect: 0 },
  { id: '10-03', tip: 'adevarat', enunt: 'Filtrul automat șterge rândurile care nu îndeplinesc condiția.', corect: false, explicatie: 'Rândurile sunt doar ascunse.' },
  { id: '10-04', tip: 'unic', enunt: 'Ce combinație de taste activează filtrul automat?', variante: ['Ctrl+Shift+L', 'Ctrl+F', 'Alt+F4', 'Ctrl+L'], corect: 0 },
  { id: '10-05', tip: 'unic', enunt: 'Filtrezi „Clasa = 10A” și „Gen = F”. Ce rânduri rămân vizibile?', variante: ['fetele din 10A', 'toți din 10A și toate fetele', 'doar băieții din 10A', 'niciunul'], corect: 0 },
  { id: '10-06', tip: 'unic', enunt: 'Care funcție adună doar rândurile vizibile după filtrare?', variante: ['SUBTOTAL', 'SUM', 'SUMIF', 'COUNTIF'], corect: 0 },
  { id: '10-07', tip: 'completare', enunt: 'În SUBTOTAL, codul pentru sumă este ___ .', raspunsuri: ['9'] },
  { id: '10-08', tip: 'unic', enunt: 'În zona de criterii a filtrului avansat, condițiile scrise pe <b>același rând</b> înseamnă…', variante: ['ȘI (toate trebuie îndeplinite)', 'SAU (una ajunge)', 'sortare', 'nimic'], corect: 0 },
  { id: '10-09', tip: 'unic', enunt: 'Condițiile scrise pe <b>rânduri diferite</b> ale zonei de criterii înseamnă…', variante: ['SAU', 'ȘI', 'NU', 'sunt ignorate'], corect: 0 },
  { id: '10-10', tip: 'multiplu', enunt: 'Ce poate face filtrul avansat?', variante: ['să copieze rezultatul în altă zonă', 'să afișeze doar înregistrările unice', 'să combine condiții ȘI și SAU', 'să creeze o diagramă'], corect: [0, 1, 2] },
  { id: '10-11', tip: 'asociere', enunt: 'Asociază cerința cu instrumentul potrivit.',
    perechi: [['clasamentul după puncte', 'sortare descrescătoare'], ['doar elevii din 10A, rapid', 'filtru automat'], ['(10A și F) sau (10B și M)', 'filtru avansat'], ['suma rândurilor vizibile', 'SUBTOTAL']] },
  { id: '10-12', tip: 'unic', enunt: 'Sortezi după Clasa, apoi după Nume. Când contează al doilea criteriu?', variante: ['doar între elevii din aceeași clasă', 'mereu, înaintea clasei', 'niciodată', 'doar pentru primul rând'], corect: 0 },
  { id: '10-13', tip: 'adevarat', enunt: 'Antetul tabelului trebuie inclus în zona de criterii a filtrului avansat.', corect: true },
  { id: '10-14', tip: 'unic', enunt: 'Cum se scrie în zona de criterii condiția „punctaj de cel puțin 80”?', variante: ['>=80', '=>80', '"80+"', 'MIN 80'], corect: 0 },
  { id: '10-15', tip: 'unic', enunt: 'Ce sortare pune datele calendaristice de la cea mai recentă la cea mai veche?', variante: ['descrescătoare (Z → A)', 'crescătoare (A → Z)', 'după culoare', 'nu se pot sorta datele'], corect: 0 },
  { id: '10-16', tip: 'multiplu', enunt: 'Care filtre se pot aplica dintr-un buton ▾ al filtrului automat?', variante: ['mai mare sau egal cu o valoare', 'textul conține …', 'primele 10', 'formula SUMIF'], corect: [0, 1, 2] },
  { id: '10-17', tip: 'completare', enunt: 'După filtrare, numerele rândurilor vizibile apar colorate în ___ (culoarea).', raspunsuri: ['albastru'] },
  { id: '10-18', tip: 'unic', enunt: 'Cum reafișezi toate rândurile după filtrare?', variante: ['Golire filtru (Clear)', 'Ctrl+Z de mai multe ori', 'Ștergi rândurile ascunse', 'Închizi fișierul'], corect: 0 }
];
