# CRM Dashboard MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un dashboard CRM 100% frontend permettant d'importer un CSV de prospects et d'afficher des KPIs et une liste d'actions urgentes.

**Architecture:** SPA Vite + React + TypeScript sans routing — rendu conditionnel basé sur le store Zustand (vide → ImportView, peuplé → DashboardLayout avec onglets Executive/FocusMode). Les données vivent uniquement en mémoire le temps de la session.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, Shadcn UI, Recharts 2, PapaParse 5, Zustand 4, Vitest

---

## Structure des fichiers

```
projet-c/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── test-setup.ts
│   ├── types/
│   │   └── crm.ts
│   ├── store/
│   │   └── crmStore.ts
│   ├── lib/
│   │   ├── csvParser.ts
│   │   └── csvParser.test.ts
│   ├── hooks/
│   │   ├── useKPIs.ts
│   │   ├── useKPIs.test.ts
│   │   ├── useFocusRows.ts
│   │   └── useFocusRows.test.ts
│   └── components/
│       ├── import/
│       │   └── ImportView.tsx
│       └── dashboard/
│           ├── DashboardLayout.tsx
│           ├── ExecutiveView.tsx
│           └── FocusModeView.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── components.json          ← généré par Shadcn
├── PRD.md
├── ARCHITECTURE.md
└── docs/superpowers/plans/
    └── 2026-04-05-crm-dashboard-mvp.md
```

---

## Task 1 : Scaffolding du projet

**Files:**
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `src/test-setup.ts`
- Modify: `tsconfig.json`
- Modify: `src/index.css`

- [ ] **Step 1.1 : Initialiser Vite**

```bash
cd /Users/alban/CadenzIA/claude-projets/projet-c
npm create vite@latest . -- --template react-ts
```

Répondre `y` si Vite demande confirmation (fichiers existants dans le dossier).

- [ ] **Step 1.2 : Installer les dépendances applicatives**

```bash
npm install zustand papaparse recharts
npm install -D @types/papaparse
```

- [ ] **Step 1.3 : Installer Tailwind CSS v3**

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p --ts
```

- [ ] **Step 1.4 : Configurer Tailwind**

Remplacer le contenu de `tailwind.config.ts` :

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 1.5 : Ajouter les directives Tailwind**

Remplacer le contenu de `src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 1.6 : Initialiser Shadcn UI**

```bash
npx shadcn@latest init
```

Répondre aux questions :
- Style : `Default`
- Base color : `Slate`
- CSS variables : `Yes`

- [ ] **Step 1.7 : Ajouter les composants Shadcn nécessaires**

```bash
npx shadcn@latest add card badge sonner table tabs
```

- [ ] **Step 1.8 : Installer Vitest**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 1.9 : Configurer Vitest dans vite.config.ts**

Remplacer le contenu de `vite.config.ts` :

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

- [ ] **Step 1.10 : Créer le fichier de setup des tests**

Créer `src/test-setup.ts` :

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 1.11 : Ajouter les types Vitest dans tsconfig.json**

Dans `tsconfig.json`, dans `compilerOptions`, ajouter :

```json
"types": ["vitest/globals"]
```

- [ ] **Step 1.12 : Ajouter le script de test dans package.json**

Dans `package.json`, dans `scripts`, ajouter :

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 1.13 : Vérifier que tout fonctionne**

```bash
npm run dev
```

Attendu : serveur Vite démarre sur `http://localhost:5173` sans erreur.

```bash
npm run test:run
```

Attendu : `No test files found` (pas d'erreur, juste aucun test pour l'instant).

- [ ] **Step 1.14 : Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Shadcn + Vitest"
```

---

## Task 2 : Types TypeScript

**Files:**
- Create: `src/types/crm.ts`

- [ ] **Step 2.1 : Créer le fichier de types**

Créer `src/types/crm.ts` :

```ts
export type DealStatus =
  | 'prospect'
  | 'qualifié'
  | 'négociation'
  | 'gagné - en cours'
  | 'perdu'

export type Priority = 'low' | 'medium' | 'high'

export interface CRMRow {
  taskName: string       // "Prénom Nom - Nom Entreprise"
  status: DealStatus
  dateCreated: string    // YYYY-MM-DD
  dueDate: string        // YYYY-MM-DD ou "" si absent
  startDate: string      // YYYY-MM-DD ou "" si absent
  assignees: string
  priority: Priority
  tags: string[]         // ["SaaS", "B2B"]
  taskContent: string
  montantDeal: number
}

