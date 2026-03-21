import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';

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
      toast.success('Client added successfully!');
      setForm({ name: '', contact_name: '', email: '', phone: '', status: 'active', notes: '' });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', height: 40, padding: '0 12px',
    border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
    outline: 'none', boxSizing: 'border-box',
    background: '#fff',
  };

  const labelStyle = { fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4, display: 'block' };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title="Add new client"
      subtitle="Start monitoring a new client relationship"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>Add Client</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Company Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Acme Corp" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Contact Name</label>
          <input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Primary contact person" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@company.com" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            name="notes" value={form.notes} onChange={handleChange}
            placeholder="Any context about this client..."
            rows={3}
            style={{ ...inputStyle, height: 'auto', padding: 12, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;
