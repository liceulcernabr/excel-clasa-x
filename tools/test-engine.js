/* =====================================================================
   tools/test-engine.js — Teste automate pentru motorul de formule
   Rulare (PowerShell, din folderul proiectului):   node tools/test-engine.js
   ===================================================================== */
globalThis.window = globalThis;
require('../data/functii.js');
const FE = require('../assets/js/formula-engine.js');
FE.optiuni.azi = FE.dataInSerial(2025, 3, 15);   // „azi” fix pentru teste

const wb = new FE.Workbook({
  sheets: [
    {
      name: 'Catalog',
      data: [
        ['Nume', 'Mate', 'Info', 'Română', 'Clasa', 'Data nașterii'],
        ['Popescu Ana', 9, 10, 8, 'X A', '12.05.2009'],
        ['Ionescu Mihai', 7, 5, 6, 'X B', '03.11.2008'],
        ['Georgescu Ioana', 10, 9, 9, 'X A', '28.02.2009'],
        ['Dumitru Andrei', 4, 6, 5, 'X B', '15.07.2009'],
        ['Stan Elena', 8, 8, 10, 'X A', '01.01.2009']
      ]
    },
    {
      name: 'Preturi',
      data: [['Cod', 'Produs', 'Preț'], ['P01', 'Caiet', 5.5], ['P02', 'Pix', 2], ['P03', 'Rucsac', 120]]
    },
    { name: 'Foaia 3', data: [[100, 200], ['text', '']] }
  ]
});

