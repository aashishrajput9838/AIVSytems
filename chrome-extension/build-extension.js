const fs = require('fs');
const path = require('path');

// Function to copy files recursively
function copyFolderRecursiveSync(source, target) {
  console.log(`Copying from ${source} to ${target}`);
  
  // Check if source exists
  if (!fs.existsSync(source)) {
    console.log(`Source does not exist: ${source}`);
    return;
  }
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    console.log(`Created directory: ${target}`);
  }

  // Copy files
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    console.log(`Found ${files.length} items in ${source}`);
    files.forEach(function(file) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      console.log(`Processing ${sourcePath} -> ${targetPath}`);
      
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyFolderRecursiveSync(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied file: ${file}`);
      }
    });
  }
}

// Function to copy a single file
function copyFile(source, target) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.log(`Copied file: ${path.basename(source)} to ${target}`);
  } else {
    console.log(`Source file does not exist: ${source}`);
  }
}

// Function to copy specific files
function copyFiles() {
  console.log('Building Chrome Extension...');
  
  // Copy core files (except manifest.json)
  console.log('Copying core files...');
  copyFolderRecursiveSync(
    path.join(__dirname, 'src', 'core'),
    path.join(__dirname, 'dist', 'core')
  );
  
  // Copy components
  console.log('Copying components...');
  copyFolderRecursiveSync(
    path.join(__dirname, 'src', 'components'),
    path.join(__dirname, 'dist', 'components')
  );
  
  // Copy content scripts to root of dist (required by manifest)
  console.log('Copying content scripts to dist root...');
  copyFile(
    path.join(__dirname, 'src', 'content', 'content.js'),
    path.join(__dirname, 'dist', 'content.js')
  );
  
  // Copy lib files
  console.log('Copying lib files...');
  copyFolderRecursiveSync(
    path.join(__dirname, 'src', 'lib'),
    path.join(__dirname, 'dist', 'lib')
  );
  
  // Copy utils
  console.log('Copying utils...');
  copyFolderRecursiveSync(
    path.join(__dirname, 'src', 'utils'),
    path.join(__dirname, 'dist', 'utils')
  );
  
  // Copy docs
  const docsPath = path.join(__dirname, 'src', 'docs');
  if (fs.existsSync(docsPath)) {
    console.log('Copying docs...');
    copyFolderRecursiveSync(
      docsPath,
      path.join(__dirname, 'dist', 'docs')
    );
  } else {
    console.log('No docs directory found');
  }
  
  // Copy manifest.json to dist root (required by Chrome)
  console.log('Copying manifest.json to dist root...');
  copyFile(
    path.join(__dirname, 'src', 'core', 'manifest.json'),
    path.join(__dirname, 'dist', 'manifest.json')
  );
  
  console.log('Chrome Extension build completed successfully!');
}

// Run the build
copyFiles();