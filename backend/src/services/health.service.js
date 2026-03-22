const supabase = require('../config/supabase');
const aiService = require('./ai.service');

exports.calculateAndSaveScore = async (clientId, userId) => {
  try {
    // Step 1: Fetch client basic info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      console.error('Error fetching client for scoring:', clientError);
      return null;
    }

    // Step 2: Fetch recent touchpoints (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: touchpoints, error: tpError } = await supabase
      .from('touchpoints')
      .select('*')
      .eq('client_id', clientId)
      .gte('logged_at', thirtyDaysAgo.toISOString())
      .order('logged_at', { ascending: false });

    if (tpError) {
      console.error('Error fetching touchpoints:', tpError);
    }

    // Step 3: Fetch invoices
    const { data: invoices, error: invError } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId);

    if (invError) {
      console.error('Error fetching invoices:', invError);
    }

    // Step 4: Calculate days since last contact
    const lastTouchpoint = touchpoints?.[0];
    const daysSinceContact = lastTouchpoint
      ? Math.floor((Date.now() - new Date(lastTouchpoint.logged_at)) / 86400000)
      : 999;

    // Step 5: Count overdue invoices
    const overdueInvoices = invoices?.filter(i => i.status === 'overdue').length || 0;

    // Step 6: Get recent notes (last 3)
    const recentNotes = touchpoints
      ?.slice(0, 3)
      .map(t => t.notes)
      .filter(Boolean) || [];

    // Step 7: Call AI service /analyze-client
    const aiResult = await aiService.analyzeClient({
      client_name: client.name,
      days_since_contact: daysSinceContact,
      overdue_invoices: overdueInvoices,
      total_invoices: invoices?.length || 0,
      touchpoint_count: touchpoints?.length || 0,
      last_outcome: lastTouchpoint?.outcome || 'none',
      last_contact_type: lastTouchpoint?.type || 'none',
      recent_notes: recentNotes,
      response_trend: 'unknown'
    });

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

    if (saveError) {
      console.error('Error saving health score:', saveError);
    }

    // Step 9: Check if we need to create alerts
    await checkAndCreateAlerts(clientId, aiResult, daysSinceContact, overdueInvoices);

    return savedScore;
  } catch (error) {
    console.error('Error in calculateAndSaveScore:', error);
    return null;
  }
};

async function checkAndCreateAlerts(clientId, aiResult, daysSinceContact, overdueInvoices) {
  try {
    const alertsToCreate = [];

    if (daysSinceContact >= 7) {
      alertsToCreate.push({
        client_id: clientId,
        type: 'no_contact',
        severity: daysSinceContact >= 14 ? 'high' : 'medium',
        message: `No contact in ${daysSinceContact} days`,
        ai_suggestion: `Reach out today — ${daysSinceContact} days of silence increases churn risk significantly.`
      });
    }

    if (overdueInvoices > 0) {
      alertsToCreate.push({
        client_id: clientId,
        type: 'overdue_invoice',
        severity: overdueInvoices >= 2 ? 'high' : 'medium',
        message: `${overdueInvoices} overdue invoice${overdueInvoices > 1 ? 's' : ''}`,
        ai_suggestion: `Send a friendly payment reminder. Overdue invoices are a leading indicator of churn.`
      });
    }

    if (aiResult.score < 40) {
      alertsToCreate.push({
        client_id: clientId,
        type: 'score_drop',
        severity: 'high',
        message: `Health score critical: ${aiResult.score}/100`,
        ai_suggestion: aiResult.insight || 'No insight available.'
      });
    }

    if (alertsToCreate.length > 0) {
      const { error: alertError } = await supabase.from('alerts').insert(alertsToCreate);
      if (alertError) {
        console.error('Error creating alerts:', alertError);
      }
    }
  } catch (error) {
    console.error('Error in checkAndCreateAlerts:', error);
  }
}

exports.recalculateAllClients = async (userId) => {
  try {
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (clientError) {
      console.error('Error fetching clients for recalculation:', clientError);
      return [];
    }

    const results = await Promise.allSettled(
      clients.map(c => exports.calculateAndSaveScore(c.id, userId))
    );

    return results;
  } catch (error) {
    console.error('Error in recalculateAllClients:', error);
    return [];
  }
};
