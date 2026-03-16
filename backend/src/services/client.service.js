const clientRepository = require('../repositories/client.repository');
const axios = require('axios');

class ClientService {
  async getAllClients(agencyId) {
    return await clientRepository.findAll(agencyId);
  }

  async getClientDetail(clientId) {
    return await clientRepository.findById(clientId);
  }

  async registerClient(clientData) {
    // Business logic: Generate initials if not provided
    if (!clientData.initials && clientData.name) {
      clientData.initials = clientData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 4);
    }
    
    return await clientRepository.create(clientData);
  }

  async updateClientStatus(clientId, statusData) {
    const updated = await clientRepository.update(clientId, statusData);
    
    // Potentially trigger AI re-scoring here via a webhook or internal call
    // Logic for calling Python AI service could live here or in an AI-specific service
    
    return updated;
  }

  async removeClient(clientId) {
    return await clientRepository.delete(clientId);
  }
}

module.exports = new ClientService();
