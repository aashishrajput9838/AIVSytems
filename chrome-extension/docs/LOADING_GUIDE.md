# AIV Systems Chrome Extension - Loading Guide

## Loading the Restructured Extension

After reorganizing the codebase into a structured directory layout, you'll need to update how you load the extension in Chrome.

## Prerequisites

1. Google Chrome browser
2. AIV System backend running (either locally with Firebase Emulator or deployed to Firebase)

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" 
4. Navigate to the project directory and select the `src` folder (not the root directory)
5. The AIV Systems extension should now appear in your toolbar

## Directory Structure for Loading

The extension should be loaded from the `src` directory, which contains all the necessary files organized in the following structure:

```
src/
├── core/                 # Core extension files (manifest.json, package.json)
├── background/           # Background script
├── content/              # Content script
├── popup/                # Popup UI (HTML and JavaScript)
├── services/             # Services (validation, Firebase config)
├── utils/                # Utility functions
├── debug/                # Debug tools and pages
├── tests/                # Test scripts and test pages
└── ui/                   # Additional UI components (future use)
```

## Verification

After loading the extension:

1. Check that the extension appears in the Chrome toolbar
2. Click on the extension icon to open the popup
3. Verify that the UI loads correctly
4. Enable validation and test with an AI chat platform

## Troubleshooting

### If the Extension Fails to Load

1. **Check the manifest.json file**: Ensure all paths in the manifest are correct
2. **Verify file locations**: Confirm all files are in their correct directories
3. **Check Chrome console**: Look for any error messages in the browser console

### If the Extension Loads but Doesn't Function

1. **Check background script**: Open `chrome://extensions`, find the AIV Systems extension, and click "Inspect views: service worker" to check for errors
2. **Verify API connectivity**: Ensure the AIV System backend is running and accessible
3. **Check content script**: Navigate to an AI chat platform and check the page console for any errors

### Path-related Issues

If you encounter issues related to file paths:

1. Verify that the `manifest.json` file in `src/core/` has the correct paths:
   - `action.default_popup` should point to `../popup/popup.html`
   - `background.service_worker` should point to `../background/background.js`
   - `content_scripts.js` entries should point to the correct locations in `../utils/` and `../content/`

2. Ensure the `background.js` file correctly imports `../services/validation-service.js`

## Testing the Restructured Extension

1. Load the extension using the `src` directory as described above
2. Open an AI chat platform (ChatGPT, Gemini, etc.)
3. Enable validation in the extension popup
4. Interact with the AI and verify that:
   - Messages are captured correctly
   - Validation requests are sent to the backend
   - Results are displayed in the popup

## Development Workflow

When making changes to the restructured extension:

1. Edit files in their respective directories under `src/`
2. Reload the extension in Chrome (`chrome://extensions` → Reload button)
3. Test the changes

## File Locations Summary

| Component | Location |
|-----------|----------|
| Manifest | `src/core/manifest.json` |
| Background Script | `src/background/background.js` |
| Content Script | `src/content/content.js` |
| Popup HTML | `src/popup/popup.html` |
| Popup JavaScript | `src/popup/popup.js` |
| Validation Service | `src/services/validation-service.js` |
| Firebase Config | `src/services/firebase-config.js` |
| Debug Utilities | `src/utils/debug-utils.js` |
| Debug Helper | `src/utils/debug-helper.js` |

This structure makes it easier to locate and modify specific components of the extension.