# Excel · clasa a X-a

Site educațional interactiv pentru predarea Microsoft Excel la clasa a X-a (TIC).
Liceul Teoretic „Panait Cerna” Brăila · prof. Aura Ion.

Site-ul este format doar din HTML, CSS și JavaScript. Nu are pas de build și folosește numai căi relative.
Merge publicat pe GitHub Pages și merge și deschis direct din fișier (dublu-clic pe `index.html`), fără internet.

---

## Structura folderelor

```
excel-clasa-x/
├── index.html              pagina principală: harta celor 15 ore, progres, insigne
├── config.js               SETĂRI: parola profesorului, teste, separatorul din formule
├── functii.html            dicționarul funcțiilor (nume în engleză + traducere)
├── lectii/ora-01.html …    câte o pagină pe oră (pagini scurte, conținutul vine din /data)
├── fise/fisa.html?ora=N    fișa de lucru printabilă (A4)
├── teste/index.html        lista testelor
├── teste/test.html?ora=N   mini-testul orei N;  test.html?evaluare=1..3 → evaluările
├── olimpiada/
│   ├── index.html          modulul de antrenament pentru Olimpiada de TIC
│   ├── subiect.html?id=N   un subiect de antrenament (cronometru, verificare, soluții)
│   ├── sprint.html         sprintul de formule cu clasament local
│   └── trucuri.html        scurtături, trucuri de verificare, greșeli frecvente
├── assets/css/             style.css (aspect, teme), print.css (A4), olimpiada.css (aspectul modulului)
├── assets/js/
│   ├── formula-engine.js   motorul de formule (parser, funcții, erori, registru)
│   ├── spreadsheet.js      simulatorul de foaie de calcul
│   ├── spreadsheet-extra.js sortare, filtre, subtotaluri, pivot, formatare condiționată, validare, protecție
│   ├── charts.js           diagramele (SVG, funcționează și fără internet)
│   ├── olimpiada.js        modulul de olimpiadă (subiecte, sprint)
│   ├── exercises.js        exercițiile cu verificare automată
│   ├── animations.js       animațiile pas cu pas
│   ├── quiz.js             testele
│   ├── worksheet.js        fișele de lucru (.xlsx + print)
│   ├── progress.js         puncte, insigne, progres (localStorage)
│   ├── lectie.js           construiește pagina unei ore din date
│   └── app.js              antet, temă, mod profesor, utilitare
├── data/
│   ├── cuprins.js          titlurile celor 15 ore și ale evaluărilor
│   ├── functii.js          numele funcțiilor în engleză și română
│   ├── lectii/ora-XX.js    CONȚINUTUL fiecărei ore
│   ├── intrebari/ora-XX.js BANCA DE ÎNTREBĂRI a fiecărei ore
│   └── olimpiada/          subiecte.js (subiectele de antrenament), sprint.js (provocările)
└── tools/                  teste automate (motor, conținut, autoteste în browser)
```

> **De ce `.js` și nu `.json`?** Când site-ul e deschis direct din fișier, browserul nu permite
> citirea fișierelor `.json`. Fișierele `.js` se încarcă oricum, de aceea datele sunt păstrate în `.js`.
> Le editați la fel de ușor: sunt doar liste și texte.

---

## Setări (config.js)

| Setare | Ce face |
|---|---|
| `parolaProfesor` | parola pentru modul profesor |
| `teste.feedback` | `'imediat'` (după fiecare întrebare) sau `'final'` |
| `teste.timerImplicit` | cronometrul pornește implicit (`true`/`false`) |
| `teste.itemiMiniTest` | câte întrebări are un mini-test (5–8) |
| `teste.itemiEvaluare` | câte întrebări are un test de evaluare |
| `teste.punctDinOficiu` | nota = 1 + 9 × (punctaj obținut / punctaj maxim) |
| `separatorFormule` | `','` (=ROUND(A1,2)) sau `';'` (=ROUND(A1;2), ca în Excel cu setări regionale românești) |

