import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Activity, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Mail,
  X,
  Copy,
  Check
} from 'lucide-react';

const ClientDetail = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: 'Health Score', value: '32', target: '100', color: 'text-relavo-danger', ring: 'text-red-500' },
    { label: 'Last Contact', value: '9 days ago', sub: 'Critical lag detect', icon: Calendar, color: 'text-relavo-warning' },
    { label: 'Open Invoices', value: '$4,200', count: '1 overdue', icon: FileText, color: 'text-relavo-danger' },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <button className="flex items-center gap-2 text-xs font-black text-text-3 hover:text-navy uppercase tracking-widest transition-colors mb-4">
                <ArrowLeft size={16} /> Back to dashboard
             </button>
             <div className="flex items-center gap-4">
               <h1 className="text-5xl font-black text-navy tracking-tight">Acme Corp</h1>
               <span className="px-4 py-1.5 bg-relavo-danger/10 text-relavo-danger rounded-full text-[10px] font-black uppercase tracking-widest">AT RISK</span>
             </div>
             <p className="text-text-2 font-medium">Monitoring since March 2024 • Project: <span className="text-navy font-bold">Brand Transformation</span></p>
          </div>
          <div className="flex gap-4">
             <button className="btn-primary py-2.5 bg-slate-100 text-navy hover:bg-slate-200 hover:shadow-none hover:scale-100 border border-slate-200">
               <MessageCircle size={18} /> Log Touchpoint
             </button>
             <button 
               onClick={() => setShowEmailModal(true)}
               className="btn-primary py-2.5"
             >
               <Sparkles size={18} /> Draft Email
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {stats.map((s, i) => (
             <div key={i} className="card-premium p-10 flex flex-col items-center text-center gap-6 relative group">
                {s.label === 'Health Score' ? (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * parseInt(s.value)) / 100} className={`${s.ring} shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000`} />
                    </svg>
                    <span className={`absolute text-4xl font-black ${s.color}`}>{s.value}</span>
                  </div>
                ) : (
                  <div className={`w-16 h-16 ${s.label === 'Last Contact' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'} rounded-[24px] flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`}>
                    <s.icon size={28} />
                  </div>
                )}
                <div>
                   <p className="text-xs font-black text-text-3 uppercase tracking-widest mb-1">{s.label}</p>
                   <h3 className="text-2xl font-black text-navy">{s.value}</h3>
                   {s.sub && <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.sub}</p>}
                   {s.count && <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.count}</p>}
                </div>
             </div>
           ))}
        </div>

        {/* AI Insight Section */}
        <div className="reveal-active bg-blueDark p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-80 h-80 bg-blue/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10 grid md:grid-cols-4 gap-12 items-center">
              <div className="md:col-span-3 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Intelligence Informed Insight</h3>
                 </div>
                 <p className="text-xl text-white/70 italic leading-relaxed font-medium">
                   "Acme Corp relationship health has dropped <span className="text-white font-black underline decoration-relavo-danger decoration-4">22 points</span> this week. Primary triggers include a 9-day communication gap and 1 overdue invoice (#102). Recommend immediate re-engagement via warm phone call or personalized email."
                 </p>
              </div>
              <div className="flex justify-end">
                 <button 
                  onClick={() => setShowEmailModal(true)}
                  className="bg-white text-navy font-black py-5 px-8 rounded-3xl hover:bg-blue hover:text-white transition-all transform hover:-rotate-3 active:scale-95 shadow-xl"
                >
                   Draft Response
                 </button>
              </div>
           </div>
        </div>

        {/* Details Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Timeline */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy px-1">Touchpoint History</h2>
              <div className="card-premium p-10 space-y-10 relative">
                 <div className="absolute left-[59px] top-14 bottom-14 w-[2px] bg-slate-100" />
                 {[
                   { type: 'Call', date: 'March 07', note: 'Project timeline review. Client expressed concern about Q2 deadlines.', icon: Mail },
                   { type: 'Email', date: 'Feb 28', note: 'Invoiced for month of February.', icon: MessageCircle },
                   { type: 'Meeting', date: 'Feb 15', note: 'Discovery session for Phase 2.', icon: Activity }
                 ].map((t, i) => (
                   <div key={i} className="flex gap-8 relative items-start group">
                      <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-text-3 group-hover:border-blue group-hover:text-blue transition-all z-10 shrink-0 shadow-sm leading-none">
                         <t.icon size={16} />
                      </div>
                      <div className="pt-1.5 space-y-2">
                        <div className="flex items-baseline gap-4">
                          <h4 className="text-sm font-black text-navy uppercase tracking-widest">{t.type}</h4>
                          <span className="text-xs font-bold text-text-3">{t.date}</span>
                        </div>
                        <p className="text-sm text-text-2 font-medium leading-relaxed group-hover:text-relavo-text-primary transition-colors italic">"{t.note}"</p>
                      </div>
                   </div>
                 ))}
                 <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-text-3 uppercase tracking-widest hover:border-blue hover:text-blue transition-all">
                    Load More History
                 </button>
              </div>
           </div>

           {/* Invoices */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy px-1">Financial Pulse</h2>
              <div className="card-premium overflow-hidden">
                 <table className="w-full">
                    <thead className="bg-slate-50 border-b border-border-dark">
                       <tr>
                          <th className="px-8 py-5 text-left text-[10px] font-black text-text-3 uppercase tracking-widest">ID</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black text-text-3 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 text-right text-[10px] font-black text-text-3 uppercase tracking-widest">Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                       {[
                         { id: '#102', status: 'Overdue', amount: '$4,200', date: 'Due Mar 05' },
                         { id: '#101', status: 'Paid', amount: '$4,200', date: 'Paid Feb 15' },
                         { id: '#099', status: 'Paid', amount: '$3,800', date: 'Paid Jan 10' }
                       ].map((inv, i) => (
                         <tr key={i} className="hover:bg-relavo-surface transition-colors group">
                            <td className="px-8 py-6">
                               <div className="text-sm font-bold text-navy group-hover:text-blue transition-colors">{inv.id}</div>
                               <div className="text-[10px] text-text-3 font-bold uppercase">{inv.date}</div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {inv.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right font-black text-navy">{inv.amount}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="p-8 bg-slate-50 border-t border-border-dark flex justify-between items-center">
                    <span className="text-xs font-bold text-text-2">Customer Lifetime Value</span>
                    <span className="text-lg font-black text-navy">$42,500</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Email Modal Implementation */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
           <div className="absolute inset-0 bg-navy/95 backdrop-blur-xl" onClick={() => setShowEmailModal(false)} />
           <div className="relative w-full max-w-[1000px] h-[80vh] bg-white rounded-[40px] shadow-3xl flex flex-col overflow-hidden animate-float">
              {/* Modal Header */}
              <div className="px-12 py-8 border-b border-border-dark flex justify-between items-center bg-white shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center text-blue">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-navy tracking-tight">AI Generated Re-engagement</h3>
                       <p className="text-xs font-bold text-text-2 uppercase tracking-widest">PERSONALIZED FOR ACME CORP</p>
                    </div>
                 </div>
                 <button onClick={() => setShowEmailModal(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-relavo-danger hover:bg-red-50 transition-all">
                    <X size={24} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto p-12 grid lg:grid-cols-2 gap-12">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <h4 className="text-lg font-bold text-navy">Context being used</h4>
                       <div className="space-y-3">
                          {[
                            'Relationship health has dropped 22 points this week.',
                            'Last contact was a review call on March 07 (9 days ago).',
                            'Invoice #102 is currently 1 week overdue.'
                          ].map((c, i) => (
                            <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                               <Check size={16} className="text-blue" />
                               <span className="text-sm font-medium text-text-2 italic">"{c}"</span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-lg font-bold text-navy">Refine tone</h4>
                       <div className="flex flex-wrap gap-4">
                          {['Warm', 'Professional', 'Direct', 'Concise'].map(t => (
                            <button key={t} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${t === 'Warm' ? 'bg-blue border-blue text-white shadow-lg' : 'border-slate-100 text-text-3 hover:border-blue/30'}`}>
                               {t}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Editor Panel */}
                 <div className="bg-slate-50 rounded-[32px] border border-slate-200 p-10 flex flex-col gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-3 uppercase tracking-widest">Subject Line</label>
                       <input 
                         type="text" 
                         defaultValue="Checking in — Brand Transformation project" 
                         className="w-full bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-navy focus:outline-none focus:ring-4 focus:ring-blue/10" 
                       />
                    </div>
                    <div className="space-y-2 flex-1">
                       <label className="text-[10px] font-black text-text-3 uppercase tracking-widest">Drafted Message</label>
                       <textarea 
                         className="w-full h-full bg-white border border-slate-200 px-6 py-6 rounded-2xl font-medium text-text-2 focus:outline-none focus:ring-4 focus:ring-blue/10 leading-relaxed italic"
                         defaultValue={`Hi Acme Team,\n\nI was just reviewing our project health and realized we haven't synced since our March 7th call. I want to make sure your Brand Transformation is still moving at the pace we discussed!\n\nI also noticed Invoice #102 is slightly overdue — if there are any issues on our end with the billing portal, please let me know. \n\nAre you free for a quick 5-minute catchup tomorrow afternoon?\n\nBest,\nJohn`}
                       />
                    </div>
                    <button 
                      onClick={() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="btn-primary w-full py-5 text-xl relative overflow-hidden"
                    >
                      {copied ? <><Check size={20} /> Copied to Clipboard</> : <><Copy size={20} /> Copy for Gmail</>}
                      {copied && <div className="absolute inset-0 bg-relavo-success animate-reveal" />}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientDetail;
