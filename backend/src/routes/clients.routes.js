const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const healthService = require('../services/health.service');

router.use(authMiddleware);
const ok = (res, data, message) => res.json({ success: true, data, message });
const fail = (res, code, message, data = null) => res.status(code).json({ success: false, data, message });

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) return fail(res, 400, error.message);
    return ok(res, clients, 'Clients fetched');
  } catch (err) {
    console.error('Fetch Clients Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// POST /api/clients
router.post('/', async (req, res) => {
  try {
    const { name, contact_name, email, phone, notes } = req.body;
    
    // Insert client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{ name, contact_name, email, phone, notes, user_id: req.user.id }])
      .select()
      .single();

    if (clientError) return fail(res, 400, clientError.message);

    // Create default health_score row
    const { error: scoreError } = await supabase
      .from('health_scores')
      .insert([{
        client_id: client.id,
        score: 70,
        risk_level: 'healthy',
        ai_insight: "New client added. No data yet."
      }]);

    if (scoreError) console.error('Error creating default score:', scoreError);

    // Trigger score calculation for new client (async)
    setTimeout(() => {
      healthService.calculateAndSaveScore(client.id, req.user.id);
    }, 1000);

    return res.status(201).json({ success: true, data: client, message: 'Client created' });
  } catch (err) {
    console.error('Create Client Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch client and verify ownership
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (clientError || !client) {
      return fail(res, 403, 'Access denied');
    }

    // Fetch latest health_score
    const { data: healthScores } = await supabase
      .from('health_scores')
      .select('*')
      .eq('client_id', id)
      .order('calculated_at', { ascending: false })
      .limit(1);

    // Fetch last 5 touchpoints
    const { data: touchpoints } = await supabase
      .from('touchpoints')
      .select('*')
      .eq('client_id', id)
      .order('logged_at', { ascending: false })
      .limit(5);

    // Fetch all invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    return ok(res, {
      ...client,
      latest_health_score: healthScores?.[0] || null,
      touchpoints: touchpoints || [],
      invoices: invoices || []
    }, 'Client detail fetched');
  } catch (err) {
    console.error('Get Client Detail Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const { data: client, error: verifyError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (verifyError || !client) return fail(res, 403, 'Access denied');

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return fail(res, 400, error.message);
    return ok(res, updatedClient, 'Client updated');
  } catch (err) {
    console.error('Update Client Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: client, error: verifyError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (verifyError || !client) return fail(res, 403, 'Access denied');

    // Soft delete: set status = churned
    const { error } = await supabase
      .from('clients')
      .update({ status: 'churned' })
      .eq('id', id);

    if (error) return fail(res, 400, error.message);
    return ok(res, { id, status: 'churned' }, 'Client archived');
  } catch (err) {
    console.error('Delete Client Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// POST /api/clients/:id/touchpoints
router.post('/:id/touchpoints', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, notes, outcome, logged_at, duration, follow_up_needed, follow_up_date } = req.body;

    // Pack extra fields into notes to avoid schema errors
    let combinedNotes = notes || '';
    if (duration) combinedNotes = `[Duration: ${duration}m] ${combinedNotes}`;
    if (follow_up_needed) combinedNotes = `[Follow-up: ${follow_up_date || 'TBD'}] ${combinedNotes}`;

    const { data: touchpoint, error } = await supabase
      .from('touchpoints')
      .insert([{ 
        client_id: id, 
        type, 
        notes: combinedNotes, 
        outcome, 
        logged_at: logged_at || new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('DIAGNOSTIC: Supabase Touchpoint Error:', JSON.stringify(error, null, 2));
      return fail(res, 400, error.message);
    }

    // Trigger score calculation immediately
    setTimeout(() => {
      healthService.calculateAndSaveScore(id, req.user.id);
    }, 500);

    return res.status(201).json({ success: true, data: touchpoint, message: 'Touchpoint logged' });
  } catch (err) {
    console.error('Create Touchpoint Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// POST /api/clients/:id/invoices
router.post('/:id/invoices', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, due_date, invoice_number, issued_at, notes } = req.body;

    // Map fields to available columns in DB schema
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([{ 
        client_id: id, 
        amount: parseFloat(amount), 
        status: status || 'pending', 
        due_date: due_date || new Date().toISOString().split('T')[0],
        // Invoice number and notes don't exist in minimal schema, append to notes if we had a notes col
        // In this base schema (DATABASE_SETUP.sql), there isn't even a notes column in invoices!
        // We'll just stick to existing columns to avoid 400.
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error (invoice):', error);
      return fail(res, 400, error.message);
    }

    // Trigger score calculation immediately
    setTimeout(() => {
      healthService.calculateAndSaveScore(id, req.user.id);
    }, 500);

    return res.status(201).json({ success: true, data: invoice, message: 'Invoice created' });
  } catch (err) {
    console.error('Create Invoice Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// GET /api/clients/:id/health-history
router.get('/:id/health-history', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: history, error } = await supabase
      .from('health_scores')
      .select('score, calculated_at')
      .eq('client_id', id)
      .order('calculated_at', { ascending: true })
      .limit(14);

    if (error) return fail(res, 400, error.message);
    return ok(res, history, 'Health history fetched');
  } catch (err) {
    console.error('Get Health History Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

module.exports = router;
