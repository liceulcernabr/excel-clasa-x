/* =====================================================================
   data/functii.js — Dicționarul funcțiilor
   ---------------------------------------------------------------------
   • „en”        = numele funcției. În Excel funcțiile se scriu DOAR în
                   engleză (SUM, IF, VLOOKUP), chiar dacă meniurile sunt
                   în română.
   • „traducere” = ce înseamnă numele, pe românește (ajută la înțelegere).
                   NU este un nume care poate fi scris în formulă: dacă
                   elevul scrie =SUMĂ(…), simulatorul dă #NAME?, ca Excel,
                   și îi sugerează funcția corectă.
   • „ora”       = ora din planificare în care se predă funcția.
   ===================================================================== */
window.FUNCTII = [
  // ---- Ora 5: funcții de bază ----
  { en: 'SUM',       traducere: 'sumă',       ora: 5, cat: 'Matematice',  sintaxa: 'SUM(număr1, [număr2], …)', descriere: 'Adună toate numerele dintr-o zonă sau dintr-o listă de valori.' },
  { en: 'AVERAGE',   traducere: 'medie',      ora: 5, cat: 'Statistice',  sintaxa: 'AVERAGE(număr1, [număr2], …)', descriere: 'Calculează media aritmetică a numerelor (ignoră celulele goale și textul).' },
  { en: 'MIN',       traducere: 'minim',        ora: 5, cat: 'Statistice',  sintaxa: 'MIN(număr1, [număr2], …)', descriere: 'Returnează cea mai mică valoare numerică.' },
  { en: 'MAX',       traducere: 'maxim',        ora: 5, cat: 'Statistice',  sintaxa: 'MAX(număr1, [număr2], …)', descriere: 'Returnează cea mai mare valoare numerică.' },
  { en: 'COUNT',     traducere: 'numără (numerele)',     ora: 5, cat: 'Statistice',  sintaxa: 'COUNT(valoare1, [valoare2], …)', descriere: 'Numără celulele care conțin NUMERE.' },
  { en: 'COUNTA',    traducere: 'numără (celulele nevide)',    ora: 5, cat: 'Statistice',  sintaxa: 'COUNTA(valoare1, [valoare2], …)', descriere: 'Numără celulele care NU sunt goale (numere, text, erori).' },
  { en: 'COUNTBLANK',traducere: 'numără celulele goale',ora: 5, cat: 'Statistice',  sintaxa: 'COUNTBLANK(zonă)', descriere: 'Numără celulele goale dintr-o zonă.' },
  { en: 'ROUND',     traducere: 'rotunjește',  ora: 5, cat: 'Matematice',  sintaxa: 'ROUND(număr, nr_zecimale)', descriere: 'Rotunjește un număr la numărul de zecimale cerut.' },
  { en: 'ROUNDUP',   traducere: 'rotunjește în sus', ora: 5, cat: 'Matematice', sintaxa: 'ROUNDUP(număr, nr_zecimale)', descriere: 'Rotunjește mereu în sus (departe de zero).' },
  { en: 'ROUNDDOWN', traducere: 'rotunjește în jos', ora: 5, cat: 'Matematice', sintaxa: 'ROUNDDOWN(număr, nr_zecimale)', descriere: 'Rotunjește mereu în jos (spre zero).' },
  { en: 'INT',       traducere: 'partea întreagă',     ora: 5, cat: 'Matematice',  sintaxa: 'INT(număr)', descriere: 'Partea întreagă (rotunjire în jos la cel mai apropiat întreg).' },
  { en: 'ABS',       traducere: 'valoare absolută',        ora: 5, cat: 'Matematice',  sintaxa: 'ABS(număr)', descriere: 'Valoarea absolută (modulul) unui număr.' },
  { en: 'MOD',       traducere: 'restul împărțirii',       ora: 5, cat: 'Matematice',  sintaxa: 'MOD(număr, împărțitor)', descriere: 'Restul împărțirii.' },
  { en: 'POWER',     traducere: 'putere',     ora: 5, cat: 'Matematice',  sintaxa: 'POWER(număr, putere)', descriere: 'Ridică un număr la o putere (la fel ca operatorul ^).' },
  { en: 'SQRT',      traducere: 'radical',    ora: 5, cat: 'Matematice',  sintaxa: 'SQRT(număr)', descriere: 'Rădăcina pătrată a unui număr pozitiv.' },
  { en: 'PRODUCT',   traducere: 'produs',     ora: 5, cat: 'Matematice',  sintaxa: 'PRODUCT(număr1, [număr2], …)', descriere: 'Înmulțește toate numerele date.' },
  { en: 'TRUNC',     traducere: 'trunchiere', ora: 5, cat: 'Matematice',  sintaxa: 'TRUNC(număr, [nr_zecimale])', descriere: 'Taie zecimalele, fără rotunjire.' },
  { en: 'MEDIAN',    traducere: 'mediană',    ora: 5, cat: 'Statistice',  sintaxa: 'MEDIAN(număr1, …)', descriere: 'Valoarea din mijloc a numerelor ordonate.' },
  { en: 'LARGE',     traducere: 'a k-a cea mai mare',       ora: 5, cat: 'Statistice',  sintaxa: 'LARGE(zonă, k)', descriere: 'A k-a cea mai mare valoare.' },
  { en: 'SMALL',     traducere: 'a k-a cea mai mică',        ora: 5, cat: 'Statistice',  sintaxa: 'SMALL(zonă, k)', descriere: 'A k-a cea mai mică valoare.' },
  { en: 'RANK',      traducere: 'rang, loc în clasament',       ora: 5, cat: 'Statistice',  sintaxa: 'RANK(număr, zonă, [ordine])', descriere: 'Locul unui număr într-o listă (0 = descrescător, 1 = crescător).' },
  { en: 'RANK.EQ',   traducere: 'rang (varianta nouă)',    ora: 5, cat: 'Statistice',  sintaxa: 'RANK.EQ(număr, zonă, [ordine])', descriere: 'Varianta nouă a funcției RANK.' },
  { en: 'SUMPRODUCT',traducere: 'suma produselor',ora: 7, cat: 'Matematice',  sintaxa: 'SUMPRODUCT(zonă1, [zonă2], …)', descriere: 'Înmulțește element cu element zonele și adună produsele.' },

  // ---- Ora 6: funcții logice ----
  { en: 'IF',        traducere: 'dacă',       ora: 6, cat: 'Logice',      sintaxa: 'IF(test_logic, valoare_dacă_adevărat, [valoare_dacă_fals])', descriere: 'Alege între două rezultate în funcție de o condiție.' },
  { en: 'AND',       traducere: 'și',         ora: 6, cat: 'Logice',      sintaxa: 'AND(condiție1, [condiție2], …)', descriere: 'TRUE doar dacă TOATE condițiile sunt adevărate.' },
  { en: 'OR',        traducere: 'sau',        ora: 6, cat: 'Logice',      sintaxa: 'OR(condiție1, [condiție2], …)', descriere: 'TRUE dacă CEL PUȚIN o condiție este adevărată.' },
  { en: 'NOT',       traducere: 'nu (negație)',         ora: 6, cat: 'Logice',      sintaxa: 'NOT(condiție)', descriere: 'Inversează valoarea logică.' },
  { en: 'IFS',       traducere: 'dacă (mai multe condiții)', ora: 6, cat: 'Logice', sintaxa: 'IFS(cond1, val1, cond2, val2, …)', descriere: 'Alege valoarea primei condiții adevărate (Excel 2019 și mai nou).' },
  { en: 'SWITCH',    traducere: 'comutator', ora: 6, cat: 'Logice', sintaxa: 'SWITCH(expresie, valoare1, rezultat1, …, [implicit])', descriere: 'Compară o valoare cu o listă și întoarce rezultatul potrivit (Excel 2019 și mai nou).' },
  { en: 'IFERROR',   traducere: 'dacă e eroare', ora: 6, cat: 'Logice',      sintaxa: 'IFERROR(valoare, valoare_dacă_eroare)', descriere: 'Înlocuiește o eroare cu o valoare aleasă de tine.' },
  { en: 'IFNA',      traducere: 'dacă e #N/A',     ora: 9, cat: 'Logice',      sintaxa: 'IFNA(valoare, valoare_dacă_nd)', descriere: 'Înlocuiește doar eroarea #N/A.' },
  { en: 'TRUE',      traducere: 'adevărat',   ora: 6, cat: 'Logice',      sintaxa: 'TRUE()', descriere: 'Valoarea logică TRUE (adevărat).' },
  { en: 'FALSE',     traducere: 'fals',       ora: 6, cat: 'Logice',      sintaxa: 'FALSE()', descriere: 'Valoarea logică FALS.' },
  { en: 'ISNUMBER',  traducere: 'este număr?',    ora: 6, cat: 'Informații',  sintaxa: 'ISNUMBER(valoare)', descriere: 'TRUE dacă valoarea este număr.' },
  { en: 'ISTEXT',    traducere: 'este text?',   ora: 6, cat: 'Informații',  sintaxa: 'ISTEXT(valoare)', descriere: 'TRUE dacă valoarea este text.' },
  { en: 'ISBLANK',   traducere: 'este goală?',    ora: 6, cat: 'Informații',  sintaxa: 'ISBLANK(valoare)', descriere: 'TRUE dacă celula este goală.' },
  { en: 'ISERROR',   traducere: 'este eroare?', ora: 6, cat: 'Informații',  sintaxa: 'ISERROR(valoare)', descriere: 'TRUE dacă valoarea este o eroare.' },
  { en: 'CHOOSE',    traducere: 'alege',      ora: 6, cat: 'Căutare',     sintaxa: 'CHOOSE(index, val1, val2, …)', descriere: 'Alege valoarea cu numărul de ordine dat.' },

  // ---- Ora 7: funcții condiționale ----
  { en: 'COUNTIF',   traducere: 'numără dacă', ora: 7, cat: 'Statistice',  sintaxa: 'COUNTIF(zonă, criteriu)', descriere: 'Numără celulele care îndeplinesc un criteriu.' },
  { en: 'COUNTIFS',  traducere: 'numără dacă (mai multe condiții)',ora: 7, cat: 'Statistice',  sintaxa: 'COUNTIFS(zonă1, criteriu1, [zonă2, criteriu2], …)', descriere: 'Numără rândurile care îndeplinesc TOATE criteriile.' },
  { en: 'SUMIF',     traducere: 'sumă dacă',   ora: 7, cat: 'Matematice',  sintaxa: 'SUMIF(zonă, criteriu, [zonă_sumă])', descriere: 'Adună valorile care îndeplinesc un criteriu.' },
  { en: 'SUMIFS',    traducere: 'sumă dacă (mai multe condiții)',  ora: 7, cat: 'Matematice',  sintaxa: 'SUMIFS(zonă_sumă, zonă1, criteriu1, …)', descriere: 'Adună valorile care îndeplinesc TOATE criteriile.' },
  { en: 'AVERAGEIF', traducere: 'medie dacă',  ora: 7, cat: 'Statistice',  sintaxa: 'AVERAGEIF(zonă, criteriu, [zonă_medie])', descriere: 'Media valorilor care îndeplinesc un criteriu.' },
  { en: 'AVERAGEIFS',traducere: 'medie dacă (mai multe condiții)', ora: 7, cat: 'Statistice',  sintaxa: 'AVERAGEIFS(zonă_medie, zonă1, criteriu1, …)', descriere: 'Media valorilor care îndeplinesc TOATE criteriile.' },
  { en: 'MAXIFS',    traducere: 'maxim dacă',   ora: 7, cat: 'Statistice',  sintaxa: 'MAXIFS(zonă_max, zonă1, criteriu1, …)', descriere: 'Maximul valorilor care îndeplinesc criteriile.' },
  { en: 'MINIFS',    traducere: 'minim dacă',   ora: 7, cat: 'Statistice',  sintaxa: 'MINIFS(zonă_min, zonă1, criteriu1, …)', descriere: 'Minimul valorilor care îndeplinesc criteriile.' },

  // ---- Ora 8: funcții text și dată ----
  { en: 'LEFT',      traducere: 'stânga',     ora: 8, cat: 'Text',        sintaxa: 'LEFT(text, [nr_caractere])', descriere: 'Primele caractere din stânga unui text.' },
  { en: 'RIGHT',     traducere: 'dreapta',    ora: 8, cat: 'Text',        sintaxa: 'RIGHT(text, [nr_caractere])', descriere: 'Ultimele caractere din dreapta unui text.' },
  { en: 'MID',       traducere: 'mijloc (extrage)',    ora: 8, cat: 'Text',        sintaxa: 'MID(text, poziție_start, nr_caractere)', descriere: 'Caracterele din mijlocul unui text, de la o poziție dată.' },
  { en: 'LEN',       traducere: 'lungime',    ora: 8, cat: 'Text',        sintaxa: 'LEN(text)', descriere: 'Numărul de caractere dintr-un text (inclusiv spațiile).' },
  { en: 'UPPER',     traducere: 'majuscule',  ora: 8, cat: 'Text',        sintaxa: 'UPPER(text)', descriere: 'Transformă textul în MAJUSCULE.' },
  { en: 'LOWER',     traducere: 'minuscule',  ora: 8, cat: 'Text',        sintaxa: 'LOWER(text)', descriere: 'Transformă textul în minuscule.' },
  { en: 'PROPER',    traducere: 'inițiale mari', ora: 8, cat: 'Text',      sintaxa: 'PROPER(text)', descriere: 'Prima literă a fiecărui cuvânt devine majusculă.' },
  { en: 'TRIM',      traducere: 'elimină spațiile în plus', ora: 8, cat: 'Text',     sintaxa: 'TRIM(text)', descriere: 'Elimină spațiile în plus.' },
  { en: 'CONCAT',    traducere: 'concatenează (lipește)',     ora: 8, cat: 'Text',        sintaxa: 'CONCAT(text1, [text2], …)', descriere: 'Lipește mai multe texte (echivalent cu operatorul &).' },
  { en: 'CONCATENATE', traducere: 'concatenează (varianta veche)', ora: 8, cat: 'Text',     sintaxa: 'CONCATENATE(text1, [text2], …)', descriere: 'Varianta veche a funcției CONCAT.' },
  { en: 'TEXTJOIN',  traducere: 'unește texte cu separator', ora: 8, cat: 'Text',        sintaxa: 'TEXTJOIN(separator, ignoră_goale, text1, …)', descriere: 'Lipește texte punând un separator între ele.' },
  { en: 'SUBSTITUTE',traducere: 'înlocuiește', ora: 8, cat: 'Text',        sintaxa: 'SUBSTITUTE(text, text_vechi, text_nou, [apariția])', descriere: 'Înlocuiește un fragment de text cu altul.' },
  { en: 'FIND',      traducere: 'găsește',    ora: 8, cat: 'Text',        sintaxa: 'FIND(text_căutat, în_text, [start])', descriere: 'Poziția unui text în alt text (ține cont de majuscule).' },
  { en: 'SEARCH',    traducere: 'caută',      ora: 8, cat: 'Text',        sintaxa: 'SEARCH(text_căutat, în_text, [start])', descriere: 'Poziția unui text în alt text (NU ține cont de majuscule).' },
  { en: 'REPT',      traducere: 'repetă',     ora: 8, cat: 'Text',        sintaxa: 'REPT(text, de_câte_ori)', descriere: 'Repetă un text de un număr de ori.' },
  { en: 'EXACT',     traducere: 'identic',    ora: 8, cat: 'Text',        sintaxa: 'EXACT(text1, text2)', descriere: 'TRUE dacă textele sunt identice (inclusiv majusculele).' },
  { en: 'VALUE',     traducere: 'valoare numerică',    ora: 8, cat: 'Text',        sintaxa: 'VALUE(text)', descriere: 'Transformă un text care arată ca un număr în număr.' },
  { en: 'TEXT',      traducere: 'text formatat',       ora: 8, cat: 'Text',        sintaxa: 'TEXT(valoare, "format")', descriere: 'Transformă un număr sau o dată în text cu un anumit format.' },
  { en: 'TODAY',     traducere: 'astăzi',     ora: 8, cat: 'Dată și oră', sintaxa: 'TODAY()', descriere: 'Data de azi (se actualizează automat).' },
  { en: 'NOW',       traducere: 'acum',       ora: 8, cat: 'Dată și oră', sintaxa: 'NOW()', descriere: 'Data și ora curentă.' },
  { en: 'YEAR',      traducere: 'an',         ora: 8, cat: 'Dată și oră', sintaxa: 'YEAR(dată)', descriere: 'Anul dintr-o dată.' },
  { en: 'MONTH',     traducere: 'lună',       ora: 8, cat: 'Dată și oră', sintaxa: 'MONTH(dată)', descriere: 'Luna (1–12) dintr-o dată.' },
  { en: 'DAY',       traducere: 'zi',         ora: 8, cat: 'Dată și oră', sintaxa: 'DAY(dată)', descriere: 'Ziua (1–31) dintr-o dată.' },
  { en: 'DATE',      traducere: 'dată',       ora: 8, cat: 'Dată și oră', sintaxa: 'DATE(an, lună, zi)', descriere: 'Construiește o dată din an, lună și zi.' },
  { en: 'WEEKDAY',   traducere: 'ziua săptămânii',   ora: 8, cat: 'Dată și oră', sintaxa: 'WEEKDAY(dată, [tip])', descriere: 'Ziua din săptămână (cu tipul 2: luni = 1 … duminică = 7).' },
  { en: 'DATEDIF',   traducere: 'diferența dintre date',    ora: 8, cat: 'Dată și oră', sintaxa: 'DATEDIF(dată_start, dată_final, "unitate")', descriere: 'Diferența dintre două date în ani ("Y"), luni ("M") sau zile ("D").' },
  { en: 'DAYS',      traducere: 'zile',       ora: 8, cat: 'Dată și oră', sintaxa: 'DAYS(dată_final, dată_start)', descriere: 'Numărul de zile dintre două date.' },

  // ---- Ora 9: funcții de căutare ----
  { en: 'VLOOKUP',   traducere: 'căutare verticală',   ora: 9, cat: 'Căutare',     sintaxa: 'VLOOKUP(valoare_căutată, tabel, nr_coloană, [FALSE])', descriere: 'Caută VERTICAL în prima coloană a tabelului și aduce valoarea din coloana cerută.' },
  { en: 'HLOOKUP',   traducere: 'căutare orizontală',   ora: 9, cat: 'Căutare',     sintaxa: 'HLOOKUP(valoare_căutată, tabel, nr_rând, [FALSE])', descriere: 'Caută ORIZONTAL în primul rând al tabelului.' },
  { en: 'XLOOKUP',   traducere: 'căutare (modernă)',   ora: 9, cat: 'Căutare',     sintaxa: 'XLOOKUP(valoare, zonă_căutare, zonă_rezultat, [dacă_nu_găsește])', descriere: 'Căutare modernă, în orice direcție.' },
  { en: 'INDEX',     traducere: 'index (element de la poziția)',      ora: 9, cat: 'Căutare',     sintaxa: 'INDEX(zonă, nr_rând, [nr_coloană])', descriere: 'Valoarea aflată la un anumit rând și coloană dintr-o zonă.' },
  { en: 'MATCH',     traducere: 'potrivire (poziție)',  ora: 9, cat: 'Căutare',     sintaxa: 'MATCH(valoare, zonă, [0])', descriere: 'Poziția unei valori într-o zonă (cu 0 = potrivire exactă).' },
  { en: 'ROWS',      traducere: 'număr de rânduri',    ora: 9, cat: 'Căutare',     sintaxa: 'ROWS(zonă)', descriere: 'Numărul de rânduri dintr-o zonă.' },
  { en: 'COLUMNS',   traducere: 'număr de coloane',    ora: 9, cat: 'Căutare',     sintaxa: 'COLUMNS(zonă)', descriere: 'Numărul de coloane dintr-o zonă.' },
  { en: 'ROW',       traducere: 'rândul',       ora: 9, cat: 'Căutare',     sintaxa: 'ROW([referință])', descriere: 'Numărul rândului unei celule.' },
  { en: 'COLUMN',    traducere: 'coloana',    ora: 9, cat: 'Căutare',     sintaxa: 'COLUMN([referință])', descriere: 'Numărul coloanei unei celule.' },

  // ---- Ora 13: subtotaluri ----
  { en: 'SUBTOTAL',  traducere: 'subtotal',   ora: 13, cat: 'Matematice', sintaxa: 'SUBTOTAL(cod_funcție, zonă)', descriere: 'Calculează un total (9 = sumă, 1 = medie, 2 = numărare …) ignorând alte subtotaluri.' }
];
