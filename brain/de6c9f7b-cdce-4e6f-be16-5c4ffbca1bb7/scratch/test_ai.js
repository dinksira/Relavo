
const axios = require('axios');

async function testInterpret() {
  try {
    const res = await axios.post('http://localhost:8000/interpret', {
      query: "is there a client named midroc??",
      context_clients: [
        { id: '123', name: 'Midroc International' },
        { id: '456', name: 'Acme Corp' }
      ]
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) console.error('Data:', err.response.data);
  }
}

testInterpret();
