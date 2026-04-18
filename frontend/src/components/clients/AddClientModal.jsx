import React, { useState } from 'react';
import { UserPlus, Building, Mail, Phone, Activity, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';

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

const AddClientModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', contact_name: '', email: '', phone: '', status: 'active', notes: ''
  });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Company name is required'); return; }
    setLoading(true);
    try {
      await onSuccess(form);
      toast.success('Registration sequence successful');
      setForm({ name: '', contact_name: '', email: '', phone: '', status: 'active', notes: '' });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Onboarding interrupted');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[14px] text-slate-900 font-medium placeholder:text-slate-300 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none";

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose}
      title="Asset Onboarding"
      subtitle="Register new client node to relavo neural ledger"
      icon={UserPlus}
      footer={
        <>
          <Button variant="outline" className="!rounded-xl !h-12 !px-6" onClick={onClose}>Abort</Button>
          <Button variant="primary" className="!rounded-xl !h-12 !px-8" loading={loading} onClick={handleSubmit}>Initialize Account</Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Company Identity" icon={Building}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Nexus Corp" className={inputClass} />
          </InputGroup>
          <InputGroup label="Principal Contact" icon={Activity}>
            <input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Executive name" className={inputClass} />
          </InputGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Comm Channel (Email)" icon={Mail}>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="executive@nexus.com" className={inputClass} />
          </InputGroup>
          <InputGroup label="Comm Channel (Phone)" icon={Phone}>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 000 000 0000" className={inputClass} />
          </InputGroup>
        </div>

        <InputGroup label="Strategic Notes" icon={FileText}>
          <textarea
            name="notes" value={form.notes} onChange={handleChange}
            placeholder="Additional context and relationship objectives..."
            className={`${inputClass} !h-32 !py-4 resize-none`}
          />
        </InputGroup>
      </div>
    </Modal>
  );
};

export default AddClientModal;
