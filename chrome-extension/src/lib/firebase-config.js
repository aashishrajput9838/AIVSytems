// Firebase configuration for Chrome Extension
// This allows the extension to communicate with Firebase services

// Check if firebaseConfig is already defined to prevent duplicates
if (typeof window.firebaseConfig === 'undefined') {
  // Prefer config provided at build time via import.meta.env (Vite)
  // For the extension runtime, allow injecting values at page load via window.__ENV__
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (window.__ENV__ || {})

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || null,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || null,
    projectId: env.VITE_FIREBASE_PROJECT_ID || null,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || null,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
    appId: env.VITE_FIREBASE_APP_ID || null,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || null,
  };

  // Function to send data to Firebase Firestore directly from the extension
  async function sendToFirebase(data) {
    try {
      // In a real implementation, you would use the Firebase JS SDK
      // For now, we'll use the REST API to avoid including the full SDK
      
      // Firebase Firestore REST API endpoint
      const projectId = firebaseConfig.projectId;
      if (!projectId) {
        throw new Error('Missing Firebase projectId in extension firebaseConfig')
      }
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/chrome_extension_logs`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: For production, you'll need to implement proper authentication
          // This is a simplified version for demonstration
        },
        body: JSON.stringify({
          fields: {
            role: { stringValue: data.role },
            content: { stringValue: data.content },
            timestamp: { stringValue: data.timestamp },
            url: { stringValue: data.url || '' },
            platform: { stringValue: data.platform || 'unknown' },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending data to Firebase:', error);
      throw error;
    }
  }

  // Basic validation and warnings
  const missingKeys = []
  if (!firebaseConfig.apiKey) missingKeys.push('apiKey')
  if (!firebaseConfig.projectId) missingKeys.push('projectId')
  if (missingKeys.length > 0) {
    console.warn('chrome-extension: firebaseConfig missing keys:', missingKeys)
  }

  // Export for use in other files
  window.firebaseConfig = firebaseConfig;
  window.sendToFirebase = sendToFirebase;
} else {
  console.log('Firebase config already defined, skipping initialization');
}