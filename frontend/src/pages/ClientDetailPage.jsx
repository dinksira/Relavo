import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, PlusCircle, DollarSign, Sparkles, Clock, Mail,
  Phone, Activity, AlertTriangle, CheckCircle, MessageSquare, Video, RefreshCw,
  Share2, Edit, ExternalLink, ChevronRight, TrendingUp, TrendingDown, Target, Zap
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import HealthGauge from '../components/clients/HealthGauge';
import LoadingScreen from '../components/ui/LoadingScreen';
import EmptyState from '../components/ui/EmptyState';
import TouchpointModal from '../components/clients/TouchpointModal';
import InvoiceModal from '../components/clients/InvoiceModal';
import EmailDraftModal from '../components/clients/EmailDraftModal';
import ScoreHistoryChart from '../components/clients/ScoreHistoryChart';
import AIBriefing from '../components/clients/AIBriefing';
import AIChat from '../components/clients/AIChat';
import useClients from '../hooks/useClients';
import { clientsAPI, aiAPI, invoicesAPI } from '../services/api';
import { getRiskLabel, getRiskColors, getNumericScore } from '../utils/scoreHelpers';
import { formatDaysAgo, formatDate, formatCurrency } from '../utils/formatters';
import useToast from '../hooks/useToast';
import TeamComments from '../components/team/TeamComments';
import TeamPresence from '../components/team/TeamPresence';

