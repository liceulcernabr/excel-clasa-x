/* =====================================================================
   data/lectii/ora-12.js — ORA 12: Diagrame — alegerea tipului,
   elementele diagramei, formatare, interpretare
   Datele meteo sunt valori medii APROXIMATIVE pentru Brăila, rotunjite,
   folosite doar ca exercițiu.
   ===================================================================== */
window.DATE_LECTII = window.DATE_LECTII || {};

const CLIMA_12 = [
  ['Luna', 'Temp. medie (°C)', 'Temp. max (°C)', 'Temp. min (°C)', 'Precipitații (mm)'],
  ['ian', -1.5, 2.5, -5.2, 28], ['feb', 0.8, 5.1, -3.4, 26], ['mar', 5.9, 11.2, 1.1, 30], ['apr', 12.0, 18.0, 6.3, 38],
  ['mai', 17.8, 24.0, 11.6, 52], ['iun', 21.9, 28.1, 15.6, 64], ['iul', 24.0, 30.6, 17.4, 55], ['aug', 23.4, 30.2, 16.8, 42],
  ['sep', 18.2, 24.6, 12.3, 40], ['oct', 11.8, 17.9, 6.8, 30], ['noi', 5.6, 10.3, 1.9, 34], ['dec', 0.6, 4.3, -2.6, 32]
];
const VANZARI_12 = [['Categorie', 'Vânzări (lei)'], ['Papetărie', 12400], ['Electronice', 28600], ['Accesorii', 9800], ['Cărți', 7300], ['Sport', 5100]];
const LAT_12 = { A: 90, B: 110, C: 104, D: 104, E: 124, F: 20, G: 110, H: 90 };
const FOAIE_12 = (extra) => Object.assign({ name: 'Clima', rows: 15, cols: 9, data: CLIMA_12, bold: 'A1:E1', fill: 'A1:E1', widths: LAT_12 }, extra || {});

