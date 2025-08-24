import { useCallback, useEffect, useReducer } from 'react'
import { getLogs, approveLogById, rejectLogById, addLog } from '@/services/api/logs'
import { validateResponse, extractEntities } from '@/features/validation/algorithms'
import { handleApiError, logError } from '@/shared/utils/errorHandling'

// Define Initial State
const initialState = {
  logs: [],
  isLoading: false,
  error: '',
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
}

// Create Reducer Function
function logsReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return { ...state, isLoading: true, error: '' }
    case actionTypes.FETCH_SUCCESS:
      return { ...state, isLoading: false, logs: action.payload }
    case actionTypes.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload }
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
    default:
      return state
  }
}

export default function useLogsManagement(user) {
  const [state, dispatch] = useReducer(logsReducer, initialState)
  const { logs, isLoading, error } = state

  // Enhanced error handler
  const handleError = useCallback((error, context) => {
    const userFriendlyError = handleApiError(error)
    dispatch({ type: actionTypes.FETCH_ERROR, payload: userFriendlyError })
    logError(error, context, { userId: user?.email })
  }, [user?.email])

  // Load logs on component mount
  useEffect(() => {
    const loadLogs = async () => {
      dispatch({ type: actionTypes.FETCH_START })
      try {
        const data = await getLogs()
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: Array.isArray(data) ? data : [] })
      } catch (e) {
        handleError(e, 'Logs Management: Load Logs')
      }
    }

    loadLogs()
  }, [handleError])

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
    if (!userQuery.trim() || !modelResponse.trim()) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Please fill in both user query and model response' })
      return false
    }
    
    if (isDuplicateLog(userQuery, modelResponse)) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Duplicate log detected! Same content was added within the last minute.' })
      return false
    }
    
    try {
      dispatch({ type: actionTypes.FETCH_START })
      const validation = await validateResponse(userQuery, modelResponse)
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
      
      await addLog(entry)
      
      // Refresh logs
      const data = await getLogs()
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: Array.isArray(data) ? data : [] })
      
      return true // Success
    } catch (e) {
      handleError(e, 'Logs Management: Add Log')
      return false // Failure
    }
  }, [user?.email, isDuplicateLog, handleError])

  const approveLog = useCallback(async (id) => {
    const prev = logs
    dispatch({ type: actionTypes.UPDATE_LOG, payload: { ...logs.find(l => l.id === id), notes: (logs.find(l => l.id === id)?.notes || '') + ' | Approved' } })
    try {
      await approveLogById(id)
    } catch (e) {
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: prev })
      handleError(e, 'Logs Management: Approve Log')
    }
  }, [logs, handleError])

  const rejectLog = useCallback(async (id) => {
    const prev = logs
    dispatch({ type: actionTypes.UPDATE_LOG, payload: { ...logs.find(l => l.id === id), notes: (logs.find(l => l.id === id)?.notes || '') + ' | Rejected' } })
    try {
      await rejectLogById(id)
    } catch (e) {
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: prev })
      handleError(e, 'Logs Management: Reject Log')
    }
  }, [logs, handleError])

  const refreshLogs = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.FETCH_START })
      const data = await getLogs()
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: Array.isArray(data) ? data : [] })
    } catch (e) {
      handleError(e, 'Logs Management: Refresh Logs')
    }
  }, [handleError])

  const setError = useCallback((errorMessage) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage })
  }, [])

  return {
    // State
    logs,
    isLoading,
    error,
    
    // Functions
    formatTimestamp,
    isDuplicateLog,
    handleAddLog,
    approveLog,
    rejectLog,
    refreshLogs,
    setError
  }
}
