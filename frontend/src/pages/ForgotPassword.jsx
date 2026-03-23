import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import bgVideo from '../assets/BGAUTH.mp4';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left side: Form */}
      <div className="w-full lg:w-[580px] flex flex-col p-8 md:p-12 relative z-10 bg-white shadow-2xl">
        <div className="mb-4">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-navy/40 uppercase tracking-[0.2em] hover:text-blue transition-colors group">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>

        <div className="max-w-[400px] w-full mx-auto my-auto py-2">
          {!isSent ? (
            <>
              <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-black text-navy tracking-tight">Reset Password.</h1>
                <p className="text-text-2 text-sm font-medium">Enter your email and we'll send you a recovery link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em] ml-1">
                    Work Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-blue transition-all rounded-l-xl z-20" />
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue transition-colors z-10" size={17} />
                    <input
                      type="email"
                      required
                      placeholder="name@agency.com"
                      className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-navy"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base mt-2 shadow-2xl shadow-blue/10 flex items-center justify-center gap-2 group/btn">
                  Send Recovery Link <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 animate-reveal">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-navy tracking-tight">Email Sent.</h2>
                <p className="text-text-2 text-sm font-medium">Check your inbox for <b>{email}</b>. We've sent a secure link to reset your password.</p>
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-sm font-bold text-blue hover:underline"
              >
                Didn't receive it? Try another email
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-navy/40 uppercase tracking-[0.2em]">
          <span>&copy; 2026 relavo inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-navy transition-colors">Security</a>
            <a href="#" className="hover:text-navy transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Right side: Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-navy relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 z-0">
            <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="w-full h-full object-cover opacity-60 scale-105"
            >
               <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/60 to-transparent" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
                <div className="mb-10">
                   <Logo className="h-12 brightness-0 invert" showText={false} />
                </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                    Secure <br />
                    <span className="text-blue">Access</span> Monitoring.
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed">
                    Protecting your recurring revenue starts with secure, military-grade account access.
                  </p>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Key className="text-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Security</p>
                     <p className="text-lg font-bold text-white tracking-tight">2FA Ready</p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <ShieldCheck className="text-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Privacy</p>
                     <p className="text-lg font-bold text-white tracking-tight">End-to-End</p>
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

export default ForgotPassword;
