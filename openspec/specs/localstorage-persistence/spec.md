## ADDED Requirements

### Requirement: Restauration automatique au démarrage
L'application SHALL restaurer automatiquement les données du dernier import depuis le LocalStorage au démarrage, sans action de l'utilisateur.

#### Scenario: Données présentes en cache
- **WHEN** l'utilisateur ouvre ou recharge l'application et que des données existent dans le LocalStorage
- **THEN** le dashboard s'affiche directement avec les données restaurées, sans passer par l'ImportView

#### Scenario: Aucune donnée en cache
- **WHEN** l'utilisateur ouvre l'application pour la première fois ou après avoir vidé les données
- **THEN** l'ImportView s'affiche normalement

### Requirement: Sauvegarde automatique après import
L'application SHALL sauvegarder automatiquement les données dans le LocalStorage après chaque import CSV réussi.

#### Scenario: Import réussi
- **WHEN** l'utilisateur importe un fichier CSV valide et que `store.setRows(rows)` est appelé
- **THEN** les données sont immédiatement persistées dans le LocalStorage

#### Scenario: Remplacement des données
- **WHEN** l'utilisateur effectue un nouvel import (après "Nouvel import")
- **THEN** les nouvelles données remplacent les anciennes dans le LocalStorage

### Requirement: Suppression du cache
L'application SHALL permettre à l'utilisateur de vider les données du cache LocalStorage.

#### Scenario: Vider les données
- **WHEN** l'utilisateur clique sur "Nouvel import" depuis le dashboard
- **THEN** `store.clearRows()` est appelé, le cache LocalStorage est vidé, et l'ImportView est affichée
