const aiService = require('../services/ai.service');

class AIController {
  async calculateScore(req, res) {
    try {
      const { clientId } = req.params;
      const result = await aiService.calculateClientHealth(clientId);
      res.json(result);
    } catch (error) {
      console.error('AI Controller Error:', error.message);
      res.status(500).json({ error: error.message || 'Failed to calculate AI score' });
    }
  }

  async generateDraft(req, res) {
    try {
      const { clientId } = req.params;
      const { tone } = req.body;
      const draft = await aiService.getEmailDraft(clientId, tone);
      res.json(draft);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate AI email draft' });
    }
  }
}

module.exports = new AIController();
