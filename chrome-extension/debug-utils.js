// debug-utils.js - Debugging utilities for AIV Systems Chrome Extension

// Simple debug logging function
function logDebug(message, context = '', level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[AIV-DEBUG ${timestamp}] ${context ? `[${context}] ` : ''}${message}`;
  
  // Log to console
  switch (level) {
    case 'error':
      console.error(logMessage);
      break;
    case 'warn':
      console.warn(logMessage);
      break;
    case 'debug':
      console.debug(logMessage);
      break;
    default:
      console.log(logMessage);
  }
}

// Dump information about an element
function dumpElementInfo(element, label = 'Element') {
  if (!element) {
    logDebug('Element is null or undefined', label, 'error');
    return;
  }
  
  logDebug(`${label}:`, 'ElementDump', 'info');
  logDebug(`  Tag: ${element.tagName}`, 'ElementDump', 'info');
  logDebug(`  ID: ${element.id || 'none'}`, 'ElementDump', 'info');
  logDebug(`  Classes: ${element.className || 'none'}`, 'ElementDump', 'info');
  logDebug(`  Text: ${element.textContent ? element.textContent.substring(0, 100) + '...' : 'none'}`, 'ElementDump', 'info');
  
  // Log attributes
  if (element.attributes && element.attributes.length > 0) {
    logDebug('  Attributes:', 'ElementDump', 'info');
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      logDebug(`    ${attr.name}: ${attr.value}`, 'ElementDump', 'info');
    }
  }
}

// Monitor DOM changes
function monitorDOMChanges(targetElement = document.body, label = 'Monitor') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            logDebug(`Added element: ${node.tagName}`, label, 'info');
          }
        });
      } else if (mutation.type === 'attributes') {
        logDebug(`Attribute changed: ${mutation.attributeName} on ${mutation.target.tagName}`, label, 'info');
      }
    });
  });
  
  observer.observe(targetElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-testid', 'data-message-author-role']
  });
  
  logDebug('DOM monitoring started', label, 'info');
  return observer;
}

// Test message detection on the current page
function testMessageDetection() {
  logDebug('Testing message detection on current page', 'Test', 'info');
  
  // Common selectors for AI chat messages
  const selectors = [
    '[data-message-author-role]',
    '.text-message',
    '.agent-turn',
    '.user-turn',
    '.markdown.prose',
    '.whitespace-pre-wrap',
    '.text-token-text-primary'
  ];
  
  let foundMessages = 0;
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      logDebug(`Found ${elements.length} elements with selector: ${selector}`, 'Test', 'info');
      foundMessages += elements.length;
      
      // Log details about first few elements
      const maxElements = Math.min(elements.length, 3);
      for (let i = 0; i < maxElements; i++) {
        const element = elements[i];
        const text = element.textContent ? element.textContent.trim().substring(0, 50) + '...' : 'No text';
        logDebug(`  Element ${i+1}: ${text}`, 'Test', 'debug');
      }
    }
  });
  
  logDebug(`Total messages found: ${foundMessages}`, 'Test', 'info');
  return foundMessages;
}

// Send a test message to the extension
function sendTestMessage(role = 'assistant', content = 'This is a test message for debugging purposes') {
  logDebug(`Sending test message: ${role} - ${content.substring(0, 50)}...`, 'Test', 'info');
  
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({
      action: 'captureInteraction',
      data: {
        role: role,
        content: content,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        platform: 'debug'
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        logDebug(`Error sending test message: ${chrome.runtime.lastError.message}`, 'Test', 'error');
      } else {
        logDebug(`Test message response: ${JSON.stringify(response)}`, 'Test', 'info');
      }
    });
  }
}

// Create global AIVDebug object
window.AIVDebug = {
  log: logDebug,
  dumpElement: dumpElementInfo,
  monitorDOM: monitorDOMChanges,
  testMessages: testMessageDetection,
  sendTest: sendTestMessage
};

// Initialize debugging
logDebug('Debug utilities loaded', 'Init', 'info');