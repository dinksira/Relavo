import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Hash, 
  MessageSquare, 
  DollarSign, 
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Skeleton, { ListSkeleton } from '../components/ui/Skeleton';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import { formatDaysAgo } from '../utils/formatters';
import { getNumericScore } from '../utils/scoreHelpers';
import HealthGauge from '../components/clients/HealthGauge';

const ClientCard = ({ client, onClick, idx }) => {
  const score = getNumericScore(client);
  const status = client.status || 'active';
  const name = client.name || 'Unknown';
  const firstChar = name?.charAt(0).toUpperCase() || '?';
  
  const getRiskStatus = (s) => {
    if (s >= 70) return 'healthy';
    if (s >= 40) return 'attention';
    return 'risk';
  };

  const riskStatus = getRiskStatus(score);

  const statusColors = {
    healthy: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
    attention: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    risk: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
  };

  const statusBadgeStyles = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    paused: "bg-slate-50 text-slate-500 border-slate-100",
    churned: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const getAvatarGradient = (char) => {
    if (char <= 'F') return 'from-blue-600 to-blue-800';
    if (char <= 'M') return 'from-indigo-600 to-indigo-800';
    if (char <= 'S') return 'from-violet-600 to-violet-800';
    return 'from-emerald-600 to-emerald-800';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-slate-100 rounded-[36px] overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
      style={{ transitionDelay: `${idx * 50}ms` }}
    >
      <div className={`h-2 w-full ${statusColors[riskStatus]} animate-pulse`} />
      
      <div className="p-8 pb-6 space-y-8 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-5">
            <div 
              className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${getAvatarGradient(firstChar)} flex items-center justify-center text-white text-[22px] font-black shrink-0 shadow-xl group-hover:rotate-6 transition-transform duration-500`}
            >
              {firstChar}
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="text-[20px] font-black text-slate-900 m-0 truncate tracking-tighter group-hover:text-blue-600 transition-colors italic">{name}</h3>
              <p className="text-[14px] text-slate-400 font-medium m-0 truncate italic">{client.contact_name || 'No Principal Contact'}</p>
              <div className={`mt-3 inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border italic shadow-sm ${statusBadgeStyles[status]}`}>
                {status}
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-1 group-hover:scale-110 transition-transform duration-500">
            <HealthGauge score={score} size={60} strokeWidth={6} showLabel={true} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6 border-y-2 border-slate-50">
           <div className="text-center space-y-1">
              <p className="text-[18px] font-black text-slate-900 m-0 font-mono tracking-tighter">{client.touchpoints_count || 0}</p>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Logs</p>
           </div>
           <div className="text-center space-y-1 border-x-2 border-slate-50">
              <p className="text-[18px] font-black text-slate-900 m-0 font-mono tracking-tighter">{client.invoices_count || 0}</p>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Settled</p>
           </div>
           <div className="text-center space-y-1">
              <p className="text-[18px] font-black text-slate-900 m-0 font-mono tracking-tighter italic">{formatDaysAgo(client.last_contact_date)}</p>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Active</p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-500">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                 <Sparkles size={14} className="text-blue-500 animate-pulse" />
              </div>
              <p className={`text-[13px] leading-relaxed m-0 font-medium italic tracking-tight ${client.latest_health_score?.ai_insight ? 'text-slate-500 line-clamp-2' : 'text-slate-300 line-clamp-2'}`}>
                {client.latest_health_score?.ai_insight || 'AI is aggregating performance data for this relationship...'}
              </p>
           </div>
        </div>
      </div>

      <div className="mt-auto p-5 bg-slate-50/50 flex justify-center border-t-2 border-slate-50 group-hover:bg-blue-50 transition-colors duration-500">
         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-2 italic">
           Manage Asset <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </span>
      </div>
    </div>
  );
};

const ClientsPage = () => {
  const navigate = useNavigate();
  const { clients, loading, addClient } = useClients();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const safeClients = Array.isArray(clients) ? clients : [];

  const filtered = safeClients.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || 
                       c.contact_name?.toLowerCase().includes(search.toLowerCase());
    const score = getNumericScore(c);
    const matchFilter = filter === 'all' || 
                       (filter === 'healthy' && score >= 70) || 
                       (filter === 'warning' && score >= 40 && score < 70) || 
                       (filter === 'risk' && score < 40);
    return matchSearch && matchFilter;
  });

  const filterTabs = [
    { key: 'all', label: 'All Assets', icon: Users },
    { key: 'healthy', label: 'Optimal', icon: Zap },
    { key: 'warning', label: 'Monitor', icon: Clock },
    { key: 'risk', label: 'Critical', icon: Activity },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 reveal">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Relationship Directory</span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 m-0 tracking-tighter leading-tight italic">
            Client <span className="text-blue-600 not-italic">Directory.</span>
          </h1>
          <p className="text-[16px] text-slate-500 m-0 font-medium italic">Relavo Intelligence is currently auditing <span className="text-slate-900 font-bold">{safeClients.length} accounts</span>.</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setShowAddModal(true)}
          className="!h-14 !px-10 !rounded-2xl !font-black !uppercase !text-[11px] !tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          Register Asset
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 bg-white border-2 border-slate-100 p-3 rounded-[32px] shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-[440px]">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search strategic assets..."
            className="w-full h-14 bg-slate-50/50 border-none rounded-2xl pl-14 pr-4 text-[15px] text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium italic"
          />
        </div>

        <div className="flex bg-slate-100/50 p-1 rounded-2xl gap-1 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap flex items-center gap-2 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border-none cursor-pointer italic ${
                filter === tab.key 
                  ? 'bg-white text-blue-600 shadow-sm shadow-blue-500/10' 
                  : 'bg-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="bg-white border-2 border-slate-100 rounded-[40px] p-10 space-y-8 flex flex-col h-[400px]">
               <div className="flex justify-between">
                 <div className="flex gap-5">
                   <div className="w-16 h-16 rounded-[24px] bg-slate-100 animate-pulse" />
                   <div className="space-y-3">
                     <div className="w-40 h-7 bg-slate-100 rounded-lg animate-pulse" />
                     <div className="w-28 h-5 bg-slate-50 rounded-lg animate-pulse" />
                   </div>
                 </div>
                 <div className="w-14 h-14 rounded-full bg-slate-100 animate-pulse" />
               </div>
               <div className="h-20 w-full bg-slate-50 rounded-2xl animate-pulse" />
               <div className="h-24 w-full bg-slate-50 rounded-2xl animate-pulse mt-auto" />
             </div>
           ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-24 text-center bg-white rounded-[48px] border-2 border-slate-100 shadow-sm reveal">
          <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner border border-slate-100">
            <Users size={36} className="text-slate-200" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 m-0 tracking-tighter italic">
            {search ? 'Zero Matches Detected.' : 'No Strategic Assets.'}
          </h2>
          <p className="text-slate-500 mt-4 m-0 max-w-[400px] mx-auto font-medium text-[16px] italic">
            {search ? 'Relavo Intelligence could not find any matching assets. Adjust your search parameters.' : 'Onboard your first client to activate the relationship monitoring engine.'}
          </p>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => { if(search) setSearch(''); else setShowAddModal(true); }}
            className="mt-12 !h-16 !px-12 !rounded-[24px] !text-[12px] shadow-2xl shadow-blue-500/30"
          >
            {search ? 'Reset Parameters' : 'Onboard Client'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8 reveal">
          {filtered.map((client, idx) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              idx={idx}
              onClick={() => navigate(`/clients/${client.id}`)} 
            />
          ))}
        </div>
      )}

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={addClient}
      />
    </DashboardLayout>
  );
};

export default ClientsPage;
