const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const healthService = require('../services/health.service');
const aiService = require('../services/ai.service');
const emailService = require('../services/email.service');
const supabase = require('../config/supabase');
const { verifyClientAccess } = require('../utils/auth.utils');

// Apply authMiddleware to all routes
router.use(authMiddleware);
const ok = (res, data, message) => res.json({ success: true, data, message });
const fail = (res, code, message) => res.status(code).json({ success: false, data: null, message });

/**
 * POST /api/ai/analyze/:clientId
 * Manually trigger a health score recalculation for a client
 */
router.post('/analyze/:clientId', async (req, res) => {
  const { clientId } = req.params;
  console.log(`Analyzing client: ${clientId}`);
  
  try {
    // Verify access
    const { client, error: accessError } = await verifyClientAccess(clientId, req.user.id);
    if (accessError || !client) return fail(res, 403, 'Access denied');

    const result = await healthService.calculateAndSaveScore(clientId);
    return ok(res, result, 'Client analyzed');
  } catch (error) {
    console.error('Error in /analyze/:clientId:', error.message);
    return fail(res, 500, error.message);
  }
});

/**
 * POST /api/ai/recalculate-all
 * Trigger recalculation for all active clients of the user
 */
router.post('/recalculate-all', async (req, res) => {
  try {
    const results = await healthService.recalculateAllClients(req.user.id);
    return ok(res, { count: results.length }, 'Recalculation completed');
  } catch (error) {
    console.error('Error in /recalculate-all:', error.message);
    return fail(res, 500, error.message);
  }
});

/**
 * POST /api/ai/draft-email
 * Draft a re-engagement email for a client
 */
router.post('/draft-email', async (req, res) => {
  const { clientId, tone = "professional" } = req.body;
  
  try {
    // 1. Verify access and fetch client info
    const { client, error: clientErr } = await verifyClientAccess(clientId, req.user.id);
    if (clientErr || !client) return fail(res, 403, 'Access denied');
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

    return ok(res, result, 'Email draft generated');
  } catch (error) {
    console.error('Error in /draft-email:', error.message);
    return fail(res, 500, error.message);
  }
});

/**
 * POST /api/ai/briefing/:clientId
 * Generate a full relationship briefing
 */
router.post('/briefing/:clientId', async (req, res) => {
  const { clientId } = req.params;
  
  try {
    // 0. Verify access
    const { client: clientData, error: accessError } = await verifyClientAccess(clientId, req.user.id);
    if (accessError || !clientData) return fail(res, 403, 'Access denied');

    const [clientRes, healthRes, touchpointsRes, invoicesRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('health_scores').select('*').eq('client_id', clientId).order('calculated_at', { ascending: false }).limit(7),
      supabase.from('touchpoints').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', clientId)
    ]);

    if (clientRes.error) throw new Error(`Client not found or error: ${clientRes.error.message}`);
    if (!clientRes.data) throw new Error('Client record missing');
    
    const client = clientRes.data;
    const healthScores = healthRes.data || [];
    const latestScore = healthScores[0] || { score: 70, risk_level: 'healthy' };
    const touchpoints = touchpointsRes.data || [];
    const invoices = invoicesRes.data || [];

    const daysSinceContact = touchpoints?.[0] 
      ? Math.floor((Date.now() - new Date(touchpoints[0].logged_at)) / 86400000)
      : 999;

    const result = await aiService.getBriefing({
      client_id: String(clientId),
      client_name: client.name || "Valued Client",
      created_at: client.created_at || new Date().toISOString(),
      days_since_contact: daysSinceContact,
      total_touchpoints: touchpoints.length,
      overdue_invoices: (invoices || []).filter(i => i.status === 'overdue').length,
      total_invoices: (invoices || []).length,
      score: latestScore.score || 70,
      risk_level: latestScore.risk_level || 'healthy',
      recent_notes: touchpoints.slice(0, 3).map(t => t.notes).filter(Boolean),
      monthly_value: client.monthly_revenue || 0,
      score_history: (healthScores || []).map(h => ({ 
        score: Number(h.score) || 70, 
        calculated_at: String(h.calculated_at || new Date().toISOString()) 
      }))
    });

    return ok(res, result, 'Briefing generated');
  } catch (error) {
    console.error('DIAGNOSTIC: AI Briefing Error:', error.message);
    if (error.response) {
      console.error('DIAGNOSTIC: AI Service Response Body:', JSON.stringify(error.response.data, null, 2));
    }
    return fail(res, 500, error.message);
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
    // 0. Verify access
    const { client: clientData, error: accessError } = await verifyClientAccess(clientId, req.user.id);
    if (accessError || !clientData) return fail(res, 403, 'Access denied');

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

    return ok(res, result, 'Chat response generated');
  } catch (error) {
    console.error('Error in /chat/:clientId:', error.message);
    return fail(res, 500, error.message);
  }
});

/**
 * POST /api/ai/send-draft
 * Send the drafted email directly to the client
 */
router.post('/send-draft', async (req, res) => {
  const { clientId, subject, body } = req.body;
  
  if (!clientId || !subject || !body) {
    return fail(res, 400, 'Missing required fields: clientId, subject, or body');
  }

  try {
    // 1. Verify access and fetch client email
    const { client, error: clientErr } = await verifyClientAccess(clientId, req.user.id);
    if (clientErr || !client) return fail(res, 403, 'Access denied');

    if (clientErr || !client?.email) {
      throw new Error('Could not find client email. Please ensure the client record has an email address.');
    }

    // 2. Format Body for HTML
    const htmlBody = body.replace(/\n/g, '<br/>');

    // 3. Send Email
    await emailService.sendEmail({
      to: client.email,
      subject: subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px;">
          ${htmlBody}
        </div>
      `,
      text: body
    });

    // 4. (Optional) Log this as a touchpoint
    await supabase.from('touchpoints').insert({
      client_id: clientId,
      type: 'email',
      notes: `AI Draft Sent: ${subject}`,
      sentiment_score: 0.8
    });

    return ok(res, null, 'Email sent successfully via Relavo');
  } catch (error) {
    console.error('Error in /send-draft:', error.message);
    return fail(res, 500, error.message);
  }
});

/**
 * POST /api/ai/interpret
 * Use AI to interpret natural language commands
 */
router.post('/interpret', async (req, res) => {
  try {
    const { query, context_clients } = req.body;
    const result = await aiService.interpret({ query, context_clients });
    return ok(res, result, 'Command interpreted');
  } catch (error) {
    console.error('Error in /interpret:', error.message);
    return fail(res, 500, error.message);
  }
});

module.exports = router;
