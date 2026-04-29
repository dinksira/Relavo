import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Bell, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  RefreshCw, 
  Loader2, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  Activity,
  ShieldCheck
} from 'lucide-react';
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

const MetricWidget = ({ title, value, suffix, trend, color, icon: Icon, loading, delay = "0ms" }) => {
  if (loading) return <CardSkeleton />;
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/20",
  };
  
  const c = colors[color] || colors.blue;
  const TrendIcon = trend === 'Up' ? TrendingUp : trend === 'Down' ? TrendingDown : Clock;

  return (
    <div 
      className="bg-white border-2 border-slate-100 rounded-[36px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative animate-in fade-in slide-in-from-bottom-4"
      style={{ transitionDelay: delay }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] -mr-16 -mt-16 opacity-40 transition-opacity group-hover:opacity-60 ${c.split(' ')[0]}`} />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
           <div className={`w-14 h-14 rounded-2xl ${c.split(' ')[0]} flex items-center justify-center border ${c.split(' ')[2]} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              <Icon size={24} className={c.split(' ')[1]} />
           </div>
           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.split(' ')[0]} ${c.split(' ')[1]}`}>
              <TrendIcon size={12} />
              {trend}
           </div>
        </div>
        
        <div className="space-y-1">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] m-0">{title}</p>
           <div className="flex items-baseline gap-2">
              <span className="text-[36px] font-black tracking-tighter m-0 text-slate-900 leading-none italic">
                {value}
              </span>
              {suffix && <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none italic">{suffix}</span>}
           </div>
        </div>
      </div>
    </div>
  );
};

const ClientRow = ({ client, idx }) => {
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
      className="flex items-center gap-6 p-6 bg-white border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-all group animate-in fade-in slide-in-from-bottom-2"
      style={{ transitionDelay: `${idx * 50}ms` }}
    >
      <div 
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(firstChar)} flex items-center justify-center text-white text-[18px] font-black shrink-0 shadow-2xl group-hover:rotate-6 transition-transform`}
      >
        {firstChar}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-[17px] font-black text-slate-900 m-0 group-hover:text-blue-600 transition-colors truncate tracking-tighter italic">
            {name}
          </p>
          <div className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : score >= 40 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'} animate-pulse`} />
        </div>
        <p className="text-[13px] text-slate-400 font-medium m-0 truncate italic opacity-80">
          {healthScore.ai_insight || 'Aggregating intelligence...'}
        </p>
      </div>
      
      <div className="shrink-0 flex items-center justify-end w-[120px]">
        <HealthGauge 
          score={score} 
          size={56} 
          strokeWidth={6} 
          showLabel={false} 
        />
      </div>

      <div className="text-[10px] font-black text-slate-300 w-[70px] text-right shrink-0 uppercase tracking-[0.2em] group-hover:text-slate-500 transition-colors italic">
        {formatDaysAgo(client.last_contact_date || client.created_at)}
      </div>

      <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-2 transition-all shrink-0" />
    </Link>
  );
};

