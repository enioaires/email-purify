"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface ProcessingProgressProps {
  isProcessing: boolean
  progress: number
  processedCount?: number
  totalCount?: number
}

export function ProcessingProgress({ 
  isProcessing, 
  progress, 
  processedCount, 
  totalCount 
}: ProcessingProgressProps) {
  if (!isProcessing && progress === 0) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Processando...
            </h3>
            <span className="text-sm font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Details */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {processedCount && totalCount 
                ? `${processedCount.toLocaleString()} de ${totalCount.toLocaleString()} e-mails processados`
                : 'Processando e-mails...'
              }
            </span>
            {isProcessing && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs">Em andamento</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}