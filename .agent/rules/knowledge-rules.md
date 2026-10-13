# Gouvernance de la Connaissance, Exécution SKILL.state & Architecture Cognitive

## 1. Architecture d'Exécution Procédurale SKILL.state (O(1) Prompt / O(T) Tokens)
- **Modèle de Transition d'État Explicite** : Remplacer l'historique conversationnel append-only par des transitions d'état explicites. À l'étape $t$, l'agent reçoit uniquement :
  $$A_t = (P, \Sigma_t, O_t)$$
  où $P$ est la spécification procédurale immuable, $\Sigma_t$ est l'état structuré courant, et $O_t$ est la dernière observation.
- **Raisonnement Éphémère (Ephemeral CoT)** :
  L'agent génère $(R_t, \Delta\Sigma_t, a_t)$ où $R_t$ est la réflexion pas-à-pas Chain-of-Thought. Une fois le patch d'état $\Delta\Sigma_t$ validé et appliqué, **$R_t$ est immédiatement et définitivement détruit**. Il ne doit jamais être réinjecté dans les prompts suivants.
- **Opérateur de Fusion Déterministe ($\oplus$) & Sémantique Null-Delete** :
  $$\Sigma_{t+1} \leftarrow \Sigma_t \oplus \Delta\Sigma_t$$
  Le patch $\Delta\Sigma_t$ est un dictionnaire JSON de mutations. Pour supprimer une clé, lui assigner explicitement la valeur `null`.

## 2. Boucles Agentiques & Disjoncteurs
- **Prévention des IAL (Infinite Agentic Loops)** : Toute itération autonome d'un agent doit posséder un disjoncteur formel (`max_iterations`).
- **Validation d'Intentions** : Traiter et rectifier les erreurs d'exécution sans itération aveugle.

## 3. Données & Persistance
- Schéma d'état de session conservé dans `20_Data_et_Bases/`.
- Traçabilité et idempotence des scripts d'importation (PDF Ultimate Guitar, exports ChordPro).
