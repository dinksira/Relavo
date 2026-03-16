const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/calculate-score/:clientId', (req, res) => aiController.calculateScore(req, res));
router.post('/draft-email/:clientId', (req, res) => aiController.generateDraft(req, res));

module.exports = router;
