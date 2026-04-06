## Context

Le store Zustand contient déjà les `CRMRow[]` injectés par l'`ImportView`. Le `DashboardLayout` actuel est un placeholder vide. Il faut le remplacer par un shell de navigation réel et implémenter les deux vues métier : `ExecutiveView` (KPIs) et `FocusModeView` (actions urgentes).

## Goals / Non-Goals

**Goals:**
- Afficher les KPIs financiers (Revenu Sécurisé, Pipeline Actif) avec graphique Recharts
- Afficher la table des contacts nécessitant une action immédiate
- Permettre la navigation entre les deux vues via des onglets
- Rester cohérent avec le style sobre HubSpot/Salesforce

**Non-Goals:**
- Filtres dynamiques par période, statut ou assigné
- Export CSV des données filtrées
- Persistance de l'onglet actif
- Graphiques avancés (funnel, courbe d'évolution)

## Decisions

### D1 — Navigation par onglets dans DashboardLayout
Un état local `useState<'executive' | 'focus'>` dans `DashboardLayout` contrôle la vue affichée. Pas de React Router (architecture définie dans le projet).

*Alternative écartée : props drilling depuis App.tsx — inutilement complexe pour deux vues.*

### D2 — Logique métier dans des hooks custom
Les calculs KPI et le filtre Focus Mode sont extraits dans des hooks dédiés :
- `useKPIs()` → `{ revenuSecurise, pipelineActif, repartitionParStatut }`
- `useFocusRows()` → `CRMRow[]` filtrées selon les critères urgence/stagnation

*Rationale : sépare la logique de l'affichage, facilite les tests unitaires futurs.*

### D3 — Recharts PieChart pour la répartition par statut
Un `PieChart` Recharts affiche la répartition du montant par statut dans `ExecutiveView`. Simple à intégrer, déjà dans la stack prévue.

*Alternative écartée : BarChart — moins lisible pour une répartition en pourcentage.*

### D4 — Table HTML native avec Tailwind pour FocusModeView
La table des contacts urgents utilise une `<table>` HTML stylée avec Tailwind plutôt qu'un composant Shadcn complexe. Les données sont en lecture seule, pas de tri ni pagination pour le MVP.

*Alternative écartée : Shadcn DataTable avec TanStack — surcharge non justifiée pour le MVP.*

### D5 — Critères Focus Mode calculés à la date du jour
`useFocusRows` compare les dates avec `new Date()` au moment du rendu. Pas de cache ni de mémoïsation forcée pour le MVP — Zustand garantit l'immutabilité des rows.

## Risks / Trade-offs

- **Recharts non installé** → À installer lors de l'implémentation (`npm install recharts`)
- **Dates sans timezone** : les comparaisons de dates YYYY-MM-DD sont faites en local — acceptable pour un usage solo interne
- **Performance** : `useFocusRows` recalcule à chaque rendu ; acceptable jusqu'à ~10 000 lignes (PapaParse streaming prévu en V2)
- **Libellés de statut en français avec accents** : comparaisons `includes("gagné")` sensibles à la casse — documenté et cohérent avec le schéma défini
