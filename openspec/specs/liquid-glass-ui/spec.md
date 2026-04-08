## ADDED Requirements

### Requirement: Fond global ambiant
L'application SHALL afficher un fond avec dégradé ambiant animé donnant une impression de profondeur.

#### Scenario: Blobs de couleur
- **WHEN** n'importe quelle vue est affichée
- **THEN** des blobs de couleur pastel très floutés sont visibles en arrière-plan et s'animent lentement

#### Scenario: Respect de prefers-reduced-motion
- **WHEN** le système de l'utilisateur a activé la réduction de mouvement
- **THEN** les animations des blobs sont désactivées

### Requirement: Surfaces en verre dépoli
L'application SHALL afficher les cards, le header et les panneaux avec un effet de verre translucide (backdrop-blur + transparence).

#### Scenario: Cards en verre
- **WHEN** une Card Shadcn UI est affichée (ExecutiveView, ImportView)
- **THEN** elle présente un fond semi-transparent avec flou d'arrière-plan et bordure lumineuse

#### Scenario: Header translucide
- **WHEN** le DashboardLayout est affiché
- **THEN** le header est translucide avec effet backdrop-blur

### Requirement: Lisibilité préservée
L'application SHALL maintenir un contraste suffisant pour tous les textes sur les surfaces en verre.

#### Scenario: Texte lisible sur verre
- **WHEN** du texte est affiché sur une surface en verre
- **THEN** il reste lisible sans halo ni flou parasite
