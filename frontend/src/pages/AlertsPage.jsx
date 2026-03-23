import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, RefreshCw, Zap } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import useAlerts from '../hooks/useAlerts';
import { formatDaysAgo } from '../utils/formatters';

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

  const severityColors = { 
    high: { accent: '#dc2626', bg: '#fef2f2', text: '#dc2626' },
    medium: { accent: '#d97706', bg: '#fffbeb', text: '#d97706' },
    low: { accent: '#3b82f6', bg: '#eff6ff', text: '#3b82f6' }
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] m-0">Smart Alerts</h1>
          <p className="text-[14px] text-[#64748b] mt-1 m-0">
            {unreadCount > 0 ? `${unreadCount} unread alerts` : 'No unread alerts'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] bg-transparent border-none cursor-pointer transition-colors"
            >
              Mark all as read
            </button>
          )}
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            onClick={() => window.location.reload()}
            className="!h-[38px] !rounded-[9px]"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#f1f5f9] p-1 rounded-[10px] gap-1 self-start mb-6 w-fit">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-[14px] py-[6px] rounded-[7px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer flex items-center gap-1.5 ${
              filter === tab.key 
                ? 'bg-white text-[#0f172a] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]' 
                : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            {tab.label}
            <span className={`text-[11px] font-bold px-1.5 rounded-full ${
              filter === tab.key ? 'text-[#3b82f6]' : 'text-[#94a3b8]'
            }`}>
              ({counts[tab.key]})
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-[10px]">
        {loading ? (
          <div className="p-8 text-center text-[#94a3b8]">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-[14px] border border-[#e2e8f0]">
            <div className="w-[80px] h-[80px] bg-[#f1f5f9] rounded-[20px] flex items-center justify-center mx-auto mb-5">
              <Bell size={36} className="text-[#94a3b8]" />
            </div>
            <h2 className="text-[18px] font-semibold text-[#374151] m-0">You're all caught up!</h2>
            <p className="text-[14px] text-[#94a3b8] mt-2 m-0 max-w-[400px] mx-auto">
              No alerts right now. Relavo will notify you when a client needs attention.
            </p>
          </div>
        ) : (
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(alert => {
            const colors = severityColors[alert.severity] || severityColors.low;
            return (
              <div key={alert.id} className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex">
                <div 
                  className="w-1 shrink-0" 
                  style={{ backgroundColor: colors.accent }}
                />
                <div className="p-[16px_20px] flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-[4px]"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {alert.severity}
                      </span>
                      <span 
                        className="text-[14px] font-semibold text-[#0f172a] cursor-pointer hover:text-[#3b82f6]"
                        onClick={() => navigate(`/clients/${alert.client_id}`)}
                      >
                        {alert.client_name}
                      </span>
                      <span className="text-[11px] bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-[4px]">
                        {alert.type || 'Alert'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#94a3b8]">{formatDaysAgo(alert.created_at)}</span>
                  </div>

                  <p className="text-[15px] font-medium text-[#0f172a] mt-2 mb-0 leading-[1.5]">
                    {alert.message}
                  </p>

                  {(alert.ai_suggestion || alert.suggestion) && (
                    <div className="mt-[10px] bg-[#f8fafc] border border-[#f1f5f9] rounded-[8px] p-[10px_14px] flex gap-2 items-start">
                      <Zap size={14} className="text-[#3b82f6] shrink-0 mt-0.5" />
                      <p className="text-[13px] text-[#374151] leading-[1.6] m-0">
                        {alert.ai_suggestion || alert.suggestion}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-3 items-center">
                    {!alert.is_read && (
                      <button
                        onClick={() => markRead(alert.id)}
                        className="text-[13px] font-medium text-[#3b82f6] bg-transparent border border-[#bfdbfe] rounded-[6px] px-3 py-[5px] cursor-pointer hover:bg-[#eff6ff] transition-all duration-150"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="text-[13px] font-medium text-[#94a3b8] bg-transparent border-none cursor-pointer hover:text-[#dc2626] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;
