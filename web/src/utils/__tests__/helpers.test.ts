import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle, sleep, retry } from '../helpers'

describe('Helper Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const func = vi.fn()
      const debouncedFunc = debounce(func, 100)

      debouncedFunc()
      debouncedFunc()
      debouncedFunc()

      expect(func).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      expect(func).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const func = vi.fn()
      const throttledFunc = throttle(func, 100)

      throttledFunc()
      throttledFunc()
      throttledFunc()

      expect(func).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)

      throttledFunc()
      expect(func).toHaveBeenCalledTimes(2)
    })
  })

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      const promise = sleep(1000)
      vi.advanceTimersByTime(1000)
      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0
      const failingFunc = vi.fn(async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Failed')
        }
        return 'Success'
      })

      const promise = retry(failingFunc, { retries: 3, delay: 100 })
      
      vi.advanceTimersByTime(100)
      await Promise.resolve()
      vi.advanceTimersByTime(100)
      await Promise.resolve()

      const result = await promise
      expect(result).toBe('Success')
      expect(failingFunc).toHaveBeenCalledTimes(3)
    })
  })
})
