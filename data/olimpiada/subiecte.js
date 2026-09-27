/* =====================================================================
   data/olimpiada/subiecte.js — Subiecte de ANTRENAMENT pentru
   secțiunea Excel a Olimpiadei de TIC
   ---------------------------------------------------------------------
   ATENȚIE: acestea NU sunt subiecte oficiale. Sunt create pentru
   antrenament, după modelul tipurilor de cerințe întâlnite la olimpiadă
   (formule imbricate, căutări, funcții condiționale multiple, formatare
   condiționată cu formulă, validări, diagrame, pivot, sortări și filtre,
   lucrul cu mai multe foi). Datele sunt fictive.

   Structura unui subiect:
   { id, titlu, dificultate: 1–3, timp (minute), fisier, tipologie: [...],
     context: 'enunțul general',
     foi: [ … foile de pornire (ca în lecții) … ],
     cerinte: [ { nr, puncte, text,
                  reguli: [ … aceleași reguli ca la exerciții, cu „foaie: index” … ],
                  manual: true  ← cerință fără verificare automată (autoevaluare),
                  solutie: 'rezolvarea pas cu pas (HTML)' } ] }
   Punctajul total al unui subiect este 100.
   ===================================================================== */
window.SUBIECTE_OLIMPIADA = [];

/* ------------------------------------------------------------------
   Subiectul 1 — Campionatul de robotică
   ------------------------------------------------------------------ */
(function () {
  const echipe = [
    ['Cod', 'Echipă', 'Instituție', 'Oraș', 'Categorie'],
    ['E01', 'RoboCerna', 'Liceul „Panait Cerna”', 'Brăila', 'Senior'],
    ['E02', 'Dunărea Bots', 'Liceul Teoretic nr. 2', 'Brăila', 'Senior'],
    ['E03', 'Mecatronix', 'Liceul Tehnologic nr. 1', 'Galați', 'Junior'],
    ['E04', 'Circuit Kids', 'Școala Gimnazială nr. 5', 'Brăila', 'Junior'],
    ['E05', 'Delta Robotics', 'Liceul Teoretic nr. 1', 'Tulcea', 'Senior'],
    ['E06', 'Bitboții', 'Colegiul Tehnic nr. 3', 'Galați', 'Senior'],
    ['E07', 'Servo Squad', 'Școala Gimnazială nr. 2', 'Tulcea', 'Junior'],
    ['E08', 'NanoGear', 'Liceul „Panait Cerna”', 'Brăila', 'Junior'],
    ['E09', 'IronCode', 'Colegiul Economic nr. 1', 'Galați', 'Senior'],
    ['E10', 'Sparky', 'Școala Gimnazială nr. 11', 'Brăila', 'Junior'],
    ['E11', 'Techno Brăila', 'Liceul Tehnologic nr. 4', 'Brăila', 'Senior'],
    ['E12', 'Blue Pixel', 'Liceul de Arte nr. 1', 'Tulcea', 'Junior']
  ];
  const punctaje = [
    ['Cod', 'Proba 1', 'Proba 2', 'Proba 3', 'Penalizări', 'Total', 'Echipă', 'Categorie', 'Premiu', 'Loc'],
    ['E01', 92, 88, 95, 5], ['E02', 80, 75, 85, 10], ['E03', 70, 65, 72, 25], ['E04', 60, 58, 66, 0],
    ['E05', 88, 91, 84, 15], ['E06', 78, 82, 80, 5], ['E07', 55, 62, 58, 10], ['E08', 90, 85, 88, 0],
    ['E09', 66, 70, 64, 30], ['E10', 50, 48, 55, 5], ['E11', 85, 80, 90, 20], ['E12', 72, 68, 75, 5]
  ];
  window.SUBIECTE_OLIMPIADA.push({
    id: 1, titlu: 'Campionatul de robotică', dificultate: 1, timp: 60, fisier: 'olimpiada-antrenament-1-robotica.xlsx',
    tipologie: ['formule', 'VLOOKUP aproximativ', 'IF imbricat', 'RANK', 'funcții condiționale între foi', 'formatare condiționată cu formulă', 'sortare pe două criterii', 'diagramă'],
    context: 'La campionatul regional de robotică au participat 12 echipe. Foaia <b>Echipe</b> conține datele echipelor, foaia <b>Punctaje</b> — punctele obținute la cele trei probe și penalizările, foaia <b>Premii</b> — pragurile de acordare a premiilor, iar foaia <b>Statistici</b> se completează de voi. Toate rezultatele se obțin prin formule.',
    foi: [
      { name: 'Echipe', data: echipe, bold: 'A1:E1', widths: { B: 110, C: 160, D: 70, E: 76 } },
      { name: 'Punctaje', rows: 16, cols: 12, data: punctaje, bold: 'A1:J1', widths: { G: 110, H: 76, I: 90 } },
      { name: 'Premii', data: [['Prag', 'Premiu'], [0, '—'], [150, 'Mențiune'], [200, 'Premiul III'], [230, 'Premiul II'], [260, 'Premiul I']], bold: 'A1:B1' },
      { name: 'Statistici', rows: 8, cols: 6, data: [['Indicator', 'Valoare', '', 'Categorie', 'Media totalului'], ['Echipe Senior din Brăila', '', '', 'Junior'], ['Media totalului echipelor Junior', '', '', 'Senior'], ['Totalul maxim la Senior']], bold: 'A1:E1', widths: { A: 220, D: 80, E: 120 } }
    ],
    cerinte: [
      { nr: 1, puncte: 10, text: 'Pe foaia <b>Punctaje</b>, în coloana <b>Total</b> (F2:F13), calculați totalul fiecărei echipe: suma celor trei probe minus penalizările.',
        reguli: [{ foaie: 1, formula: 'F2:F13', solutie: '=B2+C2+D2-E2' }],
        solutie: '<ol><li>În F2 scrieți <code>=B2+C2+D2-E2</code> (sau <code>=SUM(B2:D2)-E2</code>).</li><li>Copiați formula până în F13 cu ghidajul de umplere.</li></ol>' },
      { nr: 2, puncte: 10, text: 'În coloanele <b>Echipă</b> (G) și <b>Categorie</b> (H) aduceți din foaia Echipe denumirea echipei și categoria, după cod, cu o funcție de căutare cu potrivire exactă.',
        reguli: [{ foaie: 1, formula: 'G2:G13', solutie: '=VLOOKUP(A2,Echipe!$A$2:$E$13,2,FALSE)', functii: ['VLOOKUP'] }, { foaie: 1, formula: 'H2:H13', solutie: '=VLOOKUP(A2,Echipe!$A$2:$E$13,5,FALSE)', functii: ['VLOOKUP'] }],
        solutie: '<ol><li>G2: <code>=VLOOKUP(A2,Echipe!$A$2:$E$13,2,FALSE)</code> — tabelul este pe altă foaie și blocat cu $.</li><li>H2: aceeași formulă, cu coloana 5 (Categorie).</li><li>Copiați în jos. Se acceptă și XLOOKUP sau INDEX+MATCH (verificatorul automat cere VLOOKUP).</li></ol>' },
      { nr: 3, puncte: 15, text: 'În coloana <b>Premiu</b> (I) afișați premiul după total, folosind tabelul de praguri din foaia Premii (potrivire aproximativă). Echipele cu <b>mai mult de 20</b> de puncte de penalizare nu primesc premiu: pentru ele se afișează „—”.',
        reguli: [{ foaie: 1, formula: 'I2:I13', solutie: '=IF(E2>20,"—",VLOOKUP(F2,Premii!$A$2:$B$6,2,TRUE))', functii: ['IF', 'VLOOKUP'] }],
        solutie: '<ol><li>Condiția de descalificare se testează prima: <code>IF(E2>20,"—", …)</code>.</li><li>Pe ramura „fals” se caută premiul cu potrivire aproximativă: <code>VLOOKUP(F2,Premii!$A$2:$B$6,2,TRUE)</code> — pragurile sunt sortate crescător.</li><li>Formula completă: <code>=IF(E2>20,"—",VLOOKUP(F2,Premii!$A$2:$B$6,2,TRUE))</code>.</li></ol>' },
      { nr: 4, puncte: 10, text: 'În coloana <b>Loc</b> (J) calculați locul fiecărei echipe în clasamentul general, după total (cel mai mare total = locul 1).',
        reguli: [{ foaie: 1, formula: 'J2:J13', solutie: '=RANK(F2,$F$2:$F$13)', functii: ['RANK'] }],
        solutie: '<ol><li><code>=RANK(F2,$F$2:$F$13)</code> (sau RANK.EQ); al treilea argument lipsă (0) înseamnă ordine descrescătoare.</li><li>Echipele cu total egal primesc același loc (E06 și E11 — locul 4).</li></ol>' },
      { nr: 5, puncte: 15, text: 'Pe foaia <b>Statistici</b>: în B2 — numărul echipelor <i>Senior</i> din <i>Brăila</i> (din foaia Echipe); în B3 — media totalului echipelor <i>Junior</i>, rotunjită la 2 zecimale; în B4 — cel mai mare total obținut de o echipă <i>Senior</i>.',
        reguli: [
          { foaie: 3, formula: 'B2', solutie: '=COUNTIFS(Echipe!E2:E13,"Senior",Echipe!D2:D13,"Brăila")', functii: ['COUNTIFS'] },
          { foaie: 3, formula: 'B3', solutie: '=ROUND(AVERAGEIF(Punctaje!H2:H13,"Junior",Punctaje!F2:F13),2)', functii: ['ROUND', 'AVERAGEIF'] },
          { foaie: 3, formula: 'B4', solutie: '=MAXIFS(Punctaje!F2:F13,Punctaje!H2:H13,"Senior")', functii: ['MAXIFS'] }
        ],
        solutie: '<ol><li>B2: <code>=COUNTIFS(Echipe!E2:E13,"Senior",Echipe!D2:D13,"Brăila")</code> → 3.</li><li>B3: categoria a fost adusă în Punctaje!H, deci <code>=ROUND(AVERAGEIF(Punctaje!H2:H13,"Junior",Punctaje!F2:F13),2)</code>.</li><li>B4: <code>=MAXIFS(Punctaje!F2:F13,Punctaje!H2:H13,"Senior")</code> → 270.</li><li>Lucrând cu coloana Categorie din aceeași foaie cu totalurile, formulele rămân corecte și după sortarea foii Punctaje (cerința 7).</li></ol>' },
      { nr: 6, puncte: 15, text: 'Pe foaia Punctaje, aplicați o <b>formatare condiționată cu formulă</b> care colorează <b>întregul rând</b> (A:J) al echipelor care au obținut „Premiul I”.',
        reguli: [{ foaie: 1, cfEfect: { zona: 'A2:J13', tip: 'formula', conditie: (v, r, c, wb) => wb.getValue(1, r, 8) === 'Premiul I' } }],
        solutie: '<ol><li>Selectați A2:J13.</li><li>Formatare condiționată → Regulă nouă → Utilizare formulă: <code>=$I2="Premiul I"</code>.</li><li>$ doar la coloană: fiecare rând își verifică propria celulă din coloana I.</li></ol>' },
      { nr: 7, puncte: 15, text: 'Sortați tabelul de pe foaia Punctaje <b>descrescător după Total</b>, iar la total egal <b>crescător după Penalizări</b>. Rândurile trebuie să rămână întregi.',
        reguli: [{ foaie: 1, sortat: 'A1:J13', integritate: 'A1:E13', chei: [{ col: 'Total', desc: true }, { col: 'Penalizări', desc: false }] }],
        solutie: '<ol><li>Selectați o celulă din tabel → Date → Sortare personalizată.</li><li>Nivel 1: Total, de la cel mai mare la cel mai mic. Nivel 2: Penalizări, de la cel mai mic la cel mai mare.</li><li>E06 (penalizări 5) ajunge înaintea lui E11 (penalizări 20), deși au același total.</li></ol>' },
      { nr: 8, puncte: 10, text: 'Pe foaia Statistici, în E2:E3 calculați media totalului pentru categoria din coloana D (o singură formulă, copiată). Apoi inserați o diagramă <b>cu coloane</b> pentru zona D1:E3, cu un titlu care conține cuvântul „categorie”.',
        reguli: [{ foaie: 3, formula: 'E2:E3', solutie: '=AVERAGEIF(Punctaje!$H$2:$H$13,D2,Punctaje!$F$2:$F$13)', functii: ['AVERAGEIF'] }, { diagrama: { tip: ['coloane'], zona: 'D1:E3', titlu: 'categorie' } }],
        solutie: '<ol><li>E2: <code>=AVERAGEIF(Punctaje!$H$2:$H$13,D2,Punctaje!$F$2:$F$13)</code>, copiată în E3.</li><li>Selectați D1:E3 → Inserare → Diagramă cu coloane; titlu: „Media totalului pe categorie”.</li></ol>' }
    ]
  });
})();

