import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

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
    // Check authentication status
    const token = useAuthStore.getState().token
    if (token) {
      // Token exists, could validate it here
      console.log('[App] User is authenticated')
    }
  }, [])
}
