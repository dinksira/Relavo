import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import Avatar from '../ui/Avatar';
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
  const pageName = pageNames[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 60, background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 32px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>relavo</span>
        <span style={{ fontSize: 13, color: '#e2e8f0' }}>/</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#0f172a' }}>{pageName}</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search */}
        <button
          onClick={() => toast.info('Search coming soon!')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 8, padding: '0 12px',
            height: 36, width: 200, cursor: 'pointer',
            color: '#94a3b8', fontSize: 13,
            fontFamily: 'inherit',
          }}
        >
          <Search size={14} />
          <span>Search...</span>
        </button>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => navigate('/alerts')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', padding: 8, borderRadius: 8,
              display: 'flex', alignItems: 'center',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Bell size={18} />
          </button>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#dc2626',
            }} />
          )}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 8px', borderRadius: 8,
              transition: 'background 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Avatar name={name} size="sm" />
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          {userMenuOpen && (
            <>
              <div onClick={() => setUserMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                minWidth: 200, zIndex: 20, padding: 8,
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: '#64748b', borderRadius: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <Settings size={14} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: '#dc2626', borderRadius: 6,
                    fontFamily: 'inherit',
                  }}
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
