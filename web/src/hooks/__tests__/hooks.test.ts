import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce, useLocalStorage, useMediaQuery } from '../index'

describe('Custom Hooks', () => {
  describe('useDebounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      expect(result.current).toBe('initial')

      rerender({ value: 'updated', delay: 500 })
      expect(result.current).toBe('initial')

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current).toBe('updated')
    })
  })

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should initialize with default value', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      expect(result.current[0]).toBe('default')
    })

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
    })
  })

  describe('useMediaQuery', () => {
    it('should return false for non-matching query', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 9999px)'))
      expect(result.current).toBe(false)
    })
  })
})
