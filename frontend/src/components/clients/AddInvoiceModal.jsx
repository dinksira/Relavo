import React, { useState } from 'react';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toast from '../ui/Toast';
import { clientsAPI } from '../../services/api';

const AddInvoiceModal = ({ isOpen, onClose, clientId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    status: 'pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 7 days from now
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
    if (!formData.amount || isNaN(formData.amount)) {
      setError('A valid amount is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await clientsAPI.addInvoice(clientId, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setShowToast(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err || 'Failed to add invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[440px] relative z-10 animate-scale-in overflow-hidden border border-[#e2e8f0]">
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Add Invoice.</h2>
            <p className="text-[#64748b] text-sm font-medium mt-1">Track client billing.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#94a3b8] hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
           <Input 
             label="Amount (USD)" 
             name="amount"
             type="number" 
             placeholder="0.00" 
             icon={DollarSign} 
             required 
             value={formData.amount}
             onChange={handleChange}
           />

           <div className="space-y-3">
              <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Payment Status</label>
              <div className="flex gap-2">
                 {['pending', 'paid', 'overdue'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`
                        flex-1 p-3 rounded-xl border-2 transition-all font-bold text-xs capitalize
                        ${formData.status === status 
                          ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]' 
                          : 'border-slate-100 hover:border-slate-200 text-[#64748b]'
                        }
                      `}
                    >
                       {status}
                    </button>
                 ))}
              </div>
           </div>

           <Input 
             label="Due Date" 
             name="due_date"
             type="date"
             icon={Calendar} 
             required
             value={formData.due_date}
             onChange={handleChange}
           />

           {error && <p className="bg-red-50 text-[#dc2626] text-[11px] font-bold py-2.5 px-4 rounded-xl border border-red-100/50">{error}</p>}

           <div className="pt-4 flex gap-4">
              <Button variant="outline" className="flex-1 py-4 font-bold" onClick={onClose} type="button">Cancel</Button>
              <Button variant="primary" className="flex-[1.5] py-4 font-black shadow-xl shadow-[#3b82f6]/20" loading={loading} type="submit">Create Invoice</Button>
           </div>
        </form>

        {showToast && <Toast message="Invoice added!" onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
};

export default AddInvoiceModal;
