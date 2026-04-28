const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const aiInstance = axios.create({
  baseURL: AI_URL.endsWith('/') ? AI_URL.slice(0, -1) : AI_URL,
  timeout: 90000
});

/**
 * HTTP client for calling Python AI service.
 */
const analyzeClient = async (data) => {
  try {
    const response = await aiInstance.post('/analyze-client', data);
    return response.data;
  } catch (error) {
    console.error('AI Service Error (analyzeClient):', error.message);
    throw error;
  }
};

const getInsight = async (data) => {
  try {
    const response = await aiInstance.post('/summarize', data);
    return response.data.insight;
  } catch (error) {
    console.error('AI Service Error (getInsight):', error.message);
    throw error;
  }
};

const draftEmail = async (data) => {
  try {
    const response = await aiInstance.post('/draft-email', data);
    return response.data;
  } catch (error) {
    console.error('AI Service Error (draftEmail):', error.message);
    throw error;
  }
};

const getBriefing = async (data) => {
  try {
    const response = await aiInstance.post('/briefing', data);
    return response.data;
  } catch (error) {
    console.error('AI Service Error (getBriefing):', error.message);
    throw error;
  }
};

const chat = async (data) => {
  try {
    const response = await aiInstance.post('/chat', data);
    return response.data;
  } catch (error) {
    console.error('AI Service Error (chat):', error.message);
    throw error;
  }
};

const interpret = async (data) => {
  try {
    const response = await aiInstance.post('/interpret', data);
    return response.data;
  } catch (error) {
    console.error('AI Service Error (interpret):', error.message);
    throw error;
  }
};

module.exports = {
  analyzeClient,
  getInsight,
  draftEmail,
  getBriefing,
  chat,
  interpret
};
