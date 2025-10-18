const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Get Firestore instance
const db = admin.firestore();

// Function to handle Chrome extension validation requests
exports.validateAIResponse = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }
  
  try {
    // Extract data from request
    const { role, content, timestamp, url, platform } = req.body;
    
    // Validate required fields
    if (!role || !content || !timestamp) {
      res.status(400).json({ error: 'Missing required fields: role, content, timestamp' });
      return;
    }
    
    // Log the interaction to Firestore (if available)
    let logEntry = {
      role,
      content,
      timestamp: timestamp,
      url,
      platform,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Try to use Firestore timestamp if available
      if (admin.firestore && admin.firestore.Timestamp) {
        logEntry.timestamp = admin.firestore.Timestamp.fromDate(new Date(timestamp));
        logEntry.createdAt = admin.firestore.FieldValue.serverTimestamp();
      }
      
      // Add to logs collection
      await db.collection('chrome_extension_logs').add(logEntry);
    } catch (firestoreError) {
      console.log('Firestore not available, logging to console instead');
      console.log('Log entry:', logEntry);
    }
    
    // If this is an AI response, perform validation
    if (role === 'assistant') {
      // Here you would implement your actual validation logic
      // For now, we'll return a mock validation result
      const validation = await performValidation(content, url, platform);
      
      // Store validation result (if Firestore is available)
      try {
        let validationEntry = {
          ...validation,
          originalContent: content,
          url,
          platform,
          timestamp: timestamp,
          createdAt: new Date().toISOString()
        };
        
        if (admin.firestore && admin.firestore.Timestamp) {
          validationEntry.timestamp = admin.firestore.Timestamp.fromDate(new Date(timestamp));
          validationEntry.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        
        await db.collection('validations').add(validationEntry);
      } catch (firestoreError) {
        console.log('Could not store validation result in Firestore');
      }
      
      // Return validation result
      res.status(200).json({
        success: true,
        validation: validation
      });
      return;
    }
    
    // For user questions, just acknowledge
    res.status(200).json({
      success: true,
      message: 'User question logged successfully'
    });
    
  } catch (error) {
    console.error('Error in validateAIResponse:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Mock validation function - replace with your actual validation logic
async function performValidation(content, url, platform) {
  // This is where you would implement your AIV System validation logic
  // For now, we'll return mock results
  
  // Simulate some validation logic
  const isValid = Math.random() > 0.3; // 70% chance of being valid
  const confidence = Math.random();
  
  // Mock issues and suggestions
  const issues = isValid ? [] : [
    {
      type: 'accuracy',
      description: 'Response may contain factual inaccuracies',
      severity: 'medium'
    }
  ];
  
  const suggestions = [
    {
      type: 'improvement',
      description: 'Consider providing more specific examples',
      severity: 'low'
    }
  ];
  
  return {
    isValid,
    confidence,
    issues,
    suggestions
  };
}

// Function to get recent validations
exports.getValidations = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
    return;
  }
  
  try {
    // Try to get validations from Firestore
    try {
      const snapshot = await db.collection('validations')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      const validations = [];
      snapshot.forEach(doc => {
        validations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      res.status(200).json({
        success: true,
        validations
      });
    } catch (firestoreError) {
      // If Firestore is not available, return empty validations
      res.status(200).json({
        success: true,
        validations: []
      });
    }
    
  } catch (error) {
    console.error('Error in getValidations:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});