import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bell, FileText, Settings, LogOut
} from 'lucide-react';
import Logo from '../Logo';
import Avatar from '../ui/Avatar';
import useAuthStore from '../../store/authStore';
import useAlerts from '../../hooks/useAlerts';
import { supabase } from '../../services/supabase';

const navMain = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users,           label: 'Clients',   path: '/clients' },
  { icon: Bell,            label: 'Alerts',    path: '/alerts' },
  { icon: FileText,        label: 'Invoices',  path: '/invoices' },
];

const navAccount = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const NavItem = ({ icon: Icon, label, path, badge }) => (
  <NavLink
    to={path}
    style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      padding: isActive ? '9px 9px 9px 9px' : '9px 12px',
      borderRadius: '0 8px 8px 0',
      marginRight: 8,
      fontSize: 14, fontWeight: 500,
      textDecoration: 'none',
      color: isActive ? '#3b82f6' : '#64748b',
      background: isActive ? '#eff6ff' : 'transparent',
      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
      transition: 'all 100ms',
    })}
  >
    <Icon size={18} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && (
      <span style={{
        background: '#3b82f6', color: '#fff',
        fontSize: 11, fontWeight: 600,
        minWidth: 18, height: 18, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
      }}>
        {badge}
      </span>
    )}
  </NavLink>
);

const SectionLabel = ({ text }) => (
  <p style={{
    fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#94a3b8',
    padding: '8px 12px', margin: '0 0 4px',
  }}>{text}</p>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { unreadCount } = useAlerts();

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: 240, height: '100vh',
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo style={{ height: 28 }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1b2a3b' }}>relavo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        <SectionLabel text="Main Menu" />
        {navMain.map(item => (
          <NavItem key={item.path} {...item} badge={item.label === 'Alerts' ? unreadCount : 0} />
        ))}
        <div style={{ margin: '12px 12px', borderTop: '1px solid #e2e8f0' }} />
        <SectionLabel text="Account" />
        {navAccount.map(item => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        padding: 16, borderTop: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Avatar name={name} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 500, color: '#0f172a',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0,
          }}>{name}</p>
          <p style={{
            fontSize: 11, color: '#94a3b8', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{email}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', padding: 6, borderRadius: 6,
            display: 'flex', alignItems: 'center',
            transition: 'color 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
