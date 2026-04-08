## 1. Store

- [x] 1.1 Ajouter `updateRow(index: number, patch: Partial<CRMRow> & { _modified?: boolean })` dans `src/store/crmStore.ts`

## 2. FocusModeView — édition inline

- [x] 2.1 Ajouter l'état local `editingCell: { rowIdx: number; field: string } | null` dans `FocusModeView`
- [x] 2.2 Implémenter la cellule Statut éditable : clic → `<select>` avec les 5 valeurs de `DealStatus`, blur/change → `updateRow`
- [x] 2.3 Implémenter la cellule Priorité éditable : `<select>` low/medium/high
- [x] 2.4 Implémenter la cellule Échéance éditable : `<input type="date">`, blur → `updateRow`
- [x] 2.5 Implémenter la cellule Montant éditable : `<input type="number">`, blur/Enter → `updateRow`
- [x] 2.6 Retrouver l'index original dans `store.rows` à partir de la ligne filtrée pour appeler `updateRow` correctement

## 3. Indicateur visuel

- [x] 3.1 Ajouter un champ `_modified?: boolean` dans le patch `updateRow` et afficher un point coloré sur les lignes modifiées

## 4. Vérification

- [x] 4.1 Tester : modifier le statut d'une ligne → valeur mise à jour dans la table, persistée après rechargement
- [x] 4.2 Tester : modifier la dueDate pour la mettre dans le futur lointain → la ligne disparaît du Focus Mode
- [x] 4.3 Vérifier avec le skill `webapp-testing`
