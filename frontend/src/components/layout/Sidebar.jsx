import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bell, FileText, Settings, LogOut
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlerts from '../../hooks/useAlerts';
import { supabase } from '../../services/supabase';
import logoPath from '../../assets/relavo-logo.svg';

const NavItem = ({ icon: Icon, label, path, badge }) => (
  <NavLink
    to={path}
    className={({ isActive }) => `
      flex items-center gap-[10px] px-3 py-[9px] rounded-lg mb-0.5 cursor-pointer transition-all duration-150 ease-in-out group
      ${isActive 
        ? 'bg-[rgba(59,130,246,0.2)] text-white font-semibold shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]' 
        : 'bg-transparent text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.8)]'
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
  <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgba(255,255,255,0.3)] px-2 py-2 mb-1 ${className}`}>
    {text}
  </p>
);

const Sidebar = () => {
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
    <div className="w-[240px] h-screen bg-[#0f172a] flex flex-col fixed left-0 shrink-0 z-[40]">
      {/* Logo Area */}
      <div className="p-6 pb-5 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-[10px]">
        <img 
          src={logoPath} 
          alt="relavo" 
          className="h-8 brightness-0 invert" 
        />
        <span className="text-white text-[18px] font-bold tracking-[-0.3px]">relavo</span>
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
