import React, { useState } from 'react';
import { DollarSign, Hash, Calendar, ShieldCheck, FileText, Landmark } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { aiAPI } from '../../services/api';

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={16} />
        </div>
      )}
      {children}
    </div>
  </div>
);

const InvoiceModal = ({ isOpen, onClose, clientId, clientName, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '', 
    status: 'pending', 
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    invoice_number: '',
    issued_at: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async () => {
    if (!form.amount || isNaN(form.amount)) { toast.error('Valid amount is required'); return; }
    if (!form.invoice_number) { toast.error('Invoice number is required'); return; }
    
    setLoading(true);
    try {
      await onSuccess({ ...form, amount: parseFloat(form.amount) });
      await aiAPI.analyzeClient(clientId);
      toast.success('Financial record synchronized');
      setForm({ 
        amount: '', status: 'pending', 
        due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        invoice_number: '', issued_at: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Transaction logging failed');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[14px] text-slate-900 font-medium focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none";

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose}
      title="Financial Auditing"
      subtitle={`Asset billing management for ${clientName}`}
      icon={Landmark}
      footer={
        <>
          <Button variant="outline" className="!rounded-xl !h-12 !px-6" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="!rounded-xl !h-12 !px-8" loading={loading} onClick={handleSubmit}>Initialize Invoice</Button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <InputGroup label="Exposure (USD)" icon={DollarSign}>
            <input type="number" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className={inputClass}
            />
          </InputGroup>
          <InputGroup label="Control Number" icon={Hash}>
            <input type="text" value={form.invoice_number}
              onChange={e => setForm(p => ({ ...p, invoice_number: e.target.value }))}
              placeholder="INV-XXXX"
              className={inputClass}
            />
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputGroup label="Issuance Date" icon={Calendar}>
            <input type="date" value={form.issued_at}
              onChange={e => setForm(p => ({ ...p, issued_at: e.target.value }))}
              className={inputClass}
            />
          </InputGroup>
          <InputGroup label="Maturity Date" icon={Calendar}>
            <input type="date" value={form.due_date}
              onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
              className={inputClass}
            />
          </InputGroup>
        </div>

        <InputGroup label="Institutional Status" icon={ShieldCheck}>
          <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {['pending', 'paid', 'overdue'].map(s => (
              <button
                key={s}
                onClick={() => setForm(p => ({ ...p, status: s }))}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                  form.status === s 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </InputGroup>

        <InputGroup label="Transaction Reference" icon={FileText}>
          <input 
            type="text" 
            value={form.notes} 
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Add internal billing audit notes..."
            className={inputClass}
          />
        </InputGroup>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
