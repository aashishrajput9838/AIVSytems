import useAuth from '@/features/auth/AuthProvider'
import useLogsManagement from './useLogsManagement'
import useChatGPTMode from './useChatGPTMode'
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
      const success = await logsManagement.handleAddLog(
        ui.newLog.user_query, 
        ui.newLog.model_response
      )
      if (success) {
        ui.toggleAddForm()
        ui.resetNewLog()
      }
      return success
    }
  }
}
