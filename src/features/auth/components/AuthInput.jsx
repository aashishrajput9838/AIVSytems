import React, { forwardRef } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  error?: string
  loading?: boolean
  showPasswordToggle?: boolean
  helperText?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ 
    label, 
    icon: Icon, 
    error, 
    loading, 
    showPasswordToggle, 
    helperText,
    className,
    type = 'text',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-black">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors duration-200',
              Icon && 'pl-10',
              (showPasswordToggle || loading) && 'pr-10',
              error 
                ? 'border-red-300 focus-visible:ring-red-500/50' 
                : 'border-gray-200 hover:border-gray-300',
              className
            )}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
            
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