/* ------------------------------------------------------------------
   Subiectul 2 — Biblioteca liceului
   ------------------------------------------------------------------ */
(function () {
  const carti = [
    ['Cod', 'Titlu', 'Autor', 'Gen', 'An'],
    ['C01', 'Enigma Otiliei', 'George Călinescu', 'Roman', 1938], ['C02', 'Baltagul', 'Mihail Sadoveanu', 'Roman', 1930],
    ['C03', 'Amintiri din copilărie', 'Ion Creangă', 'Proză', 1892], ['C04', 'Luceafărul', 'Mihai Eminescu', 'Poezie', 1883],
    ['C05', 'Ion', 'Liviu Rebreanu', 'Roman', 1920], ['C06', 'Moara cu noroc', 'Ioan Slavici', 'Nuvelă', 1881],
    ['C07', 'Plumb', 'George Bacovia', 'Poezie', 1916], ['C08', 'Maitreyi', 'Mircea Eliade', 'Roman', 1933],
    ['C09', 'O scrisoare pierdută', 'I. L. Caragiale', 'Teatru', 1884], ['C10', 'Ultima noapte de dragoste, întâia noapte de război', 'Camil Petrescu', 'Roman', 1930]
  ];
  const imprumuturi = [
    ['Nr.', 'Elev', 'Clasa', 'Cod carte', 'Data împrumut', 'Data returnare', 'Titlu', 'Zile', 'Întârziere', 'Penalizare', 'Stare'],
    [1, 'Andrei Maria', '10A', 'C05', '02.02.2026', '12.02.2026'], [2, 'Barbu Ștefan', '10B', 'C01', '05.02.2026', ''],
    [3, 'Constantin Ioana', '10A', 'C04', '20.02.2026', '28.02.2026'], [4, 'Dobre Alexandru', '10C', 'C09', '01.03.2026', ''],
    [5, 'Enache Daria', '10B', 'C02', '10.02.2026', '03.03.2026'], [6, 'Florea Matei', '10A', 'C08', '25.02.2026', ''],
    [7, 'Gheorghe Ana', '10C', 'C06', '06.03.2026', ''], [8, 'Ionescu Radu', '10B', 'C10', '15.01.2026', ''],
    [9, 'Marin Elena', '10A', 'C03', '03.03.2026', '10.03.2026'], [10, 'Nistor Vlad', '10C', 'C07', '12.02.2026', ''],
    [11, 'Popa Bianca', '10A', 'C01', '18.02.2026', '06.03.2026'], [12, 'Stoica Andrei', '10B', 'C05', '08.03.2026', '']
  ];
  window.SUBIECTE_OLIMPIADA.push({
    id: 2, titlu: 'Biblioteca liceului', dificultate: 2, timp: 75, fisier: 'olimpiada-antrenament-2-biblioteca.xlsx',
    tipologie: ['calcule cu date', 'IF imbricat', 'MAX în formulă', 'referințe între foi', 'INDEX + MATCH', 'validare', 'filtru avansat', 'formatare condiționată cu formulă'],
    context: 'Biblioteca liceului ține evidența împrumuturilor. Foaia <b>Cărți</b> conține catalogul, foaia <b>Împrumuturi</b> — împrumuturile (o celulă goală la „Data returnare” înseamnă carte nereturnată), iar foaia <b>Setări</b> — data curentă, penalizarea pe zi de întârziere și termenul de împrumut. Parametrii din Setări se folosesc prin referințe, nu se scriu în formule.',
    foi: [
      { name: 'Cărți', data: carti, bold: 'A1:E1', widths: { B: 220, C: 140, D: 70 } },
      { name: 'Împrumuturi', rows: 16, cols: 22, data: imprumuturi, bold: 'A1:K1', widths: { A: 36, B: 120, C: 50, D: 70, E: 100, F: 104, G: 200, H: 50, I: 76, J: 80, K: 86 }, formats: { 'E2:F13': 'date', 'J2:J13': 'currency' } },
      { name: 'Setări', rows: 9, cols: 4, data: [['Data curentă', '15.03.2026'], ['Penalizare / zi', 0.5], ['Termen (zile)', 14], [], ['Împrumuturi restante'], ['Penalizări clasa 10B'], ['Cartea cu cea mai mare penalizare']], bold: 'A1:A7', widths: { A: 230, B: 200 }, formats: { B2: 'currency', B6: 'currency' } }
    ],
    cerinte: [
      { nr: 1, puncte: 10, text: 'Pe foaia Împrumuturi, în coloana <b>Titlu</b> (G), aduceți titlul cărții după codul ei.',
        reguli: [{ foaie: 1, formula: 'G2:G13', solutie: '=VLOOKUP(D2,Cărți!$A$2:$E$11,2,FALSE)' }],
        solutie: '<ol><li><code>=VLOOKUP(D2,Cărți!$A$2:$E$11,2,FALSE)</code>, copiată în jos.</li></ol>' },
      { nr: 2, puncte: 15, text: 'În coloana <b>Zile</b> (H) calculați de câte zile este (sau a fost) împrumutată cartea: pentru cărțile returnate — diferența dintre data returnării și data împrumutului; pentru cele nereturnate — diferența dintre data curentă (Setări!B1) și data împrumutului.',
        reguli: [{ foaie: 1, formula: 'H2:H13', solutie: '=IF(F2="",Setări!$B$1-E2,F2-E2)', functii: ['IF'] }],
        solutie: '<ol><li>Datele sunt numere, deci se scad direct.</li><li><code>=IF(F2="",Setări!$B$1-E2,F2-E2)</code> — data curentă este fixă ($B$1).</li><li>Dacă rezultatul apare ca dată, schimbați formatul coloanei în General / Număr.</li></ol>' },
      { nr: 3, puncte: 15, text: 'În coloana <b>Întârziere</b> (I) calculați numărul de zile peste termen (0 dacă nu există întârziere), iar în coloana <b>Penalizare</b> (J) — valoarea penalizării. Folosiți parametrii din Setări.',
        reguli: [{ foaie: 1, formula: 'I2:I13', solutie: '=MAX(0,H2-Setări!$B$3)' }, { foaie: 1, formula: 'J2:J13', solutie: '=I2*Setări!$B$2' }],
        solutie: '<ol><li>I2: <code>=MAX(0,H2-Setări!$B$3)</code> — MAX împiedică valorile negative (sau <code>=IF(H2>Setări!$B$3,H2-Setări!$B$3,0)</code>).</li><li>J2: <code>=I2*Setări!$B$2</code>.</li></ol>' },
      { nr: 4, puncte: 10, text: 'În coloana <b>Stare</b> (K) afișați: „returnată” dacă există data returnării; altfel „restantă” dacă are întârziere; altfel „în termen”.',
        reguli: [{ foaie: 1, formula: 'K2:K13', solutie: '=IF(F2<>"","returnată",IF(I2>0,"restantă","în termen"))', functii: ['IF'] }],
        solutie: '<ol><li><code>=IF(F2<>"","returnată",IF(I2>0,"restantă","în termen"))</code>.</li></ol>' },
      { nr: 5, puncte: 15, text: 'Pe foaia Setări: în B5 — numărul împrumuturilor restante; în B6 — totalul penalizărilor elevilor din clasa 10B; în B7 — titlul cărții cu cea mai mare penalizare.',
        reguli: [
          { foaie: 2, formula: 'B5', solutie: '=COUNTIF(Împrumuturi!K2:K13,"restantă")', functii: ['COUNTIF'] },
          { foaie: 2, formula: 'B6', solutie: '=SUMIF(Împrumuturi!C2:C13,"10B",Împrumuturi!J2:J13)', functii: ['SUMIF'] },
          { foaie: 2, formula: 'B7', solutie: '=INDEX(Împrumuturi!G2:G13,MATCH(MAX(Împrumuturi!J2:J13),Împrumuturi!J2:J13,0))', functii: ['INDEX', 'MATCH', 'MAX'] }
        ],
        solutie: '<ol><li>B5: <code>=COUNTIF(Împrumuturi!K2:K13,"restantă")</code> → 4.</li><li>B6: <code>=SUMIF(Împrumuturi!C2:C13,"10B",Împrumuturi!J2:J13)</code>.</li><li>B7: MAX găsește penalizarea maximă, MATCH poziția ei, iar INDEX titlul de pe acea poziție: <code>=INDEX(Împrumuturi!G2:G13,MATCH(MAX(Împrumuturi!J2:J13),Împrumuturi!J2:J13,0))</code>.</li></ol>' },
      { nr: 6, puncte: 10, text: 'Pe foaia Împrumuturi, coloana <b>Clasa</b> (C2:C13) trebuie să accepte doar valorile 10A, 10B, 10C, dintr-o listă derulantă, cu mesaj de eroare de tip Stop.',
        reguli: [{ foaie: 1, validare: { celula: 'C2', accepta: ['10A', '10B', '10C'], refuza: ['11A', '10'], stil: 'stop' } }, { foaie: 1, validare: { celula: 'C13', accepta: ['10C'], refuza: ['x'] } }],
        solutie: '<ol><li>Selectați C2:C13 → Date → Validare date → Listă, sursa <code>10A,10B,10C</code>.</li><li>Fila Avertisment de eroare: stil Stop, cu titlu și mesaj.</li></ol>' },
      { nr: 7, puncte: 15, text: 'Cu <b>filtrul avansat</b>, copiați începând din celula <b>M6</b> a foii Împrumuturi împrumuturile care sunt <b>restante și aparțin clasei 10B</b>, <u>sau</u> au o <b>penalizare mai mare de 10 lei</b>. Zona de criterii o construiți voi, începând din M1.',
        reguli: [{ foaie: 1, copiat: { zona: 'A1:K13', dest: 'M6', conditie: (x) => (x['Clasa'] === '10B' && x['Stare'] === 'restantă') || x['Penalizare'] > 10 } }],
        solutie: '<ol><li>Zona de criterii (M1:O3): antetele <code>Clasa | Stare | Penalizare</code>; rândul 2: <code>10B | restantă |</code>; rândul 3: <code>| | &gt;10</code>.</li><li>Același rând = ȘI; rânduri diferite = SAU.</li><li>Date → Complex: lista A1:K13, criterii M1:O3, copiere în M6. Rezultat: împrumuturile 2 și 8.</li></ol>' },
      { nr: 8, puncte: 10, text: 'Colorați cu roșu, prin formatare condiționată cu formulă, <b>rândurile întregi</b> (A:K) ale împrumuturilor restante.',
        reguli: [{ foaie: 1, cfEfect: { zona: 'A2:K13', tip: 'formula', conditie: (v, r, c, wb) => wb.getValue(1, r, 10) === 'restantă' } }],
        solutie: '<ol><li>Selectați A2:K13 → regulă cu formula <code>=$K2="restantă"</code>, umplere roșie.</li></ol>' }
    ]
  });
})();

