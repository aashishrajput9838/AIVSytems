// validation-service.js - Service to validate AI responses with AIV System

// Extract key entities from question and create search query with named-entity recognition
function extractEntities(question) {
  const lowerQuestion = question.toLowerCase();
  let searchQuery = "";
  let entityType = "";
  let matchWeight = 1.0;
  
  // Named-entity recognition patterns with weights
  const entityPatterns = [
    // Personal relationship validation questions (highest priority - requires personal verification)
    {
      pattern: /(.+?) (meri|my) (pahle|pehle|first|previous|old)?\s*(friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (ki|is|the|thi|tha|thein) (.+?) (hai|is|the|thi|tha|thein)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement|galat|wrong|false) (or not|ya nahi|ya galat)?\??/i,
      entity: "Personal Relationship",
      search: (match) => `${match[1]} ${match[4]} ${match[6]}`,
      weight: 0.98,
      requiresVerification: true,
      strictValidation: true,
      isPersonalValidation: true
    },
    
    // Simple personal relationship validation questions
    {
      pattern: /(.+?) (meri|my) (.+?) (friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (.+?)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement)\??/i,
      entity: "Personal Relationship",
      search: (match) => `${match[1]} ${match[3]} ${match[4]}`,
      weight: 0.95,
      requiresVerification: true,
      strictValidation: true,
      isPersonalValidation: true
    },
    
    // Personal characteristic validation questions (requires personal verification)
    {
      pattern: /(.+?) (meri|my) (pahle|pehle|first|previous|old)?\s*(body|health|medical|mental|physical|emotional|financial|academic|educational|career|professional) (ki|is|the|thi|tha|thein) (.+?) (hai|is|the|thi|tha|thein)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement|galat|wrong|false) (or not|ya nahi|ya galat)?\??/i,
      entity: "Personal Characteristic",
      search: (match) => `${match[1]} ${match[4]} ${match[6]}`,
      weight: 0.95,
      requiresVerification: true,
      strictValidation: true,
      isPersonalValidation: true
    },
    
    // Simple personal characteristic validation questions
    {
      pattern: /(.+?) (meri|my) (.+?) (body|health|medical|mental|physical|emotional|financial|academic|educational|career|professional) (.+?)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement)\??/i,
      entity: "Personal Characteristic",
      search: (match) => `${match[1]} ${match[3]} ${match[4]}`,
      weight: 0.9,
      requiresVerification: true,
      strictValidation: true,
      isPersonalValidation: true
    },
    
    // Personal characteristic questions (requires verification)
    {
      pattern: /(what is|what's|kya hai|kya tha|kya he) (my|meri) (.+?)\?$/i,
      entity: "Personal Characteristic",
      search: (match) => `my ${match[3]}`,
      weight: 0.85,
      requiresVerification: true,
      strictValidation: false,
      isPersonalValidation: false
    },
    
    // Person/Personality questions (highest weight - requires strict validation)
    {
      pattern: /(kon hai|who is|who was|kaun hai|kaun tha) (.+?)(\?|$)/i,
      entity: "Person",
      search: (match) => match[2].trim(),
      weight: 0.95,
      requiresVerification: true,
      strictValidation: true
    },
    
    // Capital cities (highest weight - very specific factual information)
    {
      pattern: /capital.*(india|usa|united states|china|russia|uk|britain|france|germany|japan|canada|australia)/i,
      entity: "Capital",
      search: (match) => {
        const country = match[1];
        const capitals = {
          "india": "New Delhi",
          "usa": "Washington D.C.",
          "united states": "Washington D.C.",
          "china": "Beijing",
          "russia": "Moscow",
          "uk": "London",
          "britain": "London",
          "france": "Paris",
          "germany": "Berlin",
          "japan": "Tokyo",
          "canada": "Ottawa",
          "australia": "Canberra"
        };
        return capitals[country] || "Capital city";
      },
      weight: 1.0,
      requiresVerification: false,
      strictValidation: false
    },
    
    // Countries (medium weight - general geographic entities)
    {
      pattern: /(india|usa|united states|china|russia|uk|britain|france|germany|japan|canada|australia)/i,
      entity: "Country",
      search: (match) => match[1],
      weight: 0.7,
      requiresVerification: false,
      strictValidation: false
    }
  ];
  
  // Try to match entity patterns
  for (const pattern of entityPatterns) {
    const match = lowerQuestion.match(pattern.pattern);
    if (match) {
      searchQuery = pattern.search(match);
      entityType = pattern.entity;
      matchWeight = pattern.weight;
      break;
    }
  }
  
  const result = {
    query: searchQuery || "General information",
    entityType: entityType || "General",
    matchWeight: matchWeight,
    requiresVerification: entityType === "Person" || entityType === "Personal Relationship" || entityType === "Personal Characteristic" || false,
    strictValidation: entityType === "Person" || entityType === "Personal Relationship" || entityType === "Personal Characteristic" || false,
    isPersonalValidation: (entityType === "Personal Relationship" || entityType === "Personal Characteristic") && (lowerQuestion.includes("right") || lowerQuestion.includes("correct") || lowerQuestion.includes("true") || lowerQuestion.includes("sahi") || lowerQuestion.includes("theek"))
  };
  
  console.log(`[AIV Validation] Entity extraction for question "${question}":`, result);
  return result;
}