### Modul profesor

Se activează cu **Ctrl + Alt + P** sau cu **5 clicuri rapide pe sigla** din stânga-sus. Apoi introduceți parola din `config.js`.
În modul profesor devin vizibile baremele și soluțiile, marcate cu roșu („pixul profesorului”), iar fișa printabilă include și baremul.
Modul rămâne activ până la închiderea browserului sau până la o nouă apăsare pe Ctrl + Alt + P.

> ⚠️ **Nu este o protecție reală.** Parola se vede în `config.js`, iar soluțiile există în codul paginii.
> Oricine știe să deschidă codul sursă le poate găsi. Scopul este doar ca elevii să nu vadă soluțiile din greșeală.

---

## Cum adaug o întrebare

Deschideți `data/intrebari/ora-XX.js` și adăugați un bloc în listă. Fiecare întrebare are un `id` **unic**.

```js
// grilă cu un singur răspuns (corect = poziția variantei, numărând de la 0)
{ id: '1-23', tip: 'unic', enunt: 'Ce extensie are un registru Excel?',
  variante: ['.xlsx', '.docx', '.pptx', '.txt'], corect: 0,
  explicatie: '.xlsx este registrul Excel obișnuit.' },

// grilă cu mai multe răspunsuri corecte
{ id: '1-24', tip: 'multiplu', enunt: 'Care sunt numere?', variante: ['12', 'abc', '3,5'], corect: [0, 2] },

// adevărat / fals
{ id: '1-25', tip: 'adevarat', enunt: 'Un registru poate avea mai multe foi.', corect: true },

// completare (se acceptă oricare dintre răspunsuri; nu contează majusculele)
{ id: '1-26', tip: 'completare', enunt: 'Adresa celulei din coloana B, rândul 3:', raspunsuri: ['B3'] },

// asociere (fiecare element din stânga cu perechea lui din dreapta)
{ id: '1-27', tip: 'asociere', enunt: 'Asociază:', perechi: [['Text', 'Brăila'], ['Număr', '2025']] },

// scrie formula — verificată automat în simulator
{ id: '5-01', tip: 'formula', enunt: 'În D2 calculează suma notelor din B2:C2.',
  foi: [{ name: 'Note', data: [['Elev', 'Nota 1', 'Nota 2', 'Suma'], ['Ana', 9, 8]] }],
  tinta: 'D2', solutie: '=SUM(B2:C2)', functii: ['SUM'] }
```

La un test, întrebările se extrag la întâmplare și se amestecă. De aceea se recomandă cel puțin 15 întrebări pe oră.

---

## Cum adaug o lecție

1. Copiați `data/lectii/ora-01.js` ca `data/lectii/ora-02.js` și schimbați la început `window.DATE_LECTII[1]` în `window.DATE_LECTII[2]`.
2. Completați câmpurile: `titlu`, `rezumat`, `obiective`, `teorie`, `simulator`, `animatii`, `exercitii`, `fisa`.
3. În `data/cuprins.js`, puneți `disponibil: true` la ora respectivă.
4. Pagina `lectii/ora-02.html` există deja și se construiește automat.

În texte puteți folosi următoarele marcaje:

| Marcaj | Rezultat |
|---|---|
| `[[=SUM(A1:A5)]]` | formulă, afișată cu „,” sau „;” după butonul „a,b” din antet |
| `[[fn:VLOOKUP]]` | VLOOKUP (căutare verticală) |
| `[[k:Ctrl+C]]` | tastele desenate ca taste |

Datele unei foi de calcul se descriu astfel:

```js
{ name: 'Catalog', rows: 15, cols: 8,
  data: [['Nume', 'Nota'], ['Ana', 9], ['Mihai', 7]],   // tabel pornind din A1
  cells: { D1: '=AVERAGE(B2:B3)' },                     // celule separate
  formats: { 'B2:B3': 'number:2', 'C2': 'currency', 'D2': 'percent:1', 'E2': 'date' },
  bold: 'A1:B1', widths: { A: 120 } }
```

