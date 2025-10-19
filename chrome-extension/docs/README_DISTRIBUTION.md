# AIV Systems Chrome Extension

## Description
A Chrome extension that enables real-time validation of AI chatbot responses using the AIV Systems platform. It captures interactions between you and AI chatbots (like Groq, Gemini, ChatGPT, Claude, etc.) and validates the responses in real-time.

## Features
- Toggle validation on/off from the extension popup
- Captures user questions and AI responses automatically
- Works with multiple AI chat platforms:
  - Groq
  - Google Gemini
  - OpenAI ChatGPT
  - Anthropic Claude
  - Microsoft Copilot

## Installation
1. Extract this folder
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select this folder
5. The AIV Systems Validator extension should now appear in your toolbar

## Usage
1. Click the AIV Systems icon in your Chrome toolbar
2. Toggle the "Enable Validation" switch to ON
3. Navigate to any supported AI chat platform
4. Interact with the AI chatbot as normal
5. The extension will automatically capture your questions and the AI's responses

## Requirements
- Google Chrome browser
- AIV Systems backend running (for validation functionality)

## Files Included
- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality
- `background.js` - Background service worker
- `content.js` - Content script for capturing interactions
- `firebase-config.js` - Firebase configuration
- `DEPLOYMENT.html` - Free deployment guide
- `README.md` - Technical documentation

## Support
For issues or questions, please refer to the documentation or contact the development team.