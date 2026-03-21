import React, { useState } from 'react';
import { X, Phone, Mail, Video, MessageSquare, Calendar, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toast from '../ui/Toast';
import { clientsAPI } from '../../services/api';

const LogTouchpointModal = ({ isOpen, onClose, clientId, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'call',
    notes: '',
    outcome: 'neutral',
    logged_at: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await clientsAPI.logTouchpoint(clientId, formData);
      setShowToast(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err || 'Failed to log touchpoint');
    } finally {
      setLoading(false);
    }
  };

  const touchpointTypes = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'meeting', label: 'Meeting', icon: Video },
    { value: 'message', label: 'Message', icon: MessageSquare },
  ];

  const outcomeTypes = [
    { value: 'positive', label: 'Positive', icon: CheckCircle2, color: 'text-[#16a34a]' },
    { value: 'neutral', label: 'Neutral', icon: HelpCircle, color: 'text-[#64748b]' },
    { value: 'negative', label: 'Negative', icon: AlertCircle, color: 'text-[#dc2626]' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] relative z-10 animate-scale-in overflow-hidden border border-[#e2e8f0]">
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Log activity.</h2>
            <p className="text-[#64748b] text-sm font-medium mt-1">Record a client interaction.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#94a3b8] hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Type of Contact</label>
              <div className="grid grid-cols-2 gap-3">
                 {touchpointTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`
                        flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all font-bold text-sm
                        ${formData.type === type.value 
                          ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]' 
                          : 'border-slate-100 hover:border-slate-200 text-[#64748b]'
                        }
                      `}
                    >
                       <type.icon size={18} />
                       {type.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Overall Outcome</label>
              <div className="flex gap-2">
                 {outcomeTypes.map((outcome) => (
                    <button
                      key={outcome.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, outcome: outcome.value })}
                      className={`
                        flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all
                        ${formData.outcome === outcome.value 
                          ? 'border-[#0f172a] bg-[#0f172a]/5' 
                          : 'border-slate-100 hover:border-slate-200'
                        }
                      `}
                    >
                       <outcome.icon size={20} className={outcome.color} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]">{outcome.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Interaction Notes</label>
              <textarea 
                name="notes"
                rows="4" 
                placeholder="What was discussed? Any follow-up actions?" 
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl transition-all font-semibold text-sm placeholder:text-[#94a3b8] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.12)] resize-none"
              />
           </div>

           <Input 
             label="Date of Contact" 
             name="logged_at"
             type="date"
             icon={Calendar} 
             value={formData.logged_at}
             onChange={handleChange}
           />

           {error && <p className="bg-red-50 text-[#dc2626] text-[11px] font-bold py-2.5 px-4 rounded-xl border border-red-100/50">{error}</p>}

           <div className="pt-4 flex gap-4">
              <Button variant="outline" className="flex-1 py-4 font-bold" onClick={onClose} type="button">Cancel</Button>
              <Button variant="primary" className="flex-[1.5] py-4 font-black shadow-xl shadow-[#3b82f6]/20" loading={loading} type="submit">Log Activity</Button>
           </div>
        </form>

        {showToast && <Toast message="Activity logged!" onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
};

export default LogTouchpointModal;
