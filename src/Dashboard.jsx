import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search, Plus, MessageSquare, FileText } from "lucide-react";
import { getLogs, approveLogById, rejectLogById, addLog } from "@/lib/api";
import { useAuth } from "@/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Add Log form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState({
    user_query: "",
    model_response: "",
    validation_score: 0,
    external_verification_required: false,
    notes: "",
    status: "pending"
  });

  // ChatGPT Mode state
  const [showChatGPTMode, setShowChatGPTMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getLogs();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load logs");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.user_query.toLowerCase().includes(search.toLowerCase()) ||
      log.model_response.toLowerCase().includes(search.toLowerCase())
  );

  const formatTimestamp = (ts) => {
    if (!ts) return "-"
    if (typeof ts === 'string') return ts
    if (ts?.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString()
    }
    try {
      const d = new Date(ts)
      if (!Number.isNaN(d.getTime())) return d.toLocaleString()
    } catch (_) {}
    return String(ts)
  }

  // Validation logic (same as Cloud Functions would do)
  const validateResponse = async (userQuery, modelResponse) => {
    let validationScore = 0.0;
    let notes = "Validation completed.";
    let externalVerificationRequired = false;
    const validators = [];

    // Validator 1: Check if model_response contains error keywords
    if (modelResponse) {
      const errorKeywords = ["error", "fail", "cannot", "unable", "sorry"];
      const hasErrorKeywords = errorKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      if (hasErrorKeywords) {
        validationScore = Math.max(validationScore, 0.1);
        notes = "Model response contains error keywords.";
        externalVerificationRequired = true;
        validators.push({
          name: "error_keywords",
          pass: false,
          score: 0.1,
          details: "Contains error-related keywords"
        });
      } else {
        validators.push({
          name: "error_keywords",
          pass: true,
          score: 0.8,
          details: "No error keywords detected"
        });
      }
    }

    // Validator 2: Check response length
    if (modelResponse) {
      if (modelResponse.length < 10) {
        validationScore = Math.max(validationScore, 0.3);
        notes = "Model response is too short.";
        validators.push({
          name: "response_length",
          pass: false,
          score: 0.3,
          details: `Response length: ${modelResponse.length} chars (min: 10)`
        });
      } else {
        validators.push({
          name: "response_length",
          pass: true,
          score: 0.9,
          details: `Response length: ${modelResponse.length} chars`
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
        validationScore = Math.min(validationScore, 0.5);
        notes += " User query contains sensitive keywords.";
        externalVerificationRequired = true;
        validators.push({
          name: "sensitive_keywords",
          pass: true,
          score: 0.5,
          details: "Contains sensitive keywords"
        });
      } else {
        validators.push({
          name: "sensitive_keywords",
          pass: true,
          score: 0.9,
          details: "No sensitive keywords detected"
        });
      }
    }

    // Validator 3.5: Check for professional claims in responses (new validator)
    if (modelResponse) {
      const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister", "university", "college", "school", "hospital", "company", "corporation"];
      const hasProfessionalClaims = professionalKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      
      if (hasProfessionalClaims) {
        // Check if this is about a person entity
        const entityInfo = extractEntities(userQuery);
        if (entityInfo.entityType === "Person") {
          validationScore = Math.min(validationScore, 0.4);
          notes += " Professional claims about person require verification.";
          externalVerificationRequired = true;
          validators.push({
            name: "professional_claims",
            pass: false,
            score: 0.4,
            details: "Professional claims about person - verification required"
          });
        } else {
          validators.push({
            name: "professional_claims",
            pass: true,
            score: 0.8,
            details: "Professional claims detected but not about person"
          });
        }
      } else {
        validators.push({
          name: "professional_claims",
          pass: true,
          score: 0.9,
          details: "No professional claims detected"
        });
      }
    }

    // Validator 3.6: Check for personal relationship validation questions (new validator)
    const entityInfo = extractEntities(userQuery);
    if (entityInfo.entityType === "Personal Relationship" && entityInfo.isPersonalValidation) {
      console.log(`🔍 Personal Relationship Validation Detected: "${userQuery}"`);
      
      // For personal relationship validation, we can't verify the truth
      // But we should flag these for manual review
      validationScore = Math.min(validationScore, 0.3);
      notes += " Personal relationship validation - cannot be automatically verified.";
      externalVerificationRequired = true;
      validators.push({
        name: "personal_relationship_validation",
        pass: false,
        score: 0.3,
        details: "Personal relationship validation requires manual verification"
      });
    } else if (entityInfo.entityType === "Personal Relationship") {
      validators.push({
        name: "personal_relationship_validation",
        pass: true,
        score: 0.7,
        details: "Personal relationship question detected"
      });
    } else {
      validators.push({
        name: "personal_relationship_validation",
        pass: true,
        score: 0.9,
        details: "No personal relationship validation detected"
      });
    }

    // Validator 4: Web Search Factual Validation
    try {
      const factualScore = await validateFactualAccuracy(userQuery, modelResponse);
      validators.push({
        name: "factual_accuracy",
        pass: factualScore >= 0.7,
        score: factualScore,
        details: factualScore >= 0.7 ? "Factually accurate" : "Factual accuracy concerns"
      });
      
      // If factual score is low, require external verification
      if (factualScore < 0.7) {
        externalVerificationRequired = true;
        notes += " Factual accuracy requires verification.";
      }
      
      // Special handling for Person entities - always require verification
      const entityInfo = extractEntities(userQuery);
      if (entityInfo.entityType === "Person") {
        externalVerificationRequired = true;
        notes += " Person entity requires manual verification.";
        
        // Check for professional claims that need extra scrutiny
        const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister"];
        const hasProfessionalClaim = professionalKeywords.some(keyword => 
          modelResponse.toLowerCase().includes(keyword)
        );
        
        if (hasProfessionalClaim) {
          notes += " Professional claim detected - requires evidence verification.";
        }
      }
      
      // Special handling for Personal Relationship entities - always require verification
      if (entityInfo.entityType === "Personal Relationship") {
        externalVerificationRequired = true;
        notes += " Personal relationship requires manual verification.";
        
        if (entityInfo.isPersonalValidation) {
          notes += " Personal relationship validation cannot be automatically verified.";
        }
      }
      
    } catch (error) {
      validators.push({
        name: "factual_accuracy",
        pass: false,
        score: 0.5,
        details: "Factual validation failed - manual review needed"
      });
      externalVerificationRequired = true;
    }

    // Calculate final validation score (average of all validators)
    if (validators.length > 0) {
      const totalScore = validators.reduce((sum, validator) => sum + validator.score, 0);
      validationScore = totalScore / validators.length;
    }

    return { validationScore, notes, externalVerificationRequired, validators };
  };

  // Web search validation function with named-entity recognition and strict person validation
  const validateFactualAccuracy = async (userQuery, modelResponse) => {
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
        // But we can check if the response is appropriate for the question type
        if (hasAffirmative && !hasNegative) {
          console.log(`✅ Affirmative response to personal validation question`);
          return 0.3; // Low score because we can't verify personal relationships
        } else if (hasNegative && !hasAffirmative) {
          console.log(`❌ Negative response to personal validation question`);
          return 0.3; // Low score because we can't verify personal relationships
        } else {
          console.log(`❓ Ambiguous response to personal validation question`);
          return 0.2; // Very low score for unclear responses
        }
      }
      
      // Special handling for Person entities (strict validation)
      if (entityInfo.entityType === "Person") {
        console.log(`🔍 Strict Person Validation: "${entityInfo.query}"`);
        
        // Check if Wikipedia found the person
        if (searchResults.includes("No specific information found") || searchResults.includes("Search failed")) {
          console.log(`❌ Unknown Person: "${entityInfo.query}" - No Wikipedia data found`);
          
          // Check for professional claims in the response
          const professionalKeywords = ["teacher", "professor", "doctor", "engineer", "lawyer", "manager", "director", "ceo", "president", "minister"];
          const hasProfessionalClaim = professionalKeywords.some(keyword => 
            modelResponse.toLowerCase().includes(keyword)
          );
          
          if (hasProfessionalClaim) {
            console.log(`⚠️ Professional Claim Detected: "${modelResponse}" - Requires verification`);
            return 0.2; // Very low score for unverified professional claims about unknown persons
          }
          
          return 0.3; // Low score for unknown persons without professional claims
        }
        
        // If Wikipedia found the person, apply strict similarity checking
        const similarity = calculateSimilarity(modelResponse.toLowerCase(), searchResults.toLowerCase());
        
        // For known persons, require higher similarity threshold
        if (similarity < 0.5) {
          console.log(`⚠️ Low Similarity for Known Person: ${similarity.toFixed(2)} - Response may be inaccurate`);
          return 0.3; // Penalize low similarity for known persons
        }
        
        return Math.min(0.9, similarity * 1.1); // Boost good matches slightly
      }
      
      if (!entityInfo.query || entityInfo.query === "General information") {
        return 0.8; // Neutral score if no clear entities
      }

      // Search Wikipedia for factual information
      const searchResults = await searchWeb(entityInfo.query);
      
      // For non-person entities, use standard validation
      if (searchResults.includes("No specific information found") || searchResults.includes("Search failed")) {
        return 0.6; // Neutral score if search fails
      }
      
      // Compare AI response with Wikipedia results
      const similarity = calculateSimilarity(modelResponse.toLowerCase(), searchResults.toLowerCase());
      
      // Apply entity-specific weighting for more accurate scoring
      let weightedScore = similarity;
      
      // Boost score for high-confidence entities (capitals, political leaders, landmarks)
      if (entityInfo.matchWeight > 0.8) {
        weightedScore = Math.min(1.0, similarity * 1.2); // Boost by 20% for high-confidence entities
        console.log(`High-confidence entity detected: ${entityInfo.entityType} - boosting score from ${similarity.toFixed(2)} to ${weightedScore.toFixed(2)}`);
      }
      
      // Penalize low scores for high-confidence entities more severely
      if (entityInfo.matchWeight > 0.8 && similarity < 0.3) {
        weightedScore = similarity * 0.7; // Additional penalty for factual errors in high-confidence areas
        console.log(`Factual error in high-confidence area: ${entityInfo.entityType} - applying penalty: ${weightedScore.toFixed(2)}`);
      }
      
      // Convert weighted similarity to final score (0-1)
      if (weightedScore > 0.8) return 0.9;      // Very similar
      if (weightedScore > 0.6) return 0.7;      // Somewhat similar  
      if (weightedScore > 0.4) return 0.5;      // Partially similar
      if (weightedScore > 0.2) return 0.3;      // Low similarity
      return 0.1;                                // Very different
      
    } catch (error) {
      console.error("Factual validation error:", error);
      return 0.5; // Neutral score on error
    }
  };

  // Extract key entities from question and create Wikipedia search query with named-entity recognition
  const extractEntities = (question) => {
    const lowerQuestion = question.toLowerCase();
    let searchQuery = "";
    let entityType = "";
    let matchWeight = 1.0; // Default weight
    
    // Named-entity recognition patterns with weights
    const entityPatterns = [
      // Personal relationship validation questions (highest priority - requires personal verification)
      {
        pattern: /(.+?) (meri|my) (pahle|pehle|first|previous|old)?\s*(friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (ki|is|the|thi|tha|thein) (.+?) (hai|is|the|thi|tha|thein)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement|galat|wrong|false) (or not|ya nahi|ya galat)?\??/i,
        entity: "Personal Relationship",
        search: (match) => `${match[1]} ${match[4]} ${match[6]}`,
        weight: 0.98, // Very high weight for personal relationship validation
        requiresVerification: true, // Always flag for manual review
        strictValidation: true, // Apply strict validation rules
        isPersonalValidation: true // Flag for personal validation logic
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
      
      // Flexible personal relationship validation (catches "new roommate", "old friend", etc.)
      {
        pattern: /(.+?) (meri|my) (.+?) (friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (hai|is)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek)\??/i,
        entity: "Personal Relationship",
        search: (match) => `${match[1]} ${match[3]} ${match[4]}`,
        weight: 0.95,
        requiresVerification: true,
        strictValidation: true,
        isPersonalValidation: true
      },
      
      // Personal relationship questions (high priority)
      {
        pattern: /(.+?) (meri|my) (friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (hai|is)\??/i,
        entity: "Personal Relationship",
        search: (match) => `${match[1]} ${match[3]}`,
        weight: 0.95,
        requiresVerification: true,
        strictValidation: true,
        isPersonalValidation: false
      },
      
      // Person/Personality questions (highest weight - requires strict validation)
      {
        pattern: /(kon hai|who is|who was|kaun hai|kaun tha) (.+?)(\?|$)/i,
        entity: "Person",
        search: (match) => match[2].trim(),
        weight: 0.95, // Very high weight for person validation
        requiresVerification: true, // Always flag for manual review
        strictValidation: true // Apply stricter validation rules
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
      
      // Prime Ministers/Presidents (high weight - specific political figures)
      {
        pattern: /(prime minister|pm).*(india|usa|united states|uk|britain)/i,
        entity: "Political Leader",
        search: (match) => {
          const role = match[1];
          const country = match[2];
          if (role.includes("prime minister") || role.includes("pm")) {
            if (country === "india") return "Prime Minister of India";
            if (country === "uk" || country === "britain") return "Prime Minister of the United Kingdom";
          }
          return `${role} ${country}`;
        },
        weight: 0.9,
        requiresVerification: false,
        strictValidation: false
      },
      
      // Presidents (high weight - specific political figures)
      {
        pattern: /president.*(india|usa|united states|china|russia|france|germany)/i,
        entity: "Political Leader",
        search: (match) => {
          const country = match[1];
          return `President of ${country}`;
        },
        weight: 0.9,
        requiresVerification: false,
        strictValidation: false
      },
      
      // Famous landmarks (high weight - specific locations)
      {
        pattern: /(taj mahal|mount everest|ganges|eiffel tower|great wall|statue of liberty|big ben)/i,
        entity: "Landmark",
        search: (match) => match[1],
        weight: 0.9,
        requiresVerification: false,
        strictValidation: false
      },
      
      // Historical events (medium-high weight - specific dates/facts)
      {
        pattern: /(independence day|republic day|world war|revolution|freedom|liberation)/i,
        entity: "Historical Event",
        search: (match) => {
          const event = match[1];
          if (event.includes("independence") && lowerQuestion.includes("india")) {
            return "Independence Day India";
          }
          if (event.includes("republic") && lowerQuestion.includes("india")) {
            return "Republic Day India";
          }
          return event;
        },
        weight: 0.8,
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
      },
      
      // Major cities (medium weight - specific urban areas)
      {
        pattern: /(delhi|mumbai|bangalore|new york|london|paris|tokyo|beijing|moscow)/i,
        entity: "City",
        search: (match) => match[1],
        weight: 0.7,
        requiresVerification: false,
        strictValidation: false
      },
      
      // Scientific concepts (medium weight - technical terms)
      {
        pattern: /(quantum|gravity|evolution|dna|atoms|molecules|photosynthesis)/i,
        entity: "Scientific Concept",
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
        console.log(`Named-entity match (${entityType} = "${searchQuery}" match weight ${matchWeight > 0.8 ? 'zyada' : 'normal'}${pattern.requiresVerification ? ' - REQUIRES VERIFICATION' : ''}${pattern.isPersonalValidation ? ' - PERSONAL VALIDATION' : ''})`);
        break;
      }
    }
    
    // If no specific pattern found, try to extract key terms
    if (!searchQuery) {
      const keyTerms = [];
      const specificEntities = ["india", "usa", "china", "russia", "uk", "france", "germany", "delhi", "mumbai", "bangalore"];
      specificEntities.forEach(entity => {
        if (lowerQuestion.includes(entity)) {
          keyTerms.push(entity);
        }
      });
      
      if (keyTerms.length > 0) {
        searchQuery = keyTerms.join(" ");
        entityType = "General Entity";
        matchWeight = 0.6;
      }
    }
    
    return {
      query: searchQuery || "General information",
      entityType: entityType || "General",
      matchWeight: matchWeight,
      requiresVerification: entityType === "Person" || entityType === "Personal Relationship" || false,
      strictValidation: entityType === "Person" || entityType === "Personal Relationship" || false,
      isPersonalValidation: entityType === "Personal Relationship" && lowerQuestion.includes("right") || lowerQuestion.includes("correct") || lowerQuestion.includes("true") || lowerQuestion.includes("sahi") || lowerQuestion.includes("theek")
    };
  };

  // Wikipedia API search function
  const searchWeb = async (query) => {
    try {
      // Wikipedia API endpoint
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        // If direct page not found, try search API
        const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&origin=*`;
        const searchResponse = await fetch(searchApiUrl);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
            const firstResult = searchData.query.search[0];
            return firstResult.snippet.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
          }
        }
        
        return "No specific information found";
      }
      
      const data = await response.json();
      
      if (data.extract) {
        return data.extract;
      } else if (data.description) {
        return data.description;
      } else {
        return "Information found but no extract available";
      }
      
    } catch (error) {
      console.error("Wikipedia API error:", error);
      return "Search failed - manual review needed";
    }
  };

  // Calculate similarity between two strings (stopword-aware + simple lemmatization)
  const calculateSimilarity = (str1, str2) => {
    const stopwords = new Set([
      'a','an','the','and','or','but','if','then','else','when','while','of','in','on','at','to','for','from','by','with','about','as','into','like','through','after','over','between','out','against','during','without','before','under','around','among',
      'is','am','are','was','were','be','been','being','do','does','did','doing','have','has','had','having','it','its','this','that','these','those','i','you','he','she','they','we','them','his','her','their','our','your','yours','ours',
      'not','no','yes','can','could','should','would','may','might','will','shall','also','too','very','just'
    ])

    const lemma = (w) => {
      // basic lemmatization/stemming for common English endings
      if (w.length <= 3) return w
      // plurals
      if (/ies$/.test(w)) return w.replace(/ies$/, 'y') // cities -> city
      if (/ses$|xes$|zes$|ches$|shes$/.test(w)) return w.replace(/es$/, '') // classes -> class
      if (/s$/.test(w) && !/ss$/.test(w)) return w.replace(/s$/, '') // languages -> language
      // past/gerund
      if (/ing$/.test(w) && w.length > 5) return w.replace(/ing$/, '') // running -> runn (approx)
      if (/ed$/.test(w) && w.length > 4) return w.replace(/ed$/, '') // worked -> work
      return w
    }

    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .map(t => t.trim())
        .filter(w => w && !stopwords.has(w) && w.length > 2)
        .map(lemma)

    const words1 = Array.from(new Set(normalize(str1)))
    const words2 = Array.from(new Set(normalize(str2)))

    if (words1.length === 0 || words2.length === 0) return 0

    const common = words1.filter(w1 => words2.some(w2 => w1 === w2 || w1.includes(w2) || w2.includes(w1)))
    const total = Math.max(words1.length, words2.length)
    return common.length / total
  };

  // ChatGPT Mode functions
  const startCapturing = () => {
    setIsCapturing(true);
    setChatHistory([]);
    setCurrentQuestion("");
    setCurrentResponse("");
  };

  const stopCapturing = () => {
    setIsCapturing(false);
    setShowChatGPTMode(false);
  };

  // Check if duplicate log exists within 1 minute
  const isDuplicateLog = (userQuery, modelResponse) => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 1 minute ago
    
    return logs.some(log => {
      const logTime = log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date(log.timestamp);
      const isRecent = logTime > oneMinuteAgo;
      const isSameContent = log.user_query === userQuery && log.model_response === modelResponse;
      
      return isRecent && isSameContent;
    });
  };

  const captureConversation = async (question, response) => {
    if (!isCapturing) return;

    // Check for duplicate within 1 minute
    if (isDuplicateLog(question.trim(), response.trim())) {
      setError("Duplicate log detected! Same content was added within the last minute.");
      return;
    }

    try {
      // Validate the response
      const validation = await validateResponse(question, response);
      const entityInfo = extractEntities(question); // Get entity info for the log entry
      
      // Create log entry with validation results
      const logEntry = {
        user_query: question.trim(),
        model_response: response.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: "validated",
        created_by: user?.email || "unknown",
        timestamp: new Date().toISOString(),
        source: "chatgpt_mode",
        entity_info: entityInfo // Store entity information for display
      };

      await addLog(logEntry);
      
      // Add to chat history
      setChatHistory(prev => [...prev, {
        question,
        response,
        validation: validation,
        timestamp: new Date()
      }]);
      
      // Reload logs to show the new entry
      const data = await getLogs();
      setLogs(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Failed to capture conversation:", err);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.user_query.trim() || !newLog.model_response.trim()) {
      setError("Please fill in both user query and model response");
      return;
    }

    // Check for duplicate within 1 minute
    if (isDuplicateLog(newLog.user_query.trim(), newLog.model_response.trim())) {
      setError("Duplicate log detected! Same content was added within the last minute.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Validate the response
      const validation = await validateResponse(newLog.user_query, newLog.model_response);
      
      // Create log entry with validation results
      const logEntry = {
        user_query: newLog.user_query.trim(),
        model_response: newLog.model_response.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: "validated",
        created_by: user?.email || "unknown",
        timestamp: new Date().toISOString(),
        entity_info: extractEntities(newLog.user_query) // Store entity information for display
      };

      await addLog(logEntry);
      
      // Reset form and reload logs
      setNewLog({ user_query: "", model_response: "", validation_score: 0, external_verification_required: false, notes: "", status: "pending" });
      setShowAddForm(false);
      
      // Reload logs to show the new entry
      const data = await getLogs();
      setLogs(Array.isArray(data) ? data : []);
      
    } catch (err) {
      setError(err?.message || "Failed to add log");
    } finally {
      setIsLoading(false);
    }
  };

  const approveLog = async (id) => {
    const previous = logs
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Approved" } : log
      )
    )
    try {
      await approveLogById(id)
    } catch (e) {
      setLogs(previous)
      setError("Approve failed")
    }
  }

  const rejectLog = async (id) => {
    const previous = logs
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Rejected" } : log
      )
    )
    try {
      await rejectLogById(id)
    } catch (e) {
      setLogs(previous)
      setError("Reject failed")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Response Validation Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowChatGPTMode(!showChatGPTMode)} variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            {showChatGPTMode ? "Exit ChatGPT Mode" : "ChatGPT Mode"}
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? "Cancel" : "Add Log"}
          </Button>
        </div>
      </div>

      {/* ChatGPT Mode Interface */}
      {showChatGPTMode && (
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">ChatGPT Mode - Auto-Capture Conversations</h2>
              <div className="flex gap-2">
                {!isCapturing ? (
                  <Button onClick={startCapturing} className="bg-green-600 hover:bg-green-700">
                    Start Capturing
                  </Button>
                ) : (
                  <Button onClick={stopCapturing} variant="destructive">
                    Stop Capturing
                  </Button>
                )}
              </div>
            </div>
            
            {isCapturing && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Question</label>
                    <Input
                      placeholder="Type your question here..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Response</label>
                    <Input
                      placeholder="Paste AI response here..."
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => captureConversation(currentQuestion, currentResponse)}
                  disabled={!currentQuestion.trim() || !currentResponse.trim()}
                  className="w-full"
                >
                  Capture & Validate Conversation
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  💡 <strong>How to use:</strong> Ask ChatGPT a question, copy the response, paste it here, and click "Capture & Validate". 
                  The system will automatically validate and log everything!
                </div>
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  ⚠️ <strong>Duplicate Prevention:</strong> The system prevents adding identical logs within 1 minute to avoid spam.
                </div>
              </div>
            )}

            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Captured Conversations</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="text-sm text-gray-600 mb-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="font-medium text-sm">Q: {chat.question}</div>
                      <div className="text-sm mt-1">A: {chat.response}</div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${
                          chat.validation.validationScore >= 0.7
                            ? "bg-green-600"
                            : chat.validation.validationScore >= 0.3
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}>
                          Score: {chat.validation.validationScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Log Form */}
      {showAddForm && (
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">User Query</label>
                  <Input
                    placeholder="Enter the user's question/prompt..."
                    value={newLog.user_query}
                    onChange={(e) => setNewLog({...newLog, user_query: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model Response</label>
                  <Input
                    placeholder="Enter the AI model's response..."
                    value={newLog.model_response}
                    onChange={(e) => setNewLog({...newLog, model_response: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add & Validate"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Search queries or responses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading logs…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Logs Table */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User Query</TableHead>
                <TableHead>Model Response</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>{log.user_query}</TableCell>
                  <TableCell>{log.model_response}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        Number(log.validation_score || 0) >= 0.7
                          ? "bg-green-600"
                          : Number(log.validation_score || 0) >= 0.3
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {Number(log.validation_score || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>{log.entity_info?.entityType || "N/A"}</TableCell>
                  <TableCell>
                    {log.external_verification_required ? (
                      <span className="text-red-500 font-semibold">Required</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Not Needed</span>
                    )}
                  </TableCell>
                  <TableCell>{log.notes}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => approveLog(log.id)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectLog(log.id)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
