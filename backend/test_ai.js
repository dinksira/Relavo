const axios = require('axios');
require('dotenv').config();

const url = process.env.AI_SERVICE_URL || 'http://localhost:8001';

async function test() {
  console.log('Testing AI Service at:', url);
  try {
    const res = await axios.get(`${url}/health`);
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Failed:', err.message);
    if (err.response) console.error('Response:', err.response.data);
  }
}

test();
