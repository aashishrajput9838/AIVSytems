# AIV Chat Validator - Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Validation pending" message

This typically means the extension is capturing your conversation but having trouble sending it to the validation service.

## Debugging Steps

### 1. Check if the extension is capturing conversations

1. Open the AI platform (ChatGPT, Gemini, etc.)
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Look for logs with `[AIV Simple]` prefix
5. You should see:
   - `[AIV Simple] Captured chats: [...]`
   - `[AIV Simple] New chats detected: [...]`
   - `[AIV Simple] Paired question with response: [...]`

### 2. Check if validation requests are being sent

In the console, look for:
- `[AIV Simple] Sending validation request: [...]`
- `[AIV Simple] Validation response status: 200` (if successful)
- Any error messages

### 3. Common causes of "Validation pending"

#### Cause 1: Firebase emulator not running
- Make sure your Firebase emulator is running on port 5004
- Check if you can access `http://127.0.0.1:5004` in your browser

#### Cause 2: Network issues
- Check your internet connection
- Make sure there are no firewall restrictions

#### Cause 3: CORS issues
- The browser might be blocking requests due to CORS policy

#### Cause 4: Invalid endpoint
- Verify the endpoint URL is correct

### 4. How to verify the extension is working

1. **Check the console logs**:
   - Open Developer Tools (F12) on the AI platform page
   - Look for detailed logs showing chat capture and validation attempts

2. **Verify conversation capture**:
   - Ask a question and wait for the response
   - Check if you see logs like:
     - `[AIV Simple] Found user question: what is cat?`
     - `[AIV Simple] Paired question with response: {question: "what is cat?", response: "A cat is a small, domesticated animal..."}`

3. **Check validation attempts**:
   - Look for logs showing the validation request being sent
   - Check for any error messages

### 5. Manual testing

You can manually test if the validation endpoint is working:

1. Open a new browser tab
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this test code:

```javascript
fetch("http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    role: "assistant",
    content: "A cat is a small, domesticated animal known for being playful, curious, and independent.",
    question: "what is cat?",
    timestamp: new Date().toISOString(),
    url: "https://chat.openai.com",
    platform: "chatgpt"
  })
})
.then(response => response.json())
.then(result => console.log("Test result:", result))
.catch(error => console.error("Test error:", error));
```

5. Check if you get a response or an error

### 6. Solutions

#### Solution 1: Start Firebase emulator
If the test fails with a connection error:
1. Make sure you're in your Firebase project directory
2. Run: `firebase emulators:start`
3. Check that it starts on port 5004

#### Solution 2: Update the endpoint
If you've deployed your Firebase functions, update the endpoint in `content.js`:
```javascript
// Change this line to your deployed function URL
fetch("https://your-deployed-url.cloudfunctions.net/validateAIResponse", {
  // ... rest of the code
});
```

#### Solution 3: Check browser console for specific errors
Look for specific error messages in the console that might indicate:
- Network errors (check connection)
- CORS errors (server configuration issue)
- 404 errors (incorrect endpoint)
- 500 errors (server-side issues)

### 7. If nothing works

1. Reload the extension in `chrome://extensions/`
2. Refresh the AI platform page
3. Try asking a new question
4. Check the updated console logs for more detailed information

## Need Help?

If you're still having issues:

1. Take a screenshot of the console logs showing the `[AIV Simple]` messages
2. Note what you see in the popup (validation pending, etc.)
3. Describe what you expected to see vs what you're actually seeing
4. Include information about your setup (Firebase emulator running, etc.)