import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import { formatDaysAgo } from '../utils/formatters';
import { getNumericScore } from '../utils/scoreHelpers';

const ClientCard = ({ client, onClick }) => {
  const score = getNumericScore(client);
  const status = client.status || 'active';
  
  const getRiskStatus = (s) => {
    if (s >= 70) return 'healthy';
    if (s >= 40) return 'attention';
    return 'risk';
  };

  const riskStatus = getRiskStatus(score);

  const topStripGradients = {
    healthy: 'linear-gradient(90deg, #16a34a, #22c55e)',
    attention: 'linear-gradient(90deg, #d97706, #f59e0b)',
    risk: 'linear-gradient(90deg, #dc2626, #ef4444)',
  };

  const firstChar = client.name?.charAt(0).toUpperCase() || '?';
  const getAvatarGradient = (char) => {
    if (char <= 'F') return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    if (char <= 'M') return 'linear-gradient(135deg, #7c3aed, #5b21b6)';
    if (char <= 'S') return 'linear-gradient(135deg, #0891b2, #0e7490)';
    return 'linear-gradient(135deg, #059669, #047857)';
  };

  const statusBadgeStyles = {
    active: "bg-[#f0fdf4] text-[#16a34a]",
    paused: "bg-[#f8fafc] text-[#64748b]",
    churned: "bg-[#fef2f2] text-[#dc2626]",
  };

  const gaugeColors = {
    healthy: '#16a34a',
    attention: '#d97706',
    risk: '#dc2626',
  };

  const strokeDasharray = 2 * Math.PI * 28;
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] hover:border-[#cbd5e1] flex flex-col"
    >
      <div className="h-1 shadow-sm" style={{ background: topStripGradients[riskStatus] }} />
      
      <div className="p-5 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-[18px] font-bold shrink-0 shadow-sm"
            style={{ background: getAvatarGradient(firstChar) }}
          >
            {firstChar}
          </div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold text-[#0f172a] m-0 truncate">{client.name}</h3>
            <p className="text-[13px] text-[#64748b] mt-0.5 m-0 truncate">{client.contact_name || 'No contact'}</p>
            <div className={`mt-1.5 inline-block px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-wider ${statusBadgeStyles[status]}`}>
              {status}
            </div>
          </div>
        </div>

        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="5" />
            <circle 
              cx="32" cy="32" r="28" fill="none" 
              stroke={gaugeColors[riskStatus]} 
              strokeWidth="5" 
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s ease' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[18px] font-bold text-[#0f172a]">
            {score}
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#f1f5f9] mx-5" />

      <div className="grid grid-cols-3 p-[14px_20px] text-center">
        <div className="border-r border-[#f1f5f9]">
          <p className="text-[18px] font-bold text-[#0f172a] m-0 leading-tight">{client.touchpoints_count || 0}</p>
          <p className="text-[11px] text-[#94a3b8] uppercase mt-1 m-0 tracking-wide">Touchpoints</p>
        </div>
        <div className="border-r border-[#f1f5f9]">
          <p className="text-[18px] font-bold text-[#0f172a] m-0 leading-tight">{client.invoices_count || 0}</p>
          <p className="text-[11px] text-[#94a3b8] uppercase mt-1 m-0 tracking-wide">Invoices</p>
        </div>
        <div>
          <p className="text-[18px] font-bold text-[#0f172a] m-0 leading-tight">{formatDaysAgo(client.last_contact_date)}</p>
          <p className="text-[11px] text-[#94a3b8] uppercase mt-1 m-0 tracking-wide">Last Contact</p>
        </div>
      </div>

      <div className="mt-auto p-[12px_20px] bg-[#f8fafc] border-t border-[#f1f5f9]">
        <div className="flex items-start gap-2">
          <Sparkles size={13} className="text-[#3b82f6] shrink-0 mt-0.5" />
          <p className={`text-[12px] leading-[1.5] m-0 ${client.latest_health_score?.ai_insight ? 'text-[#64748b] line-clamp-2' : 'text-[#94a3b8] italic'}`}>
            {client.latest_health_score?.ai_insight || 'Click to generate AI insight'}
          </p>
        </div>
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

  const filtered = clients.filter(c => {
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
    { key: 'all', label: 'All' },
    { key: 'healthy', label: 'Healthy' },
    { key: 'warning', label: 'Needs Attention' },
    { key: 'risk', label: 'At Risk' },
  ];

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] m-0">Clients</h1>
          <p className="text-[14px] text-[#64748b] mt-1 m-0">{clients.length} clients total</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setShowAddModal(true)}
          className="!h-[38px] !rounded-[9px]"
        >
          Add Client
        </Button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-[280px] group">
          <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors group-focus-within:text-[#3b82f6]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full h-[38px] bg-white border border-[#e2e8f0] rounded-[9px] pl-[36px] pr-3 text-[13px] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] outline-none transition-all duration-150"
          />
        </div>

        <div className="flex bg-[#f1f5f9] p-1 rounded-[10px] gap-1">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-[14px] py-[6px] rounded-[7px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer ${
                filter === tab.key 
                  ? 'bg-white text-[#0f172a] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]' 
                  : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-[14px] border border-[#e2e8f0]">
          <div className="w-[80px] h-[80px] bg-[#f1f5f9] rounded-[20px] flex items-center justify-center mx-auto mb-5">
            <Users size={36} className="text-[#94a3b8]" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#374151] m-0">
            {search ? 'No matches found' : 'No clients yet'}
          </h2>
          <p className="text-[14px] text-[#94a3b8] mt-2 m-0 max-w-[300px] mx-auto">
            {search ? 'Try adjusting your search or filters' : 'Add your first client to start monitoring their relationship health'}
          </p>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => setShowAddModal(true)}
            className="mt-6"
          >
            {search ? 'Clear Search' : '+ Add your first client'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
