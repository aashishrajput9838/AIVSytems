import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

const notificationVariants = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
    iconClassName: "text-green-500"
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800",
    iconClassName: "text-red-500"
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    iconClassName: "text-yellow-500"
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800",
    iconClassName: "text-blue-500"
  }
}

const EnhancedNotification = React.forwardRef(({
  className,
  variant = "info",
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
  position = "top-right",
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(show)
  const [isExiting, setIsExiting] = useState(false)
  const timeoutRef = useRef(null)
  const variantConfig = notificationVariants[variant]
  const Icon = variantConfig.icon

  useEffect(() => {
    if (show && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [show, duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, duration)
    }
  }

  if (!isVisible) return null

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 max-w-sm w-full",
        positionClasses[position],
        "animate-fade-in"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={cn(
          "relative p-4 border rounded-lg shadow-lg backdrop-blur-sm",
          "transition-all duration-300",
          isExiting ? "animate-fade-out scale-95" : "animate-fade-in scale-100",
          variantConfig.className,
          className
        )}
      >
        <div className="flex items-start space-x-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", variantConfig.iconClassName)} />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-medium mb-1">{title}</h4>
            )}
            {message && (
              <p className="text-sm">{message}</p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current transition-all duration-300 ease-linear"
              style={{
                width: isExiting ? '0%' : '100%',
                transitionDuration: isExiting ? '300ms' : `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
})

const EnhancedNotificationContainer = React.forwardRef(({
  className,
  children,
  position = "top-right",
  ...props
}, ref) => {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 space-y-2",
        positionClasses[position],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

EnhancedNotification.displayName = "EnhancedNotification"
EnhancedNotificationContainer.displayName = "EnhancedNotificationContainer"

export { EnhancedNotification, EnhancedNotificationContainer, notificationVariants }
