import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <Loader2 className="animate-spin text-primary-600" size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
