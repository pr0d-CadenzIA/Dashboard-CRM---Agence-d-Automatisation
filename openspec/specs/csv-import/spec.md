## ADDED Requirements

### Requirement: File selection
L'application SHALL afficher un bouton ou une zone de dépôt permettant à l'utilisateur de sélectionner un fichier CSV depuis son système de fichiers local.

#### Scenario: Affichage de l'ImportView
- **WHEN** l'application démarre et que le store ne contient aucune donnée (`rows.length === 0`)
- **THEN** l'`ImportView` est affichée avec un contrôle de sélection de fichier CSV

#### Scenario: Sélection d'un fichier CSV valide
- **WHEN** l'utilisateur sélectionne un fichier `.csv` via le contrôle
- **THEN** le parsing démarre immédiatement sans action supplémentaire

### Requirement: Column validation
L'application SHALL valider que le fichier CSV contient exactement les 10 colonnes obligatoires avant tout import.

Les colonnes obligatoires sont : `Task Name`, `Status`, `Date Created`, `Due Date`, `Start Date`, `Assignees`, `Priority`, `Tags`, `Task Content`, `Montant Deal`.

#### Scenario: Colonnes manquantes
- **WHEN** le fichier CSV ne contient pas toutes les colonnes obligatoires
- **THEN** un toast d'erreur est affiché indiquant les colonnes manquantes
- **THEN** le store n'est pas modifié et l'`ImportView` reste affichée

#### Scenario: Toutes les colonnes présentes
- **WHEN** le fichier CSV contient les 10 colonnes obligatoires
- **THEN** le parsing des lignes se poursuit

### Requirement: Data parsing and mapping
L'application SHALL parser chaque ligne du CSV et la transformer en objet `CRMRow` typé selon le schéma défini.

#### Scenario: Parsing d'une ligne valide
- **WHEN** une ligne contient des valeurs valides pour toutes les colonnes
- **THEN** elle est mappée en `CRMRow` avec `montantDeal` converti en `number` et `tags` splittés sur `"|"`

#### Scenario: Tags multiples
- **WHEN** la colonne `Tags` contient des valeurs séparées par `"|"` (ex: `"Consulting|Urgent"`)
- **THEN** `tags` est un tableau de strings : `["Consulting", "Urgent"]`

#### Scenario: Valeur `Montant Deal` invalide
- **WHEN** `Montant Deal` est vide ou non-numérique
- **THEN** `montantDeal` est défini à `0` et un toast d'avertissement est affiché
- **THEN** la ligne est tout de même incluse dans l'import

#### Scenario: Valeur `Status` invalide
- **WHEN** `Status` n'est pas une valeur reconnue parmi les valeurs autorisées
- **THEN** un toast d'avertissement est affiché
- **THEN** la ligne est tout de même incluse dans l'import avec le status tel quel

### Requirement: Store population
L'application SHALL injecter les `CRMRow[]` parsées dans le store Zustand (`CRMStore`) et déclencher la navigation vers le dashboard.

#### Scenario: Import réussi sans avertissement
- **WHEN** toutes les lignes sont parsées sans erreur bloquante
- **THEN** `store.setRows(rows)` est appelé avec les données parsées
- **THEN** l'application affiche automatiquement le `DashboardLayout`

#### Scenario: Import réussi avec avertissements
- **WHEN** l'import réussit mais des avertissements ont été émis
- **THEN** le store est alimenté et la navigation vers le dashboard se déclenche
- **THEN** les toasts d'avertissement sont visibles pendant la transition

### Requirement: User feedback
L'application SHALL informer l'utilisateur du résultat de l'import via des notifications visuelles (toasts).

#### Scenario: Toast d'erreur bloquante
- **WHEN** l'import est rejeté (colonnes manquantes)
- **THEN** un toast de type `error` est affiché avec un message explicite listant les colonnes manquantes

#### Scenario: Toast d'avertissement non-bloquant
- **WHEN** des valeurs invalides sont détectées mais l'import peut continuer
- **THEN** un toast de type `warning` est affiché indiquant le nombre de lignes concernées
