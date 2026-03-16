const clientService = require('../services/client.service');

class ClientController {
  async getAll(req, res) {
    try {
      // In a real app, agencyId would come from req.user (JWT)
      const agencyId = req.query.agencyId; 
      if (!agencyId) return res.status(400).json({ error: 'agencyId is required' });
      
      const clients = await clientService.getAllClients(agencyId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const client = await clientService.getClientDetail(req.params.id);
      if (!client) return res.status(404).json({ error: 'Client not found' });
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const client = await clientService.registerClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const client = await clientService.updateClientStatus(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await clientService.removeClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ClientController();
