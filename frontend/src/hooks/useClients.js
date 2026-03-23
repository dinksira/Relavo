import { useState, useEffect, useMemo, useCallback } from 'react';
import { clientsAPI, aiAPI } from '../services/api';
import { getNumericScore } from '../utils/scoreHelpers';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientsAPI.getAll();
      setClients(Array.isArray(res.data?.data) 
        ? res.data.data 
        : Array.isArray(res.data) 
          ? res.data 
          : []);
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

  const computed = useMemo(() => {
    const safeClients = Array.isArray(clients) ? clients : [];
    return {
      healthyCount: safeClients.filter(c => getNumericScore(c) >= 70).length,
      warningCount: safeClients.filter(c => { 
        const s = getNumericScore(c);
        return s >= 40 && s < 70; 
      }).length,
      atRiskCount: safeClients.filter(c => getNumericScore(c) < 40).length,
      sortedByScore: [...safeClients].sort((a, b) => getNumericScore(a) - getNumericScore(b)),
    };
  }, [clients]);

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
