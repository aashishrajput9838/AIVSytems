// Simple local validator - no external API calls
let lastChatsHash = "";
let processedPairs = new Set();

// Improved content extraction to avoid capturing UI elements and get full content
function captureChats() {
  let chats = [];
  
  // More comprehensive selectors to capture all message types
  const selectors = [
    // Primary selectors for different platforms
    "div[data-message-author-role]",
    "div[role='presentation']",
    ".text-base",
    ".markdown",
    ".prose",
    ".message",
    ".chat-message"
  ];
  
  // Try each selector set
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach(el => {
        // Get role information
        let role = el.getAttribute("data-message-author-role");
        
        // Fallback role detection
        if (!role) {
          // Check common class names for role detection
          if (el.classList.contains("user") || el.classList.contains("human") || 
              el.getAttribute("data-author") === "user") {
            role = "user";
          } else if (el.classList.contains("assistant") || el.classList.contains("bot") ||
                     el.getAttribute("data-author") === "assistant") {
            role = "assistant";
          }
        }
        
        // Extract text content more thoroughly
        let text = extractTextContent(el);
        
        if (role && text && text.length > 0) {
          // Additional filtering to avoid capturing UI text
          const filteredText = filterUIText(text);
          
          if (filteredText.length > 0 && !isUIElement(filteredText)) {
            chats.push({ 
              role, 
              text: filteredText,
              timestamp: new Date().toISOString()
            });
          }
        }
      });
      
      // If we found valid chats, break the loop
      if (chats.length > 0) {
        break;
      }
    }
  }
  
  // Create a hash of the current chats to detect changes
  const currentChatsHash = JSON.stringify(chats);
  
  // Only process if chats have changed
  if (currentChatsHash !== lastChatsHash && chats.length > 0) {
    console.log("[AIV Local] New chats detected:", chats);
    lastChatsHash = currentChatsHash;
    
    // Process conversation pairs
    processConversationPairs(chats);
  }
}

// Enhanced text extraction function
function extractTextContent(element) {
  // Method 1: Look for paragraph tags first (most reliable)
  const paragraphs = element.querySelectorAll("p");
  if (paragraphs.length > 0) {
    return Array.from(paragraphs).map(p => p.textContent.trim()).join("\n\n");
  }
  
  // Method 2: Look for preformatted text (code blocks)
  const preElements = element.querySelectorAll("pre");
  if (preElements.length > 0) {
    return Array.from(preElements).map(pre => pre.textContent.trim()).join("\n\n");
  }
  
  // Method 3: Look for divs with text content
  const textDivs = element.querySelectorAll("div");
  if (textDivs.length > 0) {
    const textContents = Array.from(textDivs)
      .map(div => div.textContent.trim())
      .filter(text => text.length > 0);
    if (textContents.length > 0) {
      return textContents.join("\n\n");
    }
  }
  
  // Method 4: Direct text content with better cleaning
  let text = element.textContent || element.innerText || "";
  return text.trim();
}

// Filter out UI elements and clean text
function filterUIText(text) {
  // Remove excessive whitespace
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  
  // Remove common UI artifacts
  const uiPatterns = [
    /\b(Use voice mode|Stop generating|Regenerate response|Like|Dislike|Copy)\b/gi,
    /\d+\s*(like|dislike)/gi,
    /\b(send|clear|submit)\b/gi
  ];
  
  uiPatterns.forEach(pattern => {
    text = text.replace(pattern, "");
  });
  
  return text.trim();
}

// Check if text is likely a UI element
function isUIElement(text) {
  const uiIndicators = [
    "Use voice mode",
    "Stop generating",
    "Regenerate response",
    "Like",
    "Dislike",
    "Copy",
    "send",
    "clear",
    "submit"
  ];
  
  return uiIndicators.some(indicator => 
    text.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Process conversation pairs and validate responses locally
function processConversationPairs(chats) {
  // Group chats into question-response pairs
  const pairs = [];
  let currentQuestion = null;
  
  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];
    
    if (chat.role === "user") {
      currentQuestion = chat.text;
    } else if (chat.role === "assistant" && currentQuestion) {
      const pair = {
        question: currentQuestion,
        response: chat.text,
        timestamp: chat.timestamp,
        id: generatePairId(currentQuestion, chat.text)
      };
      
      // Only process if we haven't processed this pair before
      if (!processedPairs.has(pair.id)) {
        pairs.push(pair);
        processedPairs.add(pair.id);
        console.log("[AIV Local] Paired question with response:", pair);
        
        // Validate this pair immediately
        validateResponseLocally(pair);
      }
      
      currentQuestion = null; // Reset for next pair
    }
  }
}

// Generate a unique ID for a conversation pair
function generatePairId(question, response) {
  return btoa(encodeURIComponent(question.substring(0, 50) + "|" + response.substring(0, 50)));
}

