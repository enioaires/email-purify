"use client"

import { Button } from "@/components/ui/button"
import { useEmailPurify } from "@/hooks/use-email-purify"
import EmailUpload from "./drag-and-drop"
import { ValidationSettings } from "./validation-settings"
import { FilePreview } from "./file-preview"
import { ProcessingProgress } from "./processing-progress"
import { ValidationResults } from "./validation-results"
import { ExportResults } from "./export-results"

export function EmailPurifyMain() {
  const {
    fileName,
    fileSize,
    emails,
    isProcessing,
    progress,
    results,
    rules,
    error,
    isReady,
    hasResults,
    hasValidEmails,
    handleFileUpload,
    validateEmails,
    updateRules,
    clearData,
    clearError,
    exportCleanEmails,
    exportDetailedReport
  } = useEmailPurify()

  const handleStartProcessing = async () => {
    if (!isReady) return
    await validateEmails()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Limpe sua Lista de E-mails
              <span className="text-primary block">Instantaneamente</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Faça o upload do seu arquivo e nós cuidamos do resto. Sem atrito, resultados transparentes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Client-side</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Suporte CSV, TXT, XLSX</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Até 100k+ e-mails</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* Upload & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <EmailUpload
              fileName={fileName}
              fileSize={fileSize}
              emails={emails}
              error={error}
              isProcessing={isProcessing}
              isReady={isReady}
              hasResults={hasResults}
              onFileUpload={handleFileUpload}
              onClearData={clearData}
              onClearError={clearError}
              onStartProcessing={handleStartProcessing}
              onFileProcessed={(count) => console.log(`${count} emails processados`)}
            />
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <ValidationSettings
              rules={rules}
              onRulesChange={updateRules}
              disabled={isProcessing}
            />

            {emails.length > 0 && (
              <FilePreview emails={emails} fileName={fileName} />
            )}
          </div>
        </div>

        {/* Processing Progress */}
        <ProcessingProgress
          isProcessing={isProcessing}
          progress={progress}
          processedCount={Math.floor((progress / 100) * emails.length)}
          totalCount={emails.length}
        />

        {/* Results Section */}
        {hasResults && results && (
          <div className="space-y-8">
            <ValidationResults results={results} />
            <ExportResults
              validEmailsCount={results.valid.length}
              onExportClean={exportCleanEmails}
              onExportDetailed={exportDetailedReport}
              disabled={isProcessing}
            />
          </div>
        )}
      </div>
    </div>
  )
}