# React DevTools Installation Guide

## Browser Extension Installation

### Chrome/Edge
1. Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Click "Add to Chrome"
3. Restart your browser

### Firefox
1. Go to the [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
2. Click "Add to Firefox"
3. Restart your browser

### Safari
1. Go to the [Safari Extensions Gallery](https://apps.apple.com/us/app/react-developer-tools/id1383231833)
2. Download and install
3. Enable in Safari Preferences > Extensions

## Standalone Installation (Alternative)

If you prefer a standalone version:

```bash
npm install -g react-devtools
```

Then run:
```bash
react-devtools
```

This will open a separate window that connects to your React app.

## Verification

After installation, you should see:
- React DevTools tab in your browser's developer tools
- No more console warnings about React DevTools
- Enhanced debugging capabilities for React components

## Troubleshooting

If you still see the warning:
1. Make sure the extension is enabled
2. Refresh the page
3. Check if you're in development mode
4. Try disabling and re-enabling the extension