/* ------------------------------------------------------------------
   Subiectul 3 — Piața agroalimentară
   ------------------------------------------------------------------ */
(function () {
  const produse = [['Cod', 'Produs', 'Categorie', 'Preț/kg'],
    ['P01', 'Roșii', 'Legume', 7.5], ['P02', 'Castraveți', 'Legume', 6], ['P03', 'Cartofi', 'Legume', 3.2], ['P04', 'Mere', 'Fructe', 5],
    ['P05', 'Pere', 'Fructe', 8], ['P06', 'Struguri', 'Fructe', 12], ['P07', 'Brânză de vaci', 'Lactate', 22], ['P08', 'Telemea', 'Lactate', 28]];
  const vanzari = [['Data', 'Tarabă', 'Cod', 'Kg', 'Produs', 'Categorie', 'Preț', 'Valoare', 'Luna'],
    ['08.01.2026', 'T1', 'P03', 25], ['09.01.2026', 'T2', 'P07', 6.5], ['14.01.2026', 'T1', 'P04', 18], ['17.01.2026', 'T3', 'P08', 4.2],
    ['23.01.2026', 'T2', 'P01', 12], ['30.01.2026', 'T3', 'P05', 9.5], ['04.02.2026', 'T1', 'P02', 15], ['07.02.2026', 'T2', 'P06', 7],
    ['12.02.2026', 'T3', 'P07', 5], ['18.02.2026', 'T1', 'P03', 40], ['21.02.2026', 'T2', 'P08', 3.5], ['26.02.2026', 'T3', 'P04', 22],
    ['03.03.2026', 'T1', 'P01', 16], ['06.03.2026', 'T2', 'P05', 11], ['11.03.2026', 'T3', 'P06', 8.5], ['14.03.2026', 'T1', 'P07', 7],
    ['19.03.2026', 'T2', 'P02', 13], ['24.03.2026', 'T3', 'P03', 30], ['27.03.2026', 'T1', 'P08', 6], ['31.03.2026', 'T2', 'P04', 20]];
  const top3 = (wb) => { const l = []; for (let r = 1; r <= 20; r++) { const v = wb.getValue(1, r, 7); if (typeof v === 'number') l.push(v); } return l.sort((a, b) => b - a)[2]; };
  window.SUBIECTE_OLIMPIADA.push({
    id: 3, titlu: 'Piața agroalimentară', dificultate: 2, timp: 75, fisier: 'olimpiada-antrenament-3-piata.xlsx',
    tipologie: ['INDEX + MATCH', 'XLOOKUP', 'ROUND', 'MONTH', 'SUMIF / SUMIFS între foi', 'tabel pivot', 'diagramă radială', 'top N', 'validare numerică'],
    context: 'Trei tarabe dintr-o piață din Brăila își înregistrează vânzările din trimestrul I. Foaia <b>Produse</b> conține prețurile, foaia <b>Vânzări</b> — vânzările, iar foaia <b>Statistici</b> se completează de voi.',
    foi: [
      { name: 'Produse', data: produse, bold: 'A1:D1', widths: { B: 110, C: 80 }, formats: { 'D2:D9': 'currency' } },
      { name: 'Vânzări', rows: 24, cols: 12, data: vanzari, bold: 'A1:I1', widths: { A: 92, E: 110, F: 80, G: 70, H: 84 }, formats: { 'G2:H21': 'number:2' } },
      { name: 'Statistici', rows: 8, cols: 5, data: [['Categorie', 'Valoare totală', 'Kg vândute'], ['Legume'], ['Fructe'], ['Lactate']], bold: 'A1:C1', widths: { A: 90, B: 110, C: 90 } }
    ],
    cerinte: [
      { nr: 1, puncte: 10, text: 'Pe foaia Vânzări, în coloana <b>Produs</b> (E), aduceți denumirea produsului după cod, folosind <b>INDEX</b> și <b>MATCH</b>.',
        reguli: [{ foaie: 1, formula: 'E2:E21', solutie: '=INDEX(Produse!$B$2:$B$9,MATCH(C2,Produse!$A$2:$A$9,0))', functii: ['INDEX', 'MATCH'] }],
        solutie: '<ol><li><code>=INDEX(Produse!$B$2:$B$9,MATCH(C2,Produse!$A$2:$A$9,0))</code>.</li></ol>' },
      { nr: 2, puncte: 10, text: 'În coloana <b>Categorie</b> (F) aduceți categoria produsului cu funcția <b>XLOOKUP</b>.',
        reguli: [{ foaie: 1, formula: 'F2:F21', solutie: '=XLOOKUP(C2,Produse!$A$2:$A$9,Produse!$C$2:$C$9)', functii: ['XLOOKUP'] }],
        solutie: '<ol><li><code>=XLOOKUP(C2,Produse!$A$2:$A$9,Produse!$C$2:$C$9)</code>.</li></ol>' },
      { nr: 3, puncte: 10, text: 'În coloana <b>Preț</b> (G) aduceți prețul pe kilogram, iar în coloana <b>Valoare</b> (H) calculați valoarea vânzării (kg × preț), rotunjită la 2 zecimale cu o funcție.',
        reguli: [{ foaie: 1, formula: 'G2:G21', solutie: '=VLOOKUP(C2,Produse!$A$2:$D$9,4,FALSE)' }, { foaie: 1, formula: 'H2:H21', solutie: '=ROUND(D2*G2,2)', functii: ['ROUND'] }],
        solutie: '<ol><li>G2: <code>=VLOOKUP(C2,Produse!$A$2:$D$9,4,FALSE)</code>.</li><li>H2: <code>=ROUND(D2*G2,2)</code> — atenție: formatul cu 2 zecimale NU este o rotunjire.</li></ol>' },
      { nr: 4, puncte: 10, text: 'În coloana <b>Luna</b> (I) extrageți numărul lunii din dată.',
        reguli: [{ foaie: 1, formula: 'I2:I21', solutie: '=MONTH(A2)', functii: ['MONTH'] }],
        solutie: '<ol><li><code>=MONTH(A2)</code>; dacă apare ca dată, formatați coloana ca Număr/General.</li></ol>' },
      { nr: 5, puncte: 15, text: 'Pe foaia Statistici, pentru fiecare categorie din coloana A calculați valoarea totală (B) și numărul de kilograme vândute (C). Scrieți câte o singură formulă pe coloană, copiată în jos.',
        reguli: [{ foaie: 2, formula: 'B2:B4', solutie: '=SUMIF(Vânzări!$F$2:$F$21,A2,Vânzări!$H$2:$H$21)', functii: ['SUMIF'] }, { foaie: 2, formula: 'C2:C4', solutie: '=SUMIFS(Vânzări!$D$2:$D$21,Vânzări!$F$2:$F$21,A2)' }],
        solutie: '<ol><li>B2: <code>=SUMIF(Vânzări!$F$2:$F$21,A2,Vânzări!$H$2:$H$21)</code>.</li><li>C2: <code>=SUMIFS(Vânzări!$D$2:$D$21,Vânzări!$F$2:$F$21,A2)</code> (sau SUMIF).</li><li>Zonele sunt absolute, criteriul A2 relativ.</li></ol>' },
      { nr: 6, puncte: 15, text: 'Creați un <b>tabel pivot</b> pe o foaie nouă, cu tarabele pe rânduri, lunile pe coloane și suma valorilor.',
        reguli: [{ pivot: { randuri: 'Tarabă', coloane: 'Luna', valori: 'Valoare', fn: 'sum' } }],
        solutie: '<ol><li>Selectați o celulă din Vânzări → Inserare → Tabel pivot → foaie nouă.</li><li>Rânduri: Tarabă; Coloane: Luna; Valori: Suma de Valoare.</li></ol>' },
      { nr: 7, puncte: 10, text: 'Pe foaia Statistici inserați o diagramă <b>radială</b> (sau inel) pentru valoarea totală pe categorii (A1:B4), cu etichete de date și un titlu care conține cuvântul „categorii”.',
        reguli: [{ diagrama: { tip: ['placinta', 'inel'], zona: 'A1:B4', titlu: 'categorii', etichete: true } }],
        solutie: '<ol><li>Selectați A1:B4 → Inserare → Radială; adăugați etichete de date (procente) și titlul „Vânzări pe categorii”.</li></ol>' },
      { nr: 8, puncte: 10, text: 'Pe foaia Vânzări evidențiați cu formatare condiționată <b>cele mai mari 3 valori</b> din coloana Valoare.',
        reguli: [{ foaie: 1, cfEfect: { zona: 'H2:H21', conditie: (v, r, c, wb) => typeof v === 'number' && v >= top3(wb) } }],
        solutie: '<ol><li>Selectați H2:H21 → Formatare condiționată → Primele 10 elemente → N = 3.</li></ol>' },
      { nr: 9, puncte: 10, text: 'Coloana <b>Kg</b> (D2:D21) trebuie să accepte doar numere zecimale <b>mai mari decât 0</b>.',
        reguli: [{ foaie: 1, validare: { celula: 'D2', accepta: ['1,5', '40'], refuza: ['0', '-2', 'mult'] } }],
        solutie: '<ol><li>D2:D21 → Validare date → Zecimal → mai mare decât → 0.</li></ol>' }
    ]
  });
})();

