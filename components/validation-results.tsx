"use client"

import { ProcessResult } from "@/lib/email-validation-functions"
import { CheckCircleIcon, ClockIcon, GlobeIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ValidationResultsProps {
  results: ProcessResult
}

export function ValidationResults({ results }: ValidationResultsProps) {
  const successRate = ((results.valid.length / results.total) * 100).toFixed(1)
  
  // Análise de domínios
  const domainCounts = results.valid.reduce((acc, email) => {
    const domain = email.email.split('@')[1]
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topDomains = Object.entries(domainCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const maxDomainCount = Math.max(...topDomains.map(([,count]) => count))

  // Análise de inválidos por motivo
  const invalidReasons = results.invalid.reduce((acc, email) => {
    const reason = email.reason || 'Outros'
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
        Resultados da Validação
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de E-mails */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <GlobeIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Total de E-mails</p>
            <p className="text-2xl font-bold">
              {results.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Taxa de Sucesso */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Taxa de Sucesso</p>
            <p className="text-2xl font-bold text-green-600">
              {successRate}%
            </p>
          </CardContent>
        </Card>

        {/* Domínios Únicos */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <GlobeIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Domínios Únicos</p>
            <p className="text-2xl font-bold">
              {Object.keys(domainCounts).length.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Tempo de Processamento */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <ClockIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Tempo de Proc.</p>
            <p className="text-2xl font-bold">
              {(results.stats.processingTime / 1000).toFixed(0)}s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalhamento da Validação */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento da Validação</CardTitle>
          </CardHeader>
          <CardContent>
          
            {/* Válidos */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Válidos</span>
                <span className="text-sm font-medium">
                  {results.valid.length.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(results.valid.length / results.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Inválidos */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">Inválidos</span>
                <span className="text-sm font-medium">
                  {results.invalid.length.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(results.invalid.length / results.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Breakdown dos inválidos */}
            {Object.entries(invalidReasons).length > 0 && (
              <div className="space-y-2">
                {Object.entries(invalidReasons).map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{reason}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análise de Domínio */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Domínio (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDomains.map(([domain, count]) => (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {domain}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / maxDomainCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}