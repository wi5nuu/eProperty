import { useState, useCallback } from 'react'
import { handleApiError, AppError } from '../utils/errors'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: AppError) => void
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<AppError | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await apiFunction(...args)
        setData(result)
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const appError = handleApiError(err)
        setError(appError)
        options.onError?.(appError)
        throw appError
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, error, loading, execute, reset }
}
