export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const MIN_PAGE_SIZE = 10

export const DEFAULT_DEBOUNCE_MS = 300
export const DEFAULT_THROTTLE_MS = 1000

export const TOKEN_STORAGE_KEY = 'eproperty-auth'
export const THEME_STORAGE_KEY = 'eproperty-theme'

export const DATE_FORMAT = 'DD MMMM YYYY'
export const DATETIME_FORMAT = 'DD MMMM YYYY HH:mm'
export const TIME_FORMAT = 'HH:mm'

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
