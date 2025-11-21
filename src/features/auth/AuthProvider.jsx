/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { auth, googleProvider } from '@/services/firebase/firebase'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const initializationRef = useRef(false)

  useEffect(() => {
    let unsubscribe = null

    // Prevent multiple initializations in React StrictMode
    if (initializationRef.current) {
      console.log('AuthProvider: Already initialized, skipping...')
      return
    }

    const initializeAuth = async () => {
      try {
        console.log('Initializing Firebase Auth...')
        initializationRef.current = true
        
        // Check if auth is available
        if (!auth) {
          console.error('Firebase Auth not available - configuration invalid')
          setLoading(false)
          setIsInitialized(true)
          return
        }
        
        // Configure Firebase auth persistence
        await setPersistence(auth, browserLocalPersistence)
        console.log('Firebase persistence configured')
        
        // Set up auth state listener
        console.log('Setting up auth state listener...')
        unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed:', user ? user.email : 'No user')
          setUser(user)
          setLoading(false)
          setIsInitialized(true)
        }, (error) => {
          console.error('Auth state change error:', error)
          setLoading(false)
          setIsInitialized(true)
        })
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const signInWithEmail = async (email, password) => {
    try {
      // Check if auth is available
      if (!auth) {
        throw new Error('Authentication service not available')
      }
      
      console.log('Attempting email sign-in for:', email)
      setAuthError('')
      setLoading(true)
      
      // Use direct email/password authentication (no popup needed)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('Email sign-in successful:', result.user.email)
      
      // Note: The user state will be updated by the onAuthStateChanged listener
      return result
    } catch (error) {
      console.error('Email sign-in error:', error)
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'Invalid email or password'
        : error.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : error.message
      
      setAuthError(errorMessage)
      setLoading(false)
      throw new Error(errorMessage)
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Check if auth and googleProvider are available
      if (!auth || !googleProvider) {
        throw new Error('Google authentication service not available')
      }
      
      console.log('Attempting Google sign-in...')
      setAuthError('')
      setLoading(true)
      
      // Use popup for Google sign-in with better error handling
      try {
        const result = await signInWithPopup(auth, googleProvider)
        console.log('Google sign-in successful:', result.user.email)
        
        // Note: The user state will be updated by the onAuthStateChanged listener
        return result
      } catch (popupError) {
        console.error('Google popup sign-in error:', popupError)
        
        // Handle specific popup errors gracefully
        if (popupError.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign-in cancelled by user')
        } else if (popupError.code === 'auth/popup-blocked') {
          throw new Error('Popup blocked by browser. Please allow popups for this site.')
        } else if (popupError.message.includes('Cross-Origin-Opener-Policy')) {
          // COOP issue detected - provide helpful guidance
          console.warn('COOP issue detected with Google sign-in')
          throw new Error('Google sign-in blocked by browser security settings. Please try using email/password login, or check your browser settings.')
        } else {
          throw new Error(`Google sign-in failed: ${popupError.message}`)
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      setLoading(false)
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      // Check if auth is available
      if (!auth) {
        throw new Error('Authentication service not available')
      }
      
      console.log('Signing out user...')
      setAuthError('')
      await signOut(auth)
      console.log('User signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      setAuthError('Sign out failed')
    }
  }

  const clearError = () => {
    setAuthError('')
  }

  const value = {
    user,
    loading,
    authError,
    isInitialized,
    signInWithEmail,
    signInWithGoogle,
    signOut: signOutUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}