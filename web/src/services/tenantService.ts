import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { Tenant, PaginatedResponse } from '../types'

export const tenantApi = {
  getAll: async (page = 1, perPage = 20) => {
    const { data } = await api.get<PaginatedResponse<Tenant>>(API_ENDPOINTS.TENANTS, {
      params: { page, per_page: perPage },
    })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ data: Tenant }>(API_ENDPOINTS.TENANT_BY_ID(id))
    return data.data
  },

  create: async (tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    const { data } = await api.post<{ data: Tenant }>(API_ENDPOINTS.TENANTS, tenant)
    return data.data
  },

  update: async (id: number, tenant: Partial<Tenant>) => {
    const { data } = await api.put<{ data: Tenant }>(API_ENDPOINTS.TENANT_BY_ID(id), tenant)
    return data.data
  },

  delete: async (id: number) => {
    await api.delete(API_ENDPOINTS.TENANT_BY_ID(id))
  },
}
