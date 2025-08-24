import TestHarness from './TestHarness'
import ChatGPTMode from './ChatGPTMode'
import AddLogForm from './AddLogForm'
import LogsTable from './LogsTable'
import { DashboardHeader, DashboardControls, SearchBar, ErrorDisplay } from './components'
import { useDashboard } from './hooks/useDashboard'

export default function Dashboard() {
  const {
    // State
    search,
    setSearch,
    logs,
    isLoading,
    error,
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

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100" />
      <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        <main className="p-8">
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
          
          <ErrorDisplay error={error} isLoading={isLoading} />

          <section className="space-y-6">
            {showTests && (
              <TestHarness
                sampleTests={sampleTests}
                runAllTests={runAllTests}
                isRunningTests={isRunningTests}
                testResults={testResults}
              />
            )}
            <LogsTable
              logs={logs}
              formatTimestamp={formatTimestamp}
              approveLog={approveLog}
              rejectLog={rejectLog}
            />
          </section>
        </main>
      </div>
    </div>
  )
}
