import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { aiAPI } from '../../services/api';

const TOUCHPOINT_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'message', label: 'Message' },
  { value: 'video', label: 'Video Call' }
];

const OUTCOME_TYPES = [
  { value: 'positive', label: 'Positive', color: '#16a34a' },
  { value: 'neutral', label: 'Neutral', color: '#94a3b8' },
  { value: 'negative', label: 'Negative', color: '#dc2626' }
];

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
      
      // Trigger AI Analysis
      await aiAPI.analyzeClient(clientId);
      
      toast.success('Touchpoint logged! Health score updated.');
      setForm({ 
        type: 'call', outcome: 'neutral', notes: '', 
        logged_at: new Date().toISOString().split('T')[0],
        duration: 15, follow_up_needed: false, follow_up_date: ''
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to log touchpoint');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', height: 40, padding: '0 12px',
    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
    fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
    background: '#fff',
  };

  const pillStyle = (active, color) => ({
    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', border: '1px solid', 
    fontFamily: 'inherit',
    borderColor: active ? (color || '#3b82f6') : '#e2e8f0',
    background: active ? (color || '#3b82f6') : '#fff',
    color: active ? '#fff' : '#64748b',
    transition: 'all 150ms',
    display: 'flex', alignItems: 'center', gap: 6,
  });

  const labelStyle = { 
    fontSize: 11, fontWeight: 700, color: '#94a3b8', 
    textTransform: 'uppercase', letterSpacing: '0.05em', 
    marginBottom: 6, display: 'block' 
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title="Log Interaction"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>Log Activity</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {clientName && (
           <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
             <p style={{ fontSize: 13, color: '#1d4ed8', margin: 0, fontWeight: 500 }}>
               Logging for <strong>{clientName}</strong>
             </p>
           </div>
        )}

        <div>
          <label style={labelStyle}>Contact Type</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TOUCHPOINT_TYPES.map(t => (
              <button key={t.value} style={pillStyle(form.type === t.value)} onClick={() => setForm(p => ({ ...p, type: t.value }))}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.logged_at}
              onChange={e => setForm(p => ({ ...p, logged_at: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Duration (mins)</label>
            <input type="number" value={form.duration}
              onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Interaction Notes</label>
          <textarea
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Key takeaways from this interaction..."
            rows={4}
            style={{
              ...inputStyle, height: 'auto', padding: 12, resize: 'none', lineHeight: 1.6
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Overall Outcome</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {OUTCOME_TYPES.map(o => (
              <button key={o.value} style={pillStyle(form.outcome === o.value, o.color)} onClick={() => setForm(p => ({ ...p, outcome: o.value }))}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
             <input 
               type="checkbox" 
               checked={form.follow_up_needed}
               onChange={e => setForm(p => ({ ...p, follow_up_needed: e.target.checked }))}
               style={{ width: 18, height: 18, cursor: 'pointer' }}
             />
             <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Follow-up needed?</span>
          </div>
          {form.follow_up_needed && (
            <input 
              type="date"
              value={form.follow_up_date}
              onChange={e => setForm(p => ({ ...p, follow_up_date: e.target.value }))}
              style={{ ...inputStyle, width: 140, height: 32, fontSize: 12 }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TouchpointModal;
