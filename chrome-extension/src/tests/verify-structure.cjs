// Script to verify the file structure is correct for the Chrome extension
const fs = require('fs');
const path = require('path');

// Get the directory where this script is located
const scriptDir = __dirname;
console.log('Script directory:', scriptDir);

// The manifest should be in src/core relative to this script
const manifestPath = path.join(scriptDir, '..', 'core', 'manifest.json');
console.log('Checking manifest at:', manifestPath);

if (!fs.existsSync(manifestPath)) {
  console.error('ERROR: manifest.json not found at', manifestPath);
  process.exit(1);
}

let manifest;
try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  manifest = JSON.parse(manifestContent);
  console.log('✓ manifest.json loaded successfully');
} catch (err) {
  console.error('ERROR: Failed to parse manifest.json', err.message);
  process.exit(1);
}

// Check popup path (relative to manifest)
const popupPath = path.join(scriptDir, '..', 'core', manifest.action.default_popup);
console.log('Checking popup at:', popupPath);
if (!fs.existsSync(popupPath)) {
  console.error('ERROR: Popup file not found at', popupPath);
  process.exit(1);
} else {
  console.log('✓ Popup file found');
}

// Check background script path (relative to manifest)
const backgroundPath = path.join(scriptDir, '..', 'core', manifest.background.service_worker);
console.log('Checking background script at:', backgroundPath);
if (!fs.existsSync(backgroundPath)) {
  console.error('ERROR: Background script not found at', backgroundPath);
  process.exit(1);
} else {
  console.log('✓ Background script found');
}

// Check content scripts
if (manifest.content_scripts && manifest.content_scripts.length > 0) {
  for (let i = 0; i < manifest.content_scripts.length; i++) {
    const contentScript = manifest.content_scripts[i];
    if (contentScript.js && contentScript.js.length > 0) {
      for (let j = 0; j < contentScript.js.length; j++) {
        const jsPath = path.join(scriptDir, '..', 'core', contentScript.js[j]);
        console.log('Checking content script at:', jsPath);
        if (!fs.existsSync(jsPath)) {
          console.error('ERROR: Content script not found at', jsPath);
          process.exit(1);
        } else {
          console.log('✓ Content script found');
        }
      }
    }
  }
}

console.log('\n✓ All paths are correct!');
console.log('\nTo load the extension in Chrome:');
console.log('1. Open Chrome and navigate to chrome://extensions');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log('4. Select the "src" directory (where this script is located)');