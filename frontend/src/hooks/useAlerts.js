import { useState, useEffect, useMemo } from 'react';
import { alertsAPI } from '../services/api';
import { supabase } from '../services/supabase';

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    // We don't want to show a loading spinner every time a real-time update happens
    // but we do want it on initial load.
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

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Real-time Alerts Sync
  useEffect(() => {
    const channel = supabase
      .channel('realtime:alerts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'alerts' 
      }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleQuickLogSuccess = () => {
      fetchAlerts();
    };
    window.addEventListener('relavo:quicklog:success', handleQuickLogSuccess);
    return () => window.removeEventListener('relavo:quicklog:success', handleQuickLogSuccess);
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

  return { alerts, loading, unreadCount, markRead, dismiss, markAllRead, refreshAlerts: fetchAlerts };
};

export default useAlerts;
