// Test file to verify environment variables are loaded correctly
console.log('VITE_GROQ_API_KEY:', import.meta.env.VITE_GROQ_API_KEY);
console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY);
console.log('VITE_OPENAI_BASE_URL:', import.meta.env.VITE_OPENAI_BASE_URL);
console.log('VITE_OPENAI_MODEL:', import.meta.env.VITE_OPENAI_MODEL);

// Check if the API key starts with the correct prefix
if (import.meta.env.VITE_GROQ_API_KEY) {
  console.log('Groq API Key starts with "gsk_":', import.meta.env.VITE_GROQ_API_KEY.startsWith('gsk_'));
}