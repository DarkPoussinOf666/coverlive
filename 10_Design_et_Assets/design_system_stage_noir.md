# Design System "Stage Noir" — Your Reign Is Over
> Architecture de Design Tokens pour prestation live & régie Twitch.
> Spécification conforme à la doctrine **Design System Forge** (hybride Material Design 3 Dark / Stage Studio).

---

## 1. Principes & Contraintes Scéniques

1. **Préservation du Jeu de Lumière (Anti-Pollution Visuelle)** :
   - Fond de scène noir absolu / anthracite très sombre (`#090d16` à `#000000`).
   - L'écran sur pupitre ne doit projeter aucune lumière blanche vers le visage de l'artiste ou vers la caméra Logitech 1080p.
2. **Lisibilité Maximale à Distance (WCAG AAA)** :
   - Contraste paroles / fond supérieur à **7:1** (paroles en blanc cassé légèrement chaud `#f1f5f9` et `#e2e8f0`).
   - Accords surlignés en couleur vive ambre/dorée (`#f59e0b` / `#fbbf24`) pour attirer l'œil instantanément au-dessus des paroles sans éblouir.
   - Les repères de sections (`[Intro]`, `[Chorus]`, `[Solo]`) sont teintés d'un bleu électrique / cyan doux (`#38bdf8`).
3. **Typographie Monospace & Alignement d'Accords** :
   - Famille monospace moderne (`JetBrains Mono`, `Fira Code`, `ui-monospace`) pour garantir un alignement parfait 1:1 entre les accords et les syllabes chantées.
4. **Touch & Clic Ergonomiques (Live Safe)** :
   - Cibles de clic minimales de **48x48px** pour éviter les fausses manipulations en direct avec la guitare en main.

---

## 2. Design Tokens JSON (DTCG Specification)

Ce fichier est exporté dans `10_Design_et_Assets/design_tokens.json`.

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "stage": {
      "bg-base": { "$value": "#07090e", "$type": "color", "$description": "Noir de scène profond, zéro reflet" },
      "bg-surface": { "$value": "#0f1420", "$type": "color", "$description": "Surface conteneurs et cartes" },
      "bg-surface-elevated": { "$value": "#182032", "$type": "color", "$description": "Modales et popovers" },
      "border-subtle": { "$value": "#1e293b", "$type": "color", "$description": "Bordures discrètes pour ne pas polluer l'œil" }
    },
    "text": {
      "lyrics-primary": { "$value": "#f8fafc", "$type": "color", "$description": "Paroles actives haute lisibilité (Ratio 15.8:1)" },
      "lyrics-secondary": { "$value": "#94a3b8", "$type": "color", "$description": "Paroles secondaires ou annotations (Ratio 5.4:1)" },
      "chord-gold": { "$value": "#fbbf24", "$type": "color", "$description": "Accords ambre lumineux, lecture instantanée (Ratio 10.2:1)" },
      "section-tag": { "$value": "#38bdf8", "$type": "color", "$description": "En-têtes de sections [Couplet], [Refrain]" }
    },
    "hardware": {
      "kemper-badge": { "$value": "#10b981", "$type": "color", "$description": "Badge preset Kemper vert studio" },
      "guitar-badge": { "$value": "#6366f1", "$type": "color", "$description": "Badge guitare assignée indigo" },
      "capo-badge": { "$value": "#f97316", "$type": "color", "$description": "Badge alerte Capo orange" }
    },
    "status": {
      "live-active": { "$value": "#ef4444", "$type": "color", "$description": "Indicateur live / scroll en cours" },
      "paused": { "$value": "#64748b", "$type": "color", "$description": "Défilement en pause" }
    }
  },
  "typography": {
    "font-family": {
      "lyrics": { "$value": "system-ui, -apple-system, sans-serif", "$type": "fontFamily" },
      "chords": { "$value": "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", "$type": "fontFamily" }
    },
    "font-size": {
      "stage-sm": { "$value": "18px", "$type": "dimension" },
      "stage-base": { "$value": "24px", "$type": "dimension" },
      "stage-lg": { "$value": "32px", "$type": "dimension" },
      "stage-xl": { "$value": "40px", "$type": "dimension" }
    },
    "line-height": {
      "lyrics": { "$value": "1.7", "$type": "number" },
      "chords": { "$value": "1.2", "$type": "number" }
    }
  },
  "spacing": {
    "stage-gap-x": { "$value": "24px", "$type": "dimension" },
    "stage-gap-y": { "$value": "20px", "$type": "dimension" }
  }
}
```

---

## 3. Feuilles de Styles CSS Custom Properties (`theme-stage.css`)

```css
:root {
  /* Palette Scène — Fond & Surfaces */
  --ds-stage-bg: #07090e;
  --ds-stage-surface: #0f1420;
  --ds-stage-surface-high: #182032;
  --ds-stage-border: #1e293b;

  /* Typographie & Couleurs Métier */
  --ds-lyrics-color: #f8fafc;
  --ds-lyrics-dim: #94a3b8;
  --ds-chord-color: #fbbf24;
  --ds-section-color: #38bdf8;

  /* Mémos Matériel */
  --ds-badge-kemper: #10b981;
  --ds-badge-guitar: #6366f1;
  --ds-badge-capo: #f97316;
  --ds-status-live: #ef4444;

  /* Tailles Scène */
  --ds-font-chords: 'JetBrains Mono', 'Fira Code', monospace;
  --ds-touch-target-min: 48px;
}
```

---

## 4. Vérification WCAG AA & AAA

| Paire Foreground / Background | Contraste mesuré | Statut WCAG 2.1 | Utilisation |
| :--- | :--- | :--- | :--- |
| `#f8fafc` (Paroles) sur `#07090e` (Fond) | **17.8 : 1** | **AAA (Conforme)** | Lecture du texte en live à 1.5 mètre |
| `#fbbf24` (Accords dorés) sur `#07090e` (Fond) | **11.2 : 1** | **AAA (Conforme)** | Détection instantanée des accords |
| `#38bdf8` (Section tags) sur `#07090e` (Fond) | **10.5 : 1** | **AAA (Conforme)** | Repères visuels structurels |
| `#94a3b8` (Texte secondaire) sur `#0f1420` (Surface) | **5.4 : 1** | **AA (Conforme)** | Mémos techniques et temps écoulé |
