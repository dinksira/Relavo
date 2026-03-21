import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, Lock, ArrowRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import bgVideo from '../assets/BGAUTH.mp4';
import { authAPI } from '../services/api';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

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
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left side: Form */}
      <div className="w-full lg:w-[550px] flex flex-col p-8 md:p-12 relative z-10 bg-white shadow-2xl">
        <div className="mb-4">
          <Link to="/">
            <Logo className="h-7" />
          </Link>
        </div>
 
        <div className="max-w-[380px] w-full mx-auto my-auto py-6">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-black text-relavo-navy tracking-tight">Welcome back.</h1>
            <p className="text-relavo-text-secondary text-sm font-medium">Enter your credentials to access your agency dashboard.</p>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Agency Email
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-relavo-blue uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
 
            {error && (
              <p className="text-[#dc2626] text-xs font-bold py-3 px-4 bg-red-50 rounded-xl border border-red-100/50">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium w-full py-4 text-base mt-2 shadow-2xl shadow-relavo-blue/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   Signing in...
                </div>
              ) : (
                <>Sign in to Dashboard <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          <div className="mt-8 mb-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-white px-4 text-slate-300">Or continue with</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 font-bold text-sm text-relavo-navy hover:bg-slate-50 hover:border-slate-200 transition-all group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
 
          <p className="mt-8 text-center text-xs font-medium text-relavo-text-secondary">
            New to Relavo?{' '}
            <Link to="/register" className="text-relavo-blue font-bold hover:underline">
              Create an agency account
            </Link>
          </p>
        </div>
 
        <div className="mt-4 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-relavo-text-muted uppercase tracking-widest">
          <span>&copy; 2026 relavo inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-relavo-navy">Privacy</a>
            <a href="#" className="hover:text-relavo-navy">Terms</a>
          </div>
        </div>
      </div>

      {/* Right side: Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-relavo-navy relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 z-0">
            <video 
               autoPlay 
               loop 
               muted 
               playsInline
               className="w-full h-full object-cover opacity-60"
            >
               <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-relavo-navy via-relavo-navy/60 to-transparent" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
                <div className="mb-10">
                   <Logo className="h-12 brightness-0 invert" showText={false} />
                </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                    Intelligence <br />
                    <span className="text-relavo-blue">Informed</span> by <br />
                    Client Data.
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed">
                    Join the waitlist of 200+ agencies choosing Relavo to detect silent churn and protect their recurring revenue.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Globe className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Global Sync</p>
                     <p className="text-lg font-bold text-white tracking-tight">50+ Tools</p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <ShieldCheck className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Security</p>
                     <p className="text-lg font-bold text-white tracking-tight">SSO Ready</p>
                  </div>
               </div>

            </div>
         </div>

         {/* Decorative pulse circles */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse-soft" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-pulse-soft opacity-50" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default Login;
