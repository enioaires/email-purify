"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadIcon } from "lucide-react"

interface ExportResultsProps {
  validEmailsCount: number
  onExportClean: () => void
  onExportDetailed: () => void
  disabled?: boolean
}

export function ExportResults({ 
  validEmailsCount, 
  onExportClean, 
  onExportDetailed,
  disabled = false 
}: ExportResultsProps) {
  const [includeRemoved, setIncludeRemoved] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Resultados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

      {/* Main Export Section */}
      <div className="space-y-4">
        {/* Primary Download Button */}
        <Button
          onClick={onExportClean}
          disabled={disabled || validEmailsCount === 0}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Baixar CSV Limpo
        </Button>

        {/* Include Removed Checkbox */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="includeRemoved"
            checked={includeRemoved}
            onCheckedChange={(checked) => setIncludeRemoved(checked as boolean)}
            disabled={disabled}
            className="mt-0.5"
          />
          <label 
            htmlFor="includeRemoved" 
            className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
          >
            Incluir e-mails removidos em arquivo separado
          </label>
        </div>
      </div>

        {/* Additional Formats */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Baixar relatório completo em:
          </p>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportDetailed}
            disabled={disabled || validEmailsCount === 0}
            className="text-sm px-4 py-2"
          >
            CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={true}
            className="text-sm px-4 py-2 opacity-50 cursor-not-allowed"
          >
            JSON
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={true}
            className="text-sm px-4 py-2 opacity-50 cursor-not-allowed"
          >
            PDF
          </Button>
        </div>
      </div>

        {validEmailsCount === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-destructive">
              Nenhum email válido para exportar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}