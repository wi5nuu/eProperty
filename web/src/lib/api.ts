import axios from 'axios'
import { useAuthStore } from '../store/authStore'

let isRedirectingToLogin = false

function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-Request-Id'] = generateRequestId()
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${res.config.method?.toUpperCase()} ${res.config.url} - ${res.status}`)
    }
    return res
  },
  (err) => {
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${err.config?.method?.toUpperCase()} ${err.config?.url} - ${err.response?.status || 'Network Error'}`)
    }
    if (err.response?.status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
