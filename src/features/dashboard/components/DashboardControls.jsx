import { Button } from '@/shared/components/ui/button'
import { MessageSquare, Plus, FileText } from 'lucide-react'

export default function DashboardControls({
  showChatGPTMode,
  setShowChatGPTMode,
  showAddForm,
  setShowAddForm,
  showTests,
  setShowTests
}) {
  return (
    <section 
      className="mb-8 flex gap-4"
      aria-label="Dashboard control panel"
      role="toolbar"
      aria-orientation="horizontal"
    >
      <Button 
        onClick={() => setShowChatGPTMode(!showChatGPTMode)} 
        variant="outline" 
        className="border-gray-300 text-gray-700 hover:bg-amber-50"
        aria-label={showChatGPTMode ? 'Exit ChatGPT Mode' : 'Enter ChatGPT Mode'}
        aria-pressed={showChatGPTMode}
        aria-describedby="chatgpt-mode-description"
      >
        <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
        {showChatGPTMode ? 'Exit ChatGPT Mode' : 'ChatGPT Mode'}
      </Button>
      <span id="chatgpt-mode-description" className="sr-only">
        Toggle ChatGPT mode for AI-powered interactions
      </span>
      
      <Button 
        onClick={() => setShowAddForm(!showAddForm)} 
        className="bg-black hover:bg-amber-600 hover:text-black text-white"
        aria-label={showAddForm ? 'Cancel adding log entry' : 'Add new log entry'}
        aria-pressed={showAddForm}
        aria-describedby="add-log-description"
      >
        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
        {showAddForm ? 'Cancel' : 'Add Log'}
      </Button>
      <span id="add-log-description" className="sr-only">
        {showAddForm ? 'Cancel the form for adding a new log entry' : 'Open form to add a new log entry'}
      </span>
      
      <Button 
        onClick={() => setShowTests(!showTests)} 
        variant="outline" 
        className="border-gray-300 text-gray-700 hover:bg-amber-50"
        aria-label={showTests ? 'Hide test harness' : 'Show test harness'}
        aria-pressed={showTests}
        aria-describedby="test-harness-description"
      >
        <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
        {showTests ? 'Hide Tests' : 'Test Harness'}
      </Button>
      <span id="test-harness-description" className="sr-only">
        Toggle the test harness for running validation tests
      </span>
    </section>
  )
}
