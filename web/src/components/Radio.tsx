interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className={`w-4 h-4 border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 ${className}`}
        {...props}
      />
      {label && (
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      )}
    </label>
  )
}
