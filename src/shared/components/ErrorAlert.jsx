import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { AlertTriangle, X, RefreshCw, Info, Wifi, Shield, Server, User, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { ERROR_SEVERITY, ERROR_CATEGORY } from '@/shared/utils/errorHandling'

/**
 * Enhanced Error Alert component with better categorization and user feedback
 */
export default function ErrorAlert({ 
  error, 
  isLoading, 
  onRetry, 
  onDismiss,
  title,
  showRetry = true,
  showDismiss = true,
  className = "",
  variant = "error" // error, warning, info, success
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 text-sm text-gray-600 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
        Loading...
      </div>
    )
  }

  // No error state
  if (!error) {
    return null
  }

  // Determine variant and styling based on error severity/category
  const { 
    variant: errorVariant, 
    icon: ErrorIcon, 
    styles 
  } = getErrorVariant(error, variant)

  // Get user-friendly error summary
  const errorSummary = error.userActionable || error.message
  const canRetry = error.retryable !== false && onRetry
  const showDetails = process.env.NODE_ENV === 'development' && error.originalError

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ErrorIcon className={styles.icon} />
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className={`text-sm font-medium ${styles.title}`}>
                {title || getErrorTitle(error)}
              </h3>
              
              {/* Error category badge */}
              {error.category && error.category !== ERROR_CATEGORY.UNKNOWN && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                  {getCategoryLabel(error.category)}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className={`h-6 w-6 p-0 ${styles.dismissButton}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <p className={`text-sm ${styles.message}`}>
              {error.message}
            </p>
            
            {/* Actionable feedback */}
            {errorSummary && errorSummary !== error.message && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">What you can do:</span> {errorSummary}
                  </div>
                </div>
              </div>
            )}
            
            {/* Development details */}
            {showDetails && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`text-xs ${styles.detailsButton}`}
                >
                  <Info className="h-3 w-3 mr-1" />
                  {isExpanded ? 'Hide' : 'Show'} Technical Details
                </Button>
                
                {isExpanded && (
                  <div className={`mt-2 p-3 rounded text-xs font-mono ${styles.detailsContainer}`}>
                    <div className="space-y-2">
                      <div>
                        <strong>Error Type:</strong> {error.originalError?.constructor?.name || 'Unknown'}
                      </div>
                      <div>
                        <strong>Error Code:</strong> {error.code || 'None'}
                      </div>
                      <div>
                        <strong>Category:</strong> {error.category || 'Unknown'}
                      </div>
                      <div>
                        <strong>Severity:</strong> {error.severity || 'Unknown'}
                      </div>
                      <div>
                        <strong>Retryable:</strong> {error.retryable ? 'Yes' : 'No'}
                      </div>
                      {error.originalError?.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className={`whitespace-pre-wrap mt-1 text-xs ${styles.stackTrace}`}>
                            {error.originalError.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="mt-3 flex items-center space-x-2">
            {canRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                className={styles.retryButton}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}
            
            {/* Additional help actions based on error type */}
            {getHelpActions(error).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className={styles.helpButton}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Determines error variant and styling based on error properties
 */
function getErrorVariant(error, defaultVariant) {
  // Determine variant from error severity/category
  let variant = defaultVariant
  
  if (error.severity === ERROR_SEVERITY.CRITICAL) variant = 'error'
  else if (error.severity === ERROR_SEVERITY.HIGH) variant = 'error'
  else if (error.severity === ERROR_SEVERITY.MEDIUM) variant = 'warning'
  else if (error.severity === ERROR_SEVERITY.LOW) variant = 'info'
  
  // Override based on category for specific cases
  if (error.category === ERROR_CATEGORY.AUTHENTICATION) variant = 'warning'
  if (error.category === ERROR_CATEGORY.AUTHORIZATION) variant = 'error'
  if (error.category === ERROR_CATEGORY.VALIDATION) variant = 'info'

  const variants = {
    error: {
      icon: AlertTriangle,
      container: 'bg-red-50 border border-red-200 rounded-lg p-4',
      title: 'text-red-800',
      message: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
      dismissButton: 'text-red-400 hover:text-red-600 hover:bg-red-100',
      detailsButton: 'text-red-600 hover:text-red-800 hover:bg-red-100',
      detailsContainer: 'bg-red-100 text-red-800',
      stackTrace: 'text-red-700',
      retryButton: 'bg-red-600 hover:bg-red-700 text-white',
      helpButton: 'border-red-300 text-red-700 hover:bg-red-50'
    },
    warning: {
      icon: AlertCircle,
      container: 'bg-amber-50 border border-amber-200 rounded-lg p-4',
      title: 'text-amber-800',
      message: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
      dismissButton: 'text-amber-400 hover:text-amber-600 hover:bg-amber-100',
      detailsButton: 'text-amber-600 hover:text-amber-800 hover:bg-amber-100',
      detailsContainer: 'bg-amber-100 text-amber-800',
      stackTrace: 'text-amber-700',
      retryButton: 'bg-amber-600 hover:bg-amber-700 text-white',
      helpButton: 'border-amber-300 text-amber-700 hover:bg-amber-50'
    },
    info: {
      icon: Info,
      container: 'bg-blue-50 border border-blue-200 rounded-lg p-4',
      title: 'text-blue-800',
      message: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      dismissButton: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100',
      detailsButton: 'text-blue-600 hover:text-blue-800 hover:bg-blue-100',
      detailsContainer: 'bg-blue-100 text-blue-800',
      stackTrace: 'text-blue-700',
      retryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      helpButton: 'border-blue-300 text-blue-700 hover:bg-blue-50'
    },
    success: {
      icon: CheckCircle,
      container: 'bg-green-50 border border-green-200 rounded-lg p-4',
      title: 'text-green-800',
      message: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      dismissButton: 'text-green-400 hover:text-green-600 hover:bg-green-100',
      detailsButton: 'text-green-600 hover:text-green-800 hover:bg-green-100',
      detailsContainer: 'bg-green-100 text-green-800',
      stackTrace: 'text-green-700',
      retryButton: 'bg-green-600 hover:bg-green-700 text-white',
      helpButton: 'border-green-300 text-green-700 hover:bg-green-50'
    }
  }

  return variants[variant] || variants.error
}

/**
 * Gets appropriate error title
 */
function getErrorTitle(error) {
  if (error.severity === ERROR_SEVERITY.CRITICAL) return 'Critical Error'
  if (error.severity === ERROR_SEVERITY.HIGH) return 'Error'
  if (error.severity === ERROR_SEVERITY.MEDIUM) return 'Warning'
  if (error.severity === ERROR_SEVERITY.LOW) return 'Information'
  
  return 'Error'
}

/**
 * Gets category label for display
 */
function getCategoryLabel(category) {
  const labels = {
    [ERROR_CATEGORY.NETWORK]: 'Network',
    [ERROR_CATEGORY.AUTHENTICATION]: 'Authentication',
    [ERROR_CATEGORY.AUTHORIZATION]: 'Authorization',
    [ERROR_CATEGORY.VALIDATION]: 'Validation',
    [ERROR_CATEGORY.SERVER]: 'Server',
    [ERROR_CATEGORY.CLIENT]: 'Client',
    [ERROR_CATEGORY.UNKNOWN]: 'Unknown'
  }
  
  return labels[category] || category
}

/**
 * Gets appropriate help actions based on error type
 */
function getHelpActions(error) {
  const actions = []
  
  // Network errors
  if (error.category === ERROR_CATEGORY.NETWORK) {
    actions.push({
      label: 'Check Connection',
      icon: <Wifi className="h-3 w-3 mr-1" />,
      onClick: () => {
        // Could open network diagnostics or refresh
        window.location.reload()
      }
    })
  }
  
  // Authentication errors
  if (error.category === ERROR_CATEGORY.AUTHENTICATION) {
    actions.push({
      label: 'Sign In Again',
      icon: <User className="h-3 w-3 mr-1" />,
      onClick: () => {
        // Could redirect to login or refresh auth
        window.location.reload()
      }
    })
  }
  
  // Validation errors
  if (error.category === ERROR_CATEGORY.VALIDATION) {
    actions.push({
      label: 'View Guidelines',
      icon: <FileText className="h-3 w-3 mr-1" />,
      onClick: () => {
        // Could open help documentation
        console.log('Open validation guidelines')
      }
    })
  }
  
  // Server errors
  if (error.category === ERROR_CATEGORY.SERVER) {
    actions.push({
      label: 'Check Status',
      icon: <Server className="h-3 w-3 mr-1" />,
      onClick: () => {
        // Could open status page
        window.open('https://status.github.com', '_blank')
      }
    })
  }
  
  return actions
}
