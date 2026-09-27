/* =====================================================================
   data/cuprins.js — Planificarea celor 15 ore
   „disponibil: true” = lecția are conținut (fișierul data/lectii/ora-XX.js)
   „evaluareDupa” = după această oră urmează un test de evaluare
   ===================================================================== */
window.CUPRINS = [
  { nr: 1,  titlu: 'Interfața Excel', detalii: 'Registru, foi de calcul, celule, zone, tipuri de date', disponibil: true },
  { nr: 2,  titlu: 'Introducerea și formatarea datelor', detalii: 'Editare, formatarea celulelor, formate numerice', disponibil: true },
  { nr: 3,  titlu: 'Completarea automată și seriile', detalii: 'Serii, copiere/mutare, inserare/ștergere rânduri și coloane', disponibil: true },
  { nr: 4,  titlu: 'Formule și referințe', detalii: 'Operatori, ordinea operațiilor, referințe relative, absolute, mixte', disponibil: true },
  { nr: 5,  titlu: 'Funcții de bază', detalii: 'SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, ROUND', disponibil: true, evaluareDupa: 1 },
  { nr: 6,  titlu: 'Funcții logice', detalii: 'IF, AND, OR, NOT, IF imbricat', disponibil: true },
  { nr: 7,  titlu: 'Funcții condiționale', detalii: 'COUNTIF(S), SUMIF(S), AVERAGEIF(S)', disponibil: true },
  { nr: 8,  titlu: 'Funcții text și dată', detalii: 'LEFT, RIGHT, MID, LEN, UPPER, CONCAT/&, TODAY, YEAR, DATEDIF', disponibil: true },
  { nr: 9,  titlu: 'Funcții de căutare', detalii: 'VLOOKUP, HLOOKUP, XLOOKUP, INDEX + MATCH', disponibil: true },
  { nr: 10, titlu: 'Sortare și filtrare', detalii: 'Sortare pe mai multe criterii, filtru automat și avansat', disponibil: true, evaluareDupa: 2 },
  { nr: 11, titlu: 'Formatare condiționată și validare', detalii: 'Reguli, liste derulante, mesaje de eroare', disponibil: true },
  { nr: 12, titlu: 'Diagrame', detalii: 'Alegerea tipului, elemente, formatare, interpretare', disponibil: true },
  { nr: 13, titlu: 'Tabele pivot și subtotaluri', detalii: 'Rezumarea datelor, grupare, SUBTOTAL', disponibil: true },
  { nr: 14, titlu: 'Mai multe foi, protecție, imprimare', detalii: 'Referințe între foi, protejarea foii, setări de imprimare', disponibil: true },
  { nr: 15, titlu: 'Recapitulare și proiect final', detalii: 'Proiect evaluat care folosește tot ce ai învățat', disponibil: true, evaluareDupa: 3 }
];

window.EVALUARI = [
  { nr: 1, titlu: 'Evaluarea 1', ore: [1, 2, 3, 4, 5], descriere: 'Interfață, date, formule, referințe, funcții de bază' },
  { nr: 2, titlu: 'Evaluarea 2', ore: [6, 7, 8, 9, 10], descriere: 'Funcții logice, condiționale, text, dată, căutare, sortare și filtrare' },
  { nr: 3, titlu: 'Evaluarea 3', ore: [11, 12, 13, 14, 15], descriere: 'Formatare condiționată, validare, diagrame, pivot, mai multe foi' }
];
