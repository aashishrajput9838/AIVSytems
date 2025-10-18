// debug-helper.js - Enhanced debugging for AIV Systems Chrome Extension

// Enhanced logging function - simplified version without panel
function enhancedLog(message, context = '', level = 'info') {
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
  
  // Also send to background script for centralized logging
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'debugLog',
        data: {
          message: logMessage,
          level: level,
          timestamp: timestamp,
          url: window.location.href
        }
      }).catch(() => {});
    }
  } catch (e) {}
}

// Make functions available globally
window.AIVDebugPanel = {
  log: enhancedLog
};

// Override console methods to also log to panel
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.debug
};

console.log = function(...args) {
  originalConsole.log.apply(console, args);
};

console.error = function(...args) {
  originalConsole.error.apply(console, args);
};

console.warn = function(...args) {
  originalConsole.warn.apply(console, args);
};

console.debug = function(...args) {
  originalConsole.debug.apply(console, args);
};

enhancedLog('Debug helper loaded', 'Init', 'info');