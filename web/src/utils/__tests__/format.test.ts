import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDateTime, formatRelativeTime } from '../format'

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format number to IDR currency', () => {
      expect(formatCurrency(1000000)).toBe('Rp1.000.000')
      expect(formatCurrency(500000)).toBe('Rp500.000')
      expect(formatCurrency(0)).toBe('Rp0')
    })
  })

  describe('formatDate', () => {
    it('should format date to Indonesian format', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toContain('15')
      expect(result).toContain('Januari')
      expect(result).toContain('2024')
    })

    it('should handle string input', () => {
      const result = formatDate('2024-06-20')
      expect(result).toContain('20')
      expect(result).toContain('Juni')
      expect(result).toContain('2024')
    })
  })

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('15')
      expect(result).toContain('Januari')
      expect(result).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('should return "Baru saja" for recent time', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('Baru saja')
    })

    it('should return minutes for times within an hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      const result = formatRelativeTime(date)
      expect(result).toContain('menit yang lalu')
    })

    it('should return hours for times within a day', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      const result = formatRelativeTime(date)
      expect(result).toContain('jam yang lalu')
    })
  })
})
