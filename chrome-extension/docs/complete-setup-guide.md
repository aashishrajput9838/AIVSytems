# Complete AIV Systems Chrome Extension Setup Guide

## Overview
This guide provides step-by-step instructions to set up and use the AIV Systems Chrome Extension with your AIV System backend.

## Prerequisites
1. Node.js and npm installed
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Google Firebase account
4. Chrome browser

## Setup Instructions

### 1. Project Structure
Your project should have the following structure:
```
AIV-System/
├── src/                    # Main AIV System frontend
├── functions/              # Firebase Functions backend
├── chrome-extension/       # Chrome extension files
└── ...                     # Other project files
```

### 2. Set Up Firebase Functions

#### a. Install Dependencies
```bash
cd functions
npm install
cd ..
```

#### b. Login to Firebase
```bash
firebase login
```

#### c. Deploy Functions
```bash
firebase deploy --only functions
```

#### d. Note the Function URLs
After deployment, you'll receive URLs for your functions. Note the `validateAIResponse` function URL.

### 3. Configure Chrome Extension

#### a. Update Function URL
Edit `chrome-extension/background.js` and update the `functionUrl` variable with your deployed function URL:
```javascript
const functionUrl = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/validateAIResponse';
```

#### b. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `chrome-extension` folder
4. The AIV Systems Validator extension should now appear in your toolbar

### 4. Configure AIV System Frontend

#### a. Update Environment Variables
If needed, update your `.env` file to include any new configuration for the Chrome extension integration.

#### b. Start Development Server
```bash
npm run dev
```

## Usage Instructions

### 1. Enable Validation
1. Click the AIV Systems icon in your Chrome toolbar
2. Toggle the "Enable Validation" switch to ON
3. The status should change to "Validation is ON"

### 2. Use with AI Chat Platforms
Navigate to any supported AI chat platform:
- Groq (https://groq.com)
- Google Gemini (https://gemini.google.com)
- OpenAI ChatGPT (https://chat.openai.com or https://chatgpt.com)
- Anthropic Claude (https://claude.ai)
- Microsoft Copilot (https://copilot.microsoft.com)

### 3. Interact with AI
As you chat with the AI, the extension will automatically:
1. Capture your questions
2. Capture the AI's responses
3. Send the interactions to your AIV System for validation
4. Process validation results

### 4. View Results
Validation results will be processed by your AIV System and can be viewed in your dashboard.

## Development Workflow

### Local Development
1. Start the Firebase Emulator:
   ```bash
   firebase emulators:start --only functions
   ```

2. Update the Chrome extension to use the local function URL:
   ```javascript
   const functionUrl = 'http://localhost:5001/YOUR_PROJECT_ID/us-central1/validateAIResponse';
   ```

3. Make changes to your functions and test locally

4. When ready, deploy to production:
   ```bash
   firebase deploy --only functions
   ```

### Testing the Extension
1. Make changes to the extension files
2. Go to `chrome://extensions`
3. Click the refresh icon next to the AIV Systems Validator extension
4. Test functionality

## Customization

### Add Support for New Platforms
1. Add the platform URL to `manifest.json` host_permissions
2. Add the platform URL to `manifest.json` content_scripts.matches
3. Add the platform URL to `background.js` supportedPlatforms array
4. Update `content.js` with platform-specific selectors

### Modify Validation Logic
1. Update the `performValidation` function in `functions/index.js`
2. Deploy the updated functions
3. The Chrome extension will automatically use the new validation logic

## Troubleshooting

### Common Issues

#### Extension Not Capturing Messages
1. Ensure validation is enabled in the popup
2. Verify you're on a supported platform
3. Check that the content script is loaded (Developer Tools → Sources → Content scripts)

#### Validation Not Working
1. Check that Firebase Functions are deployed
2. Verify the function URL in `background.js` is correct
3. Check the Firebase Console for function logs

#### CORS Errors
1. Ensure the Firebase Function includes proper CORS headers
2. Check that the function URL is correct

### Debugging Tips

#### Chrome Extension
1. Right-click the extension icon → Inspect popup
2. Developer Tools → Sources → Content scripts
3. Check the Network tab for API requests

#### Firebase Functions
1. Check the Firebase Console Functions tab
2. View logs with `firebase functions:log`
3. Use the emulator for local testing

## Security Considerations

### Data Privacy
- The extension only captures data on supported AI chat platforms
- Data is sent securely to your AIV System
- No personal information is collected beyond what's visible in the chat

### Authentication
- Consider adding authentication to your Firebase Functions for production
- Implement rate limiting to prevent abuse

### HTTPS
- Use HTTPS in production to encrypt data in transit

## Future Enhancements

### Planned Improvements
1. Visual indicators in the chat interface for validation results
2. More sophisticated message detection for each platform
3. Support for additional AI chat platforms
4. Offline caching of interactions for later validation
5. Detailed analytics and reporting features

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support
For issues or questions, please:
1. Check the documentation
2. Review the troubleshooting section
3. Open an issue on the repository
4. Contact the development team

## License
This project is licensed under the MIT License - see the LICENSE file for details.