// Test script for duplicate prevention logic
// This simulates the conversationPairs array and addToConversationPairs function

// Simulated conversation pairs array
let conversationPairs = [];
let lastProcessedPairKey = null;

// Simulated addToConversationPairs function with enhanced deduplication
function addToConversationPairs(messageData) {
  console.log(`Processing ${messageData.role} message: ${messageData.content.substring(0, 30)}...`);
  
  // For ChatGPT, we want to pair user questions with assistant responses
  if (messageData.role === 'user') {
    // Create a more robust unique key for this question
    const questionKey = `${messageData.content.substring(0, 100)}-${messageData.timestamp.substring(0, 19)}`;
    
    // Check if this is a duplicate question by comparing with existing pairs
    const isDuplicate = conversationPairs.some(pair => 
      pair.question === messageData.content
    );
    
    if (isDuplicate) {
      console.log('✓ Skipping duplicate question');
      return;
    }
    
    // Also check if this exact question was just processed
    if (lastProcessedPairKey === questionKey) {
      console.log('✓ Skipping recently processed question');
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
    console.log('✓ Added new question');
  } else if (messageData.role === 'assistant' && conversationPairs.length > 0) {
    // Add assistant message as a response to the last question
    const lastPair = conversationPairs[conversationPairs.length - 1];
    if (!lastPair.response && messageData.content) {
      lastPair.response = messageData.content;
      console.log('✓ Added response to last question');
    }
    
    // If the last pair now has both question and response, check if it's a duplicate
    if (lastPair.question && lastPair.response) {
      const isDuplicate = conversationPairs.slice(0, -1).some(pair => 
        pair.question === lastPair.question && pair.response === lastPair.response
      );
      
      if (isDuplicate) {
        // Remove the duplicate pair
        conversationPairs.pop();
        console.log('✓ Removed duplicate conversation pair');
      }
    }
  }
  
  // Keep only the last 10 pairs to prevent memory issues
  if (conversationPairs.length > 10) {
    conversationPairs.shift();
  }
  
  console.log(`Current conversation pairs: ${conversationPairs.length}`);
}

// Test data
const timestamp1 = new Date().toISOString();
const timestamp2 = new Date(Date.now() - 1000).toISOString();
const timestamp3 = new Date(Date.now() - 2000).toISOString();

// Test 1: Add a question and response
console.log('\n=== Test 1: Add first question and response ===');
addToConversationPairs({
  role: 'user',
  content: 'What is the Taj Mahal?',
  timestamp: timestamp1,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

addToConversationPairs({
  role: 'assistant',
  content: 'The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
  timestamp: timestamp1,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

// Test 2: Try to add the same question and response (should be prevented)
console.log('\n=== Test 2: Try to add duplicate question and response ===');
addToConversationPairs({
  role: 'user',
  content: 'What is the Taj Mahal?',
  timestamp: timestamp2,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

addToConversationPairs({
  role: 'assistant',
  content: 'The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
  timestamp: timestamp2,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

// Test 3: Add a different question
console.log('\n=== Test 3: Add different question ===');
addToConversationPairs({
  role: 'user',
  content: 'What is the capital of France?',
  timestamp: timestamp3,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

addToConversationPairs({
  role: 'assistant',
  content: 'The capital of France is Paris.',
  timestamp: timestamp3,
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

// Test 4: Add the same question again (should be prevented)
console.log('\n=== Test 4: Try to add duplicate question again ===');
addToConversationPairs({
  role: 'user',
  content: 'What is the Taj Mahal?',
  timestamp: new Date().toISOString(),
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
});

// Display final results
console.log('\n=== Final Results ===');
console.log('Conversation pairs:');
conversationPairs.forEach((pair, index) => {
  console.log(`${index + 1}. Q: ${pair.question}`);
  console.log(`   A: ${pair.response}`);
});

console.log(`\nTotal unique conversation pairs: ${conversationPairs.length}`);
console.log('Expected: 2 pairs (one for Taj Mahal, one for France)');