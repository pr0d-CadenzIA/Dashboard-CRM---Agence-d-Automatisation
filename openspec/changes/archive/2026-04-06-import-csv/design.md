## Context

Le CRM Dashboard est une SPA 100% frontend (Vite + React + TypeScript). Il n'existe aucun backend ni persistance : toutes les données vivent en mémoire le temps de la session via un store Zustand. Le seul vecteur d'entrée de données est un fichier CSV local généré par l'outil de gestion de tâches de l'entrepreneur (ClickUp / Notion export).

L'`ImportView` est la première vue affichée au démarrage et constitue le seul point d'entrée des données dans l'application.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de sélectionner un fichier CSV local via un input file
- Parser le CSV avec PapaParse et valider la présence des 10 colonnes obligatoires
- Transformer les données brutes en `CRMRow[]` typés et les injecter dans `CRMStore`
- Informer l'utilisateur via des toasts en cas d'erreur bloquante ou d'avertissement non-bloquant
- Déclencher la transition vers `DashboardLayout` automatiquement après import réussi

**Non-Goals:**
- Persistance des données entre sessions
- Import depuis URL, cloud ou API
- Support d'autres formats (XLSX, JSON)
- Authentification ou contrôle d'accès

## Decisions

### D1 — PapaParse avec `dynamicTyping: true`
PapaParse est déjà dans la stack prévue. L'option `dynamicTyping: true` convertit automatiquement `Montant Deal` en `number`, évitant un cast manuel systématique.

*Alternative écartée : parsing manuel avec `split(',')` — trop fragile face aux virgules dans les valeurs.*

### D2 — Validation en deux niveaux (bloquant / non-bloquant)
- **Bloquant** : colonnes manquantes → toast d'erreur, import rejeté, store non modifié
- **Non-bloquant** : valeur `Status` ou `Montant Deal` vide/invalide → toast d'avertissement, ligne incluse avec valeur par défaut

*Rationale : rejeter un CSV entier pour quelques cellules vides serait pénalisant pour l'utilisateur.*

### D3 — Tags splittés sur `"|"`
La colonne `Tags` contient des valeurs séparées par `|` (convention ClickUp). Le split se fait au moment du mapping CSV → `CRMRow`, pas à l'affichage.

### D4 — Store Zustand slice unique (`CRMStore`)
Un seul store pour le MVP : `{ rows: CRMRow[], setRows: (rows: CRMRow[]) => void }`. La navigation conditionnelle dans `App.tsx` se base sur `rows.length === 0`.

### D5 — Composant `ImportView` autonome
`ImportView` gère localement son état de chargement et d'erreur (`useState`). Il appelle `store.setRows()` uniquement en cas de succès complet. Aucune logique métier dans `App.tsx`.

## Risks / Trade-offs

- **Encodage CSV** → Mitigation : PapaParse détecte l'encodage automatiquement ; documenter que UTF-8 est recommandé
- **CSV mal formé (séparateur virgule vs point-virgule)** → Mitigation : utiliser `delimiter: ""` (auto-détection PapaParse)
- **Fichiers très volumineux (>10 000 lignes)** → Mitigation : hors scope MVP, mais PapaParse supporte le streaming si nécessaire en V2
- **Noms de colonnes sensibles à la casse** → Mitigation : validation en comparaison exacte, documentée dans le message d'erreur