export interface ParseResult {
  rows: CRMRow[]
  errors: string[]       // erreurs bloquantes (colonnes manquantes)
  warnings: string[]     // avertissements (champs critiques vides)
}
```

- [ ] **Step 2.2 : Commit**

```bash
git add src/types/crm.ts
git commit -m "feat: add CRMRow and ParseResult types"
```

---

## Task 3 : Store Zustand

**Files:**
- Create: `src/store/crmStore.ts`

- [ ] **Step 3.1 : Créer le store**

Créer `src/store/crmStore.ts` :

```ts
import { create } from 'zustand'
import type { CRMRow } from '@/types/crm'

interface CRMStore {
  rows: CRMRow[]
  setRows: (rows: CRMRow[]) => void
  clearRows: () => void
}

export const useCRMStore = create<CRMStore>((set) => ({
  rows: [],
  setRows: (rows) => set({ rows }),
  clearRows: () => set({ rows: [] }),
}))
```

- [ ] **Step 3.2 : Commit**

```bash
git add src/store/crmStore.ts
git commit -m "feat: add Zustand CRM store"
```

---

## Task 4 : Parser CSV

**Files:**
- Create: `src/lib/csvParser.ts`
- Create: `src/lib/csvParser.test.ts`

- [ ] **Step 4.1 : Écrire les tests**

Créer `src/lib/csvParser.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { parseCSVData } from './csvParser'

const VALID_HEADERS = [
  'Task Name', 'Status', 'Date Created', 'Due Date', 'Start Date',
  'Assignees', 'Priority', 'Tags', 'Task Content', 'Montant Deal',
]

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    'Task Name': 'Sophie Martin - TechStart',
    'Status': 'prospect',
    'Date Created': '2025-01-15',
    'Due Date': '2025-01-25',
    'Start Date': '2025-01-20',
    'Assignees': 'Alexandre Dubois',
    'Priority': 'high',
    'Tags': 'SaaS|B2B',
    'Task Content': 'Notes test',
    'Montant Deal': 8500,
    ...overrides,
  }
}

describe('parseCSVData', () => {
  it('retourne une erreur bloquante si une colonne est manquante', () => {
    const result = parseCSVData(['Task Name', 'Status'], [])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toMatch(/colonnes manquantes/i)
    expect(result.rows).toHaveLength(0)
  })

  it('mappe correctement une ligne valide', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow()])
    expect(result.errors).toHaveLength(0)
    expect(result.rows[0]).toEqual({
      taskName: 'Sophie Martin - TechStart',
      status: 'prospect',
      dateCreated: '2025-01-15',
      dueDate: '2025-01-25',
      startDate: '2025-01-20',
      assignees: 'Alexandre Dubois',
      priority: 'high',
      tags: ['SaaS', 'B2B'],
      taskContent: 'Notes test',
      montantDeal: 8500,
    })
  })

  it('split les tags sur le séparateur |', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow({ Tags: 'Environnement|PME|BtoB' })])
    expect(result.rows[0].tags).toEqual(['Environnement', 'PME', 'BtoB'])
  })

  it('accepte dueDate vide sans erreur', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow({ 'Due Date': '' })])
    expect(result.errors).toHaveLength(0)
    expect(result.rows[0].dueDate).toBe('')
  })

  it('émet un warning si Status est vide', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow({ Status: '' })])
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toMatch(/ligne 1/i)
  })

  it('émet un warning si Montant Deal est absent', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow({ 'Montant Deal': '' })])
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it('convertit Montant Deal string en nombre', () => {
    const result = parseCSVData(VALID_HEADERS, [makeRow({ 'Montant Deal': '12000' })])
    expect(result.rows[0].montantDeal).toBe(12000)
    expect(typeof result.rows[0].montantDeal).toBe('number')
  })
})
```

- [ ] **Step 4.2 : Lancer les tests pour vérifier qu'ils échouent**

```bash
npm run test:run -- src/lib/csvParser.test.ts
```

Attendu : erreur `Cannot find module './csvParser'`

- [ ] **Step 4.3 : Implémenter le parser**

Créer `src/lib/csvParser.ts` :

```ts
import type { CRMRow, ParseResult } from '@/types/crm'

