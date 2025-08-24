import { memo } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardControls from './DashboardControls'
import SearchBar from './SearchBar'
import ErrorDisplay from './ErrorDisplay'
import { StatsSkeleton } from '@/shared/components/ui'

const DashboardLayout = memo(({
  search,
  setSearch,
  error,
  isLoading,
  showAddForm,
  setShowAddForm,
  showChatGPTMode,
  setShowChatGPTMode,
  showTests,
  setShowTests,
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
          showChatGPTMode={showChatGPTMode}
          setShowChatGPTMode={setShowChatGPTMode}
          showTests={showTests}
          setShowTests={setShowTests}
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
        
        {/* Loading State with Skeleton */}
        {isLoading && !error && (
          <div className="mt-6 space-y-4">
            <StatsSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
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
