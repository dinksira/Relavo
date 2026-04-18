import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlerts from '../../hooks/useAlerts';
import useToast from '../../hooks/useToast';
import { supabase } from '../../services/supabase';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/alerts': 'Alerts',
  '/invoices': 'Invoices',
  '/settings': 'Settings',
};

const TopBar = ({ isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { unreadCount } = useAlerts();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const pageName = pageNames[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <button 
          onClick={() => navigate('/alerts')}
          className="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors border-none bg-transparent"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* Small Avatar */}
        <button 
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center border-none"
        >
          {initials}
        </button>
      </div>
    );
  }

  return (
    <header className="h-[70px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-[10] shadow-sm shadow-slate-200/50">
      {/* Left Side — Breadcrumb */}
      <div className="flex items-center gap-2 group cursor-default">
        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
           <LayoutDashboard size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="flex items-baseline gap-1.5 ml-1">
          <span className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">relavo</span>
          <span className="text-slate-200">/</span>
          <span className="text-[14px] font-bold text-slate-900">{pageName}</span>
        </div>
      </div>

      {/* Right Side — Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-[280px] h-[40px] bg-slate-50 border border-slate-200 rounded-xl pl-[38px] pr-4 text-[13px] text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-[4px] focus:ring-blue-500/10 outline-none transition-all duration-200"
            onClick={() => toast.info('Global search is in development.')}
            readOnly
          />
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => navigate('/alerts')}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-all duration-200 relative group"
          >
            <Bell size={18} className="group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-[10px] right-[11px] w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-3 p-1 pr-3 rounded-xl transition-all duration-200 border ${userMenuOpen ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white text-[12px] font-bold flex items-center justify-center shadow-lg shadow-blue-200">
              {initials}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-[13px] font-bold text-slate-900 m-0 leading-none">{name.split(' ')[0]}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-[19]" 
                onClick={() => setUserMenuOpen(false)} 
              />
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[240px] bg-white border border-slate-200 rounded-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-2 z-[20] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-[14px] font-bold text-slate-900 m-0 truncate">{name}</p>
                  <p className="text-[11px] text-slate-400 m-0 truncate font-medium">{email}</p>
                </div>
                
                <div className="p-1 gap-1 flex flex-col">
                  <button 
                    onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all duration-150 group border-none bg-transparent cursor-pointer"
                  >
                    <Settings size={16} className="text-slate-400 group-hover:text-blue-500" /> Account Settings
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-rose-500 font-semibold rounded-xl hover:bg-rose-50 transition-all duration-150 border-none bg-transparent cursor-pointer"
                  >
                    <LogOut size={16} /> Sign out
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
