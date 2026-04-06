## ADDED Requirements

### Requirement: Navigation entre vues
L'application SHALL afficher un shell de navigation permettant de basculer entre `ExecutiveView` et `FocusModeView` via deux onglets.

#### Scenario: Affichage par défaut
- **WHEN** le store contient des données (`rows.length > 0`) et que le dashboard est affiché
- **THEN** l'onglet "Vue Executive" est actif par défaut et `ExecutiveView` est rendu

#### Scenario: Bascule vers Focus Mode
- **WHEN** l'utilisateur clique sur l'onglet "Focus Mode"
- **THEN** `FocusModeView` est rendu et l'onglet "Focus Mode" est visuellement actif

#### Scenario: Retour à l'import
- **WHEN** l'utilisateur clique sur "Nouvel import"
- **THEN** `store.clearRows()` est appelé et l'`ImportView` est affichée

### Requirement: Affichage du nombre de contacts
Le dashboard SHALL afficher le nombre total de contacts importés dans le header.

#### Scenario: Compteur visible
- **WHEN** le dashboard est affiché
- **THEN** le nombre de lignes du store est visible dans le header (ex : "25 contacts")