/* ------------------------------------------------------------------
   Subiectul 4 — Concursul de matematică „Cerna” (fictiv)
   ------------------------------------------------------------------ */
(function () {
  const rez = [['Nume', 'Prenume', 'Clasa', 'P1', 'P2', 'P3', 'Total', 'Procent', 'Loc în clasă', 'Premiu', 'Cod'],
    ['Popescu', 'Ana', '9A', 10, 9, 8], ['Ionescu', 'Mihai', '9B', 6, 7, 5], ['Georgescu', 'Ioana', '10A', 9, 10, 10], ['Dumitru', 'Andrei', '10B', 5, 4, 6],
    ['Stan', 'Elena', '9A', 7, 8, 9], ['Radu', 'Victor', '10A', 8, 6, 7], ['Matei', 'Sofia', '9B', 10, 10, 8], ['Dinu', 'Paul', '10B', 9, 8, 9],
    ['Toma', 'Iulia', '9A', 4, 6, 5], ['Ursu', 'Victor', '10A', 7, 7, 8], ['Vlad', 'Carina', '9B', 8, 9, 6], ['Zaharia', 'Luca', '10B', 6, 5, 7],
    ['Albu', 'Cezar', '9A', 9, 9, 10], ['Bratu', 'Denisa', '10A', 5, 6, 4], ['Cazacu', 'Tudor', '9B', 7, 5, 8], ['Dragu', 'Alexia', '10B', 10, 9, 9]];
  const top3 = (wb) => { const l = []; for (let r = 1; r <= 16; r++) { const v = wb.getValue(0, r, 6); if (typeof v === 'number') l.push(v); } return l.sort((a, b) => b - a)[2]; };
  window.SUBIECTE_OLIMPIADA.push({
    id: 4, titlu: 'Concursul de matematică „Cerna”', dificultate: 2, timp: 75, fisier: 'olimpiada-antrenament-4-concurs.xlsx',
    tipologie: ['procente', 'COUNTIFS pentru clasament pe grupe', 'IF imbricat', 'funcții text', 'AVERAGEIF / COUNTIFS', 'top N', 'sortare pe două criterii', 'subtotaluri'],
    context: 'Rezultatele unui concurs școlar de matematică (date fictive) — trei probe, fiecare notată de la 0 la 10 (maximum 30 de puncte). Foaia <b>Rezultate</b> conține datele, foaia <b>Statistici</b> se completează de voi.',
    foi: [
      { name: 'Rezultate', rows: 22, cols: 12, data: rez, bold: 'A1:K1', widths: { A: 84, B: 70, C: 50, D: 36, E: 36, F: 36, G: 50, H: 70, I: 90, J: 90, K: 76 } },
      { name: 'Statistici', rows: 8, cols: 4, data: [['Clasa', 'Media totalului', 'Premianți'], ['9A'], ['9B'], ['10A'], ['10B']], bold: 'A1:C1', widths: { B: 110, C: 80 } }
    ],
    cerinte: [
      { nr: 1, puncte: 5, text: 'În coloana <b>Total</b> (G) calculați suma celor trei probe.',
        reguli: [{ formula: 'G2:G17', solutie: '=SUM(D2:F2)' }], solutie: '<ol><li><code>=SUM(D2:F2)</code>.</li></ol>' },
      { nr: 2, puncte: 10, text: 'În coloana <b>Procent</b> (H) calculați ce procent reprezintă totalul din punctajul maxim (30) și aplicați formatul Procent.',
        reguli: [{ formula: 'H2:H17', solutie: '=G2/30' }, { format: 'H2:H17', tip: 'percent' }],
        solutie: '<ol><li><code>=G2/30</code>; formatul Procent afișează 0,9 ca 90%.</li><li>Nu înmulțiți cu 100 dacă aplicați formatul Procent.</li></ol>' },
      { nr: 3, puncte: 15, text: 'În coloana <b>Loc în clasă</b> (I) calculați locul fiecărui elev în cadrul <b>clasei sale</b> (1 = cel mai mare total din clasă). Indiciu: numărați câți colegi din aceeași clasă au un total mai mare.',
        reguli: [{ formula: 'I2:I17', solutie: '=COUNTIFS($C$2:$C$17,C2,$G$2:$G$17,">"&G2)+1', functii: ['COUNTIFS'] }],
        solutie: '<ol><li>Locul = 1 + numărul colegilor din aceeași clasă cu total mai mare.</li><li><code>=COUNTIFS($C$2:$C$17,C2,$G$2:$G$17,">"&G2)+1</code> — criteriul se construiește cu &.</li></ol>' },
      { nr: 4, puncte: 15, text: 'În coloana <b>Premiu</b> (J): „Premiul I” pentru cel puțin 90%, „Premiul II” pentru cel puțin 80%, „Premiul III” pentru cel puțin 70%, „Mențiune” pentru cel puțin 60%; altfel celula rămâne goală ("").',
        reguli: [{ formula: 'J2:J17', solutie: '=IF(H2>=0.9,"Premiul I",IF(H2>=0.8,"Premiul II",IF(H2>=0.7,"Premiul III",IF(H2>=0.6,"Mențiune",""))))', functii: ['IF'] }],
        solutie: '<ol><li>IF imbricat, de la pragul cel mai mare: <code>=IF(H2>=0.9,"Premiul I",IF(H2>=0.8,"Premiul II",IF(H2>=0.7,"Premiul III",IF(H2>=0.6,"Mențiune",""))))</code>.</li><li>Procentul 90% este valoarea 0,9.</li></ol>' },
      { nr: 5, puncte: 10, text: 'În coloana <b>Cod</b> (K) construiți un cod format din primele 3 litere ale numelui, scrise cu majuscule, o cratimă și clasa (de exemplu POP-9A).',
        reguli: [{ formula: 'K2:K17', solutie: '=UPPER(LEFT(A2,3))&"-"&C2', functii: ['UPPER', 'LEFT'] }],
        solutie: '<ol><li><code>=UPPER(LEFT(A2,3))&"-"&C2</code>.</li></ol>' },
      { nr: 6, puncte: 15, text: 'Pe foaia Statistici, pentru fiecare clasă: media totalului, rotunjită la 2 zecimale (B), și numărul de premianți — elevi cu orice premiu sau mențiune (C).',
        reguli: [{ foaie: 1, formula: 'B2:B5', solutie: '=ROUND(AVERAGEIF(Rezultate!$C$2:$C$17,A2,Rezultate!$G$2:$G$17),2)', functii: ['ROUND', 'AVERAGEIF'] },
          { foaie: 1, formula: 'C2:C5', solutie: '=COUNTIFS(Rezultate!$C$2:$C$17,A2,Rezultate!$J$2:$J$17,"?*")', functii: ['COUNTIFS'] }],
        solutie: '<ol><li>B2: <code>=ROUND(AVERAGEIF(Rezultate!$C$2:$C$17,A2,Rezultate!$G$2:$G$17),2)</code>.</li><li>C2: criteriul <code>"?*"</code> înseamnă „cel puțin un caracter” — celulele cu "" nu sunt numărate: <code>=COUNTIFS(Rezultate!$C$2:$C$17,A2,Rezultate!$J$2:$J$17,"?*")</code>.</li></ol>' },
      { nr: 7, puncte: 10, text: 'Evidențiați cu formatare condiționată cele mai mari <b>3 totaluri</b> (coloana G).',
        reguli: [{ cfEfect: { zona: 'G2:G17', conditie: (v, r, c, wb) => typeof v === 'number' && v >= top3(wb) } }],
        solutie: '<ol><li>G2:G17 → Primele 10 elemente → 3. (La total egal pot fi evidențiate mai multe celule.)</li></ol>' },
      { nr: 8, puncte: 10, text: 'Sortați tabelul după <b>Clasa</b> (A → Z), iar în cadrul clasei <b>descrescător după Total</b>.',
        reguli: [{ sortat: 'A1:K17', integritate: 'A1:F17', chei: [{ col: 'Clasa' }, { col: 'Total', desc: true }] }],
        solutie: '<ol><li>Date → Sortare: Clasa A→Z, apoi Total de la mare la mic.</li><li>Formulele cu referințe relative se mută odată cu rândurile.</li></ol>' },
      { nr: 9, puncte: 10, text: 'Creați o <b>copie</b> a foii Rezultate, așezată ultima și redenumită <b>Subtotaluri</b>. Pe copie adăugați <b>subtotaluri</b> la fiecare schimbare de clasă, cu funcția <b>Medie</b>, pentru coloana Total.',
        reguli: [{ foaie: 2, numeFoaie: 'Subtotaluri' }, { foaie: 2, subtotal: { grup: 'Clasa' } }],
        solutie: '<ol><li>Clic dreapta pe eticheta Rezultate → Mutare sau copiere → „(mutare la sfârșit)” + Creare copie; redenumiți copia „Subtotaluri”.</li><li>Tabelul este deja sortat după clasă (cerința 8), deci și copia.</li><li>Pe copie: Date → Subtotal: la fiecare schimbare în Clasa, funcția Medie, adaugă subtotal la Total.</li><li>Lucrând pe copie, foaia Rezultate rămâne neatinsă, iar formulele din Statistici rămân corecte.</li></ol>' }
    ]
  });
})();

