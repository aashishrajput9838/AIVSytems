import ErrorAlert from '@/shared/components/ErrorAlert'
import { ProgressIndicator, PROGRESS_STATE } from '@/shared/components/ProgressIndicator'

export default function ErrorDisplay({ 
  error, 
  isLoading, 
  onRetry, 
  onDismiss,
  progress = 0,
  progressState = PROGRESS_STATE.LOADING,
  progressMessage = '',
  progressTitle = ''
}) {
  // Show progress indicator when loading with progress
  if (isLoading && progress > 0) {
    return (
      <ProgressIndicator
        state={progressState}
        progress={progress}
        message={progressMessage}
        title={progressTitle}
        size="default"
        className="mb-4"
      />
    )
  }

  // Show enhanced error alert
  return (
    <ErrorAlert
      error={error}
      isLoading={isLoading}
      onRetry={onRetry}
      onDismiss={onDismiss}
      title={getErrorTitle(error)}
      showRetry={!!onRetry}
      showDismiss={!!onDismiss}
    />
  )
}

/**
 * Gets appropriate error title based on error context
 */
function getErrorTitle(error) {
  if (!error) return 'Dashboard Error'
  
  // Use error category for better context
  if (error.category === 'network') return 'Connection Error'
  if (error.category === 'authentication') return 'Authentication Error'
  if (error.category === 'authorization') return 'Access Denied'
  if (error.category === 'validation') return 'Validation Error'
  if (error.category === 'server') return 'Server Error'
  if (error.category === 'client') return 'Client Error'
  
  return 'Dashboard Error'
}
