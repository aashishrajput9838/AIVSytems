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

// Debug Firebase configuration with specific values
console.log('Firebase Config Values:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'MISSING',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'SET' : 'MISSING',
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'SET' : 'MISSING',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? 'SET' : 'MISSING',
  VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? 'SET' : 'MISSING',
})

console.log('Firebase Config Processed Values:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'SET' : 'MISSING',
  storageBucket: firebaseConfig.storageBucket ? 'SET' : 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'SET' : 'MISSING',
  appId: firebaseConfig.appId ? 'SET' : 'MISSING',
  measurementId: firebaseConfig.measurementId ? 'SET' : 'MISSING',
})

// Validate Firebase configuration (basic checks)
const requiredFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingKeys = requiredFirebaseKeys.filter(k => !firebaseConfig[k])
const isFirebaseConfigValid = missingKeys.length === 0

if (!isFirebaseConfigValid) {
  console.warn('Firebase configuration is missing the following keys:', missingKeys)
  // Show which environment variables are missing
  const envVarMapping = {
    'apiKey': 'VITE_FIREBASE_API_KEY',
    'authDomain': 'VITE_FIREBASE_AUTH_DOMAIN',
    'projectId': 'VITE_FIREBASE_PROJECT_ID',
    'storageBucket': 'VITE_FIREBASE_STORAGE_BUCKET',
    'messagingSenderId': 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'appId': 'VITE_FIREBASE_APP_ID'
  }
  
  const missingEnvVars = missingKeys.map(key => envVarMapping[key])
  console.warn('Missing environment variables:', missingEnvVars)
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