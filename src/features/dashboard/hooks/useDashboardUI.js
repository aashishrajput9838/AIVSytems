import { useReducer, useCallback } from 'react'

// Define Initial State
const initialState = {
  search: '',
  showAddForm: false,
  showChatGPTMode: false,
  showTests: false,
  newLog: { 
    user_query: '', 
    model_response: '', 
    status: 'pending' 
  }
}

// Define Action Types
const actionTypes = {
  SET_SEARCH: 'SET_SEARCH',
  TOGGLE_ADD_FORM: 'TOGGLE_ADD_FORM',
  TOGGLE_CHATGPT_MODE: 'TOGGLE_CHATGPT_MODE',
  TOGGLE_TESTS: 'TOGGLE_TESTS',
  RESET_NEW_LOG: 'RESET_NEW_LOG',
  UPDATE_NEW_LOG: 'UPDATE_NEW_LOG',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
}

// Create Reducer Function
function dashboardUIReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SEARCH:
      return { ...state, search: action.payload }
    case actionTypes.TOGGLE_ADD_FORM:
      return {
        ...state,
        showAddForm: !state.showAddForm,
        newLog: !state.showAddForm ? state.newLog : { user_query: '', model_response: '', status: 'pending' }
      }
    case actionTypes.TOGGLE_CHATGPT_MODE:
      return { ...state, showChatGPTMode: !state.showChatGPTMode }
    case actionTypes.TOGGLE_TESTS:
      return { ...state, showTests: !state.showTests }
    case actionTypes.RESET_NEW_LOG:
      return {
        ...state,
        newLog: { user_query: '', model_response: '', status: 'pending' }
      }
    case actionTypes.UPDATE_NEW_LOG:
      return {
        ...state,
        newLog: { ...state.newLog, [action.payload.field]: action.payload.value }
      }
    case actionTypes.CLEAR_SEARCH:
      return { ...state, search: '' }
    default:
      return state
  }
}

export default function useDashboardUI() {
  const [state, dispatch] = useReducer(dashboardUIReducer, initialState)
  const { search, showAddForm, showChatGPTMode, showTests, newLog } = state

  const setSearch = useCallback((searchValue) => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: searchValue })
  }, [])

  const toggleAddForm = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_ADD_FORM })
  }, [])

  const toggleChatGPTMode = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_CHATGPT_MODE })
  }, [])

  const toggleTests = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_TESTS })
  }, [])

  const resetNewLog = useCallback(() => {
    dispatch({ type: actionTypes.RESET_NEW_LOG })
  }, [])

  const updateNewLog = useCallback((field, value) => {
    dispatch({ type: actionTypes.UPDATE_NEW_LOG, payload: { field, value } })
  }, [])

  const clearSearch = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_SEARCH })
  }, [])

  return {
    // State
    search,
    showAddForm,
    showChatGPTMode,
    showTests,
    newLog,
    
    // Functions
    setSearch,
    toggleAddForm,
    toggleChatGPTMode,
    toggleTests,
    resetNewLog,
    updateNewLog,
    clearSearch
  }
}
