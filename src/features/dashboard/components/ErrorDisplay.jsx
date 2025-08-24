import ErrorAlert from '@/shared/components/ErrorAlert'

export default function ErrorDisplay({ error, isLoading, onRetry, onDismiss }) {
  return (
    <ErrorAlert
      error={error}
      isLoading={isLoading}
      onRetry={onRetry}
      onDismiss={onDismiss}
      title="Dashboard Error"
      showRetry={!!onRetry}
      showDismiss={!!onDismiss}
    />
  )
}
