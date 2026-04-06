# Architecture Technique — CRM Dashboard

## Principes fondamentaux

- **100% Frontend** : aucun serveur, aucune base de données. Les données vivent en mémoire React le temps de la session.
- **Utilisateur unique** : pas d'authentification, pas de gestion multi-utilisateurs.
- **Phasage** : l'architecture est pensée pour évoluer vers un SaaS (Phase 3) sans réécriture.

---

## Stack Technique

| Couche | Technologie | Version cible |
|---|---|---|
| Build / Dev | Vite | ^5.x |
| Framework UI | React | ^18.x |
| Typage | TypeScript | ^5.x |
| Routing | Rendu conditionnel (store) | — |
| Styling | Tailwind CSS | ^3.x |
| Composants UI | Shadcn UI | latest |
| Graphiques | Recharts | ^2.x |
| Parsing CSV | PapaParse | ^5.x |
| State global | Zustand | ^4.x |

---

## Architecture de l'application

### Structure des vues

```
App  (route unique "/")
├── ImportView         — affiché si store.rows est vide
└── DashboardLayout    — affiché si store.rows contient des données
    ├── ExecutiveView  — KPIs (Revenu Sécurisé, Pipeline Actif)
    └── FocusModeView  — Table filtrée des actions urgentes
```

**Stratégie de navigation** : rendu conditionnel basé sur l'état du store. Pas de changement d'URL. `clearRows()` ramène automatiquement à l'ImportView. React Router n'est pas nécessaire pour le MVP.

### Flux de données

```
Fichier CSV (local)
  → PapaParse (parsing, dynamicTyping: true pour montantDeal)
  → Mapping colonnes CSV → CRMRow (voir table ci-dessous)
  → Validation : présence des 10 colonnes + champs critiques (Status, Montant Deal)
  → Toast d'erreur Shadcn si champ critique vide ou invalide (import bloqué)
  → Zustand Store (state global)
  → Composants React (lecture seule)
```

### Mapping colonnes CSV → TypeScript

| Colonne CSV | Champ TypeScript | Transformation |
|---|---|---|
| `Task Name` | `taskName` | string brut |
| `Status` | `status` | string brut (cast en `DealStatus`) |
| `Date Created` | `dateCreated` | string YYYY-MM-DD |
| `Due Date` | `dueDate` | string YYYY-MM-DD — peut être vide (`""`) |
| `Start Date` | `startDate` | string YYYY-MM-DD — peut être vide (`""`) |
| `Assignees` | `assignees` | string brut |
| `Priority` | `priority` | string brut (cast en `Priority`) |
| `Tags` | `tags` | `split("\|")` → `string[]` |
| `Task Content` | `taskContent` | string brut |
| `Montant Deal` | `montantDeal` | `Number()` via `dynamicTyping: true` |

### Validation à l'import

- **Bloquant** : le fichier doit contenir les 10 colonnes attendues (vérification par nom exact). Si absentes → toast d'erreur, import rejeté.
- **Alertes non-bloquantes** : lignes où `Status` ou `Montant Deal` sont vides ou invalides → toast d'avertissement listant les lignes concernées, import accepté.
- **`dueDate` vide** : les lignes sans due date sont exclues du filtre Urgence (pas d'erreur).

### Store Zustand

Le store contient une seule slice pour le MVP :

```ts
interface CRMStore {
  rows: CRMRow[]         // données parsées du CSV
  setRows: (rows: CRMRow[]) => void
  clearRows: () => void
}
```

### Schéma de données (`CRMRow`)

```ts
interface CRMRow {
  taskName: string        // "Prénom Nom - Nom Entreprise"
  status: DealStatus      // prospect | qualifié | négociation | gagné - en cours | perdu
  dateCreated: string     // YYYY-MM-DD
  dueDate: string         // YYYY-MM-DD
  startDate: string       // YYYY-MM-DD
  assignees: string
  priority: Priority      // low | medium | high
  tags: string[]          // split sur "|"
  taskContent: string
  montantDeal: number
}

type DealStatus = 'prospect' | 'qualifié' | 'négociation' | 'gagné - en cours' | 'perdu'
type Priority = 'low' | 'medium' | 'high'
```

---

## Logique métier

### KPIs (ExecutiveView)

- **Revenu Sécurisé** : `SUM(montantDeal)` où `status.includes("gagné")` — correspondance par substring, pas par valeur exacte
- **Pipeline Actif** : `SUM(montantDeal)` où `!status.includes("gagné") && status !== "perdu"` — exclut tout statut contenant "gagné", quelle qu'en soit la forme

### Filtres Focus Mode (FocusModeView)

Une ligne apparaît si **au moins un** des critères est rempli :

- **Urgence** : `dueDate` est échue ou dans les 2 prochains jours
- **Stagnation** : `priority === "high"` ET `(today - dateCreated) > 15 jours`

### Extraction du nom d'entreprise

```ts
const getCompanyName = (taskName: string) =>
  taskName.split(' - ')[1]?.trim() ?? taskName
```

---

## Conventions de code

- Composants : PascalCase, un composant par fichier
- Hooks custom préfixés `use` (ex: `useCRMStore`, `useFocusRows`)
- Types et interfaces dans `src/types/crm.ts`
- Pas de `any` — typage strict activé (`strict: true` dans `tsconfig`)

---

## Évolution vers les phases suivantes

| Phase | Changement requis |
|---|---|
| **V1** — Persistance | Ajouter middleware Zustand `persist` → LocalStorage |
| **V1** — Validation in-app | Ajouter une vue de sas entre import et dashboard |
| **V2** — Backend SaaS | Remplacer `setRows` par des queries Supabase ; store inchangé |
| **V2** — Auth | Ajouter une couche auth en entrée d'app, sans toucher aux vues métier |
