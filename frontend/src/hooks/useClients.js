import { useState, useEffect, useMemo, useCallback } from 'react';
import { clientsAPI, aiAPI } from '../services/api';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientsAPI.getAll();
      setClients(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (data) => {
    const res = await clientsAPI.create(data);
    const newClient = res.data?.data || res.data;
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = async (id, data) => {
    const res = await clientsAPI.update(id, data);
    const updated = res.data?.data || res.data;
    setClients(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const removeClient = async (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
    await clientsAPI.delete(id);
  };

  const analyzeClient = async (clientId) => {
    console.log('--- useClients: analyzeClient ---', clientId);
    try {
      const res = await aiAPI.analyzeClient(clientId);
      const updatedScore = res.data?.data || res.data;
      console.log('API Response data:', updatedScore);
      
      setClients(prev => {
        const next = prev.map(c => 
          c.id === clientId 
            ? { ...c, latest_health_score: updatedScore, health_score: updatedScore }
            : c
        );
        console.log('Updated clients state for ID:', clientId);
        return next;
      });
      return updatedScore;
    } catch (err) {
      console.error('Analyze client error hook:', err);
      return null;
    }
  };

  const computed = useMemo(() => ({
    healthyCount: clients.filter(c => {
      const s = (c.latest_health_score?.score || c.latest_health_score || 0);
      return s >= 70;
    }).length,
    warningCount: clients.filter(c => { 
      const s = (c.latest_health_score?.score || c.latest_health_score || 0);
      return s >= 40 && s < 70; 
    }).length,
    atRiskCount: clients.filter(c => {
      const s = (c.latest_health_score?.score || c.latest_health_score || 0);
      return s < 40;
    }).length,
    sortedByScore: [...clients].sort((a, b) => {
      const sa = (a.latest_health_score?.score || a.latest_health_score || 0);
      const sb = (b.latest_health_score?.score || b.latest_health_score || 0);
      return sa - sb;
    }),
  }), [clients]);

  return { 
    clients, 
    loading, 
    error, 
    addClient, 
    updateClient, 
    removeClient, 
    analyzeClient, 
    refreshClients: fetchClients,
    ...computed 
  };
};

export default useClients;
