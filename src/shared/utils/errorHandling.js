// Enhanced Error handling utilities

/**
 * Error severity levels for better user experience
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Error categories for better organization
 */
export const ERROR_CATEGORY = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
}

/**
 * Creates a standardized error object with enhanced context
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {string} category - Error category
 * @param {string} severity - Error severity
 * @param {any} originalError - Original error object
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced error object
 */
export function createError(message, code = 'UNKNOWN_ERROR', category = ERROR_CATEGORY.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, originalError = null, context = {}) {
  return {
    message,
    code,
    category,
    severity,
    timestamp: new Date().toISOString(),
    originalError,
    context,
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userActionable: getActionableMessage(category, code),
    retryable: isRetryable(category, code)
  }
}

/**
 * Determines if an error is retryable
 * @param {string} category - Error category
 * @param {string} code - Error code
 * @returns {boolean} Whether the error can be retried
 */
function isRetryable(category, code) {
  const retryableCategories = [ERROR_CATEGORY.NETWORK, ERROR_CATEGORY.SERVER]
  const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED']
  
  return retryableCategories.includes(category) || retryableCodes.includes(code)
}

/**
 * Gets actionable message for users
 * @param {string} category - Error category
 * @param {string} code - Error code
 * @returns {string} Actionable message
 */
function getActionableMessage(category, code) {
  const actionMap = {
    [ERROR_CATEGORY.NETWORK]: 'Check your internet connection and try again',
    [ERROR_CATEGORY.AUTHENTICATION]: 'Please log in again with your credentials',
    [ERROR_CATEGORY.AUTHORIZATION]: 'Contact your administrator for access permissions',
    [ERROR_CATEGORY.VALIDATION]: 'Please review your input and try again',
    [ERROR_CATEGORY.SERVER]: 'The service is temporarily unavailable. Please try again later',
    [ERROR_CATEGORY.CLIENT]: 'Please refresh the page and try again',
    [ERROR_CATEGORY.UNKNOWN]: 'Please try again or contact support if the problem persists'
  }
  
  return actionMap[category] || actionMap[ERROR_CATEGORY.UNKNOWN]
}

/**
 * Enhanced API error handler with better categorization
 * @param {Error} error - The error object
 * @param {Object} context - Additional context for better error handling
 * @returns {Object} Enhanced error object with user-friendly message and context
 */
export function handleApiError(error, context = {}) {
  if (!error) {
    return createError(
      'An unknown error occurred',
      'UNKNOWN_ERROR',
      ERROR_CATEGORY.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      null,
      context
    )
  }

  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return createError(
      'Network error. Please check your internet connection and try again.',
      'NETWORK_ERROR',
      ERROR_CATEGORY.NETWORK,
      ERROR_SEVERITY.MEDIUM,
      error,
      { ...context, retryable: true }
    )
  }

  // Handle HTTP status errors
  if (error.status) {
    const statusError = handleHttpStatusError(error.status, error, context)
    return statusError
  }

  // Handle Firebase errors
  if (error.code) {
    const firebaseError = handleFirebaseError(error.code, error, context)
    return firebaseError
  }

  // Handle validation errors
  if (error.message && error.message.includes('validation')) {
    return createError(
      'Please check your input and try again.',
      'VALIDATION_ERROR',
      ERROR_CATEGORY.VALIDATION,
      ERROR_SEVERITY.LOW,
      error,
      { ...context, field: extractFieldFromError(error) }
    )
  }

  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return createError(
      'Request timed out. Please try again.',
      'TIMEOUT_ERROR',
      ERROR_CATEGORY.NETWORK,
      ERROR_SEVERITY.MEDIUM,
      error,
      { ...context, retryable: true }
    )
  }

  // Default error message
  return createError(
    error.message || 'An unexpected error occurred. Please try again.',
    'UNEXPECTED_ERROR',
    ERROR_CATEGORY.UNKNOWN,
    ERROR_SEVERITY.MEDIUM,
    error,
    context
  )
}

/**
 * Handles HTTP status errors with specific context
 * @param {number} status - HTTP status code
 * @param {Error} error - Original error
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced error object
 */
