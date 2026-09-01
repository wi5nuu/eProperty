export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{10,}$/
  return phoneRegex.test(phone)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password harus minimal 8 karakter')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password harus mengandung karakter spesial (!@#$%^&*)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}
