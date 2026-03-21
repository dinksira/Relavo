const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*, clients!inner(name)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format to include client name
    const formattedAlerts = alerts.map(alert => ({
      ...alert,
      client_name: alert.clients?.name || 'Unknown Client'
    }));

    res.json(formattedAlerts);
  } catch (err) {
    console.error('Fetch Alerts Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/alerts/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error('Read Alert Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/alerts/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Alert Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
