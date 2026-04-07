## Why

La Vue Executive actuelle n'affiche que des KPIs statiques et un PieChart de répartition. Pour un entrepreneur qui pilote son pipeline commercial, deux visualisations manquent : le **funnel de conversion** (combien de prospects deviennent des deals gagnés) et la **courbe de trésorerie prévisionnelle** (projection des encaissements futurs). Ces graphiques transforment le dashboard d'un outil de reporting en outil d'aide à la décision.

## What Changes

- Ajout d'un `FunnelChart` dans `ExecutiveView` : nombre de deals par statut, dans l'ordre prospect → qualifié → négociation → gagné
- Ajout d'un `AreaChart` de trésorerie prévisionnelle dans `ExecutiveView` : projection mensuelle des `montantDeal` selon la `dueDate` des deals actifs (non perdu, non gagné)
- Réorganisation de la mise en page de `ExecutiveView` pour accueillir les deux nouveaux graphiques

## Capabilities

### New Capabilities

- `funnel-chart` : Visualisation du funnel de conversion par statut
- `cashflow-chart` : Courbe de trésorerie prévisionnelle basée sur les due dates

### Modified Capabilities

- `executive-view` : Ajout des deux graphiques dans la vue existante

## Impact

- **Fichiers modifiés** : `src/views/ExecutiveView.tsx`, `src/hooks/useKPIs.ts`
- **Nouveaux hooks** : `src/hooks/useFunnelData.ts`, `src/hooks/useCashflowData.ts`
- **Dépendances** : Recharts déjà installé — aucune nouvelle dépendance

## Hors-périmètre

- Filtres par période ou par assigné
- Export des graphiques en image
- Projection basée sur des taux de conversion historiques
- Graphiques interactifs avec drill-down
