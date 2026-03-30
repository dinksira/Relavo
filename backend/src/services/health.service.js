const supabase = require('../config/supabase');
const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Orchestrates score calculation for each client
 * fetches data from Supabase, calls AI service, saves results, creates alerts.
 */
const calculateAndSaveScore = async (clientId) => {
  try {
    console.log(`--- Analyzing client: ${clientId} ---`);

    // Step 1: Fetch client from Supabase
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new Error(`Client not found: ${clientId}`);
    }

    // Step 2: Fetch touchpoints (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: touchpoints, error: tpError } = await supabase
      .from('touchpoints')
      .select('*')
      .eq('client_id', clientId)
      .gte('logged_at', thirtyDaysAgo.toISOString())
      .order('logged_at', { ascending: false });

    if (tpError) throw tpError;

    // Step 3: Fetch all invoices
    const { data: invoices, error: invError } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId);

    if (invError) throw invError;

    // Step 4: Calculate days since last contact
    const lastTouchpoint = touchpoints && touchpoints.length > 0 ? touchpoints[0] : null;
    const daysSinceContact = lastTouchpoint
      ? Math.floor((Date.now() - new Date(lastTouchpoint.logged_at)) / 86400000)
      : 999;

    // Step 5: Count overdue invoices
    const overdueCount = invoices ? invoices.filter(i => i.status === 'overdue').length : 0;

    // Step 6: Get recent notes (last 3)
    const recentNotes = touchpoints 
      ? touchpoints.slice(0, 3).map(t => t.notes).filter(Boolean)
      : [];

    // Step 7: Call Python AI service /analyze-client
    let aiResult;
    try {
      const response = await axios.post(`${AI_URL}/analyze-client`, {
        client_name: client.name,
        days_since_contact: daysSinceContact,
        overdue_invoices: overdueCount,
        total_invoices: invoices ? invoices.length : 0,
        touchpoint_count: touchpoints ? touchpoints.length : 0,
        last_outcome: lastTouchpoint ? lastTouchpoint.outcome : 'none',
        last_contact_type: lastTouchpoint ? lastTouchpoint.type : 'none',
        recent_notes: recentNotes,
        response_trend: 'unknown'
      }, { timeout: 30000 });
      
      aiResult = response.data;
    } catch (error) {
      console.error(`AI service error calling ${AI_URL}:`, error.message);
      aiResult = {
        score: 70,
        risk_level: "healthy",
        factors: {},
        insight: "AI service unavailable"
      };
    }

    // Step 8: Save to health_scores table
    const { data: savedScore, error: saveError } = await supabase
      .from('health_scores')
      .insert({
        client_id: clientId,
        score: aiResult.score,
        risk_level: aiResult.risk_level,
        factors: aiResult.factors,
        ai_insight: aiResult.insight,
        calculated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Step 9: Create alerts
    await createAlerts(clientId, aiResult, daysSinceContact, overdueCount);

    console.log(`Successfully calculated score for ${client.name}: ${aiResult.score}`);
    return savedScore;

  } catch (error) {
    console.error(`Error in calculateAndSaveScore for ${clientId}:`, error.message);
    return null;
  }
};

/**
 * Creates alerts based on client health metrics
 */
const createAlerts = async (clientId, aiResult, daysSinceContact, overdueCount) => {
  try {
    const alerts = [];

    // Alert 1 — No Contact
    if (daysSinceContact >= 7) {
      alerts.push({
        client_id: clientId,
        severity: daysSinceContact >= 14 ? "high" : "medium",
        type: "no_contact",
        message: `No contact in ${daysSinceContact} days`,
        ai_suggestion: `It has been ${daysSinceContact} days since the last interaction. A quick check-in call or personal email is recommended to maintain the relationship.`
      });
    }

    // Alert 2 — Overdue Invoices
    if (overdueCount > 0) {
      alerts.push({
        client_id: clientId,
        severity: overdueCount >= 2 ? "high" : "medium",
        type: "overdue_invoice",
        message: `${overdueCount} overdue invoice(s)`,
        ai_suggestion: `There are ${overdueCount} invoices past due. Send a friendly payment reminder to resolve this before it impacts service.`
      });
    }

    // Alert 3 — Critical Score
    if (aiResult.score < 40) {
      alerts.push({
        client_id: clientId,
        severity: "high",
        type: "score_drop",
        message: `Health score critical: ${aiResult.score}/100`,
        ai_suggestion: aiResult.insight
      });
    }

    if (alerts.length > 0) {
      const { error } = await supabase.from('alerts').insert(alerts);
      if (error) throw error;
      console.log(`Created ${alerts.length} alerts for client ${clientId}`);
    }
  } catch (error) {
    console.error("Error creating alerts:", error.message);
  }
};

/**
 * Recalculates scores for all active clients of a user
 */
const recalculateAllClients = async (userId) => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    if (!clients || clients.length === 0) return [];

    console.log(`Recalculating scores for ${clients.length} clients...`);

    const results = await Promise.allSettled(
      clients.map(client => calculateAndSaveScore(client.id))
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`Recalculation complete. Successes: ${successCount}/${clients.length}`);

    return results;
  } catch (error) {
    console.error("Error in recalculateAllClients:", error.message);
    return [];
  }
};

module.exports = {
  calculateAndSaveScore,
  recalculateAllClients
};
