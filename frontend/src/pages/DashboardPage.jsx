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
import { getRiskLabel } from '../utils/scoreHelpers';
import { formatDaysAgo } from '../utils/formatters';
import { aiAPI } from '../services/api';
import useToast from '../hooks/useToast';

const MetricCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle, valueColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 150ms',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, margin: 0 }}>{title}</p>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: iconBg || '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={iconColor || '#3b82f6'} />
        </div>
      </div>
      <p style={{ fontSize: 32, fontWeight: 600, color: valueColor || '#0f172a', margin: '8px 0 4px', lineHeight: 1 }}>
        {value}
      </p>
      {subtitle && <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
    </div>
  );
};

const ClientRow = ({ client, onClick, onRefresh }) => {
  const [hovered, setHovered] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Prioritize the absolute latest score we have in local state
  const healthScore = client.latest_health_score || client.health_score || {};
  const score = healthScore.score || 0;
  
  // Trend calculation
  const prevScore = client.previous_score || score;
  const TrendIcon = score > prevScore ? ArrowUp : score < prevScore ? ArrowDown : Minus;
  const trendColor = score > prevScore ? '#16a34a' : score < prevScore ? '#dc2626' : '#94a3b8';

  const badgeVariant = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'danger';

  // AI Insight Logic
  const hasInsight = !!healthScore.ai_insight;
  // It's calculating if we have a score (from DB) but no narrative insight yet
  const isCalculating = score > 0 && !hasInsight; 

  const handleCardClick = (e) => {
    // If the click was on the retry button, don't navigate
    if (e.target.closest('button')) {
      return;
    }
    console.log('Link clicked for client:', client.id);
  };

  const [retryCount, setRetryCount] = useState(0);

  const handleManualRetry = async (e) => {
    if (e) e.stopPropagation();
    setIsRetrying(true);
    await onRefresh(client.id);
    setIsRetrying(false);
    setRetryCount(0); // Reset count after manual attempt
  };

  useEffect(() => {
    // If calculating, check again in 5 seconds, up to 3 times
    let timer;
    if (isCalculating && retryCount < 3) {
      timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        onRefresh(client.id);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isCalculating, client.id, retryCount]);

  return (
    <Link
      to={`/clients/${client.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px', background: hovered ? '#f8fafc' : '#fff',
        border: `1px solid ${hovered ? '#d1d5db' : '#e2e8f0'}`,
        borderRadius: 12, marginBottom: 12, cursor: 'pointer',
        transition: 'all 150ms',
        boxShadow: hovered ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <Avatar name={client.name} size="md" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', truncate: true }}>{client.name}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {hasInsight ? (
            <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', margin: 0, truncate: true }}>
              {healthScore.ai_insight.length > 60 ? healthScore.ai_insight.substring(0, 60) + '...' : healthScore.ai_insight}
            </p>
          ) : isCalculating && retryCount < 3 ? (
            <p style={{ fontSize: 12, color: '#3b82f6', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Loader2 size={12} className="animate-spin" />
              Analyzing health data...
            </p>
          ) : (
            <button 
              onClick={handleManualRetry}
              disabled={isRetrying}
              style={{
                fontSize: 12, color: '#3b82f6', fontWeight: 600, padding: 0,
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                position: 'relative', zIndex: 10
              }}
            >
              <Sparkles size={12} />
              {isRetrying ? 'Analyzing...' : retryCount >= 3 ? 'AI Timeout: Try again' : 'Generate AI Insight'}
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendIcon size={14} color={trendColor} />
          <HealthGauge score={score} size="xs" />
        </div>
        <div style={{ width: 85 }}>
          <Badge variant={badgeVariant} size="sm">{getRiskLabel(score)}</Badge>
        </div>
      </div>

      <p style={{ width: 70, fontSize: 12, color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>
        {formatDaysAgo(client.last_contact_date)}
      </p>
      <ChevronRight size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
    </Link>
  );
};

const AlertsPanel = ({ alerts, onDismiss }) => {
  const severityColors = { high: '#dc2626', medium: '#d97706', low: '#3b82f6' };
  const shown = alerts.slice(0, 5);
  return (
    <div>
      {shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Bell size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', margin: '0 0 4px' }}>All caught up!</p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No active alerts</p>
        </div>
      ) : shown.map(alert => (
        <div key={alert.id} style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderLeft: `4px solid ${severityColors[alert.severity] || '#3b82f6'}`,
          borderRadius: '0 8px 8px 0',
          padding: '12px 14px', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{alert.client_name || 'Client'}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{formatDaysAgo(alert.created_at)}</p>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{alert.message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onDismiss(alert.id)}
              style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', margin: 0 }}>
            {greeting}, {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>Here's your client health overview</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            loading={isRefreshing}
            onClick={handleRefreshAll}
          >
            Refresh AI Scores
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>Add Client</Button>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <MetricCard title="Total Clients" value={clients.length} icon={Users} iconColor="#3b82f6" iconBg="#eff6ff" subtitle="Active accounts" />
        <MetricCard title="Healthy" value={healthyCount} icon={CheckCircle} iconColor="#16a34a" iconBg="#dcfce7" subtitle="Score 70–100" valueColor="#16a34a" />
        <MetricCard title="Need Attention" value={warningCount} icon={AlertTriangle} iconColor="#d97706" iconBg="#fef9c3" subtitle="Score 40–69" valueColor="#d97706" />
        <MetricCard title="At Risk" value={atRiskCount} icon={XCircle} iconColor="#dc2626" iconBg="#fee2e2" subtitle="Score 0–39" valueColor="#dc2626" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: 24 }}>
        {/* Left: Client list */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>Client health overview</p>
              <Badge variant="neutral">{clients.length}</Badge>
            </div>
            <a href="/clients" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
          </div>

          {loading ? (
            <LoadingSkeleton variant="row" count={4} />
          ) : sortedByScore.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              subtitle="Add your first client to start monitoring their relationship health"
              actionLabel="Add your first client"
              action={() => setShowAddModal(true)}
            />
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

        {/* Right: Alerts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>Smart Alerts</p>
              <Badge variant="info">{alerts.filter(a => !a.read).length}</Badge>
            </div>
            <a href="/alerts" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
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
