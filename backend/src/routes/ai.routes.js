const express = require('express');
const router = express.Router();
const healthService = require('../services/health.service');
const aiService = require('../services/ai.service');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// In-memory cache for briefings (1 hour)
const briefingCache = {};

// POST /api/ai/analyze/:clientId
router.post('/analyze/:clientId', async (req, res) => {
  const { clientId } = req.params;
  console.log('--- ROUTE: ai/analyze ---', clientId);
  try {
    const { id: userId } = req.user;
    const savedScore = await healthService.calculateAndSaveScore(clientId, userId);
    if (!savedScore) return res.status(500).json({ status: 'error', message: 'Failed to calculate score' });
    
    // Clear briefing cache for this client since data changed
    delete briefingCache[clientId];
    
    res.json({ status: 'success', data: savedScore });
  } catch (error) {
    console.error('Analyze Route Error:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/ai/briefing/:clientId
router.get('/briefing/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { id: userId } = req.user;

  console.log('--- ROUTE: ai/briefing ---', clientId);
  const cached = briefingCache[clientId];
  if (cached && (Date.now() - cached.generatedAt < 3600000)) {
    return res.json({ status: 'success', data: cached.data });
  }

  try {
    const [clientRes, healthRes, touchpointsRes, invoicesRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(7),
      supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
    ]);

    if (clientRes.error) throw new Error(`Client not found: ${clientRes.error.message}`);
    
    const client = clientRes.data;
    const healthScores = healthRes.data || [];
    const latestScore = healthScores[0] || { score: 70, risk_level: 'healthy' };
    const touchpoints = touchpointsRes.data || [];
    const invoices = invoicesRes.data || [];

    const recentNotes = touchpoints.slice(0, 5).map(t => t.notes).filter(Boolean);
    const lastTouchpoint = touchpoints[0];
    const daysSinceContact = lastTouchpoint ? Math.floor((Date.now() - new Date(lastTouchpoint.logged_at)) / 86400000) : 999;
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;

    const briefingPayload = {
      client_name: client.name,
      created_at: client.created_at || new Date().toISOString(),
      days_since_contact: daysSinceContact,
      total_touchpoints: touchpoints.length,
      overdue_invoices: overdueCount,
      total_invoices: invoices.length,
      score: latestScore.score,
      risk_level: latestScore.risk_level,
      recent_notes: recentNotes,
      last_contact_type: lastTouchpoint?.type || 'none',
      score_history: healthScores,
      monthly_value: client.monthly_revenue
    };

    const briefingResult = await aiService.getBriefing(briefingPayload);
    
    briefingCache[clientId] = {
      data: briefingResult,
      generatedAt: Date.now()
    };

    res.json({ status: 'success', data: briefingResult });
  } catch (error) {
    console.error('Briefing Route Error:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/ai/chat/:clientId
router.post('/chat/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { message, conversationHistory } = req.body;
  const { id: userId } = req.user;

  console.log('--- ROUTE: ai/chat ---', clientId);
  try {
    const [clientRes, healthRes, touchpointsRes, invoicesRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(1),
      supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', clientId)
    ]);

    if (clientRes.error) throw new Error(`Client context failed: ${clientRes.error.message}`);

    const client = clientRes.data;
    const latestScore = (healthRes.data && healthRes.data[0]) || { score: 70, risk_level: 'healthy' };
    const touchpoints = touchpointsRes.data || [];
    const invoices = invoicesRes.data || [];

    const lastTouchpoint = touchpoints[0];
    const daysSinceContact = lastTouchpoint ? Math.floor((Date.now() - new Date(lastTouchpoint.logged_at)) / 86400000) : 999;
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

    const clientContext = {
      name: client.name,
      score: latestScore.score,
      risk_level: latestScore.risk_level,
      days_since_contact: daysSinceContact,
      overdue_invoices: overdueInvoices,
      touchpoint_count: touchpoints.length,
      recent_notes: touchpoints.slice(0, 5).map(t => t.notes).filter(Boolean),
      last_contact_type: lastTouchpoint?.type || 'none',
      created_at: client.created_at
    };

    const chatResult = await aiService.chat({
      client_name: client.name,
      message,
      conversation_history: conversationHistory || [],
      client_context: clientContext
    });

    res.json(chatResult);
  } catch (error) {
    console.error('Chat Route Error:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/ai/draft-email
router.post('/draft-email', async (req, res) => {
  const { clientId } = req.body;
  try {
    const { id: userId } = req.user;
    const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).eq('user_id', userId).single();
    const { data: healthScores } = await supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(1);
    const latestScore = healthScores?.[0];
    
    const { data: touchpoints } = await supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }).limit(3);
    
    const recentNotes = touchpoints?.map(t => t.notes).filter(Boolean) || [];
    const lastTouchpoint = touchpoints?.[0];
    const daysSinceContact = lastTouchpoint ? Math.floor((Date.now() - new Date(lastTouchpoint.logged_at)) / 86400000) : 999;
      
    const draft = await aiService.draftEmail({
      client_name: client.name,
      contact_name: client.contact_name,
      risk_reason: latestScore?.risk_level === 'at_risk' ? 'Declining health score and engagement' : 'Regular follow-up',
      days_since_contact: daysSinceContact,
      overdue_invoices: 0, 
      score: latestScore?.score || 70,
      tone: req.body.tone || 'professional',
      recent_notes: recentNotes
    });
    res.json(draft);
  } catch (error) {
    console.error('Email Route Error:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/ai/recalculate-all
router.post('/recalculate-all', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const results = await healthService.recalculateAllClients(userId);
    const count = results.filter(r => r.status === 'fulfilled').length;
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
