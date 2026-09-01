interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({ label, error, helperText, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error
            ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
            : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500'
        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:border-transparent outline-none transition-all resize-y ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
}
