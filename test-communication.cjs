// Test script to verify extension communication
const http = require('http');

// Test the validation service directly
const testData = JSON.stringify({
  role: 'assistant',
  content: 'The Earth is round and orbits the Sun.',
  timestamp: new Date().toISOString(),
  url: 'https://chatgpt.com/',
  platform: 'chatgpt'
});

const options = {
  hostname: '127.0.0.1',
  port: 5004,
  path: '/ai-reasoning-validation-system/us-central1/validateAIResponse',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('Testing Firebase function directly...');
const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Direct function test - Response:', responseData);
    
    // Now test if we can access the dist directory
    const fs = require('fs');
    const path = require('path');
    
    const distPath = path.join(__dirname, 'chrome-extension', 'dist');
    console.log('Checking if dist directory exists:', distPath);
    
    if (fs.existsSync(distPath)) {
      console.log('✓ Dist directory exists');
      
      // Check if manifest.json exists in dist root
      const manifestPath = path.join(distPath, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        console.log('✓ manifest.json exists in dist root');
      } else {
        console.log('✗ manifest.json NOT found in dist root');
      }
      
      // Check if background script exists
      const backgroundPath = path.join(distPath, 'components', 'background', 'background.js');
      if (fs.existsSync(backgroundPath)) {
        console.log('✓ Background script exists');
      } else {
        console.log('✗ Background script NOT found');
      }
      
      // Check if content script exists
      const contentPath = path.join(distPath, 'content', 'content.js');
      if (fs.existsSync(contentPath)) {
        console.log('✓ Content script exists');
      } else {
        console.log('✗ Content script NOT found');
      }
      
      // Check if popup files exist
      const popupHtmlPath = path.join(distPath, 'components', 'popup', 'popup.html');
      const popupJsPath = path.join(distPath, 'components', 'popup', 'popup.js');
      
      if (fs.existsSync(popupHtmlPath)) {
        console.log('✓ Popup HTML exists');
      } else {
        console.log('✗ Popup HTML NOT found');
      }
      
      if (fs.existsSync(popupJsPath)) {
        console.log('✓ Popup JS exists');
      } else {
        console.log('✗ Popup JS NOT found');
      }
    } else {
      console.log('✗ Dist directory does not exist');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(testData);
req.end();