import { create } from "zustand"
import type { CRMRow } from "@/types/crm"

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
