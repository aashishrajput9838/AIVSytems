import TestHarness from './TestHarness'
import ChatGPTMode from './ChatGPTMode'
import AddLogForm from './AddLogForm'
import LogsTable from './LogsTable'
import DashboardLayout from './components/DashboardLayout'
import DashboardErrorBoundary from './components/DashboardErrorBoundary'
import useDashboard from './hooks/useDashboard'
import { TableSkeleton, CardSkeleton } from '@/shared/components/ui'

export default function Dashboard() {
  const {
    // Logs Management
    logs,
    isLoading,
    error,
    setError,
    formatTimestamp,
    approveLog,
    rejectLog,
    progress,
    progressMessage,

    // ChatGPT Mode
    chatHistory,
    currentQuestion,
    setCurrentQuestion,
    currentResponse,
    setCurrentResponse,
    isCapturing,
    isAsking,
    startCapturing,
    stopCapturing,
    onAskModel,
    onCapture,

    // Test Management
    isRunningTests,
    testResults,
    sampleTests,
    runAllTests,

    // UI State
    search,
    setSearch,
    showAddForm,
    showChatGPTMode,
    showTests,
    newLog,
    setNewLog,
    toggleAddForm,

    // Combined functions
    handleAddLog
  } = useDashboard()

  const handleErrorRetry = () => {
    // Reload logs on retry
    window.location.reload()
  }

  const handleErrorDismiss = () => {
    // Clear error state
    setError('')
  }

  const handleAddFormCancel = () => {
    toggleAddForm()
  }

  return (
    <DashboardErrorBoundary>
      <DashboardLayout
        search={search}
        setSearch={setSearch}
        error={error}
        isLoading={isLoading}
        showAddForm={showAddForm}
        setShowAddForm={toggleAddForm} // Use toggleAddForm here
        showChatGPTMode={showChatGPTMode}
        setShowChatGPTMode={setShowChatGPTMode} // This should probably be toggleChatGPTMode
        showTests={showTests} // This should probably be toggleTests
        onErrorRetry={handleErrorRetry}
        onErrorDismiss={handleErrorDismiss}
        progress={progress}
        progressMessage={progressMessage}
      >
        {/* ChatGPT Mode */}
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

        {/* Add Log Form */}
        {showAddForm && (
          <AddLogForm
            isLoading={isLoading}
            newLog={newLog}
            setNewLog={setNewLog}
            onSubmit={handleAddLog}
            onCancel={handleAddFormCancel}
          />
        )}

        {/* Test Harness */}
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
      </DashboardLayout>
    </DashboardErrorBoundary>
  )
}
