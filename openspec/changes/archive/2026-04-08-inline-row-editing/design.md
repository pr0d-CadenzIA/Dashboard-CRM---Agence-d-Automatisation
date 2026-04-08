## Context

Le store Zustand expose `rows: CRMRow[]` en lecture seule. Pour permettre l'édition inline, il faut ajouter une action `updateRow` qui met à jour une ligne par index. Le middleware `persist` existant propagera automatiquement les modifications au LocalStorage.

## Goals / Non-Goals

**Goals:**
- Édition inline de `status`, `priority`, `dueDate`, `montantDeal` dans FocusModeView
- Modifications persistées automatiquement via le store
- UX fluide : clic sur la cellule → champ éditable, blur/Enter → confirmation

**Non-Goals:**
- Validation complexe (formats de date, montants négatifs)
- Undo/redo
- Édition depuis d'autres vues

## Decisions

### D1 — `updateRow(index, patch)` dans le store
Action minimale qui merge un patch partiel sur la ligne à l'index donné. Immuable : crée un nouveau tableau.

```ts
updateRow: (index: number, patch: Partial<CRMRow>) =>
  set((state) => {
    const rows = [...state.rows]
    rows[index] = { ...rows[index], ...patch }
    return { rows }
  })
```

*Alternative écartée : identifier par `taskName` — risque de doublons, index plus simple.*

### D2 — Cellules éditables avec éléments natifs
- `status` → `<select>` avec les 5 valeurs de `DealStatus`
- `priority` → `<select>` avec `low | medium | high`
- `dueDate` → `<input type="date">`
- `montantDeal` → `<input type="number">`

Pas de librairie supplémentaire. Les éléments natifs sont accessibles et fonctionnels.

### D3 — Édition au clic, confirmation au blur ou Enter
La cellule affiche la valeur en lecture par défaut. Un clic passe en mode édition (état local `editingCell: { rowIndex, field } | null`). Le blur ou Enter confirme et appelle `updateRow`.

### D4 — Indicateur de ligne modifiée
Un point de couleur (badge) sur la ligne indique qu'elle a été modifiée depuis l'import. Comparaison simple avec les données originales non conservées — on ajoute un champ `_modified?: boolean` dans le patch.

## Risks / Trade-offs

- **Index instable** : si `useFocusRows` re-filtre les rows, l'index dans `focusRows` ≠ index dans `store.rows`. Il faut retrouver l'index original dans `store.rows` au moment de l'update.
- **dueDate vide après édition** : si l'utilisateur vide la date, la ligne sort du filtre Focus Mode — comportement attendu.
