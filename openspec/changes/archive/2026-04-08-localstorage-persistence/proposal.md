## Why

Actuellement, chaque rechargement de page détruit les données importées et force l'utilisateur à re-sélectionner son fichier CSV. Pour un outil de suivi quotidien, c'est une friction inutile. La persistance LocalStorage permet de retrouver ses données instantanément à chaque ouverture.

## What Changes

- Le store Zustand persiste `rows` dans le LocalStorage via le middleware `persist`
- Au démarrage, si des données sont présentes en cache, le dashboard s'affiche directement (pas d'`ImportView`)
- Un bouton "Vider les données" dans le dashboard permet de forcer le retour à l'import et d'effacer le cache

## Capabilities

### New Capabilities

- `localstorage-persistence` : Sauvegarde et restauration automatique des données CRM dans le LocalStorage

### Modified Capabilities

*(aucune — `csv-import` et `dashboard-layout` ne changent pas de comportement fonctionnel)*

## Impact

- **Fichiers modifiés** : `src/store/crmStore.ts` (ajout middleware `persist`)
- **Dépendances** : Zustand `persist` middleware — déjà inclus dans Zustand 4.x, aucun package supplémentaire
- **Taille du cache** : un CSV de 1 000 lignes ≈ 200–500 Ko en JSON — acceptable pour le LocalStorage (quota ~5 Mo)

## Hors-périmètre

- Chiffrement des données en cache
- Synchronisation entre onglets ou appareils
- Gestion de plusieurs imports sauvegardés
- Migration automatique si le schéma `CRMRow` évolue
