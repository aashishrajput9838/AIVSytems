// Verification script to check that all paths in manifest.json are correct
const fs = require('fs');
const path = require('path');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.resolve(filePath));
  } catch (err) {
    return false;
  }
}

// Read the manifest file
const manifestPath = path.resolve(__dirname, '../core/manifest.json');
console.log('Checking manifest file at:', manifestPath);

if (!fileExists(manifestPath)) {
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

// Check popup path
const popupPath = path.resolve(__dirname, '../..', manifest.action.default_popup);
console.log('Checking popup file at:', popupPath);
if (!fileExists(popupPath)) {
  console.error('ERROR: Popup file not found at', popupPath);
  process.exit(1);
} else {
  console.log('✓ Popup file found');
}

// Check background script path
const backgroundPath = path.resolve(__dirname, '../..', manifest.background.service_worker);
console.log('Checking background script at:', backgroundPath);
if (!fileExists(backgroundPath)) {
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
        const jsPath = path.resolve(__dirname, '../..', contentScript.js[j]);
        console.log('Checking content script at:', jsPath);
        if (!fileExists(jsPath)) {
          console.error('ERROR: Content script not found at', jsPath);
          process.exit(1);
        } else {
          console.log('✓ Content script found');
        }
      }
    }
  }
}

console.log('\n✓ All paths in manifest.json are correct!');
console.log('\nTo load the extension in Chrome:');
console.log('1. Open Chrome and navigate to chrome://extensions');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log('4. Select the "src" directory');