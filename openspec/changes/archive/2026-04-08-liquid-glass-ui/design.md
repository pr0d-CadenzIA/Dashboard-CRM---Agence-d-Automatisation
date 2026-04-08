## Context

L'interface utilise Tailwind CSS v4. L'effet Liquid Glass repose sur trois primitives CSS disponibles nativement : `backdrop-filter: blur()`, `background: rgba()` (transparence), et `box-shadow` avec des teintes lumineuses. Aucune bibliothèque supplémentaire n'est nécessaire.

## Goals / Non-Goals

**Goals:**
- Fond global avec dégradé ambiant animé (blobs floutés)
- Cards en verre dépoli (backdrop-blur + bg semi-transparent + bordure lumineuse)
- Header et onglets translucides
- Cohérence sur toutes les vues

**Non-Goals:**
- Mode sombre
- Animations complexes (spring, parallax)
- Compatibilité IE/Safari < 15 (backdrop-filter non supporté)

## Decisions

### D1 — Fond global : dégradé ambiant avec blobs animés
`index.css` : fond blanc cassé avec 2–3 blobs de couleur pastel (bleu, violet, rose) positionnés en absolu, très floutés (`blur(120px)`), animés lentement en CSS (`@keyframes`). Crée la profondeur sans surcharger.

### D2 — Surface "verre" : classe utilitaire `.glass-card`
Définie dans `index.css` via `@layer components` :
```css
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.9);
}
```
Appliquée sur `Card`, `DashboardLayout` header, `ImportView` card.

### D3 — Onglets actifs : verre sombre
L'onglet actif passe de `bg-gray-900` à un verre sombre (`bg-gray-900/80 backdrop-blur-sm`) avec bordure lumineuse subtile.

### D4 — Couleurs KPI conservées
Les couleurs sémantiques (vert Revenu Sécurisé, bleu Pipeline Actif) sont conservées — seul le fond des cards change.

### D5 — Compatibilité backdrop-filter
`backdrop-filter` est supporté par tous les navigateurs modernes (Chrome 76+, Firefox 103+, Safari 9+). Acceptable pour un usage interne solo.

## Risks / Trade-offs

- **Lisibilité** : les textes sur fond translucide peuvent perdre en contraste — à vérifier sur screenshot Playwright
- **Performance** : `backdrop-filter` est GPU-accelerated, pas de problème de perf sur desktop
- **Blobs animés** : l'animation CSS doit être `prefers-reduced-motion` compatible — on l'arrête si détecté
