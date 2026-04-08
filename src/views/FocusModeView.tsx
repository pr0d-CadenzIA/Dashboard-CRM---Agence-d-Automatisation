import { useState } from "react"
import { useFocusRows, type FocusReason } from "@/hooks/useFocusRows"
import { useCRMStore } from "@/store/crmStore"
import type { DealStatus, Priority } from "@/types/crm"

const DEAL_STATUSES: DealStatus[] = [
  "prospect", "qualifié", "négociation", "gagné - en cours", "perdu",
]
const PRIORITIES: Priority[] = ["low", "medium", "high"]

const PRIORITY_LABELS: Record<string, string> = { high: "Haute", medium: "Moyenne", low: "Basse" }
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

function ReasonBadge({ reason }: { reason: FocusReason }) {
  if (reason === "urgent+stagnation") return (
    <span className="inline-flex gap-1">
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Urgent</span>
      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Stagnation</span>
    </span>
  )
  if (reason === "urgent") return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Urgent</span>
  return <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Stagnation</span>
}

type EditingCell = { rowIdx: number; field: string } | null

export function FocusModeView() {
  const focusRows = useFocusRows()
  const updateRow = useCRMStore((state) => state.updateRow)
  const [editingCell, setEditingCell] = useState<EditingCell>(null)

  const isEditing = (rowIdx: number, field: string) =>
    editingCell?.rowIdx === rowIdx && editingCell?.field === field

  const startEdit = (rowIdx: number, field: string) =>
    setEditingCell({ rowIdx, field })

  const stopEdit = () => setEditingCell(null)

  if (focusRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl glass-card py-20 text-center">
        <p className="text-lg font-medium text-gray-700">Aucune action urgente</p>
        <p className="mt-1 text-sm text-gray-400">Tous vos contacts sont dans les délais.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/40 bg-white/30 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Échéance</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3">Critère</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {focusRows.map(({ row, reason, storeIndex }, i) => (
              <tr key={i} className={`hover:bg-white/40 transition-colors ${(row as { _modified?: boolean })._modified ? "border-l-2 border-l-blue-400" : ""}`}>

                {/* Entreprise — non éditable */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {getCompanyName(row.taskName)}
                  {(row as { _modified?: boolean })._modified && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" title="Modifié" />
                  )}
                </td>

                {/* Statut */}
                <td className="px-4 py-3" onClick={() => startEdit(i, "status")}>
                  {isEditing(i, "status") ? (
                    <select
                      autoFocus
                      defaultValue={row.status}
                      onBlur={(e) => { updateRow(storeIndex, { status: e.target.value as DealStatus, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      onChange={(e) => { updateRow(storeIndex, { status: e.target.value as DealStatus, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      className="rounded border border-blue-300 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {DEAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium hover:ring-1 hover:ring-blue-300 ${STATUS_CLASSES[row.status] ?? "text-gray-600 bg-gray-100"}`}>
                      {row.status}
                    </span>
                  )}
                </td>

                {/* Priorité */}
                <td className="px-4 py-3" onClick={() => startEdit(i, "priority")}>
                  {isEditing(i, "priority") ? (
                    <select
                      autoFocus
                      defaultValue={row.priority}
                      onBlur={(e) => { updateRow(storeIndex, { priority: e.target.value as Priority, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      onChange={(e) => { updateRow(storeIndex, { priority: e.target.value as Priority, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      className="rounded border border-blue-300 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                    </select>
                  ) : (
                    <span className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium hover:ring-1 hover:ring-blue-300 ${PRIORITY_CLASSES[row.priority] ?? ""}`}>
                      {PRIORITY_LABELS[row.priority] ?? row.priority}
                    </span>
                  )}
                </td>

                {/* Échéance */}
                <td className="px-4 py-3 text-gray-600" onClick={() => startEdit(i, "dueDate")}>
                  {isEditing(i, "dueDate") ? (
                    <input
                      type="date"
                      autoFocus
                      defaultValue={row.dueDate}
                      onBlur={(e) => { updateRow(storeIndex, { dueDate: e.target.value, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      onKeyDown={(e) => { if (e.key === "Enter") { updateRow(storeIndex, { dueDate: (e.target as HTMLInputElement).value, _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() } }}
                      className="rounded border border-blue-300 px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    <span className="cursor-pointer hover:underline hover:decoration-dashed hover:text-blue-600">
                      {formatDate(row.dueDate)}
                    </span>
                  )}
                </td>

                {/* Montant */}
                <td className="px-4 py-3 text-right font-medium text-gray-900" onClick={() => startEdit(i, "montantDeal")}>
                  {isEditing(i, "montantDeal") ? (
                    <input
                      type="number"
                      autoFocus
                      defaultValue={row.montantDeal}
                      onBlur={(e) => { updateRow(storeIndex, { montantDeal: Number(e.target.value), _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() }}
                      onKeyDown={(e) => { if (e.key === "Enter") { updateRow(storeIndex, { montantDeal: Number((e.target as HTMLInputElement).value), _modified: true } as Parameters<typeof updateRow>[1]); stopEdit() } }}
                      className="w-24 rounded border border-blue-300 px-1 py-0.5 text-right text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    <span className="cursor-pointer hover:underline hover:decoration-dashed hover:text-blue-600">
                      {formatEur(row.montantDeal)}
                    </span>
                  )}
                </td>

                {/* Critère */}
                <td className="px-4 py-3">
                  <ReasonBadge reason={reason} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/40 bg-white/20 px-4 py-2 text-xs text-gray-400">
        {focusRows.length} contact{focusRows.length > 1 ? "s" : ""} nécessitant une action
        <span className="ml-2 text-blue-400">· Cliquez sur une cellule pour éditer</span>
      </div>
    </div>
  )
}
