import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { aiAPI } from '../../services/api';

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
      
      // Trigger AI Analysis
      await aiAPI.analyzeClient(clientId);
      
      toast.success('Invoice logged! Health score updated.');
      setForm({ 
        amount: '', status: 'pending', 
        due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        invoice_number: '', issued_at: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add invoice');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', height: 40, padding: '0 12px',
    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
    fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
    background: '#fff',
  };

  const labelStyle = { 
    fontSize: 11, fontWeight: 700, color: '#94a3b8', 
    textTransform: 'uppercase', letterSpacing: '0.05em', 
    marginBottom: 6, display: 'block' 
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title="Add Invoice"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>Create Invoice</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {clientName && (
           <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
             <p style={{ fontSize: 13, color: '#1d4ed8', margin: 0, fontWeight: 500 }}>
               Invoice for <strong>{clientName}</strong>
             </p>
           </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Amount (USD) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: '#64748b', fontSize: 14, fontWeight: 600
              }}>$</span>
              <input type="number" value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="0.00"
                style={{ ...inputStyle, paddingLeft: 28 }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Invoice Number *</label>
            <input type="text" value={form.invoice_number}
              onChange={e => setForm(p => ({ ...p, invoice_number: e.target.value }))}
              placeholder="INV-0001"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Issue Date</label>
            <input type="date" value={form.issued_at}
              onChange={e => setForm(p => ({ ...p, issued_at: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={form.due_date}
              onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Payment Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['pending', 'paid', 'overdue'].map(s => (
              <button
                key={s}
                onClick={() => setForm(p => ({ ...p, status: s }))}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  textTransform: 'capitalize', cursor: 'pointer', border: '2px solid',
                  borderColor: form.status === s ? '#3b82f6' : '#f1f5f9',
                  background: form.status === s ? '#eff6ff' : '#f1f5f9',
                  color: form.status === s ? '#3b82f6' : '#64748b',
                  fontFamily: 'inherit', transition: 'all 150ms'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Internal Notes</label>
          <input 
            type="text" 
            value={form.notes} 
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Add a reference..."
            style={inputStyle}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
