/* data/intrebari/ora-14.js — Banca de întrebări pentru ORA 14 (foi, protecție, imprimare) */
window.INTREBARI = window.INTREBARI || {};
window.INTREBARI[14] = [
  { id: '14-01', tip: 'unic', enunt: 'Cum se scrie referința la celula B2 de pe foaia Sem1?', variante: ['Sem1!B2', 'Sem1:B2', 'B2!Sem1', 'Sem1.B2'], corect: 0 },
  { id: '14-02', tip: 'unic', enunt: 'Cum se scrie referința la B2 de pe foaia „Note sem 2”?', variante: ["'Note sem 2'!B2", 'Note sem 2!B2', '"Note sem 2"!B2', '[Note sem 2]B2'], corect: 0 },
  { id: '14-03', tip: 'adevarat', enunt: 'Dacă redenumești o foaie, formulele care o folosesc se actualizează automat.', corect: true },
  { id: '14-04', tip: 'unic', enunt: 'Ce se întâmplă cu o formulă după ce ștergi foaia la care face trimitere?', variante: ['dă eroarea #REF!', 'se actualizează singură', 'devine 0', 'dă #NAME?'], corect: 0 },
  { id: '14-05', tip: 'unic', enunt: 'Ce calculează [[=SUM(Ian:Mar!C3)]]?', variante: ['suma celulelor C3 de pe foile de la Ian până la Mar', 'suma C3 de pe foile Ian și Mar', 'suma coloanei C', 'eroare'], corect: 0 },
  { id: '14-06', tip: 'adevarat', enunt: 'Implicit, toate celulele sunt „blocate”, dar blocarea are efect abia după protejarea foii.', corect: true },
  { id: '14-07', tip: 'unic', enunt: 'Vrei ca elevii să completeze doar coloana B, iar restul foii să nu poată fi modificat. Ordinea corectă este:', variante: ['deblochezi B, apoi protejezi foaia', 'protejezi foaia, apoi deblochezi B', 'blochezi B, apoi protejezi foaia', 'ascunzi celelalte coloane'], corect: 0 },
  { id: '14-08', tip: 'unic', enunt: 'Ce împiedică „Protejare registru” (structura)?', variante: ['adăugarea, ștergerea și redenumirea foilor', 'deschiderea fișierului', 'modificarea celulelor', 'imprimarea'], corect: 0 },
  { id: '14-09', tip: 'multiplu', enunt: 'Care setări se găsesc în fila Aspect pagină?', variante: ['Orientare', 'Margini', 'Zonă de imprimare', 'Imprimare titluri', 'Validare date'], corect: [0, 1, 2, 3] },
  { id: '14-10', tip: 'asociere', enunt: 'Asociază problema cu soluția.',
    perechi: [['antetul lipsește de pe pagina 2', 'Imprimare titluri: rândul 1 repetat'], ['tabelul are 14 coloane și nu încape', 'Orientare Vedere și încadrare pe lățime'], ['vrei doar primul tabel', 'Zonă de imprimare'], ['vrei data pe fiecare pagină', 'Antet și subsol']] },
  { id: '14-11', tip: 'unic', enunt: 'Ce combinație deschide imprimarea (cu previzualizare)?', variante: ['Ctrl+P', 'Ctrl+I', 'Ctrl+Shift+P', 'F12'], corect: 0 },
  { id: '14-12', tip: 'adevarat', enunt: 'Liniile de grilă se imprimă implicit.', corect: false },
  { id: '14-13', tip: 'unic', enunt: 'Selectezi etichetele Sem1 și Sem2 cu Ctrl și scrii „Notă” în A1. Ce se întâmplă?', variante: ['„Notă” apare în A1 pe ambele foi (foi grupate)', 'apare doar pe prima foaie', 'apare o eroare', 'se creează o foaie nouă'], corect: 0 },
  { id: '14-14', tip: 'completare', enunt: 'Pentru a imprima doar zona A1:F30 o setezi ca zonă de ___ .', raspunsuri: ['imprimare', 'imprimat'] },
  { id: '14-15', tip: 'unic', enunt: 'Ce protecție împiedică deschiderea fișierului de către cineva fără parolă?', variante: ['Criptarea cu parolă (Fișier → Informații)', 'Protejare foaie', 'Blocarea celulelor', 'Ascunderea foii'], corect: 0 },
  { id: '14-16', tip: 'multiplu', enunt: 'Ce poți face din meniul de clic dreapta pe eticheta unei foi?', variante: ['Redenumire', 'Mutare sau copiere', 'Culoare filă', 'Ascundere', 'Sortare'], corect: [0, 1, 2, 3] },
  { id: '14-17', tip: 'completare', enunt: 'Între numele foii și adresa celulei, într-o referință, se pune semnul ___ .', raspunsuri: ['!'] },
  { id: '14-18', tip: 'unic', enunt: 'Pentru un tabel mai lat decât înalt se recomandă orientarea…', variante: ['Vedere (Landscape)', 'Portret', 'nu contează', 'Verticală'], corect: 0 }
];
