import { useState, useEffect } from 'react'
import type { PaginatedResponse } from '../types'

interface UsePaginationOptions {
  initialPage?: number
  initialPerPage?: number
}

export function usePagination<T>({
  initialPage = 1,
  initialPerPage = 20,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const updateFromResponse = (response: PaginatedResponse<T>) => {
    setData(response.data)
    setTotal(response.total)
    setLastPage(response.last_page)
    setPage(response.current_page)
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage)
    }
  }

  const nextPage = () => goToPage(page + 1)
  const prevPage = () => goToPage(page - 1)

  return {
    page,
    perPage,
    data,
    total,
    lastPage,
    loading,
    setLoading,
    setPerPage,
    goToPage,
    nextPage,
    prevPage,
    updateFromResponse,
  }
}
