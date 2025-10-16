import { initializeApp, getApps } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Hardcoded Firebase configuration - verified to match your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyAfcsU7rGHIe5F-8zFYN9iglISWUguqGek",
  authDomain: "ai-reasoning-validation-system.firebaseapp.com",
  projectId: "ai-reasoning-validation-system",
  storageBucket: "ai-reasoning-validation-system.firebasestorage.app",
  messagingSenderId: "333673007466",
  appId: "1:333673007466:web:141fca7f82abcc89527d13",
  measurementId: "G-Q6XH7ZNE4L",
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

// Validate Firebase configuration
const isFirebaseConfigValid = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket && 
  firebaseConfig.messagingSenderId && 
  firebaseConfig.appId;

if (!isFirebaseConfigValid) {
  console.error('Firebase configuration is invalid:', firebaseConfig);
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
    
    console.log('Initializing Firebase app with config:', firebaseConfig);
    app = initializeApp(firebaseConfig);
    console.log('Firebase App initialized:', app ? app.name : 'Failed');
  } else {
    console.error('Skipping Firebase initialization due to invalid configuration');
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