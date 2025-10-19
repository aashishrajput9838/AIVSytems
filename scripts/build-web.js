import fs from 'fs';
import path from 'path';

// Function to copy files recursively
function copyFolderRecursiveSync(source, target) {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Copy files
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function(file) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyFolderRecursiveSync(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
  }
}

// Function to build the web application
function buildWebApp() {
  console.log('Building Web Application...');
  
  // Copy main source files
  const srcDir = path.join(process.cwd(), 'src');
  const distDir = path.join(process.cwd(), 'dist');
  
  // Create dist directory structure
  const distSrcDir = path.join(distDir, 'src');
  if (!fs.existsSync(distSrcDir)) {
    fs.mkdirSync(distSrcDir, { recursive: true });
  }
  
  // Copy app directory
  copyFolderRecursiveSync(
    path.join(srcDir, 'app'),
    path.join(distSrcDir, 'app')
  );
  
  // Copy features directory
  copyFolderRecursiveSync(
    path.join(srcDir, 'features'),
    path.join(distSrcDir, 'features')
  );
  
  // Copy shared directory
  copyFolderRecursiveSync(
    path.join(srcDir, 'shared'),
    path.join(distSrcDir, 'shared')
  );
  
  // Copy other important directories
  ['hooks', 'pages', 'services', 'styles', 'types', 'assets'].forEach(dir => {
    if (fs.existsSync(path.join(srcDir, dir))) {
      copyFolderRecursiveSync(
        path.join(srcDir, dir),
        path.join(distSrcDir, dir)
      );
    }
  });
  
  // Copy root files
  ['App.css', 'index.css'].forEach(file => {
    if (fs.existsSync(path.join(srcDir, file))) {
      fs.copyFileSync(
        path.join(srcDir, file),
        path.join(distSrcDir, file)
      );
    }
  });
  
  console.log('Web Application build completed successfully!');
}

// Run the build
buildWebApp();