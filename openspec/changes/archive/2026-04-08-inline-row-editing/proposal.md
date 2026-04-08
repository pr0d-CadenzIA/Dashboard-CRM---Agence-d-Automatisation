## Why

Le Focus Mode liste les contacts urgents mais ne permet pas d'agir sur les données. L'utilisateur doit modifier son CSV source, re-importer, et retrouver le contact. Pouvoir éditer directement le statut, la priorité, le montant ou la date d'échéance d'une ligne en place élimine cette friction et rend le dashboard opérationnel au quotidien.

## What Changes

- Chaque ligne du Focus Mode devient éditable au clic sur une cellule
- Les champs modifiables : `status`, `priority`, `dueDate`, `montantDeal`
- Les modifications sont répercutées en temps réel dans le store Zustand (et donc persistées en LocalStorage)
- Un indicateur visuel signale les lignes modifiées depuis l'import

## Capabilities

### New Capabilities

- `inline-row-editing` : Édition in-place des champs d'une ligne CRM directement dans le Focus Mode

### Modified Capabilities

- `localstorage-persistence` : Les modifications inline sont automatiquement persistées (comportement hérité du middleware persist existant — aucun changement de requirement)

## Impact

- **Fichiers modifiés** : `src/views/FocusModeView.tsx`, `src/store/crmStore.ts` (ajout `updateRow`)
- **Nouveaux composants** : cellules éditables inline (input, select natifs)
- **Dépendances** : aucune nouvelle

## Hors-périmètre

- Édition depuis l'ExecutiveView
- Ajout ou suppression de lignes
- Historique des modifications / undo
- Validation complexe des valeurs saisies
