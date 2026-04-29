import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Bell, Shield, CreditCard, Trash2, Camera, Zap, Check, Save, Users2, Info } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import TeamSettingsPanel from '../components/team/TeamSettingsPanel';
import useAuthStore from '../store/authStore';
import useToast from '../hooks/useToast';
import { supabase } from '../services/supabase';

const SettingsPage = () => {
  const toast = useToast();
  const location = useLocation();
  const { user } = useAuthStore();
  const [tab, setTab] = useState(location.state?.tab || 'Profile');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [bio, setBio] = useState(user?.user_metadata?.bio || '');
  const [saving, setSaving] = useState(false);
  
  const [notifications, setNotifications] = useState(user?.user_metadata?.notifications || {
    emailDigest: true, inAppAlerts: true, highOnly: false
  });

  const [thresholds, setThresholds] = useState(user?.user_metadata?.thresholds || {
    atRisk: 40, needsAttention: 70
  });

  // Load profile data from database on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        if (data.full_name) setFullName(data.full_name);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.bio) setBio(data.bio);
      }
    };
    fetchProfile();
  }, [user]);

  const name = fullName || user?.email?.split('@')[0] || 'User';
  const firstChar = name?.charAt(0).toUpperCase() || '?';

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({ 
        data: { 
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio,
          notifications: notifications,
          thresholds: thresholds
        } 
      });
      if (authError) throw authError;

      // 2. Update Profiles Table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio,
          updated_at: new Date().toISOString()
        });
      if (profileError) throw profileError;

      toast.success('Settings updated successfully!');
    } catch (err) { 
      toast.error('Failed to save settings: ' + err.message); 
    } finally { 
      setSaving(false); 
    }
  };

  const handlePhotoUpload = () => {
    document.getElementById('avatar-upload').click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for demo/base64 safety)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setSaving(true);
    try {
      // 1. Try to upload to Supabase Storage if bucket 'avatars' exists
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      let publicUrl = '';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      } else {
        // Fallback to Base64 if storage fails (e.g. bucket doesn't exist)
        console.warn('Storage upload failed, falling back to Base64:', uploadError.message);
        publicUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      setAvatarUrl(publicUrl);
      toast.success('Image selected! Click "Save Changes" to persist.');
    } catch (err) {
      toast.error('Failed to process image: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { key: 'Profile', icon: User, label: 'Profile' },
    { key: 'Team', icon: Users2, label: 'Team' },
    { key: 'Notifications', icon: Bell, label: 'Notifications' },
    { key: 'Analysis', icon: Zap, label: 'Alert Thresholds' },
    { key: 'Security', icon: Shield, label: 'Security' },
    { key: 'Billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 m-0 tracking-tight">Settings</h1>
          <p className="text-[14px] text-slate-500 mt-1 m-0">Customize your Relavo experience and account preferences</p>
        </div>
        <Button 
          variant="primary" 
          loading={saving} 
          onClick={handleSaveAll} 
          icon={Save}
          className="!px-6 !h-11"
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-10 items-start">
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-1 sticky top-8">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200 border-none cursor-pointer text-left ${
                tab === t.key 
                  ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] translate-x-1' 
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <t.icon size={18} className={tab === t.key ? 'text-blue-500' : 'text-slate-400'} />
              {t.label}
              {tab === t.key && <Check size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-10">
            {tab === 'Profile' && (
              <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <input 
                  type="file" 
                  id="avatar-upload" 
                  hidden 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <div className="flex items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[32px] font-bold shadow-xl shadow-blue-200 overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        firstChar
                      )}
                    </div>
                    <button 
                      onClick={handlePhotoUpload}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors border-none cursor-pointer"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-slate-900 m-0">{name}</h3>
                    <p className="text-[14px] text-slate-500 m-0 font-medium">{user?.email}</p>
                    <div className="mt-3 flex gap-2">
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full border border-blue-100">Account Owner</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8">
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">Display Name</label>
                    <input 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      placeholder="e.g. Alex Rivera"
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">Avatar URL</label>
                    <input 
                      value={avatarUrl} 
                      onChange={e => setAvatarUrl(e.target.value)} 
                      placeholder="https://example.com/photo.jpg"
                      className="input-base"
                    />
                    <p className="text-[12px] text-slate-400 mt-2 px-1">Direct link to an image file.</p>
                  </div>
                  
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">Email Address</label>
                    <input 
                      value={user?.email || ''} 
                      readOnly 
                      className="input-base !bg-slate-50 !text-slate-400 !cursor-not-allowed border-dashed"
                    />
                    <p className="text-[12px] text-slate-400 mt-2 px-1">Email changes require re-verification.</p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">Personal Bio</label>
                    <textarea 
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell us a bit about your role..."
                      className="input-base min-h-[120px] py-3 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {tab === 'Team' && (
              <TeamSettingsPanel />
            )}

            {tab === 'Notifications' && (
              <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8">
                  <h3 className="text-[20px] font-bold text-slate-900 m-0">Global Notifications</h3>
                  <p className="text-slate-500 text-[14px] mt-1">Configure how you want to be alerted about client health changes</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    { key: 'emailDigest', label: 'Weekly Performance Digest', desc: 'A comprehensive summary of all at-risk clients delivered every Monday morning' },
                    { key: 'inAppAlerts', label: 'Real-time Smart Alerts', desc: 'Instant notifications within the dashboard when a client health score drops' },
                    { key: 'highOnly', label: 'Critical Severity Only', desc: 'Filter noisier alerts and only notify for clients with health scores below 40' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-6 group">
                      <div className="max-w-[80%] pr-4">
                        <p className="text-[15px] font-bold text-slate-800 m-0 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[13px] text-slate-500 mt-1 m-0 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                      <div
                        onClick={() => handleToggle(item.key)}
                        className={`w-[52px] h-[28px] rounded-full cursor-pointer relative transition-all duration-300 shadow-inner group-active:scale-95 ${
                          notifications[item.key] ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-200 shadow-slate-300'
                        }`}
                      >
                        <div className={`absolute top-[4px] w-[20px] h-[20px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                          notifications[item.key] ? 'left-[28px]' : 'left-[4px]'
                        }`}>
                           {notifications[item.key] && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Analysis' && (
              <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-10">
                  <h3 className="text-[20px] font-bold text-slate-900 m-0">Alert Thresholds</h3>
                  <p className="text-slate-500 text-[14px] mt-1">Define the health score boundaries that trigger status changes</p>
                </div>

                <div className="space-y-10">
                  <div>
                    <div className="flex justify-between mb-4 px-1">
                      <label className="text-[13px] font-bold text-slate-700">At Risk Threshold</label>
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[13px] border border-rose-100">&lt; {thresholds.atRisk}</span>
                    </div>
                    <input 
                      type="range" min="10" max="60" step="5"
                      value={thresholds.atRisk}
                      onChange={e => setThresholds(p => ({ ...p, atRisk: parseInt(e.target.value) }))}
                      className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      <span>Strict (10)</span>
                      <span>Relaxed (60)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-4 px-1">
                      <label className="text-[13px] font-bold text-slate-700">Needs Attention Threshold</label>
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-[13px] border border-amber-100">&lt; {thresholds.needsAttention}</span>
                    </div>
                    <input 
                      type="range" min="61" max="90" step="5"
                      value={thresholds.needsAttention}
                      onChange={e => setThresholds(p => ({ ...p, needsAttention: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      <span>Lower (61)</span>
                      <span>Higher (90)</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                    <Info size={20} className="text-blue-500 shrink-0" />
                    <p className="text-[13px] text-blue-700 m-0 leading-relaxed font-medium">
                      These thresholds control the status labels and colors seen throughout the dashboard. Lowering them will result in fewer "At Risk" alerts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'Security' && (
              <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-[20px] font-bold text-slate-900 mb-8">Security & Privacy</h3>
                <div className="space-y-8">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="input-base" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5 block px-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="input-base" />
                  </div>
                  <Button variant="outline" className="!px-8 border-slate-200">Update Password</Button>
                  
                  <div className="mt-16 pt-10 border-t border-slate-100">
                    <h4 className="text-[16px] font-bold text-rose-600 mb-2 flex items-center gap-2">
                       Permanent Account Deletion
                    </h4>
                    <p className="text-[13px] text-slate-500 mb-6 font-medium leading-relaxed">
                      This action will immediately destroy all your project data, client history, and AI insights. This cannot be undone.
                    </p>
                    <Button variant="danger" className="!bg-rose-50 !text-rose-600 !border-rose-100 hover:!bg-rose-600 hover:!text-white shadow-none">Delete Account Permanently</Button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'Billing' && (
              <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-[20px] font-bold text-slate-900 mb-8">Billing & Subscription</h3>
                <div className="bg-slate-900 rounded-[28px] p-10 mb-8 text-white relative overflow-hidden shadow-2xl">
                  {/* Mesh Gradient Overlay */}
                  <div className="absolute inset-0 opacity-20 mesh-gradient-blue pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[12px] font-bold text-blue-400 uppercase tracking-widest m-0 mb-1">Current Plan</p>
                        <p className="text-[32px] font-bold m-0 tracking-tight">Standard Pro</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                         <span className="text-[12px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                    <div className="mt-12 flex items-baseline gap-1">
                       <span className="text-[28px] font-bold">$49</span>
                       <span className="text-white/60 text-[14px]">/ month</span>
                    </div>
                    <p className="text-white/50 text-[14px] mt-2 mb-0 font-medium">Auto-renewing on May 12, 2026</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 border-slate-200">Manage Cards</Button>
                  <Button variant="outline" className="h-12 border-slate-200">View Invoices</Button>
                  <Button variant="outline" className="h-12 col-span-2 border-slate-200">Switch to Annual Billing (Save 20%)</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