const AlertsPanel = ({ alerts, onDismiss }) => {
  const accentColors = { 
    high: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]', 
    medium: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]', 
    low: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]' 
  };
  
  return (
    <div className="premium-card overflow-hidden !rounded-[36px]">
      {(Array.isArray(alerts) ? alerts : []).length === 0 ? (
        <div className="p-20 text-center space-y-6">
           <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
             <ShieldCheck size={36} className="text-emerald-500" />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-black text-slate-900 m-0 italic">System Optimal.</h3>
             <p className="text-sm text-slate-400 font-medium m-0 italic">Intelligence confirms zero high-risk anomalies.</p>
           </div>
        </div>
      ) : (
        alerts.slice(0, 5).map((alert, idx) => (
          <div 
            key={alert.id} 
            className="p-8 border-b border-slate-50 last:border-b-0 relative group hover:bg-slate-50 transition-all animate-in fade-in slide-in-from-right-4"
            style={{ transitionDelay: `${idx * 75}ms` }}
          >
            <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full ${accentColors[alert.severity] || 'bg-blue-500'}`} />
            
            <div className="flex justify-between items-start mb-3 pl-4">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-black text-slate-900 tracking-tighter italic">{alert.client_name}</span>
                <Badge variant={alert.severity === 'high' ? 'danger' : 'neutral'} className="!text-[9px] !px-3 !py-0.5 !rounded-lg !font-black uppercase tracking-[0.15em] border-none shadow-sm">
                  {alert.type || 'Alert'}
                </Badge>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">{formatDaysAgo(alert.created_at)}</span>
            </div>
            
            <p className="text-[14px] text-slate-500 pl-4 leading-relaxed m-0 font-medium italic opacity-90">{alert.message}</p>
            
            <div className="flex items-center justify-between mt-6 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {alert.suggestion && (
                <div className="flex gap-2 items-center text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Strategic Insight</span>
                </div>
               )}
               <button
                 onClick={() => onDismiss(alert.id)}
                 className="text-[10px] font-black text-slate-300 uppercase hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer tracking-[0.2em] italic"
               >
                 Archive
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

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 reveal overflow-hidden bg-white border-2 border-slate-100 rounded-[40px] p-10 lg:p-12 shadow-sm relative group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover:bg-blue-100/50 transition-colors duration-1000" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse" />
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Intelligence Engine Online</span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 m-0 tracking-tighter leading-tight italic">
            {greeting}, <span className="text-blue-600 font-black not-italic">{firstName}</span>.
          </h1>
          <p className="text-[16px] text-slate-500 m-0 font-medium italic">Relavo is auditing <span className="text-slate-900 font-bold">{loading ? '...' : clients.length} strategic assets</span> across your network.</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            loading={isRefreshing}
            onClick={handleRefreshAll}
            className="!h-14 !px-8 !rounded-2xl !bg-white hover:!bg-slate-50 !font-black !uppercase !text-[11px] !tracking-[0.2em] border-2 shadow-sm"
          >
            Deep Sync
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => setShowAddModal(true)}
            className="!h-14 !px-10 !rounded-2xl !font-black !uppercase !text-[11px] !tracking-[0.2em] shadow-2xl shadow-blue-600/30 active:scale-95 transition-all"
          >
            New Client
          </Button>
        </div>
      </div>

      {/* High-Fidelity Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <MetricWidget 
           title="Active Accounts" 
           value={clients.length} 
           icon={Users} 
           color="blue" 
           trend="Up" 
           loading={loading}
           delay="0ms"
        />
        <MetricWidget 
           title="Optimal Assets" 
           value={healthyCount} 
           suffix="Live"
           icon={CheckCircle} 
           color="emerald" 
           trend="Up" 
           loading={loading}
           delay="100ms"
        />
        <MetricWidget 
           title="Monitor List" 
           value={warningCount} 
           suffix="Alerts"
           icon={AlertTriangle} 
           color="amber" 
           trend="Steady" 
           loading={loading}
           delay="200ms"
        />
        <MetricWidget 
           title="Churn Risk" 
           value={atRiskCount} 
           suffix="Critical"
           icon={XCircle} 
           color="rose" 
           trend="Down" 
           loading={loading}
           delay="300ms"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">
        {/* Relationship Health Ledger */}
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-[20px] font-black text-slate-900 tracking-tighter m-0 flex items-center gap-3 italic">
               <Zap size={22} className="text-blue-600" />
               Client <span className="text-blue-600 not-italic">Ledger.</span>
            </h2>
            <Link to="/clients" className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-all no-underline flex items-center gap-2 group/link">
              Directory
              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="premium-card overflow-hidden !rounded-[40px] border-2 border-slate-100 shadow-sm">
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
                {sortedByScore.map((client, idx) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    idx={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Stream */}
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-[20px] font-black text-slate-900 tracking-tighter m-0 flex items-center gap-3 italic">
              <Activity size={22} className="text-rose-500" />
              Intelligence <span className="text-rose-500 not-italic">Pulse.</span>
            </h2>
            <Link to="/alerts" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all no-underline">
              History
            </Link>
          </div>
          <AlertsPanel alerts={alerts} onDismiss={dismiss} />

          {/* Team Activity Feed — only visible in team mode */}
          {isTeamMode && (
            <div className="mt-12 space-y-6">
              <div className="flex justify-between items-center px-4">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tighter m-0 flex items-center gap-3 italic">
                  <Users size={22} className="text-violet-500" />
                  Team <span className="text-violet-500 not-italic">Pulse.</span>
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
