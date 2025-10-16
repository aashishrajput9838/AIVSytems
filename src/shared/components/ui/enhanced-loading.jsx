import React from 'react'
import { cn } from '@/shared/utils/cn'

const loadingVariants = {
  spinner: "animate-spin",
  dots: "animate-pulse",
  bars: "animate-pulse",
  rings: "animate-ping",
  pulse: "animate-pulse-gentle",
  bounce: "animate-bounce",
  wave: "animate-pulse"
}

const loadingSizes = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

const EnhancedSpinner = React.forwardRef(({
  className,
  size = "default",
  variant = "spinner",
  color = "text-amber-600",
  ...props
}, ref) => {
  const baseClasses = cn(
    loadingVariants[variant],
    loadingSizes[size],
    color,
    className
  )

  return (
    <div
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {variant === "spinner" && (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </div>
  )
})

const EnhancedDots = React.forwardRef(({
  className,
  size = "default",
  color = "bg-amber-600",
  ...props
}, ref) => {
  const dotSize = size === "sm" ? "h-1 w-1" : size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5"
  
  return (
    <div
      ref={ref}
      className={cn("flex space-x-1", className)}
      {...props}
    >
      <div className={cn(dotSize, color, "rounded-full animate-bounce")} style={{ animationDelay: "0ms" }} />
      <div className={cn(dotSize, color, "rounded-full animate-bounce")} style={{ animationDelay: "150ms" }} />
      <div className={cn(dotSize, color, "rounded-full animate-bounce")} style={{ animationDelay: "300ms" }} />
    </div>
  )
})

const EnhancedBars = React.forwardRef(({
  className,
  size = "default",
  color = "bg-amber-600",
  ...props
}, ref) => {
  const barSize = size === "sm" ? "h-3 w-1" : size === "lg" ? "h-6 w-2" : "h-4 w-1.5"
  
  return (
    <div
      ref={ref}
      className={cn("flex space-x-1", className)}
      {...props}
    >
      <div className={cn(barSize, color, "rounded animate-pulse")} style={{ animationDelay: "0ms" }} />
      <div className={cn(barSize, color, "rounded animate-pulse")} style={{ animationDelay: "200ms" }} />
      <div className={cn(barSize, color, "rounded animate-pulse")} style={{ animationDelay: "400ms" }} />
    </div>
  )
})

const EnhancedRings = React.forwardRef(({
  className,
  size = "default",
  color = "border-amber-600",
  ...props
}, ref) => {
  const ringSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
  
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      <div className={cn(ringSize, "border-2 border-gray-200 rounded-full")} />
      <div className={cn(ringSize, "border-2 border-t-2", color, "rounded-full animate-spin absolute top-0 left-0")} />
    </div>
  )
})

const EnhancedWave = React.forwardRef(({
  className,
  size = "default",
  color = "bg-amber-600",
  ...props
}, ref) => {
  const waveSize = size === "sm" ? "h-3 w-1" : size === "lg" ? "h-6 w-2" : "h-4 w-1.5"
  
  return (
    <div
      ref={ref}
      className={cn("flex space-x-1", className)}
      {...props}
    >
      <div className={cn(waveSize, color, "rounded animate-pulse")} style={{ animationDelay: "0ms" }} />
      <div className={cn(waveSize, color, "rounded animate-pulse")} style={{ animationDelay: "100ms" }} />
      <div className={cn(waveSize, color, "rounded animate-pulse")} style={{ animationDelay: "200ms" }} />
      <div className={cn(waveSize, color, "rounded animate-pulse")} style={{ animationDelay: "300ms" }} />
      <div className={cn(waveSize, color, "rounded animate-pulse")} style={{ animationDelay: "400ms" }} />
    </div>
  )
})

const EnhancedLoadingText = React.forwardRef(({
  className,
  text = "Loading...",
  loadingComponent,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center space-y-3", className)}
      {...props}
    >
      {loadingComponent}
      <p className="text-sm text-gray-600 animate-pulse">{text}</p>
    </div>
  )
})

const EnhancedSkeleton = React.forwardRef(({
  className,
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "h-4 bg-gray-200 rounded",
    title: "h-6 bg-gray-200 rounded",
    text: "h-4 bg-gray-200 rounded w-full",
    avatar: "h-10 w-10 bg-gray-200 rounded-full",
    button: "h-10 bg-gray-200 rounded-lg",
    card: "h-32 bg-gray-200 rounded-lg"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "animate-pulse",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

EnhancedSpinner.displayName = "EnhancedSpinner"
EnhancedDots.displayName = "EnhancedDots"
EnhancedBars.displayName = "EnhancedBars"
EnhancedRings.displayName = "EnhancedRings"
EnhancedWave.displayName = "EnhancedWave"
EnhancedLoadingText.displayName = "EnhancedLoadingText"
EnhancedSkeleton.displayName = "EnhancedSkeleton"

export {
  EnhancedSpinner,
  EnhancedDots,
  EnhancedBars,
  EnhancedRings,
  EnhancedWave,
  EnhancedLoadingText,
  EnhancedSkeleton,
  loadingVariants,
  loadingSizes
}
