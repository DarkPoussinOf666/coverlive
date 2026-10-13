# Workflow de Développement — Your Reign Is Over

1. **Vérification Préalable** :
   - Le PRD est-il validé ? (Oui $\rightarrow$ continuer / Non $\rightarrow$ bloquer).
2. **Implémentation Atomique (TDD & Composants Isolés)** :
   - Étape 1 : Modèles TypeScript (`Song`, `ChordLine`, `GearConfig`).
   - Étape 2 : Composant Scène / Téléprompteur avec défilement fluide.
   - Étape 3 : Hook de contrôle clavier et Web MIDI (pour AKAI MPC Touch).
   - Étape 4 : Gestionnaire de Setlists et bibliothèque locale.
3. **Tests & Validation Visuelle** :
   - Vérifier la fluidité 60 fps sans saccade.
   - Valider la lisibilité à 1,5 mètre de distance de l'écran.
