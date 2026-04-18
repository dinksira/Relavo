import React, { useState, useEffect } from 'react';
import { X, Sparkles, RotateCw, Copy, Check, Info, Mail, Clock, Send, Zap, ChevronRight, User } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { getRiskColors, getRiskLabel } from '../../utils/scoreHelpers';
import Button from '../ui/Button';

const EmailDraftModal = ({ isOpen, onClose, client }) => {
  const [tone, setTone] = useState('professional');
  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const fetchDraft = async (selectedTone) => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await aiAPI.draftEmail(client.id, selectedTone);
      setDraft(res.data.data || res.data || res);
    } catch (error) {
      console.error('Error fetching draft:', error);
      setDraft({
        subject: `Checking in — ${client.name}`,
        body: `Hi ${client.contact_name || 'there'},\n\nI wanted to reach out and check how things are going on your end.\n\nWould love to connect this week if you have a few minutes.\n\nBest regards,\n\nThe Relavo Team`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && client) {
      fetchDraft(tone);
      setSent(false);
    }
  }, [isOpen]);

  const handleToneChange = (newTone) => {
    setTone(newTone);
    fetchDraft(newTone);
  };

  const handleCopy = () => {
    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!draft.subject || !draft.body) return;
    setSending(true);
    try {
      await aiAPI.sendDraftEmail(client.id, draft.subject, draft.body);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert(error.response?.data?.message || 'Failed to send email. Ensure the client has an email address set.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const score = client.latest_health_score?.score || 0;
  const colors = getRiskColors(score);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-[960px] h-[640px] flex overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500 ease-out">
        
        {/* EXECUTIVE CONTEXT SIDEBAR */}
        <div className="w-[360px] bg-[#020617] p-10 flex flex-col relative overflow-hidden shrink-0">
           {/* Decorative background flare */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Zap size={18} className="text-white" />
                 </div>
                 <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Intelligence Node</span>
              </div>

              <div className="space-y-6 flex-1">
                 <div>
                    <h2 className="text-[28px] font-black text-white m-0 tracking-tight leading-tight italic">{client.name}.</h2>
                    <div className="flex items-center gap-3 mt-4">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                         score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' : 
                         score >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-400/20' : 
                         'bg-rose-500/10 text-rose-400 border-rose-400/20'
                       }`}>
                         {getRiskLabel(score)}
                       </span>
                       <span className="text-[14px] font-black text-white/40 tracking-tighter">Score: <span className="text-white">{score}</span></span>
                    </div>
                 </div>

                 <div className="h-px bg-white/5 w-full" />

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[13px] text-white/60 font-medium">
                       <Clock size={16} className="text-blue-500" />
                       <span>Latency: <span className="text-white">{client.last_contact_date ? Math.floor((Date.now() - new Date(client.last_contact_date)) / 86400000) : '—'} days</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-white/60 font-medium group cursor-default">
                       <Mail size={16} className="text-blue-500" />
                       <span className="truncate">Channel: <span className="text-white group-hover:text-blue-400 transition-colors uppercase text-[11px] font-black tracking-widest">{client.email || 'not set'}</span></span>
                    </div>
                 </div>

                 <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mt-8">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">AI Directives</p>
                    <p className="text-[13px] text-white/70 leading-relaxed font-medium italic m-0">
                       "{client.latest_health_score?.ai_insight || 'Relationship analysis in progress...'}"
                    </p>
                 </div>
              </div>

              <div className="mt-8">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Neural Tone Tuning</p>
                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 gap-1">
                    {['warm', 'professional', 'direct'].map(t => (
                      <button
                        key={t}
                        onClick={() => handleToneChange(t)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
                          tone === t 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                            : 'bg-transparent text-white/40 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 bg-white p-12 flex flex-col relative">
           <button
             onClick={onClose}
             className="absolute top-10 right-10 p-2 rounded-xl text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer"
           >
             <X size={20} />
           </button>

           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Sparkles size={16} className="text-blue-600" />
                 </div>
                 <h3 className="text-[18px] font-black text-slate-900 m-0 tracking-tight italic">AI Correspondence Draft.</h3>
              </div>
              <button
                onClick={() => fetchDraft(tone)}
                disabled={loading || sending}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border-none bg-transparent cursor-pointer disabled:opacity-50"
              >
                <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Regenerate
              </button>
           </div>

           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center">
                   <RotateCw size={32} className="text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight m-0 italic">Authoring Communication...</h3>
                  <p className="text-[13px] text-slate-400 font-medium mt-1 uppercase tracking-widest">Optimizing based on relationship score</p>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-6 space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Subject Protocol</label>
                   <input
                     type="text"
                     value={draft.subject}
                     onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                     className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[15px] font-black text-slate-900 tracking-tight focus:bg-white focus:border-blue-200 transition-all outline-none"
                   />
                </div>

                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Draft Content</label>
                   <textarea
                     value={draft.body}
                     onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                     className="w-full flex-1 bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-[14px] leading-relaxed text-slate-600 font-medium resize-none focus:bg-white focus:border-blue-200 transition-all outline-none overflow-y-auto no-scrollbar"
                   />
                </div>

                <div className="mt-10 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest m-0">{(draft?.body || '').split(/\s+/).filter(Boolean).length} Tokens Drafted</p>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <Button
                        onClick={handleCopy}
                        disabled={sending || sent}
                        variant="outline"
                        className={`!h-12 !px-6 !rounded-2xl transition-all ${copied ? '!border-emerald-600 !bg-emerald-50 !text-emerald-700' : ''}`}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span className="!font-black !uppercase !text-[11px] !tracking-widest ml-2">{copied ? 'Analyzed & Copied' : 'Copy Draft'}</span>
                      </Button>
                      
                      <Button
                        onClick={handleSend}
                        disabled={loading || sending || sent}
                        variant="primary"
                        className={`!h-12 !px-10 !rounded-2xl shadow-xl shadow-blue-500/20 transition-all ${sent ? '!bg-emerald-600' : ''}`}
                      >
                        {sending ? <RotateCw size={16} className="animate-spin" /> : (sent ? <Check size={16} /> : <Send size={16} />)}
                        <span className="!font-black !uppercase !text-[11px] !tracking-widest ml-2">{sending ? 'Processing...' : (sent ? 'Transmission Complete' : 'Execute Send')}</span>
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default EmailDraftModal;