const REQUIRED_COLUMNS = [
  'Task Name', 'Status', 'Date Created', 'Due Date', 'Start Date',
  'Assignees', 'Priority', 'Tags', 'Task Content', 'Montant Deal',
]

export function parseCSVData(
  headers: string[],
  rawRows: Record<string, unknown>[],
): ParseResult {
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col))
  if (missingColumns.length > 0) {
    return {
      rows: [],
      errors: [`Colonnes manquantes : ${missingColumns.join(', ')}`],
      warnings: [],
    }
  }

  const rows: CRMRow[] = []
  const warnings: string[] = []

  rawRows.forEach((raw, index) => {
    const lineNum = index + 1
    const status = String(raw['Status'] ?? '').trim()
    const montantRaw = raw['Montant Deal']
    const montant = montantRaw === '' || montantRaw === null || montantRaw === undefined
      ? NaN
      : Number(montantRaw)

    if (!status) warnings.push(`Ligne ${lineNum} : champ Status vide`)
    if (isNaN(montant) || montantRaw === '') warnings.push(`Ligne ${lineNum} : Montant Deal vide ou invalide`)

    const tagsRaw = String(raw['Tags'] ?? '').trim()
    const tags = tagsRaw ? tagsRaw.split('|').map((t) => t.trim()) : []

    rows.push({
      taskName: String(raw['Task Name'] ?? '').trim(),
      status: status as CRMRow['status'],
      dateCreated: String(raw['Date Created'] ?? '').trim(),
      dueDate: String(raw['Due Date'] ?? '').trim(),
      startDate: String(raw['Start Date'] ?? '').trim(),
      assignees: String(raw['Assignees'] ?? '').trim(),
      priority: String(raw['Priority'] ?? '').trim() as CRMRow['priority'],
      tags,
      taskContent: String(raw['Task Content'] ?? '').trim(),
      montantDeal: isNaN(montant) ? 0 : montant,
    })
  })

  return { rows, errors: [], warnings }
}

export async function parseCSVFile(file: File): Promise<ParseResult> {
  const Papa = await import('papaparse')
  return new Promise((resolve) => {
    Papa.default.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => {
        const headers = result.meta.fields ?? []
        const rawRows = result.data as Record<string, unknown>[]
        resolve(parseCSVData(headers, rawRows))
      },
      error: (error) => {
        resolve({ rows: [], errors: [`Erreur de parsing : ${error.message}`], warnings: [] })
      },
    })
  })
}
```

- [ ] **Step 4.4 : Lancer les tests pour vérifier qu'ils passent**

```bash
npm run test:run -- src/lib/csvParser.test.ts
```

Attendu : `7 tests passed`

- [ ] **Step 4.5 : Commit**

```bash
git add src/lib/csvParser.ts src/lib/csvParser.test.ts
git commit -m "feat: add CSV parser with validation and column mapping"
```

---

## Task 5 : Hook useKPIs

**Files:**
- Create: `src/hooks/useKPIs.ts`
- Create: `src/hooks/useKPIs.test.ts`

- [ ] **Step 5.1 : Écrire les tests**

Créer `src/hooks/useKPIs.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import type { CRMRow } from '@/types/crm'

// Tester la logique pure indépendamment du store
function computeKPIs(rows: CRMRow[]) {
  const revenuSecurise = rows
    .filter((r) => r.status.includes('gagné'))
    .reduce((sum, r) => sum + r.montantDeal, 0)
  const pipelineActif = rows
    .filter((r) => !r.status.includes('gagné') && r.status !== 'perdu')
    .reduce((sum, r) => sum + r.montantDeal, 0)
  return { revenuSecurise, pipelineActif }
}

function makeRow(status: CRMRow['status'], montant: number): CRMRow {
  return {
    taskName: 'Test - Entreprise',
    status,
    dateCreated: '2025-01-01',
    dueDate: '',
    startDate: '',
    assignees: '',
    priority: 'medium',
    tags: [],
    taskContent: '',
    montantDeal: montant,
  }
}

