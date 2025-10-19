@echo off
echo Testing Firebase Function...
echo ==========================

cd /d "c:\Users\aashi\OneDrive\Desktop\AIV System"

echo Running Firebase Function test...
node test-firebase-function.js

echo.
echo If you see "Firebase Function is working!" above, your Firebase emulator is running correctly.
echo If you see connection errors, please start the Firebase emulator first.
echo.

pause