import { useReducer, useCallback } from 'react'
import { askModel } from '@/services/ai/models'
import { validateResponse, extractEntities } from '@/features/validation/algorithms'
import { addLog } from '@/services/api/logs'
import { handleApiError, logError } from '@/shared/utils/errorHandling'

// Define Initial State
const initialState = {
  chatHistory: [],
  currentQuestion: '',
  currentResponse: '',
  isCapturing: false,
  isAsking: false,
  error: '',
}

// Define Action Types
const actionTypes = {
  START_CAPTURING: 'START_CAPTURING',
  STOP_CAPTURING: 'STOP_CAPTURING',
  SET_QUESTION: 'SET_QUESTION',
  SET_RESPONSE: 'SET_RESPONSE',
  ASK_START: 'ASK_START',
  ASK_SUCCESS: 'ASK_SUCCESS',
  ASK_ERROR: 'ASK_ERROR',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  RESET_STATE: 'RESET_STATE',
}

// Create Reducer Function
function chatGPTModeReducer(state, action) {
  switch (action.type) {
    case actionTypes.START_CAPTURING:
      return {
        ...state,
        isCapturing: true,
        chatHistory: [],
        currentQuestion: '',
        currentResponse: '',
        error: '',
      }
    case actionTypes.STOP_CAPTURING:
      return {
        ...state,
        isCapturing: false,
        error: '',
      }
    case actionTypes.SET_QUESTION:
      return { ...state, currentQuestion: action.payload }
    case actionTypes.SET_RESPONSE:
      return { ...state, currentResponse: action.payload }
    case actionTypes.ASK_START:
      return { ...state, isAsking: true, error: '' }
    case actionTypes.ASK_SUCCESS:
      return { ...state, isAsking: false, currentResponse: action.payload }
    case actionTypes.ASK_ERROR:
      return { ...state, isAsking: false, error: action.payload }
    case actionTypes.ADD_TO_HISTORY:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
        currentQuestion: '',
        currentResponse: '',
      }
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: '' }
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload }
    case actionTypes.RESET_STATE:
      return {
        ...state,
        currentQuestion: '',
        currentResponse: '',
        error: '',
      }
    default:
      return state
  }
}

export default function useChatGPTMode(user, onLogAdded) {
  const [state, dispatch] = useReducer(chatGPTModeReducer, initialState)
  const {
    chatHistory,
    currentQuestion,
    currentResponse,
    isCapturing,
    isAsking,
    error,
  } = state

  const handleError = useCallback((error, context) => {
    const userFriendlyError = handleApiError(error)
    dispatch({ type: actionTypes.SET_ERROR, payload: userFriendlyError })
    logError(error, context, { userId: user?.email })
  }, [user?.email])

  const startCapturing = useCallback(() => {
    dispatch({ type: actionTypes.START_CAPTURING })
  }, [])

  const stopCapturing = useCallback(() => {
    dispatch({ type: actionTypes.STOP_CAPTURING })
  }, [])

  const setCurrentQuestion = useCallback((question) => {
    dispatch({ type: actionTypes.SET_QUESTION, payload: question })
  }, [])

  const setCurrentResponse = useCallback((response) => {
    dispatch({ type: actionTypes.SET_RESPONSE, payload: response })
  }, [])

  const onAskModel = useCallback(async () => {
    if (!currentQuestion.trim() || isAsking) return
    
    try {
      dispatch({ type: actionTypes.ASK_START })
      const ans = await askModel(currentQuestion.trim())
      dispatch({ type: actionTypes.ASK_SUCCESS, payload: ans })
    } catch (e) {
      console.error('Ask model error:', e)
      // Provide more specific error messages for different error types
      let errorMessage = e.message || 'Failed to get response. Please try again.'
      if (errorMessage.includes('Invalid API Key')) {
        errorMessage += ' Please check your API key in the .env file.'
      } else if (errorMessage.includes('quota')) {
        errorMessage += ' Visit your API provider\'s billing page to check your plan and billing details.'
      }
      handleError(new Error(errorMessage), 'ChatGPT Mode: Ask Model')
      dispatch({ type: actionTypes.ASK_ERROR, payload: errorMessage })
    }
  }, [currentQuestion, isAsking, handleError])

  const onCapture = useCallback(async () => {
    if (!isCapturing) return
    
    const q = currentQuestion.trim()
    const r = currentResponse.trim()
    
    if (!q || !r) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Please ask a question and get a response before capturing' })
      return
    }
    
    try {
      dispatch({ type: actionTypes.CLEAR_ERROR })
      const validation = await validateResponse(q, r)
      const entityInfo = extractEntities(q)
      
      const entry = {
        user_query: q,
        model_response: r,
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: 'validated',
        created_by: user?.email || 'unknown',
        timestamp: new Date().toISOString(),
        source: 'chatgpt_mode',
        entity_info: entityInfo
      }
      
      await addLog(entry)
      
      // Add to chat history
      dispatch({
        type: actionTypes.ADD_TO_HISTORY,
        payload: { 
          question: q, 
          response: r, 
          validation, 
          timestamp: new Date() 
        }
      })
      
      // Notify parent component
      if (onLogAdded) {
        onLogAdded()
      }
      
    } catch (e) {
      handleError(e, 'ChatGPT Mode: Capture Conversation')
    }
  }, [isCapturing, currentQuestion, currentResponse, user?.email, onLogAdded, handleError])

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }, [])

  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE })
  }, [])

  return {
    // State
    chatHistory,
    currentQuestion,
    currentResponse,
    isCapturing,
    isAsking,
    error,
    
    // Functions
    startCapturing,
    stopCapturing,
    setCurrentQuestion,
    setCurrentResponse,
    onAskModel,
    onCapture,
    clearError,
    resetState
  }
}
