## 1. Store

- [x] 1.1 Modifier `src/store/crmStore.ts` : wrapper le store avec le middleware `persist` de Zustand, clé `"crm-dashboard-data"`, `partialize` sur `rows` uniquement

## 2. Vérification

- [x] 2.1 Tester : importer un CSV, recharger la page → le dashboard s'affiche directement avec les données
- [x] 2.2 Tester : cliquer "Nouvel import" → retour à l'ImportView, LocalStorage vidé, rechargement confirme le cache vide
- [x] 2.3 Vérifier avec le skill `webapp-testing` que le comportement est correct après rechargement
