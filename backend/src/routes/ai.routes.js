const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const healthService = require('../services/health.service');
const aiService = require('../services/ai.service');
const supabase = require('../config/supabase');

// Apply authMiddleware to all routes
router.use(authMiddleware);

/**
 * POST /api/ai/analyze/:clientId
 * Manually trigger a health score recalculation for a client
 */
router.post('/analyze/:clientId', async (req, res) => {
  const { clientId } = req.params;
  console.log(`Analyzing client: ${clientId}`);
  
  try {
    const result = await healthService.calculateAndSaveScore(clientId);
    res.json({ data: result });
  } catch (error) {
    console.error('Error in /analyze/:clientId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/recalculate-all
 * Trigger recalculation for all active clients of the user
 */
router.post('/recalculate-all', async (req, res) => {
  try {
    const results = await healthService.recalculateAllClients(req.user.id);
    res.json({ success: true, count: results.length });
  } catch (error) {
    console.error('Error in /recalculate-all:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/draft-email
 * Draft a re-engagement email for a client
 */
router.post('/draft-email', async (req, res) => {
  const { clientId, tone = "professional" } = req.body;
  
  try {
    // 1. Fetch client info
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    if (clientErr) throw clientErr;

    // 2. Latest health score
    const { data: healthScore, error: healthErr } = await supabase
      .from('health_scores')
      .select('*')
      .eq('client_id', clientId)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single();

    // 3. Last 3 touchpoints
    const { data: touchpoints, error: tpErr } = await supabase
      .from('touchpoints')
      .select('*')
      .eq('client_id', clientId)
      .order('logged_at', { ascending: false })
      .limit(3);

    // 4. Overdue invoice count
    const { data: invoices, error: invErr } = await supabase
      .from('invoices')
      .select('status')
      .eq('client_id', clientId)
      .eq('status', 'overdue');

    const daysSinceContact = touchpoints?.[0] 
      ? Math.floor((Date.now() - new Date(touchpoints[0].logged_at)) / 86400000)
      : 999;

    const result = await aiService.draftEmail({
      client_name: client.name,
      contact_name: client.contact_name,
      risk_reason: healthScore?.risk_level === 'at_risk' ? 'Declining health score' : 'Regular follow-up',
      days_since_contact: daysSinceContact,
      overdue_invoices: invoices?.length || 0,
      score: healthScore?.score || 70,
      tone: tone,
      recent_notes: touchpoints?.map(t => t.notes).filter(Boolean) || []
    });

    res.json({ data: result });
  } catch (error) {
    console.error('Error in /draft-email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/briefing/:clientId
 * Generate a full relationship briefing
 */
router.post('/briefing/:clientId', async (req, res) => {
  const { clientId } = req.params;
  
  try {
    const [clientRes, healthRes, touchpointsRes, invoicesRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(7),
      supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', clientId)
    ]);

    if (clientRes.error) throw clientRes.error;
    
    const client = clientRes.data;
    const healthScores = healthRes.data || [];
    const latestScore = healthScores[0] || { score: 70, risk_level: 'healthy' };
    const touchpoints = touchpointsRes.data || [];
    const invoices = invoicesRes.data || [];

    const daysSinceContact = touchpoints?.[0] 
      ? Math.floor((Date.now() - new Date(touchpoints[0].logged_at)) / 86400000)
      : 999;

    const result = await aiService.getBriefing({
      client_name: client.name,
      created_at: client.created_at,
      days_since_contact: daysSinceContact,
      total_touchpoints: touchpoints.length,
      overdue_invoices: invoices.filter(i => i.status === 'overdue').length,
      total_invoices: invoices.length,
      score: latestScore.score,
      risk_level: latestScore.risk_level,
      recent_notes: touchpoints.slice(0, 3).map(t => t.notes).filter(Boolean),
      monthly_value: client.monthly_revenue || 0,
      score_history: healthScores.map(h => ({ score: h.score, calculated_at: h.calculated_at }))
    });

    res.json({ data: result });
  } catch (error) {
    console.error('Error in /briefing/:clientId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/chat/:clientId
 * Interactive chat about a specific client
 */
router.post('/chat/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { message, conversationHistory = [] } = req.body;
  
  try {
    const [clientRes, healthRes, touchpointsRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(1),
      supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }).limit(5)
    ]);

    if (clientRes.error) throw clientRes.error;
    const client = clientRes.data;
    const latestScore = healthRes.data?.[0] || { score: 70, risk_level: 'healthy' };
    const touchpoints = touchpointsRes.data || [];

    const daysSinceContact = touchpoints?.[0] 
      ? Math.floor((Date.now() - new Date(touchpoints[0].logged_at)) / 86400000)
      : 999;

    const client_context = {
      score: latestScore.score,
      risk_level: latestScore.risk_level,
      days_since_contact: daysSinceContact,
      recent_notes: touchpoints.map(t => t.notes).filter(Boolean),
      touchpoint_count: touchpoints.length
    };

    const result = await aiService.chat({
      client_name: client.name,
      message,
      conversation_history: conversationHistory,
      client_context
    });

    res.json({ data: result });
  } catch (error) {
    console.error('Error in /chat/:clientId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
