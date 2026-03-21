import { useState, useEffect, useMemo } from 'react';
import { clientsAPI } from '../services/api';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await clientsAPI.getAll();
        setClients(res.data?.data || res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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

  const computed = useMemo(() => ({
    healthyCount: clients.filter(c => (c.latest_health_score || 0) >= 70).length,
    warningCount: clients.filter(c => { const s = c.latest_health_score || 0; return s >= 40 && s < 70; }).length,
    atRiskCount: clients.filter(c => (c.latest_health_score || 0) < 40).length,
    sortedByScore: [...clients].sort((a, b) => (a.latest_health_score || 0) - (b.latest_health_score || 0)),
  }), [clients]);

  return { clients, loading, error, addClient, updateClient, removeClient, ...computed };
};

export default useClients;
