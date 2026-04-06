## ADDED Requirements

### Requirement: KPI Revenu Sécurisé
L'application SHALL calculer et afficher le Revenu Sécurisé comme la somme des `montantDeal` dont le `status` contient la sous-chaîne `"gagné"`.

#### Scenario: Calcul correct
- **WHEN** des lignes avec `status = "gagné - en cours"` existent dans le store
- **THEN** leurs `montantDeal` sont inclus dans le Revenu Sécurisé

#### Scenario: Exclusion des autres statuts
- **WHEN** des lignes avec `status = "prospect"`, `"qualifié"`, `"négociation"` ou `"perdu"` existent
- **THEN** leurs `montantDeal` ne sont pas inclus dans le Revenu Sécurisé

#### Scenario: Affichage formaté
- **WHEN** le Revenu Sécurisé est calculé
- **THEN** il est affiché en euros avec séparateur de milliers (ex : "18 500 €")

### Requirement: KPI Pipeline Actif
L'application SHALL calculer et afficher le Pipeline Actif comme la somme des `montantDeal` dont le `status` ne contient pas `"gagné"` et n'est pas `"perdu"`.

#### Scenario: Calcul correct
- **WHEN** des lignes avec `status = "prospect"`, `"qualifié"` ou `"négociation"` existent
- **THEN** leurs `montantDeal` sont inclus dans le Pipeline Actif

#### Scenario: Exclusion du perdu et du gagné
- **WHEN** des lignes avec `status = "perdu"` ou `status.includes("gagné")` existent
- **THEN** leurs `montantDeal` ne sont pas inclus dans le Pipeline Actif

### Requirement: Graphique de répartition par statut
L'application SHALL afficher un graphique circulaire (PieChart Recharts) représentant la répartition du montant total par statut.

#### Scenario: Affichage du graphique
- **WHEN** `ExecutiveView` est affiché et que des données sont présentes
- **THEN** un PieChart est rendu avec une entrée par statut présent dans les données

#### Scenario: Données vides
- **WHEN** toutes les lignes ont `montantDeal = 0`
- **THEN** le graphique affiche un message ou un état vide sans erreur
