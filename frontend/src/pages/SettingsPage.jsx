import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import useToast from '../hooks/useToast';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const tabs = ['Profile', 'Notifications', 'Account'];

const SettingsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState('Profile');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    emailDigest: true, inAppAlerts: true, highOnly: false
  });

  const name = fullName || user?.email?.split('@')[0] || 'User';

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This is irreversible.')) return;
    toast.warning('Contact support to delete your account.');
  };

  const inputStyle = {
    width: '100%', height: 40, padding: '0 12px',
    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
    fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4, display: 'block' };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: 0 }}>Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        {/* Tabs */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, height: 'fit-content' }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 12px', borderRadius: 8,
                background: tab === t ? '#eff6ff' : 'none',
                color: tab === t ? '#3b82f6' : '#64748b',
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                fontFamily: 'inherit', marginBottom: 2,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
          {tab === 'Profile' && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Avatar name={name} size="xl" />
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{user?.email}</p>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Email (read-only)</label>
                <input value={user?.email || ''} readOnly style={{ ...inputStyle, color: '#94a3b8', background: '#f8fafc', cursor: 'not-allowed' }} />
              </div>
              <Button variant="primary" loading={saving} onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          )}

          {tab === 'Notifications' && (
            <div style={{ maxWidth: 480 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>Notification Preferences</p>
              {[
                { key: 'emailDigest', label: 'Weekly email digest', desc: 'Get a summary of your client health every Monday' },
                { key: 'inAppAlerts', label: 'In-app smart alerts', desc: 'Show alerts in the dashboard' },
                { key: 'highOnly', label: 'High severity only', desc: 'Only notify for critical client issues' },
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: '1px solid #f1f5f9',
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                  </div>
                  <div
                    onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                    style={{
                      width: 40, height: 22, borderRadius: 999, cursor: 'pointer',
                      background: notifications[item.key] ? '#3b82f6' : '#e2e8f0',
                      position: 'relative', transition: 'background 200ms', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute', width: 18, height: 18,
                      borderRadius: '50%', background: '#fff',
                      top: 2, left: notifications[item.key] ? 20 : 2,
                      transition: 'left 200ms',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <Button variant="primary" onClick={() => toast.success('Preferences saved!')}>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'Account' && (
            <div style={{ maxWidth: 480 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Account</p>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 2px' }}>Current Plan</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Free Plan</p>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 12 }}>Danger Zone</p>
                <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
