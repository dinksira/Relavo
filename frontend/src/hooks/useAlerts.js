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
        setAlerts(Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const unreadCount = useMemo(() => (Array.isArray(alerts) ? alerts : []).filter(a => !a.read).length, [alerts]);

  const markRead = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    try { await alertsAPI.markRead(id); } catch {}
  };

  const dismiss = async (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    try { await alertsAPI.dismiss(id); } catch {}
  };

  const markAllRead = async () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    try {
      await Promise.all((Array.isArray(alerts) ? alerts : []).filter(a => !a.read).map(a => alertsAPI.markRead(a.id)));
    } catch {}
  };

  return { alerts, loading, unreadCount, markRead, dismiss, markAllRead };
};

export default useAlerts;
