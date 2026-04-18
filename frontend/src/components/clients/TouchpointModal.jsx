import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, MessageSquare, Zap, Target } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { aiAPI } from '../../services/api';

const TOUCHPOINT_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Conference' },
  { value: 'message', label: 'Message' },
  { value: 'meeting', label: 'On-site' }
];

const OUTCOME_TYPES = [
  { value: 'positive', label: 'Optimal', color: 'emerald' },
  { value: 'neutral', label: 'Steady', color: 'slate' },
  { value: 'negative', label: 'Critical', color: 'rose' }
];

const InputGroup = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{label}</label>
    {children}
  </div>
);

const TouchpointModal = ({ isOpen, onClose, clientId, clientName, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'call', 
    outcome: 'neutral', 
    notes: '', 
    logged_at: new Date().toISOString().split('T')[0],
    duration: 15,
    follow_up_needed: false,
    follow_up_date: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm(p => ({ ...p, logged_at: new Date().toISOString().split('T')[0] }));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!form.notes.trim()) { toast.error('Notes are required'); return; }
    setLoading(true);
    try {
      await onSuccess(form);
      await aiAPI.analyzeClient(clientId);
      toast.success('Engagement registered. Score updated.');
      setForm({ 
        type: 'call', outcome: 'neutral', notes: '', 
        logged_at: new Date().toISOString().split('T')[0],
        duration: 15, follow_up_needed: false, follow_up_date: ''
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Log sequence failed');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[14px] text-slate-900 font-medium focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none";

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose}
      title="Engagement Logging"
      subtitle={`Tracing activities for ${clientName}`}
      icon={Zap}
      footer={
        <>
          <Button variant="outline" className="!rounded-xl !h-12 !px-6" onClick={onClose}>Discard</Button>
          <Button variant="primary" className="!rounded-xl !h-12 !px-8" loading={loading} onClick={handleSubmit}>Register Activity</Button>
        </>
      }
    >
      <div className="space-y-8">
        <InputGroup label="Interaction Protocol">
          <div className="flex flex-wrap gap-2">
            {TOUCHPOINT_TYPES.map(t => (
              <button 
                key={t.value} 
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                  form.type === t.value 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
                onClick={() => setForm(p => ({ ...p, type: t.value }))}
              >
                {t.label}
              </button>
            ))}
          </div>
        </InputGroup>

        <div className="grid grid-cols-2 gap-6">
          <InputGroup label="Sequence Date">
            <input type="date" value={form.logged_at}
              onChange={e => setForm(p => ({ ...p, logged_at: e.target.value }))}
              className={inputClass}
            />
          </InputGroup>
          <InputGroup label="Duration (mins)">
            <input type="number" value={form.duration}
              onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
              className={inputClass}
            />
          </InputGroup>
        </div>

        <InputGroup label="Analytical Notes">
          <textarea
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Key takeaways from this interaction..."
            className={`${inputClass} !h-32 !py-4 resize-none`}
          />
        </InputGroup>

        <InputGroup label="Final Sentiment">
          <div className="flex gap-2">
            {OUTCOME_TYPES.map(o => (
              <button 
                key={o.value} 
                className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                  form.outcome === o.value 
                    ? `bg-${o.color}-600 text-white border-${o.color}-600 shadow-lg shadow-${o.color}-500/20` 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
                onClick={() => setForm(p => ({ ...p, outcome: o.value }))}
              >
                {o.label}
              </button>
            ))}
          </div>
        </InputGroup>

        <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[24px]">
          <div className="flex items-center gap-4">
             <div className="relative">
               <input 
                 type="checkbox" 
                 checked={form.follow_up_needed}
                 onChange={e => setForm(p => ({ ...p, follow_up_needed: e.target.checked }))}
                 className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
               />
             </div>
             <div>
                <p className="text-[14px] font-black text-slate-900 m-0 leading-none tracking-tight italic">Follow-up Required</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 m-0">Set strategic reminder</p>
             </div>
          </div>
          {form.follow_up_needed && (
            <input 
              type="date"
              value={form.follow_up_date}
              onChange={e => setForm(p => ({ ...p, follow_up_date: e.target.value }))}
              className={`${inputClass} !h-10 !w-40 !px-3 !text-[12px] !rounded-xl animate-in slide-in-from-right-2 duration-300`}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TouchpointModal;