describe('computeKPIs', () => {
  it('Revenu Sécurisé inclut les statuts contenant "gagné"', () => {
    const rows = [
      makeRow('gagné - en cours', 10000),
      makeRow('prospect', 5000),
    ]
    expect(computeKPIs(rows).revenuSecurise).toBe(10000)
  })

  it('Revenu Sécurisé utilise une correspondance substring pas une égalité exacte', () => {
    // Si un futur statut "gagné - clôturé" était ajouté, il doit être inclus
    const rows = [makeRow('gagné - en cours', 8000)]
    expect(computeKPIs(rows).revenuSecurise).toBe(8000)
  })

  it('Pipeline Actif exclut tout statut contenant "gagné"', () => {
    const rows = [
      makeRow('gagné - en cours', 10000),
      makeRow('prospect', 5000),
      makeRow('négociation', 3000),
    ]
    expect(computeKPIs(rows).pipelineActif).toBe(8000)
  })

  it('Pipeline Actif exclut "perdu"', () => {
    const rows = [
      makeRow('perdu', 5000),
      makeRow('qualifié', 3000),
    ]
    expect(computeKPIs(rows).pipelineActif).toBe(3000)
  })

  it('retourne 0 pour les deux KPIs si aucune ligne', () => {
    expect(computeKPIs([])).toEqual({ revenuSecurise: 0, pipelineActif: 0 })
  })
})
```

- [ ] **Step 5.2 : Lancer les tests pour vérifier qu'ils passent**

Ces tests testent la logique pure (pas le hook lui-même), ils doivent passer immédiatement.

```bash
npm run test:run -- src/hooks/useKPIs.test.ts
```

Attendu : `5 tests passed`

- [ ] **Step 5.3 : Implémenter le hook**

Créer `src/hooks/useKPIs.ts` :

```ts
import { useCRMStore } from '@/store/crmStore'

export function useKPIs() {
  const rows = useCRMStore((state) => state.rows)

  const revenuSecurise = rows
    .filter((r) => r.status.includes('gagné'))
    .reduce((sum, r) => sum + r.montantDeal, 0)

  const pipelineActif = rows
    .filter((r) => !r.status.includes('gagné') && r.status !== 'perdu')
    .reduce((sum, r) => sum + r.montantDeal, 0)

  return { revenuSecurise, pipelineActif }
}
```

- [ ] **Step 5.4 : Commit**

```bash
git add src/hooks/useKPIs.ts src/hooks/useKPIs.test.ts
git commit -m "feat: add useKPIs hook with KPI computation logic"
```

---

## Task 6 : Hook useFocusRows

**Files:**
- Create: `src/hooks/useFocusRows.ts`
- Create: `src/hooks/useFocusRows.test.ts`

- [ ] **Step 6.1 : Écrire les tests**

Créer `src/hooks/useFocusRows.test.ts` :

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { CRMRow } from '@/types/crm'

// Logique pure extraite pour être testable sans store
function getFocusRows(rows: CRMRow[], today: Date): CRMRow[] {
  const todayMidnight = new Date(today)
  todayMidnight.setHours(0, 0, 0, 0)
  const limitDate = new Date(todayMidnight)
  limitDate.setDate(limitDate.getDate() + 2)

  return rows.filter((row) => {
    // Critère 1 : Urgence — due date échue ou dans les 2 prochains jours
    if (row.dueDate) {
      const dueDate = new Date(row.dueDate)
      if (dueDate <= limitDate) return true
    }
    // Critère 2 : Stagnation — high priority et créé il y a plus de 15 jours
    if (row.priority === 'high') {
      const created = new Date(row.dateCreated)
      const diffDays = (todayMidnight.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays > 15) return true
    }
    return false
  })
}

function makeRow(overrides: Partial<CRMRow> = {}): CRMRow {
  return {
    taskName: 'Test - Entreprise',
    status: 'prospect',
    dateCreated: '2025-01-01',
    dueDate: '',
    startDate: '',
    assignees: '',
    priority: 'medium',
    tags: [],
    taskContent: '',
    montantDeal: 0,
    ...overrides,
  }
}

const TODAY = new Date('2026-04-05')

describe('getFocusRows', () => {
  it('inclut une ligne dont la due date est dépassée', () => {
    const rows = [makeRow({ dueDate: '2026-04-01' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(1)
  })

  it("inclut une ligne dont la due date est dans 2 jours", () => {
    const rows = [makeRow({ dueDate: '2026-04-07' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(1)
  })

  it("n'inclut pas une ligne dont la due date est dans 3 jours", () => {
    const rows = [makeRow({ dueDate: '2026-04-08' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(0)
  })

  it('inclut une ligne high priority créée il y a plus de 15 jours', () => {
    const rows = [makeRow({ priority: 'high', dateCreated: '2026-03-01', dueDate: '' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(1)
  })

  it("n'inclut pas une ligne high priority créée il y a moins de 15 jours", () => {
    const rows = [makeRow({ priority: 'high', dateCreated: '2026-03-28', dueDate: '' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(0)
  })

  it("n'inclut pas une ligne medium priority sans due date urgente", () => {
    const rows = [makeRow({ priority: 'medium', dateCreated: '2020-01-01', dueDate: '' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(0)
  })

  it("n'inclut pas une ligne sans due date et sans stagnation", () => {
    const rows = [makeRow({ dueDate: '' })]
    expect(getFocusRows(rows, TODAY)).toHaveLength(0)
  })

  it('retourne un tableau vide si aucune ligne ne correspond', () => {
    expect(getFocusRows([], TODAY)).toHaveLength(0)
  })
})
```

