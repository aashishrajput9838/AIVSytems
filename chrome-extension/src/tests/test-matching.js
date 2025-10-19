// Test script to verify matching logic between conversation pairs and validation results

// Sample conversation pair
const conversationPair = {
  question: "what is cat?",
  response: "A cat is a small, domesticated animal known for being playful, curious, and independent. 🐱\n\nIt belongs to the species Felis catus and is often kept as a pet. Cats are known for their soft fur, sharp claws, and ability to hunt small animals like mice. They communicate through meowing, purring, hissing, and body language.\n\nIn short —\n👉 A cat = a cute, clever, and curious pet that loves to sleep, play, and sometimes ignore you 😼",
  timestamp: "2025-10-17T05:49:02.430Z",
  url: "https://chatgpt.com/c/68f1d897-ce5c-8322-ade1-d8784a2aa2cf",
  platform: "chatgpt"
};

// Sample validation result
const validationResult = {
  id: 1760680147067,
  role: "assistant",
  content: "A cat is a small, domesticated animal known for being playful, curious, and independent. 🐱\n\nIt belongs to the species Felis catus and is often kept as a pet. Cats are known for their soft fur, sharp claws, and ability to hunt small animals like mice. They communicate through meowing, purring, hissing, and body language.\n\nIn short —\n👉 A cat = a cute, clever, and curious pet that loves to sleep, play, and sometimes ignore you 😼",
  timestamp: "2025-10-17T05:49:02.430Z",
  url: "https://chatgpt.com/c/68f1d897-ce5c-8322-ade1-d8784a2aa2cf",
  platform: "chatgpt",
  validation: {
    isValid: true,
    confidence: 0.95,
    issues: [],
    suggestions: []
  },
  validatedAt: "2025-10-17T05:49:04.667Z"
};

console.log("=== Testing Matching Logic ===");
console.log("Conversation Pair Response:");
console.log(conversationPair.response);
console.log("\nValidation Result Content:");
console.log(validationResult.content);
console.log("\nAre they exactly equal?", conversationPair.response === validationResult.content);

// Test normalization function
const normalizeString = (str) => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

const normalizedPairResponse = normalizeString(conversationPair.response);
const normalizedResultContent = normalizeString(validationResult.content);

console.log("\nNormalized Pair Response:");
console.log(normalizedPairResponse);
console.log("\nNormalized Result Content:");
console.log(normalizedResultContent);
console.log("\nAre they exactly equal after normalization?", normalizedPairResponse === normalizedResultContent);

// Test similarity
function countCommonCharacters(str1, str2) {
  const shorter = str1.length < str2.length ? str1 : str2;
  const longer = str1.length >= str2.length ? str1 : str2;
  
  let commonCount = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) {
      commonCount++;
    }
  }
  
  return commonCount;
}

const commonChars = countCommonCharacters(normalizedPairResponse, normalizedResultContent);
const similarity = commonChars / Math.max(normalizedPairResponse.length, normalizedResultContent.length);

console.log("\nCommon characters:", commonChars);
console.log("Similarity:", similarity);
console.log("Should match?", similarity > 0.8);

console.log("\n=== Test Complete ===");