function handleHttpStatusError(status, error, context) {
  const statusMap = {
    400: {
      message: 'Invalid request. Please check your input and try again.',
      category: ERROR_CATEGORY.CLIENT,
      severity: ERROR_SEVERITY.LOW,
      code: 'BAD_REQUEST'
    },
    401: {
      message: 'Authentication required. Please log in again.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'UNAUTHORIZED'
    },
    403: {
      message: 'Access denied. You don\'t have permission to perform this action.',
      category: ERROR_CATEGORY.AUTHORIZATION,
      severity: ERROR_SEVERITY.HIGH,
      code: 'FORBIDDEN'
    },
    404: {
      message: 'Resource not found. The requested data is not available.',
      category: ERROR_CATEGORY.CLIENT,
      severity: ERROR_SEVERITY.LOW,
      code: 'NOT_FOUND'
    },
    409: {
      message: 'Conflict detected. The resource already exists or has been modified.',
      category: ERROR_CATEGORY.CLIENT,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'CONFLICT'
    },
    422: {
      message: 'Invalid data provided. Please check your input and try again.',
      category: ERROR_CATEGORY.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      code: 'UNPROCESSABLE_ENTITY'
    },
    429: {
      message: 'Too many requests. Please wait a moment and try again.',
      category: ERROR_CATEGORY.CLIENT,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'RATE_LIMITED',
      retryable: true
    },
    500: {
      message: 'Server error. Please try again later.',
      category: ERROR_CATEGORY.SERVER,
      severity: ERROR_SEVERITY.HIGH,
      code: 'INTERNAL_SERVER_ERROR',
      retryable: true
    },
    502: {
      message: 'Bad gateway. The service is temporarily unavailable.',
      category: ERROR_CATEGORY.SERVER,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'BAD_GATEWAY',
      retryable: true
    },
    503: {
      message: 'Service temporarily unavailable. Please try again later.',
      category: ERROR_CATEGORY.SERVER,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'SERVICE_UNAVAILABLE',
      retryable: true
    },
    504: {
      message: 'Gateway timeout. The service is taking longer than expected.',
      category: ERROR_CATEGORY.SERVER,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'GATEWAY_TIMEOUT',
      retryable: true
    }
  }

  const statusError = statusMap[status] || {
    message: `Server error (${status}). Please try again later.`,
    category: ERROR_CATEGORY.SERVER,
    severity: ERROR_SEVERITY.MEDIUM,
    code: 'HTTP_ERROR'
  }

  return createError(
    statusError.message,
    statusError.code,
    statusError.category,
    statusError.severity,
    error,
    { ...context, retryable: statusError.retryable || false }
  )
}

/**
 * Handles Firebase-specific errors
 * @param {string} code - Firebase error code
 * @param {Error} error - Original error
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced error object
 */
function handleFirebaseError(code, error, context) {
  const firebaseErrorMap = {
    'auth/user-not-found': {
      message: 'User not found. Please check your credentials.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'USER_NOT_FOUND'
    },
    'auth/wrong-password': {
      message: 'Incorrect password. Please try again.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.LOW,
      code: 'WRONG_PASSWORD'
    },
    'auth/email-already-in-use': {
      message: 'Email already registered. Please use a different email or sign in.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'EMAIL_IN_USE'
    },
    'auth/weak-password': {
      message: 'Password is too weak. Please choose a stronger password.',
      category: ERROR_CATEGORY.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      code: 'WEAK_PASSWORD'
    },
    'auth/invalid-email': {
      message: 'Invalid email address. Please check your email format.',
      category: ERROR_CATEGORY.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      code: 'INVALID_EMAIL'
    },
    'auth/too-many-requests': {
      message: 'Too many failed attempts. Please wait before trying again.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'TOO_MANY_ATTEMPTS',
      retryable: true
    },
    'auth/user-disabled': {
      message: 'Your account has been disabled. Please contact support.',
      category: ERROR_CATEGORY.AUTHENTICATION,
      severity: ERROR_SEVERITY.HIGH,
      code: 'USER_DISABLED'
    },
    'permission-denied': {
      message: 'Access denied. You don\'t have permission to perform this action.',
      category: ERROR_CATEGORY.AUTHORIZATION,
      severity: ERROR_SEVERITY.HIGH,
      code: 'PERMISSION_DENIED'
    },
    'unavailable': {
      message: 'Service temporarily unavailable. Please try again later.',
      category: ERROR_CATEGORY.SERVER,
      severity: ERROR_SEVERITY.MEDIUM,
      code: 'SERVICE_UNAVAILABLE',
      retryable: true
    }
  }

  const firebaseError = firebaseErrorMap[code] || {
    message: error.message || 'An authentication error occurred. Please try again.',
    category: ERROR_CATEGORY.AUTHENTICATION,
    severity: ERROR_SEVERITY.MEDIUM,
    code: 'AUTH_ERROR'
  }

  return createError(
    firebaseError.message,
    firebaseError.code,
    firebaseError.category,
    firebaseError.severity,
    error,
    { ...context, retryable: firebaseError.retryable || false }
  )
}