// Implement all 7 validators from AIV System
function validateResponseLocally(pair) {
  console.log("[AIV Local] Validating response locally:", pair.response);
  
  // Initialize validation result with all 7 validators
  const validation = {
    isValid: true,
    confidence: 0.0,
    issues: [],
    suggestions: [],
    validators: []
  };
  
  // Validator weights (same as in AIV System)
  const weights = {
    error_keywords: 0.2,
    response_length: 0.1,
    sensitive_keywords: 0.1,
    professional_claims: 0.15,
    personal_relationship_validation: 0.2,
    personal_characteristic_validation: 0.15,
    factual_accuracy: 0.45,
  };
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Validator 1: Error keywords check
  const errorKeywords = ["error", "fail", "cannot", "unable", "sorry"];
  const hasErrorKeywords = errorKeywords.some(keyword => 
    pair.response.toLowerCase().includes(keyword)
  );
  
  const errorValidator = {
    name: "error_keywords",
    pass: !hasErrorKeywords,
    score: hasErrorKeywords ? 0.1 : 0.85,
    details: hasErrorKeywords ? "Contains error-related keywords" : "No error keywords detected",
    severity: hasErrorKeywords ? "critical" : "info"
  };
  
  validation.validators.push(errorValidator);
  if (hasErrorKeywords) {
    validation.isValid = false;
    validation.issues.push("Contains error-related keywords");
  }
  
  totalWeight += weights.error_keywords;
  weightedSum += errorValidator.score * weights.error_keywords;
  
  // Validator 2: Response length check
  const lengthValidator = {
    name: "response_length",
    pass: pair.response.length >= 10,
    score: pair.response.length >= 10 ? 0.92 : 0.3,
    details: pair.response.length >= 10 ? 
      `Response length: ${pair.response.length} chars` : 
      `Response length: ${pair.response.length} chars (min: 10)`,
    severity: pair.response.length >= 10 ? "info" : "warn"
  };
  
  validation.validators.push(lengthValidator);
  if (!lengthValidator.pass) {
    validation.isValid = false;
    validation.issues.push("Response is too short");
    validation.suggestions.push("Provide a more detailed response");
  }
  
  totalWeight += weights.response_length;
  weightedSum += lengthValidator.score * weights.response_length;
  
  // Validator 3: Sensitive keywords check
  const sensitiveKeywords = ["password", "credit card", "ssn", "personal"];
  const hasSensitiveKeywords = sensitiveKeywords.some(keyword => 
    pair.question.toLowerCase().includes(keyword)
  );
  
  const sensitiveValidator = {
    name: "sensitive_keywords",
    pass: !hasSensitiveKeywords,
    score: hasSensitiveKeywords ? 0.5 : 0.9,
    details: hasSensitiveKeywords ? "Contains sensitive keywords" : "No sensitive keywords detected",
    severity: hasSensitiveKeywords ? "warn" : "info"
  };
  
  validation.validators.push(sensitiveValidator);
  if (hasSensitiveKeywords) {
    validation.issues.push("Contains sensitive keywords in question");
  }
  
  totalWeight += weights.sensitive_keywords;
  weightedSum += sensitiveValidator.score * weights.sensitive_keywords;
  
  // Validator 4: Professional claims check
  const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister", "university", "college", "school", "hospital", "company", "corporation"];
  const hasProfessionalClaims = professionalKeywords.some(keyword => 
    pair.response.toLowerCase().includes(keyword)
  );
  
  const professionalValidator = {
    name: "professional_claims",
    pass: true, // We don't fail on professional claims, just flag them
    score: hasProfessionalClaims ? 0.82 : 0.9,
    details: hasProfessionalClaims ? "Professional claims detected" : "No professional claims detected",
    severity: hasProfessionalClaims ? "info" : "info"
  };
  
  validation.validators.push(professionalValidator);
  if (hasProfessionalClaims) {
    validation.issues.push("Contains professional claims");
  }
  
  totalWeight += weights.professional_claims;
  weightedSum += professionalValidator.score * weights.professional_claims;
  
  // Validator 5: Personal relationship check
  const isPersonalRelationship = /friend|sister|brother|cousin|roommate|colleague|neighbor|classmate/i.test(pair.question);
  const isPersonalValidation = /is this|ye|is it|kya ye.*(right|correct|true|sahi|theek)/i.test(pair.question);
  
  const personalRelationshipValidator = {
    name: "personal_relationship_validation",
    pass: !(isPersonalRelationship && isPersonalValidation),
    score: (isPersonalRelationship && isPersonalValidation) ? 0.3 : (isPersonalRelationship ? 0.7 : 0.9),
    details: (isPersonalRelationship && isPersonalValidation) ? 
      "Personal relationship validation requires manual verification" : 
      (isPersonalRelationship ? "Personal relationship question detected" : "No personal validation detected"),
    severity: (isPersonalRelationship && isPersonalValidation) ? "critical" : (isPersonalRelationship ? "info" : "info")
  };
  
  validation.validators.push(personalRelationshipValidator);
  if (isPersonalRelationship && isPersonalValidation) {
    validation.isValid = false;
    validation.issues.push("Personal relationship validation cannot be auto-verified");
  }
  
  totalWeight += weights.personal_relationship_validation;
  weightedSum += personalRelationshipValidator.score * weights.personal_relationship_validation;
  
  // Validator 6: Personal characteristic check
  const isPersonalCharacteristic = /meri|my.*characteristic|personal characteristic/i.test(pair.question);
  const personalCharacteristicValidator = {
    name: "personal_characteristic_validation",
    pass: !(isPersonalCharacteristic && isPersonalValidation),
    score: (isPersonalCharacteristic && isPersonalValidation) ? 0.3 : (isPersonalCharacteristic ? 0.7 : 0.9),
    details: (isPersonalCharacteristic && isPersonalValidation) ? 
      "Personal characteristic validation requires manual verification" : 
      (isPersonalCharacteristic ? "Personal characteristic question detected" : "No personal characteristic validation detected"),
    severity: (isPersonalCharacteristic && isPersonalValidation) ? "warn" : (isPersonalCharacteristic ? "info" : "info")
  };
  
  validation.validators.push(personalCharacteristicValidator);
  if (isPersonalCharacteristic && isPersonalValidation) {
    validation.isValid = false;
    validation.issues.push("Personal characteristic validation cannot be auto-verified");
  }
  
  totalWeight += weights.personal_characteristic_validation;
  weightedSum += personalCharacteristicValidator.score * weights.personal_characteristic_validation;
  
  // Validator 7: Factual accuracy check (simplified version)
  // For local validation, we'll use a heuristic approach
  const factualScore = calculateLocalFactualAccuracy(pair.question, pair.response);
  const factualValidator = {
    name: "factual_accuracy",
    pass: factualScore >= 0.7,
    score: factualScore,
    details: factualScore >= 0.7 ? "Factually accurate" : "Factual accuracy concerns",
    severity: factualScore < 0.3 ? "critical" : factualScore < 0.7 ? "warn" : "info"
  };
  
  validation.validators.push(factualValidator);
  if (factualScore < 0.7) {
    validation.issues.push("Factual accuracy concerns");
  }
  
  totalWeight += weights.factual_accuracy;
  weightedSum += factualValidator.score * weights.factual_accuracy;
  
  // Calculate final confidence score
  validation.confidence = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Store conversation pair with validation result locally
  const conversationPair = {
    id: pair.id,
    question: pair.question,
    response: pair.response,
    timestamp: pair.timestamp,
    validation: validation
  };
  
  // Retrieve existing pairs and append new one
  chrome.storage.local.get(['aivLocalConversationPairs'], function(data) {
    let existingPairs = data.aivLocalConversationPairs || [];
    
    // Check if this pair already exists
    const existingIndex = existingPairs.findIndex(p => p.id === pair.id);
    if (existingIndex >= 0) {
      // Update existing pair
      existingPairs[existingIndex] = conversationPair;
    } else {
      // Add new pair
      existingPairs.push(conversationPair);
    }
    
    // Keep only last 10 pairs
    if (existingPairs.length > 10) {
      existingPairs = existingPairs.slice(-10);
    }
    
    // Store in chrome storage for popup access
    chrome.storage.local.set({aivLocalConversationPairs: existingPairs}, function() {
      console.log("[AIV Local] Conversation pair with validation stored locally:", conversationPair);
    });
  });
}

// Simplified factual accuracy calculation for local validation
function calculateLocalFactualAccuracy(question, response) {
  // Basic heuristic: check if response contains relevant keywords from question
  const questionWords = question.toLowerCase().split(/\s+/);
  const responseWords = response.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matchingWords = 0;
  questionWords.forEach(word => {
    if (responseWords.includes(word)) {
      matchingWords++;
    }
  });
  
  // Calculate similarity (0-1)
  const similarity = questionWords.length > 0 ? matchingWords / questionWords.length : 0;
  
  // Convert to score (0.1-0.9)
  return 0.1 + (similarity * 0.8);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getConversationPairs") {
    chrome.storage.local.get(['aivLocalConversationPairs'], function(data) {
      sendResponse({
        success: true,
        pairs: data.aivLocalConversationPairs || []
      });
    });
    return true; // Keep message channel open for async response
  }
});

// Run every 3 seconds automatically
setInterval(captureChats, 3000);

console.log("[AIV Local] AIV Local Validator loaded and running");