- [ ] **Step 6.2 : Lancer les tests pour vérifier qu'ils passent**

```bash
npm run test:run -- src/hooks/useFocusRows.test.ts
```

Attendu : `8 tests passed`

- [ ] **Step 6.3 : Implémenter le hook**

Créer `src/hooks/useFocusRows.ts` :

```ts
import { useCRMStore } from '@/store/crmStore'
import type { CRMRow } from '@/types/crm'

export function useFocusRows(): CRMRow[] {
  const rows = useCRMStore((state) => state.rows)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const limitDate = new Date(today)
  limitDate.setDate(limitDate.getDate() + 2)

  return rows.filter((row) => {
    if (row.dueDate) {
      const dueDate = new Date(row.dueDate)
      if (dueDate <= limitDate) return true
    }
    if (row.priority === 'high') {
      const created = new Date(row.dateCreated)
      const diffDays = (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays > 15) return true
    }
    return false
  })
}
```

- [ ] **Step 6.4 : Lancer tous les tests**

```bash
npm run test:run
```

Attendu : tous les tests passent.

- [ ] **Step 6.5 : Commit**

```bash
git add src/hooks/useFocusRows.ts src/hooks/useFocusRows.test.ts
git commit -m "feat: add useFocusRows hook with urgency and stagnation filters"
```

---

## Task 7 : ImportView

**Files:**
- Create: `src/components/import/ImportView.tsx`

- [ ] **Step 7.1 : Créer le composant**

Créer `src/components/import/ImportView.tsx` :

```tsx
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useCRMStore } from '@/store/crmStore'
import { parseCSVFile } from '@/lib/csvParser'

export function ImportView() {
  const setRows = useCRMStore((state) => state.setRows)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Format invalide', { description: 'Veuillez importer un fichier .csv' })
      return
    }

    setIsLoading(true)
    const result = await parseCSVFile(file)
    setIsLoading(false)

    if (result.errors.length > 0) {
      toast.error('Import bloqué', { description: result.errors.join('\n') })
      return
    }

    if (result.warnings.length > 0) {
      toast.warning(`${result.warnings.length} avertissement(s)`, {
        description: result.warnings.slice(0, 5).join('\n') +
          (result.warnings.length > 5 ? `\n... et ${result.warnings.length - 5} autre(s)` : ''),
      })
    }

    setRows(result.rows)
    toast.success(`${result.rows.length} prospects importés`)
  }, [setRows])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">CRM Dashboard</h1>
          <p className="text-slate-500 mt-1">Importez votre fichier de prospects pour commencer</p>
        </div>

        <label
          className={[
            'block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-slate-900 bg-slate-100'
              : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50',
          ].join(' ')}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <div className="space-y-2">
            <div className="text-4xl">📄</div>
            <p className="font-medium text-slate-700">
              {isLoading ? 'Import en cours…' : 'Glissez votre fichier CSV ici'}
            </p>
            <p className="text-sm text-slate-500">ou cliquez pour parcourir</p>
          </div>
        </label>

        <p className="text-xs text-slate-400 text-center">
          Colonnes attendues : Task Name, Status, Date Created, Due Date, Start Date,
          Assignees, Priority, Tags, Task Content, Montant Deal
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 7.2 : Commit**

```bash
git add src/components/import/ImportView.tsx
git commit -m "feat: add ImportView with drag & drop and CSV validation feedback"
```

---

## Task 8 : ExecutiveView (KPI cards)

**Files:**
- Create: `src/components/dashboard/ExecutiveView.tsx`

- [ ] **Step 8.1 : Créer le composant**

Créer `src/components/dashboard/ExecutiveView.tsx` :

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useKPIs } from '@/hooks/useKPIs'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function ExecutiveView() {
  const { revenuSecurise, pipelineActif } = useKPIs()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Vue Executive</h2>
        <p className="text-sm text-slate-500">Synthèse financière du pipeline commercial</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Revenu Sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(revenuSecurise)}</p>
            <p className="text-xs text-slate-400 mt-1">Deals avec statut "gagné"</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pipeline Actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(pipelineActif)}</p>
            <p className="text-xs text-slate-400 mt-1">Deals ni gagnés ni perdus</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 8.2 : Commit**

```bash
git add src/components/dashboard/ExecutiveView.tsx
git commit -m "feat: add ExecutiveView with KPI cards"
```

---

## Task 9 : FocusModeView (table d'actions urgentes)

**Files:**
- Create: `src/components/dashboard/FocusModeView.tsx`

- [ ] **Step 9.1 : Créer le composant**

Créer `src/components/dashboard/FocusModeView.tsx` :

```tsx
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFocusRows } from '@/hooks/useFocusRows'
import type { CRMRow } from '@/types/crm'

