/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { auth } from '@/services/firebase/firebase'
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { googleProvider } from '@/services/firebase/firebase'

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: () => {},
  signInWithEmail: () => {},
  signInWithGoogle: () => {},
  authError: null,
  clearError: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      // Clear any auth errors when user state changes
      if (u) {
        setAuthError(null)
      }
    })
    return () => unsub()
  }, [])

  const signInWithEmail = useCallback(async (email, password) => {
    try {
      setAuthError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setAuthError(null)
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      setAuthError(null)
      await signOut(auth)
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [])

  const clearError = useCallback(() => {
    setAuthError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut: handleSignOut,
      signInWithEmail,
      signInWithGoogle,
      authError,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
