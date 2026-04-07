import { useMemo } from "react"
import { useCRMStore } from "@/store/crmStore"

export interface CashflowEntry {
  mois: string       // "Avr 2026"
  montant: number
  isoMonth: string   // "2026-04" pour le tri
}

export function useCashflowData(): CashflowEntry[] {
  const rows = useCRMStore((state) => state.rows)

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Générer les 6 prochains mois (mois courant inclus)
    const months: CashflowEntry[] = []
    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const isoMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const mois = d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
      months.push({ mois: mois.charAt(0).toUpperCase() + mois.slice(1), montant: 0, isoMonth })
    }

    const monthMap = new Map(months.map((m) => [m.isoMonth, m]))

    for (const row of rows) {
      // Deals actifs uniquement
      if (row.status.includes("gagné") || row.status === "perdu") continue
      if (!row.dueDate) continue

      const due = new Date(row.dueDate)
      if (isNaN(due.getTime()) || due < today) continue

      const isoMonth = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}`
      const entry = monthMap.get(isoMonth)
      if (entry) entry.montant += row.montantDeal
    }

    return months
  }, [rows])
}
