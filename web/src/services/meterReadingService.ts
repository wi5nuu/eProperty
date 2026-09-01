import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { MeterReading, PaginatedResponse } from '../types'

export const meterReadingApi = {
  getAll: async (page = 1, perPage = 20, filters?: { house_id?: number; status?: string }) => {
    const { data } = await api.get<PaginatedResponse<MeterReading>>(API_ENDPOINTS.METER_READINGS, {
      params: { page, per_page: perPage, ...filters },
    })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ data: MeterReading }>(API_ENDPOINTS.METER_READING_BY_ID(id))
    return data.data
  },

  create: async (reading: FormData) => {
    const { data } = await api.post<{ data: MeterReading }>(API_ENDPOINTS.METER_READINGS, reading, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  update: async (id: number, reading: FormData) => {
    const { data } = await api.put<{ data: MeterReading }>(API_ENDPOINTS.METER_READING_BY_ID(id), reading, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  delete: async (id: number) => {
    await api.delete(API_ENDPOINTS.METER_READING_BY_ID(id))
  },
}
