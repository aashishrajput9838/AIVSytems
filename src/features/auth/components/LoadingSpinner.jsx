import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'white'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

const variantClasses = {
  default: 'text-gray-600',
  primary: 'text-amber-600',
  white: 'text-white'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <span className={cn('text-sm', variantClasses[variant])}>
          {text}
        </span>
      )}
    </div>
  )
}

export const LoadingOverlay: React.FC<{ children: React.ReactNode; loading: boolean }> = ({
  children,
  loading
}) => {
  if (!loading) return <>{children}</>

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    </div>
  )
}
