import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, Plus, ChevronRight, Sparkles, Bell, ArrowUp, ArrowDown, Minus, RefreshCw, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import HealthGauge from '../components/ui/HealthGauge';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import Button from '../components/ui/Button';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import useAlerts from '../hooks/useAlerts';
import useAuthStore from '../store/authStore';
import { getRiskLabel, getNumericScore } from '../utils/scoreHelpers';
import { formatDaysAgo } from '../utils/formatters';
import { aiAPI } from '../services/api';
import useToast from '../hooks/useToast';

const MetricCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle, valueColor, borderTopColor }) => {
  return (
    <div
      className="bg-white border border-[#e2e8f0] rounded-[14px] p-[20px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]"
      style={borderTopColor ? { borderTop: `3px solid ${borderTopColor}` } : {}}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-medium uppercase text-[#94a3b8] tracking-[0.05em] m-0">{title}</p>
          <p className="text-[36px] font-bold text-[#0f172a] mt-2 mb-0 leading-none" style={valueColor ? { color: valueColor } : {}}>
            {value}
          </p>
          {subtitle && <p className="text-[13px] text-[#94a3b8] mt-1 m-0">{subtitle}</p>}
        </div>
        <div 
          className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={20} color={iconColor} />
        </div>
      </div>
    </div>
  );
};

const ClientRow = ({ client, onRefresh }) => {
  const score = getNumericScore(client);
  const healthScore = client.latest_health_score || client.health_score || {};
  
  const scoreBadgeStyles = {
    healthy: "bg-[#f0fdf4] text-[#16a34a]",
    warning: "bg-[#fffbeb] text-[#d97706]",
    danger: "bg-[#fef2f2] text-[#dc2626]",
  };

  const status = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'danger';
  const barColor = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626';

  const name = client.name || 'Unknown Client';
  const firstChar = name.charAt(0).toUpperCase();
  
  const getGradient = (char) => {
    if (char <= 'F') return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    if (char <= 'M') return 'linear-gradient(135deg, #7c3aed, #5b21b6)';
    if (char <= 'S') return 'linear-gradient(135deg, #0891b2, #0e7490)';
    return 'linear-gradient(135deg, #059669, #047857)';
  };

  return (
    <Link
      to={`/clients/${client.id}`}
      className="flex items-center gap-[14px] p-[16px_20px] bg-white border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] transition-colors duration-150 group"
    >
      <div 
        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-sm"
        style={{ background: getGradient(firstChar) }}
      >
        {firstChar}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#0f172a] m-0 group-hover:text-[#3b82f6] transition-colors truncate">
          {name}
        </p>
        <p className="text-[12px] text-[#64748b] m-0 truncate font-normal">
          {healthScore.ai_insight || 'No recent insights available'}
        </p>
      </div>
      
      <div className="w-[120px] shrink-0">
        <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className={`p-1 px-[10px] rounded-full text-[12px] font-semibold shrink-0 min-w-[32px] text-center ${scoreBadgeStyles[status]}`}>
        {score}
      </div>

      <div className="text-[12px] text-[#94a3b8] w-[70px] text-right shrink-0">
        {formatDaysAgo(client.last_contact_date)}
      </div>

      <ChevronRight size={14} className="text-[#cbd5e1] group-hover:text-[#94a3b8] transition-colors shrink-0" />
    </Link>
  );
};

const AlertsPanel = ({ alerts, onDismiss }) => {
  const accentColors = { high: '#dc2626', medium: '#d97706', low: '#3b82f6' };
  
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {alerts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-[60px] h-[60px] bg-[#f1f5f9] rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-[#94a3b8]" />
          </div>
          <p className="text-[16px] font-semibold text-[#374151] m-0">No active alerts</p>
          <p className="text-[14px] text-[#94a3b8] mt-1.5 m-0">You're all caught up!</p>
        </div>
      ) : (
        alerts.slice(0, 5).map(alert => (
          <div key={alert.id} className="p-[14px_16px_14px_19px] border-b border-[#f8fafc] last:border-b-0 relative group">
            <div 
              className="absolute left-0 top-0 bottom-0 w-[3px]" 
              style={{ backgroundColor: accentColors[alert.severity] || '#3b82f6' }}
            />
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-[#0f172a]">{alert.client_name}</span>
                <span className="text-[11px] font-medium bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[4px] uppercase">
                  {alert.type || 'Alert'}
                </span>
              </div>
              <span className="text-[11px] text-[#94a3b8]">{formatDaysAgo(alert.created_at)}</span>
            </div>
            <p className="text-[13px] text-[#374151] mt-1 leading-[1.5] m-0">{alert.message}</p>
            {alert.suggestion && (
              <div className="flex gap-1 items-start mt-1 text-[12px] text-[#64748b] italic">
                <Sparkles size={12} className="text-[#3b82f6] shrink-0 mt-0.5" />
                <span>{alert.suggestion}</span>
              </div>
            )}
            <button
              onClick={() => onDismiss(alert.id)}
              className="mt-2 text-[12px] text-[#94a3b8] hover:text-[#dc2626] transition-colors block ml-auto bg-transparent border-none cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore(s => s.user);
  const { clients, loading, addClient, analyzeClient, refreshClients, healthyCount, warningCount, atRiskCount, sortedByScore } = useClients();
  const { alerts, dismiss } = useAlerts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  const handleAddClient = async (data) => {
    const newClient = await addClient(data);
    // Immediately trigger AI health score
    analyzeClient(newClient.id); // This will update the client in local state when done
    return newClient;
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await aiAPI.recalculateAll();
      toast.success('All scores updated!');
      // Refresh local client list
      if (refreshClients) await refreshClients();
      else window.location.reload(); 
    } catch (err) {
      toast.error('Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Greeting and Header Section */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] m-0 leading-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1 m-0">Here's your client health overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            loading={isRefreshing}
            onClick={handleRefreshAll}
            className="!h-[38px] !rounded-[9px] !text-[13px] !font-medium"
          >
            Refresh AI Scores
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => setShowAddModal(true)}
            className="!h-[38px] !rounded-[9px] !text-[13px] !font-semibold"
          >
            Add Client
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Clients" 
          value={clients.length} 
          icon={Users} 
          iconColor="#3b82f6" 
          iconBg="#eff6ff" 
          subtitle="Active accounts" 
        />
        <MetricCard 
          title="Healthy" 
          value={healthyCount} 
          icon={CheckCircle} 
          iconColor="#16a34a" 
          iconBg="#f0fdf4" 
          subtitle="Score 70–100" 
          valueColor="#16a34a"
          borderTopColor="#16a34a"
        />
        <MetricCard 
          title="Need Attention" 
          value={warningCount} 
          icon={AlertTriangle} 
          iconColor="#d97706" 
          iconBg="#fffbeb" 
          subtitle="Score 40–69" 
          valueColor="#d97706"
          borderTopColor="#d97706"
        />
        <MetricCard 
          title="At Risk" 
          value={atRiskCount} 
          icon={XCircle} 
          iconColor="#dc2626" 
          iconBg="#fef2f2" 
          subtitle="Score 0–39" 
          valueColor="#dc2626"
          borderTopColor="#dc2626"
        />
      </div>

      {/* Main Content — Two Columns */}
      <div className="grid grid-cols-[65%_35%] gap-5">
        {/* Left Column: Client list */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#0f172a] m-0">Client health overview</h2>
              <span className="bg-[#f1f5f9] text-[#64748b] text-[12px] font-semibold px-2 py-0.5 rounded-full">
                {clients.length}
              </span>
            </div>
            <Link to="/clients" className="text-[13px] font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors no-underline">
              View all →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton variant="row" count={4} />
              </div>
            ) : sortedByScore.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-[60px] h-[60px] bg-[#f1f5f9] rounded-[16px] flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-[#94a3b8]" />
                </div>
                <p className="text-[16px] font-semibold text-[#374151] m-0">No clients yet</p>
                <p className="text-[14px] text-[#94a3b8] mt-1.5 m-0">Add your first client to start monitoring their relationship health</p>
                <Button 
                  variant="primary" 
                  icon={Plus} 
                  onClick={() => setShowAddModal(true)}
                  className="mt-5"
                >
                  Add your first client
                </Button>
              </div>
            ) : (
              sortedByScore.map(client => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onRefresh={analyzeClient}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Alerts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#0f172a] m-0">Smart alerts</h2>
              <span className="bg-[#eff6ff] text-[#3b82f6] text-[12px] font-semibold px-2 py-0.5 rounded-full">
              {(Array.isArray(alerts) ? alerts : []).filter(a => !a.read).length}
              </span>
            </div>
            <Link to="/alerts" className="text-[13px] font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors no-underline">
              View all →
            </Link>
          </div>
          <AlertsPanel alerts={alerts} onDismiss={dismiss} />
        </div>
      </div>

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddClient}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
