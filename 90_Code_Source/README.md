# Architecture du Code Source — 90_Code_Source

## ⚠️ Garde-fou Important (PRD First)
> **RÈGLE STRICTE DE DÉVELOPPEMENT** :
> AUCUN fichier de code source brut (.py, .js, .ts, .go, .cpp, .html, etc.) ne doit être créé dans ce dossier ou ses sous-dossiers tant que le fichier `00_Conception_et_References/01_PRD.md` n'a pas été complété et formellement validé (`[x] PRD Validé`).

## Structure Cible (Application Web Locale React / Vite + Tailwind)
Une fois la conception validée, ce dossier hébergera :
- `src/` :
  - `components/` : StagePrompter, SetlistManager, SongEditor, ChordViewer, HardwareMemo, AutoScroller.
  - `hooks/` : `useAutoScroll`, `useWebMidi`, `useKeyboardShortcuts`, `useChordTransposer`.
  - `types/` : Définitions TypeScript strictes (`Song`, `Setlist`, `GearPreset`, `ScrollState`).
  - `services/` : Moteur de parsing ChordPro/Ultimate-Guitar, stockage local / API.
- `package.json`, `vite.config.ts`, `tailwind.config.js`.
