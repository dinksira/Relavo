import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // PRIMARY: Read tokens directly from URL hash (#access_token=...)
        // This is the implicit flow — token is in the URL, not exchanged via code
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (data?.session) {
            // Upsert profile row for OAuth users (first time Google login)
            await supabase.from('profiles').upsert({
              id: data.session.user.id,
              email: data.session.user.email,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
              avatar_url: data.session.user.user_metadata?.avatar_url || ''
            }, { onConflict: 'id' });

            setAuth(data.session.user, data.session.access_token);
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        // FALLBACK: Try getting an already-existing session (email/password logins)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            avatar_url: session.user.user_metadata?.avatar_url || ''
          }, { onConflict: 'id' });

          setAuth(session.user, session.access_token);
          navigate('/dashboard', { replace: true });
          return;
        }

        // Nothing worked — send back to login
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
          Signing you in...
        </p>
      </div>
    </div>
  );
}
