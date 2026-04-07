## 1. Hooks de données

- [x] 1.1 Créer `src/hooks/useFunnelData.ts` : compter les deals par statut dans l'ordre du pipeline (hors "perdu"), retourner `{ name, value }[]`
- [x] 1.2 Créer `src/hooks/useCashflowData.ts` : agréger les montantDeal des deals actifs par mois sur les 6 prochains mois, retourner `{ mois, montant }[]`

## 2. Graphique Funnel

- [x] 2.1 Ajouter le `BarChart` horizontal dans `ExecutiveView` avec les données de `useFunnelData`
- [x] 2.2 Colorer chaque barre selon le statut (couleurs cohérentes avec le PieChart existant)
- [x] 2.3 Afficher le nombre de deals en label sur chaque barre

## 3. Graphique Trésorerie

- [x] 3.1 Ajouter l'`AreaChart` dans `ExecutiveView` avec les données de `useCashflowData`
- [x] 3.2 Formater l'axe Y en euros (`toLocaleString('fr-FR')`)
- [x] 3.3 Formater l'axe X avec le nom du mois en français (ex : "Mai 2026")
- [x] 3.4 Gérer l'état vide (aucun deal avec dueDate future) avec un message explicite

## 4. Mise en page ExecutiveView

- [x] 4.1 Réorganiser `ExecutiveView` : KPI cards en haut, puis les 3 graphiques (PieChart, Funnel, Trésorerie) sur une grille lisible

## 5. Vérification

- [x] 5.1 Tester avec `crm_prospects_demo.csv` : funnel et courbe affichés correctement
- [x] 5.2 Vérifier la responsivité des nouveaux graphiques avec le skill `webapp-testing`
