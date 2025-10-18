// validation-service.js - Service to validate AI responses with AIV System

class AIVValidationService {
  constructor() {
    // AIV System API endpoint - using Firebase Functions emulator for local development
    this.apiEndpoint = 'http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse';
    this.validationResults = [];
    this.processedContentHashes = new Set(); // Track already processed content
  }
  
  // Validate an AI response
  async validateResponse(data) {
    try {
      console.log('Validating response with AIV System:', data);
      
      // Create a hash of the content to detect duplicates
      const contentHash = this.hashCode(`${data.role}-${data.content}-${data.platform}`);
      
      // Check if we've already processed this exact content
      if (this.processedContentHashes.has(contentHash)) {
        console.log('Skipping duplicate content validation');
        // Return the last validation result for this content if available
        const lastResult = this.validationResults.find(result => 
          this.hashCode(`${result.role}-${result.content}-${result.platform}`) === contentHash
        );
        if (lastResult) {
          return lastResult;
        }
      }
      
      // Mark this content as processed
      this.processedContentHashes.add(contentHash);
      
      // Keep only the last 100 hashes to prevent memory issues
      if (this.processedContentHashes.size > 100) {
        const hashes = Array.from(this.processedContentHashes);
        this.processedContentHashes = new Set(hashes.slice(hashes.length - 100));
      }
      
      // Prepare validation request - matching Firebase function expected format
      const validationRequest = {
        role: data.role,
        content: data.content,
        timestamp: data.timestamp,
        url: data.url,
        platform: data.platform
      };
      
      // Send to AIV System for validation
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationRequest)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Validation failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      // Store result with validation data
      const validationResult = {
        id: Date.now(),
        ...data,
        validation: result.validation || result,
        validatedAt: new Date().toISOString()
      };
      
      this.validationResults.push(validationResult);
      
      // Keep only last 50 results to prevent memory issues
      if (this.validationResults.length > 50) {
        this.validationResults.shift();
      }
      
      console.log('Validation result:', validationResult);
      return validationResult;
    } catch (error) {
      console.error('Validation error:', error);
      
      // Return a mock result if validation fails
      return {
        ...data,
        validation: {
          isValid: Math.random() > 0.3, // 70% chance of being valid
          confidence: Math.random(),
          issues: ['API not accessible', 'Using mock validation'],
          suggestions: ['Make sure Firebase emulator is running', 'Check network connectivity'],
          error: error.message
        },
        validatedAt: new Date().toISOString(),
        error: true
      };
    }
  }
  
  // Simple hash function for content deduplication
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
  
  // Get validation results
  getValidationResults() {
    return this.validationResults;
  }
  
  // Get latest validation result
  getLatestResult() {
    return this.validationResults.length > 0 
      ? this.validationResults[this.validationResults.length - 1]
      : null;
  }
  
  // Get previous user question (simplified implementation)
  getPreviousUserQuestion() {
    // In a real implementation, you would track conversation history
    // For now, we'll just return a placeholder
    // Let's try to get a more realistic previous question
    if (this.validationResults.length > 0) {
      // Find the last user message
      for (let i = this.validationResults.length - 1; i >= 0; i--) {
        if (this.validationResults[i].role === 'user') {
          return this.validationResults[i].content;
        }
      }
    }
    return "What is the question?";
  }
  
  // Clear validation results
  clearResults() {
    this.validationResults = [];
    this.processedContentHashes.clear();
  }
}

// Create a global instance for service worker usage
var aivValidationService = new AIVValidationService();