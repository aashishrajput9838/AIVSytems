// Firebase configuration for Chrome Extension
// This allows the extension to communicate with Firebase services

// Check if firebaseConfig is already defined to prevent duplicates
if (typeof window.firebaseConfig === 'undefined') {
  const firebaseConfig = {
    apiKey: "AIzaSyAfcsU7rGHIe5F-8zFYN9iglISWUguqGek",
    authDomain: "ai-reasoning-validation-system.firebaseapp.com",
    projectId: "ai-reasoning-validation-system",
    storageBucket: "ai-reasoning-validation-system.firebasestorage.app",
    messagingSenderId: "333673007466",
    appId: "1:333673007466:web:141fca7f82abcc89527d13",
    measurementId: "G-Q6XH7ZNE4L"
  };

  // Function to send data to Firebase Firestore directly from the extension
  async function sendToFirebase(data) {
    try {
      // In a real implementation, you would use the Firebase JS SDK
      // For now, we'll use the REST API to avoid including the full SDK
      
      // Firebase Firestore REST API endpoint
      const projectId = firebaseConfig.projectId;
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

  // Export for use in other files
  window.firebaseConfig = firebaseConfig;
  window.sendToFirebase = sendToFirebase;
} else {
  console.log('Firebase config already defined, skipping initialization');
}