/**
 * Extracts field information from validation errors
 * @param {Error} error - The error object
 * @returns {string|null} Field name if available
 */
function extractFieldFromError(error) {
  if (error.field) return error.field
  if (error.message && error.message.includes('field')) {
    const match = error.message.match(/field\s+['"`]([^'"`]+)['"`]/i)
    return match ? match[1] : null
  }
  return null
}

/**
 * Enhanced error logging with better context and categorization
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export function logError(error, context = 'Unknown', additionalData = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    status: error.status,
    category: error.category || ERROR_CATEGORY.UNKNOWN,
    severity: error.severity || ERROR_SEVERITY.MEDIUM,
    userActionable: error.userActionable,
    retryable: error.retryable,
    ...additionalData
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Enhanced Error Log:', errorLog)
    
    // Group related error information
    console.group('Error Details')
    console.error('Message:', error.message)
    console.error('Category:', error.category)
    console.error('Severity:', error.severity)
    console.error('User Actionable:', error.userActionable)
    console.error('Retryable:', error.retryable)
    console.error('Context:', context)
    console.groupEnd()
  }

  // TODO: Send to error reporting service in production
  // Example: Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   // sendToErrorService(errorLog)
  // }
}

/**
 * Enhanced async function wrapper with better error handling
 * @param {Function} asyncFn - The async function to wrap
 * @param {Function} errorHandler - Custom error handler
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function with enhanced error handling
 */
export function withErrorHandling(asyncFn, errorHandler = null, options = {}) {
  const { 
    context = 'Unknown',
    retryCount = 0,
    retryDelay = 1000,
    onRetry = null
  } = options

  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      const enhancedError = handleApiError(error, { context, ...options })
      
      if (errorHandler) {
        errorHandler(enhancedError, error)
      } else {
        logError(enhancedError, context, options)
      }
      
      throw enhancedError
    }
  }
}

/**
 * Smart retry function with exponential backoff and error categorization
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Promise that resolves with the function result
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    jitter = true,
    shouldRetry = null
  } = options

  let lastError
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      attempt++
      
      // Check if we should retry based on error type
      if (shouldRetry && !shouldRetry(error)) {
        throw error
      }
      
      // Check if error is retryable
      if (error.retryable === false) {
        throw error
      }
      
      if (attempt > maxRetries) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(factor, attempt - 1),
        maxDelay
      )
      
      // Add jitter to prevent thundering herd
      const finalDelay = jitter ? delay + Math.random() * 1000 : delay
      
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries} in ${Math.round(finalDelay)}ms`)
      
      await new Promise(resolve => setTimeout(resolve, finalDelay))
    }
  }

  throw lastError
}

/**
 * Validates error objects
 * @param {any} error - The error to validate
 * @returns {boolean} True if it's a valid error object
 */
export function isValidError(error) {
  return error && (
    error instanceof Error ||
    (typeof error === 'object' && error.message) ||
    typeof error === 'string'
  )
}

/**
 * Creates a user-friendly error summary
 * @param {Object} error - The enhanced error object
 * @returns {Object} User-friendly error summary
 */
export function createUserErrorSummary(error) {
  return {
    title: getErrorTitle(error.severity),
    message: error.message,
    action: error.userActionable,
    canRetry: error.retryable,
    severity: error.severity,
    category: error.category
  }
}

/**
 * Gets appropriate error title based on severity
 * @param {string} severity - Error severity
 * @returns {string} Error title
 */
function getErrorTitle(severity) {
  const titleMap = {
    [ERROR_SEVERITY.LOW]: 'Information',
    [ERROR_SEVERITY.MEDIUM]: 'Warning',
    [ERROR_SEVERITY.HIGH]: 'Error',
    [ERROR_SEVERITY.CRITICAL]: 'Critical Error'
  }
  
  return titleMap[severity] || 'Error'
}
