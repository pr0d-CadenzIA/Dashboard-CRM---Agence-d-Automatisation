## Why

Le dashboard CRM ne peut afficher aucune donnée sans mécanisme d'injection. L'import CSV est le point d'entrée unique du MVP : sans lui, aucune des vues (ExecutiveView, FocusModeView) ne peut fonctionner. C'est la fondation sur laquelle repose toute l'application.

## What Changes

- Ajout d'une vue `ImportView` affichée au démarrage quand `store.rows` est vide
- Parsing des fichiers CSV via PapaParse avec validation des 10 colonnes obligatoires
- Alimentation du store Zustand (`CRMStore`) avec les données parsées et typées (`CRMRow[]`)
- Affichage de toasts d'erreur (colonnes manquantes) et d'avertissement (valeurs invalides)
- Transition automatique vers `DashboardLayout` après import réussi

## Capabilities

### New Capabilities

- `csv-import`: Sélection, parsing, validation et chargement d'un fichier CSV local dans le store Zustand

### Modified Capabilities

*(aucune — premier composant du projet)*

## Impact

- **Nouveaux fichiers** : `src/views/ImportView.tsx`, `src/store/crmStore.ts`, `src/types/crm.ts`
- **Dépendances** : PapaParse (déjà prévu dans la stack), Zustand, Shadcn UI (toast, card, button)
- **Point d'entrée** : `App.tsx` — rendu conditionnel basé sur `store.rows.length`

## Hors-périmètre

- Authentification ou contrôle d'accès
- Import depuis une URL ou un stockage cloud
- Persistance des données entre sessions (localStorage, backend)
- Import de formats autres que CSV
