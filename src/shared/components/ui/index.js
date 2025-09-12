// Enhanced UI Components
export { EnhancedButton, buttonVariants, buttonSizes } from './enhanced-button'
export { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent, 
  EnhancedCardFooter,
  cardVariants 
} from './enhanced-card'
export { EnhancedInput, inputVariants, inputSizes } from './enhanced-input'
export {
  EnhancedSpinner,
  EnhancedDots,
  EnhancedBars,
  EnhancedRings,
  EnhancedWave,
  EnhancedLoadingText,
  EnhancedSkeleton,
  loadingVariants,
  loadingSizes
} from './enhanced-loading'
export { EnhancedProgress, EnhancedCircularProgress, progressVariants, progressSizes } from './enhanced-progress'
export { default as AnimatedBackground } from './animated-background'
export { EnhancedNotification, EnhancedNotificationContainer, notificationVariants } from './enhanced-notification'

// Original UI Components (keeping for backward compatibility)
export { Button } from './button'
export { Card, CardContent } from './card'
export { Input } from './input'
export { Skeleton } from './skeleton'
export { 
  TableSkeleton, 
  CardSkeleton, 
  FormSkeleton, 
  NavigationSkeleton, 
  StatsSkeleton, 
  ListSkeleton, 
  ContentSkeleton, 
  SearchSkeleton, 
  ProfileSkeleton 
} from './skeletons'
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table'
export { default as ConfirmDialog } from './confirm-dialog'
// Note: ProgressIndicator is exported from its original location to avoid circular dependencies
// export { default as ProgressIndicator } from '../ProgressIndicator'
// Note: These components are exported from their original locations to avoid circular dependencies
// export { default as Toast } from '../Toast'
// export { default as ErrorAlert } from '../ErrorAlert'
// export { default as ErrorBoundary } from '../ErrorBoundary'
// export { default as Footer } from '../Footer'
// export { default as HeaderAuth } from '../HeaderAuth'
