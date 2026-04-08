import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { parseCSV } from "@/lib/csvParser"
import { useCRMStore } from "@/store/crmStore"

export function ImportView() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const setRows = useCRMStore((state) => state.setRows)

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      toast({ variant: "destructive", title: "Format invalide", description: "Veuillez sélectionner un fichier .csv" })
      return
    }
    setIsLoading(true)
    try {
      const result = await parseCSV(file)
      if ("error" in result) {
        const { missingColumns } = result.error
        const message = missingColumns.length > 0
          ? `Colonnes manquantes : ${missingColumns.join(", ")}`
          : "Fichier CSV invalide ou illisible."
        toast({ variant: "destructive", title: "Import refusé", description: message })
        if (inputRef.current) inputRef.current.value = ""
        return
      }
      result.warnings.forEach((warning) => {
        toast({ variant: "warning", title: "Avertissement", description: warning })
      })
      setRows(result.rows)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Dashboard Agence CadenzIA</CardTitle>
          <CardDescription>
            Importez votre fichier CSV pour accéder au tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div
            onClick={() => !isLoading && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-400 bg-blue-50/50"
                : "border-white/60 bg-white/30 hover:border-blue-300 hover:bg-white/50"
            } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
          >
            <Upload className={`mx-auto mb-3 h-8 w-8 ${isDragOver ? "text-gray-900" : "text-gray-400"}`} />
            <p className="mb-1 text-sm font-medium text-gray-700">
              {isDragOver ? "Relâchez pour importer" : "Glissez-déposez votre fichier CSV ici"}
            </p>
            <p className="text-xs text-gray-500">
              ou cliquez pour sélectionner — 10 colonnes requises
            </p>
          </div>
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
