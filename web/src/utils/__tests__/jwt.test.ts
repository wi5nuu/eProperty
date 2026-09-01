import { describe, it, expect } from 'vitest'
import { parseJWT, isTokenExpired } from '../jwt'

describe('JWT Utils', () => {
  describe('parseJWT', () => {
    it('should parse valid JWT token', () => {
      // Sample JWT token (header.payload.signature)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const result = parseJWT(token)
      
      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
      expect(result?.name).toBe('John Doe')
      expect(result?.email).toBe('john@example.com')
      expect(result?.role).toBe('admin')
    })

    it('should return null for invalid token', () => {
      const result = parseJWT('invalid.token')
      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = parseJWT('not-a-jwt-token')
      expect(result).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      // Token with exp in the past
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      expect(isTokenExpired(expiredToken)).toBe(true)
    })

    it('should return true for token without exp', () => {
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      expect(isTokenExpired(tokenWithoutExp)).toBe(true)
    })

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true)
    })
  })
})
