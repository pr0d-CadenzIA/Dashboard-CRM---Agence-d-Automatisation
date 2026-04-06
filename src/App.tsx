import { Toaster } from "@/components/ui/toaster"
import { ImportView } from "@/views/ImportView"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useCRMStore } from "@/store/crmStore"

export default function App() {
  const rows = useCRMStore((state) => state.rows)

  return (
    <>
      {rows.length === 0 ? <ImportView /> : <DashboardLayout />}
      <Toaster />
    </>
  )
}
