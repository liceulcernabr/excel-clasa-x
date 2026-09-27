/* =====================================================================
   data/lectii/ora-15.js — ORA 15: Recapitulare și proiect final evaluat
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const CUPA_15 = [
  ['Nume', 'Clasa', 'Gen', 'Probă', 'Punctaj', 'Medalie'],
  ['Andrei Maria', '10A', 'F', 'Șah', 88], ['Barbu Ștefan', '10B', 'M', 'Baschet', 73], ['Constantin Ioana', '10A', 'F', 'Atletism', 97],
  ['Dobre Alexandru', '10C', 'M', 'Șah', 61], ['Enache Daria', '10B', 'F', 'Atletism', 84], ['Florea Matei', '10A', 'M', 'Baschet', 92],
  ['Gheorghe Ana', '10C', 'F', 'Șah', 79], ['Ionescu Radu', '10B', 'M', 'Atletism', 58], ['Marin Elena', '10C', 'F', 'Baschet', 95],
  ['Nistor Vlad', '10A', 'M', 'Atletism', 86], ['Popa Bianca', '10B', 'F', 'Șah', 70], ['Stoica Andrei', '10C', 'M', 'Baschet', 83]
];
function foaie15(extra) {
  const c = { H1: 'Prag', I1: 'Medalie', H2: 0, I2: '—', H3: 70, I3: 'Bronz', H4: 85, I4: 'Argint', H5: 95, I5: 'Aur' };
  const rest = Object.assign({}, extra || {});
  delete rest.cells;
  return Object.assign({ name: 'Cupa', rows: 18, cols: 12, data: CUPA_15, cells: Object.assign(c, (extra && extra.cells) || {}), bold: ['A1:F1', 'H1:I1'], fill: ['A1:F1', 'H1:I1'],
    widths: { A: 124, B: 50, C: 40, D: 76, E: 64, F: 70, G: 20, H: 50, I: 70, J: 20, K: 100, L: 70 } }, rest);
}

window.DATE_LECTII[15] = {
  nr: 15,
  titlu: 'Recapitulare și proiect final',
  durata: 50,
  rezumat: 'Pui cap la cap tot ce ai învățat: date bine organizate, formule și funcții, sortări și filtre, formatare condiționată, validare, diagrame și pivot. Recapitulezi prin exerciții mixte, apoi realizezi proiectul final evaluat.',

  obiective: [
    'să alegi instrumentul potrivit pentru fiecare cerință (formulă, funcție, filtru, pivot, diagramă);',
    'să combini funcții: [[fn:IF]] cu [[fn:VLOOKUP]], [[fn:ROUND]] cu [[fn:AVERAGEIF]];',
    'să construiești un registru complet, pe mai multe foi, bine formatat și protejat;',
    'să îți verifici singur lucrarea după baremul proiectului.'
  ],

  teorie: [
    {
      titlu: 'Harta celor 15 ore',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Ore</th><th>Ce știi să faci</th><th>Cuvinte-cheie</th></tr>
          <tr><td>1–3</td><td>organizezi datele, le formatezi, completezi serii</td><td>registru, foaie, zonă, format numeric, ghidaj de umplere</td></tr>
          <tr><td>4</td><td>scrii formule care rămân corecte la copiere</td><td>ordinea operațiilor, A1 / $A$1 / $A1, F4</td></tr>
          <tr><td>5</td><td>calculezi totaluri și medii</td><td>[[fn:SUM]] [[fn:AVERAGE]] [[fn:MIN]] [[fn:MAX]] [[fn:COUNT]] [[fn:COUNTA]] [[fn:ROUND]]</td></tr>
          <tr><td>6</td><td>iei decizii</td><td>[[fn:IF]] [[fn:AND]] [[fn:OR]] [[fn:NOT]] [[fn:IFERROR]]</td></tr>
          <tr><td>7</td><td>calculezi pe grupe</td><td>[[fn:COUNTIFS]] [[fn:SUMIFS]] [[fn:AVERAGEIFS]]</td></tr>
          <tr><td>8</td><td>prelucrezi texte și date</td><td>[[fn:LEFT]] [[fn:MID]] [[fn:LEN]] &amp; [[fn:DATEDIF]] [[fn:TODAY]]</td></tr>
          <tr><td>9</td><td>aduci date din alte tabele</td><td>[[fn:VLOOKUP]] [[fn:XLOOKUP]] [[fn:INDEX]] [[fn:MATCH]]</td></tr>
          <tr><td>10</td><td>ordonezi și filtrezi</td><td>sortare pe niveluri, filtru automat și avansat, [[fn:SUBTOTAL]]</td></tr>
          <tr><td>11</td><td>evidențiezi și previi greșelile</td><td>formatare condiționată cu formulă, validare, liste</td></tr>
          <tr><td>12–13</td><td>rezumi și prezinți</td><td>diagrame, tabele pivot, subtotaluri</td></tr>
          <tr><td>14</td><td>lucrezi pe mai multe foi și predai lucrarea</td><td>Foaie!A1, protecție, setări de imprimare</td></tr>
        </table></div>`
    },
    {
      titlu: 'Cum abordezi o problemă în Excel',
      html: `
        <ol>
          <li><b>Citește cerința de două ori.</b> Subliniază <i>unde</i> se scrie rezultatul și <i>ce</i> trebuie să conțină.</li>
          <li><b>Rezolvă prima celulă</b>, verifică rezultatul de mână, apoi copiază formula. Gândește-te unde e nevoie de <b>$</b>.</li>
          <li><b>Nu scrie numere calculate de tine</b> în locul formulelor. Evaluatorul verifică formula din bara de formule.</li>
          <li><b>Testează cazurile limită:</b> nota exact 5, celula goală, textul cu spații.</li>
          <li><b>Salvează des</b> ([[k:Ctrl+S]]), cu numele cerut.</li>
        </ol>
        <div class="sfat"><strong>Combinații frecvente</strong>[[=IF(COUNTIF(B:B,A2)>0,"există","nu")]] · [[=IFERROR(VLOOKUP(A2,$H$2:$I$5,2,FALSE),"—")]] · [[=ROUND(AVERAGEIF(B2:B30,"10A",E2:E30),2)]] · [[=IF(AND(E2>=85,C2="F"),"Da","")]]</div>`
    },
    {
      titlu: 'Proiectul final — ce se cere',
      html: `
        <p>Realizezi individual un registru Excel despre <b>o competiție sau o activitate a clasei</b>: Cupa liceului, excursia clasei sau un magazin de produse școlare.
        Cerințele exacte și baremul sunt în <b>fișa de lucru</b> a acestei ore (varianta de printat și fișierul de pornire).</p>
        <ul>
          <li>minimum 3 foi: date, calcule, rapoarte;</li>
          <li>minimum 20 de rânduri de date, cu validare pe cel puțin două coloane;</li>
          <li>formule cu referințe absolute și între foi, cel puțin 6 funcții diferite (inclusiv o căutare și o funcție condiționată);</li>
          <li>o sortare pe două niveluri, un filtru, o formatare condiționată cu formulă;</li>
          <li>o diagramă cu titlu și titluri de axe și un tabel pivot;</li>
          <li>foaia de raport protejată și pregătită pentru imprimare pe o pagină A4.</li>
        </ul>
        <p>Predai fișierul cu numele <b>Clasa_Nume_Prenume_Proiect.xlsx</b>, în modul stabilit de profesor.</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: Cupa liceului',
    text: `<p>Recapitulează pe datele Cupei liceului. Folosește tot ce ai învățat:</p>
      <ul>
        <li>medalia după punctaj, cu VLOOKUP aproximativ pe tabelul H1:I5;</li>
        <li>câte medalii de aur, media pe clase (COUNTIF, AVERAGEIF);</li>
        <li>sortare după Probă și Punctaj, formatare condiționată, o diagramă, un pivot.</li>
      </ul>`,
    inaltime: 380,
    foi: [foaie15()]
  },

  animatii: [],

  exercitii: [
    {
      id: 'o15-medalie', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Medalia (VLOOKUP aproximativ)',
      cerinta: 'În <b>F2:F13</b> afișează medalia după punctaj, folosind tabelul de praguri H2:I5 și potrivirea aproximativă.',
      foi: [foaie15()],
      reguli: [{ formula: 'F2:F13', solutie: '=VLOOKUP(E2,$H$2:$I$5,2,TRUE)', functii: ['VLOOKUP'] }],
      indicii: ['Pragurile sunt sortate crescător, deci potrivirea aproximativă funcționează.', '=VLOOKUP(E2,$H$2:$I$5,2,TRUE)']
    },
    {
      id: 'o15-statistici', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Statistici rapide',
      cerinta: 'În <b>L2</b> numără câți participanți au cel puțin 85 de puncte. În <b>L3</b> calculează media punctajelor fetelor, rotunjită la o zecimală. În <b>L4</b> afișează punctajul maxim de la proba Șah.',
      foi: [foaie15({ cells: { K2: '≥ 85 puncte:', K3: 'Media fetelor:', K4: 'Max. la Șah:' } })],
      reguli: [
        { formula: 'L2', solutie: '=COUNTIF(E2:E13,">=85")', functii: ['COUNTIF'] },
        { formula: 'L3', solutie: '=ROUND(AVERAGEIF(C2:C13,"F",E2:E13),1)', functii: ['ROUND', 'AVERAGEIF'] },
        { formula: 'L4', solutie: '=MAXIFS(E2:E13,D2:D13,"Șah")', functii: ['MAXIFS'] }
      ],
      indicii: ['L2: COUNTIF cu criteriul ">=85".', 'L3: ROUND(AVERAGEIF(…),1).', 'L4: MAXIFS(zona punctajelor, zona probelor, "Șah").']
    },
    {
      id: 'o15-finalist', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Calificarea în finală',
      cerinta: 'Un elev se califică în finală („Finalist”) dacă are cel puțin 80 de puncte <u>și</u> este din 10A sau 10B. Altfel celula rămâne goală. Completează <b>F2:F13</b>.',
      foi: [foaie15({ data: CUPA_15.map((r, i) => (i === 0 ? r.slice(0, 5).concat(['Finală']) : r)) })],
      reguli: [{ formula: 'F2:F13', solutie: '=IF(AND(E2>=80,OR(B2="10A",B2="10B")),"Finalist","")', functii: ['IF', 'AND', 'OR'] }],
      indicii: ['Condiția are o parte cu ȘI și una cu SAU: AND(…, OR(…)).', '=IF(AND(E2>=80,OR(B2="10A",B2="10B")),"Finalist","")']
    },
    {
      id: 'o15-ordonare-cf', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Clasamentul pe probe',
      cerinta: 'Sortează tabelul după <b>Probă</b> (A → Z), apoi după <b>Punctaj</b> descrescător. Apoi evidențiază cu formatare condiționată punctajele de <b>cel puțin 90</b> din E2:E13.',
      foi: [foaie15()], meniuri: ['date', 'conditionat'], selecteaza: 'D2',
      reguli: [
        { sortat: 'A1:E13', chei: [{ col: 'Probă', desc: false }, { col: 'Punctaj', desc: true }] },
        { cfEfect: { zona: 'E2:E13', conditie: (v) => typeof v === 'number' && v >= 90 } }
      ],
      indicii: ['Date ▾ → Sortare personalizată: Probă A → Z, apoi Punctaj Z → A.', 'Selectează E2:E13 → Formatare condiționată ▾ → Regulă nouă. „Mai mare decât 89” sau o formulă =E2>=90.']
    },
    {
      id: 'o15-diagrama', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Punctajul mediu pe clase',
      cerinta: 'Tabelul K1:L4 conține media punctajelor pe clase (deja calculată). Inserează o diagramă cu <b>coloane</b> pentru această zonă, cu un titlu care conține cuvântul <b>clase</b>.',
      foi: [foaie15({ cells: { K1: 'Clasa', L1: 'Media', K2: '10A', K3: '10B', K4: '10C', L2: '=AVERAGEIF($B$2:$B$13,K2,$E$2:$E$13)', L3: '=AVERAGEIF($B$2:$B$13,K3,$E$2:$E$13)', L4: '=AVERAGEIF($B$2:$B$13,K4,$E$2:$E$13)' } })],
      meniuri: ['inserare'], selecteaza: 'K1',
      reguli: [{ diagrama: { tip: ['coloane', 'bare'], zona: 'K1:L4', titlu: 'clase' } }],
      indicii: ['Inserare ▾ → Diagramă…, zona K1:L4.']
    },
    {
      id: 'o15-rez', tip: 'rezultat', nivel: 'mediu', puncte: 10,
      titlu: 'O formulă combinată',
      cerinta: 'Ce afișează formula?',
      foi: [foaie15()], formula: '=IF(COUNTIFS(B2:B13,"10C",E2:E13,">=90")>0,"10C are un punctaj de top","nu")', inaltime: 220,
      variante: ['10C are un punctaj de top', 'nu', '1', '#VALUE!'],
      indicii: ['Există vreun elev din 10C cu cel puțin 90 de puncte?'],
      explicatie: 'Marin Elena (10C) are 95, deci COUNTIFS dă 1 și condiția este adevărată.'
    },
    {
      id: 'o15-greseala', tip: 'greseala', nivel: 'mediu', puncte: 10,
      titlu: 'Media calculată de două ori',
      cerinta: 'Formula ar trebui să dea media punctajelor, dar rezultatul este foarte mic. Apasă pe bucățile care nu trebuiau scrise.',
      formula: '=AVERAGE(E2:E13)/COUNT(E2:E13)', jetoane: ['=AVERAGE(E2:E13)', '/', 'COUNT(E2:E13)'], gresit: ['/', 'COUNT(E2:E13)'], corect: '=AVERAGE(E2:E13)',
      indicii: ['AVERAGE face deja și suma, și împărțirea.'],
      explicatie: 'AVERAGE întoarce direct media; împărțirea încă o dată la numărul de valori e o greșeală.'
    },
    {
      id: 'o15-instrument', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Instrumentul potrivit',
      cerinta: 'Potrivește cerința cu instrumentul cel mai potrivit.',
      perechi: [['totalul punctelor pe fiecare probă, fără formule', 'tabel pivot'], ['doar elevii din 10B, temporar', 'filtru automat'], ['prețul adus din catalog după cod', 'VLOOKUP / XLOOKUP'], ['punctajele sub 60 colorate cu roșu', 'formatare condiționată'], ['în coloana Clasa doar 10A, 10B, 10C', 'validare cu listă'], ['evoluția punctajului pe etape', 'diagramă cu linie']],
      indicii: ['„Fără formule” și „pe fiecare” sugerează pivotul.']
    },
    {
      id: 'o15-proiect', tip: 'ordonare', nivel: 'baza', puncte: 5,
      titlu: 'Etapele proiectului',
      cerinta: 'Ordonează etapele de lucru la proiectul final.',
      pasi: ['Alegi tema și planifici foile registrului.', 'Introduci datele și pui validări pe coloanele importante.', 'Scrii formulele și funcțiile de calcul.', 'Sortezi, filtrezi și aplici formatarea condiționată.', 'Creezi diagrama și tabelul pivot.', 'Protejezi foaia de raport, setezi imprimarea și salvezi cu numele cerut.'],
      indicii: ['Datele vin înaintea calculelor, iar protecția la final.']
    }
  ],

  fisa: {
    titlu: 'Proiect final — Cupa liceului „Panait Cerna”',
    timp: 100,
    fisier: 'proiect-final-cupa-liceului.xlsx',
    context: 'Proiect individual, evaluat cu notă. Organizezi rezultatele Cupei liceului într-un registru complet. Fișierul de pornire conține participanții și un tabel de praguri. Poți adăuga participanți (minimum 20 în total). Predai fișierul <b>Clasa_Nume_Prenume_Proiect.xlsx</b>.',
    foi: [
      { name: 'Participanți', data: CUPA_15.map((r) => r.slice(0, 5)).concat([['Albu Cezar', '10C', 'M', 'Atletism', 76], ['Bratu Denisa', '10A', 'F', 'Șah', 91], ['Cazacu Tudor', '10B', 'M', 'Baschet', 67], ['Dinu Alexia', '10C', 'F', 'Atletism', 89], ['Ene Mihnea', '10A', 'M', 'Șah', 74], ['Frunză Ilinca', '10B', 'F', 'Baschet', 81], ['Grigore Paul', '10C', 'M', 'Șah', 94], ['Hanganu Sara', '10A', 'F', 'Baschet', 63]]), widths: { A: 130 } },
      { name: 'Praguri', data: [['Prag', 'Medalie'], [0, '—'], [70, 'Bronz'], [85, 'Argint'], [95, 'Aur']] }
    ],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: '<b>Organizare:</b> foile „Participanți”, „Praguri”, „Calcule”, „Raport” (redenumite și colorate). Titlu formatat pe fiecare foaie; antete aldin cu umplere; chenare; formate numerice potrivite.', barem: '0,5p structura foilor; 0,5p formatare corectă.' },
      { nivel: 'baza', puncte: 1, text: '<b>Validare:</b> pe foaia Participanți, Clasa se alege dintr-o listă (10A, 10B, 10C), Gen dintr-o listă (F, M), iar Punctajul este un număr întreg între 0 și 100, cu mesaj de eroare.', barem: '0,25p fiecare listă; 0,5p validarea punctajului cu mesaj.' },
      { nivel: 'mediu', puncte: 1.5, text: '<b>Formule:</b> medalia fiecărui participant, cu VLOOKUP aproximativ spre foaia Praguri (referință între foi, tabel cu $); o coloană „Finalist” (≥ 80 puncte și clasa 10A sau 10B).', barem: '0,75p medalia; 0,75p finalist (IF + AND + OR).' },
      { nivel: 'mediu', puncte: 1.5, text: '<b>Calcule</b> (foaia Calcule): pentru fiecare clasă — număr de participanți, media punctajelor (2 zecimale), număr de medalii de aur; pentru fiecare probă — punctajul maxim. Folosește câte o formulă copiată pe coloană.', barem: '0,5p COUNTIF; 0,5p ROUND(AVERAGEIF); 0,25p COUNTIFS; 0,25p MAXIFS.' },
      { nivel: 'mediu', puncte: 1, text: '<b>Sortare și filtre:</b> pe o copie a foii Participanți sortează după Probă, apoi după Punctaj descrescător; aplică un filtru automat care arată doar medaliații cu Aur sau Argint.', barem: '0,5p sortare pe două niveluri; 0,5p filtru.' },
      { nivel: 'mediu', puncte: 1, text: '<b>Formatare condiționată</b> cu formulă: rândul întreg al finaliștilor colorat cu verde; punctajele sub 60 cu roșu; bare de date pe punctaj.', barem: '0,5p regula cu formulă ($); 0,25p roșu; 0,25p bare.' },
      { nivel: 'avansat', puncte: 1, text: '<b>Raport:</b> tabel pivot (probe pe rânduri, clase pe coloane, media punctajului) și o diagramă cu coloane pentru media pe clase, cu titlu, titluri de axe și etichete de date.', barem: '0,5p pivot; 0,5p diagramă completă.' },
      { nivel: 'avansat', puncte: 1, text: '<b>Finalizare:</b> foaia Raport protejată (fără celule deblocate), orientare Vedere, încadrată pe o pagină A4, cu antet (numele școlii) și subsol (numele elevului, data). Fișier salvat cu numele cerut.', barem: '0,25p protecție; 0,5p imprimare; 0,25p nume fișier.' }
    ]
  }
};