Datele calendaristice se scriu ca text: `'15.03.2025'`. Valorile logice se scriu `'TRUE'` / `'FALSE'`.
Un text care arată ca un număr se scrie cu apostrof: `"'0745123456"`.

---

## Cum adaug un exercițiu

Adăugați un bloc în lista `exercitii` a lecției. Câmpuri comune tuturor exercițiilor: `id` (unic), `tip`, `titlu`, `nivel` (`baza` / `mediu` / `avansat`),
`puncte`, `cerinta`, `indicii` (lista indiciilor progresive) și, opțional, `explicatie` sau `solutieText`.

```js
// 1. Formulă verificată în simulator
{ id: 'o5-suma', tip: 'simulator', nivel: 'baza', puncte: 10, titlu: 'Totalul',
  cerinta: 'În D2 calculează totalul, apoi copiază formula până în D6.',
  foi: [ /* foile de calcul */ ],
  reguli: [ { formula: 'D2:D6', solutie: '=B2*C2', functii: [] } ],
  indicii: ['Totalul = cantitate × preț.', 'Scrie =B2*C2 și trage de ghidajul de umplere.'] }
```

Regulile posibile pentru `tip: 'simulator'`:

| Regulă | Verifică |
|---|---|
| `{ formula: 'D2:D6', solutie: '=B2*C2', functii: ['SUM'] }` | că fiecare celulă conține o formulă cu același rezultat ca soluția și, opțional, că folosește funcțiile cerute |
| `{ valoare: 'B2', egal: 350, tipDate: 'numar', faraFormula: true }` | o valoare scrisă direct (`tipDate`: `numar`, `text`, `data`, `logic`) |
| `{ selectie: 'B3:E6' }` | ce a selectat elevul |
| `{ numeFoaie: 'Catalog', foaie: 0 }` / `{ nrFoi: 2 }` | numele și numărul foilor |
| `{ format: 'C2:C6', tip: 'currency', zecimale: 2 }` | formatul celulelor |
| `{ aldin: 'A1:D1' }` | textul aldin (Bold) |
| `{ sortat: 'A1:F17', chei: [{ col: 'Clasa' }, { col: 'Puncte', desc: true }] }` | tabel sortat corect, fără rânduri „rupte” |
| `{ vizibile: { zona: 'A1:F17', conditie: (x) => x['Gen'] === 'F' } }` | ce rânduri au rămas vizibile după filtru |
| `{ copiat: { zona: 'A1:F17', dest: 'H6', conditie: (x) => … } }` | rezultatul unui filtru avansat cu copiere |
| `{ cfEfect: { zona: 'C2:C13', conditie: (v) => v < 5, tip: 'formula' } }` | ce celule colorează formatarea condiționată (oricum ar fi scrisă regula) |
| `{ cfTip: 'bare', zona: 'D2:D13' }` | existența unei reguli de un anumit tip |
| `{ validare: { celula: 'G2', accepta: ['1', '10'], refuza: ['0', '7,5'], mesajEroare: true } }` | regula de validare a celulei |
| `{ diagrama: { tip: ['linie'], zona: 'A1:D13', titlu: 'temperaturi', titluY: true } }` | diagrama inserată |
| `{ pivot: { randuri: 'Categorie', coloane: 'Luna', valori: 'Valoare', fn: 'sum' } }` | tabelul pivot (după numele antetelor) |
| `{ subtotal: { grup: 'Categorie' } }` | subtotaluri corecte (tabel sortat înainte) |
| `{ protejata: true }` / `{ deblocate: 'B2:B9' }` | protecția foii și celulele deblocate |
| `{ custom: (wb, sp) => null /* sau mesaj de eroare */ }` | orice altă verificare |

