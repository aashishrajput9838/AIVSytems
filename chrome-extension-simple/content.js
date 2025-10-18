// Simple ChatGPT Auto Saver for AIV System
let lastChatsHash = "";
let validationResults = [];

function captureChats() {
  let chats = [];
  // Capture all messages with author roles
  document.querySelectorAll("div[data-message-author-role]").forEach(el => {
    let role = el.getAttribute("data-message-author-role");
    let text = el.innerText.trim();
    if (role && text) {
      chats.push({ 
        role, 
        text,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  console.log("[AIV Simple] Captured chats:", chats);
  
  // Create a hash of the current chats to detect changes
  const currentChatsHash = JSON.stringify(chats);
  
  // Only process if chats have changed
  if (currentChatsHash !== lastChatsHash && chats.length > 0) {
    console.log("[AIV Simple] New chats detected:", chats);
    lastChatsHash = currentChatsHash;
    
    // Process conversation pairs
    processConversationPairs(chats);
  } else if (chats.length === 0) {
    console.log("[AIV Simple] No chats found on page");
  } else {
    console.log("[AIV Simple] Chats unchanged, no processing needed");
  }
}

// Process conversation pairs and validate responses
function processConversationPairs(chats) {
  // Group chats into question-response pairs
  const pairs = [];
  let currentQuestion = null;
  
  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];
    
    if (chat.role === "user") {
      currentQuestion = chat.text;
      console.log("[AIV Simple] Found user question:", currentQuestion);
    } else if (chat.role === "assistant" && currentQuestion) {
      const pair = {
        question: currentQuestion,
        response: chat.text,
        timestamp: chat.timestamp
      };
      pairs.push(pair);
      console.log("[AIV Simple] Paired question with response:", pair);
      currentQuestion = null; // Reset for next pair
    }
  }
  
  console.log("[AIV Simple] Final conversation pairs:", pairs);
  
  // Validate the latest response if we have pairs
  if (pairs.length > 0) {
    const latestPair = pairs[pairs.length - 1];
    console.log("[AIV Simple] Validating latest pair:", latestPair);
    validateResponse(latestPair);
  } else {
    console.log("[AIV Simple] No pairs to validate");
  }
}

// Validate response with AIV System
function validateResponse(pair) {
  console.log("[AIV Simple] Validating response:", pair.response);
  
  // Prepare validation request
  const validationRequest = {
    role: "assistant",
    content: pair.response,
    question: pair.question,
    timestamp: pair.timestamp,
    url: window.location.href,
    platform: detectPlatform()
  };
  
  console.log("[AIV Simple] Sending validation request:", validationRequest);
  
  // Send to AIV System for validation (using Firebase function endpoint)
  fetch("http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(validationRequest)
  })
  .then(response => {
    console.log("[AIV Simple] Validation response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    console.log("[AIV Simple] Validation result:", result);
    
    // Store validation result
    const validationResult = {
      pair: pair,
      validation: result.validation || result,
      timestamp: new Date().toISOString()
    };
    
    // Retrieve existing results and append new one
    chrome.storage.local.get(['aivValidationResults'], function(data) {
      let existingResults = data.aivValidationResults || [];
      existingResults.push(validationResult);
      
      // Keep only last 10 results
      if (existingResults.length > 10) {
        existingResults = existingResults.slice(-10);
      }
      
      // Store in chrome storage for popup access
      chrome.storage.local.set({aivValidationResults: existingResults}, function() {
        console.log("[AIV Simple] Validation results stored");
      });
    });
  })
  .catch(error => {
    console.error("[AIV Simple] Validation error:", error);
    
    // Store error result
    const errorResult = {
      pair: pair,
      validation: {
        isValid: Math.random() > 0.3, // Mock validation
        confidence: Math.random(),
        issues: ["Validation service unavailable: " + error.message],
        suggestions: ["Check network connection", "Ensure Firebase emulator is running"]
      },
      error: true,
      timestamp: new Date().toISOString()
    };
    
    // Retrieve existing results and append new one
    chrome.storage.local.get(['aivValidationResults'], function(data) {
      let existingResults = data.aivValidationResults || [];
      existingResults.push(errorResult);
      
      // Keep only last 10 results
      if (existingResults.length > 10) {
        existingResults = existingResults.slice(-10);
      }
      
      // Store in chrome storage for popup access
      chrome.storage.local.set({aivValidationResults: existingResults}, function() {
        console.log("[AIV Simple] Error results stored");
      });
    });
  });
}

// Detect which AI platform we're on
function detectPlatform() {
  const url = window.location.href;
  
  if (url.includes('groq.com')) return 'groq';
  if (url.includes('gemini.google.com')) return 'gemini';
  if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) return 'chatgpt';
  if (url.includes('claude.ai')) return 'claude';
  if (url.includes('copilot.microsoft.com')) return 'copilot';
  
  return 'unknown';
}

// Run every 5 seconds automatically
setInterval(captureChats, 5000);

console.log("[AIV Simple] AIV Chat Validator loaded and running");