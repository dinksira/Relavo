import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, Lock, ArrowRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import bgVideo from '../assets/BGAUTH.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate('/dashboard');
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
 
            <button type="submit" className="btn-premium w-full py-4 text-base mt-2 shadow-2xl shadow-relavo-blue/20 flex items-center justify-center gap-3">
              Sign in to Dashboard <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
 
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