Pentru exercițiile cu sortare, filtre, diagrame etc. adăugați în exercițiu `meniuri: ['date', 'inserare', 'conditionat', 'revizuire']`
(doar meniurile necesare); altfel bara de unelte a exercițiului nu le afișează. Pentru o regulă pe altă foaie decât prima: `foaie: 2`.

> **Verificarea „robustă”:** după ce rezultatul este corect, site-ul modifică la întâmplare numerele din tabel
> și verifică dacă formula elevului dă tot același rezultat ca soluția. Așa nu trec rezultatele scrise de mână
> (de ex. `=38`) și nici formulele care ar trebui să folosească `$`. Dacă un exercițiu cere intenționat o constantă,
> adăugați `robust: false` sau `fixe: ['F1']` pentru celulele care nu trebuie modificate.

Celelalte tipuri de exerciții:

```js
{ tip: 'potrivire',   perechi: [['Termen', 'Descriere'], …] }
{ tip: 'clasificare', categorii: [{ nume: 'Număr', elemente: ['12', '3,5'] }, …] }
{ tip: 'completare',  sablon: '=VLOOKUP(A2,{{$E$2:$F$9}},{{2}},FALSE)' }   // variante acceptate: {{2|2,0}}
{ tip: 'greseala',    formula: '=SUMM(A1:A5)', gresit: 'SUMM', corect: '=SUM(A1:A5)' }
{ tip: 'ordonare',    pasi: ['Primul pas', 'Al doilea', …] }             // scrieți-i în ordinea CORECTĂ
{ tip: 'rezultat',    foi: [ … ], formula: '=B2*C2' }                   // rezultatul corect îl calculează site-ul
{ tip: 'grila',       variante: ['…', '…'], corect: 1 }                  // sau corect: [0, 2]
```

---

## Modulul de olimpiadă

Subiectele din `data/olimpiada/subiecte.js` sunt **de antrenament**, create după modelul tipurilor de cerințe de la
Olimpiada de TIC (secțiunea Excel). **Nu sunt subiecte oficiale**, iar acest lucru este scris pe fiecare pagină. Datele sunt fictive.

**Cum adaug un subiect:** copiați un bloc `(function () { … window.SUBIECTE_OLIMPIADA.push({ … }); })();` și modificați:

```js
{ id: 7, titlu: '…', dificultate: 2, timp: 60, fisier: 'olimpiada-antrenament-7.xlsx',
  tipologie: ['VLOOKUP', 'pivot', …],
  context: 'enunțul general',
  foi: [ /* foile de pornire, ca la lecții */ ],
  cerinte: [
    { nr: 1, puncte: 10, text: '…',
      reguli: [{ foaie: 1, formula: 'F2:F13', solutie: '=B2+C2' }],   // aceleași reguli ca la exerciții
      solutie: '<ol><li>pasul 1…</li></ol>' },
    { nr: 2, puncte: 15, manual: true, text: 'setări de imprimare…', solutie: '…' }   // autoevaluare
  ] }
```

Suma punctelor trebuie să fie 100 (verificatorul semnalează altfel). Cerințele care modifică structura foii
(subtotaluri, protecție) se pun ultimele sau se fac pe o copie a foii, ca să nu strice verificarea celorlalte.

**Sprintul de formule:** provocările sunt în `data/olimpiada/sprint.js`: `P('s31', 2, 'enunț', FOAIE, 'E2', '=SOLUTIE', ['FUNCȚIE'])`.
Clasamentul se păstrează local, în browserul de pe calculatorul respectiv.

---

## Numele funcțiilor

În Excel funcțiile se scriu **doar în engleză** (SUM, IF, VLOOKUP, TRUE/FALSE), chiar dacă meniurile sunt în română.
Pe site, lângă fiecare funcție apare și **traducerea** ei (de ex. „VLOOKUP (căutare verticală)”), ca elevii să înțeleagă ce face.
Traducerile sunt în `data/functii.js`, câmpul `traducere`.