const typeStyles = {
  call: { icon: Phone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  email: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
  meeting: { icon: Video, color: 'text-rose-500', bg: 'bg-rose-50' },
  message: { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' }
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
  const [briefingRefreshKey, setBriefingRefreshKey] = useState(0);
  const { analyzeClient } = useClients();

  const refreshAllData = useCallback(async () => {
    const [clientRes, historyRes] = await Promise.all([
      clientsAPI.getById(id),
      clientsAPI.getHealthHistory(id)
    ]);
    setClient(clientRes.data?.data || clientRes.data);
    setHistory(historyRes.data?.data || historyRes.data || []);
    setBriefingRefreshKey(prev => prev + 1);
  }, [id]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await refreshAllData();
      } catch {
        toast.error('Failed to load client');
      } finally { setLoading(false); }
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAllData]);

  useEffect(() => {
    const handleQuickLogSuccess = (event) => {
      const affectedClientId = event?.detail?.clientId;
      if (!affectedClientId || String(affectedClientId) === String(id)) {
        refreshAllData().catch(() => {});
      }
    };
    window.addEventListener('relavo:quicklog:success', handleQuickLogSuccess);
    return () => window.removeEventListener('relavo:quicklog:success', handleQuickLogSuccess);
  }, [id, refreshAllData]);

  useEffect(() => {
    const handleDraftOpen = () => setEmailModalOpen(true);
    const handleTouchpointOpen = () => setTouchpointModalOpen(true);
    const handleBriefingOpen = () => {
      const element = document.getElementById('ai-briefing-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    };
    const handleRecalculateScore = () => handleRecalculate();

    window.addEventListener('relavo:draft:open', handleDraftOpen);
    window.addEventListener('relavo:touchpoint:open', handleTouchpointOpen);
    window.addEventListener('relavo:briefing:open', handleBriefingOpen);
    window.addEventListener('relavo:score:recalculate', handleRecalculateScore);

    return () => {
      window.removeEventListener('relavo:draft:open', handleDraftOpen);
      window.removeEventListener('relavo:touchpoint:open', handleTouchpointOpen);
      window.removeEventListener('relavo:briefing:open', handleBriefingOpen);
      window.removeEventListener('relavo:score:recalculate', handleRecalculateScore);
    };
  }, []);

  const handleAddTouchpoint = async (data) => {
    await clientsAPI.logTouchpoint(id, data);
    await refreshAllData();
  };

  const handleAddInvoice = async (data) => {
    await clientsAPI.addInvoice(id, data);
    await refreshAllData();
  };

  const handleMarkInvoicePaid = async (invoiceId) => {
    await invoicesAPI.update(invoiceId, { status: 'paid' });
    toast.success('Invoice marked as paid');
    await refreshAllData();
  };

  const handleDeleteInvoice = async (invoiceId) => {
    await invoicesAPI.remove(invoiceId);
    toast.success('Invoice deleted');
    await refreshAllData();
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const updatedScore = await analyzeClient(id);
    if (updatedScore) {
      await refreshAllData();
      toast.success('Health score updated');
    }
    setIsRecalculating(false);
  };

  if (loading) return <LoadingScreen />;

  if (!client) return (
    <DashboardLayout>
      <div className="p-16 text-center bg-white rounded-[32px] border border-slate-200 m-8">
        <AlertTriangle size={64} className="text-slate-300 mx-auto mb-6" />
        <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Client profile not found.</h2>
        <p className="text-[14px] text-slate-500 mt-2 font-medium">This record may have been moved or archived.</p>
        <Button 
          variant="outline" 
          className="mt-8 !rounded-xl" 
          onClick={() => navigate('/clients')}
          icon={ArrowLeft}
        >
          Return to directory
        </Button>
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
    if (char <= 'F') return 'from-blue-600 to-blue-800';
    if (char <= 'M') return 'from-indigo-600 to-indigo-800';
    if (char <= 'S') return 'from-violet-600 to-violet-800';
    return 'from-emerald-600 to-emerald-800';
  };

  return (
    <DashboardLayout>
      {/* Premium Header Container */}
      <div className="relative mb-10 reveal overflow-hidden bg-white border-2 border-slate-100 rounded-[40px] p-10 lg:p-12 shadow-sm group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover:bg-blue-100/50 transition-colors duration-1000" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex gap-8 items-center">
            <div className={`w-24 h-24 rounded-[32px] bg-gradient-to-br ${getAvatarGradient(firstChar)} flex items-center justify-center text-white text-[36px] font-black shadow-2xl group-hover:rotate-6 transition-transform duration-500 shrink-0`}>
              {firstChar}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-[42px] font-black text-slate-900 tracking-tighter m-0 leading-none italic">{client.name}</h1>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic shadow-sm border ${client.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                  {client.status || 'Active'}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-4">
                <div className="flex items-center gap-3 text-[15px] text-slate-500 font-bold group/link cursor-pointer hover:text-blue-600 transition-colors italic">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/link:bg-blue-50 transition-colors border border-slate-100">
                    <Mail size={16} className="group-hover/link:text-blue-500" /> 
                  </div>
                  {client.email || 'No email associated'}
                </div>
                <div className="flex items-center gap-3 text-[15px] text-slate-500 font-bold group/link cursor-pointer hover:text-blue-600 transition-colors italic">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/link:bg-blue-50 transition-colors border border-slate-100">
                    <Phone size={16} className="group-hover/link:text-blue-500" />
                  </div>
                  {client.phone || client.contact_phone || 'No phone listed'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <TeamPresence compact />
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="lg" icon={Edit} className="!h-14 !px-8 !rounded-2xl !bg-white hover:!bg-slate-50 !font-black !uppercase !text-[11px] !tracking-[0.2em] border-2">Profile</Button>
              <Button variant="outline" size="lg" icon={Sparkles} onClick={() => setEmailModalOpen(true)} className="!h-14 !px-8 !rounded-2xl !bg-white hover:!bg-blue-50 hover:!text-blue-600 hover:!border-blue-200 !font-black !uppercase !text-[11px] !tracking-[0.2em] border-2">
                AI Agent
              </Button>
              <Button variant="primary" size="lg" icon={PlusCircle} onClick={() => setTouchpointModalOpen(true)} className="!h-14 !px-10 !rounded-2xl shadow-2xl shadow-blue-500/20 !font-black !uppercase !text-[11px] !tracking-[0.2em]">
                New Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        {/* Left Column: Analytics & Timeline */}
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Executive Analytics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricWidget 
              title="Relationship Score" 
              value={score} 
              suffix="/ 100" 
              trend={score >= 70 ? 'Up' : 'Down'}
              color={score >= 70 ? 'emerald' : score >= 40 ? 'amber' : 'rose'}
            />
            <MetricWidget 
              title="Interaction Density" 
              value={touchpoints.length} 
              suffix="events" 
              trend="Up"
              color="indigo"
            />
            <MetricWidget 
               title="Financial Exposure" 
               value={formatCurrency(totalOutstanding)} 
               suffix="" 
               trend={totalOutstanding > 0 ? 'Down' : 'Steady'}
               color={totalOutstanding > 0 ? 'rose' : 'blue'}
               isCurrency
            />
            <MetricWidget 
               title="Current Outlook" 
               value={score >= 70 ? 'Optimal' : score >= 40 ? 'Critical' : 'Churn Risk'} 
               suffix="" 
               color={score >= 70 ? 'emerald' : score >= 40 ? 'amber' : 'rose'}
               isLabel
            />
          </div>

          {/* AI Briefing System */}
          <div id="ai-briefing-section" className="reveal" style={{ transitionDelay: '200ms' }}>
             <AIBriefing key={briefingRefreshKey} clientId={id} clientName={client.name} />
          </div>

          {/* Relationship Timeline */}
          <div className="premium-card overflow-hidden reveal" style={{ transitionDelay: '300ms' }}>
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-[18px] font-black text-slate-900 tracking-tight m-0 flex items-center gap-3">
                 <Zap size={20} className="text-blue-500" />
                 Engagement Intelligence
              </h2>
              <div className="flex gap-3">
                 <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                    <button className="px-4 py-1.5 text-[11px] font-black uppercase text-blue-600 bg-blue-50 rounded-lg border-none cursor-pointer">All Activity</button>
                    <button className="px-4 py-1.5 text-[11px] font-black uppercase text-slate-400 hover:text-slate-600 bg-transparent rounded-lg border-none cursor-pointer transition-colors">Notes</button>
                 </div>
              </div>
            </div>
            
            <div className="p-8 pb-10">
              {touchpoints.length === 0 ? (
                <EmptyState 
                  title="No historical data." 
                  subtitle="Start logging your communications to enable AI health monitoring for this client." 
                  icon={Activity}
                  action={() => setTouchpointModalOpen(true)}
                  actionLabel="Log first interaction"
                />
              ) : (
                <div className="space-y-10 relative">
                  {/* Timeline track */}
                  <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-slate-100" />
                  
                  {touchpoints.map((tp, idx) => {
                    const style = typeStyles[tp.type] || typeStyles.message;
                    const Icon = style.icon;
                    return (
                      <div key={tp.id || idx} className="flex gap-8 relative group">
                        <div className={`w-12 h-12 rounded-[18px] ${style.bg} border-4 border-white flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                          <Icon size={20} className={style.color} />
                        </div>
                        
                        <div className="flex-1 bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[15px] font-black text-slate-900 capitalize tracking-tight">{tp.type} Recorded</span>
                                  {tp.outcome === 'positive' && <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none !px-2 !py-0.5 !text-[9px]">Success</Badge>}
                               </div>
                               <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest m-0">{formatDaysAgo(tp.created_at)}</p>
                            </div>
                            <div className="flex gap-2">
                               <button className="w-8 h-8 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors border-none bg-transparent">
                                  <Share2 size={14} />
                               </button>
                               <button className="w-8 h-8 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors border-none bg-transparent">
                                  <ExternalLink size={14} />
                               </button>
                            </div>
                          </div>
                          
                          <p className="text-[14px] text-slate-600 leading-[1.7] m-0 font-medium whitespace-pre-line">
                            {tp.notes || 'Routine update and status check with the primary stakeholders.'}
                          </p>
                          
                          <div className="mt-5 pt-5 border-t border-slate-50 flex flex-wrap gap-2">
                             <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-indigo-100/50">Mood: {tp.outcome || 'Neutral'}</div>
                             <div className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">Verified by AI</div>
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

        {/* Right Column: Health Cards & Billing */}
        <div className="space-y-8 reveal" style={{ transitionDelay: '400ms' }}>
          
          {/* Unified Health Gauge Card */}
          <div className="bg-[#0f172a] rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-center group">
             {/* Decorative patterns */}
             <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
             
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                   <h5 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] m-0">Live Health Diagnostic</h5>
                   <button 
                     onClick={handleRecalculate} 
                     disabled={isRecalculating} 
                     className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-95"
                   >
                     <RefreshCw size={18} className={isRecalculating ? 'animate-spin' : ''} />
                   </button>
                </div>

                <div className="flex justify-center mb-8 relative">
                  <HealthGauge 
                    score={score} 
                    size={160} 
                    strokeWidth={12}
                    showLabel={true} 
                  />
                  {/* Since card is dark, we might need an overlay if the gauge text is dark */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                     <span className="text-[32px] font-black text-white translate-y-2">{score}</span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest translate-y-1">Score</span>
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                   <h3 className="text-3xl font-black text-white m-0 tracking-tight">{getRiskLabel(score)}</h3>
                   <p className="text-white/40 text-[13px] font-medium leading-relaxed">
                     Calculated {formatDaysAgo(healthScore.calculated_at || healthScore.created_at || new Date())}
                   </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group-hover:border-white/20 transition-all">
                  <div className="text-left leading-none">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Net Sentiment</p>
                     <p className={`text-lg font-black m-0 ${
                       score >= 80 ? 'text-emerald-400' : 
                       score >= 60 ? 'text-blue-400' : 
                       score >= 40 ? 'text-amber-400' : 'text-rose-400'
                     }`}>
                       {score >= 80 ? 'Optimal' : 
                        score >= 60 ? 'Positive' : 
                        score >= 40 ? 'Fair' : 
                        score >= 20 ? 'Critical' : 'Churn Risk'}
                     </p>
                  </div>
                  {score >= 50 ? (
                    <TrendingUp className="text-emerald-400" size={24} />
                  ) : (
                    <TrendingDown className="text-rose-400" size={24} />
                  )}
                </div>
             </div>
          </div>

          {/* Performance Trend Card */}
          <div className="premium-card p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                   <Target size={20} />
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-slate-900 m-0 uppercase tracking-widest">Health Trajectory</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter m-0">Moving Average (90 Days)</p>
                </div>
             </div>
             <ScoreHistoryChart scores={history} height={140} />
          </div>

          {/* Institutional Billing Card */}
          <div id="billing-section" className="premium-card overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-[15px] font-black text-slate-900 m-0 flex items-center gap-3 tracking-tight">
                  <DollarSign size={18} className="text-emerald-500" />
                  Financial Health
               </h3>
               <button onClick={() => setInvoiceModalOpen(true)} className="p-2 w-8 h-8 flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border-none">
                  <PlusCircle size={16} />
               </button>
            </div>
            <div className="p-2 space-y-1">
              {invoices.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-medium text-[13px]">Transparent billing history.</div>
              ) : (
                invoices.slice(0, 4).map((inv, idx) => (
                  <div key={inv.id || idx} className="p-5 hover:bg-slate-50 rounded-[20px] transition-all group border border-transparent hover:border-slate-100">
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <p className="text-[18px] font-black text-slate-900 m-0 tracking-tight">{formatCurrency(inv.amount)}</p>
                           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest m-0">Due {formatDate(inv.due_date)}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>{inv.status}</span>
                     </div>
                     <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkInvoicePaid(inv.id)}
                          className="flex-1 h-9 flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl cursor-pointer border-none transition-colors"
                        >
                          Settle Invoice
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="h-9 w-9 flex items-center justify-center text-rose-500 bg-rose-50/50 hover:bg-rose-50 rounded-xl cursor-pointer border-none transition-colors"
                      >
                        <RefreshCw size={14} className="rotate-45" />
                      </button>
                     </div>
                  </div>
                ))
              )}
            </div>
            {invoices.length > 4 && (
              <button className="w-full py-5 text-slate-400 text-[11px] font-black uppercase tracking-widest border-t border-slate-50 hover:bg-slate-50 hover:text-slate-600 transition-all transition-colors bg-transparent border-none cursor-pointer">Explore Full Statement &rarr;</button>
            )}
          </div>

          {/* AI Strategy Chat Widget */}
          <div className="reveal" style={{ transitionDelay: '500ms' }}>
             <AIChat clientId={id} clientName={client.name} />
          </div>

          {/* Team Discussion Thread */}
          <div className="reveal mb-12" style={{ transitionDelay: '600ms' }}>
            <TeamComments clientId={id} />
          </div>
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

const MetricWidget = ({ title, value, suffix, trend, color, isCurrency, isLabel }) => {
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
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 opacity-50 ${c.split(' ')[0]}`} />
      
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-center">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] m-0">{title}</p>
           <TrendIcon size={14} className={c.split(' ')[1]} />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[28px] font-black tracking-tighter m-0 ${isLabel ? c.split(' ')[1] : 'text-slate-900'}`}>
              {value}
            </span>
            {suffix && <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{suffix}</span>}
          </div>
          <div className="flex items-center gap-1">
             <div className={`w-1 h-1 rounded-full ${c.split(' ')[0]} ${c.split(' ')[1]}`} />
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Active Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
