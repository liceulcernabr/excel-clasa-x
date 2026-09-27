/* =====================================================================
   config.js — SETĂRILE SITE-ULUI (le poate modifica profesorul)
   ===================================================================== */
window.CONFIG = {
  scoala: 'Liceul Teoretic „Panait Cerna” Brăila',
  profesor: 'prof. Aura Ion',
  disciplina: 'Tehnologia Informației și a Comunicațiilor',
  clasa: 'a X-a',
  anScolar: '2025–2026',

  /* ---- Modul profesor ----
     Se activează cu combinația de taste Ctrl + Alt + P sau cu 5 clicuri
     rapide pe sigla din colțul stânga-sus, apoi se introduce parola.
     ATENȚIE: aceasta NU este o protecție reală! Parola se vede în acest
     fișier și oricine știe să deschidă codul sursă o poate găsi. Scopul
     ei este doar să nu afișeze baremul și soluțiile din greșeală. */
  parolaProfesor: 'cerna2025',

  /* ---- Teste ---- */
  teste: {
    feedback: 'imediat',     // 'imediat' = după fiecare răspuns; 'final' = doar la sfârșit
    timerImplicit: false,    // true = cronometrul pornește implicit
    minutePeItem: 1.5,       // timpul recomandat per întrebare (când timerul e activ)
    itemiMiniTest: 7,        // câte întrebări se extrag la un mini-test (5–8)
    itemiEvaluare: 15,       // câte întrebări are un test de evaluare
    punctDinOficiu: true     // nota = 1 punct din oficiu + 9 puncte pentru răspunsuri
  },

  /* ---- Formule ----
     În Excel funcțiile se scriu în engleză (SUM, IF, VLOOKUP).
     Separatorul de argumente depinde de setările regionale:
     ','  → =ROUND(A1,2)   (setări englezești, zecimale cu punct)
     ';'  → =ROUND(A1;2)   (setări românești, zecimale cu virgulă)
     Elevul îl poate schimba din butonul „a,b” din antet; aceasta e valoarea implicită. */
  separatorFormule: ',',

  /* ---- Biblioteci externe (doar de pe cdn.jsdelivr.net) ---- */
  sheetjs: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
};
