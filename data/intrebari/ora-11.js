/* data/intrebari/ora-11.js — Banca de întrebări pentru ORA 11 (formatare condiționată și validare) */
window.INTREBARI = window.INTREBARI || {};
window.INTREBARI[11] = [
  { id: '11-01', tip: 'unic', enunt: 'Ce face formatarea condiționată?', variante: ['Aplică un format doar celulelor care îndeplinesc o condiție', 'Împiedică scrierea valorilor greșite', 'Sortează datele după culoare', 'Șterge valorile care nu respectă regula'], corect: 0 },
  { id: '11-02', tip: 'unic', enunt: 'Ce instrument creează o listă derulantă într-o celulă?', variante: ['Validarea datelor', 'Formatarea condiționată', 'Filtrul automat', 'Sortarea'], corect: 0 },
  { id: '11-03', tip: 'adevarat', enunt: 'Dacă valoarea unei celule se schimbă, formatarea condiționată se actualizează automat.', corect: true },
  { id: '11-04', tip: 'unic', enunt: 'Vrei să colorezi tot rândul elevilor din 10A (clasa în coloana B, zona A2:F30). Ce formulă scrii în regulă?', variante: ['=$B2="10A"', '=$B$2="10A"', '=B$2="10A"', '=B:B="10A"'], corect: 0 },
  { id: '11-05', tip: 'unic', enunt: 'Ce stil de eroare <b>refuză</b> valoarea greșită?', variante: ['Stop', 'Avertisment', 'Informare', 'Mesaj de intrare'], corect: 0 },
  { id: '11-06', tip: 'multiplu', enunt: 'Ce tipuri de restricții permite validarea datelor?', variante: ['Listă', 'Număr întreg', 'Dată', 'Lungime text', 'Culoarea celulei'], corect: [0, 1, 2, 3] },
  { id: '11-07', tip: 'completare', enunt: 'Sursa unei liste de validare cu două variante se scrie: Da ___ Nu (ce caracter le desparte?).', raspunsuri: [',', ';', 'virgula', 'virgulă'] },
  { id: '11-08', tip: 'adevarat', enunt: 'Validarea datelor șterge automat valorile greșite scrise înainte de crearea regulii.', corect: false, explicatie: 'Ele rămân. Le poți găsi cu „Încercuire date nevalide”.' },
  { id: '11-09', tip: 'unic', enunt: 'Ce regulă evidențiază cele mai mari 5 valori dintr-o zonă?', variante: ['Primele N elemente (N = 5)', 'Mai mare decât 5', 'Peste medie', 'Valori duplicate'], corect: 0 },
  { id: '11-10', tip: 'asociere', enunt: 'Asociază nevoia cu instrumentul potrivit.',
    perechi: [['vezi dintr-o privire valorile mari și mici', 'scală de culori'], ['o bară proporțională cu valoarea', 'bare de date'], ['doar note de la 1 la 10', 'validare: număr întreg între 1 și 10'], ['alegerea clasei dintr-o listă', 'validare: listă']] },
  { id: '11-11', tip: 'unic', enunt: 'Când apare mesajul de intrare?', variante: ['Când selectezi celula', 'După ce scrii o valoare greșită', 'La salvare', 'Niciodată'], corect: 0 },
  { id: '11-12', tip: 'unic', enunt: 'Regula „Mai mic decât 5” e aplicată pe C2:C20. Ce se întâmplă cu o celulă care conține textul „abs”?', variante: ['nu se colorează', 'se colorează', 'apare #VALUE!', 'regula se șterge'], corect: 0 },
  { id: '11-13', tip: 'multiplu', enunt: 'Ce valori respinge regula „Număr întreg între 1 și 10”?', variante: ['0', '7,5', '11', '10', 'zece'], corect: [0, 1, 2, 4] },
  { id: '11-14', tip: 'unic', enunt: 'Unde vezi și ștergi regulile de formatare condiționată?', variante: ['Gestionare reguli', 'Validare date', 'Filtru', 'Formatare celule'], corect: 0 },
  { id: '11-15', tip: 'completare', enunt: 'Pentru o regulă cu formulă, ca fiecare rând să verifice coloana E, scrii =___E2="Da" (ce semn lipsește?).', raspunsuri: ['$'] },
  { id: '11-16', tip: 'unic', enunt: 'Ce regulă de validare potrivești pentru un cod poștal românesc (6 cifre)?', variante: ['Lungime text = 6', 'Listă', 'Dată', 'Zecimal între 0 și 6'], corect: 0 },
  { id: '11-17', tip: 'adevarat', enunt: 'Pe aceeași zonă pot exista mai multe reguli de formatare condiționată.', corect: true },
  { id: '11-18', tip: 'unic', enunt: 'Sursa unei liste de validare poate fi…', variante: ['valori scrise cu virgulă sau o zonă de celule', 'doar o formulă IF', 'doar o diagramă', 'doar valori numerice'], corect: 0 }
];
