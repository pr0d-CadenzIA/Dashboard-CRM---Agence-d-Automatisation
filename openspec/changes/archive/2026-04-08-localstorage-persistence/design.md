## Context

Le store Zustand actuel (`useCRMStore`) est un store en mémoire pure — les données disparaissent au rechargement. Zustand fournit un middleware `persist` qui sérialise l'état dans le LocalStorage sans changer l'API du store.

## Goals / Non-Goals

**Goals:**
- Persister `rows` dans le LocalStorage sous une clé dédiée
- Restaurer les données au démarrage sans action utilisateur
- Permettre de vider le cache manuellement

**Non-Goals:**
- Persister d'autres états (vue active, filtres)
- Gérer les conflits entre onglets
- Migrer automatiquement les données si `CRMRow` évolue

## Decisions

### D1 — Zustand `persist` middleware
Zustand 4.x inclut `persist` dans `zustand/middleware`. Il suffit de wrapper le store existant. Zéro dépendance supplémentaire.

```ts
import { persist } from "zustand/middleware"

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({ ... }),
    { name: "crm-dashboard-data" }
  )
)
```

*Alternative écartée : `localStorage.setItem` manuel dans `setRows` — fragile, duplique la logique.*

### D2 — Clé de stockage : `"crm-dashboard-data"`
Clé explicite et préfixée pour éviter les collisions avec d'autres apps sur le même domaine.

### D3 — Persister uniquement `rows`, pas les actions
Le middleware `persist` sérialise par défaut tout l'état. On utilise `partialize` pour n'inclure que `rows` (les fonctions ne sont pas sérialisables de toute façon).

### D4 — `clearRows` vide aussi le LocalStorage
`clearRows()` remet `rows` à `[]`, ce qui déclenche la mise à jour du cache automatiquement via le middleware. Pas de logique supplémentaire nécessaire.

## Risks / Trade-offs

- **Quota LocalStorage** : ~5 Mo par origine. Un CSV de 10 000 lignes peut approcher la limite — hors scope MVP, documenté
- **Données obsolètes** : si le schéma `CRMRow` change en V2, les données en cache seront incompatibles → l'utilisateur devra re-importer. Acceptable pour le MVP.
- **Sécurité** : les données sont en clair dans le LocalStorage — acceptable pour un usage solo interne
