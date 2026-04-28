import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, Plus, ChevronRight, Sparkles, Bell, ArrowUp, ArrowDown, Minus, RefreshCw, Loader2, Zap, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import HealthGauge from '../components/clients/HealthGauge';
import EmptyState from '../components/ui/EmptyState';
import Skeleton, { CardSkeleton, ListSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import useAlerts from '../hooks/useAlerts';
import useAuthStore from '../store/authStore';
import { getRiskLabel, getNumericScore } from '../utils/scoreHelpers';
import { formatDaysAgo } from '../utils/formatters';
import { aiAPI } from '../services/api';
import useToast from '../hooks/useToast';
import ActivityFeed from '../components/team/ActivityFeed';
import useTeamStore from '../store/teamStore';

const MetricWidget = ({ title, value, suffix, trend, color, icon: Icon, loading }) => {
  if (loading) return <CardSkeleton />;
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };
  
  const c = colors[color] || colors.blue;
  const TrendIcon = trend === 'Up' ? TrendingUp : trend === 'Down' ? TrendingDown : Clock;

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 opacity-50 ${c.split(' ')[0]}`} />
      
      <div className="relative z-10 space-y-5">
        <div className="flex justify-between items-center">
           <div className={`w-10 h-10 rounded-xl ${c.split(' ')[0]} flex items-center justify-center`}>
              <Icon size={18} className={c.split(' ')[1]} />
           </div>
           <TrendIcon size={16} className={c.split(' ')[1]} />
        </div>
        
        <div className="space-y-1">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] m-0">{title}</p>
           <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-black tracking-tighter m-0 text-slate-900 leading-none">
                {value}
              </span>
              {suffix && <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{suffix}</span>}
           </div>
        </div>
      </div>
    </div>
  );
};

const ClientRow = ({ client }) => {
  const score = getNumericScore(client);
  const healthScore = client.latest_health_score || client.health_score || {};
  const name = client.name || 'Unknown';
  const firstChar = name.charAt(0).toUpperCase();
  
  const getGradient = (char) => {
    if (char <= 'F') return 'from-blue-600 to-blue-800';
    if (char <= 'M') return 'from-indigo-600 to-indigo-800';
    if (char <= 'S') return 'from-violet-600 to-violet-800';
    return 'from-emerald-600 to-emerald-800';
  };

  return (
    <Link
      to={`/clients/${client.id}`}
      className="flex items-center gap-6 p-6 bg-white border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-all group"
    >
      <div 
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradient(firstChar)} flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}
      >
        {firstChar}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[16px] font-black text-slate-900 m-0 group-hover:text-blue-600 transition-colors truncate tracking-tight">
            {name}
          </p>
          <div className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
        </div>
        <p className="text-[13px] text-slate-400 font-medium m-0 truncate italic">
          {healthScore.ai_insight || 'Aggregating intelligence...'}
        </p>
      </div>
      
      <div className="shrink-0 flex items-center justify-end w-[100px]">
        <HealthGauge 
          score={score} 
          size={50} 
          strokeWidth={5} 
          showLabel={false} 
        />
      </div>

      <div className="text-[11px] font-black text-slate-300 w-[60px] text-right shrink-0 uppercase tracking-wider group-hover:text-slate-500 transition-colors">
        {formatDaysAgo(client.last_contact_date || client.created_at)}
      </div>

      <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
};

const AlertsPanel = ({ alerts, onDismiss }) => {
  const accentColors = { high: 'bg-rose-500', medium: 'bg-amber-500', low: 'bg-blue-500' };
  
  return (
    <div className="premium-card overflow-hidden">
      {(Array.isArray(alerts) ? alerts : []).length === 0 ? (
        <div className="p-16 text-center space-y-4">
           <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto shadow-sm">
             <CheckCircle size={32} className="text-emerald-500" />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-black text-slate-900 m-0">System Optimal.</h3>
             <p className="text-sm text-slate-400 font-medium m-0">No immediate risks detected in your portfolio.</p>
           </div>
        </div>
      ) : (
        alerts.slice(0, 5).map(alert => (
          <div key={alert.id} className="p-6 border-b border-slate-50 last:border-b-0 relative group hover:bg-slate-50 transition-all">
            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${accentColors[alert.severity] || 'bg-blue-500'}`} />
            
            <div className="flex justify-between items-start mb-2 pl-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-black text-slate-900 tracking-tight">{alert.client_name}</span>
                <Badge variant={alert.severity === 'high' ? 'danger' : 'neutral'} className="!text-[8px] !px-2 !py-0 !rounded-full !font-black uppercase tracking-widest border-none">
                  {alert.type || 'Alert'}
                </Badge>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDaysAgo(alert.created_at)}</span>
            </div>
            
            <p className="text-[13px] text-slate-500 pl-2 leading-relaxed m-0 font-medium">{alert.message}</p>
            
            <div className="flex items-center justify-between mt-4 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {alert.suggestion && (
                <div className="flex gap-2 items-center text-[11px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                  <Sparkles size={12} />
                  <span>AI Insight Ready</span>
                </div>
               )}
               <button
                 onClick={() => onDismiss(alert.id)}
                 className="text-[11px] font-black text-slate-400 uppercase hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer tracking-widest"
               >
                 Dismiss
               </button>
            </div>
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
  const isTeamMode = useTeamStore(s => s.isTeamMode);
  const { clients, loading, addClient, analyzeClient, refreshClients, healthyCount, warningCount, atRiskCount, sortedByScore } = useClients();
  const { alerts, dismiss } = useAlerts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Member';

  const handleAddClient = async (data) => {
    const newClient = await addClient(data);
    analyzeClient(newClient.id);
    return newClient;
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await aiAPI.recalculateAll();
      toast.success('Analytics intelligence updated.');
      if (refreshClients) await refreshClients();
      else window.location.reload(); 
    } catch (err) {
      toast.error('Sync failed.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // if (loading) return <LoadingScreen />; // Removed in favor of component-level skeletons

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 reveal overflow-hidden bg-white border border-slate-200 rounded-[32px] p-8 lg:p-10 shadow-sm relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-[36px] font-black text-slate-900 m-0 tracking-tighter leading-tight italic">
            {greeting}, <span className="text-blue-600 font-black not-italic">{firstName}</span>.
          </h1>
          <p className="text-[15px] text-slate-500 mt-2 m-0 font-medium">Relavo Intelligence is monitoring <span className="text-slate-900 font-bold">{loading ? '...' : clients.length} relationships</span> across your portfolio.</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            loading={isRefreshing}
            onClick={handleRefreshAll}
            className="!h-12 !px-6 !rounded-2xl !bg-white hover:!bg-slate-50 !font-black !uppercase !text-[11px] !tracking-widest"
          >
            Deep Sync
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => setShowAddModal(true)}
            className="!h-12 !px-8 !rounded-2xl !font-black !uppercase !text-[11px] !tracking-widest shadow-lg shadow-blue-500/20"
          >
            New Client
          </Button>
        </div>
      </div>

      {/* High-Fidelity Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 reveal" style={{ transitionDelay: '100ms' }}>
        <MetricWidget 
           title="Active Accounts" 
           value={clients.length} 
           icon={Users} 
           color="blue" 
           trend="Up" 
           loading={loading}
        />
        <MetricWidget 
           title="Optimal Assets" 
           value={healthyCount} 
           suffix="Live"
           icon={CheckCircle} 
           color="emerald" 
           trend="Up" 
           loading={loading}
        />
        <MetricWidget 
           title="Monitor List" 
           value={warningCount} 
           suffix="Alerts"
           icon={AlertTriangle} 
           color="amber" 
           trend="Steady" 
           loading={loading}
        />
        <MetricWidget 
           title="Churn Risk" 
           value={atRiskCount} 
           suffix="Critical"
           icon={XCircle} 
           color="rose" 
           trend="Down" 
           loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Relationship Health Ledger */}
        <div className="space-y-6 reveal" style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[18px] font-black text-slate-900 tracking-tight m-0 flex items-center gap-3">
               <Zap size={20} className="text-blue-600" />
               Clients
            </h2>
            <Link to="/clients" className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors no-underline">
              Full Directory &rarr;
            </Link>
          </div>

          <div className="premium-card overflow-hidden">
            {loading ? (
              <ListSkeleton />
            ) : sortedByScore.length === 0 ? (
              <EmptyState 
                title="No clients found." 
                subtitle="Relavo predicts churn by analyzing client data. Add your first client to activate the intelligence engine." 
                icon={Users}
                action={() => setShowAddModal(true)}
                actionLabel="Onboard Client"
              />
            ) : (
              <div className="divide-y divide-slate-50">
                {sortedByScore.map(client => (
                  <ClientRow
                    key={client.id}
                    client={client}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Stream */}
        <div className="space-y-6 reveal" style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[18px] font-black text-slate-900 tracking-tight m-0 flex items-center gap-3">
              <Bell size={20} className="text-rose-500" />
              Intelligence Stream
            </h2>
            <Link to="/alerts" className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors no-underline">
              History &rarr;
            </Link>
          </div>
          <AlertsPanel alerts={alerts} onDismiss={dismiss} />

          {/* Team Activity Feed — only visible in team mode */}
          {isTeamMode && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-[18px] font-black text-slate-900 tracking-tight m-0 flex items-center gap-3">
                  <Users size={20} className="text-violet-500" />
                  Team Pulse
                </h2>
              </div>
              <ActivityFeed limit={8} />
            </div>
          )}
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
