import Papa from "papaparse"
import type { CRMRow, DealStatus, Priority } from "@/types/crm"

const REQUIRED_COLUMNS = [
  "Task Name",
  "Status",
  "Date Created",
  "Due Date",
  "Start Date",
  "Assignees",
  "Priority",
  "Tags",
  "Task Content",
  "Montant Deal",
] as const

const VALID_STATUSES: DealStatus[] = [
  "prospect",
  "qualifié",
  "négociation",
  "gagné - en cours",
  "perdu",
]

const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"]

export interface ParseResult {
  rows: CRMRow[]
  warnings: string[]
}

export interface ParseError {
  missingColumns: string[]
}

export function parseCSV(file: File): Promise<ParseResult | { error: ParseError }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      delimiter: "",
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? []

        // 2.2 — Validation des colonnes obligatoires
        const missingColumns = REQUIRED_COLUMNS.filter(
          (col) => !headers.includes(col)
        )
        if (missingColumns.length > 0) {
          resolve({ error: { missingColumns } })
          return
        }

        const rows: CRMRow[] = []
        const warnings: string[] = []
        const invalidMontantLines: number[] = []
        const invalidStatusLines: number[] = []

        // 2.3 — Mapping ligne CSV → CRMRow
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(results.data as any[]).forEach((raw, index) => {
          const lineNum = index + 2 // +2 : header = ligne 1

          // Montant Deal : default 0 si invalide
          let montantDeal: number
          const rawMontant = raw["Montant Deal"]
          if (rawMontant === null || rawMontant === undefined || rawMontant === "" || isNaN(Number(rawMontant))) {
            montantDeal = 0
            invalidMontantLines.push(lineNum)
          } else {
            montantDeal = Number(rawMontant)
          }

          // Status : avertissement si invalide
          const rawStatus = String(raw["Status"] ?? "").trim()
          if (!VALID_STATUSES.includes(rawStatus as DealStatus)) {
            invalidStatusLines.push(lineNum)
          }

          // Priority : garde la valeur telle quelle si invalide
          const rawPriority = String(raw["Priority"] ?? "").trim().toLowerCase()
          const priority: Priority = VALID_PRIORITIES.includes(rawPriority as Priority)
            ? (rawPriority as Priority)
            : "medium"

          // Tags : split sur "|"
          const rawTags = String(raw["Tags"] ?? "")
          const tags = rawTags ? rawTags.split("|").map((t) => t.trim()).filter(Boolean) : []

          rows.push({
            taskName: String(raw["Task Name"] ?? ""),
            status: rawStatus as DealStatus,
            dateCreated: String(raw["Date Created"] ?? ""),
            dueDate: String(raw["Due Date"] ?? ""),
            startDate: String(raw["Start Date"] ?? ""),
            assignees: String(raw["Assignees"] ?? ""),
            priority,
            tags,
            taskContent: String(raw["Task Content"] ?? ""),
            montantDeal,
          })
        })

        // 2.4 — Construction des avertissements
        if (invalidMontantLines.length > 0) {
          warnings.push(
            `Montant Deal vide ou invalide sur ${invalidMontantLines.length} ligne(s) (lignes ${invalidMontantLines.join(", ")}) — valeur par défaut 0 appliquée.`
          )
        }
        if (invalidStatusLines.length > 0) {
          warnings.push(
            `Status non reconnu sur ${invalidStatusLines.length} ligne(s) (lignes ${invalidStatusLines.join(", ")}) — valeur conservée telle quelle.`
          )
        }

        resolve({ rows, warnings })
      },
      error: () => {
        resolve({ error: { missingColumns: [] } })
      },
    })
  })
}
