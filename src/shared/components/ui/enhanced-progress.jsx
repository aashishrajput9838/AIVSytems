import React, { useState, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

const progressVariants = {
  default: "bg-amber-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  gradient: "bg-gradient-to-r from-amber-500 to-orange-500"
}

const progressSizes = {
  sm: "h-1",
  default: "h-2",
  lg: "h-3",
  xl: "h-4"
}

const EnhancedProgress = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  variant = "default",
  size = "default",
  showLabel = false,
  animated = true,
  striped = false,
  children,
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  const baseClasses = cn(
    "relative overflow-hidden rounded-full bg-gray-200",
    progressSizes[size],
    className
  )

  const progressClasses = cn(
    "h-full transition-all duration-1000 ease-out",
    progressVariants[variant],
    striped && "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px] animate-pulse"
  )

  return (
    <div className="w-full">
      <div
        ref={ref}
        className={baseClasses}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={progressClasses}
          style={{ width: `${displayValue}%` }}
        />
        
        {striped && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              backgroundSize: '20px 20px',
              animation: 'moveStripes 2s linear infinite'
            }}
          />
        )}
      </div>
      
      {showLabel && (
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>{children || `${Math.round(percentage)}%`}</span>
          <span>{value} / {max}</span>
        </div>
      )}
      
      {striped && (
        <div className="animate-move-stripes" />
      )}
    </div>
  )
})

const EnhancedCircularProgress = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  variant = "default",
  size = "default",
  showLabel = false,
  animated = true,
  strokeWidth = 4,
  children,
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: 40,
    default: 60,
    lg: 80,
    xl: 100
  }
  
  const radius = sizes[size] / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (displayValue / 100) * circumference

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  const baseClasses = cn(
    "relative inline-flex items-center justify-center",
    className
  )

  const progressClasses = cn(
    "transition-all duration-1000 ease-out",
    progressVariants[variant]
  )

  return (
    <div className="inline-flex flex-col items-center">
      <div
        ref={ref}
        className={baseClasses}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={sizes[size]}
          height={sizes[size]}
        >
          {/* Background circle */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className={progressClasses}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (showLabel && (
            <span className="text-sm font-medium text-gray-700">
              {Math.round(percentage)}%
            </span>
          ))}
        </div>
      </div>
      
      {showLabel && !children && (
        <div className="mt-2 text-sm text-gray-600">
          {value} / {max}
        </div>
      )}
    </div>
  )
})

EnhancedProgress.displayName = "EnhancedProgress"
EnhancedCircularProgress.displayName = "EnhancedCircularProgress"

export { EnhancedProgress, EnhancedCircularProgress, progressVariants, progressSizes }