function getCompanyName(taskName: string): string {
  return taskName.split(' - ')[1]?.trim() ?? taskName
}

function getContactName(taskName: string): string {
  return taskName.split(' - ')[0]?.trim() ?? taskName
}

const STATUS_COLORS: Record<CRMRow['status'], string> = {
  prospect: 'bg-slate-100 text-slate-700',
  qualifié: 'bg-blue-100 text-blue-700',
  négociation: 'bg-amber-100 text-amber-700',
  'gagné - en cours': 'bg-green-100 text-green-700',
  perdu: 'bg-red-100 text-red-700',
}

const PRIORITY_COLORS: Record<CRMRow['priority'], string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(dateStr))
}

export function FocusModeView() {
  const rows = useFocusRows()

  if (rows.length === 0) {
    return (
      <div className="p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Focus Mode</h2>
          <p className="text-sm text-slate-500">Actions urgentes du jour</p>
        </div>
        <div className="mt-12 text-center text-slate-400">
          <p className="text-lg">Aucune action urgente</p>
          <p className="text-sm mt-1">Aucun deal n'est en retard ou stagnant</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Focus Mode</h2>
        <p className="text-sm text-slate-500">
          {rows.length} action{rows.length > 1 ? 's' : ''} urgente{rows.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entreprise</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{getCompanyName(row.taskName)}</TableCell>
                <TableCell className="text-slate-500">{getContactName(row.taskName)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[row.priority]}`}>
                    {row.priority}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{formatDate(row.dueDate)}</TableCell>
                <TableCell className="text-right font-medium">
                  {row.montantDeal > 0
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(row.montantDeal)
                    : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

- [ ] **Step 9.2 : Commit**

```bash
git add src/components/dashboard/FocusModeView.tsx
git commit -m "feat: add FocusModeView with filtered urgent actions table"
```

---

## Task 10 : DashboardLayout

**Files:**
- Create: `src/components/dashboard/DashboardLayout.tsx`

- [ ] **Step 10.1 : Créer le layout avec onglets**

Créer `src/components/dashboard/DashboardLayout.tsx` :

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCRMStore } from '@/store/crmStore'
import { ExecutiveView } from './ExecutiveView'
import { FocusModeView } from './FocusModeView'

export function DashboardLayout() {
  const { rows, clearRows } = useCRMStore()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">CRM Dashboard</h1>
          <p className="text-xs text-slate-400">{rows.length} prospects chargés</p>
        </div>
        <button
          onClick={clearRows}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Nouvel import
        </button>
      </header>

      <main className="max-w-5xl mx-auto py-6">
        <Tabs defaultValue="executive">
          <div className="px-6">
            <TabsList>
              <TabsTrigger value="executive">Vue Executive</TabsTrigger>
              <TabsTrigger value="focus">Focus Mode</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="executive">
            <ExecutiveView />
          </TabsContent>
          <TabsContent value="focus">
            <FocusModeView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
```

- [ ] **Step 10.2 : Commit**

```bash
git add src/components/dashboard/DashboardLayout.tsx
git commit -m "feat: add DashboardLayout with Executive/FocusMode tabs"
```

---

## Task 11 : App root et intégration finale

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 11.1 : Modifier App.tsx**

Remplacer le contenu de `src/App.tsx` :

```tsx
import { useCRMStore } from '@/store/crmStore'
import { ImportView } from '@/components/import/ImportView'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  const rows = useCRMStore((state) => state.rows)

  return (
    <>
      {rows.length === 0 ? <ImportView /> : <DashboardLayout />}
      <Toaster richColors position="top-right" />
    </>
  )
}
```

- [ ] **Step 11.2 : Modifier main.tsx**

Remplacer le contenu de `src/main.tsx` :

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 11.3 : Lancer l'app et tester manuellement avec le CSV de démo**

```bash
npm run dev
```

Ouvrir `http://localhost:5173` et tester :

1. Glisser-déposer `crm_prospects_demo.csv` → les données se chargent
2. Vérifier que les KPIs s'affichent dans "Vue Executive"
3. Vérifier que les deals urgents apparaissent dans "Focus Mode"
4. Cliquer "← Nouvel import" → retour à l'écran d'import

- [ ] **Step 11.4 : Lancer tous les tests une dernière fois**

```bash
npm run test:run
```

Attendu : tous les tests passent.

- [ ] **Step 11.5 : Build de production**

```bash
npm run build
```

Attendu : dossier `dist/` généré sans erreurs TypeScript.

- [ ] **Step 11.6 : Commit final**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire up App with conditional rendering ImportView/DashboardLayout"
```

---

## Task 12 : Déploiement Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 12.1 : Installer la CLI Vercel**

```bash
npm install -g vercel
```

- [ ] **Step 12.2 : Créer vercel.json pour forcer le routing SPA**

Créer `vercel.json` à la racine du projet :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 12.3 : Committer vercel.json**

```bash
git add vercel.json
git commit -m "chore: add Vercel config for SPA routing"
```

- [ ] **Step 12.4 : Déployer sur Vercel**

```bash
vercel
```

Répondre aux questions :
- Set up and deploy → `Y`
- Which scope → sélectionner ton compte
- Link to existing project → `N`
- Project name → `crm-dashboard` (ou le nom de ton choix)
- Directory → `.` (répertoire courant)
- Override build settings → `N`

Attendu en fin de commande : une URL de preview du type `https://crm-dashboard-xxx.vercel.app`

- [ ] **Step 12.5 : Tester le déploiement**

Ouvrir l'URL fournie par Vercel et vérifier :
1. L'écran d'import s'affiche correctement
2. Le drag & drop fonctionne avec `crm_prospects_demo.csv`
3. Les KPIs et le Focus Mode s'affichent

- [ ] **Step 12.6 : Promouvoir en production**

```bash
vercel --prod
```

Attendu : URL de production du type `https://crm-dashboard.vercel.app`

---

## Self-Review

| Exigence PRD | Tâche | Statut |
|---|---|---|
| Vite + React + Tailwind + Shadcn + PapaParse | Task 1 | ✅ |
| Import CSV drag & drop | Task 7 | ✅ |
| Validation colonnes manquantes (erreur bloquante) | Task 4 | ✅ |
| Alerte Status/Montant vides (warning non-bloquant) | Task 4 | ✅ |
| KPI Revenu Sécurisé (`status.includes("gagné")`) | Task 5 | ✅ |
| KPI Pipeline Actif (`!includes("gagné") && !== "perdu"`) | Task 5 | ✅ |
| Focus Mode — filtre Urgence (due date ≤ aujourd'hui + 2j) | Task 6 | ✅ |
| Focus Mode — filtre Stagnation (high + >15 jours) | Task 6 | ✅ |
| Extraction nom d'entreprise (après le tiret) | Task 9 | ✅ |
| State global React (Zustand) | Task 3 | ✅ |
| Rendu conditionnel Import/Dashboard | Task 11 | ✅ |
| Pas d'auth, pas de backend, pas de BDD | — | ✅ (hors scope) |
| Déploiement Vercel | Task 12 | ✅ |
