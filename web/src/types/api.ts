export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
  status: number
}

export interface QueryParams {
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  [key: string]: any
}

export interface ApiError {
  message: string
  statusCode: number
  code?: string
  errors?: Record<string, string[]>
}
