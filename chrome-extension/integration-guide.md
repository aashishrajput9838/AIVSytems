# AIV System Chrome Extension Integration Guide

## Overview
This guide explains how to integrate the Chrome extension with your existing AIV System to enable real-time validation of AI chatbot interactions.

## Prerequisites
1. AIV System running locally or deployed
2. Chrome browser
3. Basic understanding of REST APIs

## Integration Steps

### 1. Configure AIV System Endpoint
The Chrome extension needs to know where your AIV System is running. By default, it tries to connect to `http://localhost:5178`.

If your AIV System is running on a different port or URL, you'll need to update the `background.js` file:

```javascript
// In background.js, update this function:
async function sendToAIVSystem(data) {
  try {
    // Change this URL to match your AIV System endpoint
    const response = await fetch('http://localhost:5178/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending data to AIV System:', error);
    throw error;
  }
}
```

### 2. Create API Endpoint in AIV System
You'll need to create an API endpoint in your AIV System to receive data from the Chrome extension. Here's an example implementation:

```javascript
// In your AIV System backend (e.g., src/services/api/logs.js)
import { validateResponse } from '../validation/algorithms';

export async function handleChromeExtensionData(req, res) {
  try {
    const { role, content, timestamp, url, platform } = req.body;
    
    // Validate the data
    if (!role || !content || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Process based on role
    if (role === 'user') {
      // Store user question for later validation
      // You might want to store this in a temporary cache
      // associated with the current session
    } else if (role === 'assistant') {
      // Validate AI response
      const validation = await validateResponse(content);
      
      // Return validation results
      return res.json({
        isValid: validation.isValid,
        confidence: validation.confidence,
        issues: validation.issues,
        suggestions: validation.suggestions
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing Chrome extension data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 3. Add Route to Your Router
Add a route for the new endpoint in your router:

```javascript
// In your router file (e.g., src/app/router.jsx or similar)
import { handleChromeExtensionData } from '../services/api/logs';

// Add this route
app.post('/api/chrome-extension/validate', handleChromeExtensionData);
```

### 4. Update Chrome Extension Permissions
If your AIV System is running on a different domain, you'll need to update the `manifest.json` file to include the appropriate host permissions:

```json
{
  "host_permissions": [
    "https://*.groq.com/*",
    "https://*.gemini.google.com/*",
    "https://chat.openai.com/*",
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://copilot.microsoft.com/*",
    "http://localhost:5178/*",
    "https://your-aiv-system-domain.com/*"
  ]
}
```

## Data Format

The Chrome extension sends data in the following format:

```json
{
  "role": "user|assistant",
  "content": "The actual message content",
  "timestamp": "ISO timestamp",
  "url": "Current page URL",
  "platform": "groq|gemini|chatgpt|claude|copilot|unknown"
}
```

## Example Implementation in AIV System

Here's a more complete example of how you might implement the validation endpoint in your AIV System:

```javascript
// src/services/api/chrome-extension.js
import { validateAIResponse } from '../validation/algorithms';

class ChromeExtensionService {
  constructor() {
    this.interactionCache = new Map(); // Store recent interactions
  }
  
  async processInteraction(data) {
    const { role, content, timestamp, url, platform } = data;
    
    try {
      if (role === 'user') {
        // Store user question
        const sessionId = this.generateSessionId(url);
        this.storeUserQuestion(sessionId, content, timestamp);
        return { success: true, message: 'User question stored' };
      } 
      else if (role === 'assistant') {
        // Validate AI response
        const sessionId = this.generateSessionId(url);
        const userQuestion = this.getLatestUserQuestion(sessionId);
        
        const validation = await validateAIResponse({
          question: userQuestion,
          response: content,
          platform: platform
        });
        
        // Log the validation result
        await this.logValidationResult({
          question: userQuestion,
          response: content,
          validation: validation,
          timestamp: timestamp,
          platform: platform
        });
        
        return {
          isValid: validation.isValid,
          confidence: validation.confidence,
          issues: validation.issues,
          suggestions: validation.suggestions
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing interaction:', error);
      throw error;
    }
  }
  
  generateSessionId(url) {
    // Generate a session ID based on the URL and current time
    return `${url}-${Math.floor(Date.now() / (1000 * 60 * 5))}`; // 5-minute sessions
  }
  
  storeUserQuestion(sessionId, question, timestamp) {
    if (!this.interactionCache.has(sessionId)) {
      this.interactionCache.set(sessionId, {
        questions: [],
        responses: []
      });
    }
    
    this.interactionCache.get(sessionId).questions.push({
      content: question,
      timestamp: timestamp
    });
  }
  
  getLatestUserQuestion(sessionId) {
    const session = this.interactionCache.get(sessionId);
    if (!session || session.questions.length === 0) {
      return null;
    }
    
    // Return the most recent question
    return session.questions[session.questions.length - 1].content;
  }
  
  async logValidationResult(logData) {
    // Implement your logging logic here
    // This could save to Firestore, a database, or a file
    console.log('Validation result:', logData);
  }
}

export default new ChromeExtensionService();
```

## Testing the Integration

1. Start your AIV System:
   ```bash
   npm run dev
   ```

2. Load the Chrome extension:
   - Open `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. Test the integration:
   - Click the extension icon
   - Toggle validation to ON
   - Navigate to a supported AI chat platform
   - Interact with the AI
   - Check your AIV System logs for captured data

## Security Considerations

1. **Authentication**: Consider adding authentication to your API endpoint to prevent unauthorized access
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Data Privacy**: Be mindful of user privacy and only capture necessary data
4. **HTTPS**: Use HTTPS in production to encrypt data in transit

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your AIV System backend allows requests from the Chrome extension
2. **Network Errors**: Verify that your AIV System is accessible from the Chrome extension
3. **Data Not Capturing**: Check that you're on a supported platform and validation is enabled

### Debugging Tips

1. Check the Chrome extension console: Right-click the extension icon → Inspect popup
2. Check the content script console: Developer Tools → Sources → Content scripts
3. Check your AIV System logs for incoming requests
4. Use the Network tab in Developer Tools to monitor API requests

## Next Steps

1. Implement visual feedback in the Chrome extension for validation results
2. Add support for more AI platforms
3. Implement offline caching for when the AIV System is unavailable
4. Add detailed analytics and reporting features
5. Create a dashboard in your AIV System to view captured interactions