/* ------------------------------------------------------------------
   Subiectul 5 — Stația meteo (date generate, fictive)
   ------------------------------------------------------------------ */
(function () {
  // generator determinist, ca datele să fie mereu aceleași
  let s = 20260101;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const date = [['Data', 'Tmin (°C)', 'Tmax (°C)', 'Precipitații (mm)', 'Luna', 'Amplitudine', 'Tip zi']];
  const baza = { 1: [-4, 3], 2: [-3, 5], 3: [1, 11] };
  const pad = (n) => (n < 10 ? '0' : '') + n;
  const zile = { 1: 31, 2: 28, 3: 31 };
  for (let m = 1; m <= 3; m++) for (let d = 1; d <= zile[m]; d++) {
    const tmin = Math.round((baza[m][0] + (rnd() - 0.5) * 10) * 10) / 10;
    const tmax = Math.round((Math.max(tmin + 1.5, baza[m][1] + (rnd() - 0.5) * 8)) * 10) / 10;
    const p = rnd() < 0.3 ? Math.round(rnd() * 120) / 10 : 0;
    date.push([pad(d) + '.' + pad(m) + '.2026', tmin, tmax, p]);
  }
  const N = date.length - 1;   // 90 de zile
  const U = N + 1;             // ultimul rând (91)
  window.SUBIECTE_OLIMPIADA.push({
    id: 5, titlu: 'Stația meteo', dificultate: 3, timp: 90, fisier: 'olimpiada-antrenament-5-meteo.xlsx',
    tipologie: ['MONTH', 'IF imbricat', 'AVERAGEIFS / COUNTIFS / MINIFS', 'INDEX + MATCH + MAX', 'diagramă cu linii, cu titluri de axe', 'scală de culori', 'filtru automat pe două coloane', 'validare'],
    context: 'O stație meteo de lângă Brăila a înregistrat zilnic, în primul trimestru al anului, temperatura minimă, temperatura maximă și precipitațiile (date generate, fictive). Foaia <b>Date</b> are ' + N + ' de rânduri; foaia <b>Statistici</b> se completează de voi.',
    foi: [
      { name: 'Date', rows: U + 3, cols: 9, data: date, bold: 'A1:G1', widths: { A: 92, B: 72, C: 72, D: 118, E: 50, F: 90, G: 70 } },
      { name: 'Statistici', rows: 8, cols: 8, data: [['Luna', 'Media Tmax', 'Zile cu precipitații', 'Tmin minimă', '', 'Indicator', 'Valoare'], [1], [2], [3]], cells: { F2: 'Tmax maximă', F3: 'Data zilei cu Tmax maximă' }, bold: ['A1:D1', 'F1:G1'], widths: { B: 90, C: 130, D: 90, F: 180, G: 100 }, formats: { G3: 'date' } }
    ],
    cerinte: [
      { nr: 1, puncte: 5, text: 'Pe foaia Date, în coloana <b>Luna</b> (E), extrageți numărul lunii.',
        reguli: [{ formula: 'E2:E' + U, solutie: '=MONTH(A2)', functii: ['MONTH'] }], solutie: '<ol><li><code>=MONTH(A2)</code>, copiată până la ultimul rând (dublu-clic pe ghidaj).</li></ol>' },
      { nr: 2, puncte: 5, text: 'În coloana <b>Amplitudine</b> (F) calculați diferența dintre temperatura maximă și cea minimă.',
        reguli: [{ formula: 'F2:F' + U, solutie: '=C2-B2' }], solutie: '<ol><li><code>=C2-B2</code>.</li></ol>' },
      { nr: 3, puncte: 10, text: 'În coloana <b>Tip zi</b> (G): „ger” dacă Tmin ≤ −5; altfel „rece” dacă Tmax &lt; 5; altfel „blândă”.',
        reguli: [{ formula: 'G2:G' + U, solutie: '=IF(B2<=-5,"ger",IF(C2<5,"rece","blândă"))', functii: ['IF'] }],
        solutie: '<ol><li><code>=IF(B2<=-5,"ger",IF(C2<5,"rece","blândă"))</code>.</li></ol>' },
      { nr: 4, puncte: 15, text: 'Pe foaia Statistici, pentru fiecare lună din coloana A: media temperaturii maxime, rotunjită la o zecimală (B); numărul zilelor cu precipitații (C); temperatura minimă cea mai scăzută (D). Câte o formulă pe coloană, copiată.',
        reguli: [
          { foaie: 1, formula: 'B2:B4', solutie: '=ROUND(AVERAGEIFS(Date!$C$2:$C$' + U + ',Date!$E$2:$E$' + U + ',A2),1)', functii: ['ROUND', 'AVERAGEIFS'] },
          { foaie: 1, formula: 'C2:C4', solutie: '=COUNTIFS(Date!$E$2:$E$' + U + ',A2,Date!$D$2:$D$' + U + ',">0")', functii: ['COUNTIFS'] },
          { foaie: 1, formula: 'D2:D4', solutie: '=MINIFS(Date!$B$2:$B$' + U + ',Date!$E$2:$E$' + U + ',A2)', functii: ['MINIFS'] }
        ],
        solutie: '<ol><li>B2: <code>=ROUND(AVERAGEIFS(Date!$C$2:$C$' + U + ',Date!$E$2:$E$' + U + ',A2),1)</code>.</li><li>C2: <code>=COUNTIFS(Date!$E$2:$E$' + U + ',A2,Date!$D$2:$D$' + U + ',">0")</code>.</li><li>D2: <code>=MINIFS(Date!$B$2:$B$' + U + ',Date!$E$2:$E$' + U + ',A2)</code>.</li></ol>' },
      { nr: 5, puncte: 15, text: 'Pe foaia Statistici: în G2 — cea mai mare temperatură maximă din trimestru; în G3 — data la care a fost înregistrată (prima apariție), formatată ca dată.',
        reguli: [{ foaie: 1, formula: 'G2', solutie: '=MAX(Date!C2:C' + U + ')', functii: ['MAX'] }, { foaie: 1, formula: 'G3', solutie: '=INDEX(Date!A2:A' + U + ',MATCH(G2,Date!C2:C' + U + ',0))', functii: ['INDEX', 'MATCH'] }],
        solutie: '<ol><li>G2: <code>=MAX(Date!C2:C' + U + ')</code>.</li><li>G3: <code>=INDEX(Date!A2:A' + U + ',MATCH(G2,Date!C2:C' + U + ',0))</code>, cu formatul Dată.</li></ol>' },
      { nr: 6, puncte: 15, text: 'Inserați o diagramă <b>cu linii</b> care arată evoluția zilnică a temperaturii minime și maxime (zona A1:C' + U + '), cu un titlu care conține cuvântul „temperaturi” și cu titluri pentru ambele axe.',
        reguli: [{ diagrama: { tip: ['linie'], zona: 'A1:C' + U, titlu: 'temperaturi', titluX: true, titluY: true } }],
        solutie: '<ol><li>Selectați A1:C' + U + ' → Inserare → Linie.</li><li>Titlul „Evoluția temperaturilor, trimestrul I”; axa X: „Data”, axa Y: „°C”.</li></ol>' },
      { nr: 7, puncte: 10, text: 'Aplicați o <b>scală de culori</b> pe coloana temperaturii maxime.',
        reguli: [{ cfTip: 'scala', zona: 'C2:C' + U }], solutie: '<ol><li>C2:C' + U + ' → Formatare condiționată → Scale de culori.</li></ol>' },
      { nr: 8, puncte: 15, text: 'Cu <b>filtrul automat</b>, afișați doar zilele de <b>ger</b> din luna <b>februarie</b>.',
        reguli: [{ vizibile: { zona: 'A1:G' + U, conditie: (x) => x['Tip zi'] === 'ger' && x['Luna'] === 2 } }],
        solutie: '<ol><li>Date → Filtru; la Luna bifați doar 2; la Tip zi bifați doar „ger”.</li></ol>' },
      { nr: 9, puncte: 10, text: 'Coloana <b>Precipitații</b> (D2:D' + U + ') trebuie să accepte doar numere zecimale <b>mai mari sau egale cu 0</b>, cu un mesaj de eroare.',
        reguli: [{ validare: { celula: 'D2', accepta: ['0', '3,5'], refuza: ['-1', 'ploaie'], mesajEroare: true } }],
        solutie: '<ol><li>D2:D' + U + ' → Validare → Zecimal → mai mare sau egal cu → 0; completați mesajul de eroare.</li></ol>' }
    ]
  });
})();

