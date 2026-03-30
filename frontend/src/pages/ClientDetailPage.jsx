import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, PlusCircle, DollarSign, Sparkles, Clock, Mail,
  Phone, Activity, AlertTriangle, CheckCircle, MessageSquare, Video, RefreshCw,
  Share2, Edit, ExternalLink, ChevronRight, TrendingUp, TrendingDown
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import HealthGauge from '../components/clients/HealthGauge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import TouchpointModal from '../components/clients/TouchpointModal';
import InvoiceModal from '../components/clients/InvoiceModal';
import EmailDraftModal from '../components/clients/EmailDraftModal';
import ScoreHistoryChart from '../components/clients/ScoreHistoryChart';
import AIBriefing from '../components/clients/AIBriefing';
import AIChat from '../components/clients/AIChat';
import useClients from '../hooks/useClients';
import { clientsAPI, aiAPI } from '../services/api';
import { getRiskLabel, getRiskColors, getNumericScore } from '../utils/scoreHelpers';
import { formatDaysAgo, formatDate, formatCurrency } from '../utils/formatters';
import useToast from '../hooks/useToast';

const typeIcons = {
  call: Phone, email: Mail, meeting: Video, message: MessageSquare
};

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [touchpointModalOpen, setTouchpointModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [history, setHistory] = useState([]);
  const { analyzeClient } = useClients();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [clientRes, historyRes] = await Promise.all([
          clientsAPI.getById(id),
          clientsAPI.getHealthHistory(id)
        ]);
        setClient(clientRes.data?.data || clientRes.data);
        setHistory(historyRes.data?.data || historyRes.data || []);
      } catch {
        toast.error('Failed to load client');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddTouchpoint = async (data) => {
    await clientsAPI.logTouchpoint(id, data);
    const res = await clientsAPI.getById(id);
    setClient(res.data?.data || res.data);
  };

  const handleAddInvoice = async (data) => {
    await clientsAPI.addInvoice(id, data);
    const res = await clientsAPI.getById(id);
    setClient(res.data?.data || res.data);
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const updatedScore = await analyzeClient(id);
    if (updatedScore) {
      const [res, historyRes] = await Promise.all([
        clientsAPI.getById(id),
        clientsAPI.getHealthHistory(id)
      ]);
      setClient(res.data?.data || res.data);
      setHistory(historyRes.data?.data || historyRes.data || []);
      toast.success('Health score updated');
    }
    setIsRecalculating(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="p-8">
        <LoadingSkeleton variant="detail" count={3} />
      </div>
    </DashboardLayout>
  );

  if (!client) return (
    <DashboardLayout>
      <div className="p-16 text-center bg-white rounded-[14px] border border-[#e2e8f0] m-8">
        <AlertTriangle size={48} className="text-[#94a3b8] mx-auto mb-4" />
        <h2 className="text-[20px] font-bold text-[#374151]">Client not found</h2>
        <p className="text-[14px] text-[#94a3b8] mt-2">This client may have been deleted or the ID is incorrect.</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate('/clients')}>Back to Clients</Button>
      </div>
    </DashboardLayout>
  );

  const score = getNumericScore(client);
  const healthScore = client.latest_health_score || {};
  const touchpoints = client.touchpoints || [];
  const invoices = client.invoices || [];
  const openInvoices = invoices.filter(i => i.status !== 'paid');
  const totalOutstanding = openInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

  const firstChar = client.name?.charAt(0).toUpperCase() || '?';
  const getAvatarGradient = (char) => {
    if (char <= 'F') return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    if (char <= 'M') return 'linear-gradient(135deg, #7c3aed, #5b21b6)';
    if (char <= 'S') return 'linear-gradient(135deg, #0891b2, #0e7490)';
    return 'linear-gradient(135deg, #059669, #047857)';
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb Nav */}
      <div className="flex items-center gap-2 mb-6 text-[13px] font-medium">
        <Link to="/clients" className="text-[#64748b] hover:text-[#0f172a] no-underline transition-colors">Clients</Link>
        <ChevronRight size={14} className="text-[#cbd5e1]" />
        <span className="text-[#0f172a]">{client.name}</span>
      </div>

      {/* Main Page Header */}
      <div className="flex justify-between items-start mb-8 bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex gap-5">
          <div 
            className="w-16 h-16 rounded-[18px] flex items-center justify-center text-white text-[24px] font-bold shadow-md shrink-0"
            style={{ background: getAvatarGradient(firstChar) }}
          >
            {firstChar}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#0f172a] m-0">{client.name}</h1>
              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                client.status === 'active' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#f8fafc] text-[#64748b]'
              }`}>
                {client.status || 'Active'}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[13px] text-[#64748b]">
                <Mail size={14} /> {client.email || 'No email'}
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#64748b]">
                <Phone size={14} /> {client.phone || client.contact_phone || 'No phone'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={Edit} className="!h-[36px] !rounded-[8px]">Edit</Button>
          <Button variant="primary" size="sm" icon={PlusCircle} onClick={() => setTouchpointModalOpen(true)} className="!h-[36px] !rounded-[8px]">
            Log Interaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 m-0">Health Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-[24px] font-bold ${score >= 70 ? 'text-[#16a34a]' : score >= 40 ? 'text-[#d97706]' : 'text-[#dc2626]'}`}>{score}</span>
                <span className="text-[11px] font-semibold text-[#64748b]">/ 100</span>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 m-0">Touchpoints</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-bold text-[#0f172a]">{touchpoints.length}</span>
                <span className="text-[11px] font-semibold text-[#64748b]">All time</span>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 m-0">Sentiment</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#16a34a]" />
                <span className="text-[16px] font-bold text-[#0f172a]">Positive</span>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 m-0">Open Invoices</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-[24px] font-bold ${openInvoices.length > 0 ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>{openInvoices.length}</span>
                <span className="text-[11px] font-semibold text-[#64748b]">{formatCurrency(totalOutstanding)}</span>
              </div>
            </div>
          </div>

          {/* AI Intelligence Card */}
          <AIBriefing clientId={id} clientName={client.name} />

          {/* Detailed Activity Timeline */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-5 border-b border-[#f1f5f9] flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-[#0f172a] m-0">Relationship Activity</h2>
              <div className="flex gap-2">
                <button className="p-1 px-3 bg-[#f1f5f9] text-[#64748b] text-[12px] font-semibold rounded-full border-none cursor-pointer hover:bg-[#e2e8f0] transition-colors">Filter</button>
                <button className="p-1 px-3 bg-[#f1f5f9] text-[#64748b] text-[12px] font-semibold rounded-full border-none cursor-pointer hover:bg-[#e2e8f0] transition-colors">Export</button>
              </div>
            </div>
            
            <div className="p-5 pb-8 relative">
              {touchpoints.length === 0 ? (
                <div className="py-12 text-center text-[#94a3b8]">
                  <Activity size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-[14px]">No interactions logged since onboarding.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {touchpoints.map((tp, idx) => {
                    const Icon = typeIcons[tp.type] || MessageSquare;
                    return (
                      <div key={tp.id || idx} className="flex gap-4 relative">
                        {idx !== touchpoints.length - 1 && (
                          <div className="absolute left-[16px] top-[40px] bottom-[-24px] w-[2px] bg-[#f1f5f9]" />
                        )}
                        <div className="w-8 h-8 rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9] flex items-center justify-center shrink-0 z-10">
                          <Icon size={14} className="text-[#64748b]" />
                        </div>
                        <div className="flex-1 bg-[#fbfcfd] border border-[#f1f5f9] rounded-[12px] p-4 group hover:border-[#3b82f6] transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-[13px] font-bold text-[#0f172a] capitalize">{tp.type}</span>
                              <span className="mx-2 text-[#cbd5e1]">•</span>
                              <span className="text-[11px] text-[#94a3b8] font-medium">{formatDaysAgo(tp.created_at)}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              tp.outcome === 'positive' ? 'bg-[#16a34a]' : tp.outcome === 'negative' ? 'bg-[#dc2626]' : 'bg-[#94a3b8]'
                            }`} />
                          </div>
                          <p className="text-[13px] text-[#374151] leading-[1.6] m-0">{tp.notes || 'Routine check-in call with the primary account manager.'}</p>
                          <div className="mt-3 flex gap-2">
                             <div className="text-[10px] font-bold text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded-full uppercase">Sentiment: Normal</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Gauge Circular Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
             {/* Header with Title and Recalculate */}
             <div className="w-full flex justify-between items-center mb-6">
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Client Health Score</span>
                <button 
                  onClick={handleRecalculate} 
                  disabled={isRecalculating} 
                  className={`p-2 rounded-lg transition-all ${isRecalculating ? 'text-slate-300' : 'text-blue-500 hover:bg-blue-50'}`}
                  title="Recalculate Score"
                >
                  <RefreshCw size={18} className={isRecalculating ? 'animate-spin' : ''} />
                </button>
             </div>

             <div className="flex flex-col items-center">
                <HealthGauge 
                  score={score} 
                  size={140} 
                  strokeWidth={10}
                  showLabel={true} 
                />
                
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">
                    Last analysis: {formatDaysAgo(healthScore.calculated_at || healthScore.created_at || new Date())}
                  </p>
                </div>
             </div>
          </div>

          {/* Score History Graph */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
             <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-5 m-0">6-Month Trend</h3>
             <ScoreHistoryChart scores={history} height={120} />
          </div>

          {/* Pending Invoices Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="p-4 border-b border-[#f1f5f9] flex justify-between items-center bg-[#f8fafc]">
               <h3 className="text-[13px] font-bold text-[#0f172a] m-0">Invoices</h3>
               <button onClick={() => setInvoiceModalOpen(true)} className="text-[11px] font-bold text-[#3b82f6] bg-white border border-[#bfdbfe] px-2 py-1 rounded-[6px] cursor-pointer hover:bg-[#eff6ff] transition-colors">Add New</button>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {invoices.length === 0 ? (
                <div className="p-6 text-center text-[#94a3b8] text-[13px]">No billing history yet.</div>
              ) : (
                invoices.slice(0, 4).map((inv, idx) => (
                  <div key={inv.id || idx} className="p-4 hover:bg-[#fbfcfd] transition-colors">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[14px] font-bold text-[#0f172a] m-0">{formatCurrency(inv.amount)}</p>
                           <p className="text-[11px] text-[#94a3b8] mt-1 m-0">Due {formatDate(inv.due_date)}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#fef2f2] text-[#dc2626]'
                        }`}>{inv.status}</span>
                     </div>
                  </div>
                ))
              )}
            </div>
            {invoices.length > 4 && (
              <button className="w-full py-3 bg-[#f8fafc] text-[#64748b] text-[12px] font-medium border-none cursor-pointer hover:bg-[#f1f5f9] transition-colors">View All Invoices</button>
            )}
          </div>

          <AIChat clientId={id} clientName={client.name} />
        </div>
      </div>

      <TouchpointModal
        isOpen={touchpointModalOpen}
        onClose={() => setTouchpointModalOpen(false)}
        clientId={id}
        clientName={client.name}
        onSuccess={handleAddTouchpoint}
      />
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        clientId={id}
        clientName={client.name}
        onSuccess={handleAddInvoice}
      />
      <EmailDraftModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        client={client}
      />
    </DashboardLayout>
  );
};

export default ClientDetailPage;
