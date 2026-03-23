import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
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

const TopBar = () => {
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

  return (
    <header className="h-[60px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 sticky top-0 z-[10] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Left Side — Breadcrumb */}
      <div className="flex items-center gap-1.5 cursor-default">
        <span className="text-[13px] text-[#94a3b8]">relavo</span>
        <span className="text-[13px] text-[#cbd5e1]">/</span>
        <span className="text-[13px] font-semibold text-[#0f172a]">{pageName}</span>
      </div>

      {/* Right Side — Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative group">
          <Search size={14} className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors group-focus-within:text-[#3b82f6]" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-[220px] h-[34px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-[34px] pr-3 text-[13px] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:bg-white focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] outline-none transition-all duration-150"
            onClick={() => toast.info('Search coming soon!')}
            readOnly
          />
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => navigate('/alerts')}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors duration-150 relative"
          >
            <Bell size={16} className="text-[#64748b]" />
            {unreadCount > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] bg-[#dc2626] rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-1.5 p-[4px_8px_4px_4px] rounded-lg border transition-all duration-150 ${userMenuOpen ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-transparent border-transparent hover:bg-[#f8fafc]'}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-[12px] font-bold flex items-center justify-center">
              {initials}
            </div>
            <ChevronDown size={12} className="text-[#94a3b8]" />
          </button>

          {userMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-[19]" 
                onClick={() => setUserMenuOpen(false)} 
              />
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-white border border-[#e2e8f0] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-2 z-[20]">
                <div className="px-3 py-2 border-b border-[#f1f5f9] mb-1">
                  <p className="text-[13px] font-semibold text-[#0f172a] m-0 truncate">{name}</p>
                  <p className="text-[11px] text-[#94a3b8] m-0 truncate">{email}</p>
                </div>
                
                <button 
                  onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[#64748b] rounded-md hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all duration-150 group"
                >
                  <Settings size={14} className="group-hover:text-[#3b82f6]" /> Settings
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[#dc2626] rounded-md hover:bg-red-50 transition-all duration-150"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
