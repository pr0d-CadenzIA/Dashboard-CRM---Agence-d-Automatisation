import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CRMRow } from "@/types/crm"

interface CRMStore {
  rows: CRMRow[]
  setRows: (rows: CRMRow[]) => void
  clearRows: () => void
  updateRow: (index: number, patch: Partial<CRMRow> & { _modified?: boolean }) => void
}

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({
      rows: [],
      setRows: (rows) => set({ rows }),
      clearRows: () => set({ rows: [] }),
      updateRow: (index, patch) =>
        set((state) => {
          const rows = [...state.rows]
          rows[index] = { ...rows[index], ...patch }
          return { rows }
        }),
    }),
    {
      name: "crm-dashboard-data",
      partialize: (state) => ({ rows: state.rows }),
    }
  )
)
