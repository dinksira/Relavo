import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, Lock, ArrowRight, Sparkles, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import LazyVideo from '../components/ui/LazyVideo';
import { authAPI } from '../services/api';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

const AUTH_VIDEO_URL = "https://res.cloudinary.com/dpiaomto6/video/upload/q_auto,f_auto,so_0,w_1280/v1777448222/BGAUTH_ncn5f9.mp4";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useAuthStore(state => state.setAuth);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Failed to initialize Google login.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.login(email, password);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden bg-grid-white">
      <LazyVideo 
        src={AUTH_VIDEO_URL} 
        opacity="opacity-30"
        mixBlendMode="overlay"
      />
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse-soft" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Marketing Content */}
        <div className="hidden lg:block space-y-12">
          <div className="reveal">
            <Link to="/">
              <Logo className="h-8 brightness-0 invert" />
            </Link>
          </div>
          
          <div className="space-y-6 reveal" style={{ transitionDelay: '100ms' }}>
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
              The <span className="text-blue-500">Intelligence</span> <br />
              Layer for Modern <br />
              Agencies.
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-[480px]">
              Relavo monitors 12+ health signals to detect at-risk clients before they churn. It's the early warning system your business needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] space-y-3 group hover:border-blue-500/50 transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <Globe size={20} />
              </div>
              <h4 className="font-bold text-white">Global Integration</h4>
              <p className="text-sm text-slate-500 font-medium">Connect your existing stack in minutes.</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] space-y-3 group hover:border-blue-500/50 transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-white">Enterprise Security</h4>
              <p className="text-sm text-slate-500 font-medium">Bank-grade encryption for your data.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500 text-sm font-bold reveal" style={{ transitionDelay: '300ms' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-800" />
              ))}
            </div>
            <span>Joined by 200+ agency owners</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center lg:justify-end reveal" style={{ transitionDelay: '150ms' }}>
          <div className="w-full max-w-[480px] bg-white rounded-[40px] p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            {/* Top Bar for Mobile */}
            <div className="lg:hidden mb-10">
              <Logo className="h-6" />
            </div>

            <div className="space-y-2 mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back.</h2>
              <p className="text-slate-500 font-medium">Protected by Relavo Intelligence Layer.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Work Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="name@agency.com"
                    className="input-base !pl-12 !h-14 !bg-slate-50 !border-slate-100 hover:!border-slate-200 focus:!border-blue-500 focus:!bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Security Key
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-[11px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600">Forgot Code?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="input-base !pl-12 !h-14 !bg-slate-50 !border-slate-100 hover:!border-slate-200 focus:!border-blue-500 focus:!bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                  <span className="font-bold text-sm leading-relaxed">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                     </svg>
                     Initializing...
                  </div>
                ) : (
                  <>Access Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-white px-4 text-slate-400">Trusted Authentication</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="mt-6 w-full h-14 bg-white border border-slate-100 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm text-slate-900 transition-all hover:bg-slate-50 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
   
            <p className="mt-10 text-center text-sm font-medium text-slate-500">
              New to the platform?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700">
                Join the waitlist
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="absolute bottom-8 left-0 right-0 px-12 hidden lg:flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pointer-events-none opacity-50">
        <span>&copy; 2026 relavo technologies inc.</span>
        <div className="flex gap-8 pointer-events-auto">
          <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-white transition-colors">Service Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
