## Why

Le header/nav actuel est fonctionnel mais manque de hiérarchie visuelle et de polish professionnel. La navigation par onglets ressemble à des boutons génériques, le lien "Nouvel import" est peu visible, et l'ensemble ne reflète pas le niveau de qualité attendu d'un outil CRM inspiré de HubSpot/Salesforce.

## What Changes

- Refonte visuelle du header avec une hiérarchie typographique claire (logo/marque + badge contacts mieux intégrés)
- Remplacement des onglets texte par une navigation à onglets stylisée avec icônes (BarChart2 pour Vue Executive, Target pour Focus Mode)
- Bouton "Nouvel import" remplacé par un bouton secondaire discret mais identifiable (icône + texte)
- Ajout d'un séparateur visuel clair entre la zone identité et la zone navigation
- Animation de transition douce sur l'onglet actif (indicateur de soulignement ou pill animée)

## Capabilities

### New Capabilities

Aucune nouvelle capability — il s'agit d'une amélioration visuelle d'une capability existante.

### Modified Capabilities

- `dashboard-layout` : l'affichage du header et de la navigation change visuellement (icônes, styles, hiérarchie), sans modifier les exigences comportementales (navigation entre vues, compteur de contacts, retour à l'import restent inchangés)

## Impact

- `src/components/DashboardLayout.tsx` : seul fichier modifié
- Dépendance `lucide-react` déjà présente dans le projet (icônes)
- Aucun changement d'API, de store, ni de logique métier
- Hors-périmètre : refonte des vues ExecutiveView et FocusModeView
