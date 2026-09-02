import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { isTokenExpired } from '../utils/jwt'

export function useInitializeApp() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Check authentication status and token expiration
    const token = useAuthStore.getState().token
    if (token && isTokenExpired(token)) {
      useAuthStore.getState().logout()
    }
  }, [])
}
