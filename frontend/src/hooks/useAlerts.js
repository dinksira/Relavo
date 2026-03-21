import { useState, useEffect, useMemo } from 'react';
import { alertsAPI } from '../services/api';

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await alertsAPI.getAll();
        setAlerts(res.data?.data || res.data || []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const unreadCount = useMemo(() => alerts.filter(a => !a.is_read).length, [alerts]);

  const markRead = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    try { await alertsAPI.markRead(id); } catch {}
  };

  const dismiss = async (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    try { await alertsAPI.dismiss(id); } catch {}
  };

  const markAllRead = async () => {
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    try {
      await Promise.all(alerts.filter(a => !a.is_read).map(a => alertsAPI.markRead(a.id)));
    } catch {}
  };

  return { alerts, loading, unreadCount, markRead, dismiss, markAllRead };
};

export default useAlerts;
