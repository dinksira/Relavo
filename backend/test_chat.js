const axios = require('axios');
require('dotenv').config();

const url = process.env.AI_SERVICE_URL || 'http://localhost:8001';

async function testChat() {
  console.log('Testing Chat at:', url);
  try {
    const payload = {
      client_name: "Acme Corp",
      message: "Hello, who are you?",
      conversation_history: [],
      client_context: {
        name: "Acme Corp",
        score: 70,
        risk_level: "healthy"
      }
    };
    const res = await axios.post(`${url}/chat`, payload);
    console.log('Success:', res.data.response);
  } catch (err) {
    console.error('Failed:', err.message);
    if (err.response) console.error('Response:', err.response.data);
  }
}

testChat();
