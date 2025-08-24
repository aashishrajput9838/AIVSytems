import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Debug Firebase configuration
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing',
})

// Initialize app only once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
console.log('Firebase App initialized:', app.name)

export const db = getFirestore(app)
console.log('Firestore initialized')

export const auth = getAuth(app)
console.log('Firebase Auth initialized:', auth.app.name)

export const googleProvider = new GoogleAuthProvider()
// Add additional configuration to reduce COOP issues
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add these parameters to help with popup handling
  auth_type: 'signIn',
  include_granted_scopes: 'true'
})
console.log('Google Auth Provider configured')

// Remove duplicate persistence call - it will be handled in AuthProvider
