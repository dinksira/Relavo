const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Proxy health score calculation
router.post('/calculate-score/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // 1. Fetch data from Supabase (mocked for now until schema is verified)
    // In reality, we'd query touchpoints, invoices, etc.
    const mockData = {
      client_name: "Acme Corp",
      days_since_contact: 9,
      overdue_invoices_count: 1,
      response_time_trend: -0.4,
      activity_ratio: 0.7
    };

    // 2. Call Python AI Service
    const response = await axios.post(`${AI_SERVICE_URL}/summarize`, mockData);
    
    res.json(response.data);
  } catch (error) {
    console.error('AI Proxy Error:', error.message);
    res.status(500).json({ error: 'Failed to communicate with AI Service' });
  }
});

// Proxy email drafting
router.post('/draft-email/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { tone } = req.body;

    const response = await axios.post(`${AI_SERVICE_URL}/suggest`, {
      client_name: "Acme Corp",
      context: "Hasn't replied in 9 days and has an overdue invoice.",
      tone: tone || "Warm"
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI draft' });
  }
});

module.exports = router;
