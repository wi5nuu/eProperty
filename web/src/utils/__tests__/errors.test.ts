import { describe, it, expect } from 'vitest'
import {
  AppError,
  NetworkError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  handleApiError,
} from '../errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create AppError with message and status code', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR')
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.name).toBe('AppError')
    })
  })

  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError()
      expect(error.message).toBe('Koneksi jaringan bermasalah')
      expect(error.statusCode).toBe(0)
      expect(error.code).toBe('NETWORK_ERROR')
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with errors object', () => {
      const errors = { email: ['Email tidak valid'] }
      const error = new ValidationError('Validation failed', errors)
      expect(error.errors).toEqual(errors)
      expect(error.statusCode).toBe(422)
    })
  })

  describe('handleApiError', () => {
    it('should handle 401 error', () => {
      const axiosError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }
      const error = handleApiError(axiosError)
      expect(error).toBeInstanceOf(UnauthorizedError)
    })

    it('should handle 404 error', () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      }
      const error = handleApiError(axiosError)
      expect(error).toBeInstanceOf(NotFoundError)
    })

    it('should handle network error', () => {
      const axiosError = {
        request: {},
      }
      const error = handleApiError(axiosError)
      expect(error).toBeInstanceOf(NetworkError)
    })
  })
})