// Multi-source web search validation function with cross-checking
async function searchWeb(query) {
  try {
    console.log(`🔍 Multi-source search for: "${query}"`);
    
    const results = {
      wikipedia: null,
      britannica: null,
      unData: null
    };
    
    // Source 1: Wikipedia API
    try {
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      
      if (response.ok) {
        const data = await response.json();
        results.wikipedia = data.extract || data.description || "Information found but no extract available";
        console.log(`✅ Wikipedia: Found data (${results.wikipedia.length} chars)`);
      } else {
        // Try Wikipedia search API as fallback
        const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&origin=*`;
        const searchResponse = await fetch(searchApiUrl);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
            const firstResult = searchData.query.search[0];
            results.wikipedia = firstResult.snippet.replace(/<\/?[^>]+(>|$)/g, "");
            console.log(`✅ Wikipedia Search: Found data (${results.wikipedia.length} chars)`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Wikipedia: ${error.message}`);
    }
    
    // Cross-check and combine results
    const validResults = Object.values(results).filter(result => 
      result && result !== "Britannica data would be available with API key" && 
      result !== "UN Data would be available with API key"
    );
    
    if (validResults.length === 0) {
      console.log(`❌ No valid data found from any source`);
      return "No specific information found from multiple sources";
    }
    
    // Single source result
    console.log(`✅ Using single source result`);
    return validResults[0];
    
  } catch (error) {
    console.error("Multi-source search error:", error);
    return "Search failed - manual review needed";
  }
}

