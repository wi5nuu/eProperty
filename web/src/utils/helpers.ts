export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number; shouldRetry?: (e: any) => boolean } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, shouldRetry = () => true } = options

  return fn().catch((error) => {
    if (retries === 0 || !shouldRetry(error)) {
      throw error
    }
    return sleep(delay).then(() => retry(fn, { retries: retries - 1, delay, shouldRetry }))
  })
}
