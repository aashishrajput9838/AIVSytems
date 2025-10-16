const https = require('https');

// Your Groq API key
const apiKey = 'gsk_Z0uUDWmlqti4fewDI4MIWGdyb3FYaYUhc49myLPVk48mOIVfUGW';

// Options for the HTTPS request
const options = {
  hostname: 'api.groq.com',
  port: 443,
  path: '/openai/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
};

// Make the request
const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response:', JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();