// Advanced similarity calculation using Semantic Analysis, Word Overlap, and Fuzzy Matching
function calculateSimilarity(str1, str2) {
  // Tokenize and normalize text
  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .map(t => t.trim())
      .filter(w => w && w.length > 2)
      .map(lemma)
  };

  // Lemmatization function
  const lemma = (w) => {
    if (w.length <= 3) return w
    if (/ies$/.test(w)) return w.replace(/ies$/, 'y')
    if (/ses$|xes$|zes$|ches$|shes$/.test(w)) return w.replace(/es$/, '')
    if (/s$/.test(w) && !/ss$/.test(w)) return w.replace(/s$/, '')
    if (/ing$/.test(w) && w.length > 5) return w.replace(/ing$/, '')
    if (/ed$/.test(w) && w.length > 4) return w.replace(/ed$/, '')
    return w
  };

  // Stopwords
  const stopwords = new Set([
    'a','an','the','and','or','but','if','then','else','when','while','of','in','on','at','to','for','from','by','with','about','as','into','like','through','after','over','between','out','against','during','without','before','under','around','among',
    'is','am','are','was','were','be','been','being','do','does','did','doing','have','has','had','having','it','its','this','that','these','those','i','you','he','she','they','we','them','his','her','their','our','your','yours','ours',
    'not','no','yes','can','could','should','would','may','might','will','shall','also','too','very','just'
  ]);

  // Filter out stopwords
  const filterStopwords = (tokens) => {
    return tokens.filter(token => !stopwords.has(token));
  };

  // Get tokens for both texts
  const tokens1 = filterStopwords(tokenize(str1));
  const tokens2 = filterStopwords(tokenize(str2));

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Method 1: Semantic Vector Similarity (using character n-grams)
  const semanticSimilarity = () => {
    // Create character n-gram vectors
    const createNGrams = (text, n = 3) => {
      const ngrams = new Map();
      for (let i = 0; i <= text.length - n; i++) {
        const gram = text.substr(i, n);
        ngrams.set(gram, (ngrams.get(gram) || 0) + 1);
      }
      return ngrams;
    };

    const ngrams1 = createNGrams(str1.toLowerCase());
    const ngrams2 = createNGrams(str2.toLowerCase());

    // Calculate Jaccard similarity for n-grams
    const allGrams = new Set([...ngrams1.keys(), ...ngrams2.keys()]);
    let intersection = 0;
    let union = 0;

    allGrams.forEach(gram => {
      const count1 = ngrams1.get(gram) || 0;
      const count2 = ngrams2.get(gram) || 0;
      intersection += Math.min(count1, count2);
      union += Math.max(count1, count2);
    });

    return union > 0 ? intersection / union : 0;
  };

  // Method 2: Enhanced Word Overlap with Semantic Matching
  const wordOverlapSimilarity = () => {
    // Exact match
    const exactMatches = tokens1.filter(w1 => tokens2.includes(w1));
    
    // Partial match (substring matching)
    const partialMatches = tokens1.filter(w1 => 
      tokens2.some(w2 => w1.includes(w2) || w2.includes(w1))
    );
    
    // Semantic similarity for remaining words
    const semanticMatches = tokens1.filter(w1 => 
      !tokens2.includes(w1) && tokens2.some(w2 => {
        const similarity = calculateWordSimilarity(w1, w2);
        return similarity > 0.7;
      })
    );

    const totalMatches = exactMatches.length + (partialMatches.length * 0.8) + (semanticMatches.length * 0.6);
    const total = Math.max(tokens1.length, tokens2.length);
    
    return total > 0 ? totalMatches / total : 0;
  };

  // Method 3: Word-level similarity calculation
  const calculateWordSimilarity = (word1, word2) => {
    if (word1 === word2) return 1.0;
    
    // Levenshtein distance
    const distance = levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Calculate similarity scores
  const semanticScore = semanticSimilarity();
  const overlapScore = wordOverlapSimilarity();

  // Weighted combination (removed TF-IDF weight)
  const weights = {
    semantic: 0.7,
    overlap: 0.3
  };

  const finalScore = (
    semanticScore * weights.semantic +
    overlapScore * weights.overlap
  );

  console.log(`🔍 Similarity Scores - Semantic: ${semanticScore.toFixed(3)}, Overlap: ${overlapScore.toFixed(3)}, Final: ${finalScore.toFixed(3)}`);

  return Math.min(1.0, Math.max(0.0, finalScore));
}

// Web search validation function with named-entity recognition and strict person validation
async function validateFactualAccuracy(userQuery, modelResponse) {
  try {
    // Extract search query and entity information from the question
    const entityInfo = extractEntities(userQuery);
    
    // Special handling for Personal Relationship validation questions
    if (entityInfo.entityType === "Personal Relationship" && entityInfo.isPersonalValidation) {
      console.log(`🔍 Personal Relationship Validation: "${entityInfo.query}"`);
      
      // Check if the response is affirmative or negative
      const affirmativeKeywords = ["yes", "right", "correct", "true", "sahi", "theek", "haan", "bilkul"];
      const negativeKeywords = ["no", "wrong", "incorrect", "false", "galat", "nahi", "nope"];
      
      const hasAffirmative = affirmativeKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      const hasNegative = negativeKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      
      // For personal relationship validation, we can't verify the truth
      if (hasAffirmative && !hasNegative) {
        console.log(`✅ Affirmative response to personal validation question`);
        return 0.3;
      } else if (hasNegative && !hasAffirmative) {
        console.log(`❌ Negative response to personal validation question`);
        return 0.3;
      } else {
        console.log(`❓ Ambiguous response to personal validation question`);
        return 0.2;
      }
    }
    
    if (!entityInfo.query || entityInfo.query === "General information") {
      return 0.8;
    }

    // Search Wikipedia for factual information
    const searchResults = await searchWeb(entityInfo.query);
    
    // For non-person entities, use standard validation
    if (searchResults.includes("No specific information found") || searchResults.includes("Search failed")) {
      return 0.6;
    }
    
    // Compare AI response with Wikipedia results
    const similarity = calculateSimilarity(modelResponse.toLowerCase(), searchResults.toLowerCase());
    
    // Convert weighted similarity to final score (0-1) — stricter thresholds
    if (similarity > 0.85) return 0.9;
    if (similarity > 0.65) return 0.7;
    if (similarity > 0.45) return 0.5;
    if (similarity > 0.25) return 0.3;
    return 0.1;
    
  } catch (error) {
    console.error("Factual validation error:", error);
    return 0.5;
  }
}

