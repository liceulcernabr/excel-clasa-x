/* =====================================================================
   data/olimpiada/sprint.js — Provocările pentru „Sprintul de formule”
   Fiecare provocare: un tabel mic, o celulă-țintă și formula-soluție.
   Nivel: 1 = ușor, 2 = mediu, 3 = greu.
   Verificarea este cea de la exerciții: rezultatul trebuie să fie corect
   și să rămână corect când datele se schimbă (fără valori scrise de mână).
   ===================================================================== */
(function () {
  const NOTE = { name: 'Note', rows: 7, cols: 7, data: [['Elev', 'Mate', 'Info', 'Fizică', 'Rezultat'], ['Ana', 9, 10, 8], ['Mihai', 6, 7, 5], ['Ioana', 10, 9, 10], ['Radu', 4, 6, 5], ['Sara', 8, 8, 9]], bold: 'A1:E1' };
  const MAG = { name: 'Magazin', rows: 8, cols: 7, data: [['Produs', 'Categorie', 'Cantitate', 'Preț', 'Rezultat'], ['Caiet', 'Papetărie', 10, 5.5], ['Pix', 'Papetărie', 25, 2.5], ['Mouse', 'IT', 3, 45], ['Stick', 'IT', 4, 39], ['Rucsac', 'Accesorii', 2, 149], ['Penar', 'Accesorii', 5, 25]], bold: 'A1:E1' };
  const ELEVI = { name: 'Elevi', rows: 7, cols: 7, data: [['Nume', 'Prenume', 'Clasa', 'Data nașterii', 'Rezultat'], ['Popescu', 'Ana', '10A', '14.03.2010'], ['Ionescu', 'Mihai', '10B', '05.11.2009'], ['Stan', 'Elena', '10A', '01.01.2010'], ['Radu', 'Victor', '10C', '20.09.2009'], ['Dinu', 'Paul', '10B', '12.08.2010']], bold: 'A1:E1', cells: { G1: 'Data de referință', G2: '15.09.2025' } };
  const CAT = { name: 'Catalog', rows: 8, cols: 8, data: [['Cod', 'Produs', 'Preț', '', 'Caut cod', 'Rezultat'], ['P01', 'Caiet', 5.5, '', 'P03'], ['P02', 'Pix', 2.5], ['P03', 'Rucsac', 149], ['P04', 'Penar', 25], ['P05', 'Mouse', 45]], bold: ['A1:C1', 'E1:F1'] };
  const P = (id, nivel, enunt, foaie, tinta, solutie, functii) => ({ id, nivel, enunt, foi: [foaie], tinta, solutie, functii });

  window.SPRINT_OLIMPIADA = [
    P('s01', 1, 'În <b>E2</b>: suma notelor Anei.', NOTE, 'E2', '=SUM(B2:D2)'),
    P('s02', 1, 'În <b>E2</b>: media notelor Anei.', NOTE, 'E2', '=AVERAGE(B2:D2)', ['AVERAGE']),
    P('s03', 1, 'În <b>E2</b>: cea mai mare notă la Mate (B2:B6).', NOTE, 'E2', '=MAX(B2:B6)', ['MAX']),
    P('s04', 1, 'În <b>E2</b>: cea mai mică notă din tot tabelul (B2:D6).', NOTE, 'E2', '=MIN(B2:D6)', ['MIN']),
    P('s05', 1, 'În <b>E2</b>: câte note de 10 sunt în tabel.', NOTE, 'E2', '=COUNTIF(B2:D6,10)', ['COUNTIF']),
    P('s06', 1, 'În <b>E2</b>: valoarea produsului de pe rândul 2 (cantitate × preț).', MAG, 'E2', '=C2*D2'),
    P('s07', 1, 'În <b>E2</b>: numele complet (Nume Prenume) al primului elev.', ELEVI, 'E2', '=A2&" "&B2'),
    P('s08', 1, 'În <b>E2</b>: anul nașterii primului elev.', ELEVI, 'E2', '=YEAR(D2)', ['YEAR']),
    P('s09', 1, 'În <b>E2</b>: „Admis” dacă nota Anei la Mate este cel puțin 5, altfel „Respins”.', NOTE, 'E2', '=IF(B2>=5,"Admis","Respins")', ['IF']),
    P('s10', 1, 'În <b>E2</b>: numărul de produse din listă (numără denumirile).', MAG, 'E2', '=COUNTA(A2:A7)', ['COUNTA']),
    P('s11', 2, 'În <b>E2</b>: media Anei, rotunjită la 2 zecimale.', NOTE, 'E2', '=ROUND(AVERAGE(B2:D2),2)', ['ROUND', 'AVERAGE']),
    P('s12', 2, 'În <b>E2</b>: cantitatea totală vândută la categoria IT.', MAG, 'E2', '=SUMIF(B2:B7,"IT",C2:C7)', ['SUMIF']),
    P('s13', 2, 'În <b>E2</b>: câte produse Papetărie au prețul sub 5 lei.', MAG, 'E2', '=COUNTIFS(B2:B7,"Papetărie",D2:D7,"<5")', ['COUNTIFS']),
    P('s14', 2, 'În <b>E2</b>: prețul mediu al produselor din categoria Accesorii.', MAG, 'E2', '=AVERAGEIF(B2:B7,"Accesorii",D2:D7)', ['AVERAGEIF']),
    P('s15', 2, 'În <b>F2</b>: prețul produsului cu codul din E2 (VLOOKUP exact).', CAT, 'F2', '=VLOOKUP(E2,A2:C6,3,FALSE)', ['VLOOKUP']),
    P('s16', 2, 'În <b>F2</b>: denumirea produsului cu codul din E2, cu INDEX și MATCH.', CAT, 'F2', '=INDEX(B2:B6,MATCH(E2,A2:A6,0))', ['INDEX', 'MATCH']),
    P('s17', 2, 'În <b>E2</b>: inițialele primului elev (prima literă a prenumelui și a numelui), de ex. AP.', ELEVI, 'E2', '=LEFT(B2,1)&LEFT(A2,1)', ['LEFT']),
    P('s18', 2, 'În <b>E2</b>: vârsta primului elev în ani împliniți la data din G2.', ELEVI, 'E2', '=DATEDIF(D2,G2,"Y")', ['DATEDIF']),
    P('s19', 2, 'În <b>E2</b>: „Bursă” dacă Ana are cel puțin 9 atât la Mate, cât și la Info; altfel „—”.', NOTE, 'E2', '=IF(AND(B2>=9,C2>=9),"Bursă","—")', ['IF', 'AND']),
    P('s20', 2, 'În <b>E2</b>: câți elevi sunt în clasa 10A.', ELEVI, 'E2', '=COUNTIF(C2:C6,"10A")', ['COUNTIF']),
    P('s21', 3, 'În <b>E2</b>: valoarea totală a stocului (suma produselor cantitate × preț), cu o singură funcție.', MAG, 'E2', '=SUMPRODUCT(C2:C7,D2:D7)', ['SUMPRODUCT']),
    P('s22', 3, 'În <b>E2</b>: calificativul Anei după media notelor: FB (≥ 9), B (≥ 7), S (≥ 5), altfel I.', NOTE, 'E2', '=IF(AVERAGE(B2:D2)>=9,"FB",IF(AVERAGE(B2:D2)>=7,"B",IF(AVERAGE(B2:D2)>=5,"S","I")))', ['IF', 'AVERAGE']),
    P('s23', 3, 'În <b>E2</b>: numele elevului cu cea mai mare notă la Info.', NOTE, 'E2', '=INDEX(A2:A6,MATCH(MAX(C2:C6),C2:C6,0))', ['INDEX', 'MATCH', 'MAX']),
    P('s24', 3, 'În <b>E2</b>: locul Anei în clasamentul notelor la Mate (cea mai mare = locul 1).', NOTE, 'E2', '=RANK(B2,B2:B6)', ['RANK']),
    P('s25', 3, 'În <b>F2</b>: prețul produsului cu codul din E2 sau textul „inexistent” dacă nu există.', CAT, 'F2', '=IFERROR(VLOOKUP(E2,A2:C6,3,FALSE),"inexistent")', ['IFERROR']),
    P('s26', 3, 'În <b>E2</b>: adresa de e-mail a primului elev: prenume.nume@cerna.ro, cu litere mici.', ELEVI, 'E2', '=LOWER(B2&"."&A2&"@cerna.ro")', ['LOWER']),
    P('s27', 3, 'În <b>E2</b>: câte produse au valoarea (cantitate × preț) de cel puțin 100 de lei — fără coloane auxiliare.', MAG, 'E2', '=SUMPRODUCT((C2:C7*D2:D7>=100)*1)', ['SUMPRODUCT']),
    P('s28', 3, 'În <b>E2</b>: media notelor la Fizică ale elevilor care au cel puțin 8 la Mate.', NOTE, 'E2', '=AVERAGEIF(B2:B6,">=8",D2:D6)', ['AVERAGEIF']),
    P('s29', 3, 'În <b>E2</b>: diferența, în zile, dintre data de referință (G2) și data nașterii primului elev.', ELEVI, 'E2', '=G2-D2'),
    P('s30', 3, 'În <b>E2</b>: câți elevi s-au născut în anul 2010 (fără coloane auxiliare).', ELEVI, 'E2', '=SUMPRODUCT((YEAR(D2:D6)=2010)*1)', ['SUMPRODUCT'])
  ];
})();
