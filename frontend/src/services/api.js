import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: if 401 → clear auth + redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
};

export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getHealth: (id) => api.get(`/clients/${id}`).then(res => res.data.latest_health_score),
  logTouchpoint: (id, data) => api.post(`/clients/${id}/touchpoints`, data),
  addInvoice: (id, data) => api.post(`/clients/${id}/invoices`, data),
};

export const alertsAPI = {
  getAll: () => api.get('/alerts'),
  markRead: (id) => api.put(`/alerts/${id}/read`),
  dismiss: (id) => api.delete(`/alerts/${id}`),
};

export const aiAPI = {
  analyzeClient: (clientId) => api.post(`/ai/analyze/${clientId}`),
  draftEmail: (clientId, tone) => api.post('/ai/draft-email', { clientId, tone }),
  recalculateAll: () => api.post('/ai/recalculate-all'),
  getHealthHistory: (clientId) => api.get(`/clients/${clientId}/health-history`),
  getBriefing: (clientId) => api.get(`/ai/briefing/${clientId}`),
  chat: (clientId, data) => api.post(`/ai/chat/${clientId}`, data),
};

export default api;
