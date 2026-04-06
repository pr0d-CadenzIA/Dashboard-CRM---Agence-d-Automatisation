import { useMemo } from "react"
import { useCRMStore } from "@/store/crmStore"

export interface KPIData {
  revenuSecurise: number
  pipelineActif: number
  repartitionParStatut: { name: string; value: number }[]
}

export function useKPIs(): KPIData {
  const rows = useCRMStore((state) => state.rows)

  return useMemo(() => {
    const revenuSecurise = rows
      .filter((r) => r.status.includes("gagné"))
      .reduce((sum, r) => sum + r.montantDeal, 0)

    const pipelineActif = rows
      .filter((r) => !r.status.includes("gagné") && r.status !== "perdu")
      .reduce((sum, r) => sum + r.montantDeal, 0)

    // Agrégation par statut pour le PieChart
    const byStatus = new Map<string, number>()
    for (const row of rows) {
      byStatus.set(row.status, (byStatus.get(row.status) ?? 0) + row.montantDeal)
    }
    const repartitionParStatut = Array.from(byStatus.entries())
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))

    return { revenuSecurise, pipelineActif, repartitionParStatut }
  }, [rows])
}
