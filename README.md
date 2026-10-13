# Your Reign Is Over — Live Prompt & Tabs Manager

Application web locale conçue sur mesure pour les prestations live de guitare/chant sur Twitch de **Your Reign Is Over**.

---

## 🎸 Fonctionnalités Principales
- **Régie Scène Zéro Distraction** : Téléprompteur plein écran haut contraste pour les grilles d'accords et paroles.
- **Défilement Automatique Fluide** : Moteur `requestAnimationFrame` avec réglage de vitesse instantané (pixels/seconde, tempo ou durée).
- **Gestionnaire de Répertoire & Setlists** : Organisation des morceaux joués en live, ordre de passage, tags de style.
- **Mémos Hardware par Morceau** : Rappel immédiat de la guitare à utiliser (*Lag Primavera*, *Fender Jaguar*, *Duesenberg Paloma*, *Fender Baja*, *Lag Roxanne*), accordage, position du capo et preset du Kemper Profiler.
- **Contrôles Physiques** : Raccourcis clavier ergonomiques et intégration future Web MIDI pour assigner les pads de l'AKAI MPC Touch.

---

## 📁 Arborescence Canonique (00-99)
- [00_Conception_et_References/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/00_Conception_et_References/) : PRD ([01_PRD.md](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/00_Conception_et_References/01_PRD.md)), vision et contexte ([02_Contexte.md](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/00_Conception_et_References/02_Contexte.md)), architecture ([design.md](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/00_Conception_et_References/design.md)).
- [10_Design_et_Assets/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/10_Design_et_Assets/) : Maquettes UI, thèmes sombres et typographies scène.
- [20_Data_et_Bases/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/20_Data_et_Bases/) : Données de morceaux, schémas JSON, exports et état de session.
- [30_Hardware_et_Live_Setup/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/30_Hardware_et_Live_Setup/) : Fiches d'inventaire guitares, presets Kemper, routing Arturia MiniFuse 4 et mapping MIDI.
- [50_Scripts_et_Outillage/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/50_Scripts_et_Outillage/) : Scripts d'importation (parsing du PDF Ultimate-Guitar, convertisseurs ChordPro).
- [80_Tests_et_Deploiement/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/80_Tests_et_Deploiement/) : Tests de performance du moteur de scroll et tests d'intégration.
- [90_Code_Source/](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/90_Code_Source/) : Application React / Vite / TypeScript (sous garde-fou PRD).

---

## ⚠️ Garde-fou PRD First
La création de code source applicatif dans `90_Code_Source/` est bloquée jusqu'à la validation formelle du fichier [01_PRD.md](file:///e:/01%20-%20PROJETS/YRIO%20covers%20live/00_Conception_et_References/01_PRD.md).
