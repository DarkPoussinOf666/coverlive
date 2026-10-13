# Product Requirements Document (PRD) — Your Reign Is Over (Live Prompt & Tabs)

> **Statut du Garde-fou** : [x] PRD Validé (Validé par l'artiste — Déblocage de la création de code dans `90_Code_Source/`)

---

## 1. Contexte & Problématique
- **Identité artistique** : *Your Reign Is Over* (YRIO) — Prestations live streaming Twitch (principalement solo Guitare acoustique/électrique + Voix).
- **Problème à résoudre** : 
  - En live, naviguer entre les morceaux, chercher les accords/paroles, tourner les pages ou subir des interfaces encombrées (publicités, petits textes non contrastés, UI polluée) casse le flow de la performance et la connexion avec les spectateurs Twitch.
  - Besoin d'une interface de scène "zéro distraction", lisible à distance (pupitre/écran de stream), avec un système de téléprompteur / défilement automatique fluide, paramétrable par morceau, et une gestion de setlist claire.
- **Public cible / Utilisateur unique** : L'artiste (*Your Reign Is Over*) en condition de direct (Twitch / Live performance) et de répétition.

---

## 2. Objectifs & Métriques de Succès
- **Objectif principal** : Disposer d'une application web locale dédiée, épurée et ultra-réactive pour piloter la setlist en live et afficher les tablatures/paroles avec un défilement automatique synchronisable.
- **KPIs & Critères d'acceptation** :
  - [ ] **Lisibilité Scène & Zéro Distraction** : Mode "Stage/Live" plein écran (fond sombre haut contraste, typographie monospace/chord claire, masquage de tout élément superflu pendant le jeu).
  - [ ] **Défilement Auto Précis (Auto-scroll)** : Vitesse réglable (BPM / durée totale / pixels par seconde), départ/pause instantanés (au clavier, clic ou contrôleur externe), bouton retour en haut.
  - [ ] **Gestion de Répertoire & Setlists** :
    - Bibliothèque de morceaux (Titre, Artiste, Tonalité/Capo, Guitare assignée, Profil Kemper associé, Tempo/BPM, Durée estimée, Tags).
    - Création et réordonnancement de Setlists pour le live du jour (drag-and-drop ou flèches haut/bas).
  - [ ] **Import & Gestion du Contenu** : Support des formats texte / ChordPro / Markdown, extraction/import depuis les répertoires ou PDF (notamment *My tabs @ Ultimate-Guitar.Com.pdf* présent dans le projet).
  - [ ] **Contrôle sans les mains / Raccourcis physiques** : Raccourcis clavier globaux et/ou intégration Web MIDI (pour mapper des pads/boutons du contrôleur AKAI MPC Touch ou pédalier).

---

## 3. Scope & Fonctionnalités (MVP & Évolutions)

### MVP (Phase 1) :
- [ ] **Bibliothèque de Morceaux & CRUD** : Visualiser, ajouter, modifier, filtrer par instrument/accordage/style.
- [ ] **Vue Scène / Téléprompteur** :
  - Affichage texte + accords (ChordPro / format standard UG).
  - Transposition à la volée (changement de tonalité / calcul capo).
  - Auto-scroll fluide avec contrôle de vitesse (curseur + raccourcis clavier Espace/Flèches).
  - Mode Plein écran (F11 / toggle UI).
- [ ] **Fiche Technique par Morceau** :
  - Guitare recommandée (ex: *Lag Primavera*, *Fender Jaguar*, *Duesenberg Paloma*, *Fender Baja*, *Lag Roxanne*).
  - Preset Kemper / Mémo réglage micro (Shure 55 / Audio-Technica).
  - Notes mémo (ex: "Capo 3", "Fingerpicking intro").

### Évolutions Post-MVP (Phase 2 & 3) :
- [ ] **Support Web MIDI API** : Contrôle du scroll, changement de morceau suivant/précédent via pads de l'AKAI MPC Touch ou pédalier MIDI relié à la carte Arturia MiniFuse 4.
- [ ] **Overlay / Widget Twitch (OBS/Browser Source)** : Affichage d'un bandeau épuré "Now Playing" ou "Up Next" pour le stream sans montrer les accords personnels.
- [ ] **Parser automatique PDF Ultimate Guitar** : Script d'extraction des morceaux depuis `My tabs @ Ultimate-Guitar.Com.pdf` vers la base locale.

---

## 4. Hardware & Setup Technique Connecté
- **Instruments & Synthés** :
  - Acoustique : Lag Primavera
  - Électriques : Fender Jaguar, Duesenberg Paloma, Fender Telecaster Baja, Lag Roxanne
  - Boîte à rythmes : Arturia DrumBrute (beats analogiques live, métronome / backing rhythms)
  - Synthétiseur : Korg Minilogue (synthé analogique polyphonique, nappes / leads / basses)
- **Pedalboard & Effets Guitare** :
  - Contrôleur MIDI maître : Morningstar Engineering MC-8 (pilotage MIDI live du Kemper, Eventide H9s, et potentiellement de l'application via USB MIDI)
  - Multi-effets numériques : 3x Eventide H9 (Pitch, Reverbs, Delays, Modulations avancées)
  - Pitch & Synth : Digitech Whammy 5, Electro-Harmonix Synth9
  - Overdrives & Distortions : Boss OD-200 (hybride), MXR / Boss DS-1 Distortion, Electro-Harmonix Soul Food (type Klon Centaur)
  - Fuzz : ZVex Fuzz Factory, Boss FZ (Fuzz Shifter)
  - Modulations & Delays analogiques : Boss Flanger, Electro-Harmonix Stereo Memory Man (Delays & Chorus vintage)
  - Looper : TC Electronic Ditto X2 Looper (bouclage live)
- **Micros & Traitement** :
  - Voix : Shure 55 Black Edition
  - Guitare acoustique : Audio-Technica petite membrane
  - Amplification / Modélisation : Kemper Profiler
  - Interface Audio : Arturia MiniFuse 4
- **Contrôleurs, DAW & Vidéo** :
  - Morningstar Engineering MC-8 (Pédalier MIDI au pied)
  - AKAI MPC Touch (Contrôle tactile/pads)
  - DAW / STAN d'enregistrement : Fender Studio One
  - Caméra : Logitech HD 1080p
  - Plateforme de diffusion : Twitch

---

## 5. Contraintes Techniques & Dépendances
- **Stack recommandée** : Application Web locale moderne (React + Vite + Tailwind CSS + TypeScript), stockage local persistant (JSON / SQLite / IndexedDB / LocalStorage).
- **Performance** : Défilement 60 fps sans saccade (`requestAnimationFrame`), chargement instantané sans latence réseau.
- **Modèle d'état SKILL.state** : Schéma d'état de domaine canonique défini dans `design.md`.
