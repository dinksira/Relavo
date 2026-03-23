import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Trash2, Camera } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import useToast from '../hooks/useToast';
import { supabase } from '../services/supabase';

const SettingsPage = () => {
  const toast = useToast();
  const { user } = useAuthStore();
  const [tab, setTab] = useState('Profile');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    emailDigest: true, inAppAlerts: true, highOnly: false
  });

  const name = fullName || user?.email?.split('@')[0] || 'User';
  const firstChar = name?.charAt(0).toUpperCase() || '?';

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = () => {
    toast.warning('Contact support to delete your account.');
  };

  const tabs = [
    { key: 'Profile', icon: User, label: 'Profile' },
    { key: 'Notifications', icon: Bell, label: 'Notifications' },
    { key: 'Security', icon: Shield, label: 'Security' },
    { key: 'Billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-7">
        <h1 className="text-[26px] font-bold text-[#0f172a] m-0">Settings</h1>
        <p className="text-[14px] text-[#64748b] mt-1 m-0">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-1.5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-medium transition-all duration-150 border-none cursor-pointer text-left ${
                tab === t.key 
                  ? 'bg-white text-[#3b82f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]' 
                  : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              <t.icon size={18} className={tab === t.key ? 'text-[#3b82f6]' : 'text-[#94a3b8]'} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          {tab === 'Profile' && (
            <div className="p-8 max-w-[600px]">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center text-white text-[28px] font-bold shadow-lg">
                    {firstChar}
                  </div>
                  <button className="absolute inset-0 bg-black/40 rounded-[20px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-none cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a] m-0">{name}</h3>
                  <p className="text-[14px] text-[#94a3b8] m-0">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Full Name</label>
                  <input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    className="w-full h-[42px] bg-white border border-[#e2e8f0] rounded-[10px] px-4 text-[14px] text-[#0f172a] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Email Address (Read Only)</label>
                  <input 
                    value={user?.email || ''} 
                    readOnly 
                    className="w-full h-[42px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] px-4 text-[14px] text-[#94a3b8] cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Bio</label>
                  <textarea 
                    placeholder="Tell us a bit about your role..."
                    className="w-full h-[100px] bg-white border border-[#e2e8f0] rounded-[10px] p-4 text-[14px] text-[#0f172a] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] outline-none transition-all resize-none"
                  />
                </div>
                <Button variant="primary" loading={saving} onClick={handleSaveProfile} className="!px-8">
                  Update Profile
                </Button>
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div className="p-8 max-w-[600px]">
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-6">Email & Push Notifications</h3>
              <div className="space-y-1">
                {[
                  { key: 'emailDigest', label: 'Weekly email digest', desc: 'Get a summary of your client health every Monday morning' },
                  { key: 'inAppAlerts', label: 'In-app smart alerts', desc: 'Show alerts in the dashboard as they happen' },
                  { key: 'highOnly', label: 'Critical priority only', desc: 'Only notify for clients with health score below 40' },
                ].map((item, idx) => (
                  <div key={item.key} className={`flex items-center justify-between py-5 ${idx !== 2 ? 'border-b border-[#f1f5f9]' : ''}`}>
                    <div className="max-w-[80%]">
                      <p className="text-[14px] font-bold text-[#0f172a] m-0">{item.label}</p>
                      <p className="text-[13px] text-[#94a3b8] mt-1 m-0">{item.desc}</p>
                    </div>
                    <div
                      onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className={`w-[44px] h-[24px] rounded-full cursor-pointer relative transition-colors duration-200 shrink-0 ${
                        notifications[item.key] ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
                      }`}
                    >
                      <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-all duration-200 ${
                        notifications[item.key] ? 'left-[23px]' : 'left-[3px]'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#f1f5f9]">
                <Button variant="primary" onClick={() => toast.success('Settings updated!')}>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div className="p-8 max-w-[600px]">
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Current Password</label>
                  <input type="password" underline className="w-full h-[42px] bg-white border border-[#e2e8f0] rounded-[10px] px-4 text-[14px] focus:border-[#3b82f6] outline-none" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">New Password</label>
                  <input type="password" underline className="w-full h-[42px] bg-white border border-[#e2e8f0] rounded-[10px] px-4 text-[14px] focus:border-[#3b82f6] outline-none" />
                </div>
                <Button variant="primary" className="!px-8">Update Password</Button>
                
                <div className="mt-10 pt-10 border-t border-[#f1f5f9]">
                  <h4 className="text-[15px] font-bold text-[#dc2626] mb-3 flex items-center gap-2">
                    <Trash2 size={16} />
                    Danger Zone
                  </h4>
                  <p className="text-[13px] text-[#64748b] mb-4">Deleting your account is permanent and will erase all client data and history.</p>
                  <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
              </div>
            </div>
          )}

          {(tab === 'Billing' || tab === 'Account') && (
            <div className="p-8 max-w-[600px]">
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-6">Billing & Subscription</h3>
              <div className="bg-[#f8fafc] border border-[#eff6ff] rounded-[12px] p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[12px] font-bold text-[#3b82f6] uppercase tracking-widest m-0">Current Plan</p>
                    <p className="text-[24px] font-bold text-[#0f172a] mt-1 m-0">Relavo Pro</p>
                  </div>
                  <span className="bg-[#3b82f6] text-white text-[11px] font-bold px-2 py-1 rounded-full uppercase">Active</span>
                </div>
                <p className="text-[14px] text-[#64748b] mt-4 mb-0">Your next bill is for $49.00 on April 20, 2024.</p>
              </div>
              <div className="space-y-3">
                <Button variant="outline" fullWidth>Manage Payment Method</Button>
                <Button variant="ghost" fullWidth>View Transaction History</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
