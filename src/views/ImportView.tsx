import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { parseCSV } from "@/lib/csvParser"
import { useCRMStore } from "@/store/crmStore"

export function ImportView() {
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const setRows = useCRMStore((state) => state.setRows)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 3.2 — État de chargement
    setIsLoading(true)

    try {
      const result = await parseCSV(file)

      // 3.3 — Gestion erreurs bloquantes
      if ("error" in result) {
        const { missingColumns } = result.error
        const message = missingColumns.length > 0
          ? `Colonnes manquantes : ${missingColumns.join(", ")}`
          : "Fichier CSV invalide ou illisible."
        toast({
          variant: "destructive",
          title: "Import refusé",
          description: message,
        })
        // Reset input pour permettre re-sélection du même fichier
        if (inputRef.current) inputRef.current.value = ""
        return
      }

      // 3.4 — Avertissements non-bloquants
      result.warnings.forEach((warning) => {
        toast({
          variant: "warning",
          title: "Avertissement",
          description: warning,
        })
      })

      // 3.5 — Injection dans le store → navigation automatique
      setRows(result.rows)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">CRM Dashboard</CardTitle>
          <CardDescription>
            Importez votre fichier CSV pour accéder au tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="mb-1 text-sm font-medium text-gray-700">
              Fichier CSV ClickUp / Notion
            </p>
            <p className="text-xs text-gray-500">
              10 colonnes requises : Task Name, Status, Montant Deal…
            </p>
          </div>
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Chargement…" : "Sélectionner un fichier CSV"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
