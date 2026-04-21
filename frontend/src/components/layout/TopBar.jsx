import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, LogOut, ChevronDown, LayoutDashboard, Command } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCommandStore from '../../store/useCommandStore';
import useAlerts from '../../hooks/useAlerts';
import useToast from '../../hooks/useToast';
import { supabase } from '../../services/supabase';

const pageNames = {
  '/dashboard': 'Intelligence Overview',
  '/clients': 'Clients',
  '/alerts': 'Real-time Stream',
  '/invoices': 'Asset Billing',
  '/settings': 'System Control',
};

const TopBar = ({ isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const setCommandOpen = useCommandStore(s => s.setOpen);
  const { unreadCount } = useAlerts();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Executive';
  const email = user?.email || '';
  const firstChar = name?.charAt(0).toUpperCase() || '?';
  const pageName = pageNames[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/alerts')}
          className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors border-none bg-transparent"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-[8px] right-[8px] w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>

        <button 
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-10 h-10 rounded-2xl bg-blue-600 text-white text-[12px] font-black flex items-center justify-center border-none shadow-lg shadow-blue-500/20"
        >
          {firstChar}
        </button>
      </div>
    );
  }

  return (
    <header className="h-[80px] bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-[10]">
      {/* Left Side — Executive Breadcrumb */}
      <div className="flex items-center gap-3 group cursor-default">
        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all duration-300">
           <Command size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 translate-y-0.5">
              <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Enterprise</span>
              <span className="text-slate-200 text-[10px]">/</span>
              <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">Intelligence</span>
           </div>
           <h2 className="text-[18px] font-black text-slate-900 m-0 tracking-tight italic">{pageName}</h2>
        </div>
      </div>

      {/* Right Side — Executive Actions */}
      <div className="flex items-center gap-8">
        {/* Intelligence Search */}
        <div className="relative group hidden lg:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Query intelligence..." 
            className="w-[320px] h-[48px] bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[13px] text-slate-900 placeholder-slate-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-300 font-medium cursor-pointer"
            onClick={() => setCommandOpen(true)}
            readOnly
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
             <kbd className="h-5 px-1.5 rounded-md bg-white border border-slate-200 text-[10px] font-black text-slate-400 flex items-center justify-center">⌘</kbd>
             <kbd className="h-5 px-1.5 rounded-md bg-white border border-slate-200 text-[10px] font-black text-slate-400 flex items-center justify-center">K</kbd>
          </div>
        </div>

        {/* System Alerts */}
        <div className="relative">
          <button 
            onClick={() => navigate('/alerts')}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:bg-white transition-all duration-300 relative group"
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-[12px] right-[12px] w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-lg" />
            )}
          </button>
        </div>

        {/* Executive Profile */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-4 p-1.5 pr-4 rounded-[20px] transition-all duration-300 border ${userMenuOpen ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white text-[13px] font-black flex items-center justify-center shadow-xl shadow-blue-500/20">
              {firstChar}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-[13px] font-black text-slate-900 m-0 leading-none tracking-tight">{name.split(' ')[0]}</p>
              <p className="text-[9px] font-black text-slate-400 m-0 uppercase tracking-widest mt-1">Tier 1 Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-[19]" 
                onClick={() => setUserMenuOpen(false)} 
              />
              <div className="absolute top-[calc(100%+12px)] right-0 min-w-[260px] bg-white border border-slate-100 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-2 z-[20] animate-in fade-in zoom-in-95 duration-300">
                <div className="px-5 py-4 border-b border-slate-50 mb-1">
                  <p className="text-[15px] font-black text-slate-900 m-0 truncate tracking-tight">{name}</p>
                  <p className="text-[11px] text-slate-400 m-0 truncate font-medium">{email}</p>
                </div>
                
                <div className="p-1 space-y-1">
                  <button 
                    onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-[12px] text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all group border-none bg-transparent cursor-pointer"
                  >
                    <Settings size={16} className="text-slate-400 group-hover:text-blue-600" /> Account Node
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-[12px] text-rose-500 font-black uppercase tracking-widest rounded-2xl hover:bg-rose-50 transition-all border-none bg-transparent cursor-pointer"
                  >
                    <LogOut size={16} /> De-authenticate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
