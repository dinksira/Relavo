import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { clientsAPI, aiAPI } from '../../services/api';
import useClients from '../../hooks/useClients';
import { Search, ChevronDown, Check, Activity, DollarSign, Zap, Target, ShieldCheck } from 'lucide-react';

const QuickLogModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const { clients } = useClients();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('activity'); 
  const dropdownRef = useRef(null);
  
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    type: 'call',
    notes: '',
    outcome: 'neutral',
    amount: '',
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    invoice_status: 'pending'
  });

  const filteredClients = (Array.isArray(clients) ? clients : []).filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.clientId) { toast.error('Please select a client'); return; }
    
    setLoading(true);
    try {
      if (activeTab === 'activity') {
        if (!form.notes.trim()) { toast.error('Please add a note'); setLoading(false); return; }
        
        await clientsAPI.logTouchpoint(form.clientId, {
          type: form.type,
          notes: form.notes,
          outcome: form.outcome,
          logged_at: new Date().toISOString()
        });
      } else {
        if (!form.amount || isNaN(form.amount)) { toast.error('Please enter a valid amount'); setLoading(false); return; }
        
        await clientsAPI.addInvoice(form.clientId, {
          amount: parseFloat(form.amount),
          due_date: form.due_date,
          status: form.invoice_status
        });
      }
      
      await aiAPI.analyzeClient(form.clientId);
      toast.success(activeTab === 'activity' ? 'Activity logged!' : 'Invoice added!');
      
      setForm(p => ({
        ...p,
        type: 'call',
        notes: '',
        outcome: 'neutral',
        amount: '',
        invoice_status: 'pending'
      }));
      
      onSuccess?.({ clientId: form.clientId });
      onClose();
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[14px] text-slate-900 font-medium focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 mb-2 block";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose}
      title="Intelligence Entry"
      subtitle="Rapid synchronization of relationship data"
      icon={Zap}
      footer={
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          loading={loading}
          className="!w-full !h-12 !rounded-2xl !font-black !uppercase !text-[11px] !tracking-widest shadow-xl shadow-blue-500/20"
        >
          {activeTab === 'activity' ? 'Commit Activity Log' : 'Synchronize Invoice'}
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
           <button 
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
               activeTab === 'activity' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
             }`}
             onClick={() => setActiveTab('activity')}
           >
              <Activity size={14} /> Activity
           </button>
           <button 
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
               activeTab === 'invoice' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
             }`}
             onClick={() => setActiveTab('invoice')}
           >
              <DollarSign size={14} /> Invoice
           </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className={labelClass}>Target Client</label>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`${inputClass} flex items-center justify-between cursor-pointer group`}
          >
            {form.clientId ? (
              <span className="font-black text-slate-900 italic">{form.clientName}</span>
            ) : (
              <span className="text-slate-400">Select network node...</span>
            )}
            <ChevronDown size={16} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-[110] bg-white rounded-[24px] shadow-2xl border border-slate-100 mt-2 overflow-hidden animate-in slide-in-from-top-2 duration-300">
              <div className="p-3 border-b border-slate-50">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                  <Search size={14} className="text-slate-400" />
                  <input 
                    autoFocus
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search directory..."
                    className="border-none bg-transparent h-8 text-[13px] outline-none w-full font-medium"
                  />
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto no-scrollbar">
                {filteredClients.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => {
                      setForm(p => ({ ...p, clientId: c.id, clientName: c.name }));
                      setShowDropdown(false);
                    }}
                    className="px-6 py-3.5 text-[13px] text-slate-600 cursor-pointer hover:bg-slate-50 flex justify-between items-center transition-colors"
                  >
                    <span className={form.clientId === c.id ? 'font-black text-blue-600' : 'font-medium'}>{c.name}</span>
                    {form.clientId === c.id && <Check size={14} className="text-blue-600" />}
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="px-6 py-8 text-center text-slate-400 text-[12px] italic">No matching assets found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {activeTab === 'activity' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <label className={labelClass}>Protocol Method</label>
              <div className="flex flex-wrap gap-2">
                {['Call', 'Email', 'Conf', 'Log'].map(type => (
                  <button 
                    key={type}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                      form.type === type.toLowerCase() 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                    onClick={() => setForm(p => ({ ...p, type: type.toLowerCase() }))}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Analytical Notes</label>
              <textarea 
                value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Key takeaways from this interaction..."
                className={`${inputClass} !h-28 !py-4 resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Signal Strength</label>
              <div className="flex gap-2">
                {[
                  { v: 'positive', l: 'Optimal', c: 'emerald' },
                  { v: 'neutral', l: 'Steady', c: 'slate' },
                  { v: 'negative', l: 'Critical', c: 'rose' }
                ].map(opt => (
                  <button 
                    key={opt.v}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                      form.outcome === opt.v
                        ? `bg-${opt.c}-600 text-white border-${opt.c}-600 shadow-lg shadow-${opt.c}-500/20`
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                    onClick={() => setForm(p => ({ ...p, outcome: opt.v }))}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className={labelClass}>Exposure ($)</label>
                  <input 
                    type="number"
                    value={form.amount} 
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00"
                    className={inputClass}
                  />
               </div>
               <div>
                  <label className={labelClass}>Maturity Date</label>
                  <input 
                    type="date"
                    value={form.due_date} 
                    onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                    className={inputClass}
                  />
               </div>
            </div>

            <div>
               <label className={labelClass}>Settlement Status</label>
               <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  {['pending', 'paid', 'overdue'].map(status => (
                    <button 
                      key={status}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
                        form.invoice_status === status ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                      }`}
                      onClick={() => setForm(p => ({ ...p, invoice_status: status }))}
                    >
                      {status}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuickLogModal;
