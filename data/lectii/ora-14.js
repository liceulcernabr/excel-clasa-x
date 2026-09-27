/* =====================================================================
   data/lectii/ora-14.js — ORA 14: Lucrul cu mai multe foi, referințe
   între foi, protecție, setări de imprimare
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const ELEVI_14 = ['Andrei Maria', 'Barbu Ștefan', 'Constantin Ioana', 'Dobre Alexandru', 'Enache Daria', 'Florea Matei', 'Gheorghe Ana', 'Ionescu Radu'];
const SEM1_14 = [9.4, 7.6, 9.8, 5.9, 8.5, 8.1, 9.1, 6.2];
const SEM2_14 = [9.6, 8.0, 9.9, 6.5, 8.7, 7.9, 9.3, 6.8];
function registru14(numeSem2, extraAnual) {
  return [
    { name: 'Sem1', rows: 11, cols: 4, data: [['Elev', 'Media']].concat(ELEVI_14.map((e, i) => [e, SEM1_14[i]])), bold: 'A1:B1', widths: { A: 130 } },
    { name: numeSem2 || 'Sem2', rows: 11, cols: 4, data: [['Elev', 'Media']].concat(ELEVI_14.map((e, i) => [e, SEM2_14[i]])), bold: 'A1:B1', widths: { A: 130 } },
    Object.assign({ name: 'Anual', rows: 12, cols: 5, data: [['Elev', 'Media anuală', 'Situația']].concat(ELEVI_14.map((e) => [e])), bold: 'A1:C1', widths: { A: 130, B: 100, C: 90 } }, extraAnual || {})
  ];
}

window.DATE_LECTII[14] = {
  nr: 14,
  titlu: 'Mai multe foi, protecție, imprimare',
  durata: 50,
  rezumat: 'Un registru adevărat are mai multe foi: semestrul I, semestrul II și situația anuală. Înveți să faci calcule între foi, să protejezi ce nu trebuie modificat și să pregătești tabelul pentru o imprimare curată.',

  obiective: [
    'să organizezi un registru cu mai multe foi (inserare, redenumire, mutare, copiere, grupare);',
    'să scrii referințe către alte foi: <code>Sem1!B2</code>, <code>\'Note sem 2\'!B2</code>;',
    'să cunoști referințele 3D: <code>=SUM(Ian:Mar!B2)</code>;',
    'să protejezi o foaie și să lași deblocate doar celulele care se completează;',
    'să configurezi imprimarea: orientare, margini, încadrare, zonă de imprimare, titluri repetate, antet și subsol.'
  ],

  teorie: [
    {
      titlu: 'Referințe către alte foi',
      html: `
        <p>Scrii numele foii, semnul exclamării și adresa: <code>Sem1!B2</code>. Dacă numele foii conține spații sau diacritice, îl pui între apostrofuri: <code>'Note sem 2'!B2</code>.</p>
        <p class="f f-bloc" data-f="=AVERAGE(Sem1!B2,Sem2!B2)"></p>
        <p>Cel mai simplu: scrii <code>=</code>, faci clic pe eticheta celeilalte foi, apoi pe celulă. Excel scrie singur referința, iar simulatorul face la fel.</p>
        <p>Când <b>redenumești</b> o foaie, formulele care o folosesc se actualizează automat. Când o <b>ștergi</b>, formulele dau #REF!.</p>
        <div class="nota"><strong>Referințe 3D</strong>Dacă ai foile Ian, Feb, Mar cu aceeași structură, [[=SUM(Ian:Mar!B2)]] adună celula B2 de pe toate foile dintre Ian și Mar. Funcționează și în simulator.</div>`
    },
    {
      titlu: 'Organizarea foilor',
      html: `
        <ul>
          <li><b>Inserare</b>: butonul + sau [[k:Shift+F11]]. <b>Redenumire</b>: dublu-clic pe etichetă.</li>
          <li><b>Mutare / copiere</b>: tragi eticheta. Cu [[k:Ctrl]] apăsat faci o copie. Sau clic dreapta → <i>Mutare sau copiere</i>, chiar și în alt registru.</li>
          <li><b>Culoarea etichetei</b>, <b>ascunderea</b> unei foi: clic dreapta pe etichetă.</li>
          <li><b>Gruparea</b>: selectezi mai multe etichete cu [[k:Ctrl]] (sau [[k:Shift]]). Ce scrii apare pe toate foile grupate. Atenție să le degrupezi după aceea!</li>
        </ul>`
    },
    {
      titlu: 'Protecția',
      html: `
        <p>Implicit, <b>toate celulele sunt blocate</b>, dar blocarea are efect abia după ce protejezi foaia. Pașii:</p>
        <ol>
          <li>selectezi celulele care vor putea fi completate → [[k:Ctrl+1]] → fila <i>Protecție</i> → debifezi <b>Blocat</b>;</li>
          <li><i>Revizuire → Protejare foaie</i> (<i>Review → Protect Sheet</i>), opțional cu parolă.</li>
        </ol>
        <table class="tabel">
          <tr><th>Protecție</th><th>Împiedică</th></tr>
          <tr><td>Protejare foaie</td><td>modificarea celulelor blocate (și, opțional, formatarea, sortarea…)</td></tr>
          <tr><td>Protejare registru</td><td>adăugarea, ștergerea, redenumirea foilor (structura)</td></tr>
          <tr><td>Criptare cu parolă (Fișier → Informații)</td><td>deschiderea fișierului fără parolă</td></tr>
        </table>
        <div class="atentie"><strong>Nu este o protecție absolută</strong>Protejarea foii previne greșelile, dar nu ține departe pe cineva hotărât. Pentru date importante folosești criptarea fișierului cu o parolă puternică.</div>
        <p>În simulator: <b>Revizuire ▾</b> → <i>Deblochează celulele selectate</i>, apoi <i>Protejează foaia</i>.</p>`
    },
    {
      titlu: 'Setările de imprimare',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Setare</th><th>Unde</th><th>La ce folosește</th></tr>
          <tr><td>Orientare Portret / Vedere</td><td>Aspect pagină</td><td>tabelele late încap mai bine pe orizontală (Vedere)</td></tr>
          <tr><td>Margini, Dimensiune (A4)</td><td>Aspect pagină</td><td>spațiul alb din jur, formatul hârtiei</td></tr>
          <tr><td>Zonă de imprimare</td><td>Aspect pagină → Zonă imprimare</td><td>imprimi doar o parte din foaie</td></tr>
          <tr><td>Titluri de imprimat</td><td>Aspect pagină → Imprimare titluri</td><td>rândul de antet se repetă pe fiecare pagină</td></tr>
          <tr><td>Încadrare (Scalare)</td><td>Aspect pagină / Imprimare</td><td>„Încadrare toate coloanele pe o pagină”</td></tr>
          <tr><td>Antet și subsol</td><td>Inserare → Antet și subsol</td><td>numele școlii, numărul paginii, data</td></tr>
          <tr><td>Linii de grilă, întreruperi de pagină</td><td>Aspect pagină / Vizualizare</td><td>grila apare la imprimare doar dacă o bifezi</td></tr>
        </table></div>
        <p>Înainte de imprimare verifici mereu <b>Previzualizarea</b> (<i>Fișier → Imprimare</i>, [[k:Ctrl+P]]).</p>`
    }
  ],

  simulator: {
    titlu: 'Atelier: situația anuală',
    text: `<p>Registrul are trei foi: <i>Sem1</i>, <i>Sem2</i> și <i>Anual</i>.</p>
      <ul>
        <li>Pe foaia Anual, în B2, scrie <code>=</code>, fă clic pe eticheta <i>Sem1</i>, apoi pe B2, scrie <code>+</code>, treci pe <i>Sem2</i>, clic pe B2, apoi Enter. Adaugă paranteze și /2.</li>
        <li>Redenumește foaia Sem2 în „Note sem 2”. Privește formula de pe foaia Anual.</li>
        <li><b>Revizuire ▾</b>: deblochează C2:C9, protejează foaia și încearcă să modifici o medie.</li>
      </ul>`,
    foi: registru14()
  },

  animatii: [
    {
      id: 'o14-foi',
      titlu: 'O formulă care folosește trei foi',
      grila: { rows: 3, cols: 4, data: [['Foaia', 'Celula', 'Valoare', ''], ['Sem1', 'B2', 9.4], ['Sem2', 'B2', 9.6]] },
      pasi: [
        { text: 'Media Mariei este 9,4 pe foaia <b>Sem1</b> (celula B2) și 9,6 pe foaia <b>Sem2</b> (tot B2).', aprinde: ['A2:C3'] },
        { text: 'Pe foaia <b>Anual</b> scriem o formulă care „ajunge” pe celelalte foi.', formula: '=AVERAGE(Sem1!B2,Sem2!B2)' },
        { text: '<b>Sem1!B2</b>: numele foii, semnul „!”, apoi adresa. Valoarea adusă este 9,4.', ref0: ['C2'] },
        { text: '<b>Sem2!B2</b>: valoarea adusă este 9,6.', ref0: ['C2'], ref1: ['C3'] },
        { text: 'Media anuală: (9,4 + 9,6) / 2 = 9,5. Dacă o notă se schimbă pe Sem2, media anuală se recalculează.', mare: '9,5' },
        { text: 'Pentru un nume de foaie cu spații: <b>\'Note sem 2\'!B2</b>, cu apostrofuri.', mare: "'Note sem 2'!B2" }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o14-anual', tip: 'simulator', nivel: 'baza', puncte: 15,
      titlu: 'Media anuală din două foi',
      cerinta: 'Pe foaia <b>Anual</b>, în <b>B2:B9</b>, calculează media anuală: media dintre media din <b>Sem1</b> și cea din <b>Sem2</b> (același rând). Poți trece de pe o foaie pe alta prin clic pe etichete.',
      foi: registru14(), permiteFoi: true, selecteaza: 'A1',
      reguli: [{ foaie: 2, formula: 'B2:B9', solutie: '=AVERAGE(Sem1!B2,Sem2!B2)' }],
      indicii: ['Formula se scrie pe foaia Anual (clic pe eticheta ei, jos).', 'Referințele au forma Sem1!B2. De exemplu: =(Sem1!B2+Sem2!B2)/2 sau =AVERAGE(Sem1!B2,Sem2!B2).'],
      solutieText: 'Pe foaia Anual: [[=AVERAGE(Sem1!B2,Sem2!B2)]] în B2, copiată până la B9.'
    },
    {
      id: 'o14-situatie', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Situația anuală',
      cerinta: 'Pe foaia Anual, în <b>C2:C9</b>, afișează „Promovat” dacă media anuală (B) este cel puțin 5, altfel „Corigent”. Mediile anuale sunt deja calculate.',
      foi: registru14(null, { cells: Object.fromEntries(ELEVI_14.map((e, i) => ['B' + (i + 2), '=AVERAGE(Sem1!B' + (i + 2) + ',Sem2!B' + (i + 2) + ')'])) }), permiteFoi: true, selecteaza: 'A1',
      reguli: [{ foaie: 2, formula: 'C2:C9', solutie: '=IF(B2>=5,"Promovat","Corigent")', functii: ['IF'] }],
      indicii: ['Treci pe foaia Anual.', '=IF(B2>=5,"Promovat","Corigent")']
    },
    {
      id: 'o14-apostrof', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Numele foii cu spații',
      cerinta: 'A doua foaie se numește <b>Note sem 2</b>. Pe foaia Anual, în <b>D2:D9</b>, calculează <b>progresul</b>: media din „Note sem 2” minus media din Sem1.',
      foi: registru14('Note sem 2', { data: [['Elev', 'Media anuală', 'Situația', 'Progres']].concat(ELEVI_14.map((e) => [e])), bold: 'A1:D1' }), permiteFoi: true, selecteaza: 'A1',
      reguli: [{ foaie: 2, formula: 'D2:D9', solutie: "='Note sem 2'!B2-Sem1!B2" }],
      indicii: ['Un nume de foaie cu spații se scrie între apostrofuri.', "='Note sem 2'!B2-Sem1!B2"]
    },
    {
      id: 'o14-protectie', tip: 'simulator', nivel: 'avansat', puncte: 15,
      titlu: 'Formular protejat',
      cerinta: 'Pe foaia <b>Formular</b>, profesorul completează doar notele din <b>B2:B9</b>. Deblochează aceste celule, apoi <b>protejează foaia</b>, ca formulele din C să nu poată fi modificate.',
      foi: [{ name: 'Formular', rows: 11, cols: 4, data: [['Elev', 'Nota', 'Rezultat']].concat(ELEVI_14.map((e) => [e])), bold: 'A1:C1', widths: { A: 130 },
        cells: Object.fromEntries(ELEVI_14.map((e, i) => ['C' + (i + 2), '=IF(B' + (i + 2) + '="","",IF(B' + (i + 2) + '>=5,"promovat","nepromovat"))'])) }],
      meniuri: ['revizuire'], selecteaza: 'B2',
      reguli: [{ deblocate: 'B2:B9' }, { protejata: true, foaie: 0 }],
      indicii: ['Selectează B2:B9 → Revizuire ▾ → Deblochează celulele selectate.', 'Apoi Revizuire ▾ → Protejează foaia. Încearcă să modifici C2 ca să verifici.']
    },
    {
      id: 'o14-imprimare', tip: 'ordonare', nivel: 'mediu', puncte: 10,
      titlu: 'Pregătirea pentru imprimare',
      cerinta: 'Catalogul are 60 de rânduri și 12 coloane. Ordonează pașii pentru o imprimare corectă pe A4.',
      pasi: ['Aspect pagină → Orientare → Vedere (tabelul e lat).', 'Aspect pagină → Imprimare titluri → rândul 1 se repetă sus pe fiecare pagină.', 'Scalare: „Încadrare toate coloanele pe o pagină”.', 'Inserare → Antet și subsol: numele școlii și numărul paginii.', 'Fișier → Imprimare: verifică previzualizarea.', 'Apasă Imprimare.'],
      indicii: ['Verificarea în previzualizare vine chiar înainte de imprimare.']
    },
    {
      id: 'o14-setari', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Ce setare folosești?',
      cerinta: 'Potrivește problema cu setarea care o rezolvă.',
      perechi: [['antetul tabelului apare doar pe prima pagină', 'Titluri de imprimat (rânduri de repetat)'], ['ultima coloană trece pe altă pagină', 'Încadrare toate coloanele pe o pagină'], ['vrei să imprimi doar A1:F20', 'Zonă de imprimare'], ['vrei numărul paginii jos', 'Antet și subsol'], ['tabelul e mult mai lat decât înalt', 'Orientare Vedere']],
      indicii: ['„Titluri” se referă la rândurile care se repetă.']
    },
    {
      id: 'o14-referinta', tip: 'completare', nivel: 'baza', puncte: 5,
      titlu: 'Referință către altă foaie',
      cerinta: 'Completează formula care aduce valoarea din celula C5 a foii <b>Buget</b>.',
      sablon: '={{Buget}}{{!}}C5',
      indicii: ['Între numele foii și adresă se pune un semn de punctuație.']
    },
    {
      id: 'o14-protectie-reala', tip: 'grila', nivel: 'baza', puncte: 5,
      titlu: 'Cât de sigură e protecția?',
      cerinta: 'Care afirmație despre <i>Protejare foaie</i> este adevărată?',
      variante: ['Previne modificările accidentale, dar nu este o protecție puternică a datelor', 'Face fișierul imposibil de deschis fără parolă', 'Criptează datele', 'Blochează doar celulele deblocate'], corect: 0,
      indicii: ['Pentru a împiedica deschiderea fișierului există altă opțiune.']
    },
    {
      id: 'o14-3d', tip: 'grila', nivel: 'avansat', puncte: 10,
      titlu: 'Referința 3D',
      cerinta: 'Registrul are foile Ian, Feb, Mar, Apr (în această ordine), cu aceeași structură. Ce calculează [[=SUM(Ian:Mar!B2)]]?',
      variante: ['Suma celulelor B2 de pe Ian, Feb și Mar', 'Suma B2 de pe Ian și Mar', 'Suma B2 de pe toate cele patru foi', 'Eroare #REF!'], corect: 0,
      indicii: ['Ian:Mar este o „zonă de foi”, ca A1:A3 pentru celule.']
    }
  ],

  fisa: {
    titlu: 'Situația anuală a clasei',
    timp: 45,
    fisier: 'fisa-14-situatia-anuala.xlsx',
    context: 'Registrul conține mediile pe semestre ale clasei, pe foi separate. Construiește situația anuală, protejează ce nu trebuie modificat și pregătește documentul pentru imprimare.',
    foi: [
      { name: 'Sem1', data: [['Elev', 'Matematică', 'Informatică', 'Română']].concat(ELEVI_14.map((e, i) => [e, SEM1_14[i], Math.min(10, SEM1_14[i] + 0.5), SEM1_14[i] - 0.3])), widths: { A: 130 } },
      { name: 'Sem2', data: [['Elev', 'Matematică', 'Informatică', 'Română']].concat(ELEVI_14.map((e, i) => [e, SEM2_14[i], Math.min(10, SEM2_14[i] + 0.3), SEM2_14[i] - 0.2])), widths: { A: 130 } }
    ],
    cerinte: [
      { nivel: 'baza', puncte: 1, text: 'Colorează etichetele foilor (Sem1 verde, Sem2 albastru). Inserează o foaie nouă <b>Anual</b>, la final, și copiază în ea lista elevilor și antetul.', barem: '0,5p culori; 0,5p foaia Anual.' },
      { nivel: 'baza', puncte: 2, text: 'Pe foaia Anual calculează media anuală la fiecare disciplină, cu referințe către Sem1 și Sem2, rotunjită la 2 zecimale.', barem: '1,5p formula cu referințe între foi; 0,5p ROUND.', solutie: '=ROUND(AVERAGE(Sem1!B2,Sem2!B2),2)' },
      { nivel: 'mediu', puncte: 1.5, text: 'Adaugă pe foaia Anual media generală și situația (Promovat / Corigent). Redenumește apoi foaia Sem2 în „Semestrul 2” și verifică formulele.', barem: '1p formule; 0,5p redenumire cu formulele actualizate.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Protejează foile Sem1 și Sem2 cu parola „cerna” (fără celule deblocate). Pe foaia Anual lasă deblocată doar o coloană „Observații”, apoi protejeaz-o.', barem: '0,5p protecția semestrelor; 1p Anual cu Observații deblocată.' },
      { nivel: 'avansat', puncte: 2, text: 'Pregătește foaia Anual pentru imprimare: orientare Vedere, A4, toate coloanele pe o pagină, rândul 1 repetat, antet cu numele școlii, subsol cu „Pagina X din Y”, zonă de imprimare doar tabelul.', barem: '0,5p orientare + încadrare; 0,5p titluri repetate; 0,5p antet/subsol; 0,5p zona de imprimare.' },
      { nivel: 'avansat', puncte: 1, text: 'Creează foile Ian, Feb și Mar cu aceeași structură (câte o notă la B2) și, pe o foaie Total, adună B2 de pe toate trei cu o referință 3D.', barem: '1p =SUM(Ian:Mar!B2)' }
    ]
  }
};
