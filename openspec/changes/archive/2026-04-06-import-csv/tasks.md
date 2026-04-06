## 1. Types et store

- [x] 1.1 Créer `src/types/crm.ts` avec les types `DealStatus`, `Priority` et l'interface `CRMRow`
- [x] 1.2 Créer `src/store/crmStore.ts` avec la slice Zustand `CRMStore` (`rows`, `setRows`)

## 2. Logique de parsing et validation

- [x] 2.1 Créer `src/lib/csvParser.ts` : fonction de parsing PapaParse avec `dynamicTyping: true` et auto-détection du délimiteur
- [x] 2.2 Implémenter la validation des 10 colonnes obligatoires (retourne les colonnes manquantes)
- [x] 2.3 Implémenter le mapping ligne CSV → `CRMRow` (split tags sur `"|"`, default `montantDeal` à `0`)
- [x] 2.4 Retourner un objet `{ rows, warnings }` permettant de distinguer erreurs bloquantes et avertissements

## 3. Composant ImportView

- [x] 3.1 Créer `src/views/ImportView.tsx` avec un input file HTML acceptant `.csv`
- [x] 3.2 Ajouter un état de chargement local (`useState`) pendant le parsing
- [x] 3.3 Brancher le handler `onChange` : appel `csvParser`, gestion des erreurs bloquantes (toast error + abort)
- [x] 3.4 En cas d'avertissements non-bloquants, afficher des toasts warning avant la transition
- [x] 3.5 Appeler `store.setRows(rows)` pour déclencher la navigation vers le dashboard

## 4. Intégration App.tsx

- [x] 4.1 Modifier `App.tsx` pour afficher `ImportView` si `store.rows.length === 0`, sinon `DashboardLayout` (placeholder)
- [x] 4.2 Vérifier que la transition ImportView → DashboardLayout fonctionne après un import réussi

## 5. Vérification et tests

- [x] 5.1 Tester avec un CSV valide (10 colonnes, données complètes) → import réussi, navigation vers dashboard
- [x] 5.2 Tester avec un CSV à colonnes manquantes → toast d'erreur, pas de navigation
- [x] 5.3 Tester avec un CSV à `Montant Deal` vide → toast d'avertissement, import accepté
- [x] 5.4 Vérifier la responsivité de l'`ImportView` avec le skill `webapp-testing`
