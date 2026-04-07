## Context

`ExecutiveView` affiche déjà deux KPI cards et un PieChart de répartition par statut. La mise en page doit être étendue pour intégrer deux nouveaux graphiques sans surcharger l'écran. Recharts est déjà dans la stack.

## Goals / Non-Goals

**Goals:**
- Funnel de conversion : nombre de deals par statut dans l'ordre du pipeline
- Trésorerie prévisionnelle : projection mensuelle des montants des deals actifs selon leur due date
- Mise en page propre et lisible sur desktop et mobile

**Non-Goals:**
- Taux de conversion calculés entre étapes
- Projection basée sur probabilité ou historique
- Interactivité avancée (drill-down, zoom)

## Decisions

### D1 — FunnelChart via BarChart horizontal Recharts
Recharts n'a pas de composant `FunnelChart` natif en v3. On utilise un `BarChart` horizontal (`layout="vertical"`) avec les statuts triés dans l'ordre du pipeline. Simple, lisible, pas de dépendance supplémentaire.

*Alternative écartée : bibliothèque externe de funnel — surcharge non justifiée.*

### D2 — Trésorerie : AreaChart par mois sur les 6 prochains mois
Les deals actifs (non gagné, non perdu) avec une `dueDate` sont agrégés par mois. L'`AreaChart` Recharts affiche la projection sur les 6 prochains mois calendaires. Les mois sans deal affichent 0.

*Rationale : la dueDate est le meilleur proxy pour la date d'encaissement prévisionnelle dans ce contexte.*

### D3 — Hooks dédiés `useFunnelData` et `useCashflowData`
Chaque graphique a son propre hook de calcul, consommant `useCRMStore`. Cela garde `ExecutiveView` propre et les calculs testables indépendamment.

### D4 — Ordre du pipeline
`prospect → qualifié → négociation → gagné - en cours`. Les deals "perdu" sont exclus du funnel (pas pertinent pour la conversion).

## Risks / Trade-offs

- **Deals sans dueDate** : exclus de la trésorerie prévisionnelle — documenté dans le graphique
- **Mois avec 0 deal** : affichés explicitement pour montrer les "trous" dans le pipeline
- **Deals avec dueDate passée** : exclus de la projection (déjà encaissés ou perdus en théorie)