Simulatorul se comportă ca Excel: `=SUMĂ(A1:A5)` dă eroarea **#NAME?**, iar panoul de explicații sugerează
„În Excel funcțiile se scriu în engleză: folosește SUM”. Și greșelile de scriere primesc sugestii: `SUMM` → „Ai vrut SUM?”.

Separatorul de argumente depinde de setările regionale ale calculatorului: `,` (=ROUND(A1,2)) sau `;` (=ROUND(A1;2)).
Simulatorul le acceptă pe amândouă, iar butonul **a,b** din antet schimbă felul în care sunt afișate formulele pe site.

---

## Testare locală

Aveți nevoie de [Node.js](https://nodejs.org). În PowerShell, din folderul proiectului:

```powershell
# testele automate ale motorului de formule
node tools/test-engine.js

# verifică tot conținutul (soluțiile exercițiilor, formulele din texte, întrebările)
node tools/test-continut.js
node tools/test-continut.js 7      # doar ora 7

node tools/test-continut.js olimpiada   # subiectele de olimpiadă și sprintul

# autoteste în browser (consola F12), doar pentru verificare:
#   pe o lecție:         App.incarcaScript('../tools/test-browser.js')
#   pe un subiect:       App.incarcaScript('../tools/test-olimpiada.js')
# rezolvă automat exercițiile / cerințele paginii (acordă puncte în progresul local!)

# server local (apoi deschideți http://localhost:5500)
npx serve -l 5500 .
```

Fișierul `serve.json` oprește redirecționarea la adrese fără `.html`, ca să se păstreze parametrii de tipul `?ora=1`.
Site-ul se poate deschide și direct, cu dublu-clic pe `index.html`.

---

## Publicare pe GitHub Pages

Site-ul se publică din ramura `main`, folderul rădăcină. Adresa va fi **https://liceulcernabr.github.io/excel-clasa-x/**.
Fișierul `.nojekyll` îi spune lui GitHub Pages să publice fișierele exact cum sunt, iar `.gitignore` lasă deoparte fișierele de lucru.

### Varianta 1 — cu GitHub CLI (cea mai rapidă)

```powershell
cd C:Proiecteexcel-clasa-x
git init
git branch -M main
git add .
git commit -m "Site Excel clasa a X-a"

gh auth login                     # autentificare cu contul liceulcernabr (o singură dată)
gh repo create liceulcernabr/excel-clasa-x --public --source . --remote origin --push
gh api -X POST repos/liceulcernabr/excel-clasa-x/pages -f "source[branch]=main" -f "source[path]=/"
```

După 1–2 minute site-ul este disponibil la adresa de mai sus. Stadiul publicării se vede în fila *Actions* a depozitului.

### Varianta 2 — din browser + git

1. Pe github.com, autentificat cu **liceulcernabr**: *New repository* → nume `excel-clasa-x` → *Public* → fără README → *Create*.
2. În PowerShell:

```powershell
cd C:Proiecteexcel-clasa-x
git init
git branch -M main
git add .
git commit -m "Site Excel clasa a X-a"
git remote add origin https://github.com/liceulcernabr/excel-clasa-x.git
git push -u origin main
```

3. Pe github.com: *Settings → Pages → Build and deployment → Source: Deploy from a branch* → Branch **main**, folderul **/ (root)** → *Save*.

### Actualizări ulterioare

```powershell
cd C:Proiecteexcel-clasa-x
node tools/test-engine.js; node tools/test-continut.js    # verificare înainte de publicare
git add .
git commit -m "Descrierea modificării"
git push
```

> Nu uitați să schimbați parola modului profesor din `config.js` înainte de publicare. Totuși, pe un site public,
> soluțiile și parola se pot vedea în codul sursă, deci modul profesor nu este o protecție reală.
