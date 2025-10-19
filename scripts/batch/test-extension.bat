@echo off
echo Testing AIV Systems Chrome Extension
echo ====================================

echo 1. Make sure the Firebase emulator is running (keep that terminal window open)
echo 2. Go to chrome://extensions in Chrome
echo 3. Find "AIV Systems Validator" and click the reload button
echo 4. Click the AIV Systems icon in your Chrome toolbar
echo 5. Toggle "Enable Validation" to ON
echo 6. Visit an AI chat platform (like ChatGPT)
echo 7. Ask a question and get a response
echo 8. Check the extension popup for validation results

echo.
echo If you see validation results in the popup, the extension is working correctly!
echo If you see error messages, check that:
echo - The Firebase emulator is still running
echo - The extension was reloaded after our changes
echo - You're on a supported AI platform

pause