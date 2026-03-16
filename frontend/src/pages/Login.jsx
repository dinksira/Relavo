import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, Lock, ArrowRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import heroImg from '../assets/images/hero.png';

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
      <div className="w-full lg:w-[550px] flex flex-col p-8 md:p-16 xl:p-24 relative z-10 bg-white">
        <div className="mb-auto">
          <Link to="/">
            <Logo className="h-8" />
          </Link>
        </div>

        <div className="max-w-[400px] w-full mx-auto my-20">
          <div className="space-y-3 mb-10">
            <h1 className="text-4xl font-black text-relavo-navy tracking-tight">Welcome back.</h1>
            <p className="text-relavo-text-secondary font-medium">Enter your credentials to access your agency dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest ml-1">
                Agency Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-black text-relavo-blue uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-premium w-full py-4 text-lg mt-4 shadow-xl shadow-relavo-blue/20">
              Sign in to Dashboard <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-relavo-text-secondary">
            New to Relavo?{' '}
            <Link to="/register" className="text-relavo-blue font-bold hover:underline">
              Create an agency account
            </Link>
          </p>
        </div>

        <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-relavo-text-muted uppercase tracking-widest">
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
            <img 
               src={heroImg} 
               alt="Abstract pulses" 
               className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-relavo-navy via-relavo-navy/80 to-relavo-blueDark/50" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
               <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 flex items-center justify-center text-white shadow-2xl">
                  <Sparkles size={40} className="text-relavo-blue" />
               </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                    Intelligence <br />
                    <span className="text-relavo-blue">Informed</span> by <br />
                    Client Data.
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed">
                    Join 200+ agencies using Relavo to detect silent churn and protect their recurring revenue.
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

               <div className="pt-10 flex items-center gap-4">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-relavo-navy bg-slate-700" />
                     ))}
                  </div>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Trusted by Enterprise Teams</p>
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
