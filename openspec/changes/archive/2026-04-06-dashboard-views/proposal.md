## Why

L'import CSV est opérationnel mais le dashboard n'affiche aucune donnée. Il faut implémenter les deux vues métier qui constituent la valeur réelle de l'outil : les KPIs financiers et la liste des actions urgentes.

## What Changes

- Remplacement du placeholder `DashboardLayout` par un composant fonctionnel avec navigation entre vues
- Ajout de `ExecutiveView` : affiche les KPIs **Revenu Sécurisé** et **Pipeline Actif** avec un graphique Recharts (répartition par statut)
- Ajout de `FocusModeView` : table des contacts nécessitant une action (urgence ou stagnation), filtrée et triée

## Capabilities

### New Capabilities

- `dashboard-layout` : Shell de navigation entre ExecutiveView et FocusModeView
- `executive-view` : KPIs financiers calculés depuis le store + graphique Recharts
- `focus-mode-view` : Table filtrée des contacts urgents/stagnants avec critères de priorisation

### Modified Capabilities

*(aucune — les requirements de `csv-import` ne changent pas)*

## Impact

- **Fichiers modifiés** : `src/App.tsx` (DashboardLayout devient un vrai composant)
- **Nouveaux fichiers** : `src/views/ExecutiveView.tsx`, `src/views/FocusModeView.tsx`, `src/components/DashboardLayout.tsx`
- **Dépendances** : Recharts (déjà prévu dans la stack) — aucune nouvelle dépendance
- **Store** : lecture seule de `CRMRow[]` depuis `useCRMStore`

## Hors-périmètre

- Filtres dynamiques par statut, période ou assigné
- Export des données filtrées
- Graphiques avancés (funnel, timeline)
- Persistance de la vue active entre sessions
