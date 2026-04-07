import {
  AreaChart, Area,
  BarChart, Bar, Cell, LabelList,
  Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useKPIs } from "@/hooks/useKPIs"
import { useFunnelData } from "@/hooks/useFunnelData"
import { useCashflowData } from "@/hooks/useCashflowData"

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
  const funnelData = useFunnelData()
  const cashflowData = useCashflowData()

  const hasPieData = repartitionParStatut.length > 0
  const hasCashflow = cashflowData.some((m) => m.montant > 0)

  return (
    <div className="space-y-6">
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

      {/* Graphiques — grille 2 colonnes sur desktop */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Funnel de conversion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-700">
              Funnel de conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={funnelData}
                  margin={{ left: 16, right: 40, top: 4, bottom: 4 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} deal${value > 1 ? "s" : ""}`, "Nombre"]}
                  />
                  <Bar dataKey="value" radius={4}>
                    {funnelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 600, fill: "#374151" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartition par statut (PieChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-700">
              Répartition par montant
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasPieData ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionParStatut}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {repartitionParStatut.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#cbd5e1"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatEur(Number(value))} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">
                Aucun montant renseigné.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trésorerie prévisionnelle — pleine largeur */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">
            Trésorerie prévisionnelle — 6 prochains mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasCashflow ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowData} margin={{ left: 16, right: 16, top: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="cashflowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                  />
                  <Tooltip formatter={(value) => formatEur(Number(value))} labelStyle={{ fontWeight: 600 }} />
                  <Area
                    type="monotone"
                    dataKey="montant"
                    name="Pipeline prévu"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    fill="url(#cashflowGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              Aucun deal actif avec une échéance future renseignée.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
