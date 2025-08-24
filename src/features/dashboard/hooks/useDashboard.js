import { useEffect, useState } from 'react'
import { getLogs, approveLogById, rejectLogById, addLog } from '@/services/api/logs'
import { useAuth } from '@/features/auth/AuthProvider'
import { askModel } from '@/services/ai/models'
import { validateResponse, extractEntities } from '@/features/validation/algorithms'

export function useDashboard() {
  const { user } = useAuth()

  // State management
  const [search, setSearch] = useState('')
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showAddForm, setShowAddForm] = useState(false)
  const [newLog, setNewLog] = useState({ user_query: '', model_response: '', status: 'pending' })

  const [showChatGPTMode, setShowChatGPTMode] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentResponse, setCurrentResponse] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAsking, setIsAsking] = useState(false)

  const [showTests, setShowTests] = useState(false)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testResults, setTestResults] = useState([])

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

  // Load logs on component mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true)
        setError('')
        const data = await getLogs()
        setLogs(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load logs')
      } finally {
        setIsLoading(false)
      }
    }

    loadLogs()
  }, [])

  // Filtered logs based on search
  const filteredLogs = logs.filter((l) =>
    (l.user_query || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.model_response || '').toLowerCase().includes(search.toLowerCase())
  )

  // Utility functions
  const formatTimestamp = (ts) => {
    if (!ts) return '-'
    if (typeof ts === 'string') return ts
    if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleString()
    const d = new Date(ts)
    return Number.isNaN(d.getTime()) ? String(ts) : d.toLocaleString()
  }

  const isDuplicateLog = (q, r) => {
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
    return logs.some(log => {
      const t = log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date(log.timestamp)
      return t > oneMinuteAgo && log.user_query === q && log.model_response === r
    })
  }

  // Test harness functions
  const runAllTests = async () => {
    setIsRunningTests(true)
    const results = []
    for (const tc of sampleTests) {
      const v = await validateResponse(tc.userQuery, tc.modelResponse)
      const score = Number(v.validationScore || 0)
      let pass = true
      if (typeof tc.expectedMinScore === 'number') pass = pass && score >= tc.expectedMinScore
      if (typeof tc.expectedMaxScore === 'number') pass = pass && score <= tc.expectedMaxScore
      results.push({ ...tc, score, pass, notes: v.notes, validators: v.validators })
    }
    setTestResults(results)
    setIsRunningTests(false)
  }

  // ChatGPT mode functions
  const startCapturing = () => {
    setIsCapturing(true)
    setChatHistory([])
    setCurrentQuestion('')
    setCurrentResponse('')
  }

  const stopCapturing = () => {
    setIsCapturing(false)
    setShowChatGPTMode(false)
  }

  const onAskModel = async () => {
    if (!currentQuestion.trim() || isAsking) return
    try {
      setIsAsking(true)
      setError('')
      const ans = await askModel(currentQuestion.trim())
      setCurrentResponse(ans)
    } catch (e) {
      setError(e?.message || 'Model call failed')
    } finally {
      setIsAsking(false)
    }
  }

  const onCapture = async () => {
    if (!isCapturing) return
    const q = currentQuestion.trim()
    const r = currentResponse.trim()
    
    if (isDuplicateLog(q, r)) {
      setError('Duplicate log detected! Same content was added within the last minute.')
      return
    }
    
    try {
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
      setChatHistory(prev => [...prev, { question: q, response: r, validation, timestamp: new Date() }])
      
      const data = await getLogs()
      setLogs(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to capture conversation')
    }
  }

  // Log management functions
  const handleAddLog = async (e) => {
    e.preventDefault()
    const q = newLog.user_query.trim()
    const r = newLog.model_response.trim()
    
    if (!q || !r) {
      setError('Please fill in both user query and model response')
      return
    }
    
    if (isDuplicateLog(q, r)) {
      setError('Duplicate log detected! Same content was added within the last minute.')
      return
    }
    
    try {
      setIsLoading(true)
      setError('')
      const validation = await validateResponse(q, r)
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
        entity_info: extractEntities(q)
      }
      
      await addLog(entry)
      setNewLog({ user_query: '', model_response: '', status: 'pending' })
      setShowAddForm(false)
      
      const data = await getLogs()
      setLogs(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to add log')
    } finally {
      setIsLoading(false)
    }
  }

  const approveLog = async (id) => {
    const prev = logs
    setLogs(logs.map(l => l.id === id ? { ...l, notes: (l.notes || '') + ' | Approved' } : l))
    try {
      await approveLogById(id)
    } catch {
      setLogs(prev)
      setError('Approve failed')
    }
  }

  const rejectLog = async (id) => {
    const prev = logs
    setLogs(logs.map(l => l.id === id ? { ...l, notes: (l.notes || '') + ' | Rejected' } : l))
    try {
      await rejectLogById(id)
    } catch {
      setLogs(prev)
      setError('Reject failed')
    }
  }

  return {
    // State
    search,
    setSearch,
    logs: filteredLogs,
    isLoading,
    error,
    showAddForm,
    setShowAddForm,
    newLog,
    setNewLog,
    showChatGPTMode,
    setShowChatGPTMode,
    chatHistory,
    currentQuestion,
    setCurrentQuestion,
    currentResponse,
    setCurrentResponse,
    isCapturing,
    isAsking,
    showTests,
    setShowTests,
    isRunningTests,
    testResults,
    sampleTests,
    
    // Functions
    formatTimestamp,
    runAllTests,
    startCapturing,
    stopCapturing,
    onAskModel,
    onCapture,
    handleAddLog,
    approveLog,
    rejectLog
  }
}
