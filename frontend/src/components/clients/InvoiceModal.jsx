import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';

const InvoiceModal = ({ isOpen, onClose, clientId, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '', status: 'pending', due_date: '', paid_date: ''
  });

  const handleSubmit = async () => {
    if (!form.amount) { toast.error('Amount is required'); return; }
    setLoading(true);
    try {
      await onSuccess({ ...form, amount: parseFloat(form.amount) });
      toast.success('Invoice added!');
      setForm({ amount: '', status: 'pending', due_date: '', paid_date: '' });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add invoice');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', height: 40, padding: '0 12px',
    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
    fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4, display: 'block' };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} title="Add Invoice" size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>Add Invoice</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Amount *</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#64748b', fontSize: 14,
            }}>$</span>
            <input type="number" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0"
              style={{ ...inputStyle, paddingLeft: 28 }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Due Date</label>
          <input type="date" value={form.due_date}
            onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
            style={inputStyle}
          />
        </div>
        {form.status === 'paid' && (
          <div>
            <label style={labelStyle}>Paid Date</label>
            <input type="date" value={form.paid_date}
              onChange={e => setForm(p => ({ ...p, paid_date: e.target.value }))}
              style={inputStyle}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvoiceModal;
