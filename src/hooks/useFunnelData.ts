import { useMemo } from "react"
import { useCRMStore } from "@/store/crmStore"

const PIPELINE_ORDER = [
  "prospect",
  "qualifié",
  "négociation",
  "gagné - en cours",
] as const

const STATUS_COLORS: Record<string, string> = {
  "prospect": "#94a3b8",
  "qualifié": "#60a5fa",
  "négociation": "#f59e0b",
  "gagné - en cours": "#22c55e",
}

export interface FunnelEntry {
  name: string
  value: number
  fill: string
}

export function useFunnelData(): FunnelEntry[] {
  const rows = useCRMStore((state) => state.rows)

  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows) {
      if (row.status === "perdu") continue
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1)
    }

    return PIPELINE_ORDER.map((status) => ({
      name: status,
      value: counts.get(status) ?? 0,
      fill: STATUS_COLORS[status],
    }))
  }, [rows])
}
