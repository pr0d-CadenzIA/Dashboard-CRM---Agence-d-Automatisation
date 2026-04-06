import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useKPIs } from "@/hooks/useKPIs"

const STATUS_COLORS: Record<string, string> = {
  "prospect": "#94a3b8",
  "qualifié": "#60a5fa",
  "négociation": "#f59e0b",
  "gagné - en cours": "#22c55e",
  "perdu": "#f87171",
}

function formatEur(value: number): string {
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

export function ExecutiveView() {
  const { revenuSecurise, pipelineActif, repartitionParStatut } = useKPIs()
  const hasData = repartitionParStatut.length > 0

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenu Sécurisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatEur(revenuSecurise)}</p>
            <p className="mt-1 text-xs text-gray-400">Deals avec statut "gagné"</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pipeline Actif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{formatEur(pipelineActif)}</p>
            <p className="mt-1 text-xs text-gray-400">Deals en cours (hors perdu)</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique répartition par statut */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">
            Répartition par statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repartitionParStatut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {repartitionParStatut.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] ?? "#cbd5e1"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatEur(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              Aucun montant renseigné dans les données importées.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
