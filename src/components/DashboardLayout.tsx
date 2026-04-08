import { useState } from "react"
import { BarChart2, Target, Upload } from "lucide-react"
import { useCRMStore } from "@/store/crmStore"
import { ExecutiveView } from "@/views/ExecutiveView"
import { FocusModeView } from "@/views/FocusModeView"

type ActiveView = "executive" | "focus"

export function DashboardLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("executive")
  const { rows, clearRows } = useCRMStore()

  return (
    <div className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/60 glass-card">
        <div className="mx-auto max-w-6xl px-6 py-4">
          {/* Ligne 1 : identité + bouton retour */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Agence CadenzIA</h1>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {rows.length} contact{rows.length > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={clearRows}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              <Upload className="h-3.5 w-3.5" />
              Nouvel import
            </button>
          </div>

          {/* Ligne 2 : navigation */}
          <nav className="mt-3 flex gap-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeView === "executive"}
              onClick={() => setActiveView("executive")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeView === "executive"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-white/60 hover:text-gray-800"
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              Vue Executive
            </button>
            <button
              role="tab"
              aria-selected={activeView === "focus"}
              onClick={() => setActiveView("focus")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeView === "focus"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-white/60 hover:text-gray-800"
              }`}
            >
              <Target className="h-4 w-4" />
              Focus Mode
            </button>
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeView === "executive" ? <ExecutiveView /> : <FocusModeView />}
      </main>
    </div>
  )
}
