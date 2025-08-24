import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { AlertTriangle, X, RefreshCw, Info } from 'lucide-react'

export default function ErrorAlert({ 
  error, 
  isLoading, 
  onRetry, 
  onDismiss,
  title = "Error",
  showRetry = true,
  showDismiss = true,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 text-sm text-gray-600 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
        Loading...
      </div>
    )
  }

  if (!error) {
    return null
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800">
              {title}
            </h3>
            
            <div className="flex items-center space-x-2">
              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-red-700">
              {error}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-red-600 hover:text-red-800 hover:bg-red-100"
                >
                  <Info className="h-3 w-3 mr-1" />
                  {isExpanded ? 'Hide' : 'Show'} Details
                </Button>
                
                {isExpanded && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800">
                    <div className="mb-1">
                      <strong>Error Type:</strong> {error.constructor.name}
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="whitespace-pre-wrap mt-1 text-xs">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {showRetry && onRetry && (
            <div className="mt-3">
              <Button
                size="sm"
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
