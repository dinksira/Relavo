import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, RefreshCw, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import useAlerts from '../hooks/useAlerts';
import { formatDaysAgo } from '../utils/formatters';

const severityColors = { high: '#dc2626', medium: '#d97706', low: '#3b82f6' };
const severityVariants = { high: 'danger', medium: 'warning', low: 'info' };

const AlertsPage = () => {
  const navigate = useNavigate();
  const { alerts, loading, unreadCount, markRead, dismiss, markAllRead } = useAlerts();
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read;
    if (filter === 'high' || filter === 'medium' || filter === 'low') return a.severity === filter;
    return true;
  });

  const counts = {
    all: alerts.length,
    unread: alerts.filter(a => !a.is_read).length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
  };

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: 0 }}>Smart Alerts</h1>
          <p style={{ fontSize: 14, color: unreadCount > 0 ? '#3b82f6' : '#64748b', margin: '4px 0 0', fontWeight: unreadCount > 0 ? 500 : 400 }}>
            {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllRead}>Mark all as read</Button>
          )}
          <Button variant="outline" icon={RefreshCw} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 'none', fontFamily: 'inherit',
              background: filter === tab.key ? '#3b82f6' : '#f1f5f9',
              color: filter === tab.key ? '#fff' : '#64748b',
              transition: 'all 150ms',
            }}
          >
            {tab.label}
            <span style={{
              background: filter === tab.key ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
              color: filter === tab.key ? '#fff' : '#64748b',
              borderRadius: 999, fontSize: 11, fontWeight: 600,
              padding: '0 6px', height: 18, display: 'flex', alignItems: 'center',
            }}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading alerts...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up!"
          subtitle="No alerts right now. Relavo will notify you when a client needs attention."
        />
      ) : (
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(alert => (
          <div
            key={alert.id}
            style={{
              background: alert.is_read ? '#fff' : '#fafbff',
              border: '1px solid #e2e8f0',
              borderLeft: `4px solid ${severityColors[alert.severity] || '#3b82f6'}`,
              borderRadius: '0 10px 10px 0',
              padding: '16px 20px', marginBottom: 10,
              transition: 'all 150ms',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!alert.is_read && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{alert.client_name || 'Client'}</span>
                <Badge variant="neutral" size="sm">{alert.type || 'alert'}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge variant={severityVariants[alert.severity] || 'info'} size="sm">{alert.severity}</Badge>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDaysAgo(alert.created_at)}</span>
              </div>
            </div>

            {/* Message */}
            <p style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.6, margin: '0 0 8px' }}>{alert.message}</p>

            {/* AI suggestion */}
            {alert.ai_suggestion && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 10 }}>
                <Sparkles size={14} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                  Suggestion: {alert.ai_suggestion}
                </p>
              </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href={`/clients/${alert.client_id}`}
                style={{ fontSize: 13, color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}
              >
                {alert.client_name}
              </a>
              <div style={{ display: 'flex', gap: 8 }}>
                {!alert.is_read && (
                  <button
                    onClick={() => markRead(alert.id)}
                    style={{
                      fontSize: 12, color: '#64748b', background: 'none',
                      border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer',
                      padding: '4px 10px', fontFamily: 'inherit',
                    }}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => dismiss(alert.id)}
                  style={{
                    fontSize: 12, color: '#94a3b8', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0',
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  );
};

export default AlertsPage;
