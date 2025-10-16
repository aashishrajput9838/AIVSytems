import { useReducer, useCallback } from 'react'
import { validateResponse } from '@/features/validation/algorithms'
import { handleApiError, logError } from '@/shared/utils/errorHandling'

// Define Initial State
const initialState = {
  isRunningTests: false,
  testResults: [],
  error: '',
}

// Define Action Types
const actionTypes = {
  RUN_TESTS_START: 'RUN_TESTS_START',
  RUN_TESTS_SUCCESS: 'RUN_TESTS_SUCCESS',
  RUN_TESTS_ERROR: 'RUN_TESTS_ERROR',
  RUN_SINGLE_TEST_SUCCESS: 'RUN_SINGLE_TEST_SUCCESS',
  CLEAR_RESULTS: 'CLEAR_RESULTS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Sample tests data
const sampleTests = [
  { 
    id: 'doraemon-wrong', 
    title: 'Doraemon wrong fact', 
    userQuery: 'Who is Doraemon?', 
    modelResponse: 'A human', 
    expectedMaxScore: 0.5 
  },
  { 
    id: 'doraemon-correct', 
    title: 'Doraemon correct fact', 
    userQuery: 'Who is Doraemon?', 
    modelResponse: 'A cartoon character from a Japanese manga/anime series.', 
    expectedMinScore: 0.5 
  },
]

// Create Reducer Function
function testManagementReducer(state, action) {
  switch (action.type) {
    case actionTypes.RUN_TESTS_START:
      return { ...state, isRunningTests: true, error: '' }
    case actionTypes.RUN_TESTS_SUCCESS:
      return { ...state, isRunningTests: false, testResults: action.payload }
    case actionTypes.RUN_TESTS_ERROR:
      return { ...state, isRunningTests: false, error: action.payload }
    case actionTypes.RUN_SINGLE_TEST_SUCCESS:
      return {
        ...state,
        testResults: state.testResults.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      }
    case actionTypes.CLEAR_RESULTS:
      return { ...state, testResults: [] }
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload }
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: '' }
    default:
      return state
  }
}

export default function useTestManagement(user) {
  const [state, dispatch] = useReducer(testManagementReducer, initialState)
  const { isRunningTests, testResults, error } = state

  const handleError = useCallback((error, context) => {
    const userFriendlyError = handleApiError(error)
    dispatch({ type: actionTypes.SET_ERROR, payload: userFriendlyError })
    logError(error, context, { userId: user?.email })
  }, [user?.email])

  const runAllTests = useCallback(async () => {
    dispatch({ type: actionTypes.RUN_TESTS_START })
    const results = []
    
    try {
      for (const tc of sampleTests) {
        const v = await validateResponse(tc.userQuery, tc.modelResponse)
        const score = Number(v.validationScore || 0)
        let pass = true
        
        if (typeof tc.expectedMinScore === 'number') {
          pass = pass && score >= tc.expectedMinScore
        }
        if (typeof tc.expectedMaxScore === 'number') {
          pass = pass && score <= tc.expectedMaxScore
        }
        
        results.push({ 
          ...tc, 
          score, 
          pass, 
          notes: v.notes, 
          validators: v.validators 
        })
      }
      
      dispatch({ type: actionTypes.RUN_TESTS_SUCCESS, payload: results })
    } catch (e) {
      handleError(e, 'Test Management: Run Tests')
    }
  }, [handleError])

  const clearTestResults = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_RESULTS })
  }, [])

  const runSingleTest = useCallback(async (testId) => {
    const test = sampleTests.find(t => t.id === testId)
    if (!test) return null

    try {
      const v = await validateResponse(test.userQuery, test.modelResponse)
      const score = Number(v.validationScore || 0)
      let pass = true
      
      if (typeof test.expectedMinScore === 'number') {
        pass = pass && score >= test.expectedMinScore
      }
      if (typeof test.expectedMaxScore === 'number') {
        pass = pass && score <= test.expectedMaxScore
      }
      
      const result = { 
        ...test, 
        score, 
        pass, 
        notes: v.notes, 
        validators: v.validators 
      }
      
      dispatch({ type: actionTypes.RUN_SINGLE_TEST_SUCCESS, payload: result })
      return result
    } catch (e) {
      handleError(e, `Test Management: Run Single Test (${testId})`)
      return null
    }
  }, [handleError])

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }, [])

  return {
    // State
    isRunningTests,
    testResults,
    sampleTests,
    error,
    
    // Functions
    runAllTests,
    runSingleTest,
    clearTestResults,
    clearError
  }
}
