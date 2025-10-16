import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

/**
 * Toast notification types
 */
export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Create context for toast
const ToastContext = createContext()

/**
 * Toast notification component
 */
function Toast({ 
  id, 
  type = TOAST_TYPE.INFO, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  actions = [] 
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 200) // Animation duration
  }, [id, onClose])

  if (!isVisible) return null

  const toastConfig = getToastConfig(type)

  return (
    <div className={`
      transform transition-all duration-200 ease-in-out
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      ${toastConfig.container}
      shadow-lg rounded-lg p-4 max-w-sm w-full
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <toastConfig.icon className={toastConfig.iconClass} />
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-medium ${toastConfig.titleClass}`}>
              {title}
            </p>
          )}
          
          {message && (
            <p className={`text-sm ${toastConfig.messageClass} mt-1`}>
              {message}
            </p>
          )}
          
          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="mt-3 flex items-center space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className={`h-6 w-6 p-0 ${toastConfig.closeButtonClass}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Gets toast configuration based on type
 */
function getToastConfig(type) {
  const configs = {
    [TOAST_TYPE.SUCCESS]: {
      icon: CheckCircle,
      container: 'bg-green-50 border border-green-200',
      iconClass: 'h-5 w-5 text-green-400',
      titleClass: 'text-green-800',
      messageClass: 'text-green-700',
      closeButtonClass: 'text-green-400 hover:text-green-600 hover:bg-green-100'
    },
    [TOAST_TYPE.ERROR]: {
      icon: AlertTriangle,
      container: 'bg-red-50 border border-red-200',
      iconClass: 'h-5 w-5 text-red-400',
      titleClass: 'text-red-800',
      messageClass: 'text-red-700',
      closeButtonClass: 'text-red-400 hover:text-red-600 hover:bg-green-100'
    },
    [TOAST_TYPE.WARNING]: {
      icon: AlertCircle,
      container: 'bg-amber-50 border border-amber-200',
      iconClass: 'h-5 w-5 text-amber-400',
      titleClass: 'text-amber-800',
      messageClass: 'text-amber-700',
      closeButtonClass: 'text-amber-400 hover:text-amber-600 hover:bg-amber-100'
    },
    [TOAST_TYPE.INFO]: {
      icon: Info,
      container: 'bg-blue-50 border border-blue-200',
      iconClass: 'h-5 w-5 text-blue-400',
      titleClass: 'text-blue-800',
      messageClass: 'text-blue-700',
      closeButtonClass: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
    }
  }

  return configs[type] || configs[TOAST_TYPE.INFO]
}

/**
 * Toast container that manages multiple toasts
 */
function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  )
}

/**
 * Toast hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // Return the toast ID for potential removal
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods for different toast types
  const success = useCallback((title, message, options = {}) => {
    return addToast({
      type: TOAST_TYPE.SUCCESS,
      title,
      message,
      ...options
    })
  }, [addToast])

  const error = useCallback((title, message, options = {}) => {
    return addToast({
      type: TOAST_TYPE.ERROR,
      title,
      message,
      ...options
    })
  }, [addToast])

  const warning = useCallback((title, message, options = {}) => {
    return addToast({
      type: TOAST_TYPE.WARNING,
      title,
      message,
      ...options
    })
  }, [addToast])

  const info = useCallback((title, message, options = {}) => {
    return addToast({
      type: TOAST_TYPE.INFO,
      title,
      message,
      ...options
    })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }
}

/**
 * Toast provider component
 */
export function ToastProvider({ children }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        toasts={toast.toasts}
        onClose={toast.removeToast}
      />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

export default Toast
