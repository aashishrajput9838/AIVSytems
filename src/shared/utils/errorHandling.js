// Error handling utilities

/**
 * Creates a standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {any} originalError - Original error object
 * @returns {Object} Standardized error object
 */
export function createError(message, code = 'UNKNOWN_ERROR', originalError = null) {
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
    originalError,
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Handles API errors and returns user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function handleApiError(error) {
  if (!error) return 'An unknown error occurred'

  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.'
  }

  // Handle HTTP status errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.'
      case 401:
        return 'Authentication required. Please log in again.'
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.'
      case 404:
        return 'Resource not found. The requested data is not available.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Server error. Please try again later.'
      case 503:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return `Server error (${error.status}). Please try again later.`
    }
  }

  // Handle Firebase errors
  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found. Please check your credentials.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/email-already-in-use':
        return 'Email already registered. Please use a different email or sign in.'
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.'
      case 'auth/invalid-email':
        return 'Invalid email address. Please check your email format.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait before trying again.'
      case 'permission-denied':
        return 'Access denied. You don\'t have permission to perform this action.'
      default:
        return error.message || 'An error occurred. Please try again.'
    }
  }

  // Handle validation errors
  if (error.message && error.message.includes('validation')) {
    return 'Please check your input and try again.'
  }

  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Logs errors for debugging and monitoring
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
    ...additionalData
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog)
  }

  // TODO: Send to error reporting service in production
  // Example: Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   // sendToErrorService(errorLog)
  // }
}

/**
 * Wraps async functions with error handling
 * @param {Function} asyncFn - The async function to wrap
 * @param {Function} errorHandler - Custom error handler
 * @returns {Function} Wrapped function with error handling
 */
export function withErrorHandling(asyncFn, errorHandler = null) {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      const userFriendlyError = handleApiError(error)
      
      if (errorHandler) {
        errorHandler(userFriendlyError, error)
      } else {
        console.error('Unhandled error:', error)
      }
      
      throw new Error(userFriendlyError)
    }
  }
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with the function result
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
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
