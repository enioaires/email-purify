// ================================
// Core Types
// ================================

export interface EmailValidationResult {
  email: string
  isValid: boolean
  errors: EmailValidationError[]
  warnings: EmailValidationWarning[]
  metadata: EmailMetadata
}

export interface EmailMetadata {
  domain: string
  localPart: string
  isDisposable: boolean
  isRoleBased: boolean
  hasValidFormat: boolean
  hasValidMX: boolean | null // null = not checked
}

export interface EmailValidationError {
  type: 'INVALID_FORMAT' | 'DISPOSABLE_DOMAIN' | 'ROLE_BASED' | 'INVALID_MX' | 'BLOCKED_DOMAIN'
  message: string
}

export interface EmailValidationWarning {
  type: 'SUSPICIOUS_DOMAIN' | 'COMMON_TYPO' | 'UNUSUAL_LENGTH'
  message: string
  suggestion?: string
}

// ================================
// Processing Types
// ================================

export interface ProcessingOptions {
  checkMXRecords: boolean
  filterDisposable: boolean
  filterRoleBased: boolean
  filterInvalidFormat: boolean
  chunkSize: number
  enableWarnings: boolean
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'completed' | 'error'
  progress: number
  totalEmails: number
  processedEmails: number
  validEmails: number
  invalidEmails: number
  currentChunk: number
  totalChunks: number
  startTime: number | null
  endTime: number | null
  errors: string[]
}

export interface ProcessingStats {
  total: number
  valid: number
  invalid: number
  warnings: number
  processingTime: number
  emailsPerSecond: number
  errorBreakdown: Record<EmailValidationError['type'], number>
  warningBreakdown: Record<EmailValidationWarning['type'], number>
  topDomains: Array<{ domain: string; count: number; percentage: number }>
}

// ================================
// File Processing Types
// ================================

export interface FileData {
  emails: string[]
  originalData: any[]
  detectedColumns: DetectedColumn[]
  fileName: string
  fileSize: number
  fileType: string
}

export interface DetectedColumn {
  index: number
  name: string
  type: 'email' | 'name' | 'other'
  sampleValues: string[]
  emailPattern: number // percentage of email-like values
}

// ================================
// Export Types
// ================================

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx'
  includeInvalid: boolean
  includeMetadata: boolean
  includeStats: boolean
  separator: ',' | ';' | '\t'
}

export interface ExportData {
  validEmails: EmailValidationResult[]
  invalidEmails: EmailValidationResult[]
  stats: ProcessingStats
  options: ExportOptions
}

// ================================
// Configuration Types
// ================================

export interface ValidationConfig {
  disposableDomains: string[]
  roleBasedPrefixes: string[]
  blockedDomains: string[]
  commonTypos: Record<string, string>
  maxEmailLength: number
  enableMXValidation: boolean
}

// ================================
// Utility Types
// ================================

export type EmailValidationCallback = (result: EmailValidationResult) => void
export type ProgressCallback = (state: ProcessingState) => void
export type ChunkProcessedCallback = (chunk: number, total: number) => void
