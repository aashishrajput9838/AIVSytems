# AIV Systems Chrome Extension - Codebase Index

## Project Overview
The AIV Systems Chrome Extension captures AI chat interactions from platforms like ChatGPT, Gemini, Claude, Groq, and Copilot, and validates responses in real-time using the AIV System backend.

## Project Structure
```
├── src/
│   ├── core/                 # Core extension files (manifest.json, package.json)
│   ├── background/           # Background script
│   ├── content/              # Content script
│   ├── popup/                # Popup UI (HTML and JavaScript)
│   ├── services/             # Services (validation, Firebase config)
│   ├── utils/                # Utility functions
│   ├── debug/                # Debug tools and pages
│   ├── tests/                # Test scripts and test pages
│   └── ui/                   # Additional UI components (future use)
├── docs/                     # Documentation files
└── README.md                 # Root README file
```

## Directory Descriptions

### src/core/
Contains the essential configuration files for the extension:
- `manifest.json`: Extension configuration
- `package.json`: Project metadata and scripts

### src/background/
Contains the background script that handles validation logic:
- `background.js`: Background service worker

### src/content/
Contains the content script that runs on AI chat pages:
- `content.js`: Captures messages and pairs conversations

### src/popup/
Contains the popup UI files:
- `popup.html`: Popup interface
- `popup.js`: Popup logic

### src/services/
Contains service files that communicate with external systems:
- `validation-service.js`: AIV System validation service
- `firebase-config.js`: Firebase configuration

### src/utils/
Contains utility functions used throughout the extension:
- `debug-utils.js`: Debugging utilities
- `debug-helper.js`: Enhanced debugging functions

### src/debug/
Contains debugging tools and test pages:
- Various HTML and JS files for debugging

### src/tests/
Contains test scripts and test pages:
- JavaScript test files
- HTML test pages

### docs/
Contains all documentation files:
- Setup guides
- Troubleshooting guides
- API documentation
- Various markdown files with project information

## Key Features Implemented

1. **Real-time Validation**: Captures AI responses and validates them using the AIV System
2. **Conversation Pairing**: Matches user questions with AI responses
3. **Duplicate Prevention**: Multiple levels of deduplication (content-based, time-based, pair-based)
4. **Improved Matching Logic**: Handles whitespace, newline, and formatting variations
5. **Validation Display**: Shows detailed validation results with color coding
6. **Multi-platform Support**: Works with ChatGPT, Gemini, Groq, Claude, and Copilot

## Technical Architecture

1. **Content Script**: Runs on AI chat pages to capture messages
2. **Background Script**: Handles validation logic and communication with backend
3. **Popup UI**: Displays conversation pairs and validation results
4. **Firebase Integration**: Uses Firebase Functions for backend validation
5. **Message Passing**: Uses Chrome's message passing API for communication between components

## Configuration

The extension is configured to use the Firebase Emulator by default at:
`http://localhost:5004/ai-reasoning-validation-system/us-central1/validateAIResponse`

To use the deployed version, the endpoint URL in `src/services/validation-service.js` needs to be updated.