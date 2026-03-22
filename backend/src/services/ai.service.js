const axios = require('axios');
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.analyzeClient = async (clientData) => {
  console.log('--- AI Service CALL: analyzeClient ---');
  console.log('Sending to:', `${AI_URL}/analyze-client`);
  
  try {
    const response = await axios.post(
      `${AI_URL}/analyze-client`, 
      clientData,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    console.error('AI Service Connection Error:', error.message);
    if (error.response) {
      console.error('AI Service Data Error:', error.response.data);
    }
    
    // Return empty fields so the frontend knows to retry/re-prompt
    return {
      score: 70,
      risk_level: "healthy",
      factors: {},
      insight: null, // Critical: set to null so frontend shows a retry button/spinner
      calculated_at: new Date().toISOString()
    };
  }
};

exports.getInsight = async (data) => {
  console.log('--- AI Service CALL: getInsight ---');
  console.log('Sending to:', `${AI_URL}/summarize`);

  try {
    const response = await axios.post(
      `${AI_URL}/summarize`,
      data,
      { timeout: 15000 }
    );
    return response.data.insight;
  } catch (error) {
    console.error('AI Service Insight Error:', error.message);
    return null; // Return null so frontend can handle error state
  }
};

exports.draftEmail = async (data) => {
  console.log('--- AI Service CALL: draftEmail ---');
  console.log('Sending to:', `${AI_URL}/draft-email`);

  try {
    const response = await axios.post(
      `${AI_URL}/draft-email`,
      data,
      { timeout: 20000 }
    );
    return response.data;
  } catch (error) {
    console.error('AI Service Email Error:', error.message);
    return {
      subject: `Checking in — ${data.client_name || 'Valued Client'}`,
      body: `Hi ${data.contact_name || 'there'},\n\nI wanted to reach out and check how things are going on your end.\n\nWould love to connect this week if you have a few minutes.\n\nBest regards`
    };
  }
};

exports.getBriefing = async (data) => {
  console.log('--- AI Service CALL: getBriefing ---');
  console.log('Sending to:', `${AI_URL}/briefing`);

  try {
    const response = await axios.post(
      `${AI_URL}/briefing`,
      data,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    console.error('AI Service Briefing Error:', error.message);
    return {
      past: "Data unavailable for relationship history.",
      present: "Data unavailable for current status.",
      future: "Prediction unavailable. Please try again later.",
      generated_at: new Date().toISOString()
    };
  }
};

exports.chat = async (data) => {
  console.log('--- AI Service CALL: chat ---');
  console.log('Sending to:', `${AI_URL}/chat`);

  try {
    const response = await axios.post(
      `${AI_URL}/chat`,
      data,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    console.error('AI Service Chat Error:', error.message);
    return {
      response: "I'm sorry, I'm having trouble connecting to the AI brain right now. Please try again in a moment.",
      role: "assistant"
    };
  }
};
