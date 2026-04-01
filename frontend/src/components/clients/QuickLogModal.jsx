import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { clientsAPI, aiAPI } from '../../services/api';
import useClients from '../../hooks/useClients';
import { Search, ChevronDown, Check, Activity, DollarSign } from 'lucide-react';

const QuickLogModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const { clients } = useClients();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('activity'); 
  const dropdownRef = useRef(null);
  
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    type: 'call',
    notes: '',
    outcome: 'neutral',
    amount: '',
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    invoice_status: 'pending'
  });

  const filteredClients = (Array.isArray(clients) ? clients : []).filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.clientId) { toast.error('Please select a client'); return; }
    
    setLoading(true);
    try {
      if (activeTab === 'activity') {
        if (!form.notes.trim()) { toast.error('Please add a note'); setLoading(false); return; }
        
        await clientsAPI.logTouchpoint(form.clientId, {
          type: form.type,
          notes: form.notes,
          outcome: form.outcome,
          logged_at: new Date().toISOString()
        });
      } else {
        if (!form.amount || isNaN(form.amount)) { toast.error('Please enter a valid amount'); setLoading(false); return; }
        
        await clientsAPI.addInvoice(form.clientId, {
          amount: parseFloat(form.amount),
          due_date: form.due_date,
          status: form.invoice_status
        });
      }
      
      await aiAPI.analyzeClient(form.clientId);
      toast.success(activeTab === 'activity' ? 'Activity logged!' : 'Invoice added!');
      
      setForm(p => ({
        ...p,
        type: 'call',
        notes: '',
        outcome: 'neutral',
        amount: '',
        invoice_status: 'pending'
      }));
      
      onSuccess?.({ clientId: form.clientId });
      onClose();
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const pillStyle = (active, activeColor = '#3b82f6') => ({
    padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', border: '1.5px solid',
    borderColor: active ? activeColor : '#e2e8f0',
    background: active ? activeColor : '#fff',
    color: active ? '#fff' : '#64748b',
    transition: 'all 150ms', fontFamily: 'inherit',
    flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'
  });

  const tabStyle = (active) => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
    borderBottom: '2px solid', 
    borderColor: active ? '#3b82f6' : 'transparent',
    color: active ? '#3b82f6' : '#94a3b8',
    transition: 'all 200ms', background: 'transparent'
  });

  const inputStyle = {
    width: '100%', height: 44, padding: '0 12px', border: '1px solid #e2e8f0',
    borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
    boxSizing: 'border-box'
  };

  const labelStyle = { 
    fontSize: 11, fontWeight: 800, color: '#94a3b8', 
    textTransform: 'uppercase', marginBottom: 6, display: 'block',
    letterSpacing: '0.05em'
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title="Quick Entry"
      size="sm"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
           <button style={tabStyle(activeTab === 'activity')} onClick={() => setActiveTab('activity')}>
              <Activity size={14} /> Activity
           </button>
           <button style={tabStyle(activeTab === 'invoice')} onClick={() => setActiveTab('invoice')}>
              <DollarSign size={14} /> Invoice
           </button>
        </div>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <label style={labelStyle}>Client</label>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              ...inputStyle, display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', cursor: 'text'
            }}
          >
            {form.clientId ? (
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{form.clientName}</span>
            ) : (
              <span style={{ color: '#94a3b8' }}>Select client...</span>
            )}
            <ChevronDown size={16} color="#94a3b8" />
          </div>

          {showDropdown && (
            <div style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: '#fff', borderRadius: 8, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0', marginTop: 4, maxHeight: 200, overflowY: 'auto'
            }}>
              <div style={{ padding: 8, borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '0 8px', borderRadius: 6 }}>
                  <Search size={14} color="#94a3b8" />
                  <input 
                    autoFocus
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Type name..."
                    style={{ border: 'none', background: 'transparent', height: 32, fontSize: 13, outline: 'none', width: '100%' }}
                  />
                </div>
              </div>
              {filteredClients.map(c => (
                <div 
                  key={c.id}
                  onClick={() => {
                    setForm(p => ({ ...p, clientId: c.id, clientName: c.name }));
                    setShowDropdown(false);
                  }}
                  style={{ 
                    padding: '10px 12px', fontSize: 13, color: '#334155', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: form.clientId === c.id ? 700 : 500 }}>{c.name}</span>
                  {form.clientId === c.id && <Check size={14} color="#3b82f6" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'activity' ? (
          <>
            <div>
              <label style={labelStyle}>Contact Method</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Call', 'Email', 'Meeting', 'Message'].map(type => (
                  <button 
                    key={type}
                    style={pillStyle(form.type === type.toLowerCase())}
                    onClick={() => setForm(p => ({ ...p, type: type.toLowerCase() }))}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Interaction Notes</label>
              <textarea 
                value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="What was discussed?"
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '12px', resize: 'none' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Outcome</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  style={pillStyle(form.outcome === 'positive', '#16a34a')} 
                  onClick={() => setForm(p => ({ ...p, outcome: 'positive' }))}
                >
                  Positive
                </button>
                <button 
                  style={pillStyle(form.outcome === 'neutral', '#94a3b8')} 
                  onClick={() => setForm(p => ({ ...p, outcome: 'neutral' }))}
                >
                  Neutral
                </button>
                <button 
                  style={pillStyle(form.outcome === 'negative', '#dc2626')} 
                  onClick={() => setForm(p => ({ ...p, outcome: 'negative' }))}
                >
                  Negative
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               <div>
                  <label style={labelStyle}>Amount ($)</label>
                  <input 
                    type="number"
                    value={form.amount} 
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00"
                    style={inputStyle}
                  />
               </div>
               <div>
                  <label style={labelStyle}>Due Date</label>
                  <input 
                    type="date"
                    value={form.due_date} 
                    onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                    style={inputStyle}
                  />
               </div>
            </div>

            <div>
               <label style={labelStyle}>Status</label>
               <div style={{ display: 'flex', gap: 8 }}>
                  {['pending', 'paid', 'overdue'].map(status => (
                    <button 
                      key={status}
                      style={pillStyle(form.invoice_status === status)}
                      onClick={() => setForm(p => ({ ...p, invoice_status: status }))}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
               </div>
            </div>
          </>
        )}

        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          loading={loading}
          style={{ width: '100%', height: 48, fontWeight: 900, fontSize: 15, borderRadius: 12, marginTop: 8 }}
        >
          {activeTab === 'activity' ? 'Log Activity' : 'Create Invoice'}
        </Button>
      </div>
    </Modal>
  );
};

export default QuickLogModal;
