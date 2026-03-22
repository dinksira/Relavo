import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Video, MessageSquare, Calendar, CheckCircle2, AlertCircle, HelpCircle, Clock, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { clientsAPI, aiAPI } from '../../services/api';
import useToast from '../../hooks/useToast';

const LogTouchpointModal = ({ isOpen, onClose, clientId, clientName, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: 'call',
    notes: '',
    outcome: 'neutral',
    logged_at: new Date().toISOString().split('T')[0],
    duration: 15,
    follow_up_needed: false,
    follow_up_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        logged_at: new Date().toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await clientsAPI.logTouchpoint(clientId, formData);
      
      // Immediately trigger AI analysis
      await aiAPI.analyzeClient(clientId);
      
      toast.success('Touchpoint logged! Health score updated.');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to log touchpoint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const touchpointTypes = [
    { value: 'call', label: 'Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'meeting', label: 'Meeting', icon: Video },
    { value: 'message', label: 'Message', icon: MessageSquare },
    { value: 'video', label: 'Video Call', icon: Video },
  ];

  const outcomeTypes = [
    { value: 'positive', label: 'Positive', icon: CheckCircle2, color: 'text-[#16a34a]' },
    { value: 'neutral', label: 'Neutral', icon: HelpCircle, color: 'text-[#64748b]' },
    { value: 'negative', label: 'Negative', icon: AlertCircle, color: 'text-[#dc2626]' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[520px] relative z-10 overflow-hidden border border-[#e2e8f0]">
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Log Touchpoint</h2>
            <p className="text-[#64748b] text-sm font-medium mt-1">Recording interaction with <span className="text-[#3b82f6] font-bold">{clientName || 'Client'}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-all text-[#94a3b8]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
           <div className="space-y-2.5">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">Contact Method</label>
              <div className="flex flex-wrap gap-2">
                 {touchpointTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-bold text-xs
                        ${formData.type === type.value 
                          ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]' 
                          : 'border-slate-50 bg-slate-50 text-[#64748b] hover:border-slate-200'
                        }
                      `}
                    >
                       <type.icon size={14} />
                       {type.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Date" 
               name="logged_at"
               type="date"
               icon={Calendar} 
               value={formData.logged_at}
               onChange={handleChange}
             />
             <Input 
               label="Duration (mins)" 
               name="duration"
               type="number"
               icon={Clock} 
               value={formData.duration}
               onChange={handleChange}
             />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">Interaction Notes</label>
              <textarea 
                name="notes"
                rows="3" 
                placeholder="Key takeaways from this interaction..." 
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl transition-all font-medium text-sm text-[#0f172a] focus:outline-none focus:bg-white focus:border-[#3b82f6] resize-none"
              />
           </div>

           <div className="space-y-2.5">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">Outcome</label>
              <div className="flex gap-3">
                 {outcomeTypes.map((outcome) => (
                    <button
                      key={outcome.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, outcome: outcome.value })}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs
                        ${formData.outcome === outcome.value 
                          ? 'border-[#0f172a] bg-[#0f172a] text-white' 
                          : 'border-slate-50 bg-slate-50 text-[#64748b] hover:border-slate-200'
                        }
                      `}
                    >
                       <outcome.icon size={16} />
                       {outcome.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-6 rounded-full relative transition-all cursor-pointer ${formData.follow_up_needed ? 'bg-[#3b82f6]' : 'bg-slate-300'}`}
                     onClick={() => setFormData(p => ({ ...p, follow_up_needed: !p.follow_up_needed }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.follow_up_needed ? 'right-1' : 'left-1'}`} />
                </div>
                <span className="text-sm font-bold text-[#0f172a]">Follow-up needed?</span>
             </div>
             {formData.follow_up_needed && (
               <input 
                 type="date"
                 name="follow_up_date"
                 value={formData.follow_up_date}
                 onChange={handleChange}
                 className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#3b82f6]"
               />
             )}
           </div>

           <div className="pt-2 flex gap-4">
              <Button variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</Button>
              <Button variant="primary" className="flex-[1.5] shadow-lg shadow-[#3b82f6]/20" loading={loading} type="submit">Log It</Button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default LogTouchpointModal;
