import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { DashboardStats } from '../types/dashboard'

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get<{ data: DashboardStats }>(API_ENDPOINTS.DASHBOARD_STATS)
    return data.data
  },
}
