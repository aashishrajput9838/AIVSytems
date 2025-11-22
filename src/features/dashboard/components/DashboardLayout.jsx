import { memo } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardControls from './DashboardControls'
import SearchBar from './SearchBar'
import ErrorDisplay from './ErrorDisplay'
import { EnhancedSkeleton } from '@/shared/components/ui'

const DashboardLayout = memo(({
  search,
  setSearch,
  error,
  isLoading,
  showAddForm,
  setShowAddForm,
  onErrorRetry,
  onErrorDismiss,
  progress = 0,
  progressMessage = '',
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardControls
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
        
        <div className="mt-6">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search logs..."
          />
        </div>
        
        {/* Enhanced Error Display with Progress */}
        {error && (
          <div className="mt-6">
            <ErrorDisplay
              error={error}
              isLoading={isLoading}
              onRetry={onErrorRetry}
              onDismiss={onErrorDismiss}
              progress={progress}
              progressMessage={progressMessage}
            />
          </div>
        )}
        
        {/* Loading State with Enhanced Skeleton */}
        {isLoading && !error && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-stagger-1" style={{ animationDelay: `${i * 100}ms` }}>
                  <EnhancedSkeleton variant="card" className="h-24" />
                </div>
              ))}
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-stagger-3">
                <EnhancedSkeleton variant="title" className="mb-4" />
                <EnhancedSkeleton variant="text" className="mb-2" />
                <EnhancedSkeleton variant="text" className="mb-2 w-5/6" />
                <EnhancedSkeleton variant="text" className="w-4/6" />
              </div>
              <div className="animate-stagger-4">
                <EnhancedSkeleton variant="title" className="mb-4" />
                <EnhancedSkeleton variant="text" className="mb-2" />
                <EnhancedSkeleton variant="text" className="mb-2 w-3/4" />
                <EnhancedSkeleton variant="text" className="w-2/3" />
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        {!isLoading && !error && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'

export default DashboardLayout