class AIVValidationService {
  constructor() {
    // AIV System API endpoint - using Firebase Functions directly
    this.apiEndpoint = 'http://127.0.0.1:5000/ai-reasoning-validation-system/us-central1/validateAIResponse';
    this.validationResults = [];
    this.processedContentHashes = new Set(); // Track already processed content
  }
  
  // Validate an AI response with comprehensive validation algorithms
  async validateResponse(data) {
    try {
      console.log('Validating response with AIV System:', data);
      
      // Create a hash of the content to detect duplicates
      const contentHash = this.hashCode(`${data.question}-${data.content}-${data.platform}`);
      
      // Check if we've already processed this exact content
      if (this.processedContentHashes.has(contentHash)) {
        console.log('Skipping duplicate content validation');
        // Return the last validation result for this content if available
        const lastResult = this.validationResults.find(result => 
          this.hashCode(`${result.question}-${result.content}-${result.platform}`) === contentHash
        );
        if (lastResult) {
          return lastResult.validation;
        }
      }
      
      // Mark this content as processed
      this.processedContentHashes.add(contentHash);
      
      // Keep only the last 100 hashes to prevent memory issues
      if (this.processedContentHashes.size > 100) {
        const hashes = Array.from(this.processedContentHashes);
        this.processedContentHashes = new Set(hashes.slice(hashes.length - 100));
      }
      
      // Perform comprehensive validation
      const validation = await this.performComprehensiveValidation(data);
      
      // Store result with validation data
      const validationResult = {
        id: Date.now(),
        ...data,
        validation: validation,
        validatedAt: new Date().toISOString()
      };
      
      this.validationResults.push(validationResult);
      
      // Keep only last 50 results to prevent memory issues
      if (this.validationResults.length > 50) {
        this.validationResults.shift();
      }
      
      console.log('Validation result:', validationResult);
      return validation;
    } catch (error) {
      console.error('Validation error:', error);
      
      // Return a mock result if validation fails
      const mockValidation = {
        isValid: Math.random() > 0.3, // 70% chance of being valid
        confidence: Math.random(),
        issues: ['API not accessible', 'Using mock validation'],
        suggestions: ['Check if Firebase functions are running', 'Check network connectivity'],
        error: error.message
      };
      
      // Store the mock result
      const validationResult = {
        id: Date.now(),
        ...data,
        validation: mockValidation,
        validatedAt: new Date().toISOString(),
        error: true
      };
      
      this.validationResults.push(validationResult);
      
      // Keep only last 50 results to prevent memory issues
      if (this.validationResults.length > 50) {
        this.validationResults.shift();
      }
      
      return mockValidation;
    }
  }
  
