## ADDED Requirements

### Requirement: Courbe de trésorerie prévisionnelle
L'application SHALL afficher un graphique en aire représentant la somme des `montantDeal` des deals actifs, agrégée par mois selon leur `dueDate`, sur les 6 prochains mois.

#### Scenario: Agrégation mensuelle
- **WHEN** des deals actifs (non gagné, non perdu) ont une `dueDate` dans les 6 prochains mois
- **THEN** leurs montants sont sommés par mois et affichés sur le graphique

#### Scenario: Mois sans deal
- **WHEN** aucun deal actif n'a de `dueDate` dans un mois donné
- **THEN** ce mois apparaît sur l'axe avec une valeur de 0

#### Scenario: Exclusion des deals sans dueDate
- **WHEN** un deal actif a `dueDate = ""`
- **THEN** il n'est pas inclus dans la projection (sans erreur)

#### Scenario: Exclusion des dueDate passées
- **WHEN** un deal actif a une `dueDate` antérieure à aujourd'hui
- **THEN** il n'est pas inclus dans la projection des 6 prochains mois
