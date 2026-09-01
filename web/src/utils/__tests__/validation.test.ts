import { describe, it, expect, vi } from 'vitest'
import { loginSchema, propertySchema, tenantSchema, invoiceSchema, meterReadingSchema } from '../validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'admin@eproperty.local',
        password: 'ChangeMe123!',
      }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'admin@eproperty.local',
        password: '123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('propertySchema', () => {
    it('should validate correct property data', () => {
      const validData = {
        name: 'Test Property',
        address: '123 Main St',
        type: 'apartment' as const,
        status: 'active' as const,
      }
      const result = propertySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid property type', () => {
      const invalidData = {
        name: 'Test Property',
        address: '123 Main St',
        type: 'invalid',
      }
      const result = propertySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('meterReadingSchema', () => {
    it('should validate correct meter reading', () => {
      const validData = {
        property_id: 1,
        meter_type: 'water' as const,
        current_reading: 100,
        previous_reading: 50,
        reading_date: '2024-01-01',
      }
      const result = meterReadingSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative readings', () => {
      const invalidData = {
        property_id: 1,
        meter_type: 'water' as const,
        current_reading: -10,
        previous_reading: 50,
        reading_date: '2024-01-01',
      }
      const result = meterReadingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
