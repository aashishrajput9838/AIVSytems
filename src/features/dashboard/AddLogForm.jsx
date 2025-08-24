import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'

export default function AddLogForm({ isLoading, newLog, setNewLog, onSubmit, onCancel }) {
  return (
    <section className="mb-8">
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Add New Log Entry</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">User Query</label>
                <Input
                  placeholder="Enter the user's question/prompt..."
                  value={newLog.user_query}
                  onChange={(e) => setNewLog({...newLog, user_query: e.target.value})}
                  required
                  className="bg-white border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Model Response</label>
                <Input
                  placeholder="Enter the AI model's response..."
                  value={newLog.model_response}
                  onChange={(e) => setNewLog({...newLog, model_response: e.target.value})}
                  required
                  className="bg-white border border-gray-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-amber-600 hover:text-black">
                {isLoading ? 'Adding...' : 'Add & Validate'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-gray-700 hover:bg-amber-50">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}



