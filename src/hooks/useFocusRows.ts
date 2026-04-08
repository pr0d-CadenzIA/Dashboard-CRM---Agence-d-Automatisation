import { useMemo } from "react"
import { useCRMStore } from "@/store/crmStore"
import type { CRMRow } from "@/types/crm"

export type FocusReason = "urgent" | "stagnation" | "urgent+stagnation"

export interface FocusRow {
  row: CRMRow
  reason: FocusReason
  storeIndex: number  // index original dans store.rows pour updateRow
}

const DAY_MS = 24 * 60 * 60 * 1000

function toDateOnly(dateStr: string): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

export function useFocusRows(): FocusRow[] {
  const rows = useCRMStore((state) => state.rows)

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const inTwoDays = new Date(today.getTime() + 2 * DAY_MS)

    const result: FocusRow[] = []

    rows.forEach((row, storeIndex) => {
      const dueDate = toDateOnly(row.dueDate)
      const dateCreated = toDateOnly(row.dateCreated)

      const isUrgent = dueDate !== null && dueDate <= inTwoDays
      const isStagnant =
        row.priority === "high" &&
        dateCreated !== null &&
        today.getTime() - dateCreated.getTime() > 15 * DAY_MS

      if (isUrgent && isStagnant) {
        result.push({ row, reason: "urgent+stagnation", storeIndex })
      } else if (isUrgent) {
        result.push({ row, reason: "urgent", storeIndex })
      } else if (isStagnant) {
        result.push({ row, reason: "stagnation", storeIndex })
      }
    })

    // Tri : urgent d'abord, puis par dueDate croissante
    result.sort((a, b) => {
      const aDate = toDateOnly(a.row.dueDate)
      const bDate = toDateOnly(b.row.dueDate)
      if (aDate && bDate) return aDate.getTime() - bDate.getTime()
      if (aDate) return -1
      if (bDate) return 1
      return 0
    })

    return result
  }, [rows])
}
