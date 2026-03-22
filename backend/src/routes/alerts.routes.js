const express = require('express');
const router = express.Router();
const alertsService = require('../services/alerts.service');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await alertsService.getAlertsForUser(req.user.id);
    res.json(alerts);
  } catch (err) {
    console.error('Fetch Alerts Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/alerts/unread-count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await alertsService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (err) {
    console.error('Fetch Alert Count Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/alerts/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await alertsService.markAsRead(id);
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
    await alertsService.dismissAlert(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Alert Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
