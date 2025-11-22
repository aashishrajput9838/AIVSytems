import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardControls({
  showAddForm,
  setShowAddForm
}) {
  return (
    <section 
      className="section-md"
      aria-label="Dashboard control panel"
      role="toolbar"
      aria-orientation="horizontal"
    >
      <div className="layout-row-md">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="bg-black hover:bg-amber-600 hover:text-black text-white focus-ring interactive"
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
      </div>
    </section>
  )
}