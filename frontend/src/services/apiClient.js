import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for Auth (Optional for now)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('relavo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clientApi = {
  getAll: (agencyId) => apiClient.get(`/clients?agencyId=${agencyId}`),
  getOne: (id) => apiClient.get(`/clients/${id}`),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`)
};

export const aiApi = {
  calculateScore: (clientId) => apiClient.post(`/ai/calculate-score/${clientId}`),
  generateDraft: (clientId, tone) => apiClient.post(`/ai/draft-email/${clientId}`, { tone })
};

export default apiClient;
