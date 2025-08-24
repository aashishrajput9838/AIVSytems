import TestHarness from './TestHarness'
import ChatGPTMode from './ChatGPTMode'
import AddLogForm from './AddLogForm'
import LogsTable from './LogsTable'
import { DashboardHeader, DashboardControls, SearchBar, ErrorDisplay } from './components'
import DashboardErrorBoundary from './components/DashboardErrorBoundary'
import useDashboard from './hooks/useDashboard'
import { StatsSkeleton, TableSkeleton, CardSkeleton } from '@/shared/components/ui'

export default function Dashboard() {
  const {
    // State
    search,
    setSearch,
    logs,
    isLoading,
    error,
    setError,
    showAddForm,
    setShowAddForm,
    newLog,
    setNewLog,
    showChatGPTMode,
    setShowChatGPTMode,
    chatHistory,
    currentQuestion,
    setCurrentQuestion,
    currentResponse,
    setCurrentResponse,
    isCapturing,
    isAsking,
    showTests,
    setShowTests,
    isRunningTests,
    testResults,
    sampleTests,
    
    // Functions
    formatTimestamp,
    runAllTests,
    startCapturing,
    stopCapturing,
    onAskModel,
    onCapture,
    handleAddLog,
    approveLog,
    rejectLog
  } = useDashboard()

  const handleErrorRetry = () => {
    // Reload logs on retry
    window.location.reload()
  }

  const handleErrorDismiss = () => {
    // Clear error state
    setError('')
  }

  return (
    <DashboardErrorBoundary>
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

            {showChatGPTMode && (
              <ChatGPTMode
                isCapturing={isCapturing}
                startCapturing={startCapturing}
                stopCapturing={stopCapturing}
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                currentResponse={currentResponse}
                setCurrentResponse={setCurrentResponse}
                isAsking={isAsking}
                onAskModel={onAskModel}
                onCapture={onCapture}
                chatHistory={chatHistory}
              />
            )}

            {showAddForm && (
              <AddLogForm
                isLoading={isLoading}
                newLog={newLog}
                setNewLog={setNewLog}
                onSubmit={handleAddLog}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <SearchBar search={search} setSearch={setSearch} />
            
            <ErrorDisplay 
              error={error} 
              isLoading={isLoading} 
              onRetry={handleErrorRetry}
              onDismiss={handleErrorDismiss}
            />

            {/* Dashboard Stats Skeleton */}
            {isLoading && (
              <div className="mb-6">
                <StatsSkeleton count={4} />
              </div>
            )}

            <section className="space-y-6">
              {showTests && (
                <TestHarness
                  sampleTests={sampleTests}
                  runAllTests={runAllTests}
                  isRunningTests={isRunningTests}
                  testResults={testResults}
                />
              )}
              
              {/* Logs Table with Loading Skeleton */}
              {isLoading ? (
                <div className="space-y-4">
                  <CardSkeleton showActions={false} />
                  <TableSkeleton rows={8} columns={5} />
                </div>
              ) : (
                <LogsTable
                  logs={logs}
                  formatTimestamp={formatTimestamp}
                  approveLog={approveLog}
                  rejectLog={rejectLog}
                />
              )}
            </section>
          </main>
        </div>
      </div>
    </DashboardErrorBoundary>
  )
}
