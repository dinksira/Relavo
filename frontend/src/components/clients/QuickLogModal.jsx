import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { clientsAPI, aiAPI } from '../../services/api';
import useClients from '../../hooks/useClients';
import { Search, ChevronDown, Check } from 'lucide-react';

const QuickLogModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const { clients } = useClients();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    type: 'call',
    notes: '',
    outcome: 'neutral'
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.clientId) { toast.error('Please select a client'); return; }
    if (!form.notes.trim()) { toast.error('Please add a note'); return; }
    
    setLoading(true);
    try {
      await clientsAPI.logTouchpoint(form.clientId, {
        type: form.type,
        notes: form.notes,
        outcome: form.outcome,
        logged_at: new Date().toISOString()
      });
      
      // Trigger AI Analysis
      await aiAPI.analyzeClient(form.clientId);
      
      toast.success('Logged! ✓');
      setForm({ clientId: '', clientName: '', type: 'call', notes: '', outcome: 'neutral' });
      setSearch('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to log');
    } finally {
      setLoading(false);
    }
  };

  const pillStyle = (active) => ({
    padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', border: '1px solid',
    borderColor: active ? '#3b82f6' : '#e2e8f0',
    background: active ? '#3b82f6' : '#fff',
    color: active ? '#fff' : '#64748b',
    transition: 'all 150ms', fontFamily: 'inherit'
  });

  const emojiBtnStyle = (active, color) => ({
    fontSize: 24, padding: '8px 12px', borderRadius: 12, background: active ? '#f1f5f9' : 'transparent',
    border: active ? `2px solid ${color}` : '2px solid transparent', cursor: 'pointer', transition: 'all 150ms'
  });

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
      title="Quick Log"
      size="sm"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 10 }}>
        {/* Searchable Client Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Client</label>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              width: '100%', padding: '0 12px', height: 44, border: '1px solid #e2e8f0',
              borderRadius: 8, cursor: 'text', background: '#fff'
            }}
          >
            {form.clientId ? (
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{form.clientName}</span>
            ) : (
              <span style={{ fontSize: 14, color: '#94a3b8' }}>Search clients...</span>
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
              {filteredClients.length === 0 && <div style={{ padding: 12, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No clients found</div>}
            </div>
          )}
        </div>

        {/* Type Pill Selector */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Type</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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

        {/* Notes (Single Line) */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Notes</label>
          <input 
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="What happened?"
            style={{ 
              width: '100%', height: 44, padding: '0 12px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Outcome Emojis */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Outcome</label>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            <button style={emojiBtnStyle(form.outcome === 'positive', '#16a34a')} onClick={() => setForm(p => ({ ...p, outcome: 'positive' }))}>😊</button>
            <button style={emojiBtnStyle(form.outcome === 'neutral', '#94a3b8')} onClick={() => setForm(p => ({ ...p, outcome: 'neutral' }))}>😐</button>
            <button style={emojiBtnStyle(form.outcome === 'negative', '#dc2626')} onClick={() => setForm(p => ({ ...p, outcome: 'negative' }))}>😟</button>
          </div>
        </div>

        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          loading={loading}
          style={{ width: '100%', height: 48, fontWeight: 800, fontSize: 15, borderRadius: 12, marginTop: 8 }}
        >
          Log It
        </Button>
      </div>
    </Modal>
  );
};

export default QuickLogModal;
