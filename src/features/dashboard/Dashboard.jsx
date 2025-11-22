import TestHarness from './TestHarness'
import AddLogForm from './AddLogForm'
import LogsTable from './LogsTable'
import DashboardLayout from './components/DashboardLayout'
import DashboardErrorBoundary from './components/DashboardErrorBoundary'
import useDashboard from './hooks/useDashboard'
import { EnhancedSkeleton, CardSkeleton, TableSkeleton } from '@/shared/components/ui'

export default function Dashboard() {
  const {
    search,
    setSearch,
    error,
    isLoading,
    logs,
    handleAddLog,
    handleDeleteLog,
    handleUpdateLog,
    handleTestLog,
    isTestMode,
    setIsTestMode,
    testResults,
    clearTestResults,
    // Add missing UI state and functions
    showAddForm,
    showTests,
    newLog,
    toggleAddForm,
    toggleTests,
    updateNewLog,
    // Add missing logs management functions
    formatTimestamp,
    approveLog,
    rejectLog
  } = useDashboard()

  // Create a wrapper function that matches the expected setNewLog signature
  const handleSetNewLog = (updatedLog) => {
    // updateNewLog expects (field, value) but AddLogForm calls it with an object
    // So we need to handle both cases
    if (typeof updatedLog === 'object' && updatedLog !== null) {
      // If it's an object, update the entire newLog state
      Object.entries(updatedLog).forEach(([field, value]) => {
        updateNewLog(field, value)
      })
    }
  }

  return (
    <DashboardErrorBoundary>
      <DashboardLayout
        search={search}
        setSearch={setSearch}
        error={error}
        isLoading={isLoading}
        logs={logs}
        onAddLog={handleAddLog}
        onDeleteLog={handleDeleteLog}
        onUpdateLog={handleUpdateLog}
        onTestLog={handleTestLog}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        testResults={testResults}
        clearTestResults={clearTestResults}
        // Add missing UI state
        showAddForm={showAddForm}
        setShowAddForm={toggleAddForm}
        showTests={showTests}
        setShowTests={toggleTests}
      >
        {showAddForm && (
          <AddLogForm 
            onSubmit={handleAddLog}
            newLog={newLog}
            setNewLog={handleSetNewLog}
            onCancel={toggleAddForm}
            isFormLoading={isLoading}
            isLoading={isLoading}
          />
        )}
        
        {showTests && (
          <TestHarness
            logs={logs}
            onTest={handleTestLog}
            isTestMode={isTestMode}
            setIsTestMode={setIsTestMode}
            testResults={testResults}
            clearTestResults={clearTestResults}
          />
        )}
        
        <LogsTable
          logs={logs}
          onDelete={handleDeleteLog}
          onUpdate={handleUpdateLog}
          onTest={handleTestLog}
          isLoading={isLoading}
          formatTimestamp={formatTimestamp}
          approveLog={approveLog}
          rejectLog={rejectLog}
        />
      </DashboardLayout>
    </DashboardErrorBoundary>
  )
}