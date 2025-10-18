@echo off
echo Starting AIV System API Server...
echo =================================

cd /d "c:\Users\aashi\OneDrive\Desktop\AIV System"

echo Installing dependencies (if needed)...
npm install

echo.
echo Starting development server on port 5178...
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause