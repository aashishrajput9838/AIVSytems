import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import { FormSkeleton } from '@/shared/components/ui'

export default function AddLogForm({ isLoading, isFormLoading, newLog, setNewLog, onSubmit, onCancel }) {
  const [localFormLoading, setLocalFormLoading] = useState(false)

  // Use the passed isFormLoading prop or fall back to local state
  const formLoading = isFormLoading !== undefined ? isFormLoading : localFormLoading

  // Simulate form loading for demonstration
  useEffect(() => {
    if (isLoading) {
      setLocalFormLoading(true)
      const timer = setTimeout(() => {
        setLocalFormLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <section 
      className="section-lg"
      aria-label="Add new log entry form"
      aria-describedby="form-description"
    >
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl hover-lift interactive">
        <CardContent className="card-lg">
          <h2 
            id="form-title"
            className="text-heading-2 text-black margin-b-md"
          >
            Add New Log Entry
          </h2>
          
          <p id="form-description" className="sr-only">
            Form to add a new log entry with user query and AI model response
          </p>
          
          {formLoading ? (
            <div aria-live="polite" aria-label="Form is loading">
              <FormSkeleton fields={2} showSubmit={true} />
            </div>
          ) : (
            <form 
              onSubmit={onSubmit} 
              className="form-lg"
              aria-labelledby="form-title"
              noValidate
            >
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <div className="layout-stack-sm">
                  <label 
                    htmlFor="user-query-input"
                    className="text-body font-medium text-black"
                  >
                    User Query
                  </label>
                  <Input
                    id="user-query-input"
                    placeholder="Enter the user's question/prompt..."
                    value={newLog.user_query}
                    onChange={(e) => setNewLog({...newLog, user_query: e.target.value})}
                    required
                    className="bg-white border border-gray-200 focus-ring"
                    aria-required="true"
                    aria-describedby="user-query-help"
                  />
                  <div id="user-query-help" className="sr-only">
                    Enter the question or prompt that the user asked the AI model
                  </div>
                </div>
                {/* Hidden Model Response field as it's not being used directly */}
                <div className="layout-stack-sm hidden">
                  <label 
                    htmlFor="model-response-input"
                    className="text-body font-medium text-black"
                  >
                    Model Response
                  </label>
                  <Input
                    id="model-response-input"
                    placeholder="Enter the AI model's response..."
                    value={newLog.model_response}
                    onChange={(e) => setNewLog({...newLog, model_response: e.target.value})}
                    // make optional; we now auto-generate if empty
                    className="bg-white border border-gray-200 focus-ring"
                    aria-required="true"
                    aria-describedby="model-response-help"
                  />
                  <div id="model-response-help" className="sr-only">
                    Enter the response that the AI model provided to the user
                  </div>
                </div>
              </div>
              <div className="layout-row-md flex-col sm:flex-row">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-black text-white hover:bg-amber-600 hover:text-black focus-ring interactive order-2 sm:order-1"
                  aria-label={isLoading ? 'Processing...' : 'Add and validate log entry'}
                  aria-describedby="submit-help"
                >
                  {isLoading ? 'Processing…' : 'Add & Validate'}
                </Button>
                <span id="submit-help" className="sr-only">
                  Submit the form to add the new log entry and validate it
                </span>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="border-gray-300 text-gray-700 hover:bg-amber-50 focus-ring interactive order-1 sm:order-2"
                  aria-label="Cancel adding log entry"
                  aria-describedby="cancel-help"
                >
                  Cancel
                </Button>
                <span id="cancel-help" className="sr-only">
                  Cancel the form and return to dashboard view
                </span>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  )
}