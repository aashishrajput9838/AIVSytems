@echo off
echo Starting Firebase Emulator for AIV System...
echo ==========================================

cd /d "c:\Users\aashi\OneDrive\Desktop\AIV System"

echo Installing Firebase CLI (if not already installed)...
npm install -g firebase-tools

echo.
echo Logging into Firebase (you may need to authenticate)...
firebase login

echo.
echo Installing functions dependencies...
cd functions
npm install
cd ..

echo.
echo Starting Firebase Emulator...
echo Press Ctrl+C to stop the emulator
echo.

firebase emulators:start --only functions

pause