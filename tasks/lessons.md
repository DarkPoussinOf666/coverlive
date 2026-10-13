# Lessons Learned & Règles Préventives — YRIO Covers Live

## Encodage Console Windows & Caractères Spéciaux
- **Motif d'erreur** : Sous Windows PowerShell avec Python, les sorties console `print` contenant des caractères UTF-8 (emojis, coches `✓`, `é`) lèvent une `UnicodeEncodeError: 'charmap' codec can't encode character`.
- **Règle préventive** : Tout script d'outillage Python exécuté sous Windows doit initialiser `sys.stdout.reconfigure(encoding='utf-8')` ou utiliser des marqueurs ASCII stricts (`[OK]`, `[ECHEC]`).

## Gestion du Scraping Web & Rate-Limiting
- **Motif d'erreur** : Les requêtes rapides et massives vers des services comme Ultimate-Guitar peuvent déclencher des codes HTTP 429 ("Too Many Requests").
- **Règle préventive** : Toujours coupler le scraper avec une mise en cache incrémentale sur disque (`json`), des pauses adaptatives (`sleep`), et un mécanisme de fallback gracieux permettant à l'application de fonctionner sans blocage avec les données déjà acquises.

## Nettoyage des Entités HTML dans les Textes Musicaux
- **Motif d'erreur** : Les plateformes web de tablatures échappent les apostrophes et guillemets (`&#039;`, `&quot;`, `&amp;`), polluant la lecture scénique des paroles.
- **Règle préventive** : Appliquer un double niveau de protection :
  1. Au niveau des scripts d'ingestion/scraping via `html.unescape()` multi-passes + normalisation des apostrophes typographiques.
  2. Au niveau du runtime applicatif frontend (composants de rendu de scène et parsing `localStorage`) via une fonction de décodage défensive `decodeHtmlEntities`.

## Défilement Automatique Continu (Auto-Scroll Téléprompteur)
- **Motif d'erreur** :
  1. **Troncature DOM à 60 FPS** : À faible vitesse (ex. 26 px/s), le delta par frame est d'environ 0,4 px. Les navigateurs tronquent ou arrondissent `el.scrollTop` vers l'entier inférieur si on écrit `scrollTop = scrollTop + delta`, bloquant tout déplacement.
  2. **Interférence `scroll-smooth`** : La directive CSS `scroll-smooth` entre en conflit direct avec les modifications impératives de `scrollTop` dans `requestAnimationFrame`.
  3. **Arrêt prématuré de condition de bord** : Tester `currentScroll >= maxScroll - 1` alors que `maxScroll <= 0` coupe instantanément la boucle à la frame 0.
  4. **Re-render React instable** : Un `useEffect` dépendant de la référence de l'objet `song` (au lieu de `song.id`) réinitialise et met en pause le prompteur à chaque re-render du composant parent.
- **Règle préventive** :
  - Toujours maintenir un accumulateur de sous-pixels flottant (`scrollPosRef.current += distance`).
  - Bannir la classe `scroll-smooth` sur le conteneur animé au profit de `scroll-behavior: auto`.
  - Isoler la détection de changement de morceau sur une clé primitive stable (`song.id`).


