import api from '../lib/api'
import { API_ENDPOINTS } from '../constants'
import type { User } from '../types'

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ access_token: string; token_type: string; expires_in: number }>(
      API_ENDPOINTS.AUTH_LOGIN,
      { email, password }
    )
    return data
  },

  getMe: async () => {
    const { data } = await api.get<{ data: User }>(API_ENDPOINTS.AUTH_ME)
    return data.data
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.AUTH_LOGOUT)
  },
}
