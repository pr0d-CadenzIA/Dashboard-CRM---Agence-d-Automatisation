## 1. Refonte de la ligne d'identité

- [x] 1.1 Ajouter l'import des icônes `Upload` depuis `lucide-react` dans `DashboardLayout.tsx`
- [x] 1.2 Restructurer le header en deux lignes : ligne identité (titre + badge + bouton retour) et ligne navigation (onglets)
- [x] 1.3 Remplacer le bouton "← Nouvel import" par un bouton avec icône `Upload` et style outline discret

## 2. Refonte des onglets de navigation

- [x] 2.1 Ajouter les imports des icônes `BarChart2` et `Target` depuis `lucide-react`
- [x] 2.2 Ajouter l'icône `BarChart2` à gauche du label "Vue Executive" dans l'onglet correspondant
- [x] 2.3 Ajouter l'icône `Target` à gauche du label "Focus Mode" dans l'onglet correspondant
- [x] 2.4 Affiner le style de l'onglet actif (pill ou indicateur de soulignement avec transition douce)

## 3. Vérification et test

- [x] 3.1 Vérifier le rendu responsive (mobile, tablette, desktop)
- [x] 3.2 Tester la navigation entre les deux vues reste fonctionnelle
- [x] 3.3 Tester le bouton "Nouvel import" déclenche bien `clearRows()`
- [x] 3.4 Valider l'affichage du badge contacts dans la nouvelle structure
