## ADDED Requirements

### Requirement: Édition inline des champs d'une ligne
L'application SHALL permettre d'éditer les champs `status`, `priority`, `dueDate` et `montantDeal` d'une ligne directement dans le tableau du Focus Mode.

#### Scenario: Activation de l'édition
- **WHEN** l'utilisateur clique sur une cellule éditable (status, priority, dueDate, montantDeal)
- **THEN** la cellule passe en mode édition (input ou select natif visible)

#### Scenario: Confirmation par blur
- **WHEN** l'utilisateur quitte le champ en cliquant ailleurs ou appuie sur Enter
- **THEN** la valeur est sauvegardée dans le store et la cellule repasse en mode lecture

#### Scenario: Persistance automatique
- **WHEN** une modification est confirmée
- **THEN** elle est immédiatement reflétée dans le store Zustand et persistée en LocalStorage

### Requirement: Champs éditables par type
L'application SHALL adapter le contrôle d'édition au type du champ.

#### Scenario: Édition du statut
- **WHEN** l'utilisateur clique sur la cellule Statut
- **THEN** un `<select>` affiche les 5 valeurs de `DealStatus` : prospect, qualifié, négociation, gagné - en cours, perdu

#### Scenario: Édition de la priorité
- **WHEN** l'utilisateur clique sur la cellule Priorité
- **THEN** un `<select>` affiche les 3 valeurs : low, medium, high

#### Scenario: Édition de la date d'échéance
- **WHEN** l'utilisateur clique sur la cellule Échéance
- **THEN** un `<input type="date">` est affiché avec la valeur actuelle

#### Scenario: Édition du montant
- **WHEN** l'utilisateur clique sur la cellule Montant
- **THEN** un `<input type="number">` est affiché avec la valeur actuelle

### Requirement: Indicateur de ligne modifiée
L'application SHALL indiquer visuellement les lignes modifiées depuis l'import.

#### Scenario: Ligne modifiée
- **WHEN** une ligne a été modifiée via l'édition inline
- **THEN** un indicateur visuel (point ou badge) est affiché sur cette ligne
