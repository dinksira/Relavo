import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { User, Mail, Lock, ArrowRight, Zap, Target, Rocket } from 'lucide-react';
import bgVideo from '../assets/BGAUTH.mp4';
import { authAPI } from '../services/api';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleGoogleSignup = async () => {
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
      setError(err.message || "Failed to initialize Google signup.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register(formData.email, formData.password, formData.name);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Check your details or use another email.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left side: Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-relavo-navy relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 z-0">
            <video 
               autoPlay 
               loop 
               muted 
               playsInline
               className="w-full h-full object-cover opacity-60 scale-x-[-1]"
            >
               <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-bl from-relavo-navy via-relavo-navy/60 to-transparent" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
                <div className="mb-10">
                   <Logo className="h-12 brightness-0 invert" showText={false} />
                </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                    Scale your agency <br />
                    <span className="text-relavo-blue">without</span> the <br />
                    churn anxiety.
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed">
                    The only health monitoring platform built specifically for high-growth service businesses.
                  </p>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Zap className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Rapid Launch</p>
                     <p className="text-lg font-bold text-white tracking-tight">5 Min Setup</p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Target className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">AI Detection</p>
                     <p className="text-lg font-bold text-white tracking-tight">Precision Scoring</p>
                  </div>
                </div>
            </div>
         </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-[580px] flex flex-col p-8 md:p-12 relative z-10 bg-white shadow-2xl">
        <div className="mb-4 flex justify-between items-center">
          <Link to="/">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-relavo-blue animate-pulse" />
            <p className="text-[9px] font-black text-relavo-navy/40 uppercase tracking-[0.2em]">Live Waitlist</p>
          </div>
        </div>

        <div className="max-w-[400px] w-full mx-auto my-auto py-2">
          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-black text-relavo-navy tracking-tight">Start for free.</h1>
            <p className="text-relavo-text-secondary text-sm font-medium">Join the waitlist of 200+ agencies and get first access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Agency Name
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <input
                  name="agency"
                  type="text"
                  required
                  placeholder="e.g. Flux Labs"
                  className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.agency}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="At least 12 characters"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
               <input type="checkbox" required className="accent-relavo-blue cursor-pointer h-4 w-4" />
               <p className="text-[10px] text-relavo-text-secondary font-medium leading-tight">
                  I agree to the <a href="#" className="text-relavo-blue font-black">Terms</a> and acknowledge the <a href="#" className="text-relavo-blue font-black">Privacy Policy</a>.
               </p>
            </div>

            {error && (
              <p className="text-[#dc2626] text-xs font-bold py-3 px-4 bg-red-50 rounded-xl border border-red-100/50">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium w-full py-4 text-base mt-2 shadow-2xl shadow-relavo-blue/10 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   Creating Account...
                </div>
              ) : (
                <>Create Agency Space <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" /></>
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
            onClick={handleGoogleSignup}
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
            Already have an account?{' '}
            <Link to="/login" className="text-relavo-blue font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-relavo-text-muted uppercase tracking-widest">
          <span>&copy; 2026 relavo inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-relavo-navy">Contact</a>
            <a href="#" className="hover:text-relavo-navy">API</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
