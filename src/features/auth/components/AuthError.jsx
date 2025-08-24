import React from 'react'
import { AlertCircle, X, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const severityClasses = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const severityIcons = {
  error: AlertCircle,
  warning: AlertCircle,
  info: AlertCircle
}

export const AuthError = ({
  error,
  severity = 'error',
  onRetry,
  onDismiss,
  className
}) => {
  const Icon = severityIcons[severity]

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-lg border',
      severityClasses[severity],
      className
    )}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {severity === 'error' && 'Authentication Error'}
          {severity === 'warning' && 'Authentication Warning'}
          {severity === 'info' && 'Authentication Info'}
        </p>
        <p className="text-sm mt-1">{error}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            title="Retry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export const AuthSuccess = ({
  message,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200 text-green-800',
      className
    )}>
      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
