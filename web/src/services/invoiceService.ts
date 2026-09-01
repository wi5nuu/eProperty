import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { Invoice, PaginatedResponse } from '../types'

export const invoiceApi = {
  getAll: async (page = 1, perPage = 20) => {
    const { data } = await api.get<PaginatedResponse<Invoice>>(API_ENDPOINTS.INVOICES, {
      params: { page, per_page: perPage },
    })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ data: Invoice }>(API_ENDPOINTS.INVOICE_BY_ID(id))
    return data.data
  },

  create: async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { data } = await api.post<{ data: Invoice }>(API_ENDPOINTS.INVOICES, invoice)
    return data.data
  },

  update: async (id: number, invoice: Partial<Invoice>) => {
    const { data } = await api.put<{ data: Invoice }>(API_ENDPOINTS.INVOICE_BY_ID(id), invoice)
    return data.data
  },

  pay: async (id: number) => {
    const { data } = await api.post<{ data: Invoice }>(API_ENDPOINTS.INVOICE_PAY(id))
    return data.data
  },

  delete: async (id: number) => {
    await api.delete(API_ENDPOINTS.INVOICE_BY_ID(id))
  },
}
