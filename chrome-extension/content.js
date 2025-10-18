// content.js - Only initialize if not already loaded
if (typeof window.aivContentScriptLoaded === 'undefined') {
  window.aivContentScriptLoaded = true;
  
  // State management
  let isValidationEnabled = false;
  let observer = null;
  let lastProcessedMessages = new Map(); // Track already processed messages
  let conversationPairs = []; // Store question-response pairs
  let lastProcessedPairKey = null; // Track the last processed pair to prevent duplicates
  let lastProcessingTime = 0; // Track the last processing time to prevent rapid processing

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[AIV Debug] Received message:', request);
    if (request.action === 'toggleValidation') {
      isValidationEnabled = request.enabled;
      
      if (isValidationEnabled) {
        startObserving();
        console.log('[AIV Debug] AIV Validation enabled');
      } else {
        stopObserving();
        console.log('[AIV Debug] AIV Validation disabled');
      }
      
      sendResponse({ success: true });
    } else if (request.action === 'triggerValidation') {
      // Trigger validation of the latest message
      triggerManualValidation()
        .then(result => {
          sendResponse({ success: true, result: result });
        })
        .catch(error => {
          console.error('[AIV Debug] Error in triggerManualValidation:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for async responses
    } else if (request.action === 'getConversationPairs') {
      // Send the conversation pairs to the popup
      console.log('[AIV Debug] Sending conversation pairs to popup:', conversationPairs);
      sendResponse({ success: true, pairs: conversationPairs });
      return true;
    }
    return true; // Keep the message channel open for async responses
  });

  // Start observing DOM changes
  function startObserving() {
    // Disconnect existing observer if any
    if (observer) {
      observer.disconnect();
    }
    
    // Clear processed messages cache
    lastProcessedMessages.clear();
    conversationPairs = [];
    lastProcessedPairKey = null;
    
    // Create a new observer
    observer = new MutationObserver(handleDOMChanges);
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true, // Watch for text changes
      attributes: false // We don't need to watch attributes
    });
    
    // Also check for existing content
    captureExistingContent();
    
    // Set up periodic checking for completeness
    clearInterval(window.aivPeriodicCheckInterval);
    window.aivPeriodicCheckInterval = setInterval(() => {
      if (isValidationEnabled) {
        captureExistingContent();
        
        // Also check if any existing conversation pairs have incomplete responses
        checkForIncompleteResponses();
      }
    }, 200); // Check every 200ms for more responsive updates
  }

  // Check if any existing conversation pairs have incomplete responses and update them
  function checkForIncompleteResponses() {
    for (let i = 0; i < conversationPairs.length; i++) {
      const pair = conversationPairs[i];
      if (pair.response && !isCompleteResponse(pair.response, null)) {
        console.log('[AIV Debug] Found incomplete response in pair', i, ':', pair.response);
        
        // Try to find a more complete version of this response
        const moreCompleteResponse = findMoreCompleteResponse(pair.response);
        if (moreCompleteResponse && moreCompleteResponse !== pair.response) {
          console.log('[AIV Debug] Found more complete response for pair', i, ':', moreCompleteResponse.substring(0, 50) + '...');
          pair.response = moreCompleteResponse;
        } else {
          // If we can't find a more complete version, check if we should remove this pair
          // (it might be a temporary or invalid response)
          const trimmedResponse = pair.response.trim();
          if (trimmedResponse.length < 10) {
            console.log('[AIV Debug] Removing very short incomplete response from pair', i);
            // Remove this pair if it has a very short incomplete response
            conversationPairs.splice(i, 1);
            i--; // Adjust index since we removed an element
          }
        }
      }
    }
  }

  // Try to find a more complete version of a response by searching the DOM
  function findMoreCompleteResponse(partialResponse) {
    // Look for elements that contain the partial response and might have more content
    const allMessages = document.querySelectorAll('[data-message-author-role="assistant"] p, .text-token-text-primary p, [data-message-author-role="assistant"] div.markdown, [data-message-author-role="assistant"] div');
    
    for (const message of allMessages) {
      const text = message.textContent || '';
      // Check if this text starts with our partial response and is longer
      if (text.startsWith(partialResponse) && text.length > partialResponse.length) {
        // Check if this is a complete response
        if (isCompleteResponse(text, message)) {
          // Found a complete version that starts with our partial response
          return text;
        }
      }
      
      // Also check if this is a more complete version that might not start exactly the same
      // (e.g., if the partial response was truncated in a weird way)
      if (text.length > partialResponse.length && 
          partialResponse.length > 10 && 
          text.includes(partialResponse.substring(0, Math.min(20, partialResponse.length)))) {
        // Check if this is a complete response
        if (isCompleteResponse(text, message)) {
          // Found a complete version that contains our partial response
          return text;
        }
      }
    }
    
    return null;
  }

  // Stop observing DOM changes
  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    // Clear processed messages cache
    lastProcessedMessages.clear();
    conversationPairs = [];
    lastProcessedPairKey = null;
    
    // Clear periodic check
    clearInterval(window.aivPeriodicCheckInterval);
    clearTimeout(window.aivProcessingTimeout);
  }

  // Handle DOM changes
  function handleDOMChanges(mutations) {
    // Only process if validation is enabled
    if (!isValidationEnabled) return;
    
    // Check if any mutations are relevant to chat content
    let shouldProcess = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // New elements added
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkForNewMessages(node);
          }
        });
        shouldProcess = true;
      } else if (mutation.type === 'characterData') {
        // Text content changed
        if (mutation.target.parentElement) {
          checkForNewMessages(mutation.target.parentElement);
        }
        shouldProcess = true;
      }
    }
    
    // Process existing content more frequently to catch streaming responses
    if (shouldProcess) {
      // Reduce delay to catch streaming responses
      clearTimeout(window.aivProcessingTimeout);
      window.aivProcessingTimeout = setTimeout(() => {
        captureExistingContent();
      }, 100); // Check every 100ms instead of immediately
    }
  }

  // Capture existing content when the extension is first enabled
  function captureExistingContent() {
    // Only process if validation is enabled
    if (!isValidationEnabled) return;
    
    console.log('[AIV Debug] Capturing existing content');
    // This would depend on the specific chat platform
    // For now, we'll just check for common message patterns
    checkForNewMessages(document.body);
  }

  // Check for new messages in a node
  function checkForNewMessages(node) {
    // Only process if validation is enabled
    if (!isValidationEnabled) return;
    
    // Focus on paragraph tags within message containers for more accurate content extraction
    // More specific selectors for ChatGPT
    const messageSelectors = [
      '[data-message-author-role="assistant"] .text-token-text-primary p', // ChatGPT assistant paragraphs
      '[data-message-author-role="user"] .text-token-text-primary p', // ChatGPT user paragraphs
      '[data-message-author-role="assistant"] p:not([class])', // Assistant paragraphs without specific classes
      '[data-message-author-role="user"] p:not([class])', // User paragraphs without specific classes
      '.agent-turn .text-token-text-primary p', // Agent paragraphs
      '.user-turn .text-token-text-primary p' // User paragraphs
    ];
    
    // Check if this node or its children match any message selectors
    messageSelectors.forEach(selector => {
      // Check if the node itself matches
      if (node.matches && node.matches(selector)) {
        processMessage(node);
      }
      
      // Check if the node has children that match
      if (node.querySelectorAll) {
        const messages = node.querySelectorAll(selector);
        messages.forEach(message => {
          processMessage(message);
        });
      }
    });
    
    // Also check for message containers themselves as a fallback, but be more selective
    const containerSelectors = [
      '[data-message-author-role="assistant"] .text-token-text-primary',
      '[data-message-author-role="user"] .text-token-text-primary',
      '.agent-turn .text-token-text-primary',
      '.user-turn .text-token-text-primary'
    ];
    
    containerSelectors.forEach(selector => {
      if (node.matches && node.matches(selector)) {
        processMessage(node);
      }
      
      if (node.querySelectorAll) {
        const containers = node.querySelectorAll(selector);
        containers.forEach(container => {
          processMessage(container);
        });
      }
    });
  }

  // Process a message element
  function processMessage(messageElement) {
    console.log('[AIV Debug] processMessage called with element:', messageElement);
    console.log('[AIV Debug] Element tag name:', messageElement.tagName);
    console.log('[AIV Debug] Element class list:', messageElement.classList);
    
    // Only process if validation is enabled
    if (!isValidationEnabled) {
      console.log('[AIV Debug] Validation not enabled, skipping message processing');
      return;
    }
    
    // Add a small delay to prevent rapid processing of the same content
    const now = Date.now();
    if (now - lastProcessingTime < 100) { // Reduced to 100ms to catch streaming responses
      console.log('[AIV Debug] Too soon since last processing, skipping');
      return;
    }
    
    // Extract message data (this would be platform-specific)
    const messageData = extractMessageData(messageElement);
    
    console.log('[AIV Debug] Extracted message data:', messageData);
    
    if (messageData && (messageData.role === 'user' || messageData.role === 'assistant')) {
      console.log(`[AIV Debug] Processing ${messageData.role} message:`, messageData.content.substring(0, 50) + '...');
      
      // For assistant messages, check if the response is complete before processing
      if (messageData.role === 'assistant') {
        // If response is not complete, skip for now
        if (!isCompleteResponse(messageData.content, messageElement)) {
          console.log('[AIV Debug] Assistant response appears incomplete, skipping for now');
          return;
        }
        
        // If we have an existing incomplete response for the last pair, update it
        if (conversationPairs.length > 0) {
          const lastPair = conversationPairs[conversationPairs.length - 1];
          if (lastPair && !lastPair.response && messageData.content) {
            // This might be the complete version of a previously incomplete response
            console.log('[AIV Debug] Found complete response for last pair');
            lastPair.response = messageData.content;
            return;
          }
          
          // Check if this is a more complete version of the last response
          if (lastPair && lastPair.response && 
              messageData.content.startsWith(lastPair.response) && 
              messageData.content.length > lastPair.response.length) {
            console.log('[AIV Debug] Updating last pair with more complete response');
            lastPair.response = messageData.content;
            return;
          }
        }
      }
      
      // Create a unique identifier for this message
      const messageKey = `${messageData.role}-${messageData.content.substring(0, 50)}-${messageData.timestamp}`;
      
      // Check if we've already processed this exact message
      if (lastProcessedMessages.has(messageKey)) {
        console.log('[AIV Debug] Message already processed, skipping');
        return;
      }
      
      // Mark this message as processed
      lastProcessedMessages.set(messageKey, Date.now());
      lastProcessingTime = now;
      
      // Clean up old entries (older than 5 minutes)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      for (const [key, timestamp] of lastProcessedMessages.entries()) {
        if (timestamp < fiveMinutesAgo) {
          lastProcessedMessages.delete(key);
        }
      }
      
      console.log(`[AIV Debug] Processing message: ${messageData.role} - ${messageData.content.substring(0, 50)}...`);
      
      // Add to conversation pairs
      addToConversationPairs(messageData);
    } else {
      console.log('[AIV Debug] Skipping message - invalid data or unsupported role');
      if (!messageData) {
        console.log('[AIV Debug] Reason: No message data extracted');
      } else if (messageData.role !== 'user' && messageData.role !== 'assistant') {
        console.log('[AIV Debug] Reason: Unsupported role:', messageData.role);
      }
    }
  }

  // Add message to conversation pairs
  function addToConversationPairs(messageData) {
    console.log('[AIV Debug] addToConversationPairs called with:', messageData);
    
    // For ChatGPT, we want to pair user questions with assistant responses
    if (messageData.role === 'user') {
      console.log('[AIV Debug] Processing user message');
      
      // Create a more robust unique key for this question
      const questionKey = `${messageData.content.substring(0, 100)}-${messageData.timestamp.substring(0, 19)}`;
      
      // Check if this is a duplicate question by comparing with existing pairs
      const isDuplicate = conversationPairs.some(pair => 
        pair.question === messageData.content
      );
      
      if (isDuplicate) {
        console.log('[AIV Debug] Skipping duplicate question');
        return;
      }
      
      // Also check if this exact question was just processed
      if (lastProcessedPairKey === questionKey) {
        console.log('[AIV Debug] Skipping recently processed question');
        return;
      }
      
      // Add user message as a question
      const newPair = {
        question: messageData.content,
        response: '', // Will be filled when we get the response
        timestamp: messageData.timestamp,
        url: messageData.url,
        platform: messageData.platform
      };
      
      conversationPairs.push(newPair);
      lastProcessedPairKey = questionKey;
      console.log('[AIV Debug] Added new question pair:', newPair);
    } else if (messageData.role === 'assistant' && conversationPairs.length > 0) {
      console.log('[AIV Debug] Processing assistant message');
      
      // Add assistant message as a response to the last question
      const lastPair = conversationPairs[conversationPairs.length - 1];
      console.log('[AIV Debug] Last pair:', lastPair);
      console.log('[AIV Debug] New response:', messageData.content);
      
      // CRITICAL FIX: Prevent the same content from being used as both question and response
      if (lastPair.question === messageData.content) {
        console.log('[AIV Debug] ERROR: Same content detected for question and response, skipping');
        return;
      }
      
      // Check conditions for triggering validation
      console.log('[AIV Debug] Condition check - lastPair.response:', lastPair.response);
      console.log('[AIV Debug] Condition check - messageData.content:', messageData.content);
      console.log('[AIV Debug] Condition check - isValidationEnabled:', isValidationEnabled);
      
      // Additional check to ensure we have meaningful content
      const isMeaningful = isMeaningfulResponse(messageData.content);
      console.log('[AIV Debug] isMeaningfulResponse result:', isMeaningful);
      
      if (!lastPair.response && messageData.content && isMeaningful) {
        console.log('[AIV Debug] Adding response to last pair');
        lastPair.response = messageData.content;
        
        // Trigger validation for this completed pair
        if (isValidationEnabled) {
          console.log('[AIV Debug] Triggering validation for completed pair');
          triggerValidationForPair(lastPair);
        } else {
          console.log('[AIV Debug] Validation not enabled, skipping validation trigger');
        }
      } else {
        console.log('[AIV Debug] Skipping response addition - conditions not met');
        if (lastPair.response) {
          console.log('[AIV Debug] Reason: Last pair already has a response');
        }
        if (!messageData.content) {
          console.log('[AIV Debug] Reason: New message has no content');
        }
        if (!isMeaningful) {
          console.log('[AIV Debug] Reason: Content is not a meaningful response:', messageData.content);
        }
      }
      
      // If the last pair now has both question and response, check if it's a duplicate
      if (lastPair.question && lastPair.response) {
        const isDuplicate = conversationPairs.slice(0, -1).some(pair => 
          pair.question === lastPair.question && pair.response === lastPair.response
        );
        
        if (isDuplicate) {
          // Remove the duplicate pair
          conversationPairs.pop();
          console.log('[AIV Debug] Removed duplicate conversation pair');
        }
      }
    } else {
      console.log('[AIV Debug] Skipping message - not assistant or no conversation pairs');
      if (messageData.role !== 'assistant') {
        console.log('[AIV Debug] Reason: Not an assistant message');
      }
      if (conversationPairs.length === 0) {
        console.log('[AIV Debug] Reason: No conversation pairs exist');
        
        // If it's an assistant message but we don't have a question yet, try to find the actual question
        const isMeaningful = isMeaningfulResponse(messageData.content);
        console.log('[AIV Debug] Standalone isMeaningfulResponse result:', isMeaningful);
        
        if (messageData.role === 'assistant' && messageData.content && isMeaningful) {
          console.log('[AIV Debug] Looking for actual user question before creating standalone pair');
          
          // Try to find the actual user question by looking at the DOM
          const userQuestion = findLatestUserQuestion();
          if (userQuestion) {
            console.log('[AIV Debug] Found actual user question:', userQuestion);
            
            // Create a proper pair with the actual question
            const newPair = {
              question: userQuestion,
              response: messageData.content,
              timestamp: messageData.timestamp,
              url: messageData.url,
              platform: messageData.platform
            };
            
            conversationPairs.push(newPair);
            console.log('[AIV Debug] Added proper question-response pair:', newPair);
          } else {
            console.log('[AIV Debug] Could not find user question, creating standalone pair');
            const newPair = {
              question: 'Previous context',
              response: messageData.content,
              timestamp: messageData.timestamp,
              url: messageData.url,
              platform: messageData.platform
            };
            
            conversationPairs.push(newPair);
            console.log('[AIV Debug] Added standalone assistant pair:', newPair);
          }
        }
      }
    }
    
    // Keep only the last 10 pairs to prevent memory issues
    if (conversationPairs.length > 10) {
      conversationPairs.shift();
    }
    
    console.log('[AIV Debug] Current conversation pairs:', conversationPairs);
  }

  // Find the latest user question by examining the DOM
  function findLatestUserQuestion() {
    try {
      console.log('[AIV Debug] Searching for latest user question in DOM');
      
      // First, try the more specific selectors
      const userMessageSelectors = [
        '[data-message-author-role="user"] .text-token-text-primary p',
        '[data-message-author-role="user"] p',
        '.user-turn .text-token-text-primary p',
        '.user-turn p'
      ];
      
      for (const selector of userMessageSelectors) {
        const userMessages = document.querySelectorAll(selector);
        console.log(`[AIV Debug] Found ${userMessages.length} elements with selector: ${selector}`);
        if (userMessages.length > 0) {
          // Get the last (most recent) user message
          const lastUserMessage = userMessages[userMessages.length - 1];
          if (lastUserMessage && lastUserMessage.textContent) {
            const questionText = lastUserMessage.textContent.trim();
            if (questionText.length > 0) {
              console.log('[AIV Debug] Found user question with specific selector:', questionText.substring(0, 50) + '...');
              return questionText;
            }
          }
        }
      }
      
      // If that doesn't work, try broader selectors
      console.log('[AIV Debug] Trying broader selectors for user questions');
      const broadSelectors = [
        '[data-message-author-role="user"] .text-token-text-primary',
        '[data-message-author-role="user"] div',
        '.user-turn .text-token-text-primary',
        '.user-turn div'
      ];
      
      for (const selector of broadSelectors) {
        const userElements = document.querySelectorAll(selector);
        console.log(`[AIV Debug] Found ${userElements.length} elements with broad selector: ${selector}`);
        if (userElements.length > 0) {
          // Get the last (most recent) user element
          const lastUserElement = userElements[userElements.length - 1];
          if (lastUserElement && lastUserElement.textContent) {
            const questionText = lastUserElement.textContent.trim();
            if (questionText.length > 0) {
              console.log('[AIV Debug] Found user question with broad selector:', questionText.substring(0, 50) + '...');
              return questionText;
            }
          }
        }
      }
      
      // Last resort: look for any element that might contain a user message
      console.log('[AIV Debug] Trying last resort method for user questions');
      const allMessages = document.querySelectorAll('[data-message-author-role]');
      console.log(`[AIV Debug] Found ${allMessages.length} total messages with data-message-author-role`);
      
      // Go through messages in reverse order to find the most recent user message
      for (let i = allMessages.length - 1; i >= 0; i--) {
        const message = allMessages[i];
        const role = message.getAttribute('data-message-author-role');
        console.log(`[AIV Debug] Message ${i} has role: ${role}`);
        
        if (role === 'user') {
          // Try to extract text content
          let questionText = '';
          
          // Look for text content in various places
          const textContainers = message.querySelectorAll('.text-token-text-primary, p, div');
          if (textContainers.length > 0) {
            const lastContainer = textContainers[textContainers.length - 1];
            questionText = lastContainer.textContent ? lastContainer.textContent.trim() : '';
          } else {
            questionText = message.textContent ? message.textContent.trim() : '';
          }
          
          if (questionText.length > 0) {
            console.log('[AIV Debug] Found user question with last resort method:', questionText.substring(0, 50) + '...');
            return questionText;
          }
        }
      }
      
      console.log('[AIV Debug] No user question found in DOM');
      return null;
    } catch (error) {
      console.error('[AIV Debug] Error finding user question:', error);
      return null;
    }
  }

  // Check if content is a meaningful response (not disclaimer, temporary chat text, etc.)
  function isMeaningfulResponse(content) {
    if (!content) {
      console.log('[AIV Debug] isMeaningfulResponse: Content is null/undefined');
      return false;
    }
    
    // Trim whitespace
    const trimmedContent = content.trim();
    console.log('[AIV Debug] isMeaningfulResponse: Trimmed content length:', trimmedContent.length);
    
    // Must have some content
    if (trimmedContent.length < 10) {
      console.log('[AIV Debug] isMeaningfulResponse: Content too short');
      return false;
    }
    
    // Skip common disclaimer and temporary chat text
    const disclaimerPatterns = [
      'where should we begin',
      'temporary chat',
      'this chat won\'t appear in history',
      'use or update chatgpt\'s memory',
      'train our models',
      'safety purposes',
      'keep a copy of this chat',
      'free research preview',
      'our goal is to make ai systems more natural',
      'chatgpt may produce inaccurate information',
      'may occasionally generate incorrect information',
      'may occasionally produce harmful instructions',
      'limited knowledge of world and events after',
      'also known as chatgpt',
      'powered by ai',
      'i am an AI assistant',
      'i\'m an AI assistant'
    ];
    
    const lowerContent = trimmedContent.toLowerCase();
    
    // Check if content contains disclaimer patterns
    for (const pattern of disclaimerPatterns) {
      if (lowerContent.includes(pattern)) {
        // If the content is mostly the disclaimer, skip it
        if (trimmedContent.length < pattern.length + 50) {
          console.log('[AIV Debug] isMeaningfulResponse: Found disclaimer pattern:', pattern);
          return false;
        }
      }
    }
    
    // Skip content that looks like navigation or UI elements
    const uiPatterns = [
      'use voice mode',
      'stop generating',
      'regenerate response',
      'copy code',
      'like',
      'dislike',
      'send message',
      'new chat',
      'clear chat',
      'settings',
      'help',
      'terms',
      'privacy',
      'upgrade',
      'pro',
      'menu',
      'close',
      'cancel',
      'save',
      'delete',
      'edit',
      'copy',
      'share'
    ];
    
    for (const pattern of uiPatterns) {
      if (lowerContent.includes(pattern)) {
        // If the content is mostly the UI pattern, skip it
        if (trimmedContent.length < pattern.length + 10) {
          console.log('[AIV Debug] isMeaningfulResponse: Found UI pattern:', pattern);
          return false;
        }
      }
    }
    
    // Check if it's a single word that's likely a button
    const words = trimmedContent.split(/\s+/);
    if (words.length === 1 && uiPatterns.includes(lowerContent)) {
      console.log('[AIV Debug] isMeaningfulResponse: Single word UI element detected');
      return false;
    }
    
    console.log('[AIV Debug] isMeaningfulResponse: Content is meaningful');
    return true;
  }

  // Check if a response appears to be complete (not still streaming)
  function isCompleteResponse(content, element) {
    if (!content) {
      return false;
    }
    
    // If content is very short, it's likely still streaming
    if (content.length < 15) {
      console.log('[AIV Debug] isCompleteResponse: Content too short to be complete');
      return false;
    }
    
    // Check if the element has any loading indicators
    if (element) {
      // Look for common loading indicators in ChatGPT
      const loadingIndicators = element.querySelectorAll('.result-streaming, .typing-indicator, .loading, [data-testid="loading"], .animate-pulse, .opacity-50, .cursor, .blink');
      if (loadingIndicators.length > 0) {
        console.log('[AIV Debug] isCompleteResponse: Found loading indicators, response still streaming');
        return false;
      }
      
      // Check if element has the streaming class
      if (element.classList && element.classList.contains('result-streaming')) {
        console.log('[AIV Debug] isCompleteResponse: Element has streaming class, response still streaming');
        return false;
      }
      
      // Check for ChatGPT specific streaming indicators
      const parent = element.closest('[data-message-author-role="assistant"]');
      if (parent) {
        const streamingElements = parent.querySelectorAll('.result-streaming, .cursor, .blink, [data-testid="streaming-cursor"]');
        if (streamingElements.length > 0) {
          console.log('[AIV Debug] isCompleteResponse: Found ChatGPT streaming indicators');
          return false;
        }
      }
      
      // Check for the specific cursor element that ChatGPT uses
      const cursorElements = element.querySelectorAll('span.cursor, span.blink, span[style*="cursor"]');
      if (cursorElements.length > 0) {
        console.log('[AIV Debug] isCompleteResponse: Found cursor elements, response still streaming');
        return false;
      }
    }
    
    // Check if content ends with common incomplete sentence patterns
    const trimmedContent = content.trim();
    const lastChar = trimmedContent.charAt(trimmedContent.length - 1);
  
    // If it ends with a dash or incomplete punctuation, it might still be streaming
    if (lastChar === '-' || lastChar === ',' || lastChar === ';' || 
      (lastChar === '.' && trimmedContent.endsWith('...')) ||
      lastChar === '+' || lastChar === '=' || lastChar === '*' || lastChar === '/' ||
      lastChar === '(' || lastChar === '[' || lastChar === '{' ||
      lastChar === '<' || lastChar === '"' || lastChar === "'") {
    console.log('[AIV Debug] isCompleteResponse: Content ends with incomplete punctuation or operator');
    return false;
  }
  
  // Check for common incomplete mathematical expressions
  if (trimmedContent.match(/\d\s*[\+\-\*\/]$/) || 
      trimmedContent.match(/[a-zA-Z]\s*[\+\-\*\/]$/) ||
      trimmedContent.match(/[\+\-\*\/]\s*$/)) {
    console.log('[AIV Debug] isCompleteResponse: Content ends with incomplete mathematical expression');
    return false;
  }
  
  // Check for incomplete year ranges (e.g., "1889–1")
  if (trimmedContent.match(/\d{4}[\u2013\u2014]\d?$/)) {
    console.log('[AIV Debug] isCompleteResponse: Content ends with incomplete year range');
    return false;
  }
  
  console.log('[AIV Debug] isCompleteResponse: Response appears to be complete');
  return true;
}

  // Trigger validation for a completed conversation pair
  function triggerValidationForPair(pair) {
    console.log('[AIV Debug] triggerValidationForPair called with pair:', pair);
    
    // Create a message data object for the assistant response
    const messageData = {
      role: 'assistant',
      content: pair.response,
      question: pair.question, // Include the question for better matching
      timestamp: pair.timestamp,
      url: pair.url,
      platform: pair.platform
    };
    
    console.log('[AIV Debug] Triggering validation for assistant response:', messageData.content.substring(0, 100) + '...');
    console.log('[AIV Debug] Full message data:', messageData);
    
    // Send to background script for validation
    chrome.runtime.sendMessage({
      action: 'captureInteraction',
      data: messageData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[AIV Debug] Error sending message to background:', chrome.runtime.lastError);
      } else {
        console.log('[AIV Debug] Background validation response:', response);
      }
    });
  }

  // Extract message data from an element (platform-specific implementation needed)
  function extractMessageData(element) {
    try {
      console.log('[AIV Debug] extractMessageData called with element:', element);
      console.log('[AIV Debug] Element tag name:', element.tagName);
      console.log('[AIV Debug] Element class list:', element.classList);
      console.log('[AIV Debug] Element attributes:', element.attributes);
      
      // Try to determine if this is a user or assistant message
      let role = 'unknown';
      
      // More robust ChatGPT specific role detection
      // Check for user messages first with more specific selectors
      const userSelectors = [
        '[data-message-author-role="user"]',
        '.user-turn',
        '[data-message-author-role="user"] .text-token-text-primary',
        '.user-turn .text-token-text-primary'
      ];
      
      const isUserMessage = userSelectors.some(selector => {
        const matches = element.matches && element.matches(selector);
        const parent = element.closest(selector);
        const result = matches || (parent !== null);
        console.log(`[AIV Debug] Checking user selector "${selector}": matches=${matches}, hasParent=${parent !== null}, result=${result}`);
        return result;
      });
      
      if (isUserMessage) {
        role = 'user';
        console.log('[AIV Debug] Role identified as user message');
      } else {
        // Check for assistant messages
        const assistantSelectors = [
          '[data-message-author-role="assistant"]',
          '.agent-turn',
          '[data-message-author-role="assistant"] .text-token-text-primary',
          '.agent-turn .text-token-text-primary'
        ];
        
        const isAssistantMessage = assistantSelectors.some(selector => {
          const matches = element.matches && element.matches(selector);
          const parent = element.closest(selector);
          const result = matches || (parent !== null);
          console.log(`[AIV Debug] Checking assistant selector "${selector}": matches=${matches}, hasParent=${parent !== null}, result=${result}`);
          return result;
        });
        
        if (isAssistantMessage) {
          role = 'assistant';
          console.log('[AIV Debug] Role identified as assistant message');
        } else {
          // If we still can't determine the role, try to infer from context
          const grandParent = element.parentElement ? element.parentElement.parentElement : null;
          if (grandParent && grandParent.hasAttribute('data-message-author-role')) {
            role = grandParent.getAttribute('data-message-author-role');
            console.log('[AIV Debug] Role from grandparent data-message-author-role:', role);
          } else if (element.classList.contains('text-token-text-primary')) {
            // For ChatGPT, text-token-text-primary elements are usually assistant messages
            role = 'assistant';
            console.log('[AIV Debug] Role defaulted to assistant for text-token-text-primary');
          } else {
            console.log('[AIV Debug] Could not determine message role, returning null');
            return null;
          }
        }
      }
      
      console.log('[AIV Debug] Determined role:', role);
      
      // Extract text content - focus on paragraph content when available
      let text = '';
      if (element.tagName === 'P') {
        // For paragraph elements, get the direct text content
        text = element.textContent ? element.textContent.trim() : '';
        console.log('[AIV Debug] Extracted text from paragraph element, length:', text.length);
      } else if (element.querySelector && element.querySelector('p')) {
        // If the element contains paragraphs, extract text from all paragraphs
        const paragraphs = element.querySelectorAll('p');
        const paragraphTexts = [];
        paragraphs.forEach(p => {
          if (p.textContent && p.textContent.trim()) {
            paragraphTexts.push(p.textContent.trim());
          }
        });
        text = paragraphTexts.join('\n\n'); // Join paragraphs with double newline
        console.log('[AIV Debug] Extracted text from', paragraphs.length, 'paragraphs, total length:', text.length);
      } else if (element.textContent) {
        // Fallback to general text content extraction
        text = element.textContent.trim();
        console.log('[AIV Debug] Extracted text from general content, length:', text.length);
      }
      
      console.log('[AIV Debug] Extracted text content:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      
      // Don't process empty messages
      if (!text) {
        console.log('[AIV Debug] No text content found, returning null');
        return null;
      }
      
      // Skip very short messages that are likely UI elements
      if (text.length < 5) {
        console.log('[AIV Debug] Text too short, returning null');
        return null;
      }
      
      // CRITICAL FIX: Skip JavaScript code
      if (text.includes('window.') || text.includes('function(') || text.includes('()=>') ||
          text.includes('function ()') || text.includes('setTimeout') || text.includes('setInterval') ||
          text.includes('document.') || text.includes('console.') || text.includes('var ') ||
          text.includes('let ') || text.includes('const ') || text.includes('return ') ||
          text.includes('if(') || text.includes('else{') || text.includes('for(') ||
          text.includes('while(') || text.match(/[\{\}\(\);\.][\s\r\n]*[\{\}\(\);\.]/)) {
        console.log('[AIV Debug] Skipping JavaScript code:', text.substring(0, 50) + '...');
        return null;
      }
      
      // Skip if text looks like JSON or contains too many special characters
      const specialCharCount = (text.match(/[^a-zA-Z0-9\s\.\,\!\?\-]/g) || []).length;
      if (specialCharCount > text.length * 0.3) {
        console.log('[AIV Debug] Skipping content with too many special characters:', text.substring(0, 50) + '...');
        return null;
      }
      
      // Skip if it looks like a script tag content
      if (element.tagName === 'SCRIPT' || element.closest('script')) {
        console.log('[AIV Debug] Skipping script element content');
        return null;
      }
      
      // Skip common UI elements and cookie messages
      const skipPatterns = [
        'Cookie Preferences',
        'Cookies',
        'Settings',
        'Help',
        'Terms',
        'Privacy',
        'Login',
        'Sign in',
        'Send message',
        'New chat',
        'Clear chat',
        'Upgrade',
        'Pro',
        'Menu',
        'Close',
        'Cancel',
        'Save',
        'Delete',
        'Edit',
        'Copy',
        'Share',
        'Like',
        'Dislike',
        'Feedback',
        'Report',
        'Download',
        'Upload',
        'Search',
        'Filter',
        'Sort',
        'View',
        'Refresh',
        'Reload',
        'Account',
        'Profile',
        'Logout',
        'Exit',
        'Back',
        'Next',
        'Previous',
        'Home',
        'Dashboard',
        'Notifications',
        'Messages',
        'Contacts',
        'Friends',
        'Groups',
        'Photos',
        'Videos',
        'Documents',
        'Files',
        'Folders',
        'Trash',
        'Archive',
        'Restore',
        'Move',
        'Rename',
        'Print',
        'Export',
        'Import',
        'Sync',
        'Connect',
        'Disconnect',
        'Block',
        'Unblock',
        'Follow',
        'Unfollow',
        'Subscribe',
        'Unsubscribe',
        'Rate',
        'Review',
        'Comment',
        'Reply',
        'Forward',
        'Resend',
        'Schedule',
        'Remind',
        'Alert',
        'Notify',
        'Mute',
        'Unmute',
        'Pin',
        'Unpin',
        'Lock',
        'Unlock',
        'Encrypt',
        'Decrypt',
        'Compress',
        'Decompress',
        'Extract',
        'Install',
        'Uninstall',
        'Update',
        'Patch',
        'Fix',
        'Bug',
        'Issue',
        'Ticket',
        'Support',
        'Contact',
        'Phone',
        'Email',
        'Address',
        'Location',
        'Map',
        'Navigation',
        'Directions',
        'Route',
        'Distance',
        'Time',
        'Date',
        'Calendar',
        'Event',
        'Meeting',
        'Appointment',
        'Task',
        'Todo',
        'List',
        'Note',
        'Memo',
        'Reminder',
        'Alarm',
        'Timer',
        'Stopwatch',
        'Clock',
        'Weather',
        'News',
        'Feed',
        'RSS',
        'Podcast',
        'Music',
        'Video',
        'Audio',
        'Image',
        'Picture',
        'Gallery',
        'Camera',
        'Photo',
        'Selfie',
        'Portrait',
        'Landscape',
        'Filter',
        'Effect',
        'Edit',
        'Crop',
        'Resize',
        'Rotate',
        'Flip',
        'Mirror',
        'Adjust',
        'Brightness',
        'Contrast',
        'Saturation',
        'Hue',
        'Sharpness',
        'Blur',
        'Focus',
        'Exposure',
        'ISO',
        'Shutter',
        'Aperture',
        'White Balance',
        'Color',
        'Palette',
        'Theme',
        'Style',
        'Design',
        'Layout',
        'Template',
        'Format',
        'Font',
        'Size',
        'Color',
        'Bold',
        'Italic',
        'Underline',
        'Strike',
        'Highlight',
        'Align',
        'Left',
        'Right',
        'Center',
        'Justify',
        'Indent',
        'Outdent',
        'Bullet',
        'Number',
        'List',
        'Link',
        'Unlink',
        'Anchor',
        'Bookmark',
        'Table',
        'Row',
        'Column',
        'Cell',
        'Merge',
        'Split',
        'Insert',
        'Delete',
        'Add',
        'Remove',
        'Increase',
        'Decrease',
        'Up',
        'Down',
        'Top',
        'Bottom',
        'First',
        'Last',
        'All',
        'None',
        'Select',
        'Deselect',
        'Invert',
        'Choose',
        'Pick',
        'Select',
        'Confirm',
        'Accept',
        'Reject',
        'Deny',
        'Approve',
        'Decline',
        'Submit',
        'Reset',
        'Clear',
        'Undo',
        'Redo',
        'Cut',
        'Copy',
        'Paste',
        'Duplicate',
        'Clone',
        'Fork',
        'Branch',
        'Merge',
        'Pull',
        'Push',
        'Commit',
        'Revert',
        'Rollback',
        'Backup',
        'Restore',
        'Recover',
        'Rebuild',
        'Reindex',
        'Optimize',
        'Compact',
        'Defragment',
        'Scan',
        'Check',
        'Verify',
        'Validate',
        'Test',
        'Debug',
        'Profile',
        'Monitor',
        'Log',
        'Trace',
        'Audit',
        'Compliance',
        'Security',
        'Safety',
        'Protection',
        'Guard',
        'Shield',
        'Firewall',
        'Antivirus',
        'Malware',
        'Virus',
        'Trojan',
        'Worm',
        'Spyware',
        'Adware',
        'Ransomware',
        'Phishing',
        'Scam',
        'Fraud',
        'Theft',
        'Steal',
        'Hack',
        'Crack',
        'Break',
        'Bypass',
        'Exploit',
        'Vulnerability',
        'Weakness',
        'Flaw',
        'Bug',
        'Glitch',
        'Error',
        'Mistake',
        'Fault',
        'Failure',
        'Crash',
        'Freeze',
        'Hang',
        'Lag',
        'Slow',
        'Fast',
        'Quick',
        'Speed',
        'Performance',
        'Efficiency',
        'Optimization',
        'Resource',
        'Memory',
        'CPU',
        'GPU',
        'Disk',
        'Storage',
        'Bandwidth',
        'Network',
        'Internet',
        'Web',
        'Online',
        'Offline',
        'Cloud',
        'Server',
        'Client',
        'Host',
        'Guest',
        'Virtual',
        'Physical',
        'Hardware',
        'Software',
        'Firmware',
        'Driver',
        'Update',
        'Patch',
        'Fix',
        'Repair',
        'Maintenance',
        'Service',
        'Support',
        'Help',
        'Documentation',
        'Guide',
        'Tutorial',
        'Lesson',
        'Course',
        'Training',
        'Education',
        'Learning',
        'Study',
        'Research',
        'Experiment',
        'Test',
        'Trial',
        'Demo',
        'Sample',
        'Example',
        'Template',
        'Model',
        'Framework',
        'Library',
        'Package',
        'Module',
        'Component',
        'Plugin',
        'Addon',
        'Extension',
        'Tool',
        'Utility',
        'Application',
        'Program',
        'Software',
        'App',
        'Game',
        'Entertainment',
        'Fun',
        'Enjoy',
        'Play',
        'Watch',
        'Listen',
        'Read',
        'Write',
        'Type',
        'Keyboard',
        'Mouse',
        'Touch',
        'Screen',
        'Display',
        'Monitor',
        'Resolution',
        'Pixel',
        'DPI',
        'Refresh',
        'Rate',
        'Frequency',
        'Hertz',
        'Hz',
        'Color',
        'Depth',
        'Bit',
        'Byte',
        'Kilobyte',
        'Megabyte',
        'Gigabyte',
        'Terabyte',
        'Petabyte',
        'Exabyte',
        'Zettabyte',
        'Yottabyte',
        'Binary',
        'Decimal',
        'Hexadecimal',
        'Octal',
        'ASCII',
        'Unicode',
        'UTF-8',
        'Encoding',
        'Compression',
        'Encryption',
        'Decryption',
        'Hash',
        'Checksum',
        'CRC',
        'MD5',
        'SHA',
        'RSA',
        'AES',
        'DES',
        'Blowfish',
        'Twofish',
        'Serpent',
        'Camellia',
        'IDEA',
        'RC4',
        'RC5',
        'RC6',
        'SEED',
        'ARIA',
        'SM4',
        'Kalyna',
        'Kuznyechik',
        'Magma',
        'GOST',
        'Skipjack',
        'TEA',
        'XTEA',
        'XXTEA',
        'Salsa20',
        'ChaCha20',
        'Rabbit',
        'HC-128',
        'HC-256',
        'SOSEMANUK',
        'LEX',
        'F-FCSR',
        'Frog',
        'FROG',
        'Crypt',
        'Crypto',
        'Cipher',
        'Code',
        'Encode',
        'Decode',
        'Obfuscate',
        'Deobfuscate',
        'Scramble',
        'Unscramble',
        'Mix',
        'Unmix',
        'Shuffle',
        'Unshuffle',
        'Permute',
        'Unpermute',
        'Transpose',
        'Untranspose',
        'Reverse',
        'Invert',
        'Flip',
        'Mirror',
        'Rotate',
        'Shift',
        'XOR',
        'AND',
        'OR',
        'NOT',
        'NAND',
        'NOR',
        'XNOR',
        'Bitwise',
        'Logical',
        'Arithmetic',
        'Math',
        'Mathematics',
        'Algebra',
        'Geometry',
        'Trigonometry',
        'Calculus',
        'Statistics',
        'Probability',
        'Logic',
        'Boolean',
        'Set',
        'Function',
        'Algorithm',
        'Data',
        'Database',
        'SQL',
        'NoSQL',
        'MongoDB',
        'PostgreSQL',
        'MySQL',
        'MariaDB',
        'SQLite',
        'Oracle',
        'Microsoft',
        'SQL Server',
        'Redis',
        'Memcached',
        'Cassandra',
        'HBase',
        'Hive',
        'Pig',
        'Spark',
        'Hadoop',
        'MapReduce',
        'Big Data',
        'Analytics',
        'Business Intelligence',
        'BI',
        'Dashboard',
        'Report',
        'Chart',
        'Graph',
        'Plot',
        'Diagram',
        'Visualization',
        'Visual',
        'GUI',
        'CLI',
        'Command Line',
        'Terminal',
        'Shell',
        'Bash',
        'Zsh',
        'Fish',
        'PowerShell',
        'CMD',
        'DOS',
        'Windows',
        'Linux',
        'Unix',
        'Mac',
        'macOS',
        'iOS',
        'Android',
        'Mobile',
        'Desktop',
        'Laptop',
        'Tablet',
        'Phone',
        'Smartphone',
        'Device',
        'Machine',
        'Computer',
        'PC',
        'Server',
        'Workstation',
        'Node',
        'Cluster',
        'Grid',
        'Cloud',
        'AWS',
        'Azure',
        'Google Cloud',
        'GCP',
        'IBM Cloud',
        'Oracle Cloud',
        'Alibaba Cloud',
        'Tencent Cloud',
        'DigitalOcean',
        'Linode',
        'Vultr',
        'Heroku',
        'Netlify',
        'Vercel',
        'Firebase',
        'Docker',
        'Kubernetes',
        'K8s',
        'Container',
        'Orchestration',
        'Microservice',
        'API',
        'REST',
        'GraphQL',
        'SOAP',
        'JSON',
        'XML',
        'YAML',
        'CSV',
        'TSV',
        'Excel',
        'Spreadsheet',
        'Workbook',
        'Worksheet',
        'Cell',
        'Formula',
        'Function',
        'Macro',
        'VBA',
        'Script',
        'Code',
        'Programming',
        'Development',
        'Dev',
        'Developer',
        'Engineer',
        'Coder',
        'Programmer',
        'Hacker',
        'Security',
        'InfoSec',
        'Cybersecurity',
        'Penetration',
        'Testing',
        'QA',
        'Quality Assurance',
        'Automation',
        'CI/CD',
        'Continuous Integration',
        'Continuous Deployment',
        'DevOps',
        'SRE',
        'Site Reliability',
        'Infrastructure',
        'Network',
        'Networking',
        'Protocol',
        'TCP/IP',
        'HTTP',
        'HTTPS',
        'FTP',
        'SFTP',
        'SSH',
        'SSL',
        'TLS',
        'VPN',
        'Proxy',
        'Load Balancer',
        'DNS',
        'DHCP',
        'NAT',
        'Firewall',
        'Router',
        'Switch',
        'Hub',
        'Bridge',
        'Gateway',
        'Modem',
        'Wireless',
        'WiFi',
        'Bluetooth',
        'NFC',
        'RFID',
        'LTE',
        '5G',
        '4G',
        '3G',
        '2G',
        'Edge',
        'Cloudflare',
        'Akamai',
        'CDN',
        'Content Delivery',
        'Edge Computing',
        'Fog Computing',
        'IoT',
        'Internet of Things',
        'Smart Home',
        'Smart City',
        'Wearable',
        'Sensor',
        'Actuator',
        'Controller',
        'Processor',
        'CPU',
        'GPU',
        'TPU',
        'NPU',
        'APU',
        'SoC',
        'Chip',
        'Silicon',
        'Transistor',
        'Semiconductor',
        'Fabrication',
        'Fab',
        'Foundry',
        'TSMC',
        'Intel',
        'AMD',
        'NVIDIA',
        'Qualcomm',
        'Broadcom',
        'Texas Instruments',
        'Analog Devices',
        'Microchip',
        'STMicroelectronics',
        'Infineon',
        'NXP',
        'Renesas',
        'ON Semiconductor',
        'Microsemi',
        'Maxim',
        'Linear Technology',
        'Altera',
        'Xilinx',
        'Lattice',
        'Microsemi',
        'Cypress',
        'Atmel',
        'Freescale',
        'Motorola',
        'Panasonic',
        'Toshiba',
        'Fujitsu',
        'Hitachi',
        'NEC',
        'Sharp',
        'Sony',
        'Samsung',
        'LG',
        'Huawei',
        'Xiaomi',
        'Oppo',
        'Vivo',
        'Realme',
        'OnePlus',
        'HTC',
        'BlackBerry',
        'Nokia',
        'Ericsson',
        'Alcatel',
        'ZTE',
        'Motorola',
        'Lenovo',
        'Dell',
        'HP',
        'Acer',
        'Asus',
        'MSI',
        'Gigabyte',
        'ASRock',
        'Biostar',
        'Supermicro',
        'Quanta',
        'Compal',
        'Wistron',
        'Pegatron',
        'Foxconn',
        'Hon Hai',
        'Flextronics',
        'Jabil',
        'Sanmina',
        'Celestica',
        'Kimco',
        'Benchmark',
        'Solectron',
        'Venture',
        'Corp',
        'Corporation',
        'Inc',
        'Incorporated',
        'Ltd',
        'Limited',
        'LLC',
        'PLC',
        'GmbH',
        'AG',
        'SA',
        'SARL',
        'BV',
        'NV',
        'Co',
        'Company',
        'Enterprise',
        'Business',
        'Organization',
        'Institution',
        'University',
        'College',
        'School',
        'Academy',
        'Institute',
        'Research',
        'Laboratory',
        'Lab',
        'Studio',
        'Agency',
        'Consulting',
        'Services',
        'Solutions',
        'Technologies',
        'Tech',
        'Digital',
        'Interactive',
        'Media',
        'Communications',
        'Telecommunications',
        'Telecom',
        'Wireless',
        'Satellite',
        'Broadcast',
        'Television',
        'TV',
        'Radio',
        'FM',
        'AM',
        'DAB',
        'HD Radio',
        'Streaming',
        'Netflix',
        'YouTube',
        'Twitch',
        'TikTok',
        'Instagram',
        'Facebook',
        'Twitter',
        'LinkedIn',
        'Snapchat',
        'Pinterest',
        'Reddit',
        'Tumblr',
        'WhatsApp',
        'Telegram',
        'Signal',
        'Discord',
        'Slack',
        'Teams',
        'Skype',
        'Zoom',
        'Meet',
        'Hangouts',
        'Duo',
        'Facetime',
        'WeChat',
        'QQ',
        'Line',
        'KakaoTalk',
        'Viber',
        'IMO',
        'JioChat',
        'Hike',
        'Helo',
        'ShareChat',
        'MiChat',
        'Mi Video Call',
        'Mi Drop',
        'Mi Pay',
        'Mi Store',
        'Mi Home',
        'Mi Fit',
        'Mi Band',
        'Apple',
        'Google',
        'Microsoft',
        'Amazon',
        'Facebook',
        'Meta',
        'Oracle',
        'SAP',
        'Salesforce',
        'Adobe',
        'Autodesk',
        'VMware',
        'Red Hat',
        'Canonical',
        'SUSE',
        'Novell',
        'Borland',
        'Symantec',
        'McAfee',
        'Kaspersky',
        'Bitdefender',
        'Avast',
        'AVG',
        'ESET',
        'F-Secure',
        'Trend Micro',
        'Sophos',
        'Panda',
        'Comodo',
        'Dr.Web',
        'Webroot',
        'Malwarebytes',
        'Norton',
        'McAfee',
        'Trellix',
        'CrowdStrike',
        'SentinelOne',
        'Cylance',
        'Carbon Black',
        'FireEye',
        'Palo Alto',
        'Fortinet',
        'Check Point',
        'Juniper',
        'Cisco',
        'Aruba',
        'Meraki',
        'Ubiquiti',
        'Ruckus',
        'Extreme',
        'Arista',
        'Cumulus',
        'Big Switch',
        'Pluribus',
        'Centec',
        'EdgeCore',
        'Delta',
        'Accton',
        'Quanta',
        'Inventec',
        'Mitac',
        'Wiwynn',
        'Smart',
        'Amdocs',
        'Ericsson',
        'Nokia',
        'Huawei',
        'ZTE',
        'Samsung',
        'LG',
        'Sony',
        'Panasonic',
        'Toshiba',
        'Sharp',
        'Fujitsu',
        'Hitachi',
        'NEC',
        'Canon',
        'Epson',
        'Brother',
        'HP',
        'Dell',
        'Lexmark',
        'Xerox',
        'Kyocera',
        'Ricoh',
        'OKI',
        'Mita',
        'Minolta',
        'Konica',
        'Pentax',
        'Tamron',
        'Sigma',
        'Tokina',
        'Samyang',
        'Rokinon',
        'Yongnuo',
        'Godox',
        'Neewer',
        'Elgato',
        'Logitech',
        'Razer',
        'SteelSeries',
        'HyperX',
        'Corsair',
        'Cooler Master',
        'NZXT',
        'Fractal Design',
        'be quiet!',
        'Noctua',
        'Arctic',
        'Thermalright',
        'SilverStone',
        'Lian Li',
        'Phanteks',
        'Deepcool',
        'ID-Cooling',
        'Gelid',
        'Scythe',
        'Zalman',
        'Seasonic',
        'Corsair',
        'EVGA',
        'Super Flower',
        'FSP',
        'Thermaltake',
        'Antec',
        'BitFenix',
        'SilverStone',
        'Xigmatek',
        'Chieftec',
        'Aerocool',
        'Cougar',
        'Phanteks',
        'Rosewill'
      ];
      
      // Check if text matches any skip patterns (case insensitive)
      const lowerText = text.toLowerCase();
      for (const pattern of skipPatterns) {
        if (lowerText.includes(pattern.toLowerCase())) {
          // Only skip if the text is short and matches exactly or is mostly the pattern
          if (text.length < 30 || 
              (text.length < pattern.length + 10 && 
               lowerText.replace(/[^a-z0-9]/g, '').includes(pattern.toLowerCase().replace(/[^a-z0-9]/g, '')))) {
            console.log('[AIV Debug] Skipping UI element:', text);
            return null;
          }
        }
      }
      
      // Skip if it looks like a button or link
      if (element.tagName === 'BUTTON' || element.tagName === 'A' || 
          element.closest('button') || element.closest('a')) {
        console.log('[AIV Debug] Skipping button/link element:', text);
        return null;
      }
      
      // Skip if it's in a header or footer area
      if (element.closest('header') || element.closest('footer') || 
          element.closest('.header') || element.closest('.footer')) {
        console.log('[AIV Debug] Skipping header/footer element:', text);
        return null;
      }
      
      const result = {
        role: role,
        content: text,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        platform: detectPlatform()
      };
      
      console.log('[AIV Debug] Final extracted message data:', result);
      return result;
    } catch (error) {
      console.error('[AIV Debug] Error extracting message data:', error);
      return null;
    }
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

  // Trigger manual validation of the latest assistant message
  async function triggerManualValidation() {
    console.log('[AIV Debug] Triggering manual validation');
    
    // Add a small delay to allow any streaming responses to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the latest assistant message
    const assistantMessages = [];
    
    // Focus on paragraph tags within assistant messages for more accurate content
    const messageSelectors = [
      '[data-message-author-role="assistant"] p',
      '.agent-turn p',
      '.text-token-text-primary p'
    ];
    
    messageSelectors.forEach(selector => {
      const messages = document.querySelectorAll(selector);
      messages.forEach(message => {
        const messageData = extractMessageData(message);
        if (messageData && messageData.role === 'assistant' && messageData.content) {
          // Apply the same filtering as in processMessage
          if (messageData.content.length >= 5 && isMeaningfulResponse(messageData.content)) {
            // Check if the response is complete before adding
            if (isCompleteResponse(messageData.content, message)) {
              assistantMessages.push({
                element: message,
                data: messageData
              });
            } else {
              console.log('[AIV Debug] Skipping incomplete assistant message in manual validation');
            }
          }
        }
      });
    });
    
    // Fallback to general message containers if no paragraphs found
    if (assistantMessages.length === 0) {
      const fallbackSelectors = [
        '[data-message-author-role="assistant"]',
        '.agent-turn',
        '.text-token-text-primary'
      ];
      
      fallbackSelectors.forEach(selector => {
        const messages = document.querySelectorAll(selector);
        messages.forEach(message => {
          // Check if this is actually an assistant message
          let isAssistant = false;
          if (message.hasAttribute('data-message-author-role')) {
            isAssistant = message.getAttribute('data-message-author-role') === 'assistant';
          } else if (message.classList.contains('agent-turn') || 
                     message.parentElement && message.parentElement.classList.contains('agent-turn')) {
            isAssistant = true;
          }
          
          if (isAssistant) {
            const messageData = extractMessageData(message);
            if (messageData && messageData.role === 'assistant' && messageData.content) {
              // Apply the same filtering as in processMessage
              if (messageData.content.length >= 5 && isMeaningfulResponse(messageData.content)) {
                // Check if the response is complete before adding
                if (isCompleteResponse(messageData.content, message)) {
                  assistantMessages.push({
                    element: message,
                    data: messageData
                  });
                } else {
                  console.log('[AIV Debug] Skipping incomplete assistant message in manual validation (fallback)');
                }
              }
            }
          }
        });
      });
    }
    
    console.log('[AIV Debug] Found', assistantMessages.length, 'assistant messages');
    
    if (assistantMessages.length > 0) {
      // Get the last assistant message
      const latestMessage = assistantMessages[assistantMessages.length - 1];
      console.log('[AIV Debug] Validating latest assistant message:', latestMessage.data.content.substring(0, 100) + '...');
      
      // Send to background script for validation
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'captureInteraction',
          data: latestMessage.data
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[AIV Debug] Error sending message to background:', chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log('[AIV Debug] Background response:', response);
            resolve(response);
          }
        });
      });
    } else {
      throw new Error('No assistant messages found to validate');
    }
  }

  // Initialize - check if validation should be enabled
  chrome.storage.local.get(['aivValidationEnabled'], function(result) {
    isValidationEnabled = result.aivValidationEnabled !== undefined ? result.aivValidationEnabled : true;
    
    if (isValidationEnabled) {
      console.log('[AIV Debug] AIV Validation was enabled, starting observation');
      startObserving();
    }
  });

  console.log('[AIV Debug] AIV Systems Content Script loaded');
} else {
  console.log('[AIV Debug] AIV Systems Content Script already loaded, skipping initialization');
}