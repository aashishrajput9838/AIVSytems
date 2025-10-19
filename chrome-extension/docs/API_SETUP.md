# AIV System API Setup Guide

## Overview

This project uses Firebase Functions for the backend API rather than a traditional local development server. You have two options for running the API:

1. **Local Development** - Use the Firebase Emulator (recommended for development)
2. **Deployed Version** - Deploy to Firebase and use the live URL

## Option 1: Local Development with Firebase Emulator (Recommended)

### Prerequisites

1. **Node.js** installed on your system
2. **Firebase CLI** installed globally:
   ```
   npm install -g firebase-tools
   ```

### Setup Instructions

1. **Navigate to your AIV System project directory**
   ```
   cd "c:\Users\aashi\OneDrive\Desktop\AIV System"
   ```

2. **Install Firebase CLI** (if not already installed)
   ```
   npm install -g firebase-tools
   ```

3. **Login to Firebase**
   ```
   firebase login
   ```
   This will open a browser window for authentication.

4. **Install functions dependencies**
   ```
   cd functions
   npm install
   cd ..
   ```

5. **Start the Firebase Emulator**
   ```
   firebase emulators:start --only functions
   ```

   You should see output similar to:
   ```
   i  Starting emulators: ["functions"]
   ✔  functions: Using node@18 from host.
   ✔  functions: Emulator started at http://localhost:5001
   i  functions: Watching "[path]\functions" for Cloud Functions...
   ✔  functions[validateAIResponse]: http function initialized (http://localhost:5001/ai-reasoning-validation-system/us-central1/validateAIResponse).
   ```

### Verifying the Emulator is Running

1. **Check the emulator output** for the function URL:
   ```
   http://localhost:5001/ai-reasoning-validation-system/us-central1/validateAIResponse
   ```

2. **Test the function** by sending a POST request:
   ```json
   {
     "role": "assistant",
     "content": "Artificial intelligence is a branch of computer science that aims to create software or machines that exhibit human-like intelligence.",
     "timestamp": "2025-10-16T19:00:34.141Z",
     "url": "https://chatgpt.com/c/68f1408a-9508-8322-8bfa-8e0704fde57c",
     "platform": "chatgpt"
   }
   ```

## Option 2: Deployed Version

### Deploy to Firebase

1. **Navigate to your AIV System project directory**
   ```
   cd "c:\Users\aashi\OneDrive\Desktop\AIV System"
   ```

2. **Deploy the functions**
   ```
   firebase deploy --only functions
   ```

3. **Get the deployed function URL** from the deployment output:
   ```
   Function URL (validateAIResponse): https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/validateAIResponse
   ```

### Update Chrome Extension for Deployed Version

1. **Open `validation-service.js`** in the chrome-extension folder
2. **Modify the `apiEndpoint` variable** to use the deployed URL:
   ```javascript
   this.apiEndpoint = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/validateAIResponse';
   ```
3. **Save the file and reload the extension** in Chrome

## Troubleshooting

### If you're getting connection errors:

1. **Check if the emulator is running**:
   - Look for the terminal where you ran `firebase emulators:start`
   - Make sure there are no error messages
   - Verify that the function URL is displayed

2. **Verify the function URL**:
   - The extension expects the validation function at the correct URL
   - Check that the URL in `validation-service.js` matches the one shown in the emulator output

3. **Check for firewall issues**:
   - Ensure that your firewall is not blocking port 5001
   - Try accessing `http://localhost:5001` in your browser

4. **Check the emulator logs**:
   - Look at the terminal output from the Firebase emulator
   - Check if requests are reaching the function
   - Look for any error messages

### Common Issues

1. **"Port already in use"**:
   - Another process is using port 5001
   - Stop the other process or change the port in firebase.json

2. **"Firebase not installed"**:
   - Run `npm install -g firebase-tools`

3. **"Not logged in"**:
   - Run `firebase login` and complete the authentication

## Testing the Extension

1. **Reload the extension** in Chrome:
   - Go to `chrome://extensions`
   - Find "AIV Systems Validator"
   - Click the reload icon

2. **Enable validation** in the extension popup

3. **Visit an AI chat platform** like ChatGPT

4. **Interact with the AI** - ask a question and wait for a response

5. **Check the popup** for validation results

## Mock Validation

When the API is not accessible, the extension will show mock validation results with error messages indicating that the API is not reachable. This is intended for testing purposes only.

The mock results will show:
- Error messages about API connectivity
- Suggestions for fixing the issue
- Random validity status (70% chance of being valid)
- Random confidence scores