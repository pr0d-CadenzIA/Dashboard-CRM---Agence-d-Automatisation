import { useFocusRows, type FocusReason } from "@/hooks/useFocusRows"

function getCompanyName(taskName: string): string {
  return taskName.split(" - ")[1]?.trim() ?? taskName
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("fr-FR")
}

function formatEur(value: number): string {
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

const PRIORITY_LABELS: Record<string, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
}

const PRIORITY_CLASSES: Record<string, string> = {
  high: "text-red-700 bg-red-50",
  medium: "text-yellow-700 bg-yellow-50",
  low: "text-gray-600 bg-gray-50",
}

const STATUS_CLASSES: Record<string, string> = {
  "prospect": "text-gray-600 bg-gray-100",
  "qualifié": "text-blue-700 bg-blue-50",
  "négociation": "text-amber-700 bg-amber-50",
  "gagné - en cours": "text-green-700 bg-green-50",
  "perdu": "text-red-700 bg-red-50",
}

function ReasonBadge({ reason }: { reason: FocusReason }) {
  if (reason === "urgent+stagnation") {
    return (
      <span className="inline-flex gap-1">
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Urgent</span>
        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Stagnation</span>
      </span>
    )
  }
  if (reason === "urgent") {
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Urgent</span>
  }
  return <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Stagnation</span>
}

export function FocusModeView() {
  const focusRows = useFocusRows()

  if (focusRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
        <p className="text-lg font-medium text-gray-700">Aucune action urgente</p>
        <p className="mt-1 text-sm text-gray-400">
          Tous vos contacts sont dans les délais et sans stagnation détectée.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Échéance</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3">Critère</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {focusRows.map(({ row, reason }, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {getCompanyName(row.taskName)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.status] ?? "text-gray-600 bg-gray-100"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASSES[row.priority] ?? "text-gray-600 bg-gray-50"}`}>
                    {PRIORITY_LABELS[row.priority] ?? row.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(row.dueDate)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatEur(row.montantDeal)}
                </td>
                <td className="px-4 py-3">
                  <ReasonBadge reason={reason} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-400">
        {focusRows.length} contact{focusRows.length > 1 ? "s" : ""} nécessitant une action
      </div>
    </div>
  )
}
