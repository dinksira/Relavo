import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2,
  AlertCircle,
  Zap,
  Info,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const Alerts = () => {
  const [filter, setFilter] = useState('All');

  const allAlerts = [
    { id: 1, client: 'Acme Corp', type: 'overdue_invoice', severity: 'high', message: 'Invoice #102 is 5 days overdue.', suggestion: 'Send a gentle reminder email or log a check-in call.', time: '2h ago', read: false },
    { id: 2, client: 'Globex Inc', type: 'no_contact', severity: 'medium', message: 'No contact in more than 7 days.', suggestion: 'Schedule a quick status sync or send a "thinking of you" message.', time: '5h ago', read: false },
    { id: 3, client: 'Umbrella Corp', type: 'score_drop', severity: 'medium', message: 'Score dropped 18 points in 24h.', suggestion: 'Investigation needed: check recent activity or sentiment trends.', time: '1d ago', read: true },
    { id: 4, client: 'Initech', type: 'sentiment', severity: 'low', message: 'Positive sentiment detected in recent email.', suggestion: 'Good time to ask for a referral or testimonial.', time: '2d ago', read: true },
    { id: 5, client: 'Soylent Corp', type: 'overdue_invoice', severity: 'high', message: 'Invoice #098 is 12 days overdue!', suggestion: 'Urgent: escalate to account manager for immediate follow-up.', time: '3d ago', read: false },
  ];

  const filteredAlerts = allAlerts.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !a.read;
    return a.severity.toLowerCase() === filter.toLowerCase();
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Zap size={20} className="text-relavo-danger" />;
      case 'medium': return <AlertCircle size={20} className="text-relavo-warning" />;
      case 'low': return <Info size={20} className="text-relavo-blue" />;
      default: return <Bell size={20} className="text-relavo-text-muted" />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-relavo-navy tracking-tight">Smart Signals</h1>
            <p className="text-relavo-text-secondary font-medium">Monitoring relationship <span className="text-relavo-navy font-bold italic underline decoration-relavo-blue/30 decoration-4 underline-offset-4">pulses</span> across all accounts.</p>
          </div>
          <button className="text-xs font-black text-relavo-blue hover:text-relavo-navy uppercase tracking-widest transition-colors flex items-center gap-2">
             Clear all signals <Trash2 size={14} />
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-relavo-border shadow-sm">
            {['All', 'Unread', 'High', 'Medium', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-relavo-navy text-white shadow-xl' : 'text-relavo-text-muted hover:text-relavo-navy hover:bg-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter by client..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-relavo-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="grid grid-cols-1 gap-6 pb-20">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((a) => (
              <div 
                key={a.id} 
                className={`card-premium p-10 flex flex-col gap-8 relative transition-all group border-l-[8px] ${
                   !a.read ? (a.severity === 'high' ? 'border-l-relavo-danger' : a.severity === 'medium' ? 'border-l-relavo-warning' : 'border-l-relavo-blue') : 'border-l-slate-100 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start">
                   <div className="flex gap-6 items-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                         a.severity === 'high' ? 'bg-red-50' : a.severity === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                      }`}>
                         {getSeverityIcon(a.severity)}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-relavo-navy">{a.client}</h3>
                            {!a.read && <span className="bg-relavo-blue text-white text-[9px] font-black px-2 py-0.5 rounded-full ring-4 ring-white shadow-sm uppercase tracking-widest">New</span>}
                         </div>
                         <p className="text-relavo-text-secondary font-medium italic">"{a.message}"</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-relavo-text-muted uppercase tracking-wider">{a.time}</span>
                      <button className="p-2.5 rounded-xl text-slate-300 hover:bg-slate-50 hover:text-relavo-navy transition-all">
                         <MoreVertical size={20} />
                      </button>
                   </div>
                </div>

                <div className="bg-relavo-surface rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between border border-relavo-border shadow-inner gap-6 group-hover:bg-white transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-relavo-blue shadow-lg group-hover:scale-110 transition-transform">
                      <Sparkles size={22} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-relavo-blue uppercase tracking-widest">Intelligence Recommendation</p>
                       <p className="text-sm font-bold text-relavo-navy leading-relaxed italic pr-10">"{a.suggestion}"</p>
                    </div>
                  </div>
                  <button className="btn-premium py-3 px-8 text-xs shrink-0 whitespace-nowrap">
                    Take AI Action <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card-premium py-32 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-relavo-navy tracking-tight">System Fully Healthy</h3>
                 <p className="text-relavo-text-secondary font-medium">Zero critical signals found for "{filter}" filter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const MoreVertical = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);

export default Alerts;
