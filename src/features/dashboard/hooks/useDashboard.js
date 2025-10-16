import { useAuth } from '@/features/auth/AuthProvider'
import useLogsManagement from './useLogsManagement'
import useChatGPTMode from './useChatGPTMode'
import { askModel } from '@/services/ai/models'
import useTestManagement from './useTestManagement'
import useDashboardUI from './useDashboardUI'

export default function useDashboard() {
  const { user } = useAuth()

  // Use specialized hooks for different concerns
  const logsManagement = useLogsManagement(user)
  const chatGPTMode = useChatGPTMode(user, logsManagement.refreshLogs)
  const testManagement = useTestManagement(user)
  const ui = useDashboardUI()

  // Combine all the functionality
  return {
    // Logs Management
    ...logsManagement,
    
    // ChatGPT Mode
    ...chatGPTMode,
    
    // Test Management
    ...testManagement,
    
    // UI State
    ...ui,
    
    // Convenience functions that combine multiple concerns
    handleAddLog: async (e) => {
      e.preventDefault()
      
      // Extract form values from the current newLog state
      const { user_query, model_response } = ui.newLog
      // Auto-generate model response if empty
      const response = (model_response && model_response.trim().length > 0)
        ? model_response
        : await (async () => {
            try {
              return await askModel(user_query)
            } catch (error) {
              console.error('Ask model error:', error)
              // Return a more informative error message
              let errorMessage = 'Sorry, I couldn\'t generate a response at this time.'
              if (error.message.includes('Invalid API Key')) {
                errorMessage += ' (Invalid API Key - please check your .env file)'
              } else if (error.message.includes('quota')) {
                errorMessage += ' (API quota exceeded - check your billing details)'
              }
              return errorMessage
            }
          })()

      const success = await logsManagement.handleAddLog(user_query, response)
      if (success) {
        ui.toggleAddForm()
        ui.resetNewLog()
      }
      return success
    },
    handleDeleteLog: async (id) => {
      await logsManagement.deleteLog(id)
    }
  }
}
