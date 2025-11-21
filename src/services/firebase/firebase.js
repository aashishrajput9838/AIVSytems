import { initializeApp, getApps } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration loaded from environment variables (Vite / import.meta.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || null,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || null,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || null,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || null,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || null,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || null,
}

// Debug Firebase configuration
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing',
  measurementId: firebaseConfig.measurementId ? 'Set' : 'Missing',
})

// Validate Firebase configuration (basic checks)
const requiredFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingKeys = requiredFirebaseKeys.filter(k => !firebaseConfig[k])
const isFirebaseConfigValid = missingKeys.length === 0

if (!isFirebaseConfigValid) {
  console.warn('Firebase configuration is missing the following keys:', missingKeys)
}

// Initialize app only once
let app;
try {
  if (isFirebaseConfigValid) {
    // Clear any existing apps to avoid conflicts
    if (getApps().length > 0) {
      console.log('Clearing existing Firebase apps');
      getApps().forEach(app => app.delete());
    }
    
    console.log('Initializing Firebase app')
    app = initializeApp(firebaseConfig);
    console.log('Firebase App initialized:', app ? app.name : 'Failed');
  } else {
    console.error('Skipping Firebase initialization due to invalid configuration; check your VITE_FIREBASE_* env vars')
    app = null;
  }
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  app = null;
}

let db = null;
let auth = null;
let googleProvider = null;

try {
  if (app) {
    db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
    });
    console.log('Firestore initialized:', !!db);
    
    auth = getAuth(app);
    console.log('Firebase Auth initialized:', auth ? auth.app.name : 'Failed');
    
    if (auth) {
      googleProvider = new GoogleAuthProvider();
      // Add additional configuration to reduce COOP issues
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        // Add these parameters to help with popup handling
        auth_type: 'signIn',
        include_granted_scopes: 'true'
      });
      console.log('Google Auth Provider configured');
    } else {
      console.log('Google Auth Provider not configured due to missing auth');
    }
  }
} catch (error) {
  console.error('Error initializing Firebase services:', error);
}

export { db, auth, googleProvider };