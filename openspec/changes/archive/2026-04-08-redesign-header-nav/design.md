## Context

Le header actuel (`DashboardLayout.tsx`) utilise des boutons `<button>` avec classes Tailwind manuelles pour simuler des onglets. L'identité visuelle (titre + badge contacts) et la navigation (onglets + retour import) sont dans un seul bloc flex, sans hiérarchie marquée. Le tout fonctionne correctement mais manque de finition visuelle.

## Goals / Non-Goals

**Goals:**
- Meilleure hiérarchie visuelle dans le header (identité distincte de la navigation)
- Onglets avec icônes Lucide pour différencier clairement les deux vues
- Bouton "Nouvel import" avec icône, plus lisible
- Animation fluide sur l'indicateur d'onglet actif

**Non-Goals:**
- Ne pas modifier la logique de navigation (état `activeView`, `clearRows`)
- Ne pas modifier les vues `ExecutiveView` ou `FocusModeView`
- Ne pas ajouter de nouvelles bibliothèques (Lucide déjà disponible)

## Decisions

### Icônes : lucide-react (existant)
`lucide-react` est déjà une dépendance du projet via Shadcn UI. On utilise `BarChart2` pour Vue Executive et `Target` pour Focus Mode. Alternative écartée : emojis (pas professionnel) ou SVG inline (trop verbeux).

### Style des onglets : pill animée via Tailwind
On garde une approche CSS pure avec transitions Tailwind (`transition-all`, `duration-200`). On remplace le fond `bg-gray-900/80` par un indicateur de soulignement ou pill contrastée. Alternative écartée : Framer Motion (surcharge, pas dans le stack).

### Structure HTML : séparation en deux `<div>` dans le header
- Ligne 1 : logo/titre + badge + bouton retour (flex justify-between)
- Ligne 2 : barre de navigation avec onglets iconifiés

Alternative envisagée : tout sur une seule ligne (trop chargé à petite taille d'écran).

## Risks / Trade-offs

- [Risque] Régression visuelle si les classes glass-card du header changent → Mitigation : ne pas toucher aux classes du `<header>`, uniquement le contenu intérieur
- [Trade-off] L'animation CSS pure est moins fluide qu'une lib d'animation → acceptable pour un outil interne MVP
