## 1. Installation et hooks métier

- [x] 1.1 Installer Recharts : `npm install recharts @types/recharts` (ou vérifier si déjà présent)
- [x] 1.2 Créer `src/hooks/useKPIs.ts` : calcul `revenuSecurise`, `pipelineActif` et `repartitionParStatut` depuis `useCRMStore`
- [x] 1.3 Créer `src/hooks/useFocusRows.ts` : filtre Urgence (dueDate ≤ aujourd'hui+2j) et Stagnation (priority=high ET dateCreated > 15j)

## 2. DashboardLayout

- [x] 2.1 Remplacer le placeholder dans `src/App.tsx` par un import du vrai `DashboardLayout`
- [x] 2.2 Créer `src/components/DashboardLayout.tsx` avec état local `activeView: 'executive' | 'focus'`
- [x] 2.3 Ajouter les deux onglets ("Vue Executive" / "Focus Mode") et le bouton "Nouvel import" appelant `store.clearRows()`
- [x] 2.4 Afficher le compteur de contacts dans le header

## 3. ExecutiveView

- [x] 3.1 Créer `src/views/ExecutiveView.tsx` avec deux KPI cards (Revenu Sécurisé, Pipeline Actif) utilisant `useKPIs`
- [x] 3.2 Formater les montants en euros avec séparateur de milliers (`toLocaleString('fr-FR')`)
- [x] 3.3 Intégrer un `PieChart` Recharts affichant la répartition du montant par statut
- [x] 3.4 Gérer l'état vide (toutes les lignes à 0€) sans erreur

## 4. FocusModeView

- [x] 4.1 Créer `src/views/FocusModeView.tsx` avec la table utilisant `useFocusRows`
- [x] 4.2 Colonnes : Entreprise (extrait de `taskName`), Statut, Priorité, Échéance, Montant
- [x] 4.3 Afficher un message "Aucune action urgente" si la liste est vide
- [x] 4.4 Indiquer visuellement le critère déclencheur (badge "Urgent" ou "Stagnation")

## 5. Vérification et tests

- [x] 5.1 Tester avec `crm_prospects_demo.csv` : KPIs affichés correctement, PieChart visible
- [x] 5.2 Vérifier le filtre Focus Mode : contacts attendus présents selon les critères
- [x] 5.3 Tester la navigation onglets ExecutiveView ↔ FocusModeView
- [x] 5.4 Tester le retour à l'import via "Nouvel import"
- [x] 5.5 Vérifier la responsivité des deux vues avec le skill `webapp-testing`
