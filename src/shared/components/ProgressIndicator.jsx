import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react'

/**
 * Progress indicator states
 */
export const PROGRESS_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
}

/**
 * Progress indicator component for better user feedback
 */
export default function ProgressIndicator({
  state = PROGRESS_STATE.IDLE,
  progress = 0, // 0-100
  message = '',
  title = '',
  showPercentage = true,
  size = 'default', // small, default, large
  variant = 'default', // default, success, warning, error
  onComplete,
  className = ''
}) {
  const [localProgress, setLocalProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate progress changes
  useEffect(() => {
    if (progress !== localProgress) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setLocalProgress(progress)
        setIsAnimating(false)
        
        // Trigger onComplete when progress reaches 100%
        if (progress === 100 && onComplete) {
          onComplete()
        }
      }, 150) // Small delay for smooth animation
      
      return () => clearTimeout(timer)
    }
  }, [progress, localProgress, onComplete])

  // Auto-reset success state after delay
  useEffect(() => {
    if (state === PROGRESS_STATE.SUCCESS) {
      const timer = setTimeout(() => {
        // Could emit an event to reset state
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [state])

  if (state === PROGRESS_STATE.IDLE) return null

  const config = getProgressConfig(state, variant, size)
  const progressWidth = `${localProgress}%`

  return (
    <div className={`${config.container} ${className}`}>
      {/* Header */}
      {(title || message) && (
        <div className="mb-3">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleClass}`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-sm ${config.messageClass} mt-1`}>
              {message}
            </p>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className={`${config.progressBar} h-2 rounded-full overflow-hidden`}>
          <div
            className={`${config.progressFill} h-full transition-all duration-300 ease-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ width: progressWidth }}
          />
        </div>
        
        {/* Progress percentage */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-medium ${config.percentageClass}`}>
              {Math.round(localProgress)}%
            </span>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <config.icon className={config.iconClass} />
          <span className={`text-xs ${config.statusClass}`}>
            {getStatusText(state, localProgress)}
          </span>
        </div>
        
        {/* Progress value */}
        <span className={`text-xs ${config.valueClass}`}>
          {localProgress}/100
        </span>
      </div>
    </div>
  )
}

/**
 * Gets progress configuration based on state, variant, and size
 */
function getProgressConfig(state, variant, size) {
  const sizeConfigs = {
    small: {
      container: 'p-3',
      progressBar: 'h-1.5',
      icon: 'h-3 w-3',
      text: 'text-xs'
    },
    default: {
      container: 'p-4',
      progressBar: 'h-2',
      icon: 'h-4 w-4',
      text: 'text-sm'
    },
    large: {
      container: 'p-5',
      progressBar: 'h-3',
      icon: 'h-5 w-5',
      text: 'text-base'
    }
  }

  const sizeConfig = sizeConfigs[size] || sizeConfigs.default

  const stateConfigs = {
    [PROGRESS_STATE.LOADING]: {
      container: 'bg-blue-50 border border-blue-200',
      titleClass: 'text-blue-800',
      messageClass: 'text-blue-700',
      progressBar: 'bg-blue-100',
      progressFill: 'bg-blue-600',
      percentageClass: 'text-blue-800',
      statusClass: 'text-blue-700',
      valueClass: 'text-blue-600',
      iconClass: 'text-blue-500',
      icon: Loader2
    },
    [PROGRESS_STATE.SUCCESS]: {
      container: 'bg-green-50 border border-green-200',
      titleClass: 'text-green-800',
      messageClass: 'text-green-700',
      progressBar: 'bg-green-100',
      progressFill: 'bg-green-600',
      percentageClass: 'text-green-800',
      statusClass: 'text-green-700',
      valueClass: 'text-green-600',
      iconClass: 'text-green-500',
      icon: CheckCircle
    },
    [PROGRESS_STATE.ERROR]: {
      container: 'bg-red-50 border border-red-200',
      titleClass: 'text-red-800',
      messageClass: 'text-red-700',
      progressBar: 'bg-red-100',
      progressFill: 'bg-red-600',
      percentageClass: 'text-red-800',
      statusClass: 'text-red-700',
      valueClass: 'text-red-600',
      iconClass: 'text-red-500',
      icon: AlertCircle
    },
    [PROGRESS_STATE.WARNING]: {
      container: 'bg-amber-50 border border-amber-200',
      titleClass: 'text-amber-800',
      messageClass: 'text-amber-700',
      progressBar: 'bg-amber-100',
      progressFill: 'bg-amber-600',
      percentageClass: 'text-amber-800',
      statusClass: 'text-amber-700',
      valueClass: 'text-amber-600',
      iconClass: 'text-amber-500',
      icon: Clock
    }
  }

  const stateConfig = stateConfigs[state] || stateConfigs[PROGRESS_STATE.LOADING]

  return {
    ...sizeConfig,
    ...stateConfig
  }
}

/**
 * Gets status text based on state and progress
 */
function getStatusText(state, progress) {
  switch (state) {
    case PROGRESS_STATE.LOADING:
      if (progress === 0) return 'Starting...'
      if (progress < 25) return 'Initializing...'
      if (progress < 50) return 'Processing...'
      if (progress < 75) return 'Almost done...'
      if (progress < 100) return 'Finalizing...'
      return 'Complete!'
    case PROGRESS_STATE.SUCCESS:
      return 'Success!'
    case PROGRESS_STATE.ERROR:
      return 'Error occurred'
    case PROGRESS_STATE.WARNING:
      return 'Warning'
    default:
      return 'Ready'
  }
}

/**
 * Linear progress indicator for simple progress display
 */
export function LinearProgress({ 
  progress = 0, 
  state = PROGRESS_STATE.LOADING,
  size = 'default',
  className = ''
}) {
  const config = getProgressConfig(state, 'default', size)
  
  return (
    <div className={`${className}`}>
      <div className={`${config.progressBar} rounded-full overflow-hidden`}>
        <div
          className={`${config.progressFill} h-full transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Circular progress indicator
 */
export function CircularProgress({ 
  progress = 0, 
  state = PROGRESS_STATE.LOADING,
  size = 'default',
  className = ''
}) {
  const config = getProgressConfig(state, 'default', size)
  const radius = size === 'small' ? 16 : size === 'large' ? 32 : 24
  const strokeWidth = size === 'small' ? 2 : size === 'large' ? 4 : 3
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={config.progressBar.replace('bg-', '')}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={config.progressFill.replace('bg-', '')}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute">
        <span className={`text-xs font-medium ${config.percentageClass}`}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}
