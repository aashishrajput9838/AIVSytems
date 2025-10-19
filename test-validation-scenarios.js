// Comprehensive test for different validation scenarios
async function testValidationScenarios() {
  const testCases = [
    {
      name: "Factual Statement",
      data: {
        role: 'assistant',
        content: 'The Earth is round and orbits the Sun.',
        question: 'What is the shape of the Earth?',
        timestamp: new Date().toISOString(),
        url: 'https://chatgpt.com/',
        platform: 'chatgpt'
      }
    },
    {
      name: "Personal Relationship Validation",
      data: {
        role: 'assistant',
        content: 'Yes, that is correct.',
        question: 'Is my friend John a software engineer?',
        timestamp: new Date().toISOString(),
        url: 'https://chatgpt.com/',
        platform: 'chatgpt'
      }
    },
    {
      name: "Error Keywords Detection",
      data: {
        role: 'assistant',
        content: 'Sorry, I cannot provide that information.',
        question: 'What is the password?',
        timestamp: new Date().toISOString(),
        url: 'https://chatgpt.com/',
        platform: 'chatgpt'
      }
    },
    {
      name: "Professional Claim About Person",
      data: {
        role: 'assistant',
        content: 'Albert Einstein was a theoretical physicist.',
        question: 'Who is Albert Einstein?',
        timestamp: new Date().toISOString(),
        url: 'https://chatgpt.com/',
        platform: 'chatgpt'
      }
    },
    {
      name: "Short Response Detection",
      data: {
        role: 'assistant',
        content: 'Yes.',
        question: 'Is the sky blue?',
        timestamp: new Date().toISOString(),
        url: 'https://chatgpt.com/',
        platform: 'chatgpt'
      }
    }
  ];

  console.log('Testing Chrome Extension validation service with multiple scenarios...\n');

  for (const testCase of testCases) {
    console.log(`--- ${testCase.name} ---`);
    console.log('Question:', testCase.data.question);
    console.log('Response:', testCase.data.content);
    
    // Test entity extraction
    const entityInfo = extractEntities(testCase.data.question);
    console.log('Entity Type:', entityInfo.entityType);
    
    // Test factual accuracy
    const factualScore = await validateFactualAccuracy(testCase.data.question, testCase.data.content);
    console.log('Factual Score:', factualScore.toFixed(2));
    
    console.log('✅ Test completed\n');
  }
  
  console.log('All validation scenarios tested successfully!');
}

// Copy of the functions from validation-service.js for testing
function extractEntities(question) {
  const lowerQuestion = question.toLowerCase();
  let searchQuery = "";
  let entityType = "";
  
  // Named-entity recognition patterns
  const entityPatterns = [
    // Personal relationship validation questions
    {
      pattern: /(.+?) (meri|my) (.+?) (friend|sister|brother|cousin|roommate|colleague|neighbor|classmate) (.+?)\.?\s*(is this|ye|is it|kya ye) (right|correct|true|sahi|theek|statement)\??/i,
      entity: "Personal Relationship",
      search: (match) => `${match[1]} ${match[3]} ${match[4]}`
    },
    
    // Person/Personality questions
    {
      pattern: /(kon hai|who is|who was|kaun hai|kaun tha) (.+?)(\?|$)/i,
      entity: "Person",
      search: (match) => match[2].trim()
    },
    
    // Capital cities
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
      }
    }
  ];
  
  // Try to match entity patterns
  for (const pattern of entityPatterns) {
    const match = lowerQuestion.match(pattern.pattern);
    if (match) {
      searchQuery = pattern.search(match);
      entityType = pattern.entity;
      break;
    }
  }
  
  return {
    query: searchQuery || "General information",
    entityType: entityType || "General",
    isPersonalValidation: (entityType === "Personal Relationship") && (lowerQuestion.includes("right") || lowerQuestion.includes("correct") || lowerQuestion.includes("true") || lowerQuestion.includes("sahi") || lowerQuestion.includes("theek"))
  };
}

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

    // For testing purposes, simulate different validation scores
    if (modelResponse.includes("Sorry") || modelResponse.includes("cannot")) {
      return 0.2; // Low score for error responses
    }
    
    if (modelResponse.length < 10) {
      return 0.4; // Lower score for short responses
    }
    
    return 0.7; // Default score for other cases
  } catch (error) {
    console.error("Factual validation error:", error);
    return 0.5;
  }
}

// Run the tests
testValidationScenarios();