const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*, health_scores(*)')
      .eq('user_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    // Format to include only latest health_score and sort
    const formattedClients = clients.map(client => {
      const latestScore = client.health_scores.sort((a, b) => 
        new Date(b.calculated_at) - new Date(a.calculated_at)
      )[0] || null;
      
      delete client.health_scores;
      return { ...client, health_score: latestScore };
    });

    // Sort by health score ascending (worst first)
    formattedClients.sort((a, b) => {
      const scoreA = a.health_score ? a.health_score.score : 100;
      const scoreB = b.health_score ? b.health_score.score : 100;
      return scoreA - scoreB;
    });

    res.json(formattedClients);
  } catch (err) {
    console.error('Fetch Clients Error:', err);
    res.status(500).json({ error: "Internal server error" });
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

    if (clientError) return res.status(400).json({ error: clientError.message });

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

    res.status(201).json(client);
  } catch (err) {
    console.error('Create Client Error:', err);
    res.status(500).json({ error: "Internal server error" });
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
      return res.status(403).json({ error: "Access denied" });
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

    res.json({
      ...client,
      latest_health_score: healthScores?.[0] || null,
      touchpoints: touchpoints || [],
      invoices: invoices || []
    });
  } catch (err) {
    console.error('Get Client Detail Error:', err);
    res.status(500).json({ error: "Internal server error" });
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

    if (verifyError || !client) return res.status(403).json({ error: "Access denied" });

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(updatedClient);
  } catch (err) {
    console.error('Update Client Error:', err);
    res.status(500).json({ error: "Internal server error" });
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

    if (verifyError || !client) return res.status(403).json({ error: "Access denied" });

    // Soft delete: set status = churned
    const { error } = await supabase
      .from('clients')
      .update({ status: 'churned' })
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Client Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/clients/:id/touchpoints
router.post('/:id/touchpoints', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, notes, outcome, logged_at } = req.body;

    // Ownership check (implied by RLS but we can do it explicitly for cleaner 403)
    const { data: touchpoint, error } = await supabase
      .from('touchpoints')
      .insert([{ client_id: id, type, notes, outcome, logged_at: logged_at || new Date().toISOString() }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(touchpoint);
  } catch (err) {
    console.error('Create Touchpoint Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/clients/:id/invoices
router.post('/:id/invoices', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, due_date } = req.body;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([{ client_id: id, amount, status, due_date }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Create Invoice Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
