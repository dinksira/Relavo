import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bell, FileText, Settings, LogOut, X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlerts from '../../hooks/useAlerts';
import { supabase } from '../../services/supabase';

const NavItem = ({ icon: Icon, label, path, badge }) => (
  <NavLink
    to={path}
    className={({ isActive }) => `
      flex items-center gap-[12px] px-3.5 py-[10px] rounded-xl mb-1 cursor-pointer transition-all duration-200 ease-in-out group
      ${isActive 
        ? 'bg-[rgba(255,255,255,0.08)] text-white font-semibold nav-active-glow shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
        : 'bg-transparent text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
      }
    `}
  >
    {({ isActive }) => (
      <>
        <Icon 
          size={16} 
          className={isActive ? 'text-[#3b82f6]' : 'text-[rgba(255,255,255,0.4)] group-hover:text-[rgba(255,255,255,0.7)]'} 
        />
        <span className="text-[14px]">{label}</span>
        {badge > 0 && (
          <span className="ml-auto bg-[#3b82f6] text-white text-[11px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ text, className = "" }) => (
  <p className={`text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.25)] px-3 py-2 mb-1 ${className}`}>
    {text}
  </p>
);

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { unreadCount } = useAlerts();

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <div className="w-[280px] lg:w-[260px] h-screen sidebar-gradient border-r border-[rgba(255,255,255,0.03)] flex flex-col fixed lg:static left-0 shrink-0 z-[40]">
      <div className="p-7 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <img 
              src="/favicon.svg" 
              alt="relavo" 
              className="h-6 w-6" 
            />
          </div>
          <span className="text-white text-[20px] font-bold tracking-tight">relavo</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 -mr-2 text-white/40 hover:text-white transition-colors border-none bg-transparent"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[12px] overflow-y-auto">
        <SectionLabel text="Main Menu" className="pt-4" />
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Users} label="Clients" path="/clients" />
        <NavItem icon={Bell} label="Alerts" path="/alerts" badge={unreadCount} />
        <NavItem icon={FileText} label="Invoices" path="/invoices" />
        
        <SectionLabel text="Account" className="mt-2 pt-2" />
        <NavItem icon={Settings} label="Settings" path="/settings" />
      </nav>

      {/* Bottom User Section */}
      <div className="p-4 px-3 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-[10px]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white truncate m-0">{name}</p>
          <p className="text-[11px] text-[#94a3b8] truncate m-0">{email}</p>
        </div>
        <LogOut 
          size={16} 
          className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] cursor-pointer ml-auto transition-colors duration-150"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
