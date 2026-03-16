const axios = require('axios');
const supabase = require('../config/supabase');
require('dotenv').config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

class AIService {
  async calculateClientHealth(clientId) {
    // 1. Fetch relevant data for health scoring
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*, touchpoints(*), invoices(*)')
      .eq('id', clientId)
      .single();

    if (clientError) throw clientError;

    // 2. Prepare features for the AI model
    // This is a simplified transformation logic
    const touchpoints = client.touchpoints || [];
    const invoices = client.invoices || [];
    
    const lastTouchpoint = touchpoints.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const daysSinceContact = lastTouchpoint 
      ? Math.floor((new Date() - new Date(lastTouchpoint.date)) / (1000 * 60 * 60 * 24))
      : 30; // Default to 30 if no touchpoints

    const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
    
    // 3. Call Python AI Service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/summarize`, {
      client_name: client.name,
      days_since_contact: daysSinceContact,
      overdue_invoices_count: overdueInvoices.length,
      response_time_trend: -0.1, // This would ideally be calculated from history
      activity_ratio: 0.8
    });

    // 4. Update the client record with new score
    const { score, risk_level } = aiResponse.data;
    await supabase
      .from('clients')
      .update({ 
        msg: aiResponse.data.ai_insight, // Storing AI summary in a temporary field or similar
        vitality_score: score,
        status: this._mapRiskToStatus(risk_level)
      })
      .eq('id', clientId);

    return aiResponse.data;
  }

  async getEmailDraft(clientId, tone = 'Professional') {
    const { data: client, error } = await supabase
      .from('clients')
      .select('name, vitality_score, status')
      .eq('id', clientId)
      .single();

    if (error) throw error;

    const context = `Client ${client.name} is currently ${client.status} with a health score of ${client.vitality_score}/100.`;

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/suggest`, {
      client_name: client.name,
      context: context,
      tone: tone
    });

    return aiResponse.data;
  }

  _mapRiskToStatus(risk) {
    const mapping = {
      'Low': 'Healthy',
      'Medium': 'Needs Attention',
      'High': 'At Risk'
    };
    return mapping[risk] || 'Healthy';
  }
}

module.exports = new AIService();
