import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CRMRow } from "@/types/crm"

interface CRMStore {
  rows: CRMRow[]
  setRows: (rows: CRMRow[]) => void
  clearRows: () => void
}

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({
      rows: [],
      setRows: (rows) => set({ rows }),
      clearRows: () => set({ rows: [] }),
    }),
    {
      name: "crm-dashboard-data",
      partialize: (state) => ({ rows: state.rows }),
    }
  )
)
