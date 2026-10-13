# Boucle d'Exécution Procédurale SKILL.state — O(1) Prompt / O(T) Tokens

Ce workflow formalise la boucle d'exécution déterministe pour toutes les tâches automatisées du projet.

## 1. Triplet d'Entrée
À chaque itération $t$, le contexte reçoit exclusivement :
- $P$ : Spécification de la tâche courante.
- $\Sigma_t$ : État structuré JSON courant (sans historique conversationnel brut).
- $O_t$ : Dernière observation issue des outils (résultat de commande, erreur de build).

## 2. Génération & Éphémérité
- L'agent produit le raisonnement $R_t$ et un bloc de transition d'état $\Delta\Sigma_t$.
- Dès la transition validée, $R_t$ est détruit pour maintenir une empreinte token constante $O(1)$ dans le prompt.

## 3. Mise à jour de l'État
$$\Sigma_{t+1} \leftarrow \Sigma_t \oplus \Delta\Sigma_t$$
Les clés associées à `null` sont supprimées.
