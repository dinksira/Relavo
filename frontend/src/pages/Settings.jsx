import React from 'react';
import Layout from '../components/Layout';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Smartphone, 
  Globe, 
  CreditCard,
  Cloud,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Settings = () => {
  const sections = [
    { 
      title: 'General', 
      items: [
        { label: 'Profile Information', sub: 'Update your personal details and branding', icon: User },
        { label: 'Password & Security', sub: 'Manage your credentials and 2FA', icon: Lock },
      ]
    },
    { 
      title: 'Agency Identity', 
      items: [
        { label: 'Brand Customization', sub: 'Logo, primary colors, and email signatures', icon: Zap },
        { label: 'Client Discovery', sub: 'Configure how new clients are imported', icon: Globe },
      ]
    },
    { 
      title: 'Alerting & Notifications', 
      items: [
        { label: 'Intelligence Thresholds', sub: 'Set criteria for "At Risk" alerts', icon: Bell },
        { label: 'Slack & Email Sync', sub: 'Direct notifications for your team', icon: Cloud },
      ]
    },
    { 
      title: 'Billing & Subscription', 
      items: [
        { label: 'Current Plan', sub: 'Relavo Pro — 24/25 active clients used', icon: CreditCard },
      ]
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-navy tracking-tight">Settings</h1>
            <p className="text-text-2 font-medium">Configure your agency's <span className="text-navy font-bold">Relavo engine.</span></p>
          </div>
          <button className="btn-primary py-2.5 px-8 text-sm">
             Save All Changes
          </button>
        </header>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Navigation Sidebar (Local) */}
           <div className="col-span-1 space-y-2">
              <button className="w-full text-left px-6 py-4 rounded-2xl bg-navy text-white font-bold text-sm shadow-xl shadow-navy/20 transition-all">
                 System Account
              </button>
              <button className="w-full text-left px-6 py-4 rounded-2xl text-text-2 hover:bg-slate-50 font-bold text-sm transition-all focus:outline-none">
                 AI Configuration
              </button>
              <button className="w-full text-left px-6 py-4 rounded-2xl text-text-2 hover:bg-slate-50 font-bold text-sm transition-all focus:outline-none">
                 Team Management
              </button>
              <button className="w-full text-left px-6 py-4 rounded-2xl text-text-2 hover:bg-slate-50 font-bold text-sm transition-all focus:outline-none">
                 Integrations
              </button>
           </div>

           {/* Settings Content */}
           <div className="col-span-3 space-y-12 pb-20">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-6">
                   <h3 className="text-xs font-black text-text-3 uppercase tracking-[0.2em] px-2">{section.title}</h3>
                   <div className="card-premium divide-y divide-border-dark overflow-hidden">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-8 hover:bg-slate-50/50 transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-text-3 group-hover:text-blue group-hover:border-blue/30 shadow-sm transition-all">
                              <item.icon size={22} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-[17px] font-bold text-navy group-hover:text-blue transition-colors truncate">{item.label}</h4>
                              <p className="text-sm text-text-2 font-medium tracking-tight truncate">{item.sub}</p>
                           </div>
                           <ChevronRight size={20} className="text-slate-300 group-hover:text-blue transition-all" />
                        </div>
                      ))}
                   </div>
                </div>
              ))}

              {/* Danger Zone */}
              <div className="space-y-6 pt-10 border-t border-slate-100">
                 <h3 className="text-xs font-black text-relavo-danger uppercase tracking-[0.2em] px-2">Danger Zone</h3>
                 <div className="card-premium border-relavo-danger/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-red-50/20">
                    <div>
                       <h4 className="text-lg font-bold text-navy">Archive Account Data</h4>
                       <p className="text-sm text-text-2 font-medium">Permanently disconnect and purge all historical client activity syncs.</p>
                    </div>
                    <button className="btn-primary bg-relavo-danger text-sm hover:shadow-relavo-danger/40 scale-100 hover:scale-105">
                       Purge All Data
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
