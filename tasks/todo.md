# Plan d'Action — Double Module d'Importation Ultimate Guitar (UI In-App + CLI)

## Ressources Mobilisées
- **Agent** : lead-agent / fullstack-dev
- **Skill** : `gemini-superpowers-workflow`, `design-system-forge` (ergonomie Adobe Spectrum)
- **Fichiers Clés** :
  - `90_Code_Source/app/vite.config.ts` (Middleware de scraping Node/Vite sans CORS)
  - `90_Code_Source/app/src/utils/ugParser.ts` (Parser & cleaner TypeScript universel UG)
  - `90_Code_Source/app/src/components/SongEditorModal.tsx` (Composant d'import rapide URL in-app)
  - `50_Scripts_et_Outillage/import_song.py` (Script CLI unitaire et interactif pour terminal)
  - `tasks/todo.md` (Suivi rigoureux d'exécution)

---

## Tâches Séquentielles

- [x] **1. Moteur de Nettoyage et Décodage TypeScript (`ugParser.ts`)** <!-- id: 1 -->
  - [x] Écrire `90_Code_Source/app/src/utils/ugParser.ts` avec typage strict TypeScript pour parser le payload UG (`js-store`), nettoyer les balises `[ch]...[/ch]` et `[tab]`, décoder les entités HTML et suggérer automatiquement Guitare + Kemper selon l'artiste.

- [x] **2. Middleware API Dev Server Vite (`vite.config.ts`)** <!-- id: 2 -->
  - [x] Implémenter le middleware `/api/scrape-ug` dans `vite.config.ts` pour récupérer les pages UG côté serveur Node (bypass des restrictions CORS navigateur) et renvoyer la fiche structurée du morceau.

- [x] **3. Intégration UI dans l'Éditeur (`SongEditorModal.tsx`)** <!-- id: 3 -->
  - [x] Ajouter une barre d'importation rétractable "Importer depuis Ultimate Guitar" avec champ URL, bouton d'action avec état de chargement et retours d'erreur/succès.
  - [x] Pré-remplir instantanément tous les champs du formulaire (titre, artiste, tonalité, capo, accordage, guitare, kemper, paroles/accords).

- [x] **4. Outil CLI Unitaire & Batch (`import_song.py`)** <!-- id: 4 -->
  - [x] Créer `50_Scripts_et_Outillage/import_song.py` prenant une URL en argument (ou en mode interactif ou liste batch `--file`), extrayant et injectant directement le morceau dans `ug_tabs_cache.json` et `importedCatalog.json`.

- [x] **5. Validation Technique & Tests de Fonctionnalité** <!-- id: 5 -->
  - [x] Tester le script CLI avec une vraie URL publique UG (`Seven Nation Army`, `11Am`).
  - [x] Valider la robustesse face aux variations de payloads (`tuning`, `meta` listes/objets).
  - [x] Vérifier le build TypeScript / Vite de l'application (`npm run build` réussi sans erreur en 743ms).

- [x] **6. Alignement Précis des Accords & Textes (Preservation des Espaces & Chords-Over-Lyrics)** <!-- id: 6 -->
  - [x] Mettre à jour `SINGLE_CHORD_REGEX` et `isLineOfChords` pour reconnaître tous les accords complexes (`Cmaj7`, `Em7`, `Cadd9`, `D/F#`, `F#m7b5`, etc.).
  - [x] Refondre `ChordProViewer.tsx` pour préserver strictement la chasse fixe (`font-mono whitespace-pre`), éliminer les distorsions de tracking, coupler visuellement les lignes d'accords et de paroles, et supporter la syntaxe inline ChordPro.
  - [x] Tester et valider visuellement le rendu avec espacement fidèle (Build vérifié en 479ms).

---

## Review & Logique d'Apprentissage

### Logique et Apprentissage

1. **Dualité d'Accès (UI vs CLI) pour la Préparation Live** :
   - L'ajout d'une passerelle dans l'interface graphique ([`SongEditorModal.tsx`](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/90_Code_Source/app/src/components/SongEditorModal.tsx)) permet d'enrichir une setlist en un clic sans rupture de contexte visuel.
   - Le script CLI dédié ([`import_song.py`](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/50_Scripts_et_Outillage/import_song.py)) offre l'agilité requise pour l'import massif ou rapide via terminal (`--file urls.txt` ou URL en paramètre).

2. **Bypass Éthique & Technique des Limitations CORS Navigateur** :
   - Les navigateurs bloquent légitimement les appels `fetch()` cross-origin directs vers `tabs.ultimate-guitar.com`.
   - L'implémentation d'un plugin middleware dans le serveur de dev Vite (`ug-scraper-middleware` dans [`vite.config.ts`](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/90_Code_Source/app/vite.config.ts)) résout le problème côté Node de façon transparente et sans dépendance externe lourde.

3. **Résilience et Variabilité du Schéma UG (Defensive Parsing)** :
   - Ultimate Guitar varie sa structure selon les contributions : `meta` ou `tuning` peuvent être alternativement des dictionnaires, des listes de chaînes ou des tableaux vides.
   - Les deux parsers (Python et TypeScript) appliquent désormais un typage défensif strict évitant tout crash d'exécution sur les cas limites.

4. **Alignement Spatial & Passing Chords-Over-Lyrics** :
   - Par défaut, le moteur de rendu HTML collapse les espaces multiples (` ` $\rightarrow$ ` `), ce qui détruit le calage des accords sur les syllabes du vers.
   - L'application de la typographie à chasse fixe (`font-mono whitespace-pre`) couplée à un `tracking-normal` et à la fusion en blocs couplets garantit un alignement vertical parfait caractère par caractère entre l'accord et le mot correspondant.

