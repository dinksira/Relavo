const express = require('express');
const router = express.Router();
const alertsService = require('../services/alerts.service');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
const ok = (res, data, message) => res.json({ success: true, data, message });
const fail = (res, code, message) => res.status(code).json({ success: false, data: null, message });

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await alertsService.getAlertsForUser(req.user.id);
    return ok(res, alerts, 'Alerts fetched');
  } catch (err) {
    console.error('Fetch Alerts Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// GET /api/alerts/unread-count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await alertsService.getUnreadCount(req.user.id);
    return ok(res, { count }, 'Unread count fetched');
  } catch (err) {
    console.error('Fetch Alert Count Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// PUT /api/alerts/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await alertsService.markAsRead(id);
    return ok(res, { id }, 'Alert marked as read');
  } catch (err) {
    console.error('Read Alert Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// DELETE /api/alerts/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await alertsService.dismissAlert(id);
    return ok(res, { id }, 'Alert dismissed');
  } catch (err) {
    console.error('Delete Alert Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

module.exports = router;
