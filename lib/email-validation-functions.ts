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
// Correção de Typos e Validação de Domínios
// ================================

const DOMAIN_TYPOS: Record<string, string> = {
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outloook.com': 'outlook.com',
  'uol.com.brr': 'uol.com.br',
  'terra.com.brr': 'terra.com.br'
}

const VALID_TLDS = [
  // Internacionais
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
  'co.uk', 'co.jp', 'co.au', 'co.za',
  // Brasil
  'com.br', 'net.br', 'org.br', 'edu.br', 'gov.br', 'mil.br',
  'agr.br', 'art.br', 'bio.br', 'blog.br', 'coop.br', 'esp.br',
  'far.br', 'flog.br', 'fnd.br', 'fot.br', 'fst.br', 'g12.br',
  'geo.br', 'imb.br', 'ind.br', 'inf.br', 'jor.br', 'lel.br',
  'mat.br', 'med.br', 'mus.br', 'not.br', 'ntr.br', 'odo.br',
  'ppg.br', 'pro.br', 'psc.br', 'psi.br', 'qsl.br', 'radio.br',
  'rec.br', 'slg.br', 'srv.br', 'tmp.br', 'tur.br', 'tv.br',
  'vet.br', 'vlog.br', 'wiki.br', 'zlg.br'
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

export function correctDomainTypos(domain: string): string {
  const lowerDomain = domain.toLowerCase()
  return DOMAIN_TYPOS[lowerDomain] || domain
}

export function isValidTLD(domain: string): boolean {
  const parts = domain.toLowerCase().split('.')
  if (parts.length < 2) return false
  
  // Para domínios como site.com.br
  if (parts.length >= 3) {
    const tld = parts.slice(-2).join('.')
    if (VALID_TLDS.includes(tld)) return true
  }
  
  // Para domínios como site.com
  const tld = parts[parts.length - 1]
  return VALID_TLDS.includes(tld)
}

export function isValidDomain(domain: string): boolean {
  // Verifica caracteres válidos
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!domainRegex.test(domain)) return false
  
  // Verifica se tem pelo menos um ponto
  if (!domain.includes('.')) return false
  
  // Verifica TLD válido
  return isValidTLD(domain)
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

  const [localPart, originalDomain] = cleanEmail.split('@')
  
  // Correção de typos no domínio
  const correctedDomain = correctDomainTypos(originalDomain)
  const correctedEmail = correctedDomain !== originalDomain 
    ? `${localPart}@${correctedDomain}` 
    : cleanEmail

  // Validação de domínio válido
  if (!isValidDomain(correctedDomain)) {
    return { email: cleanEmail, isValid: false, reason: 'Domínio inválido' }
  }
  
  // Validação de domínio descartável
  if (rules.checkDisposable && isDisposableDomain(correctedDomain)) {
    return { email: correctedEmail, isValid: false, reason: 'Email temporário' }
  }

  // Validação role-based
  if (rules.checkRoleBased && isRoleBasedEmail(localPart)) {
    return { email: correctedEmail, isValid: false, reason: 'Email corporativo' }
  }

  return { email: correctedEmail, isValid: true }
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
  
  // Aplica correção de typos e remove duplicatas
  const correctedEmails = matches.map(email => {
    const [localPart, domain] = email.toLowerCase().trim().split('@')
    const correctedDomain = correctDomainTypos(domain)
    return `${localPart}@${correctedDomain}`
  })
  
  return [...new Set(correctedEmails)]
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
        // Aplica correção de typos
        const correctedEmails = matches.map(email => {
          const [localPart, domain] = email.toLowerCase().trim().split('@')
          const correctedDomain = correctDomainTypos(domain)
          return `${localPart}@${correctedDomain}`
        })
        emails.push(...correctedEmails)
      }
    }
  }
  
  return [...new Set(emails)]
}

export function processFile(file: File): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const fileExtension = file.name.toLowerCase().split('.').pop()
    
    // Para arquivos Excel
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          
          // Importar XLSX
          const XLSX = await import('xlsx')
          
          // Parse do workbook Excel
          const workbook = XLSX.read(data, {
            cellStyles: true,
            cellFormulas: true,
            cellDates: true,
            cellNF: true,
            sheetStubs: true
          })
          
          let allEmails: string[] = []
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
          
          // Processar todas as sheets
          workbook.SheetNames.forEach((sheetName: string) => {
            const worksheet = workbook.Sheets[sheetName]
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
            
            sheetData.forEach((row: any) => {
              if (Array.isArray(row)) {
                row.forEach((cell: any) => {
                  if (cell && typeof cell === 'string') {
                    const matches = cell.match(emailRegex)
                    if (matches) {
                      // Aplica correção de typos nos emails encontrados
                      const correctedEmails = matches.map(email => {
                        const [localPart, domain] = email.toLowerCase().trim().split('@')
                        const correctedDomain = correctDomainTypos(domain)
                        return `${localPart}@${correctedDomain}`
                      })
                      allEmails.push(...correctedEmails)
                    }
                  }
                })
              }
            })
          })
          
          // Remove duplicatas e normaliza
          const uniqueEmails = [...new Set(allEmails)]
          
          console.log(`Processado Excel ${file.name}: ${uniqueEmails.length} emails encontrados`)
          resolve(uniqueEmails)
          
        } catch (error) {
          console.error('Erro ao processar arquivo Excel:', error)
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo Excel'))
      reader.readAsArrayBuffer(file)
      
    } else {
      // Para CSV e TXT
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          
          let emails: string[] = []
          
          if (fileExtension === 'csv') {
            emails = parseCSV(text)
          } else {
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
    }
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