const teste = [
  // [formulă, rezultat așteptat]
  ['=1+2*3', 7], ['=(1+2)*3', 9], ['=-2^2', 4], ['=2^3^2', 64], ['=10/4', 2.5], ['=50%', 0.5],
  ['=10/0', '#DIV/0!'], ['="a"+1', '#VALUE!'], ['=SUMM(1)', '#NAME?'], ['="Brăila"&" "&2025', 'Brăila 2025'],
  ['=SUM(B2:B6)', 38], ['=SUMĂ(B2:B6)', '#NAME?'], ['=sum(b2:b6)', 38], ['=AVERAGE(B2:D2)', 9], ['=AVERAGE(B2:B6)', 7.6],
  ['=MIN(B2:D6)', 4], ['=MAX(B2:D6)', 10], ['=COUNT(A1:D6)', 15], ['=COUNTA(A1:A6)', 6], ['=COUNTBLANK(A1:A8)', 2],
  ['=ROUND(AVERAGE(B3:D3),2)', 6], ['=ROUND(2.345;2)', 2.35], ['=ROUND(2,345;2)', 2.35], ['=ROUND(-2.5,0)', -3], ['=ROUND(1234,-2)', 1200],
  ['=IF(B2>=5,"Promovat","Corigent")', 'Promovat'], ['=IF(B5>=5;"Promovat";"Corigent")', 'Corigent'],
  ['=IF(AND(B2>=5,C2>=5),"da","nu")', 'da'], ['=IF(OR(B5<5,C5<5),"atenție","ok")', 'atenție'], ['=NOT(TRUE)', false],
  ['=IF(B2>=9,"FB",IF(B2>=7,"B",IF(B2>=5,"S","I")))', 'FB'], ['=IF(B3>=9,"FB",IF(B3>=7,"B",IF(B3>=5,"S","I")))', 'B'],
  ['=COUNTIF(E2:E6,"X A")', 3], ['=COUNTIF(B2:B6,">=8")', 3], ['=COUNTIF(A2:A6,"*escu*")', 3], ['=COUNTIF(A2:A6,"S*")', 1],
  ['=SUMIF(E2:E6,"X B",B2:B6)', 11], ['=AVERAGEIF(E2:E6,"X A",C2:C6)', 9], ['=COUNTIFS(E2:E6,"X A",B2:B6,">8")', 2],
  ['=SUMIFS(C2:C6,E2:E6,"X A",B2:B6,">=9")', 19], ['=AVERAGEIFS(D2:D6,E2:E6,"X B")', 5.5],
  ['=LEFT(A2,7)', 'Popescu'], ['=RIGHT(A2,3)', 'Ana'], ['=MID(A3,9,5)', 'Mihai'], ['=LEN(A2)', 11], ['=UPPER(A6)', 'STAN ELENA'],
  ['=CONCAT(E2," - ",A2)', 'X A - Popescu Ana'], ['=YEAR(F2)', 2009], ['=MONTH(F3)', 11], ['=DATEDIF(F2,TODAY(),"Y")', 15],
  ['=DATEDIF(F2,TODAY(),"M")', 190], ['=DATEDIF("01.01.2024","15.03.2025","D")', 439],
  ['=VLOOKUP("P02",Preturi!A2:C4,3,FALSE)', 2], ['=VLOOKUP("P09",Preturi!A2:C4,3,FALSE)', '#N/A'],
  ['=VLOOKUP("P02",Preturi!A2:C4,4,FALSE)', '#REF!'], ['=VLOOKUP("P03";Preturi!A2:C4;2;FALSE)', 'Rucsac'],
  ['=HLOOKUP("Info",A1:D6,3,FALSE)', 5], ['=XLOOKUP("Rucsac",Preturi!B2:B4,Preturi!C2:C4)', 120],
  ['=XLOOKUP("x",Preturi!B2:B4,Preturi!C2:C4,"negăsit")', 'negăsit'],
  ['=INDEX(A2:D6,MATCH("Stan Elena",A2:A6,0),4)', 10], ['=MATCH(10,B2:B6,0)', 3], ['=INDEX(Preturi!C2:C4,2)', 2],
  ["='Foaia 3'!A1+'Foaia 3'!B1", 300], ["='Foaia 3'!A2*2", '#VALUE!'], ['=Inexistenta!A1', '#REF!'],
  ['=SUMPRODUCT(B2:B6,C2:C6)', 303], ['=SUMPRODUCT((E2:E6="X A")*B2:B6)', 27], ['=RANK(B4,B2:B6)', 1], ['=RANK(B2,B2:B6)', 2],
  ['=LARGE(B2:B6,2)', 9], ['=SMALL(B2:B6,1)', 4], ['=IFERROR(1/0,"eroare")', 'eroare'], ['=SUM(A:A)', 0], ['=SUM(B:B)', 38],
  ['=MAXIFS(B2:B6,E2:E6,"X B")', 7], ['=TEXT(F2,"dd.mm.yyyy")', '12.05.2009'], ['=TEXT(0.256,"0.0%")', '25,6%'],
  ['=PROPER("ana maria")', 'Ana Maria'], ['=TRIM("  mult   spatiu ")', 'mult spatiu'], ['=SQRT(-4)', '#NUM!'],
  ['=MOD(-7,3)', 2], ['=INT(-2.5)', -3], ['=DATE(2025,1,31)+1', FE.dataInSerial(2025, 2, 1)], ['=SUBTOTAL(9,B2:B6)', 38],
  ['=B2+', 'SINTAXA'], ['=SUM(B2:B6', 'SINTAXA'], ['=IF(B2>5,Admis,"Respins")', '#NAME?'], ['=A1:B2', 'Nume'],
  ['=CHOOSE(2,"a","b","c")', 'b'], ['=SUMPRODUCT((YEAR(F2:F6)=2009)*1)', 4], ['=SUMPRODUCT((B2:B6*C2:C6>=70)*1)', 2], ['=SUMPRODUCT(LEN(A2:A6))', 63], ['=IFS(B3>=9,"FB",B3>=7,"B",TRUE,"S")', 'B'], ['=SWITCH(E2,"X A","clasa A","X B","clasa B","?")', 'clasa A'], ['=WEEKDAY("15.03.2025",2)', 6], ['=MEDIAN(B2:B6)', 8], ['=ROUNDUP(2.01,0)', 3],
  ['=TEXTJOIN(", ",TRUE,Preturi!B2:B4)', 'Caiet, Pix, Rucsac'], ['=SUBSTITUTE("X A","X","10")', '10 A'],
  ['=VLOOKUP(7.5,{1},1)', 'SINTAXA']
];

let ok = 0, fail = 0;
for (const [f, asteptat] of teste) {
  let rez;
  const sin = FE.verificaSintaxa(f);
  if (sin) rez = 'SINTAXA';
  else {
    rez = FE.evalueaza(wb, f, 0, 20, 10);
    if (FE.isErr(rez)) rez = rez.code;
  }
  if (FE.egale(rez, asteptat) || rez === asteptat) ok++;
  else { fail++; console.log('✗', f, '→', rez, '  (așteptat:', asteptat + ')', sin ? sin.mesaj : ''); }
}

// Referințe 3D
{
  const w3 = new FE.Workbook({ sheets: [{ name: 'Ian', data: [[1, 2]] }, { name: 'Feb', data: [[10, 20]] }, { name: 'Mar', data: [[100, 200]] }, { name: 'Total' }] });
  const t3 = [['=SUM(Ian:Mar!A1)', 111], ['=SUM(Ian:Mar!A1:B1)', 333], ['=AVERAGE(Ian:Feb!B1)', 11], ['=SUM(Ian:Xyz!A1)', '#REF!']];
  for (const [f, a] of t3) { let v = FE.evalueaza(w3, f, 3, 0, 0); if (FE.isErr(v)) v = v.code; if (FE.egale(v, a) || v === a) ok++; else { fail++; console.log('✗ 3D', f, '→', v); } }
}
// Copierea formulelor cu referințe relative / absolute / mixte
const dep = [
  ['=A1+B1', 1, 0, '=A2+B2'], ['=$A$1+B1', 1, 1, '=$A$1+C2'], ['=A$1*$B2', 2, 2, '=C$1*$B4'],
  ['=SUM(A1:A5)', 0, 1, '=SUM(B1:B5)'], ['=A1', -1, 0, '=#REF!'], ["='Foaia 3'!A1*2", 1, 0, "='Foaia 3'!A2*2"]
];
for (const [f, dr, dc, asteptat] of dep) {
  const r = FE.deplaseaza(f, dr, dc);
  if (r === asteptat) ok++; else { fail++; console.log('✗ deplasare', f, dr, dc, '→', r, '(așteptat', asteptat + ')'); }
}
// Separatorul de argumente (setări regionale) — numele rămân în engleză
const tr = [['=IF(A1>=5,"Admis","Respins")', '=IF(A1>=5;"Admis";"Respins")'], ['=ROUND(AVERAGE(B2:D2),2)', '=ROUND(AVERAGE(B2:D2);2)'], ['=A1*0.19', '=A1*0,19']];
for (const [en, ro] of tr) {
  const a = FE.cuSeparator(en, ';');
  if (a === ro) ok++; else { fail++; console.log('✗ separator', en, '→', a); }
}
// Sugestii pentru nume greșite
const sug = [['SUMĂ', 'SUM'], ['DACA', 'IF'], ['CĂUTAREV', 'VLOOKUP'], ['SUMM', 'SUM'], ['VLOKUP', 'VLOOKUP'], ['AVERGE', 'AVERAGE']];
for (const [n, e] of sug) { const x = FE.sugestieFunctie(n); if (x && x.en === e) ok++; else { fail++; console.log('✗ sugestie', n, '→', x); } }
// Afișare cu formate
const fm = [[1234.5, 'currency', '1.234,50 lei'], [0.256, 'percent:1', '25,6%'], [FE.dataInSerial(2025, 3, 1), 'date', '01.03.2025'], [7.5, 'number:2', '7,50']];
for (const [v, f, a] of fm) {
  const [type, dec] = f.split(':');
  const r = FE.formatValoare(v, { type, dec: dec ? +dec : 2 });
  if (r === a) ok++; else { fail++; console.log('✗ format', v, f, '→', r); }
}
// Referințe circulare
const wc = new FE.Workbook({ sheets: [{ name: 'F', cells: { A1: '=B1+1', B1: '=A1+1' } }] });
wc.getValue(0, 0, 0);
if (wc.circular) ok++; else { fail++; console.log('✗ circular nedetectat'); }

console.log(`\n${ok} teste trecute, ${fail} eșuate.`);
process.exit(fail ? 1 : 0);
