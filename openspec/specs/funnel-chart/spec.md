## ADDED Requirements

### Requirement: Funnel de conversion par statut
L'application SHALL afficher un graphique en barres horizontales représentant le nombre de deals par statut, dans l'ordre du pipeline commercial.

#### Scenario: Affichage du funnel
- **WHEN** `ExecutiveView` est affiché et que des données sont présentes
- **THEN** un graphique horizontal affiche les statuts dans l'ordre : prospect, qualifié, négociation, gagné - en cours
- **THEN** chaque barre représente le nombre de deals dans ce statut

#### Scenario: Exclusion des deals perdus
- **WHEN** des lignes avec `status = "perdu"` existent dans le store
- **THEN** elles n'apparaissent pas dans le funnel de conversion

#### Scenario: Statut absent
- **WHEN** aucun deal n'existe pour un statut donné (ex: aucun deal "qualifié")
- **THEN** ce statut apparaît quand même avec une valeur de 0
