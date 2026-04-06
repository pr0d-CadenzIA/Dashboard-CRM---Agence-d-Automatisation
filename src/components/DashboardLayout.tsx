import { useState } from "react"
import { useCRMStore } from "@/store/crmStore"
import { ExecutiveView } from "@/views/ExecutiveView"
import { FocusModeView } from "@/views/FocusModeView"

type ActiveView = "executive" | "focus"

export function DashboardLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("executive")
  const { rows, clearRows } = useCRMStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">CRM Dashboard</h1>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {rows.length} contact{rows.length > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={clearRows}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Nouvel import
            </button>
          </div>

          {/* Onglets */}
          <nav className="mt-4 flex gap-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeView === "executive"}
              onClick={() => setActiveView("executive")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeView === "executive"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Vue Executive
            </button>
            <button
              role="tab"
              aria-selected={activeView === "focus"}
              onClick={() => setActiveView("focus")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeView === "focus"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
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
