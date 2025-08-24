import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

const inputVariants = {
  default: "border-gray-300 focus:border-amber-500 focus:ring-amber-500",
  error: "border-red-500 focus:border-red-500 focus:ring-red-500",
  success: "border-green-500 focus:border-green-500 focus:ring-green-500",
  glass: "glass border-white/20 focus:border-white/40 focus:ring-white/20",
  neon: "border-amber-400/50 focus:border-amber-400 focus:ring-amber-400/30 bg-black/20"
}

const inputSizes = {
  default: "h-10 px-3 py-2",
  sm: "h-8 px-2 py-1 text-sm",
  lg: "h-12 px-4 py-3 text-lg",
  xl: "h-14 px-6 py-4 text-xl"
}

const EnhancedInput = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  label,
  error,
  success,
  icon,
  iconPosition = "left",
  floatingLabel = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (props.value || props.defaultValue) {
      setHasValue(true)
    }
  }, [props.value, props.defaultValue])

  const handleFocus = (e) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(e.target.value.length > 0)
    props.onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  const baseClasses = cn(
    "w-full rounded-lg border-2 transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "placeholder:text-gray-400",
    inputVariants[variant],
    inputSizes[size],
    className
  )

  const labelClasses = cn(
    "absolute left-3 transition-all duration-300 pointer-events-none",
    floatingLabel && "transform transition-all duration-300",
    floatingLabel && (isFocused || hasValue) 
      ? "text-xs text-amber-600 -translate-y-6 scale-90" 
      : "text-sm text-gray-500 translate-y-0 scale-100",
    !floatingLabel && "mb-2 block text-sm font-medium text-gray-700"
  )

  const iconClasses = cn(
    "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
    iconPosition === "left" ? "left-3" : "right-3",
    iconPosition === "left" ? "mr-2" : "ml-2"
  )

  const inputPadding = icon 
    ? iconPosition === "left" 
      ? "pl-10" 
      : "pr-10"
    : ""

  return (
    <div className="relative">
      {label && !floatingLabel && (
        <label 
          ref={labelRef}
          className={labelClasses}
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref || inputRef}
          className={cn(baseClasses, inputPadding)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        {floatingLabel && (
          <label 
            ref={labelRef}
            className={labelClasses}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <div className="mt-1 flex items-center space-x-1 animate-shake">
          <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
      
      {success && !error && (
        <div className="mt-1 flex items-center space-x-1 animate-fade-in">
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-green-600">{success}</span>
        </div>
      )}
    </div>
  )
})

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput, inputVariants, inputSizes }
