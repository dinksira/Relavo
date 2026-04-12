import React, { useState, useEffect } from 'react';
import { X, Sparkles, RotateCw, Copy, Check, Info, Mail, Clock } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { getRiskColors, getRiskLabel } from '../../utils/scoreHelpers';
import Button from '../ui/Button';

const EmailDraftModal = ({ isOpen, onClose, client }) => {
  const [tone, setTone] = useState('professional');
  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchDraft = async (selectedTone) => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await aiAPI.draftEmail(client.id, selectedTone);
      setDraft(res.data || res);
    } catch (error) {
      console.error('Error fetching draft:', error);
      setDraft({
        subject: `Checking in — ${client.name}`,
        body: `Hi ${client.contact_name || 'there'},\n\nI wanted to reach out and check how things are going on your end.\n\nWould love to connect this week if you have a few minutes.\n\nBest regards,\n\nThe Relavo Team`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && client) {
      fetchDraft(tone);
    }
  }, [isOpen]);

  const handleToneChange = (newTone) => {
    setTone(newTone);
    fetchDraft(newTone);
  };

  const handleCopy = () => {
    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const score = client.latest_health_score?.score || 0;
  const colors = getRiskColors(score);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: '100%', maxWidth: 860, background: '#fff', borderRadius: 16,
        overflow: 'hidden', display: 'flex', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Left Panel */}
        <div style={{
          width: '38%', background: '#1b2a3b', color: '#fff', padding: 32,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, opacity: 0.8 }}>
             <div style={{ width: 24, height: 24, background: '#3b82f6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Sparkles size={14} color="white" />
             </div>
             <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Email Drafter</span>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>{client.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
               <div style={{ px: 8, py: 2, background: colors.bar + '20', color: colors.bar, border: `1px solid ${colors.bar}40`, borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>
                 {getRiskLabel(score)}
               </div>
               <span style={{ fontSize: 20, fontWeight: 800, color: colors.bar }}>{score}</span>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

            <div style={{ spaceY: 12 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                 <Clock size={16} /> <span>Last contact: {client.last_contact_date ? Math.floor((Date.now() - new Date(client.last_contact_date)) / 86400000) : '—'} days ago</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 12 }}>
                 <Info size={16} /> <span>Overdue invoices: {client.invoices?.filter(i => i.status === 'overdue').length || 0}</span>
               </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

            <div>
               <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Why they need attention</p>
               <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
                 "{client.latest_health_score?.ai_insight || 'No specific insight available yet.'}"
               </p>
            </div>
          </div>

          <div>
             <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Email tone</p>
             <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, gap: 4 }}>
                {['warm', 'professional', 'direct'].map(t => (
                  <button
                    key={t}
                    onClick={() => handleToneChange(t)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                      background: tone === t ? '#fff' : 'transparent',
                      color: tone === t ? '#1b2a3b' : 'rgba(255,255,255,0.6)',
                      transition: 'all 200ms'
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: '62%', background: '#fff', padding: 32, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 24, right: 24, padding: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>AI-generated draft</span>
             </div>
             <button
               onClick={() => fetchDraft(tone)}
               disabled={loading}
               style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
             >
               <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Regenerate
             </button>
          </div>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <div style={{ width: 48, height: 48, border: '3px solid #f1f5f9', borderTopColor: '#3b82f6', borderRadius: '50%', marginBottom: 16 }} className="animate-spin" />
               <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Drafting your email...</p>
               <p style={{ fontSize: 14, color: '#64748b' }}>Groq AI is personalizing based on client history</p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>Subject</label>
                <input
                  type="text"
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#0f172a' }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>Email Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  style={{
                    width: '100%', flex: 1, padding: '16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                    color: '#334155', lineHeight: 1.7, resize: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                 <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{(draft?.body || '').split(/\s+/).filter(Boolean).length} words</p>
                 <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
                      background: copied ? '#16a34a' : '#3b82f6', color: '#fff', border: 'none',
                      fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 200ms',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                    }}
                 >
                   {copied ? <Check size={16} /> : <Copy size={16} />}
                   {copied ? 'Copied! ✓' : 'Copy Email'}
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDraftModal;
