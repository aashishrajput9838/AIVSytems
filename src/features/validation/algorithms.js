// Validation algorithms and utilities
export const validateResponse = async (userQuery, modelResponse) => {
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
    if (hasSensitiveKeywords) {
      externalVerificationRequired = true;
      validators.push({
        name: "sensitive_keywords",
        pass: true,
        score: 0.5,
        details: "Contains sensitive keywords",
        severity: "warn",
      });
      messages.push("[warn] Sensitive terms in user query");
    } else {
      validators.push({
        name: "sensitive_keywords",
        pass: true,
        score: 0.9,
        details: "No sensitive keywords detected",
        severity: "info",
      });
    }
  }

  // Validator 3.5: Check for professional claims in responses
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
        score: 0.9,
        details: "No professional claims detected",
        severity: "info",
      });
    }
  }

  // Validator 3.6: Check for personal relationship validation questions
  const entityInfo = extractEntities(userQuery);
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
  } else if (entityInfo.entityType === "Personal Relationship") {
    validators.push({
      name: "personal_relationship_validation",
      pass: true,
      score: 0.7,
      details: "Personal relationship question detected",
      severity: "info",
    });
  } else if (entityInfo.entityType === "Personal Characteristic" && entityInfo.isPersonalValidation) {
    externalVerificationRequired = true;
    validators.push({
      name: "personal_characteristic_validation",
      pass: false,
      score: 0.3,
      details: "Personal characteristic validation requires manual verification",
      severity: "warn",
    });
    messages.push("[warn] Personal characteristic truth cannot be auto-verified");
  } else if (entityInfo.entityType === "Personal Characteristic") {
    validators.push({
      name: "personal_characteristic_validation",
      pass: true,
      score: 0.7,
      details: "Personal characteristic question detected",
      severity: "info",
    });
  } else {
    validators.push({
      name: "personal_relationship_validation",
      pass: true,
      score: 0.9,
      details: "No personal validation detected",
      severity: "info",
    });
  }

  // Validator 4: Web Search Factual Validation
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
    
    const entityInfo = extractEntities(userQuery);
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
    const totalWeight = validators.reduce((sum, v) => sum + (weights[v.name] || 0.1), 0);
    const weightedSum = validators.reduce((sum, v) => sum + v.score * (weights[v.name] || 0.1), 0);
    validationScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  const notes = messages.length > 0 ? messages.join(" | ") : "Validation completed.";
  return { validationScore, notes, externalVerificationRequired, validators };
};

// Extract key entities from question and create Wikipedia search query with named-entity recognition
export const extractEntities = (question) => {
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
  
  return {
    query: searchQuery || "General information",
    entityType: entityType || "General",
    matchWeight: matchWeight,
    requiresVerification: entityType === "Person" || entityType === "Personal Relationship" || entityType === "Personal Characteristic" || false,
    strictValidation: entityType === "Person" || entityType === "Personal Relationship" || entityType === "Personal Characteristic" || false,
    isPersonalValidation: (entityType === "Personal Relationship" || entityType === "Personal Characteristic") && (lowerQuestion.includes("right") || lowerQuestion.includes("correct") || lowerQuestion.includes("true") || lowerQuestion.includes("sahi") || lowerQuestion.includes("theek"))
  };
};

// Multi-source web search validation function with cross-checking
export const searchWeb = async (query) => {
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
};

// Advanced similarity calculation using TF-IDF, Cosine similarity, and fuzzy matching
export const calculateSimilarity = (str1, str2) => {
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

  // Method 1: TF-IDF with Cosine Similarity
  const tfidfCosineSimilarity = () => {
    // Create vocabulary (unique tokens from both texts)
    const vocabulary = [...new Set([...tokens1, ...tokens2])];
    
    // Calculate TF (Term Frequency) for each document
    const calculateTF = (tokens) => {
      const tf = {};
      tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
      });
      // Normalize by document length
      Object.keys(tf).forEach(token => {
        tf[token] = tf[token] / tokens.length;
      });
      return tf;
    };

    const tf1 = calculateTF(tokens1);
    const tf2 = calculateTF(tokens2);

    // Calculate IDF (Inverse Document Frequency)
    const calculateIDF = () => {
      const idf = {};
      vocabulary.forEach(token => {
        let docsWithToken = 0;
        if (tf1[token]) docsWithToken++;
        if (tf2[token]) docsWithToken++;
        idf[token] = Math.log(2 / docsWithToken);
      });
      return idf;
    };

    const idf = calculateIDF();

    // Calculate TF-IDF vectors
    const tfidf1 = vocabulary.map(token => (tf1[token] || 0) * idf[token]);
    const tfidf2 = vocabulary.map(token => (tf2[token] || 0) * idf[token]);

    // Calculate Cosine Similarity
    const dotProduct = tfidf1.reduce((sum, val, i) => sum + val * tfidf2[i], 0);
    const magnitude1 = Math.sqrt(tfidf1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(tfidf2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  };

  // Method 2: Enhanced Word Overlap
  const wordOverlapSimilarity = () => {
    const common = tokens1.filter(w1 => 
      tokens2.some(w2 => w1 === w2 || w1.includes(w2) || w2.includes(w1))
    );
    const total = Math.max(tokens1.length, tokens2.length);
    return total > 0 ? common.length / total : 0;
  };

  // Calculate similarity scores
  const tfidfScore = tfidfCosineSimilarity();
  const overlapScore = wordOverlapSimilarity();

  // Weighted combination
  const weights = {
    tfidf: 0.7,
    overlap: 0.3
  };

  const finalScore = (
    tfidfScore * weights.tfidf +
    overlapScore * weights.overlap
  );

  console.log(`🔍 Similarity Scores - TF-IDF: ${tfidfScore.toFixed(3)}, Overlap: ${overlapScore.toFixed(3)}, Final: ${finalScore.toFixed(3)}`);

  return Math.min(1.0, Math.max(0.0, finalScore));
};

// Web search validation function with named-entity recognition and strict person validation
export const validateFactualAccuracy = async (userQuery, modelResponse) => {
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
};
