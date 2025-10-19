@echo off
echo Opening test completeness check in default browser...
start "" "chrome-extension\test-completeness-check.html"
timeout /t 2 >nul