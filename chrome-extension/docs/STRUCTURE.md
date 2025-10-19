# AIV Systems Chrome Extension - Directory Structure

## Overview
This document describes the organized directory structure of the AIV Systems Chrome Extension project.

## Directory Structure
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

## Detailed Directory Descriptions

### src/core/
Contains the essential configuration files for the extension:
- `manifest.json`: Extension configuration with updated paths
- `package.json`: Project metadata and scripts

### src/background/
Contains the background script that handles validation logic:
- `background.js`: Background service worker with updated import path

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
- `DEBUG_DEMO.html`: Debug demo page
- `debug-validation.html`: Debug validation page
- `debug-validation.js`: Debug validation script

### src/tests/
Contains test scripts and test pages:
- JavaScript test files (test-*.js)
- HTML test pages (test-*.html)
- `verify-fixes.js`: Fix verification script

### docs/
Contains all documentation files:
- `API_SETUP.md`: API setup guide
- `README.md`: Main README file
- `CODEBASE_INDEX.md`: Codebase index
- `STRUCTURE.md`: This file
- Various other documentation files

## File Movement Summary

### Core Files
- `manifest.json` → `src/core/manifest.json`
- `package.json` → `src/core/package.json`

### Background Script
- `background.js` → `src/background/background.js`

### Content Script
- `content.js` → `src/content/content.js`

### Popup UI
- `popup.html` → `src/popup/popup.html`
- `popup.js` → `src/popup/popup.js`

### Services
- `validation-service.js` → `src/services/validation-service.js`
- `firebase-config.js` → `src/services/firebase-config.js`

### Utilities
- `debug-utils.js` → `src/utils/debug-utils.js`
- `debug-helper.js` → `src/utils/debug-helper.js`

### Debug Files
- `DEBUG_DEMO.html` → `src/debug/DEBUG_DEMO.html`
- `debug-validation.html` → `src/debug/debug-validation.html`
- `debug-validation.js` → `src/debug/debug-validation.js`

### Test Files
- All `test-*.js` files → `src/tests/`
- All `test-*.html` files → `src/tests/`
- `verify-fixes.js` → `src/tests/verify-fixes.js`

### Documentation
- All `*.md` files → `docs/`
- `DEPLOYMENT.html` → `docs/DEPLOYMENT.html`

## Benefits of the New Structure

1. **Improved Organization**: Files are grouped by functionality, making it easier to locate specific components.
2. **Better Maintainability**: Related files are colocated, simplifying updates and modifications.
3. **Scalability**: The structure can easily accommodate new features and components.
4. **Clear Separation of Concerns**: Each directory has a well-defined purpose.
5. **Easier Onboarding**: New developers can quickly understand the project structure.

## Migration Notes

1. The `manifest.json` file was updated to reflect the new file paths.
2. The `background.js` file was updated to use the correct path for importing `validation-service.js`.
3. All other files maintain their original functionality but are now organized in a logical structure.