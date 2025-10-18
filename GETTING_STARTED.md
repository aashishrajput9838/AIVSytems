# Getting Started with AIV Systems

## Quick Start Guide

Follow these steps to get the AIV Systems Chrome Extension working:

### Step 1: Start the Backend (Firebase Emulator)

1. Double-click on `start-firebase-emulator.bat` in the AIV System folder
2. Wait for the emulator to start (you'll see a URL like `http://localhost:5001/...`)
3. Keep this terminal window open

### Step 2: Test the Backend

1. Double-click on `test-firebase-function.bat` 
2. You should see "Firebase Function is working!" if everything is set up correctly

### Step 3: Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The AIV Systems extension should appear in your toolbar

### Step 4: Test the Extension

1. Click the AIV Systems icon in your Chrome toolbar
2. Toggle "Enable Validation" to ON
3. Visit an AI chat platform (like ChatGPT)
4. Ask a question and get a response
5. Check the extension popup for validation results

## If You Encounter Issues

### Backend Not Working

1. Make sure you ran `start-firebase-emulator.bat`
2. Check that the emulator is still running
3. Verify the function URL in the terminal output matches what's in `validation-service.js`

### Extension Not Capturing Messages

1. Make sure validation is enabled in the popup
2. Try refreshing the AI chat page
3. Check the browser console (Ctrl+Shift+J) for errors

### Validation Results Not Showing

1. Check that the Firebase emulator is running
2. Look at the background script console in Chrome extensions
3. Make sure you're on a supported AI platform

## Next Steps

Once everything is working:

1. Customize the validation logic in the Firebase functions
2. Deploy your functions to Firebase for permanent hosting
3. Modify the extension as needed for your specific use case

## Need Help?

Check these files for more detailed information:
- [API_SETUP.md](chrome-extension/API_SETUP.md) - Detailed backend setup
- [README.md](chrome-extension/README.md) - Extension documentation
- [DEPLOYMENT.md](functions/DEPLOYMENT.md) - Deploying to Firebase