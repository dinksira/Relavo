import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Sparkles, Filter, ChevronRight, Hash, MessageSquare, DollarSign, Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Skeleton, { ListSkeleton } from '../components/ui/Skeleton';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import { formatDaysAgo } from '../utils/formatters';
import { getNumericScore } from '../utils/scoreHelpers';
import HealthGauge from '../components/clients/HealthGauge';

const ClientCard = ({ client, onClick }) => {
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
    healthy: 'bg-emerald-500',
    attention: 'bg-amber-500',
    risk: 'bg-rose-500',
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
      className="bg-white border border-slate-200 rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full"
    >
      <div className={`h-1.5 w-full ${statusColors[riskStatus]}`} />
      
      <div className="p-8 pb-6 space-y-6 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(firstChar)} flex items-center justify-center text-white text-[20px] font-black shrink-0 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}
            >
              {firstChar}
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="text-[18px] font-black text-slate-900 m-0 truncate tracking-tight group-hover:text-blue-600 transition-colors">{name}</h3>
              <p className="text-[13px] text-slate-400 font-medium m-0 truncate">{client.contact_name || 'No Principal Contact'}</p>
              <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusBadgeStyles[status]}`}>
                {status}
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-1">
            <HealthGauge score={score} size={54} strokeWidth={5} showLabel={true} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50">
           <div className="text-center space-y-1">
              <p className="text-sm font-black text-slate-900 m-0">{client.touchpoints_count || 0}</p>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Logs</p>
           </div>
           <div className="text-center space-y-1 border-x border-slate-50">
              <p className="text-sm font-black text-slate-900 m-0">{client.invoices_count || 0}</p>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Invoiced</p>
           </div>
           <div className="text-center space-y-1">
              <p className="text-sm font-black text-slate-900 m-0">{formatDaysAgo(client.last_contact_date)}</p>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active</p>
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-start gap-2 group-hover:translate-x-1 transition-transform">
              <Sparkles size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className={`text-[12px] leading-relaxed m-0 font-medium italic ${client.latest_health_score?.ai_insight ? 'text-slate-500 line-clamp-2' : 'text-slate-300 line-clamp-2'}`}>
                {client.latest_health_score?.ai_insight || 'AI is aggregating performance data for this relationship...'}
              </p>
           </div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-slate-50/50 flex justify-center border-t border-slate-50">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
           Manage Asset &rarr;
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
    { key: 'healthy', label: 'Optimal', icon: Filter },
    { key: 'warning', label: 'Monitor', icon: Clock },
    { key: 'risk', label: 'Critical', icon: Filter },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 m-0 tracking-tighter leading-tight italic">
            Client <span className="text-blue-600 not-italic">Directory.</span>
          </h1>
          <p className="text-[15px] text-slate-500 mt-1 m-0 font-medium">Relavo Intelligence is currently auditing <span className="text-slate-900 font-bold">{safeClients.length} accounts</span>.</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setShowAddModal(true)}
          className="!h-12 !px-8 !rounded-2xl !font-black !uppercase !text-[11px] !tracking-widest shadow-lg shadow-blue-500/10"
        >
          Register Asset
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white border border-slate-200 p-3 rounded-[24px] shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-[400px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full h-12 bg-slate-50/50 border-none rounded-2xl pl-12 pr-4 text-[14px] text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap flex items-center gap-2 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
                filter === tab.key 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'bg-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="premium-card p-8 space-y-6 flex flex-col h-[340px]">
               <div className="flex justify-between">
                 <div className="flex gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-slate-100 animate-pulse" />
                   <div className="space-y-2">
                     <div className="w-32 h-6 bg-slate-100 rounded-lg animate-pulse" />
                     <div className="w-24 h-4 bg-slate-50 rounded-lg animate-pulse" />
                   </div>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
               </div>
               <div className="h-16 w-full bg-slate-50 rounded-2xl animate-pulse" />
               <div className="h-20 w-full bg-slate-50 rounded-2xl animate-pulse mt-auto" />
             </div>
           ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[40px] border border-slate-200 shadow-sm reveal">
          <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Users size={32} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 m-0 tracking-tight italic">
            {search ? 'No Matches Found.' : 'No Clients Onboarded.'}
          </h2>
          <p className="text-slate-500 mt-3 m-0 max-w-[360px] mx-auto font-medium text-[15px]">
            {search ? 'Relavo Intelligence could not find any matching clients. Try adjusting your parameters.' : 'Onboard your first client to activate the relationship monitoring engine.'}
          </p>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => { if(search) setSearch(''); else setShowAddModal(true); }}
            className="mt-10 !h-14 !px-10 !rounded-3xl"
          >
            {search ? 'Reset Parameters' : 'Onboard Client'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6 reveal">
          {filtered.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
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
