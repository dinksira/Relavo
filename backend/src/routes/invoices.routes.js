const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const healthService = require('../services/health.service');
const { verifyClientAccess } = require('../utils/auth.utils');

router.use(authMiddleware);

const ok = (res, data, message) => res.json({ success: true, data, message });
const fail = (res, code, message) => res.status(code).json({ success: false, data: null, message });

const getOwnedClient = async (clientId, userId) => {
  const { client, error } = await verifyClientAccess(clientId, userId);
  return { data: client, error };
};

const getOwnedInvoice = async (invoiceId, userId) => {
  // 1. Fetch invoice to get client_id
  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('id, client_id')
    .eq('id', invoiceId)
    .single();
  
  if (invErr || !invoice) return { data: null, error: invErr };

  // 2. Verify access to that client
  const { client, error: accessErr } = await verifyClientAccess(invoice.client_id, userId);
  
  if (accessErr || !client) return { data: null, error: accessErr };

  return { data: invoice, error: null };
};

// POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const { client_id, amount, due_date, status = 'pending' } = req.body;
    if (!client_id || !amount) return fail(res, 400, 'client_id and amount are required');

    const { data: ownedClient } = await getOwnedClient(client_id, req.user.id);
    if (!ownedClient) return fail(res, 403, 'Access denied');

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([{
        client_id,
        amount: parseFloat(amount),
        due_date: due_date || new Date().toISOString().split('T')[0],
        status
      }])
      .select()
      .single();

    if (error) return fail(res, 400, error.message);

    const updatedHealthScore = await healthService.calculateAndSaveScore(client_id);
    return ok(res, { invoice, updated_health_score: updatedHealthScore }, 'Invoice created');
  } catch (err) {
    console.error('Create Invoice Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// GET /api/invoices/client/:clientId
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { data: ownedClient } = await getOwnedClient(clientId, req.user.id);
    if (!ownedClient) return fail(res, 403, 'Access denied');

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) return fail(res, 400, error.message);
    return ok(res, invoices || [], 'Invoices fetched');
  } catch (err) {
    console.error('Get Invoices Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// PATCH /api/invoices/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, due_date } = req.body;

    const { data: ownedInvoice } = await getOwnedInvoice(id, req.user.id);
    if (!ownedInvoice) return fail(res, 403, 'Access denied');

    const updates = {};
    if (status) updates.status = status;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (due_date) updates.due_date = due_date;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return fail(res, 400, error.message);

    const updatedHealthScore = await healthService.calculateAndSaveScore(ownedInvoice.client_id);
    return ok(res, { invoice, updated_health_score: updatedHealthScore }, 'Invoice updated');
  } catch (err) {
    console.error('Update Invoice Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: ownedInvoice } = await getOwnedInvoice(id, req.user.id);
    if (!ownedInvoice) return fail(res, 403, 'Access denied');

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) return fail(res, 400, error.message);

    const updatedHealthScore = await healthService.calculateAndSaveScore(ownedInvoice.client_id);
    return ok(res, { deleted_id: id, updated_health_score: updatedHealthScore }, 'Invoice deleted');
  } catch (err) {
    console.error('Delete Invoice Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

module.exports = router;