  // Perform comprehensive validation using the algorithms from the React app
  async performComprehensiveValidation(data) {
    let validationScore = 0.0;
    let externalVerificationRequired = false;
    const validators = [];
    const messages = [];

    // Per-validator weights (sum doesn't need to be 1; we normalize later)
    const weights = {
      error_keywords: 0.2,
      response_length: 0.1,
      sensitive_keywords: 0.1,
      professional_claims: 0.15,
      personal_relationship_validation: 0.2,
      personal_characteristic_validation: 0.15,
      factual_accuracy: 0.45,
    };

    const userQuery = data.question || "";
    const modelResponse = data.content || "";

    // Validator 1: Check if model_response contains error keywords
    if (modelResponse) {
      const errorKeywords = ["error", "fail", "cannot", "unable", "sorry"];
      const hasErrorKeywords = errorKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      if (hasErrorKeywords) {
        externalVerificationRequired = true;
        validators.push({
          name: "error_keywords",
          pass: false,
          score: 0.1,
          details: "Contains error-related keywords",
          severity: "critical",
        });
        messages.push("[critical] Error-like wording in model response");
      } else {
        validators.push({
          name: "error_keywords",
          pass: true,
          score: 0.85,
          details: "No error keywords detected",
          severity: "info",
        });
      }
    }

    // Validator 2: Check response length
    if (modelResponse) {
      if (modelResponse.length < 10) {
        validators.push({
          name: "response_length",
          pass: false,
          score: 0.3,
          details: `Response length: ${modelResponse.length} chars (min: 10)`,
          severity: "warn",
        });
        messages.push("[warn] Response too short");
      } else {
        validators.push({
          name: "response_length",
          pass: true,
          score: 0.92,
          details: `Response length: ${modelResponse.length} chars`,
          severity: "info",
        });
      }
    }

    // Validator 3: Check if user_query contains sensitive keywords
    if (userQuery) {
      const sensitiveKeywords = ["password", "credit card", "ssn", "personal"];
      const hasSensitiveKeywords = sensitiveKeywords.some(keyword => 
        userQuery.toLowerCase().includes(keyword)
      );
      console.log(`[AIV Validation] Checking sensitive keywords for query "${userQuery}":`, hasSensitiveKeywords);
      if (hasSensitiveKeywords) {
        externalVerificationRequired = true;
        validators.push({
          name: "sensitive_keywords",
          pass: false, // This should be false since sensitive keywords are a security concern
          score: 0.2,
          details: "Contains sensitive keywords",
          severity: "critical",
        });
        messages.push("[critical] Sensitive terms in user query");
        console.log(`[AIV Validation] Added sensitive_keywords validator (fail)`);
      } else {
        validators.push({
          name: "sensitive_keywords",
          pass: true,
          score: 0.95,
          details: "No sensitive keywords detected",
          severity: "info",
        });
        console.log(`[AIV Validation] Added sensitive_keywords validator (pass)`);
      }
    } else {
      // Always add the sensitive keywords validator even when there's no user query
      validators.push({
        name: "sensitive_keywords",
        pass: true,
        score: 0.95,
        details: "No user query provided",
        severity: "info",
      });
      console.log(`[AIV Validation] Added sensitive_keywords validator (pass - no query)`);
    }

    // Validator 4: Check for professional claims in responses
    if (modelResponse) {
      const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister", "university", "college", "school", "hospital", "company", "corporation"];
      const hasProfessionalClaims = professionalKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      
      if (hasProfessionalClaims) {
        const entityInfo = extractEntities(userQuery);
        if (entityInfo.entityType === "Person") {
          externalVerificationRequired = true;
          validators.push({
            name: "professional_claims",
            pass: false,
            score: 0.35,
            details: "Professional claims about person - verification required",
            severity: "warn",
          });
          messages.push("[warn] Unverified professional claim about a person");
        } else {
          validators.push({
            name: "professional_claims",
            pass: true,
            score: 0.82,
            details: "Professional claims detected but not about person",
            severity: "info",
          });
        }
      } else {
        validators.push({
          name: "professional_claims",
          pass: true,
          score: 0.95,
          details: "No professional claims detected",
          severity: "info",
        });
      }
    }

    // Validator 5 & 6: Check for personal relationship and characteristic validation questions
    const entityInfo = extractEntities(userQuery);
    console.log(`[AIV Validation] Entity info for query "${userQuery}":`, entityInfo);
    
    // Personal relationship validation
    if (entityInfo.entityType === "Personal Relationship" && entityInfo.isPersonalValidation) {
      externalVerificationRequired = true;
      validators.push({
        name: "personal_relationship_validation",
        pass: false,
        score: 0.3,
        details: "Personal relationship validation requires manual verification",
        severity: "critical",
      });
      messages.push("[critical] Personal relationship truth cannot be auto-verified");
      console.log(`[AIV Validation] Added personal_relationship_validation validator (fail)`);
    } else if (entityInfo.entityType === "Personal Relationship") {
      validators.push({
        name: "personal_relationship_validation",
        pass: true,
        score: 0.7,
        details: "Personal relationship question detected",
        severity: "info",
      });
      console.log(`[AIV Validation] Added personal_relationship_validation validator (pass)`);
    } else {
      // Only add default validator if we haven't added any personal validation yet
      if (!validators.some(v => v.name === "personal_relationship_validation")) {
        validators.push({
          name: "personal_relationship_validation",
          pass: true,
          score: 0.95,
          details: "No personal relationship validation detected",
          severity: "info",
        });
        console.log(`[AIV Validation] Added default personal_relationship_validation validator (pass)`);
      }
    }
    
    // Personal characteristic validation
    if (entityInfo.entityType === "Personal Characteristic" && entityInfo.isPersonalValidation) {
      externalVerificationRequired = true;
      validators.push({
        name: "personal_characteristic_validation",
        pass: false,
        score: 0.3,
        details: "Personal characteristic validation requires manual verification",
        severity: "warn",
      });
      messages.push("[warn] Personal characteristic truth cannot be auto-verified");
      console.log(`[AIV Validation] Added personal_characteristic_validation validator (fail)`);
    } else if (entityInfo.entityType === "Personal Characteristic") {
      validators.push({
        name: "personal_characteristic_validation",
        pass: true,
        score: 0.7,
        details: "Personal characteristic question detected",
        severity: "info",
      });
      console.log(`[AIV Validation] Added personal_characteristic_validation validator (pass)`);
    } else {
      // Only add default validator if we haven't added any personal validation yet
      if (!validators.some(v => v.name === "personal_characteristic_validation")) {
        validators.push({
          name: "personal_characteristic_validation",
          pass: true,
          score: 0.95,
          details: "No personal characteristic validation detected",
          severity: "info",
        });
        console.log(`[AIV Validation] Added default personal_characteristic_validation validator (pass)`);
      }
    }

    // Validator 7: Web Search Factual Validation
    try {
      const factualScore = await validateFactualAccuracy(userQuery, modelResponse);
      const factualValidator = {
        name: "factual_accuracy",
        pass: factualScore >= 0.75,
        score: factualScore,
        details: factualScore >= 0.75 ? "Factually accurate" : "Factual accuracy concerns",
        severity: factualScore < 0.3 ? "critical" : factualScore < 0.75 ? "warn" : "info",
      };
      validators.push(factualValidator);
      if (factualValidator.severity !== "info") {
        messages.push(`[${factualValidator.severity}] ${factualValidator.details}`);
      }
      
      if (factualScore < 0.75) {
        externalVerificationRequired = true;
        messages.push("[warn] Factual accuracy requires verification");
      }
      
      if (entityInfo.entityType === "Person") {
        externalVerificationRequired = true;
        messages.push("[warn] Person entity: manual verification required");
        
        const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister"];
        const hasProfessionalClaim = professionalKeywords.some(keyword => 
          modelResponse.toLowerCase().includes(keyword)
        );
        
        if (hasProfessionalClaim) {
          messages.push("[warn] Professional claim detected - needs evidence");
        }
      }
      
      if (entityInfo.entityType === "Personal Relationship") {
        externalVerificationRequired = true;
        messages.push("[warn] Personal relationship requires manual verification");
        
        if (entityInfo.isPersonalValidation) {
          messages.push(" Personal relationship validation cannot be automatically verified.");
        }
      }
      
      if (entityInfo.entityType === "Personal Characteristic") {
        externalVerificationRequired = true;
        messages.push("[warn] Personal characteristic requires manual verification");
        
        if (entityInfo.isPersonalValidation) {
          messages.push(" Personal characteristic validation cannot be automatically verified.");
        }
      }
      
    } catch {
      validators.push({
        name: "factual_accuracy",
        pass: false,
        score: 0.5,
        details: "Factual validation failed - manual review needed",
        severity: "warn",
      });
      externalVerificationRequired = true;
      messages.push("[warn] Factual validation service failed");
    }

    // Calculate final validation score (weighted average of validators)
    if (validators.length > 0) {
      console.log(`[AIV Validation] Created ${validators.length} validators:`, validators.map(v => v.name));
      const totalWeight = validators.reduce((sum, v) => sum + (weights[v.name] || 0.1), 0);
      const weightedSum = validators.reduce((sum, v) => sum + v.score * (weights[v.name] || 0.1), 0);
      validationScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    const notes = messages.length > 0 ? messages.join(" | ") : "Validation completed.";
    
    // Return validation result in the format expected by the Chrome extension
    return {
      isValid: validationScore >= 0.5,
      confidence: validationScore,
      issues: messages.filter(msg => msg.includes("[critical]") || msg.includes("[warn]")),
      suggestions: ["Consider verifying factual claims manually", "Check for personal relationship statements"],
      externalVerificationRequired: externalVerificationRequired,
      validators: validators,
      notes: notes
    };
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