// Test script to verify Firebase functions are working
const http = require('http');

const data = JSON.stringify({
  role: 'assistant',
  content: 'The Earth is round and orbits the Sun.',
  timestamp: new Date().toISOString(),
  url: 'https://chatgpt.com/',
  platform: 'chatgpt'
});

const options = {
  hostname: '127.0.0.1',
  port: 5004,
  path: '/ai-reasoning-validation-system/us-central1/validateAIResponse',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();