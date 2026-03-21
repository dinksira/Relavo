import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { TOUCHPOINT_TYPES, OUTCOME_TYPES } from '../../utils/constants';

const TouchpointModal = ({ isOpen, onClose, clientId, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'call', outcome: 'positive', notes: '', date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (!form.notes.trim()) { toast.error('Notes are required'); return; }
    setLoading(true);
    try {
      await onSuccess(form);
      toast.success('Touchpoint logged!');
      setForm({ type: 'call', outcome: 'positive', notes: '', date: new Date().toISOString().split('T')[0] });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to log touchpoint');
    } finally { setLoading(false); }
  };

  const pillStyle = (active, color) => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit',
    background: active ? (color || '#3b82f6') : '#f1f5f9',
    color: active ? '#fff' : '#64748b',
    transition: 'all 150ms',
  });

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title="Log Touchpoint"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>Log Touchpoint</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 8 }}>Type *</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TOUCHPOINT_TYPES.map(t => (
              <button key={t.value} style={pillStyle(form.type === t.value)} onClick={() => setForm(p => ({ ...p, type: t.value }))}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 8 }}>Outcome *</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {OUTCOME_TYPES.map(o => (
              <button key={o.value} style={pillStyle(form.outcome === o.value, o.color)} onClick={() => setForm(p => ({ ...p, outcome: o.value }))}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4, display: 'block' }}>Date</label>
          <input type="date" value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            style={{
              width: '100%', height: 40, padding: '0 12px',
              border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
              fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4, display: 'block' }}>Notes *</label>
          <textarea
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="What was discussed? Any key takeaways?"
            rows={4}
            style={{
              width: '100%', padding: 12, border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
              color: '#0f172a', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TouchpointModal;
