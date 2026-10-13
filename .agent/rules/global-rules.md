# Règles Globales du Projet — Your Reign Is Over

## ⛔ Garde-fou Stricte : Bloquer le code avant validation du PRD
- **Interdiction Formelle** : Il est strictement INTERDIT de créer, modifier ou générer des fichiers de code applicatif dans `90_Code_Source/` tant que le fichier `00_Conception_et_References/01_PRD.md` contient la case non cochée `[ ] PRD Validé`.
- **Rôle de Conseil** : Si une demande de codage intervient avant cette validation, rappeler le garde-fou et proposer de verrouiller les spécifications d'abord.

## 📐 Standards Qualité & Architecture
- **Typage Strict** : TypeScript strict obligatoire, interfaces rigoureusement définies.
- **Séparation des Responsabilités** :
  - Découplage strict entre les composants d'affichage (UI), la gestion de setlist/données (Stores/Hooks), et les moteurs (Scroll, MIDI, Parsing).
- **Zéro Distraction & Performance** :
  - Tout composant de scène doit privilégier les rendus légers et optimisés (60 fps avec `requestAnimationFrame`).
- **Conventional Commits** : Messages de commit normalisés à l'impératif (`feat:`, `fix:`, `refactor:`, `docs:`).
