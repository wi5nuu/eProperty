export interface JWTPayload {
  sub: string
  id: number
  name: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) {
    return true
  }
  return Date.now() >= payload.exp * 1000
}
