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
    <section className="mb-8 flex gap-4">
      <Button 
        onClick={() => setShowChatGPTMode(!showChatGPTMode)} 
        variant="outline" 
        className="border-gray-300 text-gray-700 hover:bg-amber-50"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {showChatGPTMode ? 'Exit ChatGPT Mode' : 'ChatGPT Mode'}
      </Button>
      <Button 
        onClick={() => setShowAddForm(!showAddForm)} 
        className="bg-black hover:bg-amber-600 hover:text-black text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        {showAddForm ? 'Cancel' : 'Add Log'}
      </Button>
      <Button 
        onClick={() => setShowTests(!showTests)} 
        variant="outline" 
        className="border-gray-300 text-gray-700 hover:bg-amber-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        {showTests ? 'Hide Tests' : 'Test Harness'}
      </Button>
    </section>
  )
}
