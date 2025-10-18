# Firebase Functions Deployment Guide

## Prerequisites
1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Logged into Firebase (`firebase login`)
3. Firebase project set up

## Setup Instructions

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Deploy Functions
```bash
# From the project root directory
firebase deploy --only functions
```

### 3. Get Function URLs
After deployment, Firebase will provide URLs for your functions:
- `validateAIResponse`: Used by the Chrome extension to send interactions
- `getValidations`: Used to retrieve validation results

The URLs will be in the format:
```
https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
```

## Configuration

### Update Chrome Extension
After deploying, update the function URL in `chrome-extension/background.js`:

```javascript
// Replace this line in background.js
const functionUrl = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/validateAIResponse';
```

## Testing Locally

### 1. Run Firebase Emulator
```bash
# From the project root directory
firebase emulators:start --only functions
```

### 2. Update Chrome Extension for Local Testing
When using the emulator, update the function URL in `chrome-extension/background.js`:
```javascript
const functionUrl = 'http://localhost:5001/YOUR_PROJECT_ID/us-central1/validateAIResponse';
```

## Function Details

### validateAIResponse
- **Method**: POST
- **Purpose**: Receives AI chat interactions from the Chrome extension
- **Data Format**:
  ```json
  {
    "role": "user|assistant",
    "content": "Message content",
    "timestamp": "ISO timestamp",
    "url": "Current page URL",
    "platform": "AI platform name"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "validation": {
      "isValid": true,
      "confidence": 0.95,
      "issues": [],
      "suggestions": []
    }
  }
  ```

### getValidations
- **Method**: GET
- **Purpose**: Retrieve recent validation results
- **Response**:
  ```json
  {
    "success": true,
    "validations": [...]
  }
  ```

## Monitoring and Logging

### View Logs
```bash
firebase functions:log
```

### View Logs for Specific Function
```bash
firebase functions:log --only validateAIResponse
```

## Troubleshooting

### Common Issues

1. **Permission Errors**: Make sure you're logged into Firebase and have proper permissions
2. **Deployment Failures**: Check that all dependencies are installed
3. **Function Not Found**: Verify the function name and region in the URL

### Debugging Tips

1. Check the Firebase Console for error logs
2. Use the emulator for local testing
3. Verify the function URL in the Chrome extension matches the deployed URL
4. Check browser console for network errors

## Security Considerations

1. **CORS**: The functions include basic CORS headers for development
2. **Rate Limiting**: Consider implementing rate limiting for production
3. **Authentication**: For production, consider adding authentication to prevent abuse
4. **Input Validation**: The functions include basic input validation

## Next Steps

1. Implement your actual validation logic in the `performValidation` function
2. Add authentication if needed
3. Implement rate limiting
4. Add more sophisticated error handling
5. Add unit tests for your functions