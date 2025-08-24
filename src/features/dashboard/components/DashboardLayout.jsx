import PropTypes from 'prop-types'
import { DashboardHeader, DashboardControls, SearchBar, ErrorDisplay } from './index'
import { StatsSkeleton, TableSkeleton, CardSkeleton } from '@/shared/components/ui'

export default function DashboardLayout({
  children,
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
  onErrorDismiss
}) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100" />
      <div className="relative z-10 mx-auto mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 lg:mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        <main className="p-4 sm:p-6 lg:p-8">
          <DashboardHeader />
          
          <DashboardControls
            showChatGPTMode={showChatGPTMode}
            setShowChatGPTMode={setShowChatGPTMode}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            showTests={showTests}
            setShowTests={setShowTests}
          />

          <SearchBar search={search} setSearch={setSearch} />
          
          <ErrorDisplay 
            error={error} 
            isLoading={isLoading} 
            onRetry={onErrorRetry}
            onDismiss={onErrorDismiss}
          />

          {/* Dashboard Stats Skeleton */}
          {isLoading && (
            <div className="mb-6">
              <StatsSkeleton count={4} />
            </div>
          )}

          <section className="space-y-6">
            {children}
          </section>
        </main>
      </div>
    </div>
  )
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showAddForm: PropTypes.bool.isRequired,
  setShowAddForm: PropTypes.func.isRequired,
  showChatGPTMode: PropTypes.bool.isRequired,
  setShowChatGPTMode: PropTypes.func.isRequired,
  showTests: PropTypes.bool.isRequired,
  setShowTests: PropTypes.func.isRequired,
  onErrorRetry: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired
}