window.DATE_LECTII[12] = {
  nr: 12,
  titlu: 'Diagrame',
  durata: 50,
  rezumat: 'O diagramă bine aleasă arată dintr-o privire ce ar fi greu de văzut într-un tabel. Înveți ce tip se potrivește fiecărei întrebări, ce elemente are o diagramă și cum o citești corect.',

  obiective: [
    'să alegi tipul potrivit: coloane sau bare (comparații), linie (evoluție în timp), radială (părți dintr-un întreg);',
    'să selectezi corect datele (cu antet și etichete) înainte de a insera diagrama;',
    'să recunoști și să modifici elementele: titlu, titluri de axe, legendă, etichete de date, serii;',
    'să citești și să interpretezi o diagramă.'
  ],

  teorie: [
    {
      titlu: 'Ce tip de diagramă alegi',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Întrebarea</th><th>Tipul potrivit</th><th>Exemplu</th></tr>
          <tr><td>Care e mai mare? (comparație între categorii)</td><td><b>Coloane</b> sau <b>bare</b></td><td>vânzări pe categorii, medii pe clase</td></tr>
          <tr><td>Cum evoluează în timp?</td><td><b>Linie</b></td><td>temperatura lunară, notele pe semestre</td></tr>
          <tr><td>Ce parte din total reprezintă?</td><td><b>Radială</b> (plăcintă) sau <b>inel</b></td><td>structura bugetului, procentul pe categorii</td></tr>
          <tr><td>Cum se compune fiecare total?</td><td><b>Coloane stivuite</b></td><td>vânzări pe luni, împărțite pe categorii</td></tr>
          <tr><td>Există o legătură între două mărimi?</td><td><b>XY (prin puncte)</b></td><td>orele de studiu și nota</td></tr>
        </table></div>
        <div class="atentie"><strong>Plăcinta are o singură serie</strong>O diagramă radială arată părțile unui <b>singur</b> întreg. Dacă ai multe felii (peste 6–7) sau valori apropiate, e mai clară o diagramă cu bare.</div>`
    },
    {
      titlu: 'Inserarea unei diagrame',
      html: `
        <ol>
          <li>Selectezi datele <b>cu tot cu antet și etichete</b>, de exemplu A1:B13 (lunile și temperatura medie).</li>
          <li><i>Inserare → Diagrame</i> (<i>Insert → Charts</i>) → alegi tipul. <i>Diagrame recomandate</i> propune tipuri potrivite.</li>
          <li>Diagrama apare pe foaie. O muți, îi schimbi mărimea sau o treci pe o foaie separată (<i>Mutare diagramă</i>).</li>
        </ol>
        <p>Zone neadiacente (de exemplu Luna și Precipitații) le selectezi ținând apăsat [[k:Ctrl]]. În simulator scrii zona în fereastra <b>Inserare ▾ → Diagramă…</b></p>
        <p>Diagrama este <b>legată de date</b>: dacă modifici o valoare în tabel, diagrama se actualizează imediat.</p>`
    },
    {
      titlu: 'Elementele unei diagrame',
      html: `
        <div class="tabel-scroll"><table class="tabel">
          <tr><th>Element</th><th>Rol</th></tr>
          <tr><td><b>Titlul diagramei</b></td><td>spune ce arată diagrama („Temperatura medie lunară — Brăila”)</td></tr>
          <tr><td><b>Axa categoriilor</b> (orizontală)</td><td>etichetele: lunile, categoriile</td></tr>
          <tr><td><b>Axa valorilor</b> (verticală)</td><td>scara numerică, cu <b>titlul axei</b> și unitatea de măsură (°C, lei)</td></tr>
          <tr><td><b>Seria de date</b></td><td>un set de valori, de obicei o coloană din tabel</td></tr>
          <tr><td><b>Legenda</b></td><td>explică ce culoare are fiecare serie (inutilă când există o singură serie)</td></tr>
          <tr><td><b>Etichetele de date</b></td><td>valoarea scrisă pe fiecare coloană sau felie</td></tr>
          <tr><td><b>Liniile de grilă</b></td><td>ajută la citirea valorilor</td></tr>
        </table></div>
        <p>În Excel, elementele se adaugă din butonul <b>+</b> de lângă diagramă sau din fila <i>Proiectare diagramă</i>. Formatarea (culori, fonturi) se face din fila <i>Format</i> sau cu dublu-clic pe element.</p>`
    },
    {
      titlu: 'Interpretarea — capcane',
      html: `
        <ul>
          <li>Citește întâi <b>titlul</b> și <b>unitățile</b> axelor.</li>
          <li>Verifică de unde pornește axa verticală: dacă nu pornește de la 0, diferențele par mai mari decât sunt.</li>
          <li>La plăcintă, procentele se raportează la <b>total</b>, nu la cea mai mare valoare.</li>
          <li>O linie unește puncte succesive în timp. Pentru categorii fără ordine (orașe, produse), linia nu are sens.</li>
        </ul>`
    }
  ],

  simulator: {
    titlu: 'Atelier: clima Brăilei',
    text: `<p>Folosește meniul <b>Inserare ▾ → Diagramă…</b> din simulator:</p>
      <ul>
        <li>Zona <code>A1:B13</code>, tip <i>Coloane</i>: temperatura medie pe luni.</li>
        <li>Zona <code>A1:A13</code> și <code>C1:D13</code> nu sunt vecine. Folosește <code>A1:D13</code> și tipul <i>Linie</i>, ca să compari media, maxima și minima.</li>
        <li>Pe foaia <i>Vânzări</i>: zona <code>A1:B6</code>, tip <i>Radială</i>, cu etichete de date.</li>
        <li>Schimbă o valoare din tabel și urmărește diagrama. Folosește <i>Modifică</i> pentru titlu și titlurile axelor.</li>
      </ul>`,
    inaltime: 330,
    foi: [FOAIE_12(), { name: 'Vânzări', rows: 8, cols: 4, data: VANZARI_12, bold: 'A1:B1', widths: { A: 110, B: 110 }, formats: { 'B2:B6': 'currency:0' } }]
  },

  animatii: [
    {
      id: 'o12-mapare',
      titlu: 'Din tabel în diagramă: ce devine fiecare parte',
      grila: { rows: 5, cols: 3, data: [['Clasa', 'Sem. I', 'Sem. II'], ['10A', 8.4, 8.7], ['10B', 7.9, 8.1], ['10C', 8.1, 8.0]] },
      pasi: [
        { text: 'Selectăm zona A1:C4, cu antetul și etichetele.', zona: ['A1:C4'] },
        { text: 'Prima coloană (10A, 10B, 10C) devine <b>axa categoriilor</b>, adică etichetele de jos.', aprinde: ['A2:A4'] },
        { text: 'Primul rând (Sem. I, Sem. II) dă <b>numele seriilor</b>, care apar în legendă.', aprinde: ['B1:C1'] },
        { text: 'Fiecare coloană de numere este o <b>serie de date</b>: seria „Sem. I” are valorile 8,4 · 7,9 · 8,1.', ref0: ['B2:B4'] },
        { text: 'A doua serie, „Sem. II”, apare cu altă culoare, alături de prima, în fiecare categorie.', ref0: ['B2:B4'], ref1: ['C2:C4'] },
        { text: 'Colțul A1 („Clasa”) nu apare în diagramă. Dacă vrei seriile pe rânduri, alegi „Seriile sunt pe rânduri”.', aprinde: ['A1'], mare: 'categorii · serii · legendă' }
      ]
    }
  ],

  exercitii: [
    {
      id: 'o12-coloane', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Temperatura medie lunară',
      cerinta: 'Inserează o diagramă cu <b>coloane</b> pentru temperatura medie pe luni (zona <b>A1:B13</b>), cu titlul <b>Temperatura medie la Brăila</b>.',
      foi: [FOAIE_12()], meniuri: ['inserare'], selecteaza: 'A1', inaltime: 280,
      reguli: [{ diagrama: { tip: ['coloane'], zona: 'A1:B13', titlu: 'Brăila' } }],
      indicii: ['Inserare ▾ → Diagramă…', 'Zona A1:B13, tipul „Coloane grupate”, titlul cerut.']
    },
    {
      id: 'o12-linie', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Evoluția temperaturilor',
      cerinta: 'Arată pe aceeași diagramă evoluția temperaturii <b>medii, maxime și minime</b> pe parcursul anului. Alege tipul potrivit pentru o evoluție în timp, pune un titlu care conține cuvântul <b>temperaturi</b> și un titlu pentru axa verticală (°C).',
      foi: [FOAIE_12()], meniuri: ['inserare'], selecteaza: 'A1', inaltime: 280,
      reguli: [{ diagrama: { tip: ['linie'], zona: 'A1:D13', titlu: 'temperaturi', titluY: true } }],
      indicii: ['Evoluția în timp se arată cu o diagramă de tip linie.', 'Zona trebuie să cuprindă lunile și cele trei coloane de temperaturi: A1:D13.']
    },
    {
      id: 'o12-placinta', tip: 'simulator', nivel: 'mediu', puncte: 15,
      titlu: 'Structura vânzărilor',
      cerinta: 'Pe foaia <b>Vânzări</b> arată ce <b>parte din total</b> reprezintă fiecare categorie. Afișează <b>etichetele de date</b> (procentele).',
      foi: [{ name: 'Vânzări', rows: 8, cols: 4, data: VANZARI_12, bold: 'A1:B1', widths: { A: 110, B: 110 } }], meniuri: ['inserare'], selecteaza: 'A1', inaltime: 200,
      reguli: [{ diagrama: { tip: ['placinta', 'inel'], zona: 'A1:B6', etichete: true } }],
      indicii: ['„Parte din total” → diagramă radială (plăcintă) sau inel.', 'Bifează „Afișează etichetele de date”.']
    },
    {
      id: 'o12-bare', tip: 'simulator', nivel: 'baza', puncte: 10,
      titlu: 'Precipitațiile',
      cerinta: 'Inserează o diagramă cu <b>bare orizontale</b> pentru precipitațiile lunare (luna și precipitațiile). Legenda nu este necesară, pentru că există o singură serie.',
      foi: [{ name: 'Precipitații', rows: 14, cols: 4, data: CLIMA_12.map((r) => [r[0], r[4]]), bold: 'A1:B1', widths: { A: 70, B: 130 } }], meniuri: ['inserare'], selecteaza: 'A1', inaltime: 250,
      reguli: [{ diagrama: { tip: ['bare'], zona: 'A1:B13', legenda: false } }],
      indicii: ['Tipul „Bare orizontale”, zona A1:B13.', 'Debifează „Afișează legenda”.']
    },
    {
      id: 'o12-citire', tip: 'simulator', nivel: 'mediu', puncte: 10,
      titlu: 'Citește diagrama',
      cerinta: 'Privește diagrama de sub tabel. În <b>G2</b> scrie luna (prescurtarea din tabel, de exemplu „ian”) cu cele mai multe precipitații, iar în <b>G3</b> câți milimetri a avut.',
      foi: [{ name: 'Precipitații', rows: 14, cols: 8, data: CLIMA_12.map((r) => [r[0], r[4]]), bold: 'A1:B1', widths: { A: 70, B: 130, G: 90 }, cells: { G1: 'Răspuns' },
        diagrame: [{ id: 'p', tip: 'coloane', zona: 'A1:B13', titlu: 'Precipitații lunare la Brăila (mm)', legenda: false, etichete: true }] }],
      selecteaza: 'G2', inaltime: 200, toolbar: false,
      reguli: [
        { valoare: 'G2', egal: 'iun', mesaj: 'caută cea mai înaltă coloană.' },
        { valoare: 'G3', egal: 64, tipDate: 'numar' }
      ],
      indicii: ['Cea mai înaltă coloană arată luna cu cele mai multe precipitații.', 'Eticheta de date de deasupra coloanei îți dă valoarea.'],
      solutieText: 'Iunie (iun), cu 64 mm.'
    },
    {
      id: 'o12-alegere', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Ce diagramă alegi?',
      cerinta: 'Potrivește fiecare situație cu tipul de diagramă cel mai potrivit.',
      perechi: [['evoluția notei la matematică pe 8 teste', 'linie'], ['ce procent din buget merge pe cazare', 'radială (plăcintă)'], ['media fiecărei clase din liceu', 'coloane'], ['vânzările pe luni, împărțite pe categorii', 'coloane stivuite'], ['legătura dintre orele de studiu și notă', 'XY (prin puncte)']],
      indicii: ['Timp → linie; parte din întreg → plăcintă; comparație → coloane.']
    },
    {
      id: 'o12-elemente', tip: 'potrivire', nivel: 'baza', puncte: 10,
      titlu: 'Elementele diagramei',
      cerinta: 'Potrivește elementul cu rolul lui.',
      perechi: [['Titlul diagramei', 'spune ce reprezintă diagrama'], ['Legenda', 'explică ce culoare are fiecare serie'], ['Etichetele de date', 'afișează valorile direct pe diagramă'], ['Titlul axei verticale', 'arată unitatea de măsură a valorilor'], ['Seria de date', 'un set de valori reprezentate cu aceeași culoare']],
      indicii: ['Legenda contează doar când ai mai multe serii.']
    },
    {
      id: 'o12-capcana', tip: 'grila', nivel: 'avansat', puncte: 10,
      titlu: 'O diagramă înșelătoare',
      cerinta: 'Două coloane arată mediile 8,2 și 8,6, dar a doua pare de trei ori mai înaltă. Care este cea mai probabilă explicație?',
      variante: ['Axa verticală nu pornește de la 0 (de exemplu pornește de la 8)', 'Datele sunt greșite', 'Diagrama este de tip linie', 'Legenda este ascunsă'], corect: 0,
      indicii: ['Uită-te la prima valoare de pe axa verticală.'],
      explicatie: 'Dacă axa începe la 8, înălțimile arată diferențele 0,2 și 0,6, nu valorile întregi.'
    }
  ],

  fisa: {
    titlu: 'Clima Brăilei în diagrame',
    timp: 45,
    fisier: 'fisa-12-clima-braila.xlsx',
    context: 'Clubul de ecologie pregătește un poster despre clima Brăilei. Fișierul conține valori lunare medii <b>aproximative</b> (folosite ca exercițiu). Fiecare diagramă trebuie să aibă titlu, iar axele titlu și unitatea de măsură.',
    foi: [{ name: 'Clima', data: CLIMA_12, widths: { B: 110, C: 110, D: 110, E: 130 } }, { name: 'Vânzări', data: VANZARI_12, widths: { A: 110, B: 110 } }],
    cerinte: [
      { nivel: 'baza', puncte: 1.5, text: 'Diagramă cu <b>coloane</b> pentru temperatura medie lunară, cu titlul „Temperatura medie lunară la Brăila” și titlul axei verticale „°C”.', barem: '0,5p tipul și datele; 0,5p titlul; 0,5p titlul axei.' },
      { nivel: 'baza', puncte: 1.5, text: 'Diagramă de tip <b>linie</b> cu temperatura maximă și cea minimă (două serii), cu legenda jos.', barem: '0,5p două serii; 0,5p tip linie; 0,5p legenda jos.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Diagramă <b>radială</b> pentru vânzările pe categorii (foaia Vânzări), cu etichete de date în procente și felia cea mai mare desprinsă (explodată).', barem: '0,5p tip; 0,5p etichete procentuale; 0,5p felie desprinsă.' },
      { nivel: 'mediu', puncte: 1.5, text: 'Diagramă cu <b>bare</b> pentru precipitații, sortată descrescător (sortează întâi datele) și cu etichete de date. Mut-o pe o foaie separată numită „Precipitații”.', barem: '0,5p sortare; 0,5p etichete; 0,5p foaie separată.' },
      { nivel: 'avansat', puncte: 1, text: 'Diagramă combinată: temperatura medie ca <b>linie</b> și precipitațiile ca <b>coloane</b>, cu precipitațiile pe o <b>axă secundară</b>.', barem: '0,5p tip combinat; 0,5p axa secundară.' },
      { nivel: 'avansat', puncte: 2, text: 'Interpretare: sub tabel, răspunde în două celule: (a) În ce lună diferența dintre maximă și minimă este cea mai mare? (calculează diferențele într-o coloană nouă); (b) Ce diagramă ai alege pentru a arăta procentul de precipitații căzut vara din totalul anual și de ce?', barem: '1p coloana diferențelor + luna corectă; 1p răspuns argumentat (plăcintă/inel pe anotimpuri).' }
    ]
  }
};
