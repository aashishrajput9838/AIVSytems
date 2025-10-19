@echo off
echo Testing AIV System API...
echo =======================

cd /d "c:\Users\aashi\OneDrive\Desktop\AIV System\chrome-extension"

echo Running API test...
node test-api.js

echo.
echo If you see "API is working!" above, your API is running correctly.
echo If you see connection errors, please start the API server first.
echo.

pause