import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useInitializeApp } from './hooks/useInitializeApp'
import App from './App'
import './index.css'

function Root() {
  useInitializeApp()

  return (
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
