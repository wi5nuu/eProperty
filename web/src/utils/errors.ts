export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Koneksi jaringan bermasalah') {
    super(message, 0, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Data tidak valid',
    public errors?: Record<string, string[]>
  ) {
    super(message, 422, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Anda tidak memiliki akses') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Akses ditolak') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Data tidak ditemukan') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export function handleApiError(error: any): AppError {
  if (error.response) {
    const status = error.response.status
    const message = error.response.data?.message || error.message

    switch (status) {
      case 401:
        return new UnauthorizedError(message)
      case 403:
        return new ForbiddenError(message)
      case 404:
        return new NotFoundError(message)
      case 422:
        return new ValidationError(message, error.response.data?.errors)
      default:
        return new AppError(message, status)
    }
  }

  if (error.request) {
    return new NetworkError()
  }

  return new AppError(error.message || 'Terjadi kesalahan')
}
