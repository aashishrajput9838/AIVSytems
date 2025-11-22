import { useCallback, useEffect, useReducer } from 'react'
import { getLogs, approveLogById, rejectLogById, addLog, deleteLogById } from '@/services/api/logs'
import { validateResponse, extractEntities } from '@/features/validation/algorithms'
import { handleApiError, logError } from '@/shared/utils/errorHandling'

// Define Initial State
const initialState = {
  logs: [],
  isLoading: false,
  error: '',
  progress: 0,
  progressMessage: ''
}

// Define Action Types
const actionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_LOG: 'ADD_LOG',
  UPDATE_LOG: 'UPDATE_LOG',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  SET_PROGRESS: 'SET_PROGRESS',
  SET_PROGRESS_MESSAGE: 'SET_PROGRESS_MESSAGE'
}

// Create Reducer Function
function logsReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return { 
        ...state, 
        isLoading: true, 
        error: '', 
        progress: 0,
        progressMessage: 'Starting operation...'
      }
    case actionTypes.FETCH_SUCCESS:
      return { 
        ...state, 
        isLoading: false, 
        logs: action.payload,
        progress: 100,
        progressMessage: 'Operation completed successfully'
      }
    case actionTypes.FETCH_ERROR:
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload,
        progress: 0,
        progressMessage: ''
      }
    case actionTypes.ADD_LOG:
      return { ...state, logs: [action.payload, ...state.logs] }
    case actionTypes.UPDATE_LOG:
      return {
        ...state,
        logs: state.logs.map(log =>
          log.id === action.payload.id ? action.payload : log
        ),
      }
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: '' }
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload }
    case actionTypes.SET_PROGRESS:
      return { ...state, progress: action.payload }
    case actionTypes.SET_PROGRESS_MESSAGE:
      return { ...state, progressMessage: action.payload }
    default:
      return state
  }
}

export default function useLogsManagement(user) {
  const [state, dispatch] = useReducer(logsReducer, initialState)
  const { logs, isLoading, error, progress, progressMessage } = state

  // Enhanced error handler with better context
  const handleError = useCallback((error, context) => {
    const enhancedError = handleApiError(error, { 
      context, 
      userId: user?.email,
      operation: context.includes('Load') ? 'fetch_logs' : 
                 context.includes('Add') ? 'add_log' :
                 context.includes('Approve') ? 'approve_log' :
                 context.includes('Reject') ? 'reject_log' : 'unknown'
    })
    
    dispatch({ type: actionTypes.FETCH_ERROR, payload: enhancedError })
    logError(enhancedError, context, { userId: user?.email })
  }, [user?.email])

  // Update progress with meaningful messages
  const updateProgress = useCallback((progress, message) => {
    dispatch({ type: actionTypes.SET_PROGRESS, payload: progress })
    if (message) {
      dispatch({ type: actionTypes.SET_PROGRESS_MESSAGE, payload: message })
    }
  }, [])

  // Load logs on component mount
  useEffect(() => {
    const loadLogs = async () => {
      dispatch({ type: actionTypes.FETCH_START })
      
      try {
        updateProgress(25, 'Connecting to server...')
        const data = await getLogs()
        
        updateProgress(75, 'Processing data...')
        const processedData = Array.isArray(data) ? data : []
        
        updateProgress(100, 'Loading complete')
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: processedData })
      } catch (e) {
        handleError(e, 'Logs Management: Load Logs')
      }
    }

    loadLogs()
  }, [handleError, updateProgress])

  // Utility functions
  const formatTimestamp = useCallback((ts) => {
    if (!ts) return '-'
    if (typeof ts === 'string') return ts
    if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleString()
    const d = new Date(ts)
    return Number.isNaN(d.getTime()) ? String(ts) : d.toLocaleString()
  }, [])

  const isDuplicateLog = useCallback((q, r) => {
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
    return logs.some(log => {
      const t = log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date(log.timestamp)
      return t > oneMinuteAgo && log.user_query === q && log.model_response === r
    })
  }, [logs])

  const handleAddLog = useCallback(async (userQuery, modelResponse) => {
    if (!userQuery?.trim()) {
      const validationError = handleApiError(new Error('Please enter a user query'), {
        context: 'validation',
        category: 'validation',
        severity: 'low'
      })
      dispatch({ type: actionTypes.SET_ERROR, payload: validationError })
      return false
    }
    
    if (isDuplicateLog(userQuery, modelResponse)) {
      const duplicateError = handleApiError(new Error('Duplicate log detected! Same content was added within the last minute.'), {
        context: 'duplicate_detection',
        category: 'validation',
        severity: 'medium'
      })
      dispatch({ type: actionTypes.SET_ERROR, payload: duplicateError })
      return false
    }
    
    try {
      dispatch({ type: actionTypes.FETCH_START })
      
      updateProgress(20, 'Validating input...')
      const validation = await validateResponse(userQuery, modelResponse)
      
      updateProgress(40, 'Preparing log entry...')
      const entry = {
        user_query: userQuery.trim(),
        model_response: modelResponse.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: 'validated',
        created_by: user?.email || 'unknown',
        timestamp: new Date().toISOString(),
        entity_info: extractEntities(userQuery)
      }
      
      updateProgress(60, 'Saving to database...')
      await addLog(entry)
      
      updateProgress(80, 'Refreshing logs...')
      const data = await getLogs()
      
      updateProgress(100, 'Log added successfully')
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: Array.isArray(data) ? data : [] })
      
      return true // Success
    } catch (e) {
      handleError(e, 'Logs Management: Add Log')
      return false // Failure
    }
  }, [user?.email, isDuplicateLog, handleError, updateProgress])

  const approveLog = useCallback(async (id) => {
    const prev = logs
    const logToUpdate = logs.find(l => l.id === id)
    
    if (!logToUpdate) {
      const notFoundError = handleApiError(new Error('Log not found'), {
        context: 'approve_log',
        category: 'client',
        severity: 'medium'
      })
      dispatch({ type: actionTypes.SET_ERROR, payload: notFoundError })
      return
    }
    
    // Optimistic update
    dispatch({ type: actionTypes.UPDATE_LOG, payload: { 
      ...logToUpdate, 
      status: 'approved',
      notes: (logToUpdate.notes || '') + ' | Approved' 
    }})
    
    try {
      updateProgress(50, 'Approving log...')
      await approveLogById(id)
      updateProgress(100, 'Log approved successfully')
    } catch (e) {
      // Revert optimistic update on error
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: prev })
      handleError(e, 'Logs Management: Approve Log')
    }
  }, [logs, handleError, updateProgress])

  const rejectLog = useCallback(async (id) => {
    const prev = logs
    const logToUpdate = logs.find(l => l.id === id)
    
    if (!logToUpdate) {
      const notFoundError = handleApiError(new Error('Log not found'), {
        context: 'reject_log',
        category: 'client',
        severity: 'medium'
      })
      dispatch({ type: actionTypes.SET_ERROR, payload: notFoundError })
      return
    }
    
    // Optimistic update
    dispatch({ type: actionTypes.UPDATE_LOG, payload: { 
      ...logToUpdate, 
      status: 'rejected',
      notes: (logToUpdate.notes || '') + ' | Rejected' 
    }})
    
    try {
      updateProgress(50, 'Rejecting log...')
      await rejectLogById(id)
      updateProgress(100, 'Log rejected successfully')
    } catch (e) {
      // Revert optimistic update on error
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: prev })
      handleError(e, 'Logs Management: Reject Log')
    }
  }, [logs, handleError, updateProgress])

  const deleteLog = useCallback(async (id) => {
    const prev = logs
    const toDelete = logs.find(l => l.id === id)
    if (!toDelete) {
      const notFoundError = handleApiError(new Error('Log not found'), {
        context: 'delete_log',
        category: 'client',
        severity: 'medium'
      })
      dispatch({ type: actionTypes.SET_ERROR, payload: notFoundError })
      return
    }

    // Optimistic update: remove locally
    dispatch({ type: actionTypes.FETCH_SUCCESS, payload: logs.filter(l => l.id !== id) })

    try {
      updateProgress(50, 'Deleting log...')
      await deleteLogById(id)
      updateProgress(100, 'Log deleted successfully')
    } catch (e) {
      // Revert on failure
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: prev })
      handleError(e, 'Logs Management: Delete Log')
    }
  }, [logs, handleError, updateProgress])

  const refreshLogs = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.FETCH_START })
      
      updateProgress(30, 'Refreshing logs...')
      const data = await getLogs()
      
      updateProgress(100, 'Logs refreshed successfully')
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: Array.isArray(data) ? data : [] })
    } catch (e) {
      handleError(e, 'Logs Management: Refresh Logs')
    }
  }, [handleError, updateProgress])

  const setError = useCallback((errorMessage) => {
    const customError = handleApiError(new Error(errorMessage), {
      context: 'custom_error',
      category: 'client',
      severity: 'medium'
    })
    dispatch({ type: actionTypes.SET_ERROR, payload: customError })
  }, [])

  return {
    // State
    logs,
    isLoading,
    error,
    progress,
    progressMessage,
    
    // Functions
    formatTimestamp,
    isDuplicateLog,
    handleAddLog,
    approveLog,
    rejectLog,
    deleteLog,
    refreshLogs,
    setError
  }
}