/* ------------------------------------------------------------------
   Subiectul 6 — Turneul de șah pe echipe (mai multe foi)
   ------------------------------------------------------------------ */
(function () {
  const echipe = ['Turnurile Brăilei', 'Nebunii Dunării', 'Caii Negri', 'Regina', 'Pionii Isteți', 'Șah-Mat', 'Rocada', 'Gambit'];
  const r1 = [3, 1, 2.5, 1.5, 4, 0, 2, 2], r2 = [2.5, 2, 3, 1, 3.5, 1, 2, 1], r3 = [4, 1.5, 2, 2, 3, 0.5, 3.5, 1.5];
  const runda = (nume, v) => ({ name: nume, rows: 11, cols: 4, data: [['Echipă', 'Puncte']].concat(echipe.map((e, i) => [e, v[i]])), bold: 'A1:B1', widths: { A: 140 } });
  window.SUBIECTE_OLIMPIADA.push({
    id: 6, titlu: 'Turneul de șah pe echipe', dificultate: 3, timp: 60, fisier: 'olimpiada-antrenament-6-sah.xlsx',
    tipologie: ['referințe 3D', 'HLOOKUP aproximativ', 'RANK', 'AVERAGE între foi', 'protecție cu celule deblocate', 'validare zecimală', 'diagramă cu bare', 'setări de imprimare'],
    context: 'Opt echipe au jucat trei runde ale unui turneu de șah. Fiecare rundă este pe o foaie separată (<b>R1</b>, <b>R2</b>, <b>R3</b>), cu echipele în aceeași ordine. Pe foaia <b>Clasament</b> se calculează rezultatele finale; tabelul de bonusuri (I1:L2) acordă puncte suplimentare după totalul obținut.',
    foi: [
      runda('R1', r1), runda('R2', r2), runda('R3', r3),
      { name: 'Clasament', rows: 12, cols: 12, data: [['Echipă', 'Total', 'Bonus', 'Final', 'Loc', 'Medie/rundă', 'Observații']].concat(echipe.map((e) => [e])),
        cells: { I1: 'Prag', J1: 0, K1: 5, L1: 8, I2: 'Bonus', J2: 0, K2: 0.5, L2: 1 }, bold: ['A1:G1', 'I1:I2'], widths: { A: 140, F: 90, G: 110 } }
    ],
    cerinte: [
      { nr: 1, puncte: 15, text: 'Pe foaia Clasament, în coloana <b>Total</b> (B), calculați suma punctelor din cele trei runde, folosind o <b>referință 3D</b> (o singură zonă de foi).',
        reguli: [{ foaie: 3, formula: 'B2:B9', solutie: '=SUM(R1:R3!B2)', functii: ['SUM'], contine: 'R1:R3!' }],
        solutie: '<ol><li><code>=SUM(R1:R3!B2)</code> adună B2 de pe toate foile de la R1 la R3.</li><li>Varianta <code>=R1!B2+R2!B2+R3!B2</code> dă același rezultat, dar nu respectă cerința.</li></ol>' },
      { nr: 2, puncte: 10, text: 'În coloana <b>Bonus</b> (C) aduceți bonusul din tabelul orizontal I1:L2, după total (potrivire aproximativă).',
        reguli: [{ foaie: 3, formula: 'C2:C9', solutie: '=HLOOKUP(B2,$J$1:$L$2,2,TRUE)', functii: ['HLOOKUP'] }],
        solutie: '<ol><li><code>=HLOOKUP(B2,$J$1:$L$2,2,TRUE)</code> — pragurile sunt în primul rând, crescător.</li></ol>' },
      { nr: 3, puncte: 10, text: 'În coloana <b>Final</b> (D) calculați total + bonus, iar în coloana <b>Loc</b> (E) locul fiecărei echipe după punctajul final.',
        reguli: [{ foaie: 3, formula: 'D2:D9', solutie: '=B2+C2' }, { foaie: 3, formula: 'E2:E9', solutie: '=RANK(D2,$D$2:$D$9)', functii: ['RANK'] }],
        solutie: '<ol><li>D2: <code>=B2+C2</code>; E2: <code>=RANK(D2,$D$2:$D$9)</code>.</li></ol>' },
      { nr: 4, puncte: 10, text: 'În coloana <b>Medie/rundă</b> (F) calculați media punctelor pe rundă, cu o referință 3D, rotunjită la 2 zecimale.',
        reguli: [{ foaie: 3, formula: 'F2:F9', solutie: '=ROUND(AVERAGE(R1:R3!B2),2)', functii: ['ROUND', 'AVERAGE'], contine: 'R1:R3!' }],
        solutie: '<ol><li><code>=ROUND(AVERAGE(R1:R3!B2),2)</code>.</li></ol>' },
      { nr: 5, puncte: 15, text: 'Pe foaia Clasament inserați o diagramă <b>cu bare</b> (orizontale sau coloane) pentru totalul echipelor (A1:B9), cu un titlu care conține cuvântul „clasament” și cu etichete de date.',
        reguli: [{ diagrama: { tip: ['bare', 'coloane'], zona: 'A1:B9', titlu: 'clasament', etichete: true } }],
        solutie: '<ol><li>A1:B9 → Inserare → Bare; titlu „Clasamentul turneului”; etichete de date.</li></ol>' },
      { nr: 6, puncte: 10, text: 'Pe foaia R1, coloana Puncte (B2:B9) trebuie să accepte doar numere zecimale <b>între 0 și 4</b> (într-un meci pe 4 table).',
        reguli: [{ foaie: 0, validare: { celula: 'B2', accepta: ['0', '2,5', '4'], refuza: ['4,5', '-1', 'remiză'] } }],
        solutie: '<ol><li>R1!B2:B9 → Validare → Zecimal → între 0 și 4.</li></ol>' },
      { nr: 7, puncte: 15, text: 'La final, protejați foaia Clasament astfel încât să poată fi completată <b>doar</b> coloana Observații (G2:G9).',
        reguli: [{ foaie: 3, deblocate: 'G2:G9' }, { protejata: true, foaie: 3 }],
        solutie: '<ol><li>Selectați G2:G9 → Formatare celule → Protecție → debifați Blocat (în simulator: Revizuire → Deblochează).</li><li>Revizuire → Protejare foaie.</li></ol>' },
      { nr: 8, puncte: 15, manual: true, text: 'Pregătiți foaia Clasament pentru imprimare: orientare Vedere, încadrare pe o singură pagină A4, antet cu textul „Turneul de șah” și subsol cu numărul paginii. (Se verifică în Excel; aici este autoevaluare.)',
        solutie: '<ol><li>Aspect pagină → Orientare → Vedere; Dimensiune A4.</li><li>Scalare → Încadrare foaie pe o pagină.</li><li>Inserare → Antet și subsol: antet „Turneul de șah”, subsol „Pagina &[Pagină]”.</li><li>Verificați în Fișier → Imprimare.</li></ol>' }
    ]
  });
})();
