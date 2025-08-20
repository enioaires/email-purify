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
            className="w-full h-12font-medium text-base"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Baixar Arquivo
          </Button>
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