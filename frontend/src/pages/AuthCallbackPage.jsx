import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import { teamAPI } from '../services/api';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [status, setStatus] = useState('Signing you in...');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const tryGetSession = async () => {
      attempts++;
      setStatus(`Signing you in... (${attempts})`);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session) {
          // Upsert profile row for OAuth users (first-time Google login)
          try {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              avatar_url: session.user.user_metadata?.avatar_url || ''
            }, { onConflict: 'id' });
          } catch (profileErr) {
            // Non-fatal — continue even if upsert fails
            console.warn('Profile upsert failed:', profileErr);
          }

          // Store auth in zustand + localStorage so the backend API calls work
          setAuth(session.user, session.access_token);

          // Check if user already has an agency via the BACKEND API (bypasses RLS)
          try {
            const { data: teamRes } = await teamAPI.getTeam();
            const teamData = teamRes?.data;

            if (!teamData) {
              // New OAuth user — auto-create a default agency workspace via backend
              const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email;
              const agencyName = `${userName}'s Agency`;
              await teamAPI.createTeam(agencyName);
              console.log('[Auth] Auto-created agency for new OAuth user:', agencyName);
            }
          } catch (teamErr) {
            // Non-fatal — user will land on dashboard without team (can create later)
            console.warn('Agency auto-setup:', teamErr?.message);
          }

          navigate('/dashboard', { replace: true });
          return;
        }

        if (error) {
          console.error('Session error:', error);
        }

        if (attempts < maxAttempts) {
          setTimeout(tryGetSession, 500);
        } else {
          setStatus('Login failed. Redirecting...');
          setTimeout(() => navigate('/login', { replace: true }), 1500);
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (attempts < maxAttempts) {
          setTimeout(tryGetSession, 500);
        } else {
          navigate('/login', { replace: true });
        }
      }
    };

    tryGetSession();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        width: 44,
        height: 44,
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 20
      }} />
      <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500, margin: 0 }}>
        {status}
      </p>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
        Completing your sign in...
      </p>
    </div>
  );
}
