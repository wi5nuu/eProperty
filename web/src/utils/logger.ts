interface Logger {
  info(message: string, meta?: Record<string, any>): void
  error(message: string, meta?: Record<string, any>): void
  warn(message: string, meta?: Record<string, any>): void
  debug(message: string, meta?: Record<string, any>): void
}

class ConsoleLogger implements Logger {
  private isDev = import.meta.env.DEV

  info(message: string, meta?: Record<string, any>): void {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, meta || '')
    }
  }

  error(message: string, meta?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, meta || '')
  }

  warn(message: string, meta?: Record<string, any>): void {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, meta || '')
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, meta || '')
    }
  }
}

export const logger = new ConsoleLogger()
