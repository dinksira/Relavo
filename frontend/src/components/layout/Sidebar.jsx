import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bell, FileText, Settings, LogOut, X, Shield, Activity, Users2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlerts from '../../hooks/useAlerts';
import { supabase } from '../../services/supabase';

const NavItem = ({ icon: Icon, label, path, badge, state, isCollapsed }) => (
  <NavLink
    to={path}
    state={state}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 cursor-pointer transition-all duration-300 group relative
      ${isActive 
        ? 'bg-blue-600/10 text-white font-bold nav-active-glow' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
      }
      ${isCollapsed ? 'justify-center px-0' : ''}
    `}
    title={isCollapsed ? label : ''}
  >
    {({ isActive }) => (
      <>
        <Icon 
          size={18} 
          className={`${isActive ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-300 transition-colors'} shrink-0`} 
        />
        {!isCollapsed && (
          <>
            <span className="text-[13px] uppercase tracking-widest font-black">{label}</span>
            {badge > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                {badge}
              </span>
            )}
          </>
        )}
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ text, isCollapsed }) => {
  if (isCollapsed) return <div className="h-px bg-white/5 my-4 mx-4" />;
  return (
    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 px-4 py-3 mb-1">
      {text}
    </p>
  );
};

const Sidebar = ({ onClose, isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { unreadCount } = useAlerts();

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';
  const firstChar = name?.charAt(0).toUpperCase() || '?';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-screen bg-[#020617] border-r border-white/5 flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-full'}`}>
       {/* Sidebar background pattern */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
      
      <div className={`p-6 pb-10 flex items-center justify-between relative z-10 ${isCollapsed ? 'flex-col gap-6' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img 
              src="/favicon.svg" 
              alt="relavo" 
              className="h-7 w-7" 
            />
          </div>
          {!isCollapsed && (
            <span className="text-white text-[22px] font-black tracking-tighter italic">relavo.</span>
          )}
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-white/40 hover:text-white transition-colors border-none bg-transparent"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto relative z-10 no-scrollbar">
        <SectionLabel text="Intelligence" isCollapsed={isCollapsed} />
        <NavItem icon={LayoutDashboard} label="Overview" path="/dashboard" isCollapsed={isCollapsed} />
        <NavItem icon={Users} label="Clients" path="/clients" isCollapsed={isCollapsed} />
        <NavItem icon={Bell} label="Stream" path="/alerts" badge={unreadCount} isCollapsed={isCollapsed} />
        
        <SectionLabel text="Enterprise" isCollapsed={isCollapsed} className="mt-6" />
        <NavItem icon={Users2} label="Team" path="/settings" state={{ tab: 'Team' }} isCollapsed={isCollapsed} />
        <NavItem icon={FileText} label="Billing" path="/invoices" isCollapsed={isCollapsed} />
        <NavItem icon={Settings} label="System" path="/settings" isCollapsed={isCollapsed} />
        
        {/* Support Card in Sidebar - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="mt-10 p-5 bg-white/5 border border-white/5 rounded-3xl space-y-3">
             <div className="flex items-center gap-2">
                <Shield size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Premium Node</span>
             </div>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">System status optimal. Intelligence engine fully active.</p>
          </div>
        )}
      </nav>

      {/* Bottom User Section */}
      <div className={`p-6 border-t border-white/5 relative z-10 group ${isCollapsed ? 'px-4' : ''}`}>
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 text-white text-[14px] font-black flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
              {firstChar}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-white truncate m-0 tracking-tight">{name}</p>
                  <p className="text-[10px] font-black text-slate-600 truncate m-0 uppercase tracking-widest">Executive Account</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer"
                >
                   <LogOut size={16} />
                </button>
              </>
            )}
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
