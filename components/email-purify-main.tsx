"use client"

import { Button } from "@/components/ui/button"
import { useEmailPurify } from "@/hooks/use-email-purify"
import { EmailPurifyHeader } from "./email-purify-header"
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <EmailPurifyHeader />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            {/* Upload Area */}
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
            {/* Validation Settings */}
            <ValidationSettings
              rules={rules}
              onRulesChange={updateRules}
              disabled={isProcessing}
            />

            {/* File Preview */}
            {emails.length > 0 && (
              <FilePreview emails={emails} fileName={fileName} />
            )}
          </div>
        </div>

        {/* Processing Progress - Full Width */}
        <div className="w-full">
          <ProcessingProgress
            isProcessing={isProcessing}
            progress={progress}
            processedCount={Math.floor((progress / 100) * emails.length)}
            totalCount={emails.length}
          />
        </div>

        {/* Results Section */}
        {hasResults && results && (
          <div className="space-y-6">
            {/* Validation Results */}
            <ValidationResults results={results} />

            {/* Export Section - Full Width */}
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