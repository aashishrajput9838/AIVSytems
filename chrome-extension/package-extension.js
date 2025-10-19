const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to package the Chrome extension
function packageExtension() {
  console.log('Packaging Chrome Extension...');
  
  try {
    // First, ensure we have a fresh build
    console.log('Building extension...');
    execSync('node build-extension.js', { stdio: 'inherit' });
    
    // Create the zip file
    const distPath = path.join(__dirname, 'dist');
    const zipPath = path.join(__dirname, '..', 'aiv-systems-chrome-extension.zip');
    
    console.log(`Creating zip file: ${zipPath}`);
    
    // Use PowerShell to create the zip file (Windows compatible)
    const command = `powershell -Command "Compress-Archive -Path '${distPath}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(command, { stdio: 'inherit' });
    
    console.log('Chrome Extension packaged successfully!');
    console.log(`Package location: ${zipPath}`);
    
    // Get file size
    const stats = fs.statSync(zipPath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    console.log(`Package size: ${fileSizeInKB} KB`);
    
  } catch (error) {
    console.error('Error packaging Chrome Extension:', error.message);
    process.exit(1);
  }
}

// Run the packaging
packageExtension();