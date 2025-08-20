"use client"

import { useState, useCallback } from "react"
import { AlertCircleIcon, FileTextIcon, UploadCloudIcon, XIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmailUploadProps {
  fileName: string | null
  fileSize: number | null
  emails: string[]
  error: string | null
  isProcessing: boolean
  isReady: boolean
  hasResults: boolean
  onFileUpload: (file: File) => Promise<string[]>
  onClearData: () => void
  onClearError: () => void
  onStartProcessing: () => void
  onFileProcessed?: (emailCount: number) => void
}

export default function EmailUpload({ 
  fileName,
  fileSize,
  emails,
  error,
  isProcessing,
  isReady,
  hasResults,
  onFileUpload,
  onClearData,
  onClearError,
  onStartProcessing,
  onFileProcessed 
}: EmailUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const maxSize = 50 * 1024 * 1024 // 50MB para listas grandes
  const acceptedTypes = ['.csv', '.txt', '.xlsx']

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setIsDragging(false)
      }
      return newCounter
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }, [])

  // File processing
  const processFile = useCallback(async (file: File) => {
    // Validações
    if (file.size > maxSize) {
      return
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      return
    }

    try {
      onClearError()
      const emails = await onFileUpload(file)
      onFileProcessed?.(emails.length)
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
    }
  }, [onFileUpload, onClearError, onFileProcessed, maxSize])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }, [processFile])

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedTypes.join(',')
    input.onchange = handleFileSelect as any
    input.click()
  }, [handleFileSelect])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const hasFile = fileName && emails.length > 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer min-h-80 h-80
          ${isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-muted-foreground hover:bg-muted/50'
          }
          ${hasFile ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center border-2
            ${hasFile
              ? 'bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-700'
              : 'bg-muted border-border'
            }
          `}>
            {hasFile ? (
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            ) : (
              <UploadCloudIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {hasFile ? 'Arquivo carregado com sucesso!' : 'Arraste e solte seu arquivo CSV, TXT ou XLSX aqui'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {hasFile ? (
                `${emails.length} emails encontrados`
              ) : (
                <>
                  Ou <span className="text-primary font-medium">clique para procurar</span> seus arquivos
                </>
              )}
            </p>
            {!hasFile && (
              <p className="text-xs text-muted-foreground">
                Máximo {formatFileSize(maxSize)} • Formatos: CSV, TXT, XLSX
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Info */}
      {hasFile && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {fileSize && formatFileSize(fileSize)} • {emails.length} emails detectados
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isReady && !hasResults && (
                  <Button
                    onClick={onStartProcessing}
                    disabled={isProcessing}
                    size="sm"
                    className="text-xs px-3 py-1 h-7"
                  >
                    {isProcessing ? 'Processando...' : 'Iniciar'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearData}
                  disabled={isProcessing}
                  className="text-xs px-3 py-1 h-7"
                >
                  Limpar
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearData}
                  className="text-muted-foreground hover:text-foreground p-1 h-7 w-7"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
