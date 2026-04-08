## Why

L'interface actuelle est sobre et fonctionnelle mais générique. L'effet "Liquid Glass" d'Apple (iOS 26 / visionOS) — surfaces translucides avec flou d'arrière-plan, reflets subtils, profondeur — apporte une identité visuelle distinctive et moderne qui renforce la crédibilité du dashboard en tant que vitrine technique.

## What Changes

- Remplacement des cards opaques blanches par des surfaces en verre dépoli (`backdrop-blur`, `bg-white/60`, bordures lumineuses)
- Fond général avec dégradé ambiant animé (blobs de couleur floutés)
- Header et onglets en verre translucide
- Boutons et badges avec effet de profondeur subtil
- Cohérence de l'effet sur ImportView, ExecutiveView, FocusModeView et DashboardLayout

## Capabilities

### New Capabilities

- `liquid-glass-ui` : Système de design visuel Liquid Glass appliqué à l'ensemble de l'interface

### Modified Capabilities

*(aucune — changement purement visuel, aucun requirement fonctionnel ne change)*

## Impact

- **Fichiers modifiés** : `src/index.css`, `src/views/ImportView.tsx`, `src/views/ExecutiveView.tsx`, `src/views/FocusModeView.tsx`, `src/components/DashboardLayout.tsx`, `src/components/ui/card.tsx`
- **Dépendances** : aucune — uniquement Tailwind CSS (classes existantes + arbitrary values)
- **Pas de mode sombre** : pas de changement sur ce point (hors-périmètre MVP)

## Hors-périmètre

- Mode sombre
- Thèmes personnalisables
- Animations de transition entre vues
