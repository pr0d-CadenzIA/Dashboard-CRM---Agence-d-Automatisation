## ADDED Requirements

### Requirement: Icônes sur les onglets de navigation
Les onglets de navigation SHALL afficher une icône Lucide à gauche du label textuel pour différencier visuellement les deux vues.

#### Scenario: Icône Vue Executive
- **WHEN** le header est affiché
- **THEN** l'onglet "Vue Executive" affiche l'icône `BarChart2` à gauche du texte

#### Scenario: Icône Focus Mode
- **WHEN** le header est affiché
- **THEN** l'onglet "Focus Mode" affiche l'icône `Target` à gauche du texte

### Requirement: Bouton retour à l'import avec icône
Le bouton "Nouvel import" SHALL afficher une icône `Upload` à gauche du texte et être stylisé comme un bouton secondaire discret.

#### Scenario: Bouton identifiable
- **WHEN** le dashboard est affiché
- **THEN** le bouton "Nouvel import" est visible avec une icône et un contour léger (variant outline)

### Requirement: Hiérarchie visuelle du header en deux lignes
Le header SHALL séparer visuellement la zone d'identité (titre + badge contacts) de la zone de navigation (onglets) sur deux lignes distinctes.

#### Scenario: Ligne identité
- **WHEN** le header est affiché
- **THEN** la première ligne contient le titre "Dashboard Agence CadenzIA", le badge avec le nombre de contacts, et le bouton "Nouvel import" aligné à droite

#### Scenario: Ligne navigation
- **WHEN** le header est affiché
- **THEN** la deuxième ligne contient uniquement les onglets de navigation
