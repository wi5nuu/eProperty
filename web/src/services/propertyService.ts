import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { Property, PaginatedResponse } from '../types'

export const propertyApi = {
  getAll: async (page = 1, perPage = 20) => {
    const { data } = await api.get<PaginatedResponse<Property>>(API_ENDPOINTS.PROPERTIES, {
      params: { page, per_page: perPage },
    })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ data: Property }>(API_ENDPOINTS.PROPERTY_BY_ID(id))
    return data.data
  },

  create: async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    const { data } = await api.post<{ data: Property }>(API_ENDPOINTS.PROPERTIES, property)
    return data.data
  },

  update: async (id: number, property: Partial<Property>) => {
    const { data } = await api.put<{ data: Property }>(API_ENDPOINTS.PROPERTY_BY_ID(id), property)
    return data.data
  },

  delete: async (id: number) => {
    await api.delete(API_ENDPOINTS.PROPERTY_BY_ID(id))
  },
}
