## ADDED Requirements

### Requirement: Filtre Urgence
L'application SHALL inclure dans la FocusModeView toute ligne dont la `dueDate` est échue ou tombe dans les 2 prochains jours calendaires (par rapport à la date du jour).

#### Scenario: Contact avec dueDate échue
- **WHEN** une ligne a une `dueDate` antérieure à aujourd'hui
- **THEN** elle apparaît dans la FocusModeView

#### Scenario: Contact avec dueDate dans 2 jours
- **WHEN** une ligne a une `dueDate` égale à aujourd'hui, demain ou après-demain
- **THEN** elle apparaît dans la FocusModeView

#### Scenario: Contact sans dueDate
- **WHEN** une ligne a `dueDate = ""`
- **THEN** elle n'est pas incluse dans le filtre Urgence (sans erreur)

### Requirement: Filtre Stagnation
L'application SHALL inclure dans la FocusModeView toute ligne dont `priority === "high"` ET dont `dateCreated` est antérieure de plus de 15 jours à la date du jour.

#### Scenario: Contact haute priorité stagnant
- **WHEN** une ligne a `priority = "high"` et `dateCreated` il y a plus de 15 jours
- **THEN** elle apparaît dans la FocusModeView

#### Scenario: Contact haute priorité récent
- **WHEN** une ligne a `priority = "high"` mais `dateCreated` il y a moins de 15 jours
- **THEN** elle n'apparaît pas dans le filtre Stagnation

#### Scenario: Contact non-high-priority ancien
- **WHEN** une ligne a `priority = "medium"` ou `"low"` même si `dateCreated` est ancienne
- **THEN** elle n'apparaît pas dans le filtre Stagnation

### Requirement: Table des contacts urgents
L'application SHALL afficher les lignes filtrées dans une table avec les colonnes : Entreprise, Statut, Priorité, Échéance, Montant.

#### Scenario: Affichage des données
- **WHEN** des lignes satisfont au moins un critère (urgence ou stagnation)
- **THEN** elles sont affichées dans la table avec le nom d'entreprise extrait de `taskName`

#### Scenario: État vide
- **WHEN** aucune ligne ne satisfait les critères de filtre
- **THEN** un message "Aucune action urgente" est affiché à la place de la table

#### Scenario: Extraction du nom d'entreprise
- **WHEN** `taskName` contient " - " (ex : "Sophie Martin - TechStart")
- **THEN** la colonne Entreprise affiche la partie après " - " (ex : "TechStart")
