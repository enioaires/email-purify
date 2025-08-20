// ================================
// Types Essenciais
// ================================

export interface EmailResult {
    email: string
    isValid: boolean
    reason?: string
  }
  
  export interface ValidationRules {
    checkFormat: boolean
    checkDisposable: boolean
    checkRoleBased: boolean
  }
  
  export interface ProcessResult {
    total: number
    valid: EmailResult[]
    invalid: EmailResult[]
    stats: {
      validCount: number
      invalidCount: number
      processingTime: number
    }
  }
  
  // ================================
  // Listas de Domínios
  // ================================
  
  const DISPOSABLE_DOMAINS = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'yopmail.com', 'maildrop.cc',
    'sharklasers.com', 'pokemail.net', 'spam4.me', 'trashmail.com',
    'emailondeck.com', 'fakeinbox.com', 'tempail.com', 'getnada.com',
    'mohmal.com', 'mytrashmail.com', 'mailnator.com', 'emailfake.com'
  ]
  
  const ROLE_BASED_PREFIXES = [
    'admin', 'info', 'support', 'help', 'noreply', 'no-reply', 'contact',
    'sales', 'marketing', 'service', 'webmaster', 'postmaster', 'abuse',
    'security', 'billing', 'hr', 'careers', 'team', 'hello', 'welcome'
  ]
  
  // ================================
  // Funções de Validação
  // ================================
  
  export function isValidEmailFormat(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  export function isDisposableDomain(domain: string): boolean {
    return DISPOSABLE_DOMAINS.includes(domain.toLowerCase())
  }
  
  export function isRoleBasedEmail(localPart: string): boolean {
    const lower = localPart.toLowerCase()
    return ROLE_BASED_PREFIXES.some(prefix => 
      lower === prefix || lower.startsWith(prefix + '.')
    )
  }
  
  export function validateSingleEmail(email: string, rules: ValidationRules): EmailResult {
    const cleanEmail = email.trim().toLowerCase()
    
    if (!cleanEmail) {
      return { email: cleanEmail, isValid: false, reason: 'Email vazio' }
    }
  
    // Validação de formato
    if (rules.checkFormat && !isValidEmailFormat(cleanEmail)) {
      return { email: cleanEmail, isValid: false, reason: 'Formato inválido' }
    }
  
    const [localPart, domain] = cleanEmail.split('@')
    
    // Validação de domínio descartável
    if (rules.checkDisposable && isDisposableDomain(domain)) {
      return { email: cleanEmail, isValid: false, reason: 'Email temporário' }
    }
  
    // Validação role-based
    if (rules.checkRoleBased && isRoleBasedEmail(localPart)) {
      return { email: cleanEmail, isValid: false, reason: 'Email corporativo' }
    }
  
    return { email: cleanEmail, isValid: true }
  }
  
  // ================================
  // Processamento de Emails
  // ================================
  
  export async function processEmailList(
    emails: string[],
    rules: ValidationRules,
    onProgress?: (processed: number, total: number) => void
  ): Promise<ProcessResult> {
    const startTime = Date.now()
    const results: EmailResult[] = []
    
    for (let i = 0; i < emails.length; i++) {
      const result = validateSingleEmail(emails[i], rules)
      results.push(result)
      
      // Progress callback a cada 100 emails
      if (onProgress && i % 100 === 0) {
        onProgress(i + 1, emails.length)
      }
      
      // Yield para não travar UI a cada 1000
      if (i % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
  
    // Final progress
    onProgress?.(emails.length, emails.length)
  
    const valid = results.filter(r => r.isValid)
    const invalid = results.filter(r => !r.isValid)
    
    return {
      total: emails.length,
      valid,
      invalid,
      stats: {
        validCount: valid.length,
        invalidCount: invalid.length,
        processingTime: Date.now() - startTime
      }
    }
  }
  
  // ================================
  // Processamento de Arquivo
  // ================================
  
  export function extractEmailsFromText(text: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const matches = text.match(emailRegex) || []
    
    // Remove duplicatas e normaliza
    return [...new Set(matches.map(email => email.toLowerCase().trim()))]
  }

  export function parseCSV(text: string): string[] {
    const lines = text.split('\n').filter(line => line.trim())
    const emails: string[] = []
    
    for (const line of lines) {
      // Tenta diferentes delimitadores
      const cells = line.split(/[,;|\t]/).map(cell => cell.trim().replace(/['"]/g, ''))
      
      // Procura por emails em cada célula
      for (const cell of cells) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        const matches = cell.match(emailRegex)
        if (matches) {
          emails.push(...matches)
        }
      }
    }
    
    // Remove duplicatas e normaliza
    return [...new Set(emails.map(email => email.toLowerCase().trim()))]
  }
  
  export function processFile(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          
          // Determina o tipo de processamento baseado na extensão
          const fileExtension = file.name.toLowerCase().split('.').pop()
          
          let emails: string[] = []
          
          if (fileExtension === 'csv') {
            emails = parseCSV(text)
          } else {
            // Para TXT e outros formatos, usa regex simples
            emails = extractEmailsFromText(text)
          }
          
          console.log(`Processado ${file.name}: ${emails.length} emails encontrados`)
          resolve(emails)
        } catch (error) {
          console.error('Erro ao processar arquivo:', error)
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })
  }
  
  // ================================
  // Exportação
  // ================================
  
  export function createCleanEmailsFile(validEmails: EmailResult[]): { blob: Blob; filename: string } {
    const emails = validEmails.map(r => r.email)
    const content = emails.join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const filename = `emails_limpos_${timestamp}.txt`
    
    return { blob, filename }
  }
  
  export function createDetailedReport(result: ProcessResult): { blob: Blob; filename: string } {
    const lines = [
      'email,status,motivo',
      ...result.valid.map(r => `${r.email},válido,`),
      ...result.invalid.map(r => `${r.email},inválido,"${r.reason}"`)
    ]
    
    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/csv' })
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const filename = `relatorio_${timestamp}.csv`
    
    return { blob, filename }
  }
  
  export function downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  // ================================
  // Utilitários
  // ================================
  
  export function validateRules(rules: ValidationRules): { isValid: boolean; error?: string } {
    const hasAnyRule = rules.checkFormat || rules.checkDisposable || rules.checkRoleBased
    
    if (!hasAnyRule) {
      return { isValid: false, error: 'Pelo menos uma regra deve estar ativa' }
    }
    
    return { isValid: true }
  }
  
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  export function formatProcessingTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }