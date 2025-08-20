"use client"

import { ProcessResult, ValidationRules, processFile, validateRules, processEmailList, createCleanEmailsFile, downloadFile, createDetailedReport, EmailResult, validateSingleEmail } from '@/lib/email-validation-functions'
import { useState, useCallback } from 'react'


// ================================
// Types
// ================================

interface EmailPurifyState {
    // File data
    fileName: string | null
    fileSize: number | null
    emails: string[]

    // Processing
    isProcessing: boolean
    progress: number
    results: ProcessResult | null

    // Config
    rules: ValidationRules

    // Errors
    error: string | null
}

// ================================
// Hook Principal
// ================================

export function useEmailPurify() {
    const [state, setState] = useState<EmailPurifyState>({
        fileName: null,
        fileSize: null,
        emails: [],
        isProcessing: false,
        progress: 0,
        results: null,
        rules: {
            checkFormat: true,
            checkDisposable: true,
            checkRoleBased: true
        },
        error: null
    })

    // ================================
    // File Processing
    // ================================

    const handleFileUpload = useCallback(async (file: File) => {
        try {
            setState(prev => ({ ...prev, error: null }))

            const emails = await processFile(file)

            setState(prev => ({
                ...prev,
                fileName: file.name,
                fileSize: file.size,
                emails,
                results: null,
                error: null
            }))

            return emails
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao processar arquivo'
            setState(prev => ({ ...prev, error: errorMessage }))
            throw error
        }
    }, [])

    // ================================
    // Email Processing
    // ================================

    const validateEmails = useCallback(async () => {
        if (state.emails.length === 0) {
            setState(prev => ({ ...prev, error: 'Nenhum email para validar' }))
            return
        }

        const rulesValidation = validateRules(state.rules)
        if (!rulesValidation.isValid) {
            setState(prev => ({ ...prev, error: rulesValidation.error || 'Erro de validação' }))
            return
        }

        try {
            setState(prev => ({
                ...prev,
                isProcessing: true,
                progress: 0,
                error: null
            }))

            const results = await processEmailList(
                state.emails,
                state.rules,
                (processed, total) => {
                    const progress = Math.round((processed / total) * 100)
                    setState(prev => ({ ...prev, progress }))
                }
            )

            setState(prev => ({
                ...prev,
                isProcessing: false,
                progress: 100,
                results
            }))

            return results
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao validar emails'
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: errorMessage
            }))
            throw error
        }
    }, [state.emails, state.rules])

    // ================================
    // Configuration
    // ================================

    const updateRules = useCallback((newRules: Partial<ValidationRules>) => {
        setState(prev => ({
            ...prev,
            rules: { ...prev.rules, ...newRules },
            error: null
        }))
    }, [])

    // ================================
    // Export Functions
    // ================================

    const exportCleanEmails = useCallback(() => {
        if (!state.results || state.results.valid.length === 0) {
            setState(prev => ({ ...prev, error: 'Nenhum email válido para exportar' }))
            return
        }

        const { blob, filename } = createCleanEmailsFile(state.results.valid)
        downloadFile(blob, filename)
    }, [state.results])

    const exportDetailedReport = useCallback(() => {
        if (!state.results) {
            setState(prev => ({ ...prev, error: 'Nenhum resultado para exportar' }))
            return
        }

        const { blob, filename } = createDetailedReport(state.results)
        downloadFile(blob, filename)
    }, [state.results])

    // ================================
    // Utility Functions
    // ================================

    const clearData = useCallback(() => {
        setState({
            fileName: null,
            fileSize: null,
            emails: [],
            isProcessing: false,
            progress: 0,
            results: null,
            rules: {
                checkFormat: true,
                checkDisposable: true,
                checkRoleBased: true
            },
            error: null
        })
    }, [])

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    const validateSingle = useCallback((email: string): EmailResult => {
        return validateSingleEmail(email, state.rules)
    }, [state.rules])

    // ================================
    // Computed Values
    // ================================

    const isReady = state.emails.length > 0 && !state.isProcessing
    const hasResults = !!state.results
    const hasValidEmails = state.results ? state.results.valid.length > 0 : false
    const hasActiveRules = state.rules.checkFormat || state.rules.checkDisposable || state.rules.checkRoleBased

    // ================================
    // Return Object
    // ================================

    return {
        // State
        ...state,

        // Computed
        isReady,
        hasResults,
        hasValidEmails,
        hasActiveRules,

        // Actions
        handleFileUpload,
        validateEmails,
        updateRules,
        exportCleanEmails,
        exportDetailedReport,
        clearData,
        clearError,
        validateSingle
    }
}